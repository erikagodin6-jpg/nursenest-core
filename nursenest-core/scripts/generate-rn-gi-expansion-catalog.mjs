#!/usr/bin/env node
/**
 * Writes rn-nclex-gastrointestinal-expansion-catalog.json
 * Run: node scripts/generate-rn-gi-expansion-catalog.mjs (from nursenest-core)
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../src/content/pathway-lessons/rn-nclex-gastrointestinal-expansion-catalog.json");

const HUB = `[Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons)`;
const GI_BLEED = `[GI bleed assessment](LESSON:gi-bleed-assessment)`;
const LIVER = `[liver failure & hepatic encephalopathy](LESSON:liver-failure-hepatic-encephalopathy)`;
const PANCREAS = `[acute pancreatitis care](LESSON:acute-pancreatitis-nursing-care)`;
const OBSTRUCTION = `[bowel obstruction vs ileus](LESSON:bowel-obstruction-vs-paralytic-ileus)`;
const OSTOMY = `[ostomy care](LESSON:ostomy-skin-protection)`;
const CDIFF = `[C. diff infection control](LESSON:c-diff-infection-control)`;
const GERD = `[GERD & PUD bleeding clues](LESSON:gerd-pud-bleeding-clues)`;
const ENTERAL = `[enteral feeding tube safety](LESSON:enteral-feeding-tube-safety)`;

/** [slug, title, flavor: general|liver|bleed|ibd|nutrition|postop|biliary|infection|priority] */
const META = [
  ["abdominal-assessment-nurses-nclex-rn", "Abdominal Assessment for Nurses", "general"],
  ["bowel-sounds-meaning-nclex-rn", "Bowel Sounds and What They Mean", "general"],
  ["ascites-fluid-volume-liver-disease-nclex", "Ascites and Fluid Volume in Liver Disease", "liver"],
  ["jaundice-causes-nursing-implications-nclex", "Jaundice: Causes and Nursing Implications", "liver"],
  ["cirrhosis-portal-hypertension-nclex-rn", "Cirrhosis and Portal Hypertension", "liver"],
  ["esophageal-varices-bleeding-risk-nclex", "Esophageal Varices and Bleeding Risk", "liver"],
  ["paracentesis-nursing-care-nclex-rn", "Paracentesis Nursing Care", "liver"],
  ["hepatic-encephalopathy-deep-dive-nclex-rn", "Hepatic Encephalopathy Deep Dive", "liver"],
  ["hepatitis-abc-overview-nclex-rn", "Hepatitis A B C Overview", "liver"],
  ["lower-gi-bleed-nclex-rn", "Lower GI Bleed", "bleed"],
  ["melena-hematochezia-hematemesis-nclex", "Melena vs Hematochezia vs Hematemesis", "bleed"],
  ["gi-bleed-first-actions-priorities-nclex", "GI Bleed: First Actions and Priorities", "bleed"],
  ["crohns-vs-ulcerative-colitis-nclex", "Crohn's Disease vs Ulcerative Colitis", "ibd"],
  ["diverticulitis-nursing-nclex-rn", "Diverticulitis", "ibd"],
  ["irritable-bowel-syndrome-nclex-rn", "Irritable Bowel Syndrome", "ibd"],
  ["appendicitis-nursing-priorities-nclex", "Appendicitis", "ibd"],
  ["enteral-feeding-tubes-ng-peg-nclex", "Enteral Feeding Tubes (NG, PEG)", "nutrition"],
  ["tube-feeding-complications-aspiration-nclex", "Tube Feeding Complications and Aspiration Prevention", "nutrition"],
  ["total-parenteral-nutrition-nclex-rn", "Total Parenteral Nutrition (TPN)", "nutrition"],
  ["malnutrition-nutritional-assessment-nclex", "Malnutrition and Nutritional Assessment", "nutrition"],
  ["postoperative-ileus-nursing-nclex", "Postoperative Ileus", "postop"],
  ["abdominal-surgery-complications-nclex-rn", "Abdominal Surgery Complications", "postop"],
  ["ostomy-complications-troubleshooting-nclex", "Ostomy Complications and Troubleshooting", "postop"],
  ["cholecystitis-gallstones-nclex-rn", "Cholecystitis and Gallstones", "biliary"],
  ["ercp-nursing-care-nclex-rn", "ERCP Nursing Care", "biliary"],
  ["pancreatitis-complications-nclex-rn", "Pancreatitis Complications", "biliary"],
  ["gastroenteritis-dehydration-nclex-rn", "Gastroenteritis and Dehydration", "infection"],
  ["hepatitis-transmission-prevention-nclex", "Hepatitis Transmission and Prevention", "infection"],
  ["gi-infection-control-precautions-nclex-rn", "Infection Control in GI Patients", "infection"],
  ["acute-abdomen-first-action-nclex", "Acute Abdomen: What Do You Do First?", "priority"],
  ["which-gi-patient-unstable-ngn", "Which GI Patient Is Unstable?", "priority"],
  ["postoperative-gi-complications-priority-nclex", "Post-Op GI Complications: Who Do You See First?", "priority"],
];

