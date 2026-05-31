import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  normalizeClinicalPearlForDuplicateDetection,
  scoreClinicalPearl,
  type ClinicalPearlGate,
  type ClinicalPearlScoreResult,
} from "../src/lib/questions/clinical-pearl-score";

type PearlRecord = {
  id: string;
  file: string;
  line: number;
  pathway: string;
  field: string;
  text: string;
  score: ClinicalPearlScoreResult;
  repeatCount: number;
};

type MissingPearlRecord = {
  file: string;
  line: number;
  pathway: string;
  context: string;
};

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "docs/content-quality");
const SCAN_ROOTS = [
  "src/content/questions",
  "src/content/flashcards",
  "src/content/cases",
  "src/lib/ecg-module",
  "src/lib/labs",
  "src/lib/clinical-skills",
  "src/lib/pharmacology",
  "src/lib/pre-nursing",
  "src/lib/admissions",
  "src/components/exam",
  "src/components/student",
  "src/components/study",
  "src/components/tools/calculators/nursing-care-plan-tool.tsx",
];

const REQUIRED_PATHWAYS = [
  "RN",
  "RPN/PN",
  "NP",
  "ECG",
  "Labs",
  "Clinical Skills",
  "Pharmacology",
  "Allied",
  "Admissions",
  "Pre-Nursing",
];

const PEARL_FIELD_PATTERN =
  /\b(?<field>clinicalPearl|clinicalPearls|clinical_pearl|clinical_pearls|pearl|pearls|teachingPoint|memoryHook)\b\s*:\s*(?<quote>`|'|")(?<text>[\s\S]*?)(?<!\\)\k<quote>/g;

const RATIONALE_FIELD_PATTERN = /\b(rationale|explanation|correct|wrongAnswers)\b\s*:/g;

function listFiles(): string[] {
  try {
    return execFileSync("rg", ["--files", ...SCAN_ROOTS], { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .map((file) => file.trim())
      .filter(Boolean)
      .filter((file) => /\.(ts|tsx|json|md|mts)$/.test(file))
      .filter((file) => !/\.(test|spec)\./.test(file));
  } catch {
    return [];
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\$\{[^}]+\}/g, "item-specific detail")
    .replace(/\\n/g, " ")
    .replace(/\\"/g, "\"")
    .replace(/\\'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function lineForIndex(source: string, index: number): number {
  return source.slice(0, index).split(/\r?\n/).length;
}

function nearbyWindow(source: string, index: number): string {
  return source.slice(Math.max(0, index - 1600), Math.min(source.length, index + 1200));
}

function findNearbyValue(window: string, key: string): string {
  const pattern = new RegExp(`\\b${key}\\b\\s*:\\s*["'\`]([^"'\`\\n]{1,180})["'\`]`, "g");
  const matches = [...window.matchAll(pattern)];
  return matches.at(-1)?.[1]?.trim() ?? "";
}

function inferPathway(file: string, text: string): string {
  const combined = `${file} ${text}`.toLowerCase();
  if (/\b(pre-nursing|prenursing)\b/.test(combined)) return "Pre-Nursing";
  if (/\b(admissions|teas|hesi|casper)\b/.test(combined)) return "Admissions";
  if (/\b(np|cnple|fnp|pmhnp|agpcnp|whnp|pnp)\b/.test(combined)) return "NP";
  if (/\b(rpn|rex-pn|rex pn|pn|practical nursing|lpn|cpnre)\b/.test(combined)) return "RPN/PN";
  if (/\b(ecg|telemetry|rhythm|strip)\b/.test(combined)) return "ECG";
  if (/\b(lab|labs|abg|cbc|troponin|potassium|sodium|creatinine|lactate)\b/.test(combined)) return "Labs";
  if (/\b(skill|clinical-skills|wound|catheter|tracheostomy|assessment)\b/.test(combined)) return "Clinical Skills";
  if (/\b(pharm|medication|drug|dose|insulin|heparin|warfarin|antibiotic)\b/.test(combined)) return "Pharmacology";
  if (/\b(allied|respiratory therapy|paramedic|mlt|occupational therapy|physiotherapy|psw|pharmacy technician)\b/.test(combined)) return "Allied";
  if (/\b(nclex|rn|registered nurse)\b/.test(combined)) return "RN";
  return "Other";
}

