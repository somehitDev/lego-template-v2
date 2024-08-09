
import { ArgumentParser } from "argparse";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { execSync, exec, execFile } from "child_process";


const parser = ArgumentParser();
parser.add_argument("jobType", { type: "str" });
const args = parser.parse_args();

const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

if (args.jobType == "build") {
    execSync("node scripts/copy.files.js build", { cwd: __dirname, stdio: "inherit" });
    execSync("npx lego", { cwd: __dirname, stdio: "inherit" });
}
else if (args.jobType == "serve") {
    var sirved = false;

    execSync("node scripts/copy.files.js build", { cwd: __dirname, stdio: "inherit" });
    var buildProcess = exec("npx lego -w", { cwd: __dirname });
    buildProcess.stdout.on("data", data => {
        console.log(`${data}`);

        if (!sirved) {
            sirved = true;

            var sirvProcess = exec("npx sirv-cli", { cwd: path.join(__dirname, "build") });
            sirvProcess.stdout.on("data", sirvData => {
                console.log(`${sirvData}`);
            });
        }
    });
}
else if (args.jobType == "serve:nobuild") {
    execSync("npx sirv-cli", { cwd: path.join(__dirname, "build"), stdio: "inherit" });
}
else if (args.jobType == "rollup") {
    execSync("node scripts/copy.files.js rollup", { cwd: __dirname, stdio: "inherit" });
    execSync("npx lego", { cwd: __dirname, stdio: "inherit" });
    execSync("rollup -c", { cwd: __dirname, stdio: "inherit" });
}
else if (args.jobType == "rollup:nobuild") {
    execSync("node scripts/copy.files.js rollup", { cwd: __dirname, stdio: "inherit" });
    execSync("rollup -c", { cwd: __dirname, stdio: "inherit" });
}
