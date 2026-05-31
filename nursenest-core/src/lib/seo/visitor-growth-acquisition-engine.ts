import type { ConversionProfession, PublicContentSurface } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type AcquisitionProjectKey =
  | "career_authority"
  | "certification_guides"
  | "school_directory"
  | "comparison_pages"
  | "free_resource_library"
  | "email_lead_magnets"
  | "cta_optimization"
  | "backlink_magnets"
  | "scholarship_pr"
  | "content_to_account"
  | "revenue_attribution"
  | "growth_dashboard";

export type AcquisitionPageFamily =
  | "career"
  | "province_career"
  | "certification"
  | "school_directory"
  | "comparison"
  | "free_resource"
  | "research_report"
  | "scholarship"
  | "authority_content";

export type AcquisitionAudience =
  | "high_school_students"
  | "college_applicants"
  | "university_applicants"
  | "career_changers"
  | "internationally_educated_professionals"
  | "current_healthcare_students"
  | "exam_candidates";

export type AcquisitionFunnelMetric =
  | "organic_traffic"
  | "email_subscribers"
  | "account_registrations"
  | "trial_starts"
  | "paid_subscriptions"
  | "backlinks"
  | "authority";

export type CareerAuthoritySeed = {
  profession: ConversionProfession;
  title: string;
  pageFamily: "career" | "province_career";
  provinceSpecific: boolean;
  certificationSpecific: boolean;
  schoolSpecificExpansion: boolean;
  primaryAudience: AcquisitionAudience;
};

export type CertificationGuideSeed = {
  title: string;
  profession: ConversionProfession;
  includes: readonly ["exam overview", "blueprint", "study plan", "passing strategy", "common mistakes", "study timeline", "recommended resources", "FAQs"];
};

export type SchoolDirectorySeed = {
  title: string;
  profession: ConversionProfession;
  geography: "Canada" | "Ontario";
  requiredBlocks: readonly ["admissions requirements", "tuition", "length", "clinical placements", "career outcomes", "program comparisons"];
};

export type ComparisonPageSeed = {
  title: string;
  pageFamily: "comparison";
  intent: "competitor" | "exam" | "career" | "profession";
  conversionIntent: "high" | "medium";
};

export type FreeResourceSeed = {
  title: string;
  profession: ConversionProfession | "Multiple";
  format: "checklist" | "guide" | "cheat_sheet" | "formula_sheet" | "quick_reference";
  requiresEmailCapture: true;
  backlinkPotential: "high" | "medium";
};

export type EmailLeadMagnet = {
  title: string;
  profession: ConversionProfession;
  includes: readonly ["mini lessons", "questions", "flashcards", "study plans", "checklists"];
  requiresAccount: true;
};

export type CtaRequirement = {
  surface: PublicContentSurface | "Blog Post" | "School Page" | "Allied Health Page";
  requiredCtas: readonly ["primary", "secondary", "related_resource", "trial", "account_creation"];
};

export type BacklinkMagnet = {
  title: string;
  outputs: readonly ["downloadable PDF", "charts", "infographics", "media summaries", "press kit"];
  backlinkAudience: readonly ["schools" | "media" | "professional organizations" | "student associations"];
};

export type ScholarshipProgram = {
  title: string;
  audience: "healthcare" | "nursing" | "allied_health";
  authorityBenefits: readonly ["university backlinks", "college backlinks", "scholarship directory backlinks", "media mentions", "social sharing"];
};

export type ContentToAccountAction =
  | "save_article"
  | "bookmark"
  | "create_study_plan"
  | "download_resource"
  | "save_to_notebook"
  | "get_related_questions"
  | "get_related_flashcards"
  | "take_practice_quiz";

export type RevenueAttributionRow = {
  keyword: string;
  landingPage: string;
  trafficSource: "organic" | "direct" | "referral" | "social" | "email" | "paid";
  profession: ConversionProfession;
  cluster: string;
  accountsCreated: number;
  trialStarts: number;
  subscriptions: number;
  renewals: number;
  revenueCents: number;
};

export type RevenueAttributionSummary = {
  topSubscriberPages: readonly Array<{ page: string; subscriptions: number; revenueCents: number }>;
  professionsByRevenue: readonly Array<{ profession: ConversionProfession; revenueCents: number; subscriptions: number }>;
  trafficSourcesByRevenue: readonly Array<{ trafficSource: RevenueAttributionRow["trafficSource"]; revenueCents: number; subscriptions: number }>;
  clustersByRevenue: readonly Array<{ cluster: string; revenueCents: number; subscriptions: number }>;
};

