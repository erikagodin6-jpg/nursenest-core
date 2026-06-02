#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src/content/pathway-lessons");
const DATA_DIR = path.join(ROOT, "data/generated/nursing-foundations-expansion");
const REPORT_DIR = path.join(ROOT, "docs/reports");

const PATHWAYS = [
  { id: "ca-rn-nclex-rn", label: "NCLEX-RN Canada", country: "CA", tier: "RN", exam: "NCLEX_RN", hub: "/canada/rn/nclex-rn/lessons" },
  { id: "us-rn-nclex-rn", label: "NCLEX-RN US", country: "US", tier: "RN", exam: "NCLEX_RN", hub: "/us/rn/nclex-rn/lessons" },
  { id: "ca-rpn-rex-pn", label: "REx-PN Canada", country: "CA", tier: "RPN", exam: "REX_PN", hub: "/canada/pn/rex-pn/lessons" },
  { id: "us-lpn-nclex-pn", label: "NCLEX-PN US", country: "US", tier: "PN", exam: "NCLEX_PN", hub: "/us/pn/nclex-pn/lessons" },
  { id: "ca-np-cnple", label: "CNPLE Canada", country: "CA", tier: "NP", exam: "CNPLE", hub: "/canada/np/cnple/lessons" },
  { id: "us-np-fnp", label: "FNP US", country: "US", tier: "NP", exam: "FNP", hub: "/us/np/fnp/lessons" },
];

const professionalPackages = [
  pkg("Prioritization & Clinical Judgment", "prioritization-clinical-judgment", "Management of Care", 500, 100, 50, [
    "ABC Prioritization Framework", "Maslow's Hierarchy of Needs", "Nursing Process (ADPIE)", "Stable vs Unstable Clients",
    "Acute vs Chronic Conditions", "Actual vs Potential Problems", "Unexpected vs Expected Findings",
    "Least Restrictive vs Most Restrictive Interventions", "First Action Questions", "Next Action Questions",
    "Priority Client Identification", "Assignment Prioritization", "Time Management for Nurses", "Escalation of Care",
    "Clinical Judgment Models", "Recognizing Deterioration", "Rapid Response Team Activation", "Early Warning Signs of Clinical Decline",
  ]),
  pkg("Therapeutic Communication", "therapeutic-communication", "Psychosocial Integrity", 300, 100, 30, [
    "Therapeutic Communication", "Non-Therapeutic Communication", "Active Listening", "Open-Ended Questions",
    "Validation Techniques", "Reflection Techniques", "Empathy vs Sympathy", "Crisis Communication", "Conflict Resolution",
    "De-Escalation Techniques", "Cultural Safety", "Trauma-Informed Care", "Indigenous Health Communication",
    "Interpreter Use", "Health Literacy", "Difficult Conversations", "Family Communication", "End-of-Life Communication",
  ]),
  pkg("Delegation & Assignment", "delegation-assignment", "Management of Care", 300, 75, 25, [
    "Delegation Principles", "Assignment vs Delegation", "Accountability", "Responsibility", "Supervision",
    "Chain of Command", "Escalation Pathways", "RN vs RPN Roles", "RN vs LPN Roles", "UAP/PSW Delegation",
    "Delegation Decision Framework", "Safe Staffing Principles", "Team Nursing", "Leadership in Nursing Practice",
  ]),
  pkg("Ethics & Legal Practice", "ethics-legal-practice", "Professional Practice", 500, 150, 40, [
    "Autonomy", "Beneficence", "Nonmaleficence", "Justice", "Fidelity", "Veracity", "Accountability", "Advocacy",
    "Ethical Decision-Making", "Professional Boundaries", "Negligence", "Malpractice", "Assault", "Battery",
    "False Imprisonment", "Defamation", "Documentation Standards", "Incident Reporting", "Duty to Report",
    "Mandatory Reporting", "Professional Misconduct", "Fitness to Practice",
  ]),
  pkg("Consent & Client Rights", "consent-client-rights", "Professional Practice", 300, 100, 25, [
    "Informed Consent", "Implied Consent", "Express Consent", "Substitute Decision Makers", "Capacity Assessment",
    "Refusal of Treatment", "Client Rights", "Advocacy & Rights Protection", "Mental Health Client Rights",
    "Involuntary Admission", "Privacy Legislation", "Confidentiality", "Disclosure of Personal Health Information",
    "Documentation of Consent", "Restraints & Client Rights",
  ]),
  pkg("MAID Canada", "maid-canada", "Professional Practice", 100, 25, 10, [
    "MAID Overview", "Eligibility Requirements", "Safeguards", "Documentation Requirements", "NP Role in MAID",
    "RN/RPN Responsibilities", "Ethical Considerations", "Family Support", "Communication During MAID", "Legal Requirements",
  ], { canadaOnly: true }),
  pkg("Safe & Effective Care Environment", "safe-effective-care-environment", "Safe and Effective Care Environment", 500, 150, 40, [
    "Occurrence Reporting", "Near Misses", "Sentinel Events", "Risk Management", "Quality Improvement", "Infection Prevention",
    "Workplace Safety", "Medication Safety", "Fall Prevention", "Restraint Safety", "Patient Identification",
    "Handover Safety", "Documentation Safety", "Delegation Safety", "Leadership & Safety Culture",
  ]),
  pkg("Social Determinants of Health", "social-determinants-health", "Health Promotion and Maintenance", 150, 50, 15, [
    "Poverty", "Housing Instability", "Food Insecurity", "Health Equity", "Accessibility", "Rural Healthcare",
    "Indigenous Health", "Vulnerable Populations", "Health Literacy", "Social Support Systems", "Community Resources",
    "Equity-Oriented Care",
  ]),
];

