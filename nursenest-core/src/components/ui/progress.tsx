import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value: number;
  /** "success" (default) uses readiness green; "accent" uses primary hue */
  variant?: "success" | "accent";
}

/**
 * Determinate progress bar — semantic colors only (`semantic-progress-*` in `color-roles.css`).
 */
export function Progress({ value, variant = "success", className = "", ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={["nn-ui-progress", className].filter(Boolean).join(" ")}
      data-variant={variant === "accent" ? "accent" : undefined}
      {...props}
    >
      <div className="nn-ui-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
