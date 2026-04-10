/**
 * NP primary-care **foundations layer**: diagnostic reasoning, prevention, screening, follow-up,
 * referral thresholds, documentation, shared decision-making, and common-lab interpretation.
 * Injected only on selected NP pathways (see {@link PATHWAY_VARIANT}) — not RN/PN hubs.
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

export const NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG = "np-primary-care-foundations-gold" as const;

/** Primary-care NP boards (US FNP-style tracks + Canada CNPLE). Excludes PMHNP — different competency map. */
const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Diagnostic reasoning (primary care)**  
Start with a **concise problem representation**—one sentence that names the dominant symptom or risk, the timeline, and the population context (age, pregnancy, comorbidities, medications). Then build a **ranked differential**: common benign explanations first, **cannot-miss** alternatives whenever red flags, age extremes, immunocompromise, anticoagulation, or pregnancy change pretest probability. Use **anchoring discipline**: each new data point should **raise or lower** competing diagnoses, not merely decorate the story you already like.

**Differential diagnosis discipline**  
For each major alternative, ask what **finding would disprove it quickly** and what **test or exam element** is still missing. Prefer **targeted** history and exam before wide nets of low-yield testing—boards reward **parsimony** paired with **safety**. When two diseases overlap in presentation, separate them with **time course**, **associated features**, **risk factors**, and **response to initial therapy** when the stem gives you a treatment trial.

**Preventive care, screening, and health promotion (integrated)**  
Prevention is not a separate “wellness lecture”—it is **risk-stratified** and **age-scheduled**. Know the logic: **who** benefits, **how often**, **what stops screening**, and **what to do with borderline or incidental results**. Health promotion includes **behavior change** (tobacco, activity, nutrition, sleep, adherence) with **specific, measurable** plans rather than generic advice. Tie counseling to **readiness**, **barriers**, and **follow-up hooks** you can verify at the next visit.

**Follow-up, monitoring, and referral thresholds**  
Ambulatory care fails when **intervals are vague**. Specify **what improves**, **what worsens**, **when to call**, and **where to go** (primary care, urgent care, ED, specialty). Refer when **diagnostic uncertainty exceeds safe primary-care scope**, **therapy is failing**, **progression is faster than expected**, or **procedure/hospital-level care** is indicated. Document **why** referral is time-sensitive when it is.

**Documentation logic (defensible charting)**  
Your note should support another clinician picking up the case: **pertinent positives/negatives**, **differential considerations**, **rationale for the working diagnosis**, **plan including monitoring**, and **patient understanding**. Avoid vague phrases that hide uncertainty—if you are watching something, say **what** and **for how long**.

**Shared decision-making**  
When options are close in benefit/harm (screening trade-offs, chronic meds with real adverse effects, procedures), frame **numbers, preferences, and uncertainty** honestly. The “right” answer on boards often rewards **informed consent**, **respect for autonomy**, and **clear contingency plans**—not paternalistic certainty.

**Connecting mechanism to the exam stem**  
When labs or vitals appear, trace them to **organ systems** and **compensation**—hyponatremia is not “one number,” it is **water balance and perfusion** in context; anemia is not “low Hgb,” it is **production versus loss versus dilution** until the stem rules in a pattern.`;

const FOUNDATIONS_LABS_BODY = `**CBC (anemia, infection, thrombocytopenia)**  
Interpret **Hgb/Hct** with **MCV** (micro vs macro pattern), **RDW** (mixed processes), and **reticulocyte** when hemolysis or marrow response matters. Pair **WBC** with **bands/left shift** only when the stem provides differentials—avoid overcalling infection from WBC alone. **Platelets** matter for bleeding risk, HIT suspicion when paired with heparin, and marrow failure patterns.

**BMP / renal–electrolyte panel**  
**Sodium** disorders: assess **volume status** (clinical exam, orthostatics, mucous membranes, I/O when present) before you label “dehydration” versus **SIADH** versus **hypervolemic** states.**Potassium** extremes are immediate safety issues with **EKG** implications when the vignette includes cardiac symptoms or medications (ACEi, ARB, K-sparing diuretics, TMP-SMX). **Creatinine / eGFR** frame drug dosing, contrast risk, and urgency of nephrology involvement.

