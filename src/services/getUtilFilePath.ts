import * as vscode from "vscode";
const path = require("path");

export const getUtilFilePath = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const wsPath = workspaceFolders ? workspaceFolders[workspaceFolders.length-1].uri.fsPath : ""; // gets the path of the first workspace folder
        
    const filePath = vscode.Uri.file(path.join(wsPath, 'utilFunctions.js'));
    return filePath;
}