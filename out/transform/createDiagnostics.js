"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiagnostics = void 0;
const vscode = require("vscode");
const registerModifiers_1 = require("./registerModifiers");
function createDiagnostics(document, originalNode, loc1, loc2, secondURI) {
    let range = new vscode.Range(new vscode.Position(loc1.start.line, loc1.start.column), new vscode.Position(loc1.end.line, loc1.end.column));
    let diag1 = new vscode.Diagnostic(range, 'WET Code detected!', vscode.DiagnosticSeverity.Warning);
    diag1.source = 'DryCo';
    diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.file(secondURI), new vscode.Range(new vscode.Position(loc2.start.line, loc2.start.column), new vscode.Position(loc2.end.line, loc2.end.column))), 'Similar Code here')];
    registerModifiers_1.registerModifiers(diag1, originalNode);
    return diag1;
}
exports.createDiagnostics = createDiagnostics;
//# sourceMappingURL=createDiagnostics.js.map