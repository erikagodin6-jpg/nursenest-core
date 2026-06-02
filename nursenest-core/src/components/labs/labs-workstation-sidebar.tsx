"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LabCategorySlug } from "@/lib/labs/labs-engine";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { estimateLabLessonMinutes, labProgressStatusLabel } from "@/lib/labs/labs-display";
import { formatDisplayTitle } from "@/lib/format/text-case";

export type LabsWorkstationNavCategory = {
  slug: LabCategorySlug;
  title: string;
  lessons: Array<{
    slug: string;
    shortTitle: string;
    category: LabCategorySlug;
    blockCount: number;
  }>;
};

export type LabsWorkstationSidebarProps = {
  categories: LabsWorkstationNavCategory[];
  hasAccess: boolean;
  continueHref: string;
  continueTitle: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

function parseLabsPath(pathname: string): { category?: string; lesson?: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "app" || parts[1] !== "labs") return {};
  return { category: parts[2], lesson: parts[3] };
}

export function LabsWorkstationMobileStrip({ categories }: { categories: LabsWorkstationNavCategory[] }) {
  const pathname = usePathname() ?? "";
  const { category: activeCategory } = parseLabsPath(pathname);
  const onHub = pathname === "/app/labs" || pathname === "/app/labs/";

  return (
    <nav className="nn-labs-workstation__mobile-strip" aria-label="Lab categories">
      <Link href="/app/labs" className="nn-labs-workstation__chip" data-active={onHub ? "true" : undefined}>
        Overview
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/app/labs/${cat.slug}`}
          className="nn-labs-workstation__chip"
          data-active={activeCategory === cat.slug ? "true" : undefined}
        >
          {cat.title}
        </Link>
      ))}
    </nav>
  );
}

export function LabsWorkstationSidebar({
  categories,
  hasAccess,
  continueHref,
  continueTitle,
  progressMap = {},
}: LabsWorkstationSidebarProps) {
  const pathname = usePathname() ?? "";
  const { category: activeCategory, lesson: activeLesson } = parseLabsPath(pathname);
  const onHub = pathname === "/app/labs" || pathname === "/app/labs/";

  return (
    <aside className="nn-labs-workstation__sidebar" aria-label="Labs navigation">
      <Link href={continueHref} className="nn-labs-workstation__continue">
        <span className="nn-labs-workstation__continue-label">{formatDisplayTitle("Continue studying")}</span>
        <span className="nn-labs-workstation__continue-title">{continueTitle}</span>
      </Link>

      <div className="nn-labs-workstation__nav-head">
        <p className="nn-labs-workstation__nav-title">{formatDisplayTitle("Clinical lab workstation")}</p>
        <Link href="/app/labs" className="nn-labs-workstation__nav-home" data-active={onHub ? "true" : undefined}>
          {formatDisplayTitle("Labs overview")}
        </Link>
      </div>

      <nav>
        {categories.map((cat) => {
          const categoryActive = activeCategory === cat.slug;
          return (
            <details
              key={cat.slug}
              className="nn-labs-workstation__category"
              data-active={categoryActive ? "true" : undefined}
              open={categoryActive || onHub}
            >
              <summary>
                <Link href={`/app/labs/${cat.slug}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                  {cat.title}
                </Link>
              </summary>
              <div className="nn-labs-workstation__lesson-list">
                {cat.lessons.map((lesson) => {
                  const href = `/app/labs/${lesson.category}/${lesson.slug}`;
                  const isActive = categoryActive && activeLesson === lesson.slug;
                  const minutes = estimateLabLessonMinutes(lesson.blockCount);
                  const progress = progressMap[lesson.slug] ?? "not_started";
                  return (
                    <Link
                      key={lesson.slug}
                      href={href}
                      className="nn-labs-workstation__lesson-link"
                      data-active={isActive ? "true" : undefined}
                      data-progress={progress}
                    >
                      <span>{lesson.shortTitle}</span>
                      <span className="nn-labs-workstation__lesson-meta">
                        {minutes} min · {labProgressStatusLabel(progress)}
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
