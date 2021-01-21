import * as vscode from 'vscode';
import * as Path from 'path';
import { registerModifiers } from "./registerModifiers";
import { firstInstanceSt, firstInstanceEnd, uriSecond, repInstanceSt, repInstanceEnd, Nodes } from "./transform";


export function updateDiags(document: vscode.TextDocument,
    collection: vscode.DiagnosticCollection): void {
    let diagnostics: vscode.Diagnostic[] = [];
    firstInstanceSt.forEach((instance, index) => {
        let range = new vscode.Range(
            new vscode.Position(instance.line, instance.column), new vscode.Position(firstInstanceEnd[index].line, firstInstanceEnd[index].column)
        );
        let diag1 = new vscode.Diagnostic(
            range,
            'WET Code detected!',
            vscode.DiagnosticSeverity.Warning
        );
        diag1.source = 'DryCo';
        diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(
            new vscode.Location(vscode.Uri.file(uriSecond[index]),
                new vscode.Range(new vscode.Position(repInstanceSt[index].line, repInstanceSt[index].column), new vscode.Position(repInstanceEnd[index].line, repInstanceEnd[index].column))),
            'Similar Code here')];
        diagnostics.push(diag1);
    });
    // registerModifiers(diagnostics);
    if (document && Path.basename(document.uri.fsPath)) {
        collection.clear();
        collection.set(document.uri, diagnostics);
    } else {
        collection.clear();
    }
}
