import * as vscode from "vscode";
import { dirname } from "path";

// Function to get the workspace folder path.
export function getWorkspaceFolderPath(): string {
  // Get the active workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    throw new Error("No workspace folder is open.");
  }

  // Get the URI of the first workspace folder (you can loop through multiple folders if needed)
  const workspaceFolderUri = workspaceFolders[0].uri;

  // Get the path of the workspace folder.
  const workspaceFolderPath = workspaceFolderUri.fsPath;

  return workspaceFolderPath;
}

// Function to get the directory path of the file that the user is currently editing.
export function getCurrentFileDirectory(): string {
  // Get the active text editor.
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    throw new Error("No active editor.");
  }

  // Get the URI of the file that the user is currently editing.
  const fileUri = activeEditor.document.uri;

  // Get the directory path of the file.
  const fileDirectory = dirname(fileUri.fsPath);

  return fileDirectory;
}

// Function to get the value of a user setting.
export function getUserSetting<T>(settingName: string): T | undefined {
  return vscode.workspace.getConfiguration().get(settingName);
}

// Function to create a terminal and run a given command.
export function createTerminal(terminalName: string, command: string) {
  let terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === terminalName
  );
  if (!terminal) {
    // If on Windows, create a new terminal with the PowerShell shell.
    // Otherwise, create a new terminal with the default shell.
    terminal = vscode.window.createTerminal(
      terminalName,
      process.platform === "win32" ? "powershell.exe" : undefined
    );
  }
  terminal.sendText(command, true);
  terminal.show();
}
