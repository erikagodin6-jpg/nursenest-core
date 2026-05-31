import type { ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type SalaryProfession = ConversionProfession | "Social Work" | "Future";
export type SalaryProvince = "Canada" | "Ontario" | "Alberta" | "British Columbia";

export type SalaryPageBlock =
  | "average_salary"
  | "entry_level_salary"
  | "mid_career_salary"
  | "senior_salary"
  | "top_paying_provinces"
  | "top_paying_employers"
  | "overtime_potential"
  | "shift_premiums"
  | "career_progression"
  | "benefits"
  | "work_life_balance"
  | "job_demand"
  | "career_outlook";

export type SalaryEvidenceRequirement =
  | "government_labor_data"
  | "professional_association_data"
  | "union_or_collective_agreement"
  | "job_posting_sample"
  | "last_reviewed_date"
  | "methodology_note";

export type SalarySeoTarget =
  | "profession_salary"
  | "province_salary"
  | "specialty_salary"
  | "career_outlook"
  | "career_comparison"
  | "education_roi"
  | "job_market";

export type SalaryConversionAsset = "career_planning_guide" | "salary_report_pdf" | "province_comparison_guide" | "program_roi_calculator";

export type SalaryPageSeed = {
  slug: string;
  title: string;
  profession: SalaryProfession;
  province: SalaryProvince;
  pageKind: "national_salary" | "province_salary" | "specialty_salary";
  specialty?: string;
  requiredBlocks: readonly SalaryPageBlock[];
  evidenceRequirements: readonly SalaryEvidenceRequirement[];
  seoTargets: readonly SalarySeoTarget[];
  conversionAssets: readonly SalaryConversionAsset[];
  internalLinks: readonly ["school_pages", "program_pages", "admissions_guides", "certification_guides", "interview_guides", "placement_guides", "career_guides", "study_resources"];
};

export type CareerOutlookSeed = {
  slug: string;
  title: string;
  profession: SalaryProfession;
  requiredBlocks: readonly ["demand", "growth", "workforce_shortages", "future_opportunities", "specialization_opportunities"];
};

export type CareerComparisonSeed = {
  slug: string;
  title: string;
  professions: readonly SalaryProfession[];
  comparisonFactors: readonly ["salary", "education_cost", "licensing", "job_demand", "work_life_balance", "career_progression"];
};

export type EducationCostModel = {
  tuition: true;
  books: true;
  licensingFees: true;
  certificationFees: true;
  placementCosts: true;
  livingCosts: true;
  estimatedReturnOnInvestment: true;
};

export type RoiCalculatorInput = {
  educationCostCents: number;
  expectedAnnualSalaryCents: number;
  currentAnnualIncomeCents: number;
  yearsToComplete: number;
};

export type RoiCalculatorResult = {
  paybackYears: number;
  annualIncomeLiftCents: number;
  fiveYearNetCents: number;
  tenYearNetCents: number;
};

export type JobMarketSignal = {
  profession: SalaryProfession;
  province: SalaryProvince;
  jobPostings: number;
  regionalDemand: "low" | "moderate" | "high";
  hiringTrend: "declining" | "stable" | "growing";
  shortageArea: boolean;
  remoteOpportunities: "rare" | "some" | "common";
};

export type SalaryWorkforceDashboard = {
  salaryPages: number;
  outlookPages: number;
  comparisonPages: number;
  provincePages: number;
  specialtyPages: number;
  professionsCovered: readonly string[];
  provincesCovered: readonly string[];
  yearOneTargets: {
    salaryPages: 500;
    outlookPages: 500;
    comparisonPages: 250;
    provincePages: 250;
  };
  remainingSalaryPagesTarget: number;
};

const salaryBlocks = [
  "average_salary",
  "entry_level_salary",
  "mid_career_salary",
  "senior_salary",
  "top_paying_provinces",
  "top_paying_employers",
  "overtime_potential",
  "shift_premiums",
  "career_progression",
  "benefits",
  "work_life_balance",
  "job_demand",
  "career_outlook",
] as const satisfies readonly SalaryPageBlock[];

const evidenceRequirements = ["government_labor_data", "professional_association_data", "union_or_collective_agreement", "job_posting_sample", "last_reviewed_date", "methodology_note"] as const satisfies readonly SalaryEvidenceRequirement[];
const seoTargets = ["profession_salary", "province_salary", "specialty_salary", "career_outlook", "career_comparison", "education_roi", "job_market"] as const satisfies readonly SalarySeoTarget[];
const conversionAssets = ["career_planning_guide", "salary_report_pdf", "province_comparison_guide", "program_roi_calculator"] as const satisfies readonly SalaryConversionAsset[];
const internalLinks = ["school_pages", "program_pages", "admissions_guides", "certification_guides", "interview_guides", "placement_guides", "career_guides", "study_resources"] as const;

export const SALARY_PAGE_SEEDS: readonly SalaryPageSeed[] = [
  national("rn-salary-canada", "RN Salary Canada", "RN"),
  national("rpn-salary-canada", "RPN Salary Canada", "RPN"),
  national("np-salary-canada", "NP Salary Canada", "NP"),
  national("rt-salary-canada", "Respiratory Therapist Salary Canada", "RT"),
  national("paramedic-salary-canada", "Paramedic Salary Canada", "Paramedic"),
  national("ot-salary-canada", "OT Salary Canada", "OT"),
  national("pt-salary-canada", "PT Salary Canada", "PT"),
  national("mlt-salary-canada", "MLT Salary Canada", "MLT"),
  national("psw-salary-canada", "PSW Salary Canada", "PSW"),
  national("social-work-salary-canada", "Social Work Salary Canada", "Social Work"),
  province("rn-salary-ontario", "RN Salary Ontario", "RN", "Ontario"),
  province("rn-salary-alberta", "RN Salary Alberta", "RN", "Alberta"),
  province("rn-salary-bc", "RN Salary BC", "RN", "British Columbia"),
  province("rt-salary-ontario", "RT Salary Ontario", "RT", "Ontario"),
  province("rt-salary-alberta", "RT Salary Alberta", "RT", "Alberta"),
  province("paramedic-salary-ontario", "Paramedic Salary Ontario", "Paramedic", "Ontario"),
  province("ot-salary-ontario", "OT Salary Ontario", "OT", "Ontario"),
  province("pt-salary-ontario", "PT Salary Ontario", "PT", "Ontario"),
  province("mlt-salary-ontario", "MLT Salary Ontario", "MLT", "Ontario"),
  specialty("icu-nurse-salary", "ICU Nurse Salary", "RN", "ICU Nurse"),
  specialty("er-nurse-salary", "ER Nurse Salary", "RN", "ER Nurse"),
  specialty("nicu-nurse-salary", "NICU Nurse Salary", "RN", "NICU Nurse"),
  specialty("cardiac-nurse-salary", "Cardiac Nurse Salary", "RN", "Cardiac Nurse"),
  specialty("psych-np-salary", "Psych NP Salary", "NP", "Psych NP"),
  specialty("family-np-salary", "Family NP Salary", "NP", "Family NP"),
  specialty("flight-paramedic-salary", "Flight Paramedic Salary", "Paramedic", "Flight Paramedic"),
  specialty("critical-care-rt-salary", "Critical Care RT Salary", "RT", "Critical Care RT"),
] as const;

export const CAREER_OUTLOOK_SEEDS: readonly CareerOutlookSeed[] = [
  outlook("nursing-job-outlook-canada", "Nursing Job Outlook Canada", "RN"),
  outlook("rt-job-outlook-canada", "RT Job Outlook Canada", "RT"),
  outlook("paramedic-job-outlook-canada", "Paramedic Job Outlook Canada", "Paramedic"),
  outlook("ot-job-outlook-canada", "OT Job Outlook Canada", "OT"),
  outlook("pt-job-outlook-canada", "PT Job Outlook Canada", "PT"),
  outlook("mlt-job-outlook-canada", "MLT Job Outlook Canada", "MLT"),
] as const;

export const CAREER_COMPARISON_SEEDS: readonly CareerComparisonSeed[] = [
  comparison("rn-vs-rt-salary", "RN vs RT Salary", ["RN", "RT"]),
  comparison("rn-vs-np-salary", "RN vs NP Salary", ["RN", "NP"]),
  comparison("ot-vs-pt-salary", "OT vs PT Salary", ["OT", "PT"]),
  comparison("rt-vs-paramedic-salary", "RT vs Paramedic Salary", ["RT", "Paramedic"]),
  comparison("rpn-vs-rn-salary", "RPN vs RN Salary", ["RPN", "RN"]),
  comparison("np-vs-physician-assistant", "NP vs Physician Assistant", ["NP", "Future"]),
] as const;

export const EDUCATION_COST_MODEL: EducationCostModel = {
  tuition: true,
  books: true,
  licensingFees: true,
  certificationFees: true,
  placementCosts: true,
  livingCosts: true,
  estimatedReturnOnInvestment: true,
};

export const JOB_MARKET_SIGNAL_SEEDS: readonly JobMarketSignal[] = [
  { profession: "RN", province: "Ontario", jobPostings: 0, regionalDemand: "high", hiringTrend: "growing", shortageArea: true, remoteOpportunities: "some" },
  { profession: "RT", province: "Ontario", jobPostings: 0, regionalDemand: "high", hiringTrend: "growing", shortageArea: true, remoteOpportunities: "rare" },
  { profession: "Paramedic", province: "Alberta", jobPostings: 0, regionalDemand: "moderate", hiringTrend: "stable", shortageArea: false, remoteOpportunities: "rare" },
  { profession: "NP", province: "British Columbia", jobPostings: 0, regionalDemand: "high", hiringTrend: "growing", shortageArea: true, remoteOpportunities: "some" },
] as const;

export function validateSalaryPageSeed(seed: SalaryPageSeed): readonly string[] {
  const issues: string[] = [];
  for (const block of salaryBlocks) {
    if (!seed.requiredBlocks.includes(block)) issues.push(`Missing ${block} salary block.`);
  }
  for (const evidence of evidenceRequirements) {
    if (!seed.evidenceRequirements.includes(evidence)) issues.push(`Missing ${evidence} evidence requirement.`);
  }
  for (const target of seoTargets) {
    if (!seed.seoTargets.includes(target)) issues.push(`Missing ${target} SEO target.`);
  }
  for (const asset of conversionAssets) {
    if (!seed.conversionAssets.includes(asset)) issues.push(`Missing ${asset} conversion asset.`);
  }
  for (const link of internalLinks) {
    if (!seed.internalLinks.includes(link)) issues.push(`Missing ${link} internal link.`);
  }
  return issues;
}

export function calculateEducationRoi(input: RoiCalculatorInput): RoiCalculatorResult {
  const annualIncomeLiftCents = input.expectedAnnualSalaryCents - input.currentAnnualIncomeCents;
  const opportunityCostCents = Math.max(0, input.currentAnnualIncomeCents * input.yearsToComplete);
  const totalCostCents = input.educationCostCents + opportunityCostCents;
  const paybackYears = annualIncomeLiftCents > 0 ? Math.round((totalCostCents / annualIncomeLiftCents) * 10) / 10 : Number.POSITIVE_INFINITY;
  return {
    paybackYears,
    annualIncomeLiftCents,
    fiveYearNetCents: annualIncomeLiftCents * 5 - totalCostCents,
    tenYearNetCents: annualIncomeLiftCents * 10 - totalCostCents,
  };
}

export function buildSalaryWorkforceDashboard(): SalaryWorkforceDashboard {
  const professionsCovered = [...new Set(SALARY_PAGE_SEEDS.map((seed) => seed.profession))].sort();
  const provincesCovered = [...new Set(SALARY_PAGE_SEEDS.map((seed) => seed.province))].sort();
  return {
    salaryPages: SALARY_PAGE_SEEDS.length,
    outlookPages: CAREER_OUTLOOK_SEEDS.length,
    comparisonPages: CAREER_COMPARISON_SEEDS.length,
    provincePages: SALARY_PAGE_SEEDS.filter((seed) => seed.pageKind === "province_salary").length,
    specialtyPages: SALARY_PAGE_SEEDS.filter((seed) => seed.pageKind === "specialty_salary").length,
    professionsCovered,
    provincesCovered,
    yearOneTargets: { salaryPages: 500, outlookPages: 500, comparisonPages: 250, provincePages: 250 },
    remainingSalaryPagesTarget: Math.max(0, 500 - SALARY_PAGE_SEEDS.length),
  };
}

function national(slug: string, title: string, profession: SalaryProfession): SalaryPageSeed {
  return salary(slug, title, profession, "Canada", "national_salary");
}

function province(slug: string, title: string, profession: SalaryProfession, provinceName: SalaryProvince): SalaryPageSeed {
  return salary(slug, title, profession, provinceName, "province_salary");
}

function specialty(slug: string, title: string, profession: SalaryProfession, specialtyName: string): SalaryPageSeed {
  return { ...salary(slug, title, profession, "Canada", "specialty_salary"), specialty: specialtyName };
}

function salary(slug: string, title: string, profession: SalaryProfession, provinceName: SalaryProvince, pageKind: SalaryPageSeed["pageKind"]): SalaryPageSeed {
  return {
    slug,
    title,
    profession,
    province: provinceName,
    pageKind,
    requiredBlocks: salaryBlocks,
    evidenceRequirements,
    seoTargets,
    conversionAssets,
    internalLinks,
  };
}

function outlook(slug: string, title: string, profession: SalaryProfession): CareerOutlookSeed {
  return {
    slug,
    title,
    profession,
    requiredBlocks: ["demand", "growth", "workforce_shortages", "future_opportunities", "specialization_opportunities"],
  };
}

function comparison(slug: string, title: string, professions: readonly SalaryProfession[]): CareerComparisonSeed {
  return {
    slug,
    title,
    professions,
    comparisonFactors: ["salary", "education_cost", "licensing", "job_demand", "work_life_balance", "career_progression"],
  };
}
