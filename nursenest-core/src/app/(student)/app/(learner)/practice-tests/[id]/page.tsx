import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PracticeTestRunnerClient } from "@/components/student/practice-test-runner-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

type Props = { params: Promise<{ id: string }> };

export default async function PracticeTestRunPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">
          We couldn’t finish checking your subscription. Refresh shortly, or sign in again if it keeps happening.
        </p>
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
        <h1 className="text-2xl font-bold">Practice test</h1>
        <p className="mt-2 text-sm text-muted">Timed and untimed practice tests are included with an active plan.</p>
        <div className="mt-6">
          <SubscriptionPaywall context="questions" freemiumRemainingQuestions={snap?.questionRemaining ?? 0} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <h1 className="text-2xl font-bold">Practice test</h1>
      <p className="mt-1 text-sm text-muted">
        <a className="font-medium text-primary underline" href="/app/practice-tests">
          ← Back to test bank
        </a>
      </p>
      <div className="mt-6">
        <PracticeTestRunnerClient testId={id} />
      </div>
    </main>
  );
}
