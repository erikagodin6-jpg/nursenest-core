import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildAuthorityTopic,
  buildDailyAuthorityPublishingPlan,
  type AuthorityLane,
  type AuthorityTopic,
} from "./authority-publishing-types.mjs";

const OUT_DIR = join(process.cwd(), "src/content/blog-static-longtail");

const LINKS = {
  ecg: [
    { label: "ECG Interpretation", href: "/ecg-interpretation" },
    { label: "Advanced ECG", href: "/advanced-ecg-nursing" },
    { label: "ECG Telemetry Mastery", href: "/ecg-telemetry-mastery" },
    { label: "Practice Tests", href: "/app/practice-tests" },
    { label: "Flashcards", href: "/app/flashcards" },
  ],
  cnple: [
    { label: "CNPLE Simulation", href: "/canada/np/cnple/simulation" },
    { label: "CNPLE Questions", href: "/canada/np/cnple/questions" },
    { label: "CNPLE Lessons", href: "/canada/np/cnple/lessons" },
    { label: "Flashcards", href: "/app/flashcards" },
  ],
  rexpn: [
    { label: "REx-PN Questions", href: "/canada/rpn/rex-pn/questions" },
    { label: "REx-PN Lessons", href: "/canada/rpn/rex-pn/lessons" },
    { label: "Practice Tests", href: "/app/practice-tests" },
  ],
  nclex: [
    { label: "NCLEX Questions", href: "/us/rn/nclex-rn/questions" },
    { label: "NCLEX Lessons", href: "/us/rn/nclex-rn/lessons" },
    { label: "CAT Exams", href: "/us/rn/nclex-rn/cat" },
  ],
  rt: [
    { label: "Allied Health", href: "/allied-health" },
    { label: "RT Lessons", href: "/us/allied-health/rt/lessons" },
    { label: "RT Questions", href: "/us/allied-health/rt/questions" },
    { label: "Practice Tests", href: "/app/practice-tests" },
  ],
  pathophysiology: [
    { label: "Lessons", href: "/app/lessons" },
    { label: "Questions", href: "/app/questions" },
    { label: "Practice Tests", href: "/app/practice-tests" },
    { label: "Flashcards", href: "/app/flashcards" },
  ],
} as const;

