/**
 * Immunization + vaccines — outpatient NP primary care (schedules, catch-up, safety, documentation).
 * Imports {@link NP_CONTENT_ACIP_SCHEDULE_PRINCIPLES}, {@link NP_CONTENT_NACI_CANADA_NOTES}, and
 * {@link NP_CONTENT_VACCINE_SAFETY_PROGRAM} from the shared vaccine/travel base module.
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
import {
  NP_CONTENT_ACIP_SCHEDULE_PRINCIPLES,
  NP_CONTENT_NACI_CANADA_NOTES,
  NP_CONTENT_VACCINE_SAFETY_PROGRAM,
} from "@/lib/lessons/scoped-lessons/np-vaccine-travel-content-base";
import { NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-primary-care-foundations-gold-standard";

export const NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG = "np-immunization-vaccines-primary-care-gold" as const;

const NP_TRAVEL_SLUG = "np-travel-medicine-pretravel-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `${NP_CONTENT_ACIP_SCHEDULE_PRINCIPLES}

**Catch-up scheduling (exam logic)**  
When patients are **behind**, reconstruct **minimum intervals** between doses, respect **live-virus** spacing rules, and avoid **invalidating** a series by **short-interval** errors. Items love **“earliest date for next dose”** calculations conceptually—choose the option that **preserves immunogenicity** and **safety**.

**School, childcare, and occupational requirements**  
Vignettes may embed **documentation deadlines**—your job is **evidence-based completion** and **clear records**, not forging compliance.

**Refusal & hesitancy**  
Use **motivational interviewing** principles: elicit concerns, provide **balanced** information, **document** discussion and **follow-up**. Only **coercive** or **dismissive** answers are wrong when the stem seeks **therapeutic alliance**.

**PNP-PC / FNP**  
**PNP-PC** may foreground **parental refusal**, **split schedules**, and **school laws**; **FNP** may span **adult travel vaccines** and **parent–child** same-day planning—read **whose chart** the item tests.`;

const LABS_DIAGNOSTICS_BLOCK = `${NP_CONTENT_VACCINE_SAFETY_PROGRAM}

**Titers & post-vaccine serology**  
When stems order **titers**, interpret **protective thresholds** only as the vignette defines them—avoid over-testing without management change.`;

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
      title: "Immunization & vaccines: schedules, safety, and counseling (NP, US primary care)",
      seoTitle: "Immunization NP primary care | FNP & PNP-PC US | NurseNest",
      seoDescription:
        "ACIP-style schedule principles, catch-up, live vs inactivated, pregnancy/pediatrics overlays, cold chain, anaphylaxis readiness, and documentation—US NP boards.",
      clinical_meaning: `**Integrated vaccine practice**  
NP items combine **indication**, **timing**, **contraindication**, **simultaneous administration**, and **patient-specific risk** (pregnancy, immunosuppression, asplenia, HIV). **WHNP** may emphasize **pregnancy/breastfeeding** vaccine counseling; **PNP-PC** emphasizes **school requirements** and **developmentally appropriate** consent.`,
      exam_relevance: `Watch for **invalid interval** answers, **live vaccine** in **pregnancy**, **missing epinephrine** planning after **relevant allergy** history, and **deferring** only when **precaution** truly applies—not parental anxiety alone without counseling.`,
      clinical_scenario: `**Vignette — 6-month-old due for inactivated vaccines; parent requests “splitting” against evidence**  
Your best answer **counsels**, **documents**, offers **standard schedule** benefits/risks, and **schedules follow-up**—not silent acquiescence to ad hoc delays that leave the infant **undervaccinated** during high-risk months.`,
      takeaways: `• **Intervals** and **live-virus rules** are frequent trap vectors.  
• **Contraindication** is narrower than many patients believe—counsel, document.  
• **Operational safety**: cold chain, anaphylaxis, observation.  
• **FNP** + **PNP-PC** both need this spine—emphasis shifts with **population** in the stem.  
• Next: **travel** visit builds on **vaccine literacy** and **itinerary risk**.`,
    },
    {
      preTest: [
        {
          question: "Which situation is a contraindication to additional doses of a specific vaccine per typical exam stems?",
          options: [
            "Mild local redness after prior dose without systemic symptoms.",
            "Anaphylaxis to a prior dose of the same vaccine component.",
            "Fussiness for one evening after vaccination.",
            "Parental anxiety without medical contraindication.",
          ],
          correct: 1,
          rationale:
            "Anaphylaxis to a prior dose is a classic contraindication pattern—mild local reaction is not.",
        },
        {
          question: "Why are minimum intervals between doses important in catch-up planning?",
          options: [
            "They are arbitrary billing rules.",
            "They ensure immune response and series validity; too-short intervals may require repeating doses.",
            "They never matter for live vaccines.",
            "They only apply to adults.",
          ],
          correct: 1,
          rationale:
            "Interval rules protect immunogenicity—common exam calculation and reasoning target.",
        },
        {
          question: "What is the best immediate management if a patient develops anaphylaxis after vaccination in clinic?",
          options: [
            "Send them home with antihistamines only.",
            "Administer epinephrine promptly and activate emergency care per protocol.",
            "Ignore because vaccines never cause anaphylaxis.",
            "Continue the series without assessment.",
          ],
          correct: 1,
          rationale:
            "Anaphylaxis is an emergency—epinephrine first; antihistamines are adjuncts, not replacements.",
        },
      ],
      postTest: [
        {
          question: "Which statement best reflects documentation after informed vaccine refusal?",
          options: [
            "No documentation needed.",
            "Document discussion, risks/benefits, materials provided, and follow-up plan.",
            "Chart only ‘noncompliant’.",
            "Refuse future care.",
          ],
          correct: 1,
          rationale:
            "Informed refusal should be documented with risks and follow-up—professional and exam-correct.",
        },
        {
          question: "Live attenuated vaccines are generally avoided in which scenario?",
          options: [
            "Healthy adolescent without immunocompromise.",
            "Severe immunosuppression, depending on the specific live vaccine and stem details.",
            "Mild upper respiratory symptoms without fever in a stable child.",
            "Routine well-child visit without contraindications.",
          ],
          correct: 1,
          rationale:
            "Severe immunosuppression is a key precaution/contraindication context for live vaccines—match stem specifics.",
        },
        {
          question: "What is the primary rationale for observing a patient after vaccination when indicated?",
          options: [
            "To bill longer.",
            "To detect and treat immediate hypersensitivity reactions promptly.",
            "Observation is never needed.",
            "To complete paperwork only.",
          ],
          correct: 1,
          rationale:
            "Observation enables rapid treatment of rare immediate reactions—especially with risk factors.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Immunization & vaccines: Canadian NP primary-care practice (CNPLE-aligned)",
      seoTitle: "Immunization Canadian NP | NurseNest",
      seoDescription:
        "NACI-informed principles, provincial program realities, documentation, catch-up, and vaccine safety for Canadian NP candidates—paired with shared clinical reasoning.",
      clinical_meaning: `${NP_CONTENT_NACI_CANADA_NOTES}

**Exam integration**  
Translate **NACI**-style guidance into **patient-level decisions**: who receives what, when to **defer**, when to **refer** to public health or specialty, and how to **document** consent and education.`,
      exam_relevance: `Expect **interval** errors as distractors, **live vaccine** cautions, and **pregnancy** counseling consistent with Canadian stems. **Metric units** may appear—interpret **clinical risk**, not trivia.`,
      clinical_scenario: `**Vignette — newcomer family needing catch-up for school entry**  
Prioritize **valid series** with **minimum intervals**, **language-accessible** education, and **referral** to public resources when needed—choose **equity-aware** answers.`,
      takeaways: `• **Principles** over memorizing every provincial PDF—use stem cues.  
• **Document** counseling and **catch-up** plans clearly.  
• **Safety**: anaphylaxis, cold chain, reporting **AEs** when stem references surveillance.  
• Pair with **travel** lesson for **yellow fever** and **Hajj** contexts.`,
    },
    {
      preTest: [
        {
          question: "Which element is most important when schedules differ by province?",
          options: [
            "Ignore local program realities entirely.",
            "Apply core immunology principles and follow the pathway implied by the stem (public funding, school rules, referral).",
            "Assume US schedules always apply.",
            "Defer all vaccines indefinitely.",
          ],
          correct: 1,
          rationale:
            "Canadian items test adaptable reasoning—use stem-provided program constraints.",
        },
        {
          question: "Why is immunization registry documentation emphasized in Canadian practice vignettes?",
          options: [
            "It replaces clinical judgment.",
            "It supports population health tracking, school verification, and continuity across providers.",
            "It is optional everywhere.",
            "It is only for travel vaccines.",
          ],
          correct: 1,
          rationale:
            "Registries support continuity and public health—common Canadian framing.",
        },
        {
          question: "Which scenario most warrants referral or co-management with public health?",
          options: [
            "Routine on-time vaccination in a healthy infant.",
            "Complex catch-up in a recently arrived refugee with incomplete records and language barriers.",
            "Teen requesting a bandage for a scrape.",
            "Adult requesting a work note without vaccines.",
          ],
          correct: 1,
          rationale:
            "Complex catch-up and vulnerable populations often need coordinated public-health supports—exam-relevant.",
        },
      ],
      postTest: [
        {
          question: "What is the NP’s role when a parent requests a non-evidence-based alternative schedule?",
          options: [
            "Silently agree to any schedule.",
            "Provide evidence-based counseling, document discussion, and negotiate the safest achievable plan with follow-up.",
            "Dismiss parents without discussion.",
            "Refuse all future care.",
          ],
          correct: 1,
          rationale:
            "Shared decision-making with safety boundaries and documentation beats coercion or passive agreement.",
        },
        {
          question: "Which vaccine category requires special attention to timing around pregnancy in exam stems?",
          options: [
            "Inactivated influenza and Tdap—often indicated; live vaccines generally avoided in pregnancy unless exceptional stem-defined cases.",
            "All vaccines are contraindicated in every pregnancy.",
            "Only travel vaccines matter in pregnancy.",
            "Vaccines never matter in pregnancy.",
          ],
          correct: 0,
          rationale:
            "Inactivated influenza and Tdap are commonly indicated; live vaccines are generally avoided—follow stem.",
        },
        {
          question: "Why might two live vaccines require spacing if not given same day?",
          options: [
            "Because vaccines are always given in pairs.",
            "To avoid interference with immune response—per guideline intervals in the vignette.",
            "Spacing never matters.",
            "Only for adults over 65.",
          ],
          correct: 1,
          rationale:
            "Live-virus spacing rules are classic test points—follow the interval implied by guideline teaching in the stem.",
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

export function npImmunizationVaccinesPrimaryCareHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpImmunizationVaccinesPrimaryCareGoldLessonInput(pathwayId);
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

export function getNpImmunizationVaccinesPrimaryCareGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Immunization & vaccines (${suf})`,
          seoTitle: `Immunization & vaccines | ${lab} | NurseNest`,
          seoDescription: `${lab} vaccine schedules, catch-up, safety, counseling, and documentation for primary-care NP preparation.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Immunization & vaccines (${suf})`,
            seoTitle: `Immunization & vaccines | ${lab} | NurseNest`,
            seoDescription: `${lab} NACI-informed immunization reasoning with Canadian program and documentation expectations.`,
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
    labsDiagnostics: LABS_DIAGNOSTICS_BLOCK,
    relatedSlugs: [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG, "np-pediatric-well-child-prevention-gold", NP_TRAVEL_SLUG],
    relatedTitlesBySlug: {
      [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG]: "NP primary-care foundations",
      "np-pediatric-well-child-prevention-gold": "Pediatric well-child & prevention",
      [NP_TRAVEL_SLUG]: "Travel medicine: pre-travel consult",
    },
  });

  return {
    slug: NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG,
    title: v.title,
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "Immune",
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
