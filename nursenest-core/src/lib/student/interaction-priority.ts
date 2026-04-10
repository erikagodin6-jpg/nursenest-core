export type InteractionPriority = "resume" | "weak_focus" | "review_recent" | "none";

export type InteractionPrioritySignals = {
  hasResume: boolean;
  hasWeakFocus: boolean;
  hasRecentCompletion: boolean;
};

/**
 * Resolve a single next-action emphasis winner.
 * Priority order is strict and deterministic: resume > weak_focus > review_recent > none.
 */
export function resolveInteractionPriority(signals: InteractionPrioritySignals): InteractionPriority {
  if (signals.hasResume) return "resume";
  if (signals.hasWeakFocus) return "weak_focus";
  if (signals.hasRecentCompletion) return "review_recent";
  return "none";
}

export function isPriorityWinner(priority: InteractionPriority, candidate: Exclude<InteractionPriority, "none">): boolean {
  return priority === candidate;
}

export function resolvePriorityMessage(
  priority: InteractionPriority,
  messages: Partial<Record<Exclude<InteractionPriority, "none">, string>>,
): string | null {
  if (priority === "none") return null;
  return messages[priority] ?? null;
}

export function resolvePriorityTarget<T>(
  priority: InteractionPriority,
  targets: Partial<Record<Exclude<InteractionPriority, "none">, T>>,
): T | null {
  if (priority === "none") return null;
  return targets[priority] ?? null;
}

const DEFAULT_RECENT_WINDOW_MS = 72 * 60 * 60 * 1000;

export function isWithinRecentWindow(
  isoTimestamp: string | null | undefined,
  nowMs: number,
  windowMs = DEFAULT_RECENT_WINDOW_MS,
): boolean {
  if (!isoTimestamp) return false;
  const ts = new Date(isoTimestamp).getTime();
  if (!Number.isFinite(ts)) return false;
  return nowMs - ts <= windowMs;
}

export function resolvePracticeHistoryEmphasis(
  priority: InteractionPriority,
  row: { status: string; completedAt: string | null },
  nowMs: number,
): { rowEmphasis: "resume" | "review_recent" | "none"; actionEmphasis: "resume" | "review_recent" | "none" } {
  if (row.status === "IN_PROGRESS" && priority === "resume") {
    return { rowEmphasis: "resume", actionEmphasis: "resume" };
  }
  if (row.status === "COMPLETED" && isWithinRecentWindow(row.completedAt, nowMs) && priority === "review_recent") {
    return { rowEmphasis: "review_recent", actionEmphasis: "review_recent" };
  }
  return { rowEmphasis: "none", actionEmphasis: "none" };
}
