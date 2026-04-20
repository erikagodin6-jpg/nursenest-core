"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatEyebrow, formatTitleCase } from "@/lib/format/text-case";
import { LEARNER_ACCOUNT_NAV_GROUPS } from "@/lib/learner/learner-account-nav-groups";

function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  if (href === "/app/account/overview") {
    return pathname === "/app/account/overview";
  }
  if (href === "/app/account") {
    return pathname === "/app/account";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LearnerAccountNav() {
  const pathname = usePathname();
  const { t, locale } = useMarketingI18n();

  return (
    <nav
      aria-label={t("learner.account.nav.aria")}
      className="nn-card overflow-hidden"
    >
      <p className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("learner.account.nav.sidebarLabel")}
      </p>
      <div className="max-h-[min(55vh,26rem)] overflow-y-auto overflow-x-auto p-2 lg:max-h-none lg:overflow-x-visible">
        {LEARNER_ACCOUNT_NAV_GROUPS.map((group) => (
          <div key={group.sectionKey} className="mb-3 last:mb-0">
            <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:px-3">
              {formatEyebrow(t(group.sectionKey), locale)}
            </p>
            <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
              {group.items.map(({ href, key }) => {
                const active = isActive(pathname, href);
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
                      {formatTitleCase(t(key), locale)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
