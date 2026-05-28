import type { ReactNode } from "react";
import "@/app/clinical-skills-workstation.css";
import { ClinicalSkillsWorkstationShell } from "@/components/clinical-skills/clinical-skills-workstation-shell";
import { auth } from "@/lib/auth";
import {
  aggregateClinicalSkillProgressCounts,
  findLatestClinicalSkillProgressTouch,
  loadClinicalSkillProgressMap,
} from "@/lib/clinical-skills/clinical-skills-lesson-progress";
import {
  buildClinicalSkillsWorkstationNav,
  pickClinicalSkillsContinueTarget,
} from "@/lib/clinical-skills/clinical-skills-workstation-nav";
import { loadClinicalSkillsRouteContext } from "@/lib/clinical-skills/clinical-skills-route-context.server";

export default async function ClinicalSkillsWorkstationLayout({ children }: { children: ReactNode }) {
  let ctx;
  try {
    ctx = await loadClinicalSkillsRouteContext("(student).app.(learner).clinical-skills.layout");
  } catch {
    return <div className="px-4 py-8 text-sm text-[var(--semantic-text-secondary)]">{children}</div>;
  }

  const pathwayId = ctx.pathwayId;
  const qp = pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const categories = buildClinicalSkillsWorkstationNav();
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const progressMap = userId ? await loadClinicalSkillProgressMap(userId) : {};
  const lastTouch = userId ? await findLatestClinicalSkillProgressTouch(userId) : null;
  const continueTarget = pickClinicalSkillsContinueTarget(progressMap, lastTouch, qp);

  return (
    <ClinicalSkillsWorkstationShell
      categories={categories}
      continueHref={continueTarget.href}
      continueTitle={continueTarget.title}
      progressMap={progressMap}
      pathwayQuery={qp}
    >
      {children}
    </ClinicalSkillsWorkstationShell>
  );
}
