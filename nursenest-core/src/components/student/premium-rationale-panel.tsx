"use client";

import type { ContentQualityTier } from "@/lib/content-quality/standards";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";

export type RationaleQualityClient = {
  tier: ContentQualityTier;
  wordCount: number;
  showEnrichmentNotice: boolean;
};

type Section = { heading: string; body: string };

function RationaleReferenceFigures({ items }: { items: RationaleReferenceMedia[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Reference figures</p>
      {items.map((m, i) => (
        <figure key={`${m.url}-${i}`} className="overflow-hidden rounded-lg border border-border bg-background/60">
          {/* eslint-disable-next-line @next/next/no-img-element -- HTTPS-only educational URLs from content pipeline */}
          <img
            src={m.url}
            alt={m.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(60vh,480px)] w-full object-contain"
          />
          {m.caption ? (
            <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">{m.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

/**
 * Quality-aware rationale display for question bank / review surfaces.
 * Uses structured sections when the API returned them; never fabricates clinical facts.
 */
export function PremiumRationalePanel({
  correct,
  rationale,
  rationaleQuality,
  rationaleSections,
  referenceMedia,
}: {
  correct: boolean;
  rationale: string | null;
  rationaleQuality?: RationaleQualityClient | null;
  rationaleSections?: Section[] | null;
  /** Optional HTTPS figures from `exam_questions.images` — shown only in review / explanation mode. */
  referenceMedia?: RationaleReferenceMedia[] | null;
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
      {referenceMedia && referenceMedia.length > 0 ? <RationaleReferenceFigures items={referenceMedia} /> : null}
    </div>
  );
}
