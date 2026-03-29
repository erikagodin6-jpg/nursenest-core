const fs = require('fs');

const missingLessons = JSON.parse(fs.readFileSync('/tmp/np_missing_full.json', 'utf8'));

function slugToTopic(slug) {
  return slug.replace(/-np$/, '').replace(/-/g, ' ');
}

function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function generateCellular(name, system) {
  const topic = name.split(':')[0].trim();
  const subtopic = name.includes(':') ? name.split(':').slice(1).join(':').trim() : '';
  
  const systemPatho = {
    'Cardiovascular': `involves alterations in cardiac hemodynamics, vascular resistance, and myocardial oxygen supply-demand balance. At the cellular level, ischemic injury triggers anaerobic glycolysis, ATP depletion, and calcium overload leading to myocyte necrosis. Neurohormonal activation (RAAS, SNS) drives compensatory mechanisms that ultimately become maladaptive.`,
    'Respiratory': `involves disruption of the alveolar-capillary membrane, ventilation-perfusion mismatch, and impaired gas exchange. At the cellular level, inflammatory mediators (IL-6, TNF-α, prostaglandins) increase capillary permeability, promote airway edema, and trigger bronchospasm through smooth muscle contraction.`,
    'Neurological': `involves disruption of neuronal signaling, neurotransmitter imbalance, or structural damage to central/peripheral nervous system components. At the cellular level, excitotoxicity from excess glutamate, calcium influx, and free radical formation drive neuronal apoptosis and necrosis.`,
    'Endocrine & Metabolic': `involves dysregulation of hormonal feedback loops, receptor sensitivity, and metabolic homeostasis. At the cellular level, altered second-messenger signaling (cAMP, IP3/DAG), receptor downregulation, and enzymatic pathway disruption lead to systemic metabolic derangement.`,
    'Renal & Nephrology': `involves disruption of glomerular filtration, tubular reabsorption/secretion, and fluid-electrolyte homeostasis. At the cellular level, podocyte injury, tubular epithelial damage, and mesangial proliferation alter the nephron's filtering capacity and concentrating ability.`,
    'Hematology & Oncology': `involves dysregulation of hematopoiesis, coagulation cascades, or uncontrolled cellular proliferation. At the cellular level, mutations in oncogenes/tumor suppressors, defective apoptosis pathways, and abnormal cell cycle checkpoints drive malignant transformation or hematologic dysfunction.`,
    'Maternity & Obstetrics': `involves physiological adaptations of pregnancy, placental function, and maternal-fetal hemodynamic interactions. At the cellular level, trophoblast invasion, spiral artery remodeling, and hormonal shifts (hCG, progesterone, estrogen) maintain pregnancy but can become pathological.`,
    'Neonatal': `involves the transition from fetal to extrauterine physiology, including cardiopulmonary adaptation, thermoregulation, and metabolic homeostasis. At the cellular level, surfactant production, ductus arteriosus closure, and enzymatic maturation are critical for successful adaptation.`,
    'Immune System': `involves dysregulation of innate and adaptive immune responses, including T-cell/B-cell activation, cytokine cascades, and complement pathways. At the cellular level, antigen presentation via MHC complexes, immunoglobulin class switching, and regulatory T-cell function maintain immune homeostasis.`,
    'Pharmacology': `involves pharmacokinetic principles (absorption, distribution, metabolism, excretion) and pharmacodynamic interactions at target receptors. At the molecular level, drug-receptor binding, enzyme inhibition/induction, and ion channel modulation determine therapeutic efficacy and adverse effect profiles.`,
    'Musculoskeletal': `involves disruption of bone homeostasis, joint integrity, or neuromuscular function. At the cellular level, osteoclast-osteoblast coupling, cartilage degradation by matrix metalloproteinases, and inflammatory cytokine cascades drive tissue destruction and pain generation.`,
    'GI & Hepatology': `involves disruption of mucosal barrier integrity, hepatic metabolic function, or digestive enzyme secretion. At the cellular level, epithelial tight junction disruption, hepatocyte necrosis/fibrosis, and inflammatory mediator release alter absorptive and metabolic capacity.`,
    'Dermatology': `involves disruption of the skin barrier, inflammatory cascades in the dermis/epidermis, or abnormal keratinocyte proliferation. At the cellular level, cytokine-mediated inflammation (IL-17, IL-23, TNF-α), mast cell degranulation, and immune complex deposition drive cutaneous pathology.`,
    'HEENT & ENT': `involves pathology of the head, eyes, ears, nose, and throat structures. At the cellular level, mucosal inflammation, neural compression, and vascular congestion in anatomically confined spaces create symptomatic presentations requiring systematic evaluation.`,
    'Psychiatry & Mental Health': `involves neurotransmitter imbalance (serotonin, dopamine, norepinephrine, GABA, glutamate) and neural circuit dysregulation. At the cellular level, receptor density changes, synaptic cleft concentration alterations, and neuroplasticity disruptions underlie psychiatric symptomatology.`,
    'Infectious Disease': `involves pathogen-host interactions, immune evasion mechanisms, and tissue-specific tropism. At the cellular level, microbial virulence factors (adhesins, toxins, biofilms), host pattern recognition receptors (TLRs, NODs), and inflammatory cascades determine disease progression.`,
    'Rheumatology': `involves autoimmune-mediated tissue destruction, immune complex deposition, and chronic inflammatory cascades. At the cellular level, autoreactive T-cells, autoantibody production, and cytokine amplification loops (TNF-α, IL-1, IL-6) drive joint and systemic inflammation.`,
    'Toxicology': `involves dose-dependent cellular injury, receptor saturation, and metabolic pathway overload. At the cellular level, toxin-enzyme interactions, free radical generation, mitochondrial dysfunction, and membrane destabilization lead to organ-specific damage patterns.`,
    'Geriatric Medicine': `involves age-related physiological decline, polypharmacy interactions, and multi-morbidity. At the cellular level, telomere shortening, mitochondrial dysfunction, oxidative stress accumulation, and stem cell exhaustion drive the aging phenotype and altered drug pharmacokinetics.`,
    'Pain Management': `involves nociceptive signal transduction, central sensitization, and descending modulatory pathway dysfunction. At the cellular level, substance P and CGRP release at dorsal horn synapses, NMDA receptor activation, and glial cell-mediated neuroinflammation drive pain chronification.`,
  };

  const defaultPatho = `involves complex pathophysiological mechanisms affecting multiple organ systems. At the cellular level, inflammatory mediators, oxidative stress, and immune dysregulation contribute to tissue injury and functional impairment that require systematic clinical evaluation and evidence-based management.`;

  let pathoText = defaultPatho;
  for (const [key, val] of Object.entries(systemPatho)) {
    if (system.includes(key) || key.includes(system.split(' ')[0])) {
      pathoText = val;
      break;
    }
  }

  return {
    title: `Pathophysiology of ${topic}`,
    content: `${topic} ${pathoText} Understanding these cellular mechanisms is essential for NP-level clinical decision-making, as targeted pharmacotherapy and evidence-based interventions are directed at specific points in the pathological cascade. ${subtopic ? `The focus on ${subtopic.toLowerCase()} requires integration of molecular pathophysiology with clinical presentation patterns.` : ''}`
  };
}

