"use client";

import { useCallback, useEffect, useRef } from "react";
import { emitPathwayLessonProgress } from "@/lib/lessons/pathway-lesson-progress-events";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

async function postClinicalSkillProgress(body: {
  skillSlug: string;
  action: "open" | "engage" | "complete";
}): Promise<boolean> {
  try {
    const res = await fetch("/api/clinical-skills/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function useClinicalSkillProgressActions(input: {
  skillSlug: string;
  userId: string | null;
  initialStatus: PathwayLessonProgressStatus;
}) {
  const { skillSlug, userId, initialStatus } = input;
  const openedRef = useRef(false);

  useEffect(() => {
    if (!userId || openedRef.current) return;
    openedRef.current = true;
    void postClinicalSkillProgress({ skillSlug, action: "open" });
  }, [skillSlug, userId]);

  const onCheckpointFinished = useCallback(
    async (score: number, total: number) => {
      if (!userId || total <= 0) return;
      const passed = score / total >= 0.7;
      if (!passed) {
        await postClinicalSkillProgress({ skillSlug, action: "engage" });
        emitPathwayLessonProgress({
          pathwayId: "clinical-skills",
          lessonSlug: skillSlug,
          status: "in_progress",
        });
        return;
      }
      const ok = await postClinicalSkillProgress({ skillSlug, action: "complete" });
      if (ok) {
        emitPathwayLessonProgress({
          pathwayId: "clinical-skills",
          lessonSlug: skillSlug,
          status: "completed",
        });
      }
    },
    [skillSlug, userId],
  );

  return {
    progressStatus: initialStatus,
    onCheckpointFinished,
  };
}
