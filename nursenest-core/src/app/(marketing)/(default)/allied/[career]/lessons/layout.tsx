import type { ReactNode } from "react";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { traceLayout } from "@/build/tracing";

const AlliedCareerLessonsSegmentLayout = traceLayout(
  import.meta,
  function AlliedCareerLessonsSegmentLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <PathwayLessonProgressRefreshListener />
        {children}
      </>
    );
  },
  { name: "AlliedCareerLessonsSegmentLayout" },
);

export default AlliedCareerLessonsSegmentLayout;
