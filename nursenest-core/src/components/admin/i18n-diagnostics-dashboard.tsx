"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type LocaleRow = {
  locale: string;
  sourceExists: boolean;
  totalKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  emptyKeys: string[];
  placeholderLikeKeys: string[];
  englishLeakageCandidates: string[];
  percentComplete: number;
  drift: string;
  compiledClientJson: { exists: boolean; keyCount: number };
  compiledNextJson: { exists: boolean; keyCount: number };
  marketingOverlayKeys: number;
  namespacesAffected: { namespace: string; missingCount: number }[];
};

type Report = {
  generatedAt: string;
  summary: {
    totalLocales: number;
    canonicalKeyCount: number;
    localesFullyComplete: number;
    localesWithMissing: number;
    localesWithExtra: number;
    localesWithEmpty: number;
    lastCompileIso: string | null;
    compileStatus: string;
    validationStatus: string;
  };
  validation: {
    scanReportPath: string | null;
    scanTimestamp: string | null;
    hardcodedViolationsTotal: number;
    bySeverity: Record<string, number>;
  };
  surfaces: { id: string; label: string; description: string; keyCount?: number; status: string; path?: string }[];
  locales: LocaleRow[];
  preNursingNote: string;
  _source?: string;
  _cacheAgeMs?: number;
};

function driftClass(d: string) {
  const map: Record<string, string> = {
    ok: "bg-emerald-100 text-emerald-900",
    missing: "bg-amber-100 text-amber-950",
    extra: "bg-blue-100 text-blue-900",
    empty: "bg-orange-100 text-orange-950",
    mixed: "bg-red-100 text-red-900",
  };
  return map[d] ?? "bg-slate-100 text-slate-800";
}

