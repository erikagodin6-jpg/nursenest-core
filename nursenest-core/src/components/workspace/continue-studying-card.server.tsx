import "server-only";

import { ContinueStudyingCard } from "./continue-studying-card";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";

type Props = {
  userId: string;
  pathwayId: string | null;
  fallbackHref: string;
};

export async function ContinueStudyingCardServer({ userId, pathwayId, fallbackHref }: Props) {
  if (!userId || !isDatabaseUrlConfigured()) {
    return <ContinueStudyingCard data={null} fallbackHref={fallbackHref} />;
  }

  try {
    const entitlement = await resolveEntitlementForPage(userId);
    if (entitlement === "error" || !entitlement.hasAccess) {
      return <ContinueStudyingCard data={null} fallbackHref={fallbackHref} />;
    }

    const { loadLearnerStudyNextBlock } = await import(
      "@/lib/learner/load-learner-study-next-block"
    );
    const block = await loadLearnerStudyNextBlock(userId, entitlement);
    const cw = block?.continueWhere ?? null;

    if (!cw) {
      return <ContinueStudyingCard data={null} fallbackHref={fallbackHref} />;
    }

    const subtitle = "In progress";

    return (
      <ContinueStudyingCard
        data={{ title: cw.title, subtitle, href: cw.href }}
        fallbackHref={fallbackHref}
      />
    );
  } catch {
    return <ContinueStudyingCard data={null} fallbackHref={fallbackHref} />;
  }
}
