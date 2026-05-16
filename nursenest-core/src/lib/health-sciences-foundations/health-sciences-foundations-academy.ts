// Health Sciences Foundations Academy
// Canonical academic spine for HESI A2, ATI TEAS, nursing, allied health, ECG, RT, and critical-care pathways.
// This file is intentionally data-first and route-agnostic: launch surfaces should consume it only after product/design gates.

export type FoundationAcademyId = "health-sciences-foundations";

export type FoundationAudience =
  | "pre_nursing"
  | "rn"
  | "rpn_pn"
  | "np"
  | "respiratory_therapy"
  | "paramedic_emt"
  | "cna_psw"
  | "critical_care"
  | "ecg";

export type FoundationAssessmentMode =
  | "lesson_checkpoint"
  | "flashcards"
  | "mini_quiz"
  | "timed_drill"
  | "case_prompt"
  | "simulation_ready";

export type FoundationLesson = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  competencyIds: string[];
  assessmentModes: FoundationAssessmentMode[];
  requiredLessonSections: readonly string[];
};

export type FoundationModule = {
  id: string;
  title: string;
  summary: string;
  lessons: FoundationLesson[];
};

export type FoundationUnit = {
  id: string;
  title: string;
  summary: string;
  modules: FoundationModule[];
};

export type FoundationSemester = {
  id: string;
  title: string;
  summary: string;
  units: FoundationUnit[];
};

export type FoundationCompetency = {
  id: string;
  title: string;
  description: string;
  masteryThreshold: number;
  appliesTo: FoundationAudience[];
  remediationRoute: string;
};

export type FoundationAcademy = {
  id: FoundationAcademyId;
  title: string;
  positioning: string;
  targetAudiences: FoundationAudience[];
  requiredLessonSections: readonly string[];
  semesters: FoundationSemester[];
  competencies: FoundationCompetency[];
  downstreamPrograms: readonly string[];
};

export const FOUNDATION_REQUIRED_LESSON_SECTIONS = [
  "overview",
  "learningObjectives",
  "deepTeaching",
  "clinicalRelevance",
  "memoryAids",
  "commonMistakes",
  "examTraps",
  "practiceQuestions",
  "flashcards",
  "miniAssessment",
  "remediation",
] as const;

function lesson(
  id: string,
  title: string,
  summary: string,
  competencyIds: string[],
  estimatedMinutes = 25,
  assessmentModes: FoundationAssessmentMode[] = ["lesson_checkpoint", "mini_quiz", "flashcards"],
): FoundationLesson {
  return {
    id,
    title,
    summary,
    estimatedMinutes,
    competencyIds,
    assessmentModes,
    requiredLessonSections: FOUNDATION_REQUIRED_LESSON_SECTIONS,
  };
}

function competency(
  id: string,
  title: string,
  description: string,
  appliesTo: FoundationAudience[],
  remediationRoute: string,
  masteryThreshold = 85,
): FoundationCompetency {
  return { id, title, description, masteryThreshold, appliesTo, remediationRoute };
}

