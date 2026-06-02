import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  scoreRationaleQuality,
  type RationaleQualityGate,
  type RationaleQualityResult,
  type RationaleRepetitionFinding,
} from "../src/lib/questions/rationale-quality-score";

type RationaleRecord = {
  id: string;
  file: string;
  line: number;
  pool: string;
  field: string;
  text: string;
  score: RationaleQualityResult;
};

type PoolSummary = {
  pool: string;
  count: number;
  averageScore: number;
  gates: Record<RationaleQualityGate, number>;
  lowest: RationaleRecord[];
  highest: RationaleRecord[];
};

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "docs/content-quality");
const SOURCE_GLOBS = [
  "src/content/questions",
  "src/content/transfusion-safety-questions.json",
  "src/lib/ecg-module",
  "src/lib/labs",
  "src/lib/clinical-skills",
  "src/lib/pharmacology",
  "src/lib/practice-tests",
  "src/components/exam",
  "src/components/student",
];

const STRING_FIELD_PATTERN =
  /(?<field>rationale|correct|wrongAnswers|clinicalPearl|examStrategy|examTip|teachingPoint|teaching|advancedNursingReasoning|escalationLogic|safetyPrinciple|prioritization|prioritizationLogic|safetyThinking|ngnReasoning|priority|safety|trap|scenario|stem)\s*:\s*(?<quote>`|'|")(?<text>[\s\S]*?)(?<!\\)\k<quote>/g;

const RATIONALE_ANCHOR_FIELDS = new Set([
  "rationale",
  "teachingPoint",
  "teaching",
  "advancedNursingReasoning",
  "escalationLogic",
  "safetyPrinciple",
  "prioritization",
  "prioritizationLogic",
  "safetyThinking",
  "ngnReasoning",
]);

function rgFiles(paths: string[]): string[] {
  const existing = paths.filter((target) => {
    try {
      readFileSync(path.join(ROOT, target));
      return true;
    } catch {
      try {
        execFileSync("test", ["-d", path.join(ROOT, target)]);
        return true;
      } catch {
        return false;
      }
    }
  });
  if (existing.length === 0) return [];
  const output = execFileSync("rg", ["--files", ...existing], { cwd: ROOT, encoding: "utf8" });
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((file) => /\.(ts|tsx|json)$/.test(file));
}

function lineForIndex(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

function cleanCapturedText(text: string): string {
  return text
    .replace(/\$\{[^}]+\}/g, " ")
    .replace(/\\n/g, " ")
    .replace(/\\"/g, "\"")
    .replace(/\\'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function collectContextText(source: string, index: number): string {
  const window = source.slice(Math.max(0, index - 1400), Math.min(source.length, index + 2800));
  const parts: string[] = [];
  for (const match of window.matchAll(STRING_FIELD_PATTERN)) {
    const text = cleanCapturedText(match.groups?.text ?? "");
    if (text.split(/\s+/).filter(Boolean).length >= 4) parts.push(text);
  }
  return [...new Set(parts)].join(" ");
}

function inferPool(file: string, text: string): string {
  const combined = `${file} ${text}`.toLowerCase();
  if (/\b(np|cnple|fnp|pmhnp|agpcnp|whnp|pnp)\b/.test(combined)) return "NP";
  if (/\b(rpn|rex-pn|rex pn|pn|practical nursing|lpn|cpnre)\b/.test(combined)) return "RPN/PN";
  if (/\b(ecg|telemetry|rhythm|strip)\b/.test(combined)) return "ECG";
  if (/\b(lab|labs|abg|cbc|troponin|potassium|sodium|creatinine)\b/.test(combined)) return "Labs";
  if (/\b(skill|clinical-skills|wound|catheter|tracheostomy|assessment)\b/.test(combined)) return "Clinical Skills";
  if (/\b(pharm|medication|drug|dose|insulin|heparin|warfarin|antibiotic)\b/.test(combined)) return "Pharmacology";
  if (/\b(allied|respiratory therapy|paramedic|mlt|occupational therapy|physiotherapy|psw|pharmacy technician)\b/.test(combined)) {
    return "Allied";
  }
  if (/\b(nclex|rn|registered nurse)\b/.test(combined)) return "RN";
  return "Other";
}

function collectRecords(): RationaleRecord[] {
  const files = rgFiles(SOURCE_GLOBS);
  const records: RationaleRecord[] = [];

  for (const file of files) {
    const absolute = path.join(ROOT, file);
    const source = readFileSync(absolute, "utf8");
    for (const match of source.matchAll(STRING_FIELD_PATTERN)) {
      const text = cleanCapturedText(match.groups?.text ?? "");
      if (text.split(/\s+/).filter(Boolean).length < 5) continue;
      const field = match.groups?.field ?? "rationale";
      if (!RATIONALE_ANCHOR_FIELDS.has(field)) continue;
      const line = lineForIndex(source, match.index ?? 0);
      const contextText = collectContextText(source, match.index ?? 0);
      const pool = inferPool(file, text);
      const id = `${file}:${line}:${field}`;
      const score = scoreRationaleQuality({
        id,
        pathway: pool,
        rationale: contextText || text,
        clinicalPearl: field === "clinicalPearl" ? text : undefined,
        examStrategy: field === "examStrategy" || field === "examTip" ? text : undefined,
      });
      records.push({ id, file, line, pool, field, text, score });
    }
  }

  const duplicateCounts = new Map<string, number>();
  for (const record of records) {
    const key = normalizeForReport(record.text);
    duplicateCounts.set(key, (duplicateCounts.get(key) ?? 0) + 1);
  }

  return records.map((record) => {
    const repeatCount = duplicateCounts.get(normalizeForReport(record.text)) ?? 1;
    const rescored = scoreRationaleQuality({
      id: record.id,
      pathway: record.pool,
      rationale: collectContextText(readFileSync(path.join(ROOT, record.file), "utf8"), sourceIndexForLine(record.file, record.line)) || record.text,
      clinicalPearl: record.field === "clinicalPearl" ? record.text : undefined,
      examStrategy: record.field === "examStrategy" || record.field === "examTip" ? record.text : undefined,
      repeatCount,
    });
    return { ...record, score: rescored };
  });
}

function sourceIndexForLine(file: string, line: number): number {
  const source = readFileSync(path.join(ROOT, file), "utf8");
  if (line <= 1) return 0;
  let currentLine = 1;
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "\n") currentLine += 1;
    if (currentLine >= line) return index;
  }
  return source.length;
}

function normalizeForReport(text: string): string {
  return text.toLowerCase().replace(/["'“”‘’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function summarizePools(records: RationaleRecord[]): PoolSummary[] {
  const byPool = new Map<string, RationaleRecord[]>();
  for (const record of records) {
    const list = byPool.get(record.pool) ?? [];
    list.push(record);
    byPool.set(record.pool, list);
  }

  return [...byPool.entries()]
    .map(([pool, poolRecords]) => {
      const gates: Record<RationaleQualityGate, number> = {
        fail: 0,
        review: 0,
        publish_eligible: 0,
        flagship: 0,
      };
      for (const record of poolRecords) gates[record.score.gate] += 1;
      return {
        pool,
        count: poolRecords.length,
        averageScore: average(poolRecords.map((record) => record.score.score)),
        gates,
        lowest: [...poolRecords].sort((a, b) => a.score.score - b.score.score).slice(0, 8),
        highest: [...poolRecords].sort((a, b) => b.score.score - a.score.score).slice(0, 5),
      };
    })
    .sort((a, b) => a.averageScore - b.averageScore);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function gateLabel(gate: RationaleQualityGate): string {
  if (gate === "publish_eligible") return "Publish Eligible";
  return gate.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function table(rows: string[][]): string {
  if (rows.length === 0) return "";
  const [header, ...body] = rows;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function escapeCell(value: string | number): string {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function excerpt(text: string, max = 140): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 1)}...` : normalized;
}

