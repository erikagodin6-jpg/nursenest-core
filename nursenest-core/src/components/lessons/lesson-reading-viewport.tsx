"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ListTree, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { LessonSectionNav } from "@/components/lessons/lesson-section-nav";
import { LessonCompactProgressRail } from "@/components/lessons/lesson-compact-progress-rail";
import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type SectionEntry = {
  id: string;
  heading: string;
  kind?: PathwayLessonSectionKind | null;
};

/**
 * Reading-first lesson layout: dominant center column with constrained side rails.
 * Side navigation yields space before the teaching body does.
 */
export function LessonReadingViewport({
  sections,
  progress,
  progressVisible = false,
  children,
}: {
  sections: SectionEntry[];
  progress?: PathwayLessonProgressStatus | null;
  progressVisible?: boolean;
  children: ReactNode;
}) {
  const { t } = useMarketingI18n();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), []);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileDrawer();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileDrawerOpen, closeMobileDrawer]);

  return (
    <div
      className="nn-lesson-reading-viewport"
      data-nn-lesson-reading-viewport
      data-left-collapsed={leftCollapsed ? "true" : undefined}
      data-right-collapsed={rightCollapsed ? "true" : undefined}
    >
      <div className="nn-lesson-reading-viewport__mobile-bar">
        <button
          type="button"
          className="nn-lesson-reading-viewport__mobile-toc"
          onClick={() => setMobileDrawerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={mobileDrawerOpen}
        >
          <ListTree className="h-5 w-5 shrink-0" aria-hidden />
          <span>{t("learner.lessons.nav.contentsLabel")}</span>
        </button>
      </div>

      <aside
        className="nn-lesson-reading-viewport__left"
        aria-label={t("learner.lessons.nav.ariaSectionsNav")}
      >
        <div className="nn-lesson-reading-viewport__left-inner">
          <button
            type="button"
            className="nn-lesson-reading-viewport__collapse"
            onClick={() => setLeftCollapsed((value) => !value)}
            aria-expanded={!leftCollapsed}
            aria-label={
              leftCollapsed
                ? t("learner.lessons.nav.expandSections")
                : t("learner.lessons.nav.collapseSections")
            }
          >
            {leftCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden />
            )}
          </button>
          <LessonSectionNav
            layout="rail"
            collapsed={leftCollapsed}
            sections={sections}
            progress={progress}
            progressVisible={progressVisible}
          />
        </div>
      </aside>

      <div
        className="nn-lesson-reading-viewport__surface"
        data-nn-lesson-reading-surface
      >
        {children}
      </div>

      <aside
        className="nn-lesson-reading-viewport__right"
        aria-label={t("learner.lessons.nav.ariaSectionsNav")}
      >
        <LessonCompactProgressRail
          sections={sections}
          progress={progress}
          progressVisible={progressVisible}
          collapsed={rightCollapsed}
          onToggleCollapsed={() => setRightCollapsed((value) => !value)}
        />
      </aside>

      {mobileDrawerOpen ? (
        <div
          className="nn-lesson-reading-viewport__drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t("learner.lessons.nav.ariaSectionsNav")}
        >
          <button
            type="button"
            className="nn-lesson-reading-viewport__drawer-backdrop"
            aria-label={t("learner.lessons.nav.closeDrawer")}
            onClick={closeMobileDrawer}
          />
          <div className="nn-lesson-reading-viewport__drawer-panel">
            <div className="nn-lesson-reading-viewport__drawer-head">
              <span>{t("learner.lessons.nav.contentsLabel")}</span>
              <button
                type="button"
                className="nn-lesson-reading-viewport__drawer-close"
                onClick={closeMobileDrawer}
                aria-label={t("learner.lessons.nav.closeDrawer")}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <LessonSectionNav
              layout="rail"
              sections={sections}
              progress={progress}
              progressVisible={progressVisible}
              onNavigate={closeMobileDrawer}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
