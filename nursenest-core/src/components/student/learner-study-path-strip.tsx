"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { CANONICAL_LEARNER_ROUTES } from "@/lib/navigation/learner-primary-nav";

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId)}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

type StepId = "hub" | "learn" | "practice" | "review";

/**
 * Persistent “guided loop” strip: Hub → Learn → Practice → Review.
 * Highlights the step that matches the current route so study feels structured, not random.
 */
export function LearnerStudyPathStrip({ pathwayId }: { pathwayId: string | null }) {
  const pathname = usePathname() ?? "";
  const { t } = useMarketingI18n();

  const steps = useMemo(() => {
    const hubHref = "/app";
    const lessonsHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.lessons, pathwayId);
    const practiceHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.practice, pathwayId);
    const reviewHref = CANONICAL_LEARNER_ROUTES.reports;
    return [
      { id: "hub" as const, href: hubHref, label: t("learner.studyPath.stepHub") },
      { id: "learn" as const, href: lessonsHref, label: t("learner.studyPath.stepLearn") },
      { id: "practice" as const, href: practiceHref, label: t("learner.studyPath.stepPractice") },
      { id: "review" as const, href: reviewHref, label: t("learner.studyPath.stepReview") },
    ];
  }, [pathwayId, t]);

  const active: StepId | null = useMemo(() => {
    if (pathname === "/app") return "hub";
    if (pathname.startsWith("/app/lessons")) return "learn";
    if (pathname.startsWith("/app/questions")) return "practice";
    if (pathname.startsWith("/app/account/progress") || pathname.startsWith("/app/flashcards")) return "review";
    return null;
  }, [pathname]);

  return (
    <div
      className="border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_06%,var(--semantic-surface))] px-2 py-2 sm:px-3"
      aria-label={t("learner.studyPath.ariaLabel")}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 sm:justify-start">
        <p className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)] sm:mr-2 sm:w-auto sm:text-left">
          {t("learner.studyPath.eyebrow")}
        </p>
        <ol className="flex flex-wrap items-center justify-center gap-1 sm:justify-start">
          {steps.map((step, i) => {
            const isActive = active != null && step.id === active;
            return (
              <li key={step.id} className="flex items-center">
                {i > 0 ? (
                  <span className="mx-0.5 text-[var(--semantic-text-muted)]" aria-hidden>
                    →
                  </span>
                ) : null}
                <Link
                  href={step.href}
                  className={`inline-flex min-h-[2rem] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none transition-colors sm:text-xs ${
                    isActive
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-transparent bg-transparent text-[var(--semantic-text-secondary)] hover:bg-[color-mix(in_srgb,var(--semantic-text-primary)_04%,transparent)]"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-[color-mix(in_srgb,var(--semantic-brand)_85%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                        : "bg-[color-mix(in_srgb,var(--semantic-text-muted)_18%,var(--semantic-surface))] text-[var(--semantic-text-muted)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="max-w-[7.5rem] truncate sm:max-w-none">{step.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
