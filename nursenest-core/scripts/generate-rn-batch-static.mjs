#!/usr/bin/env node
/**
 * Static generator: 50 RN lessons + 200 exam questions from output/rn-topic-manifest.json
 * No external API. Writes output/rn-content-batch.json (schema aligned with new-grad JSON exports).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(ROOT, "output/rn-topic-manifest.json");
const OUT = path.join(ROOT, "output/rn-content-batch.json");

const PROGRAM = "rn-nclex-exam-prep";

/** One exam-focused sentence woven into lesson + question stems (topic-specific). */
const TOPIC_SNIPPET = {
  "myocardial-infarction":
    "High-yield cues include ischemic chest discomfort patterns, serial troponins and ECG evolution, time-to-reperfusion language, and bleeding risk when antithrombotics are used.",
  "ischemic-stroke":
    "Focus on last-known-well timing, NIHSS-style severity language without inventing a score, hemorrhagic conversion precautions, and blood pressure goals as commonly tested in acute ischemic stroke care.",
  "hypertensive-crisis":
    "Separate hypertensive emergency (end-organ symptoms) from urgency; exams test first-line assessment for neurologic, cardiac, and renal target-organ damage and safe escalation.",
  "pulmonary-embolism":
    "Expect questions on sudden dyspnea, tachycardia, risk factors, oxygenation, anticoagulation safety, and bleeding precautions—not memorizing a single diagnostic algorithm in isolation.",
  "acute-respiratory-distress-syndrome":
    "ARDS is tested through refractory hypoxemia concepts, lung-protective ventilation principles, prone positioning as a concept, and preventing ventilator-associated complications.",
  "diabetic-ketoacidosis":
    "DKA stems emphasize ketosis, anion gap, potassium shifts during insulin therapy, fluid resuscitation concepts, and frequent reassessment rather than cookbook numbers without orders.",
  "hyperosmolar-hyperglycemic-state":
    "HHS is tested via profound dehydration, hyperosmolarity, neurologic changes, slower onset than DKA, and careful correction concepts with monitoring priorities.",
  "acute-kidney-injury":
    "AKI questions reward identifying prerenal, intrarenal, and postrenal patterns, nephrotoxin avoidance, intake/output trends, and indications for urgent nephrology involvement.",
  "liver-cirrhosis-hepatic-encephalopathy":
    "Cirrhosis bundles include ascites infection suspicion, variceal bleed risk, ammonia as an imperfect marker, lactulose/rifaximin concepts, and bleeding coagulopathy framing.",
  "gastrointestinal-bleeding":
    "GI bleed items test hemodynamic stability assessment, airway protection if altered, large-bore access concepts, type-and-screen language, and avoiding blind NSAID use.",
  "heart-failure":
    "HF exams mix HFrEF/HFpEF recognition, daily weights, orthopnea/PND, diuretic response, and exacerbation triggers including diet and medication adherence.",
  "atrial-fibrillation":
    "AFib items emphasize irregularly irregular rhythm recognition, rate versus rhythm control concepts, stroke risk framing, and anticoagulation safety/monitoring—not casual cardioversion without context.",
  "pneumonia":
    "Pneumonia care is tested through oxygenation, cultures before antibiotics when feasible, aspiration risk, CURB-65 style severity language, and vaccine education opportunities.",
  "chronic-obstructive-pulmonary-disease":
    "COPD exacerbation stems include increased work of breathing, infection triggers, controlled oxygen in chronic CO2 retainers as a concept, and bronchodilator therapy safety.",
  "asthma-acute-exacerbation":
    "Asthma emergencies test SpO2, accessory muscle use, peak flow as a trend tool when available, beta-agonist administration, and when to escalate to rapid response.",
  "chronic-kidney-disease":
    "CKD questions cover diet restrictions, anemia management concepts, bone mineral disease, dialysis access protection, and medication dose adjustments as a principle.",
  "acute-pancreatitis":
    "Pancreatitis items emphasize pain control, NPO with nutrition escalation concepts, alcohol and gallstone triggers, and monitoring for systemic inflammatory complications.",
  "inflammatory-bowel-disease":
    "IBD nursing focuses on stool patterns, dehydration, immunosuppressant infection risk, surgical considerations, and psychosocial impacts of chronic illness.",
  "fractures-and-orthopedic-care":
    "Orthopedic fundamentals include neurovascular checks, compartment syndrome red flags, immobilization safety, and DVT prevention education without replacing provider protocols.",
  "hip-replacement-post-op":
    "THA post-op items test hip precautions, neurovascular assessment, DVT/PE prevention, pain control with sedation risk, and fall prevention.",
  "wound-care-pressure-injuries":
    "Pressure injury staging concepts, moisture/incontinence management, turning schedules, nutrition as a contributor, and wound assessment documentation appear frequently.",
  "urinary-tract-infection":
    "UTI and CAUTI items reward catheter necessity review, specimen collection teaching, antibiotic stewardship concepts, and sepsis vigilance in older adults.",
  "appendicitis-and-peritonitis":
    "Appendicitis/peritonitis tests rebound guarding language, NPO readiness, pain reassessment, sudden pain relief as a possible perforation clue, and surgical collaboration.",
  "burns-thermal-injury":
    "Burn questions include airway inhalation suspicion, fluid resuscitation as a principle, infection prevention, and pain management complexity—not guessing Parkland numbers without an order.",
  "sepsis-and-septic-shock":
    "Sepsis bundles emphasize early recognition, lactate as a screening tool, cultures before antibiotics when it will not dangerously delay therapy, and hemodynamic reassessment.",
  "anticoagulation-therapy":
    "Anticoagulation items test aPTT/INR concepts as commonly used, bleeding precautions, reversal as a principle, DOAC renal considerations, and peri-procedure communication.",
  "insulin-management":
    "Insulin safety focuses on hypoglycemia recognition, correction insulin cautions, basal-bolus concepts, and sick-day rules as patient education points.",
  "diuretic-therapy":
    "Diuretics are tested through electrolyte loss (especially potassium), orthostasis, renal function trends, and ototoxicity risk with rapid IV loops as a concept.",
  "opioid-analgesics":
    "Opioid items emphasize respiratory depression, sedation assessment tools as concepts, naloxone education, multimodal analgesia, and bowel regimen planning.",
  "antihypertensive-medications":
    "Antihypertensive classes are tested via orthostasis, cough with ACE inhibitors as a classic concept, contraindications in pregnancy as a principle, and adherence barriers.",
  "antibiotic-selection-and-safety":
    "Antibiotic stems include allergy verification, culture timing, C. difficile risk communication, renal dosing as a principle, and finishing courses as education—not blanket advice.",
  "corticosteroid-therapy":
    "Steroids are tested through hyperglycemia, infection risk, GI irritation, adrenal suppression concepts with taper, and bone health as teaching points.",
  "digoxin-cardiac-glycosides":
    "Digoxin items emphasize narrow therapeutic index, bradyarrhythmia toxicity suspicion, hypokalemia interaction concepts, and apical pulse checks before administration.",
  "anticonvulsant-medications":
    "Anticonvulsants test therapeutic levels as a concept where applicable, sedation, SJS/TEN education as a rare risk concept, and abrupt discontinuation risks.",
  "antipsychotic-medications":
    "Antipsychotic safety includes EPS, QT prolongation as a concept, metabolic monitoring, orthostasis, and fall risk especially in older adults.",
  "emergency-triage-principles":
    "Triage items compare CTAS/ESI-style priority language at a conceptual level: life threats first, stable minor complaints later, and reassessment when waiting.",
  "post-operative-complications":
    "Post-op priorities include airway, bleeding, ileus, fever workup concepts, DVT/PE suspicion, and wound complications with clear escalation paths.",
  "deteriorating-patient-rapid-response":
    "Early warning scores as a concept, subtle tachypnea, new confusion, activation criteria, and closed-loop communication after calling a team are common exam angles.",
  "multiple-patient-assignment":
    "Multi-patient stems reward ABCDE thinking, stable versus unstable framing, and delegating appropriate tasks while retaining assessment of unstable patients.",
  "airway-management-priority":
    "Airway questions test jaw thrust/chin lift as concepts, suctioning indications, positioning, calling for help early, and avoiding food/fluid if aspiration risk is high.",
  "shock-recognition-and-response":
    "Shock types are tested through cold/warm clues as concepts, lactate, fluid responsiveness as a principle, and identifying cardiogenic versus distributive patterns at a high level.",
  "fluid-and-electrolyte-imbalances":
    "Electrolyte items emphasize cardiac rhythm risk with potassium and calcium, isotonic versus hypotonic fluid concepts at a principle level, and neuro changes with sodium.",
  "pain-assessment-and-management":
    "Pain items test assessment tools, reassessment after interventions, opioid risk mitigation, and non-pharmacologic adjuncts without stigmatizing the patient.",
  "fall-prevention-and-safety":
    "Fall prevention includes risk scales as concepts, bed alarms as adjuncts not substitutes, toileting schedules, environment checks, and safe mobility with assistive devices.",
  "medication-administration-safety":
    "Med safety tests the rights, look-alike/sound-alike precautions, high-alert drug awareness, independent double-check concepts, and incident reporting as quality improvement.",
  "infection-control-and-precautions":
    "Infection control items reward standard precautions always, indication-matched PPE, airborne/droplet/contact distinctions, and transport precautions as concepts.",
  "surgical-site-infection-prevention":
    "SSI prevention tests sterile field respect, glycemic control as a concept, hair removal principles, and wound assessment for infection signs.",
  "delegation-to-uap":
    "Delegation tests five rights of delegation, stable versus unstable patients, tasks vs assessments, and maintaining accountability after assignment.",
  "lpn-rpn-scope-of-practice":
    "RN/RPN(LPN) collaboration items emphasize scope boundaries, teaching versus assigning judgment tasks, and shared accountability in team models.",
  "interprofessional-collaboration-sbar":
    "SBAR items test concise situation-background-assessment-recommendation structure, closed-loop orders read-back, and respectful escalation.",
};

