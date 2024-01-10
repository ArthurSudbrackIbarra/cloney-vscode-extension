"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyVariablesHoverProvider = void 0;
const vscode = require("vscode");
const path_1 = require("path");
const fs_1 = require("fs");
const completion_1 = require("./completion");
const vscode_1 = require("../vscode");
const constants_1 = require("../constants");
// Defines a completion provider for Cloney Variables.
class CloneyVariablesHoverProvider {
    // Provides a hover for Cloney Variables.
    async provideHover(document, position, token) {
        // Check if the line content is a field, if not, return.
        const lineContent = document.lineAt(position.line).text;
        const fieldRegex = /^([a-z_]+):/;
        const fieldMatch = fieldRegex.exec(lineContent);
        if (!fieldMatch) {
            return undefined;
        }
        // Extract the field name.
        const fieldName = fieldMatch[1];
        // Check if the user has specified a remote Cloney repository
        // Re-use the completion provider to get the completion items.
        const completionProvider = new completion_1.CloneyVariablesCompletionProvider();
        const completionItems = await completionProvider.completionItemsFromRemoteRepository(document);
        if (completionItems.length > 0) {
            // Find the matching completion item.
            const completionItem = completionItems.find((item) => item.label === fieldName);
            if (completionItem) {
                // Return the completion item's documentation as a hover.
                return new vscode.Hover(completionItem.documentation);
            }
        }
        // If the user has not specified a remote Cloney repository,
        // check if the user has a local Cloney metadata file.
        let outOfScopeDirectory = "";
        let currentDirectory = "";
        try {
            outOfScopeDirectory = (0, path_1.join)((0, vscode_1.getWorkspaceFolderPath)(), "..");
            currentDirectory = (0, vscode_1.getCurrentFileDirectory)();
        }
        catch (error) {
            return undefined;
        }
        // Loop through the current directory and all parent directories,
        // until we are no longer in the workspace folder.
        while (currentDirectory !== outOfScopeDirectory) {
            // Check if the current directory contains a Cloney metadata file.
            const metadataFilePath = `${currentDirectory}/${constants_1.CLONEY_METADATA_FILE_NAME}`;
            if ((0, fs_1.existsSync)(metadataFilePath)) {
                // Read the Cloney metadata file and find every variable defined in it.
                const content = (0, fs_1.readFileSync)(metadataFilePath, "utf8");
                // Re-use the completion provider to get the completion items.
                const completionItems = completionProvider.completionItemsFromYAML(content);
                // Find the matching completion item.
                const completionItem = completionItems.find((item) => item.label === fieldName);
                if (completionItem) {
                    // Return the completion item's documentation as a hover.
                    return new vscode.Hover(completionItem.documentation);
                }
                else {
                    return new vscode.Hover(new vscode.MarkdownString(`Undefined Cloney variable: \`${fieldName}\`. In order to use this variable, you need to define it in your Cloney metadata file.`));
                }
            }
            // If no Cloney metadata file was found in the current directory,
            // move up one directory and try again.
            currentDirectory = (0, path_1.join)(currentDirectory, "..");
        }
    }
}
exports.CloneyVariablesHoverProvider = CloneyVariablesHoverProvider;
//# sourceMappingURL=hover.js.map