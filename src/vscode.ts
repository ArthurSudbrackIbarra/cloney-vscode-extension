import * as vscode from "vscode";
import { readFile } from "fs/promises";

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

export function getUserSetting<T>(settingName: string): T | undefined {
  return vscode.workspace.getConfiguration().get(settingName);
}
