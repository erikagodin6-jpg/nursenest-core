import { absoluteUrl } from "@/lib/seo/site-origin";

export type AuthorityContentCategory = "conditions" | "medications" | "clinical-skills" | "labs" | "care-plans";

export type ClinicalReviewStatus = "clinically_reviewed" | "under_review" | "updated";

export type AuthorityReviewer = {
  name: string;
  credentials: string;
  specialty: string;
  reviewedAt: string;
};

export type AuthorityReference = {
  title: string;
  source: string;
  url: string;
};

export type AuthorityLink = {
  label: string;
  href: string;
  category?: AuthorityContentCategory | "lesson" | "question" | "flashcard" | "simulation";
};

export type AuthoritySection = {
  id: string;
  title: string;
  body: string[];
};

export type AuthorityPage = {
  category: AuthorityContentCategory;
  slug: string;
  title: string;
  deck: string;
  summary: string;
  synonyms: string[];
  clinicalReviewStatus: ClinicalReviewStatus;
  reviewer: AuthorityReviewer;
  governance: {
    publishedAt: string;
    updatedAt: string;
    reviewCycleDue: string;
    changeHistory: string[];
  };
  sections: AuthoritySection[];
  clinicalPearls: string[];
  commonMistakes: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: AuthorityLink[];
  references: AuthorityReference[];
};

export const AUTHORITY_CATEGORY_META: Record<
  AuthorityContentCategory,
  { title: string; singular: string; description: string; futureTarget: string }
> = {
  conditions: {
    title: "Disease & Condition Library",
    singular: "Condition",
    description: "Clinically reasoned disease guides for nursing, NP, and allied health learners.",
    futureTarget: "5,000+ future condition pages",
  },
  medications: {
    title: "Medication Library",
    singular: "Medication",
    description: "Medication guides focused on safety, monitoring, teaching, and exam relevance.",
    futureTarget: "5,000+ future medication pages",
  },
  "clinical-skills": {
    title: "Clinical Skills Library",
    singular: "Clinical Skill",
    description: "Procedure and skill guides with safety checks, documentation, complications, and practice questions.",
    futureTarget: "2,000+ future skills",
  },
  labs: {
    title: "Laboratory Interpretation Library",
    singular: "Lab",
    description: "Lab interpretation pages connecting abnormal values to clinical meaning and nursing action.",
    futureTarget: "1,000+ future lab pages",
  },
  "care-plans": {
    title: "Nursing Care Plan Library",
    singular: "Care Plan",
    description: "Priority-ranked care plans with SMART goals, interventions, rationales, and clinical reasoning.",
    futureTarget: "1,000+ future care plans",
  },
};

