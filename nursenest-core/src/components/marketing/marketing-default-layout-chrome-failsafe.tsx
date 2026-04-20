"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";
import { ThemePicker } from "@/components/theme/theme-picker";

const PRIMARY_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/lessons", label: "Exam pathways" },
] as const;

/**
 * Minimal marketing chrome when the default marketing layout cannot load full
 * `SiteHeader` / `SiteFooter` (i18n shard failure, RSC throw, etc.). Uses only
 * components that do not depend on `MarketingI18nProvider` message keys.
 */
export function MarketingDefaultLayoutChromeFailsafeShell({ children }: { children: ReactNode }) {
  return (
    <div className="nn-marketing-surface flex min-h-screen flex-col bg-[var(--page-bg)]">
      <header className="sticky top-0 z-[100] border-b border-[var(--header-nav-border)] bg-[var(--nav-bg)] text-[var(--nav-fg)]">
        <div className="nn-section-shell flex min-h-[3.25rem] w-full min-w-0 items-center justify-between gap-3 py-2.5">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="NurseNest home">
            <HeaderBrandLockup />
          </Link>
          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-x-5 gap-y-1 md:flex"
          >
            {PRIMARY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-[var(--nav-fg)] underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/canada"
              className="whitespace-nowrap text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
            >
              Canada hub
            </Link>
            <Link href="/us" className="whitespace-nowrap text-sm font-medium text-[var(--nav-fg)] hover:underline">
              US hub
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs font-medium text-[var(--theme-muted-text)] sm:inline">EN</span>
            <ThemePicker className="shrink-0" />
            <Link
              href="/login"
              className="rounded-lg border border-[var(--nav-border)] px-2.5 py-1.5 text-xs font-semibold sm:text-sm"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--semantic-brand)] px-2.5 py-1.5 text-xs font-semibold text-[var(--semantic-brand-contrast)] sm:text-sm"
            >
              Sign up
            </Link>
          </div>
        </div>
        <nav
          aria-label="Primary navigation mobile"
          className="nn-section-shell flex flex-wrap gap-x-3 gap-y-2 border-t border-[var(--header-nav-border)] py-2.5 md:hidden"
        >
          {PRIMARY_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-xs font-semibold">
              {item.label}
            </Link>
          ))}
          <Link href="/canada" className="text-xs font-semibold text-[var(--semantic-brand)]">
            Canada
          </Link>
          <Link href="/us" className="text-xs font-semibold">
            US
          </Link>
        </nav>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">{children}</main>

      <footer className="mt-auto border-t border-[var(--footer-border)] bg-[var(--footer-bg)] py-5 text-[var(--footer-fg)]">
        <div className="nn-section-shell text-center text-xs text-[var(--theme-muted-text)]">
          <p className="font-medium text-[var(--theme-heading-text)]">NurseNest</p>
          <p className="mt-1">Canada-first nursing exam prep — global pathways.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy
            </Link>
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            <Link href="/contact" className="underline underline-offset-2">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
