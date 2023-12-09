import * as vscode from "vscode";
import { getItemByFieldName } from "./items";

// Defines a hover provider for Cloney Metadata files.
export class CloneyMetadataHoverProvider implements vscode.HoverProvider {
  // Provides a hover for Cloney Metadata files.
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // Check if the line content is a field, if not, return.
    const lineContent = document.lineAt(position.line).text;
    const fieldRegex = /^[\s\t]*-?[\s\t]*([a-z_]+):/;
    const fieldMatch = fieldRegex.exec(lineContent);
    if (!fieldMatch) {
      return undefined;
    }

    // Check if the field is a nested field of 'variables' or 'configuration'.
    // Fields inside the 'variables' property can have the same name as root-level fields.
    // Therefore, we need to check which one is being hovered.
    const fieldName = fieldMatch[1];
    const nestedFieldRegex = /^[\s\t]+-?[\s\t]*([a-z_]+):/;
    let isVariablesNested = false;
    const nestedVariablesFields = ["name", "description", "default", "example"];
    let isConfigurationNested = false;
    const nestedConfigurationFields = ["ignore_paths"];
    if (nestedVariablesFields.includes(fieldName)) {
      // Search in previous lines for the 'variables' field.
      let skipLineSearch = false;
      if (!nestedFieldRegex.exec(lineContent)) {
        isVariablesNested = false;
        skipLineSearch = true;
      }
      if (!skipLineSearch) {
        for (let i = position.line; i >= 0; i--) {
          const lineContent = document.lineAt(i).text;
          if (lineContent.startsWith("variables:")) {
            isVariablesNested = true;
            break;
          }
        }
      }
    } else if (nestedConfigurationFields.includes(fieldName)) {
      // Search in previous lines for the 'configuration' field.
      let skipLineSearch = false;
      if (!nestedFieldRegex.exec(lineContent)) {
        isConfigurationNested = false;
        skipLineSearch = true;
      }
      if (!skipLineSearch) {
        for (let i = position.line; i >= 0; i--) {
          const lineContent = document.lineAt(i).text;
          if (lineContent.startsWith("configuration:")) {
            isConfigurationNested = true;
            break;
          }
        }
      }
    }

    // ! KNOWN ISSUE: Properties inside variables.default (map) and variables.example (map) will be considered
    // as a nested field of 'variables'. This is because the regex used to check if a field is nested
    // is not able to differentiate between a nested field and a map property.

    // Get the completion item for the field.
    let completionItemName = fieldName;
    if (isVariablesNested) {
      completionItemName = `variable.${fieldName}`;
    } else if (isConfigurationNested) {
      completionItemName = `configuration.${fieldName}`;
    }
    const completionItem = getItemByFieldName(completionItemName);

    // If the completion item is not found, return.
    if (!completionItem) {
      return undefined;
    }

    // Return the hover.
    return new vscode.Hover(
      completionItem.documentation as vscode.MarkdownString
    );
  }
}
