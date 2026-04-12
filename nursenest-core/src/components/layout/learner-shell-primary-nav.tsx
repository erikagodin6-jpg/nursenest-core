"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { getLearnerShellNavItems } from "@/config/global-nav-config";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";

/** Derive a short pill label from session data. */
function derivePillLabel(user: { tier?: string; alliedProfessionKey?: string | null } | undefined): string | null {
  if (!user?.tier) return null;
  if (user.tier === "ALLIED") {
    if (user.alliedProfessionKey) {
      const prof = ALLIED_PROFESSIONS.find((p) => p.professionKey === user.alliedProfessionKey);
      if (prof) {
        const match = prof.h1.match(/\(([A-Z/]+)\)/);
        return match ? match[1] : user.alliedProfessionKey.toUpperCase();
      }
    }
    return "Allied";
  }
  const map: Record<string, string> = { RN: "RN", RPN: "RPN", LVN_LPN: "PN", NP: "NP" };
  return map[user.tier] ?? user.tier;
}

export function LearnerShellPrimaryNav() {
  const { t } = useMarketingI18n();
  const items = getLearnerShellNavItems();
  const { data: sessionData } = useSession();
  const sessionUser = sessionData?.user as
    | { tier?: string; alliedProfessionKey?: string | null }
    | undefined;
  const pillLabel = derivePillLabel(sessionUser);

  return (
    <nav className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4">
      {/* Tier / career identity pill */}
      {pillLabel ? (
        <span
          className="inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]"
          aria-label={`Your pathway: ${pillLabel}`}
        >
          {pillLabel}
        </span>
      ) : null}
      {items.map((item) => {
        const label = t(item.labelKey);
        const isDashboard = item.id === "learner-dashboard";
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              trackClientEvent(PH.learnerNavClick, {
                actor: "authenticated",
                nav_id: item.id,
                href: item.href,
                country: readMarketingRegionFromDocument(),
                surface: "learner_primary_nav",
              });
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
