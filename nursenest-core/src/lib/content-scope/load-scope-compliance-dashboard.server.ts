import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import {
  auditContentScope,
  summarizeScopeCompliance,
  type ContentScopeAuditItem,
  type ContentScopeFinding,
  type ContentScopeSummary,
  type ContentScopeSurface,
} from "@/lib/content-scope/content-scope-auditor";

export type ScopeComplianceDashboard = {
  generatedAt: string;
  summary: ContentScopeSummary;
  findings: ContentScopeFinding[];
  auditedSamples: number;
  queue: ContentScopeFinding[];
};

const EMPTY_SUMMARY = summarizeScopeCompliance([], []);

function jsonText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function surfaceForTopic(defaultSurface: ContentScopeSurface, topic: string | null | undefined, tags: string[] = []): ContentScopeSurface {
  const blob = [topic, ...tags].filter(Boolean).join(" ").toLowerCase();
  if (/\b(?:pharm|drug|medication|insulin|opioid|anticoagulant|antibiotic)\b/.test(blob)) return "pharmacology";
  if (/\b(?:ecg|ekg|rhythm|stemi|telemetry|dysrhythmia)\b/.test(blob)) return "ecg";
  return defaultSurface;
}

function severityWeight(severity: ContentScopeFinding["severity"]): number {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

async function loadAuditItems(limit: number): Promise<ContentScopeAuditItem[]> {
  const perSurface = Math.max(25, Math.min(250, Math.floor(limit / 5)));

  const [questions, flashcards, lessons, scenarios, ecgQuestions] = await Promise.all([
    prisma.examQuestion.findMany({
      where: { status: { in: ["published", "PUBLISHED", "approved", "APPROVED"] } },
      orderBy: { updatedAt: "desc" },
      take: perSurface,
      select: {
        id: true,
        stem: true,
        rationale: true,
        correctAnswerExplanation: true,
        incorrectAnswerRationale: true,
        clinicalReasoning: true,
        tier: true,
        exam: true,
        countryCode: true,
        careerType: true,
        topic: true,
        bodySystem: true,
        tags: true,
        questionFormat: true,
      },
    }),
    prisma.flashcard.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { updatedAt: "desc" },
      take: perSurface,
      select: {
        id: true,
        front: true,
        back: true,
        questionStem: true,
        rationaleCorrect: true,
        rationaleIncorrect: true,
        country: true,
        tier: true,
        examFamily: true,
        category: { select: { name: true, slug: true } },
        deck: { select: { pathwayId: true, title: true } },
      },
    }),
    prisma.pathwayLesson.findMany({
      where: { status: ContentStatus.PUBLISHED, deprecatedAt: null },
      orderBy: { updatedAt: "desc" },
      take: perSurface,
      select: {
        id: true,
        title: true,
        topic: true,
        bodySystem: true,
        seoDescription: true,
        sections: true,
        countryCode: true,
        tierCode: true,
        pathwayId: true,
        exams: true,
        countries: true,
        alliedProfessionKey: true,
      },
    }),
    prisma.clinicalNursingScenario.findMany({
      where: { publishStatus: "APPROVED" },
      orderBy: { updatedAt: "desc" },
      take: perSurface,
      select: {
        id: true,
        title: true,
        pathwayId: true,
        canonicalCategoryId: true,
        tierFocus: true,
        patientAgeContext: true,
        presentingConcern: true,
        briefHistory: true,
        assessmentFindings: true,
        labsDiagnostics: true,
        stages: {
          take: 2,
          orderBy: { orderIndex: "asc" },
          select: { questionStem: true, rationale: true, clinicalJudgmentFocus: true },
        },
      },
    }),
    prisma.ecgVideoQuestion.findMany({
      where: { publishSafetyStatus: { in: ["published", "approved", "ready", "learner_ready"] } },
      orderBy: { createdAt: "desc" },
      take: perSurface,
      select: {
        id: true,
        questionText: true,
        rationale: true,
        difficulty: true,
        rhythmTag: true,
        clinicalPriority: true,
        allowedTiers: true,
        level: true,
        mode: true,
        topicTags: true,
      },
    }),
  ]);

  const questionItems: ContentScopeAuditItem[] = questions.map((q) => ({
    id: `question:${q.id}`,
    surface: surfaceForTopic(q.questionFormat === "ecg_video" ? "ecg" : "question", `${q.topic ?? ""} ${q.bodySystem ?? ""}`, q.tags),
    title: q.stem,
    body: [q.rationale, q.correctAnswerExplanation, jsonText(q.incorrectAnswerRationale), q.clinicalReasoning].join("\n"),
    tier: q.tier,
    exam: q.exam,
    country: q.countryCode,
    careerType: q.careerType,
    topic: q.topic ?? q.bodySystem,
    tags: q.tags,
  }));

  const flashcardItems: ContentScopeAuditItem[] = flashcards.map((card) => ({
    id: `flashcard:${card.id}`,
    surface: surfaceForTopic("flashcard", `${card.category.name} ${card.deck?.title ?? ""}`),
    title: card.questionStem ?? card.front,
    body: [card.back, card.rationaleCorrect, jsonText(card.rationaleIncorrect)].join("\n"),
    tier: String(card.tier),
    exam: String(card.examFamily),
    country: String(card.country),
    pathwayId: card.deck?.pathwayId ?? null,
    topic: card.category.name,
    tags: [card.category.slug],
  }));

  const lessonItems: ContentScopeAuditItem[] = lessons.map((lesson) => ({
    id: `lesson:${lesson.id}`,
    surface: surfaceForTopic("lesson", `${lesson.topic} ${lesson.bodySystem}`, lesson.exams),
    title: lesson.title,
    body: [lesson.seoDescription, jsonText(lesson.sections)].join("\n"),
    tier: lesson.tierCode ? String(lesson.tierCode) : null,
    exam: lesson.exams.join(", "),
    country: lesson.countryCode ? String(lesson.countryCode) : lesson.countries.join(", "),
    careerType: lesson.alliedProfessionKey,
    pathwayId: lesson.pathwayId,
    topic: lesson.topic,
    tags: lesson.exams,
  }));

  const scenarioItems: ContentScopeAuditItem[] = scenarios.map((scenario) => ({
    id: `clinical-scenario:${scenario.id}`,
    surface: "simulation",
    title: scenario.title,
    body: [
      scenario.patientAgeContext,
      scenario.presentingConcern,
      scenario.briefHistory,
      scenario.assessmentFindings,
      jsonText(scenario.labsDiagnostics),
      ...scenario.stages.flatMap((stage) => [stage.questionStem, stage.rationale, stage.clinicalJudgmentFocus]),
    ].join("\n"),
    tier: String(scenario.tierFocus),
    exam: null,
    country: null,
    pathwayId: scenario.pathwayId,
    topic: scenario.canonicalCategoryId,
    tags: [scenario.canonicalCategoryId],
  }));

  const ecgItems: ContentScopeAuditItem[] = ecgQuestions.map((q) => ({
    id: `ecg:${q.id}`,
    surface: "ecg",
    title: q.questionText,
    body: [q.rationale, q.difficulty, q.rhythmTag, q.clinicalPriority, q.level, q.mode].join("\n"),
    tier: q.allowedTiers.join(", "),
    exam: "ECG",
    country: null,
    topic: q.rhythmTag,
    tags: q.topicTags,
  }));

  return [...questionItems, ...flashcardItems, ...lessonItems, ...scenarioItems, ...ecgItems];
}

export async function loadScopeComplianceDashboard({ limit = 750 }: { limit?: number } = {}): Promise<ScopeComplianceDashboard> {
  return withDatabaseFallbackTimeout(
    async () => {
      const items = await loadAuditItems(limit);
      const findings = items.flatMap(auditContentScope);
      const summary = summarizeScopeCompliance(items, findings);
      const queue = [...findings].sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity) || a.surface.localeCompare(b.surface));

      return {
        generatedAt: new Date().toISOString(),
        summary,
        findings,
        auditedSamples: items.length,
        queue,
      };
    },
    {
      generatedAt: new Date().toISOString(),
      summary: EMPTY_SUMMARY,
      findings: [],
      auditedSamples: 0,
      queue: [],
    },
    4000,
    { scope: "content_scope", label: "loadScopeComplianceDashboard" },
  );
}
