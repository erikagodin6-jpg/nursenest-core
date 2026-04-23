import type { ReactNode } from "react";

export type LearnerStudyCardVariant = "default" | "primary" | "secondary" | "minimal";

const CARD: Record<LearnerStudyCardVariant, string> = {
  default: "lv-card",
  primary: "lv-card lv-card--primary",
  secondary: "lv-card lv-card--secondary",
  minimal: "lv-card lv-card--minimal",
};

/**
 * Token-based study card — hierarchy without repeating identical shells (`learner-ds.css`).
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
