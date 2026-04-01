import { Suspense } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FreemiumQuestionPeek } from "@/components/student/freemium-question-peek";
import { QuestionBankPracticeClient } from "@/components/student/question-bank-practice-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export default async function QuestionBankPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");

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

  let pathwayOptions: { id: string; label: string }[] = [];
  let defaultPathwayId: string | null = null;
  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
    try {
      pathwayOptions = listPathwaysCompatibleWithSubscription(entitlement).map((p) => ({
        id: p.id,
        label: p.displayName,
      }));
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { learnerPath: true },
      });
      const lp = u?.learnerPath?.trim();
      defaultPathwayId =
        lp && pathwayOptions.some((o) => o.id === lp) ? lp : (pathwayOptions[0]?.id ?? null);
    } catch {
      /* optional */
    }
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
          <li>
            For a more exam-like bank session (explanations hidden until you opt in), add{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">?examShell=1</code> to this page URL, or use{" "}
            <a className="font-semibold text-primary underline" href="/app/questions?examShell=1">
              Exam-style question bank
            </a>
            .
          </li>
        </ul>
        <p className="mt-3 text-xs">
          Premium items and rationales are for individual subscriber use. Copying is limited on-screen; use{" "}
          <strong className="text-foreground">My notes</strong> for text you can print or export.
        </p>
      </aside>
      {userId ? (
        <Suspense fallback={<p className="text-sm text-muted">Loading question bank…</p>}>
          <QuestionBankPracticeClient
            userId={userId}
            userLabel={userLabel}
            protectionFlags={protectionFlags}
            pathwayOptions={pathwayOptions}
            defaultPathwayId={defaultPathwayId}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
