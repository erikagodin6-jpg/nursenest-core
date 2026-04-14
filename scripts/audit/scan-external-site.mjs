#!/usr/bin/env node
/**
 * Full external NurseNest backup scan (run where /Volumes/Backup Plus/... exists).
 *
 * Usage:
 *   BACKUP_ROOTS="/Volumes/Backup Plus/NurseNest:/Volumes/Backup Plus/11" \
 *     node scripts/audit/scan-external-site.mjs
 *
 * Outputs JSON under data/audit/ (overwrites inventory + seeds gap analysis).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const OUT_INV = path.join(ROOT, "data/audit/full-external-site-inventory.json");
const OUT_GAP = path.join(ROOT, "data/audit/full-external-gap-analysis.json");
const OUT_HI = path.join(ROOT, "data/audit/high-value-missing-from-external.json");

const EXCLUDE_DIR_NAMES = new Set([
  "node_modules",
  "build",
  "dist",
  ".next",
  "cache",
  ".turbo",
  "coverage",
  "images",
  "img",
  "assets",
]);
const EXCLUDE_EXT_IMG = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"]);

const INCLUDE_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".htm",
  ".yml",
  ".yaml",
]);

function shouldSkipDir(name) {
  return EXCLUDE_DIR_NAMES.has(name) || name.startsWith(".");
}

function classify(relPath, name) {
  const p = relPath.toLowerCase();
  const cats = [];
  if (p.includes("lesson") || p.includes("curriculum")) cats.push("lessons");
  if (p.includes("question") || p.includes("quiz") || p.includes("bank") || p.includes("qbank"))
    cats.push("questionBanks");
  if (p.includes("blog")) cats.push("blogPosts");
  if (p.includes("case")) cats.push("caseStudies");
  if (p.includes("activit")) cats.push("activities");
  if (p.includes("tool") || p.includes("calc")) cats.push("toolsCalculators");
  if (p.includes("i18n") || p.includes("locale") || p.includes("translation") || p.includes("lang"))
    cats.push("translations");
  if (p.includes("newgrad") || p.includes("new-grad")) cats.push("newGradContent");
  if (p.includes("allied")) cats.push("alliedContent");
  if (p.includes("script")) cats.push("scriptsWithContent");
  if (cats.length === 0) cats.push("uncategorized");
  return cats;
}

function walk(rootAbs, rootsLabel, files, stats) {
  const stack = [rootAbs];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (shouldSkipDir(e.name)) continue;
        stack.push(full);
        continue;
      }
      const ext = path.extname(e.name).toLowerCase();
      if (EXCLUDE_EXT_IMG.has(ext)) {
        stats.skippedImages++;
        continue;
      }
      if (!INCLUDE_EXT.has(ext)) {
        stats.skippedOtherExt++;
        continue;
      }
      const rel = path.relative(rootAbs, full);
      const relTagged = path.join(rootsLabel, rel);
      stats.totalFiles++;
      const cats = classify(relTagged, e.name);
      for (const c of cats) {
        stats.byCategory[c] = (stats.byCategory[c] || 0) + 1;
      }
      files.push({
        root: rootsLabel,
        path: relTagged,
        ext,
        size: fs.statSync(full).size,
        categories: cats,
      });
    }
  }
}

function main() {
  const envRoots = process.env.BACKUP_ROOTS?.split(":").filter(Boolean) || [];
  const defaultRoots = [
    "/Volumes/Backup Plus/NurseNest",
    "/Volumes/Backup Plus/11",
    "/media/usb/nurse nest",
  ];
  const roots = envRoots.length ? envRoots : defaultRoots;

  const missing = [];
  const present = [];
  for (const r of roots) {
    try {
      fs.accessSync(r);
      present.push(r);
    } catch {
      missing.push(r);
    }
  }

  if (present.length === 0) {
    const payload = {
      generatedAt: new Date().toISOString(),
      scanStatus: "aborted",
      reason: "No BACKUP_ROOTS path exists on this machine.",
      requestedPaths: roots,
      missingPaths: missing,
      totalFilesScanned: 0,
      instructions: "Mount Backup Plus or set BACKUP_ROOTS to accessible directories.",
    };
    fs.mkdirSync(path.dirname(OUT_INV), { recursive: true });
    fs.writeFileSync(OUT_INV, JSON.stringify(payload, null, 2) + "\n");
    console.error(JSON.stringify(payload, null, 2));
    process.exit(2);
  }

  const files = [];
  const stats = {
    totalFiles: 0,
    skippedImages: 0,
    skippedOtherExt: 0,
    byCategory: {},
  };

  for (const r of present) {
    const label = path.basename(r);
    walk(r, label, files, stats);
  }

  const lessonLike = files.filter((f) => f.categories.includes("lessons")).length;
  const blogLike = files.filter((f) => f.categories.includes("blogPosts")).length;
  const qbLike = files.filter((f) => f.categories.includes("questionBanks")).length;

  const inventory = {
    generatedAt: new Date().toISOString(),
    scanStatus: "ok",
    rootsScanned: present,
    rootsMissing: missing,
    totalFilesScanned: stats.totalFiles,
    skippedImagesApprox: stats.skippedImages,
    skippedNonIncludedExtApprox: stats.skippedOtherExt,
    approximateCounts: {
      lessonsPathMatches: lessonLike,
      blogPathMatches: blogLike,
      questionBankPathMatches: qbLike,
    },
    byCategory: stats.byCategory,
    files,
  };

  fs.mkdirSync(path.dirname(OUT_INV), { recursive: true });
  fs.writeFileSync(OUT_INV, JSON.stringify(inventory, null, 2) + "\n");

  const gap = {
    generatedAt: new Date().toISOString(),
    scanStatus: "inventory_only",
    note: "Compare files[].path against nursenest-core/ using a second pass (git grep / ripgrep) to label A–E.",
    items: [],
  };
  fs.writeFileSync(OUT_GAP, JSON.stringify(gap, null, 2) + "\n");

  const hi = {
    generatedAt: new Date().toISOString(),
    note: "Populate after gap analysis; see full-external-gap-analysis.json",
    topImportCandidates: files.slice(0, 30).map((f) => ({
      path: f.path,
      categories: f.categories,
      rationale: "First 30 scanned files — replace with ranked gap analysis.",
    })),
  };
  fs.writeFileSync(OUT_HI, JSON.stringify(hi, null, 2) + "\n");

  console.log(
    JSON.stringify(
      {
        ok: true,
        rootsScanned: present,
        totalFiles: stats.totalFiles,
        lessonLike,
        blogLike,
        qbLike,
        written: [OUT_INV, OUT_GAP, OUT_HI],
      },
      null,
      2,
    ),
  );
}

main();
