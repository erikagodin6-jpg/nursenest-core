import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useLocation, useRoute } from "wouter";
import {
  Shield, AlertTriangle, Activity, Users, Clock, RefreshCw,
  CheckCircle2, XCircle, ArrowLeft, Search, Loader2, Eye,
  AlertCircle, Bell, Plus, Copy, Check, GitCommit, FileText,
  Settings, Zap, MessageSquare,
} from "lucide-react";

interface Incident {
  incidentId: string;
  category: string;
  severity: "critical" | "warning" | "info";
  errorSignature: string;
  title: string;
  message: string;
  firstOccurrence: number;
  lastOccurrence: number;
  affectedUserIds: string[];
  affectedUserCount: number;
  occurrenceCount: number;
  status: "active" | "acknowledged" | "resolved";
  resolutionNotes: string | null;
  resolvedAt: number | null;
  resolvedBy: string | null;
  acknowledgedAt: number | null;
  acknowledgedBy: string | null;
  metadata: Record<string, any>;
}

interface IncidentStats {
  totalActive: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  acknowledgedCount: number;
  resolvedCount: number;
  totalAffectedUsers: number;
}

interface CorrelationEntry {
  type: string;
  timestamp: string;
  description: string;
  entityType: string;
  entityId: string | null;
  actor: string | null;
  confidence: number;
  details: any;
}

interface AdminNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  warning: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  info: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
};

