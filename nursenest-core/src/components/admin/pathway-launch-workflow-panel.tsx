"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type DeterministicCheckRow = {
  id: string;
  label: string;
  pass: boolean;
  detail?: string;
  source?: string;
};

export type WorkflowRow = {
  id: string;
  targetKey: string;
  stage: string;
  isTeamFocus: boolean;
  notes: string | null;
  attestations: unknown;
};

type Props = {
  initialWorkflows: WorkflowRow[];
  pathwayOptions: { id: string; label: string }[];
  regionOptions: { slug: string; label: string; hubPath: string }[];
  defaultTargetKey: string;
};

const STAGE_VALUES = [
  "DRAFT",
  "CONTENT_BUILD",
  "QA_REVIEW",
  "SEO_REVIEW",
  "READY_TO_PUBLISH",
  "PUBLISHED_LIVE",
  "POST_PUBLISH_VERIFY",
] as const;

type StageValue = (typeof STAGE_VALUES)[number];

const STAGE_LABEL: Record<StageValue, string> = {
  DRAFT: "1 · Draft",
  CONTENT_BUILD: "2 · Content build",
  QA_REVIEW: "3 · QA review",
  SEO_REVIEW: "4 · SEO review",
  READY_TO_PUBLISH: "5 · Ready to publish",
  PUBLISHED_LIVE: "6 · Published live",
  POST_PUBLISH_VERIFY: "7 · Post-publish verification",
};

function isStage(v: string): v is StageValue {
  return (STAGE_VALUES as readonly string[]).includes(v);
}

