"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDiags = exports.detectClone = exports.transformToArrow = void 0;
const parser_1 = require("@babel/parser");
const vscode = require("vscode");
const traverse_1 = require("@babel/traverse");
const generator_1 = require("@babel/generator");
const t = require("@babel/types");
const Path = require("path");
var firstInstanceSt = [];
var firstInstanceEnd = [];
var repInstanceSt = [];
var repInstanceEnd = [];
// Convert Normal function to Arrow function
function transformToArrow(code) {
    const ast = parser_1.parse(code);
    traverse_1.default(ast, {
        FunctionDeclaration(path) {
            path.replaceWith(toArrowFunction(path.node));
        }
    });
    return generator_1.default(ast).code;
}
exports.transformToArrow = transformToArrow;
function toArrowFunction(node) {
    const name = node.id ? node.id.name : "converted";
    const identifier = t.identifier(name);
    const arrowFuncExp = t.arrowFunctionExpression(node.params, node.body, node.async);
    const declarator = t.variableDeclarator(identifier, arrowFuncExp);
    return t.variableDeclaration("const", [declarator]);
}
// detect clone
function detectClone(code) {
    const ast = parser_1.parse(code);
    // traverse(ast, {
    //     Identifier(path) {
    //         path.node.name = "a";
    //       }
    // });
    traverse_1.default(ast, {
        FunctionDeclaration(path1) {
            traverse_1.default(ast, {
                FunctionDeclaration(path2) {
                    if (path1.node !== path2.node) {
                        const ast1 = parser_1.parse((generator_1.default(parser_1.parse(path1.toString()))).code);
                        const ast2 = parser_1.parse((generator_1.default(parser_1.parse(path2.toString()))).code);
                        traverse_1.default(ast1, {
                            Identifier(path) {
                                path.node.name = "a";
                            }
                        });
                        traverse_1.default(ast2, {
                            Identifier(path) {
                                path.node.name = "a";
                            }
                        });
                        console.log(generator_1.default(ast1).code === generator_1.default(ast2).code);
                        // console.log(path1.node.loc?.start)
                        if (generator_1.default(ast1).code === generator_1.default(ast2).code) {
                            firstInstanceSt.push(path1.node.loc ? { line: path1.node.loc.start.line, column: path1.node.loc.start.column } : { line: 0, column: 0 });
                            firstInstanceEnd.push(path1.node.loc ? { line: path1.node.loc.end.line, column: path1.node.loc.end.column } : { line: 0, column: 0 });
                            repInstanceSt.push(path2.node.loc ? { line: path2.node.loc.start.line, column: path2.node.loc.start.column } : { line: 0, column: 0 });
                            repInstanceEnd.push(path2.node.loc ? { line: path2.node.loc.end.line, column: path2.node.loc.end.column } : { line: 0, column: 0 });
                            // console.log(`Clone detected at lines ${path1.node.loc ? path1.node.loc.start.line:""}:${path1.node.loc ? path1.node.loc.end.line:""} and ${path2.node.loc ? path2.node.loc.start.line:""}:${path2.node.loc ? path2.node.loc.end.line:""}`);
                            vscode.window.showInformationMessage(`Clone detected at lines ${path1.node.loc ? path1.node.loc.start.line : ""}:${path1.node.loc ? path1.node.loc.end.line : ""} and ${path2.node.loc ? path2.node.loc.start.line : ""}:${path2.node.loc ? path2.node.loc.end.line : ""}`);
                        }
                    }
                }
            });
        }
    });
    return generator_1.default(ast).code;
}
exports.detectClone = detectClone;
function updateDiags(document, collection) {
    var diag1;
    firstInstanceSt.forEach((instance, index) => {
        diag1 = new vscode.Diagnostic(new vscode.Range(new vscode.Position(instance.line, instance.column), new vscode.Position(firstInstanceEnd[index].line, firstInstanceEnd[index].column)), 'WET Code detected!', vscode.DiagnosticSeverity.Warning);
        diag1.source = 'basic-lint';
        diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(repInstanceEnd[index].line, repInstanceEnd[index].column), new vscode.Position(repInstanceEnd[index].line, repInstanceEnd[index].column))), 'Similar Code here')];
        diag1.code = 102;
        if (document && Path.basename(document.uri.fsPath) === 'test.bas') {
            collection.set(document.uri, [diag1]);
        }
        else {
            collection.clear();
        }
        console.log(collection);
    });
}
exports.updateDiags = updateDiags;
// const diag_coll = vscode.languages.createDiagnosticCollection('basic-lint-1');
//     if (vscode.window.activeTextEditor) {
//         diag.updateDiags(vscode.window.activeTextEditor.document, diag_coll);
//     }
//     context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(
//         (e: vscode.TextEditor | undefined) => {
//             if (e !== undefined) {
//                 diag.updateDiags(e.document, diag_coll);
//             }
//         }));
//# sourceMappingURL=transform.js.map