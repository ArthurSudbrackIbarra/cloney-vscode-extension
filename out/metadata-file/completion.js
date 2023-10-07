"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyMetadataCompletionProvider = void 0;
const constants_1 = require("./constants");
class CloneyMetadataCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        return constants_1.metadataFileCompletionItems;
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