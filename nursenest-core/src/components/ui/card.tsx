import * as React from "react";

/**
 * Surface container. Applies `.nn-card` (theme shadow + border) when `className` is omitted
 * so drop-in usage picks up the design system; explicit `className` stays in full control.
 */
export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const trimmed = className.trim();
  const base = trimmed ? "nn-card-ink" : "nn-card";
  return <div className={[base, className].filter(Boolean).join(" ")} {...props} />;
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}
