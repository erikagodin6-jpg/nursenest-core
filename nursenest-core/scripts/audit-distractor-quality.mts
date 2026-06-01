import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  normalizeDistractorForDuplicateDetection,
  scoreDistractorQuality,
  type DistractorQualityResult,
} from "../src/lib/questions/distractor-quality-score";

type DistractorRecord = {
  id: string;
  file: string;
  line: number;
  pathway: string;
  questionId: string;
  optionId: string;
  stem: string;
  text: string;
  rationale: string;
  score: DistractorQualityResult;
  duplicateCount: number;
};

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "docs/content-quality");
const SCAN_ROOTS = [
  "src/content/questions",
  "src/content/cases",
  "src/lib/ecg-module",
  "src/lib/labs",
  "src/lib/clinical-skills",
  "src/lib/pharmacology",
  "src/lib/pre-nursing",
  "src/lib/admissions",
];

const REQUIRED_PATHWAYS = ["RN", "RPN/PN", "NP", "ECG", "Labs", "Clinical Skills", "Pharmacology", "Allied"];
const OPTION_CALL_PATTERN =
  /option\(\s*["'](?<id>[A-Z])["']\s*,\s*(?<quote>`|'|")(?<text>[^`'"\n]*?)(?<!\\)\k<quote>\s*,\s*false\s*,\s*(?<rquote>`|'|")(?<rationale>[^`'"\n]*?)(?<!\\)\k<rquote>\s*\)/g;
const OBJECT_FALSE_OPTION_PATTERN =
  /\{\s*(?:id\s*:\s*(?<idquote>`|'|")(?<id>[^`'"]+)(?<!\\)\k<idquote>\s*,\s*)?text\s*:\s*(?<quote>`|'|")(?<text>[\s\S]*?)(?<!\\)\k<quote>[\s\S]{0,240}?correct\s*:\s*false[\s\S]{0,240}?rationale\s*:\s*(?<rquote>`|'|")(?<rationale>[\s\S]*?)(?<!\\)\k<rquote>[\s\S]{0,80}?\}/g;

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
    .replace(/\$\{[^}]+\}/g, "item-specific cue")
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
  return source.slice(Math.max(0, index - 2200), Math.min(source.length, index + 800));
}

function findNearbyValue(window: string, key: string): string {
  const pattern = new RegExp(`\\b${key}\\b\\s*:\\s*["'\`]([^"'\`\\n]{1,360})["'\`]`, "g");
  const matches = [...window.matchAll(pattern)];
  return cleanText(matches.at(-1)?.[1] ?? "");
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

function collectRecords(): DistractorRecord[] {
  const records: DistractorRecord[] = [];

  for (const file of listFiles()) {
    const source = readFileSync(path.join(ROOT, file), "utf8");
    const patterns = [OPTION_CALL_PATTERN, OBJECT_FALSE_OPTION_PATTERN];

    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      for (const match of source.matchAll(pattern)) {
        const index = match.index ?? 0;
        const window = nearbyWindow(source, index);
        const line = lineForIndex(source, index);
        const text = cleanText(match.groups?.text ?? "");
        const rationale = cleanText(match.groups?.rationale ?? "");
        const optionId = cleanText(match.groups?.id ?? "?");
        const stem = findNearbyValue(window, "stem") || findNearbyValue(window, "scenario") || findNearbyValue(window, "questionText");
        const correctAnswer = findNearbyValue(window, "correctAnswer") || findNearbyValue(window, "correct");
        const questionId = findNearbyValue(window, "id") || `${file}:${line}`;
        const pathway = inferPathway(file, `${window} ${text} ${rationale}`);
        const id = `${file}:${line}:${optionId}`;
        const score = scoreDistractorQuality({
          id,
          distractor: text,
          stem,
          correctAnswer,
          rationale,
          whyTempting: rationale,
          whyIncorrect: rationale,
          riskIntroduced: rationale,
          pathway,
        });

        records.push({
          id,
          file,
          line,
          pathway,
          questionId,
          optionId,
          stem,
          text,
          rationale,
          score,
          duplicateCount: 1,
        });
      }
    }
  }

  const duplicateCounts = new Map<string, number>();
  for (const record of records) {
    const key = normalizeDistractorForDuplicateDetection(record.text);
    duplicateCounts.set(key, (duplicateCounts.get(key) ?? 0) + 1);
  }

  return records.map((record) => ({
    ...record,
    duplicateCount: duplicateCounts.get(normalizeDistractorForDuplicateDetection(record.text)) ?? 1,
  }));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function escapeCell(value: string | number): string {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
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

function excerpt(text: string, max = 150): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 1)}...` : normalized;
}

function summarizePathways(records: DistractorRecord[]): Array<{ pathway: string; count: number; average: number; failed: number; realism: number }> {
  const groups = new Map<string, DistractorRecord[]>();
  for (const pathway of REQUIRED_PATHWAYS) groups.set(pathway, []);
  for (const record of records) groups.set(record.pathway, [...(groups.get(record.pathway) ?? []), record]);

  return [...groups.entries()]
    .map(([pathway, items]) => ({
      pathway,
      count: items.length,
      average: average(items.map((item) => item.score.score)),
      failed: items.filter((item) => !item.score.publishAllowed).length,
      realism: average(items.map((item) => item.score.dimensions.clinicalRealism)),
    }))
    .sort((a, b) => {
      const ai = REQUIRED_PATHWAYS.indexOf(a.pathway);
      const bi = REQUIRED_PATHWAYS.indexOf(b.pathway);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return a.average - b.average;
    });
}

function buildDistractorAudit(records: DistractorRecord[]): string {
  const failed = records.filter((record) => !record.score.publishAllowed);
  const duplicates = records.filter((record) => record.duplicateCount > 1);
  const throwaways = records.filter((record) => record.score.issues.some((issue) => /throwaway|too short|weakly connected/i.test(issue)));
  const summaries = summarizePathways(records);

  return `# Distractor Quality Audit

