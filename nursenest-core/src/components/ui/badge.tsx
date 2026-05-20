import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}

const VARIANT_CLASS: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "nn-ui-badge--surface",
  secondary: "nn-ui-badge--secondary",
  outline: "nn-ui-badge--outline",
  success: "nn-ui-badge--success",
  warning: "nn-ui-badge--warning",
};

/**
 * Compact label; uses `.nn-ui-badge*` tokens from `globals.css`.
 */
export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const v = VARIANT_CLASS[variant] ?? "";
  return <span className={["nn-ui-badge", v, className].filter(Boolean).join(" ")} {...props} />;
}
