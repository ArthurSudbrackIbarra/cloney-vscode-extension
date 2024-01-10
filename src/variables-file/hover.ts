import * as vscode from "vscode";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { CloneyVariablesCompletionProvider } from "./completion";
import { getWorkspaceFolderPath, getCurrentFileDirectory } from "../vscode";
import { CLONEY_METADATA_FILE_NAME } from "../constants";

// Defines a completion provider for Cloney Variables.
export class CloneyVariablesHoverProvider implements vscode.HoverProvider {
  // Provides a hover for Cloney Variables.
  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
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
    const completionProvider = new CloneyVariablesCompletionProvider();
    const completionItems =
      await completionProvider.completionItemsFromRemoteRepository(document);
    if (completionItems.length > 0) {
      // Find the matching completion item.
      const completionItem = completionItems.find(
        (item) => item.label === fieldName
      );
      if (completionItem) {
        // Return the completion item's documentation as a hover.
        return new vscode.Hover(
          completionItem.documentation as vscode.MarkdownString
        );
      }
    }

    // If the user has not specified a remote Cloney repository,
    // check if the user has a local Cloney metadata file.
    let outOfScopeDirectory = "";
    let currentDirectory = "";
    try {
      outOfScopeDirectory = join(getWorkspaceFolderPath(), "..");
      currentDirectory = getCurrentFileDirectory();
    } catch (error) {
      return undefined;
    }

    // Loop through the current directory and all parent directories,
    // until we are no longer in the workspace folder.
    while (currentDirectory !== outOfScopeDirectory) {
      // Check if the current directory contains a Cloney metadata file.
      const metadataFilePath = `${currentDirectory}/${CLONEY_METADATA_FILE_NAME}`;
      if (existsSync(metadataFilePath)) {
        // Read the Cloney metadata file and find every variable defined in it.
        const content = readFileSync(metadataFilePath, "utf8");

        // Re-use the completion provider to get the completion items.
        const completionItems =
          completionProvider.completionItemsFromYAML(content);

        // Find the matching completion item.
        const completionItem = completionItems.find(
          (item) => item.label === fieldName
        );
        if (completionItem) {
          // Return the completion item's documentation as a hover.
          return new vscode.Hover(
            completionItem.documentation as vscode.MarkdownString
          );
        } else {
          return new vscode.Hover(
            new vscode.MarkdownString(
              `Undefined Cloney variable: \`${fieldName}\`. In order to use this variable, you need to define it in your Cloney metadata file.`
            )
          );
        }
      }

      // If no Cloney metadata file was found in the current directory,
      // move up one directory and try again.
      currentDirectory = join(currentDirectory, "..");
    }
  }
}
