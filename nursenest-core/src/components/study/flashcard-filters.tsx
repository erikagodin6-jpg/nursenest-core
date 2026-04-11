"use client";

/**
 * FlashcardFilters — Compact filter bar for the deck hub.
 *
 * Exposes:
 *   - Source type toggle chips (All / Lesson Concepts / Rationale-Derived / Weak Areas / Definitions)
 *   - Pathway selector (optional)
 *   - Topic / tag selector (optional)
 *   - Exam family selector (optional)
 *
 * Design: pill-style filter chips with semantic surface tints. No harsh colors.
 */

import type { DeckDisplaySource } from "@/lib/flashcards/flashcard-generation";
import { deckSourceAccentVar } from "@/lib/flashcards/flashcard-generation";

export type FlashcardFiltersValue = {
  source: DeckDisplaySource | "";
  pathwayId: string;
  examFamily: string;
  tagSlug: string;
  q: string;
};

type TagRow = { slug: string; name: string };
type PathwayOption = { id: string; label: string };

type FlashcardFiltersProps = {
  value: FlashcardFiltersValue;
  onChange: (next: Partial<FlashcardFiltersValue>) => void;
  pathwayOptions?: PathwayOption[];
  tagList?: TagRow[];
};

const EXAM_FAMILIES = ["NCLEX_RN", "NCLEX_PN", "REX_PN", "AANP", "GENERIC"] as const;

const SOURCE_CHIPS: { label: string; value: DeckDisplaySource | "" }[] = [
  { label: "All decks", value: "" },
  { label: "Lesson Concepts", value: "Lesson Concepts" },
  { label: "Rationale-Derived", value: "Rationale-Derived" },
  { label: "Weak Areas", value: "Weak Areas" },
  { label: "Definitions", value: "Definitions" },
];

function SourceChip({
  chip,
  active,
  onSelect,
}: {
  chip: (typeof SOURCE_CHIPS)[number];
  active: boolean;
  onSelect: () => void;
}) {
  const accent =
    chip.value
      ? deckSourceAccentVar(chip.value)
      : "var(--theme-primary)";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="rounded-full px-3 py-1.5 text-xs font-semibold transition"
      aria-pressed={active}
      style={
        active
          ? {
              background: `color-mix(in srgb, ${accent} 18%, var(--bg-card, #fff))`,
              color: accent,
              border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
            }
          : {
              background:
                "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 6%, var(--bg-page, #f9fafb))",
              color: "var(--theme-muted-text)",
              border: "1px solid var(--border-subtle, var(--theme-card-border))",
            }
      }
    >
      {chip.label}
    </button>
  );
}

export function FlashcardFilters({
  value,
  onChange,
  pathwayOptions = [],
  tagList = [],
}: FlashcardFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Source type chips */}
      <div>
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--theme-muted-text)" }}
        >
          Deck type
        </p>
        <div className="flex flex-wrap gap-2">
          {SOURCE_CHIPS.map((chip) => (
            <SourceChip
              key={chip.value}
              chip={chip}
              active={value.source === chip.value}
              onSelect={() => onChange({ source: chip.value })}
            />
          ))}
        </div>
      </div>

      {/* Selectors row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {pathwayOptions.length > 0 ? (
          <div>
            <label
              className="block text-xs font-semibold"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Pathway
              <select
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm"
                style={{
                  background: "var(--bg-card, var(--theme-card-bg))",
                  borderColor: "var(--border-subtle, var(--theme-card-border))",
                  color: "var(--theme-heading-text)",
                }}
                value={value.pathwayId}
                onChange={(e) => onChange({ pathwayId: e.target.value })}
              >
                <option value="">All pathways</option>
                {pathwayOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        <div>
          <label
            className="block text-xs font-semibold"
            style={{ color: "var(--theme-muted-text)" }}
          >
            Exam type
            <select
              className="mt-1 w-full rounded-lg border px-2 py-2 text-sm"
              style={{
                background: "var(--bg-card, var(--theme-card-bg))",
                borderColor: "var(--border-subtle, var(--theme-card-border))",
                color: "var(--theme-heading-text)",
              }}
              value={value.examFamily}
              onChange={(e) => onChange({ examFamily: e.target.value })}
            >
              <option value="">All exams</option>
              {EXAM_FAMILIES.map((ef) => (
                <option key={ef} value={ef}>
                  {ef.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        </div>

        {tagList.length > 0 ? (
          <div>
            <label
              className="block text-xs font-semibold"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Topic tag
              <select
                className="mt-1 w-full rounded-lg border px-2 py-2 text-sm"
                style={{
                  background: "var(--bg-card, var(--theme-card-bg))",
                  borderColor: "var(--border-subtle, var(--theme-card-border))",
                  color: "var(--theme-heading-text)",
                }}
                value={value.tagSlug}
                onChange={(e) => onChange({ tagSlug: e.target.value })}
              >
                <option value="">All topics</option>
                {tagList.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>

      {/* Search */}
      <div>
        <label
          className="block text-xs font-semibold"
          style={{ color: "var(--theme-muted-text)" }}
        >
          Search decks
          <input
            type="search"
            placeholder="Pharmacology, Cardiovascular…"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              background: "var(--bg-card, var(--theme-card-bg))",
              borderColor: "var(--border-subtle, var(--theme-card-border))",
              color: "var(--theme-heading-text)",
            }}
            value={value.q}
            onChange={(e) => onChange({ q: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}
