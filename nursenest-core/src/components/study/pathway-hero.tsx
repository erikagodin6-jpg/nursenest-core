import type { ReactNode } from "react";
import Link from "next/link";

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
};

type Props = {
  /** Page H1 */
  title: string;
  /** One-line subtitle, max 120 chars */
  subtitle: string;
  /** Optional toolbar slot (e.g. search + country toggle on lessons page) */
  toolbar?: ReactNode;
  /** CTA group – primary, secondary, tertiary */
  ctas?: CtaButton[];
  /** Back link rendered above the title */
  backLink?: { label: string; href: string };
};

/**
 * Shared hero header used on both the Lessons hub and Questions hub pages.
 * Matches the existing LessonsPageShell header style so both surfaces look identical.
 */
export function PathwayHero({ title, subtitle, toolbar, ctas, backLink }: Props) {
  return (
    <header className="relative overflow-hidden rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-gradient-to-br from-[var(--hero-gradient-start)] via-[var(--semantic-surface)] to-[var(--hero-gradient-end)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7">
      {/* Subtle background glow blobs */}
      <div
        className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_7%,transparent)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_6%,transparent)] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        {backLink ? (
          <Link
            href={backLink.href}
            className="mb-3 inline-flex text-sm font-medium text-[var(--semantic-brand)] hover:underline"
          >
            ← {backLink.label}
          </Link>
        ) : null}

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--theme-muted-text)]">{subtitle}</p>

        {ctas && ctas.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <Link key={cta.href + cta.label} href={cta.href} className={ctaClass(cta.variant)}>
                {cta.label}
              </Link>
            ))}
          </div>
        ) : null}

        {toolbar ? <div className="mt-5">{toolbar}</div> : null}
      </div>
    </header>
  );
}

function ctaClass(variant: CtaButton["variant"]): string {
  const base = "inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors";
  switch (variant) {
    case "primary":
      return `${base} bg-[var(--semantic-success)] text-white hover:opacity-90`;
    case "outline":
      return `${base} border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]`;
    case "ghost":
      return `${base} text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,transparent)]`;
  }
}
