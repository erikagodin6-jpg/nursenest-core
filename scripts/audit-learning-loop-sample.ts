#!/usr/bin/env npx tsx
/**
 * Read-only audit: sample published exam_questions and print learning-loop / teaching payload fields
 * for human quality review. No writes, no API/UI changes.
 *
 * Run from nursenest-core/: `npm run ops:learning-loop-audit`
 * Options: `--limit=28` (default 28), `--min=20` (warn if fewer rows sampled)
 */
import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { buildNormalizedTeachingPayload } from "../src/lib/content-quality/teaching-payload";
import { deriveTopicCode } from "../src/lib/learner/topic-linking";
import type { RecommendationConfidence } from "../src/lib/learner/topic-linking";

type AuditRow = {
  id: string;
  stem: string;
  questionType: string;
  tier: string;
  exam: string;
  countryCode: string | null;
  regionScope: string | null;
  topic: string | null;
  subtopic: string | null;
  bodySystem: string | null;
  rationale: string | null;
  correctAnswerExplanation: string | null;
  clinicalReasoning: string | null;
  keyTakeaway: string | null;
  examStrategy: string | null;
  clinicalPearl: string | null;
  clinicalTrap: string | null;
  memoryHook: string | null;
  distractorRationales: Prisma.JsonValue | null;
  incorrectAnswerRationale: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  images: Prisma.JsonValue | null;
};

function topicRoutingConfidence(row: { subtopic?: string | null; topic?: string | null; bodySystem?: string | null }): RecommendationConfidence {
  if ((row.subtopic ?? "").trim().length > 1) return "high";
  if ((row.topic ?? "").trim().length > 1) return "medium";
  if ((row.bodySystem ?? "").trim().length > 1) return "low";
  return "low";
}

