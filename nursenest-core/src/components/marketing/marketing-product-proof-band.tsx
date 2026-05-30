"use client";

import type { MarketingProofShot } from "@/lib/marketing/marketing-proof-screenshots";
import { MarketingProofScreenshot } from "@/components/marketing/marketing-proof-screenshot";

/**
 * Single prominent product screenshot band for pricing / SEO marketing sections.
 */
export function MarketingProductProofBand({
  shot,
  kicker,
  title,
  body,
  className = "",
}: {
  shot: MarketingProofShot;
  kicker?: string;
  title?: string;
  body?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] ${className}`.trim()}
      data-nn-marketing-product-proof="1"
    >
      {(kicker || title || body) && (
        <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4 sm:px-6">
          {kicker ? (
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
              {kicker}
            </p>
          ) : null}
          {title ? (
            <p className="mt-1 text-base font-semibold text-[var(--palette-heading)]">{title}</p>
          ) : null}
          {body ? (
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
          ) : null}
        </div>
      )}
      <div className="relative aspect-[16/9] w-full min-h-[200px] bg-[var(--semantic-panel-muted)]">
        <MarketingProofScreenshot shot={shot} sizes="(min-width: 1024px) 720px, 100vw" />
      </div>
    </div>
  );
}
