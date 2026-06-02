#!/usr/bin/env node
/**
 * Generates RN NCLEX-RN (CA + US) Procedures & Skills expansion catalog JSON.
 * Run from nursenest-core: node scripts/generate-rn-nclex-procedures-skills-expansion-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-procedures-skills-expansion-catalog.json");

const LESSONS = [
  ["Vital Signs Assessment", "proc-skill-vital-signs-assessment-rn"],
  ["Pain Assessment", "proc-skill-pain-assessment-rn"],
  ["Head-to-Toe Physical Assessment", "proc-skill-head-to-toe-assessment-rn"],
  ["Sterile Technique vs Clean Technique", "proc-skill-sterile-vs-clean-technique-rn"],
  ["Hand Hygiene and Infection Prevention", "proc-skill-hand-hygiene-infection-prevention-rn"],
  ["PPE Use and Removal", "proc-skill-ppe-donning-doffing-rn"],
  ["Oral Medication Administration", "proc-skill-oral-medication-administration-rn"],
  ["IM Injections", "proc-skill-im-injections-rn"],
  ["Subcutaneous Injections", "proc-skill-subcutaneous-injections-rn"],
  ["IV Medication Administration", "proc-skill-iv-medication-administration-rn"],
  ["Medication Safety Checks", "proc-skill-medication-safety-checks-rn"],
  ["High-Alert Medication Handling", "proc-skill-high-alert-medications-rn"],
  ["IV Insertion and Care", "proc-skill-iv-insertion-and-care-rn"],
  ["IV Fluid Administration", "proc-skill-iv-fluid-administration-rn"],
  ["Central Line Care", "proc-skill-central-line-care-rn"],
  ["PICC Line Management", "proc-skill-picc-line-management-rn"],
  ["Oxygen Administration", "proc-skill-oxygen-administration-rn"],
  ["Suctioning (Oral and Nasopharyngeal)", "proc-skill-suctioning-oral-nasopharyngeal-rn"],
  ["Tracheostomy Care", "proc-skill-tracheostomy-care-rn"],
  ["Nebulizer and Inhaler Use", "proc-skill-nebulizer-inhaler-use-rn"],
  ["Patient Transfers and Lifts", "proc-skill-patient-transfers-lifts-rn"],
  ["Fall Prevention Interventions", "proc-skill-fall-prevention-interventions-rn"],
  ["Restraint Application and Monitoring", "proc-skill-restraint-monitoring-rn"],
  ["Positioning and Pressure Injury Prevention", "proc-skill-positioning-pressure-injury-prevention-rn"],
  ["Urinary Catheter Insertion", "proc-skill-urinary-catheter-insertion-rn"],
  ["Catheter Care and Removal", "proc-skill-catheter-care-removal-rn"],
  ["Enema Administration", "proc-skill-enema-administration-rn"],
  ["Bowel Management", "proc-skill-bowel-management-rn"],
  ["Basic Wound Care", "proc-skill-basic-wound-care-rn"],
  ["Dressing Changes", "proc-skill-dressing-changes-rn"],
  ["Drain Care (JP and Hemovac)", "proc-skill-drain-care-jp-hemovac-rn"],
  ["Feeding Assistance", "proc-skill-feeding-assistance-rn"],
  ["NG Tube Insertion and Verification", "proc-skill-ng-tube-insertion-verification-rn"],
  ["Enteral Feeding Administration", "proc-skill-enteral-feeding-administration-rn"],
  ["Blood Glucose Monitoring", "proc-skill-blood-glucose-monitoring-rn"],
  ["Specimen Collection (Urine, Stool, Sputum)", "proc-skill-specimen-collection-rn"],
  ["Blood Draw Basics (Peripheral Venipuncture)", "proc-skill-blood-draw-basics-rn"],
  ["Postoperative Care Basics", "proc-skill-postoperative-care-basics-rn"],
  ["Surgical Asepsis", "proc-skill-surgical-asepsis-rn"],
  ["Early Ambulation and Complication Prevention", "proc-skill-early-ambulation-complication-prevention-rn"],
  ["Which Procedure Is Unsafe?", "proc-skill-unsafe-procedure-clinical-judgment-rn"],
  ["What Do You Do First? (Procedures & Skills)", "proc-skill-what-do-you-first-procedures-rn"],
  ["NGN Procedures Case Studies", "proc-skill-ngn-procedures-case-studies-rn"],
];

function buildLesson(title, slug) {
  const short = `${title} for NCLEX-RN: nursing priorities, safety checks, patient teaching, and clinical judgment cues aligned with US and Canadian RN practice.`;
  return {
    slug,
    title,
    topic: "Procedures & Skills",
    topicSlug: "procedures-and-skills",
    bodySystem: "General",
    system: "procedures-skills",
    previewSectionCount: 1,
    priority: "high",
    examRelevance: "high_yield",
    exams: ["NCLEX_RN"],
    countries: ["CA", "US"],
    seoTitle: `${title} | Procedures & Skills | NCLEX-RN | NurseNest`,
    seoDescription: short,
    relatedLessonRefs: [
      { slug: "sepsis-early-recognition-hy", titleHint: "Sepsis early recognition" },
      { slug: "ppe-transmission-basics", titleHint: "PPE and transmission basics" },
    ],
    sections: [
      {
        id: `${slug}-clinical_meaning`,
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**${title}** is a core **Procedures & Skills** competency for NCLEX-RN: you must match **assessment** to **indication**, follow **policy and orders**, protect **airway–breathing–circulation** when instability appears, and document **objective** findings with **timestamps**. Boards reward **sequence** (verify identity, indications, allergies, equipment integrity) before **speed**.\n\nConnect this skill to **infection prevention** ([PPE & transmission basics](LESSON:ppe-transmission-basics)), **deterioration recognition** ([sepsis early recognition](LESSON:sepsis-early-recognition-hy)), and your pathway hubs: [Canada RN lessons](/canada/rn/nclex-rn/lessons) · [US RN lessons](/us/rn/nclex-rn/lessons).\n\n**Learning objectives:** state indications and contraindications for this procedure in acute care; list required supplies and monitoring; identify when to **stop**, **reassess**, and **escalate** to the provider or rapid response.\n\n**Nursing priorities:** verify **consent/orders** when applicable; maintain **asepsis** or **clean technique** per stem; protect **privacy** and **dignity**; teach using **teach-back** after stabilization.`,
      },
      {
        id: `${slug}-exam_relevance`,
        heading: "Why NCLEX-RN tests this",
        kind: "exam_relevance",
        body: `Examiners embed **Procedures & Skills** items as **first action**, **priority**, or **NGN case** questions. Expect traps that **skip verification**, **expand scope**, **delegate unstable assessment** to UAP, or **continue** a procedure when **new red flags** appear (hypotension, hypoxia, new confusion, uncontrolled bleeding, severe pain).\n\nEliminate answers that **delay reporting** critical changes, **violate isolation** or **PPE** sequence, or **rush teaching** during active instability. When two tasks compete, choose the option that **reduces imminent harm** first.`,
      },
      {
        id: `${slug}-core_concept`,
        heading: "Core concepts and safety",
        kind: "core_concept",
        body: `- **Preparation:** gather equipment, perform hand hygiene, explain steps, position the patient, ensure **privacy**.\n- **Execution:** follow **rights** of medication administration when applicable; maintain **sterile field** integrity when the stem specifies sterile technique; label specimens at **bedside** per policy.\n- **Monitoring:** repeat **vitals** and focused assessments per frequency; inspect **sites** (IV, wound, catheter) for infection and device integrity.\n- **Red flags / safety:** sudden **dyspnea**, **chest pain**, **hypotension**, **neuro change**, **bleeding**, **anaphylaxis** signs—**stop** the procedure as appropriate, **stay with the patient**, **call for help**, and **notify the provider** with objective data.\n- **Patient teaching:** use clear language; confirm **understanding**; include **when to call** the nurse and **activity** or **diet** restrictions tied to the procedure.`,
      },
      {
        id: `${slug}-clinical_scenario`,
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 68-year-old client is assigned for **${title.toLowerCase()}** during your shift. Mid-procedure they report **new** **shortness of breath** and **dizziness**. Vitals show **hypotension** compared with baseline and **tachycardia**.\n\n**Fork:** **Stop** the procedure if continuing would risk harm; **stay** with the patient; **raise the bed** if ordered; **apply oxygen** per protocol; **repeat vitals**; **notify the provider** using **SBAR** with trends—not completion of paperwork first. This tests whether you **prioritize assessment and escalation** over task completion.`,
      },
      {
        id: `${slug}-takeaways`,
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Verify → perform → monitor → document** is the backbone of safe procedures.\n- **New instability** during a skill **pauses** the task and **triggers** reassessment and escalation.\n- **Synthesis:** NCLEX rewards **patient-centered** sequencing and **scope-safe** nursing actions.\n\n**Related:** [Sepsis early recognition](LESSON:sepsis-early-recognition-hy) · [PPE & transmission basics](LESSON:ppe-transmission-basics) · [Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
    preTest: [
      {
        question: `Before beginning ${title}, what is the nurse's best first priority on NCLEX-RN?`,
        options: [
          "Complete unrelated charting to save time",
          "Verify the correct patient, indications, allergies, and orders; prepare equipment and explain the procedure",
          "Delegate all monitoring to the UAP while the nurse leaves the unit",
          "Assume consent without checking policy",
        ],
        correct: 1,
        rationale: "Safe procedure nursing begins with verification, preparation, and communication before performing the skill.",
      },
    ],
    postTest: [
      {
        question: "During a procedure, the client develops new hypotension and confusion. What should the nurse do first?",
        options: [
          "Finish the procedure quickly before reassessing",
          "Stop or pause the procedure as appropriate, remain with the patient, reassess vitals, and notify the provider with objective data",
          "Send the family out without explanation",
          "Increase the procedure rate to shorten exposure time",
        ],
        correct: 1,
        rationale: "New hemodynamic or neuro changes require immediate safety actions: pause the task, reassess, and escalate per protocol.",
      },
    ],
  };
}

const pathways = {
  "ca-rn-nclex-rn": LESSONS.map(([title, slug]) => buildLesson(title, slug)),
  "us-rn-nclex-rn": LESSONS.map(([title, slug]) => buildLesson(title, slug)),
};

const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-nclex-procedures-skills-expansion-catalog.mjs",
  pathways,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${pathways["ca-rn-nclex-rn"].length} lessons per pathway).`);
