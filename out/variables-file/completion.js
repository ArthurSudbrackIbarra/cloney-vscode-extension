"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyVariablesCompletionProvider = void 0;
const vscode = require("vscode");
const yaml = require("js-yaml");
const vscode_1 = require("../vscode");
const simple_git_1 = require("simple-git");
const fs_1 = require("fs");
const constants_1 = require("../constants");
// Defines a completion provider for Cloney Variables.
class CloneyVariablesCompletionProvider {
    async provideCompletionItems(document, position, token, context) {
        // Check if the user has specified a remote Cloney repository
        const remoteRepositoryCompletionItems = await this.completionItemsFromRemoteRepository(document);
        if (remoteRepositoryCompletionItems.length > 0) {
            return remoteRepositoryCompletionItems;
        }
        // If the user has not specified a remote Cloney repository,
        // check if the user has a local Cloney metadata file.
        try {
            // Read the Cloney metadata file and find every variable defined in it.
            const content = await (0, vscode_1.readUserFile)(constants_1.CLONEY_METADATA_FILE_NAME);
            if (!content) {
                return [];
            }
            return this.completionItemsFromYAML(content);
        }
        catch (error) {
            return [];
        }
    }
    async completionItemsFromRemoteRepository(document) {
        // Get the document text.
        const text = document.getText().toLowerCase();
        // Define regular expressions to capture repository URL, owner, name, branch, and tag.
        const repoRegex = /# *\(cloney\) repository: *(https?:\/\/[^\/]+\/([^\/]+)\/([^\/]+)\.git)/;
        const branchRegex = /# *\(cloney\) branch: *([a-zA-Z0-9\-_]+)/;
        const tagRegex = /# *\(cloney\) tag: *([a-zA-Z0-9\-_\.]+)/;
        // Use exec to find the matches and capture the groups.
        const repoMatch = repoRegex.exec(text);
        if (!repoMatch || repoMatch.length < 3) {
            return [];
        }
        // Extract captured values.
        const repositoryURL = repoMatch[1];
        const repositoryOwner = repoMatch[2];
        const repositoryName = repoMatch[3];
        let branchName = undefined;
        const branchMatch = branchRegex.exec(text);
        if (branchMatch && branchMatch.length >= 2) {
            branchName = branchMatch[1];
        }
        let tagName = undefined;
        const tagMatch = tagRegex.exec(text);
        if (tagMatch && tagMatch.length >= 2) {
            tagName = tagMatch[1];
        }
        // Define temporary directory and clone options based on branch/tag presence.
        let tempDir = "";
        let cloneOptions = {};
        if (!branchName && !tagName) {
            // Use main branch
            tempDir = `${constants_1.CLONEY_EXTENSION_TEMP_DIR}/${repositoryOwner}/${repositoryName}/main`;
            cloneOptions = {
                "--branch": "main",
                "--depth": 1,
            };
        }
        else if (branchName) {
            // Use specified branch
            tempDir = `${constants_1.CLONEY_EXTENSION_TEMP_DIR}/${repositoryOwner}/${repositoryName}/${branchName}`;
            cloneOptions = {
                "--branch": branchName,
                "--depth": 1,
            };
        }
        else if (tagName) {
            // Use specified tag
            tempDir = `${constants_1.CLONEY_EXTENSION_TEMP_DIR}/${repositoryOwner}/${repositoryName}/${tagName}`;
            cloneOptions = {
                "--branch": tagName,
                "--depth": 1,
            };
        }
        // Check if the repository has already been cloned. If not, clone it.
        if (!(0, fs_1.existsSync)(tempDir)) {
            const git = (0, simple_git_1.simpleGit)();
            try {
                await git.clone(repositoryURL, tempDir, cloneOptions);
            }
            catch (error) {
                return [];
            }
        }
        // Read the Cloney metadata file and find every variable defined in it.
        // In case of error, return an empty array.
        let content;
        try {
            content = (0, fs_1.readFileSync)(`${tempDir}/${constants_1.CLONEY_METADATA_FILE_NAME}`, "utf8");
        }
        catch (error) {
            return [];
        }
        return this.completionItemsFromYAML(content, true, repositoryURL, branchName || tagName);
    }
    completionItemsFromYAML(content, isRemote, remoteRepositoryURL, remoteRepositoryRef) {
        // Parse the YAML content.
        const parsedYAML = yaml.load(content);
        if (!parsedYAML || !parsedYAML.variables) {
            return [];
        }
        // Extract variables from the parsed YAML.
        const variables = parsedYAML.variables;
        const completionItems = [];
        // Create completion items for each variable.
        for (const variable of variables) {
            const variableName = variable.name;
            const variableDescription = variable.description || "No description provided.";
            // Create a completion item for the variable.
            const variableItem = new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Property);
            // Set details.
            let detail = `Cloney Variable '${variableName}'`;
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
            variableItem.documentation = new vscode.MarkdownString(`**Description:**\n${variableDescription}`);
            // Convert default and example fields back to YAML, in order to show them as code blocks.
            const defaultYAML = yaml.dump(variable.default);
            if ("default" in variable) {
                variableItem.documentation.appendMarkdown(`\n\n**Default:**\n\`\`\`yaml\n${defaultYAML}\n\`\`\``);
            }
            const exampleYAML = yaml.dump(variable.example);
            if ("example" in variable) {
                variableItem.documentation.appendMarkdown(`\n\n**Example:**\n\`\`\`yaml\n${exampleYAML}\n\`\`\``);
            }
            if (isRemote && remoteRepositoryURL && remoteRepositoryRef) {
                // Remove '.git' from the URL.
                let metadataFileURL = remoteRepositoryURL.slice(0, remoteRepositoryURL.length - 4);
                // Add the reference.
                metadataFileURL += `/tree/${remoteRepositoryRef}/${constants_1.CLONEY_METADATA_FILE_NAME}`;
                variableItem.documentation.appendMarkdown(`\n\n**Source:** [Metadata File on Remote Repository](${metadataFileURL})`);
            }
            else if (!isRemote) {
                variableItem.documentation.appendMarkdown(`\n\n**Source:** Local \`.cloney.yaml\` file.`);
            }
            // Set insert text (the text inserted when the completion item is accepted).
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
        // You can modify the item here, e.g., add documentation or details.
        return item;
    }
}
exports.CloneyVariablesCompletionProvider = CloneyVariablesCompletionProvider;
//# sourceMappingURL=completion.js.map