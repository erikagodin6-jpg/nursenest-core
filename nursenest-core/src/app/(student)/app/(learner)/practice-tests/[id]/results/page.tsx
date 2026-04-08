import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PracticeTestStatus } from "@prisma/client";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  PracticeTestResultsStatic,
  type PracticeTestIncorrectReviewItem,
} from "@/components/student/practice-test-results-static";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

function stemPreview(stem: string, max = 160): string {
  const t = stem.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max).trim()}…`;
}

const RESULTS_CRUMBS = [
  { name: "Home", href: "/" as const },
  { name: "Practice tests", href: "/app/practice-tests" as const },
  { name: "Results", href: undefined as undefined },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
    title: "Practice test results | NurseNest",
  };
}

export default async function PracticeTestResultsPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const { t, locale } = await getLearnerMarketingBundle();
  const localeTag = locale.replace(/_/g, "-");

  if (entitlement === "error") {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
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
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <h1 className="text-2xl font-bold">Practice test results</h1>
        <p className="mt-2 text-sm text-muted">Subscribe to view saved results.</p>
        <div className="mt-6">
          <SubscriptionPaywall context="questions" freemiumRemainingQuestions={snap?.questionRemaining ?? 0} />
        </div>
      </main>
    );
  }

  const row = await prisma.practiceTest.findFirst({
    where: { id, userId },
    select: {
      status: true,
      title: true,
      results: true,
      config: true,
      completedAt: true,
    },
  });

  if (!row) notFound();

  if (row.status === PracticeTestStatus.IN_PROGRESS) {
    redirect(`/app/practice-tests/${id}`);
  }

  if (row.status === PracticeTestStatus.ABANDONED) {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <h1 className="text-2xl font-bold">Practice test results</h1>
        <p className="mt-3 text-sm text-muted-foreground">This session was abandoned. Start a new practice test anytime.</p>
        <Link href="/app/practice-tests" className="mt-6 inline-block text-sm font-semibold text-primary underline">
          Back to practice tests
        </Link>
      </main>
    );
  }

  const results = row.results as PracticeTestResultsJson | null;
  if (!results) {
    return (
      <main>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <p className="nn-card p-6 text-sm text-muted-foreground">
          Results are not available for this test. Open the test page to continue or review.
        </p>
        <Link href={`/app/practice-tests/${id}`} className="mt-4 inline-block text-sm font-semibold text-primary underline">
          Open test
        </Link>
      </main>
    );
  }

  const cfg = row.config as PracticeTestConfigJson | null;
  const completedAtLabel =
    row.completedAt != null
      ? row.completedAt.toLocaleString(localeTag, { dateStyle: "medium", timeStyle: "short" })
      : "—";

  let incorrectReviewItems: PracticeTestIncorrectReviewItem[] = [];
  const missedIds = results.incorrectQuestionIds;
  if (missedIds?.length && isDatabaseUrlConfigured()) {
    try {
      const rows = await prisma.examQuestion.findMany({
        where: { id: { in: missedIds } },
        select: { id: true, stem: true, topic: true },
      });
      const byId = new Map(rows.map((r) => [r.id, r]));
      incorrectReviewItems = missedIds
        .map((qid) => {
          const r = byId.get(qid);
          if (!r) return null;
          return {
            id: r.id,
            stemPreview: stemPreview(r.stem),
            topic: r.topic,
          };
        })
        .filter((x): x is PracticeTestIncorrectReviewItem => x != null);
    } catch {
      incorrectReviewItems = [];
    }
  }

  return (
    <main>
      <div className="mb-4">
        <BreadcrumbTrail items={RESULTS_CRUMBS} />
      </div>
      <h1 className="text-2xl font-bold">Practice test results</h1>
      <p className="mt-1 text-sm text-muted">
        <Link className="font-medium text-primary underline" href={`/app/practice-tests/${id}`}>
          Back to session
        </Link>{" "}
        ·{" "}
        <Link className="font-medium text-primary underline" href="/app/practice-tests">
          All tests
        </Link>
      </p>
      <div className="mt-6">
        <PracticeTestResultsStatic
          testId={id}
          title={row.title}
          results={results}
          config={cfg}
          completedAtLabel={completedAtLabel}
          incorrectReviewItems={incorrectReviewItems}
        />
      </div>
    </main>
  );
}
