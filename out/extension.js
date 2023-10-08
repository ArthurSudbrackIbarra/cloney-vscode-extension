"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const cloney_1 = require("./cloney");
const completion_1 = require("./metadata-file/completion");
const completion_2 = require("./variables-file/completion");
// Extension commands.
const CLONE_COMMAND = "cloney.clone";
const DRY_RUN_COMMAND = "cloney.dry-run";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function activate(context) {
    console.log("Cloney extension activated.");
    // Check if Cloney is installed.
    if (!(0, cloney_1.isCloneyInstalled)()) {
        const response = await vscode.window.showErrorMessage("It looks like you do not have Cloney installed. Install it to make full use of this extension.", "Install Cloney", "Dismiss");
        if (response === "Install Cloney") {
            vscode.env.openExternal(vscode.Uri.parse("https://arthursudbrackibarra.github.io/cloney-documentation/getting-started/#installing-cloney"));
        }
    }
    // Completion providers.
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("cloney-metadata-file", new completion_1.CloneyMetadataCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("cloney-variables-file", new completion_2.CloneyVariablesCompletionProvider()));
    // Commands.
    context.subscriptions.push(vscode.commands.registerCommand(CLONE_COMMAND, async () => {
        const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workDir) {
            vscode.window.showErrorMessage("Cloney clone failed. Please open a folder first.");
            return;
        }
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
        const outputDirName = await vscode.window.showInputBox({
            title: "Target Directory Name",
            prompt: "Enter the target directory, where the template will be cloned",
            placeHolder: "clone-output",
            ignoreFocusOut: true,
        });
        if (!outputDirName) {
            return;
        }
        (0, cloney_1.runCloneyCloneCommand)(workDir, repoURL, repoBranch, repoTag, outputDirName);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(DRY_RUN_COMMAND, async () => {
        const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workDir) {
            vscode.window.showErrorMessage("Cloney dry-run failed. Please open a folder first.");
            return;
        }
        (0, cloney_1.runCloneyDryRunCommand)(workDir);
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    console.log("Cloney extension deactivated.");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map