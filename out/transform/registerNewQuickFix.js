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
exports.registerNewQuickFix = void 0;
const vscode = require("vscode");
const updateUtilFile_1 = require("./updateUtilFile");
function registerNewQuickFix({ diag1, index }) {
    vscode.languages.registerCodeActionsProvider('javascript', {
        provideCodeActions() {
            return __awaiter(this, void 0, void 0, function* () {
                var action = new vscode.CodeAction("Refactor repeated code", vscode.CodeActionKind.QuickFix);
                action.diagnostics = [diag1];
                action.edit = new vscode.WorkspaceEdit();
                const wsPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ""; // gets the path of the first workspace folder
                const filePath = vscode.Uri.file(wsPath + '/dryco/utilFunctions.js');
                action.edit.createFile(filePath, { ignoreIfExists: true });
                var lastLine = 1000000;
                vscode.workspace.openTextDocument(filePath).then((document) => {
                    lastLine = document.eol + 1;
                });
                const wholeDocument = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lastLine, 0));
                const updatedCode = updateUtilFile_1.updateUtilFile(index);
                const updateCode = new vscode.TextEdit(wholeDocument, yield updatedCode);
                action.edit.set(filePath, [updateCode]);
                // vscode.workspace.applyEdit(action.edit);
                return [action];
            });
        }
    });
}
exports.registerNewQuickFix = registerNewQuickFix;
//# sourceMappingURL=registerNewQuickFix.js.map