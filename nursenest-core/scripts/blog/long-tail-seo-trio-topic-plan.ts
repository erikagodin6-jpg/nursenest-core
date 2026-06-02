/**
 * Thirty long-tail SEO topics (pharmacology, pathophysiology, allied health) for NurseNest blog seeding.
 * Slugs are prefixed `lt-seo-` to avoid collisions with other blog corpora.
 */

export const LONG_TAIL_SEO_TRIO_LEGACY_SOURCE = "long-tail-seo-trio-2026";

export type LongTailSeoTrioPillar = "pharmacology" | "pathophysiology" | "allied";

export type LongTailSeoTrioTopicPlan = {
  slug: string;
  /** On-page H1 (human readable). */
  title: string;
  seoTitle: string;
  metaDescription: string;
  targetKeyword: string;
  pillar: LongTailSeoTrioPillar;
  category: string;
  exam: string | null;
  careerSlug: string | null;
  /** Registry pathway id for marketing URLs. */
  pathwayId: "us-rn-nclex-rn" | "us-allied-core";
  /** Two catalog lesson slugs (no leading path). */
  lessonSlugs: [string, string];
};

const RN = "us-rn-nclex-rn" as const;
const ALLIED = "us-allied-core" as const;

export function getLongTailSeoTrioTopicPlan(): LongTailSeoTrioTopicPlan[] {
  return [
    // --- Pharmacology (10) ---
    {
      slug: "lt-seo-pharm-ace-inhibitors-nclex-practice",
      title: "ACE inhibitors nursing pharmacology: NCLEX-style practice and monitoring",
      seoTitle: "ACE inhibitors nursing pharmacology questions and answers | NurseNest",
      metaDescription:
        "Review ACE inhibitor mechanism, key side effects, labs, and nursing priorities with NCLEX-style practice prompts linked to NurseNest lessons and full practice tests.",
      targetKeyword: "ACE inhibitors nursing pharmacology questions and answers",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["ace-inhibitors-nclex-rn", "arbs-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-beta-blockers-side-effects-exam",
      title: "Beta blockers for nursing exams: indications, side effects, and monitoring",
      seoTitle: "Beta blockers side effects nursing exam practice | NurseNest",
      metaDescription:
        "Study beta blocker classes, contraindications, heart rate and blood pressure monitoring, and exam-style clinical judgment with linked lessons and practice questions.",
      targetKeyword: "beta blockers side effects nursing exam practice",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["beta-blockers-indications-and-nursing-monitoring-nclex-rn", "milrinone-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-insulin-types-administration-nclex",
      title: "Insulin types and administration: NCLEX-focused nursing pharmacology",
      seoTitle: "Insulin types NCLEX-style practice questions | NurseNest",
      metaDescription:
        "Compare rapid, short, intermediate, and long-acting insulins, hypoglycemia response, and safe administration checks with sample items and NurseNest study links.",
      targetKeyword: "insulin types NCLEX-style practice questions",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["insulin-types-administration-and-hypoglycemia-response-nclex-rn", "metformin-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-digoxin-toxicity-monitoring-nclex",
      title: "Digoxin nursing pharmacology: therapeutic use, toxicity, and monitoring",
      seoTitle: "Digoxin toxicity nursing monitoring NCLEX review | NurseNest",
      metaDescription:
        "Learn digoxin mechanism highlights, early toxicity cues, apical pulse and lab pairing, and exam traps with practice prompts aligned to NurseNest NCLEX-RN prep.",
      targetKeyword: "digoxin toxicity nursing monitoring NCLEX",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["digoxin-nclex-rn", "thiazide-diuretics-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-heparin-aptt-anticoagulation-nursing",
      title: "Heparin and aPTT monitoring: anticoagulation nursing for licensure exams",
      seoTitle: "Heparin APTT monitoring nursing exam questions | NurseNest",
      metaDescription:
        "Cover unfractionated heparin monitoring, reversal thinking, bleeding precautions, and high-yield NCLEX-style questions with links to NurseNest lessons and tests.",
      targetKeyword: "heparin APTT monitoring nursing exam questions",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["heparin-and-aptt-monitoring-nclex-rn", "factor-xa-inhibitors-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-factor-xa-inhibitors-nursing-questions",
      title: "Factor Xa inhibitors: nursing assessment, education, and exam practice",
      seoTitle: "Factor Xa inhibitors nursing pharmacology practice | NurseNest",
      metaDescription:
        "Understand renal considerations, bleeding education, hold parameters, and peri-procedure themes common on exams, with NurseNest lesson and question bank links.",
      targetKeyword: "factor Xa inhibitors nursing pharmacology questions",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["factor-xa-inhibitors-nclex-rn", "heparin-and-aptt-monitoring-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-thiazide-diuretics-electrolytes-nclex",
      title: "Thiazide diuretics: electrolyte shifts, nursing monitoring, and NCLEX practice",
      seoTitle: "Thiazide diuretics electrolytes NCLEX nursing review | NurseNest",
      metaDescription:
        "Map sodium, potassium, and glucose patterns, orthostatic risk, and patient teaching for thiazides with structured practice and links to NurseNest NCLEX-RN tools.",
      targetKeyword: "thiazide diuretics electrolytes NCLEX nursing",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["thiazide-diuretics-nclex-rn", "ace-inhibitors-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-metformin-lactic-acidosis-safety",
      title: "Metformin nursing pharmacology: glycemic goals, safety, and contraindications",
      seoTitle: "Metformin nursing exam pharmacology practice | NurseNest",
      metaDescription:
        "Review metformin mechanism basics, GI side effects, renal safety checks, and rare lactic acidosis risk framing for exams with NurseNest-linked practice.",
      targetKeyword: "metformin nursing pharmacology exam practice",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["metformin-nclex-rn", "glyburide-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-statins-monitoring-liver-muscle-nclex",
      title: "Statins for nursing exams: lipid goals, liver enzymes, and muscle safety",
      seoTitle: "Statins nursing monitoring NCLEX pharmacology | NurseNest",
      metaDescription:
        "Study timing, common adverse effects, lab monitoring, and patient education cues for statins with NCLEX-style prompts and NurseNest lesson pathways.",
      targetKeyword: "statins nursing monitoring NCLEX pharmacology",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["statins-nclex-rn", "cholestyramine-nclex-rn"],
    },
    {
      slug: "lt-seo-pharm-arbs-nursing-considerations-practice",
      title: "ARBs (angiotensin II receptor blockers): nursing implications and exam prep",
      seoTitle: "ARBs nursing considerations NCLEX practice | NurseNest",
      metaDescription:
        "Compare ACE inhibitors versus ARBs for exam stems, pregnancy contraindications, hyperkalemia risk, and monitoring priorities with NurseNest practice surfaces.",
      targetKeyword: "ARBs nursing considerations NCLEX practice",
      pillar: "pharmacology",
      category: "Pharmacology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["arbs-nclex-rn", "ace-inhibitors-nclex-rn"],
    },
    // --- Pathophysiology (10) ---
    {
      slug: "lt-seo-patho-heart-failure-nclex-explained",
      title: "Heart failure pathophysiology explained for nursing exams",
      seoTitle: "Heart failure pathophysiology explained for nursing exams | NurseNest",
      metaDescription:
        "Walk through preload and afterload, compensatory neurohormonal responses, congestion patterns, and NCLEX-style reasoning with linked lessons and practice tests.",
      targetKeyword: "heart failure pathophysiology explained for nursing exams",
      pillar: "pathophysiology",
      category: "Cardiovascular",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["heart-failure-nclex-rn", "atrial-fibrillation-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-copd-mechanism-exam-questions",
      title: "COPD pathophysiology: air trapping, gas exchange, and nursing test focus",
      seoTitle: "COPD pathophysiology nursing test questions | NurseNest",
      metaDescription:
        "Explain emphysema and chronic bronchitis mechanisms, blue bloat versus pink puffer framing, oxygen cautions, and exam-style prioritization with NurseNest links.",
      targetKeyword: "COPD pathophysiology nursing test questions",
      pillar: "pathophysiology",
      category: "Respiratory",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["copd-nclex-rn", "asthma-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-diabetes-t1-t2-complications-pathophysiology",
      title: "Diabetes complications pathophysiology: microvascular and macrovascular risk",
      seoTitle: "Diabetes complications pathophysiology quiz prep | NurseNest",
      metaDescription:
        "Connect chronic hyperglycemia to retinopathy, nephropathy, neuropathy, and cardiovascular risk with assessment cues and NCLEX-style questions on NurseNest.",
      targetKeyword: "diabetes complications pathophysiology quiz",
      pillar: "pathophysiology",
      category: "Endocrine",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["diabetes-mellitus-type-1-and-type-2-nursing-management-nclex-rn", "diabetes-insipidus-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-asthma-bronchospasm-nursing-exam",
      title: "Asthma pathophysiology: bronchospasm, inflammation, and acute exacerbations",
      seoTitle: "Asthma pathophysiology nursing exam review | NurseNest",
      metaDescription:
        "Study airway inflammation, triggers, severity clues, and medication sequencing for exams with structured teaching and NurseNest practice question entry points.",
      targetKeyword: "asthma pathophysiology nursing exam review",
      pillar: "pathophysiology",
      category: "Respiratory",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["asthma-nclex-rn", "bronchiolitis-and-rsv-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-aki-prerenal-patterns-nclex",
      title: "Acute kidney injury pathophysiology: prerenal, intrarenal, and postrenal patterns",
      seoTitle: "AKI pathophysiology NCLEX nursing review | NurseNest",
      metaDescription:
        "Differentiate prerenal azotemia from ATN patterns, urine findings, and fluid responsivity for exam stems, with NurseNest lessons and full practice tests.",
      targetKeyword: "acute kidney injury pathophysiology NCLEX",
      pillar: "pathophysiology",
      category: "Renal",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["acute-kidney-injury-prerenal-intrarenal-and-postrenal-patterns-nclex-rn", "sepsis-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-stroke-tia-pathophysiology-quiz",
      title: "Stroke and TIA pathophysiology: perfusion, penumbra, and nursing priorities",
      seoTitle: "Stroke TIA pathophysiology nursing quiz prep | NurseNest",
      metaDescription:
        "Review ischemic versus hemorrhagic mechanisms, time-sensitive assessment, and secondary prevention themes with NCLEX-style practice hooks on NurseNest.",
      targetKeyword: "stroke TIA pathophysiology nursing quiz",
      pillar: "pathophysiology",
      category: "Neurology",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["stroke-and-transient-ischemic-attack-nclex-rn", "hypertensive-encephalopathy-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-sepsis-inflammatory-response-nclex",
      title: "Sepsis pathophysiology: systemic inflammatory response and perfusion",
      seoTitle: "Sepsis pathophysiology NCLEX nursing review | NurseNest",
      metaDescription:
        "Map infection to systemic inflammation, capillary leak, lactate interpretation, and escalation thinking for exam items, linked to NurseNest NCLEX-RN prep.",
      targetKeyword: "sepsis pathophysiology NCLEX nursing",
      pillar: "pathophysiology",
      category: "Critical care",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["sepsis-nclex-rn", "pulmonary-embolism-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-community-pneumonia-pathophysiology",
      title: "Community-acquired pneumonia pathophysiology: consolidation and gas exchange",
      seoTitle: "Community acquired pneumonia pathophysiology nursing | NurseNest",
      metaDescription:
        "Explain alveolar filling, ventilation-perfusion imbalance, fever patterns, and oxygenation goals with NCLEX-style practice and NurseNest study links.",
      targetKeyword: "community acquired pneumonia pathophysiology nursing",
      pillar: "pathophysiology",
      category: "Respiratory",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["community-acquired-pneumonia-nclex-rn", "ards-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-ards-hypoxemia-nursing-test",
      title: "ARDS pathophysiology: shunt physiology, refractory hypoxemia, and nursing care",
      seoTitle: "ARDS pathophysiology nursing test questions | NurseNest",
      metaDescription:
        "Study surfactant loss, compliance changes, PEEP rationale at a nursing scope, and safety communication for exams with NurseNest question bank entry points.",
      targetKeyword: "ARDS pathophysiology nursing test questions",
      pillar: "pathophysiology",
      category: "Respiratory",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["ards-nclex-rn", "positive-pressure-ventilation-nclex-rn"],
    },
    {
      slug: "lt-seo-patho-acs-coronary-pathophysiology-nclex",
      title: "Acute coronary syndrome pathophysiology: plaque rupture and ischemic supply-demand",
      seoTitle: "Acute coronary syndrome pathophysiology NCLEX | NurseNest",
      metaDescription:
        "Connect plaque instability to ischemic pain patterns, ECG and troponin thinking at a nursing level, and priority interventions with NurseNest-linked practice.",
      targetKeyword: "acute coronary syndrome pathophysiology NCLEX",
      pillar: "pathophysiology",
      category: "Cardiovascular",
      exam: "NCLEX-RN",
      careerSlug: null,
      pathwayId: RN,
      lessonSlugs: ["acute-coronary-syndrome-nclex-rn", "heart-failure-nclex-rn"],
    },
    // --- Allied health (10) ---
    {
      slug: "lt-seo-allied-mlt-hematology-lab-practice-questions",
      title: "MLT hematology study guide: lab values, morphology cues, and practice questions",
      seoTitle: "MLT hematology practice questions | Allied health | NurseNest",
      metaDescription:
        "Review CBC interpretation basics, anemia patterns, and quality checks for allied health exams with structured items and NurseNest allied pathway lessons.",
      targetKeyword: "MLT hematology practice questions",
      pillar: "allied",
      category: "Laboratory",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-lab-values", "allied-human-physiology"],
    },
    {
      slug: "lt-seo-allied-paramedic-emergency-airway-study",
      title: "Paramedic airway management: assessment, adjuncts, and exam-style questions",
      seoTitle: "Paramedic airway management exam questions | NurseNest",
      metaDescription:
        "Study airway patency, suctioning priorities, BVM concepts, and escalation communication for allied certification prep with NurseNest emergency lessons and tests.",
      targetKeyword: "paramedic airway management exam questions",
      pillar: "allied",
      category: "Emergency",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-emergency-response", "allied-vital-signs"],
    },
    {
      slug: "lt-seo-allied-ot-pt-anatomy-assessment-practice",
      title: "OT and PT anatomy for exams: movement, assessment, and safety thinking",
      seoTitle: "OT PT anatomy practice test questions | NurseNest",
      metaDescription:
        "Connect musculoskeletal landmarks, functional mobility, and documentation basics for allied health tests with NurseNest anatomy lessons and practice entry points.",
      targetKeyword: "OT PT anatomy practice test questions",
      pillar: "allied",
      category: "Rehabilitation",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-human-anatomy", "allied-patient-assessment"],
    },
    {
      slug: "lt-seo-allied-pharmacology-basics-exam-prep",
      title: "Allied health pharmacology basics: routes, safety, and calculation mindset",
      seoTitle: "Allied health pharmacology basics exam prep | NurseNest",
      metaDescription:
        "Review drug classes at an allied scope, five-rights reinforcement, and common exam distractors with NurseNest lessons and question bank links.",
      targetKeyword: "allied health pharmacology basics exam prep",
      pillar: "allied",
      category: "Pharmacology",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-pharmacology-basics", "allied-medication-safety"],
    },
    {
      slug: "lt-seo-allied-vital-signs-trending-clinical-judgment",
      title: "Vital signs trending for allied exams: orthostatic checks and escalation",
      seoTitle: "Allied health vital signs exam practice | NurseNest",
      metaDescription:
        "Practice interpreting trends, equipment errors, and handoff language for vital sign scenarios on allied health tests with NurseNest study tools.",
      targetKeyword: "allied health vital signs exam practice",
      pillar: "allied",
      category: "Assessment",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-vital-signs", "allied-patient-assessment"],
    },
    {
      slug: "lt-seo-allied-patient-assessment-prioritization-questions",
      title: "Patient assessment and prioritization for allied health certification review",
      seoTitle: "Allied health patient assessment practice questions | NurseNest",
      metaDescription:
        "Work through focused assessment sequences, red flag reporting, and scope-appropriate actions with NurseNest lessons and full practice tests.",
      targetKeyword: "allied health patient assessment practice questions",
      pillar: "allied",
      category: "Assessment",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-patient-assessment", "allied-patient-communication"],
    },
    {
      slug: "lt-seo-allied-imaging-basics-safety-quiz",
      title: "Imaging basics for allied learners: safety, communication, and exam traps",
      seoTitle: "Allied health imaging basics practice quiz | NurseNest",
      metaDescription:
        "Understand contrast precautions at an allied scope, patient preparation, and teamwork with radiology for exam items linked to NurseNest lessons.",
      targetKeyword: "allied health imaging basics practice quiz",
      pillar: "allied",
      category: "Diagnostics",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-imaging-basics", "allied-infection-control"],
    },
    {
      slug: "lt-seo-allied-infection-control-ppe-exam-practice",
      title: "Infection control and PPE for allied exams: chains, barriers, and documentation",
      seoTitle: "Allied health infection control PPE exam practice | NurseNest",
      metaDescription:
        "Review standard precautions, transmission-based isolation cues, and audit-ready documentation habits with NurseNest allied pathway lessons and tests.",
      targetKeyword: "allied health infection control PPE exam practice",
      pillar: "allied",
      category: "Infection control",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-infection-control", "allied-clinical-documentation"],
    },
    {
      slug: "lt-seo-allied-medication-safety-five-rights-practice",
      title: "Medication safety and the five rights: allied health exam preparation",
      seoTitle: "Allied medication safety five rights practice | NurseNest",
      metaDescription:
        "Practice double-check habits, look-alike sound-alike awareness, and error reporting expectations for allied certification exams on NurseNest.",
      targetKeyword: "allied medication safety five rights practice",
      pillar: "allied",
      category: "Safety",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-medication-safety", "allied-pharmacology-basics"],
    },
    {
      slug: "lt-seo-allied-human-physiology-pathways-study-test",
      title: "Human physiology for allied health exams: homeostasis, organs, and integration",
      seoTitle: "Allied health human physiology practice test | NurseNest",
      metaDescription:
        "Study organ systems, compensatory responses, and exam-style integration questions with NurseNest physiology lessons and practice test entry points.",
      targetKeyword: "allied health human physiology practice test",
      pillar: "allied",
      category: "Physiology",
      exam: "ALLIED",
      careerSlug: null,
      pathwayId: ALLIED,
      lessonSlugs: ["allied-human-physiology", "allied-human-anatomy"],
    },
  ];
}
