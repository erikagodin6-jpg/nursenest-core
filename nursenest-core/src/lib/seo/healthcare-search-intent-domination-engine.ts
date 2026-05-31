import type { ConversionFeature, ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type LearnerSearchIntent =
  | "definition"
  | "interpretation"
  | "comparison"
  | "study_strategy"
  | "exam_format"
  | "clinical_priority"
  | "career"
  | "scope"
  | "procedure";

export type AnswerStatus = "not_started" | "outlined" | "drafted" | "review_needed" | "published" | "refresh_needed";

export type SearchAnswerBlock =
  | "short_answer"
  | "expanded_answer"
  | "clinical_context"
  | "common_mistakes"
  | "related_topics"
  | "related_resources"
  | "snippet_block";

export type SearchVisibilityTarget = "google_search" | "ai_overview" | "featured_snippet" | "people_also_ask" | "voice_search" | "long_tail";

export type RelatedResourceType =
  | "related_diseases"
  | "related_medications"
  | "related_lessons"
  | "related_questions"
  | "related_simulations"
  | "related_flashcards"
  | "related_care_plans"
  | "study_guides"
  | "certification_guides";

export type SearchIntentQuestion = {
  id: string;
  question: string;
  profession: ConversionProfession | "Multiple";
  topic: string;
  searchIntent: LearnerSearchIntent;
  searchVolume: number;
  difficulty: number;
  trafficOpportunity: number;
  conversionOpportunity: number;
  cluster: string;
  answerStatus: AnswerStatus;
  visibilityTargets: readonly SearchVisibilityTarget[];
};

export type SearchIntentAnswerContract = {
  questionId: string;
  requiredBlocks: readonly SearchAnswerBlock[];
  relatedResources: readonly RelatedResourceType[];
  conversionFeatures: readonly ConversionFeature[];
  accountCreationCta: string;
  trialCta: string;
  subscriptionCta: string;
  aiOverviewGuidance: readonly string[];
};

export type FaqHub = {
  title: string;
  cluster: string;
  profession: ConversionProfession | "Multiple";
  questionIds: readonly string[];
  canonicalPath: string;
};

export type SearchIntentDashboard = {
  totalQuestions: number;
  publishedAnswers: number;
  draftBacklog: number;
  reviewBacklog: number;
  refreshBacklog: number;
  questionsByProfession: Record<string, number>;
  questionsByIntent: Record<LearnerSearchIntent, number>;
  topTrafficOpportunities: readonly SearchIntentQuestion[];
  topConversionOpportunities: readonly SearchIntentQuestion[];
  faqHubs: readonly FaqHub[];
  yearOneTarget: 10000;
  remainingToYearOneTarget: number;
};

const requiredAnswerBlocks = [
  "short_answer",
  "expanded_answer",
  "clinical_context",
  "common_mistakes",
  "related_topics",
  "related_resources",
  "snippet_block",
] as const satisfies readonly SearchAnswerBlock[];

const requiredRelatedResources = [
  "related_diseases",
  "related_medications",
  "related_lessons",
  "related_questions",
  "related_simulations",
  "related_flashcards",
  "related_care_plans",
  "study_guides",
  "certification_guides",
] as const satisfies readonly RelatedResourceType[];

export const SEARCH_INTENT_QUESTION_SEEDS: readonly SearchIntentQuestion[] = [
  nursing("what-is-heart-failure", "What Is Heart Failure?", "Heart Failure", "definition", 8200, 45, 86, 74, "Heart Failure"),
  nursing("what-is-bnp", "What Is BNP?", "BNP", "definition", 7400, 38, 88, 70, "Heart Failure"),
  nursing("copd-vs-asthma", "What Is The Difference Between COPD And Asthma?", "COPD", "comparison", 6900, 42, 84, 68, "COPD"),
  nursing("what-is-bowtie-question", "What Is A Bowtie Question?", "NGN", "exam_format", 5200, 35, 78, 82, "NGN"),
  nursing("what-is-nclex-cat", "What Is NCLEX CAT?", "NCLEX", "exam_format", 6100, 40, 82, 86, "NCLEX"),
  nursing("how-long-study-nclex", "How Long Should I Study For NCLEX?", "NCLEX", "study_strategy", 12000, 55, 94, 90, "NCLEX"),
  nursing("priority-nursing-intervention", "What Is A Priority Nursing Intervention?", "Prioritization", "clinical_priority", 4300, 36, 75, 78, "Clinical Judgment"),
  nursing("fluid-volume-excess", "What Is Fluid Volume Excess?", "Fluid Balance", "definition", 4900, 34, 77, 66, "Fluid Balance"),
  multi("what-is-an-abg", "What Is An ABG?", "ABG Interpretation", "definition", 9000, 48, 92, 78, "ABG Interpretation"),
  nursing("what-is-a-central-line", "What Is A Central Line?", "Central Lines", "definition", 6200, 41, 81, 62, "Clinical Skills"),
  np("what-is-cnple", "What Is CNPLE?", "CNPLE", "definition", 3200, 34, 70, 82, "CNPLE"),
  np("fnp-vs-agpcnp", "What Is The Difference Between FNP And AGPCNP?", "NP Certifications", "comparison", 4100, 39, 76, 86, "NP Certification"),
  np("what-is-soap-note", "What Is A SOAP Note?", "Documentation", "definition", 7800, 44, 85, 72, "Documentation"),
  np("what-is-differential-diagnosis", "What Is Differential Diagnosis?", "Diagnostic Reasoning", "definition", 6200, 43, 82, 78, "Diagnostic Reasoning"),
  np("what-is-prescriptive-authority", "What Is Prescriptive Authority?", "NP Scope", "scope", 3800, 41, 72, 80, "NP Scope"),
  np("how-hard-is-pmhnp", "How Hard Is PMHNP?", "PMHNP", "study_strategy", 4600, 46, 75, 84, "PMHNP"),
  preNursing("hesi-harder-than-teas", "Is HESI Harder Than TEAS?", "Admissions Exams", "comparison", 9200, 50, 91, 88, "Admissions"),
  preNursing("score-needed-teas", "What Score Do I Need On TEAS?", "ATI TEAS", "study_strategy", 8400, 48, 89, 86, "TEAS"),
  preNursing("what-is-casper", "What Is CASPER?", "CASPER", "definition", 7800, 43, 84, 82, "CASPER"),
  preNursing("how-long-study-hesi", "How Long Should I Study For HESI?", "HESI A2", "study_strategy", 6600, 46, 82, 85, "HESI"),
  preNursing("pass-teas-without-chemistry", "Can I Pass TEAS Without Chemistry?", "ATI TEAS", "study_strategy", 3600, 37, 69, 78, "TEAS"),
  allied("RT", "how-do-ventilators-work", "How Do Ventilators Work?", "Mechanical Ventilation", "definition", 8100, 52, 88, 76, "Ventilator Management"),
  allied("RT", "what-is-peep", "What Is PEEP?", "PEEP", "definition", 7000, 43, 86, 74, "Ventilator Management"),
  allied("RT", "what-is-cpap", "What Is CPAP?", "CPAP", "definition", 8600, 45, 89, 70, "Oxygen Therapy"),
  allied("Paramedic", "what-is-primary-survey", "What Is A Primary Survey?", "Primary Survey", "procedure", 6200, 39, 80, 74, "Paramedic Assessment"),
  allied("Paramedic", "what-is-secondary-survey", "What Is A Secondary Survey?", "Secondary Survey", "procedure", 4200, 34, 70, 66, "Paramedic Assessment"),
  allied("Paramedic", "glasgow-coma-scale", "What Is The Glasgow Coma Scale?", "GCS", "definition", 9700, 45, 93, 68, "Neurologic Assessment"),
  allied("OT", "what-is-adl-assessment", "What Is An ADL Assessment?", "ADL Assessment", "definition", 3600, 33, 68, 65, "OT Assessment"),
  allied("OT", "what-does-ot-do", "What Does An Occupational Therapist Do?", "Occupational Therapy", "career", 10500, 49, 91, 72, "OT Careers"),
  allied("PT", "what-is-gait-assessment", "What Is A Gait Assessment?", "Gait Assessment", "definition", 4100, 36, 72, 66, "PT Assessment"),
  allied("PT", "what-does-physiotherapist-do", "What Does A Physiotherapist Do?", "Physiotherapy", "career", 9800, 48, 90, 70, "PT Careers"),
  allied("MLT", "what-is-cbc-interpretation", "What Is CBC Interpretation?", "CBC", "interpretation", 5800, 42, 80, 68, "MLT Labs"),
  allied("MLT", "what-does-mlt-do", "What Does An MLT Do?", "Medical Laboratory Technology", "career", 7200, 44, 82, 71, "MLT Careers"),
] as const;

export const FAQ_HUB_SEEDS: readonly FaqHub[] = [
  hub("Heart Failure FAQ", "Heart Failure", "RN", ["what-is-heart-failure", "what-is-bnp"]),
  hub("NCLEX FAQ", "NCLEX", "RN", ["what-is-nclex-cat", "how-long-study-nclex", "what-is-bowtie-question"]),
  hub("CNPLE FAQ", "CNPLE", "NP", ["what-is-cnple"]),
  hub("RT FAQ", "Respiratory Therapy", "RT", ["what-is-an-abg", "how-do-ventilators-work", "what-is-peep", "what-is-cpap"]),
  hub("Paramedic FAQ", "Paramedicine", "Paramedic", ["what-is-primary-survey", "what-is-secondary-survey", "glasgow-coma-scale"]),
  hub("TEAS FAQ", "TEAS", "Pre-Nursing", ["score-needed-teas", "pass-teas-without-chemistry", "hesi-harder-than-teas"]),
  hub("HESI FAQ", "HESI", "Admissions", ["how-long-study-hesi", "hesi-harder-than-teas"]),
] as const;

export function buildSearchIntentAnswerContract(question: SearchIntentQuestion): SearchIntentAnswerContract {
  return {
    questionId: question.id,
    requiredBlocks: requiredAnswerBlocks,
    relatedResources: requiredRelatedResources,
    conversionFeatures: conversionFeaturesFor(question),
    accountCreationCta: "Create a free account to save this answer and build a study plan.",
    trialCta: "Try related practice questions, flashcards, and study resources.",
    subscriptionCta: "Unlock full practice, simulations, readiness tracking, and adaptive remediation.",
    aiOverviewGuidance: [
      "Place a direct one-paragraph answer near the top of the page.",
      "Use precise headings that repeat the natural-language question.",
      "Include concise definitions, comparison tables, and step-by-step blocks where relevant.",
      "Connect claims to reviewed clinical or exam-prep references before publication.",
    ],
  };
}

export function scoreSearchIntentOpportunity(question: SearchIntentQuestion): number {
  const raw = question.trafficOpportunity * 0.4 + question.conversionOpportunity * 0.35 + Math.min(100, question.searchVolume / 120) * 0.15 + (100 - question.difficulty) * 0.1;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function buildSearchIntentDashboard(questions: readonly SearchIntentQuestion[] = SEARCH_INTENT_QUESTION_SEEDS): SearchIntentDashboard {
  const questionsByProfession: Record<string, number> = {};
  const questionsByIntent = Object.fromEntries(
    ["definition", "interpretation", "comparison", "study_strategy", "exam_format", "clinical_priority", "career", "scope", "procedure"].map((intent) => [intent, 0]),
  ) as Record<LearnerSearchIntent, number>;

  for (const question of questions) {
    questionsByProfession[question.profession] = (questionsByProfession[question.profession] ?? 0) + 1;
    questionsByIntent[question.searchIntent] += 1;
  }

  return {
    totalQuestions: questions.length,
    publishedAnswers: questions.filter((question) => question.answerStatus === "published").length,
    draftBacklog: questions.filter((question) => question.answerStatus === "not_started" || question.answerStatus === "outlined" || question.answerStatus === "drafted").length,
    reviewBacklog: questions.filter((question) => question.answerStatus === "review_needed").length,
    refreshBacklog: questions.filter((question) => question.answerStatus === "refresh_needed").length,
    questionsByProfession,
    questionsByIntent,
    topTrafficOpportunities: [...questions].sort((a, b) => b.trafficOpportunity - a.trafficOpportunity).slice(0, 10),
    topConversionOpportunities: [...questions].sort((a, b) => b.conversionOpportunity - a.conversionOpportunity).slice(0, 10),
    faqHubs: FAQ_HUB_SEEDS,
    yearOneTarget: 10000,
    remainingToYearOneTarget: Math.max(0, 10000 - questions.length),
  };
}

export function buildFaqHubQuestions(hubItem: FaqHub, questions: readonly SearchIntentQuestion[] = SEARCH_INTENT_QUESTION_SEEDS): readonly SearchIntentQuestion[] {
  const byId = new Map(questions.map((question) => [question.id, question]));
  return hubItem.questionIds.map((questionId) => byId.get(questionId)).filter((question): question is SearchIntentQuestion => Boolean(question));
}

export function validateSearchIntentAnswerContract(contract: SearchIntentAnswerContract): readonly string[] {
  const issues: string[] = [];
  for (const block of requiredAnswerBlocks) {
    if (!contract.requiredBlocks.includes(block)) issues.push(`Missing ${block} block.`);
  }
  for (const resource of requiredRelatedResources) {
    if (!contract.relatedResources.includes(resource)) issues.push(`Missing ${resource} internal link group.`);
  }
  if (contract.conversionFeatures.length < 3) issues.push("At least three conversion feature previews are required.");
  if (!contract.accountCreationCta) issues.push("Account creation CTA is required.");
  if (!contract.trialCta) issues.push("Trial CTA is required.");
  if (!contract.subscriptionCta) issues.push("Subscription CTA is required.");
  if (contract.aiOverviewGuidance.length < 3) issues.push("AI overview optimization guidance is incomplete.");
  return issues;
}

function conversionFeaturesFor(question: SearchIntentQuestion): readonly ConversionFeature[] {
  if (question.searchIntent === "study_strategy" || question.searchIntent === "exam_format") return ["Lessons", "Questions", "Flashcards", "Study Plans", "Readiness"];
  if (question.cluster.includes("Ventilator") || question.cluster.includes("ABG")) return ["Lessons", "Questions", "Labs", "Simulations", "Clinical Skills"];
  if (question.searchIntent === "career") return ["Lessons", "Study Plans", "Notebook", "Readiness"];
  if (question.searchIntent === "procedure") return ["Lessons", "Clinical Skills", "Simulations", "Questions"];
  return ["Lessons", "Questions", "Flashcards", "Simulations", "Care Plans"];
}

function nursing(id: string, question: string, topic: string, searchIntent: LearnerSearchIntent, searchVolume: number, difficulty: number, trafficOpportunity: number, conversionOpportunity: number, cluster: string): SearchIntentQuestion {
  return seed("RN", id, question, topic, searchIntent, searchVolume, difficulty, trafficOpportunity, conversionOpportunity, cluster);
}

function np(id: string, question: string, topic: string, searchIntent: LearnerSearchIntent, searchVolume: number, difficulty: number, trafficOpportunity: number, conversionOpportunity: number, cluster: string): SearchIntentQuestion {
  return seed("NP", id, question, topic, searchIntent, searchVolume, difficulty, trafficOpportunity, conversionOpportunity, cluster);
}

function preNursing(id: string, question: string, topic: string, searchIntent: LearnerSearchIntent, searchVolume: number, difficulty: number, trafficOpportunity: number, conversionOpportunity: number, cluster: string): SearchIntentQuestion {
  return seed("Pre-Nursing", id, question, topic, searchIntent, searchVolume, difficulty, trafficOpportunity, conversionOpportunity, cluster);
}

function allied(profession: ConversionProfession, id: string, question: string, topic: string, searchIntent: LearnerSearchIntent, searchVolume: number, difficulty: number, trafficOpportunity: number, conversionOpportunity: number, cluster: string): SearchIntentQuestion {
  return seed(profession, id, question, topic, searchIntent, searchVolume, difficulty, trafficOpportunity, conversionOpportunity, cluster);
}

function multi(id: string, question: string, topic: string, searchIntent: LearnerSearchIntent, searchVolume: number, difficulty: number, trafficOpportunity: number, conversionOpportunity: number, cluster: string): SearchIntentQuestion {
  return seed("Multiple", id, question, topic, searchIntent, searchVolume, difficulty, trafficOpportunity, conversionOpportunity, cluster);
}

function seed(
  profession: SearchIntentQuestion["profession"],
  id: string,
  question: string,
  topic: string,
  searchIntent: LearnerSearchIntent,
  searchVolume: number,
  difficulty: number,
  trafficOpportunity: number,
  conversionOpportunity: number,
  cluster: string,
): SearchIntentQuestion {
  return {
    id,
    question,
    profession,
    topic,
    searchIntent,
    searchVolume,
    difficulty,
    trafficOpportunity,
    conversionOpportunity,
    cluster,
    answerStatus: "not_started",
    visibilityTargets: ["google_search", "ai_overview", "featured_snippet", "people_also_ask", "voice_search", "long_tail"],
  };
}

function hub(title: string, cluster: string, profession: FaqHub["profession"], questionIds: readonly string[]): FaqHub {
  return {
    title,
    cluster,
    profession,
    questionIds,
    canonicalPath: `/faq/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  };
}
