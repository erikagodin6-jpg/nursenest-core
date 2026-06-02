/**
 * NP batch 1 impact: compares np-lesson-fix-batch-1-plan.json baseline to lesson-completeness-audit.json.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/run-lesson-completeness-audit.mts && npx tsx scripts/audit/run-np-lesson-fix-batch-1-impact-report.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const AUDIT = join(REPO, "data/audit/lesson-completeness-audit.json");
const PLAN = join(REPO, "data/audit/np-lesson-fix-batch-1-plan.json");
const OUT_IMPACT = join(REPO, "data/audit/np-lesson-fix-batch-1-impact.json");
const OUT_REPORT = join(REPO, "data/audit/np-lesson-fix-batch-1-report.json");
const OUT_MD = join(REPO, "data/audit/np-lesson-fix-batch-1-impact-summary.md");

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

function structuralResolved(before: string, after: string): string[] {
  const out: string[] = [];
  if (before === "structurally_incomplete" && after !== "structurally_incomplete") {
    out.push("subscriber_or_premium_structural_gate_cleared");
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
    out.push("internal_study_links_meeting_minimum");
  }
  if (beforeReasons.some((r) => r.includes("Legacy section") || r.includes("premium"))) {
    out.push("catalog_or_gold_spine_strengthened");
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
  let thinEn = 0;

  const perLesson: Array<Record<string, unknown>> = [];

  for (const p of plan.lessons) {
    const after = byId.get(p.lessonId);
    if (!after) continue;
    const beforeScore = p.currentScores.overallScore;
    const afterScore = after.overallScore;
    const lift = afterScore - beforeScore;

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
    if (after.contentReadinessStatus === "usable_but_thin_en") thinEn += 1;
    if (
      after.contentReadinessStatus === "production_ready_en" &&
      after.localizationReadinessStatus === "localization_incomplete"
    ) {
      locOnly += 1;
    }

    const row = {
      lessonId: p.lessonId,
      slug: p.slug,
      pathwayId: p.pathwayId,
      title: p.title,
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
      structuralIssuesResolved: structuralResolved(p.currentStatus, after.contentReadinessStatus),
      educationalImprovements: educationalNotes(p.topFailureReasons ?? [], after),
      linkImprovements:
        p.topFailureReasons?.some((r) => r.includes("internal") || r.includes("links:")) &&
        (after.evidence?.internalStudyLinkCount ?? 0) >= 3
          ? ["internal_links_threshold_met"]
          : [],
      remainingIssues: after.reasons?.filter((r) => !r.includes("no_educational_overlay")) ?? [],
      gatePublicCompleteAfter: after.evidence?.publicComplete ?? null,
    };
    perLesson.push(row);
  }

  const avgLift = countLift > 0 ? Math.round((sumLift / countLift) * 10) / 10 : 0;

  const summary = {
    generatedAt: new Date().toISOString(),
    auditGeneratedAt: audit.generatedAt,
    planGeneratedAt: plan.generatedAt,
    batchPathway: "us-np-fnp",
    metrics: {
      planLessonRows: plan.lessons.length,
      improvedOverallScoreCount: improved,
      averageOverallScoreLiftAmongImproved: avgLift,
      movedOutOfStructurallyIncompleteApprox: movedStruct,
      movedToProductionReadyEnFromContentGapsApprox: movedContent,
      productionReadyEnCount: prodEn,
      usableButThinEnCount: thinEn,
      productionReadyEnButLocalizationIncomplete: locOnly,
      publicCompleteCount: perLesson.filter((r) => r.publicCompleteAfter).length,
    },
    notes:
      "Catalog: legacy five-block NP depth for FNP batch slugs + PAD integrated reviews; scoped-gold: gold-premium-synthesis intro/labs/links + trimmed np-primary-care-foundations / np-heart-failure gold variants. Canada NP (ca-np-cnple) has no bundled lessons in catalog yet—batch is US FNP production content.",
  };

  mkdirSync(dirname(OUT_IMPACT), { recursive: true });
  writeFileSync(OUT_IMPACT, `${JSON.stringify({ ...summary, lessons: perLesson }, null, 2)}\n`, "utf8");
  writeFileSync(OUT_REPORT, `${JSON.stringify({ ...summary, perLesson }, null, 2)}\n`, "utf8");

  const md = `# NP lesson fix batch 1 — impact summary

- **Audit generated:** ${audit.generatedAt}
- **Plan baseline:** ${plan.generatedAt}
- **Plan rows:** ${plan.lessons.length}
- **Rows with improved overallScore:** ${improved}
- **Average overallScore lift (among improved):** ${avgLift}
- **Approx. rows moving off structurally_incomplete:** ${movedStruct}
- **production_ready_en:** ${prodEn}
- **usable_but_thin_en:** ${thinEn}
- **publicComplete:** ${summary.metrics.publicCompleteCount}
- **production_ready_en but localization backlog:** ${locOnly}

## Quality gate

- **no_educational_overlay_in_scanned_locales** may remain without failing the English spine.
- **usable_but_thin_en** lessons may need a second editorial pass for depth or link balance.

## Scope note

- **US FNP** bundled catalog + **scoped gold** injections cover this batch. **Canadian NP** bundled lessons are not yet present in \`catalog.json\`; inventory reflects **ca-np-cnple** as registry-only until content ships.

`;
  writeFileSync(OUT_MD, md, "utf8");
  console.log("Wrote", OUT_IMPACT, OUT_REPORT, OUT_MD);
}

main();