Generated: ${new Date().toISOString()}

Static source-backed audit of explicit false options found in NurseNest question banks. This audit enforces the publish gate that every wrong answer should teach why it is tempting, why it is incorrect, and what safety or reasoning risk it introduces.

## Summary

- Distractors scored: ${records.length}
- Average distractor score: ${average(records.map((record) => record.score.score))}
- Failed publish gate: ${failed.length}
- Duplicate distractor text instances: ${duplicates.length}
- Throwaway or unrealistic distractor signals: ${throwaways.length}
- Minimum publish score: 80

## Pathway Scores

${table([
  ["Pathway", "Distractors", "Average Score", "Failed Gate", "Clinical Realism Avg"],
  ...summaries.map((summary) => [summary.pathway, summary.count, summary.average, summary.failed, summary.realism]),
])}

## Failed Distractors

${table([
  ["Score", "Pathway", "Source", "Option", "Issue", "Distractor"],
  ...failed.slice(0, 120).map((record) => [
    record.score.score,
    record.pathway,
    `${record.file}:${record.line}`,
    record.optionId,
    record.score.issues[0] ?? "Below publish gate.",
    excerpt(record.text),
  ]),
])}

## Duplicate Distractors

${table([
  ["Pathway", "Source", "Duplicate Count", "Distractor"],
  ...duplicates.slice(0, 80).map((record) => [record.pathway, `${record.file}:${record.line}`, record.duplicateCount, excerpt(record.text)]),
])}
`;
}

function buildRealismDashboard(records: DistractorRecord[]): string {
  const summaries = summarizePathways(records);
  const byQuestion = new Map<string, DistractorRecord[]>();
  for (const record of records) byQuestion.set(record.questionId, [...(byQuestion.get(record.questionId) ?? []), record]);
  const blockedQuestions = [...byQuestion.entries()].filter(([, items]) => items.some((item) => !item.score.publishAllowed));

  return `# Question Realism Dashboard

Generated: ${new Date().toISOString()}

Realism is estimated from distractor clinical workflow, assessment, escalation, safety, and taxonomy signals. A question is blocked when any scored distractor fails the publish gate.

## Pathway Realism

${table([
  ["Pathway", "Distractors", "Clinical Realism", "Assessment Realism", "Escalation/Safety Realism", "Blocked Distractors"],
  ...summaries.map((summary) => {
    const items = records.filter((record) => record.pathway === summary.pathway);
    return [
      summary.pathway,
      summary.count,
      summary.realism,
      average(items.map((item) => item.score.taxonomy.includes("assessment_error") ? 100 : item.score.dimensions.clinicalRealism)),
      average(items.map((item) => item.score.safetyAnalysisPresent ? 100 : item.score.dimensions.safetyRelevance)),
      summary.failed,
    ];
  }),
])}

