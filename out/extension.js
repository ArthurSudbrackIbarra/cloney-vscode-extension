"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const completion_1 = require("./metadata-file/completion");
const completion_2 = require("./variables-file/completion");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log("Cloney extension activated.");
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("cloney-metadata-file", new completion_1.CloneyMetadataCompletionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("cloney-variables-file", new completion_2.CloneyVariablesCompletionProvider()));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    console.log("Cloney extension deactivated.");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map