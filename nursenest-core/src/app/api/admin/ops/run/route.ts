/**
 * Super-admin batch ops. Reads `data/materialized/**` JSON from the container filesystem — per-instance ephemeral on App Platform; do not assume cross-instance file parity.
 */
import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";
import { countMissedBlogPostBacklog, recoverMissedBlogPostsBatch } from "@/lib/blog/blog-recover-missed-posts";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";
import { processPendingJobs } from "@/lib/jobs/process-pending";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import { buildContentScalabilityReport } from "@/lib/scalability/build-content-scalability-report";
import { loadAdminQaIssueSnapshot } from "@/lib/admin/admin-qa-snapshot";

const schema = z.object({
  action: z.enum([
    "run_blog_publish_scheduler",
    "recover_missed_blog_posts_batch",
    "run_job_worker",
    "refresh_content_counts",
    "refresh_coverage_stats",
    "validate_topic_coverage",
    "reload_materialized_batch_metadata",
    "run_question_audit",
  ]),
  /** Used by `recover_missed_blog_posts_batch` only; defaults to 5 server-side. */
  batchSize: z.number().int().min(1).max(50).optional(),
});

/** Paths under `data/materialized/` only — keeps runtime reads and NFT tracing scoped (see turbopackIgnore). */
const MATERIALIZED_JSON_KEYS = [
  "data/materialized/rn-pn-replit-batch-2026/generation-stats.json",
  "data/materialized/rn-pn-replit-batch-2026/source-map.json",
  "data/materialized/rn-pn-replit-batch-2026/practice-exam-presets.json",
  "data/materialized/np-clinical-layer-2026/practice-exam-presets.json",
] as const;

function loadMaterializedMetadata() {
  const materializedRoot = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "data",
    "materialized",
  );
  const out: Record<string, unknown> = {};
  for (const key of MATERIALIZED_JSON_KEYS) {
    const relFromRepoRoot = key.slice("data/materialized/".length);
    try {
      const abs = path.join(materializedRoot, relFromRepoRoot);
      out[key] = JSON.parse(readFileSync(/* turbopackIgnore: true */ abs, "utf8"));
    } catch {
      out[key] = null;
    }
  }
  return out;
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  if (gate.admin.tier !== "super") {
    return NextResponse.json({ error: "Forbidden", code: "admin_super_only" }, { status: 403 });
  }

  const raw = await req.json().catch(() => null);
  const intent = parseAdminJsonMutationIntent(raw);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields((raw ?? {}) as Record<string, unknown>);
  const parsed = schema.safeParse(stripped);
  if (!parsed.success) {
    safeServerLog("admin_ops_run", "invalid_body", {});
    return NextResponse.json(
      { ok: false, code: "admin_ops_invalid_body", error: "Invalid action" },
      { status: 400 },
    );
  }

  const action = parsed.data.action;

  if (intent.dryRun) {
    safeServerLog("admin_ops_run", "dry_run", { action });
    return NextResponse.json({
      ok: true,
      dryRun: true,
      action,
      preview: `Would execute super-admin op "${action}" (no writes in dry run).`,
    });
  }

  try {
    if (action === "run_blog_publish_scheduler") {
      const result = await promoteScheduledBlogPosts();
      revalidateBlogPublishingSurfaces();
      return NextResponse.json({ ok: true, action, result });
    }
    if (action === "recover_missed_blog_posts_batch") {
      const batchSize = parsed.data.batchSize ?? 5;
      const backlogBefore = await countMissedBlogPostBacklog();
      const result = await recoverMissedBlogPostsBatch(new Date(), batchSize);
      revalidateBlogPublishingSurfaces();
      return NextResponse.json({
        ok: true,
        action,
        result: {
          ...result,
          backlogBefore,
        },
      });
    }
    if (action === "run_job_worker") {
      const result = await processPendingJobs();
      return NextResponse.json({ ok: true, action, result });
    }
    if (action === "refresh_content_counts") {
      const result = await loadAdminDashboardStats();
      return NextResponse.json({ ok: true, action, result });
    }
    if (action === "refresh_coverage_stats") {
      const [scalability, questionCoverage] = await Promise.all([
        buildContentScalabilityReport(),
        buildQuestionBankCoverageReport(),
      ]);
      return NextResponse.json({ ok: true, action, result: { scalability, questionCoverage } });
    }
    if (action === "validate_topic_coverage") {
      const result = await buildQuestionBankCoverageReport();
      return NextResponse.json({ ok: true, action, result });
    }
    if (action === "reload_materialized_batch_metadata") {
      const result = loadMaterializedMetadata();
      return NextResponse.json({ ok: true, action, result });
    }
    if (action === "run_question_audit") {
      const [qaSnapshot, coverage] = await Promise.all([
        loadAdminQaIssueSnapshot(),
        buildQuestionBankCoverageReport(),
      ]);
      return NextResponse.json({ ok: true, action, result: { qaSnapshot, coverage } });
    }
    return NextResponse.json(
      { ok: false, code: "admin_ops_unknown_action", error: "Unknown action" },
      { status: 400 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("admin_ops_run", "handler_error", { action, detail: msg.slice(0, 240) });
    return NextResponse.json(
      { ok: false, code: "admin_ops_handler_error", action, error: msg },
      { status: 500 },
    );
  }
}