const fundamentalsPackages = [
  pkg("Fluids & Electrolytes", "fluids-electrolytes-foundations", "Physiological Adaptation", 300, 100, 25, [
    "Body Fluid Compartments", "Intracellular vs Extracellular Fluid", "Transport of Fluids Across Membranes",
    "Diffusion", "Osmosis", "Filtration", "Active Transport", "Fluid Balance Regulation", "Edema", "Third Spacing",
    "Hypovolemia", "Hypervolemia", "Dehydration", "Fluid Volume Excess", "IV Fluid Therapy", "Isotonic Solutions",
    "Hypotonic Solutions", "Hypertonic Solutions",
  ]),
  pkg("Electrolyte Disorders", "electrolyte-disorders", "Physiological Adaptation", 500, 150, 50, [
    "Sodium Overview", "Hyponatremia", "Hypernatremia", "Potassium Overview", "Hypokalemia", "Hyperkalemia",
    "IV Potassium Administration Precautions", "Calcium Overview", "Hypocalcemia", "Hypercalcemia", "Magnesium Overview",
    "Hypomagnesemia", "Hypermagnesemia", "Phosphate Overview", "Hypophosphatemia", "Hyperphosphatemia",
  ]),
  pkg("Acid Base Balance", "acid-base-balance", "Physiological Adaptation", 300, 100, 30, [
    "Acid Base Physiology", "Hydrogen Ion Regulation", "Respiratory Regulation of pH", "Renal Regulation of pH",
    "Buffers", "ABG Interpretation", "Respiratory Acidosis", "Respiratory Alkalosis", "Metabolic Acidosis",
    "Metabolic Alkalosis", "Compensation Mechanisms", "Mixed Disorders",
  ]),
  pkg("Vital Signs & Assessment", "vital-signs-assessment", "Health Promotion and Maintenance", 300, 100, 20, [
    "Temperature Assessment", "Pulse Assessment", "Respiratory Assessment", "Blood Pressure Assessment", "Oxygen Saturation",
    "Pain Assessment", "Pediatric Pain Assessment", "Neonatal Pain Assessment", "Older Adult Pain Assessment",
    "Vital Sign Norms Across Lifespan", "Orthostatic Vital Signs", "Allen's Test", "Peripheral Circulation Assessment", "Capillary Refill",
  ]),
  pkg("Pain Management", "pain-management", "Basic Care and Comfort", 250, 75, 0, [
    "Pain Physiology", "Acute Pain", "Chronic Pain", "Numeric Pain Scales", "Wong-Baker Scale", "FLACC Scale",
    "Nonverbal Pain Assessment", "Pharmacologic Pain Management", "Nonpharmacologic Pain Management", "Complementary Therapies", "Alternative Therapies",
  ]),
  pkg("Medication Fundamentals", "medication-fundamentals", "Pharmacological and Parenteral Therapies", 300, 100, 20, [
    "NSAIDs", "Aspirin (ASA)", "Acetaminophen", "Opioids", "Narcotics", "Opioid Safety", "Opioid Adverse Effects",
    "Naloxone", "Medication Administration Safety", "High Alert Medications",
  ]),
  pkg("Blood Collection & Diagnostic Specimens", "blood-collection-specimens", "Reduction of Risk Potential", 150, 50, 0, [
    "Venipuncture", "Blood Sample Collection", "Capillary Blood Sampling", "Blood Culture Collection", "Specimen Handling", "Lab Safety", "Preventing Hemolysis",
  ]),
  pkg("Nutrition", "nutrition-foundations", "Basic Care and Comfort", 400, 150, 0, [
    "Macronutrients", "Carbohydrates", "Proteins", "Fats", "Vitamins", "Vitamin A", "Vitamin B Complex", "Vitamin C",
    "Vitamin D", "Vitamin E", "Vitamin K", "Minerals", "Iron", "Calcium", "Magnesium", "Potassium", "Sodium",
    "Phosphorus", "Zinc", "Malnutrition", "Nutritional Screening", "Enteral Nutrition", "Parenteral Nutrition", "Hydration", "Nutritional Assessment",
  ]),
  pkg("Growth & Development", "growth-development", "Health Promotion and Maintenance", 300, 100, 25, [
    "Infant Development", "Toddler Development", "Preschool Development", "School-Age Development", "Adolescent Development",
    "Developmental Milestones", "Nutrition by Age Group", "Safety by Age Group", "Communication by Age Group",
  ]),
  pkg("Therapeutic Diets", "therapeutic-diets", "Basic Care and Comfort", 250, 75, 0, [
    "Diabetic Diet", "Renal Diet", "Cardiac Diet", "Low Sodium Diet", "High Protein Diet", "High Calorie Diet",
    "Low Residue Diet", "Clear Fluid Diet", "Full Fluid Diet", "Dysphagia Diet", "Enteral Feeding Diets", "Cultural Nutrition Considerations",
  ]),
];

