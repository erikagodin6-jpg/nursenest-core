/**
 * Canonical lesson architecture rules for NurseNest content governance.
 *
 * These rules define when lessons should be merged vs kept separate,
 * what a canonical lesson must contain, and which title patterns are
 * red flags for fragmentation.
 *
 * Used by:
 *  - Duplicate detection guardrail (scripts/audit-lesson-duplicates.mjs)
 *  - AI lesson generation pipeline (admin-ai-lesson-pipeline.ts)
 *  - Content quality audit (scripts/audit-lesson-completeness.mjs)
 */

// ── Title suffixes that indicate fragmentation (should be merged) ──────────

/**
 * If a lesson title ends with one of these suffixes AND another lesson
 * in the same pathway covers the same base condition, the suffixed lesson
 * is a duplication candidate and should be merged into the canonical.
 */
export const MERGE_TRIGGER_SUFFIXES: readonly string[] = [
  " management",
  " treatment",
  " treatments",
  " nursing care",
  " care",
  " nursing management",
  " nursing interventions",
  " basics",
  " overview",
  " introduction",
  " intro",
  " fundamentals",
  " review",
] as const;

/**
 * If a lesson title starts with one of these prefixes, strip it to
 * find the base condition name for duplicate comparison.
 */
export const MERGE_TRIGGER_PREFIXES: readonly string[] = [
  "nursing care for ",
  "nursing management of ",
  "management of ",
  "treatment of ",
  "care of the ",
  "care of ",
  "introduction to ",
] as const;

// ── Separate lessons ARE allowed for these patterns ───────────────────────

/**
 * Suffixes/patterns that produce genuinely distinct lessons even when
 * the base condition is the same. These override merge triggers.
 */
export const LEGITIMATE_SPLIT_PATTERNS: readonly RegExp[] = [
  /exacerbation/i,       // COPD Exacerbation = distinct acute-care lesson
  /acute\s+(care|management|presentation)/i,
  /pediatric|paediatric|childhood/i,  // Pediatric vs adult content
  /neonatal|newborn/i,
  /geriatric|elderly|older adults?/i,
  /pregnancy|prenatal|antepartum|postpartum/i,
  /\bnp\b.*prescribing/i,    // NP prescribing = scope-distinct
  /\bnp\b.*diagnosis/i,
  /ecg\s+interpretation/i,   // Skill-based, not condition-based
  /osce/i,
  /procedure/i,
  /delegation/i,             // Leadership/management = conceptually distinct
  /prioritization/i,
] as const;

// ── Required sections for a canonical lesson ──────────────────────────────

/**
 * A canonical condition lesson must include at least these section kinds.
 * Lessons missing more than 2 of these are flagged as thin.
 */
export const CANONICAL_REQUIRED_SECTION_KINDS: readonly string[] = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "labs_diagnostics",
  "treatments",
  "pharmacology",
  "nursing_assessment_interventions",
  "client_education",
  "clinical_pearls",
] as const;

/** Minimum section count for a canonical condition lesson to be non-thin. */
export const CANONICAL_MIN_SECTION_COUNT = 10;

/** Minimum estimated word count for a canonical condition lesson body. */
export const CANONICAL_MIN_WORD_COUNT = 1200;

// ── Tier-specific scope definitions ──────────────────────────────────────

export type LessonTierKey = "rn" | "rpn_pn" | "np" | "allied";

export const TIER_SCOPE: Record<LessonTierKey, { focus: string[]; notFocus: string[] }> = {
  rn: {
    focus: [
      "assessment",
      "oxygenation",
      "safety",
      "nursing interventions",
      "patient education",
      "prioritization",
      "delegation",
      "medication administration",
    ],
    notFocus: ["prescribing", "ordering diagnostics", "differential diagnosis"],
  },
  rpn_pn: {
    focus: [
      "focused assessment",
      "stable patient care",
      "escalation triggers",
      "assisted interventions",
      "basic medication administration",
    ],
    notFocus: ["independent prescribing", "complex unstable patients", "advanced diagnostics"],
  },
  np: {
    focus: [
      "diagnosis",
      "differential diagnosis",
      "investigations",
      "prescribing",
      "independent management",
      "referrals",
      "follow-up planning",
      "guideline-based management",
    ],
    notFocus: ["basic nursing tasks", "bedside care routines"],
  },
  allied: {
    focus: [
      "profession-specific scope",
      "technical procedures",
      "collaboration with nursing team",
    ],
    notFocus: [],
  },
};

// ── Merge decisions for known duplicate clusters ──────────────────────────

export type MergeDecision = {
  /** Pathway this merge applies to. */
  pathwayId: string;
  /** Slug of the lesson to keep as the canonical. */
  canonicalSlug: string;
  /** Slugs of lessons to merge into the canonical and then deprecate. */
  mergeSlugs: string[];
  /** New title for the canonical lesson post-merge. */
  canonicalTitle: string;
  /** Human-readable justification. */
  rationale: string;
  /** Risk level for this specific merge. */
  risk: "low" | "medium" | "high";
};

