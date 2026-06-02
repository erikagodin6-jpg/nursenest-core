/**
 * Lesson Overlay Architecture — Type System
 *
 * Defines the canonical-content + pathway-overlay composition model.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE OVERVIEW
 * ──────────────────────────────────────────────────────────────────────────
 *
 *   CanonicalTopic
 *   └── CanonicalTopicSharedSection[]   ← pathophysiology, core S/S, diagnostics
 *
 *   PathwayLesson (RN / RPN / NP / Allied)
 *   ├── canonicalTopicId → CanonicalTopic
 *   ├── sections[]                       ← tier/exam/country-specific sections
 *   └── (inherits shared sections from CanonicalTopic at render time)
 *
 * Rendering pipeline:
 *   1. Load CanonicalTopicSharedSection for foundation sections
 *   2. Load PathwayLesson (tier/exam-specific content)
 *   3. Merge: shared sections injected, lesson sections override by kind
 *   4. Apply educational overlay (locale/i18n strings)
 *   5. Rewrite deprecated slug references
 *   6. Evaluate structural gate
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SCOPE PRESERVATION RULES (hard invariants, never override)
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  Shared sections ONLY for:
 *    - pathophysiology_overview
 *    - anatomy (future)
 *    - signs_symptoms (core presentation, not tier-specific red flags)
 *    - labs_diagnostics (core panels, not tier-specific ordering authority)
 *
 *  NEVER shared across tiers:
 *    - nursing_assessment_interventions  ← scope differs: RN vs RPN vs NP
 *    - pharmacology                      ← prescribing authority differs
 *    - treatments                        ← ordering authority differs
 *    - tier_specific_relevance           ← by definition tier-specific
 *    - clinical_pearls                   ← exam-framing differs
 *    - client_education                  ← scope of teaching differs
 *    - exam_tips                         ← exam-specific
 *
 * ──────────────────────────────────────────────────────────────────────────
 * EXAM PEDAGOGY PRESERVATION
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  NCLEX (RN/PN): NGN clinical judgment, prioritization, delegation, ABCs
 *  REx-PN:        Focused assessment, stable client care, escalation triggers
 *  CNPLE:         Canadian regulatory framework, CNA standards, CNO scope
 *  FNP:           Independent prescribing, differential, guideline-based mgmt
 *
 *  These are different educational products. Shared pathophysiology text
 *  does NOT make the lessons equivalent.
 */

// ── Tier system ────────────────────────────────────────────────────────────

export type LessonTier = "rn" | "rpn_pn" | "np" | "allied";

export const TIER_DISPLAY: Record<LessonTier, string> = {
  rn: "Registered Nurse",
  rpn_pn: "RPN / PN / LPN",
  np: "Nurse Practitioner",
  allied: "Allied Health",
};

// ── Section kinds: shareable vs tier-specific ──────────────────────────────

/**
 * Section kinds that contain clinical-science facts safe to share
 * across tiers. These may appear in CanonicalTopicSharedSection.
 */
export const SHAREABLE_SECTION_KINDS = [
  "pathophysiology_overview",
  "signs_symptoms",
  "labs_diagnostics",
  "anatomy",           // future
  "risk_factors",      // epidemiology is tier-agnostic
  "complications",     // complications are clinical facts, not scope
] as const;

export type ShareableSectionKind = (typeof SHAREABLE_SECTION_KINDS)[number];

/**
 * Section kinds that are ALWAYS tier-specific and must NEVER be shared
 * as a single section across tiers.
 */
export const TIER_SPECIFIC_SECTION_KINDS = [
  "nursing_assessment_interventions", // scope of practice differs
  "pharmacology",                     // prescribing authority differs
  "treatments",                       // ordering authority differs
  "tier_specific_relevance",          // by definition
  "clinical_pearls",                  // exam-framing differs
  "client_education",                 // scope of teaching differs
  "exam_tips",                        // exam-specific
  "exam_relevance",                   // exam-specific
  "red_flags",                        // escalation authority differs
] as const;