export const AUTHORITY_CONTENT_PAGES: AuthorityPage[] = [
  {
    category: "conditions",
    slug: "heart-failure",
    title: "Heart Failure",
    deck: "A clinical reasoning guide to impaired cardiac pumping, fluid overload, perfusion changes, and nursing priorities.",
    summary:
      "Heart failure occurs when the heart cannot pump effectively enough to meet metabolic needs or accommodate venous return without elevated filling pressures. Nursing care focuses on oxygenation, perfusion, fluid balance, medication safety, early deterioration recognition, and patient self-management.",
    synonyms: ["CHF", "congestive heart failure", "left-sided heart failure", "right-sided heart failure", "HF"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NP, Nursing Education Review",
      specialty: "Medical-Surgical Nursing",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial authority-engine seed page created for EEAT and internal-linking architecture."],
    },
    sections: [
      {
        id: "definition",
        title: "Definition",
        body: [
          "Heart failure is a clinical syndrome caused by structural or functional cardiac impairment that reduces ventricular filling or ejection of blood.",
          "For learners, the key idea is not simply fluid overload. The problem is ineffective cardiac performance that can cause pulmonary congestion, systemic venous congestion, reduced renal perfusion, fatigue, activity intolerance, and recurrent decompensation.",
        ],
      },
      {
        id: "pathophysiology",
        title: "Pathophysiology",
        body: [
          "Reduced cardiac output activates compensatory systems including sympathetic stimulation and the renin-angiotensin-aldosterone system. These responses may temporarily maintain perfusion but can worsen sodium and water retention, vasoconstriction, ventricular workload, and remodeling.",
          "Left-sided failure commonly produces pulmonary congestion, crackles, dyspnea, orthopnea, and hypoxemia. Right-sided failure commonly produces peripheral edema, jugular venous distention, hepatomegaly, abdominal fullness, and weight gain.",
        ],
      },
      {
        id: "assessment",
        title: "Assessment Findings",
        body: [
          "Priority assessment includes respiratory effort, oxygen saturation, lung sounds, edema, daily weight, intake and output, blood pressure, heart rate, urine output, fatigue, chest discomfort, medication adherence, and ability to perform activities of daily living.",
          "Worsening dyspnea, new confusion, falling oxygen saturation, rapid weight gain, hypotension, reduced urine output, or escalating edema should prompt timely reassessment and escalation.",
        ],
      },
      {
        id: "diagnostics",
        title: "Diagnostics, Labs, And Imaging",
        body: [
          "Common evaluation may include BNP or NT-proBNP, ECG, chest x-ray, echocardiography, renal function, electrolytes, troponin when ischemia is suspected, and medication-specific monitoring such as digoxin level when applicable.",
          "A rising creatinine or abnormal potassium can change medication safety, especially with diuretics, ACE inhibitors, ARBs, ARNIs, mineralocorticoid receptor antagonists, and digoxin.",
        ],
      },
      {
        id: "treatment",
        title: "Treatments And Pharmacology",
        body: [
          "Treatment depends on type and acuity. Common therapies include diuretics for congestion, guideline-directed cardiac medications, oxygen or ventilatory support when needed, sodium and fluid guidance, daily weights, and management of triggers such as infection, ischemia, dysrhythmia, or nonadherence.",
          "Nursing medication safety focuses on blood pressure, renal function, potassium, heart rate, symptom response, orthostasis, and patient understanding of when to report worsening symptoms.",
        ],
      },
      {
        id: "nursing",
        title: "Nursing And Allied Health Considerations",
        body: [
          "Nursing priorities include improving oxygenation, reducing fluid overload, preventing falls from orthostasis or weakness, monitoring response to diuretics, recognizing deterioration, and teaching self-management.",
          "Allied health involvement may include dietitian support for sodium guidance, physiotherapy for activity tolerance, respiratory therapy for oxygen needs, pharmacy for medication reconciliation, and social work for access barriers.",
        ],
      },
      {
        id: "exam",
        title: "NCLEX, REx-PN, And NP Tips",
        body: [
          "Exam items often test daily weights, lung sounds, oxygenation, diuretic safety, potassium monitoring, and priority action when pulmonary edema or poor perfusion appears.",
          "NP-level reasoning adds differential diagnosis, medication optimization, comorbidity management, diagnostic interpretation, and recognition of when acute decompensation requires emergency escalation.",
        ],
      },
    ],
    clinicalPearls: [
      "Daily weight often detects worsening fluid retention before edema or dyspnea becomes obvious.",
      "New confusion in a heart failure patient can be a perfusion or oxygenation warning sign, not just an age-related change.",
      "Diuretic response should be evaluated with symptoms, lung sounds, urine output, weight, renal function, and electrolytes together.",
    ],
    commonMistakes: [
      "Teaching sodium restriction before addressing acute respiratory distress.",
      "Ignoring potassium and renal function trends when diuretics or RAAS-affecting medications are used.",
      "Assuming normal oxygen saturation rules out worsening heart failure when work of breathing and weight are worsening.",
    ],
    faqs: [
      {
        question: "What is the priority nursing assessment for heart failure?",
        answer:
          "Respiratory status, oxygenation, lung sounds, work of breathing, perfusion, weight trend, edema, urine output, blood pressure, and response to medications are priority assessments.",
      },
      {
        question: "Why are daily weights important in heart failure?",
        answer:
          "Daily weights help identify fluid retention early and can reveal worsening congestion before symptoms are severe.",
      },
    ],
    related: [
      { label: "Heart Failure Care Plan", href: "/healthcare/care-plans/heart-failure-care-plan", category: "care-plans" },
      { label: "Furosemide", href: "/healthcare/medications/furosemide", category: "medications" },
      { label: "Potassium", href: "/healthcare/labs/potassium", category: "labs" },
      { label: "NCLEX-RN Lessons", href: "/canada/rn/nclex-rn/lessons", category: "lesson" },
      { label: "Practice Questions", href: "/question-bank", category: "question" },
    ],
    references: [
      { title: "Heart Failure Guidelines", source: "American Heart Association", url: "https://www.heart.org/" },
      { title: "Heart Failure Clinical Overview", source: "Mayo Clinic", url: "https://www.mayoclinic.org/" },
      { title: "Heart Failure", source: "MedlinePlus", url: "https://medlineplus.gov/heartfailure.html" },
    ],
  },
  {
    category: "medications",
    slug: "furosemide",
    title: "Furosemide",
    deck: "Loop diuretic safety, monitoring, patient teaching, and exam-relevant nursing considerations.",
    summary:
      "Furosemide is a loop diuretic used to reduce fluid overload and treat edema or hypertension in selected patients. Nursing care centers on volume status, blood pressure, renal function, electrolyte monitoring, fall prevention, and patient teaching.",
    synonyms: ["Lasix", "loop diuretic", "water pill"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NP, Pharmacology Review",
      specialty: "Medication Safety",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial medication authority seed page created."],
    },
    sections: [
      {
        id: "classification",
        title: "Generic Name, Class, And Mechanism",
        body: [
          "Furosemide is a loop diuretic. It acts in the loop of Henle to promote sodium and water excretion.",
          "The clinical effect is reduced intravascular volume and reduced congestion. This can improve symptoms of fluid overload but may also cause dehydration, hypotension, renal stress, or electrolyte imbalance.",
        ],
      },
      {
        id: "indications",
        title: "Indications And Contraindications",
        body: [
          "Common indications include edema associated with heart failure, renal disease, liver disease, or other fluid overload states, and hypertension in selected patients.",
          "Contraindications and cautions depend on the patient and orders, but nurses should be alert for severe dehydration, anuria, significant electrolyte disturbances, sulfonamide allergy history, hypotension, and renal function changes.",
        ],
      },
      {
        id: "monitoring",
        title: "Monitoring And Hold Parameters",
        body: [
          "Monitor blood pressure, heart rate, intake and output, daily weight, edema, lung sounds, renal function, potassium, sodium, magnesium, dizziness, and symptom response.",
          "Hold parameters are provider- or policy-specific. Nurses should clarify orders for low blood pressure, severe electrolyte abnormalities, acute kidney injury, symptomatic dizziness, or unexpectedly low urine output.",
        ],
      },
      {
        id: "teaching",
        title: "Patient Teaching",
        body: [
          "Teach patients to take the medication as prescribed, report dizziness, muscle weakness, palpitations, severe thirst, decreased urination, hearing changes, or worsening swelling and shortness of breath.",
          "For chronic heart failure, connect furosemide teaching to daily weights and early reporting of rapid weight gain.",
        ],
      },
    ],
    clinicalPearls: [
      "A strong urine output after furosemide is expected, but falling blood pressure, dizziness, or rising creatinine may signal excessive volume loss.",
      "Loop diuretics can lower potassium, which matters for dysrhythmia risk and digoxin safety.",
    ],
    commonMistakes: [
      "Giving a diuretic without reviewing blood pressure, potassium, renal function, and recent urine output.",
      "Teaching only that the medication removes fluid without explaining when to report dehydration or electrolyte symptoms.",
    ],
    faqs: [
      {
        question: "What should nurses monitor with furosemide?",
        answer: "Monitor blood pressure, urine output, weight, edema, lung sounds, renal function, potassium, sodium, magnesium, dizziness, and therapeutic response.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "Potassium", href: "/healthcare/labs/potassium", category: "labs" },
      { label: "Heart Failure Care Plan", href: "/healthcare/care-plans/heart-failure-care-plan", category: "care-plans" },
    ],
    references: [
      { title: "Furosemide Drug Information", source: "MedlinePlus", url: "https://medlineplus.gov/druginfo/meds/a682858.html" },
      { title: "Loop Diuretics", source: "NCBI Bookshelf", url: "https://www.ncbi.nlm.nih.gov/books/" },
    ],
  },
  {
    category: "labs",
    slug: "potassium",
    title: "Potassium",
    deck: "Interpret high and low potassium through cardiac, renal, medication, and safety lenses.",
    summary:
      "Potassium is a major intracellular electrolyte essential for cardiac conduction, neuromuscular function, and acid-base balance. Abnormal potassium can become life-threatening because it can trigger dangerous dysrhythmias.",
    synonyms: ["K", "K+", "serum potassium", "hyperkalemia", "hypokalemia"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, NP, Lab Interpretation Review",
      specialty: "Laboratory Interpretation",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial lab authority seed page created."],
    },
    sections: [
      {
        id: "normal",
        title: "Normal Values And Function",
        body: [
          "Typical adult reference ranges vary by lab, but serum potassium is commonly around 3.5-5.0 mmol/L.",
          "Potassium supports cardiac conduction and muscle function. A value must be interpreted with symptoms, renal function, medications, ECG changes, and hemolysis risk.",
        ],
      },
      {
        id: "high",
        title: "High Potassium",
        body: [
          "Hyperkalemia may be associated with kidney dysfunction, potassium-sparing medications, ACE inhibitors or ARBs, tissue breakdown, acidosis, adrenal disorders, or specimen hemolysis.",
          "Clinical concern increases with weakness, paresthesias, bradycardia, ECG changes, renal failure, or rapidly rising values.",
        ],
      },
      {
        id: "low",
        title: "Low Potassium",
        body: [
          "Hypokalemia may be associated with diuretics, vomiting, diarrhea, poor intake, insulin shifts, alkalosis, or certain medications.",
          "Low potassium increases risk for weakness, cramps, ileus, dysrhythmias, and digoxin toxicity concerns.",
        ],
      },
      {
        id: "actions",
        title: "Nursing Actions",
        body: [
          "Assess cardiac rhythm risk, medication contributors, renal function, symptoms, and whether the result fits the clinical picture.",
          "Escalate critical values according to policy, place the patient on appropriate monitoring when indicated, and verify replacement or lowering therapies are administered safely.",
        ],
      },
    ],
    clinicalPearls: [
      "Potassium abnormalities are ECG and patient-safety problems, not just lab memorization.",
      "A hemolyzed specimen can falsely elevate potassium, but symptomatic or ECG-changing hyperkalemia should never be dismissed.",
    ],
    commonMistakes: [
      "Memorizing the number without checking ECG risk, renal function, and medications.",
      "Replacing potassium without considering renal function or route safety.",
    ],
    faqs: [
      {
        question: "Why is abnormal potassium dangerous?",
        answer: "Potassium affects cardiac conduction and muscle function, so significant abnormalities can cause weakness and potentially life-threatening dysrhythmias.",
      },
    ],
    related: [
      { label: "Furosemide", href: "/healthcare/medications/furosemide", category: "medications" },
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "ECG Interpretation", href: "/ecg-interpretation", category: "lesson" },
    ],
    references: [
      { title: "Potassium Blood Test", source: "MedlinePlus", url: "https://medlineplus.gov/lab-tests/potassium-blood-test/" },
      { title: "Hyperkalemia", source: "Merck Manual Professional", url: "https://www.merckmanuals.com/professional" },
    ],
  },
  {
    category: "clinical-skills",
    slug: "oxygen-administration",
    title: "Oxygen Administration",
    deck: "A clinical skill guide for safe oxygen delivery, assessment, documentation, and escalation.",
    summary:
      "Oxygen administration is a common clinical skill used to treat or prevent hypoxemia. Safe practice requires assessment, device selection, ordered flow or concentration, skin and fire safety, response evaluation, and escalation when oxygen needs increase.",
    synonyms: ["O2", "nasal cannula", "oxygen therapy", "supplemental oxygen"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, Respiratory Care Review",
      specialty: "Clinical Skills",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial clinical skill authority seed page created."],
    },
    sections: [
      {
        id: "purpose",
        title: "Purpose And Indications",
        body: [
          "Oxygen therapy increases delivered oxygen for patients with hypoxemia, increased work of breathing, acute illness, procedural needs, or specific provider-ordered indications.",
          "The nurse must assess whether oxygen is improving the patient and whether worsening oxygen needs signal deterioration.",
        ],
      },
      {
        id: "procedure",
        title: "Preparation And Procedure",
        body: [
          "Verify patient identity, order or protocol, target saturation, delivery device, flow rate, humidification need, allergies or skin risks, and baseline respiratory assessment.",
          "Apply the correct device, ensure tubing is connected and patent, set the prescribed flow, reassess respiratory status, and document device, flow, saturation, tolerance, and response.",
        ],
      },
      {
        id: "safety",
        title: "Safety Checks And Common Errors",
        body: [
          "Use oxygen safety precautions, avoid ignition sources, protect skin around ears and nares, monitor for dryness, and ensure the patient can call for help.",
          "Common errors include charting oxygen without reassessment, missing increasing oxygen requirements, using the wrong device, or failing to escalate when distress worsens.",
        ],
      },
    ],
    clinicalPearls: [
      "Increasing oxygen requirement is a deterioration cue even if saturation temporarily improves.",
      "The device and flow rate matter because they determine how much oxygen the patient may actually receive.",
    ],
    commonMistakes: [
      "Treating oxygen as a comfort measure instead of a therapy requiring reassessment.",
      "Documenting saturation without assessing work of breathing, mental status, and lung sounds.",
    ],
    faqs: [
      {
        question: "What should be documented after oxygen administration?",
        answer: "Document device, flow rate or oxygen concentration, oxygen saturation, respiratory assessment, patient tolerance, skin condition, and response.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "ECG Interpretation", href: "/ecg-interpretation", category: "lesson" },
      { label: "Lab Interpretation", href: "/labs-interpretation", category: "lesson" },
    ],
    references: [
      { title: "Oxygen Therapy", source: "British Thoracic Society", url: "https://www.brit-thoracic.org.uk/" },
      { title: "Oxygen Safety", source: "FDA", url: "https://www.fda.gov/" },
    ],
  },
  {
    category: "care-plans",
    slug: "heart-failure-care-plan",
    title: "Heart Failure Nursing Care Plan",
    deck: "Priority diagnoses, SMART goals, interventions, rationales, teaching, and clinical reasoning for heart failure.",
    summary:
      "A heart failure care plan prioritizes oxygenation, cardiac output, fluid balance, activity tolerance, medication safety, and self-management. The nurse must connect findings such as dyspnea, crackles, edema, weight gain, and renal function changes to interventions and escalation thresholds.",
    synonyms: ["CHF care plan", "heart failure nursing diagnosis", "cardiac care plan"],
    clinicalReviewStatus: "under_review",
    reviewer: {
      name: "NurseNest Clinical Editorial Team",
      credentials: "RN, Nursing Care Plan Review",
      specialty: "Care Planning",
      reviewedAt: "2026-05-31",
    },
    governance: {
      publishedAt: "2026-05-31",
      updatedAt: "2026-05-31",
      reviewCycleDue: "2026-11-30",
      changeHistory: ["Initial care plan authority seed page created."],
    },
    sections: [
      {
        id: "overview",
        title: "Patient Overview",
        body: [
          "A typical heart failure patient may present with dyspnea, orthopnea, crackles, edema, fatigue, rapid weight gain, reduced activity tolerance, and medication complexity.",
          "Priority nursing care begins with respiratory status and perfusion, then fluid balance, activity tolerance, medication safety, education, and discharge planning.",
        ],
      },
      {
        id: "diagnoses",
        title: "Priority Nursing Diagnoses",
        body: [
          "Common priority diagnoses include impaired gas exchange, decreased cardiac output, excess fluid volume, activity intolerance, and deficient knowledge related to heart failure self-management.",
          "Each diagnosis should be supported by assessment findings rather than listed because it appears in a textbook.",
        ],
      },
      {
        id: "interventions",
        title: "Interventions And Rationales",
        body: [
          "Monitor respiratory status, oxygen saturation, lung sounds, daily weight, intake and output, edema, blood pressure, heart rate, renal function, electrolytes, and response to diuretics.",
          "Rationales should explain how each action detects worsening congestion, improves oxygenation, prevents medication harm, or supports safe self-management.",
        ],
      },
      {
        id: "teaching",
        title: "Patient Teaching And Evaluation",
        body: [
          "Teaching includes daily weights, medication adherence, sodium guidance, symptom monitoring, activity pacing, follow-up, and when to seek urgent help.",
          "Evaluation should be measurable: stable oxygenation, improved breathing, reduced edema or weight trend, safe medication understanding, and accurate teach-back.",
        ],
      },
    ],
    clinicalPearls: [
      "A care plan is stronger when each intervention responds to a specific patient cue.",
      "Heart failure teaching should always include what to do when symptoms worsen, not just what heart failure is.",
    ],
    commonMistakes: [
      "Using excess fluid volume for every heart failure patient without showing evidence.",
      "Listing interventions without rationales or measurable evaluation criteria.",
    ],
    faqs: [
      {
        question: "What is the priority nursing diagnosis for heart failure?",
        answer: "It depends on the patient cues. Impaired gas exchange or decreased cardiac output may be highest when oxygenation or perfusion is threatened; excess fluid volume is common when congestion dominates.",
      },
    ],
    related: [
      { label: "Heart Failure", href: "/healthcare/conditions/heart-failure", category: "conditions" },
      { label: "Furosemide", href: "/healthcare/medications/furosemide", category: "medications" },
      { label: "Nursing Care Plan Generator", href: "/tools/care-plan", category: "lesson" },
    ],
    references: [
      { title: "Heart Failure", source: "MedlinePlus", url: "https://medlineplus.gov/heartfailure.html" },
      { title: "Heart Failure Guidelines", source: "American Heart Association", url: "https://www.heart.org/" },
    ],
  },
];

export function getAuthorityPages(): AuthorityPage[] {
  return [...AUTHORITY_CONTENT_PAGES].sort((a, b) => a.title.localeCompare(b.title));
}

export function getAuthorityPagesByCategory(category: AuthorityContentCategory): AuthorityPage[] {
  return getAuthorityPages().filter((page) => page.category === category);
}

export function getAuthorityPage(category: string, slug: string): AuthorityPage | null {
  return AUTHORITY_CONTENT_PAGES.find((page) => page.category === category && page.slug === slug) ?? null;
}

export function searchAuthorityContent(query: string, limit = 8): AuthorityPage[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAuthorityPages().slice(0, limit);
  return getAuthorityPages()
    .map((page) => {
      const haystack = [page.title, page.summary, page.deck, ...page.synonyms, ...page.sections.map((section) => section.title)].join(" ").toLowerCase();
      const score = haystack.includes(q) ? 3 : page.synonyms.some((synonym) => synonym.toLowerCase().includes(q)) ? 2 : 0;
      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
    .slice(0, limit)
    .map((item) => item.page);
}

export function validateAuthorityPage(page: AuthorityPage): { score: number; issues: string[]; publishReady: boolean } {
  const issues: string[] = [];
  if (page.sections.length < 3) issues.push("missing_required_sections");
  if (page.references.length < 2) issues.push("insufficient_references");
  if (!page.reviewer.name || !page.reviewer.credentials || !page.reviewer.reviewedAt) issues.push("missing_reviewer");
  if (!page.governance.updatedAt || !page.governance.reviewCycleDue) issues.push("missing_governance_dates");
  if (page.related.length < 3) issues.push("weak_internal_linking");
  if (page.clinicalPearls.length < 2) issues.push("insufficient_clinical_pearls");
  if (page.commonMistakes.length < 2) issues.push("insufficient_common_mistakes");
  if (page.sections.some((section) => section.body.join(" ").length < 140)) issues.push("thin_section");
  const score = Math.max(0, 100 - issues.length * 10);
  return { score, issues, publishReady: score >= 85 && issues.length === 0 };
}

export function buildAuthorityBreadcrumbs(page?: AuthorityPage) {
  const base = [
    { name: "Home", href: "/" },
    { name: "Healthcare Library", href: "/healthcare" },
  ];
  if (!page) return base;
  return [
    ...base,
    { name: AUTHORITY_CATEGORY_META[page.category].title, href: `/healthcare#${page.category}` },
    { name: page.title, href: `/healthcare/${page.category}/${page.slug}` },
  ];
}

export function buildAuthorityJsonLd(page: AuthorityPage) {
  const path = `/healthcare/${page.category}/${page.slug}`;
  const url = absoluteUrl(path);
  return [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.summary,
      datePublished: page.governance.publishedAt,
      dateModified: page.governance.updatedAt,
      reviewedBy: {
        "@type": "Person",
        name: page.reviewer.name,
        honorificSuffix: page.reviewer.credentials,
        knowsAbout: page.reviewer.specialty,
      },
      publisher: {
        "@type": "Organization",
        name: "NurseNest",
        url: absoluteUrl("/"),
      },
      about: page.synonyms.map((name) => ({ "@type": "MedicalCondition", name })),
      citation: page.references.map((reference) => reference.url),
      isPartOf: {
        "@type": "WebSite",
        name: "NurseNest",
        url: absoluteUrl("/"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];
}
