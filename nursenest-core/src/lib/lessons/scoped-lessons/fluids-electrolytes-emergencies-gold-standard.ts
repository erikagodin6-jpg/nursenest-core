/**
 * Fluids & electrolyte emergencies — recognition, monitoring, escalation (nursing exam depth).
 * Remediation wave 2: fluids_electrolytes system + physiological adaptation.
 */
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonQuizItem,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import {
  ensurePremiumSeoDescription,
  PATHWAY_EXAM_LABEL,
  pathwayIdToTierGeo,
  synthesizeGoldPremiumSections,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const FLUIDS_ELECTROLYTES_GOLD_SLUG = "fluids-electrolytes-emergencies-gold" as const;

type FeVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, FeVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Why electrolytes dominate exams**  
Small shifts in **sodium**, **potassium**, **calcium**, and **magnesium** change **neuromuscular excitability**, **cardiac conduction**, **fluid compartments**, and **mental status**. Items reward tying **symptoms + ECG + labs + risk context** (renal failure, diuretics, DKA treatment, NG losses, refeeding, post-thyroid surgery) to **safe sequencing**: assess → protect → notify → carry out **orders**.

**ECG–electrolyte links (exam favorites)**  
• **Hyperkalemia**: peaked T waves → widened QRS → sine wave pattern (progression cues in stems).  
• **Hypokalemia / hypomagnesemia**: U waves, prolonged QT, irritability → **torsades risk** when paired with QT-prolonging factors.  
• **Hypocalcemia**: prolonged QT, tetany, Chvostek/Trousseau when described.

**Fluids**  
**Hypovolemia** vs **overload** forks still use **vitals, mucosa, I&O, lung sounds, edema, orthostasis** and **provider-directed** boluses or diuretics—avoid independent “fix the number” without an order.`;

const FLUIDS_LABS_DIAGNOSTICS = `**Core panels**  
Expect stems to quote **basic metabolic panels** (sodium, potassium, chloride, bicarbonate, BUN, creatinine, glucose), **ionized calcium** or total calcium with albumin context, **magnesium**, and sometimes **phosphate** in refeeding or renal failure scenarios. Nursing items test whether you **recognize critical values**, **repeat labs per order**, and **connect trends** to symptoms and ECG changes.

**Osmolality and glucose states**  
**Serum osmolality** and **glucose** appear in hyperglycemic crises and mixed pictures; tie them to **volume status** and **K shifts** during treatment pathways described in the item. Choose monitoring that matches **insulin protocols**, **potassium repletion rules**, and **frequent reassessment** rather than one-time fixes.

**Urinalysis and I&O**  
**Concentrated urine**, **poor output**, or **sudden diuresis** support volume and renal storylines. Pair **strict I&O**, **daily weights**, and **orthostatic vitals** with lab trajectories when the stem tests your judgment on **overload versus dehydration**.`;

function pack(
  variant: FeVariant,
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

const VARIANTS: Record<FeVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Electrolyte & fluid emergencies: what to spot (NCLEX-PN, US)",
      seoTitle: "Electrolyte emergencies | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: K/Na/Ca/Mg red flags, ECG cues in stems, hypovolemia vs overload reporting, and scope-safe actions.",
      clinical_meaning: `**PN scope**  
You **observe**, **measure**, **document trends**, **administer fluids/electrolyte replacements per order**, and **escalate** when symptoms or vitals worsen. You do **not** independently prescribe replacement rates or interpret ABGs beyond reporting values unless the stem defines extended scope.`,
      exam_relevance: `Traps: **routine tasks** during **muscle weakness + arrhythmia suspicion**, **giving potassium PO/IV** without confirming **renal status / order / route** when the stem flags risk, or **ignoring post-thyroid tingling** after surgery.`,
      clinical_scenario: `**Vignette — med-surg**  
Client post **NG suction** has **muscle cramps**, **irritability**, **twitching**, and **BP soft**; ECG in stem shows **prolonged QT**. You suspect **hypocalcemia / hypomagnesemia** risk pattern.

**Fork**  
Stay with client, **ensure safety**, **notify RN** with objective data, **prepare for ordered labs/meds**—not “finish linens first.”`,
      takeaways: `• **Neuro-muscular + ECG + context** beats guessing one lab in isolation.  
• **Replacement therapy** follows **orders and monitoring**; watch **IV rates** and **pain at infusion site** per policy.  
• **Report** worsening confusion, seizures, chest pain, or sudden rhythm change immediately.`,
    },
    {
      preTest: [
        {
          question: "Which finding should the PN report first when a client on diuretics becomes confused with muscle cramps?",
          options: [
            "Finished dinner tray.",
            "Altered mental status with neuromuscular symptoms after diuretic therapy.",
            "TV volume preference.",
            "Stable visitor at bedside.",
          ],
          correct: 1,
          rationale: "Electrolyte disturbance (e.g., hypokalemia/hyponatremia) can cause neuro changes—escalate with data.",
        },
        {
          question: "A stem shows peaked T waves and widening QRS after missed dialysis. What pattern is being tested?",
          options: [
            "Hypokalemia only.",
            "Hyperkalemia cardiotoxicity progression—urgent escalation.",
            "Normal sinus rhythm review.",
            "Hypercalcemia only.",
          ],
          correct: 1,
          rationale: "Classic exam linkage: hyperkalemia with ECG changes is an emergency until evaluated.",
        },
        {
          question: "Best PN action when a hypotonic IV bag is running and the client develops headache and confusion?",
          options: [
            "Speed the infusion to finish faster.",
            "Stop the infusion per protocol/order, notify RN, monitor neuro status and vitals.",
            "Ignore because IVs are always safe.",
            "Give sedatives without assessment.",
          ],
          correct: 1,
          rationale: "Rapid sodium shifts can cause cerebral edema; follow chain of command and orders.",
        },
      ],
      postTest: [
        {
          question: "Why is I&O important in electrolyte problems?",
          options: [
            "It is never used.",
            "It helps assess renal perfusion, response to therapy, and risk of overload or deficit.",
            "It replaces lab monitoring.",
            "It only matters in pediatrics.",
          ],
          correct: 1,
          rationale: "I&O contextualizes fluid and electrolyte management.",
        },
        {
          question: "Client with DKA treatment in stem shows swelling and crackles. PN should?",
          options: [
            "Ignore lung sounds.",
            "Report fluid overload cues to RN—may need therapy adjustment per orders.",
            "Give more insulin independently.",
            "Turn off all oxygen always.",
          ],
          correct: 1,
          rationale: "DKA resuscitation can shift to overload; assessment and reporting are key.",
        },
        {
          question: "Which task is appropriate for PN regarding potassium replacement?",
          options: [
            "Choose the rate without an order.",
            "Administer per order with required monitoring and never IV push potassium.",
            "Stop all fluids always.",
            "Ignore ECG changes.",
          ],
          correct: 1,
          rationale: "Potassium replacement is high-alert and must follow orders and safety checks.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Electrolyte & fluid emergencies (REx-PN, Canada)",
      seoTitle: "Electrolyte emergencies | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian PN: mmol/L sodium potassium and glucose, hypovolemia versus fluid overload, ECG cues with hyperkalemia, safe IV potassium collaboration, and urgent RN notification patterns.",
      clinical_meaning: `**RPN**  
Canadian stems often show **mmol/L** sodium, potassium, and glucose. Your job is still **trend recognition**, **safe administration**, and **timely reporting** when neuro, cardiac, or perfusion status changes.`,
      exam_relevance: `Same traps as US PN: **routine** before **unstable electrolyte/ECG pattern**, and **scope** errors around **unsupervised bolus decisions**.`,
      clinical_scenario: `**Vignette**  
Client **Na 118 mmol/L** (per lab in stem) with **headache**, **nausea**, and **increasing confusion** after aggressive hypotonic intake.

**Fork**  
This is **severe hyponatremia concern**—notify RN/NP/physician, protect airway if needed, follow orders; do not push free water orally if contraindicated by the care plan.`,
      takeaways: `• **SI labs** require careful reading—do not confuse mmol/L with mg/dL habits.  
• **Neuro decline + low sodium** is an escalation pattern.  
• **Collaborate** before improvising fluid challenges.`,
    },
    {
      preTest: [
        {
          question: "Which lab pattern with neuro symptoms should the RPN escalate urgently?",
          options: [
            "Mild asymptomatic lab variance without change.",
            "Severe hyponatremia with worsening confusion.",
            "Stable client playing cards.",
            "Normal vitals after therapy.",
          ],
          correct: 1,
          rationale: "Symptomatic hyponatremia can be life-threatening; escalate with objective data.",
        },
        {
          question: "Why might potassium replacement be dangerous in oliguric renal failure in exam stems?",
          options: [
            "Potassium never matters.",
            "Excretion is impaired—hyperkalemia risk rises with supplementation.",
            "Renal failure lowers K always.",
            "Only children are affected.",
          ],
          correct: 1,
          rationale: "Renal clearance drives potassium safety; stems test monitoring and orders.",
        },
        {
          question: "Client with muscle weakness and diarrhea. RPN priority assessment focus?",
          options: [
            "Only nail care.",
            "Volume status, orthostasis, electrolyte-related weakness, and infection/dehydration cues.",
            "Discharge planning only.",
            "Ignore vitals.",
          ],
          correct: 1,
          rationale: "GI losses drive hypokalemia and hypovolemia; assessment guides escalation.",
        },
      ],
      postTest: [
        {
          question: "Which ECG change best fits hyperkalemia teaching?",
          options: [
            "Prominent U waves only.",
            "Peaked T waves progressing toward widened QRS.",
            "Short QT always.",
            "Junctional rhythm only always.",
          ],
          correct: 1,
          rationale: "Peaked T waves are a classic early hyperkalemia cue in exam vignettes.",
        },
        {
          question: "RPN notes peripheral IV site with pain and erythema during KCl infusion. Action?",
          options: [
            "Ignore.",
            "Stop infusion per policy, notify RN, assess for extravasation/infiltration concerns.",
            "Double the rate.",
            "Apply heat without reporting.",
          ],
          correct: 1,
          rationale: "Potassium vesicant risk requires immediate evaluation and notification.",
        },
        {
          question: "Why monitor magnesium when stem shows alcohol withdrawal and arrhythmia risk?",
          options: [
            "Mg never matters.",
            "Hypomagnesemia worsens arrhythmia risk and can accompany other electrolyte issues.",
            "Mg only affects sodium.",
            "Withdrawal never affects electrolytes.",
          ],
          correct: 1,
          rationale: "Alcohol use and refeeding contexts often test magnesium awareness.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Electrolyte & fluid crises: RN judgment (NCLEX-RN, US)",
      seoTitle: "Electrolyte emergencies | NCLEX-RN US | NurseNest",
      seoDescription:
        "NCLEX-RN: Na/K/Ca/Mg shifts, ECG integration, DKA and HHNS forks, fluid overload, and safe sequencing.",
      clinical_meaning: `**RN**  
You **prioritize** airway/neuro protection, **interpret trends** (labs + vitals + ECG + I&O), **implement orders** for replacement/dialysis/diuretics, and **reassess** after each intervention. Items punish **delay** when **ECG shows hyperkalemic progression** or **seizures** with severe sodium disturbance.`,
      exam_relevance: `Classic forks: **hypo vs hypernatremia** management principles as taught, **potassium replacement safety**, **calcium before insulin for hyperK with ECG changes** when the stem follows that teaching pattern, **fluid type** in DKA, and **overload** after resuscitation.`,
      clinical_scenario: `**Vignette — telemetry**  
K+ **6.9 mEq/L**, **peaked Ts**, **widening QRS**, **BP stable but client dizzy**.

**Fork**  
This is **cardiotoxic hyperkalemia concern**—follow **emergent pathway elements in the item** (often calcium stabilization, insulin/glucose, albuterol, kayexalate/diuretics/dialysis per orders), **continuous monitoring**, and **frequent reassessment**—not routine discharge teaching.`,
      takeaways: `• **ECG + K+** together drive urgency.  
• **Never IV push potassium**.  
• **Reassess** after boluses and replacement; watch for **fluid shift** complications.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable client requesting lotion.",
            "Telemetry client with K+ 6.8, peaked T waves, and widening QRS.",
            "Client watching TV with stable vitals.",
            "Client asking for ice chips, stable.",
          ],
          correct: 1,
          rationale: "Hyperkalemia with ECG changes is an immediate cardiopulmonary emergency pattern.",
        },
        {
          question: "Which action is highest priority in a stem that teaches calcium before insulin for hyperkalemia with ECG changes?",
          options: [
            "Finish medication reconciliation paperwork.",
            "Cardiac membrane stabilization therapy per order (often calcium) while preparing other therapies.",
            "Send client to PT.",
            "Hold all monitoring.",
          ],
          correct: 1,
          rationale: "Stabilize myocardium when conduction is threatened; follow the stem’s sequence.",
        },
        {
          question: "Why is rapid correction of chronic hyponatremia dangerous?",
          options: [
            "It is never dangerous.",
            "Osmotic demyelination risk—correction must be controlled per protocol.",
            "Sodium never changes.",
            "Only hypernatremia matters.",
          ],
          correct: 1,
          rationale: "Too-fast correction can cause permanent neurologic injury.",
        },
      ],
      postTest: [
        {
          question: "DKA client’s anion gap closing but glucose falling with continued insulin—RN watches for?",
          options: [
            "Only hyperglycemia.",
            "Hypoglycemia and hypokalemia as insulin drives K+ intracellularly.",
            "No further labs.",
            "Discharge immediately.",
          ],
          correct: 1,
          rationale: "DKA treatment shifts potassium and glucose—monitor closely.",
        },
        {
          question: "Which assessment supports third-spacing vs true hypovolemia distinction in exam vignettes?",
          options: [
            "Only temperature.",
            "Orthostasis, mucosa, I&O, lung sounds, edema, hemodynamic response to small fluid challenge per orders.",
            "Only pain score.",
            "Only family report.",
          ],
          correct: 1,
          rationale: "Volume assessment integrates multiple objective findings.",
        },
        {
          question: "Client on loop diuretic has cramps and arrhythmia on monitor. RN suspects?",
          options: [
            "Ignore diuretic link.",
            "Hypokalemia/hypomagnesemia—check labs per orders and treat per protocol.",
            "Always hypernatremia.",
            "Stop all fluids without orders always.",
          ],
          correct: 1,
          rationale: "Diuretics cause kaliuresis and magnesium loss; replace per orders.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Electrolyte & fluid crises (NCLEX-RN, Canada)",
      seoTitle: "Electrolyte emergencies | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN: mmol/L electrolytes, DKA context, ECG integration, fluid balance, and safe escalation.",
      clinical_meaning: `**Canadian RN**  
Read **mmol/L** values precisely. Judgment mirrors US RN items: **protect conduction** in hyperkalemia, **protect brain** in sodium disorders, and **reassess** after therapy.`,
      exam_relevance: `Same forks as US RN—**hypo/hypernatremia** teaching, **K+ replacement safety**, **calcium before insulin** when the stem follows that pattern—but stems add **mmol/L** labs and **metric vitals**. Misreading units or delaying when **ECG + K+** align is the usual wrong-answer pattern.`,
      clinical_scenario: `**Vignette**  
K+ **6.7 mmol/L** with **ECG changes** and **weakness**.

**Fork**  
Activate urgent pathway elements per orders, continuous monitoring, prepare for dialysis if indicated in stem—before routine meds.`,
      takeaways: `• **Hyperkalemia + ECG** changes mean **continuous monitoring** and **urgent pathway activation** until stabilized per orders—not routine meds first.  
• **Document trends** in vitals, neuro status, ECG, and repeat labs after each intervention for anesthesia, nephrology, or rapid response as the stem implies.  
• **Severe hyponatremia with seizures or decreased LOC** belongs in **higher-acuity monitored care**; outpatient-style fixes fail the item.`,
    },
    {
      preTest: [
        {
          question: "Which lab value context should raise immediate concern on Canadian exams?",
          options: [
            "Na 140 mmol/L asymptomatic.",
            "K+ 6.8 mmol/L with ECG conduction changes.",
            "Stable glucose 5.5 mmol/L.",
            "Normal Hgb.",
          ],
          correct: 1,
          rationale: "Severe hyperkalemia with ECG changes requires urgent intervention.",
        },
        {
          question: "Why monitor glucose during electrolyte resuscitation?",
          options: [
            "Glucose never shifts.",
            "Insulin therapies for hyperkalemia and DKA management change glucose—watch for hypoglycemia.",
            "Only type 2 matters.",
            "Glucose replaces potassium checks.",
          ],
          correct: 1,
          rationale: "Therapies interact; monitor per protocol.",
        },
        {
          question: "Client with heart failure gains 3 kg overnight with crackles. RN priority?",
          options: [
            "Ignore weight.",
            "Assess respiratory status, notify provider, anticipate diuretic/therapy adjustments per orders.",
            "Give free water bolus.",
            "Stop all cardiac meds independently.",
          ],
          correct: 1,
          rationale: "Fluid overload worsens heart failure; assessment and collaboration come first.",
        },
      ],
      postTest: [
        {
          question: "Which symptom cluster suggests symptomatic hypocalcemia?",
          options: [
            "Warm dry skin only.",
            "Perioral numbness, muscle spasms, Chvostek/Trousseau if tested, prolonged QT if shown.",
            "Polyuria only.",
            "Bradycardia only always.",
          ],
          correct: 1,
          rationale: "Neuromuscular irritability and ECG changes fit hypocalcemia teaching.",
        },
        {
          question: "Why is magnesium checked when hypokalemia is hard to correct?",
          options: [
            "No relationship.",
            "Hypomagnesemia impairs potassium repletion.",
            "Magnesium raises sodium always.",
            "Only renal patients need Mg.",
          ],
          correct: 1,
          rationale: "Co-repletion is a common exam teaching point.",
        },
        {
          question: "Which statement reflects safe delegation during electrolyte emergencies?",
          options: [
            "AP titrates potassium infusion independently.",
            "AP records vitals and ECG rhythm strips while RN interprets and acts per orders.",
            "AP decides calcium dose.",
            "AP discharges client.",
          ],
          correct: 1,
          rationale: "Data collection can be delegated; clinical decisions cannot.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Electrolyte crises: outpatient triage (NP, US)",
      seoTitle: "Electrolyte triage | NP US | NurseNest",
      seoDescription:
        "NP ambulatory electrolyte triage: symptomatic sodium and potassium extremes, ECG-driven hyperkalemia escalation, DKA and AKI interactions, chronic diuretic monitoring, ED referral, and safety netting.",
      clinical_meaning: `**NP**  
Items test **risk stratification**: **symptomatic severe hyponatremia/hypernatremia**, **hyperkalemia with ECG changes**, **tetany**, and **DKA** require **ED**—not “call me in a week.” Chronic management tests **medication review**, **renal dosing**, and **patient literacy** for sick-day plans.`,
      exam_relevance: `Trap: **minimizing ECG changes** or **ordering oral potassium** without addressing **acute renal failure + peaked Ts**.`,
      clinical_scenario: `**Vignette — phone triage**  
Patient on **ACEI + spironolactone + NSAID** reports **weakness** and **palpitations**; home BP machine “fine.”

**Fork**  
Think **hyperkalemia** and **AKI** interaction—**direct to ED** for ECG/labs rather than reassurance.`,
      takeaways: `• **Polypharmacy** stacks potassium risk when ACE inhibitors, ARBs, spironolactone, or NSAIDs overlap.  
• **Red flags** such as palpitations with ECG change mean **ED**; document **safety-net** instructions with concrete thresholds.  
• Plan **repeat labs** after diuretic or insulin therapy changes when renal function may shift.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs ED evaluation rather than next-week follow-up?",
          options: [
            "Mild stable labs without symptoms.",
            "Suspected severe hyperkalemia with palpitations and ECG changes described.",
            "Routine refill request.",
            "Asymptomatic chronic HTN check.",
          ],
          correct: 1,
          rationale: "Electrolyte emergencies with cardiac symptoms need immediate in-person evaluation.",
        },
        {
          question: "Why review diuretics and ACE inhibitors together in exam vignettes?",
          options: [
            "They never interact.",
            "They affect potassium and renal perfusion—combined risk with NSAIDs.",
            "Only one drug class matters.",
            "They only affect glucose.",
          ],
          correct: 1,
          rationale: "Triple whammy AKI/hyperkalemia risk is a common testing pattern.",
        },
        {
          question: "NP teaching for chronic diuretic use should include?",
          options: [
            "Ignore orthostasis.",
            "Orthostatic precautions, potassium monitoring, and when to call for weakness or palpitations.",
            "Stop fluids completely.",
            "Double diuretics if ankles swell.",
          ],
          correct: 1,
          rationale: "Safety netting reduces electrolyte collapse at home.",
        },
      ],
      postTest: [
        {
          question: "Which finding pushes same-day sodium correction caution?",
          options: [
            "Asymptomatic chronic mild hyponatremia with slow planned correction plan.",
            "Acute severe symptomatic hyponatremia requiring controlled correction in monitored setting.",
            "Normal sodium.",
            "Mild thirst only.",
          ],
          correct: 1,
          rationale: "Severe symptomatic hyponatremia management belongs in acute monitored care.",
        },
        {
          question: "Why might NP hold metformin during acute illness teaching?",
          options: [
            "Metformin is always safe in dehydration.",
            "AKI/hypoperfusion raises lactate acidosis risk—per guideline teaching in stems.",
            "Metformin raises K always.",
            "Never hold any drug.",
          ],
          correct: 1,
          rationale: "Sick-day med management is common ambulatory teaching.",
        },
        {
          question: "Which documentation supports NP liability protection in electrolyte counseling?",
          options: [
            "No instructions.",
            "Return precautions, specific symptoms, and where to seek care.",
            "Only vitals.",
            "Guess patient understanding.",
          ],
          correct: 1,
          rationale: "Clear safety netting shows standard-of-care communication.",
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
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
};

function npTitles(pathwayId: string, v: (typeof VARIANTS)["us_np"]) {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `Electrolyte crises: outpatient triage (${suf})`,
    seoTitle: `Electrolyte triage | ${lab} US | NurseNest`,
    seoDescription: `NP electrolyte triage for ${lab}: severe sodium and potassium disturbances with cardiac symptoms, DKA and renal failure interactions, same-day ED referral, explicit monitoring plans, and documented safety netting.`,
  };
}

export function fluidsElectrolytesGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getFluidsElectrolytesGoldLessonInput(pathwayId);
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

export function getFluidsElectrolytesGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;
  const syn = synthesizeGoldPremiumSections({
    sharedCore: SHARED_CORE_BODY,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "your nursing licensure exam",
    labsDiagnostics: FLUIDS_LABS_DIAGNOSTICS,
    relatedSlugs: [
      "sepsis-early-recognition-gold",
      "shock-emergencies-gold",
      "acute-coronary-syndrome-gold",
      "clinical-judgment-prioritization-gold",
    ],
    relatedTitlesBySlug: {
      "sepsis-early-recognition-gold": "Sepsis early recognition",
      "shock-emergencies-gold": "Shock emergencies",
      "acute-coronary-syndrome-gold": "Acute coronary syndrome",
      "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
    },
  });
  return {
    slug: FLUIDS_ELECTROLYTES_GOLD_SLUG,
    title: v.title,
    topic: "Fluids & electrolytes",
    topicSlug: "fluids-electrolytes",
    bodySystem: "Renal",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: ensurePremiumSeoDescription(v.seoDescription, PATHWAY_EXAM_LABEL[pathwayId] ?? pathwayId),
    sections: syn.sections,
    premiumOmittedSections: syn.premiumOmittedSections,
    relatedLessonRefs: syn.relatedLessonRefs,
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
