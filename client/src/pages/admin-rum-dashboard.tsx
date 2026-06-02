import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock, ArrowLeft, RefreshCw, BarChart3, Zap, Eye, TrendingUp } from "lucide-react";
import { Link } from "wouter";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("nn_admin_access_token") || localStorage.getItem("nursenest-user-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchRumDashboard(hours: number) {
  const res = await fetch(`/api/admin/rum/dashboard?hours=${hours}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to load RUM data");
  return res.json();
}

function fmtMs(v: number | null | undefined): string {
  if (v == null) return "—";
  const n = Number(v);
  if (!isFinite(n)) return "—";
  if (n < 1) return "<1ms";
  if (n < 1000) return `${Math.round(n)}ms`;
  return `${(n / 1000).toFixed(2)}s`;
}

function fmtScore(metric: string, v: number | null | undefined): string {
  if (v == null) return "—";
  if (metric === "CLS") return Number(v).toFixed(3);
  return fmtMs(v);
}

type ThresholdSpec = { good: number; poor: number };

const THRESHOLDS: Record<string, ThresholdSpec> = {
  TTFB:             { good: 800,   poor: 1800  },
  FCP:              { good: 1800,  poor: 3000  },
  LCP:              { good: 2500,  poor: 4000  },
  INP:              { good: 200,   poor: 500   },
  CLS:              { good: 0.1,   poor: 0.25  },
  route_transition: { good: 150,   poor: 500   },
  api_latency:      { good: 500,   poor: 2000  },
  db_latency:       { good: 200,   poor: 1000  },
};

function ratingColor(metric: string, value: number | null | undefined): string {
  if (value == null) return "text-slate-400";
  const t = THRESHOLDS[metric];
  if (!t) return "text-slate-600";
  if (value <= t.good) return "text-green-600";
  if (value <= t.poor) return "text-amber-600";
  return "text-red-600";
}

function ratingBadge(metric: string, value: number | null | undefined) {
  if (value == null) return null;
  const t = THRESHOLDS[metric];
  if (!t) return null;
  if (value <= t.good)  return <Badge className="bg-green-100 text-green-800 text-xs">Good</Badge>;
  if (value <= t.poor)  return <Badge className="bg-amber-100 text-amber-800 text-xs">Needs Work</Badge>;
  return <Badge className="bg-red-100 text-red-800 text-xs">Poor</Badge>;
}

const METRIC_LABELS: Record<string, string> = {
  TTFB:             "Time to First Byte",
  FCP:              "First Contentful Paint",
  LCP:              "Largest Contentful Paint",
  INP:              "Interaction to Next Paint",
  CLS:              "Cumulative Layout Shift",
  route_transition: "Route Transition Time",
  api_latency:      "API Latency",
  db_latency:       "DB Latency",
};

const PAGE_ORDER = ["home", "pricing", "lessons", "flashcards", "practice_questions", "cat", "simulation", "ecg", "other"];

function VitalRow({ row }: { row: any }) {
  const { metric, page, p50, p75, p95, p99, sample_count, good_count, needs_improvement_count, poor_count } = row;
  const total = (good_count ?? 0) + (needs_improvement_count ?? 0) + (poor_count ?? 0);
  const goodPct = total > 0 ? Math.round((good_count ?? 0) / total * 100) : 0;
  const poorPct = total > 0 ? Math.round((poor_count ?? 0) / total * 100) : 0;

  return (
    <tr className="border-b hover:bg-slate-50 transition-colors text-sm">
      <td className="py-2 px-3 font-medium text-slate-700 capitalize">
        {page?.replace(/_/g, " ")}
      </td>
      <td className="py-2 px-3 text-slate-600">
        {METRIC_LABELS[metric] ?? metric}
      </td>
      <td className={`py-2 px-3 font-mono ${ratingColor(metric, p50)}`}>{fmtScore(metric, p50)}</td>
      <td className={`py-2 px-3 font-mono ${ratingColor(metric, p75)}`}>{fmtScore(metric, p75)}</td>
      <td className={`py-2 px-3 font-mono ${ratingColor(metric, p95)}`}>{fmtScore(metric, p95)}</td>
      <td className={`py-2 px-3 font-mono ${ratingColor(metric, p99)}`}>{fmtScore(metric, p99)}</td>
      <td className="py-2 px-3">{ratingBadge(metric, p75)}</td>
      <td className="py-2 px-3 text-slate-500">
        {sample_count?.toLocaleString()}
      </td>
      <td className="py-2 px-3">
        <div className="flex gap-1 text-xs">
          <span className="text-green-600">{goodPct}%</span>
          <span className="text-slate-300">/</span>
          <span className="text-red-600">{poorPct}%</span>
        </div>
      </td>
    </tr>
  );
}

function SummaryCards({ data }: { data: any }) {
  const webVitals = ["LCP", "INP", "CLS"];
  const summaries = webVitals.map((metric) => {
    const rows = (data.byPageMetric ?? []).filter((r: any) => r.metric === metric);
    const allP75 = rows.map((r: any) => Number(r.p75)).filter((n: number) => isFinite(n));
    const medianP75 = allP75.length > 0
      ? allP75.sort((a: number, b: number) => a - b)[Math.floor(allP75.length / 2)]
      : null;
    return { metric, value: medianP75 };
  });

  const totalSamples = (data.pageCounts ?? []).reduce((s: number, r: any) => s + (r.events ?? 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {summaries.map(({ metric, value }) => (
        <Card key={metric}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>{METRIC_LABELS[metric]}</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${ratingColor(metric, value ?? undefined)}`}>
              {fmtScore(metric, value)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">P75 across pages</div>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span>Total Samples</span>
          </div>
          <div className="text-2xl font-bold">{totalSamples.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-0.5">In window</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminRumDashboard() {
  const [hours, setHours] = useState(24);
  const [metricFilter, setMetricFilter] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-rum", hours],
    queryFn: () => fetchRumDashboard(hours),
    refetchInterval: 60_000,
  });

  const rows: any[] = data?.byPageMetric ?? [];
  const filteredRows = metricFilter === "all"
    ? rows
    : rows.filter((r: any) => r.metric === metricFilter);

  // Sort by page order then metric
  filteredRows.sort((a: any, b: any) => {
    const pi = PAGE_ORDER.indexOf(a.page) - PAGE_ORDER.indexOf(b.page);
    if (pi !== 0) return pi;
    return a.metric.localeCompare(b.metric);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
          </Link>
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Real User Performance</h1>
          <div className="ml-auto flex items-center gap-2">
            <Select value={String(hours)} onValueChange={(v) => setHours(Number(v))}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 1h</SelectItem>
                <SelectItem value="6">Last 6h</SelectItem>
                <SelectItem value="24">Last 24h</SelectItem>
                <SelectItem value="48">Last 48h</SelectItem>
                <SelectItem value="168">Last 7d</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-slate-500 text-sm py-8 text-center">Loading RUM data…</div>
        )}

        {isError && (
          <div className="text-red-600 text-sm py-8 text-center">Failed to load — check admin auth</div>
        )}

        {data && (
          <>
            <SummaryCards data={data} />

            <Tabs defaultValue="vitals">
              <TabsList className="mb-4">
                <TabsTrigger value="vitals">
                  <BarChart3 className="w-4 h-4 mr-1.5" /> Vitals by Page
                </TabsTrigger>
                <TabsTrigger value="routes">
                  <Clock className="w-4 h-4 mr-1.5" /> Route Transitions
                </TabsTrigger>
                <TabsTrigger value="distribution">
                  <TrendingUp className="w-4 h-4 mr-1.5" /> Page Distribution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vitals">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">P50 / P75 / P95 / P99 by Page × Metric</CardTitle>
                      <Select value={metricFilter} onValueChange={setMetricFilter}>
                        <SelectTrigger className="w-40 h-8 text-sm">
                          <SelectValue placeholder="All metrics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All metrics</SelectItem>
                          {Object.keys(METRIC_LABELS).map(m => (
                            <SelectItem key={m} value={m}>{METRIC_LABELS[m]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-auto">
                    {filteredRows.length === 0 ? (
                      <p className="text-sm text-slate-400 p-6 text-center">
                        No data in this window. Make sure the RUM collector is initialized on learner pages.
                      </p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                            <th className="py-2 px-3 text-left">Page</th>
                            <th className="py-2 px-3 text-left">Metric</th>
                            <th className="py-2 px-3 text-left">P50</th>
                            <th className="py-2 px-3 text-left">P75</th>
                            <th className="py-2 px-3 text-left">P95</th>
                            <th className="py-2 px-3 text-left">P99</th>
                            <th className="py-2 px-3 text-left">Rating</th>
                            <th className="py-2 px-3 text-left">Samples</th>
                            <th className="py-2 px-3 text-left">Good/Poor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRows.map((row: any, i: number) => (
                            <VitalRow key={i} row={row} />
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="routes">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Slowest Route Transitions (P95)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-auto">
                    {(data.slowRoutes ?? []).length === 0 ? (
                      <p className="text-sm text-slate-400 p-6 text-center">No route transition data yet.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                            <th className="py-2 px-3 text-left">Page</th>
                            <th className="py-2 px-3 text-left">P95</th>
                            <th className="py-2 px-3 text-left">Samples</th>
                            <th className="py-2 px-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data.slowRoutes ?? []).map((r: any, i: number) => (
                            <tr key={i} className="border-b hover:bg-slate-50">
                              <td className="py-2 px-3 capitalize">{r.page?.replace(/_/g, " ")}</td>
                              <td className={`py-2 px-3 font-mono ${ratingColor("route_transition", r.p95)}`}>
                                {fmtMs(r.p95)}
                              </td>
                              <td className="py-2 px-3 text-slate-500">{r.samples?.toLocaleString()}</td>
                              <td className="py-2 px-3">{ratingBadge("route_transition", r.p95)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distribution">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Event Volume by Page</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(data.pageCounts ?? []).length === 0 ? (
                      <p className="text-sm text-slate-400 py-4 text-center">No data yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(data.pageCounts ?? []).map((r: any) => {
                          const max = Math.max(...(data.pageCounts ?? []).map((x: any) => x.events ?? 0), 1);
                          const pct = Math.round((r.events / max) * 100);
                          return (
                            <div key={r.page} className="flex items-center gap-3">
                              <div className="w-28 text-sm text-slate-600 capitalize shrink-0">
                                {r.page?.replace(/_/g, " ")}
                              </div>
                              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-3 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="text-sm text-slate-500 w-16 text-right shrink-0">
                                {r.events?.toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-slate-400 mt-4">
              Generated {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "—"} •
              {" "}{data.windowHours}h window • All data anonymized
            </p>
          </>
        )}
      </div>
    </div>
  );
}