function generateRiskFactors(name) {
  const topic = name.split(':')[0].trim();
  return [
    `Age-related risk factors specific to ${topic.toLowerCase()}`,
    `Genetic predisposition and family history`,
    `Modifiable lifestyle factors (smoking, obesity, sedentary behavior)`,
    `Comorbid conditions (diabetes mellitus, hypertension, chronic kidney disease)`,
    `Medication-related risk (polypharmacy, drug interactions)`,
    `Environmental and occupational exposures`,
    `Nutritional deficiencies or excesses`,
    `Psychosocial factors (chronic stress, socioeconomic status)`,
    `Previous history of related conditions`
  ];
}

function generateDiagnostics(name, system) {
  const topic = name.split(':')[0].trim();
  const base = [
    `Order comprehensive history and physical examination focused on ${topic.toLowerCase()} presentation`,
    `Order CBC with differential, CMP, and targeted serology`,
    `Order imaging studies appropriate to clinical presentation`,
    `Calculate risk stratification score using validated clinical tools`,
    `Order specialty-specific diagnostic studies as indicated`,
    `Assess vital signs and hemodynamic parameters`,
    `Order point-of-care testing for rapid clinical decision-making`,
    `Consider referral for advanced diagnostic procedures if indicated`
  ];
  return base;
}

