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
