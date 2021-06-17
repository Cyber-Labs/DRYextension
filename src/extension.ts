import * as vscode from "vscode";
import { DrycoCodeActionProvider } from "./CodeActionsProvider";
import { subscribeToDocumentChanges } from "./diagnostics";

const editor = vscode.window.activeTextEditor;
if (!editor) {
  throw new Error("No active editor");
}
export var diagColl = vscode.languages.createDiagnosticCollection(
  `Dryco ${editor}`
);
export var diagnostics: Set<vscode.Diagnostic> = new Set<vscode.Diagnostic>();
export var codeActions: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "dryco" is now active!');

  vscode.commands.registerCommand("dryco.detectClone", () => {
    const drycoDiagnostics = vscode.languages.createDiagnosticCollection("Dryco");
    context.subscriptions.push(drycoDiagnostics);
    subscribeToDocumentChanges(context, drycoDiagnostics);
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider('javascript', new DrycoCodeActionProvider(), {
        providedCodeActionKinds: DrycoCodeActionProvider.providedCodeActionKinds
      })
    );
  });
}
