"use client";

import { useEffect, useState } from "react";
import { Check, ListTree } from "lucide-react";
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

/**
 * Lightweight right-side section navigator with inline reading progress.
 * Stays narrow so the lesson body remains visually dominant.
 */
export function LessonCompactProgressRail({
  sections,
  progress,
  progressVisible = false,
  collapsed = false,
  onToggleCollapsed,
}: {
  sections: SectionEntry[];
  progress?: PathwayLessonProgressStatus | null;
  progressVisible?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const { t } = useMarketingI18n();
  const { activeId, goTo } = useLessonSectionNavActive(sections);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const tick = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - window.innerHeight;
      const ratio = scrollable <= 0 ? 1 : window.scrollY / scrollable;
      setScrollPct(Math.min(100, Math.max(0, Math.round(ratio * 100))));
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (sections.length === 0) return null;

  return (
    <div
      className="nn-lesson-progress-rail"
      data-nn-lesson-progress-rail
      data-collapsed={collapsed ? "true" : undefined}
    >
      <div className="nn-lesson-progress-rail__head">
        <button
          type="button"
          className="nn-lesson-progress-rail__toggle"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={
            collapsed
              ? t("learner.lessons.nav.expandSections")
              : t("learner.lessons.nav.collapseSections")
          }
        >
          <ListTree className="h-4 w-4 shrink-0" aria-hidden />
        </button>
        {!collapsed ? (
          <>
            <span className="nn-lesson-progress-rail__label">
              {t("learner.lessons.nav.contentsLabel")}
            </span>
            <span
              className="nn-lesson-progress-rail__pct"
              aria-label={`Reading progress ${scrollPct} percent`}
            >
              {scrollPct}%
            </span>
          </>
        ) : null}
      </div>

      {!collapsed ? (
        <>
          <div
            className="nn-lesson-progress-rail__track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={scrollPct}
            aria-label="Reading progress"
          >
            <span style={{ height: `${scrollPct}%` }} />
          </div>
          <ol className="nn-lesson-progress-rail__list">
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
                    className="nn-lesson-progress-rail__item"
                    data-active={isActive ? "true" : undefined}
                    data-completed={isCompleted ? "true" : undefined}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(section.id);
                    }}
                  >
                    <span
                      className="nn-lesson-nav-dot"
                      data-role={role}
                      aria-hidden="true"
                    >
                      {isCompleted ? <Check className="h-2.5 w-2.5" /> : null}
                    </span>
                    <span className="nn-lesson-progress-rail__item-label">
                      {section.heading?.trim() || chipLabel}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <div
          className="nn-lesson-progress-rail__track nn-lesson-progress-rail__track--collapsed"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={scrollPct}
          aria-label="Reading progress"
        >
          <span style={{ height: `${scrollPct}%` }} />
        </div>
      )}
    </div>
  );
}
