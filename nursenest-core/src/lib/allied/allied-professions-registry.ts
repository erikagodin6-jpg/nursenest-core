import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Visual grouping on `/allied-health` so learners scan by career area, not one flat list. */
export type AlliedHubCategoryId = "therapy" | "lab" | "acute" | "clinical" | "support";

export const ALLIED_HUB_CATEGORY_META: Record<
  AlliedHubCategoryId,
  { label: string; sublabel: string }
> = {
  therapy: {
    label: "Therapy and rehabilitation",
    sublabel: "Assistants and movement-focused roles",
  },
  lab: {
    label: "Laboratory and imaging",
    sublabel: "Specimen handling, safety, and modality judgment",
  },
  acute: {
    label: "Field and acute care",
    sublabel: "Prehospital and respiratory decision-making",
  },
  clinical: {
    label: "Clinical and desk-side roles",
    sublabel: "Pharmacy, dental, medical office, and nutrition technician contexts",
  },
  support: {
    label: "Community and personal support",
    sublabel: "PSW, community health, mental health and addictions foundations",
  },
};

export const ALLIED_HUB_CATEGORY_ORDER: AlliedHubCategoryId[] = ["therapy", "lab", "acute", "clinical", "support"];

/**
 * Allied marketing + lesson routing.
 * - Hero URLs: `/allied-health/{segment}` where `segment` ends with `-exam-prep`
 * - Canonical lesson list + detail: pathway `/{country}/allied/allied-health/lessons` (optional `?alliedProfession=`)
 *   and `…/lessons/{slug}`. Legacy `/allied-health/{key}/lessons` 301 to the pathway hub.
 */
/** Occupation hub hero — optional; defaults derived from title copy via {@link alliedProfessionDefaultRoleHero}. */
export type AlliedProfessionRoleHero = {
  whatYouDo: string[];
  whereYouWork: string[];
  topSkills: string[];
};

/** Structured study overlay (not new lesson types) — optional; defaults via {@link alliedProfessionDefaultSkillOverlay}. */
export type AlliedProfessionSkillOverlay = {
  commonTasks: string[];
  clinicalSkills: string[];
  highRiskSituations: string[];
  examFocusAreas: string[];
};

export type AlliedProfessionMarketing = {
  /** Short key for allied profession filters (`?alliedProfession=` on the canonical pathway lessons hub). */
  professionKey: string;
  /** Hero segment, e.g. `paramedic-exam-prep` → `/allied-health/paramedic-exam-prep` */
  segment: string;
  pathwayId: string;
  /** Section on the main allied hub */
  hubCategory: AlliedHubCategoryId;
  topicSlugsIn?: string[];
  /**
   * Optional JSON filename under `src/content/pathway-lessons/allied-professions/`.
   * Merged after the shared allied bundle; same `slug` replaces the prior catalog row.
   */
  dedicatedCatalogFile?: string;
  /** When DB scenarios exist, narrow catalog by `canonicalCategoryId` (pathway + publish rules unchanged). */
  scenarioCatalogCategoryIds?: string[];
  title: string;
  description: string;
  h1: string;
  examOverview: string[];
  features: string[];
  ctaLine: string;
  roleHero?: AlliedProfessionRoleHero;
  skillOverlay?: AlliedProfessionSkillOverlay;
  /** Overrides “Get ready for your … role” band; keep short. */
  premiumCtaHeadline?: string;
};

