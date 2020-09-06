import * as vscode from 'vscode';
import {transformToArrow, detectClone, updateDiags} from './transform/transform';

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
			const editor = vscode.window.activeTextEditor;
			if(!editor) {
				throw new Error("No active editor");
			}
			const diagColl = vscode.languages.createDiagnosticCollection(`Dryo ${editor}`);
			if (vscode.window.activeTextEditor) {
				updateDiags(vscode.window.activeTextEditor.document, diagColl);
			}
			// context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(
			// 	(e: vscode.TextEditor | undefined) => {
			// 		if (e !== undefined) {
			// 			updateDiags(e.document, diagColl);
			// 		}
			// 	}));
			write(transformedCode);
	
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
