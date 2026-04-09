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
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export default async function QuestionBankPage() {
  const { t } = await getLearnerMarketingBundle();
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
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </main>
    );
  }

  let pathwayOptions: { id: string; label: string }[] = [];
  let pathwayExamKeysByPathwayId: Record<string, string[]> = {};
  let defaultPathwayId: string | null = null;
  if (userId && entitlement.hasAccess && isDatabaseUrlConfigured()) {
    try {
      const compatible = listPathwaysCompatibleWithSubscription(entitlement);
      pathwayOptions = compatible.map((p) => ({
        id: p.id,
        label: p.displayName,
      }));
      pathwayExamKeysByPathwayId = Object.fromEntries(compatible.map((p) => [p.id, p.contentExamKeys]));
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
        <h1 className="text-3xl font-bold">{t("learner.questions.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("learner.questions.subtitle.locked")}</p>
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
      <h1 className="text-3xl font-bold">{t("learner.questions.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("learner.questions.subtitle.subscriber")}</p>
      <aside className="nn-card mt-4 border-primary/15 bg-primary/5 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">{t("learner.questions.howTo.title")}</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>{t("learner.questions.howTo.li1")}</li>
          <li>{t("learner.questions.howTo.li2")}</li>
          <li>
            {t("learner.questions.howTo.li3a")}{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">?examShell=1</code> {t("learner.questions.howTo.li3b")}{" "}
            <a className="font-semibold text-primary underline" href="/app/questions?examShell=1">
              {t("learner.questions.howTo.examStyleLink")}
            </a>
            .
          </li>
        </ul>
        <p className="mt-3 text-xs">{t("learner.questions.howTo.footer")}</p>
        <p className="mt-3 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground">
          {t("learner.questions.howTo.integratedLoop")}
        </p>
      </aside>
      {userId ? (
        <Suspense fallback={<p className="text-sm text-muted">{t("learner.loading.questionBank")}</p>}>
          <QuestionBankPracticeClient
            userId={userId}
            userLabel={userLabel}
            protectionFlags={protectionFlags}
            pathwayOptions={pathwayOptions}
            defaultPathwayId={defaultPathwayId}
            pathwayExamKeysByPathwayId={pathwayExamKeysByPathwayId}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
