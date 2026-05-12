/**
 * CNPLE content governance utilities.
 *
 * Prevents marketing copy from making prohibited claims about the CNPLE exam.
 * The Canadian Nurse Practitioner Licensure Examination (CNPLE) is owned by
 * CCRNR and may not be officially replicated, cloned, or claimed as equivalent.
 *
 * NurseNest is an INDEPENDENT preparation platform. All CNPLE-facing copy must
 * use "CNPLE-aligned", "CNPLE-style", or "inspired by the CNPLE blueprint" —
 * never "official CNPLE", "exact replica", or "identical to the real exam".
 */

// ── Forbidden phrase patterns ─────────────────────────────────────────────────

/** Strings that must NOT appear in CNPLE-facing marketing copy. */
const FORBIDDEN_CNPLE_PHRASES: readonly string[] = [
  "official cnple simulator",
  "official cnple replica",
  "exact cnple replica",
  "identical to the real exam",
  "replicates the official cnple",
  "identical to cnple",
  "exact replica of the cnple",
  "official exam simulator",
  // NCLEX framing applied to CNPLE
  "cnple cat",
  "cnple computerized adaptive",
  "cnple adaptive shutdown",
  // Wrong regulatory bodies
  "aanp canada",
  "ancc canada",
  // Unconfirmed specifics
  "official question count",
  "official timing",
  "official passing score",
];

/**
 * Validates that a string of marketing copy does not contain forbidden CNPLE claims.
 * Returns an array of violations (empty = clean).
 *
 * Safe to call in CI/test environments; does not throw by default.
 */
export function auditCnpleMarketingCopy(copy: string): string[] {
  const lower = copy.toLowerCase();
  return FORBIDDEN_CNPLE_PHRASES.filter((phrase) => lower.includes(phrase));
}

/**
 * Throws in development/test if forbidden phrases are detected.
 * Use this in server components that assemble CNPLE marketing copy.
 */
export function assertCnpleMarketingCopyClean(copy: string, context: string): void {
  if (process.env.NODE_ENV === "production") return;
  const violations = auditCnpleMarketingCopy(copy);
  if (violations.length > 0) {
    throw new Error(
      `[CNPLE Governance] Forbidden phrase(s) found in "${context}":\n${violations.map((v) => `  - "${v}"`).join("\n")}\n\nUse "CNPLE-aligned", "CNPLE-style", or "inspired by the CNPLE blueprint" instead.`,
    );
  }
}

// ── Approved phrasing helpers ─────────────────────────────────────────────────

/** Standard disclaimer appended to CNPLE simulation UI and marketing surfaces. */
export const CNPLE_INDEPENDENCE_DISCLAIMER =
  "This experience is inspired by the CNPLE blueprint and Canadian NP competencies. It is not affiliated with CCRNR, does not replicate the official CNPLE environment, and does not predict examination outcomes. NurseNest is an independent preparation platform.";

/** Short disclaimer for inline use (card footers, UI labels). */
export const CNPLE_INDEPENDENCE_DISCLAIMER_SHORT =
  "Independent CNPLE-aligned prep — not affiliated with CCRNR.";

/** Approved label for the simulation CTA (not "official CNPLE simulator"). */
export const CNPLE_SIMULATION_LABEL = "CNPLE Simulation";

/** Approved subtitle for the simulation CTA. */
export const CNPLE_SIMULATION_SUBTITLE =
  "Canadian NP Licensure Exam experience — linear simulation inspired by the CNPLE blueprint.";

// ── Canadian NP regulatory context ───────────────────────────────────────────

/**
 * Factual constants about the CNPLE from public regulatory sources.
 * Uncertain or unconfirmed values are NOT included; use "check with your
 * regulator" guidance instead.
 */
export const CNPLE_PUBLIC_FACTS = {
  /** Governing body */
  governingBody: "CCRNR (Canadian Council of Registered Nurse Regulators)",
  /** Testing format (publicly confirmed) */
  testingFormat: "Linear on-the-fly testing (LOFT) — not computerized adaptive testing (CAT)",
  /** Role this exam supports */
  role: "Nurse Practitioner (single NP classification model)",
  /** Jurisdiction */
  jurisdiction: "Canada (national single NP classification)",
  /** Preparation approach (our claim, not a regulatory claim) */
  prepNote:
    "NurseNest aligns CNPLE preparation to published Canadian NP competencies and the LOFT format. Question counts, timing, and specific blueprint weights should be verified from official CCRNR sources as details are confirmed.",
} as const;

// ── Spelling / terminology validator ─────────────────────────────────────────

/** Canadian spelling variants that should appear in CNPLE-facing copy. */
export const CANADIAN_SPELLING_MAP: Record<string, string> = {
  pediatrics: "paediatrics",
  gynecology: "gynaecology",
  anesthesia: "anaesthesia",
  cesarean: "caesarean",
  fetus: "foetus",
  program: "programme",
  defense: "defence",
  license: "licence",
  counseling: "counselling",
} as const;

/**
 * Checks a string for US-only spellings that should be Canadian.
 * Returns an array of [found_us_spelling, suggested_ca_spelling] pairs.
 *
 * Call this in tests/CI on CNPLE-facing copy to enforce Canadian terminology.
 */
export function auditCanadianSpelling(copy: string): [string, string][] {
  const lower = copy.toLowerCase();
  const violations: [string, string][] = [];
  for (const [us, ca] of Object.entries(CANADIAN_SPELLING_MAP)) {
    if (lower.includes(us)) {
      violations.push([us, ca]);
    }
  }
  return violations;
}
