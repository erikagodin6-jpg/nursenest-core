import type { ReactNode } from "react";
import "@/app/learner-exam-session-premium.css";

/** Segment-level dynamic: question bank stays request-time (no static prerender at build). */
export const dynamic = "force-dynamic";

export default function AppQuestionsSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