/** Display label for chips / CTAs (drops trailing “exam prep”). */
export function alliedProfessionTrackChipLabel(p: AlliedProfessionMarketing): string {
  const fromH1 = p.h1.replace(/\s+exam prep\s*$/i, "").trim();
  if (fromH1) return fromH1;
  return p.professionKey
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function alliedProfessionDefaultRoleHero(p: AlliedProfessionMarketing): AlliedProfessionRoleHero {
  const label = alliedProfessionTrackChipLabel(p);
  return (
    p.roleHero ?? {
      whatYouDo: [p.description],
      whereYouWork: [
        `Work settings depend on region, employer, and scope of practice for ${label}.`,
        "NurseNest keeps practice items inside your allied pathway authorization — not mixed with RN-only hubs.",
      ],
      topSkills: p.features.slice(0, 4),
    }
  );
}

export function alliedProfessionDefaultSkillOverlay(p: AlliedProfessionMarketing): AlliedProfessionSkillOverlay {
  return (
    p.skillOverlay ?? {
      commonTasks: p.examOverview.slice(0, 3),
      clinicalSkills: p.features.slice(0, 4),
      highRiskSituations:
        p.examOverview.length > 2
          ? p.examOverview.slice(2, 5)
          : [
              `Prioritize safety, scope boundaries, and clear reporting when ${p.h1.toLowerCase()} items test judgment under pressure.`,
            ],
      examFocusAreas: p.examOverview,
    }
  );
}

export function alliedProfessionPremiumCtaHeadline(p: AlliedProfessionMarketing): string {
  const custom = p.premiumCtaHeadline?.trim();
  if (custom) return custom;
  return `Get ready for your ${alliedProfessionTrackChipLabel(p)} role`;
}

const US_ALLIED = "us-allied-core";

/**
 * ### Allied profession `topicSlugsIn` (lesson-index verification)
 *
 * `npm run verify:lesson-indexes` intersects each profession's {@link AlliedProfessionMarketing.topicSlugsIn} with
 * normalized `lesson.topicSlug` values returned by `getMarketingLessonsHubCatalogLessons("us-allied-core")`.
 * On the trimmed/index-first allied hub, many editorial categories collapse into shared slugs such as
 * `nursing-fundamentals`. Registry rows should therefore include at least one **real** hub topic slug (see
 * {@link ALLIED_TOPIC_VERIFICATION_FALLBACK_ANCHORS} in `allied-profession-lesson-index-verification.ts`) so builds
 * stay green without disabling guards.
 *
 * **Temporary shared anchors** help structural coverage until profession-dedicated catalog expansions publish rows with
 * matching topic metadata and optional `alliedProfessionKey` ownership.
 */
export const ALLIED_PROFESSIONS: AlliedProfessionMarketing[] = [
  {
    professionKey: "pta",
    segment: "pta-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "therapy",
    // Includes `nursing-fundamentals` so profession filters intersect the live allied catalog until lessons are re-tagged to dedicated hub category slugs.
    topicSlugsIn: [
      "nursing-fundamentals",
      "patient-assessment",
      "human-anatomy",
      "human-physiology",
      "vital-signs",
      "patient-communication",
    ],
    title: "Physical therapist assistant (PTA) exam prep | NurseNest",
    description:
      "Therapeutic exercise, mobility, and safety judgment for PTA certification study. Pathway-scoped allied lessons and practice.",
    h1: "Physical therapist assistant exam prep",
    examOverview: [
      "PTA exams blend kinesiology with scope and delegation. short study loops beat long cram sessions.",
      "Alternate reading blocks with pathway-scoped questions so feedback stays in your authorization lane.",
    ],
    features: [
      "Strict allied-tier isolation from RN/PN/NP depth.",
      "Paginated lesson hubs. no full-library HTML payloads.",
      "Breadcrumbs and internal links from hub → profession → lessons.",
    ],
    ctaLine: "Open paginated lessons, then reinforce with questions on a matching allied plan.",
  },
  {
    professionKey: "ota",
    segment: "ota-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "therapy",
    topicSlugsIn: [
      "nursing-fundamentals",
      "patient-assessment",
      "patient-communication",
      "clinical-documentation",
      "human-anatomy",
      "human-physiology",
    ],
    title: "Occupational therapy assistant (OTA) exam prep | NurseNest",
    description:
      "Activity analysis, ADLs, and safety sequencing for OTA certification prep. allied pathway scope.",
    h1: "Occupational therapy assistant exam prep",
    examOverview: [
      "OTA items often test reasoning across environments. rehearse with rationale-heavy review.",
      "Keep sessions bounded; repeat weak clusters instead of marathon reads.",
    ],
    features: [
      "Metadata and canonical URLs on indexable routes.",
      "404 on unknown lessons instead of soft failures.",
      "No cross-profession leakage in learner-scoped views when a profession is set.",
    ],
    ctaLine: "Start from lessons, then drill questions in the same topic cluster.",
  },
  {
    professionKey: "occupational-therapy",
    segment: "occupational-therapy-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "therapy",
    topicSlugsIn: [
      "nursing-fundamentals",
      "occupational-therapy",
      "patient-assessment",
      "patient-communication",
      "clinical-documentation",
      "human-anatomy",
      "human-physiology",
    ],
    title: "Occupational therapy (OT) exam prep | NurseNest",
    description:
      "Activity analysis, ADLs, cognitive strategies, and documentation for occupational therapy certification and licensure contexts. Allied pathway scope.",
    h1: "Occupational therapy exam prep",
    examOverview: [
      "OT exams blend clinical reasoning with occupation-based interventions and safety sequencing.",
      "Alternate short reading blocks with pathway-scoped questions so rationales stay in your lane.",
    ],
    features: [
      "Pathway-scoped lesson hubs with honest readiness language.",
      "Strict isolation from RN/PN/NP-only nursing hubs at the data layer.",
      "Paginated lesson lists as the catalog grows.",
    ],
    ctaLine: "Open lessons for your track, then reinforce with practice on an allied plan.",
  },
  {
    professionKey: "physiotherapy",
    segment: "physiotherapy-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "therapy",
    topicSlugsIn: [
      "nursing-fundamentals",
      "patient-assessment",
      "human-anatomy",
      "human-physiology",
      "vital-signs",
      "patient-communication",
    ],
    title: "Physiotherapy / physical therapy exam prep | NurseNest",
    description:
      "Movement assessment, therapeutic exercise, and rehab progression judgment for physiotherapy and PT certification study. Allied pathway scope.",
    h1: "Physiotherapy exam prep",
    examOverview: [
      "Physiotherapy exams stress biomechanics, red flags, and progression within scope.",
      "Use short lesson blocks, then return to pathway-scoped questions for feedback in your authorization lane.",
    ],
    features: [
      "Metadata and breadcrumbs on public marketing routes.",
      "404 on unknown lessons instead of soft failures.",
      "No cross-profession leakage when a profession filter is set.",
    ],
    ctaLine: "Browse lessons, then open the question bank on a matching allied plan.",
  },
  {
    professionKey: "psychotherapy",
    segment: "psychotherapy-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "support",
    topicSlugsIn: [
      "nursing-fundamentals",
      "mental-health-therapist",
      "patient-communication",
      "clinical-documentation",
      "healthcare-teamwork",
      "medical-ethics",
    ],
    title: "Psychotherapy licensing exam prep | NurseNest",
    description:
      "Ethics, boundaries, modalities, and case formulation for psychotherapy and counseling exam contexts. Allied-tier pathway scope.",
    h1: "Psychotherapy exam prep",
    examOverview: [
      "Licensing items often test judgment under ambiguity and therapeutic frame.",
      "Alternate reading with short question bursts to keep context switching realistic.",
    ],
    features: [
      "Breadcrumb UI and structured public metadata on marketing routes.",
      "Profession-scoped recommendations when your allied track is set in settings.",
      "Private dashboards stay noindex; marketing hubs stay indexable where intended.",
    ],
    ctaLine: "Start from lessons, then align questions with your plan.",
  },
  {
    professionKey: "mlt",
    segment: "mlt-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "lab",
    topicSlugsIn: ["lab-values", "infection-control", "medical-terminology", "clinical-documentation"],
    title: "Medical laboratory technology (MLT / MLS) exam prep | NurseNest",
    description:
      "Laboratory reasoning, quality control, and safety edges for medical laboratory technology and MLS certification study. Allied-tier scoped.",
    h1: "Medical laboratory technology exam prep",
    examOverview: [
      "Lab exams mix interpretation with pre-analytical and analytical control concepts. Alternate reading with question blocks.",
      "Keep sessions bounded; accuracy matters more than marathon length.",
    ],
    features: [
      "Metadata and breadcrumbs on every indexable page.",
      "Safe pagination on lesson lists (no full-table loads in one HTML response).",
      "404 on unknown lessons instead of soft errors.",
    ],
    ctaLine: "Open paginated lessons and add questions when you are on an allied plan.",
    roleHero: {
      whatYouDo: [
        "Run and validate assays with QC awareness—specimen integrity, calibration concepts, and delta-check judgment.",
        "Translate numeric results into clinically meaningful flags while respecting your laboratory's protocols.",
      ],
      whereYouWork: [
        "Hospital core labs, outpatient diagnostics, public-health screening, research support, and specialty reference labs.",
        "Automation and manual methods vary by site; exams test reasoning across pre-analytical through post-analytical phases.",
      ],
      topSkills: [
        "Hematology and chemistry correlation basics",
        "Infection control and sharps safety",
        "Documentation and critical-value escalation paths",
        "Quality control troubleshooting mindset",
      ],
    },
  },
  {
    professionKey: "imaging",
    segment: "imaging-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "lab",
    topicSlugsIn: [
      "nursing-fundamentals",
      "radiologic-technology",
      "mri-technologist",
      "ct-technologist",
      "sonography",
      "nuclear-medicine",
      "imaging-basics",
      "patient-assessment",
      "vital-signs",
      "medical-terminology",
    ],
    title: "Medical imaging exam prep | NurseNest",
    description:
      "Safety, contrast, positioning, and protocol edges for imaging certification contexts. content scoped to allied pathways.",
    h1: "Medical imaging exam prep",
    examOverview: [
      "Imaging items often test ALARA thinking, contraindications, and team communication. rehearse with rationale-heavy review.",
      "Use the lesson hub as a map; avoid cramming every topic in one sitting.",
    ],
    features: [
      "ISR-friendly marketing pages with bounded database reads.",
      "Canonical URLs on lesson hubs; paginated pages use noindex where appropriate.",
      "Strict isolation from nursing-only hubs at the data layer.",
    ],
    ctaLine: "Start from lessons, then reinforce with pathway-scoped questions.",
  },
  {
    professionKey: "respiratory",
    segment: "rrt-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "acute",
    topicSlugsIn: ["patient-assessment", "vital-signs", "emergency-response", "infection-control", "human-physiology"],
    title: "Respiratory therapy (RRT) exam prep | NurseNest",
    description:
      "Ventilation, gas exchange, and airway management for respiratory therapy certification prep. Scoped to allied pathways and US context where applicable.",
    h1: "Respiratory therapy (RRT) exam prep",
    examOverview: [
      "Respiratory certification items often test equipment logic, safety sequencing, and escalation. Keep study loops short and repeatable.",
      "Use lessons to anchor protocols, then drill questions in the same topic cluster.",
    ],
    features: [
      "Pathway-scoped content lists. No cross-tier leakage.",
      "Paginated lesson hubs so pages stay fast as the library grows.",
      "Internal links from hub → profession → lessons → detail for clear crawling.",
    ],
    ctaLine: "Browse lessons below or return to the Allied hub to pick another discipline.",
    roleHero: {
      whatYouDo: [
        "Optimize ventilation and oxygenation plans with protocol-aware adjustments—alarms, modes, and weaning judgment.",
        "Educate patients on devices and therapies while coordinating with physicians and nurses during deteriorations.",
      ],
      whereYouWork: [
        "ICUs, emergency departments, wards, sleep labs, pulmonary rehab, and home respiratory programs.",
        "Equipment vendors and protocols differ by hospital; boards reward physiologic reasoning under pressure.",
      ],
      topSkills: [
        "ABG interpretation tied to ventilation strategy",
        "Airway adjuncts and secretion management",
        "Infection prevention around ventilator circuits",
        "Clear escalation when oxygen demand spikes",
      ],
    },
  },
  {
    professionKey: "paramedic",
    segment: "paramedic-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "acute",
    topicSlugsIn: [
      "nursing-fundamentals",
      "paramedic",
      "patient-assessment",
      "vital-signs",
      "emergency-response",
      "patient-communication",
      "clinical-documentation",
    ],
    title: "Paramedic exam prep | Allied health | NurseNest",
    description:
      "Protocol-first paramedic certification study: prioritization, airway, trauma, and scope-safe judgment. Pathway-scoped lessons and practice aligned to allied tier content.",
    h1: "Paramedic certification exam prep",
    examOverview: [
      "Allied health exams reward rapid scene judgment, scope boundaries, and protocol sequencing—not isolated facts.",
      "Use short lesson blocks, then return to pathway-scoped questions so feedback stays relevant to your authorization context.",
    ],
    features: [
      "Lessons and items filtered to the allied subscription tier. No RN-only depth mixed in by mistake.",
      "Preview sections stay discoverable; full lesson depth follows your plan.",
      "Pair lessons with timed practice and rationales to rehearse decision speed.",
    ],
    ctaLine: "Start with the lesson list, then open the question bank on a matching plan.",
    roleHero: {
      whatYouDo: [
        "Stabilize scenes with airway, breathing, circulation, and hemorrhage priorities—then transport or hand off with clear reports.",
        "Apply pharmacology and interventions within scope, documenting timelines that hold up in QA and medical direction.",
      ],
      whereYouWork: [
        "911 EMS, fire-based EMS, critical-care transport, industrial sites, and event medicine.",
        "Protocols and medical oversight vary by region; exams stress integration under fatigue and noise.",
      ],
      topSkills: [
        "Scene safety and dynamic risk scanning",
        "12-lead acquisition hints and STEMI recognition patterns",
        "Pediatric dosing hooks and weight-based judgment",
        "Radio communication and refusal documentation",
      ],
    },
  },
  {
    professionKey: "pharmacy-tech",
    segment: "pharmacy-tech-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "clinical",
    topicSlugsIn: [
      "nursing-fundamentals",
      "pharmacy-tech",
      "pharmacology",
      "medication-safety",
      "pharmacology-basics",
      "medical-terminology",
      "clinical-documentation",
    ],
    title: "Pharmacy technician exam prep | NurseNest",
    description:
      "Calculations, high-alert meds, sterile technique, and regulatory edges for pharmacy technician certification. allied pathway scope.",
    h1: "Pharmacy technician exam prep",
    examOverview: [
      "Pharmacy tech exams stress accuracy and policy. alternate calculation drills with rationale review.",
      "Keep sessions short; repeat weak areas until patterns stick.",
    ],
    features: [
      "Tier-scoped content. no nursing-only pathways in allied learner views.",
      "Lesson lists stay paginated as the catalog grows.",
      "Honest readiness language. we never promise pass outcomes.",
    ],
    ctaLine: "Use lessons as your map, then practice under the same allied entitlement.",
  },
  {
    professionKey: "social-work",
    segment: "social-work-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "support",
    topicSlugsIn: [
      "nursing-fundamentals",
      "social-work",
      "patient-communication",
      "clinical-documentation",
      "healthcare-teamwork",
      "medical-ethics",
    ],
    title: "Social work licensing exam prep | NurseNest",
    description:
      "Ethics, assessment, intervention planning, and boundaries for social work exam contexts. allied-tier pathway scope.",
    h1: "Social work exam prep",
    examOverview: [
      "Licensing items often test judgment under ambiguity. rehearse with scenario-heavy rationales.",
      "Alternate reading with short question bursts to keep context switching realistic.",
    ],
    features: [
      "Breadcrumb UI + JSON-LD on public marketing routes.",
      "Private dashboards and planner surfaces stay noindex.",
      "Profession-specific recommendations when you set your allied track in settings.",
    ],
    ctaLine: "Browse lessons on paginated hubs, then align questions with your plan.",
  },
  {
    professionKey: "psw-hca",
    segment: "psw-hca-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "support",
    topicSlugsIn: ["patient-assessment", "vital-signs", "patient-communication", "infection-control", "healthcare-teamwork"],
    title: "PSW / HCA / CCA exam prep | NurseNest",
    description:
      "Personal support, hygiene, mobility, documentation, and delegation for PSW, HCA, and CCA certification contexts. Allied-tier pathway scope.",
    h1: "PSW, HCA, and CCA exam prep",
    examOverview: [
      "Support exams reward safe sequencing, scope boundaries, and clear reporting when something changes.",
      "Alternate short reading blocks with pathway-scoped questions so rationales stay in your lane.",
      "Use the lesson hub categories as a map; avoid marathon cram sessions.",
    ],
    features: [
      "Paginated lesson lists as the catalog grows.",
      "Tier-scoped question bank isolation from RN/PN/NP depth.",
      "Honest readiness language — we never promise pass outcomes.",
    ],
    ctaLine: "Open lessons for your track, then reinforce with practice questions on an allied plan.",
    roleHero: {
      whatYouDo: [
        "Support daily living with dignity: hygiene, mobility, nutrition cues, and restorative care within your role.",
        "Observe, document, and report changes promptly so the care team can respond before small issues escalate.",
      ],
      whereYouWork: [
        "Long-term care, home care, retirement residences, hospitals (support roles), and community programs.",
        "Supervision and task lists vary by province/state and employer; exams test safe sequencing and scope.",
      ],
      topSkills: [
        "Safe transfers and mobility assistance",
        "Infection prevention in shared living settings",
        "Skin integrity and comfort rounds",
        "Clear reporting and handoff when status changes",
      ],
    },
    skillOverlay: {
      commonTasks: [
        "Bed mobility and positioning plans",
        "Assisting with meals and hydration monitoring",
        "Supporting toileting and perineal care with privacy preserved",
      ],
      clinicalSkills: [
        "Gait belt use and lift-team judgment",
        "Vital sign trends the nurse needs to know",
        "Dementia-friendly communication",
        "Documentation that is factual and timely",
      ],
      highRiskSituations: [
        "Falls, confusion, or sudden weakness after a minor bump",
        "Refusal of care while risk remains",
        "Aggression or distress where safety is the priority",
      ],
      examFocusAreas: [
        "Ethics, consent, and boundaries in intimate care",
        "Delegation: what to do yourself vs. escalate",
        "Infection control in outbreaks and shared equipment",
      ],
    },
  },
  {
    professionKey: "community-health-worker",
    segment: "community-health-worker-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "support",
    topicSlugsIn: ["healthcare-teamwork", "patient-communication", "medical-ethics", "patient-assessment"],
    title: "Community health worker exam prep | NurseNest",
    description:
      "Outreach, teaching, navigation, and population-health basics for CHW certification study. Allied pathway scope.",
    h1: "Community health worker exam prep",
    examOverview: [
      "CHW exams blend communication, ethics, and practical follow-up. rehearse with scenario-heavy rationales.",
      "Keep sessions bounded; repeat weak clusters instead of marathon reads.",
      "Pair lessons with short question bursts to keep context switching realistic.",
    ],
    features: [
      "Canonical URLs and breadcrumbs on public routes.",
      "404 on unknown lessons instead of soft failures.",
      "Strict isolation from nursing-only hubs at the data layer.",
    ],
    ctaLine: "Browse lessons, then open the question bank on a matching allied plan.",
  },
  {
    professionKey: "mental-health-addictions",
    segment: "mental-health-addictions-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "support",
    topicSlugsIn: [
      "nursing-fundamentals",
      "mental-health-therapist",
      "patient-communication",
      "clinical-documentation",
      "healthcare-teamwork",
      "medical-ethics",
    ],
    title: "Mental health and addictions worker exam prep | NurseNest",
    description:
      "Safety, boundaries, de-escalation, and documentation edges for mental health and addictions worker exams. Allied-tier scope.",
    h1: "Mental health and addictions worker exam prep",
    examOverview: [
      "Items often test judgment under ambiguity and therapeutic communication.",
      "Use rationale-heavy review after each short block.",
      "Stay inside pathway-scoped content for your subscription lane.",
    ],
    features: [
      "ISR-friendly marketing pages with bounded database reads.",
      "Paginated lesson hubs so pages stay fast as the library grows.",
      "Metadata and internal links from hub → profession → lessons.",
    ],
    ctaLine: "Start from lessons, then reinforce with pathway-scoped questions.",
  },
  {
    professionKey: "medical-assistant",
    segment: "medical-assistant-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "clinical",
    topicSlugsIn: ["medication-safety", "vital-signs", "clinical-documentation", "patient-assessment"],
    title: "Medical assistant exam prep | NurseNest",
    description:
      "Clinical workflows, vital signs, minor procedures, and office safety for medical assistant certification. Allied pathway scope.",
    h1: "Medical assistant exam prep",
    examOverview: [
      "MA exams mix administrative compliance with hands-on clinical judgment.",
      "Alternate reading with question blocks to rehearse office-speed decisions.",
      "Use the lesson hub as a map; avoid cramming every topic in one sitting.",
    ],
    features: [
      "Pathway-scoped content lists. no cross-tier leakage.",
      "Preview sections stay discoverable; full lesson depth follows your plan.",
      "Pair lessons with timed practice and rationales.",
    ],
    ctaLine: "Open paginated lessons, then add questions when you are on an allied plan.",
    roleHero: {
      whatYouDo: [
        "Prepare patients, rooms, and supplies so clinicians can work efficiently and safely.",
        "Perform authorized tasks such as vitals, point-of-care workflows, and documentation support within MA scope.",
      ],
      whereYouWork: [
        "Primary care clinics, specialty offices, urgent care–style settings, and occupational health programs.",
        "What you may do depends on state or provincial rules and physician/employer delegation—exams test that judgment.",
      ],
      topSkills: [
        "Accurate vital signs and measurement technique",
        "Infection control, PPE, and room turnover",
        "Specimen labeling and chain-of-custody awareness",
        "Professional boundaries and chaperoning norms",
      ],
    },
    skillOverlay: {
      commonTasks: [
        "Rooming patients and chief-complaint capture",
        "Setting up for minor procedures and sterile fields",
        "Point-of-care testing logistics and quality checks",
      ],
      clinicalSkills: [
        "Medication reconciliation support (not prescribing)",
        "ECG lead placement assistance where allowed",
        "Wound care supplies and dressing changes per protocol",
      ],
      highRiskSituations: [
        "Abnormal vitals with a patient who “looks fine”",
        "Allergy discrepancies before immunizations",
        "Tasks that blur into nursing scope—when to stop and escalate",
      ],
      examFocusAreas: [
        "Administrative law and privacy paired with clinical vignettes",
        "Prioritization when the schedule stacks up",
        "Communication under time pressure",
      ],
    },
  },
  {
    professionKey: "dental-assistant",
    segment: "dental-assistant-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "clinical",
    topicSlugsIn: ["infection-control", "patient-communication", "medical-terminology", "vital-signs"],
    title: "Dental assistant exam prep | NurseNest",
    description:
      "Chairside assistance, infection control, radiography basics, and patient communication for dental assistant certification. Allied scope.",
    h1: "Dental assistant exam prep",
    examOverview: [
      "Dental assistant exams stress infection control, four-handed dentistry flow, and safety sequencing.",
      "Use short lesson blocks, then return to pathway-scoped questions.",
      "Keep study loops short and repeatable.",
    ],
    features: [
      "Strict allied-tier isolation from RN/PN/NP depth.",
      "Honest readiness language. we never promise pass outcomes.",
      "Internal links from hub → profession → lessons → detail for clear crawling.",
    ],
    ctaLine: "Browse lessons below or return to the Allied hub to pick another discipline.",
  },
  {
    professionKey: "dental-hygiene",
    segment: "dental-hygiene-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "clinical",
    topicSlugsIn: ["medical-ethics", "human-anatomy", "pharmacology-basics", "infection-control"],
    title: "Dental hygiene exam prep | NurseNest",
    description:
      "Periodontal assessment, prevention education, radiographic judgment, and ethics for dental hygiene boards. Allied pathway scope.",
    h1: "Dental hygiene exam prep",
    examOverview: [
      "Hygiene boards reward prevention teaching, periodontal reasoning, and safe imaging judgment.",
      "Alternate calculation and rationale review in short bursts.",
      "Use lessons to anchor protocols, then drill questions in the same topic cluster.",
    ],
    features: [
      "Tier-scoped content. no nursing-only pathways in allied learner views.",
      "Lesson lists stay paginated as the catalog grows.",
      "Breadcrumbs and internal links from hub → profession → lessons.",
    ],
    ctaLine: "Start with the lesson list, then open the question bank on a matching plan.",
  },
  {
    professionKey: "dietetic-technician",
    segment: "dietetic-technician-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "clinical",
    topicSlugsIn: ["healthcare-teamwork", "human-physiology", "medical-terminology", "clinical-documentation"],
    title: "Dietetic technician exam prep | NurseNest",
    description:
      "Medical nutrition therapy support, screening, documentation, and food-service safety for dietetic technician certification. Allied scope.",
    h1: "Dietetic technician exam prep",
    examOverview: [
      "Technician exams blend nutrient knowledge with workflow and documentation.",
      "Keep sessions short; repeat weak areas until patterns stick.",
      "Pair lessons with timed practice and rationales.",
    ],
    features: [
      "Metadata and canonical URLs on indexable routes.",
      "404 on unknown lessons instead of soft failures.",
      "No cross-profession leakage in learner-scoped views when a profession is set.",
    ],
    ctaLine: "Use lessons as your map, then practice under the same allied entitlement.",
  },
  {
    professionKey: "emt",
    segment: "emt-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "acute",
    topicSlugsIn: ["emergency-response", "patient-assessment", "vital-signs", "human-anatomy"],
    title: "EMT exam prep | Allied health | NurseNest",
    description:
      "Scene safety, assessment, airway basics, and transport decisions for EMT certification study. pathway-scoped allied lessons and practice.",
    h1: "EMT certification exam prep",
    examOverview: [
      "EMT exams reward rapid assessment, scope boundaries, and protocol sequencing.",
      "Use short lesson blocks, then return to pathway-scoped questions so feedback stays relevant.",
      "Alternate reading with question blocks to rehearse field-speed decisions.",
    ],
    features: [
      "Lessons and items filtered to the allied subscription tier.",
      "Preview sections stay discoverable; full lesson depth follows your plan.",
      "Pair lessons with timed practice and rationales to rehearse decision speed.",
    ],
    ctaLine: "Start with the lesson list, then open the question bank on a matching plan.",
  },
  {
    professionKey: "sonography",
    segment: "sonography-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "lab",
    topicSlugsIn: ["imaging-basics", "patient-assessment", "human-physiology", "medical-terminology"],
    title: "Ultrasound / sonography exam prep | NurseNest",
    description:
      "Image optimization, patient positioning, safety, and protocol communication for sonography certification. allied-tier pathway scope.",
    h1: "Ultrasound and sonography exam prep",
    examOverview: [
      "Sonography items often test anatomy correlation, safety, and clear handoffs.",
      "Use the lesson hub as a map; avoid cramming every topic in one sitting.",
      "Keep sessions bounded; accuracy matters more than marathon length.",
    ],
    features: [
      "ISR-friendly marketing pages with bounded database reads.",
      "Canonical URLs on lesson hubs; paginated pages use noindex where appropriate.",
      "Strict isolation from nursing-only hubs at the data layer.",
    ],
    ctaLine: "Open paginated lessons and add questions when you are on an allied plan.",
  },
  {
    professionKey: "radiography",
    segment: "radiography-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "lab",
    topicSlugsIn: ["imaging-basics", "lab-values", "human-physiology", "infection-control"],
    title: "Radiography / medical imaging exam prep | NurseNest",
    description:
      "Positioning, contrast safety, ALARA thinking, and protocol edges for radiography certification. Content scoped to allied pathways.",
    h1: "Radiography and medical imaging exam prep",
    examOverview: [
      "Radiography exams mix physics judgment with patient safety and communication.",
      "Alternate reading blocks with pathway-scoped questions so feedback stays in your authorization lane.",
      "Repeat weak clusters instead of marathon reads.",
    ],
    features: [
      "Pathway-scoped content lists. no cross-tier leakage.",
      "Paginated lesson hubs so pages stay fast as the library grows.",
      "Internal links from hub → profession → lessons for clear crawling.",
    ],
    ctaLine: "Browse lessons below or return to the Allied hub to pick another discipline.",
  },
  {
    professionKey: "lab-assistant",
    segment: "lab-assistant-exam-prep",
    pathwayId: US_ALLIED,
    hubCategory: "lab",
    topicSlugsIn: ["lab-values", "infection-control", "clinical-documentation", "medical-terminology"],
    title: "Medical laboratory assistant exam prep | NurseNest",
    description:
      "Specimen collection, pre-analytical handling, QC awareness, and safety for MLA / MLT-assistant style exams. Allied pathway scope.",
    h1: "Medical laboratory assistant exam prep",
    examOverview: [
      "Assistant-level exams stress chain-of-custody, safety, and clear escalation.",
      "Keep sessions short; repeat weak areas until patterns stick.",
      "Use lessons to anchor workflows, then drill questions in the same topic cluster.",
    ],
    features: [
      "Tier-scoped content. no nursing-only pathways in allied learner views.",
      "404 on unknown lessons instead of soft errors.",
      "Honest readiness language. we never promise pass outcomes.",
    ],
    ctaLine: "Open paginated lessons, then reinforce with questions on a matching allied plan.",
  },
];

export function listAlliedProfessionsSorted(): AlliedProfessionMarketing[] {
  return [...ALLIED_PROFESSIONS].sort((a, b) => a.segment.localeCompare(b.segment));
}

/** Group professions for the main hub: fixed category order, stable sort inside each group. */
export function alliedProfessionsGroupedForHub(): Map<AlliedHubCategoryId, AlliedProfessionMarketing[]> {
  const map = new Map<AlliedHubCategoryId, AlliedProfessionMarketing[]>();
  for (const id of ALLIED_HUB_CATEGORY_ORDER) {
    map.set(id, []);
  }
  for (const p of listAlliedProfessionsSorted()) {
    const list = map.get(p.hubCategory);
    if (list) list.push(p);
  }
  return map;
}

/** @deprecated use getAlliedProfessionByHeroSegment */
export function getAlliedProfessionBySegment(segment: string): AlliedProfessionMarketing | undefined {
  return ALLIED_PROFESSIONS.find((p) => p.segment === segment);
}

export function getAlliedProfessionByHeroSegment(segment: string): AlliedProfessionMarketing | undefined {
  return getAlliedProfessionBySegment(segment);
}

export function getAlliedProfessionByProfessionKey(key: string): AlliedProfessionMarketing | undefined {
  const k = key.trim().toLowerCase();
  return ALLIED_PROFESSIONS.find((p) => p.professionKey === k);
}

const ALLIED_ROUTE_PROFESSION_KEY_ALIASES: Record<string, string> = {
  "medical-lab-technology": "mlt",
  "respiratory-therapy": "respiratory",
  ot: "occupational-therapy",
  pt: "physiotherapy",
};

export function isAlliedHeroExamPrepSlug(slug: string): boolean {
  return slug.endsWith("-exam-prep");
}

/**
 * Resolve a `[slug]` param: hero `*-exam-prep` or short `professionKey`.
 */
export function resolveAlliedProfessionFromRouteSlug(slug: string): AlliedProfessionMarketing | undefined {
  const s = slug.trim();
  if (!s) return undefined;
  if (isAlliedHeroExamPrepSlug(s)) return getAlliedProfessionByHeroSegment(s);
  return getAlliedProfessionByProfessionKey(ALLIED_ROUTE_PROFESSION_KEY_ALIASES[s] ?? s);
}

export function getPathwayOrThrow(pathwayId: string): ExamPathwayDefinition | undefined {
  return getExamPathwayById(pathwayId);
}

/** Valid values for `User.alliedProfessionKey` */
export const ALLIED_PROFESSION_KEYS = ALLIED_PROFESSIONS.map((p) => p.professionKey);