function buildDashboard(records: RationaleRecord[], pools: PoolSummary[]): string {
  const total = records.length;
  const overallAverage = average(records.map((record) => record.score.score));
  const gates: Record<RationaleQualityGate, number> = {
    fail: 0,
    review: 0,
    publish_eligible: 0,
    flagship: 0,
  };
  for (const record of records) gates[record.score.gate] += 1;

  const poolRows = [
    ["Pool", "Items", "Average Score", "Fail", "Review", "Publish Eligible", "Flagship"],
    ...pools.map((pool) => [
      pool.pool,
      String(pool.count),
      String(pool.averageScore),
      String(pool.gates.fail),
      String(pool.gates.review),
      String(pool.gates.publish_eligible),
      String(pool.gates.flagship),
    ]),
  ];

  const backlog = records
    .filter((record) => record.score.gate === "fail" || record.score.gate === "review")
    .sort((a, b) => a.score.score - b.score.score)
    .slice(0, 50);

  const backlogRows = [
    ["Score", "Gate", "Pool", "Field", "Source", "Top Recommendation"],
    ...backlog.map((record) => [
      String(record.score.score),
      gateLabel(record.score.gate),
      record.pool,
      record.field,
      `${record.file}:${record.line}`,
      record.score.recommendations[0] ?? "Rewrite for clinical judgment depth.",
    ]),
  ];

  const highestRows = [
    ["Pool", "Average Score", "Representative Source"],
    ...[...pools]
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 8)
      .map((pool) => [
        pool.pool,
        String(pool.averageScore),
        pool.highest[0] ? `${pool.highest[0].file}:${pool.highest[0].line}` : "n/a",
      ]),
  ];

  const lowestRows = [
    ["Pool", "Average Score", "Lowest Source"],
    ...pools.slice(0, 8).map((pool) => [
      pool.pool,
      String(pool.averageScore),
      pool.lowest[0] ? `${pool.lowest[0].file}:${pool.lowest[0].line}` : "n/a",
    ]),
  ];

  return `# Rationale Quality Dashboard

Generated: ${new Date().toISOString()}

This dashboard is a static source audit of rationale-like fields found in NurseNest content and learning modules. It uses the V2 rationale scoring engine as a governance signal; it does not replace clinical review.

## Executive Summary

- Items scored: ${total}
- Average score: ${overallAverage}
- Fail (<70): ${gates.fail}
- Review (70-84): ${gates.review}
- Publish eligible (85-94): ${gates.publish_eligible}
- Flagship (95+): ${gates.flagship}

## Pathway And Module Summary

${table(poolRows)}

## Lowest-Quality Pools

${table(lowestRows)}

## Highest-Quality Pools

${table(highestRows)}

## Rewrite Backlog

${table(backlogRows.map((row) => row.map(escapeCell)))}

## Publish Gate Policy

| Score | Gate | Action |
| --- | --- | --- |
| <70 | Fail | Do not publish. Rewrite required. |
| 70-84 | Review | Human review and enrichment required. |
| 85-94 | Publish Eligible | Can publish after clinical review. |
| 95+ | Flagship | Premium exemplar. |
`;
}

