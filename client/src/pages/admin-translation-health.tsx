import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import {
  Activity, AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  Globe, BarChart3, Shield, Clock, ArrowLeft, Loader2,
  ChevronDown, ChevronUp
} from "lucide-react";

type EventSummary = {
  totalEvents: number;
  byType: Record<string, number>;
  byLanguage: Record<string, number>;
  bySeverity: Record<string, number>;
  byGenerator: Record<string, number>;
  recentMismatches: Array<{ language: string; generatorName: string; details: any; createdAt: string }>;
  mismatchRate: number;
  failureRate: number;
};

type CoverageData = {
  perLanguage: Record<string, { totalContent: number; translatedContent: number; coveragePct: number }>;
  perContentType: Record<string, { totalContent: number; translatedContent: number; coveragePct: number }>;
};

type StaleMetrics = {
  totalStale: number;
  byContentType: Record<string, number>;
  byLocale: Record<string, number>;
};

type TranslationEvent = {
  id: string;
  event_type: string;
  content_type: string;
  language: string;
  generator_name: string;
  generation_id: string | null;
  severity: string;
  details: any;
  created_at: string;
};

const SEVERITY_STYLES: Record<string, string> = {
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  error: "bg-red-100 text-red-700 border-red-200",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  language_mismatch: "Language Mismatch",
  language_validated: "Language Validated",
  language_rejected: "Language Rejected",
  ai_generation_failure: "AI Generation Failure",
  ai_generation_success: "AI Generation Success",
  missing_key: "Missing Key",
  fallback_trigger: "Fallback Trigger",
};

function getMismatchCount(summary: EventSummary | null): number {
  if (!summary?.byType) return 0;
  return (summary.byType["language_mismatch"] || 0) + (summary.byType["language_rejected"] || 0);
}

function getFailureCount(summary: EventSummary | null): number {
  if (!summary?.byType) return 0;
  return summary.byType["ai_generation_failure"] || 0;
}

function getSuccessCount(summary: EventSummary | null): number {
  if (!summary?.byType) return 0;
  return (summary.byType["ai_generation_success"] || 0) + (summary.byType["language_validated"] || 0);
}

