import "server-only";

import { prisma } from "@/lib/db";
import { validateEcgStripClinicalConfig } from "@/lib/ecg-module/ecg-strip-clinical-validation";
import {
  generateAndInsertEcgQuestionsForCategory,
  type EcgGenerationActivity,
  type EcgQuestionCategory,
} from "@/lib/ecg-module/ecg-question-generation";
import { getEcgModuleStatus, type EcgModuleStatus } from "@/lib/ecg-module/ecg-module-status";

export const ECG_MINIMUM_CONTENT = {
  totalQuestions: 300,
  rhythm: 150,
  stripVideo: 50,
  caseBased: 50,
  electrolyteMedication: 30,
  advanced: 20,
  flashcards: 100,
  linkedLessons: 20,
  rationaleCoveragePct: 100,
  stripMediaCoveragePct: 100,
  taggedCoveragePct: 90,
} as const;

export type EcgModuleReadinessCounts = {
  totalQuestions: number;
  rhythm: number;
  stripVideo: number;
  caseBased: number;
  electrolyteMedication: number;
  advanced: number;
  flashcards: number;
  linkedLessons: number;
  withRationale: number;
  withMedia: number;
  missingMedia: number;
  missingRationale: number;
  tagged: number;
  scoped: number;
  validationFailures: number;
  manualReviewMissing: number;
};

export type EcgModuleGate = {
  key: string;
  label: string;
  passed: boolean;
  actual: number | string;
  required: number | string;
  reason: string;
};

export type EcgModuleReadiness = {
  status: EcgModuleStatus;
  counts: EcgModuleReadinessCounts;
  percentages: {
    rationale: number;
    media: number;
    tagged: number;
  };
  gates: EcgModuleGate[];
  canPublish: boolean;
  generationActivity: EcgGenerationActivity[];
};

const CATEGORY_TAGS: Record<EcgQuestionCategory, string[]> = {
  rhythm: ["rhythm", "sinus", "atrial", "ventricular", "av-block"],
  strip_video: ["strip_video", "strip", "video", "drill"],
  case: ["case", "stemi", "pea", "clinical"],
  electrolyte_medication: ["electrolyte_medication", "electrolyte", "hyperkalemia", "hypokalemia", "medication"],
  advanced: ["advanced", "pacemaker", "paced", "acls", "ventricular_tachycardia", "torsades"],
};

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 1000) / 10 : 0;
}

function hasAnyTag(tags: string[] | null | undefined, needles: string[]): boolean {
  const set = new Set((tags ?? []).map((tag) => tag.trim().toLowerCase()));
  return needles.some((needle) => set.has(needle) || [...set].some((tag) => tag.includes(needle)));
}

export function summarizeEcgModuleGates(readiness: Pick<EcgModuleReadiness, "gates">): string[] {
  return readiness.gates.filter((gate) => !gate.passed).map((gate) => gate.reason);
}

