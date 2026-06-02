import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { pharmacyTechnicianQuestions } from "../src/content/questions/allied-pharmacy-technician";
import { cnplePracticalNursingNgnExpansionQuestions } from "../src/content/questions/cnple-practical-nursing-ngn-expansion";
import { nclexTier1FoundationalQuestions } from "../src/content/questions/nclex-tier1-foundational-questions";
import { nclexTier2ClinicalJudgmentQuestions } from "../src/content/questions/nclex-tier2-clinical-judgment-questions";
import { nclexTier3AdvancedReviewQuestions } from "../src/content/questions/nclex-tier3-advanced-review-questions";
import { PRE_NURSING_QUESTION_BANK } from "../src/lib/pre-nursing/pre-nursing-question-bank";
import {
  scoreHintQuality,
  type HintQualityIssueCode,
  type HintQualityPathway,
  type HintQualityResult,
} from "../src/lib/questions/hint-quality-score";

type AuditQuestion = {
  id: string;
  pathway: string;
  topic: string;
  stem: string;
  hints: string[];
  options?: string[];
  correctAnswer?: string | string[];
};

type ScoredHint = {
  questionId: string;
  pathway: string;
  topic: string;
  hintIndex: number;
  currentHint: string;
  score: number;
  gate: HintQualityResult["gate"];
  publishAllowed: boolean;
  issues: readonly HintQualityIssueCode[];
  suggestedRewrite: string;
  targetScore: 4 | 5;
};

function optionTextById(options: readonly { id?: string; text?: string }[] | undefined, id: unknown): string | undefined {
  if (!options) return undefined;
  const needle = String(id ?? "");
  return options.find((option) => option.id === needle)?.text;
}

function firstHintList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizePathwayForScore(pathway: string, topic: string): HintQualityPathway {
  const text = `${pathway} ${topic}`.toLowerCase();
  if (/\bpre-nursing\b/.test(text)) return "PRE_NURSING";
  if (/\ballied\b/.test(text)) return "ALLIED";
  if (/\b(ecg|ekg|telemetry|rhythm)\b/.test(text)) return "ECG";
  if (/\b(lab|labs|abg|electrolyte|troponin|creatinine|hemoglobin)\b/.test(text)) return "LABS";
  if (/\b(medication math|med math|dose calculation|dosage calculation)\b/.test(text)) return "MEDICATION_MATH";
  if (/\b(pharmacology|medication|drug|insulin|opioid|anticoagulant|antibiotic)\b/.test(text)) return "PHARMACOLOGY";
  if (/\bclinical skills\b/.test(text)) return "CLINICAL_SKILLS";
  if (/\b(rpn|pn|lpn|rex-pn|nclex-pn)\b/.test(text)) return "RPN_PN";
  if (/\b(cnple|fnp|agpcnp|pmhnp|whnp|pnp|np)\b/.test(text)) return "NP";
  return "RN";
}

function suggestedRewriteFor(item: Pick<ScoredHint, "pathway" | "topic">): string {
  const text = `${item.pathway} ${item.topic}`.toLowerCase();
  if (text.includes("ecg")) {
    return "Use rate, regularity, P waves, PR interval, QRS width, and hemodynamic impact before choosing the interpretation.";
  }
  if (text.includes("lab")) {
    return "Decide whether the abnormal value is isolated or part of a worsening pattern or trend before choosing the next action.";
  }
  if (text.includes("math") || text.includes("calculation")) {
    return "Set up the units first, convert carefully, and check whether the final dose is clinically reasonable.";
  }
  if (text.includes("pharm") || text.includes("medication")) {
    return "Consider contraindications, monitoring needs, adverse effects, and whether the finding requires holding or reporting.";
  }
  if (text.includes("pn") || text.includes("rpn")) {
    return "Decide whether the finding is expected and predictable or requires reporting, monitoring, and reassessment within scope.";
  }
  if (text.includes("np") || text.includes("cnple") || text.includes("fnp")) {
    return "Use the red flags and patient-specific risks to choose the safest diagnosis, management step, referral, or follow-up plan.";
  }
  if (text.includes("pre-nursing")) {
    return "Think about the primary function, structure, or process before choosing the answer.";
  }
  return "Identify the most important cue, then choose the action that best protects safety, priority, or escalation timing.";
}

