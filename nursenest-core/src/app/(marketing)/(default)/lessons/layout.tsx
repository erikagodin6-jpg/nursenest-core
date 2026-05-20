import type { ReactNode } from "react";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";

/** Lesson hub + detail under unprefixed marketing — keep progress→RSC refresh listener route-local. */
export default function MarketingDefaultLessonsSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PathwayLessonProgressRefreshListener />
      {children}
    </>
  );
}
