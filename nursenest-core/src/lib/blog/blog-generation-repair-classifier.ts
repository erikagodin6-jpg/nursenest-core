/**
 * Classifies blog generation / validation failures for automatic repair vs terminal failure.
 */

export const MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS = 3;

/** Extra words beyond policy minimum when expanding thin bodies (substantive depth, not padding). */
export const BLOG_BODY_REPAIR_WORD_BUFFER = 150;

export type BlogRepairTerminalReason =
  | "citations"
  | "api_failure"
  | "unsupported_topic"
  | "pre_publish_blocked"
  | "unknown";

export type PipelineFailureLike = {
  stage: string;
  error: string;
  code?: string;
};

export function classifyBlogPipelineFailureForRepair(
  f: PipelineFailureLike,
): { recoverable: boolean; terminalReason?: BlogRepairTerminalReason } {
  const code = f.code ?? "";
  const e = f.error.toLowerCase();

  if (code === "INSUFFICIENT_CITATIONS" || f.stage === "citations") {
    return { recoverable: false, terminalReason: "citations" };
  }

  if (code === "PRE_PUBLISH_BLOCKED") {
    return { recoverable: false, terminalReason: "pre_publish_blocked" };
  }

  if (code === "SEO_DUPLICATE_BLOCKED") {
    return { recoverable: true };
  }

  if (code === "PLAN_INVALID_JSON" || code === "PLAN_ZOD" || code === "PLAN_NORMALIZE") {
    return { recoverable: false, terminalReason: "api_failure" };
  }

  if (code === "PLAN_LONGFORM_CONTRACT") {
    return { recoverable: true };
  }

  if (code === "BODY_LONGFORM_ENFORCEMENT") {
    return { recoverable: true };
  }

  if (f.stage === "body") {
    if (
      e.includes("too short") ||
      e.includes("after generation") ||
      e.includes("body_outline_mismatch") ||
      e.includes("body_h2_count_low") ||
      e.includes("body_main_depth_insufficient") ||
      e.includes("too little html")
    ) {
      return { recoverable: true };
    }
    if (e.includes("unsupported") || e.includes("not a nursing")) {
      return { recoverable: false, terminalReason: "unsupported_topic" };
    }
    if (e.includes("429") || e.includes("rate limit") || e.includes("overloaded")) {
      return { recoverable: false, terminalReason: "api_failure" };
    }
    return { recoverable: false, terminalReason: "api_failure" };
  }

  if (f.stage === "plan") {
    if (code === "PLAN_LONGFORM_CONTRACT") return { recoverable: true };
    if (e.includes("429") || e.includes("rate limit") || e.includes("overloaded")) {
      return { recoverable: false, terminalReason: "api_failure" };
    }
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