function generateManagement(name, system) {
  const topic = name.split(':')[0].trim();
  return [
    `Initiate evidence-based first-line pharmacotherapy for ${topic.toLowerCase()}`,
    `Implement non-pharmacological interventions as adjunct therapy`,
    `Titrate medications based on clinical response and lab monitoring`,
    `Coordinate multidisciplinary care team involvement`,
    `Develop patient-specific treatment plan with shared decision-making`,
    `Monitor for treatment complications and adverse effects`,
    `Implement guideline-directed escalation protocols if initial therapy fails`,
    `Plan appropriate follow-up intervals and outcome measurements`
  ];
}

function generateNursingActions(name) {
  const topic = name.split(':')[0].trim();
  return [
    `Perform systematic assessment using standardized tools for ${topic.toLowerCase()}`,
    `Monitor vital signs and pertinent clinical parameters at prescribed intervals`,
    `Administer prescribed medications with appropriate safety checks`,
    `Implement evidence-based nursing interventions for symptom management`,
    `Document clinical findings, interventions, and patient responses`,
    `Educate patient and family on disease process, medications, and self-management`,
    `Assess pain and implement multimodal pain management strategies`,
    `Coordinate care transitions and discharge planning`
  ];
}

function generateSigns(name, system) {
  const topic = name.split(':')[0].trim();
  const signSets = {
    'Cardiovascular': {
      left: [`Chest pain (quality, radiation, duration)`, `Dyspnea on exertion`, `Orthopnea / PND`, `Peripheral edema`],
      right: [`Elevated JVP`, `Hepatojugular reflux`, `S3/S4 gallop`, `Murmur (systolic/diastolic)`]
    },
    'Respiratory': {
      left: [`Dyspnea (onset, severity)`, `Cough (productive vs dry)`, `Wheezing / Stridor`, `Hypoxemia (SpO2 < 92%)`],
      right: [`Tachypnea (RR > 20)`, `Accessory muscle use`, `Decreased breath sounds`, `Cyanosis (central/peripheral)`]
    },
    'Neurological': {
      left: [`Altered LOC (GCS changes)`, `Focal neurological deficits`, `Headache (onset, character)`, `Visual disturbances`],
      right: [`Pupil asymmetry (CN III)`, `Motor/sensory deficits`, `Cranial nerve palsies`, `Seizure activity`]
    },
    'Endocrine & Metabolic': {
      left: [`Weight changes (gain/loss)`, `Polyuria / Polydipsia`, `Temperature intolerance`, `Fatigue / Weakness`],
      right: [`Abnormal glucose levels`, `Electrolyte imbalances`, `Thyroid changes (goiter/nodule)`, `Skin/hair changes`]
    },
    'Renal & Nephrology': {
      left: [`Oliguria / Anuria`, `Peripheral edema`, `Hypertension`, `Uremic symptoms`],
      right: [`Elevated Cr / BUN`, `Proteinuria`, `Electrolyte derangements`, `Metabolic acidosis`]
    },
    'GI & Hepatology': {
      left: [`Abdominal pain (location, character)`, `Nausea / Vomiting`, `Changes in bowel habits`, `GI bleeding (hematemesis/melena)`],
      right: [`Jaundice / Icterus`, `Hepatomegaly / Splenomegaly`, `Ascites`, `Elevated liver enzymes`]
    },
    'Psychiatry & Mental Health': {
      left: [`Mood disturbance`, `Sleep disruption`, `Appetite changes`, `Anhedonia / Withdrawal`],
      right: [`Psychomotor changes`, `Cognitive impairment`, `Suicidal ideation (screen)`, `Psychotic features`]
    },
    'Infectious Disease': {
      left: [`Fever / Chills`, `Localized inflammation (rubor, calor, dolor, tumor)`, `Lymphadenopathy`, `Constitutional symptoms`],
      right: [`Elevated WBC / Left shift`, `Positive cultures`, `Elevated CRP / ESR / Procalcitonin`, `Sepsis criteria (qSOFA)`]
    },
  };

  for (const [key, signs] of Object.entries(signSets)) {
    if (system.includes(key) || key.includes(system.split(' ')[0])) {
      return signs;
    }
  }

  return {
    left: [`Primary presenting symptoms`, `Associated symptoms`, `Physical exam findings`, `Functional impairment`],
    right: [`Laboratory abnormalities`, `Imaging findings`, `Severity indicators`, `Complication signs`]
  };
}

