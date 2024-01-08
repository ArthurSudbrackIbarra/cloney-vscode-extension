"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminal = exports.getUserSetting = exports.readUserFile = void 0;
const vscode = require("vscode");
const promises_1 = require("fs/promises");
// Function to read a file from the user's workspace.
async function readUserFile(fileName) {
    // Get the active workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error("No workspace folder is open.");
    }
    // Get the URI of the first workspace folder (you can loop through multiple folders if needed)
    const workspaceFolderUri = workspaceFolders[0].uri;
    // Formulate the complete file path by joining the workspace folder URI and the file name
    const filePath = vscode.Uri.joinPath(workspaceFolderUri, fileName);
    try {
        // Read the file using fs.promises.readFile
        const fileContent = await (0, promises_1.readFile)(filePath.fsPath, "utf-8");
        return fileContent;
    }
    catch (error) {
        throw error;
    }
}
exports.readUserFile = readUserFile;
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