/**
 * Approved merge decisions from the 2026-05-13 duplicate audit.
 * Execute via `scripts/execute-lesson-merges.mjs --dry-run` before applying.
 *
 * Status: PENDING REVIEW — do not execute until audit report is reviewed.
 */
export const APPROVED_MERGES: MergeDecision[] = [
  // ── Priority 2: Within-pathway semantic duplicates ─────────────────────
  {
    pathwayId: "ca-rn-nclex-rn",
    canonicalSlug: "pain-management",
    mergeSlugs: ["pain-assessment"],
    canonicalTitle: "Pain: Assessment & Management",
    rationale:
      "Pain assessment and management are inseparable in nursing practice and exam curriculum. Two separate lessons create fragmentation and redundant content.",
    risk: "low",
  },
  {
    pathwayId: "us-rn-nclex-rn",
    canonicalSlug: "pain-management",
    mergeSlugs: ["pain-assessment"],
    canonicalTitle: "Pain: Assessment & Management",
    rationale: "Same as ca-rn: assessment + management belong in one lesson.",
    risk: "low",
  },
  {
    pathwayId: "ca-rn-nclex-rn",
    canonicalSlug: "spinal-cord-injury",
    mergeSlugs: ["spinal-cord-injury-basics"],
    canonicalTitle: "Spinal Cord Injury",
    rationale:
      "'Basics' suffix is a fragmentation red flag. All SCI content belongs in one comprehensive canonical lesson.",
    risk: "low",
  },
  {
    pathwayId: "us-rn-nclex-rn",
    canonicalSlug: "spinal-cord-injury",
    mergeSlugs: ["spinal-cord-injury-basics"],
    canonicalTitle: "Spinal Cord Injury",
    rationale: "Same as ca-rn.",
    risk: "low",
  },
  {
    pathwayId: "ca-rn-nclex-rn",
    canonicalSlug: "dvt-prevention-management",
    mergeSlugs: ["dvt-pe-prevention"],
    canonicalTitle: "DVT: Prevention & Management",
    rationale:
      "PE prevention overlaps >70% with DVT prevention content. PE as a standalone acute lesson ('Pulmonary Embolism: Assessment & Management') is appropriate; 'DVT & PE Prevention' is duplicative.",
    risk: "low",
  },
  {
    pathwayId: "us-rn-nclex-rn",
    canonicalSlug: "dvt-prevention-management",
    mergeSlugs: ["dvt-pe-prevention"],
    canonicalTitle: "DVT: Prevention & Management",
    rationale: "Same as ca-rn.",
    risk: "low",
  },
];

/**
 * Decisions that require a content overlap check before executing.
 * Run `scripts/audit-lesson-section-overlap.mjs` on these pairs first.
 */
export const PENDING_OVERLAP_CHECK: Array<{
  pathwayId: string;
  slugA: string;
  slugB: string;
  note: string;
}> = [
  {
    pathwayId: "ca-rpn-rex-pn",
    slugA: "heart-failure-rpn",
    slugB: "heart-failure-discharge-teaching",
    note: "Discharge teaching may be legitimately distinct (patient-education focus). Check section overlap — merge only if >50%.",
  },
  {
    pathwayId: "us-lpn-nclex-pn",
    slugA: "pn-scope-delegation-prioritization",
    slugB: "delegation-assignment-pn-scope",
    note: "Prioritization content may be genuinely additive. Check section overlap — merge only if >50%.",
  },
];

// ── Guardrail helpers ─────────────────────────────────────────────────────

/**
 * Returns true if a lesson title ending suggests fragmentation
 * (i.e. it should be merged into a base condition lesson).
 */
export function isMergeTriggerTitle(title: string): boolean {
  const t = title.toLowerCase().trim();
  for (const suffix of MERGE_TRIGGER_SUFFIXES) {
    if (t.endsWith(suffix)) {
      // Check none of the legitimate split patterns override
      for (const pattern of LEGITIMATE_SPLIT_PATTERNS) {
        if (pattern.test(t)) return false;
      }
      return true;
    }
  }
  return false;
}

/**
 * Returns the base condition name after stripping merge-trigger suffixes/prefixes.
 * Used for grouping lessons during duplicate detection.
 */
export function extractBaseCondition(title: string): string {
  let t = title.toLowerCase().trim();
  for (const prefix of MERGE_TRIGGER_PREFIXES) {
    if (t.startsWith(prefix)) { t = t.slice(prefix.length); break; }
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of MERGE_TRIGGER_SUFFIXES) {
      if (t.endsWith(suffix)) { t = t.slice(0, t.length - suffix.length).trim(); changed = true; break; }
    }
  }
  return t.replace(/[:\-&,/]+$/, "").trim();
}

/**
 * Returns true if a lesson is a spaced-repetition numbered review (false positive for duplicate detection).
 */
export function isNumberedReviewLesson(title: string): boolean {
  return /:\s*review\s+\d+\s*$/i.test(title.trim());
}
