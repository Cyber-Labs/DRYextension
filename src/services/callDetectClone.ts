import * as fs from "fs";
const path = require("path");
import { detectClone } from "../transform";

export const callDetectClone = (code:string, currPath: string, currFile:string) => {
    fs.readdir(currPath, (_err, files: string[]) => {
        files.forEach((file) => {
            if(file!==currFile){
                const data = fs.readFileSync(path.join(currPath, file), "utf-8");
                detectClone(code, data.toString(), path.join(currPath, file));
            }
        });
    });
}