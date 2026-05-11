import type { NursingMechanismStatus } from "@/lib/seo/nursing-mechanism-clusters";

export type NursingMechanismExplainerDraft = {
  slug: string;
  status: NursingMechanismStatus;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  clinicalSummary: string;
  mechanismExplanation: readonly string[];
  longFormSections?: readonly { heading: string; paragraphs: readonly string[] }[];
  nursingImplications: readonly string[];
  examRelevance: string;
  commonMisconceptions: readonly string[];
  faq: readonly { question: string; answer: string }[];
  internalLinks: readonly { label: string; href: string }[];
  practiceCta: { label: string; href: string };
  relatedLessonsCta: { label: string; href: string };
  relatedScenarios: readonly string[];
  apa7References: readonly string[];
};

export const NURSING_MECHANISM_MINIMUM_PUBLISH_WORDS = 1000;

const placeholderPattern = /\b(lorem|todo|tbd|placeholder|coming soon|insert|dummy|sample title|description here|draft stub)\b/i;
const examPattern = /\b(NCLEX|REx-PN|NCLEX-PN|NP|FNP|AGPCNP|PNP|exam|NGN)\b/i;
const nursingPriorityPattern = /\b(nursing priorit|priorit(?:y|ies|ize)|assess|monitor|escalate|report|reassess|safety|airway|breathing|circulation)\b/i;

function draftBodyText(draft: NursingMechanismExplainerDraft): string {
  return [
    draft.title,
    draft.metaTitle,
    draft.metaDescription,
    draft.h1,
    draft.clinicalSummary,
    ...draft.mechanismExplanation,
    ...(draft.longFormSections ?? []).flatMap((section) => [section.heading, ...section.paragraphs]),
    ...draft.nursingImplications,
    draft.examRelevance,
    ...draft.commonMisconceptions,
    ...draft.faq.flatMap((item) => [item.question, item.answer]),
    ...draft.internalLinks.flatMap((item) => [item.label, item.href]),
    draft.practiceCta.label,
    draft.practiceCta.href,
    draft.relatedLessonsCta.label,
    draft.relatedLessonsCta.href,
    ...draft.relatedScenarios,
    ...draft.apa7References,
  ].join(" ");
}

export function countNursingMechanismExplainerWords(draft: NursingMechanismExplainerDraft): number {
  return draftBodyText(draft).split(/\s+/).filter(Boolean).length;
}

export function getNursingMechanismPublishBlockers(draft: NursingMechanismExplainerDraft): string[] {
  const body = draftBodyText(draft);
  const blockers: string[] = [];
  const wordCount = countNursingMechanismExplainerWords(draft);

  if (wordCount < NURSING_MECHANISM_MINIMUM_PUBLISH_WORDS) {
    blockers.push(`minimum word count not met (${wordCount}/${NURSING_MECHANISM_MINIMUM_PUBLISH_WORDS})`);
  }
  if (draft.apa7References.length === 0) blockers.push("references are missing");
  const priorityEvidence = [
    ...draft.nursingImplications,
    ...(draft.longFormSections ?? []).flatMap((section) => [section.heading, ...section.paragraphs]),
  ].join(" ");
  if (draft.nursingImplications.length === 0 || !nursingPriorityPattern.test(priorityEvidence)) {
    blockers.push("nursing priorities are missing");
  }
  if (!examPattern.test(draft.examRelevance)) blockers.push("exam relevance is missing");
  if (draft.internalLinks.length === 0) blockers.push("internal links are missing");
  if (placeholderPattern.test(body)) blockers.push("placeholder language detected");

  return blockers;
}

export function isNursingMechanismExplainerPublishable(draft: NursingMechanismExplainerDraft): boolean {
  return draft.status === "published" && getNursingMechanismPublishBlockers(draft).length === 0;
}

const references = [
  "KDIGO. (2024). Clinical practice guideline for the evaluation and management of chronic kidney disease. Kidney Disease: Improving Global Outcomes.",
  "American Diabetes Association Professional Practice Committee. (2026). Standards of care in diabetes-2026. Diabetes Care.",
  "American Burn Association. (2024). Clinical practice guidelines on burn shock resuscitation. Journal of Burn Care & Research, 45(3), 565-589.",
  "Global Initiative for Chronic Obstructive Lung Disease. (2026). Global strategy for prevention, diagnosis and management of COPD.",
  "Surviving Sepsis Campaign. (2021). International guidelines for management of sepsis and septic shock 2021. Intensive Care Medicine.",
  "American Heart Association. (2024). American Heart Association and American Red Cross guidelines for first aid.",
] as const;

