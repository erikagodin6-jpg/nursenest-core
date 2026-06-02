export type PlacementProfession = "Nursing" | "RT" | "Paramedic" | "OT" | "PT" | "MLT" | "PSW" | "Pre-Nursing" | "NP";

export type PlacementGuideBlock =
  | "what_to_bring"
  | "how_to_prepare"
  | "common_expectations"
  | "instructor_expectations"
  | "professional_conduct"
  | "documentation"
  | "communication"
  | "common_mistakes"
  | "confidence_tips";

export type PlacementInternalLink =
  | "clinical_skills"
  | "lessons"
  | "flashcards"
  | "questions"
  | "simulations"
  | "new_graduate_hub"
  | "interview_hub"
  | "career_guides";

export type PlacementLeadMagnet = "clinical_placement_survival_guide_pdf" | "instructor_question_pack" | "clinical_skills_checklist" | "documentation_cheat_sheet";

export type PlacementSeoTarget =
  | "nursing_clinical_placement_tips"
  | "what_to_bring_to_nursing_clinical"
  | "rt_clinical_placement_guide"
  | "paramedic_clinical_placement_guide"
  | "ot_placement_guide"
  | "pt_placement_guide"
  | "mlt_placement_guide"
  | "clinical_instructor_questions"
  | "clinical_placement_checklist";

export type PlacementScaleDimension = "profession_specific" | "unit_specific" | "skill_specific" | "condition_specific";

export type PlacementHubSeed = {
  slug: string;
  title: string;
  profession: PlacementProfession;
  canonicalPath: `/clinical-placement/${string}`;
  audience: readonly PlacementProfession[];
  seoTargets: readonly PlacementSeoTarget[];
};

export type FirstDayGuideSeed = {
  slug: string;
  title: string;
  profession: PlacementProfession;
  requiredBlocks: readonly PlacementGuideBlock[];
  internalLinks: readonly PlacementInternalLink[];
  leadMagnets: readonly PlacementLeadMagnet[];
  seoTargets: readonly PlacementSeoTarget[];
};

export type PlacementChecklistSeed = {
  slug: string;
  title: string;
  checklistType: "downloadable" | "interactive";
  profession: PlacementProfession | "Multiple";
};

export type InstructorQuestionLibrarySeed = {
  slug: string;
  title: string;
  profession: PlacementProfession | "Multiple";
  targetQuestions: number;
  requiredBlocks: readonly ["question", "answer", "clinical_reasoning", "common_mistakes"];
};

export type UnitGuideSeed = {
  slug: string;
  title: string;
  unit: "Medical-Surgical" | "ICU" | "Emergency Department" | "Pediatrics" | "Mental Health" | "Community" | "Long-Term Care";
  professions: readonly PlacementProfession[];
};

export type QuickPrepPageSeed = {
  slug: string;
  title: string;
  conditionOrRotation: string;
  professions: readonly PlacementProfession[];
  preparationFocus: readonly ["assessment", "common_medications", "labs_or_diagnostics", "safety_risks", "questions_to_expect"];
};

export type ClinicalSkillsPrepSeed = {
  slug: string;
  title: string;
  profession: PlacementProfession;
  linksToSkillsPassport: true;
};

export type PlacementSuccessStoryContract = {
  supportedStories: readonly ["student_stories", "placement_wins", "lessons_learned", "advice_for_future_students"];
  requiresConsent: true;
  eeatBenefit: readonly ["experience", "trust", "profession_specific_context"];
};

export type ClinicalPlacementSurvivalDashboard = {
  professionHubs: number;
  firstDayGuides: number;
  checklists: number;
  instructorQuestionLibraries: number;
  unitGuides: number;
  quickPrepPages: number;
  skillsPrepPages: number;
  documentationPages: number;
  confidenceTopics: number;
  yearOneTargetPages: 500;
  remainingYearOnePages: number;
  scaleDimensions: readonly PlacementScaleDimension[];
  professionsCovered: readonly string[];
};