const CATEGORY_LABELS: Record<string, string> = {
  login_failure: "Login Failure",
  entitlement_failure: "Entitlement Failure",
  exam_load_failure: "Exam Load Failure",
  cat_start_failure: "CAT Start Failure",
  flashcard_failure: "Flashcard Failure",
  lesson_load_failure: "Lesson Load Failure",
  download_failure: "Download Failure",
  fallback_mode: "Fallback Mode",
  provisional_access: "Provisional Access",
  quarantined_content: "Quarantined Content",
  deployment_rollback: "Deployment Rollback",
  circuit_breaker_trip: "Circuit Breaker Trip",
  feature_auto_disabled: "Feature Auto-Disabled",
  emergency_mode: "Emergency Mode",
  health_check_failure: "Health Check Failure",
  general: "General",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function formatDuration(startMs: number, endMs: number): string {
  const diff = endMs - startMs;
  if (diff < 60000) return `${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
}

function SeverityBadge({ severity }: { severity: string }) {
  const icons: Record<string, any> = { critical: XCircle, warning: AlertTriangle, info: AlertCircle };
  const colors: Record<string, string> = {
    critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };
  const Icon = icons[severity] || AlertCircle;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[severity] || colors.info}`} data-testid={`badge-severity-${severity}`}>
      <Icon className="w-3 h-3" />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    acknowledged: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`} data-testid={`badge-status-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function generateSummaryText(
  incident: Incident,
  notes: AdminNote[],
  correlations: CorrelationEntry[],
  impactedRoutes: string[],
  impactedFeatures: string[]
): string {
  const lines: string[] = [];
  lines.push(`INCIDENT SUMMARY: ${incident.incidentId}`);
  lines.push(`Title: ${incident.title}`);
  lines.push(`Severity: ${incident.severity.toUpperCase()}`);
  lines.push(`Status: ${incident.status}`);
  lines.push(`Category: ${CATEGORY_LABELS[incident.category] || incident.category}`);
  lines.push(`First Seen: ${new Date(incident.firstOccurrence).toISOString()}`);
  lines.push(`Last Seen: ${new Date(incident.lastOccurrence).toISOString()}`);
  lines.push(`Duration: ${formatDuration(incident.firstOccurrence, incident.status === "resolved" && incident.resolvedAt ? incident.resolvedAt : incident.lastOccurrence)}`);
  lines.push(`Occurrences: ${incident.occurrenceCount}`);
  lines.push(`Affected Users: ${incident.affectedUserCount}`);
  lines.push(`Message: ${incident.message}`);
  if (impactedRoutes.length > 0) lines.push(`Impacted Routes: ${impactedRoutes.join(", ")}`);
  if (impactedFeatures.length > 0) lines.push(`Impacted Features: ${impactedFeatures.join(", ")}`);
  if (incident.resolutionNotes) lines.push(`Resolution: ${incident.resolutionNotes}`);
  if (correlations.length > 0) {
    lines.push("");
    lines.push("LIKELY CAUSES:");
    correlations.slice(0, 5).forEach((c, i) => {
      lines.push(`  ${i + 1}. [${Math.round(c.confidence * 100)}%] ${c.description} (${c.timestamp})`);
    });
  }
  if (notes.length > 0) {
    lines.push("");
    lines.push("NOTES:");
    notes.forEach(n => {
      lines.push(`  - [${n.author}, ${new Date(n.createdAt).toLocaleString()}] ${n.text}`);
    });
  }
  return lines.join("\n");
}

function IncidentDetailView({ incidentId }: { incidentId: string }) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [resolveNotes, setResolveNotes] = useState("");
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/incidents", incidentId],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/incidents/${incidentId}`);
      if (!res.ok) throw new Error("Failed to fetch incident detail");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch(`/api/admin/incidents/${incidentId}/acknowledge`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to acknowledge");
      return res.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/incidents"] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (notes: string) => {
      const res = await adminFetch(`/api/admin/incidents/${incidentId}/resolve`, {
        method: "POST",
        body: { notes },
      });
      if (!res.ok) throw new Error("Failed to resolve");
      return res.json();
    },
    onSuccess: () => {
      setShowResolveForm(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/incidents"] });
    },
  });

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await adminFetch(`/api/admin/incidents/${incidentId}/notes`, {
        method: "POST",
        body: { note: newNote },
      });
      if (res.ok) {
        setNewNote("");
        refetch();
      }
    } catch {} finally { setAddingNote(false); }
  }

  function handleCopySummary() {
    if (!incident) return;
    const text = generateSummaryText(
      incident,
      adminNotes,
      correlations,
      impactedRoutes,
      impactedFeatures
    );
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">Loading incident...</p>
      </div>
    );
  }

  const incident: Incident | null = data?.incident || null;
  const correlations: CorrelationEntry[] = data?.correlationTimeline || [];
  const adminNotes: AdminNote[] = data?.adminNotes || [];
  const impactedRoutes: string[] = data?.impactedRoutes || [];
  const impactedFeatures: string[] = data?.impactedFeatures || [];
  const impactedContentIds: string[] = data?.impactedContentIds || [];
  const recommendedActions: string[] = data?.recommendedActions || [];
  const fallbackModes: string[] = data?.fallbackModes || [];
  const createdBy: string | null = data?.createdBy || null;

  if (!incident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2" data-testid="text-not-found">Incident Not Found</h2>
        <Button variant="outline" onClick={() => navigate("/admin/incidents")} data-testid="button-back-to-list">
          Back to Incidents
        </Button>
      </div>
    );
  }

  const duration = formatDuration(
    incident.firstOccurrence,
    incident.status === "resolved" && incident.resolvedAt ? incident.resolvedAt : incident.lastOccurrence
  );
  const styles = SEVERITY_STYLES[incident.severity] || SEVERITY_STYLES.info;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/incidents")} data-testid="link-back-incidents">
          <ArrowLeft className="w-4 h-4 mr-1" /> Incidents
        </Button>
        <span className="font-mono text-sm text-muted-foreground" data-testid="text-incident-id">{incident.incidentId}</span>
      </div>

      <Card className={`border-l-4 ${styles.border}`} data-testid="card-incident-header">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold" data-testid="text-detail-title">{incident.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
                <Badge variant="outline" className="text-xs">{CATEGORY_LABELS[incident.category] || incident.category}</Badge>
                {createdBy && <Badge variant="outline" className="text-xs">Created by {createdBy}</Badge>}
              </div>
              <p className="text-muted-foreground mt-3" data-testid="text-detail-message">{incident.message}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleCopySummary} data-testid="button-copy-summary">
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied" : "Copy Summary"}
              </Button>
              {incident.status === "active" && (
                <Button variant="outline" size="sm" onClick={() => acknowledgeMutation.mutate()} disabled={acknowledgeMutation.isPending} data-testid="button-acknowledge">
                  <Eye className="w-4 h-4 mr-1" /> Acknowledge
                </Button>
              )}
              {incident.status !== "resolved" && (
                <Button size="sm" onClick={() => setShowResolveForm(true)} disabled={resolveMutation.isPending} data-testid="button-resolve">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Resolve
                </Button>
              )}
            </div>
          </div>

          {showResolveForm && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg" data-testid="form-resolve">
              <Textarea
                placeholder="Resolution notes (optional)..."
                value={resolveNotes}
                onChange={e => setResolveNotes(e.target.value)}
                rows={2}
                data-testid="input-resolve-notes"
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => resolveMutation.mutate(resolveNotes)} disabled={resolveMutation.isPending} data-testid="button-confirm-resolve">
                  Confirm Resolve
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowResolveForm(false)} data-testid="button-cancel-resolve">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold" data-testid="stat-occurrences">{incident.occurrenceCount}</div>
            <div className="text-xs text-muted-foreground">Occurrences</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold" data-testid="stat-affected-users">{incident.affectedUserCount}</div>
            <div className="text-xs text-muted-foreground">Affected Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold" data-testid="stat-duration">{duration}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-sm font-medium" data-testid="stat-first-seen">{timeAgo(incident.firstOccurrence)}</div>
            <div className="text-xs text-muted-foreground">First Seen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-sm font-medium" data-testid="stat-last-seen">{timeAgo(incident.lastOccurrence)}</div>
            <div className="text-xs text-muted-foreground">Last Seen</div>
          </CardContent>
        </Card>
      </div>

      {(impactedRoutes.length > 0 || impactedFeatures.length > 0 || impactedContentIds.length > 0 || fallbackModes.length > 0 || recommendedActions.length > 0) && (
        <Card data-testid="card-impact">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4" /> Impact & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {impactedRoutes.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Impacted Routes</div>
                <div className="flex flex-wrap gap-1">
                  {impactedRoutes.map((r: string, i: number) => <Badge key={i} variant="outline" className="text-xs font-mono">{r}</Badge>)}
                </div>
              </div>
            )}
            {impactedFeatures.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Impacted Features</div>
                <div className="flex flex-wrap gap-1">
                  {impactedFeatures.map((f: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{f}</Badge>)}
                </div>
              </div>
            )}
            {impactedContentIds.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Impacted Content IDs</div>
                <div className="flex flex-wrap gap-1">
                  {impactedContentIds.map((c: string, i: number) => <Badge key={i} variant="outline" className="text-xs font-mono">{c}</Badge>)}
                </div>
              </div>
            )}
            {fallbackModes.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Fallback Modes Triggered</div>
                <div className="flex flex-wrap gap-1">
                  {fallbackModes.map((m: string, i: number) => <Badge key={i} className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs">{m}</Badge>)}
                </div>
              </div>
            )}
            {recommendedActions.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Recommended Actions</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {recommendedActions.map((a: string, i: number) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-correlation-timeline">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GitCommit className="w-4 h-4" /> What Changed? (Correlation Timeline)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {correlations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-correlations">
              No correlated changes found in the 30-minute window before this incident.
            </p>
          ) : (
            <div className="space-y-3">
              {correlations.map((c, i) => {
                const confidenceColor = c.confidence >= 0.8 ? "text-red-600 dark:text-red-400" : c.confidence >= 0.5 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground";
                const confidenceBg = c.confidence >= 0.8 ? "bg-red-50 dark:bg-red-900/10" : c.confidence >= 0.5 ? "bg-amber-50 dark:bg-amber-900/10" : "bg-muted/30";
                const typeIcon = c.type === "audit_log" ? <FileText className="w-4 h-4" /> :
                  c.type === "health_check_failure" ? <AlertTriangle className="w-4 h-4" /> :
                  c.type === "emergency_action" ? <Shield className="w-4 h-4" /> :
                  c.type === "content_publish" ? <FileText className="w-4 h-4" /> :
                  <Settings className="w-4 h-4" />;

                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${confidenceBg}`}
                    data-testid={`correlation-entry-${i}`}
                  >
                    <div className="flex-shrink-0 mt-0.5 text-muted-foreground">{typeIcon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{c.description}</span>
                        <Badge className={`${confidenceColor} text-xs`} variant="outline">
                          {Math.round(c.confidence * 100)}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{new Date(c.timestamp).toLocaleString()}</span>
                        {c.actor && <span>by {c.actor}</span>}
                        <span className="font-mono">{c.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {incident.status === "resolved" && incident.resolutionNotes && (
        <Card className="border-green-200 dark:border-green-800" data-testid="card-resolution">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Resolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" data-testid="text-resolution-notes">{incident.resolutionNotes}</p>
            <div className="text-xs text-muted-foreground mt-2">
              Resolved by {incident.resolvedBy} at {incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString() : "unknown"}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-admin-notes">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Notes ({adminNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {adminNotes.length > 0 && (
            <div className="space-y-3 mb-4">
              {adminNotes.map((note) => (
                <div key={note.id} className="p-3 bg-muted/50 rounded-lg" data-testid={`note-${note.id}`}>
                  <p className="text-sm">{note.text}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {note.author} &middot; {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Add a note..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddNote()}
              className="flex-1"
              data-testid="input-add-note"
            />
            <Button size="sm" onClick={handleAddNote} disabled={addingNote || !newNote.trim()} data-testid="button-add-note">
              {addingNote ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {incident.affectedUserIds.length > 0 && (
        <Card data-testid="card-affected-users">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" /> Affected Users ({incident.affectedUserCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {incident.affectedUserIds.slice(0, 50).map((uid, i) => (
                <Badge key={i} variant="outline" className="text-xs font-mono">{uid}</Badge>
              ))}
              {incident.affectedUserIds.length > 50 && (
                <Badge variant="outline" className="text-xs">+{incident.affectedUserIds.length - 50} more</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {incident.acknowledgedAt && (
        <div className="text-xs text-muted-foreground">
          Acknowledged by {incident.acknowledgedBy} at {new Date(incident.acknowledgedAt).toLocaleString()}
        </div>
      )}

      {Object.keys(incident.metadata).length > 0 && (
        <Card data-testid="card-metadata">
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted/50 rounded p-3 overflow-x-auto max-h-48">{JSON.stringify(incident.metadata, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function IncidentListView() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [filterSeverity, setFilterSeverity] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", message: "", severity: "warning", category: "general" });
  const [creating, setCreating] = useState(false);

  const { data: incidentsData, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/incidents", filterSeverity, filterCategory, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterSeverity) params.set("severity", filterSeverity);
      if (filterCategory) params.set("category", filterCategory);
      if (filterStatus) params.set("status", filterStatus);
      params.set("limit", "200");
      const res = await adminFetch(`/api/admin/incidents?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch incidents");
      return res.json() as Promise<{ incidents: Incident[]; total: number; stats: IncidentStats }>;
    },
    refetchInterval: 30000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (incidentId: string) => {
      const res = await adminFetch(`/api/admin/incidents/${incidentId}/acknowledge`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to acknowledge");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/incidents"] });
    },
  });

  async function handleCreate() {
    if (!createForm.title || !createForm.message) return;
    setCreating(true);
    try {
      const res = await adminFetch("/api/admin/incidents/create", {
        method: "POST",
        body: createForm,
      });
      if (res.ok) {
        setShowCreateForm(false);
        setCreateForm({ title: "", message: "", severity: "warning", category: "general" });
        refetch();
      }
    } catch {} finally { setCreating(false); }
  }

  const incidents = incidentsData?.incidents || [];
  const stats = incidentsData?.stats || { totalActive: 0, criticalCount: 0, warningCount: 0, infoCount: 0, acknowledgedCount: 0, resolvedCount: 0, totalAffectedUsers: 0 };
  const filteredIncidents = incidents.filter(i => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return i.title.toLowerCase().includes(term) || i.incidentId.toLowerCase().includes(term) || i.message.toLowerCase().includes(term) || i.category.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} data-testid="button-back-admin">
          <ArrowLeft className="w-4 h-4 mr-1" /> Admin
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
            <Shield className="w-6 h-6 text-primary" />
            Incident Center
          </h1>
          <p className="text-sm text-muted-foreground">Production monitoring, incident management & root-cause correlation</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh-incidents">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
        <Button size="sm" onClick={() => setShowCreateForm(!showCreateForm)} data-testid="button-create-incident">
          <Plus className="w-4 h-4 mr-1" /> New Incident
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="border-red-200 dark:border-red-800" data-testid="card-stat-critical">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.criticalCount}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-800" data-testid="card-stat-warning">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.warningCount}</div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800" data-testid="card-stat-info">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.infoCount}</div>
            <div className="text-xs text-muted-foreground">Info</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-active">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalActive}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-acknowledged">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.acknowledgedCount}</div>
            <div className="text-xs text-muted-foreground">Acknowledged</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-resolved">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolvedCount}</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-affected-users">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold">{stats.totalAffectedUsers}</div>
            <div className="text-xs text-muted-foreground">Affected Users</div>
          </CardContent>
        </Card>
      </div>

      {showCreateForm && (
        <Card data-testid="form-create-incident">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create Manual Incident
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Incident title"
              value={createForm.title}
              onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
              data-testid="input-incident-title"
            />
            <Textarea
              placeholder="Describe the incident..."
              value={createForm.message}
              onChange={e => setCreateForm(f => ({ ...f, message: e.target.value }))}
              rows={3}
              data-testid="input-incident-message"
            />
            <div className="flex gap-3">
              <select
                value={createForm.severity}
                onChange={e => setCreateForm(f => ({ ...f, severity: e.target.value }))}
                className="border rounded-md px-3 py-2 text-sm bg-background"
                data-testid="select-incident-severity"
              >
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              <select
                value={createForm.category}
                onChange={e => setCreateForm(f => ({ ...f, category: e.target.value }))}
                className="border rounded-md px-3 py-2 text-sm bg-background"
                data-testid="select-incident-category"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreate} disabled={creating || !createForm.title || !createForm.message} data-testid="button-submit-incident">
                {creating ? "Creating..." : "Create Incident"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)} data-testid="button-cancel-create">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            data-testid="input-search-incidents"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background"
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          data-testid="select-filter-severity"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          data-testid="select-filter-category"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          data-testid="select-filter-status"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-2" data-testid="list-incidents">
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">Loading incidents...</p>
          </div>
        )}

        {!isLoading && filteredIncidents.length === 0 && (
          <div className="text-center py-12" data-testid="text-no-incidents">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="font-medium">No incidents found</p>
            <p className="text-sm text-muted-foreground">All systems operating normally</p>
          </div>
        )}

        {filteredIncidents.map(incident => {
          const istyles = SEVERITY_STYLES[incident.severity] || SEVERITY_STYLES.info;
          return (
            <Card
              key={incident.incidentId}
              className={`cursor-pointer hover:shadow-md transition-shadow border ${istyles.border}`}
              onClick={() => navigate(`/admin/incidents/${incident.incidentId}`)}
              data-testid={`card-incident-${incident.incidentId}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <SeverityBadge severity={incident.severity} />
                      <StatusBadge status={incident.status} />
                      <span className="text-xs text-muted-foreground font-mono">{incident.incidentId}</span>
                    </div>
                    <h3 className="font-semibold text-sm truncate" data-testid={`text-incident-title-${incident.incidentId}`}>{incident.title}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{incident.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" /> {CATEGORY_LABELS[incident.category] || incident.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {incident.affectedUserCount} users
                      </span>
                      <span className="flex items-center gap-1">
                        <Bell className="w-3 h-3" /> {incident.occurrenceCount}x
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(incident.lastOccurrence)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {incident.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); acknowledgeMutation.mutate(incident.incidentId); }}
                        disabled={acknowledgeMutation.isPending}
                        data-testid={`button-ack-${incident.incidentId}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-xs text-muted-foreground" data-testid="text-auto-refresh">
        Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}

export default function AdminIncidentsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [matchDetail, paramsDetail] = useRoute("/admin/incidents/:id");
  const [matchDetailLocale, paramsDetailLocale] = useRoute("/:locale/admin/incidents/:id");

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

  const detailId = paramsDetail?.id || paramsDetailLocale?.id;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {(matchDetail || matchDetailLocale) && detailId ? (
          <IncidentDetailView incidentId={detailId} />
        ) : (
          <IncidentListView />
        )}
      </div>
    </div>
  );
}
