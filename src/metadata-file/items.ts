import * as vscode from "vscode";

// Common function to create a completion item for a field with comments.
function createFieldCompletionItem(
  fieldName: string,
  fieldDescription: string,
  isRequired: boolean,
  snippet: string
): vscode.CompletionItem {
  const fieldItem = new vscode.CompletionItem(
    fieldName,
    vscode.CompletionItemKind.Property
  );
  fieldItem.detail = `Cloney - ${fieldName}${
    isRequired ? " (Required)" : " (Optional)"
  }`;
  fieldItem.documentation = new vscode.MarkdownString(
    `**${
      isRequired ? "Required" : "Optional"
    }** ${fieldDescription}\n\n[Cloney Documentation - The Cloney Metadata File](https://arthursudbrackibarra.github.io/cloney-documentation/creators/cloney-metadata-file/)`
  );
  fieldItem.insertText = new vscode.SnippetString(snippet);
  return fieldItem;
}

// Manifest Version.
export const manifestVersionItem = createFieldCompletionItem(
  "manifest_version",
  "The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.",
  true,
  "# (Required) The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.\nmanifest_version: ${1:v1}"
);

// Name.
export const nameItem = createFieldCompletionItem(
  "name",
  "The name of your Cloney template, providing a clear identifier for users.",
  true,
  "# (Required) The name of your Cloney template, providing a clear identifier for users.\nname: ${1:Template Name}"
);

// Description.
export const descriptionItem = createFieldCompletionItem(
  "description",
  "A brief but informative description of your Cloney template.",
  false,
  "# (Optional) A brief but informative description of your Cloney template.\ndescription: ${1:Template Description}"
);

// Template Version.
export const templateVersionItem = createFieldCompletionItem(
  "template_version",
  "The version number of your template. Update it as you make new changes to your template.",
  true,
  '# (Optional) The version number of your template. Update it as you make new changes to your template.\ntemplate_version: ${1:"0.1.0"}'
);

// License.
export const licenseItem = createFieldCompletionItem(
  "license",
  "The licensing information for your template, specifying how others can use and distribute it.",
  false,
  "# (Optional) The license under which your template is distributed.\nlicense: ${1:MIT}"
);

// Authors.
export const authorsItem = createFieldCompletionItem(
  "authors",
  "A list of contributors or creators of the template, acknowledging their role in its development.",
  false,
  "# (Optional) A list of contributors or creators of the template, acknowledging their role in its development.\nauthors:\n  - ${1:Your name}"
);

// Configuration.
export const configurationItem = createFieldCompletionItem(
  "configuration",
  "A list of configuration options for your template, allowing users to customize their experience.",
  false,
  "# (Optional) A list of configuration options for your template, allowing users to customize their experience.\nconfiguration:\n  "
);

// Ignore Paths.
export const ignorePathsItem = createFieldCompletionItem(
  "configuration.ignore_paths",
  "A list of paths to ignore when cloning the template. This is useful for excluding files that are not relevant to the template's customization process.",
  false,
  "ignore_paths:\n  - ${1:path_to_ignore} # (Optional) A list of paths to ignore when cloning the template. This is useful for excluding files that are not relevant to the template's customization process."
);

// Variables.
export const variablesItem = createFieldCompletionItem(
  "variables",
  "A list of variables that users can customize during the cloning process.",
  false,
  "# (Optional) A list of variables that users can customize during the cloning process.\nvariables:\n  - name: ${1:variable_name}\n    description: ${2:variable_description}\n    default: ${3:variable_default_value}\n    example: ${4:variable_example_value}"
);

// Variable name.
export const variableNameItem = createFieldCompletionItem(
  "variable.name",
  "The name of the variable, providing a clear identifier for users.",
  true,
  "name: ${1:variable_name} # (Required) The name of the variable, providing a clear identifier for users."
);

// Variable description.
export const variableDescriptionItem = createFieldCompletionItem(
  "variable.description",
  "A description of the variable, providing context for users.",
  false,
  "description: ${1:variable_description} # (Optional) A description of the variable, providing context for users."
);

// Variable Default.
export const variableDefaultItem = createFieldCompletionItem(
  "variable.default",
  "The default value of a variable.",
  false,
  "default: ${1:variable_default_value} # (Optional) The default value of the variable."
);

// Variable Example.
export const variableExampleItem = createFieldCompletionItem(
  "variable.example",
  "An example value of the variable.",
  true,
  "example: ${1:variable_example_value} # (Required) An example value of the variable."
);

// Variable Validate.
export const variableValidateItem = createFieldCompletionItem(
  "variable.validate",
  "This parameter determines whether the variable's value should undergo validation when it is cloned. By default, this setting is enabled (`true`). Although not recommended, you have the option to disable validation by setting this field to `false`. Disabling validation can be particularly beneficial for variables with dynamic characteristics, such as variables that may assume various types or maps with dynamically changing keys.",
  false,
  "validate: ${1:true} # (Optional) Enable or disable validation for the variable's value."
);

// Export fields.
export const metadataFileCompletionItems = [
  manifestVersionItem,
  nameItem,
  descriptionItem,
  templateVersionItem,
  licenseItem,
  authorsItem,
  configurationItem,
  ignorePathsItem,
  variablesItem,
  variableNameItem,
  variableDescriptionItem,
  variableDefaultItem,
  variableExampleItem,
  variableValidateItem,
];

// Function to get a completion item by its field name.
export function getItemByFieldName(
  fieldName: string
): vscode.CompletionItem | undefined {
  return metadataFileCompletionItems.find((item) => item.label === fieldName);
}