export const HEALTH_SCIENCES_FOUNDATION_COMPETENCIES: FoundationCompetency[] = [
  competency(
    "foundations.medterm.word-parts",
    "Decode medical word parts",
    "Break medical terms into prefixes, suffixes, roots, combining forms, and directional language.",
    ["pre_nursing", "rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "cna_psw"],
    "/app/lessons?competency=foundations.medterm.word-parts",
  ),
  competency(
    "foundations.cell.mem transport",
    "Explain cell membranes and transport",
    "Differentiate diffusion, osmosis, facilitated transport, active transport, and membrane gradients.",
    ["pre_nursing", "rn", "rpn_pn", "respiratory_therapy", "paramedic_emt"],
    "/app/lessons?competency=foundations.cell.mem%20transport",
  ),
  competency(
    "foundations.chem.ph-electrolytes",
    "Interpret pH and electrolytes",
    "Connect acids, bases, ions, electrolytes, and solutions to physiologic stability.",
    ["pre_nursing", "rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "critical_care"],
    "/app/lessons?competency=foundations.chem.ph-electrolytes",
  ),
  competency(
    "foundations.phys.homeostasis",
    "Apply homeostasis and feedback loops",
    "Use negative and positive feedback concepts to explain physiologic compensation and decompensation.",
    ["pre_nursing", "rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "critical_care"],
    "/app/lessons?competency=foundations.phys.homeostasis",
  ),
  competency(
    "foundations.cardio.blood-flow",
    "Trace blood flow and cardiac output",
    "Trace normal blood flow through the heart and connect preload, afterload, stroke volume, and cardiac output.",
    ["pre_nursing", "rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "critical_care", "ecg"],
    "/app/lessons?competency=foundations.cardio.blood-flow",
  ),
  competency(
    "foundations.resp.gas-exchange",
    "Explain ventilation and gas exchange",
    "Differentiate oxygenation, ventilation, diffusion, perfusion, and carbon dioxide clearance.",
    ["pre_nursing", "rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "critical_care"],
    "/app/lessons?competency=foundations.resp.gas-exchange",
  ),
  competency(
    "foundations.renal.fluid-electrolyte",
    "Relate renal function to fluid and electrolytes",
    "Explain filtration, reabsorption, secretion, urine concentration, and electrolyte regulation.",
    ["pre_nursing", "rn", "rpn_pn", "np", "respiratory_therapy", "critical_care"],
    "/app/lessons?competency=foundations.renal.fluid-electrolyte",
  ),
  competency(
    "foundations.neuro.ans",
    "Differentiate sympathetic and parasympathetic responses",
    "Use autonomic physiology to explain heart rate, vascular tone, bronchodilation, stress responses, and medication effects.",
    ["pre_nursing", "rn", "rpn_pn", "np", "paramedic_emt", "critical_care", "ecg"],
    "/app/lessons?competency=foundations.neuro.ans",
  ),
  competency(
    "foundations.infection.transmission",
    "Apply infection-control transmission principles",
    "Select standard, contact, droplet, and airborne precautions using route-of-transmission logic.",
    ["rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "cna_psw"],
    "/app/lessons?competency=foundations.infection.transmission",
  ),
  competency(
    "foundations.pharm.med-safety",
    "Use foundational medication safety logic",
    "Connect pharmacokinetics, pharmacodynamics, dosage math, high-alert medications, and safety checks.",
    ["rn", "rpn_pn", "np", "paramedic_emt", "critical_care"],
    "/app/lessons?competency=foundations.pharm.med-safety",
  ),
  competency(
    "foundations.communication.sbar-documentation",
    "Communicate and document safely",
    "Use SBAR, objective charting, escalation language, confidentiality, and patient-advocacy principles.",
    ["rn", "rpn_pn", "np", "respiratory_therapy", "paramedic_emt", "cna_psw"],
    "/app/lessons?competency=foundations.communication.sbar-documentation",
  ),
];

export const HEALTH_SCIENCES_FOUNDATIONS_ACADEMY: FoundationAcademy = {
  id: "health-sciences-foundations",
  title: "Health Sciences Foundations Academy",
  positioning:
    "A university-style prerequisite curriculum that powers HESI A2, ATI TEAS, nursing, allied health, ECG, RT, paramedic, CNA/PSW, and critical-care learning paths.",
  targetAudiences: [
    "pre_nursing",
    "rn",
    "rpn_pn",
    "np",
    "respiratory_therapy",
    "paramedic_emt",
    "cna_psw",
    "critical_care",
    "ecg",
  ],
  requiredLessonSections: FOUNDATION_REQUIRED_LESSON_SECTIONS,
  competencies: HEALTH_SCIENCES_FOUNDATION_COMPETENCIES,
  downstreamPrograms: [
    "HESI A2 Admissions Prep",
    "ATI TEAS Admissions Prep",
    "Nursing School Academy",
    "NCLEX / REx-PN / CNPLE remediation",
    "ECG Institute",
    "Respiratory Therapy Academy",
    "Paramedic / EMT Academy",
    "CNA / PSW Academy",
    "Critical Care Institute",
  ] as const,
  semesters: [
    {
      id: "semester-1-human-biology-foundations",
      title: "Semester 1 — Human Biology Foundations",
      summary: "Medical terminology, cell biology, chemistry, and physiologic principles for learners starting from zero.",
      units: [
        {
          id: "unit-medical-terminology",
          title: "Medical Terminology",
          summary: "Language patterns used across nursing, allied health, admissions exams, and clinical documentation.",
          modules: [
            {
              id: "module-medical-word-parts",
              title: "Word Parts and Clinical Language",
              summary: "Build medical words from roots, prefixes, suffixes, combining vowels, and directional language.",
              lessons: [
                lesson("lesson-prefixes-suffixes-roots", "Prefixes, Suffixes, and Root Words", "Decode common medical terms by breaking them into predictable parts.", ["foundations.medterm.word-parts"]),
                lesson("lesson-directional-planes", "Directional Terms and Body Planes", "Use anatomic position, planes, quadrants, and directional terms accurately.", ["foundations.medterm.word-parts"]),
                lesson("lesson-abbreviations-safety", "Abbreviations and Documentation Safety", "Recognize safe and unsafe abbreviation use in healthcare documentation.", ["foundations.medterm.word-parts", "foundations.communication.sbar-documentation"]),
              ],
            },
          ],
        },
        {
          id: "unit-cell-chemistry-physiology",
          title: "Cell Biology, Chemistry, and Physiology",
          summary: "The science base needed for TEAS/HESI, pharmacology, ABGs, ECG, shock, and clinical reasoning.",
          modules: [
            {
              id: "module-cell-biology",
              title: "Cell Biology",
              summary: "Cell structure, organelles, membranes, energy, and reproduction.",
              lessons: [
                lesson("lesson-cell-structure-organelles", "Cell Structure and Organelles", "Connect organelle function to cellular survival and disease patterns.", ["foundations.cell.mem transport"]),
                lesson("lesson-membranes-transport", "Membranes and Transport", "Differentiate diffusion, osmosis, facilitated diffusion, and active transport.", ["foundations.cell.mem transport"]),
                lesson("lesson-atp-mitosis-meiosis", "ATP, Mitosis, and Meiosis", "Explain energy production and cell division at a health-sciences exam level.", ["foundations.cell.mem transport"]),
              ],
            },
            {
              id: "module-chemistry-foundations",
              title: "Chemistry Foundations",
              summary: "Atoms, ions, pH, electrolytes, bonds, solutions, and acid-base logic.",
              lessons: [
                lesson("lesson-atoms-ions-bonds", "Atoms, Ions, and Chemical Bonds", "Explain how charged particles, bonds, and molecules shape physiology.", ["foundations.chem.ph-electrolytes"]),
                lesson("lesson-ph-acids-bases", "pH, Acids, and Bases", "Use pH logic to prepare for TEAS science, ABGs, renal compensation, and shock states.", ["foundations.chem.ph-electrolytes"]),
                lesson("lesson-electrolytes-solutions", "Electrolytes and Solutions", "Connect sodium, potassium, calcium, magnesium, and osmolality to patient safety.", ["foundations.chem.ph-electrolytes"]),
              ],
            },
            {
              id: "module-physiology-principles",
              title: "Human Physiology Principles",
              summary: "Homeostasis, feedback, perfusion, oxygenation, fluid balance, and metabolism.",
              lessons: [
                lesson("lesson-homeostasis-feedback", "Homeostasis and Feedback Loops", "Explain compensation, decompensation, and why abnormal values cluster together.", ["foundations.phys.homeostasis"]),
                lesson("lesson-perfusion-oxygenation", "Perfusion and Oxygenation", "Differentiate delivery of blood from delivery of oxygen and connect both to shock.", ["foundations.phys.homeostasis", "foundations.cardio.blood-flow", "foundations.resp.gas-exchange"]),
                lesson("lesson-fluid-balance-metabolism", "Fluid Balance and Metabolism", "Connect intake, output, intracellular/extracellular fluid, and energy demand.", ["foundations.phys.homeostasis", "foundations.renal.fluid-electrolyte"]),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "semester-2-body-systems",
      title: "Semester 2 — Body Systems",
      summary: "Body-system instruction that becomes the shared base for HESI/TEAS science, nursing school, RT, paramedic, ECG, and critical care.",
      units: [
        {
          id: "unit-cardiorespiratory-renal",
          title: "Cardiorespiratory and Renal Systems",
          summary: "The three systems most reused across ECG, RT, hemodynamics, ABGs, shock, and admissions science.",
          modules: [
            {
              id: "module-cardiovascular-system",
              title: "Cardiovascular System",
              summary: "Heart anatomy, blood flow, conduction, blood pressure, preload, afterload, and shock basics.",
              lessons: [
                lesson("lesson-heart-anatomy-blood-flow", "Heart Anatomy and Blood Flow", "Trace blood through the heart, lungs, and systemic circulation.", ["foundations.cardio.blood-flow"]),
                lesson("lesson-conduction-blood-pressure", "Conduction, Blood Pressure, and Cardiac Output", "Connect electrical conduction to pumping, pressure, and perfusion.", ["foundations.cardio.blood-flow", "foundations.neuro.ans"], 35, ["lesson_checkpoint", "mini_quiz", "flashcards", "case_prompt"]),
                lesson("lesson-shock-basics", "Shock Basics", "Differentiate hypovolemic, cardiogenic, distributive, and obstructive shock at a foundations level.", ["foundations.cardio.blood-flow", "foundations.phys.homeostasis"], 35, ["lesson_checkpoint", "mini_quiz", "case_prompt", "simulation_ready"]),
              ],
            },
            {
              id: "module-respiratory-system",
              title: "Respiratory System",
              summary: "Lung anatomy, gas exchange, ventilation, oxygen transport, and acid-base foundations.",
              lessons: [
                lesson("lesson-lung-anatomy-gas-exchange", "Lung Anatomy and Gas Exchange", "Explain alveoli, diffusion, perfusion, oxygen transport, and carbon dioxide removal.", ["foundations.resp.gas-exchange"]),
                lesson("lesson-oxygenation-ventilation", "Oxygenation vs Ventilation", "Separate oxygen problems from CO2 clearance problems before learners enter RT, ABG, or ICU content.", ["foundations.resp.gas-exchange"], 30, ["lesson_checkpoint", "mini_quiz", "flashcards", "case_prompt"]),
                lesson("lesson-acid-base-basics", "Acid–Base Basics", "Introduce respiratory and metabolic drivers of pH before formal ABG interpretation.", ["foundations.resp.gas-exchange", "foundations.chem.ph-electrolytes"], 35, ["lesson_checkpoint", "mini_quiz", "timed_drill"]),
              ],
            },
            {
              id: "module-renal-system",
              title: "Renal System",
              summary: "Nephron anatomy, filtration, fluid regulation, electrolytes, and acid-base support.",
              lessons: [
                lesson("lesson-nephron-filtration", "Nephron and Filtration", "Explain filtration, reabsorption, secretion, and urine formation.", ["foundations.renal.fluid-electrolyte"]),
                lesson("lesson-renal-electrolytes-fluid", "Renal Fluid and Electrolyte Regulation", "Connect kidney function to sodium, potassium, fluid overload, dehydration, and safety.", ["foundations.renal.fluid-electrolyte", "foundations.chem.ph-electrolytes"]),
              ],
            },
          ],
        },
        {
          id: "unit-neuro-endocrine-immune",
          title: "Neuro, Endocrine, and Immune Systems",
          summary: "Control, stress response, inflammation, and immunity across entry exams and clinical care.",
          modules: [
            {
              id: "module-neuro-endocrine-immune",
              title: "Regulation and Defense",
              summary: "Nervous system, hormones, stress response, inflammation, infection, and immunity.",
              lessons: [
                lesson("lesson-cns-pns-ans", "CNS, PNS, and Autonomic Nervous System", "Differentiate central, peripheral, sympathetic, and parasympathetic responses.", ["foundations.neuro.ans"]),
                lesson("lesson-endocrine-stress-insulin", "Hormones, Insulin, and Stress Response", "Explain endocrine signaling, glucose regulation, and stress physiology.", ["foundations.phys.homeostasis", "foundations.neuro.ans"]),
                lesson("lesson-inflammation-infection-immunity", "Inflammation, Infection, and Immunity", "Differentiate inflammation, infection, innate immunity, adaptive immunity, and immune memory.", ["foundations.infection.transmission", "foundations.phys.homeostasis"]),
              ],
            },
          ],
        },
      ],
    },
    {
      id: "semester-3-healthcare-practice-foundations",
      title: "Semester 3 — Healthcare Practice Foundations",
      summary: "Safety, infection control, medication logic, communication, ethics, documentation, and clinical judgment basics.",
      units: [
        {
          id: "unit-safety-pharm-communication",
          title: "Safety, Pharmacology, and Communication",
          summary: "The shared clinical-practice layer for CNA/PSW, nursing, paramedic, RT, and specialty practice.",
          modules: [
            {
              id: "module-infection-control",
              title: "Infection Control",
              summary: "PPE, isolation, transmission, cleaning, sterilization, and outbreak safety.",
              lessons: [
                lesson("lesson-ppe-isolation-transmission", "PPE, Isolation, and Transmission", "Select precautions based on how pathogens spread.", ["foundations.infection.transmission"], 30, ["lesson_checkpoint", "mini_quiz", "timed_drill"]),
                lesson("lesson-sterilization-environmental-safety", "Sterilization and Environmental Safety", "Differentiate cleaning, disinfection, sterilization, and high-touch safety practices.", ["foundations.infection.transmission"]),
              ],
            },
            {
              id: "module-pharmacology-foundations",
              title: "Pharmacology Foundations",
              summary: "Medication safety, dosage calculations, pharmacokinetics, pharmacodynamics, and high-alert logic.",
              lessons: [
                lesson("lesson-pk-pd-med-safety", "Pharmacokinetics, Pharmacodynamics, and Medication Safety", "Explain absorption, distribution, metabolism, excretion, effects, side effects, and safety checks.", ["foundations.pharm.med-safety"], 35, ["lesson_checkpoint", "mini_quiz", "flashcards", "case_prompt"]),
                lesson("lesson-dosage-calculations-foundations", "Dosage Calculation Foundations", "Build ratios, conversions, dimensional analysis, and reasonableness checks.", ["foundations.pharm.med-safety"], 40, ["lesson_checkpoint", "timed_drill", "mini_quiz"]),
              ],
            },
            {
              id: "module-communication-ethics-safety",
              title: "Communication, Ethics, and Safety",
              summary: "Therapeutic communication, SBAR, documentation, confidentiality, consent, delegation, and advocacy.",
              lessons: [
                lesson("lesson-sbar-documentation", "SBAR and Objective Documentation", "Communicate concerns clearly and document only objective, relevant, safe information.", ["foundations.communication.sbar-documentation"]),
                lesson("lesson-ethics-confidentiality-advocacy", "Ethics, Confidentiality, and Patient Advocacy", "Apply informed consent, privacy, scope, escalation, and advocacy basics.", ["foundations.communication.sbar-documentation"], 30, ["lesson_checkpoint", "mini_quiz", "case_prompt"]),
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function flattenFoundationLessons(academy: FoundationAcademy = HEALTH_SCIENCES_FOUNDATIONS_ACADEMY): FoundationLesson[] {
  return academy.semesters.flatMap((semester) =>
    semester.units.flatMap((unit) => unit.modules.flatMap((module) => module.lessons)),
  );
}

export function collectFoundationCompetencyIds(academy: FoundationAcademy = HEALTH_SCIENCES_FOUNDATIONS_ACADEMY): string[] {
  return academy.competencies.map((competency) => competency.id);
}

export function validateHealthSciencesFoundationsAcademy(
  academy: FoundationAcademy = HEALTH_SCIENCES_FOUNDATIONS_ACADEMY,
): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const competencyIds = new Set(collectFoundationCompetencyIds(academy));
  const lessonIds = new Set<string>();

  for (const competency of academy.competencies) {
    if (competency.masteryThreshold < 70 || competency.masteryThreshold > 100) {
      errors.push(`Invalid mastery threshold for ${competency.id}`);
    }
    if (!competency.remediationRoute.startsWith("/app/lessons")) {
      errors.push(`Invalid remediation route for ${competency.id}`);
    }
  }

  for (const lessonItem of flattenFoundationLessons(academy)) {
    if (lessonIds.has(lessonItem.id)) errors.push(`Duplicate lesson id: ${lessonItem.id}`);
    lessonIds.add(lessonItem.id);

    for (const section of academy.requiredLessonSections) {
      if (!lessonItem.requiredLessonSections.includes(section)) {
        errors.push(`Lesson ${lessonItem.id} missing required section ${section}`);
      }
    }

    for (const competencyId of lessonItem.competencyIds) {
      if (!competencyIds.has(competencyId)) {
        errors.push(`Lesson ${lessonItem.id} references unknown competency ${competencyId}`);
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
