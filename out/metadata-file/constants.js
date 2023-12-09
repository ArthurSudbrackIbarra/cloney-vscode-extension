"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataFileCompletionItems = void 0;
const vscode = require("vscode");
// Common function to create a completion item for a field with comments.
function createFieldCompletionItem(fieldName, fieldDescription, isRequired, snippet) {
    const fieldItem = new vscode.CompletionItem(fieldName, vscode.CompletionItemKind.Property);
    fieldItem.detail = `${fieldName}${isRequired ? " (Required)" : " (Optional)"}`;
    fieldItem.documentation = new vscode.MarkdownString(`**${isRequired ? "Required" : "Optional"}** ${fieldDescription}`);
    fieldItem.insertText = new vscode.SnippetString(snippet);
    return fieldItem;
}
// Manifest Version.
const manifestVersionItem = createFieldCompletionItem("manifest_version", "The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.", true, "# (Required) The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.\nmanifest_version: ${1:v1}");
// Name.
const nameItem = createFieldCompletionItem("name", "The name of your Cloney template, providing a clear identifier for users.", true, "# (Required) The name of your Cloney template, providing a clear identifier for users.\nname: ${1:Template Name}");
// Description.
const descriptionItem = createFieldCompletionItem("description", "A brief but informative description of your Cloney template.", false, "# (Optional) A brief but informative description of your Cloney template.\ndescription: ${1:Template Description}");
// Template Version.
const templateVersionItem = createFieldCompletionItem("template_version", "The version number of your template. Update it as you make new changes to your template.", true, '# (Optional) The version number of your template. Update it as you make new changes to your template.\ntemplate_version: ${1:"0.1.0"}');
// Authors.
const authorsItem = createFieldCompletionItem("authors", "A list of contributors or creators of the template, acknowledging their role in its development.", false, "# (Optional) A list of contributors or creators of the template, acknowledging their role in its development.\nauthors:\n  - ${1:Your name}");
// Configuration.
const configurationItem = createFieldCompletionItem("configuration", "A list of configuration options for your template, allowing users to customize their experience.", false, "# (Optional) A list of configuration options for your template, allowing users to customize their experience.\nconfiguration:\n  ");
// Ignore Paths.
const ignorePathsItem = createFieldCompletionItem("configuration.ignore_paths", "A list of paths to ignore when cloning the template. This is useful for excluding files that are not relevant to the template's customization process.", false, "ignore_paths:\n  - ${1:path_to_ignore} # (Optional) A list of paths to ignore when cloning the template. This is useful for excluding files that are not relevant to the template's customization process.");
// Variables.
const variablesItem = createFieldCompletionItem("variables", "A list of variables that users can customize during the cloning process.", false, "# (Optional) A list of variables that users can customize during the cloning process.\nvariables:\n  - name: ${1:variable_name}\n    description: ${2:variable_description}\n    default: ${3:variable_default_value}\n    example: ${4:variable_example_value}");
// Variable name.
const variableNameItem = createFieldCompletionItem("variable.name", "The name of the variable, providing a clear identifier for users.", true, "name: ${1:variable_name} # (Required) The name of the variable, providing a clear identifier for users.");
// Variable description.
const variableDescriptionItem = createFieldCompletionItem("variable.description", "A description of the variable, providing context for users.", false, "description: ${1:variable_description} # A description of the variable, providing context for users.");
// Variable Default.
const variableDefaultItem = createFieldCompletionItem("variable.default", "The default value of a variable.", false, "default: ${1:variable_default_value} # (Optional) The default value of the variable.");
// Variable Example.
const variableExampleItem = createFieldCompletionItem("variable.example", "An example value of the variable.", true, "example: ${1:variable_example_value} # (Required) An example value of the variable.");
// Export fields.
exports.metadataFileCompletionItems = [
    manifestVersionItem,
    nameItem,
    descriptionItem,
    templateVersionItem,
    authorsItem,
    configurationItem,
    ignorePathsItem,
    variablesItem,
    variableNameItem,
    variableDescriptionItem,
    variableDefaultItem,
    variableExampleItem,
];
//# sourceMappingURL=constants.js.map