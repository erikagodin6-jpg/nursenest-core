import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Activity, Clock, ArrowLeft, Zap, ToggleLeft, ToggleRight,
  Users, FileX, Lock, Play, Archive, Timer, Download,
  Bell, Settings, Database, ArrowRightLeft, AlertOctagon,
} from "lucide-react";

type TabId = "overview" | "failing-routes" | "fallbacks" | "quarantine" | "validation" | "provisional" | "entitlements" | "incidents" | "backup-usage" | "alerts";

function HealthBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; label: string }> = {
    healthy: { bg: "bg-green-100 text-green-800", label: "Healthy" },
    degraded: { bg: "bg-amber-100 text-amber-800", label: "Degraded" },
    critical: { bg: "bg-red-100 text-red-800", label: "Critical" },
  };
  const c = config[status] || config.degraded;
  return <Badge className={c.bg} data-testid={`badge-health-${status}`}>{c.label}</Badge>;
}

function SummaryCards({ data }: { data: any }) {
  if (!data) return null;
  const cards = [
    { label: "Failing Routes", value: data.failingRouteCount, icon: AlertTriangle, color: "text-red-500", testId: "card-failing-routes" },
    { label: "Fallback Events", value: data.fallbackCount, icon: Activity, color: "text-amber-500", testId: "card-fallback-events" },
    { label: "Quarantined", value: data.quarantineCount, icon: FileX, color: "text-orange-500", testId: "card-quarantined" },
    { label: "Validation Failures", value: data.validationFailureCount, icon: XCircle, color: "text-red-500", testId: "card-validation-failures" },
    { label: "Provisional Access", value: data.provisionalAccessCount, icon: Lock, color: "text-blue-500", testId: "card-provisional-access" },
    { label: "Entitlement Mismatches", value: data.entitlementMismatchCount, icon: Users, color: "text-purple-500", testId: "card-entitlement-mismatches" },
    { label: "Active Incidents", value: data.activeIncidentCount, icon: Zap, color: "text-red-600", testId: "card-active-incidents" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3" data-testid="section-summary-cards">
      {cards.map((card) => (
        <Card key={card.testId} data-testid={card.testId}>
          <CardContent className="pt-4 pb-4 text-center">
            <card.icon className={`w-6 h-6 mx-auto mb-1 ${card.color}`} />
            <p className="text-2xl font-bold" data-testid={`text-${card.testId}-value`}>{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FailingRoutesTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-failing-routes"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/failing-routes");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner label="Loading failing routes..." />;
  if (!data?.routes?.length) return <EmptyState icon={CheckCircle} label="No failing routes detected" />;

  return (
    <div className="space-y-3" data-testid="list-failing-routes">
      {data.routes.map((route: any, idx: number) => (
        <Card key={idx} data-testid={`failing-route-${idx}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <code className="text-sm font-medium" data-testid={`text-route-path-${idx}`}>{route.path}</code>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span>Errors (24h): <strong className="text-red-600">{route.errors24h ?? route.totalErrors}</strong></span>
                  <span>Last seen: {new Date(route.lastSeen).toLocaleString()}</span>
                  {route.is5xx && <Badge className="bg-red-100 text-red-800 text-[10px]">5xx</Badge>}
                </div>
              </div>
              <div className="flex gap-1">
                {Object.entries(route.statusBreakdown || {}).map(([status, count]) => (
                  <Badge key={status} variant="outline" className="text-xs" data-testid={`badge-status-${status}`}>
                    {status}: {count as number}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FallbackUsageTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-fallback-usage"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/fallback-usage?hours=24");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner label="Loading fallback usage..." />;
  if (!data || data.totalFallbacks === 0) return <EmptyState icon={CheckCircle} label="No fallback events in the last 24 hours" />;

  return (
    <div className="space-y-4" data-testid="section-fallback-usage">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">By Route</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(data.byRoute || {}).map(([route, count]) => (
              <div key={route} className="flex justify-between py-1 text-sm border-b last:border-0">
                <code className="text-xs">{route}</code>
                <Badge variant="outline">{count as number}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">By Reason</CardTitle></CardHeader>
          <CardContent>
            {Object.entries(data.byReason || {}).map(([reason, count]) => (
              <div key={reason} className="flex justify-between py-1 text-sm border-b last:border-0">
                <span>{reason}</span>
                <Badge variant="outline">{count as number}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {data.recentEvents?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Fallback Events</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2" data-testid="list-fallback-events">
              {data.recentEvents.map((event: any, idx: number) => (
                <div key={idx} className="text-sm border-b pb-2 last:border-0">
                  <div className="flex justify-between">
                    <code className="text-xs">{event.route}</code>
                    <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.reason}: {event.primary} → {event.fallback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QuarantineTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-quarantine"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/quarantined-content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ action, payload }: { action: string; payload: any }) => {
      const res = await adminFetch(`/api/admin/reliability/actions/${action}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reliability-quarantine"] }),
  });

  if (isLoading) return <LoadingSpinner label="Loading quarantined content..." />;
  if (!data?.quarantined?.length) return <EmptyState icon={CheckCircle} label="No quarantined content" />;

  return (
    <div className="space-y-3" data-testid="list-quarantined-content">
      {data.quarantined.map((item: any, idx: number) => (
        <Card key={item.id || idx} data-testid={`quarantine-item-${idx}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm" data-testid={`text-quarantine-id-${idx}`}>
                    {item.contentId}
                  </span>
                  <Badge variant="outline" className="text-xs">{item.contentType}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Affected users: <strong>{item.affectedUserCount || 0}</strong>
                  {item.createdAt && <> | Quarantined: {new Date(item.createdAt).toLocaleString()}</>}
                </p>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                <Button size="sm" variant="outline" onClick={() => actionMutation.mutate({ action: "disable-content", payload: { contentId: item.contentId, contentType: item.contentType } })} data-testid={`button-disable-${idx}`}>
                  <ToggleLeft className="w-3 h-3 mr-1" /> Disable
                </Button>
                <Button size="sm" variant="outline" onClick={() => actionMutation.mutate({ action: "restore-version", payload: { contentId: item.contentId } })} data-testid={`button-restore-${idx}`}>
                  <Archive className="w-3 h-3 mr-1" /> Restore
                </Button>
                <Button size="sm" variant="outline" onClick={() => actionMutation.mutate({ action: "force-backup-mode", payload: { contentId: item.contentId } })} data-testid={`button-backup-${idx}`}>
                  <Shield className="w-3 h-3 mr-1" /> Backup
                </Button>
                <Button size="sm" variant="outline" onClick={() => actionMutation.mutate({ action: "regenerate-backups", payload: { contentId: item.contentId } })} data-testid={`button-regen-${idx}`}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Regen
                </Button>
                <Button size="sm" variant="outline" onClick={() => actionMutation.mutate({ action: "swap-substitute", payload: { contentId: item.contentId } })} data-testid={`button-swap-substitute-${idx}`}>
                  <ArrowRightLeft className="w-3 h-3 mr-1" /> Swap
                </Button>
                <Button size="sm" variant="outline" onClick={() => actionMutation.mutate({ action: "revalidate-content", payload: { contentId: item.contentId } })} data-testid={`button-revalidate-${idx}`}>
                  <CheckCircle className="w-3 h-3 mr-1" /> Revalidate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ValidationFailuresTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-validation-failures"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/validation-failures");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const revalidateMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const res = await adminFetch("/api/admin/reliability/actions/revalidate-content", {
        method: "POST",
        body: JSON.stringify({ contentId }),
      });
      if (!res.ok) throw new Error("Failed to revalidate");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reliability-validation-failures"] }),
  });

  if (isLoading) return <LoadingSpinner label="Loading validation failures..." />;
  if (!data?.failures?.length) return <EmptyState icon={CheckCircle} label="No recent validation failures" />;

  return (
    <div className="space-y-3" data-testid="list-validation-failures">
      {data.failures.map((failure: any, idx: number) => (
        <Card key={failure.id || idx} data-testid={`validation-failure-${idx}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm" data-testid={`text-failure-content-${idx}`}>{failure.contentId}</span>
                  <Badge variant="outline" className="text-xs">{failure.contentType}</Badge>
                  <Badge variant="outline" className="text-xs">v{failure.version}</Badge>
                </div>
                {failure.errors && (
                  <div className="text-xs text-red-600 space-y-0.5">
                    {(Array.isArray(failure.errors) ? failure.errors : []).slice(0, 3).map((err: any, i: number) => (
                      <p key={i}>• {typeof err === "string" ? err : err.message || JSON.stringify(err)}</p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {failure.triggeredBy && <>Triggered by: {failure.triggeredBy} | </>}
                  {failure.createdAt && new Date(failure.createdAt).toLocaleString()}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => revalidateMutation.mutate(failure.contentId)} disabled={revalidateMutation.isPending} data-testid={`button-revalidate-failure-${idx}`}>
                <CheckCircle className="w-3 h-3 mr-1" /> Revalidate
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProvisionalAccessTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-provisional-access"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/provisional-access?hours=24");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const extendMutation = useMutation({
    mutationFn: async ({ userId, days }: { userId: string; days: number }) => {
      const res = await adminFetch("/api/admin/reliability/actions/extend-access", {
        method: "POST",
        body: JSON.stringify({ userId, days }),
      });
      if (!res.ok) throw new Error("Failed to extend access");
      return res.json();
    },
  });

  if (isLoading) return <LoadingSpinner label="Loading provisional access events..." />;
  if (!data || data.totalEvents === 0) return <EmptyState icon={CheckCircle} label="No provisional access events in the last 24 hours" />;

  return (
    <div className="space-y-4" data-testid="section-provisional-access">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold" data-testid="text-provisional-total">{data.totalEvents}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold" data-testid="text-provisional-users">{data.uniqueUsersAffected}</p>
            <p className="text-xs text-muted-foreground">Unique Users</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2" data-testid="list-provisional-events">
        {data.events?.map((event: any, idx: number) => (
          <Card key={idx} data-testid={`provisional-event-${idx}`}>
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{event.userId}</span>
                <p className="text-xs text-muted-foreground">{event.reason} | {new Date(event.timestamp).toLocaleString()}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => extendMutation.mutate({ userId: event.userId, days: 7 })}
                disabled={extendMutation.isPending}
                data-testid={`button-extend-${idx}`}
              >
                <Timer className="w-3 h-3 mr-1" /> Extend 7d
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EntitlementMismatchesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-entitlement-mismatches"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/entitlement-mismatches");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const replayMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await adminFetch("/api/admin/reliability/actions/replay-entitlement-sync", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reliability-entitlement-mismatches"] }),
  });

  const batchReplayMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/reliability/actions/replay-entitlement-sync", {
        method: "POST",
        body: JSON.stringify({ batchAll: true }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reliability-entitlement-mismatches"] }),
  });

  if (isLoading) return <LoadingSpinner label="Checking entitlement mismatches..." />;
  if (!data?.mismatches?.length) return <EmptyState icon={CheckCircle} label="No entitlement mismatches detected" />;

  return (
    <div className="space-y-4" data-testid="section-entitlement-mismatches">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data.total} mismatches found</p>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => batchReplayMutation.mutate()}
          disabled={batchReplayMutation.isPending}
          data-testid="button-batch-replay"
        >
          {batchReplayMutation.isPending ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
          Batch Replay All
        </Button>
      </div>

      <div className="space-y-2" data-testid="list-entitlement-mismatches">
        {data.mismatches.map((m: any, idx: number) => (
          <Card key={m.id || idx} data-testid={`mismatch-item-${idx}`}>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" data-testid={`text-mismatch-user-${idx}`}>{m.username || m.email || m.id}</span>
                  <Badge className={m.mismatchType === "paid_tier_inactive_subscription" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"} data-testid={`badge-mismatch-type-${idx}`}>
                    {m.mismatchType === "paid_tier_inactive_subscription" ? "Paid → Inactive" : "Active → Free"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => replayMutation.mutate(m.id)}
                disabled={replayMutation.isPending}
                data-testid={`button-replay-${idx}`}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Replay
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IncidentsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reliability-incidents"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/incidents");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const resolveMutation = useMutation({
    mutationFn: async (incidentId: string) => {
      const res = await adminFetch("/api/admin/reliability/actions/mark-incident-resolved", {
        method: "POST",
        body: JSON.stringify({ incidentId }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reliability-incidents"] }),
  });

  if (isLoading) return <LoadingSpinner label="Loading incidents..." />;

  return (
    <div className="space-y-6" data-testid="section-incidents">
      {data?.active?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-red-700">Active Incidents ({data.totalActive})</h3>
          <div className="space-y-2" data-testid="list-active-incidents">
            {data.active.map((inc: any, idx: number) => (
              <IncidentCard key={inc.incidentId || idx} incident={inc} idx={idx} onResolve={() => resolveMutation.mutate(inc.incidentId)} resolving={resolveMutation.isPending} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-2">Recent Incidents ({data?.totalRecent || 0})</h3>
        {(!data?.recent?.length) ? (
          <EmptyState icon={CheckCircle} label="No recent incidents" />
        ) : (
          <div className="space-y-2" data-testid="list-recent-incidents">
            {data.recent.map((inc: any, idx: number) => (
              <IncidentCard key={inc.incidentId || idx} incident={inc} idx={idx} onResolve={() => resolveMutation.mutate(inc.incidentId)} resolving={resolveMutation.isPending} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IncidentCard({ incident, idx, onResolve, resolving }: { incident: any; idx: number; onResolve: () => void; resolving: boolean }) {
  const severityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-blue-100 text-blue-800",
  };
  const statusColors: Record<string, string> = {
    active: "bg-red-100 text-red-800",
    acknowledged: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <Card data-testid={`incident-card-${idx}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm" data-testid={`text-incident-title-${idx}`}>{incident.title}</span>
              <Badge className={severityColors[incident.severity] || ""} data-testid={`badge-incident-severity-${idx}`}>{incident.severity}</Badge>
              <Badge className={statusColors[incident.status] || ""} data-testid={`badge-incident-status-${idx}`}>{incident.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{incident.message}</p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>ID: {incident.incidentId}</span>
              <span>Occurrences: {incident.occurrenceCount}</span>
              <span>Affected users: {incident.affectedUserCount}</span>
              {incident.firstOccurrence && <span>First: {new Date(incident.firstOccurrence).toLocaleString()}</span>}
              {incident.lastOccurrence && <span>Last: {new Date(incident.lastOccurrence).toLocaleString()}</span>}
            </div>
          </div>
          {incident.status !== "resolved" && (
            <Button size="sm" variant="outline" onClick={onResolve} disabled={resolving} data-testid={`button-resolve-incident-${idx}`}>
              <CheckCircle className="w-3 h-3 mr-1" /> Resolve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BackupUsageTab() {
  const { data: backupData, isLoading: backupLoading } = useQuery({
    queryKey: ["reliability-backup-usage"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/backup-usage");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: substituteData, isLoading: substituteLoading } = useQuery({
    queryKey: ["reliability-substitute-routing"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/substitute-routing");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: missingData, isLoading: missingLoading } = useQuery({
    queryKey: ["reliability-missing-backups"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/missing-backups");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: topFailingData, isLoading: topFailingLoading } = useQuery({
    queryKey: ["reliability-top-failing-content"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/top-failing-content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const isLoading = backupLoading || substituteLoading || missingLoading || topFailingLoading;
  if (isLoading) return <LoadingSpinner label="Loading backup & content health data..." />;

  return (
    <div className="space-y-6" data-testid="section-backup-usage">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-backup-served-total">
          <CardContent className="pt-4 pb-4 text-center">
            <Database className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold" data-testid="text-backup-served-count">{backupData?.totalBackupServed || 0}</p>
            <p className="text-xs text-muted-foreground">Backup Mode Served (24h)</p>
          </CardContent>
        </Card>
        <Card data-testid="card-substitute-total">
          <CardContent className="pt-4 pb-4 text-center">
            <ArrowRightLeft className="w-6 h-6 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold" data-testid="text-substitute-count">{substituteData?.totalSubstitutes || 0}</p>
            <p className="text-xs text-muted-foreground">Substitute Routes (24h)</p>
          </CardContent>
        </Card>
        <Card data-testid="card-missing-backups-total">
          <CardContent className="pt-4 pb-4 text-center">
            <AlertOctagon className="w-6 h-6 mx-auto mb-1 text-red-500" />
            <p className="text-2xl font-bold" data-testid="text-missing-backups-count">{missingData?.total || 0}</p>
            <p className="text-xs text-muted-foreground">Missing Backup Artifacts</p>
          </CardContent>
        </Card>
      </div>

      {backupData && Object.keys(backupData.byFeatureType || {}).length > 0 && (
        <Card data-testid="card-backup-by-feature">
          <CardHeader><CardTitle className="text-sm">Backup Mode Usage by Feature Type</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1" data-testid="list-backup-by-feature">
              {Object.entries(backupData.byFeatureType).map(([key, count]) => (
                <div key={key} className="flex justify-between py-1 text-sm border-b last:border-0" data-testid={`backup-feature-${key}`}>
                  <code className="text-xs">{key}</code>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {substituteData?.events?.length > 0 && (
        <Card data-testid="card-substitute-events">
          <CardHeader><CardTitle className="text-sm">Substitute Content Routing Events</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2" data-testid="list-substitute-events">
              {substituteData.events.slice(0, 15).map((event: any, idx: number) => (
                <div key={idx} className="text-sm border-b pb-2 last:border-0" data-testid={`substitute-event-${idx}`}>
                  <div className="flex justify-between">
                    <span className="font-medium">{event.productType}: {event.productId}</span>
                    <span className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</span>
                  </div>
                  {event.substituteId && <p className="text-xs text-muted-foreground">Substitute: {event.substituteId}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {missingData?.missingBackups?.length > 0 && (
        <Card data-testid="card-missing-backups-list">
          <CardHeader><CardTitle className="text-sm">Missing Backup Artifacts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2" data-testid="list-missing-backups">
              {missingData.missingBackups.slice(0, 15).map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2 last:border-0" data-testid={`missing-backup-${idx}`}>
                  <div>
                    <span className="font-medium">{item.contentId}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{item.contentType}</Badge>
                    <p className="text-xs text-red-600">{item.errorMessage || item.status}</p>
                  </div>
                  {item.generatedAt && <span className="text-xs text-muted-foreground">{new Date(item.generatedAt).toLocaleString()}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topFailingData?.topFailing?.length > 0 && (
        <Card data-testid="card-top-failing-content">
          <CardHeader><CardTitle className="text-sm">Top Failing Content IDs (7 days)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2" data-testid="list-top-failing-content">
              {topFailingData.topFailing.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2 last:border-0" data-testid={`top-failing-${idx}`}>
                  <div>
                    <span className="font-medium" data-testid={`text-failing-id-${idx}`}>{item.contentId}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{item.contentType}</Badge>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800" data-testid={`badge-failure-count-${idx}`}>{item.failureCount} failures</Badge>
                    {item.lastOccurrence && (
                      <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-last-occurrence-${idx}`}>
                        Last: {new Date(item.lastOccurrence).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AlertsTab() {
  const queryClient = useQueryClient();
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ["reliability-alerts"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/alerts");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: thresholdsData, isLoading: thresholdsLoading } = useQuery({
    queryKey: ["reliability-alert-thresholds"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/alert-thresholds");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const [editingThresholds, setEditingThresholds] = useState(false);
  const [thresholdEdits, setThresholdEdits] = useState<Record<string, number>>({});

  const updateThresholdsMutation = useMutation({
    mutationFn: async (updates: Record<string, number>) => {
      const res = await adminFetch("/api/admin/reliability/alert-thresholds", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update thresholds");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reliability-alert-thresholds"] });
      setEditingThresholds(false);
      setThresholdEdits({});
    },
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const res = await adminFetch("/api/admin/reliability/actions/acknowledge-alert", {
        method: "POST",
        body: JSON.stringify({ alertId }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reliability-alerts"] }),
  });

  if (alertsLoading || thresholdsLoading) return <LoadingSpinner label="Loading alerts..." />;

  const severityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-blue-100 text-blue-800",
  };

  const thresholdLabels: Record<string, string> = {
    failureRatePercent: "Failure Rate (%)",
    fallbackRatePercent: "Fallback Rate (%)",
    quarantineCountPerHour: "Quarantine Events/hr",
    protectedRecoveryCountPerHour: "Protected Recovery/hr",
    backupFailureCountPerHour: "Backup Failures/hr",
    entitlementMismatchCountPerHour: "Entitlement Mismatches/hr",
    cooldownMinutes: "Alert Cooldown (min)",
    zeroValidItemsThreshold: "Zero Valid Items",
    lkgFailoverCountPerHour: "LKG Failovers/hr",
    paymentSyncErrorCountPerHour: "Payment Sync Errors/hr",
  };

  return (
    <div className="space-y-6" data-testid="section-alerts">
      <Card data-testid="card-alert-thresholds">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> Alert Thresholds</CardTitle>
            {!editingThresholds ? (
              <Button size="sm" variant="outline" onClick={() => { setEditingThresholds(true); setThresholdEdits(thresholdsData?.thresholds || {}); }} data-testid="button-edit-thresholds">
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditingThresholds(false); setThresholdEdits({}); }} data-testid="button-cancel-thresholds">Cancel</Button>
                <Button size="sm" onClick={() => updateThresholdsMutation.mutate(thresholdEdits)} disabled={updateThresholdsMutation.isPending} data-testid="button-save-thresholds">Save</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3" data-testid="grid-thresholds">
            {Object.entries(thresholdsData?.thresholds || {}).map(([key, value]) => (
              <div key={key} className="text-center p-2 border rounded" data-testid={`threshold-${key}`}>
                <p className="text-xs text-muted-foreground mb-1">{thresholdLabels[key] || key}</p>
                {editingThresholds ? (
                  <Input
                    type="number"
                    value={thresholdEdits[key] ?? value as number}
                    onChange={(e) => setThresholdEdits({ ...thresholdEdits, [key]: parseFloat(e.target.value) })}
                    className="h-8 text-center text-sm"
                    data-testid={`input-threshold-${key}`}
                  />
                ) : (
                  <p className="text-lg font-bold" data-testid={`text-threshold-${key}-value`}>{value as number}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-alert-history">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Bell className="w-4 h-4" /> Recent Alerts ({alertsData?.total || 0})</CardTitle></CardHeader>
        <CardContent>
          {!alertsData?.alerts?.length ? (
            <EmptyState icon={CheckCircle} label="No alerts triggered" />
          ) : (
            <div className="space-y-2" data-testid="list-alerts">
              {alertsData.alerts.map((alert: any, idx: number) => (
                <div key={alert.id || idx} className="flex items-start justify-between border-b pb-3 last:border-0" data-testid={`alert-item-${idx}`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge className={severityColors[alert.severity] || ""} data-testid={`badge-alert-severity-${idx}`}>{alert.severity}</Badge>
                      <Badge variant="outline" className="text-xs" data-testid={`badge-alert-type-${idx}`}>{alert.alertType}</Badge>
                      {alert.acknowledged && <Badge className="bg-green-100 text-green-800 text-xs">Ack</Badge>}
                    </div>
                    <p className="text-sm" data-testid={`text-alert-message-${idx}`}>{alert.message}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-alert-time-${idx}`}>{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  {!alert.acknowledged && (
                    <Button size="sm" variant="outline" onClick={() => acknowledgeMutation.mutate(alert.id)} disabled={acknowledgeMutation.isPending} data-testid={`button-acknowledge-${idx}`}>
                      Ack
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-12" data-testid="loading-spinner">
      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground" data-testid="empty-state">
      <Icon className="w-12 h-12 mx-auto mb-2 text-green-500" />
      <p className="font-medium">{label}</p>
    </div>
  );
}

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "failing-routes", label: "Failing Routes", icon: AlertTriangle },
  { id: "fallbacks", label: "Fallback Usage", icon: Shield },
  { id: "backup-usage", label: "Backup & Content", icon: Database },
  { id: "quarantine", label: "Quarantine", icon: FileX },
  { id: "validation", label: "Validation", icon: XCircle },
  { id: "provisional", label: "Provisional Access", icon: Lock },
  { id: "entitlements", label: "Entitlements", icon: Users },
  { id: "incidents", label: "Incidents", icon: Zap },
  { id: "alerts", label: "Alerts", icon: Bell },
];

export default function AdminReliabilityDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ["reliability-summary"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/reliability/summary");
      if (!res.ok) throw new Error("Failed to load reliability summary");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const handleDownloadReport = async () => {
    try {
      const res = await adminFetch("/api/admin/reliability/download-report");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reliability-report-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <a href="/admin" className="text-slate-400 hover:text-slate-600" data-testid="link-back-admin">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800" data-testid="text-page-title">Reliability Dashboard</h1>
              {summary && <HealthBadge status={summary.overallHealth} />}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">System reliability monitoring, alerting, and incident response</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            data-testid="button-download-report"
          >
            <Download className="w-4 h-4 mr-1" /> Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchSummary()}
            disabled={summaryLoading}
            data-testid="button-refresh-summary"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${summaryLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <SummaryCards data={summary} />

        <div className="flex gap-1 mt-6 mb-6 bg-white rounded-lg border p-1 overflow-x-auto" data-testid="nav-reliability-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg border p-6" data-testid="section-tab-content">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">System Overview</h2>
              {summaryLoading ? (
                <LoadingSpinner label="Loading overview..." />
              ) : summary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Health Status</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Overall</span><HealthBadge status={summary.overallHealth} /></div>
                        <div className="flex justify-between"><span>Failing Routes (24h)</span><span className="font-medium">{summary.failingRouteCount}</span></div>
                        <div className="flex justify-between"><span>Fallback Events (24h)</span><span className="font-medium">{summary.fallbackCount}</span></div>
                        <div className="flex justify-between"><span>Active Incidents</span><span className="font-medium">{summary.activeIncidentCount}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Content & Access</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Quarantined Content</span><span className="font-medium">{summary.quarantineCount}</span></div>
                        <div className="flex justify-between"><span>Validation Failures (24h)</span><span className="font-medium">{summary.validationFailureCount}</span></div>
                        <div className="flex justify-between"><span>Entitlement Mismatches</span><span className="font-medium">{summary.entitlementMismatchCount}</span></div>
                        <div className="flex justify-between"><span>Provisional Access (24h)</span><span className="font-medium">{summary.provisionalAccessCount}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground" data-testid="text-last-updated">
                Last updated: {summary?.generatedAt ? new Date(summary.generatedAt).toLocaleString() : "N/A"}
              </p>
            </div>
          )}
          {activeTab === "failing-routes" && <FailingRoutesTab />}
          {activeTab === "fallbacks" && <FallbackUsageTab />}
          {activeTab === "backup-usage" && <BackupUsageTab />}
          {activeTab === "quarantine" && <QuarantineTab />}
          {activeTab === "validation" && <ValidationFailuresTab />}
          {activeTab === "provisional" && <ProvisionalAccessTab />}
          {activeTab === "entitlements" && <EntitlementMismatchesTab />}
          {activeTab === "incidents" && <IncidentsTab />}
          {activeTab === "alerts" && <AlertsTab />}
        </div>
      </div>
    </div>
  );
}
