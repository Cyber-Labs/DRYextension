var os = require("os");


export function convertPath(currPath:string):string {
    if (os.platform() === "linux") {
        var pathArray = currPath.split("/");
        pathArray.pop();
        currPath = pathArray.join("/");
      } else {
        var pathArray = currPath.split("\\");
        pathArray.pop();
        currPath = pathArray.join("\\");
      }
      return currPath;
}