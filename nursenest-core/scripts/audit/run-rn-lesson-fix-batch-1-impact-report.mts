/**
 * RN batch 1 impact: compares rn-lesson-fix-batch-1-plan.json baseline to lesson-completeness-audit.json.
 * Patched slugs = keys of RN_BATCH1_MERGED_CATALOG_PATCHES.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/run-lesson-completeness-audit.mts && npx tsx scripts/audit/run-rn-lesson-fix-batch-1-impact-report.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { RN_BATCH1_MERGED_CATALOG_PATCHES } from "./rn-batch1-catalog-patches";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const AUDIT = join(REPO, "data/audit/lesson-completeness-audit.json");
const PLAN = join(REPO, "data/audit/rn-lesson-fix-batch-1-plan.json");
const OUT_IMPACT = join(REPO, "data/audit/rn-lesson-fix-batch-1-impact.json");
const OUT_REPORT = join(REPO, "data/audit/rn-lesson-fix-batch-1-report.json");
const OUT_MD = join(REPO, "data/audit/rn-lesson-fix-batch-1-impact-summary.md");

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
    internalStudyLinkCount?: number;
  };
};

type PlanLesson = {
  lessonId: string;
  slug: string;
  pathwayId: string;
  title: string;
  currentScores: { overallScore: number };
  currentStatus: string;
  contentReadinessStatus?: string;
  topFailureReasons: string[];
};

const BATCH_SLUGS = new Set(Object.keys(RN_BATCH1_MERGED_CATALOG_PATCHES));

function structuralResolved(before: string, after: string): string[] {
  const out: string[] = [];
  if (before === "structurally_incomplete" && after !== "structurally_incomplete") {
    out.push("subscriber_legacy_section_depth_and_vignette_gate_cleared");
  }
  if (before.includes("incomplete") && after === "production_ready_en") {
    out.push("english_content_spine_production_ready_en");
  }
  return out;
}

function educationalNotes(beforeReasons: string[], after: AuditRow): string[] {
  const out: string[] = [];
  const had = new Set(beforeReasons.map((r) => r.toLowerCase()));
  if (had.has("links:no_internal_study_links") && (after.evidence?.internalStudyLinkCount ?? 0) >= 3) {
    out.push("internal_study_links_added_meeting_minimum");
  }
  if (beforeReasons.some((r) => r.includes("Legacy section")) && after.contentReadinessStatus === "production_ready_en") {
    out.push("legacy_five_block_depth_and_educational_buckets_strengthened");
  }
  return out;
}

function main() {
  const audit = JSON.parse(readFileSync(AUDIT, "utf8")) as { lessons: AuditRow[]; generatedAt: string };
  const plan = JSON.parse(readFileSync(PLAN, "utf8")) as { lessons: PlanLesson[]; generatedAt: string };
  const byId = new Map(audit.lessons.map((r) => [r.lessonId, r]));

  let improved = 0;
  let sumLift = 0;
  let countLift = 0;
  let movedStruct = 0;
  let movedContent = 0;
  let prodEn = 0;
  let locOnly = 0;

  const perLesson: Array<Record<string, unknown>> = [];

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
        (p.contentReadinessStatus === "content_incomplete" || p.currentStatus === "content_incomplete") &&
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

    const row = {
      lessonId: p.lessonId,
      slug: p.slug,
      pathwayId: p.pathwayId,
      title: p.title,
      inRnBatch1CatalogPass: inBatch,
      beforeOverallScore: beforeScore,
      beforeStatus: p.currentStatus,
      beforeContentReadinessStatus: p.contentReadinessStatus ?? null,
      afterOverallScore: afterScore,
      afterStatus: after.status,
      afterContentReadinessStatus: after.contentReadinessStatus,
      afterLocalizationReadinessStatus: after.localizationReadinessStatus,
      overallScoreLift: Math.round((afterScore - beforeScore) * 10) / 10,
      publicCompleteAfter: after.evidence?.publicComplete ?? null,
      totalWordsAfter: after.evidence?.totalWords ?? null,
      internalStudyLinksAfter: after.evidence?.internalStudyLinkCount ?? null,
      topReasonsAfter: after.reasons?.slice(0, 8) ?? [],
      structuralIssuesResolved: inBatch ? structuralResolved(p.currentStatus, after.contentReadinessStatus) : [],
      educationalImprovements: inBatch ? educationalNotes(p.topFailureReasons ?? [], after) : [],
      linkImprovements: inBatch
        ? (p.topFailureReasons?.some((r) => r.includes("internal")) ? ["internal_LESSON_or_path_links_added_where_missing"] : [])
        : [],
      remainingIssues: after.reasons?.filter((r) => !r.includes("no_educational_overlay")) ?? [],
      gatePublicCompleteAfter: after.evidence?.publicComplete ?? null,
    };
    perLesson.push(row);
  }

  const avgLift = countLift > 0 ? Math.round((sumLift / countLift) * 10) / 10 : 0;
  const planRowsInBatch = plan.lessons.filter((l) => BATCH_SLUGS.has(l.slug));

  const summary = {
    generatedAt: new Date().toISOString(),
    auditGeneratedAt: audit.generatedAt,
    planGeneratedAt: plan.generatedAt,
    rnCatalogPatchSlugs: [...BATCH_SLUGS],
    metricsForPlanRowsWithPatchedSlugs: {
      planRowsMatchingPatchedSlugs: planRowsInBatch.length,
      improvedOverallScoreCount: improved,
      averageOverallScoreLiftAmongImproved: avgLift,
      movedOutOfStructurallyIncompleteApprox: movedStruct,
      movedToProductionReadyEnFromContentGapsApprox: movedContent,
      productionReadyEnCountAmongPatchedRows: prodEn,
      productionReadyEnButLocalizationIncomplete: locOnly,
    },
    notes: `Merged RN batch 1 patches include prior batch-2 slugs plus RN_BATCH1_EXTRA. Plan has ${plan.lessons.length} rows; ${BATCH_SLUGS.size} unique slugs in merged patch map.`,
  };

  mkdirSync(dirname(OUT_IMPACT), { recursive: true });
  writeFileSync(OUT_IMPACT, `${JSON.stringify({ ...summary, lessons: perLesson }, null, 2)}\n`, "utf8");
  writeFileSync(
    OUT_REPORT,
    `${JSON.stringify({ ...summary, perLesson: perLesson.filter((r) => r.inRnBatch1CatalogPass) }, null, 2)}\n`,
    "utf8",
  );

  const md = `# RN lesson fix batch 1 — impact summary

- **Audit generated:** ${audit.generatedAt}
- **Plan baseline:** ${plan.generatedAt}
- **Unique slugs in merged RN catalog patches:** ${BATCH_SLUGS.size}
- **Plan rows whose slug is patched:** ${planRowsInBatch.length}
- **Rows with improved overallScore (patched slugs):** ${improved}
- **Average overallScore lift (among improved patched rows):** ${avgLift}
- **Rows moving off structurally_incomplete (approx, patched rows):** ${movedStruct}
- **Rows reaching production_ready_en (patched rows):** ${prodEn}
- **Of those, mainly blocked by localization overlay:** ${locOnly}

## Quality gate

- Patched plan rows should show **production_ready_en** when English spine + educational + link thresholds pass.
- **no_educational_overlay_in_scanned_locales** may remain without failing EN spine.

## Next

- Continue **RN-only** patches for remaining slugs in \`rn-lesson-fix-batch-1-plan.json\` not yet in the merged patch map.
- See \`rn-lesson-finishing-roadmap.md\` for batch sequencing.
`;
  writeFileSync(OUT_MD, md, "utf8");
  console.log("Wrote", OUT_IMPACT, OUT_REPORT, OUT_MD);
}

main();
