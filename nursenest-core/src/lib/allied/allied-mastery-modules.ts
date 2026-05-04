export type AlliedMasteryModuleLevel = "basics" | "basic" | "advanced";
export type AlliedMasteryModuleAccess = "free_preview" | "paid" | "admin_preview_only";

export type AlliedMasteryContentType =
  | "lessons"
  | "quizzes"
  | "case_scenarios"
  | "rapid_drills"
  | "worksheets"
  | "pattern_maps"
  | "clinical_action_layer";

export type AlliedMasteryVisualQuestionType =
  | "image_based"
  | "multi_image_comparison"
  | "scenario_based"
  | "rapid_drill";

export type AlliedMasteryVisualQuestionSupport = {
  questionTypes: AlliedMasteryVisualQuestionType[];
  mediaFields: {
    imageUrl: true;
    secondaryImageUrl: "optional";
    highlightOverlay: "optional";
  };
  requiredQuestionStructure: [
    "questionText",
    "answerOptions",
    "correctAnswer",
    "rationale",
    "whatToLookFor",
    "commonMistakes",
  ];
  rapidDrillMode: {
    fastImageRecognition: true;
    minimalText: true;
    delayedRationale: true;
  };
  worksheetSupport: {
    printableLabelingWorksheets: true;
    abnormalIdentificationSheets: true;
    comparisonWorksheets: true;
  };
  cardiacSupport?: {
    videoUrl: true;
    framePreviewImageUrl: true;
    functionalInterpretationPrompts: true;
  };
};

export type AlliedMasteryModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  professionKeys: string[];
  level: AlliedMasteryModuleLevel;
  access: AlliedMasteryModuleAccess;
  isPublic: false;
  adminPreviewOnly: true;
  entitlementKey: string;
  tags: string[];
  contentTypes: AlliedMasteryContentType[];
  route: string;
  sections: string[];
  actionLayer: string[];
  visualQuestionSupport?: AlliedMasteryVisualQuestionSupport;
};

export const ENABLE_ALLIED_MASTERY_MODULES_FLAG = "ENABLE_ALLIED_MASTERY_MODULES" as const;
export const ENABLE_ADMIN_MODULE_PREVIEW_FLAG = "ENABLE_ADMIN_MODULE_PREVIEW" as const;

export const ALLIED_MASTERY_ENTITLEMENTS = {
  ABG_MASTERY: "ALLIED_ABG_MASTERY_PAID",
  VENTILATOR_BASICS: "ALLIED_VENTILATOR_BASICS_PAID",
  VENTILATOR_MANAGEMENT: "ALLIED_VENTILATOR_MANAGEMENT_PAID",
  OXYGEN_DELIVERY: "ALLIED_OXYGEN_DELIVERY_PAID",
  RESPIRATORY_DISTRESS: "ALLIED_RESPIRATORY_DISTRESS_PAID",
  TRAUMA_TRIAGE: "ALLIED_TRAUMA_TRIAGE_PAID",
  IV_INFUSION_SAFETY: "ALLIED_IV_INFUSION_SAFETY_PAID",
  NEURO_STROKE_RECOGNITION: "ALLIED_NEURO_STROKE_RECOGNITION_PAID",
  ADVANCED_LAB_INTERPRETATION: "ALLIED_ADVANCED_LAB_INTERPRETATION_PAID",
  PHARMACOLOGY_PATTERNS: "ALLIED_PHARMACOLOGY_PATTERNS_PAID",
  DOSAGE_CALCULATIONS: "ALLIED_DOSAGE_CALCULATIONS_PAID",
  ADL_FUNCTIONAL_ASSESSMENT: "ALLIED_ADL_FUNCTIONAL_ASSESSMENT_PAID",
  MSK_REHAB_ASSESSMENT: "ALLIED_MSK_REHAB_ASSESSMENT_PAID",
  IMAGE_RECOGNITION: "ALLIED_IMAGE_RECOGNITION_PAID",
  CARDIAC_PATTERN_RECOGNITION: "ALLIED_CARDIAC_PATTERN_RECOGNITION_PAID",
  EMERGENCY_PATTERN_RECOGNITION: "ALLIED_EMERGENCY_PATTERN_RECOGNITION_PAID",
} as const;

export const ALLIED_MASTERY_PROFESSION_LABELS: Record<string, string> = {
  respiratory: "Respiratory Therapy",
  mlt: "Medical Laboratory Technology",
  "pharmacy-tech": "Pharmacy Technician",
  ota: "Occupational Therapy",
  pta: "Physiotherapy",
  imaging: "Diagnostic Imaging",
  sonography: "Cardiology Technology / Cardiac Sonography",
  paramedic: "Paramedic / EMS",
};

