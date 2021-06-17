"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUtilFilePath = void 0;
const vscode = require("vscode");
const path = require("path");
exports.getUtilFilePath = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const wsPath = workspaceFolders ? workspaceFolders[workspaceFolders.length - 1].uri.fsPath : ""; // gets the path of the first workspace folder
    const filePath = vscode.Uri.file(path.join(wsPath, 'utilFunctions.js'));
    return filePath;
};
//# sourceMappingURL=getUtilFilePath.js.map