"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const transform_1 = require("./transform/transform");
const fs = require("fs");
function activate(context) {
    console.log('Congratulations, your extension "dryco" is now active!');
    let disposable = vscode.commands.registerCommand('dryco.convertToArrowFunction', () => {
        const code = readCode();
        const transformedCode = transform_1.transformToArrow(code);
        write(transformedCode);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('dryco.detectClone', () => {
        var _a;
        const code = readCode();
        var currPath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
        if (currPath) {
            var pathArray = currPath.split("\\");
            pathArray.pop();
            currPath = pathArray.join('\\');
            fs.readdir(currPath, (err, files) => {
                files.forEach((file) => {
                    fs.readFile(`${currPath}\\${file}`, 'utf8', (err, data) => {
                        if (err) {
                            throw err;
                        }
                        const transformedCode = transform_1.detectClone(code, data, `${currPath}\\${file}`);
                    });
                });
            });
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw new Error("No active editor");
        }
        const diagColl = vscode.languages.createDiagnosticCollection(`Dryco ${editor}`);
        if (vscode.window.activeTextEditor) {
            transform_1.updateDiags(vscode.window.activeTextEditor.document, diagColl);
        }
        // write(transformedCode);
    }));
}
exports.activate = activate;
function readCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error("No active editor");
    }
    return editor.document.getText();
}
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map