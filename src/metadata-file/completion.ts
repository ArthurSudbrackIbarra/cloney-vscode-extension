import * as vscode from "vscode";
import { metadataFileCompletionItems } from "./items";

// Defines a completion provider for Cloney Metadata files.
export class CloneyMetadataCompletionProvider
  implements vscode.CompletionItemProvider
{
  // Provides completion items for Cloney Metadata files.
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    // Return the completion items defined in the metadata file.
    return metadataFileCompletionItems;
  }

  // Optionally resolves additional information for a selected completion item.
  resolveCompletionItem?(
    item: vscode.CompletionItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem> {
    // Optionally, you can implement additional logic to resolve completion items
    // This method is called when a user selects a completion item from the list
    // You can modify the item here, e.g., add documentation or details.
    return item;
  }
}
