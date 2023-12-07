import * as vscode from "vscode";
import { execSync } from "child_process";

// Function to get the current version of Cloney.
export function getCloneyVersion(): string | null {
  const command = "cloney version";
  try {
    // Try to execute the 'cloney version' command.
    // If it succeeds, Cloney is installed.
    const output = execSync(command).toString();
    const versionRegex = /version ([\d\.]+)/;
    const versionMatch = versionRegex.exec(output);
    if (versionMatch) {
      return versionMatch[1];
    } else {
      return null;
    }
  } catch (error) {
    // If the command fails, Cloney is not installed.
    return null;
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
  let command = `cloney clone "${options.repoURL}"`;
  if (options.repoBranch) {
    command += ` --branch "${options.repoBranch}"`;
  }
  if (options.repoTag) {
    command += ` --tag "${options.repoTag}"`;
  }
  command += ` --output "${options.workDir}/${options.outputDirName}"`;
  if (options.variables) {
    command += ` --variables "${options.variables}"`;
  }
  let terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === "Cloney clone"
  );
  if (!terminal) {
    terminal = vscode.window.createTerminal("Cloney Clone");
  }
  terminal.sendText(command, true);
  terminal.show();
}

// Function to run Cloney 'dry-run' command.
export interface CloneyDryRunCommandOptions {
  workDir: string;
  variables?: string;
  hotReload?: boolean;
}
export function runCloneyDryRunCommand(options: CloneyDryRunCommandOptions) {
  let command = `cloney dry-run "${options.workDir}" --output "${options.workDir}/cloney-dry-run-results"`;
  if (options.variables) {
    command += ` --variables "${options.variables}"`;
  }
  if (options.hotReload) {
    command += ` --hot-reload`;
  }
  let terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === "Cloney dry-run"
  );
  if (!terminal) {
    terminal = vscode.window.createTerminal("Cloney Dry-Run");
  }
  terminal.sendText(command, true);
  terminal.show();
}
