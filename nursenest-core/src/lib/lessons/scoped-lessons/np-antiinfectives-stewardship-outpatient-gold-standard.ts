/**
 * Anti-infectives & antibiotic stewardship — outpatient primary-care NP (US + Canada NP tracks).
 * Builds NP-level **drug-class reasoning**, **empiric selection**, **duration**, **de-escalation**, **resistance**,
 * **adverse effects** (C. diff, QT, tendinopathy), **interaction** checks, and **documentation** for allergy
 * and prior antibiotic exposure—complements {@link SEPSIS_GOLD_SLUG} (inpatient stabilization) and
 * {@link NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG} (CAP syndrome) without duplicating nursing-only abx lessons.
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
import { NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-pneumonia-cap-outpatient-gold-standard";

export const NP_ANTIINFECTIVES_STEWARDSHIP_OUTPATIENT_GOLD_SLUG = "np-antiinfectives-stewardship-outpatient-gold" as const;

const MED_FAMILY_ANTIBIOTICS_GOLD = "med-family-antibiotics-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Anti-infective prescribing as NP judgment**  
Outpatient **antibiotics** are not “pick a familiar drug”—items reward **syndrome-appropriate spectrum**, **duration**, **local resistance hints**, **prior exposures**, **pregnancy/lactation**, **renal dosing**, **drug interactions**, and **follow-up** to prove response. **Stewardship** means **narrow when you can**, **avoid duplicates**, **document indication**, and **stop** or **de-escalate** when cultures or clinical course allow.

**Major oral classes (exam-level mechanics)**  
• **Beta-lactams** (penicillins, cephalosporins, amoxicillin-clavulanate): **allergy documentation** (true IgE vs intolerance), **cross-reactivity** themes when the stem tests **severe PCN allergy** vs **cephalosporin** use.  
• **Macrolides** (azithromycin, clarithromycin): **QT prolongation** with other agents, **drug–drug** interactions, **atypical** coverage contexts—avoid as “harmless” when **arrhythmia** risk is high.  
• **Fluoroquinolones**: **tendon rupture**, **aortic aneurysm** history, **neuro/psych** effects, **glucose** swings—reserve when benefits outweigh **boxed-warning** risks; many boards punish casual FQ use for **uncomplicated** infections where first-line options exist.  
• **TMP-SMX**: **hyperkalemia** with **ACEi/ARB/spironolactone**, **CKD**, **drug interaction** with **warfarin** (when stem provides INR context), **rash** patterns—useful for certain **UTI/skin/PCP** contexts when safe.  
• **Tetracyclines** (doxycycline): **pill esophagitis** counseling, **photosensitivity**, **avoid in pregnancy** (classic exam).  
• **Nitrofurantoin**: **uncomplicated cystitis** niche—avoid when **eGFR** below common thresholds in the stem or when **pyelonephritis** is implied.  
• **Metronidazole**: **anaerobic/GI** anaerobes and **Giardia**—**disulfiram-like** reaction with alcohol themes, **CNS** toxicity with prolonged use.  
• **Antifungals (azoles)**: **CYP450 interactions** (statins, warfarin, calcineurin inhibitors), **QT**, **hepatotoxicity**—NP items test **interaction vigilance**.

**Stewardship behaviors that win points**  
• **Obtain cultures** when **severe**, **recurrent**, **hospital-risk**, or **nonresponsive**.  
• **Narrow spectrum** after identification.  
• **Shortest effective duration** for uncomplicated infections when guidelines support it.  
• **Avoid treating colonization** or **viral illness** with antibiotics—watch **procalcitonin** or **clinical** cues when provided.  
• **C. diff prevention**: prior antibiotics, **PPI** context, **elderly**—choose answers that **avoid unnecessary** broad agents.

**When outpatient antibiotics are wrong**  
**Sepsis**, **toxic appearance**, **inability to tolerate PO**, **rapid progression**, **meningeal signs**, **necrotizing** skin infection hints—activate **ED/hospital** pathways; NP prescribing is not a substitute for **resuscitation**.`;

const ABX_LABS_MONITORING = `**Renal/hepatic dosing**  
Adjust **beta-lactams**, **nitrofurantoin avoidance**, **FQ dose**, and **vancomycin** (when oral/IV contexts appear) using **CrCl/eGFR** when the stem provides labs.

**INR / bleeding**  
**TMP-SMX**, **macrolides**, and **azole** interactions can perturb **warfarin**—monitor when the vignette includes **bleeding** or **supratherapeutic INR**.

**CBC / LFTs**  
**Neutropenia** with certain agents (context-dependent), **hepatotoxicity** monitoring with **azole** or **nitrofurantoin** long use—items test **scheduled labs** when risk warrants.

**Pregnancy & lactation**  
Know **high-yield contraindications** (e.g., **tetracyclines**), **safe first-line** themes for **UTI** when the stem is OB-focused—choose **guideline-aligned** answers, not memorized obscure teratogen lists without cues.`;

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
      title: "Anti-infectives & stewardship: outpatient prescribing (NP, US primary care)",
      seoTitle: "Antibiotic stewardship & anti-infectives | NP US | NurseNest",
      seoDescription:
        "NP-level empiric therapy, class effects, interactions, duration, resistance, C. diff risk, renal dosing, pregnancy cues, and de-escalation—aligned to primary-care certification preparation.",
      clinical_meaning: `**Why this sits above “nursing implications only”**  
NP items expect you to **choose**, **adjust**, and **defend** regimens: **first-line vs broader**, **oral step-down**, **prophylaxis vs treatment**, and **when to stop**. Pair every prescription with **monitoring** (symptoms in 48–72h, **C diff** diarrhea vigilance, **rash**, **renal recheck**).

**WHNP / PNP overlays**  
**Pregnancy** changes **UTI**, **STI**, and **respiratory** choices; **pediatrics** emphasizes **weight-based** concepts when the stem provides **mg/kg**, **otitis** duration rules, and **watchful waiting** for **otitis** when appropriate—read **age and severity** carefully.`,
      exam_relevance: `Expect **drug-class traps**: FQ + **steroid** tendon risk, **macrolide** + **QT** meds, **TMP-SMX** + **hyperkalemia** cocktail, **azole** + **statin** myopathy risk, **nitrofurantoin** in **low eGFR**, and **beta-lactam allergy** clarifications.

**Stewardship stems**  
“Patient demands antibiotics for **clear viral** URI” → **education**, **symptomatic care**, **safety net**—not automatic azithromycin.`,
      clinical_scenario: `**Vignette — recurrent UTI with multi-drug history**  
Before empiric **FQ**, the stem may expect **culture**, **review of prior regimens**, **renal dosing**, and **avoidance** of **nitrofurantoin** if **eGFR** contraindicates—choose **parsimony** and **documentation**.

**Vignette — cellulitis with systemic features**  
If **tachycardia**, **hypotension**, or **rapid spread** appears—**ED**, not “stronger oral pill” alone.`,
      takeaways: `• Match **spectrum** to **site** and **severity**; narrow when data return.  
• **Duration** should follow **guideline anchors** for uncomplicated syndromes when the stem implies them.  
• **Interactions** (QT, INR, K+, CYP) are fair game—read the med list.  
• **C. diff** risk rises with **broad/exposure**—stewardship is patient safety.  
• **Escalate** to **hospital** care when **oral therapy** cannot match **severity**.`,
    },
    {
      preTest: [
        {
          question: "Which principle best describes outpatient antibiotic stewardship?",
          options: [
            "Use the broadest agent for every infection to be safe.",
            "Use the narrowest effective agent for the shortest effective duration with follow-up.",
            "Treat all colds with antibiotics to prevent pneumonia.",
            "Avoid documenting indication to save time.",
          ],
          correct: 1,
          rationale:
            "Stewardship targets spectrum and duration with monitoring—core NP prescribing responsibility.",
        },
        {
          question: "Why might nitrofurantoin be a poor choice for suspected pyelonephritis?",
          options: [
            "It achieves inadequate renal tissue levels for upper UTI—choose agents appropriate to pyelonephritis.",
            "It is always first-line for every UTI.",
            "It has no oral formulation.",
            "It is only for men.",
          ],
          correct: 0,
          rationale:
            "Nitrofurantoin is primarily for uncomplicated lower UTI; pyelonephritis typically requires different regimens and often escalation.",
        },
        {
          question: "Which combination most raises concern for QT prolongation when prescribing azithromycin?",
          options: [
            "Azithromycin alone in a healthy young adult without risk factors or interacting meds.",
            "Azithromycin with additional QT-prolonging agents or electrolyte abnormalities in a vulnerable patient.",
            "Azithromycin with acetaminophen only.",
            "Azithromycin after one dose of vitamin C.",
          ],
          correct: 1,
          rationale:
            "QT risk is contextual—pairing multiple QT-prolonging factors is a classic exam trap.",
        },
      ],
      postTest: [
        {
          question: "A patient on warfarin starts TMP-SMX for an uncomplicated UTI. What should the NP monitor closely?",
          options: [
            "Ignore INR—no interaction exists.",
            "INR and bleeding risk; TMP-SMX can raise warfarin effect.",
            "Only monitor blood glucose.",
            "Only monitor temperature.",
          ],
          correct: 1,
          rationale:
            "TMP-SMX can interact with warfarin—INR surveillance is exam-relevant.",
        },
        {
          question: "Which finding most supports stopping unnecessary outpatient antibiotics?",
          options: [
            "Clear viral diagnosis with supportive care plan and patient understanding.",
            "Mild fever alone without exam.",
            "Patient request for stronger drug without indication.",
            "Desire to prevent all future infections.",
          ],
          correct: 0,
          rationale:
            "Avoiding antibiotics when not indicated is stewardship and safety.",
        },
        {
          question: "Why are fluoroquinolones relatively contraindicated or cautioned in patients with aortic aneurysm history?",
          options: [
            "They improve tendon strength.",
            "Class warnings include tendon rupture and aortic complications—risk/benefit matters.",
            "They only affect ears.",
            "They are safe in every patient regardless of history.",
          ],
          correct: 1,
          rationale:
            "FQ boxed warnings include tendon and aortic risk—boards test recognition.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Anti-infectives & stewardship: outpatient prescribing (Canadian NP / CNPLE-aligned)",
      seoTitle: "Antibiotic stewardship | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: empiric anti-infective choice, stewardship, interaction vigilance, metric lab monitoring, and collaborative inpatient referral when oral outpatient therapy is unsafe.",
      clinical_meaning: `**Canadian formulary & resistance context**  
Items may reference **local antibiogram hints**—choose **first-line** agents consistent with the stem’s **resistance** and **severity** framing. **Collaborative** prescribing models should be reflected in **documentation** and **consult** triggers when **complex** hosts or **recurrent** infections appear.`,
      exam_relevance: `Expect **interaction** and **renal** questions with **metric creatinine**, **K+**, and **QT** risk—translate to **patient safety actions** (monitor, adjust, choose alternative).`,
      clinical_scenario: `**Vignette — suspected urosepsis**  
Fever, **hypotension**, **tachycardia**, **altered mentation**—**ED**, not oral **FQ** monotherapy in clinic.`,
      takeaways: `• **Spectrum** matches **syndrome** and **severity**.  
• **Stewardship** reduces **resistance** and **C diff**.  
• **Drug interactions** are clinical—not trivia.  
• **Refer** when **IV therapy** or **monitoring** exceeds outpatient safety.  
• **Document** allergy type and **prior antibiotics**.`,
    },
    {
      preTest: [
        {
          question: "Which situation best illustrates unnecessary antibiotic prescribing?",
          options: [
            "Uncomplicated viral upper respiratory infection without bacterial criteria.",
            "Confirmed bacterial pneumonia with appropriate oral therapy and follow-up.",
            "Recurrent UTI with culture-directed therapy.",
            "Cellulitis with appropriate oral antibiotic and recheck.",
          ],
          correct: 0,
          rationale:
            "Antibiotics do not treat uncomplicated viral URI—education and safety netting are key.",
        },
        {
          question: "Why might macrolide choice require extra caution in a patient on multiple QT-prolonging drugs?",
          options: [
            "Macrolides never affect QT.",
            "Macrolides can prolong QT—risk stacks with other QT prolonging factors.",
            "QT is unrelated to medications.",
            "Only children have QT risk.",
          ],
          correct: 1,
          rationale:
            "Additive QT risk is a classic interaction testing point.",
        },
        {
          question: "What is the primary goal of obtaining urine culture in complicated or recurrent UTI contexts?",
          options: [
            "Satisfy billing only.",
            "Guide therapy and detect resistance patterns.",
            "Delay treatment indefinitely.",
            "Replace clinical judgment.",
          ],
          correct: 1,
          rationale:
            "Cultures inform targeted therapy—stewardship and safety.",
        },
      ],
      postTest: [
        {
          question: "Which patient most likely needs hospital-level care rather than oral outpatient antibiotics?",
          options: [
            "Mild pharyngitis without fever.",
            "Suspected urosepsis with hypotension and confusion.",
            "Uncomplicated cystitis in a nonpregnant adult with reliable follow-up.",
            "Resolved infection completing therapy.",
          ],
          correct: 1,
          rationale:
            "Hemodynamic instability and altered mentation with infection source often require inpatient management.",
        },
        {
          question: "Why document penicillin allergy details carefully?",
          options: [
            "Allergy labels never change management.",
            "True IgE-mediated allergy influences cross-reactivity decisions and alternative selection.",
            "Documentation is optional.",
            "All patients are allergic to penicillin.",
          ],
          correct: 1,
          rationale:
            "Allergy clarification changes safe beta-lactam use—high-yield prescribing topic.",
        },
        {
          question: "Which adverse outcome is most associated with broad antibiotic exposure?",
          options: [
            "Improved gut flora always.",
            "Clostridioides difficile colitis risk.",
            "Guaranteed cure of viral illness.",
            "Lower resistance rates always.",
          ],
          correct: 1,
          rationale:
            "Broad antibiotics disrupt flora and raise C diff risk—stewardship concept.",
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

export function npAntiinfectivesStewardshipOutpatientHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpAntiinfectivesStewardshipOutpatientGoldLessonInput(pathwayId);
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

export function getNpAntiinfectivesStewardshipOutpatientGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Anti-infectives & stewardship (${suf})`,
          seoTitle: `Antibiotic stewardship & anti-infectives | ${lab} | NurseNest`,
          seoDescription: `${lab} outpatient anti-infective prescribing: classes, interactions, stewardship, renal dosing, and escalation thresholds.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Anti-infectives & stewardship (${suf})`,
            seoTitle: `Antibiotic stewardship & anti-infectives | ${lab} | NurseNest`,
            seoDescription: `${lab} stewardship-focused prescribing with collaborative referral and SI lab monitoring concepts.`,
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
    labsDiagnostics: ABX_LABS_MONITORING,
    relatedSlugs: [MED_FAMILY_ANTIBIOTICS_GOLD, SEPSIS_GOLD_SLUG, NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG],
    relatedTitlesBySlug: {
      [MED_FAMILY_ANTIBIOTICS_GOLD]: "Antibiotics — nursing & prescribing implications",
      [SEPSIS_GOLD_SLUG]: "Sepsis early recognition",
      [NP_PNEUMONIA_CAP_OUTPATIENT_GOLD_SLUG]: "Community-acquired pneumonia (outpatient judgment)",
    },
  });

  return {
    slug: NP_ANTIINFECTIVES_STEWARDSHIP_OUTPATIENT_GOLD_SLUG,
    title: v.title,
    topic: "Infectious disease",
    topicSlug: "infectious-disease",
    bodySystem: "Infectious disease",
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
