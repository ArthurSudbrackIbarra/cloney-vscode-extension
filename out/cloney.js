"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCloneyDryRunCommand = exports.runCloneyCloneCommand = exports.isCloneyInstalled = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
const constants_1 = require("./constants");
// Function to check if Cloney is installed or not.
function isCloneyInstalled() {
    const command = "cloney version";
    try {
        // Try to execute the 'cloney version' command.
        // If it succeeds, Cloney is installed.
        (0, child_process_1.execSync)(command);
        return true;
    }
    catch (error) {
        // If the command fails, Cloney is not installed.
        return false;
    }
}
exports.isCloneyInstalled = isCloneyInstalled;
function runCloneyCloneCommand(options) {
    let command = `cloney clone ${options.repoURL}`;
    if (options.repoBranch) {
        command += ` --branch ${options.repoBranch}`;
    }
    if (options.repoTag) {
        command += ` --tag ${options.repoTag}`;
    }
    command += ` --variables ${options.workDir}/${constants_1.CLONEY_VARIABLES_FILE_NAME}`;
    command += ` --output ${options.workDir}/${options.outputDirName}`;
    if (options.variables) {
        command += ` --variables ${options.variables}`;
    }
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === "Cloney clone");
    if (!terminal) {
        terminal = vscode.window.createTerminal("Cloney clone");
    }
    terminal.sendText(command);
    terminal.show();
}
exports.runCloneyCloneCommand = runCloneyCloneCommand;
function runCloneyDryRunCommand(options) {
    let command = `cloney dry-run ${options.workDir} --output ${options.workDir}/cloney-dry-run-results`;
    if (options.variables) {
        command += ` --variables ${options.variables}`;
    }
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === "Cloney dry-run");
    if (!terminal) {
        terminal = vscode.window.createTerminal("Cloney dry-run");
    }
    terminal.sendText(command);
    terminal.show();
}
exports.runCloneyDryRunCommand = runCloneyDryRunCommand;
//# sourceMappingURL=cloney.js.map