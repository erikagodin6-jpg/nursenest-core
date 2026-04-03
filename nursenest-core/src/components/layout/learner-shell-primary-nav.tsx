import Link from "next/link";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { getLearnerShellNavItems } from "@/config/global-nav-config";

export function LearnerShellPrimaryNav({ messages }: { messages: MarketingMessages }) {
  const items = getLearnerShellNavItems();
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
      {items.map((item) => {
        const label = formatMarketingMessage(messages, item.labelKey);
        const isDashboard = item.id === "learner-dashboard";
        return (
          <Link
            key={item.id}
            href={item.href}
            className={
              isDashboard
                ? "rounded-full border border-role-cta/25 bg-role-cta-soft px-3 py-2 text-role-cta-on-soft"
                : "rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-menu-text)] hover:bg-[var(--accent-soft)]"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
