import Link from "next/link";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { LearnerCoreStudyShortcuts } from "@/components/student/learner-core-study-shortcuts";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { DashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";
import { LearnerStudySurfaceSection } from "@/components/learner-ui";
import { LearnerDashboardPageShell } from "@/components/student/learner-dashboard-page-shell";

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
  showShell = true,
}: {
  crumbs: BreadcrumbCrumb[];
  t: LearnerMarketingT;
  locale: string;
  examsNavLabel: "CAT Exams" | "Exams";
  identity: DashboardIdentity;
  heroHeading: string;
  pathwayId: string | null;
  banner: "degraded" | "error_fallback";
  showShell?: boolean;
}) {
  const notice =
    banner === "degraded"
      ? t("learner.durability.minimalNoticeDegraded")
      : t("learner.durability.minimalNoticeErrorFallback");

  const content = (
    <>
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
    </>
  );

  if (!showShell) {
    return content;
  }

  return (
    <LearnerDashboardPageShell crumbs={crumbs} t={t} heroHeading={heroHeading} identity={identity}>
      {content}
    </LearnerDashboardPageShell>
  );
}
