import type { ReactNode } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { DashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";

type LearnerDashboardPageShellProps = {
  crumbs: BreadcrumbCrumb[];
  t: LearnerMarketingT;
  heroHeading: string;
  identity?: DashboardIdentity | null;
  context?: ReactNode;
  children: ReactNode;
};

export function LearnerDashboardPageShell({
  crumbs,
  t,
  heroHeading,
  identity,
  context,
  children,
}: LearnerDashboardPageShellProps) {
  return (
    <div className="nn-dash nn-dash--learner-home min-w-0 overflow-x-hidden" data-testid="learner-dashboard-shell">
      <BreadcrumbTrail items={crumbs} />

      <header className="nn-dash-page-header nn-dash-page-header--compact nn-dash-page-header--learner-hub">
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
            <p className="nn-dash-page-header__subtitle">{t("learner.studyHome.pageSubtitle")}</p>
            {context ? <div className="nn-dash-page-header__context">{context}</div> : null}
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
