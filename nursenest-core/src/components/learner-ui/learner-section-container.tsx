import type { ReactNode } from "react";

/**
 * Major learner page section — one accent tone via `data-variant` (see `learner-design-system.css`).
 */
export type LearnerSectionVariant = "neutral" | "tint-primary" | "tint-secondary" | "tint-accent";

export function LearnerSectionContainer({
  id,
  "aria-labelledby": ariaLabelledBy,
  variant = "neutral",
  className = "",
  children,
}: {
  id?: string;
  "aria-labelledby"?: string;
  variant?: LearnerSectionVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`nn-ls-ds-section ${className}`.trim()}
      data-variant={variant}
    >
      {children}
    </section>
  );
}