export const ALLIED_MASTERY_PROFESSION_ROUTE_SLUGS: Record<string, string> = {
  respiratory: "respiratory-therapy",
  mlt: "medical-lab-technology",
};

const allContentTypes: AlliedMasteryContentType[] = [
  "lessons",
  "quizzes",
  "case_scenarios",
  "rapid_drills",
  "worksheets",
  "pattern_maps",
  "clinical_action_layer",
];

const visualQuestionStructure: AlliedMasteryVisualQuestionSupport["requiredQuestionStructure"] = [
  "questionText",
  "answerOptions",
  "correctAnswer",
  "rationale",
  "whatToLookFor",
  "commonMistakes",
];

const visualQuestionSupport: AlliedMasteryVisualQuestionSupport = {
  questionTypes: ["image_based", "multi_image_comparison", "scenario_based", "rapid_drill"],
  mediaFields: {
    imageUrl: true,
    secondaryImageUrl: "optional",
    highlightOverlay: "optional",
  },
  requiredQuestionStructure: visualQuestionStructure,
  rapidDrillMode: {
    fastImageRecognition: true,
    minimalText: true,
    delayedRationale: true,
  },
  worksheetSupport: {
    printableLabelingWorksheets: true,
    abnormalIdentificationSheets: true,
    comparisonWorksheets: true,
  },
};

const cardiacVisualQuestionSupport: AlliedMasteryVisualQuestionSupport = {
  ...visualQuestionSupport,
  cardiacSupport: {
    videoUrl: true,
    framePreviewImageUrl: true,
    functionalInterpretationPrompts: true,
  },
};

function hiddenModule(input: Omit<AlliedMasteryModule, "access" | "isPublic" | "adminPreviewOnly" | "route">): AlliedMasteryModule {
  const professionKey = input.professionKeys[0];
  const routeProfessionSlug = ALLIED_MASTERY_PROFESSION_ROUTE_SLUGS[professionKey] ?? professionKey;
  return {
    ...input,
    access: "admin_preview_only",
    isPublic: false,
    adminPreviewOnly: true,
    route: `/allied/${routeProfessionSlug}/modules/${input.slug}`,
  };
}

function hiddenModuleForRoute(
  input: Omit<AlliedMasteryModule, "access" | "isPublic" | "adminPreviewOnly" | "route">,
  routeProfessionKey: string,
): AlliedMasteryModule {
  const routeProfessionSlug = ALLIED_MASTERY_PROFESSION_ROUTE_SLUGS[routeProfessionKey] ?? routeProfessionKey;
  return {
    ...input,
    access: "admin_preview_only",
    isPublic: false,
    adminPreviewOnly: true,
    route: `/allied/${routeProfessionSlug}/modules/${input.slug}`,
  };
}

