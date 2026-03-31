"use client";

import type { ContentQualityTier } from "@/lib/content-quality/standards";

export type RationaleQualityClient = {
  tier: ContentQualityTier;
  wordCount: number;
  showEnrichmentNotice: boolean;
};

type Section = { heading: string; body: string };

/**
 * Quality-aware rationale display for question bank / review surfaces.
 * Uses structured sections when the API returned them; never fabricates clinical facts.
 */
export function PremiumRationalePanel({
  correct,
  rationale,
  rationaleQuality,
  rationaleSections,
}: {
  correct: boolean;
  rationale: string | null;
  rationaleQuality?: RationaleQualityClient | null;
  rationaleSections?: Section[] | null;
}) {
  const sections = (rationaleSections ?? []).filter((s) => s.body?.trim());
  const tier = rationaleQuality?.tier;
  const showEnrichment =
    tier === "thin" || Boolean(rationaleQuality?.showEnrichmentNotice);
  const missing = tier === "missing" || (!rationale?.trim() && sections.length === 0);

  return (
    <div className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
      <p className={`font-semibold ${correct ? "text-emerald-700" : "text-amber-800"}`}>
        {correct ? "Correct" : "Incorrect"}
      </p>
      {showEnrichment ? (
        <p className="mt-2 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20">
          Rationale available but needs enrichment — we’re expanding explanations across the bank.
        </p>
      ) : null}
      {sections.length > 0 ? (
        <div className="mt-3 space-y-4">
          {sections.map((s) => (
            <div key={`${s.heading}-${s.body.slice(0, 24)}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{s.heading}</p>
              <p className="mt-1.5 whitespace-pre-wrap text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      ) : !missing && rationale ? (
        <p className="mt-2 whitespace-pre-wrap text-muted leading-relaxed">{rationale}</p>
      ) : missing ? (
        <p className="mt-2 text-xs italic text-muted-foreground">
          No explanation is on file for this item yet.
        </p>
      ) : null}
    </div>
  );
}
