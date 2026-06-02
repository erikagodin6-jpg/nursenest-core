import type { ReactNode } from "react";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { traceLayout } from "@/build/tracing";

const AlliedHealthLessonsSegmentLayout = traceLayout(
  import.meta,
  function AlliedHealthLessonsSegmentLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <PathwayLessonProgressRefreshListener />
        {children}
      </>
    );
  },
  { name: "AlliedHealthLessonsSegmentLayout" },
);

export default AlliedHealthLessonsSegmentLayout;
