#!/usr/bin/env node
/**
 * Reports largest directories and files under nursenest-core/ to spot disk risk.
 * Safe to run anytime (read-only). For CI: fail if .next or unexpected blobs grow past thresholds (optional future).
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function duSh(target) {
  try {
    const out = execSync(`du -sh "${target}" 2>/dev/null`, { encoding: "utf8" }).trim();
    return out.split(/\t/)[0] ?? "?";
  } catch {
    return "(missing)";
  }
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

const rows = [
  ["nursenest-core (total)", pkgRoot],
  ["node_modules", path.join(pkgRoot, "node_modules")],
  [".next", path.join(pkgRoot, ".next")],
  ["public", path.join(pkgRoot, "public")],
  ["public/i18n", path.join(pkgRoot, "public", "i18n")],
  ["src", path.join(pkgRoot, "src")],
];

console.log("=== NurseNest Core disk audit ===\n");
for (const [label, p] of rows) {
  if (label !== "nursenest-core (total)" && !exists(p)) continue;
  console.log(`${label.padEnd(22)} ${duSh(p)}`);
}

console.log("\n=== Largest files in public/ (top 15) ===\n");
try {
  const pub = path.join(pkgRoot, "public");
  if (exists(pub)) {
    const out = execSync(
      `find "${pub}" -type f -exec du -h {} + 2>/dev/null | sort -hr | head -15`,
      { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 },
    );
    console.log(out.trim() || "(none)");
  }
} catch {
  console.log("(skipped)");
}

console.log("\n=== Safe cleanup targets (manual) ===");
console.log("- rm -rf .next/cache   (also done by npm run build:deploy)");
console.log("- rm -rf .next         (npm run clean:next)");
console.log("- npm prune --omit=dev after production install on builders");
console.log("- Keep repo root attached_assets/, data/imports/ out of deploy context");
console.log("- npm run storage:check  (oversized public/ assets; use storage:check:strict in CI)\n");
