"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.diagnostics = exports.diagColl = void 0;
const readCode_1 = require("./utils/readCode");
const writeCode_1 = require("./utils/writeCode");
const vscode = require("vscode");
const transform_1 = require("./transform/transform");
const fs = require("fs");
const path = require("path");
const editor = vscode.window.activeTextEditor;
if (!editor) {
    throw new Error("No active editor");
}
exports.diagColl = vscode.languages.createDiagnosticCollection(`Dryco ${editor}`);
exports.diagnostics = new Set();
function activate(context) {
    console.log('Congratulations, your extension "dryco" is now active!');
    let disposable = vscode.commands.registerCommand("dryco.convertToArrowFunction", () => {
        const code = readCode_1.readCode();
        const transformedCode = transform_1.transformToArrow(code);
        writeCode_1.write(transformedCode);
    });
    context.subscriptions.push(disposable);
    let disposable2 = vscode.commands.registerCommand("dryco.detectClone", () => {
        var _a;
        exports.diagnostics.clear();
        const code = readCode_1.readCode();
        let transformedCode;
        var currPath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
        if (currPath) {
            var os = require("os");
            if (os.platform() === "linux") {
                var pathArray = currPath.split("/");
                const currFile = pathArray[pathArray.length - 1];
                pathArray.pop();
                currPath = pathArray.join("/");
                fs.readdir(currPath, (err, files) => {
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
            }
            else {
                var pathArray = currPath.split("\\");
                const currFile = pathArray[pathArray.length - 1];
                pathArray.pop();
                currPath = pathArray.join("\\");
                fs.readdir(currPath, (err, files) => {
                    files.forEach((file) => {
                        const data = fs.readFileSync(path.join(currPath, file), "utf-8");
                        transform_1.detectClone(code, data.toString(), path.join(currPath, file));
                    });
                });
            }
        }
        vscode.window.showInformationMessage("Hello there");
    });
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map