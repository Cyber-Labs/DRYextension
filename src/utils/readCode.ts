import * as vscode from "vscode";

export function readCode(): string {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error("No active editor");
  }

  return editor.document.getText();
}
