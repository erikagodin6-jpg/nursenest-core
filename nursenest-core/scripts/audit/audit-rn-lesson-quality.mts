#!/usr/bin/env node
/**
 * RN-only pathway lesson quality audit.
 *
 * This intentionally reads bundled RN catalog files only. It does not touch PN,
 * RPN, NP, allied, CNA, lab, ECG, or generic lesson catalogs. Production public
 * runtime can still be DB-first; use this report as the catalog/source audit and
 * SME queue before publishing DB-backed content changes.
 *
 * Run:
 *   npx tsx scripts/audit/audit-rn-lesson-quality.mts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createHash } from "node:crypto";

type LessonSection = {
  id?: string;
  kind?: string;
  heading?: string;
  body?: string;
};

type LessonRow = {
  slug: string;
  title?: string;
  topic?: string;
  topicSlug?: string;
  bodySystem?: string;
  sections?: LessonSection[];
  preTest?: unknown[];
  postTest?: unknown[];
  studyTakeaways?: string[];
  studyCommonTraps?: string[];
  memoryAnchor?: string;
};

type CatalogShape = {
  pathways?: Record<string, LessonRow[] | { lessons?: LessonRow[] }>;
};

const RN_PATHWAYS = new Set(["ca-rn-nclex-rn", "us-rn-nclex-rn"]);
const RN_CATALOG_FILES = [
  "src/content/pathway-lessons/catalog.json",
  "src/content/pathway-lessons/rn-nclex-cardiovascular-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-neurological-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-hematology-oncology-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-gastrointestinal-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-integumentary-wound-care-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-infection-control-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-leadership-delegation-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-maternal-newborn-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-procedures-skills-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-nutrition-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-exam-strategy-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-respiratory-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-renal-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-endocrine-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-musculoskeletal-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-fluids-electrolytes-expansion-catalog.json",
  "src/content/pathway-lessons/rn-nclex-exam-notes-integration-catalog.json",
  "src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch3-catalog.json",
  "src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch4-catalog.json",
];

const REQUIRED_SECTION_CONCEPTS: Array<{ id: string; match: RegExp }> = [
  { id: "learning_objectives", match: /\b(objective|goal|learn|outcome)\b/i },
  { id: "core_concepts", match: /\b(core|concept|overview|pathophysiology|clinical meaning)\b/i },
  { id: "clinical_relevance", match: /\b(clinical|relevance|application|bedside|judgment)\b/i },
  { id: "assessment_findings", match: /\b(assessment|finding|sign|symptom|manifestation|cue)\b/i },
  { id: "nursing_interventions", match: /\b(intervention|priority|nursing|action|management)\b/i },
  { id: "safety_considerations", match: /\b(safety|risk|red flag|precaution|escalat)\b/i },
  { id: "prioritization_tips", match: /\b(priorit|abc|maslow|acute|unstable|delegat|scope)\b/i },
  { id: "nclex_pearls", match: /\b(nclex|exam|trap|pearl|high-yield|rationale)\b/i },
  { id: "key_takeaways", match: /\b(takeaway|summary|review|remember)\b/i },
];

const HIGH_RISK_PATTERNS: Array<{ id: string; reason: string; re: RegExp }> = [
  {
    id: "absolute_language",
    reason: "Uses absolute always/never wording that may need clinical qualification.",
    re: /\b(always|never|only|all patients|must not|must always)\b/i,
  },
  {
    id: "unsafe_delegation_signal",
    reason: "Mentions delegation/UAP/LPN/RPN; verify RN scope and stable-vs-unstable logic.",
    re: /\b(delegate|delegation|uap|unlicensed|lpn|rpn|scope of practice)\b/i,
  },
  {
    id: "high_alert_medication_signal",
    reason: "Mentions high-alert medication concepts; verify monitoring and safety language.",
    re: /\b(heparin|insulin|warfarin|opioid|morphine|potassium|vasopressor|inotrope|magnesium sulfate|digoxin|lithium)\b/i,
  },
  {
    id: "black_box_or_contraindication_signal",
    reason: "Medication safety language present; verify contraindications and warnings.",
    re: /\b(black box|boxed warning|contraindicat|teratogenic|pregnancy|renal failure|hepatic failure)\b/i,
  },
  {
    id: "numeric_range_signal",
    reason: "Contains numeric clinical range/threshold; verify units and current standard.",
    re: /\b\d+(\.\d+)?\s?(mmHg|mEq\/L|mg\/dL|mmol\/L|bpm|%|mcg|mg|units|L\/min)\b/i,
  },
];

function plain(text: string): string {
  return text
    // Avoid treating clinical comparisons like "K+ < 3.5 mEq/L" as HTML.
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text: string): string[] {
  return plain(text).split(/\s+/).filter(Boolean);
}

function fingerprint(text: string): string {
  const normalized = plain(text).toLowerCase().replace(/[^a-z0-9 ]+/g, " ");
  return createHash("sha1").update(normalized).digest("hex").slice(0, 12);
}

function shingles(text: string, size = 8): Set<string> {
  const w = words(text.toLowerCase()).map((x) => x.replace(/[^a-z0-9]/g, "")).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i <= w.length - size; i += 1) out.add(w.slice(i, i + size).join(" "));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function readRnRows(): Array<{ file: string; pathwayId: string; lesson: LessonRow }> {
  const rows: Array<{ file: string; pathwayId: string; lesson: LessonRow }> = [];
  for (const file of RN_CATALOG_FILES) {
    const json = JSON.parse(readFileSync(join(process.cwd(), file), "utf8")) as CatalogShape;
    for (const [pathwayId, bucket] of Object.entries(json.pathways ?? {})) {
      if (!RN_PATHWAYS.has(pathwayId)) continue;
      const lessons = Array.isArray(bucket) ? bucket : bucket.lessons ?? [];
      for (const lesson of lessons) rows.push({ file, pathwayId, lesson });
    }
  }
  return rows;
}

function conceptCoverage(lesson: LessonRow): string[] {
  const haystack = [
    lesson.title,
    lesson.topic,
    ...(lesson.sections ?? []).flatMap((s) => [s.kind, s.heading, s.body]),
    ...(lesson.studyTakeaways ?? []),
    ...(lesson.studyCommonTraps ?? []),
    lesson.memoryAnchor,
  ]
    .filter(Boolean)
    .join("\n");
  return REQUIRED_SECTION_CONCEPTS.filter((c) => !c.match.test(haystack)).map((c) => c.id);
}

function main(): void {
  const rows = readRnRows();
  const bySlug = new Map<string, Array<{ file: string; pathwayId: string; lesson: LessonRow }>>();
  const byFingerprint = new Map<string, Array<{ file: string; pathwayId: string; slug: string; section: string }>>();
  const lessonTextsByBucket = new Map<
    string,
    Array<{ file: string; pathwayId: string; slug: string; title: string; text: string; shingles: Set<string> }>
  >();
  const findings: Array<Record<string, unknown>> = [];

  for (const row of rows) {
    const slugRows = bySlug.get(row.lesson.slug) ?? [];
    slugRows.push(row);
    bySlug.set(row.lesson.slug, slugRows);

    const sections = row.lesson.sections ?? [];
    const bodyText = sections.map((s) => `${s.heading ?? ""}\n${s.body ?? ""}`).join("\n\n");
    const wordCount = words(bodyText).length;
    const missingConcepts = conceptCoverage(row.lesson);
    const thinSections = sections
      .map((s) => ({
        id: s.id ?? "",
        kind: s.kind ?? "",
        heading: s.heading ?? "",
        words: words(s.body ?? "").length,
      }))
      .filter((s) => s.words > 0 && s.words < 45);
    const emptySections = sections.filter((s) => !plain(s.body ?? "")).map((s) => s.id ?? s.heading ?? s.kind ?? "unknown");

    if (wordCount < 800 || sections.length < 8 || missingConcepts.length || thinSections.length || emptySections.length) {
      findings.push({
        severity: wordCount < 500 || missingConcepts.length >= 4 ? "high" : "medium",
        type: "structure_depth",
        file: row.file,
        pathwayId: row.pathwayId,
        slug: row.lesson.slug,
        title: row.lesson.title ?? row.lesson.slug,
        wordCount,
        sectionCount: sections.length,
        missingConcepts,
        thinSections: thinSections.slice(0, 8),
        emptySections,
      });
    }

    for (const section of sections) {
      const body = section.body ?? "";
      const sectionWords = words(body).length;
      if (sectionWords >= 40) {
        const fp = fingerprint(body);
        const fpRows = byFingerprint.get(fp) ?? [];
        fpRows.push({
          file: row.file,
          pathwayId: row.pathwayId,
          slug: row.lesson.slug,
          section: section.id ?? section.heading ?? section.kind ?? "unknown",
        });
        byFingerprint.set(fp, fpRows);
      }
      for (const pattern of HIGH_RISK_PATTERNS) {
        if (pattern.re.test(body)) {
          findings.push({
            severity: "review",
            type: "clinical_sme_review_signal",
            signal: pattern.id,
            reason: pattern.reason,
            file: row.file,
            pathwayId: row.pathwayId,
            slug: row.lesson.slug,
            title: row.lesson.title ?? row.lesson.slug,
            section: section.id ?? section.heading ?? section.kind ?? "unknown",
          });
        }
      }
    }

    if (wordCount >= 120) {
      const bucketKey = `${row.pathwayId}:${row.lesson.topicSlug ?? row.lesson.bodySystem ?? "uncategorized"}`;
      const bucket = lessonTextsByBucket.get(bucketKey) ?? [];
      // CA/US mirror rows and expansion files can repeat the same slug by design. For near-duplicate
      // lesson-sprawl detection we only need one row per pathway + topic + slug.
      if (!bucket.some((item) => item.slug === row.lesson.slug)) {
        bucket.push({
          file: row.file,
          pathwayId: row.pathwayId,
          slug: row.lesson.slug,
          title: row.lesson.title ?? row.lesson.slug,
          text: bodyText,
          shingles: shingles(bodyText),
        });
      }
      lessonTextsByBucket.set(bucketKey, bucket);
    }
  }

  const duplicateSlugGroupsAll = [...bySlug.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([slug, items]) => ({
      slug,
      count: items.length,
      locations: items.map((x) => ({ file: x.file, pathwayId: x.pathwayId, title: x.lesson.title ?? x.lesson.slug })),
    }));
  const expectedMirrorDuplicateSlugs = duplicateSlugGroupsAll.filter((group) => {
    const pathways = new Set(group.locations.map((x) => x.pathwayId));
    const fileBases = new Set(group.locations.map((x) => x.file.replace(/^.*\//, "")));
    return pathways.size === RN_PATHWAYS.size && fileBases.size <= group.locations.length;
  });
  const duplicateSlugs = duplicateSlugGroupsAll.filter((group) => {
    const pathwaySlugPairs = new Set(group.locations.map((x) => `${x.pathwayId}:${group.slug}`));
    // If a slug appears once per RN pathway as a CA/US mirror, keep it out of actionable duplicate counts.
    return pathwaySlugPairs.size !== group.locations.length || group.locations.length > RN_PATHWAYS.size;
  });

  const exactDuplicateSections = [...byFingerprint.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([hash, items]) => ({ hash, count: items.length, locations: items }))
    .filter((row) => {
      const uniqueSlugs = new Set(row.locations.map((x) => x.slug));
      if (uniqueSlugs.size === 1) return false; // expected CA/US mirror content for same slug.
      const uniqueLessonKeys = new Set(row.locations.map((x) => `${x.pathwayId}:${x.slug}`));
      return uniqueLessonKeys.size > 1;
    });

  const nearDuplicateLessons: Array<Record<string, unknown>> = [];
  for (const [, lessonTexts] of lessonTextsByBucket) {
    for (let i = 0; i < lessonTexts.length; i += 1) {
      for (let j = i + 1; j < lessonTexts.length; j += 1) {
        const a = lessonTexts[i];
        const b = lessonTexts[j];
        const score = jaccard(a.shingles, b.shingles);
        if (score >= 0.82) {
          nearDuplicateLessons.push({
            score: Number(score.toFixed(3)),
            a: { file: a.file, pathwayId: a.pathwayId, slug: a.slug, title: a.title },
            b: { file: b.file, pathwayId: b.pathwayId, slug: b.slug, title: b.title },
          });
        }
      }
    }
  }

  nearDuplicateLessons.sort((a, b) => Number(b.score) - Number(a.score));
  nearDuplicateLessons.splice(250);

  const report = {
    generatedAt: new Date().toISOString(),
    scope: "RN-only bundled pathway lesson catalogs",
    standardsAnchor: {
      nclexRnTestPlan: "2026 NCLEX-RN Test Plan, NCSBN",
      clinicalJudgmentModel: ["recognize cues", "analyze cues", "prioritize hypotheses", "generate solutions", "take action", "evaluate outcomes"],
      prioritizationFrameworks: ["ABCs", "Maslow", "safety/risk reduction", "acute vs chronic", "stable vs unstable", "RN/LPN/UAP delegation scope"],
    },
    sourceFiles: RN_CATALOG_FILES.map((file) => basename(file)),
    pathwayIds: [...RN_PATHWAYS],
    totalRowsAudited: rows.length,
    uniqueSlugsAudited: new Set(rows.map((r) => r.lesson.slug)).size,
    duplicateSlugs,
    expectedMirrorDuplicateSlugs,
    exactDuplicateSections,
    nearDuplicateLessons,
    findings,
    summary: {
      duplicateSlugGroups: duplicateSlugs.length,
      expectedMirrorDuplicateSlugGroups: expectedMirrorDuplicateSlugs.length,
      exactDuplicateSectionGroups: exactDuplicateSections.length,
      nearDuplicateLessonPairs: nearDuplicateLessons.length,
      structureDepthFindings: findings.filter((f) => f.type === "structure_depth").length,
      clinicalReviewSignals: findings.filter((f) => f.type === "clinical_sme_review_signal").length,
      highPriorityStructureFindings: findings.filter((f) => f.severity === "high").length,
    },
  };

  mkdirSync(join(process.cwd(), "reports"), { recursive: true });
  const outPath = join(process.cwd(), "reports/rn-lesson-quality-audit.json");
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const mdPath = join(process.cwd(), "reports/rn-lesson-quality-audit.md");
  const topStructure = findings
    .filter((f) => f.type === "structure_depth")
    .slice(0, 25)
    .map(
      (f) =>
        `| ${String(f.pathwayId)} | ${String(f.slug)} | ${String(f.wordCount)} | ${(f.missingConcepts as string[]).join(", ") || "none"} |`,
    )
    .join("\n");
  const topDuplicates = nearDuplicateLessons
    .slice(0, 25)
    .map((f) => {
      const a = f.a as { pathwayId: string; slug: string };
      const b = f.b as { slug: string };
      return `| ${String(f.score)} | ${a.pathwayId} | ${a.slug} | ${b.slug} |`;
    })
    .join("\n");
  writeFileSync(
    mdPath,
    `# RN Lesson Quality Audit\n\n` +
      `Generated: ${report.generatedAt}\n\n` +
      `Scope: RN-only bundled pathway lesson catalogs. Expected Canada/U.S. mirror rows are separated from actionable duplicate groups so route/progress slugs are preserved.\n\n` +
      `## Summary\n\n` +
      `| Metric | Count |\n| --- | ---: |\n` +
      `| Total rows audited | ${report.totalRowsAudited} |\n` +
      `| Unique slugs audited | ${report.uniqueSlugsAudited} |\n` +
      `| Expected CA/US mirror duplicate slug groups | ${report.summary.expectedMirrorDuplicateSlugGroups} |\n` +
      `| Actionable duplicate slug groups | ${report.summary.duplicateSlugGroups} |\n` +
      `| Exact duplicate section groups | ${report.summary.exactDuplicateSectionGroups} |\n` +
      `| Near-duplicate lesson pairs queued | ${report.summary.nearDuplicateLessonPairs} |\n` +
      `| Structure/depth findings | ${report.summary.structureDepthFindings} |\n` +
      `| High-priority structure findings | ${report.summary.highPriorityStructureFindings} |\n` +
      `| Clinical SME review signals | ${report.summary.clinicalReviewSignals} |\n\n` +
      `## Standards Anchor\n\n` +
      `- 2026 NCLEX-RN Test Plan (NCSBN).\n` +
      `- Clinical judgment sequence: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes.\n` +
      `- Prioritization checks: ABCs, Maslow, safety/risk reduction, acute vs chronic, stable vs unstable, RN/LPN/UAP delegation scope.\n\n` +
      `## Top Structure/Depth Findings\n\n` +
      `| Pathway | Slug | Words | Missing concepts |\n| --- | --- | ---: | --- |\n${topStructure || "| none | none | 0 | none |"}\n\n` +
      `## Top Near-Duplicate Lesson Pairs\n\n` +
      `| Similarity | Pathway | Lesson A | Lesson B |\n| ---: | --- | --- | --- |\n${topDuplicates || "| 0 | none | none | none |"}\n\n` +
      `## Notes\n\n` +
      `- This audit does not rewrite clinical facts automatically. High-risk medication ranges, delegation language, and absolute wording are queued for SME review instead of being guessed.\n` +
      "- Full raw findings are in `reports/rn-lesson-quality-audit.json`.\n",
    "utf8",
  );
  console.info(`[rn-lesson-quality-audit] wrote ${outPath}`);
  console.info(`[rn-lesson-quality-audit] wrote ${mdPath}`);
  console.info(JSON.stringify(report.summary, null, 2));
}

main();
