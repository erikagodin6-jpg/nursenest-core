import type { Metadata } from "next";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ClinicalSkillsHubClient } from "@/components/clinical-skills/clinical-skills-hub-client";
import { loadClinicalSkillsRouteContext } from "@/lib/clinical-skills/clinical-skills-route-context.server";

export const metadata: Metadata = {
  title: "Clinical skills | NurseNest",
  description: "Premium bedside competency hub — categories, procedures, and guided walkthroughs.",
};

export default async function ClinicalSkillsHubRoute({
  searchParams,
}: {
  searchParams?: Promise<{ pathwayId?: string }>;
}) {
  const ctx = await loadClinicalSkillsRouteContext("(student).app.(learner).clinical-skills");
  const pathwayId = ctx.pathwayId ?? (await searchParams)?.pathwayId ?? null;

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="clinical-skills-hub" pathname="/app/clinical-skills" />
      <ClinicalSkillsHubClient pathwayId={pathwayId} userId={ctx.userId} />
    </div>
  );
}
