import type { TierCode } from "@prisma/client";
import type { PathwayLesson } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { LinkCandidate } from "@/lib/linking/internal-link-types";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

/** Same fields as {@link PathwayLessonAutoLinkSnapshot} — kept local to avoid a circular import with automatic-internal-links. */
export type EcgLinkedLearningLessonSnapshot = Pick<
  PathwayLesson,
  "slug" | "title" | "topic" | "topicSlug" | "bodySystem"
>;

/** Matches cardiac / telemetry lesson signals without hardcoding full category lists. */
const ECG_LINK_SIGNAL =
  /\b(ecg|ekg|electrocardiogram|telemetry|arrhythm|dysrhythm|cardiac monitoring|cardiac\s+cycle|stemi|nstemi|myocardial|ischemia|pericarditis|atrial fibrillation|afib|vfib|vtach|torsades|av block|bundle branch|pacemaker|aicd|defibrill|cardioversion|long qt|qt prolongation|hyperkalemia|hypokalemia|electrolyte.*ecg|12[\s-]*lead)\b/i;

/**
 * RN/NP premium ECG module aligns with {@link canAccessEcgModuleForTier} and
 * {@link assertNoEcgForRpn} — PN/RPN, REx-PN, New Grad transition, and non-RN/NP tiers
 * do not get marketing-hub ECG tiles or deep-links.
 */
export function pathwayAllowsEcgLinkedLearning(pathway: ExamPathwayDefinition): boolean {
  const tier = pathway.stripeTier as TierCode;
  if (tier !== "RN" && tier !== "NP") return false;
  const pid = pathway.id.toLowerCase();
  if (pid.includes("rex-pn")) return false;
  /** Defense-in-depth alongside {@link TierCode.NEW_GRAD} — hub id always carries `new-grad`. */
  if (pid.includes("new-grad")) return false;
  return true;
}

export function lessonSignalsEcgLinkedLearning(lesson: EcgLinkedLearningLessonSnapshot): boolean {
  const haystack = [lesson.title, lesson.topic, lesson.topicSlug, lesson.bodySystem].filter(Boolean).join(" ");
  if (!haystack.trim()) return false;
  if (ECG_LINK_SIGNAL.test(haystack)) return true;
  const bs = lesson.bodySystem?.trim().toLowerCase() ?? "";
  if (bs.includes("cardio") || bs.includes("cardiac") || bs.includes("heart")) return true;
  return false;
}

/**
 * Weak-topic keys from adaptive analytics — conservative match to {@link ECG_LINK_SIGNAL}.
 */
export function weakTopicSuggestsEcgFocus(topicKey: string): boolean {
  const s = topicKey?.trim() ?? "";
  if (!s) return false;
  return ECG_LINK_SIGNAL.test(s);
}

/** Core ECG entry — integrated nursing telemetry literacy. Not the future Advanced ECG Program vertical. */
export const ECG_MODULE_ENTRY = "/modules/ecg/basic/lessons" as const;

/**
 * Optional “Explore” hub link to gated **core** ECG entry (same URL learners use in-app).
 * Entitlement remains enforced by {@link requireEcgModuleAccess}; does not imply Advanced ECG Program access.
 */
export function buildEcgModuleHubLinkCandidate(input: {
  pathway: ExamPathwayDefinition;
  lesson: EcgLinkedLearningLessonSnapshot;
  locale: string;
}): LinkCandidate | null {
  if (!pathwayAllowsEcgLinkedLearning(input.pathway)) return null;
  if (!lessonSignalsEcgLinkedLearning(input.lesson)) return null;

  const href = withMarketingLocale(input.locale, ECG_MODULE_ENTRY);

  return {
    kind: "hub",
    topicKey: "ecg-mastery",
    href,
    anchorText: `ECG mastery training — ${input.pathway.shortName}`,
    score: 12,
    strength: "moderate",
    localeMatch: true,
    pathwayMatch: true,
    debugReason: "ecg_module_cardiac_lesson",
  };
}
