"use client";

/**
 * Premium Feature Matrix — inventory-backed comparison table
 *
 * Displays every feature × every tier (RN, RPN, NP, Allied, New Grad)
 * with actual counts sourced from the centralized inventory metrics service.
 *
 * Theme-aware, responsive, mobile-first.
 */

import { Check, Minus, Sparkles } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";
import {
  TIER_DISPLAY_ORDER,
  TIER_DISPLAY_LABELS,
  type FeatureMatrixRow,
  type TierDisplayKey,
} from "@/lib/marketing/feature-inventory-metrics";

const SURFACE = "var(--semantic-surface)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--palette-primary) 3%, var(--semantic-surface))";
const BORDER = "var(--semantic-border-soft)";
const TEXT_PRIMARY = "var(--semantic-text-primary)";
const TEXT_SECONDARY = "var(--semantic-text-secondary)";
const TEXT_MUTED = "var(--semantic-text-muted)";
const BRAND = "var(--palette-primary)";
const SUCCESS = "var(--semantic-success)";
const INFO = "var(--semantic-info)";
const WARNING = "var(--semantic-warning)";

/** Color accent for each tier column header */
const TIER_ACCENT: Record<TierDisplayKey, string> = {
  newGrad: "var(--semantic-info)",
  rn: "var(--palette-primary)",
  rpn: "var(--semantic-success)",
  np: "var(--semantic-warning)",
  allied: "var(--semantic-chart-1, var(--semantic-info))",
};

function CellValue({
  value,
}: {
  value: string | boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 shrink-0" style={{ color: SUCCESS }} aria-label="Included" />
    ) : (
      <Minus className="h-5 w-5 shrink-0" style={{ color: TEXT_MUTED }} aria-label="Not included" />
    );
  }

  // Numeric count — display prominently
  const isCount = /^[\d,+]+\+?$/.test(value);
  return (
    <span
      className={`font-semibold tabular-nums ${isCount ? "text-base" : "text-sm"}`}
      style={{ color: TEXT_PRIMARY }}
    >
      {value}
    </span>
  );
}

export function PremiumFeatureMatrix({
  rows,
}: {
  rows: {
    category: string;
    rows: FeatureMatrixRow[];
  }[];
}) {
  const { t } = useMarketingI18n();
  const tiers = TIER_DISPLAY_ORDER;

  if (rows.length === 0) return null;

  return (
    <section
      aria-labelledby="feature-matrix-heading"
      data-testid="section-premium-feature-matrix"
      className="scroll-mt-20"
    >
      <FadeUp className="mb-8 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em]"
          style={{
            borderColor: `color-mix(in srgb, ${BRAND} 18%, ${BORDER})`,
            background: `color-mix(in srgb, ${BRAND} 5%, var(--semantic-surface))`,
            color: BRAND,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t("pages.pricing.featureMatrix.badge") || "Full Feature Comparison"}
        </div>
        <h2 id="feature-matrix-heading" className="nn-marketing-h2 mt-4">
          {t("pages.pricing.featureMatrix.title") || "Everything included in every plan"}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl" style={{ color: TEXT_SECONDARY }}>
          {t("pages.pricing.featureMatrix.subtitle") || "Live inventory counts — updated automatically. See exactly what each pathway tier includes."}
        </p>
      </FadeUp>

      <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${BORDER}`, background: SURFACE }}>
        {/* Table header */}
        <div
          className="flex min-w-[640px] items-stretch border-b text-sm font-semibold"
          style={{ borderColor: BORDER, background: SURFACE_ELEVATED }}
        >
          {/* Feature column */}
          <div
            className="flex flex-[2] items-center px-4 py-3.5 min-w-[160px]"
            style={{ color: TEXT_PRIMARY }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.08em]">
              {t("pages.pricing.featureMatrix.colFeature") || "Feature"}
            </span>
          </div>
          {/* Tier columns */}
          {tiers.map((tierKey) => (
            <div
              key={tierKey}
              className="flex flex-1 items-center justify-center px-3 py-3.5 text-center min-w-[100px]"
              style={{ color: TIER_ACCENT[tierKey] }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.06em] leading-tight">
                {TIER_DISPLAY_LABELS[tierKey]}
              </span>
            </div>
          ))}
        </div>

        {/* Category groups */}
        {rows.map((group, gi) => (
          <div key={group.category}>
            {/* Category header */}
            <div
              className="flex min-w-[640px] items-stretch border-b px-4 py-2.5"
              style={{
                borderColor: BORDER,
                background: `color-mix(in srgb, ${BRAND} 4%, var(--semantic-surface))`,
              }}
            >
              <span
                className="text-xs font-bold uppercase tracking-[0.08em]"
                style={{ color: TEXT_MUTED }}
              >
                {group.category}
              </span>
            </div>

            {/* Feature rows */}
            <StaggerGroup staggerMs={40} whenInView once>
              {group.rows.map((row, ri) => {
                const isLast =
                  gi === rows.length - 1 && ri === group.rows.length - 1;
                return (
                  <StaggerItem key={`${group.category}-${row.label}`} variant="softReveal">
                    <div
                      className={`flex min-w-[640px] items-stretch text-sm transition-colors duration-150 ${
                        row.isHighlighted
                          ? "bg-[color-mix(in_srgb,var(--semantic-info)_4%,var(--semantic-surface))]"
                          : ""
                      } ${!isLast ? "border-b" : ""} hover:bg-[color-mix(in_srgb,var(--palette-primary)_2%,var(--semantic-surface))]`}
                      style={{ borderColor: BORDER }}
                    >
                      {/* Feature description */}
                      <div className="flex flex-[2] flex-col justify-center gap-0.5 px-4 py-3 min-w-[160px]">
                        <span
                          className={`font-semibold leading-tight ${
                            row.isHighlighted ? "text-sm" : "text-sm"
                          }`}
                          style={{ color: TEXT_PRIMARY }}
                        >
                          {row.label}
                        </span>
                        <span
                          className="text-xs leading-snug"
                          style={{ color: TEXT_MUTED }}
                        >
                          {row.description}
                        </span>
                        {row.isHighlighted && (
                          <span
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.04em]"
                            style={{ color: INFO }}
                          >
                            <Sparkles className="h-3 w-3" aria-hidden />
                            Add-on available
                          </span>
                        )}
                      </div>

                      {/* Tier values */}
                      {tiers.map((tierKey) => (
                        <div
                          key={tierKey}
                          className="flex flex-1 items-center justify-center px-3 py-3 min-w-[100px]"
                        >
                          <CellValue value={row.values[tierKey]} />
                        </div>
                      ))}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        ))}

        {/* Footer note */}
        <div
          className="min-w-[640px] px-4 py-3 text-center"
          style={{
            borderTop: `1px solid ${BORDER}`,
            background: SURFACE_ELEVATED,
          }}
        >
          <span className="text-xs" style={{ color: TEXT_MUTED }}>
            {t("pages.pricing.featureMatrix.footer") || "Counts reflect published content. Updated automatically from our content inventory."}
          </span>
        </div>
      </div>
    </section>
  );
}