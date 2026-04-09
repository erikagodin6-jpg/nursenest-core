import type { ReactNode } from "react";
import { ProductCard } from "./product-card";

/** Presentational shell — pass list or empty state as `children`. */
export function WeakAreasCard({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <ProductCard>
      <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h3>
      {hint ? <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </ProductCard>
  );
}
