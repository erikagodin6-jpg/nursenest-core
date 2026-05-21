import Link from "next/link";
import type { ReactNode } from "react";

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
};

type Props = {
  title?: string;
  subtitle?: string;
  /** Short pathway label (e.g. NCLEX-RN) — premium eyebrow, aligned with tier hub / homepage. */
  eyebrow?: string;
  /** Enables pathway-track-specific premium CSS when present. */
  pathwayTrack?: string;
  toolbar?: ReactNode;
  ctas?: CtaButton[];
  /** Single primary hero action: signup for guests, resume/next lesson for subscribers. */
  heroPrimaryCta?: { label: string; href: string };
  backLink?: { label: string; href: string };
  /** Compact stat shown inline with the eyebrow (lesson count, etc.). */
  statCard?: { value: string; label: string };
  /** Trust badges — rendered as a compact inline row below the H1. */
  trustBadges?: string[];
  /**
   * Lesson detail pages supply their own title/header inside the hub body.
   * Keeps the premium hub shell + body card without duplicating the compact hero H1.
   */
  omitHeroBand?: boolean;
  children: ReactNode;
};

function ctaClass(variant: CtaButton["variant"]): string {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-colors";
  switch (variant) {
    case "primary":
      return `${base} bg-[var(--role-cta)] text-[var(--role-cta-foreground)] shadow-[0_10px_22px_color-mix(in_srgb,var(--role-cta-shadow)_55%,transparent)] hover:bg-[var(--role-cta-hover)]`;
    case "outline":
      return `${base} border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]`;
    case "ghost":
      return `${base} text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,transparent)]`;
  }
}

/**
 * Page shell for lessons hub pages.
 * Uses a div because marketing layouts already provide the document main landmark.
 *
 * Option C compact hero: eyebrow + stat pill on one line, H1 on the next,
 * trust badges as a slim inline row, toolbar flush below the title band.
 */
export function LessonsPageShell({
  title,
  subtitle = "",
  eyebrow,
  pathwayTrack,
  toolbar,
  ctas,
  heroPrimaryCta,
  backLink,
  statCard,
  trustBadges,
  omitHeroBand = false,
  children,
}: Props) {
  return (
    <div
      className="nn-premium-pathway-hub nn-premium-lessons-system"
      data-nn-lessons-marketing-hub="1"
      data-nn-premium-lessons-system="hub"
      data-premium-layout-version="2026-05-v2-compact"
      {...(pathwayTrack ? { "data-pathway-track": pathwayTrack } : {})}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {omitHeroBand ? (
          backLink || eyebrow ? (
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              {backLink ? (
                <Link
                  href={backLink.href}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--theme-muted-text)] underline-offset-2 transition hover:text-[var(--semantic-brand)] hover:underline"
                >
                  <span aria-hidden>←</span>
                  <span className="max-w-[14rem] truncate">{backLink.label}</span>
                </Link>
              ) : null}
              {eyebrow ? <p className="nn-premium-home-eyebrow shrink-0">{eyebrow}</p> : null}
            </div>
          ) : null
        ) : (
        <section aria-labelledby="nn-lessons-hub-title">
          <div className="nn-nursing-tier-hub-hero-band nn-premium-lessons-hub-hero" data-nn-premium-lessons-hero>

            {/* Back + eyebrow + stat inline row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {backLink ? (
                <Link
                  href={backLink.href}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--theme-muted-text)] underline-offset-2 transition hover:text-[var(--semantic-brand)] hover:underline"
                >
                  <span aria-hidden>←</span>
                  <span className="max-w-[14rem] truncate">{backLink.label}</span>
                </Link>
              ) : null}

              {eyebrow ? (
                <p className="nn-premium-home-eyebrow shrink-0">{eyebrow}</p>
              ) : null}

              {statCard ? (
                <span
                  className="nn-lessons-hub-stat-pill inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-muted-text)]"
                  aria-label={`${statCard.value} ${statCard.label}`}
                >
                  <span className="font-black text-[var(--semantic-brand)]">{statCard.value}</span>
                  <span>{statCard.label}</span>
                </span>
              ) : null}
            </div>

            <h1
              id="nn-lessons-hub-title"
              className="nn-marketing-h1 mt-2 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)]"
            >
              {title}
            </h1>

            {subtitle ? (
              <p className="nn-marketing-body mt-2 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
                {subtitle}
              </p>
            ) : null}

            {/* Trust badges — compact inline chips */}
            {trustBadges && trustBadges.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Quality indicators">
                {trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="nn-lessons-hub-trust-badge inline-flex items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--theme-muted-text)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}

            {toolbar ? <div className="mt-3 w-full">{toolbar}</div> : null}

            {heroPrimaryCta ? (
              <div className="mt-4 flex w-full justify-start">
                <Link href={heroPrimaryCta.href} className={ctaClass("primary")}>
                  {heroPrimaryCta.label}
                </Link>
              </div>
            ) : null}

            {ctas && ctas.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {ctas.map((cta) => (
                  <Link key={cta.href + cta.label} href={cta.href} className={ctaClass(cta.variant)}>
                    {cta.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
        )}

        {/* ── Hub body — no heavy card wrapper; subtle surface separation ── */}
        <div
          className="nn-premium-lessons-hub-body mt-6 rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-white p-5 shadow-[0_2px_12px_color-mix(in_srgb,var(--palette-heading)_4%,transparent)] sm:mt-8 sm:p-8"
          data-nn-premium-lessons-hub-body
        >
          {children}
        </div>
      </div>
    </div>
  );
}
