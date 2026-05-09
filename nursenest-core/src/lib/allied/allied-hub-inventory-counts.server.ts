import "server-only";

import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";
import { alliedMasteryModulesForProfession } from "@/lib/allied/allied-mastery-modules";
import { prismaWhereForAlliedProfessionExamQuestions } from "@/lib/allied/allied-exam-question-scope";
import { ALLIED_GLOBAL_PATHWAY_IDS } from "@/lib/allied/allied-global-pathway";
import {
  US_ALLIED_CORE_PATHWAY_ID,
  ALLIED_MINIMUM_CONTENT_PER_OCCUPATION,
  alliedPremiumModuleMatrixForOccupation,
  type AlliedPremiumModuleMatrix,
} from "@/lib/allied/allied-hub-program-model";
import { alliedHubCatSurfaceUnlocked } from "@/lib/marketing/allied-hub-premium-module-policy";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingHubInventoryWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";

const COUNT_TIMEOUT_MS = 10_000;
const INVENTORY_LOG_SCOPE = "allied_hub_inventory";

export type AlliedMetricCell =
  | { kind: "count"; n: number }
  | { kind: "unavailable"; reason: string };

function cellCount(n: number): AlliedMetricCell {
  return { kind: "count", n };
}

function cellUnavailable(reason: string): AlliedMetricCell {
  return { kind: "unavailable", reason };
}

function formatCell(c: AlliedMetricCell): string {
  if (c.kind === "count") return String(c.n);
  return `unavailable (${c.reason})`;
}

async function safeCount(
  label: string,
  run: () => Promise<number>,
  unavailableReason: string,
): Promise<AlliedMetricCell> {
  if (!isDatabaseUrlConfigured()) {
    return cellUnavailable("DATABASE_URL not set");
  }
  const n = await withDatabaseFallbackTimeout(run, -1, COUNT_TIMEOUT_MS, {
    scope: INVENTORY_LOG_SCOPE,
    label,
  });
  if (n < 0) return cellUnavailable("query timeout or DB error");
  return cellCount(n);
}

function pathwayLessonWherePublished(profession: AlliedProfessionMarketing): Prisma.PathwayLessonWhereInput {
  const topicSlugs = profession.topicSlugsIn?.filter(Boolean) ?? [];
  const or: Prisma.PathwayLessonWhereInput[] = [{ alliedProfessionKey: profession.professionKey }];
  if (topicSlugs.length > 0) {
    or.push({ pathwayId: profession.pathwayId, topicSlug: { in: topicSlugs } });
  }
  return {
    status: ContentStatus.PUBLISHED,
    OR: or,
  };
}

function examQuestionBaseWhere(): Prisma.ExamQuestionWhereInput | null {
  const pathway = getExamPathwayById(US_ALLIED_CORE_PATHWAY_ID);
  if (!pathway) return null;
  return pathwayExamQuestionMarketingHubInventoryWhere(pathway);
}

function professionExamPoolWhere(professionKey: string): Prisma.ExamQuestionWhereInput | null {
  const base = examQuestionBaseWhere();
  if (!base) return null;
  const prof = prismaWhereForAlliedProfessionExamQuestions(US_ALLIED_CORE_PATHWAY_ID, professionKey);
  if (!prof) return null;
  return { AND: [base, prof] };
}

/** Registry skill-refresher scaffold count (static; not a DB publish audit). */
export function alliedSkillRefresherRegistryCount(professionKey: string): number {
  return alliedMasteryModulesForProfession(professionKey).length;
}

export type AlliedOccupationInventoryRow = {
  professionKey: string;
  lessonsPublished: AlliedMetricCell;
  flashcardsPublished: AlliedMetricCell;
  practiceQuestionsPublished: AlliedMetricCell;
  catAdaptiveEligiblePublished: AlliedMetricCell;
  scenarioCaseQuestionsPublished: AlliedMetricCell;
  labDiagnosticTaggedPublished: AlliedMetricCell;
  medCalcTaggedPublished: AlliedMetricCell;
  skillsRefresherRegistry: AlliedMetricCell;
  practiceExamsOrSets: AlliedMetricCell;
  readinessSurface: AlliedPremiumModuleMatrix;
  /** Progress + exam plan tiles; weak/strong not present on allied marketing grid. */
  weakStrongSurfacePresent: boolean;
};

