import type { ReactNode } from "react";

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
      <nav className="nn-dash-hub-nav nn-dash-hub-nav-scroll" aria-label={navAriaLabel}>
        <p className="nn-dash-hub-nav__heading">{navHeading}</p>
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
      <div className="nn-dash-hub-main min-w-0">{children}</div>
    </div>
  );
}
