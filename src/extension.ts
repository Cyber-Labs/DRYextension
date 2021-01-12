import { readCode } from "./utils/readCode";
import { write } from "./utils/writeCode";
import * as vscode from "vscode";
import { transformToArrow, detectClone } from "./transform/transform";
import { updateDiags } from "./transform/updateDiags";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "dryco" is now active!');

  let disposable = vscode.commands.registerCommand(
    "dryco.convertToArrowFunction",
    () => {
      const code = readCode();
      const transformedCode = transformToArrow(code);
      write(transformedCode);
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand("dryco.detectClone", () => {
      const code = readCode();
      let transformedCode;

      var currPath = vscode.window.activeTextEditor?.document.uri.fsPath;
      if (currPath) {
        var os = require("os");
        if (os.platform() === "linux") {
          var pathArray = currPath.split("/");
          pathArray.pop();
          currPath = pathArray.join("/");
          fs.readdir(currPath, (err, files: string[]) => {
            files.forEach((file) => {
              fs.readFile(`${currPath}/${file}`, (error, data) => {
                if (error) {
                  throw error;
                }
                transformedCode = detectClone(
                  code,
                  data.toString(),
                  `${currPath}/${file}`
                );
                if (transformedCode) {
                  write(transformedCode);
                }
              });
            });
          });
        } else {
          var pathArray = currPath.split("\\");
          pathArray.pop();
          currPath = pathArray.join("\\");
          fs.readdir(currPath, (err, files: string[]) => {
            files.forEach((file) => {
              fs.readFile(`${currPath}\\${file}`, (error, data) => {
                if (error) {
                  throw error;
                }
                transformedCode = detectClone(
                  code,
                  data.toString(),
                  `${currPath}\\${file}`
                );
                if (transformedCode) {
                  write(transformedCode);
                }
              });
            });
          });
        }
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        throw new Error("No active editor");
      }
      var diagColl = vscode.languages.createDiagnosticCollection(
        `Dryco ${editor}`
      );
      if (vscode.window.activeTextEditor) {
        updateDiags(vscode.window.activeTextEditor.document, diagColl);
      }
      const diag = vscode.window.onDidChangeActiveTextEditor;
      if (diag && vscode.window.activeTextEditor) {
        diagColl = vscode.languages.createDiagnosticCollection(
          `Dryco ${editor}`
        );
        updateDiags(vscode.window.activeTextEditor.document, diagColl);
      }

      vscode.workspace.onDidChangeTextDocument((e) =>
        updateDiags(e.document, diagColl)
      );
      vscode.workspace.onDidCloseTextDocument((doc) =>
        diagColl.delete(doc.uri)
      );
    })
  );
}