function buildRepetitionAudit(records: RationaleRecord[]): string {
  const patternCounts = new Map<string, { count: number; severity: string; message: string }>();
  const flagged: Array<RationaleRecord & { finding: RationaleRepetitionFinding }> = [];

  for (const record of records) {
    for (const finding of record.score.repetitionFindings) {
      const existing = patternCounts.get(finding.patternId);
      patternCounts.set(finding.patternId, {
        count: (existing?.count ?? 0) + 1,
        severity: finding.severity,
        message: finding.message,
      });
      flagged.push({ ...record, finding });
    }
  }

  const phraseCounts = new Map<string, number>();
  for (const record of records) {
    const normalized = normalizeForReport(record.text);
    if (normalized.split(/\s+/).length < 8) continue;
    phraseCounts.set(normalized, (phraseCounts.get(normalized) ?? 0) + 1);
  }

  const repeatedPhrases = [...phraseCounts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const patternRows = [
    ["Pattern", "Count", "Severity", "Meaning"],
    ...[...patternCounts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([pattern, value]) => [pattern, String(value.count), value.severity, value.message]),
  ];

  const repeatedRows = [
    ["Occurrences", "Repeated Text"],
    ...repeatedPhrases.map(([phrase, count]) => [String(count), excerpt(phrase, 180)]),
  ];

  const flaggedRows = [
    ["Pattern", "Severity", "Pool", "Score", "Source", "Excerpt"],
    ...flagged.slice(0, 80).map((record) => [
      record.finding.patternId,
      record.finding.severity,
      record.pool,
      String(record.score.score),
      `${record.file}:${record.line}`,
      record.finding.excerpt ?? excerpt(record.text, 100),
    ]),
  ];

  return `# Rationale Repetition Audit

Generated: ${new Date().toISOString()}

This audit detects rationale language that can make NurseNest content feel templated instead of authored by an experienced clinician educator.

## Pattern Summary

${table(patternRows.map((row) => row.map(escapeCell)))}

## Reused Text Blocks

${repeatedPhrases.length > 0 ? table(repeatedRows.map((row) => row.map(escapeCell))) : "No exact repeated rationale blocks were detected in this static scan."}

## Flagged Records

${flagged.length > 0 ? table(flaggedRows.map((row) => row.map(escapeCell))) : "No specified repetition patterns were detected."}

## Required Remediation

- Replace circular statements such as "is correct because" with cue-specific clinical reasoning.
- Replace "option X is incorrect because" templates with a specific explanation of the distractor trap.
- Rewrite repeated phrases so each rationale reflects its own patient cue, pathway, and safety implication.
- Prioritize records that are both repeated and below the 85 publish-eligible gate.
`;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const records = collectRecords();
const pools = summarizePools(records);

writeFileSync(path.join(OUTPUT_DIR, "rationale-quality-dashboard.md"), buildDashboard(records, pools));
writeFileSync(path.join(OUTPUT_DIR, "rationale-repetition-audit.md"), buildRepetitionAudit(records));

console.log(`Scored ${records.length} rationale-like records.`);
console.log(`Wrote ${path.relative(ROOT, path.join(OUTPUT_DIR, "rationale-quality-dashboard.md"))}`);
console.log(`Wrote ${path.relative(ROOT, path.join(OUTPUT_DIR, "rationale-repetition-audit.md"))}`);
