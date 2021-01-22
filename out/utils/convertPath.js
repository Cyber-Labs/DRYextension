"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPath = void 0;
var os = require("os");
function convertPath(currPath) {
    if (os.platform() === "linux") {
        var pathArray = currPath.split("/");
        pathArray.pop();
        currPath = pathArray.join("/");
    }
    else {
        var pathArray = currPath.split("\\");
        pathArray.pop();
        currPath = pathArray.join("\\");
    }
    return currPath;
}
exports.convertPath = convertPath;
//# sourceMappingURL=convertPath.js.map