/**
 * Type 2 diabetes — outpatient NP management (US + Canada NP primary-care tracks).
 * Fills ambulatory gaps vs DKA/HHS emergency gold: A1c interpretation, first-line therapy,
 * cardiorenal protective classes, hypoglycemia prevention, sick-day rules, and steroid/stress hyperglycemia.
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
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";

export const NP_TYPE2_DIABETES_OUTPATIENT_GOLD_SLUG = "np-type2-diabetes-outpatient-gold" as const;

const DKA_HHS_SLUG = "dka-hhs-hyperglycemic-emergencies-gold" as const;
const MED_INSULIN_SLUG = "med-family-insulin-diabetes-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Type 2 diabetes as an ambulatory NP construct**  
Boards reward **diagnosis criteria** (A1c, fasting glucose, random glucose with symptoms, OGTT when the stem uses it), **risk stratification** (ASCVD, HF, CKD, hypoglycemia risk, pregnancy intent), and **stepwise pharmacotherapy** aligned to **comorbidity**—not memorizing one universal A1c goal.

**Lifestyle and shared decision-making**  
**Nutrition, activity, sleep, and weight trajectory** are first-line for many patients—items test whether you **set measurable goals**, **address barriers**, and **document** informed choices when glycemic targets trade off with hypoglycemia risk or frailty.

**First-line pharmacology (principles)**  
**Metformin** when not contraindicated; add **cardiorenal protective** agents when **indicated by comorbidity** (SGLT2/GLP-1 classes in many contemporary stems). Expect **renal dose adjustment** questions, **eGFR thresholds**, **ketoacidosis risk counseling** with SGLT2 when relevant, and **GI tolerance** with GLP-1 agonists.

**Hypoglycemia prevention**  
Sulfonylureas and insulin raise **hypoglycemia** risk—pair with **SMBG/CGM** when the vignette includes intensive regimens, **sick-day education**, and **medication review** after hospitalization or steroid bursts.

**Steroids, illness, and stress hyperglycemia**  
**Glucocorticoids** and **acute illness** raise glucose—boards test **more frequent monitoring**, **temporary regimen intensification** when authorized, **DKA/HHS return precautions**, and **when ED evaluation** beats phone advice.

**Screening cascade**  
**Retinopathy**, **nephropathy** (UACR), **neuropathy**, **BP and lipids**—NP items punish “optimize A1c” without **complication screening** or **BP control** when the stem provides end-organ risk.`;

const T2DM_LABS_MONITORS = `**A1c**  
Reflects **~3-month** glycemic exposure; misleading with **hemoglobinopathies**, **anemia**, **pregnancy**, or **recent transfusion**—the stem often hints. Use A1c to **trend therapy**, not as a single numeric victory without **hypoglycemia** context.

**Renal function**  
**eGFR** drives **metformin safety**, **SGLT2** candidacy, and **dose adjustments**. **Rising creatinine** after RAAS/SGLT2 initiation may be context-dependent—items test **monitoring intervals** and **when to pause** versus emergency.

**UACR / albuminuria**  
**CKD staging** and **nephroprotection** decisions appear when proteinuria is present—link to **BP targets** and **medication class** choices in the vignette.

**Lipids and ASCVD**  
**Statin intensity** often pairs with diabetes as **ASCVD risk enhancer**—choose answers that integrate **LDL**, **age**, and **prior events** rather than treating glucose alone.`;

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
      title: "Type 2 diabetes: outpatient diagnosis, goals, and therapy (NP, US primary care)",
      seoTitle: "Type 2 diabetes outpatient care | NP US | NurseNest",
      seoDescription:
        "NP-level T2DM: A1c goals by risk, metformin and add-on principles, SGLT2/GLP-1 cardiorenal themes, hypoglycemia prevention, sick-day rules, and steroid/illness hyperglycemia—aligned to US NP boards.",
      clinical_meaning: `**FNP / AGPCNP / WHNP / PNP-PC**  
**PNP-PC** may embed **prediabetes**, **T2DM in youth**, and **family systems**. **WHNP** may include **pregnancy planning** and **gestational-risk** counseling. **AGPCNP** often foreground **older adults** with **frailty** where **tight control** harms more than helps.

**Goals**  
Individualize **A1c** and **avoid hypoglycemia** in **elderly** or **CKD** when stems emphasize **falls**, **cognitive** concerns, or **limited reserve**.`,
      exam_relevance: `Expect **next-step** after diagnosis, **medication choice** given **HF/CKD/ASCVD**, **DKA recognition** when ill (redirect to emergency content), **insulin initiation** when oral therapy fails or **hyperglycemic crisis** risk is high, and **follow-up** intervals after changes.

**Traps**  
• **Tight A1c** despite recurrent hypoglycemia.  
• **Starting SGLT2** without **volume** or **infection** context when contraindicated.  
• **Ignoring** **retinopathy screening** when duration and age warrant it.`,
      clinical_scenario: `**Vignette — 56-year-old, new A1c 8.2%, BMI 34, BP 148/88, eGFR 72, no h/o ASCVD**  
**Fork** — lifestyle + **metformin** if appropriate; assess **ASCVD/HF/CKD** risk for **second-line** class selection; plan **retinopathy/UACR** screening and **BP** management; **follow-up** 3 months with **specific** labs.

**Steroid vignette**  
Prednisone burst for asthma flare with **rising glucose** → **monitoring plan**, **med adjustment** per protocol, **sick-day teaching**, **DKA precautions**.`,
      takeaways: `• **Individualize** glycemic targets by age, comorbidity, and hypoglycemia risk.  
• **Choose** medication class with **cardiorenal** and **weight** context when stems provide it.  
• **Screen** for complications and **treat BP/lipids** as integrated cardiometabolic care.  
• **Sick-day** and **steroid** plans reduce DKA/HHS—escalate when **ketosis**, **severe dehydration**, or **altered mentation** appear.  
• Pair with **\`dka-hhs-hyperglycemic-emergencies-gold\`** and **\`med-family-insulin-diabetes-gold\`** for emergency and pharmacology depth.`,
    },
    {
      preTest: [
        {
          question: "Which factor most strongly supports individualizing a less stringent A1c target in older adults?",
          options: [
            "Desire to avoid all medications.",
            "High hypoglycemia risk, limited life expectancy, or major frailty/falls concerns.",
            "Mild diet nonadherence alone without comorbidity.",
            "Patient preference for tighter control without risks.",
          ],
          correct: 1,
          rationale:
            "Guidelines emphasize balancing glycemic benefit with hypoglycemia and harm in frail or high-risk older adults.",
        },
        {
          question: "Why are SGLT2 inhibitors often prioritized in T2DM when HF or CKD is present (exam framing)?",
          options: [
            "They replace lifestyle counseling.",
            "They provide cardiorenal benefits beyond glycemic lowering in many patients when appropriate and monitored.",
            "They are safe in every eGFR without monitoring.",
            "They eliminate hypoglycemia risk entirely.",
          ],
          correct: 1,
          rationale:
            "Contemporary stems test class selection for organ protection—always pair with monitoring and contraindication awareness.",
        },
        {
          question: "A patient on metformin is started on prednisone for 10 days. What is the best outpatient teaching emphasis?",
          options: [
            "Stop all diabetes medications.",
            "More frequent glucose monitoring, sick-day rules, and follow-up for hyperglycemia escalation.",
            "Ignore glucose because steroids are short.",
            "Double metformin automatically.",
          ],
          correct: 1,
          rationale:
            "Steroids raise glucose; monitoring and plan adjustment reduce DKA/HHS risk—per protocol and follow-up.",
        },
      ],
      postTest: [
        {
          question: "Which finding should prompt urgent evaluation rather than routine outpatient follow-up?",
          options: [
            "Mild post-meal glucose elevation without symptoms.",
            "Vomiting with positive ketones, altered mentation, and severe hyperglycemia.",
            "Stable A1c at goal without hypoglycemia.",
            "Request for refill without acute symptoms.",
          ],
          correct: 1,
          rationale:
            "Possible DKA/HHS requires urgent care—outpatient titration is inappropriate when ketosis and altered mentation appear.",
        },
        {
          question: "What is the primary purpose of UACR screening in T2DM?",
          options: [
            "Diagnose urinary tract infection.",
            "Detect diabetic kidney disease risk and guide nephroprotective therapy.",
            "Replace A1c monitoring.",
            "Measure hydration status only.",
          ],
          correct: 1,
          rationale:
            "Albuminuria identifies CKD risk and informs RAAS/SGLT2 decisions in many patients.",
        },
        {
          question: "Which statement best reflects shared decision-making for GLP-1 therapy?",
          options: [
            "Ignore GI side effects.",
            "Discuss benefits (weight, glycemia) vs GI adverse effects, adherence, and monitoring—then document the plan.",
            "Use only if A1c >10%.",
            "Avoid in anyone with obesity.",
          ],
          correct: 1,
          rationale:
            "GLP-1 choices integrate efficacy, tolerability, comorbidity, and patient preference—common NP item.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Type 2 diabetes: outpatient management (Canadian NP / CNPLE-aligned)",
      seoTitle: "Type 2 diabetes primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: T2DM diagnosis and targets, collaborative prescribing, SI glucose contexts, prevention screening, and safe escalation for hyperglycemic emergencies.",
      clinical_meaning: `**Canadian practice framing**  
Use **collaborative** models and **metric labs** as the stem provides. **Targets** still individualize around **hypoglycemia**, **frailty**, and **comorbidity**—labels differ, **risk** does not.`,
      exam_relevance: `Expect **class selection** with **renal function**, **HF**, **CKD**, and **hypoglycemia** traps. **Referral** to **endocrinology** or **nephrology** when **progressive complications** or **refractory** disease appears.`,
      clinical_scenario: `**Vignette — middle-aged adult with new hyperglycemia**  
Build **diagnostic confirmation**, **education**, **initial therapy**, **screening plan**, and **follow-up**—with **clear** return precautions for **hyperglycemic crisis** symptoms.`,
      takeaways: `• **Individualize** targets and therapy to **risk** and **comorbidity**.  
• **Integrate** BP, lipids, and **renal** monitoring into diabetes care.  
• **Sick-day** and **steroid** hyperglycemia plans reduce harm.  
• **Escalate** for **DKA/HHS** features.  
• Use **\`med-family-insulin-diabetes-gold\`** for pharmacology drill pairs.`,
    },
    {
      preTest: [
        {
          question: "Which approach matches Canadian primary-care NP documentation for diabetes management?",
          options: [
            "Goals, rationale, monitoring, and follow-up without assessment.",
            "Assessment, individualized targets, plan, monitoring, and safety netting.",
            "Insulin dosing without glucose context.",
            "Avoid screening for complications.",
          ],
          correct: 1,
          rationale:
            "Defensible charts include reasoning, monitoring, and follow-up—core exam expectation.",
        },
        {
          question: "Why monitor renal function when prescribing SGLT2 inhibitors?",
          options: [
            "Creatinine never changes.",
            "eGFR guides initiation/contraindications and monitoring for acute kidney injury context.",
            "SGLT2 is only for type 1 diabetes.",
            "Renal labs are optional forever.",
          ],
          correct: 1,
          rationale:
            "Renal status informs safe use and monitoring—common exam point.",
        },
        {
          question: "When should metformin be avoided or used cautiously?",
          options: [
            "In every older adult.",
            "When eGFR is below guideline thresholds or acute conditions increase lactic acidosis risk—per stem.",
            "Never—metformin is universal.",
            "Only in pregnancy without qualification.",
          ],
          correct: 1,
          rationale:
            "Renal and acute illness contexts change metformin safety—read the stem carefully.",
        },
      ],
      postTest: [
        {
          question: "Which patient needs urgent ED evaluation for hyperglycemia?",
          options: [
            "Mild post-prandial elevation without symptoms.",
            "Altered mentation, vomiting, and ketosis concern with severe hyperglycemia.",
            "Stable A1c at goal.",
            "Diet question without acute illness.",
          ],
          correct: 1,
          rationale:
            "DKA/HHS patterns require urgent care—not routine outpatient adjustment.",
        },
        {
          question: "What is the primary goal of combining BP and lipid management in T2DM?",
          options: [
            "Replace glucose control entirely.",
            "Reduce macrovascular and microvascular risk as an integrated cardiometabolic plan.",
            "Avoid statins in all diabetes patients.",
            "Ignore A1c when BP is normal.",
          ],
          correct: 1,
          rationale:
            "Diabetes care is multifactorial—exam items integrate risk reduction beyond glucose alone.",
        },
        {
          question: "Why ask about pregnancy intent in reproductive-age patients with T2DM?",
          options: [
            "Pregnancy never changes diabetes management.",
            "Preconception glucose optimization and teratogenic medication review reduce fetal risk.",
            "Stop all diabetes meds preconception without planning.",
            "Only men need counseling.",
          ],
          correct: 1,
          rationale:
            "Preconception counseling is high-yield in WHNP/FNP stems—glycemic and medication safety.",
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

const NP_PRIMARY_PATHWAYS = new Set([
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
]);

export function npType2DiabetesOutpatientHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpType2DiabetesOutpatientGoldLessonInput(pathwayId);
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

export function getNpType2DiabetesOutpatientGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const variantKey = PATHWAY_VARIANT[pathwayId];
  if (!variantKey) return null;
  const base = VARIANTS[variantKey];
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;

  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  const v =
    NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "us_np"
      ? {
          ...base,
          title: `Type 2 diabetes: outpatient management (${suf})`,
          seoTitle: `Type 2 diabetes primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} ambulatory T2DM: goals, therapy selection, monitoring, and crisis precautions for NP certification.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Type 2 diabetes: outpatient management (${suf})`,
            seoTitle: `Type 2 diabetes primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} community diabetes management with collaborative referral and emergency thresholds.`,
          }
        : base;

  const syn = synthesizeGoldPremiumSections({
    sharedCore: SHARED_CORE_BODY,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "NP certification preparation",
    labsDiagnostics: T2DM_LABS_MONITORS,
    relatedSlugs: [DKA_HHS_SLUG, MED_INSULIN_SLUG, NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG],
    relatedTitlesBySlug: {
      [DKA_HHS_SLUG]: "DKA & HHS hyperglycemic emergencies",
      [MED_INSULIN_SLUG]: "Insulin & diabetes medications",
      [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG]: "NP primary-care foundations",
    },
  });

  return {
    slug: NP_TYPE2_DIABETES_OUTPATIENT_GOLD_SLUG,
    title: v.title,
    topic: "Diabetes & metabolic",
    topicSlug: "diabetes-metabolic",
    bodySystem: "Endocrine",
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
