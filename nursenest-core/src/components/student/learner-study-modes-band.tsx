"use client";

import Link from "next/link";
import { BookOpen, Brain, Crosshair, LayoutList } from "lucide-react";
import { TrackedStudyLoopCatLink } from "@/components/student/tracked-study-loop-cat-link";
import { resolveStudyLoopCatDestination } from "@/lib/exam-pathways/study-loop-cat-routing";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { CANONICAL_LEARNER_ROUTES } from "@/lib/navigation/learner-primary-nav";

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const q = `pathwayId=${encodeURIComponent(pathwayId)}`;
  return base.includes("?") ? `${base}&${q}` : `${base}?${q}`;
}

function catStartFromSnapshot(snapshot: PremiumDashboardSnapshot): string {
  const ids = snapshot.pathways.map((p) => p.pathwayId);
  const destination = resolveStudyLoopCatDestination({
    authState: "signed_in",
    pathwayId: snapshot.learnerPath,
    availablePathwayIds: ids,
    intent: "start",
  });
  return destination.href;
}

/**
 * Above-the-fold study mode grid: Lessons, Flashcards, Practice Questions, Adaptive CAT.
 * CAT uses premium accent styling; practice bank is clearly tutor/drill-oriented copy.
 */
export function LearnerStudyModesBand({
  t,
  snapshot,
}: {
  t: LearnerMarketingT;
  snapshot: PremiumDashboardSnapshot;
}) {
  const pathwayId =
    snapshot.pathways.find((p) => p.pathwayId === snapshot.learnerPath)?.pathwayId ??
    snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
    snapshot.pathways[0]?.pathwayId ??
    null;

  const lessonsHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.lessons, pathwayId);
  const flashHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.flashcards, pathwayId);
  const practiceHref = withPathwayQuery(CANONICAL_LEARNER_ROUTES.practice, pathwayId);
  const catHref = catStartFromSnapshot(snapshot);

  return (
    <div className="nn-dash-study-modes-grid grid gap-3 min-[520px]:grid-cols-2 min-[1100px]:grid-cols-4">
      <Link
        href={lessonsHref}
        className="group flex min-h-[8.5rem] flex-col justify-between rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success)]">
            <BookOpen className="h-5 w-5" aria-hidden strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">{t("learner.studyModes.lessons.title")}</h3>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{t("learner.studyModes.lessons.desc")}</p>
          </div>
        </div>
        <span className="mt-3 text-xs font-semibold text-[var(--semantic-success)] group-hover:underline">{t("learner.studyModes.lessons.cta")}</span>
      </Link>

      <Link
        href={flashHref}
        className="group flex min-h-[8.5rem] flex-col justify-between rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_07%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-3)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_92%,var(--semantic-text-primary))]">
            <Brain className="h-5 w-5" aria-hidden strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">{t("learner.studyModes.flashcards.title")}</h3>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{t("learner.studyModes.flashcards.desc")}</p>
          </div>
        </div>
        <span className="mt-3 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))] group-hover:underline">
          {t("learner.studyModes.flashcards.cta")}
        </span>
      </Link>

      <Link
        href={practiceHref}
        className="group flex min-h-[8.5rem] flex-col justify-between rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-info)]">
            <LayoutList className="h-5 w-5" aria-hidden strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">{t("learner.studyModes.practice.title")}</h3>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{t("learner.studyModes.practice.desc")}</p>
          </div>
        </div>
        <span className="mt-3 text-xs font-semibold text-[var(--semantic-info)] group-hover:underline">{t("learner.studyModes.practice.cta")}</span>
      </Link>

      <TrackedStudyLoopCatLink
        href={catHref}
        sourceSurface="dashboard_study_modes_grid"
        pathwayId={pathwayId}
        dashboardCatCard="study_modes_premium"
        className="group relative flex min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-chart-4)_48%,var(--semantic-border-soft))] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-chart-4)_14%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] p-4 shadow-[0_10px_36px_color-mix(in_srgb,var(--semantic-chart-4)_16%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--semantic-chart-4)_28%,transparent)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none"
      >
        <div aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-4)_18%,transparent)] blur-2xl" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-4)_18%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-4)_95%,var(--semantic-text-primary))] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--semantic-chart-4)_25%,transparent)]">
            <Crosshair className="h-5 w-5" aria-hidden strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--semantic-chart-4)_88%,var(--semantic-text-secondary))]">
              {t("learner.studyModes.cat.kicker")}
            </p>
            <h3 className="mt-0.5 text-sm font-bold text-[var(--semantic-text-primary)]">{t("learner.studyModes.cat.title")}</h3>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{t("learner.studyModes.cat.desc")}</p>
          </div>
        </div>
        <span className="relative mt-3 inline-flex items-center text-xs font-bold text-[color-mix(in_srgb,var(--semantic-chart-4)_95%,var(--semantic-brand))] group-hover:underline">
          {t("learner.studyModes.cat.cta")}
        </span>
      </TrackedStudyLoopCatLink>
    </div>
  );
}
