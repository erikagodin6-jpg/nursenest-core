#!/usr/bin/env node
/**
 * Writes rn-nclex-neurological-expansion-catalog.json
 * Run: node scripts/generate-rn-neuro-expansion-catalog.mjs (from nursenest-core)
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../src/content/pathway-lessons/rn-nclex-neurological-expansion-catalog.json");

const HUB = `[Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons)`;
const STROKE = `[stroke assessment & tPA window](LESSON:stroke-assessment-tpa-window)`;
const ICP = `[increased ICP positioning](LESSON:increased-icp-positioning)`;
const SEIZ = `[seizure precautions](LESSON:seizure-precautions-rescue-meds)`;
const ADR = `[SCI autonomic dysreflexia](LESSON:spinal-cord-injury-autonomic-dysreflexia)`;
const MEN = `[meningitis assessment](LESSON:meningitis-isolation-assessment)`;
const GOLD = `[stroke & ICP nursing gold](LESSON:stroke-increased-icp-gold)`;

/** [slug, title, flavor: general|stroke|seizure|icp|sci|priority|meningitis] */
const META = [
  ["glasgow-coma-scale-loc-nclex-rn", "Glasgow Coma Scale and Level of Consciousness", "general"],
  ["neuro-assessment-pupils-motor-speech-sensation", "Neuro Assessment: Pupils, Motor Strength, Speech, Sensation", "general"],
  ["cranial-nerves-nurses-nclex-rn", "Cranial Nerves for Nurses", "general"],
  ["stroke-ischemic-vs-hemorrhagic-nclex", "Stroke: Ischemic vs Hemorrhagic", "stroke"],
  ["tia-nursing-priorities-nclex-rn", "TIA Nursing Priorities", "stroke"],
  ["thrombolytic-stroke-tpa-tnk-safety-nclex", "Thrombolytic Therapy for Stroke: tPA/TNK Safety", "stroke"],
  ["post-stroke-complications-aspiration-prevention", "Post-Stroke Complications and Aspiration Prevention", "stroke"],
  ["aphasia-dysarthria-neglect-nclex-rn", "Aphasia, Dysarthria, and Neglect", "stroke"],
  ["seizure-types-nursing-priorities-nclex", "Seizure Types and Nursing Priorities", "seizure"],
  ["status-epilepticus-nclex-rn", "Status Epilepticus", "seizure"],
  ["antiseizure-medications-nclex-rn", "Antiseizure Medications", "seizure"],
  ["traumatic-brain-injury-nursing-nclex", "Traumatic Brain Injury", "icp"],
  ["concussion-nursing-care-nclex-rn", "Concussion Nursing Care", "general"],
  ["skull-fractures-csf-leak-nursing", "Skull Fractures and CSF Leak", "icp"],
  ["increased-icp-early-vs-late-signs-nclex", "Increased ICP: Early vs Late Signs", "icp"],
  ["cushings-triad-nclex-rn", "Cushing’s Triad", "icp"],
  ["brain-herniation-red-flags-nclex", "Brain Herniation Red Flags", "icp"],
  ["spinal-cord-injury-levels-motor-sensory-nclex", "Spinal Cord Injury: Levels and Motor/Sensory Loss", "sci"],
  ["neurogenic-shock-nclex-rn", "Neurogenic Shock", "sci"],
  ["autonomic-dysreflexia-nursing-deep-dive-nclex", "Autonomic Dysreflexia", "sci"],
  ["multiple-sclerosis-nursing-nclex", "Multiple Sclerosis", "general"],
  ["guillain-barre-syndrome-nclex-rn", "Guillain-Barré Syndrome", "general"],
  ["myasthenia-gravis-nursing-nclex", "Myasthenia Gravis", "general"],
  ["parkinson-disease-nursing-overview-nclex", "Parkinson Disease", "general"],
  ["alzheimer-dementia-safety-nclex-rn", "Alzheimer Disease and Dementia Safety", "general"],
  ["delirium-vs-dementia-vs-depression-nclex", "Delirium vs Dementia vs Depression", "priority"],
  ["meningitis-isolation-droplet-contact-nclex", "Meningitis and Isolation Precautions", "meningitis"],
  ["encephalitis-nursing-nclex-rn", "Encephalitis", "meningitis"],
  ["migraine-versus-stroke-red-flags-nclex", "Migraine vs Stroke Red Flags", "stroke"],
  ["increased-fall-risk-neuro-patients-nclex", "Increased Fall Risk in Neuro Patients", "priority"],
  ["dysphagia-aspiration-precautions-nclex", "Dysphagia and Aspiration Precautions", "stroke"],
  ["lumbar-puncture-nursing-care-nclex", "Lumbar Puncture Nursing Care", "general"],
  ["eeg-nursing-care-nclex-rn", "EEG Nursing Care", "seizure"],
  ["ct-mri-neuro-diagnostics-nclex", "CT/MRI Neuro Diagnostics", "general"],
  ["vp-shunt-complications-nclex-rn", "VP Shunt Complications", "icp"],
  ["brain-tumor-icp-seizure-risk-nclex-rn", "Brain Tumours: Increased ICP and Seizure Risk", "icp"],
  ["bells-palsy-nursing-nclex-rn", "Bell’s Palsy", "general"],
  ["trigeminal-neuralgia-nursing-nclex", "Trigeminal Neuralgia", "general"],
  ["which-neuro-patient-unstable-ngn", "Which Neuro Patient Is Unstable?", "priority"],
  ["neuro-priority-first-action-nclex-rn", "Neuro Priority Questions: What Do You Do First?", "priority"],
];

