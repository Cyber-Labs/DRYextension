"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrycoCodeActionProvider = void 0;
const vscode = require("vscode");
const path = require("path");
class DrycoCodeActionProvider {
    provideCodeActions(document, range, context, token) {
        // for each diagnostic entry that has the matching `code`, create a code action command
        return context.diagnostics
            .filter(diagnostic => diagnostic.source === "DryCo")
            .map(diagnostic => this.createCommandCodeAction(document, diagnostic));
    }
    createCommandCodeAction(document, diagnostic) {
        const action = new vscode.CodeAction('Refactor repeated code', vscode.CodeActionKind.QuickFix);
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const wsPath = workspaceFolders ? workspaceFolders[workspaceFolders.length - 1].uri.fsPath : ""; // gets the path of the first workspace folder
        const filePath = vscode.Uri.file(path.join(wsPath, 'utilFunctions.js'));
        action.edit = new vscode.WorkspaceEdit();
        action.edit.createFile(filePath, { ignoreIfExists: true });
        var lastLine = 0;
        vscode.workspace.openTextDocument(filePath).then((document) => {
            lastLine = document.eol + 1;
        });
        const wholeDocument = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lastLine, 0));
        const updatedCode = document.getText(diagnostic.range);
        const updateCode = new vscode.TextEdit(wholeDocument, updatedCode);
        action.edit.set(filePath, [updateCode]);
        return action;
    }
}
exports.DrycoCodeActionProvider = DrycoCodeActionProvider;
DrycoCodeActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=CodeActionsProvider.js.map