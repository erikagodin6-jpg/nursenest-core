import fs from "fs/promises";
import path from "path";
import { createLazyPrimaryPoolProxy } from "../server/db";
import {
  NCLEX_RN_2026_COVERAGE_MAP,
  NCLEX_RN_2026_SOURCE,
  NCLEX_RN_CLINICAL_JUDGMENT_STEPS,
  NCLEX_RN_INTEGRATED_PROCESSES,
  NURSENEST_RN_DEEP_COVERAGE_STANDARD,
} from "../server/data/nclex-rn-2026-coverage-map";

const pool = createLazyPrimaryPoolProxy();

type BlueprintScore = {
  clientNeed: string;
  subcategory: string;
  score: number;
  lessonSignalScore: number;
  questionSignalScore: number;
  lessonVolumeScore: number;
  questionVolumeScore: number;
  ngnScore: number;
  sataScore: number;
  conceptCoverageScore: number;
  lessonCount: number;
  questionCount: number;
  ngnQuestionCount: number;
  sataQuestionCount: number;
  coveredConcepts: string[];
  missingConcepts: string[];
  missingSignals: string[];
  recommendedActions: string[];
};

function textMatchesAny(text: string, signals: string[]): boolean {
  const lower = text.toLowerCase();
  return signals.some((signal) => lower.includes(signal.toLowerCase()));
}

function conceptTerms(concept: string): string[] {
  return concept
    .toLowerCase()
    .replace(/[^a-z0-9/\s-]/g, " ")
    .split(/[\s,/;-]+/)
    .filter((token) => token.length >= 5)
    .slice(0, 8);
}

function conceptCovered(corpus: string, concept: string): boolean {
  const lower = corpus.toLowerCase();
  const terms = conceptTerms(concept);
  if (terms.length === 0) return false;
  const matches = terms.filter((term) => lower.includes(term)).length;
  return matches >= Math.min(2, terms.length);
}

function capRatio(actual: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((actual / target) * 100));
}

async function fetchCorpus() {
  const lessonRows = await pool.query(`
    SELECT id, title, slug, category, body_system, tags, summary, content
    FROM content_items
    WHERE tier = 'rn' AND type = 'lesson' AND status = 'published'
  `);

  const questionRows = await pool.query(`
    SELECT id, stem, rationale, scenario, clinical_pearl, correct_answer_explanation,
           incorrect_answer_rationale, clinical_reasoning, key_takeaway, body_system,
           category, topic, question_type, difficulty
    FROM exam_questions
    WHERE tier = 'rn'
  `);

  const lessonCorpus = lessonRows.rows.map((row) => JSON.stringify(row)).join("\n");
  const questionCorpus = questionRows.rows.map((row) => JSON.stringify(row)).join("\n");
  return { lessonRows: lessonRows.rows, questionRows: questionRows.rows, lessonCorpus, questionCorpus };
}

function buildScore(corpus: Awaited<ReturnType<typeof fetchCorpus>>, item: typeof NCLEX_RN_2026_COVERAGE_MAP[number]): BlueprintScore {
  const subcategory = item.subcategory || item.clientNeed;
  const allCorpus = `${corpus.lessonCorpus}\n${corpus.questionCorpus}`;
  const lessonMatches = corpus.lessonRows.filter((row) => textMatchesAny(JSON.stringify(row), item.requiredLessonSignals));
  const questionMatches = corpus.questionRows.filter((row) => textMatchesAny(JSON.stringify(row), item.requiredQuestionSignals));
  const ngnMatches = questionMatches.filter((row) => {
    const type = String(row.question_type || "").toLowerCase();
    return type.includes("case") || type.includes("ngn") || Boolean(row.scenario);
  });
  const sataMatches = questionMatches.filter((row) => {
    const type = String(row.question_type || "").toLowerCase();
    return type.includes("select") || type.includes("sata");
  });

  const coveredConcepts = item.concepts.filter((concept) => conceptCovered(allCorpus, concept));
  const missingConcepts = item.concepts.filter((concept) => !coveredConcepts.includes(concept));
  const missingSignals = [...item.requiredLessonSignals, ...item.requiredQuestionSignals]
    .filter((signal) => !allCorpus.toLowerCase().includes(signal.toLowerCase()));

  const lessonVolumeScore = capRatio(lessonMatches.length, item.minimumLessonCount);
  const questionVolumeScore = capRatio(questionMatches.length, item.minimumQuestionCount);
  const ngnScore = capRatio(ngnMatches.length, item.minimumNgnCaseCount);
  const sataScore = capRatio(sataMatches.length, item.minimumSataCount);
  const conceptCoverageScore = capRatio(coveredConcepts.length, item.concepts.length);
  const lessonSignalScore = capRatio(item.requiredLessonSignals.length - item.requiredLessonSignals.filter((signal) => !corpus.lessonCorpus.toLowerCase().includes(signal.toLowerCase())).length, item.requiredLessonSignals.length);
  const questionSignalScore = capRatio(item.requiredQuestionSignals.length - item.requiredQuestionSignals.filter((signal) => !corpus.questionCorpus.toLowerCase().includes(signal.toLowerCase())).length, item.requiredQuestionSignals.length);

  const score = Math.round(
    lessonVolumeScore * 0.12 +
    questionVolumeScore * 0.16 +
    ngnScore * 0.14 +
    sataScore * 0.12 +
    conceptCoverageScore * 0.26 +
    lessonSignalScore * 0.10 +
    questionSignalScore * 0.10
  );

  const recommendedActions: string[] = [];
  if (missingConcepts.length) recommendedActions.push(`Create/repair deep lessons and questions for: ${missingConcepts.slice(0, 8).join("; ")}${missingConcepts.length > 8 ? "..." : ""}`);
  if (lessonVolumeScore < 100) recommendedActions.push(`Add ${Math.max(0, item.minimumLessonCount - lessonMatches.length)} lesson(s) mapped to ${subcategory}.`);
  if (questionVolumeScore < 100) recommendedActions.push(`Add ${Math.max(0, item.minimumQuestionCount - questionMatches.length)} question(s) mapped to ${subcategory}.`);
  if (ngnScore < 100) recommendedActions.push(`Add ${Math.max(0, item.minimumNgnCaseCount - ngnMatches.length)} NGN/case-style item(s).`);
  if (sataScore < 100) recommendedActions.push(`Add ${Math.max(0, item.minimumSataCount - sataMatches.length)} SATA/select-all item(s).`);
  if (missingSignals.length) recommendedActions.push(`Ensure explicit signals appear in lessons/questions: ${missingSignals.slice(0, 12).join(", ")}.`);

  return {
    clientNeed: item.clientNeed,
    subcategory,
    score,
    lessonSignalScore,
    questionSignalScore,
    lessonVolumeScore,
    questionVolumeScore,
    ngnScore,
    sataScore,
    conceptCoverageScore,
    lessonCount: lessonMatches.length,
    questionCount: questionMatches.length,
    ngnQuestionCount: ngnMatches.length,
    sataQuestionCount: sataMatches.length,
    coveredConcepts,
    missingConcepts,
    missingSignals,
    recommendedActions,
  };
}

