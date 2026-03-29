import { NextResponse } from "next/server";
import { processPendingJobs } from "@/lib/jobs/process-pending";

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

  const result = await processPendingJobs();
  return NextResponse.json({ ok: true, ...result });
}
