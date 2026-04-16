import Link from "next/link";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { LearnerCoreStudyShortcuts } from "@/components/student/learner-core-study-shortcuts";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { DashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";
import { LearnerStudySurfaceSection } from "@/components/learner-ui";

/**
 * Minimal study hub when durability flags skip heavy dashboard queries — keeps core links usable.
 */
export function LearnerStudyHomeDurabilityMinimal({
  crumbs,
  t,
  locale,
  examsNavLabel,
  identity,
  heroHeading,
  pathwayId,
  banner,
}: {
  crumbs: BreadcrumbCrumb[];
  t: LearnerMarketingT;
  locale: string;
  examsNavLabel: "CAT Exams" | "Exams";
  identity: DashboardIdentity;
  heroHeading: string;
  pathwayId: string | null;
  banner: "degraded" | "error_fallback";
}) {
  const notice =
    banner === "degraded"
      ? "Study tools stay available. Some dashboard details are temporarily simplified."
      : "We could not load your full dashboard. Your lessons, practice bank, and flashcards are still available.";

  return (
    <div className="nn-dash nn-dash--learner-home min-w-0 overflow-x-hidden">
      <BreadcrumbTrail items={crumbs} />

      <header className="nn-dash-page-header nn-dash-page-header--compact nn-dash-page-header--learner-hub">
        <div className="nn-dash-page-header__top">
          <div className="nn-dash-page-header__titles min-w-0">
            <div className="nn-dash-page-header__title-row">
              <h1 className="nn-dash-page-header__title">{heroHeading}</h1>
              <div className="nn-dash-page-header__identity nn-dash-page-header__identity--inline">
                <span className="nn-dash-page-header__pill">{identity.pill}</span>
                <span className="nn-dash-page-header__meta">{identity.subtitle}</span>
              </div>
            </div>
            <p className="nn-dash-page-header__subtitle">{t("learner.studyHome.pageSubtitle")}</p>
          </div>
        </div>
      </header>

      <LearnerStudySurfaceSection
        id="durability-notice"
        eyebrow={null}
        title="Study access"
        intro={null}
        tone="supportive"
        surfacePadding="md"
        className="nn-dash-band"
      >
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{notice}</p>
        <p className="mt-3 text-sm">
          <Link href="/app/account/overview" className="font-semibold text-[var(--semantic-brand)] hover:underline">
            Account hub
          </Link>
          <span className="text-[var(--semantic-text-secondary)]"> · </span>
          <Link href="/app/lessons" className="font-semibold text-[var(--semantic-brand)] hover:underline">
            Lessons
          </Link>
        </p>
      </LearnerStudySurfaceSection>

      <LearnerStudySurfaceSection
        id="study-core-surfaces-min"
        eyebrow={null}
        title={t("learner.studyHome.shortcutsNavLabel")}
        intro={null}
        tone="secondary"
        surfacePadding="md"
        className="nn-dash-band nn-dash-band--core-shortcuts"
      >
        <LearnerCoreStudyShortcuts pathwayId={pathwayId} examsLabel={examsNavLabel} t={t} locale={locale} />
      </LearnerStudySurfaceSection>
    </div>
  );
}
