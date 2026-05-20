import Link from "next/link";

/**
 * OptionalUpgradeCard — restrained conversion block at the bottom of results
 * (spec §9). Renders nothing when `isEntitled` is true.
 *
 * Wire `isEntitled` from the server-side entitlement check in the page
 * component (`entitlement.hasAccess`).
 */
export function OptionalUpgradeCard({
  isEntitled = true,
}: {
  isEntitled?: boolean;
}) {
  if (isEntitled) return null;

  return (
    <div className="nn-cat-results__section">
      <div className="nn-cat-upgrade-card">
        <div className="nn-cat-upgrade-card__content">
          <p className="nn-cat-upgrade-card__title">
            Keep building your readiness
          </p>
          <p className="nn-cat-upgrade-card__body">
            Unlock more CAT sessions, deeper review tools, and guided practice
            across your weakest areas.
          </p>
        </div>
        <div className="nn-cat-upgrade-card__actions">
          <Link
            href="/app/plans"
            className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none"
          >
            View plans
          </Link>
          <Link
            href="/app/lessons"
            className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold"
          >
            Continue studying
          </Link>
        </div>
      </div>
    </div>
  );
}
