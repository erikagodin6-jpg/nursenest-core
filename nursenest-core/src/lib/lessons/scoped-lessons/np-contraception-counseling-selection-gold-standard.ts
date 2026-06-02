/**
 * Contraception — counseling, method selection, and safety (NP primary care).
 * **WHNP** variant carries the deepest board-style emphasis; FNP/AGPCNP/PNP-PC share the US primary-care lane;
 * **Canadian NP** uses collaborative prescribing language and SI-friendly framing where relevant.
 * (No separate uploaded corpus file is present in-repo; content follows consensus WHNP/FNP/CNPLE themes.)
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

export const NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG = "np-contraception-counseling-selection-gold" as const;

const PRENATAL_ANEMIA_SLUG = "fnp-womens-prenatal-anemia-workup" as const;

/** WHNP = deepest lane; other US NP tracks share `us_np`; Canada uses `ca_np`. PMHNP excluded (no mapping). */
const PATHWAY_VARIANT: Record<string, "whnp" | "us_np" | "ca_np"> = {
  "us-np-whnp": "whnp",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Contraception as clinical decision-making**  
NP items reward **method matching** to **reproductive goals**, **medical eligibility**, **adherence reality**, **drug interactions**, and **follow-up**—not memorizing brand names. **Tiered-effectiveness** thinking (implant/IUD/LARC vs pills/patch/ring vs barriers) appears as **scenario-driven** choices with **contraindication** traps.

**US Medical Eligibility Categories (exam logic)**  
When stems reference **MEC categories**, translate **1–4** into **safe**, **usually safe with caution**, **risks usually outweigh benefits**, and **unacceptable risk**—pick answers that **respect category boundaries** for **stroke history**, **migraine with aura**, **uncontrolled hypertension**, **smoking over 35 with estrogen**, **postpartum timing**, **obesity-related VTE risk**, **liver disease**, and **breast cancer** contexts as the vignette provides them.

**Emergency contraception**  
**Levonorgestrel** vs **ulipristal acetate** vs **copper IUD** pathways hinge on **timing**, **BMI** when the stem includes it, **current pregnancy suspicion**, and **need for ongoing contraception**—choose **most effective** option the patient can access when appropriate.

**Counseling you can defend**  
**Shared decision-making** covers **efficacy**, **typical-use** failure rates, **side effects**, **return of fertility**, **STI protection** (condoms), **bleeding pattern changes**, and **what to do** for **missed pills** or **late injection**—boards punish **generic reassurance** without **specific instructions**.

**Canada note**  
**Provincial** access and **pharmacist** prescribing models may appear as **collaborative** framing—your answer should still show **safe selection**, **documentation**, and **follow-up**, not scope drift.`;

const CONTRACEPTION_LABS_CLINICS = `**Pregnancy testing**  
Before **initiating** hormonal methods when **uncertain**, items may require **urine/serum hCG**—especially with **late menses**, **symptoms**, or **recent intercourse** ambiguity.

**BP and BMI**  
**Combined hormonal contraception** decisions integrate **blood pressure** and **BMI** when provided—pair with **migraine aura** and **smoking** history for **VTE risk** reasoning.

**STI screening**  
**Chlamydia/gonorrhea** screening logic often belongs in the **same visit** as contraception initiation for **age-risk** groups—choose **testing** when guidelines in the stem point that direction, not “contraception only.”`;

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
      title: "Women’s health depth: contraception counseling, eligibility, and method selection (WHNP, US)",
      seoTitle: "Contraception counseling & selection | WHNP US | NurseNest",
      seoDescription:
        "WHNP-focused: MEC-style eligibility thinking, LARC counseling, estrogen risk traps, EC algorithms, postpartum timing, bleeding-pattern counseling, and documentation for women’s-health certification prep.",
      clinical_meaning: `**WHNP scope emphasis**  
You are expected to **own** the **full counseling arc**: **pregnancy intention**, **medical history**, **prior method experience**, **bleeding goals**, **STI risk**, **partner context** when relevant, and **follow-up** for **side effects** and **adherence**. Items often embed **adolescent confidentiality** and ** IPV** cues—choose answers that **screen safely** and **document** without violating privacy laws in the stem.

**Depth markers**  
• **Postpartum / lactation** timing for **estrogen-containing** methods vs **progestin-only** / **LARC**.  
• **Perimenopause** bleeding changes—do not anchor on “just hormones” when **endometrial cancer** risk features appear.  
• **Drug interactions** (enzyme inducers) that **lower contraceptive steroid levels**—choose **backup** or **method change** when the stem names them.`,
      exam_relevance: `Expect **next-best-step**: **pregnancy test** when appropriate, **BP** before CHC, **DMPA** scheduling with **bone-health counseling** when the item tests long-term depo use, **IUD** counseling for **nulliparous** patients when myths appear, and **EC** selection by **time window** and **weight/BMI** when data are given.

**WHNP traps**  
• **Ignoring** **category 3/4** stories for **estrogen**.  
• **Choosing** **combined pills** when **migraine with aura** is explicit.  
• **Skipping** **STI testing** when **age/risk** criteria are met in the vignette.`,
      clinical_scenario: `**Vignette — 34-year-old with migraine with aura, desires reliable contraception**  
**Combined hormonal contraception** is a **wrong fork**—favor **progestin-only** or **non-hormonal** methods depending on preferences and **MEC** framing, with **clear documentation** of **why estrogen is avoided**.

**Vignette — 17-year-old requests pills, sexually active, no comorbidities**  
Address **confidentiality**, **GC/CT screening** per risk-age guidance in the stem, **adherence plan**, **EC counseling**, and **follow-up** for **BP** if CHC is chosen.`,
      takeaways: `• **Match method to eligibility + preferences + follow-up capacity**.  
• **Estrogen** decisions integrate **BP, smoking, aura, VTE history**.  
• **LARC** is often the “best fit” for **high efficacy** needs—when safe.  
• **EC** choice follows **timing, BMI, drug interactions**, and **ongoing plan**.  
• **Document** counseling and **contraindications** clearly—WHNP items reward charts another clinician can continue.`,
    },
    {
      preTest: [
        {
          question: "Which history element most strongly contraindicates combined estrogen-containing contraception in many exam stems?",
          options: [
            "Controlled mild hypertension without migraine history.",
            "Migraine with aura.",
            "Remote appendectomy.",
            "Occasional tension headache without focal neuro symptoms.",
          ],
          correct: 1,
          rationale:
            "Migraine with aura is a classic estrogen VTE/stroke risk context in eligibility-style items.",
        },
        {
          question: "Why is shared decision-making emphasized when choosing contraception?",
          options: [
            "Patients should never choose.",
            "Methods differ in efficacy, side effects, and bleeding patterns—preferences and values matter.",
            "Only cost matters.",
            "Only clinician preference matters.",
          ],
          correct: 1,
          rationale:
            "Contraceptive counseling integrates efficacy, adverse effects, and patient goals—core WHNP/FNP item style.",
        },
        {
          question: "When is emergency contraception most time-sensitive?",
          options: [
            "Within hours to days depending on method—earlier is generally better.",
            "Only after a missed period.",
            "Only in the third trimester.",
            "Never after intercourse.",
          ],
          correct: 0,
          rationale:
            "EC effectiveness drops with time—algorithms test timing windows by method.",
        },
      ],
      postTest: [
        {
          question: "A patient on enzyme-inducing anticonvulsants needs reliable contraception. What is the best exam-style principle?",
          options: [
            "Ignore interactions.",
            "Choose a method not relying on steroid levels affected by enzyme induction, or add backup per guideline context in the stem.",
            "Double the estrogen dose indefinitely.",
            "Use only barrier methods forever without discussion.",
          ],
          correct: 1,
          rationale:
            "Enzyme inducers can reduce contraceptive steroid efficacy—method change or backup is guideline-aligned.",
        },
        {
          question: "Which topic should be addressed alongside contraception initiation for many sexually active adolescents per guideline-style vignettes?",
          options: [
            "STI risk reduction and screening when indicated.",
            "Only dermatology.",
            "Only vision screening.",
            "Avoid discussing STIs.",
          ],
          correct: 0,
          rationale:
            "Contraception visits are opportunities for chlamydia/gonorrhea screening when risk criteria apply.",
        },
        {
          question: "Why might copper IUD be preferred over oral EC in some scenarios?",
          options: [
            "It is never appropriate.",
            "It can provide highly effective emergency contraception and ongoing contraception when appropriate.",
            "It replaces need for any visit follow-up.",
            "It treats STIs alone.",
          ],
          correct: 1,
          rationale:
            "Copper IUD EC is highly effective for eligible candidates and offers continuation—common advanced item.",
        },
      ],
    },
  ),
  us_np: t(
    "us_np",
    {
      title: "Contraception: counseling and method selection (FNP / AGPCNP / PNP-PC, US primary care)",
      seoTitle: "Contraception primary care | NP US | NurseNest",
      seoDescription:
        "FNP-style breadth: eligibility thinking, LARC vs short-acting trade-offs, EC, adherence counseling, and adolescent confidentiality themes—without duplicating a separate WH-only catalog row.",
      clinical_meaning: `**Family / adult / pediatric primary-care NP**  
You will see **lifespan** placement: **adolescent** confidentiality, **postpartum** visits, and **perimenopause** bleeding questions. The **judgment rule** is the same: **safe method** + **realistic adherence** + **follow-up** + **STI prevention/testing** when risk criteria apply.`,
      exam_relevance: `Look for **eligibility traps**, **drug interactions**, **missed pill** scenarios, **postpartum** timing, and **EC** algorithms.`,
      clinical_scenario: `**Vignette — 29-year-old smoker, BP 152/94, wants combined pills**  
**Uncontrolled hypertension** plus **smoking** shifts risk—address **BP control** and choose **non-estrogen** or **nonhormonal** options depending on the stem.`,
      takeaways: `• **Screen** pregnancy when uncertain.  
• **Integrate BP, smoking, migraine aura, VTE history** into estrogen decisions.  
• **Plan follow-up** for side effects and adherence.  
• **EC** when indicated—time matters.`,
    },
    {
      preTest: [
        {
          question: "Which client most needs blood pressure assessment before starting combined hormonal contraception?",
          options: [
            "Healthy teen with normal vitals documented recently.",
            "Adult with new elevated BP reading today and no documented follow-up.",
            "Athlete with HR 52 and normal BP.",
            "Client requesting condoms only.",
          ],
          correct: 1,
          rationale:
            "Hypertension evaluation is central to CHC safety—address elevated BP before estrogen initiation.",
        },
        {
          question: "What is the primary purpose of discussing typical-use vs perfect-use efficacy?",
          options: [
            "Confuse patients.",
            "Set realistic expectations and choose methods that fit adherence capacity.",
            "Claim all methods are equal.",
            "Avoid LARC.",
          ],
          correct: 1,
          rationale:
            "Counseling uses typical-use realities to match method to behavior and preferences.",
        },
        {
          question: "Which statement reflects appropriate EC counseling?",
          options: [
            "EC is irrelevant after unprotected intercourse.",
            "EC is time-sensitive; discuss options and access, and arrange pregnancy follow-up if menses delay.",
            "EC always replaces STI testing.",
            "EC is only for minors.",
          ],
          correct: 1,
          rationale:
            "EC counseling includes timing, method selection, and follow-up planning.",
        },
      ],
      postTest: [
        {
          question: "A postpartum patient wants estrogen-containing contraception immediately after delivery. What does exam logic usually require?",
          options: [
            "Start immediately in all patients.",
            "Consider postpartum VTE risk and lactation timing guidance in the stem—often progestin-only or nonhormonal options early.",
            "Avoid all contraception.",
            "Only barrier methods forever.",
          ],
          correct: 1,
          rationale:
            "Early postpartum estrogen risk and lactation compatibility are classic testing points—follow vignette guidance.",
        },
        {
          question: "Why might an IUD be an excellent choice for a patient who wants long-term, low-maintenance contraception?",
          options: [
            "It is always contraindicated nulliparous.",
            "LARC methods remove daily adherence burden and have high typical-use efficacy.",
            "It prevents STIs alone.",
            "It never requires follow-up.",
          ],
          correct: 1,
          rationale:
            "LARC reduces user-dependent failure—common rationale in primary-care items.",
        },
        {
          question: "Which additional counseling is essential when prescribing contraception to a sexually active patient at risk for STIs?",
          options: [
            "Dual protection with condoms and testing when indicated.",
            "Ignore STIs if pregnancy is prevented.",
            "Avoid discussing partners.",
            "Discontinue condoms automatically.",
          ],
          correct: 0,
          rationale:
            "Contraception prevents pregnancy, not STIs—risk reduction and screening matter.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Contraception: prescribing and counseling in Canadian primary-care NP practice",
      seoTitle: "Contraception primary care | Canadian NP | NurseNest",
      seoDescription:
        "CNPLE-aligned: collaborative contraception care, eligibility safety, metric vitals, provincial access realities, and documentation—without cloning a separate US-only lesson body.",
      clinical_meaning: `**Canadian NP framing**  
Items may emphasize **collaborative agreements**, **pharmacist-initiated** access in some provinces, and **interprofessional** documentation—your answer should still show **clinical eligibility reasoning** and **follow-up** for **BP**, **migraine aura**, and **VTE risk** when estrogens appear.`,
      exam_relevance: `Expect **same cognitive spine** as US items with **Canadian** follow-up and **metric** lab/vital details when provided.`,
      clinical_scenario: `**Vignette — patient requests renewal, new headache with aura since last year**  
Re-evaluate **estrogen safety**—aura may change eligibility; **document** counseling and **alternative** methods.`,
      takeaways: `• **Eligibility + access + documentation**—core to Canadian community care.  
• **Escalate** when **neurologic** changes affect **hormonal safety**.  
• **STI prevention** remains relevant in parallel.`,
    },
    {
      preTest: [
        {
          question: "Which element is most important before continuing combined hormonal contraception after new neurologic symptoms?",
          options: [
            "Ignore symptoms if pills work.",
            "Reassess estrogen eligibility and document counseling on safer alternatives.",
            "Double the estrogen dose.",
            "Stop all follow-up.",
          ],
          correct: 1,
          rationale:
            "New focal neuro symptoms or migraine with aura may change risk—reassess CHC eligibility.",
        },
        {
          question: "Why is blood pressure relevant to combined hormonal contraceptive safety?",
          options: [
            "It is never relevant.",
            "Estrogen-containing methods can increase vascular risk—uncontrolled hypertension is a key contraindication context.",
            "Only diastolic matters.",
            "Only systolic matters.",
          ],
          correct: 1,
          rationale:
            "Hypertension interacts with estrogen-related vascular risk in eligibility reasoning.",
        },
        {
          question: "Which practice best reflects Canadian interprofessional contraception care in exam stems?",
          options: [
            "Work in silos without documentation.",
            "Clear documentation of assessment, eligibility rationale, and follow-up when collaborating with pharmacy or physician partners.",
            "Avoid follow-up.",
            "Delegate all decisions to the patient without counseling.",
          ],
          correct: 1,
          rationale:
            "Collaborative models still require NP clinical reasoning and accountable charting.",
        },
      ],
      postTest: [
        {
          question: "A patient needs highly effective contraception and wants minimal maintenance. What principle is most exam-correct?",
          options: [
            "Choose LARC when medically eligible and aligned with preferences.",
            "Choose only daily pills for everyone.",
            "Avoid IUDs for all nulliparous patients automatically.",
            "Ignore consent discussion.",
          ],
          correct: 0,
          rationale:
            "LARC offers high efficacy and reduces adherence burden—classic primary-care reasoning.",
        },
        {
          question: "When should pregnancy be excluded before starting hormonal contraception?",
          options: [
            "Never.",
            "When pregnancy status is uncertain and the stem suggests testing before initiation.",
            "Only after delivery.",
            "Only in adolescents.",
          ],
          correct: 1,
          rationale:
            "Initiating hormones without excluding pregnancy is a common safety trap.",
        },
        {
          question: "Why include STI risk discussion when prescribing contraception?",
          options: [
            "Hormonal methods prevent STIs.",
            "Many hormonal methods prevent pregnancy but not STIs—condoms and screening may still be needed.",
            "STIs are irrelevant.",
            "Only HIV matters.",
          ],
          correct: 1,
          rationale:
            "Dual protection counseling is standard when STI risk exists.",
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

export function npContraceptionCounselingSelectionHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpContraceptionCounselingSelectionGoldLessonInput(pathwayId);
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

export function getNpContraceptionCounselingSelectionGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
            title: `Contraception: counseling & selection (${suf})`,
            seoTitle: `Contraception primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} contraception eligibility, LARC counseling, EC, and adherence planning for primary-care NP preparation.`,
          }
        : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
          ? {
              ...base,
              title: `Contraception: prescribing & counseling (${suf})`,
              seoTitle: `Contraception primary care | ${lab} | NurseNest`,
              seoDescription: `${lab} collaborative contraception care with eligibility safety and follow-up documentation.`,
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
    labsDiagnostics: CONTRACEPTION_LABS_CLINICS,
    relatedSlugs: [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG, PRENATAL_ANEMIA_SLUG],
    relatedTitlesBySlug: {
      [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG]: "NP primary-care foundations",
      [PRENATAL_ANEMIA_SLUG]: "Prenatal anemia workup (FNP)",
    },
  });

  return {
    slug: NP_CONTRACEPTION_COUNSELING_SELECTION_GOLD_SLUG,
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