**Hepatic panel (AST/ALT, ALP, bilirubin)**  
Pattern recognition: **hepatocellular injury** versus **cholestasis**; use **alcohol**, **medications**, **viral risks**, and **pregnancy** as pivot points. **Albumin** and **INR** add chronicity and synthetic function when the stem includes them.

**Lipids and cardiometabolic risk**  
**Fasting vs nonfasting** contexts change how you interpret **triglycerides**; **LDL** drives many ASCVD decisions when paired with **risk tools** implied by the stem (diabetes, CKD, age). Know when **statin intensity** and **nonstatin add-ons** are exam-relevant versus when the issue is **secondary causes** (hypothyroidism, nephrotic-range proteinuria).

**A1c and glucose**  
**A1c** reflects **~3-month** control but can mislead with **hemoglobinopathies**, **anemia**, or **pregnancy**—the stem often hints at these. Pair **random glucose** symptoms with **hyperglycemic crisis** features when ketosis or dehydration appears.

**TSH (thyroid)**  
Primary hypothyroidism vs hyperthyroidism patterns; **pregnancy trimester** changes expected TSH behavior when the item is OB-adjacent. Avoid reflex testing cascades the vignette does not support.

**Urinalysis / urine studies**  
**Blood**, **protein**, **nitrites/leukocytes**, **glucose**, **ketones**—map to **infection**, **nephritis/nephrotic patterns**, **glomerular disease suspicion**, and **metabolic** emergencies when ketones plus glucose tell a story.

**Exam habit**  
Before you pick an option, ask: **does this lab actually discriminate** between the top two differentials in the stem, or is it busywork? Boards love **parsimony** and **risk-appropriate** testing.`;

function t(
  variant: "us_np" | "ca_np",
  blocks: {
    clinical_meaning: string;
    exam_relevance: string;
    clinical_scenario: string;
    takeaways: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
  },
  quizzes: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] },
) {
  return { variant, ...blocks, quizzes };
}

const VARIANTS: Record<"us_np" | "ca_np", ReturnType<typeof t>> = {
  us_np: t(
    "us_np",
    {
      title: "NP foundations: clinical reasoning, prevention, and primary-care judgment (US boards)",
      seoTitle: "NP primary-care foundations | diagnostic reasoning & prevention | NurseNest",
      seoDescription:
        "US NP board preparation: structured diagnostic reasoning, differential discipline, screening and prevention logic, follow-up and referral thresholds, documentation, shared decision-making, and high-yield lab interpretation for outpatient primary care.",
      clinical_meaning: `**Why this layer exists**  
US NP items reward **outpatient judgment**: you must **frame the problem**, **justify a differential**, choose **tests that change management**, and **close loops** with follow-up and safety-netting. This is the scaffolding beneath organ-system lessons—without it, “facts” do not assemble into **defensible decisions** under time pressure.

**Preventive care as decision science**  
Screening is not memorizing ages—it is knowing **what changes the next step** when results are **borderline**, **false-positive-prone**, or **incidental**. Promotion work succeeds when you tie advice to **measurable outcomes** the patient agrees to track (BP diary, glucose checks, weight trend, tobacco quit date) and when you **stage** counseling to readiness rather than lecturing.

**Documentation that wins points**  
Exam writers embed traps where the “nice” answer **skips risk discussion** or **does not specify monitoring**. A strong NP answer names **what you ruled out**, **why the working diagnosis fits**, **what would change your mind**, and **what the patient should do if things worsen**.`,
      exam_relevance: `**How US NP items test foundations**  
Expect **next-best-step** questions where the discriminator is **risk**, not trivia: unstable features, pregnancy status, anticoagulation, immunosuppression, or age extremes. **Referral** answers should match **urgency**—same-week specialty versus ED versus routine outpatient.

**Screening and prevention stems**  
You will see **USPSTF-style** trade-offs framed as patient scenarios: **who benefits**, **harms**, **frequency**, and **when to stop**. The wrong option often **over-screens** low-risk patients or **under-reacts** to high-risk features.

**Shared decision-making**  
When harms and benefits are close, the best option frequently documents **patient values**, **clear alternatives**, and **follow-up**—not paternalistic certainty. Watch for distractors that **rush procedures** or **withhold** indicated care because the patient is “noncompliant” without addressing barriers.

