/**
 * **Shared core + scoped variant** — how premium pathway lessons scale without “count inflation”.
 *
 * - **One stable `slug` per teachable unit** across pathways. Exam/country/role differences live in
 *   `getFullLesson(pathwayId)` / `getHubListRow(pathwayId)` (see `*-gold-standard.ts`), not as separate
 *   catalog rows that duplicate the same clinical spine.
 * - **Do not** paste near-identical `catalog.json` lessons into multiple `pathways.*.lessons` arrays just
 *   to raise lesson totals — that becomes uncontrolled duplication and erodes editorial quality.
 * - **Registry merge**: {@link prependScopedGoldCatalogLessons} prepends injectables only when the slug is
 *   absent from the pathway’s catalog slice (catalog/DB rows win on slug collision).
 * - **Order** = remediation priority for hub injection when the slug is not already in catalog.json or DB.
 */
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonQuizItem,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import {
  clinicalJudgmentHubListInput,
  CLINICAL_JUDGMENT_GOLD_SLUG,
  getClinicalJudgmentGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import {
  COPD_GOLD_STANDARD_SLUG,
  copdGoldHubListInput,
  getCopdGoldStandardLessonInput,
} from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import {
  getHighAlertMedsGoldLessonInput,
  HIGH_ALERT_MEDS_GOLD_SLUG,
  highAlertMedsGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import {
  acsGoldHubListInput,
  ACS_GOLD_SLUG,
  getAcsGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import {
  fluidsElectrolytesGoldHubListInput,
  FLUIDS_ELECTROLYTES_GOLD_SLUG,
  getFluidsElectrolytesGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import {
  getSepsisGoldLessonInput,
  SEPSIS_GOLD_SLUG,
  sepsisGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import {
  getStrokeIcpGoldLessonInput,
  STROKE_ICP_GOLD_SLUG,
  strokeIcpGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";
import {
  getShockGoldLessonInput,
  SHOCK_GOLD_SLUG,
  shockGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/shock-gold-standard";
import {
  canadianRpnHighYieldGoldHubListInput,
  CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
  getCanadianRpnHighYieldGoldLessonInput,
} from "@/lib/lessons/scoped-lessons/canadian-rpn-high-yield-gold-standard";
import {
  getObEmergenciesGoldLessonInput,
  OB_EMERGENCIES_GOLD_SLUG,
  obEmergenciesGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/ob-emergencies-gold-standard";
import {
  getPediatricTriageEmergenciesGoldLessonInput,
  PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG,
  pediatricTriageEmergenciesGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/pediatric-triage-emergencies-gold-standard";
import {
  getRenalDialysisAcuteComplicationsGoldLessonInput,
  RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG,
  renalDialysisAcuteComplicationsGoldHubListInput,
} from "@/lib/lessons/scoped-lessons/renal-dialysis-acute-complications-gold-standard";

/** Minimal lesson row shape for catalog merge (matches pathway-lesson-loader `LessonInput`). */
export type ScopedGoldLessonInput = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
};

export type ScopedGoldProvider = {
  /** Public URL slug — identical for every pathway; variants differ inside `getFullLesson`. */
  slug: string;
  topicSlug: string;
  getFullLesson: (pathwayId: string) => ScopedGoldLessonInput | null;
  getHubListRow: (pathwayId: string) => Omit<ScopedGoldLessonInput, "sections" | "preTest" | "postTest"> | null;
};

/**
 * Injectable gold lessons (shared clinical core + pathway-scoped copy). Prefer adding here over
 * duplicating spine text across `catalog.json` pathways.
 */
export const SCOPED_GOLD_PROVIDERS: ScopedGoldProvider[] = [
  {
    slug: CLINICAL_JUDGMENT_GOLD_SLUG,
    topicSlug: "prioritization-delegation",
    getFullLesson: getClinicalJudgmentGoldLessonInput,
    getHubListRow: clinicalJudgmentHubListInput,
  },
  {
    slug: SEPSIS_GOLD_SLUG,
    topicSlug: "sepsis",
    getFullLesson: getSepsisGoldLessonInput,
    getHubListRow: sepsisGoldHubListInput,
  },
  {
    slug: FLUIDS_ELECTROLYTES_GOLD_SLUG,
    topicSlug: "fluids-electrolytes",
    getFullLesson: getFluidsElectrolytesGoldLessonInput,
    getHubListRow: fluidsElectrolytesGoldHubListInput,
  },
  {
    slug: ACS_GOLD_SLUG,
    topicSlug: "cardiovascular",
    getFullLesson: getAcsGoldLessonInput,
    getHubListRow: acsGoldHubListInput,
  },
  {
    slug: HIGH_ALERT_MEDS_GOLD_SLUG,
    topicSlug: "medication-safety",
    getFullLesson: getHighAlertMedsGoldLessonInput,
    getHubListRow: highAlertMedsGoldHubListInput,
  },
  {
    slug: STROKE_ICP_GOLD_SLUG,
    topicSlug: "neurological",
    getFullLesson: getStrokeIcpGoldLessonInput,
    getHubListRow: strokeIcpGoldHubListInput,
  },
  {
    slug: SHOCK_GOLD_SLUG,
    topicSlug: "shock",
    getFullLesson: getShockGoldLessonInput,
    getHubListRow: shockGoldHubListInput,
  },
  {
    slug: CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
    topicSlug: "delegation",
    getFullLesson: getCanadianRpnHighYieldGoldLessonInput,
    getHubListRow: canadianRpnHighYieldGoldHubListInput,
  },
  {
    slug: OB_EMERGENCIES_GOLD_SLUG,
    topicSlug: "maternity",
    getFullLesson: getObEmergenciesGoldLessonInput,
    getHubListRow: obEmergenciesGoldHubListInput,
  },
  {
    slug: PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG,
    topicSlug: "pediatrics",
    getFullLesson: getPediatricTriageEmergenciesGoldLessonInput,
    getHubListRow: pediatricTriageEmergenciesGoldHubListInput,
  },
  {
    slug: RENAL_DIALYSIS_ACUTE_COMPLICATIONS_GOLD_SLUG,
    topicSlug: "renal-gu",
    getFullLesson: getRenalDialysisAcuteComplicationsGoldLessonInput,
    getHubListRow: renalDialysisAcuteComplicationsGoldHubListInput,
  },
  {
    slug: COPD_GOLD_STANDARD_SLUG,
    topicSlug: "copd",
    getFullLesson: getCopdGoldStandardLessonInput,
    getHubListRow: copdGoldHubListInput,
  },
];

/**
 * Prepend registry lessons not already present in the pathway’s catalog slice (stable slugs).
 * Keeps a single authoritative row per slug while still surfacing the lesson on every eligible pathway hub.
 */
export function prependScopedGoldCatalogLessons(pathwayId: string, fromJson: ScopedGoldLessonInput[]): ScopedGoldLessonInput[] {
  const seen = new Set(fromJson.map((l) => l.slug));
  const prepend: ScopedGoldLessonInput[] = [];
  for (const p of SCOPED_GOLD_PROVIDERS) {
    if (seen.has(p.slug)) continue;
    const full = p.getFullLesson(pathwayId);
    if (!full) continue;
    prepend.push(full);
    seen.add(p.slug);
  }
  return [...prepend, ...fromJson];
}

/** Hub metadata rows (empty sections) for injections matching optional topic filter. */
export function scopedGoldHubRowsForPathway(pathwayId: string, topicSlugsIn?: string[]): ScopedGoldLessonInput[] {
  const out: ScopedGoldLessonInput[] = [];
  for (const p of SCOPED_GOLD_PROVIDERS) {
    if (topicSlugsIn && topicSlugsIn.length > 0 && !topicSlugsIn.includes(p.topicSlug)) continue;
    const hub = p.getHubListRow(pathwayId);
    if (!hub) continue;
    out.push({ ...hub, sections: [] });
  }
  return out;
}
