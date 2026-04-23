import type { HTMLAttributes, ReactNode } from "react";

export type LearnerSurfaceCardVariant = "default" | "primary" | "secondary" | "minimal";

const VARIANT: Record<LearnerSurfaceCardVariant, string> = {
  default: "lv-card",
  primary: "lv-card lv-card--primary",
  secondary: "lv-card lv-card--secondary",
  minimal: "lv-card lv-card--minimal",
};

/** Token-based learner card — use instead of ad-hoc bordered boxes on study surfaces. */
export function LearnerSurfaceCard({
  variant = "default",
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  variant?: LearnerSurfaceCardVariant;
  children: ReactNode;
}) {
  return (
    <div className={`${VARIANT[variant]} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
