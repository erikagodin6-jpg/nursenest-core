"use client";

import { useCallback, useEffect, useRef } from "react";
import { emitPathwayLessonProgress } from "@/lib/lessons/pathway-lesson-progress-events";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import type { MedCalcCategorySlug, MedCalcTrack } from "@/lib/med-calculations/med-calculations-engine";

async function postMedCalcProgress(body: {
  track: MedCalcTrack;
  category: MedCalcCategorySlug;
  lessonSlug: string;
  action: "open" | "engage" | "complete";
}): Promise<boolean> {
  try {
    const res = await fetch("/api/med-calculations/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useMedCalcLessonProgressActions(input: {
  track: MedCalcTrack;
  category: MedCalcCategorySlug;
  lessonSlug: string;
  hasAccess: boolean;
  initialStatus: PathwayLessonProgressStatus;
}) {
  const { track, category, lessonSlug, hasAccess, initialStatus } = input;
  const openedRef = useRef(false);

  useEffect(() => {
    if (!hasAccess || openedRef.current) return;
    openedRef.current = true;
    void postMedCalcProgress({ track, category, lessonSlug, action: "open" });
  }, [track, category, lessonSlug, hasAccess]);

  const onSessionComplete = useCallback(async () => {
    if (!hasAccess) return;
    const ok = await postMedCalcProgress({ track, category, lessonSlug, action: "complete" });
    if (ok) {
      emitPathwayLessonProgress({
        pathwayId: `med-calc:${track}`,
        lessonSlug,
        status: "completed",
      });
    }
  }, [track, category, lessonSlug, hasAccess]);

  const onPracticeEngage = useCallback(async () => {
    if (!hasAccess) return;
    await postMedCalcProgress({ track, category, lessonSlug, action: "engage" });
    emitPathwayLessonProgress({
      pathwayId: `med-calc:${track}`,
      lessonSlug,
      status: "in_progress",
    });
  }, [track, category, lessonSlug, hasAccess]);

  return {
    progressStatus: initialStatus,
    onSessionComplete,
    onPracticeEngage,
  };
}