export function PathwayLaunchWorkflowPanel(props: Props) {
  const [targetKey, setTargetKey] = useState(props.defaultTargetKey);
  const [workflows, setWorkflows] = useState(props.initialWorkflows);
  const [stage, setStage] = useState<StageValue>("DRAFT");
  const [qaReviewed, setQaReviewed] = useState(false);
  const [seoReviewed, setSeoReviewed] = useState(false);
  const [codeMergeConfirmed, setCodeMergeConfirmed] = useState(false);
  const [postPublishVerified, setPostPublishVerified] = useState(false);
  const [notes, setNotes] = useState("");
  const [teamFocus, setTeamFocus] = useState(false);
  const [checks, setChecks] = useState<DeterministicCheckRow[] | null>(null);
  const [allPass, setAllPass] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [mergeInstructions, setMergeInstructions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pathway-launch-workflow?targetKey=${encodeURIComponent(key)}`, {
        credentials: "include",
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Load failed");
        return;
      }
      if (Array.isArray(data.workflows)) {
        setWorkflows(data.workflows as WorkflowRow[]);
      }
      const wf = (data.workflow as WorkflowRow | null) ?? null;
      if (wf) {
        if (isStage(wf.stage)) setStage(wf.stage);
        setNotes(wf.notes ?? "");
        setTeamFocus(wf.isTeamFocus);
        const a = wf.attestations as Record<string, unknown> | null;
        setQaReviewed(Boolean(a?.qaReviewed));
        setSeoReviewed(Boolean(a?.seoReviewed));
        setCodeMergeConfirmed(Boolean(a?.codeMergeConfirmed));
        setPostPublishVerified(Boolean(a?.postPublishVerified));
      } else {
        setStage("DRAFT");
        setNotes("");
        setTeamFocus(false);
        setQaReviewed(false);
        setSeoReviewed(false);
        setCodeMergeConfirmed(false);
        setPostPublishVerified(false);
      }
      setChecks((data.checks as DeterministicCheckRow[]) ?? null);
      setAllPass(Boolean(data.allDeterministicPass));
      setSummary(typeof data.summaryLine === "string" ? data.summaryLine : null);
      setMergeInstructions(typeof data.mergeInstructions === "string" ? data.mergeInstructions : null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(targetKey);
  }, [targetKey, load]);

  const save = async () => {
    setSaveMsg(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pathway-launch-workflow", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetKey,
          stage,
          qaReviewed,
          seoReviewed,
          codeMergeConfirmed,
          postPublishVerified,
          notes,
          isTeamFocus: teamFocus,
        }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Save blocked");
        if (Array.isArray(data.workflows)) {
          setWorkflows(data.workflows as WorkflowRow[]);
        }
        return;
      }
      setSaveMsg("Saved.");
      if (Array.isArray(data.workflows)) {
        setWorkflows(data.workflows as WorkflowRow[]);
      }
      if (data.workflow) {
        const w = data.workflow as WorkflowRow;
        setWorkflows((prev) => {
          const rest = prev.filter((x) => x.targetKey !== w.targetKey);
          return [w, ...rest];
        });
      }
      if (data.checks) setChecks(data.checks as DeterministicCheckRow[]);
      setAllPass(Boolean(data.allDeterministicPass));
    } catch {
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = useMemo(() => {
    const r = props.regionOptions.find((x) => `region:${x.slug}` === targetKey);
    return r?.hubPath ?? null;
  }, [targetKey, props.regionOptions]);

  const setPreviewCookie = async () => {
    const r = props.regionOptions.find((x) => `region:${x.slug}` === targetKey);
    if (!r) {
      setError("Preview applies to expansion region targets with a shipped /exams hub.");
      return;
    }
    setError(null);
    const res = await fetch("/api/admin/exam-hub-preview", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: r.slug }),
    });
    if (!res.ok) {
      const j = (await res.json()) as { error?: string };
      setError(j.error ?? "Preview cookie failed");
      return;
    }
    setSaveMsg("Preview cookie set — open the hub in this browser (same session).");
  };

  const clearPreview = async () => {
    await fetch("/api/admin/exam-hub-preview", { method: "DELETE", credentials: "include" });
    setSaveMsg("Preview cookie cleared.");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Target</h2>
        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
          Work one pathway or expansion region at a time. Use <strong>Team focus</strong> so the row is easy to find in the list.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--theme-heading-text)]">Launch unit</span>
            <select
              value={targetKey}
              onChange={(e) => setTargetKey(e.target.value)}
              className="min-w-[280px] rounded-lg border border-[var(--border)] bg-background px-3 py-2 text-[var(--theme-heading-text)]"
            >
              <optgroup label="Exam pathways (in-app)">
                {props.pathwayOptions.map((p) => (
                  <option key={p.id} value={`pathway:${p.id}`}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Expansion regions (/exams/…)">
                {props.regionOptions.map((r) => (
                  <option key={r.slug} value={`region:${r.slug}`}>
                    {r.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--theme-heading-text)]">
            <input type="checkbox" checked={teamFocus} onChange={(e) => setTeamFocus(e.target.checked)} />
            Team focus
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--theme-card-bg))] p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Pipeline stage</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <select
            value={stage}
            onChange={(e) => {
              const v = e.target.value;
              if (isStage(v)) setStage(v);
            }}
            className="rounded-lg border border-[var(--border)] bg-background px-3 py-2 text-sm text-[var(--theme-heading-text)]"
          >
            {STAGE_VALUES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void save()}
            disabled={loading}
            className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-brand)_88%,transparent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
          >
            Save stage &amp; attestations
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-[var(--theme-heading-text)]">
            <input type="checkbox" checked={qaReviewed} onChange={(e) => setQaReviewed(e.target.checked)} />
            QA review complete (hub, lessons, questions, naming)
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--theme-heading-text)]">
            <input type="checkbox" checked={seoReviewed} onChange={(e) => setSeoReviewed(e.target.checked)} />
            SEO review complete (metadata, internal links intent)
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--theme-heading-text)]">
            <input type="checkbox" checked={codeMergeConfirmed} onChange={(e) => setCodeMergeConfirmed(e.target.checked)} />
            Code merge done (approval sets in repo)
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--theme-heading-text)]">
            <input type="checkbox" checked={postPublishVerified} onChange={(e) => setPostPublishVerified(e.target.checked)} />
            Post-publish smoke / monitoring OK
          </label>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Run notes, owner, links to tickets…"
          rows={3}
          className="mt-4 w-full rounded-lg border border-[var(--border)] bg-background p-3 text-sm text-[var(--theme-heading-text)]"
        />
        {error ? (
          <p
            className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_12%,transparent)] px-3 py-2 text-sm text-[var(--semantic-danger)]"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {saveMsg ? <p className="mt-2 text-sm text-[var(--semantic-success)]">{saveMsg}</p> : null}
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--theme-card-bg)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Deterministic checks</h2>
          {allPass ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_14%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">
              All pass
            </span>
          ) : (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">
              Fix failures
            </span>
          )}
        </div>
        {summary ? <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{summary}</p> : null}
        {mergeInstructions ? (
          <p className="mt-2 rounded-lg border border-dashed border-[var(--border)] bg-muted/20 p-3 font-mono text-xs text-[var(--theme-heading-text)]">{mergeInstructions}</p>
        ) : null}
        <ul className="mt-4 space-y-2">
          {(checks ?? []).map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-[var(--border)]/80 bg-background/60 px-3 py-2 text-sm"
            >
              <span className="text-[var(--theme-heading-text)]">{c.label}</span>
              <span
                className={
                  c.pass
                    ? "shrink-0 text-xs font-semibold text-[var(--semantic-success)]"
                    : "shrink-0 text-xs font-semibold text-[var(--semantic-danger)]"
                }
              >
                {c.pass ? "Pass" : "Fail"}
              </span>
              {c.detail ? <span className="w-full text-xs text-[var(--theme-muted-text)]">{c.detail}</span> : null}
            </li>
          ))}
        </ul>
        {loading ? <p className="mt-2 text-xs text-muted-foreground">Loading…</p> : null}
      </section>

      {previewUrl ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--theme-card-bg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Preview as live (staff only)</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            Sets an HttpOnly cookie so this browser can open an unpublished <code className="rounded bg-muted px-1">/exams/…</code> hub. Learners without the cookie still redirect to the public lessons hub.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void setPreviewCookie()}
              className="rounded-lg border border-[var(--border)] bg-background px-3 py-2 text-sm font-medium text-[var(--theme-heading-text)] hover:bg-muted"
            >
              Enable preview for this region
            </button>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)] px-3 py-2 text-sm font-medium text-[var(--semantic-info)]"
            >
              Open {previewUrl} →
            </a>
            <button type="button" onClick={() => void clearPreview()} className="rounded-lg px-3 py-2 text-sm text-muted-foreground underline">
              Clear preview cookie
            </button>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--theme-card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">All launch rows</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[var(--border)] text-[var(--theme-muted-text)]">
              <tr>
                <th className="py-2 pr-2">Target</th>
                <th className="py-2 pr-2">Stage</th>
                <th className="py-2">Focus</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((w) => (
                <tr key={w.id} className="border-b border-[var(--border)]/60">
                  <td className="py-2 pr-2 font-mono text-xs">{w.targetKey}</td>
                  <td className="py-2 pr-2">{w.stage.replace(/_/g, " ")}</td>
                  <td className="py-2">{w.isTeamFocus ? "★" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
