/**
 * Programmatic SEO definitions: single source for routes, metadata, sitemap, and internal links.
 * Add new entries here to scale indexable pages without new route files.
 *
 * **Rendering:** Routes use on-demand ISR (`generateStaticParams` returns `[]`, `revalidate` set on the page).
 * Do not prerender a full slug×locale matrix at build time.
 *
 * **Sitemap:** `MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS` bounds bulk URL emission (see `sitemap-static-xml.ts`).
 *
 * **Scaling content (no thin/duplicate pages):**
 * - Each entry must stand alone: distinct H1, meta description, and multiple substantive sections and/or FAQ.
 * - Prefer **topic guides** and **study plans** with actionable structure; avoid near-duplicates of existing slugs.
 * - AI-assisted drafts should be validated with `npm run validate:programmatic-seo` before merge.
 * - Per-question marketing URLs at huge scale belong in a separate, data-backed system (exam items + allowlists),
 *   not copy-pasted templates — see product architecture docs.
 *
 * **Public URLs:** `/{slug}` (rewritten to `/seo/[slug]`). Localized: `/{locale}/{slug}`. Canonical + hreflang via
 * `buildProgrammaticMetadata`. JSON-LD: `ProgrammaticPageJsonLd` (LearningResource + optional FAQPage).
 */
import type { SeoPageKind } from "@/lib/seo/programmatic-page-kind";

/** Matches `revalidate` on `/seo/[slug]` and `/[locale]/[slug]` programmatic pages (24h ISR). */
export const PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS = 86_400;

/** Internal “related” / cross-cluster links per page (bounded; no full-registry scans in UI). */
export const MAX_RELATED_PROGRAMMATIC_LINKS = 6;
export const MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS = 6;

/** Hard cap for sitemap + locale sitemap loops over programmatic slugs (safety rail if the array grows). */
export const MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS = 2_000;

export type SeoCluster =
  | "exam-nclex"
  | "exam-pn"
  | "exam-np"
  | "allied"
  | "category"
  | "hub"
  | "study-format"
  /** Shared cluster for lab, pharmacology, prioritization, and study plan guides */
  | "study-guide";

export type SeoPageDefinition = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  cluster: SeoCluster;
  /** Optional taxonomy for pipelines and quality gates (see `programmatic-page-kind.ts`). */
  pageKind?: SeoPageKind;
  /** Primary keyword phrase for related linking */
  keywords: string[];
  sections: { heading: string; level: 2 | 3; body: string[] }[];
  faq?: { question: string; answer: string }[];
  /** Optional 3-level breadcrumb: Home → hub → current */
  breadcrumb?: { midLabel: string; midPath: string; currentLabel: string };
  /** Render practice conversion blocks (see `programmatic-practice-config.ts`) */
  practiceConversion?: boolean;
  /**
   * Optional pathway pack for product links (lessons, questions, test bank, CAT, tools, flashcards).
   * When omitted, links are inferred from `cluster` for exam pages, otherwise general test bank routing applies.
   */
  linkPack?: "nclex-rn" | "nclex-pn" | "np" | "allied" | "general";
  /**
   * Optional comparison table for “X vs Y” pages. Rendered after the first section body
   * (explanation first, then table, then remaining sections).
   */
  comparisonTable?: {
    caption?: string;
    columns: string[];
    rows: string[][];
  };
};

const SITE = "NurseNest";

/**
 * Authority programmatic pages (inlined on purpose): `next.config.ts` imports this file. A sibling module
 * import (`./programmatic-seo-authority-batch`) can fail when Next compiles the config (MODULE_NOT_FOUND for
 * `./src/lib/seo/programmatic-seo-authority-batch`). Keeping the batch here avoids a second resolve step.
 */
