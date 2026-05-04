import { ALLIED_MASTERY_MODULES } from "@/lib/allied/allied-mastery-modules";
import { ECG_MASTERY_ENTITLEMENT } from "@/lib/ecg-module/ecg-module-config";
import { LAB_VALUES_MODULES } from "@/lib/lab-values/lab-values-module";

export type MasteryModuleType =
  | "ecg"
  | "lab-values"
  | "abg"
  | "ventilator-management"
  | "oxygen-delivery"
  | "respiratory-distress"
  | "iv-infusion-safety"
  | "neuro-stroke-recognition"
  | "trauma-triage"
  | "advanced-lab-interpretation"
  | "pharmacy"
  | "functional-assessment"
  | "msk-rehab"
  | "image-recognition"
  | "cardiac-pattern-recognition"
  | "emergency-pattern-recognition"
  | "movement-injury-mechanics"
  | "functional-assessment-adl-safety";

export type MasteryRequiredModalities = {
  lungSound?: "audio";
  ecg?: "image" | "video" | "ecg" | ("image" | "video")[];
  traumaImage?: "image";
  glucose?: "numeric";
  vitals?: "required";
  abg?: ("pH" | "PaCO2" | "HCO3" | "PaO2")[];
};

export type MasteryModuleRegistryEntry = {
  id: string;
  slug: string;
  title: string;
  route: string;
  moduleType: MasteryModuleType;
  professionKeys: string[];
  isPublic: false;
  adminPreviewOnly: true;
  entitlementKey: string;
  requiredModalities?: MasteryRequiredModalities;
};

/** Per-module-type required modality declarations. */
export const MASTERY_REQUIRED_MODALITIES: Partial<Record<MasteryModuleType, MasteryRequiredModalities>> = {
  "emergency-pattern-recognition": {
    lungSound: "audio",
    ecg: ["image", "video"],
    traumaImage: "image",
    glucose: "numeric",
    vitals: "required",
  },
  "respiratory-distress": {
    lungSound: "audio",
    vitals: "required",
  },
  "abg": {
    abg: ["pH", "PaCO2", "HCO3", "PaO2"],
    vitals: "required",
  },
  "ventilator-management": {
    vitals: "required",
  },
  "oxygen-delivery": {
    vitals: "required",
  },
  "cardiac-pattern-recognition": {
    ecg: ["image", "video"],
    vitals: "required",
  },
};

function alliedModuleType(id: string, slug: string): MasteryModuleType {
  if (slug === "abg") return "abg";
  if (slug === "ventilator-basics") return "ventilator-management";
  if (slug === "ventilator-management") return "ventilator-management";
  if (slug === "oxygen-delivery") return "oxygen-delivery";
  if (slug === "respiratory-distress") return "respiratory-distress";
  if (slug === "iv-infusion-safety") return "iv-infusion-safety";
  if (slug === "neuro-stroke-recognition") return "neuro-stroke-recognition";
  if (slug === "trauma-triage") return "trauma-triage";
  if (slug === "advanced-lab-interpretation") return "advanced-lab-interpretation";
  if (slug === "pharmacology-patterns" || slug === "dosage-calculations") return "pharmacy";
  if (slug === "adl-functional-assessment") return "functional-assessment";
  if (slug === "msk-rehab-assessment") return "msk-rehab";
  if (slug === "image-recognition") return "image-recognition";
  if (slug === "ecg-cardiac-patterns") return "cardiac-pattern-recognition";
  if (slug === "emergency-pattern-recognition") return "emergency-pattern-recognition";
  if (slug === "movement-injury-mechanics") return "movement-injury-mechanics";
  if (slug === "functional-assessment-adl-safety") return "functional-assessment-adl-safety";
  throw new Error(`Unknown allied mastery module type for ${id}/${slug}`);
}

export const MASTERY_MODULE_REGISTRY: MasteryModuleRegistryEntry[] = [
  {
    id: "ecg-mastery",
    slug: "ecg",
    title: "ECG Mastery",
    route: "/modules/ecg",
    moduleType: "ecg",
    professionKeys: ["RN", "NP"],
    isPublic: false,
    adminPreviewOnly: true,
    entitlementKey: ECG_MASTERY_ENTITLEMENT,
  },
  ...LAB_VALUES_MODULES.map((module) => ({
    id: module.id,
    slug: module.slug,
    title: module.title,
    route: module.route,
    moduleType: "lab-values" as const,
    professionKeys: [],
    isPublic: false as const,
    adminPreviewOnly: true as const,
    entitlementKey: module.entitlementKey,
  })),
  ...ALLIED_MASTERY_MODULES.map((module) => ({
    id: module.id,
    slug: module.slug,
    title: module.title,
    route: module.route,
    moduleType: alliedModuleType(module.id, module.slug),
    professionKeys: module.professionKeys,
    isPublic: false as const,
    adminPreviewOnly: true as const,
    entitlementKey: module.entitlementKey,
  })),
];

export function masteryModulesByType(moduleType: MasteryModuleType): MasteryModuleRegistryEntry[] {
  return MASTERY_MODULE_REGISTRY.filter((module) => module.moduleType === moduleType);
}