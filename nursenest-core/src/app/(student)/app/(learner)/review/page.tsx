import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { loadReviewQueueInitialData } from "@/lib/study/review-queue-data";
import { ReviewQueueHero } from "@/components/study/review-queue-hero";
import { ReviewStartCards } from "@/components/study/review-start-cards";
import { ReviewQueueClient } from "@/app/(student)/app/(learner)/review/review-queue-client";
import { ContextualPaywallCard } from "@/components/study/premium-gate";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Review Queue — NurseNest",
      description:
        "Your spaced repetition review queue. Focus on what you need to review most.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/review", routeGroup: "student.learner.review_queue" },
  );
}

export default async function ReviewQueuePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    redirect("/login?callbackUrl=/app/review");
  }

  const crumbs: BreadcrumbCrumb[] = [
    ...appShellBreadcrumbs("dashboard"),
    { name: "Review Queue", href: "/app/review" },
  ];

  // Gate: check entitlement
  const entitlement = await resolveEntitlementForPage(userId);
  const isEntitled =
    entitlement !== "error" && entitlement.hasAccess;

  if (!isEntitled) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <div className="mx-auto max-w-2xl">
          <ContextualPaywallCard context="smart_review" />
        </div>
      </main>
    );
  }

  // Load initial data (first page of each tier + summary)
  const data = isDatabaseUrlConfigured()
    ? await loadReviewQueueInitialData(userId)
    : {
        summary: {
          dueNowCount: 0,
          reviewSoonCount: 0,
          stableCount: 0,
          total: 0,
          overconfidenceCount: 0,
          uncertainCount: 0,
        },
        dueNow: { items: [], total: 0, hasMore: false },
        reviewSoon: { items: [], total: 0, hasMore: false },
        stable: { items: [], total: 0, hasMore: false },
      };

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />

      {/* Page heading (screen-reader only — hero provides the visual heading) */}
      <h1 className="sr-only">Review Queue</h1>

      {/* Hero — summary stats */}
      <ReviewQueueHero summary={data.summary} />

      {/* Focused session entry cards */}
      <ReviewStartCards summary={data.summary} />

      {/* Queue sections (client for interactivity + load-more) */}
      <ReviewQueueClient
        dueNow={data.dueNow}
        reviewSoon={data.reviewSoon}
        stable={data.stable}
      />

      {/* Empty state guidance */}
      {data.summary.total === 0 ? (
        <div
          className="rounded-2xl px-6 py-8 text-center"
          style={{
            background:
              "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))",
            border: "1px solid var(--border-subtle, var(--theme-border))",
          }}
        >
          <p
            className="text-base font-semibold"
            style={{ color: "var(--theme-heading-text, var(--foreground))" }}
          >
            No review history yet
          </p>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            Complete practice sessions or exams and your review queue will
            populate automatically based on your performance.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/app/practice"
              className="inline-flex min-h-[2.25rem] items-center rounded-full px-5 text-sm font-semibold transition-opacity hover:opacity-85"
              style={{
                background: "var(--theme-primary)",
                color: "var(--theme-primary-foreground, #fff)",
              }}
            >
              Start a practice session
            </Link>
            <Link
              href="/app/lessons"
              className="inline-flex min-h-[2.25rem] items-center rounded-full px-5 text-sm font-semibold transition-opacity hover:opacity-85"
              style={{
                background: "var(--bg-card, var(--theme-card-bg))",
                border: "1px solid var(--border-subtle, var(--theme-border))",
                color: "var(--theme-text, var(--foreground))",
              }}
            >
              Browse lessons
            </Link>
          </div>
        </div>
      ) : null}

      {/* Footer nav */}
      <div className="flex flex-wrap justify-center gap-4 pb-2 text-xs">
        <Link
          href="/app"
          className="font-medium hover:underline"
          style={{ color: "var(--theme-primary)" }}
        >
          ← Dashboard
        </Link>
        <Link
          href="/app/practice"
          className="font-medium hover:underline"
          style={{ color: "var(--theme-primary)" }}
        >
          Practice questions
        </Link>
        <Link
          href="/app/flashcards"
          className="font-medium hover:underline"
          style={{ color: "var(--theme-primary)" }}
        >
          Flashcard review
        </Link>
      </div>
    </main>
  );
}
