import * as vscode from "vscode";
import { Nodes } from "./transform";
import { updateUtilFile } from "./updateUtilFile";

async function DrycoCodeActions(
  diag: vscode.Diagnostic,
  index: number
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
  const updatedCode = await updateUtilFile(index);
  const updateCode = new vscode.TextEdit(wholeDocument, updatedCode);
  action.edit.set(filePath, [updateCode]);
  // vscode.workspace.applyEdit(action.edit);
  return action;
}

export class DrycoCodeActionsProvider implements vscode.CodeActionProvider {
  diags: vscode.Diagnostic[];

  constructor(diagnostics: vscode.Diagnostic[]) {
    this.diags = diagnostics;
  }

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): Promise<vscode.CodeAction[] | undefined> {
    var actions: vscode.CodeAction[] = [];
    for (var i = 0; i < this.diags.length; i++) {
      let newAction = await DrycoCodeActions(this.diags[i], i);
      actions.push(newAction);
    }
    return actions;
  }
}

export function registerModifiers(diagnostics: vscode.Diagnostic[]) {
  vscode.languages.registerCodeActionsProvider(
    "javascript",
    new DrycoCodeActionsProvider(diagnostics),
    {
      providedCodeActionKinds: DrycoCodeActionsProvider.providedCodeActionKinds,
    }
  );
}