export type TierSpecificSectionKind = (typeof TIER_SPECIFIC_SECTION_KINDS)[number];

export function isSharableSectionKind(kind: string): kind is ShareableSectionKind {
  return (SHAREABLE_SECTION_KINDS as readonly string[]).includes(kind);
}

export function isTierSpecificSectionKind(kind: string): kind is TierSpecificSectionKind {
  return (TIER_SPECIFIC_SECTION_KINDS as readonly string[]).includes(kind);
}

// ── Overlay composition types ──────────────────────────────────────────────

/**
 * A shared section loaded from CanonicalTopic for injection into a lesson.
 * Carries the canonical topic key for tracing.
 */
export type SharedSectionInjection = {
  canonicalTopicKey: string;
  kind: ShareableSectionKind;
  heading: string;
  body: string;
  /** Injection position relative to lesson sections (before = inject first). */
  injectionOrder: "before" | "after";
};

/**
 * Result of composing a PathwayLesson with its CanonicalTopic shared sections.
 * The `sections` array has shared sections injected in order, with lesson
 * sections taking precedence on kind conflicts.
 */
export type ComposedLesson<T extends { sections?: unknown[] }> = T & {
  _compositionMeta: {
    canonicalTopicKey: string | null;
    injectedSharedSections: number;
    overriddenSharedSections: number;
    compositionTimestamp: string;
  };
};

/**
 * Compose a lesson's sections with shared sections from its canonical topic.
 *
 * Rules:
 *  1. Shared sections are only injected if the lesson does NOT already have
 *     a section of the same `kind` (lesson wins on kind conflict)
 *  2. Shared sections with `applicableTiers` are only injected when the
 *     lesson's tier matches
 *  3. Shared sections with `applicableCountries` are only injected when
 *     the lesson's country matches
 *  4. Tier-specific section kinds are NEVER injected from shared sections
 */
export function composeSharedSections<
  TSection extends { kind: string; id: string; heading: string; body: string },
>(
  lessonSections: TSection[],
  sharedSections: Array<{
    kind: string;
    heading: string;
    body: string;
    applicableTiers: string[];
    applicableCountries: string[];
  }>,
  opts: {
    lessonTier?: LessonTier;
    lessonCountry?: "CA" | "US" | "GLOBAL";
    canonicalTopicKey: string;
  }
): {
  sections: TSection[];
  injectedCount: number;
  overriddenCount: number;
} {
  const existingKinds = new Set(lessonSections.map((s) => s.kind));
  let injectedCount = 0;
  let overriddenCount = 0;

  const toInject: TSection[] = [];
  for (const shared of sharedSections) {
    // Never inject tier-specific sections from shared pool
    if (isTierSpecificSectionKind(shared.kind)) continue;
    // Only inject shareable kinds
    if (!isSharableSectionKind(shared.kind)) continue;

    // Check tier applicability
    if (
      shared.applicableTiers.length > 0 &&
      opts.lessonTier &&
      !shared.applicableTiers.includes(opts.lessonTier)
    ) {
      continue;
    }

    // Check country applicability
    if (
      shared.applicableCountries.length > 0 &&
      opts.lessonCountry &&
      !shared.applicableCountries.includes(opts.lessonCountry)
    ) {
      continue;
    }

    if (existingKinds.has(shared.kind)) {
      overriddenCount++;
      continue; // lesson has an override section for this kind
    }

    toInject.push({
      id: `shared_${opts.canonicalTopicKey}_${shared.kind}`,
      kind: shared.kind,
      heading: shared.heading,
      body: shared.body,
    } as unknown as TSection);
    injectedCount++;
  }

  // Inject shared sections before lesson-specific sections
  return {
    sections: [...toInject, ...lessonSections],
    injectedCount,
    overriddenCount,
  };
}

// ── Country / exam overlay types ───────────────────────────────────────────

export type CountryCode = "CA" | "US" | "GLOBAL";

