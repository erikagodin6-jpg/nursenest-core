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
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Clinical skills | NurseNest",
  description: "Premium bedside competency lab — simulation-style walkthroughs and interactive checkpoints.",
  robots: { index: false, follow: false },
};

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
  const progressMap = userId ? await loadClinicalSkillProgressMap(userId) : {};
  const progressSummary = aggregateClinicalSkillProgressCounts(progressMap);
  const lastTouch = userId ? await findLatestClinicalSkillProgressTouch(userId) : null;
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
