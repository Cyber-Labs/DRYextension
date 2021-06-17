"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectClone = exports.toArrowFunction = exports.transformToArrow = exports.Nodes = exports.uriSecond = exports.repInstanceEnd = exports.repInstanceSt = exports.firstInstanceEnd = exports.firstInstanceSt = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const parser_1 = require("@babel/parser");
const vscode = require("vscode");
const traverse_1 = require("@babel/traverse");
const generator_1 = require("@babel/generator");
const t = require("@babel/types");
const extension_1 = require("../extension");
const diagnostics_1 = require("../diagnostics");
const currFile = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
exports.firstInstanceSt = [];
exports.firstInstanceEnd = [];
exports.repInstanceSt = [];
exports.repInstanceEnd = [];
exports.uriSecond = [];
exports.Nodes = [];
const compareLocs = (loc1, loc2) => {
    return loc1.start.line === loc2.start.line && loc1.end.line === loc2.end.line && loc1.start.column === loc2.start.column && loc1.end.column === loc2.end.column;
};
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
exports.toArrowFunction = toArrowFunction;
// detect clone
function detectClone(code, code2, secondURI) {
    const ast = parser_1.parse(code);
    const ast2 = parser_1.parse(code2);
    traverse_1.default(ast, {
        FunctionDeclaration(path1) {
            traverse_1.default(ast2, {
                FunctionDeclaration(path2) {
                    if (path1.node !== path2.node) {
                        const ast1 = parser_1.parse((generator_1.default(parser_1.parse(path1.toString()))).code);
                        const ast2 = parser_1.parse((generator_1.default(parser_1.parse(path2.toString()))).code);
                        if (path1.node.loc && path2.node.loc) {
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
exports.detectClone = detectClone;
function compareAst(ast1, ast2, loc1, loc2, secondURI) {
    var _a;
    const originalNode = parser_1.parse(generator_1.default(ast1).code);
    const sameFile = (currFile === secondURI);
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
    // console.log(currFile, secondURI, sameFile, loc1, loc2, compareLocs(loc1, loc2));
    if ((!sameFile || loc1.start.line >= loc2.start.line) && generator_1.default(ast1).code === generator_1.default(ast2).code && (!sameFile || !compareLocs(loc1, loc2))) {
        if ((_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) {
            const diag = diagnostics_1.createDiagnostics(vscode.window.activeTextEditor.document, loc1, loc2, secondURI);
            extension_1.diagnostics.add(diag);
            extension_1.diagColl.set(vscode.window.activeTextEditor.document.uri, Array.from(extension_1.diagnostics));
            vscode.window.showInformationMessage(`Structurally similar code detected at lines ${loc1 ? loc1.start.line : ""}:${loc1 ? loc1.end.line : ""} and ${loc2 ? loc2.start.line : ""}:${loc2 ? loc2.end.line : ""}`);
        }
    }
}
//# sourceMappingURL=transform.js.map