const guideBlocks = [
  "what_to_bring",
  "how_to_prepare",
  "common_expectations",
  "instructor_expectations",
  "professional_conduct",
  "documentation",
  "communication",
  "common_mistakes",
  "confidence_tips",
] as const satisfies readonly PlacementGuideBlock[];

const internalLinks = ["clinical_skills", "lessons", "flashcards", "questions", "simulations", "new_graduate_hub", "interview_hub", "career_guides"] as const satisfies readonly PlacementInternalLink[];
const leadMagnets = ["clinical_placement_survival_guide_pdf", "instructor_question_pack", "clinical_skills_checklist", "documentation_cheat_sheet"] as const satisfies readonly PlacementLeadMagnet[];
const seoTargets = ["nursing_clinical_placement_tips", "what_to_bring_to_nursing_clinical", "rt_clinical_placement_guide", "paramedic_clinical_placement_guide", "ot_placement_guide", "pt_placement_guide", "mlt_placement_guide", "clinical_instructor_questions", "clinical_placement_checklist"] as const satisfies readonly PlacementSeoTarget[];

export const PLACEMENT_SCALE_DIMENSIONS = ["profession_specific", "unit_specific", "skill_specific", "condition_specific"] as const satisfies readonly PlacementScaleDimension[];

export const PLACEMENT_PROFESSION_HUBS: readonly PlacementHubSeed[] = [
  hub("nursing-placement-hub", "Nursing Placement Hub", "Nursing"),
  hub("rt-placement-hub", "RT Placement Hub", "RT"),
  hub("paramedic-placement-hub", "Paramedic Placement Hub", "Paramedic"),
  hub("ot-placement-hub", "OT Placement Hub", "OT"),
  hub("pt-placement-hub", "PT Placement Hub", "PT"),
  hub("mlt-placement-hub", "MLT Placement Hub", "MLT"),
  hub("psw-placement-hub", "PSW Placement Hub", "PSW"),
] as const;

export const FIRST_DAY_GUIDES: readonly FirstDayGuideSeed[] = [
  firstDayGuide("first-day-of-nursing-clinical", "First Day Of Nursing Clinical", "Nursing"),
  firstDayGuide("first-day-of-rt-placement", "First Day Of RT Placement", "RT"),
  firstDayGuide("first-day-of-paramedic-placement", "First Day Of Paramedic Placement", "Paramedic"),
  firstDayGuide("first-day-of-ot-placement", "First Day Of OT Placement", "OT"),
  firstDayGuide("first-day-of-pt-placement", "First Day Of PT Placement", "PT"),
  firstDayGuide("first-day-of-mlt-placement", "First Day Of MLT Placement", "MLT"),
] as const;

export const CLINICAL_CHECKLISTS: readonly PlacementChecklistSeed[] = [
  checklist("clinical-placement-checklist", "Clinical Placement Checklist", "Multiple"),
  checklist("night-before-clinical-checklist", "Night Before Clinical Checklist", "Multiple"),
  checklist("first-shift-checklist", "First Shift Checklist", "Multiple"),
  checklist("clinical-documentation-checklist", "Clinical Documentation Checklist", "Multiple"),
  checklist("medication-pass-checklist", "Medication Pass Checklist", "Nursing"),
  checklist("assessment-checklist", "Assessment Checklist", "Multiple"),
] as const;

export const INSTRUCTOR_QUESTION_LIBRARIES: readonly InstructorQuestionLibrarySeed[] = [
  instructorLibrary("50-questions-clinical-instructors-ask", "50 Questions Clinical Instructors Ask", "Multiple", 50),
  instructorLibrary("100-nursing-clinical-questions", "100 Nursing Clinical Questions", "Nursing", 100),
  instructorLibrary("rt-clinical-questions", "RT Clinical Questions", "RT", 50),
  instructorLibrary("paramedic-clinical-questions", "Paramedic Clinical Questions", "Paramedic", 50),
  instructorLibrary("ot-clinical-questions", "OT Clinical Questions", "OT", 50),
  instructorLibrary("pt-clinical-questions", "PT Clinical Questions", "PT", 50),
  instructorLibrary("mlt-clinical-questions", "MLT Clinical Questions", "MLT", 50),
] as const;

