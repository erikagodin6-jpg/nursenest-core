import type { FoundationAssessmentMode } from "@/lib/health-sciences-foundations/health-sciences-foundations-academy";

export type AdmissionsAcademyProgramId = "hesi-a2-academy" | "ati-teas-academy";

export type AdmissionsAcademyDomainId =
  | "hesi-a2-anatomy-physiology"
  | "hesi-a2-biology"
  | "hesi-a2-chemistry"
  | "hesi-a2-math"
  | "hesi-a2-grammar"
  | "hesi-a2-vocabulary"
  | "hesi-a2-reading-comprehension"
  | "hesi-a2-critical-thinking"
  | "ati-teas-reading"
  | "ati-teas-math"
  | "ati-teas-science"
  | "ati-teas-english-language-usage";

export type AdmissionsProgramFeature =
  | "diagnostic_baseline"
  | "timed_section_drills"
  | "full_length_simulation"
  | "adaptive_remediation"
  | "readiness_score"
  | "study_calendar"
  | "flashcard_decks"
  | "rationale_review"
  | "weak_area_routing";

export type AdmissionsAcademyLessonBlueprint = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  foundationCompetencyIds: string[];
  assessmentModes: FoundationAssessmentMode[];
  premiumReady: boolean;
};

export type AdmissionsAcademyDomain = {
  id: AdmissionsAcademyDomainId;
  title: string;
  examWeightingNote: string;
  foundationCompetencyIds: string[];
  lessons: AdmissionsAcademyLessonBlueprint[];
  diagnosticBlueprint: string[];
  remediationRules: string[];
};

export type AdmissionsAcademyProgram = {
  id: AdmissionsAcademyProgramId;
  title: string;
  positioning: string;
  route: string;
  freeFunnel: string[];
  premiumFeatures: AdmissionsProgramFeature[];
  domains: AdmissionsAcademyDomain[];
  launchRequirements: string[];
};

const CORE_PREMIUM_FEATURES: AdmissionsProgramFeature[] = [
  "diagnostic_baseline",
  "timed_section_drills",
  "full_length_simulation",
  "adaptive_remediation",
  "readiness_score",
  "study_calendar",
  "flashcard_decks",
  "rationale_review",
  "weak_area_routing",
];

function lesson(
  id: string,
  title: string,
  summary: string,
  foundationCompetencyIds: string[],
  estimatedMinutes = 30,
  assessmentModes: FoundationAssessmentMode[] = ["lesson_checkpoint", "mini_quiz", "flashcards", "timed_drill"],
  premiumReady = true,
): AdmissionsAcademyLessonBlueprint {
  return { id, title, summary, foundationCompetencyIds, estimatedMinutes, assessmentModes, premiumReady };
}

function domain(
  id: AdmissionsAcademyDomainId,
  title: string,
  examWeightingNote: string,
  foundationCompetencyIds: string[],
  lessons: AdmissionsAcademyLessonBlueprint[],
  diagnosticBlueprint: string[],
  remediationRules: string[],
): AdmissionsAcademyDomain {
  return { id, title, examWeightingNote, foundationCompetencyIds, lessons, diagnosticBlueprint, remediationRules };
}

