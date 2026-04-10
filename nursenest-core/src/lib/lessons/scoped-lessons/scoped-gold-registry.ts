/**
 * **Shared core + scoped variant** — how premium pathway lessons scale without “count inflation”.
 *
 * **Authoring rules (net-new work)**
 * - **One `slug` = one teachable unit.** If RN US and RN CA need the same lesson, do **not** paste two full
 *   JSON blobs under `pathways.us-rn-nclex-rn` and `pathways.ca-rn-nclex-rn`. Prefer: (1) a
 *   {@link ScopedGoldProvider} with pathway logic in `getFullLesson(pathwayId)` / `getHubListRow`, or
 *   (2) a single catalog row in one pathway bucket plus registry injection for other hubs, or (3) DB +
 *   overlays — not duplicate static rows.
 * - **Variants belong in code:** exam framing, units, jurisdiction notes, and NCLEX vs REx-PN emphasis
 *   branch inside `getFullLesson`, not a second slug that repeats the same spine.
 * - **No filler:** new slugs only when there is a distinct learning outcome; never fork a lesson into
 *   A/B slugs to pad counts.
 *
 * **Merge semantics**
 * - {@link prependScopedGoldCatalogLessons} prepends registry lessons only when the slug is absent from
 *   that pathway’s catalog slice (catalog/DB rows win on slug collision).
 * - Injection order = remediation priority when the slug is missing from catalog/DB.
 *
 * **Legacy:** some pathways still list the same slug in multiple `catalog.json` buckets (maintain two
 *   copies). Do **not** add more cross-bucket duplication — consolidate when editing (see catalog
 *   redundancy test).
 *
 * **Scaling (150 → 500+ lessons per pathway):** List and API surfaces stay **O(page size)**; growth must be
 * **new distinct slugs** (real outcomes) plus **scoped providers / DB overlays** — not parallel JSON copies of
 * the same spine. See `pathway-lesson-catalog-redundancy.test.ts` for the duplication ratchet.
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
import { LAUNCH_WAVE_1_BULK_PROVIDERS } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-specs";
import { LAUNCH_WAVE_1A_PROVIDERS } from "@/lib/lessons/scoped-lessons/launch-wave-1a-high-yield-gold";
import { CASE_STUDY_CASEBOOK_PROVIDERS } from "@/lib/lessons/scoped-lessons/case-study-casebook-specs";
import { EXAM_COMPLETE_MED_SAFETY_PROVIDERS } from "@/lib/lessons/scoped-lessons/exam-complete-med-safety-specs";
import {
  getNpPrimaryCareFoundationsGoldLessonInput,
  NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
  npPrimaryCareFoundationsHubListInput,
} from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";
import {
  getNpGeriatricsPolypharmacyDeprescribingGoldLessonInput,
  NP_GERIATRICS_POLYPHARMACY_DEPRESCRIBING_GOLD_SLUG,
  npGeriatricsPolypharmacyDeprescribingHubListInput,
} from "@/lib/lessons/scoped-lessons/np-geriatrics-polypharmacy-deprescribing-gold-standard";
import {
  getNpHeartFailurePrimaryCareGoldLessonInput,
  NP_HEART_FAILURE_PRIMARY_CARE_GOLD_SLUG,
  npHeartFailurePrimaryCareHubListInput,
} from "@/lib/lessons/scoped-lessons/np-heart-failure-primary-care-gold-standard";
import {
  getNpAsthmaOutpatientGoldLessonInput,
  NP_ASTHMA_OUTPATIENT_GOLD_SLUG,
  npAsthmaOutpatientHubListInput,
} from "@/lib/lessons/scoped-lessons/np-asthma-outpatient-gold-standard";
import {
  getNpPneumoniaCapOutpatientGoldLessonInput,
  NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG,
  npPneumoniaCapOutpatientHubListInput,
} from "@/lib/lessons/scoped-lessons/np-pneumonia-cap-outpatient-gold-standard";
import {
  getNpType2DiabetesOutpatientGoldLessonInput,
  NP_TYPE2_DIABETES_OUTPATIENT_GOLD_SLUG,
  npType2DiabetesOutpatientHubListInput,
} from "@/lib/lessons/scoped-lessons/np-type2-diabetes-outpatient-gold-standard";
import {
  getNpThyroidPrimaryCareGoldLessonInput,
  NP_THYROID_PRIMARY_CARE_GOLD_SLUG,
  npThyroidPrimaryCareHubListInput,
} from "@/lib/lessons/scoped-lessons/np-thyroid-primary-care-gold-standard";
import {
  getNpObesityMetabolicManagementGoldLessonInput,
  NP_OBESITY_METABOLIC_MANAGEMENT_GOLD_SLUG,
  npObesityMetabolicManagementHubListInput,
} from "@/lib/lessons/scoped-lessons/np-obesity-metabolic-management-gold-standard";
import {
  getNpNeurologyOutpatientPrimaryCareGoldLessonInput,
  NP_NEUROLOGY_OUTPATIENT_PRIMARY_CARE_GOLD_SLUG,
  npNeurologyOutpatientPrimaryCareHubListInput,
} from "@/lib/lessons/scoped-lessons/np-neurology-outpatient-primary-care-gold-standard";
import {
  getNpMentalHealthAnxietyDepressionPtsdGoldLessonInput,
  NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG,
  npMentalHealthAnxietyDepressionPtsdHubListInput,
} from "@/lib/lessons/scoped-lessons/np-mental-health-anxiety-depression-ptsd-gold-standard";
import {
  getNpSleepInsomniaOsaPrimaryCareGoldLessonInput,
  NP_SLEEP_INSOMNIA_OSA_PRIMARY_CARE_GOLD_SLUG,
  npSleepInsomniaOsaPrimaryCareHubListInput,
} from "@/lib/lessons/scoped-lessons/np-sleep-insomnia-osa-primary-care-gold-standard";
import {
  getNpContraceptionCounselingSelectionGoldLessonInput,
  NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG,
  npContraceptionCounselingSelectionHubListInput,
} from "@/lib/lessons/scoped-lessons/np-contraception-counseling-selection-gold-standard";
import {
  getNpReproductiveScreeningPreventionGoldLessonInput,
  NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG,
  npReproductiveScreeningPreventionHubListInput,
} from "@/lib/lessons/scoped-lessons/np-reproductive-screening-prevention-gold-standard";
import {
  getNpAmbulatoryGynecCommonPresentationsGoldLessonInput,
  NP_AMBULATORY_GYNEC_COMMON_PRESENTATIONS_GOLD_SLUG,
  npAmbulatoryGynecCommonPresentationsHubListInput,
} from "@/lib/lessons/scoped-lessons/np-ambulatory-gynec-common-presentations-gold-standard";
import {
  getNpPediatricWellChildPreventionGoldLessonInput,
  NP_PEDIATRIC_WELL_CHILD_PREVENTION_GOLD_SLUG,
  npPediatricWellChildPreventionHubListInput,
} from "@/lib/lessons/scoped-lessons/np-pediatric-well-child-prevention-gold-standard";
import {
  getNpImmunizationVaccinesPrimaryCareGoldLessonInput,
  NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG,
  npImmunizationVaccinesPrimaryCareHubListInput,
} from "@/lib/lessons/scoped-lessons/np-immunization-vaccines-primary-care-gold-standard";
import {
  getNpTravelMedicinePretravelGoldLessonInput,
  NP_TRAVEL_MEDICINE_PRETRAVEL_GOLD_SLUG,
  npTravelMedicinePretravelHubListInput,
} from "@/lib/lessons/scoped-lessons/np-travel-medicine-pretravel-gold-standard";
import {
  getNpMskRheumatologyOutpatientGoldLessonInput,
  NP_MSK_RHEUMATOLOGY_OUTPATIENT_GOLD_SLUG,
  npMskRheumatologyOutpatientHubListInput,
} from "@/lib/lessons/scoped-lessons/np-msk-rheumatology-outpatient-gold-standard";
import {
  getNpAntiinfectivesStewardshipOutpatientGoldLessonInput,
  NP_ANTIINFECTIVES_STEWARDSHIP_OUTPATIENT_GOLD_SLUG,
  npAntiinfectivesStewardshipOutpatientHubListInput,
} from "@/lib/lessons/scoped-lessons/np-antiinfectives-stewardship-outpatient-gold-standard";

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
  {
    slug: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
    topicSlug: "clinical-reasoning",
    getFullLesson: getNpPrimaryCareFoundationsGoldLessonInput,
    getHubListRow: npPrimaryCareFoundationsHubListInput,
  },
  {
    slug: NP_GERIATRICS_POLYPHARMACY_DEPRESCRIBING_GOLD_SLUG,
    topicSlug: "geriatrics",
    getFullLesson: getNpGeriatricsPolypharmacyDeprescribingGoldLessonInput,
    getHubListRow: npGeriatricsPolypharmacyDeprescribingHubListInput,
  },
  {
    slug: NP_HEART_FAILURE_PRIMARY_CARE_GOLD_SLUG,
    topicSlug: "cardiovascular",
    getFullLesson: getNpHeartFailurePrimaryCareGoldLessonInput,
    getHubListRow: npHeartFailurePrimaryCareHubListInput,
  },
  {
    slug: NP_ASTHMA_OUTPATIENT_GOLD_SLUG,
    topicSlug: "respiratory",
    getFullLesson: getNpAsthmaOutpatientGoldLessonInput,
    getHubListRow: npAsthmaOutpatientHubListInput,
  },
  {
    slug: NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG,
    topicSlug: "respiratory-acute",
    getFullLesson: getNpPneumoniaCapOutpatientGoldLessonInput,
    getHubListRow: npPneumoniaCapOutpatientHubListInput,
  },
  {
    slug: NP_TYPE2_DIABETES_OUTPATIENT_GOLD_SLUG,
    topicSlug: "diabetes-metabolic",
    getFullLesson: getNpType2DiabetesOutpatientGoldLessonInput,
    getHubListRow: npType2DiabetesOutpatientHubListInput,
  },
  {
    slug: NP_THYROID_PRIMARY_CARE_GOLD_SLUG,
    topicSlug: "endocrine",
    getFullLesson: getNpThyroidPrimaryCareGoldLessonInput,
    getHubListRow: npThyroidPrimaryCareHubListInput,
  },
  {
    slug: NP_OBESITY_METABOLIC_MANAGEMENT_GOLD_SLUG,
    topicSlug: "diabetes-metabolic",
    getFullLesson: getNpObesityMetabolicManagementGoldLessonInput,
    getHubListRow: npObesityMetabolicManagementHubListInput,
  },
  {
    slug: NP_NEUROLOGY_OUTPATIENT_PRIMARY_CARE_GOLD_SLUG,
    topicSlug: "neurological",
    getFullLesson: getNpNeurologyOutpatientPrimaryCareGoldLessonInput,
    getHubListRow: npNeurologyOutpatientPrimaryCareHubListInput,
  },
  {
    slug: NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG,
    topicSlug: "mental-health",
    getFullLesson: getNpMentalHealthAnxietyDepressionPtsdGoldLessonInput,
    getHubListRow: npMentalHealthAnxietyDepressionPtsdHubListInput,
  },
  {
    slug: NP_SLEEP_INSOMNIA_OSA_PRIMARY_CARE_GOLD_SLUG,
    topicSlug: "sleep-medicine",
    getFullLesson: getNpSleepInsomniaOsaPrimaryCareGoldLessonInput,
    getHubListRow: npSleepInsomniaOsaPrimaryCareHubListInput,
  },
  {
    slug: NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG,
    topicSlug: "womens-health",
    getFullLesson: getNpContraceptionCounselingSelectionGoldLessonInput,
    getHubListRow: npContraceptionCounselingSelectionHubListInput,
  },
  {
    slug: NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG,
    topicSlug: "womens-health",
    getFullLesson: getNpReproductiveScreeningPreventionGoldLessonInput,
    getHubListRow: npReproductiveScreeningPreventionHubListInput,
  },
  {
    slug: NP_AMBULATORY_GYNEC_COMMON_PRESENTATIONS_GOLD_SLUG,
    topicSlug: "womens-health",
    getFullLesson: getNpAmbulatoryGynecCommonPresentationsGoldLessonInput,
    getHubListRow: npAmbulatoryGynecCommonPresentationsHubListInput,
  },
  {
    slug: NP_PEDIATRIC_WELL_CHILD_PREVENTION_GOLD_SLUG,
    topicSlug: "pediatrics",
    getFullLesson: getNpPediatricWellChildPreventionGoldLessonInput,
    getHubListRow: npPediatricWellChildPreventionHubListInput,
  },
  {
    slug: NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG,
    topicSlug: "pediatrics",
    getFullLesson: getNpImmunizationVaccinesPrimaryCareGoldLessonInput,
    getHubListRow: npImmunizationVaccinesPrimaryCareHubListInput,
  },
  {
    slug: NP_TRAVEL_MEDICINE_PRETRAVEL_GOLD_SLUG,
    topicSlug: "clinical-reasoning",
    getFullLesson: getNpTravelMedicinePretravelGoldLessonInput,
    getHubListRow: npTravelMedicinePretravelHubListInput,
  },
  {
    slug: NP_MSK_RHEUMATOLOGY_OUTPATIENT_GOLD_SLUG,
    topicSlug: "musculoskeletal",
    getFullLesson: getNpMskRheumatologyOutpatientGoldLessonInput,
    getHubListRow: npMskRheumatologyOutpatientHubListInput,
  },
  {
    slug: NP_ANTIINFECTIVES_STEWARDSHIP_OUTPATIENT_GOLD_SLUG,
    topicSlug: "infectious-disease",
    getFullLesson: getNpAntiinfectivesStewardshipOutpatientGoldLessonInput,
    getHubListRow: npAntiinfectivesStewardshipOutpatientHubListInput,
  },
  ...LAUNCH_WAVE_1A_PROVIDERS,
  ...LAUNCH_WAVE_1_BULK_PROVIDERS,
  ...CASE_STUDY_CASEBOOK_PROVIDERS,
  ...EXAM_COMPLETE_MED_SAFETY_PROVIDERS,
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
