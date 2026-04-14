#!/usr/bin/env node
/**
 * Local verification: committed transparent theme logos in `public/branding/theme-logos/`
 * vs canonical theme ids from `src/lib/theme/theme-registry.ts` (THEME_OPTIONS).
 *
 * Does not call Spaces/CDN. Use the printed checklist to upload missing keys after deploy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const THEME_REGISTRY = path.join(ROOT, "src/lib/theme/theme-registry.ts");
const THEME_LOGOS_DIR = path.join(ROOT, "public/branding/theme-logos");

function extractThemeIds(src) {
  const start = src.indexOf("export const THEME_OPTIONS");
  if (start === -1) throw new Error("THEME_OPTIONS not found in theme-registry.ts");
  const slice = src.slice(start);
  const end = slice.indexOf("];");
  if (end === -1) throw new Error("Unclosed THEME_OPTIONS array");
  const block = slice.slice(0, end + 2);
  const ids = [...block.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (ids.length === 0) throw new Error("No theme ids parsed from THEME_OPTIONS");
  return ids;
}

function main() {
  const registrySrc = fs.readFileSync(THEME_REGISTRY, "utf8");
  const themeIds = extractThemeIds(registrySrc);
  const expectedKeys = themeIds.map((id) => `${id}brandlogo_transparent.png`);
  const expectedSet = new Set(expectedKeys);

  let onDisk = [];
  try {
    onDisk = fs.readdirSync(THEME_LOGOS_DIR).filter((f) => f.endsWith(".png"));
  } catch (e) {
    console.error(`Cannot read ${THEME_LOGOS_DIR}:`, e.message);
    process.exit(1);
  }

  const onDiskSet = new Set(onDisk);
  const missing = expectedKeys.filter((k) => !onDiskSet.has(k));
  const extra = onDisk.filter((k) => !expectedSet.has(k));

  /** Multiple theme ids resolving to the same object key (registry collision). */
  const keyToIds = new Map();
  for (let i = 0; i < themeIds.length; i++) {
    const k = expectedKeys[i];
    if (!keyToIds.has(k)) keyToIds.set(k, []);
    keyToIds.get(k).push(themeIds[i]);
  }
  const duplicateMappings = [...keyToIds.entries()].filter(([, ids]) => ids.length > 1);

  console.log("Theme logo bucket parity (local public/ vs THEME_OPTIONS)\n");
  console.log(`Registry themes: ${themeIds.length}`);
  console.log(`Expected PNG keys: ${expectedKeys.length}`);
  console.log(`Files on disk (${THEME_LOGOS_DIR}): ${onDisk.length}\n`);

  if (missing.length) {
    console.log("MISSING files (expected from registry, not in public/branding/theme-logos/):");
    for (const m of missing) console.log(`  - ${m}`);
    console.log("");
  } else {
    console.log("OK: every registry theme has a matching local PNG filename.\n");
  }

  if (extra.length) {
    console.log("EXTRA files on disk (not mapped from current THEME_OPTIONS):");
    for (const x of extra) console.log(`  - ${x}`);
    console.log("");
  }

  if (duplicateMappings.length) {
    console.log("DUPLICATE mapping targets (multiple theme ids → same filename):");
    for (const [file, ids] of duplicateMappings) {
      console.log(`  - ${file} ← ${ids.join(", ")}`);
    }
    console.log("");
  }

  console.log("Fallback chain reminder (runtime):");
  console.log("  1) /branding/theme-logos/{key}");
  console.log("  2) Public CDN URL for same key (see theme-brand-logo-cdn)");
  console.log("  3) Optional /api/marketing-assets/{key} proxy when configured");
  console.log("  4) Repeat 1–3 for default theme (lavender) key");
  console.log("  Header chain adds: legacy URL → local SVG → optional tinted stems → lavender PNG + CDN.\n");

  if (missing.length || extra.length) {
    console.log("--- Deployment checklist (Spaces / CDN root keys) ---");
    if (missing.length) {
      console.log("Upload these object keys to the marketing images bucket (same names as local files):");
      for (const m of missing) console.log(`  - ${m}`);
    }
    if (extra.length) {
      console.log("Optional cleanup: orphan keys on CDN not referenced by THEME_OPTIONS (safe to ignore or remove):");
      for (const x of extra) console.log(`  - ${x}`);
    }
    console.log("");
  }

  if (missing.length) process.exit(1);
  process.exit(0);
}

main();
