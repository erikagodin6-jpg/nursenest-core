"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n, useMarketingLocale } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import {
  buildLearnerPrimaryNavItems,
  isLearnerPrimaryNavKey,
  learnerPrimaryNavLabelKey,
  type LearnerPrimaryNavItem,
} from "@/lib/navigation/learner-primary-nav";

export type LearnerShellNavProps = {
  pathwayPillLabel: string | null;
  pathwayId: string | null;
  pathwayHubHref: string | null;
  examsLabel: "CAT Exams" | "Exams";
};

type NavItem = {
  id: LearnerPrimaryNavItem["key"];
  label: string;
  href: string;
  matchPrefix: string;
};

function useLearnerNavItems({
  pathwayId,
  examsLabel,
}: Pick<LearnerShellNavProps, "pathwayId" | "examsLabel">) {
  const { t } = useMarketingI18n();
  const locale = useMarketingLocale();

  return useMemo(() => {
    const built = buildLearnerPrimaryNavItems(pathwayId, { examsLabel });
    return built.map((row) => {
      const labelKey = learnerPrimaryNavLabelKey(row.key);
      let label = formatTitleCase(t(labelKey), locale);
      if (row.key === "cat" && examsLabel === "Exams") {
        label = formatTitleCase(t("learner.shell.nav.examsSurface"), locale);
      }
      return {
        id: row.key,
        href: row.href,
        matchPrefix: row.matchBase,
        label,
      };
    });
  }, [pathwayId, examsLabel, t, locale]);
}

/** Pathway hub pill — sits in the top chrome row next to the logo. */
export function LearnerShellPathwayPill({
  pathwayPillLabel,
  pathwayHubHref,
}: Pick<LearnerShellNavProps, "pathwayPillLabel" | "pathwayHubHref">) {
  const pathwayHref = pathwayHubHref ?? "/app";
  const pathwayLabel = pathwayPillLabel ?? "Pathway";

  return (
    <Link
      href={pathwayHref}
      onClick={() => {
        trackClientEvent(PH.learnerNavClick, {
          actor: "authenticated",
          nav_id: "pathway-pill",
          href: pathwayHref,
          country: readMarketingRegionFromDocument(),
          surface: "learner_primary_nav",
        });
      }}
      className="nn-header-tier-pill max-w-[12rem] shrink-0 truncate sm:max-w-[14rem]"
      aria-label={`Open your pathway hub: ${pathwayLabel}`}
    >
      {pathwayLabel}
    </Link>
  );
}

/** Full-width study destinations row (tablet/desktop). Flex-wrap keeps all links visible without horizontal scroll. */
export function LearnerShellDesktopStudyLinks({
  pathwayId,
  examsLabel,
}: Pick<LearnerShellNavProps, "pathwayId" | "examsLabel">) {
  const pathname = usePathname();
  const items = useLearnerNavItems({ pathwayId, examsLabel });

  return (
    <nav className="hidden w-full md:block" aria-label="Learner primary actions">
      <div className="flex w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:justify-start sm:gap-x-2 sm:gap-y-2 lg:gap-x-3">
        {items.map((item) => {
          const active = pathname.startsWith(item.matchPrefix);
          const isPrimarySurface = isLearnerPrimaryNavKey(item.id);
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
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
                active
                  ? "nn-marketing-body-sm max-w-full min-w-0 rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2.5 py-1.5 text-start font-medium leading-snug text-[var(--semantic-brand)] transition-colors duration-150 sm:px-3 sm:py-2"
                  : isPrimarySurface
                    ? "nn-marketing-body-sm max-w-full min-w-0 rounded-full px-2.5 py-1.5 text-start leading-snug transition-colors duration-150 sm:px-3 sm:py-2 nn-learner-shell-link--primary hover:text-primary"
                    : "nn-marketing-body-sm max-w-full min-w-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 text-start font-medium leading-snug text-[var(--theme-body-text)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-primary sm:px-3 sm:py-2"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function LearnerShellMobileBottomNav({
  pathwayPillLabel,
  pathwayId,
  pathwayHubHref,
  examsLabel,
}: LearnerShellNavProps) {
  const pathname = usePathname();
  const items = useLearnerNavItems({ pathwayId, examsLabel });
  const pathwayHref = pathwayHubHref ?? "/app";
  const pathwayLabel = pathwayPillLabel ?? "Pathway";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_20px_-10px_color-mix(in_srgb,var(--semantic-text-primary)_10%,transparent)] md:hidden"
      aria-label="Learner bottom navigation"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-1">
        <Link
          href={pathwayHref}
          title={pathwayLabel}
          onClick={() => {
            trackClientEvent(PH.learnerNavClick, {
              actor: "authenticated",
              nav_id: "pathway-pill",
              href: pathwayHref,
              country: readMarketingRegionFromDocument(),
              surface: "learner_bottom_nav",
            });
          }}
          className="nn-header-tier-pill nn-header-tier-pill--compact inline-flex min-h-11 max-w-[5.5rem] shrink-0 items-center justify-center truncate sm:max-w-none"
          aria-label={`Open your pathway hub: ${pathwayLabel}`}
        >
          {pathwayLabel}
        </Link>
        {items.map((item) => {
          const active = pathname.startsWith(item.matchPrefix);
          const isPrimarySurface = isLearnerPrimaryNavKey(item.id);
          return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  trackClientEvent(PH.learnerNavClick, {
                    actor: "authenticated",
                    nav_id: item.id,
                    href: item.href,
                    country: readMarketingRegionFromDocument(),
                    surface: "learner_bottom_nav",
                  });
                }}
                className={
                  active
                    ? "inline-flex min-h-11 min-w-0 max-w-[5.25rem] flex-1 items-center justify-center rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-1.5 text-[11px] font-semibold leading-tight text-[var(--semantic-brand)] sm:max-w-none sm:px-2 sm:text-xs"
                  : isPrimarySurface
                    ? "nn-learner-shell-bottom-link--primary inline-flex min-h-11 min-w-0 max-w-[5.25rem] flex-1 items-center justify-center rounded-full px-1.5 text-[11px] leading-tight text-[var(--theme-body-text)] sm:max-w-none sm:px-2 sm:text-xs"
                    : "inline-flex min-h-11 min-w-0 max-w-[5.25rem] flex-1 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-1.5 text-[11px] font-semibold leading-tight text-[var(--theme-body-text)] sm:max-w-none sm:px-2 sm:text-xs"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
