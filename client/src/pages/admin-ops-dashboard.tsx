import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, Activity, AlertTriangle, RefreshCw, ArrowLeft, Power,
  Zap, ToggleRight, ToggleLeft, CheckCircle2, XCircle, Clock,
  Server, Heart, Copy, Smartphone, Eye, Bell, BellOff,
  HardDrive, Users, AlertCircle, TrendingDown, Loader2,
  Gauge, MemoryStick, Timer, Database
} from "lucide-react";

function getStatusBg(status: string) {
  switch (status) {
    case "healthy": case "closed": return "bg-green-100 text-green-800";
    case "degraded": case "half-open": return "bg-amber-100 text-amber-800";
    case "down": case "open": case "critical": return "bg-red-100 text-red-800";
    default: return "bg-slate-100 text-slate-800";
  }
}

function SeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case "critical": return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    default: return <Activity className="w-4 h-4 text-blue-500" />;
  }
}

function ConfirmDialog({ title, message, onConfirm, onCancel, destructive }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void; destructive?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="dialog-confirm-overlay">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4" data-testid="dialog-confirm">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} data-testid="button-confirm-cancel">Cancel</Button>
          <Button variant={destructive ? "destructive" : "default"} size="sm" onClick={onConfirm} data-testid="button-confirm-action">Confirm</Button>
        </div>
      </div>
    </div>
  );
}

function buildStatusSummary(data: any): string {
  if (!data) return "No data available";
  const lines: string[] = [
    `NurseNest Ops Status — ${new Date().toLocaleString()}`,
    `Overall: ${data.overallHealth?.toUpperCase() || "UNKNOWN"}`,
    `Version: ${data.deploymentVersion || "unknown"}`,
    `Uptime: ${Math.round((data.uptime || 0) / 60)} min`,
    `Emergency Mode: ${data.emergencyMode?.active ? "ACTIVE" : "OFF"}`,
    `Minimal Core: ${data.minimalCore?.active ? "ACTIVE" : "OFF"}`,
    "",
    "Services:",
    ...(data.healthChecks || []).map((h: any) => `  ${h.service}: ${h.status} (${h.latencyMs}ms)${h.details ? ` — ${h.details}` : ""}`),
    "",
    `Circuit Breakers: ${data.summary?.openBreakers || 0} open`,
    `Disabled Flags: ${data.summary?.disabledFlags || 0}`,
    `Active Kill Switches: ${data.summary?.activeKillSwitches || 0}`,
    `Active Subscribers: ${data.userCounts?.activeSubscribers || 0}`,
    `Entitlement Issues: ${data.entitlementIssues || 0}`,
    `Recent Incidents (24h): ${data.summary?.recentIncidentCount || 0}`,
  ];
  return lines.join("\n");
}

function OverallHealthBanner({ data }: { data: any }) {
  const health = data?.overallHealth || "unknown";
  const bannerStyles: Record<string, string> = {
    healthy: "bg-green-50 border-green-200",
    degraded: "bg-amber-50 border-amber-200",
    critical: "bg-red-50 border-red-200",
  };
  const textStyles: Record<string, string> = {
    healthy: "text-green-800",
    degraded: "text-amber-800",
    critical: "text-red-800",
  };

  return (
    <div className={`border rounded-lg p-4 ${bannerStyles[health] || "bg-slate-50 border-slate-200"}`} data-testid="banner-overall-health">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {health === "healthy" ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
           health === "degraded" ? <AlertTriangle className="w-6 h-6 text-amber-600" /> :
           <XCircle className="w-6 h-6 text-red-600" />}
          <div className={`text-lg font-bold ${textStyles[health] || "text-slate-800"}`} data-testid="text-overall-health">
            {health === "healthy" ? "All Systems Operational" : health === "degraded" ? "Degraded Performance" : health === "critical" ? "Major Outage" : "Unknown"}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
          <span>Version: <strong data-testid="text-version">{data?.deploymentVersion || "—"}</strong></span>
          <span>Uptime: <strong data-testid="text-uptime">{data?.uptime ? `${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m` : "—"}</strong></span>
          <span className="text-xs text-slate-400">Updated: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "—"}</span>
        </div>
      </div>
      {(data?.emergencyMode?.active || data?.minimalCore?.active) && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {data.emergencyMode?.active && <Badge className="bg-red-600 text-white animate-pulse" data-testid="badge-emergency-active">SAFE MODE ACTIVE</Badge>}
          {data.minimalCore?.active && <Badge className="bg-amber-600 text-white" data-testid="badge-minimal-core-active">MINIMAL CORE MODE</Badge>}
        </div>
      )}
    </div>
  );
}

