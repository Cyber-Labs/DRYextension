import * as vscode from 'vscode';
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { Nodes, toArrowFunction } from "./transform";

export async function updateUtilFile(repeatedNode: t.File): Promise<string> {

    var convertedToFunctionNode;
    traverse(repeatedNode, {
        FunctionDeclaration(path) {
            convertedToFunctionNode = toArrowFunction(path.node);
        }
    });
    var exportNode = t.exportNamedDeclaration(convertedToFunctionNode);
    var addition = generate(exportNode).code;
    const wsPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ""; // gets the path of the first workspace folder
    const filePath = vscode.Uri.file(wsPath + '/dryco/utilFunctions.js');
    const file = await vscode.workspace.openTextDocument(filePath);
    const originalCode = file.getText();
    return `${originalCode}
${addition}`;
}
