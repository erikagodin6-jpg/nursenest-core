"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PATHWAY_LESSON_PROGRESS_EVENT } from "@/lib/lessons/pathway-lesson-progress-events";
import { shouldRefreshServerAfterPathwayLessonProgress } from "@/lib/lessons/pathway-lesson-progress-refresh";

/**
 * Keeps marketing lesson hubs and /app dashboard RSC data in sync after progress changes
 * (explicit complete, undo, or conservative auto-complete on the lesson page).
 */
export function PathwayLessonProgressRefreshListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onProgress = () => {
      if (shouldRefreshServerAfterPathwayLessonProgress(pathname)) router.refresh();
    };
    window.addEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onProgress);
  }, [pathname, router]);

  return null;
}
