#!/usr/bin/env node
/**
 * Content discovery only — reads legacy maps and local snapshots (no DB).
 * Writes:
 *   data/audit/unimported-legacy-content.json
 *   data/audit/high-value-import-candidates.json
 */
import fs from "node:fs";
import path from "node:path";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const AUDIT = path.join(APP_ROOT, "data/audit");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function walkSlugs(obj, out) {
  if (!obj || typeof obj !== "object") return;
  if (typeof obj.slug === "string" && obj.slug.length > 0) out.add(obj.slug);
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) v.forEach((x) => walkSlugs(x, out));
    else if (v && typeof v === "object") walkSlugs(v, out);
  }
}

/** Normalize for cross-compare: legacy id vs catalog / master-map slugs */
function normKey(s) {
  return String(s)
    .toLowerCase()
    .replace(/^us-rn-|^ca-rn-|^us-lpn-|^ca-rpn-|^us-np-|^ca-np-/, "")
    .replace(/-nclex-rn$|-nclex-pn$|-nclex-np$/, "")
    .replace(/-rex-pn$/, "")
    .replace(/-rpn$/, "")
    .replace(/-rn$/, "")
    .replace(/-pn$/, "")
    .replace(/-np$/, "");
}

function pathwayGuessFromId(id) {
  const s = String(id).toLowerCase();
  if (s.includes("np-") || s.endsWith("-np") || /fnp|acute-care-np|pmhnp|women-health-np/.test(s)) return "NP";
  if (s.includes("rpn") || s.includes("-pn") || s.includes("lpn") || s.endsWith("-pn")) return "PN";
  if (s.includes("rn") || s.endsWith("-rn")) return "RN";
  if (
    /mlt|rrt|paramedic|surgical-tech|imaging|pta|ota|dms|sonograph|pharmacy-tech|addictions-counsellor|social-worker|cardiac-sonographer/.test(
      s,
    )
  )
    return "Allied";
  return "unknown";
}

function countryGuessFromPathway(pid) {
  if (!pid) return "unknown";
  if (String(pid).startsWith("ca-")) return "CA";
  if (String(pid).startsWith("us-")) return "US";
  return "unknown";
}

const RN_HIGH_VALUE =
  /\b(shock|sepsis|mi\b|myocardial|heart failure|arrhythmia|stroke|dka|hhns|pe\b|pulmonary emboli|ards|gi bleed|overdose|trauma|anaphylaxis|eclampsia|hemorrhage|cardiac arrest|prioritization|triage|thyroid storm|adrenal crisis)\b/i;

function countTsLessonFiles() {
  const dir = path.join(REPO_ROOT, "client/src/data/lessons");
  if (!fs.existsSync(dir)) return { tsFiles: 0, lessonModules: 0 };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "types.ts");
  return { tsFiles: files.length + 1, lessonModules: files.length };
}

function scanCareerQuestionFiles() {
  const dir = path.join(REPO_ROOT, "data/career-questions");
  if (!fs.existsSync(dir)) return { files: [], totalQuestions: 0, fileCount: 0 };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const items = [];
  let totalQuestions = 0;
  for (const name of files) {
    const fp = path.join(dir, name);
    let n = 0;
    try {
      const data = readJson(fp);
      if (Array.isArray(data)) n = data.length;
      else if (data && typeof data === "object" && Array.isArray(data.questions)) n = data.questions.length;
    } catch {
      n = -1;
    }
    if (n >= 0) totalQuestions += n;
    items.push({
      type: "question",
      sourceFile: `data/career-questions/${name}`,
      title: name.replace(/\.json$/, "").replace(/-/g, " "),
      inferredSlug: path.basename(name, ".json"),
      pathwayGuess: "Allied",
      countryGuess: "unknown",
      reasonNotImported: "offline_audit_no_qbank_crosswalk",
      confidence: "low",
      classification: "not_cross_checked",
      questionCount: n,
    });
  }
  return { files: items, totalQuestions, fileCount: files.length };
}

function scanReplitBlogDrafts() {
  const seoPath = path.join(APP_ROOT, "data/replit-exports/seo_articles.json");
  const imgPath = path.join(APP_ROOT, "data/replit-exports/imaging_blog_articles.json");
  const out = [];
  for (const [label, p] of [
    ["seo_articles", seoPath],
    ["imaging_blog_articles", imgPath],
  ]) {
    if (!fs.existsSync(p)) continue;
    const arr = readJson(p);
    if (!Array.isArray(arr)) continue;
    const draft = arr.filter((x) => x.status === "draft" || !x.published_at).length;
    const withBody = arr.filter((x) => x.content_md && String(x.content_md).length > 200).length;
    out.push({
      type: "blog",
      sourceFile: `nursenest-core/data/replit-exports/${path.basename(p)}`,
      title: label,
      inferredSlug: null,
      pathwayGuess: "Allied",
      countryGuess: "unknown",
      reasonNotImported: "draft_or_empty_content_md_in_export",
      confidence: "medium",
      classification: "partially_imported",
      recordCount: arr.length,
      draftLikeCount: draft,
      substantialContentCount: withBody,
    });
  }
  return out;
}

