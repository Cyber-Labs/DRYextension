/* eslint-disable @typescript-eslint/naming-convention */
import {parse} from "@babel/parser";
import * as vscode from 'vscode';
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { diagColl, diagnostics } from "../extension";
import { createDiagnostics } from "./createDiagnostics";


const currFile = vscode.window.activeTextEditor?.document.uri.fsPath;

export var firstInstanceSt:{line:number,column:number}[] = [];
export var firstInstanceEnd:{line:number,column:number}[] = [];
export var repInstanceSt:{line:number,column:number}[] = [];
export var repInstanceEnd:{line:number,column:number}[] = [];
export var uriSecond:string[] = [];
export var Nodes:t.File[] = [];

const compareLocs = (loc1: t.SourceLocation, loc2: t.SourceLocation):boolean => {
    return loc1.start.line===loc2.start.line&&loc1.end.line===loc2.end.line&&loc1.start.column===loc2.start.column&&loc1.end.column===loc2.end.column;
};

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
export function detectClone(code: string, code2: string, secondURI: string) {

    const ast = parse(code);
    const ast2 = parse(code2);
    traverse(ast, {
        FunctionDeclaration(path1) {
            traverse(ast2, {
                FunctionDeclaration(path2){
                    if(path1.node!==path2.node){
                        const ast1 = parse((generate(parse(path1.toString()))).code);
                        const ast2 = parse((generate(parse(path2.toString()))).code);
                        if(path1.node.loc && path2.node.loc ){
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
}

function compareAst(ast1: t.File, ast2: t.File, loc1: t.SourceLocation, loc2: t.SourceLocation, secondURI:string): void {
    const originalNode = parse(generate(ast1).code);
    const sameFile = (currFile === secondURI);
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
    // console.log(currFile, secondURI, sameFile, loc1, loc2, compareLocs(loc1, loc2));
    if((!sameFile || loc1.start.line >= loc2.start.line) && generate(ast1).code === generate(ast2).code && (!sameFile || !compareLocs(loc1, loc2))){
        if(vscode.window.activeTextEditor?.document){
            const diag = createDiagnostics(vscode.window.activeTextEditor.document,originalNode, loc1, loc2, secondURI);
            diagnostics.add(diag);
            diagColl.set(vscode.window.activeTextEditor.document.uri,Array.from(diagnostics));
            vscode.window.showInformationMessage(`Structurally similar code detected at lines ${loc1 ? loc1.start.line:""}:${loc1 ? loc1.end.line:""} and ${loc2 ? loc2.start.line:""}:${loc2 ? loc2.end.line:""}`);
        }
    }
}


