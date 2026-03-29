import { internalLinkMap } from "./internal-links";
import { crossProfessionConditions } from "./cross-profession-conditions";
import { seoConditions } from "./seo-conditions";
import { CAREER_CONFIGS, type CareerType } from "@shared/careers";

export interface TopicResource {
  type: "lesson" | "practice-question" | "flashcard" | "new-grad" | "career";
  title: string;
  slug: string;
  url: string;
  description?: string;
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  bodySystem: string;
  relatedLessons: TopicResource[];
  practiceQuestions: TopicResource[];
  flashcardTopics: TopicResource[];
  newGradTips: TopicResource[];
  careerPaths: TopicResource[];
  crossProfessionPerspectives: {
    profession: string;
    professionSlug: string;
    approach: string;
    lessonSlugs: string[];
  }[];
  relatedTopicSlugs: string[];
}

const BODY_SYSTEM_MAP: Record<string, string> = {
  "heart-failure": "Cardiovascular",
  "hypertension": "Cardiovascular",
  "stroke": "Neurological",
  "sepsis": "Hematology",
  "diabetes-lifespan": "Endocrine",
  "abg-basics": "Respiratory",
  "cardiac-assessment-ecg": "Cardiovascular",
  "respiratory-assessment": "Respiratory",
  "cranial-nerve-assessment": "Neurological",
  "iv-therapy": "Fundamentals",
  "preeclampsia-management": "Maternity",
  "dvt-pe": "Cardiovascular",
  "atrial-fibrillation-rn": "Cardiovascular",
  "hyperkalemia-rn": "Renal",
  "dka-management-rn": "Endocrine",
  "copd-basics-rpn": "Respiratory",
  "pneumonia-basics-rpn": "Respiratory",
  "catheterization": "Renal",
  "shock-types-recognition-rpn": "Cardiovascular",
  "hypothyroidism-basics": "Endocrine",
  "hyperthyroidism-basics": "Endocrine",
  "delirium-dementia": "Neurological",
  "viral-hepatitis": "Gastrointestinal",
  "bipolar-disorder-rn": "Mental Health",
  "aki-management-rn": "Renal",
  "ckd-management-rn": "Renal",
  "mi-acute": "Cardiovascular",
  "ards-rn": "Respiratory",
  "dic-management-rn": "Hematology",
  "increased-icp": "Neurological",
  "gestational-diabetes-rn": "Maternity",
  "blood-transfusion-rn": "Hematology",
  "meningitis-basics-rpn": "Neurological",
  "thyroid-storm-rn": "Endocrine",
  "seizure-types-priorities-rpn": "Neurological",
  "burn-management": "Integumentary",
  "anaphylaxis": "Hematology",
  "postpartum-hemorrhage-rn": "Maternity",
  "placental-abruption": "Maternity",
  "depression-rn": "Mental Health",
  "schizophrenia-rn": "Mental Health",
  "suicide-precautions-rn": "Mental Health",
  "substance-withdrawal-rn": "Mental Health",
  "hhs-management-rn": "Endocrine",
  "mechanical-ventilation-rn": "Respiratory",
  "asthma-basics-rpn": "Respiratory",
  "pulmonary-embolism-rn": "Respiratory",
  "spinal-cord-injury-rn": "Neurological",
  "wound-care-basics-rpn": "Integumentary",
  "iron-deficiency-anemia-rpn": "Hematology",
  "hemodialysis-basics-rpn": "Renal",
  "cardiogenic-shock": "Cardiovascular",
  "hypertensive-crisis-rn": "Cardiovascular",
  "metabolic-acidosis-rn": "Renal",
  "metabolic-alkalosis-rn": "Renal",
  "pain-management-rpn": "Fundamentals",
  "cdiff-management-rpn": "Gastrointestinal",
  "tb-basics-rpn": "Respiratory",
  "hiv-aids-rn": "Hematology",
  "dysrhythmias": "Cardiovascular",
  "conduction-system": "Cardiovascular",
  "cardioversion-defib": "Cardiovascular",
  "cardiac-meds": "Pharmacology",
  "aortic-dissection": "Cardiovascular",
  "cardiac-tamponade": "Cardiovascular",
  "pe-recognition": "Respiratory",
  "uti-basics-rpn": "Renal",
  "kidney-stone-basics-rpn": "Renal",
  "cirrhosis": "Gastrointestinal",
  "diverticulitis": "Gastrointestinal",
  "crohns-disease": "Gastrointestinal",
  "cholecystitis": "Gastrointestinal",
  "colorectal-cancer": "Gastrointestinal",
  "compartment-syndrome": "Musculoskeletal",
  "pad-claudication": "Cardiovascular",
  "medication-administration-safety": "Pharmacology",
  "abdominal-assessment": "Gastrointestinal",
  "oxygen-therapy-basics": "Respiratory",
  "lung-auscultation": "Respiratory",
  "tracheostomy-basics-rpn": "Respiratory",
  "chest-tube-basics-rpn": "Respiratory",
  "copd-exacerbation": "Respiratory",
  "asthma-emergency": "Respiratory",
  "ectopic-pregnancy": "Maternity",
  "fetal-monitoring-advanced": "Maternity",
  "electrolyte-safety": "Renal",
  "graves-disease-rpn": "Endocrine",
  "myasthenia-gravis-basics-rpn": "Neurological",
  "guillain-barre-rn": "Neurological",
  "adrenal-insufficiency": "Endocrine",
  "diabetic-nephropathy-rpn": "Renal",
  "atrial-flutter-rn": "Cardiovascular",
  "vtach-management": "Cardiovascular",
  "heart-block-complete": "Cardiovascular",
  "sickle-cell-rpn": "Hematology",
  "leukemia-rpn": "Hematology",
  "epiglottitis-peds": "Pediatrics",
  "febrile-seizure": "Pediatrics",
  "congenital-heart": "Pediatrics",
  "neonatal-hypoglycemia": "Pediatrics",
  "active-tb": "Respiratory",
  "parkinsons": "Neurological",
  "multiple-sclerosis-rn": "Neurological",
  "anticoagulant-safety": "Pharmacology",
  "hyponatremia-rn": "Renal",
  "myxedema-coma-rn": "Endocrine",
  "cardiac-cycle-hemodynamics": "Cardiovascular",
  "echo-cardiac-anatomy": "Cardiovascular",
  "echo-cardiac-physiology": "Cardiovascular",
  "echo-imaging-views": "Cardiovascular",
  "echo-doppler-ultrasound": "Cardiovascular",
  "echo-valvular-disease": "Cardiovascular",
  "echo-congenital-heart-defects": "Cardiovascular",
  "echo-cardiomyopathies": "Cardiovascular",
  "echo-hemodynamics": "Cardiovascular",
  "breastfeeding-basics": "Maternity",
  "trauma-algorithm-paramedic": "Emergency",
  "acls-pharmacology-paramedic": "Emergency",
  "stroke-recognition-paramedic": "Emergency",
  "sepsis-recognition-paramedic": "Emergency",
  "airway-emergencies-paramedic": "Emergency",
  "cardiac-arrest-management-paramedic": "Emergency",
  "pharmacology-field-drugs-paramedic": "Emergency",
  "pediatric-emergencies-paramedic": "Emergency",
  "ob-emergencies-paramedic": "Emergency",
  "field-triage-paramedic": "Emergency",
  "gas-exchange-physiology-rrt": "Respiratory",
  "oxygen-delivery-systems-rrt": "Respiratory",
  "abg-interpretation-rrt": "Respiratory",
  "acid-base-disorders-rrt": "Respiratory",
  "mechanical-ventilation-modes-rrt": "Respiratory",
  "ards-respiratory-failure-rrt": "Respiratory",
  "vq-mismatch-rrt": "Respiratory",
  "hemodynamic-positive-pressure-rrt": "Respiratory",
  "airway-management-rrt": "Respiratory",
  "ventilator-troubleshooting-rrt": "Respiratory",
  "pulmonary-embolism-rrt": "Respiratory",
  "pneumothorax-rrt": "Respiratory",
  "cystic-fibrosis-rrt": "Respiratory",
  "interstitial-lung-disease-rrt": "Respiratory",
  "tuberculosis-rrt": "Respiratory",
  "pleural-effusion-rrt": "Respiratory",
  "pneumonia-management-rrt": "Respiratory",
  "lung-cancer-respiratory-rrt": "Respiratory",
  "bronchodilator-pharmacology-rrt": "Pharmacology",
  "corticosteroid-pharmacology-rrt": "Pharmacology",
  "mucolytic-surfactant-pharmacology-rrt": "Pharmacology",
  "pulmonary-vasodilator-pharmacology-rrt": "Pharmacology",
  "neuromuscular-blocker-pharmacology-rrt": "Pharmacology",
  "bronchopulmonary-dysplasia-rrt": "Respiratory",
  "meconium-aspiration-syndrome-rrt": "Respiratory",
  "congenital-diaphragmatic-hernia-rrt": "Respiratory",
  "neonatal-respiratory-distress-expanded-rrt": "Respiratory",
  "prone-positioning-recruitment-rrt": "Respiratory",
  "ards-protocols-advanced-rrt": "Respiratory",
  "hematology-fundamentals-mlt": "Hematology",
  "coagulation-cascade-mlt": "Hematology",
  "blood-typing-crossmatching-mlt": "Hematology",
  "clinical-microbiology-mlt": "Hematology",
  "clinical-chemistry-mlt": "Hematology",
  "critical-value-reporting-mlt": "Hematology",
  "quality-control-mlt": "Hematology",
  "pre-analytical-errors-mlt": "Hematology",
  "urinalysis-body-fluids-mlt": "Renal",
};

