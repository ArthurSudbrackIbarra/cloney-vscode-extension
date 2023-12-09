"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyMetadataCompletionProvider = void 0;
const items_1 = require("./items");
// Defines a completion provider for Cloney Metadata files.
class CloneyMetadataCompletionProvider {
    // Provides completion items for Cloney Metadata files.
    provideCompletionItems(document, position, token, context) {
        // Return the completion items defined in the metadata file.
        return items_1.metadataFileCompletionItems;
    }
    // Optionally resolves additional information for a selected completion item.
    resolveCompletionItem(item, token) {
        // Optionally, you can implement additional logic to resolve completion items
        // This method is called when a user selects a completion item from the list
        // You can modify the item here, e.g., add documentation or details.
        return item;
    }
}
exports.CloneyMetadataCompletionProvider = CloneyMetadataCompletionProvider;
//# sourceMappingURL=completion.js.map