import * as vscode from "vscode";
import { execSync } from "child_process";
import { CLONEY_VARIABLES_FILE_NAME } from "./constants";

// Function to check if Cloney is installed or not.
export function isCloneyInstalled(): boolean {
  const command = "cloney version";
  try {
    execSync(command);
    return true;
  } catch (error) {
    return false;
  }
}

// Function to run Cloney 'clone' command.
export function runCloneyCloneCommand(
  workDir: string,
  repoURL: string,
  repoBranch: string | undefined,
  repoTag: string | undefined,
  outputDirName: string
) {
  let command = `cloney clone ${repoURL}`;
  if (repoBranch) {
    command += ` --branch ${repoBranch}`;
  }
  if (repoTag) {
    command += ` --tag ${repoTag}`;
  }
  command += ` --variables ${workDir}/${CLONEY_VARIABLES_FILE_NAME}`;
  command += ` --output ${workDir}/${outputDirName}`;
  let terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === "Cloney clone"
  );
  if (!terminal) {
    terminal = vscode.window.createTerminal("Cloney clone");
  }
  terminal.sendText(command);
  terminal.show();
}

// Function to run Cloney 'dry-run' command.
export function runCloneyDryRunCommand(workDir: string) {
  const command = `cloney dry-run ${workDir} --variables ${workDir}/${CLONEY_VARIABLES_FILE_NAME} --output ${workDir}/cloney-dry-run-results`;
  let terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === "Cloney dry-run"
  );
  if (!terminal) {
    terminal = vscode.window.createTerminal("Cloney dry-run");
  }
  terminal.sendText(command);
  terminal.show();
}
