import type { ReactNode } from "react";

/**
 * Major learner page section — one accent tone via `data-variant` (see `learner-design-system.css`).
 */
export type LearnerSectionVariant = "neutral" | "tint-primary" | "tint-secondary" | "tint-accent";

export function LearnerSectionContainer({
  id,
  "aria-labelledby": ariaLabelledBy,
  variant,
  className = "",
  children,
}: {
  id?: string;
  "aria-labelledby"?: string;
  /** Omit for default surface; otherwise one tint per section. */
  variant?: LearnerSectionVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`nn-ls-ds-section ${className}`.trim()}
      {...(variant ? { "data-variant": variant } : {})}
    >
      {children}
    </section>
  );
}