function bodies(slug, title, flavor) {
  const isLiver = flavor === "liver";
  const isBleed = flavor === "bleed";
  const isIbd = flavor === "ibd";
  const isNutrition = flavor === "nutrition";
  const isPostop = flavor === "postop";
  const isBiliary = flavor === "biliary";
  const isInfection = flavor === "infection";
  const isPriority = flavor === "priority";

  let meaning = `**${title}** is core NCLEX-RN **gastrointestinal** nursing: connect **inspection, auscultation, percussion, and palpation** themes (as the stem allows) to **perfusion, bleeding, obstruction, and infection** risk. Canadian stems may use **metric** labs and interprofessional language; **first action** logic matches US boards: **airway** when vomiting blood, **two large-bore IVs** and **type & screen** themes for unstable bleed, **NPO** when surgical abdomen is suspected, then **notify** with **objective** trends.\n\nNCLEX rewards distinguishing **new instability** from chronic symptoms and avoiding **routine tasks** ahead of **resuscitation** or **escalation**.\n\nCross-link ${GI_BLEED}, ${LIVER}, ${PANCREAS}, ${OBSTRUCTION}, and ${HUB}.`;

  if (isLiver) {
    meaning = `**${title}** focuses on **hepatobiliary** pathophysiology and nursing surveillance: **ascites**, **portal hypertension**, **variceal** bleeding risk, **ammonia** and **encephalopathy** patterns, **jaundice** workup themes, and **procedure** support for **paracentesis** when ordered. You protect **airway** if altered mentation worsens, maintain **bleeding precautions**, trend **electrolytes** and **renal function**, and teach **sodium restriction**, **lactulose/rifaximin** adherence themes, and **when to seek care** for **GI bleed** or **worsening confusion**.\n\nPair ${LIVER}, ${GI_BLEED}, ${GERD}, and ${HUB}.`;
  }
  if (isBleed) {
    meaning = `**${title}** centers on **GI hemorrhage** recognition and stabilization: **hypotension**, **tachycardia**, **pallor**, **orthostasis**, **altered mental status**, and **stool or emesis** clues (**melena**, **hematochezia**, **hematemesis**). NCLEX tests **NPO**, **IV access**, **labs/blood bank** preparation, **airway protection** with active **hematemesis**, **elevate HOB** when hematemesis risk, and **frequent vitals** with **orthostatic** checks when ordered.\n\nIntegrate ${GI_BLEED}, ${GERD}, ${LIVER}, and ${HUB}.`;
  }
  if (isIbd) {
    meaning = `**${title}** compares **inflammatory** and **acute surgical** GI presentations: **Crohn** vs **ulcerative colitis** distribution patterns, **diverticulitis** left-lower-quadrant themes, **IBS** functional criteria cues in stems, and **appendicitis** **peritoneal** escalation. Nursing priorities include **pain assessment**, **infection** signs, **strict I&O**, **bowel rest** when ordered, **surgical** readiness for **perforation** suspicion, and **patient teaching** on **flare** management when stable.\n\nUse ${OBSTRUCTION}, ${PANCREAS}, ${CDIFF}, and ${HUB}.`;
  }
  if (isNutrition) {
    meaning = `**${title}** covers **enteral** and **parenteral** support: **NG/PEG** placement verification themes, **residual** checks when policy allows, **head-of-bed** elevation, **aspiration** prevention, **slowing or holding** feeds for **distension** or **emesis**, and **TPN** line **asepsis** with **glucose** and **electrolyte** monitoring per orders. Boards punish **continuing tube feeds** when **aspiration** risk is high or **perforation** is suspected.\n\nLink ${ENTERAL}, ${PANCREAS}, ${OBSTRUCTION}, and ${HUB}.`;
  }
  if (isPostop) {
    meaning = `**${title}** applies to **post-abdominal** and **ostomy** clients: **ileus** vs **obstruction** timelines, **first flatus** and **bowel** return, **wound** and **drain** surveillance, **fever** with **tachycardia** as **leak** or **abscess** red flags, and **stoma** **ischemia**, **retraction**, or **high output** complications. Prioritize **early mobilization** when safe, **DVT** prevention per orders, and **escalation** for **rigid abdomen** or **uncontrolled** pain.\n\nConnect ${OSTOMY}, ${OBSTRUCTION}, ${PANCREAS}, and ${HUB}.`;
  }
  if (isBiliary) {
    meaning = `**${title}** spans **gallbladder**, **biliary tree**, and **pancreas** complications: **RUQ** pain patterns, **Murphy** sign themes, **post-ERCP** pancreatitis or **bleeding** vigilance, and **pseudocyst**/**necrosis** surveillance after pancreatitis. Nursing care emphasizes **NPO**, **pain** control with monitoring, **strict I&O**, **glucose** trends, and **clear reporting** of **worsening** abdominal exam.\n\nPair ${PANCREAS}, ${OBSTRUCTION}, ${LIVER}, and ${HUB}.`;
  }
  if (isInfection) {
    meaning = `**${title}** ties **enteric** pathogens, **hepatitis** transmission routes, and **contact/droplet** precautions to **dehydration** and **electrolyte** loss. NCLEX tests **hand hygiene**, **PPE** selection, **isolation** per policy, **oral rehydration** vs **IV** replacement when unstable, and **public health** reporting themes when appropriate.\n\nUse ${CDIFF}, ${LIVER}, ${GI_BLEED}, and ${HUB}.`;
  }
  if (isPriority) {
    meaning = `**${title}** trains **NGN-style prioritization** for GI clients: pick the patient with **active hemodynamic compromise** from **bleed**, **perforation** suspicion, **strangulating** obstruction, **severe dehydration**, **post-ERCP** **acute abdomen**, or **worsening encephalopathy** over stable teaching or routine dressing changes. Boards reward **objective instability** and **airway** risk from **hematemesis** over polite requests.\n\nAnchor with ${GI_BLEED}, ${OBSTRUCTION}, ${LIVER}, ${PANCREAS}, and ${HUB}.`;
  }

  let exam = `Examiners use **first**, **priority**, and **most important** language. Eliminate answers that **delay IV access** in **unstable bleed**, **offer food** before **NPO** rules are cleared in acute abdomen vignettes, or **delegate** unstable reassessment to UAP. Expect **SBAR** with **quantified** vitals, **emesis/stool** description, and **orthostatic** trends when provided.`;

  if (isLiver) exam += ` Watch for **encephalopathy** triggers (**infection**, **constipation**, **GI bleed**, **sedatives**) and **variceal** bleed precautions.`;
  if (isBleed) exam += ` Items contrast **upper** vs **lower** source clues and **stability** thresholds for **urgent** escalation.`;
  if (isIbd) exam += ` Traps include **delaying surgical consult** when **peritoneal** signs appear with fever.`;
  if (isNutrition) exam += ` Feeding questions reward **aspiration** prevention and **holding feeds** when ileus or perforation risk rises.`;
  if (isPostop) exam += ` Post-op stems stack **fever + tachycardia + ileus**—choose assessment and **notify** before routine ambulation alone.`;
  if (isBiliary) exam += ` ERCP items probe **post-procedure** pain, **amylase/lipase** trends, and **bleeding** surveillance.`;
  if (isInfection) exam += ` Isolation and **contact precautions** beat finishing non-urgent charting.`;
  if (isPriority) exam += ` Multi-patient matrices: **one unstable GI bleed** or **acute abdomen** outranks three stable med passes.`;

  let core = `- **Learning objectives (exam frame):** interpret abdominal and **stool** findings; link **vitals** to **perfusion**; choose **NPO**, **IV access**, and **escalation** when red flags appear.\n- **Nursing priorities:** airway and **aspiration** protection; **volume** resuscitation per orders; **infection** and **isolation** discipline; **pain** assessment without masking **surgical** catastrophe.\n- **Safety / red flags:** **rigid abdomen**, **unexplained** hypotension, **maroon** stools, **coffee-ground** emesis, **confusion** with **liver** failure, **high-output** stoma.\n- **Patient teaching (when stable):** diet progression, **medication** adherence, **when to return** for bleeding or fever.\n- **Clinical reasoning:** compare **new** vs **baseline**; pick **assess + stabilize + notify** before teaching.`;

  if (isLiver)
    core = `- **Ascites / FVE:** daily weights, **I&O**, **abdominal girth** when ordered, **sodium** restriction teaching, **spontaneous bacterial peritonitis** fever vigilance.\n- **Encephalopathy:** **asterixis** themes, **medication** adherence for ammonia-lowering therapies, **avoid constipation** and **sedation** when stem cues.\n- **Varices:** soft diet teaching when stable; **avoid straining** themes; recognize **acute** **hematemesis** as emergency pathway.\n- **Procedures:** **paracentesis**—verify **consent**, **baseline** vitals, **post-procedure** hypotension watch, **leak** from puncture site.\n- **Hepatitis:** **rest**, **nutrition**, **avoid alcohol** and hepatotoxins per teaching stems.`;
  if (isBleed)
    core = `- **First actions:** **two** large-bore lines when unstable; **type & screen**; **NPO**; **monitor** HR/BP/mentation; prepare **blood** per protocol.\n- **Airway:** **hematemesis** with altered protection → **suction**, **positioning**, **call for help**.\n- **Lower GI:** **hematochezia** with instability → assume **significant** loss until evaluated.\n- **Medications:** avoid **NSAIDs** teaching in active **PUD** bleed stems; follow **PPI** orders.\n- **Documentation:** estimate **volume** of blood, **color**, **frequency**, and **syncope**.`;
  if (isIbd)
    core = `- **Crohn:** skip lesions, **fistula** risk, **malabsorption** themes.\n- **UC:** continuous **colonic** inflammation, **bloody diarrhea**, **toxic megacolon** red flags.\n- **Diverticulitis:** **LLQ** pain, fever, **NPO** + **antibiotics** per orders; **perforation** → surgical escalation.\n- **Appendicitis:** **periumbilical** to **RLQ** migration themes; **rebound** → urgent pathway.\n- **IBS:** diagnosis of exclusion framing—no fever, no **alarm** features in classic stems.`;
  if (isNutrition)
    core = `- **NG/PEG:** confirm **placement** per policy before feeding; **HOB** elevated; **flush** per protocol.\n- **Aspiration:** **hold** feeds with **emesis**, **high residuals** when ordered thresholds met, **new** hypoxia or **cough** with feeds.\n- **TPN:** dedicated **central** line care; **strict** aseptic technique; monitor **glucose**, **electrolytes**, **triglycerides** when shown.\n- **Malnutrition:** **BMI**, **unintentional** weight loss, **albumin** themes; refer **dietitian** when stable.\n- **Refeeding:** risk awareness in **starved** clients when stem cues electrolytes.`;
  if (isPostop)
    core = `- **Ileus:** absent **bowel sounds**, **distension**, **NPO** + supportive care; differentiate from **complete** obstruction.\n- **Surgical complications:** **fever**, **tachycardia**, **increasing** pain out of proportion → **notify**.\n- **Ostomy:** assess **stoma color** (dusky = ischemia), **skin** integrity, **output** volume and consistency.\n- **Mobility:** progressive ambulation when orders allow to reduce **ileus** risk.\n- **DVT:** prophylaxis per orders unless contraindicated.`;
  if (isBiliary)
    core = `- **Cholecystitis:** **RUQ** pain, **Murphy** sign, **US** themes; **pre-op** NPO and antibiotics per orders.\n- **ERCP:** **post-procedure** pancreatitis watch (**pain**, **lipase**); **bleeding** post-sphincterotomy vigilance.\n- **Pancreatitis complications:** **ARDS**, **AKI**, **hypocalcemia**, **pseudocyst**—trend vitals, **UOP**, **oxygenation**.\n- **Pain:** opioid-sparing when appropriate; still monitor **ileus** and **respiratory** depression.\n- **Nutrition:** advance diet per **tolerance** and orders after resolution.`;
  if (isInfection)
    core = `- **Gastroenteritis:** **oral** rehydration when mild and tolerating; **IV** fluids when **unable** to keep up or hypotensive.\n- **Hepatitis:** **A** fecal-oral, **B/C** blood/body fluid routes—**standard precautions** plus **device** safety.\n- **C. diff:** **contact** precautions, **hand washing** with soap and water, **environmental** cleaning themes.\n- **Electrolytes:** **hypokalemia** with severe losses—monitor **EKG** themes when provided.\n- **Return precautions:** **bloody** stool, **high** fever, **severe** abdominal pain, **dehydration** signs.`;
  if (isPriority)
    core = `- **Airway** with **active hematemesis** beats routine tasks.\n- **Hypotension + melena** beats stable chronic **GERD** discomfort.\n- **Rigid abdomen + fever** beats scheduled **discharge** teaching.\n- **New confusion + liver failure** beats arranging **transport** alone without assessment.\n- **Delegate** only stable, non-judgmental tasks after unstable clients are covered.`;

  let scenario = `**Patient vignette.** A hospitalized adult with concerns related to **${title}** develops **worsening abdominal distension**, **tachycardia**, and **dizziness** when standing. You note **guarding** on light palpation per order.\n\n**Fork:** **NPO**, **IV access**, **repeat vitals** including **orthostatics** if ordered, **prepare labs** per protocol, and **notify the provider** with **SBAR** including **stool/emesis** details—not routine hygiene first.`;

  if (isLiver)
    scenario = `**Patient vignette.** A client with **cirrhosis** becomes **sleepier** overnight with **flapping tremor** when arms extended. **BP** is stable but **temperature** is **38.1 °C**.\n\n**Fork:** Treat as **encephalopathy** exacerbation until evaluated—**neuro checks**, **infection** workup themes, **review** **constipation** and **GI bleed** risk, **notify provider**, and **avoid sedating** PRN stacking without orders.`;
  if (isBleed)
    scenario = `**Patient vignette.** An adult reports **black tarry stools** ×2 and **lightheadedness**. **BP** **92/58**, **HR** **118**, skin **cool**.\n\n**Fork:** **Activate GI bleed pathway** themes—**two large-bore IVs**, **type & screen**, **NPO**, **continuous monitoring**, **notify provider** urgently, and **airway** equipment ready if **emesis** worsens.`;
  if (isIbd)
    scenario = `**Patient vignette.** A client with **new RLQ pain**, **fever**, and **rebound tenderness** after **24 hours** of vague periumbilical discomfort.\n\n**Fork:** **NPO**, **notify surgical team/provider**, **monitor** vitals and **pain** pattern shift, **avoid** **oral analgesics** masking exam without orders—classic **appendicitis** escalation pathway.`;
  if (isNutrition)
    scenario = `**Patient vignette.** During **continuous tube feeding**, the client **coughs**, **SpO₂** drops to **89%**, and you note **bilateral crackles** new this shift.\n\n**Fork:** **Stop or hold feeds** per protocol, **elevate HOB**, **suction** as needed, **notify provider**, and **assess** for **aspiration**—not increasing **rate** to “finish the bag.”`;
  if (isPostop)
    scenario = `**Patient vignette.** **POD 2** after **colectomy**, the client has **increasing** midline pain, **HR** **124**, **temperature** **38.6 °C**, and **minimal** flatus.\n\n**Fork:** **Peritonitis** until cleared—**notify surgeon/provider**, **prepare** for **imaging** or **return to OR** themes, **avoid** **forcing** **PO** intake; support **IV** fluids and **monitor** **UOP**.`;
  if (isBiliary)
    scenario = `**Patient vignette.** **6 hours after ERCP**, the client reports **severe epigastric pain** radiating to the **back** with **nausea**. **Amylase/lipase** are trending **up** on the flowsheet.\n\n**Fork:** **Post-ERCP pancreatitis** surveillance—**NPO**, **IV fluids** per orders, **pain** reassessment, **frequent vitals**, **notify provider** with **timed** symptom onset.`;
  if (isInfection)
    scenario = `**Patient vignette.** A client has **profuse watery diarrhea** after **recent antibiotics**, **low-grade fever**, and **abdominal cramping**. Another roommate is **immunocompromised**.\n\n**Fork:** **Initiate contact precautions** per policy, **notify provider**, **obtain stool** studies when ordered, **strict hand hygiene**, and **monitor** for **dehydration**—not finishing **non-urgent** tasks first.`;
  if (isPriority)
    scenario = `**Patient vignette.** Four clients: (A) **hematemesis** with **BP 88/52**, (B) **chronic GERD** **heartburn** **5/10** stable, (C) **post-op** **fever** **38.8 °C** with **rigid abdomen**, (D) routine **med pass**.\n\n**Fork:** **See Client A first** for **airway and perfusion** risk with **active upper GI bleed**; then **C** for **surgical abdomen**; then **B**; then **D** with clear **communication**.`;

  const takeaways = `- **Inspect, listen, palpate** themes only within scope and orders—**integrate** with **vitals** and **labs**.\n- **Unstable bleed** or **acute abdomen** → **NPO**, **access**, **monitor**, **notify** before teaching.\n- **Synthesis:** GI nursing is often **resuscitation in disguise**—trend **perfusion** and **mentation**.\n\n**Related:** ${GI_BLEED} · ${LIVER} · ${OBSTRUCTION} · ${HUB}.`;

  return { meaning, exam, core, scenario, takeaways };
}

