"use client";

import { SocialStudyDashboardCard } from "@/components/student/social-study-dashboard-card";

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