const PROGRAMMATIC_SEO_AUTHORITY_BATCH: SeoPageDefinition[] = [
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

export const PROGRAMMATIC_SEO_AUTHORITY_BATCH_SLUGS: string[] = PROGRAMMATIC_SEO_AUTHORITY_BATCH.map((p) => p.slug);


export const PROGRAMMATIC_SEO_PAGES: SeoPageDefinition[] = [
  {
    slug: "nclex-rn-practice-questions",
    title: "NCLEX-RN Practice Questions | Rationales and Weak-Area Feedback",
    description:
      "Practice NCLEX-style questions and see where you lose marks. Rationales, client-need categories, and score feedback for US and Canadian RN candidates.",
    h1: "NCLEX-RN practice questions",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "practice questions", "RN"],
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Practice questions",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "What makes NCLEX-RN practice different from reading alone",
        level: 2,
        body: [
          "The exam rewards judgment under time pressure, not recognition from notes. Questions force you to commit, then the rationale shows whether your rule matched the board’s rule.",
          `${SITE} keeps items pathway-scoped so you are not training on RN noise if your authorization does not include it.`,
        ],
      },
      {
        heading: "When to add lessons and mocks",
        level: 2,
        body: [
          "When a category keeps flagging weak, pair that block with a lesson on the same system, then return to questions within a few days.",
          "When rolling accuracy holds steady for two weeks, sit timed practice exams to test stamina, not just knowledge.",
        ],
      },
    ],
    faq: [
      {
        question: "Are NCLEX-RN practice questions aligned to the current test plan?",
        answer:
          "Items target clinical judgment and safety emphasis consistent with NCLEX-style preparation. Always confirm details with your regulatory body’s latest bulletin.",
      },
      {
        question: "Can Canadian RN candidates use the same bank as US candidates?",
        answer:
          "Content is filtered by country and pathway so you see items appropriate to your registration context.",
      },
    ],
  },
  {
    slug: "nclex-rn-test-bank",
    title: "NCLEX-RN Test Bank | Timed Sets & Category Breakdowns",
    description:
      "Access a structured NCLEX-RN test bank with category performance views, ideal for weekly readiness checks before your authorization to test.",
    h1: "NCLEX-RN test bank for disciplined, data-driven study",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "test bank"],
    sections: [
      {
        heading: "What a test bank should measure",
        level: 2,
        body: [
          "A strong RN test bank exposes gaps across physiological adaptation, pharmacology, and reduction of risk, without letting you hide in one comfort topic.",
          `${SITE} surfaces category trends so you can rebalance study time toward domains that move your probability of success.`,
        ],
      },
      {
        heading: "From test bank to mock exam",
        level: 2,
        body: [
          "Once weekly test bank scores plateau, transition to full-length mock exams to rehearse stamina and pacing. Review every flagged item with rationale depth.",
        ],
      },
    ],
  },
  {
    slug: "nclex-rn-exam-prep",
    title: "NCLEX-RN Exam Prep | Lessons, Questions, and Mocks",
    description:
      "Combine lessons, practice questions, and mock exams in one NCLEX-RN exam prep workflow, built for Canada and the United States.",
    h1: "NCLEX-RN exam prep that connects lessons to assessment",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "exam prep"],
    sections: [
      {
        heading: "An integrated prep loop",
        level: 2,
        body: [
          "Exam prep works best as a loop: learn a concept, apply it under question pressure, then consolidate with a mock exam section.",
          `${SITE} keeps your question bank, lessons, and practice exams in one place so you do not lose days context-switching tools.`,
        ],
      },
    ],
  },
  {
    slug: "nclex-rn-lessons",
    title: "NCLEX-RN Lessons | Structured Modules Before the Question Bank",
    description:
      "How to use pathway RN lessons with NCLEX-style practice: sequencing modules, pairing weak systems with question sets, and avoiding passive video-only study.",
    h1: "NCLEX-RN lessons that connect to your question sessions",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "lessons", "study modules"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Lessons",
    },
    sections: [
      {
        heading: "Why lessons belong before isolated drills",
        level: 2,
        body: [
          "If you only grind questions, you can memorize distractor patterns without fixing the underlying rule. Short lesson blocks rebuild the rule, then questions test whether you can apply it under time pressure.",
          "Use lessons when category accuracy stays flat for two weeks despite more reps. Usually that is a concept gap, not a volume gap.",
        ],
      },
      {
        heading: "Sample study cadence",
        level: 2,
        body: [
          "Monday: one lesson section on the weak system. Tuesday–Thursday: two timed mini-sets tagged to that system. Friday: review rationales only on misses, then one mixed set.",
          "Keep lessons and questions in the same pathway so scope and delegation language stay consistent with your registration.",
        ],
      },
      {
        heading: "Where to go next",
        level: 2,
        body: [
          `Pair this cadence with ${SITE} NCLEX-RN practice questions when you are ready to test transfer, not recognition.`,
        ],
      },
    ],
  },
  {
    slug: "nclex-study-plan",
    title: "NCLEX Study Plan | Weekly Structure Without Generic Calendars",
    description:
      "Build an NCLEX study plan around weak-area data: how to layer questions, rationales, lessons, and mocks with a fixed weekly hour budget.",
    h1: "NCLEX study plan built around your weak categories",
    cluster: "study-guide",
    keywords: ["NCLEX", "study plan", "schedule"],
    breadcrumb: {
      midLabel: "NCLEX prep guides",
      midPath: "/nursing-lab-values-study-guide",
      currentLabel: "Study plan",
    },
    sections: [
      {
        heading: "Start from hours, not vibes",
        level: 2,
        body: [
          "Pick a weekly hour budget you can defend for eight weeks. Split it 60/30/10: question reps with rationales, lessons or review on flagged systems, one timed block for stamina.",
          "If your job is unpredictable, anchor three non-negotiable 25-minute blocks instead of one long Sunday session that gets skipped.",
        ],
      },
      {
        heading: "Use the planner as a guardrail",
        level: 2,
        body: [
          "Enter your exam authorization window so pacing suggestions stay realistic. Move blocks when shifts change, consistency beats perfect adherence.",
          `Readiness in ${SITE} is a next-step signal: if it flags pharmacology while your self-story says you are "fine," trust the data for one week.`,
        ],
      },
      {
        heading: "Sample week (illustrative)",
        level: 2,
        body: [
          "Mon/Wed/Fri: 40 questions with immediate rationale review. Tue: lesson on the lowest category. Thu: 75-minute mixed set. Sat: half mock, review only flagged items.",
        ],
      },
    ],
  },
  {
    slug: "nclex-pn-practice-questions",
    title: "NCLEX-PN Practice Questions | US Practical Nursing Scope",
    description:
      "NCLEX-PN practice with PN-level delegation, pharmacology, and prioritization, separate from RN management stems. Rationales explain scope edges, not generic tips.",
    h1: "NCLEX-PN practice questions for US candidates",
    cluster: "exam-pn",
    keywords: ["NCLEX-PN", "LPN", "PN", "practice questions"],
    linkPack: "nclex-pn",
    breadcrumb: {
      midLabel: "PN exam prep",
      midPath: "/rex-pn-exam-prep",
      currentLabel: "NCLEX-PN practice",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "How NCLEX-PN stems differ from RN banks",
        level: 2,
        body: [
          "Expect tighter focus on stable versus unstable, what stays at the bedside versus what gets escalated, and medication administration within PN scope for your jurisdiction.",
          `${SITE} keeps PN pools separate from RN-only management scenarios unless your purchased tier explicitly includes crossover.`,
        ],
      },
      {
        heading: "When to add Canadian PN resources",
        level: 2,
        body: [
          "If you are preparing for Canadian entry-to-practice, use the REx-PN hub and its practice page, billing language and case framing follow Canadian regulators.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this page only for US NCLEX-PN?",
        answer:
          "This guide focuses on NCLEX-PN. Canadian PN candidates should start from REx-PN materials so scope and case law match provincial expectations.",
      },
    ],
  },
  {
    slug: "rex-pn-practice-questions",
    title: "REx-PN and NCLEX-PN Practice Questions | Scope and Safety",
    description:
      "PN practice questions for REx-PN and NCLEX-PN paths. Rationales, category feedback, and scope-aware stems for Canada and the US.",
    h1: "REx-PN and NCLEX-PN practice questions",
    cluster: "exam-pn",
    keywords: ["REx-PN", "PN", "LPN"],
    breadcrumb: {
      midLabel: "PN exam prep",
      midPath: "/rex-pn-exam-prep",
      currentLabel: "Practice questions",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "Why PN items hinge on scope and stability",
        level: 2,
        body: [
          "Exams love delegation edges, infection control sequence, and which client you see first. Questions train those forks faster than re-reading slides.",
          `${SITE} keeps PN banks separate from RN-only scope unless your tier includes crossover.`,
        ],
      },
    ],
  },
  {
    slug: "rex-pn-exam-prep",
    title: "REx-PN Exam Prep | PN Study System",
    description:
      "Structured REx-PN exam prep combining clinical lessons, PN-level questions, and review plans for Canadian candidates.",
    h1: "REx-PN exam prep designed around PN competencies",
    cluster: "exam-pn",
    keywords: ["REx-PN", "exam prep"],
    sections: [
      {
        heading: "Stay inside your entry-to-practice profile",
        level: 2,
        body: [
          "Your regulator publishes competencies, use them to prioritize community care, chronic illness, and acute changes PN scope can address.",
          "Pair each lesson block with a short question set the same week so knowledge converts to decision speed.",
        ],
      },
    ],
  },
  {
    slug: "np-exam-practice-questions",
    title: "NP Exam Practice Questions | Differentials and Management",
    description:
      "NP-level practice questions with rationales across assessment, diagnosis, and management. Track weak domains instead of rereading slides.",
    h1: "NP exam practice questions",
    cluster: "exam-np",
    keywords: ["NP", "nurse practitioner", "practice questions"],
    breadcrumb: {
      midLabel: "NP exam prep",
      midPath: "/np-exam-prep",
      currentLabel: "Practice questions",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "How NP stems differ from RN banks",
        level: 2,
        body: [
          "Expect longer cases, more differentials, and medication safety in context. Your job is staged reasoning, not the fastest click.",
          `${SITE} ties misses to categories so you repeat the same reasoning gap until it closes.`,
        ],
      },
    ],
  },
  {
    slug: "np-exam-prep",
    pageKind: "exam-intent",
    title: "NP Exam Prep Hub | Questions, Lessons, Review",
    description:
      "Plan NP exam prep with category-aware questions, clinical lessons, and performance tracking in one subscription.",
    h1: "NP exam prep that respects your advanced practice scope",
    cluster: "exam-np",
    keywords: ["NP", "exam prep"],
    sections: [
      {
        heading: "Sequence complexity, not volume alone",
        level: 2,
        body: [
          "Increase case complexity week over week. Anchor each study sprint to two systems until accuracy holds, then rotate.",
          "Pair each missed case with a short lesson on the same decision fork, then return to a fresh stem within a few days so you correct reasoning rather than memorizing answer position.",
        ],
      },
    ],
  },
  {
    slug: "canada-np-exam-prep",
    title: "Canadian NP Exam Prep | Clinical Decision Training",
    description:
      "How to prepare for Canadian NP exams with case-based questions, guideline-linked lessons, and readiness that tracks reasoning gaps—not recall drills.",
    h1: "Canadian NP exam prep for advanced clinical judgment",
    cluster: "exam-np",
    keywords: ["Canadian NP", "CNPLE", "exam prep", "nurse practitioner Canada"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "NP exam prep",
      midPath: "/np-exam-prep",
      currentLabel: "Canada NP prep",
    },
    sections: [
      {
        heading: "Why NP prep cannot mirror RN volume tactics",
        level: 2,
        body: [
          "Advanced practice exams reward differential reasoning, pharmacology in context, and guideline edges. Memorizing isolated facts without case framing under-tests the skills regulators assess.",
          `${SITE} routes NP work into longer stems and management forks so you rehearse decisions, not recognition speed alone.`,
        ],
      },
      {
        heading: "What to expect in case-based blocks",
        level: 2,
        body: [
          "Look for multi-step data: history, vitals, labs, and contraindications that change the safest next action. Your study plan should alternate new presentations with review of prior misses.",
        ],
      },
      {
        heading: "Related resources",
        level: 2,
        body: [
          "Use the CNPLE practice questions guide for item style, the NP clinical cases page for reasoning patterns, and your pathway hub for lessons scoped to Canada.",
        ],
      },
    ],
  },
  {
    slug: "cnple-practice-questions",
    title: "CNPLE Practice Questions | Canadian NP Clinical Cases",
    description:
      "Practice for the Canadian NP exam (CNPLE) with management-focused stems, pharmacology in context, and rationales tied to clinical reasoning, not undergraduate trivia.",
    h1: "CNPLE practice questions for Canadian NP candidates",
    cluster: "exam-np",
    keywords: ["CNPLE", "Canadian NP", "practice questions"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "Canadian NP prep",
      midPath: "/canada-np-exam-prep",
      currentLabel: "CNPLE practice",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "Stem length and reasoning load",
        level: 2,
        body: [
          "Expect vignettes that require you to interpret incomplete data, weigh comorbidities, and choose diagnostics or therapies appropriate to autonomous practice within regulatory scope.",
          "If a stem feels short and recall-only, it is probably not representative of the decision density regulators target at the NP level.",
        ],
      },
      {
        heading: "How to review misses",
        level: 2,
        body: [
          "For each error, name whether you missed a diagnosis fork, a contraindication, a monitoring step, or a follow-up interval. That label becomes your next study unit, not re-reading the whole chapter.",
        ],
      },
    ],
  },
  {
    slug: "np-study-guide-canada",
    title: "NP Study Guide for Canada | Guidelines, Cases, and Pace",
    description:
      "A practical NP study guide for Canada: sequencing guidelines, case practice, pharmacology depth, and exam-week pacing without generic checklists.",
    h1: "NP study guide for Canadian candidates",
    cluster: "study-guide",
    keywords: ["NP Canada", "study guide", "CNPLE"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "Canadian NP prep",
      midPath: "/canada-np-exam-prep",
      currentLabel: "Study guide",
    },
    sections: [
      {
        heading: "Anchor to guidelines, then to cases",
        level: 2,
        body: [
          "Pick two references you will actually open during study blocks. Summarize decision thresholds in your own words, then answer cases that force you to apply them under time pressure.",
        ],
      },
      {
        heading: "Weekly rhythm for working clinicians",
        level: 2,
        body: [
          "Three shorter case blocks beat one exhausted midnight marathon. Keep one session per week purely for weak-domain remediation based on your last session report.",
        ],
      },
    ],
  },
  {
    slug: "np-clinical-cases",
    title: "NP Clinical Cases | Decision Patterns for Exam Prep",
    description:
      "Train NP-level clinical reasoning with case patterns: red flags, diagnostic forks, treatment sequencing, and when to escalate, mapped to how advanced practice exams are written.",
    h1: "NP clinical cases for exam-style reasoning",
    cluster: "exam-np",
    keywords: ["NP cases", "clinical reasoning", "nurse practitioner"],
    linkPack: "np",
    sections: [
      {
        heading: "Cases versus isolated facts",
        level: 2,
        body: [
          "A case ties symptoms, meds, comorbidities, and monitoring into one trajectory. Your job is to choose the next best action, not to list every possible intervention.",
        ],
      },
      {
        heading: "Build a personal miss taxonomy",
        level: 2,
        body: [
          "Track whether errors cluster in diagnosis, medication choice, monitoring, or follow-up. Feed that taxonomy back into your next case block so repetition fixes reasoning, not luck.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-therapy-exam-prep",
    title: "Respiratory Therapy Exam Prep | RRT-Style Review",
    description:
      "Ventilation mechanics, gas exchange, and airway management concepts for respiratory therapy certification-style preparation.",
    h1: "Respiratory therapy exam prep focused on ventilation and gas exchange",
    cluster: "allied",
    keywords: ["respiratory therapy", "RRT", "exam prep"],
    sections: [
      {
        heading: "Core RT domains to rehearse",
        level: 2,
        body: [
          "Master ABG interpretation, ventilator modes and weaning criteria, obstructive versus restrictive patterns, and emergency airway priorities.",
          "Use question practice to stress-test rapid pattern recognition, exam items often compress time the way shift work does.",
        ],
      },
    ],
  },
  {
    slug: "paramedic-exam-prep",
    title: "Paramedic Exam Prep | Prehospital Prioritization",
    description:
      "Prehospital assessment, interventions, and transport decisions for paramedic certification-style readiness.",
    h1: "Paramedic exam prep built around scene-to-handoff decisions",
    cluster: "allied",
    keywords: ["paramedic", "exam prep"],
    sections: [
      {
        heading: "Prioritization beats trivia",
        level: 2,
        body: [
          "Paramedic exams emphasize ABCs, red-flag presentations, and protocol edges. Drill scenarios that force a single best first action.",
          "After each miss, write one sentence on the rule you violated, then redo a similar stem the next day so pattern recognition does not substitute for protocol understanding.",
        ],
      },
    ],
  },
  {
    slug: "medical-laboratory-scientist-exam-prep",
    title: "Medical Laboratory Scientist Exam Prep | MLT Review",
    description:
      "Hematology, chemistry, immunohematology, and quality concepts for MLS / MLT exam preparation.",
    h1: "Medical laboratory scientist exam prep with analytical rigor",
    cluster: "allied",
    keywords: ["MLS", "MLT", "laboratory"],
    sections: [
      {
        heading: "Translate theory into result interpretation",
        level: 2,
        body: [
          "Focus on delta checks, interference, critical values, and pre-analytical error sources, common exam themes that mirror bench accountability.",
          "Alternate topic drills with mixed review so you cannot succeed by memorizing item banks without understanding why a flagged result changes management.",
        ],
      },
    ],
  },
  {
    slug: "radiologic-technology-exam-prep",
    title: "Radiologic Technology Exam Prep | Imaging Safety & Positioning",
    description:
      "Patient safety, contrast considerations, and imaging fundamentals for radiologic technology exam preparation.",
    h1: "Radiologic technology exam prep emphasizing safety and image quality",
    cluster: "allied",
    keywords: ["radiography", "imaging", "exam prep"],
    sections: [
      {
        heading: "Safety and ALARA are always in scope",
        level: 2,
        body: [
          "Expect questions on shielding, pediatric adjustments, contrast reactions, and protocol selection when anatomy is ambiguous.",
          "Pair each positioning or exposure decision with the patient risk in the stem—exam writers often hide the decisive contraindication in comorbidity or pregnancy status.",
        ],
      },
    ],
  },
  {
    slug: "cardiovascular-nursing-practice-questions",
    title: "Cardiovascular Nursing Practice Questions",
    description:
      "HF, ACS, arrhythmia, and hemodynamic scenarios for nursing practice, prioritization and monitoring focused.",
    h1: "Cardiovascular nursing practice questions for acute and chronic care",
    cluster: "category",
    keywords: ["cardiovascular", "nursing", "practice questions"],
    sections: [
      {
        heading: "Hemodynamic patterns that repeat on exams",
        level: 2,
        body: [
          "Watch for perfusion versus congestion tradeoffs, antiarrhythmic safety, anticoagulation education, and early sepsis overlap with cardiac decline.",
          "Track your miss log by symptom cluster, not by isolated facts, to build transferable rules.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-nursing-practice-questions",
    title: "NCLEX Respiratory Practice: COPD, Asthma & Oxygen Items",
    description:
      "NCLEX respiratory practice: oxygen, asthma and COPD flares, pneumonia, airway priorities—stems hide decline behind OK numbers. Choose the next action from trends and assessment, not saturation alone.",
    h1: "Respiratory nursing practice questions with oxygenation first",
    cluster: "category",
    keywords: ["respiratory nursing practice questions", "COPD NCLEX", "asthma NCLEX", "nursing"],
    sections: [
      {
        heading: "SpO₂ is a clue, not the whole story",
        level: 2,
        body: [
          "Start with work of breathing, level of consciousness, and perfusion—then let SpO₂ confirm or challenge your concern. Boards love patients who “look sick” before the monitor catches up.",
          "If the answer choices include higher oxygen, BiPAP, calling the provider, or tighter monitoring, pick the move that matches the trajectory in the stem, not the one that sounds most “textbook” in isolation.",
        ],
      },
    ],
  },
  {
    slug: "pharmacology-nursing-practice-questions",
    title: "Pharmacology Nursing Practice Questions",
    description:
      "Mechanism, adverse effects, interactions, and monitoring for high-stakes nursing pharmacology.",
    h1: "Pharmacology nursing practice questions with monitoring emphasis",
    cluster: "category",
    keywords: ["pharmacology", "nursing"],
    sections: [
      {
        heading: "Link drug classes to assessment endpoints",
        level: 2,
        body: [
          "For each class, know the top three adverse effects, contraindications, and labs or vitals you recheck after initiation or dose changes.",
          "When two answers look plausible, choose the option that matches monitoring or teaching obligations tied to that drug class.",
        ],
      },
    ],
  },
  {
    slug: "pediatric-nursing-practice-questions",
    title: "Pediatric Nursing Practice Questions",
    description:
      "Growth-aware dosing, developmental cues, family-centered care, and acute pediatric emergencies for nursing exams.",
    h1: "Pediatric nursing practice questions with developmental context",
    cluster: "category",
    keywords: ["pediatrics", "nursing"],
    sections: [
      {
        heading: "Pediatrics is a communication and safety exam",
        level: 2,
        body: [
          "Expect questions where caregiver report, non-verbal cues, and age-specific vitals change the best answer.",
          "Immunization, growth, and developmental milestones appear as decision context—read what stage the patient is in before selecting an intervention.",
        ],
      },
    ],
  },
  {
    slug: "med-surg-nursing-practice-questions",
    title: "Medical-Surgical Nursing Practice Questions",
    description:
      "Perioperative, GI, renal, endocrine, and multisystem med-surg scenarios for full med-surg review.",
    h1: "Medical-surgical nursing practice questions across core systems",
    cluster: "category",
    keywords: ["med-surg", "nursing"],
    sections: [
      {
        heading: "Med-surg rewards systems thinking",
        level: 2,
        body: [
          "Practice linking electrolyte shifts to ECG changes, post-op complications to timing, and pain control to respiratory risk.",
          "When multiple body systems appear in one stem, identify the primary risk to life or limb first, then sequence nursing actions accordingly.",
        ],
      },
    ],
  },
  {
    slug: "nursing-lab-values-study-guide",
    title: "Nursing Lab Values Chart | Normal Ranges & NCLEX Actions",
    description:
      "Normal lab values charts list ranges; NCLEX tests critical highs and lows and your next nursing action. Quick reference: pair abnormal labs with recheck, hold, notify, or escalate—not distractors.",
    h1: "Nursing lab values study guide for rapid bedside interpretation",
    cluster: "hub",
    keywords: ["normal lab values nursing", "nursing lab values chart", "NCLEX lab values", "nursing"],
    sections: [
      {
        heading: "Build memory anchors, not isolated numbers",
        level: 2,
        body: [
          "Quick reference flow: name the panel (renal, hepatic, infection, acid–base), then ask what single abnormal would change your first nursing move—before you memorize another number.",
          "Every “bad lab” needs a paired action: recheck, hold, notify, or escalate. If your pick ignores stability cues in the stem, it is usually a distractor.",
        ],
      },
      {
        heading: "Connect labs to lessons and questions",
        level: 2,
        body: [
          `Use ${SITE} lessons for foundational pathophysiology, then apply lab interpretation inside timed question sets.`,
        ],
      },
    ],
  },
  {
    slug: "medication-calculation-nursing-guide",
    title: "Medication Calculation Guide for Nurses",
    description:
      "Dimensional analysis, weight-based dosing, and IV rate safety for nursing students and exam candidates.",
    h1: "Medication calculation nursing guide with safety checks",
    cluster: "hub",
    keywords: ["med math", "dosing", "nursing"],
    sections: [
      {
        heading: "Make every step visible",
        level: 2,
        body: [
          "Write units through every multiplication and division. Exams punish silent conversions between mg, mcg, mL, and units per kg.",
          "Double-check pump programming and rounding rules when IV rates or titration tables are embedded in the scenario stem.",
        ],
      },
    ],
  },
  {
    slug: "clinical-cheat-sheets-nursing",
    title: "Clinical Cheat Sheets for Nursing Students",
    description:
      "High-yield summaries for assessments, fluids, wounds, and common protocols, paired with links to deeper lessons.",
    h1: "Clinical cheat sheets nursing students can trust on shift",
    cluster: "hub",
    keywords: ["clinical", "cheat sheets", "nursing"],
    sections: [
      {
        heading: "Cheat sheets are starting points, not substitutes",
        level: 2,
        body: [
          "Use summaries to cue recall, then verify with policy and provider orders. Pair each sheet topic with question practice to test application.",
          "Keep one running list of facility-specific variances so you do not confuse textbook defaults with your unit’s protocols.",
        ],
      },
    ],
  },
  {
    slug: "new-graduate-nursing-roadmap",
    title: "New Graduate Nursing Roadmap | First-Year Success",
    description:
      "A roadmap for new graduate nurses: orientation priorities, competency building, and exam prep that fits shift schedules.",
    h1: "New graduate nursing roadmap from orientation to confidence",
    cluster: "hub",
    keywords: ["new grad", "nursing"],
    sections: [
      {
        heading: "Protect sleep, then protect learning cadence",
        level: 2,
        body: [
          "Short daily question blocks beat sporadic cramming. Tie each block to patients you saw when possible, context accelerates memory.",
          "Protect consecutive days off before high-stakes exams; sleep debt shows up as careless errors on priority and calculation items.",
        ],
      },
    ],
  },
  {
    slug: "allied-health-career-guides",
    title: "Allied Health Career Guides | RT, Paramedic, Lab, Imaging",
    description:
      "Career pathway context for allied health professionals with links to exam prep resources inside NurseNest.",
    h1: "Allied health career guides connecting pathways to prep",
    cluster: "hub",
    keywords: ["allied health", "career"],
    sections: [
      {
        heading: "Pick a lane, then deepen specialty depth",
        level: 2,
        body: [
          "Each allied pathway has distinct certification emphases. Align question practice to your registry blueprint and clinical rotation gaps.",
          "When you change employers or states, re-check scope and documentation rules—exam items assume the standard of care for your credential track.",
        ],
      },
    ],
  },
  {
    slug: "nursing-flashcards-nclex",
    title: "Nursing Flashcards for NCLEX & Clinical Courses",
    description:
      "How to use flashcards with spaced repetition alongside NCLEX-style questions for durable retention.",
    h1: "Nursing flashcards that complement, not replace, clinical judgment practice",
    cluster: "study-format",
    keywords: ["flashcards", "NCLEX"],
    sections: [
      {
        heading: "Spaced repetition + application",
        level: 2,
        body: [
          "Memorize mechanisms with cards, then force application under question pressure the same week. Isolation creates false confidence.",
          `${SITE} routes flashcard-minded study into the question bank and lessons so recall meets context.`,
        ],
      },
    ],
  },
  {
    slug: "nclex-two-week-prep-schedule",
    pageKind: "study-plan",
    title: "NCLEX Two-Week Prep Schedule | Daily Blocks & Review",
    description:
      "A focused two-week NCLEX prep schedule: daily question targets, rationale review rules, and when to insert a mock exam—without a generic calendar that ignores your weak categories.",
    h1: "NCLEX two-week prep schedule built around weak-area feedback",
    cluster: "study-guide",
    keywords: ["NCLEX", "two week", "schedule", "intensive"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX prep guides",
      midPath: "/nclex-study-plan",
      currentLabel: "Two-week schedule",
    },
    sections: [
      {
        heading: "How to use this schedule without burning out",
        level: 2,
        body: [
          "Two weeks is enough to sharpen judgment and pacing if you already completed a first pass of content. If fundamentals are still unstable, extend the timeline rather than stacking hours.",
          "Anchor each day to one primary system or client-need bucket, then mix in a smaller second bucket so you do not overfit patterns.",
        ],
      },
      {
        heading: "Week one: stabilize accuracy before speed",
        level: 2,
        body: [
          "Days 1–4: two timed mini-sets per day with immediate rationale review on misses only; cap total new items so review stays honest.",
          "Days 5–7: add one short lesson block on your lowest category, then repeat mixed sets that force transfer, not recognition.",
        ],
      },
      {
        heading: "Week two: pacing, safety traps, and mock exam",
        level: 2,
        body: [
          "Days 8–11: alternate full mixed sets with a single high-yield weakness drill per day; track recurring error types, not just topics.",
          "Days 12–13: one full practice exam under realistic timing; day 14 is light review and sleep hygiene—no marathon cramming.",
        ],
      },
    ],
    faq: [
      {
        question: "Is two weeks enough to pass the NCLEX?",
        answer:
          "It can be enough to consolidate and test readiness if your baseline is strong. If multiple systems remain below your target accuracy, prioritize depth over the calendar.",
      },
      {
        question: "Where should practice questions come from?",
        answer:
          "Use a single pathway-scoped bank so delegation language and scope stay consistent with your registration context, then layer mocks for stamina.",
      },
    ],
  },
  {
    slug: "heart-failure-nclex-review",
    pageKind: "topic-guide",
    title: "Heart Failure Nursing Review for NCLEX | Meds, Fluids & Priorities",
    description:
      "Heart failure nursing review for NCLEX-style judgment: volume status clues, guideline-consistent medication priorities, and safety traps that show up in clinical scenarios.",
    h1: "Heart failure nursing review: priorities that transfer to NCLEX items",
    cluster: "category",
    keywords: ["heart failure", "NCLEX", "HF", "cardiac"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Heart failure review",
    },
    sections: [
      {
        heading: "Clinical picture before memorizing drug classes",
        level: 2,
        body: [
          "NCLEX rewards matching interventions to the patient’s volume status and perfusion story, not reciting a textbook list.",
          "Practice explaining why diuresis, afterload reduction, or rate control is indicated in the stem you are given—then compare to the rationale.",
        ],
      },
      {
        heading: "Safety traps that repeat on exams",
        level: 2,
        body: [
          "Electrolyte shifts with therapy, hypotension after vasodilation, and infection signals when steroids or devices are in play are common distractor themes.",
          "When two answers look partially true, choose the action that addresses immediate life threat or the clearest nursing priority in the stem.",
        ],
      },
      {
        heading: "Pair reading with questions in the same week",
        level: 2,
        body: [
          "After a short review block, run a targeted question set on HF and related fluid/electrolyte items, then revisit only the misses with teaching depth.",
          `${SITE} links lessons and questions within the same pathway so your scope language stays consistent with RN registration expectations.`,
        ],
      },
    ],
    faq: [
      {
        question: "Should I memorize every HF medication detail?",
        answer:
          "Memorize the decision rules you can defend in a scenario: what to hold, what to monitor, and what symptom should change your priority.",
      },
      {
        question: "How is this different from doing random cardiac questions?",
        answer:
          "Random drills hide weak reasoning patterns. A focused HF pass plus mixed review tests whether you can transfer rules across presentations.",
      },
    ],
  },
  ...PROGRAMMATIC_SEO_AUTHORITY_BATCH,
];

export function getAllProgrammaticSeoPages(): SeoPageDefinition[] {
  return PROGRAMMATIC_SEO_PAGES;
}

export function getProgrammaticSeoPage(slug: string): SeoPageDefinition | undefined {
  return PROGRAMMATIC_SEO_PAGES.find((p) => p.slug === slug);
}

export function getAllProgrammaticSlugs(): string[] {
  return PROGRAMMATIC_SEO_PAGES.map((p) => p.slug);
}

export function getRelatedProgrammaticPages(
  slug: string,
  limit = MAX_RELATED_PROGRAMMATIC_LINKS,
): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && p.cluster === page.cluster).slice(0, limit);
}

export function getCrossClusterLinks(slug: string): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  const want: SeoCluster[] = ["hub", "study-format", "exam-nclex", "study-guide"];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && want.includes(p.cluster)).slice(
    0,
    MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS,
  );
}

export function isProgrammaticSeoSlug(slug: string): boolean {
  return PROGRAMMATIC_SEO_PAGES.some((p) => p.slug === slug);
}
