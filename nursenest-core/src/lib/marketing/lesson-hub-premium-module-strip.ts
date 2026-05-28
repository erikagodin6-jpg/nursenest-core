import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  buildPremiumMarketingModuleCards,
  resolvePremiumCardHref,
  type PremiumHubModuleKey,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";

/** Mirrors exam-hub premium “study tools” row: labs → math → clinical skills → pharm → scenarios → ECG → OSCE → prioritization (order matches hub intent). */
const LESSON_HUB_PREMIUM_STRIP_KEYS: readonly PremiumHubModuleKey[] = [
  "labs",
  "med_calc",
  "clinical_skills",
  "pharmacology",
  "clinical_scenarios",
  "clinical_cases",
  "ecg",
  "osce",
  "ngn_tools",
] as const;

const FALLBACK_TITLE: Partial<Record<PremiumHubModuleKey, string>> = {
  labs: "Lab values",
  med_calc: "Medication math",
  clinical_skills: "Clinical skills",
  pharmacology: "Pharmacology",
  clinical_scenarios: "Clinical scenarios",
  clinical_cases: "Clinical cases",
  ecg: "ECG",
  osce: "OSCE",
  ngn_tools: "Prioritization & delegation",
};

export type LessonHubPremiumStripLink = { key: string; label: string; href: string };

/**
 * Compact chip links for marketing lesson hubs — same href + lock rules as {@link buildPremiumMarketingModuleCards}
 * / {@link resolvePremiumCardHref} on the pathway overview hub.
 */
export function buildLessonHubPremiumModuleStripLinks(
  pathway: ExamPathwayDefinition,
  args: {
    ecgModulePublic: boolean;
    clinicalScenariosPublic?: boolean;
    oscePublic?: boolean;
    /** Flat marketing messages (e.g. `components` shard) — used for tile titles. */
    messages: Record<string, string>;
    signedIn: boolean;
  },
): LessonHubPremiumStripLink[] {
  const { studyTools } = buildPremiumMarketingModuleCards(pathway, {
    ecgModulePublic: args.ecgModulePublic,
    ...(args.clinicalScenariosPublic !== undefined ? { clinicalScenariosPublic: args.clinicalScenariosPublic } : {}),
    ...(args.oscePublic !== undefined ? { oscePublic: args.oscePublic } : {}),
  });
  const byKey = new Map(studyTools.map((c) => [c.key, c]));
  const out: LessonHubPremiumStripLink[] = [];
  for (const key of LESSON_HUB_PREMIUM_STRIP_KEYS) {
    const card = byKey.get(key);
    if (!card || card.locked) continue;
    const href = resolvePremiumCardHref(card, args.signedIn);
    if (!href || href === "/") continue;
    const fromMessages = args.messages[card.titleKey]?.trim();
    const label =
      fromMessages ||
      FALLBACK_TITLE[key] ||
      key.replace(/_/g, " ");
    out.push({ key, label, href });
  }
  return out;
}
