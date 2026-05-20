import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity, Database, Cpu, AlertTriangle, Shield, TrendingUp, Gauge } from "lucide-react";
import { useAuth } from "@/lib/auth";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-100 text-green-700",
    ok: "bg-green-100 text-green-700",
    degraded: "bg-amber-100 text-amber-700",
    down: "bg-red-100 text-red-700",
    unknown: "bg-gray-100 text-gray-600",
    open: "bg-red-100 text-red-700",
    "half-open": "bg-amber-100 text-amber-700",
    closed: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.unknown}`} data-testid={`badge-status-${status}`}>
      {status}
    </span>
  );
}

export default function AdminObservability() {
  const { isAdmin } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/observability"],
    queryFn: async () => {
      const res = await fetch("/api/admin/observability", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load observability data");
      return res.json();
    },
    refetchInterval: 30000,
    enabled: isAdmin,
  });

  const { data: growthData } = useQuery({
    queryKey: ["/api/admin/growth-readiness"],
    queryFn: async () => {
      const res = await fetch("/api/admin/growth-readiness", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load growth readiness");
      return res.json();
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500" data-testid="text-admin-required">Admin access required</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" data-testid="loading-observability">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const uptime = data?.uptime ? `${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m` : "N/A";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" data-testid="admin-observability-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-observability-title">Platform Observability</h1>
          <p className="text-sm text-gray-500 mt-1">Uptime: {uptime}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2" data-testid="button-refresh-observability">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-memory">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-memory-rss">{data?.memory?.rssMB || 0} MB</div>
            <p className="text-xs text-gray-500">Heap: {data?.memory?.heapUsedMB || 0}/{data?.memory?.heapTotalMB || 0} MB</p>
          </CardContent>
        </Card>

        <Card data-testid="card-degradation">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Degradation Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-degradation-level">{data?.degradation?.level || 0}</div>
            <p className="text-xs text-gray-500">{data?.degradation?.ladderLabel || "normal"}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-db-pool">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Database className="w-4 h-4" />
              DB Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-db-active">{(data?.dbPool?.totalCount || 0) - (data?.dbPool?.idleCount || 0)}</div>
            <p className="text-xs text-gray-500">Total: {data?.dbPool?.totalCount || 0} / Idle: {data?.dbPool?.idleCount || 0} / Waiting: {data?.dbPool?.waitingCount || 0}</p>
          </CardContent>
        </Card>

        <Card data-testid="card-concurrency">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Active Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-exams">{data?.concurrency?.activeExams || 0}</div>
            <p className="text-xs text-gray-500">Incidents (1h): {data?.concurrency?.recentIncidents1h || 0}</p>
          </CardContent>
        </Card>
      </div>

      {data?.emergencyMode?.active && (
        <Card className="border-red-300 bg-red-50" data-testid="card-emergency-active">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Emergency Mode Active</p>
              <p className="text-xs text-red-600">{data.emergencyMode.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-health-checks">
          <CardHeader>
            <CardTitle className="text-base">Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(data?.healthChecks || []).map((svc: any) => (
                <div key={svc.service} className="flex items-center justify-between py-1.5 border-b last:border-0" data-testid={`health-row-${svc.service}`}>
                  <span className="text-sm font-medium">{svc.service}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{svc.latencyMs}ms</span>
                    <StatusBadge status={svc.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-circuit-breakers">
          <CardHeader>
            <CardTitle className="text-base">Circuit Breakers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(data?.circuitBreakers || []).length === 0 && (
                <p className="text-sm text-gray-400">No circuit breakers active</p>
              )}
              {(data?.circuitBreakers || []).slice(0, 15).map((cb: any) => (
                <div key={cb.name} className="flex items-center justify-between py-1.5 border-b last:border-0" data-testid={`cb-row-${cb.name}`}>
                  <span className="text-sm font-medium">{cb.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">fails: {cb.failureCount}</span>
                    <StatusBadge status={cb.state} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-route-latency">
          <CardHeader>
            <CardTitle className="text-base">Route Latency (Top 15)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {(data?.routeLatency || []).slice(0, 15).map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1 text-sm" data-testid={`latency-row-${i}`}>
                  <span className="font-mono text-xs truncate max-w-[200px]" title={r.route || r.path}>{r.route || r.path}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">avg: {Math.round(r.avgMs || r.avg || 0)}ms</span>
                    <span className="text-xs text-gray-500">p95: {Math.round(r.p95Ms || r.p95 || 0)}ms</span>
                    <span className="text-xs text-gray-400">{r.count || r.calls || 0} calls</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-degradation-ladder">
          <CardHeader>
            <CardTitle className="text-base">Degradation Ladder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Current: Level {data?.degradation?.level || 0} — {data?.degradation?.ladderLabel || "normal"}</span>
              </div>
              {(data?.degradation?.disabledFeatures || []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Disabled features:</p>
                  <div className="flex flex-wrap gap-1">
                    {data.degradation.disabledFeatures.map((f: string) => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {(data?.degradation?.escalationHistory || []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Recent escalations:</p>
                  <div className="space-y-1">
                    {data.degradation.escalationHistory.slice(0, 5).map((e: any, i: number) => (
                      <div key={i} className="text-xs text-gray-500">
                        Level {e.from} → {e.to} ({e.reason}) — {new Date(e.timestamp).toLocaleTimeString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data?.alerts && data.alerts.length > 0 && (
        <Card data-testid="card-alerts">
          <CardHeader>
            <CardTitle className="text-base">Unacknowledged Alerts ({data.alerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.alerts.slice(0, 10).map((alert: any) => (
                <div key={alert.id} className="flex items-start gap-2 p-2 rounded bg-gray-50" data-testid={`alert-row-${alert.id}`}>
                  <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"} className="text-xs mt-0.5">
                    {alert.severity}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <p className="text-xs text-gray-500 truncate">{alert.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {growthData && (
        <Card data-testid="card-growth-readiness">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Growth Readiness
              <Badge
                variant={growthData.readiness === "ready" ? "default" : growthData.readiness === "caution" ? "secondary" : "destructive"}
                className="ml-2"
                data-testid="badge-growth-readiness"
              >
                {growthData.readiness} — Score: {growthData.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(growthData.findings || []).map((f: any, i: number) => (
                <div key={i} className="flex items-start gap-2 py-1" data-testid={`finding-row-${i}`}>
                  <Badge
                    variant={f.severity === "ok" ? "default" : f.severity === "warning" ? "secondary" : "destructive"}
                    className="text-xs mt-0.5 min-w-[60px] text-center"
                  >
                    {f.severity}
                  </Badge>
                  <div className="flex-1">
                    <span className="text-sm">{f.message}</span>
                    <span className="text-xs text-gray-400 ml-2">[{f.category}]</span>
                  </div>
                </div>
              ))}
            </div>
            {growthData.metrics && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold" data-testid="text-total-users">{growthData.metrics.users?.total || 0}</div>
                  <div className="text-xs text-gray-500">Total Users</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold" data-testid="text-subscribers">{growthData.metrics.users?.subscribers || 0}</div>
                  <div className="text-xs text-gray-500">Subscribers</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold" data-testid="text-signups-7d">{growthData.metrics.users?.recentSignups7d || 0}</div>
                  <div className="text-xs text-gray-500">Signups (7d)</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold" data-testid="text-slow-routes">{growthData.metrics.performance?.slowRoutes || 0}</div>
                  <div className="text-xs text-gray-500">Slow Routes</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