function snippetFor(t) {
  return (
    TOPIC_SNIPPET[t.topicSlug] ||
    `Exam items for ${t.topicLabel} typically pair assessment data with the safest nursing action and the best communication choice under ${t.country} RN preparation standards.`
  );
}

function stemHash(stem) {
  return crypto.createHash("sha256").update(stem.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 32);
}

function titleCaseBodySystem(bs) {
  return bs
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function domainSub(t) {
  const bt = titleCaseBodySystem(t.bodySystem);
  switch (t.category) {
    case "med-surg":
      return { domain: "Physiological Integrity", subdomain: `${bt} Care` };
    case "pharmacology":
      return { domain: "Pharmacological Therapies", subdomain: "Medication Safety" };
    case "prioritization":
      return { domain: "Management of Care", subdomain: "Priority Setting" };
    case "safety":
      return { domain: "Safety and Infection Control", subdomain: "Risk Reduction" };
    case "delegation":
      return { domain: "Management of Care", subdomain: "Delegation" };
    default:
      return { domain: "Management of Care", subdomain: "General" };
  }
}

function countryLabel(c) {
  return c === "CA" ? "Canada" : "United States";
}

function regionNote(t) {
  if (t.country === "CA") {
    return "Use Canadian context where relevant: SI labs (mmol/L for glucose when applicable), kPa for blood gases when used, CTAS triage language for emergency scenarios, RPN/LPN scope paired with RN accountability, and provincial interprofessional standards. This is exam preparation content, not bedside medical orders.";
  }
  return "Use US NCLEX-RN context where relevant: common US units (mg/dL glucose when applicable), START triage language for mass-casualty style stems, UAP scope language, and Joint Commission–style safety framing. This is exam preparation content, not bedside medical orders.";
}

function pickRelatedSlugs(allTopics, t, max = 6) {
  const sameCat = allTopics.filter((x) => x.topicSlug !== t.topicSlug && x.category === t.category);
  const sameBs = allTopics.filter(
    (x) => x.topicSlug !== t.topicSlug && x.bodySystem === t.bodySystem && !sameCat.includes(x),
  );
  const pool = [...sameCat, ...sameBs, ...allTopics.filter((x) => x.topicSlug !== t.topicSlug)];
  const out = [];
  const seen = new Set();
  for (const x of pool) {
    if (seen.has(x.topicSlug)) continue;
    seen.add(x.topicSlug);
    out.push(x.topicSlug);
    if (out.length >= max) break;
  }
  return out;
}

function buildLesson(allTopics, t) {
  const { domain, subdomain } = domainSub(t);
  const related = pickRelatedSlugs(allTopics, t, 6);
  const slug = t.topicSlug;
  const tags = Array.from(new Set([...(t.tags || []), "rn-exam-prep", t.category, t.difficulty])).map((x) =>
    String(x).toLowerCase().replace(/\s+/g, "-"),
  );

  const sn = snippetFor(t);
  const summary = `Exam-focused review of ${t.topicLabel} for RN candidates in the ${countryLabel(t.country)} context, with emphasis on assessment cues, priority interventions, monitoring, and patient safety. ${sn} ${regionNote(t)}`;

  const learningObjectives = [
    `Describe priority assessment findings and monitoring parameters for ${t.topicLabel} on a medical-surgical or step-down unit.`,
    `Explain evidence-informed nursing interventions, including when to escalate care and how to communicate using SBAR.`,
    `Identify common exam distractors related to ${t.topicLabel} and distinguish safe nursing actions from unsafe choices.`,
    `Apply ${t.category === "pharmacology" ? "pharmacology principles, adverse effects, and monitoring" : "clinical judgment"} to integrated scenarios involving ${titleCaseBodySystem(t.bodySystem)} priorities.`,
  ];

  const ctx = regionNote(t);
  const sections = [
    {
      heading: "Clinical overview",
      body: `${t.topicLabel} is a high-yield topic for RN licensing exams because it blends pathophysiology, assessment, interventions, and safety. Nurses are tested on recognizing instability early, selecting the best first action, and anticipating complications rather than memorizing rare trivia. Keep the ${t.bodySystem.replace(/-/g, " ")} lens in mind: trends beat single numbers, and airway–breathing–circulation threats outrank comfort tasks when priorities compete. Topic focus: ${sn} ${ctx}`,
    },
    {
      heading: "Pathophysiology and risk factors (exam lens)",
      body: `Focus on mechanisms that create predictable nursing priorities: tissue oxygen delivery, fluid shifts, inflammation, end-organ perfusion, and medication-related vulnerabilities. Exam items often pair a subtle trend (rising heart rate, narrowing pulse pressure, new confusion, or progressive work of breathing) with a distractor that sounds reasonable but delays escalation. Ask yourself what would harm the patient fastest if ignored, and what assessment data would change your next action within minutes. Reinforce: ${sn}`,
    },
    {
      heading: "Assessment and monitoring",
      body: `Build a mental checklist for bedside assessment: level of consciousness and airway protection, work of breathing and oxygenation, perfusion and urine output when relevant, pain and sedation interplay, infection cues, and high-alert medication effects. Tie monitoring to the plan of care: what parameter, how often, what threshold triggers notification, and what you would say in SBAR. For ${countryLabel(t.country)} learners, be fluent in both common unit conventions used in stems and the underlying physiology so unit swaps do not break your reasoning.`,
    },
    {
      heading: "Interventions, collaboration, and safety",
      body: `Prioritize interventions that stabilize the patient, prevent injury, and preserve dignity: oxygen and airway support as indicated, vascular access and labs as ordered, medication administration with rights verification, fall and bleeding precautions, infection prevention, and patient education that matches readiness to learn. Delegation items reward knowing what can be assigned to UAP/PSW versus what requires RN judgment, including follow-up supervision. Documentation should reflect assessments, notifications, and patient responses—not tasks performed without verification.`,
    },
    {
      heading: "Exam strategy and distractor patterns",
      body: `Expect prioritization stems with multiple “urgent-sounding” patients: choose the option that addresses airway, breathing, circulation, or rapid neurologic decline first. For medication items, watch for reversed priorities (treating a number without symptoms), duplicate therapy, ignored allergies, and monitoring omissions for high-risk classes. SATA items reward comprehensive safe nursing: select every true nursing action, not only the “most important” one. When uncertain, eliminate options that delay assessment, withhold needed escalation, or violate scope and standards of practice.`,
    },
  ];

  const examTips = [
    "If two answers look correct, pick the action that assesses first when assessment data is missing—unless the stem already confirms a life threat that requires immediate intervention.",
    "For medication safety, link high-alert drugs to monitoring (labs, vitals, sedation, bleeding) rather than memorizing isolated facts.",
    "SATA: treat each option as true/false; do not stop after finding two correct answers if more are safe and indicated.",
    `Region tip (${t.country}): read units carefully and translate glucose or lab values mentally when the stem uses ${t.country === "CA" ? "mmol/L" : "mg/dL"} conventions.`,
  ];

  return {
    title: t.topicLabel,
    slug,
    topicSlug: slug,
    program: PROGRAM,
    country: t.country,
    exam: "nclex-rn",
    domain,
    subdomain,
    bodySystem: t.bodySystem,
    tags,
    summary,
    learningObjectives,
    sections,
    examTips,
    relatedTopicSlugs: related,
    seoTitle: `${t.topicLabel} | RN Exam Prep | NurseNest`.slice(0, 70),
    seoDescription: summary.slice(0, 160),
  };
}

function questionPlan(difficulty) {
  if (difficulty === "easy") return ["mcq", "mcq", "mcq", "mcq"];
  if (difficulty === "medium") return ["mcq", "mcq", "mcq", "sata"];
  return ["mcq", "mcq", "sata", "sata"];
}

function cognitiveFor(i, kind) {
  if (kind === "sata") return i === 3 ? "analysis" : "application";
  return i === 0 ? "application" : i === 1 ? "analysis" : "application";
}

function buildQuestions(allTopics, t) {
  const { domain, subdomain } = domainSub(t);
  const plan = questionPlan(t.difficulty);
  const relatedLessons = pickRelatedSlugs(allTopics, t, 4).filter((s) => s !== t.topicSlug);
  const baseRelated = [t.topicSlug, ...relatedLessons].slice(0, 5);
  const tags = Array.from(new Set([...(t.tags || []), "rn-exam-prep", t.category])).map((x) =>
    String(x).toLowerCase().replace(/\s+/g, "-"),
  );

  const qs = [];
  let qi = 0;
  for (const kind of plan) {
    if (kind === "mcq") {
      qs.push(buildMcq(t, domain, subdomain, tags, baseRelated, qi));
    } else {
      qs.push(buildSata(t, domain, subdomain, tags, baseRelated, qi));
    }
    qi++;
  }
  return qs;
}

function buildMcq(t, domain, subdomain, tags, baseRelated, qi) {
  const sn = snippetFor(t);
  const label = t.topicLabel;
  const packs = [
    {
      stem: `(${t.country} RN prep; ${t.topicSlug}; Q${qi + 1}) A patient is being cared for on a medical-surgical unit with a working diagnosis related to ${label}. The nurse notes a new, objective change suggesting worsening perfusion or oxygenation. Which priority action is most appropriate first? Exam focus: ${sn}`,
      choices: [
        `A. Perform a focused assessment (including airway, breathing, circulation, and neuro checks) and follow unit escalation for acute changes`,
        `B. Finish non-urgent charting tasks before reassessing the patient because stable documentation is the priority`,
        `C. Ask the UAP/PSW to independently interpret the change and decide whether to call the provider`,
        `D. Tell the patient to "sleep it off" and reassess next round without additional vitals`,
      ],
      correctAnswer: "A",
      incorrectRationales: {
        B: "Documentation is important, but it does not precede assessment of new objective instability; exams consistently prioritize patient assessment over administrative tasks when safety is at risk.",
        C: "Unlicensed assistive personnel cannot replace RN assessment and clinical judgment for acute changes; the RN must evaluate, supervise, and escalate when indicated.",
        D: "Dismissing acute changes without assessment violates standards of care and patient safety expectations on RN exams.",
      },
    },
    {
      stem: `(${t.country} RN prep; ${t.topicSlug}; Q${qi + 1}) The nurse is preparing patient education before discharge for ${label}. Which teaching statement best reflects safe, exam-style priorities? Context: ${sn}`,
      choices: [
        `A. Teach warning signs that require urgent evaluation and how to contact the care team, aligned with the patient's literacy and language needs`,
        `B. Advise the patient to stop all prescribed medications if they feel better to avoid side effects`,
        `C. Tell the patient to double the next dose if a dose is missed to "catch up" without contacting a provider`,
        `D. Recommend ignoring new swelling, chest pain, or sudden shortness of breath for 24 hours unless it worsens dramatically`,
      ],
      correctAnswer: "A",
      incorrectRationales: {
        B: "Patients should not discontinue prescribed medications without provider guidance; this option introduces serious harm and is never the best teaching answer.",
        C: "Doubling doses after a missed dose is unsafe for many medication classes and is not appropriate generic teaching.",
        D: "Red-flag symptoms should prompt urgent evaluation; delaying care is clinically unsafe and fails exam expectations for patient education.",
      },
    },
    {
      stem: `(${t.country} RN prep; ${t.topicSlug}; Q${qi + 1}) Which nursing action best demonstrates safe medication and monitoring practice for ${label}? Hint: ${sn}`,
      choices: [
        `A. Verify the medication order, confirm patient identity, assess relevant vitals/labs per protocol, and document administration and patient response`,
        `B. Administer a PRN sedative first whenever the patient seems anxious, without reassessing respiratory status`,
        `C. Crush enteric-coated or extended-release medications whenever administration is easier for the nurse`,
        `D. Skip allergy verification if the patient has received the medication before on a prior admission`,
      ],
      correctAnswer: "A",
      incorrectRationales: {
        B: "Sedation decisions require assessment of respiratory status and indication; indiscriminate PRN use is unsafe.",
        C: "Altering formulation without an order and pharmacist guidance can change absorption and cause harm.",
        D: "Allergy verification is a standard safety step; prior tolerance does not remove the need to verify each administration cycle per policy.",
      },
    },
  ];
  const pack = packs[qi % 3];
  const rationale = `This item tests RN-level safety and clinical judgment for ${label} (${t.topicSlug}). The correct option applies assessment-first and evidence-aligned nursing actions, including rights-based medication administration, appropriate escalation, and patient education that emphasizes red flags. Incorrect options illustrate common NCLEX distractors: delaying assessment, unsafe teaching, inappropriate delegation of judgment, or violating medication safety standards. ${regionNote(t)}`;
  return {
    stem: pack.stem,
    questionType: "single-best-answer",
    choices: pack.choices,
    correctAnswer: pack.correctAnswer,
    correctAnswers: null,
    rationale,
    incorrectRationales: pack.incorrectRationales,
    difficulty: t.difficulty,
    topicSlug: t.topicSlug,
    tags,
    bodySystem: t.bodySystem,
    domain,
    subdomain,
    program: PROGRAM,
    country: t.country,
    exam: "nclex-rn",
    cognitiveLevel: cognitiveFor(qi, "mcq"),
    relatedLessonSlugs: baseRelated,
  };
}

function buildSata(t, domain, subdomain, tags, baseRelated, qi) {
  const sn = snippetFor(t);
  const stem = `(${t.country} RN prep; ${t.topicSlug}; Q${qi + 1}) Select all that apply: Which nursing actions are appropriate for safe care of a patient with ${t.topicLabel}? Exam focus: ${sn}`;
  const choices = [
    "A. Monitor trends in vitals and level of consciousness alongside ordered labs",
    "B. Verify medications using rights of administration and high-alert precautions when applicable",
    "C. Withhold all fluids and nutrition indefinitely without a provider order",
    "D. Use SBAR to communicate acute changes and anticipated needs to the provider team",
    "E. Apply infection prevention practices including hand hygiene and appropriate PPE",
  ];
  const correctAnswers = ["A", "B", "D", "E"];
  const rationale = `For ${t.topicLabel}, safe nursing care integrates ongoing assessment, medication safety, structured communication, and infection prevention. Monitoring trends (A) detects deterioration early. Rights verification and high-alert vigilance (B) reduce preventable harm. SBAR (D) supports timely escalation. Standard precautions and transmission-based precautions as indicated (E) reduce cross-transmission. Withholding all fluids and nutrition indefinitely (C) is not a generic nursing action without orders and clinical indication, so it is incorrect on licensing exams unless the stem explicitly supports NPO with alternative plans. ${regionNote(t)}`;
  const incorrectRationales = {
    C: "Indefinite withholding of fluids and nutrition without orders and a documented plan is not a blanket appropriate action; nutrition and hydration decisions require provider direction and clinical context.",
  };
  return {
    stem,
    questionType: "sata",
    choices,
    correctAnswer: null,
    correctAnswers,
    rationale,
    incorrectRationales,
    difficulty: t.difficulty,
    topicSlug: t.topicSlug,
    tags,
    bodySystem: t.bodySystem,
    domain,
    subdomain,
    program: PROGRAM,
    country: t.country,
    exam: "nclex-rn",
    cognitiveLevel: cognitiveFor(qi, "sata"),
    relatedLessonSlugs: baseRelated,
  };
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const topics = manifest.topics;
  if (topics.length !== 50) throw new Error(`Expected 50 topics, got ${topics.length}`);

  const lessons = topics.map((t) => buildLesson(topics, t));
  const questions = topics.flatMap((t) => buildQuestions(topics, t));

  if (questions.length !== 200) throw new Error(`Expected 200 questions, got ${questions.length}`);

  const hashes = new Set();
  const dupes = [];
  for (const q of questions) {
    const h = stemHash(q.stem);
    if (hashes.has(h)) dupes.push(h);
    hashes.add(h);
  }
  if (dupes.length) throw new Error(`Duplicate stem hashes: ${dupes.join(",")}`);

  const topicSlugs = new Set(topics.map((t) => t.topicSlug));
  const lessonSlugs = new Set(lessons.map((l) => l.slug));
  if (lessonSlugs.size !== 50) throw new Error("Duplicate lesson slugs");

  const out = {
    _meta: {
      description: "50 RN lessons + 200 RN exam questions generated from rn-topic-manifest.json (static, no API)",
      program: PROGRAM,
      blueprintFile: "output/rn-topic-manifest.json",
      generatedAt: new Date().toISOString(),
      totalLessons: lessons.length,
      totalQuestions: questions.length,
      questionMix: {
        singleBestAnswer: questions.filter((q) => q.questionType === "single-best-answer").length,
        sata: questions.filter((q) => q.questionType === "sata").length,
      },
      stemHashAlgorithm: "sha256-hex-first32-lowercase-stem",
      duplicateStemHashesFound: dupes.length,
    },
    lessons,
    questions,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${OUT} (${lessons.length} lessons, ${questions.length} questions)`);
}

main();
