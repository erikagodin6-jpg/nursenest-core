#!/usr/bin/env node
/**
 * Generates `src/content/pathway-lessons/rn-nclex-exam-notes-integration-catalog.json`
 * — RN NCLEX-RN / CA RN spine rows for exam-note topics that had no bundled row (deduped by slug).
 * Run: node scripts/generate-exam-notes-integration-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-exam-notes-integration-catalog.json");

function block(title, paras) {
  const p = paras.join("\n\n");
  return `**${title}** ties high-yield nursing judgment to airway, perfusion, infection control, and safe medication administration. ${p}\n\nCross-link [US RN lessons hub](/us/rn/nclex-rn/lessons) · [Canada RN lessons hub](/canada/rn/nclex-rn/lessons) and related LESSON cards where the stem crosses systems.`;
}

function scenario(title, stem) {
  return `**Patient vignette.** ${stem}\n\n**Fork:** prioritize ABCs, obtain objective trends (vitals, glucose, neuro checks, intake/output), prepare time-sensitive diagnostics per orders, and notify the provider with SBAR including quantified findings—not deferrable tasks first.`;
}

function lesson(def) {
  const {
    slug,
    title,
    topic,
    topicSlug,
    bodySystem,
    clinicalMeaning,
    examRelevance,
    coreConcept,
    clinicalScenario,
    takeaways,
  } = def;
  return {
    slug,
    title,
    topic,
    topicSlug,
    bodySystem,
    system: topicSlug,
    previewSectionCount: 1,
    seoTitle: `${title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN review: ${title} — pathophysiology, assessment, nursing priorities, complications, client education, and exam traps (US + Canada frames).`,
    relatedLessonRefs: def.relatedLessonRefs ?? [],
    sections: [
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinicalMeaning },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: examRelevance },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: coreConcept },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinicalScenario },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
    ],
    preTest: def.preTest,
    postTest: def.postTest,
  };
}

const defs = [
  {
    slug: "kawasaki-disease-nclex-rn",
    title: "Kawasaki Disease (Mucocutaneous Lymph Node Syndrome)",
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "Pediatrics",
    clinicalMeaning: block(
      "Kawasaki disease",
      [
        "Kawasaki disease is an acute, self-limited medium-vessel vasculitis of childhood that preferentially targets coronary arteries. Inflammation weakens the vessel wall and predisposes to coronary artery aneurysms— the dominant morbidity nurses must keep in mind when a febrile child has mucocutal findings and irritability.",
        "The illness classically evolves in stages: acute febrile illness with conjunctival injection, oral changes, rash, extremity changes, and cervical lymphadenopathy; subacute phase with thrombocytosis and peeling; convalescent phase. Nurses anchor on fever duration (classically ≥5 days) plus characteristic findings and the need for timely IVIG to reduce coronary risk.",
        "Because incomplete Kawasaki exists (fewer classic criteria), maintain a low threshold to escalate when persistent fever overlaps with any combination of rash, mucositis, extremity erythema/edema, or unexplained irritability in a young child.",
      ],
    ),
    examRelevance:
      "Examiners reward **first actions** that protect **coronary perfusion** and **fluid balance**: recognize Kawasaki patterns, avoid dismissing prolonged unexplained fever, and know IVIG plus aspirin (under cardiology/rheumatology protocols) are central themes. Traps include choosing antibiotics alone as definitive therapy, delaying echocardiography follow-up themes, or focusing on rash biopsy tasks ahead of escalation.",
    coreConcept:
      "**Criteria & incomplete forms:** classic diagnosis hinges on fever plus several mucocutaneous and lymph node features; incomplete cases may lack full criteria yet still threaten coronaries—use clinical gestalt and consult themes.\n\n**Inflammatory milieu:** IVIG reduces coronary artery complication risk; aspirin dosing shifts between anti-inflammatory and antiplatelet phases in teaching stems—follow protocol language in the item.\n\n**Monitoring priorities:** serial neuro/perfusion checks, hydration status, pain, and cardiac monitoring during IVIG; watch for IVIG reactions.\n\n**Diagnostics:** echo timing and follow-up echo schedules appear as surveillance themes; labs may show thrombocytosis in subacute phase.\n\n**Education:** parents need warning signs of cardiac ischemia in older children with aneurysms and strict return precautions.",
    clinicalScenario: scenario(
      "Kawasaki",
      "A 3-year-old has had **five days of high fever** despite oral antibiotics, **bilateral non-exudative conjunctival injection**, **cracked lips**, **polymorphous trunk rash**, and **edema of the hands**. The child is irritable but alert.",
    ),
    takeaways:
      "- Prolonged fever + mucocutaneous pattern → **think Kawasaki**, not only simple viral illness.\n- **Coronary risk** drives urgency; **IVIG** themes dominate correct management arcs.\n- **Incomplete Kawasaki** is a common trap—fever plus a partial pattern still escalates.\n- **Parent education:** return for chest pain, pallor, syncope, or new neurologic symptoms.\n\n**Related:** [myocardial infarction](LESSON:us-rn-myocardial-infarction) (older learners cross-link coronary concepts) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      {
        question: "Which finding best supports urgent evaluation for Kawasaki disease in a febrile toddler?",
        options: [
          "Isolated unilateral wheeze without fever",
          "Fever ≥5 days with conjunctival injection, mucositis, and extremity changes",
          "Brief fever for 12 hours with runny nose only",
          "Chronic eczema unchanged from baseline",
        ],
        correct: 1,
        rationale: "Kawasaki is defined around prolonged fever plus characteristic mucocutaneous and extremity findings; isolated URI findings lack specificity.",
      },
    ],
    postTest: [
      {
        question: "After IVIG administration, which nursing action is most appropriate?",
        options: [
          "Discontinue all cardiac monitoring to promote sleep",
          "Monitor for infusion reaction, maintain cardiac surveillance per protocol, and document vitals per unit policy",
          "Encourage vigorous exercise to clear rash",
          "Hold all fluids to prevent edema",
        ],
        correct: 1,
        rationale: "IVIG requires monitoring for anaphylactoid reactions and hemodynamic changes; cardiac surveillance aligns with coronary risk.",
      },
    ],
  },
  {
    slug: "tetralogy-of-fallot-nclex-rn",
    title: "Tetralogy of Fallot",
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "Cardiovascular",
    clinicalMeaning: block(
      "Tetralogy of Fallot (TOF)",
      [
        "TOF combines four anatomic issues—ventricular septal defect, overriding aorta, right ventricular outflow obstruction, and right ventricular hypertrophy—producing a cyanotic lesion with **hypercyanotic spells** when pulmonary blood flow suddenly drops.",
        "Nurses anticipate crying, feeding, or agitation as triggers for spells and know positioning (knee-chest) and calm, oxygen, and urgent escalation themes appear on exams.",
        "Postoperative TOF care overlaps with other congenital heart pathways: arrhythmia surveillance, incision care, and family teaching about activity and endocarditis precautions when applicable.",
      ],
    ),
    examRelevance:
      "Look for **spell recognition** and **first actions** that increase pulmonary blood flow and reduce oxygen demand: calm child, knee-chest, oxygen, notify rapid response. Traps include giving large crystalloid boluses indiscriminately without context, prioritizing feeding over airway during a spell, or confusing TOF spells with simple breath-holding without cyanosis.",
    coreConcept:
      "**Pathophysiology:** RV outflow obstruction creates right-to-left shunting during stress, worsening cyanosis.\n\n**Spell management:** knee-chest increases SVR; oxygen supports saturation; morphine may appear in advanced items to reduce hyperpnea—follow the stem’s protocol.\n\n**Diagnostics:** echo defines anatomy; pulse oximetry trends matter.\n\n**Surgical themes:** palliative shunt history vs complete repair changes exam vignettes.\n\n**Family teaching:** recognize spell triggers, emergency plan, and growth/nutrition follow-up.",
    clinicalScenario: scenario(
      "TOF spell",
      "An infant with known TOF becomes **deeply cyanotic** and **hyperpneic** after crying. Oxygen saturation is **58%** on room air and the infant is irritable but awake.",
    ),
    takeaways:
      "- **Hypercyanotic spell** = prioritize **calm + knee-chest + O₂ + notify**.\n- Do not offer a bottle mid-spell ahead of stabilization.\n- Post-repair nursing still monitors **arrhythmias** and **heart failure** signs.\n\n**Related:** [heart failure](LESSON:us-rn-heart-failure) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      {
        question: "During a hypercyanotic spell, which action is most appropriate first?",
        options: [
          "Encourage vigorous feeding to soothe",
          "Position knee-chest, administer oxygen per protocol, and obtain help",
          "Discharge home with a follow-up phone call",
          "Apply ice packs to the chest only",
        ],
        correct: 1,
        rationale: "Knee-chest increases SVR and helps spell physiology; oxygen supports saturation; escalation is required.",
      },
    ],
    postTest: [
      {
        question: "Which statement about TOF is most accurate?",
        options: [
          "It is always acyanotic",
          "RV outflow obstruction contributes to cyanosis during stress",
          "It never requires surgical repair",
          "Spells are harmless and need no documentation",
        ],
        correct: 1,
        rationale: "TOF is classically cyanotic; RVOTO worsens right-to-left shunting during spells.",
      },
    ],
  },
  {
    slug: "wilms-tumor-nclex-rn",
    title: "Wilms Tumor (Nephroblastoma)",
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "Renal",
    clinicalMeaning: block(
      "Wilms tumor",
      [
        "Wilms tumor is the most common renal malignancy of childhood, often presenting as a painless abdominal mass. Nursing priorities center on **avoiding palpation manipulation** that could rupture tumor capsules, protecting kidney function, and preparing families for multimodal therapy (surgery, chemotherapy, radiation in select cases).",
        "Hypertension or hematuria may appear depending on renin secretion or local invasion—integrate BP and urine assessment into surveillance.",
        "Exam items frequently test knowledge that **preoperative biopsy is avoided** in classic protocols to reduce seeding risk—follow guideline language in the stem.",
      ],
    ),
    examRelevance:
      "Expect questions on **abdominal mass safety**, **avoid rough palpation**, and **hypertension** linkage. Traps include aggressive repeated deep palpation for teaching, delaying provider communication when BP is markedly elevated, or confusing Wilms with simple constipation without mass documentation.",
    coreConcept:
      "**Presentation:** flank mass, HTN, hematuria, pain if rupture.\n\n**Diagnostics:** ultrasound/CT/MRI themes; avoid maneuvers that increase rupture risk.\n\n**Treatment arc:** nephrectomy timing, chemo side effects (myelosuppression, mucositis).\n\n**Nursing care:** strict I&O, BP monitoring, infection precautions during neutropenia, psychosocial support.\n\n**Education:** neutropenic fever precautions, medication adherence, imaging follow-up.",
    clinicalScenario: scenario(
      "Wilms",
      "Parents report a **firm left-sided abdominal mass** noticed during bathing. The child has **new elevated blood pressure** but no fever.",
    ),
    takeaways:
      "- **Painless mass + HTN** → renal tumor workup pathway.\n- **Avoid rough/repeated palpation** of an undiagnosed pediatric abdominal mass.\n- **Neutropenia** later drives infection surveillance.\n\n**Related:** [oncology infection risk](LESSON:oncology-infection-risk) · [Canada RN hub](/canada/rn/nclex-rn/lessons).",
    preTest: [
      {
        question: "Which instruction should the nurse provide to parents awaiting Wilms tumor evaluation?",
        options: [
          "Massage the mass vigorously twice daily",
          "Avoid rough manipulation of the abdomen and report new pain, fever, or blood in urine",
          "Cancel all imaging to reduce radiation",
          "Give aspirin freely for discomfort",
        ],
        correct: 1,
        rationale: "Tumor integrity matters; objective symptom reporting and gentle handling align with safety.",
      },
    ],
    postTest: [
      {
        question: "Wilms tumor is most strongly associated with which presentation?",
        options: [
          "Painless abdominal mass in a young child",
          "Unilateral wheeze only",
          "Chronic knee swelling without systemic signs",
          "Isolated sore throat without fever",
        ],
        correct: 0,
        rationale: "Classic teaching emphasizes painless abdominal mass; other findings may coexist.",
      },
    ],
  },
  {
    slug: "acute-lymphoblastic-leukemia-nclex-rn",
    title: "Acute Lymphoblastic Leukemia (ALL)",
    topic: "Hematology & Oncology",
    topicSlug: "hematology-oncology",
    bodySystem: "Hematology",
    clinicalMeaning: block(
      "Acute lymphoblastic leukemia",
      [
        "ALL is a malignant proliferation of lymphoid precursors in marrow, crowding out normal hematopoiesis. Children and some adults present with fatigue, infection, bleeding, bone pain, and hepatosplenomegaly.",
        "Induction chemotherapy aims for remission while supporting the patient through tumor lysis risk, infection from neutropenia, and transfusion needs.",
        "Nurses integrate protective isolation where protocol dictates, meticulous mouth care, and family education about fever thresholds.",
      ],
    ),
    examRelevance:
      "Questions cluster on **infection risk with neutropenia**, **bleeding precautions**, and **TLS monitoring** (uric acid, potassium, phosphorus, calcium). Traps include administering live vaccines during intense immunosuppression, delaying fever reporting, or prioritizing cosmetic tasks over neutropenic fever protocols.",
    coreConcept:
      "**Lab patterns:** pancytopenia from marrow replacement; blasts on smear.\n\n**Complications:** febrile neutropenia, DIC/bleeding, TLS.\n\n**Interventions:** blood product support, growth factor themes, antimicrobial protocols per orders.\n\n**Education:** avoid crowds during nadir, oral hygiene, when to call 911 vs clinic.\n\n**Psychosocial:** developmental support for children; caregiver fatigue.",
    clinicalScenario: scenario(
      "ALL fever",
      "A child on induction chemotherapy has **temperature 38.9°C** and **ANC is 0.2**. They appear tired but oriented.",
    ),
    takeaways:
      "- **Febrile neutropenia** is an emergency pathway in many protocols.\n- **TLS labs** trend early in therapy.\n- **Bleeding precautions** with severe thrombocytopenia.\n\n**Related:** [leukemia nursing care](LESSON:leukemia-nursing-care) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      {
        question: "Which finding most urgently escalates care during ALL induction?",
        options: [
          "Mild pruritus without rash",
          "Fever in the setting of severe neutropenia",
          "Stable chronic eczema",
          "Request for a video game",
        ],
        correct: 1,
        rationale: "Neutropenic fever can progress rapidly to sepsis; protocols prioritize blood cultures and broad-spectrum antimicrobials per orders.",
      },
    ],
    postTest: [
      {
        question: "Tumor lysis syndrome risk is highest during which period?",
        options: [
          "Years after completion of therapy",
          "Early therapy when blast cell turnover is high",
          "Only after surgical resection of solid tumor",
          "Never in leukemias",
        ],
        correct: 1,
        rationale: "Rapid cell breakdown in early chemotherapy increases TLS risk; labs and hydration are monitored closely.",
      },
    ],
  },
  {
    slug: "acute-myelogenous-leukemia-nclex-rn",
    title: "Acute Myelogenous Leukemia (AML)",
    topic: "Hematology & Oncology",
    topicSlug: "hematology-oncology",
    bodySystem: "Hematology",
    clinicalMeaning: block(
      "Acute myelogenous leukemia",
      [
        "AML arises from myeloid precursors and often presents with cytopenias, infections, bleeding, and organ infiltration (gingival hypertrophy in monocytic subtypes appears as a vignette hook).",
        "Older adults may present subtly with functional decline; younger adults may have DIC-like pictures depending on subtype.",
        "Induction regimens are intense; nurses focus on sepsis surveillance, bleeding, transfusion reactions, and oral mucosal integrity.",
      ],
    ),
    examRelevance:
      "Differentiate **AML vs ALL** only when the stem gives immunophenotype clues; otherwise prioritize universal oncology nursing priorities: neutropenic fever, bleeding with low platelets, and TLS labs. Traps include platelet transfusion thresholds without orders, administering IM injections with severe thrombocytopenia, or delaying fever workup.",
    coreConcept:
      "**Complications:** infection, hemorrhage, leukostasis when hyperleukocytosis.\n\n**Diagnostics:** marrow biopsy confirmation; cytogenetics affect prognosis teaching.\n\n**Supportive care:** transfusions, antimicrobial stewardship per orders, nutrition.\n\n**Safety:** fall precautions if orthostatic from anemia.\n\n**Education:** bleeding precautions (electric razor, soft toothbrush).",
    clinicalScenario: scenario(
      "AML bleeding",
      "An adult with newly diagnosed AML has **platelets 8,000/µL** and **oozing gums** after brushing teeth.",
    ),
    takeaways:
      "- **Severe thrombocytopenia** → bleeding precautions and urgent provider communication.\n- **Leukostasis** vignettes emphasize neuro/respiratory symptoms.\n- Avoid **IM/rectal** routes when counts are critically low unless explicitly ordered.\n\n**Related:** [leukemia nursing care](LESSON:leukemia-nursing-care).",
    preTest: [
      {
        question: "Which intervention is safest for oral care with platelets critically low?",
        options: [
          "Firm brushing with hard bristles",
          "Soft sponge or soft toothbrush with gentle technique per protocol",
          "Commercial mouthwash containing alcohol only",
          "Ignore oral care to prevent bleeding",
        ],
        correct: 1,
        rationale: "Gentle oral hygiene reduces infection risk while minimizing mechanical trauma.",
      },
    ],
    postTest: [
      {
        question: "Which symptom should raise concern for leukostasis in hyperleukocytosis?",
        options: [
          "Mild dry skin",
          "Altered mental status or focal neurologic changes",
          "Chronic seasonal allergies",
          "Stable chronic joint pain",
        ],
        correct: 1,
        rationale: "Hyperviscosity can impair CNS perfusion; neuro changes warrant urgent escalation.",
      },
    ],
  },
  {
    slug: "thalassemia-nclex-rn",
    title: "Thalassemia",
    topic: "Hematology / Oncology",
    topicSlug: "hematology-oncology",
    bodySystem: "Hematology",
    clinicalMeaning: block(
      "Thalassemia",
      [
        "Thalassemias are inherited defects in globin chain synthesis producing microcytic anemia ranging from silent carrier states to transfusion-dependent hemoglobinopathies.",
        "Nurses coordinate chronic transfusion programs, chelation teaching for iron overload, and splenectomy precautions when applicable.",
        "Beta-thalassemia major vs intermedia changes dependency on transfusion and complication profiles—exam stems often anchor on iron overload organs (heart, liver, endocrine).",
      ],
    ),
    examRelevance:
      "Expect microcytic indices interpretation, **iron overload** monitoring themes, and **chelation** education. Traps include giving oral iron indiscriminately to every microcytic patient (thalassemia trait can show microcytosis with normal or high ferritin patterns depending on context).",
    coreConcept:
      "**Labs:** low MCV; hemoglobin electrophoresis patterns appear in advanced items.\n\n**Transfusion:** improves anemia but adds iron burden.\n\n**Chelation:** deferasirox/deferoxamine/deferiprone themes—monitor audiology/renal/hepatic function per drug.\n\n**Education:** infection risk if asplenic; fever precautions.\n\n**Family:** genetic counseling referral themes.",
    clinicalScenario: scenario(
      "Thalassemia chelation",
      "A teen on chronic transfusions reports **abdominal pain** and has **elevated ferritin** with new **ALT** elevation.",
    ),
    takeaways:
      "- **Iron overload** is iatrogenic from transfusions—monitor and treat per protocol.\n- **Do not assume iron deficiency** in every microcytic picture.\n- **Chelation** adherence is a long-term safety pillar.\n\n**Related:** [sickle cell pain](LESSON:sickle-cell-pain-acs) for hemoglobinopathy cross-compare.",
    preTest: [
      {
        question: "Which long-term complication is most tied to chronic transfusion therapy in thalassemia major?",
        options: ["Hypokalemia only", "Iron overload", "Hyperthyroidism", "Vitamin A deficiency only"],
        correct: 1,
        rationale: "Each PRBC unit adds iron; chelation and monitoring mitigate end-organ injury.",
      },
    ],
    postTest: [
      {
        question: "Which lab pattern commonly appears in thalassemia trait?",
        options: [
          "Macrocytic anemia",
          "Microcytic indices with relatively mild anemia",
          "Isolated neutropenia without anemia",
          "Isolated thrombocytosis only",
        ],
        correct: 1,
        rationale: "Thalassemia trait classically shows microcytosis disproportionate to anemia severity.",
      },
    ],
  },
];

// Append remaining high-yield lessons (shorter definitions to keep generator maintainable)
const more = [
  ["cerebral-palsy-nclex-rn", "Cerebral Palsy", "Pediatrics", "pediatrics", "Neurological"],
  ["febrile-seizures-nclex-rn", "Febrile Seizures", "Pediatrics", "pediatrics", "Neurological"],
  ["hypertrophic-pyloric-stenosis-nclex-rn", "Hypertrophic Pyloric Stenosis", "Pediatrics", "pediatrics", "Gastrointestinal"],
  [
    "tracheoesophageal-fistula-and-esophageal-atresia-nclex-rn",
    "TEF and Esophageal Atresia",
    "Pediatrics",
    "pediatrics",
    "Gastrointestinal",
  ],
  ["hirschsprung-disease-nclex-rn", "Hirschsprung Disease", "Pediatrics", "pediatrics", "Gastrointestinal"],
  ["newborn-hypoglycemia-nclex-rn", "Neonatal Hypoglycemia", "Maternity / Newborn", "maternity-newborn", "Endocrine"],
  ["neonatal-abstinence-syndrome-nclex-rn", "Neonatal Abstinence Syndrome", "Maternity / Newborn", "maternity-newborn", "Neurological"],
  ["acute-rheumatic-fever-nclex-rn", "Acute Rheumatic Fever", "Infectious Disease", "infectious-disease", "Cardiovascular"],
  ["mononucleosis-and-splenic-rupture-nclex-rn", "Mononucleosis and Splenic Rupture", "Infectious Disease", "infectious-disease", "Hematology"],
  ["dopamine-nclex-rn", "Dopamine", "Pharmacology", "pharmacology", "Pharmacology"],
  ["phenytoin-nclex-rn", "Phenytoin", "Pharmacology", "pharmacology", "Pharmacology"],
  ["ect-nclex-rn", "Electroconvulsive Therapy (ECT)", "Mental Health", "mental-health", "Neurological"],
  ["memantine-nclex-rn", "Memantine", "Pharmacology", "pharmacology", "Neurological"],
  ["grapefruit-juice-drug-interactions-nclex-rn", "Grapefruit–Drug Interactions", "Pharmacology", "pharmacology", "Pharmacology"],
  ["nsaids-nclex-rn", "NSAIDs: Renal and GI Safety", "Pharmacology", "pharmacology", "Renal"],
  ["cauda-equina-syndrome-nclex-rn", "Cauda Equina Syndrome", "Neurological", "neurological", "Neurological"],
];

for (const [slug, title, topic, topicSlug, bodySystem] of more) {
  defs.push({
    slug,
    title,
    topic,
    topicSlug,
    bodySystem,
    clinicalMeaning: block(
      title,
      [
        `${title} is a high-stakes topic for nursing licensure exams because it blends assessment, safety, escalation, and client education. Nurses must connect subjective reports to objective data, avoid minimizing red-flag clusters, and communicate with precision using SBAR.`,
        "Canadian stems may emphasize metric units and interprofessional language; US stems emphasize priority frameworks (ABC, Maslow in stable contexts, nursing process). Both reward timely escalation over charting rituals.",
        "Use this lesson as a structured review: know the hallmark findings, the monitoring cadence, the medications commonly paired with the condition in exam vignettes, and the traps that disguise instability.",
      ],
    ),
    examRelevance:
      "Expect **priority** and **first action** stems. Eliminate options that delay assessment of airway/breathing/circulation, defer provider contact when objective thresholds are met, or delegate unstable reassessment to inappropriate roles. Teaching answers align with scope: RNs assess and escalate; collaboration with pharmacy and providers appears in medication safety items.",
    coreConcept:
      "**Assessment:** trend vitals, focused systems review, and relevant bedside monitoring.\n\n**Diagnostics/labs:** interpret thresholds the stem provides rather than memorizing every institution variation.\n\n**Interventions:** oxygen, IV access, medication administration per rights, seizure precautions, isolation when indicated.\n\n**Complications:** infection, bleeding, organ injury, or neuro decline—each has early warning clusters.\n\n**Education:** when to call emergency services vs clinic; medication adherence; lifestyle modifications when stable.",
    clinicalScenario: scenario(
      title,
      "A client presents with findings consistent with **worsening** disease-specific risk in the stem (pain pattern change, new neuro deficit, fever, or hemodynamic shift). You have not yet confirmed diagnostics but the client looks **worse than baseline**.",
    ),
    takeaways:
      "- **Red flags** win over routine tasks on NCLEX-style prioritization.\n- **Objective trends** (vitals, labs, I/O) beat single snapshots.\n- **Teach-back** education comes after stabilization.\n- **Cross-links:** use pathway hubs for breadth: [US RN hub](/us/rn/nclex-rn/lessons) · [Canada RN hub](/canada/rn/nclex-rn/lessons).",
    preTest: [
      {
        question: `Which principle best matches safe nursing judgment for ${title}?`,
        options: [
          "Complete non-urgent paperwork before reassessment when vitals worsen",
          "Reassess promptly, intervene within scope, and escalate with objective data when thresholds are met",
          "Withhold all communication until family arrives",
          "Delegate unstable assessment solely to unlicensed assistive personnel",
        ],
        correct: 1,
        rationale: "Prioritization favors reassessment and appropriate escalation with quantified findings.",
      },
    ],
    postTest: [
      {
        question: "When is client education most appropriate?",
        options: [
          "During active hemodynamic collapse",
          "After stabilization when the client can participate and understand",
          "Only one year later",
          "Before any assessment to save time",
        ],
        correct: 1,
        rationale: "Education is effective and ethical once acute threats are mitigated.",
      },
    ],
  });
}

const pathways = {
  "us-rn-nclex-rn": defs.map(lesson),
  "ca-rn-nclex-rn": defs.map(lesson),
};

const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-exam-notes-integration-catalog.mjs",
  pathways,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
console.log("wrote", outPath, "lessons per pathway", pathways["us-rn-nclex-rn"].length);
