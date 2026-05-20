import type { ReactNode } from "react";

/**
 * Theme-token learner surface: padded card with optional multi-hue top accent (see `semantic-status-tokens.css`).
 */
export function ProductCard({
  children,
  accent = false,
  className = "",
  paddingClass = "p-6",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
  /** Extra top padding when `accent` compensates for the 3px bar */
  paddingClass?: string;
}) {
  return (
    <div
      className={`nn-card ${accent ? "nn-product-surface-accent relative overflow-hidden pt-7" : ""} ${paddingClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
