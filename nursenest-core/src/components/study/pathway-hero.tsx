import type { ReactNode } from "react";
import Link from "next/link";

type CtaButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost";
};

type Props = {
  /** Optional kicker above H1 (pathway + region, etc.) */
  eyebrow?: ReactNode;
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
 * Shared hero header for marketing study hubs (e.g. practice questions).
 * The public lessons library hub uses `LessonsPageShell` with a centered hero layout instead.
 */
export function PathwayHero({ eyebrow, title, subtitle, toolbar, ctas, backLink }: Props) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm ring-1 ring-black/[0.015] sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--semantic-brand)] via-[var(--semantic-info)] to-[var(--semantic-success)] opacity-75" />
      <div className="relative max-w-4xl">
        {backLink ? (
          <Link
            href={backLink.href}
            className="mb-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            ← {backLink.label}
          </Link>
        ) : null}

        {eyebrow ? <div className={backLink ? "mb-2" : "mb-3"}>{eyebrow}</div> : null}

        <h1 className="text-3xl font-bold leading-[1.08] tracking-tight text-[var(--theme-heading-text)] sm:text-[2.35rem] lg:text-[2.85rem]">
          {title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--theme-muted-text)] sm:text-base sm:leading-7">{subtitle}</p>

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
  const base = "inline-flex min-h-[46px] items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold transition-colors";
  switch (variant) {
    case "primary":
      return `${base} bg-[var(--role-cta)] text-[var(--role-cta-foreground)] shadow-sm hover:bg-[var(--role-cta-hover)]`;
    case "outline":
      return `${base} border border-[var(--semantic-border-soft)] bg-white text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_4%,white)]`;
    case "ghost":
      return `${base} px-4 text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,transparent)]`;
  }
}
