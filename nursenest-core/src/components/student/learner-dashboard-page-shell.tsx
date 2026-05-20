import type { ReactNode } from "react";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { DashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";

type LearnerDashboardPageShellProps = {
  t: LearnerMarketingT;
  heroHeading: string;
  identity?: DashboardIdentity | null;
  context?: ReactNode;
  children: ReactNode;
  pathname?: string;
};

export function LearnerDashboardPageShell({
  t,
  heroHeading,
  identity,
  context,
  children,
  pathname = "/app",
}: LearnerDashboardPageShellProps) {
  return (
    <div
      className="nn-dash nn-dash--learner-home nn-learner-dashboard-convergence min-w-0 overflow-x-hidden"
      data-testid="learner-dashboard-shell"
      data-nn-learner-dashboard-convergence=""
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="learner-account"
      data-nn-premium-platform-module="learner-dashboard"
    >
      <div className="flex min-w-0 flex-col gap-7 sm:gap-8">
        <LearnerBreadcrumbTrail
          kind="dashboard"
          pathname={pathname}
          navClassName="nn-marketing-caption text-[var(--theme-muted-text)]"
          className="mb-0 min-h-0"
        />

        <header className="nn-dash-page-header nn-dash-page-header--compact nn-dash-page-header--learner-hub nn-learner-page-hero nn-learner-dashboard-hero nn-learner-cockpit-hero nn-product-surface-accent nn-exam-session-topbar min-w-0 shadow-[var(--semantic-shadow-soft)]">
          <div className="nn-dash-page-header__top">
            <div className="nn-dash-page-header__titles min-w-0">
              <p className="sr-only">{t("learner.studyHome.pageEyebrow")}</p>
              <div className="nn-dash-page-header__title-row">
                <h1 className="nn-dash-page-header__title">{heroHeading}</h1>
                {identity ? (
                  <div className="nn-dash-page-header__identity nn-dash-page-header__identity--inline">
                    <span className="nn-dash-page-header__pill">{identity.pill}</span>
                    <span className="nn-dash-page-header__meta">{identity.subtitle}</span>
                  </div>
                ) : null}
              </div>
              <p className="nn-dash-page-header__subtitle mt-2 max-w-prose text-pretty sm:mt-2.5">
                {t("learner.studyHome.pageSubtitle")}
              </p>
              {context ? <div className="nn-dash-page-header__context mt-1">{context}</div> : null}
            </div>
          </div>
        </header>
      </div>

      {children}
    </div>
  );
}
