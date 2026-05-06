import type { TutoringPromptContext, TutoringRecommendation } from "@/lib/ai-tutor/types";

export type DeterministicTutoringFallback = (ctx: TutoringPromptContext) => TutoringRecommendation | null;

/**
 * Runs a ordered chain of deterministic tutors; first non-null wins.
 * Use after {@link guardTutoringEntitlementSnapshot} succeeds.
 */
export function runDeterministicTutoringFallbackChain(
  ctx: TutoringPromptContext,
  chain: readonly DeterministicTutoringFallback[],
): TutoringRecommendation | null {
  for (const step of chain) {
    const rec = step(ctx);
    if (rec) return rec;
  }
  return null;
}

/** Minimal placeholder — surfaces pathway-scoped study nudge without AI. */
export function defaultWeakTopicFallback(ctx: TutoringPromptContext): TutoringRecommendation | null {
  const topic = ctx.topicKeys[0];
  if (!topic) return null;
  const label = topic.replace(/_/g, " ");
  return {
    source: "deterministic",
    summaryLines: [
      `Review "${label}" within your active exam pathway — use linked flashcards and practice questions.`,
      "Rotate short sessions (10–20 minutes) until accuracy stabilizes.",
    ],
    suggestedHrefs: [],
    usedDeterministicFallback: true,
  };
}
