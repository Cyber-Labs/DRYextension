"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiags = void 0;
const vscode = require("vscode");
const Path = require("path");
const transform_1 = require("./transform");
function updateDiags(document, collection) {
    let diagnostics = [];
    transform_1.firstInstanceSt.forEach((instance, index) => {
        let range = new vscode.Range(new vscode.Position(instance.line, instance.column), new vscode.Position(transform_1.firstInstanceEnd[index].line, transform_1.firstInstanceEnd[index].column));
        let diag1 = new vscode.Diagnostic(range, 'WET Code detected!', vscode.DiagnosticSeverity.Warning);
        diag1.source = 'DryCo';
        diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.file(transform_1.uriSecond[index]), new vscode.Range(new vscode.Position(transform_1.repInstanceSt[index].line, transform_1.repInstanceSt[index].column), new vscode.Position(transform_1.repInstanceEnd[index].line, transform_1.repInstanceEnd[index].column))), 'Similar Code here')];
        diagnostics.push(diag1);
    });
    // registerModifiers(diagnostics);
    if (document && Path.basename(document.uri.fsPath)) {
        collection.clear();
        collection.set(document.uri, diagnostics);
    }
    else {
        collection.clear();
    }
}
exports.updateDiags = updateDiags;
//# sourceMappingURL=updateDiags.js.map