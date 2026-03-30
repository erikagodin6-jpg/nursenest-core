import { Suspense } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FreemiumQuestionPeek } from "@/components/student/freemium-question-peek";
import { QuestionBankPracticeClient } from "@/components/student/question-bank-practice-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export default async function QuestionBankPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("questions")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">
          We couldn’t finish checking your subscription (database or billing lookup failed). This is not the same as “no
          plan”—refresh shortly, or sign in again if it keeps happening.
        </p>
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("questions")} />
        </div>
        <h1 className="text-3xl font-bold">Question bank</h1>
        <p className="mt-2 text-sm text-muted">
          Practice with rationales after each item, topic filters, and session-friendly review—included with an active plan.
        </p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={snap?.questionRemaining ?? 0}
          />
        </div>
        {userId && snap && snap.questionRemaining > 0 ? <FreemiumQuestionPeek /> : null}
      </main>
    );
  }

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("questions")} />
      </div>
      <h1 className="text-3xl font-bold">Question bank</h1>
      <p className="mt-2 text-sm text-muted">
        Answer MCQ and SATA items, check your work against the official key, and read rationales. Use the topic filter to drill
        weak areas. Progress for this session is saved in your browser.
      </p>
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">How to use this bank</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Select answers, then use <strong className="text-foreground">Check answer</strong> for instant feedback.</li>
          <li>Pair with <strong className="text-foreground">Practice exams</strong> when you want timed, full-set rehearsal.</li>
        </ul>
      </aside>
      {userId ? (
        <Suspense fallback={<p className="text-sm text-muted">Loading question bank…</p>}>
          <QuestionBankPracticeClient userId={userId} />
        </Suspense>
      ) : null}
    </main>
  );
}
