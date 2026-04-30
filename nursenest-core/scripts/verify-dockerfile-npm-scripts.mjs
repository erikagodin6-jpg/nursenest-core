#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
const scripts = pkg.scripts && typeof pkg.scripts === "object" ? pkg.scripts : {};

function findDockerfile() {
  const a = path.join(packageRoot, "Dockerfile");
  const b = path.join(packageRoot, "..", "Dockerfile");
  if (existsSync(a)) return a;
  if (existsSync(b)) return b;
  return null;
}

const dockerPath = findDockerfile();
if (!dockerPath) {
  console.error("[verify-dockerfile-npm-scripts] FATAL: Dockerfile not found.");
  process.exit(1);
}

const dockerSrc = readFileSync(dockerPath, "utf8");
const npmRunNames = new Set();
for (const m of dockerSrc.matchAll(/\bnpm\s+run\s+([a-zA-Z0-9:_-]+)\b/g)) {
  npmRunNames.add(m[1]);
}

for (const name of npmRunNames) {
  if (!scripts[name]) {
    console.error(
      `[verify-dockerfile-npm-scripts] FATAL: Dockerfile runs npm run ${name} but scripts.${name} is missing.`,
    );
    process.exit(1);
  }
}

for (const name of ["heroku-postbuild", "build:deploy", "db:generate", "start"]) {
  if (!scripts[name]) {
    console.error(`[verify-dockerfile-npm-scripts] FATAL: missing required script ${name}.`);
    process.exit(1);
  }
}

console.log(`[verify-dockerfile-npm-scripts] ok dockerfile=${dockerPath} checked=${npmRunNames.size}`);
