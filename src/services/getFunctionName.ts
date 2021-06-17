/* eslint-disable curly */
import { parse } from "@babel/parser";
import * as vscode from "vscode";
import * as t from "@babel/types";
import * as fs from "fs";


// this function returns the name of the function in the file specified by the PATH and in the range specified by RANGE.
export const getFunctionName = (path: string, range: vscode.Range):string  => {
    let functionLines = fs.readFileSync(path, "utf-8").split('\n').filter((_line, index) => (index<=range.end.line&&index>=range.start.line));
    functionLines[0] = functionLines[0].substring(range.start.character);
    functionLines[functionLines.length-1] = functionLines[functionLines.length-1].substr(0, range.end.character);
    const function2String = functionLines.join("\n");
    const function2 = parse(function2String).program.body[0] as t.FunctionDeclaration;
    const name = function2.id?.name;
    if(name) return name;
    return "";
}