/**
 * CNPLE SEO Readiness Guard — prevents thin-content pages from being indexed.
 *
 * The CNPLE SEO cluster contains pages of varying depth. Cornerstone pages
 * (e.g., /cnple-practice-questions, /cnple-clinical-judgment) are rich and
 * should be indexed. Support or stub pages with insufficient content should
 * emit `noindex` until they reach minimum thresholds.
 *
 * Usage in metadata generation:
 *
 *   const ready = isCnplePageIndexReady({ wordCount, faqCount, ... });
 *   if (!ready.indexable) return { robots: { index: false, follow: true } };
 *
 * IMPORTANT: Do NOT accidentally noindex existing strong pages.
 * Only apply this guard to pages where content depth is uncertain.
 */

// ── Thresholds ────────────────────────────────────────────────────────────────

/**
 * Minimum content thresholds for CNPLE SEO pages to be considered indexable.
 * Adjust thresholds here — they propagate to all readiness checks automatically.
 */
export const CNPLE_SEO_THRESHOLDS = {
  /** Minimum word count for a cornerstone CNPLE hub page. */
  wordCountCornerstone: 800,
  /** Minimum word count for a support/topic page. */
  wordCountSupport: 400,
  /** Minimum number of FAQ items. */
  faqCount: 2,
  /** Minimum unique H2 sections. */
  sectionCount: 2,
  /** Minimum internal links to other CNPLE resources. */
  internalLinkCount: 3,
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export type CnplePageTier = "cornerstone" | "support";

export type CnpleSeoReadinessInput = {
  /** Approximate prose word count (exclude headers and nav). */
  wordCount: number;
  /** Number of FAQ items on the page. */
  faqCount: number;
  /** Number of internal links to other CNPLE resources. */
  internalLinkCount: number;
  /** Number of unique named H2 sections. */
  sectionCount: number;
  /**
   * True if the page links to remediation resources (flashcards, lessons,
   * practice questions). Increases depth score.
   */
  hasRemediationDepth: boolean;
  /** Whether this is a cornerstone or a support page — different thresholds apply. */
  tier?: CnplePageTier;
};

export type CnpleSeoReadinessResult = {
  indexable: boolean;
  /** Reasons the page is or is not indexable. Always populated. */
  reasons: string[];
  /** Specific threshold failures — empty when indexable. */
  failures: string[];
};

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Evaluates whether a CNPLE SEO page meets minimum content thresholds
 * for public indexing.
 *
 * Returns `{ indexable: true }` for pages meeting all thresholds.
 * Returns `{ indexable: false, failures }` for thin pages — caller should
 * emit `robots: { index: false, follow: true }` in generateMetadata.
 */
export function isCnplePageIndexReady(input: CnpleSeoReadinessInput): CnpleSeoReadinessResult {
  const tier = input.tier ?? "cornerstone";
  const minWords =
    tier === "cornerstone"
      ? CNPLE_SEO_THRESHOLDS.wordCountCornerstone
      : CNPLE_SEO_THRESHOLDS.wordCountSupport;

  const failures: string[] = [];
  const reasons: string[] = [];

  // Word count
  if (input.wordCount < minWords) {
    failures.push(
      `word count ${input.wordCount} below minimum ${minWords} for ${tier} page`,
    );
  } else {
    reasons.push(`word count ${input.wordCount} meets ${tier} threshold (${minWords})`);
  }

  // FAQ coverage
  if (input.faqCount < CNPLE_SEO_THRESHOLDS.faqCount) {
    failures.push(
      `FAQ count ${input.faqCount} below minimum ${CNPLE_SEO_THRESHOLDS.faqCount}`,
    );
  } else {
    reasons.push(`${input.faqCount} FAQ items — structured data eligible`);
  }

  // Section depth
  if (input.sectionCount < CNPLE_SEO_THRESHOLDS.sectionCount) {
    failures.push(
      `only ${input.sectionCount} H2 sections — minimum is ${CNPLE_SEO_THRESHOLDS.sectionCount}`,
    );
  } else {
    reasons.push(`${input.sectionCount} unique sections provide topical depth`);
  }

  // Internal links
  if (input.internalLinkCount < CNPLE_SEO_THRESHOLDS.internalLinkCount) {
    failures.push(
      `${input.internalLinkCount} internal links below minimum ${CNPLE_SEO_THRESHOLDS.internalLinkCount}`,
    );
  } else {
    reasons.push(`${input.internalLinkCount} internal CNPLE links support cluster authority`);
  }

  // Remediation depth bonus — reduces risk of thin-content flags on support pages
  if (input.hasRemediationDepth) {
    reasons.push("remediation depth links present — user value demonstrated");
  }

  const indexable = failures.length === 0;

  return { indexable, reasons, failures };
}

// ── Preset profiles ───────────────────────────────────────────────────────────

/**
 * Profile for a fully-built CNPLE hub page with prose + FAQ + sections + links.
 * Use this as a reference for what a passing page looks like.
 */
export const CNPLE_STRONG_PAGE_PROFILE: CnpleSeoReadinessInput = {
  wordCount: 1200,
  faqCount: 4,
  internalLinkCount: 6,
  sectionCount: 4,
  hasRemediationDepth: true,
  tier: "cornerstone",
};

/**
 * Profile for a thin stub page — fails all thresholds, should be noindexed.
 */
export const CNPLE_THIN_PAGE_PROFILE: CnpleSeoReadinessInput = {
  wordCount: 150,
  faqCount: 0,
  internalLinkCount: 1,
  sectionCount: 1,
  hasRemediationDepth: false,
  tier: "cornerstone",
};

// ── Robots directive helper ───────────────────────────────────────────────────

/**
 * Returns a Next.js-compatible robots metadata object based on readiness.
 * Pass the result directly to `generateMetadata()`.
 *
 * Thin pages: `{ index: false, follow: true }` — engines follow links but don't index.
 * Strong pages: `{ index: true, follow: true }`.
 */
export function cnpleSeoRobotsDirective(
  input: CnpleSeoReadinessInput,
): { index: boolean; follow: boolean } {
  const { indexable } = isCnplePageIndexReady(input);
  return { index: indexable, follow: true };
}
