import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import respiratoryTherapyCatalog from "@/content/pathway-lessons/allied-professions/respiratory-therapy";
import pharmacyTechnicianCatalog from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import medicalLaboratoryTechnologyCatalog from "@/content/pathway-lessons/allied-professions/medical-laboratory-technology";
import medicalImagingCatalog from "@/content/pathway-lessons/allied-professions/medical-imaging";

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
  imagingProfession.topicSlugsIn = [
    "radiation-safety",
    "imaging-positioning",
    "contrast-safety",
    "imaging-modalities",
    "image-quality",
    "imaging-patient-care",
    "radiologic-technology",
    "ct-technologist",
    "mri-technologist",
    "sonography",
    "nuclear-medicine",
    "imaging-basics",
  ];
  imagingProfession.description =
    "Deep medical imaging education covering radiation safety, positioning, CT, MRI, ultrasound, contrast reactions, image quality, trauma imaging, and imaging patient care.";
  imagingProfession.examOverview = [
    "Imaging exams reward modality reasoning, safety, positioning accuracy, image-quality analysis, and patient-care judgment under pressure.",
    "Use radiation safety, contrast workflow, and positioning logic together instead of memorizing isolated projections.",
    "Scenario-based imaging review produces stronger retention than passive anatomy-only memorization.",
  ];
  imagingProfession.features = [
    "Dedicated imaging lesson shard with CT, MRI, radiography, and contrast-safety depth.",
    "Mechanism-first imaging education aligned to real clinical workflow.",
    "Image-quality and artifact reasoning integrated with patient safety and repeat prevention.",
    "Shared imaging foundation supporting radiography, sonography, and advanced modality growth.",
  ];
  imagingProfession.ctaLine =
    "Study radiography, CT, MRI, ultrasound, contrast safety, and imaging workflow through the dedicated imaging pathway.";
  imagingProfession.premiumCtaHeadline = "Master imaging safety, positioning, modalities, and diagnostic workflow";
}

export const ALLIED_PROFESSION_DEDICATED_CATALOGS: Readonly<Record<string, AlliedProfessionCatalogModule>> = {
  "respiratory-therapy": respiratoryTherapyCatalog,
  "pharmacy-technician": pharmacyTechnicianCatalog,
  "medical-laboratory-technology": medicalLaboratoryTechnologyCatalog,
  "medical-imaging": medicalImagingCatalog,
};
