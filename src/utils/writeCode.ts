import * as vscode from "vscode";

export function write(code: string) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error("No active editor");
  }

  const edit = new vscode.WorkspaceEdit();
  const wholeDocument = new vscode.Range(
    new vscode.Position(0, 0),
    new vscode.Position(editor.document.lineCount, 0)
  );
  const updateCode = new vscode.TextEdit(wholeDocument, code);
  edit.set(editor.document.uri, [updateCode]);
  vscode.workspace.applyEdit(edit);
}