export type ExecutiveGrowthDashboardInput = {
  organicTraffic: number;
  emailSubscribers: number;
  accountsCreated: number;
  trialsStarted: number;
  subscriptions: number;
  revenueCents: number;
  attributionRows: readonly RevenueAttributionRow[];
};

export type ExecutiveGrowthDashboard = {
  organicTraffic: number;
  emailSubscribers: number;
  accountsCreated: number;
  trialsStarted: number;
  subscriptions: number;
  revenueCents: number;
  visitorToAccountRate: number;
  accountToTrialRate: number;
  trialToPaidRate: number;
  topLandingPages: readonly string[];
  topKeywords: readonly string[];
  topConversionPages: readonly string[];
  topAlliedHealthPages: readonly string[];
  topCareerPages: readonly string[];
  topCertificationPages: readonly string[];
  revenueAttribution: RevenueAttributionSummary;
};

export type VisitorGrowthAcquisitionPlan = {
  projects: readonly AcquisitionProjectKey[];
  careerAuthoritySeeds: readonly CareerAuthoritySeed[];
  certificationGuideSeeds: readonly CertificationGuideSeed[];
  schoolDirectorySeeds: readonly SchoolDirectorySeed[];
  comparisonPageSeeds: readonly ComparisonPageSeed[];
  freeResourceSeeds: readonly FreeResourceSeed[];
  emailLeadMagnets: readonly EmailLeadMagnet[];
  ctaRequirements: readonly CtaRequirement[];
  backlinkMagnets: readonly BacklinkMagnet[];
  scholarshipPrograms: readonly ScholarshipProgram[];
  contentToAccountActions: readonly ContentToAccountAction[];
  successTargets: {
    indexedPages: "thousands";
    organicTrafficGrowth: true;
    emailSubscriberBase: true;
    improvedTrials: true;
    improvedSubscriptions: true;
    strongerBacklinks: true;
    alliedHealthTraffic: true;
  };
};

export const ACQUISITION_PROJECTS: readonly AcquisitionProjectKey[] = [
  "career_authority",
  "certification_guides",
  "school_directory",
  "comparison_pages",
  "free_resource_library",
  "email_lead_magnets",
  "cta_optimization",
  "backlink_magnets",
  "scholarship_pr",
  "content_to_account",
  "revenue_attribution",
  "growth_dashboard",
] as const;

export const CAREER_AUTHORITY_SEEDS: readonly CareerAuthoritySeed[] = [
  career("RN", "How To Become A Nurse In Canada", "career", false),
  career("RN", "How To Become A Nurse In Ontario", "province_career", true),
  career("NP", "How To Become A Nurse Practitioner In Canada", "career", false),
  career("RPN", "How To Become A Registered Practical Nurse", "career", false),
  career("RT", "How To Become A Respiratory Therapist In Canada", "career", false),
  career("RT", "How To Become A Respiratory Therapist In Ontario", "province_career", true),
  career("RT", "Respiratory Therapist Salary Canada", "career", false),
  career("RT", "Respiratory Therapist Career Guide", "career", false),
  career("Paramedic", "How To Become A Paramedic In Canada", "career", false),
  career("Paramedic", "How To Become A Paramedic In Ontario", "province_career", true),
  career("Paramedic", "Paramedic Salary Guide", "career", false),
  career("Paramedic", "Paramedic Career Guide", "career", false),
  career("OT", "How To Become An Occupational Therapist", "career", false),
  career("OT", "Occupational Therapist Salary Canada", "career", false),
  career("OT", "OT Career Guide", "career", false),
  career("PT", "How To Become A Physiotherapist", "career", false),
  career("PT", "Physiotherapist Salary Canada", "career", false),
  career("PT", "PT Career Guide", "career", false),
  career("MLT", "How To Become An MLT", "career", false),
  career("MLT", "Medical Laboratory Technologist Salary Guide", "career", false),
  career("MLT", "MLT Career Guide", "career", false),
  career("PSW", "How To Become A PSW", "career", false),
  career("PSW", "PSW Salary Guide", "career", false),
  career("PSW", "PSW Career Guide", "career", false),
] as const;

