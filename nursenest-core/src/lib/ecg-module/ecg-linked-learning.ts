import type { TierCode } from "@prisma/client";
import type { PathwayLesson } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { LinkCandidate } from "@/lib/linking/internal-link-types";

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
 * Marketing pillar page for ECG — primary SEO target for all ECG-related internal links.
 * /ecg-interpretation is the canonical Core ECG hub: always public, fully indexed,
 * renders without auth, and targets the highest-volume search queries
 * ("ECG interpretation for nurses", "telemetry interpretation").
 */
export const ECG_PILLAR_MARKETING_PATH = "/ecg-interpretation" as const;

/** Secondary marketing path for Advanced ECG add-on. Use when context is specifically Advanced ECG. */
export const ECG_ADVANCED_MARKETING_PATH = "/advanced-ecg-nursing" as const;

/** Clinical modules hub — discovery page for all specialty modules. */
export const CLINICAL_MODULES_HUB_PATH = "/clinical-modules" as const;

/**
 * ECG ecosystem targets — topic-specific recommendations should only point at live,
 * substantive routes. Updated to use /ecg-interpretation as the pillar
 * and ECG cluster pages for topic-specific deep links.
 */
export const ECG_ECOSYSTEM_SUBPAGE_PATHS = {
  rhythmPractice: "/ecg-practice-questions",
  strips: "/ecg/how-to-read-ecg-strips",
  stemi: "/ecg/stemi-localization",
  acls: "/ecg/ventricular-tachycardia",
  electrolyte: "/ecg/hyperkalemia-ecg-changes",
  medications: "/ecg/qt-prolongation",
  criticalCare: ECG_ADVANCED_MARKETING_PATH,
  pediatric: "/pediatric-ecg",
  telemetry: "/telemetry-nursing",
  caseSimulations: ECG_ADVANCED_MARKETING_PATH,
  afib: "/ecg/atrial-fibrillation-ecg",
  bradycardia: "/ecg/sinus-bradycardia",
  rsa: "/ecg/respiratory-sinus-arrhythmia",
} as const;

/**
 * Resolve the most relevant ECG ecosystem sub-page for a given lesson topic signal.
 * Falls back to the pillar page when no specific sub-page matches.
 */
export function resolveEcgEcosystemTargetPath(lesson: EcgLinkedLearningLessonSnapshot): string {
  const h = [lesson.title, lesson.topic, lesson.topicSlug, lesson.bodySystem].filter(Boolean).join(" ").toLowerCase();
  if (/\b(stemi|nstemi|12[\s-]*lead|myocardial infarction|mi |acute coronary|omi|posterior mi|de winter|wellens)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.stemi;
  }
  if (/\b(acls|cardiac arrest|pulseless|defibrillat|cardioversion|rosc|code blue|vfib|v[\s-]?fib|pea|asystole)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.acls;
  }
  if (/\b(hyperkalemia|hypokalemia|hypercalcemia|hypocalcemia|magnesium|electrolyte.*ecg|electrolyte.*cardiac)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.electrolyte;
  }
  if (/\b(digoxin|qt prolongation|torsades|antiarrhythm|sodium channel|tca|tricyclic|medication.*ecg|drug.*ecg)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.medications;
  }
  if (/\b(icu|critical care|bundle branch|bbb|lbbb|rbbb|sgarbossa|artifact|ectopy|pvcs?)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.criticalCare;
  }
  if (/\b(pediatric|paediatric|neonatal|infant.*ecg|ecg.*infant|congenital|wpw|lqts|brugada|svt.*child)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.pediatric;
  }
  if (/\b(telemetry|alarm|monitor.*ecg|continuous.*ecg|ecg.*monitor|st.*segment.*monitor)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.telemetry;
  }
  if (/\b(simulation|case stud|clinical scenario|ecg.*case|case.*ecg)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.caseSimulations;
  }
  if (/\b(arrhythm|rhythm|afib|aflutter|svt|vtach|vfib|heart block|paced|pacemaker malfunction)\b/.test(h)) {
    return ECG_ECOSYSTEM_SUBPAGE_PATHS.rhythmPractice;
  }
  return ECG_PILLAR_MARKETING_PATH;
}

/**
 * Varied anchor text for ECG internal links — rotate to avoid over-optimisation of a single phrase.
 * Used by {@link buildEcgModuleHubLinkCandidate} and contextual lesson-level link candidates.
 */
export const ECG_LINK_ANCHOR_VARIANTS = [
  "Advanced ECG interpretation and cardiac rhythm mastery",
  "ECG interpretation for nurses",
  "cardiac rhythm mastery module",
  "12-lead ECG training for RN and NP",
  "ECG practice system for advanced telemetry",
  "advanced ECG module",
  "ECG mastery training",
  "telemetry rhythm interpretation",
  "cardiac ECG mastery ecosystem",
] as const;

/**
 * Learner-facing recommendation copy for weak cardiac performance.
 * Surfaces in remediation flows, cardiovascular lesson completions, and telemetry-related results.
 */
export const ECG_WEAK_PERFORMANCE_RECOMMENDATION =
  "Strengthen your cardiac rhythm interpretation with the Advanced ECG Mastery ecosystem." as const;

/**
 * Optional "Explore" hub link to the ECG ecosystem — links to the most relevant sub-page
 * for the lesson topic, falling back to the pillar marketing page.
 * Entitlement remains enforced by {@link requireEcgModuleAccess}.
 */
export function buildEcgModuleHubLinkCandidate(input: {
  pathway: ExamPathwayDefinition;
  lesson: EcgLinkedLearningLessonSnapshot;
  locale: string;
}): LinkCandidate | null {
  if (!pathwayAllowsEcgLinkedLearning(input.pathway)) return null;
  if (!lessonSignalsEcgLinkedLearning(input.lesson)) return null;

  // Vary anchor text by lesson slug hash (deterministic, stable, not random)
  const slugHash = input.lesson.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const anchorText = ECG_LINK_ANCHOR_VARIANTS[slugHash % ECG_LINK_ANCHOR_VARIANTS.length]!;

  // Route to the most relevant ECG ecosystem sub-page for this lesson's topic
  const targetPath = resolveEcgEcosystemTargetPath(input.lesson);

  return {
    kind: "hub",
    topicKey: "ecg-mastery",
    href: targetPath,
    anchorText,
    score: 12,
    strength: "moderate",
    localeMatch: true,
    pathwayMatch: true,
    debugReason: "ecg_module_cardiac_lesson",
  };
}
