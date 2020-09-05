import * as vscode from 'vscode';
import {transformToArrow, detectClone} from './transform/transform';
import { Transform } from 'stream';
import { updateDiags } from "./transform/transform";

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "dryco" is now active!');

	let disposable = vscode.commands.registerCommand('dryco.convertToArrowFunction', () => {

		const code = readCode();
		const transformedCode = transformToArrow(code);
		write(transformedCode);

	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.commands.registerCommand('dryco.detectClone', () => {

			const code = readCode();
			const transformedCode = detectClone(code);
			const diag_coll = vscode.languages.createDiagnosticCollection('basic-lint-1');
			if (vscode.window.activeTextEditor) {
				updateDiags(vscode.window.activeTextEditor.document, diag_coll);
			}
			context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(
				(e: vscode.TextEditor | undefined) => {
					if (e !== undefined) {
						updateDiags(e.document, diag_coll);
					}
				}));
			console.log(vscode.Diagnostic)
			// write(transformedCode);
	
		})
	);

}

function readCode(): string {
	const editor = vscode.window.activeTextEditor;
	if(!editor) {
		throw new Error("No active editor");
	}

	return editor.document.getText();
}


function write(code: string) {

	const editor = vscode.window.activeTextEditor;
	if(!editor) {
		throw new Error("No active editor");
	}

	const edit = new vscode.WorkspaceEdit();

	const wholeDocument = new vscode.Range(
		new vscode.Position(0, 0),
		new vscode.Position(editor.document.lineCount, 0)
	);
	const updateCode = new vscode.TextEdit(wholeDocument, code);
	edit.set(editor.document.uri, [updateCode]);

	vscode.workspace.applyEdit(edit); 
}

export function deactivate() {}
