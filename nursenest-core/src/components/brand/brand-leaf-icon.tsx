import { NURSENEST_DEFAULT_LEAF_MARK_URL } from "@/lib/branding/resolve-theme-logo";

/**
 * NurseNest leaf raster (CDN) for empty states, inline hints, and error surfaces.
 * Uses the same approved leaf assets as {@link SiteBrandLogoMark}, not geometric placeholder shapes.
 */
export type BrandLeafTone = "brand" | "success" | "muted";

type Props = {
  tone?: BrandLeafTone;
  /** Width in px; height scales (~0.64 aspect). */
  size?: number;
  className?: string;
};

function toneClass(tone: BrandLeafTone): string {
  if (tone === "success") return "opacity-95 [filter:saturate(1.12)_hue-rotate(48deg)]";
  if (tone === "muted") return "opacity-[0.72]";
  return "opacity-100";
}

export function BrandLeafIcon({ tone = "brand", size = 28, className = "" }: Props) {
  const h = Math.round(size * 0.64);
  const src = NURSENEST_DEFAULT_LEAF_MARK_URL;

  if (!src) {
    return (
      <span
        className={`inline-block font-semibold text-[var(--semantic-brand)] ${className}`.trim()}
        style={{ fontSize: `${Math.max(10, Math.round(size * 0.42))}px` }}
        aria-hidden
      >
        NN
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={h}
      className={`object-contain ${toneClass(tone)} ${className}`.trim()}
      aria-hidden
    />
  );
}
