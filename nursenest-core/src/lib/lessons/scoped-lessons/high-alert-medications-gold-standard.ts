/**
 * High-alert medication safety — insulin, anticoagulants, opioids (nursing judgment, not prescribing).
 * Remediation wave 1: pharmacological_therapies breadth + medication_bundle alignment.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const HIGH_ALERT_MEDS_GOLD_SLUG = "high-alert-medications-safety-gold" as const;

type HamVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, HamVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**High-alert medication themes**  
Exams love **insulin** (decimal errors, sliding scale vs correction, hypoglycemia recognition), **anticoagulants** (bleeding, reversal concepts as nursing monitoring, labs), and **opioids** (respiratory depression, sedation, naloxone when ordered/protocol).

**Safety moves**  
• **Five rights** + **independent double-checks** when policy requires.  
• **Trend glucose** with symptoms, not a single number in isolation.  
• **Pain/sedation/respiratory rate** together for opioids.  
• **Bleeding cues** + **neuro checks** with anticoagulation.  
• **Hold and clarify** ambiguous orders; **escalate** rather than guess.

**Scope**  
Teach **within your role**: RNs carry broader assessment authority; PNs/RPNs reinforce teaching, administer per order, observe/report; NPs integrate prescribing where items allow—still emphasize **monitoring** and **patient education**.`;

function pack(
  variant: HamVariant,
  meta: {
    title: string;
    seoTitle: string;
    seoDescription: string;
    clinical_meaning: string;
    exam_relevance: string;
    clinical_scenario: string;
    takeaways: string;
  },
  quizzes: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] },
) {
  return { variant, ...meta, quizzes };
}

const VARIANTS: Record<HamVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "High-alert meds: insulin, anticoagulants, opioids (NCLEX-PN, US)",
      seoTitle: "High-alert medications | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: hypoglycemia, bleeding cues, opioid respiratory depression—observe, act within scope, escalate.",
      clinical_meaning: `**PN responsibilities**  
Administer **as ordered**, **verify** with policy checks, **teach** basics (symptoms, timing, device use), and **report** abnormal glucose, bleeding, or respiratory depression. Do **not** invent dose changes.`,
      exam_relevance: `Traps: **giving insulin** without confirming **correct client/order**, **ignoring shakiness + tachycardia**, **sedating** respiratory depression, or **hiding bleeding**.`,
      clinical_scenario: `**Vignette**  
Insulin due; client **diaphoretic**, **HR 112**, **glucose 54 mg/dL** per POC.

**Fork**  
Treat **hypoglycemia per protocol/order** (e.g., fast carbs, recheck), **stay with client**, **notify RN**—not routine insulin administration.`,
      takeaways: `• **Hypoglycemia before hyperglycemia** when symptoms present.  
• **Bleeding + anticoagulation** → protect, pressure, notify, monitor.  
• **Opioids**: RR, sedation, SpO₂—escalate if pattern worsens.`,
    },
    {
      preTest: [
        {
          question: "Before insulin, what must the PN verify at minimum?",
          options: [
            "Only the room color.",
            "Right client, order, dose, time, route, and appropriate blood glucose when required by policy.",
            "Another client’s wristband.",
            "Expiration date of the nurse’s lunch.",
          ],
          correct: 1,
          rationale: "Medication safety checks prevent wrong-patient and wrong-dose errors.",
        },
        {
          question: "Client on opioids becomes bradypneic and hard to arouse. First priority?",
          options: [
            "Give another opioid PRN without assessment.",
            "Follow emergency protocol: airway/support, notify RN, prepare for naloxone if ordered.",
            "Encourage coffee only.",
            "Leave the room.",
          ],
          correct: 1,
          rationale: "Respiratory depression is life-threatening; follow protocol and escalate.",
        },
        {
          question: "Which finding should be reported immediately for a client on anticoagulation?",
          options: [
            "Stable INR without bleeding.",
            "Sudden severe headache with neuro change.",
            "Finished lunch tray.",
            "Watching TV calmly.",
          ],
          correct: 1,
          rationale: "Possible intracranial bleed is an emergency.",
        },
      ],
      postTest: [
        {
          question: "Why are trailing zeros risky in insulin dosing?",
          options: [
            "They never matter.",
            "They can cause tenfold dosing errors if misread.",
            "They improve readability always.",
            "They are required always.",
          ],
          correct: 1,
          rationale: "Decimal placement errors are a classic insulin harm pattern.",
        },
        {
          question: "Client refuses insulin after eating. Best action?",
          options: [
            "Force injection.",
            "Assess reason, check glucose per policy, notify RN for order clarification.",
            "Give double dose later secretly.",
            "Ignore refusal.",
          ],
          correct: 1,
          rationale: "Assessment, autonomy, and collaboration preserve safety.",
        },
        {
          question: "Teaching for opioid safety at home should include:",
          options: [
            "Never take with alcohol or other sedatives unless cleared by the clinician.",
            "Double dose if pain returns early.",
            "Stop breathing exercises.",
            "Ignore constipation.",
          ],
          correct: 0,
          rationale: "Sedative stacking increases overdose risk; teach follow-up for bowel regimen and prescribed use.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "High-alert meds: insulin, anticoagulants, opioids (REx-PN, Canada)",
      seoTitle: "High-alert medications | REx-PN Canada | NurseNest",
      seoDescription: "Canadian PN: metric glucose, college scope, bleeding and respiratory monitoring, collaboration.",
      clinical_meaning: `**RPN**  
Use **metric units** in stems (mmol/L glucose). Same safety spine: **verify**, **monitor**, **report**, **escalate**. Canadian items still punish **silent hypoglycemia**, **hidden bleeding** on anticoagulation, and **opioid sedation**—choose **assessment + collaboration** over **routine tasks** when risk is unequal.`,
      exam_relevance: `Traps mirror US PN with **Canadian documentation** language: **scheduled dressing** versus **acute change**, **charting** versus **respiratory depression**, and **client requests** versus **objective instability**. Read **SI glucose** carefully before choosing insulin actions.`,
      clinical_scenario: `**Vignette**  
Glucose **3.1 mmol/L** with **diaphoresis**, **tremor**, and **confusion**; client is on basal bolus insulin per order.

**Fork**  
Hypoglycemia treatment per protocol + RN notification. Do **not** administer scheduled insulin while hypoglycemia is untreated unless the stem explicitly directs a coordinated plan; prioritize **fast carbs / glucagon per order**, **recheck**, and **continuous observation**.`,
      takeaways: `• Convert reasoning to **SI** when the stem uses it—do not mentally “translate” into mg/dL incorrectly under time pressure.  
• **Never minimize** neuro changes on anticoagulation: sudden headache or focal deficits need urgent escalation.  
• **Opioids + sedation + low RR** outrank non-urgent comfort tasks.`,
    },
    {
      preTest: [
        {
          question: "Which glucose (mmol/L) is generally hypoglycemic territory on exams?",
          options: [
            "15 mmol/L.",
            "Below ~4 (confirm institutional thresholds in the stem).",
            "10 mmol/L always normal.",
            "20 mmol/L always fine.",
          ],
          correct: 1,
          rationale: "Typical teaching uses ~4 mmol/L as low threshold unless stem specifies otherwise.",
        },
        {
          question: "RPN notes gum bleeding and large bruises on warfarin. Action?",
          options: [
            "Ignore.",
            "Report promptly and monitor for further bleeding per orders.",
            "Stop all meds independently.",
            "Tell client to exercise vigorously.",
          ],
          correct: 1,
          rationale: "Bleeding escalation on anticoagulation needs provider evaluation.",
        },
        {
          question: "Which is a sign of opioid toxicity?",
          options: [
            "RR 16, alert, comfortable.",
            "RR 6, pinpoint pupils, difficult to arouse.",
            "Mild itch without sedation change.",
            "Stable gait.",
          ],
          correct: 1,
          rationale: "Bradypnea with altered arousal suggests toxicity.",
        },
      ],
      postTest: [
        {
          question: "Why teach clients to use a single consistent insulin concentration?",
          options: [
            "To confuse them.",
            "To prevent U-100 vs U-500 type errors.",
            "Concentration never matters.",
            "So they buy cheaper insulin illegally.",
          ],
          correct: 1,
          rationale: "Concentration errors cause catastrophic overdoses.",
        },
        {
          question: "Client on heparin has sudden leg swelling and pain. Best response?",
          options: [
            "Massage the calf vigorously.",
            "Stop and report—consider DVT/PE risk and follow orders.",
            "Ignore as muscle cramp always.",
            "Heat packs only.",
          ],
          correct: 1,
          rationale: "Unilateral swelling with pain needs urgent evaluation; massage can dislodge clots.",
        },
        {
          question: "Medication reconciliation purpose?",
          options: [
            "Increase polypharmacy.",
            "Reduce omissions, duplications, and interactions across transitions.",
            "Replace provider judgment.",
            "Eliminate teaching.",
          ],
          correct: 1,
          rationale: "Reconciliation improves safety at handoffs.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "High-alert meds: nursing management (NCLEX-RN, US)",
      seoTitle: "High-alert medications | NCLEX-RN US | NurseNest",
      seoDescription: "NCLEX-RN: insulin safety, anticoag monitoring, opioid toxicity, reversal concepts, delegation.",
      clinical_meaning: `**RN**  
You **assess**, **interpret trends**, **administer**, **evaluate response**, and **delegate** appropriate monitoring. Know **hypoglycemia/hyperglycemia** forks, **bleeding scales**, and **opioid sedation scales** when stems include them.`,
      exam_relevance: `Prioritize **ABC** with opioid toxicity, **glucose checks** with neuro symptoms on insulin, and **neuro checks** with anticoagulation + headache.`,
      clinical_scenario: `**Vignette**  
Post-op PCA: **RR 8**, **SpO₂ 89%**, **hard to arouse**.

**Fork**  
Stop bolus demand if applicable, **support airway**, **notify provider**, **naloxone per order/protocol**—before routine dressing.`,
      takeaways: `• **Respiratory depression** is an emergency.  
• **Independent double-check** insulin when required.`,
    },
    {
      preTest: [
        {
          question: "Which assessment is priority before giving insulin?",
          options: [
            "Nail polish color.",
            "Blood glucose when protocol requires and order verification.",
            "Patient’s favorite food only.",
            "Room temperature only.",
          ],
          correct: 1,
          rationale: "Glucose verification prevents inappropriate dosing in hypoglycemia.",
        },
        {
          question: "Client on heparin drip has black stools. Priority?",
          options: [
            "Continue drip silently.",
            "Assess, notify provider, anticipate hold/order changes, monitor hemodynamics per orders.",
            "Give NSAIDs PRN without asking.",
            "Increase rate independently.",
          ],
          correct: 1,
          rationale: "GI bleeding on anticoagulation requires urgent evaluation and order changes.",
        },
        {
          question: "Which client should the RN medicate first?",
          options: [
            "Stable client due for vitamin.",
            "Client with RR 7 after opioid dose who is bradypneic and hypoxic.",
            "Client reading.",
            "Client asking for ice chips, stable.",
          ],
          correct: 1,
          rationale: "Opioid-induced respiratory depression is immediate life threat.",
        },
      ],
      postTest: [
        {
          question: "Why monitor potassium with insulin therapy?",
          options: [
            "It never shifts.",
            "Insulin drives K+ intracellularly—hypokalemia risk.",
            "Potassium is irrelevant.",
            "Only diuretics affect K+.",
          ],
          correct: 1,
          rationale: "Electrolyte shifts matter especially in DKA treatment contexts.",
        },
        {
          question: "Which delegation is appropriate?",
          options: [
            "AP decides naloxone dose.",
            "AP measures vitals and reports sedation score changes.",
            "AP stops heparin independently.",
            "AP interprets aPTT alone.",
          ],
          correct: 1,
          rationale: "Data collection with reporting is delegable; clinical decisions are not.",
        },
        {
          question: "Teaching on anticoagulation should include:",
          options: [
            "Use razor blades aggressively.",
            "Bleeding precautions, when to seek urgent care, and medication consistency.",
            "Stop all activity forever.",
            "Ignore head injuries.",
          ],
          correct: 1,
          rationale: "Safety teaching reduces harm from minor trauma or procedural bleeding.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "High-alert meds: nursing management (NCLEX-RN, Canada)",
      seoTitle: "High-alert medications | NCLEX-RN Canada | NurseNest",
      seoDescription: "Canadian RN: SI glucose, anticoag safety, opioid toxicity, and collaboration.",
      clinical_meaning: `**Canadian RN**  
Same management with **metric** labs and Canadian terminology. Your exam still ties **high-alert meds** to **airway protection**, **perfusion**, and **timely reversal/antidotes** when ordered—especially when sedation stacks with regional anesthesia or acute illness.`,
      exam_relevance: `Watch **mmol/L glucose** and **SI INR** presentations. Traps include **treating numbers without symptoms** (or ignoring symptoms because a number “looks okay”) and **delaying escalation** for **opioid toxicity** while completing non-urgent tasks.`,
      clinical_scenario: `**Vignette**  
Epidural infusion running; client becomes **difficult to arouse**, **RR 8**, **snoring**, and **SpO₂ falling** despite supplemental oxygen.

**Fork**  
Airway first, notify anesthesia/provider per protocol, prepare reversal per order. Stop additional opioid boluses unless ordered, support ventilation per protocol, and **never leave** a bradypneic sedated client unattended while you finish paperwork.`,
      takeaways: `• **Regional anesthesia + opioids** compound risk—monitor sedation and ventilation aggressively.  
• **Team communication** is safety: anesthesia, primary team, and rapid response pathways belong in the loop early.  
• **Anticoagulation + acute neuro change** is treated as emergency until proven otherwise.`,
    },
    {
      preTest: [
        {
          question: "Which finding needs immediate action?",
          options: [
            "RR 16, comfortable, alert.",
            "RR 7, snoring respirations, difficult to arouse after opioid.",
            "Stable SpO₂ on RA.",
            "Mild nausea without sedation change.",
          ],
          correct: 1,
          rationale: "Bradypnea with altered arousal suggests opioid-induced respiratory depression.",
        },
        {
          question: "Glucose 2.8 mmol/L with confusion. Priority?",
          options: [
            "Give regular insulin now.",
            "Treat hypoglycemia per protocol and monitor closely.",
            "Ignore confusion.",
            "Send to walk unassisted.",
          ],
          correct: 1,
          rationale: "Severe hypoglycemia requires immediate treatment and monitoring.",
        },
        {
          question: "Which is part of safe warfarin teaching?",
          options: [
            "Skip INR monitoring.",
            "Consistent vitamin K intake and prompt reporting of bleeding.",
            "Double dose if missed once without advice.",
            "Take extra NSAIDs for headaches.",
          ],
          correct: 1,
          rationale: "Consistency and bleeding surveillance reduce harm; NSAIDs increase bleed risk.",
        },
      ],
      postTest: [
        {
          question: "Why avoid IM injections in severe thrombocytopenia when stem highlights risk?",
          options: [
            "IM is always preferred.",
            "Bleeding/hematoma risk rises with low platelets.",
            "Platelets never matter.",
            "Only subcutaneous bleeds.",
          ],
          correct: 1,
          rationale: "Route selection considers bleeding risk.",
        },
        {
          question: "Client on anticoagulant falls and hits head. RN should?",
          options: [
            "Send home without assessment.",
            "Neuro checks per protocol, notify provider, consider imaging per orders.",
            "Give another anticoagulant dose.",
            "Ignore if awake once.",
          ],
          correct: 1,
          rationale: "Head trauma on anticoagulation needs urgent evaluation.",
        },
        {
          question: "Which statement shows opioid misuse risk counseling?",
          options: [
            "Share meds with family.",
            "Store securely, take only as prescribed, never combine with alcohol/sedatives unless cleared.",
            "Crush extended-release tablets for faster effect.",
            "Stop abruptly without plan.",
          ],
          correct: 1,
          rationale: "Safe use and storage reduce overdose and diversion risk.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "High-alert prescribing & monitoring (NP, US)",
      seoTitle: "High-alert meds | NP US | NurseNest",
      seoDescription: "NP: opioid risk stratification, anticoag choice concepts, insulin intensification safety.",
      clinical_meaning: `**NP**  
Items may test **risk assessment** (opioid contracts, PDMP awareness at high level), **renal dosing concepts**, **bleeding risk with anticoagulation**, and **patient education** for insulin starts/titrations—without replacing institution-specific protocols.`,
      exam_relevance: `Trap: **escalating opioids** without **respiratory safeguards** or **non-opioid multimodal** plan when appropriate.`,
      clinical_scenario: `**Vignette**  
Chronic pain patient on opioids with **new daytime somnolence** and **RR 10**.

**Fork**  
Reduce risk: evaluate sedation, consider **dose reduction/hold**, **naloxone education**, and **ED referral** if unstable—not “refill early blindly.”`,
      takeaways: `• **Respiratory rate and sedation** guide opioid safety.  
• **Renal/hepatic** function affects anticoag and insulin choices in vignettes.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs naloxone co-prescribing consideration (exam-style)?",
          options: [
            "On low-dose opioids without risk factors.",
            "On opioids with OSA, sedatives, or respiratory disease—elevated overdose risk.",
            "Never on opioids.",
            "Only pediatric patients.",
          ],
          correct: 1,
          rationale: "High-risk combinations increase naloxone education/co-prescribing relevance.",
        },
        {
          question: "Elderly with CKD starting metformin—NP thinks about?",
          options: [
            "Ignore renal function.",
            "eGFR thresholds and lactic acidosis risk per guidelines in stem.",
            "Double dose for age.",
            "Stop all fluids.",
          ],
          correct: 1,
          rationale: "Renal function guides safe metformin use.",
        },
        {
          question: "Which behavior signals opioid use disorder concern?",
          options: [
            "Taking meds exactly as prescribed with stable function.",
            "Early refills, lost prescriptions pattern, sedation, doctor shopping cues in stem.",
            "Using PT for mobility.",
            "Attending follow-up visits.",
          ],
          correct: 1,
          rationale: "Red flags prompt evaluation and referral pathways.",
        },
      ],
      postTest: [
        {
          question: "Why combine non-opioid multimodal analgesia when appropriate?",
          options: [
            "To increase opioid need.",
            "To improve pain control while reducing opioid exposure.",
            "To avoid assessing pain.",
            "To eliminate monitoring.",
          ],
          correct: 1,
          rationale: "Multimodal plans reduce harm.",
        },
        {
          question: "DOAC teaching emphasis?",
          options: [
            "Skip adherence.",
            "Adherence, bleeding precautions, procedural hold instructions per specialist.",
            "Double dose if missed.",
            "Ignore renal dosing.",
          ],
          correct: 1,
          rationale: "DOAC safety hinges on adherence and renal-aware dosing.",
        },
        {
          question: "Insulin start in outpatient—documentation should include:",
          options: [
            "No education.",
            "Hypoglycemia plan, sick-day guidance, device teaching, follow-up.",
            "Only prescription signature.",
            "Advice to skip meals always.",
          ],
          correct: 1,
          rationale: "Education and follow-up reduce outpatient insulin errors.",
        },
      ],
    },
  ),
};

type LessonInputShape = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest: PathwayLessonQuizItem[];
  postTest: PathwayLessonQuizItem[];
};

function npTitles(pathwayId: string, v: (typeof VARIANTS)["us_np"]) {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `High-alert meds: prescribing & monitoring (${suf})`,
    seoTitle: `High-alert meds | ${lab} US | NurseNest`,
    seoDescription: `NP safety for ${lab}: opioids, anticoagulation, insulin titration, and monitoring.`,
  };
}

export function highAlertMedsGoldVariantForPathway(pathwayId: string): HamVariant | undefined {
  return PATHWAY_VARIANT[pathwayId];
}

export function highAlertMedsGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getHighAlertMedsGoldLessonInput(pathwayId);
  if (!full) return null;
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
  };
}

export function getHighAlertMedsGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: HIGH_ALERT_MEDS_GOLD_SLUG,
    title: v.title,
    topic: "Medication safety",
    topicSlug: "medication-safety",
    bodySystem: "Pharmacology",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — insulin, anticoagulants, opioids", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
