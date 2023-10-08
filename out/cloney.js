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
// Function to run Cloney 'clone' command.
function runCloneyCloneCommand(workDir, repoURL, repoBranch, repoTag, outputDirName) {
    let command = `cloney clone ${repoURL}`;
    if (repoBranch) {
        command += ` --branch ${repoBranch}`;
    }
    if (repoTag) {
        command += ` --tag ${repoTag}`;
    }
    command += ` --variables ${workDir}/${constants_1.CLONEY_VARIABLES_FILE_NAME}`;
    command += ` --output ${workDir}/${outputDirName}`;
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === "Cloney clone");
    if (!terminal) {
        terminal = vscode.window.createTerminal("Cloney clone");
    }
    terminal.sendText(command);
    terminal.show();
}
exports.runCloneyCloneCommand = runCloneyCloneCommand;
// Function to run Cloney 'dry-run' command.
function runCloneyDryRunCommand(workDir) {
    const command = `cloney dry-run ${workDir} --variables ${workDir}/${constants_1.CLONEY_VARIABLES_FILE_NAME} --output ${workDir}/cloney-dry-run-results`;
    let terminal = vscode.window.terminals.find((terminal) => terminal.name === "Cloney dry-run");
    if (!terminal) {
        terminal = vscode.window.createTerminal("Cloney dry-run");
    }
    terminal.sendText(command);
    terminal.show();
}
exports.runCloneyDryRunCommand = runCloneyDryRunCommand;
//# sourceMappingURL=cloney.js.map