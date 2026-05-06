/**
 * Classifies blog generation / validation failures for automatic repair vs terminal failure.
 */

/** Bounded repair rounds for plan/body/publish gates (thin-body expansion may need more than one pass). */
export const MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS = 5;

/** Extra words beyond policy minimum when expanding thin bodies (substantive depth, not padding). */
export const BLOG_BODY_REPAIR_WORD_BUFFER = 150;

export type BlogRepairTerminalReason =
  | "citations"
  | "api_failure"
  | "unsupported_topic"
  | "pre_publish_blocked"
  | "blog_title_gate"
  | "unknown";

export type PipelineFailureLike = {
  stage: string;
  error: string;
  code?: string;
  /**
   * Optional structured failure details.
   * For PRE_PUBLISH_BLOCKED: `{ prePublish: { blocking: Array<{ id: string; message: string }> } }`
   * Passed from BlogArticlePipelineFailure.details so we can inspect individual issue IDs
   * instead of treating the whole block as terminal.
   */
  details?: unknown;
};

/**
 * Returns true when the error message indicates a transient provider problem
 * (rate limits, overloads, timeouts, connection resets).  These are always
 * recoverable — the admin can retry once the provider recovers.
 */
export function isTransientBlogProviderError(errorText: string): boolean {
  const m = errorText.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("rate limit") ||
    m.includes("too many requests") ||
    m.includes("throttl") ||
    m.includes("overloaded") ||
    m.includes("slow down") ||
    m.includes("resource exhausted") ||
    m.includes("temporarily unavailable") ||
    m.includes("econnreset") ||
    m.includes("socket hang up") ||
    m.includes("timed out") ||
    m.includes("timeout")
  );
}

/**
 * Pre-publish check IDs (from PrePublishCheckId) that the AI repair pipeline can
 * autonomously fix without human intervention:
 * - body length / word count → body expansion repair
 * - meta description / title → headline / meta repair
 * - excerpt → can be regenerated from body
 * - FAQ required → FAQ section repair
 * - nursing content quality → body improvement repair
 */
const RECOVERABLE_PRE_PUBLISH_IDS = new Set([
  "body",
  "body_word_count",
  "meta_description",
  "meta_title",
  "excerpt",
  "title",
  "faq_content_when_required",
  "content_nursing_implications",
  "content_clinical_mechanism",
  "primary_keyword",
  "internal_link_recommendations",
  "schema_contract_notes",
  /** Editorial / repetition gate — usually fixed by regenerating body + references. */
  "blog_content_quality_gate",
]);

/**
 * Safely extract blocking issue array from PRE_PUBLISH_BLOCKED details.
 * The details object is typed as unknown; we do defensive access.
 */
function extractPrePublishBlocking(details: unknown): Array<{ id: string }> | null {
  if (!details || typeof details !== "object") return null;
  const d = details as Record<string, unknown>;
  const pp = d.prePublish;
  if (!pp || typeof pp !== "object") return null;
  const blocking = (pp as Record<string, unknown>).blocking;
  if (!Array.isArray(blocking)) return null;
  const issues: Array<{ id: string }> = [];
  for (const b of blocking) {
    if (b !== null && typeof b === "object" && typeof (b as Record<string, unknown>).id === "string") {
      issues.push({ id: (b as Record<string, unknown>).id as string });
    }
  }
  return issues;
}

/**
 * Classify PRE_PUBLISH_BLOCKED using structured issue IDs.
 *
 * - All recoverable IDs → recoverable (AI can repair body length, meta, FAQ, etc.)
 * - Any terminal ID present → terminal (slug collision, required references, unsafe taxonomy, etc.)
 * - Empty blocking list (shouldn't happen) → treat as recoverable (publish wasn't actually blocked)
 */
function classifyPrePublishBlockedByIds(
  blocking: Array<{ id: string }>,
): { recoverable: boolean; terminalReason?: BlogRepairTerminalReason } {
  if (blocking.length === 0) return { recoverable: true };

  const hasTerminal = blocking.some((b) => !RECOVERABLE_PRE_PUBLISH_IDS.has(b.id));
  return hasTerminal
    ? { recoverable: false, terminalReason: "pre_publish_blocked" }
    : { recoverable: true };
}

/**
 * Fallback when structured details are unavailable: inspect the joined error text.
 * The error is `blocking.map(b => b.message).join("; ")` so individual messages are present.
 */
function classifyPrePublishBlockedByErrorText(
  errorLower: string,
): { recoverable: boolean; terminalReason?: BlogRepairTerminalReason } {
  const recoverableSignals = [
    "too short for publish",
    "body is too short",
    "word count",
    "meta description is missing",
    "meta description is missing or too short",
    "excerpt",
    "meta / seo title is empty",
    "missing or too short",
    "faq",
  ];
  if (recoverableSignals.some((s) => errorLower.includes(s))) {
    return { recoverable: true };
  }
  // Conservative default when we cannot identify individual issues
  return { recoverable: false, terminalReason: "pre_publish_blocked" };
}

