import {parse} from "@babel/parser";
import * as vscode from 'vscode';
import template from "@babel/template";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import * as Path from 'path';
import { downloadAndUnzipVSCode } from "vscode-test";


var firstInstanceSt:{line:number,column:number}[] = [];
var firstInstanceEnd:{line:number,column:number}[] = [];
var repInstanceSt:{line:number,column:number}[] = [];
var repInstanceEnd:{line:number,column:number}[] = [];

// Convert Normal function to Arrow function
export function transformToArrow(code: string): string {
    const ast = parse(code);
    traverse(ast, {
        FunctionDeclaration(path) {
            path.replaceWith(toArrowFunction(path.node));
        }
    });
    return generate(ast).code;
}
 
function toArrowFunction(node: t.FunctionDeclaration): t.VariableDeclaration {
    const name = node.id ? node.id.name : "converted";
    const identifier = t.identifier(name);
    const arrowFuncExp = t.arrowFunctionExpression(
        node.params,
        node.body,
        node.async
    );
    const declarator = t.variableDeclarator(identifier, arrowFuncExp);
    return t.variableDeclaration("const", [declarator]);
}

// detect clone
export function detectClone(code: string): string {
    const ast = parse(code);
    // traverse(ast, {
    //     Identifier(path) {
    //         path.node.name = "a";
    //       }
    // });
    traverse(ast, {
        FunctionDeclaration(path1) {
            traverse(ast, {
                FunctionDeclaration(path2){
                    if(path1.node!==path2.node){
                        const ast1 = parse((generate(parse(path1.toString()))).code);
                        const ast2 = parse((generate(parse(path2.toString()))).code);
                        traverse(ast1, {
                            Identifier(path) {
                                path.node.name = "a";
                            }
                        });
                        traverse(ast2, {
                            Identifier(path) {
                                path.node.name = "a";
                            }
                        });
                        console.log(generate(ast1).code === generate(ast2).code);
                        // console.log(path1.node.loc?.start)
                        if(generate(ast1).code === generate(ast2).code){
                            firstInstanceSt.push(path1.node.loc ? { line : path1.node.loc.start.line,column : path1.node.loc.start.column}:{line:0,column:0});
                            firstInstanceEnd.push(path1.node.loc ? {line : path1.node.loc.end.line,column : path1.node.loc.end.column}:{line:0,column:0});
                            repInstanceSt.push(path2.node.loc ? {line : path2.node.loc.start.line,column : path2.node.loc.start.column}:{line:0,column:0});
                            repInstanceEnd.push(path2.node.loc ? {line : path2.node.loc.end.line,column : path2.node.loc.end.column}:{line:0,column:0});
                            // console.log(`Clone detected at lines ${path1.node.loc ? path1.node.loc.start.line:""}:${path1.node.loc ? path1.node.loc.end.line:""} and ${path2.node.loc ? path2.node.loc.start.line:""}:${path2.node.loc ? path2.node.loc.end.line:""}`);
                            vscode.window.showInformationMessage(`Structurally similar code detected at lines ${path1.node.loc ? path1.node.loc.start.line:""}:${path1.node.loc ? path1.node.loc.end.line:""} and ${path2.node.loc ? path2.node.loc.start.line:""}:${path2.node.loc ? path2.node.loc.end.line:""}`);
                        }
                    }
                }
            });
        }
    });
    return generate(ast).code;
}

export function updateDiags(document: vscode.TextDocument,
    collection: vscode.DiagnosticCollection): void {
        let diag1: vscode.Diagnostic;
        firstInstanceSt.forEach((instance,index) =>{
            diag1 = new vscode.Diagnostic(
                new vscode.Range(
                    new vscode.Position(instance.line,instance.column), new vscode.Position(firstInstanceEnd[index].line,firstInstanceEnd[index].column),
                ),
                'WET Code detected!',
                vscode.DiagnosticSeverity.Warning,
            );
            diag1.source = 'basic-lint';
            diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(
                new vscode.Location(document.uri,
                    new vscode.Range( new vscode.Position(repInstanceSt[index].line,repInstanceSt[index].column),  new vscode.Position(repInstanceEnd[index].line,repInstanceEnd[index].column))),
                'Similar Code here')];
            diag1.code = 102;
            if (document && Path.basename(document.uri.fsPath)) {
                collection.set(document.uri, [diag1]);
            } else {
                collection.clear();
            }
            // console.log(diag1);
        });
}

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