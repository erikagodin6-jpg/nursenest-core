"use client";

import { useState } from "react";
import Link from "next/link";

type RowReport = {
  index: number;
  ok: boolean;
  stemHash?: string;
  errors?: string[];
  duplicateOfIndex?: number;
  existingQuestionId?: string;
};

export function AdminQuestionBulkImportClient() {
  const [jsonText, setJsonText] = useState("");
  const [applySecret, setApplySecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    dryRun: boolean;
    maxItems?: number;
    summary?: {
      total: number;
      valid: number;
      invalid: number;
      batchDuplicateHashes: number;
      existingDbHashes: number;
      importable: number;
    };
    rowReports?: RowReport[];
    created?: number;
    skipped?: number;
  } | null>(null);

  async function run(dryRun: boolean) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let items: unknown;
      try {
        items = JSON.parse(jsonText || "{}");
      } catch {
        setError("Paste must be valid JSON (array of items or { \"items\": [...] }).");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/questions/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          dryRun,
          ...(dryRun ? {} : { confirm: true, applySecret: applySecret.trim() || undefined }),
        }),
      });
      const data = (await res.json()) as { error?: string; hint?: string } & typeof result;
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setResult(data as typeof result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/70 bg-muted/15 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Format</p>
        <p className="mt-2">
          Each item matches the admin question create API:{" "}
          <code className="rounded bg-muted px-1">stem</code>, <code className="rounded bg-muted px-1">rationale</code>,{" "}
          <code className="rounded bg-muted px-1">options</code>, <code className="rounded bg-muted px-1">answerKey</code>,{" "}
          <code className="rounded bg-muted px-1">questionType</code> (MCQ, SATA, …), <code className="rounded bg-muted px-1">country</code>,{" "}
          <code className="rounded bg-muted px-1">tier</code>, <code className="rounded bg-muted px-1">categoryId</code> (existing Category
          id), optional <code className="rounded bg-muted px-1">examFamily</code>, <code className="rounded bg-muted px-1">topicTag</code>,{" "}
          <code className="rounded bg-muted px-1">tags</code>.
        </p>
        <p className="mt-2">
          Dedup uses the same <strong>stem hash</strong> as single creates. Max{" "}
          <strong>{result?.maxItems ?? 200}</strong> rows per request.
        </p>
        <p className="mt-2">
          <strong>Validate</strong> is always safe. <strong>Apply</strong> inserts <strong>DRAFT</strong> rows only — super-admin +{" "}
          <code className="rounded bg-muted px-1">NN_ADMIN_QUESTION_BULK_IMPORT_SECRET</code> env + matching secret field +{" "}
          <code className="rounded bg-muted px-1">confirm: true</code> in the JSON body (same intent pattern as other admin mutations).
        </p>
      </div>

      <label className="block text-sm font-medium text-foreground">
        JSON array or <code className="text-xs">{"{ \"items\": [ ... ] }"}</code>
        <textarea
          className="mt-2 min-h-[240px] w-full rounded-lg border border-border bg-background p-3 font-mono text-xs"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
          placeholder='[ { "stem": "...", "rationale": "...", "options": ["A","B"], "answerKey": ["A"], "questionType": "MCQ", "country": "US", "tier": "RN", "categoryId": "…" } ]'
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => void run(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Running…" : "Validate (dry run)"}
        </button>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <p className="font-semibold text-foreground">Apply to database (super-admin)</p>
        <label className="mt-2 block text-xs text-muted-foreground">
          Import secret (must match server env)
          <input
            type="password"
            className="mt-1 w-full max-w-md rounded border border-border bg-background px-3 py-2 text-sm"
            value={applySecret}
            onChange={(e) => setApplySecret(e.target.value)}
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void run(false)}
          className="mt-3 rounded-lg border border-amber-600/50 bg-amber-600/15 px-4 py-2 text-sm font-semibold text-amber-950 dark:text-amber-100 disabled:opacity-50"
        >
          Apply import (draft questions)
        </button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {result?.summary ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-semibold text-foreground">{result.dryRun ? "Validation result" : "Import result"}</p>
          <ul className="mt-2 list-inside list-disc text-muted-foreground">
            <li>Total rows scanned: {result.summary.total}</li>
            <li>Valid shape: {result.summary.valid}</li>
            <li>Invalid: {result.summary.invalid}</li>
            <li>In-file duplicate stems: {result.summary.batchDuplicateHashes}</li>
            <li>Already in DB (stem hash): {result.summary.existingDbHashes}</li>
            <li className="font-medium text-foreground">Importable new: {result.summary.importable}</li>
          </ul>
          {typeof result.created === "number" ? (
            <p className="mt-2 text-foreground">
              Created: {result.created} · Skipped: {result.skipped}
            </p>
          ) : null}
        </div>
      ) : null}

      {result?.rowReports && result.rowReports.length > 0 ? (
        <details className="rounded-xl border border-border bg-muted/10 p-4 text-sm">
          <summary className="cursor-pointer font-medium text-foreground">Per-row detail ({result.rowReports.length})</summary>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto font-mono text-xs">
            {result.rowReports.map((r) => (
              <li key={r.index} className="border-b border-border/40 pb-2">
                #{r.index}{" "}
                {r.ok ? (
                  <span className="text-green-700 dark:text-green-400">ok</span>
                ) : (
                  <span className="text-destructive">invalid</span>
                )}
                {r.stemHash ? <span className="text-muted-foreground"> · {r.stemHash}</span> : null}
                {r.duplicateOfIndex != null ? <span className="text-amber-700"> · dupe of #{r.duplicateOfIndex}</span> : null}
                {r.existingQuestionId ? <span className="text-muted-foreground"> · exists {r.existingQuestionId.slice(0, 8)}…</span> : null}
                {r.errors?.length ? <pre className="mt-1 whitespace-pre-wrap text-destructive">{r.errors.join("\n")}</pre> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <p className="text-sm text-muted-foreground">
        <Link href="/admin/questions" className="font-semibold text-primary underline">
          ← Question bank admin
        </Link>
      </p>
    </div>
  );
}
