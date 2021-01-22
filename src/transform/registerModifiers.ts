import * as vscode from "vscode";
import { convertPath } from "../utils/convertPath"
import { updateUtilFile } from "./updateUtilFile";
import * as t from "@babel/types";

async function DrycoCodeActions(
  diag: vscode.Diagnostic,
  originalNode: t.File
): Promise<vscode.CodeAction> {
  var action = new vscode.CodeAction(
    `Refactor repeated code`,
    vscode.CodeActionKind.QuickFix
  );
  action.diagnostics = [diag];
  const wsPath = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : ""; // gets the path of the first workspace folder
  const filePath = vscode.Uri.file(wsPath + "/dryco/utilFunctions.js");
  action.edit = new vscode.WorkspaceEdit();
  action.edit.createFile(filePath, { ignoreIfExists: true });
  var lastLine = 1000000;
  vscode.workspace.openTextDocument(filePath).then((document) => {
    lastLine = document.eol + 1;
  });
  const wholeDocument = new vscode.Range(
    new vscode.Position(0, 0),
    new vscode.Position(lastLine, 0)
  );
  const updatedCode = await updateUtilFile(originalNode);
  const updateCode = new vscode.TextEdit(wholeDocument, updatedCode);
  action.edit.set(filePath, [updateCode]);
  // vscode.workspace.applyEdit(action.edit);
  return action;
}

export class DrycoCodeActionsProvider implements vscode.CodeActionProvider {
  diags: vscode.Diagnostic;
  originalNode: t.File;

  constructor(diagnostic: vscode.Diagnostic, originalNode: t.File) {
    this.diags = diagnostic;
    this.originalNode = originalNode;
  }

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): Promise<vscode.CodeAction[] | undefined> {
    let newAction = await DrycoCodeActions(this.diags, this.originalNode);
    return [newAction];
  }
}

export function registerModifiers(diagnostic: vscode.Diagnostic, originalNode: t.File) {
  vscode.languages.registerCodeActionsProvider(
    "javascript",
    new DrycoCodeActionsProvider(diagnostic, originalNode),
    {
      providedCodeActionKinds: DrycoCodeActionsProvider.providedCodeActionKinds,
    }
  );
}