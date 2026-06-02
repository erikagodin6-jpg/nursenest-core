import type { Metadata } from "next";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { SocialStatKey, SocialVisibilityScope } from "@prisma/client";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { ReferralDashboardCard } from "@/components/referrals/referral-dashboard-card";
import { SocialStudySettingsClient } from "@/components/student/social-study-settings-client";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loadReferralDashboard } from "@/lib/referrals/referral-rewards";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Social study privacy | NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/social", routeGroup: "student.learner.account_social" },
  );
}

export default async function AccountSocialPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.social");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Social study");

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <LearnerAccountShell className="space-y-8 py-2">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="Social study" pathname="/app/account" />
        <LearnerAccountPageHero
          eyebrow={t("learner.account.shell.kicker")}
          title="Social study privacy"
          description="We are checking your learner session. Return to the study hub and try again if this does not refresh."
        />
      </LearnerAccountShell>
    );
  }

  const [settings, code, referralDashboard] = await Promise.all([
    prisma.socialPrivacySetting.findUnique({ where: { userId } }),
    prisma.socialInviteCode.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, displayCode: true, enabled: true },
    }),
    loadReferralDashboard(userId),
  ]);

  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-social">
      <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="Social study" pathname="/app/account" />
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title="Social study privacy"
        description="Invite friends, manage privacy-safe study comparisons, and create challenges. Rewards are only granted after referred learners verify, onboard, and begin studying."
      />
      <ReferralDashboardCard dashboard={referralDashboard} />
      <SocialStudySettingsClient
        initialSettings={{
          socialEnabled: settings?.socialEnabled ?? false,
          statsHidden: settings?.statsHidden ?? true,
          visibilityScope: settings?.visibilityScope ?? SocialVisibilityScope.PRIVATE,
          visibleStatKeys: settings?.visibleStatKeys ?? ([] as SocialStatKey[]),
          pausedUntil: settings?.pausedUntil?.toISOString() ?? null,
          leaderboardOptIn: settings?.leaderboardOptIn ?? false,
          allowFriendChallenges: settings?.allowFriendChallenges ?? false,
          allowGroupChallenges: settings?.allowGroupChallenges ?? false,
        }}
        initialCode={code}
      />
    </LearnerAccountShell>
  );
}
