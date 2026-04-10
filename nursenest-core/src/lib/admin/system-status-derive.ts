import type { CheckStatus } from "@/lib/admin/system-status-types";

/** Lesson batch rows stuck in GENERATING past the shared stale threshold → degraded queue. */
export function deriveQueueHealthStatus(args: {
  stuckLessonBatchGenerating: number;
  prismaWarningCount: number;
}): CheckStatus {
  if (args.prismaWarningCount > 0) return "degraded";
  if (args.stuckLessonBatchGenerating > 0) return "degraded";
  return "healthy";
}

/** Optional: empty content in production may indicate a bad deploy or wrong DB — degraded, not failed. */
export function deriveContentHealthStatus(args: {
  lessonCount: number;
  questionCount: number;
  prismaWarningCount: number;
  nodeEnv: string | undefined;
}): CheckStatus {
  if (args.prismaWarningCount > 0) return "degraded";
  if (args.nodeEnv === "production" && args.lessonCount === 0 && args.questionCount === 0) {
    return "degraded";
  }
  return "healthy";
}

/** Ensure JSON detail payloads never echo raw secret material (belt-and-suspenders for tests). */
export function configDetailsLookSafe(details: Record<string, unknown>): boolean {
  const json = JSON.stringify(details);
  if (/sk_live_|sk_test_|AI_INTEGRATIONS_OPENAI_API_KEY=\S{20,}/i.test(json)) return false;
  if (/postgresql:\/\/[^"]+:[^@]+@/i.test(json)) return false;
  return true;
}
