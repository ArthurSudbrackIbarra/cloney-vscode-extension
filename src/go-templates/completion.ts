import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { readUserFile } from "../vscode";
import { CLONEY_METADATA_FILE_NAME } from "../constants";

export class CloneyGoTemplatesCompletionProvider
  implements vscode.CompletionItemProvider
{
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    // Check if there is a Cloney metadata file in the user's workspace.
    // If there is, return the completion items from it.
    // If there isn't, return an empty array.
    try {
      const content = await readUserFile(CLONEY_METADATA_FILE_NAME);
      if (!content) {
        return [];
      }
      return this.completionItemsFromYAML(content);
    } catch (error) {
      return [];
    }
  }

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
      let detail = `Cloney Variable '${variableName}'`;
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
        `{{.${variableName}}}`,
        vscode.CompletionItemKind.Variable
      );
      variableItemWithBraces.detail = detail;
      variableItemWithBraces.documentation = variableItem.documentation;
      variableItemWithBraces.insertText = new vscode.SnippetString(
        `{{ .${variableName} }}`
      );

      completionItems.push(variableItemWithBraces);
    }

    return completionItems;
  }

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
