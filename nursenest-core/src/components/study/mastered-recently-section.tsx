/**
 * MasteredRecentlySection
 *
 * Encouragement section showing stable, well-retained items.
 * Calming, positive tone — contrasts with the urgency of other sections.
 * Shows a compact grid of mastered items with topic + recent correct streak.
 *
 * Server Component — data pre-loaded.
 */

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { UnifiedReviewItem } from "@/lib/study/unified-review-types";

// ── Single mastered chip ──────────────────────────────────────────────────────

function MasteredChip({ item }: { item: UnifiedReviewItem }) {
  const displayName =
    item.kind === "question"
      ? item.topic ?? "Practice question"
      : item.title;

  return (
    <Link
      href={item.drillHref}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:opacity-85 focus-visible:outline-none focus-visible:ring-2"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-success, #22c55e) 8%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 22%, var(--border-subtle, var(--theme-border)))",
        color: "var(--semantic-success, #22c55e)",
      }}
      title={`${displayName} — ${item.dueLabel}`}
    >
      <CheckCircle2 className="h-3 w-3 flex-shrink-0" aria-hidden />
      <span className="line-clamp-1 max-w-[12rem]">{displayName}</span>
    </Link>
  );
}

// ── MasteredRecentlySection ───────────────────────────────────────────────────

interface MasteredRecentlySectionProps {
  items: UnifiedReviewItem[];
  /** Maximum items to show before collapsing (default 12). */
  maxVisible?: number;
}

export function MasteredRecentlySection({
  items,
  maxVisible = 12,
}: MasteredRecentlySectionProps) {
  if (items.length === 0) return null;

  const visible = items.slice(0, maxVisible);
  const hiddenCount = Math.max(0, items.length - maxVisible);

  return (
    <section
      className="overflow-hidden rounded-2xl"
      aria-labelledby="mastered-heading"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-success, #22c55e) 4%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 18%, var(--border-subtle, var(--theme-border)))",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
        <Sparkles
          className="mt-0.5 h-5 w-5 flex-shrink-0"
          aria-hidden="true"
          style={{ color: "var(--semantic-success, #22c55e)" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h2
              id="mastered-heading"
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              Mastered Recently
            </h2>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                background:
                  "color-mix(in srgb, var(--semantic-success, #22c55e) 15%, var(--bg-card))",
                border:
                  "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 28%, var(--border-subtle))",
                color: "var(--semantic-success, #22c55e)",
              }}
            >
              {items.length}
            </span>
          </div>
          <p
            className="mt-0.5 text-xs leading-snug"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            Well retained — you answered these confidently. Revisit occasionally to maintain long-term recall.
          </p>
        </div>
      </div>

      {/* Chip grid */}
      <div
        className="border-t px-4 pb-5 pt-3 sm:px-5"
        style={{
          borderColor:
            "color-mix(in srgb, var(--semantic-success, #22c55e) 14%, var(--border-subtle))",
        }}
      >
        <div className="flex flex-wrap gap-2">
          {visible.map((item) => (
            <MasteredChip key={item.id} item={item} />
          ))}
        </div>
        {hiddenCount > 0 ? (
          <p
            className="mt-3 text-xs"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            and {hiddenCount} more stable item{hiddenCount !== 1 ? "s" : ""}
          </p>
        ) : null}
      </div>
    </section>
  );
}
