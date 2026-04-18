import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PracticeTestStatus } from "@prisma/client";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import {
  PracticeTestResultsStatic,
  type PracticeTestIncorrectReviewItem,
} from "@/components/student/practice-test-results-static";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadBenchmarkForReport } from "@/lib/study/benchmarking/benchmark-service";
import type { BenchmarkServiceResult } from "@/lib/study/benchmarking/benchmark-service";
import { safeAwait } from "@/lib/async/safe-await";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type Props = { params: Promise<{ id: string }> };

const PRACTICE_TEST_RESULTS_DB_TIMEOUT_MS = 1500;

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
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Practice test results | NurseNest",
    }),
    { pathname: "/app/practice-tests/[id]/results", routeGroup: "student.learner.practice_test_results" },
  );
}

export default async function PracticeTestResultsPage({ params }: Props) {
  const { id } = await params;
  const session = await getProtectedRouteSession("(student).app.(learner).practice-tests.[id].results");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const { t, locale } = await getLearnerMarketingBundle();
  const localeTag = locale.replace(/_/g, "-");

  if (entitlement === "error") {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <h1 className="text-2xl font-bold">Practice test results</h1>
        <p className="mt-2 text-sm text-muted">Subscribe to view saved results.</p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={snap != null ? snap.questionRemaining : undefined}
          />
        </div>
      </div>
    );
  }

  let rowEnvelope:
    | {
        row: Awaited<
          ReturnType<typeof prisma.practiceTest.findFirst<{
            select: {
              status: true;
              title: true;
              results: true;
              config: true;
              completedAt: true;
            };
          }>>
        >;
      }
    | null = null;
  try {
    rowEnvelope = await safeAwait(
      prisma.practiceTest
        .findFirst({
          where: { id, userId },
          select: {
            status: true,
            title: true,
            results: true,
            config: true,
            completedAt: true,
          },
        })
        .then((row) => ({ row })),
      "practice_test_results.row",
      PRACTICE_TEST_RESULTS_DB_TIMEOUT_MS,
    );
  } catch (error) {
    safeServerLog("practice_test_results", "row_load_failed", {
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 180),
    });
  }

  if (rowEnvelope === null) {
    safeServerLog("practice_test_results", "fallback_used", {
      reason: "db_timeout_or_error",
    });
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <h1 className="text-2xl font-bold">Practice test results</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Saved results are temporarily unavailable. You can reopen the session or try again shortly.
        </p>
        <p className="mt-4 text-sm text-muted">
          <Link className="font-medium text-primary underline" href={`/app/practice-tests/${id}`}>
            Back to session
          </Link>{" "}
          ·{" "}
          <Link className="font-medium text-primary underline" href="/app/practice-tests">
            All tests
          </Link>
        </p>
      </div>
    );
  }

  const { row } = rowEnvelope;

  if (!row) notFound();

  if (row.status === PracticeTestStatus.IN_PROGRESS) {
    redirect(`/app/practice-tests/${id}`);
  }

  if (row.status === PracticeTestStatus.ABANDONED) {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <h1 className="text-2xl font-bold">Practice test results</h1>
        <p className="mt-3 text-sm text-muted-foreground">This session was abandoned. Start a new practice test anytime.</p>
        <Link href="/app/practice-tests" className="mt-6 inline-block text-sm font-semibold text-primary underline">
          Back to practice tests
        </Link>
      </div>
    );
  }

  const results = row.results as PracticeTestResultsJson | null;
  if (!results) {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={RESULTS_CRUMBS} />
        </div>
        <p className="nn-card p-6 text-sm text-muted-foreground">
          Results are not available for this test. Open the test page to continue or review.
        </p>
        <Link href={`/app/practice-tests/${id}`} className="mt-4 inline-block text-sm font-semibold text-primary underline">
          Open test
        </Link>
      </div>
    );
  }

  const cfg: PracticeTestConfigJson | null =
    row.config != null
      ? parsePracticeTestConfigAtBoundary(row.config, { practiceTestId: id, surface: "practice_test_results_page" })
      : null;
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

  const weakTop = results.weakAreas?.filter(Boolean) ?? [];
  const sessionInsightStruggle =
    weakTop.length > 0
      ? t("learner.practiceTest.insight.struggle", { topics: weakTop.slice(0, 3).join(", ") })
      : null;
  const sessionInsightFocus = weakTop.length > 0 ? t("learner.practiceTest.insight.focus") : null;
  const weakFollowUpCopy =
    weakTop.length > 0
      ? {
          weakTitle: t("learner.practiceTest.results.weakTitle"),
          weakHint: t("learner.practiceTest.results.weakHint"),
          reviewLessons: t("learner.practiceTest.results.reviewLessons"),
          topicDrill: t("learner.practiceTest.results.topicDrill"),
          suggestedFollowUp: t("learner.practiceTest.results.suggestedFollowUp"),
          retestWeak: t("learner.practiceTest.results.retestWeak"),
          adaptiveSamePathway: t("learner.practiceTest.results.adaptiveSamePathway"),
        }
      : null;

  // Load pathway-aware benchmark — server-side aggregate, no user arrays to browser.
  let benchmarkResult: BenchmarkServiceResult | null = null;
  try {
    benchmarkResult = await loadBenchmarkForReport({
      userId,
      pathwayId: cfg?.pathwayId ?? null,
      userAccuracyPct: results.accuracyPct ?? null,
    });
  } catch {
    benchmarkResult = null;
  }

  return (
    <div>
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
          sessionInsightStruggle={sessionInsightStruggle}
          sessionInsightFocus={sessionInsightFocus}
          weakFollowUpCopy={weakFollowUpCopy}
          benchmarkResult={benchmarkResult}
        />
      </div>
    </div>
  );
}
