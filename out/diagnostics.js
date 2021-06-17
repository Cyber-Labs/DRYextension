"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToDocumentChanges = exports.createDiagnostics = exports.refreshDiagnostics = void 0;
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
const vscode = require("vscode");
const readCode_1 = require("./utils/readCode");
const extension_1 = require("./extension");
const callDetectClone_1 = require("./services/callDetectClone");
const getPath_1 = require("./utils/getPath");
const path = require("path");
function refreshDiagnostics(doc, drycoDiagnostics) {
    var _a;
    extension_1.diagnostics.clear();
    const code = readCode_1.readFrom(doc.uri.fsPath);
    var currPath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
    let currFile;
    if (currPath) {
        currPath = getPath_1.getCurrDir();
        currFile = getPath_1.getCurrFile();
        callDetectClone_1.callDetectClone(code, currPath, currFile);
    }
    drycoDiagnostics.set(doc.uri, Array.from(extension_1.diagnostics));
}
exports.refreshDiagnostics = refreshDiagnostics;
function createDiagnostics(document, loc1, loc2, secondURI) {
    let range = new vscode.Range(new vscode.Position(loc1.start.line - 1, loc1.start.column), new vscode.Position(loc1.end.line - 1, loc1.end.column));
    let diag1 = new vscode.Diagnostic(range, 'WET Code detected!', vscode.DiagnosticSeverity.Warning);
    diag1.source = 'DryCo';
    diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.file(secondURI), new vscode.Range(new vscode.Position(loc2.start.line - 1, loc2.start.column), new vscode.Position(loc2.end.line - 1, loc2.end.column))), 'Similar Code here')];
    return diag1;
}
exports.createDiagnostics = createDiagnostics;
function subscribeToDocumentChanges(context, drycoDiagnostics) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, drycoDiagnostics);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(_editor => {
        drycoDiagnostics.clear();
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => drycoDiagnostics.clear()));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(e => drycoDiagnostics.clear()));
}
exports.subscribeToDocumentChanges = subscribeToDocumentChanges;
//# sourceMappingURL=diagnostics.js.map