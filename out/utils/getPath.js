"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrFile = exports.getCurrDir = void 0;
const vscode = require("vscode");
var os = require("os");
function getCurrDir() {
    var _a;
    var currPath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
    if (currPath) {
        if (os.platform() === "linux") {
            var pathArray = currPath.split("/");
            pathArray.pop();
            currPath = pathArray.join("/");
        }
        else {
            var pathArray = currPath.split("\\");
            pathArray.pop();
            currPath = pathArray.join("\\");
        }
        return currPath;
    }
    return "";
}
exports.getCurrDir = getCurrDir;
function getCurrFile() {
    var currPath = getCurrDir();
    var fileName = currPath.split('/').pop();
    fileName = currPath.split('\\').pop();
    if (fileName) {
        return fileName;
    }
    return "";
}
exports.getCurrFile = getCurrFile;
//# sourceMappingURL=getPath.js.map