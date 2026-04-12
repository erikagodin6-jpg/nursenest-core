/**
 * Publish workflow lifecycle for localized blog articles.
 *
 * Manages the state machine from AI_GENERATED through editorial review
 * to PUBLISHED or REJECTED. Enforces that content cannot be auto-published
 * from raw AI output without passing through a review gate.
 */

/**
 * Mirrors the Prisma `LocalizedBlogStatus` enum.
 * After running `prisma generate` you can import from `@prisma/client` instead.
 */
export type LocalizedBlogStatusLiteral =
  | "DRAFT"
  | "AI_GENERATED"
  | "AI_ADAPTED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "REJECTED";

// ── State machine ────────────────────────────────────────────────────────────

type StatusTransition = {
  from: LocalizedBlogStatusLiteral;
  to: LocalizedBlogStatusLiteral;
  action: string;
  requiresReview: boolean;
};

const ALLOWED_TRANSITIONS: StatusTransition[] = [
  { from: "DRAFT", to: "AI_GENERATED", action: "generate", requiresReview: false },
  { from: "DRAFT", to: "PENDING_REVIEW", action: "submit_for_review", requiresReview: false },
  { from: "AI_GENERATED", to: "AI_ADAPTED", action: "adapt", requiresReview: false },
  { from: "AI_GENERATED", to: "PENDING_REVIEW", action: "submit_for_review", requiresReview: false },
  { from: "AI_ADAPTED", to: "PENDING_REVIEW", action: "submit_for_review", requiresReview: false },
  { from: "PENDING_REVIEW", to: "APPROVED", action: "approve", requiresReview: true },
  { from: "PENDING_REVIEW", to: "REJECTED", action: "reject", requiresReview: true },
  { from: "APPROVED", to: "SCHEDULED", action: "schedule", requiresReview: false },
  { from: "APPROVED", to: "PUBLISHED", action: "publish_now", requiresReview: false },
  { from: "SCHEDULED", to: "PUBLISHED", action: "promote", requiresReview: false },
  { from: "SCHEDULED", to: "APPROVED", action: "unschedule", requiresReview: false },
  { from: "PUBLISHED", to: "DRAFT", action: "unpublish", requiresReview: false },
  { from: "REJECTED", to: "DRAFT", action: "revert_to_draft", requiresReview: false },
  { from: "REJECTED", to: "AI_GENERATED", action: "regenerate", requiresReview: false },
];

export type TransitionAction =
  | "generate"
  | "adapt"
  | "submit_for_review"
  | "approve"
  | "reject"
  | "schedule"
  | "publish_now"
  | "promote"
  | "unschedule"
  | "unpublish"
  | "revert_to_draft"
  | "regenerate";

/**
 * Check whether a status transition is allowed.
 */
export function isTransitionAllowed(from: LocalizedBlogStatusLiteral, action: TransitionAction): boolean {
  return ALLOWED_TRANSITIONS.some((t) => t.from === from && t.action === action);
}

/**
 * Get the target status for a transition action from the current status.
 * Returns undefined if the transition is not allowed.
 */
export function getTransitionTarget(
  from: LocalizedBlogStatusLiteral,
  action: TransitionAction,
): LocalizedBlogStatusLiteral | undefined {
  const transition = ALLOWED_TRANSITIONS.find((t) => t.from === from && t.action === action);
  return transition?.to;
}

/**
 * Get all allowed actions from a given status.
 */
export function getAllowedActions(from: LocalizedBlogStatusLiteral): TransitionAction[] {
  return ALLOWED_TRANSITIONS
    .filter((t) => t.from === from)
    .map((t) => t.action as TransitionAction);
}

// ── Publish gate ─────────────────────────────────────────────────────────────

export type PublishGateResult = {
  allowed: boolean;
  blockers: string[];
};

/**
 * Evaluate whether a localized article is ready for publication.
 * Checks review flags, content completeness, and workflow state.
 */
export function evaluatePublishGate(params: {
  contentStatus: LocalizedBlogStatusLiteral;
  complianceReviewRequired: boolean;
  medicalReviewRequired: boolean;
  editorialReviewRequired: boolean;
  reviewFlags: string[];
  hasTitle: boolean;
  hasBody: boolean;
  hasSlug: boolean;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
}): PublishGateResult {
  const blockers: string[] = [];

  // Status must be APPROVED or SCHEDULED
  if (params.contentStatus !== "APPROVED" && params.contentStatus !== "SCHEDULED") {
    blockers.push(`Content status is "${params.contentStatus}" — must be APPROVED or SCHEDULED to publish`);
  }

  // Required content
  if (!params.hasTitle) blockers.push("Missing localized title");
  if (!params.hasBody) blockers.push("Missing localized body");
  if (!params.hasSlug) blockers.push("Missing localized slug");

  // Review gates
  if (params.complianceReviewRequired) {
    blockers.push("Compliance review required — article contains regulatory/immigration/legal claims");
  }
  if (params.medicalReviewRequired) {
    blockers.push("Medical review required — article contains medical guidance");
  }

  // Must-review flags
  const mustReviewFlags = params.reviewFlags.filter((f) => f.includes("[regulatory]") || f.includes("[medical]") || f.includes("[immigration]") || f.includes("[legal]"));
  if (mustReviewFlags.length > 0) {
    blockers.push(`${mustReviewFlags.length} review flag(s) require resolution before publish`);
  }

  return { allowed: blockers.length === 0, blockers };
}

// ── Promotion (scheduled → published) ────────────────────────────────────────

/**
 * Check if a scheduled localized article should be promoted to published.
 */
export function shouldPromoteScheduled(scheduledAt: Date | null, now: Date = new Date()): boolean {
  if (!scheduledAt) return false;
  return scheduledAt.getTime() <= now.getTime();
}

// ── Generation log entry ─────────────────────────────────────────────────────

export type GenerationLogEntry = {
  timestamp: string;
  action: TransitionAction | "validation" | "error";
  detail: string;
  user?: string;
};

export function createLogEntry(
  action: GenerationLogEntry["action"],
  detail: string,
  user?: string,
): GenerationLogEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    detail,
    user,
  };
}

/**
 * Append an entry to the generation log JSON array.
 */
export function appendGenerationLog(
  existingLog: unknown,
  entry: GenerationLogEntry,
): GenerationLogEntry[] {
  const parsed = Array.isArray(existingLog) ? (existingLog as GenerationLogEntry[]) : [];
  return [...parsed, entry];
}
