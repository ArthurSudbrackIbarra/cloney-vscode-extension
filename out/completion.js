"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyMetadataCompletionProvider = void 0;
const vscode = require("vscode");
class CloneyMetadataCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        // Implement your code completion logic here
        const manifestVersionItem = new vscode.CompletionItem("manifest_version", vscode.CompletionItemKind.Keyword);
        manifestVersionItem.detail =
            "The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.";
        manifestVersionItem.insertText = new vscode.SnippetString("manifest_version: ${1:1}");
        manifestVersionItem.documentation = new vscode.MarkdownString("The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.");
        // Example: Provide completion items for a list of keywords
        const completionItems = [manifestVersionItem];
        return completionItems;
    }
    resolveCompletionItem(item, token) {
        // Optionally, you can implement additional logic to resolve completion items
        // This method is called when a user selects a completion item from the list
        // You can modify the item here, e.g., add documentation or details
        return item;
    }
}
exports.CloneyMetadataCompletionProvider = CloneyMetadataCompletionProvider;
//# sourceMappingURL=completion.js.map