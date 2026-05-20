"use client";

import { CheckCircle2 } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export type BrandTrustInlineVariant = "checkout" | "pricing" | "prep";

const KEY: Record<BrandTrustInlineVariant, string> = {
  checkout: "brand.trust.checkout",
  pricing: "brand.trust.pricing",
  prep: "brand.trust.prep",
};

/**
 * Compact bullet list derived from a single i18n string (segments separated by " · ").
 * Uses semantic success for icons per design guardrails.
 */
export function BrandTrustInline({
  variant,
  className = "",
}: {
  variant: BrandTrustInlineVariant;
  className?: string;
}) {
  const { t } = useMarketingI18n();
  const text = t(KEY[variant]);
  const parts = text.split(" · ").map((s) => s.trim()).filter(Boolean);

  return (
    <ul
      className={`flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1 ${className}`}
      role="list"
    >
      {parts.map((part) => (
        <li key={part} className="flex items-center gap-1.5">
          <CheckCircle2
            className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]"
            aria-hidden
          />
          <span>{part}</span>
        </li>
      ))}
    </ul>
  );
}
