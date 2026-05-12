import Link from "next/link";
import type { ReactNode } from "react";

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
};

type Props = {
  title: string;
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
  /** Prominent stat card shown in the hero (lesson count, etc.). */
  statCard?: { value: string; label: string };
  /** Trust/quality badge pills rendered below the subtitle. */
  trustBadges?: string[];
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
  children,
}: Props) {
  return (
    <div
      className="nn-premium-pathway-hub nn-premium-lessons-system"
      data-nn-lessons-marketing-hub="1"
      data-nn-premium-lessons-system="hub"
      {...(pathwayTrack ? { "data-pathway-track": pathwayTrack } : {})}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <section aria-labelledby="nn-lessons-hub-title">
          <div className="nn-nursing-tier-hub-hero-band nn-premium-lessons-hub-hero" data-nn-premium-lessons-hero>
            {backLink ? (
              <div className="mb-3 sm:mb-4">
                <Link
                  href={backLink.href}
                  className="inline-flex max-w-full items-center gap-1 text-xs font-medium text-[var(--theme-muted-text)] underline-offset-2 transition hover:text-[var(--semantic-brand)] hover:underline sm:text-sm"
                >
                  <span className="shrink-0 text-[var(--theme-muted-text)]" aria-hidden>
                    ←
                  </span>
                  <span className="truncate">{backLink.label}</span>
                </Link>
              </div>
            ) : null}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                {eyebrow ? <p className="nn-premium-home-eyebrow">{eyebrow}</p> : null}

                <h1
                  id="nn-lessons-hub-title"
                  className={`nn-marketing-h1 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)] ${eyebrow ? "mt-4" : backLink ? "mt-1" : "mt-0"}`}
                >
                  {title}
                </h1>
                {subtitle ? (
                  <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--palette-text-muted)]">
                    {subtitle}
                  </p>
                ) : null}

                {trustBadges && trustBadges.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2" aria-label="Quality indicators">
                    {trustBadges.map((badge) => (
                      <span
                        key={badge}
                        className="nn-lessons-hub-trust-badge inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-medium text-[var(--theme-muted-text)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {statCard ? (
                <div className="nn-lessons-hub-stat-card self-start shrink-0 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-5 py-4 text-center shadow-[var(--semantic-shadow-soft)] sm:min-w-[9rem]">
                  <span className="block text-3xl font-black leading-none text-[var(--semantic-brand)]">
                    {statCard.value}
                  </span>
                  <span className="mt-1.5 block text-xs font-medium text-[var(--theme-muted-text)]">
                    {statCard.label}
                  </span>
                </div>
              ) : null}
            </div>

            {toolbar ? <div className="mt-5 w-full">{toolbar}</div> : null}

            {heroPrimaryCta ? (
              <div className="mx-auto mt-6 flex w-full max-w-2xl justify-center sm:justify-start">
                <Link href={heroPrimaryCta.href} className={ctaClass("primary")}>
                  {heroPrimaryCta.label}
                </Link>
              </div>
            ) : null}

            {ctas && ctas.length > 0 ? (
              <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
                {ctas.map((cta) => (
                  <Link key={cta.href + cta.label} href={cta.href} className={ctaClass(cta.variant)}>
                    {cta.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section
          className="nn-premium-lessons-hub-body mt-3 rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[0_14px_40px_color-mix(in_srgb,var(--palette-heading)_8%,transparent)] sm:mt-4 sm:p-4 lg:p-5"
          data-nn-premium-lessons-hub-body
        >
          {children}
        </section>
      </div>
    </div>
  );
}