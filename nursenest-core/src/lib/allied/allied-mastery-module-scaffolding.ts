import type { AlliedMasteryModule, AlliedMasteryVisualQuestionType } from "@/lib/allied/allied-mastery-modules";

export type AlliedMasteryScaffoldStatus = "draft";

export type AlliedMasteryScaffoldEntry = {
  id: string;
  title: string;
  status: AlliedMasteryScaffoldStatus;
  adminPreviewOnly: true;
  generated: true;
};

export type AlliedMasteryLessonOutline = AlliedMasteryScaffoldEntry & {
  outline: string[];
};

export type AlliedMasteryQuizPlaceholder = AlliedMasteryScaffoldEntry & {
  promptType: "placeholder";
  questionText: string;
  answerOptions: string[];
  correctAnswer: string;
  rationale: string;
  whyOthersWrong: string[];
  whatToLookFor: string;
  clinicalData: AlliedMasteryQuestionClinicalData;
  decisionLayer?: AlliedMasteryQuestionDecisionLayer;
};

export type AlliedMasteryCaseScenarioPlaceholder = AlliedMasteryScaffoldEntry & {
  questionText: string;
  answerOptions: string[];
  correctAnswer: string;
  rationale: string;
  whyOthersWrong: string[];
  whatToLookFor: string;
  clinicalData: AlliedMasteryQuestionClinicalData;
  decisionLayer: AlliedMasteryQuestionDecisionLayer;
};

export type AlliedMasteryRapidDrillSet = AlliedMasteryScaffoldEntry & {
  drillType: "classification" | "priority" | "calculation" | "recognition";
  questionText: string;
  answerOptions: string[];
  correctAnswer: string;
  rationale: string;
  whyOthersWrong: string[];
  whatToLookFor: string;
  clinicalData: AlliedMasteryQuestionClinicalData;
  rapidRecognition: {
    compatible: true;
    maxStemWords: number;
  };
  decisionLayer?: AlliedMasteryQuestionDecisionLayer;
};

export type AlliedMasteryWorksheetPlaceholder = AlliedMasteryScaffoldEntry & {
  worksheetType: "student" | "answer_key";
};

export type AlliedMasteryPatternMapDefinition = AlliedMasteryScaffoldEntry & {
  nodes: string[];
};

export type AlliedMasteryVisualQuestionPlaceholder = AlliedMasteryScaffoldEntry & {
  questionType: AlliedMasteryVisualQuestionType;
  questionText: string;
  answerOptions: string[];
  correctAnswer: string;
  rationale: string;
  whatToLookFor: string;
  commonMistakes: string[];
  imageUrl: string;
  secondaryImageUrl?: string;
  highlightOverlay?: {
    type: "placeholder";
    regions: Array<{ label: string; x: number; y: number; width: number; height: number }>;
  };
  rapidDrillMode?: {
    fastImageRecognition: true;
    minimalText: true;
    delayedRationale: true;
  };
  videoUrl?: string;
  framePreviewImageUrl?: string;
  functionalInterpretationPrompt?: string;
  clinicalData?: AlliedMasteryQuestionClinicalData;
  whyOthersWrong?: string[];
  decisionLayer?: AlliedMasteryQuestionDecisionLayer;
};

export type AlliedMasteryQuestionDecisionLayer = {
  whatIsHappening: string;
  priorityAction: string;
};

