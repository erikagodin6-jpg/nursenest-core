import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const hook = pathToFileURL(join(__dirname, "server-only-loader.mjs")).href;
const parent = pathToFileURL(join(__dirname, ".")).href;
register(hook, parent);
