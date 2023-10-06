// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CloneyMetadataHoverProvider } from "./hover";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "cloney" is now active!');
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      "cloney",
      new CloneyMetadataHoverProvider()
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
