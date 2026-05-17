import { getAdmissionsLessonContentForProgram } from "./admissions-lesson-content";
import type { AdmissionsAcademyProgramId } from "./admissions-academy-programs";

export type AdmissionsDashboardCardTone =
  | "brand"
  | "info"
  | "positive"
  | "warning"
  | "neutral";

export type AdmissionsDashboardCard = {
  id: string;
  title: string;
  body: string;
  tone: AdmissionsDashboardCardTone;
  ctaLabel?: string;
  href?: string;
};

export type AdmissionsDashboardDomain = {
  id: string;
  label: string;
  completionPercent: number;
  readinessEstimate: number;
  lessonsAvailable: number;
  weakArea?: boolean;
};

export type AdmissionsDashboardModel = {
  programId: AdmissionsAcademyProgramId;
  hero: {
    title: string;
    subtitle: string;
    readinessEstimate: number;
    weeklyGoalHours: number;
    studyStreakDays: number;
  };
  cards: AdmissionsDashboardCard[];
  domains: AdmissionsDashboardDomain[];
  continueLearningLessonIds: string[];
  recommendedRemediationLessonIds: string[];
};

export function buildAdmissionsDashboardModel(
  programId: AdmissionsAcademyProgramId,
): AdmissionsDashboardModel {
  const lessons = getAdmissionsLessonContentForProgram(programId);

  const grouped = new Map<string, typeof lessons>();

  for (const lesson of lessons) {
    const current = grouped.get(lesson.domainId) ?? [];
    current.push(lesson);
    grouped.set(lesson.domainId, current);
  }

  const domains: AdmissionsDashboardDomain[] = Array.from(grouped.entries()).map(([domainId, rows], index) => ({
    id: domainId,
    label: humanizeAdmissionsDomainId(domainId),
    completionPercent: Math.min(92, 35 + rows.length * 12),
    readinessEstimate: Math.min(90, 48 + rows.length * 10),
    lessonsAvailable: rows.length,
    weakArea: index === grouped.size - 1,
  }));

  const weakDomains = domains.filter((d) => d.weakArea);

  return {
    programId,
    hero: {
      title: programId === "hesi-a2-academy" ? "HESI A2 Readiness" : "ATI TEAS Readiness",
      subtitle:
        programId === "hesi-a2-academy"
          ? "Build anatomy, physiology, math, reading, and safety reasoning foundations."
          : "Strengthen science, math, reading, and language foundations for admissions success.",
      readinessEstimate: Math.round(domains.reduce((sum, d) => sum + d.readinessEstimate, 0) / Math.max(domains.length, 1)),
      weeklyGoalHours: 6,
      studyStreakDays: 4,
    },
    cards: [
      {
        id: "continue-learning",
        title: "Continue learning",
        body: `Resume ${lessons[0]?.title ?? "your next admissions lesson"} and continue building foundational science and reasoning competencies.`,
        tone: "brand",
        ctaLabel: "Resume lesson",
        href: "/app/admissions",
      },
      {
        id: "timed-diagnostics",
        title: "Timed diagnostics",
        body: "Short timed diagnostics identify pacing issues, weak domains, and remediation priorities before full simulations.",
        tone: "info",
        ctaLabel: "Start diagnostics",
        href: "/app/admissions/diagnostics",
      },
      {
        id: "remediation-focus",
        title: "Weak-domain remediation",
        body:
          weakDomains.length > 0
            ? `Recommended focus: ${weakDomains.map((d) => d.label).join(", ")}. Review deep-teaching lessons and flashcards before your next timed drill.`
            : "No major weak-domain clusters detected.",
        tone: weakDomains.length > 0 ? "warning" : "positive",
      },
    ],
    domains,
    continueLearningLessonIds: lessons.slice(0, 2).map((lesson) => lesson.id),
    recommendedRemediationLessonIds: lessons.slice(-2).map((lesson) => lesson.id),
  };
}

function humanizeAdmissionsDomainId(domainId: string): string {
  return domainId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
