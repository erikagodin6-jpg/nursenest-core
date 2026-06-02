"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MedCalcCategorySlug } from "@/lib/med-calculations/med-calculations-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { estimateMedCalcLessonMinutes } from "@/lib/med-calculations/med-calc-workstation-nav";
import { medCalcProgressStatusLabel } from "@/lib/med-calculations/med-calc-display";
import type { MedCalcWorkstationNavCategory } from "@/lib/med-calculations/med-calc-workstation-nav";

export type { MedCalcWorkstationNavCategory };

export type MedCalcWorkstationSidebarProps = {
  categories: MedCalcWorkstationNavCategory[];
  hasAccess: boolean;
  continueHref: string;
  continueTitle: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

function parseMedCalcPath(pathname: string): { category?: string; lesson?: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "app" || parts[1] !== "med-calculations") return {};
  return { category: parts[2], lesson: parts[3] };
}

function categoryHref(cat: MedCalcWorkstationNavCategory): string {
  const first = cat.lessons[0];
  return first ? `/app/med-calculations/${cat.slug}/${first.slug}` : "/app/med-calculations";
}

export function MedCalcWorkstationMobileStrip({ categories }: { categories: MedCalcWorkstationNavCategory[] }) {
  const pathname = usePathname() ?? "";
  const { category: activeCategory } = parseMedCalcPath(pathname);
  const onHub = pathname === "/app/med-calculations" || pathname === "/app/med-calculations/";

  return (
    <nav className="nn-med-calc-workstation__mobile-strip" aria-label="Calculation categories">
      <Link href="/app/med-calculations" className="nn-med-calc-workstation__chip" data-active={onHub ? "true" : undefined}>
        Overview
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={categoryHref(cat)}
          className="nn-med-calc-workstation__chip"
          data-active={activeCategory === cat.slug ? "true" : undefined}
        >
          {cat.title}
        </Link>
      ))}
    </nav>
  );
}

export function MedCalcWorkstationSidebar({
  categories,
  continueHref,
  continueTitle,
  progressMap = {},
}: MedCalcWorkstationSidebarProps) {
  const pathname = usePathname() ?? "";
  const { category: activeCategory, lesson: activeLesson } = parseMedCalcPath(pathname);
  const onHub = pathname === "/app/med-calculations" || pathname === "/app/med-calculations/";

  return (
    <aside className="nn-med-calc-workstation__sidebar" aria-label="Medication calculations navigation">
      <Link href={continueHref} className="nn-med-calc-workstation__continue">
        <span className="nn-med-calc-workstation__continue-label">Continue studying</span>
        <span className="nn-med-calc-workstation__continue-title">{continueTitle}</span>
      </Link>

      <div className="nn-med-calc-workstation__nav-head">
        <p className="nn-med-calc-workstation__nav-title">Medication safety workstation</p>
        <Link href="/app/med-calculations" className="nn-med-calc-workstation__nav-home" data-active={onHub ? "true" : undefined}>
          Overview
        </Link>
      </div>

      <nav>
        {categories.map((cat) => {
          const categoryActive = activeCategory === cat.slug;
          return (
            <details
              key={cat.slug}
              className="nn-med-calc-workstation__category"
              data-active={categoryActive ? "true" : undefined}
              open={categoryActive || onHub}
            >
              <summary>
                <Link href={categoryHref(cat)} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                  {cat.title}
                </Link>
              </summary>
              <div className="nn-med-calc-workstation__lesson-list">
                {cat.lessons.map((lesson) => {
                  const href = `/app/med-calculations/${lesson.category}/${lesson.slug}`;
                  const isActive = categoryActive && activeLesson === lesson.slug;
                  const minutes = estimateMedCalcLessonMinutes(lesson.blockCount);
                  const progress = progressMap[lesson.slug] ?? "not_started";
                  return (
                    <Link
                      key={lesson.slug}
                      href={href}
                      className="nn-med-calc-workstation__lesson-link"
                      data-active={isActive ? "true" : undefined}
                      data-progress={progress}
                    >
                      <span>{lesson.shortTitle}</span>
                      <span className="nn-med-calc-workstation__lesson-meta">
                        {minutes} min · {medCalcProgressStatusLabel(progress)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}
