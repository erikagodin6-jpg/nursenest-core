"use client";

/**
 * Decorative leaf watermark for auth card surfaces.
 *
 * Absolutely positioned, pointer-events: none, aria-hidden.
 * The parent card must have `relative overflow-hidden`.
 * All card content must be in a `relative z-[1]` wrapper so it layers above this.
 */
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

export function AuthLeafWatermark() {
  const { url, kind } = useThemeLogo("leaf");
  if (kind !== "cdn" || !url) return null;

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={[
        "pointer-events-none select-none",
        "absolute bottom-[-3rem] right-[-3rem]",
        "h-[260px] w-[260px] object-contain",
        "bg-transparent shadow-none ring-0 outline-none [mix-blend-mode:normal]",
        "opacity-[0.055]",
        "hidden sm:block",
      ].join(" ")}
      style={{ transform: "rotate(9deg)", backgroundColor: "transparent" }}
    />
  );
}
