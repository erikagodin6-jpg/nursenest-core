/**
 * User-facing hints when OpenAI returns billing / quota errors (blog & fetch paths).
 */

const OPENROUTER_SETUP_HINT =
  "For blog and OpenAI-compatible content generation, set AI_PROVIDER=openrouter (or BLOG_AI_PROVIDER=openrouter) with OPENROUTER_API_KEY and OPENROUTER_MODEL.";

function looksLikeInsufficientQuota(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("insufficient_quota") ||
    m.includes("billing_hard_limit_reached") ||
    m.includes("you exceeded your current quota")
  );
}

/** If `err` looks like an OpenAI quota/billing failure, append setup guidance. */
export function appendOpenRouterHintIfQuotaError(err: unknown): Error {
  const base = err instanceof Error ? err : new Error(String(err));
  const msg = base.message || "";
  if (!looksLikeInsufficientQuota(msg)) {
    return base instanceof Error ? base : new Error(msg);
  }
  if (msg.includes("AI_PROVIDER=openrouter") || msg.includes("BLOG_AI_PROVIDER=openrouter")) {
    return base instanceof Error ? base : new Error(msg);
  }
  return new Error(`${msg} ${OPENROUTER_SETUP_HINT}`);
}

export { OPENROUTER_SETUP_HINT };