export const HESI_A2_ACADEMY: AdmissionsAcademyProgram = {
  id: "hesi-a2-academy",
  title: "HESI A2 Admissions Academy",
  positioning:
    "A complete nursing-school admissions program that teaches science, math, reading, language, vocabulary, and critical-thinking from foundations through timed readiness.",
  route: "/us/allied/hesi-a2",
  freeFunnel: [
    "HESI A2 exam overview and section guide",
    "starter diagnostic by domain",
    "selected foundation lessons",
    "limited flashcard deck",
    "sample timed mini drill",
  ],
  premiumFeatures: CORE_PREMIUM_FEATURES,
  launchRequirements: [
    "public trademark/compliance copy review",
    "server-side entitlement gate for full simulations and analytics",
    "minimum diagnostic coverage for every HESI A2 domain",
    "noindex remains enabled until product launch approval",
    "mobile Ocean/Blossom/Midnight/Sunset/Aurora QA pass",
  ],
  domains: [
    domain(
      "hesi-a2-anatomy-physiology",
      "Anatomy & Physiology",
      "High-yield domain for many nursing programs; school-specific weighting varies.",
      ["foundations.cardio.blood-flow", "foundations.resp.gas-exchange", "foundations.renal.fluid-electrolyte", "foundations.neuro.ans", "foundations.phys.homeostasis"],
      [
        lesson("hesi-a2-ap-homeostasis", "Homeostasis and Body-System Regulation", "Teach feedback loops, compensation, and system regulation before learners attempt A&P application questions.", ["foundations.phys.homeostasis"]),
        lesson("hesi-a2-ap-cardiorespiratory", "Cardiovascular and Respiratory A&P", "Connect blood flow, cardiac output, ventilation, oxygenation, and gas exchange for HESI-style science questions.", ["foundations.cardio.blood-flow", "foundations.resp.gas-exchange"], 40),
        lesson("hesi-a2-ap-renal-neuro-endocrine", "Renal, Neuro, and Endocrine Essentials", "Cover nephron function, fluid/electrolyte regulation, autonomic physiology, hormones, and stress response.", ["foundations.renal.fluid-electrolyte", "foundations.neuro.ans", "foundations.phys.homeostasis"], 40),
      ],
      ["body-system recall", "mechanism explanation", "applied scenario", "common distractor differentiation"],
      ["Route missed physiology mechanism questions to Foundations Semester 1 physiology.", "Route missed system questions to the matching body-system module before retesting."],
    ),
    domain(
      "hesi-a2-biology",
      "Biology",
      "Foundation science domain covering cells, genetics, organisms, and core life processes.",
      ["foundations.cell.mem transport", "foundations.phys.homeostasis"],
      [
        lesson("hesi-a2-bio-cell-structure", "Cell Structure, Organelles, and Function", "Build a clear mental model of cell parts, organelle jobs, and health-science relevance.", ["foundations.cell.mem transport"]),
        lesson("hesi-a2-bio-transport-division", "Cell Transport, ATP, Mitosis, and Meiosis", "Teach membrane transport, energy, and cell division with exam traps and visual patterns.", ["foundations.cell.mem transport"], 35),
      ],
      ["cell vocabulary", "process sequencing", "science passage application"],
      ["Send transport misses to membrane transport lesson; send division misses to ATP/mitosis/meiosis remediation."],
    ),
    domain(
      "hesi-a2-chemistry",
      "Chemistry",
      "Atoms, ions, bonding, pH, acids/bases, electrolytes, and solutions.",
      ["foundations.chem.ph-electrolytes"],
      [
        lesson("hesi-a2-chem-atoms-ions", "Atoms, Ions, Bonds, and Molecules", "Teach chemistry vocabulary and charge logic for learners who have not taken recent chemistry.", ["foundations.chem.ph-electrolytes"]),
        lesson("hesi-a2-chem-ph-solutions", "pH, Acids, Bases, Electrolytes, and Solutions", "Connect HESI chemistry to patient-relevant pH, electrolyte, and solution reasoning.", ["foundations.chem.ph-electrolytes"], 40),
      ],
      ["definition recall", "charge/bond logic", "pH interpretation", "solution calculation readiness"],
      ["Route pH/electrolyte errors to Foundations chemistry before timed chemistry drills."],
    ),
    domain(
      "hesi-a2-math",
      "Math",
      "Arithmetic, ratios, proportions, conversions, dosage-math foundations, and word problems.",
      ["foundations.pharm.med-safety"],
      [
        lesson("hesi-a2-math-ratios-conversions", "Ratios, Proportions, and Unit Conversions", "Build dimensional-analysis habits for admissions math and future medication calculations.", ["foundations.pharm.med-safety"], 40),
        lesson("hesi-a2-math-word-problems", "Word Problems and Reasonableness Checks", "Teach learners to translate text into operations and catch impossible answer choices.", ["foundations.pharm.med-safety"], 35),
      ],
      ["calculation accuracy", "conversion accuracy", "word-problem setup", "timed fluency"],
      ["Route conversion misses to dosage calculation foundations; route timing misses to short timed drills."],
    ),
    domain(
      "hesi-a2-grammar",
      "Grammar",
      "Sentence structure, punctuation, agreement, pronouns, modifiers, and clarity.",
      ["foundations.communication.sbar-documentation"],
      [
        lesson("hesi-a2-grammar-sentence-structure", "Sentence Structure and Agreement", "Teach grammar patterns that improve both HESI performance and clinical documentation clarity.", ["foundations.communication.sbar-documentation"]),
        lesson("hesi-a2-grammar-punctuation-clarity", "Punctuation, Modifiers, and Clear Meaning", "Target common distractors involving commas, misplaced modifiers, pronouns, and ambiguous wording.", ["foundations.communication.sbar-documentation"]),
      ],
      ["grammar rule recognition", "sentence correction", "meaning preservation"],
      ["Route documentation-clarity misses to SBAR/objective documentation support."],
    ),
    domain(
      "hesi-a2-vocabulary",
      "Vocabulary",
      "Healthcare vocabulary, word parts, context clues, and academic language.",
      ["foundations.medterm.word-parts"],
      [
        lesson("hesi-a2-vocab-word-parts", "Medical Word Parts and Meaning", "Use prefixes, suffixes, roots, and combining forms to decode unfamiliar terms.", ["foundations.medterm.word-parts"]),
        lesson("hesi-a2-vocab-context-clues", "Context Clues and Academic Vocabulary", "Teach learners to infer meaning from sentence structure and clinical context.", ["foundations.medterm.word-parts", "foundations.communication.sbar-documentation"]),
      ],
      ["word-part decoding", "context inference", "healthcare vocabulary"],
      ["Route word-part misses to medical terminology; route context misses to reading comprehension drills."],
    ),
    domain(
      "hesi-a2-reading-comprehension",
      "Reading Comprehension",
      "Main idea, supporting detail, inference, author purpose, tone, and passage navigation.",
      ["foundations.communication.sbar-documentation"],
      [
        lesson("hesi-a2-reading-main-idea", "Main Idea and Supporting Evidence", "Teach passage mapping, evidence selection, and distractor elimination.", ["foundations.communication.sbar-documentation"]),
        lesson("hesi-a2-reading-inference-purpose", "Inference, Purpose, and Tone", "Build higher-order reading skills needed for health-science admissions passages.", ["foundations.communication.sbar-documentation"], 35),
      ],
      ["main idea", "detail retrieval", "inference", "purpose/tone"],
      ["Route evidence-selection misses to main idea drills; route inference misses to short passage practice."],
    ),
    domain(
      "hesi-a2-critical-thinking",
      "Critical Thinking",
      "Prioritization, safety logic, cause/effect, and basic clinical judgement for admissions-level scenarios.",
      ["foundations.phys.homeostasis", "foundations.communication.sbar-documentation", "foundations.infection.transmission"],
      [
        lesson("hesi-a2-critical-safety-prioritization", "Safety and Prioritization Logic", "Introduce ABCs, risk recognition, escalation language, infection safety, and patient-centered thinking.", ["foundations.phys.homeostasis", "foundations.infection.transmission", "foundations.communication.sbar-documentation"], 40, ["lesson_checkpoint", "mini_quiz", "case_prompt", "simulation_ready"]),
      ],
      ["safety-first choices", "cause/effect", "scenario reasoning", "distractor elimination"],
      ["Route safety misses to infection-control or communication foundations depending on error pattern."],
    ),
  ],
};

