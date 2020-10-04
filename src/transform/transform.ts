/* eslint-disable @typescript-eslint/naming-convention */
import {parse} from "@babel/parser";
import * as vscode from 'vscode';
import template from "@babel/template";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import * as Path from 'path';

var firstInstanceSt:{line:number,column:number}[] = [];
var firstInstanceEnd:{line:number,column:number}[] = [];
var repInstanceSt:{line:number,column:number}[] = [];
var repInstanceEnd:{line:number,column:number}[] = [];
var uriSecond:string[] = [];

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
export function detectClone(code: string, code2: string, secondURI: string): string {

    const ast = parse(code);
    const ast2 = parse(code2);
    traverse(ast, {
        FunctionDeclaration(path1) {
            traverse(ast2, {
                FunctionDeclaration(path2){
                    if(path1.node!==path2.node){
                        const ast1 = parse((generate(parse(path1.toString()))).code);
                        const ast2 = parse((generate(parse(path2.toString()))).code);
                        if(path1.node.loc && path2.node.loc){
                            compareAst(ast1, ast2, path1.node.loc, path2.node.loc, secondURI);
                        }
                    }
                }
            });
        }
    });
    
    // traverse(ast, {
    //     IfStatement(path1) {
    //         traverse(ast, {
    //             IfStatement(path2){
    //                 if(path1.node!==path2.node){
    //                     const ast1 = parse((generate(parse(path1.toString()))).code);
    //                     const ast2 = parse((generate(parse(path2.toString()))).code);
    //                     if(path1.node.loc && path2.node.loc){
    //                         compareAst(ast1, ast2, path1.node.loc, path2.node.loc);
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // });

    // traverse(ast, {
    //     VariableDeclaration(path1) {
    //         traverse(ast, {
    //             VariableDeclaration(path2){
    //                 if(path1.node!==path2.node){
    //                     const ast1 = parse((generate(parse(path1.toString()))).code);
    //                     const ast2 = parse((generate(parse(path2.toString()))).code);
    //                     if(path1.node.loc && path2.node.loc){
    //                         compareAst(ast1, ast2, path1.node.loc, path2.node.loc);
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // });

    // traverse(ast, {
    //     BlockStatement(path1) {
    //         traverse(ast, {
    //             BlockStatement(path2){
    //                 if(path1.node!==path2.node){
    //                     const ast1 = parse((generate(parse(path1.toString()))).code);
    //                     const ast2 = parse((generate(parse(path2.toString()))).code);
    //                     if(path1.node.loc && path2.node.loc){
    //                         compareAst(ast1, ast2, path1.node.loc, path2.node.loc);
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // });
    return generate(ast).code;
}

function compareAst(ast1: t.File, ast2: t.File, loc1: t.SourceLocation, loc2: t.SourceLocation, secondURI:string): void {
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
    // console.log(generate(ast1).code === generate(ast2).code);
    // console.log(path1.node.loc?.start)
    if(generate(ast1).code === generate(ast2).code){
        firstInstanceSt.push(loc1 ? { line : loc1.start.line,column : loc1.start.column}:{line:0,column:0});
        firstInstanceEnd.push(loc1 ? {line : loc1.end.line,column : loc1.end.column}:{line:0,column:0});
        repInstanceSt.push(loc2 ? {line : loc2.start.line,column : loc2.start.column}:{line:0,column:0});
        repInstanceEnd.push(loc2 ? {line : loc2.end.line,column : loc2.end.column}:{line:0,column:0});
        uriSecond.push(secondURI);
        // console.log(`Clone detected at lines ${path1.node.loc ? path1.node.loc.start.line:""}:${path1.node.loc ? path1.node.loc.end.line:""} and ${path2.node.loc ? path2.node.loc.start.line:""}:${path2.node.loc ? path2.node.loc.end.line:""}`);
        vscode.window.showInformationMessage(`Structurally similar code detected at lines ${loc1 ? loc1.start.line:""}:${loc1 ? loc1.end.line:""} and ${loc2 ? loc2.start.line:""}:${loc2 ? loc2.end.line:""}`);
    }
}

export function updateDiags(document: vscode.TextDocument,
    collection: vscode.DiagnosticCollection): void {
        let diagnostics: vscode.Diagnostic[] = [];
        firstInstanceSt.forEach((instance,index) =>{
            let diag1 = new vscode.Diagnostic(
                new vscode.Range(
                    new vscode.Position(instance.line,instance.column), new vscode.Position(firstInstanceEnd[index].line,firstInstanceEnd[index].column),
                ),
                'WET Code detected!',
                vscode.DiagnosticSeverity.Warning,
            );
            diag1.source = 'DryCo';
            diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(
                new vscode.Location(vscode.Uri.file(uriSecond[index]),
                    new vscode.Range( new vscode.Position(repInstanceSt[index].line,repInstanceSt[index].column),  new vscode.Position(repInstanceEnd[index].line,repInstanceEnd[index].column))),
                'Similar Code here')];
            diag1.code = 102;
            diagnostics.push(diag1);
            if (document && Path.basename(document.uri.fsPath)) {
                collection.set(document.uri, diagnostics);
            } else {
                collection.clear();
            }
            vscode.languages.registerCodeActionsProvider('javascript', {
                provideCodeActions(document) {
                    var action = new vscode.CodeAction("Refactor repeated code",vscode.CodeActionKind.QuickFix);
                    action.diagnostics = diagnostics;
                    action.edit=new vscode.WorkspaceEdit();
                    const wsPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ""; // gets the path of the first workspace folder
                    console.log(wsPath);
                    const filePath = vscode.Uri.file(wsPath + '/dryco/utilFunctions.js');
                    vscode.window.showInformationMessage(filePath.toString());
                    action.edit.createFile(filePath, { ignoreIfExists: true });
                    const wholeDocument = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(document.lineCount, 0));
                    const updateCode = new vscode.TextEdit(wholeDocument, "// Hi from dryco :0");
                    action.edit.set(vscode.Uri.file(filePath.toString()), [updateCode]);
                    vscode.workspace.applyEdit(action.edit);
                    vscode.window.showInformationMessage('Created a new file: dryco/utilityFunctions.js');
                    return [action];
                }
            });
        });
}

function activate():void{
    const wsedit = new vscode.WorkspaceEdit();
    const wsPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ""; // gets the path of the first workspace folder
    const filePath = vscode.Uri.file(wsPath + '/hello/world.md');
    vscode.window.showInformationMessage(filePath.toString());
    wsedit.createFile(filePath, { ignoreIfExists: true });
    vscode.workspace.applyEdit(wsedit);
    vscode.window.showInformationMessage('Created a new file: hello/world.md');
}