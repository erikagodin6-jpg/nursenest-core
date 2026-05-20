import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Shield, Activity, User, MapPin, ChevronDown, ChevronUp, ExternalLink, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CorrelationResult {
  changeEvent: {
    id: string;
    type: string;
    source: string;
    description: string;
    entityId: string | null;
    actor: string | null;
    metadata: Record<string, any>;
    timestamp: number;
  };
  confidence: number;
  reason: string;
}

interface ActionEntry {
  action: string;
  actor: string | null;
  timestamp: number;
  details: string;
}

interface IncidentDetail {
  id: number;
  userId: string | null;
  examType: string;
  tier: string;
  reasonCode: string;
  reasonDetail: string;
  endpoint: string;
  requestParams: any;
  severity: string;
  resolvedAt: string | null;
  createdAt: string;
  profession: string | null;
  route: string | null;
  fallbackMode: boolean;
  correlations: CorrelationResult[];
  affectedUsersEstimate: number;
  actionsHistory: ActionEntry[];
  recommendedActions: string[];
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[severity] || colors.info}`} data-testid={`badge-severity-${severity}`}>
      {severity.toUpperCase()}
    </span>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const color = confidence >= 70 ? "bg-red-500" : confidence >= 40 ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className="flex items-center gap-2" data-testid="bar-confidence">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600">{confidence}%</span>
    </div>
  );
}

function formatDate(d: string | number) {
  return new Date(d).toLocaleString();
}

function formatDuration(start: string, end: string | null) {
  if (!end) return "Ongoing";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
}

function changeTypeIcon(type: string) {
  const icons: Record<string, string> = {
    deploy: "🚀",
    content_publish: "📄",
    feature_flag: "🏁",
    kill_switch: "🔴",
    config_change: "⚙️",
    admin_override: "👤",
    billing_config: "💳",
    schema_change: "🗃️",
    dependency_update: "📦",
  };
  return icons[type] || "🔄";
}

function getEntityLink(type: string, entityId: string): string {
  const links: Record<string, string> = {
    deploy: `/admin/ops`,
    content_publish: `/admin/content/${entityId}`,
    feature_flag: `/admin/resilience`,
    kill_switch: `/admin/resilience`,
    config_change: `/admin/ops`,
    admin_override: `/admin/ops`,
    billing_config: `/admin/billing`,
    schema_change: `/admin/site-health`,
    dependency_update: `/admin/site-health`,
  };
  return links[type] || `/admin/ops`;
}

function getImpactedIds(params: any): { label: string; value: string }[] {
  if (!params || typeof params !== "object") return [];
  const ids: { label: string; value: string }[] = [];
  if (params.contentType) ids.push({ label: "Content Type", value: params.contentType });
  if (params.productId) ids.push({ label: "Product ID", value: params.productId });
  if (params.incidentId) ids.push({ label: "Incident Ref", value: params.incidentId });
  if (params.attemptId) ids.push({ label: "Attempt ID", value: params.attemptId });
  if (params.questionCount !== undefined) ids.push({ label: "Question Count", value: String(params.questionCount) });
  if (params.invalidQuestionIds?.length) ids.push({ label: "Invalid Questions", value: params.invalidQuestionIds.join(", ") });
  return ids;
}

export default function AdminIncidentDetail() {
  const [, params] = useRoute("/admin/incidents/:id");
  const [, paramsLocale] = useRoute("/:locale/admin/incidents/:id");
  const incidentId = params?.id || paramsLocale?.id;
  const [, navigate] = useLocation();

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(true);
  const [actionType, setActionType] = useState("investigated");
  const [actionNotes, setActionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!incidentId) return;
    setLoading(true);
    fetch(`/api/admin/incidents/${incidentId}`, { credentials: "include" })
      .then(r => {
        if (!r.ok) throw new Error("Failed to load incident");
        return r.json();
      })
      .then(data => { setIncident(data); setError(null); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [incidentId]);

  const handleResolve = async () => {
    if (!incidentId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/incidents/${incidentId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes: actionNotes || "Resolved" }),
      });
      if (res.ok) {
        setIncident(prev => prev ? { ...prev, resolvedAt: new Date().toISOString() } : prev);
        setActionNotes("");
      }
    } catch {}
    setSubmitting(false);
  };

  const handleAction = async () => {
    if (!incidentId || !actionType) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/incidents/${incidentId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: actionType, details: actionNotes }),
      });
      if (res.ok) {
        setIncident(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            actionsHistory: [
              { action: actionType, actor: "you", timestamp: Date.now(), details: actionNotes },
              ...prev.actionsHistory,
            ],
          };
        });
        setActionNotes("");
      }
    } catch {}
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto" data-testid="loading-incident">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="p-6 max-w-6xl mx-auto" data-testid="error-incident">
        <Button variant="ghost" onClick={() => navigate("/admin/ops")} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card className="mt-4">
          <CardContent className="p-6 text-center text-red-600">
            {error || "Incident not found"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4" data-testid="page-incident-detail">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/ops")} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-bold" data-testid="text-incident-title">
          Incident #{incident.id}
        </h1>
        <SeverityBadge severity={incident.severity} />
        {incident.resolvedAt ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="badge-resolved">
            <CheckCircle className="w-3 h-3 mr-1" /> Resolved
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200" data-testid="badge-active">
            <AlertTriangle className="w-3 h-3 mr-1" /> Active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><span className="text-gray-500">Start:</span> <span data-testid="text-incident-start">{formatDate(incident.createdAt)}</span></div>
            <div><span className="text-gray-500">End:</span> <span data-testid="text-incident-end">{incident.resolvedAt ? formatDate(incident.resolvedAt) : "Ongoing"}</span></div>
            <div><span className="text-gray-500">Duration:</span> <span data-testid="text-incident-duration">{formatDuration(incident.createdAt, incident.resolvedAt)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" /> Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><span className="text-gray-500">Affected Route:</span> <span data-testid="text-incident-route" className="font-mono text-xs">{incident.endpoint || incident.route || "N/A"}</span></div>
            <div><span className="text-gray-500">Content Type:</span> <span data-testid="text-incident-type">{incident.examType}</span></div>
            <div><span className="text-gray-500">Est. Affected Users:</span> <span data-testid="text-affected-users" className="font-semibold">{incident.affectedUsersEstimate}</span></div>
            {incident.fallbackMode && <Badge variant="outline" className="text-xs" data-testid="badge-fallback">Fallback Active</Badge>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><span className="text-gray-500">Reason:</span> <span data-testid="text-reason-code" className="font-mono text-xs">{incident.reasonCode}</span></div>
            <div><span className="text-gray-500">Tier:</span> <span data-testid="text-tier">{incident.tier}</span></div>
            {incident.userId && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">User:</span>
                <span data-testid="text-user-id" className="font-mono text-xs">{incident.userId.slice(0, 12)}...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {incident.reasonDetail && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-700" data-testid="text-reason-detail">{incident.reasonDetail}</p>
          </CardContent>
        </Card>
      )}

      {(() => {
        const impactedIds = getImpactedIds(incident.requestParams);
        if (impactedIds.length === 0) return null;
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Impacted Content / Product IDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {impactedIds.map((item, idx) => (
                  <div key={idx} className="text-sm" data-testid={`text-impacted-${idx}`}>
                    <span className="text-gray-500">{item.label}:</span>{" "}
                    <span className="font-mono text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      <Card>
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowTimeline(!showTimeline)}>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> What Changed? ({incident.correlations.length} correlations)
            </span>
            {showTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        {showTimeline && (
          <CardContent className="space-y-3">
            {incident.correlations.length === 0 ? (
              <p className="text-sm text-gray-500 italic" data-testid="text-no-correlations">No recent changes correlated with this incident</p>
            ) : (
              <div className="space-y-3">
                {incident.correlations.map((c, i) => (
                  <div
                    key={c.changeEvent.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                    data-testid={`card-correlation-${i}`}
                  >
                    <span className="text-lg">{changeTypeIcon(c.changeEvent.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{c.changeEvent.type.replace(/_/g, " ")}</span>
                        <ConfidenceBar confidence={c.confidence} />
                      </div>
                      <p className="text-xs text-gray-600 mt-1" data-testid={`text-correlation-reason-${i}`}>{c.reason}</p>
                      {c.changeEvent.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{c.changeEvent.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{formatDate(c.changeEvent.timestamp)}</span>
                        {c.changeEvent.actor && <span>by {c.changeEvent.actor}</span>}
                        {c.changeEvent.source && <span>source: {c.changeEvent.source}</span>}
                      </div>
                      {c.changeEvent.entityId && (
                        <a
                          href={getEntityLink(c.changeEvent.type, c.changeEvent.entityId)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                          data-testid={`link-entity-${i}`}
                        >
                          <ExternalLink className="w-3 h-3" /> View {c.changeEvent.type.replace(/_/g, " ")}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {incident.recommendedActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" data-testid={`text-recommended-action-${i}`}>
                  <span className="text-blue-500 mt-0.5">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Action History ({incident.actionsHistory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {incident.actionsHistory.length === 0 ? (
              <p className="text-sm text-gray-500 italic" data-testid="text-no-actions">No actions taken yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {incident.actionsHistory.map((a, i) => (
                  <div key={i} className="text-sm border-l-2 border-gray-200 pl-3 py-1" data-testid={`card-action-${i}`}>
                    <div className="font-medium">{a.action}</div>
                    {a.details && <div className="text-xs text-gray-500">{a.details}</div>}
                    <div className="text-xs text-gray-400">{a.actor && `${a.actor} - `}{formatDate(a.timestamp)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Take Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger className="w-48" data-testid="select-action-type">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investigated">Investigated</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="root_cause_found">Root Cause Found</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="note">Added Note</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAction} disabled={submitting} size="sm" data-testid="button-add-action">
              <Send className="w-3 h-3 mr-1" /> Log Action
            </Button>
            {!incident.resolvedAt && (
              <Button onClick={handleResolve} disabled={submitting} variant="outline" size="sm" className="text-green-700 border-green-300" data-testid="button-resolve">
                <CheckCircle className="w-3 h-3 mr-1" /> Resolve
              </Button>
            )}
          </div>
          <Textarea
            placeholder="Notes (optional)..."
            value={actionNotes}
            onChange={e => setActionNotes(e.target.value)}
            rows={2}
            className="text-sm"
            data-testid="input-action-notes"
          />
        </CardContent>
      </Card>

      {incident.requestParams && Object.keys(incident.requestParams).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Request Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48" data-testid="text-request-params">
              {JSON.stringify(incident.requestParams, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