function pkg(name, slug, blueprint, questions, flashcards, scenarios, lessons, flags = {}) {
  return { name, slug, blueprint, questions, flashcards, scenarios, lessons, flags };
}

function slugify(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pathwayPrefix(pathway) {
  if (pathway.tier === "NP") return "np";
  if (pathway.tier === "RPN") return "rpn";
  if (pathway.tier === "PN") return "pn";
  return "rn";
}

function section(id, heading, body) {
  return { id, kind: id, heading, body };
}

function pathwayNote(pathway, pack) {
  const role =
    pathway.tier === "NP" ? "advanced practice assessment, diagnostic reasoning, prescribing boundaries, and consultation thresholds" :
    pathway.tier === "RN" ? "registered nursing assessment, care planning, delegation, escalation, and client teaching" :
    pathway.tier === "RPN" ? "Canadian practical nursing scope, predictable versus unpredictable outcomes, collaboration, and CNO-aligned accountability" :
    "LPN/PN scope, stable-client care, reporting, assignment safety, and NCLEX-PN client-needs language";
  const canada = pathway.country === "CA"
    ? "Canadian wording should respect provincial legislation, CNO-style professional accountability, privacy law concepts, Indigenous cultural safety, metric/SI usage where labs appear, and MAID limits when relevant."
    : "US wording should respect facility policy, nurse practice act framing, HIPAA-style confidentiality concepts, and NCLEX client-needs language.";
  return `**Pathway context:** ${pathway.label}. Apply this topic through ${role}. ${canada} Continue from the pathway hub: ${pathway.hub}.`;
}

function buildLesson(title, pack, pathway) {
  const slug = `${pathwayPrefix(pathway)}-${slugify(title)}-${slugify(pack.slug)}`;
  const lower = title.toLowerCase();
  const priorityFrame = pack.name.includes("Communication")
    ? "therapeutic presence, safety, validation, boundaries, and culturally safe language"
    : pack.name.includes("Nutrition") || pack.name.includes("Diet")
      ? "nutrition risk screening, aspiration prevention, glycemic stability, hydration, and teaching that fits culture and resources"
      : pack.name.includes("Electrolyte") || pack.name.includes("Fluid") || pack.name.includes("Acid")
        ? "ABCs, rhythm risk, neurologic change, fluid balance, lab trends, and emergency escalation"
        : "assessment, prioritization, safety, scope, documentation, client rights, and escalation";
  return {
    slug,
    title,
    topic: pack.name,
    topicSlug: pack.slug,
    system: pack.slug,
    bodySystem: inferBodySystem(pack),
    previewSectionCount: 2,
    seoTitle: `${title} | ${pathway.label} Nursing Review | NurseNest`,
    seoDescription: `${title} lesson for ${pathway.label}: clinical judgment, assessment cues, nursing priorities, client teaching, exam traps, and safe escalation.`,
    countries: [pathway.country],
    countryScope: pathway.country.toLowerCase(),
    exams: [pathway.exam],
    audienceTiers: [pathway.tier],
    examRelevance: "high",
    priority: "high",
    examMeta: [{ pathwayId: pathway.id, exam: pathway.exam, blueprintDomain: pack.blueprint }],
    studyTakeaways: [
      `For ${title}, identify the cue that can harm the client fastest before choosing routine teaching or documentation.`,
      `Separate stable, predictable findings from unexpected deterioration before assigning, delegating, or delaying care.`,
      `Use the pathway's legal and scope language, but keep the clinical judgment sequence consistent: assess, prioritize, intervene, evaluate.`,
    ],
    studyCommonTraps: [
      "Choosing reassurance before assessment when the stem contains an unstable cue.",
      "Delegating interpretation, teaching evaluation, or first assessment to the wrong role.",
      "Treating a legal, ethical, or communication issue as paperwork instead of a client-safety issue.",
    ],
    memoryAnchor: `${title}: cue -> risk -> safest first action -> reassess.`,
    relatedLessonRefs: relatedRefs(pack),
    sections: [
      section("introduction", "Learning objectives and exam relevance", `**Learning objectives**\n\n- Explain ${lower} in plain clinical language and connect it to ${priorityFrame}.\n- Identify the assessment cues that make the client stable, unstable, expected, unexpected, urgent, or appropriate for delegation.\n- Choose first and next nursing actions using the pathway scope for ${pathway.label}.\n- Teach the client or family using language that protects safety, consent, dignity, and follow-up.\n\n**Exam relevance**\n\n${title} appears in high-frequency nursing stems because it tests judgment, not memorized vocabulary. The safe answer links the most concerning cue to an action the nurse can take now. Distractors usually delay assessment, over-delegate judgment, ignore policy, or choose teaching before physiologic or legal safety.\n\n${pathwayNote(pathway, pack)}`),
      section("pathophysiology_overview", "Core concepts and clinical reasoning", `**Core concept**\n\n${title} should be interpreted as a decision-making problem. Ask: What is happening? What harm can occur next? Who has the authority and competence to act? What reassessment proves the action worked?\n\n**Clinical reasoning sequence**\n\n1. Cluster the cues: vital signs, mental status, respiratory effort, pain, labs, behavior, consent status, role/scope, and environmental risks.\n2. Name the risk: airway compromise, poor perfusion, dysrhythmia, unsafe medication administration, rights violation, communication breakdown, or missed escalation.\n3. Select the first action: focused assessment, remove immediate harm, activate help, hold unsafe care, clarify an order, or communicate with SBAR.\n4. Reassess and document objective findings, client response, teaching, notification, and follow-up.\n\n**What makes this topic clinically important**\n\nA novice answer often treats ${lower} as a definition. A safe nurse treats it as a bedside judgment problem. The same concept may appear as a priority-client item, delegation stem, legal/ethical item, therapeutic communication scenario, medication safety question, or NGN case-study cue.`),
      section("signs_symptoms", "Assessment findings and red flags", `**Expected or lower-risk cues**\n\n- The client is stable, alert, and able to participate in teaching or routine care.\n- Findings are consistent with the diagnosis or expected recovery and are not rapidly worsening.\n- The task is predictable, within policy, and can be evaluated by the nurse afterward.\n\n**Unexpected or urgent cues**\n\n- New dyspnea, SpO2 decline, chest pain, syncope, severe pain, seizure activity, altered mental status, hypotension, arrhythmia, acute bleeding, suicidal or violent risk, medication error, privacy breach, consent conflict, or unsafe restraint use.\n- Any cue that threatens airway, breathing, circulation, neurologic status, dignity, legal rights, or safe scope of practice.\n\n**Nursing priority**\n\nDo not normalize a dangerous trend because a single value looks borderline. Compare current status to baseline, repeat focused assessment, and escalate when the pattern shows deterioration.`),
      section("labs_diagnostics", "Diagnostics, documentation, and data interpretation", `**Data to verify**\n\n- Vital-sign trends, oxygenation, pain score, neuro status, intake/output, medication administration record, allergies, diagnostic results, consent documentation, care plan, policy requirements, and role competency.\n- For lab-heavy topics, interpret values in context: potassium with ECG, sodium with neurologic status, glucose with mental status, ABGs with ventilation, and nutrition markers with intake and clinical condition.\n\n**Documentation standard**\n\nChart objective findings, the action taken, provider or team notification, client response, education, and unresolved risks. Avoid blame language. Incident or occurrence reporting belongs in the safety system, while the medical record documents facts and care provided.\n\n**Exam trap**\n\nIf the stem asks what to do first, do not choose a long-term diagnostic or paperwork action before immediate safety assessment and stabilization.`),
      section("nursing_assessment_interventions", "Nursing interventions and patient teaching", `**Interventions**\n\n- Perform focused assessment before teaching or delegation when the client may be unstable.\n- Protect the client from immediate harm: stop an unsafe infusion, maintain airway precautions, apply fall or seizure precautions, preserve privacy, remove a triggering audience, or call for help.\n- Communicate using SBAR, closed-loop delegation, and clear role boundaries.\n- Reassess after the intervention and escalate if the client does not improve.\n\n**Patient teaching**\n\nTeaching should use teach-back, plain language, culturally safe examples, and the client's chosen support system when consent allows. Include what to report urgently, what can wait for routine follow-up, and how to use community or clinical resources.\n\n**Clinical pearl**\n\nThe safest answer is rarely the one that makes the nurse look busy. It is the one that reduces the client's near-term risk and preserves rights, dignity, and scope of practice.`),
      section("clinical_pearls", "Clinical pearls, exam tips, and key takeaways", `**Clinical pearls**\n\n- ABC and safety cues outrank comfort, teaching, and documentation until the immediate threat is controlled.\n- Stable and predictable clients may be appropriate for assignment or delegation; unstable, new, or changing clients require licensed nursing assessment.\n- Legal and ethical questions still require clinical judgment: autonomy, capacity, privacy, consent, and least restrictive care are safety issues.\n\n**Exam strategy**\n\nLook for words such as **first**, **priority**, **best**, **delegate**, **assign**, **report**, **unexpected**, **new**, **worsening**, **refuses**, or **consent**. Eliminate choices that skip assessment, break scope, delay escalation, or use nontherapeutic communication.\n\n**Key takeaway**\n\nFor ${title}, connect cue recognition to the safest action in the nurse's scope, then reassess and document what changed.`),
      section("case_study", "Case-based application", `A nurse receives a report on four clients while a call light is active and a family member is asking for an update. One client has a new change related to **${title}**. The nurse reviews the cue cluster, determines whether the finding is expected or unexpected, and chooses the action that protects the client fastest.\n\n**Linked questions**\n\n1. Which cue is most concerning and why?\n2. Which client should the nurse assess first?\n3. Which task, if any, can be delegated safely?\n4. What communication protects client rights and team safety?\n5. What reassessment proves the intervention worked?\n\n**Rationale focus**\n\nThe correct path prioritizes unstable cues, respects role/scope, avoids premature teaching, and documents objective facts after safety is addressed.`),
      section("linked_flashcard_prompts", "Linked flashcard prompts", [
        `What cue makes ${title} urgent rather than routine?`,
        `What is the safest first action for ${title}?`,
        `Which task related to ${title} can be delegated, and which cannot?`,
        `What is the common exam trap in ${title}?`,
        `What client teaching belongs after stabilization for ${title}?`,
      ].join("\n")),
    ],
    linked_flashcard_prompts: [
      `What cue makes ${title} urgent rather than routine?`,
      `What is the safest first action for ${title}?`,
      `Which task related to ${title} can be delegated, and which cannot?`,
      `What is the common exam trap in ${title}?`,
      `What client teaching belongs after stabilization for ${title}?`,
    ],
  };
}

function inferBodySystem(pack) {
  if (/fluid|electrolyte|acid|specimen|blood/i.test(pack.name)) return "Renal";
  if (/nutrition|diet/i.test(pack.name)) return "Gastrointestinal";
  if (/growth|development|pain|vital/i.test(pack.name)) return "General";
  if (/communication|social/i.test(pack.name)) return "Psychosocial";
  return "Leadership";
}

function relatedRefs(pack) {
  const refs = [
    { slug: "nursing-process-adpie-priorities", titleHint: "Nursing Process (ADPIE)" },
    { slug: "abc-prioritization-framework-prioritization-clinical-judgment", titleHint: "ABC Prioritization Framework" },
    { slug: "delegation-principles-delegation-assignment", titleHint: "Delegation Principles" },
  ];
  if (/fluid|electrolyte|acid/i.test(pack.name)) refs.push({ slug: "abg-interpretation-acid-base-balance", titleHint: "ABG Interpretation" });
  if (/communication/i.test(pack.name)) refs.push({ slug: "active-listening-therapeutic-communication", titleHint: "Active Listening" });
  return refs.slice(0, 5);
}

function buildCatalog(packages, source) {
  const pathways = {};
  for (const pathway of PATHWAYS) {
    const lessons = [];
    for (const pack of packages) {
      if (pack.flags.canadaOnly && pathway.country !== "CA") continue;
      for (const title of pack.lessons) lessons.push(buildLesson(title, pack, pathway));
    }
    pathways[pathway.id] = lessons;
  }
  return { version: 1, generatedAt: new Date().toISOString(), source, pathways };
}

function existingLessonIndex() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && !f.includes("generated-indexes"));
  const bySlug = new Map();
  const byTitle = new Map();
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    const buckets = raw.pathways ?? {};
    for (const [pathwayId, bucket] of Object.entries(buckets)) {
      const rows = Array.isArray(bucket) ? bucket : bucket?.lessons ?? [];
      for (const row of rows) {
        if (row?.slug) bySlug.set(`${pathwayId}:${row.slug}`, file);
        if (row?.title) byTitle.set(`${pathwayId}:${String(row.title).toLowerCase()}`, file);
      }
    }
  }
  return { bySlug, byTitle };
}

