import * as vscode from "vscode";

var os = require("os");

export function getCurrDir(): string {
  var currPath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (currPath) {
    if (os.platform() === "linux") {
      var pathArray = currPath.split("/");
      pathArray.pop();
      currPath = pathArray.join("/");
    } else {
      var pathArray = currPath.split("\\");
      pathArray.pop();
      currPath = pathArray.join("\\");
    }
    return currPath;
  }
  return "";
}

export function getCurrFile(): string {
  var currPath = getCurrDir();
  var fileName = currPath.split('/').pop();
  fileName = currPath.split('\\').pop();
  if(fileName)
  {return fileName;}

  return "";
}
