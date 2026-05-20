import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import {
  RefreshCw,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronRight,
  FileJson,
  Loader2,
} from "lucide-react";

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
};

function driftBadge(d: string) {
  const map: Record<string, string> = {
    ok: "bg-emerald-100 text-emerald-800 border-emerald-200",
    missing: "bg-amber-100 text-amber-900 border-amber-200",
    extra: "bg-blue-100 text-blue-800 border-blue-200",
    empty: "bg-orange-100 text-orange-900 border-orange-200",
    mixed: "bg-red-100 text-red-800 border-red-200",
  };
  return map[d] || "bg-slate-100 text-slate-700";
}

export default function AdminI18nDiagnosticsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [localeFilter, setLocaleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [onlyExtra, setOnlyExtra] = useState(false);
  const [onlyEmpty, setOnlyEmpty] = useState(false);
  const [onlyFailedVal, setOnlyFailedVal] = useState(false);
  const [surfaceFilter, setSurfaceFilter] = useState("");

  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (cache: boolean) => {
    setLoading(true);
    setErr(null);
    try {
      const q = cache ? "?cache=1" : "?cache=0";
      const res = await adminFetch(`/api/admin/i18n-diagnostics${q}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { message?: string }).message || res.statusText);
      }
      setReport(await res.json());
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    load(true);
  }, [user, navigate, load]);

  const postRefresh = async () => {
    setRefreshing(true);
    setErr(null);
    try {
      const res = await adminFetch("/api/admin/i18n-diagnostics/refresh", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((j as { error?: string }).error || res.statusText);
      }
      setReport((j as { report: Report }).report);
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
      if (onlyExtra && row.extraKeys.length === 0) return false;
      if (onlyEmpty && row.emptyKeys.length === 0) return false;
      if (onlyFailedVal && row.drift === "ok" && row.missingKeys.length === 0 && row.placeholderLikeKeys.length === 0)
        return false;
      if (search) {
        const s = search.toLowerCase();
        if (!row.locale.includes(s) && !row.missingKeys.some((k) => k.toLowerCase().includes(s))) return false;
      }
      return true;
    });
  }, [report, localeFilter, onlyMissing, onlyExtra, onlyEmpty, onlyFailedVal, search]);

  const detailLocale = expanded;
  const detailRow = useMemo(
    () => report?.locales.find((l) => l.locale === detailLocale) ?? null,
    [report, detailLocale],
  );

  const keyListFilter = (keys: string[]) => {
    if (!search) return keys.slice(0, 400);
    const s = search.toLowerCase();
    return keys.filter((k) => k.toLowerCase().includes(s)).slice(0, 400);
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="i18n Diagnostics | Admin"
        description="Internal translation health, missing keys, and drift vs canonical English source."
        noindex
      />
      <Navigation />
      <div className="container max-w-[1400px] py-8 px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-7 h-7" />
              Translation / i18n diagnostics
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Internal-only. Canonical source: <code className="text-xs">tools/i18n/source/i18n-en.ts</code>. Report:{" "}
              <code className="text-xs">reports/i18n-status.json</code>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => load(true)} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Reload
            </Button>
            <Button variant="default" size="sm" onClick={postRefresh} disabled={refreshing}>
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
              Refresh &amp; write JSON
            </Button>
          </div>
        </div>

        {err && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="pt-6 text-red-800">{err}</CardContent>
          </Card>
        )}

        {report && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Locales</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{report.summary.totalLocales}</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">EN keys (canonical)</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{report.summary.canonicalKeyCount.toLocaleString()}</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fully complete</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-emerald-700">{report.summary.localesFullyComplete}</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Missing keys</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-amber-700">{report.summary.localesWithMissing}</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Extra/orphan</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{report.summary.localesWithExtra}</CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Empty values</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{report.summary.localesWithEmpty}</CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compile &amp; validation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Last compile (newest JSON mtime)</span>
                    <span className="font-mono text-xs">{report.summary.lastCompileIso ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compile status</span>
                    <Badge variant="outline">{report.summary.compileStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Validation status</span>
                    <Badge
                      variant="outline"
                      className={
                        report.summary.validationStatus === "fail"
                          ? "border-red-400 text-red-800"
                          : report.summary.validationStatus === "warn"
                            ? "border-amber-400 text-amber-900"
                            : ""
                      }
                    >
                      {report.summary.validationStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hardcoded strings (i18n-scan)</span>
                    <span>{report.validation.hardcodedViolationsTotal.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Scan report: {report.validation.scanReportPath ?? "not found — run npm run i18n:scan"}
                    {report.validation.scanTimestamp ? ` @ ${report.validation.scanTimestamp}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">Data source: {report._source ?? "live"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Surfaces / systems</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {report.surfaces
                    .filter((s) => !surfaceFilter || s.id.includes(surfaceFilter) || s.label.toLowerCase().includes(surfaceFilter))
                    .map((s) => (
                      <div key={s.id} className="flex justify-between gap-2 text-sm border-b border-border/60 pb-2 last:border-0">
                        <div>
                          <div className="font-medium">{s.label}</div>
                          <div className="text-xs text-muted-foreground">{s.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="secondary" className="text-xs">
                            {s.status}
                          </Badge>
                          {s.keyCount != null && <div className="text-xs mt-1">{s.keyCount.toLocaleString()} keys</div>}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground mb-4">{report.preNursingNote}</p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-muted-foreground">Search locales / keys</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. nav. or fr" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Locale</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
                  Only missing
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyExtra} onChange={(e) => setOnlyExtra(e.target.checked)} />
                  Only extra
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyEmpty} onChange={(e) => setOnlyEmpty(e.target.checked)} />
                  Only empty
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={onlyFailedVal} onChange={(e) => setOnlyFailedVal(e.target.checked)} />
                  Failed validation
                </label>
                <div>
                  <label className="text-xs text-muted-foreground">Surface id</label>
                  <Input value={surfaceFilter} onChange={(e) => setSurfaceFilter(e.target.value)} placeholder="canonical-ts" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Locales</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-2 w-8" />
                      <th className="p-2">Locale</th>
                      <th className="p-2">Source</th>
                      <th className="p-2">Keys</th>
                      <th className="p-2">Missing</th>
                      <th className="p-2">Extra</th>
                      <th className="p-2">Empty</th>
                      <th className="p-2">%</th>
                      <th className="p-2">Drift</th>
                      <th className="p-2">JSON client</th>
                      <th className="p-2">JSON next</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocales.map((row) => (
                      <FragmentRow
                        key={row.locale}
                        row={row}
                        open={expanded === row.locale}
                        onToggle={() => setExpanded(expanded === row.locale ? null : row.locale)}
                      />
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {detailRow && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    Key-level detail: <code>{detailRow.locale}</code>
                    {detailRow.placeholderLikeKeys.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {detailRow.placeholderLikeKeys.length} placeholder-like
                      </Badge>
                    )}
                    {detailRow.englishLeakageCandidates.length > 0 && (
                      <Badge variant="outline" className="text-xs border-amber-400">
                        {detailRow.englishLeakageCandidates.length} EN leakage candidates
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> Missing keys ({detailRow.missingKeys.length})
                    </h4>
                    <pre className="bg-muted/50 p-3 rounded-md max-h-56 overflow-auto text-xs font-mono">
                      {keyListFilter(detailRow.missingKeys).join("\n") || "—"}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Extra / orphan keys ({detailRow.extraKeys.length})</h4>
                    <pre className="bg-muted/50 p-3 rounded-md max-h-56 overflow-auto text-xs font-mono">
                      {keyListFilter(detailRow.extraKeys).join("\n") || "—"}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Empty string keys ({detailRow.emptyKeys.length})</h4>
                    <pre className="bg-muted/50 p-3 rounded-md max-h-40 overflow-auto text-xs font-mono">
                      {keyListFilter(detailRow.emptyKeys).join("\n") || "—"}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Placeholder-like values ({detailRow.placeholderLikeKeys.length})</h4>
                    <pre className="bg-muted/50 p-3 rounded-md max-h-40 overflow-auto text-xs font-mono">
                      {keyListFilter(detailRow.placeholderLikeKeys).join("\n") || "—"}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">English leakage candidates ({detailRow.englishLeakageCandidates.length})</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Keys where translated value equals English source (long strings); may be false positives for proper nouns.
                    </p>
                    <pre className="bg-muted/50 p-3 rounded-md max-h-40 overflow-auto text-xs font-mono">
                      {keyListFilter(detailRow.englishLeakageCandidates).join("\n") || "—"}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Namespaces with missing (top)</h4>
                    <ul className="list-disc pl-5 text-xs">
                      {detailRow.namespacesAffected.slice(0, 20).map((n) => (
                        <li key={n.namespace}>
                          {n.namespace}: {n.missingCount}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FragmentRow({
  row,
  open,
  onToggle,
}: {
  row: LocaleRow;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-border/60 hover:bg-muted/30">
        <td className="p-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onToggle} aria-label="Expand">
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </td>
        <td className="p-2 font-mono font-medium">{row.locale}</td>
        <td className="p-2">
          {row.sourceExists ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </td>
        <td className="p-2">{row.totalKeys.toLocaleString()}</td>
        <td className="p-2">{row.missingKeys.length}</td>
        <td className="p-2">{row.extraKeys.length}</td>
        <td className="p-2">{row.emptyKeys.length}</td>
        <td className="p-2">{row.percentComplete}%</td>
        <td className="p-2">
          <Badge variant="outline" className={driftBadge(row.drift)}>
            {row.drift}
          </Badge>
        </td>
        <td className="p-2 text-xs">
          {row.compiledClientJson.exists ? `${row.compiledClientJson.keyCount}` : "—"}
        </td>
        <td className="p-2 text-xs">{row.compiledNextJson.exists ? `${row.compiledNextJson.keyCount}` : "—"}</td>
      </tr>
    </>
  );
}
