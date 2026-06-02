/**
 * Travel medicine — pre-travel assessment, vaccines, malaria prophylaxis principles, and returned-traveler fever.
 * Builds on {@link NP_CONTENT_TRAVEL_PRETRAVEL_TABLE} and jurisdiction notes from the shared base module.
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
import { NP_CONTENT_NACI_CANADA_NOTES, NP_CONTENT_TRAVEL_PRETRAVEL_TABLE } from "@/lib/lessons/scoped-lessons/np-vaccine-travel-content-base";
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";
import { NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/np-immunization-vaccines-primary-care-gold-standard";

export const NP_TRAVEL_MEDICINE_PRETRAVEL_GOLD_SLUG = "np-travel-medicine-pretravel-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `${NP_CONTENT_TRAVEL_PRETRAVEL_TABLE}

**NP visit structure (exam-level)**  
**Timeline**: many vaccines require **≥2 weeks** (often longer) before protection—items punish **last-minute** travel clinic answers when the departure is **imminent** and **vaccine series** cannot complete.

**Medicolegal travel documents**  
**Yellow fever** certificates and **meningococcal** proof for pilgrimage—choose answers that match **country entry rules** in the vignette, not generic advice.

**Special hosts**  
**Pregnancy**, **breastfeeding**, **pediatrics**, **elderly**, **CKD**, **seizure disorder** (mefloquine caution), **psychiatric meds** (drug interactions), and **immunosuppression** (live vaccines)—read every comorbidity line.

**Post-travel**  
Fever after return from **malaria zone**: **malaria** remains in the differential until **ruled out** when the stem supports exposure—do not anchor on **viral syndrome** alone.`;

const CA_OVERLAY = `**Canada-specific travel practice notes**  
${NP_CONTENT_NACI_CANADA_NOTES}

**Travel health services**  
Canadian stems may reference **travel clinics**, **PHAC/CDC** destination resources, and **insurance** for evacuation—choose **referral** when complexity exceeds primary-care scope (e.g., **yellow fever** in **true contraindication** requiring waiver evaluation).`;

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
      title: "Travel medicine: pre-travel risk assessment & prophylaxis (NP, US)",
      seoTitle: "Travel medicine NP | vaccines & malaria prophylaxis | NurseNest",
      seoDescription:
        "Destination risk stratification, vaccine-preventable diseases, malaria chemoprophylaxis principles, special populations, and post-travel fever—FNP & PNP-PC outpatient NP boards.",
      clinical_meaning: `**FNP breadth** includes **adult business travel**, **family trips**, and **VFR** travel to endemic regions—integrate **itinerary**, **season**, and **behaviors**. **PNP-PC** may test **pediatric dosing**, **school trip** timing, and **parent counseling** for **routine + travel** vaccines without duplicating full peds schedules.

**WHNP** may embed **pregnancy** where **live vaccines** (YF, MMR, varicella) are **contraindicated** or require **deferral**—choose **destination change** or **specialist** when the stem demands.`,
      exam_relevance: `Look for **wrong prophylaxis region**, **ignored G6PD** hints when contraindications appear, **drug–drug interactions**, **late vaccination** with imminent travel, and **missed** **rabies** pre-exposure when animal exposure risk is high and access to care is poor.`,
      clinical_scenario: `**Vignette — 3-week trip to West Africa (rural)**  
Fever in returned traveler + **thrombocytopenia** + **hemolysis** pattern when suggested → think **malaria** until excluded—order **appropriate diagnostics** per setting, not only supportive care.

**Fork — pre-travel**  
If departure is **10 days away** and **primary series** unfinished, the best answer may be **schedule adjustment**, **partial protection with clear risk counseling**, or **referral**—not pretending full immunity exists.`,
      takeaways: `• **Itinerary drives risk**—urban week ≠ rural month.  
• **Vaccines**: live vs inactivated; **YF** entry requirements; **timing**.  
• **Malaria**: match **drug to region + patient factors**; avoid **wrong class** for **resistance**.  
• **Post-travel fever**: **malaria** in the right geography until excluded.  
• **FNP/PNP-PC/WHNP**: read **population** cues for **dosing** and **pregnancy**.`,
    },
    {
      preTest: [
        {
          question: "Which factor most increases the need for rabies pre-exposure prophylaxis counseling?",
          options: [
            "A resort beach vacation with no animal exposure.",
            "Long rural stay with limited access to rabies biologics and anticipated animal exposure.",
            "Domestic flight for a conference with hotel stay.",
            "Routine dental cleaning.",
          ],
          correct: 1,
          rationale:
            "High-risk itineraries with animal exposure and poor access to post-exposure care increase pre-exposure consideration—per stem details.",
        },
        {
          question: "Why is mefloquine a poor choice for a traveler with recent mood disorder history?",
          options: [
            "It has no side effects.",
            "Neuropsychiatric adverse effects are a recognized concern—choose an alternative when the stem flags psychiatric history.",
            "It only works in Asia.",
            "It is always preferred in pregnancy.",
          ],
          correct: 1,
          rationale:
            "Mefloquine carries neuropsychiatric risk—exam items test contraindication/precaution recognition.",
        },
        {
          question: "What is the primary goal of a pre-travel visit 4–6 weeks before departure?",
          options: [
            "Avoid all vaccines.",
            "Complete multi-dose vaccine series and allow time for immunity to develop.",
            "Only exchange currency.",
            "Delay care until after travel.",
          ],
          correct: 1,
          rationale:
            "Many vaccines need weeks for series completion and immune response—classic travel clinic principle.",
        },
      ],
      postTest: [
        {
          question: "A febrile traveler returns from a malaria-endemic region. What is an exam-correct initial priority?",
          options: [
            "Assume viral syndrome without testing.",
            "Evaluate for malaria when exposure and clinical features support risk, per setting.",
            "Start antibiotics for all fever without assessment.",
            "Ignore fever if mild.",
          ],
          correct: 1,
          rationale:
            "Malaria can be fatal; testing and treatment pathways depend on setting—boards reward appropriate suspicion.",
        },
        {
          question: "Yellow fever vaccination is most associated with which exam concept?",
          options: [
            "Universal requirement for all destinations globally.",
            "Entry requirements for certain countries and live-vaccine contraindication screening.",
            "Only needed for Arctic travel.",
            "Replaces all mosquito precautions.",
          ],
          correct: 1,
          rationale:
            "YF is region-specific and legally required in some itineraries; live vaccine contraindications matter.",
        },
        {
          question: "Which traveler needs typhoid vaccination consideration?",
          options: [
            "Only travelers to polar regions.",
            "Travelers with prolonged exposure to settings with enteric fever risk, per itinerary in the stem.",
            "No one—typhoid is extinct.",
            "Only infants under 6 months.",
          ],
          correct: 1,
          rationale:
            "Typhoid risk depends on destination, duration, and food/water exposures—use stem cues.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "Travel medicine: pre-travel assessment (Canadian NP / CNPLE-aligned)",
      seoTitle: "Travel medicine Canadian NP | NurseNest",
      seoDescription:
        "PHAC-aligned destination risk framing, referral to travel health services, malaria prophylaxis principles, and post-travel fever evaluation for Canadian NP preparation.",
      clinical_meaning: `${CA_OVERLAY}

**Primary-care NP scope**  
Know when to **manage** in clinic versus **refer** to **travel medicine** for **complex itineraries**, **immunosuppression**, or **yellow fever** waiver situations.`,
      exam_relevance: `Expect **metric** lab interpretation, **provincial** access patterns, and **timely** referral—same tropical disease reasoning as US with Canadian documentation tone.`,
      clinical_scenario: `**Vignette — student departing in 5 days for rural work**  
Highlight **incomplete vaccine series**, **limited time**, and **risk counseling**—choose **partial protection + behavioral precautions** or **delay** if the stem allows, not silent approval of zero protection.`,
      takeaways: `• **Refer** when itinerary complexity exceeds safe primary-care management.  
• **Malaria** and **enteric fever** remain high-yield.  
• **Document** vaccines, counseling, and **post-travel** follow-up instructions.  
• **Canadian** travel health resources complement **CDC/WHO** thinking in vignettes.`,
    },
    {
      preTest: [
        {
          question: "Which statement best reflects malaria prophylaxis selection?",
          options: [
            "One drug works for all regions worldwide.",
            "Match regimen to regional resistance, patient renal/hepatic status, interactions, and adherence.",
            "Avoid prophylaxis always due to side effects.",
            "Use any antibiotic for malaria prevention.",
          ],
          correct: 1,
          rationale:
            "Prophylaxis selection is individualized to region and patient factors—core travel medicine reasoning.",
        },
        {
          question: "Why might a pregnant traveler need itinerary changes?",
          options: [
            "Pregnancy never affects travel risk.",
            "Some vaccines and prophylaxis options are contraindicated or require alternative plans—risk–benefit counseling.",
            "Pregnancy requires stopping all medications including prenatal vitamins.",
            "Travel is banned for all pregnant patients.",
          ],
          correct: 1,
          rationale:
            "Pregnancy changes vaccine and medication safety—travel plans may need adjustment.",
        },
        {
          question: "What is the most appropriate response to a last-minute pre-travel visit the day before departure?",
          options: [
            "Start multi-dose live vaccine series and assume full protection immediately.",
            "Set realistic expectations, give time-sensitive interventions, and document risks and contingency plans.",
            "Cancel the trip without discussion.",
            "Ignore vaccines entirely.",
          ],
          correct: 1,
          rationale:
            "Late visits require honest counseling about incomplete protection and harm reduction—classic exam scenario.",
        },
      ],
      postTest: [
        {
          question: "Dengue prevention primarily emphasizes:",
          options: [
            "Oral polio vaccine boosters for all travelers.",
            "Mosquito bite prevention and destination awareness; no specific antiviral prophylaxis in most stems.",
            "Daily azithromycin for everyone.",
            "High-altitude acetazolamide for all trips.",
          ],
          correct: 1,
          rationale:
            "Dengue prevention is vector avoidance; supportive care if illness—know what vaccines do and do not cover.",
        },
        {
          question: "Returned traveler with fever after safari—what differential must be considered early?",
          options: [
            "Only allergic rhinitis.",
            "Malaria and other travel-related infections depending on itinerary and incubation.",
            "Only strep throat.",
            "Only dehydration without evaluation.",
          ],
          correct: 1,
          rationale:
            "Fever after endemic exposure requires structured infectious evaluation—malaria is classic.",
        },
        {
          question: "Which resource pairing is most appropriate for complex travel health planning in Canada?",
          options: [
            "Ignore guidelines.",
            "PHAC destination guidance + travel clinic referral when indicated.",
            "Social media only.",
            "Pharmacy alone for all antimalarials without assessment.",
          ],
          correct: 1,
          rationale:
            "Authoritative guidance and specialist referral for complex cases—safe NP practice.",
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

export function npTravelMedicinePretravelHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpTravelMedicinePretravelGoldLessonInput(pathwayId);
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

export function getNpTravelMedicinePretravelGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `Travel medicine: pre-travel consult (${suf})`,
          seoTitle: `Travel medicine NP | ${lab} | NurseNest`,
          seoDescription: `${lab} travel risk assessment, vaccines, malaria chemoprophylaxis, and post-travel fever—primary-care NP preparation.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `Travel medicine: pre-travel consult (${suf})`,
            seoTitle: `Travel medicine NP | ${lab} | NurseNest`,
            seoDescription: `${lab} PHAC-informed travel health planning and referral thresholds for Canadian NP candidates.`,
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
    labsDiagnostics: `**Travel-related labs (when ordered)**  
**Thick/thin smears**, **rapid tests**, **PCR**—availability depends on setting; items test **don’t miss malaria** thinking more than lab trivia. **LFTs** for hepatic involvement patterns when the stem suggests **viral hepatitis** risk.`,
    relatedSlugs: [NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG, SEPSIS_GOLD_SLUG, "np-pediatric-well-child-prevention-gold"],
    relatedTitlesBySlug: {
      [NP_IMMUNIZATION_VACCINES_PRIMARY_CARE_GOLD_SLUG]: "Immunization & vaccines in primary care",
      [SEPSIS_GOLD_SLUG]: "Sepsis early recognition",
      "np-pediatric-well-child-prevention-gold": "Pediatric well-child & prevention",
    },
  });

  return {
    slug: NP_TRAVEL_MEDICINE_PRETRAVEL_GOLD_SLUG,
    title: v.title,
    topic: "Travel medicine",
    topicSlug: "clinical-reasoning",
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
