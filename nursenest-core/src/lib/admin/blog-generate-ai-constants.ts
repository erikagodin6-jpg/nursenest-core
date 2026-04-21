/**
 * Simple AI blog generator (`/api/admin/blog/generate-ai`) — bounded batch size for one admin POST.
 * Operators run many posts in one invocation (sequential server-side work) to avoid hammering the route
 * and tripping per-request rate limits.
 */
export const ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN = 20;

/** Default pause between topics in a multi-topic run (ms). Override with `NN_ADMIN_BLOG_GENERATE_INTER_TOPIC_MS` (0 allowed). */
export function adminBlogGenerateInterTopicDelayMs(): number {
  const raw = process.env.NN_ADMIN_BLOG_GENERATE_INTER_TOPIC_MS?.trim();
  if (raw === "0") return 0;
  if (!raw) return 600;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 600;
}
