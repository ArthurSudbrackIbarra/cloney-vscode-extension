import * as vscode from "vscode";
import { readFile } from "fs/promises";

// Function to read a file from the user's workspace.
export async function readUserFile(fileName: string): Promise<string> {
  // Get the active workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    throw new Error("No workspace folder is open.");
  }

  // Get the URI of the first workspace folder (you can loop through multiple folders if needed)
  const workspaceFolderUri = workspaceFolders[0].uri;

  // Formulate the complete file path by joining the workspace folder URI and the file name
  const filePath = vscode.Uri.joinPath(workspaceFolderUri, fileName);

  try {
    // Read the file using fs.promises.readFile
    const fileContent = await readFile(filePath.fsPath, "utf-8");
    return fileContent;
  } catch (error) {
    throw error;
  }
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