const SLUG_TO_DISPLAY_NAME: Record<string, string> = {
  "heart-failure": "Heart Failure",
  "hypertension": "Hypertension",
  "stroke": "Stroke",
  "sepsis": "Sepsis",
  "diabetes-lifespan": "Diabetes Across the Lifespan",
  "abg-basics": "ABG Interpretation",
  "cardiac-assessment-ecg": "Cardiac Assessment & ECG",
  "respiratory-assessment": "Respiratory Assessment",
  "cranial-nerve-assessment": "Cranial Nerve Assessment",
  "iv-therapy": "IV Therapy",
  "preeclampsia-management": "Preeclampsia Management",
  "dvt-pe": "DVT & Pulmonary Embolism",
  "atrial-fibrillation-rn": "Atrial Fibrillation",
  "hyperkalemia-rn": "Hyperkalemia",
  "dka-management-rn": "DKA Management",
  "copd-basics-rpn": "COPD",
  "pneumonia-basics-rpn": "Pneumonia",
  "catheterization": "Catheterization",
  "shock-types-recognition-rpn": "Shock Types & Recognition",
  "hypothyroidism-basics": "Hypothyroidism",
  "hyperthyroidism-basics": "Hyperthyroidism",
  "delirium-dementia": "Delirium vs Dementia",
  "viral-hepatitis": "Viral Hepatitis",
  "bipolar-disorder-rn": "Bipolar Disorder",
  "aki-management-rn": "Acute Kidney Injury",
  "ckd-management-rn": "Chronic Kidney Disease",
  "mi-acute": "Myocardial Infarction",
  "ards-rn": "ARDS",
  "dic-management-rn": "DIC (Disseminated Intravascular Coagulation)",
  "increased-icp": "Increased ICP",
  "gestational-diabetes-rn": "Gestational Diabetes",
  "blood-transfusion-rn": "Blood Transfusion",
  "meningitis-basics-rpn": "Meningitis",
  "thyroid-storm-rn": "Thyroid Storm",
  "seizure-types-priorities-rpn": "Seizures",
  "burn-management": "Burn Management",
  "anaphylaxis": "Anaphylaxis",
  "postpartum-hemorrhage-rn": "Postpartum Hemorrhage",
  "placental-abruption": "Placental Abruption",
  "depression-rn": "Depression",
  "schizophrenia-rn": "Schizophrenia",
  "suicide-precautions-rn": "Suicide Precautions",
  "substance-withdrawal-rn": "Substance Withdrawal",
  "hhs-management-rn": "HHS (Hyperosmolar Hyperglycemic State)",
  "mechanical-ventilation-rn": "Mechanical Ventilation",
  "asthma-basics-rpn": "Asthma",
  "pulmonary-embolism-rn": "Pulmonary Embolism",
  "spinal-cord-injury-rn": "Spinal Cord Injury",
  "wound-care-basics-rpn": "Wound Care",
  "iron-deficiency-anemia-rpn": "Iron Deficiency Anemia",
  "hemodialysis-basics-rpn": "Hemodialysis",
  "cardiogenic-shock": "Cardiogenic Shock",
  "hypertensive-crisis-rn": "Hypertensive Crisis",
  "metabolic-acidosis-rn": "Metabolic Acidosis",
  "metabolic-alkalosis-rn": "Metabolic Alkalosis",
  "pain-management-rpn": "Pain Management",
  "cdiff-management-rpn": "C. difficile",
  "tb-basics-rpn": "Tuberculosis",
  "hiv-aids-rn": "HIV/AIDS",
  "dysrhythmias": "Cardiac Dysrhythmias",
  "conduction-system": "Cardiac Conduction System",
  "cardioversion-defib": "Cardioversion & Defibrillation",
  "cardiac-meds": "Cardiac Medications",
  "aortic-dissection": "Aortic Dissection",
  "cardiac-tamponade": "Cardiac Tamponade",
  "pe-recognition": "PE Recognition",
  "uti-basics-rpn": "Urinary Tract Infection",
  "kidney-stone-basics-rpn": "Kidney Stones",
  "cirrhosis": "Cirrhosis",
  "diverticulitis": "Diverticulitis",
  "crohns-disease": "Crohn's Disease",
  "cholecystitis": "Cholecystitis",
  "colorectal-cancer": "Colorectal Cancer",
  "compartment-syndrome": "Compartment Syndrome",
  "pad-claudication": "Peripheral Artery Disease",
  "medication-administration-safety": "Medication Administration Safety",
  "abdominal-assessment": "Abdominal Assessment",
  "oxygen-therapy-basics": "Oxygen Therapy",
  "lung-auscultation": "Lung Auscultation",
  "tracheostomy-basics-rpn": "Tracheostomy Care",
  "chest-tube-basics-rpn": "Chest Tube Management",
  "echo-cardiac-anatomy": "Cardiac Anatomy for Echocardiography",
  "echo-cardiac-physiology": "Cardiac Physiology for Echocardiography",
  "echo-imaging-views": "Echocardiographic Imaging Views",
  "echo-doppler-ultrasound": "Doppler Ultrasound in Echocardiography",
  "echo-valvular-disease": "Valvular Disease Assessment on Echo",
  "echo-congenital-heart-defects": "Congenital Heart Defects on Echo",
  "echo-cardiomyopathies": "Cardiomyopathies on Echocardiography",
  "echo-hemodynamics": "Hemodynamic Assessment by Echo",
};