## Blocked Questions

${table([
  ["Question", "Failed Distractors", "Lowest Score", "Example Source"],
  ...blockedQuestions.slice(0, 120).map(([questionId, items]) => [
    questionId,
    items.filter((item) => !item.score.publishAllowed).length,
    Math.min(...items.map((item) => item.score.score)),
    `${items[0]?.file}:${items[0]?.line}`,
  ]),
])}

## Publish Gate

No question may publish when any distractor score is below 80, why-tempting analysis is missing, safety analysis is missing, misconception mapping is missing, remediation mapping is missing, readiness mapping is missing, or duplicate/throwaway distractors are present.
`;
}

function buildDistractorAnalyticsDashboard(records: DistractorRecord[]): string {
  const taxonomyCounts = new Map<string, number>();
  const readinessCounts = new Map<string, number>();
  for (const record of records) {
    for (const type of record.score.taxonomy) taxonomyCounts.set(type, (taxonomyCounts.get(type) ?? 0) + 1);
    for (const domain of record.score.readinessDomains) readinessCounts.set(domain, (readinessCounts.get(domain) ?? 0) + 1);
  }
  const byTopic = new Map<string, DistractorRecord[]>();
  for (const record of records) {
    const key = `${record.pathway} · ${record.questionId}`;
    byTopic.set(key, [...(byTopic.get(key) ?? []), record]);
  }

  return `# Distractor Analytics Dashboard

Generated: ${new Date().toISOString()}

Wrong-answer selections should feed misconception frequency, topic weakness, safety weakness, clinical judgment weakness, and readiness-domain updates.

## Misconception Frequency

${table([
  ["Misconception", "Distractor Count"],
  ...[...taxonomyCounts.entries()].sort((a, b) => b[1] - a[1]).map(([type, count]) => [type.replace(/_/g, " "), count]),
])}

## Readiness Domain Signals

${table([
  ["Readiness Domain", "Mapped Distractors"],
  ...[...readinessCounts.entries()].sort((a, b) => b[1] - a[1]).map(([domain, count]) => [domain.replace(/_/g, " "), count]),
])}

## Weakness Detection Rules

| Signal | Analytics Update |
| --- | --- |
| Most selected wrong answer | Increment primary misconception and readiness domain |
| Second most selected wrong answer | Increment secondary misconception and compare against stem topic |
| Repeated safety distractors | Increase patient safety weakness score |
| Repeated under-escalation or failure-to-rescue | Increase escalation readiness risk |
| Repeated medication-monitoring failure | Increase medication safety remediation priority |
| Repeated documentation error | Assign documentation practice |

## Lowest-Scoring Question Clusters

${table([
  ["Question", "Pathway", "Average Distractor Score", "Lowest Score", "Mapped Domains"],
  ...[...byTopic.entries()]
    .map(([question, items]) => ({
      question,
      pathway: items[0]?.pathway ?? "Unknown",
      average: average(items.map((item) => item.score.score)),
      lowest: Math.min(...items.map((item) => item.score.score)),
      domains: [...new Set(items.flatMap((item) => item.score.readinessDomains))].join(", "),
    }))
    .sort((a, b) => a.lowest - b.lowest)
    .slice(0, 80)
    .map((row) => [row.question, row.pathway, row.average, row.lowest, row.domains || "missing"]),
])}
`;
}

function buildFailureToRescueLibrary(records: DistractorRecord[]): string {
  const items = records.filter((record) => record.score.failureToRescueSignal);
  return `# Failure-To-Rescue Library

Generated: ${new Date().toISOString()}

Distractors in this library involve missed deterioration, delayed escalation, incorrect prioritization, delayed assessment, or missed trends.

## Summary

- Failure-to-rescue distractors: ${items.length}
- Affected pathways: ${[...new Set(items.map((item) => item.pathway))].join(", ") || "None detected"}

## Library

${table([
  ["Score", "Pathway", "Source", "Taxonomy", "Distractor", "Risk"],
  ...items.slice(0, 200).map((record) => [
    record.score.score,
    record.pathway,
    `${record.file}:${record.line}`,
    record.score.taxonomy.join(", "),
    excerpt(record.text),
    excerpt(record.score.learnerMisconception),
  ]),
])}
`;
}

function buildDistractorRewriteQueue(records: DistractorRecord[]): string {
  const items = records.filter((record) => !record.score.publishAllowed || record.duplicateCount > 1);
  return `# Distractor Rewrite Queue

