/**
 * Anxiety, depression, and PTSD in primary-care NP practice — screening, initial pharmacotherapy principles,
 * trauma-informed safety, and **therapy referral** (CPT/PE/EMDR as **specialty** roles, not NP psychotherapy depth).
 * Draws on standard **evidence-based psychotherapy** summaries (CBT, trauma-focused modalities, PCL/PHQ/GAD tools)
 * translated to **NP board-style** outpatient decisions.
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

export const NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG = "np-mental-health-anxiety-depression-ptsd-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Primary-care NP scope for common mood and anxiety disorders**  
NP items test **recognition**, **severity stratification**, **evidence-aligned first-line treatments**, **monitoring**, **safety**, and **referral**—not 12-session manualized psychotherapy protocols. You **collaborate** with therapists trained in **CBT**, **trauma-focused** care (**CPT**, **PE**, **EMDR**) when indicated; your job is often **initiation**, **medical stabilization**, **screening**, and **care coordination**.

**Depression (MDD)**  
Use **PHQ-9** (or equivalent) trends when the stem provides scores—**suicidal ideation** questions are non-negotiable. First-line **SSRIs** for many adults; **SNRIs** when comorbid pain; **bupropion** when smoking cessation or sexual side-effect patterns fit; **avoid** dangerous polypharmacy. **Follow-up** for adverse effects (GI, activation, sexual dysfunction, hyponatremia in older adults) and **response** at **2–4+ weeks** depending on vignette.

**Generalized anxiety (GAD)**  
**GAD-7** severity; **SSRIs/SNRIs** are common first-line pharmacotherapy; **benzodiazepines** are **short-term/cautious** when at all—items love **dependence**, **falls**, **COPD**, **pregnancy**, and **substance-use** contraindications.

**PTSD (primary-care recognition)**  
**Trauma exposure** history plus **intrusion**, **avoidance**, **negative cognition/mood**, **hyperarousal** with **functional impairment**—screening tools like **PC-PTSD-5** or **PCL** may appear. **Trauma-informed** principles: **safety**, **choice**, **trustworthiness**, **collaboration**, **empowerment**—avoid **retraumatizing** detail-taking without support. **SSRIs** (e.g., sertraline/paroxetine) are common **pharmacologic** anchors; **trauma-focused psychotherapy** is first-line in many guidelines—NP answer sets often pair **medical management** + **referral** to trained therapists.

**Suicide risk**  
**Ideation, plan, means, intent, protective factors**, **acute triggers**, **command hallucinations**, **substance intoxication**, and **access to lethal means** drive **ED/crisis** pathways—do not “outpatient alone” through **imminent** risk.

**Pediatric / adolescent**  
**PNP-PC** and **adolescent** stems: **FDA indications**, **black-box** discussion when relevant, **family involvement**, **school functioning**, and **confidentiality limits** for **safety**.`;

const MH_SCREENING_BODY = `**Screening tools (exam familiarity)**  
**PHQ-9** (depression), **GAD-7** (anxiety), **PC-PTSD-5** or **PCL-5** (PTSD screens)—know **what a score implies** (severity band) and **what you do next** (safety assessment, treatment plan, referral), not memorizing every cutoff variant.

**Labs when medically indicated**  
**TSH**, **B12/folate**, **CMP** when **medical mimics** or before certain meds in selected patients—the stem usually signals **thyroid**, **anemia**, or **renal/hepatic** considerations.

**Pregnancy / lactation**  
**WHNP** stems may test **medication safety**—choose **pregnancy-appropriate** options and **collaboration** with OB when indicated.`;

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
      title: "Anxiety, depression, and PTSD: primary-care NP management (US boards)",
      seoTitle: "Anxiety depression PTSD primary care | NP US | NurseNest",
      seoDescription:
        "NP-level PHQ/GAD/PTSD screening, SSRI/SNRI principles, trauma-informed referral, benzodiazepine caution, suicide risk—FNP, AGPCNP, WHNP, PNP-PC.",
      clinical_meaning: `**Why this is high yield**  
NP certification vignettes embed **medical** and **psychiatric** comorbidity—your plan must address **both** (e.g., **avoid sedating** an already **opioid-using** patient with **benzodiazepines**; **consider QT** risk when the stem lists **meds**).

**PTSD-specific overlay**  
Items may describe **hypervigilance**, **nightmares**, **avoidance**, **startle**, **emotional numbing** after trauma—differentiate from **acute stress** duration, **adjustment disorder**, **panic**, and **MDD**. The correct answer often combines **SSRI** when indicated with **trauma-focused therapy referral** and **safety planning**—not “just tough it out.”`,
      exam_relevance: `Watch for **suicide** and **homicide** risk, **postpartum** depression cues, **bipolar** mis-treatment with antidepressant monotherapy when **mania history** is hidden in the stem, and **pediatric** regulatory nuances.`,
      clinical_scenario: `**Vignette — veteran with nightmares and avoidance after trauma**  
Positive **PC-PTSD-5**, intact **safety**, no **imminent** risk: start **evidence-informed SSRI** when appropriate, **refer** to **trauma-focused therapy**, document **shared decision-making**, and **follow up** for **adverse effects** and **response**.

**Vignette — panic-like episodes with palpitations**  
Rule in/out **cardiac** and **thyroid** when the stem demands—**not every anxiety** is “just anxiety.”`,
      takeaways: `• **Screen** with validated tools; **act** on **suicide** items.  
• **SSRIs/SNRIs** are common first-line meds—monitor **AEs** and **interactions**.  
• **Benzos** are high-risk—short-term/cautious.  
• **PTSD**: combine **meds** + **trauma-focused therapy referral** when indicated.  
• **Refer** for **complex** trauma, **severe** illness, or **therapy-first** scenarios per stem.`,
    },
    {
      preTest: [
        {
          question: "Which action is most appropriate when PHQ-9 item 9 is positive in a primary-care stem?",
          options: [
            "Ignore because depression is mild elsewhere.",
            "Assess suicide risk, safety, and need for urgent services; document plan.",
            "Start benzodiazepines immediately without assessment.",
            "Tell the patient not to mention it again.",
          ],
          correct: 1,
          rationale:
            "Positive suicidal ideation screen requires explicit safety assessment and documentation.",
        },
        {
          question: "Which medication class is generally preferred as first-line pharmacotherapy for generalized anxiety disorder in many adults?",
          options: [
            "Long-term high-dose benzodiazepine monotherapy in all patients.",
            "SSRI/SNRI-class antidepressants with monitoring.",
            "Chronic opioid therapy for anxiety.",
            "Routine stimulant use for anxiety.",
          ],
          correct: 1,
          rationale:
            "SSRIs/SNRIs are common first-line anxiolytic pharmacotherapy; benzos are limited and risk-heavy.",
        },
        {
          question: "Which feature best supports PTSD rather than uncomplicated major depression in a vignette?",
          options: [
            "Only low energy without trauma history.",
            "Intrusion symptoms, avoidance, and hyperarousal after trauma exposure with impairment.",
            "Single day of sadness after a breakup without impairment.",
            "Isolated insomnia without mood symptoms.",
          ],
          correct: 1,
          rationale:
            "PTSD requires trauma-linked symptom clusters with impairment—different from MDD alone.",
        },
      ],
      postTest: [
        {
          question: "Why refer patients with PTSD to trauma-focused psychotherapy?",
          options: [
            "Medications replace therapy entirely.",
            "Evidence-based trauma therapies (e.g., CPT, PE, EMDR) are first-line in many guidelines and require trained therapists.",
            "Primary care should provide prolonged exposure without training.",
            "Therapy is never helpful.",
          ],
          correct: 1,
          rationale:
            "Trauma-focused therapies are guideline-supported; NPs coordinate and may co-manage—not replace specialized therapy when indicated.",
        },
        {
          question: "Which factor increases benzodiazepine risk in older adults?",
          options: [
            "Improved balance and cognition.",
            "Falls, cognitive impairment, and respiratory compromise.",
            "Improved sleep architecture in all cases.",
            "No drug interactions possible.",
          ],
          correct: 1,
          rationale:
            "Beers criteria and clinical experience highlight falls/CNS risks—common exam trap.",
        },
        {
          question: "A patient declines an SSRI but wants immediate benzodiazepines for daily anxiety. What is the best NP response pattern?",
          options: [
            "Agree to chronic high-dose benzodiazepines without discussion.",
            "Discuss evidence, risks/benefits, alternatives, and document shared decision-making with a safer plan.",
            "Dismiss the patient.",
            "Prescribe opioids instead.",
          ],
          correct: 1,
          rationale:
            "Informed discussion, evidence alignment, and risk mitigation beat reflex benzodiazepine prescribing.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Anxiety, depression, and PTSD: primary-care NP (Canada / CNPLE-aligned)",
      seoTitle: "Mental health primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: depression/anxiety/PTSD screening, collaborative mental health referral, medication safety, trauma-informed care, and crisis pathways.",
      clinical_meaning: `**Canadian collaborative models**  
Items may reference **family health teams**, **mental health counsellors**, and **provincial resources**—choose answers that **coordinate** care and **document** safety.`,
      exam_relevance: `Same **risk** anchors: **suicide**, **substance**, **pregnancy**, **geriatric falls** with sedatives.`,
      clinical_scenario: `**Vignette — patient with PTSD symptoms after assault**  
**Safety first**, **trauma-informed** interview pacing, **SSRI** when appropriate, **therapy referral**, **follow-up** for **adverse effects** and **worsening** symptoms.`,
      takeaways: `• **Screen** and **triage** risk.  
• **Evidence-informed** meds + **therapy referral** when indicated.  
• **Trauma-informed** approach protects patients and clinicians.  
• **Crisis** pathways for **imminent** risk.`,
    },
    {
      preTest: [
        {
          question: "Which principle is central to trauma-informed primary care?",
          options: [
            "Force detailed trauma retelling in the first visit.",
            "Safety, trustworthiness, choice, collaboration, and empowerment.",
            "Avoid documenting mental health concerns.",
            "Treat all anxiety as personality flaw.",
          ],
          correct: 1,
          rationale:
            "Trauma-informed care emphasizes safety and collaboration—core to ethical practice.",
        },
        {
          question: "Which screen is commonly used for depression severity tracking in primary care?",
          options: ["PHQ-9", "ANA titer", "HbA1c alone for mood", "UA dipstick"],
          correct: 0,
          rationale:
            "PHQ-9 is a standard depression severity instrument used in many primary-care settings.",
        },
        {
          question: "Which situation most urgently requires crisis services?",
          options: [
            "Stable mild anxiety with intact safety and follow-up.",
            "Active suicidal intent with plan and means available.",
            "Request for a work note without psychiatric symptoms.",
            "Stable on SSRI with good adherence.",
          ],
          correct: 1,
          rationale:
            "Imminent suicide risk requires immediate safety evaluation—not routine follow-up alone.",
        },
      ],
      postTest: [
        {
          question: "Why might SSRIs be preferred over benzodiazepines for long-term anxiety management?",
          options: [
            "SSRIs have no adverse effects.",
            "Benzodiazepines carry dependence, cognitive, and fall risks; SSRIs are evidence-based for many anxiety disorders with monitoring.",
            "Benzodiazepines cure root causes.",
            "SSRIs are never used in anxiety.",
          ],
          correct: 1,
          rationale:
            "Long-term anxiolytic pharmacotherapy often favors antidepressant classes with appropriate monitoring.",
        },
        {
          question: "PTSD treatment planning in primary care most often includes:",
          options: [
            "Ignoring trauma history.",
            "Pharmacotherapy when indicated plus referral to trauma-focused therapy and ongoing monitoring.",
            "Only benzodiazepines.",
            "Stopping all medications in all PTSD patients.",
          ],
          correct: 1,
          rationale:
            "Combined approaches and referral align with evidence for PTSD management.",
        },
        {
          question: "Which lab might be appropriate when medical mimics of anxiety are suspected?",
          options: [
            "TSH when hyperthyroidism features are suggested.",
            "Routine daily MRI for all anxiety.",
            "Ignore physical causes entirely.",
            "Only vitamin D without indication.",
          ],
          correct: 0,
          rationale:
            "Thyroid dysfunction can mimic anxiety—targeted workup when clinically indicated.",
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

export function npMentalHealthAnxietyDepressionPtsdHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpMentalHealthAnxietyDepressionPtsdGoldLessonInput(pathwayId);
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

export function getNpMentalHealthAnxietyDepressionPtsdGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Anxiety, depression & PTSD (${suf})`,
          seoTitle: `Mental health primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} depression, anxiety, PTSD: screening, SSRI/SNRI principles, trauma therapy referral, suicide safety.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Anxiety, depression & PTSD (${suf})`,
            seoTitle: `Mental health primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} collaborative mental health care with trauma-informed screening and referral.`,
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
    labsDiagnostics: MH_SCREENING_BODY,
    relatedSlugs: ["fnp-adolescent-mental-health-screening", "np-primary-care-foundations-gold", "clinical-judgment-prioritization-gold"],
    relatedTitlesBySlug: {
      "fnp-adolescent-mental-health-screening": "Adolescent mental health screening (FNP)",
      "np-primary-care-foundations-gold": "NP primary-care foundations",
      "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
    },
  });

  return {
    slug: NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG,
    title: v.title,
    topic: "Mental health",
    topicSlug: "mental-health",
    bodySystem: "Psychiatric",
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