function slugToTitle(slug: string): string {
  return SLUG_TO_DISPLAY_NAME[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bRn\b/g, "RN").replace(/\bRpn\b/g, "RPN").replace(/\bNp\b/g, "NP");
}

function getCareerPathsForTopic(slug: string): TopicResource[] {
  const resources: TopicResource[] = [];
  const relevantCareers: { careerType: CareerType; relevance: string }[] = [];

  const systemMap: Record<string, CareerType[]> = {
    "Cardiovascular": ["nursing", "criticalCare", "emergencyNursing", "paramedic"],
    "Respiratory": ["nursing", "rrt", "criticalCare", "emergencyNursing"],
    "Neurological": ["nursing", "criticalCare", "emergencyNursing", "paramedic"],
    "Renal": ["nursing", "criticalCare", "mlt"],
    "Endocrine": ["nursing", "pharmacyTech", "criticalCare"],
    "Hematology": ["nursing", "mlt", "criticalCare"],
    "Maternity": ["nursing", "emergencyNursing"],
    "Mental Health": ["nursing", "psychotherapist", "socialWorker", "addictionsCounsellor"],
    "Gastrointestinal": ["nursing", "criticalCare", "emergencyNursing"],
    "Integumentary": ["nursing", "emergencyNursing", "perioperative"],
    "Musculoskeletal": ["nursing", "emergencyNursing", "perioperative", "physicalTherapy"],
    "Pharmacology": ["nursing", "pharmacyTech", "rrt"],
    "Fundamentals": ["nursing"],
  };

  const bodySystem = BODY_SYSTEM_MAP[slug] || "General";
  const careers = systemMap[bodySystem] || ["nursing"];

  for (const careerType of careers) {
    const config = CAREER_CONFIGS[careerType];
    if (!config || !config.enabled) continue;
    relevantCareers.push({ careerType, relevance: bodySystem });
  }

  for (const { careerType } of relevantCareers) {
    const config = CAREER_CONFIGS[careerType];
    resources.push({
      type: "career",
      title: config.name,
      slug: config.slug,
      url: config.routePrefix ? `/profession/${config.slug}` : "/nursing",
      description: config.description,
    });
  }

  return resources;
}

