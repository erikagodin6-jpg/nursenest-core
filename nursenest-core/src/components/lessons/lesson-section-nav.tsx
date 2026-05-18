"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check } from "lucide-react";
import { getLessonSectionTheme } from "@/lib/ui/lesson-section-theme";
import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type SectionEntry = {
  id: string;
  heading: string;
  kind?: PathwayLessonSectionKind | null;
};

/**
 * Sticky horizontal segmented lesson navigation.
 * Keeps section wayfinding visible without reintroducing side rails or dashboard chrome.
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
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
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
      { rootMargin: "-12% 0px -62% 0px", threshold: 0 },
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
        <ol className="nn-lesson-horizontal-nav__list">
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
      </nav>
    </div>
  );
}
