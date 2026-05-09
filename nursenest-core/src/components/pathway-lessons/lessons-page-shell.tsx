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
  backLink?: { label: string; href: string };
  children: ReactNode;
};

function ctaClass(variant: CtaButton["variant"]): string {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-colors";
  switch (variant) {
    case "primary":
      return `${base} bg-[var(--semantic-success)] text-[var(--text-on-dark)] hover:opacity-90`;
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
  backLink,
  children,
}: Props) {
  return (
    <div
      className="nn-premium-pathway-hub"
      data-nn-lessons-marketing-hub="1"
      {...(pathwayTrack ? { "data-pathway-track": pathwayTrack } : {})}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <section aria-labelledby="nn-lessons-hub-title">
          <div className="nn-nursing-tier-hub-hero-band">
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

            {toolbar ? <div className="mx-auto mt-5 w-full max-w-3xl">{toolbar}</div> : null}

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

        <section className="nn-premium-lessons-hub-body mt-3 rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[0_14px_40px_color-mix(in_srgb,var(--palette-heading)_8%,transparent)] sm:mt-4 sm:p-4 lg:p-5">
          {children}
        </section>
      </div>
    </div>
  );
}