export type AlliedMasteryQuestionClinicalData = {
  abgValues?: { pH: number; PaCO2: number; HCO3: number; PaO2?: number; SaO2?: number };
  ventSettings?: {
    mode: string;
    tidalVolumeMl?: number;
    respiratoryRate?: number;
    FiO2?: number;
    PEEP?: number;
    pressureSupport?: number;
    inspiratoryPressure?: number;
    ieRatio?: string;
    peakPressure?: number;
    plateauPressure?: number;
  };
  labPanel?: Record<string, number | string>;
  medicationOrder?: { drug: string; dose: string; route: string; frequency: string; indication: string };
  functionalScenario?: string;
  movementInjuryScenario?: string;
  imageUrl?: string;
  audioUrl?: string;
  ecg?: { rhythm: string; rate: number; finding: string };
  videoUrl?: string;
  vitals?: { HR: number; RR: number; BP: string; SpO2: number; temperatureC?: number };
  waveformImageUrl?: string;
  waveformVideoUrl?: string;
  ventilatorScreenImageUrl?: string;
  patientScenario?: string;
  deviceImageUrl?: string;
  oxygenDevice?: { device: string; flowRateLpm: string; approximateFiO2: string; controlled: boolean };
  workOfBreathing?: string[];
  lungSoundAudioUrl?: string;
  infusionData?: { fluid: string; rate: string; route: string; pumpRequired?: boolean };
  ivSiteImageUrl?: string;
  infusionSigns?: string[];
  neuroFindings?: {
    LOC: string;
    GCS?: { eye: number; verbal: number; motor: number; total: number };
    pupils?: string;
    motor?: string;
    sensory?: string;
    speech?: string;
    facialDroop?: string;
  };
  glucoseMmolL?: number;
  functionalTaskData?: { task: string; observedDeficit: string; safetyRisk: string };
};

export type AlliedMasteryModuleScaffold = {
  moduleId: string;
  moduleSlug: string;
  route: string;
  status: AlliedMasteryScaffoldStatus;
  adminPreviewOnly: true;
  generated: true;
  generatedFrom: "allied-mastery-module-scaffold-generator";
  lessonOutlines: AlliedMasteryLessonOutline[];
  quizPlaceholders: AlliedMasteryQuizPlaceholder[];
  caseScenarioTitles: AlliedMasteryCaseScenarioPlaceholder[];
  rapidDrillSets: AlliedMasteryRapidDrillSet[];
  worksheetPlaceholders: AlliedMasteryWorksheetPlaceholder[];
  patternMapDefinitions: AlliedMasteryPatternMapDefinition[];
  visualQuestionPlaceholders?: AlliedMasteryVisualQuestionPlaceholder[];
};

export type AlliedMasteryScaffoldMap = Record<string, AlliedMasteryModuleScaffold>;

export type AlliedMasteryScaffoldCompleteness = {
  status: "complete" | "incomplete";
  missing: string[];
};

const REQUIRED_SCAFFOLD_KEYS = [
  "lessonOutlines",
  "quizPlaceholders",
  "caseScenarioTitles",
  "rapidDrillSets",
  "worksheetPlaceholders",
  "patternMapDefinitions",
] as const;

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripSectionPrefix(section: string): string {
  return section.replace(/^[A-Za-z /+]+:\s*/, "").trim();
}

function splitSectionItems(section: string): string[] {
  return stripSectionPrefix(section)
    .split(/\s*,\s*|\s+\band\b\s+/i)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/\.$/, ""));
}

function sectionsMatching(module: AlliedMasteryModule, pattern: RegExp): string[] {
  return module.sections.filter((section) => pattern.test(section));
}

