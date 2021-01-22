"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUtilFile = void 0;
const vscode = require("vscode");
const traverse_1 = require("@babel/traverse");
const generator_1 = require("@babel/generator");
const t = require("@babel/types");
const transform_1 = require("./transform");
function updateUtilFile(repeatedNode) {
    return __awaiter(this, void 0, void 0, function* () {
        var convertedToFunctionNode;
        traverse_1.default(repeatedNode, {
            FunctionDeclaration(path) {
                convertedToFunctionNode = transform_1.toArrowFunction(path.node);
            }
        });
        var exportNode = t.exportNamedDeclaration(convertedToFunctionNode);
        var addition = generator_1.default(exportNode).code;
        const wsPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ""; // gets the path of the first workspace folder
        const filePath = vscode.Uri.file(wsPath + '/dryco/utilFunctions.js');
        const file = yield vscode.workspace.openTextDocument(filePath);
        const originalCode = file.getText();
        return `${originalCode}
${addition}`;
    });
}
exports.updateUtilFile = updateUtilFile;
//# sourceMappingURL=updateUtilFile.js.map