function SummaryCards({ data }: { data: any }) {
  const s = data?.summary || {};
  const cards = [
    { label: "Services", value: `${s.healthyServices || 0}/${s.totalServices || 0}`, icon: Heart, color: s.healthyServices === s.totalServices ? "text-green-600" : "text-amber-600" },
    { label: "Open Breakers", value: s.openBreakers || 0, icon: Zap, color: (s.openBreakers || 0) > 0 ? "text-red-600" : "text-green-600" },
    { label: "Disabled Flags", value: s.disabledFlags || 0, icon: ToggleLeft, color: (s.disabledFlags || 0) > 0 ? "text-amber-600" : "text-green-600" },
    { label: "Kill Switches", value: s.activeKillSwitches || 0, icon: Power, color: (s.activeKillSwitches || 0) > 0 ? "text-red-600" : "text-green-600" },
    { label: "Incidents (24h)", value: s.recentIncidentCount || 0, icon: AlertTriangle, color: (s.recentIncidentCount || 0) > 0 ? "text-amber-600" : "text-green-600" },
    { label: "Unacked Alerts", value: s.unacknowledgedAlerts || 0, icon: Bell, color: (s.unacknowledgedAlerts || 0) > 0 ? "text-red-600" : "text-green-600" },
    { label: "Subscribers", value: data?.userCounts?.activeSubscribers || 0, icon: Users, color: "text-blue-600" },
    { label: "Entitlement Issues", value: data?.entitlementIssues || 0, icon: TrendingDown, color: (data?.entitlementIssues || 0) > 0 ? "text-amber-600" : "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-3 text-center">
            <card.icon className={`w-4 h-4 mx-auto mb-1 ${card.color}`} />
            <p className={`text-xl font-bold ${card.color}`} data-testid={`stat-${card.label.toLowerCase().replace(/[\s()\/]+/g, "-")}`}>{card.value}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function QuickActionsPanel({ data, onAction }: { data: any; onAction: (endpoint: string, body: any, confirm?: { title: string; message: string; destructive?: boolean }) => void }) {
  const isSafeMode = data?.emergencyMode?.active;
  const isMinimalCore = data?.minimalCore?.active;

  return (
    <div className="space-y-3">
      <Card className={isSafeMode ? "border-red-300 bg-red-50" : "border-green-200"}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Safe Mode (Emergency Mode)</p>
            <p className="text-xs text-slate-500">Restricts platform to read-only core features</p>
            {isSafeMode && data.emergencyMode?.reason && <p className="text-xs text-red-600 mt-1">Reason: {data.emergencyMode.reason}</p>}
          </div>
          <Button
            size="sm"
            variant={isSafeMode ? "outline" : "destructive"}
            onClick={() => onAction("/api/admin/ops/action/safe-mode", { active: !isSafeMode, reason: "ops_dashboard" }, {
              title: isSafeMode ? "Deactivate Safe Mode" : "Activate Safe Mode",
              message: isSafeMode ? "This will restore normal platform operations." : "This will restrict the platform to read-only mode. All write operations will be blocked for non-admin users.",
              destructive: !isSafeMode,
            })}
            data-testid="button-toggle-safe-mode"
          >
            <Zap className="w-4 h-4 mr-1" />
            {isSafeMode ? "Deactivate" : "Activate"}
          </Button>
        </CardContent>
      </Card>

      <Card className={isMinimalCore ? "border-amber-300 bg-amber-50" : ""}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Minimal Core Mode</p>
            <p className="text-xs text-slate-500">Disables non-essential features to reduce load</p>
          </div>
          <Button
            size="sm"
            variant={isMinimalCore ? "outline" : "default"}
            onClick={() => onAction("/api/admin/ops/action/minimal-core", { active: !isMinimalCore, reason: "ops_dashboard" }, {
              title: isMinimalCore ? "Deactivate Minimal Core" : "Activate Minimal Core",
              message: isMinimalCore ? "Non-essential features will be re-enabled." : "AI, SEO, analytics, and experimental features will be disabled.",
              destructive: !isMinimalCore,
            })}
            data-testid="button-toggle-minimal-core"
          >
            <Server className="w-4 h-4 mr-1" />
            {isMinimalCore ? "Deactivate" : "Activate"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Replay Entitlement Sync</p>
            <p className="text-xs text-slate-500">Clear entitlement cache and force re-sync</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction("/api/admin/ops/action/replay-entitlement-sync", {}, {
              title: "Replay Entitlement Sync",
              message: "This will clear the entitlement cache. All user subscriptions will re-sync on their next access.",
            })}
            data-testid="button-replay-sync"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Replay
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Run Health Check</p>
            <p className="text-xs text-slate-500">Manually trigger a full health check</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction("/api/admin/ops/action/run-health-check", {})}
            data-testid="button-run-health-check"
          >
            <Activity className="w-4 h-4 mr-1" /> Run Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthChecksSection({ checks }: { checks: any[] }) {
  if (!checks?.length) return <p className="text-slate-500 text-sm">No health data available.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {checks.map((check: any) => (
        <Card key={check.service} className="border-slate-200">
          <CardContent className="p-3 flex items-center gap-3">
            {check.status === "healthy" ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> :
             check.status === "degraded" ? <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" /> :
             <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 truncate" data-testid={`text-health-${check.service}`}>{check.service}</span>
                <span className="text-xs text-slate-400 ml-2">{check.latencyMs}ms</span>
              </div>
              {check.details && <p className="text-xs text-slate-500 truncate">{check.details}</p>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureFlagsSection({ flags, onAction }: { flags: any[]; onAction: (endpoint: string, body: any, confirm?: any) => void }) {
  if (!flags?.length) return <p className="text-slate-500 text-sm">No feature flags configured.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {flags.map((flag: any) => {
        const isOn = flag.effectiveEnabled ?? (flag.adminOverride !== null ? flag.adminOverride : flag.enabled);
        return (
          <Card key={flag.key} className="border-slate-200">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 truncate" data-testid={`text-flag-${flag.key}`}>{flag.key}</span>
                  <Badge className={isOn ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{isOn ? "ON" : "OFF"}</Badge>
                  {flag.adminOverride !== null && <Badge className="bg-blue-100 text-blue-800 text-[10px]">override</Badge>}
                </div>
                <p className="text-xs text-slate-500 truncate">{flag.description}</p>
                {flag.errorCount > 0 && <span className="text-xs text-red-500">Errors: {flag.errorCount}/{flag.errorThreshold}</span>}
              </div>
              <Button
                size="sm"
                variant={isOn ? "default" : "outline"}
                onClick={() => onAction("/api/admin/ops/action/feature-flag", { key: flag.key, enabled: !isOn }, {
                  title: `${isOn ? "Disable" : "Enable"} ${flag.key}`,
                  message: `Are you sure you want to ${isOn ? "disable" : "enable"} "${flag.description}"?`,
                  destructive: isOn,
                })}
                data-testid={`button-toggle-flag-${flag.key}`}
              >
                {isOn ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CircuitBreakersSection({ breakers, onAction }: { breakers: any[]; onAction: (endpoint: string, body: any, confirm?: any) => void }) {
  if (!breakers?.length) return <p className="text-slate-500 text-sm">No circuit breakers configured.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {breakers.map((cb: any) => (
        <Card key={cb.name} className="border-slate-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700" data-testid={`text-cb-${cb.name}`}>{cb.name}</span>
                <Badge className={getStatusBg(cb.state)}>{cb.state}</Badge>
              </div>
              <div className="text-xs text-slate-500">Failures: {cb.failureCount}/{cb.failureThreshold} | Trips: {cb.tripCount}</div>
            </div>
            {cb.state !== "closed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("/api/admin/ops/action/reset-breaker", { name: cb.name }, {
                  title: `Reset ${cb.name}`,
                  message: `Reset circuit breaker "${cb.name}"? Failures: ${cb.failureCount}/${cb.failureThreshold}.`,
                })}
                data-testid={`button-reset-cb-${cb.name}`}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KillSwitchesSection({ switches, onAction }: { switches: any[]; onAction: (endpoint: string, body: any, confirm?: any) => void }) {
  return (
    <div className="space-y-2">
      {switches?.length > 0 ? switches.map((ks: any) => (
        <Card key={ks.key} className="border-slate-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700" data-testid={`text-ks-${ks.key}`}>{ks.key}</span>
                <Badge className={ks.active ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>{ks.active ? "ACTIVE" : "INACTIVE"}</Badge>
                <Badge variant="outline" className="text-[10px]">{ks.scope}: {ks.target}</Badge>
              </div>
              {ks.reason && <p className="text-xs text-slate-500">Reason: {ks.reason}</p>}
            </div>
            <Button
              size="sm"
              variant={ks.active ? "outline" : "destructive"}
              onClick={() => onAction("/api/admin/ops/action/kill-switch", { key: ks.key, active: !ks.active, scope: ks.scope, target: ks.target }, {
                title: `${ks.active ? "Deactivate" : "Activate"} ${ks.key}`,
                message: `Are you sure you want to ${ks.active ? "deactivate" : "activate"} kill switch "${ks.key}"?`,
                destructive: !ks.active,
              })}
              data-testid={`button-toggle-ks-${ks.key}`}
            >
              <Power className="w-3 h-3 mr-1" />
              {ks.active ? "Deactivate" : "Activate"}
            </Button>
          </CardContent>
        </Card>
      )) : <p className="text-slate-500 text-sm">No kill switches configured.</p>}
    </div>
  );
}

function IncidentsSection({ incidents, onAction }: { incidents: any[]; onAction: (endpoint: string, body: any) => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!incidents?.length) return <p className="text-slate-500 text-sm">No recent incidents (24h).</p>;

  const copyIncidentSummary = (incident: any) => {
    const summary = `[${incident.severity?.toUpperCase()}] ${incident.title}\n${incident.message}\nTime: ${new Date(incident.createdAt).toLocaleString()}\nSource: ${incident.source || "unknown"}`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopiedId(incident.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {incidents.map((inc: any) => (
        <Card key={inc.id} className={`border-slate-200 ${inc.acknowledged ? "opacity-60" : ""}`}>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <SeverityIcon severity={inc.severity} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate" data-testid={`text-incident-${inc.id}`}>{inc.title}</p>
                  <p className="text-xs text-slate-500 truncate">{inc.message}</p>
                  <p className="text-xs text-slate-400">{new Date(inc.createdAt).toLocaleString()} | {inc.source || "system"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => copyIncidentSummary(inc)} data-testid={`button-copy-incident-${inc.id}`}>
                  {copiedId === inc.id ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </Button>
                {!inc.acknowledged && (
                  <Button size="sm" variant="ghost" onClick={() => onAction("/api/admin/ops/action/acknowledge-alert", { alertId: inc.id })} data-testid={`button-ack-incident-${inc.id}`}>
                    <BellOff className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExamHealthSection({ examHealth }: { examHealth: any }) {
  if (!examHealth) return <p className="text-slate-500 text-sm">No exam health data.</p>;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {Object.entries(examHealth.tiers || {}).map(([tier, health]: [string, any]) => (
          <Card key={tier}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium uppercase">{tier}</span>
                <Badge className={health.healthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {health.healthy ? "Healthy" : "Issues"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">{health.totalAvailable} questions (min: {health.minimumRequired})</p>
              {health.issues?.map((issue: string, i: number) => <p key={i} className="text-xs text-red-500">{issue}</p>)}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-slate-500">Quarantined questions: <strong>{examHealth.quarantinedCount || 0}</strong></p>
    </div>
  );
}

function BackupHealthSection({ backupStatus }: { backupStatus: any }) {
  if (!backupStatus) return <p className="text-slate-500 text-sm">No backup data available.</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {Object.entries(backupStatus.components || {}).map(([name, info]: [string, any]) => (
        <Card key={name}>
          <CardContent className="p-3 text-center">
            <HardDrive className={`w-4 h-4 mx-auto mb-1 ${info.exists ? "text-green-500" : "text-slate-300"}`} />
            <p className="text-xs font-medium">{name}</p>
            <p className="text-xs text-slate-500">{info.exists ? `${info.count} files` : "Not found"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EventsSection({ events }: { events: any[] }) {
  if (!events?.length) return <p className="text-slate-500 text-sm">No recent events.</p>;
  return (
    <div className="space-y-1 max-h-[500px] overflow-y-auto">
      {events.slice(0, 50).map((event: any) => (
        <div key={event.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded text-xs" data-testid={`event-${event.id}`}>
          <Clock className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-slate-700">{event.type}</span>
            <span className="text-slate-500 ml-1">{event.source}</span>
            <span className="text-slate-400 ml-2">{new Date(event.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResiliencePanel() {
  const [smokeLoading, setSmokeLoading] = useState(false);

  const { data: budgetData } = useQuery({
    queryKey: ["admin-resource-budgets"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/resource-budgets");
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: containmentData } = useQuery({
    queryKey: ["admin-auto-containment"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/auto-containment/status");
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 30000,
    retry: 1,
  });

  const { data: qualityGates } = useQuery({
    queryKey: ["admin-quality-gates"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/content-publishing/quality-gates");
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 60000,
    retry: 1,
  });

  const queryClient = useQueryClient();

  const runSmoke = async () => {
    setSmokeLoading(true);
    try {
      await adminFetch("/api/admin/smoke-tests/run", { method: "POST" });
      queryClient.invalidateQueries({ queryKey: ["admin-auto-containment"] });
    } catch {}
    setSmokeLoading(false);
  };

  const report = budgetData?.report;
  const memHistory = budgetData?.memoryHistory || [];
  const latencyP = budgetData?.latencyPercentiles || {};
  const errorRates = budgetData?.errorRateByRoute || [];
  const runbooks = containmentData?.runbooks ? Object.values(containmentData.runbooks) : [];
  const smokeHistory = containmentData?.smokeTestHistory || [];

  return (
    <div className="space-y-6" data-testid="panel-resilience">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <MemoryStick className={`w-4 h-4 mx-auto mb-1 ${report?.memory?.overBudget ? "text-red-600" : "text-green-600"}`} />
            <p className="text-lg font-bold" data-testid="stat-memory-rss">{report ? `${Math.round((report.memory?.current?.rss || 0) / 1024 / 1024)}MB` : "—"}</p>
            <p className="text-[10px] text-slate-500">RSS Memory</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Timer className={`w-4 h-4 mx-auto mb-1 ${(latencyP.p95 || 0) > 5000 ? "text-red-600" : "text-green-600"}`} />
            <p className="text-lg font-bold" data-testid="stat-p95-latency">{latencyP.p95 ? `${latencyP.p95}ms` : "—"}</p>
            <p className="text-[10px] text-slate-500">P95 Latency</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <AlertCircle className={`w-4 h-4 mx-auto mb-1 ${(report?.violations?.criticalCount || 0) > 0 ? "text-red-600" : "text-green-600"}`} />
            <p className="text-lg font-bold" data-testid="stat-violations">{report?.violations?.criticalCount ?? "—"}</p>
            <p className="text-[10px] text-slate-500">Critical Violations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Database className={`w-4 h-4 mx-auto mb-1 ${report?.heavyJobs?.atLimit ? "text-amber-600" : "text-green-600"}`} />
            <p className="text-lg font-bold" data-testid="stat-heavy-jobs">{report ? `${report.heavyJobs?.active || 0}/${report.heavyJobs?.limit || 3}` : "—"}</p>
            <p className="text-[10px] text-slate-500">Heavy Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Gauge className={`w-4 h-4 mx-auto mb-1 ${qualityGates?.passed === false ? "text-red-600" : "text-green-600"}`} />
            <p className="text-lg font-bold" data-testid="stat-quality-gates">{qualityGates ? (qualityGates.passed ? "PASS" : "FAIL") : "—"}</p>
            <p className="text-[10px] text-slate-500">Quality Gates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Shield className={`w-4 h-4 mx-auto mb-1 ${report?.canDeploy ? "text-green-600" : "text-red-600"}`} />
            <p className="text-lg font-bold" data-testid="stat-deploy-ready">{report ? (report.canDeploy ? "YES" : "NO") : "—"}</p>
            <p className="text-[10px] text-slate-500">Deploy Ready</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><MemoryStick className="w-4 h-4" /> Memory Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {memHistory.length > 0 ? (
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {memHistory.slice(-20).map((snap: any, i: number) => {
                  const rssMB = Math.round(snap.rss / 1024 / 1024);
                  const heapMB = Math.round(snap.heapUsed / 1024 / 1024);
                  const pct = Math.min(100, (rssMB / 400) * 100);
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs" data-testid={`memory-snapshot-${i}`}>
                      <span className="text-slate-400 w-16">{new Date(snap.timestamp).toLocaleTimeString()}</span>
                      <div className="flex-1 bg-slate-100 rounded h-3 overflow-hidden">
                        <div className={`h-full ${pct > 80 ? "bg-red-400" : pct > 60 ? "bg-amber-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-20 text-right">{rssMB}MB / {heapMB}MB</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-xs text-slate-500">No memory data yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Error Rate by Route</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {errorRates.length > 0 ? (
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {errorRates.slice(0, 15).map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs" data-testid={`error-rate-${i}`}>
                    <span className="text-slate-700 truncate max-w-[200px]">{r.route}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{r.errors}/{r.total}</span>
                      <Badge className={r.rate > 0.1 ? "bg-red-100 text-red-800" : r.rate > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                        {(r.rate * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">No error data in the last 15 minutes</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> Auto-Containment Runbooks</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {(runbooks as any[]).length > 0 ? (
              <div className="space-y-2">
                {(runbooks as any[]).map((rb: any) => (
                  <div key={rb.name} className="flex items-center justify-between p-2 bg-slate-50 rounded" data-testid={`runbook-${rb.name}`}>
                    <div>
                      <span className="text-sm font-medium text-slate-700">{rb.name}</span>
                      <div className="text-xs text-slate-500">
                        Triggers: {rb.triggerCount} | Last: {rb.lastTriggered ? new Date(rb.lastTriggered).toLocaleTimeString() : "never"}
                      </div>
                    </div>
                    <Badge className={rb.enabled ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}>
                      {rb.enabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">No runbook data</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" /> Smoke Tests</CardTitle>
              <Button size="sm" variant="outline" onClick={runSmoke} disabled={smokeLoading} data-testid="button-run-smoke-tests">
                {smokeLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                Run
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {smokeHistory.length > 0 ? (
              <div className="space-y-2">
                {smokeHistory.slice(0, 5).map((report: any, i: number) => (
                  <div key={i} className={`p-2 rounded text-xs ${report.overallStatus === "pass" ? "bg-green-50" : "bg-red-50"}`} data-testid={`smoke-test-${i}`}>
                    <div className="flex justify-between items-center">
                      <Badge className={report.overallStatus === "pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {report.passed}/{report.totalTests} passed
                      </Badge>
                      <span className="text-slate-500">{new Date(report.runAt).toLocaleTimeString()}</span>
                    </div>
                    {report.rollbackRecommended && <p className="text-red-600 font-medium mt-1">Rollback recommended</p>}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">No smoke test history</p>}
          </CardContent>
        </Card>
      </div>

      {qualityGates && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Gauge className="w-4 h-4" /> Content Quality Gates</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {qualityGates.checks?.map((check: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs" data-testid={`quality-gate-${i}`}>
                  <span className="text-slate-700">{check.name}</span>
                  <Badge className={check.status === "pass" ? "bg-green-100 text-green-800" : check.status === "warn" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}>
                    {check.status.toUpperCase()}{check.count !== undefined ? ` (${check.count})` : ""}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {report?.violations?.recent?.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Recent Budget Violations</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-1 max-h-[250px] overflow-y-auto">
              {report.violations.recent.slice(0, 20).map((v: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs" data-testid={`violation-${i}`}>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-slate-700 truncate block">{v.message}</span>
                    <span className="text-slate-400">{new Date(v.timestamp).toLocaleTimeString()} | {v.endpoint}</span>
                  </div>
                  <Badge className={v.severity === "critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                    {v.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminOpsDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; action: () => void; destructive?: boolean } | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-ops-status"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ops/status");
      if (!res.ok) throw new Error("Failed to fetch ops status");
      return res.json();
    },
    refetchInterval: 15000,
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

  const handleAction = useCallback((endpoint: string, body: any, confirm?: { title: string; message: string; destructive?: boolean }) => {
    if (confirm) {
      setConfirmDialog({
        ...confirm,
        action: () => actionMutation.mutate({ endpoint, body }),
      });
    } else {
      actionMutation.mutate({ endpoint, body });
    }
  }, [actionMutation]);

  const handleCopySummary = useCallback(() => {
    navigator.clipboard.writeText(buildStatusSummary(data)).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading operations status...
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardContent className="p-6 text-center space-y-3">
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-lg font-semibold text-red-800">Failed to Load Operations Status</h2>
            <p className="text-sm text-red-600" data-testid="text-error-message">{error?.message || "Unknown error"}</p>
            <Button onClick={() => refetch()} data-testid="button-retry">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6" data-testid="admin-ops-dashboard">
      {actionError && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm animate-in" data-testid="toast-action-error">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{actionError}</span>
          <button onClick={() => setActionError(null)} className="ml-2 text-white/80 hover:text-white">&times;</button>
        </div>
      )}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          destructive={confirmDialog.destructive}
          onConfirm={() => { confirmDialog.action(); setConfirmDialog(null); }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" data-testid="button-back-admin"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2" data-testid="text-page-title">
                <Shield className="w-5 h-5 text-indigo-600" /> Operations Status
              </h1>
              <p className="text-xs text-slate-500">Consolidated platform health & controls</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={handleCopySummary} data-testid="button-copy-summary">
              <Copy className="w-3 h-3 mr-1" /> {copiedSummary ? "Copied!" : "Copy Summary"}
            </Button>
            <Link href="/admin/ops/emergency">
              <Button size="sm" variant="outline" data-testid="button-open-emergency-panel">
                <Smartphone className="w-3 h-3 mr-1" /> Emergency Panel
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={() => refetch()} data-testid="button-refresh-ops">
              <RefreshCw className="w-3 h-3 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <OverallHealthBanner data={data} />
        <SummaryCards data={data} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:grid-cols-9 w-full">
            <TabsTrigger value="overview" data-testid="tab-overview"><Eye className="w-3 h-3 mr-1 hidden md:inline" /> Overview</TabsTrigger>
            <TabsTrigger value="health" data-testid="tab-health"><Heart className="w-3 h-3 mr-1 hidden md:inline" /> Health</TabsTrigger>
            <TabsTrigger value="resilience" data-testid="tab-resilience"><Gauge className="w-3 h-3 mr-1 hidden md:inline" /> Resilience</TabsTrigger>
            <TabsTrigger value="flags" data-testid="tab-flags"><ToggleRight className="w-3 h-3 mr-1 hidden md:inline" /> Flags</TabsTrigger>
            <TabsTrigger value="breakers" data-testid="tab-breakers"><Zap className="w-3 h-3 mr-1 hidden md:inline" /> Breakers</TabsTrigger>
            <TabsTrigger value="switches" data-testid="tab-switches"><Power className="w-3 h-3 mr-1 hidden md:inline" /> Switches</TabsTrigger>
            <TabsTrigger value="incidents" data-testid="tab-incidents"><AlertTriangle className="w-3 h-3 mr-1 hidden md:inline" /> Incidents</TabsTrigger>
            <TabsTrigger value="actions" data-testid="tab-actions"><Zap className="w-3 h-3 mr-1 hidden md:inline" /> Actions</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events"><Clock className="w-3 h-3 mr-1 hidden md:inline" /> Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            <QuickActionsPanel data={data} onAction={handleAction} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Exam Health</h3>
                <ExamHealthSection examHealth={data?.examHealth} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Backup Status</h3>
                <BackupHealthSection backupStatus={data?.backupStatus} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="health" className="mt-4">
            <HealthChecksSection checks={data?.healthChecks || []} />
          </TabsContent>

          <TabsContent value="resilience" className="mt-4">
            <ResiliencePanel />
          </TabsContent>

          <TabsContent value="flags" className="mt-4">
            <FeatureFlagsSection flags={data?.featureFlags || []} onAction={handleAction} />
          </TabsContent>

          <TabsContent value="breakers" className="mt-4">
            <CircuitBreakersSection breakers={data?.circuitBreakers || []} onAction={handleAction} />
          </TabsContent>

          <TabsContent value="switches" className="mt-4">
            <KillSwitchesSection switches={data?.killSwitches || []} onAction={handleAction} />
          </TabsContent>

          <TabsContent value="incidents" className="mt-4">
            <IncidentsSection incidents={data?.recentIncidents || []} onAction={handleAction} />
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <QuickActionsPanel data={data} onAction={handleAction} />
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <EventsSection events={data?.events || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