export const NURSING_MECHANISM_EXPLAINER_DRAFTS = [
  {
    slug: "why-hyperkalemia-affects-the-heart-nursing-mechanism",
    status: "draft",
    title: "Why Hyperkalemia Affects the Heart: Membrane Potential, ECG Risk, and Nursing Priorities",
    metaTitle: "Why Hyperkalemia Affects the Heart | Nursing Mechanism Explainer",
    metaDescription:
      "A nursing mechanism explainer for hyperkalemia, cardiac membrane potential, ECG changes, assessment priorities, and exam-style safety cues.",
    h1: "Why hyperkalemia affects the heart",
    clinicalSummary:
      "Hyperkalemia is dangerous because extracellular potassium directly changes cardiac cell excitability. Nurses do not need to memorize ECG changes as isolated trivia; the safer reasoning path is to connect potassium elevation to membrane potential, conduction slowing, and rapid deterioration risk.",
    mechanismExplanation: [
      "Potassium is the major intracellular cation. When extracellular potassium rises, the resting membrane potential becomes less negative, which initially makes cells easier to excite but then inactivates sodium channels and slows depolarization.",
      "As myocardial depolarization and repolarization become unstable, ECG findings may progress from peaked T waves to PR prolongation, QRS widening, sine-wave patterns, ventricular dysrhythmias, and cardiac arrest.",
      "Renal failure, acidosis, tissue breakdown, potassium-sparing medications, and impaired aldosterone effect can all increase serum potassium or shift potassium out of cells.",
    ],
    longFormSections: [
      {
        heading: "Why this mechanism matters clinically",
        paragraphs: [
          "Hyperkalemia is a high-risk nursing topic because the number on the metabolic panel can change faster than the bedside story looks. A patient with kidney impairment, missed dialysis, acidosis, crush injury, DKA treatment, ACE inhibitor or ARB therapy, spironolactone, trimethoprim, heparin exposure, or potassium supplementation may move from vague weakness to unstable rhythm without a dramatic warning period. The clinical reason is electrical: potassium controls the resting gradient that lets cardiac cells reset between impulses. When that gradient narrows, myocardial cells may not depolarize cleanly, conduction slows, and reentry or arrest becomes more likely.",
          "For NCLEX-RN, REx-PN, NCLEX-PN, and NP learners, the key is not to memorize a single ECG clue and stop. Exam stems often pair potassium with renal function, medication lists, blood glucose therapy, ABG changes, or a patient who reports muscle weakness. The safest answer usually recognizes instability, verifies telemetry or ECG findings, protects the patient from additional potassium, and escalates according to severity and scope. A stable discharge-teaching answer can be correct only after the stem shows that rhythm risk, severity, and cause have already been addressed.",
        ],
      },
      {
        heading: "Signs, symptoms, labs, and diagnostics",
        paragraphs: [
          "Symptoms can be subtle: muscle weakness, paresthesias, fatigue, nausea, palpitations, chest discomfort, bradycardia, syncope, or a general sense that the patient is declining. Severe hyperkalemia may present with minimal symptoms until conduction changes appear, which is why nurses should pair subjective cues with potassium value, trend, renal function, acid-base status, and medication review. In practice and in exam stems, a potassium of 6.5 mmol/L with renal failure and a widening QRS is a different nursing problem from a mildly elevated specimen suspected to be hemolyzed.",
          "Important labs and diagnostics include repeat potassium when pseudohyperkalemia is plausible, serum creatinine and BUN, estimated GFR, bicarbonate or ABG/VBG when acidosis is suspected, glucose when insulin therapy is being considered or is already running, magnesium and calcium when rhythm risk is present, and ECG or telemetry when potassium is critically elevated or symptoms appear. Nurses do not diagnose the full cause independently, but they do notice when the lab story and the patient story disagree and request clarification before acting on a dangerous assumption.",
        ],
      },
      {
        heading: "Nursing priorities and clinical judgment",
        paragraphs: [
          "Priority nursing actions start with patient stability: assess airway, breathing, circulation, mental status, weakness, chest symptoms, and rhythm. Place or verify cardiac monitoring when ordered or indicated by protocol, review the medication administration record for potassium-raising drugs or supplements, protect IV access, and avoid routine potassium-containing fluids or replacement until the team has clarified the plan. If severe hyperkalemia, ECG change, oliguria, syncope, or bradycardia is present, escalation is not optional; the nurse should report the potassium value, ECG status, renal function, symptoms, and active medications in one concise message.",
          "When treatment begins, nursing monitoring has to match the mechanism. Calcium may stabilize the cardiac membrane without lowering total-body potassium, insulin with dextrose shifts potassium intracellularly and can cause hypoglycemia, beta-agonists may add tachycardia or tremor, bicarbonate is context-dependent, diuretics require urine output, binders take time, and dialysis removes potassium when renal clearance is inadequate. Reassessment should include repeat ECG or rhythm status, serial potassium timing, glucose checks after insulin, IV site safety, intake and output, and whether the original trigger is still active.",
        ],
      },
      {
        heading: "Common exam traps and internal review path",
        paragraphs: [
          "A common trap is choosing calcium as if it removes potassium. Calcium buys cardiac safety time; it does not fix the potassium burden. Another trap is waiting for peaked T waves before taking a critical potassium seriously. ECG findings vary, and absence of a classic pattern does not make severe hyperkalemia safe. A third trap is treating DKA potassium as simple hyperkalemia: serum potassium may be normal or high before insulin, even though total-body potassium is depleted. That is why insulin protocols and replacement parameters are tested together.",
          "Use NurseNest links in the same order a learner should reason: review fluid and electrolyte lessons for the physiology, use the lab values tool to interpret potassium with renal and acid-base context, then practice priority questions or CAT-style mixed sets to test whether you choose rhythm safety over tempting teaching answers. Related internal study targets include AKI with rising potassium, DKA insulin initiation, dialysis timing, crush injury or burn injury with cell breakdown, and medication safety questions involving ACE inhibitors, ARBs, potassium-sparing diuretics, and supplements.",
        ],
      },
    ],
    nursingImplications: [
      "Treat hyperkalemia as a rhythm risk, not only as a lab abnormality.",
      "Assess weakness, paresthesias, heart rate, rhythm, renal function, medication history, and recent tissue injury.",
      "Escalate promptly for severe elevation, ECG changes, bradycardia, syncope, or concurrent AKI.",
      "Anticipate orders that stabilize the myocardium, shift potassium intracellularly, and remove potassium from the body.",
    ],
    examRelevance:
      "High relevance for NCLEX-RN, REx-PN, NCLEX-PN, and NP exams because items commonly test priority recognition, telemetry interpretation, renal failure, DKA treatment, and medication safety.",
    commonMisconceptions: [
      "Peaked T waves are not required before hyperkalemia becomes dangerous.",
      "A normal-looking ECG does not make a severely high potassium safe.",
      "Insulin-dextrose shifts potassium temporarily; it does not remove total-body potassium.",
    ],
    faq: [
      { question: "Why can hyperkalemia cause cardiac arrest?", answer: "It alters myocardial membrane potential and conduction, which can produce malignant dysrhythmias." },
      { question: "What should nurses assess first?", answer: "Assess rhythm, symptoms, severity of potassium elevation, renal function, and active sources of potassium shift or retention." },
      { question: "Is calcium a potassium-lowering drug?", answer: "No. Calcium stabilizes the cardiac membrane; other therapies shift or remove potassium." },
    ],
    internalLinks: [
      { label: "Review fluid balance lessons", href: "/us/rn/nclex-rn/lessons/fluid-balance" },
      { label: "Open lab value tools", href: "/tools/lab-values" },
      { label: "Practice priority questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice hyperkalemia priority questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study fluid and electrolyte lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["AKI with rising potassium", "DKA insulin initiation", "Crush injury with ECG changes"],
    apa7References: references,
  },
  {
    slug: "hyperkalemia-vs-hypokalemia-ecg-changes-nursing",
    status: "draft",
    title: "Hyperkalemia vs Hypokalemia ECG Changes for Nurses: What the Potassium Shift Does",
    metaTitle: "Hyperkalemia vs Hypokalemia ECG Changes for Nurses | NurseNest",
    metaDescription:
      "Compare potassium-related ECG changes by mechanism, nursing assessment priority, and common exam traps.",
    h1: "Hyperkalemia vs hypokalemia ECG changes",
    clinicalSummary:
      "Both high and low potassium can destabilize cardiac rhythm, but they do so through different effects on repolarization, depolarization, and conduction. A nursing interpretation should connect the ECG pattern with symptoms, medications, renal function, and urgency.",
    mechanismExplanation: [
      "Hyperkalemia reduces the gradient between intracellular and extracellular potassium, making resting membrane potential less negative and slowing sodium-channel recovery.",
      "Hypokalemia makes repolarization abnormal and increases myocardial irritability, often associated with ST depression, flattened T waves, U waves, and dysrhythmia risk.",
      "The ECG is a warning system, not a replacement for clinical judgment. Potassium level, trend, renal function, digoxin exposure, and symptoms all matter.",
    ],
    longFormSections: [
      {
        heading: "Why this comparison matters clinically",
        paragraphs: [
          "Potassium questions are clinically important because both directions can create dangerous rhythms, but the mechanism and the nursing response are not identical. Hyperkalemia tends to slow conduction as sodium channels recover poorly in a less negative resting state. Hypokalemia tends to prolong repolarization and increase irritability, which can make ectopy, ventricular dysrhythmias, and digoxin toxicity more likely. A learner who only memorizes peaked T waves for high potassium and U waves for low potassium can miss the broader safety issue: the ECG pattern must be interpreted with symptoms, kidney function, medication exposure, and how fast the value is changing.",
          "For NCLEX-RN, REx-PN, NCLEX-PN, and NP exam items, the comparison is a distractor engine. Stems may include a patient receiving furosemide, vomiting, insulin, dialysis, ACE inhibitors, potassium supplements, or digoxin. The answer choices may all sound plausible, but the safest one connects the potassium direction to immediate harm. Hypokalemia with digoxin exposure is not a routine replacement question; it is a toxicity-risk question. Hyperkalemia with QRS widening is not a teaching-first question; it is an urgent rhythm-stabilization and escalation question.",
        ],
      },
      {
        heading: "Signs, symptoms, labs, and diagnostics",
        paragraphs: [
          "Hyperkalemia can produce weakness, paresthesias, nausea, palpitations, bradycardia, syncope, or sudden rhythm deterioration. ECG teaching patterns include tall peaked T waves, PR prolongation, loss of P waves, QRS widening, sine-wave morphology, ventricular dysrhythmias, and asystole, but real patients do not always follow that neat sequence. Hypokalemia can cause muscle cramps, weakness, constipation or ileus, fatigue, palpitations, flattened T waves, ST depression, prominent U waves, and ventricular irritability. Severe hypokalemia can impair respiratory muscle strength and create safety issues beyond the monitor strip.",
          "Labs should be read as a cluster: potassium value and trend, magnesium, creatinine, BUN, glucose, bicarbonate, pH when acid-base disturbance is suspected, and medication context. Magnesium matters because low magnesium can make potassium replacement harder and dysrhythmias more likely. Renal function matters because replacement or removal decisions are unsafe without knowing clearance. Diagnostics include ECG or telemetry when symptoms, severe abnormalities, high-risk medications, or cardiac history appear. If a specimen is hemolyzed, the nurse should not ignore the result; the safe move is repeat confirmation while assessing for real risk.",
        ],
      },
      {
        heading: "Nursing priorities and clinical judgment",
        paragraphs: [
          "For hyperkalemia, nursing priorities include rhythm assessment, critical-value reporting, medication review for potassium-raising agents, avoidance of additional potassium exposure, IV access, and monitoring during ordered therapies. For hypokalemia, priorities include route and rate safety during replacement, renal function review, magnesium assessment, telemetry when severe or symptomatic, and fall or weakness precautions when muscle symptoms are present. In both directions, the nurse should reassess after interventions rather than treating the lab as a one-time event.",
          "Scope language matters. RN and RPN/PN learners are expected to recognize abnormal patterns, hold or question unsafe medications according to policy, collect focused data, implement ordered protocols, and escalate. NP learners may be tested on broader diagnostic and medication decision-making, but the same mechanism still governs safety. Internal NurseNest practice should pair this explainer with electrolyte lessons, lab-value interpretation, and priority question sets so the learner practices what changes first: rhythm risk, replacement safety, medication hold parameters, or patient education.",
        ],
      },
      {
        heading: "Common exam traps and internal review path",
        paragraphs: [
          "One trap is treating low potassium as less urgent than high potassium in every stem. Low potassium can be lethal when severe, when magnesium is low, when digoxin is present, or when the patient is already electrically unstable. Another trap is choosing oral replacement in an unstable scenario because oral therapy sounds safer; route depends on severity, symptoms, orders, and whether the patient can tolerate intake. A third trap is replacing potassium without checking renal function or urine output, which can turn correction into overshoot.",
          "A strong review path starts with the fluid and electrolyte lesson, then the lab values tool, then practice questions that mix diuretics, renal failure, DKA, vomiting, diarrhea, and digoxin. Learners should verbalize the mechanism before answering: high potassium reduces the membrane gradient and can slow conduction; low potassium disrupts repolarization and increases irritability. That short sentence prevents buzzword answers and keeps the priority anchored in clinical safety.",
        ],
      },
    ],
    nursingImplications: [
      "Check telemetry and symptoms with any critical potassium value.",
      "Review diuretics, ACE inhibitors, ARBs, potassium supplements, insulin therapy, vomiting, diarrhea, and renal function.",
      "Escalate new weakness, palpitations, syncope, QRS widening, or severe potassium derangement.",
    ],
    examRelevance:
      "Nursing exams often test recognition of peaked T waves, U waves, digoxin risk with hypokalemia, and priority interventions for unstable potassium changes.",
    commonMisconceptions: [
      "Hypokalemia is not benign just because the number is low instead of high.",
      "ECG patterns do not always appear in textbook order.",
      "Potassium replacement decisions must account for kidney function and route safety.",
    ],
    faq: [
      { question: "Which ECG change suggests hyperkalemia?", answer: "Peaked T waves are classic, but severe cases may show PR prolongation and QRS widening." },
      { question: "Which ECG change suggests hypokalemia?", answer: "Flattened T waves, ST depression, and U waves are common teaching patterns." },
      { question: "Why does hypokalemia worsen digoxin toxicity?", answer: "Low potassium increases digoxin binding effect at the sodium-potassium ATPase, increasing toxicity risk." },
    ],
    internalLinks: [
      { label: "Open electrolyte lessons", href: "/us/rn/nclex-rn/lessons/fluid-balance" },
      { label: "Use lab value tools", href: "/tools/lab-values" },
      { label: "Practice ECG-adjacent priority questions", href: "/practice-exams" },
    ],
    practiceCta: { label: "Practice electrolyte ECG questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study cardiac and electrolyte lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["Loop diuretic hypokalemia", "ACE inhibitor hyperkalemia", "Renal failure telemetry change"],
    apa7References: references,
  },
  {
    slug: "why-burns-cause-hyperkalemia-nursing",
    status: "draft",
    title: "Why Burns Cause Hyperkalemia: Cell Injury, Fluid Shifts, and Early Nursing Assessment",
    metaTitle: "Why Burns Cause Hyperkalemia | Nursing Pathophysiology Explainer",
    metaDescription: "Understand burn-related hyperkalemia through cell injury, acidosis, fluid shifts, and nursing assessment priorities.",
    h1: "Why burns cause hyperkalemia",
    clinicalSummary:
      "Major burns can cause hyperkalemia because injured cells release intracellular potassium and early shock physiology can reduce renal clearance. The key nursing move is to see potassium as part of a broader burn-shock pattern: tissue injury, capillary leak, perfusion loss, acidosis, and rhythm risk.",
    mechanismExplanation: [
      "Thermal injury damages cell membranes, allowing intracellular potassium to move into the extracellular space.",
      "Large burns trigger capillary leak and intravascular volume depletion, which may reduce renal perfusion and potassium excretion.",
      "Acidosis and tissue hypoxia can worsen extracellular potassium shifts, especially when burns are deep, extensive, or associated with crush injury.",
    ],
    longFormSections: [
      {
        heading: "Why this mechanism matters clinically",
        paragraphs: [
          "Burn-related hyperkalemia is clinically important because it sits inside a larger early burn-shock pattern. The potassium rise is not just a standalone electrolyte fact; it reflects cell injury, capillary leak, perfusion stress, acidosis, and renal clearance risk. In major thermal injury, damaged cells release intracellular contents, and extracellular potassium can rise while the patient is also losing effective circulating volume into injured tissues. If perfusion falls, kidney excretion of potassium may worsen. If acidosis develops, potassium can shift further out of cells. The bedside picture is therefore both electrical and hemodynamic.",
          "NCLEX-RN, REx-PN, NCLEX-PN, pediatric NP, and acute care NP questions often combine burns with airway, fluid resuscitation, infection prevention, pain, and electrolyte priorities. The exam trap is to isolate one familiar fact and forget the sequence. Airway threat from inhalation injury and perfusion threat from burn shock can outrank a lab explanation, but a rising potassium with ECG change or oliguria becomes urgent because rhythm collapse can happen quickly. Good nursing reasoning keeps all of those threats in view.",
        ],
      },
      {
        heading: "Signs, symptoms, labs, and diagnostics",
        paragraphs: [
          "Clinical cues include burn size and depth, mechanism of injury, electrical involvement, circumferential injury, facial burns, soot, hoarseness, wheezing, increasing work of breathing, delayed capillary refill, hypotension, tachycardia, cool extremities, pain, decreasing urine output, weakness, palpitations, and mental status change. Hyperkalemia itself may not announce clearly, so rhythm monitoring and potassium trends matter when burns are extensive, deep, electrical, crush-associated, or accompanied by AKI. In infants, children, older adults, and patients with chronic kidney disease, reserve may be lower and deterioration may be less obvious.",
          "Labs and diagnostics should connect the burn mechanism to systemic effects: potassium, sodium, bicarbonate, creatinine, BUN, glucose, lactate when shock is suspected, CK or myoglobin concerns when muscle injury or electrical injury is plausible, ABG or VBG when ventilation or acidosis is a concern, and urine output trends during resuscitation. ECG or telemetry is important when potassium is elevated or symptoms appear. Burn size estimation and weight-based resuscitation calculations are not just math tasks; they help protect perfusion so the kidneys can clear acid and potassium while the burn team treats the injury.",
        ],
      },
      {
        heading: "Nursing priorities and clinical judgment",
        paragraphs: [
          "Nursing priorities start with airway, breathing, circulation, disability, exposure, and temperature protection. Assess for inhalation injury, support oxygenation per protocol, obtain IV access as appropriate, monitor pain and perfusion, estimate burn extent using accepted methods, and trend urine output. When hyperkalemia is possible or confirmed, add rhythm monitoring, medication review, renal function review, acid-base assessment, and clear escalation. A concise report should include burn mechanism, estimated size and depth, airway findings, vital signs, urine output, potassium value and trend, ECG findings, and fluid resuscitation status.",
          "Interventions should be understood by mechanism. Fluids support perfusion and renal clearance but do not directly stabilize a dangerous myocardium. Calcium stabilizes cardiac membranes when ordered for severe hyperkalemia with ECG risk; insulin-dextrose shifts potassium; definitive removal may require renal strategies when excretion fails. Nurses monitor response, glucose after insulin, IV site safety, urine output, respiratory status, pain control, and signs of over- or under-resuscitation. Burn care also includes infection prevention and wound management, but early rhythm and perfusion risks must not be buried under later-phase teaching.",
        ],
      },
      {
        heading: "Common exam traps and internal review path",
        paragraphs: [
          "A frequent trap is assuming burn hyperkalemia is only a late renal failure problem. Early cell injury can contribute before the full renal story is clear. Another trap is treating all burns as skin-only injuries; electrical and deep burns may hide muscle injury and rhabdomyolysis. A third trap is choosing fluid resuscitation as if it fixes every abnormality. Fluids are central to burn shock care, but severe hyperkalemia with ECG changes needs urgent rhythm-focused escalation as well.",
          "For NurseNest review, pair this page with fluid balance lessons, lab value interpretation, emergency practice questions, and CAT-style mixed sets that force triage among airway, perfusion, electrolyte, and infection priorities. Learners should practice explaining the chain in one sentence: burn injury damages cells and capillaries, perfusion falls, acid-base stress rises, renal clearance may drop, and potassium can threaten cardiac conduction. That mechanism makes the nursing priorities easier to remember under exam pressure.",
        ],
      },
    ],
    nursingImplications: [
      "Assess burn size, depth, airway risk, urine output, perfusion, pain, mental status, and rhythm.",
      "Trend potassium with renal function, acid-base status, lactate, and urine output.",
      "Escalate ECG changes, oliguria, hypotension, or suspected rhabdomyolysis.",
    ],
    examRelevance:
      "Relevant to NCLEX, REx-PN, pediatric NP, and acute care reasoning because burn items often combine fluid resuscitation, electrolyte shifts, airway safety, and infection prevention.",
    commonMisconceptions: [
      "Burn hyperkalemia is not only a late renal failure problem; early tissue injury can contribute.",
      "Normal saline boluses alone do not solve every burn complication.",
      "Airway and perfusion priorities still come before isolated memorization of electrolyte facts.",
    ],
    faq: [
      { question: "When is potassium highest after burns?", answer: "Early elevations can occur from tissue injury; ongoing trends depend on perfusion, renal function, and treatment." },
      { question: "Why does urine output matter?", answer: "Urine output helps estimate renal perfusion and the body's ability to excrete potassium." },
      { question: "What makes burn hyperkalemia urgent?", answer: "Severe potassium elevation can destabilize cardiac conduction and produce fatal dysrhythmias." },
    ],
    internalLinks: [
      { label: "Review fluid resuscitation concepts", href: "/us/rn/nclex-rn/lessons/fluid-balance" },
      { label: "Check lab value interpretation", href: "/tools/lab-values" },
      { label: "Practice emergency nursing questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice burn and electrolyte priorities", href: "/question-bank" },
    relatedLessonsCta: { label: "Study integumentary and fluid lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["Major burn resuscitation", "Burn shock with oliguria", "Electrical burn with rhabdomyolysis"],
    apa7References: references,
  },
  {
    slug: "why-aki-causes-metabolic-acidosis-nursing",
    status: "draft",
    title: "Why AKI Causes Metabolic Acidosis: Hydrogen Retention, Bicarbonate Loss, and Nursing Clues",
    metaTitle: "Why AKI Causes Metabolic Acidosis | Nursing Renal Physiology",
    metaDescription: "Renal physiology explainer for AKI, metabolic acidosis, bicarbonate, hydrogen ion handling, and nursing assessment.",
    h1: "Why AKI causes metabolic acidosis",
    clinicalSummary:
      "AKI can cause metabolic acidosis because injured kidneys cannot excrete acid or regenerate bicarbonate normally. For nurses, the priority is to connect low bicarbonate and falling pH with declining urine output, worsening perfusion, hyperkalemia, and respiratory compensation.",
    mechanismExplanation: [
      "Healthy kidneys excrete hydrogen ions and generate new bicarbonate to maintain acid-base balance.",
      "In AKI, glomerular filtration and tubular function decline, so fixed acids accumulate and bicarbonate buffering becomes insufficient.",
      "Metabolic acidosis may trigger compensatory increased ventilation as the body lowers PaCO2 to reduce acid burden.",
    ],
    nursingImplications: [
      "Trend urine output, creatinine, BUN, potassium, bicarbonate, pH, respiratory pattern, and mental status.",
      "Report worsening acidosis with hyperkalemia, pulmonary edema, oliguria, or hemodynamic instability.",
      "Prepare for interventions that support perfusion, stop nephrotoxic exposure, correct life-threatening electrolytes, and escalate renal replacement evaluation when indicated.",
    ],
    examRelevance:
      "High-yield for NCLEX and NP exams because renal failure questions often test acid-base recognition, potassium danger, fluid balance, and priority escalation.",
    commonMisconceptions: [
      "AKI acidosis is not the same mechanism as respiratory acidosis.",
      "Fast breathing in AKI may be compensation, not only anxiety.",
      "Creatinine alone is not enough; urine output and acid-base trends matter.",
    ],
    faq: [
      { question: "Is AKI acidosis usually metabolic or respiratory?", answer: "It is metabolic when acid retention and bicarbonate deficit drive the low pH." },
      { question: "Why does potassium rise with AKI?", answer: "Reduced renal excretion and acidosis-related shifts can both increase serum potassium." },
      { question: "What assessment cue is most practical?", answer: "Trend urine output with labs and respiratory pattern rather than interpreting one lab in isolation." },
    ],
    internalLinks: [
      { label: "Review renal lessons", href: "/us/rn/nclex-rn/lessons/acute-kidney-injury" },
      { label: "Open lab value tools", href: "/tools/lab-values" },
      { label: "Practice renal priority questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice AKI acid-base questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study renal and fluid balance lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["Sepsis-associated AKI", "Contrast nephropathy", "Oliguria with hyperkalemia"],
    apa7References: references,
  },
  {
    slug: "why-hyperglycemia-causes-osmotic-diuresis-nursing",
    status: "draft",
    title: "Why Hyperglycemia Causes Osmotic Diuresis: Glucose, Water Loss, and Dehydration Cues",
    metaTitle: "Why Hyperglycemia Causes Osmotic Diuresis | Nursing Explainer",
    metaDescription: "Mechanism-first nursing explanation of hyperglycemia, glucosuria, osmotic diuresis, dehydration, DKA, and HHS.",
    h1: "Why hyperglycemia causes osmotic diuresis",
    clinicalSummary:
      "Hyperglycemia causes osmotic diuresis when filtered glucose exceeds renal reabsorption capacity, pulling water into the urine. Nurses see the bedside result as polyuria, dehydration, tachycardia, hypotension, electrolyte loss, and worsening mental status in severe DKA or HHS.",
    mechanismExplanation: [
      "The kidney filters glucose and normally reabsorbs it in the proximal tubule.",
      "When plasma glucose is very high, transport capacity is exceeded and glucose remains in the tubular fluid.",
      "Glucose acts as an osmole, holding water in the nephron and increasing urine output; sodium, potassium, and other electrolytes may be lost with that water.",
    ],
    nursingImplications: [
      "Assess thirst, urine output, mucous membranes, heart rate, blood pressure, mental status, capillary glucose, ketones, potassium, sodium, BUN, creatinine, and osmolality when available.",
      "Recognize that potassium may be total-body depleted even if the serum potassium is normal or high before insulin therapy.",
      "Prioritize fluids, monitoring, ordered insulin protocols, electrolyte replacement safety, and neurologic reassessment.",
    ],
    examRelevance:
      "Central to NCLEX, REx-PN, and NP endocrine questions because osmotic diuresis explains dehydration in DKA and HHS and connects glucose treatment to potassium safety.",
    commonMisconceptions: [
      "Polyuria in severe hyperglycemia is not proof the patient is well hydrated.",
      "A high serum potassium in DKA does not mean total-body potassium is high.",
      "HHS is not mild DKA; it can cause profound dehydration and neurologic changes.",
    ],
    faq: [
      { question: "Why does glucose make patients urinate more?", answer: "Unreabsorbed glucose holds water in the renal tubules, increasing urine output." },
      { question: "Why does dehydration worsen hyperglycemia?", answer: "Water loss concentrates glucose and can reduce renal perfusion, worsening clearance." },
      { question: "Why monitor potassium before insulin?", answer: "Insulin shifts potassium into cells and can reveal dangerous total-body depletion." },
    ],
    internalLinks: [
      { label: "Study diabetes lessons", href: "/us/rn/nclex-rn/lessons/diabetes-mellitus" },
      { label: "Use lab value tools", href: "/tools/lab-values" },
      { label: "Practice endocrine questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice DKA and HHS questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Review endocrine nursing lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["DKA with abdominal pain", "HHS with confusion", "Insulin drip potassium monitoring"],
    apa7References: references,
  },
  {
    slug: "why-copd-causes-barrel-chest-nursing",
    status: "draft",
    title: "Why COPD Causes Barrel Chest: Air Trapping, Hyperinflation, and Nursing Interpretation",
    metaTitle: "Why COPD Causes Barrel Chest | Nursing Respiratory Mechanism",
    metaDescription: "Nursing explanation of COPD barrel chest, air trapping, hyperinflation, work of breathing, and clinical interpretation.",
    h1: "Why COPD causes barrel chest",
    clinicalSummary:
      "Barrel chest in COPD reflects chronic hyperinflation and air trapping. It is not a cosmetic observation; it signals altered mechanics, increased work of breathing, and a patient who may have limited reserve during infection, exertion, or sedation.",
    mechanismExplanation: [
      "In emphysema-predominant COPD, alveolar wall destruction and loss of elastic recoil make exhalation less effective.",
      "Small airways collapse earlier during expiration, trapping air and increasing residual volume.",
      "The thorax adapts to a chronically inflated position, flattening the diaphragm and increasing the anterior-posterior chest diameter.",
    ],
    nursingImplications: [
      "Assess work of breathing, accessory muscle use, speaking ability, SpO2 trend, mental status, sputum change, and signs of CO2 retention.",
      "Avoid assuming oxygenation and ventilation are the same; pulse oximetry can miss rising CO2.",
      "Escalate drowsiness, worsening dyspnea, silent chest, cyanosis, or inability to speak in full phrases.",
    ],
    examRelevance:
      "Relevant to NCLEX, REx-PN, and NP respiratory questions about chronic respiratory acidosis, oxygen safety, exacerbation cues, and priority interventions.",
    commonMisconceptions: [
      "Barrel chest does not automatically mean the patient is in acute distress.",
      "A normal SpO2 does not rule out ventilation problems.",
      "Pursed-lip breathing is a mechanical strategy, not a decorative teaching point.",
    ],
    faq: [
      { question: "What causes the barrel shape?", answer: "Chronic hyperinflation increases residual lung volume and changes chest wall position." },
      { question: "Does barrel chest happen overnight?", answer: "No. It typically reflects chronic adaptation, not an isolated acute change." },
      { question: "What should nurses watch during exacerbation?", answer: "Work of breathing, mental status, CO2 retention cues, oxygen response, and fatigue." },
    ],
    internalLinks: [
      { label: "Review COPD lessons", href: "/us/rn/nclex-rn/lessons/copd" },
      { label: "Practice respiratory questions", href: "/question-bank" },
      { label: "Compare oxygenation and ventilation", href: "/practice-exams" },
    ],
    practiceCta: { label: "Practice COPD assessment questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study respiratory nursing lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["COPD exacerbation", "Home oxygen safety teaching", "CO2 retention with drowsiness"],
    apa7References: references,
  },
  {
    slug: "kussmaul-respirations-mechanism-nursing",
    status: "draft",
    title: "Kussmaul Respirations Mechanism: Why Metabolic Acidosis Changes Breathing Pattern",
    metaTitle: "Kussmaul Respirations Mechanism | Nursing Acid-Base Explainer",
    metaDescription: "Mechanism-first nursing guide to Kussmaul respirations, metabolic acidosis, DKA, compensation, and assessment priorities.",
    h1: "Kussmaul respirations mechanism",
    clinicalSummary:
      "Kussmaul respirations are deep, labored respirations that reflect respiratory compensation for severe metabolic acidosis. In nursing interpretation, they are a red flag that the body is trying to reduce carbon dioxide to buffer excess acid.",
    mechanismExplanation: [
      "Metabolic acidosis lowers serum bicarbonate and pH.",
      "Chemoreceptors respond to acidemia by increasing ventilation, which blows off CO2 and lowers carbonic acid contribution to blood acidity.",
      "In DKA, ketone accumulation drives metabolic acidosis, making Kussmaul breathing a classic but late-ish severity cue.",
    ],
    nursingImplications: [
      "Assess respiratory depth, rate, effort, glucose, ketones, potassium, mental status, perfusion, and hydration.",
      "Do not dismiss deep breathing as anxiety when DKA, renal failure, sepsis, or toxic ingestion is plausible.",
      "Escalate acidotic breathing with altered mental status, hypotension, severe hyperglycemia, or worsening fatigue.",
    ],
    examRelevance:
      "High-yield for NCLEX and NP exams because it tests acid-base reasoning, DKA recognition, and respiratory compensation.",
    commonMisconceptions: [
      "Kussmaul respirations are not the primary problem; they are compensation for metabolic acidosis.",
      "Stopping the breathing pattern without treating the acidosis can be harmful.",
      "Normal oxygen saturation does not rule out severe metabolic acidosis.",
    ],
    faq: [
      { question: "Are Kussmaul respirations respiratory acidosis?", answer: "No. They are usually compensation for metabolic acidosis." },
      { question: "Why are they deep?", answer: "Deep ventilation removes more CO2, helping compensate for acidemia." },
      { question: "What conditions cause them?", answer: "DKA is classic, but renal failure, lactic acidosis, and toxins can also drive severe metabolic acidosis." },
    ],
    internalLinks: [
      { label: "Review ABG interpretation", href: "/us/rn/nclex-rn/lessons/abg-interpretation" },
      { label: "Study DKA lessons", href: "/us/rn/nclex-rn/lessons/diabetic-ketoacidosis" },
      { label: "Practice acid-base questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice metabolic acidosis questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study ABG and endocrine lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["DKA with fruity breath", "Renal failure acidosis", "Sepsis lactic acidosis"],
    apa7References: references,
  },
  {
    slug: "siadh-vs-diabetes-insipidus-nursing-mechanism",
    status: "draft",
    title: "SIADH vs Diabetes Insipidus: ADH, Urine Output, Sodium, and Nursing Assessment",
    metaTitle: "SIADH vs Diabetes Insipidus for Nurses | ADH Mechanism",
    metaDescription: "Compare SIADH and diabetes insipidus through ADH physiology, sodium, urine concentration, assessment cues, and exam traps.",
    h1: "SIADH vs diabetes insipidus",
    clinicalSummary:
      "SIADH and diabetes insipidus are opposite ADH problems. SIADH retains water and dilutes sodium; diabetes insipidus loses free water and concentrates sodium. Nurses should compare urine output, urine concentration, serum sodium, neurologic status, and fluid orders.",
    mechanismExplanation: [
      "In SIADH, excess ADH causes the kidney to reabsorb water, producing concentrated urine and dilutional hyponatremia.",
      "In diabetes insipidus, absent ADH effect prevents water reabsorption, causing large volumes of dilute urine and risk for hypernatremic dehydration.",
      "Both disorders can cause neurologic changes because sodium and water shifts alter brain cell osmotic balance.",
    ],
    nursingImplications: [
      "For SIADH, monitor sodium, fluid restriction adherence, daily weights, I/O, seizure precautions when severe, and neurologic status.",
      "For DI, monitor urine output, thirst, sodium, hydration, hemodynamics, and response to desmopressin if ordered.",
      "Escalate seizures, severe confusion, rapid sodium shifts, hypotension, or extreme urine output.",
    ],
    examRelevance:
      "High relevance for NCLEX, REx-PN, NCLEX-PN, and NP endocrine exams because the comparison is a common distractor pattern.",
    commonMisconceptions: [
      "Both disorders involve ADH, but the water and sodium patterns are opposite.",
      "Hyponatremia in SIADH is dilutional, not usually sodium loss.",
      "DI is not diabetes mellitus; the issue is water balance, not glucose.",
    ],
    faq: [
      { question: "Which disorder has high urine output?", answer: "Diabetes insipidus typically causes high-volume dilute urine." },
      { question: "Which disorder causes hyponatremia?", answer: "SIADH commonly causes dilutional hyponatremia." },
      { question: "Why are neuro checks important?", answer: "Rapid sodium and water shifts can cause confusion, seizures, or cerebral edema risk." },
    ],
    internalLinks: [
      { label: "Review endocrine lessons", href: "/us/rn/nclex-rn/lessons/endocrine-disorders" },
      { label: "Use lab value tools", href: "/tools/lab-values" },
      { label: "Practice endocrine comparison questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice SIADH vs DI questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study endocrine and electrolyte lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["Post-op SIADH", "Central DI after head injury", "Hyponatremia seizure precautions"],
    apa7References: references,
  },
  {
    slug: "pyloric-stenosis-hypochloremic-hypokalemic-metabolic-alkalosis",
    status: "draft",
    title: "Why Pyloric Stenosis Causes Hypochloremic Hypokalemic Metabolic Alkalosis",
    metaTitle: "Pyloric Stenosis Metabolic Alkalosis | Nursing Mechanism",
    metaDescription: "Pediatric acid-base explainer for pyloric stenosis, vomiting, chloride loss, potassium loss, metabolic alkalosis, and nursing cues.",
    h1: "Pyloric stenosis and hypochloremic hypokalemic metabolic alkalosis",
    clinicalSummary:
      "Pyloric stenosis causes projectile vomiting of gastric acid. The patient loses hydrogen and chloride, develops metabolic alkalosis, and often becomes hypokalemic through renal compensation and volume depletion physiology.",
    mechanismExplanation: [
      "Gastric fluid contains hydrochloric acid. Repeated vomiting removes hydrogen and chloride from the body.",
      "Loss of hydrogen ions raises bicarbonate relative to acid load, producing metabolic alkalosis.",
      "Volume depletion activates aldosterone pathways that increase sodium retention while promoting potassium and hydrogen excretion, worsening hypokalemia and alkalosis.",
    ],
    nursingImplications: [
      "Assess vomiting pattern, hydration, weight, fontanelle, mucous membranes, urine output, electrolytes, and acid-base status.",
      "Anticipate fluid and electrolyte correction before surgery when ordered.",
      "Escalate lethargy, poor perfusion, low urine output, or severe electrolyte derangement.",
    ],
    examRelevance:
      "Useful for NCLEX, REx-PN, pediatric NP, and pediatric clinical reasoning because it links GI loss to acid-base interpretation.",
    commonMisconceptions: [
      "Vomiting does not cause metabolic acidosis in this classic pattern; gastric acid loss drives alkalosis.",
      "Hypokalemia can worsen during compensation and rehydration unless monitored.",
      "The visible vomiting pattern is only one part of the safety picture.",
    ],
    faq: [
      { question: "Why is chloride low?", answer: "Repeated vomiting removes hydrochloric acid from the stomach." },
      { question: "Why does potassium fall?", answer: "Volume depletion and aldosterone effects increase renal potassium loss." },
      { question: "Why correct fluids first?", answer: "Perfusion and electrolyte correction reduce perioperative risk." },
    ],
    internalLinks: [
      { label: "Review pediatric GI lessons", href: "/us/rn/nclex-rn/lessons/pediatric-gi-disorders" },
      { label: "Review ABG interpretation", href: "/us/rn/nclex-rn/lessons/abg-interpretation" },
      { label: "Practice pediatric questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice pediatric acid-base questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study pediatric nursing lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["Infant projectile vomiting", "Dehydration before surgery", "Metabolic alkalosis lab interpretation"],
    apa7References: references,
  },
  {
    slug: "respiratory-acidosis-vs-metabolic-acidosis-nursing",
    status: "draft",
    title: "Respiratory Acidosis vs Metabolic Acidosis: ABG Clues and Nursing Priorities",
    metaTitle: "Respiratory vs Metabolic Acidosis for Nurses | ABG Clues",
    metaDescription: "Compare respiratory and metabolic acidosis using pH, PaCO2, HCO3, compensation, clinical causes, and nursing priorities.",
    h1: "Respiratory acidosis vs metabolic acidosis",
    clinicalSummary:
      "Respiratory acidosis is driven by CO2 retention from inadequate ventilation; metabolic acidosis is driven by bicarbonate deficit or acid gain. The pH may look similar, but the nursing priorities differ because the primary problem differs.",
    mechanismExplanation: [
      "Respiratory acidosis occurs when ventilation cannot remove CO2 effectively, increasing carbonic acid and lowering pH.",
      "Metabolic acidosis occurs when fixed acids accumulate or bicarbonate is lost, lowering pH while the lungs may compensate by increasing ventilation.",
      "Compensation moves the opposite system in the direction that helps pH, but compensation does not fix the primary cause.",
    ],
    nursingImplications: [
      "For respiratory acidosis, assess airway, breathing effectiveness, sedation, COPD, fatigue, ventilator status, and CO2 retention cues.",
      "For metabolic acidosis, assess perfusion, renal function, DKA, lactate, diarrhea, toxins, and compensatory breathing.",
      "Escalate altered mental status, worsening work of breathing, unstable vitals, severe pH derangement, or mixed disorder suspicion.",
    ],
    examRelevance:
      "High-yield for NCLEX, REx-PN, NCLEX-PN, respiratory therapy-adjacent allied learning, and NP diagnostics because ABG items often require identifying the driver before the intervention.",
    commonMisconceptions: [
      "Low pH alone does not tell you the cause.",
      "Fast breathing can be compensation for metabolic acidosis rather than the primary respiratory problem.",
      "Compensated does not mean safe or resolved.",
    ],
    faq: [
      { question: "Which value points to respiratory acidosis?", answer: "A high PaCO2 with low pH points toward respiratory acidosis." },
      { question: "Which value points to metabolic acidosis?", answer: "A low bicarbonate with low pH points toward metabolic acidosis." },
      { question: "Can both happen together?", answer: "Yes. Mixed disorders occur and should be suspected when compensation does not fit the expected pattern." },
    ],
    internalLinks: [
      { label: "Review ABG lessons", href: "/us/rn/nclex-rn/lessons/abg-interpretation" },
      { label: "Use lab value tools", href: "/tools/lab-values" },
      { label: "Practice ABG questions", href: "/question-bank" },
    ],
    practiceCta: { label: "Practice acidosis comparison questions", href: "/question-bank" },
    relatedLessonsCta: { label: "Study respiratory and acid-base lessons", href: "/us/rn/nclex-rn/lessons" },
    relatedScenarios: ["COPD CO2 retention", "DKA metabolic acidosis", "Sepsis lactic acidosis"],
    apa7References: references,
  },
] as const satisfies readonly NursingMechanismExplainerDraft[];

export function getNursingMechanismExplainerDraft(slug: string): NursingMechanismExplainerDraft | undefined {
  return NURSING_MECHANISM_EXPLAINER_DRAFTS.find((draft) => draft.slug === slug);
}
