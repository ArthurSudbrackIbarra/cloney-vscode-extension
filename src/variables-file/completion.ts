import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { readUserFile } from "../vscode"; // Importing readUserFile function

export class CloneyVariablesCompletionProvider
  implements vscode.CompletionItemProvider
{
  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    try {
      // Read the Cloney metadata file and find every variable defined in it.
      const content = await readUserFile(".cloney.yaml");
      if (!content) {
        return [];
      }

      // Parse the YAML content
      const parsedYAML = yaml.load(content) as any;
      if (!parsedYAML || !parsedYAML.variables) {
        return [];
      }

      // Extract variables from the parsed YAML
      const variables = parsedYAML.variables as any[];
      const completionItems: vscode.CompletionItem[] = [];

      // Create completion items for each variable
      for (const variable of variables) {
        const variableName = variable.name as string;
        const variableDescription = variable.description as string;

        // Create a completion item for the variable
        const variableItem = new vscode.CompletionItem(
          variableName,
          vscode.CompletionItemKind.Variable
        );

        // Set details (shown in the detail field in the completion list)
        variableItem.detail = variableName;

        // Set documentation (shown when hovering over the completion item)
        variableItem.documentation = new vscode.MarkdownString(
          "default" in variable
            ? variableDescription
            : `(Required) ${variableDescription}`
        );

        // Convert default and example fields back to YAML, in order to show them as code blocks
        if ("default" in variable) {
          const defaultYAML = yaml.dump(variable.default);
          variableItem.documentation.appendMarkdown(
            `\n\n**Default:**\n\`\`\`yaml\n${defaultYAML}\n\`\`\``
          );
        }
        if ("example" in variable) {
          const exampleYAML = yaml.dump(variable.example);
          variableItem.documentation.appendMarkdown(
            `\n\n**Example:**\n\`\`\`yaml\n${exampleYAML}\n\`\`\``
          );
        }

        // Set insert text (the text inserted when the completion item is accepted)
        variableItem.insertText = new vscode.SnippetString(
          `${variableName}: \${1:value}`
        );

        console.log(variableItem);

        completionItems.push(variableItem);
      }

      return completionItems;
    } catch (error) {
      return [];
    }
  }

  resolveCompletionItem?(
    item: vscode.CompletionItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem> {
    // Optionally, you can implement additional logic to resolve completion items
    // This method is called when a user selects a completion item from the list
    // You can modify the item here, e.g., add documentation or details
    return item;
  }
}
