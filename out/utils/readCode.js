"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFrom = exports.readCode = void 0;
const vscode = require("vscode");
const fs = require("fs");
function readCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error("No active editor");
    }
    return editor.document.getText();
}
exports.readCode = readCode;
;
function readFrom(uri) {
    let arr = uri.split('/');
    let fileName = arr[arr.length - 1];
    arr = fileName.split('//');
    fileName = arr[arr.length - 1];
    const data = fs.readFileSync(uri, 'utf-8');
    return data;
}
exports.readFrom = readFrom;
//# sourceMappingURL=readCode.js.map