function generateMedications(name, system) {
  const topic = name.split(':')[0].trim();
  
  const medSets = {
    'Cardiovascular': [
      { name: "Beta-Blocker (Metoprolol/Carvedilol)", type: "Adrenergic Antagonist", action: "Decreases HR, contractility, and myocardial O2 demand", sideEffects: "Bradycardia, fatigue, bronchospasm", contra: "Decompensated HF, severe bradycardia, 2nd/3rd degree heart block", pearl: "Avoid abrupt discontinuation; taper over 1-2 weeks to prevent rebound tachycardia." },
      { name: "ACE Inhibitor (Lisinopril/Enalapril)", type: "RAAS Inhibitor", action: "Blocks ACE, reduces angiotensin II and aldosterone", sideEffects: "Dry cough, hyperkalemia, angioedema", contra: "Bilateral renal artery stenosis, pregnancy, history of ACE-I angioedema", pearl: "Monitor K+ and creatinine 1-2 weeks after initiation; switch to ARB if cough intolerable." }
    ],
    'Respiratory': [
      { name: "Inhaled Corticosteroid (Fluticasone/Budesonide)", type: "Anti-inflammatory", action: "Reduces airway inflammation and mucus production", sideEffects: "Oral candidiasis, dysphonia, adrenal suppression (high dose)", contra: "Active pulmonary TB, untreated fungal infection", pearl: "Always rinse mouth after use; use spacer with MDI to reduce oropharyngeal deposition." },
      { name: "Short-Acting Beta-2 Agonist (Albuterol)", type: "Bronchodilator", action: "Relaxes bronchial smooth muscle via β2 receptor agonism", sideEffects: "Tachycardia, tremor, hypokalemia", contra: "Tachyarrhythmias (relative)", pearl: "Rescue use only; if using >2 days/week, step up controller therapy per GINA/NAEPP guidelines." }
    ],
    'Neurological': [
      { name: "Antiepileptic (Levetiracetam/Phenytoin)", type: "Anticonvulsant", action: "Modulates synaptic vesicle protein SV2A / blocks voltage-gated Na channels", sideEffects: "Drowsiness, dizziness, behavioral changes / gingival hyperplasia", contra: "Known hypersensitivity; Phenytoin: heart block, sinus bradycardia", pearl: "Levetiracetam preferred in acute settings due to IV availability and fewer drug interactions." },
      { name: "Alteplase (tPA)", type: "Fibrinolytic", action: "Converts plasminogen to plasmin, dissolving fibrin clot", sideEffects: "Intracranial hemorrhage, systemic bleeding", contra: "Active bleeding, recent surgery (14 days), hemorrhagic stroke, BP >185/110", pearl: "Must administer within 4.5 hours of ischemic stroke onset; strict BP management required." }
    ],
    'Endocrine & Metabolic': [
      { name: "Insulin (Regular/Glargine)", type: "Hormone Replacement", action: "Facilitates glucose uptake, inhibits gluconeogenesis and lipolysis", sideEffects: "Hypoglycemia, weight gain, lipodystrophy", contra: "Hypoglycemia", pearl: "Basal-bolus regimen mimics physiologic secretion; adjust based on carb counting and correction factors." },
      { name: "Levothyroxine", type: "Thyroid Hormone", action: "Replaces deficient T4, converted peripherally to active T3", sideEffects: "Tachycardia, tremor, weight loss (if overdosed)", contra: "Untreated adrenal insufficiency, acute MI", pearl: "Take on empty stomach 30-60 min before breakfast; check TSH 6-8 weeks after dose change." }
    ],
    'Psychiatry & Mental Health': [
      { name: "SSRI (Sertraline/Escitalopram)", type: "Antidepressant", action: "Selectively inhibits serotonin reuptake at presynaptic terminal", sideEffects: "Sexual dysfunction, GI upset, insomnia, serotonin syndrome", contra: "Concurrent MAOI use (14-day washout), QT prolongation (Citalopram)", pearl: "Therapeutic effect takes 4-6 weeks; warn patients about initial anxiety increase and suicidality in young adults." },
      { name: "Atypical Antipsychotic (Quetiapine/Risperidone)", type: "D2/5-HT2A Antagonist", action: "Blocks dopamine D2 and serotonin 5-HT2A receptors", sideEffects: "Weight gain, metabolic syndrome, EPS, QTc prolongation", contra: "Uncontrolled diabetes (Olanzapine/Clozapine), dementia-related psychosis (FDA black box)", pearl: "Monitor fasting glucose, lipids, weight, and waist circumference quarterly per APA guidelines." }
    ],
    'Infectious Disease': [
      { name: "Broad-Spectrum Antibiotic (Piperacillin-Tazobactam)", type: "Beta-lactam + Beta-lactamase Inhibitor", action: "Inhibits cell wall synthesis; tazobactam extends coverage to resistant organisms", sideEffects: "Diarrhea, C. difficile risk, hypersensitivity, hypokalemia", contra: "Penicillin allergy (severe/anaphylactic)", pearl: "Extended infusion (4h) improves time above MIC; preferred for hospital-acquired infections with Pseudomonas coverage." },
      { name: "Vancomycin", type: "Glycopeptide", action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala of peptidoglycan", sideEffects: "Nephrotoxicity, Red Man Syndrome, ototoxicity", contra: "Known hypersensitivity", pearl: "Target AUC/MIC 400-600 for MRSA; infuse over ≥60 min to prevent Red Man Syndrome." }
    ],
  };

  for (const [key, meds] of Object.entries(medSets)) {
    if (system.includes(key) || key.includes(system.split(' ')[0])) {
      return meds;
    }
  }

  return [
    { name: `First-Line Agent for ${topic}`, type: "Evidence-Based Pharmacotherapy", action: `Targets primary pathophysiological mechanism of ${topic.toLowerCase()}`, sideEffects: "Monitor for common adverse effects per drug class", contra: "Review patient-specific contraindications and drug interactions", pearl: `Prescribe per current clinical practice guidelines; start low and titrate to therapeutic effect.` },
    { name: `Adjunct Therapy for ${topic}`, type: "Supportive Pharmacotherapy", action: "Addresses secondary symptoms and prevents complications", sideEffects: "Assess risk-benefit ratio for individual patient", contra: "Consider renal/hepatic dose adjustments", pearl: "Monitor for therapeutic response and adjust regimen at follow-up." }
  ];
}

function generatePearls(name) {
  const topic = name.split(':')[0].trim();
  const subtopic = name.includes(':') ? name.split(':').slice(1).join(':').trim() : '';
  return [
    `Always consider ${topic.toLowerCase()} in the differential diagnosis based on presenting symptoms and risk factors`,
    `Evidence-based clinical practice guidelines should direct management decisions`,
    subtopic ? `${subtopic} is a high-yield area for NP certification examinations` : `This topic frequently appears on NP board certification examinations`,
    `Document clinical reasoning, shared decision-making, and patient education in the medical record`
  ];
}

function generateQuiz(name, system) {
  const topic = name.split(':')[0].trim();
  return [{
    question: `A 58-year-old patient presents with symptoms consistent with ${topic.toLowerCase()}. Which of the following is the most appropriate initial diagnostic approach?`,
    options: [
      "Order a comprehensive metabolic panel only",
      "Perform a focused history and physical with targeted diagnostic studies",
      "Immediately refer to a specialist without further workup",
      "Prescribe empiric treatment without further evaluation"
    ],
    correct: 1,
    rationale: `A focused history and physical examination with targeted diagnostic studies is the gold standard initial approach for ${topic.toLowerCase()}. This allows the NP to formulate a differential diagnosis, risk-stratify the patient, and determine appropriate management or referral. Empiric treatment without evaluation or specialist referral without initial workup may delay diagnosis and increase healthcare costs.`
  }];
}

function generateLesson(item) {
  const { lessonId, lessonName, systemTitle } = item;
  return {
    title: lessonName,
    cellular: generateCellular(lessonName, systemTitle),
    riskFactors: generateRiskFactors(lessonName),
    diagnostics: generateDiagnostics(lessonName, systemTitle),
    management: generateManagement(lessonName, systemTitle),
    nursingActions: generateNursingActions(lessonName),
    signs: generateSigns(lessonName, systemTitle),
    medications: generateMedications(lessonName, systemTitle),
    pearls: generatePearls(lessonName),
    quiz: generateQuiz(lessonName, systemTitle)
  };
}

const BATCH_SIZE = 200;
const batches = [];
for (let i = 0; i < missingLessons.length; i += BATCH_SIZE) {
  batches.push(missingLessons.slice(i, i + BATCH_SIZE));
}

console.log(`Generating ${missingLessons.length} NP lessons in ${batches.length} files...`);

const fileExports = [];

batches.forEach((batch, batchIdx) => {
  const fileName = `np-generated-batch-${batchIdx + 1}`;
  const varName = `npGeneratedBatch${batchIdx + 1}`;
  
  let content = `import type { LessonContent } from "./types";\n\n`;
  content += `export const ${varName}: Record<string, LessonContent> = {\n`;
  
  batch.forEach((item, idx) => {
    const lesson = generateLesson(item);
    const jsonStr = JSON.stringify(lesson, null, 2)
      .replace(/^/gm, '  ')
      .replace(/^\s\s\{/, '{');
    content += `  "${item.lessonId}": ${jsonStr}${idx < batch.length - 1 ? ',' : ''}\n`;
  });
  
  content += `};\n`;
  
  fs.writeFileSync(`client/src/data/lessons/${fileName}.ts`, content);
  fileExports.push({ fileName, varName });
  console.log(`  Written ${fileName}.ts (${batch.length} lessons)`);
});

console.log('\nAdd these imports to client/src/data/lessons/index.ts:');
fileExports.forEach(({ fileName, varName }) => {
  console.log(`import { ${varName} } from "./${fileName}";`);
});
console.log('\nAdd these to the safeMerge call:');
fileExports.forEach(({ varName }) => {
  console.log(`  ${varName},`);
});

fs.writeFileSync('/tmp/np_batch_exports.json', JSON.stringify(fileExports, null, 2));
console.log('\nDone!');