function buildGates(status: EcgModuleStatus, counts: EcgModuleReadinessCounts): EcgModuleGate[] {
  const rationalePct = pct(counts.withRationale, counts.totalQuestions);
  const mediaPct = pct(counts.withMedia, Math.max(counts.stripVideo, 1));
  const taggedPct = pct(counts.tagged, counts.totalQuestions);
  const gates: EcgModuleGate[] = [
    gate("status", "Module status", status !== "archived", status, "draft|qa_preview|published", `ECG module status is ${status}.`),
    gate("total", "Total ECG questions", counts.totalQuestions >= ECG_MINIMUM_CONTENT.totalQuestions, counts.totalQuestions, ECG_MINIMUM_CONTENT.totalQuestions, `ECG question count ${counts.totalQuestions}/${ECG_MINIMUM_CONTENT.totalQuestions}.`),
    gate("rhythm", "Rhythm interpretation", counts.rhythm >= ECG_MINIMUM_CONTENT.rhythm, counts.rhythm, ECG_MINIMUM_CONTENT.rhythm, `Rhythm interpretation count ${counts.rhythm}/${ECG_MINIMUM_CONTENT.rhythm}.`),
    gate("strip", "Video/strip questions", counts.stripVideo >= ECG_MINIMUM_CONTENT.stripVideo, counts.stripVideo, ECG_MINIMUM_CONTENT.stripVideo, `ECG strip/video count ${counts.stripVideo}/${ECG_MINIMUM_CONTENT.stripVideo}.`),
    gate("case", "Case-based questions", counts.caseBased >= ECG_MINIMUM_CONTENT.caseBased, counts.caseBased, ECG_MINIMUM_CONTENT.caseBased, `Case-based ECG count ${counts.caseBased}/${ECG_MINIMUM_CONTENT.caseBased}.`),
    gate("electrolyte", "Electrolyte/medication", counts.electrolyteMedication >= ECG_MINIMUM_CONTENT.electrolyteMedication, counts.electrolyteMedication, ECG_MINIMUM_CONTENT.electrolyteMedication, `Electrolyte/medication ECG count ${counts.electrolyteMedication}/${ECG_MINIMUM_CONTENT.electrolyteMedication}.`),
    gate("advanced", "Advanced ECG", counts.advanced >= ECG_MINIMUM_CONTENT.advanced, counts.advanced, ECG_MINIMUM_CONTENT.advanced, `Advanced ECG count ${counts.advanced}/${ECG_MINIMUM_CONTENT.advanced}.`),
    gate("flashcards", "Linked flashcards", counts.flashcards >= ECG_MINIMUM_CONTENT.flashcards, counts.flashcards, ECG_MINIMUM_CONTENT.flashcards, `ECG flashcard count ${counts.flashcards}/${ECG_MINIMUM_CONTENT.flashcards}.`),
    gate("lessons", "Linked lessons", counts.linkedLessons >= ECG_MINIMUM_CONTENT.linkedLessons, counts.linkedLessons, ECG_MINIMUM_CONTENT.linkedLessons, `Linked ECG lessons ${counts.linkedLessons}/${ECG_MINIMUM_CONTENT.linkedLessons}.`),
    gate("rationale", "Rationale coverage", rationalePct >= ECG_MINIMUM_CONTENT.rationaleCoveragePct, `${rationalePct}%`, "100%", `Rationale coverage ${rationalePct}%.`),
    gate("media", "Strip media coverage", mediaPct >= ECG_MINIMUM_CONTENT.stripMediaCoveragePct, `${mediaPct}%`, "100%", `Strip/video media coverage ${mediaPct}%.`),
    gate("tagged", "Tagged questions", taggedPct >= ECG_MINIMUM_CONTENT.taggedCoveragePct, `${taggedPct}%`, "90%+", `Tagged ECG question coverage ${taggedPct}%.`),
    gate("scoped", "Pathway/tier scope", counts.scoped === counts.totalQuestions, counts.scoped, counts.totalQuestions, `Scoped ECG questions ${counts.scoped}/${counts.totalQuestions}.`),
    gate("validation", "Medical QA validation", counts.validationFailures === 0, counts.validationFailures, 0, `${counts.validationFailures} ECG question(s) fail validation.`),
    gate("manual_review", "High-risk manual review", counts.manualReviewMissing === 0, counts.manualReviewMissing, 0, `${counts.manualReviewMissing} high-risk ECG strip(s) need manual review.`),
  ];
  return gates;
}

function gate(key: string, label: string, passed: boolean, actual: number | string, required: number | string, reason: string): EcgModuleGate {
  return { key, label, passed, actual, required, reason };
}

