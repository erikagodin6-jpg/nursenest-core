"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ListTree, X } from "lucide-react";
import { LessonSectionNav } from "@/components/lessons/lesson-section-nav";
import { LessonCompactProgressRail } from "@/components/lessons/lesson-compact-progress-rail";
import { LessonClinicalPearlsRail } from "@/components/lessons/lesson-clinical-pearls-rail";
import { LessonReadingProgressStrip } from "@/components/lessons/lesson-reading-progress-strip";
import {
  normalizeClinicalPearlLines,
  type ClinicalPearlLine,
} from "@/lib/lessons/extract-clinical-pearl-lines";
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
 * RN v2 uses a left rail + full-width reading stack (no right study tips rail).
 */
export function LessonReadingViewport({
  sections,
  progress,
  progressVisible = false,
  layout = "default",
  clinicalPearls = [],
  children,
}: {
  sections: SectionEntry[];
  progress?: PathwayLessonProgressStatus | null;
  progressVisible?: boolean;
  /** RN stream uses the v2.7 reading workspace (left rail + pearls, no right rail). */
  layout?: "default" | "rn-v2";
  clinicalPearls?: ClinicalPearlLine[];
  children: ReactNode;
}) {
  const { t } = useMarketingI18n();
  const rnLayout = layout === "rn-v2";
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const safeClinicalPearls = normalizeClinicalPearlLines(clinicalPearls, {
    source: "LessonReadingViewport",
  });

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
      data-layout={rnLayout ? "rn-v2" : undefined}
      data-right-collapsed={rightCollapsed ? "true" : undefined}
    >
      {rnLayout ? (
        <LessonReadingProgressStrip sections={sections} />
      ) : null}

      <div className="nn-lesson-reading-viewport__mobile-bar" data-nn-premium-lessons-mobile-nav>
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
        {safeClinicalPearls.length > 0 ? (
          <LessonClinicalPearlsRail pearls={safeClinicalPearls} />
        ) : null}
      </div>

      <aside
        className="nn-lesson-reading-viewport__left"
        aria-label={t("learner.lessons.nav.ariaSectionsNav")}
      >
        <div className="nn-lesson-reading-viewport__left-inner">
          <LessonSectionNav
            layout="rail"
            sections={sections}
            progress={progress}
            progressVisible={progressVisible}
          />
          {safeClinicalPearls.length > 0 ? (
            <LessonClinicalPearlsRail pearls={safeClinicalPearls} />
          ) : null}
        </div>
      </aside>

      <div
        className="nn-lesson-reading-viewport__surface"
        data-nn-lesson-reading-surface
      >
        {children}
      </div>

      {!rnLayout ? (
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
      ) : null}

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
            {safeClinicalPearls.length > 0 ? (
              <LessonClinicalPearlsRail pearls={safeClinicalPearls} />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
