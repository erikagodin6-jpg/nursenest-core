import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Curated slug order for marketing “sample topics” on `/lessons` pathway cards.
 * Without this, previews reflect JSON file order after scoped-gold prepend — not exam-core sequencing.
 * Unknown pathways keep catalog merge order.
 */
const US_RN_NCLEX_RN_PREVIEW_SLUG_ORDER: string[] = [
  "acute-coronary-syndrome-gold",
  "us-rn-heart-failure",
  "us-rn-dysrhythmias",
  "shock-emergencies-gold",
  "copd-clinical-judgment-gold",
  "us-rn-asthma",
  "us-rn-pneumonia",
  "stroke-increased-icp-gold",
  "seizure-precautions-rescue-meds",
  "diabetes-self-management-teaching",
  "dka-vs-hhs-priorities-hy",
  "thyroid-storm-myxedema-clues",
  "aki-prerenal-vs-intrarenal",
  "fluids-electrolytes-emergencies-gold",
  "sepsis-early-recognition-gold",
  "us-rn-infection-control",
  "preeclampsia-vs-eclampsia",
  "postpartum-hemorrhage",
  "pediatric-triage-emergencies-gold-standard",
  "suicide-risk-assessment-hy",
  "high-alert-medications-safety-gold",
  "us-rn-pain-management",
];

const CA_RN_NCLEX_RN_PREVIEW_SLUG_ORDER: string[] = [
  "acute-coronary-syndrome-gold",
  "ca-rn-heart-failure",
  "ca-rn-dysrhythmias",
  "shock-emergencies-gold",
  "copd-clinical-judgment-gold",
  "ca-rn-asthma",
  "ca-rn-pneumonia",
  "stroke-increased-icp-gold",
  "seizure-precautions-rescue-meds",
  "diabetes-self-management-teaching",
  "dka-vs-hhs-priorities-hy",
  "thyroid-storm-myxedema-clues",
  "aki-prerenal-vs-intrarenal",
  "fluids-electrolytes-emergencies-gold",
  "sepsis-early-recognition-gold",
  "ca-rn-infection-control",
  "preeclampsia-vs-eclampsia",
  "postpartum-hemorrhage",
  "pediatric-triage-emergencies-gold-standard",
  "suicide-risk-assessment-hy",
  "high-alert-medications-safety-gold",
  "ca-rn-pain-management",
];

/** PN pathways: scope-appropriate catalog rows + shared gold (not every RN catalog slug exists on PN). */
const US_LPN_NCLEX_PN_PREVIEW_SLUG_ORDER: string[] = [
  "acute-coronary-syndrome-gold",
  "us-pn-heart-failure",
  "us-pn-dysrhythmias",
  "shock-emergencies-gold",
  "copd-clinical-judgment-gold",
  "us-pn-asthma",
  "us-pn-pneumonia",
  "stroke-increased-icp-gold",
  "seizure-observation",
  "fluids-electrolytes-emergencies-gold",
  "sepsis-early-recognition-gold",
  "us-pn-infection-control",
  "postpartum-fundus-lochia",
  "pediatric-triage-emergencies-gold-standard",
  "suicide-precautions-observation",
  "high-alert-medications-safety-gold",
  "us-pn-pain-management",
];

const CA_RPN_REX_PN_PREVIEW_SLUG_ORDER: string[] = [
  "acute-coronary-syndrome-gold",
  "ca-rpn-heart-failure",
  "ca-rpn-dysrhythmias",
  "shock-emergencies-gold",
  "copd-clinical-judgment-gold",
  "ca-rpn-asthma",
  "ca-rpn-pneumonia",
  "stroke-increased-icp-gold",
  "seizure-observation",
  "fluids-electrolytes-emergencies-gold",
  "sepsis-early-recognition-gold",
  "ca-rpn-infection-control",
  "postpartum-fundus-lochia",
  "pediatric-triage-emergencies-gold-standard",
  "suicide-precautions-observation",
  "high-alert-medications-safety-gold",
  "ca-rpn-pain-management",
];

const PREVIEW_ORDER_BY_PATHWAY: Record<string, string[]> = {
  "us-rn-nclex-rn": US_RN_NCLEX_RN_PREVIEW_SLUG_ORDER,
  "ca-rn-nclex-rn": CA_RN_NCLEX_RN_PREVIEW_SLUG_ORDER,
  "us-lpn-nclex-pn": US_LPN_NCLEX_PN_PREVIEW_SLUG_ORDER,
  "ca-rpn-rex-pn": CA_RPN_REX_PN_PREVIEW_SLUG_ORDER,
};

/**
 * Reorders hub-list lessons so public marketing previews surface high-yield exam-core topics first.
 * Slugs not in the curated list keep a stable tail order (original index).
 */
export function sortPathwayLessonsForPublicPreview(pathwayId: string, lessons: PathwayLessonRecord[]): PathwayLessonRecord[] {
  const order = PREVIEW_ORDER_BY_PATHWAY[pathwayId];
  if (!order?.length) return lessons;

  const priority = new Map(order.map((slug, i) => [slug, i]));

  return [...lessons]
    .map((lesson, originalIndex) => ({ lesson, originalIndex }))
    .sort((a, b) => {
      const pa = priority.has(a.lesson.slug) ? priority.get(a.lesson.slug)! : Number.MAX_SAFE_INTEGER;
      const pb = priority.has(b.lesson.slug) ? priority.get(b.lesson.slug)! : Number.MAX_SAFE_INTEGER;
      if (pa !== pb) return pa - pb;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ lesson }) => lesson);
}
