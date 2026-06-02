import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";
import emergencyMedicalServicesCatalog from "@/content/pathway-lessons/allied-professions/emergency-medical-services";
import sonographyCatalog from "@/content/pathway-lessons/allied-professions/sonography";
import medicalAssistantCatalog from "@/content/pathway-lessons/allied-professions/medical-assistant";
import dentalHygieneCatalog from "@/content/pathway-lessons/allied-professions/dental-hygiene";
import physiotherapyRehabCatalog from "@/content/pathway-lessons/allied-professions/physiotherapy-rehab";
import occupationalTherapyCatalog from "@/content/pathway-lessons/allied-professions/occupational-therapy";
import mentalHealthSocialWorkCatalog from "@/content/pathway-lessons/allied-professions/mental-health-social-work";
import dieteticTechnicianCatalog from "@/content/pathway-lessons/allied-professions/dietetic-technician";

type AlliedProfessionCatalogModule = {
  lessons?: unknown[];
};

const respiratoryProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "respiratory");
if (respiratoryProfession) {
  respiratoryProfession.dedicatedCatalogFile = "respiratory-therapy";
}

const pharmacyTechProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pharmacy-tech");
if (pharmacyTechProfession) {
  pharmacyTechProfession.dedicatedCatalogFile = "pharmacy-technician";
}

const mltProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "mlt");
if (mltProfession) {
  mltProfession.dedicatedCatalogFile = "medical-laboratory-technology";
}

const imagingProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "imaging");
if (imagingProfession) {
  imagingProfession.dedicatedCatalogFile = "medical-imaging";
}

const emtProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "emt");
if (emtProfession) {
  emtProfession.dedicatedCatalogFile = "emergency-medical-services";
}

const sonographyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "sonography");
if (sonographyProfession) {
  sonographyProfession.dedicatedCatalogFile = "sonography";
}

const medicalAssistantProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "medical-assistant");
if (medicalAssistantProfession) {
  medicalAssistantProfession.dedicatedCatalogFile = "medical-assistant";
}

const dentalHygieneProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "dental-hygiene");
if (dentalHygieneProfession) {
  dentalHygieneProfession.dedicatedCatalogFile = "dental-hygiene";
}

const physiotherapyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "physiotherapy");
if (physiotherapyProfession) {
  physiotherapyProfession.dedicatedCatalogFile = "physiotherapy-rehab";
}

const ptaProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pta");
if (ptaProfession) {
  ptaProfession.dedicatedCatalogFile = "physiotherapy-rehab";
}

const occupationalTherapyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "occupational-therapy");
if (occupationalTherapyProfession) {
  occupationalTherapyProfession.dedicatedCatalogFile = "occupational-therapy";
}

const otaProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "ota");
if (otaProfession) {
  otaProfession.dedicatedCatalogFile = "occupational-therapy";
}

const mentalHealthAddictionsProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "mental-health-addictions");
if (mentalHealthAddictionsProfession) {
  mentalHealthAddictionsProfession.dedicatedCatalogFile = "mental-health-social-work";
  mentalHealthAddictionsProfession.topicSlugsIn = [
    "mental-health-communication",
    "suicide-risk-assessment",
    "addictions-care",
    "trauma-informed-care",
    "mental-health-crisis-intervention",
    "social-work-ethics",
    "motivational-interviewing",
    "harm-reduction",
    "crisis-deescalation",
  ];
  mentalHealthAddictionsProfession.description =
    "Deep mental health and addictions education covering therapeutic communication, suicide-risk assessment, safety planning, harm reduction, withdrawal recognition, trauma-informed care, crisis intervention, and de-escalation.";
  mentalHealthAddictionsProfession.premiumCtaHeadline = "Master crisis communication, addictions care, safety planning, and trauma-informed support";
}

const socialWorkProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "social-work");
if (socialWorkProfession) {
  socialWorkProfession.dedicatedCatalogFile = "mental-health-social-work";
  socialWorkProfession.topicSlugsIn = [
    "social-work-ethics",
    "suicide-risk-assessment",
    "trauma-informed-care",
    "mental-health-communication",
    "addictions-care",
    "mental-health-crisis-intervention",
    "advocacy",
    "social-determinants-of-health",
    "mandatory-reporting",
  ];
  socialWorkProfession.description =
    "Deep social work education covering ethics, confidentiality, advocacy, social determinants, mandatory reporting, suicide-risk escalation, trauma-informed care, and crisis communication.";
  socialWorkProfession.premiumCtaHeadline = "Master social-work ethics, advocacy, risk assessment, and client-centered support";
}

const psychotherapyProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "psychotherapy");
if (psychotherapyProfession) {
  psychotherapyProfession.dedicatedCatalogFile = "mental-health-social-work";
  psychotherapyProfession.topicSlugsIn = [
    "mental-health-communication",
    "trauma-informed-care",
    "suicide-risk-assessment",
    "mental-health-crisis-intervention",
    "addictions-care",
    "therapeutic-boundaries",
    "therapeutic-alliance",
  ];
}

const dieteticTechnicianProfession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "dietetic-technician");
if (dieteticTechnicianProfession) {
  dieteticTechnicianProfession.dedicatedCatalogFile = "dietetic-technician";
  dieteticTechnicianProfession.topicSlugsIn = [
    "nutrition-assessment",
    "medical-nutrition-therapy",
    "food-service-safety",
    "nutrition-education",
    "lifecycle-nutrition",
    "dietetic-technician-scope",
    "malnutrition-screening",
    "renal-nutrition",
    "diabetes-nutrition",
    "dysphagia-diets",
  ];
  dieteticTechnicianProfession.description =
    "Deep dietetic technician education covering nutrition assessment, medical nutrition therapy support, food-service safety, allergens, dysphagia textures, lifecycle nutrition, teach-back, documentation, and scope.";
  dieteticTechnicianProfession.premiumCtaHeadline = "Master nutrition assessment, MNT support, food safety, and patient education";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
  "medical-imaging": medicalImagingCatalog,
  "emergency-medical-services": emergencyMedicalServicesCatalog,
  sonography: sonographyCatalog,
  "medical-assistant": medicalAssistantCatalog,
  "dental-hygiene": dentalHygieneCatalog,
  "physiotherapy-rehab": physiotherapyRehabCatalog,
  "occupational-therapy": occupationalTherapyCatalog,
  "mental-health-social-work": mentalHealthSocialWorkCatalog,
  "dietetic-technician": dieteticTechnicianCatalog,
};
