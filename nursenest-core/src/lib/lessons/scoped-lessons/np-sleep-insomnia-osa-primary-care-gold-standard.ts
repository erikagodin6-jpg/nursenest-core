/**
 * Insomnia, obstructive sleep apnea, and related sleep disorders in primary-care NP practice.
 * Covers **CBT-I** as first-line for chronic insomnia, **OSA screening** (STOP-BANG style cues), **CPAP referral**,
 * **restless legs** iron/ferritin context, and **narcolepsy** as a referral diagnosis — exam breadth without sleep-lab ownership.
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
import { NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-mental-health-anxiety-depression-ptsd-gold-standard";

export const NP_SLEEP_INSOMNIA_OSA_PRIMARY_CARE_GOLD_SLUG = "np-sleep-insomnia-osa-primary-care-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Sleep complaints are multilayered**  
**Insomnia**, **OSA**, **restless legs (RLS)**, **circadian disruption**, **parasomnias**, **medication/substance effects**, and **mental health** comorbidity overlap—NP items reward **phenotyping** before prescribing **hypnotics**.

**Chronic insomnia (adults)**  
**CBT-I** (cognitive behavioral therapy for insomnia) is **first-line** for chronic insomnia in many guidelines—your answer set should prefer **structured behavioral** approaches over **chronic benzodiazepine/Z-drug** dependence when the stem describes **long-standing** sleep-onset/maintenance problems without acute crisis.

**Pharmacologic aids (exam level)**  
Short-term or carefully selected agents may appear, but watch **older adults**, **substance-use disorder**, **respiratory disease**, **pregnancy**, and **falls**. **Melatonin** may help **circadian** issues—not a universal panacea.

**Obstructive sleep apnea (OSA)**  
Screen with **snoring**, **witnessed apneas**, **gasping**, **daytime sleepiness**, **hypertension**, **obesity**, **large neck**, **atrial fibrillation**—**STOP-BANG**-style elements often map to exam stems. **Diagnosis** is **sleep testing** (home vs lab per context); **CPAP** is foundational therapy for many—NP role includes **suspicion**, **referral**, **comorbidity management**, and **adherence support**.

**Restless legs syndrome**  
**Urge to move** worse at rest/evening, **relief with movement**, **iron deficiency** workup when indicated—**dopamine agonists** and **alpha-2 ligands** appear as **specialty-monitored** options in advanced items.

**Narcolepsy / central hypersomnia**  
**Excessive daytime sleepiness** with **cataplexy** (when present) → **referral** for **sleep medicine**—not long-term stimulant prescribing without diagnosis in a vignette.

**Pediatrics**  
**PNP-PC**: **OSA** may present with **behavior**, **enuresis**, **ADHD-like** symptoms—**referral** for **pediatric sleep** evaluation when indicated; avoid adult-only assumptions.`;

const SLEEP_LABS_BODY = `**Iron studies for RLS**  
**Ferritin** and **iron indices** when **RLS** is suspected—treat **iron deficiency** per context; know **RLS mimics** (neuropathy, akathisia).

**Sleep testing**  
**Polysomnography vs home sleep apnea testing**—the stem usually tells you **which** is appropriate (complex cardiopulmonary disease may favor **in-lab**).

**Actigraphy / sleep diary**  
Sometimes used to support **insomnia** characterization and **CBT-I**—recognize purpose, not device trivia.`;

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
      title: "Sleep disorders: insomnia, OSA, and RLS in primary care (NP, US)",
      seoTitle: "Sleep medicine primary care | NP US | NurseNest",
      seoDescription:
        "NP-level sleep: CBT-I first-line insomnia, OSA screening and CPAP referral, RLS iron workup, narcolepsy referral cues—FNP, AGPCNP, WHNP, PNP-PC.",
      clinical_meaning: `**Overlap with mental health and neuro**  
**Depression** and **insomnia** co-travel; **OSA** worsens **mood** and **HTN**—items may require **treating sleep apnea** before blaming mood alone for fatigue.

**WHNP** may include **pregnancy**-related sleep disruption and **OSA** in **pregnancy** (higher-risk contexts)—referral thresholds may differ from non-pregnant adults in the stem.`,
      exam_relevance: `Expect **who needs sleep study**, **who should try CBT-I first**, **CPAP adherence barriers**, and **when hypnotics are unsafe**.`,
      clinical_scenario: `**Vignette — truck driver with snoring and daytime sleepiness**  
High risk for **OSA** → **screen**, **refer for testing**, manage **HTN** and **weight**, **avoid sedating** antihistamines as “fix” for daytime sleepiness without diagnosis.

**Vignette — restless legs with low ferritin**  
Address **iron deficiency** and **symptom-specific therapy** per guideline context—monitor **augmentation** risks with dopaminergics when the stem goes there.`,
      takeaways: `• **CBT-I** first for **chronic insomnia** when appropriate—not chronic benzos by default.  
• **OSA**: screen high-risk patients; **refer** for testing; **CPAP** adherence support matters.  
• **RLS**: consider **iron**; avoid misattributing to “anxiety” alone.  
• **Narcolepsy/cataplexy** → **sleep medicine** referral.  
• **Peds**: **OSA** can look like **behavior**—think broadly.`,
    },
    {
      preTest: [
        {
          question: "Which intervention is first-line for chronic insomnia in many guideline-informed primary-care scenarios?",
          options: [
            "Indefinite high-dose benzodiazepines nightly.",
            "Cognitive behavioral therapy for insomnia (CBT-I) and sleep-wake scheduling strategies.",
            "Ignore sleep complaints if mood is stable.",
            "Alcohol at bedtime for all patients.",
          ],
          correct: 1,
          rationale:
            "CBT-I is first-line for chronic insomnia in many guidelines; chronic benzodiazepines carry major risks.",
        },
        {
          question: "Which cluster most strongly suggests obstructive sleep apnea?",
          options: [
            "Snoring, witnessed apneas, daytime sleepiness, obesity/hypertension.",
            "Isolated mild headache without sleep symptoms.",
            "Acute ankle sprain.",
            "Stable chronic pain without fatigue.",
          ],
          correct: 0,
          rationale:
            "Classic OSA features include snoring, apneas, daytime sleepiness, and cardiometabolic comorbidity.",
        },
        {
          question: "Which lab is most relevant when restless legs syndrome is suspected and iron deficiency may be present?",
          options: ["Ferritin/iron studies", "PSA", "Amylase", "Troponin only"],
          correct: 0,
          rationale:
            "Iron deficiency is associated with/worsens RLS—targeted iron assessment is common.",
        },
      ],
      postTest: [
        {
          question: "Why is CPAP adherence counseling important in OSA management?",
          options: [
            "CPAP never works.",
            "Treatment benefit depends on consistent use; barriers are common and modifiable.",
            "CPAP cures all hypertension without lifestyle change.",
            "Adherence is irrelevant to outcomes.",
          ],
          correct: 1,
          rationale:
            "Adherence support improves cardiovascular and symptom outcomes in treated OSA.",
        },
        {
          question: "A patient has severe daytime sleepiness and cataplexy episodes. What is the best primary-care next step?",
          options: [
            "Start long-term stimulants without diagnosis.",
            "Refer for sleep medicine evaluation for suspected narcolepsy.",
            "Ignore cataplexy as stress.",
            "Recommend only caffeine.",
          ],
          correct: 1,
          rationale:
            "Narcolepsy requires specialized diagnosis and management—referral is appropriate.",
        },
        {
          question: "Which patient factor increases risk of hypnotic-related falls in older adults?",
          options: [
            "Young age and athletic build.",
            "Polypharmacy, cognitive impairment, and nocturia with sedating hypnotics.",
            "Adequate lighting only.",
            "Physical therapy alone.",
          ],
          correct: 1,
          rationale:
            "Older adults have heightened sedation/fall risk—exam-relevant safety counseling.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Sleep disorders in primary care (Canadian NP / CNPLE-aligned)",
      seoTitle: "Sleep primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: insomnia CBT-I access, OSA referral pathways, CPAP support, RLS iron workup, and collaborative sleep medicine care.",
      clinical_meaning: `**Access realities**  
Vignettes may reference **wait lists**—still choose **correct triage** (who must be sent for testing urgently vs routine referral).`,
      exam_relevance: `Screening tools and **referral** thresholds remain **clinical-risk** driven.`,
      clinical_scenario: `**Vignette — shift worker insomnia**  
Address **sleep hygiene**, **circadian** strategies, **CBT-I** where available, and **avoid chronic sedatives** without evaluation.`,
      takeaways: `• **Insomnia**: **CBT-I**-first mindset.  
• **OSA**: **refer** and support **CPAP**.  
• **RLS**: **iron** and **differential** thinking.  
• **Specialty referral** for **narcolepsy** and complex cases.`,
    },
    {
      preTest: [
        {
          question: "Which symptom pair most suggests evaluation for obstructive sleep apnea?",
          options: [
            "Witnessed breathing pauses during sleep and excessive daytime sleepiness.",
            "Mild sore throat once.",
            "Ankle edema only without cardiopulmonary history.",
            "Isolated tinnitus without sleep symptoms.",
          ],
          correct: 0,
          rationale:
            "Apneas plus daytime sleepiness are hallmark OSA features prompting evaluation.",
        },
        {
          question: "Why avoid chronic benzodiazepines for insomnia in many older adults?",
          options: [
            "They improve balance in all patients.",
            "Fall risk, cognitive effects, and dependence potential are high.",
            "They are never prescribed in any population.",
            "They cure sleep apnea.",
          ],
          correct: 1,
          rationale:
            "Beers criteria and clinical experience highlight sedation risks in older adults.",
        },
        {
          question: "RLS is differentiated from positional leg discomfort primarily by:",
          options: [
            "Improvement with continued sitting still.",
            "Urge to move worse at rest/evening and relief with movement.",
            "Only occurring during exercise.",
            "Always caused by DVT.",
          ],
          correct: 1,
          rationale:
            "RLS has characteristic timing and relief with movement—core exam distinction.",
        },
      ],
      postTest: [
        {
          question: "Pediatric snoring with behavior problems may warrant:",
          options: [
            "Ignore until adulthood.",
            "Evaluation for sleep-disordered breathing when clinically indicated.",
            "Only antihistamines nightly.",
            "No parental counseling.",
          ],
          correct: 1,
          rationale:
            "OSA can present with neurobehavioral symptoms in children—referral when indicated.",
        },
        {
          question: "Which lifestyle factor most directly worsens obstructive sleep apnea severity?",
          options: [
            "Weight reduction can improve OSA severity in many patients with excess weight.",
            "Hydration always cures OSA.",
            "Exercise never helps.",
            "CPAP is unnecessary if weight is normal.",
          ],
          correct: 0,
          rationale:
            "Weight loss can reduce OSA severity; CPAP may still be needed depending on severity.",
        },
        {
          question: "Chronic insomnia management should prioritize:",
          options: [
            "Long-term nightly sedatives for everyone.",
            "Behavioral treatments and addressing comorbid conditions before chronic hypnotics.",
            "Ignoring sleep hygiene.",
            "Alcohol nightly.",
          ],
          correct: 1,
          rationale:
            "First-line nonpharmacologic approaches reduce long-term harm from sedatives.",
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

export function npSleepInsomniaOsaPrimaryCareHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpSleepInsomniaOsaPrimaryCareGoldLessonInput(pathwayId);
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

export function getNpSleepInsomniaOsaPrimaryCareGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Sleep: insomnia, OSA & RLS (${suf})`,
          seoTitle: `Sleep disorders primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} insomnia (CBT-I), OSA screening/CPAP, RLS iron workup, referral for narcolepsy.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Sleep: insomnia, OSA & RLS (${suf})`,
            seoTitle: `Sleep disorders primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} sleep-disordered breathing referral, insomnia first-line care, and collaborative sleep medicine.`,
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
    labsDiagnostics: SLEEP_LABS_BODY,
    relatedSlugs: [
      NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG,
      "np-primary-care-foundations-gold",
      "fnp-geriatric-falls-syncope",
    ],
    relatedTitlesBySlug: {
      [NP_MENTAL_HEALTH_ANXIETY_DEPRESSION_PTSD_GOLD_SLUG]: "Anxiety, depression & PTSD primary care",
      "np-primary-care-foundations-gold": "NP primary-care foundations",
      "fnp-geriatric-falls-syncope": "Geriatric falls & syncope",
    },
  });

  return {
    slug: NP_SLEEP_INSOMNIA_OSA_PRIMARY_CARE_GOLD_SLUG,
    title: v.title,
    topic: "Sleep medicine",
    topicSlug: "sleep-medicine",
    bodySystem: "Neurological",
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