export const ATI_TEAS_ACADEMY: AdmissionsAcademyProgram = {
  id: "ati-teas-academy",
  title: "ATI TEAS Admissions Academy",
  positioning:
    "A complete TEAS preparation program for reading, math, science, and English/language usage, built on the Health Sciences Foundations competency spine.",
  route: "/us/allied/ati-teas",
  freeFunnel: [
    "TEAS overview and four-domain breakdown",
    "short diagnostic by domain",
    "selected science and math bridge lessons",
    "limited vocabulary and grammar flashcards",
    "sample timed section drill",
  ],
  premiumFeatures: CORE_PREMIUM_FEATURES,
  launchRequirements: [
    "public trademark/compliance copy review",
    "minimum diagnostic coverage for every TEAS domain",
    "server-side entitlement gate for simulations, analytics, and readiness scoring",
    "noindex remains enabled until launch approval",
    "mobile and theme QA pass across all supported marketing themes",
  ],
  domains: [
    domain(
      "ati-teas-reading",
      "Reading",
      "TEAS reading emphasizes key ideas, details, craft/structure, and integration of knowledge.",
      ["foundations.communication.sbar-documentation"],
      [
        lesson("teas-reading-key-ideas", "Key Ideas, Details, and Evidence", "Teach learners to identify main ideas, supporting details, and evidence in timed passages.", ["foundations.communication.sbar-documentation"]),
        lesson("teas-reading-inference-structure", "Inference, Structure, and Author Purpose", "Build passage-structure mapping and author-intent reasoning for TEAS reading questions.", ["foundations.communication.sbar-documentation"], 35),
      ],
      ["main idea", "detail", "inference", "structure", "source integration"],
      ["Route evidence misses to key-ideas drills; route inference misses to structure and purpose remediation."],
    ),
    domain(
      "ati-teas-math",
      "Math",
      "TEAS math focuses on numbers, algebra, measurement, data, ratios, and word-problem fluency.",
      ["foundations.pharm.med-safety"],
      [
        lesson("teas-math-numbers-algebra", "Numbers, Algebra, and Word Problems", "Build arithmetic fluency, algebra setup, ratio thinking, and answer reasonableness.", ["foundations.pharm.med-safety"], 40),
        lesson("teas-math-measurement-data", "Measurement, Conversions, and Data", "Teach unit conversions, graph/table interpretation, central tendency, and applied measurement.", ["foundations.pharm.med-safety"], 40),
      ],
      ["arithmetic", "algebra", "measurement", "data interpretation", "timed accuracy"],
      ["Route conversion misses to dosage calculation foundations; route data misses to measurement/data drills."],
    ),
    domain(
      "ati-teas-science",
      "Science",
      "TEAS science integrates A&P, biology, chemistry, scientific reasoning, and physical science foundations.",
      ["foundations.cell.mem transport", "foundations.chem.ph-electrolytes", "foundations.phys.homeostasis", "foundations.cardio.blood-flow", "foundations.resp.gas-exchange", "foundations.renal.fluid-electrolyte", "foundations.neuro.ans"],
      [
        lesson("teas-science-cell-chem", "Cell Biology and Chemistry for TEAS", "Connect cells, membranes, atoms, ions, bonds, pH, and electrolytes to TEAS-style science questions.", ["foundations.cell.mem transport", "foundations.chem.ph-electrolytes"], 45),
        lesson("teas-science-ap-systems", "A&P Body Systems for TEAS", "Teach cardiovascular, respiratory, renal, neuro, endocrine, and immune concepts using foundation competencies.", ["foundations.cardio.blood-flow", "foundations.resp.gas-exchange", "foundations.renal.fluid-electrolyte", "foundations.neuro.ans", "foundations.phys.homeostasis"], 50),
        lesson("teas-science-scientific-reasoning", "Scientific Reasoning and Experimental Design", "Build skills for variables, controls, data interpretation, and evidence-based conclusions.", ["foundations.phys.homeostasis", "foundations.communication.sbar-documentation"], 35),
      ],
      ["A&P systems", "biology", "chemistry", "scientific reasoning", "data interpretation"],
      ["Route science misses to the matching foundation system before the next timed drill."],
    ),
    domain(
      "ati-teas-english-language-usage",
      "English & Language Usage",
      "Grammar, conventions, vocabulary, sentence structure, and writing clarity.",
      ["foundations.medterm.word-parts", "foundations.communication.sbar-documentation"],
      [
        lesson("teas-english-grammar-conventions", "Grammar, Conventions, and Sentence Clarity", "Teach punctuation, agreement, pronouns, modifiers, sentence type, and concise meaning.", ["foundations.communication.sbar-documentation"]),
        lesson("teas-english-vocabulary-context", "Vocabulary, Word Meaning, and Context", "Use word parts, context clues, and academic vocabulary strategies for TEAS language items.", ["foundations.medterm.word-parts", "foundations.communication.sbar-documentation"]),
      ],
      ["grammar", "punctuation", "sentence correction", "vocabulary", "context clues"],
      ["Route grammar misses to conventions drills; route vocabulary misses to medical terminology/context-clue work."],
    ),
  ],
};

