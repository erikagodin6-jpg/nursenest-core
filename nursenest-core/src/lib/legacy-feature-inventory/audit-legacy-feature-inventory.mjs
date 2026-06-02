#!/usr/bin/env node
/**
 * Legacy feature / content inventory audit.
 * Walks configured repo roots, classifies text files by keyword groups, merges known anchors, writes reports under <repo>/reports/.
 *
 * Usage (from repo root): node nursenest-core/src/lib/legacy-feature-inventory/audit-legacy-feature-inventory.mjs
 * From nursenest-core: node src/lib/legacy-feature-inventory/audit-legacy-feature-inventory.mjs
 * Fast smoke (contract tests / quick local check): add `--smoke` (caps scan/classify; still writes full reports + anchors).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CATEGORY_KEYWORDS,
  KNOWN_ANCHORS,
  MAX_FILE_BYTES,
  MAX_FILES_TO_CLASSIFY,
  MAX_FILES_TO_SCAN,
  SEARCH_ROOTS,
  SKIP_DIR_NAMES,
  SKIP_PATH_SUBSTRINGS,
  TEXT_EXTENSIONS,
  stableItemId,
} from "./legacy-feature-inventory-config.mjs";
import { writeLegacyFeatureReports } from "./legacy-feature-inventory-writers.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const appRoot = join(__dirname, "../../..");
const repoRoot = join(appRoot, "..");

/** Fast path for CI / contract tests: shallow scan + classify, same writers + anchors. */
const SMOKE_MODE = process.argv.includes("--smoke");
const EFFECTIVE_MAX_SCAN = SMOKE_MODE ? 500 : MAX_FILES_TO_SCAN;
const EFFECTIVE_MAX_CLASSIFY = SMOKE_MODE ? 400 : MAX_FILES_TO_CLASSIFY;

function shouldSkipPath(absPath) {
  const rel = relative(repoRoot, absPath).split(sep).join("/");
  for (const s of SKIP_PATH_SUBSTRINGS) {
    if (rel.includes(s)) return true;
  }
  return false;
}

function collectFiles(rootAbs, out, budget, maxScan) {
  const stack = [rootAbs];
  while (stack.length && budget.n < maxScan) {
    const dir = stack.pop();
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      const abs = join(dir, ent.name);
      if (shouldSkipPath(abs)) continue;
      if (ent.isDirectory()) {
        if (SKIP_DIR_NAMES.has(ent.name)) continue;
        stack.push(abs);
      } else if (ent.isFile()) {
        const ext = extname(ent.name).toLowerCase();
        if (!TEXT_EXTENSIONS.has(ext)) continue;
        out.push(abs);
        budget.n += 1;
        if (budget.n >= maxScan) break;
      }
    }
  }
}

function scoreCategory(lower, keywords) {
  let s = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) s += 1;
  }
  return s;
}

function pickCategory(lower) {
  let best = "unknown";
  let bestScore = 0;
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    const sc = scoreCategory(lower, kws);
    if (sc > bestScore) {
      bestScore = sc;
      best = cat;
    }
  }
  return { category: best, score: bestScore };
}

function inferMigration(relPath, category, score, inAppRouter) {
  const inClient = relPath.startsWith("client/");
  const inNext = relPath.startsWith("nursenest-core/");
  if (inAppRouter && inNext) {
    if (score >= 2) return { status: "migrated", reason: "Next app route + keyword signal" };
    return { status: "partially_migrated", reason: "Next app route file; verify canonical read path" };
  }
  if (inNext && relPath.includes("nursenest-core/src/lib/")) {
    return { status: "partially_migrated", reason: "Next library module — may back learner/public routes" };
  }
  if (inNext && relPath.includes("nursenest-core/prisma")) {
    return { status: "migrated", reason: "Prisma schema / SQL — canonical persistence layer" };
  }
  if (inClient) {
    return { status: "not_migrated", reason: "Legacy client tree — no automatic Next route proof" };
  }
  if (relPath.startsWith("scripts/") || relPath.startsWith("nursenest-core/scripts/")) {
    return { status: "unknown", reason: "Script / tooling — may support migration" };
  }
  return { status: "unknown", reason: "Heuristic inconclusive" };
}

function inferPriority(category, status) {
  if (status === "not_migrated" && ["osce", "med_math", "medication_mastery", "lessons"].includes(category)) return "critical";
  if (status === "not_migrated" || status === "partially_migrated") return "high";
  if (category === "unknown") return "low";
  return "medium";
}

function inferAction(status) {
  if (status === "not_migrated") return "migrate";
  if (status === "partially_migrated") return "verify";
  if (status === "migrated") return "verify";
  if (status === "orphaned") return "merge";
  if (status === "duplicate") return "merge";
  return "verify";
}

function confidenceFromScore(score) {
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  if (score >= 1) return "low";
  return "low";
}