const questions: AuditQuestion[] = [
  ...nclexTier1FoundationalQuestions.map((question) => ({
    id: question.id,
    pathway: question.exam.includes("NCLEX-PN") ? "RN/RPN-PN authored tier 1" : "RN",
    topic: question.topic,
    stem: question.stem,
    hints: [...question.hints],
    options: question.options.map((option) => option.text),
    correctAnswer: optionTextById(question.options, question.correctAnswer),
  })),
  ...nclexTier2ClinicalJudgmentQuestions.map((question) => ({
    id: question.id,
    pathway: "RN",
    topic: question.topic,
    stem: question.stem,
    hints: [...question.hints],
    options: question.options.map((option) => option.text),
    correctAnswer: optionTextById(question.options, question.correctAnswer),
  })),
  ...nclexTier3AdvancedReviewQuestions.map((question) => ({
    id: question.id,
    pathway: "RN",
    topic: question.topic,
    stem: question.stem,
    hints: [...question.hints],
    options: question.options.map((option) => option.text),
    correctAnswer: optionTextById(question.options, question.correctAnswer),
  })),
  ...cnplePracticalNursingNgnExpansionQuestions.map((question) => ({
    id: question.id,
    pathway: "CNPLE/RPN-PN",
    topic: question.topic,
    stem: question.stem,
    hints: firstHintList(question.hints),
    correctAnswer: typeof question.correctAnswer === "string" ? question.correctAnswer : undefined,
  })),
  ...PRE_NURSING_QUESTION_BANK.map((question) => ({
    id: question.id,
    pathway: "Pre-Nursing",
    topic: question.moduleSlug,
    stem: question.question,
    hints: [],
    options: question.options,
    correctAnswer: question.options[question.correct],
  })),
  ...pharmacyTechnicianQuestions.map((question) => ({
    id: question.id,
    pathway: "Allied Health - Pharmacy Technician",
    topic: question.domain,
    stem: question.stem,
    hints: [],
    options: question.options,
    correctAnswer: question.options[question.correctIndex],
  })),
];

const scored: ScoredHint[] = [];

for (const question of questions) {
  const hints = question.hints.length > 0 ? question.hints : [""];
  hints.forEach((hint, index) => {
    const result = scoreHintQuality({
      id: question.id,
      hint,
      stem: question.stem,
      options: question.options,
      correctAnswer: question.correctAnswer,
      pathway: normalizePathwayForScore(question.pathway, question.topic),
      topic: question.topic,
    });
    scored.push({
      questionId: question.id,
      pathway: question.pathway,
      topic: question.topic,
      hintIndex: index,
      currentHint: hint,
      score: result.score,
      gate: result.gate,
      publishAllowed: result.publishAllowed,
      issues: result.issues,
      suggestedRewrite: suggestedRewriteFor({ pathway: question.pathway, topic: question.topic }),
      targetScore: result.score <= 2 ? 5 : 4,
    });
  });
}

const byPathway = new Map<string, ScoredHint[]>();
for (const item of scored) {
  byPathway.set(item.pathway, [...(byPathway.get(item.pathway) ?? []), item]);
}

function average(items: readonly ScoredHint[]): number {
  if (items.length === 0) return 0;
  return Number((items.reduce((sum, item) => sum + item.score, 0) / items.length).toFixed(2));
}

function countIssue(issue: HintQualityIssueCode): number {
  return scored.filter((item) => item.issues.includes(issue)).length;
}

const summary = {
  generatedAt: new Date().toISOString(),
  scopeNote:
    "Static repository-authored banks were audited. DB-backed live exam_questions pools were not queried by this script.",
  totalQuestions: questions.length,
  totalHints: scored.length,
  averageHintScore: average(scored),
  failedHints: scored.filter((item) => item.score === 1).length,
  answerLeakingHints: scored.filter(
    (item) => item.issues.includes("answer_option_leakage") || item.issues.includes("answer_wording_leakage"),
  ).length,
  genericHints: countIssue("generic_hint"),
  missingHints: countIssue("missing_hint"),
  unsafeHints: countIssue("unsafe_scope_prompt"),
  pathwaySpecificHintRate: Number(
    ((scored.filter((item) => !item.issues.includes("missing_pathway_specificity")).length / Math.max(1, scored.length)) * 100).toFixed(1),
  ),
};

