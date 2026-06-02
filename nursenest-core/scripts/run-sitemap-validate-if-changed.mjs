#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  logArtifactCacheDecision,
  prepareArtifactCacheDecision,
  writeArtifactCache,
} from "../../scripts/build-artifact-cache.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const cachePath = path.join(packageRoot, "reports", "build-artifact-cache", "sitemap-validation.json");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const decision = prepareArtifactCacheDecision({
  stepName: "sitemap_validation",
  cwd: packageRoot,
  cachePath,
  inputs: [
    { path: "src/app", extensions: [".ts", ".tsx"], excludePathSubstrings: ["/(student)/app/"] },
    { path: "src/lib/seo", extensions: [".ts", ".tsx", ".mts", ".mjs", ".json"] },
    { path: "src/lib/blog", extensions: [".ts", ".tsx", ".mts", ".mjs", ".json"] },
    { path: "src/lib/lessons", extensions: [".ts", ".tsx", ".mts", ".mjs", ".json"] },
    { path: "scripts/sitemap-segmentation-validate.mts", extensions: [".mts"] },
    { path: "scripts/sitemap-segmentation-report.mts", extensions: [".mts"] },
  ],
  outputs: [path.relative(packageRoot, cachePath)],
});

if (decision.action === "reuse") {
  logArtifactCacheDecision(decision);
  console.log("[sitemap-validate-if-changed] reused previous successful validation");
  process.exit(0);
}

logArtifactCacheDecision(decision);
const startedAt = Date.now();
const result = spawnSync(npmCmd, ["run", "sitemap:validate"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1);
}

writeArtifactCache({
  cachePath,
  stepName: "sitemap_validation",
  fingerprint: decision.fingerprint,
  files: decision.files,
  outputs: [cachePath],
  metadata: {
    durationMs: Date.now() - startedAt,
  },
});

console.log(`[sitemap-validate-if-changed] validation_ok duration_ms=${Date.now() - startedAt}`);
