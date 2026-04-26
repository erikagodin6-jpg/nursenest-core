import { NextResponse } from "next/server";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { pumpBackgroundBlogDraftBatches } from "@/lib/blog/blog-draft-batch-pump";

export async function POST() {
  const started = Date.now();

  try {
    const blogDraftGen = await pumpBackgroundBlogDraftBatches();

    const result = {
      ok: true,
    };

    safeServerLog("cron", "jobs_run_complete", {
      durationMs: Date.now() - started,
      ...result,
      // 🔒 FIX: serialize object
      blogDraftGeneration: JSON.stringify(blogDraftGen),
    });

    return NextResponse.json({
      ok: true,
      ...result,
      blogDraftGeneration: blogDraftGen,
    });
  } catch (err) {
    safeServerLog("cron", "jobs_run_error", {
      message: err instanceof Error ? err.message : "unknown_error",
    });

    return NextResponse.json(
      {
        ok: false,
        error: "internal_error",
      },
      { status: 500 },
    );
  }
}2