import * as vscode from "vscode";
import { convertPath } from "../utils/convertPath";
import { updateUtilFile } from "./updateUtilFile";
import * as t from "@babel/types";
import { codeActions } from "../extension";
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/naming-convention
async function DrycoCodeActions(
  diag: vscode.Diagnostic,
  originalNode: t.File
): Promise<vscode.CodeAction> {
  var action = new vscode.CodeAction(
    `Refactor repeated code`,
    vscode.CodeActionKind.QuickFix
  );
  action.diagnostics = [diag];
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const wsPath = workspaceFolders ? workspaceFolders[workspaceFolders.length-1].uri.fsPath : ""; // gets the path of the first workspace folder
    console.log("wsPath: ", wsPath);
  const filePath = vscode.Uri.file(path.join(wsPath, 'utilFunctions.js'));
    console.log("filePath: ", filePath);
  action.edit = new vscode.WorkspaceEdit();
  action.edit.createFile(filePath);
  var lastLine = 0;
  vscode.workspace.openTextDocument(filePath).then((document) => {
    lastLine = document.eol + 1;
  });
  console.log(lastLine);
  const wholeDocument = new vscode.Range(
    new vscode.Position(0, 0),
    new vscode.Position(lastLine, 0)
  );
  console.log(wholeDocument);
  // const updatedCode = await updateUtilFile(originalNode);
  // console.log(updatedCode);
  // const updateCode = new vscode.TextEdit(wholeDocument, updatedCode);
  // console.log(updateCode);
  // action.edit.set(filePath, [updateCode]);
  // vscode.workspace.applyEdit(action.edit);
  return action;
}

export class DrycoCodeActionsProvider implements vscode.CodeActionProvider {
  diags: vscode.Diagnostic;
  originalNode: t.File;
  loc1: t.SourceLocation;
  loc2: t.SourceLocation;
  secondURI: string;

  constructor(diagnostic: vscode.Diagnostic, originalNode: t.File, loc1: t.SourceLocation, loc2: t.SourceLocation, secondURI: string) {
    this.diags = diagnostic;
    this.originalNode = originalNode;
    this.loc1 = loc1;
    this.loc2 = loc2;
    this.secondURI = secondURI;
  }

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): Promise<vscode.CodeAction[] | undefined> {
    let newAction = await DrycoCodeActions(this.diags, this.originalNode);
    console.log("From DrycoCodeActionProvider", newAction);
    return [newAction];
  }
}

export function registerModifiers(
  diagnostic: vscode.Diagnostic,
  originalNode: t.File,
  loc1:t.SourceLocation,
  loc2:t.SourceLocation,
  secondURI:string
) {
  codeActions.push(vscode.languages.registerCodeActionsProvider(
    "javascript",
    new DrycoCodeActionsProvider(diagnostic, originalNode, loc1, loc2, secondURI),
    {
      providedCodeActionKinds: DrycoCodeActionsProvider.providedCodeActionKinds,
    }
  ));
}
