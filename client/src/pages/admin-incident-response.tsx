import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  Shield, AlertTriangle, Activity, Users, Clock, RefreshCw,
  CheckCircle2, XCircle, ArrowLeft, Search, Loader2,
  UserPlus, CreditCard, RotateCcw, Eye
} from "lucide-react";

function getAuthHeaders(): Record<string, string> {
  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      return { "x-username": username, "x-password": password };
    }
  } catch {}
  return {};
}

interface IncidentOverview {
  summary: {
    totalIncidents24h: number;
    severityCounts: { critical: number; warning: number; info: number };
    activeProvisionalGrants: number;
    activeCheckpoints: { session_type: string; count: number }[];
  };
  failingRoutes: { route: string; count: number }[];
  typeBreakdown: Record<string, number>;
  recentIncidents: any[];
  provisionalAccessUsers: any[];
}

interface EntitlementMismatch {
  userId: string;
  username: string;
  email: string;
  tier: string;
  subscriptionStatus: string;
  hasStripeCustomer: boolean;
  hasStripeSubscription: boolean;
}

export default function AdminIncidentResponsePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [overview, setOverview] = useState<IncidentOverview | null>(null);
  const [mismatches, setMismatches] = useState<EntitlementMismatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "incidents" | "provisional" | "mismatches" | "actions">("overview");
  const [actionUserId, setActionUserId] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionDuration, setActionDuration] = useState("24");
  const [actionDays, setActionDays] = useState("30");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewRes, mismatchRes] = await Promise.all([
        fetch("/api/admin/incident-response/overview", { headers: getAuthHeaders() }),
        fetch("/api/admin/incident-response/entitlement-mismatches", { headers: getAuthHeaders() }),
      ]);
      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (mismatchRes.ok) {
        const data = await mismatchRes.json();
        setMismatches(data.mismatches || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!user || user.tier !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold">Admin access required</h2>
        </div>
      </div>
    );
  }

  const handleGrantAccess = async () => {
    if (!actionUserId || !actionReason) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch("/api/admin/incident-response/grant-access", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId: actionUserId, reason: actionReason, durationHours: parseInt(actionDuration) }),
      });
      const data = await res.json();
      setActionResult(data.success ? "Access granted successfully" : data.error);
    } catch { setActionResult("Failed to grant access"); }
    setActionLoading(false);
  };

  const handleExtendSubscription = async () => {
    if (!actionUserId) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch("/api/admin/incident-response/extend-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId: actionUserId, days: parseInt(actionDays) }),
      });
      const data = await res.json();
      setActionResult(data.success ? "Subscription extended" : data.error);
    } catch { setActionResult("Failed to extend subscription"); }
    setActionLoading(false);
  };

  const handleReplayBillingSync = async (userId?: string) => {
    const targetId = userId || actionUserId;
    if (!targetId) return;
    setActionLoading(true);
    setActionResult(null);
    try {
      const res = await fetch("/api/admin/incident-response/replay-billing-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId: targetId }),
      });
      const data = await res.json();
      setActionResult(data.success ? `Billing synced: ${data.syncedStatus || data.message}` : data.error);
    } catch { setActionResult("Failed to sync billing"); }
    setActionLoading(false);
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await fetch(`/api/admin/incident-response/resolve/${incidentId}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      fetchData();
    } catch {}
  };

  const handleRevokeAccess = async (grantId: string) => {
    try {
      await fetch(`/api/admin/incident-response/revoke-access/${grantId}`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      fetchData();
    } catch {}
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "warning": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-1" />Back
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Incident Response Dashboard</h1>
            </div>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2" data-testid="button-refresh-data">
            <RefreshCw className="w-4 h-4" />Refresh
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "incidents", "provisional", "mismatches", "actions"] as const).map(t => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t)}
              data-testid={`tab-${t}`}
            >
              {t === "overview" && <Activity className="w-4 h-4 mr-1" />}
              {t === "incidents" && <AlertTriangle className="w-4 h-4 mr-1" />}
              {t === "provisional" && <Users className="w-4 h-4 mr-1" />}
              {t === "mismatches" && <CreditCard className="w-4 h-4 mr-1" />}
              {t === "actions" && <UserPlus className="w-4 h-4 mr-1" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {tab === "overview" && overview && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-slate-700" data-testid="text-total-incidents">{overview.summary.totalIncidents24h}</div>
                      <div className="text-xs text-muted-foreground mt-1">Incidents (24h)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600" data-testid="text-critical-count">{overview.summary.severityCounts.critical}</div>
                      <div className="text-xs text-muted-foreground mt-1">Critical</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-amber-600" data-testid="text-warning-count">{overview.summary.severityCounts.warning}</div>
                      <div className="text-xs text-muted-foreground mt-1">Warnings</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600" data-testid="text-provisional-count">{overview.summary.activeProvisionalGrants}</div>
                      <div className="text-xs text-muted-foreground mt-1">Provisional Access</div>
                    </CardContent>
                  </Card>
                </div>

                {overview.failingRoutes.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Failing Routes</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {overview.failingRoutes.map((r, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                            <code className="text-sm font-mono text-slate-600">{r.route}</code>
                            <Badge variant="outline" className="bg-red-50 text-red-700">{r.count} incidents</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {Object.keys(overview.typeBreakdown).length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Incident Types</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(overview.typeBreakdown).map(([type, count]) => (
                          <div key={type} className="p-3 bg-slate-50 rounded-lg text-center">
                            <div className="text-lg font-bold">{count}</div>
                            <div className="text-xs text-muted-foreground">{type}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {overview.summary.activeCheckpoints.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Active Session Checkpoints</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {overview.summary.activeCheckpoints.map((cp: any, i: number) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-lg text-center">
                            <div className="text-lg font-bold">{cp.count}</div>
                            <div className="text-xs text-muted-foreground">{cp.session_type}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {tab === "incidents" && overview && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Recent Incidents</CardTitle></CardHeader>
                <CardContent>
                  {overview.recentIncidents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No incidents in the last 24 hours</p>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {overview.recentIncidents.map((inc: any) => (
                        <div key={inc.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={severityColor(inc.severity)}>{inc.severity}</Badge>
                              <Badge variant="outline">{inc.type}</Badge>
                              {inc.incidentId && (
                                <code className="text-xs font-mono text-slate-500">{inc.incidentId}</code>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {inc.resolvedAt ? (
                                <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResolveIncident(inc.incidentId)}
                                  data-testid={`button-resolve-${inc.incidentId}`}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-700">{inc.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {inc.route && <span>Route: {inc.route}</span>}
                            {inc.userId && <span>User: {inc.userId.substring(0, 8)}...</span>}
                            <span><Clock className="w-3 h-3 inline mr-1" />{new Date(inc.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {tab === "provisional" && overview && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Provisional Access Grants</CardTitle></CardHeader>
                <CardContent>
                  {overview.provisionalAccessUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No active provisional access grants</p>
                  ) : (
                    <div className="space-y-3">
                      {overview.provisionalAccessUsers.map((g: any) => (
                        <div key={g.id} className="border rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{g.userId.substring(0, 12)}...</div>
                            <div className="text-xs text-muted-foreground">{g.reason}</div>
                            <div className="text-xs text-muted-foreground">
                              Granted by: {g.grantedBy} | Expires: {new Date(g.expiresAt).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRevokeAccess(g.id)}
                            data-testid={`button-revoke-${g.id}`}
                          >
                            <XCircle className="w-3 h-3 mr-1" />Revoke
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {tab === "mismatches" && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Entitlement Mismatches</CardTitle></CardHeader>
                <CardContent>
                  {mismatches.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No entitlement mismatches found</p>
                  ) : (
                    <div className="space-y-3">
                      {mismatches.map((m) => (
                        <div key={m.userId} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{m.username}</div>
                              <div className="text-xs text-muted-foreground">{m.email || "No email"}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">Tier: {m.tier}</Badge>
                                <Badge variant="outline">Status: {m.subscriptionStatus || "none"}</Badge>
                                {m.hasStripeSubscription && <Badge className="bg-purple-100 text-purple-700">Stripe Sub</Badge>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleReplayBillingSync(m.userId)} data-testid={`button-sync-${m.userId}`}>
                                <RotateCcw className="w-3 h-3 mr-1" />Sync
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { setActionUserId(m.userId); setTab("actions"); }} data-testid={`button-manage-${m.userId}`}>
                                <Eye className="w-3 h-3 mr-1" />Manage
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {tab === "actions" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Grant Temporary Access</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">User ID</label>
                        <Input value={actionUserId} onChange={e => setActionUserId(e.target.value)} placeholder="User ID" data-testid="input-action-user-id" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Reason</label>
                        <Input value={actionReason} onChange={e => setActionReason(e.target.value)} placeholder="Billing sync delay" data-testid="input-action-reason" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Duration (hours)</label>
                        <Input type="number" value={actionDuration} onChange={e => setActionDuration(e.target.value)} data-testid="input-action-duration" />
                      </div>
                    </div>
                    <Button onClick={handleGrantAccess} disabled={actionLoading || !actionUserId || !actionReason} className="gap-2" data-testid="button-grant-access">
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                      Grant Provisional Access
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-lg">Extend Subscription</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">User ID</label>
                        <Input value={actionUserId} onChange={e => setActionUserId(e.target.value)} placeholder="User ID" data-testid="input-extend-user-id" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Days to Extend</label>
                        <Input type="number" value={actionDays} onChange={e => setActionDays(e.target.value)} data-testid="input-extend-days" />
                      </div>
                    </div>
                    <Button onClick={handleExtendSubscription} disabled={actionLoading || !actionUserId} variant="outline" className="gap-2" data-testid="button-extend-subscription">
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Extend Subscription
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-lg">Replay Billing Sync</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">User ID</label>
                      <Input value={actionUserId} onChange={e => setActionUserId(e.target.value)} placeholder="User ID" data-testid="input-sync-user-id" />
                    </div>
                    <Button onClick={() => handleReplayBillingSync()} disabled={actionLoading || !actionUserId} variant="outline" className="gap-2" data-testid="button-replay-sync">
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Replay Billing Sync
                    </Button>
                  </CardContent>
                </Card>

                {actionResult && (
                  <div className={`p-4 rounded-lg text-sm ${actionResult.includes("success") || actionResult.includes("granted") || actionResult.includes("extended") || actionResult.includes("synced") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`} data-testid="text-action-result">
                    {actionResult}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
