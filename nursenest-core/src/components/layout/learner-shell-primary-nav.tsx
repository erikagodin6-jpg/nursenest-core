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
  learnerPrimaryNavLabelKey,
  type LearnerPrimaryNavItem,
} from "@/lib/navigation/learner-primary-nav";

type LearnerShellPrimaryNavProps = {
  hasActiveSubscription: boolean;
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

export function LearnerShellPrimaryNav({
  hasActiveSubscription,
  pathwayPillLabel,
  pathwayId,
  pathwayHubHref,
  examsLabel,
}: LearnerShellPrimaryNavProps) {
  const pathname = usePathname();
  const { t } = useMarketingI18n();
  const locale = useMarketingLocale();

  const items: NavItem[] = useMemo(() => {
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

  if (!hasActiveSubscription) return null;

  const pathwayHref = pathwayHubHref ?? "/app";
  const pathwayLabel = pathwayPillLabel ?? "Pathway";

  return (
    <>
      <nav className="hidden flex-wrap items-center gap-2 md:flex md:gap-3 lg:gap-4" aria-label="Learner primary actions">
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
          className="inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]"
          aria-label={`Open your pathway hub: ${pathwayLabel}`}
        >
          {pathwayLabel}
        </Link>
        {items.map((item) => {
          const active = pathname.startsWith(item.matchPrefix);
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
                active
                  ? "nn-marketing-body-sm max-w-full min-w-0 rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-3 py-2 text-start font-medium leading-snug text-[var(--semantic-brand)] transition-colors duration-150"
                  : "nn-marketing-body-sm max-w-full min-w-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-start font-medium leading-snug text-[var(--theme-body-text)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-primary"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--surface-strong)] px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
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
            className="inline-flex min-h-11 max-w-[5.5rem] shrink-0 items-center justify-center truncate rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-2 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)] sm:max-w-none"
            aria-label={`Open your pathway hub: ${pathwayLabel}`}
          >
            {pathwayLabel}
          </Link>
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
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
                pathname.startsWith(item.matchPrefix)
                  ? "inline-flex min-h-11 min-w-0 max-w-[5.25rem] flex-1 items-center justify-center rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-1.5 text-[11px] font-semibold leading-tight text-[var(--semantic-brand)] sm:max-w-none sm:px-2 sm:text-xs"
                  : "inline-flex min-h-11 min-w-0 max-w-[5.25rem] flex-1 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-1.5 text-[11px] font-semibold leading-tight text-[var(--theme-body-text)] sm:max-w-none sm:px-2 sm:text-xs"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
