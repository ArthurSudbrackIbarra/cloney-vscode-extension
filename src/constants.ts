import { tmpdir } from "os";

// Defines the name of the Cloney extension.
export const EXTENSION_NAME = "cloney";

// Defines the language IDs for Cloney metadata and variables files.
export const CLONEY_METADATA_FILE_LANGUAGE_ID = "cloney-metadata-file";
export const CLONEY_VARIABLES_FILE_LANGUAGE_ID = "cloney-variables-file";

// Defines the file names for Cloney metadata and variables files.
export const CLONEY_METADATA_FILE_NAME = ".cloney.yaml";
export const CLONEY_VARIABLES_FILE_NAME = ".cloney-vars.yaml";

// Defines the commands for Cloney extension.
export const OPEN_DOCUMENTATION_COMMAND = "cloney.open-documentation";
export const CLONE_COMMAND = "cloney.clone";
export const DRY_RUN_COMMAND = "cloney.dry-run";
export const VALIDATE_COMMAND = "cloney.validate";

// Defines the global state keys for Cloney extension.
export const GLOBAL_STATE_KEYS = {
  lastStarPopUpTime: "cloney.lastStarPopUpTime",
  stopRemindingToStar: "cloney.stopRemindingToStar",
};

// Defines the URLs for Cloney documentation.
export const INSTALL_CLONEY_URL =
  "https://arthursudbrackibarra.github.io/cloney-documentation/getting-started/#installing-cloney";
export const CLONEY_DOCUMENTATION_URL =
  "https://arthursudbrackibarra.github.io/cloney-documentation/";
export const CLONEY_GITHUB_URL =
  "https://github.com/ArthurSudbrackIbarra/cloney";

// Defines the temporary directory for Cloney extension.
export const CLONEY_EXTENSION_TEMP_DIR = `${tmpdir()}/cloney-vscode-extension`;

// Defines the names of the Cloney extension user settings.
export const EXTENSION_SETTINGS = {
  cloneyExecutablePath: "cloney.cloneyExecutablePath",
};

// Defines the compatible major version of Cloney.
export const COMPATIBLE_CLONEY_MAJOR_VERSION = 1;
