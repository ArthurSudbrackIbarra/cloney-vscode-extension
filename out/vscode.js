"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminal = exports.getUserSetting = exports.getCurrentFileDirectory = exports.getWorkspaceFolderPath = void 0;
const vscode = require("vscode");
const path_1 = require("path");
// Function to get the workspace folder path.
function getWorkspaceFolderPath() {
    // Get the active workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error("No workspace folder is open.");
    }
    // Get the URI of the first workspace folder (you can loop through multiple folders if needed)
    const workspaceFolderUri = workspaceFolders[0].uri;
    // Get the path of the workspace folder.
    const workspaceFolderPath = workspaceFolderUri.fsPath;
    return workspaceFolderPath;
}
exports.getWorkspaceFolderPath = getWorkspaceFolderPath;
// Function to get the directory path of the file that the user is currently editing.
function getCurrentFileDirectory() {
    // Get the active text editor.
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        throw new Error("No active editor.");
    }
    // Get the URI of the file that the user is currently editing.
    const fileUri = activeEditor.document.uri;
    // Get the directory path of the file.
    const fileDirectory = (0, path_1.dirname)(fileUri.fsPath);
    return fileDirectory;
}
exports.getCurrentFileDirectory = getCurrentFileDirectory;
// Function to get the value of a user setting.
function getUserSetting(settingName) {
    return vscode.workspace.getConfiguration().get(settingName);
}
exports.getUserSetting = getUserSetting;
// Function to create a terminal and run a given command.
function createTerminal(terminalName, command) {
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === terminalName);
    if (!terminal) {
        // If on Windows, create a new terminal with the PowerShell shell.
        // Otherwise, create a new terminal with the default shell.
        terminal = vscode.window.createTerminal(terminalName, process.platform === "win32" ? "powershell.exe" : undefined);
    }
    terminal.sendText(command, true);
    terminal.show();
}
exports.createTerminal = createTerminal;
//# sourceMappingURL=vscode.js.map