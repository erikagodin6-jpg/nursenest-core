/**
 * Remaining 35 PostSpec rows for generate-nclex-rn-us-longtail-batch-40.mts.
 * Deterministic template expansion — no external APIs.
 */
type LinkRow = { href: string; label: string };

export type PostSpec = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  introduction: string[];
  whyMatters: string[];
  pathophysiology: string[];
  assessmentParas: string[];
  assessmentBullets: string[];
  interventionsParas: string[];
  interventionsList: string[];
  medicationsParas: string[];
  medicationsBullets: string[];
  delegationParas: string[];
  delegationBullets: string[];
  ngnParas: string[];
  teachingParas: string[];
  teachingBullets: string[];
  safetyParas: string[];
  safetyBullets: string[];
  commonMistakes: string[];
  examReviewPoints: string[];
  keyTakeaways: string[];
  internalLinks: LinkRow[];
  faqs: { q: string; a: string }[];
  references: string[];
};

function paras(topic: string, lens: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const k = i + 1;
    return `U.S. NCLEX-RN preparation for ${topic} (${lens}, part ${k}) favors translation-friendly English, explicit assessment language, and nursing actions that stay inside RN scope. You connect subjective and objective data to the physiologic threat, choose the option that prevents the next predictable complication, and document reassessment after every change. Items often hide distractors such as premature teaching, independent medication changes, or delayed escalation; the safest path pairs protocols with timely SBAR communication. NurseNest learners can reinforce this pattern by alternating short reading blocks with adaptive practice so ${topic.toLowerCase()} stems feel automatic rather than intimidating.`;
  });
}

