import type { ReactNode } from "react";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { traceLayout } from "@/build/tracing";

/** Lesson hub + detail under unprefixed marketing — keep progress→RSC refresh listener route-local. */
const MarketingDefaultLessonsSegmentLayout = traceLayout(
  import.meta,
  function MarketingDefaultLessonsSegmentLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <PathwayLessonProgressRefreshListener />
        {children}
      </>
    );
  },
  { name: "MarketingDefaultLessonsSegmentLayout" },
);

export default MarketingDefaultLessonsSegmentLayout;
