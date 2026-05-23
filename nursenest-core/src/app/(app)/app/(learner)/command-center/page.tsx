import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Legacy study-hub URL — command center metrics and tiles live on the canonical dashboard (`/app`).
 * API payload remains at `/api/learner/command-center` for mobile clients.
 */
export default async function LearnerCommandCenterRedirectPage() {
  redirect("/app");
}
