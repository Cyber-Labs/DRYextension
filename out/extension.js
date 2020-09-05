"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const transform_1 = require("./transform/transform");
const transform_2 = require("./transform/transform");
function activate(context) {
    console.log('Congratulations, your extension "dryco" is now active!');
    let disposable = vscode.commands.registerCommand('dryco.convertToArrowFunction', () => {
        const code = readCode();
        const transformedCode = transform_1.transformToArrow(code);
        write(transformedCode);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('dryco.detectClone', () => {
        const code = readCode();
        const transformedCode = transform_1.detectClone(code);
        const diag_coll = vscode.languages.createDiagnosticCollection('basic-lint-1');
        if (vscode.window.activeTextEditor) {
            transform_2.updateDiags(vscode.window.activeTextEditor.document, diag_coll);
        }
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e) => {
            if (e !== undefined) {
                transform_2.updateDiags(e.document, diag_coll);
            }
        }));
        console.log(vscode.Diagnostic);
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