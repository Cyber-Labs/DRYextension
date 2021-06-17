"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrycoCodeActionProvider = void 0;
const vscode = require("vscode");
const getUtilFilePath_1 = require("./services/getUtilFilePath");
const getFunctionName_1 = require("./services/getFunctionName");
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
        if (!diagnostic.relatedInformation)
            return action;
        // Get details of both the copy of the functions
        const extraInformation = diagnostic.relatedInformation;
        const range1 = diagnostic.range;
        const uri1 = document.uri.fsPath;
        const range2 = extraInformation[0].location.range;
        let uri2 = extraInformation[0].location.uri.path;
        if (uri2.charAt(0) === '/')
            uri2 = uri2.substring(1);
        // Extract name of both the functions.
        const name1 = getFunctionName_1.getFunctionName(uri1, range1);
        const name2 = getFunctionName_1.getFunctionName(uri2, range2);
        if (!name1 || !name2)
            return action;
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new vscode.WorkspaceEdit();
        // Import statement for the first function.
        const importStatement = `import { ${name1} } from './utilFunctions;'\n`;
        // Import statement for the second function.
        const importStatement2 = `import { ${name1} as ${name2} } from './utilFunctions;'\n`;
        // Function to be added in the utilFunctions.js file
        const exportedFunction = `export ${document.getText(range1)}\n`;
        // Create a new utilFunctions file if not exists.
        const utilFilePath = getUtilFilePath_1.getUtilFilePath();
        action.edit.createFile(utilFilePath, { ignoreIfExists: true });
        // Add function to the utility file.
        action.edit.insert(utilFilePath, new vscode.Position(0, 0), exportedFunction);
        // Delete first instance of the function.
        action.edit.delete(vscode.Uri.file(uri1), range1);
        // Delete second instance of the function.
        action.edit.delete(vscode.Uri.file(uri2), range2);
        // Insert import statements.
        action.edit.insert(vscode.Uri.file(uri1), new vscode.Position(0, 0), importStatement);
        if (path.resolve(uri1) !== path.resolve(uri2)) {
            action.edit.insert(vscode.Uri.file(uri2), new vscode.Position(0, 0), importStatement2);
        }
        return action;
    }
}
exports.DrycoCodeActionProvider = DrycoCodeActionProvider;
DrycoCodeActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=CodeActionsProvider.js.map