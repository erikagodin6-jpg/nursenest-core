/**
 * Heart failure — outpatient primary-care NP judgment (US + Canada NP tracks).
 * Complements {@link ACS_GOLD_SLUG} (acute ischemia) with chronic HF recognition, staging logic,
 * GDMT concepts, volume assessment, and referral thresholds — without duplicating hospital ACS care.
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
import { ACS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/acute-coronary-syndrome-gold-standard";

export const NP_HEART_FAILURE_PRIMARY_CARE_GOLD_SLUG = "np-heart-failure-primary-care-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Heart failure in primary-care NP practice**  
**Heart failure (HF)** is a **syndrome of impaired filling or ejection** that produces **exertional limitation**, **volume overload**, and/or **organ hypoperfusion**—boards reward **phenotype recognition** (HFrEF vs HFpEF patterns), **trigger identification** (ischemia, hypertension, arrhythmia, valvular disease, infection, dietary sodium, medication nonadherence), and **safe outpatient intensification** with **follow-up you can defend**.

**Why HF is not “just edema”**  
Items test whether you **integrate** orthopnea, bendopnea, PND, fatigue, exercise tolerance, nocturia, weight trends, and **comorbidity** (CKD, diabetes, AF, COPD) before you change diuretics or start neurohormonal therapy. **Mislabeling** volume overload as “deconditioning” or **delaying** evaluation of **acute coronary syndrome** when ischemia may be driving deterioration are classic traps.

**Guideline-directed medical therapy (GDMT) — exam logic**  
NP items expect **class-effect knowledge at a principles level**: ACEi/ARB/ARNI, evidence-based beta-blockade where appropriate, **SGLT2 inhibitors** where indicated for HFrEF, **MRA** when renal/electrolyte monitoring exists, and **device/ specialty referral** thresholds—not rote doses divorced from follow-up labs and blood pressure.

**Volume and congestion assessment**  
Tie **daily weights**, **JVP concepts when the stem provides exam data**, **peripheral edema**, **lung exam**, **orthopnea**, and **renal function** together. **Over-diuresis** (hypotension, AKI, symptomatic hypotension) is as wrong as **under-treatment** of obvious congestion.

**Referral and escalation**  
Urgent **ED** or **cardiology** pathways appear when the stem gives **hypotension with hypoperfusion**, **acute pulmonary edema**, **new arrhythmia with instability**, **syncope**, **ischemic-equivalent symptoms**, **rising troponin with dynamic ECG changes**, or **renal failure** out of proportion to “routine” diuretic adjustment—choose **stabilization and escalation** over telephone tweaks.`;

const HF_LABS_IMAGING = `**BNP / NT-proBNP (when the vignette uses them)**  
Elevated natriuretic peptides support **HF probability** in undifferentiated dyspnea when paired with compatible features; **very low** values in the right clinical window can argue **against** HF as the sole driver—items test **interpretation in context**, not treating a number in isolation.

**CBC, renal panel, electrolytes**  
**Creatinine / eGFR** frame **diuretic safety**, **RAAS-pathway drugs**, and **MRA** candidacy. **Potassium** follows **diuretic shifts**, **RAAS blockers**, and **acid–base** context. **Anemia** worsens exercise tolerance and may change workup priorities.

**ECG and rhythm**  
**Atrial fibrillation** with rapid ventricular response can **unmask or worsen** HF—rate/rhythm control decisions belong to **protocol + collaboration** in the stem. **Ischemic changes** demand **ACS pathways**, not outpatient HF titration alone.

**Imaging (echo concepts)**  
When echo results appear, connect **EF**, **valvular lesions**, **diastolic parameters**, and **right-heart pressure estimates** to **medication choices**, **anticoagulation** needs with AF, and **referral** for advanced therapies when the stem hints at **refractory** disease.`;

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
      title: "Heart failure: outpatient evaluation and management (NP, US primary care)",
      seoTitle: "Heart failure primary care | NP US | NurseNest",
      seoDescription:
        "NP board-style HF: HFrEF vs HFpEF patterns, GDMT principles, diuretic safety, device/referral thresholds, and cannot-miss escalation—aligned to FNP, AGPCNP, WHNP, and PNP-PC outpatient stems.",
      clinical_meaning: `**Primary-care NP role**  
You **synthesize** history, vitals, weight trends, exam, and available diagnostics into a **working phenotype** and **symptom trajectory**. Boards reward **parsimonious testing** that changes management, **documentation** of reasoning, and **shared decision-making** when trade-offs are real (renal function vs RAAS therapy, hypotension vs congestion).

**Population overlays**  
**AGPCNP** stems may foreground **older adults with multimorbidity**; **WHNP** items may embed **pregnancy** or **hormonal contexts** that change drug safety; **PNP-PC** items may test **cyanotic heart disease history** or **ACHD transition** awareness at a principles level—read the stem’s age and comorbidity cues before selecting GDMT options.`,
      exam_relevance: `Expect **next-best-step** questions: **when to order echo**, **when to obtain natriuretic peptides**, **how to interpret volume status**, **when ED referral beats clinic titration**, and **which medication class** matches the phenotype and monitoring plan.

**Traps**  
• Treating **COPD or obesity alone** as the explanation for **exertional dyspnea** when **HF features** are present.  
• **Raising diuretics** without **renal/electrolyte** follow-up when the stem gives **CKD** or **baseline hyperkalemia**.  
• **Confusing** **acute MI** with **chronic HF**—chest pain + dynamic ECG changes → **ACS pathway**, not “increase metoprolol in clinic.”`,
      clinical_scenario: `**Vignette — 72-year-old with “fluid on my legs”**  
Weight is **+6 lb in 4 days**, **orthopnea** is new, BP **168/92**, HR ** irregularly irregular** at **102**, **SpO₂ 93%** on RA, **JVP elevated** in the stem, **bilateral crackles**, **2+ pitting edema**. Creatinine **1.45** (baseline **1.1**).

**Reasoning fork**  
This is **acute decompensated HF with likely AF with RVR** as precipitant—**ED evaluation** often beats “phone in furosemide” when **hypoxia**, **rapid AF**, and **AKI** cluster. If the stem stays outpatient-stable, your plan names **diuretic strategy with labs**, **rate/rhythm collaboration**, and **clear return precautions** for **resting dyspnea** or **chest pain**.

**Documentation nugget**  
Chart **volume assessment**, **ischemia symptoms**, **renal trajectory**, **medication changes**, and **follow-up timing**—NP items punish vague “recheck.”`,
      takeaways: `• **Phenotype + triggers** first—then **therapy** and **monitoring** you can defend.  
• **Natriuretic peptides and echo** support diagnosis and staging when the vignette provides them—interpret in **clinical context**.  
• **GDMT** follows **guideline principles** with **lab/BP safety**—not memorized doses without follow-up.  
• **Escalate** for **hypoperfusion**, **acute pulmonary edema**, **ACS features**, **dangerous arrhythmia**, or **AKI** with instability.  
• **WHNP / PNP-PC / AGPCNP** overlays change **drug safety** and **follow-up**—read the stem’s population cues.`,
    },
    {
      preTest: [
        {
          question:
            "Which pattern most strongly suggests urgent escalation from primary care rather than routine outpatient diuretic adjustment?",
          options: [
            "Stable chronic edema with unchanged weight and normal mentation.",
            "Resting hypoxia, new severe orthopnea, and acute kidney injury with hypotension.",
            "Mild ankle swelling after a long flight with normal vitals.",
            "Asymptomatic hypertension discovered at a wellness visit.",
          ],
          correct: 1,
          rationale:
            "Hypoxia, acute kidney injury with hypotension, and severe orthopnea suggest acute decompensation needing urgent evaluation—not remote titration.",
        },
        {
          question: "Why is daily weight monitoring emphasized in heart failure follow-up?",
          options: [
            "It replaces the need for physical exam.",
            "Early fluid retention often appears as weight gain before severe symptoms.",
            "It is only useful for clients with obesity.",
            "It determines EF on its own.",
          ],
          correct: 1,
          rationale:
            "Weight trends help detect fluid retention early; they complement—not replace—exam and symptoms.",
        },
        {
          question:
            "Which statement best reflects NP-appropriate prescribing judgment for RAAS-pathway medications in HFrEF?",
          options: [
            "Start maximal doses immediately regardless of renal function or potassium.",
            "Initiate/titrate per guideline principles with monitoring of renal function, potassium, and blood pressure.",
            "Avoid all RAAS drugs in every patient with CKD.",
            "Use RAAS therapy only during hospitalization, never outpatient.",
          ],
          correct: 1,
          rationale:
            "GDMT uses guideline-informed initiation/titration with safety monitoring—core NP exam territory.",
        },
      ],
      postTest: [
        {
          question: "A client with known HFrEF develops exertional chest pressure with new ST changes on ECG in clinic. What is the priority?",
          options: [
            "Increase the beta-blocker dose for rate control only.",
            "Activate acute coronary syndrome evaluation per setting and avoid treating this as routine HF titration.",
            "Double the home diuretic without further assessment.",
            "Schedule a routine echo in three months.",
          ],
          correct: 1,
          rationale:
            "Dynamic ischemia patterns require ACS pathways—not HF clinic adjustments alone.",
        },
        {
          question: "Which finding best supports hypervolemia as a driver of symptoms in an ambulatory HF visit?",
          options: [
            "Dry mucous membranes and orthostatic hypotension without edema.",
            "Rising weight, worsening orthopnea, and peripheral edema with elevated JVP when provided.",
            "Isolated mild fatigue without exam or trend changes.",
            "Normal exam after aggressive fluid restriction without data.",
          ],
          correct: 1,
          rationale:
            "Congestion features and corroborating exam/trends support volume overload as a management target.",
        },
        {
          question:
            "What is the primary exam intent of guideline-directed medical therapy intensification in stable chronic HFrEF when labs and BP allow?",
          options: [
            "Reduce morbidity and mortality with evidence-based neurohormonal and disease-modifying therapy.",
            "Normalize EF in every patient within one visit.",
            "Eliminate the need for cardiology follow-up entirely.",
            "Replace lifestyle counseling.",
          ],
          correct: 0,
          rationale:
            "GDMT aims to improve outcomes with monitored titration—EF may remain reduced; subspecialty follow-up often continues.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Heart failure: outpatient evaluation and management (Canadian NP / CNPLE-aligned)",
      seoTitle: "Heart failure primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP preparation: HF recognition in community practice, collaborative care models, SI labs where applicable, referral thresholds, and safe escalation—without duplicating inpatient ACS management.",
      clinical_meaning: `**Canadian primary-care context**  
CNPLE-aligned items still test **syndrome recognition**, **risk stratification**, and **collaborative management** with **physician and pharmacy** partners. Expect **metric labs** and **provincial formulary reality** in vignettes—translate values into **risk** and **monitoring plans** rather than memorizing non-SI trivia.

**Scope**  
NP answers should show **defensible prescribing/titration** within **collaborative agreements**, **clear documentation**, and **timely referral** when advanced therapies, **device therapy**, or **acute instability** are implied.`,
      exam_relevance: `Watch for **same cognitive traps** as US items—**volume assessment**, **ischemia** not mislabeled as “just HF,” **renal safety** with RAAS/MRA, and **AF with rapid rates** as a precipitant. **Referral** language may reference **heart function programs**, **cardiology access**, or **ED** when instability appears.`,
      clinical_scenario: `**Vignette — older adult with progressive exertional dyspnea (community)**  
The stem gives **basal crackles**, **peripheral edema**, **reduced exercise tolerance**, and **BNP elevation** with **prior MI** history. Your plan addresses **diuretic strategy**, **comorbidity review**, **medication optimization** within monitoring, and **explicit escalation** if **resting hypoxia**, **chest pain**, **syncope**, or **acute renal failure** emerges.

**Interprofessional cue**  
When the stem names **family physician**, **cardiology**, or **pharmacy**, choose answers that **coordinate** rather than **operate in silos**—common Canadian framing.`,
      takeaways: `• **HF diagnosis and congestion** integrate **history, exam, biomarkers**, and **imaging** when available.  
• **Titrate** guideline-informed therapy with **renal/electrolyte/BP** safety nets.  
• **Escalate** for **ACS**, **acute pulmonary edema**, **malignant arrhythmia**, or **worsening renal failure** with instability.  
• **Document** reasoning for **referral** and **follow-up** intervals.  
• **SI labs** still test **clinical interpretation**, not unit trivia.`,
    },
    {
      preTest: [
        {
          question: "Which feature most strongly suggests urgent evaluation rather than routine HF follow-up?",
          options: [
            "Stable chronic symptoms with reliable follow-up in one week.",
            "Resting hypoxia, hypotension, and altered mentation with acute pulmonary edema symptoms.",
            "Mild ankle swelling without cardiopulmonary symptoms.",
            "Request for a medication list printout only.",
          ],
          correct: 1,
          rationale:
            "Hypoxia, hypotension, and altered mentation with acute pulmonary edema symptoms indicate time-sensitive escalation.",
        },
        {
          question: "Why is renal function monitoring essential when intensifying RAAS-pathway therapy in HF?",
          options: [
            "Creatinine never changes on these medications.",
            "These agents can affect renal perfusion and potassium, requiring safety monitoring.",
            "Renal monitoring is only needed in hospital.",
            "RAAS drugs are never used in CKD.",
          ],
          correct: 1,
          rationale:
            "RAAS modulators require monitoring for hyperkalemia and renal function changes—especially with CKD.",
        },
        {
          question: "Which patient statement should prompt consideration of ischemia rather than only diuretic adjustment?",
          options: [
            "Stable chronic edema without cardiopulmonary change.",
            "New exertional chest pressure with ECG changes suggestive of ischemia.",
            "Mild fatigue after poor sleep.",
            "Routine medication refill without symptoms.",
          ],
          correct: 1,
          rationale:
            "Exertional chest pressure with ischemic ECG changes requires ACS evaluation—not HF volume management alone.",
        },
      ],
      postTest: [
        {
          question: "What is the primary goal of evidence-based beta-blocker use in selected HFrEF patients?",
          options: [
            "Raise blood pressure in all clients.",
            "Improve outcomes in appropriate candidates with monitored initiation/titration.",
            "Replace diuretics entirely.",
            "Treat infection.",
          ],
          correct: 1,
          rationale:
            "Beta-blockers are guideline-supported for many HFrEF patients with careful initiation and monitoring—not universal BP raising.",
        },
        {
          question: "Which scenario best supports specialist referral for advanced HF therapies?",
          options: [
            "Mild symptoms controlled on first-line therapy with good adherence.",
            "Persistent severe symptoms despite optimized guideline therapy when the stem indicates advanced disease.",
            "First diagnosis of mild HF with good response to initial therapy.",
            "Asymptomatic client requesting a work note.",
          ],
          correct: 1,
          rationale:
            "Advanced therapies are considered when guideline-directed therapy is insufficient and disease is advanced—per referral pathways.",
        },
        {
          question: "Which monitoring pair is most central when spironolactone is used in selected HF patients?",
          options: [
            "Potassium and renal function.",
            "Only white blood cell count.",
            "Thyroid function only.",
            "Hemoglobin A1c only.",
          ],
          correct: 0,
          rationale:
            "MRA therapy risks hyperkalemia and renal dysfunction—monitor electrolytes and creatinine.",
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

export function npHeartFailurePrimaryCareHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpHeartFailurePrimaryCareGoldLessonInput(pathwayId);
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

export function getNpHeartFailurePrimaryCareGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Heart failure: outpatient management (${suf})`,
          seoTitle: `Heart failure primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} outpatient HF: phenotypes, GDMT principles, volume assessment, monitoring, and escalation—aligned to primary-care NP boards.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Heart failure: outpatient management (${suf})`,
            seoTitle: `Heart failure primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} community HF management with collaborative referral thresholds and SI-friendly lab interpretation.`,
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
    labsDiagnostics: HF_LABS_IMAGING,
    relatedSlugs: [ACS_GOLD_SLUG, "fnp-adult-hypertension-intensification", "copd-clinical-judgment-gold"],
    relatedTitlesBySlug: {
      [ACS_GOLD_SLUG]: "Acute coronary syndrome & chest pain",
      "fnp-adult-hypertension-intensification": "Adult hypertension intensification (FNP)",
      "copd-clinical-judgment-gold": "COPD clinical judgment",
    },
  });

  return {
    slug: NP_HEART_FAILURE_PRIMARY_CARE_GOLD_SLUG,
    title: v.title,
    topic: "Cardiovascular",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
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
