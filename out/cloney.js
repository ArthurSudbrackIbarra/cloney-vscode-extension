"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCloneyValidateCommand = exports.runCloneyDryRunCommand = exports.runCloneyCloneCommand = exports.runCloneyStartCommand = exports.isCloneyVersionCompatible = exports.isCloneyInstalled = exports.getCloneyVersion = void 0;
const child_process_1 = require("child_process");
const vscode_1 = require("./vscode");
const constants_1 = require("./constants");
// Function to transform a command into a Cloney command.
// If the user has set a custom path to the Cloney executable,
// the command will be prefixed with that path.
// Otherwise, the command will be prefixed with 'cloney'.
function cloneyCommand(command) {
    const cloneyExecutablePath = (0, vscode_1.getUserSetting)(constants_1.EXTENSION_SETTINGS.cloneyExecutablePath);
    if (cloneyExecutablePath) {
        if (process.platform === "win32") {
            // PowerShell requires the '&' character when the executable path is quoted.
            return `& "${cloneyExecutablePath}" ${command}`;
        }
        return `"${cloneyExecutablePath}" ${command}`;
    }
    else {
        return `cloney ${command}`;
    }
}
// Function to get the current version of Cloney.
function getCloneyVersion() {
    try {
        // Try to execute the 'cloney version' command.
        // If it succeeds, Cloney is installed.
        const command = cloneyCommand("version");
        const output = (0, child_process_1.execSync)(command, {
            shell: process.platform === "win32" ? "powershell.exe" : undefined,
        }).toString();
        const versionRegex = /(\d+\.\d+\.\d+)/;
        const versionMatch = versionRegex.exec(output);
        if (versionMatch) {
            return versionMatch[1];
        }
        else {
            return null;
        }
    }
    catch (error) {
        // If the command fails, Cloney is not installed.
        return null;
    }
}
exports.getCloneyVersion = getCloneyVersion;
// Function to check if Cloney is installed.
function isCloneyInstalled() {
    return getCloneyVersion() !== null;
}
exports.isCloneyInstalled = isCloneyInstalled;
// Function to check if a version of Cloney is compatible with a given major version.
// For example, if the given version is '1.2.3', and the given major version is '1',
// this function will return 'true'. If the given version is '2.0.0', this function
// will return 'false'.
function isCloneyVersionCompatible(version, majorVersion) {
    const versionRegex = /(\d+)\.(\d+)\.(\d+)/;
    const versionMatch = versionRegex.exec(version);
    if (versionMatch) {
        const versionMajor = parseInt(versionMatch[1]);
        return versionMajor === majorVersion;
    }
    else {
        return false;
    }
}
exports.isCloneyVersionCompatible = isCloneyVersionCompatible;
function runCloneyStartCommand(options) {
    let command = cloneyCommand("start --non-interactive");
    command += ` --output "${options.workDir}/${options.outputDirName}"`;
    for (const author of options.authors) {
        command += ` --authors "${author}"`;
    }
    command += ` --name "${options.name}"`;
    command += ` --description "${options.description}"`;
    command += ` --license "${options.license}"`;
    (0, vscode_1.createTerminal)("Cloney Start", command);
}
exports.runCloneyStartCommand = runCloneyStartCommand;
function runCloneyCloneCommand(options) {
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
    (0, vscode_1.createTerminal)("Cloney Clone", command);
}
exports.runCloneyCloneCommand = runCloneyCloneCommand;
function runCloneyDryRunCommand(options) {
    let command = cloneyCommand(`dry-run "${options.workDir}" --output "${options.workDir}/cloney-dry-run-results"`);
    if (options.variables) {
        command += ` --variables "${options.variables}"`;
    }
    if (options.hotReload) {
        command += " --hot-reload";
    }
    (0, vscode_1.createTerminal)("Cloney Dry Run", command);
}
exports.runCloneyDryRunCommand = runCloneyDryRunCommand;
// Function to run Cloney 'validate' command.
function runCloneyValidateCommand(workDir) {
    const command = cloneyCommand(`validate "${workDir}"`);
    (0, vscode_1.createTerminal)("Cloney Validate", command);
}
exports.runCloneyValidateCommand = runCloneyValidateCommand;
//# sourceMappingURL=cloney.js.map