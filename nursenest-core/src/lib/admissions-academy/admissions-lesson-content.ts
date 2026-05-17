import type { AdmissionsAcademyProgramId } from "./admissions-academy-programs";

export type AdmissionsLessonBlockKind =
  | "overview"
  | "learningObjectives"
  | "deepTeaching"
  | "clinicalRelevance"
  | "memoryAids"
  | "commonMistakes"
  | "examTraps"
  | "workedExamples"
  | "practiceQuestions"
  | "flashcards"
  | "miniAssessment"
  | "remediation";

export type AdmissionsPracticeQuestion = {
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: {
    correct: string;
    incorrect: string[];
    mechanism: string;
    examTrap: string;
  };
};

export type AdmissionsFlashcard = {
  front: string;
  back: string;
  cardType: "recall" | "mechanism" | "exam_trap" | "calculation" | "clinical_reasoning";
};

export type AdmissionsLessonContent = {
  id: string;
  programId: AdmissionsAcademyProgramId;
  title: string;
  domainId: string;
  competencyIds: string[];
  estimatedMinutes: number;
  blocks: Record<AdmissionsLessonBlockKind, string[]>;
  practiceQuestions: AdmissionsPracticeQuestion[];
  flashcards: AdmissionsFlashcard[];
  remediationTargets: string[];
};

