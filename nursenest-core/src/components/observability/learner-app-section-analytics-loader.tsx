"use client";

import dynamic from "next/dynamic";

const LearnerAppSectionAnalyticsLazy = dynamic(
  () =>
    import("@/components/observability/learner-app-section-analytics").then((m) => ({
      default: m.LearnerAppSectionAnalytics,
    })),
  { ssr: false },
);

export function LearnerAnalyticsLoader() {
  return <LearnerAppSectionAnalyticsLazy />;
}
