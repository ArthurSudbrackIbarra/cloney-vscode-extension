import * as vscode from "vscode";
import { execSync } from "child_process";
import { CLONEY_VARIABLES_FILE_NAME } from "./constants";

// Function to check if Cloney is installed or not.
export function isCloneyInstalled(): boolean {
  const command = "cloney version";
  try {
    // Try to execute the 'cloney version' command.
    // If it succeeds, Cloney is installed.
    execSync(command);
    return true;
  } catch (error) {
    // If the command fails, Cloney is not installed.
    return false;
  }
}

// Function to run Cloney 'clone' command.
export interface CloneyCloneCommandOptions {
  workDir: string;
  repoURL: string;
  repoBranch?: string;
  repoTag?: string;
  outputDirName: string;
  variables?: string;
}
export function runCloneyCloneCommand(options: CloneyCloneCommandOptions) {
  let command = `cloney clone ${options.repoURL}`;
  if (options.repoBranch) {
    command += ` --branch ${options.repoBranch}`;
  }
  if (options.repoTag) {
    command += ` --tag ${options.repoTag}`;
  }
  command += ` --variables ${options.workDir}/${CLONEY_VARIABLES_FILE_NAME}`;
  command += ` --output ${options.workDir}/${options.outputDirName}`;
  if (options.variables) {
    command += ` --variables ${options.variables}`;
  }
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
export interface CloneyDryRunCommandOptions {
  workDir: string;
  variables?: string;
}
export function runCloneyDryRunCommand(options: CloneyDryRunCommandOptions) {
  let command = `cloney dry-run ${options.workDir} --output ${options.workDir}/cloney-dry-run-results`;
  if (options.variables) {
    command += ` --variables ${options.variables}`;
  }
  let terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === "Cloney dry-run"
  );
  if (!terminal) {
    terminal = vscode.window.createTerminal("Cloney dry-run");
  }
  terminal.sendText(command);
  terminal.show();
}
