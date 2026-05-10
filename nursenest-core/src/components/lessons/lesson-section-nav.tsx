"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  BriefcaseMedical,
  Check,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  NotebookPen,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { getLessonSectionTheme } from "@/lib/ui/lesson-section-theme";
import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { lessonStudyPhaseLabel, lessonStudyProgressPercent } from "@/components/lessons/lesson-study-phase-progress";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type SectionEntry = {
  id: string;
  heading: string;
  kind?: PathwayLessonSectionKind | null;
};

const ROLE_ICON = {
  info: Lightbulb,
  warning: AlertTriangle,
  concept: BookOpen,
  action: Stethoscope,
  diagnostic: FlaskConical,
  danger: ShieldAlert,
  success: HeartPulse,
  education: GraduationCap,
  application: BriefcaseMedical,
  review: Activity,
  cta: NotebookPen,
} as const;

/**
 * Sticky quick-jump sidebar (desktop, left column) + collapsible contents (mobile).
 * Uses IntersectionObserver for active tracking on large screens.
 */
export function LessonSectionNav({
  sections,
  progress,
  progressVisible = false,
}: {
  sections: SectionEntry[];
  progress?: PathwayLessonProgressStatus | null;
  progressVisible?: boolean;
}) {
  const { t } = useMarketingI18n();
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const sectionIdToY = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            sectionIdToY.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            sectionIdToY.delete(entry.target.id);
          }
        }
        if (sectionIdToY.size === 0) return;
        let best: string | null = null;
        let bestY = Infinity;
        for (const [id, y] of sectionIdToY) {
          if (y < bestY) {
            bestY = y;
            best = id;
          }
        }
        if (best) setActiveId(best);
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (sections.length === 0) return null;

  const navList = (
    <ol className="space-y-1">
      {sections.map((section) => {
        const { role, chipLabel } = getLessonSectionTheme(section.kind ?? null, section.heading);
        const Icon = ROLE_ICON[role];
        const activeIndex = sections.findIndex((s) => s.id === activeId);
        const index = sections.findIndex((s) => s.id === section.id);
        const isActive = activeId === section.id;
        const isCompleted = progressVisible && (progress === "completed" || (activeIndex > 0 && index < activeIndex));

        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="nn-lesson-nav-item"
              data-active={isActive ? "true" : undefined}
              data-completed={isCompleted ? "true" : undefined}
              aria-current={isActive ? "location" : undefined}
              aria-label={`Go to section: ${section.heading || chipLabel}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(section.id);
              }}
            >
              <span className="nn-lesson-nav-dot flex-shrink-0" data-role={role} aria-hidden="true">
                {isCompleted ? <Check className="h-2.5 w-2.5" /> : null}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="nn-lesson-nav-label line-clamp-2">
                  {section.heading?.trim() || chipLabel}
                </span>
                <span className="nn-lesson-nav-chip flex items-center gap-1">
                  <Icon className="h-2.5 w-2.5 flex-shrink-0" aria-hidden="true" />
                  {chipLabel}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <details className="nn-lesson-section-nav-mobile min-w-0 lg:hidden">
        <summary className="nn-lesson-section-nav-mobile__summary min-w-0">
          <span className="flex min-w-0 items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            {t("learner.lessons.nav.contentsLabel")}
          </span>
          <ChevronDown className="nn-lesson-section-nav-mobile__chevron h-4 w-4 shrink-0 opacity-70" aria-hidden />
        </summary>
        <div className="nn-lesson-section-nav-mobile__panel" data-nn-premium-lessons-mobile-nav>
          <nav aria-label="Lesson sections (mobile)">{navList}</nav>
        </div>
      </details>

      <aside
        className="nn-lesson-section-nav"
        aria-label={t("learner.lessons.nav.ariaSectionsNav")}
        data-nn-premium-lessons-on-this-page
      >
        <div className="nn-lesson-section-nav__header">
          <p>{t("learner.lessons.nav.onThisPage")}</p>
          <span>{t("learner.lessons.nav.sectionsCount", { count: sections.length })}</span>
        </div>
        <div className="nn-lesson-section-nav__progress" aria-label="Study phase">
          <span>{lessonStudyPhaseLabel(progressVisible ? progress : "not_started")}</span>
          <strong>{progressVisible ? `${lessonStudyProgressPercent(progress)}%` : t("learner.lessons.nav.progressLocal")}</strong>
        </div>
        <nav>{navList}</nav>
        <div className="nn-lesson-section-nav__jump" aria-label={t("learner.lessons.nav.ariaJumpControls")}>
          <button type="button" onClick={() => goTo(sections[0]!.id)}>
            {t("learner.lessons.nav.jumpTop")}
          </button>
          <button type="button" onClick={() => goTo(sections[sections.length - 1]!.id)}>
            {t("learner.lessons.nav.jumpReview")}
          </button>
        </div>
      </aside>
    </>
  );
}
