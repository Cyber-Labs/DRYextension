import { readCode } from "./utils/readCode";
import { write } from "./utils/writeCode";
import * as vscode from "vscode";
import { transformToArrow, detectClone } from "./transform/transform";
import { updateDiags } from "./transform/updateDiags";
import * as fs from "fs";
import { DrycoCodeActionsProvider } from "./transform/registerModifiers";
const path = require("path");

const editor = vscode.window.activeTextEditor;
if (!editor) {
  throw new Error("No active editor");
}
export var diagColl = vscode.languages.createDiagnosticCollection(
  `Dryco ${editor}`
);
export var diagnostics: Set<vscode.Diagnostic> = new Set<vscode.Diagnostic>();

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

  let disposable2 = vscode.commands.registerCommand("dryco.detectClone", () => {
    diagnostics.clear();
    const code = readCode();
    let transformedCode:string;

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
            if (file !== currFile) {
              fs.readFile(path.join(currPath, file), (error, data) => {
                if (error) {
                  throw error;
                }
                // transformedCode = detectClone(
                //   code,
                //   data.toString(),
                //   `${currPath}/${file}`
                // );
                // if (transformedCode) {
                //   write(transformedCode);
                // }
              });
            }
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
    vscode.window.showInformationMessage("Hello there");
  });

  context.subscriptions.push(disposable2);
}
