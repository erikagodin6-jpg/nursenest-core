import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadBlogGenerationJobForAdmin } from "@/lib/blog/blog-generation-jobs";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
/** Full/lite loads may include many rows; statusPoll is tiny and fast. */
export const maxDuration = 120;

type RouteContext = { params: Promise<{ id: string }> };

const LITE_POLL_DEFAULT_CAP = 48;
const LITE_POLL_MAX_CAP = 120;

const JOB_LOAD_DEADLINE_STATUS_POLL_MS = 12_000;
const JOB_LOAD_DEADLINE_FULL_MS = 55_000;

const JOB_GET_WARN_MS = 8_000;
const JOB_GET_TIMEOUT_LOG_MS = 25_000;

class JobLoadDeadlineError extends Error {
  override readonly name = "JobLoadDeadlineError";
  constructor(
    readonly deadlineMs: number,
    readonly statusPoll: boolean,
    readonly lite: boolean,
  ) {
    super("Blog generation job load exceeded internal deadline");
    this.name = "JobLoadDeadlineError";
  }
}

function raceJobLoad<T>(
  promise: Promise<T>,
  deadlineMs: number,
  ctx: { statusPoll: boolean; lite: boolean },
): Promise<T> {
  let to: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    to = setTimeout(() => {
      reject(new JobLoadDeadlineError(deadlineMs, ctx.statusPoll, ctx.lite));
    }, deadlineMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (to) clearTimeout(to);
  }) as Promise<T>;
}

function jobLoadDeadlineResponse(id: string, e: JobLoadDeadlineError) {
  safeServerLog("admin", "blog_generation_job_response_read_timeout", {
    jobId: id,
    statusPoll: e.statusPoll,
    lite: e.lite,
    deadlineMs: e.deadlineMs,
  });
  return NextResponse.json(
    {
      ok: false,
      code: "JOB_RESPONSE_TIMEOUT",
      message: "Job status load exceeded internal deadline; retry polling shortly.",
    },
    { status: 503 },
  );
}

export async function GET(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const started = Date.now();
  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const statusPoll =
    searchParams.get("statusPoll") === "1" ||
    searchParams.get("poll") === "status" ||
    searchParams.get("summary") === "status";

  if (statusPoll) {
    let job;
    try {
      job = await raceJobLoad(
        loadBlogGenerationJobForAdmin(id, { statusPoll: true }),
        JOB_LOAD_DEADLINE_STATUS_POLL_MS,
        { statusPoll: true, lite: false },
      );
    } catch (e) {
      if (e instanceof JobLoadDeadlineError) {
        return jobLoadDeadlineResponse(id, e);
      }
      throw e;
    }
    const durationMs = Date.now() - started;
    if (durationMs >= JOB_GET_WARN_MS) {
      safeServerLog("admin", "blog_generation_job_get_slow", {
        jobId: id,
        durationMs,
        statusPoll: true,
      });
    }
    if (!job) {
      return NextResponse.json(
        { ok: false, error: "Not found", code: "NOT_FOUND", message: "No generation job exists for this id." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, job });
  }

  const lite = searchParams.get("lite") === "1" || searchParams.get("summary") === "1";
  const rawMax = searchParams.get("maxItems");
  const parsedMax = rawMax != null ? Number(rawMax) : NaN;
  const maxItems =
    lite
      ? Math.min(
          LITE_POLL_MAX_CAP,
          Math.max(8, Number.isFinite(parsedMax) && parsedMax > 0 ? Math.floor(parsedMax) : LITE_POLL_DEFAULT_CAP),
        )
      : Number.isFinite(parsedMax) && parsedMax > 0
        ? Math.min(500, Math.floor(parsedMax))
        : null;

  let job;
  try {
    job = await raceJobLoad(
      loadBlogGenerationJobForAdmin(id, maxItems != null ? { maxItems } : undefined),
      JOB_LOAD_DEADLINE_FULL_MS,
      { statusPoll: false, lite },
    );
  } catch (e) {
    if (e instanceof JobLoadDeadlineError) {
      return jobLoadDeadlineResponse(id, e);
    }
    const durationMs = Date.now() - started;
    safeServerLog("admin", "blog_generation_job_get_failed", {
      jobId: id,
      durationMs,
      lite,
      maxItems: maxItems ?? "all",
      message: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }

  const durationMs = Date.now() - started;
  if (durationMs >= JOB_GET_WARN_MS) {
    safeServerLog("admin", "blog_generation_job_get_slow", {
      jobId: id,
      durationMs,
      lite,
      maxItems: maxItems ?? "all",
    });
  }
  if (durationMs >= JOB_GET_TIMEOUT_LOG_MS) {
    safeServerLog("admin", "blog_generation_job_response_read_timeout_risk", {
      jobId: id,
      durationMs,
      lite,
      maxItems: maxItems ?? "all",
      note: "handler_completed_but_slow_clients_or_proxies_may_have_timed_out",
    });
  }

  if (!job) {
    return NextResponse.json(
      { ok: false, error: "Not found", code: "NOT_FOUND", message: "No generation job exists for this id." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, job });
}
