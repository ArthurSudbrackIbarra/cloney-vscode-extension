"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUserFile = void 0;
const vscode = require("vscode");
const promises_1 = require("fs/promises");
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
//# sourceMappingURL=vscode.js.map