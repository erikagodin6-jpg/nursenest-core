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
  toolbar,
  ctas,
  backLink,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[radial-gradient(circle_at_50%_-20%,color-mix(in_srgb,var(--semantic-brand)_12%,transparent),transparent_45%),radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--semantic-panel-cool)_35%,transparent),transparent_42%),linear-gradient(165deg,var(--semantic-surface),var(--semantic-panel-muted))] shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div className="relative px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
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

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-muted-text)] sm:mt-2 sm:text-[0.9375rem]">
                {subtitle}
              </p>
            ) : null}
          </div>

          {toolbar ? <div className="mx-auto mt-4 w-full max-w-3xl sm:mt-5">{toolbar}</div> : null}

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

      <section className="mt-4 rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:mt-5 sm:p-4 lg:p-5">
        {children}
      </section>
    </div>
  );
}