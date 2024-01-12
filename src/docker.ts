import {
  EXTENSION_SETTINGS,
  CLONEY_DOCKER_IMAGE,
  CLONEY_VARIABLES_FILE_NAME,
  CLONEY_DOCKER_IMAGE_DEFAULT_TAG,
} from "./constants";
import { getUserSetting } from "./vscode";
import {
  CloneyStartCommandOptions,
  CloneyCloneCommandOptions,
  CloneyDryRunCommandOptions,
} from "./cloney";
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

// Function to get the Cloney Docker image tag.
function getDockerCloneyImageTag(): string {
  const dockerCloneyImageTag = getUserSetting<string>(
    EXTENSION_SETTINGS.cloneyDockerImageTag
  );
  return dockerCloneyImageTag || CLONEY_DOCKER_IMAGE_DEFAULT_TAG;
}

// Function to run Cloney 'start' with Docker.
export function runDockerCloneyStartCommand(
  options: CloneyStartCommandOptions
) {
  let command = dockerCommand(
    `run --rm -it --volume "${
      options.workDir
    }:/home/cloney" ${CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney start --non-interactive`
  );
  command += ` --output "${options.outputDirName}"`;
  for (const author of options.authors) {
    command += ` --authors "${author}"`;
  }
  command += ` --name "${options.name}"`;
  command += ` --description "${options.description}"`;
  command += ` --license "${options.license}"`;
  createTerminal("Docker Cloney Start", command);
}

// Function to run Cloney 'clone' with Docker.
export function runDockerCloneyCloneCommand(
  options: CloneyCloneCommandOptions
) {
  let command = dockerCommand(
    `run --rm -it --volume "${options.workDir}:/home/cloney"`
  );
  if (options.variables) {
    command += ` --volume "${options.variables}:/home/cloney-vars/${CLONEY_VARIABLES_FILE_NAME}"`;
  }
  command += ` ${CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney clone "${
    options.repoURL
  }"`;
  if (options.repoBranch) {
    command += ` --branch "${options.repoBranch}"`;
  }
  if (options.repoTag) {
    command += ` --tag "${options.repoTag}"`;
  }
  command += ` --output "${options.outputDirName}"`;
  if (options.variables) {
    command += ` --variables "/home/cloney-vars/${CLONEY_VARIABLES_FILE_NAME}"`;
  }
  createTerminal("Docker Cloney Clone", command);
}

// Function to run Cloney 'dry-run' with Docker.
export function runDockerCloneyDryRunCommand(
  options: CloneyDryRunCommandOptions
) {
  let command = dockerCommand(
    `run --rm -it --volume "${options.workDir}:/home/cloney"`
  );
  if (options.variables) {
    command += ` --volume "${options.variables}:/home/cloney-vars/${CLONEY_VARIABLES_FILE_NAME}"`;
  }
  command += ` ${CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney dry-run`;
  if (options.variables) {
    command += ` --variables "/home/cloney-vars/${CLONEY_VARIABLES_FILE_NAME}"`;
  }
  if (options.hotReload) {
    command += " --hot-reload";
  }
  createTerminal("Docker Cloney Dry-Run", command);
}

// Function to run Cloney 'validate' with Docker.
export function runDockerCloneyValidateCommand(workDir: string) {
  const command = dockerCommand(
    `run --rm -it --volume "${workDir}:/home/cloney" ${CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney validate`
  );
  createTerminal("Docker Cloney Validate", command);
}
