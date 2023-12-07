"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const constants = require("./constants");
const cloney_1 = require("./cloney");
const completion_1 = require("./metadata-file/completion");
const completion_2 = require("./variables-file/completion");
const completion_3 = require("./go-templates/completion");
const fs_1 = require("fs");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function activate(context) {
    console.log("Cloney extension activated.");
    // Check if Cloney is installed.
    const cloneyVersion = (0, cloney_1.getCloneyVersion)();
    if (!cloneyVersion) {
        const response = await vscode.window.showErrorMessage("It looks like you do not have Cloney 1.0.0 or above installed. Install it to make full use of this extension.", "Install Cloney", "Dismiss");
        if (response === "Install Cloney") {
            vscode.env.openExternal(vscode.Uri.parse(constants.INSTALL_CLONEY_URL));
        }
    }
    // Completion providers.
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants.CLONEY_METADATA_FILE_LANGUAGE_ID, new completion_1.CloneyMetadataCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(constants.CLONEY_VARIABLES_FILE_LANGUAGE_ID, new completion_2.CloneyVariablesCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("*", new completion_3.CloneyGoTemplatesCompletionProvider()));
    // Commands.
    // Open Documentation.
    context.subscriptions.push(vscode.commands.registerCommand(constants.OPEN_DOCUMENTATION_COMMAND, () => {
        vscode.env.openExternal(vscode.Uri.parse(constants.CLONEY_DOCUMENTATION_URL));
    }));
    // Clone.
    context.subscriptions.push(vscode.commands.registerCommand(constants.CLONE_COMMAND, async () => {
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
        // Run the command.
        (0, cloney_1.runCloneyDryRunCommand)({
            workDir,
            variables: variablesFile?.[0].fsPath,
            hotReload: hotReload === "Yes",
        });
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