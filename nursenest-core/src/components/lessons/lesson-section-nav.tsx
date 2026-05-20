"use client";

import { BookOpen, Check } from "lucide-react";
import { getLessonSectionTheme } from "@/lib/ui/lesson-section-theme";
import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  useLessonSectionNavActive,
  type LessonSectionNavEntry,
} from "@/components/lessons/use-lesson-section-nav-active";

type SectionEntry = LessonSectionNavEntry & {
  kind?: PathwayLessonSectionKind | null;
};

function LessonSectionNavItems({
  sections,
  activeId,
  goTo,
  progress,
  progressVisible,
  layout,
  onNavigate,
}: {
  sections: SectionEntry[];
  activeId: string | null;
  goTo: (id: string) => void;
  progress?: PathwayLessonProgressStatus | null;
  progressVisible?: boolean;
  layout: "horizontal" | "rail";
  onNavigate?: () => void;
}) {
  const listClass =
    layout === "horizontal"
      ? "nn-lesson-horizontal-nav__list"
      : "nn-lesson-rail-nav__list";

  return (
    <ol className={listClass}>
      {sections.map((section) => {
        const { role, chipLabel } = getLessonSectionTheme(
          section.kind ?? null,
          section.heading,
        );
        const activeIndex = sections.findIndex((s) => s.id === activeId);
        const index = sections.findIndex((s) => s.id === section.id);
        const isActive = activeId === section.id;
        const isCompleted =
          progressVisible &&
          (progress === "completed" ||
            (activeIndex > 0 && index < activeIndex));

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
                onNavigate?.();
              }}
            >
              <span
                className="nn-lesson-nav-dot flex-shrink-0"
                data-role={role}
                aria-hidden="true"
              >
                {isCompleted ? <Check className="h-2.5 w-2.5" /> : null}
              </span>
              <span className="nn-lesson-nav-copy">
                <span className="nn-lesson-nav-label">
                  {section.heading?.trim() || chipLabel}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Lesson section navigation — horizontal segmented bar (mobile) or compact left rail (desktop).
 */
export function LessonSectionNav({
  sections,
  progress,
  progressVisible = false,
  layout = "horizontal",
  collapsed = false,
  onNavigate,
}: {
  sections: SectionEntry[];
  progress?: PathwayLessonProgressStatus | null;
  progressVisible?: boolean;
  layout?: "horizontal" | "rail";
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useMarketingI18n();
  const { activeId, goTo } = useLessonSectionNavActive(sections);

  if (sections.length === 0) return null;

  if (layout === "rail") {
    return (
      <nav
        className="nn-lesson-section-nav nn-lesson-section-nav--rail"
        aria-label={t("learner.lessons.nav.ariaSectionsNav")}
        data-nn-lesson-toc-rail
        data-collapsed={collapsed ? "true" : undefined}
      >
        {!collapsed ? (
          <>
            <span className="nn-lesson-section-nav__rail-label">
              <BookOpen className="h-4 w-4 shrink-0 opacity-75" aria-hidden />
              {t("learner.lessons.nav.onThisPage")}
            </span>
            <LessonSectionNavItems
              sections={sections}
              activeId={activeId}
              goTo={goTo}
              progress={progress}
              progressVisible={progressVisible}
              layout="rail"
              onNavigate={onNavigate}
            />
          </>
        ) : (
          <ol className="nn-lesson-rail-nav__list nn-lesson-rail-nav__list--dots">
            {sections.map((section) => {
              const { role } = getLessonSectionTheme(
                section.kind ?? null,
                section.heading,
              );
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="nn-lesson-nav-item nn-lesson-nav-item--dot-only"
                    data-active={isActive ? "true" : undefined}
                    aria-current={isActive ? "location" : undefined}
                    aria-label={section.heading}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(section.id);
                      onNavigate?.();
                    }}
                  >
                    <span
                      className="nn-lesson-nav-dot"
                      data-role={role}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ol>
        )}
      </nav>
    );
  }

  return (
    <div
      className="nn-lesson-section-nav-shell"
      data-nn-premium-horizontal-lesson-nav
    >
      <nav
        className="nn-lesson-section-nav nn-lesson-section-nav--horizontal"
        aria-label={t("learner.lessons.nav.ariaSectionsNav")}
        data-nn-lesson-toc-desktop
        data-nn-premium-lessons-on-this-page
      >
        <span className="nn-lesson-section-nav__mobile-label">
          <BookOpen className="h-4 w-4 shrink-0 opacity-75" aria-hidden />
          {t("learner.lessons.nav.contentsLabel")}
        </span>
        <LessonSectionNavItems
          sections={sections}
          activeId={activeId}
          goTo={goTo}
          progress={progress}
          progressVisible={progressVisible}
          layout="horizontal"
          onNavigate={onNavigate}
        />
      </nav>
    </div>
  );
}
