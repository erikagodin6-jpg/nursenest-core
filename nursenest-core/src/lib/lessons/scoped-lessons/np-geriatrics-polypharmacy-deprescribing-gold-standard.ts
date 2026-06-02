/**
 * Geriatrics: polypharmacy, potentially inappropriate medications, and deprescribing — NP primary-care tracks.
 *
 * **Authoring base:** Evidence-aligned geriatric prescribing themes (potentially inappropriate medication lists,
 * explicit deprescribing / medication review process, anticholinergic burden, renal dosing, falls/sedation risk,
 * shared decision-making). If the team adds a deprescribing/polypharmacy source document to the repo, fold
 * institution-specific protocols into {@link SHARED_CORE_BODY} without duplicating slugs.
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
import { HIGH_ALERT_MEDS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/high-alert-medications-gold-standard";
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";

export const NP_GERIATRICS_POLYPHARMACY_DEPRESCRIBING_GOLD_SLUG = "np-geriatrics-polypharmacy-deprescribing-gold" as const;

/** AGPCNP gets the deepest adult–gerontology framing; FNP/WHNP/PNP share `us_np` with pathway-specific titles. */
const PATHWAY_VARIANT: Record<string, "agpcnp" | "us_np" | "ca_np"> = {
  "us-np-agpcnp": "agpcnp",
  "us-np-fnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Polypharmacy as a geriatric syndrome (exam lens)**  
**Polypharmacy** means **too many medications for the patient’s physiology, cognition, and goals**—not only a number count. Boards reward recognizing **cumulative anticholinergic load**, **orthostatic risk**, **bleeding stacks** (antiplatelet + anticoagulant + NSAID), **hypoglycemia** from insulin/sulfonylureas, **sedation/fall** pairings, and **renal/hepatic** clearance limits before you add another pill.

**Potentially inappropriate medications (PIM) — conceptual, not rote list memorization**  
Items reference **Beers-criteria-style** and **STOPP/START-style** thinking: **high-risk** agents in **older adults** (long-acting benzodiazepines, anticholinergic antihistamines, high anticholinergic antidepressants, sliding insulin without structure, NSAIDs with CKD/bleeding risk), **drug–disease** interactions (peripheral alpha-blockade in syncope, strong anticholinergics in cognitive impairment), and **duration limits** (PPIs without indication, chronic opioids without goals).

**Deprescribing process (what NP items actually test)**  
A defensible sequence: **(1)** reconcile all sources (pharmacy, hospital discharge, OTC, supplements); **(2)** identify **indication**, **duration**, and **benefit vs harm** for each; **(3)** prioritize **high-risk / low-benefit** pairs first; **(4)** align with **patient goals** (symptom burden, fall prevention, cognition, hospitalization avoidance); **(5)** **taper** when physiologic dependence exists (benzodiazepines, PPI rebound, opioids, beta-blockers); **(6)** **monitor** (orthostatics, electrolytes, glucose, cognition, bleeding, falls).

**Shared decision-making**  
Deprescribing is not “stopping meds to save money”—it is **risk-aware simplification** with **documented** discussion of **trade-offs** and **what to watch** after a change.

**When NOT to deprescribe in the stem**  
**Active ischemia**, **new arrhythmia**, **severe pain crisis**, **uncontrolled mania/psychosis**, or **life-sustaining therapy** where the patient values continuation—choose answers that **stabilize first**, then simplify.`;

const POLYPHARM_LABS_MONITORING = `**Renal function**  
**eGFR / creatinine** drive dosing for **metformin**, **NOACs**, **dabigatran**, **many psychotropics**, and **RAAS drugs**. **Rising creatinine** after a change may signal **dehydration**, **obstruction**, or **nephrotoxic** stacks—items test **hold/adjust** versus **blind continuation**.

**Electrolytes**  
**Hyperkalemia** with **RAAS + K-sparing** + **NSAIDs**; **hyponatremia** with **thiazides**, **SSRIs**, **carbamazepine**—pair with **symptoms** (weakness, falls, confusion).

**Orthostatic vitals**  
When the stem gives lying/standing BP or mentions **falls/syncope**, tie **alpha-blockers**, **multiple antihypertensives**, **vasodilators**, and **sedatives** to **measured orthostasis** before intensifying BP meds.

**Glucose**  
Tight glycemic targets may **harm** frail elders—items reward **relaxing** regimens when **hypoglycemia**, **falls**, or **limited life expectancy** appear.

**Cognitive screening context**  
When anticholinergic burden is high, **cognition** may improve modestly after deprescribing—boards test **attribution discipline** (not promising cure) and **follow-up**.`;

function t(
  variant: "agpcnp" | "us_np" | "ca_np",
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

const VARIANTS: Record<"agpcnp" | "us_np" | "ca_np", ReturnType<typeof t>> = {
  agpcnp: t(
    "agpcnp",
    {
      title: "Polypharmacy & deprescribing — adult–gerontology primary care depth (AGPCNP, US)",
      seoTitle: "Geriatric polypharmacy & deprescribing | AGPCNP US | NurseNest",
      seoDescription:
        "AGPCNP-level geriatric pharmacology: multimorbidity, frailty, PIM concepts, deprescribing sequence, high-risk drug classes, monitoring, and exam traps—strongest NP depth for older adults in primary care.",
      clinical_meaning: `**Adult–Gerontology primary care NP (deepest track here)**  
AGPCNP items expect you to **hold multiple chronic problems in working memory**: **HF + CKD + AF + OA + insomnia** in one vignette, then choose the **next medication change** that **reduces harm** without abandoning **evidence-based** therapy that still matches goals.

**Frailty and life expectancy**  
When stems flag **recurrent falls**, **slow gait**, **dependence**, or **limited reserve**, **tight chronic targets** (A1c, BP) may yield to **hypoglycemia prevention**, **orthostasis reduction**, and **function preservation**—pick answers that **individualize**, not **maximize numbers**.

**Geriatric syndromes as outcomes**  
Tie polypharmacy to **falls**, **delirium**, **urinary retention**, **constipation**, **anorexia**, and **bleeding**—then **deprescribe** or **substitute** with **monitoring**.

**Collaboration**  
Complex deprescribing may involve **cardiology**, **nephrology**, **psychiatry**, and **pharmacy**—NP answers show **coordinated taper plans** and **clear handoffs**, not silent changes.`,
      exam_relevance: `Expect **prioritization**: which drug to address first when **GI bleed risk**, **falls**, and **hyperglycemia** coexist. **Mechanism** questions link **anticholinergics** to **cognition/constipation/urinary retention**, **sedatives** to **falls**, **NSAIDs** to **renal/bleeding**.

**STOPP/Beers-style traps**  
• New **anticholinergic** for insomnia in **dementia**.  
• **NSAID** with **CKD + warfarin** without gastric protection plan.  
• **Long-acting benzo** for new anxiety in **high fall risk**.  
• **Sliding-scale insulin** without basal strategy in **cognitively impaired** adults.

**Deprescribing trials**  
Items reward **one change at a time** with **follow-up** versus **poly-change chaos**; **taper** language for **benzos/PPIs/opioids** when dependence risk exists.`,
      clinical_scenario: `**Vignette — 79-year-old, eGFR 38, on warfarin, ibuprofen as needed for knee pain, diphenhydramine nightly for sleep, amlodipine + HCTZ, metformin**  
Reports **bruising**, **dark stools**, **orthostasis**, and **worsening confusion**.

**AGPCNP fork**  
**GI bleed risk** and **anticholinergic sedation** compete for first-line harm reduction: address **NSAID + anticoagulant** stack and **sedating antihistamine** with **safer alternatives** and **specialist coordination** as needed—document **fall risk** and **cognitive** impact. **Orthostatics** before adding **more antihypertensive**.

**Deprescribing documentation**  
Your note should show **patient priorities**, **risks discussed**, **monitoring plan** (Hgb, orthostatics, renal panel), and **follow-up interval**—not “stop everything.”`,
      takeaways: `• **Polypharmacy** is **risk integration**, not pill counting.  
• **PIM concepts** guide **what to challenge first** when harms cluster.  
• **Deprescribe** with **tapers**, **monitoring**, and **goal alignment**.  
• **AGPCNP** items foreground **multimorbidity**, **frailty**, and **syndrome prevention** (falls, delirium, bleeding).  
• Pair with **\`high-alert-medications-safety-gold\`** and **\`fnp-geriatric-falls-syncope\`** for mechanistic depth.`,
    },
    {
      preTest: [
        {
          question:
            "Which factor most strongly supports reviewing and often reducing antihypertensive intensity in a frail older adult with recurrent falls and symptomatic orthostasis?",
          options: [
            "Desire to reach arbitrary numeric goals regardless of symptoms.",
            "Orthostatic hypotension with falls when the regimen may exceed autonomic reserve.",
            "Mild isolated hypertension without symptoms or falls.",
            "Patient request for more medications.",
          ],
          correct: 1,
          rationale:
            "Geriatric care prioritizes function and harm reduction; orthostasis with falls often warrants regimen simplification and measured reassessment.",
        },
        {
          question: "Why is diphenhydramine often a poor choice for chronic insomnia in older adults on exams?",
          options: [
            "It lacks anticholinergic effects.",
            "It carries high anticholinergic burden with cognitive and fall risk in aging adults.",
            "It is always safer than prescription sleep aids.",
            "It improves gait speed.",
          ],
          correct: 1,
          rationale:
            "First-generation antihistamines are anticholinergic and increase cognitive and fall risk—classic PIM pattern.",
        },
        {
          question: "What is the primary intent of a structured deprescribing approach?",
          options: [
            "Stop all chronic medications regardless of indication.",
            "Reduce harm while preserving beneficial therapy aligned with patient goals and monitoring.",
            "Maximize pill count for completeness.",
            "Delegate all decisions to the pharmacist without NP involvement.",
          ],
          correct: 1,
          rationale:
            "Deprescribing is risk-aware simplification with monitoring—not blanket cessation.",
        },
      ],
      postTest: [
        {
          question:
            "An older adult takes an NSAID regularly for OA and is anticoagulated with declining renal function. What is the highest-priority safety concern in most board vignettes?",
          options: [
            "Mild knee stiffness without systemic symptoms.",
            "GI bleeding risk and renal injury from combined nephrotoxic and bleeding-prone agents.",
            "Need for physical therapy referral alone.",
            "Vitamin D level without context.",
          ],
          correct: 1,
          rationale:
            "NSAIDs plus anticoagulation with CKD stacks bleeding and renal risk—often the priority intervention target.",
        },
        {
          question: "Which monitoring pair is most appropriate after reducing or stopping a PPI that was long-term without clear indication?",
          options: [
            "Ignore symptoms because PPIs have no rebound.",
            "Warn about dyspepsis/reflux recurrence and revisit need; consider step-down strategies.",
            "Start antibiotics empirically.",
            "Double the PPI secretly.",
          ],
          correct: 1,
          rationale:
            "PPI deprescribing may unmask reflux; patients need symptoms plans and follow-up—not abrupt abandonment.",
        },
        {
          question: "Why might tight glycemic targets be inappropriate in some frail older adults?",
          options: [
            "Frailty never changes diabetes risk.",
            "Hypoglycemia risk and falls may outweigh marginal glycemic gains when life expectancy or cognition is limited.",
            "A1c is never measured in elders.",
            "Metformin is always contraindicated.",
          ],
          correct: 1,
          rationale:
            "Individualized glycemic goals balance benefit with hypoglycemia and functional harm—core geriatric diabetes reasoning.",
        },
      ],
    },
  ),
  us_np: t(
    "us_np",
    {
      title: "Polypharmacy & deprescribing in older adults (FNP / WHNP / PNP-PC primary care, US)",
      seoTitle: "Geriatric polypharmacy & deprescribing | NP US | NurseNest",
      seoDescription:
        "Family and population-focused NP tracks: medication reconciliation, PIM awareness, deprescribing steps, high-risk combinations, and goal-concordant simplification for certification-level practice.",
      clinical_meaning: `**FNP** spans ages—polypharmacy appears in **middle-aged multimorbidity** and **frail elders**. **WHNP** may embed **pregnancy** or **perimenopause** where **teratogenic** or **hormonal** meds interact with psychotropics—still apply **geriatric principles** when caring for **older women**. **PNP-PC** rarely centers geriatrics, but **teen polypharmacy** (ADHD + asthma + OTC) appears—use **weight-based** reasoning and **growth** context; this lesson’s **older-adult** spine remains the default unless the stem shifts age.

**Medication reconciliation**  
Every complex visit starts with **one list**—include **OTC**, **supplements**, and **specialist** changes—before you add therapy.`,
      exam_relevance: `Questions pair **falls** with **sedatives**, **hypoglycemia** with **insulin secretagogues**, and **renal injury** with **NSAIDs + RAAS blockade**. Choose **harm-reduction** first when **acute instability** is absent but **risk** is cumulative.

**WHNP/PNP overlays**  
• **WHNP**: pregnancy-safe alternatives when deprescribing **teratogens**; **bone health** when stopping **long-term PPI** in **postmenopausal** risk context.  
• **PNP-PC**: avoid applying **Beers list** to **pediatric** patients—use **pediatric** interaction reasoning when the stem is a child.`,
      clinical_scenario: `**Vignette — 68-year-old with memory complaints, urinary retention, constipation, and new confusion**  
Medications include **oxybutynin**, **diphenhydramine**, **TCA** for pain, and **benzodiazepine** PRN.

**Fork**  
**Anticholinergic burden** and **sedation** likely worsen **cognition** and **falls**—prioritize **substitution/deprescribing** with **behavioral** strategies, **pain plan** revision, and **close follow-up**; evaluate **delirium** triggers medically.`,
      takeaways: `• **Reconcile** completely before adding.  
• **Target** highest-risk/low-benefit medications first.  
• **Taper** when dependence exists; **monitor** after changes.  
• **FNP/WHNP/PNP**: read **age** and **reproductive** cues before applying geriatric-only rules.  
• Use **\`np-primary-care-foundations-gold\`** for documentation and SDM scaffolding.`,
    },
    {
      preTest: [
        {
          question: "Which combination most strongly increases bleeding risk in an older adult?",
          options: [
            "Acetaminophen alone for mild pain with normal liver function.",
            "NSAID plus anticoagulant with CKD and history of peptic disease.",
            "Isolated mild hypertension without medications.",
            "Vitamin D supplementation per deficiency replacement.",
          ],
          correct: 1,
          rationale:
            "Anticoagulation plus NSAID with renal and GI risk stacks bleeding—classic polypharmacy harm.",
        },
        {
          question: "What is the best initial step before deprescribing multiple agents in a complex older adult?",
          options: [
            "Stop all nonprescription products because they are harmless.",
            "Complete reconciliation including OTC and supplements, then prioritize by risk and goals.",
            "Add a new sedative for anxiety before reviewing current sedatives.",
            "Ignore patient goals to follow guidelines strictly.",
          ],
          correct: 1,
          rationale:
            "Reconciliation and prioritization precede safe deprescribing.",
        },
        {
          question: "Why might tapering benzodiazepines be preferred over abrupt discontinuation?",
          options: [
            "Withdrawal and rebound symptoms can be dangerous; taper reduces risk with monitoring.",
            "Abrupt stops are always safe.",
            "Tapers are never needed in older adults.",
            "Benzodiazepines have no dependence risk.",
          ],
          correct: 0,
          rationale:
            "Physiologic dependence can cause withdrawal; gradual taper with monitoring is standard teaching.",
        },
      ],
      postTest: [
        {
          question: "Which patient goal best supports deprescribing a chronic medication with limited benefit?",
          options: [
            "Maximize pill burden regardless of symptoms.",
            "Reduce fall risk and sedation while maintaining function and symptom control.",
            "Avoid all follow-up after stopping a medication.",
            "Continue therapy solely because it was started years ago.",
          ],
          correct: 1,
          rationale:
            "Goal-concordant care aligns deprescribing with harms the patient wants to avoid.",
        },
        {
          question: "Which finding should prompt urgent evaluation rather than outpatient deprescribing alone?",
          options: [
            "Stable chronic polypharmacy without acute change.",
            "Melena with hemodynamic instability and suspected upper GI bleeding.",
            "Mild dry mouth without other symptoms.",
            "Routine medication refill.",
          ],
          correct: 1,
          rationale:
            "Acute GI bleeding with instability requires emergency management—not clinic taper alone.",
        },
        {
          question: "What is the primary exam purpose of anticholinergic burden review?",
          options: [
            "Ignore cognition because medications never affect it.",
            "Reduce medications that worsen cognition, falls, constipation, and urinary retention when alternatives exist.",
            "Add anticholinergics for all insomnia.",
            "Stop all psychiatric medications in every older adult.",
          ],
          correct: 1,
          rationale:
            "Cumulative anticholinergic load worsens geriatric syndromes—deprescribing targets meaningful harm.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Polypharmacy & deprescribing in older adults (Canadian NP / CNPLE-aligned)",
      seoTitle: "Geriatric polypharmacy & deprescribing | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP preparation: interprofessional deprescribing, metric lab interpretation, collaborative agreements, and primary-care scope—aligned to community practice and CNPLE-style reasoning.",
      clinical_meaning: `**Canadian community context**  
CNPLE-aligned items emphasize **collaborative practice**, **pharmacist partners**, and **clear documentation** for **medication reviews**. Expect **SI labs** (eGFR, electrolytes) and **provincial formulary** hints—translate to **risk**, not memorized conversions.

**Primary-care scope**  
NP answers show **defensible prescribing changes** within **scope**, **consultation** when **high-risk tapers** (benzodiazepines, opioids) need **multidisciplinary** alignment, and **patient safety** when **acute** illness overlaps **chronic** stacks.`,
      exam_relevance: `Same **PIM** and **deprescribing** logic as US tracks with **Canadian** interprofessional language. Watch for **over-tight BP** in **frail** patients and **renal dosing** errors with **common renally cleared drugs**.`,
      clinical_scenario: `**Vignette — older adult post-discharge with 12 new medications layered on old prescriptions**  
Your first job is **reconciliation** and **indication review**, then **prioritize** **high-risk duplicates** (multiple sedatives, duplicate antihypertensives, NSAIDs) with **scheduled follow-up** and **patient/caregiver education**.`,
      takeaways: `• **Reconcile** after transitions of care—highest yield deprescribing opportunity.  
• **Collaborate** with pharmacy and physicians for complex tapers.  
• **Document** goals, risks, and monitoring.  
• **SI labs** still test **clinical interpretation** in context.  
• **Escalate** acute bleeding, **severe** electrolyte crisis, or **instability**.`,
    },
    {
      preTest: [
        {
          question: "Which element is most important when documenting deprescribing in Canadian interprofessional practice?",
          options: [
            "Only the drug name without context.",
            "Indication, risks discussed, monitoring plan, and follow-up interval.",
            "Secret changes without patient knowledge.",
            "Avoiding documentation to reduce liability.",
          ],
          correct: 1,
          rationale:
            "Clear indication and monitoring support safe collaborative care—exam-relevant documentation.",
        },
        {
          question: "Why is renal function central to geriatric medication review?",
          options: [
            "Creatinine never affects dosing.",
            "Many drugs require dose adjustment or avoidance as eGFR declines.",
            "Renal function is irrelevant in older adults.",
            "eGFR is only measured in ICU.",
          ],
          correct: 1,
          rationale:
            "Renal clearance drives safety for many common medications—core polypharmacy reasoning.",
        },
        {
          question: "Which scenario most supports pharmacist collaboration in deprescribing?",
          options: [
            "Single acute otitis media in a healthy child.",
            "Complex polypharmacy with interacting agents and taper planning across prescribers.",
            "Routine sunscreen advice.",
            "Minor bruise without medication changes.",
          ],
          correct: 1,
          rationale:
            "Complex interactions and tapers benefit from pharmacist partnership—common Canadian care model.",
        },
      ],
      postTest: [
        {
          question: "After stopping a long-term PPI, what should be discussed with the patient?",
          options: [
            "That rebound symptoms cannot occur.",
            "Possible reflux recurrence, warning signs for urgent care, and follow-up.",
            "That all stomach problems are cured.",
            "To restart at double dose indefinitely.",
          ],
          correct: 1,
          rationale:
            "Deprescribing includes contingency planning for rebound or recurrent symptoms.",
        },
        {
          question: "Which finding should prompt urgent care rather than outpatient deprescribing alone?",
          options: [
            "Stable chronic medications without acute symptoms.",
            "Hematemesis with hemodynamic compromise.",
            "Mild dry skin.",
            "Routine vaccination discussion.",
          ],
          correct: 1,
          rationale:
            "Acute upper GI bleeding with instability is an emergency—not clinic deprescribing alone.",
        },
        {
          question: "What is the primary purpose of prioritizing potentially inappropriate sedatives in a fall-prone older adult?",
          options: [
            "Increase sedation to prevent anxiety.",
            "Reduce falls and injury by lowering sedative burden when alternatives exist.",
            "Ignore falls as unrelated to medications.",
            "Add another sedative for sleep.",
          ],
          correct: 1,
          rationale:
            "Sedatives increase fall risk—deprescribing targets preventable harm.",
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

export function npGeriatricsPolypharmacyDeprescribingHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpGeriatricsPolypharmacyDeprescribingGoldLessonInput(pathwayId);
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

export function getNpGeriatricsPolypharmacyDeprescribingGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const variantKey = PATHWAY_VARIANT[pathwayId];
  if (!variantKey) return null;
  const base = VARIANTS[variantKey];
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;

  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);

  const titleForPathway = (): { title: string; seoTitle: string; seoDescription: string } => {
    if (pathwayId === "us-np-agpcnp") {
      return {
        title: "Polypharmacy & deprescribing (AGPCNP, US — adult–gerontology depth)",
        seoTitle: "Geriatric polypharmacy & deprescribing | AGPCNP US | NurseNest",
        seoDescription:
          "Adult–Gerontology primary care NP: multimorbidity, frailty, PIM concepts, structured deprescribing, monitoring, and certification-level geriatric pharmacology.",
      };
    }
    if (pathwayId === "us-np-whnp") {
      return {
        title: `Polypharmacy & deprescribing (${lab}, US — women’s-health primary care)`,
        seoTitle: `Geriatric polypharmacy & deprescribing | ${lab} US | NurseNest`,
        seoDescription: `${lab} primary care: medication reconciliation, high-risk combinations in older women, pregnancy-safety overlays when stems shift age, and goal-concordant deprescribing.`,
      };
    }
    if (pathwayId === "us-np-pnp-pc") {
      return {
        title: `Polypharmacy & deprescribing (${lab}, US — pediatric primary care cross-age awareness)`,
        seoTitle: `Polypharmacy & deprescribing | ${lab} US | NurseNest`,
        seoDescription: `${lab}: geriatric lesson for cross-age prescribing awareness; apply pediatric-specific reasoning when stems involve children (weight-based dosing, age-appropriate PIM concepts).`,
      };
    }
    if (pathwayId === "ca-np-cnple") {
      return {
        title: `Polypharmacy & deprescribing (${suf})`,
        seoTitle: `Geriatric polypharmacy & deprescribing | ${lab} | NurseNest`,
        seoDescription: `${lab} community care: interprofessional deprescribing, SI labs, collaborative documentation, and CNPLE-aligned geriatric medication safety.`,
      };
    }
    return {
      title: `Polypharmacy & deprescribing (${suf})`,
      seoTitle: `Geriatric polypharmacy & deprescribing | ${lab} | NurseNest`,
      seoDescription: `${lab} primary care: reconciliation, PIM awareness, deprescribing sequence, and harm reduction for older adults.`,
    };
  };

  const o = titleForPathway();
  const v = {
    ...base,
    title: o.title,
    seoTitle: o.seoTitle,
    seoDescription: o.seoDescription,
  };

  const syn = synthesizeGoldPremiumSections({
    sharedCore: SHARED_CORE_BODY,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "NP certification preparation",
    labsDiagnostics: POLYPHARM_LABS_MONITORING,
    relatedSlugs: [
      HIGH_ALERT_MEDS_GOLD_SLUG,
      NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG,
      "fnp-geriatric-falls-syncope",
    ],
    relatedTitlesBySlug: {
      [HIGH_ALERT_MEDS_GOLD_SLUG]: "High-alert medication safety",
      [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG]: "NP primary-care foundations",
      "fnp-geriatric-falls-syncope": "Geriatric falls & syncope (FNP)",
    },
  });

  return {
    slug: NP_GERIATRICS_POLYPHARMACY_DEPRESCRIBING_GOLD_SLUG,
    title: v.title,
    topic: "Geriatrics",
    topicSlug: "geriatrics",
    bodySystem: "General",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: ensurePremiumSeoDescription(v.seoDescription, PATHWAY_EXAM_LABEL[pathwayId] ?? pathwayId),
    sections: syn.sections,
    premiumOmittedSections: syn.premiumOmittedSections,
    relatedLessonRefs: syn.relatedLessonRefs,
    preTest: base.quizzes.preTest,
    postTest: base.quizzes.postTest,
  };
}
