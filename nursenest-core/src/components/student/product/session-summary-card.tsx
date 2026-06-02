import type { ReactNode } from "react";
import { ProductCard } from "./product-card";

/** Wraps end-of-session stats — data passed by parent; no fabricated metrics. */
export function SessionSummaryCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <ProductCard accent>
      <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{subtitle}</p> : null}
      <div className="mt-4 space-y-3">{children}</div>
    </ProductCard>
  );
}
