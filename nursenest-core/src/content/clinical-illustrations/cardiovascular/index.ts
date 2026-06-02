export type ClinicalIllustrationCategory =
  | "heart-failure"
  | "acute-coronary-syndrome"
  | "myocardial-infarction"
  | "coronary-artery-disease"
  | "hypertension"
  | "atrial-fibrillation"
  | "cardiac-output-hemodynamics"
  | "shock-states"
  | "valve-disorders"
  | "ecg-interpretation-basics"
  | "cardiac-conduction-system"
  | "heart-anatomy-blood-flow"
  | "raas-activation"
  | "cardiac-medication-mechanisms"
  | "perfusion-disorders";

export type ClinicalIllustrationAudienceTier = "rn" | "pn" | "np" | "allied";

export type ClinicalIllustrationEntry = {
  id: ClinicalIllustrationCategory;
  title: string;
  publicPath: `/clinical-illustrations/cardiovascular/${string}.svg`;
  alt: string;
  caption: string;
  tags: readonly string[];
  audienceTiers: readonly ClinicalIllustrationAudienceTier[];
  rnSeedSlugs: readonly string[];
  reuseSlugs: readonly string[];
  advancedOverlayAvailable?: boolean;
};

export const CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS: readonly ClinicalIllustrationEntry[] = [
  {
    id: "heart-failure",
    title: "Heart Failure",
    publicPath: "/clinical-illustrations/cardiovascular/heart-failure.svg",
    alt: "Heart failure mechanism illustration showing reduced forward flow and pulmonary congestion",
    caption: "Heart failure — congestion, perfusion, and escalation cues",
    tags: ["heart failure", "chf", "volume overload", "pulmonary congestion"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["heart-failure-nursing-priorities-hy"],
    reuseSlugs: ["np-heart-failure-primary-care-gold", "bp26-carpn-x003-heart-failure-discharge-teaching", "bp26-uslpn-pa-chf-volume"],
    advancedOverlayAvailable: true,
  },
  {
    id: "acute-coronary-syndrome",
    title: "Acute Coronary Syndrome",
    publicPath: "/clinical-illustrations/cardiovascular/acute-coronary-syndrome.svg",
    alt: "Acute coronary syndrome illustration showing unstable plaque, ischemia, and chest pain triage cues",
    caption: "ACS — unstable plaque, ischemic symptoms, and rapid triage",
    tags: ["acs", "chest pain", "unstable angina", "ischemia", "stemi", "nstemi"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["acute-coronary-syndrome-gold", "clinical-casebook-acs-chest-pain-gold"],
    reuseSlugs: [
      "bp26-carpn-x001-stemi-vs-nstemi-first-nursing-moves",
      "bp26-carpn-x002-angina-vs-infarction-data-that-changes-r",
      "bp26-usnp-pad-000-safety_and_infection-cardiovascular",
    ],
    advancedOverlayAvailable: true,
  },
  {
    id: "myocardial-infarction",
    title: "Myocardial Infarction",
    publicPath: "/clinical-illustrations/cardiovascular/myocardial-infarction.svg",
    alt: "Myocardial infarction illustration showing coronary occlusion, myocardial injury, and troponin release",
    caption: "Myocardial infarction — occlusion, injury, and biomarker reasoning",
    tags: ["myocardial infarction", "mi", "troponin", "stemi", "nstemi", "infarction"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["acute-myocardial-infarction-troponin"],
    reuseSlugs: ["bp26-carpn-x001-stemi-vs-nstemi-first-nursing-moves"],
  },
  {
    id: "coronary-artery-disease",
    title: "Coronary Artery Disease",
    publicPath: "/clinical-illustrations/cardiovascular/coronary-artery-disease.svg",
    alt: "Coronary artery disease illustration showing plaque narrowing and oxygen supply-demand mismatch",
    caption: "CAD — plaque burden and supply-demand mismatch",
    tags: ["cad", "coronary artery disease", "angina", "atherosclerosis", "plaque"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: [],
    reuseSlugs: ["bp26-carpn-x002-angina-vs-infarction-data-that-changes-r"],
  },
  {
    id: "hypertension",
    title: "Hypertension",
    publicPath: "/clinical-illustrations/cardiovascular/hypertension.svg",
    alt: "Hypertension illustration showing high afterload and end-organ strain",
    caption: "Hypertension — afterload, crisis cues, and follow-up priorities",
    tags: ["hypertension", "hypertensive", "blood pressure", "afterload", "antihypertensive"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["hypertensive-crisis-vs-urgency", "med-family-antihypertensives-gold"],
    reuseSlugs: ["bp26-carpn-pa-htn-crisis", "fnp-adult-hypertension-intensification"],
    advancedOverlayAvailable: true,
  },
  {
    id: "atrial-fibrillation",
    title: "Atrial Fibrillation",
    publicPath: "/clinical-illustrations/cardiovascular/atrial-fibrillation.svg",
    alt: "Atrial fibrillation illustration showing irregular atrial impulses, rate control, and stroke prevention cues",
    caption: "Atrial fibrillation — irregular rhythm, rate control, and embolic risk",
    tags: ["atrial fibrillation", "afib", "rate control", "stroke prevention", "anticoagulation"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["atrial-fibrillation-rate-control", "atrial-fibrillation-stroke-prevention-gold"],
    reuseSlugs: ["bp26-carpn-pa-afib-rate"],
    advancedOverlayAvailable: true,
  },
  {
    id: "cardiac-output-hemodynamics",
    title: "Cardiac Output and Hemodynamics",
    publicPath: "/clinical-illustrations/cardiovascular/cardiac-output-hemodynamics.svg",
    alt: "Cardiac output and hemodynamics illustration showing preload, afterload, contractility, heart rate, and perfusion",
    caption: "Hemodynamics — cardiac output, preload, afterload, and perfusion",
    tags: ["cardiac output", "hemodynamics", "preload", "afterload", "contractility", "cvp", "map", "pawp"],
    audienceTiers: ["rn", "np"],
    rnSeedSlugs: ["phlebostatic-axis-nclex-rn", "shock-recognition-fluids"],
    reuseSlugs: ["hemodynamic-monitoring-cvp-map-pawp", "cardiac-output-stroke-volume-nclex-rn"],
    advancedOverlayAvailable: true,
  },
  {
    id: "shock-states",
    title: "Shock States",
    publicPath: "/clinical-illustrations/cardiovascular/shock-states.svg",
    alt: "Shock states illustration showing low perfusion, compensatory tachycardia, and failing blood pressure",
    caption: "Shock — low perfusion, compensation, and escalation triggers",
    tags: ["shock", "hypoperfusion", "map", "resuscitation", "perfusion"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["shock-recognition-fluids", "shock-emergencies-gold", "med-family-emergency-response-gold"],
    reuseSlugs: ["bp26-uslpn-pa-shock-classify", "fnp-overlay-shock"],
    advancedOverlayAvailable: true,
  },
  {
    id: "valve-disorders",
    title: "Valve Disorders",
    publicPath: "/clinical-illustrations/cardiovascular/valve-disorders.svg",
    alt: "Valve disorders illustration showing stenosis, regurgitation, and pressure-volume overload",
    caption: "Valve disorders — stenosis, regurgitation, and overload patterns",
    tags: ["valve", "stenosis", "regurgitation", "murmur", "cabg", "tamponade", "pericarditis", "endocarditis"],
    audienceTiers: ["rn", "np"],
    rnSeedSlugs: ["endocarditis-blood-cultures", "pericarditis-ecg-clues", "cardiac-tamponade-nclex-rn", "cabg-and-postoperative-cabg-complications-nclex-rn"],
    reuseSlugs: [],
  },
  {
    id: "ecg-interpretation-basics",
    title: "ECG Interpretation Basics",
    publicPath: "/clinical-illustrations/cardiovascular/ecg-interpretation-basics.svg",
    alt: "ECG interpretation illustration showing P wave, QRS complex, T wave, and rhythm recognition cues",
    caption: "ECG basics — P-QRS-T sequence and rhythm recognition",
    tags: ["ecg", "ekg", "rhythm", "p qrs t", "troponin", "magnesium arrhythmia"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["pericarditis-ecg-clues", "magnesium-arrhythmia-risk"],
    reuseSlugs: ["bp26-uslpn-pa-hyperk-emerg"],
  },
  {
    id: "cardiac-conduction-system",
    title: "Cardiac Conduction System",
    publicPath: "/clinical-illustrations/cardiovascular/cardiac-conduction-system.svg",
    alt: "Cardiac conduction system illustration showing SA node, AV node, bundle branches, and Purkinje fibers",
    caption: "Conduction system — SA node through Purkinje fibers",
    tags: ["conduction", "av block", "pacemaker", "arrhythmia", "rate rhythm"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["atrial-fibrillation-rate-control"],
    reuseSlugs: ["bp26-carpn-x004-pacemaker-site-monitoring"],
  },
  {
    id: "heart-anatomy-blood-flow",
    title: "Heart Anatomy and Blood Flow",
    publicPath: "/clinical-illustrations/cardiovascular/heart-anatomy-blood-flow.svg",
    alt: "Heart anatomy and blood flow illustration showing right heart to lungs and left heart to systemic circulation",
    caption: "Heart anatomy — right-heart, lung, and systemic blood flow",
    tags: ["heart anatomy", "blood flow", "cardiovascular", "circulation"],
    audienceTiers: ["rn", "pn", "np", "allied"],
    rnSeedSlugs: [],
    reuseSlugs: [],
  },
  {
    id: "raas-activation",
    title: "RAAS Activation",
    publicPath: "/clinical-illustrations/cardiovascular/raas-activation.svg",
    alt: "RAAS activation illustration showing renin, angiotensin II, aldosterone, vasoconstriction, and volume retention",
    caption: "RAAS — vasoconstriction and volume retention mechanisms",
    tags: ["raas", "ace inhibitor", "arb", "aldosterone", "diuretic", "heart failure", "hypertension"],
    audienceTiers: ["rn", "np"],
    rnSeedSlugs: ["med-family-antihypertensives-gold", "heart-failure-nursing-priorities-hy"],
    reuseSlugs: ["np-heart-failure-primary-care-gold", "fnp-adult-hypertension-intensification"],
    advancedOverlayAvailable: true,
  },
  {
    id: "cardiac-medication-mechanisms",
    title: "Cardiac Medication Mechanisms",
    publicPath: "/clinical-illustrations/cardiovascular/cardiac-medication-mechanisms.svg",
    alt: "Cardiac medication mechanisms illustration showing rate control, preload, afterload, rhythm, and ischemia safety",
    caption: "Cardiac medications — rate, rhythm, preload, and afterload effects",
    tags: ["cardiac medications", "beta blocker", "calcium channel blocker", "digoxin", "nitrates", "diuretic", "antihypertensive"],
    audienceTiers: ["rn", "pn", "np"],
    rnSeedSlugs: ["med-family-cardiac-gold", "cardiac-glycosides-toxicity", "med-family-antihypertensives-gold"],
    reuseSlugs: ["bp26-carpn-x012-beta-blocker-hold-peri-op-considerations", "bp26-carpn-x013-diuretic-teaching-orthostasis"],
    advancedOverlayAvailable: true,
  },
  {
    id: "perfusion-disorders",
    title: "Perfusion Disorders",
    publicPath: "/clinical-illustrations/cardiovascular/perfusion-disorders.svg",
    alt: "Perfusion disorders illustration showing oxygen delivery gap, cool extremities, low urine output, and circulation risk",
    caption: "Perfusion disorders — oxygen delivery and circulation risk cues",
    tags: ["perfusion", "dvt", "pe", "vascular", "embolism", "cold extremities", "low urine output"],
    audienceTiers: ["rn", "pn", "np", "allied"],
    rnSeedSlugs: ["dvt-pe-nursing-priorities", "pulmonary-embolism-nclex-rn", "pulmonary-embolism-recognition-gold", "abdominal-aortic-aneurysm-nclex-rn"],
    reuseSlugs: ["bp26-uslpn-rr-vte-mechanical", "bp26-carpn-x005-cardiac-catheterization-post-procedure-c"],
  },
];

function normalizeText(raw: string | null | undefined): string {
  return (raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function allMappedSlugs(entry: ClinicalIllustrationEntry): readonly string[] {
  return [...entry.rnSeedSlugs, ...entry.reuseSlugs];
}

export function resolveCardiovascularClinicalIllustration({
  slug,
  topic,
  topicSlug,
  bodySystem,
}: {
  slug?: string | null;
  topic?: string | null;
  topicSlug?: string | null;
  bodySystem?: string | null;
}): ClinicalIllustrationEntry | null {
  const normalizedSlug = normalizeText(slug);
  const normalizedTopicSlug = normalizeText(topicSlug);

  for (const entry of CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS) {
    if (
      allMappedSlugs(entry).some((candidate) => {
        const normalizedCandidate = normalizeText(candidate);
        return normalizedCandidate && (normalizedCandidate === normalizedSlug || normalizedCandidate === normalizedTopicSlug);
      })
    ) {
      return entry;
    }
  }

  const haystack = [topic, topicSlug, bodySystem].map(normalizeText).filter(Boolean).join(" ");
  if (!haystack) return null;
  if (!/(cardio|heart|coronary|atrial|fibrillation|hypertension|shock|perfusion|hemodynamic|ecg|arrhythmia|vascular|embolism|troponin|valve|afterload|preload)/.test(haystack)) {
    return null;
  }

  const keywordMatches = CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS.filter((entry) =>
    entry.tags.some((tag) => haystack.includes(normalizeText(tag))),
  );
  if (keywordMatches.length > 0) {
    return keywordMatches[0];
  }

  if (haystack.includes("cardiovascular")) return CARDIOVASCULAR_CLINICAL_ILLUSTRATIONS.find((entry) => entry.id === "heart-anatomy-blood-flow") ?? null;
  return null;
}
