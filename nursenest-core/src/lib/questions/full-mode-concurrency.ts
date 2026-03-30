/**
 * Best-effort per-process limiter for expensive `mode=full` question list fetches.
 * In serverless multi-instance deployments each instance has its own counter; still caps per-instance spikes.
 */
const activeByUser = new Map<string, number>();

const MAX_CONCURRENT_FULL_MODE = 2;

export function acquireQuestionFullModeSlot(userId: string): boolean {
  const n = activeByUser.get(userId) ?? 0;
  if (n >= MAX_CONCURRENT_FULL_MODE) return false;
  activeByUser.set(userId, n + 1);
  return true;
}

export function releaseQuestionFullModeSlot(userId: string): void {
  const n = activeByUser.get(userId) ?? 0;
  if (n <= 1) activeByUser.delete(userId);
  else activeByUser.set(userId, n - 1);
}
