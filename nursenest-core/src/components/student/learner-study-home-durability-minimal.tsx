import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { DashboardIdentity } from "@/lib/learner/resolve-dashboard-identity";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { LearnerStudySurfaceSection } from "@/components/learner-ui";
import { LearnerDashboardPageShell } from "@/components/student/learner-dashboard-page-shell";
import { LearnerDashboardUserPanelBand } from "@/components/student/learner-dashboard-user-panel-band";

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
  entitlement,
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
  entitlement: AccessScope;
  banner: "degraded" | "error_fallback";
  showShell?: boolean;
}) {
  const notice =
    banner === "degraded"
      ? t("learner.durability.minimalNoticeDegraded")
      : t("learner.durability.minimalNoticeErrorFallback");

  const content = (
    <>
      <LearnerDashboardUserPanelBand
        t={t}
        locale={locale}
        pathwayId={pathwayId}
        examsNavLabel={examsNavLabel}
        entitlement={entitlement}
        includeStudyShortcuts
      />

      <LearnerStudySurfaceSection
        id="durability-notice"
        eyebrow={t("learner.studyHome.pageEyebrow")}
        title={t("learner.dashboard.title")}
        intro={null}
        tone="supportive"
        surfacePadding="md"
        className="nn-dash-band"
      >
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{notice}</p>
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