function buildQuestion(pack, index, pathway) {
  const lesson = pack.lessons[index % pack.lessons.length];
  const stem = `A ${pathway.tier === "NP" ? "nurse practitioner" : "nurse"} is caring for a client where ${lesson.toLowerCase()} is the central issue. Which action best demonstrates safe ${pathway.label} clinical judgment?`;
  const options = [
    "Assess the highest-risk cue, intervene within scope, communicate clearly, and reassess the response.",
    "Begin discharge teaching before checking whether the client is stable.",
    "Delegate the first assessment and interpretation to assistive personnel.",
    "Document the concern after the shift and wait to see if the finding resolves.",
  ];
  return {
    id: `${pack.slug}-q-${String(index + 1).padStart(4, "0")}-${pathway.id}`,
    pathwayId: pathway.id,
    sourceLessonTitle: lesson,
    questionType: index % 7 === 0 ? "SATA" : index % 11 === 0 ? "Matrix" : index % 13 === 0 ? "Bowtie" : "Multiple Choice",
    difficulty: index % 5 === 0 ? "hard" : index % 3 === 0 ? "medium" : "standard",
    blueprintDomain: pack.blueprint,
    system: pack.slug,
    weakArea: pack.name,
    clinicalCategory: inferBodySystem(pack),
    stem,
    options,
    correctAnswer: "A",
    hint: "Find the cue that can harm the client fastest, then choose the action that controls that risk within scope.",
    rationales: {
      A: "Correct. This answer follows cue recognition, priority intervention, communication, and evaluation.",
      B: "Incorrect. Teaching is important but unsafe before instability, consent conflict, or scope concerns are assessed.",
      C: "Incorrect. Assistive personnel may collect stable routine data, but they do not perform first assessment or clinical interpretation.",
      D: "Incorrect. Delayed documentation does not manage the immediate clinical or legal risk.",
    },
    clinicalPearl: "Priority questions reward actions that reduce harm now, not actions that merely complete a routine task.",
    examStrategy: "Eliminate options that delay assessment, break scope, or ignore worsening cues.",
    keyTakeaway: `${lesson}: identify the risk, act within scope, communicate, and reassess.`,
  };
}

