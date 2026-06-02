#!/usr/bin/env node
/**
 * Copy `.visual-acceptance/routes/*/latest/*.png` → sibling `baseline/` (mkdir as needed).
 * Run after reviewing `latest/` captures: `npm run visual-qa:baseline`
 */
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";

const cwd = process.cwd();
const files = await fg([".visual-acceptance/routes/**/latest/**/*.png"], { cwd, onlyFiles: true });
if (files.length === 0) {
  console.error("[visual-qa:baseline] No PNGs under .visual-acceptance/routes/**/latest/. Run npm run visual-qa:capture first.");
  process.exit(1);
}

for (const rel of files) {
  const fromAbs = path.join(cwd, rel);
  const toRel = rel.replace(/\/latest\//g, "/baseline/").replace(/\\latest\\/g, "\\baseline\\");
  const toAbs = path.join(cwd, toRel);
  fs.mkdirSync(path.dirname(toAbs), { recursive: true });
  fs.copyFileSync(fromAbs, toAbs);
  console.log(`[visual-qa:baseline] ${rel} → ${path.relative(cwd, toAbs)}`);
}

console.log(`[visual-qa:baseline] Done (${files.length} files).`);
