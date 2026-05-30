"use client";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  pathwayHubPrimaryProof,
  pathwayHubSecondaryProofs,
} from "@/lib/marketing/marketing-proof-screenshots";
import { MarketingProofScreenshot } from "@/components/marketing/marketing-proof-screenshot";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";

/**
 * Pathway marketing hub — real product screenshots (tier-specific, theme-aware).
 */
export function MarketingPathwayHubProductPreview({
  pathway,
  className = "",
}: {
  pathway: ExamPathwayDefinition;
  className?: string;
}) {
  const primary = pathwayHubPrimaryProof(pathway);
  const secondary = pathwayHubSecondaryProofs(pathway);

  return (
    <section
      className={`nn-pathway-hub-product-preview space-y-5 ${className}`.trim()}
      aria-label="Platform preview"
      data-nn-pathway-hub-proof="1"
      data-pathway-id={pathway.id}
    >
      <LearnerSurfaceCard
        variant="secondary"
        className="overflow-hidden border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] p-0 shadow-[var(--semantic-shadow-soft)]"
      >
        <div className="border-b border-[var(--semantic-border-soft)] px-5 py-3 sm:px-6">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
            Live platform preview
          </p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Real {pathway.shortName} study surfaces — not mockups.
          </p>
        </div>
        <div className="relative aspect-[16/10] w-full min-h-[220px] bg-[var(--semantic-panel-muted)]">
          <MarketingProofScreenshot shot={primary} priority sizes="(min-width: 1024px) 56vw, 100vw" />
        </div>
      </LearnerSurfaceCard>

      {secondary.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((shot) => (
            <LearnerSurfaceCard
              key={shot.src}
              variant="secondary"
              className="overflow-hidden p-0 shadow-[var(--semantic-shadow-soft)]"
            >
              <div className="relative aspect-[16/11] w-full bg-[var(--semantic-panel-muted)]">
                <MarketingProofScreenshot shot={shot} sizes="(min-width: 1024px) 28vw, 50vw" />
              </div>
            </LearnerSurfaceCard>
          ))}
        </div>
      ) : null}
    </section>
  );
}
