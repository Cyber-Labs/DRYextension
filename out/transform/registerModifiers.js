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
exports.registerModifiers = exports.DrycoCodeActionsProvider = void 0;
const vscode = require("vscode");
const updateUtilFile_1 = require("./updateUtilFile");
function DrycoCodeActions(diag, index) {
    return __awaiter(this, void 0, void 0, function* () {
        var action = new vscode.CodeAction(`Refactor repeated code`, vscode.CodeActionKind.QuickFix);
        action.diagnostics = [diag];
        const wsPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ""; // gets the path of the first workspace folder
        const filePath = vscode.Uri.file(wsPath + '/dryco/utilFunctions.js');
        action.edit = new vscode.WorkspaceEdit();
        action.edit.createFile(filePath, { ignoreIfExists: true });
        var lastLine = 1000000;
        vscode.workspace.openTextDocument(filePath).then((document) => {
            lastLine = document.eol + 1;
        });
        const wholeDocument = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lastLine, 0));
        const updatedCode = yield updateUtilFile_1.updateUtilFile(index);
        const updateCode = new vscode.TextEdit(wholeDocument, updatedCode);
        action.edit.set(filePath, [updateCode]);
        // vscode.workspace.applyEdit(action.edit);
        return action;
    });
}
class DrycoCodeActionsProvider {
    constructor(diagnostics) {
        this.diags = diagnostics;
    }
    provideCodeActions(document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            var actions = [];
            // let newAction = this.diags.forEach(async (diag, index) => {
            //     return await DrycoCodeActions(diag, index);
            // })
            for (var i = 0; i < this.diags.length; i++) {
                let newAction = yield DrycoCodeActions(this.diags[i], i);
                actions.push(newAction);
            }
            return actions;
        });
    }
}
exports.DrycoCodeActionsProvider = DrycoCodeActionsProvider;
DrycoCodeActionsProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
function registerModifiers(diagnostics) {
    vscode.languages.registerCodeActionsProvider('javascript', new DrycoCodeActionsProvider(diagnostics), {
        providedCodeActionKinds: DrycoCodeActionsProvider.providedCodeActionKinds
    });
}
exports.registerModifiers = registerModifiers;
;
//# sourceMappingURL=registerModifiers.js.map