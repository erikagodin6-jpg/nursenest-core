import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useLocation, useParams } from "wouter";
import {
  Shield, AlertTriangle, Activity, Clock, RefreshCw, ArrowLeft, CheckCircle2,
  XCircle, AlertCircle, Loader2, Copy, RotateCcw, Zap, GitBranch, Plus, MessageSquare
} from "lucide-react";

interface CorrelatedChange {
  id: string;
  changeType: string;
  source: string;
  entityType: string | null;
  entityId: string | null;
  description: string;
  metadata: Record<string, any>;
  changedBy: string | null;
  createdAt: string;
  recencyScore: number;
  relevanceScore: number;
  confidenceScore: number;
}

interface IncidentEvent {
  id: string;
  eventType: string;
  eventData: Record<string, any>;
  actor: string | null;
  timestamp: string;
}

interface IncidentDetail {
  id: string;
  severity: string;
  status: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  impactedFeatures: string[];
  impactedContentIds: string[];
  affectedUsersEstimate: number;
  fallbackModes: string[];
  rootCauseSummary: string | null;
  actionsTaken: any[];
  createdBy: string | null;
  productionIncidentId: string | null;
  createdAt: string;
  updatedAt: string;
}

const SEVERITY_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  critical: { label: "Critical", color: "bg-red-100 text-red-800", icon: XCircle, bg: "bg-red-50 border-red-200" },
  high: { label: "High", color: "bg-orange-100 text-orange-800", icon: AlertTriangle, bg: "bg-orange-50 border-orange-200" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, bg: "bg-yellow-50 border-yellow-200" },
  low: { label: "Low", color: "bg-blue-100 text-blue-800", icon: Activity, bg: "bg-blue-50 border-blue-200" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-red-100 text-red-800" },
  investigating: { label: "Investigating", color: "bg-yellow-100 text-yellow-800" },
  mitigated: { label: "Mitigated", color: "bg-blue-100 text-blue-800" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800" },
};

const CHANGE_TYPE_ICONS: Record<string, { icon: any; color: string }> = {
  deploy: { icon: Zap, color: "text-purple-600" },
  emergency_mode: { icon: AlertTriangle, color: "text-red-600" },
  kill_switch_change: { icon: XCircle, color: "text-red-500" },
  feature_flag_toggle: { icon: GitBranch, color: "text-blue-600" },
  circuit_breaker_trip: { icon: AlertCircle, color: "text-orange-600" },
  feature_auto_disabled: { icon: XCircle, color: "text-orange-500" },
  config_change: { icon: Activity, color: "text-gray-600" },
  content_publish: { icon: CheckCircle2, color: "text-green-600" },
  resilience_event: { icon: Shield, color: "text-indigo-600" },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  created: "Incident Created",
  updated: "Incident Updated",
  acknowledged: "Incident Acknowledged",
  resolved: "Incident Resolved",
  reopened: "Incident Reopened",
  action_taken: "Action Taken",
  status_changed: "Status Changed",
  severity_changed: "Severity Changed",
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

function getConfidenceColor(score: number): string {
  if (score >= 70) return "text-red-600 bg-red-50";
  if (score >= 50) return "text-orange-600 bg-orange-50";
  if (score >= 30) return "text-yellow-600 bg-yellow-50";
  return "text-gray-600 bg-gray-50";
}

export default function AdminOpsIncidentDetailPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const incidentId = params.id;

  const [resolveNotes, setResolveNotes] = useState("");
  const [actionText, setActionText] = useState("");
  const [actionDetails, setActionDetails] = useState("");
  const [reopenReason, setReopenReason] = useState("");
  const [showReopen, setShowReopen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/ops/incidents", incidentId],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/ops/incidents/${incidentId}`);
      if (!res.ok) throw new Error("Failed to fetch incident");
      return res.json() as Promise<{
        incident: IncidentDetail;
        events: IncidentEvent[];
        correlatedChanges: CorrelatedChange[];
      }>;
    },
    enabled: !!incidentId,
    refetchInterval: 30000,
  });

  const resolveMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch(`/api/admin/ops/incidents/${incidentId}/resolve`, {
        method: "POST",
        body: { rootCauseSummary: resolveNotes, notes: resolveNotes },
      });
      if (!res.ok) throw new Error("Failed to resolve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ops/incidents"] });
      setResolveNotes("");
    },
  });

  const reopenMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch(`/api/admin/ops/incidents/${incidentId}/reopen`, {
        method: "POST",
        body: { reason: reopenReason },
      });
      if (!res.ok) throw new Error("Failed to reopen");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ops/incidents"] });
      setShowReopen(false);
      setReopenReason("");
    },
  });

  const addActionMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch(`/api/admin/ops/incidents/${incidentId}/action`, {
        method: "POST",
        body: { action: actionText, details: actionDetails || undefined },
      });
      if (!res.ok) throw new Error("Failed to add action");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ops/incidents"] });
      setActionText("");
      setActionDetails("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const res = await adminFetch(`/api/admin/ops/incidents/${incidentId}`, {
        method: "PUT",
        body: updates,
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ops/incidents"] });
    },
  });

  const handleCopySummary = async () => {
    try {
      const res = await adminFetch(`/api/admin/ops/incidents/${incidentId}/summary`);
      if (res.ok) {
        const { summary } = await res.json();
        await navigator.clipboard.writeText(summary);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch {}
  };

  if (!user || user.tier !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold" data-testid="text-access-denied">Admin access required</h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center" data-testid="loading-incident-detail">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground" data-testid="text-incident-not-found">Incident not found</p>
          <Button onClick={() => navigate("/admin/ops/incidents")} className="mt-4">Back to Incidents</Button>
        </div>
      </div>
    );
  }

  const { incident, events, correlatedChanges } = data;
  const sevConfig = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.medium;
  const statusConfig = STATUS_CONFIG[incident.status] || STATUS_CONFIG.active;
  const SevIcon = sevConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/ops/incidents")} data-testid="button-back-list">
              <ArrowLeft className="w-4 h-4 mr-1" /> Incidents
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2" data-testid="text-incident-title">
                <SevIcon className={`w-5 h-5 ${
                  incident.severity === "critical" ? "text-red-600" :
                  incident.severity === "high" ? "text-orange-600" :
                  incident.severity === "medium" ? "text-yellow-600" : "text-blue-600"
                }`} />
                {incident.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${sevConfig.color}`} data-testid="badge-incident-severity">{sevConfig.label}</Badge>
                <Badge className={`text-xs ${statusConfig.color}`} data-testid="badge-incident-status">{statusConfig.label}</Badge>
                <span className="text-xs text-muted-foreground font-mono" data-testid="text-incident-id">{incident.id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopySummary} data-testid="button-copy-summary">
              {copySuccess ? <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" /> : <Copy className="w-4 h-4 mr-1" />}
              {copySuccess ? "Copied!" : "Copy Summary"}
            </Button>
            <Button onClick={() => refetch()} variant="outline" size="sm" data-testid="button-refresh-detail">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card data-testid="card-incident-overview">
              <CardHeader><CardTitle className="text-lg">Overview</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Started</div>
                    <div className="text-sm font-medium">{new Date(incident.startTime).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ended</div>
                    <div className="text-sm font-medium">{incident.endTime ? new Date(incident.endTime).toLocaleString() : "Ongoing"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="text-sm font-medium">{incident.duration ? formatDuration(incident.duration) : "Ongoing"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Affected Users</div>
                    <div className="text-sm font-medium" data-testid="text-affected-users">~{incident.affectedUsersEstimate}</div>
                  </div>
                </div>

                {incident.description && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Description</div>
                    <div className="text-sm bg-muted/50 rounded p-3" data-testid="text-incident-description">{incident.description}</div>
                  </div>
                )}

                {incident.impactedFeatures?.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Impacted Features</div>
                    <div className="flex flex-wrap gap-1" data-testid="list-impacted-features">
                      {incident.impactedFeatures.map((f: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {incident.fallbackModes?.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Fallback Modes</div>
                    <div className="flex flex-wrap gap-1">
                      {incident.fallbackModes.map((f: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-amber-50">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {incident.rootCauseSummary && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Root Cause</div>
                    <div className="text-sm bg-green-50 border border-green-200 rounded p-3" data-testid="text-root-cause">
                      {incident.rootCauseSummary}
                    </div>
                  </div>
                )}

                {incident.createdBy && (
                  <div className="text-xs text-muted-foreground">Created by {incident.createdBy}</div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-correlated-changes">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Correlated Changes ({correlatedChanges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {correlatedChanges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No correlated changes found in the lookback window</p>
                ) : (
                  <div className="space-y-3">
                    {correlatedChanges.map((change, idx) => {
                      const changeConfig = CHANGE_TYPE_ICONS[change.changeType] || { icon: Activity, color: "text-gray-500" };
                      const ChangeIcon = changeConfig.icon;
                      return (
                        <div key={change.id} className="flex items-start gap-3 p-3 rounded-lg border" data-testid={`card-change-${idx}`}>
                          <div className="flex flex-col items-center gap-1">
                            <ChangeIcon className={`w-5 h-5 ${changeConfig.color}`} />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getConfidenceColor(change.confidenceScore)}`}
                              data-testid={`text-confidence-${idx}`}>
                              {change.confidenceScore}%
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{change.description}</span>
                              <Badge variant="outline" className="text-xs">{change.changeType}</Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{new Date(change.createdAt).toLocaleString()}</span>
                              {change.changedBy && <span>by {change.changedBy}</span>}
                              <span>Recency: {change.recencyScore}%</span>
                              <span>Relevance: {change.relevanceScore}%</span>
                            </div>
                            {change.entityId && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {change.entityType}: {change.entityId}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-timeline">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline ({events.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No timeline events yet</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="flex items-start gap-4 relative" data-testid={`event-${event.id}`}>
                          <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 shrink-0">
                            {event.eventType === "created" ? <Plus className="w-3 h-3 text-blue-600" /> :
                             event.eventType === "resolved" ? <CheckCircle2 className="w-3 h-3 text-green-600" /> :
                             event.eventType === "reopened" ? <RotateCcw className="w-3 h-3 text-orange-600" /> :
                             event.eventType === "action_taken" ? <Zap className="w-3 h-3 text-purple-600" /> :
                             <Activity className="w-3 h-3 text-gray-600" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{EVENT_TYPE_LABELS[event.eventType] || event.eventType}</span>
                              <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                            {event.actor && <div className="text-xs text-muted-foreground">by {event.actor}</div>}
                            {event.eventData && Object.keys(event.eventData).length > 0 && (
                              <div className="mt-1 text-xs bg-muted/50 rounded p-2">
                                {event.eventData.action && <span className="font-medium">{event.eventData.action}</span>}
                                {event.eventData.details && <span className="ml-1">- {event.eventData.details}</span>}
                                {event.eventData.notes && <span className="ml-1">- {event.eventData.notes}</span>}
                                {event.eventData.reason && <span className="ml-1">Reason: {event.eventData.reason}</span>}
                                {event.eventData.rootCauseSummary && <span className="ml-1">Root cause: {event.eventData.rootCauseSummary}</span>}
                                {event.eventData.changedFields?.length > 0 && (
                                  <span className="ml-1">Changed: {event.eventData.changedFields.join(", ")}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card data-testid="card-incident-actions">
              <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {incident.status !== "resolved" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Change Status</label>
                      <select
                        value={incident.status}
                        onChange={(e) => updateMutation.mutate({ status: e.target.value })}
                        className="w-full border rounded-md p-2 text-sm bg-background mt-1"
                        data-testid="select-change-status"
                      >
                        <option value="active">Active</option>
                        <option value="investigating">Investigating</option>
                        <option value="mitigated">Mitigated</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Change Severity</label>
                      <select
                        value={incident.severity}
                        onChange={(e) => updateMutation.mutate({ severity: e.target.value })}
                        className="w-full border rounded-md p-2 text-sm bg-background mt-1"
                        data-testid="select-change-severity"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <div className="border-t pt-4">
                      <label className="text-sm font-medium">Resolve Incident</label>
                      <Textarea
                        value={resolveNotes}
                        onChange={(e) => setResolveNotes(e.target.value)}
                        placeholder="Root cause summary / resolution notes..."
                        className="mt-1"
                        data-testid="input-resolve-notes"
                      />
                      <Button
                        onClick={() => resolveMutation.mutate()}
                        disabled={resolveMutation.isPending}
                        className="w-full mt-2"
                        data-testid="button-resolve-incident"
                      >
                        {resolveMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                        Resolve
                      </Button>
                    </div>
                  </>
                )}

                {incident.status === "resolved" && (
                  <div>
                    {!showReopen ? (
                      <Button variant="outline" onClick={() => setShowReopen(true)} className="w-full" data-testid="button-show-reopen">
                        <RotateCcw className="w-4 h-4 mr-1" /> Reopen Incident
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Input
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          placeholder="Reason for reopening..."
                          data-testid="input-reopen-reason"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => reopenMutation.mutate()}
                            disabled={reopenMutation.isPending}
                            size="sm"
                            data-testid="button-reopen-incident"
                          >
                            {reopenMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                            Reopen
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowReopen(false)} data-testid="button-cancel-reopen">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-add-action">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Log Action</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="Action taken (e.g., Restarted service)"
                  data-testid="input-action-text"
                />
                <Textarea
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  placeholder="Additional details..."
                  rows={2}
                  data-testid="input-action-details"
                />
                <Button
                  onClick={() => addActionMutation.mutate()}
                  disabled={!actionText || addActionMutation.isPending}
                  size="sm"
                  className="w-full"
                  data-testid="button-add-action"
                >
                  {addActionMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                  Log Action
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-actions-log">
              <CardHeader><CardTitle className="text-lg">Actions Log</CardTitle></CardHeader>
              <CardContent>
                {(!incident.actionsTaken || incident.actionsTaken.length === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No actions logged yet</p>
                ) : (
                  <div className="space-y-3">
                    {incident.actionsTaken.map((action: any, idx: number) => (
                      <div key={idx} className="border rounded p-3" data-testid={`action-log-${idx}`}>
                        <div className="font-medium text-sm">{action.action}</div>
                        {action.details && <div className="text-xs text-muted-foreground mt-1">{action.details}</div>}
                        <div className="text-xs text-muted-foreground mt-1">
                          {action.actor} - {new Date(action.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
