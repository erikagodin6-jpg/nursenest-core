/**
 * CNPLE content quality guardrails.
 *
 * These checks are applied to CNPLE page copy, lesson content, practice question
 * stems/rationales, and simulation UI strings. They prevent prohibited framing
 * before content reaches learners.
 *
 * Run via content audit scripts and server-side validation for admin-created content.
 */

// ── Prohibited pattern definitions ───────────────────────────────────────────

/**
 * CNPLE incorrectly labelled as a CAT exam. CNPLE uses LOFT.
 * Matches specific high-confidence wrong patterns only:
 * - "CNPLE is a CAT" / "CNPLE is CAT"
 * - "CNPLE [has/uses] a? CAT [format/exam/session]"
 * - "CAT [format/exam/session] for CNPLE"
 * - "computerized adaptive" near CNPLE
 * - "CNPLE adaptive testing"
 * Does NOT fire on "not CAT" negation or standalone CAT about US NP.
 */
const CAT_LANGUAGE = new RegExp(
  // "CNPLE is [a] CAT [exam/format]"
  String.raw`\bcnple\b.{0,40}\bis\s+(?:a\s+)?cat\b|` +
    // "CNPLE has/uses [a] CAT [format/exam/session]"
    String.raw`\bcnple\b.{0,40}\b(?:has|uses?)\s+(?:a\s+)?cat\b|` +
    // "CAT [format/exam/session/sessions] for CNPLE"
    String.raw`\bcat\s+(?:format|exam|session|sessions|style)\b.{0,80}\bcnple\b|` +
    // "computerized adaptive" + CNPLE proximity (either order)
    String.raw`\bcnple\b.{0,120}computerized\s+adaptive|` +
    String.raw`computerized\s+adaptive.{0,120}\bcnple\b|` +
    // "CNPLE adaptive testing" — incorrect framing
    String.raw`\bcnple\b.{0,60}adaptive\s+test(?:ing)?`,
  "i",
);

/** AANP / ANCC presented as related to CNPLE or Canadian NP licensure. */
const AANP_ANCC_AS_CNPLE = new RegExp(
  String.raw`\b(?:aanp|ancc)\b.{0,120}\b(?:cnple|canadian np|canada np)\b|` +
    String.raw`\b(?:cnple|canadian np)\b.{0,120}\b(?:aanp|ancc)\b`,
  "i",
);

/** Fake official item count / timing / pass score for CNPLE. */
const FAKE_OFFICIAL_STATS = new RegExp(
  // "CNPLE has exactly N questions"
  String.raw`\b(?:cnple|canadian np (?:licensure )?exam)\b.{0,200}has exactly \d+\b|` +
    // "passing score is/of N%"
    String.raw`\b(?:cnple|canadian np (?:licensure )?exam)\b.{0,200}pass(?:ing)? (?:score|mark|rate) (?:is|of) \d+%|` +
    // "officially weighted/divided/split"
    String.raw`\b(?:cnple|canadian np (?:licensure )?exam)\b.{0,200}officially (?:weighted|divided|split|structured)`,
  "i",
);

/** Fake official blueprint percentages (e.g. "30% of the CNPLE", "25% weighting on the blueprint"). */
const FAKE_BLUEPRINT_PERCENTAGE = new RegExp(
  // "N% of the CNPLE/blueprint"
  String.raw`\d{1,3}%\s+of\s+(?:the\s+)?(?:cnple|canadian np (?:licensure )?exam|official\s+exam|blueprint)\b|` +
    // "N% weighting on the blueprint" or "blueprint ... N% weight"
    String.raw`\d{1,3}%\s+(?:weight(?:ed|ing)?|portion|section).{0,40}\b(?:cnple|blueprint)\b|` +
    String.raw`\b(?:cnple|blueprint)\b.{0,80}\d{1,3}%\s+(?:weight(?:ed|ing)?|portion|section)`,
  "i",
);

/** "Official CNPLE questions" or "guaranteed to match" claims. */
const OFFICIAL_QUESTION_CLAIM = new RegExp(
  String.raw`\bofficial\s+cnple\s+(?:questions?|items?|exam)\b|` +
    String.raw`\bguaranteed\s+to\s+(?:match|appear|be on|reflect)\s+(?:the\s+)?(?:cnple|exam)\b|` +
    String.raw`\bexact\s+(?:cnple|exam)\s+(?:questions?|items?|format|blueprint)\b`,
  "i",
);

/** "Family NP only" or "all ages NP" as the primary Canadian NP product positioning. */
const FAMILY_NP_ONLY_FRAMING = new RegExp(
  String.raw`\b(?:family\s+np\s+only|fnp\s+only|all\s+ages\s+np\s+only)\b.{0,120}\b(?:canada|canadian|cnple)\b|` +
    String.raw`\b(?:canada|canadian|cnple)\b.{0,120}\b(?:family\s+np\s+only|fnp\s+only|all\s+ages\s+np\s+only)\b`,
  "i",
);

/**
 * US-only guidelines (USPSTF, HIPAA) in CNPLE content.
 * These are US-specific — CNPLE content should reference Canadian equivalents (Canadian Task Force, PIPEDA).
 * Only exempted when explicitly marked as US-specific or inapplicable (e.g. "US-specific", "not applicable").
 */
const US_ONLY_GUIDELINE_WITHOUT_QUALIFIER = new RegExp(
  String.raw`\b(?:uspstf|hipaa|us preventive services task force)\b(?!.{0,80}\b(?:not applicable|us-specific|us only|not used in canada|inapplicable)\b)`,
  "i",
);

