import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertTriangle, Search, Filter, ArrowLeft } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface ReviewEntry {
  id: string;
  originalTopic: string;
  originalSystem: string;
  suggestedTopic: string;
  suggestedSystem: string;
  confidence: number;
  matchMethod: string;
  bodySystem: string;
  tier: string;
  generationId: string;
  status: string;
  resolvedTopic: string;
  resolvedSystem: string;
  resolvedBy: string;
  resolvedAt: string;
  createdAt: string;
}

interface TaxonomyRegistry {
  tiers: string[];
  bodySystems: string[];
  topicsBySystem: Record<string, string[]>;
  totalTopics: number;
}

export default function AdminTaxonomyReview() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [systemFilter, setSystemFilter] = useState("all");
  const [testTopic, setTestTopic] = useState("");
  const [testSystem, setTestSystem] = useState("Multi-system");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ["/api/admin/taxonomy/review-queue", statusFilter, systemFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      if (systemFilter && systemFilter !== "all") params.set("system", systemFilter);
      const res = await apiRequest("GET", `/api/admin/taxonomy/review-queue?${params}`);
      return res.json();
    },
  });

  const { data: registryData } = useQuery<TaxonomyRegistry>({
    queryKey: ["/api/admin/taxonomy/registry"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/taxonomy/registry");
      return res.json();
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["/api/admin/taxonomy/review-queue/stats"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/taxonomy/review-queue/stats");
      return res.json();
    },
  });

  const { data: testResult, mutate: runTest } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/taxonomy/test-normalize", { topic: testTopic, system: testSystem });
      return res.json();
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolvedTopic, resolvedSystem }: { id: string; resolvedTopic: string; resolvedSystem: string }) => {
      const res = await apiRequest("POST", `/api/admin/taxonomy/review-queue/${id}/resolve`, {
        resolvedTopic,
        resolvedSystem,
        resolvedBy: "admin",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxonomy/review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxonomy/review-queue/stats"] });
      toast({ title: "Entry resolved" });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/taxonomy/review-queue/${id}/dismiss`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxonomy/review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxonomy/review-queue/stats"] });
      toast({ title: "Entry dismissed" });
    },
  });

  const entries: ReviewEntry[] = queueData?.entries || [];
  const stats = statsData?.stats || {};
  const bodySystems = registryData?.bodySystems || [];

  function confidenceBadge(confidence: number) {
    if (confidence >= 0.8) return <Badge variant="default" className="bg-green-600" data-testid="badge-confidence-high">{(confidence * 100).toFixed(0)}%</Badge>;
    if (confidence >= 0.5) return <Badge variant="secondary" className="bg-yellow-500 text-black" data-testid="badge-confidence-medium">{(confidence * 100).toFixed(0)}%</Badge>;
    return <Badge variant="destructive" data-testid="badge-confidence-low">{(confidence * 100).toFixed(0)}%</Badge>;
  }

  function methodBadge(method: string) {
    const colors: Record<string, string> = {
      exact: "bg-green-100 text-green-800",
      synonym: "bg-blue-100 text-blue-800",
      fuzzy: "bg-yellow-100 text-yellow-800",
      fallback: "bg-red-100 text-red-800",
    };
    return <Badge className={colors[method] || "bg-gray-100 text-gray-800"} data-testid={`badge-method-${method}`}>{method}</Badge>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl" data-testid="page-taxonomy-review">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminTaxonomyReview.taxonomyReviewQueue")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card data-testid="card-stat-pending">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</div>
            <div className="text-sm text-muted-foreground">{t("pages.adminTaxonomyReview.pending")}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-resolved">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved || 0}</div>
            <div className="text-sm text-muted-foreground">{t("pages.adminTaxonomyReview.resolved")}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-dismissed">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.dismissed || 0}</div>
            <div className="text-sm text-muted-foreground">{t("pages.adminTaxonomyReview.dismissed")}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-topics">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{registryData?.totalTopics || 0}</div>
            <div className="text-sm text-muted-foreground">{t("pages.adminTaxonomyReview.canonicalTopics")}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-4 h-4" /> Test Normalization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">{t("pages.adminTaxonomyReview.topic")}</label>
              <Input
                value={testTopic}
                onChange={(e) => setTestTopic(e.target.value)}
                placeholder="e.g., heart attack, AKI, DKA"
                data-testid="input-test-topic"
              />
            </div>
            <div className="w-[180px]">
              <label className="text-sm font-medium mb-1 block">{t("pages.adminTaxonomyReview.system")}</label>
              <Select value={testSystem} onValueChange={setTestSystem}>
                <SelectTrigger data-testid="select-test-system">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bodySystems.map((s: string) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => runTest()} data-testid="button-test-normalize">{t("pages.adminTaxonomyReview.test")}</Button>
          </div>
          {(testResult as any)?.result && (
            <div className="mt-3 p-3 bg-muted rounded-md text-sm" data-testid="text-test-result">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>{t("pages.adminTaxonomyReview.canonicalSystem")}</strong> {(testResult as any).result.canonicalSystem}</div>
                <div><strong>{t("pages.adminTaxonomyReview.canonicalTopic")}</strong> {(testResult as any).result.canonicalTopic}</div>
                <div><strong>{t("pages.adminTaxonomyReview.confidence")}</strong> {((testResult as any).result.confidence * 100).toFixed(1)}%</div>
                <div><strong>{t("pages.adminTaxonomyReview.method")}</strong> {(testResult as any).result.method}</div>
                <div><strong>{t("pages.adminTaxonomyReview.fallback")}</strong> {(testResult as any).result.fallbackApplied ? "Yes" : "No"}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-4 h-4" /> Review Queue ({entries.length})
            </CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]" data-testid="select-status-filter">
                  <SelectValue placeholder={t("pages.adminTaxonomyReview.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t("pages.adminTaxonomyReview.pending2")}</SelectItem>
                  <SelectItem value="resolved">{t("pages.adminTaxonomyReview.resolved2")}</SelectItem>
                  <SelectItem value="dismissed">{t("pages.adminTaxonomyReview.dismissed2")}</SelectItem>
                  <SelectItem value="all">{t("pages.adminTaxonomyReview.all")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-[150px]" data-testid="select-system-filter">
                  <SelectValue placeholder={t("pages.adminTaxonomyReview.allSystems2")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("pages.adminTaxonomyReview.allSystems")}</SelectItem>
                  {bodySystems.map((s: string) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {queueLoading ? (
            <div className="text-center py-8 text-muted-foreground">{t("pages.adminTaxonomyReview.loading")}</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-empty-queue">
              No entries found
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  data-testid={`card-review-entry-${entry.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {methodBadge(entry.matchMethod || "unknown")}
                        {confidenceBadge(entry.confidence || 0)}
                        <Badge variant="outline" data-testid={`badge-status-${entry.status}`}>
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">{t("pages.adminTaxonomyReview.original")}</span>{" "}
                          <span data-testid="text-original-topic">{entry.originalTopic || "N/A"}</span>
                          {entry.originalSystem && (
                            <span className="text-muted-foreground"> ({entry.originalSystem})</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">{t("pages.adminTaxonomyReview.suggested")}</span>{" "}
                          <span data-testid="text-suggested-topic">{entry.suggestedTopic || "N/A"}</span>
                          {entry.suggestedSystem && (
                            <span className="text-muted-foreground"> ({entry.suggestedSystem})</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {entry.createdAt && new Date(entry.createdAt).toLocaleString()}
                        {entry.generationId && <span> | Gen: {entry.generationId.substring(0, 8)}...</span>}
                      </div>
                    </div>
                    {entry.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            resolveMutation.mutate({
                              id: entry.id,
                              resolvedTopic: entry.suggestedTopic,
                              resolvedSystem: entry.suggestedSystem,
                            })
                          }
                          data-testid={`button-approve-${entry.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissMutation.mutate(entry.id)}
                          data-testid={`button-dismiss-${entry.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Dismiss
                        </Button>
                      </div>
                    )}
                    {entry.status === "resolved" && (
                      <div className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{entry.resolvedTopic} ({entry.resolvedSystem})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {registryData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminTaxonomyReview.canonicalTaxonomyOverview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bodySystems.map((system: string) => (
                <div key={system} className="border rounded-lg p-3" data-testid={`card-system-${system}`}>
                  <h3 className="font-semibold text-sm mb-2">{system}</h3>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {(registryData.topicsBySystem[system] || []).map((topic: string) => (
                      <div key={topic}>{topic}</div>
                    ))}
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
