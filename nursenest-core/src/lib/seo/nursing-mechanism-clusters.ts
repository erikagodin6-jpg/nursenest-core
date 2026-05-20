import {
  getNursingMechanismExplainerDraft,
  isNursingMechanismExplainerPublishable,
} from "@/content/nursing-mechanism-explainers";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

export const NURSING_MECHANISM_CANONICAL_BASE_PATH = "/nursing-mechanisms";

export const NURSING_MECHANISM_TOPIC_AREAS = [
  "pathophysiology mechanism explainers",
  "nursing clinical interpretation",
  "electrolyte physiology",
  "acid/base disorders",
  "respiratory compensation",
  "endocrine disorders",
  "hemodynamics",
  "renal physiology",
  "ventilator interpretation",
  "ABG interpretation",
  "fluid/electrolyte nursing care",
] as const;

export const NURSING_MECHANISM_TIERS = ["RN", "RPN/PN", "NP", "Allied"] as const;

export const NURSING_MECHANISM_EXAMS = [
  "NCLEX-RN",
  "REx-PN",
  "NCLEX-PN",
  "CNPLE",
  "FNP",
  "AGPCNP",
  "PMHNP",
  "WHNP",
  "PNP-PC",
] as const;

export const NURSING_MECHANISM_STATUSES = ["planned", "draft", "published", "hidden"] as const;

export type NursingMechanismTopicArea = (typeof NURSING_MECHANISM_TOPIC_AREAS)[number];
export type NursingMechanismTier = (typeof NURSING_MECHANISM_TIERS)[number];
export type NursingMechanismExam = (typeof NURSING_MECHANISM_EXAMS)[number];
export type NursingMechanismStatus = (typeof NURSING_MECHANISM_STATUSES)[number];

export type NursingMechanismCluster = {
  id: string;
  topicArea: NursingMechanismTopicArea;
  targetQueryPatterns: readonly string[];
  suggestedTitle: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  tierRelevance: readonly NursingMechanismTier[];
  examRelevance: readonly NursingMechanismExam[];
  relatedLessons: readonly string[];
  relatedCalculatorsTools: readonly string[];
  relatedPracticeCatHooks: readonly string[];
  internalLinkAnchors: readonly { label: string; href: string }[];
  seoPriority: 1 | 2 | 3 | 4 | 5;
  status: NursingMechanismStatus;
};

type ClusterInput = Omit<NursingMechanismCluster, "id" | "metaTitle" | "metaDescription" | "internalLinkAnchors"> & {
  id?: string;
  metaTitle?: string;
  metaDescription?: string;
  internalLinkAnchors?: readonly { label: string; href: string }[];
};

const defaultLessons = [
  "/us/rn/nclex-rn/lessons/fluid-balance",
  "/canada/pn/rex-pn/lessons/fluid-balance",
] as const;

const defaultTools = ["/tools/lab-values", "/tools/med-math"] as const;

const defaultPractice = [
  "/question-bank",
  "/practice-exams",
  "/app/dashboard",
] as const;

function makeCluster(input: ClusterInput): NursingMechanismCluster {
  const path = `${NURSING_MECHANISM_CANONICAL_BASE_PATH}/${input.slug}`;
  return {
    id: input.id ?? input.slug,
    ...input,
    metaTitle: input.metaTitle ?? `${input.suggestedTitle} | Nursing Mechanism Explainer | NurseNest`,
    metaDescription:
      input.metaDescription ??
      `${input.suggestedTitle} explained for nursing assessment, clinical interpretation, and exam-style reasoning.`,
    relatedLessons: input.relatedLessons.length > 0 ? input.relatedLessons : defaultLessons,
    relatedCalculatorsTools: input.relatedCalculatorsTools.length > 0 ? input.relatedCalculatorsTools : defaultTools,
    relatedPracticeCatHooks: input.relatedPracticeCatHooks.length > 0 ? input.relatedPracticeCatHooks : defaultPractice,
    internalLinkAnchors:
      input.internalLinkAnchors ??
      [
        { label: "Practice related nursing questions", href: "/question-bank" },
        { label: "Review fluid and electrolyte lessons", href: "/us/rn/nclex-rn/lessons" },
        { label: "Use NurseNest lab value tools", href: "/tools/lab-values" },
        { label: "Open this mechanism explainer", href: path },
      ],
  };
}

