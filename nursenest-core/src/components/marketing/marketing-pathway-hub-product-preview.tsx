"use client";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
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
  const secondary = pathwayHubSecondaryProofs(pathway);

  if (secondary.length === 0) {
    return null;
  }

  return (
    <section
      className={`nn-pathway-hub-product-preview space-y-5 ${className}`.trim()}
      aria-labelledby={`nn-pathway-hub-topic-images-${pathway.id}`}
      data-nn-pathway-hub-proof="1"
      data-nn-hub-section="study-topic-image-grid"
      data-pathway-id={pathway.id}
    >
      <div>
        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
          Study Areas Covered
        </p>
        <h2
          id={`nn-pathway-hub-topic-images-${pathway.id}`}
          className="mt-2 nn-marketing-h3 text-balance text-[var(--palette-heading)]"
        >
          Explore the learning surfaces included in this pathway
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {secondary.map((shot) => (
          <LearnerSurfaceCard
            key={shot.src}
            variant="secondary"
            className="nn-pathway-hub-product-preview-card overflow-hidden p-0 shadow-[var(--semantic-shadow-soft)]"
          >
            <div className="nn-pathway-hub-product-preview-frame relative aspect-[16/11] w-full bg-[var(--semantic-panel-muted)]">
              <MarketingProofScreenshot shot={shot} sizes="(min-width: 1024px) 28vw, 50vw" />
            </div>
          </LearnerSurfaceCard>
        ))}
      </div>
    </section>
  );
}
