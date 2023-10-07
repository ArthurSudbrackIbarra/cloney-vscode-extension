import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { readUserFile } from "../vscode"; // Importing readUserFile function
import { simpleGit } from "simple-git";
import { tmpdir } from "os";
import { existsSync, readFileSync } from "fs";

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
      // In case of error, try to fetch the variables from a remote repository.
      const content = await readUserFile(".cloney.yaml");
      if (!content) {
        return this.completionItemsFromRemoteRepository(document);
      }

      return this.completionItemsFromYAML(content);
    } catch (error) {
      // In case of any error, fall back to fetching variables from a remote repository.
      return this.completionItemsFromRemoteRepository(document);
    }
  }

  private async completionItemsFromRemoteRepository(
    document: vscode.TextDocument
  ): Promise<vscode.CompletionItem[]> {
    // Get the first line of the document.
    // If the line is empty, return an empty array.
    const firstLine = document.lineAt(0);
    if (!firstLine || !firstLine.text) {
      return [];
    }

    // Define a regular expression to capture the repository URL, owner, and name.
    const regex =
      /# *repository: *(https?:\/\/[^\/]+\/([^\/]+)\/([^\/]+)\.git)/;

    // Use exec to find the match and capture the group.
    const match = regex.exec(firstLine.text.toLowerCase());
    if (!match || match.length < 3) {
      return [];
    }

    // Extract captured values.
    const repositoryURL = match[1];
    const repositoryOwner = match[2];
    const repositoryName = match[3];

    // Check if the repository has already been cloned.
    // If not, clone it.
    const tempDir = `${tmpdir()}/cloney-vscode-extension/${repositoryOwner}/${repositoryName}`;
    console.log(tempDir);
    if (!existsSync(tempDir)) {
      const git = simpleGit();
      try {
        await git.clone(repositoryURL, tempDir);
      } catch (error) {
        return [];
      }
    }

    // Read the Cloney metadata file and find every variable defined in it.
    // In case of error, return an empty array.
    let content: string;
    try {
      content = readFileSync(`${tempDir}/.cloney.yaml`, "utf8");
    } catch (error) {
      return [];
    }

    return this.completionItemsFromYAML(content);
  }

  private completionItemsFromYAML(content: string): vscode.CompletionItem[] {
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

      // Set details.
      variableItem.detail = variableName;

      // Set documentation.
      variableItem.documentation = new vscode.MarkdownString(
        "default" in variable
          ? variableDescription
          : `(Required) ${variableDescription}`
      );

      // Convert default and example fields back to YAML, in order to show them as code blocks
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

      // Set insert text (the text inserted when the completion item is accepted)
      if (exampleYAML.split("\n").length < 3) {
        variableItem.insertText = new vscode.SnippetString(
          `${variableName}: \${1:${exampleYAML.replace("\n", "")}}`
        );
      } else {
        variableItem.insertText = new vscode.SnippetString(
          `${variableName}:\n  \${1:${exampleYAML
            .split("\n")
            .join("\n  ")
            .trim()}}`
        );
      }

      completionItems.push(variableItem);
    }

    return completionItems;
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
