/* eslint-disable curly */
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import * as t from "@babel/types";
import * as fs from "fs";

import { detectClone } from "./transform/transform";
import { readFrom } from "./utils/readCode";
import { diagnostics } from './extension';
const path = require("path");


export function refreshDiagnostics(doc: vscode.TextDocument, drycoDiagnostics: vscode.DiagnosticCollection):void{
    diagnostics.clear();
    const code = readFrom(doc.uri.fsPath);
    var currPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (currPath) {
      var os = require("os");
      if (os.platform() === "linux") {
        var pathArray = currPath.split("/");
        const currFile = pathArray[pathArray.length - 1];
        pathArray.pop();
        currPath = pathArray.join("/");
        fs.readdir(currPath, (err, files: string[]) => {
          files.forEach((file) => {
              const data = fs.readFileSync(path.join(currPath, file), "utf-8");
            detectClone(
              code,
              data.toString(),
              path.join(currPath, file)
            );
          });
        });
      } else {
        var pathArray = currPath.split("\\");
        const currFile = pathArray[pathArray.length - 1];
        pathArray.pop();
        currPath = pathArray.join("\\");
        fs.readdir(currPath, (err, files: string[]) => {
          files.forEach((file) => {
            const data = fs.readFileSync(path.join(currPath, file), "utf-8");
            detectClone(
              code,
              data.toString(),
              path.join(currPath, file)
            );
          });
        });
      }
    }

    drycoDiagnostics.set(doc.uri, Array.from(diagnostics));
}



export function createDiagnostics(document: vscode.TextDocument, loc1: t.SourceLocation, loc2: t.SourceLocation, secondURI:string): vscode.Diagnostic {
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
    return diag1;
}



export function subscribeToDocumentChanges(context: vscode.ExtensionContext, drycoDiagnostics: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, drycoDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, drycoDiagnostics);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, drycoDiagnostics))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => drycoDiagnostics.delete(doc.uri))
	);

}