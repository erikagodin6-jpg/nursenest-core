"use client";

import { useLearnerHubLgMatch } from "@/components/student/learner-dashboard-media-query";
import type { LearnerDashboardHubNavItem } from "@/components/student/learner-dashboard-hub-layout";

export function LearnerDashboardHubNavIsland({
  navAriaLabel,
  navHeading,
  items,
}: {
  navAriaLabel: string;
  navHeading: string;
  items: readonly LearnerDashboardHubNavItem[];
}) {
  const desktop = useLearnerHubLgMatch();

  return (
    <details className="nn-dash-hub-nav-details min-w-0" open={desktop}>
      <summary className="nn-dash-hub-nav-details__summary lg:hidden">{navHeading}</summary>
      <nav className="nn-dash-hub-nav nn-dash-hub-nav-scroll" aria-label={navAriaLabel}>
        <p className="nn-dash-hub-nav__heading hidden lg:block">{navHeading}</p>
        <ul className="nn-dash-hub-nav__list" role="list">
          {items.map((item) => (
            <li key={item.href} className="nn-dash-hub-nav__item">
              <a className="nn-dash-hub-nav__link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