function collectPearls(): { pearls: PearlRecord[]; missing: MissingPearlRecord[] } {
  const pearls: PearlRecord[] = [];
  const missing: MissingPearlRecord[] = [];

  for (const file of listFiles()) {
    const source = readFileSync(path.join(ROOT, file), "utf8");
    const filePearlRanges: Array<{ start: number; end: number }> = [];

    for (const match of source.matchAll(PEARL_FIELD_PATTERN)) {
      const text = cleanText(match.groups?.text ?? "");
      if (text.split(/\s+/).filter(Boolean).length < 3) continue;
      const index = match.index ?? 0;
      filePearlRanges.push({ start: Math.max(0, index - 1000), end: Math.min(source.length, index + 1600) });
      const window = nearbyWindow(source, index);
      const line = lineForIndex(source, index);
      const pathway = inferPathway(file, `${window} ${text}`);
      const id = `${file}:${line}:${match.groups?.field ?? "clinicalPearl"}`;
      const score = scoreClinicalPearl({
        id,
        pearl: text,
        pathway,
        topic: findNearbyValue(window, "topic") || findNearbyValue(window, "domain") || findNearbyValue(window, "title"),
        stem: findNearbyValue(window, "stem") || findNearbyValue(window, "questionText") || findNearbyValue(window, "scenario"),
      });
      pearls.push({
        id,
        file,
        line,
        pathway,
        field: match.groups?.field ?? "clinicalPearl",
        text,
        score,
        repeatCount: 1,
      });
    }

    for (const match of source.matchAll(RATIONALE_FIELD_PATTERN)) {
      const index = match.index ?? 0;
      const hasNearbyPearl = filePearlRanges.some((range) => index >= range.start && index <= range.end);
      if (hasNearbyPearl) continue;
      const window = nearbyWindow(source, index);
      missing.push({
        file,
        line: lineForIndex(source, index),
        pathway: inferPathway(file, window),
        context: cleanText(findNearbyValue(window, "stem") || findNearbyValue(window, "questionText") || findNearbyValue(window, "topic") || window.slice(0, 160)),
      });
    }
  }

  const counts = new Map<string, number>();
  for (const pearl of pearls) {
    const key = normalizeClinicalPearlForDuplicateDetection(pearl.text);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return {
    pearls: pearls.map((pearl) => ({
      ...pearl,
      repeatCount: counts.get(normalizeClinicalPearlForDuplicateDetection(pearl.text)) ?? 1,
    })),
    missing,
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function table(rows: Array<Array<string | number>>): string {
  if (rows.length === 0) return "";
  const [header, ...body] = rows;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map(escapeCell).join(" | ")} |`),
  ].join("\n");
}

function escapeCell(value: string | number): string {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function excerpt(text: string, max = 150): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 1)}...` : normalized;
}

function summarizeByPathway(pearls: PearlRecord[]): Array<{ pathway: string; count: number; average: number; gates: Record<ClinicalPearlGate, number> }> {
  const groups = new Map<string, PearlRecord[]>();
  for (const pearl of pearls) groups.set(pearl.pathway, [...(groups.get(pearl.pathway) ?? []), pearl]);

  for (const pathway of REQUIRED_PATHWAYS) {
    if (!groups.has(pathway)) groups.set(pathway, []);
  }

  return [...groups.entries()]
    .map(([pathway, records]) => {
      const gates: Record<ClinicalPearlGate, number> = { fail: 0, review: 0, publish_eligible: 0, flagship: 0 };
      for (const record of records) gates[record.score.gate] += 1;
      return { pathway, count: records.length, average: average(records.map((record) => record.score.score)), gates };
    })
    .sort((a, b) => {
      const aRequired = REQUIRED_PATHWAYS.includes(a.pathway);
      const bRequired = REQUIRED_PATHWAYS.includes(b.pathway);
      if (aRequired && bRequired) return REQUIRED_PATHWAYS.indexOf(a.pathway) - REQUIRED_PATHWAYS.indexOf(b.pathway);
      if (aRequired) return -1;
      if (bRequired) return 1;
      return a.average - b.average;
    });
}

function buildAudit(pearls: PearlRecord[], missing: MissingPearlRecord[]): string {
  const summaries = summarizeByPathway(pearls);
  const failed = pearls.filter((pearl) => pearl.score.gate === "fail");
  const generic = pearls.filter((pearl) => pearl.score.failureReasons.some((reason) => /generic|restate|bedside|pattern/i.test(reason)));
  const gateCounts: Record<ClinicalPearlGate, number> = { fail: 0, review: 0, publish_eligible: 0, flagship: 0 };
  for (const pearl of pearls) gateCounts[pearl.score.gate] += 1;

  return `# Clinical Pearl Audit

Generated: ${new Date().toISOString()}

Static source-backed audit of NurseNest clinical pearl fields and rationale-like records missing nearby pearls. Scores are governance signals and do not replace clinical review.

## Summary

- Pearls scored: ${pearls.length}
- Average score: ${average(pearls.map((pearl) => pearl.score.score))}
- Target average: 4.5
- Fail (1-2): ${gateCounts.fail}
- Review (3): ${gateCounts.review}
- Publish eligible (4): ${gateCounts.publish_eligible}
- Flagship (5): ${gateCounts.flagship}
- Missing nearby pearl candidates: ${missing.length}
- Generic or weak pearl signals: ${generic.length}
- Pathways with no explicit scored pearls: ${summaries.filter((summary) => summary.count === 0).map((summary) => summary.pathway).join(", ") || "None"}

## Pathway Scores

${table([
  ["Pathway", "Pearls", "Average Score", "Fail", "Review", "Publish Eligible", "Flagship"],
  ...summaries.map((summary) => [
    summary.pathway,
    summary.count,
    summary.average,
    summary.gates.fail,
    summary.gates.review,
    summary.gates.publish_eligible,
    summary.gates.flagship,
  ]),
])}

## Failed Pearls

${table([
  ["Score", "Pathway", "Source", "Failure Reasons", "Current Pearl"],
  ...failed.slice(0, 80).map((pearl) => [
    pearl.score.score,
    pearl.pathway,
    `${pearl.file}:${pearl.line}`,
    pearl.score.failureReasons.join("; ") || "Below publish gate.",
    excerpt(pearl.text),
  ]),
])}

## Missing Pearls

${table([
  ["Pathway", "Source", "Nearby Context"],
  ...missing.slice(0, 100).map((record) => [record.pathway, `${record.file}:${record.line}`, excerpt(record.context)]),
])}

## Publish Gate

| Score | Gate | Action |
| ---: | --- | --- |
| 1-2 | Fail | Rewrite before publication. |
| 3 | Review | Human review and enrichment required. |
| 4 | Publish Eligible | May publish after clinical review. |
| 5 | Flagship | Exemplar-quality pearl. |
`;
}

function buildRewriteQueue(pearls: PearlRecord[]): string {
  const queue = pearls
    .filter((pearl) => pearl.score.gate === "fail" || pearl.score.gate === "review")
    .sort((a, b) => a.score.score - b.score.score || b.repeatCount - a.repeatCount)
    .slice(0, 150);

  return `# Clinical Pearl Rewrite Queue

Generated: ${new Date().toISOString()}

Each failed or review-level pearl needs a rewrite that improves pattern recognition, failure-to-rescue awareness, medication safety, escalation triggers, exam reasoning, or bedside wisdom.

${table([
  ["Current Score", "Target Score", "Pathway", "Source", "Failure Reason", "Current Pearl", "Improved Version"],
  ...queue.map((pearl) => [
    pearl.score.score,
    4,
    pearl.pathway,
    `${pearl.file}:${pearl.line}`,
    pearl.score.failureReasons[0] ?? "Below target quality.",
    excerpt(pearl.text, 120),
    pearl.score.improvedVersion,
  ]),
])}
`;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const { pearls, missing } = collectPearls();
writeFileSync(path.join(OUTPUT_DIR, "clinical-pearl-audit.md"), buildAudit(pearls, missing));
writeFileSync(path.join(OUTPUT_DIR, "clinical-pearl-rewrite-queue.md"), buildRewriteQueue(pearls));

console.log(`Scored ${pearls.length} clinical pearls.`);
console.log(`Found ${missing.length} rationale-like records missing nearby pearls.`);
console.log("Wrote docs/content-quality/clinical-pearl-audit.md");
console.log("Wrote docs/content-quality/clinical-pearl-rewrite-queue.md");
