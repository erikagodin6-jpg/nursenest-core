import "server-only";

import { ADVANCED_ECG_LESSON_CONTENT } from "@/lib/advanced-ecg/advanced-ecg-lesson-content";
import { ADVANCED_ECG_DRAFT_QUESTION_PACK } from "@/lib/advanced-ecg/advanced-ecg-question-pack";
import { ECG_PREMIUM_CURATED_PACK } from "@/lib/ecg-module/ecg-premium-curated-pack";
import { ECG_RHYTHM_TEMPLATE_KEYS } from "@/lib/ecg-module/ecg-rhythm-templates";
import { buildAdvancedEcgCoverageReport, buildEcgDepthAudit, type EcgAuditQuestionSnapshot, type EcgAuditStructuredContent } from "@/lib/ecg-module/ecg-depth-audit";
import { getCatalogLessonRawBySlug } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

const CORE_ECG_LESSON_SLUGS = [
  "ecg-rate-calculation-basics-gold",
  "ecg-interval-interpretation-pr-qrs-qt-gold",
  "ecg-sinus-arrhythmia-recognition-gold",
  "ecg-junctional-rhythm-recognition-gold",
] as const;

const PATHWAY_ID = "us-rn-nclex-rn" as const;

function asSections(value: unknown): Record<string, string> {
  if (!Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const section of value as PathwayLessonSection[]) {
    if (!section || typeof section !== "object") continue;
    const key = typeof section.kind === "string" ? section.kind : typeof section.id === "string" ? section.id : "";
    const body = typeof section.body === "string" ? section.body : "";
    if (key && body.trim()) out[key] = body;
  }
  return out;
}

function coreLessonInputs(): EcgAuditStructuredContent[] {
  return CORE_ECG_LESSON_SLUGS.flatMap((slug) => {
    const lesson = getCatalogLessonRawBySlug(PATHWAY_ID, slug);
    if (!lesson) return [];
    return [
      {
        key: slug.includes("sinus-arrhythmia")
          ? "sinus_arrhythmia"
          : slug.includes("junctional")
            ? "junctional_rhythm"
            : slug.includes("interval")
              ? "intervals_pr_qrs_qt"
              : "rate_calculation",
        title: lesson.title,
        route: `/lessons/${lesson.slug}`,
        status: "published" as const,
        sections: asSections(lesson.sections),
      },
    ];
  });
}

function advancedLessonInputs(): EcgAuditStructuredContent[] {
  return ADVANCED_ECG_LESSON_CONTENT.map((lesson) => ({
    key: lesson.topicKey,
    title: lesson.title,
    route: `/modules/ecg-advanced/${lesson.unitSlug}`,
    status: lesson.status,
    sections: lesson.sections,
  }));
}

function questionSnapshot(
  row: {
    id?: string;
    rhythmTag?: string | null;
    topicTags?: string[] | null;
    rationale?: string | null;
    waveformFidelity?: string | null;
    publishSafetyStatus?: string | null;
    qaStatus?: string | null;
    clinicianReviewedAt?: Date | null;
  },
  fallbackKey: string,
): EcgAuditQuestionSnapshot {
  const tags = (row.topicTags ?? []).map((tag) => String(tag));
  const topicKeyTag = tags.find((tag) => tag.startsWith("topic:"));
  const rhythmKeyTag = tags.find((tag) => tag.startsWith("rhythm:"));
  return {
    id: String(row.id ?? fallbackKey),
    rhythmOrTopicKey: topicKeyTag
      ? topicKeyTag.replace("topic:", "")
      : rhythmKeyTag
        ? rhythmKeyTag.replace("rhythm:", "")
        : typeof row.rhythmTag === "string" && row.rhythmTag.trim()
          ? row.rhythmTag
          : fallbackKey,
    tags,
    rationale: typeof row.rationale === "string" ? row.rationale : null,
    distractorRationalesComplete: tags.includes("rationale:distractors_included") || /Distractor rationale:/i.test(row.rationale ?? ""),
    assetReviewStatus:
      row.publishSafetyStatus === "safe"
        ? "publish_safe"
        : row.waveformFidelity === "morphology_approximate" || row.waveformFidelity === "educational_simplified"
          ? "generated_review_required"
          : "internal_only",
    lessonStatus:
      row.publishSafetyStatus === "safe" && row.qaStatus === "approved" && row.clinicianReviewedAt
        ? "published"
        : "review_ready",
  };
}

function repoQuestionSnapshots(): EcgAuditQuestionSnapshot[] {
  const curated = ECG_PREMIUM_CURATED_PACK.map((row) => questionSnapshot(row, String(row.rhythmTag ?? row.id)));
  const advanced = ADVANCED_ECG_DRAFT_QUESTION_PACK.map((row) =>
    questionSnapshot(row, ((row.topicTags as string[])?.find((tag) => tag.startsWith("topic:")) ?? "topic:unknown").replace("topic:", "")),
  );
  return [...curated, ...advanced];
}

export function buildRepoEcgDepthAuditSnapshot() {
  const coreLessons = coreLessonInputs();
  const advancedLessons = advancedLessonInputs();
  const questions = repoQuestionSnapshots();
  const audit = buildEcgDepthAudit({
    expectedKeys: [...ECG_RHYTHM_TEMPLATE_KEYS, ...ADVANCED_ECG_LESSON_CONTENT.map((lesson) => lesson.topicKey)],
    coreLessons,
    advancedLessons,
    questions,
  });
  const advancedCoverage = buildAdvancedEcgCoverageReport({
    topics: ADVANCED_ECG_LESSON_CONTENT,
    questions,
    entitledTierLabels: ["RN", "NP"],
    blockedTierLabels: ["RPN", "PN", "Allied", "New Grad"],
  });

  return {
    audit,
    advancedCoverage,
    affectedRoutes: [
      "/modules/ecg/basic/lessons",
      "/modules/ecg/basic/quizzes",
      "/modules/ecg-advanced",
      "/modules/ecg-advanced/pacemakers",
    ],
    adminPreviewRoutes: [
      "/admin/modules/ecg",
      "/modules/ecg-advanced?preview=admin",
    ],
  };
}
