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
const extension_1 = require("../extension");
const path = require("path");
// eslint-disable-next-line @typescript-eslint/naming-convention
function DrycoCodeActions(diag, originalNode) {
    return __awaiter(this, void 0, void 0, function* () {
        var action = new vscode.CodeAction(`Refactor repeated code`, vscode.CodeActionKind.QuickFix);
        action.diagnostics = [diag];
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const wsPath = workspaceFolders ? workspaceFolders[workspaceFolders.length - 1].uri.fsPath : ""; // gets the path of the first workspace folder
        console.log("wsPath: ", wsPath);
        const filePath = vscode.Uri.file(path.join(wsPath, 'utilFunctions.js'));
        console.log("filePath: ", filePath);
        action.edit = new vscode.WorkspaceEdit();
        action.edit.createFile(filePath);
        var lastLine = 0;
        vscode.workspace.openTextDocument(filePath).then((document) => {
            lastLine = document.eol + 1;
        });
        console.log(lastLine);
        const wholeDocument = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lastLine, 0));
        console.log(wholeDocument);
        // const updatedCode = await updateUtilFile(originalNode);
        // console.log(updatedCode);
        // const updateCode = new vscode.TextEdit(wholeDocument, updatedCode);
        // console.log(updateCode);
        // action.edit.set(filePath, [updateCode]);
        // vscode.workspace.applyEdit(action.edit);
        return action;
    });
}
class DrycoCodeActionsProvider {
    constructor(diagnostic, originalNode, loc1, loc2, secondURI) {
        this.diags = diagnostic;
        this.originalNode = originalNode;
        this.loc1 = loc1;
        this.loc2 = loc2;
        this.secondURI = secondURI;
    }
    provideCodeActions(document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            let newAction = yield DrycoCodeActions(this.diags, this.originalNode);
            console.log("From DrycoCodeActionProvider", newAction);
            return [newAction];
        });
    }
}
exports.DrycoCodeActionsProvider = DrycoCodeActionsProvider;
DrycoCodeActionsProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
];
function registerModifiers(diagnostic, originalNode, loc1, loc2, secondURI) {
    extension_1.codeActions.push(vscode.languages.registerCodeActionsProvider("javascript", new DrycoCodeActionsProvider(diagnostic, originalNode, loc1, loc2, secondURI), {
        providedCodeActionKinds: DrycoCodeActionsProvider.providedCodeActionKinds,
    }));
}
exports.registerModifiers = registerModifiers;
//# sourceMappingURL=registerModifiers.js.map