**Labs**  
Items reward **pattern recognition** and **clinical context**: a mild anemia with a story of **GI blood loss** is not “iron deficiency until proven otherwise” if **acute** instability is present—**stabilization and risk framing** may precede outpatient workup.`,
      clinical_scenario: `**Vignette — 58-year-old with fatigue (outpatient)**  
They report **months** of progressive fatigue, occasional **shortness of breath** on hills, and **cold intolerance**. Vitals are borderline **hypertensive**; exam shows **pallor** and **mild tachycardia**. You order a **CBC** showing **Hgb 9.8 g/dL**, **MCV 68 fL**, **platelets 480k**.

**Reasoning fork**  
Microcytic pattern points to **iron deficiency** versus **thalassemia trait** versus **anemia of chronic disease** components—your next questions target **GI blood loss**, **menstrual history**, **NSAID use**, **diet**, and **family history**. Referral thresholds: **hemodynamic instability**, **acute GI bleeding**, **severe symptoms**, or **diagnostic uncertainty** after initial workup—choose **safety and parsimony** over endless tests.

**Follow-up template**  
If you start oral iron, specify **recheck interval**, **expected response timeline**, **GI evaluation** when indicated, and **return precautions** for syncope, melena, or worsening dyspnea—boards punish “recheck someday.”

**Documentation nugget**  
Your note should show **differential considerations**, **rationale** for the leading diagnosis, and **plan** with **measurable follow-up**—not only a problem list.`,
      takeaways: `• **Problem representation first**, then a **ranked differential** with **cannot-miss** items when red flags exist.  
• **Prevention and screening** are **risk-stratified**—know **who**, **when**, **stop rules**, and **borderline result** actions.  
• **Refer** when **scope**, **severity**, **diagnostic uncertainty**, or **therapy failure** exceeds safe outpatient management.  
• **Document reasoning** another clinician could continue—especially **uncertainty** and **monitoring**.  
• **Shared decision-making** is not optional when trade-offs matter—pair **options** with **follow-up** and **contingencies**.  
• **Labs** are interpreted in **context**—pattern + trajectory + clinical story beats isolated numbers.`,
    },
    {
      preTest: [
        {
          question:
            "Which approach best matches NP-level diagnostic reasoning in primary care when multiple diagnoses could explain the same chief complaint?",
          options: [
            "Commit to the first diagnosis that comes to mind and order a broad unrelated panel to be thorough.",
            "Build a ranked differential and choose targeted history, exam, and tests that discriminate among the leading alternatives.",
            "Avoid documenting uncertainty because it makes the chart look weak.",
            "Refer every patient with ambiguous symptoms to avoid decision-making.",
          ],
          correct: 1,
          rationale:
            "NP items reward structured reasoning: differentials, discriminators, and parsimonious testing—not premature closure or defensive over-testing.",
        },
        {
          question: "Which element is most central to defensible outpatient documentation for an NP?",
          options: [
            "A vague plan that says “follow up PRN” without specifics.",
            "Objective data, assessment reasoning, a specific plan, monitoring, and return precautions when risk exists.",
            "Only the problem list without assessment or plan.",
            "Copy-forward blocks from a prior visit without updating the story.",
          ],
          correct: 1,
          rationale:
            "Charts should communicate reasoning and follow-up clearly enough for continuity and safety—especially monitoring and escalation triggers.",
        },
        {
          question:
            "A patient declines a guideline-indicated screening test after a balanced discussion of benefits and harms. What is the best next step?",
          options: [
            "Document informed refusal, the discussion, alternatives, and a plan to revisit risks at a defined interval.",
            "Dismiss the patient as noncompliant and refuse further care.",
            "Secretly order the test anyway.",
            "Ignore the refusal because guidelines are absolute.",
          ],
          correct: 0,
          rationale:
            "Shared decision-making respects autonomy while documenting risks, alternatives, and follow-up—without coercion.",
        },
      ],
      postTest: [
        {
          question: "Which pattern best indicates iron deficiency anemia on a CBC when clinical context supports blood loss risk?",
          options: [
            "Macrocytic anemia with normal iron studies.",
            "Microcytic anemia with low ferritin (when provided) and compatible history.",
            "Isolated thrombocytopenia without anemia.",
            "Leukopenia with normal Hgb.",
          ],
          correct: 1,
          rationale:
            "Microcytic pattern with supporting iron studies and history is classic for iron deficiency—interpret as a pattern, not a single number.",
        },
        {
          question: "When is urgent ED referral most appropriate from primary care?",
          options: [
            "Stable mild symptoms without red flags and reliable follow-up tomorrow.",
            "Hemodynamic instability, suspected acute coronary syndrome, acute neuro deficit, or other time-sensitive threats.",
            "Routine medication refill without acute change.",
            "Patient preference for a shorter wait time without clinical indication.",
          ],
          correct: 1,
          rationale:
            "Referral urgency follows risk—life threats and time-sensitive conditions beat convenience or routine needs.",
        },
        {
          question: "What is the primary goal of shared decision-making for screening with meaningful trade-offs?",
          options: [
            "Persuade the patient regardless of values.",
            "Align decisions with patient values and documented understanding of benefits, harms, and alternatives.",
            "Avoid discussing harms to reduce anxiety.",
            "Delegate the conversation entirely to front staff.",
          ],
          correct: 1,
          rationale:
            "SDM integrates evidence with patient preferences and clear documentation—core to ethical primary care practice and many exam vignettes.",
        },
      ],
    }
  ),
  ca_np: t(
    "ca_np",
    {
      title: "NP foundations: clinical reasoning, prevention, and primary-care judgment (Canada / CNPLE-aligned)",
      seoTitle: "NP primary-care foundations | Canada NP & CNPLE | NurseNest",
      seoDescription:
        "Canadian NP preparation: diagnostic reasoning, prevention and screening principles, follow-up and referral thresholds, documentation, shared decision-making, and SI-friendly lab interpretation for primary care—aligned to interprofessional Canadian practice language.",
      clinical_meaning: `**Foundations in Canadian primary-care NP practice**  
