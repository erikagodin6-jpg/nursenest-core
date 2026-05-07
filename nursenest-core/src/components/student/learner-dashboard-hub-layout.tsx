import type { ReactNode } from "react";

import { LearnerDashboardHubNavIsland } from "@/components/student/learner-dashboard-hub-nav-island";

export type LearnerDashboardHubNavItem = {
  href: string;
  label: string;
};

/**
 * Dashboard-only layout: in-page section nav + main column. Same-route anchors only;
 * global learner shell keeps primary route navigation.
 */
export function LearnerDashboardHubLayout({
  navAriaLabel,
  navHeading,
  items,
  children,
}: {
  navAriaLabel: string;
  /** Visible kicker above section links (mobile + desktop). */
  navHeading: string;
  items: readonly LearnerDashboardHubNavItem[];
  children: ReactNode;
}) {
  if (items.length === 0) {
    return <div className="nn-dash-hub-main nn-dash-hub-main--solo min-w-0">{children}</div>;
  }

  return (
    <div className="nn-dash-hub-layout">
      <LearnerDashboardHubNavIsland navAriaLabel={navAriaLabel} navHeading={navHeading} items={items} />
      <div className="nn-dash-hub-main min-w-0">{children}</div>
    </div>
  );
}
