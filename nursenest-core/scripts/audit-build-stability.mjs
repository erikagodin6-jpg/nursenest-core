#!/usr/bin/env node
/**
 * Audit Next.js / monorepo build stability knobs (DigitalOcean, CI, local).
 * Warn-only by default. Set AUDIT_BUILD_STABILITY_STRICT=1 to exit non-zero on failures.
 * Does not run `next build`.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextConfigPath = join(pkgRoot, "next.config.mjs");
const pkgPath = join(pkgRoot, "package.json");
const strict = /^(1|true|yes)$/i.test(String(process.env.AUDIT_BUILD_STABILITY_STRICT ?? "").trim());

/** @param {string} name @param {boolean} ok @param {string} [hint] */
function check(name, ok, hint = "") {
  const line = ok ? `ok   ${name}` : `WARN ${name}${hint ? ` — ${hint}` : ""}`;
  console.log(line);
  if (!ok && strict) process.exitCode = 1;
}

console.log("[audit:build-stability] NurseNest build configuration audit\n");
console.log(`package root: ${pkgRoot}\n`);

check("next.config.mjs exists", existsSync(nextConfigPath));
const nextSrc = existsSync(nextConfigPath) ? readFileSync(nextConfigPath, "utf8") : "";

const checks = [
  ["webpack parallelism = 1", /webpackParallelism\s*=\s*1/.test(nextSrc) && /config\.parallelism\s*=\s*webpackParallelism/s.test(nextSrc)],
  ["experimental.cpus = 1", /cpus:\s*1/.test(nextSrc)],
  ["staticGenerationMaxConcurrency = 1", /staticGenerationMaxConcurrency:\s*1/.test(nextSrc)],
  ["webpackBuildWorker false", /webpackBuildWorker:\s*false/.test(nextSrc)],
  ["memoryBasedWorkersCount false", /memoryBasedWorkersCount:\s*false/.test(nextSrc)],
  ["parallelServerCompiles false", /parallelServerCompiles:\s*false/.test(nextSrc)],
  ["production webpack cache disabled", /config\.cache\s*=\s*false/.test(nextSrc)],
];

for (const [label, ok] of checks) {
  check(label, ok, "see next.config.mjs");
}

check(
  "typescript.ignoreBuildErrors (intentional — strict tsc in CI/prebuild)",
  /ignoreBuildErrors:\s*true/.test(nextSrc),
  "run npm run typecheck before deploy",
);

let prebuildHasIndexes = false;
let prebuildHasI18n = false;
let buildHasMemory = false;
let buildUsesProdWrapper = false;
if (existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const pre = String(pkg.scripts?.prebuild ?? "");
    const build = String(pkg.scripts?.build ?? "");
    prebuildHasI18n = pre.includes("i18n:compile");
    prebuildHasIndexes =
      build.includes("run-lesson-indexes") ||
      build.includes("lesson-index") ||
      pre.includes("lesson-index");
    buildUsesProdWrapper = build.includes("run-buildpack-build.mjs") || build.includes("run-next-prod-build.mjs");
    buildHasMemory = build.includes("ensure-node-memory") || buildUsesProdWrapper;
    check("prebuild runs i18n:compile", prebuildHasI18n);
    check("build uses production wrapper for Next compile", buildUsesProdWrapper);
    check("build runs lesson index materialization (or NN_SKIP_LESSON_INDEX_BUILD)", prebuildHasIndexes || buildUsesProdWrapper);
    check("build wraps ensure-node-memory", buildHasMemory);
  } catch {
    check("package.json readable", false);
  }
}

console.log("\n--- Operator env (informational) ---");
console.log(`  NN_LOW_MEMORY_BUILD=${process.env.NN_LOW_MEMORY_BUILD ?? "(unset)"}`);
console.log(`  NN_SKIP_LESSON_INDEX_BUILD=${process.env.NN_SKIP_LESSON_INDEX_BUILD ?? "(unset)"}`);
console.log(`  BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=${process.env.BUILD_NODE_MAX_OLD_SPACE_SIZE_MB ?? "(unset)"}`);
console.log(`  NODE_OPTIONS=${(process.env.NODE_OPTIONS ?? "").slice(0, 120)}${(process.env.NODE_OPTIONS?.length ?? 0) > 120 ? "…" : ""}`);

console.log("\nSee ../../reports/production-stability-audit.md (repo root) for narrative + DigitalOcean notes.\n");
if (process.exitCode) process.exit(process.exitCode);
