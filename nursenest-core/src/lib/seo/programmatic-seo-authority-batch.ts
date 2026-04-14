/**
 * Batch of nursing + NCLEX authority programmatic pages (comparisons, condition guides, symptom patterns).
 * Merged into `PROGRAMMATIC_SEO_PAGES` — run `npm run validate:programmatic-seo` after edits.
 *
 * Add future batches here or in a new module; use `scripts/programmatic-seo-batch-dry-run.ts` to check slugs.
 */
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

const SITE = "NurseNest";

export const PROGRAMMATIC_SEO_AUTHORITY_BATCH_SLUGS: string[] = [
  "siadh-vs-diabetes-insipidus-nclex",
  "dka-vs-hhs-nclex-comparison",
  "hyperkalemia-vs-hypokalemia-nclex",
  "copd-nclex-clinical-guide",
  "sepsis-nclex-early-recognition",
  "pe-vs-dvt-nclex-comparison",
  "acute-kidney-injury-nclex-guide",
  "left-vs-right-heart-failure-nclex",
];

export const PROGRAMMATIC_SEO_AUTHORITY_BATCH: SeoPageDefinition[] = [
  {
    slug: "siadh-vs-diabetes-insipidus-nclex",
    title: "SIADH vs Diabetes Insipidus | NCLEX Fluid & Sodium Guide",
    description:
      "Side-by-side SIADH vs DI for NCLEX: sodium, urine osmolality, fluids, and traps. Clinical reasoning for RN candidates with comparison table and pearls.",
    h1: "SIADH vs diabetes insipidus: NCLEX comparison",
    cluster: "study-guide",
    pageKind: "comparison",
    keywords: ["SIADH", "diabetes insipidus", "NCLEX", "sodium", "ADH"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/nursing-lab-values-study-guide",
      currentLabel: "SIADH vs DI",
    },
    comparisonTable: {
      caption: "Quick comparison (typical teaching frames; always match the stem)",
      columns: ["Feature", "SIADH", "Diabetes insipidus (central/nephrogenic themes)"],
      rows: [
        ["Primary problem", "Excess water retention / ADH effect", "Deficient ADH action or renal response (context-dependent)"],
        ["Serum sodium", "Often low (dilutional)", "Often high (water loss) when unchecked"],
        ["Urine osmolality / concentration", "Relatively concentrated urine for serum Na", "Dilute urine with inability to concentrate (classic teaching)"],
        ["Fluid priority (exam framing)", "Restrict fluids; treat cause; avoid rapid overcorrection", "Replace water losses; address cause; monitor Na correction rate"],
      ],
    },
    sections: [
      {
        heading: "Why this comparison shows up on the NCLEX",
        level: 2,
        body: [
          "Both disorders disturb fluid and sodium balance, but the pathophysiology and safest nursing actions point in opposite directions. Items test whether you can match assessment findings to the underlying mechanism, not whether you memorized a single lab cut-off.",
          "The stem will usually give you sodium, urine concentration clues, neuro status, volume clues, or a medication (e.g. vasopressin, diuretics, lithium). Your job is to identify which pattern fits before choosing an intervention.",
        ],
      },
      {
        heading: "Clinical relevance: assessment and safety",
        level: 2,
        body: [
          "Neurologic changes from sodium shifts are a safety priority. Rapid correction of chronic hyponatremia can cause osmotic demyelination; overly aggressive free water replacement in hypernatremic states has its own risks—follow the scenario’s monitoring plan.",
          "Pair vitals, intake and output, daily weights, and neuro checks with the fluid order. When two answers look partially correct, choose the option that matches the patient’s volume status and the disorder’s mechanism in the stem.",
        ],
      },
      {
        heading: "NCLEX tips: traps and prioritization",
        level: 2,
        body: [
          "Do not pick fluid boluses for SIADH when the stem describes euvolemic hyponatremia without hypovolemic shock—context drives the correct fluid strategy.",
          "For DI-style presentations, wrong answers often confuse “give diuretics” or “restrict all fluids” without evidence of overload. Read whether the priority is replacement, cause treatment, or monitoring.",
          `${SITE} pairs pathway-scoped questions with lessons so your language stays aligned with RN clinical judgment expectations.`,
        ],
      },
    ],
    faq: [
      {
        question: "Is urine output alone enough to decide SIADH vs DI?",
        answer:
          "No—combine serum sodium, urine concentration clues, volume assessment, and history. NCLEX items usually give multiple data points on purpose.",
      },
      {
        question: "Should I memorize exact osmolality numbers?",
        answer:
          "Know directional patterns and what they imply for nursing priorities. Exact thresholds matter less than consistent reasoning from the stem.",
      },
    ],
  },
  {
    slug: "dka-vs-hhs-nclex-comparison",
    title: "DKA vs HHS | NCLEX Metabolic Emergency Comparison",
    description:
      "DKA vs HHS for NCLEX: glucose bands, ketones, fluids, insulin, and monitoring. Nursing-focused comparison with exam traps and clinical relevance.",
    h1: "DKA vs HHS: NCLEX metabolic emergencies",
    cluster: "study-guide",
    pageKind: "comparison",
    keywords: ["DKA", "HHS", "NCLEX", "hyperglycemia", "insulin"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/medication-calculation-nursing-guide",
      currentLabel: "DKA vs HHS",
    },
    comparisonTable: {
      caption: "High-yield contrasts (teaching frames; match your item)",
      columns: ["Feature", "DKA (common teaching)", "HHS (common teaching)"],
      rows: [
        ["Ketosis / acidosis", "Ketosis prominent; metabolic acidosis typical", "Often minimal ketosis; hyperosmolar state more central"],
        ["Glucose", "Very high (variable)", "Often extremely high with hyperosmolarity"],
        ["Onset / population cues", "Often T1DM context; can be rapid", "Often T2DM; insidious dehydration theme"],
        ["Initial nursing priorities", "Airway if altered; fluids + insulin per protocol; frequent monitoring", "Fluids + gradual correction; frequent electrolyte and osmolar monitoring"],
      ],
    },
    sections: [
      {
        heading: "How NCLEX frames DKA vs HHS",
        level: 2,
        body: [
          "Questions reward recognition of the emergent pattern: mental status change, dehydration, K+ shifts, and what to monitor first while therapy starts. You are expected to know that insulin and fluids are not interchangeable priorities—the stem decides.",
          "Both conditions can look like “high glucose,” but ketosis, acid-base status, and osmolarity clues separate the pathways in board-style items.",
        ],
      },
      {
        heading: "Clinical relevance: monitoring and teamwork",
        level: 2,
        body: [
          "Potassium moves with insulin and fluid therapy—monitor per protocol and know why repeat labs exist. Cardiac monitoring may be indicated when electrolytes are shifting quickly.",
          "Clear communication with provider and bedside team about rate changes, repeat glucose, and neuro status protects patients during high-risk correction phases.",
        ],
      },
      {
        heading: "NCLEX traps: wrong answers students pick",
        level: 2,
        body: [
          "Giving large insulin boluses without addressing fluid status and electrolytes when the stem emphasizes hypovolemic shock patterns.",
          "Ignoring potassium before or during insulin therapy when the scenario provides a low or borderline K+.",
          "Choosing oral hypoglycemics as first-line rescue for acute severe hyperglycemic crisis presentations when the stem describes inpatient stabilization.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need to memorize exact glucose cutoffs?",
        answer:
          "Know the clinical picture and priorities. Boards test safe sequencing and monitoring more than a single numeric threshold.",
      },
      {
        question: "What if the stem mixes DKA and infection?",
        answer:
          "Treat life threats first, follow sepsis and glycemic protocols in parallel when indicated, and monitor closely—prioritization questions are common.",
      },
    ],
  },
  {
    slug: "hyperkalemia-vs-hypokalemia-nclex",
    title: "Hyperkalemia vs Hypokalemia | NCLEX Electrolyte Guide",
    description:
      "Compare high vs low potassium for NCLEX: ECG cues, causes, nursing actions, and traps. Symptom patterns with exam-focused clinical relevance.",
    h1: "Hyperkalemia vs hypokalemia for NCLEX",
    cluster: "study-guide",
    pageKind: "symptom-guide",
    keywords: ["hyperkalemia", "hypokalemia", "NCLEX", "potassium", "ECG"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/nursing-lab-values-study-guide",
      currentLabel: "K+ high vs low",
    },
    comparisonTable: {
      caption: "ECG and priority themes (not a substitute for telemetry interpretation)",
      columns: ["Theme", "Hyperkalemia (teaching)", "Hypokalemia (teaching)"],
      rows: [
        ["Classic ECG teaching", "Peaked T waves → widening → sine wave (severe)", "U waves, flattened T waves, arrhythmia risk"],
        ["Common contributors", "Renal excretion issues, meds, tissue shifts (context)", "GI losses, diuretics, shifts (context)"],
        ["Nursing focus", "Protect rhythm; follow acute protocols; prevent rebound", "Replace per order; monitor levels; prevent overcorrection"],
      ],
    },
    sections: [
      {
        heading: "Why potassium is a favorite NCLEX topic",
        level: 2,
        body: [
          "Potassium shifts affect cardiac conduction quickly. Items often pair a lab value with rhythm risk, muscle weakness, GI losses, or medications (diuretics, ACE inhibitors, potassium supplements).",
          "Your task is not only to name high vs low, but to choose the safest next action: assessment, hold/give per order, monitoring, and escalation when unstable.",
        ],
      },
      {
        heading: "Clinical relevance: assessment clusters",
        level: 2,
        body: [
          "Always correlate K+ with renal function, acid-base status, and medications in the stem. A ‘normal’ repeat value can still be dangerous if the trend is accelerating or the patient is symptomatic.",
          "Teach patients signs to report (palpitations, weakness, cramping) when they are on therapies that swing potassium.",
        ],
      },
      {
        heading: "NCLEX tips: prioritize stability",
        level: 2,
        body: [
          "If the patient is unstable with a life-threatening rhythm picture, stabilization and protocol-driven therapy beat slow outpatient teaching answers.",
          "Avoid picking oral replacement alone when the stem describes critical instability or provider orders for emergent correction pathways.",
        ],
      },
    ],
    faq: [
      {
        question: "Should I always treat the number first?",
        answer:
          "Treat the patient. Stabilize life threats, follow orders and protocols, and use labs to guide monitoring—not isolated chasing of a single value.",
      },
      {
        question: "How do I choose between similar medication answers?",
        answer:
          "Match mechanism to the stem’s cause (loss vs shift vs renal) and the provider’s route and acuity level.",
      },
    ],
  },
  {
    slug: "copd-nclex-clinical-guide",
    title: "COPD Pathophysiology NCLEX: O2, CO2 & Exacerbation Care",
    description:
      "COPD NCLEX tests airflow, gas exchange, O₂ vs CO₂ retention, and infection flares—not definitions alone. Learn stem patterns and the trap: reassuring SpO₂ while work of breathing or mentation worsens.",
    h1: "COPD clinical guide for NCLEX nursing",
    cluster: "study-guide",
    pageKind: "condition-guide",
    keywords: ["COPD pathophysiology NCLEX", "COPD NCLEX oxygen", "COPD", "NCLEX", "respiratory"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/respiratory-nursing-practice-questions",
      currentLabel: "COPD guide",
    },
    sections: [
      {
        heading: "What NCLEX expects for COPD patients",
        level: 2,
        body: [
          "Start with a three-step read: infection or flare clues, work of breathing and mentation, then oxygenation and ventilation context—teaching answers lose when the stem is unstable.",
          "Exacerbation frames add sputum, fever, or sudden confusion; match escalation and monitoring to that story instead of defaulting to generic COPD teaching.",
        ],
      },
      {
        heading: "Clinical relevance: teaching and monitoring",
        level: 2,
        body: [
          "Teach inhaler technique, energy conservation, infection warning signs, and when to seek care. Pair education with measurable follow-up where the scenario allows.",
          "Monitor work of breathing, mental status, and oxygenation per order; know why repeat ABG or vitals are requested in specific contexts.",
        ],
      },
      {
        heading: "NCLEX traps on respiratory items",
        level: 2,
        body: [
          "High-flow oxygen in contexts where the stem suggests CO₂ retention risk without addressing ventilation—choose the answer that matches the scenario’s emphasis and orders.",
          "Choosing activity without addressing airway infection or hypoxia when the stem points to acute worsening.",
          `${SITE} respiratory practice sets help you rehearse prioritization with rationales tied to clinical judgment.`,
        ],
      },
    ],
    faq: [
      {
        question: "Is COPD the same as chronic bronchitis vs emphysema on the exam?",
        answer:
          "Items may use COPD broadly; focus on the patient’s acute needs, oxygenation pattern, and infection signs in the stem.",
      },
      {
        question: "Do I need detailed vent settings for NCLEX?",
        answer:
          "Know when escalation belongs in ICU contexts when the stem provides that environment; otherwise focus on nursing assessment and ordered therapies.",
      },
    ],
  },
  {
    slug: "sepsis-nclex-early-recognition",
    title: "Sepsis NCLEX Guide | Early Recognition & Priorities",
    description:
      "Sepsis recognition for NCLEX: infection cues, perfusion, lactate themes, and nursing priorities. Exam-focused guide with safety emphasis.",
    h1: "Sepsis early recognition for NCLEX",
    cluster: "study-guide",
    pageKind: "condition-guide",
    keywords: ["sepsis", "NCLEX", "infection", "perfusion", "prioritization"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/med-surg-nursing-practice-questions",
      currentLabel: "Sepsis guide",
    },
    sections: [
      {
        heading: "How sepsis appears in NCLEX-style cases",
        level: 2,
        body: [
          "You will see infection sources (lung, urine, skin), systemic responses (fever or hypothermia, tachycardia, hypotension), and perfusion/mental status changes. The exam tests early escalation and coordinated care—not a single antibiotic name in isolation.",
          "Lactate and blood pressure abnormalities may appear as clues to tissue hypoperfusion depending on the scenario’s level of detail.",
        ],
      },
      {
        heading: "Clinical relevance: nursing priorities",
        level: 2,
        body: [
          "Airway, breathing, circulation, and rapid provider communication form the backbone. Obtain cultures and therapies as ordered, monitor trends, and reassess frequently during early resuscitation phases described in the stem.",
          "Document objective changes clearly; sepsis care is time-sensitive and team-dependent.",
        ],
      },
      {
        heading: "NCLEX tips: avoid delayed escalation answers",
        level: 2,
        body: [
          "Wrong options often delay reporting abnormal vitals, postpone provider notification, or focus on non-urgent tasks when the stem describes instability.",
          "Choose the intervention that matches the patient’s immediate risk and the nurse’s scope in the scenario.",
        ],
      },
    ],
    faq: [
      {
        question: "Will every sepsis question include SIRS wording?",
        answer:
          "No—focus on infection plus systemic compromise patterns in the data you are given.",
      },
      {
        question: "What if two answers both sound medical?",
        answer:
          "Pick the nursing action that protects life first and aligns with assessment findings and orders.",
      },
    ],
  },
  {
    slug: "pe-vs-dvt-nclex-comparison",
    title: "PE vs DVT NCLEX | Clots, Symptoms & Nursing Care",
    description:
      "Compare pulmonary embolism and DVT for NCLEX: presentation cues, risk, anticoagulation themes, and monitoring. Side-by-side reasoning for RN exams.",
    h1: "PE vs DVT: NCLEX comparison",
    cluster: "study-guide",
    pageKind: "comparison",
    keywords: ["PE", "DVT", "NCLEX", "VTE", "anticoagulation"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/cardiovascular-nursing-practice-questions",
      currentLabel: "PE vs DVT",
    },
    comparisonTable: {
      caption: "Pattern contrasts (simplified for study)",
      columns: ["Feature", "DVT (limb vein thrombosis)", "PE (pulmonary vascular obstruction)"],
      rows: [
        ["Primary location", "Deep veins (often leg)", "Pulmonary arterial circulation"],
        ["Classic symptom themes", "Unilateral swelling, pain, warmth (context)", "Sudden dyspnea, pleuritic pain, hypoxia (context)"],
        ["Nursing monitoring focus", "Limb neurovascular checks; bleeding risk on anticoagulation", "Respiratory and hemodynamic monitoring; bleeding risk on therapy"],
      ],
    },
    sections: [
      {
        heading: "Why PE and DVT are linked on exams",
        level: 2,
        body: [
          "They are part of the venous thromboembolism spectrum. A DVT can embolize to the lungs; NCLEX may test recognition, prevention, education, and safe anticoagulation monitoring.",
          "Items often embed risk factors (immobility, surgery, estrogen therapy) to help you justify prophylaxis or teaching emphasis.",
        ],
      },
      {
        heading: "Clinical relevance: bleeding vs clotting balance",
        level: 2,
        body: [
          "Anticoagulation reduces clot risk but increases bleeding risk—teach bleeding precautions and what to report. Assess for hemodynamic compromise when PE is suspected.",
          "Early escalation beats ‘wait and see’ when the stem describes sudden respiratory collapse or unstable vitals.",
        ],
      },
      {
        heading: "NCLEX traps",
        level: 2,
        body: [
          "Massaging a painful calf when DVT is suspected—unsafe in real practice and a common wrong answer theme.",
          "Ignoring oxygen and monitoring when the stem describes acute respiratory distress.",
        ],
      },
    ],
    faq: [
      {
        question: "Will the exam require naming a specific imaging test?",
        answer:
          "Sometimes the stem implies diagnostics; prioritize nursing assessment, safety, and ordered workflows over guessing radiology details not provided.",
      },
      {
        question: "Is travel teaching always the right answer?",
        answer:
          "Only when prevention and patient education match the scenario’s focus and risk profile.",
      },
    ],
  },
  {
    slug: "acute-kidney-injury-nclex-guide",
    title: "Acute Kidney Injury NCLEX Guide | Labs & Nursing Care",
    description:
      "AKI guide for NCLEX: creatinine trends, urine output, fluids, nephrotoxins, and monitoring. Condition-focused content for RN clinical judgment.",
    h1: "Acute kidney injury NCLEX guide",
    cluster: "study-guide",
    pageKind: "condition-guide",
    keywords: ["AKI", "acute kidney injury", "NCLEX", "creatinine", "renal"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/nursing-lab-values-study-guide",
      currentLabel: "AKI guide",
    },
    sections: [
      {
        heading: "How NCLEX tests AKI",
        level: 2,
        body: [
          "You will see creatinine changes, oliguria, fluid overload, electrolyte problems, or medication accumulation. The exam rewards trend recognition and harm reduction: hold nephrotoxins when ordered, monitor I/O, and watch for hyperkalemia.",
          "Prerenal, intrinsic, and postrenal frames may appear indirectly through scenario clues rather than labels.",
        ],
      },
      {
        heading: "Clinical relevance: fluid and medication safety",
        level: 2,
        body: [
          "Fluid resuscitation vs restriction depends on the stem’s volume status and provider orders—do not assume one-size-fits-all fluids.",
          "Anticipate dietary modifications, medication adjustments, and patient education about avoiding NSAIDs or contrast when relevant to the scenario.",
        ],
      },
      {
        heading: "NCLEX tips",
        level: 2,
        body: [
          "Choose dialysis-related answers only when the stem indicates that level of acuity or provider plan.",
          "Prioritize life threats like symptomatic hyperkalemia when presented with instability and supporting data.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need to memorize every AKI staging number?",
        answer:
          "Know the clinical pattern: rising creatinine, urine output changes, and what to monitor. Exact staging may not be required unless the stem provides it.",
      },
      {
        question: "What if infection and AKI appear together?",
        answer:
          "Address sepsis and renal injury in parallel per orders; prioritize unstable vitals and provider communication.",
      },
    ],
  },
  {
    slug: "left-vs-right-heart-failure-nclex",
    title: "Left vs Right Heart Failure | NCLEX Comparison",
    description:
      "Compare left- and right-sided HF for NCLEX: congestion patterns, assessment, and interventions. Distinct from general HF review—side-by-side exam focus.",
    h1: "Left-sided vs right-sided heart failure",
    cluster: "study-guide",
    pageKind: "comparison",
    keywords: ["heart failure", "left vs right", "NCLEX", "congestion", "assessment"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX study guides",
      midPath: "/heart-failure-nclex-review",
      currentLabel: "Left vs right HF",
    },
    comparisonTable: {
      caption: "Typical teaching patterns (match the patient in the stem)",
      columns: ["Feature", "Left-sided HF themes", "Right-sided HF themes"],
      rows: [
        ["Congestion emphasis", "Pulmonary congestion, crackles, orthopnea (context)", "Systemic venous congestion, peripheral edema, JVD (context)"],
        ["Assessment focus", "Oxygenation, lung sounds, activity tolerance", "Fluid retention, hepatic congestion signs, weight gain patterns"],
        ["Intervention framing", "Reduce preload/afterload per orders; monitor respiratory status", "Diuresis and fluid balance; monitor perfusion and electrolytes"],
      ],
    },
    sections: [
      {
        heading: "Why sides matter on the NCLEX",
        level: 2,
        body: [
          "The same umbrella diagnosis can present with different dominant findings. Items test whether you target assessment and teaching to the patient’s congestion pattern and perfusion status.",
          "Many patients have mixed pictures—choose the answer that matches the stem’s emphasis, not a textbook-only label.",
        ],
      },
      {
        heading: "Clinical relevance",
        level: 2,
        body: [
          "Daily weights, strict I/O when ordered, lung and peripheral assessments, and medication teaching (diuretics, beta blockers, ACE inhibitors) appear frequently. Know what symptom should trigger urgent escalation.",
          "Activity planning should align with oxygenation and fatigue—avoid generic ‘push through’ advice when the stem shows limited reserve.",
        ],
      },
      {
        heading: "NCLEX traps",
        level: 2,
        body: [
          "Choosing interventions for the wrong congestion pattern when the stem clearly highlights pulmonary vs systemic signs.",
          "Ignoring medication side effects that explain new weakness, cough, or electrolyte shifts.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this different from the general heart failure review page?",
        answer:
          "Yes—this page emphasizes side-specific assessment patterns; use both resources without assuming identical answers across unrelated stems.",
      },
      {
        question: "Do I need invasive hemodynamic values?",
        answer:
          "Only when the scenario provides them—most NCLEX items stay at bedside assessment and ordered therapy level.",
      },
    ],
  },
];
