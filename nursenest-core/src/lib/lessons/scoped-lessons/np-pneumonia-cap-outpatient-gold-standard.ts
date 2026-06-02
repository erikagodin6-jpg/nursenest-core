/**
 * Community-acquired pneumonia (CAP) — outpatient primary-care NP judgment (US + Canada NP tracks).
 * Covers **site-of-care** rules, **risk scores at principle level**, **empiric therapy concepts**,
 * **follow-up**, and **return precautions** — without duplicating ICU ventilator management.
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
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";

export const NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG = "np-pneumonia-cap-outpatient-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**CAP in ambulatory NP practice**  
**Community-acquired pneumonia** in primary-care items tests **whether outpatient management is safe** versus **ED/hospital** care—integrate **vitals**, **oxygenation**, **mental status**, **comorbidities**, **pregnancy**, and **social supports** before you prescribe empiric antibiotics and send someone home.

**Clinical diagnosis integration**  
Pair **fever + cough + focal lung findings** with **risk of bacterial pneumonia** when the stem provides exam/imaging clues. **Atypical** presentations appear in **older adults** and **pregnancy**—do not anchor only on classic lobar pneumonia pictures.

**Site-of-care reasoning (exam level)**  
High-yield concepts: **hypotension**, **tachypnea**, **hypoxemia**, **acute confusion**, **inability to maintain oral intake**, **multilobar disease**, **significant comorbidity**, and **unreliable follow-up** push toward **hospital-level care**. Mild illness in **reliable** patients with **close follow-up** may remain outpatient when the vignette supports safety.

**Antibiotic principles**  
NP items reward **first-line community regimens** aligned to **local resistance patterns when hinted**, **macrolide vs beta-lactam** choices when **comorbidities** or **recent antibiotics** appear, **duration concepts** (often **short-course** when clinically appropriate), and **reassessment** within **48–72 hours**—not shotgun polypharmacy without indication.

**Pediatric overlay**  
**PNP-PC** stems may include **oxygen thresholds**, **hydration**, **parent return precautions**, and **vaccination status**—avoid applying **adult PSI/PORT** tools blindly to children when the item uses **pediatric severity** cues.

**Pregnancy overlay**  
**WHNP** items may test **drug safety in pregnancy** for respiratory infections—choose **pregnancy-appropriate** regimens when the stem demands it and **escalate** when **maternal hypoxia** or **sepsis** features appear.`;

const CAP_LABS_IMAGING = `**Pulse oximetry**  
Hypoxemia drives **site-of-care** and **follow-up intensity**. **Ambulatory desaturation** with exertion may still be concerning—items test whether you **recheck** after rest, **compare** to baseline, and **escalate** when low despite rest.

**Procalcitonin / labs when provided**  
Some vignettes use **procalcitonin** to **support bacterial burden** versus viral illness—interpret as **context**, not a single arbiter. **CBC** may show **leukocytosis**—nonspecific but supports **bacterial** patterns when paired with clinical findings.

**Chest imaging**  
**CXR** supports diagnosis when equivocal or when **complications** suspected; not every URI needs imaging. **Pleural effusion**, **multilobar involvement**, or **septic** features change management toward **hospital** care in many stems.`;

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
      title: "Community-acquired pneumonia: outpatient vs escalation (NP, US primary care)",
      seoTitle: "CAP outpatient management | NP US | NurseNest",
      seoDescription:
        "NP-level CAP: severity assessment, empiric therapy principles, follow-up windows, sepsis recognition, and peds/pregnancy overlays for primary-care certification prep.",
      clinical_meaning: `**Primary-care NP decisions**  
You **risk-stratify** using **integrated clinical picture**—vitals, oxygenation, age, comorbidities, pregnancy, frailty, and social determinants—before choosing **outpatient antibiotics** versus **ED referral**. Boards punish **home antibiotics** for patients who need **IV fluids**, **oxygen**, or **monitoring**.

**Follow-up discipline**  
Specify **when to return** for **worsening dyspnea**, **new hypoxia**, **inability to tolerate oral meds**, **confusion**, or **hemodynamic** instability—**vague** “call if worse” without **time-bound** reassessment loses points.`,
      exam_relevance: `Expect **next step** items: **CXR** when diagnosis uncertain with high risk, **empiric therapy** selection when bacterial pneumonia likely, **hospital referral** when severity tools or clinical picture demand it, and **sepsis recognition** when **hypotension** and **end-organ** dysfunction appear.

**Traps**  
• **Treating viral bronchitis** with antibiotics without bacterial pneumonia features.  
• **Ignoring hypoxia** or **tachypnea** in older adults who “look okay.”  
• **Missing pregnancy** as a modifier for **drug choice** and **threshold to escalate**.`,
      clinical_scenario: `**Vignette — 54-year-old with fever, productive cough, pleuritic pain**  
Vitals: **T 38.6°C**, **RR 24**, **HR 104**, **BP 122/70**, **SpO₂ 93%** on RA, **alert**. Exam: **focal crackles**. No **hypotension**.

**Outpatient fork**  
If the stem supports **mild–moderate CAP** without **major comorbidity** red flags, **empiric oral therapy** plus **48–72h follow-up** and **clear return precautions** may be correct. If **RR** rises further, **SpO₂** falls, or **BP** drops → **escalate**.

**Pediatric fork**  
A **3-year-old** with **tachypnea**, **retractions**, and **hypoxia** → **urgent/emergency** evaluation—do not mirror adult outpatient plans.`,
      takeaways: `• **Integrate** vitals, oxygenation, mentation, comorbidities, and supports for **site-of-care**.  
• **Empiric antibiotics** follow **guideline principles** and **patient factors** (allergy, recent antibiotics, pregnancy).  
• **Reassess** early—**48–72 hours** is a common exam anchor for outpatient CAP.  
• **Escalate** for **sepsis**, **hypoxia refractory** to conservative measures, or **inability** to maintain oral therapy.  
• **Peds** and **pregnancy** change **risk** and **drug safety**—read the stem.`,
    },
    {
      preTest: [
        {
          question: "Which combination most strongly supports hospital evaluation rather than outpatient CAP treatment?",
          options: [
            "Afebrile patient with mild cough and normal oxygen saturation.",
            "Hypotension, confusion, and severe hypoxemia despite supplemental oxygen in the setting of suspected pneumonia.",
            "Young adult with focal crackles, normal vitals, reliable support, and mild symptoms.",
            "Resolved URI symptoms without fever.",
          ],
          correct: 1,
          rationale:
            "Hypotension, confusion, and severe hypoxemia suggest severe illness/sepsis—hospital-level care.",
        },
        {
          question: "Why is early follow-up emphasized after initiating outpatient CAP therapy?",
          options: [
            "Antibiotics never fail.",
            "Clinical response should be assessed within 48–72 hours; lack of improvement warrants re-evaluation.",
            "Follow-up is only for children.",
            "Patients should stop antibiotics at 24 hours regardless of symptoms.",
          ],
          correct: 1,
          rationale:
            "Early reassessment catches treatment failure and complications—core outpatient safety practice.",
        },
        {
          question: "Which factor increases risk of atypical or severe presentation in pneumonia vignettes?",
          options: [
            "Healthy adolescent athlete without comorbidities.",
            "Older age with multiple comorbidities and potential altered mental status.",
            "Isolated sore throat without pulmonary symptoms.",
            "Allergic rhinitis without fever.",
          ],
          correct: 1,
          rationale:
            "Older adults may lack classic fever while still having serious pneumonia—integrate vitals, oxygenation, and mentation.",
        },
      ],
      postTest: [
        {
          question: "A pregnant patient has suspected CAP. What additional priority applies in many exam stems?",
          options: [
            "Ignore oxygenation because pregnancy is benign.",
            "Choose pregnancy-appropriate antibiotic regimens and lower thresholds to escalate if hypoxia or sepsis features appear.",
            "Avoid all imaging in every pregnant patient.",
            "Treat only with antivirals without assessment.",
          ],
          correct: 1,
          rationale:
            "Pregnancy changes drug safety and escalation thresholds; maternal oxygenation matters for both patients.",
        },
        {
          question: "Which finding should prompt reconsideration of outpatient management within days of starting therapy?",
          options: [
            "Improving fever trend with easier breathing and stable oxygen.",
            "Rising respiratory rate, worsening hypoxia, or new confusion.",
            "Completed antibiotic course with full recovery.",
            "Mild fatigue without vital sign change.",
          ],
          correct: 1,
          rationale:
            "Worsening vitals or mentation suggests failure or complication—requires urgent reassessment.",
        },
        {
          question: "What is the primary intent of empiric therapy selection in CAP?",
          options: [
            "Cover every possible organism with maximal broad-spectrum IV agents in all outpatients.",
            "Match likely pathogens and patient factors with guideline-informed first-line oral regimens when outpatient care is safe.",
            "Avoid antibiotics until culture returns in all cases.",
            "Use a single drug for all ages and comorbidities without adjustment.",
          ],
          correct: 1,
          rationale:
            "Empiric therapy balances spectrum with safety and route of care—parsimony with monitoring.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Community-acquired pneumonia: outpatient judgment (Canadian NP / CNPLE-aligned)",
      seoTitle: "CAP primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: CAP risk stratification, collaborative acute referral, antibiotic stewardship framing, and SI vitals—aligned to community primary-care practice.",
      clinical_meaning: `**Canadian outpatient context**  
Items may reference **walk-in clinic**, **telehealth limits**, and **regional antibiotic resistance** hints—choose **collaborative** plans with **clear documentation** and **safety netting**. **Metric vitals** should be interpreted as **risk**, not trivia.`,
      exam_relevance: `Expect **site-of-care** decisions, **when to send to ED**, **follow-up intervals**, and **parent/caregiver education** for pediatric cases. **Sepsis** recognition still applies—link to **SEPSIS_GOLD_SLUG** thinking without treating pneumonia as isolated from systemic illness.`,
      clinical_scenario: `**Vignette — frail older adult with cough and new confusion**  
**Altered mentation** plus infection suspicion often exceeds safe outpatient therapy—**escalate** for evaluation even if fever is absent. Document **acute change in baseline** as a **red flag**.`,
      takeaways: `• **Risk-integrate** age, comorbidities, oxygenation, BP, and mentation.  
• **Empiric therapy** aligns with **guideline principles** and **patient context**.  
• **Early follow-up** and **return precautions** reduce harm.  
• **Escalate** for **sepsis**, **hypoxia**, or **inability** to tolerate oral care.  
• **Pediatric** and **pregnancy** overlays change thresholds and therapy choices.`,
    },
    {
      preTest: [
        {
          question: "Which feature most strongly suggests urgent escalation in suspected pneumonia?",
          options: [
            "Mild cough without fever in a reliable patient.",
            "Hypotension, confusion, and severe respiratory distress.",
            "Completed antibiotic course with full recovery.",
            "Stable chronic symptoms without acute change.",
          ],
          correct: 1,
          rationale:
            "Sepsis and severe respiratory failure patterns require urgent evaluation—not outpatient oral therapy alone.",
        },
        {
          question: "Why might older adults with pneumonia lack classic fever?",
          options: [
            "Fever is impossible in pneumonia.",
            "Blunted fever response can occur—rely on vitals, oxygenation, mentation, and exam.",
            "Older adults never need antibiotics.",
            "Temperature is the only marker of severity.",
          ],
          correct: 1,
          rationale:
            "Geriatric presentations are atypical—integrate multiple data points.",
        },
        {
          question: "What is the primary goal of documenting follow-up after starting outpatient CAP therapy?",
          options: [
            "Satisfy billing only.",
            "Ensure timely reassessment for clinical response and early detection of failure.",
            "Avoid seeing the patient again.",
            "Replace return precautions.",
          ],
          correct: 1,
          rationale:
            "Structured follow-up is a safety mechanism—common exam expectation.",
        },
      ],
      postTest: [
        {
          question: "Which scenario best supports hospital referral for pediatric pneumonia suspicion?",
          options: [
            "Well-appearing child with mild cough and normal oxygen.",
            "Toxic appearance, retractions, and hypoxia despite initial measures.",
            "Routine school physical without acute symptoms.",
            "Resolved cold symptoms.",
          ],
          correct: 1,
          rationale:
            "Severe respiratory distress and hypoxia in children require urgent/emergency evaluation.",
        },
        {
          question: "Why integrate sepsis thinking into CAP management items?",
          options: [
            "Pneumonia never causes sepsis.",
            "Bacterial pneumonia can progress to sepsis—hypotension and organ dysfunction change site-of-care.",
            "Sepsis only occurs after surgery.",
            "Vitals do not matter if cough is productive.",
          ],
          correct: 1,
          rationale:
            "CAP can be a source of sepsis—recognition drives escalation.",
        },
        {
          question: "What is a key element of antibiotic stewardship in outpatient CAP vignettes?",
          options: [
            "Use the broadest IV regimen for every patient at home.",
            "Match therapy to severity and likely pathogens; reassess response; avoid unnecessary antibiotics for clear viral illness.",
            "Treat all coughs with antibiotics.",
            "Avoid follow-up after antibiotics.",
          ],
          correct: 1,
          rationale:
            "Stewardship balances effectiveness with unnecessary exposure—exam-relevant.",
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

export function npPneumoniaCapOutpatientHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpPneumoniaCapOutpatientGoldLessonInput(pathwayId);
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

export function getNpPneumoniaCapOutpatientGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Community-acquired pneumonia: outpatient judgment (${suf})`,
          seoTitle: `CAP outpatient care | ${lab} | NurseNest`,
          seoDescription: `${lab} CAP severity, empiric therapy principles, follow-up, and escalation for primary-care NP boards.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Community-acquired pneumonia: outpatient judgment (${suf})`,
            seoTitle: `CAP outpatient care | ${lab} | NurseNest`,
            seoDescription: `${lab} community pneumonia management with ED referral thresholds and stewardship framing.`,
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
    labsDiagnostics: CAP_LABS_IMAGING,
    relatedSlugs: [SEPSIS_GOLD_SLUG, "pneumonia-cap-nursing-gold", "np-asthma-outpatient-gold"],
    relatedTitlesBySlug: {
      [SEPSIS_GOLD_SLUG]: "Sepsis early recognition",
      "pneumonia-cap-nursing-gold": "Pneumonia (CAP) nursing priorities",
      "np-asthma-outpatient-gold": "Asthma outpatient management",
    },
  });

  return {
    slug: NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG,
    title: v.title,
    topic: "Respiratory (acute)",
    topicSlug: "respiratory-acute",
    bodySystem: "Respiratory",
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
