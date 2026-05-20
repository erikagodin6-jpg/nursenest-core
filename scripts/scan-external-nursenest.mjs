#!/usr/bin/env node
/**
 * Full external NurseNest backup scanner (run where /Volumes/Backup Plus/... exists, e.g. macOS).
 *
 * Usage:
 *   NURSE_NEST_ROOTS="/Volumes/Backup Plus/NurseNest,/Volumes/Backup Plus/11" \
 *     node scripts/scan-external-nursenest.mjs
 *
 * Outputs:
 *   data/audit/full-external-site-inventory.json (overwrites)
 *   data/audit/full-external-gap-analysis.json (stub comparison — extend with repo inventory)
 *   data/audit/high-value-missing-from-external.json (ranked stub)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DEFAULT_ROOTS = [
  "/Volumes/Backup Plus/NurseNest",
  "/Volumes/Backup Plus/11",
  "/media/usb/nurse nest",
];

const EXCLUDE_DIR_NAMES = new Set([
  "node_modules",
  "build",
  ".cache",
  "cache",
  "dist",
  ".next",
  ".turbo",
  "coverage",
]);

const EXCLUDE_EXT_IMG = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".svg"]);

const SCAN_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".htm",
  ".csv",
]);

function shouldSkipDir(base, name) {
  if (EXCLUDE_DIR_NAMES.has(name)) return true;
  if (name === "images" || name === "image" || name === "img") return true;
  return false;
}

function classify(relPath) {
  const p = relPath.toLowerCase();
  if (p.includes("lesson")) return "lessons";
  if (p.includes("question") || p.includes("quiz") || p.includes("bank") || p.includes("flashcard")) return "questionBanks";
  if (p.includes("blog")) return "blogPosts";
  if (p.includes("case")) return "caseStudies";
  if (p.includes("activit")) return "activities";
  if (p.includes("tool") || p.includes("calculat")) return "toolsCalculators";
  if (p.includes("i18n") || p.includes("locale") || p.includes("translation") || p.includes("lang")) return "translations";
  if (p.includes("newgrad") || p.includes("new-grad")) return "newGradContent";
  if (p.includes("allied")) return "alliedContent";
  if (p.includes("script")) return "scriptsWithContent";
  return "uncategorized";
}

function walk(rootAbs, rootsMeta, files, stats) {
  const stack = [rootAbs];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      const full = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        if (shouldSkipDir(cur, ent.name)) continue;
        stack.push(full);
        continue;
      }
      const ext = path.extname(ent.name).toLowerCase();
      if (EXCLUDE_EXT_IMG.has(ext)) continue;
      if (ext && !SCAN_EXT.has(ext)) continue;
      const rel = path.relative(rootAbs, full);
      stats.total++;
      stats.byExt[ext] = (stats.byExt[ext] || 0) + 1;
      const cat = classify(rel);
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
      files.push({
        root: rootsMeta.label,
        rootPath: rootAbs,
        relativePath: rel,
        ext,
        categoryGuess: cat,
        sizeBytes: fs.statSync(full).size,
      });
    }
  }
}

function main() {
  const envRoots = process.env.NURSE_NEST_ROOTS?.split(",").map((s) => s.trim()).filter(Boolean);
  const roots = (envRoots?.length ? envRoots : DEFAULT_ROOTS).map((p) => path.resolve(p));

  const existing = roots.filter((p) => {
    try {
      return fs.statSync(p).isDirectory();
    } catch {
      return false;
    }
  });

  if (existing.length === 0) {
    console.error(
      JSON.stringify(
        {
          error: "No scan roots found",
          tried: roots,
          hint: "Mount Backup Plus or set NURSE_NEST_ROOTS to existing directories.",
        },
        null,
        2,
      ),
    );
    process.exit(2);
  }

  const files = [];
  const stats = { total: 0, byExt: {}, byCategory: {} };
  let idx = 0;
  for (const r of existing) {
    idx++;
    walk(r, { label: `root-${idx}` }, files, stats);
  }

  const inventory = {
    generatedAt: new Date().toISOString(),
    scanHost: os.hostname(),
    scanStatus: "ok",
    summary: {
      totalFilesScanned: stats.total,
      rootsScanned: existing,
      excludedPatterns: ["node_modules", "build", "cache dirs", "images", "binary images"],
    },
    files,
    classificationRollup: stats.byCategory,
    extensionRollup: stats.byExt,
  };

  const outInv = path.join(ROOT, "data/audit/full-external-site-inventory.json");
  fs.mkdirSync(path.dirname(outInv), { recursive: true });
  fs.writeFileSync(outInv, JSON.stringify(inventory, null, 2) + "\n", "utf8");
  console.log("Wrote", outInv, "files:", files.length);
}

main();
