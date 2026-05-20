#!/usr/bin/env node
/**
 * Foundational content plan generator.
 *
 * Reads the 90-topic blueprint, validates it, builds generation batches, and
 * emits three report artifacts:
 *
 *   data/reports/foundations/foundational-content-plan.json
 *   data/reports/foundations/foundational-content-plan.csv
 *   data/reports/foundations/foundational-content-plan.md
 *
 * Usage (from nursenest-core project root):
 *   node scripts/generate-foundational-content-plan.mjs
 *   node scripts/generate-foundational-content-plan.mjs --dry-run
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Constants (mirrors foundational-blueprint.ts — keep in sync)
// ---------------------------------------------------------------------------

const EXPECTED_TOTAL_TOPICS = 90;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LIGHT_LESSON_MIN = 2, LIGHT_LESSON_MAX = 3;
const LIGHT_QUESTION_MIN = 20, LIGHT_QUESTION_MAX = 25;
const HEAVY_LESSON_MIN = 4, HEAVY_LESSON_MAX = 5;
const HEAVY_QUESTION_MIN = 45, HEAVY_QUESTION_MAX = 60;

const EXPECTED_DOMAINS = {
  "Anatomy & Physiology": 21,
  "Medical Terminology": 5,
  "Dosage Math": 7,
  "Microbiology Basics": 5,
  "Chemistry Basics": 5,
  "Pharmacology Foundations": 7,
  "Basic Pathophysiology": 8,
  "Study Skills for Nursing School": 6,
  "Intro to Health Assessment": 8,
  "Infection Prevention": 6,
  Safety: 6,
  "Communication Basics": 6,
};

const DOMAIN_PRIORITY_ORDER = [
  "Medical Terminology",
  "Anatomy & Physiology",
  "Dosage Math",
  "Communication Basics",
  "Infection Prevention",
  "Safety",
  "Microbiology Basics",
  "Chemistry Basics",
  "Pharmacology Foundations",
  "Basic Pathophysiology",
  "Intro to Health Assessment",
  "Study Skills for Nursing School",
];

// ---------------------------------------------------------------------------
// Load blueprint
// ---------------------------------------------------------------------------

const blueprintPath = resolve(process.cwd(), "data/blueprints/foundations/foundational-topics-blueprint.json");
const blueprint = JSON.parse(readFileSync(blueprintPath, "utf8"));
const { topics } = blueprint;

// ---------------------------------------------------------------------------
// Validate
// ---------------------------------------------------------------------------

function validate(topics) {
  const errors = [];
  const warnings = [];

  if (topics.length !== EXPECTED_TOTAL_TOPICS) {
    errors.push(`Expected ${EXPECTED_TOTAL_TOPICS} topics, found ${topics.length}.`);
  }

  const slugsSeen = new Map();
  const invalidSlugs = [];
  for (const t of topics) {
    slugsSeen.set(t.topicSlug, (slugsSeen.get(t.topicSlug) ?? 0) + 1);
    if (!SLUG_PATTERN.test(t.topicSlug)) invalidSlugs.push(t.topicSlug);
  }
  const dupes = [...slugsSeen.entries()].filter(([, c]) => c > 1).map(([s]) => s);
  if (dupes.length) errors.push(`Duplicate slugs: ${dupes.join(", ")}`);
  if (invalidSlugs.length) errors.push(`Non-URL-safe slugs: ${invalidSlugs.join(", ")}`);

  const dc = {};
  for (const t of topics) dc[t.domain] = (dc[t.domain] ?? 0) + 1;
  for (const [domain, expected] of Object.entries(EXPECTED_DOMAINS)) {
    const actual = dc[domain] ?? 0;
    if (actual !== expected) errors.push(`Domain "${domain}": expected ${expected}, got ${actual}.`);
  }

  for (const t of topics) {
    if (t.contentWeight === "light") {
      if (t.targetLessonCountMin < LIGHT_LESSON_MIN || t.targetLessonCountMax > LIGHT_LESSON_MAX)
        errors.push(`Light topic "${t.topicSlug}" lesson range out of bounds.`);
      if (t.targetQuestionCountMin < LIGHT_QUESTION_MIN || t.targetQuestionCountMax > LIGHT_QUESTION_MAX)
        errors.push(`Light topic "${t.topicSlug}" question range out of bounds.`);
    } else if (t.contentWeight === "heavy") {
      if (t.targetLessonCountMin < HEAVY_LESSON_MIN || t.targetLessonCountMax > HEAVY_LESSON_MAX)
        errors.push(`Heavy topic "${t.topicSlug}" lesson range out of bounds.`);
      if (t.targetQuestionCountMin < HEAVY_QUESTION_MIN || t.targetQuestionCountMax > HEAVY_QUESTION_MAX)
        errors.push(`Heavy topic "${t.topicSlug}" question range out of bounds.`);
    } else {
      errors.push(`Topic "${t.topicSlug}" unknown contentWeight: "${t.contentWeight}".`);
    }
  }

  const allSlugs = new Set(topics.map((t) => t.topicSlug));
  for (const t of topics) {
    for (const s of [...t.prerequisiteTopicSlugs, ...t.downstreamTopicSlugs]) {
      if (!allSlugs.has(s)) warnings.push(`Topic "${t.topicSlug}" references unknown slug: "${s}"`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ---------------------------------------------------------------------------
// Batch builder
// ---------------------------------------------------------------------------

function buildBatches(topics) {
  const sorted = [...topics].sort((a, b) => {
    const di = DOMAIN_PRIORITY_ORDER.indexOf(a.domain) - DOMAIN_PRIORITY_ORDER.indexOf(b.domain);
    if (di !== 0) return di;
    return a.recommendedSequenceOrder - b.recommendedSequenceOrder;
  });

  const MAX_PER_BATCH = 6;
  const MAX_HEAVY_PER_BATCH = 2;
  const batches = [];
  let current = [];
  let currentHeavy = 0;
  let batchIndex = 1;

  function flush() {
    if (!current.length) return;
    const lessonMin = current.reduce((s, t) => s + t.targetLessonCountMin, 0);
    const lessonMax = current.reduce((s, t) => s + t.targetLessonCountMax, 0);
    const qMin = current.reduce((s, t) => s + t.targetQuestionCountMin, 0);
    const qMax = current.reduce((s, t) => s + t.targetQuestionCountMax, 0);
    batches.push({
      batchId: `foundations-batch-${String(batchIndex).padStart(2, "0")}`,
      includedTopicSlugs: current.map((t) => t.topicSlug),
      estimatedLessonCountMin: lessonMin,
      estimatedLessonCountMax: lessonMax,
      estimatedQuestionCountMin: qMin,
      estimatedQuestionCountMax: qMax,
      domainMix: [...new Set(current.map((t) => t.domain))],
      recommendedGenerationPriority: batchIndex,
    });
    batchIndex++;
    current = [];
    currentHeavy = 0;
  }

  for (const t of sorted) {
    const isHeavy = t.contentWeight === "heavy";
    if ((isHeavy && currentHeavy >= MAX_HEAVY_PER_BATCH) || current.length >= MAX_PER_BATCH) flush();
    current.push(t);
    if (isHeavy) currentHeavy++;
  }
  flush();
  return batches;
}

// ---------------------------------------------------------------------------
// Domain summaries
// ---------------------------------------------------------------------------

function buildDomainSummaries(topics) {
  const map = new Map();
  for (const t of topics) {
    if (!map.has(t.domain)) {
      map.set(t.domain, { domain: t.domain, topicCount: 0, heavyCount: 0, lightCount: 0,
        lessonRangeMin: 0, lessonRangeMax: 0, questionRangeMin: 0, questionRangeMax: 0 });
    }
    const s = map.get(t.domain);
    s.topicCount++;
    if (t.contentWeight === "heavy") s.heavyCount++; else s.lightCount++;
    s.lessonRangeMin += t.targetLessonCountMin;
    s.lessonRangeMax += t.targetLessonCountMax;
    s.questionRangeMin += t.targetQuestionCountMin;
    s.questionRangeMax += t.targetQuestionCountMax;
  }
  return DOMAIN_PRIORITY_ORDER.filter((d) => map.has(d)).map((d) => map.get(d));
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log("▶ Validating foundational blueprint...");
const { valid, errors, warnings } = validate(topics);

if (!valid) {
  console.error("✖ Validation FAILED:\n" + errors.map((e) => `  • ${e}`).join("\n"));
  process.exit(1);
}
if (warnings.length) {
  console.warn("⚠ Warnings:\n" + warnings.map((w) => `  • ${w}`).join("\n"));
}
console.log("✔ Blueprint valid — 90 topics, all constraints satisfied.");

const heavyTopics = topics.filter((t) => t.contentWeight === "heavy");
const lightTopics = topics.filter((t) => t.contentWeight === "light");
const domainSummaries = buildDomainSummaries(topics);
const batches = buildBatches(topics);

const totalLessonMin = topics.reduce((s, t) => s + t.targetLessonCountMin, 0);
const totalLessonMax = topics.reduce((s, t) => s + t.targetLessonCountMax, 0);
const totalQuestionMin = topics.reduce((s, t) => s + t.targetQuestionCountMin, 0);
const totalQuestionMax = topics.reduce((s, t) => s + t.targetQuestionCountMax, 0);

const generatedAt = new Date().toISOString();

// ---------------------------------------------------------------------------
// Build JSON artifact
// ---------------------------------------------------------------------------

const jsonPlan = {
  generatedAt,
  blueprintVersion: blueprint.version,
  summary: {
    totalDomains: Object.keys(EXPECTED_DOMAINS).length,
    totalTopics: topics.length,
    heavyTopics: heavyTopics.length,
    lightTopics: lightTopics.length,
    projectedLessonRange: { min: totalLessonMin, max: totalLessonMax },
    projectedQuestionRange: { min: totalQuestionMin, max: totalQuestionMax },
    totalBatches: batches.length,
    validationErrors: errors.length,
    validationWarnings: warnings.length,
  },
  domainSummaries,
  batches,
  allTopics: topics.map((t) => ({
    domain: t.domain,
    topicSlug: t.topicSlug,
    topicName: t.topicName,
    contentWeight: t.contentWeight,
    lessonRange: `${t.targetLessonCountMin}–${t.targetLessonCountMax}`,
    questionRange: `${t.targetQuestionCountMin}–${t.targetQuestionCountMax}`,
    sequenceOrder: t.recommendedSequenceOrder,
    status: t.status,
  })),
  validationResult: { valid, errors, warnings },
};

// ---------------------------------------------------------------------------
// Build CSV artifact
// ---------------------------------------------------------------------------

const CSV_HEADERS = [
  "domain",
  "topicSlug",
  "topicName",
  "contentWeight",
  "targetLessonCountMin",
  "targetLessonCountMax",
  "targetQuestionCountMin",
  "targetQuestionCountMax",
  "recommendedSequenceOrder",
  "status",
  "prerequisiteCount",
  "downstreamCount",
];

function csvEscape(val) {
  const s = String(val ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"` : s;
}

const csvRows = [
  CSV_HEADERS.join(","),
  ...topics.map((t) =>
    [
      t.domain,
      t.topicSlug,
      t.topicName,
      t.contentWeight,
      t.targetLessonCountMin,
      t.targetLessonCountMax,
      t.targetQuestionCountMin,
      t.targetQuestionCountMax,
      t.recommendedSequenceOrder,
      t.status,
      t.prerequisiteTopicSlugs.length,
      t.downstreamTopicSlugs.length,
    ]
      .map(csvEscape)
      .join(",")
  ),
];
const csvContent = csvRows.join("\n");

// ---------------------------------------------------------------------------
// Build Markdown report
// ---------------------------------------------------------------------------

function fmt(min, max) { return `${min}–${max}`; }

const domainTable = domainSummaries
  .map(
    (s) =>
      `| ${s.domain} | ${s.topicCount} | ${s.heavyCount} | ${s.lightCount} | ${fmt(s.lessonRangeMin, s.lessonRangeMax)} | ${fmt(s.questionRangeMin, s.questionRangeMax)} |`
  )
  .join("\n");

const batchTable = batches
  .map(
    (b) =>
      `| ${b.batchId} | ${b.recommendedGenerationPriority} | ${b.includedTopicSlugs.length} | ${fmt(b.estimatedLessonCountMin, b.estimatedLessonCountMax)} | ${fmt(b.estimatedQuestionCountMin, b.estimatedQuestionCountMax)} | ${b.domainMix.join(", ")} |`
  )
  .join("\n");

const validationSection =
  errors.length === 0
    ? "✅ **All validation checks passed.** No errors found.\n"
    : `❌ **Validation errors found:**\n${errors.map((e) => `- ${e}`).join("\n")}\n`;

const warnSection =
  warnings.length === 0
    ? ""
    : `\n### Warnings\n${warnings.map((w) => `- ${w}`).join("\n")}\n`;

const mdContent = `# NurseNest Foundational Content Plan

> Generated: ${generatedAt}  
> Blueprint version: ${blueprint.version}  
> Source: \`data/blueprints/foundations/foundational-topics-blueprint.json\`

---

## Summary

| Metric | Value |
|---|---|
| Total Domains | ${Object.keys(EXPECTED_DOMAINS).length} |
| Total Topics | ${topics.length} |
| Heavy Topics (4–5 lessons, 45–60 questions) | ${heavyTopics.length} |
| Light Topics (2–3 lessons, 20–25 questions) | ${lightTopics.length} |
| Projected Lesson Count | ${fmt(totalLessonMin, totalLessonMax)} |
| Projected Question Count | ${fmt(totalQuestionMin, totalQuestionMax)} |
| Generation Batches | ${batches.length} |

---

## Validation

${validationSection}${warnSection}

---

## Per-Domain Breakdown

| Domain | Topics | Heavy | Light | Lesson Range | Question Range |
|---|---|---|---|---|---|
${domainTable}

---

## Generation Batches

Batches are ordered by content-priority guidance:
1. Medical Terminology
2. Anatomy & Physiology
3. Dosage Math
4. Communication Basics
5. Infection Prevention
6. Safety
7. Microbiology Basics
8. Chemistry Basics
9. Pharmacology Foundations
10. Basic Pathophysiology
11. Intro to Health Assessment
12. Study Skills for Nursing School

Max **2 heavy topics** per batch. Max **6 topics** per batch.

| Batch ID | Priority | Topics | Lesson Range | Question Range | Domains |
|---|---|---|---|---|---|
${batchTable}

---

## All Topics

| Domain | Slug | Name | Weight | Lessons | Questions | Seq | Status |
|---|---|---|---|---|---|---|---|
${topics
  .map(
    (t) =>
      `| ${t.domain} | \`${t.topicSlug}\` | ${t.topicName} | ${t.contentWeight} | ${fmt(t.targetLessonCountMin, t.targetLessonCountMax)} | ${fmt(t.targetQuestionCountMin, t.targetQuestionCountMax)} | ${t.recommendedSequenceOrder} | ${t.status} |`
  )
  .join("\n")}

---

## Architecture Notes

- This blueprint is **separate** from NCLEX/REx/NP pathway lesson pipelines.
- Do not merge foundational content into exam pathway tables until explicitly planned.
- Architecture is compatible with later linking via \`topicSlug\` as a stable key.
- All topics currently have \`status: "planned"\`. Update to \`"in_progress"\` when generation begins.
- \`prerequisiteTopicSlugs\` and \`downstreamTopicSlugs\` define the learning graph for adaptive sequencing.
`;

// ---------------------------------------------------------------------------
// Write outputs
// ---------------------------------------------------------------------------

const outDir = resolve(process.cwd(), "data/reports/foundations");
mkdirSync(outDir, { recursive: true });

const jsonPath = resolve(outDir, "foundational-content-plan.json");
const csvPath = resolve(outDir, "foundational-content-plan.csv");
const mdPath = resolve(outDir, "foundational-content-plan.md");

if (DRY_RUN) {
  console.log("\n── DRY RUN — no files written ──");
  console.log(`  Would write: ${jsonPath}`);
  console.log(`  Would write: ${csvPath}`);
  console.log(`  Would write: ${mdPath}`);
} else {
  writeFileSync(jsonPath, JSON.stringify(jsonPlan, null, 2));
  writeFileSync(csvPath, csvContent);
  writeFileSync(mdPath, mdContent);
  console.log(`\n✔ Wrote: ${jsonPath}`);
  console.log(`✔ Wrote: ${csvPath}`);
  console.log(`✔ Wrote: ${mdPath}`);
}

console.log("\n── Plan Summary ──────────────────────────────────────");
console.log(`  Domains:          ${Object.keys(EXPECTED_DOMAINS).length}`);
console.log(`  Topics:           ${topics.length} (heavy: ${heavyTopics.length}, light: ${lightTopics.length})`);
console.log(`  Projected lessons: ${fmt(totalLessonMin, totalLessonMax)}`);
console.log(`  Projected Qs:      ${fmt(totalQuestionMin, totalQuestionMax)}`);
console.log(`  Batches:          ${batches.length}`);
console.log(`  Validation:       ${valid ? "✔ PASSED" : "✖ FAILED"}`);
if (warnings.length) console.log(`  Warnings:         ${warnings.length}`);
console.log("──────────────────────────────────────────────────────\n");
