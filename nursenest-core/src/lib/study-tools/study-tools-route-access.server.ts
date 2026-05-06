import "server-only";

import { notFound } from "next/navigation";
import { getStaffSession } from "@/lib/auth/staff-session";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";

/**
 * When {@link isStudyToolsPubliclyEnabled} is false, only DB-backed staff (admin tiers) may open study-tool routes.
 * Learner layout already requires sign-in; this layer blocks regular subscribers until launch.
 */
export async function requireStudyToolsRouteAccess(): Promise<void> {
  if (isStudyToolsPubliclyEnabled()) return;
  const staff = await getStaffSession();
  if (!staff) notFound();
}
