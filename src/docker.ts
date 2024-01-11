import { EXTENSION_SETTINGS, CLONEY_DOCKER_IMAGE } from "./constants";
import { getUserSetting } from "./vscode";
import { CloneyCloneCommandOptions } from "./cloney";
import { createTerminal } from "./vscode";
import { execSync } from "child_process";

// Function to transform a command into a Docker command.
// If the user has set a custom path to the Docker executable,
// the command will be prefixed with that path.
// Otherwise, the command will be prefixed with 'docker'.
function dockerCommand(command: string): string {
  const dockerExecutablePath = getUserSetting<string>(
    EXTENSION_SETTINGS.dockerExecutablePath
  );
  if (dockerExecutablePath) {
    if (process.platform === "win32") {
      // PowerShell requires the '&' character when the executable path is quoted.
      return `& "${dockerExecutablePath}" ${command}`;
    }
    return `"${dockerExecutablePath}" ${command}`;
  } else {
    return `docker ${command}`;
  }
}

// Function to check if Docker is installed.
export function isDockerInstalled(): boolean {
  try {
    // Try to execute the 'docker version' command.
    // If it succeeds, Docker is installed.
    const command = dockerCommand("version");
    execSync(command, {
      shell: process.platform === "win32" ? "powershell.exe" : undefined,
    });
    return true;
  } catch (error) {
    // If the command fails, Docker is not installed.
    return false;
  }
}

// Function to run Cloney 'clone' with Docker.
export function runDockerCloneyCloneCommand(
  options: CloneyCloneCommandOptions
) {
  let command = dockerCommand(
    `run --rm -it -v "${options.workDir}:/home/cloney" ${CLONEY_DOCKER_IMAGE} cloney clone "${options.repoURL}"`
  );
  if (options.repoBranch) {
    command += ` --branch "${options.repoBranch}"`;
  }
  if (options.repoTag) {
    command += ` --tag "${options.repoTag}"`;
  }
  command += ` --output "${options.outputDirName}"`;
  if (options.variables) {
    command += ` --variables "${options.variables}"`;
  }
  createTerminal("Docker Cloney Clone", command);
}