function uniqueTitles(titles: string[]): string[] {
  const seen = new Set<string>();
  return titles.filter((title) => {
    const key = slugify(title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scaffoldEntry(module: AlliedMasteryModule, kind: string, title: string): AlliedMasteryScaffoldEntry {
  return {
    id: `${module.id}-${kind}-${slugify(title)}`,
    title,
    status: "draft",
    adminPreviewOnly: true,
    generated: true,
  };
}

function lessonTitlesFor(module: AlliedMasteryModule): string[] {
  const nonUtilitySections = module.sections.filter(
    (section) => !/^(cases?|advanced cases|rapid drills?|worksheets?|pattern maps?):/i.test(section),
  );
  return uniqueTitles(nonUtilitySections.length ? nonUtilitySections : module.sections).map(stripSectionPrefix);
}

function caseTitlesFor(module: AlliedMasteryModule): string[] {
  const caseSections = sectionsMatching(module, /^(cases?|advanced cases|assessment cases|image cases):?/i);
  const titles = caseSections.flatMap(splitSectionItems);
  return uniqueTitles(titles.length ? titles : [`${module.title} case scenario`]);
}

function rapidDrillTitlesFor(module: AlliedMasteryModule): string[] {
  const drillSections = sectionsMatching(module, /^rapid/i);
  const titles = drillSections.flatMap(splitSectionItems);
  return uniqueTitles(titles.length ? titles : [`${module.title} recognition drill`]);
}

function worksheetTitlesFor(module: AlliedMasteryModule): string[] {
  const worksheetSections = sectionsMatching(module, /^worksheets?/i);
  const titles = worksheetSections.flatMap(splitSectionItems);
  const normalized = uniqueTitles(titles);
  return [
    ...(normalized.some((title) => /student/i.test(title)) ? [] : [`${module.title} student worksheet`]),
    ...(normalized.some((title) => /answer key/i.test(title)) ? [] : [`${module.title} answer key`]),
    ...normalized,
  ];
}

function patternMapTitlesFor(module: AlliedMasteryModule): string[] {
  const patternMapSections = sectionsMatching(module, /^pattern maps?/i);
  const titles = patternMapSections.flatMap(splitSectionItems);
  return uniqueTitles(titles.length ? titles : [`${module.title} pattern map`]);
}

function visualQuestionTitlesFor(module: AlliedMasteryModule): string[] {
  if (!module.visualQuestionSupport) return [];
  const visualSections = module.sections.filter((section) => /image|comparison|scenario|rapid|echo|clip|cardiac/i.test(section));
  return uniqueTitles(visualSections.length ? visualSections : module.visualQuestionSupport.questionTypes);
}

function drillTypeFor(title: string): AlliedMasteryRapidDrillSet["drillType"] {
  if (/priority|first|escalat/i.test(title)) return "priority";
  if (/calculat|dose|unit/i.test(title)) return "calculation";
  if (/classif|pattern/i.test(title)) return "classification";
  return "recognition";
}

const DEFAULT_ANSWER_OPTIONS = [
  "Most likely pattern / safest priority action",
  "Plausible but lower-priority distractor",
  "Incorrect pattern that ignores the key modality data",
  "Unsafe or unsupported escalation choice",
];

function decisionLayerFor(module: AlliedMasteryModule, title: string): AlliedMasteryQuestionDecisionLayer {
  return {
    whatIsHappening: `${title}: clinically important ${module.title.toLowerCase()} pattern is present in the supplied modality data.`,
    priorityAction: `Use the profession-specific data first, then escalate or verify according to scope when the pattern suggests immediate risk.`,
  };
}

function clinicalDataFor(module: AlliedMasteryModule): AlliedMasteryQuestionClinicalData {
  const professionKey = module.professionKeys[0];
  if (module.id === "respiratory-ventilator-management") {
    return {
      ventSettings: {
        mode: "AC/VC",
        tidalVolumeMl: 420,
        respiratoryRate: 18,
        FiO2: 0.7,
        PEEP: 10,
        ieRatio: "1:2",
        peakPressure: 38,
        plateauPressure: 24,
      },
      abgValues: { pH: 7.31, PaCO2: 52, HCO3: 25, PaO2: 58, SaO2: 88 },
      vitals: { HR: 118, RR: 28, BP: "104/66", SpO2: 88, temperatureC: 37.4 },
      ventilatorScreenImageUrl: "do-spaces://admin-preview/ventilator-screen-placeholder",
      waveformImageUrl: "do-spaces://admin-preview/ventilator-waveform-placeholder",
    };
  }
  if (module.slug === "oxygen-delivery") {
    return {
      vitals: { HR: 122, RR: 30, BP: "110/70", SpO2: 82, temperatureC: 37.2 },
      patientScenario: "Patient is tachypneic with visible work of breathing and persistent hypoxemia despite low-flow oxygen.",
      deviceImageUrl: "do-spaces://admin-preview/oxygen-device-nrb-placeholder",
      oxygenDevice: { device: "non-rebreather mask", flowRateLpm: "10-15", approximateFiO2: "60-90%", controlled: false },
    };
  }
  if (module.slug === "trauma-triage") {
    return {
      vitals: { HR: 132, RR: 30, BP: "86/54", SpO2: 91, temperatureC: 36.1 },
      patientScenario: "Trauma patient with suspected hemorrhagic shock after high-energy mechanism and worsening perfusion cues.",
    };
  }
  if (module.slug === "respiratory-distress") {
    return {
      vitals: { HR: 126, RR: 34, BP: "118/72", SpO2: 84, temperatureC: 37.6 },
      patientScenario: "Patient has visible accessory muscle use, tripod positioning, and cannot speak full sentences.",
      workOfBreathing: ["accessory muscle use", "tripod positioning", "inability to speak full sentences"],
      lungSoundAudioUrl: "do-spaces://admin-preview/lung-sounds-wheeze-placeholder",
      abgValues: { pH: 7.32, PaCO2: 50, HCO3: 25, PaO2: 58, SaO2: 84 },
      deviceImageUrl: "do-spaces://admin-preview/oxygen-device-nrb-placeholder",
      oxygenDevice: { device: "non-rebreather mask", flowRateLpm: "10-15", approximateFiO2: "60-90%", controlled: false },
    };
  }
  if (module.slug === "iv-infusion-safety") {
    return {
      medicationOrder: { drug: "vancomycin", dose: "1 g", route: "IV", frequency: "q12h", indication: "suspected bacterial infection" },
      infusionData: { fluid: "0.9% sodium chloride", rate: "125 mL/hr", route: "peripheral IV", pumpRequired: true },
      vitals: { HR: 118, RR: 24, BP: "98/62", SpO2: 94, temperatureC: 38.1 },
      patientScenario: "Patient develops new rash, wheezing, and discomfort near the IV site during an infusion.",
      ivSiteImageUrl: "do-spaces://admin-preview/iv-site-swelling-placeholder",
      infusionSigns: ["new rash", "wheezing", "painful swollen IV site"],
    };
  }
  if (module.slug === "neuro-stroke-recognition") {
    return {
      vitals: { HR: 104, RR: 20, BP: "178/96", SpO2: 95, temperatureC: 36.8 },
      patientScenario: "Patient has new facial droop, right arm drift, slurred speech, and sudden ADL safety concerns.",
      neuroFindings: {
        LOC: "drowsy but arousable",
        GCS: { eye: 3, verbal: 4, motor: 5, total: 12 },
        pupils: "unequal, sluggish left pupil",
        motor: "right arm drift and right grip weakness",
        sensory: "reduced right-sided sensation",
        speech: "slurred speech with word-finding difficulty",
        facialDroop: "right facial droop",
      },
      glucoseMmolL: 2.6,
      functionalTaskData: { task: "upper-body dressing", observedDeficit: "ignores left sleeve and left side of tray", safetyRisk: "unilateral neglect increases fall and ADL injury risk" },
      imageUrl: "do-spaces://admin-preview/neuro-neglect-functional-task-placeholder",
    };
  }
  if (professionKey === "respiratory") {
    return { abgValues: { pH: 7.28, PaCO2: 58, HCO3: 26, PaO2: 62, SaO2: 89 } };
  }
  if (professionKey === "mlt") {
    return { labPanel: { hemoglobin: 8.6, hematocrit: 27, MCV: 72, WBC: 13.4, platelets: 410, creatinine: 1.8, potassium: 5.3 } };
  }
  if (professionKey === "pharmacy-tech") {
    return { medicationOrder: { drug: "amoxicillin", dose: "500 mg", route: "PO", frequency: "q8h", indication: "bacterial infection" } };
  }
  if (professionKey === "ota") {
    return { functionalScenario: "Client needs moderate assistance for toileting transfers and cannot safely sequence lower-body dressing after a recent stroke." };
  }
  if (professionKey === "pta") {
    return { movementInjuryScenario: "Patient demonstrates antalgic gait with reduced knee flexion and pain after twisting injury during stair descent." };
  }
  if (professionKey === "imaging") {
    return { imageUrl: "do-spaces://admin-preview/imaging-placeholder-cxr" };
  }
  if (professionKey === "sonography") {
    return {
      imageUrl: "do-spaces://admin-preview/cardiac-placeholder-frame",
      ecg: { rhythm: "atrial fibrillation", rate: 132, finding: "irregularly irregular rhythm without consistent P waves" },
      videoUrl: "do-spaces://admin-preview/placeholder-echo-clip",
    };
  }
  if (professionKey === "paramedic") {
    return {
      audioUrl: "do-spaces://admin-preview/lung-sounds-wheeze-placeholder",
      ecg: { rhythm: "sinus tachycardia", rate: 128, finding: "narrow-complex tachycardia with respiratory distress context" },
      vitals: { HR: 128, RR: 32, BP: "92/58", SpO2: 86, temperatureC: 37.8 },
    };
  }
  return {};
}

function questionCore(module: AlliedMasteryModule, title: string) {
  return {
    questionText: `Review the supplied modality data for ${title}. What is the best interpretation or priority action?`,
    answerOptions: DEFAULT_ANSWER_OPTIONS,
    correctAnswer: DEFAULT_ANSWER_OPTIONS[0],
    rationale:
      "The correct answer follows directly from the required modality input, prioritizes safety, and matches scope-appropriate clinical reasoning. Distractors either ignore the key data, over-prioritize a less urgent finding, or suggest unsupported action.",
    whyOthersWrong: [
      "This distractor is plausible but does not address the highest-risk finding.",
      "This distractor ignores the profession-specific modality data.",
      "This distractor could delay escalation or verification when risk is present.",
    ],
    whatToLookFor: "Identify the required modality input first, compare values or cues to realistic clinical patterns, then choose the safest supported action.",
    clinicalData: clinicalDataFor(module),
  };
}

export function createDraftScaffoldForModule(module: AlliedMasteryModule): AlliedMasteryModuleScaffold {
  const lessonTitles = lessonTitlesFor(module);
  const caseTitles = caseTitlesFor(module);
  const rapidDrillTitles = rapidDrillTitlesFor(module);
  const worksheetTitles = worksheetTitlesFor(module);
  const patternMapTitles = patternMapTitlesFor(module);
  const visualQuestionTitles = visualQuestionTitlesFor(module);

  return {
    moduleId: module.id,
    moduleSlug: module.slug,
    route: module.route,
    status: "draft",
    adminPreviewOnly: true,
    generated: true,
    generatedFrom: "allied-mastery-module-scaffold-generator",
    lessonOutlines: lessonTitles.map((title) => ({
      ...scaffoldEntry(module, "lesson", title),
      outline: ["Learning objective placeholder", "Key concept outline placeholder", "Admin review notes placeholder"],
    })),
    quizPlaceholders: lessonTitles.slice(0, Math.max(1, Math.min(lessonTitles.length, 6))).map((title) => ({
      ...scaffoldEntry(module, "quiz", title),
      title: `${title} quiz placeholder`,
      promptType: "placeholder",
      ...questionCore(module, title),
      ...(module.level === "advanced" ? { decisionLayer: decisionLayerFor(module, title) } : {}),
    })),
    caseScenarioTitles: caseTitles.map((title) => ({
      ...scaffoldEntry(module, "case", title),
      ...questionCore(module, title),
      decisionLayer: decisionLayerFor(module, title),
    })),
    rapidDrillSets: rapidDrillTitles.map((title) => ({
      ...scaffoldEntry(module, "rapid-drill", title),
      drillType: drillTypeFor(title),
      ...questionCore(module, title),
      questionText: title,
      rapidRecognition: {
        compatible: true,
        maxStemWords: 24,
      },
      ...(module.level === "advanced" ? { decisionLayer: decisionLayerFor(module, title) } : {}),
    })),
    worksheetPlaceholders: worksheetTitles.map((title) => ({
      ...scaffoldEntry(module, "worksheet", title),
      worksheetType: /answer key/i.test(title) ? "answer_key" : "student",
    })),
    patternMapDefinitions: patternMapTitles.map((title) => ({
      ...scaffoldEntry(module, "pattern-map", title),
      nodes: ["start placeholder", "decision placeholder", "action placeholder"],
    })),
    visualQuestionPlaceholders: module.visualQuestionSupport
      ? module.visualQuestionSupport.questionTypes.map((questionType, index) => {
          const title = visualQuestionTitles[index] ?? `${module.title} ${questionType.replaceAll("_", " ")} placeholder`;
          const isComparison = questionType === "multi_image_comparison";
          const isRapid = questionType === "rapid_drill";
          const isCardiac = Boolean(module.visualQuestionSupport?.cardiacSupport);
          return {
            ...scaffoldEntry(module, "visual-question", `${questionType}-${title}`),
            title,
            questionType,
            questionText: isRapid ? "Visual recognition prompt placeholder" : "Scenario/image interpretation question placeholder",
            answerOptions: ["Option A placeholder", "Option B placeholder", "Option C placeholder", "Option D placeholder"],
            correctAnswer: "Option A placeholder",
            rationale: "Delayed/admin-review rationale placeholder",
            whatToLookFor: "What to look for explanation placeholder",
            commonMistakes: ["Common mistake placeholder"],
            imageUrl: "do-spaces://admin-preview/placeholder-primary-image",
            clinicalData: clinicalDataFor(module),
            whyOthersWrong: [
              "This distractor ignores the primary visual finding.",
              "This distractor overcalls a less supported pattern.",
              "This distractor delays the safest next action.",
            ],
            ...(module.level === "advanced" ? { decisionLayer: decisionLayerFor(module, title) } : {}),
            ...(isComparison ? { secondaryImageUrl: "do-spaces://admin-preview/placeholder-secondary-image" } : {}),
            highlightOverlay: { type: "placeholder", regions: [] },
            ...(isRapid
              ? {
                  rapidDrillMode: {
                    fastImageRecognition: true,
                    minimalText: true,
                    delayedRationale: true,
                  },
                }
              : {}),
            ...(isCardiac
              ? {
                  videoUrl: "do-spaces://admin-preview/placeholder-echo-clip",
                  framePreviewImageUrl: "do-spaces://admin-preview/placeholder-echo-frame",
                  functionalInterpretationPrompt: "Functional interpretation prompt placeholder",
                }
              : {}),
          };
        })
      : undefined,
  };
}

function mergeEntries<T extends AlliedMasteryScaffoldEntry>(existing: T[] | undefined, generated: T[]): T[] {
  const generatedById = new Map(generated.map((entry) => [entry.id, entry]));
  const entries = (existing ?? []).map((entry) => ({
    ...(generatedById.get(entry.id) ?? {}),
    ...entry,
  }) as T);
  const seen = new Set(entries.map((entry) => entry.id));
  for (const entry of generated) {
    if (!seen.has(entry.id)) {
      entries.push(entry);
      seen.add(entry.id);
    }
  }
  return entries;
}

export function mergeScaffoldWithoutOverwrite(
  existing: AlliedMasteryModuleScaffold | undefined,
  generated: AlliedMasteryModuleScaffold,
): AlliedMasteryModuleScaffold {
  if (!existing) return generated;

  return {
    ...generated,
    ...existing,
    moduleId: existing.moduleId || generated.moduleId,
    moduleSlug: existing.moduleSlug || generated.moduleSlug,
    route: existing.route || generated.route,
    status: "draft",
    adminPreviewOnly: true,
    generated: true,
    generatedFrom: existing.generatedFrom || generated.generatedFrom,
    lessonOutlines: mergeEntries(existing.lessonOutlines, generated.lessonOutlines),
    quizPlaceholders: mergeEntries(existing.quizPlaceholders, generated.quizPlaceholders),
    caseScenarioTitles: mergeEntries(existing.caseScenarioTitles, generated.caseScenarioTitles),
    rapidDrillSets: mergeEntries(existing.rapidDrillSets, generated.rapidDrillSets),
    worksheetPlaceholders: mergeEntries(existing.worksheetPlaceholders, generated.worksheetPlaceholders),
    patternMapDefinitions: mergeEntries(existing.patternMapDefinitions, generated.patternMapDefinitions),
    visualQuestionPlaceholders: mergeEntries(existing.visualQuestionPlaceholders, generated.visualQuestionPlaceholders ?? []),
  };
}

export function evaluateAlliedMasteryScaffold(
  scaffold: AlliedMasteryModuleScaffold | undefined,
  module?: AlliedMasteryModule,
): AlliedMasteryScaffoldCompleteness {
  const missing: string[] = [];
  if (!scaffold) {
    return { status: "incomplete", missing: [...REQUIRED_SCAFFOLD_KEYS] };
  }

  for (const key of REQUIRED_SCAFFOLD_KEYS) {
    if (!Array.isArray(scaffold[key]) || scaffold[key].length === 0) missing.push(key);
  }
  if (!scaffold.worksheetPlaceholders?.some((worksheet) => worksheet.worksheetType === "student")) {
    missing.push("student worksheet");
  }
  if (!scaffold.worksheetPlaceholders?.some((worksheet) => worksheet.worksheetType === "answer_key")) {
    missing.push("answer key worksheet");
  }

  const entries = [
    ...(scaffold.lessonOutlines ?? []),
    ...(scaffold.quizPlaceholders ?? []),
    ...(scaffold.caseScenarioTitles ?? []),
    ...(scaffold.rapidDrillSets ?? []),
    ...(scaffold.worksheetPlaceholders ?? []),
    ...(scaffold.patternMapDefinitions ?? []),
    ...(scaffold.visualQuestionPlaceholders ?? []),
  ];
  if (entries.some((entry) => entry.status !== "draft" || entry.adminPreviewOnly !== true)) {
    missing.push("draft adminPreviewOnly marking");
  }

  if (module?.visualQuestionSupport) {
    const visualQuestions = scaffold.visualQuestionPlaceholders ?? [];
    for (const questionType of module.visualQuestionSupport.questionTypes) {
      if (!visualQuestions.some((question) => question.questionType === questionType)) {
        missing.push(`${questionType} visual question`);
      }
    }
    for (const question of visualQuestions) {
      if (!question.questionText?.trim()) missing.push(`${question.id} questionText`);
      if (!Array.isArray(question.answerOptions) || question.answerOptions.length < 2) missing.push(`${question.id} answerOptions`);
      if (!question.correctAnswer?.trim()) missing.push(`${question.id} correctAnswer`);
      if (!question.rationale?.trim()) missing.push(`${question.id} rationale`);
      if (!question.whatToLookFor?.trim()) missing.push(`${question.id} whatToLookFor`);
      if (!Array.isArray(question.commonMistakes) || question.commonMistakes.length === 0) missing.push(`${question.id} commonMistakes`);
      if (!question.imageUrl?.trim()) missing.push(`${question.id} imageUrl`);
      if (question.questionType === "multi_image_comparison" && !question.secondaryImageUrl?.trim()) {
        missing.push(`${question.id} secondaryImageUrl`);
      }
      if (question.questionType === "rapid_drill") {
        if (
          question.rapidDrillMode?.fastImageRecognition !== true ||
          question.rapidDrillMode.minimalText !== true ||
          question.rapidDrillMode.delayedRationale !== true
        ) {
          missing.push(`${question.id} rapidDrillMode`);
        }
      }
      if (module.visualQuestionSupport.cardiacSupport) {
        if (!question.videoUrl?.trim()) missing.push(`${question.id} videoUrl`);
        if (!question.framePreviewImageUrl?.trim()) missing.push(`${question.id} framePreviewImageUrl`);
        if (!question.functionalInterpretationPrompt?.trim()) missing.push(`${question.id} functionalInterpretationPrompt`);
      }
    }
  }

  return { status: missing.length ? "incomplete" : "complete", missing };
}
