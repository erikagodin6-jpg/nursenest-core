import type { ReactNode } from "react";
import { traceLayout } from "../../../../../build/tracing";
import "@/app/learner-exam-session-premium.css";
import "@/app/learner-loft-simulation.css";
import "@/app/learner-flashcard-premium.css";

export const dynamic = "force-dynamic";

const PracticeTestsSegmentLayout = traceLayout(
  import.meta,
  function PracticeTestsSegmentLayout({ children }: { children: ReactNode }) {
    return children;
  },
  { name: "PracticeTestsSegmentLayout" },
);

export default PracticeTestsSegmentLayout;