/** Outdated CNPE-only positioning (the predecessor exam; transitional context is OK but primary framing is not). */
const CNPE_ONLY_POSITIONING = new RegExp(
  String.raw`\b(?:cnpe)\b(?!.{0,60}\b(?:transition|predecessor|replaced|previously|formerly|legacy|compare)\b)`,
  "i",
);

/** Placeholder text in CNPLE pages. */
const PLACEHOLDER = /\b(?:todo|placeholder|lorem ipsum|coming soon|tbd|fixme|insert (?:answer|rationale|content) here|sample text)\b/i;

// ── Violation types ───────────────────────────────────────────────────────────

export type CnpleContentViolationCode =
  | "cnple_cat_language"
  | "cnple_aanp_ancc_framing"
  | "cnple_fake_official_stats"
  | "cnple_fake_blueprint_percentage"
  | "cnple_official_question_claim"
  | "cnple_family_np_only_framing"
  | "cnple_us_only_guideline"
  | "cnple_cnpe_only_positioning"
  | "cnple_placeholder_text";

export type CnpleContentViolation = {
  code: CnpleContentViolationCode;
  message: string;
  /** Excerpt of the offending text (trimmed to 120 chars). */
  excerpt: string;
};

export type CnpleContentAuditResult =
  | { ok: true }
  | { ok: false; violations: CnpleContentViolation[] };

// ── Core audit function ───────────────────────────────────────────────────────

function findViolation(
  text: string,
  pattern: RegExp,
  code: CnpleContentViolationCode,
  message: string,
): CnpleContentViolation | null {
  const match = text.match(pattern);
  if (!match) return null;
  const start = Math.max(0, (match.index ?? 0) - 20);
  const excerpt = text.slice(start, start + 120).trim();
  return { code, message, excerpt };
}

/**
 * Audit a block of CNPLE content (page copy, lesson text, question stem, or rationale).
 * Returns all violations found, not just the first.
 */
export function auditCnpleContent(text: string): CnpleContentAuditResult {
  const violations: CnpleContentViolation[] = [];

  const checks: Array<[RegExp, CnpleContentViolationCode, string]> = [
    [
      CAT_LANGUAGE,
      "cnple_cat_language",
      "CNPLE uses LOFT (linear on-the-fly testing), not CAT. Remove adaptive-testing language from CNPLE content.",
    ],
    [
      AANP_ANCC_AS_CNPLE,
      "cnple_aanp_ancc_framing",
      "AANP and ANCC are US NP certification bodies. Do not present them as equivalent to or part of CNPLE.",
    ],
    [
      FAKE_OFFICIAL_STATS,
      "cnple_fake_official_stats",
      "Do not state official CNPLE item counts, timing, or passing scores as confirmed facts unless sourced from CCRNR.",
    ],
    [
      FAKE_BLUEPRINT_PERCENTAGE,
      "cnple_fake_blueprint_percentage",
      "Do not cite blueprint domain percentages for CNPLE unless confirmed by official CCRNR blueprint publication.",
    ],
    [
      OFFICIAL_QUESTION_CLAIM,
      "cnple_official_question_claim",
      'Do not claim these are official CNPLE questions or guaranteed to match the exam. Use "CNPLE-aligned practice" instead.',
    ],
    [
      FAMILY_NP_ONLY_FRAMING,
      "cnple_family_np_only_framing",
      "CNPLE is based on Canada's single NP classification, not a Family-NP-only model. Remove Family-NP-only framing as the primary Canadian NP positioning.",
    ],
    [
      US_ONLY_GUIDELINE_WITHOUT_QUALIFIER,
      "cnple_us_only_guideline",
      "USPSTF and HIPAA are US-specific. Reference Canadian equivalents (Canadian Task Force, PIPEDA/provincial privacy acts) for CNPLE content, or clearly mark the US source as non-Canadian.",
    ],
    [
      CNPE_ONLY_POSITIONING,
      "cnple_cnpe_only_positioning",
      "CNPE is the predecessor exam. Do not use CNPE as the primary positioning for current Canadian NP preparation unless clearly framing it as legacy/transitional context.",
    ],
    [
      PLACEHOLDER,
      "cnple_placeholder_text",
      "CNPLE page or content contains placeholder text. Remove before publishing.",
    ],
  ];

  for (const [pattern, code, message] of checks) {
    const v = findViolation(text, pattern, code, message);
    if (v) violations.push(v);
  }

  if (violations.length === 0) return { ok: true };
  return { ok: false, violations };
}

/**
 * Strict variant: fails on the first violation (useful for sync/import pipelines).
 */
export function validateCnpleContent(text: string): { ok: true } | { ok: false; code: CnpleContentViolationCode; error: string } {
  const result = auditCnpleContent(text);
  if (result.ok) return { ok: true };
  const first = result.violations[0]!;
  return { ok: false, code: first.code, error: first.message };
}

/**
 * Batch audit across multiple content blocks (e.g. a full lesson).
 * Returns all violations across all blocks.
 */
export function auditCnpleContentBlocks(blocks: Array<{ id: string; text: string }>): Array<{
  blockId: string;
  violations: CnpleContentViolation[];
}> {
  const results: Array<{ blockId: string; violations: CnpleContentViolation[] }> = [];
  for (const block of blocks) {
    const r = auditCnpleContent(block.text);
    if (!r.ok) {
      results.push({ blockId: block.id, violations: r.violations });
    }
  }
  return results;
}