export const CERTIFICATION_GUIDE_SEEDS: readonly CertificationGuideSeed[] = [
  certification("NCLEX-RN Ultimate Guide", "RN"),
  certification("REx-PN Ultimate Guide", "RPN"),
  certification("CNPLE Ultimate Guide", "NP"),
  certification("FNP Certification Guide", "NP"),
  certification("PMHNP Certification Guide", "NP"),
  certification("AGPCNP Certification Guide", "NP"),
  certification("WHNP Certification Guide", "NP"),
  certification("PNP-PC Certification Guide", "NP"),
  certification("ATI TEAS Guide", "Pre-Nursing"),
  certification("HESI A2 Guide", "Admissions"),
  certification("CASPER Guide", "Admissions"),
] as const;

export const SCHOOL_DIRECTORY_SEEDS: readonly SchoolDirectorySeed[] = [
  school("Best Nursing Schools In Ontario", "RN", "Ontario"),
  school("Best Nursing Schools In Canada", "RN", "Canada"),
  school("Best RT Programs In Canada", "RT", "Canada"),
  school("Best Paramedic Programs In Ontario", "Paramedic", "Ontario"),
  school("Best OT Programs In Canada", "OT", "Canada"),
  school("Best PT Programs In Canada", "PT", "Canada"),
  school("Best MLT Programs In Canada", "MLT", "Canada"),
] as const;

export const COMPARISON_PAGE_SEEDS: readonly ComparisonPageSeed[] = [
  comparison("NurseNest vs UWorld", "competitor", "high"),
  comparison("NurseNest vs Archer", "competitor", "high"),
  comparison("NurseNest vs Bootcamp", "competitor", "high"),
  comparison("NurseNest vs Simple Nursing", "competitor", "high"),
  comparison("NCLEX vs REx-PN", "exam", "medium"),
  comparison("TEAS vs HESI", "exam", "medium"),
  comparison("RN vs RPN", "career", "medium"),
  comparison("FNP vs AGPCNP", "profession", "medium"),
  comparison("RT vs Nursing", "profession", "medium"),
  comparison("OT vs PT", "profession", "medium"),
] as const;

export const FREE_RESOURCE_SEEDS: readonly FreeResourceSeed[] = [
  resource("Nursing School Checklist", "RN", "checklist", "high"),
  resource("Clinical Placement Checklist", "Multiple", "checklist", "high"),
  resource("New Graduate Survival Guide", "RN", "guide", "high"),
  resource("RT Placement Guide", "RT", "guide", "medium"),
  resource("Paramedic Placement Guide", "Paramedic", "guide", "medium"),
  resource("Medication Calculation Cheat Sheet", "RN", "cheat_sheet", "high"),
  resource("Lab Values Cheat Sheet", "Multiple", "cheat_sheet", "high"),
  resource("ECG Quick Reference", "RN", "quick_reference", "high"),
  resource("ATI TEAS Formula Sheet", "Pre-Nursing", "formula_sheet", "medium"),
  resource("HESI Study Guide", "Admissions", "guide", "medium"),
  resource("CASPER Framework Guide", "Admissions", "guide", "medium"),
] as const;

export const EMAIL_LEAD_MAGNETS: readonly EmailLeadMagnet[] = [
  leadMagnet("Free NCLEX Starter Pack", "RN"),
  leadMagnet("Free REx-PN Starter Pack", "RPN"),
  leadMagnet("Free RT Starter Pack", "RT"),
  leadMagnet("Free Paramedic Starter Pack", "Paramedic"),
  leadMagnet("Free ATI TEAS Pack", "Pre-Nursing"),
  leadMagnet("Free HESI Pack", "Admissions"),
  leadMagnet("Free CASPER Pack", "Admissions"),
] as const;

export const CTA_REQUIREMENTS: readonly CtaRequirement[] = [
  cta("Disease Page"),
  cta("Medication Page"),
  cta("Care Plan Page"),
  cta("Lab Page"),
  cta("Clinical Skills Page"),
  cta("Career Guide"),
  cta("Certification Guide"),
  cta("Blog Post"),
  cta("School Page"),
  cta("Allied Health Page"),
] as const;