CNPLE-aligned study still rewards the same cognitive spine: **problem framing**, **differential discipline**, **risk-appropriate testing**, and **follow-up you could hand to a colleague**. Canadian stems may emphasize **provincial standards**, **collaborative models**, and **metric labs**—translate unfamiliar units into **risk categories** before you eliminate answers.

**Prevention and screening**  
Canadian guidelines and program delivery differ by province, but exam logic stays consistent: **who benefits**, **harms**, **intervals**, and **what to do with abnormal results**. Watch for scenarios that test **over-screening**, **under-reaction** to high-risk features, or **equity** barriers (access, language, rural care).

**Documentation**  
NP notes should demonstrate **clinical reasoning** and **safety netting** in ways that withstand **interprofessional handoffs**—especially when transfer to acute care or specialty is considered.`,
      exam_relevance: `**How Canadian NP items may frame the same judgment**  
You will still see **next-step** questions where the key is **cannot-miss** features, **pregnancy**, **anticoagulation**, or **rapid progression**. Referral answers should respect **Canadian acute-care access** patterns in the vignette (ED versus urgent referral versus routine specialty).

**Shared decision-making**  
When screening trade-offs appear, choose answers that reflect **informed choice**, **documentation**, and **follow-up**—not coercion. Distractors may push **paternalism** or **silent assent** without discussion.

**Labs in SI**  
If you see **mmol/L** glucose, **eGFR** context, or **mmol/L** lipids, convert mentally to **risk** (hypo/hyperglycemia crisis thresholds, renal drug safety, severe dyslipidemia) rather than memorizing every conversion.`,
      clinical_scenario: `**Vignette — older adult with confusion and polydipsia (community)**  
The stem gives **metric glucose** and **sodium** trends, plus **orthostasis**. Your first job is **safety and site-of-care**: **volume status**, **infection sources**, **medications**, and **neuro** red flags. Referral thresholds point to **ED** when **severe hyperglycemia with ketosis risk**, **altered mentation with instability**, or **electrolyte emergencies** are implied—do not “watch at home” through those patterns.

**Follow-up discipline**  
If the scenario stays outpatient, specify **recheck timing**, **patient/caregiver education**, and **return precautions** for neuro change, vomiting, or inability to hydrate.

**Interprofessional note**  
Canadian items may include **pharmacist**, **RN**, or **physician** partners—choose answers that **collaborate** without **ambiguous scope**.`,
      takeaways: `• **Differential discipline** and **risk-first** thinking translate across US/Canada—labels change, **instability** does not.  
