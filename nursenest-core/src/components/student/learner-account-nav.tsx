"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type NavItem = { href: string; key: string };
type NavGroup = { sectionKey: string; items: readonly NavItem[] };

const GROUPS: readonly NavGroup[] = [
  {
    sectionKey: "learner.account.nav.groupStudy",
    items: [
      { href: "/app", key: "learner.account.nav.dashboard" },
      { href: "/app/account/overview", key: "learner.account.nav.overview" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupPerformance",
    items: [
      { href: "/app/account/report-card", key: "learner.account.nav.reportCard" },
      { href: "/app/account/readiness", key: "learner.account.nav.readiness" },
      { href: "/app/account/progress", key: "learner.account.nav.progress" },
      { href: "/app/account/question-bank-performance", key: "learner.account.nav.questionBankPerf" },
      { href: "/app/account/focus-areas", key: "learner.account.nav.focusAreas" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupActivity",
    items: [
      { href: "/app/account/study-history", key: "learner.account.nav.studyHistory" },
      { href: "/app/account/cat-history", key: "learner.account.nav.catHistory" },
      { href: "/app/account/review-queue", key: "learner.account.nav.reviewQueue" },
    ],
  },
  {
    sectionKey: "learner.account.nav.groupAccount",
    items: [
      { href: "/app/account/billing", key: "learner.account.nav.billing" },
      { href: "/app/account/personal", key: "learner.account.nav.personal" },
      { href: "/app/account/study-preferences", key: "learner.account.nav.settingsHub" },
      { href: "/app/account/security", key: "learner.account.nav.security" },
    ],
  },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  if (href === "/app/account/overview") {
    return pathname === "/app/account/overview" || pathname === "/app/account";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LearnerAccountNav() {
  const pathname = usePathname();
  const { t } = useMarketingI18n();

  return (
    <nav
      aria-label={t("learner.account.nav.aria")}
      className="nn-card overflow-hidden"
    >
      <p className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("learner.account.nav.sidebarLabel")}
      </p>
      <div className="max-h-[min(55vh,26rem)] overflow-y-auto overflow-x-auto p-2 lg:max-h-none lg:overflow-x-visible">
        {GROUPS.map((group) => (
          <div key={group.sectionKey} className="mb-3 last:mb-0">
            <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:px-3">
              {t(group.sectionKey)}
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
                      {t(key)}
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