export const BACKLINK_MAGNETS: readonly BacklinkMagnet[] = [
  backlink("Annual Nursing Student Report", ["schools", "media", "professional organizations"]),
  backlink("Annual Allied Health Student Report", ["schools", "media", "professional organizations"]),
  backlink("Healthcare Student Stress Report", ["media", "student associations"]),
  backlink("Clinical Placement Report", ["schools", "professional organizations", "student associations"]),
  backlink("New Graduate Readiness Report", ["schools", "media", "professional organizations"]),
  backlink("Canadian Healthcare Education Report", ["schools", "media", "professional organizations"]),
  backlink("Healthcare Workforce Pipeline Report", ["media", "professional organizations"]),
] as const;

export const SCHOLARSHIP_PROGRAMS: readonly ScholarshipProgram[] = [
  scholarship("NurseNest Future Healthcare Professional Scholarship", "healthcare"),
  scholarship("NurseNest Nursing Excellence Scholarship", "nursing"),
  scholarship("NurseNest Allied Health Scholarship", "allied_health"),
] as const;

export const CONTENT_TO_ACCOUNT_ACTIONS: readonly ContentToAccountAction[] = [
  "save_article",
  "bookmark",
  "create_study_plan",
  "download_resource",
  "save_to_notebook",
  "get_related_questions",
  "get_related_flashcards",
  "take_practice_quiz",
] as const;

export function buildVisitorGrowthAcquisitionPlan(): VisitorGrowthAcquisitionPlan {
  return {
    projects: ACQUISITION_PROJECTS,
    careerAuthoritySeeds: CAREER_AUTHORITY_SEEDS,
    certificationGuideSeeds: CERTIFICATION_GUIDE_SEEDS,
    schoolDirectorySeeds: SCHOOL_DIRECTORY_SEEDS,
    comparisonPageSeeds: COMPARISON_PAGE_SEEDS,
    freeResourceSeeds: FREE_RESOURCE_SEEDS,
    emailLeadMagnets: EMAIL_LEAD_MAGNETS,
    ctaRequirements: CTA_REQUIREMENTS,
    backlinkMagnets: BACKLINK_MAGNETS,
    scholarshipPrograms: SCHOLARSHIP_PROGRAMS,
    contentToAccountActions: CONTENT_TO_ACCOUNT_ACTIONS,
    successTargets: {
      indexedPages: "thousands",
      organicTrafficGrowth: true,
      emailSubscriberBase: true,
      improvedTrials: true,
      improvedSubscriptions: true,
      strongerBacklinks: true,
      alliedHealthTraffic: true,
    },
  };
}

export function buildRevenueAttributionSummary(rows: readonly RevenueAttributionRow[]): RevenueAttributionSummary {
  return {
    topSubscriberPages: rankBy(rows, "landingPage"),
    professionsByRevenue: rankBy(rows, "profession").map(({ page, ...rest }) => ({ profession: page as ConversionProfession, ...rest })),
    trafficSourcesByRevenue: rankBy(rows, "trafficSource").map(({ page, ...rest }) => ({ trafficSource: page as RevenueAttributionRow["trafficSource"], ...rest })),
    clustersByRevenue: rankBy(rows, "cluster").map(({ page, ...rest }) => ({ cluster: page, ...rest })),
  };
}

export function buildExecutiveGrowthDashboard(input: ExecutiveGrowthDashboardInput): ExecutiveGrowthDashboard {
  const revenueAttribution = buildRevenueAttributionSummary(input.attributionRows);
  return {
    organicTraffic: input.organicTraffic,
    emailSubscribers: input.emailSubscribers,
    accountsCreated: input.accountsCreated,
    trialsStarted: input.trialsStarted,
    subscriptions: input.subscriptions,
    revenueCents: input.revenueCents,
    visitorToAccountRate: rate(input.accountsCreated, input.organicTraffic),
    accountToTrialRate: rate(input.trialsStarted, input.accountsCreated),
    trialToPaidRate: rate(input.subscriptions, input.trialsStarted),
    topLandingPages: revenueAttribution.topSubscriberPages.map((row) => row.page).slice(0, 10),
    topKeywords: topBy(input.attributionRows, "keyword"),
    topConversionPages: revenueAttribution.topSubscriberPages.map((row) => row.page).slice(0, 10),
    topAlliedHealthPages: input.attributionRows
      .filter((row) => ["RT", "Paramedic", "OT", "PT", "MLT", "PSW"].includes(row.profession))
      .sort((a, b) => b.subscriptions - a.subscriptions || b.revenueCents - a.revenueCents)
      .map((row) => row.landingPage)
      .slice(0, 10),
    topCareerPages: input.attributionRows.filter((row) => /career|salary|become|program/i.test(row.landingPage)).map((row) => row.landingPage).slice(0, 10),
    topCertificationPages: input.attributionRows.filter((row) => /nclex|rex-pn|cnple|teas|hesi|casper|certification/i.test(row.landingPage)).map((row) => row.landingPage).slice(0, 10),
    revenueAttribution,
  };
}

