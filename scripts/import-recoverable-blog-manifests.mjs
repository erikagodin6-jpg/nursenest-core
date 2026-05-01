#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const app = join(root, "nursenest-core");
const runner = join(app, "scripts", "blog", "import-recoverable-blog-manifests-runner.mts");
const extra = process.argv.slice(2);
const r = spawnSync("npx", ["tsx", runner, ...extra], { cwd: app, stdio: "inherit", shell: false });
process.exit(r.status ?? 1);