export const NURSING_MECHANISM_CLUSTERS = [
  makeCluster({
    topicArea: "electrolyte physiology",
    targetQueryPatterns: ["why hyperkalemia affects the heart", "hyperkalemia cardiac mechanism nursing"],
    suggestedTitle: "Why Hyperkalemia Affects the Heart: Membrane Potential, ECG Risk, and Nursing Priorities",
    slug: "why-hyperkalemia-affects-the-heart-nursing-mechanism",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/fluid-balance", "/canada/pn/rex-pn/lessons/fluid-balance"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "published",
  }),
  makeCluster({
    topicArea: "electrolyte physiology",
    targetQueryPatterns: ["hyperkalemia vs hypokalemia ECG changes", "potassium ECG changes nursing"],
    suggestedTitle: "Hyperkalemia vs Hypokalemia ECG Changes for Nurses: What the Potassium Shift Does",
    slug: "hyperkalemia-vs-hypokalemia-ecg-changes-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/fluid-balance", "/us/rn/nclex-rn/lessons/cardiac-arrhythmias"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "draft",
  }),
  makeCluster({
    topicArea: "pathophysiology mechanism explainers",
    targetQueryPatterns: ["why burns cause hyperkalemia", "burn injury hyperkalemia mechanism nursing"],
    suggestedTitle: "Why Burns Cause Hyperkalemia: Cell Injury, Fluid Shifts, and Early Nursing Assessment",
    slug: "why-burns-cause-hyperkalemia-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/fluid-balance", "/us/rn/nclex-rn/lessons/burns"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "draft",
  }),
  makeCluster({
    topicArea: "renal physiology",
    targetQueryPatterns: ["why AKI causes metabolic acidosis", "acute kidney injury metabolic acidosis nursing"],
    suggestedTitle: "Why AKI Causes Metabolic Acidosis: Hydrogen Retention, Bicarbonate Loss, and Nursing Clues",
    slug: "why-aki-causes-metabolic-acidosis-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/acute-kidney-injury", "/us/rn/nclex-rn/lessons/fluid-balance"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "draft",
  }),
  makeCluster({
    topicArea: "endocrine disorders",
    targetQueryPatterns: ["why hyperglycemia causes osmotic diuresis", "osmotic diuresis mechanism nursing"],
    suggestedTitle: "Why Hyperglycemia Causes Osmotic Diuresis: Glucose, Water Loss, and Dehydration Cues",
    slug: "why-hyperglycemia-causes-osmotic-diuresis-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/diabetes-mellitus", "/us/rn/nclex-rn/lessons/fluid-balance"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "published",
  }),
  makeCluster({
    topicArea: "respiratory compensation",
    targetQueryPatterns: ["why COPD causes barrel chest", "barrel chest COPD mechanism nursing"],
    suggestedTitle: "Why COPD Causes Barrel Chest: Air Trapping, Hyperinflation, and Nursing Interpretation",
    slug: "why-copd-causes-barrel-chest-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/copd", "/canada/pn/rex-pn/lessons/copd"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 2,
    status: "published",
  }),
  makeCluster({
    topicArea: "acid/base disorders",
    targetQueryPatterns: ["Kussmaul respirations mechanism", "why DKA causes Kussmaul breathing"],
    suggestedTitle: "Kussmaul Respirations Mechanism: Why Metabolic Acidosis Changes Breathing Pattern",
    slug: "kussmaul-respirations-mechanism-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/diabetic-ketoacidosis", "/us/rn/nclex-rn/lessons/abg-interpretation"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "published",
  }),
  makeCluster({
    topicArea: "endocrine disorders",
    targetQueryPatterns: ["SIADH vs diabetes insipidus nursing", "SIADH vs DI comparison"],
    suggestedTitle: "SIADH vs Diabetes Insipidus: ADH, Urine Output, Sodium, and Nursing Assessment",
    slug: "siadh-vs-diabetes-insipidus-nursing-mechanism",
    tierRelevance: ["RN", "RPN/PN", "NP"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/fluid-balance", "/us/rn/nclex-rn/lessons/endocrine-disorders"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "published",
  }),
  makeCluster({
    topicArea: "acid/base disorders",
    targetQueryPatterns: ["pyloric stenosis hypochloremic hypokalemic metabolic alkalosis", "pyloric stenosis acid base nursing"],
    suggestedTitle: "Why Pyloric Stenosis Causes Hypochloremic Hypokalemic Metabolic Alkalosis",
    slug: "pyloric-stenosis-hypochloremic-hypokalemic-metabolic-alkalosis",
    tierRelevance: ["RN", "RPN/PN", "NP"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/pediatric-gi-disorders", "/us/rn/nclex-rn/lessons/abg-interpretation"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 2,
    status: "draft",
  }),
  makeCluster({
    topicArea: "acid/base disorders",
    targetQueryPatterns: ["respiratory acidosis vs metabolic acidosis", "acid base acidosis comparison nursing"],
    suggestedTitle: "Respiratory Acidosis vs Metabolic Acidosis: ABG Clues and Nursing Priorities",
    slug: "respiratory-acidosis-vs-metabolic-acidosis-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/abg-interpretation", "/us/rn/nclex-rn/lessons/copd"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "published",
  }),
  makeCluster({
    topicArea: "respiratory compensation",
    targetQueryPatterns: ["respiratory compensation for metabolic acidosis", "why breathing changes in metabolic acidosis"],
    suggestedTitle: "Respiratory Compensation for Metabolic Acidosis: What Nurses Should Notice First",
    slug: "respiratory-compensation-for-metabolic-acidosis-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/abg-interpretation", "/us/rn/nclex-rn/lessons/diabetic-ketoacidosis"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "ABG interpretation",
    targetQueryPatterns: ["ABG interpretation for nurses", "ABG interpretation nursing step by step"],
    suggestedTitle: "ABG Interpretation for Nurses: pH, CO2, HCO3, Compensation, and Priority Cues",
    slug: "abg-interpretation-for-nurses-step-by-step",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/abg-interpretation", "/canada/pn/rex-pn/lessons/abg-interpretation"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "fluid/electrolyte nursing care",
    targetQueryPatterns: ["fluid overload vs dehydration assessment nursing", "fluid deficit excess nursing assessment"],
    suggestedTitle: "Fluid Overload vs Dehydration Assessment: Nursing Cues, Labs, and Priority Actions",
    slug: "fluid-overload-vs-dehydration-assessment-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/fluid-balance", "/canada/pn/rex-pn/lessons/fluid-balance"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "nursing clinical interpretation",
    targetQueryPatterns: ["lab values interpretation for nurses", "how nurses interpret lab values"],
    suggestedTitle: "Lab Values Interpretation for Nurses: Trending, Safety Thresholds, and Clinical Context",
    slug: "lab-values-interpretation-for-nurses-clinical-context",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PMHNP", "WHNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/fluid-balance", "/us/rn/nclex-rn/lessons/lab-values"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "hemodynamics",
    targetQueryPatterns: ["hemodynamic shock types nursing", "shock types preload afterload cardiac output"],
    suggestedTitle: "Hemodynamic Shock Types for Nurses: Preload, Afterload, Contractility, and Perfusion Clues",
    slug: "hemodynamic-shock-types-nursing-preload-afterload",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/shock", "/us/rn/nclex-rn/lessons/sepsis"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "ventilator interpretation",
    targetQueryPatterns: ["ventilator alarms for nurses", "high pressure low pressure ventilator alarms nursing"],
    suggestedTitle: "Ventilator Alarms for Nurses: High Pressure, Low Pressure, Oxygen, and Apnea Clues",
    slug: "ventilator-alarms-for-nurses-clinical-interpretation",
    tierRelevance: ["RN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/mechanical-ventilation", "/us/rn/nclex-rn/lessons/respiratory-failure"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 2,
    status: "planned",
  }),
  makeCluster({
    topicArea: "ventilator interpretation",
    targetQueryPatterns: ["oxygenation vs ventilation nursing", "PaO2 vs PaCO2 nursing interpretation"],
    suggestedTitle: "Oxygenation vs Ventilation: PaO2, SpO2, PaCO2, and What Nurses Should Interpret",
    slug: "oxygenation-vs-ventilation-nursing-interpretation",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/abg-interpretation", "/us/rn/nclex-rn/lessons/respiratory-failure"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "acid/base disorders",
    targetQueryPatterns: ["acid base compensation rules nursing", "ABG compensation rules"],
    suggestedTitle: "Acid-Base Compensation Rules for Nurses: Expected Direction, Timing, and Red Flags",
    slug: "acid-base-compensation-rules-for-nurses",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/abg-interpretation"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "acid/base disorders",
    targetQueryPatterns: ["anion gap metabolic acidosis nursing", "anion gap explained nurses"],
    suggestedTitle: "Anion Gap Metabolic Acidosis for Nurses: Why the Gap Rises and What to Assess",
    slug: "anion-gap-metabolic-acidosis-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/abg-interpretation", "/us/rn/nclex-rn/lessons/diabetic-ketoacidosis"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
  makeCluster({
    topicArea: "endocrine disorders",
    targetQueryPatterns: ["DKA vs HHS mechanism nursing", "why DKA causes acidosis but HHS does not"],
    suggestedTitle: "DKA vs HHS Mechanism: Ketones, Osmolarity, Dehydration, and Nursing Priorities",
    slug: "dka-vs-hhs-mechanism-nursing",
    tierRelevance: ["RN", "RPN/PN", "NP", "Allied"],
    examRelevance: ["NCLEX-RN", "REx-PN", "NCLEX-PN", "FNP", "AGPCNP", "PNP-PC"],
    relatedLessons: ["/us/rn/nclex-rn/lessons/diabetic-ketoacidosis", "/us/rn/nclex-rn/lessons/diabetes-mellitus"],
    relatedCalculatorsTools: ["/tools/lab-values"],
    relatedPracticeCatHooks: ["/question-bank", "/practice-exams", "/app/dashboard"],
    seoPriority: 1,
    status: "planned",
  }),
] as const satisfies readonly NursingMechanismCluster[];

export function nursingMechanismCanonicalPath(cluster: Pick<NursingMechanismCluster, "slug">): string {
  return `${NURSING_MECHANISM_CANONICAL_BASE_PATH}/${cluster.slug}`;
}

export function nursingMechanismCanonicalUrl(cluster: Pick<NursingMechanismCluster, "slug">): string {
  return toAbsoluteSiteUrl(nursingMechanismCanonicalPath(cluster));
}

export function getNursingMechanismClusterBySlug(slug: string): NursingMechanismCluster | undefined {
  return NURSING_MECHANISM_CLUSTERS.find((cluster) => cluster.slug === slug);
}

export function listPublishedNursingMechanismClusters(): NursingMechanismCluster[] {
  return NURSING_MECHANISM_CLUSTERS.filter((cluster) => {
    if (cluster.status !== "published") return false;
    const draft = getNursingMechanismExplainerDraft(cluster.slug);
    return Boolean(draft && isNursingMechanismExplainerPublishable(draft));
  });
}

export function listPublishedNursingMechanismSitemapPaths(): string[] {
  return listPublishedNursingMechanismClusters().map(nursingMechanismCanonicalPath);
}

function primaryLessonsHubForMechanism(cluster: NursingMechanismCluster): { label: string; href: string } {
  const lessonPath = cluster.relatedLessons[0];
  if (lessonPath && lessonPath.includes("/lessons/")) {
    const hub = lessonPath.replace(/\/lessons\/[^/]+$/, "/lessons");
    const label = hub.includes("/canada/pn/rex-pn")
      ? "REx-PN lessons"
      : hub.includes("/canada/rn/")
        ? "NCLEX-RN lessons (Canada)"
        : hub.includes("/us/rn/")
          ? "NCLEX-RN lessons"
          : "Lessons";
    return { label, href: hub };
  }
  return { label: "NCLEX-RN lessons", href: "/us/rn/nclex-rn/lessons" };
}

export function buildNursingMechanismBreadcrumbJsonLd(cluster: NursingMechanismCluster): Record<string, unknown> {
  const lessonsHub = primaryLessonsHubForMechanism(cluster);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: toAbsoluteSiteUrl("/") },
      { "@type": "ListItem", position: 2, name: lessonsHub.label, item: toAbsoluteSiteUrl(lessonsHub.href) },
      {
        "@type": "ListItem",
        position: 3,
        name: `Mechanism: ${cluster.suggestedTitle.split(":")[0]?.trim() || cluster.suggestedTitle}`,
        item: nursingMechanismCanonicalUrl(cluster),
      },
    ],
  };
}
