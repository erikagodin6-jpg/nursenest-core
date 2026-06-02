/**
 * Single source of truth for pathway lesson footer study links (linked signals vs legacy).
 * Used by {@link PathwayLessonActions} — keep pure (no React) for tests and reuse.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { practiceTestsWeakFocusHref } from "@/lib/learner/study-loop-recommendations";
import {
  buildAppFlashcardsTopicHref,
  buildAppPracticeTestsTopicHref,
  buildAppQuestionsTopicDrillHref,
} from "@/lib/learner/app-study-internal-links";
import { humanizeTopicSlug, buildAppQuestionBankTopicDrillHref } from "@/components/lessons/pathway-lesson-link-practice";
import type { PathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-types";

export type LessonStudyHrefPack = {
  questionsHref: string | null;
  flashcardsHref: string | null;
  practiceTestsHref: string | null;
  adaptiveHref: string | null;
};

export function normalizeLinkedTopicKey(key: string): string {
  return typeof key === "string" ? key.trim().toLowerCase() : "";
}

function wrapMarketingAppHref(href: string | null, linkMode: "marketing" | "learner"): string | null {
  if (!href) return null;
  return linkMode === "marketing" ? loginWithCallback(href) : href;
}

/**
 * Hrefs when `linkedLearningSignals` is present. **Never** substitutes legacy URLs when a flag is false —
 * callers render disabled UI instead of falling back.
 */
export function buildLinkedLearningHrefPack(args: {
  pathwayId: string;
  pathwayDef: ExamPathwayDefinition | undefined;
  topicLabel: string | null | undefined;
  signals: PathwayLessonLinkedLearningSignals;
  catAdaptiveAvailable: boolean;
  linkMode: "marketing" | "learner";
}): LessonStudyHrefPack {
  const key = normalizeLinkedTopicKey(args.signals.bidirectionalTopicKey);
  const label = (args.topicLabel?.trim() || (key ? humanizeTopicSlug(key) : "")).trim();

  const rawQuestions =
    args.signals.practiceQuestionsLinked && key
      ? args.pathwayDef
        ? buildAppQuestionBankTopicDrillHref(args.pathwayDef, label, key)
        : buildAppQuestionsTopicDrillHref(args.pathwayId, key)
      : null;
  const questionsHref = wrapMarketingAppHref(rawQuestions, args.linkMode);

  const rawFlash =
    args.signals.flashcardsLinked && key ? buildAppFlashcardsTopicHref(args.pathwayId, key) : null;
  const flashcardsHref = wrapMarketingAppHref(rawFlash, args.linkMode);

  const rawPracticeTests =
    args.signals.catPoolLinked && key ? buildAppPracticeTestsTopicHref(args.pathwayId, key) : null;
  const practiceTestsHref = wrapMarketingAppHref(rawPracticeTests, args.linkMode);

  /** Adaptive shortcut requires a real topic anchor (empty key = shallow / not linkable). */
  let adaptiveHref: string | null = null;
  if (
    key &&
    args.signals.adaptiveLearningReadiness &&
    args.catAdaptiveAvailable &&
    args.pathwayDef
  ) {
    adaptiveHref =
      args.linkMode === "learner"
        ? practiceTestsWeakFocusHref(args.pathwayId)
        : buildExamPathwayPath(args.pathwayDef, "cat");
  }

  return { questionsHref, flashcardsHref, practiceTestsHref, adaptiveHref };
}

/** Legacy topic-scoped links when the lesson has no `linkedLearningSignals` (pre-normalized rows, etc.). */
export function buildLegacyLessonActionHrefs(args: {
  pathwayId: string;
  pathwayDef: ExamPathwayDefinition | undefined;
  topicCode: string | null | undefined;
  topicLabel: string | null | undefined;
  catAdaptiveAvailable: boolean;
}): LessonStudyHrefPack {
  const pid = args.pathwayId.trim();
  if (!pid) {
    return { questionsHref: null, flashcardsHref: null, practiceTestsHref: null, adaptiveHref: null };
  }
  const topicCodeParam = args.topicCode?.trim() ? `&topicCode=${encodeURIComponent(args.topicCode.trim())}` : "";
  const topicLabelParam = args.topicLabel?.trim() ? `&topic=${encodeURIComponent(args.topicLabel.trim())}` : "";
  const questionsHref = `/app/questions?pathwayId=${encodeURIComponent(pid)}${topicCodeParam}${topicLabelParam}&preset=topic_drill`;

  const topicSlugForHub = args.topicCode?.trim().toLowerCase() ?? "";
  const flashcardsHref =
    topicSlugForHub.length > 0
      ? buildAppFlashcardsTopicHref(pid, topicSlugForHub)
      : `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`;
  const practiceTestsHref =
    topicSlugForHub.length > 0 ? buildAppPracticeTestsTopicHref(pid, topicSlugForHub) : null;

  const adaptiveHref = args.catAdaptiveAvailable ? practiceTestsWeakFocusHref(pid) : null;

  return { questionsHref, flashcardsHref, practiceTestsHref, adaptiveHref };
}
