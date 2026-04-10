/**
 * **Launch essentials** — minimum viable premium bundle per core pathway.
 * Curated slugs resolve via {@link getPathwayLesson} (DB + catalog + scoped gold); order is intentional.
 */
import { ACS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";
import { CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/canadian-rpn-high-yield-gold-standard";
import { CLINICAL_JUDGMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/clinical-judgment-prioritization-gold-standard";
import { COPD_GOLD_STANDARD_SLUG } from "@/lib/lessons/scoped-lessons/copd-gold-standard";
import { FLUIDS_ELECTROLYTES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/fluids-electrolytes-emergencies-gold-standard";
import { HIGH_ALERT_MEDS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import { OB_EMERGENCIES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/ob-emergencies-gold-standard";
import { PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/pediatric-triage-emergencies-gold-standard";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import { SHOCK_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/shock-gold-standard";
import { STROKE_ICP_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";
import { NP_GERIATRICS_POLYPHARMACY_DEPRESCRIBING_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-geriatrics-polypharmacy-deprescribing-gold-standard";
import { NP_HEART_FAILURE_PRIMARY_CARE_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-heart-failure-primary-care-gold-standard";
import { NP_ASTHMA_OUTPATIENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-asthma-outpatient-gold-standard";
import { NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-pneumonia-cap-outpatient-gold-standard";
import { NP_TYPE2_DIABETES_OUTPATIENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-type2-diabetes-outpatient-gold-standard";
import { NP_THYROID_PRIMARY_CARE_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-thyroid-primary-care-gold-standard";
import { NP_OBESITY_METABOLIC_MANAGEMENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-obesity-metabolic-management-gold-standard";
import { NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-contraception-counseling-selection-gold-standard";
import { NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-reproductive-screening-prevention-gold-standard";
import { NP_AMBULATORY_GYNEC_COMMON_PRESENTATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-ambulatory-gynec-common-presentations-gold-standard";
import { NP_PEDIATRIC_WELL_CHILD_PREVENTION_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-pediatric-well-child-prevention-gold-standard";
import { NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-immunization-vaccines-primary-care-gold-standard";
import { NP_TRAVEL_MEDICINE_PRETRAVEL_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-travel-medicine-pretravel-gold-standard";
import { NP_MSK_RHEUMATOLOGY_OUTPATIENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-msk-rheumatology-outpatient-gold-standard";
import { NP_ANTIINFECTIVES_STEWARDSHIP_OUTPATIENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-antiinfectives-stewardship-outpatient-gold-standard";

/** Editorial bucket for chips / analytics (not persisted). */
export type LaunchBundleDimension =
  | "disease_acute"
  | "pharmacology"
  | "safety_infection"
  | "prioritization"
  | "emergency"
  | "maternity"
  | "pediatrics"
  | "mental_health"
  | "case_study";

export type LaunchBundleEntry = {
  slug: string;
  dimension: LaunchBundleDimension;
};

export type PathwayLaunchBundleSpec = {
  /** pathwayId key in {@link EXAM_PATHWAYS} */
  pathwayId: string;
  headline: string;
  subhead: string;
  /** Ordered: start with judgment/safety, then emergencies, systems, specialty populations, case studies. */
  entries: LaunchBundleEntry[];
};

/** Infection / isolation — exam-complete safety family. */
const INFECTION_CTRL = "safety-family-infection-control-gold" as const;
const DELEGATION_SUP = "safety-family-delegation-supervision-gold" as const;
const ESCALATION = "safety-family-escalation-notification-gold" as const;
const DKA_HHS = "dka-hhs-hyperglycemic-emergencies-gold" as const;
const MED_INSULIN_DIABETES = "med-family-insulin-diabetes-gold" as const;

const CASE_SEPSIS = "clinical-casebook-sepsis-rapid-response-gold" as const;
const CASE_MH = "clinical-casebook-mental-health-safety-gold" as const;

/** NCLEX-RN (US + Canada): broad acute care + pharm + infection + OB/peds + case studies. */
const NCLEX_RN_LAUNCH: LaunchBundleEntry[] = [
  { slug: CLINICAL_JUDGMENT_GOLD_SLUG, dimension: "prioritization" },
  { slug: INFECTION_CTRL, dimension: "safety_infection" },
  { slug: ESCALATION, dimension: "emergency" },
  { slug: SEPSIS_GOLD_SLUG, dimension: "emergency" },
  { slug: SHOCK_GOLD_SLUG, dimension: "emergency" },
  { slug: HIGH_ALERT_MEDS_GOLD_SLUG, dimension: "pharmacology" },
  { slug: ACS_GOLD_SLUG, dimension: "disease_acute" },
  { slug: STROKE_ICP_GOLD_SLUG, dimension: "emergency" },
  { slug: FLUIDS_ELECTROLYTES_GOLD_SLUG, dimension: "emergency" },
  { slug: DKA_HHS, dimension: "disease_acute" },
  { slug: COPD_GOLD_STANDARD_SLUG, dimension: "disease_acute" },
  { slug: OB_EMERGENCIES_GOLD_SLUG, dimension: "maternity" },
  { slug: PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG, dimension: "pediatrics" },
  { slug: CASE_SEPSIS, dimension: "case_study" },
  { slug: CASE_MH, dimension: "mental_health" },
];

/** NCLEX-PN (US): scope, delegation, safety, stabilization, peds touchpoint. */
const NCLEX_PN_US_LAUNCH: LaunchBundleEntry[] = [
  { slug: CLINICAL_JUDGMENT_GOLD_SLUG, dimension: "prioritization" },
  { slug: DELEGATION_SUP, dimension: "prioritization" },
  { slug: INFECTION_CTRL, dimension: "safety_infection" },
  { slug: SEPSIS_GOLD_SLUG, dimension: "emergency" },
  { slug: SHOCK_GOLD_SLUG, dimension: "emergency" },
  { slug: HIGH_ALERT_MEDS_GOLD_SLUG, dimension: "pharmacology" },
  { slug: FLUIDS_ELECTROLYTES_GOLD_SLUG, dimension: "emergency" },
  { slug: PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG, dimension: "pediatrics" },
  { slug: DKA_HHS, dimension: "disease_acute" },
  { slug: CASE_SEPSIS, dimension: "case_study" },
];

/** REx-PN (Canada RPN): Canadian scope spine + same stabilization core. */
const REX_PN_CA_LAUNCH: LaunchBundleEntry[] = [
  { slug: CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG, dimension: "prioritization" },
  { slug: CLINICAL_JUDGMENT_GOLD_SLUG, dimension: "prioritization" },
  { slug: DELEGATION_SUP, dimension: "prioritization" },
  { slug: INFECTION_CTRL, dimension: "safety_infection" },
  { slug: SEPSIS_GOLD_SLUG, dimension: "emergency" },
  { slug: SHOCK_GOLD_SLUG, dimension: "emergency" },
  { slug: HIGH_ALERT_MEDS_GOLD_SLUG, dimension: "pharmacology" },
  { slug: FLUIDS_ELECTROLYTES_GOLD_SLUG, dimension: "emergency" },
  { slug: OB_EMERGENCIES_GOLD_SLUG, dimension: "maternity" },
  { slug: PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG, dimension: "pediatrics" },
  { slug: CASE_SEPSIS, dimension: "case_study" },
];

const FNP_SLUG = {
  differential: "fnp-differential-primary-care",
  htn: "fnp-adult-hypertension-intensification",
  pedsFever: "fnp-pediatric-fever-urgency",
  prenatal: "fnp-womens-prenatal-anemia-workup",
  adolescentMh: "fnp-adolescent-mental-health-screening",
  geriatricFalls: "fnp-geriatric-falls-syncope",
  overlayShock: "fnp-overlay-shock",
  overlaySepsis: "fnp-overlay-sepsis-infection",
} as const;

/** US FNP / Canada NP: lifespan primary care + acute overlays + pharm safety (same slug list; NP pathway variants in catalog). */
const NP_FNP_STYLE_LAUNCH: LaunchBundleEntry[] = [
  { slug: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG, dimension: "prioritization" },
  { slug: FNP_SLUG.differential, dimension: "disease_acute" },
  { slug: FNP_SLUG.prenatal, dimension: "maternity" },
  { slug: NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG, dimension: "maternity" },
  { slug: NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG, dimension: "maternity" },
  { slug: NP_AMBULATORY_GYNEC_COMMON_PRESENTATIONS_GOLD_SLUG, dimension: "maternity" },
  { slug: NP_PEDIATRIC_WELL_CHILD_PREVENTION_GOLD_SLUG, dimension: "pediatrics" },
  { slug: NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG, dimension: "safety_infection" },
  { slug: NP_TRAVEL_MEDICINE_PRETRAVEL_GOLD_SLUG, dimension: "safety_infection" },
  { slug: FNP_SLUG.pedsFever, dimension: "pediatrics" },
  { slug: FNP_SLUG.adolescentMh, dimension: "mental_health" },
  { slug: FNP_SLUG.htn, dimension: "disease_acute" },
  { slug: FNP_SLUG.geriatricFalls, dimension: "emergency" },
  { slug: NP_GERIATRICS_POLYPHARMACY_DEPRESCRIBING_GOLD_SLUG, dimension: "pharmacology" },
  { slug: FNP_SLUG.overlayShock, dimension: "emergency" },
  { slug: FNP_SLUG.overlaySepsis, dimension: "emergency" },
  { slug: DKA_HHS, dimension: "disease_acute" },
  { slug: NP_TYPE2_DIABETES_OUTPATIENT_GOLD_SLUG, dimension: "disease_acute" },
  { slug: NP_OBESITY_METABOLIC_MANAGEMENT_GOLD_SLUG, dimension: "disease_acute" },
  { slug: NP_THYROID_PRIMARY_CARE_GOLD_SLUG, dimension: "disease_acute" },
  { slug: MED_INSULIN_DIABETES, dimension: "pharmacology" },
  { slug: ACS_GOLD_SLUG, dimension: "disease_acute" },
  { slug: COPD_GOLD_STANDARD_SLUG, dimension: "disease_acute" },
  { slug: NP_HEART_FAILURE_PRIMARY_CARE_GOLD_SLUG, dimension: "disease_acute" },
  { slug: NP_ASTHMA_OUTPATIENT_GOLD_SLUG, dimension: "disease_acute" },
  { slug: NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG, dimension: "disease_acute" },
  { slug: NP_MSK_RHEUMATOLOGY_OUTPATIENT_GOLD_SLUG, dimension: "disease_acute" },
  { slug: NP_ANTIINFECTIVES_STEWARDSHIP_OUTPATIENT_GOLD_SLUG, dimension: "pharmacology" },
  { slug: HIGH_ALERT_MEDS_GOLD_SLUG, dimension: "pharmacology" },
  { slug: CLINICAL_JUDGMENT_GOLD_SLUG, dimension: "prioritization" },
];

export const PATHWAY_LAUNCH_BUNDLES: PathwayLaunchBundleSpec[] = [
  {
    pathwayId: "us-rn-nclex-rn",
    headline: "Launch essentials — NCLEX-RN",
    subhead:
      "Start here: judgment, infection control, stabilization, high-yield meds, core disease paths, maternity & peds anchors, and case-style practice. Everything below is the full library.",
    entries: NCLEX_RN_LAUNCH,
  },
  {
    pathwayId: "ca-rn-nclex-rn",
    headline: "Launch essentials — NCLEX-RN (Canada)",
    subhead:
      "Same premium spine as US RN, authored for Canadian practice language and units. Browse the full hub for every published lesson.",
    entries: NCLEX_RN_LAUNCH,
  },
  {
    pathwayId: "us-lpn-nclex-pn",
    headline: "Launch essentials — NCLEX-PN",
    subhead:
      "Scope-safe prioritization, delegation, infection control, emergency recognition, fluids, and pediatric triage—plus a case study. Dig into Client Needs below for the complete list.",
    entries: NCLEX_PN_US_LAUNCH,
  },
  {
    pathwayId: "ca-rpn-rex-pn",
    headline: "Launch essentials — REx-PN",
    subhead:
      "Canadian RPN scope and collaboration first, then the same stabilization spine (sepsis, shock, meds, fluids) with OB/peds anchors and a case study.",
    entries: REX_PN_CA_LAUNCH,
  },
  {
    pathwayId: "us-np-fnp",
    headline: "Launch essentials — Family NP",
    subhead:
      "Breadth across lifespan: differentials, women’s health, pediatrics, adolescent mental health, adult chronic care, geriatrics, and acute overlays—plus metabolic/pharm safety. The explorer below lists every lesson.",
    entries: NP_FNP_STYLE_LAUNCH,
  },
  {
    pathwayId: "ca-np-cnple",
    headline: "Launch essentials — Canadian NP",
    subhead:
      "Primary-care NP spine (lifespan + acute overlays) aligned to the CNPLE track as content lands. Resolved lessons appear here automatically; the full catalog remains browsable below.",
    entries: NP_FNP_STYLE_LAUNCH,
  },
  {
    pathwayId: "us-np-agpcnp",
    headline: "Launch essentials — Adult-Gerontology Primary Care NP",
    subhead:
      "Same primary-care spine as Family NP: differentials, women’s health, pediatrics, adolescent mental health, adult chronic care, geriatrics, and acute overlays—plus metabolic/pharm safety.",
    entries: NP_FNP_STYLE_LAUNCH,
  },
  {
    pathwayId: "us-np-whnp",
    headline: "Launch essentials — Women’s Health NP",
    subhead:
      "Primary-care NP bundle with women’s-health anchors; full library includes lifespan topics and acute overlays below.",
    entries: NP_FNP_STYLE_LAUNCH,
  },
  {
    pathwayId: "us-np-pnp-pc",
    headline: "Launch essentials — Pediatric Primary Care NP",
    subhead:
      "Primary-care NP bundle with pediatric anchors; full library includes lifespan topics and acute overlays below.",
    entries: NP_FNP_STYLE_LAUNCH,
  },
];

const BY_ID = new Map(PATHWAY_LAUNCH_BUNDLES.map((s) => [s.pathwayId, s] as const));

export function getLaunchBundleSpec(pathwayId: string): PathwayLaunchBundleSpec | null {
  return BY_ID.get(pathwayId) ?? null;
}

/** Human-readable dimension labels for hub chips. */
export const LAUNCH_BUNDLE_DIMENSION_LABEL: Record<LaunchBundleDimension, string> = {
  disease_acute: "Acute / chronic disease",
  pharmacology: "Pharmacology",
  safety_infection: "Safety & infection",
  prioritization: "Prioritization & delegation",
  emergency: "Emergency & stabilization",
  maternity: "Maternity",
  pediatrics: "Pediatrics",
  mental_health: "Mental health",
  case_study: "Case study",
};
