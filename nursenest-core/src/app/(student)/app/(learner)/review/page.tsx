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
import { loadUnifiedReviewData } from "@/lib/study/unified-review-engine";
import { loadReviewQueueInitialData } from "@/lib/study/review-queue-data";
import { UnifiedReviewHero } from "@/components/study/unified-review-hero";
import { ReviewStartCards } from "@/components/study/review-start-cards";
import { ConceptRiskSection } from "@/components/study/concept-risk-section";
import { FlashcardReviewSection } from "@/components/study/flashcard-review-section";
import { MasteredRecentlySection } from "@/components/study/mastered-recently-section";
import { ReviewQueueClient } from "@/app/(student)/app/(learner)/review/review-queue-client";
import { ContextualPaywallCard } from "@/components/study/premium-gate";
import type { UnifiedReviewData } from "@/lib/study/unified-review-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Smart Review Queue — NurseNest",
      description:
        "Your unified spaced repetition review queue. Questions, flashcards, and high-risk concepts — all prioritised for maximum retention.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/review", routeGroup: "student.learner.review_queue" },
  );
}

function emptyUnifiedData(): UnifiedReviewData {
  return {
    summary: {
      overdueCount: 0, dueTodayCount: 0, dueSoonCount: 0, highRiskCount: 0,
      stableCount: 0, totalItems: 0, flashcardDecksWithDue: 0, topicsAtRisk: 0,
      summaryMessage:
        "Complete practice sessions or flashcard decks and your review queue will populate automatically.",
    },
    overdue: [], dueToday: [], highRisk: [], dueSoon: [], stable: [],
  };
}

export default async function ReviewQueuePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    redirect("/login?callbackUrl=/app/review");
  }

  const crumbs: BreadcrumbCrumb[] = [
    ...appShellBreadcrumbs("dashboard"),
    { name: "Smart Review", href: "/app/review" },
  ];

  const entitlement = await resolveEntitlementForPage(userId);
  const isEntitled = entitlement !== "error" && entitlement.hasAccess;

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

  // Load unified multi-source data + legacy question-tier data concurrently
  const [unified, legacyQueues] = await Promise.all([
    isDatabaseUrlConfigured()
      ? loadUnifiedReviewData(userId, entitlement)
      : emptyUnifiedData(),
    isDatabaseUrlConfigured()
      ? loadReviewQueueInitialData(userId)
      : {
          summary: {
            dueNowCount: 0, reviewSoonCount: 0, stableCount: 0,
            total: 0, overconfidenceCount: 0, uncertainCount: 0,
          },
          dueNow: { items: [], total: 0, hasMore: false },
          reviewSoon: { items: [], total: 0, hasMore: false },
          stable: { items: [], total: 0, hasMore: false },
        },
  ]);

  const hasAnyData = unified.summary.totalItems > 0;

  // Collect flashcard items across all tiers for the section
  const allFlashcardItems = [
    ...unified.overdue,
    ...unified.dueToday,
    ...unified.dueSoon,
  ].filter((i) => i.kind === "flashcard");

  return (
    <main className="space-y-6">
      <BreadcrumbTrail items={crumbs} />
      <h1 className="sr-only">Smart Review Queue</h1>

      {/* ── Hero: multi-source stats ───────────────────────────────────────── */}
      <UnifiedReviewHero summary={unified.summary} />

      {/* ── Focused session launch cards (question-tier based) ─────────────── */}
      <ReviewStartCards summary={legacyQueues.summary} />

      {/* ── Flashcard decks due (SM-2 scheduled) ──────────────────────────── */}
      <FlashcardReviewSection items={allFlashcardItems} />

      {/* ── High-risk concept review (topic decay signals) ────────────────── */}
      <ConceptRiskSection items={unified.highRisk} />

      {/* ── Question review queue (all tiers, paginated) ──────────────────── */}
      {legacyQueues.summary.total > 0 ? (
        <section aria-label="Question review queue">
          <h2
            className="mb-3 text-sm font-bold"
            style={{ color: "var(--theme-heading-text, var(--foreground))" }}
          >
            Question Review Queue
          </h2>
          <ReviewQueueClient
            dueNow={legacyQueues.dueNow}
            reviewSoon={legacyQueues.reviewSoon}
            stable={legacyQueues.stable}
          />
        </section>
      ) : null}

      {/* ── Mastered recently (encouragement) ─────────────────────────────── */}
      <MasteredRecentlySection items={unified.stable} />

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!hasAnyData ? (
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
            Nothing in your review queue yet
          </p>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            Complete practice sessions, study flashcard decks, or work through the
            question bank and your personalized review queue will build automatically.
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
              href="/app/flashcards"
              className="inline-flex min-h-[2.25rem] items-center rounded-full px-5 text-sm font-semibold transition-opacity hover:opacity-85"
              style={{
                background: "var(--bg-card, var(--theme-card-bg))",
                border: "1px solid var(--border-subtle, var(--theme-border))",
                color: "var(--theme-text, var(--foreground))",
              }}
            >
              Study flashcards
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

      {/* ── Footer navigation ──────────────────────────────────────────────── */}
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
        <Link
          href="/app/account/mistakes"
          className="font-medium hover:underline"
          style={{ color: "var(--theme-primary)" }}
        >
          Mistake notebook
        </Link>
      </div>
    </main>
  );
}
