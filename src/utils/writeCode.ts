import * as fs from "fs";
import * as vscode from "vscode";

// This function replaces the entire text of the active file with the code provided.
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

export async function append(uri:string, code:string){
  let arr = uri.split('/');
  let fileName = arr[arr.length-1];
  arr = fileName.split('//');
  fileName = arr[arr.length-1];
  try {
    fs.appendFile(uri, code, ()=>{
      vscode.window.showInformationMessage(`${fileName} updated successully.`);
    });
  } catch (err) {
    vscode.window.showErrorMessage(`Error updating ${fileName}: ${err}`);
  }
};

export async function replace(uri:string, code:string){
  let arr = uri.split('/');
  let fileName = arr[arr.length-1];
  arr = fileName.split('//');
  fileName = arr[arr.length-1];
  try {
    fs.writeFile(uri, code, ()=>{
      vscode.window.showInformationMessage(`${fileName} updated successully.`);
    });
  } catch (err) {
    vscode.window.showErrorMessage(`Error updating ${fileName}: ${err}`);
  }
};