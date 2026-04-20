"use client";

import Link from "next/link";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";

const FALLBACK_REGION = "CA" as const;

const SAFE_NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/lessons", label: "Exam pathways" },
  { href: "/canada", label: "Canada hub" },
  { href: "/us", label: "US hub" },
] as const;

const navLinkClass =
  "whitespace-nowrap text-sm font-medium text-[var(--nav-fg)] underline-offset-4 hover:underline";

export type MarketingHomeSafeModeLayout = "embedded" | "standalone";

export type MarketingHomeSafeModeProps = {
  /**
   * `embedded`: hero + CTAs only (SiteHeader / failsafe already provides logo, nav, theme, region).
   * `standalone`: full top row (brand + nav + auth CTAs) when no parent header is present.
   */
  layout?: MarketingHomeSafeModeLayout;
  onRetry?: () => void;
};

/**
 * Static, dependency-light homepage body for production stability when i18n shards, data loaders,
 * or render trees fail. Copy and links are fixed English; no DB or async marketing loads.
 */
export function MarketingHomeSafeMode({ layout = "embedded", onRetry }: MarketingHomeSafeModeProps) {
  const title = defaultHomeMetaTitle(FALLBACK_REGION);
  const subtitle = defaultHomeMetaDescription(FALLBACK_REGION);

  return (
    <section
      data-nn-home-safe-mode="1"
      data-nn-home-safe-mode-layout={layout}
      className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))] bg-[var(--page-bg)] text-[var(--semantic-text-primary)]"
    >
      <div className="nn-section-shell py-10 sm:py-12">
        {layout === "standalone" ? (
          <div className="flex flex-col gap-8 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))] pb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <Link href="/" className="inline-flex min-w-0 shrink-0 items-center gap-2" aria-label="NurseNest home">
                <HeaderBrandLockup />
              </Link>
              <nav aria-label="Safe mode navigation" className="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-2 md:justify-center">
                {SAFE_NAV_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} className={navLinkClass}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-[var(--nav-border)] px-3 py-2 text-sm font-semibold text-[var(--nav-fg)]"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[var(--semantic-brand)] px-3 py-2 text-sm font-semibold text-[var(--semantic-brand-contrast)]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className={layout === "standalone" ? "mt-10" : undefined}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Canada-first exam prep
          </p>
          <h1 className="nn-marketing-h1 mt-2 text-[var(--theme-heading-text)]">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-balance text-[var(--semantic-text-muted)]">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)]"
            >
              Start free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-[var(--semantic-border-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)]"
            >
              View pricing
            </Link>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex min-h-[44px] items-center rounded-xl border border-[var(--semantic-border-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,transparent)]"
              >
                Try again
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