export const ALLIED_MASTERY_MODULES: AlliedMasteryModule[] = [
  hiddenModule({
    id: "respiratory-abg-mastery",
    slug: "abg",
    title: "ABG Interpretation Mastery",
    description: "Respiratory therapy ABG interpretation from single-value meaning through compensation and priority action.",
    professionKeys: ["respiratory"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.ABG_MASTERY,
    tags: ["abg", "acid-base", "respiratory-therapy", "oxygenation", "ventilation"],
    contentTypes: allContentTypes,
    sections: [
      "Basics: What is an ABG?",
      "Basics: pH",
      "Basics: PaCO2",
      "Basics: HCO3",
      "Basics: PaO2",
      "Basics: SaO2",
      "Basic interpretation: acidosis vs alkalosis",
      "Basic interpretation: respiratory vs metabolic",
      "Basic interpretation: compensation basics",
      "Advanced interpretation: uncompensated",
      "Advanced interpretation: partially compensated",
      "Advanced interpretation: fully compensated",
      "Advanced interpretation: mixed disorders",
      "Cases: COPD exacerbation",
      "Cases: DKA",
      "Cases: sepsis/lactic acidosis",
      "Cases: opioid overdose",
      "Cases: pulmonary embolism",
      "Rapid drills: classify ABG pattern",
      "Rapid drills: identify priority action",
      "Worksheets: student version",
      "Worksheets: answer key version",
      "Pattern maps: pH + CO2 + HCO3 logic map",
      "Pattern maps: compensation map",
    ],
    actionLayer: [
      "What is happening?",
      "Why it matters",
      "Oxygenation or ventilation concern",
      "What to assess",
      "What to do first",
      "When to escalate",
    ],
  }),
  hiddenModule({
    id: "respiratory-ventilator-basics",
    slug: "ventilator-basics",
    title: "Ventilator Basics",
    description: "Core ventilator terms, settings, alarms, patient-ventilator safety, and escalation patterns for RT learners.",
    professionKeys: ["respiratory"],
    level: "basic",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.VENTILATOR_BASICS,
    tags: ["ventilator", "airway", "respiratory-therapy"],
    contentTypes: allContentTypes,
    sections: ["Modes and settings", "Alarm basics", "Oxygenation vs ventilation", "Patient assessment", "Escalation triggers"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "respiratory-ventilator-management",
    slug: "ventilator-management",
    title: "Ventilator Management",
    description: "Respiratory therapy ventilator settings, patient response, alarms, troubleshooting, and basic waveform pattern interpretation.",
    professionKeys: ["respiratory"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.VENTILATOR_MANAGEMENT,
    tags: ["ventilator", "mechanical-ventilation", "respiratory-therapy", "abg", "waveforms"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: What mechanical ventilation does",
      "Lessons: Ventilator modes AC/VC, AC/PC, SIMV, PSV, CPAP, and BiPAP/NIV",
      "Lessons: Core settings tidal volume, respiratory rate, FiO2, PEEP, pressure support, inspiratory pressure, and I:E ratio",
      "Lessons: Oxygenation vs ventilation",
      "Lessons: Peak pressure vs plateau pressure",
      "Lessons: Alarms and troubleshooting",
      "Lessons: Weaning basics",
      "Quizzes: mode recognition, setting purpose, oxygenation vs ventilation decisions, and alarm interpretation",
      "Cases: ARDS with low oxygenation",
      "Cases: COPD with rising CO2",
      "Cases: high peak pressure",
      "Cases: low exhaled tidal volume alarm",
      "Cases: accidental extubation/disconnection",
      "Cases: weaning readiness",
      "Rapid drills: PaCO2 rising — what setting is most related?",
      "Rapid drills: SpO2 low despite FiO2 — what setting may help oxygenation?",
      "Rapid drills: high peak pressure with normal plateau — what does this suggest?",
      "Rapid drills: low pressure alarm — what should you check first?",
      "Rapid drills: FiO2 increased but saturation remains low — what else supports oxygenation?",
      "Rapid drills: plateau pressure is high — what risk is increasing?",
      "Rapid drills: patient triggering rapid shallow breaths — what should you assess?",
      "Rapid drills: exhaled tidal volume suddenly low — what circuit issue is likely?",
      "Rapid drills: pressure support trial fatigue — what sign matters first?",
      "Rapid drills: waveform shows flow not returning to baseline — what does this suggest?",
      "Pattern maps: oxygenation problem map",
      "Pattern maps: ventilation problem map",
      "Pattern maps: peak vs plateau pressure map",
      "Pattern maps: alarm troubleshooting map",
    ],
    actionLayer: [
      "What is happening?",
      "Why it matters",
      "What to assess",
      "What action is priority",
      "When to escalate/call provider/team",
    ],
  }),
  hiddenModuleForRoute({
    id: "respiratory-paramedic-oxygen-delivery",
    slug: "oxygen-delivery",
    title: "Oxygen Delivery Systems",
    description: "Respiratory therapy oxygen device selection, FiO2 reasoning, escalation logic, and patient response interpretation.",
    professionKeys: ["respiratory"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.OXYGEN_DELIVERY,
    tags: ["oxygen-delivery", "respiratory-therapy", "paramedic", "spo2", "fio2", "escalation"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: Oxygenation basics SpO2 vs PaO2",
      "Lessons: Low-flow devices nasal cannula with flow rate, approximate FiO2, indications, limitations, and risks",
      "Lessons: Moderate/high oxygen simple mask and non-rebreather with flow rate, approximate FiO2, indications, limitations, and risks",
      "Lessons: Controlled oxygen Venturi mask with flow rate, approximate FiO2, indications, limitations, and risks",
      "Lessons: Advanced oxygen HFNC, CPAP, and BiPAP/NIV intro with indications, limitations, and risks",
      "Quizzes: device recognition, FiO2 estimation, escalation decisions, and matching patient condition to device",
      "Cases: COPD patient needing controlled oxygen",
      "Cases: acute hypoxia SpO2 below 85%",
      "Cases: trauma patient",
      "Cases: pediatric respiratory distress",
      "Cases: patient not improving on nasal cannula",
      "Cases: patient requiring escalation to NRB or HFNC",
      "Rapid drills: SpO2 82% → best device?",
      "Rapid drills: which delivers highest FiO2?",
      "Rapid drills: COPD patient → safest option?",
      "Rapid drills: patient worsening → next step?",
      "Rapid drills: nasal cannula flow limit?",
      "Rapid drills: Venturi mask purpose?",
      "Rapid drills: NRB reservoir collapsed — what check first?",
      "Rapid drills: HFNC escalation cue?",
      "Rapid drills: CPAP/BiPAP intro indication?",
      "Rapid drills: controlled vs uncontrolled oxygen?",
      "Pattern maps: oxygen escalation ladder nasal cannula → simple mask → NRB → HFNC → CPAP/BiPAP",
      "Pattern maps: FiO2 comparison map",
      "Pattern maps: controlled vs uncontrolled oxygen logic",
    ],
    actionLayer: [
      "What is happening?",
      "Why it matters",
      "What to assess",
      "Priority action",
      "Escalation criteria",
    ],
  }, "respiratory"),
  hiddenModuleForRoute({
    id: "paramedic-oxygen-delivery",
    slug: "oxygen-delivery",
    title: "Oxygen Delivery Systems",
    description: "Paramedic oxygen device selection, patient condition matching, FiO2 reasoning, and escalation cues for field care.",
    professionKeys: ["paramedic"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.OXYGEN_DELIVERY,
    tags: ["oxygen-delivery", "paramedic", "spo2", "fio2", "escalation"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: Oxygenation basics SpO2 vs PaO2",
      "Lessons: Low-flow devices nasal cannula with flow rate, approximate FiO2, indications, limitations, and risks",
      "Lessons: Moderate/high oxygen simple mask and non-rebreather with flow rate, approximate FiO2, indications, limitations, and risks",
      "Lessons: Controlled oxygen Venturi mask with flow rate, approximate FiO2, indications, limitations, and risks",
      "Lessons: Advanced oxygen HFNC, CPAP, and BiPAP/NIV intro with indications, limitations, and risks",
      "Quizzes: device recognition, FiO2 estimation, escalation decisions, and matching patient condition to device",
      "Cases: COPD patient needing controlled oxygen",
      "Cases: acute hypoxia SpO2 below 85%",
      "Cases: trauma patient",
      "Cases: pediatric respiratory distress",
      "Cases: patient not improving on nasal cannula",
      "Cases: patient requiring escalation to NRB or HFNC",
      "Rapid drills: SpO2 82% → best device?",
      "Rapid drills: which delivers highest FiO2?",
      "Rapid drills: COPD patient → safest option?",
      "Rapid drills: patient worsening → next step?",
      "Rapid drills: nasal cannula flow limit?",
      "Rapid drills: Venturi mask purpose?",
      "Rapid drills: NRB reservoir collapsed — what check first?",
      "Rapid drills: HFNC escalation cue?",
      "Rapid drills: CPAP/BiPAP intro indication?",
      "Rapid drills: controlled vs uncontrolled oxygen?",
      "Pattern maps: oxygen escalation ladder nasal cannula → simple mask → NRB → HFNC → CPAP/BiPAP",
      "Pattern maps: FiO2 comparison map",
      "Pattern maps: controlled vs uncontrolled oxygen logic",
    ],
    actionLayer: [
      "What is happening?",
      "Why it matters",
      "What to assess",
      "Priority action",
      "Escalation criteria",
    ],
  }, "paramedic"),
  hiddenModuleForRoute({
    id: "respiratory-paramedic-respiratory-distress",
    slug: "respiratory-distress",
    title: "Respiratory Distress Recognition",
    description: "Respiratory distress pattern recognition using symptoms, vitals, lung sounds, work of breathing, SpO2, ABGs, and oxygen escalation decisions.",
    professionKeys: ["respiratory"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.RESPIRATORY_DISTRESS,
    tags: ["respiratory-distress", "lung-sounds", "spo2", "abg", "oxygen-escalation", "respiratory-therapy"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: What respiratory distress looks like",
      "Lessons: Work of breathing signs accessory muscle use, retractions, nasal flaring, tripod positioning, and inability to speak full sentences",
      "Lessons: SpO2 interpretation and respiratory rate interpretation",
      "Lessons: Lung sounds wheezes, crackles, stridor, and diminished/absent sounds",
      "Lessons: Oxygenation vs ventilation",
      "Lessons: When respiratory distress becomes respiratory failure",
      "Lessons: RT vs Paramedic priorities",
      "Quizzes: identifying distress signs, matching lung sounds to likely cause, choosing oxygen escalation, and recognizing deterioration",
      "Cases: asthma exacerbation with wheezing",
      "Cases: CHF/pulmonary edema with crackles",
      "Cases: anaphylaxis/upper airway swelling with stridor",
      "Cases: COPD exacerbation with CO2 retention risk",
      "Cases: opioid overdose with hypoventilation",
      "Cases: trauma patient with absent breath sounds",
      "Cases: pediatric respiratory distress",
      "Rapid drills: SpO2 84%, RR 34, tripod, wheezing — likely issue?",
      "Rapid drills: crackles + edema + low SpO2 — likely pattern?",
      "Rapid drills: stridor after allergen exposure — priority?",
      "Rapid drills: absent breath sounds after trauma — suspect?",
      "Rapid drills: RR 8 after opioid use — oxygenation or ventilation issue?",
      "Rapid drills: accessory muscle use + cannot speak full sentences — severity?",
      "Rapid drills: wheezing not improving after oxygen escalation — next concern?",
      "Rapid drills: low SpO2 + normal PaCO2 — primary issue?",
      "Rapid drills: rising CO2 + drowsiness — deterioration sign?",
      "Rapid drills: pediatric nasal flaring + retractions — what pattern?",
      "Pattern maps: lung sound → likely cause map",
      "Pattern maps: oxygenation vs ventilation map",
      "Pattern maps: distress vs failure progression map",
      "Pattern maps: oxygen escalation decision map",
      "Pattern maps: RT/Paramedic priority action map",
    ],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }, "respiratory"),
  hiddenModuleForRoute({
    id: "paramedic-respiratory-distress",
    slug: "respiratory-distress",
    title: "Respiratory Distress Recognition",
    description: "Paramedic respiratory distress pattern recognition using symptoms, vitals, lung sounds, work of breathing, SpO2, and field oxygen escalation.",
    professionKeys: ["paramedic"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.RESPIRATORY_DISTRESS,
    tags: ["respiratory-distress", "lung-sounds", "spo2", "oxygen-escalation", "paramedic"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: What respiratory distress looks like",
      "Lessons: Work of breathing signs accessory muscle use, retractions, nasal flaring, tripod positioning, and inability to speak full sentences",
      "Lessons: SpO2 interpretation and respiratory rate interpretation",
      "Lessons: Lung sounds wheezes, crackles, stridor, and diminished/absent sounds",
      "Lessons: Oxygenation vs ventilation",
      "Lessons: When respiratory distress becomes respiratory failure",
      "Lessons: RT vs Paramedic priorities",
      "Quizzes: identifying distress signs, matching lung sounds to likely cause, choosing oxygen escalation, and recognizing deterioration",
      "Cases: asthma exacerbation with wheezing",
      "Cases: CHF/pulmonary edema with crackles",
      "Cases: anaphylaxis/upper airway swelling with stridor",
      "Cases: COPD exacerbation with CO2 retention risk",
      "Cases: opioid overdose with hypoventilation",
      "Cases: trauma patient with absent breath sounds",
      "Cases: pediatric respiratory distress",
      "Rapid drills: SpO2 84%, RR 34, tripod, wheezing — likely issue?",
      "Rapid drills: crackles + edema + low SpO2 — likely pattern?",
      "Rapid drills: stridor after allergen exposure — priority?",
      "Rapid drills: absent breath sounds after trauma — suspect?",
      "Rapid drills: RR 8 after opioid use — oxygenation or ventilation issue?",
      "Rapid drills: accessory muscle use + cannot speak full sentences — severity?",
      "Rapid drills: wheezing not improving after oxygen escalation — next concern?",
      "Rapid drills: low SpO2 + normal PaCO2 — primary issue?",
      "Rapid drills: rising CO2 + drowsiness — deterioration sign?",
      "Rapid drills: pediatric nasal flaring + retractions — what pattern?",
      "Pattern maps: lung sound → likely cause map",
      "Pattern maps: oxygenation vs ventilation map",
      "Pattern maps: distress vs failure progression map",
      "Pattern maps: oxygen escalation decision map",
      "Pattern maps: RT/Paramedic priority action map",
    ],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }, "paramedic"),
  hiddenModule({
    id: "paramedic-trauma-triage",
    slug: "trauma-triage",
    title: "Trauma & Triage",
    description: "Paramedic trauma scene size-up, triage priority, shock recognition, vitals-driven escalation, and safe transport decision patterns.",
    professionKeys: ["paramedic"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.TRAUMA_TRIAGE,
    tags: ["paramedic", "trauma", "triage", "shock", "vitals", "escalation"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: scene safety and mechanism of injury",
      "Lessons: primary assessment and life threats",
      "Lessons: triage categories and transport priority",
      "Lessons: shock patterns and vital sign interpretation",
      "Quizzes: triage priority, shock recognition, and transport decision-making",
      "Cases: multi-patient collision with abnormal vitals",
      "Cases: penetrating trauma with hypotension",
      "Cases: head injury with declining mental status",
      "Cases: pediatric trauma with subtle shock signs",
      "Rapid drills: identify immediate life threat",
      "Rapid drills: choose triage priority",
      "Rapid drills: interpret hypotension with tachycardia",
      "Rapid drills: decide when to escalate transport",
      "Pattern maps: trauma primary survey map",
      "Pattern maps: shock recognition map",
      "Pattern maps: triage escalation map",
    ],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "Priority action", "Escalation/transport criteria"],
  }),
  hiddenModuleForRoute({
    id: "pharmacy-tech-iv-infusion-safety",
    slug: "iv-infusion-safety",
    title: "IV Therapy + Infusion Safety",
    description: "Pharmacy technician IV fluid, compatibility, medication order, infusion reaction, and high-alert order safety mastery for exam prep.",
    professionKeys: ["pharmacy-tech"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.IV_INFUSION_SAFETY,
    tags: ["iv-therapy", "infusion-safety", "pharmacy-tech", "medication-orders", "compatibility"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: IV therapy basics",
      "Lessons: IV fluids overview isotonic, hypotonic, and hypertonic",
      "Lessons: common infusion risks",
      "Lessons: medication order safety",
      "Lessons: infusion rate basics",
      "Lessons: IV compatibility basics",
      "Lessons: infiltration vs extravasation",
      "Lessons: signs of infusion reaction",
      "Lessons: high-alert medication awareness",
      "Lessons: when to stop/escalate",
      "Quizzes: fluid type recognition, unsafe order recognition, infusion reaction recognition, compatibility concern recognition, rate interpretation, and priority action",
      "Cases: infusion reaction during medication administration",
      "Cases: infiltration/extravasation concern",
      "Cases: incompatible IV medication warning",
      "Cases: fluid overload risk",
      "Cases: high-alert medication order check",
      "Cases: paramedic fluid resuscitation scenario",
      "Rapid drills: IV site swollen and painful — concern?",
      "Rapid drills: new rash and wheezing during infusion — priority?",
      "Rapid drills: order appears incompatible — what next?",
      "Rapid drills: older adult with crackles after IV fluids — concern?",
      "Rapid drills: high-alert medication order — what must be verified?",
      "Rapid drills: isotonic vs hypotonic fluid — which category?",
      "Rapid drills: pump rate mismatch — what should be checked?",
      "Rapid drills: vesicant infiltration concern — escalation?",
      "Rapid drills: unclear medication order — safe next step?",
      "Rapid drills: compatibility alert appears — priority?",
      "Pattern maps: infiltration vs extravasation map",
      "Pattern maps: infusion reaction escalation map",
      "Pattern maps: fluid type comparison map",
      "Pattern maps: compatibility safety map",
      "Pattern maps: medication order safety check map",
    ],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }, "pharmacy-tech"),
  hiddenModuleForRoute({
    id: "paramedic-iv-infusion-safety",
    slug: "iv-infusion-safety",
    title: "IV Therapy + Infusion Safety",
    description: "Paramedic IV fluid safety, infusion risks, medication order checks, reaction recognition, and escalation triggers for exam prep.",
    professionKeys: ["paramedic"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.IV_INFUSION_SAFETY,
    tags: ["iv-therapy", "infusion-safety", "paramedic", "fluid-resuscitation", "vitals"],
    contentTypes: allContentTypes,
    sections: [
      "Lessons: IV therapy basics",
      "Lessons: IV fluids overview isotonic, hypotonic, and hypertonic",
      "Lessons: common infusion risks",
      "Lessons: medication order safety",
      "Lessons: infusion rate basics",
      "Lessons: IV compatibility basics",
      "Lessons: infiltration vs extravasation",
      "Lessons: signs of infusion reaction",
      "Lessons: high-alert medication awareness",
      "Lessons: when to stop/escalate",
      "Quizzes: fluid type recognition, unsafe order recognition, infusion reaction recognition, compatibility concern recognition, rate interpretation, and priority action",
      "Cases: infusion reaction during medication administration",
      "Cases: infiltration/extravasation concern",
      "Cases: incompatible IV medication warning",
      "Cases: fluid overload risk",
      "Cases: high-alert medication order check",
      "Cases: paramedic fluid resuscitation scenario",
      "Rapid drills: IV site swollen and painful — concern?",
      "Rapid drills: new rash and wheezing during infusion — priority?",
      "Rapid drills: order appears incompatible — what next?",
      "Rapid drills: older adult with crackles after IV fluids — concern?",
      "Rapid drills: high-alert medication order — what must be verified?",
      "Rapid drills: isotonic vs hypotonic fluid — which category?",
      "Rapid drills: pump rate mismatch — what should be checked?",
      "Rapid drills: vesicant infiltration concern — escalation?",
      "Rapid drills: unclear medication order — safe next step?",
      "Rapid drills: compatibility alert appears — priority?",
      "Pattern maps: infiltration vs extravasation map",
      "Pattern maps: infusion reaction escalation map",
      "Pattern maps: fluid type comparison map",
      "Pattern maps: compatibility safety map",
      "Pattern maps: medication order safety check map",
    ],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }, "paramedic"),
  hiddenModule({
    id: "mlt-advanced-lab-interpretation",
    slug: "advanced-lab-interpretation",
    title: "Advanced Lab Interpretation",
    description: "Medical laboratory pattern recognition across CBC, chemistry, renal, liver, coagulation, and critical value escalation.",
    professionKeys: ["mlt"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.ADVANCED_LAB_INTERPRETATION,
    tags: ["mlt", "lab-panels", "hematology", "chemistry", "critical-values"],
    contentTypes: allContentTypes,
    sections: [
      "Basics: CBC review, electrolytes, renal markers, liver markers, and coagulation basics",
      "Interpretation patterns: anemia patterns, infection/inflammation patterns, renal impairment patterns, electrolyte imbalance patterns, liver injury patterns, and coagulation abnormality patterns",
      "Advanced cases: iron deficiency anemia, sepsis pattern, acute kidney injury, DKA pattern, liver dysfunction, and bleeding/clotting risk",
      "Rapid drills: identify abnormal cluster, classify likely pattern, and identify critical value",
      "Worksheets: student version, answer key version, and full lab panel interpretation",
      "Pattern maps: CBC pattern map, renal/electrolyte pattern map, and coagulation pattern map",
    ],
    actionLayer: [
      "What pattern is present?",
      "Why it matters",
      "What values are critical",
      "What requires escalation",
      "What should be verified/rechecked",
    ],
  }),
  hiddenModule({
    id: "pharmacy-tech-pharmacology-patterns",
    slug: "pharmacology-patterns",
    title: "Pharmacology Pattern Recognition",
    description: "Drug class patterns, contraindications, adverse effects, and interaction recognition for pharmacy technician learners.",
    professionKeys: ["pharmacy-tech"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.PHARMACOLOGY_PATTERNS,
    tags: ["pharmacy-tech", "pharmacology", "drug-classes", "interactions"],
    contentTypes: allContentTypes,
    sections: ["Drug class lessons", "Contraindications", "Adverse effects", "Interactions", "Worksheet review"],
    actionLayer: ["What is happening?", "Why it matters", "What to verify", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "pharmacy-tech-dosage-calculations",
    slug: "dosage-calculations",
    title: "Dosage Calculations",
    description: "Calculation drills, unit conversion, medication safety checks, and pharmacy workflow accuracy.",
    professionKeys: ["pharmacy-tech"],
    level: "basic",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.DOSAGE_CALCULATIONS,
    tags: ["pharmacy-tech", "dosage-calculation", "medication-safety"],
    contentTypes: allContentTypes,
    sections: ["Unit conversion", "Dose calculations", "Safety checks", "Rapid calculation drills", "Answer key worksheets"],
    actionLayer: ["What is being calculated?", "Why it matters", "What to verify", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "ota-adl-functional-assessment",
    slug: "adl-functional-assessment",
    title: "ADL + Functional Assessment Mastery",
    description: "ADL assessment, adaptive strategies, care planning, goal writing, and occupation-focused case reasoning.",
    professionKeys: ["ota"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.ADL_FUNCTIONAL_ASSESSMENT,
    tags: ["occupational-therapy", "adl", "functional-assessment", "goal-writing"],
    contentTypes: allContentTypes,
    sections: ["ADL lessons", "Assessment cases", "Care planning", "Goal writing", "Worksheets"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "pta-msk-rehab-assessment",
    slug: "msk-rehab-assessment",
    title: "Musculoskeletal Rehab + Movement Assessment",
    description: "ROM, gait, injury patterns, rehab progression, and movement assessment cases for physiotherapy learners.",
    professionKeys: ["pta"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.MSK_REHAB_ASSESSMENT,
    tags: ["physiotherapy", "msk", "rehab", "gait", "rom"],
    contentTypes: allContentTypes,
    sections: ["ROM", "Gait", "Injury patterns", "Rehab progression", "Assessment cases", "Worksheets"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
  hiddenModule({
    id: "imaging-image-recognition",
    slug: "image-recognition",
    title: "Image Recognition Basics",
    description: "Normal vs abnormal imaging, chest X-ray basics, CT/MRI safety concepts, and image case review.",
    professionKeys: ["imaging"],
    level: "basic",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.IMAGE_RECOGNITION,
    tags: ["diagnostic-imaging", "x-ray", "ct", "mri", "image-recognition"],
    contentTypes: allContentTypes,
    sections: [
      "Normal vs abnormal imaging",
      "Chest X-ray basics",
      "CT/MRI safety concepts",
      "Image-based questions",
      "Multi-image comparison questions",
      "Scenario-based image cases",
      "Rapid drill questions: fast image recognition",
      "Worksheets: printable labeling worksheets, abnormal identification sheets, comparison worksheets",
    ],
    actionLayer: ["What is visible?", "Why it matters", "What to verify", "What to do first", "When to escalate"],
    visualQuestionSupport,
  }),
  hiddenModule({
    id: "sonography-ecg-cardiac-patterns",
    slug: "ecg-cardiac-patterns",
    title: "ECG + Cardiac Pattern Recognition",
    description: "Rhythm strips, cardiac findings, echo and imaging basics where appropriate, and cardiac pattern cases.",
    professionKeys: ["sonography"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.CARDIAC_PATTERN_RECOGNITION,
    tags: ["cardiology-technology", "ecg", "cardiac-patterns"],
    contentTypes: allContentTypes,
    sections: [
      "Rhythm strips",
      "Cardiac findings",
      "Echo/imaging basics",
      "Image-based questions",
      "Multi-image comparison questions",
      "Scenario-based cardiac cases",
      "Rapid drill questions: fast image recognition",
      "Echo clip prompts: videoUrl, frame preview image, functional interpretation prompts",
      "Worksheets: printable labeling worksheets, abnormal identification sheets, comparison worksheets",
    ],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
    visualQuestionSupport: cardiacVisualQuestionSupport,
  }),
  hiddenModule({
    id: "paramedic-emergency-pattern-recognition",
    slug: "emergency-pattern-recognition",
    title: "Emergency Pattern Recognition",
    description: "Triage, shock, trauma, ECG basics, respiratory distress, priority actions, and rapid drills for EMS learners.",
    professionKeys: ["paramedic"],
    level: "advanced",
    entitlementKey: ALLIED_MASTERY_ENTITLEMENTS.EMERGENCY_PATTERN_RECOGNITION,
    tags: ["paramedic", "ems", "triage", "shock", "trauma", "rapid-drills"],
    contentTypes: allContentTypes,
    sections: ["Triage", "Shock", "Trauma", "ECG basics", "Respiratory distress", "Priority actions", "Rapid drills"],
    actionLayer: ["What is happening?", "Why it matters", "What to assess", "What to do first", "When to escalate"],
  }),
];

export function isAlliedMasteryModulesPublicEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const raw = env[ENABLE_ALLIED_MASTERY_MODULES_FLAG]?.trim().toLowerCase();
  return raw === "1" || raw === "true";
}

export function isAdminModulePreviewEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const raw = env[ENABLE_ADMIN_MODULE_PREVIEW_FLAG]?.trim().toLowerCase();
  return raw == null || raw === "" || raw === "1" || raw === "true";
}

export function alliedMasteryModulesForProfession(professionKey: string): AlliedMasteryModule[] {
  return ALLIED_MASTERY_MODULES.filter((module) => module.professionKeys.includes(professionKey));
}

export function findAlliedMasteryModule(professionKey: string, moduleSlug: string): AlliedMasteryModule | null {
  return ALLIED_MASTERY_MODULES.find((module) => module.slug === moduleSlug && module.professionKeys.includes(professionKey)) ?? null;
}

export function groupedAlliedMasteryModules(): Array<{ professionKey: string; professionLabel: string; modules: AlliedMasteryModule[] }> {
  return Object.entries(ALLIED_MASTERY_PROFESSION_LABELS).map(([professionKey, professionLabel]) => ({
    professionKey,
    professionLabel,
    modules: alliedMasteryModulesForProfession(professionKey),
  }));
}