export default function AdminTranslationHealth() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<EventSummary | null>(null);
  const [coverage, setCoverage] = useState<CoverageData | null>(null);
  const [events, setEvents] = useState<TranslationEvent[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [staleMetrics, setStaleMetrics] = useState<StaleMetrics | null>(null);
  const [hoursFilter, setHoursFilter] = useState(24);
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, coverageRes, eventsRes, staleRes] = await Promise.all([
        adminFetch(`/api/admin/translation-health/summary?hours=${hoursFilter}`),
        adminFetch(`/api/admin/translation-health/coverage`),
        adminFetch(`/api/admin/translation-health/events?limit=50${eventTypeFilter ? `&eventType=${eventTypeFilter}` : ""}${severityFilter ? `&severity=${severityFilter}` : ""}`),
        adminFetch(`/api/admin/translation-completeness/stale-metrics`),
      ]);

      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (coverageRes.ok) setCoverage(await coverageRes.json());
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(Array.isArray(data) ? data : data.events || []);
      }
      if (staleRes.ok) setStaleMetrics(await staleRes.json());
    } catch (err) {
      console.error("Failed to fetch translation health data:", err);
    } finally {
      setLoading(false);
    }
  }, [hoursFilter, eventTypeFilter, severityFilter]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, fetchData, navigate]);

  const runScan = async () => {
    setScanning(true);
    try {
      const res = await adminFetch("/api/admin/translation-health/scan", {
        method: "POST",
      });
      if (res.ok) {
        const result = await res.json();
        setScanResult(result);
        fetchData();
      }
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  if (!user?.isAdmin) return null;

  const coverageEntries = coverage?.perLanguage
    ? Object.entries(coverage.perLanguage).map(([lang, data]) => ({ language: lang, ...data }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-admin-translation-health">
      <SEO title="Translation Health - Admin" description="AI Pipeline Language Enforcement & Translation Observability" />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            data-testid="button-back-admin"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Admin
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
              <Activity className="w-6 h-6 text-blue-600" />
              Translation Health Dashboard
            </h1>
            <p className="text-gray-500 text-sm">AI Pipeline Language Enforcement & Observability</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={runScan}
              disabled={scanning}
              data-testid="button-run-scan"
            >
              {scanning ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Shield className="w-4 h-4 mr-1" />}
              Run Scan
            </Button>
          </div>
        </div>

        {loading && !summary ? (
          <div className="flex items-center justify-center py-20" data-testid="loading-spinner">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card data-testid="card-total-events">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Events ({hoursFilter}h)</p>
                      <p className="text-2xl font-bold" data-testid="text-total-events">{summary?.totalEvents || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-mismatches">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Language Mismatches</p>
                      <p className="text-2xl font-bold text-yellow-600" data-testid="text-mismatches">{getMismatchCount(summary)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-failures">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">AI Failures</p>
                      <p className="text-2xl font-bold text-red-600" data-testid="text-failures">{getFailureCount(summary)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-successes">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Validated</p>
                      <p className="text-2xl font-bold text-green-600" data-testid="text-successes">{getSuccessCount(summary)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card data-testid="card-by-generator">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Events by Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summary?.byGenerator && Object.keys(summary.byGenerator).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(summary.byGenerator)
                        .sort((a, b) => b[1] - a[1])
                        .map(([gen, count]) => (
                          <div key={gen} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                            <span className="text-sm font-medium" data-testid={`text-generator-${gen}`}>{gen}</span>
                            <Badge variant="secondary" data-testid={`badge-generator-count-${gen}`}>{count}</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No events recorded yet</p>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="card-by-language">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Events by Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summary?.byLanguage && Object.keys(summary.byLanguage).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(summary.byLanguage)
                        .sort((a, b) => b[1] - a[1])
                        .map(([lang, count]) => (
                          <div key={lang} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                            <span className="text-sm font-medium" data-testid={`text-language-${lang}`}>{lang.toUpperCase()}</span>
                            <Badge variant="secondary" data-testid={`badge-language-count-${lang}`}>{count}</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No events recorded yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {coverageEntries.length > 0 && (
              <Card className="mb-6" data-testid="card-coverage-metrics">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Language Coverage Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-coverage">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="py-2 pr-4 font-medium text-gray-500">Language</th>
                          <th className="py-2 pr-4 font-medium text-gray-500">Total Content</th>
                          <th className="py-2 pr-4 font-medium text-gray-500">Translated</th>
                          <th className="py-2 font-medium text-gray-500">Coverage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coverageEntries.map((entry) => (
                          <tr key={entry.language} className="border-b last:border-0" data-testid={`row-coverage-${entry.language}`}>
                            <td className="py-2 pr-4 font-medium">{entry.language.toUpperCase()}</td>
                            <td className="py-2 pr-4">{entry.totalContent}</td>
                            <td className="py-2 pr-4">{entry.translatedContent}</td>
                            <td className="py-2">
                              <Badge className={entry.coveragePct > 80 ? "bg-green-100 text-green-700" : entry.coveragePct > 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>
                                {entry.coveragePct.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {summary?.mismatchRate !== undefined && summary.totalEvents > 0 && (
              <Card className="mb-6" data-testid="card-rates">
                <CardContent className="pt-6">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm text-gray-500">Mismatch Rate</p>
                      <p className="text-xl font-bold" data-testid="text-mismatch-rate">
                        {(summary.mismatchRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Failure Rate</p>
                      <p className="text-xl font-bold" data-testid="text-failure-rate">
                        {(summary.failureRate * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {staleMetrics && staleMetrics.totalStale > 0 && (
              <Card className="mb-6" data-testid="card-stale-metrics">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" /> Stale Translation Metrics (New Tables)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm text-gray-500">Total Stale</p>
                      <p className="text-2xl font-bold text-orange-600" data-testid="text-stale-total">{staleMetrics.totalStale}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(staleMetrics.byContentType).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">By Content Type</h4>
                        <div className="space-y-1">
                          {Object.entries(staleMetrics.byContentType)
                            .sort((a, b) => b[1] - a[1])
                            .map(([type, count]) => (
                              <div key={type} className="flex items-center justify-between py-1 border-b border-gray-100" data-testid={`row-stale-type-${type}`}>
                                <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                                <Badge className="text-xs bg-orange-100 text-orange-700">{count}</Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {Object.keys(staleMetrics.byLocale).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">By Locale</h4>
                        <div className="space-y-1">
                          {Object.entries(staleMetrics.byLocale)
                            .sort((a, b) => b[1] - a[1])
                            .map(([locale, count]) => (
                              <div key={locale} className="flex items-center justify-between py-1 border-b border-gray-100" data-testid={`row-stale-locale-${locale}`}>
                                <span className="text-sm">{locale.toUpperCase()}</span>
                                <Badge className="text-xs bg-orange-100 text-orange-700">{count}</Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {scanResult && (
              <Card className="mb-6 border-blue-200" data-testid="card-scan-result">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" /> Latest Scan Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-80" data-testid="text-scan-output">
                    {JSON.stringify(scanResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-recent-events">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Recent Translation Events
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <select
                      className="text-sm border rounded px-2 py-1"
                      value={hoursFilter}
                      onChange={(e) => setHoursFilter(Number(e.target.value))}
                      data-testid="select-hours-filter"
                    >
                      <option value={1}>Last 1h</option>
                      <option value={6}>Last 6h</option>
                      <option value={24}>Last 24h</option>
                      <option value={72}>Last 3d</option>
                      <option value={168}>Last 7d</option>
                    </select>
                    <select
                      className="text-sm border rounded px-2 py-1"
                      value={eventTypeFilter}
                      onChange={(e) => setEventTypeFilter(e.target.value)}
                      data-testid="select-event-type-filter"
                    >
                      <option value="">All Types</option>
                      <option value="language_mismatch">Mismatch</option>
                      <option value="language_validated">Validated</option>
                      <option value="language_rejected">Rejected</option>
                      <option value="ai_generation_failure">AI Failure</option>
                      <option value="ai_generation_success">AI Success</option>
                    </select>
                    <select
                      className="text-sm border rounded px-2 py-1"
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      data-testid="select-severity-filter"
                    >
                      <option value="">All Severity</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 text-center" data-testid="text-no-events">No translation events recorded yet. Events will appear here as AI content generators run.</p>
                ) : (
                  <div className="space-y-2">
                    {events.map((evt) => (
                      <div
                        key={evt.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setExpandedEvent(expandedEvent === evt.id ? null : evt.id)}
                        data-testid={`event-row-${evt.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={SEVERITY_STYLES[evt.severity] || SEVERITY_STYLES.info}>
                              {evt.severity}
                            </Badge>
                            <span className="text-sm font-medium">
                              {EVENT_TYPE_LABELS[evt.event_type] || evt.event_type}
                            </span>
                            <Badge variant="outline" className="text-xs">{evt.content_type}</Badge>
                            {evt.language && <Badge variant="secondary" className="text-xs">{evt.language.toUpperCase()}</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {new Date(evt.created_at).toLocaleString()}
                            </span>
                            {expandedEvent === evt.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Generator: {evt.generator_name || "unknown"}
                          {evt.generation_id && ` | Generation: ${evt.generation_id.substring(0, 8)}...`}
                        </div>
                        {expandedEvent === evt.id && evt.details && (
                          <div className="mt-3 bg-gray-50 rounded p-3" data-testid={`event-details-${evt.id}`}>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                              {JSON.stringify(evt.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
