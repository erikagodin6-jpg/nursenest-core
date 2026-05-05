import { TierCode } from "@prisma/client";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { pathwayHubAppFlashcardsHref, pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { appPathwayCatSessionStartPath, resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

export type LabCategorySlug =
  | "electrolytes"
  | "renal"
  | "liver"
  | "hematology"
  | "coagulation"
  | "cardiac"
  | "abgs";

export type LabTrack = "rn" | "pn" | "np" | "allied";
export type LabQuestionType = "multiple_choice" | "clinical_scenario" | "prioritization" | "trend" | "pattern";
export type LabQuestionDifficulty = "beginner" | "intermediate" | "advanced";

export type LabCategoryDefinition = {
  slug: LabCategorySlug;
  title: string;
  description: string;
};

export type LabThreshold = {
  label: string;
  threshold: string;
  whyItMatters: string;
};

export type LabAlgorithmStep = {
  step: string;
  action: string;
  why: string;
};

export type LabPatternExample = {
  title: string;
  pattern: string[];
  interpretation: string;
  firstAction: string;
};

export type LabMicroScenario = {
  title: string;
  stem: string;
  findings: string[];
  question: string;
  answer: string;
  rationale: string;
};

/** Educational “NCLEX-style” distractor bands — illustrative, not live analytics. */
export type LabAnswerDistributionEntry = {
  optionIndex: number;
  shareBand: string;
  distractorRationale: string;
};

export type LabQuestion = {
  id: string;
  type: LabQuestionType;
  difficulty: LabQuestionDifficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  /** When true, stem is written as a multi-sentence clinical vignette. */
  isClinicalScenario?: boolean;
  /** Typical trap pick patterns learners confuse under exam pressure. */
  answerDistribution?: LabAnswerDistributionEntry[];
};

export type LabFlashcard = {
  id: string;
  prompt: string;
  answer: string;
  rationale: string;
};

export type LabLessonDefinition = {
  slug: string;
  category: LabCategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  freePreviewBlurb: string;
  normalRange: string;
  physiology: string[];
  causesHigh: string[];
  causesLow: string[];
  signsSymptoms: string[];
  priorityThresholds: LabThreshold[];
  nursingInterventions: string[];
  treatmentAlgorithm: LabAlgorithmStep[];
  medicationsAffecting: string[];
  labConditionRelationships: string[];
  clinicalPearls: string[];
  clientEducation: string[];
  nclexTraps: string[];
  trendInterpretation: string[];
  patternRecognition: LabPatternExample[];
  priorityDecisionMaking: string[];
  microScenarios: LabMicroScenario[];
  tierFocus: Record<LabTrack, string[]>;
  supportedTracks: LabTrack[];
  practiceQuestionTopic: string;
};

export type LabsStudyLinks = {
  flashcardsHref: string;
  questionBankHref: string;
  /** Topic-scoped practice-test builder (same contract as pathway lesson study loops). */
  practiceTestsTopicHref: string;
  /** Pathway-scoped RN/PN/NP lesson hub; optional topic alignment with lab `practiceQuestionTopic`. */
  lessonsHubHref: string;
  /** CAT adaptive session start when pathway is known; otherwise generic practice-test entry. */
  catLaunchHref: string;
  catHref: string;
  labDrillsHref: string;
};

export const LABS_CATEGORIES: readonly LabCategoryDefinition[] = [
  {
    slug: "electrolytes",
    title: "Electrolytes",
    description: "Sodium, potassium, calcium, and magnesium pattern recognition with escalation logic.",
  },
  {
    slug: "renal",
    title: "Renal",
    description: "AKI, perfusion, nephrotoxin, and volume-status interpretation anchored to renal labs.",
  },
  {
    slug: "liver",
    title: "Liver",
    description: "Hepatocellular injury, cholestasis, synthetic failure, and encephalopathy-focused interpretation.",
  },
  {
    slug: "hematology",
    title: "Hematology",
    description: "Anemia, infection, marrow suppression, and bleeding-risk interpretation from CBC patterns.",
  },
  {
    slug: "coagulation",
    title: "Coagulation",
    description: "Warfarin, heparin, DIC, and thrombotic-risk interpretation using coagulation studies.",
  },
  {
    slug: "cardiac",
    title: "Cardiac",
    description: "Myocardial injury, heart failure strain, and ischemia-linked lab interpretation.",
  },
  {
    slug: "abgs",
    title: "ABGs",
    description: "Acid-base reasoning, compensation patterns, ventilation vs oxygenation, and first actions.",
  },
] as const;

const LESSONS: readonly LabLessonDefinition[] = [
  {
    slug: "potassium-priority-management",
    category: "electrolytes",
    title: "Potassium Priority Management: ECG Clues, Replacement, and Escalation",
    shortTitle: "Potassium",
    description:
      "A premium potassium lesson for dysrhythmia risk, replacement strategy, renal context, and high-acuity decision-making.",
    freePreviewBlurb:
      "Potassium becomes a nursing emergency when the value, ECG, kidney function, and medication list stop agreeing with one another.",
    normalRange: "3.5-5.0 mmol/L",
    physiology: [
      "Potassium is the major intracellular cation and sets resting membrane excitability in muscle and cardiac tissue.",
      "Insulin, beta-agonists, and alkalosis shift potassium into cells; acidosis and tissue breakdown shift it out.",
      "Kidneys clear most daily potassium load, so renal impairment turns small dosing errors into critical risk quickly.",
    ],
    causesHigh: [
      "Acute kidney injury, missed dialysis, or severe chronic kidney disease",
      "ACE inhibitors, ARBs, potassium-sparing diuretics, trimethoprim, or excess replacement",
      "Cell breakdown from burns, rhabdomyolysis, tumor lysis, hemolysis, or acidosis",
    ],
    causesLow: [
      "Loop or thiazide diuretics, GI losses, insulin therapy, alkalosis, or beta-agonists",
      "Poor intake with ongoing losses",
      "Magnesium deficiency causing refractory hypokalemia",
    ],
    signsSymptoms: [
      "Weakness, ileus, cramps, and fatigue",
      "Palpitations, new ectopy, bradycardia, or ventricular dysrhythmias",
      "Flattened T waves and U waves in low potassium; peaked T waves and QRS widening in high potassium",
    ],
    priorityThresholds: [
      {
        label: "Severe hypokalemia",
        threshold: "< 3.0 mmol/L or any dysrhythmia symptoms",
        whyItMatters: "Escalates risk for ventricular dysrhythmia and digoxin toxicity.",
      },
      {
        label: "Severe hyperkalemia",
        threshold: ">= 6.0 mmol/L or ECG change",
        whyItMatters: "Treat as unstable even before the repeat sample returns if the patient is symptomatic or the tracing is changing.",
      },
    ],
    nursingInterventions: [
      "Recheck specimen quality if hemolysis is suspected, but do not delay telemetry when the patient is unstable.",
      "Review creatinine, urine output, medications, and acid-base status before giving or holding potassium.",
      "Use pumps for IV replacement, protect peripheral veins, and never IV push potassium.",
      "Anticipate magnesium replacement when potassium will not correct.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Assess rhythm, symptoms, and perfusion first.", why: "The first threat is electrical instability, not the number alone." },
      { step: "2", action: "Confirm renal function, repeat sample if hemolyzed, and stop offending medications.", why: "You need the trend and cause before replacement or shifting therapy." },
      { step: "3", action: "For hyperkalemia with ECG changes, stabilize membrane, shift potassium intracellularly, then remove potassium.", why: "Calcium buys time; insulin/dextrose and beta-agonists redistribute; diuresis/dialysis removes." },
      { step: "4", action: "For hypokalemia, replace orally when stable and IV when symptomatic or unable to take PO.", why: "Oral is safer, but symptomatic patients need monitored correction." },
      { step: "5", action: "Trend repeat potassium and magnesium after intervention.", why: "Rebound or refractory abnormalities change the next step." },
    ],
    medicationsAffecting: [
      "ACE inhibitors, ARBs, spironolactone, eplerenone, trimethoprim, tacrolimus",
      "Loop/thiazide diuretics, insulin, albuterol, sodium bicarbonate",
      "Digoxin becomes more dangerous when potassium is low",
    ],
    labConditionRelationships: [
      "DKA treatment can rapidly drop potassium once insulin starts.",
      "AKI plus potassium-sparing medications amplifies hyperkalemia risk.",
      "Low magnesium often explains persistent low potassium despite replacement.",
    ],
    clinicalPearls: [
      "A 'normal' potassium trending from 5.8 to 5.1 after treatment is improving; a value of 5.1 rising from 4.1 may be more concerning.",
      "Treat the ECG plus the potassium together. A less dramatic number with a worse tracing still wins urgency.",
      "Check whether the sample is hemolyzed before labeling a clinically well patient hyperkalemic.",
    ],
    clientEducation: [
      "Teach which home medications raise or lower potassium and when labs need repeat monitoring.",
      "Review diet changes only in the context of kidney function and prescribed replacement plan.",
      "Escalate palpitations, severe weakness, or reduced urine output promptly.",
    ],
    nclexTraps: [
      "Choosing Kayexalate as the first action before addressing unstable ECG changes",
      "Replacing potassium without reviewing urine output or renal status",
      "Ignoring magnesium when hypokalemia is persistent",
    ],
    trendInterpretation: [
      "Falling potassium after insulin infusion in DKA can signal treatment effect but also rising dysrhythmia risk if replacement lags.",
      "Rising potassium with worsening creatinine despite loop diuretics suggests reduced renal clearance and possible dialysis-level escalation.",
      "A potassium that normalizes while the ECG remains abnormal requires reassessment for magnesium, ischemia, or ongoing toxicity.",
    ],
    patternRecognition: [
      {
        title: "DKA correction pattern",
        pattern: ["Glucose dropping", "Potassium dropping", "Anion gap still open"],
        interpretation: "Insulin is working, but the patient may become electrically unstable before ketoacidosis fully resolves.",
        firstAction: "Review replacement protocol, telemetry, and repeat chemistries sooner.",
      },
      {
        title: "Renal hyperkalemia pattern",
        pattern: ["Potassium rising", "Creatinine rising", "Urine output falling"],
        interpretation: "Removal failure is the driver, not just transcellular shift.",
        firstAction: "Escalate to the provider with concern for urgent renal-support strategy.",
      },
    ],
    priorityDecisionMaking: [
      "Symptomatic hyperkalemia with ECG changes is a treat-now problem even if the lab is being repeated.",
      "A stable mild low potassium can usually be corrected more safely with oral replacement than an aggressive IV plan.",
      "Pair potassium decisions with magnesium, renal function, and the medication list before declaring improvement.",
    ],
    microScenarios: [
      {
        title: "Missed dialysis",
        stem: "A dialysis patient arrives weak, nauseated, and bradycardic after missing two sessions.",
        findings: ["K 6.5", "Creatinine rising", "Peaked T waves on monitor"],
        question: "What is the first nursing priority?",
        answer: "Initiate hyperkalemia emergency steps with telemetry and rapid provider escalation.",
        rationale: "The immediate danger is malignant dysrhythmia, so membrane stabilization and monitored escalation come first.",
      },
    ],
    tierFocus: {
      rn: ["Link potassium to ECG patterns, medication effects, and replacement safety.", "Prioritize unstable rhythm findings over rote lab memorization."],
      pn: ["Focus on recognition of urgent symptoms, telemetry reporting, and safe replacement monitoring.", "Use simpler cause buckets: losses, shifting, reduced renal clearance, medication effect."],
      np: ["Differentiate redistribution from total-body deficit, choose escalation pathways, and integrate renal replacement decisions.", "Frame potassium inside DKA, AKI, sepsis, and heart-failure medication management."],
      allied: ["Respiratory and cardiac allied roles focus on ECG impact, medication effects, and escalation triggers.", "Laboratory allied roles emphasize specimen quality and hemolysis recognition."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "potassium",
  },
  {
    slug: "creatinine-bun-aki-patterns",
    category: "renal",
    title: "Creatinine, BUN, and AKI Patterns: Perfusion, Volume, and Renal Protection",
    shortTitle: "Creatinine and BUN",
    description: "Interpret renal labs as a trend story tied to perfusion, obstruction, nephrotoxins, and dialysis-level escalation.",
    freePreviewBlurb:
      "Renal labs matter most when you connect them to urine output, hemodynamics, and the question of whether the kidney can recover.",
    normalRange: "Creatinine about 45-110 micromol/L; BUN roughly 2.5-7.1 mmol/L (institution-specific).",
    physiology: [
      "Creatinine reflects muscle metabolism and is cleared by the kidneys, so rising values usually signal falling filtration.",
      "BUN rises with reduced renal clearance but also with dehydration, GI bleed, or catabolic stress.",
      "Urine output and perfusion trends often reveal kidney injury earlier than a single chemistry panel.",
    ],
    causesHigh: [
      "Prerenal hypoperfusion from dehydration, shock, sepsis, or heart failure",
      "Intrinsic injury from ATN, nephrotoxins, glomerular disease, or prolonged ischemia",
      "Postrenal obstruction from retention, stones, clot burden, or catheter failure",
    ],
    causesLow: [
      "Low creatinine can occur with low muscle mass or pregnancy and is rarely the priority problem itself.",
      "Low BUN may appear with severe liver dysfunction or dilutional states.",
    ],
    signsSymptoms: [
      "Oliguria, edema, crackles, rising blood pressure, confusion, nausea, or uremic symptoms",
      "Hyperkalemia or metabolic acidosis may be the first unstable clue rather than the creatinine alone",
      "Retention symptoms or flank discomfort may point toward obstruction",
    ],
    priorityThresholds: [
      {
        label: "Rapid AKI progression",
        threshold: "Creatinine rising over hours to days with oliguria",
        whyItMatters: "Suggests active injury or unresolved perfusion problem requiring immediate reassessment.",
      },
      {
        label: "Dialysis-level red flags",
        threshold: "Refractory hyperkalemia, severe acidosis, pulmonary edema, or uremic complications",
        whyItMatters: "These complications drive urgency more than the creatinine number itself.",
      },
    ],
    nursingInterventions: [
      "Trend intake/output, daily weights, blood pressure, and medication exposures.",
      "Review nephrotoxins, IV contrast, ACEi/ARB, NSAIDs, and recent hypotension.",
      "Assess for obstruction with bladder scan or catheter troubleshooting when clinically appropriate.",
      "Escalate when pulmonary edema, refractory electrolyte problems, or worsening mental status appear.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Identify whether the patient is dry, overloaded, or obstructed.", why: "The first correction depends on mechanism, not just the chemistry." },
      { step: "2", action: "Stop or question renal insults and review recent exposures.", why: "Preventing ongoing injury is an immediate nursing safety role." },
      { step: "3", action: "Match therapy to mechanism: fluids for prerenal loss, decompression for obstruction, supportive renal-protective care for intrinsic injury.", why: "The wrong intervention can worsen injury." },
      { step: "4", action: "Monitor for complications: potassium, acidosis, pulmonary edema, and uremia.", why: "Those findings define urgency and level of care." },
      { step: "5", action: "Trend the response after intervention.", why: "Improving urine output or stabilization of creatinine changes the next step more than one isolated number." },
    ],
    medicationsAffecting: [
      "NSAIDs, aminoglycosides, vancomycin, contrast, ACEi/ARB, diuretics",
      "Nephrotoxic chemotherapies and calcineurin inhibitors",
    ],
    labConditionRelationships: [
      "Heart failure can produce prerenal AKI and volume overload simultaneously.",
      "GI bleed can raise BUN disproportionately to creatinine.",
      "Sepsis may drive AKI even before severe hypotension is obvious.",
    ],
    clinicalPearls: [
      "Creatinine lags behind injury. Falling urine output and rising potassium may announce the emergency first.",
      "A patient with chronic kidney disease may have a high baseline creatinine; the trend from baseline matters most.",
      "A Foley catheter problem can mimic or worsen AKI and is a fast bedside check with high value.",
    ],
    clientEducation: [
      "Teach hydration goals, sick-day medication guidance, and when to call for reduced urine output.",
      "Review nephrotoxin avoidance and follow-up labs after acute illness or medication changes.",
    ],
    nclexTraps: [
      "Giving additional nephrotoxins without reviewing renal trend",
      "Treating creatinine instead of the complication driving instability",
      "Missing postrenal obstruction in a patient with low output and suprapubic discomfort",
    ],
    trendInterpretation: [
      "Rising creatinine with falling urine output after hypotension suggests ongoing hypoperfusion or ATN transition.",
      "Creatinine that stabilizes while edema and oxygen needs worsen may mean renal function is not the only problem; fluid status still needs action.",
      "A down-trending creatinine after decompression of retention supports postrenal recovery.",
    ],
    patternRecognition: [
      {
        title: "Prerenal pattern",
        pattern: ["BUN rising disproportionately", "Tachycardia or hypotension", "Dry mucosa and low output"],
        interpretation: "Perfusion problem leading the renal injury story.",
        firstAction: "Escalate volume/perfusion assessment and protect from further insults.",
      },
      {
        title: "Obstructive pattern",
        pattern: ["Creatinine rising", "Bladder distention or retention symptoms", "Low output despite fluids"],
        interpretation: "Postrenal obstruction until proven otherwise.",
        firstAction: "Assess catheter patency or bladder volume promptly.",
      },
    ],
    priorityDecisionMaking: [
      "Escalate based on complications and trajectory, not creatinine alone.",
      "When AKI meets hyperkalemia or pulmonary edema, the problem is no longer 'watch and trend.'",
      "Protect kidneys from the next insult even while the primary cause is still being sorted out.",
    ],
    microScenarios: [
      {
        title: "Sepsis with dropping urine output",
        stem: "A patient on broad-spectrum antibiotics has MAPs in the low 60s and urine output is falling.",
        findings: ["Creatinine rising from baseline", "K 5.4", "Lactate elevated"],
        question: "What is the priority interpretation?",
        answer: "The renal labs fit evolving organ hypoperfusion and require urgent hemodynamic reassessment.",
        rationale: "The kidney is showing harm from the perfusion problem; fluid and vasopressor strategy matters more than waiting on the next chemistry panel.",
      },
    ],
    tierFocus: {
      rn: ["Tie renal labs to fluid status, perfusion, nephrotoxin review, and complication surveillance.", "Use trend-based escalation rather than memorizing isolated cutoffs."],
      pn: ["Recognize low urine output, fluid imbalance, and the need to report worsening renal trends quickly.", "Keep assessment anchored to intake/output and medication review."],
      np: ["Differentiate prerenal, intrinsic, and postrenal mechanisms while planning diagnostic and treatment escalation.", "Integrate renal labs with acid-base, potassium, and hemodynamics."],
      allied: ["Laboratory allied roles focus on chemistry pattern integrity; rehab and respiratory allied learners focus on fluid status and escalation red flags relevant to their setting."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "creatinine",
  },
  {
    slug: "ast-alt-bilirubin-liver-patterns",
    category: "liver",
    title: "AST, ALT, Bilirubin, and Ammonia: Liver Injury and Encephalopathy Patterns",
    shortTitle: "Liver injury labs",
    description: "Differentiate hepatocellular injury, cholestasis, and hepatic decompensation with bedside action steps.",
    freePreviewBlurb:
      "Liver labs become clinically useful when you decide whether the patient has inflammation, obstruction, failing synthesis, or encephalopathy.",
    normalRange: "AST/ALT roughly < 35-40 U/L; total bilirubin about 5-21 micromol/L; ammonia ranges vary by lab.",
    physiology: [
      "AST and ALT reflect hepatocellular injury, while bilirubin reflects processing and excretion.",
      "Albumin and INR speak to synthetic function; ammonia helps explain encephalopathy but is not the only driver of mental-status change.",
      "Pattern matters more than one number: injury, obstruction, and failure do not behave the same way.",
    ],
    causesHigh: [
      "Hepatitis, ischemic injury, medication toxicity, alcohol-related injury, biliary obstruction",
      "Hemolysis or Gilbert syndrome can raise bilirubin with a different clinical picture",
      "Ammonia rises with impaired hepatic clearance, GI bleed, infection, dehydration, or missed therapy",
    ],
    causesLow: [
      "Low albumin can reflect chronic liver disease, malnutrition, or inflammation.",
      "Low transaminases are usually not the acute priority finding.",
    ],
    signsSymptoms: [
      "Jaundice, pruritus, RUQ pain, ascites, bleeding, confusion, asterixis",
      "Dark urine and pale stools suggest cholestatic processes",
      "Worsening mentation can reflect hepatic encephalopathy, sepsis, hypoxia, or GI bleed",
    ],
    priorityThresholds: [
      {
        label: "Acute liver decompensation",
        threshold: "New confusion, rising INR, hypoglycemia, or bleeding",
        whyItMatters: "Synthetic failure and encephalopathy change disposition and urgency quickly.",
      },
      {
        label: "Cholangitis concern",
        threshold: "Fever + jaundice + RUQ pain or sepsis picture",
        whyItMatters: "This is a source-control problem, not just an abnormal chemistry panel.",
      },
    ],
    nursingInterventions: [
      "Trend mental status, INR, glucose, albumin, bilirubin, stooling, and infection risk.",
      "Review hepatotoxic medications and recent acetaminophen exposure.",
      "Support encephalopathy management with safety precautions and stool-targeted therapy monitoring.",
      "Escalate suspected cholangitis, active bleeding, or rapidly worsening confusion.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Identify pattern: hepatocellular injury, cholestatic obstruction, or synthetic failure.", why: "The likely cause directs the urgency and the consultation pathway." },
      { step: "2", action: "Assess for unstable complications: altered mentation, bleeding, sepsis, or hypoglycemia.", why: "Complications, not just transaminases, determine emergency response." },
      { step: "3", action: "Remove potential toxic exposures and support ordered workup.", why: "Medication or toxin injury worsens with delay." },
      { step: "4", action: "Monitor response to lactulose, antibiotics, fluids, or source-control planning when ordered.", why: "Bedside trend shows whether the patient is clearing or failing." },
      { step: "5", action: "Document and escalate trend changes promptly.", why: "Liver patients can deteriorate fast through bleeding, infection, or encephalopathy." },
    ],
    medicationsAffecting: [
      "Acetaminophen, statins, valproate, certain antibiotics, alcohol, herbal supplements",
      "Lactulose and rifaximin influence ammonia-related symptom control",
      "Warfarin and other anticoagulants complicate INR interpretation",
    ],
    labConditionRelationships: [
      "High bilirubin plus ALP and fever suggests obstruction/infection more than isolated hepatitis.",
      "INR rising with confusion is more urgent than AST/ALT alone.",
      "GI bleeding can worsen ammonia and encephalopathy even before the liver chemistry changes much.",
    ],
    clinicalPearls: [
      "Ammonia does not replace a full neuro assessment; the patient can be more ill than the number suggests.",
      "A dramatic AST/ALT rise does not automatically mean failure if INR, glucose, and mentation remain stable.",
      "Cholestatic symptoms plus infection signs should trigger a source-control mindset.",
    ],
    clientEducation: [
      "Teach medication safety, alcohol cessation, infection monitoring, and bowel-regimen adherence when prescribed.",
      "Report confusion, black stools, fever, or worsening abdominal distention early.",
    ],
    nclexTraps: [
      "Treating a liver panel abnormality while ignoring worsening mentation or bleeding",
      "Assuming ammonia alone confirms or excludes encephalopathy",
      "Missing cholangitis in a jaundiced febrile patient",
    ],
    trendInterpretation: [
      "Falling AST/ALT with worsening INR or confusion can mean the patient is not recovering; synthetic failure may be emerging.",
      "Down-trending bilirubin after biliary decompression supports source control.",
      "Rising ammonia with missed bowel-regimen doses and new lethargy should shift attention to encephalopathy management and airway safety.",
    ],
    patternRecognition: [
      {
        title: "Cholestatic pattern",
        pattern: ["Jaundice", "Bilirubin up", "RUQ pain or fever"],
        interpretation: "Think obstruction or infection rather than simple transaminitis.",
        firstAction: "Escalate source-control concern and sepsis assessment.",
      },
      {
        title: "Synthetic failure pattern",
        pattern: ["INR up", "Albumin low", "Confusion or bleeding"],
        interpretation: "The liver is failing its core work, not just inflamed.",
        firstAction: "Prioritize safety, bleeding risk, and urgent reassessment.",
      },
    ],
    priorityDecisionMaking: [
      "Airway, mental status, and bleeding risk outrank the curiosity of explaining every chemistry abnormality immediately.",
      "The sickest liver patient is often the one with worsening INR, glucose, or mentation rather than the highest AST.",
    ],
    microScenarios: [
      {
        title: "Encephalopathy progression",
        stem: "A cirrhosis patient becomes increasingly drowsy and misses lactulose doses because of poor intake.",
        findings: ["Ammonia rising", "INR elevated", "Asterixis present"],
        question: "Which finding changes priority most?",
        answer: "The worsening mental status and safety risk.",
        rationale: "Encephalopathy changes airway protection, fall risk, and urgency more than the lab number alone.",
      },
    ],
    tierFocus: {
      rn: ["Differentiate injury versus failure versus obstruction and tie those patterns to bedside escalation.", "Use mental-status changes and bleeding risk as priority cues."],
      pn: ["Recognize encephalopathy, jaundice, and bleeding red flags quickly and report trend changes.", "Keep bowel-regimen and safety monitoring practical and concrete."],
      np: ["Integrate synthetic function, differential diagnosis, toxin history, and source-control reasoning.", "Use pattern recognition to prioritize consults and level-of-care decisions."],
      allied: ["Allied learners focus on role-relevant red flags, specimen interpretation context, and safe escalation when liver dysfunction affects therapy tolerance."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "liver",
  },
  {
    slug: "hemoglobin-wbc-platelet-cbc-patterns",
    category: "hematology",
    title: "Hemoglobin, WBCs, and Platelets: CBC Pattern Recognition for Bleeding, Infection, and Marrow Stress",
    shortTitle: "CBC patterns",
    description: "Use CBC trends to recognize hemorrhage, infection, immunosuppression, and marrow suppression with next-step thinking.",
    freePreviewBlurb:
      "CBC interpretation becomes premium when you stop asking 'is it high or low?' and start asking 'what risk did this trend just create?'",
    normalRange: "Ranges vary; common adult anchors are Hgb about 120-160 g/L, WBC 4-11 x10^9/L, platelets 150-400 x10^9/L.",
    physiology: [
      "Hemoglobin reflects oxygen-carrying capacity and recent bleeding or dilution context.",
      "WBC count reflects immune activation or suppression, but the differential and clinical picture matter.",
      "Platelets support primary hemostasis; the patient can bleed before the count hits zero if function is impaired.",
    ],
    causesHigh: [
      "Hemoconcentration, polycythemia, inflammation/steroid effect, thrombocytosis",
      "Stress response or infection can raise WBCs",
    ],
    causesLow: [
      "Bleeding, dilution, marrow suppression, hemolysis, chronic disease, chemotherapy",
      "Neutropenia from chemotherapy, marrow disease, or severe infection",
      "Thrombocytopenia from sepsis, HIT, DIC, liver disease, or immune destruction",
    ],
    signsSymptoms: [
      "Pallor, dyspnea, tachycardia, dizziness, fatigue",
      "Fever, rigors, hypotension, wound changes, or sepsis clues",
      "Petechiae, bruising, mucosal bleeding, or oozing from lines",
    ],
    priorityThresholds: [
      {
        label: "Neutropenic risk",
        threshold: "Very low neutrophil count with fever or infection signs",
        whyItMatters: "Neutropenic fever is a time-sensitive sepsis problem.",
      },
      {
        label: "Platelet bleeding risk",
        threshold: "Marked thrombocytopenia or active bleeding",
        whyItMatters: "The count must be interpreted with symptoms and planned procedures.",
      },
    ],
    nursingInterventions: [
      "Trend CBC with vitals, bleeding signs, oxygen needs, and infection symptoms.",
      "Protect neutropenic patients from exposure risk and escalate fever urgently.",
      "Use bleeding precautions and medication review when platelets are low.",
      "Assess whether a falling hemoglobin reflects bleeding, dilution, or chronic baseline disease.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Decide whether the CBC points most strongly to bleeding, infection, or marrow suppression.", why: "The nursing priorities diverge quickly after that fork." },
      { step: "2", action: "Pair the count with symptoms and trend.", why: "A dramatic drop over hours matters more than a chronic stable abnormality." },
      { step: "3", action: "Apply the safety bundle: bleeding precautions, sepsis escalation, or oxygen/perfusion support.", why: "Protect the patient while definitive treatment is arranged." },
      { step: "4", action: "Review culprit medications and recent therapies.", why: "Chemo, anticoagulants, antiplatelets, and linezolid can explain and worsen the pattern." },
      { step: "5", action: "Trend repeat CBC after intervention or deterioration.", why: "Direction of change drives whether the plan is working." },
    ],
    medicationsAffecting: [
      "Chemotherapy, immunosuppressants, anticoagulants, antiplatelets, steroids",
      "Heparin when HIT is in the differential",
    ],
    labConditionRelationships: [
      "Falling hemoglobin with melena points toward GI bleeding until proven otherwise.",
      "WBC elevation after steroids is not the same as septic shock with bandemia and lactate rise.",
      "Platelet drop plus thrombosis concern on heparin raises HIT, not just bleeding risk.",
    ],
    clinicalPearls: [
      "The most dangerous CBC change is often the trend with symptoms, not the absolute value alone.",
      "A normal hemoglobin early in acute bleeding does not rule out major blood loss.",
      "WBC counts can look 'better' while the patient clinically worsens; always pair the lab with perfusion and infection cues.",
    ],
    clientEducation: [
      "Teach bleeding precautions, infection reporting, and when fatigue or shortness of breath needs urgent assessment.",
      "Review medication risks and follow-up lab schedules after chemotherapy or anticoagulant changes.",
    ],
    nclexTraps: [
      "Ignoring symptomatic anemia because the value is only mildly low",
      "Missing neutropenic fever urgency",
      "Treating low platelets as a bleeding-only problem when HIT or DIC is possible",
    ],
    trendInterpretation: [
      "Hemoglobin drifting down after fluids may be dilutional, but the bedside exam decides whether hidden bleeding is more likely.",
      "A WBC count falling while blood pressure worsens does not reassure in sepsis.",
      "Platelets dropping daily on heparin should trigger pattern review, not passive observation.",
    ],
    patternRecognition: [
      {
        title: "Bleeding pattern",
        pattern: ["Hemoglobin down", "Tachycardia", "Melena or drain output rising"],
        interpretation: "Assume active or recent blood loss until proven otherwise.",
        firstAction: "Escalate perfusion assessment and bleeding source concern.",
      },
      {
        title: "Neutropenic fever pattern",
        pattern: ["Low neutrophils", "Temperature elevation", "Mucositis or recent chemo"],
        interpretation: "Time-sensitive infection response problem.",
        firstAction: "Prioritize sepsis workflow and protective measures.",
      },
    ],
    priorityDecisionMaking: [
      "Treat symptomatic anemia, infection risk, and bleeding risk as physiologic problems, not abstract CBC abnormalities.",
      "When platelets fall plus thrombosis signs appear, broaden beyond 'bleeding precautions only.'",
    ],
    microScenarios: [
      {
        title: "Chemo patient with fever",
        stem: "A patient receiving chemotherapy reports chills and oral ulcers.",
        findings: ["WBC low", "Neutrophils critically low", "Temp 38.4 C"],
        question: "What is the priority interpretation?",
        answer: "This is neutropenic fever until proven otherwise.",
        rationale: "The combination of fever and severe neutropenia is a sepsis-level escalation pattern.",
      },
    ],
    tierFocus: {
      rn: ["Use CBC trends to decide whether the danger is perfusion loss, infection, or bleeding.", "Connect the count to concrete precautions and escalation."],
      pn: ["Recognize symptom-plus-count combinations that require rapid reporting and protective care.", "Keep the framework centered on anemia, infection, and bleeding."],
      np: ["Differentiate dilution, occult bleeding, marrow failure, immune destruction, and treatment effect with diagnostic reasoning.", "Use CBC patterns to guide consult urgency and broader workup."],
      allied: ["Laboratory allied roles emphasize CBC pattern integrity and critical-value communication; rehab and respiratory allied roles focus on fatigue, oxygenation, and bleeding precautions relevant to therapy."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "hematology",
  },
  {
    slug: "inr-aptt-coagulation-escalation",
    category: "coagulation",
    title: "INR, aPTT, and Coagulation Escalation: Anticoagulants, Bleeding Risk, and DIC Patterns",
    shortTitle: "Coagulation studies",
    description: "Interpret INR and aPTT with bleeding assessment, anticoagulant context, and clotting/bleeding paradoxes.",
    freePreviewBlurb:
      "Coagulation studies matter when you can tell whether the patient is over-anticoagulated, consumptive, or actively clotting and bleeding at once.",
    normalRange: "INR about 0.8-1.2 off warfarin; therapeutic goals vary. aPTT commonly around 25-35 seconds off heparin.",
    physiology: [
      "INR reflects extrinsic/common pathway effect and is used most often to trend warfarin.",
      "aPTT trends intrinsic/common pathway effect and is commonly used with unfractionated heparin.",
      "Abnormal values without symptoms matter differently than abnormal values with active bleeding, thrombosis, or planned procedures.",
    ],
    causesHigh: [
      "Warfarin effect, liver disease, vitamin K deficiency, DIC, factor deficiency",
      "Heparin effect, lupus anticoagulant, DIC, severe illness",
    ],
    causesLow: [
      "Subtherapeutic anticoagulation or recovery from over-anticoagulation",
      "Low/normal studies do not exclude thrombosis in the right context",
    ],
    signsSymptoms: [
      "Hematuria, melena, oozing, bruising, epistaxis, hypotension",
      "Thrombosis signs despite abnormal coagulation numbers in HIT or DIC-like states",
    ],
    priorityThresholds: [
      {
        label: "Bleeding emergency",
        threshold: "Active bleeding with markedly abnormal coagulation or hemodynamic instability",
        whyItMatters: "Management priorities shift to bleeding control and reversal planning.",
      },
      {
        label: "Consumptive coagulopathy concern",
        threshold: "Bleeding + thrombosis signs + platelets falling",
        whyItMatters: "DIC/HIT-type patterns are not solved by one lab alone.",
      },
    ],
    nursingInterventions: [
      "Assess for actual bleeding and hemodynamic change before reacting to the lab in isolation.",
      "Review anticoagulant timing, recent dose changes, liver function, and planned procedures.",
      "Use bleeding precautions, line checks, and medication holds per orders and protocol.",
      "Escalate paradox patterns: abnormal coagulation plus thrombosis concern or falling platelets.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Identify whether the patient is bleeding, clotting, both, or neither.", why: "The value alone does not tell you the emergency." },
      { step: "2", action: "Match the test to the drug: INR with warfarin context, aPTT with heparin context.", why: "Misreading the pairing leads to wrong action." },
      { step: "3", action: "Escalate active bleeding or major procedure conflict immediately.", why: "Time matters when reversal or blood products may be needed." },
      { step: "4", action: "Look for broader patterns: platelets, fibrinogen, D-dimer, liver function.", why: "Consumptive states need pattern recognition." },
      { step: "5", action: "Trend repeat labs after intervention.", why: "Correction direction is part of the response assessment." },
    ],
    medicationsAffecting: [
      "Warfarin, heparin, DOACs, antibiotics that alter vitamin K balance, liver-toxic therapies",
    ],
    labConditionRelationships: [
      "Falling platelets with heparin exposure pushes HIT into the differential even when bleeding is absent.",
      "DIC often combines abnormal PT/aPTT, low fibrinogen, high D-dimer, and clinical instability.",
      "Liver failure can prolong INR because synthesis is failing, not because the patient is therapeutically anticoagulated.",
    ],
    clinicalPearls: [
      "A very high INR without bleeding is not the same emergency as a smaller INR rise with active GI hemorrhage.",
      "Platelet count changes can matter more than INR alone when the pattern suggests HIT or DIC.",
    ],
    clientEducation: [
      "Review anticoagulant adherence, bleeding signs, fall precautions, and medication interactions.",
      "Teach when INR follow-up or dose changes are urgent.",
    ],
    nclexTraps: [
      "Using INR to judge heparin infusion effect",
      "Focusing only on bleeding when the pattern suggests HIT",
      "Ignoring procedure/safety implications of abnormal studies",
    ],
    trendInterpretation: [
      "Rising INR after antibiotic change may reflect warfarin interaction and needs med reconciliation.",
      "aPTT overshoot with new bleeding changes urgency from routine titration to active complication management.",
      "Platelets falling while aPTT is therapeutic still requires HIT pattern review.",
    ],
    patternRecognition: [
      {
        title: "Warfarin overshoot pattern",
        pattern: ["INR climbing", "Medication or diet change", "Bleeding signs emerging"],
        interpretation: "Excess anticoagulant effect with real bedside consequence.",
        firstAction: "Escalate bleeding assessment and review reversal/treatment pathway.",
      },
      {
        title: "Consumptive pattern",
        pattern: ["PT/aPTT prolonged", "Platelets low", "Clinical bleeding or thrombosis"],
        interpretation: "Think DIC or severe systemic illness pattern.",
        firstAction: "Escalate broad critical-illness response, not just a single med hold.",
      },
    ],
    priorityDecisionMaking: [
      "Active bleeding always outranks a question about whether the lab is slightly above target.",
      "Coagulation values must be interpreted in drug context and with platelets/fibrinogen when the patient is crashing.",
    ],
    microScenarios: [
      {
        title: "Heparin patient with new clotting concern",
        stem: "A patient on heparin develops unilateral leg swelling while platelets have fallen sharply over three days.",
        findings: ["aPTT therapeutic", "Platelets down", "No major bleeding"],
        question: "What is the priority interpretation?",
        answer: "Therapeutic aPTT does not rule out HIT-related thrombosis.",
        rationale: "The pattern is clotting plus platelet fall, not simple over-anticoagulation.",
      },
    ],
    tierFocus: {
      rn: ["Match test-to-drug correctly and escalate the bedside bleeding/clotting picture.", "Use platelet trend and symptoms to avoid tunnel vision."],
      pn: ["Recognize bleeding precautions, active bleeding red flags, and when abnormal studies need rapid reporting.", "Keep the drug-context pairing simple and reliable."],
      np: ["Differentiate drug effect from liver failure, DIC, HIT, and procedure-related risk.", "Use broader lab patterns for advanced diagnostic reasoning."],
      allied: ["Allied learners focus on role-specific bleeding safety and critical-value communication; lab allied roles emphasize pattern integrity and escalation context."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "coagulation",
  },
  {
    slug: "troponin-bnp-cardiac-lab-patterns",
    category: "cardiac",
    title: "Troponin and BNP Patterns: Myocardial Injury, Strain, and Cardiac Escalation",
    shortTitle: "Troponin and BNP",
    description: "Interpret cardiac biomarkers with symptoms, ECG, hemodynamics, and heart-failure presentation.",
    freePreviewBlurb:
      "A cardiac biomarker is only as useful as your ability to place it beside the ECG, oxygenation, and volume story in front of you.",
    normalRange: "Assay-specific troponin cutoffs vary; BNP/NT-proBNP interpretation depends on age, renal function, and chronic baseline.",
    physiology: [
      "Troponin signals myocardial cell injury, but the cause may be plaque rupture, demand ischemia, myocarditis, or severe strain.",
      "BNP reflects ventricular stretch and volume/pressure burden rather than ischemia directly.",
      "The biomarker trend matters more than a single isolated number copied without context.",
    ],
    causesHigh: [
      "Acute coronary syndrome, tachyarrhythmia, sepsis, PE, myocarditis, renal failure",
      "Heart failure exacerbation, renal impairment, pulmonary hypertension, volume overload",
    ],
    causesLow: [
      "Low or negative values can still be early in an event depending on timing and assay sensitivity.",
    ],
    signsSymptoms: [
      "Chest pain, diaphoresis, dyspnea, orthopnea, edema, hypotension, new crackles",
      "ECG changes, rising oxygen needs, or new arrhythmias",
    ],
    priorityThresholds: [
      {
        label: "Ischemia concern",
        threshold: "Troponin rise/fall pattern with symptoms or ECG change",
        whyItMatters: "The dynamic pattern plus presentation raises acute coronary concern.",
      },
      {
        label: "Decompensated HF concern",
        threshold: "BNP elevation with pulmonary edema, hypoxia, or worsening perfusion",
        whyItMatters: "The biomarker supports the clinical picture but the respiratory/hemodynamic status drives urgency.",
      },
    ],
    nursingInterventions: [
      "Correlate biomarkers with chest pain timing, ECG findings, oxygenation, and volume status.",
      "Trend repeat troponins rather than declaring the story from one value.",
      "Use BNP as support for fluid/strain assessment, not a stand-alone diagnosis.",
      "Escalate new ischemic symptoms, pulmonary edema, hypotension, or dysrhythmia promptly.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Assess symptoms, ECG, vitals, and perfusion with the biomarker.", why: "The number without the bedside picture cannot tell you urgency alone." },
      { step: "2", action: "Trend serial troponin or BNP when ordered.", why: "Dynamic change helps separate evolving injury from chronic elevation." },
      { step: "3", action: "Treat the unstable physiology: oxygenation failure, shock, dysrhythmia, pulmonary edema.", why: "That determines immediate nursing action." },
      { step: "4", action: "Review confounders such as renal disease, sepsis, or chronic heart failure baseline.", why: "Not every elevated value means the same mechanism." },
      { step: "5", action: "Link the trend to response after diuresis, reperfusion, or supportive therapy.", why: "Cardiac labs are one piece of the treatment-response story." },
    ],
    medicationsAffecting: [
      "Diuretics, nitrates, anticoagulants, antiplatelets, inotropes, beta-blockers",
    ],
    labConditionRelationships: [
      "A rising troponin with tachyarrhythmia and sepsis may reflect demand injury, but still marks higher risk.",
      "BNP helps support fluid-overload reasoning but cannot replace the lung exam and weight trend.",
      "Renal dysfunction can chronically elevate both troponin and BNP, making trend and symptoms crucial.",
    ],
    clinicalPearls: [
      "Serial change plus symptoms is more actionable than an isolated mildly positive troponin.",
      "A very high BNP without acute dyspnea is not the same urgency as a moderate BNP with flash pulmonary edema.",
    ],
    clientEducation: [
      "Teach symptom reporting, sodium/fluid guidance when applicable, and when chest pain or worsening dyspnea is urgent.",
    ],
    nclexTraps: [
      "Equating BNP with MI diagnosis",
      "Ignoring ECG and symptom timing when troponin is elevated",
      "Treating chronic elevation as if it always proves a new infarct",
    ],
    trendInterpretation: [
      "Troponin rising over serial draws with ongoing symptoms supports evolving injury even if the first value was modest.",
      "BNP down-trending after diuresis supports improving ventricular stretch, especially when dyspnea and weight also improve.",
      "Persistent troponin elevation without dynamic rise/fall in CKD needs symptom/ECG context before overcalling ACS.",
    ],
    patternRecognition: [
      {
        title: "ACS pattern",
        pattern: ["Chest pain", "Dynamic troponin rise", "ECG ischemic changes"],
        interpretation: "High concern for acute coronary injury pattern.",
        firstAction: "Escalate ACS pathway and continuous monitoring.",
      },
      {
        title: "HF strain pattern",
        pattern: ["Dyspnea/orthopnea", "High BNP", "Crackles and edema"],
        interpretation: "Cardiac stretch/volume overload pattern.",
        firstAction: "Prioritize oxygenation, fluid-balance strategy, and reassessment.",
      },
    ],
    priorityDecisionMaking: [
      "Unstable oxygenation or perfusion beats a theoretical debate about the exact biomarker cause.",
      "Use serial troponin and ECG together before deciding whether the injury is evolving.",
    ],
    microScenarios: [
      {
        title: "Dyspnea after missed diuretics",
        stem: "A patient with known HF presents with orthopnea and leg edema after several days without medications.",
        findings: ["BNP elevated", "O2 sat falling", "Crackles present"],
        question: "What matters most right now?",
        answer: "The decompensated volume/oxygenation picture.",
        rationale: "BNP supports the diagnosis, but the immediate priority is the respiratory and perfusion burden.",
      },
    ],
    tierFocus: {
      rn: ["Connect biomarkers to ECG, symptoms, oxygenation, and fluid status.", "Use serial trend logic instead of single-value overcalls."],
      pn: ["Recognize chest pain, dyspnea, edema, and when cardiac-lab changes need urgent reporting.", "Keep the framework centered on ischemia versus fluid-overload patterns."],
      np: ["Differentiate ACS, demand injury, myocarditis, HF strain, PE, and CKD confounding with serial interpretation.", "Use biomarker patterns to sharpen diagnostic reasoning and urgency."],
      allied: ["Respiratory, paramedic, and cardiac allied learners use these labs to support ECG and perfusion interpretation within their care role."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "cardiac-labs",
  },
  {
    slug: "abg-interpretation-priority-ladder",
    category: "abgs",
    title: "ABG Interpretation Priority Ladder: Ventilation, Oxygenation, Compensation, and First Action",
    shortTitle: "ABG interpretation",
    description: "A full ABG decision engine for acid-base pattern recognition, compensation logic, and bedside escalation.",
    freePreviewBlurb:
      "ABGs become premium when the learner can move from numbers to airway, ventilation, oxygenation, and cause-based action in one sequence.",
    normalRange: "pH 7.35-7.45, PaCO2 35-45 mm Hg, HCO3 22-26 mmol/L, PaO2 roughly 80-100 mm Hg on room air.",
    physiology: [
      "pH shows whether the patient is acidemic or alkalemic.",
      "PaCO2 reflects respiratory ventilation status; HCO3 reflects metabolic buffering.",
      "PaO2 and oxygenation clues must still be interpreted with the clinical setting, support device, and work of breathing.",
    ],
    causesHigh: [
      "High PaCO2: hypoventilation, fatigue, oversedation, COPD exacerbation",
      "High HCO3: compensation or metabolic alkalosis from diuretics/GI loss",
      "High lactate-linked anion-gap states often pair with metabolic acidosis patterns",
    ],
    causesLow: [
      "Low PaCO2: hyperventilation, anxiety, sepsis, pain, early hypoxia compensation",
      "Low HCO3: metabolic acidosis from DKA, sepsis, renal failure, diarrhea",
    ],
    signsSymptoms: [
      "Work of breathing, somnolence, confusion, cyanosis, tachypnea, accessory-muscle use",
      "Arrhythmia, hemodynamic instability, or exhaustion in severe acid-base disturbance",
    ],
    priorityThresholds: [
      {
        label: "Ventilatory failure",
        threshold: "Rising PaCO2 with drowsiness or worsening work of breathing",
        whyItMatters: "The airway/ventilation problem becomes the emergency before perfect acid-base naming.",
      },
      {
        label: "Severe acidemia",
        threshold: "pH trending down into unstable range with shock or dysrhythmia risk",
        whyItMatters: "Profound acidemia reduces perfusion response and destabilizes other systems.",
      },
    ],
    nursingInterventions: [
      "Use a stepwise ABG read: pH, PaCO2, HCO3, compensation, oxygenation, then cause and first action.",
      "Pair the gas with respiratory exam, support device, mental status, and hemodynamics.",
      "Escalate fatigue, rising CO2, and deteriorating mental status before waiting on a cleaner repeat gas.",
      "Trend serial ABGs only if they change management or confirm response to ventilation/oxygenation strategy.",
    ],
    treatmentAlgorithm: [
      { step: "1", action: "Decide acidemia vs alkalemia from the pH.", why: "This anchors the rest of the interpretation." },
      { step: "2", action: "Match the primary driver: PaCO2 for respiratory, HCO3 for metabolic.", why: "You need the main process before debating compensation." },
      { step: "3", action: "Assess oxygenation and work of breathing.", why: "The patient may be failing even if the pH looks partially compensated." },
      { step: "4", action: "Link the pattern to cause and first nursing action.", why: "ABGs are useful only when they change what you do next." },
      { step: "5", action: "Trend the response after support changes.", why: "ABGs help confirm whether ventilation or metabolic correction is working." },
    ],
    medicationsAffecting: [
      "Opioids, sedatives, bronchodilators, diuretics, insulin, bicarbonate therapy",
    ],
    labConditionRelationships: [
      "DKA gives metabolic acidosis with respiratory compensation until fatigue develops.",
      "COPD patients may live with compensated chronic respiratory acidosis; compare to baseline and mental status.",
      "Pulmonary edema can drive hypoxia first, then CO2 retention if fatigue sets in.",
    ],
    clinicalPearls: [
      "Name the life threat before naming the exact compensation pattern.",
      "A 'normal' pH can hide serious mixed or compensated disease if PaCO2 and HCO3 are both far off normal.",
      "The sick ABG is the one that matches a tiring, deteriorating patient, not always the most dramatic textbook number set.",
    ],
    clientEducation: [
      "Teach why oxygen, inhaler adherence, and follow-up matter differently in COPD, asthma, DKA, and heart failure.",
    ],
    nclexTraps: [
      "Stopping after labeling the acid-base disorder without deciding the first action",
      "Calling a compensated patient stable despite worsening work of breathing",
      "Ignoring oxygenation while focusing only on pH",
    ],
    trendInterpretation: [
      "Rising PaCO2 with falling pH after initial treatment suggests ventilation failure or fatigue.",
      "Improving pH with falling anion-gap cause treatment suggests metabolic correction, but reassess potassium and mental status.",
      "PaO2 improvement without work-of-breathing relief may still signal impending fatigue.",
    ],
    patternRecognition: [
      {
        title: "Respiratory acidosis pattern",
        pattern: ["pH low", "PaCO2 high", "Drowsy or tiring patient"],
        interpretation: "Ventilatory failure until proven otherwise.",
        firstAction: "Escalate airway/ventilation support and reassessment immediately.",
      },
      {
        title: "Metabolic acidosis with compensation",
        pattern: ["pH low", "HCO3 low", "PaCO2 low from compensatory hyperventilation"],
        interpretation: "Primary metabolic problem with respiratory compensation.",
        firstAction: "Treat the cause while monitoring for fatigue and potassium shifts.",
      },
    ],
    priorityDecisionMaking: [
      "Ventilation failure outranks elegant acid-base naming.",
      "Use the ABG to choose the next support step: oxygenation, ventilation, cause treatment, or escalation of all three.",
    ],
    microScenarios: [
      {
        title: "COPD fatigue",
        stem: "A COPD patient becomes more somnolent after initially improving on treatment.",
        findings: ["pH falling", "PaCO2 rising", "Work of breathing increasing"],
        question: "What changed in priority?",
        answer: "The patient is moving into ventilatory failure and needs urgent escalation.",
        rationale: "The trend and mentation matter more than simply recognizing chronic COPD context.",
      },
    ],
    tierFocus: {
      rn: ["Use a disciplined stepwise ladder that ends with a first action, not just an acid-base label.", "Tie ABGs to oxygenation and work of breathing every time."],
      pn: ["Recognize core respiratory versus metabolic patterns and when the patient needs rapid escalation.", "Keep interpretation concrete and bedside-focused."],
      np: ["Handle mixed disorders, compensation logic, and differential diagnosis with advanced respiratory reasoning.", "Use ABGs to guide broader diagnostic and treatment planning."],
      allied: ["Respiratory and paramedic learners use the full ABG ladder; other allied tracks see only route-relevant subset emphasis through supported-track filtering."],
    },
    supportedTracks: ["rn", "pn", "np", "allied"],
    practiceQuestionTopic: "abg",
  },
] as const;

function questionId(topic: LabLessonDefinition, type: LabQuestionType, suffix?: string) {
  return suffix ? `${topic.slug}:${type}:${suffix}` : `${topic.slug}:${type}`;
}

function scenarioStem(m: LabMicroScenario): string {
  return `${m.stem}\n\nFindings: ${m.findings.join("; ")}.\n\n${m.question}`;
}

function scenarioMcqOptions(topic: LabLessonDefinition, scenario: LabMicroScenario): string[] {
  const correct = scenario.answer;
  const traps = topic.nclexTraps.filter((t) => t.length > 0 && t !== correct);
  const wrong: string[] = [
    traps[0] ?? "Observe without reassessment because the charted value is only mildly abnormal.",
    traps[1] ?? "Wait for a repeat lab before any bedside priority decisions.",
    topic.priorityDecisionMaking.find((p) => p.length > 0 && p !== correct) ??
      "Treat the numeric reference interval as the sole determinant of urgency.",
  ];
  return [correct, wrong[0]!, wrong[1]!, wrong[2]!];
}

/** Illustrative pick-rate bands for teaching (not live exam analytics). */
function illustrativeAnswerDistribution(
  topic: LabLessonDefinition,
  options: string[],
  correctIndex: number,
): LabAnswerDistributionEntry[] {
  const wrongBands = ["18–24%", "14–20%", "8–12%"] as const;
  let wrongBandIdx = 0;
  return options.map((_, optionIndex) => {
    if (optionIndex === correctIndex) {
      return {
        optionIndex,
        shareBand: "34–42%",
        distractorRationale:
          "Strong performers integrate labs with perfusion, trend, medications, and the fastest-changing safety threat.",
      };
    }
    const band = wrongBands[wrongBandIdx % wrongBands.length]!;
    const trap = topic.nclexTraps[wrongBandIdx % Math.max(topic.nclexTraps.length, 1)]!;
    wrongBandIdx += 1;
    return {
      optionIndex,
      shareBand: band,
      distractorRationale: trap.length > 0 ? trap : "Classic prioritization trap: delays recognition of instability.",
    };
  });
}

function patternScenarioQuestion(topic: LabLessonDefinition, pattern = topic.patternRecognition[1] ?? topic.patternRecognition[0]!): LabQuestion {
  const stem = `A nurse is reviewing a patient whose presentation matches this pattern: ${pattern.pattern.join("; ")}. Which interpretation best drives next actions?`;
  const options = [
    pattern.interpretation,
    "The pattern is chronic and reassuring if any single value is near the reference range.",
    "This is too nonspecific to report; wait for imaging before notifying the provider.",
    "The safest action is to repeat the lab tomorrow without changing monitoring frequency.",
  ];
  const correctIndex = 0;
  return {
    id: questionId(topic, "clinical_scenario", "pattern-vignette"),
    type: "clinical_scenario",
    difficulty: "intermediate",
    stem,
    options,
    correctIndex,
    isClinicalScenario: true,
    rationale: `${pattern.interpretation} First action mindset: ${pattern.firstAction}`,
    answerDistribution: illustrativeAnswerDistribution(topic, options, correctIndex),
  };
}

function buildQuestions(topic: LabLessonDefinition): LabQuestion[] {
  const [thresholdA, thresholdB] = topic.priorityThresholds;
  const firstScenario = topic.microScenarios[0]!;
  const secondScenario = topic.microScenarios[1];
  const firstPattern = topic.patternRecognition[0]!;

  const scenarioOneOptions = scenarioMcqOptions(topic, firstScenario);
  const scenarioOne: LabQuestion = {
    id: questionId(topic, "clinical_scenario", "vignette-a"),
    type: "clinical_scenario",
    difficulty: "intermediate",
    stem: scenarioStem(firstScenario),
    options: scenarioOneOptions,
    correctIndex: 0,
    isClinicalScenario: true,
    rationale: firstScenario.rationale,
    answerDistribution: illustrativeAnswerDistribution(topic, scenarioOneOptions, 0),
  };

  const scenarioTwoOptions = secondScenario ? scenarioMcqOptions(topic, secondScenario) : null;
  const scenarioTwo: LabQuestion = secondScenario
    ? {
        id: questionId(topic, "clinical_scenario", "vignette-b"),
        type: "clinical_scenario",
        difficulty: "advanced",
        stem: scenarioStem(secondScenario),
        options: scenarioTwoOptions!,
        correctIndex: 0,
        isClinicalScenario: true,
        rationale: secondScenario.rationale,
        answerDistribution: illustrativeAnswerDistribution(topic, scenarioTwoOptions!, 0),
      }
    : patternScenarioQuestion(topic);

  const prioritizationOptions = [
    `${thresholdA.label}: ${thresholdA.threshold}`,
    `${thresholdB.label}: ${thresholdB.threshold}`,
    "A mild abnormality without symptoms that is improving on repeat trend",
    "A chronic baseline abnormality with no change from prior results",
  ];
  const prioritization: LabQuestion = {
    id: questionId(topic, "prioritization"),
    type: "prioritization",
    difficulty: "advanced",
    stem: `Which finding requires the most urgent escalation in the ${topic.shortTitle.toLowerCase()} workflow?`,
    options: prioritizationOptions,
    correctIndex: 1,
    rationale: thresholdB.whyItMatters,
    answerDistribution: illustrativeAnswerDistribution(topic, prioritizationOptions, 1),
  };

  const trendOptions = [
    topic.trendInterpretation[0]!,
    "A single improved value always overrules worsening symptoms.",
    "Trend data matters less than whether the value is inside the reference range.",
    "Once a lab improves, related assessment findings no longer matter.",
  ];
  const trendQ: LabQuestion = {
    id: questionId(topic, "trend"),
    type: "trend",
    difficulty: "advanced",
    stem: `Which trend interpretation best fits ${topic.shortTitle.toLowerCase()} clinical reasoning?`,
    options: trendOptions,
    correctIndex: 0,
    rationale: `Trend interpretation is central here: ${topic.trendInterpretation[0]}`,
    answerDistribution: illustrativeAnswerDistribution(topic, trendOptions, 0),
  };

  const patternOptions = [
    firstPattern.interpretation,
    "This pattern is too nonspecific to guide bedside priorities.",
    "The pattern is reassuring if the patient had one normal value earlier in the shift.",
    "This pattern should be ignored until imaging is completed.",
  ];
  const patternQ: LabQuestion = {
    id: questionId(topic, "pattern"),
    type: "pattern",
    difficulty: "advanced",
    stem: `A patient shows this pattern: ${firstPattern.pattern.join("; ")}. What is the best interpretation?`,
    options: patternOptions,
    correctIndex: 0,
    rationale: `${firstPattern.interpretation} The first nursing action is to ${firstPattern.firstAction.toLowerCase()}.`,
    answerDistribution: illustrativeAnswerDistribution(topic, patternOptions, 0),
  };

  const bridgeOptions = [
    `Match ${topic.shortTitle.toLowerCase()} to physiology, bedside findings, medications, and trend before choosing an action.`,
    `Interpret ${topic.shortTitle.toLowerCase()} in isolation from symptoms and trend.`,
    "Use the lab only after all vital signs are normal.",
    "Ignore medication effects unless the value is critical.",
  ];
  const bridgeQ: LabQuestion = {
    id: questionId(topic, "multiple_choice"),
    type: "multiple_choice",
    difficulty: "beginner",
    stem: `Which approach best reflects NCLEX-style prioritization for ${topic.shortTitle.toLowerCase()}?`,
    options: bridgeOptions,
    correctIndex: 0,
    rationale: `${topic.shortTitle} items reward linking labs to the fastest-changing patient threat, not memorizing a single reference interval.`,
    answerDistribution: illustrativeAnswerDistribution(topic, bridgeOptions, 0),
  };

  return [scenarioOne, scenarioTwo, prioritization, trendQ, patternQ, bridgeQ];
}

function buildFlashcards(topic: LabLessonDefinition): LabFlashcard[] {
  const firstThreshold = topic.priorityThresholds[0];
  const firstPearl = topic.clinicalPearls[0];
  return [
    {
      id: `${topic.slug}:range`,
      prompt: `${topic.shortTitle}: normal range`,
      answer: topic.normalRange,
      rationale: "Reference ranges anchor interpretation, but trend and symptoms determine urgency.",
    },
    {
      id: `${topic.slug}:physiology`,
      prompt: `${topic.shortTitle}: why it matters`,
      answer: topic.physiology[0]!,
      rationale: "Use the physiology sentence to orient every scenario quickly.",
    },
    {
      id: `${topic.slug}:urgent-threshold`,
      prompt: `${topic.shortTitle}: urgent threshold`,
      answer: `${firstThreshold.label} — ${firstThreshold.threshold}`,
      rationale: firstThreshold.whyItMatters,
    },
    {
      id: `${topic.slug}:algorithm`,
      prompt: `${topic.shortTitle}: first action mindset`,
      answer: topic.treatmentAlgorithm[0]!.action,
      rationale: topic.treatmentAlgorithm[0]!.why,
    },
    {
      id: `${topic.slug}:trap`,
      prompt: `${topic.shortTitle}: common NCLEX trap`,
      answer: topic.nclexTraps[0]!,
      rationale: "Trap-focused flashcards keep exam reasoning tied to patient safety.",
    },
    {
      id: `${topic.slug}:pearl`,
      prompt: `${topic.shortTitle}: clinical pearl`,
      answer: firstPearl,
      rationale: "This is the nuance learners tend to miss under exam pressure.",
    },
  ];
}

export function labTrackFromTier(tier: TierCode | null | undefined): LabTrack {
  switch (tier) {
    case TierCode.ALLIED:
      return "allied";
    case TierCode.NP:
      return "np";
    case TierCode.RPN:
    case TierCode.LVN_LPN:
      return "pn";
    default:
      return "rn";
  }
}

export function listLabLessonsForTrack(track: LabTrack): LabLessonDefinition[] {
  return LESSONS.filter((lesson) => lesson.supportedTracks.includes(track));
}

export function listLabCategoriesForTrack(track: LabTrack): Array<LabCategoryDefinition & { lessons: LabLessonDefinition[] }> {
  const lessons = listLabLessonsForTrack(track);
  return LABS_CATEGORIES.map((category) => ({
    ...category,
    lessons: lessons.filter((lesson) => lesson.category === category.slug),
  })).filter((category) => category.lessons.length > 0);
}

export function getLabLessonByCategoryAndSlug(
  category: LabCategorySlug,
  slug: string,
  track: LabTrack,
): LabLessonDefinition | null {
  return listLabLessonsForTrack(track).find((lesson) => lesson.category === category && lesson.slug === slug) ?? null;
}

export function getLabLessonBySlug(slug: string, track: LabTrack): LabLessonDefinition | null {
  return listLabLessonsForTrack(track).find((lesson) => lesson.slug === slug) ?? null;
}

export function getLabLessonQuestions(topic: LabLessonDefinition): LabQuestion[] {
  return buildQuestions(topic);
}

export function getLabLessonFlashcards(topic: LabLessonDefinition): LabFlashcard[] {
  return buildFlashcards(topic);
}

export function buildLabsStudyLinks(pathwayId: string | null, topicCode: string | null = null): LabsStudyLinks {
  const trimmedPathway = pathwayId?.trim() || null;
  const topic = topicCode?.trim() || null;
  const flashcardsHref = trimmedPathway ? pathwayHubAppFlashcardsHref(trimmedPathway, topic) : "/app/flashcards";
  const questionBankHref = trimmedPathway ? pathwayHubAppQuestionsHref(trimmedPathway, topic ?? undefined) : "/app/questions";
  const practiceTestsTopicHref =
    trimmedPathway && topic ? buildAppPracticeTestsTopicHref(trimmedPathway, topic) : "/app/practice-tests";
  const lessonsHubHref = trimmedPathway
    ? `/app/lessons?pathwayId=${encodeURIComponent(trimmedPathway)}${topic ? `&topicSlug=${encodeURIComponent(topic)}` : ""}`
    : "/app/lessons";
  const catLaunchHref = trimmedPathway ? appPathwayCatSessionStartPath(trimmedPathway) : "/app/practice-tests/start";
  const catHref = resolveStudySurfaceCatHref({
    pathwayId: trimmedPathway,
    availablePathwayIds: trimmedPathway ? [trimmedPathway] : [],
    topic,
    preferWeakFocus: true,
  });
  const labDrillsHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.labDrills, trimmedPathway);
  return {
    flashcardsHref,
    questionBankHref,
    practiceTestsTopicHref,
    lessonsHubHref,
    catLaunchHref,
    catHref,
    labDrillsHref,
  };
}

export function countLabsInventoryForTrack(track: LabTrack) {
  const lessons = listLabLessonsForTrack(track);
  const questionCount = lessons.reduce((sum, lesson) => sum + getLabLessonQuestions(lesson).length, 0);
  const flashcardCount = lessons.reduce((sum, lesson) => sum + getLabLessonFlashcards(lesson).length, 0);
  return {
    lessonCount: lessons.length,
    questionCount,
    flashcardCount,
    categoryCount: listLabCategoriesForTrack(track).length,
  };
}
