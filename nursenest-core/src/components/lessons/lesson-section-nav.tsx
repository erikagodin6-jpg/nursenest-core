"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  BriefcaseMedical,
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
export function LessonSectionNav({ sections }: { sections: SectionEntry[] }) {
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
        const { role, chipLabel } = getLessonSectionTheme(section.kind ?? null);
        const Icon = ROLE_ICON[role];
        const isActive = activeId === section.id;

        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="nn-lesson-nav-item"
              data-active={isActive ? "true" : undefined}
              aria-current={isActive ? "location" : undefined}
              aria-label={`Go to section: ${section.heading || chipLabel}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(section.id);
              }}
            >
              <span className="nn-lesson-nav-dot flex-shrink-0" data-role={role} aria-hidden="true" />
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
      <details className="nn-lesson-section-nav-mobile lg:hidden">
        <summary className="nn-lesson-section-nav-mobile__summary">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            Lesson contents
          </span>
          <ChevronDown className="nn-lesson-section-nav-mobile__chevron h-4 w-4 shrink-0 opacity-70" aria-hidden />
        </summary>
        <div className="nn-lesson-section-nav-mobile__panel">
          <nav aria-label="Lesson sections (mobile)">{navList}</nav>
        </div>
      </details>

      <aside className="nn-lesson-section-nav" aria-label="Lesson sections">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Contents
        </p>
        <nav>{navList}</nav>
      </aside>
    </>
  );
}
