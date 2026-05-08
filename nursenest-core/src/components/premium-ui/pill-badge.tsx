/**
 * PillBadge — semantic-aware small badge.
 *
 * Maps the `tone` prop onto semantic CSS variables defined in
 * `src/app/semantic-status-tokens.css`, so the badge stays themeable and
 * accessible across palettes (light + dark).
 *
 * Tones intentionally mirror the semantic clinical vocabulary used elsewhere
 * in the product (success / info / warning / danger / brand). Use this in
 * place of inline pill `<span>`s with hardcoded hex.
 */

import * as React from "react";

export type PillTone = "brand" | "success" | "info" | "warning" | "danger" | "neutral";

const TOKEN_FOR_TONE: Record<PillTone, string> = {
  brand: "var(--semantic-brand, var(--theme-primary, #2563eb))",
  success: "var(--semantic-success, #059669)",
  info: "var(--semantic-info, #2563eb)",
  warning: "var(--semantic-warning, #d97706)",
  danger: "var(--semantic-danger, #e11d48)",
  neutral: "var(--theme-muted-text, #6b7280)",
};

export interface PillBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  /** Adds a soft tint background. Default true. */
  filled?: boolean;
}

export function PillBadge({
  tone = "brand",
  filled = true,
  className,
  style,
  children,
  ...rest
}: PillBadgeProps) {
  const color = TOKEN_FOR_TONE[tone];
  return (
    <span
      {...rest}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 36%, var(--theme-border, #e5e7eb))`,
        background: filled
          ? `color-mix(in srgb, ${color} 10%, var(--theme-page-bg, #ffffff))`
          : "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