export const STARTER_ADMISSIONS_LESSON_CONTENT: AdmissionsLessonContent[] = [
  {
    id: "teas-science-cell-chem",
    programId: "ati-teas-academy",
    title: "Cell Biology and Chemistry for TEAS",
    domainId: "ati-teas-science",
    competencyIds: ["foundations.cell.mem transport", "foundations.chem.ph-electrolytes"],
    estimatedMinutes: 45,
    blocks: {
      overview: [
        "TEAS science questions often test whether you can connect basic cell biology to chemistry and physiology. This lesson builds the bridge between membranes, transport, ions, pH, and cellular survival.",
      ],
      learningObjectives: [
        "Identify major organelles and explain their function.",
        "Differentiate diffusion, osmosis, facilitated diffusion, and active transport.",
        "Explain why ions, pH, and electrolytes matter for cellular function.",
      ],
      deepTeaching: [
        "Cells survive by maintaining gradients. A gradient means there is more of something on one side of a membrane than the other. Oxygen, carbon dioxide, water, sodium, potassium, and hydrogen ions all move according to gradients or require energy to move against them.",
        "Diffusion moves particles from high concentration to low concentration without ATP. Osmosis is water movement across a semipermeable membrane. Active transport uses ATP to move substances against a gradient, such as the sodium-potassium pump.",
        "pH measures hydrogen ion concentration. More hydrogen ions means lower pH and more acidity. Less hydrogen ion means higher pH and more alkalinity. This matters later for respiratory physiology, renal regulation, ABGs, and shock.",
      ],
      clinicalRelevance: [
        "This foundation later explains dehydration, fluid shifts, edema, renal failure, electrolyte abnormalities, arrhythmias, and acid-base changes.",
      ],
      memoryAids: [
        "Diffusion: particles drift down the hill. Active transport: ATP pushes up the hill.",
        "Osmosis follows solute: water moves toward the side with more dissolved particles.",
      ],
      commonMistakes: [
        "Confusing diffusion with osmosis. Diffusion refers to particle movement; osmosis specifically refers to water movement.",
        "Thinking all membrane movement requires energy. Passive transport does not require ATP.",
      ],
      examTraps: [
        "A TEAS item may describe swelling cells without using the word osmosis. Look for water movement toward higher solute concentration.",
        "Questions may hide active transport by describing movement from low concentration to high concentration. That requires energy.",
      ],
      workedExamples: [
        "If a cell is placed in a very concentrated solution, water tends to leave the cell. The cell shrinks because water moves toward the higher solute concentration outside the cell.",
      ],
      practiceQuestions: ["See structured practiceQuestions for rationales."],
      flashcards: ["See structured flashcards for spaced repetition cards."],
      miniAssessment: ["Pass threshold: 85% across transport, organelles, and pH/electrolyte items."],
      remediation: ["If transport items are missed, review membranes and transport before attempting TEAS science timed drills."],
    },
    practiceQuestions: [
      {
        stem: "A molecule moves from an area of high concentration to an area of low concentration without ATP. Which process is occurring?",
        options: ["Active transport", "Diffusion", "Endocytosis", "Exocytosis"],
        correctIndex: 1,
        rationale: {
          correct: "Diffusion is passive movement from high concentration to low concentration.",
          incorrect: [
            "Active transport requires ATP and moves against a gradient.",
            "Endocytosis brings material into the cell using vesicles.",
            "Exocytosis moves material out of the cell using vesicles.",
          ],
          mechanism: "Particles naturally move down concentration gradients unless energy is used to move them against the gradient.",
          examTrap: "The phrase 'without ATP' is the key clue that the process is passive.",
        },
      },
    ],
    flashcards: [
      { front: "What is osmosis?", back: "Water movement across a semipermeable membrane toward higher solute concentration.", cardType: "recall" },
      { front: "Why does active transport require ATP?", back: "It moves substances against their concentration gradient.", cardType: "mechanism" },
    ],
    remediationTargets: ["lesson-membranes-transport", "lesson-ph-acids-bases", "lesson-electrolytes-solutions"],
  },
  {
    id: "teas-math-numbers-algebra",
    programId: "ati-teas-academy",
    title: "Numbers, Algebra, and Word Problems",
    domainId: "ati-teas-math",
    competencyIds: ["foundations.pharm.med-safety"],
    estimatedMinutes: 40,
    blocks: {
      overview: ["TEAS math rewards learners who can translate words into operations and check whether an answer is reasonable."],
      learningObjectives: ["Set up ratios and proportions.", "Solve one-step and multi-step algebra problems.", "Use dimensional thinking for unit conversions."],
      deepTeaching: [
        "The safest way to solve health-science math is to track units. If the units cancel correctly, the calculation is more likely to be set up correctly.",
        "Word problems usually contain extra language. First identify what the question asks for, then identify the given values, then choose the operation that connects them.",
      ],
      clinicalRelevance: ["Ratio, proportion, and conversion skills become medication-safety skills later in nursing and allied health programs."],
      memoryAids: ["Ask: What do I have, what do I need, and what conversion gets me there?"],
      commonMistakes: ["Solving for the wrong unit.", "Rounding too early.", "Ignoring whether the answer is clinically reasonable."],
      examTraps: ["TEAS answer choices often include common setup errors, especially inverted ratios or decimal-place mistakes."],
      workedExamples: ["If 1 inch = 2.54 cm, then 10 inches x 2.54 cm/inch = 25.4 cm."],
      practiceQuestions: ["See structured practiceQuestions for rationales."],
      flashcards: ["See structured flashcards for spaced repetition cards."],
      miniAssessment: ["Pass threshold: 85% across ratios, algebra setup, and conversion items."],
      remediation: ["Conversion misses route to dosage calculation foundations before timed TEAS math drills."],
    },
    practiceQuestions: [
      {
        stem: "A student needs to convert 5 feet to inches. Which setup is correct?",
        options: ["5 ft × 12 in/ft", "5 ft ÷ 12 in/ft", "12 ft × 5 in", "5 in × 12 ft/in"],
        correctIndex: 0,
        rationale: {
          correct: "Multiplying by 12 inches per foot cancels feet and leaves inches.",
          incorrect: ["Dividing would make the value smaller, which is unreasonable because inches are smaller units than feet.", "The units are mismatched.", "The setup starts with inches, not feet."],
          mechanism: "Dimensional analysis works by arranging conversion factors so unwanted units cancel.",
          examTrap: "The common trap is inverting the conversion factor.",
        },
      },
    ],
    flashcards: [
      { front: "What is the first step in a word problem?", back: "Identify exactly what unit or value the question asks for.", cardType: "exam_trap" },
      { front: "Why should units be tracked in conversions?", back: "Units show whether the setup cancels correctly and leaves the target unit.", cardType: "mechanism" },
    ],
    remediationTargets: ["lesson-dosage-calculations-foundations"],
  },
  {
    id: "hesi-a2-ap-cardiorespiratory",
    programId: "hesi-a2-academy",
    title: "Cardiovascular and Respiratory A&P",
    domainId: "hesi-a2-anatomy-physiology",
    competencyIds: ["foundations.cardio.blood-flow", "foundations.resp.gas-exchange"],
    estimatedMinutes: 40,
    blocks: {
      overview: ["HESI A2 A&P commonly tests whether learners understand how the heart and lungs work together to deliver oxygen to tissues."],
      learningObjectives: ["Trace blood flow through the heart and lungs.", "Differentiate oxygenation from ventilation.", "Explain how gas exchange supports tissue oxygen delivery."],
      deepTeaching: [
        "Blood returns from the body to the right side of the heart, travels to the lungs for gas exchange, returns to the left side of the heart, then pumps to the body.",
        "Oxygenation means getting oxygen into blood and tissues. Ventilation means moving air in and out to remove carbon dioxide. A patient can have an oxygenation problem, a ventilation problem, or both.",
        "Gas exchange occurs at the alveoli. Oxygen diffuses from alveoli into pulmonary capillaries, while carbon dioxide diffuses from blood into alveoli to be exhaled.",
      ],
      clinicalRelevance: ["This lesson becomes the base for shock, hypoxia, ABGs, ECG instability, and respiratory therapy content."],
      memoryAids: ["Right heart to lungs; left heart to body.", "Oxygenation is O2 delivery; ventilation is CO2 removal."],
      commonMistakes: ["Mixing up right-sided and left-sided heart flow.", "Using oxygenation and ventilation as if they mean the same thing."],
      examTraps: ["HESI items may ask where blood goes after the right ventricle. The answer is pulmonary artery, not aorta."],
      workedExamples: ["Decreased ventilation can cause carbon dioxide retention even if oxygen is being administered."],
      practiceQuestions: ["See structured practiceQuestions for rationales."],
      flashcards: ["See structured flashcards for spaced repetition cards."],
      miniAssessment: ["Pass threshold: 85% across blood flow, gas exchange, oxygenation, and ventilation items."],
      remediation: ["Blood-flow misses route to cardiovascular foundations; oxygenation misses route to respiratory foundations."],
    },
    practiceQuestions: [
      {
        stem: "After blood leaves the right ventricle, where does it go next?",
        options: ["Aorta", "Pulmonary artery", "Pulmonary vein", "Left atrium"],
        correctIndex: 1,
        rationale: {
          correct: "The right ventricle pumps deoxygenated blood into the pulmonary artery toward the lungs.",
          incorrect: ["The aorta receives blood from the left ventricle.", "Pulmonary veins return oxygenated blood to the left atrium.", "The left atrium receives blood after it returns from the lungs."],
          mechanism: "Right-sided heart structures move blood to the lungs; left-sided structures move oxygenated blood to the body.",
          examTrap: "The pulmonary artery is called an artery because it carries blood away from the heart, even though that blood is deoxygenated.",
        },
      },
    ],
    flashcards: [
      { front: "Where does the right ventricle pump blood?", back: "Into the pulmonary artery toward the lungs.", cardType: "recall" },
      { front: "What is the difference between oxygenation and ventilation?", back: "Oxygenation is oxygen delivery; ventilation is movement of air and CO2 removal.", cardType: "mechanism" },
    ],
    remediationTargets: ["lesson-heart-anatomy-blood-flow", "lesson-lung-anatomy-gas-exchange", "lesson-oxygenation-ventilation"],
  },
  {
    id: "hesi-a2-critical-safety-prioritization",
    programId: "hesi-a2-academy",
    title: "Safety and Prioritization Logic",
    domainId: "hesi-a2-critical-thinking",
    competencyIds: ["foundations.phys.homeostasis", "foundations.infection.transmission", "foundations.communication.sbar-documentation"],
    estimatedMinutes: 40,
    blocks: {
      overview: ["HESI critical-thinking items often test whether learners can choose the safest and most logical action when multiple answers sound plausible."],
      learningObjectives: ["Apply safety-first thinking.", "Use ABCs and risk recognition.", "Differentiate urgent from non-urgent actions."],
      deepTeaching: [
        "Prioritization begins with threat recognition. Airway, breathing, circulation, acute change, safety risk, and infection-control risks generally outrank comfort or routine tasks.",
        "Critical-thinking questions often include one answer that is factually true but not the priority. The best answer addresses the highest immediate risk.",
      ],
      clinicalRelevance: ["This logic later supports NCLEX, REx-PN, CNPLE, emergency care, ECG instability, and critical-care simulations."],
      memoryAids: ["Safety first, acute before chronic, unstable before stable, ABCs before comfort."],
      commonMistakes: ["Choosing the most familiar action instead of the safest priority.", "Ignoring words that indicate acute change."],
      examTraps: ["A comforting communication response may be appropriate but not best if the scenario signals airway, breathing, circulation, or safety compromise."],
      workedExamples: ["If a patient reports sudden shortness of breath, assessing breathing outranks offering fluids or completing routine documentation."],
      practiceQuestions: ["See structured practiceQuestions for rationales."],
      flashcards: ["See structured flashcards for spaced repetition cards."],
      miniAssessment: ["Pass threshold: 85% across safety, ABCs, acute change, and escalation logic."],
      remediation: ["Safety misses route to infection control or SBAR/documentation depending on error pattern."],
    },
    practiceQuestions: [
      {
        stem: "Which situation should be addressed first?",
        options: ["A stable patient asking for discharge instructions", "A patient with sudden shortness of breath", "A patient requesting a meal tray", "A patient asking to change the television channel"],
        correctIndex: 1,
        rationale: {
          correct: "Sudden shortness of breath may indicate an acute breathing problem and requires immediate assessment.",
          incorrect: ["Discharge teaching is important but not urgent if the patient is stable.", "A meal request is not the highest safety risk.", "A television request is comfort-related and not urgent."],
          mechanism: "Breathing problems can rapidly impair oxygenation and tissue perfusion.",
          examTrap: "Do not choose routine or comfort actions when an acute ABC change is present.",
        },
      },
    ],
    flashcards: [
      { front: "What usually outranks routine care in prioritization questions?", back: "ABCs, acute change, instability, safety risk, and infection-control risk.", cardType: "clinical_reasoning" },
      { front: "What is a common critical-thinking exam trap?", back: "Choosing a true but lower-priority action when an urgent risk is present.", cardType: "exam_trap" },
    ],
    remediationTargets: ["lesson-homeostasis-feedback", "lesson-ppe-isolation-transmission", "lesson-sbar-documentation"],
  },
];

