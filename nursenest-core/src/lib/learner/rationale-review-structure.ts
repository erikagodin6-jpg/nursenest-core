/**
 * Maps server-built rationale sections (see `buildRationaleSectionsFromQuestion`)
 * into review UI buckets. Pure, extensible — add headings without breaking callers.
 */

export type RationaleSectionInput = { heading: string; body: string };

export type RationaleReviewBuckets = {
  /** Short "Correct answer" line from bank metadata when present. */
  correctAnswerSummary: string | null;
  whyCorrect: string | null;
  whyWrong: string | null;
  clinicalTakeaway: string | null;
  nclexStrategy: string | null;
  clinicalPearl: string | null;
  memoryHook: string | null;
  clinicalTrap: string | null;
  /** Sections whose headings did not match known buckets (shown after structured blocks). */
  remainder: RationaleSectionInput[];
};

function normHeading(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

const RE = {
  correctAnswer: /^correct answer$/,
  whyCorrect: /^why this is correct$/,
  whyWrong: /^why the other options are wrong$/,
  takeaway: /^clinical takeaway$/,
  strategy: /^exam strategy$/,
  pearl: /^clinical pearl$/,
  hook: /^memory hook$/,
  trap: /^common trap$/,
};

function isPlaceholderWrong(body: string): boolean {
  const b = body.trim().toLowerCase();
  return (
    b.includes("distractor-specific explanations were not provided") ||
    b.includes("were not provided for this item")
  );
}

/**
 * Partition graded rationale sections into premium review buckets.
 * Unknown headings accumulate in `remainder` (preserves forward compatibility).
 */
export function partitionRationaleSectionsForReview(sections: RationaleSectionInput[] | null | undefined): RationaleReviewBuckets {
  const empty: RationaleReviewBuckets = {
    correctAnswerSummary: null,
    whyCorrect: null,
    whyWrong: null,
    clinicalTakeaway: null,
    nclexStrategy: null,
    clinicalPearl: null,
    memoryHook: null,
    clinicalTrap: null,
    remainder: [],
  };
  if (!sections?.length) return empty;

  let correctAnswerSummary: string | null = null;
  let whyCorrect: string | null = null;
  let whyWrong: string | null = null;
  let clinicalTakeaway: string | null = null;
  let nclexStrategy: string | null = null;
  let clinicalPearl: string | null = null;
  let memoryHook: string | null = null;
  let clinicalTrap: string | null = null;
  const remainder: RationaleSectionInput[] = [];

  for (const s of sections) {
    const body = (s.body ?? "").trim();
    if (!body) continue;
    const h = normHeading(s.heading);

    if (RE.correctAnswer.test(h)) {
      correctAnswerSummary = body;
      continue;
    }
    if (RE.whyCorrect.test(h)) {
      whyCorrect = whyCorrect ? `${whyCorrect}\n\n${body}` : body;
      continue;
    }
    if (RE.whyWrong.test(h)) {
      if (!isPlaceholderWrong(body)) {
        whyWrong = whyWrong ? `${whyWrong}\n\n${body}` : body;
      }
      continue;
    }
    if (RE.takeaway.test(h)) {
      clinicalTakeaway = body;
      continue;
    }
    if (RE.strategy.test(h)) {
      nclexStrategy = body;
      continue;
    }
    if (RE.pearl.test(h)) {
      clinicalPearl = body;
      continue;
    }
    if (RE.hook.test(h)) {
      memoryHook = body;
      continue;
    }
    if (RE.trap.test(h)) {
      clinicalTrap = body;
      continue;
    }
    remainder.push({ heading: s.heading.trim(), body });
  }

  return {
    correctAnswerSummary,
    whyCorrect,
    whyWrong,
    clinicalTakeaway,
    nclexStrategy,
    clinicalPearl,
    memoryHook,
    clinicalTrap,
    remainder,
  };
}

/** True when structured buckets carry meaningful review content beyond placeholders. */
export function hasStructuredReviewContent(b: RationaleReviewBuckets): boolean {
  return Boolean(
    b.whyCorrect?.trim() ||
      b.whyWrong?.trim() ||
      b.clinicalTakeaway?.trim() ||
      b.nclexStrategy?.trim() ||
      b.clinicalPearl?.trim() ||
      b.memoryHook?.trim() ||
      b.clinicalTrap?.trim() ||
      (b.correctAnswerSummary && b.correctAnswerSummary.trim().length > 0),
  );
}
