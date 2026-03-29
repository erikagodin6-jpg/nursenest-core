import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Zap, AlertTriangle, RefreshCw, CheckCircle2, XCircle,
  ArrowLeft, Power, ToggleRight, ToggleLeft, Server, Eye,
  Activity, Clock, Loader2
} from "lucide-react";

function ConfirmDialog({ title, message, onConfirm, onCancel }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" data-testid="dialog-confirm">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-white" data-testid="text-confirm-title">{title}</h3>
              <p className="text-sm text-slate-300">{message}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-14 text-base border-slate-600 text-slate-300 hover:bg-slate-700" onClick={onCancel} data-testid="button-confirm-cancel">
              Cancel
            </Button>
            <Button className="flex-1 h-14 text-base font-bold bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} data-testid="button-confirm-proceed">
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminOpsEmergency() {
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-ops-status"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ops/status");
      if (!res.ok) throw new Error("Failed to fetch ops status");
      return res.json();
    },
    refetchInterval: 10000,
    retry: 1,
  });

  const actionMutation = useMutation({
    mutationFn: async ({ endpoint, body }: { endpoint: string; body: any }) => {
      const res = await adminFetch(endpoint, { method: "POST", body });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Action failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["admin-ops-status"] });
    },
    onError: (err: Error) => {
      setActionError(err.message);
      setTimeout(() => setActionError(null), 6000);
    },
  });

  function confirmAction(title: string, message: string, endpoint: string, body: any) {
    setConfirm({
      title,
      message,
      action: () => actionMutation.mutate({ endpoint, body }),
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800 border-red-700">
          <CardContent className="p-6 text-center space-y-3">
            <XCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-semibold text-red-300">Connection Failed</h2>
            <p className="text-sm text-slate-400" data-testid="text-em-error">{error?.message || "Unknown error"}</p>
            <Button onClick={() => refetch()} className="bg-slate-700 hover:bg-slate-600" data-testid="button-em-retry">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEmergency = data?.emergencyMode?.active;
  const isMinimalCore = data?.minimalCore?.active;
  const overallHealth = data?.overallHealth || "unknown";
  const openBreakers = (data?.circuitBreakers || []).filter((cb: any) => cb.state !== "closed");
  const activeKillSwitches = (data?.killSwitches || []).filter((ks: any) => ks.active);
  const summary = data?.summary || {};

  return (
    <div className="min-h-screen bg-slate-900 text-white select-none" data-testid="admin-ops-emergency">
      {actionError && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md mx-auto" data-testid="toast-em-action-error">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm flex-1">{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-white/80 hover:text-white text-lg">&times;</button>
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onConfirm={() => { confirm.action(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <Link href="/admin/ops">
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800" data-testid="button-back-to-ops">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2" data-testid="text-emergency-title">
            <Shield className="w-5 h-5 text-red-400" />
            Emergency Controls
          </h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800" onClick={() => refetch()} data-testid="button-refresh-emergency">
            <RefreshCw className={`w-5 h-5 ${actionMutation.isPending ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Card className={`border-2 ${
          isEmergency ? "border-red-500 bg-red-950/80" :
          overallHealth === "critical" ? "border-red-500 bg-red-950/50" :
          overallHealth === "degraded" ? "border-amber-500 bg-amber-950/50" :
          "border-green-500 bg-green-950/50"
        }`}>
          <CardContent className="p-5 text-center">
            {overallHealth === "healthy" && !isEmergency ? (
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-2" />
            ) : overallHealth === "degraded" && !isEmergency ? (
              <AlertTriangle className="w-14 h-14 text-amber-400 mx-auto mb-2" />
            ) : (
              <XCircle className="w-14 h-14 text-red-400 mx-auto mb-2" />
            )}
            <p className="text-2xl font-bold" data-testid="text-emergency-status">
              {isEmergency ? "SAFE MODE ACTIVE" : overallHealth === "healthy" ? "ALL SYSTEMS GO" : overallHealth.toUpperCase()}
            </p>
            {isEmergency && data.emergencyMode?.reason && (
              <p className="text-sm text-red-300 mt-1">{data.emergencyMode.reason}</p>
            )}
            <div className="flex justify-center gap-4 mt-3 text-xs text-slate-400">
              <span>{summary.healthyServices || 0}/{summary.totalServices || 0} services</span>
              <span>{openBreakers.length} breakers open</span>
              <span>{summary.recentIncidentCount || 0} incidents</span>
            </div>
            {isMinimalCore && (
              <Badge className="bg-amber-800 text-amber-200 mt-2">MINIMAL CORE</Badge>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Emergency Actions</h2>

          <button
            className={`w-full h-16 rounded-lg text-lg font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-transform ${
              isEmergency ? "bg-green-600 hover:bg-green-700 active:bg-green-800" : "bg-red-600 hover:bg-red-700 active:bg-red-800"
            }`}
            onClick={() => confirmAction(
              isEmergency ? "Deactivate Safe Mode" : "Activate Safe Mode",
              isEmergency
                ? "This will restore normal platform operations. Users will lose emergency access grants."
                : "This will restrict the platform to read-only mode. All write operations blocked for non-admin users.",
              "/api/admin/ops/action/safe-mode",
              { active: !isEmergency, reason: "emergency_panel_toggle" }
            )}
            data-testid="button-emergency-toggle"
          >
            <Zap className="w-6 h-6" />
            {isEmergency ? "Deactivate Safe Mode" : "Activate Safe Mode"}
          </button>

          <button
            className={`w-full h-14 rounded-lg text-base font-semibold flex items-center justify-between px-5 active:scale-[0.98] transition-transform ${
              isMinimalCore ? "bg-amber-700 hover:bg-amber-800" : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
            }`}
            onClick={() => confirmAction(
              isMinimalCore ? "Deactivate Minimal Core" : "Activate Minimal Core",
              isMinimalCore
                ? "Non-essential features (AI, SEO, analytics) will be re-enabled."
                : "AI, SEO, analytics, and experimental features will be disabled to reduce load.",
              "/api/admin/ops/action/minimal-core",
              { active: !isMinimalCore, reason: "emergency_panel" }
            )}
            data-testid="button-em-toggle-minimal-core"
          >
            <span className="flex items-center gap-3">
              <Server className={`w-5 h-5 ${isMinimalCore ? "text-amber-300" : "text-slate-400"}`} />
              Minimal Core
            </span>
            <Badge className={isMinimalCore ? "bg-amber-800 text-amber-200" : "bg-slate-700 text-slate-300"}>
              {isMinimalCore ? "ON" : "OFF"}
            </Badge>
          </button>

          <button
            className="w-full h-14 rounded-lg text-base font-semibold flex items-center justify-start gap-3 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-[0.98] transition-transform"
            onClick={() => confirmAction(
              "Replay Entitlement Sync",
              "This clears all cached entitlement decisions. Users will re-sync on next access.",
              "/api/admin/ops/action/replay-entitlement-sync",
              {}
            )}
            data-testid="button-em-replay-sync"
          >
            <RefreshCw className="w-5 h-5 text-blue-400" />
            Replay Entitlement Sync
          </button>

          <button
            className="w-full h-14 rounded-lg text-base font-semibold flex items-center justify-start gap-3 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-[0.98] transition-transform"
            onClick={() => {
              actionMutation.mutate({ endpoint: "/api/admin/ops/action/run-health-check", body: {} });
            }}
            data-testid="button-em-run-health"
          >
            <Activity className="w-5 h-5 text-green-400" />
            Run Health Check
          </button>
        </div>

        {openBreakers.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Open Circuit Breakers</h2>
            {openBreakers.map((cb: any) => (
              <button
                key={cb.name}
                className="w-full h-14 rounded-lg text-base font-semibold flex items-center justify-between px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-[0.98] transition-transform"
                onClick={() => confirmAction(
                  `Reset ${cb.name}`,
                  `Reset the circuit breaker for ${cb.name}. Failures: ${cb.failureCount}/${cb.failureThreshold}.`,
                  "/api/admin/ops/action/reset-breaker",
                  { name: cb.name }
                )}
                data-testid={`button-em-reset-breaker-${cb.name}`}
              >
                <span className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-amber-400" />
                  Reset {cb.name}
                </span>
                <Badge className="bg-red-800 text-red-200">{cb.state}</Badge>
              </button>
            ))}
          </div>
        )}

        {activeKillSwitches.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Kill Switches</h2>
            {activeKillSwitches.map((ks: any) => (
              <button
                key={ks.key}
                className="w-full h-14 rounded-lg text-base font-semibold flex items-center justify-between px-5 bg-red-900/50 hover:bg-red-900 border border-red-700 active:scale-[0.98] transition-transform"
                onClick={() => confirmAction(
                  `Deactivate ${ks.key}`,
                  `Deactivate kill switch "${ks.key}" (${ks.scope}: ${ks.target}).`,
                  "/api/admin/ops/action/kill-switch",
                  { key: ks.key, active: false, scope: ks.scope, target: ks.target }
                )}
                data-testid={`button-em-ks-${ks.key}`}
              >
                <span className="flex items-center gap-3">
                  <Power className="w-5 h-5 text-red-400" />
                  <span className="truncate">{ks.key}</span>
                </span>
                <Badge className="bg-red-800 text-red-200">ACTIVE</Badge>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Feature Flags</h2>
          {(data?.featureFlags || [])
            .filter((f: any) => {
              const isOn = f.effectiveEnabled ?? (f.adminOverride !== null ? f.adminOverride : f.enabled);
              return !isOn || f.errorCount > 0;
            })
            .slice(0, 10)
            .map((flag: any) => {
              const isOn = flag.effectiveEnabled ?? (flag.adminOverride !== null ? flag.adminOverride : flag.enabled);
              return (
                <button
                  key={flag.key}
                  className="w-full h-14 rounded-lg text-base font-semibold flex items-center justify-between px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-[0.98] transition-transform"
                  onClick={() => confirmAction(
                    `${isOn ? "Disable" : "Enable"} ${flag.key}`,
                    `${isOn ? "Disable" : "Enable"} the ${flag.description} feature flag.`,
                    "/api/admin/ops/action/feature-flag",
                    { key: flag.key, enabled: !isOn, reason: "emergency_panel" }
                  )}
                  data-testid={`button-em-flag-${flag.key}`}
                >
                  <span className="flex items-center gap-3">
                    {isOn ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5 text-red-400" />}
                    <span className="truncate text-left">{flag.key}</span>
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {flag.errorCount > 0 && <Badge className="bg-red-800 text-red-200">{flag.errorCount} err</Badge>}
                    <Badge className={isOn ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}>{isOn ? "ON" : "OFF"}</Badge>
                  </div>
                </button>
              );
            })}
          {(data?.featureFlags || []).filter((f: any) => {
            const isOn = f.effectiveEnabled ?? (f.adminOverride !== null ? f.adminOverride : f.enabled);
            return !isOn || f.errorCount > 0;
          }).length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">All feature flags healthy</p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Deployment Info</h2>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Version</span>
                <span className="font-mono" data-testid="text-em-version">{data?.deploymentVersion || "unknown"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span data-testid="text-em-uptime">{data?.uptime ? `${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m` : "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subscribers</span>
                <span data-testid="text-em-subscribers">{data?.userCounts?.activeSubscribers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Entitlement Issues</span>
                <span className={data?.entitlementIssues > 0 ? "text-amber-400" : ""} data-testid="text-em-entitlement-issues">{data?.entitlementIssues || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Last Updated</span>
                <span className="text-xs" data-testid="text-em-timestamp">{data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "—"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {(data?.recentIncidents || []).length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Top Incidents ({Math.min((data?.recentIncidents || []).length, 5)})
            </h2>
            {(data?.recentIncidents || []).slice(0, 5).map((inc: any) => (
              <Card key={inc.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    {inc.severity === "critical" ? <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> :
                     inc.severity === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /> :
                     <Activity className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" data-testid={`text-em-incident-${inc.id}`}>{inc.title}</p>
                      <p className="text-xs text-slate-400">{new Date(inc.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700 p-3">
        <div className="max-w-lg mx-auto flex justify-center gap-4">
          <Link href="/admin/ops">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="button-em-nav-dashboard">
              <Eye className="w-4 h-4 mr-1" /> Dashboard
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => refetch()} data-testid="button-em-nav-refresh">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
