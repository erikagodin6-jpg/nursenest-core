#!/usr/bin/env node
/**
 * Promote captured aesthetic-audit screenshots to approved baselines.
 *
 * Copies every PNG under `docs/screenshots/aesthetic-audit-2026/{public,
 * authenticated,learner-sessions}/` to the sibling `baselines/` folder so the
 * next audit run produces measurable diffs. Re-run after **approved** UI
 * changes only — never promote unreviewed captures.
 *
 *   node scripts/aesthetic-audit-promote-baseline.mjs              # promote everything
 *   node scripts/aesthetic-audit-promote-baseline.mjs --filter=home,rn-hub   # subset
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const ROOT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026");
const BASELINE_DIR = path.join(ROOT, "baselines");
const SOURCE_DIRS = ["public", "authenticated", "learner-sessions"];

function parseArgs() {
  const out = {};
  for (const arg of process.argv.slice(2)) {
    const m = arg.match(/^--([\w-]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
    else if (arg.startsWith("--")) out[arg.slice(2)] = true;
  }
  return out;
}

function walkPngs(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isFile() && name.endsWith(".png")) out.push(full);
  }
  return out;
}

function main() {
  const args = parseArgs();
  const filter = args.filter ? String(args.filter).split(",").map((s) => s.trim().toLowerCase()) : null;

  if (!existsSync(ROOT)) {
    console.error(`[aesthetic-audit:baseline] No screenshots at ${ROOT} — run npm run test:e2e:aesthetic-audit first.`);
    process.exit(1);
  }

  mkdirSync(BASELINE_DIR, { recursive: true });

  let promoted = 0;
  let skipped = 0;
  for (const sub of SOURCE_DIRS) {
    const dir = path.join(ROOT, sub);
    for (const png of walkPngs(dir)) {
      const filename = path.basename(png);
      if (filter && !filter.some((f) => filename.toLowerCase().includes(f))) {
        skipped++;
        continue;
      }
      const dest = path.join(BASELINE_DIR, filename);
      copyFileSync(png, dest);
      promoted++;
      console.log(`[aesthetic-audit:baseline] ${path.relative(REPO_ROOT, png)} → ${path.relative(REPO_ROOT, dest)}`);
    }
  }

  console.log(`[aesthetic-audit:baseline] promoted=${promoted} skipped=${skipped}`);
  if (promoted === 0) {
    console.error("[aesthetic-audit:baseline] Nothing promoted — confirm the audit captures exist.");
    process.exit(1);
  }
}

main();
