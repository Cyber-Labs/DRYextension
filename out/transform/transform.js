"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectClone = exports.transformToArrow = void 0;
const parser_1 = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const generator_1 = require("@babel/generator");
const t = require("@babel/types");
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
                }
            });
        }
    });
    return generator_1.default(ast).code;
}
exports.detectClone = detectClone;
//# sourceMappingURL=transform.js.map