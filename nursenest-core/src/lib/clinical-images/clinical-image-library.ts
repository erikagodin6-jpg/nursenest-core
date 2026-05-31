import { publicCdnUrlForObjectKey } from "@/lib/education-images/cdn-url";
import { getInventoryKeys } from "@/lib/education-images/inventory";

export type ClinicalImageAudience = "RN" | "RPN" | "NP";

export type ClinicalImageCategory =
  | "pressure_injuries"
  | "wound_staging"
  | "burns"
  | "ostomies"
  | "iv_complications"
  | "skin_conditions"
  | "dermatology"
  | "eye_conditions"
  | "ent_findings"
  | "pediatric_findings"
  | "womens_health"
  | "ecg_recognition";

export type ClinicalImageQuestionIntegration =
  | "image_based_question"
  | "hotspot_question"
  | "sata_image_question"
  | "clinical_judgment_case";

export type ClinicalImageLibraryItem = {
  id: string;
  title: string;
  category: ClinicalImageCategory;
  audiences: ClinicalImageAudience[];
  topic: string;
  clinicalConcepts: string[];
  nclexObjectives: string[];
  questionIntegrations: ClinicalImageQuestionIntegration[];
  objectKey: string;
  url: string;
  alt: string;
  caption: string;
  accessibilityNote: string;
};

export const CLINICAL_IMAGE_CATEGORY_LABELS: Record<ClinicalImageCategory, string> = {
  pressure_injuries: "Pressure Injuries",
  wound_staging: "Wound Staging",
  burns: "Burns",
  ostomies: "Ostomies",
  iv_complications: "IV Complications",
  skin_conditions: "Skin Conditions",
  dermatology: "Dermatology",
  eye_conditions: "Eye Conditions",
  ent_findings: "ENT Findings",
  pediatric_findings: "Pediatric Findings",
  womens_health: "Women's Health",
  ecg_recognition: "ECG Recognition",
};

export const CLINICAL_IMAGE_REQUIRED_CATEGORIES: readonly ClinicalImageCategory[] = [
  "pressure_injuries",
  "wound_staging",
  "burns",
  "ostomies",
  "iv_complications",
  "skin_conditions",
  "dermatology",
  "eye_conditions",
  "ent_findings",
  "pediatric_findings",
  "womens_health",
  "ecg_recognition",
] as const;