export function getAdmissionsLessonContentById(id: string): AdmissionsLessonContent | null {
  return STARTER_ADMISSIONS_LESSON_CONTENT.find((lesson) => lesson.id === id) ?? null;
}

export function getAdmissionsLessonContentForProgram(programId: AdmissionsAcademyProgramId): AdmissionsLessonContent[] {
  return STARTER_ADMISSIONS_LESSON_CONTENT.filter((lesson) => lesson.programId === programId);
}

export function validateStarterAdmissionsLessonContent(): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const requiredBlockKinds: AdmissionsLessonBlockKind[] = [
    "overview",
    "learningObjectives",
    "deepTeaching",
    "clinicalRelevance",
    "memoryAids",
    "commonMistakes",
    "examTraps",
    "workedExamples",
    "practiceQuestions",
    "flashcards",
    "miniAssessment",
    "remediation",
  ];

  for (const lesson of STARTER_ADMISSIONS_LESSON_CONTENT) {
    if (ids.has(lesson.id)) errors.push(`Duplicate lesson content id: ${lesson.id}`);
    ids.add(lesson.id);
    if (lesson.estimatedMinutes < 30) errors.push(`${lesson.id} is too thin for an admissions academy lesson`);
    if (lesson.competencyIds.length < 1) errors.push(`${lesson.id} needs competency mapping`);
    if (lesson.practiceQuestions.length < 1) errors.push(`${lesson.id} needs at least one starter question`);
    if (lesson.flashcards.length < 2) errors.push(`${lesson.id} needs at least two starter flashcards`);
    for (const kind of requiredBlockKinds) {
      if (!lesson.blocks[kind]?.length) errors.push(`${lesson.id} missing ${kind} block content`);
    }
    for (const question of lesson.practiceQuestions) {
      if (question.options.length < 4) errors.push(`${lesson.id} has question with fewer than four options`);
      if (question.rationale.incorrect.length !== question.options.length - 1) {
        errors.push(`${lesson.id} question rationale must teach every incorrect option`);
      }
      if (!question.rationale.mechanism || !question.rationale.examTrap) {
        errors.push(`${lesson.id} question needs mechanism and exam-trap rationale`);
      }
    }
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
