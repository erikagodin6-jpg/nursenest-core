import Link from "next/link";
import { Suspense } from "react";

import { OptionalAuthIsland } from "@/components/marketing-static/optional-auth-island";

const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

const TIER_NAV_LINKS = [
  { href: "/canada/rn/nclex-rn", label: "RN" },
  { href: "/canada/pn/rex-pn", label: "RPN" },
  { href: "/canada/np/cnple", label: "NP" },
  { href: "/new-grad", label: "New Grad" },
  { href: "/allied/allied-health", label: "Allied" },
];

export function StaticMarketingHeader(): JSX.Element {
  return (
    <header className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] bg-[color-mix(in_srgb,var(--theme-surface)_94%,transparent)] text-[var(--semantic-text-primary)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--semantic-text-primary)]">
            NurseNest
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-[color-mix(in_srgb,var(--semantic-text-primary)_78%,transparent)]">
            {PRIMARY_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-[var(--semantic-brand)]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] px-3 py-2 font-medium text-[color-mix(in_srgb,var(--semantic-text-primary)_90%,transparent)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,transparent)]"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-[var(--semantic-brand)] px-3 py-2 font-semibold text-white transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_88%,black)]"
            >
              Start Free
            </Link>
            <Suspense fallback={null}>
              <OptionalAuthIsland />
            </Suspense>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-text-primary)_85%,transparent)]">
          {TIER_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] px-3 py-1 transition-colors hover:border-[var(--semantic-brand)] hover:text-[var(--semantic-brand)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
