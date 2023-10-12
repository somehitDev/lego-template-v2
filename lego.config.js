
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    importPath: "./lego.min.js",
    sourceDir: "src/bricks",
    targetDir: "build/bricks",
    preStyle: fs.readFileSync(path.join(__dirname, "src", "index.css"), { encoding: "utf-8" }),
    watch: false
};
