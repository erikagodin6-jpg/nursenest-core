import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, CheckCircle, XCircle, Clock, AlertTriangle, Loader2, BarChart3 } from "lucide-react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const colors: Record<string, string> = {
    queued: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    partial: "bg-orange-100 text-orange-800",
    approved: "bg-green-100 text-green-800",
    needs_review: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
    published: "bg-emerald-100 text-emerald-800",
    pass: "bg-green-100 text-green-800",
    pass_with_edits: "bg-yellow-100 text-yellow-800",
    fail: "bg-red-100 text-red-800",
    needs_human_review: "bg-orange-100 text-orange-800",
  };
  return <Badge className={colors[status] || "bg-gray-100 text-gray-800"} data-testid={`badge-status-${status}`}>{status.replace(/_/g, " ")}</Badge>;
}

function ProgressBar({ current, threshold }: { current: number; threshold: number }) {
  const pct = Math.min((current / threshold) * 100, 100);
  const color = pct >= 100 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-yellow-500";
  return (
    <div className="w-full bg-gray-200 rounded-full h-3" data-testid="progress-bar">
      <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function OverviewTab() {
  const { data: status, isLoading } = useQuery({
    queryKey: ["/api/admin/pipeline/status"],
    queryFn: () => fetch("/api/admin/pipeline/status", { credentials: "include" }).then(r => r.json()),
    refetchInterval: 30000,
  });

  const [runTier, setRunTier] = useState("rpn");
  const [runType, setRunType] = useState("exam_questions");
  const [runCount, setRunCount] = useState("5");
  const queryClient = useQueryClient();

  const runMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/pipeline/run", {
        tier: runTier,
        contentType: runType,
        count: parseInt(runCount),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pipeline/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pipeline/jobs"] });
    },
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminPipelineDashboard.loadingPipelineStatus")}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {status?.banks?.map((bank: any) => (
          <Card key={`${bank.tier}-${bank.contentType}`} data-testid={`card-bank-${bank.tier}-${bank.contentType}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{bank.tier.toUpperCase()} — {bank.contentType === "exam_questions" ? "Questions" : "Flashcards"}</span>
                <StatusBadge status={bank.mode} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{bank.currentCount.toLocaleString()} / {status.threshold.toLocaleString()}</span>
                  <span className="text-muted-foreground">{bank.rate}/day</span>
                </div>
                <ProgressBar current={bank.currentCount} threshold={status.threshold} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card data-testid="card-manual-run">
        <CardHeader>
          <CardTitle className="text-lg">{t("pages.adminPipelineDashboard.manualGenerationRun")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">{t("pages.adminPipelineDashboard.tier")}</label>
              <Select value={runTier} onValueChange={setRunTier}>
                <SelectTrigger className="w-32" data-testid="select-tier"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rpn">RPN</SelectItem>
                  <SelectItem value="rn">RN</SelectItem>
                  <SelectItem value="np">NP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">{t("pages.adminPipelineDashboard.contentType")}</label>
              <Select value={runType} onValueChange={setRunType}>
                <SelectTrigger className="w-48" data-testid="select-content-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam_questions">{t("pages.adminPipelineDashboard.examQuestions")}</SelectItem>
                  <SelectItem value="flashcards">{t("pages.adminPipelineDashboard.flashcards")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">{t("pages.adminPipelineDashboard.countMax50")}</label>
              <Input
                type="number"
                min="1"
                max="50"
                value={runCount}
                onChange={(e) => setRunCount(e.target.value)}
                className="w-24"
                data-testid="input-run-count"
              />
            </div>
            <Button
              onClick={() => runMutation.mutate()}
              disabled={runMutation.isPending}
              data-testid="button-run-pipeline"
            >
              {runMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminPipelineDashboard.running")}</> : <><Play className="mr-2 h-4 w-4" /> {t("pages.adminPipelineDashboard.runNow")}</>}
            </Button>
          </div>
          {runMutation.isSuccess && (
            <p className="mt-3 text-sm text-green-600" data-testid="text-run-result">
              Generated {(runMutation.data as any)?.generated || 0} items ({(runMutation.data as any)?.failed || 0} failed)
            </p>
          )}
          {runMutation.isError && (
            <p className="mt-3 text-sm text-red-600">Error: {(runMutation.error as any)?.message}</p>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <Clock className="inline h-4 w-4 mr-1" /> Next scheduled run: {status?.nextScheduledRun} | Today's jobs: {status?.todayJobCount}
      </div>
    </div>
  );
}

function QuestionReviewTab() {
  const [tier, setTier] = useState("all");
  const [statusFilter, setStatusFilter] = useState("needs_review");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (tier !== "all") params.set("tier", tier);
  if (statusFilter !== "all") params.set("status", statusFilter);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/qbank/review", tier, statusFilter],
    queryFn: () => fetch(`/api/admin/qbank/review?${params}`, { credentials: "include" }).then(r => r.json()),
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/qbank/${id}/approve`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/review"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/qbank/${id}/reject`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/review"] }),
  });

  const bulkApproveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/qbank/bulk-approve", { ids: Array.from(selected) });
      return res.json();
    },
    onSuccess: () => {
      setSelected(new Set());
      queryClient.invalidateQueries({ queryKey: ["/api/admin/qbank/review"] });
    },
  });

  const items = data?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="w-32" data-testid="select-review-tier"><SelectValue placeholder={t("pages.adminPipelineDashboard.tier2")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminPipelineDashboard.allTiers")}</SelectItem>
            <SelectItem value="rpn">RPN</SelectItem>
            <SelectItem value="rn">RN</SelectItem>
            <SelectItem value="np">NP</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-review-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminPipelineDashboard.allStatus")}</SelectItem>
            <SelectItem value="needs_review">{t("pages.adminPipelineDashboard.needsReview")}</SelectItem>
            <SelectItem value="approved">{t("pages.adminPipelineDashboard.approved")}</SelectItem>
            <SelectItem value="rejected">{t("pages.adminPipelineDashboard.rejected")}</SelectItem>
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkApproveMutation.mutate()}
            disabled={bulkApproveMutation.isPending}
            data-testid="button-bulk-approve-questions"
          >
            <CheckCircle className="mr-1 h-4 w-4" /> Bulk Approve ({selected.size}) — pass only
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{data?.total || 0} pending review</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminPipelineDashboard.loading")}</div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminPipelineDashboard.noItemsToReview")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((q: any) => (
            <Card key={q.id} className="border" data-testid={`card-question-${q.id}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(q.id)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      e.target.checked ? next.add(q.id) : next.delete(q.id);
                      setSelected(next);
                    }}
                    className="mt-1"
                    data-testid={`checkbox-question-${q.id}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline">{q.tier?.toUpperCase()}</Badge>
                      <Badge variant="outline">{q.bodySystem || q.body_system}</Badge>
                      <StatusBadge status={q.status} />
                      {q.verdict && <StatusBadge status={q.verdict} />}
                      {q.confidenceScore != null && (
                        <span className="text-xs text-muted-foreground">
                          conf: {(q.confidenceScore * 100 || q.confidence_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-1">{q.stem}</p>
                    {q.options && (
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {(Array.isArray(q.options) ? q.options : []).map((opt: any, i: number) => (
                          <div key={i}>{typeof opt === "string" ? opt : `${opt.label || String.fromCharCode(65 + i)}) ${opt.text || opt}`}</div>
                        ))}
                      </div>
                    )}
                    {q.rationale && <p className="text-xs text-muted-foreground mt-1 italic">{q.rationale}</p>}
                    {q.issuesJson?.length > 0 && (
                      <div className="mt-1 text-xs text-red-600">
                        <AlertTriangle className="inline h-3 w-3 mr-1" />
                        {(q.issuesJson || q.issues_json || []).join("; ")}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600"
                      onClick={() => approveMutation.mutate(q.id)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${q.id}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => rejectMutation.mutate(q.id)}
                      disabled={rejectMutation.isPending}
                      data-testid={`button-reject-${q.id}`}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FlashcardReviewTab() {
  const [tier, setTier] = useState("all");
  const [statusFilter, setStatusFilter] = useState("needs_review");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const params = new URLSearchParams();
  if (tier !== "all") params.set("tier", tier);
  if (statusFilter !== "all") params.set("status", statusFilter);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/flashcard-bank/review", tier, statusFilter],
    queryFn: () => fetch(`/api/admin/flashcard-bank/review?${params}`, { credentials: "include" }).then(r => r.json()),
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/flashcard-bank/${id}/approve`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/flashcard-bank/review"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/flashcard-bank/${id}/reject`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/flashcard-bank/review"] }),
  });

  const bulkApproveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/flashcard-bank/bulk-approve", { ids: Array.from(selected) });
      return res.json();
    },
    onSuccess: () => {
      setSelected(new Set());
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flashcard-bank/review"] });
    },
  });

  const items = data?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="w-32" data-testid="select-flashcard-tier"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminPipelineDashboard.allTiers2")}</SelectItem>
            <SelectItem value="rpn">RPN</SelectItem>
            <SelectItem value="rn">RN</SelectItem>
            <SelectItem value="np">NP</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-flashcard-status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminPipelineDashboard.allStatus2")}</SelectItem>
            <SelectItem value="needs_review">{t("pages.adminPipelineDashboard.needsReview2")}</SelectItem>
            <SelectItem value="approved">{t("pages.adminPipelineDashboard.approved2")}</SelectItem>
            <SelectItem value="rejected">{t("pages.adminPipelineDashboard.rejected2")}</SelectItem>
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkApproveMutation.mutate()}
            disabled={bulkApproveMutation.isPending}
            data-testid="button-bulk-approve-flashcards"
          >
            <CheckCircle className="mr-1 h-4 w-4" /> Bulk Approve ({selected.size})
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">{data?.total || 0} pending</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminPipelineDashboard.loading2")}</div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminPipelineDashboard.noFlashcardsToReview")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((f: any) => (
            <Card key={f.id} data-testid={`card-flashcard-${f.id}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(f.id)}
                    onChange={(e) => {
                      const next = new Set(selected);
                      e.target.checked ? next.add(f.id) : next.delete(f.id);
                      setSelected(next);
                    }}
                    className="mt-1"
                    data-testid={`checkbox-flashcard-${f.id}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{f.tier?.toUpperCase()}</Badge>
                      <Badge variant="outline">{f.topicTag || f.topic_tag}</Badge>
                      <StatusBadge status={f.status} />
                      {f.verdict && <StatusBadge status={f.verdict} />}
                    </div>
                    <p className="text-sm font-semibold">{f.front}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.back}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="text-green-600" onClick={() => approveMutation.mutate(f.id)} data-testid={`button-approve-fc-${f.id}`}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => rejectMutation.mutate(f.id)} data-testid={`button-reject-fc-${f.id}`}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function JobHistoryTab() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/admin/pipeline/jobs"],
    queryFn: () => fetch("/api/admin/pipeline/jobs?limit=100", { credentials: "include" }).then(r => r.json()),
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminPipelineDashboard.loading3")}</div>;

  return (
    <div className="space-y-3">
      {(!jobs || jobs.length === 0) ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminPipelineDashboard.noGenerationJobsYet")}</p>
      ) : (
        jobs.map((j: any) => (
          <Card key={j.id} data-testid={`card-job-${j.id}`}>
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{j.tier?.toUpperCase()}</Badge>
                  <Badge variant="outline">{j.contentType === "exam_questions" ? "Questions" : "Flashcards"}</Badge>
                  <StatusBadge status={j.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {j.generatedCount}/{j.targetCount} generated | {j.mode?.replace(/_/g, " ")} | {j.runDate}
                </div>
              </div>
              {j.topicPlanJson && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {(Array.isArray(j.topicPlanJson) ? j.topicPlanJson : []).map((t: any, i: number) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.system}: {t.count}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default function AdminPipelineDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-back-admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-pipeline-title">
              <BarChart3 className="h-6 w-6" /> Content Pipeline
            </h1>
            <p className="text-sm text-muted-foreground">{t("pages.adminPipelineDashboard.aipoweredExamQuestionAndFlashcard")}</p>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4" data-testid="tabs-pipeline">
            <TabsTrigger value="overview" data-testid="tab-overview">{t("pages.adminPipelineDashboard.overview")}</TabsTrigger>
            <TabsTrigger value="questions" data-testid="tab-questions">{t("pages.adminPipelineDashboard.questionReview")}</TabsTrigger>
            <TabsTrigger value="flashcards" data-testid="tab-flashcards">{t("pages.adminPipelineDashboard.flashcardReview")}</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">{t("pages.adminPipelineDashboard.jobHistory")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="questions"><QuestionReviewTab /></TabsContent>
          <TabsContent value="flashcards"><FlashcardReviewTab /></TabsContent>
          <TabsContent value="history"><JobHistoryTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
