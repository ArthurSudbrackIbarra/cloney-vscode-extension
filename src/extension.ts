// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CloneyMetadataCompletionProvider } from "./metadata-file/completion";
import { CloneyVariablesCompletionProvider } from "./variables-file/completion";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("Cloney extension activated.");
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "cloney-metadata-file",
      new CloneyMetadataCompletionProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "cloney-variables-file",
      new CloneyVariablesCompletionProvider()
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("Cloney extension deactivated.");
}
