"use client";

import Link from "next/link";
import { getLearnerShellNavItems } from "@/config/global-nav-config";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerShellPrimaryNav() {
  const { t } = useMarketingI18n();
  const items = getLearnerShellNavItems();
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
      {items.map((item) => {
        const label = t(item.labelKey);
        const isDashboard = item.id === "learner-dashboard";
        return (
          <Link
            key={item.id}
            href={item.href}
            className={
              isDashboard
                ? "max-w-full min-w-0 rounded-full border border-role-cta/25 bg-role-cta-soft px-3 py-2 text-start leading-snug text-role-cta-on-soft break-words [overflow-wrap:anywhere]"
                : "max-w-full min-w-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-start leading-snug text-[var(--theme-menu-text)] break-words [overflow-wrap:anywhere] hover:bg-[var(--accent-soft)]"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
