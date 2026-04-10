/**
 * Reproductive cancer screening & prevention — cervical, breast, and related counseling (NP primary care).
 * **WHNP** lane carries the deepest emphasis; **FNP/AGPCNP/PNP-PC** share US primary-care framing; **Canadian NP** uses collaborative screening language.
 * (No separate uploaded corpus in-repo; aligned to consensus screening logic used in NP board-style items.)
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
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";
import { NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-contraception-counseling-selection-gold-standard";

export const NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG = "np-reproductive-screening-prevention-gold" as const;

const PRENATAL_ANEMIA_SLUG = "fnp-womens-prenatal-anemia-workup" as const;

const PATHWAY_VARIANT: Record<string, "whnp" | "us_np" | "ca_np"> = {
  "us-np-whnp": "whnp",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Screening as risk-stratified prevention**  
NP items test **who**, **how often**, **with what test**, and **what to do with abnormal results**—not generic “screen everyone yearly.” Integrate **age**, **risk factors**, **immunosuppression**, **prior abnormal results**, **hysterectomy history**, and **pregnancy** status before you pick **pap**, **HPV testing**, **colposcopy referral**, or **mammography**.

**Cervical cancer prevention (exam-level)**  
**HPV primary** strategies appear as **cotesting** vs **primary HPV** vs **pap-alone** pathways depending on **age** and **guideline frame** in the stem. **ASC-US** management branches to **HPV reflex** vs **repeat interval** per age. **LSIL/HSIL** patterns point toward **colposcopy** or **repeat surveillance**—choose **escalation** when **high-grade** features or **positive high-risk HPV** with cytology abnormalities align.

**Breast screening**  
Balance **mammography benefits/harms**, **dense breast** counseling when referenced, **high-risk** patients who may need **MRI** or **genetic referral** when **family history** meets criteria, and **symptomatic mass** evaluation—**imaging screening** is not identical to **diagnostic workup** of a palpable lump.

**STI screening in reproductive health visits**  
**Chlamydia/gonorrhea** screening by **age/risk** often belongs on the **same plan** as pap/contraception when the vignette supports it—avoid “pap only” answers when **risk criteria** are explicit.

**HPV vaccination counseling**  
Catch-up through **mid-20s** (per guideline hints in stems), **shared decision-making** to **45** in some US contexts—pair with **pregnancy** status and **immunocompromise** nuances when provided.`;

const SCREENING_LABS_FOLLOWUP = `**Abnormal pap pathways**  
Know the **difference** between **screening** abnormalities and **symptomatic bleeding** that may need **endometrial assessment** independent of cytology—especially **postmenopausal bleeding**.

**Breast diagnostic triage**  
**BIRADS**-style reporting may appear—**short-interval follow-up** vs **biopsy referral** follows **category** language in the stem.

**Labs supporting evaluation**  
**Pregnancy test** before certain pathways; **CBC** when **anemia** accompanies **heavy bleeding**—integrate with **iron studies** when the item pivots to **anemia workup** (see linked prenatal anemia lesson when pregnancy is possible).`;

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
      title: "Women’s health depth: cervical & breast screening, HPV pathways, and prevention counseling (WHNP, US)",
      seoTitle: "Reproductive screening & prevention | WHNP US | NurseNest",
      seoDescription:
        "WHNP-focused: guideline-style cervical screening algorithms, HPV testing pathways, colposcopy referral cues, breast risk stratification, dense breast counseling, STI screening integration, and HPV vaccine counseling.",
      clinical_meaning: `**WHNP depth**  
You should **own** the **prevention visit architecture**: **history** (prior abnormal pap, immunosuppression, DES exposure when rare stems appear), **exam** indications, **testing selection**, **patient counseling** on **harms/benefits**, and **referral timing**. Items often embed **adolescent confidentiality** and **pregnancy intention**—pair **STI screening** and **contraception** without fragmenting care.

**Cannot-miss bleeding**  
**Postmenopausal bleeding** is **endometrial cancer** risk until proven otherwise—choose **evaluation** over “repeat pap in a year” when the stem gives **new bleeding after menopause**.`,
      exam_relevance: `Expect **next step** after **ASC-US**, **LSIL**, **AGC**, **HPV positive** with **NILM**, **dense breasts**, and **BIRADS 4**—pick **referral** vs **surveillance** per guideline framing.

**Traps**  
• **Screening mammogram** as the **only** response to a **dominant palpable mass**.  
• **Overscreening** very low risk at **very young ages** without indication.  
• **Ignoring** **immunosuppression** changes to **cervical surveillance**.`,
      clinical_scenario: `**Vignette — 56-year-old with new spotting after 18 months amenorrhea**  
This is **not routine screening**—prioritize **endometrial evaluation** pathway per stem (imaging/biopsy referral) rather than **pap alone**.

**Vignette — 24-year-old, first pap, ASC-US**  
Use **age-appropriate** management (**HPV reflex** vs **repeat interval**) rather than automatic colposcopy unless high-grade features appear.`,
      takeaways: `• **Separate screening** from **symptomatic** workups.  
• **HPV testing** changes pathways—follow the stem’s algorithm language.  
• **Breast** plans integrate **risk** (family history, genetics), **density**, and **symptoms**.  
• **STI screening** belongs in many reproductive visits by **age/risk**.  
• **PMB** demands **timely evaluation**—not reassurance alone.`,
    },
    {
      preTest: [
        {
          question: "Which finding most strongly warrants endometrial evaluation rather than routine cervical screening alone?",
          options: [
            "Asymptomatic patient due for routine pap per age guideline.",
            "Postmenopausal bleeding.",
            "Patient requesting contraception only without symptoms.",
            "Normal screening mammogram last year without symptoms.",
          ],
          correct: 1,
          rationale:
            "Postmenopausal bleeding is a red flag for endometrial pathology and needs evaluation beyond pap screening.",
        },
        {
          question: "Why is HPV testing central to many modern cervical screening algorithms?",
          options: [
            "It replaces all exams.",
            "It helps risk-stratify cytology results and guide surveillance vs referral.",
            "It diagnoses ovarian cancer.",
            "It is only for adolescents.",
          ],
          correct: 1,
          rationale:
            "HPV status refines management of cytologic abnormalities in age-appropriate algorithms.",
        },
        {
          question: "Which history element increases breast cancer screening intensity in high-risk patients?",
          options: [
            "Remote appendectomy.",
            "Strong family history of BRCA-related cancers when the stem defines high risk.",
            "Mild eczema.",
            "Occasional caffeine use.",
          ],
          correct: 1,
          rationale:
            "Family history and genetic risk models change screening intensity—common exam focus.",
        },
      ],
      postTest: [
        {
          question: "A palpable dominant breast mass is found in a 40-year-old. What is the best next principle?",
          options: [
            "Routine screening mammogram alone without diagnostic evaluation of the mass.",
            "Diagnostic breast imaging evaluation per guideline-style algorithms, not ‘routine screening’ framing.",
            "Ignore if mammogram was normal 10 years ago.",
            "Start antibiotics without evaluation.",
          ],
          correct: 1,
          rationale:
            "Symptomatic masses need diagnostic workup—screening mammography alone is a classic trap.",
        },
        {
          question: "Why integrate chlamydia screening into reproductive health visits for at-risk ages?",
          options: [
            "STIs are always symptomatic.",
            "Many infections are asymptomatic but cause harm—screening reduces complications.",
            "STIs are only a male health issue.",
            "Pap smears detect all STIs.",
          ],
          correct: 1,
          rationale:
            "Chlamydia screening reduces PID and infertility risk—often tested alongside women’s health visits.",
        },
        {
          question: "What is the primary goal of HPV vaccination counseling in eligible patients?",
          options: [
            "Replace cervical screening forever.",
            "Reduce HPV-related cancer risk; screening may still be needed per age guidelines.",
            "Treat active cervical cancer alone.",
            "Replace condoms for STI prevention.",
          ],
          correct: 1,
          rationale:
            "HPV vaccine prevents many HPV-related diseases but does not eliminate all screening needs.",
        },
      ],
    },
  ),
  us_np: t(
    "us_np",
    {
      title: "Reproductive screening & prevention: cervical, breast, STI, and HPV vaccine counseling (US primary-care NP)",
      seoTitle: "Reproductive screening | NP US | NurseNest",
      seoDescription:
        "FNP/AGPCNP/PNP-PC: screening intervals, abnormal pap pathways, breast diagnostic vs screening, STI integration, and vaccine counseling—shared core, not duplicated per track.",
      clinical_meaning: `**Primary-care integration**  
NP visits combine **prevention** with **acute concerns**—choose answers that **close loops** on abnormal results and **coordinate** specialty care when **high-grade** or **high-risk** features appear.`,
      exam_relevance: `Focus on **abnormal result pathways**, **PMB**, **palpable mass triage**, and **HPV vaccine** counseling windows.`,
      clinical_scenario: `**Vignette — patient overdue for pap, smoker, 38**  
Address **cervical screening** and **tobacco cessation**; ensure **STI screening** if risk criteria apply.`,
      takeaways: `• **Risk-stratify** screening and diagnostics.  
• **PMB** and **dominant masses** are **not** “routine screening only.”  
• **HPV vaccination** + **screening** are complementary.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs evaluation for postmenopausal bleeding?",
          options: [
            "Any woman with new vaginal bleeding after menopause.",
            "Only patients under 30.",
            "Only patients with pain.",
            "Never—always benign.",
          ],
          correct: 0,
          rationale:
            "Postmenopausal bleeding warrants evaluation for endometrial pathology—do not dismiss.",
        },
        {
          question: "What is the key difference between screening mammography and diagnostic breast imaging?",
          options: [
            "There is no difference.",
            "Diagnostic imaging evaluates symptoms or abnormal findings; screening targets asymptomatic risk-based detection.",
            "Diagnostic imaging is only for men.",
            "Screening is only ultrasound.",
          ],
          correct: 1,
          rationale:
            "Symptomatic masses require diagnostic pathways—not routine screening alone.",
        },
        {
          question: "Why might HPV co-testing be used in some cervical screening algorithms?",
          options: [
            "It replaces pap smears entirely for everyone at all ages.",
            "It refines risk and follow-up intervals in age-appropriate screening strategies.",
            "It diagnoses ovarian cancer.",
            "It is only for pregnancy.",
          ],
          correct: 1,
          rationale:
            "HPV status informs management and surveillance in cotesting strategies.",
        },
      ],
      postTest: [
        {
          question: "Which scenario best supports STI screening in addition to cervical cancer screening?",
          options: [
            "Sexually active patient under 25 with risk factors per guideline-style stem.",
            "Asymptomatic patient who is not sexually active and not at risk.",
            "Patient only needs a refill of vitamins.",
            "Patient with isolated dermatitis.",
          ],
          correct: 0,
          rationale:
            "Chlamydia screening targets sexually active patients in defined age/risk groups.",
        },
        {
          question: "A patient has ASC-US cytology. What is the best exam-style approach?",
          options: [
            "Ignore for 10 years.",
            "Follow age-appropriate management including HPV testing pathways when indicated by the algorithm in the stem.",
            "Automatic hysterectomy.",
            "Stop pap smears forever.",
          ],
          correct: 1,
          rationale:
            "ASC-US management depends on age and HPV status—follow guideline-style branching.",
        },
        {
          question: "What should be included when counseling HPV vaccination in eligible adults?",
          options: [
            "Benefits, limitations, need for continued screening, and shared decision-making.",
            "Claim it cures all cancers.",
            "Say it replaces pap smears for everyone immediately.",
            "Avoid documentation.",
          ],
          correct: 0,
          rationale:
            "Vaccine counseling is evidence-based and documents informed decision-making.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Reproductive screening & prevention: Canadian NP primary care (cervical, breast, STI)",
      seoTitle: "Reproductive screening | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: provincial guideline nuances may appear as stem hints; focus on risk-appropriate screening, referral, and interprofessional follow-up—aligned to CNPLE-style prevention items.",
      clinical_meaning: `**Canadian screening programs** may reference **organized screening** intervals—translate stem hints into **risk-appropriate** next steps and **documentation** for **consultant referral** when high-grade or high-risk features appear.`,
      exam_relevance: `Expect **metric units**, **age bands**, and **referral** language consistent with **Canadian** primary care—same clinical fork logic as US items.`,
      clinical_scenario: `**Vignette — abnormal screening result**  
Choose **timely specialist follow-up** when **HSIL** or **high-risk** combinations appear—avoid silent watchful waiting beyond guideline windows.`,
      takeaways: `• **Abnormal pathways** need **explicit follow-up**.  
• **PMB** remains an **urgent evaluation** trigger.  
• **STI screening** integrates with **women’s health** visits by risk.`,
    },
    {
      preTest: [
        {
          question: "Which principle applies to abnormal cervical screening results in primary care?",
          options: [
            "Ignore until symptoms appear.",
            "Follow guideline-based surveillance or referral based on cytology, HPV status, and age.",
            "Immediate surgery for all abnormal results.",
            "Stop cervical screening after one abnormal result.",
          ],
          correct: 1,
          rationale:
            "Management is algorithm-driven—surveillance vs colposcopy depends on results and risk.",
        },
        {
          question: "Why document breast symptom characteristics for a palpable mass?",
          options: [
            "Documentation is optional.",
            "Duration, change, associated findings, and risk factors guide diagnostic urgency.",
            "Only cosmetic documentation matters.",
            "Masses never need imaging.",
          ],
          correct: 1,
          rationale:
            "Objective documentation supports appropriate diagnostic triage.",
        },
        {
          question: "Which patients often qualify for chlamydia screening in primary care guidelines?",
          options: [
            "Sexually active individuals in defined age/risk groups—often young adults.",
            "Only pregnant patients.",
            "Only patients over 65.",
            "Never in primary care.",
          ],
          correct: 0,
          rationale:
            "Chlamydia screening targets sexually transmitted infection risk groups commonly tested on boards.",
        },
      ],
      postTest: [
        {
          question: "What is the most appropriate response to postmenopausal bleeding in exam logic?",
          options: [
            "Reassure without evaluation.",
            "Evaluate endometrial risk with guideline-appropriate workup in the stem.",
            "Start estrogen.",
            "Ignore if pap is normal.",
          ],
          correct: 1,
          rationale:
            "Postmenopausal bleeding requires evaluation—normal pap does not rule out endometrial disease.",
        },
        {
          question: "Why might breast MRI be mentioned for some high-risk patients?",
          options: [
            "It replaces mammography for everyone.",
            "It supplements screening in selected high-risk patients per guideline criteria in the vignette.",
            "It is only for trauma.",
            "It diagnoses all breast cysts without ultrasound.",
          ],
          correct: 1,
          rationale:
            "Supplemental MRI is for high-risk pathways—not routine population screening.",
        },
        {
          question: "What is the goal of integrating STI screening with cervical screening visits?",
          options: [
            "Reduce missed infections and complications in at-risk patients.",
            "Replace pap testing.",
            "Treat all patients with antibiotics blindly.",
            "Avoid counseling.",
          ],
          correct: 0,
          rationale:
            "Integrated prevention reduces harm—common women’s health exam theme.",
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

export function npReproductiveScreeningPreventionHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpReproductiveScreeningPreventionGoldLessonInput(pathwayId);
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

export function getNpReproductiveScreeningPreventionGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
            title: `Reproductive screening & prevention (${suf})`,
            seoTitle: `Reproductive screening & prevention | ${lab} | NurseNest`,
            seoDescription: `${lab} cervical and breast screening pathways, STI integration, and HPV vaccine counseling for primary-care NP boards.`,
          }
        : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
          ? {
              ...base,
              title: `Reproductive screening & prevention (${suf})`,
              seoTitle: `Reproductive screening & prevention | ${lab} | NurseNest`,
              seoDescription: `${lab} organized screening concepts, referral thresholds, and collaborative follow-up.`,
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
    labsDiagnostics: SCREENING_LABS_FOLLOWUP,
    relatedSlugs: [NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG, NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG, PRENATAL_ANEMIA_SLUG],
    relatedTitlesBySlug: {
      [NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG]: "Contraception counseling & selection",
      [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG]: "NP primary-care foundations",
      [PRENATAL_ANEMIA_SLUG]: "Prenatal anemia workup (FNP)",
    },
  });

  return {
    slug: NP_REPRODUCTIVE_SCREENING_PREVENTION_GOLD_SLUG,
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
