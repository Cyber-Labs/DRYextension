"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callDetectClone = void 0;
const fs = require("fs");
const path = require("path");
const transform_1 = require("../transform");
exports.callDetectClone = (code, currPath, currFile) => {
    fs.readdir(currPath, (_err, files) => {
        files.forEach((file) => {
            if (file !== currFile) {
                const data = fs.readFileSync(path.join(currPath, file), "utf-8");
                transform_1.detectClone(code, data.toString(), path.join(currPath, file));
            }
        });
    });
};
//# sourceMappingURL=callDetectClone.js.map