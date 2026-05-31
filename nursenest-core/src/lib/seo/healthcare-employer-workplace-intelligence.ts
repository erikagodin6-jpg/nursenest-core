import type { ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type EmployerProfession = ConversionProfession | "Social Work" | "Future";
export type EmployerKind = "Hospital" | "Health System" | "Long-Term Care Organization" | "Community Organization" | "Primary Care Network" | "Public Health Organization" | "Specialty Center";
export type EmployerProvince = "Ontario" | "Alberta" | "British Columbia" | "Nova Scotia" | "Canada";

export type EmployerProfileBlock =
  | "overview"
  | "locations"
  | "services"
  | "patient_population"
  | "specialties"
  | "teaching_status"
  | "research_status"
  | "new_graduate_programs"
  | "residencies"
  | "clinical_placements"
  | "benefits"
  | "professional_development"
  | "career_opportunities";

export type EmployerEvidenceRequirement =
  | "official_employer_source"
  | "public_careers_page"
  | "program_or_residency_source"
  | "clinical_placement_source_when_available"
  | "last_reviewed_date"
  | "methodology_note";

export type WorkplaceInternalLink =
  | "employer_pages"
  | "school_pages"
  | "salary_pages"
  | "interview_guides"
  | "placement_guides"
  | "career_guides"
  | "certification_guides"
  | "new_graduate_hub";

export type WorkplaceLeadMagnet = "employer_comparison_guide" | "new_graduate_employment_guide" | "interview_prep_pack" | "residency_program_guide";

export type WorkplaceSeoTarget =
  | "best_hospitals_for_new_grad_nurses"
  | "employer_nursing_jobs"
  | "nurse_residency_programs_canada"
  | "respiratory_therapist_jobs_ontario"
  | "best_hospital_to_work_at"
  | "icu_nurse_career_guide"
  | "new_graduate_nurse_programs"
  | "specialty_healthcare_careers";

export type WorkplaceCultureBlock = "what_it_is_like_to_work_at" | "benefits" | "challenges" | "scheduling" | "orientation" | "professional_development" | "career_growth";

export type EmployerPageSeed = {
  slug: string;
  name: string;
  kind: EmployerKind;
  province: EmployerProvince;
  example: boolean;
  requiredBlocks: readonly EmployerProfileBlock[];
  evidenceRequirements: readonly EmployerEvidenceRequirement[];
  internalLinks: readonly WorkplaceInternalLink[];
  leadMagnets: readonly WorkplaceLeadMagnet[];
  seoTargets: readonly WorkplaceSeoTarget[];
};

export type ProfessionEmployerPageSeed = {
  slug: string;
  title: string;
  profession: EmployerProfession;
  employerName?: string;
  region?: string;
  pageKind: "profession_at_employer" | "profession_in_region";
};

export type NewGradProgramSeed = {
  slug: string;
  title: string;
  profession: EmployerProfession;
  programKind: "new_graduate_program" | "nurse_residency" | "orientation_program" | "new_graduate_opportunity";
};

export type WorkplaceComparisonSeed = {
  slug: string;
  title: string;
  comparisonKind: "employer_vs_employer" | "setting_vs_setting" | "specialty_vs_specialty";
  subjects: readonly string[];
};

export type SpecialtyCareerGuideSeed = {
  slug: string;
  title: string;
  profession: EmployerProfession;
  specialty: string;
};

export type EmployerInterviewGuideSeed = {
  slug: string;
  title: string;
  profession: EmployerProfession;
  employerName?: string;
  region?: string;
};

export type ClinicalPlacementConnection = {
  schoolPages: true;
  programPages: true;
  placementPages: true;
  employerPages: true;
  careerPathways: true;
};

export type EmployerWorkplaceDashboard = {
  employerPages: number;
  professionPages: number;
  newGradProgramPages: number;
  workplaceComparisons: number;
  specialtyCareerPages: number;
  employerInterviewPages: number;
  workplaceCultureBlocks: number;
  yearOneTargets: {
    employerPages: 500;
    specialtyCareerPages: 250;
    residencyPages: 250;
    interviewPages: 250;
  };
  remainingEmployerPagesTarget: number;
  professionsCovered: readonly string[];
  provincesCovered: readonly string[];
};

const employerProfileBlocks = [
  "overview",
  "locations",
  "services",
  "patient_population",
  "specialties",
  "teaching_status",
  "research_status",
  "new_graduate_programs",
  "residencies",
  "clinical_placements",
  "benefits",
  "professional_development",
  "career_opportunities",
] as const satisfies readonly EmployerProfileBlock[];

const evidenceRequirements = ["official_employer_source", "public_careers_page", "program_or_residency_source", "clinical_placement_source_when_available", "last_reviewed_date", "methodology_note"] as const satisfies readonly EmployerEvidenceRequirement[];
const internalLinks = ["employer_pages", "school_pages", "salary_pages", "interview_guides", "placement_guides", "career_guides", "certification_guides", "new_graduate_hub"] as const satisfies readonly WorkplaceInternalLink[];
const leadMagnets = ["employer_comparison_guide", "new_graduate_employment_guide", "interview_prep_pack", "residency_program_guide"] as const satisfies readonly WorkplaceLeadMagnet[];
const seoTargets = ["best_hospitals_for_new_grad_nurses", "employer_nursing_jobs", "nurse_residency_programs_canada", "respiratory_therapist_jobs_ontario", "best_hospital_to_work_at", "icu_nurse_career_guide", "new_graduate_nurse_programs", "specialty_healthcare_careers"] as const satisfies readonly WorkplaceSeoTarget[];

export const WORKPLACE_CULTURE_BLOCKS = ["what_it_is_like_to_work_at", "benefits", "challenges", "scheduling", "orientation", "professional_development", "career_growth"] as const satisfies readonly WorkplaceCultureBlock[];

export const EMPLOYER_DIRECTORY_SEEDS: readonly EmployerPageSeed[] = [
  employer("hamilton-health-sciences", "Hamilton Health Sciences", "Health System", "Ontario"),
  employer("university-health-network", "University Health Network", "Health System", "Ontario"),
  employer("sickkids", "SickKids", "Specialty Center", "Ontario"),
  employer("sunnybrook-health-sciences-centre", "Sunnybrook", "Hospital", "Ontario"),
  employer("london-health-sciences-centre", "London Health Sciences Centre", "Health System", "Ontario"),
  employer("alberta-health-services", "Alberta Health Services", "Health System", "Alberta"),
  employer("fraser-health", "Fraser Health", "Health System", "British Columbia"),
  employer("interior-health", "Interior Health", "Health System", "British Columbia"),
  employer("nova-scotia-health", "Nova Scotia Health", "Health System", "Nova Scotia"),
] as const;

export const PROFESSION_EMPLOYER_PAGE_SEEDS: readonly ProfessionEmployerPageSeed[] = [
  professionPage("nursing-at-hamilton-health-sciences", "Nursing At Hamilton Health Sciences", "RN", "Hamilton Health Sciences"),
  professionPage("respiratory-therapy-at-sickkids", "Respiratory Therapy At SickKids", "RT", "SickKids"),
  professionPage("paramedic-careers-in-toronto", "Paramedic Careers In Toronto", "Paramedic", undefined, "Toronto"),
  professionPage("occupational-therapy-at-uhn", "Occupational Therapy At UHN", "OT", "University Health Network"),
  professionPage("physiotherapy-at-sunnybrook", "Physiotherapy At Sunnybrook", "PT", "Sunnybrook"),
  professionPage("mlt-careers-in-ontario", "MLT Careers In Ontario", "MLT", undefined, "Ontario"),
] as const;

export const NEW_GRAD_PROGRAM_SEEDS: readonly NewGradProgramSeed[] = [
  newGradProgram("new-graduate-nursing-programs", "New Graduate Nursing Programs", "RN", "new_graduate_program"),
  newGradProgram("nurse-residency-programs", "Nurse Residency Programs", "RN", "nurse_residency"),
  newGradProgram("rt-new-graduate-programs", "RT New Graduate Programs", "RT", "new_graduate_program"),
  newGradProgram("paramedic-orientation-programs", "Paramedic Orientation Programs", "Paramedic", "orientation_program"),
  newGradProgram("ot-new-graduate-opportunities", "OT New Graduate Opportunities", "OT", "new_graduate_opportunity"),
  newGradProgram("pt-new-graduate-opportunities", "PT New Graduate Opportunities", "PT", "new_graduate_opportunity"),
] as const;

export const WORKPLACE_COMPARISON_SEEDS: readonly WorkplaceComparisonSeed[] = [
  comparison("hamilton-health-sciences-vs-uhn", "Hamilton Health Sciences vs UHN", "employer_vs_employer", ["Hamilton Health Sciences", "University Health Network"]),
  comparison("sunnybrook-vs-sickkids", "Sunnybrook vs SickKids", "employer_vs_employer", ["Sunnybrook", "SickKids"]),
  comparison("community-vs-hospital-nursing", "Community vs Hospital Nursing", "setting_vs_setting", ["Community Nursing", "Hospital Nursing"]),
  comparison("icu-vs-emergency-nursing", "ICU vs Emergency Nursing", "specialty_vs_specialty", ["ICU Nursing", "Emergency Nursing"]),
  comparison("rt-acute-care-vs-community-rt", "RT Acute Care vs Community RT", "setting_vs_setting", ["RT Acute Care", "Community RT"]),
] as const;

export const SPECIALTY_CAREER_GUIDE_SEEDS: readonly SpecialtyCareerGuideSeed[] = [
  specialtyGuide("how-to-become-an-icu-nurse", "How To Become An ICU Nurse", "RN", "ICU"),
  specialtyGuide("how-to-become-a-nicu-nurse", "How To Become A NICU Nurse", "RN", "NICU"),
  specialtyGuide("how-to-become-a-flight-paramedic", "How To Become A Flight Paramedic", "Paramedic", "Flight Paramedic"),
  specialtyGuide("how-to-become-a-critical-care-rt", "How To Become A Critical Care RT", "RT", "Critical Care RT"),
  specialtyGuide("how-to-become-a-pediatric-ot", "How To Become A Pediatric OT", "OT", "Pediatric OT"),
  specialtyGuide("how-to-become-a-sports-physiotherapist", "How To Become A Sports Physiotherapist", "PT", "Sports Physiotherapy"),
] as const;

export const EMPLOYER_INTERVIEW_GUIDE_SEEDS: readonly EmployerInterviewGuideSeed[] = [
  employerInterview("hamilton-health-sciences-nursing-interview", "Hamilton Health Sciences Nursing Interview", "RN", "Hamilton Health Sciences"),
  employerInterview("sickkids-nursing-interview", "SickKids Nursing Interview", "RN", "SickKids"),
  employerInterview("uhn-new-graduate-interview", "UHN New Graduate Interview", "RN", "University Health Network"),
  employerInterview("rt-interview-questions-ontario", "RT Interview Questions Ontario", "RT", undefined, "Ontario"),
  employerInterview("paramedic-service-interview-questions", "Paramedic Service Interview Questions", "Paramedic"),
] as const;

export const CLINICAL_PLACEMENT_CONNECTIONS: ClinicalPlacementConnection = {
  schoolPages: true,
  programPages: true,
  placementPages: true,
  employerPages: true,
  careerPathways: true,
};

export function validateEmployerProfile(seed: EmployerPageSeed): readonly string[] {
  const issues: string[] = [];
  for (const block of employerProfileBlocks) {
    if (!seed.requiredBlocks.includes(block)) issues.push(`Missing ${block} profile block.`);
  }
  for (const evidence of evidenceRequirements) {
    if (!seed.evidenceRequirements.includes(evidence)) issues.push(`Missing ${evidence} evidence requirement.`);
  }
  for (const link of internalLinks) {
    if (!seed.internalLinks.includes(link)) issues.push(`Missing ${link} internal link.`);
  }
  for (const magnet of leadMagnets) {
    if (!seed.leadMagnets.includes(magnet)) issues.push(`Missing ${magnet} lead magnet.`);
  }
  if (seed.seoTargets.length === 0) issues.push("Missing SEO targets.");
  return issues;
}

export function getEmployerProfile(name: string): EmployerPageSeed | undefined {
  const normalized = name.toLowerCase();
  return EMPLOYER_DIRECTORY_SEEDS.find((seed) => seed.name.toLowerCase() === normalized || seed.slug === normalized);
}

export function buildEmployerWorkplaceDashboard(): EmployerWorkplaceDashboard {
  const professionsCovered = [...new Set([...PROFESSION_EMPLOYER_PAGE_SEEDS.map((seed) => seed.profession), ...NEW_GRAD_PROGRAM_SEEDS.map((seed) => seed.profession), ...SPECIALTY_CAREER_GUIDE_SEEDS.map((seed) => seed.profession)])].sort();
  const provincesCovered = [...new Set(EMPLOYER_DIRECTORY_SEEDS.map((seed) => seed.province))].sort();
  return {
    employerPages: EMPLOYER_DIRECTORY_SEEDS.length,
    professionPages: PROFESSION_EMPLOYER_PAGE_SEEDS.length,
    newGradProgramPages: NEW_GRAD_PROGRAM_SEEDS.length,
    workplaceComparisons: WORKPLACE_COMPARISON_SEEDS.length,
    specialtyCareerPages: SPECIALTY_CAREER_GUIDE_SEEDS.length,
    employerInterviewPages: EMPLOYER_INTERVIEW_GUIDE_SEEDS.length,
    workplaceCultureBlocks: WORKPLACE_CULTURE_BLOCKS.length,
    yearOneTargets: { employerPages: 500, specialtyCareerPages: 250, residencyPages: 250, interviewPages: 250 },
    remainingEmployerPagesTarget: Math.max(0, 500 - EMPLOYER_DIRECTORY_SEEDS.length),
    professionsCovered,
    provincesCovered,
  };
}

function employer(slug: string, name: string, kind: EmployerKind, province: EmployerProvince): EmployerPageSeed {
  return {
    slug,
    name,
    kind,
    province,
    example: true,
    requiredBlocks: employerProfileBlocks,
    evidenceRequirements,
    internalLinks,
    leadMagnets,
    seoTargets,
  };
}

function professionPage(slug: string, title: string, profession: EmployerProfession, employerName?: string, region?: string): ProfessionEmployerPageSeed {
  return { slug, title, profession, employerName, region, pageKind: employerName ? "profession_at_employer" : "profession_in_region" };
}

function newGradProgram(slug: string, title: string, profession: EmployerProfession, programKind: NewGradProgramSeed["programKind"]): NewGradProgramSeed {
  return { slug, title, profession, programKind };
}

function comparison(slug: string, title: string, comparisonKind: WorkplaceComparisonSeed["comparisonKind"], subjects: readonly string[]): WorkplaceComparisonSeed {
  return { slug, title, comparisonKind, subjects };
}

function specialtyGuide(slug: string, title: string, profession: EmployerProfession, specialty: string): SpecialtyCareerGuideSeed {
  return { slug, title, profession, specialty };
}

function employerInterview(slug: string, title: string, profession: EmployerProfession, employerName?: string, region?: string): EmployerInterviewGuideSeed {
  return { slug, title, profession, employerName, region };
}
