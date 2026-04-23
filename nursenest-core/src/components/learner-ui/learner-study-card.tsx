import type { ReactNode } from "react";

export type LearnerStudyCardVariant = "default" | "primary" | "secondary" | "minimal";

const CARD: Record<LearnerStudyCardVariant, string> = {
  default: "nn-ls-ds-card",
  primary: "nn-ls-ds-card nn-ls-ds-card--primary",
  secondary: "nn-ls-ds-card nn-ls-ds-card--secondary",
  minimal: "nn-ls-ds-card nn-ls-ds-card--minimal",
};

/**
 * Token-based study card — hierarchy without repeating identical shells.
 */
export function LearnerStudyCard({
  variant = "default",
  className = "",
  children,
}: {
  variant?: LearnerStudyCardVariant;
  className?: string;
  children: ReactNode;
}) {
  return <div className={`${CARD[variant]} ${className}`.trim()}>{children}</div>;
}