async function writeReports(scores: BlueprintScore[]) {
  const overallScore = Math.round(scores.reduce((sum, row) => sum + row.score, 0) / Math.max(1, scores.length));
  const report = {
    generatedAt: new Date().toISOString(),
    source: NCLEX_RN_2026_SOURCE,
    standard: NURSENEST_RN_DEEP_COVERAGE_STANDARD,
    integratedProcesses: NCLEX_RN_INTEGRATED_PROCESSES,
    clinicalJudgmentSteps: NCLEX_RN_CLINICAL_JUDGMENT_STEPS,
    overallScore,
    scores,
    topGaps: scores
      .flatMap((row) => row.missingConcepts.map((concept) => ({ subcategory: row.subcategory, concept })))
      .slice(0, 50),
  };

  const reportDir = path.join(process.cwd(), "reports", "rn-content-quality");
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, "rn-blueprint-100-audit.json"), JSON.stringify(report, null, 2));
  await fs.writeFile(
    path.join(reportDir, "rn-blueprint-100-audit.md"),
    `# RN Blueprint 100% Audit\n\nGenerated: ${report.generatedAt}\n\nSource baseline: ${NCLEX_RN_2026_SOURCE.publisher} — ${NCLEX_RN_2026_SOURCE.title}, effective ${NCLEX_RN_2026_SOURCE.effective}.\n\nOverall score: **${overallScore}%**\n\n## Category scores\n\n| Client need | Subcategory | Score | Lessons | Questions | NGN | SATA | Concept coverage | Recommended action |\n|---|---|---:|---:|---:|---:|---:|---:|---|\n${scores.map((row) => `| ${row.clientNeed} | ${row.subcategory} | ${row.score}% | ${row.lessonCount} | ${row.questionCount} | ${row.ngnQuestionCount} | ${row.sataQuestionCount} | ${row.conceptCoverageScore}% | ${row.recommendedActions[0] || "Maintain coverage"} |`).join("\n")}\n\n## Top missing concepts\n\n${report.topGaps.map((gap) => `- **${gap.subcategory}:** ${gap.concept}`).join("\n") || "No missing concepts detected."}\n\n## Quality standard\n\n- Lesson minimum words: ${NURSENEST_RN_DEEP_COVERAGE_STANDARD.minimumLessonWords}\n- Lesson sections: ${NURSENEST_RN_DEEP_COVERAGE_STANDARD.minimumLessonSections}\n- Required item fields: ${NURSENEST_RN_DEEP_COVERAGE_STANDARD.requiredQuestionFields.join(", ")}\n- Required item mix: ${NURSENEST_RN_DEEP_COVERAGE_STANDARD.requiredQuestionMix.join(", ")}\n\n## Safe external audit rule\n\n${NURSENEST_RN_DEEP_COVERAGE_STANDARD.externalAuditPrinciple}\n`
  );
  return report;
}

async function main() {
  const corpus = await fetchCorpus();
  const scores = NCLEX_RN_2026_COVERAGE_MAP.map((item) => buildScore(corpus, item));
  const report = await writeReports(scores);
  console.log(JSON.stringify({ overallScore: report.overallScore, categories: scores.length }, null, 2));
  console.log("Blueprint audit written to reports/rn-content-quality/rn-blueprint-100-audit.{json,md}");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
