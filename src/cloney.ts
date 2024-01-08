import { execSync } from "child_process";
import { getUserSetting, createTerminal } from "./vscode";
import { EXTENSION_SETTINGS } from "./constants";

// Function to transform a command into a Cloney command.
// If the user has set a custom path to the Cloney executable,
// the command will be prefixed with that path.
// Otherwise, the command will be prefixed with 'cloney'.
function cloneyCommand(command: string): string {
  const cloneyExecutablePath = getUserSetting<string>(
    EXTENSION_SETTINGS.cloneyExecutablePath
  );
  if (cloneyExecutablePath) {
    if (process.platform === "win32") {
      // PowerShell requires the '&' character when the executable path is quoted.
      return `& "${cloneyExecutablePath}" ${command}`;
    }
    return `"${cloneyExecutablePath}" ${command}`;
  } else {
    return `cloney ${command}`;
  }
}

// Function to get the current version of Cloney.
export function getCloneyVersion(): string | null {
  try {
    // Try to execute the 'cloney version' command.
    // If it succeeds, Cloney is installed.
    const command = cloneyCommand("version");
    const output = execSync(command, {
      shell: process.platform === "win32" ? "powershell.exe" : undefined,
    }).toString();
    const versionRegex = /(\d+\.\d+\.\d+)/;
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

// Function to check if a version of Cloney is compatible with a given major version.
// For example, if the given version is '1.2.3', and the given major version is '1',
// this function will return 'true'. If the given version is '2.0.0', this function
// will return 'false'.
export function isCloneyVersionCompatible(
  version: string,
  majorVersion: number
): boolean {
  const versionRegex = /(\d+)\.(\d+)\.(\d+)/;
  const versionMatch = versionRegex.exec(version);
  if (versionMatch) {
    const versionMajor = parseInt(versionMatch[1]);
    return versionMajor === majorVersion;
  } else {
    return false;
  }
}

// Function to run Cloney 'start' command.
export interface CloneyStartCommandOptions {
  workDir: string;
  authors: string[];
  description: string;
  license: string;
  name: string;
  outputDirName: string;
}
export function runCloneyStartCommand(options: CloneyStartCommandOptions) {
  let command = cloneyCommand("start --non-interactive");
  command += ` --output "${options.workDir}/${options.outputDirName}"`;
  for (const author of options.authors) {
    command += ` --authors "${author}"`;
  }
  command += ` --name "${options.name}"`;
  command += ` --description "${options.description}"`;
  command += ` --license "${options.license}"`;
  createTerminal("Cloney Start", command);
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
  let command = cloneyCommand(`clone "${options.repoURL}"`);
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
  createTerminal("Cloney Clone", command);
}

// Function to run Cloney 'dry-run' command.
export interface CloneyDryRunCommandOptions {
  workDir: string;
  variables?: string;
  hotReload?: boolean;
}
export function runCloneyDryRunCommand(options: CloneyDryRunCommandOptions) {
  let command = cloneyCommand(
    `dry-run "${options.workDir}" --output "${options.workDir}/cloney-dry-run-results"`
  );
  if (options.variables) {
    command += ` --variables "${options.variables}"`;
  }
  if (options.hotReload) {
    command += " --hot-reload";
  }
  createTerminal("Cloney Dry Run", command);
}

// Function to run Cloney 'validate' command.
export function runCloneyValidateCommand(workDir: string) {
  const command = cloneyCommand(`validate "${workDir}"`);
  createTerminal("Cloney Validate", command);
}
