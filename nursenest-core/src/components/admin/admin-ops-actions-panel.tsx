"use client";

import { useState } from "react";

type ActionId =
  | "run_blog_publish_scheduler"
  | "run_job_worker"
  | "refresh_content_counts"
  | "refresh_coverage_stats"
  | "validate_topic_coverage"
  | "reload_materialized_batch_metadata"
  | "run_question_audit";

/** Writes/publishes or runs the job worker — require explicit confirmation before POST. */
const OPS_CONFIRM_ACTIONS = new Set<ActionId>(["run_blog_publish_scheduler", "run_job_worker"]);

const ACTIONS: Array<{ id: ActionId; label: string; desc: string }> = [
  {
    id: "run_blog_publish_scheduler",
    label: "Run blog publish scheduler",
    desc: "Promotes due SCHEDULED posts to PUBLISHED.",
  },
  {
    id: "run_job_worker",
    label: "Run background job worker",
    desc: "Processes pending jobs with existing worker lock/retry logic.",
  },
  {
    id: "refresh_content_counts",
    label: "Refresh content counts",
    desc: "Rebuilds admin counts snapshot using live DB aggregates.",
  },
  {
    id: "refresh_coverage_stats",
    label: "Refresh coverage stats",
    desc: "Recomputes scalability + question coverage reports.",
  },
  {
    id: "validate_topic_coverage",
    label: "Validate topic coverage",
    desc: "Runs topic/exam/tier coverage diagnostics.",
  },
  {
    id: "reload_materialized_batch_metadata",
    label: "Reload materialized batch metadata",
    desc: "Reloads latest generation/source-map/preset metadata files.",
  },
  {
    id: "run_question_audit",
    label: "Run question audit",
    desc: "Runs QA snapshot + question coverage in one pass.",
  },
];

export function AdminOpsActionsPanel() {
  const [running, setRunning] = useState<ActionId | null>(null);
  const [result, setResult] = useState<string>("");

  async function runAction(action: ActionId) {
    if (OPS_CONFIRM_ACTIONS.has(action)) {
      const ok = window.confirm(
        `Run “${action}” on this server? This may write to the database, publish scheduled posts, or process queued jobs.`,
      );
      if (!ok) return;
    }
    setRunning(action);
    setResult("");
    try {
      const res = await fetch("/api/admin/ops/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true, action }),
      });
      const data = (await res.json()) as unknown;
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRunning(null);
    }
  }

  return (
    <section className="nn-card p-6">
      <h2 className="text-lg font-semibold">Safe actions</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Admin-only wrappers around existing scheduler, worker, diagnostics, and metadata utilities.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => runAction(a.id)}
            disabled={running !== null}
            className="rounded-lg border border-border bg-background px-4 py-3 text-left transition hover:border-primary/40 disabled:opacity-60"
          >
            <p className="text-sm font-semibold">{a.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
          </button>
        ))}
      </div>
      <pre className="mt-4 max-h-72 overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-xs">
        {result || "Run an action to see result JSON."}
      </pre>
    </section>
  );
}