export async function getEcgModuleReadiness(): Promise<EcgModuleReadiness> {
  const [status, questions, flashcards, lessons] = await Promise.all([
    getEcgModuleStatus(),
    prisma.ecgVideoQuestion.findMany({
      take: 1000,
      select: {
        id: true,
        mediaType: true,
        mediaConfig: true,
        rationale: true,
        rhythmTag: true,
        level: true,
        topicTags: true,
        allowedTiers: true,
        medicalQaStatus: true,
        manualReviewedAt: true,
        correctAnswerId: true,
        lessonLinkCount: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.flashcard.count({ where: { status: "PUBLISHED", OR: [{ sourceKey: { startsWith: "ecg:" } }, { front: { contains: "ECG", mode: "insensitive" } }, { back: { contains: "ECG", mode: "insensitive" } }] } }).catch(() => 0),
    prisma.pathwayLesson.count({ where: { status: "PUBLISHED", OR: [{ topic: { contains: "ECG", mode: "insensitive" } }, { title: { contains: "ECG", mode: "insensitive" } }, { bodySystem: { contains: "cardio", mode: "insensitive" } }] } }).catch(() => 0),
  ]);

  let validationFailures = 0;
  let manualReviewMissing = 0;
  for (const question of questions) {
    if (question.medicalQaStatus === "failed") validationFailures += 1;
    if (question.mediaType === "ecg_live_strip") {
      const result = validateEcgStripClinicalConfig(question.mediaConfig, {
        correctAnswer: question.rhythmTag,
        highRiskManualReviewed: Boolean(question.manualReviewedAt),
      });
      if (!result.ok) validationFailures += result.failures.length > 0 ? 1 : 0;
      if (result.needsManualReview) manualReviewMissing += 1;
    }
  }

  const counts: EcgModuleReadinessCounts = {
    totalQuestions: questions.length,
    rhythm: questions.filter((q) => hasAnyTag(q.topicTags, CATEGORY_TAGS.rhythm)).length,
    stripVideo: questions.filter((q) => q.mediaType === "ecg_live_strip" || hasAnyTag(q.topicTags, CATEGORY_TAGS.strip_video)).length,
    caseBased: questions.filter((q) => hasAnyTag(q.topicTags, CATEGORY_TAGS.case)).length,
    electrolyteMedication: questions.filter((q) => hasAnyTag(q.topicTags, CATEGORY_TAGS.electrolyte_medication)).length,
    advanced: questions.filter((q) => q.level === "advanced" || hasAnyTag(q.topicTags, CATEGORY_TAGS.advanced)).length,
    flashcards,
    linkedLessons: Math.max(lessons, questions.reduce((sum, row) => sum + (row.lessonLinkCount > 0 ? 1 : 0), 0)),
    withRationale: questions.filter((q) => q.rationale.trim().length > 0).length,
    withMedia: questions.filter((q) => q.mediaType === "ecg_live_strip" ? Boolean(q.mediaConfig) : true).length,
    missingMedia: questions.filter((q) => q.mediaType === "ecg_live_strip" && !q.mediaConfig).length,
    missingRationale: questions.filter((q) => q.rationale.trim().length === 0).length,
    tagged: questions.filter((q) => q.topicTags.length > 0 && q.rhythmTag.trim().length > 0).length,
    scoped: questions.filter((q) => q.allowedTiers.length > 0).length,
    validationFailures,
    manualReviewMissing,
  };

  const gates = buildGates(status, counts);
  return {
    status,
    counts,
    percentages: {
      rationale: pct(counts.withRationale, counts.totalQuestions),
      media: pct(counts.withMedia, Math.max(counts.stripVideo, 1)),
      tagged: pct(counts.tagged, counts.totalQuestions),
    },
    gates,
    canPublish: gates.every((gate) => gate.passed),
    generationActivity: [],
  };
}

function deficits(readiness: EcgModuleReadiness): Array<{ category: EcgQuestionCategory; count: number }> {
  return [
    { category: "rhythm" as const, count: ECG_MINIMUM_CONTENT.rhythm - readiness.counts.rhythm },
    { category: "strip_video" as const, count: ECG_MINIMUM_CONTENT.stripVideo - readiness.counts.stripVideo },
    { category: "case" as const, count: ECG_MINIMUM_CONTENT.caseBased - readiness.counts.caseBased },
    { category: "electrolyte_medication" as const, count: ECG_MINIMUM_CONTENT.electrolyteMedication - readiness.counts.electrolyteMedication },
    { category: "advanced" as const, count: ECG_MINIMUM_CONTENT.advanced - readiness.counts.advanced },
  ].filter((entry) => entry.count > 0);
}

export async function ensureEcgMinimumContent(): Promise<EcgModuleReadiness> {
  const activity: EcgGenerationActivity[] = [];
  for (let loop = 0; loop < 5; loop += 1) {
    const readiness = await getEcgModuleReadiness();
    const missing = deficits(readiness);
    if (readiness.counts.totalQuestions >= ECG_MINIMUM_CONTENT.totalQuestions && missing.length === 0) {
      return { ...readiness, generationActivity: activity };
    }
    let remaining = 100;
    for (const deficit of missing) {
      if (remaining <= 0) break;
      const count = Math.min(deficit.count, remaining);
      const generated = await generateAndInsertEcgQuestionsForCategory(deficit.category, count);
      activity.push(generated);
      remaining -= generated.generated;
    }
    if (remaining === 100) break;
  }
  const final = await getEcgModuleReadiness();
  return { ...final, generationActivity: activity, gates: buildGates(final.status, final.counts) };
}

export async function assertEcgModuleCanPublish(): Promise<EcgModuleReadiness> {
  const readiness = await ensureEcgMinimumContent();
  if (!readiness.canPublish) {
    const reasons = summarizeEcgModuleGates(readiness);
    throw Object.assign(new Error(`ECG module cannot publish: ${reasons.join(" | ")}`), { readiness, reasons });
  }
  return readiness;
}
