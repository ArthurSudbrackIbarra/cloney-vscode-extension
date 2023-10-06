"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const hover_1 = require("./hover");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "cloney" is now active!');
    context.subscriptions.push(vscode.languages.registerHoverProvider("cloney", new hover_1.CloneyMetadataHoverProvider()));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map