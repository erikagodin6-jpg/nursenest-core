import type { ReactNode } from "react";

/**
 * Shared pathway marketing hub hero — matches allied + tier hub Figma direction:
 * gradient-safe band, semantic glow accents, `nn-nursing-tier-hub-hero-band` elevation
 * (see `premium-redesign-2026.css`).
 */
export function MarketingPathwayHubHeroBand({
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode | null;
  /** CTAs, measurement toggle, etc. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`nn-gradient-safe nn-nursing-tier-hub-hero-band relative overflow-hidden px-6 pt-4 pb-4 shadow-[var(--semantic-shadow-soft)] sm:px-10 sm:pt-5 sm:pb-5 ${className}`.trim()}
      data-nn-hub-section="identity-hero"
    >
      <div
        className="pointer-events-none !absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,transparent)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none !absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_8%,transparent)] blur-3xl"
        aria-hidden
      />
      <div className="relative">{eyebrow}</div>
      <div className="relative mt-3">{title}</div>
      {intro ? <div className="relative mt-3">{intro}</div> : null}
      {children ? <div className="relative mt-5 min-w-0">{children}</div> : null}
    </div>
  );
}
