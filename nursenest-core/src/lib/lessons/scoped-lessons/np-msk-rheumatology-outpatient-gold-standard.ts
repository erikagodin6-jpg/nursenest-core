/**
 * Musculoskeletal & rheumatology — outpatient primary-care NP (US + Canada NP tracks).
 * Builds on MSK spine concepts (e.g. fragility fracture risk, osteoporosis pathophysiology, anticoagulation
 * perioperatively) while centering **ambulatory NP judgment**: OA vs inflammatory patterns, gout vs septic joint,
 * osteoporosis screening/treatment counseling, NSAID risk, steroid bridge cautions, and rheumatology referral.
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
import { SEPSIS_GOLD_SLUG } from "@/lib/lessons/scoped-lessons/sepsis-early-recognition-gold-standard";

export const NP_MSK_RHEUMATOLOGY_OUTPATIENT_GOLD_SLUG = "np-msk-rheumatology-outpatient-gold" as const;

const PATHWAY_VARIANT: Record<string, "us_np" | "ca_np"> = {
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "ca_np",
};

const SHARED_CORE_BODY = `**MSK complaints as NP primary-care problems**  
Most ambulatory **musculoskeletal** visits are **mechanical**, **degenerative**, or **crystalline**—but boards reward **cannot-miss** alternatives: **septic arthritis**, **acute fracture**, **cord compression or cauda equina**, **giant cell arteritis** when the stem gives temporal symptoms, and **DVT/PE** when calf pain is not “just a strain.” Start with **timeline**, **trauma**, **systemic symptoms** (fever, night sweats, weight loss), **immunosuppression**, **anticoagulation**, and **neuro deficits**.

**Osteoarthritis vs inflammatory arthritis**  
**OA** is typically **asymmetric**, **load-related**, with **brief morning stiffness** (often under 30 minutes) and **bony hypertrophy** patterns. **Inflammatory** patterns feature **prolonged morning stiffness**, **symmetric small-joint swelling**, **extra-articular** clues, and **elevated inflammatory markers** when provided—refer **rheumatology** when disease-modifying therapy may be indicated beyond short bridging strategies.

**Gout vs pseudogout vs septic joint**  
**Podagra**, **prior attacks**, **urate-lowering therapy**, and **classic crystals** support gout—**but fever**, **immunosuppression**, **rapidly progressive pain**, **inability to bear weight**, or **overlying skin infection** should trigger **arthrocentesis/ED evaluation** for **septic arthritis** when the stem demands it. **NP prescribing** may include **NSAIDs/colchicine/steroids** only when **renal/GI risk**, **anticoagulation**, and **infection risk** are reconciled.

**Osteoporosis & fragility fracture prevention**  
After **low-energy fracture** or **high fracture risk**, think **bone protection**: **vitamin D/calcium** counseling, **weight-bearing** and **fall prevention**, **bisphosphonate** counseling (esophageal precautions, renal thresholds), **denosumab** follow-up logistics, and **DEXA** indications—tie to **GI bleed risk** on NSAIDs and **glucocorticoid exposure**.

**NSAIDs and corticosteroids — prescribing discipline**  
NP items test **GI protection**, **renal risk** (CKD, diuretics, ACEi/ARB), **cardiovascular** risk, **pregnancy**, **age**, and **duration limits**. **Steroid bursts** for gout/MSK flares need **glucose monitoring** in diabetes, **bone risk** with repeated courses, and **infection** vigilance.

**Injections & procedures**  
When intra-articular **corticosteroid** appears, expect questions on **infection contraindication**, **anticoagulation planning**, **post-procedure monitoring**, and **documented informed consent**—not casual “routine” injections without indications.`;

const MSK_LABS_IMAGING = `**Inflammatory markers and serology (when provided)**  
**ESR/CRP** support **inflammatory** burden but are nonspecific—pair with **exam** and **pattern**. **RF/anti-CCP** contexts may appear for **RA risk stratification**—avoid anchoring on serology alone when the stem gives **atypical** features.

**Imaging**  
**X-ray** for **fracture** suspicion, **alignment**, **joint-space loss**. **MRI** when **red flags** suggest **osteomyelitis**, **disc**, or **soft-tissue** catastrophe—choose **urgent referral** when **neuro compromise** appears.

**Crystal analysis**  
Synovial fluid **Gram stain/culture** and **crystal microscopy** are definitive for infection vs gout/CPPD when the vignette pivots management—NP role is often **recognition + timely procedure/referral**, not bedside microscopy unless the item defines it.`;

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
      title: "MSK & rheumatology: outpatient diagnosis, prescribing, and referral (NP, US primary care)",
      seoTitle: "MSK & rheumatology primary care | NP US | NurseNest",
      seoDescription:
        "NP-level OA vs inflammatory patterns, gout vs septic joint triage, osteoporosis & fracture prevention, NSAID/steroid prescribing risk, injections, and rheumatology referral—FNP, AGPCNP, WHNP, PNP-PC overlays.",
      clinical_meaning: `**Population overlays**  
**AGPCNP** emphasizes **degenerative burden**, **falls**, and **polypharmacy**. **PNP-PC** may test **SCFE**, **septic hip**, **Osgood-Schlatter** distractors—read age cues. **WHNP** may embed **pregnancy** where **NSAIDs/denosumab/teratogenic** concerns dominate. **FNP** spans ages—match **peds vs adult** fracture and **inflammatory** patterns.

**Prescribing logic**  
Choose **shortest effective NSAID duration**, **PPI strategy** when GI risk is high, **avoid NSAIDs** when **AKI**, **bleeding**, or **anticoagulation** makes risk unacceptable, and document **alternatives** (topical, PT, intra-articular when appropriate).`,
      exam_relevance: `Expect **next step**: **aspiration** when septic joint suspected, **imaging** for red flags, **DEXA** when guidelines indicate, **DMARD referral** when persistent inflammatory synovitis suggests RA, and **ED** for **neuro deficit** or **systemic toxicity**.

**Traps**  
• Calling every monoarthritis “gout” without **infection** risk review.  
• Long NSAID courses without **renal/GI** mitigation when risk is high.  
• Missing **cauda equina** or **acute fracture** masked as “back strain.”`,
      clinical_scenario: `**Vignette — hot swollen knee in diabetes**  
Fever, **unable to bear weight**, **WBC left shift** when provided—**do not** send home on colchicine alone without **septic workup** pathway in the stem.

**Vignette — postmenopausal wrist fracture after fall**  
Initiate **osteoporosis workup/prevention**, review **vitamin D**, **falls**, **bisphosphonate** candidacy, and **follow-up**—link to **MSK fragility** concepts from bone-health teaching.`,
      takeaways: `• **Rule out** cannot-miss MSK emergencies before chronic symptom management.  
• **Gout therapy** requires **renal/GI** safety and **infection** exclusion when features overlap.  
• **Osteoporosis care** integrates **DEXA**, **pharmacologic** options, and **fall prevention**.  
• **NSAIDs/steroids** need **duration**, **monitoring**, and **alternatives**.  
• **Refer** rheumatology/orthopedics when **DMARDs**, **surgery**, or **diagnostic uncertainty** exceed primary care.`,
    },
    {
      preTest: [
        {
          question: "Which feature most strongly suggests septic arthritis rather than uncomplicated gout in a monoarthritis presentation?",
          options: [
            "Prior history of podagra without systemic symptoms.",
            "Fever, rapid progression, inability to bear weight, and immunosuppression—requiring urgent evaluation.",
            "Chronic bilateral symmetric small-joint stiffness without swelling.",
            "Mild ache after overuse with normal exam.",
          ],
          correct: 1,
          rationale:
            "Systemic toxicity, rapid progression, and major functional loss increase suspicion for septic joint—often requiring urgent arthrocentesis and management.",
        },
        {
          question: "Before prescribing an NSAID for chronic OA pain in an older adult on ACE inhibitor and diuretic, what is the highest-yield consideration?",
          options: [
            "Ignore renal function because NSAIDs are OTC.",
            "Assess renal function, volume status, and bleeding/GI risk; choose lowest effective dose and duration with monitoring.",
            "Add another NSAID for synergy.",
            "Stop all antihypertensives permanently without plan.",
          ],
          correct: 1,
          rationale:
            "NSAIDs can reduce renal perfusion and worsen hypertension—renal risk stratification is core NP prescribing judgment.",
        },
        {
          question: "Which patient most warrants urgent spine evaluation rather than routine muscle strain care?",
          options: [
            "Mild soreness after gardening with normal neuro exam.",
            "New urinary retention, saddle anesthesia, or bilateral leg weakness suggesting cauda equina.",
            "Chronic intermittent low back pain without red flags.",
            "Request for work note without neuro symptoms.",
          ],
          correct: 1,
          rationale:
            "Cauda equina features are neurosurgical emergencies—classic exam trap.",
        },
      ],
      postTest: [
        {
          question: "What is the primary rationale for DEXA screening in appropriate postmenopausal patients?",
          options: [
            "DEXA diagnoses all causes of bone pain.",
            "Identify low bone density to guide fracture-prevention therapy and counseling.",
            "Replace fall prevention.",
            "Screen for osteoarthritis.",
          ],
          correct: 1,
          rationale:
            "DEXA informs fracture risk mitigation—distinct from OA imaging.",
        },
        {
          question: "Why might intra-articular corticosteroid injection be relatively contraindicated in a hot, erythematous joint with systemic fever?",
          options: [
            "It always cures infection.",
            "Infection must be excluded/infection treated—injecting through bacteremia risk can worsen outcomes.",
            "Steroids never enter joints.",
            "Fever always indicates gout only.",
          ],
          correct: 1,
          rationale:
            "Suspected septic joint requires infection management pathway before elective steroid injection.",
        },
        {
          question: "Which referral pattern matches persistent inflammatory polyarthritis with elevated inflammatory markers and erosive risk?",
          options: [
            "Long-term high-dose NSAIDs without reassessment.",
            "Rheumatology evaluation for DMARD/biologic planning beyond empiric NSAIDs.",
            "Ignore joint swelling as stress.",
            "Avoid all labs indefinitely.",
          ],
          correct: 1,
          rationale:
            "Inflammatory arthritis may require disease-modifying therapy—referral when indicated.",
        },
      ],
    },
  ),
  ca_np: t(
    "ca_np",
    {
      title: "MSK & rheumatology: outpatient care (Canadian NP / CNPLE-aligned)",
      seoTitle: "MSK & rheumatology primary care | Canadian NP | NurseNest",
      seoDescription:
        "Canadian NP: MSK differentials, collaborative referral, osteoporosis and fracture-prevention logic, NSAID safety with metric labs where applicable, and interprofessional rheumatology/orthopedic pathways.",
      clinical_meaning: `**Canadian practice framing**  
Expect **collaborative agreements**, **metric creatinine/eGFR**, and **provincial formulary** hints—translate into **risk** and **monitoring**, not memorized non-SI trivia. **Referral** thresholds remain **clinical**: **septic joint**, **unstable fracture**, **neuro deficit**, and **uncontrolled inflammatory disease**.`,
      exam_relevance: `Same cognitive spine as US items with **SI-friendly** lab interpretation and **documentation** that supports **handoffs** to orthopedics/rheumatology/ED.`,
      clinical_scenario: `**Vignette — older adult with new wrist fracture after minor trauma**  
Treat **pain** and **immobilization** per setting, arrange **follow-up**, and initiate **osteoporosis risk mitigation** discussion—**not** “it was just a fall” without **bone health** planning when the stem implies fragility.`,
      takeaways: `• **Red-flag** MSK and **spine** presentations early.  
• **Integrate** renal/GI risk with **NSAID** decisions.  
• **Refer** when **sepsis**, **surgery**, or **DMARD-level** care is indicated.  
• **Fracture** in **older adults** triggers **osteoporosis** thinking.  
• **Document** monitoring and **safety netting**.`,
    },
    {
      preTest: [
        {
          question: "Which presentation most strongly suggests urgent evaluation for possible septic arthritis?",
          options: [
            "Chronic mild ache without swelling.",
            "Monoarthritis with fever, systemic toxicity, and inability to use the joint.",
            "Symmetric stiffness without swelling.",
            "Asymptomatic joint exam.",
          ],
          correct: 1,
          rationale:
            "Systemic signs with acute monoarthritis raise infection risk—urgent assessment.",
        },
        {
          question: "Why assess renal function before NSAID therapy in many older adults?",
          options: [
            "Creatinine is irrelevant to drugs.",
            "NSAIDs can worsen renal function, especially with CKD, dehydration, and interacting medications.",
            "NSAIDs always improve kidneys.",
            "Only applies to IV meds.",
          ],
          correct: 1,
          rationale:
            "Renal safety is central to outpatient NSAID prescribing.",
        },
        {
          question: "After a fragility fracture, what preventive concept is most exam-central?",
          options: [
            "Ignore bone health if pain resolves.",
            "Evaluate and address osteoporosis risk and falls to prevent secondary fractures.",
            "Stop all activity permanently.",
            "Avoid any pharmacologic therapy.",
          ],
          correct: 1,
          rationale:
            "Fragility fractures signal high future fracture risk—prevention is standard primary-care reasoning.",
        },
      ],
      postTest: [
        {
          question: "Which feature best supports inflammatory rather than purely osteoarthritic joint disease?",
          options: [
            "Brief morning stiffness only with load-related pain and no synovitis.",
            "Prolonged morning stiffness with swollen synovial joints and inflammatory markers when provided.",
            "Isolated knee pain only with running.",
            "Chronic deformity without progression.",
          ],
          correct: 1,
          rationale:
            "Inflammatory patterns and objective synovitis suggest disease that may need DMARD evaluation.",
        },
        {
          question: "When is rheumatology referral most appropriate?",
          options: [
            "Mild OA controlled with occasional acetaminophen.",
            "Suspected inflammatory arthritis with persistent synovitis despite initial measures, or diagnostic uncertainty.",
            "Acute ankle sprain improving with RICE.",
            "Muscle strain without joint involvement.",
          ],
          correct: 1,
          rationale:
            "Persistent inflammatory disease and complex diagnoses exceed empiric NSAID monotherapy.",
        },
        {
          question: "What is a key teaching point for oral bisphosphonate administration?",
          options: [
            "Take with lying down immediately after.",
            "Follow esophageal precautions: upright positioning and adequate water per product labeling; screen contraindications.",
            "Combine with other irritants intentionally.",
            "Use only without any renal assessment.",
          ],
          correct: 1,
          rationale:
            "Esophageal irritation risk drives administration rules—common exam point.",
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

export function npMskRheumatologyOutpatientHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getNpMskRheumatologyOutpatientGoldLessonInput(pathwayId);
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

export function getNpMskRheumatologyOutpatientGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
          title: `MSK & rheumatology: outpatient care (${suf})`,
          seoTitle: `MSK & rheumatology primary care | ${lab} | NurseNest`,
          seoDescription: `${lab} outpatient MSK: inflammatory vs degenerative patterns, crystal vs septic triage, bone health, NSAID safety, and referral thresholds.`,
        }
      : NP_PRIMARY_PATHWAYS.has(pathwayId) && variantKey === "ca_np"
        ? {
            ...base,
            title: `MSK & rheumatology: outpatient care (${suf})`,
            seoTitle: `MSK & rheumatology primary care | ${lab} | NurseNest`,
            seoDescription: `${lab} MSK outpatient care with collaborative referral and SI-friendly monitoring concepts.`,
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
    labsDiagnostics: MSK_LABS_IMAGING,
    relatedSlugs: [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG, SEPSIS_GOLD_SLUG, "fnp-geriatric-falls-syncope"],
    relatedTitlesBySlug: {
      [NP_PRIMARY_CARE_FOUNDATIONS_GOLD_SLUG]: "NP primary-care foundations",
      [SEPSIS_GOLD_SLUG]: "Sepsis early recognition",
      "fnp-geriatric-falls-syncope": "Geriatric falls & syncope (FNP)",
    },
  });

  return {
    slug: NP_MSK_RHEUMATOLOGY_OUTPATIENT_GOLD_SLUG,
    title: v.title,
    topic: "Musculoskeletal",
    topicSlug: "musculoskeletal",
    bodySystem: "Musculoskeletal",
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