• **Screening** answers must match **risk**, **harms**, and **follow-up** for abnormal results.  
• **Refer** when **acute risk**, **diagnostic uncertainty beyond primary care**, or **treatment failure** demands it.  
• **Document reasoning, monitoring, and safety netting** clearly.  
• **SI labs** still test **pattern recognition** in **clinical context**.  
• **Shared decision-making** remains central when benefits/harms are balanced.`,
    },
    {
      preTest: [
        {
          question: "Which statement best reflects NP-appropriate diagnostic reasoning in primary care?",
          options: [
            "Order the largest panel available whenever unsure.",
            "Use a structured differential and targeted testing that changes management.",
            "Avoid follow-up because it increases liability.",
            "Rely on a single abnormal lab without clinical correlation.",
          ],
          correct: 1,
          rationale:
            "NP practice rewards parsimony, safety, and discriminators—broad panels without reasoning are classic distractors.",
        },
        {
          question: "What is the most important element when documenting a referral or escalation decision?",
          options: [
            "Only the specialist’s name.",
            "Objective findings, suspected diagnoses, urgency, and what you want the consultant to address.",
            "A subjective statement that the patient is ‘fine’.",
            "No documentation—verbal handoff only.",
          ],
          correct: 1,
          rationale:
            "Clear indication, urgency, and clinical data support safe transitions of care—common exam focus.",
        },
        {
          question: "In shared decision-making, what should be documented when a patient declines an evidence-based screen?",
          options: [
            "Nothing—decline is not important.",
            "The discussion, understanding, informed refusal, and follow-up plan.",
            "Pressure the patient until they agree.",
            "Chart ‘noncompliant’ without context.",
          ],
          correct: 1,
          rationale:
            "Respect autonomy and document the conversation, risks, and follow-up—professional and exam-correct.",
        },
      ],
      postTest: [
        {
          question: "Which situation most strongly warrants urgent ED referral from primary care?",
          options: [
            "Stable chronic follow-up with no acute change.",
            "Suspected acute coronary syndrome with ongoing chest pain and hemodynamic compromise.",
            "Routine prescription renewal.",
            "Mild cold symptoms in a reliable patient.",
          ],
          correct: 1,
          rationale:
            "Time-sensitive threats drive urgent escalation—classic NP judgment item.",
        },
        {
          question: "Why is MCV important when interpreting anemia on a CBC?",
          options: [
            "It is never useful.",
            "It helps classify microcytic vs macrocytic patterns and narrow the differential.",
            "It replaces the need for history.",
            "It always diagnoses leukemia.",
          ],
          correct: 1,
          rationale:
            "MCV patterning guides targeted workup—iron deficiency vs B12/folate vs mixed patterns.",
        },
        {
          question: "What is the primary purpose of explicit follow-up intervals in outpatient plans?",
          options: [
            "To satisfy billing only.",
            "To monitor response, catch failure early, and reinforce safety netting.",
            "To avoid seeing complex patients.",
            "To delay necessary referrals.",
          ],
          correct: 1,
          rationale:
            "Follow-up is clinical monitoring—not administrative filler—and exam items often test specific intervals and triggers.",
        },
      ],
    }
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

export function npPrimaryCareFoundationsHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpPrimaryCareFoundationsGoldLessonInput(pathwayId);
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

export function getNpPrimaryCareFoundationsGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const variantKey = PATHWAY_VARIANT[pathwayId];
  if (!variantKey) return null;
  const v = VARIANTS[variantKey];
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;

  const syn = synthesizeGoldPremiumSections({
    sharedCore: SHARED_CORE_BODY,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "NP certification preparation",
    labsDiagnostics: FOUNDATIONS_LABS_BODY,
    relatedSlugs: [
      "fnp-differential-primary-care",
      "clinical-judgment-prioritization-gold",
      "high-alert-medications-safety-gold",
    ],
    relatedTitlesBySlug: {
      "fnp-differential-primary-care": "Differential reasoning in primary care (FNP track)",
      "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
      "high-alert-medications-safety-gold": "High-alert medication safety",
    },
  });

  return {
    slug: NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
    title: v.title,
    topic: "NP foundations",
    topicSlug: "clinical-reasoning",
    bodySystem: "General",
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
