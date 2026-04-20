import Link from "next/link";
import { GLOBAL_ROOT_HOMEPAGE } from "@/lib/marketing/countries/registry";

/** Canada-first, globally inclusive hub strip for `/` — composed immediately after the primary home hero in the home body. */
export function GlobalMarketingHomeIntro() {
  const c = GLOBAL_ROOT_HOMEPAGE;
  return (
    <section
      className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--surface-base))]"
      aria-label="Global marketing overview"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{c.brandLine}</p>
        {/* One <h1> per page: primary product hero (`HomeConversionHero`); this intro uses h2 with the same visual scale. */}
        <h2 className="nn-marketing-h1 mt-2 max-w-3xl text-balance">{c.headline}</h2>
        <p className="nn-marketing-body mt-3 max-w-3xl text-pretty text-[var(--semantic-text-muted)]">{c.subheadline}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
          <Link href="/canada" className="nn-nav-cta inline-flex min-h-[40px] items-center rounded-xl px-4 py-2">
            {c.primaryCta.label}
          </Link>
          <Link
            href="/us"
            className="inline-flex min-h-[40px] items-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_30%,transparent)] px-4 py-2 text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_48%,transparent)]"
          >
            {c.secondaryCta.label}
          </Link>
          <Link
            href="/philippines"
            className="inline-flex min-h-[40px] items-center rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,transparent)]"
          >
            Philippines hub
          </Link>
          <Link
            href="/middle-east"
            className="inline-flex min-h-[40px] items-center rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2 text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,transparent)]"
          >
            Middle East hub
          </Link>
        </div>
      </div>
    </section>
  );
}
