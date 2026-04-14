/**
 * Compare lesson completeness audit before (git HEAD baseline) vs after (current audit).
 * Writes impact JSON, summary MD, and batch-2 candidate queue. Does not modify catalog content.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/measure-lesson-fix-batch-1-impact.mts
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ExamFamily, TierCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");

const BASELINE_REF = process.env.LESSON_AUDIT_BASELINE_REF ?? "HEAD";
const AFTER_AUDIT_PATH = join(REPO_ROOT, "data", "audit", "lesson-completeness-audit.json");
const BATCH1_REPORT_PATH = join(REPO_ROOT, "data", "audit", "lesson-fix-batch-1-report.json");
const IMPACT_JSON_PATH = join(REPO_ROOT, "data", "audit", "lesson-fix-batch-1-impact.json");
const IMPACT_MD_PATH = join(REPO_ROOT, "data", "audit", "lesson-fix-batch-1-impact-summary.md");
const BATCH2_PATH = join(REPO_ROOT, "data", "audit", "lesson-fix-batch-2-candidates.json");

type AuditFile = {
  generatedAt: string;
  lessons: LessonRow[];
};

type LessonRow = {
  lessonId: string;
  pathwayId: string;
  slug: string;
  title?: string;
  routable?: boolean;
  structuralScore: number;
  educationalScore: number;
  linkScore: number;
  localizationScore: number;
  overallScore: number;
  status: string;
  reasons: string[];
};

type Batch1Report = {
  generatedAt: string;
  lessonsFixed: number;
  results: { lessonId: string; pathwayId: string; slug: string; outcome: string }[];
};

function isAlliedPathway(p: { stripeTier?: TierCode; examFamily?: ExamFamily } | undefined): boolean {
  return p?.stripeTier === TierCode.ALLIED || p?.examFamily === ExamFamily.ALLIED;
}

function loadBaselineFromGit(): AuditFile {
  const gitPath = "data/audit/lesson-completeness-audit.json";
  const r = spawnSync("git", ["show", `${BASELINE_REF}:${gitPath}`], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0 || !r.stdout) {
    throw new Error(
      `Could not read baseline audit from git ${BASELINE_REF}:${gitPath}: ${r.stderr || r.error?.message || "unknown"}`,
    );
  }
  return JSON.parse(r.stdout) as AuditFile;
}

function readAfterAudit(): AuditFile {
  return JSON.parse(readFileSync(AFTER_AUDIT_PATH, "utf8")) as AuditFile;
}

function indexByLessonId(rows: LessonRow[]): Map<string, LessonRow> {
  const m = new Map<string, LessonRow>();
  for (const r of rows) m.set(r.lessonId, r);
  return m;
}

function reasonDiff(before: string[], after: string[]) {
  const b = new Set(before);
  const a = new Set(after);
  const removed = [...b].filter((x) => !a.has(x));
  const added = [...a].filter((x) => !b.has(x));
  const stillRemaining = [...a].filter((x) => b.has(x));
  return { removed, added, stillRemaining };
}

function buildPrioritySort(
  rows: LessonRow[],
): (a: LessonRow, b: LessonRow) => number {
  const byPathway = new Map<string, LessonRow[]>();
  for (const r of rows) {
    const list = byPathway.get(r.pathwayId) ?? [];
    list.push(r);
    byPathway.set(r.pathwayId, list);
  }
  return (a, b) => {
    const pa = getExamPathwayById(a.pathwayId);
    const pb = getExamPathwayById(b.pathwayId);
    const aAllied = pa ? isAlliedPathway(pa) : false;
    const bAllied = pb ? isAlliedPathway(pb) : false;
    if (aAllied !== bAllied) return aAllied ? 1 : -1;
    const va = byPathway.get(a.pathwayId)?.length ?? 0;
    const vb = byPathway.get(b.pathwayId)?.length ?? 0;
    if (vb !== va) return vb - va;
    if (a.routable !== b.routable) return a.routable ? -1 : 1;
    return a.overallScore - b.overallScore;
  };
}

function main() {
  const baseline = loadBaselineFromGit();
  const after = readAfterAudit();
  const batch1: Batch1Report = JSON.parse(readFileSync(BATCH1_REPORT_PATH, "utf8"));

  const beforeMap = indexByLessonId(baseline.lessons);
  const afterMap = indexByLessonId(after.lessons);

  const batch1Ids = new Set(batch1.results.map((r) => r.lessonId));
  const batch1ReportMeta = {
    lessonsFixedField: batch1.lessonsFixed,
    resultRows: batch1.results.length,
    uniqueLessonIds: batch1Ids.size,
    note:
      batch1.results.length !== batch1.lessonsFixed || batch1Ids.size !== batch1.lessonsFixed
        ? "Batch-1 report row count / unique IDs differ from lessonsFixed; comparisons use all unique lessonIds in results."
        : undefined,
  };

  type RowImpact = {
    lessonId: string;
    pathwayId: string;
    slug: string;
    baselineFound: boolean;
    afterFound: boolean;
    structuralScore: { before: number | null; after: number | null; delta: number | null };
    educationalScore: { before: number | null; after: number | null; delta: number | null };
    linkScore: { before: number | null; after: number | null; delta: number | null };
    localizationScore: { before: number | null; after: number | null; delta: number | null };
    overallScore: { before: number | null; after: number | null; delta: number | null };
    status: { before: string | null; after: string | null; changed: boolean };
    reasons: {
      before: string[];
      after: string[];
      removed: string[];
      added: string[];
      stillRemaining: string[];
    };
  };

  const comparisons: RowImpact[] = [];
  let improvedOverall = 0;
  let regressedOverall = 0;
  let unchangedOverall = 0;
  let statusChanged = 0;
  let nowProductionReady = 0;
  let stillThinOrIncomplete = 0;
  const overallDeltas: number[] = [];

  for (const lessonId of batch1Ids) {
    const b = beforeMap.get(lessonId);
    const a = afterMap.get(lessonId);
    const diff = reasonDiff(b?.reasons ?? [], a?.reasons ?? []);

    const oa = a?.overallScore ?? null;
    const ob = b?.overallScore ?? null;
    let delta: number | null = null;
    if (oa != null && ob != null) {
      delta = Math.round((oa - ob) * 10) / 10;
      overallDeltas.push(delta);
      if (delta > 0) improvedOverall += 1;
      else if (delta < 0) regressedOverall += 1;
      else unchangedOverall += 1;
    }

    const statusBefore = b?.status ?? null;
    const statusAfter = a?.status ?? null;
    if (statusBefore !== statusAfter) statusChanged += 1;
    if (statusAfter === "production_ready") nowProductionReady += 1;
    if (
      statusAfter === "usable_but_thin" ||
      statusAfter === "structurally_incomplete" ||
      statusAfter === "content_incomplete" ||
      statusAfter === "localization_incomplete"
    ) {
      stillThinOrIncomplete += 1;
    }

    comparisons.push({
      lessonId,
      pathwayId: b?.pathwayId ?? a?.pathwayId ?? "",
      slug: b?.slug ?? a?.slug ?? "",
      baselineFound: !!b,
      afterFound: !!a,
      structuralScore: {
        before: b?.structuralScore ?? null,
        after: a?.structuralScore ?? null,
        delta:
          b?.structuralScore != null && a?.structuralScore != null
            ? a.structuralScore - b.structuralScore
            : null,
      },
      educationalScore: {
        before: b?.educationalScore ?? null,
        after: a?.educationalScore ?? null,
        delta:
          b?.educationalScore != null && a?.educationalScore != null
            ? a.educationalScore - b.educationalScore
            : null,
      },
      linkScore: {
        before: b?.linkScore ?? null,
        after: a?.linkScore ?? null,
        delta: b?.linkScore != null && a?.linkScore != null ? a.linkScore - b.linkScore : null,
      },
      localizationScore: {
        before: b?.localizationScore ?? null,
        after: a?.localizationScore ?? null,
        delta:
          b?.localizationScore != null && a?.localizationScore != null
            ? a.localizationScore - b.localizationScore
            : null,
      },
      overallScore: { before: ob, after: oa, delta },
      status: {
        before: statusBefore,
        after: statusAfter,
        changed: statusBefore !== statusAfter,
      },
      reasons: {
        before: b?.reasons ?? [],
        after: a?.reasons ?? [],
        removed: diff.removed,
        added: diff.added,
        stillRemaining: diff.stillRemaining,
      },
    });
  }

  const avgLift =
    overallDeltas.length > 0
      ? Math.round((overallDeltas.reduce((x, y) => x + y, 0) / overallDeltas.length) * 100) / 100
      : null;

  const reasonHistAfter = new Map<string, number>();
  for (const c of comparisons) {
    for (const r of c.reasons.after.slice(0, 12)) {
      reasonHistAfter.set(r, (reasonHistAfter.get(r) ?? 0) + 1);
    }
  }
  const topRemainingReasons = [...reasonHistAfter.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, 20)
    .map(([reason, count]) => ({ reason, count }));

  const summaryJson = {
    generatedAt: new Date().toISOString(),
    baseline: {
      ref: BASELINE_REF,
      auditGeneratedAt: baseline.generatedAt,
      source: `git show ${BASELINE_REF}:data/audit/lesson-completeness-audit.json`,
    },
    after: {
      auditGeneratedAt: after.generatedAt,
      path: "data/audit/lesson-completeness-audit.json",
    },
    batch1Report: {
      path: "data/audit/lesson-fix-batch-1-report.json",
      lessonCount: batch1Ids.size,
    },
    aggregate: {
      lessonsCompared: comparisons.length,
      improvedOverallScore: improvedOverall,
      regressedOverallScore: regressedOverall,
      unchangedOverallScore: unchangedOverall,
      averageOverallScoreLift: avgLift,
      statusClassChanged: statusChanged,
      nowProductionReady,
      stillThinOrIncompleteOrOtherNonReady: stillThinOrIncomplete,
      note:
        "production_ready threshold may be strict in current scoring; see lesson-completeness-summary.json methodology.",
    },
    topRemainingReasonsAfterBatch1: topRemainingReasons,
    thresholdRecommendation: {
      suggestion:
        "Keep thresholds as-is until batch-2 completes and overlay/localization work is scoped; batch-1 lifted educational/structural/link signals but duplicate_or_unclear_source and no_educational_overlay often remain systemic.",
      rationale:
        "Adjusting thresholds now would mask remaining content and i18n gaps; prefer targeted batch fixes + overlay keys before relaxing gates.",
    },
    comparisons: comparisons.sort((a, b) => (b.overallScore.delta ?? -999) - (a.overallScore.delta ?? -999)),
  };

  writeFileSync(IMPACT_JSON_PATH, JSON.stringify(summaryJson, null, 2));

  // Batch-2: same sort as audit priority queue, exclude batch-1 ids, non-production-ready, first 100
  const sortFn = buildPrioritySort(after.lessons);
  const batch2Raw = [...after.lessons].sort(sortFn).filter((r) => r.status !== "production_ready");
  const batch2Candidates = batch2Raw.filter((r) => !batch1Ids.has(r.lessonId)).slice(0, 100);

  writeFileSync(
    BATCH2_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        selection:
          "Post-batch-1 audit rows; same ordering as lesson-completeness-priority-queue (nursing before allied, larger pathways, routable preferred, lowest overallScore); excludes batch-1 lessonIds and production_ready lessons.",
        batch1LessonIdsExcluded: batch1Ids.size,
        candidates: batch2Candidates.map((r) => ({
          lessonId: r.lessonId,
          pathwayId: r.pathwayId,
          slug: r.slug,
          title: r.title,
          routable: r.routable,
          status: r.status,
          overallScore: r.overallScore,
          reasons: r.reasons.slice(0, 8),
        })),
      },
      null,
      2,
    ),
  );

  const md: string[] = [];
  md.push(`# Lesson fix batch 1 — impact summary`);
  md.push(``);
  md.push(`Generated: ${summaryJson.generatedAt}`);
  md.push(``);
  md.push(`## Baseline vs after`);
  md.push(
    `- **Baseline audit**: \`${summaryJson.baseline.source}\` (generated ${summaryJson.baseline.auditGeneratedAt})`,
  );
  md.push(`- **After audit**: \`${summaryJson.after.path}\` (generated ${summaryJson.after.auditGeneratedAt})`);
  md.push(`- **Batch 1 lessons compared**: ${summaryJson.aggregate.lessonsCompared}`);
  md.push(``);
  md.push(`## Score movement (overall)`);
  md.push(`- Improved: **${summaryJson.aggregate.improvedOverallScore}**`);
  md.push(`- Regressed: **${summaryJson.aggregate.regressedOverallScore}**`);
  md.push(`- Unchanged: **${summaryJson.aggregate.unchangedOverallScore}**`);
  md.push(`- Average overall score lift: **${avgLift ?? "n/a"}** points`);
  md.push(``);
  md.push(`## Status`);
  md.push(`- Status class changed: **${summaryJson.aggregate.statusClassChanged}** lessons`);
  md.push(`- Now \`production_ready\`: **${summaryJson.aggregate.nowProductionReady}**`);
  md.push(
    `- Still thin/incomplete (usable_but_thin, structurally_incomplete, content_incomplete, localization_incomplete): **${summaryJson.aggregate.stillThinOrIncompleteOrOtherNonReady}**`,
  );
  md.push(``);
  md.push(`> ${summaryJson.aggregate.note}`);
  md.push(``);
  md.push(`## Top reasons remaining after batch 1 (among the 100 fixed lessons)`);
  for (const x of topRemainingReasons) {
    md.push(`- ${x.reason}: **${x.count}**`);
  }
  md.push(``);
  md.push(`## Threshold recommendation`);
  md.push(`- **Suggestion**: ${summaryJson.thresholdRecommendation.suggestion}`);
  md.push(`- **Rationale**: ${summaryJson.thresholdRecommendation.rationale}`);
  md.push(``);
  md.push(`## Batch 2 candidates`);
  md.push(
    `- Next **${batch2Candidates.length}** lessons: \`data/audit/lesson-fix-batch-2-candidates.json\` (excludes batch-1 IDs and \`production_ready\` rows).`,
  );
  md.push(``);
  md.push(`## Full per-lesson table`);
  md.push(`See \`data/audit/lesson-fix-batch-1-impact.json\` → \`comparisons\`.`);

  writeFileSync(IMPACT_MD_PATH, md.join("\n"));

  console.log(`Wrote ${IMPACT_JSON_PATH}`);
  console.log(`Wrote ${IMPACT_MD_PATH}`);
  console.log(`Wrote ${BATCH2_PATH}`);
  console.log(
    `Aggregate: improved=${improvedOverall} regressed=${regressedOverall} avgLift=${avgLift} statusChanged=${statusChanged} production_ready_now=${nowProductionReady}`,
  );
}

main();
