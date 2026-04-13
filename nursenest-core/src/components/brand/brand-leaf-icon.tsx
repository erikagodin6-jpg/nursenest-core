/**
 * Static NurseNest leaf mark for empty states, inline hints, and success accents.
 * Theme tokens only; safe for Server Components.
 */
export type BrandLeafTone = "brand" | "success" | "muted";

type Props = {
  tone?: BrandLeafTone;
  /** Width in px; height scales (~0.64 aspect). */
  size?: number;
  className?: string;
};

function fillForTone(tone: BrandLeafTone): string {
  if (tone === "success") return "var(--semantic-success, var(--theme-primary))";
  if (tone === "muted") {
    return "color-mix(in srgb, var(--semantic-brand) 42%, var(--semantic-text-muted))";
  }
  return "var(--semantic-brand, var(--theme-primary))";
}

export function BrandLeafIcon({ tone = "brand", size = 28, className = "" }: Props) {
  const h = Math.round(size * 0.64);
  const outer = fillForTone(tone);
  const inner = "var(--theme-card-bg, var(--semantic-surface))";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 32"
      width={size}
      height={h}
      className={className}
      aria-hidden
    >
      <path d="M6 28 C6 17 14.5 9 25 9 S44 17 44 28 Z" fill={outer} />
      <path d="M11 28 C11 20.5 17 15 25 15 S39 20.5 39 28 Z" fill={inner} />
    </svg>
  );
}
