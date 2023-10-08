"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goTemplateCompletionItems = void 0;
const vscode = require("vscode");
// Define the 'define' Go-template function completion item.
const defineItem = new vscode.CompletionItem("define", vscode.CompletionItemKind.Function);
defineItem.detail = "Cloney - Function 'define'";
defineItem.documentation = new vscode.MarkdownString("The 'define' function is used to create a named template. " +
    "You can define a named template with a specific identifier, " +
    "and later in your template, you can include or invoke this named template " +
    "using the 'template' or 'include' functions. This allows for the modularization " +
    "and reuse of templates, making it easier to manage and promote code reusability " +
    "in your template-based code.");
defineItem.insertText = new vscode.SnippetString('{{- define "${1:template-name}" }}\n\n{{- end }}');
// Define the 'template' Go-template function completion item.
const templateItem = new vscode.CompletionItem("template", vscode.CompletionItemKind.Function);
templateItem.detail = "Cloney - Function 'template'";
templateItem.documentation = new vscode.MarkdownString("The 'template' function is used to include a named template in the template. " +
    "The template function takes the name of the template as the first argument, " +
    "and the data to pass to the template as the second argument. The data argument " +
    "is optional.");
templateItem.insertText = new vscode.SnippetString('{{- template "${1:template-name}" ${2:data} }}\n\n{{- end }}');
// Define the 'include' Go-template function completion item.
const includeItem = new vscode.CompletionItem("include", vscode.CompletionItemKind.Function);
includeItem.detail = "Cloney - Function 'include'";
includeItem.documentation = new vscode.MarkdownString("The 'include' function allows you to bring in another template, " +
    "and then pass the results to other template functions.");
includeItem.insertText = new vscode.SnippetString('{{- include "${1:template-name}" ${2:data} }}\n\n{{- end }}');
// Define the 'if' Go-template function completion item.
const ifItem = new vscode.CompletionItem("if", vscode.CompletionItemKind.Function);
ifItem.detail = "Cloney - Function 'if'";
ifItem.documentation = new vscode.MarkdownString("The 'if' function is used to conditionally render a block of content. " +
    "The 'if' function takes a single argument, which is evaluated as a boolean. " +
    "If the argument evaluates to true, the block of content is rendered. " +
    "If the argument evaluates to false, the block of content is not rendered.");
ifItem.insertText = new vscode.SnippetString("{{- if ${1:condition} }}\n\n{{- end }}");
// Define the 'if-else' Go-template function completion item.
const ifElseItem = new vscode.CompletionItem("if-else", vscode.CompletionItemKind.Function);
ifElseItem.detail = "Cloney - Create an 'if-else' block.";
ifElseItem.documentation = new vscode.MarkdownString("Create an 'if-else' block.");
ifElseItem.insertText = new vscode.SnippetString("{{- if ${1:condition} }}\n\n{{- else }}\n\n{{- end }}");
// Define the 'if-else-if' Go-template function completion item.
const ifElseIfItem = new vscode.CompletionItem("if-else-if", vscode.CompletionItemKind.Function);
ifElseIfItem.detail = "Cloney - Create an 'if-else-if' block.";
ifElseIfItem.documentation = new vscode.MarkdownString("Create an 'if-else-if' block.");
ifElseIfItem.insertText = new vscode.SnippetString("{{- if ${1:condition} }}\n\n{{- else if ${2:condition} }}\n\n{{- else }}\n\n{{- end }}");
// Define the 'range' Go-template function completion item.
const rangeItem = new vscode.CompletionItem("range", vscode.CompletionItemKind.Function);
rangeItem.detail = "Cloney - Function 'range'";
rangeItem.documentation = new vscode.MarkdownString("The 'range' function is used to iterate over a list of items. " +
    "The 'range' function takes a single argument, which is a list of items. " +
    "The 'range' function then iterates over the list of items, " +
    "and for each item, it renders the block of content.");
rangeItem.insertText = new vscode.SnippetString("{{- range ${1:list} }}\n\n{{- end }}");
// Define the 'with' Go-template function completion item.
const withItem = new vscode.CompletionItem("with", vscode.CompletionItemKind.Function);
withItem.detail = "Cloney - Function 'with'";
withItem.documentation = new vscode.MarkdownString("The 'with' function is used to set the context for a block of content. " +
    "The 'with' function takes a single argument, which is the context to set. " +
    "The 'with' function then renders the block of content with the specified context.");
withItem.insertText = new vscode.SnippetString("{{- with ${1:context} }}\n\n{{- end }}");
// Export all Go-template completion items.
exports.goTemplateCompletionItems = [
    defineItem,
    templateItem,
    includeItem,
    ifItem,
    ifElseItem,
    ifElseIfItem,
    rangeItem,
    withItem,
];
//# sourceMappingURL=items.js.map