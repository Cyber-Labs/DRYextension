"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionName = void 0;
/* eslint-disable curly */
const parser_1 = require("@babel/parser");
const fs = require("fs");
// this function returns the name of the function in the file specified by the PATH and in the range specified by RANGE.
exports.getFunctionName = (path, range) => {
    var _a;
    let functionLines = fs.readFileSync(path, "utf-8").split('\n').filter((_line, index) => (index <= range.end.line && index >= range.start.line));
    functionLines[0] = functionLines[0].substring(range.start.character);
    functionLines[functionLines.length - 1] = functionLines[functionLines.length - 1].substr(0, range.end.character);
    const function2String = functionLines.join("\n");
    const function2 = parser_1.parse(function2String).program.body[0];
    const name = (_a = function2.id) === null || _a === void 0 ? void 0 : _a.name;
    if (name)
        return name;
    return "";
};
//# sourceMappingURL=getFunctionName.js.map