export type ExamFraming = "nclex_rn" | "nclex_pn" | "rex_pn" | "cnple" | "fnp" | "allied";

/**
 * Exam-specific pedagogy context for a lesson.
 * Preserved through overlay composition — never flattened.
 */
export type ExamPedagogyContext = {
  exam: ExamFraming;
  /** Primary competency emphasis for this exam's version of the lesson. */
  competencyEmphasis: string[];
  /** Question framing style. */
  questionStyle:
    | "ngn_clinical_judgment"   // NCLEX-RN NGN
    | "prioritization_focused"  // NCLEX-PN
    | "stable_client_care"      // REx-PN
    | "clinical_decision"       // CNPLE
    | "advanced_practice"       // FNP
    | "competency_based";       // Allied
  /** Regulatory framework applicable to this exam context. */
  regulatoryFramework?: string;
  /** Country-specific regulatory body (e.g. "CNA", "CNO", "NCBON"). */
  regulatoryBody?: string;
};

export const EXAM_PEDAGOGY: Record<ExamFraming, ExamPedagogyContext> = {
  nclex_rn: {
    exam: "nclex_rn",
    competencyEmphasis: [
      "clinical judgment",
      "prioritization",
      "delegation",
      "ABCs/safety",
      "patient education",
    ],
    questionStyle: "ngn_clinical_judgment",
    regulatoryFramework: "NCSBN NCLEX-RN NGN",
  },
  nclex_pn: {
    exam: "nclex_pn",
    competencyEmphasis: [
      "focused assessment",
      "stable client care",
      "escalation",
      "medication administration",
    ],
    questionStyle: "prioritization_focused",
    regulatoryFramework: "NCSBN NCLEX-PN",
  },
  rex_pn: {
    exam: "rex_pn",
    competencyEmphasis: [
      "safe care",
      "stable patient",
      "escalation to RN",
      "assisted interventions",
      "Canadian regulatory scope",
    ],
    questionStyle: "stable_client_care",
    regulatoryFramework: "NRPNRC REx-PN",
    regulatoryBody: "NRPNRC",
  },
  cnple: {
    exam: "cnple",
    competencyEmphasis: [
      "NP clinical decision-making",
      "Canadian prescribing",
      "CNA framework",
      "independent management",
      "CPSO/CNO scope",
    ],
    questionStyle: "clinical_decision",
    regulatoryFramework: "CNA CNPLE",
    regulatoryBody: "CNA / CNO / CRNBC",
  },
  fnp: {
    exam: "fnp",
    competencyEmphasis: [
      "diagnosis",
      "differential",
      "US prescribing",
      "evidence-based management",
      "guideline adherence",
    ],
    questionStyle: "advanced_practice",
    regulatoryFramework: "AANP / ANCC FNP",
    regulatoryBody: "AANP / ANCC",
  },
  allied: {
    exam: "allied",
    competencyEmphasis: [
      "profession-specific technical competency",
      "interdisciplinary collaboration",
    ],
    questionStyle: "competency_based",
  },
};

// ── Scope difference matrix ────────────────────────────────────────────────

/**
 * Canonical definition of what each tier owns exclusively.
 * Used by the guardrail system to detect scope erasure during merge review.
 */
export const SCOPE_OWNERSHIP: Record<
  LessonTier,
  { exclusive: string[]; shared: string[]; notApplicable: string[] }
