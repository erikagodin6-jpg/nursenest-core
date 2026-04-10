/**
 * Asthma — outpatient primary-care NP management (US + Canada NP tracks).
 * Complements COPD gold with **reversible obstruction**, **action plans**, **step therapy concepts**,
 * **exacerbation triage**, and **peds vs adult** cues — without duplicating inpatient ventilator content.
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
import { COPD_GOLD_STANDARD_SLUG } from "@/lib/lessons/scoped-lessons/copd-gold-standard";

const NP_HF_SLUG = "np-heart-failure-primary-care-gold" as const;

export const NP_ASTHMA_OUTPATIENT_GOLD_SLUG = "np-asthma-outpatient-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Asthma as a primary-care NP problem**  
**Asthma** is **variable airway hyperresponsiveness** with **reversible obstruction**—exam items reward **control assessment** (symptom frequency, night waking, rescue use, activity limits), **trigger identification** (viral, allergens, exercise, NSAIDs/aspirin sensitivity when hinted), and **step-up/step-down** thinking aligned to **guideline steps** rather than one-size inhaler advice.

**Differentiate from COPD and mimics**  
When dyspnea worsens, boards test whether you recognize **PE**, **pneumonia**, **heart failure**, **anaphylaxis**, and **upper airway obstruction** patterns—not every wheeze is “asthma flare” alone. **Absence of wheeze** does not rule out severe asthma—**silent chest** can be ominous.

**Pharmacologic principles (exam level)**  
**Inhaled corticosteroids (ICS)** as **anti-inflammatory backbone** for persistent asthma; **short-acting beta-agonists (SABA)** for rescue; **combination ICS/LABA** as **controller** options when the stem describes **persistent** symptoms; **add-on** therapies appear as **specialty-tier** choices when **uncontrolled** despite optimization—pick answers that match **severity** and **adherence**, not brand trivia.

**Non-pharmacologic anchors**  
**Spacer technique**, **adherence counseling**, **smoking/vaping cessation**, **immunizations**, **allergen mitigation when relevant**, and **written asthma action plan** concepts—items love **specific follow-up** after exacerbation.

**Exacerbation triage**  
Mild: increased rescue use with **normal mentation** and **mild hypoxia** may be managed outpatient with **steroid burst** when authorized and **close follow-up**. **Moderate–severe**: **accessory muscles**, **inability to speak in sentences**, **SpO₂ persistently low**, **PEF <50% predicted** (when measured), or **drowsiness** → **urgent ED**—do not “wait until Monday.”`;

const ASTHMA_LABS_PEAK_FLOW = `**Spirometry / peak flow (when provided)**  
**Obstructive pattern** with **bronchodilator reversibility** supports asthma diagnosis/monitoring—items may show **FEV1** improvement after bronchodilator. **Peak flow** trends support **action-plan** decisions when the vignette includes baseline personal best concepts.

**Allergy / eosinophil hints**  
**Eosinophilia** or **allergic rhinitis** context may point toward **Type 2–high** inflammation pathways in advanced items—choose **biologic add-on** only when the stem establishes **uncontrolled disease despite high-dose ICS** and **specialist alignment**.

**When to image**  
**CXR** is not routine for every exacerbation—use it when the stem suggests **pneumonia**, **pneumothorax**, **foreign body**, or **alternative diagnosis**.`;

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
      title: "Asthma: outpatient control, exacerbations, and action plans (NP, US primary care)",
      seoTitle: "Asthma outpatient management | NP US | NurseNest",
      seoDescription:
        "NP-level asthma: control assessment, ICS backbone, exacerbation triage, differential cues vs COPD/PE/anaphylaxis, peds vs adult cues, and safe escalation for FNP/AGPCNP/WHNP/PNP-PC boards.",
      clinical_meaning: `**FNP / AGPCNP / WHNP / PNP-PC overlays**  
**PNP-PC** vignettes may foreground **spirometry feasibility**, **school** and **sport** participation, **growth monitoring** with ICS dosing, and **parent action plans**. **WHNP** may embed **pregnancy** or **peripartum** contexts where **medication safety** changes triage. **FNP/AGPCNP** adult-heavy stems test **comorbidity** (obesity, GERD, rhinitis), **inhaler technique**, and **step-up rules** when **rescue use rises**.

**Control vs severity**  
Translate **symptom burden** and **rescue frequency** into **therapy intensity**—boards punish **stepping up** without addressing **nonadherence** or **incorrect device use** when the stem hints at them.`,
      exam_relevance: `Look for **best next step**: **spirometry** when diagnosis uncertain, **oral steroids** when exacerbation severity meets criteria, **ED referral** when **severe** features appear, and **follow-up within days** after any exacerbation.

**Traps**  
• **Leukotriene** as first-line replacement for ICS in **persistent** asthma.  
• **Treating wheeze alone** as benign when **hypoxia** or **fatigue** suggests severe attack.  
• **Confusing** **panic** with asthma—still assess **objective** airflow and **oxygenation**.`,
      clinical_scenario: `**Vignette — 34-year-old with “inhaler every hour”**  
They use **SABA nightly**, **wake with cough**, and **limit exercise**. Exam: **diffuse wheeze**, **SpO₂ 94%** on RA, **speaking full sentences**.

**Outpatient fork**  
This is **uncontrolled asthma**—address **ICS** (or intensify per guideline step), **technique**, **triggers**, **written plan**, and **close follow-up**. If the stem adds **silent chest**, **cyanosis**, **drowsiness**, or **SpO₂ <90%**, shift to **emergency activation**.

**Post-exacerbation**  
Schedule **review within days**, **reassess control**, and **adjust** maintenance therapy—items punish “call if worse” without interval.`,
      takeaways: `• **ICS** is central for persistent asthma—rescue-only patterns signal **poor control**.  
• **Action plans** specify **symptom thresholds**, **rescue steps**, and **when to seek emergency care**.  
• **Escalate** for **severe** exacerbation features or diagnostic uncertainty.  
• **Peds** adds **device**, **school**, and **growth** considerations; **pregnancy** changes risk calculus.  
• **Differentiate** COPD, **anaphylaxis**, **PE**, **pneumonia**, and **HF** when dyspnea acutely worsens.`,
    },
    {
      preTest: [
        {
          question: "Which pattern best indicates poorly controlled asthma in an outpatient stem?",
          options: [
            "Rescue inhaler use ≤2 times per week and normal activity.",
            "Frequent night symptoms, rising rescue use, and activity limitation.",
            "One isolated wheeze after viral illness two years ago with normal life since.",
            "Asymptomatic client requesting refills without symptoms.",
          ],
          correct: 1,
          rationale:
            "Night symptoms, increased rescue use, and limitation suggest inadequate control requiring regimen review.",
        },
        {
          question: "Why is inhaler technique review high yield before intensifying controller therapy?",
          options: [
            "Technique never affects delivery.",
            "Poor technique mimics refractory disease and wastes escalations.",
            "Spacers are only for children.",
            "Technique only matters for nebulizers.",
          ],
          correct: 1,
          rationale:
            "Delivery issues are a common reversible cause of poor control—address before assuming refractory disease.",
        },
        {
          question: "Which feature most strongly suggests emergency evaluation rather than outpatient adjustment?",
          options: [
            "Mild wheeze after exercise with normal oxygen saturation and normal mentation.",
            "Drowsiness, silent chest, or cyanosis with severe respiratory distress.",
            "Stable chronic symptoms with good peak flow at baseline.",
            "Request for a school form without acute change.",
          ],
          correct: 1,
          rationale:
            "Altered mentation, silent chest, or cyanosis suggests life-threatening obstruction—urgent care.",
        },
      ],
      postTest: [
        {
          question: "After a resolved outpatient exacerbation, what follow-up element is most exam-correct?",
          options: [
            "No follow-up unless the patient calls.",
            "Scheduled reassessment of control, inhaler use, and maintenance therapy within days to weeks.",
            "Stop all controller medications once symptoms resolve.",
            "Switch to oral antibiotics for all wheeze.",
          ],
          correct: 1,
          rationale:
            "Post-exacerbation follow-up reduces relapse and allows therapy adjustment—classic NP primary-care item.",
        },
        {
          question: "Which differential should be considered when acute dyspnea and wheeze appear with urticaria and exposure history?",
          options: [
            "Stable chronic COPD without change.",
            "Anaphylaxis until proven otherwise, with airway and hemodynamic priorities.",
            "Uncomplicated viral URI without examination.",
            "Pneumonia without fever or infiltrate hints.",
          ],
          correct: 1,
          rationale:
            "Anaphylaxis can mimic asthma; exposure history + urticaria shifts priorities to epinephrine and emergency care per stem.",
        },
        {
          question: "What is the primary purpose of an asthma action plan in primary care?",
          options: [
            "Replace clinician follow-up.",
            "Give patients clear steps for rising symptoms and when to seek urgent/emergency care.",
            "Document only for school legal requirements.",
            "Double controller doses indefinitely without reassessment.",
          ],
          correct: 1,
          rationale:
            "Action plans reduce harm by clarifying thresholds and responses—paired with follow-up.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Asthma: outpatient control and exacerbation triage (Canadian NP / CNPLE-aligned)",
      seoTitle: "Asthma outpatient management | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: asthma control assessment, ICS-focused management, collaborative acute care referral, metric-friendly vitals, and interprofessional documentation—CNPLE-aligned primary care.",
      clinical_meaning: `**Community asthma care in Canada**  
Items may reference **respiratory education services**, **pharmacist partners**, and **provincial formularies**—choose answers that **collaborate** and **document** rather than operating alone. **Spirometry access** may be implied as **referral** when diagnosis remains uncertain.

**Pediatric and school contexts**  
When the stem involves **children**, include **caregiver teaching**, **school medication plans**, and **urgent care thresholds** appropriate to **developmental** communication.`,
      exam_relevance: `Expect **control stratification**, **exacerbation severity**, **when ED is safer than home**, and **follow-up after steroid bursts**. **SI** oxygen saturation thresholds still map to **clinical risk**—choose **escalation** when instability appears.`,
      clinical_scenario: `**Vignette — adolescent with rising nocturnal cough**  
Rescue use **increased**, **PEF** trending down from personal best when provided, **exam wheeze**. Your plan: **optimize controller**, **teach spacer**, **written plan**, **follow-up**, and **escalate** if **PEF** or symptoms cross **severe** thresholds or **hypoxia** appears.`,
      takeaways: `• **Assess control** before labeling exacerbations “minor.”  
• **ICS** remains foundational for persistent disease—address adherence and technique.  
• **Emergency referral** for **severe** features or **diagnostic uncertainty**.  
• **Document** plans, **safety netting**, and **interprofessional** coordination.  
• **Anaphylaxis** remains a **cannot-miss** alternative when the stem provides allergic features.`,
    },
    {
      preTest: [
        {
          question: "Which history element most strongly supports stepping up chronic therapy in persistent asthma?",
          options: [
            "Rescue inhaler use once monthly only with vigorous exercise and normal sleep.",
            "Weekly daytime symptoms and frequent night waking despite prescribed controller.",
            "Remote childhood wheeze with no symptoms in adulthood.",
            "Allergic rhinitis alone without lower airway symptoms.",
          ],
          correct: 1,
          rationale:
            "Persistent symptoms despite therapy suggest inadequate control requiring regimen intensification and adherence review.",
        },
        {
          question: "When is spirometry most appropriate in exam logic?",
          options: [
            "Never in primary care.",
            "To document obstruction and reversibility when diagnosis is uncertain or to monitor severity when available.",
            "Only during inpatient admission.",
            "Only if the patient can perform a 6-minute walk.",
          ],
          correct: 1,
          rationale:
            "Spirometry supports diagnosis and monitoring when clinically indicated—common NP outpatient concept.",
        },
        {
          question: "Which finding should prompt urgent care rather than routine follow-up?",
          options: [
            "Stable mild cough without distress.",
            "Severe dyspnea with drowsiness and inability to speak in sentences.",
            "Request for repeat paperwork.",
            "Mild symptoms after documented good technique and adherence.",
          ],
          correct: 1,
          rationale:
            "Altered mentation and severe distress indicate urgent evaluation.",
        },
      ],
      postTest: [
        {
          question: "After a short oral steroid burst for exacerbation, what is essential?",
          options: [
            "Stop all inhalers.",
            "Follow-up to reassess control and adjust maintenance therapy.",
            "Ignore night symptoms if daytime is improved.",
            "Avoid documenting the exacerbation.",
          ],
          correct: 1,
          rationale:
            "Post-exacerbation review prevents relapse and allows step-up of controllers when indicated.",
        },
        {
          question: "Which comorbidity commonly worsens asthma control and should be addressed in management plans?",
          options: [
            "Allergic rhinitis with post-nasal drip.",
            "Remote appendectomy.",
            "Mild myopia.",
            "Prior tonsillectomy without airway symptoms.",
          ],
          correct: 0,
          rationale:
            "Upper airway allergic inflammation can worsen lower airway control—integrated management is exam-relevant.",
        },
        {
          question: "Why might pregnancy change asthma management decisions in a vignette?",
          options: [
            "Asthma never changes in pregnancy.",
            "Maternal and fetal oxygenation priorities may shift medication risk/benefit discussions and follow-up intensity.",
            "Stop all controllers in every pregnant patient.",
            "Only use oral steroids in pregnancy.",
          ],
          correct: 1,
          rationale:
            "Pregnancy requires balancing control and safety with closer monitoring—WHNP-relevant overlay.",
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

export function npAsthmaOutpatientHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpAsthmaOutpatientGoldLessonInput(pathwayId);
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

export function getNpAsthmaOutpatientGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Asthma: outpatient management (${suf})`,
          seoTitle: `Asthma outpatient care | ${lab} | NurseNest`,
          seoDescription: `${lab} asthma control, exacerbation triage, ICS-focused plans, and pediatric/adult overlays for primary-care NP preparation.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Asthma: outpatient management (${suf})`,
            seoTitle: `Asthma outpatient care | ${lab} | NurseNest`,
            seoDescription: `${lab} community asthma management with collaborative referral and acute escalation thresholds.`,
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
    labsDiagnostics: ASTHMA_LABS_PEAK_FLOW,
    relatedSlugs: [COPD_GOLD_STANDARD_SLUG, "pulmonary-embolism-recognition-gold", NP_HF_SLUG],
    relatedTitlesBySlug: {
      [COPD_GOLD_STANDARD_SLUG]: "COPD clinical judgment",
      "pulmonary-embolism-recognition-gold": "Pulmonary embolism recognition",
      [NP_HF_SLUG]: "Heart failure outpatient management",
    },
  });

  return {
    slug: NP_ASTHMA_OUTPATIENT_GOLD_SLUG,
    title: v.title,
    topic: "Respiratory",
    topicSlug: "respiratory",
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