export function classifyBlogPipelineFailureForRepair(
  f: PipelineFailureLike,
): { recoverable: boolean; terminalReason?: BlogRepairTerminalReason } {
  const code = f.code ?? "";
  const e = f.error.toLowerCase();

  // ── Citations / safety gates (always terminal) ──
  if (code === "INSUFFICIENT_CITATIONS" || f.stage === "citations") {
    return { recoverable: false, terminalReason: "citations" };
  }

  if (code === "QUALITY_GATE" || code === "OUTPUT_GATE") {
    return { recoverable: true };
  }

  /** H1/title fails section-isolated body gate (length, truncation) — admin must edit plan, not blind retry. */
  if (code === "BLOG_TITLE_BODY_GATE") {
    return { recoverable: false, terminalReason: "blog_title_gate" };
  }

  // ── PRE_PUBLISH_BLOCKED: inspect individual issue IDs when available ──
  if (code === "PRE_PUBLISH_BLOCKED") {
    const blocking = extractPrePublishBlocking(f.details);
    if (blocking !== null) {
      return classifyPrePublishBlockedByIds(blocking);
    }
    return classifyPrePublishBlockedByErrorText(e);
  }

  // ── SEO / title duplication (always recoverable — can generate distinct headline) ──
  if (code === "SEO_DUPLICATE_BLOCKED") {
    return { recoverable: true };
  }

  // ── Plan structural failures ──
  if (code === "PLAN_INVALID_JSON" || code === "PLAN_ZOD" || code === "PLAN_NORMALIZE") {
    return { recoverable: false, terminalReason: "api_failure" };
  }

  if (code === "PLAN_LONGFORM_CONTRACT") {
    return { recoverable: true };
  }

  // ── Body quality codes (from pipeline and simple-AI-draft paths) ──
  if (code === "BODY_LONGFORM_ENFORCEMENT") {
    return { recoverable: true };
  }

  // Codes set by generate-blog-ai-draft when word count / content checks fail
  if (code === "BODY_TOO_SHORT" || code === "BODY_TOO_LITTLE_CONTENT") {
    return { recoverable: true };
  }

  // ── SEO-title stage: title/headline similarity is always recoverable ──
  if (f.stage === "seo_title") {
    if (isTransientBlogProviderError(e)) return { recoverable: true };
    // Title similarity / duplicate headline — can always generate a distinct angle
    if (
      e.includes("similar") ||
      e.includes("duplicate") ||
      e.includes("existing post") ||
      e.includes("seo") ||
      e.includes("title") ||
      e.includes("h1")
    ) {
      return { recoverable: true };
    }
    return { recoverable: false, terminalReason: "unknown" };
  }

  // ── Body stage: match on error text ──
  if (f.stage === "body") {
    // Recoverable content-quality issues
    if (
      e.includes("too short") ||
      e.includes("too little content") ||
      e.includes("too little html") ||
      e.includes("after generation") ||
      e.includes("body_outline_mismatch") ||
      e.includes("body_h2_count_low") ||
      e.includes("body_main_depth_insufficient")
    ) {
      return { recoverable: true };
    }

    // Unsafe / prohibited topics (terminal — no amount of retry fixes a policy violation)
    if (
      e.includes("unsafe") ||
      e.includes("unsafe medical") ||
      e.includes("not a nursing") ||
      e.includes("unsupported") ||
      e.includes("prohibited")
    ) {
      return { recoverable: false, terminalReason: "unsupported_topic" };
    }

    // Transient provider issues — recoverable (admin can retry when provider recovers)
    if (isTransientBlogProviderError(e)) {
      return { recoverable: true };
    }

    return { recoverable: false, terminalReason: "api_failure" };
  }

  if (f.stage === "plan") {
    if (code === "PLAN_LONGFORM_CONTRACT") return { recoverable: true };
    if (isTransientBlogProviderError(e)) return { recoverable: true };
    if (e.includes("unsupported")) return { recoverable: false, terminalReason: "unsupported_topic" };
    return { recoverable: false, terminalReason: "unknown" };
  }

  if (f.stage === "persist") {
    if (code === "SEO_DUPLICATE_BLOCKED") return { recoverable: true };
    return { recoverable: false };
  }

  return { recoverable: false, terminalReason: "unknown" };
}

/** Serialize repair outcome into batch item `error` for admin parsing. */
export function formatBlogBatchItemFailureMessage(params: {
  originalError: string;
  repairAttempts: number;
  terminal: boolean;
}): string {
  const t = params.terminal ? "y" : "n";
  return `[NN_REPAIR_ATTEMPTS=${params.repairAttempts}][NN_TERMINAL=${t}] ${params.originalError}`.slice(0, 4000);
}

export function parseBlogBatchItemRepairMeta(error: string | null | undefined): {
  repairAttempts: number | null;
  terminal: boolean | null;
  message: string;
} {
  if (!error) return { repairAttempts: null, terminal: null, message: "" };
  const att = /\[NN_REPAIR_ATTEMPTS=(\d+)\]/.exec(error);
  const term = /\[NN_TERMINAL=([yn])\]/.exec(error);
  const repairAttempts = att ? Number(att[1]) : null;
  const terminal = term ? term[1] === "y" : null;
  const message = error.replace(/\[NN_REPAIR_ATTEMPTS=\d+\]/, "").replace(/\[NN_TERMINAL=[yn]\]\s*/, "").trim();
  return { repairAttempts, terminal, message: message || error };
}
