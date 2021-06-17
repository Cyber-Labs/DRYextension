/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import * as t from "@babel/types";
import { readFrom } from "./utils/readCode";
import { diagnostics } from './extension';
import { callDetectClone } from './services/callDetectClone';
import { getCurrDir, getCurrFile } from './utils/getPath';
const path = require("path");


export function refreshDiagnostics(doc: vscode.TextDocument, drycoDiagnostics: vscode.DiagnosticCollection):void{
    diagnostics.clear();
    const code = readFrom(doc.uri.fsPath);
    var currPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    let currFile:string;
    if (currPath) {
      currPath = getCurrDir();
      currFile = getCurrFile();
      callDetectClone(code, currPath, currFile);
    }

    drycoDiagnostics.set(doc.uri, Array.from(diagnostics));
}



export function createDiagnostics(document: vscode.TextDocument, loc1: t.SourceLocation, loc2: t.SourceLocation, secondURI:string): vscode.Diagnostic {
    let range = new vscode.Range(
        new vscode.Position(loc1.start.line-1, loc1.start.column), new vscode.Position(loc1.end.line-1, loc1.end.column)
    );
    let diag1 = new vscode.Diagnostic(
        range,
        'WET Code detected!',
        vscode.DiagnosticSeverity.Warning
    );
    diag1.source = 'DryCo';
    diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(
        new vscode.Location(vscode.Uri.file(secondURI),
            new vscode.Range(new vscode.Position(loc2.start.line-1, loc2.start.column), new vscode.Position(loc2.end.line-1, loc2.end.column))),
        'Similar Code here')];
    return diag1;
}



export function subscribeToDocumentChanges(context: vscode.ExtensionContext, drycoDiagnostics: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, drycoDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(_editor => {
      drycoDiagnostics.clear();
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => drycoDiagnostics.clear())
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(e => drycoDiagnostics.clear())
	);
}