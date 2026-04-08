"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const LINKS = [
  { href: "/app/account/overview", key: "learner.account.nav.overview" as const },
  { href: "/app/account/report-card", key: "learner.account.nav.reportCard" as const },
  { href: "/app/account/readiness", key: "learner.account.nav.readiness" as const },
  { href: "/app/account/progress", key: "learner.account.nav.progress" as const },
  { href: "/app/account/billing", key: "learner.account.nav.billing" as const },
  { href: "/app/account/personal", key: "learner.account.nav.personal" as const },
  { href: "/app/account/study-preferences", key: "learner.account.nav.settingsHub" as const },
  { href: "/app/account/security", key: "learner.account.nav.security" as const },
] as const;

export function LearnerAccountNav() {
  const pathname = usePathname();
  const { t } = useMarketingI18n();

  return (
    <nav
      aria-label={t("learner.account.nav.aria")}
      className="nn-card overflow-hidden"
    >
      <p className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("learner.account.nav.sectionTitle")}
      </p>
      <ul className="flex max-h-[min(50vh,22rem)] gap-1 overflow-x-auto overflow-y-auto p-2 lg:max-h-none lg:flex-col lg:overflow-x-visible">
        {LINKS.map(({ href, key }) => {
          const active =
            pathname === href ||
            (href === "/app/account/overview" && pathname === "/app/account") ||
            (href !== "/app/account/overview" && pathname.startsWith(href));
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                className={`block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:whitespace-normal ${
                  active
                    ? "bg-role-cta-soft text-role-cta-on-soft ring-1 ring-role-cta/25"
                    : "text-[var(--theme-menu-text)] hover:bg-[var(--surface-interactive-hover)]"
                }`}
              >
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
