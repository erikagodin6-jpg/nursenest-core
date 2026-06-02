"use client";

import Image from "next/image";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";

type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

const POSITION_CLASSES: Record<Position, string> = {
  "top-right":    "-right-12 -top-16",
  "top-left":     "-left-12 -top-16",
  "bottom-right": "-bottom-16 -right-12",
  "bottom-left":  "-bottom-16 -left-12",
};

const ROTATION_DEFAULTS: Record<Position, string> = {
  "top-right":    "",
  "top-left":     "rotate-[12deg]",
  "bottom-right": "rotate-[-18deg]",
  "bottom-left":  "rotate-[8deg]",
};

type DecorativeThemeWatermarkProps = {
  position?: Position;
  size?: number;
  /** Override the default rotation for this position. */
  rotation?: string;
  /** Additional wrapper classes (e.g. "hidden sm:block"). */
  className?: string;
  /** Tailwind opacity class — keep in 2-4% range (opacity-[0.02] to opacity-[0.04]). */
  opacity?: string;
};

/**
 * Shared decorative brand watermark for all NurseNest activity screens.
 * Uses the real per-theme leaf asset — never CSS mask-image.
 * Opacity must stay in the 2-4% range so it never distracts from studying.
 */
export function DecorativeThemeWatermark({
  position = "top-right",
  size = 300,
  rotation,
  className = "",
  opacity = "opacity-[0.03]",
}: DecorativeThemeWatermarkProps) {
  const { url, kind } = useThemeLogo("leaf");
  const leafUrl = kind === "local" && typeof url === "string" && url.trim().length > 0 ? url : null;
  if (!leafUrl) return null;

  const posClass = POSITION_CLASSES[position];
  const rotClass = rotation ?? ROTATION_DEFAULTS[position];

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute select-none overflow-hidden",
        posClass,
        opacity,
        className,
      ].filter(Boolean).join(" ")}
    >
      <Image
        src={leafUrl}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        loading="lazy"
        draggable={false}
        className={["h-auto w-auto max-w-none", rotClass].filter(Boolean).join(" ")}
      />
    </div>
  );
}
