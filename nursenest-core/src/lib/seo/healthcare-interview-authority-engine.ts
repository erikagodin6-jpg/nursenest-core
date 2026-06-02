import type { ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type InterviewProfession = ConversionProfession | "Social Work" | "Future";

export type InterviewCareerStage =
  | "student"
  | "new_grad"
  | "career_changer"
  | "experienced_clinician"
  | "internationally_educated"
  | "healthcare_leader";

export type InterviewQuestionBlock =
  | "question"
  | "why_employers_ask_it"
  | "what_they_are_assessing"
  | "strong_example_answer"
  | "weak_example_answer"
  | "common_mistakes"
  | "clinical_considerations"
  | "new_graduate_tips"
  | "advanced_professional_tips";

export type StarExampleSource = "clinical_placements" | "simulations" | "volunteer_experience" | "healthcare_employment" | "leadership_roles";

export type InterviewSpecialtyTrack =
  | "ICU"
  | "Emergency"
  | "Pediatrics"
  | "NICU"
  | "Cardiology"
  | "Mental Health"
  | "Respiratory Critical Care"
  | "Flight Paramedic"
  | "Community Care"
  | "Primary Care";

export type BehavioralInterviewDomain =
  | "Conflict Resolution"
  | "Time Management"
  | "Prioritization"
  | "Delegation"
  | "Communication"
  | "Professionalism"
  | "Patient Advocacy"
  | "Ethics"
  | "Leadership"
  | "Safety";

export type ClinicalInterviewDomain =
  | "Patient Deterioration"
  | "Medication Safety"
  | "Emergency Response"
  | "Assessment Priorities"
  | "Clinical Judgment"
  | "Escalation"
  | "Documentation"
  | "Team Communication";

export type InterviewInternalLink =
  | "career_guides"
  | "salary_pages"
  | "school_pages"
  | "certification_guides"
  | "new_graduate_hub"
  | "clinical_skills"
  | "professional_development";

export type InterviewLeadMagnet = "interview_preparation_pack" | "new_graduate_success_guide" | "resume_guide" | "interview_checklist" | "star_worksheet";

export type InterviewSeoTarget =
  | "nursing_interview_questions"
  | "rt_interview_questions"
  | "paramedic_interview_questions"
  | "ot_interview_questions"
  | "pt_interview_questions"
  | "mlt_interview_questions"
  | "new_graduate_interview_questions"
  | "hospital_interview_questions"
  | "specialty_interview_questions";

export type InterviewScaleDimension = "profession_specific" | "specialty_specific" | "career_stage_specific" | "province_specific";

export type InterviewHubSeed = {
  slug: string;
  title: string;
  profession: InterviewProfession;
  canonicalPath: `/careers/interviews/${string}`;
  targetAudience: readonly InterviewCareerStage[];
  seoTargets: readonly InterviewSeoTarget[];
};

export type InterviewLibrarySeed = {
  slug: string;
  title: string;
  profession: InterviewProfession;
  minQuestions: number;
  maxQuestions: number;
  category: "nursing" | "allied_health" | "new_graduate" | "specialty" | "behavioral" | "clinical";
};

export type InterviewQuestionSeed = {
  id: string;
  question: string;
  profession: InterviewProfession;
  careerStage: InterviewCareerStage;
  specialty?: InterviewSpecialtyTrack;
  behavioralDomain?: BehavioralInterviewDomain;
  clinicalDomain?: ClinicalInterviewDomain;
  requiredBlocks: readonly InterviewQuestionBlock[];
  starExampleSources: readonly StarExampleSource[];
  internalLinks: readonly InterviewInternalLink[];
  leadMagnets: readonly InterviewLeadMagnet[];
  seoTargets: readonly InterviewSeoTarget[];
};

export type StarResponseEngine = {
  framework: readonly ["situation", "task", "action", "result"];
  exampleSources: readonly StarExampleSource[];
  outputRequirements: readonly ["specific_context", "learner_role", "action_taken", "measurable_or_observable_result", "reflection_or_growth"];
};

export type HiringManagerInsightContract = {
  whatHiringManagersWant: readonly string[];
  whatHiringManagersDislike: readonly string[];
  commonInterviewMistakes: readonly string[];
  resumeMistakes: readonly string[];
  professionalCommunicationTips: readonly string[];
};

export type MockInterviewSystemContract = {
  launchStatus: "future";
  capabilities: readonly ["practice_interviews", "video_interviews", "timed_responses", "feedback", "scoring"];
  gatedUntilReady: true;
};

export type InterviewAuthorityDashboard = {
  professionHubs: number;
  nursingLibraries: number;
  alliedLibraries: number;
  newGraduateCenters: number;
  specialtyTracks: number;
  behavioralDomains: number;
  clinicalDomains: number;
  questionSeeds: number;
  yearOneTargetPages: 2000;
  remainingYearOnePages: number;
  scaleDimensions: readonly InterviewScaleDimension[];
  professionsCovered: readonly string[];
};

const requiredQuestionBlocks = [
  "question",
  "why_employers_ask_it",
  "what_they_are_assessing",
  "strong_example_answer",
  "weak_example_answer",
  "common_mistakes",
  "clinical_considerations",
  "new_graduate_tips",
  "advanced_professional_tips",
] as const satisfies readonly InterviewQuestionBlock[];

const starExampleSources = ["clinical_placements", "simulations", "volunteer_experience", "healthcare_employment", "leadership_roles"] as const satisfies readonly StarExampleSource[];
const internalLinks = ["career_guides", "salary_pages", "school_pages", "certification_guides", "new_graduate_hub", "clinical_skills", "professional_development"] as const satisfies readonly InterviewInternalLink[];
const leadMagnets = ["interview_preparation_pack", "new_graduate_success_guide", "resume_guide", "interview_checklist", "star_worksheet"] as const satisfies readonly InterviewLeadMagnet[];
const seoTargets = ["nursing_interview_questions", "rt_interview_questions", "paramedic_interview_questions", "ot_interview_questions", "pt_interview_questions", "mlt_interview_questions", "new_graduate_interview_questions", "hospital_interview_questions", "specialty_interview_questions"] as const satisfies readonly InterviewSeoTarget[];
const careerStages = ["student", "new_grad", "career_changer", "experienced_clinician", "internationally_educated", "healthcare_leader"] as const satisfies readonly InterviewCareerStage[];

export const INTERVIEW_SCALE_DIMENSIONS = ["profession_specific", "specialty_specific", "career_stage_specific", "province_specific"] as const satisfies readonly InterviewScaleDimension[];

export const INTERVIEW_PROFESSION_HUBS: readonly InterviewHubSeed[] = [
  hub("rn-interview-questions", "RN Interview Questions", "RN"),
  hub("rpn-interview-questions", "RPN Interview Questions", "RPN"),
  hub("np-interview-questions", "NP Interview Questions", "NP"),
  hub("respiratory-therapy-interview-questions", "Respiratory Therapy Interview Questions", "RT"),
  hub("paramedic-interview-questions", "Paramedic Interview Questions", "Paramedic"),
  hub("occupational-therapy-interview-questions", "OT Interview Questions", "OT"),
  hub("physiotherapy-interview-questions", "PT Interview Questions", "PT"),
  hub("medical-laboratory-technology-interview-questions", "MLT Interview Questions", "MLT"),
  hub("psw-interview-questions", "PSW Interview Questions", "PSW"),
  hub("social-work-interview-questions", "Social Work Interview Questions", "Social Work"),
  hub("future-healthcare-interview-questions", "Future Healthcare Interview Questions", "Future"),
] as const;

export const NURSING_INTERVIEW_LIBRARY_SEEDS: readonly InterviewLibrarySeed[] = [
  library("100-nursing-interview-questions", "100 Nursing Interview Questions", "RN", 100, 200, "nursing"),
  library("new-graduate-nursing-interview-questions", "New Graduate Nursing Interview Questions", "RN", 100, 200, "new_graduate"),
  library("icu-nurse-interview-questions", "ICU Nurse Interview Questions", "RN", 50, 200, "specialty"),
  library("emergency-nurse-interview-questions", "Emergency Nurse Interview Questions", "RN", 50, 200, "specialty"),
  library("pediatric-nurse-interview-questions", "Pediatric Nurse Interview Questions", "RN", 50, 200, "specialty"),
  library("mental-health-nurse-interview-questions", "Mental Health Nurse Interview Questions", "RN", 50, 200, "specialty"),
  library("community-nurse-interview-questions", "Community Nurse Interview Questions", "RN", 50, 200, "specialty"),
  library("charge-nurse-interview-questions", "Charge Nurse Interview Questions", "RN", 50, 200, "specialty"),
  library("nursing-leadership-interview-questions", "Leadership Interview Questions", "RN", 50, 200, "specialty"),
] as const;

export const ALLIED_INTERVIEW_LIBRARY_SEEDS: readonly InterviewLibrarySeed[] = [
  library("respiratory-therapy-interview-questions", "Respiratory Therapy Interview Questions", "RT", 50, 200, "allied_health"),
  library("paramedic-interview-questions", "Paramedic Interview Questions", "Paramedic", 50, 200, "allied_health"),
  library("occupational-therapy-interview-questions", "OT Interview Questions", "OT", 50, 200, "allied_health"),
  library("physiotherapy-interview-questions", "PT Interview Questions", "PT", 50, 200, "allied_health"),
  library("medical-laboratory-technology-interview-questions", "MLT Interview Questions", "MLT", 50, 200, "allied_health"),
  library("psw-interview-questions", "PSW Interview Questions", "PSW", 50, 200, "allied_health"),
] as const;

export const SPECIALTY_INTERVIEW_TRACKS = ["ICU", "Emergency", "Pediatrics", "NICU", "Cardiology", "Mental Health", "Respiratory Critical Care", "Flight Paramedic", "Community Care", "Primary Care"] as const satisfies readonly InterviewSpecialtyTrack[];
export const BEHAVIORAL_INTERVIEW_DOMAINS = ["Conflict Resolution", "Time Management", "Prioritization", "Delegation", "Communication", "Professionalism", "Patient Advocacy", "Ethics", "Leadership", "Safety"] as const satisfies readonly BehavioralInterviewDomain[];
export const CLINICAL_INTERVIEW_DOMAINS = ["Patient Deterioration", "Medication Safety", "Emergency Response", "Assessment Priorities", "Clinical Judgment", "Escalation", "Documentation", "Team Communication"] as const satisfies readonly ClinicalInterviewDomain[];

export const NEW_GRAD_INTERVIEW_CENTERS: readonly InterviewLibrarySeed[] = [
  library("new-graduate-nurse-interviews", "New Graduate Nurse Interviews", "RN", 100, 200, "new_graduate"),
  library("new-graduate-rt-interviews", "New Graduate RT Interviews", "RT", 50, 150, "new_graduate"),
  library("new-graduate-paramedic-interviews", "New Graduate Paramedic Interviews", "Paramedic", 50, 150, "new_graduate"),
  library("new-graduate-ot-interviews", "New Graduate OT Interviews", "OT", 50, 150, "new_graduate"),
  library("new-graduate-pt-interviews", "New Graduate PT Interviews", "PT", 50, 150, "new_graduate"),
  library("new-graduate-mlt-interviews", "New Graduate MLT Interviews", "MLT", 50, 150, "new_graduate"),
] as const;

export const STAR_RESPONSE_ENGINE: StarResponseEngine = {
  framework: ["situation", "task", "action", "result"],
  exampleSources: starExampleSources,
  outputRequirements: ["specific_context", "learner_role", "action_taken", "measurable_or_observable_result", "reflection_or_growth"],
};

export const HIRING_MANAGER_INSIGHTS: HiringManagerInsightContract = {
  whatHiringManagersWant: ["clear clinical judgment", "professional accountability", "safe escalation", "teachability", "team communication"],
  whatHiringManagersDislike: ["vague examples", "blaming previous teams", "unsafe scope claims", "memorized answers without reflection"],
  commonInterviewMistakes: ["answering without a clinical example", "missing the patient safety issue", "not explaining what was learned", "overstating independence as a new graduate"],
  resumeMistakes: ["listing duties without outcomes", "omitting placement settings", "hiding clinical skills", "using generic objective statements"],
  professionalCommunicationTips: ["answer directly first", "use one specific example", "name the safety priority", "close with growth or next steps"],
};

export const MOCK_INTERVIEW_SYSTEM_CONTRACT: MockInterviewSystemContract = {
  launchStatus: "future",
  capabilities: ["practice_interviews", "video_interviews", "timed_responses", "feedback", "scoring"],
  gatedUntilReady: true,
};

export const INTERVIEW_QUESTION_SEEDS: readonly InterviewQuestionSeed[] = [
  questionSeed("nursing-tell-me-about-yourself", "Tell me about yourself as a nurse.", "RN", "new_grad", { behavioralDomain: "Communication" }),
  questionSeed("nursing-prioritize-four-patients", "How would you prioritize care for four assigned patients at the start of shift?", "RN", "new_grad", { behavioralDomain: "Prioritization", clinicalDomain: "Assessment Priorities" }),
  questionSeed("icu-patient-deterioration", "Describe a time you recognized patient deterioration and escalated care.", "RN", "experienced_clinician", { specialty: "ICU", clinicalDomain: "Patient Deterioration" }),
  questionSeed("emergency-medication-safety", "Tell me about a medication safety concern you identified before harm reached the patient.", "RN", "experienced_clinician", { specialty: "Emergency", clinicalDomain: "Medication Safety" }),
  questionSeed("rt-ventilator-alarm", "A ventilated patient has a high-pressure alarm. What would you assess first?", "RT", "new_grad", { specialty: "Respiratory Critical Care", clinicalDomain: "Emergency Response" }),
  questionSeed("paramedic-primary-survey", "Walk me through your primary survey for an unstable trauma patient.", "Paramedic", "new_grad", { specialty: "Flight Paramedic", clinicalDomain: "Assessment Priorities" }),
  questionSeed("ot-conflict-family-goals", "How would you handle a family that disagrees with the patient's rehabilitation goals?", "OT", "new_grad", { behavioralDomain: "Conflict Resolution" }),
  questionSeed("pt-mobility-safety", "Describe how you would manage a mobility session when a patient becomes dizzy.", "PT", "new_grad", { clinicalDomain: "Patient Deterioration" }),
  questionSeed("mlt-specimen-error", "What would you do if you identified a mislabeled specimen before processing?", "MLT", "new_grad", { behavioralDomain: "Safety", clinicalDomain: "Documentation" }),
  questionSeed("psw-professional-boundaries", "How do you maintain professional boundaries while building trust with clients?", "PSW", "student", { behavioralDomain: "Professionalism" }),
] as const;

export function validateInterviewQuestionSeed(seed: InterviewQuestionSeed): readonly string[] {
  const issues: string[] = [];
  for (const block of requiredQuestionBlocks) {
    if (!seed.requiredBlocks.includes(block)) issues.push(`Missing ${block} question block.`);
  }
  for (const source of starExampleSources) {
    if (!seed.starExampleSources.includes(source)) issues.push(`Missing ${source} STAR example source.`);
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

export function getInterviewHubForProfession(profession: InterviewProfession): InterviewHubSeed | undefined {
  return INTERVIEW_PROFESSION_HUBS.find((hubSeed) => hubSeed.profession === profession);
}

export function getInterviewQuestionsForProfession(profession: InterviewProfession): readonly InterviewQuestionSeed[] {
  return INTERVIEW_QUESTION_SEEDS.filter((seed) => seed.profession === profession);
}

export function buildInterviewAuthorityDashboard(): InterviewAuthorityDashboard {
  const allLibraries = [...NURSING_INTERVIEW_LIBRARY_SEEDS, ...ALLIED_INTERVIEW_LIBRARY_SEEDS, ...NEW_GRAD_INTERVIEW_CENTERS];
  const professionsCovered = [...new Set(INTERVIEW_PROFESSION_HUBS.map((hubSeed) => hubSeed.profession))].sort();
  return {
    professionHubs: INTERVIEW_PROFESSION_HUBS.length,
    nursingLibraries: NURSING_INTERVIEW_LIBRARY_SEEDS.length,
    alliedLibraries: ALLIED_INTERVIEW_LIBRARY_SEEDS.length,
    newGraduateCenters: NEW_GRAD_INTERVIEW_CENTERS.length,
    specialtyTracks: SPECIALTY_INTERVIEW_TRACKS.length,
    behavioralDomains: BEHAVIORAL_INTERVIEW_DOMAINS.length,
    clinicalDomains: CLINICAL_INTERVIEW_DOMAINS.length,
    questionSeeds: INTERVIEW_QUESTION_SEEDS.length,
    yearOneTargetPages: 2000,
    remainingYearOnePages: Math.max(0, 2000 - allLibraries.reduce((total, seed) => total + seed.minQuestions, 0)),
    scaleDimensions: INTERVIEW_SCALE_DIMENSIONS,
    professionsCovered,
  };
}

function hub(slug: string, title: string, profession: InterviewProfession): InterviewHubSeed {
  return {
    slug,
    title,
    profession,
    canonicalPath: `/careers/interviews/${slug}`,
    targetAudience: careerStages,
    seoTargets,
  };
}

function library(slug: string, title: string, profession: InterviewProfession, minQuestions: number, maxQuestions: number, category: InterviewLibrarySeed["category"]): InterviewLibrarySeed {
  return { slug, title, profession, minQuestions, maxQuestions, category };
}

function questionSeed(
  id: string,
  question: string,
  profession: InterviewProfession,
  careerStage: InterviewCareerStage,
  options: Partial<Pick<InterviewQuestionSeed, "specialty" | "behavioralDomain" | "clinicalDomain">> = {},
): InterviewQuestionSeed {
  return {
    id,
    question,
    profession,
    careerStage,
    ...options,
    requiredBlocks: requiredQuestionBlocks,
    starExampleSources,
    internalLinks,
    leadMagnets,
    seoTargets: seoTargets.filter((target) => target.includes(profession.toLowerCase()) || target === "new_graduate_interview_questions" || target === "hospital_interview_questions" || target === "specialty_interview_questions"),
  };
}