export function I18nDiagnosticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (cache: boolean) => {
    setLoading(true);
    setErr(null);
    try {
      const q = cache ? "?cache=1" : "?cache=0";
      const res = await fetch(`/api/admin/i18n-diagnostics${q}`, { credentials: "include" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
        throw new Error(j.message || j.error || res.statusText);
      }
      setReport((await res.json()) as Report);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(true);
  }, [load]);

  const postRefresh = async () => {
    setRefreshing(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/i18n-diagnostics/refresh", { method: "POST", credentials: "include" });
      const j = (await res.json().catch(() => ({}))) as { error?: string; report?: Report };
      if (!res.ok) throw new Error(j.error || res.statusText);
      if (j.report) setReport(j.report);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setRefreshing(false);
    }
  };

  const filteredLocales = useMemo(() => {
    if (!report?.locales) return [];
    return report.locales.filter((row) => {
      if (localeFilter && row.locale !== localeFilter) return false;
      if (onlyMissing && row.missingKeys.length === 0) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!row.locale.includes(s) && !row.missingKeys.some((k) => k.toLowerCase().includes(s))) return false;
      }
      return true;
    });
  }, [report, localeFilter, onlyMissing, search]);

  const detailRow = report?.locales.find((l) => l.locale === expanded) ?? null;

  const keyListFilter = (keys: string[]) => {
    if (!search) return keys.slice(0, 500);
    const s = search.toLowerCase();
    return keys.filter((k) => k.toLowerCase().includes(s)).slice(0, 500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Translation / i18n diagnostics</h1>
          <p className="mt-2 text-sm text-muted">
            Live data from <code className="rounded bg-black/5 px-1">server/i18n-diagnostics-report.ts</code> (repo root). See{" "}
            <code className="rounded bg-black/5 px-1">docs/i18n-architecture.md</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50 disabled:opacity-50"
            onClick={() => void load(true)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Reload"}
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
            onClick={() => void postRefresh()}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "Refresh & write JSON"}
          </button>
        </div>
      </div>

      {err && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900" role="alert">
          {err}
        </div>
      )}

      {report && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Stat label="Locales" value={report.summary.totalLocales} />
            <Stat label="EN keys (canonical)" value={report.summary.canonicalKeyCount} />
            <Stat label="Fully complete" value={report.summary.localesFullyComplete} accent="text-emerald-700" />
            <Stat label="Locales w/ missing" value={report.summary.localesWithMissing} accent="text-amber-700" />
            <Stat label="Locales w/ extra" value={report.summary.localesWithExtra} />
            <Stat label="Empty values" value={report.summary.localesWithEmpty} />
          </div>

          <section className="nn-card p-6">
            <h2 className="text-lg font-semibold">Compile & validation</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Last compile (JSON mtime)</dt>
                <dd className="font-mono text-xs">{report.summary.lastCompileIso ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Compile status</dt>
                <dd>{report.summary.compileStatus}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Validation status</dt>
                <dd>{report.summary.validationStatus}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Hardcoded (i18n-scan)</dt>
                <dd>{report.validation.hardcodedViolationsTotal}</dd>
              </div>
              <div className="sm:col-span-2 text-xs text-muted">
                Source: {report._source ?? "live"}
                {report._cacheAgeMs != null ? ` · cache age ${Math.round(report._cacheAgeMs / 1000)}s` : ""}
              </div>
            </dl>
          </section>

          <section className="nn-card p-6">
            <h2 className="text-lg font-semibold">Surfaces</h2>
            <ul className="mt-3 divide-y divide-border/60 text-sm">
              {report.surfaces.map((s) => (
                <li key={s.id} className="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-muted">{s.description}</div>
                    {s.path && <div className="mt-0.5 font-mono text-[11px] text-muted">{s.path}</div>}
                  </div>
                  <div className="shrink-0 text-right text-xs">
                    <span className="rounded border border-border px-2 py-0.5">{s.status}</span>
                    {s.keyCount != null && <div className="mt-1">{s.keyCount.toLocaleString()} keys</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-xs text-muted">{report.preNursingNote}</p>

          <section className="nn-card p-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs">
                Search locales / keys
                <input
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. nav. or fr"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                Locale
                <select
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={localeFilter}
                  onChange={(e) => setLocaleFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {report.locales.map((l) => (
                    <option key={l.locale} value={l.locale}>
                      {l.locale}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
                Only rows with missing keys
              </label>
            </div>
          </section>

          <section className="nn-card overflow-hidden p-0">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Locales</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted">
                    <th className="w-8 p-2" />
                    <th className="p-2">Locale</th>
                    <th className="p-2">Src</th>
                    <th className="p-2">Keys</th>
                    <th className="p-2">Missing</th>
                    <th className="p-2">Extra</th>
                    <th className="p-2">Empty</th>
                    <th className="p-2">%</th>
                    <th className="p-2">Drift</th>
                    <th className="p-2">client JSON</th>
                    <th className="p-2">next JSON</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocales.map((row) => (
                    <LocaleTableRow
                      key={row.locale}
                      row={row}
                      open={expanded === row.locale}
                      onToggle={() => setExpanded(expanded === row.locale ? null : row.locale)}
                      driftClass={driftClass}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {detailRow && (
            <section className="nn-card p-6">
              <h2 className="text-lg font-semibold">
                Key-level detail: <code className="text-base">{detailRow.locale}</code>
              </h2>
              <div className="mt-4 grid gap-6 text-sm md:grid-cols-2">
                <KeyBlock title={`Missing (${detailRow.missingKeys.length})`} keys={keyListFilter(detailRow.missingKeys)} />
                <KeyBlock title={`Extra (${detailRow.extraKeys.length})`} keys={keyListFilter(detailRow.extraKeys)} />
                <KeyBlock title={`Empty (${detailRow.emptyKeys.length})`} keys={keyListFilter(detailRow.emptyKeys)} />
                <KeyBlock title={`Placeholder-like (${detailRow.placeholderLikeKeys.length})`} keys={keyListFilter(detailRow.placeholderLikeKeys)} />
                <KeyBlock
                  title={`EN leakage candidates (${detailRow.englishLeakageCandidates.length})`}
                  keys={keyListFilter(detailRow.englishLeakageCandidates)}
                />
                <div>
                  <h3 className="font-medium">Namespaces (missing, top)</h3>
                  <ul className="mt-2 list-disc pl-5 text-xs">
                    {detailRow.namespacesAffected.slice(0, 24).map((n) => (
                      <li key={n.namespace}>
                        {n.namespace}: {n.missingCount}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <article className="nn-card p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? ""}`}>{value.toLocaleString()}</p>
    </article>
  );
}

function KeyBlock({ title, keys }: { title: string; keys: string[] }) {
  return (
    <div>
      <h3 className="font-medium">{title}</h3>
      <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-black/5 p-3 text-xs font-mono">{keys.join("\n") || "—"}</pre>
    </div>
  );
}

function LocaleTableRow({
  row,
  open,
  onToggle,
  driftClass,
}: {
  row: LocaleRow;
  open: boolean;
  onToggle: () => void;
  driftClass: (d: string) => string;
}) {
  return (
    <tr className="border-b border-border/60 hover:bg-muted/30">
      <td className="p-1">
        <button type="button" className="rounded p-1 hover:bg-muted" onClick={onToggle} aria-label="Expand">
          {open ? "▼" : "▶"}
        </button>
      </td>
      <td className="p-2 font-mono font-medium">{row.locale}</td>
      <td className="p-2">{row.sourceExists ? "✓" : "✗"}</td>
      <td className="p-2">{row.totalKeys.toLocaleString()}</td>
      <td className="p-2">{row.missingKeys.length}</td>
      <td className="p-2">{row.extraKeys.length}</td>
      <td className="p-2">{row.emptyKeys.length}</td>
      <td className="p-2">{row.percentComplete}%</td>
      <td className="p-2">
        <span className={`rounded px-2 py-0.5 text-xs ${driftClass(row.drift)}`}>{row.drift}</span>
      </td>
      <td className="p-2 text-xs">{row.compiledClientJson.exists ? row.compiledClientJson.keyCount : "—"}</td>
      <td className="p-2 text-xs">{row.compiledNextJson.exists ? row.compiledNextJson.keyCount : "—"}</td>
    </tr>
  );
}
