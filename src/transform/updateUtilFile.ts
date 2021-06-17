import * as vscode from 'vscode';
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { Nodes, toArrowFunction } from "./transform";
import * as path from "path";

export function updateUtilFile(addition: string): string {
    console.log(addition);
    return `${addition}`;
}
