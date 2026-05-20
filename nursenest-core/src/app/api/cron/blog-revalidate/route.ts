import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";

/**
 * On-demand ISR bust for marketing blog surfaces (no DB writes).
 * POST with `Authorization: Bearer $CRON_SECRET` — same contract as `/api/cron/blog-publish`.
 * Use after bulk approvals or when `/blog` still shows a stale empty list.
 */
export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;
  revalidateBlogPublishingSurfaces();
  return NextResponse.json({ ok: true, revalidated: true });
}
