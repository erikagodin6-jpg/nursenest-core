import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch, adminJson } from "@/lib/admin-fetch";
import { ApiError, getAdminOpsMessageForCode, readApiJsonResponse } from "@/lib/api-error";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
} from "lucide-react";

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <Badge className="bg-green-100 text-green-700" data-testid="badge-score-healthy">{score}</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-700" data-testid="badge-score-warning">{score}</Badge>;
  return <Badge className="bg-red-100 text-red-700" data-testid="badge-score-critical">{score}</Badge>;
}

function GateCheckIcon({ passed }: { passed: boolean }) {
  return passed
    ? <CheckCircle2 className="w-4 h-4 text-green-600" />
    : <XCircle className="w-4 h-4 text-red-600" />;
}

export default function AdminContentHealth() {
  const [contentType, setContentType] = useState("all");
  const [sortDir, setSortDir] = useState("asc");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverrideForm, setShowOverrideForm] = useState<string | null>(null);

  const summaryQuery = useQuery({
    queryKey: ["content-health-summary"],
    queryFn: () => adminJson("/api/admin/content-health/summary"),
    refetchInterval: 30000,
  });

  const scoresQuery = useQuery({
    queryKey: ["content-health-scores", contentType, sortDir],
    queryFn: () =>
      adminJson(`/api/admin/content-health/scores?type=${contentType}&sortBy=score&sortDir=${sortDir}`),
  });

  const releaseGateQuery = useQuery({
    queryKey: ["release-gate"],
    queryFn: () => adminJson("/api/admin/release-gate/check"),
  });

  const vipQuery = useQuery({
    queryKey: ["vip-priority-status"],
    queryFn: () => adminJson("/api/admin/vip-priority/status"),
    refetchInterval: 15000,
  });

  const overridesQuery = useQuery({
    queryKey: ["gate-overrides"],
    queryFn: () => adminJson("/api/admin/gate-overrides?limit=20"),
  });

  const releaseOverrideMutation = useMutation({
    mutationFn: async (data: { reason: string; failedChecks: string[] }) => {
      const res = await adminFetch("/api/admin/release-gate/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const parsed = await readApiJsonResponse(res);
      if (!parsed.ok) {
        throw new ApiError(parsed.message, parsed.status, parsed.errorBody);
      }
      return parsed.data;
    },
    onSuccess: () => {
      setOverrideReason("");
      setShowOverrideForm(null);
      releaseGateQuery.refetch();
      overridesQuery.refetch();
    },
  });

  const summary = summaryQuery.data;
  const scores = scoresQuery.data;
  const releaseGate = releaseGateQuery.data;
  const vipStatus = vipQuery.data;

  const contentHealthErrors = [
    summaryQuery.isError && { label: "Summary", q: summaryQuery },
    scoresQuery.isError && { label: "Scores", q: scoresQuery },
    releaseGateQuery.isError && { label: "Release gate", q: releaseGateQuery },
    vipQuery.isError && { label: "VIP status", q: vipQuery },
    overridesQuery.isError && { label: "Overrides", q: overridesQuery },
  ].filter(Boolean) as { label: string; q: { error: unknown; refetch: () => void } }[];

  return (
    <div className="space-y-6" data-testid="admin-content-health">
      {contentHealthErrors.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2" data-testid="banner-content-health-errors">
          {contentHealthErrors.map(({ label, q }) => {
            const err = q.error;
            const msg =
              err instanceof ApiError
                ? getAdminOpsMessageForCode(err.code, err.message)
                : `${label}: failed to load.`;
            return (
              <div key={label} className="flex flex-wrap items-center gap-2 text-sm text-amber-900">
                <span>{msg}</span>
                <Button size="sm" variant="outline" onClick={() => q.refetch()}>
                  Retry {label}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary?.contentTypes?.map((ct: any) => (
          <Card key={ct.label} data-testid={`card-health-${ct.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {ct.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-avg-score-${ct.label.toLowerCase().replace(/\s+/g, "-")}`}>
                {ct.avgScore}/100
              </div>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-green-600" data-testid={`text-healthy-count-${ct.label.toLowerCase().replace(/\s+/g, "-")}`}>{ct.healthy} healthy</span>
                <span className="text-yellow-600">{ct.warning} warning</span>
                <span className="text-red-600">{ct.critical} critical</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{ct.total} total items</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card data-testid="card-release-gate">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Release Gate
            {releaseGate?.passed
              ? <Badge className="bg-green-100 text-green-700 ml-2" data-testid="badge-release-gate-passed">PASSED</Badge>
              : <Badge className="bg-red-100 text-red-700 ml-2" data-testid="badge-release-gate-failed">BLOCKED</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {releaseGate?.checks?.map((check: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded bg-gray-50" data-testid={`row-gate-check-${check.name}`}>
                <GateCheckIcon passed={check.passed} />
                <div className="flex-1">
                  <span className="font-medium text-sm">{check.name.replace(/_/g, " ")}</span>
                  <span className="text-xs text-gray-500 ml-2">{check.detail}</span>
                </div>
                <Badge className={
                  check.severity === "critical" ? "bg-red-100 text-red-700" :
                  check.severity === "warning" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-600"
                }>{check.severity}</Badge>
              </div>
            ))}
          </div>
          {releaseGate && !releaseGate.passed && (
            <div className="mt-4 border-t pt-4">
              {showOverrideForm === "release" ? (
                <div className="space-y-3" data-testid="form-release-override">
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Override requires authorization and will be audit-logged.
                  </p>
                  <Textarea
                    placeholder="Reason for override (required)..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    data-testid="input-override-reason"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!overrideReason.trim() || releaseOverrideMutation.isPending}
                      onClick={() => {
                        const failedChecks = releaseGate.checks
                          .filter((c: any) => !c.passed)
                          .map((c: any) => c.name);
                        releaseOverrideMutation.mutate({ reason: overrideReason, failedChecks });
                      }}
                      data-testid="button-confirm-override"
                    >
                      <Lock className="w-3 h-3 mr-1" />
                      {releaseOverrideMutation.isPending ? "Overriding..." : "Confirm Override"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setShowOverrideForm(null); setOverrideReason(""); }}
                      data-testid="button-cancel-override"
                    >
                      Cancel
                    </Button>
                  </div>
                  {releaseOverrideMutation.isError && (
                    <p className="text-sm text-red-600">
                      {releaseOverrideMutation.error instanceof ApiError
                        ? getAdminOpsMessageForCode(
                            releaseOverrideMutation.error.code,
                            releaseOverrideMutation.error.message,
                          )
                        : (releaseOverrideMutation.error as Error).message}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOverrideForm("release")}
                  data-testid="button-override-release-gate"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Override Gate (Requires Authorization)
                </Button>
              )}
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => releaseGateQuery.refetch()}
              data-testid="button-refresh-release-gate"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Re-check
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-vip-priority">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            VIP Subscriber Prioritization
            {vipStatus?.enabled
              ? <Badge className="bg-green-100 text-green-700 ml-2" data-testid="badge-vip-enabled">ENABLED</Badge>
              : <Badge className="bg-gray-100 text-gray-600 ml-2" data-testid="badge-vip-disabled">DISABLED</Badge>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Total Requests</div>
              <div className="text-lg font-bold" data-testid="text-vip-total-requests">{vipStatus?.metrics?.totalRequests || 0}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Subscriber Requests</div>
              <div className="text-lg font-bold text-blue-600" data-testid="text-vip-subscriber-requests">{vipStatus?.metrics?.subscriberRequests || 0}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Prioritized</div>
              <div className="text-lg font-bold text-green-600" data-testid="text-vip-prioritized">{vipStatus?.metrics?.prioritizedRequests || 0}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Shed (Load)</div>
              <div className="text-lg font-bold text-red-600" data-testid="text-vip-shed">{vipStatus?.metrics?.shedRequests || 0}</div>
            </div>
          </div>

          {vipStatus?.currentLoad && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Current Memory Load</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    vipStatus.currentLoad.memoryPercent > 90 ? "bg-red-500" :
                    vipStatus.currentLoad.memoryPercent > 75 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(vipStatus.currentLoad.memoryPercent, 100)}%` }}
                  data-testid="progress-memory-load"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {vipStatus.currentLoad.heapUsedMB}MB / {vipStatus.currentLoad.heapTotalMB}MB ({vipStatus.currentLoad.memoryPercent}%)
              </div>
            </div>
          )}

          {vipStatus?.config?.loadThresholds && (
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-600 mb-2">Load-Shedding Thresholds</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Object.entries(vipStatus.config.loadThresholds).map(([key, val]: [string, any]) => (
                  <div key={key} className="bg-gray-50 p-2 rounded" data-testid={`text-threshold-${key}`}>
                    <div className="font-medium">{key.replace(/_/g, " ")}</div>
                    <div className="text-gray-600">{Math.round(val * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vipStatus?.metrics?.shedByTier && Object.keys(vipStatus.metrics.shedByTier).length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-600 mb-2">Shed by Tier</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(vipStatus.metrics.shedByTier).map(([tier, count]: [string, any]) => (
                  <Badge key={tier} variant="outline" data-testid={`badge-shed-tier-${tier}`}>
                    {tier}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {vipStatus?.metrics?.recentShedEvents?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 mb-2">Recent Shed Events</div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {vipStatus.metrics.recentShedEvents.slice(0, 10).map((evt: any, i: number) => (
                  <div key={i} className="text-xs flex items-center gap-2 bg-red-50 p-1.5 rounded" data-testid={`row-shed-event-${i}`}>
                    <span className="font-medium text-red-700">{evt.tier}</span>
                    <span className="text-gray-500">{evt.path}</span>
                    <span className="text-gray-400">{evt.reason}</span>
                    <span className="text-gray-400 ml-auto">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-content-scores">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Content Health Scores
            </span>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border rounded px-2 py-1"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                data-testid="select-content-type"
              >
                <option value="all">All Types</option>
                <option value="exam_question">Exam Questions</option>
                <option value="flashcard">Flashcards</option>
                <option value="content_item">Content Items</option>
                <option value="lesson">Lessons</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                data-testid="button-toggle-sort"
              >
                {sortDir === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Score
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scoresQuery.refetch()}
                data-testid="button-refresh-scores"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scores?.summary && (
            <div className="flex gap-4 mb-4 text-sm">
              <span data-testid="text-scores-total">Total: {scores.summary.total}</span>
              <span className="text-green-600" data-testid="text-scores-healthy">Healthy: {scores.summary.healthyCount}</span>
              <span className="text-yellow-600">Warning: {scores.summary.warningCount}</span>
              <span className="text-red-600" data-testid="text-scores-critical">Critical: {scores.summary.criticalCount}</span>
              <span>Avg: {scores.summary.avgScore}/100</span>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-1">
            {scoresQuery.isLoading && <div className="text-gray-500 text-sm">Loading scores...</div>}
            {scores?.scores?.map((item: any) => (
              <div key={`${item.contentType}-${item.contentId}`} className="border rounded p-2" data-testid={`row-score-${item.contentId}`}>
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.contentId ? null : item.contentId)}
                >
                  <ScoreBadge score={item.score} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.title || "Untitled"}</div>
                    <div className="text-xs text-gray-500">{item.contentType} | {item.tier}</div>
                  </div>
                  {expandedItem === item.contentId
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
                {expandedItem === item.contentId && (
                  <div className="mt-2 space-y-1 pl-4 border-l-2" data-testid={`detail-score-${item.contentId}`}>
                    {item.checks?.map((check: any, ci: number) => (
                      <div key={ci} className="flex items-center gap-2 text-xs">
                        <GateCheckIcon passed={check.passed} />
                        <span className={check.passed ? "text-gray-600" : "text-red-600"}>
                          {check.name.replace(/_/g, " ")} ({check.weight}pt)
                        </span>
                        <span className="text-gray-400">{check.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {overridesQuery.data?.overrides?.length > 0 && (
        <Card data-testid="card-gate-overrides">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" />
              Recent Gate Overrides (Audit Log)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {overridesQuery.data.overrides.map((o: any, i: number) => (
                <div key={i} className="text-xs bg-yellow-50 p-2 rounded border border-yellow-200" data-testid={`row-override-${i}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    <span className="font-medium">{o.action || o.gateType}</span>
                    <span className="text-gray-500">by {o.actor_username || o.overriddenBy}</span>
                    <span className="ml-auto text-gray-400">
                      {o.created_at ? new Date(o.created_at).toLocaleString() : new Date(o.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">{o.reason}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