export const UNIT_SPECIFIC_GUIDES: readonly UnitGuideSeed[] = [
  unitGuide("medical-surgical-clinical-survival-guide", "Medical-Surgical Clinical Survival Guide", "Medical-Surgical", ["Nursing", "PSW"]),
  unitGuide("icu-clinical-survival-guide", "ICU Clinical Survival Guide", "ICU", ["Nursing", "RT", "Paramedic"]),
  unitGuide("emergency-department-clinical-guide", "Emergency Department Clinical Guide", "Emergency Department", ["Nursing", "RT", "Paramedic"]),
  unitGuide("pediatrics-clinical-guide", "Pediatrics Clinical Guide", "Pediatrics", ["Nursing", "RT", "OT", "PT"]),
  unitGuide("mental-health-clinical-guide", "Mental Health Clinical Guide", "Mental Health", ["Nursing", "PSW", "OT"]),
  unitGuide("community-clinical-guide", "Community Clinical Guide", "Community", ["Nursing", "OT", "PT", "PSW"]),
  unitGuide("long-term-care-clinical-guide", "Long-Term Care Clinical Guide", "Long-Term Care", ["Nursing", "PSW", "OT", "PT"]),
] as const;

export const QUICK_PREP_PAGES: readonly QuickPrepPageSeed[] = [
  quickPrep("what-to-know-before-heart-failure-clinical", "What To Know Before A Heart Failure Clinical", "Heart Failure", ["Nursing", "RT"]),
  quickPrep("what-to-know-before-copd-clinical", "What To Know Before A COPD Clinical", "COPD", ["Nursing", "RT"]),
  quickPrep("what-to-know-before-stroke-clinical", "What To Know Before A Stroke Clinical", "Stroke", ["Nursing", "OT", "PT"]),
  quickPrep("what-to-know-before-rt-ventilator-rotation", "What To Know Before An RT Ventilator Rotation", "RT Ventilator Rotation", ["RT", "Nursing"]),
  quickPrep("what-to-know-before-trauma-rotation", "What To Know Before A Trauma Rotation", "Trauma Rotation", ["Paramedic", "Nursing", "RT"]),
] as const;

export const CLINICAL_SKILLS_PREP_PAGES: readonly ClinicalSkillsPrepSeed[] = [
  skillPrep("top-clinical-skills-for-nursing-students", "Top Clinical Skills For Nursing Students", "Nursing"),
  skillPrep("top-clinical-skills-for-rt-students", "Top Clinical Skills For RT Students", "RT"),
  skillPrep("top-clinical-skills-for-paramedic-students", "Top Clinical Skills For Paramedic Students", "Paramedic"),
  skillPrep("top-clinical-skills-for-ot-students", "Top Clinical Skills For OT Students", "OT"),
  skillPrep("top-clinical-skills-for-pt-students", "Top Clinical Skills For PT Students", "PT"),
  skillPrep("top-clinical-skills-for-mlt-students", "Top Clinical Skills For MLT Students", "MLT"),
] as const;

export const CLINICAL_DOCUMENTATION_HUB_PAGES = [
  "How To Chart During Clinical",
  "SOAP Notes",
  "DAR Charting",
  "SBAR",
  "Documentation Examples",
  "Clinical Documentation Mistakes",
] as const;

export const CLINICAL_CONFIDENCE_CENTER_TOPICS = [
  "Clinical Anxiety",
  "Imposter Syndrome",
  "Confidence Building",
  "Professional Communication",
  "Talking To Patients",
  "Talking To Instructors",
  "Talking To Physicians",
  "Handling Mistakes",
] as const;

export const PLACEMENT_SUCCESS_STORY_CONTRACT: PlacementSuccessStoryContract = {
  supportedStories: ["student_stories", "placement_wins", "lessons_learned", "advice_for_future_students"],
  requiresConsent: true,
  eeatBenefit: ["experience", "trust", "profession_specific_context"],
};

