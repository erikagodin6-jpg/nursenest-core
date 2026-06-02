import type {
  ClinicalSkillDefinition,
  ClinicalSkillStep,
} from "@/lib/clinical-skills/clinical-skills-catalog";

export type EnrichedClinicalSkillStep = ClinicalSkillStep & {
  rationale?: string;
  bedsideTip?: string;
  safetyWarning?: string;
  commonError?: string;
  recallPrompt?: string;
};

export type ClinicalSkillFlashcard = {
  id: string;
  front: string;
  back: string;
};

export type ClinicalSkillErrorScenario = {
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
};

export type ClinicalSkillRetentionItem = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  rationale: string;
};

export type ClinicalSkillEnrichment = {
  simulationOverview: string;
  clinicalRationale: string;
  steps: EnrichedClinicalSkillStep[];
  flashcards: ClinicalSkillFlashcard[];
  errorScenario: ClinicalSkillErrorScenario;
  retentionItems: ClinicalSkillRetentionItem[];
};

type StepPatch = Partial<EnrichedClinicalSkillStep>;

const ENRICHMENT: Record<
  string,
  {
    simulationOverview: string;
    clinicalRationale: string;
    stepPatches?: StepPatch[];
    flashcards: ClinicalSkillFlashcard[];
    errorScenario: ClinicalSkillErrorScenario;
    retentionItems: ClinicalSkillRetentionItem[];
  }
