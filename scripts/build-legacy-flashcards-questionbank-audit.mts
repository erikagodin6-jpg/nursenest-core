#!/usr/bin/env npx tsx
/**
 * Steps 1–3, 8, 11 (audit-only): legacy flashcards, question banks, images → inventory + maps + duplicate hints.
 * Does NOT import into Prisma, does NOT modify schema, does NOT change routing or UI.
 *
 * Outputs under data/audit/:
 * - legacy-flashcards-questionbank-inventory.json
 * - legacy-image-inventory.json
 * - legacy-flashcards-questionbank-map.json
 * - legacy-question-duplicates.json
 * - legacy-flashcard-duplicates.json
 * - flashcards-questionbank-post-legacy-merge.json
 *
 * Run: npx tsx scripts/build-legacy-flashcards-questionbank-audit.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO = path.resolve(ROOT, "..");
const AUDIT_DIR = path.join(ROOT, "data", "audit");

const MAX_JSON_PARSE_BYTES = 12 * 1024 * 1024;
const IMAGE_GLOB_LIMIT = 12000;

function walkFiles(dir: string, pred: (n: string) => boolean, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, pred, out);
    else if (ent.isFile() && pred(ent.name)) out.push(full);
  }
  return out;
}

function readTextSafe(p: string, max = 4_000_000): string {
  const st = fs.statSync(p);
  const buf = Buffer.allocUnsafe(Math.min(st.size, max));
  const fd = fs.openSync(p, "r");
  try {
    fs.readSync(fd, buf, 0, buf.length, 0);
  } finally {
    fs.closeSync(fd);
  }
  return buf.toString("utf8");
}

function tierFromFlashcardPath(rel: string): "RN" | "PN" | "NP" | "Allied" | "unknown" {
  const s = rel.toLowerCase();
  if (s.includes("flashcards-np") || /\/np-/.test(s)) return "NP";
  if (s.includes("flashcards-rpn") || s.includes("rpn")) return "PN";
  if (s.includes("flashcards-rn") || s.includes("/rn-")) return "RN";
  if (s.includes("community") || s.includes("public-health")) return "RN";
  return "unknown";
}

function tierFromQuestionPath(rel: string): "RN" | "PN" | "NP" | "Allied" | "unknown" {
  const s = rel.toLowerCase();
  if (s.includes("/np-advanced") || s.includes("/np-")) return "NP";
  if (s.includes("/rpn-advanced") || s.includes("/rpn-")) return "PN";
  if (s.includes("/rn-advanced") || s.includes("/rn-")) return "RN";
  if (s.includes("allied") || s.includes("paramedic") || s.includes("mlt")) return "Allied";
  return "unknown";
}

function scanTsFeatures(src: string): {
  idCount: number;
  hasStemOrQuestion: boolean;
  hasOptions: boolean;
  hasRationale: boolean;
  hasDifficulty: boolean;
  hasCategory: boolean;
  hasImage: boolean;
  getAssetUrlRefs: string[];
} {
  const idMatches = src.match(/\bid:\s*["']([^"']+)["']/g) ?? [];
  const getAssetUrlRefs: string[] = [];
  const ga = src.matchAll(/getAssetUrl\s*\(\s*["']([^"']+)["']\s*\)/g);
  for (const m of ga) getAssetUrlRefs.push(m[1]!);
  return {
    idCount: idMatches.length,
    hasStemOrQuestion: /\b(stem|question)\s*:/.test(src),
    hasOptions: /\boptions\s*:/.test(src),
    hasRationale:
      /\brationale\b/i.test(src) ||
      /\bdetailedRationale\b/.test(src) ||
      /\boptionRationales\b/.test(src) ||
      /\bclinicalPearl\b/.test(src),
    hasDifficulty: /\bdifficulty\s*:/.test(src),
    hasCategory: /\bcategory\s*:/.test(src),
    hasImage: /\bimage\s*:/.test(src) || getAssetUrlRefs.length > 0,
    getAssetUrlRefs: [...new Set(getAssetUrlRefs)],
  };
}

function parseJsonSafe(p: string): { ok: boolean; data?: unknown; bytes: number; error?: string } {
  const st = fs.statSync(p);
  if (st.size > MAX_JSON_PARSE_BYTES) {
    return { ok: false, bytes: st.size, error: `file_exceeds_${MAX_JSON_PARSE_BYTES}_bytes_skipped` };
  }
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf8"));
    return { ok: true, data, bytes: st.size };
  } catch (e) {
    return { ok: false, bytes: st.size, error: e instanceof Error ? e.message : String(e) };
  }
}

function countJsonQuestions(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.questions)) return o.questions.length;
    if (Array.isArray(o.items)) return o.items.length;
  }
  return 0;
}

function normalizeStemKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

function main() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  const inventory: Record<string, unknown>[] = [];
  const flashcardIdToFiles = new Map<string, string[]>();
  const questionStemSamples = new Map<string, string[]>();

  const flashcardTs = walkFiles(path.join(REPO, "client/src/data"), (n) => /^flashcards.*\.ts$/.test(n));
  for (const abs of flashcardTs) {
    const rel = path.relative(REPO, abs).replace(/\\/g, "/");
    const src = readTextSafe(abs, 8_000_000);
    const feat = scanTsFeatures(src);
    const ids = [...src.matchAll(/\bid:\s*["']([^"']+)["']/g)].map((m) => m[1]!);
    for (const id of ids) {
      if (!flashcardIdToFiles.has(id)) flashcardIdToFiles.set(id, []);
      flashcardIdToFiles.get(id)!.push(rel);
    }
    inventory.push({
      filePath: abs,
      repoRelativePath: rel,
      sourceType: "legacy_ts_flashcards",
      contentType: ["flashcards"],
      pathwayOrProfession: tierFromFlashcardPath(rel),
      approximateCardCount: feat.idCount,
      features: {
        promptOrStem: feat.hasStemOrQuestion,
        options: feat.hasOptions,
        correctAnswer: feat.hasOptions,
        rationale: feat.hasRationale,
        difficulty: feat.hasDifficulty,
        tagsOrCategories: feat.hasCategory,
        imageReferences: feat.hasImage,
        getAssetUrlCount: feat.getAssetUrlRefs.length,
      },
    });
  }

  const advTs = walkFiles(path.join(REPO, "client/src/data/advanced-questions"), (n) => n.endsWith(".ts") && n !== "index.ts");
  for (const abs of advTs) {
    const rel = path.relative(REPO, abs).replace(/\\/g, "/");
    const src = readTextSafe(abs, 8_000_000);
    const feat = scanTsFeatures(src);
    inventory.push({
      filePath: abs,
      repoRelativePath: rel,
      sourceType: "legacy_ts_advanced_questions",
      contentType: ["question_bank", "practice_test_items"],
      pathwayOrProfession: tierFromQuestionPath(rel),
      approximateQuestionCount: feat.idCount,
      features: {
        stem: feat.hasStemOrQuestion,
        options: feat.hasOptions,
        rationale: feat.hasRationale,
        difficulty: feat.hasDifficulty,
        imageReferences: feat.hasImage,
      },
    });
  }

  const careerJson = walkFiles(path.join(REPO, "data/career-questions"), (n) => n.endsWith(".json"));
  for (const abs of careerJson) {
    const rel = path.relative(REPO, abs).replace(/\\/g, "/");
    const parsed = parseJsonSafe(abs);
    const n = parsed.ok ? countJsonQuestions(parsed.data) : 0;
    inventory.push({
      filePath: abs,
      repoRelativePath: rel,
      sourceType: "legacy_json_career_questions",
      contentType: ["question_bank"],
      pathwayOrProfession: /rrt|paramedic|pta|mlt|sonography|social-worker|surgical/i.test(rel) ? "Allied" : "unknown",
      questionCountApprox: n,
      parseStatus: parsed.ok ? "ok" : parsed.error,
      byteSize: parsed.bytes,
    });
  }

  const replitDir = path.join(ROOT, "data/replit-exports");
  for (const name of ["exam_questions.json", "allied_questions.json", "generated_questions.json", "imaging_questions.json", "question_type_registry.json"]) {
    const abs = path.join(replitDir, name);
    if (!fs.existsSync(abs)) continue;
    const st = fs.statSync(abs);
    const parsed = st.size <= MAX_JSON_PARSE_BYTES ? parseJsonSafe(abs) : { ok: false, bytes: st.size, error: "too_large_for_full_parse" };
    let count = 0;
    if (parsed.ok && Array.isArray(parsed.data)) count = parsed.data.length;
    else if (parsed.ok && parsed.data && typeof parsed.data === "object" && Array.isArray((parsed.data as { questions?: unknown }).questions))
      count = ((parsed.data as { questions: unknown[] }).questions ?? []).length;
    inventory.push({
      filePath: abs,
      repoRelativePath: path.relative(REPO, abs).replace(/\\/g, "/"),
      sourceType: "replit_export_json",
      contentType: ["question_bank"],
      pathwayOrProfession: name.includes("allied") ? "Allied" : "mixed",
      questionCountApprox: count,
      byteSize: st.size,
      parseStatus: parsed.ok ? "ok" : (parsed as { error?: string }).error ?? "skipped",
    });
  }

  const matDir = path.join(ROOT, "data/materialized");
  if (fs.existsSync(matDir)) {
    for (const abs of walkFiles(matDir, (n) => n === "questions.json")) {
      const st = fs.statSync(abs);
      const parsed = st.size <= MAX_JSON_PARSE_BYTES ? parseJsonSafe(abs) : { ok: false, bytes: st.size, error: "too_large" };
      let count = 0;
      if (parsed.ok && Array.isArray(parsed.data)) count = parsed.data.length;
      inventory.push({
        filePath: abs,
        repoRelativePath: path.relative(REPO, abs).replace(/\\/g, "/"),
        sourceType: "materialized_questions_snapshot",
        contentType: ["question_bank", "current_pipeline_output"],
        pathwayOrProfession: path.basename(path.dirname(abs)),
        questionCountApprox: count,
        byteSize: st.size,
        parseStatus: parsed.ok ? "ok" : "skipped_large_or_error",
      });
    }
  }

  const imageEntries: Record<string, unknown>[] = [];
  const publicDirs = [
    path.join(REPO, "client/public"),
    path.join(ROOT, "public"),
  ].filter((d) => fs.existsSync(d));
  const imgExt = /\.(png|jpe?g|webp|gif|svg)$/i;
  for (const root of publicDirs) {
    let n = 0;
    for (const abs of walkFiles(root, (f) => imgExt.test(f))) {
      if (n++ >= IMAGE_GLOB_LIMIT) break;
      const rel = path.relative(REPO, abs).replace(/\\/g, "/");
      imageEntries.push({
        filePath: abs,
        repoRelativePath: rel,
        filename: path.basename(abs),
        imageType: /flashcard|card/i.test(rel) ? "flashcard_image" : /question|exam/i.test(rel) ? "question_image" : "general_asset",
        referencedInCodeScan: "use_getAssetUrl_inventory_from_flashcard_ts",
      });
    }
  }

  const refFromFlashcards = new Set<string>();
  for (const abs of flashcardTs) {
    const src = readTextSafe(abs, 6_000_000);
    for (const m of src.matchAll(/getAssetUrl\s*\(\s*["']([^"']+)["']\s*\)/g)) refFromFlashcards.add(m[1]!);
  }

  const imageInventory = {
    generatedAt: new Date().toISOString(),
    externalVolumesMounted: false,
    note: "Full public/ image walk capped for CI; extend cap or narrow dirs for exhaustive asset audit.",
    getAssetUrlUniqueStringsFromFlashcardTs: [...refFromFlashcards].sort(),
    samplePublicImageFiles: imageEntries.slice(0, 500),
    totalPublicImageFilesSampled: imageEntries.length,
  };
  fs.writeFileSync(path.join(AUDIT_DIR, "legacy-image-inventory.json"), JSON.stringify(imageInventory, null, 2));

  const flashDup = [...flashcardIdToFiles.entries()].filter(([, files]) => files.length > 1);
  fs.writeFileSync(
    path.join(AUDIT_DIR, "legacy-flashcard-duplicates.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        duplicateIdsAppearingInMultipleFiles: flashDup.map(([id, files]) => ({ flashcardId: id, files })),
        count: flashDup.length,
      },
      null,
      2,
    ),
  );

  const stemBuckets = new Map<string, string[]>();
  for (const abs of advTs.slice(0, 200)) {
    const src = readTextSafe(abs, 2_000_000);
    for (const m of src.matchAll(/stem:\s*["']([^"']{20,400})["']/g)) {
      const k = normalizeStemKey(m[1]!);
      if (k.length < 20) continue;
      if (!stemBuckets.has(k)) stemBuckets.set(k, []);
      stemBuckets.get(k)!.push(path.relative(REPO, abs));
    }
  }
  const qDup = [...stemBuckets.entries()].filter(([, files]) => files.length > 1).slice(0, 500);
  fs.writeFileSync(
    path.join(AUDIT_DIR, "legacy-question-duplicates.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: "Heuristic duplicate detection on advanced-question TS stem: string samples (first 200 files scanned for stems).",
        duplicateStemGroups: qDup.map(([stemKey, files]) => ({ normalizedStemKey: stemKey, sourceFiles: files })),
        count: qDup.length,
      },
      null,
      2,
    ),
  );

  const mapRows: Record<string, unknown>[] = [];
  for (const row of inventory) {
    const rel = row.repoRelativePath as string;
    const ctype = row.contentType as string[];
    const tier = (row.pathwayOrProfession as string) || "unknown";
    mapRows.push({
      legacySourcePath: rel,
      currentTargetArea: ctype.includes("current_pipeline_output") ? "materialized_import_pipeline" : "legacy_monolith_ts_or_json",
      targetProfessionTier: tier,
      matchConfidence: ctype.includes("current_pipeline_output") ? "high" : "medium",
      action: ctype.includes("current_pipeline_output") ? "merge_into_existing" : "review_needed",
      notes: [
        "DB ExamQuestion rows not queried in this audit; use Prisma or admin export to diff against legacy bundles before import.",
      ],
    });
  }
  fs.writeFileSync(
    path.join(AUDIT_DIR, "legacy-flashcards-questionbank-map.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), mapping: mapRows }, null, 2),
  );

  fs.writeFileSync(
    path.join(AUDIT_DIR, "legacy-flashcards-questionbank-inventory.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        externalVolumesMounted: false,
        note: "Mount or symlink external drives under repo paths to include them in a future scan.",
        repoRoot: REPO,
        totals: {
          legacyFlashcardTsFiles: flashcardTs.length,
          advancedQuestionTsFiles: advTs.length,
          careerQuestionJsonFiles: careerJson.length,
          inventoryRows: inventory.length,
        },
        sources: inventory,
      },
      null,
      2,
    ),
  );

  const post = {
    generatedAt: new Date().toISOString(),
    phase: "audit_only_no_import",
    auditOutputsWritten: [
      "data/audit/legacy-flashcards-questionbank-inventory.json",
      "data/audit/legacy-image-inventory.json",
      "data/audit/legacy-flashcards-questionbank-map.json",
      "data/audit/legacy-question-duplicates.json",
      "data/audit/legacy-flashcard-duplicates.json",
      "data/audit/flashcards-questionbank-post-legacy-merge.json",
    ],
    constraints: {
      prismaSchemaChanged: false,
      routingChanged: false,
      authChanged: false,
      entitlementsChanged: false,
    },
    flashcardsMergedCount: 0,
    questionsMergedCount: 0,
    newFlashcardsCreatedCount: 0,
    newQuestionsCreatedCount: 0,
    imagesMappedCount: 0,
    lessonImagesAddedCount: 0,
    duplicateFlashcardIdsFlagged: flashDup.length,
    duplicateQuestionStemGroupsFlagged: qDup.length,
    filesTouchedByThisScript: ["scripts/build-legacy-flashcards-questionbank-audit.mts"],
    currentUiFilesUpdated: [] as string[],
    themePreserved: true,
    gaps: [
      "No bulk import run — use editorial pipeline + stem_hash / id matching against ExamQuestion before inserts.",
      "External volumes (e.g. /Volumes/Backup Plus) not visible on this host — mount or symlink under repo to include in a future scan.",
      "Replit JSON exports may be very large; counts use parse when under size cap.",
    ],
  };
  fs.writeFileSync(path.join(AUDIT_DIR, "flashcards-questionbank-post-legacy-merge.json"), JSON.stringify(post, null, 2));

  console.log(`Wrote legacy flashcard/question audit (${ts})`);
  console.log(JSON.stringify({ flashcardFiles: flashcardTs.length, advancedTs: advTs.length, careerJson: careerJson.length, flashIdDupes: flashDup.length }, null, 2));
}

main();
