import * as vscode from "vscode";

// Define the 'define' Go-template block completion item.
const defineItem = new vscode.CompletionItem(
  "{{ define }}",
  vscode.CompletionItemKind.Snippet
);
defineItem.detail = "Cloney - 'define' Block";
defineItem.documentation = new vscode.MarkdownString(
  "The '{{ define }}' block is used to create a named template. " +
  "It allows you to define a reusable template with a specific identifier. " +
  "Later in your template, you can include or invoke this named template " +
  "using the '{{ template }}' block or the '{{ include }}' function. This " +
  "modularizes your template code, making it easier to manage and promote " +
  "code reusability."
);
defineItem.insertText = new vscode.SnippetString(
  '{{- define "${1:template-name}" }}\n\n{{- end }}'
);

// Define the 'template' Go-template block completion item.
const templateItem = new vscode.CompletionItem(
  "{{ template }}",
  vscode.CompletionItemKind.Snippet
);
templateItem.detail = "Cloney - 'template' Block";
templateItem.documentation = new vscode.MarkdownString(
  "The '{{ template }}' block is used to include a named template within " +
  "your template. It takes the name of the template as the first argument " +
  "and an optional data argument to pass data to the template. This function " +
  "enables you to reuse templates and pass data for dynamic rendering."
);
templateItem.insertText = new vscode.SnippetString(
  '{{- template "${1:template-name}" ${2:data} }}\n\n{{- end }}'
);

// Define the 'include' Go-template function completion item.
const includeItem = new vscode.CompletionItem(
  "{{ include }}",
  vscode.CompletionItemKind.Function
);
includeItem.detail = "Cloney - 'include' Function";
includeItem.documentation = new vscode.MarkdownString(
  "The '{{ include }}' function allows you to import and execute another " +
  "template, passing the results to other template functions for further processing."
);
includeItem.insertText = new vscode.SnippetString(
  '{{- include "${1:template-name}" ${2:data} }}'
);

// Define the 'if' Go-template block completion item.
const ifItem = new vscode.CompletionItem(
  "{{ if }}",
  vscode.CompletionItemKind.Snippet
);
ifItem.detail = "Cloney - 'if' Block";
ifItem.documentation = new vscode.MarkdownString(
  "The '{{ if }}' block is used to conditionally render a block of content. " +
  "It evaluates a specified condition, and if true, it renders the enclosed " +
  "content. If false, the content is not rendered."
);
ifItem.insertText = new vscode.SnippetString(
  "{{- if ${1:condition} }}\n\n{{- end }}"
);

// Define the 'if-else' Go-template block completion item.
const ifElseItem = new vscode.CompletionItem(
  "{{ if }} {{ else }}",
  vscode.CompletionItemKind.Snippet
);
ifElseItem.detail = "Cloney - 'if-else' Block";
ifElseItem.documentation = new vscode.MarkdownString(
  "The '{{ if }} {{ else }}' block allows you to create an if-else statement. " +
  "If the condition in '{{ if }}' is true, the first block is rendered; " +
  "otherwise, the '{{ else }}' block is rendered."
);
ifElseItem.insertText = new vscode.SnippetString(
  "{{- if ${1:condition} }}\n\n{{- else }}\n\n{{- end }}"
);

// Define the 'if-else-if' Go-template block completion item.
const ifElseIfItem = new vscode.CompletionItem(
  "{{ if }} {{ else if }} {{ else }}",
  vscode.CompletionItemKind.Snippet
);
ifElseIfItem.detail = "Cloney - 'if-else-if' Block";
ifElseIfItem.documentation = new vscode.MarkdownString(
  "The '{{ if }} {{ else if }} {{ else }}' block allows you to create an " +
  "if-else if-else statement. You can evaluate multiple conditions and " +
  "render different blocks based on the conditions."
);
ifElseIfItem.insertText = new vscode.SnippetString(
  "{{- if ${1:condition} }}\n\n{{- else if ${2:condition} }}\n\n{{- else }}\n\n{{- end }}"
);

// Define the 'range' Go-template block completion item.
const rangeItem = new vscode.CompletionItem(
  "{{ range }}",
  vscode.CompletionItemKind.Snippet
);
rangeItem.detail = "Cloney - 'range' Block";
rangeItem.documentation = new vscode.MarkdownString(
  "The '{{ range }}' block is used to iterate over a list of items. " +
  "It takes a single argument, which is a list of items, and iterates " +
  "over the list, rendering the block of content for each item."
);
rangeItem.insertText = new vscode.SnippetString(
  "{{- range ${1:list} }}\n\n{{- end }}"
);

// Define the 'with' Go-template block completion item.
const withItem = new vscode.CompletionItem(
  "{{ with }}",
  vscode.CompletionItemKind.Snippet
);
withItem.detail = "Cloney - 'with' Block";
withItem.documentation = new vscode.MarkdownString(
  "The '{{ with }}' block is used to set the context for a block of content. " +
  "It takes a single argument, which is the context to set, and then renders " +
  "the enclosed content with the specified context."
);
withItem.insertText = new vscode.SnippetString(
  "{{- with ${1:context} }}\n\n{{- end }}"
);

// Export all Go-template completion items.
export const goTemplateCompletionItems = [
  defineItem,
  templateItem,
  includeItem,
  ifItem,
  ifElseItem,
  ifElseIfItem,
  rangeItem,
  withItem,
];
