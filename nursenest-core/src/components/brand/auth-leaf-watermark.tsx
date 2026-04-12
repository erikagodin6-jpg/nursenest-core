"use client";

/**
 * Decorative leaf watermark for auth card surfaces.
 *
 * Absolutely positioned, pointer-events: none, aria-hidden.
 * The parent card must have `relative overflow-hidden`.
 * All card content must be in a `relative z-[1]` wrapper so it layers above this.
 *
 * Resolves the active theme's leaf asset client-side via useThemeLogo — no hardcoding.
 * Hidden on small screens to avoid crowding the form.
 */
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

export function AuthLeafWatermark() {
  const { singleSrc } = useThemeLogo("leaf");

  return (
    <img
      src={singleSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={[
        "pointer-events-none select-none",
        "absolute bottom-[-3rem] right-[-3rem]",
        "h-[260px] w-[260px] object-contain",
        "opacity-[0.055]",
        // Hide on small screens — form fields fill the card, no room for decoration
        "hidden sm:block",
      ].join(" ")}
      style={{ transform: "rotate(9deg)" }}
    />
  );
}
