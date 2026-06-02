/**
 * Outpatient neurology judgment for primary-care NPs — complements {@link STROKE_ICP_GOLD_SLUG} (acute stroke/ICP)
 * with **headache red flags**, **TIA = emergency**, **first unprovoked seizure**, **syncope vs cardiac**, and **peripheral neuro** cues.
 * Clinical themes align with legacy neuro/stress teaching outlines (triage, safety, referral) without duplicating acute-stroke management depth.
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
import { STROKE_ICP_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/stroke-increased-icp-gold-standard";

export const NP_NEUROLOGY_OUTPATIENT_PRIMARY_CARE_GOLD_SLUG = "np-neurology-outpatient-primary-care-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Outpatient neurology ≠ “mini neurology residency”**  
NP items reward **risk stratification**: **who can stay in primary care** with monitoring versus **who needs same-day neuroimaging**, **ED**, or **neurology**—not exhaustive rare-disease trivia.

**Headache — cannot-miss patterns**  
**Thunderclap onset**, **first or worst headache**, **focal neuro deficits**, **papilledema**, **immunosuppression**, **pregnancy with new headache**, **age >50 with new progressive pattern**, or **trauma/anticoagulation** → **escalate** for evaluation that may include **neuroimaging** and **ED** when the stem implies **subarachnoid hemorrhage**, **arterial dissection**, **mass lesion**, or **CNS infection**.

**Migraine (when stable pattern fits)**  
Episodic **unilateral throbbing**, **photophobia/phonophobia**, **nausea**, **worsened by activity**, with **normal neuro exam** and **prior similar episodes** may support **migraine management** in outpatient care—still **re-evaluate** when **pattern changes** or **red flags** appear.

**TIA is a stroke warning — treat time as brain**  
Transient focal neuro deficits that resolve still often warrant **urgent evaluation** (timing and pathway depend on the vignette). Items punish **reassurance alone** without **risk-factor modification** planning and **follow-up** when outpatient management is described.

**First seizure**  
**Unprovoked** first seizure in adults often triggers **workup** and **driving/safety counseling** plus **specialty alignment**—not “watchful waiting” through recurrent events without assessment.

**Syncope vs seizure vs cardiac**  
**Prodrome**, **witnessed features**, **postictal confusion**, **tongue biting (lateral)**, **incontinence**, and **ECG clues** matter. **Exertional syncope**, **family history of sudden death**, or **abnormal ECG** push toward **cardiac** workup—overlap with cardiology items is intentional.

**Peripheral patterns**  
**Unilateral radiating pain** with dermatomal exam findings may suggest **radiculopathy**; **distal symmetric neuropathy** in diabetes needs **glycemic control**, **foot care**, **medication review**, and **referral** when **rapid progression**, **asymmetric** findings, or **motor** signs appear.`;

const NEURO_LABS_IMAGING = `**When imaging helps**  
**CT/ MRI** decisions follow **red flags** and **focality**—items test **parsimony** (not everyone with headache needs MRI) and **safety** (thunderclap gets evaluated urgently).

**Labs**  
**B12**, **TSH**, **glucose**, **renal function**, or **inflammatory markers** may appear when the differential includes **metabolic**, **infectious**, or **autoimmune** mimics—tie each test to **what it rules in/out** in the stem.

**EEG**  
Ordered for **recurrent unprovoked seizures** or certain **diagnostic questions**—not routine for all headaches.`;

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
      title: "Outpatient neurology: headache, TIA, seizure, and syncope triage (NP, US primary care)",
      seoTitle: "Outpatient neurology triage | NP US | NurseNest",
      seoDescription:
        "NP-level outpatient neuro: headache red flags, TIA urgency, first seizure workup, syncope differentiation, peripheral neuro/radiculopathy cues—FNP, AGPCNP, WHNP, PNP-PC.",
      clinical_meaning: `**Population overlays**  
**PNP-PC** may embed **febrile seizures** or **developmental** history; **WHNP** may include **pregnancy-related headache** thresholds; **AGPCNP** often stresses **older adults** with **atypical** presentations; **FNP** mixes lifespan stems—read **age**, **comorbidities**, and **medications** before choosing imaging or reassurance.`,
      exam_relevance: `Expect **next-best-step** items: **ED referral**, **MRI/CT**, **EEG referral**, **cardiac workup**, **lumbar puncture** only when **meningitis** features dominate the stem, and **clear safety counseling** (driving, falls, anticoagulation).

**Traps**  
• Calling **TIA** “resolved” without **stroke prevention** planning.  
• **MRI for every headache** without red flags.  
• Ignoring **cardiac** causes of **syncope** when the ECG or story demands it.`,
      clinical_scenario: `**Vignette — “worst headache of my life” 45 minutes ago**  
**Sudden maximal intensity**, **neck stiffness**, **photophobia**, **alert but distressed**.  
**Fork**: This is **thunderclap** territory—**emergency evaluation** and **neuroimaging pathway** beat **outpatient follow-up in two weeks**.

**Vignette — brief facial droop that resolved**  
Even with **resolution**, **TIA pathway** and **vascular risk** assessment belong in the correct answer set unless the stem explicitly defines a benign mimic with **complete** alternative explanation.`,
      takeaways: `• **Red-flag headache** → **urgent evaluation**, not home reassurance alone.  
• **TIA** → **stroke prevention** mindset and **timely** workup per vignette.  
• **First seizure** → **assessment**, **safety**, **driving**, **specialty** alignment.  
• **Syncope** → **cardiac vs neuro** discrimination using **history + ECG** cues.  
• **Neuropathy/radiculopathy** → **red flags** for **rapid**, **asymmetric**, or **systemic** disease.`,
    },
    {
      preTest: [
        {
          question: "Which headache presentation most strongly warrants emergency evaluation?",
          options: [
            "Stable chronic tension-type headache without focal signs.",
            "Thunderclap onset maximal headache within seconds to a minute with stiff neck.",
            "Mild headache after caffeine withdrawal with normal exam.",
            "Chronic migraine with unchanged pattern and normal neuro exam.",
          ],
          correct: 1,
          rationale:
            "Thunderclap severe headache with meningeal features suggests subarachnoid hemorrhage or other emergencies until evaluated.",
        },
        {
          question: "Why is transient focal weakness still high risk even if symptoms resolve?",
          options: [
            "It is never serious if it resolves.",
            "It may represent TIA with high short-term stroke risk without prevention planning.",
            "It always means migraine aura.",
            "It requires only OTC analgesics.",
          ],
          correct: 1,
          rationale:
            "TIA is a warning event; evaluation and prevention are central to exam-correct management.",
        },
        {
          question: "Which feature best supports vasovagal syncope rather than seizure in many stems?",
          options: [
            "Prolonged postictal confusion and tongue biting.",
            "Prodromal warmth/nausea, brief loss of consciousness with rapid recovery, triggered by standing or stress.",
            "Witnessed tonic-clonic activity with incontinence.",
            "Awakening confusion lasting 30 minutes.",
          ],
          correct: 1,
          rationale:
            "Vasovagal episodes often have triggers and rapid recovery; seizure features differ—read the stem carefully.",
        },
      ],
      postTest: [
        {
          question: "An adult has a first unprovoked generalized seizure and is now neurologically normal. What is most exam-appropriate?",
          options: [
            "Ignore because the patient looks fine now.",
            "Arrange appropriate evaluation, safety counseling, and neurology alignment per guideline context in the stem.",
            "Guarantee no recurrence without assessment.",
            "Recommend driving until another seizure occurs.",
          ],
          correct: 1,
          rationale:
            "First unprovoked seizure requires structured assessment and safety planning—not dismissal.",
        },
        {
          question: "Which finding should prompt concern for cervical artery dissection in headache/neck pain stems?",
          options: [
            "Bilateral symmetric mild tension headache without trauma or focal signs.",
            "Neck pain/trauma history with Horner syndrome features or focal neuro deficits.",
            "Chronic migraine with stable aura.",
            "Sinus pressure without focal signs.",
          ],
          correct: 1,
          rationale:
            "Dissection can present with sudden headache/neck pain and focal neuro signs—urgent evaluation.",
        },
        {
          question: "Diabetic peripheral neuropathy management in primary care most centrally includes:",
          options: [
            "Ignoring glycemic control.",
            "Glycemic optimization, foot inspection education, medication review, and referral for atypical progression.",
            "Only prescribing opioids for all patients.",
            "Stopping all exercise permanently.",
          ],
          correct: 1,
          rationale:
            "Core care includes glycemic control, foot protection, and vigilance for atypical neuropathy features.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Outpatient neurology triage (Canadian NP / CNPLE-aligned)",
      seoTitle: "Outpatient neurology | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: headache red flags, TIA urgency, seizure and syncope triage, collaborative neuro referral, and SI-friendly lab/imaging framing.",
      clinical_meaning: `**Community practice**  
CNPLE-style items still test **risk-first** triage and **interprofessional** referral. **Metric units** may appear—translate into **clinical risk**, not memorized conversions alone.`,
      exam_relevance: `Expect **when to send to ED**, **when to arrange urgent imaging**, and **documentation** that supports **consultant handoff**.`,
      clinical_scenario: `**Vignette — older adult with sudden focal deficit that improved**  
Treat as **vascular event risk** until proven otherwise—**safety netting** and **timely evaluation** beat “watch at home” when the stem implies risk.`,
      takeaways: `• **Red flags** drive **urgent** pathways.  
• **TIA** requires **prevention** thinking.  
• **Syncole vs seizure vs cardiac** uses **history + ECG** cues.  
• **Refer** when **diagnostic uncertainty** or **progressive** deficits exceed outpatient scope.`,
    },
    {
      preTest: [
        {
          question: "Which presentation most strongly requires urgent assessment?",
          options: [
            "Stable chronic symptoms without change.",
            "Sudden severe headache with rapid peak and meningismus.",
            "Mild tension headache after stress.",
            "Follow-up for stable migraine.",
          ],
          correct: 1,
          rationale:
            "Thunderclap headache with meningeal features suggests emergency pathology.",
        },
        {
          question: "Why document focal neurologic deficits even if they resolve?",
          options: [
            "Documentation is optional for transient symptoms.",
            "TIA/stroke risk stratification depends on accurate history and exam documentation.",
            "Transient symptoms are always benign.",
            "Only inpatient charts matter.",
          ],
          correct: 1,
          rationale:
            "TIA evaluation and prevention planning rely on clear documentation of events.",
        },
        {
          question: "Which element supports referral for first seizure evaluation?",
          options: [
            "Normal neuro exam immediately after a generalized convulsion in an adult without prior workup.",
            "Ignore if patient feels fine.",
            "Avoid discussing driving.",
            "No follow-up needed.",
          ],
          correct: 0,
          rationale:
            "First unprovoked seizure in adults typically warrants evaluation and safety counseling—exact pathway depends on context.",
        },
      ],
      postTest: [
        {
          question: "Pregnancy-related headache with visual symptoms and hypertension should raise concern for:",
          options: [
            "Only migraine without evaluation.",
            "Preeclampsia spectrum and urgent obstetric evaluation depending on severity.",
            "Only dehydration.",
            "Only anxiety.",
          ],
          correct: 1,
          rationale:
            "Preeclampsia can present with headache and visual changes—urgent evaluation when implied by vitals and gestation.",
        },
        {
          question: "Which syncope feature increases suspicion for arrhythmia or structural cardiac disease?",
          options: [
            "Brief episode triggered by emotional stress with rapid recovery and normal ECG.",
            "Exertional syncope or abnormal ECG/concerning family history.",
            "Standing too quickly once without recurrence.",
            "Mild dehydration without cardiac symptoms.",
          ],
          correct: 1,
          rationale:
            "Exertional syncope and ECG red flags warrant cardiac evaluation.",
        },
        {
          question: "What is the primary goal of peripheral neuropathy follow-up in diabetes?",
          options: [
            "Ignore feet until ulcer develops.",
            "Prevent injury, optimize glycemic and cardiovascular risk factors, and detect progression or atypical features.",
            "Stop all exercise.",
            "Avoid any medication review.",
          ],
          correct: 1,
          rationale:
            "Foot protection and risk-factor modification reduce morbidity; atypical neuropathy needs referral.",
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

export function npNeurologyOutpatientPrimaryCareHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpNeurologyOutpatientPrimaryCareGoldLessonInput(pathwayId);
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

export function getNpNeurologyOutpatientPrimaryCareGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Outpatient neurology triage (${suf})`,
          seoTitle: `Outpatient neurology | ${lab} | NurseNest`,
          seoDescription: `${lab} primary-care neuro triage: headache red flags, TIA, seizure, syncope, and peripheral patterns.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Outpatient neurology triage (${suf})`,
            seoTitle: `Outpatient neurology | ${lab} | NurseNest`,
            seoDescription: `${lab} community neuro triage with urgent referral thresholds.`,
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
    labsDiagnostics: NEURO_LABS_IMAGING,
    relatedSlugs: [STROKE_ICP_GOLD_SLUG, "fnp-geriatric-falls-syncope", "np-primary-care-foundations-gold"],
    relatedTitlesBySlug: {
      [STROKE_ICP_GOLD_SLUG]: "Stroke & increased ICP recognition",
      "fnp-geriatric-falls-syncope": "Geriatric falls & syncope",
      "np-primary-care-foundations-gold": "NP primary-care foundations",
    },
  });

  return {
    slug: NP_NEUROLOGY_OUTPATIENT_PRIMARY_CARE_GOLD_SLUG,
    title: v.title,
    topic: "Neurological",
    topicSlug: "neurological",
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