> = {
  "sterile-dressing-change": {
    simulationOverview:
      "Rehearse sterile field discipline, wound exposure timing, and infection escalation cues as if at the bedside — contamination breaks are high-risk events.",
    clinicalRationale:
      "Dressing changes balance wound healing with infection prevention. Sterile technique protects granulating tissue; assessment drives dressing selection and provider notification.",
    flashcards: [
      {
        id: "sdc-f1",
        front: "When should you reglove during a dressing change?",
        back: "After removing the soiled dressing and before any wound contact — treat the old dressing as contaminated.",
      },
      {
        id: "sdc-f2",
        front: "Where should the sterile field be placed?",
        back: "Adjacent at waist level within reach, away from soiled linens and non-sterile surfaces.",
      },
      {
        id: "sdc-f3",
        front: "Which finding requires escalation?",
        back: "Purulent drainage, increasing pain, spreading erythema, or fever — possible wound infection.",
      },
      {
        id: "sdc-f4",
        front: "What must be confirmed before applying new dressing?",
        back: "Provider-ordered dressing type, wound assessment, and hand hygiene / sterile reglove per protocol.",
      },
    ],
    errorScenario: {
      stem: "Which action most likely breaks sterile technique during a dressing change?",
      options: [
        "Reaching over the sterile field to grab supplies from the far side of the bed",
        "Discarding the old dressing in a biohazard bag at arm's length",
        "Explaining the procedure before opening supplies",
        "Using a new pair of gloves after hand hygiene",
      ],
      correctIndex: 0,
      rationale:
        "Leaning across the field contaminates sterile items. Reorganize supplies within reach or open additional sterile items if needed.",
    },
    retentionItems: [
      {
        id: "sdc-r1",
        question:
          "The patient reports increased wound odor but denies pain. What is your next best action?",
        options: [
          "Complete wound assessment and notify the provider per infection protocol",
          "Apply a dry dressing quickly and recheck tomorrow",
          "Skip assessment because pain is absent",
          "Have the patient cleanse the wound independently",
        ],
        correct: 0,
        rationale:
          "Odor change warrants assessment and possible culture or order revision — pain is not required for infection concern.",
      },
      {
        id: "sdc-r2",
        question:
          "What documentation is most important immediately after the dressing change?",
        options: [
          "Wound appearance, drainage, dressing type, patient tolerance, and education provided",
          "Only the time the dressing was changed",
          "Charge nurse initials only",
          "Patient food preferences",
        ],
        correct: 0,
        rationale:
          "Structured wound documentation supports continuity of care and legal defensibility.",
      },
    ],
  },
  "subcutaneous-injection": {
    simulationOverview:
      "Practice rights verification, site rotation, angle selection, and observation windows — the sequence that prevents wrong-route and tissue injury events.",
    clinicalRationale:
      "Subcutaneous delivery depends on adipose depth, medication properties, and rotation maps to prevent lipodystrophy and inconsistent absorption.",
    flashcards: [
      {
        id: "sq-f1",
        front: "What must be verified before any injection?",
        back: "Rights of medication administration, allergies, order, dose, route, and time.",
      },
      {
        id: "sq-f2",
        front: "Typical SQ needle angle?",
        back: "45–90° depending on pinch technique, tissue thickness, and product guidance.",
      },
      {
        id: "sq-f3",
        front: "Why rotate injection sites?",
        back: "Prevents lipodystrophy, scarring, and erratic absorption from overused tissue.",
      },
      {
        id: "sq-f4",
        front: "After injection, what observation matters?",
        back: "Monitor for allergic reaction, bleeding, and patient understanding of self-administration when applicable.",
      },
    ],
    errorScenario: {
      stem: "Which mistake most increases harm during a subcutaneous injection?",
      options: [
        "Skipping allergy screening because the medication was given yesterday",
        "Using a site rotation map",
        "Expelling air per manufacturer guidance",
        "Disposing sharps in a puncture-resistant container",
      ],
      correctIndex: 0,
      rationale:
        "Allergies and rights must be verified every administration — prior doses do not eliminate risk.",
    },
    retentionItems: [
      {
        id: "sq-r1",
        question:
          "A patient reports wheezing minutes after an SQ biologic. Priority action?",
        options: [
          "Assess airway and initiate emergency response per anaphylaxis protocol",
          "Document and continue the next scheduled dose",
          "Apply ice only to the injection site",
          "Wait 30 minutes before notifying the provider",
        ],
        correct: 0,
        rationale:
          "Respiratory symptoms after injection suggest anaphylaxis until proven otherwise — treat as emergency.",
      },
    ],
  },
  "intramuscular-injection": {
    simulationOverview:
      "Landmark-led IM practice with z-track discipline, aspiration decisions, and nerve-injury prevention — rehearse positioning before psychomotor lab.",
    clinicalRationale:
      "IM injections require adequate muscle mass, correct needle length, and axis-stable insertion to avoid sciatic or radial nerve injury.",
    flashcards: [
      {
        id: "im-f1",
        front: "Why use z-track technique for some IM injections?",
        back: "Offsets the needle track to reduce medication leakage into subcutaneous tissue and skin staining.",
      },
      {
        id: "im-f2",
        front: "When is aspiration indicated?",
        back: "Per facility policy and medication — historically for dorsogluteal; many sites no longer require routine aspiration.",
      },
      {
        id: "im-f3",
        front: "Ventrogluteal vs dorsogluteal landmark priority?",
        back: "Ventrogluteal is often preferred — farther from sciatic nerve when landmarks are correct.",
      },
      {
        id: "im-f4",
        front: "What must be documented after IM injection?",
        back: "Site, time, medication, lot if required, patient response, and education.",
      },
    ],
    errorScenario: {
      stem: "Which action risks nerve injury during IM injection?",
      options: [
        "Injecting in the dorsogluteal site without confirming landmarks",
        "Selecting ventrogluteal with validated landmarks",
        "Using needle length matched to tissue depth",
        "Stabilizing the syringe barrel during insertion",
      ],
      correctIndex: 0,
      rationale:
        "Incorrect dorsogluteal landmarking can hit the sciatic nerve — confirm landmarks or use ventrogluteal.",
    },
    retentionItems: [
      {
        id: "im-r1",
        question:
          "Patient complains of sharp leg pain radiating down the leg after dorsogluteal injection. First action?",
        options: [
          "Stop and assess neurovascular status; notify provider",
          "Massage the site vigorously",
          "Administer a second dose in the same site",
          "Document as expected soreness only",
        ],
        correct: 0,
        rationale:
          "Radiating pain may indicate nerve involvement — assess and escalate.",
      },
    ],
  },
  "foley-catheter-insertion-female": {
    simulationOverview:
      "Sterile urinary catheterization with dignity-preserving draping, urine-return confirmation before balloon inflation, and CAUTI-prevention drainage setup.",
    clinicalRationale:
      "Catheterization is indicated only when necessary. Sterile technique, correct placement confirmation, and dependent drainage reduce trauma and infection risk.",
    flashcards: [
      {
        id: "fc-f1",
        front: "When should the catheter balloon be inflated?",
        back: "Only after urine return confirms bladder placement — never inflate without confirmation.",
      },
      {
        id: "fc-f2",
        front: "What confirms correct catheter placement?",
        back: "Urine flow into the drainage bag after sterile insertion to the appropriate depth.",
      },
      {
        id: "fc-f3",
        front: "Priority if sterile technique is broken?",
        back: "Stop, discard contaminated supplies, and restart with a new sterile kit per policy.",
      },
      {
        id: "fc-f4",
        front: "Why maintain dependent drainage?",
        back: "Prevents reflux of urine into the bladder and supports CAUTI prevention bundles.",
      },
    ],
    errorScenario: {
      stem: "Which action breaks sterile technique during female catheterization?",
      options: [
        "Letting the sterile catheter touch the thigh after prep",
        "Using sterile gloves for insertion",
        "Opening the kit on a clean overbed table",
        "Explaining draping before perineal prep",
      ],
      correctIndex: 0,
      rationale:
        "Non-sterile surfaces contaminate the catheter — use a new sterile catheter if contact occurs.",
    },
    retentionItems: [
      {
        id: "fc-r1",
        question: "No urine return after catheter advancement. First action?",
        options: [
          "Assess placement, patient hydration, and orders; do not inflate balloon without confirmation",
          "Inflate the balloon to secure the catheter",
          "Force irrigation immediately",
          "Remove drapes and leave the patient",
        ],
        correct: 0,
        rationale:
          "Absence of urine requires troubleshooting — balloon inflation without placement risks urethral trauma.",
      },
      {
        id: "fc-r2",
        question: "Which factor increases CAUTI risk?",
        options: [
          "Closed drainage system breaks and bag below bladder level not maintained",
          "Documented output every shift",
          "Perineal care per protocol",
          "Early removal when no longer indicated",
        ],
        correct: 0,
        rationale:
          "Open drainage and reflux pathways introduce bacteria into the bladder.",
      },
    ],
  },
  "tracheostomy-care": {
    simulationOverview:
      "Airway patency rehearsal with inner cannula hygiene, stoma skin protection, humidification checks, and emergency algorithm readiness.",
    clinicalRationale:
      "Tracheostomy patients depend on a patent airway. Cleaning, cuff management, and suction preparedness prevent obstruction and skin breakdown.",
    flashcards: [
      {
        id: "tr-f1",
        front: "When should inner cannula cleaning or change occur?",
        back: "Per order and policy when secretions, resistance, or odor indicate — maintain spare cannula at bedside.",
      },
      {
        id: "tr-f2",
        front: "Emergency priority if trach dislodges?",
        back: "Assess airway, attempt replacement per trained protocol, call for help, and use bag-mask if cannot ventilate.",
      },
      {
        id: "tr-f3",
        front: "Why avoid excessive cuff pressure?",
        back: "Reduces tracheal mucosal perfusion and increases stenosis risk — monitor per policy.",
      },
      {
        id: "tr-f4",
        front: "Patient education focus for trach?",
        back: "Covering during cough, humidity, when to call for distress, and suction needs.",
      },
    ],
    errorScenario: {
      stem: "Which action is unsafe during routine tracheostomy care?",
      options: [
        "Cleaning the stoma without emergency supplies at the bedside",
        "Assessing breath sounds before and after care",
        "Using clean technique per policy for stoma care",
        "Coaching cough etiquette with a cover",
      ],
      correctIndex: 0,
      rationale:
        "Emergency trach supplies and algorithm readiness are mandatory whenever the airway is manipulated.",
    },
    retentionItems: [
      {
        id: "tr-r1",
        question:
          "Patient with trach has sudden desaturation and weak breath sounds. Next best action?",
        options: [
          "Assess patency, suction if indicated, call for help, and prepare emergency airway equipment",
          "Complete dressing change first",
          "Increase oxygen and reassess in one hour",
          "Document only if symptoms persist",
        ],
        correct: 0,
        rationale:
          "Acute desaturation is an airway emergency — assess and escalate immediately.",
      },
    ],
  },
  "wound-assessment-documentation": {
    simulationOverview:
      "Translate wound characteristics into measurable, legally defensible documentation with escalation triggers for infection.",
    clinicalRationale:
      "Accurate wound description drives dressing orders, antibiotic decisions, and interprofessional communication.",
    flashcards: [
      {
        id: "wa-f1",
        front: "What wound layers should be described?",
        back: "Tissue type present (epithelial, granulation, slough, eschar), depth, and edges.",
      },
      {
        id: "wa-f2",
        front: "Which drainage descriptor matters most?",
        back: "Amount, color, consistency, and odor — tied to infection surveillance.",
      },
      {
        id: "wa-f3",
        front: "When is photography appropriate?",
        back: "Per facility policy with consent and consistent lighting for serial comparison.",
      },
      {
        id: "wa-f4",
        front: "Escalation trigger example?",
        back: "Increasing erythema, purulence, fever, or malodor despite treatment.",
      },
    ],
    errorScenario: {
      stem: "Which documentation gap is highest risk?",
      options: [
        'Recording "wound looks better" without measurements or tissue description',
        "Noting drainage color and amount",
        "Including pain reassessment",
        "Stating dressing used per order",
      ],
      correctIndex: 0,
      rationale:
        "Vague notes fail to show trend — structured descriptors support clinical and legal standards.",
    },
    retentionItems: [
      {
        id: "wa-r1",
        question: "Periwound maceration is present. Clinical implication?",
        options: [
          "Moisture imbalance may delay healing — adjust dressing plan and notify provider",
          "Ignore if wound bed is pink",
          "Document only at discharge",
          "Apply occlusive plastic wrap tightly",
        ],
        correct: 0,
        rationale:
          "Maceration signals moisture management needs and possible infection risk at the margins.",
      },
    ],
  },
  "nasogastric-tube-checks": {
    simulationOverview:
      "Multi-modal NG verification before feeds or medications — never assume placement from insertion depth alone.",
    clinicalRationale:
      "Wrong-route administration into the lung is catastrophic. Use the facility's full verification stack and hold feeds when uncertain.",
    flashcards: [
      {
        id: "ng-f1",
        front: "Why measure external tube length?",
        back: "Tracks migration — compare to insertion mark and orders.",
      },
      {
        id: "ng-f2",
        front: "What symptom suggests respiratory misplacement?",
        back: "Coughing, dyspnea, decreased oxygen saturation, or asymmetric breath sounds after insertion.",
      },
      {
        id: "ng-f3",
        front: "Before enteral meds, what is mandatory?",
        back: "Placement verification per protocol — never rely on insertion alone.",
      },
      {
        id: "ng-f4",
        front: "If placement is uncertain?",
        back: "Hold feeds/meds, reassess per policy, notify provider, and obtain imaging if ordered.",
      },
    ],
    errorScenario: {
      stem: "Which practice is unsafe before an enteral medication?",
      options: [
        "Administering because the tube was placed yesterday without re-verification",
        "Checking pH or aspirate per protocol",
        "Observing for respiratory distress",
        "Securing the tube to prevent pulling",
      ],
      correctIndex: 0,
      rationale:
        "Tubes migrate — verify placement before each enteral administration per policy.",
    },
    retentionItems: [
      {
        id: "ng-r1",
        question: "pH aspirate is 5.0 before a scheduled feed. Best action?",
        options: [
          "Hold feed and verify placement per protocol — gastric pH is typically lower when correctly placed",
          "Start feed rapidly to meet calorie goals",
          "Flush with water and proceed without reassessment",
          "Remove the tube immediately without orders",
        ],
        correct: 0,
        rationale:
          "Unexpected pH warrants hold and further verification — wrong placement risks aspiration.",
      },
    ],
  },
  "focused-neurological-assessment": {
    simulationOverview:
      "Rapid neuro screening that catches deterioration early — LOC, pupils, motor, speech, and escalation thresholds.",
    clinicalRationale:
      "Neurological change may indicate stroke, hemorrhage, or metabolic crisis. Trending focused findings enables timely imaging and intervention.",
    flashcards: [
      {
        id: "fn-f1",
        front: "First component of a focused neuro check?",
        back: "Level of consciousness and orientation — AVPU or GCS per policy.",
      },
      {
        id: "fn-f2",
        front: "Unequal pupils with new headache suggest?",
        back: "Possible herniation or stroke — escalate immediately per protocol.",
      },
      {
        id: "fn-f3",
        front: "Why test motor strength in all four extremities?",
        back: "Localizes deficit and detects unilateral weakness suggesting stroke or cord injury.",
      },
      {
        id: "fn-f4",
        front: "When to activate rapid stroke protocol?",
        back: "Sudden focal deficit, speech change, or altered LOC — per facility algorithm and last-known-well time.",
      },
    ],
    errorScenario: {
      stem: "Which finding requires immediate escalation?",
      options: [
        "New unilateral facial droop and slurred speech",
        "Stable chronic neuropathy with unchanged grip strength",
        "Patient reports mild fatigue after therapy",
        "Baseline myopia with equal pupils",
      ],
      correctIndex: 0,
      rationale:
        "Acute focal neuro signs suggest stroke — time-critical escalation.",
    },
    retentionItems: [
      {
        id: "fn-r1",
        question: "Patient is oriented ×1 with new left arm drift. Priority?",
        options: [
          "Activate stroke protocol and notify provider immediately",
          "Recheck in four hours",
          "Document and continue routine care only",
          "Offer sleep medication first",
        ],
        correct: 0,
        rationale:
          "Focal weakness with altered orientation is an emergency until ruled out.",
      },
    ],
  },
};

