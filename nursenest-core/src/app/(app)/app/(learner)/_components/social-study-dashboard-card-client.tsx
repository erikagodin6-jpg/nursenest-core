"use client";

import dynamic from "next/dynamic";

const SocialStudyDashboardCard = dynamic(
  () =>
    import("@/components/student/social-study-dashboard-card").then(
      (mod) => mod.SocialStudyDashboardCard,
    ),
  { ssr: false },
);

export function SocialStudyDashboardCardClient({
  initialCode,
  socialEnabled,
  statsHidden,
  visibilityScope,
}: {
  initialCode: string | null;
  socialEnabled: boolean;
  statsHidden: boolean;
  visibilityScope: string;
}) {
  return (
    <SocialStudyDashboardCard
      initialCode={initialCode}
      socialEnabled={socialEnabled}
      statsHidden={statsHidden}
      visibilityScope={visibilityScope}
    />
  );
}