export function validateFirstDayGuide(seed: FirstDayGuideSeed): readonly string[] {
  const issues: string[] = [];
  for (const block of guideBlocks) {
    if (!seed.requiredBlocks.includes(block)) issues.push(`Missing ${block} guide block.`);
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

export function getPlacementHubForProfession(profession: PlacementProfession): PlacementHubSeed | undefined {
  return PLACEMENT_PROFESSION_HUBS.find((hubSeed) => hubSeed.profession === profession);
}

export function buildClinicalPlacementSurvivalDashboard(): ClinicalPlacementSurvivalDashboard {
  const pageSeedCount =
    PLACEMENT_PROFESSION_HUBS.length +
    FIRST_DAY_GUIDES.length +
    CLINICAL_CHECKLISTS.length +
    INSTRUCTOR_QUESTION_LIBRARIES.length +
    UNIT_SPECIFIC_GUIDES.length +
    QUICK_PREP_PAGES.length +
    CLINICAL_SKILLS_PREP_PAGES.length +
    CLINICAL_DOCUMENTATION_HUB_PAGES.length +
    CLINICAL_CONFIDENCE_CENTER_TOPICS.length;
  const professionsCovered = [...new Set([...PLACEMENT_PROFESSION_HUBS.map((hubSeed) => hubSeed.profession), ...FIRST_DAY_GUIDES.map((guide) => guide.profession)])].sort();
  return {
    professionHubs: PLACEMENT_PROFESSION_HUBS.length,
    firstDayGuides: FIRST_DAY_GUIDES.length,
    checklists: CLINICAL_CHECKLISTS.length,
    instructorQuestionLibraries: INSTRUCTOR_QUESTION_LIBRARIES.length,
    unitGuides: UNIT_SPECIFIC_GUIDES.length,
    quickPrepPages: QUICK_PREP_PAGES.length,
    skillsPrepPages: CLINICAL_SKILLS_PREP_PAGES.length,
    documentationPages: CLINICAL_DOCUMENTATION_HUB_PAGES.length,
    confidenceTopics: CLINICAL_CONFIDENCE_CENTER_TOPICS.length,
    yearOneTargetPages: 500,
    remainingYearOnePages: Math.max(0, 500 - pageSeedCount),
    scaleDimensions: PLACEMENT_SCALE_DIMENSIONS,
    professionsCovered,
  };
}

function hub(slug: string, title: string, profession: PlacementProfession): PlacementHubSeed {
  return {
    slug,
    title,
    profession,
    canonicalPath: `/clinical-placement/${slug}`,
    audience: ["Pre-Nursing", "Nursing", "RT", "Paramedic", "OT", "PT", "MLT", "PSW"],
    seoTargets,
  };
}

function firstDayGuide(slug: string, title: string, profession: PlacementProfession): FirstDayGuideSeed {
  return { slug, title, profession, requiredBlocks: guideBlocks, internalLinks, leadMagnets, seoTargets };
}

function checklist(slug: string, title: string, profession: PlacementChecklistSeed["profession"]): PlacementChecklistSeed {
  return { slug, title, profession, checklistType: "downloadable" };
}

function instructorLibrary(slug: string, title: string, profession: InstructorQuestionLibrarySeed["profession"], targetQuestions: number): InstructorQuestionLibrarySeed {
  return { slug, title, profession, targetQuestions, requiredBlocks: ["question", "answer", "clinical_reasoning", "common_mistakes"] };
}

function unitGuide(slug: string, title: string, unit: UnitGuideSeed["unit"], professions: readonly PlacementProfession[]): UnitGuideSeed {
  return { slug, title, unit, professions };
}

function quickPrep(slug: string, title: string, conditionOrRotation: string, professions: readonly PlacementProfession[]): QuickPrepPageSeed {
  return {
    slug,
    title,
    conditionOrRotation,
    professions,
    preparationFocus: ["assessment", "common_medications", "labs_or_diagnostics", "safety_risks", "questions_to_expect"],
  };
}

function skillPrep(slug: string, title: string, profession: PlacementProfession): ClinicalSkillsPrepSeed {
  return { slug, title, profession, linksToSkillsPassport: true };
}
