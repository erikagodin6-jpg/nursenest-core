import type { ReactNode } from "react";
import { traceLayout } from "@/build/tracing";
import "@/app/learner-exam-session-premium.css";
import "@/app/learner-flashcard-premium.css";

/** Segment-level dynamic: question bank stays request-time (no static prerender at build). */
export const dynamic = "force-dynamic";

const AppQuestionsSegmentLayout = traceLayout(
  import.meta,
  function AppQuestionsSegmentLayout({ children }: { children: ReactNode }) {
    return children;
  },
  { name: "AppQuestionsSegmentLayout" },
);

export default AppQuestionsSegmentLayout;
