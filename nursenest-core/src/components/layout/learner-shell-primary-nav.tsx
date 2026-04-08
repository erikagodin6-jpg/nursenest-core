"use client";

import Link from "next/link";
import { getLearnerShellNavItems } from "@/config/global-nav-config";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function LearnerShellPrimaryNav() {
  const { t } = useMarketingI18n();
  const items = getLearnerShellNavItems();
  return (
    <nav className="flex flex-wrap items-center gap-3 md:gap-4 lg:gap-6">
      {items.map((item) => {
        const label = t(item.labelKey);
        const isDashboard = item.id === "learner-dashboard";
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              if (item.id === "learner-lessons") {
                trackClientEvent(PH.learnerNavLessonsClick, {
                  country: readMarketingRegionFromDocument(),
                  surface: "learner_primary_nav",
                });
              }
            }}
            className={
              isDashboard
                ? "nn-marketing-body-sm max-w-full min-w-0 rounded-full border border-role-cta/25 bg-role-cta-soft px-3 py-2 text-start font-medium tracking-normal leading-snug text-role-cta-on-soft break-words transition-colors duration-150 [overflow-wrap:anywhere]"
                : "nn-marketing-body-sm max-w-full min-w-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-start font-medium tracking-normal leading-snug text-[var(--theme-body-text)] break-words transition-colors duration-150 [overflow-wrap:anywhere] hover:bg-[var(--accent-soft)] hover:text-primary"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
