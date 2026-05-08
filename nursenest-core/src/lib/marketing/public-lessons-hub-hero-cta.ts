import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";

export type PublicLessonsHubHeroCta = {
  label: string;
  href: string;
};

function truncateTitle(title: string, max = 44): string {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function buildSubscriberPublicLessonsHubHeroCta(
  resume: PathwayHubResumePayload,
  lessonsBasePath: string,
): PublicLessonsHubHeroCta {
  if (resume.lastTouched?.href) {
    return {
      href: resume.lastTouched.href,
      label: `Resume: ${truncateTitle(resume.lastTouched.title)}`,
    };
  }
  if (resume.nextRecommended?.href) {
    return {
      href: resume.nextRecommended.href,
      label: `Continue: ${truncateTitle(resume.nextRecommended.title)}`,
    };
  }
  return {
    href: `${lessonsBasePath.replace(/\/$/, "")}#pathway-lesson-library`,
    label: "Start studying",
  };
}