function buildTopicFromSlug(slug: string): Topic {
  const name = slugToTitle(slug);
  const bodySystem = BODY_SYSTEM_MAP[slug] || "General";
  const links = internalLinkMap[slug] || [];

  const relatedLessons: TopicResource[] = [
    {
      type: "lesson",
      title: name,
      slug: slug,
      url: `/lessons/${slug}`,
      description: `Core lesson on ${name}`,
    },
  ];

  const relatedSlugs = new Set<string>();
  for (const link of links) {
    const targetSlug = link.target.replace("/lessons/", "");
    if (!relatedSlugs.has(targetSlug)) {
      relatedSlugs.add(targetSlug);
      relatedLessons.push({
        type: "lesson",
        title: link.anchor,
        slug: targetSlug,
        url: link.target,
        description: link.reason,
      });
    }
  }

  const seoCondition = seoConditions.find((c) => c.relatedLessonSlugs?.includes(slug) || c.slug === slug);
  const practiceQuestions: TopicResource[] = [];
  if (seoCondition) {
    practiceQuestions.push({
      type: "practice-question",
      title: `${seoCondition.name} Practice Questions`,
      slug: seoCondition.slug,
      url: `/conditions/${seoCondition.slug}`,
      description: `NCLEX-style questions on ${seoCondition.name}`,
    });
  }
  practiceQuestions.push({
    type: "practice-question",
    title: `${name} Quiz`,
    slug: slug,
    url: `/lessons/${slug}`,
    description: `End-of-lesson quiz for ${name}`,
  });

  const flashcardTopics: TopicResource[] = [
    {
      type: "flashcard",
      title: `${name} Flashcards`,
      slug: slug,
      url: "/flashcards",
      description: `Study flashcards covering ${name} key concepts`,
    },
  ];

  const newGradTips: TopicResource[] = [];
  const newGradMapping: Record<string, { tip: string; url: string }> = {
    "Cardiovascular": { tip: "ICU & Cardiac Unit Tips", url: "/new-grad/scenario/cardiac-emergency" },
    "Respiratory": { tip: "Respiratory Floor Survival Guide", url: "/new-grad/clinical-skills/respiratory-assessment" },
    "Neurological": { tip: "Neuro Unit Orientation Tips", url: "/new-grad/clinical-skills/neurological-assessment" },
    "Renal": { tip: "Dialysis Unit New Grad Guide", url: "/new-grad/unit-guide/nephrology" },
    "Endocrine": { tip: "Managing Diabetic Patients", url: "/new-grad/clinical-skills/blood-glucose-management" },
    "Maternity": { tip: "Labor & Delivery Tips", url: "/new-grad/unit-guide/labor-delivery" },
    "Mental Health": { tip: "Psych Nursing New Grad Guide", url: "/new-grad/unit-guide/mental-health" },
    "Gastrointestinal": { tip: "Medical-Surgical GI Tips", url: "/new-grad/unit-guide/medical-surgical" },
    "Hematology": { tip: "Blood Product Administration", url: "/new-grad/clinical-skills/blood-transfusion" },
    "Integumentary": { tip: "Wound Care Best Practices", url: "/new-grad/clinical-skills/wound-assessment" },
  };
  const gradTip = newGradMapping[bodySystem];
  if (gradTip) {
    newGradTips.push({
      type: "new-grad",
      title: gradTip.tip,
      slug: bodySystem.toLowerCase().replace(/\s+/g, "-"),
      url: gradTip.url,
      description: `New graduate clinical tips related to ${name}`,
    });
  }

  const careerPaths = getCareerPathsForTopic(slug);

  const crossProfessionPerspectives: Topic["crossProfessionPerspectives"] = [];
  const baseSlug = slug.replace(/-rn$|-rpn$|-basics$|-management$|-basics-rpn$/, "");
  const crossCondition = crossProfessionConditions.find((c) => {
    const condSlug = c.conditionSlug;
    return condSlug === slug || condSlug === baseSlug;
  });
  if (crossCondition) {
    for (const p of crossCondition.perspectives) {
      crossProfessionPerspectives.push({
        profession: p.profession,
        professionSlug: p.professionSlug,
        approach: p.approach,
        lessonSlugs: p.lessonSlugs,
      });
    }
  }

  const relatedTopicSlugs = Array.from(relatedSlugs).filter((s) => s in internalLinkMap).slice(0, 6);

  const description = seoCondition
    ? seoCondition.overview.slice(0, 200) + "..."
    : `Comprehensive resources and cross-platform content for ${name}, covering lessons, practice questions, flashcards, and career paths.`;

  return {
    slug,
    name,
    description,
    bodySystem,
    relatedLessons,
    practiceQuestions,
    flashcardTopics,
    newGradTips,
    careerPaths,
    crossProfessionPerspectives,
    relatedTopicSlugs,
  };
}