export async function loadAlliedOccupationInventoryRows(
  professions: AlliedProfessionMarketing[],
): Promise<AlliedOccupationInventoryRow[]> {
  const pathway = getExamPathwayById(US_ALLIED_CORE_PATHWAY_ID);
  if (!pathway) throw new Error(`Missing pathway ${US_ALLIED_CORE_PATHWAY_ID}`);

  const rows: AlliedOccupationInventoryRow[] = [];

  for (const p of professions) {
    const pool = professionExamPoolWhere(p.professionKey);

    const lessonsPublished = await safeCount(
      `lessons:${p.professionKey}`,
      () => prisma.pathwayLesson.count({ where: pathwayLessonWherePublished(p) }),
      "lessons count failed",
    );

    const flashPublished = await safeCount(
      `flashcards_tag_or_exam:${p.professionKey}`,
      async () => {
        const byDeckTag = await prisma.flashcard.count({
          where: {
            status: ContentStatus.PUBLISHED,
            tier: "ALLIED",
            deck: {
              pathwayId: { in: [...ALLIED_GLOBAL_PATHWAY_IDS] },
              tags: { some: { tag: { slug: p.professionKey } } },
            },
          },
        });
        if (!pool) return byDeckTag;
        const byExam = await prisma.flashcard.count({
          where: {
            status: ContentStatus.PUBLISHED,
            tier: "ALLIED",
            examQuestion: { is: pool },
          },
        });
        return byDeckTag + byExam;
      },
      "flashcard count failed",
    );

    const practiceQuestionsPublished = pool
      ? await safeCount(`practice_q:${p.professionKey}`, () =>
          prisma.examQuestion.count({
            where: { ...pool, status: "published" },
          }),
        )
      : cellUnavailable(
          "no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation",
        );

    const catAdaptiveEligiblePublished = !alliedHubCatSurfaceUnlocked(p.professionKey)
      ? cellUnavailable(
          "CAT marketing surface locked on hub — adaptive pool not evaluated for this occupation in marketing QA",
        )
      : !pool
        ? cellUnavailable(
            "no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation",
          )
        : await safeCount(`cat_adaptive:${p.professionKey}`, () =>
            prisma.examQuestion.count({
              where: { ...pool, status: "published", isAdaptiveEligible: true },
            }),
          );

    const scenarioCaseQuestionsPublished = pool
      ? await safeCount(`scenario_q:${p.professionKey}`, () =>
          prisma.examQuestion.count({
            where: { ...pool, status: "published", isScenario: true },
          }),
        )
      : cellUnavailable("no attributable exam-question scope for scenarios");

    const labDiagnosticTaggedPublished = pool
      ? await safeCount(`lab_tagged:${p.professionKey}`, () =>
          prisma.examQuestion.count({
            where: {
              ...pool,
              status: "published",
              OR: [
                { tags: { has: "lab-values" } },
                { tags: { has: "lab-interpretation" } },
                { tags: { has: "lab-drills-only" } },
              ],
            },
          }),
        )
      : cellUnavailable("no attributable exam-question scope for lab/diagnostic tags");

    const medCalcTaggedPublished = pool
      ? await safeCount(`medcalc_tagged:${p.professionKey}`, () =>
          prisma.examQuestion.count({
            where: {
              ...pool,
              status: "published",
              tags: { has: "med-calculations-only" },
            },
          }),
        )
      : cellUnavailable("no attributable exam-question scope for med-calc tags");

    const nSkills = alliedSkillRefresherRegistryCount(p.professionKey);
    const skillsRefresherRegistry = cellCount(nSkills);

    const practiceExamsOrSets = cellUnavailable(
      "no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory",
    );

    const readinessSurface = alliedPremiumModuleMatrixForOccupation(pathway, p.professionKey, {
      clinicalScenariosPublic: false,
      oscePublic: true,
    });

    rows.push({
      professionKey: p.professionKey,
      lessonsPublished,
      flashcardsPublished: flashPublished,
      practiceQuestionsPublished,
      catAdaptiveEligiblePublished,
      scenarioCaseQuestionsPublished,
      labDiagnosticTaggedPublished,
      medCalcTaggedPublished,
      skillsRefresherRegistry,
      practiceExamsOrSets,
      readinessSurface,
      weakStrongSurfacePresent: false,
    });
  }

  return rows;
}

function cmpMinimum(meets: boolean): string {
  return meets ? "meets" : "below";
}

/**
 * Markdown fragment: bounded DB inventory + compliance vs {@link ALLIED_MINIMUM_CONTENT_PER_OCCUPATION}.
 */