function bodies(slug, title, flavor) {
  const isPriority = flavor === "priority";
  const isStroke = flavor === "stroke";
  const isSeizure = flavor === "seizure";
  const isIcp = flavor === "icp";
  const isSci = flavor === "sci";
  const isMeningitis = flavor === "meningitis";

  let meaning = `**${title}** is core NCLEX-RN neurological nursing: you translate **assessment** into **risk**, protect **airway and aspiration**, watch for **sudden focal deficits** or **altered LOC**, and **communicate** with objective data. Boards hide urgency behind “stable” wording—compare **new change** to baseline when the stem allows.\n\nCanadian items may use **metric** vitals and interprofessional notes; **first action** logic matches US stems: **ABC**, **neuro checks**, **seizure safety**, **ICP-friendly positioning** per orders, then **notify** when thresholds are met.\n\nCross-link ${STROKE}, ${ICP}, ${SEIZ}, and ${HUB}.`;

  if (isStroke) {
    meaning = `**${title}** focuses on **acute neurovascular** care: time-sensitive **reperfusion** eligibility, **bleeding risk** with thrombolytics, **aspiration** prevention, and **neuro checks** after intervention. NCLEX-RN rewards knowing **what delays harm** (silent aspiration, missed deficit, hypotension) versus **routine tasks**.\n\nDifferentiate **ischemic** versus **hemorrhagic** patterns when the stem gives **CT** or **presentation** clues—**tPA/TNK** themes apply only when **contraindications** are absent per item framing.\n\nIntegrate ${STROKE}, ${GOLD}, ${ICP}, and ${HUB}.`;
  }
  if (isSeizure) {
    meaning = `**${title}** covers **seizure recognition**, **airway protection**, **rescue medications** per orders, and **continuous monitoring** for **recurrence** or **status epilepticus**. Nurses prevent **injury**, time events, and prepare for **labs** and **EEG** themes when instability persists.\n\nMedication items probe **therapeutic monitoring** (levels, sedation, rash) and **patient teaching** for adherence and driving safety when stable.\n\nUse ${SEIZ}, ${STROKE}, ${ICP}, and ${HUB}.`;
  }
  if (isIcp) {
    meaning = `**${title}** ties **intracranial pressure dynamics** to **assessment** and **interventions**: **head-of-bed** per order, **avoid harmful neck flexion**, **sedation/analgesia** themes, **osmotherapy** per protocol, and **early recognition** of **herniation** patterns. NCLEX punishes **rough suctioning** or **clustered noxious stimuli** without a plan when ICP risk is high.\n\nPair ${ICP}, ${GOLD}, ${STROKE}, and ${HUB}.`;
  }
  if (isSci) {
    meaning = `**${title}** applies to **spinal cord injury** clients: **level** determines expected **motor/sensory** loss, **neurogenic shock** (hypotension + relative bradycardia themes), and **autonomic dysreflexia** above the lesion. Nursing priorities include **hemodynamic monitoring**, **bladder/bowel** programs, **skin protection**, and **rapid** response to **sudden hypertension** with **headache**.\n\nLink ${ADR}, ${STROKE}, ${ICP}, and ${HUB}.`;
  }
  if (isMeningitis) {
    meaning = `**${title}** combines **CNS infection** recognition with **isolation** (droplet/contact themes per pathogen and policy), **antibiotic timing** after cultures when safe, and **neuro checks** for **seizures** or **rising ICP**. NCLEX tests **first actions** for **fever + neck stiffness + altered LOC** vignettes.\n\nConnect ${MEN}, ${SEIZ}, ${ICP}, and ${HUB}.`;
  }
  if (isPriority) {
    meaning = `**${title}** trains **NGN-style prioritization**: pick the client with **airway compromise**, **new unilateral weakness**, **seizing activity**, **sudden LOC drop**, **Cushing triad**, **autonomic dysreflexia**, or **post-tPA bleeding** over stable teaching or routine meds. Boards reward **objective instability** over polite requests.\n\nAnchor with ${STROKE}, ${ICP}, ${SEIZ}, ${ADR}, and ${HUB}.`;
  }

  let exam = `Examiners use **first**, **priority**, and **most important** language. Eliminate answers that **delay assessment**, **delegate unstable neuro checks** to UAP, or **teach** before **stabilizing** hypoxia, airway risk, or acute ICP signs. Expect **SBAR** and **time documentation** around stroke and seizure events.`;

  if (isStroke)
    exam += ` Watch for **tPA exclusion** traps (recent surgery, uncontrolled HTN, improving symptoms) and **hemorrhagic conversion** clues.`;
  if (isSeizure) exam += ` Status epilepticus stems push **timed benzodiazepine** pathways and **airway** first.`;
  if (isIcp) exam += ` Items contrast **early subtle** changes with **late** **Cushing** patterns—choose escalation when late signs appear.`;
  if (isSci) exam += ` **AD** questions reward **sitting up**, **removing noxious stimulus**, and **antihypertensive** per order—not ignoring sudden **BP spike** in T6+ injuries.`;
  if (isMeningitis) exam += ` **Isolation** before wandering the halls and **culture discipline** remain classic teaching points.`;
  if (isPriority)
    exam += ` Multi-patient matrices: **one unstable neuro** client outranks three “busy but stable” tasks.`;

  let core = `- **Assessment**: LOC, pupils, motor strength by side, speech, facial symmetry, sensation when ordered.\n- **Safety**: seizure precautions, bed low, pads, **nothing per mouth** if dysphagia suspected until screened.\n- **Escalation**: new deficit, sustained **GCS** drop, **repeated seizures**, **post-tPA** neuro change, **ICP** red flags.\n- **Teaching** (when stable): medication timing, injury prevention, when to call EMS.\n- **Documentation**: objective trends and times for neuro events.`;

  if (isStroke)
    core = `- **FAST**-style recognition themes; **last known well** documentation.\n- **NPO** and **aspiration** precautions when swallow at risk.\n- **Thrombolytic**: strict inclusion/exclusion per protocol—**bleeding checks** after.\n- **Post-stroke**: DVT prophylaxis per orders, **mobility** when safe, **mood** screening themes.\n- **Avoid** giving aspirin before **hemorrhagic** stroke ruled out when stem implies bleed.`;
  if (isSeizure)
    core = `- **Types**: focal aware/impaired, generalized tonic-clonic, absence themes—match **safety** to type.\n- **Status**: treat as **emergency**; protect airway; **timed** rescue meds per ACLS/policy.\n- **Meds**: titrate per orders; watch **SJS** rash signals, **hyponatremia** with some agents when stem cues.\n- **EEG**: reduce stimuli; safety with **ambulatory** EEG themes when shown.`;
  if (isIcp)
    core = `- **Early**: headache, nausea, subtle pupil change, BP trends.\n- **Late**: **Cushing** triad patterns, posturing, rapid **GCS** drop.\n- **Positioning**: **head midline**, **HOB** per order—avoid **extreme** hip flexion if contraindicated.\n- **Shunt**: **reduced** ICP signs with infection can still be **obstruction**—report **worsening** headache or vomiting.`;
  if (isSci)
    core = `- **Levels**: Cervical vs thoracic loss patterns on exams—know **phrenic** risk with high cervical themes.\n- **Neurogenic shock**: fluids/vasopressors per orders—different from **spinal shock** wording in some items.\n- **AD**: trigger removal, **sit up**, **loosen** constrictive clothing, **notify**—not “finish dressing change first.”\n- **Skin and DVT** prevention across rehab phases.`;
  if (isMeningitis)
    core = `- **Precautions**: follow **pathogen-appropriate** isolation in the stem.\n- **Kernig/Brudzinski** as supporting clues—not standalone diagnosis.\n- **Petechial** rash with fever → **emergent** pathways when meningococcemia suggested.\n- **Contacts**: public health themes when applicable.`;
  if (isPriority)
    core = `- **Airway** and **aspiration** beat paperwork.\n- **New weakness + speech** beats mild headache in stable chronic migraine.\n- **Post-tPA** sudden headache + **BP** spike → **emergency** evaluation.\n- **AD** with pounding headache in SCI → **immediate** nursing sequence per policy.\n- **Delegate** only stable, non-judgmental tasks.`;

  let scenario = `**Patient vignette.** A 68-year-old client with an acute neurological concern related to **${title}** develops **worsening confusion** and **unequal grips** during your shift. **Vitals** show **rising blood pressure** and **irregular respiratory effort**.\n\n**Fork:** Your priority is **focused neuro reassessment**, **airway and oxygenation support** per orders, **seizure precautions** if indicated, and **notify the provider** with **SBAR** including **time of symptom change**—not routine hygiene first.`;

  if (isStroke)
    scenario = `**Patient vignette.** A 71-year-old arrives with **sudden left arm weakness** and **slurred speech**; **last known well** 70 minutes ago. **BP** is **188/96**, **glucose** **6.2 mmol/L** (Canadian stem), **CT** reportedly shows **no bleed**.\n\n**Fork:** **Activate stroke pathway** themes—**continuous monitoring**, **NPO**, **prepare** for **thrombolytic** eligibility screening per protocol, **avoid** **hypotension** from unnecessary antihypertensives unless ordered for extreme BP—communicate **neuro changes** immediately after intervention.`;
  if (isSeizure)
    scenario = `**Patient vignette.** A client has **back-to-back tonic-clonic seizures** without full recovery between. **SpO₂** drifts to **88%** with **secretions**.\n\n**Fork:** **Protect airway**, **call for help**, **give rescue** therapy per order/protocol, **prepare** for **intubation** themes if ventilation fails—**not** leaving to complete another client’s discharge teaching.`;
  if (isIcp)
    scenario = `**Patient vignette.** Post **TBI**, the client’s **GCS** drops from **14 to 10**, **pupil** becomes **sluggish** on one side, and **BP** rises.\n\n**Fork:** **ICP crisis** until cleared—**notify neurosurgery/provider**, **elevate HOB** per order, **avoid** **jugular** compression, **prepare** for **mannitol/hypertonic saline** per orders, **frequent neuro checks**.`;
  if (isSci)
    scenario = `**Patient vignette.** A **T4 SCI** client on the ward reports **pounding headache** and **flushed skin** 20 minutes after **Foley occlusion** is suspected.\n\n**Fork:** **Autonomic dysreflexia**—**sit the patient up**, **loosen clothing**, **check catheter** and **rectum** for noxious stimulus per training, **monitor BP**, **notify provider**—**not** “reassure and continue rounds.”`;
  if (isMeningitis)
    scenario = `**Patient vignette.** A young adult has **fever**, **neck stiffness**, **photophobia**, and **confusion**. **Isolation** masks are at the door.\n\n**Fork:** **Implement precautions** per policy, **obtain cultures** before antibiotics when feasible and **not crashing**, **monitor** for **seizures** and **LOC**, **notify provider** urgently.`;
  if (isPriority)
    scenario = `**Patient vignette.** You must choose among four clients: (A) **post-tPA** with **sudden severe headache** and **BP 200/110**, (B) stable **migraine** with **pain 6/10**, (C) **SCI** with **AD** symptoms, (D) routine **med pass**.\n\n**Fork:** **See Client A first**—**intracranial hemorrhage** suspicion after thrombolytic is **life-threatening**; then address **C**, then **B**, then **D** with clear **handoff** communication.`;

  const takeaways = `- **LOC + pupils + motor + speech** are your rapid screen.\n- **Aspiration** risk follows **dysphagia** and **altered LOC**—**NPO** until cleared when ordered.\n- **Synthesis:** unstable neuro = **assess + protect + notify** before teaching.\n\n**Related:** ${STROKE} · ${ICP} · ${SEIZ} · ${HUB}.`;

  return { meaning, exam, core, scenario, takeaways };
}