Generated: ${new Date().toISOString()}

Every listed distractor remains blocked or review-required until it has plausible learner psychology, safety analysis, remediation mapping, and readiness mapping.

${table([
  ["Question ID", "Distractor", "Failure Reason", "Recommended Replacement"],
  ...items.slice(0, 250).map((record) => [
    record.questionId,
    excerpt(record.text),
    record.duplicateCount > 1 ? "Duplicate distractor text" : record.score.issues[0] ?? "Below publish gate",
    `Create a plausible ${record.score.taxonomy[0]?.replace(/_/g, " ") || "clinical reasoning"} distractor that explains why it is tempting, why it is wrong, the risk it creates, and the remediation domain.`,
  ]),
])}
`;
}

function buildQuestionRealismScore(records: DistractorRecord[]): string {
  const summaries = summarizePathways(records);
  return `# Question Realism Score

Generated: ${new Date().toISOString()}

Target realism score: 95%.

## Scoring Domains

| Domain | Evidence |
| --- | --- |
| Workflow realism | Action fits bedside, clinical, or exam workflow |
| Assessment realism | Distractor reflects a believable assessment or reassessment mistake |
| Communication realism | Communication choices reflect SBAR, handoff, clarification, teaching, or escalation needs |
| Documentation realism | Documentation choices follow assess-act-evaluate-document sequence |
| Escalation realism | Escalation level matches patient acuity |

## Current Source-Backed Scores

${table([
  ["Pathway", "Distractors", "Average Score", "Clinical Realism", "Failed Gate"],
  ...summaries.map((summary) => [summary.pathway, summary.count, summary.average, summary.realism, summary.failed]),
])}

## Publish Rule

Any question with a distractor score below 80, missing misconception mapping, missing safety analysis, missing remediation mapping, or missing readiness mapping is blocked from publication.
`;
}

function buildFlagshipDistractorLibrary(records: DistractorRecord[]): string {
  const items = records.filter((record) => record.score.score >= 95).sort((a, b) => b.score.score - a.score.score);
  return `# Flagship Distractor Library

Generated: ${new Date().toISOString()}

Goal: maintain a repository of the top 1,000 distractors. A flagship distractor has score 95+, clear learner psychology, misconception mapping, remediation mapping, readiness mapping, and clinical safety consequence.

## Current Flagship Candidates

${table([
  ["Score", "Pathway", "Source", "Why It Works", "Misconception", "Remediation", "Readiness Domains"],
  ...items.slice(0, 1000).map((record) => [
    record.score.score,
    record.pathway,
    `${record.file}:${record.line}`,
    excerpt(record.text),
    excerpt(record.score.learnerMisconception),
    excerpt(record.score.remediationTargets.join("; ")),
    record.score.readinessDomains.join(", "),
  ]),
])}

${items.length === 0 ? "No source-backed distractors currently meet the 95+ flagship threshold under Distractor Intelligence 2.0." : ""}
`;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const records = collectRecords();
writeFileSync(path.join(OUTPUT_DIR, "distractor-quality-audit.md"), buildDistractorAudit(records));
writeFileSync(path.join(OUTPUT_DIR, "question-realism-dashboard.md"), buildRealismDashboard(records));
writeFileSync(path.join(OUTPUT_DIR, "distractor-analytics-dashboard.md"), buildDistractorAnalyticsDashboard(records));
writeFileSync(path.join(OUTPUT_DIR, "failure-to-rescue-library.md"), buildFailureToRescueLibrary(records));
writeFileSync(path.join(OUTPUT_DIR, "distractor-rewrite-queue.md"), buildDistractorRewriteQueue(records));
writeFileSync(path.join(OUTPUT_DIR, "question-realism-score.md"), buildQuestionRealismScore(records));
writeFileSync(path.join(OUTPUT_DIR, "flagship-distractor-library.md"), buildFlagshipDistractorLibrary(records));

console.log(`Scored ${records.length} distractors.`);
console.log(`Failed publish gate: ${records.filter((record) => !record.score.publishAllowed).length}.`);
console.log("Wrote docs/content-quality/distractor-quality-audit.md");
console.log("Wrote docs/content-quality/question-realism-dashboard.md");
console.log("Wrote distractor intelligence dashboards and queues.");
