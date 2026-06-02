/**
 * CnpleProvisionalDisclaimer — reusable provisional specification notice.
 *
 * Text is sourced exclusively from CNPLE_SPEC.disclaimers to ensure a single
 * edit point when CCRNR confirms official specifications.
 *
 * Variants:
 *   "inline"  — small text notice, ideal within prose or card footers
 *   "card"    — bordered card with icon, used on hub/simulation landing pages
 *   "subtle"  — muted single-line beneath headings or above CTAs
 *
 * All variants use semantic CSS tokens only — compatible with every NurseNest
 * theme (Blossom, Ocean, Midnight, Sunset, Aurora).
 */

import { cnpleDisclaimerFor, isOfficiallyConfirmed } from "@/lib/cnple/cnple-spec";

type DisclaimerVariant = "inline" | "card" | "subtle";
type DisclaimerSurface = "short" | "long" | "ui";

// Surface → variant defaults
const SURFACE_FOR_VARIANT: Record<DisclaimerVariant, DisclaimerSurface> = {
  inline: "long",
  card:   "long",
  subtle: "short",
};

export type CnpleProvisionalDisclaimerProps = {
  variant?: DisclaimerVariant;
  /** Override which disclaimer text is shown. Defaults to the variant's natural surface. */
  surface?: DisclaimerSurface;
  /** Suppress when CCRNR has officially confirmed — pass true to hide after confirmation. */
  hideWhenConfirmed?: boolean;
};

/**
 * Provisional specification disclaimer for CNPLE pages.
 * Returns null once `isOfficiallyConfirmed()` is true and `hideWhenConfirmed` is set.
 */
export function CnpleProvisionalDisclaimer({
  variant = "card",
  surface,
  hideWhenConfirmed = false,
}: CnpleProvisionalDisclaimerProps) {
  if (hideWhenConfirmed && isOfficiallyConfirmed()) return null;

  const resolvedSurface = surface ?? SURFACE_FOR_VARIANT[variant];
  const text = cnpleDisclaimerFor(resolvedSurface);

  if (variant === "inline") {
    return (
      <p
        className="text-[12px] leading-relaxed"
        style={{ color: "var(--semantic-text-muted)" }}
        data-cnple-disclaimer="inline"
      >
        {text}
      </p>
    );
  }

  if (variant === "subtle") {
    return (
      <p
        className="flex items-center gap-1.5 text-[12px]"
        style={{ color: "var(--semantic-text-muted)" }}
        data-cnple-disclaimer="subtle"
      >
        <ProvInfoIcon />
        {text}
      </p>
    );
  }

  // "card" variant — bordered notice with icon row
  return (
    <div
      className="flex gap-3 rounded-xl border px-4 py-3"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 30%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))",
      }}
      role="note"
      aria-label="Provisional specification notice"
      data-cnple-disclaimer="card"
    >
      <div className="mt-0.5 shrink-0">
        <ProvInfoIcon />
      </div>
      <div>
        <p
          className="text-[12px] font-semibold"
          style={{ color: "var(--semantic-text-secondary)" }}
        >
          Provisional specifications
        </p>
        <p
          className="mt-0.5 text-[12px] leading-relaxed"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function ProvInfoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: "var(--semantic-info, var(--semantic-brand))" }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
