/** Regional copy for Canada RN vs US RN hub differentiation (pathway IDs: ca-rn-nclex-rn, us-rn-nclex-rn). */

export type RnRegionalHubCopy = {
  regionLabel: string;
  breadcrumbRegionLabel: string;
  heroTitle: string;
  heroLead: string;
  studyPlanHeading: string;
  studyPlanBody: string;
  onboardingHeading: string;
  onboardingBody: string;
  examFramingHeading: string;
  examFramingBody: string;
  employmentHeading: string;
  employmentBody: string;
  medicationSafetyNote: string;
  testimonialPlaceholders: readonly { name: string; credential: string; quote: string }[];
  faq: readonly { question: string; answer: string }[];
  blogClusterPath: string;
};

const CANADA_RN: RnRegionalHubCopy = {
  regionLabel: "Canada",
  breadcrumbRegionLabel: "Canada RN",
  heroTitle: "NCLEX-RN exam prep for Canadian nurses",
  heroLead: "Canada moved to NCLEX-RN in 2015. NurseNest includes Canadian clinical context, medication safety framing, and NGN-style clinical judgment items scoped for Canadian nursing graduates.",
  studyPlanHeading: "Study plan for Canadian NCLEX-RN candidates",
  studyPlanBody: "Start with a diagnostic set to locate weak clinical concept areas. Sequence lesson blocks by body system before retesting. Focus on pharmacology safety, client-needs frameworks, NGN-style clinical judgment, and provincial practice context embedded in rationale explanations.",
  onboardingHeading: "New graduate transition in Canada",
  onboardingBody: "Canadian new-graduate RNs navigate provincial regulatory frameworks and entry-to-practice competencies simultaneously. NurseNest lessons cover prioritization, delegation within Canadian scope, safe medication administration, and clinical reasoning patterns most tested on NCLEX-RN.",
  examFramingHeading: "NCLEX-RN format for Canadian candidates",
  examFramingBody: "The NCLEX-RN uses computerized adaptive testing (CAT). Canadian and US candidates sit the same exam. Emphasize client-needs categories, NGN-style multiple-response items, and clinical judgment under time pressure.",
  employmentHeading: "After NCLEX-RN: Canadian nursing employment transition",
  employmentBody: "Canadian employers expect new graduates to demonstrate safe delegation, medication knowledge, and early-warning pattern recognition. NurseNest lessons stay relevant beyond exam day.",
  medicationSafetyNote: "Canadian medication safety framing is embedded in pharmacology rationales: look-alike/sound-alike risks, high-alert medication protocols, and right-patient verification steps.",
  testimonialPlaceholders: [
    { name: "Sarah M.", credential: "RN, Ontario", quote: "The adaptive practice helped me stop second-guessing myself on client-needs questions." },
    { name: "Daniel K.", credential: "RN, British Columbia", quote: "I needed Canadian context in my pharmacology rationales. NurseNest had it." },
    { name: "Priya L.", credential: "RN, Alberta", quote: "The NGN-style questions felt exactly like what was on my actual NCLEX." },
  ],
  faq: [
    { question: "Do Canadian nurses write the same NCLEX-RN as US nurses?", answer: "Yes. Canadian candidates write the same NCLEX-RN administered by NCSBN. Provincial regulators accept passing results for registration. Confirm with your provincial regulatory body." },
    { question: "Does NurseNest include Canadian-specific content?", answer: "NurseNest includes rationales with Canadian clinical context, medication safety framing aligned to Canadian practice, and NGN-style clinical judgment items." },
    { question: "What is NGN and why does it matter for Canadian NCLEX candidates?", answer: "Next Generation NCLEX (NGN) introduced new item types: case studies, matrix questions, extended drag-and-drop, and bow-tie decision formats. Canadian and US candidates face the same NGN items." },
    { question: "How long should I study for the Canadian NCLEX-RN?", answer: "Most candidates benefit from 4-8 weeks of structured preparation after program completion, with daily practice and timed adaptive practice before scheduling." },
  ],
  blogClusterPath: "/blog/canada-rn",
};