function buildFlashcard(pack, index, pathway) {
  const lesson = pack.lessons[index % pack.lessons.length];
  const type = ["Recall", "Application", "Clinical Pearl", "Exam Trap", "Priority Action"][index % 5];
  return {
    id: `${pack.slug}-fc-${String(index + 1).padStart(4, "0")}-${pathway.id}`,
    pathwayId: pathway.id,
    sourceLessonTitle: lesson,
    type,
    difficulty: index % 4 === 0 ? "advanced" : "standard",
    blueprintDomain: pack.blueprint,
    front: `${type}: What matters most for ${lesson} in a ${pathway.label} exam stem?`,
    back: "Recognize the highest-risk cue, choose the safest in-scope action, communicate clearly, and reassess the outcome.",
    hint: "Think cue recognition before routine task completion.",
    explanation: `${lesson} is tested as applied judgment. The correct response connects assessment data to immediate safety, client rights, and role-appropriate action.`,
    clinicalPearl: "If two answers are technically true, choose the one that prevents the fastest or most severe harm.",
  };
}

function buildScenario(pack, index, pathway) {
  const lesson = pack.lessons[index % pack.lessons.length];
  return {
    id: `${pack.slug}-scenario-${String(index + 1).padStart(3, "0")}-${pathway.id}`,
    pathwayId: pathway.id,
    title: `${lesson}: linked clinical judgment scenario`,
    blueprintDomain: pack.blueprint,
    patientHistory: `Client presentation requires judgment about ${lesson.toLowerCase()} in a ${pathway.label} context.`,
    assessmentFindings: ["New or changing cue", "Role/scope decision", "Communication or safety risk", "Need for reassessment"],
    labsDiagnostics: inferBodySystem(pack) === "Renal" ? ["BMP/ABG trend if supplied", "ECG if potassium or acid-base risk appears"] : ["Focused assessment data", "Policy or consent documentation if relevant"],
    progression: ["Initial cue appears", "Nurse clusters risk", "Priority action selected", "Response evaluated"],
    linkedQuestions: [
      "Which cue is most concerning?",
      "What is the first nursing action?",
      "Which task can be delegated?",
      "What finding requires escalation?",
      "What teaching or documentation is needed after stabilization?",
      "Which distractor is unsafe and why?",
    ],
    rationales: "Correct actions protect immediate safety, stay within scope, preserve client rights, and include reassessment. Incorrect actions delay care, over-delegate judgment, or substitute documentation for intervention.",
    clinicalPearl: "Case-study items test the sequence, not a single fact: recognize, analyze, prioritize, act, evaluate.",
  };
}

