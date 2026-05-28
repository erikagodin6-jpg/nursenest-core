"use client";

import { useCallback, useEffect, useRef } from "react";
import { emitPathwayLessonProgress } from "@/lib/lessons/pathway-lesson-progress-events";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import type { LabCategorySlug, LabTrack } from "@/lib/labs/labs-engine";

async function postLabProgress(body: {
  track: LabTrack;
  category: LabCategorySlug;
  lessonSlug: string;
  action: "open" | "engage" | "complete";
}): Promise<boolean> {
  try {
    const res = await fetch("/api/labs/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useLabLessonProgressActions(input: {
  track: LabTrack;
  category: LabCategorySlug;
  lessonSlug: string;
  hasAccess: boolean;
  initialStatus: PathwayLessonProgressStatus;
}) {
  const { track, category, lessonSlug, hasAccess, initialStatus } = input;
  const openedRef = useRef(false);

  useEffect(() => {
    if (!hasAccess || openedRef.current) return;
    openedRef.current = true;
    void postLabProgress({ track, category, lessonSlug, action: "open" });
  }, [track, category, lessonSlug, hasAccess]);

  const onQuizFinished = useCallback(
    async (score: number, total: number) => {
      if (!hasAccess || total <= 0) return;
      const passed = score / total >= 0.7;
      if (!passed) {
        await postLabProgress({ track, category, lessonSlug, action: "engage" });
        emitPathwayLessonProgress({
          pathwayId: `labs:${track}`,
          lessonSlug,
          status: "in_progress",
        });
        return;
      }
      const ok = await postLabProgress({ track, category, lessonSlug, action: "complete" });
      if (ok) {
        emitPathwayLessonProgress({
          pathwayId: `labs:${track}`,
          lessonSlug,
          status: "completed",
        });
      }
    },
    [track, category, lessonSlug, hasAccess],
  );

  return {
    progressStatus: initialStatus,
    onQuizFinished,
  };
}