> = {
  rn: {
    exclusive: [
      "assessment and reassessment",
      "nursing diagnosis",
      "nursing care planning",
      "delegation and supervision",
      "patient advocacy",
      "complex unstable patient management",
      "emergency response",
    ],
    shared: [
      "medication administration (non-prescribing)",
      "patient education basics",
      "vital sign monitoring",
      "documentation",
    ],
    notApplicable: [
      "independent prescribing",
      "ordering laboratory investigations",
      "writing medical orders",
      "differential diagnosis",
    ],
  },
  rpn_pn: {
    exclusive: [
      "stable patient focused assessment",
      "assigned nursing tasks",
      "escalation triggers",
    ],
    shared: [
      "basic medication administration",
      "patient education (directed)",
      "vital sign monitoring",
      "documentation",
    ],
    notApplicable: [
      "independent prescribing",
      "complex unstable patient management",
      "autonomous clinical judgment",
      "differential diagnosis",
      "ordering investigations",
    ],
  },
  np: {
    exclusive: [
      "independent prescribing",
      "ordering and interpreting diagnostics",
      "writing medical orders",
      "differential diagnosis",
      "advanced disease management",
      "specialist referrals",
      "independent clinical judgment",
    ],
    shared: [
      "patient education",
      "documentation",
      "health promotion",
    ],
    notApplicable: [
      "bedside nursing care routines",
      "delegating to UAP",
    ],
  },
  allied: {
    exclusive: [
      "profession-specific technical procedures",
      "profession-specific assessment tools",
    ],
    shared: [
      "patient education (profession-specific)",
      "interdisciplinary communication",
      "documentation",
    ],
    notApplicable: [
      "independent prescribing",
      "autonomous nursing care planning",
    ],
  },
};

// ── NP triplication reduction strategy ────────────────────────────────────

/**
 * Strategy for resolving NP triplication (415 clusters where the same
 * lesson exists in np-core-catalog, ca-np-cnple, and us-np-fnp).
 *
 * Migration path:
 *
 * Phase A (now):
 *   - Add canonicalTopicId to all three lesson rows pointing to same CanonicalTopic
 *   - Move shareable sections (pathophysiology, S/S, diagnostics) to
 *     CanonicalTopicSharedSection
 *   - Country-specific differences remain in PathwayLesson.sections
 *
 * Phase B (after content diff):
 *   - For NP lessons confirmed identical across ca/us: deprecate ca/us copies,
 *     serve the np-core-catalog row to both pathways via countries filter
 *   - For NP lessons with genuine country differences: keep separate rows,
 *     share only foundation sections via CanonicalTopicSharedSection
 *
 * Phase C (long-term):
 *   - np-core-catalog rows become the single authoritative NP lesson source
 *   - ca-np-cnple and us-np-fnp pathways serve from np-core via filter
 *   - Only country-specific overlay rows remain in country-specific pathways
 */
export type NPTriplicationStrategy = {
  topicKey: string;
  npCoreSlug: string;
  caNpSlug: string | null;
  usNpSlug: string | null;
  /** Whether content is verified identical across all three. */
  verifiedIdentical: boolean;
  /** Sections confirmed to differ between CA and US versions. */
  countryDivergentSections: string[];
  /** Recommended resolution. */
  resolution:
    | "consolidate_to_np_core"       // identical → use np-core row for both CA + US
    | "share_foundation_keep_overlay" // different → share pathophys, keep country overlays
    | "keep_separate";               // genuinely different → leave as-is
};

// ── Authoring workflow recommendations ────────────────────────────────────

/**
 * When authoring a new lesson, the author must declare:
 */
export type LessonAuthoringIntent = {
  /** The canonical topic this lesson covers. */
  canonicalTopicKey: string;
  /** The tier this lesson is written for. */
  tier: LessonTier;
  /** The exam this lesson is optimized for. */
  exam: ExamFraming;
  /** The country context. */
  country: CountryCode;
  /**
   * Justification for any tier-specific content decisions.
   * Required when the lesson includes pharmacology or prescribing content.
   */
  scopeJustification?: string;
  /**
   * If this lesson is a variant of an existing canonical lesson (exacerbation,
   * pediatric, etc.), declare the parent canonical lesson slug.
   */
  parentCanonicalSlug?: string;
  /** If true, this lesson covers a genuinely distinct sub-topic (not a duplicate). */
  isDistinctSubtopic?: boolean;
  /** Reason why this is a distinct subtopic (required if isDistinctSubtopic = true). */
  distinctSubtopicReason?: string;
};
