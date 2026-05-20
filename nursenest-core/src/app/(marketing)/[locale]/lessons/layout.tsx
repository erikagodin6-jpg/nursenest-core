import type { ReactNode } from "react";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";

export default function MarketingLocaleLessonsSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PathwayLessonProgressRefreshListener />
      {children}
    </>
  );
}
