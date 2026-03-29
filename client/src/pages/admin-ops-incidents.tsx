import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  Shield, AlertTriangle, Activity, Clock, RefreshCw, Plus, Search,
  ArrowLeft, Eye, XCircle, AlertCircle, CheckCircle2, Loader2, Copy
} from "lucide-react";

interface StructuredIncident {
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

const SEVERITY_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  critical: { label: "Critical", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  high: { label: "High", color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertTriangle },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertCircle },
  low: { label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Activity },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-red-100 text-red-800" },
  investigating: { label: "Investigating", color: "bg-yellow-100 text-yellow-800" },
  mitigated: { label: "Mitigated", color: "bg-blue-100 text-blue-800" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800" },
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export default function AdminOpsIncidentsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium",
    impactedFeatures: "",
    affectedUsersEstimate: 0,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/ops/incidents", filterSeverity, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterSeverity) params.set("severity", filterSeverity);
      if (filterStatus) params.set("status", filterStatus);
      params.set("limit", "50");
      const res = await adminFetch(`/api/admin/ops/incidents?${params}`);
      if (!res.ok) throw new Error("Failed to fetch incidents");
      return res.json() as Promise<{ incidents: StructuredIncident[]; total: number }>;
    },
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/ops/incidents", {
        method: "POST",
        body: {
          title: newIncident.title,
          description: newIncident.description || undefined,
          severity: newIncident.severity,
          impactedFeatures: newIncident.impactedFeatures
            ? newIncident.impactedFeatures.split(",").map(s => s.trim()).filter(Boolean)
            : [],
          affectedUsersEstimate: newIncident.affectedUsersEstimate,
        },
      });
      if (!res.ok) throw new Error("Failed to create incident");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ops/incidents"] });
      setShowCreate(false);
      setNewIncident({ title: "", description: "", severity: "medium", impactedFeatures: "", affectedUsersEstimate: 0 });
    },
  });

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

  const incidents = data?.incidents || [];
  const total = data?.total || 0;

  const filtered = searchText
    ? incidents.filter(i =>
        i.title.toLowerCase().includes(searchText.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        i.id.toLowerCase().includes(searchText.toLowerCase())
      )
    : incidents;

  const activeCount = incidents.filter(i => i.status !== "resolved").length;
  const criticalCount = incidents.filter(i => i.severity === "critical" && i.status !== "resolved").length;
  const resolvedCount = incidents.filter(i => i.status === "resolved").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
                <Shield className="w-6 h-6 text-red-600" />
                Incident Management
              </h1>
              <p className="text-sm text-muted-foreground">Track, correlate, and resolve production incidents</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => refetch()} variant="outline" size="sm" data-testid="button-refresh">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button onClick={() => setShowCreate(!showCreate)} size="sm" data-testid="button-create-incident">
              <Plus className="w-4 h-4 mr-1" /> New Incident
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card data-testid="card-stat-total">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Activity className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold" data-testid="text-stat-total">{total}</p></div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-active">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
              <div><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold" data-testid="text-stat-active">{activeCount}</p></div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-critical">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg"><XCircle className="w-5 h-5 text-red-600" /></div>
              <div><p className="text-sm text-muted-foreground">Critical</p><p className="text-2xl font-bold" data-testid="text-stat-critical">{criticalCount}</p></div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-resolved">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <div><p className="text-sm text-muted-foreground">Resolved</p><p className="text-2xl font-bold" data-testid="text-stat-resolved">{resolvedCount}</p></div>
            </CardContent>
          </Card>
        </div>

        {showCreate && (
          <Card className="mb-6 border-blue-200" data-testid="card-create-incident">
            <CardHeader><CardTitle className="text-lg">Create New Incident</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="Brief description of the incident"
                  data-testid="input-incident-title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="Detailed description..."
                  data-testid="input-incident-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                    className="w-full border rounded-md p-2 text-sm bg-background"
                    data-testid="select-incident-severity"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Affected Users (est.)</label>
                  <Input
                    type="number"
                    value={newIncident.affectedUsersEstimate}
                    onChange={(e) => setNewIncident({ ...newIncident, affectedUsersEstimate: parseInt(e.target.value) || 0 })}
                    data-testid="input-incident-users"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Impacted Features (comma-separated)</label>
                <Input
                  value={newIncident.impactedFeatures}
                  onChange={(e) => setNewIncident({ ...newIncident, impactedFeatures: e.target.value })}
                  placeholder="exams, flashcards, lessons"
                  data-testid="input-incident-features"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={!newIncident.title || createMutation.isPending}
                  data-testid="button-submit-incident"
                >
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                  Create Incident
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)} data-testid="button-cancel-create">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search incidents..."
              className="pl-9"
              data-testid="input-search-incidents"
            />
          </div>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="border rounded-md p-2 text-sm bg-background"
            data-testid="select-filter-severity"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md p-2 text-sm bg-background"
            data-testid="select-filter-status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="mitigated">Mitigated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12" data-testid="loading-incidents">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading incidents...</span>
          </div>
        ) : filtered.length === 0 ? (
          <Card data-testid="card-no-incidents">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No incidents found</p>
              <p className="text-sm">All systems operational or no matching results</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((incident) => {
              const sevConfig = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.medium;
              const statusConfig = STATUS_CONFIG[incident.status] || STATUS_CONFIG.active;
              const SevIcon = sevConfig.icon;

              return (
                <Card
                  key={incident.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/admin/ops/incidents/${incident.id}`)}
                  data-testid={`card-incident-${incident.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <SevIcon className={`w-5 h-5 mt-0.5 ${
                          incident.severity === "critical" ? "text-red-600" :
                          incident.severity === "high" ? "text-orange-600" :
                          incident.severity === "medium" ? "text-yellow-600" :
                          "text-blue-600"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold truncate" data-testid={`text-incident-title-${incident.id}`}>
                              {incident.title}
                            </h3>
                            <Badge className={`text-xs ${sevConfig.color}`} data-testid={`badge-severity-${incident.id}`}>
                              {sevConfig.label}
                            </Badge>
                            <Badge className={`text-xs ${statusConfig.color}`} data-testid={`badge-status-${incident.id}`}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          {incident.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{incident.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(incident.startTime).toLocaleString()}
                            </span>
                            {incident.affectedUsersEstimate > 0 && (
                              <span>~{incident.affectedUsersEstimate} users</span>
                            )}
                            {incident.impactedFeatures?.length > 0 && (
                              <span>{incident.impactedFeatures.slice(0, 3).join(", ")}</span>
                            )}
                            {incident.duration != null && (
                              <span>Duration: {formatDuration(incident.duration)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`button-view-incident-${incident.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground mt-4" data-testid="text-auto-refresh">
          Auto-refreshes every 30 seconds
        </div>
      </div>
    </div>
  );
}
