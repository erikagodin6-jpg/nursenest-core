import type { ReactNode } from "react";

export type ProgressBarSemanticVariant = "success" | "readiness" | "brand" | "info";

const FILL: Record<ProgressBarSemanticVariant, string> = {
  success: "nn-progress-fill-semantic-success",
  readiness: "nn-progress-fill-semantic-readiness",
  brand: "nn-progress-fill-semantic-brand",
  info: "nn-progress-fill-semantic-info",
};

const SIZE: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "nn-progress-track-semantic--xs",
  sm: "",
  md: "nn-progress-track-semantic--md",
  lg: "nn-progress-track-semantic--lg",
};

/**
 * Theme-aware progress track — uses semantic fills (multi-color), not a single brand bar.
 */
export function ProgressBarSemantic({
  value,
  max = 100,
  variant = "success",
  size = "md",
  label,
  hint,
  footer,
  id,
}: {
  value: number;
  max?: number;
  variant?: ProgressBarSemanticVariant;
  size?: keyof typeof SIZE;
  label?: ReactNode;
  hint?: ReactNode;
  footer?: ReactNode;
  id?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  const trackClass = ["nn-progress-track-semantic", SIZE[size]].filter(Boolean).join(" ");
  return (
    <div className="space-y-1.5">
      {label != null || hint != null ? (
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-[var(--semantic-text-secondary)]">
          <span className="font-medium text-[var(--semantic-text-primary)]">{label}</span>
          {hint != null ? <span className="tabular-nums">{hint}</span> : null}
        </div>
      ) : null}
      <div
        id={id}
        className={trackClass}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${FILL[variant]} nn-progress-fill-reveal transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {footer}
    </div>
  );
}
