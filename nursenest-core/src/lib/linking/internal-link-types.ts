/**
 * Internal Linking Engine — shared type definitions.
 *
 * Surfaces: blog | lesson | flashcard | question | cat_result | hub
 * Targets:  lesson | flashcard | question | blog | cat | hub
 *
 * The resolver takes a LinkContext describing the current page and returns a
 * ranked list of LinkCandidate objects ready for rendering.
 */

// ── Surfaces ──────────────────────────────────────────────────────────────────

/** The type of page requesting link suggestions. */
export type LinkSurface =
  | "blog"
  | "lesson"
  | "flashcard"
  | "question"
  | "cat_result"
  | "hub";

// ── Targets ───────────────────────────────────────────────────────────────────

/** The type of content a candidate link points to. */
export type LinkTargetKind =
  | "lesson"
  | "flashcard"
  | "question"
  | "blog"
  | "cat"
  | "hub";

/**
 * A declared link target in the registry.
 * All hrefs are root-relative (no locale prefix) and point to canonical paths.
 */
export type LinkTarget = {
  kind: LinkTargetKind;
  /** Canonical topic key (lowercase, hyphenated). Matches synonym map output. */
  topicKey: string;
  /** Root-relative canonical href — never locale-prefixed here. */
  href: string;
  /** Short, natural anchor text (template — may use {{topic}} placeholder). */
  anchorText: string;
  /** Alternate natural anchors for variation. */
  anchorVariants: string[];
  /** Body system for secondary matching (e.g. "cardiovascular"). */
  bodySystem?: string;
  /** Exam family this target is scoped to (e.g. "NCLEX-RN"). Null = shared. */
  examFamily?: string | null;
  /** Pathway ID for lesson/flashcard targets. Null = shared. */
  pathwayId?: string | null;
  /**
   * Whether this target is known to be published and non-empty.
   * Registry entries default to true; DB-resolved entries can override.
   */
  eligible?: boolean;
};

// ── Context ───────────────────────────────────────────────────────────────────

/** Pathway coordinates — must match ExamPathwayDefinition fields. */
export type PathwayRef = {
  countrySlug: string;
  roleTrack: string;
  examCode: string;
  /** Canonical exam family string, e.g. "NCLEX-RN", "NCLEX-PN", "REx-PN". */
  examFamily?: string;
};

/**
 * Context describing the current page.
 * Pass as much as you know; the resolver tolerates partial contexts.
 */
export type LinkContext = {
  surface: LinkSurface;
  /** BCP-47 locale code. Defaults to "en". */
  locale?: string;
  /** Pathway (countrySlug/roleTrack/examCode) for pathway-scoped pages. */
  pathway?: PathwayRef;
  /**
   * Canonical topic key of the current page.
   * Run through synonymNormalize() before passing here.
   */
  topicKey?: string;
  /** Clinical body system (from lesson / question bodySystem field). */
  bodySystem?: string;
  /**
   * Additional freeform topic signals (tags, keyword cluster, etc.).
   * Used as secondary matching hints when topicKey has low registry coverage.
   */
  topicHints?: string[];
  /** Exclude these hrefs from results (e.g. the current page's own URL). */
  excludeHrefs?: string[];
};

// ── Candidates ────────────────────────────────────────────────────────────────

/**
 * Match quality of a resolved candidate.
 * - strong   — exact topic key match with pathway alignment
 * - moderate — exact topic key with no/any pathway, or synonym hint match
 * - weak     — body-system fallback only (suppressed when stronger match exists)
 */
export type MatchStrength = "strong" | "moderate" | "weak";

/** A resolved, ranked link candidate ready for rendering. */
export type LinkCandidate = {
  kind: LinkTargetKind;
  topicKey: string;
  /** Locale-prefixed href ready for use in <a href>. */
  href: string;
  /** Chosen anchor text (from anchorVariants, rotated for natural variation). */
  anchorText: string;
  /** Lower = higher priority. */
  score: number;
  /** Match quality — use this to enforce a minimum bar in the UI. */
  strength: MatchStrength;
  /** Whether this candidate matched the requested locale. */
  localeMatch: boolean;
  /** Whether this candidate matched the requested pathway. */
  pathwayMatch: boolean;
  /** Debug: how this candidate was selected. */
  debugReason?: string;
};

// ── Resolved set ─────────────────────────────────────────────────────────────

/** Per-surface bucket of resolved candidates. */
export type ResolvedLinks = {
  lessons: LinkCandidate[];
  flashcards: LinkCandidate[];
  questions: LinkCandidate[];
  blogs: LinkCandidate[];
  /** CAT / readiness page links (surface = cat_result or explicit). */
  cat: LinkCandidate[];
};
