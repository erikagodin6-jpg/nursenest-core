import "server-only";

import { notFound } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff-session";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";

/**
 * `/app/clinical-scenarios` shell:
 * - Flag off → DB-backed staff only (preview for authoring).
 * - Flag on → active subscribers may open the catalog; staff retain access to drafts via list/detail rules.
 */
export async function requireClinicalScenariosLearnerShellAccess(): Promise<void> {
  const session = await getProtectedRouteSession("(student).app.(learner).clinical-scenarios.layout");
  const u = session?.user as { id?: string } | undefined;
  if (!u?.id?.trim()) notFound();

  if (!isClinicalScenariosPubliclyEnabled()) {
    const staff = await getStaffSession();
    if (!staff) notFound();
    return;
  }

  const staff = await getStaffSession();
  if (staff) return;

  /**
   * Public rollout: any signed-in learner may open the catalog and scenario preview shell.
   * Premium multi-stage access stays gated inside {@link ClinicalScenarioUnfoldingPreview} + server redaction.
   */
  return;
}
