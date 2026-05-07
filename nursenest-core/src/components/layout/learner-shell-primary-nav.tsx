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
  buildOptionalClinicalScenariosShellNavItem,
  buildOptionalOsceScenarioShellNavItems,
  buildOptionalPrintablesShellNavItem,
  buildOptionalStudyToolsShellNavItem,
  isLearnerPrimaryNavKey,
  learnerPrimaryNavLabelKey,
  type LearnerShellStudyNavRowId,
} from "@/lib/navigation/learner-primary-nav";
import { SignOutButton } from "@/components/auth/sign-out-button";

const STUDY_TOOLS_ACTIVE_PREFIXES = [
  "/app/study-tools",
  "/app/matching",
  "/app/fill-in-the-blank",
  "/app/ordering",
  "/app/lab-drills",
  "/app/medication-drills",
] as const;

type LearnerShellNavRow = {
  id: LearnerShellStudyNavRowId;
  href: string;
  matchPrefix: string;
  matchPrefixes?: readonly string[];
  label: string;
};

function isLearnerShellNavActive(pathname: string, item: { matchPrefix: string; matchPrefixes?: readonly string[] }) {
  if (item.matchPrefixes?.length) {
    return item.matchPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  }
  return pathname.startsWith(item.matchPrefix);
}

export type LearnerShellNavProps = {
  pathwayPillLabel: string | null;
  pathwayId: string | null;
  pathwayHubHref: string | null;
  examsLabel: "CAT Exams" | "Exams";
  /** When true, show Printouts in learner shell nav (server: printable store + public flag). */
  printablesNavVisible?: boolean;
};

