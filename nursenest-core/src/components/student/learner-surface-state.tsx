import {
  PremiumEmptyState,
  type PremiumEmptyCta,
  type PremiumEmptyTone,
} from "@/components/ui/premium-empty-state";

export function LearnerSurfaceState({
  headline,
  body,
  hint,
  tone = "early",
  primaryCta,
  secondaryCtas,
  className,
}: {
  headline: string;
  body: string;
  hint?: string;
  tone?: PremiumEmptyTone;
  primaryCta: PremiumEmptyCta;
  secondaryCtas?: PremiumEmptyCta[];
  className?: string;
}) {
  return (
    <PremiumEmptyState
      data-nn-empty="learner-surface-state"
      tone={tone}
      headline={headline}
      body={body}
      hint={hint}
      primaryCta={primaryCta}
      secondaryCtas={secondaryCtas}
      visualLayout="stack"
      ctaLayout="stack"
      className={className}
    />
  );
}
