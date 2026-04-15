/**
 * Builds batch-2 impact artifacts from lesson-completeness-audit.json + lesson-fix-batch-2-plan.json.
 * Run: cd nursenest-core && npx tsx scripts/audit/run-lesson-batch2-impact-report.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const AUDIT = join(REPO, "data/audit/lesson-completeness-audit.json");
const PLAN = join(REPO, "data/audit/lesson-fix-batch-2-plan.json");
const OUT_IMPACT = join(REPO, "data/audit/lesson-fix-batch-2-impact.json");
const OUT_REPORT = join(REPO, "data/audit/lesson-fix-batch-2-report.json");
const OUT_MD = join(REPO, "data/audit/lesson-fix-batch-2-impact-summary.md");

type AuditRow = {
  lessonId: string;
  slug: string;
  pathwayId: string;
  overallScore: number;
  status: string;
  contentReadinessStatus: string;
  localizationReadinessStatus: string;
  reasons: string[];
  evidence: {
    publicComplete: boolean;
    gateIssues: string[];
    totalWords: number;
    structuralMode?: string;
  };
};

type PlanLesson = {
  lessonId: string;
  slug: string;
  pathwayId: string;
  currentScores: { overallScore: number };
  currentStatus: string;
};

function main() {
  const audit = JSON.parse(readFileSync(AUDIT, "utf8")) as { lessons: AuditRow[]; generatedAt: string };
  const plan = JSON.parse(readFileSync(PLAN, "utf8")) as { lessons: PlanLesson[]; generatedAt: string };
  const byId = new Map(audit.lessons.map((r) => [r.lessonId, r]));

  const BATCH_SLUGS = new Set([
    "cardiac-tamponade-nclex-rn",
    "phlebostatic-axis-nclex-rn",
    "pulmonary-embolism-nclex-rn",
    "respiratory-assessment-ngn",
    "heart-failure-nursing-priorities-hy",
    "acute-myocardial-infarction-troponin",
    "shock-recognition-fluids",
    "hypertensive-crisis-vs-urgency",
  ]);

  const rows: Array<Record<string, unknown>> = [];
  let improved = 0;
  let sumLift = 0;
  let countLift = 0;
  let movedStruct = 0;
  let movedContent = 0;
  let prodEn = 0;
  let locOnly = 0;

  for (const p of plan.lessons) {
    const after = byId.get(p.lessonId);
    if (!after) continue;
    const beforeScore = p.currentScores.overallScore;
    const afterScore = after.overallScore;
    const lift = afterScore - beforeScore;
    const inBatch = BATCH_SLUGS.has(p.slug);
    if (inBatch) {
      if (lift > 0) {
        improved += 1;
        sumLift += lift;
        countLift += 1;
      }
      if (p.currentStatus === "structurally_incomplete" && after.contentReadinessStatus !== "structurally_incomplete") {
        movedStruct += 1;
      }
      if (
        p.currentStatus !== "production_ready" &&
        after.contentReadinessStatus === "production_ready_en"
      ) {
        movedContent += 1;
      }
      if (after.contentReadinessStatus === "production_ready_en") prodEn += 1;
      if (
        after.contentReadinessStatus === "production_ready_en" &&
        after.localizationReadinessStatus === "localization_incomplete"
      ) {
        locOnly += 1;
      }
    }

    rows.push({
      lessonId: p.lessonId,
      slug: p.slug,
      pathwayId: p.pathwayId,
      inBatch2ContentPass: inBatch,
      beforeOverallScore: beforeScore,
      beforeStatus: p.currentStatus,
      afterOverallScore: afterScore,
      afterStatus: after.status,
      afterContentReadinessStatus: after.contentReadinessStatus,
      afterLocalizationReadinessStatus: after.localizationReadinessStatus,
      overallScoreLift: Math.round((afterScore - beforeScore) * 10) / 10,
      publicCompleteAfter: after.evidence?.publicComplete ?? null,
      totalWordsAfter: after.evidence?.totalWords ?? null,
      topReasonsAfter: after.reasons?.slice(0, 6) ?? [],
    });
  }

  const avgLift = countLift > 0 ? Math.round((sumLift / countLift) * 10) / 10 : 0;

  const summary = {
    generatedAt: new Date().toISOString(),
    auditGeneratedAt: audit.generatedAt,
    planGeneratedAt: plan.generatedAt,
    batchContentSlugsCompleted: [...BATCH_SLUGS],
    metricsForBatchSlugRowsInPlan: {
      planRowsMatchingBatchSlugs: plan.lessons.filter((l) => BATCH_SLUGS.has(l.slug)).length,
      improvedOverallScoreCount: improved,
      averageOverallScoreLiftAmongImproved: avgLift,
      movedOutOfStructurallyIncompleteGateApprox: movedStruct,
      movedToProductionReadyEn: prodEn,
      productionReadyEnButLocalizationIncomplete: locOnly,
    },
    notes:
      "Before scores taken from lesson-fix-batch-2-plan.json (queue snapshot). Full batch has 100 plan rows; 8 unique slugs received catalog patches in this pass.",
  };

  mkdirSync(dirname(OUT_IMPACT), { recursive: true });
  writeFileSync(OUT_IMPACT, `${JSON.stringify({ ...summary, lessons: rows }, null, 2)}\n`, "utf8");
  writeFileSync(OUT_REPORT, `${JSON.stringify({ ...summary, perLesson: rows.filter((r) => r.inBatch2ContentPass) }, null, 2)}\n`, "utf8");

  const md = `# Lesson fix batch 2 — impact summary

- **Audit generated:** ${audit.generatedAt}
- **Plan baseline:** ${plan.generatedAt}
- **Catalog slugs patched this pass:** ${BATCH_SLUGS.size} (${[...BATCH_SLUGS].join(", ")})
- **Plan rows touching those slugs:** ${plan.lessons.filter((l) => BATCH_SLUGS.has(l.slug)).length}
- **Rows with improved overallScore (batch slugs):** ${improved}
- **Average overallScore lift (among improved batch rows):** ${avgLift}
- **Rows reaching production_ready_en (batch slugs):** ${prodEn}
- **Of those, blocked only by localization overlay backlog:** ${locOnly} (English spine complete per contentReadinessStatus)

## Recurring fix pattern

- **Legacy five-block depth + structured vignette + internal LESSON links** to pass subscriber gate and educational buckets.
- **Merged intro/core/exam_tips lessons:** expand **exam_tips** so sentence-split yields strong **exam_relevance** + **takeaways** (summary bucket).

## Remaining work

- **~87 unique slugs** in the batch-2 queue still need the same editorial pass (see plan file).
- **relatedLessonRefs:** some HY rows still show 0 metadata refs; consider adding hub mapping where product SEO expects it.

See \`lesson-completion-factory-notes.md\` for the repeatable workflow.
`;
  writeFileSync(OUT_MD, md, "utf8");
  console.log("Wrote", OUT_IMPACT, OUT_REPORT, OUT_MD);
}

main();
