"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDockerCloneyValidateCommand = exports.runDockerCloneyDryRunCommand = exports.runDockerCloneyCloneCommand = exports.runDockerCloneyStartCommand = exports.isDockerInstalled = void 0;
const constants_1 = require("./constants");
const vscode_1 = require("./vscode");
const vscode_2 = require("./vscode");
const child_process_1 = require("child_process");
// Function to transform a command into a Docker command.
// If the user has set a custom path to the Docker executable,
// the command will be prefixed with that path.
// Otherwise, the command will be prefixed with 'docker'.
function dockerCommand(command) {
    const dockerExecutablePath = (0, vscode_1.getUserSetting)(constants_1.EXTENSION_SETTINGS.dockerExecutablePath);
    if (dockerExecutablePath) {
        if (process.platform === "win32") {
            // PowerShell requires the '&' character when the executable path is quoted.
            return `& "${dockerExecutablePath}" ${command}`;
        }
        return `"${dockerExecutablePath}" ${command}`;
    }
    else {
        return `docker ${command}`;
    }
}
// Function to check if Docker is installed.
function isDockerInstalled() {
    try {
        // Try to execute the 'docker version' command.
        // If it succeeds, Docker is installed.
        const command = dockerCommand("version");
        (0, child_process_1.execSync)(command, {
            shell: process.platform === "win32" ? "powershell.exe" : undefined,
        });
        return true;
    }
    catch (error) {
        // If the command fails, Docker is not installed.
        return false;
    }
}
exports.isDockerInstalled = isDockerInstalled;
// Function to get the Cloney Docker image tag.
function getDockerCloneyImageTag() {
    const dockerCloneyImageTag = (0, vscode_1.getUserSetting)(constants_1.EXTENSION_SETTINGS.cloneyDockerImageTag);
    return dockerCloneyImageTag || constants_1.CLONEY_DOCKER_IMAGE_DEFAULT_TAG;
}
// Function to run Cloney 'start' with Docker.
function runDockerCloneyStartCommand(options) {
    let command = dockerCommand(`run --rm -it --volume "${options.workDir}:/home/cloney" ${constants_1.CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney start --non-interactive`);
    command += ` --output "${options.outputDirName}"`;
    for (const author of options.authors) {
        command += ` --authors "${author}"`;
    }
    command += ` --name "${options.name}"`;
    command += ` --description "${options.description}"`;
    command += ` --license "${options.license}"`;
    (0, vscode_2.createTerminal)("Docker Cloney Start", command);
}
exports.runDockerCloneyStartCommand = runDockerCloneyStartCommand;
// Function to run Cloney 'clone' with Docker.
function runDockerCloneyCloneCommand(options) {
    let command = dockerCommand(`run --rm -it --volume "${options.workDir}:/home/cloney"`);
    if (options.variables) {
        command += ` --volume "${options.variables}:/home/cloney-vars/${constants_1.CLONEY_VARIABLES_FILE_NAME}"`;
    }
    command += ` ${constants_1.CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney clone "${options.repoURL}"`;
    if (options.repoBranch) {
        command += ` --branch "${options.repoBranch}"`;
    }
    if (options.repoTag) {
        command += ` --tag "${options.repoTag}"`;
    }
    command += ` --output "${options.outputDirName}"`;
    if (options.variables) {
        command += ` --variables "/home/cloney-vars/${constants_1.CLONEY_VARIABLES_FILE_NAME}"`;
    }
    (0, vscode_2.createTerminal)("Docker Cloney Clone", command);
}
exports.runDockerCloneyCloneCommand = runDockerCloneyCloneCommand;
// Function to run Cloney 'dry-run' with Docker.
function runDockerCloneyDryRunCommand(options) {
    let command = dockerCommand(`run --rm -it --volume "${options.workDir}:/home/cloney"`);
    if (options.variables) {
        command += ` --volume "${options.variables}:/home/cloney-vars/${constants_1.CLONEY_VARIABLES_FILE_NAME}"`;
    }
    command += ` ${constants_1.CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney dry-run`;
    if (options.variables) {
        command += ` --variables "/home/cloney-vars/${constants_1.CLONEY_VARIABLES_FILE_NAME}"`;
    }
    if (options.hotReload) {
        command += " --hot-reload";
    }
    (0, vscode_2.createTerminal)("Docker Cloney Dry-Run", command);
}
exports.runDockerCloneyDryRunCommand = runDockerCloneyDryRunCommand;
// Function to run Cloney 'validate' with Docker.
function runDockerCloneyValidateCommand(workDir) {
    const command = dockerCommand(`run --rm -it --volume "${workDir}:/home/cloney" ${constants_1.CLONEY_DOCKER_IMAGE}:${getDockerCloneyImageTag()} cloney validate`);
    (0, vscode_2.createTerminal)("Docker Cloney Validate", command);
}
exports.runDockerCloneyValidateCommand = runDockerCloneyValidateCommand;
//# sourceMappingURL=docker.js.map