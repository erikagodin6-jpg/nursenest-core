"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { clinicalSkillProgressLabel, clinicalSkillTierLabel } from "@/lib/clinical-skills/clinical-skills-display";
import type { ClinicalSkillsWorkstationNavCategory } from "@/lib/clinical-skills/clinical-skills-workstation-nav";

export type { ClinicalSkillsWorkstationNavCategory };

export type ClinicalSkillsWorkstationSidebarProps = {
  categories: ClinicalSkillsWorkstationNavCategory[];
  continueHref: string;
  continueTitle: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  pathwayQuery?: string;
};

function parsePath(pathname: string): { slug?: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "app" || parts[1] !== "clinical-skills") return {};
  return { slug: parts[2] };
}

export function ClinicalSkillsWorkstationMobileStrip({
  categories,
  pathwayQuery = "",
}: {
  categories: ClinicalSkillsWorkstationNavCategory[];
  pathwayQuery?: string;
}) {
  const pathname = usePathname() ?? "";
  const { slug: activeSlug } = parsePath(pathname);
  const onHub = pathname === "/app/clinical-skills" || pathname === "/app/clinical-skills/";

  return (
    <nav className="nn-clinical-skills-workstation__mobile-strip" aria-label="Skill categories">
      <Link href={`/app/clinical-skills${pathwayQuery}`} className="nn-clinical-skills-workstation__chip" data-active={onHub ? "true" : undefined}>
        Overview
      </Link>
      {categories.map((cat) => {
        const first = cat.skills[0];
        const href = first ? `/app/clinical-skills/${encodeURIComponent(first.slug)}${pathwayQuery}` : `/app/clinical-skills${pathwayQuery}`;
        return (
          <Link
            key={cat.id}
            href={href}
            className="nn-clinical-skills-workstation__chip"
            data-active={cat.skills.some((s) => s.slug === activeSlug) ? "true" : undefined}
          >
            {cat.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function ClinicalSkillsWorkstationSidebar({
  categories,
  continueHref,
  continueTitle,
  progressMap = {},
  pathwayQuery = "",
}: ClinicalSkillsWorkstationSidebarProps) {
  const pathname = usePathname() ?? "";
  const { slug: activeSlug } = parsePath(pathname);
  const onHub = pathname === "/app/clinical-skills" || pathname === "/app/clinical-skills/";

  return (
    <aside className="nn-clinical-skills-workstation__sidebar" aria-label="Clinical skills navigation">
      <Link href={continueHref} className="nn-clinical-skills-workstation__continue">
        <span className="nn-clinical-skills-workstation__continue-label">Continue studying</span>
        <span className="nn-clinical-skills-workstation__continue-title">{continueTitle}</span>
      </Link>

      <div className="nn-clinical-skills-workstation__nav-head">
        <p className="nn-clinical-skills-workstation__nav-title">Competency lab</p>
        <Link href={`/app/clinical-skills${pathwayQuery}`} className="nn-clinical-skills-workstation__nav-home" data-active={onHub ? "true" : undefined}>
          Overview
        </Link>
      </div>

      <nav>
        {categories.map((cat) => {
          const categoryActive = cat.skills.some((s) => s.slug === activeSlug);
          return (
            <details key={cat.id} className="nn-clinical-skills-workstation__category" data-active={categoryActive ? "true" : undefined} open={categoryActive || onHub}>
              <summary>
                <span className="font-semibold text-[var(--semantic-text-primary)]">{cat.title}</span>
              </summary>
              <div className="nn-clinical-skills-workstation__lesson-list">
                {cat.skills.map((skill) => {
                  const href = `/app/clinical-skills/${encodeURIComponent(skill.slug)}${pathwayQuery}`;
                  const isActive = activeSlug === skill.slug;
                  const progress = progressMap[skill.slug] ?? "not_started";
                  return (
                    <Link
                      key={skill.slug}
                      href={href}
                      className="nn-clinical-skills-workstation__lesson-link"
                      data-active={isActive ? "true" : undefined}
                      data-progress={progress}
                    >
                      <span>{skill.title}</span>
                      <span className="nn-clinical-skills-workstation__lesson-meta">
                        {skill.estimatedMinutes} min · {clinicalSkillTierLabel(skill.competencyTier)} · {clinicalSkillProgressLabel(progress)}
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
