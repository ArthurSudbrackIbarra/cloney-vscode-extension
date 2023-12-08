"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCloneyDryRunCommand = exports.runCloneyCloneCommand = exports.getCloneyVersion = void 0;
const vscode = require("vscode");
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
        const versionRegex = /version ([\d\.]+)/;
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
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === "Cloney Clone");
    if (!terminal) {
        // If on Windows, create a new terminal with the PowerShell shell.
        // Otherwise, create a new terminal with the default shell.
        terminal = vscode.window.createTerminal("Cloney Clone", process.platform === "win32" ? "powershell.exe" : undefined);
    }
    terminal.sendText(command, true);
    terminal.show();
}
exports.runCloneyCloneCommand = runCloneyCloneCommand;
function runCloneyDryRunCommand(options) {
    let command = cloneyCommand(`dry-run "${options.workDir}" --output "${options.workDir}/cloney-dry-run-results"`);
    if (options.variables) {
        command += ` --variables "${options.variables}"`;
    }
    if (options.hotReload) {
        command += ` --hot-reload`;
    }
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === "Cloney Dry-Run");
    if (!terminal) {
        // If on Windows, create a new terminal with the PowerShell shell.
        // Otherwise, create a new terminal with the default shell.
        terminal = vscode.window.createTerminal("Cloney Dry-Run", process.platform === "win32" ? "powershell.exe" : undefined);
    }
    terminal.sendText(command, true);
    terminal.show();
}
exports.runCloneyDryRunCommand = runCloneyDryRunCommand;
//# sourceMappingURL=cloney.js.map