const BANKS: Record<AuthorityLane, string[]> = {
  ecg: [
    "Mobitz I vs Mobitz II Explained for Nurses",
    "Hyperkalemia ECG Changes Explained",
    "Atrial Flutter vs Atrial Fibrillation",
    "What Causes Peaked T Waves",
    "ECG Rhythms Nurses Must Know",
    "Ventricular Tachycardia vs SVT With Aberrancy",
    "Torsades de Pointes ECG Findings",
    "First Degree AV Block ECG Criteria",
    "Complete Heart Block Nursing Priorities",
    "Bundle Branch Block ECG Interpretation",
    "Left Axis Deviation Explained for Nurses",
    "Right Axis Deviation ECG Causes",
    "Wide Complex Tachycardia Nursing Approach",
    "Pacemaker Spikes on ECG Explained",
    "ST Elevation vs ST Depression Nursing Review",
    "QT Prolongation Causes and ECG Risks",
    "Adenosine Responsive Rhythms Explained",
    "Junctional Rhythm ECG Criteria",
    "Premature Ventricular Contractions Nursing Review",
    "Sinus Tachycardia vs SVT Explained",
    "Fascicular VT Explained for Telemetry Nurses",
    "Brugada Pattern ECG Review",
    "WPW ECG Pattern Explained",
    "Inferior MI ECG Changes",
    "Anterior MI ECG Changes",
    "Posterior MI ECG Clues",
    "Atrial Tachycardia vs Atrial Flutter",
    "Accelerated Idioventricular Rhythm Explained",
    "Asystole vs Fine Ventricular Fibrillation",
    "Telemetry Artifact vs Ventricular Tachycardia",
  ],
  cnple: [
    "Best Way to Study for the CNPLE",
    "CNPLE LOFT Simulation Explained",
    "CNPLE Practice Exam Strategy for Canadian Nurse Practitioners",
    "CNPLE Clinical Reasoning Questions",
    "CNPLE Prescribing Safety Study Guide",
    "CNPLE Hypertension Case Review",
    "CNPLE Diabetes Management Questions",
    "CNPLE Pediatrics Clinical Scenarios",
    "CNPLE Women's Health Review",
    "CNPLE Mental Health Prescribing Review",
    "CNPLE Health Promotion Questions",
    "CNPLE Differential Diagnosis Approach",
    "CNPLE Diagnostic Testing Strategy",
    "CNPLE SOAP Note Study Guide",
    "CNPLE Exam Blueprint Explained",
    "CNPLE Common Mistakes to Avoid",
    "CNPLE Adult Primary Care Scenarios",
    "CNPLE Geriatrics Review Questions",
    "CNPLE Infectious Disease Prescribing",
    "CNPLE Red Flags in Primary Care",
    "CNPLE Asthma Management Case",
    "CNPLE COPD Primary Care Review",
    "CNPLE Chest Pain Differential Diagnosis",
    "CNPLE Abdominal Pain Case Review",
    "CNPLE Thyroid Disorder Questions",
    "CNPLE Contraception Counseling Review",
    "CNPLE Antibiotic Stewardship Questions",
    "CNPLE Lab Interpretation Strategy",
    "CNPLE Preventive Screening Guide",
    "CNPLE Follow Up Planning Cases",
  ],
  rexpn: [
    "Best Way to Study for the REx-PN",
    "REx-PN Practice Questions Strategy",
    "REx-PN vs NCLEX Explained",
    "REx-PN Pharmacology Tips",
    "REx-PN Prioritization Questions",
    "REx-PN Safety and Infection Control Review",
    "REx-PN Maternal Newborn Review",
    "REx-PN Mental Health Nursing Questions",
    "REx-PN Delegation and Scope Review",
    "REx-PN Med Surg Study Plan",
    "REx-PN Clinical Judgment Tips",
    "REx-PN Dosage Calculation Review",
  ],
  nclex: [
    "How to Answer NCLEX Prioritization Questions",
    "NCLEX SATA Questions Strategy",
    "NCLEX Pharmacology Mistakes Students Make",
    "NCLEX Clinical Judgment Case Study Approach",
    "NCLEX Delegation Questions Explained",
    "NCLEX Safety Questions Strategy",
    "NCLEX Lab Values High Yield Review",
    "NCLEX Cardiac Questions Nurses Miss",
    "NCLEX Respiratory Questions Explained",
    "NCLEX Endocrine Questions Strategy",
    "NCLEX Renal Questions Review",
    "NCLEX Maternity Questions Strategy",
  ],
  rt: [
    "How to Interpret an ABG Step by Step",
    "Respiratory Acidosis vs Respiratory Alkalosis",
    "Metabolic Acidosis Compensation Explained",
    "What Is PEEP on a Ventilator",
    "Assist Control Ventilation Explained",
    "SIMV vs Assist Control Ventilation",
    "Pressure Support Ventilation Explained",
    "ARDS Ventilator Strategy Basics",
    "VQ Mismatch Explained for RT Students",
    "Hypoxemia vs Hypoxia Explained",
    "COPD Oxygen Therapy Exam Review",
    "Oxygen Dissociation Curve Explained",
    "Permissive Hypercapnia Explained",
    "Peak Pressure vs Plateau Pressure",
    "Ventilator Alarms RT Students Should Know",
    "ABG Compensation Rules for Exams",
    "Respiratory Failure Types Explained",
    "Bronchodilator Therapy Exam Review",
    "Tracheostomy Care RT Review",
    "Weaning From Mechanical Ventilation",
    "Dead Space Ventilation Explained",
    "Shunt Physiology Explained",
    "High Flow Nasal Cannula Review",
    "Noninvasive Ventilation Indications",
  ],
  pathophysiology: [
    "Why Pulmonary Edema Causes Crackles",
    "Why DKA Causes Kussmaul Respirations",
    "Why Sepsis Causes Lactic Acidosis",
    "Why Heart Failure Causes Orthopnea",
    "Why COPD Causes Hypercapnia",
    "Why Kidney Failure Causes Hyperkalemia",
    "Why Liver Failure Causes Ascites",
    "Why Anemia Causes Tachycardia",
    "Why Hypovolemia Causes Hypotension",
    "Why Pneumonia Causes Hypoxemia",
    "Why Asthma Causes Wheezing",
    "Why Pulmonary Embolism Causes Sudden Dyspnea",
    "Why Pancreatitis Causes Hypocalcemia",
    "Why SIADH Causes Hyponatremia",
    "Why Diabetes Insipidus Causes Hypernatremia",
    "Why Adrenal Crisis Causes Shock",
    "Why Cushing Syndrome Causes Hyperglycemia",
    "Why Stroke Causes Unilateral Weakness",
    "Why Meningitis Causes Neck Stiffness",
    "Why Bowel Obstruction Causes Vomiting",
    "Why Pulmonary Hypertension Causes Right Heart Strain",
    "Why Nephrotic Syndrome Causes Edema",
    "Why Cirrhosis Causes Coagulopathy",
    "Why Hypocalcemia Causes Tetany",
  ],
};

