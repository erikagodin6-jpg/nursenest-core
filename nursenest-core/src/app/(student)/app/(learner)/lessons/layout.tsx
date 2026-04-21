import type { ReactNode } from "react";

/** Segment-level dynamic: lesson hub + detail stay request-time (no static prerender at build). */
export const dynamic = "force-dynamic";

export default function AppLessonsSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
