import { NextResponse } from "next/server";
import { processPendingJobs } from "@/lib/jobs/process-pending";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Background job worker — call from your scheduler (e.g. every minute) with Authorization header.
 * Set CRON_SECRET in production; omit in dev only if you understand the risk.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const started = Date.now();
  const result = await processPendingJobs();
  safeServerLog("cron", "background_jobs_batch", { durationMs: Date.now() - started, ...result });
  return NextResponse.json({ ok: true, ...result });
}
