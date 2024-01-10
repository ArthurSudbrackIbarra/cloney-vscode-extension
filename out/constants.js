"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPATIBLE_CLONEY_MAJOR_VERSION = exports.EXTENSION_SETTINGS = exports.CLONEY_EXTENSION_TEMP_DIR = exports.CLONEY_GITHUB_URL = exports.CLONEY_DOCUMENTATION_URL = exports.INSTALL_CLONEY_URL = exports.GLOBAL_STATE_KEYS = exports.VALIDATE_COMMAND = exports.START_COMMAND = exports.DRY_RUN_COMMAND = exports.CLONE_COMMAND = exports.OPEN_DOCUMENTATION_COMMAND = exports.CLONEY_VARIABLES_FILE_NAME = exports.CLONEY_METADATA_FILE_NAME = exports.CLONEY_VARIABLES_FILE_LANGUAGE_ID = exports.CLONEY_METADATA_FILE_LANGUAGE_ID = exports.EXTENSION_NAME = void 0;
const os_1 = require("os");
// Defines the name of the Cloney extension.
exports.EXTENSION_NAME = "cloney";
// Defines the language IDs for Cloney metadata and variables files.
exports.CLONEY_METADATA_FILE_LANGUAGE_ID = "cloney-metadata-file";
exports.CLONEY_VARIABLES_FILE_LANGUAGE_ID = "cloney-variables-file";
// Defines the file names for Cloney metadata and variables files.
exports.CLONEY_METADATA_FILE_NAME = ".cloney.yaml";
exports.CLONEY_VARIABLES_FILE_NAME = ".cloney-vars.yaml";
// Defines the commands for Cloney extension.
exports.OPEN_DOCUMENTATION_COMMAND = "cloney.open-documentation";
exports.CLONE_COMMAND = "cloney.clone";
exports.DRY_RUN_COMMAND = "cloney.dry-run";
exports.START_COMMAND = "cloney.start";
exports.VALIDATE_COMMAND = "cloney.validate";
// Defines the global state keys for Cloney extension.
exports.GLOBAL_STATE_KEYS = {
    lastStarPopUpTime: "cloney.lastStarPopUpTime",
    stopRemindingToStar: "cloney.stopRemindingToStar",
};
// Defines the URLs for Cloney documentation.
exports.INSTALL_CLONEY_URL = "https://arthursudbrackibarra.github.io/cloney-documentation/getting-started/#installing-cloney";
exports.CLONEY_DOCUMENTATION_URL = "https://arthursudbrackibarra.github.io/cloney-documentation/";
exports.CLONEY_GITHUB_URL = "https://github.com/ArthurSudbrackIbarra/cloney";
// Defines the temporary directory for Cloney extension.
exports.CLONEY_EXTENSION_TEMP_DIR = `${(0, os_1.tmpdir)()}/cloney-vscode-extension`;
// Defines the names of the Cloney extension user settings.
exports.EXTENSION_SETTINGS = {
    cloneyExecutablePath: "cloney.cloneyExecutablePath",
    enableGoTemplatesSuggestions: "cloney.enableGoTemplatesSuggestions",
};
// Defines the compatible major version of Cloney.
exports.COMPATIBLE_CLONEY_MAJOR_VERSION = 1;
//# sourceMappingURL=constants.js.map