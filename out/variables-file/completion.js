"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyVariablesCompletionProvider = void 0;
const vscode = require("vscode");
const yaml = require("js-yaml");
const vscode_1 = require("../vscode"); // Importing readUserFile function
const simple_git_1 = require("simple-git");
const os_1 = require("os");
const fs_1 = require("fs");
class CloneyVariablesCompletionProvider {
    async provideCompletionItems(document, position, token, context) {
        // First check if the user has specified a remote Cloney repository,
        // using the # Repository: https://... annotation.
        const remoteRepositoryCompletionItems = await this.completionItemsFromRemoteRepository(document);
        if (remoteRepositoryCompletionItems.length > 0) {
            return remoteRepositoryCompletionItems;
        }
        // If the user has not specified a remote Cloney repository,
        // check if the user has a local Cloney metadata file.
        try {
            // Read the Cloney metadata file and find every variable defined in it.
            const content = await (0, vscode_1.readUserFile)(".cloney.yaml");
            if (!content) {
                return this.completionItemsFromRemoteRepository(document);
            }
            return this.completionItemsFromYAML(content);
        }
        catch (error) {
            // In case of any error, return an empty array.
            return [];
        }
    }
    async completionItemsFromRemoteRepository(document) {
        // Get the first line of the document.
        // If the line is empty, return an empty array.
        const firstLine = document.lineAt(0);
        if (!firstLine || !firstLine.text) {
            return [];
        }
        // Define a regular expression to capture the repository URL, owner, and name.
        const regex = /# *repository: *(https?:\/\/[^\/]+\/([^\/]+)\/([^\/]+)\.git)/;
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
        const tempDir = `${(0, os_1.tmpdir)()}/cloney-vscode-extension/${repositoryOwner}/${repositoryName}`;
        if (!(0, fs_1.existsSync)(tempDir)) {
            const git = (0, simple_git_1.simpleGit)();
            try {
                await git.clone(repositoryURL, tempDir);
            }
            catch (error) {
                return [];
            }
        }
        // Read the Cloney metadata file and find every variable defined in it.
        // In case of error, return an empty array.
        let content;
        try {
            content = (0, fs_1.readFileSync)(`${tempDir}/.cloney.yaml`, "utf8");
        }
        catch (error) {
            return [];
        }
        return this.completionItemsFromYAML(content, true);
    }
    completionItemsFromYAML(content, isRemote) {
        // Parse the YAML content
        const parsedYAML = yaml.load(content);
        if (!parsedYAML || !parsedYAML.variables) {
            return [];
        }
        // Extract variables from the parsed YAML
        const variables = parsedYAML.variables;
        const completionItems = [];
        // Create completion items for each variable
        for (const variable of variables) {
            const variableName = variable.name;
            const variableDescription = variable.description;
            // Create a completion item for the variable
            const variableItem = new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Property);
            // Set details.
            let detail = variableName;
            if ("default" in variable) {
                detail += " (Optional)";
            }
            else {
                detail += " (Required)";
            }
            if (isRemote) {
                detail += " (From Remote Repository)";
            }
            else {
                detail += " (From Local File)";
            }
            variableItem.detail = detail;
            // Set documentation.
            variableItem.documentation = new vscode.MarkdownString(variableDescription);
            // Convert default and example fields back to YAML, in order to show them as code blocks
            const defaultYAML = yaml.dump(variable.default);
            if ("default" in variable) {
                variableItem.documentation.appendMarkdown(`\n\n**Default:**\n\`\`\`yaml\n${defaultYAML}\n\`\`\``);
            }
            const exampleYAML = yaml.dump(variable.example);
            if ("example" in variable) {
                variableItem.documentation.appendMarkdown(`\n\n**Example:**\n\`\`\`yaml\n${exampleYAML}\n\`\`\``);
            }
            // Set insert text (the text inserted when the completion item is accepted)
            let snippetStr = "";
            if ("default" in variable) {
                snippetStr += "# (Optional)";
            }
            else {
                snippetStr += "# (Required)";
            }
            if (variableDescription) {
                snippetStr += ` ${variableDescription}`;
            }
            if (exampleYAML.split("\n").length < 3) {
                snippetStr += `\n${variableName}: \${1:${exampleYAML.replace("\n", "")}}`;
            }
            else {
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
    resolveCompletionItem(item, token) {
        // Optionally, you can implement additional logic to resolve completion items
        // This method is called when a user selects a completion item from the list
        // You can modify the item here, e.g., add documentation or details
        return item;
    }
}
exports.CloneyVariablesCompletionProvider = CloneyVariablesCompletionProvider;
//# sourceMappingURL=completion.js.map