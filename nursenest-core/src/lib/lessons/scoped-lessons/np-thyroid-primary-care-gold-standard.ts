/**
 * Thyroid disorders — outpatient NP primary care (hypothyroidism, hyperthyroidism patterns, subclinical decisions, pregnancy TSH).
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

export const NP_THYROID_PRIMARY_CARE_GOLD_SLUG = "np-thyroid-primary-care-gold" as const;

const NP_TYPE2_SLUG = "np-type2-diabetes-outpatient-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Thyroid testing in primary care**  
Items integrate **TSH** with **free T4** (and sometimes **T3**) to distinguish **primary hypothyroidism**, **hyperthyroidism**, **subclinical** states, and **non-thyroidal illness** patterns when the stem provides **acute illness** or **pregnancy** context.

**Hypothyroidism (levothyroxine principles)**  
**Levothyroxine** is usual replacement—boards test **empty stomach / separation** from interfering meds/foods, **pregnancy dose increases**, **elderly/coronary disease** initiation caution, and **follow-up TSH** timing after dose changes. **Subclinical hypothyroidism** decisions hinge on **TSH magnitude**, **symptoms**, **pregnancy intent**, **age**, and **ASCVD** risk—avoid reflex overtreatment or neglect when the stem signals benefit.

**Hyperthyroidism recognition**  
**Graves** patterns include **goiter**, **ophthalmopathy** when shown, **thyrotoxicosis** symptoms. **Thyroiditis** may be **painful** (subacute) or **painless/postpartum**—management differs from **Graves**. **Thyroid storm** is **emergency**—stabilize and **escalate**, not “increase outpatient beta-blocker alone” when **hemodynamic** compromise appears.

**Thyroid nodules and cancer risk**  
**TIRADS/ultrasound** referral themes appear when **rapid growth**, **compressive symptoms**, **hard fixed nodule**, or **lymphadenopathy**—choose **timely** endocrine/surgical referral over reassurance.

**Stress, steroids, and “sick euthyroid”**  
**Critical illness** can **suppress** TSH/T3 patterns—avoid aggressive levothyroxine titration based on **one abnormal** lab during **acute hospitalization** unless the stem defines **clear primary hypothyroidism** and safety.

**Pregnancy (WHNP / FNP overlap)**  
**Trimester-specific TSH** targets and **levothyroxine** adjustment appear—coordinate **OB** when **hyperthyroid** therapy involves **PTU vs methimazole** timing in **early pregnancy** per stem.`;

const THYROID_LABS = `**TSH / free T4**  
**Primary hypothyroidism**: high TSH + low free T4. **Subclinical hypothyroidism**: high TSH with **normal** free T4—decisions are **risk/symptom** driven. **Hyperthyroidism**: **suppressed TSH** with **high** free T4/T3 when measured.

**Antibodies (when stem includes)**  
**TPOAb** supports **autoimmune** hypothyroidism; **TRAb** supports **Graves** when provided—use as **supporting**, not sole, data.

**Drug and iodine effects**  
**Amiodarone**, **lithium**, **interferon**, **immune checkpoint inhibitors** can disturb thyroid tests—items reward **history** before blaming “lab error.”`;

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
      title: "Thyroid disorders: outpatient diagnosis and management (NP, US primary care)",
      seoTitle: "Thyroid primary care | NP US | NurseNest",
      seoDescription:
        "NP thyroid: TSH/T4 interpretation, levothyroxine use, subclinical decisions, Graves vs thyroiditis cues, nodule red flags, pregnancy TSH, and emergency escalation for thyroid storm.",
      clinical_meaning: `**NP scope**  
You **order and interpret** thyroid tests in ambulatory care, **initiate/adjust** levothyroxine for **overt** hypothyroidism when appropriate, **refer** hyperthyroidism and **nodules** with concerning features, and **coordinate** with OB/endocrine for **pregnancy** and **storm** risk.

**WHNP** items may foreground **preconception** and **trimester** targets; **PNP-PC** may include **congenital** hypothyroidism **follow-up** themes at a principles level when hinted.`,
      exam_relevance: `Expect **next test** (antibodies, imaging referral), **therapy start/titration**, **subclinical** watch vs treat, **beta-blocker** for symptomatic hyperthyroidism while awaiting specialty care, and **storm** vs **anxiety** differentiation.

**Traps**  
• **Treating** abnormal TSH in **acute illness** without **clinical correlation**.  
• **Ignoring** **pregnancy** trimester rules.  
• **Missing** **compressive** or **malignant** nodule features.`,
      clinical_scenario: `**Vignette — fatigue, weight gain, cold intolerance, TSH 22, free T4 low**  
**Overt hypothyroidism**—start/replace **levothyroxine** with **follow-up TSH** interval, **education**, and **pregnancy** query if reproductive age.

**Vignette — palpitations, tremor, weight loss, TSH suppressed, free T4 high**  
**Hyperthyroidism**—**referral** for definitive therapy vs antithyroid drugs per stem; **symptom control** and **avoiding** harmful options in **pregnancy** without OB/endocrine alignment.`,
      takeaways: `• **Pattern recognition** on TSH/T4 beats memorizing isolated cutoffs.  
• **Levothyroxine** requires **monitoring** and **pregnancy** dose awareness.  
• **Hyperthyroidism** and **nodules** often need **specialist** partnership.  
• **Thyroid storm** = **emergency**.  
• **Stress/illness** changes interpretation—avoid blind titration.`,
    },
    {
      preTest: [
        {
          question: "Which pattern best describes primary overt hypothyroidism?",
          options: [
            "Low TSH and high free T4.",
            "High TSH and low free T4.",
            "Normal TSH and normal free T4.",
            "Low TSH and low free T4 with pituitary disease only.",
          ],
          correct: 1,
          rationale:
            "Primary hypothyroidism shows elevated TSH with low free T4 when measured.",
        },
        {
          question: "Why is levothyroxine often taken on an empty stomach?",
          options: [
            "To improve absorption consistency.",
            "To increase appetite.",
            "To prevent hypoglycemia.",
            "To avoid sleep.",
          ],
          correct: 0,
          rationale:
            "Food and some medications reduce absorption consistency—common counseling point.",
        },
        {
          question: "Which feature most strongly suggests referral for thyroid nodule evaluation?",
          options: [
            "Stable tiny nodule for 10 years without change.",
            "Rapid enlargement, hoarseness, or hard fixed mass with lymphadenopathy.",
            "Mild fatigue without exam findings.",
            "Normal TSH without nodule.",
          ],
          correct: 1,
          rationale:
            "Red-flag features warrant imaging/specialist evaluation—not reassurance alone.",
        },
      ],
      postTest: [
        {
          question: "What is the best initial step when thyroid storm is suspected?",
          options: [
            "Outpatient levothyroxine increase.",
            "Emergency evaluation and stabilization with specialty involvement.",
            "Ignore if patient is anxious.",
            "Start high-dose iodine without assessment.",
          ],
          correct: 1,
          rationale:
            "Thyroid storm is life-threatening—urgent care and coordinated therapy.",
        },
        {
          question: "Subclinical hypothyroidism management most depends on:",
          options: [
            "TSH value alone without context.",
            "TSH magnitude, symptoms, age, pregnancy intent, and comorbid risk.",
            "Treating everyone with any TSH elevation.",
            "Avoiding all follow-up.",
          ],
          correct: 1,
          rationale:
            "Decisions are individualized—common board trap to overtreat or ignore.",
        },
        {
          question: "Why ask about pregnancy in a reproductive-age patient starting levothyroxine?",
          options: [
            "Pregnancy never changes thyroid management.",
            "Dose needs often increase early in pregnancy with closer TSH monitoring.",
            "Levothyroxine is always stopped in pregnancy.",
            "TSH is irrelevant in pregnancy.",
          ],
          correct: 1,
          rationale:
            "Gestational hypothyroidism management protects fetal neurodevelopment—WHNP/FNP high yield.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Thyroid disorders: primary care management (Canadian NP / CNPLE-aligned)",
      seoTitle: "Thyroid primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: thyroid testing interpretation, collaborative levothyroxine management, referral for hyperthyroidism and nodules, and SI lab contexts.",
      clinical_meaning: `**Collaborative Canadian practice**  
NP items emphasize **shared care** with **family medicine** and **endocrinology**, **clear documentation**, and **metric lab** interpretation as risk—not memorizing non-SI trivia.`,
      exam_relevance: `Expect **referral thresholds**, **pregnancy** coordination, and **acute** escalation for **storm** or **severe** hyperthyroid symptoms.`,
      clinical_scenario: `**Vignette — abnormal TSH in routine screening**  
Interpret **pattern**, **repeat** if **non-thyroidal illness** possible, **initiate** therapy when **overt** hypothyroidism fits, **observe** or **treat** **subclinical** per risk, and **refer** **hyperthyroid** patterns.`,
      takeaways: `• **Integrate** history with **TSH/T4** patterns.  
• **Monitor** levothyroxine with **timed** follow-up.  
• **Refer** concerning **nodules** and **hyperthyroidism** needing definitive therapy.  
• **Emergency** for **storm** features.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs urgent referral or ED evaluation for thyroid disease?",
          options: [
            "Stable hypothyroidism on stable levothyroxine dose.",
            "Suspected thyroid storm with fever, altered mentation, and cardiovascular instability.",
            "Mild TSH elevation without symptoms and normal free T4 on repeat.",
            "Routine refill visit.",
          ],
          correct: 1,
          rationale:
            "Thyroid storm and severe instability require urgent care.",
        },
        {
          question: "Why repeat thyroid tests sometimes before changing therapy?",
          options: [
            "Labs are never wrong.",
            "Acute illness and medications can transiently distort TSH/T4—confirm pattern when appropriate.",
            "Always treat on one random TSH.",
            "Never monitor symptoms.",
          ],
          correct: 1,
          rationale:
            "Non-thyroidal illness and timing affect interpretation—exam trap to overtreat a single lab.",
        },
        {
          question: "Which symptom cluster suggests hyperthyroidism rather than primary depression alone?",
          options: [
            "Weight gain and bradycardia.",
            "Weight loss, tremor, palpitations, and heat intolerance with suppressed TSH.",
            "Stable chronic fatigue without autonomic symptoms.",
            "Isolated insomnia without exam findings.",
          ],
          correct: 1,
          rationale:
            "Hypermetabolic symptoms with biochemical thyrotoxicosis support hyperthyroidism workup.",
        },
      ],
      postTest: [
        {
          question: "What is the primary monitoring target for primary hypothyroidism on levothyroxine?",
          options: [
            "TSH to guide dose titration once euthyroid state is approached.",
            "Only free T3 daily.",
            "Random glucose.",
            "HbA1c exclusively.",
          ],
          correct: 0,
          rationale:
            "TSH guides replacement dosing in primary hypothyroidism in most ambulatory scenarios.",
        },
        {
          question: "When is endocrinology referral most appropriate from primary care?",
          options: [
            "Stable mild hypothyroidism responding to levothyroxine.",
            "Graves disease needing definitive therapy planning, pregnancy with uncontrolled hyperthyroidism, or large/complex nodules.",
            "Routine wellness visit without thyroid disease.",
            "Isolated mild TSH fluctuation without symptoms and normal free T4.",
          ],
          correct: 1,
          rationale:
            "Complex hyperthyroidism, pregnancy with uncontrolled disease, and concerning nodules warrant specialist care.",
        },
        {
          question: "Why differentiate Graves disease from painless thyroiditis when both show thyrotoxicosis?",
          options: [
            "Management is always identical forever.",
            "Antithyroid therapy may be central in Graves, while thyroiditis often needs symptom control and monitoring for phase changes.",
            "Thyroiditis never causes symptoms.",
            "Graves never needs referral.",
          ],
          correct: 1,
          rationale:
            "Disease mechanism changes treatment duration and monitoring—boards love this fork.",
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

export function npThyroidPrimaryCareHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpThyroidPrimaryCareGoldLessonInput(pathwayId);
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

export function getNpThyroidPrimaryCareGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Thyroid disorders: primary care (${suf})`,
          seoTitle: `Thyroid primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} outpatient thyroid testing, replacement therapy, referral triggers, and pregnancy-related care.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Thyroid disorders: primary care (${suf})`,
            seoTitle: `Thyroid primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} collaborative thyroid management with referral thresholds and SI lab interpretation.`,
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
    labsDiagnostics: THYROID_LABS,
    relatedSlugs: [NP_TYPE2_SLUG, "adrenal-crisis-addisonian-gold"],
    relatedTitlesBySlug: {
      [NP_TYPE2_SLUG]: "Type 2 diabetes outpatient management",
      "adrenal-crisis-addisonian-gold": "Adrenal crisis (Addisonian) recognition",
    },
  });

  return {
    slug: NP_THYROID_PRIMARY_CARE_GOLD_SLUG,
    title: v.title,
    topic: "Endocrine",
    topicSlug: "endocrine",
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