const RAW_ITEMS: Array<Omit<ClinicalImageLibraryItem, "url">> = [
  {
    id: "atopic-dermatitis",
    title: "Atopic Dermatitis",
    category: "dermatology",
    audiences: ["RN", "RPN", "NP"],
    topic: "Skin Conditions",
    clinicalConcepts: ["dermatitis", "skin inflammation", "itching", "barrier protection"],
    nclexObjectives: ["Health Promotion and Maintenance", "Reduction of Risk Potential"],
    questionIntegrations: ["image_based_question", "sata_image_question", "clinical_judgment_case"],
    objectKey: "uploads/images/atopic-dermatitis.webp",
    alt: "Atopic dermatitis skin findings used for nursing visual assessment practice",
    caption: "Visual reference for inflammatory skin findings and nursing skin-care teaching.",
    accessibilityNote: "Alt text identifies the condition and assessment purpose without relying on color alone.",
  },
  {
    id: "conjunctivitis",
    title: "Conjunctivitis",
    category: "eye_conditions",
    audiences: ["RN", "RPN", "NP"],
    topic: "Eye Conditions",
    clinicalConcepts: ["conjunctival inflammation", "eye drainage", "infection control"],
    nclexObjectives: ["Safety and Infection Control", "Physiological Adaptation"],
    questionIntegrations: ["image_based_question", "sata_image_question", "clinical_judgment_case"],
    objectKey: "uploads/images/conjunctivitis.webp",
    alt: "Conjunctivitis eye finding for visual recognition and infection-control practice",
    caption: "Visual reference for eye inflammation, drainage assessment, and infection-control teaching.",
    accessibilityNote: "Caption and alt text name the finding so learners are not required to infer from color.",
  },
  {
    id: "epiglottitis",
    title: "Epiglottitis",
    category: "ent_findings",
    audiences: ["RN", "RPN", "NP"],
    topic: "ENT Findings",
    clinicalConcepts: ["airway swelling", "drooling", "respiratory distress", "pediatric airway"],
    nclexObjectives: ["Physiological Adaptation", "Reduction of Risk Potential"],
    questionIntegrations: ["image_based_question", "clinical_judgment_case"],
    objectKey: "uploads/images/epiglottitis.webp",
    alt: "Epiglottitis airway finding for urgent respiratory assessment practice",
    caption: "Visual reference for airway-risk recognition and escalation decisions.",
    accessibilityNote: "The image is paired with text cues so airway urgency is not communicated visually only.",
  },
  {
    id: "kawasaki-disease",
    title: "Kawasaki Disease",
    category: "pediatric_findings",
    audiences: ["RN", "RPN", "NP"],
    topic: "Pediatric Findings",
    clinicalConcepts: ["mucocutaneous findings", "fever", "pediatric inflammation", "cardiac risk"],
    nclexObjectives: ["Health Promotion and Maintenance", "Physiological Adaptation"],
    questionIntegrations: ["image_based_question", "sata_image_question", "clinical_judgment_case"],
    objectKey: "uploads/images/kawasaki-disease.webp",
    alt: "Kawasaki disease pediatric mucocutaneous findings for nursing recognition practice",
    caption: "Visual reference for pediatric pattern recognition and coronary-risk escalation.",
    accessibilityNote: "Clinical text should describe mucosal, skin, and fever cues in addition to the image.",
  },
  {
    id: "retinal-detachment",
    title: "Retinal Detachment",
    category: "eye_conditions",
    audiences: ["RN", "NP"],
    topic: "Eye Conditions",
    clinicalConcepts: ["vision loss", "floaters", "curtain over vision", "urgent referral"],
    nclexObjectives: ["Reduction of Risk Potential", "Physiological Adaptation"],
    questionIntegrations: ["image_based_question", "clinical_judgment_case"],
    objectKey: "uploads/images/retinal-detachment.webp",
    alt: "Retinal detachment visual reference for urgent eye symptom recognition",
    caption: "Visual reference for urgent eye findings and referral decisions.",
    accessibilityNote: "The item should include symptom wording because learners with low vision may not perceive image detail.",
  },
  {
    id: "ecg-interpretation-basics",
    title: "ECG Interpretation Basics",
    category: "ecg_recognition",
    audiences: ["RN", "NP"],
    topic: "ECG Recognition",
    clinicalConcepts: ["rhythm recognition", "rate", "regularity", "P waves", "QRS"],
    nclexObjectives: ["Physiological Adaptation", "Reduction of Risk Potential"],
    questionIntegrations: ["image_based_question", "hotspot_question", "clinical_judgment_case"],
    objectKey: "clinical-illustrations/cardiovascular/ecg-interpretation-basics.svg",
    alt: "ECG interpretation basics diagram for rhythm recognition practice",
    caption: "Visual reference for ECG rhythm recognition and interpretation cues.",
    accessibilityNote: "Diagram labels must be supported by written recognition clues in question stems.",
  },
];

export function listClinicalImageLibraryItems(): ClinicalImageLibraryItem[] {
  const inventory = new Set(getInventoryKeys());
  return RAW_ITEMS
    .filter((item) => item.objectKey.startsWith("clinical-illustrations/") || inventory.has(item.objectKey))
    .map((item) => ({
      ...item,
      url: item.objectKey.startsWith("clinical-illustrations/")
        ? `/${item.objectKey}`
        : publicCdnUrlForObjectKey(item.objectKey),
    }));
}

export function clinicalImageCoverageByCategory(items = listClinicalImageLibraryItems()) {
  return CLINICAL_IMAGE_REQUIRED_CATEGORIES.map((category) => ({
    category,
    label: CLINICAL_IMAGE_CATEGORY_LABELS[category],
    count: items.filter((item) => item.category === category).length,
  }));
}

export function findClinicalImagesForQuestion(args: {
  topic?: string | null;
  subtopic?: string | null;
  clinicalConcept?: string | null;
  medicationClass?: string | null;
  ecgRhythmCategory?: string | null;
}): ClinicalImageLibraryItem[] {
  const tokens = [
    args.topic,
    args.subtopic,
    args.clinicalConcept,
    args.medicationClass,
    args.ecgRhythmCategory,
  ]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .join(" ")
    .toLowerCase();
  if (!tokens) return [];
  return listClinicalImageLibraryItems()
    .map((item) => {
      const haystack = [item.title, item.topic, item.category, ...item.clinicalConcepts].join(" ").toLowerCase();
      const score = haystack
        .split(/\s+/)
        .filter((part) => part.length > 2 && tokens.includes(part)).length;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.item);
}
