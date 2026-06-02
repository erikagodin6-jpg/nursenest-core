import { getLessonProgressForPathwayUser } from "@/lib/lessons/get-lesson-progress-for-pathway-user";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

/** Default ceiling so optional marketing hub progress cannot block SSR indefinitely. */
export const MARKETING_HUB_PROGRESS_FETCH_TIMEOUT_MS = 12_000;

export type MarketingHubProgressFetcher = typeof getLessonProgressForPathwayUser;

/**
 * Batched pathway-lesson progress with a hard timeout — failures yield an empty map so hubs still render.
 */
export async function loadMarketingHubLessonProgressMapWithTimeout(args: {
  userId: string;
  pathwayId: string;
  lessonSlugs: readonly string[];
  timeoutMs?: number;
  /** Replace DB-backed fetch (tests, diagnostics). Defaults to {@link getLessonProgressForPathwayUser}. */
  progressFetcher?: MarketingHubProgressFetcher;
}): Promise<{ map: Record<string, PathwayLessonProgressStatus>; timedOut: boolean }> {
  const uid = args.userId.trim();
  const timeoutMs = args.timeoutMs ?? MARKETING_HUB_PROGRESS_FETCH_TIMEOUT_MS;
  const fetchProgress = args.progressFetcher ?? getLessonProgressForPathwayUser;
  if (!uid || args.lessonSlugs.length === 0) {
    return { map: {}, timedOut: false };
  }

  try {
    const map = await Promise.race([
      fetchProgress({
        userId: uid,
        pathwayId: args.pathwayId,
        lessonSlugs: [...args.lessonSlugs],
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("marketing_hub_progress_timeout")), timeoutMs);
      }),
    ]);
    return { map, timedOut: false };
  } catch {
    return { map: {}, timedOut: true };
  }
}