const US_RN: RnRegionalHubCopy = {
  regionLabel: "United States",
  breadcrumbRegionLabel: "US RN",
  heroTitle: "NCLEX-RN exam prep for US nurses",
  heroLead: "US NCLEX-RN prep with NGN-ready adaptive practice, clinical judgment questions, and Med-Surg prioritization training. NurseNest is built for US residency preparation and the full NCLEX-RN journey.",
  studyPlanHeading: "US NCLEX-RN study plan",
  studyPlanBody: "Start with a diagnostic to identify weak content areas by NCLEX client-needs category. Prioritize Med-Surg, pharmacology safety, and NGN-style clinical judgment. Use adaptive CAT-mode practice once you can explain why each distractor is wrong.",
  onboardingHeading: "US new graduate RN onboarding",
  onboardingBody: "US hospital residency programs demand safe prioritization, delegation within US RN scope, early-warning recognition, and high-alert medication management. NurseNest lessons are built for the first 12 months on the floor.",
  examFramingHeading: "NCLEX-RN format for US candidates",
  examFramingBody: "The NCLEX-RN uses computerized adaptive testing (CAT). NGN item types including case studies, matrix grids, bow-tie formats, and extended drag-and-drop are now integrated. Practice under timed conditions to build stamina.",
  employmentHeading: "US RN employment and residency preparation",
  employmentBody: "US graduates enter hospital residency programs, specialty orientation, or direct-hire positions. Employers expect clinical reasoning under shift pressure, interdisciplinary communication, and medication-safety fluency.",
  medicationSafetyNote: "US medication safety framing covers high-alert drugs, look-alike/sound-alike risks, the five rights of administration, and ISMP guidelines embedded in pharmacology rationales.",
  testimonialPlaceholders: [
    { name: "Ashley R.", credential: "RN, Texas", quote: "The NGN case studies finally clicked after using the NurseNest bow-tie format practice." },
    { name: "James T.", credential: "RN, California", quote: "Med-Surg prioritization was my weakest area. The structured lessons helped me stop guessing." },
    { name: "Maria C.", credential: "RN, Florida", quote: "The pharmacology rationales explained the mechanism, not just the right answer." },
  ],
  faq: [
    { question: "What is NGN and how does it affect US NCLEX-RN preparation?", answer: "Next Generation NCLEX (NGN) introduced new item types: case studies, matrix questions, extended drag-and-drop, and bow-tie decision formats. All US NCLEX-RN candidates encounter NGN items." },
    { question: "What is the highest-yield content area for US NCLEX-RN?", answer: "Medical-surgical nursing, pharmacology, safety and infection control, and management of care make up the largest NCLEX-RN content portions. Clinical judgment questions requiring prioritization across multiple clients are consistently high-yield." },
    { question: "Does NurseNest have NGN-style practice questions?", answer: "NurseNest includes NGN-style clinical judgment items, case-based questions, and advanced reasoning formats as part of the US NCLEX-RN question pool." },
    { question: "How long should I study for the US NCLEX-RN?", answer: "Most candidates benefit from 4-8 weeks of structured preparation after nursing program completion, with daily practice and at least two timed full-length simulation sessions before scheduling." },
  ],
  blogClusterPath: "/blog/us-rn",
};

const BY_PATHWAY: Record<string, RnRegionalHubCopy> = {
  "ca-rn-nclex-rn": CANADA_RN,
  "us-rn-nclex-rn": US_RN,
};

export function getRnRegionalHubCopy(pathwayId: string): RnRegionalHubCopy | null {
  return BY_PATHWAY[pathwayId] ?? null;
}

export function isRnRegionalPathwayId(pathwayId: string): boolean {
  return pathwayId in BY_PATHWAY;
}