const DEFAULT_STEP_PATCH: StepPatch = {
  rationale:
    "Each deliberate step protects patient safety and supports accurate documentation.",
  bedsideTip:
    "Explain what you are doing before touch — predictability reduces anxiety.",
  safetyWarning:
    "Stop and reassess if the patient reports unexpected pain, bleeding, or distress.",
  commonError:
    "Rushing past verification steps to save time — most harm events trace to skipped checks.",
  recallPrompt: "What could go wrong if this step were skipped?",
};

function mergeSteps(
  skill: ClinicalSkillDefinition,
  patches?: StepPatch[],
): EnrichedClinicalSkillStep[] {
  return skill.steps.map((step, i) => ({
    ...step,
    ...DEFAULT_STEP_PATCH,
    ...(patches?.[i] ?? {}),
  }));
}

function generatedFlashcards(
  skill: ClinicalSkillDefinition,
): ClinicalSkillFlashcard[] {
  const domain = skill.competencyDomain ?? skill.title;
  const focus = skill.simulationFocus ?? skill.summary;
  return [
    {
      id: `${skill.slug}-auto-focus`,
      front: `What is the main bedside risk in ${skill.title}?`,
      back: `The key risk is ${focus}. Safe practice starts with identifying whether the patient is stable enough to proceed or needs escalation.`,
    },
    {
      id: `${skill.slug}-auto-first`,
      front: `What should the nurse verify before ${skill.title}?`,
      back: "Confirm patient identity, relevant orders or policy, allergies or contraindications, baseline status, and whether the action fits the nurse's role and setting.",
    },
    {
      id: `${skill.slug}-auto-assessment`,
      front: `Which assessment question guides ${skill.title}?`,
      back: "Ask: what finding would make this unsafe to continue right now? That question keeps the skill tied to patient safety instead of rote task completion.",
    },
    {
      id: `${skill.slug}-auto-stop`,
      front: `When should ${skill.title} be paused or escalated?`,
      back: "Pause when there is unexpected pain, respiratory distress, bleeding, altered mental status, contamination, device failure, or a mismatch between the order and patient condition.",
    },
    {
      id: `${skill.slug}-auto-document`,
      front: `What documentation matters after ${skill.title}?`,
      back: "Chart the assessment, action performed, patient response, teaching, safety concerns, notifications, and follow-up plan.",
    },
    {
      id: `${skill.slug}-auto-communication`,
      front: `How does communication protect the patient during ${skill.title}?`,
      back: "Clear explanation, closed-loop requests, and timely escalation prevent missed cues and help the care team respond before deterioration becomes harder to reverse.",
    },
    {
      id: `${skill.slug}-auto-error`,
      front: `What is a common novice error in ${domain}?`,
      back: "Moving directly to the task before checking stability, indications, and safety constraints. Assessment and verification come before implementation.",
    },
    {
      id: `${skill.slug}-auto-transfer`,
      front: `How does ${skill.title} transfer to exam questions?`,
      back: "Choose the option that protects airway, breathing, circulation, safety, infection prevention, and timely escalation before convenience or routine completion.",
    },
    {
      id: `${skill.slug}-auto-retention`,
      front: `What should be remembered one week from now about ${skill.title}?`,
      back: "The safest nurse notices the cue that changes priority, explains the risk, performs the skill deliberately, and reassesses the patient response.",
    },
    {
      id: `${skill.slug}-auto-principle`,
      front: `Which nursing principle anchors ${skill.title}?`,
      back: "Assessment before implementation, least-risk action first, patient-centered communication, and documentation that proves the safety loop was closed.",
    },
  ];
}

