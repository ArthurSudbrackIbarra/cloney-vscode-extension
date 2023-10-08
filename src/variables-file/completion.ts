import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { readUserFile } from "../vscode"; // Importing readUserFile function
import { simpleGit } from "simple-git";
import { tmpdir } from "os";
import { existsSync, readFileSync } from "fs";
import { CLONEY_METADATA_FILE_NAME } from "../constants";

// Defines a completion provider for Cloney Variables.
export class CloneyVariablesCompletionProvider
  implements vscode.CompletionItemProvider
{
  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[]> {
    // First check if the user has specified a remote Cloney repository,
    // using the # Repository: https://... annotation.
    const remoteRepositoryCompletionItems =
      await this.completionItemsFromRemoteRepository(document);
    if (remoteRepositoryCompletionItems.length > 0) {
      return remoteRepositoryCompletionItems;
    }

    // If the user has not specified a remote Cloney repository,
    // check if the user has a local Cloney metadata file.
    try {
      // Read the Cloney metadata file and find every variable defined in it.
      const content = await readUserFile(CLONEY_METADATA_FILE_NAME);
      if (!content) {
        return [];
      }
      return this.completionItemsFromYAML(content);
    } catch (error) {
      return [];
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
      content = readFileSync(`${tempDir}/${CLONEY_METADATA_FILE_NAME}`, "utf8");
    } catch (error) {
      return [];
    }

    return this.completionItemsFromYAML(content, true);
  }

  private completionItemsFromYAML(
    content: string,
    isRemote?: boolean
  ): vscode.CompletionItem[] {
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
        variableName,
        vscode.CompletionItemKind.Property
      );

      // Set details.
      let detail = `Cloney Variable '${variableName}'`;
      if ("default" in variable) {
        detail += " (Optional)";
      } else {
        detail += " (Required)";
      }
      if (isRemote) {
        detail += " (From Remote Repository)";
      } else {
        detail += " (From Local File)";
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
      let snippetStr = "";
      if ("default" in variable) {
        snippetStr += "# (Optional)";
      } else {
        snippetStr += "# (Required)";
      }
      if (variableDescription) {
        snippetStr += ` ${variableDescription}`;
      }
      if (exampleYAML.split("\n").length < 3) {
        snippetStr += `\n${variableName}: \${1:${exampleYAML.replace(
          "\n",
          ""
        )}}`;
      } else {
        snippetStr += `\n${variableName}:\n  \${1:${exampleYAML
          .split("\n")
          .join("\n  ")
          .trim()}}`;
      }
      variableItem.insertText = new vscode.SnippetString(snippetStr);

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
    // You can modify the item here, e.g., add documentation or details.
    return item;
  }
}
