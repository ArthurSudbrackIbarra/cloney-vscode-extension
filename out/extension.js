"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const constants = require("./constants");
const cloney_1 = require("./cloney");
const completion_1 = require("./metadata-file/completion");
const hover_1 = require("./metadata-file/hover");
const completion_2 = require("./variables-file/completion");
const hover_2 = require("./variables-file/hover");
const completion_3 = require("./go-templates/completion");
const fs_1 = require("fs");
// Function to check if Cloney is installed and if the version is compatible with the extension.
function isCloneySetUp() {
    // Check if Cloney is installed.
    const cloneyVersion = (0, cloney_1.getCloneyVersion)();
    if (!cloneyVersion) {
        vscode.window
            .showErrorMessage("It appears that you do not have Cloney installed. Install it to make full use of this extension.", "Install Cloney", "Configure Executable Path", "Dismiss")
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
    // Check if Cloney is installed and the version is compatible with the extension.
    await isCloneySetUp();
    // Completion providers.
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants.CLONEY_METADATA_FILE_LANGUAGE_ID, new completion_1.CloneyMetadataCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants.CLONEY_VARIABLES_FILE_LANGUAGE_ID, new completion_2.CloneyVariablesCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("*", new completion_3.CloneyGoTemplatesCompletionProvider()));
    // Hover providers.
    context.subscriptions.push(vscode.languages.registerHoverProvider(constants.CLONEY_METADATA_FILE_LANGUAGE_ID, new hover_1.CloneyMetadataHoverProvider()));
    context.subscriptions.push(vscode.languages.registerHoverProvider(constants.CLONEY_VARIABLES_FILE_LANGUAGE_ID, new hover_2.CloneyVariablesHoverProvider()));
    // Pop-up asking for a star on GitHub if the user likes the extension.
    // The pop-up will only appear once.
    const globalStateKey = "HAS_CLONEY_EXECUTED";
    const hasExecuted = context.globalState.get(globalStateKey);
    if (!hasExecuted) {
        vscode.window
            .showInformationMessage(`Thanks for installing the Cloney extension! If you enjoy using it, please give us a star on GitHub. Your support is much appreciated!`, "Star on GitHub ⭐", "Dismiss")
            .then((response) => {
            if (response === "Star on GitHub ⭐") {
                vscode.env.openExternal(vscode.Uri.parse(constants.CLONEY_GITHUB_URL));
            }
        });
        context.globalState.update(globalStateKey, true);
    }
    // Commands.
    // Open Documentation.
    context.subscriptions.push(vscode.commands.registerCommand(constants.OPEN_DOCUMENTATION_COMMAND, () => {
        vscode.env.openExternal(vscode.Uri.parse(constants.CLONEY_DOCUMENTATION_URL));
    }));
    // Clone.
    context.subscriptions.push(vscode.commands.registerCommand(constants.CLONE_COMMAND, async () => {
        // Do not run this command if Cloney is not set up.
        if (!isCloneySetUp()) {
            return;
        }
        // Work directory.
        const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workDir) {
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
                defaultUri: vscode.Uri.file(`${workDir}/${constants.CLONEY_VARIABLES_FILE_NAME}`),
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
        (0, cloney_1.runCloneyCloneCommand)({
            workDir,
            repoURL,
            repoBranch,
            repoTag,
            outputDirName,
            variables: variablesFile?.[0].fsPath,
        });
    }));
    // Dry Run.
    context.subscriptions.push(vscode.commands.registerCommand(constants.DRY_RUN_COMMAND, async () => {
        // Do not run this command if Cloney is not set up.
        if (!isCloneySetUp()) {
            return;
        }
        // Work directory.
        const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workDir) {
            vscode.window.showErrorMessage("Cloney dry-run failed. Please open a folder first.");
            return;
        }
        const shouldSelectVariablesFile = await vscode.window.showQuickPick(["Yes", "No"], {
            title: "Variables File",
            placeHolder: "Would you like to select a variables file?",
            ignoreFocusOut: true,
        });
        if (!shouldSelectVariablesFile) {
            return;
        }
        // Variables file.
        let variablesFile;
        if (shouldSelectVariablesFile === "Yes") {
            variablesFile = await vscode.window.showOpenDialog({
                title: "Variables File",
                defaultUri: vscode.Uri.file(`${workDir}/${constants.CLONEY_VARIABLES_FILE_NAME}`),
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
        const hotReload = await vscode.window.showQuickPick(["Yes", "No"], {
            title: "Hot Reload",
            placeHolder: "Would you like to enable hot reload?",
            ignoreFocusOut: true,
        });
        if (!hotReload) {
            return;
        }
        // Run the command.
        (0, cloney_1.runCloneyDryRunCommand)({
            workDir,
            variables: variablesFile?.[0].fsPath,
            hotReload: hotReload === "Yes",
        });
    }));
    // Validate.
    context.subscriptions.push(vscode.commands.registerCommand(constants.VALIDATE_COMMAND, async () => {
        // Do not run this command if Cloney is not set up.
        if (!isCloneySetUp()) {
            return;
        }
        // Work directory.
        const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workDir) {
            vscode.window.showErrorMessage("Cloney validate failed. Please open a folder first.");
            return;
        }
        // Run the command.
        (0, cloney_1.runCloneyValidateCommand)(workDir);
    }));
}
exports.activate = activate;
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