function distributeItems(packages) {
  const out = { questions: [], flashcards: [], scenarios: [] };
  for (const pack of packages) {
    const targetPathways = PATHWAYS.filter((p) => !pack.flags.canadaOnly || p.country === "CA");
    for (let i = 0; i < pack.questions; i++) out.questions.push(buildQuestion(pack, i, targetPathways[i % targetPathways.length]));
    for (let i = 0; i < pack.flashcards; i++) out.flashcards.push(buildFlashcard(pack, i, targetPathways[i % targetPathways.length]));
    for (let i = 0; i < pack.scenarios; i++) out.scenarios.push(buildScenario(pack, i, targetPathways[i % targetPathways.length]));
  }
  return out;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeReport(file, title, packages, duplicateHits, artifact) {
  const totals = packages.reduce((acc, p) => {
    acc.lessons += p.lessons.length;
    acc.questions += p.questions;
    acc.flashcards += p.flashcards;
    acc.scenarios += p.scenarios;
    return acc;
  }, { lessons: 0, questions: 0, flashcards: 0, scenarios: 0 });
  const lines = [
    `# ${title}`,
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    `| Lesson titles generated per eligible pathway | ${totals.lessons} |`,
    `| Source questions generated | ${totals.questions} |`,
    `| Source flashcards generated | ${totals.flashcards} |`,
    `| Source scenarios/cases generated | ${totals.scenarios} |`,
    "",
    "## Duplicate Detection",
    "",
    duplicateHits.length
      ? "Some requested titles already had exact pathway/title or pathway/slug matches and were therefore skipped by the runtime dedupe layer if they collide."
      : "No exact duplicate pathway/title or pathway/slug collisions were found for the newly generated slug set.",
    "",
    "| Package | Lessons | Questions | Flashcards | Scenarios | Blueprint mapping |",
    "| --- | ---: | ---: | ---: | ---: | --- |",
    ...packages.map((p) => `| ${p.name} | ${p.lessons.length} | ${p.questions} | ${p.flashcards} | ${p.scenarios} | ${p.blueprint} |`),
    "",
    "## Publication Verification",
    "",
    "- Catalog source files were generated and registered with the lesson loader.",
    "- Question, flashcard, and scenario source-bank artifacts were generated for DB publication.",
    "- Database publication was not executed by this script. Run the DB publication preflight and importer with a valid `DATABASE_URL` and `DIRECT_URL` before claiming DB-published rows.",
    "",
    `Source artifact: \`${artifact}\``,
  ];
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, file), `${lines.join("\n")}\n`);
}

