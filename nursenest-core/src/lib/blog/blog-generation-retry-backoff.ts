/**
 * Pure backoff helper for {@link BlogArticleGenerationJob} retries — importable from tests without loading Prisma.
 */
export function computeBlogGenerationJobRetryBackoffMs(retryCount: number): number {
  const base = 60_000;
  return Math.min(base * Math.pow(2, Math.min(Math.max(0, retryCount), 10)), 24 * 60 * 60_000);
}