function quizPair(title) {
  return {
    preTest: [
      {
        question: `For ${title}, which action best matches NCLEX-RN prioritization?`,
        options: [
          "Finish charting before reassessing a client with hypotension and melena",
          "Establish IV access, monitor vitals and mentation, and notify the provider with objective findings when unstable criteria are met",
          "Offer a regular diet to rule out anxiety-related abdominal pain",
          "Send the UAP alone to evaluate new rigid abdomen and fever",
        ],
        correct: 1,
        rationale:
          "GI emergencies require immediate assessment, IV access when indicated, perfusion and bleeding surveillance, and timely provider communication before deferrable tasks.",
      },
      {
        question: `A client with risk related to ${title} has active hematemesis and altered consciousness. What is the priority?`,
        options: [
          "Complete discharge teaching about diet",
          "Protect airway, position to reduce aspiration risk, call for help, and prepare for urgent interventions per orders",
          "Ambulate the client to stimulate bowel function",
          "Wait for the next scheduled assessment in two hours",
        ],
        correct: 1,
        rationale:
          "Active upper GI bleeding with altered consciousness threatens airway and perfusion; nursing prioritizes airway protection, assistance, and urgent escalation.",
      },
    ],
    postTest: [
      {
        question: `Which finding most urgently escalates care in a GI context for ${title}?`,
        options: [
          "Mild bloating after lunch in afebrile client",
          "Rigid abdomen with fever and tachycardia after recent abdominal surgery",
          "Request for a vegetarian meal tray",
          "Chronic heartburn unchanged from baseline",
        ],
        correct: 1,
        rationale:
          "Peritoneal signs with fever and tachycardia suggest perforation or intra-abdominal catastrophe until evaluated and require immediate escalation.",
      },
      {
        question: `When is patient teaching about ${title} most appropriate?`,
        options: [
          "During active hemodynamic instability from GI bleeding",
          "After stabilization when the client is alert, oriented, and able to participate",
          "Only after discharge without follow-up",
          "Before any assessment to save time",
        ],
        correct: 1,
        rationale:
          "Education is safest and most effective after acute threats are stabilized and the patient can engage.",
      },
    ],
  };
}

function buildLesson(slug, title, flavor) {
  const { meaning, exam, core, scenario, takeaways } = bodies(slug, title, flavor);
  return {
    slug,
    title,
    topic: "Gastrointestinal",
    topicSlug: "gastrointestinal",
    bodySystem: "Gastrointestinal",
    system: "gastrointestinal",
    previewSectionCount: 1,
    seoTitle: `${title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN gastrointestinal review: ${title} — assessment, nursing priorities, red flags, bleeding and obstruction safety, infection control, Canada- and US-friendly clinical judgment.`,
    relatedLessonRefs: [
      { slug: "gi-bleed-assessment", titleHint: "GI bleed assessment" },
      { slug: "liver-failure-hepatic-encephalopathy", titleHint: "Liver failure & hepatic encephalopathy" },
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
  source: "scripts/generate-rn-gi-expansion-catalog.mjs",
  pathways: {
    "ca-rn-nclex-rn": lessons,
    "us-rn-nclex-rn": JSON.parse(JSON.stringify(lessons)),
  },
};

writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log("Wrote", outPath, "lessons:", lessons.length);