function quizPair(title) {
  return {
    preTest: [
      {
        question: `For ${title}, which action best matches NCLEX-RN prioritization?`,
        options: [
          "Complete discharge paperwork before reporting a sudden drop in GCS",
          "Reassess airway, oxygenation, and neuro status; notify the provider when acute change criteria are met",
          "Send the nursing assistant alone to evaluate new-onset unilateral weakness",
          "Delay assessment to finish a scheduled non-urgent phone call",
        ],
        correct: 1,
        rationale:
          "Neurological deterioration requires immediate reassessment, airway and oxygenation protection, and timely provider communication before routine or deferrable tasks.",
      },
      {
        question: `A client with risk related to ${title} reports new numbness and slurred speech. What is the priority?`,
        options: [
          "Offer juice and crackers for comfort",
          "Activate stroke precautions, obtain vitals and glucose if ordered, and notify the provider with objective findings",
          "Ambulate the client to rule out anxiety",
          "Wait for the next scheduled neuro check in four hours",
        ],
        correct: 1,
        rationale:
          "New focal neuro deficits with speech change are treated as time-sensitive until evaluated; nursing prioritizes assessment, safety, and urgent communication.",
      },
    ],
    postTest: [
      {
        question: `Which finding most urgently escalates care in a neuro context for ${title}?`,
        options: [
          "Mild dry lips in afebrile client",
          "Sudden asymmetric pupils with declining LOC after head injury",
          "Request for a second pillow",
          "Stable chronic tremor unchanged from baseline",
        ],
        correct: 1,
        rationale:
          "Anisocoria with declining consciousness suggests herniation or expanding mass until proven otherwise and requires immediate escalation and monitoring.",
      },
      {
        question: `When is patient teaching about ${title} most appropriate?`,
        options: [
          "During active seizure or unprotected airway risk",
          "After stabilization when the client is alert, oriented, and able to participate",
          "Only at home without nurse follow-up",
          "Before any assessment to save time",
        ],
        correct: 1,
        rationale:
          "Education is effective and safe after life threats are stabilized and the patient can engage—not during active seizure or airway compromise.",
      },
    ],
  };
}

function buildLesson(slug, title, flavor) {
  const { meaning, exam, core, scenario, takeaways } = bodies(slug, title, flavor);
  return {
    slug,
    title,
    topic: "Neurological",
    topicSlug: "neurological",
    bodySystem: "Neurologic",
    system: "neurological",
    previewSectionCount: 1,
    seoTitle: `${title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN neurological review: ${title} — assessment, safety, red flags, aspiration and ICP considerations, Canada- and US-friendly practice framing, and clinical judgment.`,
    relatedLessonRefs: [
      { slug: "stroke-assessment-tpa-window", titleHint: "Stroke assessment & tPA" },
      { slug: "increased-icp-positioning", titleHint: "Increased ICP" },
    ],
    sections: [
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: meaning },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: exam },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: core },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: scenario },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
    ],
    ...quizPair(title),
  };
}

const lessons = META.map(([slug, title, flavor]) => buildLesson(slug, title, flavor));
const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-neuro-expansion-catalog.mjs",
  pathways: {
    "ca-rn-nclex-rn": lessons,
    "us-rn-nclex-rn": JSON.parse(JSON.stringify(lessons)),
  },
};

writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log("Wrote", outPath, "lessons:", lessons.length);