function generatedRetentionItems(
  skill: ClinicalSkillDefinition,
): ClinicalSkillRetentionItem[] {
  const focus = skill.simulationFocus ?? skill.summary;
  return [
    {
      id: `${skill.slug}-retention-1`,
      question: `During ${skill.title}, which response best shows safe nursing judgment?`,
      options: [
        "Pause to reassess unexpected findings before continuing the skill",
        "Finish quickly so the task is not delayed",
        "Ask another learner to decide without giving a report",
        "Document only after the end of the shift",
      ],
      correct: 0,
      rationale: `Unexpected findings tied to ${focus} can change the priority. A safe nurse reassesses, escalates when needed, and then continues only when the patient condition supports it.`,
    },
    {
      id: `${skill.slug}-retention-2`,
      question: `Which documentation pattern is strongest after ${skill.title}?`,
      options: [
        "Assessment, action, patient response, teaching, and follow-up plan",
        "Only the time the task was completed",
        "A vague note that the patient tolerated care",
        "A note copied from the previous shift",
      ],
      correct: 0,
      rationale:
        "Documentation should show the clinical reasoning trail: what was assessed, what was done, how the patient responded, and what needs follow-up.",
    },
    {
      id: `${skill.slug}-retention-3`,
      question: `What makes ${skill.title} more than a checklist task?`,
      options: [
        "The nurse uses patient cues to decide whether to continue, modify, or escalate",
        "The nurse memorizes the steps without reassessment",
        "The nurse waits for the next shift to evaluate outcomes",
        "The nurse avoids patient teaching to save time",
      ],
      correct: 0,
      rationale:
        "Clinical skills become professional nursing practice when the nurse connects each step to patient condition, safety risk, and response.",
    },
  ];
}

