"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToDocumentChanges = exports.createDiagnostics = exports.refreshDiagnostics = void 0;
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
const vscode = require("vscode");
const fs = require("fs");
const transform_1 = require("./transform/transform");
const readCode_1 = require("./utils/readCode");
const extension_1 = require("./extension");
const path = require("path");
function refreshDiagnostics(doc, drycoDiagnostics) {
    var _a;
    extension_1.diagnostics.clear();
    const code = readCode_1.readFrom(doc.uri.fsPath);
    var currPath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
    if (currPath) {
        var os = require("os");
        if (os.platform() === "linux") {
            var pathArray = currPath.split("/");
            const currFile = pathArray[pathArray.length - 1];
            pathArray.pop();
            currPath = pathArray.join("/");
            fs.readdir(currPath, (err, files) => {
                files.forEach((file) => {
                    const data = fs.readFileSync(path.join(currPath, file), "utf-8");
                    transform_1.detectClone(code, data.toString(), path.join(currPath, file));
                });
            });
        }
        else {
            var pathArray = currPath.split("\\");
            const currFile = pathArray[pathArray.length - 1];
            pathArray.pop();
            currPath = pathArray.join("\\");
            fs.readdir(currPath, (err, files) => {
                files.forEach((file) => {
                    const data = fs.readFileSync(path.join(currPath, file), "utf-8");
                    transform_1.detectClone(code, data.toString(), path.join(currPath, file));
                });
            });
        }
    }
    drycoDiagnostics.set(doc.uri, Array.from(extension_1.diagnostics));
}
exports.refreshDiagnostics = refreshDiagnostics;
function createDiagnostics(document, loc1, loc2, secondURI) {
    let range = new vscode.Range(new vscode.Position(loc1.start.line, loc1.start.column), new vscode.Position(loc1.end.line, loc1.end.column));
    let diag1 = new vscode.Diagnostic(range, 'WET Code detected!', vscode.DiagnosticSeverity.Warning);
    diag1.source = 'DryCo';
    diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.file(secondURI), new vscode.Range(new vscode.Position(loc2.start.line, loc2.start.column), new vscode.Position(loc2.end.line, loc2.end.column))), 'Similar Code here')];
    return diag1;
}
exports.createDiagnostics = createDiagnostics;
function subscribeToDocumentChanges(context, drycoDiagnostics) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, drycoDiagnostics);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            refreshDiagnostics(editor.document, drycoDiagnostics);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, drycoDiagnostics)));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => drycoDiagnostics.delete(doc.uri)));
}
exports.subscribeToDocumentChanges = subscribeToDocumentChanges;
//# sourceMappingURL=diagnostics.js.map