export const ADMISSIONS_ACADEMY_PROGRAMS: AdmissionsAcademyProgram[] = [HESI_A2_ACADEMY, ATI_TEAS_ACADEMY];

export function getAdmissionsAcademyProgram(id: AdmissionsAcademyProgramId): AdmissionsAcademyProgram {
  const program = ADMISSIONS_ACADEMY_PROGRAMS.find((candidate) => candidate.id === id);
  if (!program) throw new Error(`Unknown admissions academy program: ${id}`);
  return program;
}

export function flattenAdmissionsAcademyLessons(programs: AdmissionsAcademyProgram[] = ADMISSIONS_ACADEMY_PROGRAMS): AdmissionsAcademyLessonBlueprint[] {
  return programs.flatMap((program) => program.domains.flatMap((programDomain) => programDomain.lessons));
}

export function validateAdmissionsAcademyPrograms(
  programs: AdmissionsAcademyProgram[] = ADMISSIONS_ACADEMY_PROGRAMS,
): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const programIds = new Set<string>();
  const domainIds = new Set<string>();
  const lessonIds = new Set<string>();

  for (const program of programs) {
    if (programIds.has(program.id)) errors.push(`Duplicate program id: ${program.id}`);
    programIds.add(program.id);

    if (!program.route.startsWith("/us/allied/")) errors.push(`${program.id} must use admissions pathway routing`);
    if (program.freeFunnel.length < 4) errors.push(`${program.id} needs a real free funnel`);
    if (program.premiumFeatures.length < 8) errors.push(`${program.id} needs complete premium feature coverage`);
    if (program.domains.length < 4) errors.push(`${program.id} cannot launch as a thin program`);

    for (const programDomain of program.domains) {
      if (domainIds.has(programDomain.id)) errors.push(`Duplicate domain id: ${programDomain.id}`);
      domainIds.add(programDomain.id);
      if (programDomain.lessons.length < 1) errors.push(`${programDomain.id} needs at least one lesson blueprint`);
      if (programDomain.foundationCompetencyIds.length < 1) errors.push(`${programDomain.id} needs foundation competency mapping`);
      if (programDomain.diagnosticBlueprint.length < 3) errors.push(`${programDomain.id} needs a diagnostic blueprint`);
      if (programDomain.remediationRules.length < 1) errors.push(`${programDomain.id} needs remediation rules`);

      for (const lessonItem of programDomain.lessons) {
        if (lessonIds.has(lessonItem.id)) errors.push(`Duplicate lesson id: ${lessonItem.id}`);
        lessonIds.add(lessonItem.id);
        if (lessonItem.summary.length < 50) errors.push(`${lessonItem.id} needs a meaningful summary`);
        if (lessonItem.estimatedMinutes < 25) errors.push(`${lessonItem.id} is too thin`);
        if (lessonItem.foundationCompetencyIds.length < 1) errors.push(`${lessonItem.id} needs foundation competency linkage`);
        if (!lessonItem.assessmentModes.includes("mini_quiz")) errors.push(`${lessonItem.id} needs a mini quiz`);
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
