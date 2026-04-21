import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { pumpBackgroundBlogDraftBatches } from "@/lib/blog/blog-generation-jobs";
import { processPendingJobs } from "@/lib/jobs/process-pending";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Background job worker — call from your scheduler (e.g. every minute) with Authorization header.
 * Production / Vercel production: `CRON_SECRET` is **required**; unauthenticated calls are denied.
 * Local dev: if `CRON_SECRET` is unset, POST is allowed (only use on trusted localhost).
 */
export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  const started = Date.now();
  const result = await processPendingJobs();
  const blogDraftGen = await pumpBackgroundBlogDraftBatches();
  safeServerLog("cron", "background_jobs_batch", {
    durationMs: Date.now() - started,
    ...result,
    blogDraftGeneration: blogDraftGen,
  });
  return NextResponse.json({ ok: true, ...result, blogDraftGeneration: blogDraftGen });
}
