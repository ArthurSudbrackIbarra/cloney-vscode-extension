"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDockerCloneyCloneCommand = exports.runDockerCloneyStartCommand = exports.isDockerInstalled = void 0;
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
// Function to run Cloney 'start' with Docker.
function runDockerCloneyStartCommand(options) {
    let command = dockerCommand(`run --rm -it -v "${options.workDir}:/home/cloney" ${constants_1.CLONEY_DOCKER_IMAGE} cloney start --non-interactive`);
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
    let command = dockerCommand(`run --rm -it -v "${options.workDir}:/home/cloney" ${constants_1.CLONEY_DOCKER_IMAGE} cloney clone "${options.repoURL}"`);
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
    (0, vscode_2.createTerminal)("Docker Cloney Clone", command);
}
exports.runDockerCloneyCloneCommand = runDockerCloneyCloneCommand;
//# sourceMappingURL=docker.js.map