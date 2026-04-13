"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";

type LearnerShellPrimaryNavProps = {
  hasActiveSubscription: boolean;
  pathwayPillLabel: string | null;
  pathwayId: string | null;
  pathwayHubHref: string | null;
  examsLabel: "CAT Exams" | "Exams";
};

type NavItem = {
  id: string;
  label: string;
  href: string;
  matchPrefix: string;
};

function sharedActionHref(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const query = `pathwayId=${encodeURIComponent(pathwayId)}`;
  return base.includes("?") ? `${base}&${query}` : `${base}?${query}`;
}

export function LearnerShellPrimaryNav({
  hasActiveSubscription,
  pathwayPillLabel,
  pathwayId,
  pathwayHubHref,
  examsLabel,
}: LearnerShellPrimaryNavProps) {
  const pathname = usePathname();
  if (!hasActiveSubscription) return null;

  const examsHref = examsLabel === "CAT Exams" && pathwayId ? appPathwayCatSessionStartPath(pathwayId) : "/app/exams";
  const items: NavItem[] = [
    { id: "lessons", label: "Lessons", href: sharedActionHref("/app/lessons", pathwayId), matchPrefix: "/app/lessons" },
    { id: "flashcards", label: "Flashcards", href: sharedActionHref("/app/flashcards", pathwayId), matchPrefix: "/app/flashcards" },
    { id: "practice", label: "Practice", href: sharedActionHref("/app/questions", pathwayId), matchPrefix: "/app/questions" },
    { id: "exams", label: examsLabel, href: examsHref, matchPrefix: examsLabel === "CAT Exams" ? "/app/practice-tests" : "/app/exams" },
  ];
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--surface-strong)] px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
        aria-label="Learner bottom navigation"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-5 gap-1">
          <Link
            href={pathwayHref}
            onClick={() => {
              trackClientEvent(PH.learnerNavClick, {
                actor: "authenticated",
                nav_id: "pathway-pill",
                href: pathwayHref,
                country: readMarketingRegionFromDocument(),
                surface: "learner_bottom_nav",
              });
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] px-2 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]"
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
                  ? "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] px-2 text-xs font-semibold text-[var(--semantic-brand)]"
                  : "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 text-xs font-semibold text-[var(--theme-body-text)]"
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
