import type { ReactNode } from "react";
import { ProductCard } from "./product-card";

/** Shell for readiness headline + meter — real score data from parent. */
export function ReadinessCard({
  title,
  subtitle,
  scoreSlot,
  meterSlot,
  footer,
}: {
  title: string;
  subtitle?: string;
  scoreSlot: ReactNode;
  meterSlot: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <ProductCard accent paddingClass="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{subtitle}</p> : null}
        </div>
        <div className="shrink-0 sm:text-right">{scoreSlot}</div>
      </div>
      <div className="mt-5">{meterSlot}</div>
      {footer}
    </ProductCard>
  );
}