export function getClinicalSkillEnrichment(
  skill: ClinicalSkillDefinition,
): ClinicalSkillEnrichment {
  const pack = ENRICHMENT[skill.slug];
  if (!pack) {
    return {
      simulationOverview: `Work through ${skill.title} as a bedside competency simulation focused on ${skill.simulationFocus ?? skill.summary}.`,
      clinicalRationale: `This skill belongs to ${skill.competencyDomain ?? "clinical practice"} and should be practiced as patient-safety reasoning, not task memorization. The learner should verify the context, assess for instability, perform the action deliberately, recognize unsafe variation, and document the response.`,
      steps: mergeSteps(skill),
      flashcards: generatedFlashcards(skill),
      errorScenario: {
        stem: "Which action most threatens patient safety during this procedure?",
        options: [
          "Skipping identity and order verification",
          "Using facility-approved supplies",
          "Documenting patient response",
          "Providing privacy during the procedure",
        ],
        correctIndex: 0,
        rationale:
          "Rights and verification prevent wrong-patient and wrong-procedure events.",
      },
      retentionItems: generatedRetentionItems(skill),
    };
  }

  return {
    simulationOverview: pack.simulationOverview,
    clinicalRationale: pack.clinicalRationale,
    steps: mergeSteps(skill, pack.stepPatches),
    flashcards: [...pack.flashcards, ...generatedFlashcards(skill)].slice(
      0,
      10,
    ),
    errorScenario: pack.errorScenario,
    retentionItems: [
      ...pack.retentionItems,
      ...generatedRetentionItems(skill),
    ].slice(0, 3),
  };
}

export function sequencingLabelsForSkill(
  skill: ClinicalSkillDefinition,
): string[] {
  return skill.steps.map((s) => s.title);
}
