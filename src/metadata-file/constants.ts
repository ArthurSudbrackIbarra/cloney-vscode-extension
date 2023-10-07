import * as vscode from "vscode";

// Manifest Version.
const manifestVersionItem = new vscode.CompletionItem(
  "manifest_version",
  vscode.CompletionItemKind.Property
);
manifestVersionItem.detail = "Manifest Version";
manifestVersionItem.documentation = new vscode.MarkdownString(
  `(Required) The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.

Allowed values are: \`v1\`.`
);
manifestVersionItem.insertText = new vscode.SnippetString(
  "manifest_version: ${1:v1}"
);

// Name.
const nameItem = new vscode.CompletionItem(
  "name",
  vscode.CompletionItemKind.Property
);
nameItem.detail = "Name";
nameItem.documentation = new vscode.MarkdownString(
  `(Required) The name of your Cloney template or of a variable, providing a clear identifier for users.
  
\`\`\`yaml
name: My Template # Template name.
variables:
    - name: var_name # Variable name.
\`\`\``
);
nameItem.insertText = new vscode.SnippetString("name: ${1:name}");

// Description.
const descriptionItem = new vscode.CompletionItem(
  "description",
  vscode.CompletionItemKind.Property
);
descriptionItem.detail = "Description";
descriptionItem.documentation = new vscode.MarkdownString(
  `(Optional) A brief but informative description of your Cloney template or of a variable.
  
\`\`\`yaml
description: My description. # Template description.
variables:
    - description: var_description # Variable description.
\`\`\``
);
descriptionItem.insertText = new vscode.SnippetString(
  "description: ${1:description}"
);

// Template Version.
const templateVersionItem = new vscode.CompletionItem(
  "template_version",
  vscode.CompletionItemKind.Property
);
templateVersionItem.detail = "Template Version";
templateVersionItem.documentation = new vscode.MarkdownString(
  `(Required) The version number of your template. Update it as you make new changes to your template.`
);
templateVersionItem.insertText = new vscode.SnippetString(
  "template_version: ${1:1.0.0}"
);

// Authors.
const authorsItem = new vscode.CompletionItem(
  "authors",
  vscode.CompletionItemKind.Property
);
authorsItem.detail = "Authors";
authorsItem.documentation = new vscode.MarkdownString(
  `(Optional) A list of contributors or creators of the template, acknowledging their role in its development.`
);
authorsItem.insertText = new vscode.SnippetString(
  "authors:\n  - ${1:John Doe}"
);

// Configuration.
const configurationItem = new vscode.CompletionItem(
  "configuration",
  vscode.CompletionItemKind.Property
);
configurationItem.detail = "Configuration";
configurationItem.documentation = new vscode.MarkdownString(
  `(Optional) A list of configuration options for your template, allowing users to customize their experience.
  
\`\`\`yaml
# Example:
configuration:
    ignore_paths:
        - images/*.png
    # Other configuration options...
\`\`\``
);
configurationItem.insertText = new vscode.SnippetString("configuration:\n  ");

// Ignore Paths.
const ignorePathsItem = new vscode.CompletionItem(
  "ignore_paths",
  vscode.CompletionItemKind.Property
);
ignorePathsItem.detail = "Ignore Paths";
ignorePathsItem.documentation = new vscode.MarkdownString(
  `(Optinal) A list of paths to ignore when cloning the template. This is useful for excluding files that are not relevant to the template's customization process.
  
\`\`\`yaml
# Example:
configuration:
    ignore_paths:
        - images/*.png
\`\`\``
);
ignorePathsItem.insertText = new vscode.SnippetString(
  "ignore_paths:\n  - ${1:path_to_ignore}"
);

// Variables.
const variablesItem = new vscode.CompletionItem(
  "variables",
  vscode.CompletionItemKind.Property
);
variablesItem.detail = "Variables";
variablesItem.documentation = new vscode.MarkdownString(
  `(Optional) A list of variables that users can customize during the cloning process.
  
\`\`\`yaml
# Example:
variables:
    - name: var_name
      description: var_description
      default: default_value
      example: example_value
\`\`\``
);
variablesItem.insertText = new vscode.SnippetString(
  "variables:\n  - name: ${1:var_name}\n    description: ${2:var_description}\n    default: ${3:default_value}\n    example: ${4:example_value}"
);

// Variable Default.
const variableDefaultItem = new vscode.CompletionItem(
  "default",
  vscode.CompletionItemKind.Property
);
variableDefaultItem.detail = "Variable Default";
variableDefaultItem.documentation = new vscode.MarkdownString(
  `(Optional) The default value of a variable.`
);
variableDefaultItem.insertText = new vscode.SnippetString(
  "default: ${1:default_value}"
);

// Variable Example.
const variableExampleItem = new vscode.CompletionItem(
  "example",
  vscode.CompletionItemKind.Property
);
variableExampleItem.detail = "Variable Example";
variableExampleItem.documentation = new vscode.MarkdownString(
  `(Required) An example value of the variable.`
);
variableExampleItem.insertText = new vscode.SnippetString(
  "example: ${1:example_value}"
);

// Export fields.
export const metadataFileCompletionItems = [
  manifestVersionItem,
  nameItem,
  descriptionItem,
  templateVersionItem,
  authorsItem,
  configurationItem,
  ignorePathsItem,
  variablesItem,
  variableDefaultItem,
  variableExampleItem,
];
