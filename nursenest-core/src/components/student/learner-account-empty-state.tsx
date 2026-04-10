import { PremiumEmptyState } from "@/components/ui/premium-empty-state";

/**
 * Low-data / onboarding empty state for account hub pages — reassuring, not “broken”.
 */
export function LearnerAccountEmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <PremiumEmptyState
      data-nn-empty="learner-account"
      tone="early"
      headline={title}
      body={body}
      label={title}
      primaryCta={{ label: ctaLabel, href: ctaHref, variant: "primary" }}
      secondaryCtas={
        secondaryHref && secondaryLabel
          ? [{ label: secondaryLabel, href: secondaryHref, variant: "secondary" }]
          : undefined
      }
      visualLayout="stack"
    />
  );
}
