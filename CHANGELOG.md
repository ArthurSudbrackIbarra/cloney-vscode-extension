# Change Log

## 0.0.4

- Added Docker support. Now Cloney commands can be run from within a Docker container.

## 0.0.3

- Added the `cloney.start` command to start a new Cloney project.
- Added missing property `variable.validate` to the `.cloney.yaml` metadata file schema.
- The extension now searches for the nearest `.cloney.yaml` file relative to the current file's path instead of always searching from the workspace root. This allows for multiple Cloney projects to be used in the same workspace.
- Added the `cloney.enableGoTemplatesSuggestions` extension setting.

## 0.0.2

- Fixed a dependency error that was preventing the extension from working.

## 0.0.1

- Initial release.
- Added snippets and autocompletion for `.cloney.yaml` and `.cloney-vars` files.
- Implemented the ability to run Cloney commands through the VSCode UI.
