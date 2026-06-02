"use client";

import { useEffect } from "react";

type Props = {
  pathwayId: string;
  routePathname: string;
  topicSlug?: string | null;
  rowsReturned?: number | null;
};

export function LessonRuntimeTraceClient({
  pathwayId,
  routePathname,
  topicSlug,
  rowsReturned,
}: Props) {
  useEffect(() => {
    if (!topicSlug) return;
    console.info(
      "lesson_system_runtime_trace",
      JSON.stringify({
        step: "client_rendered",
        pathwayId,
        routePathname,
        topicSlug,
        rowsReturned: rowsReturned ?? null,
        timestampMs: Date.now(),
      }),
    );
  }, [pathwayId, routePathname, rowsReturned, topicSlug]);

  return null;
}