const pathwayScores = [...byPathway.entries()]
  .map(([pathway, items]) => ({
    pathway,
    totalHints: items.length,
    averageHintScore: average(items),
    failedHints: items.filter((item) => item.score === 1).length,
    missingHints: items.filter((item) => item.issues.includes("missing_hint")).length,
    answerLeakingHints: items.filter(
      (item) => item.issues.includes("answer_option_leakage") || item.issues.includes("answer_wording_leakage"),
    ).length,
    genericHints: items.filter((item) => item.issues.includes("generic_hint")).length,
    pathwaySpecificHintRate: Number(
      ((items.filter((item) => !item.issues.includes("missing_pathway_specificity")).length / Math.max(1, items.length)) * 100).toFixed(1),
    ),
  }))
  .sort((a, b) => a.averageHintScore - b.averageHintScore);

const failed = scored.filter((item) => item.score <= 2 || item.issues.length > 0);
const report = {
  summary,
  pathwayScores,
  failedHints: failed,
};

const reportDir = path.join(process.cwd(), "reports");
mkdirSync(reportDir, { recursive: true });
writeFileSync(path.join(reportDir, "hint-quality-audit.json"), JSON.stringify(report, null, 2));

const md = [
  "# Hint Quality Audit",
  "",
  `Generated: ${summary.generatedAt}`,
  "",
  summary.scopeNote,
  "",
  "## Summary",
  "",
  "| Metric | Value |",
  "| --- | ---: |",
  `| Total questions | ${summary.totalQuestions} |`,
  `| Total hints | ${summary.totalHints} |`,
  `| Average hint score | ${summary.averageHintScore} |`,
  `| Failed hints | ${summary.failedHints} |`,
  `| Answer-leaking hints | ${summary.answerLeakingHints} |`,
  `| Generic hints | ${summary.genericHints} |`,
  `| Missing hints | ${summary.missingHints} |`,
  `| Unsafe hints | ${summary.unsafeHints} |`,
  `| Pathway-specific hint rate | ${summary.pathwaySpecificHintRate}% |`,
  "",
  "## Pathway Scores",
  "",
  "| Pathway | Total Hints | Average Score | Failed | Missing | Answer-Leaking | Generic | Pathway-Specific Rate |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...pathwayScores.map(
    (row) =>
      `| ${row.pathway} | ${row.totalHints} | ${row.averageHintScore} | ${row.failedHints} | ${row.missingHints} | ${row.answerLeakingHints} | ${row.genericHints} | ${row.pathwaySpecificHintRate}% |`,
  ),
  "",
  "## Failed Or Review-Required Hints",
  "",
  "| Question ID | Pathway | Topic | Score | Issues |",
  "| --- | --- | --- | ---: | --- |",
  ...failed
    .slice(0, 200)
    .map((item) => `| ${item.questionId} | ${item.pathway} | ${item.topic} | ${item.score} | ${item.issues.join(", ") || "review"} |`),
  "",
  failed.length > 200 ? `_Truncated to first 200 of ${failed.length} failed or review-required hints._` : "",
  "",
].join("\n");
writeFileSync(path.join(reportDir, "hint-quality-audit.md"), md);

const queue = [
  "# Hint Rewrite Queue",
  "",
  `Generated: ${summary.generatedAt}`,
  "",
  "Every failed hint remains non-publishable until rewritten and rescored.",
  "",
  "| Question ID | Pathway | Topic | Current Hint | Failure Reason | Suggested Rewrite | Target Score |",
  "| --- | --- | --- | --- | --- | --- | ---: |",
  ...failed.map(
    (item) =>
      `| ${item.questionId} | ${item.pathway} | ${item.topic} | ${item.currentHint || "(missing)"} | ${item.issues.join(", ") || "review required"} | ${item.suggestedRewrite} | ${item.targetScore} |`,
  ),
  "",
].join("\n");
writeFileSync(path.join(reportDir, "hint-rewrite-queue.md"), queue);

console.log(`Audited ${summary.totalHints} hints across ${summary.totalQuestions} static questions.`);
console.log(`Average hint score: ${summary.averageHintScore}`);
console.log(`Reports written to ${reportDir}`);