function buildPost(input: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  extraTags: string[];
  topic: string;
  linkKeys: string[];
  lk: Record<string, LinkRow>;
  sharedTags: string[];
  ngnSentence: string;
}): PostSpec {
  const { slug, title, excerpt, category, extraTags, topic, linkKeys, lk, sharedTags, ngnSentence } = input;
  const internalLinks = linkKeys.map((k) => lk[k]).filter(Boolean) as LinkRow[];
  const tags = [...sharedTags, ...extraTags];
  return {
    slug,
    title,
    excerpt,
    category,
    tags,
    seoTitle: title.length > 62 ? `${title.slice(0, 58).trim()}…` : title,
    seoDescription: excerpt.length > 165 ? `${excerpt.slice(0, 162).trim()}…` : excerpt,
    introduction: paras(topic, "introduction", 4),
    whyMatters: paras(topic, "exam relevance", 3),
    pathophysiology: paras(topic, "pathophysiology", 4),
    assessmentParas: paras(topic, "assessment", 3),
    assessmentBullets: [
      `Baseline versus current findings for ${topic} across vitals, labs, and inspection.`,
      `Red flags that demand immediate escalation or rapid response activation.`,
      `Pain, perfusion, oxygenation, neurologic status, and infection surveillance tied to ${topic}.`,
      `Medication reconciliation and allergy verification before high-risk therapies.`,
      `Functional status, fall risk, and safety devices when ${topic} affects mobility or mentation.`,
      `Psychosocial stressors and health literacy that change teaching pace for ${topic}.`,
      `Trend direction (improving, stable, worsening) rather than isolated abnormal values.`,
    ],
    interventionsParas: paras(topic, "interventions", 3),
    interventionsList: [
      `Stabilize life threats first while communicating status to the provider team for ${topic}.`,
      `Apply ordered oxygen, fluids, medications, and monitoring devices per protocol.`,
      `Reassess targeted parameters after each intervention and document response.`,
      `Cluster nursing care for stability while avoiding fatigue when ${topic} is acute.`,
      `Implement infection prevention, pressure injury prevention, and venous thromboembolism prophylaxis when indicated.`,
      `Prepare the patient and family for procedures using teach-back at appropriate health literacy.`,
      `Coordinate ancillary services and case management for safe discharge planning.`,
      `Escalate when thresholds are crossed using SBAR with objective data for ${topic}.`,
    ],
    medicationsParas: paras(topic, "medications", 2),
    medicationsBullets: [
      `Verify renal, hepatic, and electrolyte parameters before high-risk classes used in ${topic}.`,
      `Use independent double-check policies where required for insulin, anticoagulants, and opioids.`,
      `Hold parameters and parameter rechecks after dose changes or new orders.`,
      `Teach adverse effects that require urgent reporting for therapies common in ${topic}.`,
      `Avoid independent dose changes; clarify ambiguous orders before administration.`,
      `Align PRN medications with measurable outcomes and reassessment windows.`,
    ],
    delegationParas: paras(topic, "delegation", 2),
    delegationBullets: [
      `RN retains assessment, teaching, and evaluation for unstable ${topic} presentations.`,
      `Delegate stable, predictable tasks to assistive personnel with clear instructions.`,
      `LPN scope may include reinforcement of teaching and selected medication administration per state rules.`,
      `Verify completion of delegated tasks and reassess the patient when status changes.`,
      `Never delegate clinical judgment about which patient to see first on a multi-patient assignment.`,
      `Use chain of command when staffing or scope barriers risk patient safety.`,
    ],
    ngnParas: [
      `${ngnSentence} For ${topic}, first list cues that signal oxygenation, perfusion, neurologic, or safety failure.`,
      ...paras(topic, "NGN clinical judgment", 3),
    ],
    teachingParas: paras(topic, "patient teaching", 2),
    teachingBullets: [
      `Teach-back for warning symptoms, medication purpose, and follow-up timing for ${topic}.`,
      `Plain-language explanations with written materials when health literacy is limited.`,
      `Cultural humility and interpreter use for informed consent and discharge teaching.`,
      `Action plans for when to call 911 versus clinic for worsening ${topic} symptoms.`,
      `Reinforce lifestyle, diet, and adherence strategies aligned with the care plan.`,
      `Document education provided, understanding demonstrated, and barriers identified.`,
    ],
    safetyParas: paras(topic, "safety", 3),
    safetyBullets: [
      `Two patient identifiers and allergy checks before medications and procedures.`,
      `Fall precautions, seizure precautions, or suicide precautions when ${topic} warrants them.`,
      `Infection control bundles including hand hygiene and isolation when indicated.`,
      `High-alert medication safety practices and line tracing for infusions.`,
      `Time-out and surgical checklists when perioperative context overlaps ${topic}.`,
      `Report near misses and adverse events through institutional channels.`,
    ],
    commonMistakes: [
      `Choosing teaching before stabilizing acute findings in ${topic}.`,
      `Treating a single lab value as more important than a worsening trend.`,
      `Delaying provider notification when objective criteria for escalation are met.`,
      `Selecting an intervention outside RN scope or without an order.`,
      `Ignoring psychosocial safety when ${topic} affects judgment or self-care.`,
      `Delegating assessment of an unstable patient to unlicensed assistive personnel.`,
    ],
    examReviewPoints: [
      `Pair ABCs and Maslow with the six-step NGN model for ${topic} items.`,
      `Identify the highest-acuity patient or finding before choosing an action.`,
      `Match interventions to orders, protocols, and monitoring parameters.`,
      `Use objective data in answers; avoid vague reassurance options.`,
      `Reassess after interventions and document expected timeframes.`,
      `Prioritize infection control, medication safety, and falls when stem cues appear.`,
      `Select answers that show accountability for outcomes, not task completion alone.`,
    ],
    keyTakeaways: [
      `${topic} items reward trend recognition and physiologic reasoning.`,
      `Stabilize, notify, document, and reassess in that mental order when unstable.`,
      `Teaching and discharge tasks follow stabilization for acute presentations.`,
      `Scope, policy, and orders constrain what the RN can do independently.`,
      `Use NurseNest adaptive practice to transfer this framework to timed items.`,
    ],
    internalLinks: internalLinks.length ? internalLinks : [lk.sepsis!, lk.copd!],
    faqs: [
      {
        q: `What is the first nursing priority in many ${topic} NCLEX-RN stems?`,
        a: `Identify and address the life-threatening physiologic threat (airway, breathing, circulation, neuro, safety) using objective data, then align actions with orders and reassessment.`,
      },
      {
        q: `How should I approach medication questions about ${topic}?`,
        a: `Verify parameters, allergies, and hold rules; avoid independent dose changes; choose hold-and-notify when safety criteria are not met; teach adverse effects that require urgent reporting.`,
      },
      {
        q: `When is teaching the best answer for ${topic}?`,
        a: `When the stem describes a stable patient ready to learn, with intact cognition, and no higher-priority safety or instability cue that must be addressed first.`,
      },
      {
        q: `What documentation pattern supports a correct prioritization answer?`,
        a: `Objective findings, interventions performed, patient response, provider notification when indicated, and the next reassessment time tied to the change in status.`,
      },
    ],
    references: [
      "National Council of State Boards of Nursing. (2023). NCLEX-RN test plan. NCSBN. https://www.ncsbn.org/exams/test-plans.page",
      "Centers for Disease Control and Prevention. (2024). Clinical information (disease topics). CDC. https://www.cdc.gov/",
      "National Institutes of Health. (2024). MedlinePlus health topics. NIH. https://medlineplus.gov/",
      "Agency for Healthcare Research and Quality. (2022). Patient safety primers. AHRQ. https://psnet.ahrq.gov/",
    ],
  };
}

