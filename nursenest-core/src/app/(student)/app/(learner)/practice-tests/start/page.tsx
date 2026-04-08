import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PathwayCatSessionStartClient } from "@/components/student/pathway-cat-session-start-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  defaultPracticeTestPathwayId,
  listPathwaysCompatibleWithSubscription,
} from "@/lib/exam-pathways/pathway-entitlements";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
    title: "Start CAT practice | NurseNest",
  };
}

type Props = { searchParams: Promise<{ pathwayId?: string }> };

export default async function PathwayCatStartPage({ searchParams }: Props) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;
  const requestedPathwayId = typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 2 ? sp.pathwayId.trim() : null;

  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <h1 className="text-3xl font-bold">Pathway CAT practice</h1>
        <p className="mt-2 text-sm text-muted">Subscribe to run adaptive sessions matched to your exam track.</p>
        <div className="mt-6">
          <SubscriptionPaywall context="questions" freemiumRemainingQuestions={snap?.questionRemaining ?? 0} />
        </div>
      </main>
    );
  }

  const compatiblePathways = listPathwaysCompatibleWithSubscription(entitlement);
  const learnerPathRow = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } })
    : null;
  const defaultPathwayId = defaultPracticeTestPathwayId(
    compatiblePathways,
    learnerPathRow?.learnerPath,
    entitlement.country,
  );
  const initialPathwayId =
    requestedPathwayId && compatiblePathways.some((p) => p.id === requestedPathwayId)
      ? requestedPathwayId
      : defaultPathwayId;

  const pathwayOptions = compatiblePathways.map((p) => ({
    id: p.id,
    label: `${p.shortName} — ${p.displayName}`,
    examFamily: String(p.examFamily),
  }));

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <h1 className="text-3xl font-bold">Pathway CAT practice</h1>
      <p className="mt-2 text-sm text-muted">
        Confirm the pathway and length, then start. You can switch pathways or open the full builder anytime.
      </p>
      <div className="mt-6">
        <PathwayCatSessionStartClient initialPathwayId={initialPathwayId} pathwayOptions={pathwayOptions} />
      </div>
    </main>
  );
}
