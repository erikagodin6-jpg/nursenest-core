"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Calculator, Search, Star, X } from "lucide-react";
import {
  SMART_FORMULA_CATEGORY_LABELS,
  SMART_FORMULA_SUBCATEGORY_LABELS,
  searchSmartFormulaItems,
  type SmartFormulaItem,
} from "@/lib/formula-sheet/smart-formula-sheet";

const FAVORITES_KEY = "nn_smart_formula_sheet_favorites_v1";

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: readonly string[]) {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
  } catch {
    /* Favorites are a convenience layer; formulas remain available without storage. */
  }
}

function FormulaCard({
  item,
  favorite,
  onToggleFavorite,
}: {
  item: SmartFormulaItem;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[var(--semantic-brand)]">
            {SMART_FORMULA_CATEGORY_LABELS[item.category]} · {SMART_FORMULA_SUBCATEGORY_LABELS[item.subcategory]}
          </p>
          <h3 className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">{item.title}</h3>
        </div>
        <button
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${item.title} from favorites` : `Favorite ${item.title}`}
          onClick={() => onToggleFavorite(item.id)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-brand)] transition hover:bg-[var(--semantic-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-focus-ring)]"
        >
          <Star className={favorite ? "h-4 w-4 fill-current" : "h-4 w-4"} aria-hidden />
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 font-mono text-sm text-[var(--semantic-text-primary)]">
        {item.formula}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{item.useWhen}</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        {item.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-3 py-2 text-xs leading-relaxed text-[var(--semantic-text-primary)]">
        {item.safetyNote}
      </p>
    </article>
  );
}

export function SmartFormulaSheetPanel({ embedded = false }: { embedded?: boolean }) {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const items = useMemo(() => searchSmartFormulaItems(query, favorites), [favorites, query]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
      writeFavorites(next);
      return next;
    });
  };

  return (
    <section
      className={embedded ? "space-y-4" : "flex min-h-0 flex-1 flex-col"}
      data-nn-smart-formula-sheet
      aria-label="Smart Formula Sheet"
    >
      <div className={embedded ? "space-y-3" : "shrink-0 space-y-3 border-b border-[var(--semantic-border-soft)] p-4"}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Smart Formula Sheet</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">Critical formulas and references</h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Medication math, ABGs, ECG intervals, hemodynamics, and lab references in one searchable sheet.
          </p>
        </div>
        <label className="relative block">
          <span className="sr-only">Search formulas</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--semantic-text-muted)]" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search formulas, labs, ECG, ABG..."
            className="min-h-11 w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] pl-10 pr-3 text-sm text-[var(--semantic-text-primary)] outline-none transition focus:border-[var(--semantic-brand)] focus:ring-2 focus:ring-[var(--semantic-focus-ring)]"
          />
        </label>
        {favorites.length > 0 ? (
          <p className="text-xs text-[var(--semantic-text-secondary)]">{favorites.length} favorite formula{favorites.length === 1 ? "" : "s"} pinned first.</p>
        ) : null}
      </div>

      <div className={embedded ? "grid gap-4 lg:grid-cols-2" : "min-h-0 flex-1 space-y-4 overflow-y-auto p-4"}>
        {items.map((item) => (
          <FormulaCard key={item.id} item={item} favorite={favoriteSet.has(item.id)} onToggleFavorite={toggleFavorite} />
        ))}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5 text-sm text-[var(--semantic-text-secondary)]">
            No formulas matched. Try “drip,” “ABG,” “MAP,” “potassium,” or “QRS.”
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SmartFormulaSheetLauncher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawer =
    mounted && open
      ? createPortal(
          <div className="fixed inset-0 z-[220]" data-nn-smart-formula-sheet-drawer>
            <button
              type="button"
              className="absolute inset-0 bg-[color-mix(in_srgb,var(--semantic-text-primary)_44%,transparent)]"
              aria-label="Close formula sheet"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-2xl border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--shadow-elevated)] sm:inset-y-4 sm:left-auto sm:right-4 sm:w-[min(32rem,calc(100vw-2rem))] sm:rounded-2xl sm:border">
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--semantic-border-soft)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                  <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Formula Sheet</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--semantic-text-secondary)] transition hover:bg-[var(--semantic-panel-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-focus-ring)]"
                  aria-label="Close formula sheet"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <SmartFormulaSheetPanel />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)] transition hover:bg-[var(--semantic-panel-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-focus-ring)]",
          compact ? "min-w-11 px-3" : "px-4",
        ].join(" ")}
        data-nn-smart-formula-sheet-trigger
        aria-label="Open formula sheet"
      >
        <Calculator className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
        <span className={compact ? "hidden xl:inline" : ""}>Formula Sheet</span>
      </button>
      {drawer}
    </>
  );
}
