// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as constants from "./constants";
import {
  getCloneyVersion,
  isCloneyVersionCompatible,
  runCloneyCloneCommand,
  runCloneyDryRunCommand,
  runCloneyValidateCommand,
} from "./cloney";
import { CloneyMetadataCompletionProvider } from "./metadata-file/completion";
import { CloneyMetadataHoverProvider } from "./metadata-file/hover";
import { CloneyVariablesCompletionProvider } from "./variables-file/completion";
import { CloneyGoTemplatesCompletionProvider } from "./go-templates/completion";
import { rmSync } from "fs";

// Function to check if Cloney is installed and if the version is compatible with the extension.
function isCloneySetUp(): boolean {
  // Check if Cloney is installed.
  const cloneyVersion = getCloneyVersion();
  if (!cloneyVersion) {
    vscode.window
      .showErrorMessage(
        "It appears that you do not have Cloney installed. Install it to make full use of this extension.",
        "Install Cloney",
        "Configure Executable Path",
        "Dismiss"
      )
      .then((response) => {
        if (response === "Install Cloney") {
          vscode.env.openExternal(
            vscode.Uri.parse(constants.INSTALL_CLONEY_URL)
          );
        } else if (response === "Configure Executable Path") {
          vscode.commands.executeCommand(
            "workbench.action.openSettings",
            constants.EXTENSION_SETTINGS.cloneyExecutablePath
          );
        }
      });
    return false;
  }

  // Check if Cloney is compatible.
  const isVersionCompatible = isCloneyVersionCompatible(
    cloneyVersion,
    constants.COMPATIBLE_CLONEY_MAJOR_VERSION
  );
  if (!isVersionCompatible) {
    vscode.window
      .showWarningMessage(
        `It appears that you have Cloney "${cloneyVersion}" installed. This extension is designed to work with Cloney in versions "${constants.COMPATIBLE_CLONEY_MAJOR_VERSION}.x.x". It is *highly* recommended that you install the proper version of Cloney.`,
        "Install Cloney",
        "Dismiss"
      )
      .then((response) => {
        if (response === "Install Cloney") {
          vscode.env.openExternal(
            vscode.Uri.parse(constants.INSTALL_CLONEY_URL)
          );
        }
      });
  }
  return true;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  console.log("Cloney extension activated.");

  // Check if Cloney is installed and the version is compatible with the extension.
  await isCloneySetUp();

  // Completion providers.
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      constants.CLONEY_METADATA_FILE_LANGUAGE_ID,
      new CloneyMetadataCompletionProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      constants.CLONEY_VARIABLES_FILE_LANGUAGE_ID,
      new CloneyVariablesCompletionProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "*",
      new CloneyGoTemplatesCompletionProvider()
    )
  );

  // Hover providers.
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      constants.CLONEY_METADATA_FILE_LANGUAGE_ID,
      new CloneyMetadataHoverProvider()
    )
  );

  // Commands.

  // Open Documentation.
  context.subscriptions.push(
    vscode.commands.registerCommand(
      constants.OPEN_DOCUMENTATION_COMMAND,
      () => {
        vscode.env.openExternal(
          vscode.Uri.parse(constants.CLONEY_DOCUMENTATION_URL)
        );
      }
    )
  );

  // Clone.
  context.subscriptions.push(
    vscode.commands.registerCommand(constants.CLONE_COMMAND, async () => {
      // Do not run this command if Cloney is not set up.
      if (!isCloneySetUp()) {
        return;
      }

      // Work directory.
      const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workDir) {
        vscode.window.showErrorMessage(
          "Cloney clone failed. Please open a folder first."
        );
        return;
      }

      // Template repository.
      const repoURL = await vscode.window.showInputBox({
        title: "Cloney Template Repository URL",
        prompt: "Enter the Cloney template repository URL",
        placeHolder: "https://github.com/username/repository.git",
        ignoreFocusOut: true,
      });
      if (!repoURL) {
        return;
      }
      const branchTagOption = await vscode.window.showQuickPick(
        ["Refence by Branch", "Reference by Tag"],
        {
          title: "Cloney Template Repository Version",
          placeHolder: "Select the repository version",
          ignoreFocusOut: true,
        }
      );
      if (!branchTagOption) {
        return;
      }
      let repoBranch: string | undefined;
      let repoTag: string | undefined;
      if (branchTagOption === "Refence by Branch") {
        repoBranch = await vscode.window.showInputBox({
          title: "Cloney Template Repository Branch",
          prompt: "Enter the Cloney template repository branch",
          value: "main",
          placeHolder: "main",
          ignoreFocusOut: true,
        });
        if (!repoBranch) {
          return;
        }
      } else {
        repoTag = await vscode.window.showInputBox({
          title: "Cloney Template Repository Tag",
          prompt: "Enter the Cloney template repository tag",
          placeHolder: "1.0.0",
          ignoreFocusOut: true,
        });
        if (!repoTag) {
          return;
        }
      }

      // Output directory.
      const outputDirName = await vscode.window.showInputBox({
        title: "Target Directory Name",
        prompt: "Enter the target directory, where the template will be cloned",
        placeHolder: "clone-output",
        ignoreFocusOut: true,
      });
      if (!outputDirName) {
        return;
      }

      // Variables file.
      const shouldSelectVariablesFile = await vscode.window.showQuickPick(
        ["Yes", "No"],
        {
          title: "Variables File",
          placeHolder: "Would you like to select a variables file?",
          ignoreFocusOut: true,
        }
      );
      if (!shouldSelectVariablesFile) {
        return;
      }
      let variablesFile: vscode.Uri[] | undefined;
      if (shouldSelectVariablesFile === "Yes") {
        variablesFile = await vscode.window.showOpenDialog({
          title: "Variables File",
          defaultUri: vscode.Uri.file(
            `${workDir}/${constants.CLONEY_VARIABLES_FILE_NAME}`
          ),
          canSelectFiles: true,
          canSelectFolders: false,
          canSelectMany: false,
          filters: {
            "Cloney Variables File": ["yaml", "yml"],
          },
          openLabel: "Select Variables File",
        });
        if (!variablesFile) {
          return;
        }
      }

      // Run the command.
      runCloneyCloneCommand({
        workDir,
        repoURL,
        repoBranch,
        repoTag,
        outputDirName,
        variables: variablesFile?.[0].fsPath,
      });
    })
  );

  // Dry Run.
  context.subscriptions.push(
    vscode.commands.registerCommand(constants.DRY_RUN_COMMAND, async () => {
      // Do not run this command if Cloney is not set up.
      if (!isCloneySetUp()) {
        return;
      }

      // Work directory.
      const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workDir) {
        vscode.window.showErrorMessage(
          "Cloney dry-run failed. Please open a folder first."
        );
        return;
      }
      const shouldSelectVariablesFile = await vscode.window.showQuickPick(
        ["Yes", "No"],
        {
          title: "Variables File",
          placeHolder: "Would you like to select a variables file?",
          ignoreFocusOut: true,
        }
      );
      if (!shouldSelectVariablesFile) {
        return;
      }

      // Variables file.
      let variablesFile: vscode.Uri[] | undefined;
      if (shouldSelectVariablesFile === "Yes") {
        variablesFile = await vscode.window.showOpenDialog({
          title: "Variables File",
          defaultUri: vscode.Uri.file(
            `${workDir}/${constants.CLONEY_VARIABLES_FILE_NAME}`
          ),
          canSelectFiles: true,
          canSelectFolders: false,
          canSelectMany: false,
          filters: {
            "Cloney Variables File": ["yaml", "yml"],
          },
          openLabel: "Select Variables File",
        });
        if (!variablesFile) {
          return;
        }
      }

      // Hot reload.
      const hotReload = await vscode.window.showQuickPick(["Yes", "No"], {
        title: "Hot Reload",
        placeHolder: "Would you like to enable hot reload?",
        ignoreFocusOut: true,
      });
      if (!hotReload) {
        return;
      }

      // Run the command.
      runCloneyDryRunCommand({
        workDir,
        variables: variablesFile?.[0].fsPath,
        hotReload: hotReload === "Yes",
      });
    })
  );

  // Validate.
  context.subscriptions.push(
    vscode.commands.registerCommand(constants.VALIDATE_COMMAND, async () => {
      // Do not run this command if Cloney is not set up.
      if (!isCloneySetUp()) {
        return;
      }

      // Work directory.
      const workDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workDir) {
        vscode.window.showErrorMessage(
          "Cloney validate failed. Please open a folder first."
        );
        return;
      }

      // Run the command.
      runCloneyValidateCommand(workDir);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("Cloney extension deactivated.");

  // On deactivation, delete contents of the temp directory.
  try {
    rmSync(constants.CLONEY_EXTENSION_TEMP_DIR, { recursive: true });
  } catch (error) {}
}
