"use client";

import { useEffect, useState } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  PATHWAY_LESSON_PROGRESS_EVENT,
  type PathwayLessonProgressEventDetail,
} from "@/lib/lessons/pathway-lesson-progress-events";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";

export function PathwayLessonProgressBadgeLive({
  pathwayId,
  lessonSlug,
  initial,
  className = "",
}: {
  pathwayId: string;
  lessonSlug: string;
  initial: PathwayLessonProgressStatus;
  className?: string;
}) {
  const [status, setStatus] = useState(initial);

  useEffect(() => {
    setStatus(initial);
  }, [initial]);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const d = (e as CustomEvent<PathwayLessonProgressEventDetail>).detail;
      if (d?.pathwayId === pathwayId && d?.lessonSlug === lessonSlug) setStatus(d.status);
    };
    window.addEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
    return () => window.removeEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
  }, [pathwayId, lessonSlug]);

  return <PathwayLessonProgressBadge status={status} className={className} />;
}