const REMAINING: Array<{
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  extraTags: string[];
  topic: string;
  linkKeys: string[];
}> = [
  {
    slug: "nclex-rn-us-dka-hhs-nursing-priorities",
    title: "DKA and HHS Nursing Priorities for the NCLEX-RN (U.S.)",
    excerpt: "Differentiate diabetic ketoacidosis and hyperosmolar hyperglycemic state, prioritize fluid and insulin safety, and answer NGN-style items with monitoring accountability.",
    category: "Medical-Surgical Nursing",
    extraTags: ["DKA", "HHS", "Diabetes", "Fluids"],
    topic: "DKA and HHS",
    linkKeys: ["dka", "hypoK", "hyperK", "metAcid", "furosemide"],
  },
  {
    slug: "nclex-rn-us-stemi-nstemi-acute-coronary-care",
    title: "STEMI vs NSTEMI Acute Coronary Care for NCLEX-RN",
    excerpt: "Compare ischemic presentations, ECG and troponin implications, and nursing priorities for U.S. acute coronary syndrome management on exam-style items.",
    category: "Cardiovascular Nursing",
    extraTags: ["ACS", "ECG", "Troponin"],
    topic: "acute coronary syndrome",
    linkKeys: ["pe", "hf", "hyperK", "hypoK", "betaBlock"],
  },
  {
    slug: "nclex-rn-us-stroke-thrombolysis-nursing-assessment",
    title: "Stroke Thrombolysis Window and Nursing Assessment (NCLEX-RN)",
    excerpt: "Time-sensitive stroke assessment, NIHSS concepts at exam level, blood pressure parameters, and post-tPA monitoring for U.S. RN candidates.",
    category: "Neurologic Nursing",
    extraTags: ["Stroke", "Neuro", "Emergency"],
    topic: "acute ischemic stroke care",
    linkKeys: ["stroke", "icp", "hyperK", "hypoNa", "seizure"],
  },
  {
    slug: "nclex-rn-us-pulmonary-embolism-nursing-priorities",
    title: "Pulmonary Embolism Nursing Priorities for NCLEX-RN",
    excerpt: "Recognize PE cues, oxygenation and anticoagulation safety, bleeding risk, and escalation patterns commonly tested on the NCLEX-RN.",
    category: "Respiratory Nursing",
    extraTags: ["PE", "Anticoagulation", "VTE"],
    topic: "pulmonary embolism",
    linkKeys: ["pe", "dvt", "warfHep", "respAcid", "copd"],
  },
  {
    slug: "nclex-rn-us-aki-oliguria-fluid-assessment",
    title: "AKI Oliguria and Fluid Assessment for NCLEX-RN",
    excerpt: "Prerenal, intrinsic, and postrenal patterns, intake-output monitoring, and nephrotoxic medication safety for acute kidney injury items.",
    category: "Renal Nursing",
    extraTags: ["AKI", "Fluids", "Labs"],
    topic: "acute kidney injury",
    linkKeys: ["aki", "furosemide", "metAcid", "hyperK", "hypoNa"],
  },
  {
    slug: "nclex-rn-us-hyperkalemia-cardiac-monitoring-rn",
    title: "Hyperkalemia Cardiac Monitoring for NCLEX-RN",
    excerpt: "ECG changes, calcium therapy concepts, insulin and shift protocols at exam depth, and monitoring priorities for hyperkalemia.",
    category: "Electrolytes",
    extraTags: ["Hyperkalemia", "ECG", "Emergency"],
    topic: "hyperkalemia",
    linkKeys: ["hyperK", "aki", "metAcid", "furosemide", "hf"],
  },
  {
    slug: "nclex-rn-us-hypokalemia-digoxin-toxicity-risk",
    title: "Hypokalemia and Digoxin Risk on the NCLEX-RN",
    excerpt: "Repletion cautions, digoxin interactions, dysrhythmia recognition, and teaching points for safe electrolyte management.",
    category: "Electrolytes",
    extraTags: ["Hypokalemia", "Digoxin", "Cardiac"],
    topic: "hypokalemia and digoxin safety",
    linkKeys: ["hypoK", "digoxin", "hf", "furosemide", "betaBlock"],
  },
  {
    slug: "nclex-rn-us-hyponatremia-hypernatremia-priorities",
    title: "Hyponatremia and Hypernatremia Priorities for NCLEX-RN",
    excerpt: "Osmotic shifts, neurologic monitoring, correction cautions, and fluid replacement principles frequently tested on RN exams.",
    category: "Electrolytes",
    extraTags: ["Sodium", "Neuro", "Fluids"],
    topic: "sodium disorders",
    linkKeys: ["hypoNa", "hyperNa", "siadh", "icp", "stroke"],
  },
  {
    slug: "nclex-rn-us-gi-bleed-resuscitation-nursing-care",
    title: "GI Bleed Resuscitation Nursing Care for NCLEX-RN",
    excerpt: "Upper versus lower sources, hemodynamic monitoring, transfusion concepts at exam level, and proton pump inhibitor safety themes.",
    category: "Gastrointestinal Nursing",
    extraTags: ["GI bleed", "Shock", "Transfusion"],
    topic: "gastrointestinal bleeding",
    linkKeys: ["giBleed", "warfHep", "hypoK", "metAcid", "liver"],
  },
  {
    slug: "nclex-rn-us-liver-failure-hepatic-encephalopathy-care",
    title: "Liver Failure and Hepatic Encephalopathy Nursing Care (NCLEX-RN)",
    excerpt: "Ammonia concepts at exam depth, neuro assessment, protein and medication cautions, and bleeding risk in hepatic dysfunction.",
    category: "Hepatic Nursing",
    extraTags: ["Liver", "Encephalopathy", "Bleeding"],
    topic: "liver failure",
    linkKeys: ["liver", "metAcid", "hypoK", "giBleed", "hyperNa"],
  },
  {
    slug: "nclex-rn-us-pancreatitis-acute-nursing-priorities",
    title: "Acute Pancreatitis Nursing Priorities for NCLEX-RN",
    excerpt: "Pain control within safety limits, NPO care, enzyme lab interpretation at exam level, and complication surveillance.",
    category: "Gastrointestinal Nursing",
    extraTags: ["Pancreatitis", "Pain", "NPO"],
    topic: "acute pancreatitis",
    linkKeys: ["pancreatitis", "hypoK", "furosemide", "giBleed", "dka"],
  },
  {
    slug: "nclex-rn-us-seizure-precautions-status-epilepticus",
    title: "Seizure Precautions and Status Epilepticus Nursing Care",
    excerpt: "Airway protection, timing, benzodiazepine safety themes, and documentation for seizure-related NCLEX-RN items.",
    category: "Neurologic Nursing",
    extraTags: ["Seizure", "Airway", "Safety"],
    topic: "seizures and status epilepticus",
    linkKeys: ["seizure", "icp", "stroke", "respAcid", "hypoNa"],
  },
  {
    slug: "nclex-rn-us-meningitis-isolation-antibiotic-timing",
    title: "Meningitis Isolation and Antibiotic Timing for NCLEX-RN",
    excerpt: "Droplet precautions, assessment clusters, pediatric and adult cues, and safety around rapid antimicrobial administration.",
    category: "Infectious Disease",
    extraTags: ["Meningitis", "Isolation", "Antibiotics"],
    topic: "meningitis",
    linkKeys: ["seizure", "stroke", "hypoNa", "respAcid", "pe"],
  },
  {
    slug: "nclex-rn-us-pneumonia-community-hospital-nursing-care",
    title: "Community and Hospital-Acquired Pneumonia Nursing Care (NCLEX-RN)",
    excerpt: "Oxygenation, culture timing, isolation decisions, and older adult presentation differences for pneumonia items.",
    category: "Respiratory Nursing",
    extraTags: ["Pneumonia", "Oxygen", "Infection"],
    topic: "pneumonia",
    linkKeys: ["copd", "asthma", "sepsis", "respAcid", "pe"],
  },
  {
    slug: "nclex-rn-us-tuberculosis-airborne-isolation-teaching",
    title: "Tuberculosis Airborne Isolation and Teaching for NCLEX-RN",
    excerpt: "Airborne precautions, adherence challenges, public health reporting concepts, and medication monitoring themes at exam depth.",
    category: "Infectious Disease",
    extraTags: ["TB", "Isolation", "Public health"],
    topic: "tuberculosis",
    linkKeys: ["copd", "pe", "asthma", "respAcid", "sepsis"],
  },
  {
    slug: "nclex-rn-us-hiv-prep-pep-safety-teaching",
    title: "HIV PrEP and PEP Safety Teaching for NCLEX-RN",
    excerpt: "Confidentiality, adherence, renal monitoring concepts, and nonjudgmental communication for HIV prevention items.",
    category: "Infectious Disease",
    extraTags: ["HIV", "PrEP", "Communication"],
    topic: "HIV prevention and engagement",
    linkKeys: ["liver", "aki", "warfHep", "hypoK", "dka"],
  },
  {
    slug: "nclex-rn-us-postoperative-atelectasis-pneumonia-prevention",
    title: "Postoperative Atelectasis and Pneumonia Prevention (NCLEX-RN)",
    excerpt: "Incentive spirometry, early mobility, pain-splinting balance, and respiratory assessment after surgery.",
    category: "Perioperative Nursing",
    extraTags: ["Postoperative", "Respiratory", "Mobility"],
    topic: "postoperative respiratory complications",
    linkKeys: ["copd", "pe", "asthma", "furosemide", "giBleed"],
  },
  {
    slug: "nclex-rn-us-wound-infection-surgical-site-surveillance",
    title: "Wound Infection and Surgical Site Surveillance for NCLEX-RN",
    excerpt: "Drainage descriptors, culture timing, antibiotic stewardship cues, and fever patterns in postoperative patients.",
    category: "Perioperative Nursing",
    extraTags: ["Wound", "Infection", "Assessment"],
    topic: "surgical site infection",
    linkKeys: ["giBleed", "sepsis", "pancreatitis", "liver", "dka"],
  },
  {
    slug: "nclex-rn-us-thyroid-storm-myxedema-coma-priorities",
    title: "Thyroid Storm and Myxedema Coma Priorities for NCLEX-RN",
    excerpt: "Hypermetabolic versus hypometabolic crises, thermoregulation, hemodynamic support themes, and monitoring priorities.",
    category: "Endocrine Nursing",
    extraTags: ["Thyroid", "Emergency", "Temperature"],
    topic: "thyroid emergencies",
    linkKeys: ["dka", "hyperK", "hypoK", "hf", "sepsis"],
  },
  {
    slug: "nclex-rn-us-adrenal-crisis-cushing-addison-nursing-care",
    title: "Adrenal Crisis and Cortisol Excess Nursing Care (NCLEX-RN)",
    excerpt: "Stress-dose steroid concepts at exam level, fluid shifts, glucose monitoring, and infection vigilance.",
    category: "Endocrine Nursing",
    extraTags: ["Adrenal", "Steroids", "Fluids"],
    topic: "adrenal insufficiency and excess",
    linkKeys: ["dka", "hypoK", "hyperK", "hypoNa", "metAcid"],
  },
  {
    slug: "nclex-rn-us-preeclampsia-hellp-obstetric-emergency",
    title: "Preeclampsia and HELLP Obstetric Emergency Nursing Care",
    excerpt: "Blood pressure thresholds, seizure prophylaxis themes, fetal assessment integration, and magnesium safety at exam depth.",
    category: "Obstetric Nursing",
    extraTags: ["OB", "Hypertension", "HELLP"],
    topic: "preeclampsia and HELLP",
    linkKeys: ["hyperK", "hypoNa", "seizure", "stroke", "hf"],
  },
  {
    slug: "nclex-rn-us-postpartum-hemorrhage-nursing-actions",
    title: "Postpartum Hemorrhage Nursing Actions for NCLEX-RN",
    excerpt: "Tone, tissue, trauma, thrombin framework, fundal assessment, and massive transfusion concept questions.",
    category: "Obstetric Nursing",
    extraTags: ["PPH", "Bleeding", "Emergency"],
    topic: "postpartum hemorrhage",
    linkKeys: ["giBleed", "warfHep", "hypoK", "sepsis", "hf"],
  },
  {
    slug: "nclex-rn-us-newborn-respiratory-distress-syndrome-care",
    title: "Newborn Respiratory Distress Nursing Care for NCLEX-RN",
    excerpt: "Work of breathing, CPAP concepts, glucose monitoring, and thermoregulation for neonatal respiratory items.",
    category: "Neonatal Nursing",
    extraTags: ["Neonate", "Respiratory", "Thermoregulation"],
    topic: "neonatal respiratory distress",
    linkKeys: ["asthma", "copd", "respAcid", "hypoK", "pe"],
  },
  {
    slug: "nclex-rn-us-pediatric-dehydration-oral-rehydration-priorities",
    title: "Pediatric Dehydration and Oral Rehydration Priorities (NCLEX-RN)",
    excerpt: "Weight-based fluid estimates at exam level, shock recognition, and parent teaching for mild versus severe dehydration.",
    category: "Pediatric Nursing",
    extraTags: ["Pediatrics", "Fluids", "Teaching"],
    topic: "pediatric dehydration",
    linkKeys: ["hypoNa", "hyperNa", "metAcid", "dka", "aki"],
  },
  {
    slug: "nclex-rn-us-childhood-asthma-exacerbation-home-management",
    title: "Childhood Asthma Exacerbation and Home Management (NCLEX-RN)",
    excerpt: "Spacer teaching, action plans, trigger reduction, and when to escalate care for pediatric asthma items.",
    category: "Pediatric Nursing",
    extraTags: ["Asthma", "Pediatrics", "Teaching"],
    topic: "pediatric asthma",
    linkKeys: ["asthma", "copd", "respAcid", "pe", "hypoK"],
  },
  {
    slug: "nclex-rn-us-older-adult-falls-delirium-prevention",
    title: "Older Adult Falls and Delirium Prevention for NCLEX-RN",
    excerpt: "Medication risks, sensory aids, sleep-wake preservation, and interdisciplinary safety bundles for gerontology items.",
    category: "Gerontologic Nursing",
    extraTags: ["Falls", "Delirium", "Safety"],
    topic: "falls and delirium in older adults",
    linkKeys: ["stroke", "hypoNa", "seizure", "betaBlock", "digoxin"],
  },
  {
    slug: "nclex-rn-us-polypharmacy-adverse-drug-events-geriatrics",
    title: "Polypharmacy and Adverse Drug Events in Geriatrics (NCLEX-RN)",
    excerpt: "Beers criteria themes at exam depth, deprescribing communication, and monitoring for anticholinergic burden.",
    category: "Gerontologic Nursing",
    extraTags: ["Polypharmacy", "Medications", "Safety"],
    topic: "geriatric polypharmacy",
    linkKeys: ["digoxin", "warfHep", "betaBlock", "furosemide", "hypoK"],
  },
  {
    slug: "nclex-rn-us-mental-health-suicide-risk-assessment-safety",
    title: "Mental Health Suicide Risk Assessment and Safety (NCLEX-RN)",
    excerpt: "Therapeutic communication, means reduction, involuntary hold concepts at exam level, and documentation priorities.",
    category: "Psychiatric Nursing",
    extraTags: ["Mental health", "Safety", "Communication"],
    topic: "suicide risk and inpatient safety",
    linkKeys: ["seizure", "stroke", "hypoNa", "liver", "pancreatitis"],
  },
  {
    slug: "nclex-rn-us-alcohol-withdrawal-ciwa-nursing-monitoring",
    title: "Alcohol Withdrawal and CIWA Monitoring for NCLEX-RN",
    excerpt: "Sympathomimetic surge, seizure risk, benzodiazepine titration themes, and thiamine safety on exam items.",
    category: "Psychiatric Nursing",
    extraTags: ["Withdrawal", "CIWA", "Seizure"],
    topic: "alcohol withdrawal",
    linkKeys: ["seizure", "liver", "hypoK", "hypoNa", "metAcid"],
  },
  {
    slug: "nclex-rn-us-opioid-overdose-naloxone-community-education",
    title: "Opioid Overdose Naloxone and Community Education (NCLEX-RN)",
    excerpt: "Respiratory depression recognition, rescue dosing concepts, Good Samaritan themes, and stigma-reducing teaching.",
    category: "Pharmacology",
    extraTags: ["Opioids", "Overdose", "Community"],
    topic: "opioid overdose response",
    linkKeys: ["respAcid", "seizure", "pe", "asthma", "copd"],
  },
  {
    slug: "nclex-rn-us-ethical-consent-refusal-durable-directives",
    title: "Ethical Consent Refusal and Advance Directives for NCLEX-RN",
    excerpt: "Capacity, surrogate decision makers, advocacy without paternalism, and documentation for ethics-heavy items.",
    category: "Leadership & Ethics",
    extraTags: ["Ethics", "Consent", "Advocacy"],
    topic: "consent and advance care planning",
    linkKeys: ["stroke", "hf", "liver", "giBleed", "sepsis"],
  },
  {
    slug: "nclex-rn-us-rapid-response-code-blue-nursing-roles",
    title: "Rapid Response and Code Blue Nursing Roles for NCLEX-RN",
    excerpt: "Closed-loop communication, CPR quality themes, post-event debrief concepts, and family presence considerations.",
    category: "Emergency Nursing",
    extraTags: ["Code", "RRT", "CPR"],
    topic: "rapid response and resuscitation",
    linkKeys: ["pe", "hf", "hyperK", "stroke", "sepsis"],
  },
  {
    slug: "nclex-rn-us-anaphylaxis-epinephrine-first-nursing-actions",
    title: "Anaphylaxis Epinephrine First Nursing Actions for NCLEX-RN",
    excerpt: "Airway swelling progression, IM epinephrine priority, adjunct oxygen, and observation after reaction.",
    category: "Emergency Nursing",
    extraTags: ["Anaphylaxis", "Airway", "Epinephrine"],
    topic: "anaphylaxis",
    linkKeys: ["asthma", "respAcid", "pe", "sepsis", "copd"],
  },
  {
    slug: "nclex-rn-us-blood-transfusion-reaction-nursing-sequence",
    title: "Blood Transfusion Reaction Nursing Sequence for NCLEX-RN",
    excerpt: "Stop transfusion first, maintain IV access, notify provider, monitor versus anaphylaxis, TACO, TRALI concept cues.",
    category: "Hematologic Nursing",
    extraTags: ["Transfusion", "Reaction", "Safety"],
    topic: "transfusion reaction",
    linkKeys: ["giBleed", "warfHep", "pe", "hf", "sepsis"],
  },
  {
    slug: "nclex-rn-us-sickle-cell-pain-vaso-occlusive-crisis-care",
    title: "Sickle Cell Vaso-Occlusive Crisis Nursing Care for NCLEX-RN",
    excerpt: "Oxygenation, hydration cautions, infection screening, and bias-aware pain management themes for exam items.",
    category: "Hematologic Nursing",
    extraTags: ["Sickle cell", "Pain", "Oxygen"],
    topic: "sickle cell vaso-occlusive crisis",
    linkKeys: ["pe", "hypoNa", "sepsis", "aki", "furosemide"],
  },
];

export function appendRemainingPosts(
  posts: PostSpec[],
  lk: Record<string, LinkRow>,
  sharedTags: string[],
  ngnSentence: string,
): void {
  if (REMAINING.length !== 35) {
    throw new Error(`Expected 35 remaining specs, got ${REMAINING.length}`);
  }
  for (const row of REMAINING) {
    posts.push(
      buildPost({
        ...row,
        lk,
        sharedTags,
        ngnSentence,
      }),
    );
  }
}
