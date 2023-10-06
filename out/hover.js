"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloneyMetadataHoverProvider = void 0;
const vscode = require("vscode");
class CloneyMetadataHoverProvider {
    provideHover(document, position, _token) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        const metadata = this.getHoverTextForWord(word);
        if (metadata) {
            return new vscode.Hover(metadata);
        }
    }
    getHoverTextForWord(word) {
        switch (word) {
            case "manifest_version":
                return "The version of this Cloney manifest file, ensuring compatibility with different versions of Cloney.";
            case "name":
                return "The name of your template, providing a clear identifier for users.";
            case "description":
                return "A brief but informative description of your template's purpose and functionality.";
            case "template_version":
                "The version number of your template. Update it as you make new changes to your template.";
            case "authors":
                return "A list of contributors or creators of the template, acknowledging their role in its development.";
            case "configuration":
                return "A list of configuration options for your template, allowing users to customize their experience.";
            case "ignore_paths":
                return "A list of paths to ignore when cloning the template. This is useful for excluding files that are not relevant to the template's customization process.";
            case "variables":
                return "A list of variables that users can customize during the cloning process.";
        }
    }
}
exports.CloneyMetadataHoverProvider = CloneyMetadataHoverProvider;
//# sourceMappingURL=hover.js.map