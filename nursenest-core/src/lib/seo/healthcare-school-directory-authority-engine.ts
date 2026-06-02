import type { ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type DirectoryProfession = ConversionProfession | "Future";
export type CanadianProvince = "Ontario" | "Alberta" | "British Columbia" | "Canada";

export type ProgramCredential =
  | "BScN"
  | "RPN Diploma"
  | "NP Program"
  | "Advanced Diploma"
  | "Master's"
  | "Doctorate"
  | "Certificate"
  | "Diploma";

export type ProgramPageBlock =
  | "program_overview"
  | "location"
  | "length"
  | "admissions_requirements"
  | "competitive_average"
  | "prerequisites"
  | "clinical_placements"
  | "tuition"
  | "program_structure"
  | "career_outcomes"
  | "licensing_pathway"
  | "student_tips"
  | "related_programs"
  | "faqs";

export type ProgramSeoTarget =
  | "school_keywords"
  | "program_keywords"
  | "admissions_keywords"
  | "province_keywords"
  | "prerequisite_keywords"
  | "casper_keywords"
  | "interview_keywords"
  | "career_keywords";

export type DirectoryConversionAsset = "free_admissions_checklist" | "program_comparison_pdf" | "application_timeline" | "study_starter_pack";

export type ProgramDirectoryEntry = {
  slug: string;
  schoolName: string;
  programName: string;
  title: string;
  profession: DirectoryProfession;
  province: CanadianProvince;
  city: string;
  credential: ProgramCredential;
  lengthLabel: string;
  pageBlocks: readonly ProgramPageBlock[];
  seoTargets: readonly ProgramSeoTarget[];
  conversionAssets: readonly DirectoryConversionAsset[];
  internalLinks: readonly ["career_guides", "certification_guides", "admissions_resources", "hesi", "teas", "casper", "pre_nursing", "study_resources"];
};

export type ProvinceProgramHub = {
  title: string;
  province: CanadianProvince;
  profession: DirectoryProfession;
  canonicalPath: string;
  programSlugs: readonly string[];
};

export type ProgramComparisonSeed = {
  title: string;
  comparisonType: "school_vs_school" | "program_vs_program" | "profession_vs_profession";
  programSlugs: readonly string[];
  intent: "admissions" | "career" | "program_selection";
};

export type AdmissionsGuideSeed = {
  title: string;
  profession: DirectoryProfession;
  canonicalPath: string;
  requiredBlocks: readonly ["requirements", "grades", "prerequisites", "application_timeline", "interview_prep", "casper_prep", "student_tips", "related_programs"];
};

export type AcceptanceChanceInput = {
  grades: number;
  prerequisitesComplete: number;
  province: CanadianProvince;
  programInterest: DirectoryProfession;
};

export type AcceptanceChanceResult = {
  competitiveness: "reach" | "competitive" | "strong";
  suggestedProgramSlugs: readonly string[];
  preparationRecommendations: readonly string[];
};

export type ApplicationTimelineItem = {
  phase: "research" | "prerequisites" | "application" | "interview" | "casper" | "references" | "decision";
  timing: string;
  action: string;
};

export type SchoolReviewType = "student_review" | "graduate_review" | "placement_experience" | "application_experience" | "program_feedback";

export type SchoolReviewGovernance = {
  supportedTypes: readonly SchoolReviewType[];
  moderationRequired: true;
  qualityControls: readonly ["identity_or_enrollment_signal", "no_personal_health_information", "no_defamation", "specific_experience_required", "spam_detection"];
};

export type SchoolDirectoryDashboard = {
  programPages: number;
  provinceHubs: number;
  comparisonPages: number;
  admissionsGuides: number;
  professionsCovered: readonly string[];
  provinceCoverage: readonly string[];
  yearOneTargets: {
    programPages: 500;
    comparisonPages: 100;
    admissionsGuides: 100;
    provinceHubs: 50;
  };
  remainingToProgramPageTarget: number;
};

const pageBlocks = [
  "program_overview",
  "location",
  "length",
  "admissions_requirements",
  "competitive_average",
  "prerequisites",
  "clinical_placements",
  "tuition",
  "program_structure",
  "career_outcomes",
  "licensing_pathway",
  "student_tips",
  "related_programs",
  "faqs",
] as const satisfies readonly ProgramPageBlock[];

const seoTargets = [
  "school_keywords",
  "program_keywords",
  "admissions_keywords",
  "province_keywords",
  "prerequisite_keywords",
  "casper_keywords",
  "interview_keywords",
  "career_keywords",
] as const satisfies readonly ProgramSeoTarget[];

const conversionAssets = ["free_admissions_checklist", "program_comparison_pdf", "application_timeline", "study_starter_pack"] as const satisfies readonly DirectoryConversionAsset[];
const internalLinks = ["career_guides", "certification_guides", "admissions_resources", "hesi", "teas", "casper", "pre_nursing", "study_resources"] as const;

export const PROGRAM_DIRECTORY_ENTRIES: readonly ProgramDirectoryEntry[] = [
  program("mcmaster-nursing-program", "McMaster University", "Nursing Program", "McMaster Nursing Program", "RN", "Ontario", "Hamilton", "BScN", "4 years"),
  program("mohawk-rpn-program", "Mohawk College", "Practical Nursing Program", "Mohawk RPN Program", "RPN", "Ontario", "Hamilton", "RPN Diploma", "2 years"),
  program("fanshawe-respiratory-therapy", "Fanshawe College", "Respiratory Therapy Program", "Fanshawe Respiratory Therapy", "RT", "Ontario", "London", "Advanced Diploma", "3 years"),
  program("conestoga-paramedic-program", "Conestoga College", "Paramedic Program", "Conestoga Paramedic Program", "Paramedic", "Ontario", "Kitchener", "Diploma", "2 years"),
  program("university-of-toronto-np-programs", "University of Toronto", "Nurse Practitioner Programs", "University Of Toronto NP Programs", "NP", "Ontario", "Toronto", "NP Program", "2 years"),
  program("western-ot-program", "Western University", "Occupational Therapy Program", "Western OT Program", "OT", "Ontario", "London", "Master's", "2 years"),
  program("mcmaster-pt-program", "McMaster University", "Physiotherapy Program", "McMaster PT Program", "PT", "Ontario", "Hamilton", "Master's", "2 years"),
  program("michener-mlt-program", "Michener Institute", "Medical Laboratory Technology Program", "Michener MLT Program", "MLT", "Ontario", "Toronto", "Advanced Diploma", "3 years"),
  program("george-brown-psw-program", "George Brown College", "Personal Support Worker Program", "George Brown PSW Program", "PSW", "Ontario", "Toronto", "Certificate", "1 year"),
] as const;

export const PROVINCE_PROGRAM_HUBS: readonly ProvinceProgramHub[] = [
  hub("Ontario Nursing Programs", "Ontario", "RN"),
  hub("Alberta Nursing Programs", "Alberta", "RN"),
  hub("British Columbia Nursing Programs", "British Columbia", "RN"),
  hub("Ontario RT Programs", "Ontario", "RT"),
  hub("Ontario Paramedic Programs", "Ontario", "Paramedic"),
  hub("Ontario RPN Programs", "Ontario", "RPN"),
  hub("Ontario OT Programs", "Ontario", "OT"),
  hub("Ontario PT Programs", "Ontario", "PT"),
  hub("Ontario MLT Programs", "Ontario", "MLT"),
  hub("Ontario PSW Programs", "Ontario", "PSW"),
] as const;

export const PROGRAM_COMPARISON_SEEDS: readonly ProgramComparisonSeed[] = [
  comparison("McMaster vs Western Nursing", "school_vs_school", ["mcmaster-nursing-program"], "program_selection"),
  comparison("Fanshawe vs Conestoga RT", "school_vs_school", ["fanshawe-respiratory-therapy"], "program_selection"),
  comparison("OT vs PT", "profession_vs_profession", ["western-ot-program", "mcmaster-pt-program"], "career"),
  comparison("RN vs RT", "profession_vs_profession", ["mcmaster-nursing-program", "fanshawe-respiratory-therapy"], "career"),
  comparison("RPN vs RN", "profession_vs_profession", ["mohawk-rpn-program", "mcmaster-nursing-program"], "career"),
] as const;

export const ADMISSIONS_GUIDE_SEEDS: readonly AdmissionsGuideSeed[] = [
  admissionsGuide("How To Get Into Nursing School", "RN"),
  admissionsGuide("How To Get Into RT School", "RT"),
  admissionsGuide("How To Get Into OT", "OT"),
  admissionsGuide("How To Get Into PT", "PT"),
  admissionsGuide("How To Get Into MLT", "MLT"),
] as const;

export const SCHOOL_REVIEW_GOVERNANCE: SchoolReviewGovernance = {
  supportedTypes: ["student_review", "graduate_review", "placement_experience", "application_experience", "program_feedback"],
  moderationRequired: true,
  qualityControls: ["identity_or_enrollment_signal", "no_personal_health_information", "no_defamation", "specific_experience_required", "spam_detection"],
};

export const APPLICATION_TIMELINE_TEMPLATE: readonly ApplicationTimelineItem[] = [
  { phase: "research", timing: "12-18 months before start", action: "Compare programs, locations, prerequisites, tuition, clinical placement expectations, and licensing pathway." },
  { phase: "prerequisites", timing: "9-15 months before start", action: "Complete required courses and plan grade improvement if competitive averages are above current marks." },
  { phase: "application", timing: "6-12 months before start", action: "Prepare application portal requirements, transcripts, program choices, fees, and deadlines." },
  { phase: "casper", timing: "2-6 months before deadline", action: "Practice ethical reasoning, communication, reflection, and timed written responses if CASPER is required." },
  { phase: "interview", timing: "1-4 months before decision", action: "Prepare behavioural examples, healthcare motivation, teamwork examples, and program-specific questions." },
  { phase: "references", timing: "1-3 months before deadline", action: "Request references early and provide each referee with program context and submission instructions." },
  { phase: "decision", timing: "Offer period", action: "Compare offers, clinical placement requirements, commuting, cost, support services, and licensing goals." },
] as const;

export function validateProgramPage(entry: ProgramDirectoryEntry): readonly string[] {
  const issues: string[] = [];
  for (const block of pageBlocks) {
    if (!entry.pageBlocks.includes(block)) issues.push(`Missing ${block} block.`);
  }
  for (const target of seoTargets) {
    if (!entry.seoTargets.includes(target)) issues.push(`Missing ${target} SEO target.`);
  }
  for (const asset of conversionAssets) {
    if (!entry.conversionAssets.includes(asset)) issues.push(`Missing ${asset} conversion asset.`);
  }
  for (const link of internalLinks) {
    if (!entry.internalLinks.includes(link)) issues.push(`Missing ${link} internal link.`);
  }
  return issues;
}

export function buildAcceptanceChance(input: AcceptanceChanceInput, entries: readonly ProgramDirectoryEntry[] = PROGRAM_DIRECTORY_ENTRIES): AcceptanceChanceResult {
  const competitiveness: AcceptanceChanceResult["competitiveness"] =
    input.grades >= 88 && input.prerequisitesComplete >= 5 ? "strong" : input.grades >= 80 && input.prerequisitesComplete >= 4 ? "competitive" : "reach";
  const suggestedProgramSlugs = entries
    .filter((entry) => (entry.profession === input.programInterest || input.programInterest === "Future") && (entry.province === input.province || input.province === "Canada"))
    .map((entry) => entry.slug)
    .slice(0, 5);
  return {
    competitiveness,
    suggestedProgramSlugs,
    preparationRecommendations:
      competitiveness === "strong"
        ? ["Prepare interviews and CASPER early.", "Compare clinical placement requirements.", "Build a scholarship and commute plan."]
        : competitiveness === "competitive"
          ? ["Raise prerequisite averages where possible.", "Prepare a realistic school list.", "Start CASPER and interview practice."]
          : ["Complete missing prerequisites.", "Consider pathway bridge options.", "Use admissions study resources before applying."],
  };
}

export function buildSchoolDirectoryDashboard(): SchoolDirectoryDashboard {
  const professionsCovered = [...new Set(PROGRAM_DIRECTORY_ENTRIES.map((entry) => entry.profession))].sort();
  const provinceCoverage = [...new Set(PROGRAM_DIRECTORY_ENTRIES.map((entry) => entry.province))].sort();
  return {
    programPages: PROGRAM_DIRECTORY_ENTRIES.length,
    provinceHubs: PROVINCE_PROGRAM_HUBS.length,
    comparisonPages: PROGRAM_COMPARISON_SEEDS.length,
    admissionsGuides: ADMISSIONS_GUIDE_SEEDS.length,
    professionsCovered,
    provinceCoverage,
    yearOneTargets: { programPages: 500, comparisonPages: 100, admissionsGuides: 100, provinceHubs: 50 },
    remainingToProgramPageTarget: Math.max(0, 500 - PROGRAM_DIRECTORY_ENTRIES.length),
  };
}

function program(
  slug: string,
  schoolName: string,
  programName: string,
  title: string,
  profession: DirectoryProfession,
  province: CanadianProvince,
  city: string,
  credential: ProgramCredential,
  lengthLabel: string,
): ProgramDirectoryEntry {
  return {
    slug,
    schoolName,
    programName,
    title,
    profession,
    province,
    city,
    credential,
    lengthLabel,
    pageBlocks,
    seoTargets,
    conversionAssets,
    internalLinks,
  };
}

function hub(title: string, province: CanadianProvince, profession: DirectoryProfession): ProvinceProgramHub {
  return {
    title,
    province,
    profession,
    canonicalPath: `/schools/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    programSlugs: PROGRAM_DIRECTORY_ENTRIES.filter((entry) => entry.province === province && entry.profession === profession).map((entry) => entry.slug),
  };
}

function comparison(title: string, comparisonType: ProgramComparisonSeed["comparisonType"], programSlugs: readonly string[], intent: ProgramComparisonSeed["intent"]): ProgramComparisonSeed {
  return { title, comparisonType, programSlugs, intent };
}

function admissionsGuide(title: string, profession: DirectoryProfession): AdmissionsGuideSeed {
  return {
    title,
    profession,
    canonicalPath: `/admissions-guides/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    requiredBlocks: ["requirements", "grades", "prerequisites", "application_timeline", "interview_prep", "casper_prep", "student_tips", "related_programs"],
  };
}
