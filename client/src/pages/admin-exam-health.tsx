import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  ShieldCheck, ShieldAlert, AlertTriangle, Activity,
  RefreshCw, Trash2, CheckCircle, XCircle, Clock,
  ArrowLeft, Database, Loader2
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

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default function AdminExamHealth() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["/api/admin/exam-health/overview"],
    queryFn: () => apiFetch("/api/admin/exam-health/overview"),
    refetchInterval: 30000,
    enabled: isAdmin,
  });

  const { data: incidents } = useQuery({
    queryKey: ["/api/admin/exam-health/incidents"],
    queryFn: () => apiFetch("/api/admin/exam-health/incidents?limit=100"),
    refetchInterval: 30000,
    enabled: isAdmin && activeTab === "incidents",
  });

  const { data: quarantined, refetch: refetchQuarantined } = useQuery({
    queryKey: ["/api/admin/exam-health/quarantined"],
    queryFn: () => apiFetch("/api/admin/exam-health/quarantined"),
    enabled: isAdmin && activeTab === "quarantined",
  });

  const unquarantineMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/admin/exam-health/unquarantine/${id}`, { method: "POST" }),
    onSuccess: () => {
      refetchQuarantined();
      refetchOverview();
    },
  });

  if (!isAdmin) {
    navigate("/admin");
    return null;
  }

  const hasCritical = (overview?.criticalCount || 0) > 0;
  const hasLowInventory = (overview?.lowInventory?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-background" data-testid="page-admin-exam-health">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" data-testid="text-page-title">
                {hasCritical ? (
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                )}
                Exam Health Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time exam delivery monitoring and incident tracking
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchOverview()} className="gap-1.5" data-testid="button-refresh-health">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {hasCritical && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" data-testid="alert-critical">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">{t("pages.adminExamHealth.criticalExamIssuesDetected")}</p>
              <p className="text-sm text-red-700 mt-1">
                {overview.criticalCount} critical incident(s) in the last 24 hours.
                Review the incidents tab for details.
              </p>
            </div>
          </div>
        )}

        {overviewLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label={t("pages.adminExamHealth.overallStatus")}
                value={hasCritical ? "Degraded" : "Healthy"}
                icon={hasCritical ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                color={hasCritical ? "text-red-500" : "text-green-500"}
                testId="stat-overall-status"
              />
              <StatCard
                label={t("pages.adminExamHealth.incidents24h")}
                value={String(overview?.totalIncidents24h || 0)}
                icon={<Activity className="w-5 h-5" />}
                color={(overview?.totalIncidents24h || 0) > 0 ? "text-amber-500" : "text-green-500"}
                testId="stat-incidents-24h"
              />
              <StatCard
                label={t("pages.adminExamHealth.quarantined2")}
                value={String(overview?.quarantined?.length || 0)}
                icon={<AlertTriangle className="w-5 h-5" />}
                color={(overview?.quarantined?.length || 0) > 0 ? "text-amber-500" : "text-green-500"}
                testId="stat-quarantined"
              />
              <StatCard
                label={t("pages.adminExamHealth.lowInventory")}
                value={String(overview?.lowInventory?.length || 0)}
                icon={<Database className="w-5 h-5" />}
                color={hasLowInventory ? "text-red-500" : "text-green-500"}
                testId="stat-low-inventory"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList data-testid="tabs-exam-health">
                <TabsTrigger value="overview" data-testid="tab-overview">{t("pages.adminExamHealth.tierHealth")}</TabsTrigger>
                <TabsTrigger value="incidents" data-testid="tab-incidents">
                  Incidents
                  {(overview?.totalIncidents24h || 0) > 0 && (
                    <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5 py-0">{overview.totalIncidents24h}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="quarantined" data-testid="tab-quarantined">{t("pages.adminExamHealth.quarantined")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {overview?.tiers && Object.entries(overview.tiers).map(([tier, health]: [string, any]) => (
                  <Card key={tier} data-testid={`card-tier-${tier}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="uppercase font-semibold">{tier}</span>
                        <Badge variant={health.healthy ? "secondary" : "destructive"}>
                          {health.healthy ? "Healthy" : "Issues Detected"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("pages.adminExamHealth.availableQuestions")}</span>
                        <span className="font-medium">{health.totalAvailable.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("pages.adminExamHealth.minimumRequired")}</span>
                        <span className="font-medium">{health.minimumRequired}</span>
                      </div>
                      {health.issues.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {health.issues.map((issue: string, i: number) => (
                            <div key={i} className="text-red-600 text-xs flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {hasLowInventory && (
                  <Card className="border-amber-200" data-testid="card-low-inventory-warning">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-amber-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Low Inventory Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {overview.lowInventory.map((item: any) => (
                          <div key={item.tier} className="flex justify-between items-center text-sm">
                            <span className="uppercase font-medium">{item.tier}</span>
                            <span className="text-amber-700">
                              {item.count} / {item.minimum} minimum
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="incidents" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("pages.adminExamHealth.recentIncidents")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!incidents?.incidents || incidents.incidents.length === 0) ? (
                      <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-incidents">
                        No incidents recorded.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {incidents.incidents.map((inc: any, i: number) => (
                          <div
                            key={inc.id || i}
                            className="border rounded-lg p-3 text-sm space-y-1"
                            data-testid={`incident-row-${i}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={inc.severity === "critical" ? "destructive" : "secondary"}
                                  className="text-[10px]"
                                >
                                  {inc.severity || inc.reason_code}
                                </Badge>
                                <span className="font-medium">
                                  {inc.reason_code || inc.reasonCode}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(inc.created_at || inc.createdAt || "").toLocaleString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {inc.reason_detail || inc.reasonDetail}
                            </p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>Tier: {inc.tier}</span>
                              <span>Exam: {inc.exam_type || inc.examType}</span>
                              {(inc.user_id || inc.userId) && <span>User: {(inc.user_id || inc.userId)?.substring(0, 8)}...</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quarantined" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t("pages.adminExamHealth.quarantinedQuestions")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!quarantined?.quarantined || quarantined.quarantined.length === 0) ? (
                      <div className="text-center py-8 space-y-2" data-testid="text-no-quarantined">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-muted-foreground">{t("pages.adminExamHealth.noQuarantinedQuestions")}</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {quarantined.quarantined.map((q: any) => (
                          <div
                            key={q.id}
                            className="border rounded-lg p-3 text-sm space-y-2"
                            data-testid={`quarantine-row-${q.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] uppercase">{q.tier}</Badge>
                                <span className="font-medium text-xs">{q.exam}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-7 gap-1"
                                onClick={() => unquarantineMutation.mutate(q.id)}
                                disabled={unquarantineMutation.isPending}
                                data-testid={`button-unquarantine-${q.id}`}
                              >
                                <CheckCircle className="w-3 h-3" />
                                Restore
                              </Button>
                            </div>
                            <p className="text-xs line-clamp-2">{q.stem}</p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              <span>Reason: {q.quarantine_reason}</span>
                              <span>{new Date(q.quarantined_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  testId,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={color}>{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