function appendTopicCodeToDrillHref(href: string, topicCode: string): string {
  if (!topicCode || href.includes("topicCode=")) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}topicCode=${encodeURIComponent(topicCode)}`;
}

function derivedExamStrategyKind(questionType: string): "sata" | "ordering" | "prioritization" | "mcq_next_best" {
  const t = questionType.toUpperCase();
  if (t === "SATA" || t === "SELECT_ALL_THAT_APPLY") return "sata";
  if (t === "ORDERING") return "ordering";
  if (t === "PRIORITIZATION_ARTICLE" || t.includes("PRIOR")) return "prioritization";
  return "mcq_next_best";
}

function parseArgs(): { limit: number; min: number } {
  let limit = 28;
  let min = 20;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--limit=")) limit = Math.max(1, Math.min(80, parseInt(a.slice("--limit=".length), 10) || 28));
    if (a.startsWith("--min=")) min = Math.max(1, parseInt(a.slice("--min=".length), 10) || 20);
  }
  return { limit, min };
}

const teachingSelect = {
  stem: true,
  questionType: true,
  rationale: true,
  correctAnswerExplanation: true,
  clinicalReasoning: true,
  keyTakeaway: true,
  clinicalPearl: true,
  examStrategy: true,
  memoryHook: true,
  clinicalTrap: true,
  distractorRationales: true,
  incorrectAnswerRationale: true,
  correctAnswer: true,
  topic: true,
  subtopic: true,
  bodySystem: true,
  tags: true,
  images: true,
} as const;

async function fetchBucket(
  questionTypes: string[],
  take: number,
  excludeIds: Set<string>,
): Promise<AuditRow[]> {
  if (questionTypes.length === 0 || take <= 0) return [];
  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      questionType: { in: questionTypes },
    },
    select: {
      id: true,
      tier: true,
      exam: true,
      countryCode: true,
      regionScope: true,
      ...teachingSelect,
    },
    orderBy: { updatedAt: "desc" },
    take: take * 3,
  });
  const out: AuditRow[] = [];
  for (const r of rows) {
    if (excludeIds.has(r.id)) continue;
    excludeIds.add(r.id);
    out.push(r as AuditRow);
    if (out.length >= take) break;
  }
  return out;
}

async function fetchFillPublished(take: number, excludeIds: Set<string>): Promise<AuditRow[]> {
  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      ...(excludeIds.size > 0 ? { id: { notIn: [...excludeIds] } } : {}),
    },
    select: {
      id: true,
      tier: true,
      exam: true,
      countryCode: true,
      regionScope: true,
      ...teachingSelect,
    },
    orderBy: { updatedAt: "desc" },
    take: take * 2,
  });
  return rows.filter((r) => !excludeIds.has(r.id)).slice(0, take) as AuditRow[];
}

async function main() {
  const { limit, min } = parseArgs();
  const exclude = new Set<string>();
  const perType = Math.max(3, Math.ceil(limit / 5));

  const mcq = await fetchBucket(["MCQ"], perType + 2, exclude);
  const sata = await fetchBucket(["SATA", "SELECT_ALL_THAT_APPLY"], perType + 2, exclude);
  const ordering = await fetchBucket(["ORDERING"], Math.max(2, Math.floor(perType / 2)), exclude);
  const ngn = await fetchBucket(["NGN_CASE"], Math.max(2, Math.floor(perType / 2)), exclude);
  const fib = await fetchBucket(["FIB_NUMERIC"], Math.max(2, Math.floor(perType / 2)), exclude);
  const prior = await fetchBucket(["PRIORITIZATION_ARTICLE"], Math.max(2, Math.floor(perType / 2)), exclude);

  let combined = [...mcq, ...sata, ...ordering, ...ngn, ...fib, ...prior];
  if (combined.length < limit) {
    const more = await fetchFillPublished(limit - combined.length, exclude);
    combined = [...combined, ...more];
  }
  combined = combined.slice(0, limit);

  const gaps: string[] = [];
  if (combined.length < min) {
    gaps.push(`Only ${combined.length} published rows sampled (wanted at least ${min}).`);
  }
  if (mcq.length === 0) gaps.push("No published MCQ in sample.");
  if (sata.length === 0) gaps.push("No published SATA / SELECT_ALL_THAT_APPLY in sample.");
  if (ordering.length === 0 && prior.length === 0) gaps.push("No published ORDERING or PRIORITIZATION_ARTICLE in sample.");

  const tierSet = new Set(combined.map((r) => r.tier));
  if (tierSet.size < 2) gaps.push("Few distinct tiers in sample — consider widening DB or lowering per-type caps.");

  const results = await Promise.all(
    combined.map(async (row) => {
      const teaching = buildNormalizedTeachingPayload(row);
      const topicCode = deriveTopicCode({ topic: row.topic, subtopic: row.subtopic, bodySystem: row.bodySystem });
      const routingConfidence = topicRoutingConfidence(row);
      const isSata =
        row.questionType.toUpperCase() === "SATA" || row.questionType.toUpperCase() === "SELECT_ALL_THAT_APPLY";
      const distractorIsStored = Boolean(teaching.distractorNotes && teaching.distractorNotes.trim().length > 0);
      const distractorLabel = distractorIsStored ? "stored_json" : isSata ? "fallback_template_sata" : "fallback_template_mcq";

      const topicDrillBase =
        topicCode && row.topic
          ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(row.topic)}`
          : topicCode
            ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(topicCode)}`
            : null;
      const topicDrillHref =
        topicDrillBase && topicCode ? appendTopicCodeToDrillHref(topicDrillBase, topicCode) : topicDrillBase;

      let relatedPathwayLesson = false;
      let relatedContentLesson = false;
      let relatedFlashcardDecks = 0;

      if (topicCode) {
        const [pl, ci, deckCount] = await Promise.all([
          prisma.pathwayLesson.findFirst({
            where: { topicSlug: topicCode, status: ContentStatus.PUBLISHED, locale: "en" },
            select: { id: true },
          }),
          prisma.contentItem.findFirst({
            where: { type: "lesson", status: "published", bodySystem: topicCode },
            select: { id: true },
          }),
          prisma.flashcardDeck.count({
            where: {
              status: ContentStatus.PUBLISHED,
              cards: {
                some: {
                  status: ContentStatus.PUBLISHED,
                  category: { topicCode },
                },
              },
            },
          }),
        ]);
        relatedPathwayLesson = Boolean(pl);
        relatedContentLesson = Boolean(ci);
        relatedFlashcardDecks = deckCount;
      }

      return {
        questionId: row.id,
        exam: row.exam,
        tier: row.tier,
        countryCode: row.countryCode,
        regionScope: row.regionScope,
        questionType: row.questionType,
        topic: row.topic,
        subtopic: row.subtopic,
        bodySystem: row.bodySystem,
        topicCode,
        routingConfidence,
        correctAnswerLabels: teaching.correctAnswers,
        hasCorrectAnswerSection: teaching.sections.some((s) => s.id === "correct_answer"),
        teachingSectionOrder: teaching.sections.map((s) => ({ id: s.id, heading: s.heading })),
        distractorContent: distractorLabel,
        examStrategySource: row.examStrategy?.trim() ? ("stored" as const) : ("derived" as const),
        derivedExamStrategyKind: derivedExamStrategyKind(row.questionType),
        topicDrillHref,
        relatedLessonExists: relatedPathwayLesson || relatedContentLesson,
        relatedLessonPathway: relatedPathwayLesson,
        relatedLessonContentItem: relatedContentLesson,
        relatedFlashcardDeckCount: relatedFlashcardDecks,
        keyTakeawayDerived: teaching.keyTakeawayDerived,
        stemPreview: row.stem.slice(0, 120) + (row.stem.length > 120 ? "…" : ""),
      };
    }),
  );

  const tierHistogram: Record<string, number> = {};
  const typeHistogram: Record<string, number> = {};
  for (const r of results) {
    tierHistogram[r.tier] = (tierHistogram[r.tier] ?? 0) + 1;
    typeHistogram[r.questionType] = (typeHistogram[r.questionType] ?? 0) + 1;
  }

  const missingCorrectSection = results.filter((r) => !r.hasCorrectAnswerSection).length;
  if (missingCorrectSection > 0) {
    gaps.push(
      `${missingCorrectSection} item(s) omit the "Correct answer" section in the normalized payload (usually duplicate-body dedup against "Why this is correct"). Inspect correctAnswerLabels on those rows.`,
    );
  }

  const report = {
    meta: {
      generatedAt: new Date().toISOString(),
      sampled: results.length,
      requestedLimit: limit,
      auditType: "learning_loop_read_only",
      tierHistogram,
      questionTypeHistogram: typeHistogram,
      gaps,
    },
    items: results,
  };

  console.log(JSON.stringify(report, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }, null, 2));
  void prisma.$disconnect();
  process.exit(1);
});