function categoryFor(lane: AuthorityLane): string {
  return lane === "ecg" ? "ECG Interpretation" : lane === "cnple" ? "CNPLE" : lane === "rt" ? "Respiratory Therapy" : lane === "pathophysiology" ? "Pathophysiology" : lane === "rexpn" ? "REx-PN" : "NCLEX-RN";
}

function topic(lane: AuthorityLane, title: string): AuthorityTopic {
  return buildAuthorityTopic({
    lane,
    title,
    category: categoryFor(lane),
    tags: [lane, "nursing", "clinical reasoning", categoryFor(lane)],
    internalLinks: [...LINKS[lane]],
    clinicalFocus: `${title} clinical reasoning, mechanism, assessment priorities, and exam preparation`,
    learnerIntent: `Learn ${title} with a practical NurseNest review that connects bedside reasoning to exam performance`,
  });
}

const lanes = Object.fromEntries(
  Object.entries(BANKS).map(([lane, titles]) => [lane, titles.map((title) => topic(lane as AuthorityLane, title))]),
) as Record<AuthorityLane, AuthorityTopic[]>;

const plan = buildDailyAuthorityPublishingPlan({
  startDate: "2026-05-17",
  days: 365,
  lanes,
});

mkdirSync(OUT_DIR, { recursive: true });

function bodyFor(post: AuthorityTopic): string {
  const internalLinks = post.internalLinks.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("\n");
  return `<h2>What this topic means clinically</h2>
<p><strong>${post.title}</strong> matters because learners are not only memorizing a label; they need to connect mechanism, assessment findings, safety risks, and the next best action. This review is designed for clinical reasoning, exam preparation, and bedside pattern recognition.</p>

<h2>Mechanism and pattern recognition</h2>
<p>${post.clinicalFocus}. Focus on what changed, why it changed, and what finding would make the situation unsafe. For exam stems, identify the pivot phrase that tells you whether the question is asking for assessment, intervention, teaching, escalation, or follow-up.</p>

<h2>Assessment priorities</h2>
<ul>
<li>Identify airway, breathing, circulation, neurologic, and perfusion threats first.</li>
<li>Separate chronic baseline findings from acute deterioration.</li>
<li>Pair symptoms with objective data such as vitals, rhythm changes, labs, oxygenation, or trend direction.</li>
<li>Escalate when the patient is unstable, deteriorating, or outside expected recovery.</li>
</ul>

<h2>Exam traps to avoid</h2>
<ul>
<li>Do not choose a memorized fact when the stem is asking for priority.</li>
<li>Do not delay escalation when the scenario includes instability or new deterioration.</li>
<li>Do not ignore scope: choose nursing, NP, or allied actions appropriate to the role in the question.</li>
</ul>

<h2>Related NurseNest study paths</h2>
<ul>
${internalLinks}
</ul>

<h2>How to study this efficiently</h2>
<p>${post.learnerIntent}. Read the mechanism once, test yourself with questions, then return to the concept using flashcards or a simulation-style case so the idea becomes usable under time pressure.</p>

<h2>FAQ</h2>
<h3>What should I focus on first?</h3>
<p>Start with the clinical threat: airway, breathing, circulation, neurologic change, perfusion, or safety. Then connect the finding to the mechanism.</p>
<h3>How does this help on exams?</h3>
<p>It helps you recognize what the stem is really testing: priority, teaching, differential diagnosis, monitoring, or escalation.</p>
<h3>Where should I practice next?</h3>
<p>Use the linked NurseNest lessons, practice questions, flashcards, and simulation pathways to reinforce the topic in multiple formats.</p>`;
}

for (const day of plan) {
  for (const post of day.topics) {
    const md = `---
slug: ${post.slug}
title: "${post.title}"
excerpt: "${post.seoDescription}"
category: "${post.category}"
publishedAt: ${day.date}
updatedAt: ${day.date}
seoTitle: "${post.seoTitle}"
seoDescription: "${post.seoDescription}"
tags: "${post.tags.join(",")}" 
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for institutional policy, or a treatment protocol.
---

${bodyFor(post)}
`;
    writeFileSync(join(OUT_DIR, `${post.slug}.md`), md, "utf8");
  }
}

console.log(`Generated ${plan.length} days of scheduled authority content.`);
