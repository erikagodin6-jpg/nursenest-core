import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { pumpBlogArticleGenerationJobs } from "@/lib/blog/blog-article-generation-job";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Processes at most one queued {@link BlogArticleGenerationJob} per invocation (cron secret required).
 */
export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  try {
    const out = await pumpBlogArticleGenerationJobs();
    safeServerLog("cron", "blog_article_generation_jobs_pump", out);
    return NextResponse.json({ ok: true, ...out });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("cron", "blog_article_generation_jobs_pump_failed", { message: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
