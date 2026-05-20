"use client";

import type { ReactNode } from "react";

import { useLearnerHubLgMatch } from "@/components/student/learner-dashboard-media-query";

/**
 * Mobile-only disclosure for long dashboard bands; at `lg`+ behaves like a plain wrapper (always expanded).
 */
export function LearnerDashboardMobileFold({
  summary,
  children,
  className,
}: {
  summary: string;
  children: ReactNode;
  /** Optional extra classes on the outer `details` (e.g. band spacing). */
  className?: string;
}) {
  const desktop = useLearnerHubLgMatch();

  return (
    <details className={className ?? "nn-dash-mobile-fold"} open={desktop}>
      <summary className="nn-dash-mobile-fold__summary lg:hidden">{summary}</summary>
      <div className="nn-dash-mobile-fold__panel">{children}</div>
    </details>
  );
}
