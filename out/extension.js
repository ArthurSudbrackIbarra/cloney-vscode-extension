"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const constants = require("./constants");
const cloney_1 = require("./cloney");
const docker_1 = require("./docker");
const vscode_1 = require("./vscode");
const completion_1 = require("./metadata-file/completion");
const hover_1 = require("./metadata-file/hover");
const completion_2 = require("./variables-file/completion");
const hover_2 = require("./variables-file/hover");
const completion_3 = require("./go-templates/completion");
const fs_1 = require("fs");
const path_1 = require("path");
// Function to check if Cloney is installed and if the version is compatible with the extension.
function isCloneySetUp() {
    // Check if Cloney is installed.
    const cloneyVersion = (0, cloney_1.getCloneyVersion)();
    if (!cloneyVersion) {
        vscode.window
            .showErrorMessage("It appears that you do not have Cloney installed. Install Cloney or install Docker to make full use of this extension.", "Install Cloney", "Configure Executable Path", "Dismiss")
            .then((response) => {
            if (response === "Install Cloney") {
                vscode.env.openExternal(vscode.Uri.parse(constants.INSTALL_CLONEY_URL));
            }
            else if (response === "Configure Executable Path") {
                vscode.commands.executeCommand("workbench.action.openSettings", constants.EXTENSION_SETTINGS.cloneyExecutablePath);
            }
        });
        return false;
    }
    // Check if Cloney is compatible.
    const isVersionCompatible = (0, cloney_1.isCloneyVersionCompatible)(cloneyVersion, constants.COMPATIBLE_CLONEY_MAJOR_VERSION);
    if (!isVersionCompatible) {
        vscode.window
            .showWarningMessage(`It appears that you have Cloney "${cloneyVersion}" installed. This extension is designed to work with Cloney in versions "${constants.COMPATIBLE_CLONEY_MAJOR_VERSION}.x.x". It is *highly* recommended that you install the proper version of Cloney.`, "Install Cloney", "Dismiss")
            .then((response) => {
            if (response === "Install Cloney") {
                vscode.env.openExternal(vscode.Uri.parse(constants.INSTALL_CLONEY_URL));
            }
        });
    }
    return true;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function activate(context) {
    console.log("Cloney extension activated.");
    // Completion providers.
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants.CLONEY_METADATA_FILE_LANGUAGE_ID, new completion_1.CloneyMetadataCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants.CLONEY_VARIABLES_FILE_LANGUAGE_ID, new completion_2.CloneyVariablesCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("*", new completion_3.CloneyGoTemplatesCompletionProvider()));
    // Hover providers.
    context.subscriptions.push(vscode.languages.registerHoverProvider(constants.CLONEY_METADATA_FILE_LANGUAGE_ID, new hover_1.CloneyMetadataHoverProvider()));
    context.subscriptions.push(vscode.languages.registerHoverProvider(constants.CLONEY_VARIABLES_FILE_LANGUAGE_ID, new hover_2.CloneyVariablesHoverProvider()));
    // Eventual pop-up asking for a star on GitHub.
    // The pop-up will appear once every 60 days.
    const stopRemindingToStar = context.globalState.get(constants.GLOBAL_STATE_KEYS.stopRemindingToStar);
    if (!stopRemindingToStar) {
        const lastStarPopUpTime = context.globalState.get(constants.GLOBAL_STATE_KEYS.lastStarPopUpTime);
        const currentTime = new Date().getTime();
        const sixtyDays = 1000 * 60 * 60 * 24 * 60;
        if (!lastStarPopUpTime || currentTime - lastStarPopUpTime >= sixtyDays) {
            vscode.window
                .showInformationMessage(`Thank you for using the Cloney extension! If you find it helpful, consider giving us a star on GitHub. Your support is very much appreciated!`, "Star on GitHub ⭐", "Stop Reminding", "Dismiss")
                .then((response) => {
                if (response === "Star on GitHub ⭐") {
                    vscode.env.openExternal(vscode.Uri.parse(constants.CLONEY_GITHUB_URL));
                }
                else if (response === "Stop Reminding") {
                    // If the user chooses to stop reminding, update the global state.
                    // This will prevent the pop-up from appearing again.
                    context.globalState.update(constants.GLOBAL_STATE_KEYS.stopRemindingToStar, true);
                }
            });
            // Update the last pop-up time.
            context.globalState.update(constants.GLOBAL_STATE_KEYS.lastStarPopUpTime, currentTime);
        }
    }
    // Commands.
    // Open Documentation.
    context.subscriptions.push(vscode.commands.registerCommand(constants.OPEN_DOCUMENTATION_COMMAND, () => {
        vscode.env.openExternal(vscode.Uri.parse(constants.CLONEY_DOCUMENTATION_URL));
    }));
    // Start.
    context.subscriptions.push(vscode.commands.registerCommand(constants.START_COMMAND, () => {
        cloneyStart(false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(constants.DOCKER_START_COMMAND, () => {
        cloneyStart(true);
    }));
    // Clone.
    context.subscriptions.push(vscode.commands.registerCommand(constants.CLONE_COMMAND, () => {
        cloneyClone(false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(constants.DOCKER_CLONE_COMMAND, () => {
        cloneyClone(true);
    }));
    // Dry Run.
    context.subscriptions.push(vscode.commands.registerCommand(constants.DRY_RUN_COMMAND, () => {
        cloneyDryRun(false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(constants.DOCKER_DRY_RUN_COMMAND, () => {
        cloneyDryRun(true);
    }));
    // Validate.
    context.subscriptions.push(vscode.commands.registerCommand(constants.VALIDATE_COMMAND, () => {
        cloneyValidate(false);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(constants.DOCKER_VALIDATE_COMMAND, () => {
        cloneyValidate(true);
    }));
    // Show/Hide Commands.
    vscode.commands.executeCommand("setContext", constants.CONTEXT_SETTINGS.showCloneyCommands, true);
    vscode.commands.executeCommand("setContext", constants.CONTEXT_SETTINGS.showCloneyDockerCommands, true);
    // If the user does NOT have Docker installed, hide the Docker commands.
    const dockerInstalled = (0, docker_1.isDockerInstalled)();
    if (!dockerInstalled) {
        vscode.commands.executeCommand("setContext", constants.CONTEXT_SETTINGS.showCloneyDockerCommands, false);
        return;
    }
    // If the user has Docker installed and Cloney is NOT installed, hide the Cloney commands.
    const cloneyInstalled = (0, cloney_1.isCloneyInstalled)();
    if (!cloneyInstalled && dockerInstalled) {
        vscode.commands.executeCommand("setContext", constants.CONTEXT_SETTINGS.showCloneyCommands, false);
    }
}
exports.activate = activate;
// Cloney Start.
async function cloneyStart(isDocker) {
    // Do not run this command if Cloney is not set up and not running with Docker.
    if (!isDocker && !isCloneySetUp()) {
        return;
    }
    // Do not run this command if running with Docker and Docker is not installed.
    if (isDocker && !(0, docker_1.isDockerInstalled)()) {
        return;
    }
    // Workspace folder.
    let workspaceFolder = "";
    try {
        workspaceFolder = (0, vscode_1.getWorkspaceFolderPath)();
    }
    catch (error) {
        vscode.window.showErrorMessage("Cloney start failed. Please open a folder first.");
        return;
    }
    // If the current directory is not the workspace folder, ask the user if they want
    // to run the command in the current directory or in the workspace folder.
    let currentDirectory = "";
    try {
        currentDirectory = (0, vscode_1.getCurrentFileDirectory)();
    }
    catch (error) { }
    const workspaceRootOption = `Workspace Root (${(0, path_1.basename)(workspaceFolder)})`;
    let runFromWorkspaceRoot;
    if (currentDirectory && currentDirectory !== workspaceFolder) {
        runFromWorkspaceRoot = await vscode.window.showQuickPick([
            workspaceRootOption,
            `Current Directory (${(0, path_1.basename)(currentDirectory)})`,
        ], {
            title: "Where to Create the Project?",
            placeHolder: "Would you like to create the project in the workspace root or in the current directory?",
            ignoreFocusOut: true,
        });
        if (!runFromWorkspaceRoot) {
            return;
        }
    }
    // Name.
    const name = await vscode.window.showInputBox({
        title: "Template Repository Name",
        prompt: "Enter the name of the template repository",
        placeHolder: "my-cloney-template",
        ignoreFocusOut: true,
    });
    if (!name) {
        return;
    }
    // Description.
    const description = await vscode.window.showInputBox({
        title: "Template Repository Description",
        prompt: "Enter the description of the template repository",
        placeHolder: "My Cloney Template",
        ignoreFocusOut: true,
    });
    if (!description) {
        return;
    }
    // Authors.
    const authorsStr = await vscode.window.showInputBox({
        title: "Template Repository Authors",
        prompt: "Enter the authors of the template repository (comma-separated)",
        placeHolder: "John Doe, Michael Doe",
        ignoreFocusOut: true,
    });
    if (!authorsStr) {
        return;
    }
    const authors = authorsStr.split(",").map((author) => author.trim());
    // License.
    const license = await vscode.window.showInputBox({
        title: "Template Repository License",
        prompt: "Enter the license of the template repository",
        placeHolder: "MIT",
        value: "MIT",
        ignoreFocusOut: true,
    });
    if (!license) {
        return;
    }
    // Run the command.
    if (!isDocker) {
        (0, cloney_1.runCloneyStartCommand)({
            workDir: !runFromWorkspaceRoot || runFromWorkspaceRoot === workspaceRootOption
                ? workspaceFolder
                : currentDirectory,
            authors,
            description,
            license,
            name,
            outputDirName: name,
        });
    }
    else {
        (0, docker_1.runDockerCloneyStartCommand)({
            workDir: !runFromWorkspaceRoot || runFromWorkspaceRoot === workspaceRootOption
                ? workspaceFolder
                : currentDirectory,
            authors,
            description,
            license,
            name,
            outputDirName: name,
        });
    }
}
// Cloney Clone.
async function cloneyClone(isDocker) {
    // Do not run this command if Cloney is not set up and not running with Docker.
    if (!isDocker && !isCloneySetUp()) {
        return;
    }
    // Do not run this command if running with Docker and Docker is not installed.
    if (isDocker && !(0, docker_1.isDockerInstalled)()) {
        return;
    }
    // Workspace folder.
    let workspaceFolder = "";
    try {
        workspaceFolder = (0, vscode_1.getWorkspaceFolderPath)();
    }
    catch (error) {
        vscode.window.showErrorMessage("Cloney clone failed. Please open a folder first.");
        return;
    }
    // Template repository.
    const repoURL = await vscode.window.showInputBox({
        title: "Cloney Template Repository URL",
        prompt: "Enter the Cloney template repository URL",
        placeHolder: "https://github.com/username/repository.git",
        ignoreFocusOut: true,
    });
    if (!repoURL) {
        return;
    }
    const branchTagOption = await vscode.window.showQuickPick(["Refence by Branch", "Reference by Tag"], {
        title: "Cloney Template Repository Version",
        placeHolder: "Select the repository version",
        ignoreFocusOut: true,
    });
    if (!branchTagOption) {
        return;
    }
    let repoBranch;
    let repoTag;
    if (branchTagOption === "Refence by Branch") {
        repoBranch = await vscode.window.showInputBox({
            title: "Cloney Template Repository Branch",
            prompt: "Enter the Cloney template repository branch",
            value: "main",
            placeHolder: "main",
            ignoreFocusOut: true,
        });
        if (!repoBranch) {
            return;
        }
    }
    else {
        repoTag = await vscode.window.showInputBox({
            title: "Cloney Template Repository Tag",
            prompt: "Enter the Cloney template repository tag",
            placeHolder: "1.0.0",
            ignoreFocusOut: true,
        });
        if (!repoTag) {
            return;
        }
    }
    // Output directory.
    const outputDirName = await vscode.window.showInputBox({
        title: "Target Directory Name",
        prompt: "Enter the target directory, where the template will be cloned",
        placeHolder: "clone-output",
        ignoreFocusOut: true,
    });
    if (!outputDirName) {
        return;
    }
    // Variables file.
    const shouldSelectVariablesFile = await vscode.window.showQuickPick(["Yes", "No"], {
        title: "Variables File",
        placeHolder: "Would you like to select a variables file?",
        ignoreFocusOut: true,
    });
    if (!shouldSelectVariablesFile) {
        return;
    }
    let variablesFile;
    if (shouldSelectVariablesFile === "Yes") {
        variablesFile = await vscode.window.showOpenDialog({
            title: "Variables File",
            defaultUri: vscode.Uri.file(`${workspaceFolder}/${constants.CLONEY_VARIABLES_FILE_NAME}`),
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                "Cloney Variables File": ["yaml", "yml"],
            },
            openLabel: "Select Variables File",
        });
        if (!variablesFile) {
            return;
        }
    }
    // Run the command.
    if (!isDocker) {
        (0, cloney_1.runCloneyCloneCommand)({
            workDir: workspaceFolder,
            repoURL,
            repoBranch,
            repoTag,
            outputDirName,
            variables: variablesFile?.[0].fsPath,
        });
    }
    else {
        (0, docker_1.runDockerCloneyCloneCommand)({
            workDir: workspaceFolder,
            repoURL,
            repoBranch,
            repoTag,
            outputDirName,
            variables: variablesFile?.[0].fsPath,
        });
    }
}
// Cloney Dry-Run.
async function cloneyDryRun(isDocker) {
    // Do not run this command if Cloney is not set up and not running with Docker.
    if (!isDocker && !isCloneySetUp()) {
        return;
    }
    // Do not run this command if running with Docker and Docker is not installed.
    if (isDocker && !(0, docker_1.isDockerInstalled)()) {
        return;
    }
    // Workspace folder.
    let workspaceFolder = "";
    try {
        workspaceFolder = (0, vscode_1.getWorkspaceFolderPath)();
    }
    catch (error) {
        vscode.window.showErrorMessage("Cloney dry-run failed. Please open a folder first.");
        return;
    }
    // Command directory.
    const shouldSelectCommandDirectory = await vscode.window.showQuickPick(["OK", "Select Another Directory"], {
        title: "Directory Selection",
        placeHolder: `The \"cloney dry-run\" command will be run in your workspace directory (${(0, path_1.basename)(workspaceFolder)}). Is this OK or would you like to select another directory?`,
        ignoreFocusOut: true,
    });
    if (!shouldSelectCommandDirectory) {
        return;
    }
    let commandDirectory;
    if (shouldSelectCommandDirectory === "Select Another Directory") {
        commandDirectory = await vscode.window.showOpenDialog({
            title: "Dry-Run Directory",
            defaultUri: vscode.Uri.file(workspaceFolder),
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: "Select Dry-Run Directory",
        });
        if (!commandDirectory) {
            return;
        }
    }
    // Variables file.
    const shouldSelectVariablesFile = await vscode.window.showQuickPick(["Yes", "No"], {
        title: "Variables File",
        placeHolder: "Would you like to select a variables file?",
        ignoreFocusOut: true,
    });
    if (!shouldSelectVariablesFile) {
        return;
    }
    let variablesFile;
    if (shouldSelectVariablesFile === "Yes") {
        variablesFile = await vscode.window.showOpenDialog({
            title: "Variables File",
            defaultUri: vscode.Uri.file(`${commandDirectory ? commandDirectory[0].fsPath : workspaceFolder}/${constants.CLONEY_VARIABLES_FILE_NAME}`),
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                "Cloney Variables File": ["yaml", "yml"],
            },
            openLabel: "Select Variables File",
        });
        if (!variablesFile) {
            return;
        }
    }
    // Hot reload.
    // For some reason, hot reload is not working with Docker.
    // So, we will not ask the user if they want to enable hot reload if running with Docker.
    let hotReload = "No";
    if (!isDocker) {
        hotReload = await vscode.window.showQuickPick(["Yes", "No"], {
            title: "Hot Reload",
            placeHolder: "Would you like to enable hot reload?",
            ignoreFocusOut: true,
        });
        if (!hotReload) {
            return;
        }
    }
    // Run the command.
    if (!isDocker) {
        (0, cloney_1.runCloneyDryRunCommand)({
            workDir: commandDirectory?.[0].fsPath || workspaceFolder,
            variables: variablesFile?.[0].fsPath,
            hotReload: hotReload === "Yes",
        });
    }
    else {
        (0, docker_1.runDockerCloneyDryRunCommand)({
            workDir: commandDirectory?.[0].fsPath || workspaceFolder,
            variables: variablesFile?.[0].fsPath,
            hotReload: hotReload === "Yes",
        });
    }
}
// Cloney Validate.
async function cloneyValidate(isDocker) {
    // Do not run this command if Cloney is not set up and not running with Docker.
    if (!isDocker && !isCloneySetUp()) {
        return;
    }
    // Do not run this command if running with Docker and Docker is not installed.
    if (isDocker && !(0, docker_1.isDockerInstalled)()) {
        return;
    }
    // Workspace folder.
    let workspaceFolder = "";
    try {
        workspaceFolder = (0, vscode_1.getWorkspaceFolderPath)();
    }
    catch (error) {
        vscode.window.showErrorMessage("Cloney start failed. Please open a folder first.");
        return;
    }
    // Command directory.
    const shouldSelectCommandDirectory = await vscode.window.showQuickPick(["OK", "Select Another Directory"], {
        title: "Directory Selection",
        placeHolder: `The \"cloney validate\" command will be run in your workspace directory (${(0, path_1.basename)(workspaceFolder)}). Is this OK or would you like to select another directory?`,
        ignoreFocusOut: true,
    });
    if (!shouldSelectCommandDirectory) {
        return;
    }
    let commandDirectory;
    if (shouldSelectCommandDirectory === "Select Another Directory") {
        commandDirectory = await vscode.window.showOpenDialog({
            title: "Validate Directory",
            defaultUri: vscode.Uri.file(workspaceFolder),
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: "Select Validate Directory",
        });
        if (!commandDirectory) {
            return;
        }
    }
    // Run the command.
    if (!isDocker) {
        (0, cloney_1.runCloneyValidateCommand)(commandDirectory?.[0].fsPath || workspaceFolder);
    }
    else {
        (0, docker_1.runDockerCloneyValidateCommand)(commandDirectory?.[0].fsPath || workspaceFolder);
    }
}
// This method is called when your extension is deactivated
function deactivate() {
    console.log("Cloney extension deactivated.");
    // On deactivation, delete contents of the temp directory.
    try {
        (0, fs_1.rmSync)(constants.CLONEY_EXTENSION_TEMP_DIR, { recursive: true });
    }
    catch (error) { }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map