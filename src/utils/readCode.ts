import * as vscode from "vscode";
import * as fs from "fs";


export function readCode(): string {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    throw new Error("No active editor");
  }

  return editor.document.getText();
};

export function readFrom(uri: string): string {
  let arr = uri.split('/');
  let fileName = arr[arr.length-1];
  arr = fileName.split('//');
  fileName = arr[arr.length-1];
  const data = fs.readFileSync(uri, 'utf-8');

  return data;
}
