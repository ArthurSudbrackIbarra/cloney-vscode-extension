"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyGoTemplatesCompletionProvider = void 0;
const vscode = require("vscode");
const yaml = require("js-yaml");
const path_1 = require("path");
const fs_1 = require("fs");
const vscode_1 = require("../vscode");
const constants_1 = require("../constants");
const items_1 = require("./items");
// Defines a completion provider for Cloney Go Templates.
class CloneyGoTemplatesCompletionProvider {
    // Provides completion items for the Cloney Go Templates.
    async provideCompletionItems(document, position, token, context) {
        // Check if the user has enabled Go Templates suggestions.
        // If not, return an empty array.
        const enableGoTemplatesSuggestions = (0, vscode_1.getUserSetting)(constants_1.EXTENSION_SETTINGS.enableGoTemplatesSuggestions);
        if (!enableGoTemplatesSuggestions) {
            return [];
        }
        let outOfScopeDirectory = "";
        let currentDirectory = "";
        try {
            outOfScopeDirectory = (0, path_1.join)((0, vscode_1.getWorkspaceFolderPath)(), "..");
            currentDirectory = (0, vscode_1.getCurrentFileDirectory)();
        }
        catch (error) {
            return [];
        }
        // Loop through the current directory and all parent directories,
        // until we are no longer in the workspace folder.
        while (currentDirectory !== outOfScopeDirectory) {
            // Check if the current directory contains a Cloney metadata file.
            const metadataFilePath = `${currentDirectory}/${constants_1.CLONEY_METADATA_FILE_NAME}`;
            if ((0, fs_1.existsSync)(metadataFilePath)) {
                // Read the Cloney metadata file and find every variable defined in it.
                const content = (0, fs_1.readFileSync)(metadataFilePath, "utf8");
                return this.completionItemsFromYAML(content);
            }
            // If no Cloney metadata file was found in the current directory,
            // move up one directory and try again.
            currentDirectory = (0, path_1.join)(currentDirectory, "..");
        }
        // If no Cloney metadata file was found, return an empty array.
        return [];
    }
    // Extracts completion items from parsed YAML content.
    completionItemsFromYAML(content) {
        // Parse the YAML content.
        const parsedYAML = yaml.load(content);
        if (!parsedYAML || !parsedYAML.variables) {
            return [];
        }
        // Extract variables from the parsed YAML.
        const variables = parsedYAML.variables;
        const completionItems = [];
        // Create completion items for each variable.
        for (const variable of variables) {
            const variableName = variable.name;
            const variableDescription = variable.description || "No description provided.";
            // Create a completion item for the variable.
            const variableItem = new vscode.CompletionItem(`.${variableName}`, vscode.CompletionItemKind.Variable);
            // Set details.
            let detail = `Cloney - Variable '${variableName}'`;
            if ("default" in variable) {
                detail += " (Optional)";
            }
            else {
                detail += " (Required)";
            }
            variableItem.detail = detail;
            // Set documentation.
            variableItem.documentation = new vscode.MarkdownString(`**Description:**\n${variableDescription}`);
            // Convert default and example fields back to YAML, in order to show them as code blocks.
            const defaultYAML = yaml.dump(variable.default);
            if ("default" in variable) {
                variableItem.documentation.appendMarkdown(`\n\n**Default:**\n\`\`\`yaml\n${defaultYAML}\n\`\`\``);
            }
            const exampleYAML = yaml.dump(variable.example);
            if ("example" in variable) {
                variableItem.documentation.appendMarkdown(`\n\n**Example:**\n\`\`\`yaml\n${exampleYAML}\n\`\`\``);
            }
            // Set insert text (the text inserted when the completion item is accepted).
            variableItem.insertText = new vscode.SnippetString(`.${variableName}`);
            completionItems.push(variableItem);
            // Create a completion item for the variable but including '{{' and '}}'.
            const variableItemWithBraces = new vscode.CompletionItem(`{{ .${variableName} }}`, vscode.CompletionItemKind.Variable);
            variableItemWithBraces.detail = detail + " (With Braces)";
            variableItemWithBraces.documentation = variableItem.documentation;
            variableItemWithBraces.insertText = new vscode.SnippetString(`{{ .${variableName} }}`);
            completionItems.push(variableItemWithBraces);
        }
        // Merge the completion items with the go-template completion items.
        completionItems.push(...items_1.goTemplateCompletionItems);
        return completionItems;
    }
    // Optionally resolves additional information for a selected completion item.
    resolveCompletionItem(item, token) {
        // Optionally, you can implement additional logic to resolve completion items
        // This method is called when a user selects a completion item from the list
        // You can modify the item here, e.g., add documentation or details.
        return item;
    }
}
exports.CloneyGoTemplatesCompletionProvider = CloneyGoTemplatesCompletionProvider;
//# sourceMappingURL=completion.js.map