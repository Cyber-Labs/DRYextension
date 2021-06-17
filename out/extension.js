"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.codeActions = exports.diagnostics = exports.diagColl = void 0;
const vscode = require("vscode");
const CodeActionsProvider_1 = require("./CodeActionsProvider");
const diagnostics_1 = require("./diagnostics");
const editor = vscode.window.activeTextEditor;
if (!editor) {
    throw new Error("No active editor");
}
exports.diagColl = vscode.languages.createDiagnosticCollection(`Dryco ${editor}`);
exports.diagnostics = new Set();
exports.codeActions = [];
function activate(context) {
    console.log('Congratulations, your extension "dryco" is now active!');
    let disposable2 = vscode.commands.registerCommand("dryco.detectClone", () => {
        const drycoDiagnostics = vscode.languages.createDiagnosticCollection("Dryco");
        context.subscriptions.push(drycoDiagnostics);
        diagnostics_1.subscribeToDocumentChanges(context, drycoDiagnostics);
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider('javascript', new CodeActionsProvider_1.DrycoCodeActionProvider(), {
            providedCodeActionKinds: CodeActionsProvider_1.DrycoCodeActionProvider.providedCodeActionKinds
        }));
    });
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map