function lessonSubgroup(row, classification) {
  if (classification !== "C") return null;
  const id = row.legacyLessonId;
  const title = row.legacyTitle ?? "";
  const notes = row.notes ?? [];
  if (notes.some((n) => /allied-only|assign manually/i.test(String(n)))) {
    return "unsafe_or_needs_manual_pathway";
  }
  if (/placeholder|lorem ipsum/i.test(title)) return "unsafe_to_import";
  if (pathwayGuessFromId(id) === "unknown") return "needs_pathway_mapping";
  if (/rpn-content-batch|batch-\d{3}|content-batch/i.test(id)) return "needs_transformation";
  if (/^[a-z0-9]+-[a-z0-9-]+-rn$/.test(id) && title.length > 40) return "ready_to_import";
  if (pathwayGuessFromId(id) === "RN" && title.length > 50) return "ready_to_import";
  return "needs_slug_mapping";
}

function main() {
  const mapPath = path.join(AUDIT, "legacy-to-current-lesson-map.json");
  if (!fs.existsSync(mapPath)) {
    console.error("Missing", mapPath);
    process.exit(1);
  }
  const lessonMap = readJson(mapPath);
  const mapping = lessonMap.mapping ?? [];

  const catalogPath = path.join(APP_ROOT, "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json");
  const catalogNorm = new Set();
  if (fs.existsSync(catalogPath)) {
    const cat = readJson(catalogPath);
    for (const k of Object.keys(cat)) {
      const arr = cat[k];
      if (!Array.isArray(arr)) continue;
      for (const row of arr) {
        catalogNorm.add(normKey(row.slug));
        if (row.topicSlug) catalogNorm.add(normKey(row.topicSlug));
      }
    }
  }

  const masterNorm = new Set();
  const masterPath = path.join(APP_ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");
  if (fs.existsSync(masterPath)) {
    const raw = new Set();
    walkSlugs(readJson(masterPath), raw);
    for (const s of raw) masterNorm.add(normKey(s));
  }

  let masterOnlyCount = 0;
  for (const k of masterNorm) {
    if (!catalogNorm.has(k)) masterOnlyCount += 1;
  }

  const inventory = [];
  const lessonCounts = {
    A_alreadyImportedMaterialized: 0,
    B_partialMasterMapOnly: 0,
    B_partialMergeIntoExisting: 0,
    C_notOnCatalogOrMaster: 0,
  };

  const pathwayMissing = { RN: 0, PN: 0, NP: 0, Allied: 0, unknown: 0 };

  const groups = {
    readyToImport: [],
    needsSlugMapping: [],
    needsTransformation: [],
    needsPathwayMapping: [],
    unsafeOrManualReview: [],
  };

  for (const row of mapping) {
    const id = row.legacyLessonId;
    const title = row.legacyTitle ?? "";
    const action = row.action ?? "";
    const n = normKey(id);
    const catalogHit = catalogNorm.has(n);
    const masterHit = masterNorm.has(n);

    let classification = "C";
    let letter = "C";
    let reason = "create_missing_current_lesson";

    if (action === "merge_into_existing") {
      classification = "B";
      letter = "B";
      reason = "merge_into_existing_duplicate_pathway_buckets";
      lessonCounts.B_partialMergeIntoExisting += 1;
    } else if (catalogHit) {
      classification = "A";
      letter = "A";
      reason = "normalized_slug_matches_materialized_catalog_lesson";
      lessonCounts.A_alreadyImportedMaterialized += 1;
    } else if (masterHit) {
      classification = "B";
      letter = "B";
      reason = "normalized_slug_on_rn_master_map_but_not_in_replit_catalog_snapshot";
      lessonCounts.B_partialMasterMapOnly += 1;
    } else {
      lessonCounts.C_notOnCatalogOrMaster += 1;
      const pg = pathwayGuessFromId(id);
      pathwayMissing[pg] += 1;
    }

    const pg = pathwayGuessFromId(id);
    const sub = lessonSubgroup(row, classification);
    if (classification === "C" && sub) {
      const entry = { legacyLessonId: id, title, subgroupHint: sub };
      if (sub === "ready_to_import") groups.readyToImport.push(entry);
      else if (sub === "needs_slug_mapping") groups.needsSlugMapping.push(entry);
      else if (sub === "needs_transformation") groups.needsTransformation.push(entry);
      else if (sub === "needs_pathway_mapping") groups.needsPathwayMapping.push(entry);
      else groups.unsafeOrManualReview.push(entry);
    }

    inventory.push({
      type: "lesson",
      sourceFile:
        (row.legacySourcePaths && row.legacySourcePaths[0]) || "client/src/data/lessons/index.ts → contentMap",
      title,
      inferredSlug: id,
      pathwayGuess: pg,
      countryGuess: countryGuessFromPathway(row.targetPathwayId),
      reasonNotImported: reason,
      confidence: row.matchConfidence ?? "none",
      classification:
        letter === "A" ? "already_imported" : letter === "B" ? "partially_imported" : "not_imported",
      legacyLessonId: id,
      targetSlug: row.targetSlug,
      targetPathwayId: row.targetPathwayId,
      action,
      normalizedKey: n,
      catalogMaterializedMatch: catalogHit,
      masterMapMatch: masterHit,
    });
  }

  const career = scanCareerQuestionFiles();
  const blogs = scanReplitBlogDrafts();
  inventory.push(...career.files, ...blogs);

  const missingFromSite = lessonCounts.C_notOnCatalogOrMaster;
  const highQualityMissing = inventory.filter(
    (e) =>
      e.type === "lesson" &&
      e.classification === "not_imported" &&
      e.title &&
      e.title.length > 45 &&
      !/placeholder|test lesson|lorem/i.test(e.title),
  ).length;

  const candidates = inventory
    .filter((e) => e.type === "lesson" && e.classification === "not_imported")
    .filter((e) => pathwayGuessFromId(e.legacyLessonId) === "RN")
    .filter((e) => RN_HIGH_VALUE.test(e.title))
    .sort((a, b) => (b.title?.length ?? 0) - (a.title?.length ?? 0))
    .slice(0, 20);

  const tsInfo = countTsLessonFiles();

  const outMain = {
    generatedAt: new Date().toISOString(),
    methodology: {
      importedSlugSources: [
        "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json (normalized slug + topicSlug)",
        "src/content/pathway-lessons/rn-nclex-master-map.json (normalized slug)",
      ],
      dbQueried: false,
      note:
        "A = topic appears in materialized Replit catalog JSON. B = on RN master map and/or merge target only. C = no normalized match to either snapshot.",
      legacyMapSource: "data/audit/legacy-to-current-lesson-map.json",
    },
    counts: {
      totalLegacyLessonRows: mapping.length,
      totalLegacyContentMapKeys: 4223,
      clientLessonTsFilesApprox: tsInfo.tsFiles,
      lessonClassification: lessonCounts,
      missingFromCurrentSnapshots: missingFromSite,
      highQualityMissingLessonsApprox: highQualityMissing,
      pathwayGuessOnMissing: pathwayMissing,
      careerQuestionJsonFiles: career.fileCount,
      careerQuestionItemsTotal: career.totalQuestions,
      catalogNormalizedKeys: catalogNorm.size,
      masterMapNormalizedKeys: masterNorm.size,
      masterNotInCatalogTopicsApprox: masterOnlyCount,
    },
    lessonAnalysisGroups: {
      ...groups,
      counts: {
        readyToImport: groups.readyToImport.length,
        needsSlugMapping: groups.needsSlugMapping.length,
        needsTransformation: groups.needsTransformation.length,
        needsPathwayMapping: groups.needsPathwayMapping.length,
        unsafeOrManualReview: groups.unsafeOrManualReview.length,
      },
    },
    items: inventory,
  };

  fs.mkdirSync(AUDIT, { recursive: true });
  fs.writeFileSync(path.join(AUDIT, "unimported-legacy-content.json"), JSON.stringify(outMain, null, 2));

  const outHV = {
    generatedAt: new Date().toISOString(),
    priority: "RN_first_exam_high_yield_title_match",
    criteria:
      "lesson + not_imported + pathwayGuess RN (from legacy id) + title matches high-yield clinical regex; longer titles preferred as completeness proxy",
    top20: candidates.map((c, i) => ({
      rank: i + 1,
      legacyLessonId: c.legacyLessonId,
      title: c.title,
      normalizedKey: c.normalizedKey,
    })),
  };
  fs.writeFileSync(path.join(AUDIT, "high-value-import-candidates.json"), JSON.stringify(outHV, null, 2));

  console.log(
    JSON.stringify(
      {
        wrote: [
          "data/audit/unimported-legacy-content.json",
          "data/audit/high-value-import-candidates.json",
        ],
        lessonCounts,
        missingFromSite,
        careerFiles: career.fileCount,
      },
      null,
      2,
    ),
  );
}

main();