export function formatAlliedHubInventoryMarkdown(rows: AlliedOccupationInventoryRow[]): string {
  const min = ALLIED_MINIMUM_CONTENT_PER_OCCUPATION;
  const lines: string[] = [];

  lines.push("## Part 3 — Bounded inventory (DB-backed, per occupation)");
  lines.push("");
  lines.push(
    "Counts use `pathwayExamQuestionMarketingHubInventoryWhere(us-allied-core)` intersected with `prismaWhereForAlliedProfessionExamQuestions` where the legacy career/tag map exists. Flashcards: published ALLIED cards in decks tagged with the `professionKey` slug **or** linked `ExamQuestion` rows in the scoped pool. Lessons: published `PathwayLesson` with `alliedProfessionKey` OR `topicSlug ∈ topicSlugsIn`.",
  );
  lines.push("");
  lines.push(
    "| Occupation | lessons | flashcards | practice Q | CAT adaptive Q | scenario Q | lab/diag Q | med-calc Q | skill refresher (registry) | practice exams | readiness UI | weak/strong UI |",
  );
  lines.push(
    "|------------|---------|------------|-----------|----------------|------------|------------|------------|---------------------------|----------------|--------------|----------------|",
  );

  for (const r of rows) {
    lines.push(
      [
        `\`${r.professionKey}\``,
        formatCell(r.lessonsPublished),
        formatCell(r.flashcardsPublished),
        formatCell(r.practiceQuestionsPublished),
        formatCell(r.catAdaptiveEligiblePublished),
        formatCell(r.scenarioCaseQuestionsPublished),
        formatCell(r.labDiagnosticTaggedPublished),
        formatCell(r.medCalcTaggedPublished),
        formatCell(r.skillsRefresherRegistry),
        formatCell(r.practiceExamsOrSets),
        r.readinessSurface.readinessKeys.length >= 2 ? "progress+plan" : "—",
        r.weakStrongSurfacePresent ? "present" : "not on hub grid",
      ].join(" | "),
    );
  }

  lines.push("");
  lines.push("### Minimum compliance (vs `ALLIED_MINIMUM_CONTENT_PER_OCCUPATION`)");
  lines.push("");
  lines.push(
    "| Occupation | lessons | flashcards | practice Q | CAT adaptive | scenario Q | lab/diag | med-calc | skills (registry) | practice sets | readiness | weak/strong |",
  );
  lines.push(
    "|------------|---------|------------|------------|--------------|------------|--------|--------|------------------|---------------|-----------|-------------|",
  );

  for (const r of rows) {
    const L = r.lessonsPublished.kind === "count" ? r.lessonsPublished.n >= min.lessons : false;
    const F = r.flashcardsPublished.kind === "count" ? r.flashcardsPublished.n >= min.flashcards : false;
    const P = r.practiceQuestionsPublished.kind === "count" ? r.practiceQuestionsPublished.n >= min.practiceQuestions : false;
    const C =
      r.catAdaptiveEligiblePublished.kind === "count" &&
      r.catAdaptiveEligiblePublished.n >= min.catSessionsIfSupported;
    const S = r.scenarioCaseQuestionsPublished.kind === "count" ? r.scenarioCaseQuestionsPublished.n >= min.scenarioCaseStudyQuestions : false;
    const LB = r.labDiagnosticTaggedPublished.kind === "count" ? r.labDiagnosticTaggedPublished.n >= min.labDiagnosticItems : false;
    const M = r.medCalcTaggedPublished.kind === "count" ? r.medCalcTaggedPublished.n >= min.medCalculationItems : false;
    const SK =
      r.skillsRefresherRegistry.kind === "count" ? r.skillsRefresherRegistry.n >= min.skillsRefresherItems : false;
    const PE = false;
    const RS =
      r.readinessSurface.readinessKeys.includes("progress") && r.readinessSurface.readinessKeys.includes("exam_plan");
    const W = r.weakStrongSurfacePresent;

    lines.push(
      [
        `\`${r.professionKey}\``,
        cmpMinimum(L),
        cmpMinimum(F),
        cmpMinimum(P),
        alliedHubCatSurfaceUnlocked(r.professionKey) ? cmpMinimum(!!C) : "n/a (CAT locked)",
        cmpMinimum(S),
        cmpMinimum(LB),
        cmpMinimum(M),
        cmpMinimum(SK),
        PE ? "meets" : "below (no inventory)",
        RS ? "meets" : "below",
        W ? "meets" : "below (tile absent)",
      ].join(" | "),
    );
  }

  lines.push("");
  return lines.join("\n");
}