export function acquisitionPriorityScore(args: {
  trafficOpportunity: number;
  conversionOpportunity: number;
  backlinkOpportunity: number;
  authorityOpportunity: number;
  productionEffort: number;
}): number {
  const value = args.trafficOpportunity * 0.3 + args.conversionOpportunity * 0.3 + args.backlinkOpportunity * 0.2 + args.authorityOpportunity * 0.2;
  return Math.max(0, Math.min(100, Math.round(value - args.productionEffort * 0.25)));
}

function career(profession: ConversionProfession, title: string, pageFamily: CareerAuthoritySeed["pageFamily"], provinceSpecific: boolean): CareerAuthoritySeed {
  return {
    profession,
    title,
    pageFamily,
    provinceSpecific,
    certificationSpecific: /practical nurse|practitioner|therapist|paramedic|technologist|PSW/i.test(title),
    schoolSpecificExpansion: true,
    primaryAudience: "career_changers",
  };
}

function certification(title: string, profession: ConversionProfession): CertificationGuideSeed {
  return {
    title,
    profession,
    includes: ["exam overview", "blueprint", "study plan", "passing strategy", "common mistakes", "study timeline", "recommended resources", "FAQs"],
  };
}

function school(title: string, profession: ConversionProfession, geography: SchoolDirectorySeed["geography"]): SchoolDirectorySeed {
  return {
    title,
    profession,
    geography,
    requiredBlocks: ["admissions requirements", "tuition", "length", "clinical placements", "career outcomes", "program comparisons"],
  };
}

function comparison(title: string, intent: ComparisonPageSeed["intent"], conversionIntent: ComparisonPageSeed["conversionIntent"]): ComparisonPageSeed {
  return { title, pageFamily: "comparison", intent, conversionIntent };
}

function resource(title: string, profession: FreeResourceSeed["profession"], format: FreeResourceSeed["format"], backlinkPotential: FreeResourceSeed["backlinkPotential"]): FreeResourceSeed {
  return { title, profession, format, requiresEmailCapture: true, backlinkPotential };
}

function leadMagnet(title: string, profession: ConversionProfession): EmailLeadMagnet {
  return {
    title,
    profession,
    includes: ["mini lessons", "questions", "flashcards", "study plans", "checklists"],
    requiresAccount: true,
  };
}

function cta(surface: CtaRequirement["surface"]): CtaRequirement {
  return { surface, requiredCtas: ["primary", "secondary", "related_resource", "trial", "account_creation"] };
}

function backlink(title: string, backlinkAudience: BacklinkMagnet["backlinkAudience"]): BacklinkMagnet {
  return {
    title,
    outputs: ["downloadable PDF", "charts", "infographics", "media summaries", "press kit"],
    backlinkAudience,
  };
}

function scholarship(title: string, audience: ScholarshipProgram["audience"]): ScholarshipProgram {
  return {
    title,
    audience,
    authorityBenefits: ["university backlinks", "college backlinks", "scholarship directory backlinks", "media mentions", "social sharing"],
  };
}

function rate(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 1000) / 1000 : 0;
}

function rankBy<K extends keyof RevenueAttributionRow>(
  rows: readonly RevenueAttributionRow[],
  key: K,
): readonly Array<{ page: string; subscriptions: number; revenueCents: number }> {
  const map = new Map<string, { subscriptions: number; revenueCents: number }>();
  for (const row of rows) {
    const itemKey = String(row[key]);
    const current = map.get(itemKey) ?? { subscriptions: 0, revenueCents: 0 };
    current.subscriptions += row.subscriptions;
    current.revenueCents += row.revenueCents;
    map.set(itemKey, current);
  }
  return [...map.entries()]
    .map(([page, value]) => ({ page, ...value }))
    .sort((a, b) => b.subscriptions - a.subscriptions || b.revenueCents - a.revenueCents);
}

function topBy<K extends keyof RevenueAttributionRow>(rows: readonly RevenueAttributionRow[], key: K): readonly string[] {
  return rankBy(rows, key).map((row) => row.page).slice(0, 10);
}
