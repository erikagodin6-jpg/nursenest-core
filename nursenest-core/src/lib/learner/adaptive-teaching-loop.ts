import { prisma } from "@/lib/db";
import {
  buildNormalizedTeachingPayload,
  buildTeachingMediaBundle,
  type NormalizedTeachingPayload,
} from "@/lib/content-quality/teaching-payload";
import type { QuestionPerformanceEventV1, WeakPerformanceArea } from "@/lib/learner/question-performance-events";
import { deriveWeakAreasFromPerformanceEvents } from "@/lib/learner/question-performance-events";
import { normalizeLesson, pathwayLessonRowToInput } from "@/lib/lessons/pathway-lesson-loader";

export type AdaptiveLoopContentRecommendation = {
  kind: "question" | "lesson";
  id: string;
  title: string;
  href: string;
  topic: string | null;
  subtopic: string | null;
  strongTeachingPayload: boolean;
  conceptImageAvailable: boolean;
  conceptImageUrl: string | null;
};

export type AdaptiveTeachingLoopRecommendation = {
  prioritizedTopic: string | null;
  prioritizedSubtopic: string | null;
  weakAreaSignals: WeakPerformanceArea[];
  recommendedContent: AdaptiveLoopContentRecommendation[];
  strongTeachingPayloadExists: boolean;
  conceptImageAvailable: boolean;
  dataGaps: string[];
};

type TeachingRow = Parameters<typeof buildNormalizedTeachingPayload>[0];

function hasStrongTeachingPayload(teaching: NormalizedTeachingPayload): boolean {
  const highValueFields = [
    teaching.rationale,
    teaching.correctAnswerExplanation,
    teaching.keyTakeaway,
    teaching.clinicalReasoning,
    teaching.examStrategy,
  ].filter((x) => Boolean(x && x.trim().length >= 20)).length;
  return teaching.sections.length >= 3 && highValueFields >= 2;
}

export function deriveAdaptiveLoopDataGaps(recommendedContent: AdaptiveLoopContentRecommendation[]): string[] {
  const dataGaps: string[] = [];
  const strongTeachingPayloadExists = recommendedContent.some((r) => r.strongTeachingPayload);
  const conceptImageAvailable = recommendedContent.some((r) => r.conceptImageAvailable);
  if (!strongTeachingPayloadExists) dataGaps.push("No high-quality teaching payload found in prioritized recommendations.");
  if (!conceptImageAvailable) dataGaps.push("No concept image matched for prioritized concepts.");
  return dataGaps;
}

export async function buildAdaptiveTeachingLoopFromPerformance(args: {
  userId: string;
  events: QuestionPerformanceEventV1[];
  fallbackTopics?: string[];
}): Promise<AdaptiveTeachingLoopRecommendation> {
  const weakAreaSignals = deriveWeakAreasFromPerformanceEvents(args.events, 6);
  const priority = weakAreaSignals[0] ?? {
    topic: args.fallbackTopics?.[0] ?? null,
    subtopic: null,
  };
  const prioritizedTopic = priority.topic;
  const prioritizedSubtopic = priority.subtopic;

  const dataGaps: string[] = [];
  if (!prioritizedTopic && !prioritizedSubtopic) {
    dataGaps.push("No weak-topic signal yet from recent performance events.");
    return {
      prioritizedTopic: null,
      prioritizedSubtopic: null,
      weakAreaSignals,
      recommendedContent: [],
      strongTeachingPayloadExists: false,
      conceptImageAvailable: false,
      dataGaps,
    };
  }

  const qRows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      OR: [
        prioritizedTopic ? { topic: { contains: prioritizedTopic, mode: "insensitive" } } : undefined,
        prioritizedSubtopic ? { subtopic: { contains: prioritizedSubtopic, mode: "insensitive" } } : undefined,
      ].filter(Boolean) as any,
    },
    select: {
      id: true,
      stem: true,
      topic: true,
      subtopic: true,
      bodySystem: true,
      tags: true,
      questionType: true,
      rationale: true,
      correctAnswerExplanation: true,
      clinicalReasoning: true,
      keyTakeaway: true,
      examStrategy: true,
      clinicalPearl: true,
      clinicalTrap: true,
      memoryHook: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
      correctAnswer: true,
      images: true,
    },
    take: 24,
  });

  const questionRecommendations: AdaptiveLoopContentRecommendation[] = qRows
    .map((row) => {
      const teaching = buildNormalizedTeachingPayload(row as TeachingRow);
      const media = buildTeachingMediaBundle(row as TeachingRow);
      const strongTeachingPayload = hasStrongTeachingPayload(teaching);
      const conceptImageAvailable = Boolean(media.matchedConceptImage?.url || media.referenceMedia.length > 0);
      return {
        kind: "question" as const,
        id: row.id,
        title: row.stem,
        href: `/app/questions?focus=${encodeURIComponent(row.id)}`,
        topic: row.topic,
        subtopic: row.subtopic,
        strongTeachingPayload,
        conceptImageAvailable,
        conceptImageUrl: media.matchedConceptImage?.url ?? media.referenceMedia[0]?.url ?? null,
      };
    })
    .sort((a, b) => Number(b.strongTeachingPayload) - Number(a.strongTeachingPayload) || Number(b.conceptImageAvailable) - Number(a.conceptImageAvailable))
    .slice(0, 4);

  const lessonRows = await prisma.pathwayLesson.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        prioritizedTopic ? { topic: { contains: prioritizedTopic, mode: "insensitive" } } : undefined,
        prioritizedSubtopic ? { topicSlug: { contains: prioritizedSubtopic.toLowerCase(), mode: "insensitive" } } : undefined,
      ].filter(Boolean) as any,
    },
    select: {
      id: true,
      title: true,
      topic: true,
      topicSlug: true,
      slug: true,
      bodySystem: true,
      previewSectionCount: true,
      seoTitle: true,
      seoDescription: true,
      sections: true,
      locale: true,
      pathwayId: true,
    },
    take: 2,
  });

  const lessonRecommendations: AdaptiveLoopContentRecommendation[] = lessonRows
    .filter((r) => normalizeLesson(pathwayLessonRowToInput(r), r.pathwayId).structuralQuality?.publicComplete)
    .map((r) => ({
    kind: "lesson",
    id: r.id,
    title: r.title,
    href: r.topic || prioritizedTopic ? `/app/lessons?topic=${encodeURIComponent(r.topic || prioritizedTopic || "")}` : "/app/lessons",
    topic: r.topic,
    subtopic: r.topicSlug,
    strongTeachingPayload: false,
    conceptImageAvailable: false,
    conceptImageUrl: null,
    }));

  const recommendedContent = [...questionRecommendations, ...lessonRecommendations];
  const strongTeachingPayloadExists = recommendedContent.some((r) => r.strongTeachingPayload);
  const conceptImageAvailable = recommendedContent.some((r) => r.conceptImageAvailable);

  dataGaps.push(...deriveAdaptiveLoopDataGaps(recommendedContent));

  return {
    prioritizedTopic,
    prioritizedSubtopic,
    weakAreaSignals,
    recommendedContent,
    strongTeachingPayloadExists,
    conceptImageAvailable,
    dataGaps,
  };
}

