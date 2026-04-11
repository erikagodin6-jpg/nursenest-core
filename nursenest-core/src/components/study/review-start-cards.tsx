/**
 * ReviewStartCards
 *
 * Focused session entry cards shown below the review queue.
 * Each card launches a specific type of review session, not a random dump.
 *
 * Session types (spec Section 7):
 *   1. Fix Overconfidence    — incorrect + high confidence (highest urgency)
 *   2. Strengthen Uncertain  — correct + low confidence
 *   3. Mixed Due Review      — all due_now items
 *   4. Weak Topic Focus      — worst-performing topic (if detectable)
 *
 * Cards are only rendered when the corresponding count > 0.
 * Counts come from ReviewQueueSummary — no additional data fetching.
 *
 * This is a Server Component (links only, no client state).
 * Surfaces: each card uses a distinct semantic accent (no monochrome).
 */

import Link from "next/link";
import type { ReviewQueueSummary } from "@/lib/study/srs-scheduler";

// ── Card type ─────────────────────────────────────────────────────────────────

interface StartCard {
  title: string;
  description: string;
  cta: string;
  href: string;
  count: number;
  accentVar: string;
  bgVar: string;
  borderVar: string;
}

// ── ReviewStartCards ──────────────────────────────────────────────────────────

export function ReviewStartCards({
  summary,
  practiceBaseHref = "/app/practice",
}: {
  summary: ReviewQueueSummary;
  /** Base href for launching practice sessions. Extend with query params. */
  practiceBaseHref?: string;
}) {
  const cards: StartCard[] = [
    {
      title: "Fix Overconfidence",
      description:
        "You answered these incorrectly despite high confidence. Highest priority — correct these assumptions first.",
      cta: "Start session",
      href: `${practiceBaseHref}?mode=overconfidence`,
      count: summary.overconfidenceCount,
      accentVar: "var(--semantic-danger, #ef4444)",
      bgVar:
        "color-mix(in srgb, var(--semantic-danger, #ef4444) 6%, var(--bg-card, var(--theme-card-bg)))",
      borderVar:
        "color-mix(in srgb, var(--semantic-danger, #ef4444) 20%, var(--border-subtle, var(--theme-border)))",
    },
    {
      title: "Strengthen Uncertain",
      description:
        "Got these right but weren't confident. Reinforce them now to convert guesses into reliable recall.",
      cta: "Start session",
      href: `${practiceBaseHref}?mode=uncertain`,
      count: summary.uncertainCount,
      accentVar: "var(--semantic-chart-3, #a78bfa)",
      bgVar:
        "color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 6%, var(--bg-card, var(--theme-card-bg)))",
      borderVar:
        "color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 20%, var(--border-subtle, var(--theme-border)))",
    },
    {
      title: "Mixed Due Review",
      description:
        "All questions due now — reviewed in urgency order, from most critical to least.",
      cta: "Review all due",
      href: `${practiceBaseHref}?mode=due_now`,
      count: summary.dueNowCount,
      accentVar: "var(--semantic-warning, #f59e0b)",
      bgVar:
        "color-mix(in srgb, var(--semantic-warning, #f59e0b) 6%, var(--bg-card, var(--theme-card-bg)))",
      borderVar:
        "color-mix(in srgb, var(--semantic-warning, #f59e0b) 20%, var(--border-subtle, var(--theme-border)))",
    },
    {
      title: "Review Soon",
      description:
        "Items approaching their next review window. Get ahead of forgetting before they become urgent.",
      cta: "Preview session",
      href: `${practiceBaseHref}?mode=review_soon`,
      count: summary.reviewSoonCount,
      accentVar: "var(--semantic-info, #38bdf8)",
      bgVar:
        "color-mix(in srgb, var(--semantic-info, #38bdf8) 6%, var(--bg-card, var(--theme-card-bg)))",
      borderVar:
        "color-mix(in srgb, var(--semantic-info, #38bdf8) 20%, var(--border-subtle, var(--theme-border)))",
    },
  ].filter((c) => c.count > 0);

  if (cards.length === 0) return null;

  return (
    <section aria-labelledby="review-sessions-heading">
      <h2
        id="review-sessions-heading"
        className="mb-3 text-sm font-bold"
        style={{ color: "var(--theme-heading-text, var(--foreground))" }}
      >
        Start a focused session
      </h2>

      <div
        className={`grid gap-3 ${
          cards.length === 1
            ? "grid-cols-1"
            : cards.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 overflow-hidden rounded-2xl p-5"
            style={{
              background: card.bgVar,
              border: `1px solid ${card.borderVar}`,
            }}
          >
            {/* Count badge */}
            <span
              className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{
                background: `color-mix(in srgb, ${card.accentVar} 15%, var(--bg-card, var(--theme-card-bg)))`,
                color: card.accentVar,
                border: `1px solid color-mix(in srgb, ${card.accentVar} 30%, var(--border-subtle, var(--theme-border)))`,
              }}
            >
              {card.count} question{card.count !== 1 ? "s" : ""}
            </span>

            {/* Title + description */}
            <div className="flex-1">
              <p
                className="text-sm font-bold leading-snug"
                style={{ color: "var(--theme-heading-text, var(--foreground))" }}
              >
                {card.title}
              </p>
              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
              >
                {card.description}
              </p>
            </div>

            {/* CTA */}
            <Link
              href={card.href}
              className="inline-flex min-h-[2.25rem] items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: card.accentVar,
                color: "var(--theme-primary-foreground, #fff)",
              }}
            >
              {card.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
