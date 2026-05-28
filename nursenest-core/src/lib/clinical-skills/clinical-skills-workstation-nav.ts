import {
  clinicalSkillsForCategory,
  listClinicalSkillCategories,
  listClinicalSkills,
  type ClinicalSkillCategory,
  type ClinicalSkillDefinition,
} from "@/lib/clinical-skills/clinical-skills-catalog";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export type ClinicalSkillsWorkstationNavCategory = {
  id: string;
  title: string;
  skills: Array<{
    slug: string;
    title: string;
    categoryId: string;
    estimatedMinutes: number;
    competencyTier: ClinicalSkillDefinition["competencyTier"];
  }>;
};

export function buildClinicalSkillsWorkstationNav(): ClinicalSkillsWorkstationNavCategory[] {
  return listClinicalSkillCategories().map((cat) => ({
    id: cat.id,
    title: cat.title,
    skills: clinicalSkillsForCategory(cat.id).map((s) => ({
      slug: s.slug,
      title: s.title,
      categoryId: s.categoryId,
      estimatedMinutes: s.estimatedMinutes,
      competencyTier: s.competencyTier,
    })),
  }));
}

export function pickClinicalSkillsContinueTarget(
  progressMap?: Record<string, PathwayLessonProgressStatus>,
  lastTouch?: { slug: string } | null,
  pathwayQuery = "",
): { href: string; title: string } {
  const flat = listClinicalSkills();
  const qp = pathwayQuery || "";
  if (flat.length === 0) {
    return { href: `/app/clinical-skills${qp}`, title: "Clinical skills overview" };
  }
  if (lastTouch) {
    const resumed = flat.find((l) => l.slug === lastTouch.slug);
    if (resumed) {
      return {
        href: `/app/clinical-skills/${encodeURIComponent(resumed.slug)}${qp}`,
        title: resumed.title,
      };
    }
  }
  if (progressMap) {
    const inProgress = flat.find((l) => progressMap[l.slug] === "in_progress");
    if (inProgress) {
      return {
        href: `/app/clinical-skills/${encodeURIComponent(inProgress.slug)}${qp}`,
        title: inProgress.title,
      };
    }
    const notStarted = flat.find((l) => (progressMap[l.slug] ?? "not_started") === "not_started");
    if (notStarted) {
      return {
        href: `/app/clinical-skills/${encodeURIComponent(notStarted.slug)}${qp}`,
        title: notStarted.title,
      };
    }
  }
  const first = flat[0]!;
  return {
    href: `/app/clinical-skills/${encodeURIComponent(first.slug)}${qp}`,
    title: first.title,
  };
}
