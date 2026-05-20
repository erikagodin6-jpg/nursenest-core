"use client";

import type { BrandLogoMarkVariant } from "@/lib/branding/logo-config";
import {
  BRAND_NAME,
  DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  brandLogoMarkPresentation,
} from "@/lib/branding/logo-config";

/**
 * SVG logo mark that recolors via `--logo-primary`, `--logo-accent`, `--logo-text`.
 * Each theme defines these CSS variables so the mark adapts instantly on theme switch
 * without raster asset resolution, CDN lookups, or CSS filter hacks.
 *
 * Falls back gracefully: if CSS variables are missing the SVG shows a neutral dark mark.
 */
export function ThemeLogoMark({
  className = DEFAULT_BRAND_LOGO_MARK_CLASSNAME,
  variant = "header",
}: {
  className?: string;
  variant?: BrandLogoMarkVariant;
}) {
  const { slotClassName } = brandLogoMarkPresentation(variant);

  return (
    <span
      className={`${slotClassName} ${className}`.trim()}
      aria-label={BRAND_NAME}
    >
      <svg
        viewBox="0 0 260 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-h-full max-w-full shrink-0"
        role="img"
        aria-hidden="true"
      >
        {/* Nest icon / mark */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="var(--logo-primary, currentColor)"
        />
        <path
          d="M24 12c-3.5 0-6.5 1.5-8.5 4-1.5 1.8-2.5 4.2-2.5 6.5 0 1.8.6 3.2 1.8 4.2 1.2 1 2.8 1.3 4.2.8.6-.2 1-.6 1.2-1.2.2-.6.2-1.4-.2-2.2-.2-.4-.2-.8 0-1.2.2-.4.6-.6 1-.6s.8.2 1 .6c.2.4.2.8 0 1.2-.4.8-.4 1.6-.2 2.2.2.6.6 1 1.2 1.2 1.4.5 3 .2 4.2-.8 1.2-1 1.8-2.4 1.8-4.2 0-2.3-1-4.7-2.5-6.5-2-2.5-5-4-8.5-4z"
          fill="var(--logo-accent, #ffffff)"
        />
        {/* Wordmark */}
        <text
          x="56"
          y="32"
          fontFamily="var(--font-sans, 'DM Sans', system-ui, sans-serif)"
          fontWeight="700"
          fontSize="26"
          letterSpacing="-0.02em"
          fill="var(--logo-text, currentColor)"
        >
          NurseNest
        </text>
      </svg>
    </span>
  );
}
