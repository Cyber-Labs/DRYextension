import {parse} from "@babel/parser";
import template from "@babel/template";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";


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
                }
            });
        }
    });
    return generate(ast).code;
}
