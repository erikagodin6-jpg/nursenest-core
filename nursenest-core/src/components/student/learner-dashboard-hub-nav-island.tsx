import type { LearnerDashboardHubNavItem } from "@/components/student/learner-dashboard-hub-layout";

function HubNavList({
  navAriaLabel,
  navHeading,
  items,
  showHeading,
}: {
  navAriaLabel: string;
  navHeading: string;
  items: readonly LearnerDashboardHubNavItem[];
  showHeading: boolean;
}) {
  return (
    <nav className="nn-dash-hub-nav nn-dash-hub-nav-scroll" aria-label={navAriaLabel}>
      {showHeading ? (
        <p className="nn-dash-hub-nav__heading">{navHeading}</p>
      ) : null}
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
  );
}

/**
 * Server-rendered hub nav — mobile disclosure + desktop rail without client `open` hydration flip.
 */
export function LearnerDashboardHubNavIsland({
  navAriaLabel,
  navHeading,
  items,
}: {
  navAriaLabel: string;
  navHeading: string;
  items: readonly LearnerDashboardHubNavItem[];
}) {
  return (
    <>
      <details className="nn-dash-hub-nav-details nn-dash-hub-nav-details--mobile min-w-0">
        <summary className="nn-dash-hub-nav-details__summary">{navHeading}</summary>
        <HubNavList navAriaLabel={navAriaLabel} navHeading={navHeading} items={items} showHeading={false} />
      </details>
      <div className="nn-dash-hub-nav-rail nn-dash-hub-nav-rail--desktop min-w-0">
        <HubNavList navAriaLabel={navAriaLabel} navHeading={navHeading} items={items} showHeading />
      </div>
    </>
  );
}
