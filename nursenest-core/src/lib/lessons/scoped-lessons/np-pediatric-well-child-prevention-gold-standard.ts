/**
 * Pediatric primary-care NP — well-child surveillance, anticipatory guidance, and prevention.
 * Pairs with {@link PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG} (acute) without duplicating emergency triage.
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
import { PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/pediatric-triage-emergencies-gold-standard";

export const NP_PEDIATRIC_WELL_CHILD_PREVENTION_GOLD_SLUG = "np-pediatric-well-child-prevention-gold" as const;

const NP_IMMUNIZATION_VACCINES_SLUG = "np-immunization-vaccines-primary-care-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**Well-child care as NP primary prevention**  
Outpatient pediatrics is not “small adults”—growth, development, behavior, and caregiver context drive **risk stratification**, **screening**, **anticipatory guidance**, and **timely referral**. Boards reward **age-appropriate milestones** (gross/fine motor, language, social-emotional), **red flags** for delay or regression, and **specific follow-up** rather than vague reassurance.

**Growth & nutrition**  
Plot **weight**, **length/height**, and **head circumference** (infancy) on **appropriate charts** when the stem provides measurements; interpret **crossing percentiles**, **failure to thrive**, and **obesity trajectories** as signals for **feeding assessment**, **endocrine** workup, or **specialty** referral when indicated.

**Developmental surveillance & screening**  
Integrate **validated screening tools** when the vignette references them (M-CHAT, ASQ concepts) and **refer early** when **autism**, **global delay**, or **regression** is suggested. NP items punish **watchful waiting** through **clear regression** or **loss of skills**.

**Safety & injury prevention**  
Age-stage counseling: **sleep position**, **car seats**, **water safety**, **firearms storage**, **button batteries**, **window guards**, **helmets**, and **supervision**—match the **developmental stage** in the stem (mobile infant vs curious toddler vs risk-taking adolescent).

**Adolescent overlays (FNP)**  
**Confidentiality limits**, **HEADSS** psychosocial screening, **substance use**, **sexual health**, and **mental health** integration—WHNP/PNP-PC stems may emphasize different visit goals but share **risk-first** reasoning.

**PNP-PC emphasis**  
School readiness, **IEP/504** referral concepts when disability suspected, **sports clearance** principles, and **parental vaccine counseling** with **developmentally respectful** assent where appropriate.`;

const PREVENTION_LABS_SCREENING = `**Anemia / lead (when guideline-driven in stem)**  
**Universal** vs **risk-based** screening depends on age and local guidance—items test whether you **screen appropriately** for **Hgb** or **lead** when **Medicaid**, **pica**, **housing**, or **immigrant** risk appears.

**TB / infectious screening contexts**  
**IGRA vs TST** nuances appear as **principles**: **interpretation**, **prior BCG**, and **treatment referral** for **latent TB** when the vignette defines public-health pathways.

**Vision / hearing / dental**  
**Age-linked** screening and **referral** for **amblyopia** risk, **school performance** concerns, and **dental home** by first tooth or age one—tie to **social determinants** when access barriers exist.`;

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
      title: "Pediatric well-child care: surveillance, guidance, and prevention (NP, US)",
      seoTitle: "Well-child primary care | NP US FNP & PNP-PC | NurseNest",
      seoDescription:
        "NP-level pediatrics: growth charts, developmental red flags, anticipatory guidance, screening, adolescent confidentiality, and referral—FNP lifespan + PNP-PC depth without duplicating emergency triage.",
      clinical_meaning: `**FNP vs PNP-PC**  
**FNP** items span **infancy through adolescence** with **breadth**; **PNP-PC** items may drill **peds-primary** depth (school health, developmental pediatrics cues, caregiver mediation). Both require **evidence-based prevention** and **clear escalation** when findings exceed outpatient scope.

**WHNP** may see **maternal–infant dyad** or **reproductive-age sibling** contexts—tie counseling to **postpartum supports** and **infant safety** when the stem connects them.`,
      exam_relevance: `Expect **red-flag recognition** (developmental regression, non-accidental injury patterns when suggested, **severe** HTN in obese teen), **next screening test**, **anticipatory guidance** choice that matches **age**, and **referral** to **early intervention** or **developmental pediatrics** when criteria met.

**Traps**  
• **Routine vaccines** deferred indefinitely without **catch-up planning**.  
• **Ignoring** **maternal depression** screening implications for **infant** wellbeing when postpartum context appears.  
• **Adolescent confidentiality** violated without **safety exception** in the stem.`,
      clinical_scenario: `**Vignette — 15-month-old “not walking yet”**  
Parents compare to cousin; exam shows **no words**, **no pointing**, and **no babble**—this is not benign **individual variation** alone.

**NP fork**  
**Validated screening**, **early intervention referral**, **audiology** when language delay, **clear documentation**, and **follow-up interval**—not “reassess at kindergarten.”`,
      takeaways: `• **Growth + development + safety** are integrated—not siloed topics.  
• **Screen early**, **refer early** for developmental concern—waiting loses neuroplasticity windows.  
• **Anticipatory guidance** must match **developmental stage** and **family context**.  
• **FNP** and **PNP-PC** share cores; **PNP-PC** may add **school** and **caregiver mediation** depth.  
• Pair with **immunization** and **travel** lessons for complete preventive pediatrics.`,
    },
    {
      preTest: [
        {
          question: "Which finding most strongly warrants prompt developmental evaluation rather than watchful waiting?",
          options: [
            "Single new word at 12 months in an otherwise interactive infant.",
            "Loss of language and social engagement after a period of normal development.",
            "Mild stranger anxiety at 9 months.",
            "Walking at 14 months with normal language.",
          ],
          correct: 1,
          rationale:
            "Regression after normal development is a red flag for autism spectrum or other neurodevelopmental conditions—early evaluation is indicated.",
        },
        {
          question: "What is the primary goal of plotting growth parameters on standardized charts?",
          options: [
            "Label children for sports teams.",
            "Detect abnormal trajectories early (failure to thrive, obesity) to guide evaluation and counseling.",
            "Replace parental report entirely.",
            "Determine adult height precisely in infancy.",
          ],
          correct: 1,
          rationale:
            "Growth trends inform nutrition, endocrine, and chronic disease workups—core well-child practice.",
        },
        {
          question: "Which topic is highest yield for injury prevention counseling at the mobile toddler stage?",
          options: [
            "Driving curfew for teens.",
            "Water safety, gates, poisoning prevention, and car seat transition rules.",
            "Mammography screening.",
            "Statin initiation.",
          ],
          correct: 1,
          rationale:
            "Toddler injury risks center on exploration, drowning, poisoning, and motor vehicle safety—match stage to counseling.",
        },
      ],
      postTest: [
        {
          question: "When should vision screening referral be considered beyond universal timelines?",
          options: [
            "Never—only at birth.",
            "When strabismus, asymmetric red reflex, or school performance concerns appear in the stem.",
            "Only after age 21.",
            "Only if parents request glasses for fashion.",
          ],
          correct: 1,
          rationale:
            "Abnormal exam or functional concerns warrant timely ophthalmology referral—exam items test recognition.",
        },
        {
          question: "Why is adolescent confidentiality emphasized in primary-care vignettes?",
          options: [
            "To exclude parents from all discussions.",
            "To encourage disclosure of risk behaviors while maintaining safety exceptions for imminent harm.",
            "Because adolescents cannot consent to any care.",
            "To avoid documenting visits.",
          ],
          correct: 1,
          rationale:
            "Confidential care improves disclosure; safety limits apply for self-harm, abuse, and imminent danger—common exam framing.",
        },
        {
          question: "Which element belongs in a defensible well-child note?",
          options: [
            "Only a diagnosis list.",
            "Growth, development, screening results, anticipatory guidance provided, and specific follow-up.",
            "Vital signs only.",
            "A promise to call the patient someday.",
          ],
          correct: 1,
          rationale:
            "Documentation should support continuity: objective data, assessment, plan, and follow-up—NP standard.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Pediatric well-child care: surveillance and prevention (Canadian NP / CNPLE-aligned)",
      seoTitle: "Well-child care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: metric growth trends, developmental screening, provincial program awareness, collaborative referral, and family-centered prevention aligned to primary-care pediatrics.",
      clinical_meaning: `**Canadian context**  
Expect **interprofessional** language, **public health** integration (immunization registry concepts), and **metric** measurements. Referral pathways may reference **developmental services** access by region—choose **timely specialist/early intervention** when criteria met, not indefinite primary-care watch.`,
      exam_relevance: `Items test **same red flags** as US stems with **Canadian documentation** and **equity** (rural/Indigenous access) undertones when provided.`,
      clinical_scenario: `**Vignette — school-age child with new academic decline**  
Vision, sleep, neurodevelopmental, and **psychosocial** stressors belong in a **structured assessment** before labeling “laziness.” Coordinate **school**, **family**, and **mental health** supports when indicated.`,
      takeaways: `• **Growth and development** surveillance crosses jurisdictions—red flags do not.  
• **Early intervention** referral beats delay.  
• **Document** counseling, **screening**, and **follow-up**.  
• **Provincial** program details may vary—exam logic stays **risk-based**.`,
    },
    {
      preTest: [
        {
          question: "Which approach best matches Canadian primary-care documentation expectations?",
          options: [
            "Vague plans with no follow-up date.",
            "Objective data, family concerns, assessment, collaborative plan, and measurable follow-up.",
            "Only billing codes.",
            "Verbal instructions without charting.",
          ],
          correct: 1,
          rationale:
            "Clear documentation supports interprofessional care and safety—exam-relevant.",
        },
        {
          question: "Why might growth charts differ between countries?",
          options: [
            "They never differ.",
            "Reference populations and measurement standards can differ—interpret trends on the chart provided in the stem.",
            "Only weight matters in Canada.",
            "Height is never measured.",
          ],
          correct: 1,
          rationale:
            "Use the chart supplied in the vignette and interpret directional trends—principles over memorizing every curve.",
        },
        {
          question: "Which scenario most warrants referral for developmental services?",
          options: [
            "Age-appropriate babbling and social smile at 4 months.",
            "Significant language delay with social communication concerns at 20 months.",
            "Independent walking at 13 months with normal language.",
            "Minor colds without developmental impact.",
          ],
          correct: 1,
          rationale:
            "Language + social communication concerns in toddlerhood require structured evaluation and early supports.",
        },
      ],
      postTest: [
        {
          question: "What is a key equity consideration in pediatric primary care vignettes?",
          options: [
            "Ignore access barriers.",
            "Recognize transportation, language, and rural access barriers and document mitigation plans.",
            "Assume all families have equal resources.",
            "Avoid interpreter services.",
          ],
          correct: 1,
          rationale:
            "Equity-aware planning is increasingly tested—especially in Canadian community contexts.",
        },
        {
          question: "When should lead screening be prioritized in exam logic?",
          options: [
            "Never after infancy.",
            "When risk factors (pica, older housing, immigration from endemic areas) or local guidelines indicate—per stem.",
            "Only if the child is asymptomatic without risk.",
            "Only in adults.",
          ],
          correct: 1,
          rationale:
            "Risk-based and guideline-based screening—interpret the stem’s cues.",
        },
        {
          question: "Which adolescent topic commonly requires confidential assessment in primary care?",
          options: [
            "Routine diaper rash in infancy.",
            "Substance use, sexual health, and mood symptoms when the stem frames adolescent privacy.",
            "Neonatal circumcision care only.",
            "Geriatric polypharmacy.",
          ],
          correct: 1,
          rationale:
            "HEADSS-style risks are classic adolescent primary-care content.",
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

export function npPediatricWellChildPreventionHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpPediatricWellChildPreventionGoldLessonInput(pathwayId);
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

export function getNpPediatricWellChildPreventionGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Pediatric well-child & prevention (${suf})`,
          seoTitle: `Well-child NP primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} well-child surveillance, growth/development, safety, and screening—FNP and PNP-PC aligned.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Pediatric well-child & prevention (${suf})`,
            seoTitle: `Well-child NP primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} pediatric prevention, Canadian program context, and referral discipline.`,
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
    labsDiagnostics: PREVENTION_LABS_SCREENING,
    relatedSlugs: [PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG, "fnp-pediatric-fever-urgency", NP_IMMUNIZATION_VACCINES_SLUG],
    relatedTitlesBySlug: {
      [PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG]: "Pediatric triage & emergencies",
      "fnp-pediatric-fever-urgency": "Pediatric fever urgency (FNP)",
      [NP_IMMUNIZATION_VACCINES_SLUG]: "Immunization & vaccines in primary care",
    },
  });

  return {
    slug: NP_PEDIATRIC_WELL_CHILD_PREVENTION_GOLD_SLUG,
    title: v.title,
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "General",
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
