"use client";

import Link from "next/link";
import type { DeckDisplaySource } from "@/lib/flashcards/flashcard-generation";
import { deriveDeckDisplaySource, deckSourceAccentVar } from "@/lib/flashcards/flashcard-generation";
import { formatTitleCase } from "@/lib/format/text-case";

export type DeckCardRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  tier: string;
  examFamily: string;
  pathwayId: string | null;
  visibility: string;
  cardCount: number;
  locked: boolean;
  tags?: { slug: string; name: string }[];
  due?: number;
  overdue?: number;
};

type DueBadgeProps = {
  due: number;
  overdue: number;
};

function DueBadge({ due, overdue }: DueBadgeProps) {
  if (overdue > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--semantic-danger, #ef4444) 14%, transparent)",
          color: "var(--semantic-danger, #ef4444)",
          border: "1px solid color-mix(in srgb, var(--semantic-danger, #ef4444) 22%, transparent)",
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {overdue} overdue
      </span>
    );
  }
  if (due > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--semantic-info, #38bdf8) 12%, transparent)",
          color: "var(--semantic-info-text, var(--semantic-info, #0284c7))",
          border: "1px solid color-mix(in srgb, var(--semantic-info, #38bdf8) 22%, transparent)",
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {due} due today
      </span>
    );
  }
  return null;
}

type SourceBadgeProps = { source: DeckDisplaySource };
function SourceBadge({ source }: SourceBadgeProps) {
  const accent = deckSourceAccentVar(source);
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        color: accent,
        border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
      }}
    >
      {source}
    </span>
  );
}

function ExamLabel({ examFamily, country }: { examFamily: string; country: string }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-wide"
      style={{ color: "var(--theme-muted-text)" }}
    >
      {examFamily.replace(/_/g, " ")} · {country}
    </p>
  );
}

/**
 * FlashcardDeckCard — Premium, palette-varied deck card.
 *
 * Surface: white/card bg with a soft left accent border colored by source type.
 * Visual layering:
 *   - Outer card: `--surface-emphasis` tint (soft)
 *   - Left border accent: source-type semantic color
 *   - Due badges: semantic tint chips
 */
export function FlashcardDeckCard({ deck }: { deck: DeckCardRow }) {
  const source = deriveDeckDisplaySource(deck.tags ?? [], deck.slug);
  const accentVar = deckSourceAccentVar(source);
  const due = deck.due ?? 0;
  const overdue = deck.overdue ?? 0;
  const isCoverageInProgress = !deck.locked && deck.cardCount <= 0;

  const displayTitle = formatTitleCase(deck.title);
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
      style={{
        background:
          "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary, #6366f1)) 4%, var(--bg-card, var(--theme-card-bg, #fff)))",
        border: "1px solid var(--border-subtle, var(--theme-card-border, #e5e7eb))",
        borderLeft: `3px solid ${accentVar}`,
      }}
    >
      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Top row: exam label + source badge */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ExamLabel examFamily={deck.examFamily} country={deck.country} />
          <SourceBadge source={source} />
        </div>

        {/* Title */}
        <h3
          className="text-base font-semibold leading-snug"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {displayTitle}
        </h3>

        {/* Description */}
        {deck.description ? (
          <p
            className="line-clamp-2 text-sm"
            style={{ color: "var(--theme-muted-text)" }}
          >
            {deck.description}
          </p>
        ) : null}

        {/* Tags */}
        {deck.tags && deck.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {deck.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background:
                    "color-mix(in srgb, var(--theme-primary) 8%, var(--bg-page, #f9fafb))",
                  color: "var(--theme-muted-text)",
                }}
              >
                {formatTitleCase(tag.name)}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer: card count + due badges + CTA */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3"
        style={{
          borderColor: "var(--border-subtle, var(--theme-card-border, #e5e7eb))",
          background:
            "color-mix(in srgb, var(--bg-card, var(--theme-card-bg, #fff)) 80%, transparent)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--theme-muted-text)" }}
          >
            {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
          </span>
          {isCoverageInProgress ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: "color-mix(in srgb, var(--semantic-warning) 14%, transparent)",
                color: "var(--semantic-warning)",
                border: "1px solid color-mix(in srgb, var(--semantic-warning) 24%, transparent)",
              }}
            >
              In progress
            </span>
          ) : null}
          {!deck.locked ? <DueBadge due={due} overdue={overdue} /> : null}
        </div>

        {deck.locked ? (
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition"
            style={{
              background: "var(--role-cta, var(--theme-primary))",
              color: "var(--role-cta-foreground, #fff)",
            }}
          >
            Unlock
          </Link>
        ) : isCoverageInProgress ? (
          <Link
            href="/app/questions"
            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 15%, var(--bg-card, #fff))",
              color: "var(--semantic-info-text, var(--semantic-info))",
              border: "1px solid color-mix(in srgb, var(--semantic-info) 30%, transparent)",
            }}
          >
            Use Question Bank
          </Link>
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href={`/app/flashcards/${deck.slug}?start=1&mode=learn`}
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition"
              style={{
                background: `color-mix(in srgb, ${accentVar} 18%, var(--bg-card, #fff))`,
                color: accentVar,
                border: `1px solid color-mix(in srgb, ${accentVar} 30%, transparent)`,
              }}
            >
              Learn
            </Link>
            <Link
              href={`/app/flashcards/${deck.slug}?start=1&mode=test`}
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition"
              style={{
                background:
                  "color-mix(in srgb, var(--semantic-chart-2, var(--semantic-info)) 16%, var(--bg-card, #fff))",
                color: "var(--semantic-info-text, var(--semantic-info))",
                border: "1px solid color-mix(in srgb, var(--semantic-info) 28%, transparent)",
              }}
            >
              Test
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
