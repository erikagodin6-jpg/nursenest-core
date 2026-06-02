/**
 * Shared US/CA region segmented control styling for marketing surfaces.
 * Uses theme-primary tints (--surface-selected, color-mix) — no flag emoji, no harsh primaries.
 */
const TRANSITION =
  "transition-[background-color,color,box-shadow] duration-150 ease-out";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-halo)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--theme-card-bg)]";

/** Outer track: soft primary-tinted surface, faint border, subtle lift. */
export function marketingRegionToggleShell(variant: "pill" | "rounded" | "mobile"): string {
  const radius = variant === "pill" ? "rounded-full" : variant === "mobile" ? "rounded-xl" : "rounded-lg";
  return [
    "inline-flex items-center p-0.5",
    radius,
    TRANSITION,
    "border border-[color-mix(in_srgb,var(--theme-primary)_18%,var(--border-subtle))]",
    "bg-[color-mix(in_srgb,var(--theme-primary)_7%,var(--theme-card-bg))]",
    "shadow-[0_1px_4px_-2px_color-mix(in_srgb,var(--theme-primary)_14%,transparent)]",
  ].join(" ");
}

/** Mobile drawer: full-width row inside shell. */
export function marketingRegionToggleShellMobileRow(): string {
  return `${marketingRegionToggleShell("mobile")} w-full`;
}

export function marketingRegionToggleSegment(
  active: boolean,
  size: "compact" | "default" | "mobile",
): string {
  const sizing =
    size === "compact"
      ? "inline-flex items-center justify-center rounded-full px-2 py-px text-[11px] font-semibold leading-tight tracking-wide"
      : size === "mobile"
        ? "flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-semibold"
        : "inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-semibold sm:px-3";

  const state = active
    ? [
        "bg-[var(--surface-selected)] text-[var(--theme-heading-text)]",
        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--theme-primary)_10%,transparent),0_1px_2px_color-mix(in_srgb,var(--theme-primary)_8%,transparent)]",
      ].join(" ")
    : [
        "text-[color-mix(in_srgb,var(--theme-muted-text)_96%,var(--theme-heading-text))]",
        "hover:bg-[color-mix(in_srgb,var(--theme-primary)_9%,var(--theme-card-bg))]",
        "hover:text-[color-mix(in_srgb,var(--theme-body-text)_92%,var(--theme-muted-text))]",
      ].join(" ");

  return [TRANSITION, FOCUS_RING, sizing, state].filter(Boolean).join(" ");
}