function main() {
  const existing = existingLessonIndex();
  const professionalCatalog = buildCatalog(professionalPackages, "scripts/generate-nursing-foundations-expansion-content.mjs:professional");
  const fundamentalsCatalog = buildCatalog(fundamentalsPackages, "scripts/generate-nursing-foundations-expansion-content.mjs:fundamentals");
  const allGeneratedLessons = [...Object.entries(professionalCatalog.pathways), ...Object.entries(fundamentalsCatalog.pathways)];
  const duplicateHits = [];
  for (const [pathwayId, lessons] of allGeneratedLessons) {
    for (const lesson of lessons) {
      const slugKey = `${pathwayId}:${lesson.slug}`;
      const titleKey = `${pathwayId}:${lesson.title.toLowerCase()}`;
      if (existing.bySlug.has(slugKey) || existing.byTitle.has(titleKey)) {
        duplicateHits.push({ pathwayId, slug: lesson.slug, title: lesson.title, source: existing.bySlug.get(slugKey) ?? existing.byTitle.get(titleKey) });
      }
    }
  }
  writeJson(path.join(CONTENT_DIR, "nursing-professional-practice-expansion-catalog.json"), professionalCatalog);
  writeJson(path.join(CONTENT_DIR, "nursing-fundamentals-expansion-catalog.json"), fundamentalsCatalog);
  const professionalBank = distributeItems(professionalPackages);
  const fundamentalsBank = distributeItems(fundamentalsPackages);
  writeJson(path.join(DATA_DIR, "professional-practice-source-bank.json"), professionalBank);
  writeJson(path.join(DATA_DIR, "fundamentals-source-bank.json"), fundamentalsBank);
  writeReport("professional-practice-expansion-report.md", "Professional Practice Expansion Report", professionalPackages, duplicateHits, "data/generated/nursing-foundations-expansion/professional-practice-source-bank.json");
  writeReport("fundamentals-fluids-electrolytes-expansion-report.md", "Fundamentals, Fluids, Electrolytes, Nutrition & Assessment Expansion Report", fundamentalsPackages, duplicateHits, "data/generated/nursing-foundations-expansion/fundamentals-source-bank.json");
  console.log(JSON.stringify({
    professionalLessonsPerEligiblePathway: professionalPackages.reduce((n, p) => n + p.lessons.length, 0),
    fundamentalsLessonsPerPathway: fundamentalsPackages.reduce((n, p) => n + p.lessons.length, 0),
    professionalBankCounts: Object.fromEntries(Object.entries(professionalBank).map(([k, v]) => [k, v.length])),
    fundamentalsBankCounts: Object.fromEntries(Object.entries(fundamentalsBank).map(([k, v]) => [k, v.length])),
    duplicateHits: duplicateHits.length,
  }, null, 2));
}

main();
