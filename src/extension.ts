import * as vscode from 'vscode';
import {transformToArrow, detectClone, updateDiags} from './transform/transform';
import * as fs from 'fs';


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
			let transformedCode;

			var currPath = vscode.window.activeTextEditor?.document.uri.fsPath;
			if(currPath){
				var pathArray = currPath.split("\\");
				pathArray.pop();
				currPath = pathArray.join('\\');
				fs.readdir(currPath, (err, files: string[]) => {
					files.forEach((file) => {

						fs.readFile(`${currPath}\\${file}`, 'utf8', (err, data) => {
							if (err) {throw err;}
							transformedCode = detectClone(code, data, `${currPath}\\${file}` );
							if(transformedCode){
								write(transformedCode);
							}
						  });
					});
				});
			}

			const editor = vscode.window.activeTextEditor;
			if(!editor) {
				throw new Error("No active editor");
			}
			const diagColl = vscode.languages.createDiagnosticCollection(`Dryco ${editor}`);
			if (vscode.window.activeTextEditor) {
				updateDiags(vscode.window.activeTextEditor.document, diagColl);
			}


	
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
