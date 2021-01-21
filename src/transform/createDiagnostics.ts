import * as vscode from 'vscode';
import * as Path from 'path';
import { registerModifiers } from "./registerModifiers";
import * as t from "@babel/types";


export function createDiagnostics(document: vscode.TextDocument,originalNode: t.File, loc1: t.SourceLocation, loc2: t.SourceLocation, secondURI:string): vscode.Diagnostic {
    let range = new vscode.Range(
        new vscode.Position(loc1.start.line, loc1.start.column), new vscode.Position(loc1.end.line, loc1.end.column)
    );
    let diag1 = new vscode.Diagnostic(
        range,
        'WET Code detected!',
        vscode.DiagnosticSeverity.Warning
    );
    diag1.source = 'DryCo';
    diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(
        new vscode.Location(vscode.Uri.file(secondURI),
            new vscode.Range(new vscode.Position(loc2.start.line, loc2.start.column), new vscode.Position(loc2.end.line, loc2.end.column))),
        'Similar Code here')];
    registerModifiers(diag1, originalNode);
    return diag1;
}
