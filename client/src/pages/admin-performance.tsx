import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity, Clock, AlertTriangle, ArrowLeft, Database,
  Zap, BarChart3, RefreshCw, Shield, ToggleRight
} from "lucide-react";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("nn_admin_access_token") || localStorage.getItem("nursenest-user-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchDashboard() {
  const res = await fetch("/api/admin/performance/dashboard", { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch performance data");
  return res.json();
}

function formatMs(ms: number): string {
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString();
}

function OverviewCards({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Total Requests</span>
          </div>
          <div className="text-2xl font-bold" data-testid="text-total-requests">{data.totalRequests.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Error Rate</span>
          </div>
          <div className="text-2xl font-bold" data-testid="text-error-rate">
            <span className={data.overallErrorRate > 5 ? "text-red-600" : data.overallErrorRate > 1 ? "text-amber-600" : "text-green-600"}>
              {data.overallErrorRate}%
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Clock className="w-4 h-4" />
            <span>P95 Latency</span>
          </div>
          <div className="text-2xl font-bold" data-testid="text-p95-latency">
            <span className={data.p95 > 3000 ? "text-red-600" : data.p95 > 1000 ? "text-amber-600" : "text-green-600"}>
              {formatMs(data.p95)}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Zap className="w-4 h-4" />
            <span>Load Level</span>
          </div>
          <div className="text-2xl font-bold" data-testid="text-load-level">
            <Badge className={data.loadLevel === "high" ? "bg-red-100 text-red-800" : data.loadLevel === "elevated" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
              {data.loadLevel}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RouteTimingsTable({ timings }: { timings: any[] }) {
  if (!timings?.length) return <p className="text-slate-500 text-sm">No route timing data available.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-slate-500">
            <th className="pb-2 pr-4">Route</th>
            <th className="pb-2 pr-4 text-right">Count</th>
            <th className="pb-2 pr-4 text-right">P50</th>
            <th className="pb-2 pr-4 text-right">P95</th>
            <th className="pb-2 pr-4 text-right">P99</th>
            <th className="pb-2 text-right">Err%</th>
          </tr>
        </thead>
        <tbody>
          {timings.map((t: any, i: number) => (
            <tr key={i} className="border-b border-slate-100" data-testid={`row-route-timing-${i}`}>
              <td className="py-2 pr-4 font-mono text-xs">{t.routePrefix}</td>
              <td className="py-2 pr-4 text-right">{t.count}</td>
              <td className="py-2 pr-4 text-right">{formatMs(t.p50)}</td>
              <td className={`py-2 pr-4 text-right ${t.p95 > 3000 ? "text-red-600 font-medium" : t.p95 > 1000 ? "text-amber-600" : ""}`}>
                {formatMs(t.p95)}
              </td>
              <td className={`py-2 pr-4 text-right ${t.p99 > 5000 ? "text-red-600 font-medium" : t.p99 > 2000 ? "text-amber-600" : ""}`}>
                {formatMs(t.p99)}
              </td>
              <td className={`py-2 text-right ${t.errorRate > 5 ? "text-red-600 font-medium" : t.errorRate > 1 ? "text-amber-600" : ""}`}>
                {t.errorRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SlowQueriesPanel({ queries }: { queries: any[] }) {
  if (!queries?.length) return <p className="text-slate-500 text-sm">No slow queries recorded.</p>;
  return (
    <div className="space-y-2">
      {queries.slice(0, 20).map((q: any, i: number) => (
        <Card key={i} className="border-slate-200">
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-1">
              <Badge className={q.durationMs > 3000 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                {formatMs(q.durationMs)}
              </Badge>
              <span className="text-xs text-slate-400">{formatTime(q.timestamp)}</span>
            </div>
            <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap break-all mt-1" data-testid={`text-slow-query-${i}`}>
              {q.query}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CircuitBreakersPanel({ breakers }: { breakers: any[] }) {
  if (!breakers?.length) return <p className="text-slate-500 text-sm">No circuit breakers configured.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {breakers.map((cb: any) => (
        <Card key={cb.name} className="border-slate-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <span className="font-medium text-sm" data-testid={`text-cb-name-${cb.name}`}>{cb.name}</span>
              <div className="text-xs text-slate-500 mt-0.5">
                Failures: {cb.failureCount}/{cb.failureThreshold} | Trips: {cb.tripCount}
              </div>
            </div>
            <Badge className={cb.state === "closed" ? "bg-green-100 text-green-800" : cb.state === "open" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
              {cb.state}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureFlagsPanel({ flags }: { flags: any[] }) {
  if (!flags?.length) return <p className="text-slate-500 text-sm">No feature flags.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {flags.map((f: any) => {
        const isOn = f.adminOverride !== null ? f.adminOverride : f.enabled;
        return (
          <div key={f.key} className="flex items-center justify-between p-2 border border-slate-100 rounded text-sm">
            <div>
              <span className="font-medium" data-testid={`text-flag-${f.key}`}>{f.key}</span>
              {f.errorCount > 0 && <span className="ml-2 text-xs text-red-500">({f.errorCount} errors)</span>}
            </div>
            <Badge className={isOn ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}>
              {isOn ? "ON" : "OFF"}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPerformancePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/admin/performance/dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-slate-500 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading performance data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">Failed to load performance data</p>
            <p className="text-red-500 text-sm mt-1">Admin access required</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()} data-testid="button-retry">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
              <Activity className="w-6 h-6 text-blue-600" />
              Performance Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time server performance metrics | Cache: {data?.cacheSize || 0} entries | Slow queries: {data?.slowQueryCount || 0}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {data && <OverviewCards data={data} />}

      <Tabs defaultValue="routes">
        <TabsList>
          <TabsTrigger value="routes" data-testid="tab-routes">
            <BarChart3 className="w-4 h-4 mr-1" /> Route Timings
          </TabsTrigger>
          <TabsTrigger value="queries" data-testid="tab-queries">
            <Database className="w-4 h-4 mr-1" /> Slow Queries
          </TabsTrigger>
          <TabsTrigger value="breakers" data-testid="tab-breakers">
            <Shield className="w-4 h-4 mr-1" /> Circuit Breakers
          </TabsTrigger>
          <TabsTrigger value="flags" data-testid="tab-flags">
            <ToggleRight className="w-4 h-4 mr-1" /> Feature Flags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Route Timing Percentiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="text-sm text-slate-500">P50</div>
                  <div className="text-xl font-bold" data-testid="text-overall-p50">{formatMs(data?.p50 || 0)}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="text-sm text-slate-500">P95</div>
                  <div className="text-xl font-bold" data-testid="text-overall-p95">{formatMs(data?.p95 || 0)}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="text-sm text-slate-500">P99</div>
                  <div className="text-xl font-bold" data-testid="text-overall-p99">{formatMs(data?.p99 || 0)}</div>
                </div>
              </div>
              <RouteTimingsTable timings={data?.routeTimings || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Slow Query Log ({data?.slowQueries?.length || 0} entries)</CardTitle>
            </CardHeader>
            <CardContent>
              <SlowQueriesPanel queries={data?.slowQueries || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakers">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Circuit Breaker Status</CardTitle>
            </CardHeader>
            <CardContent>
              <CircuitBreakersPanel breakers={data?.circuitBreakers || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feature Flag Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureFlagsPanel flags={data?.featureFlags || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {data?.volumeOverTime?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Request Volume (Last Hour)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-24">
              {data.volumeOverTime.map((v: any, i: number) => {
                const maxCount = Math.max(...data.volumeOverTime.map((x: any) => x.count), 1);
                const height = Math.max(2, (v.count / maxCount) * 100);
                return (
                  <div
                    key={i}
                    className="bg-blue-400 rounded-t flex-1 min-w-[3px]"
                    style={{ height: `${height}%` }}
                    title={`${v.count} requests at ${formatTime(v.minute)}`}
                    data-testid={`bar-volume-${i}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{data.volumeOverTime.length > 0 ? formatTime(data.volumeOverTime[0].minute) : ""}</span>
              <span>{data.volumeOverTime.length > 0 ? formatTime(data.volumeOverTime[data.volumeOverTime.length - 1].minute) : ""}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
