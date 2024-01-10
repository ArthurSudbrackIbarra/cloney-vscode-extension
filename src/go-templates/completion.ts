import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { getWorkspaceFolderPath, getCurrentFileDirectory } from "../vscode";
import { CLONEY_METADATA_FILE_NAME } from "../constants";
import { goTemplateCompletionItems } from "./items";

// Defines a completion provider for Cloney Go Templates.
export class CloneyGoTemplatesCompletionProvider
  implements vscode.CompletionItemProvider
{
  // Provides completion items for the Cloney Go Templates.
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    let outOfScopeDirectory = "";
    let currentDirectory = "";
    try {
      outOfScopeDirectory = join(getWorkspaceFolderPath(), "..");
      currentDirectory = getCurrentFileDirectory();
    } catch (error) {
      return [];
    }

    // Loop through the current directory and all parent directories,
    // until we are no longer in the workspace folder.
    while (currentDirectory !== outOfScopeDirectory) {
      // Check if the current directory contains a Cloney metadata file.
      const metadataFilePath = `${currentDirectory}/${CLONEY_METADATA_FILE_NAME}`;
      if (existsSync(metadataFilePath)) {
        // Read the Cloney metadata file and find every variable defined in it.
        const content = readFileSync(metadataFilePath, "utf8");
        return this.completionItemsFromYAML(content);
      }

      // If no Cloney metadata file was found in the current directory,
      // move up one directory and try again.
      currentDirectory = join(currentDirectory, "..");
    }

    // If no Cloney metadata file was found, return an empty array.
    return [];
  }

  // Extracts completion items from parsed YAML content.
  private completionItemsFromYAML(content: string): vscode.CompletionItem[] {
    // Parse the YAML content.
    const parsedYAML = yaml.load(content) as any;
    if (!parsedYAML || !parsedYAML.variables) {
      return [];
    }

    // Extract variables from the parsed YAML.
    const variables = parsedYAML.variables as any[];
    const completionItems: vscode.CompletionItem[] = [];

    // Create completion items for each variable.
    for (const variable of variables) {
      const variableName = variable.name as string;
      const variableDescription =
        (variable.description as string) || "No description provided.";

      // Create a completion item for the variable.
      const variableItem = new vscode.CompletionItem(
        `.${variableName}`,
        vscode.CompletionItemKind.Variable
      );

      // Set details.
      let detail = `Cloney - Variable '${variableName}'`;
      if ("default" in variable) {
        detail += " (Optional)";
      } else {
        detail += " (Required)";
      }
      variableItem.detail = detail;

      // Set documentation.
      variableItem.documentation = new vscode.MarkdownString(
        `**Description:**\n${variableDescription}`
      );

      // Convert default and example fields back to YAML, in order to show them as code blocks.
      const defaultYAML = yaml.dump(variable.default);
      if ("default" in variable) {
        variableItem.documentation.appendMarkdown(
          `\n\n**Default:**\n\`\`\`yaml\n${defaultYAML}\n\`\`\``
        );
      }
      const exampleYAML = yaml.dump(variable.example);
      if ("example" in variable) {
        variableItem.documentation.appendMarkdown(
          `\n\n**Example:**\n\`\`\`yaml\n${exampleYAML}\n\`\`\``
        );
      }

      // Set insert text (the text inserted when the completion item is accepted).
      variableItem.insertText = new vscode.SnippetString(`.${variableName}`);

      completionItems.push(variableItem);

      // Create a completion item for the variable but including '{{' and '}}'.
      const variableItemWithBraces = new vscode.CompletionItem(
        `{{ .${variableName} }}`,
        vscode.CompletionItemKind.Variable
      );
      variableItemWithBraces.detail = detail + " (With Braces)";
      variableItemWithBraces.documentation = variableItem.documentation;
      variableItemWithBraces.insertText = new vscode.SnippetString(
        `{{ .${variableName} }}`
      );

      completionItems.push(variableItemWithBraces);
    }

    // Merge the completion items with the go-template completion items.
    completionItems.push(...goTemplateCompletionItems);

    return completionItems;
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
