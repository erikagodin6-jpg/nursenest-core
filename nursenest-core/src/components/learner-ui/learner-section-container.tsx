import type { ReactNode } from "react";

/**
 * Major learner page section — one accent tone via `data-tone` (`styles/learner-ds.css` `.lv-section`).
 */
export type LearnerSectionVariant = "neutral" | "tint-primary" | "tint-secondary" | "tint-accent";

const TONE_BY_VARIANT: Record<LearnerSectionVariant, "neutral" | "primary" | "secondary" | "accent"> = {
  neutral: "neutral",
  "tint-primary": "primary",
  "tint-secondary": "secondary",
  "tint-accent": "accent",
};

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
      className={`lv-section ${className}`.trim()}
      {...(variant ? { "data-tone": TONE_BY_VARIANT[variant] } : {})}
    >
      {children}
    </section>
  );
}
