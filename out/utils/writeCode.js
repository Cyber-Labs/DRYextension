"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = exports.append = exports.write = void 0;
const fs = require("fs");
const vscode = require("vscode");
// This function replaces the entire text of the active file with the code provided.
function write(code) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error("No active editor");
    }
    const edit = new vscode.WorkspaceEdit();
    const wholeDocument = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(editor.document.lineCount, 0));
    const updateCode = new vscode.TextEdit(wholeDocument, code);
    edit.set(editor.document.uri, [updateCode]);
    vscode.workspace.applyEdit(edit);
}
exports.write = write;
function append(uri, code) {
    return __awaiter(this, void 0, void 0, function* () {
        let arr = uri.split('/');
        let fileName = arr[arr.length - 1];
        arr = fileName.split('//');
        fileName = arr[arr.length - 1];
        try {
            fs.appendFile(uri, code, () => {
                vscode.window.showInformationMessage(`${fileName} updated successully.`);
            });
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error updating ${fileName}: ${err}`);
        }
    });
}
exports.append = append;
;
function replace(uri, code) {
    return __awaiter(this, void 0, void 0, function* () {
        let arr = uri.split('/');
        let fileName = arr[arr.length - 1];
        arr = fileName.split('//');
        fileName = arr[arr.length - 1];
        try {
            fs.writeFile(uri, code, () => {
                vscode.window.showInformationMessage(`${fileName} updated successully.`);
            });
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error updating ${fileName}: ${err}`);
        }
    });
}
exports.replace = replace;
;
//# sourceMappingURL=writeCode.js.map