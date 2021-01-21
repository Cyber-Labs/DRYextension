"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCode = void 0;
const vscode = require("vscode");
function readCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error("No active editor");
    }
    return editor.document.getText();
}
exports.readCode = readCode;
//# sourceMappingURL=readCode.js.map