/* eslint-disable @typescript-eslint/naming-convention */
import {parse} from "@babel/parser";
import * as vscode from 'vscode';
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { diagColl, diagnostics } from "../extension";


import { createDiagnostics } from "./createDiagnostics";

export var firstInstanceSt:{line:number,column:number}[] = [];
export var firstInstanceEnd:{line:number,column:number}[] = [];
export var repInstanceSt:{line:number,column:number}[] = [];
export var repInstanceEnd:{line:number,column:number}[] = [];
export var uriSecond:string[] = [];
export var Nodes:t.File[] = [];

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
 
export function toArrowFunction(node: t.FunctionDeclaration): t.VariableDeclaration {
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
    const originalNode = parse(generate(ast1).code);
    console.log(originalNode);
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
    if(generate(ast1).code === generate(ast2).code){
        // Nodes.push(originalNode);
        // firstInstanceSt.push(loc1 ? { line : loc1.start.line,column : loc1.start.column}:{line:0,column:0});
        // firstInstanceEnd.push(loc1 ? {line : loc1.end.line,column : loc1.end.column}:{line:0,column:0});
        // repInstanceSt.push(loc2 ? {line : loc2.start.line,column : loc2.start.column}:{line:0,column:0});
        // repInstanceEnd.push(loc2 ? {line : loc2.end.line,column : loc2.end.column}:{line:0,column:0});
        // uriSecond.push(secondURI);
        var diag:vscode.Diagnostic;
        if(vscode.window.activeTextEditor?.document){
            diag = createDiagnostics(vscode.window.activeTextEditor.document,originalNode, loc1, loc2, secondURI);
            diagnostics.push(diag);
            diagColl.set(vscode.window.activeTextEditor.document.uri,diagnostics);
            vscode.window.showInformationMessage(`Structurally similar code detected at lines ${loc1 ? loc1.start.line:""}:${loc1 ? loc1.end.line:""} and ${loc2 ? loc2.start.line:""}:${loc2 ? loc2.end.line:""}`);
        }
    }
}


