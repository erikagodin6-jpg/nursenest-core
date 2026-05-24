import type { Metadata } from "next";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { SocialStatKey, SocialVisibilityScope } from "@prisma/client";
import { LearnerAccountPageHero, LearnerAccountShell } from "@/components/learner-account-ui";
import { SocialStudySettingsClient } from "@/components/student/social-study-settings-client";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
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
          description="Sign in to manage friends, group codes, and social stat visibility."
        />
      </LearnerAccountShell>
    );
  }

  const [settings, code] = await Promise.all([
    prisma.socialPrivacySetting.findUnique({ where: { userId } }),
    prisma.socialInviteCode.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, displayCode: true, enabled: true },
    }),
  ]);

  return (
    <LearnerAccountShell className="space-y-8 py-2" data-testid="learner-account-social">
      <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="Social study" pathname="/app/account" />
      <LearnerAccountPageHero
        eyebrow={t("learner.account.shell.kicker")}
        title="Social study privacy"
        description="Choose whether friends, informal groups, or classrooms can see privacy-safe study ranges. No answers, notes, email, billing, or exact profile data are shared."
      />
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