function anchorPathSet() {
  const s = new Set();
  for (const a of KNOWN_ANCHORS) {
    for (const p of [...(a.legacySourcePaths ?? []), ...(a.currentSourcePaths ?? [])]) {
      if (p) s.add(p.replace(/\\/g, "/"));
    }
  }
  return s;
}

function main() {
  const skippedLargeFiles = [];
  const scanTruncated = { hitCap: false };
  const anchorPaths = anchorPathSet();
  const files = [];
  const budget = { n: 0 };
  for (const relRoot of SEARCH_ROOTS) {
    if (budget.n >= EFFECTIVE_MAX_SCAN) {
      scanTruncated.hitCap = true;
      break;
    }
    const abs = join(repoRoot, relRoot);
    if (!existsSync(abs)) continue;
    const st = statSync(abs);
    if (st.isDirectory()) collectFiles(abs, files, budget, EFFECTIVE_MAX_SCAN);
    else if (st.isFile()) {
      files.push(abs);
      budget.n += 1;
    }
  }
  if (budget.n >= EFFECTIVE_MAX_SCAN) scanTruncated.hitCap = true;

  const relFiles = [...new Set(files.map((a) => relative(repoRoot, a).split(sep).join("/")))]
    .sort()
    .slice(0, EFFECTIVE_MAX_CLASSIFY);

  const items = [];

  for (const rel of relFiles) {
    if (anchorPaths.has(rel)) continue;
    const abs = join(repoRoot, rel);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.size > MAX_FILE_BYTES) {
      skippedLargeFiles.push({ path: rel, bytes: st.size });
      continue;
    }
    let buf;
    try {
      buf = readFileSync(abs);
    } catch {
      continue;
    }
    const lower = buf.toString("utf8").slice(0, MAX_FILE_BYTES).toLowerCase();
    const { category, score } = pickCategory(lower);
    const inAppRouter = rel.includes("nursenest-core/src/app/") || rel.includes("/src/app/");
    const { status, reason } = inferMigration(rel, category, score, inAppRouter);
    const priority = inferPriority(category, status);
    const title = basename(rel);
    items.push({
      id: stableItemId(rel),
      title,
      category,
      confidence: confidenceFromScore(score),
      legacySourcePaths: rel.startsWith("client/") ? [rel] : [],
      currentSourcePaths: rel.startsWith("client/") ? [] : [rel],
      legacyRoutes: [],
      currentPublicRoutes: [],
      currentLearnerRoutes: [],
      adminRoutes: [],
      canonicalSourceOfTruth: category === "lessons" ? "PathwayLesson (if lesson-related)" : null,
      readPath: null,
      writePath: null,
      migrationStatus: status,
      reasonForStatus: reason,
      recommendedAction: inferAction(status),
      priority,
      notes: score === 0 ? "No category keyword hit — manual triage" : `Keyword score ${score}`,
    });
  }

  for (const a of KNOWN_ANCHORS) {
    items.push({
      id: a.id,
      title: a.title,
      category: a.category,
      confidence: a.confidence ?? "high",
      legacySourcePaths: a.legacySourcePaths ?? [],
      currentSourcePaths: a.currentSourcePaths ?? [],
      legacyRoutes: a.legacyRoutes ?? [],
      currentPublicRoutes: a.currentPublicRoutes ?? [],
      currentLearnerRoutes: a.currentLearnerRoutes ?? [],
      adminRoutes: a.adminRoutes ?? [],
      canonicalSourceOfTruth: a.canonicalSourceOfTruth ?? null,
      readPath: a.readPath ?? null,
      writePath: a.writePath ?? null,
      migrationStatus: a.migrationStatus,
      reasonForStatus: a.reasonForStatus,
      recommendedAction: a.recommendedAction,
      priority: a.priority,
      notes: a.notes ?? "",
    });
  }

  const summary = {
    totalItems: items.length,
    byCategory: {},
    byStatus: {},
    byPriority: {},
  };
  for (const it of items) {
    summary.byCategory[it.category] = (summary.byCategory[it.category] ?? 0) + 1;
    summary.byStatus[it.migrationStatus] = (summary.byStatus[it.migrationStatus] ?? 0) + 1;
    summary.byPriority[it.priority] = (summary.byPriority[it.priority] ?? 0) + 1;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    repoRoot,
    auditRunner: "nursenest-core/src/lib/legacy-feature-inventory/audit-legacy-feature-inventory.mjs",
    scanLimits: {
      maxFilesToScan: EFFECTIVE_MAX_SCAN,
      maxFilesToClassify: EFFECTIVE_MAX_CLASSIFY,
      scanTruncated: scanTruncated.hitCap,
      smoke: SMOKE_MODE,
    },
    summary,
    items,
    skippedLargeFiles,
  };

  const out = writeLegacyFeatureReports(repoRoot, payload);
  console.info("[audit:legacy-features] wrote:");
  console.info(" ", out.jsonPath);
  console.info(" ", out.mdPath);
  console.info(" ", out.gapPath);
  console.info(`[audit:legacy-features] totalItems=${summary.totalItems} skippedLarge=${skippedLargeFiles.length}`);
}

main();
