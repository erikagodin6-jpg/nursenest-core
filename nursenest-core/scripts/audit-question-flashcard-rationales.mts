#!/usr/bin/env tsx
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import {
  collectGenericContentPatternIds,
  normalizeContentForDuplicateDetection,
  scoreQuestionContentQuality,
  type ContentQualityScore,
} from "../src/lib/questions/content-quality-score";

type AuditRecord = {
  id: string;
  file: string;
  line: number;
  field: string;
  questionType: string;
  pathway: string;
  tier: string;
  text: string;
  genericPatterns: string[];
  repeatCount: number;
  score: ContentQualityScore;
};

const ROOT = process.cwd();
const DEFAULT_SCAN_ROOTS = [
  "src/content/questions",
  "src/content/flashcards",
  "src/content/cases",
  "src/components/exam",
  "src/components/flashcards",
  "src/components/student",
  "src/components/study",
  "src/lib/ecg-module",
  "src/lib/flashcards",
  "src/lib/questions",
  "src/lib/pre-nursing",
  "scripts/bowtie-starter-batch-data.ts",
  "scripts/maternal-newborn-expansion-defs-b.mjs",
  "prisma/seed.ts",
];

const FIELD_PATTERN =
  /\b(rationale(?:Correct|Incorrect)?|clinicalPearl|clinical_pearl|examTip|exam_strategy|memoryHook|memory_hook|hint|hints|explanation|siConv|situationIdentification|clinicalOverview|nursingVerification)\b\s*:\s*(?:`([\s\S]*?)`|"([^"\n]*(?:\\.[^"\n]*)*)"|'([^'\n]*(?:\\.[^'\n]*)*)')/g;

function listFiles(scanRoots: string[]): string[] {
  const args = ["--files", ...scanRoots];
  try {
    return execFileSync("rg", args, { cwd: ROOT, encoding: "utf8" })
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((file) => /\.(ts|tsx|json|md|mts)$/.test(file))
      .filter((file) => !/\.(test|spec)\.(ts|tsx|mts)$/.test(file))
      .filter((file) => !file.includes("/__tests__/"));
  } catch {
    return [];
  }
}

function lineNumberForIndex(source: string, index: number): number {
  return source.slice(0, index).split(/\r?\n/).length;
}

function windowBefore(source: string, index: number, chars = 2200): string {
  return source.slice(Math.max(0, index - chars), index);
}

function findNearbyValue(window: string, key: string): string {
  const patterns = [
    new RegExp(`\\b${key}\\b\\s*:\\s*["'\`]([^"'\`\\n]{1,180})["'\`]`, "g"),
    new RegExp(`\\b${key}\\b\\s*=\\s*["'\`]([^"'\`\\n]{1,180})["'\`]`, "g"),
  ];
  for (const pattern of patterns) {
    const matches = [...window.matchAll(pattern)];
    const last = matches.at(-1)?.[1]?.trim();
    if (last) return last;
  }
  return "";
}

function inferId(file: string, source: string, index: number, fallback: number): string {
  const before = windowBefore(source, index);
  const nearbyId = findNearbyValue(before, "id");
  const nearbySlug = findNearbyValue(before, "slug");
  const usableId = nearbyId && !/^[A-H]$/.test(nearbyId) ? nearbyId : "";
  return (
    usableId ||
    findNearbyValue(before, "slug") ||
    nearbySlug ||
    `${file.replace(/[^a-zA-Z0-9]+/g, "-")}-${fallback}`
  );
}

function inferQuestionType(source: string, index: number): string {
  const before = windowBefore(source, index);
  return (
    findNearbyValue(before, "questionType") ||
    findNearbyValue(before, "question_type") ||
    findNearbyValue(before, "itemKind") ||
    findNearbyValue(before, "type") ||
    "unknown"
  );
}

function inferPathway(file: string, source: string, index: number): string {
  const before = windowBefore(source, index);
  const fromField =
    findNearbyValue(before, "pathway") ||
    findNearbyValue(before, "pathwayId") ||
    findNearbyValue(before, "exam") ||
    findNearbyValue(before, "examKey");
  if (fromField) return fromField;
  const lower = file.toLowerCase();
  if (lower.includes("cnple")) return "CNPLE";
  if (lower.includes("rex") || lower.includes("rpn") || lower.includes("pn")) return "RPN/PN";
  if (lower.includes("nclex")) return "NCLEX-RN";
  if (lower.includes("allied") || lower.includes("rt")) return "Allied";
  if (lower.includes("pre-nursing")) return "Pre-Nursing";
  if (lower.includes("ecg")) return "ECG";
  return "unknown";
}

function inferTier(file: string, source: string, index: number): string {
  const before = windowBefore(source, index);
  const fromField = findNearbyValue(before, "tier") || findNearbyValue(before, "profession");
  if (fromField) return fromField;
  const lower = `${file} ${inferPathway(file, source, index)}`.toLowerCase();
  if (lower.includes("np") || lower.includes("cnple")) return "NP";
  if (lower.includes("rpn") || lower.includes("pn") || lower.includes("rex")) return "RPN/PN";
  if (lower.includes("allied") || lower.includes("rt")) return "Allied";
  if (lower.includes("newgrad") || lower.includes("new-grad")) return "New Grad";
  if (lower.includes("pre-nursing")) return "Pre-Nursing";
  if (lower.includes("rn") || lower.includes("nclex")) return "RN";
  return "unknown";
}

function inferStem(source: string, index: number): string {
  const before = windowBefore(source, index);
  return findNearbyValue(before, "stem") || findNearbyValue(before, "questionStem") || findNearbyValue(before, "question");
}

function templateExpressionLabel(expression: string): string {
  const compact = expression.replace(/\s+/g, " ").trim();
  if (/condition/i.test(compact)) return "scenario-specific condition";
  if (/concerningCue|cue/i.test(compact)) return "scenario-specific cue";
  if (/expectedFinding|baseline/i.test(compact)) return "expected baseline finding";
  if (/priorityAction|action|intervention/i.test(compact)) return "scenario-specific intervention";
  if (/monitor/i.test(compact)) return "scenario-specific monitoring";
  if (/correct/i.test(compact)) return "correct answer";
  if (/option|choice/i.test(compact)) return "answer option";
  return "item-specific detail";
}

function cleanLiteral(raw: string): string {
  return raw
    .replace(/\\n/g, " ")
    .replace(/\$\{([^}]+)\}/g, (_match, expression: string) => templateExpressionLabel(expression))
    .replace(/\s+/g, " ")
    .trim();
}

function severityFor(record: AuditRecord): string {
  if (record.genericPatterns.length > 0 || record.score.status === "low_quality") return "CRITICAL";
  if (record.repeatCount > 1 || record.score.status === "needs_review") return "HIGH";
  return "LOW";
}

function markdownEscape(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function buildMarkdown(records: AuditRecord[]): string {
  const critical = records.filter((r) => severityFor(r) === "CRITICAL");
  const repeated = records.filter((r) => r.repeatCount > 1);
  const byPattern = new Map<string, number>();
  for (const record of records) {
    for (const pattern of record.genericPatterns) byPattern.set(pattern, (byPattern.get(pattern) ?? 0) + 1);
  }

  const rows = records
    .filter((r) => severityFor(r) !== "LOW")
    .sort((a, b) => {
      const sev = severityFor(a).localeCompare(severityFor(b));
      return sev || a.score.score - b.score.score || b.repeatCount - a.repeatCount;
    })
    .slice(0, 250);

  const lines = [
    "# Question Bank & Flashcard Rationale Quality Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Scope",
    "",
    "Static source-backed audit of question, flashcard, case, ECG, pre-nursing, learner rationale fallbacks, and seed content. Template literals are reported with item-specific placeholders so generated content can be reviewed without erasing scenario variables. Database-backed production rows should be audited with `npm run audit:exam-bank` and `npx tsx scripts/audit-flashcard-content-quality.ts` against the target database.",
    "",
    "## Summary",
    "",
    `- Rationale-like fields scanned: ${records.length}`,
    `- Critical records: ${critical.length}`,
    `- Reused rationale-like text records: ${repeated.length}`,
    `- Low quality: ${records.filter((r) => r.score.status === "low_quality").length}`,
    `- Needs review: ${records.filter((r) => r.score.status === "needs_review").length}`,
    `- High quality: ${records.filter((r) => r.score.status === "high_quality").length}`,
    "",
    "## Placeholder Pattern Counts",
    "",
    "| Pattern | Count |",
    "| --- | ---: |",
    ...[...byPattern.entries()].sort((a, b) => b[1] - a[1]).map(([pattern, count]) => `| ${pattern} | ${count} |`),
    "",
    "## Flagged Records",
    "",
    "| ID | Type | Pathway | Tier | File | Line | Field | Score | Repeat Count | Severity | Rationale / Text Preview |",
    "| --- | --- | --- | --- | --- | ---: | --- | ---: | ---: | --- | --- |",
    ...rows.map((r) =>
      `| ${markdownEscape(r.id)} | ${markdownEscape(r.questionType)} | ${markdownEscape(r.pathway)} | ${markdownEscape(r.tier)} | ${markdownEscape(r.file)} | ${r.line} | ${markdownEscape(r.field)} | ${r.score.score} | ${r.repeatCount} | ${severityFor(r)} | ${markdownEscape(r.text.slice(0, 220))} |`,
    ),
    "",
    "## Rewrite Standards",
    "",
    "- Correct-answer rationales must reference the exact cue in the stem and explain the mechanism or clinical judgment step.",
    "- Distractor rationales must explain why the option is tempting, why it is wrong, and what misconception it represents.",
    "- Clinical pearls must add educator insight, not restate the correct answer.",
    "- Exam tips must name the relevant exam or question type and the specific reasoning trap.",
    "- Memory hooks must be short, accurate, and memorable.",
    "- SI/CONV explanations must identify the situation cue, clinical overview, and nursing verification for the actual item.",
    "",
    "## Before / After Examples Applied",
    "",
    "| Surface | Before | After |",
    "| --- | --- | --- |",
    "| Practice/CAT distractor fallback | This choice may look plausible, but it is lower priority than the correct answer. | This choice may look plausible, but the stem does not provide the assessment finding, clinical threshold, or timing cue needed to support it over the correct answer. |",
    "| Flashcard memory hook fallback | Safety first, then reassess: protect the client before lower-priority care. | Cue, action, reassess: connect the stem finding to the next nursing step. |",
    "| Shared distractor generator | This option can seem reasonable, but it is lower priority than the correct answer. | This option can seem reasonable, but the stem supports the correct answer more directly and the distractor misses the client-specific risk pattern. |",
    "",
  ];

  return `${lines.join("\n")}\n`;
}

const scanRootsArg = process.argv.find((arg) => arg.startsWith("--roots="))?.slice("--roots=".length);
const scanRoots = scanRootsArg ? scanRootsArg.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_SCAN_ROOTS;
const files = listFiles(scanRoots);
const rawRecords: AuditRecord[] = [];

for (const file of files) {
  const abs = resolve(ROOT, file);
  const source = readFileSync(abs, "utf8");
  let match: RegExpExecArray | null;
  let ordinal = 0;
  FIELD_PATTERN.lastIndex = 0;
  while ((match = FIELD_PATTERN.exec(source))) {
    ordinal += 1;
    const field = match[1];
    const text = cleanLiteral(match[2] ?? match[3] ?? match[4] ?? "");
    if (text.length < 18) continue;
    const id = inferId(file, source, match.index, ordinal);
    rawRecords.push({
      id,
      file,
      line: lineNumberForIndex(source, match.index),
      field,
      questionType: inferQuestionType(source, match.index),
      pathway: inferPathway(file, source, match.index),
      tier: inferTier(file, source, match.index),
      text,
      genericPatterns: collectGenericContentPatternIds(text),
      repeatCount: 1,
      score: scoreQuestionContentQuality({
        id,
        itemType: inferQuestionType(source, match.index),
        pathway: inferPathway(file, source, match.index),
        tier: inferTier(file, source, match.index),
        stem: inferStem(source, match.index),
        rationale: field.toLowerCase().includes("rationale") || field.toLowerCase().includes("explanation") ? text : "",
        distractorRationales: field.toLowerCase().includes("incorrect") ? [text] : [],
        clinicalPearl: field.toLowerCase().includes("pearl") ? text : "",
        examTip: field.toLowerCase().includes("exam") ? text : "",
        memoryHook: field.toLowerCase().includes("memory") ? text : "",
        siConvExplanation: /siConv|situationIdentification|clinicalOverview|nursingVerification/i.test(field) ? text : "",
      }),
    });
  }
}

const duplicateCounts = new Map<string, number>();
for (const record of rawRecords) {
  const key = normalizeContentForDuplicateDetection(record.text);
  if (key.length < 80) continue;
  duplicateCounts.set(key, (duplicateCounts.get(key) ?? 0) + 1);
}

const records = rawRecords.map((record) => {
  const repeatCount = duplicateCounts.get(normalizeContentForDuplicateDetection(record.text)) ?? 1;
  const score = scoreQuestionContentQuality({
    id: record.id,
    itemType: record.questionType,
    pathway: record.pathway,
    tier: record.tier,
    stem: "",
    rationale: /rationale|explanation/i.test(record.field) ? record.text : "",
    distractorRationales: /incorrect/i.test(record.field) ? [record.text] : [],
    clinicalPearl: /pearl/i.test(record.field) ? record.text : "",
    examTip: /exam/i.test(record.field) ? record.text : "",
    memoryHook: /memory/i.test(record.field) ? record.text : "",
    siConvExplanation: /siConv|situationIdentification|clinicalOverview|nursingVerification/i.test(record.field) ? record.text : "",
    repeatCount,
  });
  return { ...record, repeatCount, score };
});

const reportPath = resolve(ROOT, "docs/question-flashcard-rationale-quality-audit.md");
const jsonPath = resolve(ROOT, "reports/content-quality/question-flashcard-rationale-audit.json");
mkdirSync(dirname(reportPath), { recursive: true });
mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(reportPath, buildMarkdown(records), "utf8");
writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      scanRoots,
      totalRecords: records.length,
      criticalRecords: records.filter((r) => severityFor(r) === "CRITICAL").length,
      repeatedRecords: records.filter((r) => r.repeatCount > 1).length,
      records,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`Scanned ${files.length} files and ${records.length} rationale-like fields.`);
console.log(`Markdown report: ${relative(ROOT, reportPath)}`);
console.log(`JSON report: ${relative(ROOT, jsonPath)}`);

if (process.argv.includes("--fail-on-critical") && records.some((r) => severityFor(r) === "CRITICAL")) {
  process.exit(1);
}
