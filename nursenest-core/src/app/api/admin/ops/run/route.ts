import { readFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";
import { processPendingJobs } from "@/lib/jobs/process-pending";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import { buildContentScalabilityReport } from "@/lib/scalability/build-content-scalability-report";
import { loadAdminQaIssueSnapshot } from "@/lib/admin/admin-qa-snapshot";

const schema = z.object({
  action: z.enum([
    "run_blog_publish_scheduler",
    "run_job_worker",
    "refresh_content_counts",
    "refresh_coverage_stats",
    "validate_topic_coverage",
    "reload_materialized_batch_metadata",
    "run_question_audit",
  ]),
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
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const action = parsed.data.action;
  try {
    if (action === "run_blog_publish_scheduler") {
      const result = await promoteScheduledBlogPosts();
      return NextResponse.json({ ok: true, action, result });
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
    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, action, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