function useLearnerNavItems({
  pathwayId,
  examsLabel,
  printablesNavVisible = false,
}: Pick<LearnerShellNavProps, "pathwayId" | "examsLabel" | "printablesNavVisible">) {
  const { t } = useMarketingI18n();
  const locale = useMarketingLocale();

  return useMemo(() => {
    const built = buildLearnerPrimaryNavItems(pathwayId, { examsLabel });
    const rows: LearnerShellNavRow[] = built.map((row) => {
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
    const studyTools = buildOptionalStudyToolsShellNavItem(pathwayId);
    let insertAt = Math.min(3, rows.length);
    if (studyTools) {
      const label = formatTitleCase(t(studyTools.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: studyTools.id,
        href: studyTools.href,
        matchPrefix: studyTools.matchPrefix,
        matchPrefixes: STUDY_TOOLS_ACTIVE_PREFIXES,
        label,
      });
      insertAt += 1;
    }
    const printables = buildOptionalPrintablesShellNavItem(pathwayId, printablesNavVisible);
    if (printables) {
      const label = formatTitleCase(t(printables.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: printables.id,
        href: printables.href,
        matchPrefix: printables.matchPrefix,
        label,
      });
      insertAt += 1;
    }
    for (const row of buildOptionalOsceScenarioShellNavItems(pathwayId)) {
      const label = formatTitleCase(t(row.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: row.id,
        href: row.href,
        matchPrefix: row.matchPrefix,
        label,
      });
      insertAt += 1;
    }
    const clinical = buildOptionalClinicalScenariosShellNavItem(pathwayId);
    if (clinical) {
      const label = formatTitleCase(t(clinical.labelKey), locale);
      rows.splice(insertAt, 0, {
        id: clinical.id,
        href: clinical.href,
        matchPrefix: clinical.matchPrefix,
        label,
      });
      insertAt += 1;
    }
    return rows;
  }, [pathwayId, examsLabel, printablesNavVisible, t, locale]);
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
  printablesNavVisible,
}: Pick<LearnerShellNavProps, "pathwayId" | "examsLabel" | "printablesNavVisible">) {
  const pathname = usePathname();
  const items = useLearnerNavItems({ pathwayId, examsLabel, printablesNavVisible });

  // `max-md:hidden` — avoid Tailwind v4 `hidden` + `md:block` display ordering bugs (desktop nav stuck display:none).
  return (
    <nav
      className="w-full max-md:hidden"
      aria-label="Learner primary actions"
      data-nn-learner-shell-study-nav=""
    >
      <div className="grid w-full grid-cols-1 gap-2 md:max-lg:grid-cols-2 md:max-lg:gap-x-2 md:max-lg:gap-y-2 lg:flex lg:flex-wrap lg:items-center lg:justify-start lg:gap-x-2 lg:gap-y-2 xl:gap-x-3">
        {items.map((item) => {
          const active = isLearnerShellNavActive(pathname, item);
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
                  ? "nn-marketing-body-sm max-w-full min-h-11 min-w-0 touch-manipulation rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2.5 py-1.5 text-start font-medium leading-snug text-[var(--semantic-brand)] transition-colors duration-150 sm:px-3 sm:py-2 md:max-lg:w-full md:max-lg:justify-center md:max-lg:text-center lg:w-auto lg:justify-start lg:text-start"
                  : isPrimarySurface
                    ? "nn-marketing-body-sm max-w-full min-h-11 min-w-0 touch-manipulation rounded-full px-2.5 py-1.5 text-start leading-snug transition-colors duration-150 sm:px-3 sm:py-2 nn-learner-shell-link--primary hover:text-primary md:max-lg:flex md:max-lg:w-full md:max-lg:justify-center md:max-lg:text-center lg:inline-flex lg:w-auto lg:justify-start lg:text-start"
                    : "nn-marketing-body-sm max-w-full min-h-11 min-w-0 touch-manipulation rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 text-start font-medium leading-snug text-[var(--theme-body-text)] transition-colors duration-150 hover:bg-[var(--accent-soft)] hover:text-primary sm:px-3 sm:py-2 md:max-lg:flex md:max-lg:w-full md:max-lg:justify-center md:max-lg:text-center lg:inline-flex lg:w-auto lg:justify-start lg:text-start"
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
  printablesNavVisible,
}: LearnerShellNavProps) {
  const pathname = usePathname();
  const items = useLearnerNavItems({ pathwayId, examsLabel, printablesNavVisible });
  const pathwayHref = pathwayHubHref ?? "/app";
  const pathwayLabel = pathwayPillLabel ?? "Pathway";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_20px_-10px_color-mix(in_srgb,var(--semantic-text-primary)_10%,transparent)] md:hidden [overscroll-behavior-x:contain]"
      aria-label="Learner bottom navigation"
      data-nn-learner-shell-study-nav=""
    >
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-1.5 px-0.5">
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
          className="nn-header-tier-pill nn-header-tier-pill--compact inline-flex min-h-12 max-w-[min(100%,10rem)] shrink-0 touch-manipulation items-center justify-center truncate px-2 sm:max-w-none"
          aria-label={`Open your pathway hub: ${pathwayLabel}`}
        >
          {pathwayLabel}
        </Link>
        {items.map((item) => {
          const active = isLearnerShellNavActive(pathname, item);
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
                    ? "inline-flex min-h-12 min-w-0 max-w-[min(46vw,10rem)] flex-1 touch-manipulation items-center justify-center rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2 text-center text-xs font-semibold leading-snug text-[var(--semantic-brand)] sm:max-w-none sm:px-2.5"
                  : isPrimarySurface
                    ? "nn-learner-shell-bottom-link--primary inline-flex min-h-12 min-w-0 max-w-[min(46vw,10rem)] flex-1 touch-manipulation items-center justify-center rounded-full px-2 text-center text-xs leading-snug text-[var(--theme-body-text)] sm:max-w-none sm:px-2.5"
                    : "inline-flex min-h-12 min-w-0 max-w-[min(46vw,10rem)] flex-1 touch-manipulation items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 text-center text-xs font-semibold leading-snug text-[var(--theme-body-text)] sm:max-w-none sm:px-2.5"
              }
            >
              {item.label}
            </Link>
          );
        })}
        <SignOutButton className="inline-flex min-h-12 shrink-0 touch-manipulation items-center justify-center rounded-full border border-[var(--semantic-danger)]/35 bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--bg-card))] px-2.5 text-xs font-semibold leading-snug text-[var(--semantic-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:px-3" />
      </div>
    </nav>
  );
}
