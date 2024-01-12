"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPATIBLE_CLONEY_MAJOR_VERSION = exports.CONTEXT_SETTINGS = exports.CLONEY_DOCKER_IMAGE_DEFAULT_TAG = exports.CLONEY_DOCKER_IMAGE = exports.EXTENSION_SETTINGS = exports.CLONEY_EXTENSION_TEMP_DIR = exports.CLONEY_GITHUB_URL = exports.CLONEY_DOCUMENTATION_URL = exports.INSTALL_CLONEY_URL = exports.GLOBAL_STATE_KEYS = exports.DOCKER_VALIDATE_COMMAND = exports.DOCKER_START_COMMAND = exports.DOCKER_DRY_RUN_COMMAND = exports.DOCKER_CLONE_COMMAND = exports.VALIDATE_COMMAND = exports.START_COMMAND = exports.DRY_RUN_COMMAND = exports.CLONE_COMMAND = exports.OPEN_DOCUMENTATION_COMMAND = exports.CLONEY_VARIABLES_FILE_NAME = exports.CLONEY_METADATA_FILE_NAME = exports.CLONEY_VARIABLES_FILE_LANGUAGE_ID = exports.CLONEY_METADATA_FILE_LANGUAGE_ID = exports.EXTENSION_NAME = void 0;
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
exports.DOCKER_CLONE_COMMAND = "cloney.docker-clone";
exports.DOCKER_DRY_RUN_COMMAND = "cloney.docker-dry-run";
exports.DOCKER_START_COMMAND = "cloney.docker-start";
exports.DOCKER_VALIDATE_COMMAND = "cloney.docker-validate";
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
    dockerExecutablePath: "cloney.dockerExecutablePath",
    enableGoTemplatesSuggestions: "cloney.enableGoTemplatesSuggestions",
    cloneyDockerImageTag: "cloney.cloneyDockerImageTag",
};
// Defines the Cloney Docker image.
exports.CLONEY_DOCKER_IMAGE = "magicmanatee/cloney";
exports.CLONEY_DOCKER_IMAGE_DEFAULT_TAG = "1.1.0";
// Defines the names of the Cloney extension context settings.
exports.CONTEXT_SETTINGS = {
    showCloneyCommands: "cloney.showCloneyCommands",
    showCloneyDockerCommands: "cloney.showCloneyDockerCommands",
};
// Defines the compatible major version of Cloney.
exports.COMPATIBLE_CLONEY_MAJOR_VERSION = 1;
//# sourceMappingURL=constants.js.map