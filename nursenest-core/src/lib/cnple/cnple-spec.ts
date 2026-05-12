/**
 * CNPLE Specification Registry — single source of truth for all CNPLE exam
 * configuration that is subject to CCRNR confirmation.
 *
 * IMPORTANT:
 * - `status: "provisional"` until CCRNR publishes official specifications.
 * - Never present provisional values as officially confirmed to candidates.
 * - Update `officiallyConfirmed: true` fields only when sourced from CCRNR.
 * - Version this file via git when confirmed values are updated.
 *
 * When CCRNR releases specifications:
 * 1. Update the relevant `confirmed: true` fields.
 * 2. Update `status` to `"confirmed"`.
 * 3. Remove or archive the provisional disclaimer where it was surfaced.
 * 4. Update `pathway-readiness-config.ts` to match confirmed values.
 */

// ── Core specification ────────────────────────────────────────────────────────

export const CNPLE_SPEC = {
  /**
   * "provisional" — working from published Canadian NP competency frameworks.
   * "confirmed"   — CCRNR has released official specifications.
   */
  status: "provisional" as CnpleSpecStatus,

  authority: {
    primary: "CCRNR" as const,
    fullName: "Canadian Council of Registered Nurse Regulators" as const,
    website: "https://ccrnr.ca" as const,
    competencyBased: true,
  },

  examStructure: {
    /** True only when official CCRNR documentation confirms the value. */
    officiallyConfirmed: false,

    questionCount: {
      confirmed: false,
      min: 150,
      max: 150,
      note: "Provisional — derived from LOFT format expectations. Verify at ccrnr.ca.",
    },

    timing: {
      confirmed: false,
      minutes: 240,
      note: "Provisional — 4-hour estimate. Verify at ccrnr.ca.",
    },

    format: {
      confirmed: true,
      type: "LOFT" as const,
      description: "Linear on-the-fly testing — fixed-length, not computerized adaptive testing (CAT).",
    },

    backNavigation: {
      confirmed: false,
      allowed: false,
      note: "Provisional — review-before-submit assumed. Verify official candidate guide.",
    },

    itemTypes: {
      confirmed: false,
      supported: ["single-best-answer", "sata"] as const,
      note: "Additional item types may be added when officially confirmed.",
    },

    passingStandard: {
      confirmed: false,
      note: "Passing threshold not published; NurseNest does not estimate a passing score.",
    },
  },

  disclaimers: {
    /** Used in small UI contexts — card footers, help text. */
    short:
      "Based on currently available Canadian NP competency frameworks and subject to CCRNR confirmation." as const,

    /** Used on hub pages, simulation landing, blueprint pages. */
    long:
      "NurseNest CNPLE preparation materials are based on published Canadian nurse practitioner competency frameworks and currently available regulatory guidance. Final CNPLE specifications, item formats, timing, and scoring methods may change once officially released by CCRNR. Always verify current requirements at ccrnr.ca and with your provincial regulatory college." as const,

    /** Used inline in simulation shell and report card. */
    ui:
      "CNPLE-aligned simulation — not an official CCRNR exam. Specifications are provisional until CCRNR confirms." as const,
  },
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export type CnpleSpecStatus = "provisional" | "confirmed";

export type CnpleFormatType = typeof CNPLE_SPEC.examStructure.format.type;

export type CnpleSupportedItemType =
  typeof CNPLE_SPEC.examStructure.itemTypes.supported[number];

export type CnpleSpec = typeof CNPLE_SPEC;

// ── Helper selectors ──────────────────────────────────────────────────────────

/**
 * True once CCRNR has released official exam specifications.
 * Use this to gate copy that should only appear post-confirmation.
 */
export function isOfficiallyConfirmed(): boolean {
  return CNPLE_SPEC.status === "confirmed" && CNPLE_SPEC.examStructure.officiallyConfirmed;
}

/**
 * Returns true if the given item type is in the currently supported list.
 * Safe to call with unknown strings — returns false for unsupported types.
 */
export function supportsItemType(type: string): type is CnpleSupportedItemType {
  return (CNPLE_SPEC.examStructure.itemTypes.supported as readonly string[]).includes(type);
}

/**
 * Returns the appropriate disclaimer text for a given surface.
 *
 * - "short"  → card footers, list items, compact UI
 * - "long"   → hub pages, simulation landing, blueprint
 * - "ui"     → inline within sim shell, report card
 */
export function cnpleDisclaimerFor(surface: "short" | "long" | "ui"): string {
  return CNPLE_SPEC.disclaimers[surface];
}

/**
 * Returns confirmed question count range, or `null` if not yet confirmed.
 * Do NOT display unconfirmed counts as facts to candidates.
 */
export function confirmedQuestionRange(): { min: number; max: number } | null {
  if (!CNPLE_SPEC.examStructure.questionCount.confirmed) return null;
  return {
    min: CNPLE_SPEC.examStructure.questionCount.min,
    max: CNPLE_SPEC.examStructure.questionCount.max,
  };
}

/**
 * Returns confirmed time limit in minutes, or `null` if not yet confirmed.
 */
export function confirmedTimeLimitMinutes(): number | null {
  if (!CNPLE_SPEC.examStructure.timing.confirmed) return null;
  return CNPLE_SPEC.examStructure.timing.minutes;
}

/**
 * Human-readable status label for surface display.
 */
export function cnpleSpecStatusLabel(): string {
  return isOfficiallyConfirmed()
    ? "CCRNR-confirmed specifications"
    : "Provisional — based on Canadian NP competency frameworks";
}
