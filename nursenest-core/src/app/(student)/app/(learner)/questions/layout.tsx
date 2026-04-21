import type { ReactNode } from "react";

/** Segment-level dynamic: question bank stays request-time (no static prerender at build). */
export const dynamic = "force-dynamic";

export default function AppQuestionsSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
