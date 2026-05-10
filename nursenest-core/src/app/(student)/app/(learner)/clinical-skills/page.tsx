import type { Metadata } from "next";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
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
      <div className="mb-4">
        <BreadcrumbTrail
          items={[
            { name: "Home", href: "/" },
            { name: "Dashboard", href: "/app" },
            { name: "Clinical skills", href: undefined },
          ]}
        />
      </div>
      <ClinicalSkillsHubClient pathwayId={pathwayId} userId={ctx.userId} />
    </div>
  );
}