let _allTopics: Topic[] | null = null;

export function getAllTopics(): Topic[] {
  if (_allTopics) return _allTopics;

  const slugs = Object.keys(internalLinkMap);
  _allTopics = slugs.map(buildTopicFromSlug);
  return _allTopics;
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

export function getTopicsByBodySystem(): Record<string, Topic[]> {
  const topics = getAllTopics();
  const grouped: Record<string, Topic[]> = {};
  for (const topic of topics) {
    const system = topic.bodySystem;
    if (!grouped[system]) grouped[system] = [];
    grouped[system].push(topic);
  }
  for (const system of Object.keys(grouped)) {
    grouped[system].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

export function getTopicSlugs(): string[] {
  return Object.keys(internalLinkMap);
}

export const BODY_SYSTEM_ORDER = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Renal",
  "Endocrine",
  "Gastrointestinal",
  "Hematology",
  "Maternity",
  "Mental Health",
  "Pediatrics",
  "Emergency",
  "Musculoskeletal",
  "Integumentary",
  "Pharmacology",
  "Fundamentals",
  "General",
];

export const BODY_SYSTEM_ICONS: Record<string, string> = {
  "Cardiovascular": "Heart",
  "Respiratory": "Wind",
  "Neurological": "Brain",
  "Renal": "Droplets",
  "Endocrine": "Zap",
  "Gastrointestinal": "Activity",
  "Hematology": "Droplets",
  "Maternity": "Baby",
  "Mental Health": "Brain",
  "Pediatrics": "Baby",
  "Emergency": "Activity",
  "Musculoskeletal": "Activity",
  "Integumentary": "Eye",
  "Pharmacology": "Pill",
  "Fundamentals": "ClipboardList",
  "General": "Activity",
};

const _conditionSlugs = new Set<string>();
for (const condition of seoConditions) {
  _conditionSlugs.add(condition.slug);
  if (condition.relatedLessonSlugs) {
    for (const s of condition.relatedLessonSlugs) {
      _conditionSlugs.add(s);
    }
  }
}

const PROCEDURE_KEYWORDS = [
  "assessment", "therapy", "management", "monitoring", "administration",
  "auscultation", "basics", "recognition", "algorithm", "pharmacology",
  "safety", "cycle", "system", "fundamentals", "interpretation", "modes",
  "troubleshooting", "reporting", "control", "errors", "triage",
];

export function isConditionTopic(slug: string): boolean {
  if (_conditionSlugs.has(slug)) return true;
  for (const kw of PROCEDURE_KEYWORDS) {
    if (slug.includes(kw)) return false;
  }
  const bodySystem = BODY_SYSTEM_MAP[slug];
  if (bodySystem && !["Fundamentals", "Pharmacology"].includes(bodySystem)) {
    return true;
  }
  return false;
}
