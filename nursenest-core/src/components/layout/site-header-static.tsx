/**
 * 🧊 Static site header for public-static routes.
 *
 * No session/auth dependencies. No useSession(). No client-side auth refetch.
 * Pure static markup + minimal client interactivity (mobile menu).
 *
 * Use this in `(public-static)/layout.tsx` instead of SiteHeaderServer
 * (which depends on AuthSessionProvider / session context).
 */
"use client";

import Link from "next/link";
import { useState } from "react";

function StaticMobileMenuToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-[var(--theme-muted-text)] hover:bg-[var(--theme-card-bg)] hover:text-[var(--theme-heading-text)] md:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      {isOpen ? (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      )}
    </button>
  );
}

const STATIC_NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/nclex-rn", label: "NCLEX-RN" },
  { href: "/canada/rn", label: "Canada RN" },
  { href: "/np", label: "NP" },
  { href: "/faq", label: "FAQ" },
] as const;

export function SiteHeaderStatic() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--theme-border-soft)] bg-[var(--theme-page-bg)/95] backdrop-blur supports-[backdrop-filter]:bg-[var(--theme-page-bg)/80]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6" aria-label="Main navigation">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold text-[var(--theme-heading-text)]"
        >
          NurseNest
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex md:items-center md:gap-5">
          {STATIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--theme-muted-text)] transition hover:text-[var(--theme-heading-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Start free
          </Link>
        </div>

        <StaticMobileMenuToggle
          isOpen={mobileOpen}
          onToggle={() => setMobileOpen((o) => !o)}
        />
      </nav>

      {mobileOpen ? (
        <div className="border-t border-[var(--theme-border-soft)] md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {STATIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--theme-muted-text)] hover:bg-[var(--theme-card-bg)] hover:text-[var(--theme-heading-text)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-[var(--theme-border-soft)]" />
            <Link
              href="/login"
              className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-[var(--theme-card-bg)]"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-[var(--theme-card-bg)]"
              onClick={() => setMobileOpen(false)}
            >
              Start free
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}