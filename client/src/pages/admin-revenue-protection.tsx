import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import {
  Shield, DollarSign, AlertTriangle, RefreshCw, Users,
  CheckCircle, XCircle, Mail, Clock, TrendingDown,
  CreditCard, Lock, Send, UserPlus
} from "lucide-react";

type TabId = "overview" | "failed-checkouts" | "access-issues" | "churn-risk" | "actions";

export default function AdminRevenueProtection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [days, setDays] = useState(30);
  const [actionModal, setActionModal] = useState<{ type: string; userId: string; username: string } | null>(null);
  const [actionForm, setActionForm] = useState<any>({});
  const isAdmin = user?.tier === "admin";

  const { data: dashboard, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/revenue-protection/dashboard", days],
    queryFn: () => adminFetch(`/api/admin/revenue-protection/dashboard?days=${days}`).then(r => r.json()),
    enabled: isAdmin,
  });

  const extendMutation = useMutation({
    mutationFn: (data: any) => adminFetch("/api/admin/revenue-protection/extend-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: () => { refetch(); setActionModal(null); setActionForm({}); },
  });

  const grantMutation = useMutation({
    mutationFn: (data: any) => adminFetch("/api/admin/revenue-protection/grant-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: () => { refetch(); setActionModal(null); setActionForm({}); },
  });

  const recoveryMutation = useMutation({
    mutationFn: (data: any) => adminFetch("/api/admin/revenue-protection/send-recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: () => { refetch(); setActionModal(null); setActionForm({}); },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ eventId, actionTaken }: { eventId: string; actionTaken: string }) =>
      adminFetch(`/api/admin/revenue-protection/resolve/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionTaken }),
      }).then(r => r.json()),
    onSuccess: () => refetch(),
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-access-denied">Access Denied</h1>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview" as TabId, label: "Overview", icon: Shield },
    { key: "failed-checkouts" as TabId, label: "Failed Checkouts", icon: CreditCard },
    { key: "access-issues" as TabId, label: "Access Issues", icon: Lock },
    { key: "churn-risk" as TabId, label: "Churn Risk", icon: TrendingDown },
    { key: "actions" as TabId, label: "Actions Log", icon: CheckCircle },
  ];

  const summary = dashboard?.summary || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">Revenue Protection</h1>
            <p className="text-gray-600 mt-1">Monitor payment failures, access issues, and churn risk signals</p>
          </div>
          <div className="flex items-center gap-2">
            <select data-testid="select-days" className="border rounded px-3 py-1.5 text-sm" value={days} onChange={e => setDays(Number(e.target.value))}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
            <Button data-testid="btn-refresh" onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>}

        {!isLoading && activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><AlertTriangle className="w-4 h-4" /> Total Events</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-total-events">{summary.total_events || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><XCircle className="w-4 h-4 text-red-500" /> Unresolved</div>
                  <div className="text-2xl font-bold mt-1 text-red-600" data-testid="stat-unresolved">{summary.unresolved_events || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><CreditCard className="w-4 h-4" /> Failed Checkouts</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-failed-checkouts">{summary.failed_checkouts || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm"><Users className="w-4 h-4" /> Affected Users</div>
                  <div className="text-2xl font-bold mt-1" data-testid="stat-affected-users">{summary.affected_users || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Events by Type</CardTitle></CardHeader>
              <CardContent>
                {(!dashboard?.eventsByType || dashboard.eventsByType.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No revenue protection events recorded</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dashboard.eventsByType.map((evt: any, i: number) => (
                      <div key={i} className="p-3 border rounded-lg" data-testid={`event-type-${i}`}>
                        <div className="text-sm font-medium capitalize">{(evt.event_type || "").replace(/_/g, " ")}</div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xl font-bold">{evt.count}</span>
                          {evt.unresolved > 0 && <Badge variant="destructive">{evt.unresolved} open</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Recent Events</CardTitle></CardHeader>
              <CardContent>
                {(!dashboard?.recentEvents || dashboard.recentEvents.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No recent events</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {dashboard.recentEvents.slice(0, 20).map((evt: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`recent-event-${i}`}>
                        <div className="flex items-center gap-3">
                          <Badge className={
                            evt.severity === "critical" ? "bg-red-100 text-red-800" :
                            evt.severity === "high" ? "bg-orange-100 text-orange-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>{evt.severity}</Badge>
                          <div>
                            <div className="text-sm font-medium capitalize">{(evt.event_type || "").replace(/_/g, " ")}</div>
                            <div className="text-xs text-gray-500">{evt.username || evt.user_id?.slice(0, 12) || "Unknown"} • {new Date(evt.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {evt.resolved ? (
                            <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`btn-resolve-${i}`}
                              onClick={() => resolveMutation.mutate({ eventId: evt.id, actionTaken: "Manually reviewed and resolved" })}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && activeTab === "failed-checkouts" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Failed Checkouts</CardTitle></CardHeader>
            <CardContent>
              {(!dashboard?.failedCheckouts || dashboard.failedCheckouts.length === 0) ? (
                <div className="text-center py-8 text-gray-500">No failed checkout events</div>
              ) : (
                <div className="space-y-3">
                  {dashboard.failedCheckouts.map((fc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`failed-checkout-${i}`}>
                      <div>
                        <div className="font-medium">{fc.username || fc.user_id?.slice(0, 12) || "Unknown user"}</div>
                        <div className="text-sm text-gray-500">{new Date(fc.created_at).toLocaleString()}</div>
                        {fc.details && <div className="text-xs text-gray-400 mt-1">{JSON.stringify(fc.details).slice(0, 100)}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`btn-recover-${i}`} onClick={() => setActionModal({ type: "recovery", userId: fc.user_id, username: fc.username })}>
                          <Mail className="w-3 h-3 mr-1" /> Recover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!isLoading && activeTab === "access-issues" && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Paid But No Access</CardTitle></CardHeader>
              <CardContent>
                {(!dashboard?.paidNoAccess || dashboard.paidNoAccess.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">No access issues detected</div>
                ) : (
                  <div className="space-y-3">
                    {dashboard.paidNoAccess.map((u: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50" data-testid={`paid-no-access-${i}`}>
                        <div>
                          <div className="font-medium">{u.username}</div>
                          <div className="text-sm text-gray-600">
                            Tier: <Badge variant="outline">{u.tier || "free"}</Badge>
                            <span className="ml-2">Sub Status: {u.subscription_status}</span>
                          </div>
                          {u.stripe_subscription_id && <div className="text-xs text-gray-400 mt-1 font-mono">Stripe: {u.stripe_subscription_id.slice(0, 20)}...</div>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" data-testid={`btn-grant-${i}`} onClick={() => setActionModal({ type: "grant", userId: u.user_id, username: u.username })}>
                            <UserPlus className="w-3 h-3 mr-1" /> Grant Access
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Blocked Premium Access Attempts</CardTitle></CardHeader>
              <CardContent>
                {(!dashboard?.blockedPremiumAttempts || dashboard.blockedPremiumAttempts.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No blocked premium access attempts</div>
                ) : (
                  <div className="space-y-2">
                    {dashboard.blockedPremiumAttempts.map((b: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`blocked-${i}`}>
                        <div>
                          <span className="font-medium">{b.username || b.user_id?.slice(0, 12) || "Unknown"}</span>
                          <span className="text-xs text-gray-500 ml-2">{new Date(b.created_at).toLocaleString()}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setActionModal({ type: "grant", userId: b.user_id, username: b.username })}>
                          Grant Access
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Fallback-Heavy Users</CardTitle></CardHeader>
              <CardContent>
                {(!dashboard?.fallbackHeavyUsers || dashboard.fallbackHeavyUsers.length === 0) ? (
                  <div className="text-center py-6 text-gray-500">No fallback-heavy users detected</div>
                ) : (
                  <div className="space-y-2">
                    {dashboard.fallbackHeavyUsers.map((u: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`fallback-heavy-${i}`}>
                        <div className="font-mono text-sm">{u.user_id?.slice(0, 16)}...</div>
                        <div className="flex gap-3 text-sm">
                          <Badge variant="destructive">{u.fallback_count} fallbacks</Badge>
                          <span className="text-gray-500">{u.unique_fallback_types} types</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && activeTab === "churn-risk" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingDown className="w-5 h-5" /> Churn Risk Signals</CardTitle></CardHeader>
            <CardContent>
              {(!dashboard?.churnRiskSignals || dashboard.churnRiskSignals.length === 0) ? (
                <div className="text-center py-8 text-gray-500">No churn risk signals detected</div>
              ) : (
                <div className="space-y-3">
                  {dashboard.churnRiskSignals.map((u: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`churn-risk-${i}`}>
                      <div>
                        <div className="font-medium">{u.username || u.user_id?.slice(0, 12)}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{u.tier}</Badge>
                          <Badge className={
                            u.risk_signal === "expired" ? "bg-red-100 text-red-800" :
                            u.risk_signal === "expiring_soon" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }>{(u.risk_signal || "").replace(/_/g, " ")}</Badge>
                          {u.recent_errors > 0 && <Badge variant="destructive">{u.recent_errors} errors</Badge>}
                        </div>
                        {u.plan_expires_at && <div className="text-xs text-gray-500 mt-1">Expires: {new Date(u.plan_expires_at).toLocaleDateString()}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`btn-extend-${i}`} onClick={() => setActionModal({ type: "extend", userId: u.user_id, username: u.username })}>
                          <Clock className="w-3 h-3 mr-1" /> Extend
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`btn-message-${i}`} onClick={() => setActionModal({ type: "recovery", userId: u.user_id, username: u.username })}>
                          <Send className="w-3 h-3 mr-1" /> Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!isLoading && activeTab === "actions" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Actions Log</CardTitle></CardHeader>
            <CardContent>
              {(!dashboard?.recentEvents || dashboard.recentEvents.length === 0) ? (
                <div className="text-center py-8 text-gray-500">No actions recorded</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Date</th>
                        <th className="text-left py-2 px-3">Type</th>
                        <th className="text-left py-2 px-3">User</th>
                        <th className="text-center py-2 px-3">Severity</th>
                        <th className="text-center py-2 px-3">Status</th>
                        <th className="text-left py-2 px-3">Action Taken</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentEvents.map((evt: any, i: number) => (
                        <tr key={i} className="border-b hover:bg-gray-50" data-testid={`action-log-${i}`}>
                          <td className="py-2 px-3 text-xs">{new Date(evt.created_at).toLocaleString()}</td>
                          <td className="py-2 px-3 capitalize">{(evt.event_type || "").replace(/_/g, " ")}</td>
                          <td className="py-2 px-3">{evt.username || evt.user_id?.slice(0, 8) || "—"}</td>
                          <td className="text-center py-2 px-3">
                            <Badge className={
                              evt.severity === "critical" ? "bg-red-100 text-red-800" :
                              evt.severity === "high" ? "bg-orange-100 text-orange-800" :
                              "bg-gray-100 text-gray-800"
                            }>{evt.severity}</Badge>
                          </td>
                          <td className="text-center py-2 px-3">
                            {evt.resolved ? <Badge className="bg-green-100 text-green-800">Resolved</Badge> : <Badge variant="destructive">Open</Badge>}
                          </td>
                          <td className="py-2 px-3 text-xs">{evt.action_taken || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {actionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="action-modal">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">
                {actionModal.type === "extend" && "Extend Subscription"}
                {actionModal.type === "grant" && "Grant Access"}
                {actionModal.type === "recovery" && "Send Recovery Message"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">User: <strong>{actionModal.username || actionModal.userId}</strong></p>

              {actionModal.type === "extend" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Extension (days)</label>
                    <Input data-testid="input-extension-days" type="number" value={actionForm.extensionDays || ""} onChange={e => setActionForm({ ...actionForm, extensionDays: Number(e.target.value) })} placeholder="e.g., 30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Input data-testid="input-reason" value={actionForm.reason || ""} onChange={e => setActionForm({ ...actionForm, reason: e.target.value })} placeholder="Reason for extension" />
                  </div>
                  <Button data-testid="btn-submit-extend" className="w-full" onClick={() => extendMutation.mutate({ userId: actionModal.userId, extensionDays: actionForm.extensionDays, reason: actionForm.reason })} disabled={!actionForm.extensionDays}>
                    Extend Subscription
                  </Button>
                </div>
              )}

              {actionModal.type === "grant" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Tier</label>
                    <select data-testid="select-tier" className="w-full border rounded px-3 py-2" value={actionForm.tier || ""} onChange={e => setActionForm({ ...actionForm, tier: e.target.value })}>
                      <option value="">Select tier...</option>
                      <option value="new_grad_toolkit">New Grad Toolkit</option>
                      <option value="certification_prep">Certification Prep</option>
                      <option value="full_access">Full Access</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (days, leave empty for indefinite)</label>
                    <Input data-testid="input-duration-days" type="number" value={actionForm.durationDays || ""} onChange={e => setActionForm({ ...actionForm, durationDays: Number(e.target.value) || undefined })} placeholder="e.g., 30" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Input data-testid="input-grant-reason" value={actionForm.reason || ""} onChange={e => setActionForm({ ...actionForm, reason: e.target.value })} placeholder="Reason for granting access" />
                  </div>
                  <Button data-testid="btn-submit-grant" className="w-full" onClick={() => grantMutation.mutate({ userId: actionModal.userId, tier: actionForm.tier, durationDays: actionForm.durationDays, reason: actionForm.reason })} disabled={!actionForm.tier}>
                    Grant Access
                  </Button>
                </div>
              )}

              {actionModal.type === "recovery" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Message Type</label>
                    <select data-testid="select-message-type" className="w-full border rounded px-3 py-2" value={actionForm.messageType || ""} onChange={e => setActionForm({ ...actionForm, messageType: e.target.value })}>
                      <option value="">Select type...</option>
                      <option value="payment_failed">Payment Failed</option>
                      <option value="access_issue">Access Issue</option>
                      <option value="churn_prevention">Churn Prevention</option>
                      <option value="custom">Custom Message</option>
                    </select>
                  </div>
                  {actionForm.messageType === "custom" && (
                    <div>
                      <label className="text-sm font-medium">Custom Message</label>
                      <textarea data-testid="input-custom-message" className="w-full border rounded px-3 py-2 h-24 resize-none" value={actionForm.customMessage || ""} onChange={e => setActionForm({ ...actionForm, customMessage: e.target.value })} placeholder="Write your message..." />
                    </div>
                  )}
                  <Button data-testid="btn-submit-recovery" className="w-full" onClick={() => recoveryMutation.mutate({ userId: actionModal.userId, messageType: actionForm.messageType, customMessage: actionForm.customMessage })} disabled={!actionForm.messageType}>
                    <Send className="w-4 h-4 mr-1" /> Send Recovery Message
                  </Button>
                </div>
              )}

              <Button data-testid="btn-cancel-modal" variant="outline" className="w-full mt-2" onClick={() => { setActionModal(null); setActionForm({}); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
