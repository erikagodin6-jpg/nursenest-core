/**
 * Obesity and metabolic syndrome — outpatient NP counseling, pharmacotherapy principles, and referral (US + Canada NP).
 * Stress-related overeating and cortisol/medication contributors are framed as **behavioral + medical** context, not psychiatry replacement.
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

export const NP_OBESITY_METABOLIC_MANAGEMENT_GOLD_SLUG = "np-obesity-metabolic-management-gold" as const;

const NP_TYPE2_SLUG = "np-type2-diabetes-outpatient-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Obesity as a chronic disease (outpatient NP)**  
Boards reward **BMI + waist** context, **comorbidity** (T2DM, HTN, OSA, NAFLD, osteoarthritis), and **staged management**: **intensive lifestyle**, **anti-obesity medications (AOM)** when indicated, and **metabolic/bariatric surgery referral** when **criteria** and **risk** align—avoid shaming answers or “just eat less” without structure.

**Behavior, stress, and sleep**  
**Chronic stress**, **shift work**, **depression**, and **sleep deprivation** worsen weight trajectories—items test whether you **screen** for mood/sleep, **address barriers**, and **coordinate** behavioral health when indicated (not diagnosing psychiatric illness beyond scope unless the stem defines NP PMHNP role).

**Pharmacology supporting weight (exam principles)**  
**GLP-1 agonists** and **dual incretins** appear as **weight + glycemic** tools—expect **GI side effects**, **pancreatitis** red-flag framing when the stem tests monitoring, and **contraindications** (personal/family medullary thyroid cancer history when mentioned). **Phentermine/topiramate**, **naltrexone/bupropion**, **orlistat** show up as **class-effect** knowledge, not retail dosing trivia.

**Glucocorticoids and antipsychotics**  
**Steroid-induced** weight gain and **metabolic syndrome** on **second-generation antipsychotics** require **monitoring** (glucose, lipids, weight) and **shared decision-making**—pair with **\`np-type2-diabetes-outpatient-gold\`** when **hyperglycemia** dominates.

**Referral thresholds**  
**Bariatric surgery** when **BMI** and **comorbidity** thresholds in the vignette match guideline-style indications and **multidisciplinary readiness**—not as a first-line answer for mild overweight without failed structured efforts when the stem emphasizes **conservative** steps first.`;

const OBESITY_LABS = `**Metabolic monitoring**  
**A1c**, **fasting glucose or OGTT** when **prediabetes/diabetes** suspected; **lipid panel** for **ASCVD** risk; **LFTs** when **NAFLD** risk; **TSH** when **hypothyroidism** could confound weight gain—**targeted** testing beats shotgun panels.

**OSA screening**  
**Epworth** or **STOP-Bang** themes may appear—**OSA** worsens **HTN** and **glycemic** control; referral for **sleep study** when high pretest probability.`;

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
      title: "Obesity & metabolic risk: outpatient NP management (US primary care)",
      seoTitle: "Obesity metabolic management | NP US | NurseNest",
      seoDescription:
        "NP obesity care: staged lifestyle, AOM class principles, comorbidity screening, stress/sleep integration, bariatric referral thresholds, and cardiometabolic monitoring—US board gaps filled.",
      clinical_meaning: `**FNP / AGPCNP / WHNP / PNP-PC**  
**WHNP** may embed **PCOS overlap** and **pregnancy** planning with weight goals; **PNP-PC** focuses on **family systems**, **growth charts**, and **pediatric specialty referral** when **severe obesity** with complications—avoid applying **adult BMI** thresholds to children in the same way.

**Shared decision-making**  
Choose answers that document **risks/benefits** of **AOM**, **realistic timelines**, and **measurable outcomes** (weight trend, waist, step counts, glucose/BP).`,
      exam_relevance: `Expect **next step** after BMI diagnosis: **comorbidity screen**, **behavioral plan**, **medication** selection when lifestyle insufficient, **contraindication** traps (pregnancy with teratogenic AOM unless stem allows), and **when bariatric referral** wins over endless med trials.

**Traps**  
• **Blaming** the patient.  
• **Ignoring** **OSA** or **depression** as modulators.  
• **Starting GLP-1** without **contraception counseling** when **pregnancy** possible and drug class requires it in the vignette.`,
      clinical_scenario: `**Vignette — BMI 38, HTN, prediabetes, knee pain, snoring**  
Address **weight-related comorbidities**, **OSA screen**, **structured nutrition/activity**, consider **AOM** or **GLP-1** if T2DM indications overlap, and **refer** **bariatric** evaluation when stem matches **criteria** after documented efforts.

**Stress vignette**  
High cortisol life context + **emotional eating** → **behavioral strategies**, **mental health** referral if **depression**, **sleep** assessment—still **screen** for **secondary** causes (hypothyroidism, medications).`,
      takeaways: `• **Stage** therapy to **risk** and **readiness**.  
• **Screen** OSA, glycemia, lipids, and **thyroid** when appropriate.  
• **AOM** choices integrate **comorbidity**, **tolerability**, and **safety**.  
• **Bariatric referral** follows **guideline-style** indications in stems.  
• Pair with **\`np-type2-diabetes-outpatient-gold\`** for **glucocorticoid** and **glycemic** overlap.`,
    },
    {
      preTest: [
        {
          question: "Which element is most important before intensifying obesity pharmacotherapy in a reproductive-age patient?",
          options: [
            "Ignore pregnancy possibility.",
            "Pregnancy intent, contraception counseling, and teratogenic risk by drug class when relevant.",
            "Avoid all discussion of fertility.",
            "Assume sterilization.",
          ],
          correct: 1,
          rationale:
            "Many anti-obesity agents require pregnancy prevention planning—common exam trap.",
        },
        {
          question: "Why screen for obstructive sleep apnea in patients with obesity and hypertension?",
          options: [
            "OSA never affects metabolism.",
            "OSA worsens BP and glycemic control; treatment can improve cardiometabolic risk.",
            "OSA is diagnosed only in underweight patients.",
            "Sleep is irrelevant to weight.",
          ],
          correct: 1,
          rationale:
            "OSA is a common comorbidity that changes management when identified.",
        },
        {
          question: "Which approach matches NP-level obesity counseling?",
          options: [
            "Shame-based messaging.",
            "Structured goals, barrier assessment, comorbidity treatment, and follow-up metrics.",
            "Surgery for anyone with BMI >25.",
            "Diet pills without lifestyle discussion.",
          ],
          correct: 1,
          rationale:
            "Chronic disease framing with structured follow-up beats blame or one-step fixes.",
        },
      ],
      postTest: [
        {
          question: "When is metabolic/bariatric surgery most appropriate in exam vignettes?",
          options: [
            "Mild overweight without comorbidities.",
            "BMI and comorbidity thresholds met, multidisciplinary evaluation, and failed structured conservative therapy when stem requires it.",
            "First-line for everyone.",
            "Never refer from primary care.",
          ],
          correct: 1,
          rationale:
            "Referral follows indications and readiness—boards test thresholds and preparation.",
        },
        {
          question: "Why evaluate for secondary causes of weight gain (e.g., hypothyroidism, medications)?",
          options: [
            "Secondary causes never exist.",
            "Treatable contributors change management and outcomes.",
            "Only children need evaluation.",
            "Medications never cause weight gain.",
          ],
          correct: 1,
          rationale:
            "Medication-induced and endocrine causes are high-yield primary-care concepts.",
        },
        {
          question: "Which statement reflects integration of stress and mental health in obesity care?",
          options: [
            "Ignore mood because obesity is purely willpower.",
            "Screen for depression/anxiety, address sleep and stress, and refer when needed alongside medical management.",
            "Start stimulants for everyone.",
            "Avoid any mental health referral.",
          ],
          correct: 1,
          rationale:
            "Behavioral health and sleep modulate adherence and weight—NP items reward integrated care.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Obesity & metabolic risk: primary care management (Canadian NP / CNPLE-aligned)",
      seoTitle: "Obesity metabolic care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: weight-related comorbidity screening, collaborative bariatric pathways, metric labs, and behavioral integration with interprofessional teams.",
      clinical_meaning: `**Canadian systems**  
Referral pathways for **bariatric** programs and **dietitian** supports vary—choose answers that **document** indication and **coordinate** care rather than improvising unsupported surgery referrals.`,
      exam_relevance: `Expect **comorbidity-driven** management, **AOM** safety in context, and **SI** lab interpretation for **lipids/glucose** when shown.`,
      clinical_scenario: `**Vignette — rising weight with new prediabetes**  
Integrate **nutrition/activity**, **sleep**, **stress**, **OSA** screen, and **metformin** or **GLP-1** considerations per **T2DM** guidelines when diabetes emerges—link to **\`np-type2-diabetes-outpatient-gold\`**.`,
      takeaways: `• **Stage** care and **screen** comorbidities.  
• **Integrate** mental health and sleep.  
• **Refer** bariatric/metabolic surgery when **criteria** and **readiness** match the stem.  
• **Collaborate** with **dietitian** and **specialty** programs.`,
    },
    {
      preTest: [
        {
          question: "Which monitoring is most appropriate when initiating GLP-1 therapy for obesity/diabetes overlap?",
          options: [
            "No follow-up.",
            "GI tolerance, glycemia, weight trend, and contraindication screening per stem.",
            "Only daily weights forever without labs.",
            "Stop all other cardiometabolic meds automatically.",
          ],
          correct: 1,
          rationale:
            "Structured monitoring and safety screening are core to incretin therapy items.",
        },
        {
          question: "Why ask about antipsychotic use in a patient gaining weight rapidly?",
          options: [
            "Psychiatric meds never affect weight.",
            "Metabolic monitoring and medication review can identify modifiable contributors.",
            "Stop psychiatric meds without planning.",
            "Ignore glucose because psychiatry manages it.",
          ],
          correct: 1,
          rationale:
            "Second-generation antipsychotics carry metabolic risk—NP primary care integrates monitoring.",
        },
        {
          question: "Which patient needs sleep apnea evaluation most urgently?",
          options: [
            "Thin patient without symptoms.",
            "Obesity, loud snoring, daytime somnolence, and resistant hypertension.",
            "Mild fatigue after vacation.",
            "Normal BMI athlete.",
          ],
          correct: 1,
          rationale:
            "High pretest probability clusters warrant screening—exam classic stem.",
        },
      ],
      postTest: [
        {
          question: "What is the primary goal of documenting obesity management plans?",
          options: [
            "Billing only.",
            "Measurable targets, comorbidity screening, follow-up, and shared decision-making.",
            "Blame documentation.",
            "Avoid follow-up.",
          ],
          correct: 1,
          rationale:
            "Defensible chronic disease management requires clear plans and intervals.",
        },
        {
          question: "Which comorbidity most strongly supports aggressive weight loss strategies when indicated?",
          options: [
            "Mild cosmetic concern.",
            "Uncontrolled T2DM, severe OSA, or NAFLD with fibrosis risk per stem.",
            "Remote history of resolved ankle sprain.",
            "Preference alone without risk.",
          ],
          correct: 1,
          rationale:
            "Comorbidity burden drives intensity—boards test risk-based escalation.",
        },
        {
          question: "How should chronic stress be addressed in obesity care items?",
          options: [
            "Ignore completely.",
            "Assess contributors, sleep, mood, and refer to behavioral support when appropriate alongside medical management.",
            "Prescribe benzodiazepines for everyone.",
            "Recommend skipping meals.",
          ],
          correct: 1,
          rationale:
            "Stress and mood interact with adherence—integrated answers win.",
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

export function npObesityMetabolicManagementHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpObesityMetabolicManagementGoldLessonInput(pathwayId);
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

export function getNpObesityMetabolicManagementGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Obesity & metabolic risk: primary care (${suf})`,
          seoTitle: `Obesity metabolic management | ${lab} | NurseNest`,
          seoDescription: `${lab} staged obesity therapy, AOM principles, OSA and mental health integration, and bariatric referral thresholds.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Obesity & metabolic risk: primary care (${suf})`,
            seoTitle: `Obesity metabolic management | ${lab} | NurseNest`,
            seoDescription: `${lab} collaborative weight management with comorbidity screening and referral pathways.`,
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
    labsDiagnostics: OBESITY_LABS,
    relatedSlugs: [NP_TYPE2_SLUG, "fnp-adult-hypertension-intensification"],
    relatedTitlesBySlug: {
      [NP_TYPE2_SLUG]: "Type 2 diabetes outpatient management",
      "fnp-adult-hypertension-intensification": "Adult hypertension intensification (FNP)",
    },
  });

  return {
    slug: NP_OBESITY_METABOLIC_MANAGEMENT_GOLD_SLUG,
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
