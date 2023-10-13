
import { ArgumentParser } from "argparse";
import * as path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import * as fs from "fs";
import { default as legoConfig } from "./lego.config.js";
import { default as rollupConfig } from "./rollup.config.js";


const parser = ArgumentParser();
parser.add_argument("copyType", { type: "str" });
const args = parser.parse_args();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, path.dirname(legoConfig.sourceDir));


if (process.platform == "darwin") {
    // remove cache files if exists
    for (var cacheFile of globSync(path.join(sourceDir, "._*"))) {
        fs.unlinkSync(cacheFile);
    }
}

if (args.copyType == "build") {
    const destDir = path.join(__dirname, path.dirname(legoConfig.targetDir));
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    for (var srcFile of globSync(path.join(sourceDir, "*.*"), { ignore: "**/index.rollup.html" })) {
        const srcFileName = path.basename(srcFile);
        fs.copyFileSync(srcFile, path.join(destDir, srcFileName));
    }
}
else if (args.copyType == "rollup") {
    const rollupDir = path.join(__dirname, rollupConfig.output.file.split("/")[0]);
    if (!fs.existsSync(rollupDir)) {
        fs.mkdirSync(rollupDir, { recursive: true });
    }

    for (var srcFile of globSync(path.join(sourceDir, "*.*"), { ignore: "**/index.html" })) {
        const srcFileName = path.basename(srcFile);
        fs.copyFileSync(srcFile, path.join(rollupDir, srcFileName));
    }
    fs.renameSync(path.join(rollupDir, "index.rollup.html"), path.join(rollupDir, "index.html"));
}
