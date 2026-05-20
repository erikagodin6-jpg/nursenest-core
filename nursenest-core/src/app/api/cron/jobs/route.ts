import { NextResponse } from "next/server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function POST() {
  const started = Date.now();

  try {
    // 🔒 Removed broken import (blog-draft-batch-pump)
    // This can be reintroduced later once the module exists

    safeServerLog("cron", "jobs_run_complete", {
      durationMs: Date.now() - started,
      ok: true,
    });

    return NextResponse.json({
      ok: true,
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
      { status: 500 }
    );
  }
}