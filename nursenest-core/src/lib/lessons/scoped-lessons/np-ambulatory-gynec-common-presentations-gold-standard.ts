/**
 * Ambulatory gynecology — common outpatient presentations (AUB, pelvic pain, vaginitis triage, uncomplicated UTI cues).
 * **WHNP** depth emphasizes differential discipline in women’s-health longitudinal care; **FNP/AGPCNP/PNP-PC** share primary-care triage;
 * **Canadian NP** emphasizes collaborative referral and documentation. Distinct from **OB emergencies** (acute maternity) and from **STI screening** lesson focus.
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
import { OB_EMERGENCIES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/ob-emergencies-gold-standard";
import { NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-reproductive-screening-prevention-gold-standard";
import { NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-contraception-counseling-selection-gold-standard";

export const NP_AMBULATORY_GYNEC_COMMON_PRESENTATIONS_GOLD_SLUG = "np-ambulatory-gynec-common-presentations-gold" as const;

const PATHWAY_VARIANT: Record<string, "whnp" | "us_np" | "ca_np"> = {
  "us-np-whnp": "whnp",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Ambulatory gynecology as differential reasoning**  
NP items reward **pattern recognition** for **abnormal uterine bleeding (AUB)**, **pregnancy-related bleeding** when appropriate, **ovulatory disorders**, **fibroid-related** symptoms, **endometriosis** clues, **PID vs other pelvic pain**, **ovarian cyst** red flags, **vaginitis** (BV vs candida vs trichomonas) when the stem gives **discharge pH/clue cells/KOH** hints, and **uncomplicated UTI** versus **pyelonephritis** versus **STI urethritis**.

**When “common” becomes emergent**  
**Ectopic pregnancy** risk with **pain + bleeding + positive pregnancy** or **risk factors**; **torsion** with **sudden severe unilateral pain**; **sepsis** with **fever + pelvic pain**; **heavy bleeding** with **hemodynamic** compromise—choose **ED/OB triage** over “follow-up in months.”

**Exam and testing parsimony**  
Pick **pregnancy test** early in reproductive-age bleeding. Use **pelvic exam** indications per stem. **Ultrasound** referrals for **structural** concerns, **large fibroid** symptoms, **adnexal mass** features, or **endometrial thickness** contexts—avoid imaging cascades the vignette does not support.

**Treatment alignment**  
**Hormonal management** of AUB follows **contraceptive eligibility** and **thrombotic risk**—tie back to **MEC thinking** without re-writing a full contraception monograph (cross-link). **Antibiotics** for **PID** require **partner treatment** concepts when STI confirmed; **vaginitis** therapy matches **organism**—avoid **metronidazole for yeast** distractors.

**Pediatric/adolescent overlay (PNP-PC / FNP)**  
**Menarche** timing, **heavy bleeding** at menarche, and **adolescent confidentiality** appear—still use **pregnancy testing** when indicated and **red-flag** **anemia** symptoms.`;

const AMBULATORY_LABS = `**Beta-hCG**  
**First-line** in reproductive-age bleeding/abdominal pain when pregnancy is possible—ectopic and miscarriage pathways depend on it.

**CBC**  
**Anemia** severity with **heavy bleeding** drives **urgency** and **iron therapy** planning.

**Wet mount / NAAT**  
**Vaginitis** and **STI** diagnosis when discharge/itching—choose **test** before **empiric** therapy when the stem emphasizes **diagnostic accuracy**.

**Ultrasound**  
**Adnexal mass**, **torsion suspicion**, **endometrial thickness** in **PMB**—referral and timing per guideline hints.`;

function t(
  variant: "whnp" | "us_np" | "ca_np",
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

const VARIANTS: Record<"whnp" | "us_np" | "ca_np", ReturnType<typeof t>> = {
  whnp: t(
    "whnp",
    {
      title: "Women’s health depth: ambulatory gynec — AUB, pelvic pain, vaginitis, and urgent triage (WHNP, US)",
      seoTitle: "Ambulatory gynec common visits | WHNP US | NurseNest",
      seoDescription:
        "WHNP-focused differentials for abnormal bleeding, pelvic pain, infection syndromes, ovarian red flags, pregnancy-related triage, and safe escalation—distinct from generic med-surg review.",
      clinical_meaning: `**Longitudinal women’s-health reasoning**  
WHNP stems often embed **contraception changes**, **perimenopause**, **postpartum** return visits, and **sexual health**—integrate **prior pap/HPV**, **STI history**, and **pregnancy intention** into the **working problem list**. Your plan should show **follow-up intervals** and **return precautions** for **worsening pain**, **heavy bleeding**, or **fever**.

**Differential discipline**  
• **AUB**: **pregnancy**, **ovulatory dysfunction**, **fibroids/polyps**, **coagulopathy** hints, **thyroid** contribution when stem provides **TSH**.  
• **Pelvic pain**: **PID**, **appendicitis**, **ovarian cyst accident**, **endometriosis**, **urolithiasis** mimics—choose **cannot-miss** first when red flags appear.`,
      exam_relevance: `Expect **next test**, **treatment selection**, **referral**, and **ED triage** items. **Vaginitis** questions pair **symptoms** with **correct therapy** and **partner management** when trichomonas appears.

**Traps**  
• **Treating secondary amenorrhea** without **pregnancy exclusion** when appropriate.  
• **Missing** **ectopic** risk in **pain + bleeding** scenarios.  
• **Labeling all pelvic pain** as PID without **exam/imaging** clues.`,
      clinical_scenario: `**Vignette — sudden severe unilateral pelvic pain with nausea**  
Think **torsion/rupture** pathways—**urgent evaluation**, not “watchful waiting.”

**Vignette — heavy irregular bleeding in adolescent**  
Assess **anemia**, **pregnancy**, **coagulopathy** clues, and **follow-up**—avoid minimizing heavy menses.`,
      takeaways: `• **Pregnancy test** early when pregnancy is possible.  
• **Red-flag** **pain**, **fever**, **hypotension**, **severe bleeding**.  
• **Match vaginitis therapy** to **organism** evidence.  
• **PID** therapy + **partner** treatment concepts when indicated.  
• **Link** chronic pelvic pain to **specialty referral** when refractory or disabling.`,
    },
    {
      preTest: [
        {
          question: "Which combination most strongly suggests ectopic pregnancy risk in exam stems?",
          options: [
            "Isolated mild headache without pelvic symptoms.",
            "Pelvic pain with vaginal bleeding and positive pregnancy test or risk factors.",
            "Chronic constipation without pregnancy possibility.",
            "Stable chronic back pain without gynecologic symptoms.",
          ],
          correct: 1,
          rationale:
            "Pain + bleeding + pregnancy risk is an ectopic pregnancy cannot-miss pattern requiring urgent evaluation.",
        },
        {
          question: "Why is pregnancy testing important in reproductive-age abnormal bleeding?",
          options: [
            "It is never needed.",
            "It distinguishes pregnancy-related bleeding from other AUB etiologies and guides urgent pathways.",
            "It diagnoses fibroids alone.",
            "It replaces pelvic exam always.",
          ],
          correct: 1,
          rationale:
            "Pregnancy status changes management urgency—classic NP item.",
        },
        {
          question: "Which vaginitis pattern matches thin gray discharge with fishy odor and clue cells on exam?",
          options: [
            "Bacterial vaginosis.",
            "Uncomplicated yeast infection with thick curd discharge only.",
            "Trichomonas with frothy discharge and motile organisms when wet mount available.",
            "Atrophic vaginitis only in all patients.",
          ],
          correct: 0,
          rationale:
            "BV has characteristic discharge and clue cells—match therapy to diagnosis.",
        },
      ],
      postTest: [
        {
          question: "A patient has fever, pelvic pain, cervical motion tenderness, and STI risk. What is the priority principle?",
          options: [
            "Ignore fever.",
            "Treat PID promptly per guideline-style regimens in the stem and evaluate for admission criteria.",
            "Only recommend fluids.",
            "Avoid antibiotics.",
          ],
          correct: 1,
          rationale:
            "PID is an infection syndrome that requires antibiotics and often hospitalization criteria assessment.",
        },
        {
          question: "Which feature suggests urgent evaluation for adnexal pathology rather than routine outpatient follow-up?",
          options: [
            "Mild cramping mid-cycle without systemic symptoms.",
            "Acute severe unilateral pain with nausea/vomiting.",
            "Stable chronic mild discomfort.",
            "Asymptomatic routine visit.",
          ],
          correct: 1,
          rationale:
            "Acute severe unilateral pain with systemic symptoms raises torsion/rupture concern—urgent evaluation.",
        },
        {
          question: "Why differentiate uncomplicated cystitis from pyelonephritis?",
          options: [
            "They are identical.",
            "Pyelonephritis has systemic toxicity risk and often requires different management intensity.",
            "Cystitis always needs IV antibiotics in clinic.",
            "Pyelonephritis never has fever.",
          ],
          correct: 1,
          rationale:
            "Upper UTI patterns require broader therapy and monitoring—common exam fork.",
        },
      ],
    },
  ),
  us_np: t(
    "us_np",
    {
      title: "Ambulatory gynecology: AUB, pelvic pain, and common infections (US primary-care NP)",
      seoTitle: "Ambulatory gynec visits | NP US | NurseNest",
      seoDescription:
        "FNP/AGPCNP/PNP-PC: triage ambulatory gynec complaints, pregnancy exclusion, infection syndromes, and escalation—one shared spine for all three tracks.",
      clinical_meaning: `**Primary-care triage**  
You integrate **pregnancy testing**, **STI risk**, **contraception**, and **chronic disease** clues—then choose **office management** vs **ED referral** with **clear documentation**.`,
      exam_relevance: `Focus on **cannot-miss** causes of pain/bleeding and **correct antimicrobial** choices for **PID/vaginitis/UTI** contexts.`,
      clinical_scenario: `**Vignette — dysuria and frequency, no fever, uncomplicated cystitis features**  
Choose **appropriate oral therapy** and **safety-net** for **pyelonephritis** symptoms unless contraindicated in stem.`,
      takeaways: `• **Triage** first—**pregnancy**, **sepsis**, **hemodynamic** stability.  
• **Match therapy** to **diagnosis**.  
• **Escalate** when **severe** features appear.`,
    },
    {
      preTest: [
        {
          question: "Which patient with dysuria needs pregnancy testing before empiric UTI therapy in many exam stems?",
          options: [
            "Postmenopausal patient not sexually active.",
            "Reproductive-age patient with uterus and possible pregnancy.",
            "Male patient.",
            "Child with otitis.",
          ],
          correct: 1,
          rationale:
            "Pregnancy changes antibiotic safety and differential—test when appropriate.",
        },
        {
          question: "What is the best initial step for heavy vaginal bleeding with hemodynamic instability?",
          options: [
            "Schedule routine follow-up in 6 months.",
            "Stabilize and escalate to emergency care per setting.",
            "Start oral iron only.",
            "Ignore vitals.",
          ],
          correct: 1,
          rationale:
            "Hemodynamic instability requires urgent evaluation—not routine outpatient delay.",
        },
        {
          question: "Which symptom cluster suggests PID over simple cystitis?",
          options: [
            "Only dysuria without fever or pelvic exam findings.",
            "Fever, pelvic pain, cervical motion tenderness, and adnexal tenderness in a sexually active patient.",
            "Isolated ankle edema.",
            "Chronic constipation only.",
          ],
          correct: 1,
          rationale:
            "PID is a pelvic infection syndrome with exam findings distinct from uncomplicated UTI.",
        },
      ],
      postTest: [
        {
          question: "Why must trichomonas be treated in partners when diagnosed?",
          options: [
            "It never spreads.",
            "It is sexually transmitted—partner treatment reduces reinfection.",
            "Partners never need treatment.",
            "It is only a yeast infection.",
          ],
          correct: 1,
          rationale:
            "Trichomoniasis requires partner treatment and STI counseling—exam classic.",
        },
        {
          question: "Which finding supports hospitalization consideration in PID?",
          options: [
            "Mild discomfort, afebrile, reliable follow-up.",
            "Surgical abdomen, pregnancy, inability to tolerate oral meds, or sepsis features per stem.",
            "Asymptomatic screening visit.",
            "Mild dysuria only.",
          ],
          correct: 1,
          rationale:
            "Severe PID or pregnancy often requires inpatient therapy—per guideline-style stems.",
        },
        {
          question: "What is the key reason to evaluate postmenopausal bleeding promptly?",
          options: [
            "It is always benign.",
            "Endometrial pathology must be excluded.",
            "It only needs repeat pap.",
            "It never needs imaging.",
          ],
          correct: 1,
          rationale:
            "Postmenopausal bleeding warrants evaluation for hyperplasia/cancer—high-yield screening item.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Ambulatory gynecology: common presentations (Canadian NP)",
      seoTitle: "Ambulatory gynec | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: triage ambulatory gynec complaints, collaborative referral for ultrasound/surgery, and urgent care escalation—aligned to community practice.",
      clinical_meaning: `**Collaborative model**  
Choose answers that **document** findings, **refer** appropriately, and **coordinate** with **OB/GYN** and **emergency** services when **acute** pathology is suspected—especially **ectopic**, **torsion**, and **sepsis**.`,
      exam_relevance: `Same fork logic as US with **Canadian** follow-up and **metric** details when given.`,
      clinical_scenario: `**Vignette — febrile pelvic pain**  
Prioritize **infection severity** assessment and **site-of-care**—avoid outpatient undertreatment when admission criteria appear.`,
      takeaways: `• **Escalate** **time-sensitive** pathology.  
• **Treat infections** per syndrome severity.  
• **Document** **referral** rationale clearly.`,
    },
    {
      preTest: [
        {
          question: "Which presentation most strongly requires urgent ED assessment?",
          options: [
            "Stable mild symptoms with reliable follow-up.",
            "Suspected ectopic pregnancy with pain and positive pregnancy test.",
            "Routine pap screening without symptoms.",
            "Mild headache without pelvic symptoms.",
          ],
          correct: 1,
          rationale:
            "Ectopic pregnancy is life-threatening—urgent evaluation is essential.",
        },
        {
          question: "Why is partner treatment discussed for certain STIs?",
          options: [
            "Partners never matter.",
            "It reduces reinfection and community spread—public health and clinical priority.",
            "It is illegal.",
            "It replaces patient treatment.",
          ],
          correct: 1,
          rationale:
            "Partner treatment is key for STIs like trichomonas and often for chlamydia/gonorrhea.",
        },
        {
          question: "Which symptom suggests pyelonephritis rather than uncomplicated cystitis?",
          options: [
            "Only dysuria without systemic signs.",
            "Fever, flank pain, and systemic symptoms with UTI context.",
            "Nasal congestion.",
            "Rash without urinary symptoms.",
          ],
          correct: 1,
          rationale:
            "Upper UTI features change management intensity and monitoring.",
        },
      ],
      postTest: [
        {
          question: "What is the primary concern with acute severe unilateral pelvic pain in reproductive-age patients?",
          options: [
            "Ignore if labs are pending.",
            "Ovarian torsion or other surgical emergencies until evaluated.",
            "Only constipation.",
            "Only IBS.",
          ],
          correct: 1,
          rationale:
            "Torsion is time-sensitive—urgent evaluation.",
        },
        {
          question: "Why evaluate postmenopausal bleeding even if a recent pap was normal?",
          options: [
            "Pap screens cervix; it does not rule out endometrial pathology.",
            "Pap rules out all cancer.",
            "Bleeding is always normal.",
            "No evaluation needed.",
          ],
          correct: 0,
          rationale:
            "Cervical screening does not exclude endometrial disease—PMB needs appropriate evaluation.",
        },
        {
          question: "Which principle guides antibiotic stewardship in outpatient vaginitis care?",
          options: [
            "Treat all discharge with metronidazole.",
            "Match therapy to diagnosis (BV vs yeast vs trich) and avoid unnecessary antibiotics.",
            "Always use IV antibiotics.",
            "Never test.",
          ],
          correct: 1,
          rationale:
            "Correct diagnosis reduces harm—BV therapy differs from yeast therapy.",
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

export function npAmbulatoryGynecCommonPresentationsHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpAmbulatoryGynecCommonPresentationsGoldLessonInput(pathwayId);
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

export function getNpAmbulatoryGynecCommonPresentationsGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const variantKey = PATHWAY_VARIANT[pathwayId];
  if (!variantKey) return null;
  const base = VARIANTS[variantKey];
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;

  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);

  const v =
    variantKey === "whnp"
      ? base
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "us_np"
        ? {
            ...base,
            title: `Ambulatory gynec: common presentations (${suf})`,
            seoTitle: `Ambulatory gynec visits | ${lab} | NurseNest`,
            seoDescription: `${lab} triage for AUB, pelvic pain, infections, and urgent gynecologic escalation.`,
          }
        : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
          ? {
              ...base,
              title: `Ambulatory gynec: common presentations (${suf})`,
              seoTitle: `Ambulatory gynec | ${lab} | NurseNest`,
              seoDescription: `${lab} community triage, referral, and collaborative management for common gynec complaints.`,
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
    labsDiagnostics: AMBULATORY_LABS,
    relatedSlugs: [
      NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG,
      NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG,
      OB_EMERGENCIES_GOLD_SLUG,
    ],
    relatedTitlesBySlug: {
      [NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG]: "Reproductive screening & prevention",
      [NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG]: "Contraception counseling & selection",
      [OB_EMERGENCIES_GOLD_SLUG]: "OB emergencies recognition",
    },
  });

  return {
    slug: NP_AMBULATORY_GYNEC_COMMON_PRESENTATIONS_GOLD_SLUG,
    title: v.title,
    topic: "Women’s health",
    topicSlug: "womens-health",
    bodySystem: "Reproductive",
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
