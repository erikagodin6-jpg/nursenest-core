import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ClinicalSkillsHubClient } from "@/components/clinical-skills/clinical-skills-hub-client";
import {
  aggregateClinicalSkillProgressCounts,
  loadClinicalSkillProgressMap,
  findLatestClinicalSkillProgressTouch,
} from "@/lib/clinical-skills/clinical-skills-lesson-progress";
import { pickClinicalSkillsContinueTarget } from "@/lib/clinical-skills/clinical-skills-workstation-nav";
import { loadClinicalSkillsRouteContext } from "@/lib/clinical-skills/clinical-skills-route-context.server";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { auth } from "@/lib/auth";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export const metadata: Metadata = {
  title: "Clinical skills | NurseNest",
  description: "Premium bedside competency lab — simulation-style walkthroughs and interactive checkpoints.",
  robots: { index: false, follow: false },
};

const CLINICAL_SKILLS_PROGRESS_BUDGET_MS = 650;

function defaultClinicalSkillsProgressMap(): Record<string, PathwayLessonProgressStatus> {
  return Object.fromEntries(listClinicalSkills().map((skill) => [skill.slug, "not_started" as const]));
}

function withStartupBudget<T>(work: Promise<T>, fallback: T, label: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return Promise.race([
    work
      .catch((error) => {
        safeServerLog("clinical_skills", "startup_optional_work_failed", {
          label,
          error_message: error instanceof Error ? error.message.slice(0, 240) : String(error).slice(0, 240),
        });
        return fallback;
      })
      .finally(() => {
        if (timeout) clearTimeout(timeout);
      }),
    new Promise<T>((resolve) => {
      timeout = setTimeout(() => {
        safeServerLog("clinical_skills", "startup_optional_work_timeout", {
          label,
          budget_ms: CLINICAL_SKILLS_PROGRESS_BUDGET_MS,
        });
        resolve(fallback);
      }, CLINICAL_SKILLS_PROGRESS_BUDGET_MS);
    }),
  ]);
}

export default async function ClinicalSkillsHubRoute({
  searchParams,
}: {
  searchParams?: Promise<{ pathwayId?: string }>;
}) {
  const ctx = await loadClinicalSkillsRouteContext("(student).app.(learner).clinical-skills");
  const pathwayId = ctx.pathwayId ?? (await searchParams)?.pathwayId ?? null;
  const qp = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? ctx.userId;
  const defaultProgressMap = defaultClinicalSkillsProgressMap();
  const progressMap = userId
    ? await withStartupBudget(loadClinicalSkillProgressMap(userId), defaultProgressMap, "progress_map")
    : defaultProgressMap;
  const progressSummary = aggregateClinicalSkillProgressCounts(progressMap);
  const lastTouch = userId
    ? await withStartupBudget(findLatestClinicalSkillProgressTouch(userId), null, "latest_touch")
    : null;
  const continueTarget = pickClinicalSkillsContinueTarget(progressMap, lastTouch, qp);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="clinical-skills-hub" pathname="/app/clinical-skills" />
      <ClinicalSkillsHubClient
        pathwayId={pathwayId}
        userId={userId}
        progressSummary={progressSummary}
        continueHref={continueTarget.href}
        continueTitle={continueTarget.title}
        progressMap={progressMap}
      />
    </div>
  );
}
