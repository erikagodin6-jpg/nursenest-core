import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Play, CheckCircle, XCircle, Clock, AlertTriangle,
  Loader2, BarChart3, Database, FileText, Power, Plus, Settings,
  Zap, Search, Image, Calendar, Mail, TrendingUp, BookOpen,
  Share2, Expand, Eye, Trash2, RefreshCw, PauseCircle
} from "lucide-react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const colors: Record<string, string> = {
    queued: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    draft: "bg-gray-100 text-gray-800",
    pending_review: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    published: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-orange-100 text-orange-800",
    validation_failed: "bg-orange-100 text-orange-800",
  };
  return (
    <Badge className={colors[status] || "bg-gray-100 text-gray-800"} data-testid={`badge-status-${status}`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function OverviewTab() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/stats"],
    queryFn: () => adminFetch("/api/admin/autopilot/stats").then(r => r.json()),
    refetchInterval: 30000,
  });

  const { data: engines } = useQuery({
    queryKey: ["/api/admin/autopilot/engines"],
    queryFn: () => adminFetch("/api/admin/autopilot/engines").then(r => r.json()),
  });

  const { data: recentJobs } = useQuery({
    queryKey: ["/api/admin/autopilot/jobs", "recent"],
    queryFn: () => adminFetch("/api/admin/autopilot/jobs?limit=5").then(r => r.json()),
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingOverview")}</div>;

  const engineList = Array.isArray(engines) ? engines : engines?.engines || [];
  const jobList = Array.isArray(recentJobs) ? recentJobs : recentJobs?.jobs || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="stat-total-engines">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold">{stats?.totalEngines || engineList.length || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.totalEngines")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-active-engines">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.activeEngines || engineList.filter((e: any) => e.enabled).length || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.activeEngines")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-total-jobs">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.totalJobs")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-queue-size">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.queueSize || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.inQueue")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {engineList.map((engine: any) => (
          <Card key={engine.engineKey || engine.id} data-testid={`card-engine-${engine.engineKey}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{engine.name || engine.engineKey}</h3>
                <Badge variant={engine.enabled ? "default" : "outline"} className={engine.enabled ? "bg-green-100 text-green-800" : ""}>
                  {engine.enabled ? "On" : "Off"}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mb-2">{engine.description || "No description"}</p>
              {engine.lastRunAt && (
                <p className="text-xs text-gray-400">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Last run: {new Date(engine.lastRunAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {jobList.length > 0 && (
        <Card data-testid="card-recent-jobs">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminAutopilot.recentJobs")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jobList.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`row-job-${job.id}`}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{job.engineKey}</Badge>
                    <StatusBadge status={job.status} />
                  </div>
                  <span className="text-xs text-gray-400">
                    {job.createdAt ? new Date(job.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SchedulesTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [newEngineKey, setNewEngineKey] = useState("");
  const [newFrequency, setNewFrequency] = useState("daily");
  const [newCron, setNewCron] = useState("0 6 * * *");

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/schedules"],
    queryFn: () => adminFetch("/api/admin/autopilot/schedules").then(r => r.json()),
  });

  const { data: engines } = useQuery({
    queryKey: ["/api/admin/autopilot/engines"],
    queryFn: () => adminFetch("/api/admin/autopilot/engines").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/schedules", {
        method: "POST",
        body: { engineKey: newEngineKey, frequency: newFrequency, cronExpression: newCron, enabled: true },
      });
      if (!res.ok) throw new Error("Failed to create schedule");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/schedules"] });
      setNewEngineKey("");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/autopilot/schedules/${id}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error("Toggle failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/schedules"] }),
  });

  const scheduleList = Array.isArray(schedules) ? schedules : schedules?.schedules || [];
  const engineList = Array.isArray(engines) ? engines : engines?.engines || [];

  return (
    <div className="space-y-6">
      <Card data-testid="card-create-schedule">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.engine")}</Label>
              <Select value={newEngineKey} onValueChange={setNewEngineKey} data-testid="select-schedule-engine">
                <SelectTrigger className="w-48" data-testid="select-schedule-engine-trigger">
                  <SelectValue placeholder={t("pages.adminAutopilot.selectEngine")} />
                </SelectTrigger>
                <SelectContent>
                  {engineList.map((e: any) => (
                    <SelectItem key={e.engineKey} value={e.engineKey}>{e.name || e.engineKey}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.frequency")}</Label>
              <Select value={newFrequency} onValueChange={setNewFrequency} data-testid="select-schedule-frequency">
                <SelectTrigger className="w-36" data-testid="select-schedule-frequency-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t("pages.adminAutopilot.daily")}</SelectItem>
                  <SelectItem value="weekly">{t("pages.adminAutopilot.weekly")}</SelectItem>
                  <SelectItem value="custom">{t("pages.adminAutopilot.custom")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.cronExpression")}</Label>
              <Input
                value={newCron}
                onChange={(e) => setNewCron(e.target.value)}
                className="w-40"
                placeholder={t("pages.admin_autopilot.06")}
                data-testid="input-schedule-cron"
              />
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newEngineKey || createMutation.isPending}
              data-testid="button-create-schedule"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingSchedules")}</div>
      ) : scheduleList.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminAutopilot.noSchedulesConfigured")}</p>
      ) : (
        <div className="space-y-2">
          {scheduleList.map((sched: any) => (
            <Card key={sched.id} data-testid={`card-schedule-${sched.id}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{sched.engineKey}</Badge>
                    <span className="text-sm">{sched.frequency}</span>
                    <span className="text-xs text-gray-400 font-mono">{sched.cronExpression}</span>
                    <StatusBadge status={sched.enabled ? "active" : "paused"} />
                  </div>
                  <div className="flex items-center gap-2">
                    {sched.nextRunAt && (
                      <span className="text-xs text-gray-400">
                        Next: {new Date(sched.nextRunAt).toLocaleString()}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleMutation.mutate(sched.id)}
                      data-testid={`button-toggle-schedule-${sched.id}`}
                    >
                      <Power className="h-4 w-4" />
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

function PublishingQueueTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending_review");

  const { data: queue, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/queue", statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      return adminFetch(`/api/admin/autopilot/queue?${params}`).then(r => r.json());
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const res = await adminFetch(`/api/admin/autopilot/queue/${id}/${action}`, { method: "POST" });
      if (!res.ok) throw new Error(`${action} failed`);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue"] }),
  });

  const items = Array.isArray(queue) ? queue : queue?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter} data-testid="select-queue-status">
          <SelectTrigger className="w-44" data-testid="select-queue-status-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("pages.adminAutopilot.all")}</SelectItem>
            <SelectItem value="draft">{t("pages.adminAutopilot.draft")}</SelectItem>
            <SelectItem value="pending_review">{t("pages.adminAutopilot.pendingReview")}</SelectItem>
            <SelectItem value="approved">{t("pages.adminAutopilot.approved")}</SelectItem>
            <SelectItem value="published">{t("pages.adminAutopilot.published")}</SelectItem>
            <SelectItem value="rejected">{t("pages.adminAutopilot.rejected")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">{items.length} items</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingQueue")}</div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminAutopilot.noItemsInQueue")}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <Card key={item.id} data-testid={`card-queue-${item.id}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{item.contentType}</Badge>
                      <Badge variant="outline">{item.engineKey}</Badge>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm font-medium truncate">{item.title || "Untitled"}</p>
                    <p className="text-xs text-gray-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {item.previewUrl && (
                      <Button size="sm" variant="ghost" asChild data-testid={`button-preview-${item.id}`}>
                        <a href={item.previewUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {(item.status === "pending_review" || item.status === "draft") && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600"
                          onClick={() => actionMutation.mutate({ id: item.id, action: "approve" })}
                          disabled={actionMutation.isPending}
                          data-testid={`button-approve-queue-${item.id}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => actionMutation.mutate({ id: item.id, action: "reject" })}
                          disabled={actionMutation.isPending}
                          data-testid={`button-reject-queue-${item.id}`}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {item.status === "approved" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => actionMutation.mutate({ id: item.id, action: "publish" })}
                        disabled={actionMutation.isPending}
                        data-testid={`button-publish-queue-${item.id}`}
                      >
                        Publish
                      </Button>
                    )}
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

function KeywordDiscoveryTab() {
  const { t } = useI18n();
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchKeywords = async () => {
    setIsSearching(true);
    try {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "keyword_discovery",
          payload: { keywords: keywords.split("\n").filter(k => k.trim()) },
        },
      });
      const data = await res.json();
      setResults(data?.result?.clusters || []);
    } catch {
      setResults([]);
    }
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <Card data-testid="card-keyword-input">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" /> Keyword Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.enterKeywordsOnePerLine")}</Label>
            <Textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={"NCLEX practice questions\nnursing exam prep\nRPN study guide"}
              rows={5}
              data-testid="textarea-keywords"
            />
          </div>
          <Button
            onClick={searchKeywords}
            disabled={isSearching || !keywords.trim()}
            data-testid="button-search-keywords"
          >
            {isSearching ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.analyzing")}</> : <><Search className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.analyzeKeywords")}</>}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card data-testid="card-keyword-results">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminAutopilot.keywordClusters")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((cluster: any, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg" data-testid={`row-cluster-${i}`}>
                  <h4 className="font-medium text-sm">{cluster.topic || cluster.keyword}</h4>
                  <p className="text-xs text-gray-500">Volume: {cluster.volume || "N/A"} | Difficulty: {cluster.difficulty || "N/A"}</p>
                  {cluster.related && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cluster.related.map((r: string, j: number) => (
                        <Badge key={j} variant="outline" className="text-xs">{r}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BlogEngineTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [contentType, setContentType] = useState<"nursing" | "allied_health" | "new_grad">("nursing");
  const [topic, setTopic] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [examType, setExamType] = useState("nclex-rn");
  const [career, setCareer] = useState("pharmacy_tech");
  const [wordCount, setWordCount] = useState("2000");

  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        topic,
        targetKeyword,
        wordCount: parseInt(wordCount),
      };
      if (contentType === "allied_health") {
        payload.contentType = "allied_health";
        payload.career = career;
      } else if (contentType === "new_grad") {
        payload.contentType = "new_grad";
      } else {
        payload.examType = examType;
      }
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "blog_engine",
          payload,
        },
      });
      if (!res.ok) throw new Error("Page generation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
      setTopic("");
      setTargetKeyword("");
    },
  });

  const { data: blogJobs } = useQuery({
    queryKey: ["/api/admin/autopilot/jobs", "blog_engine"],
    queryFn: () => adminFetch("/api/admin/autopilot/jobs?engineKey=blog_engine&limit=10").then(r => r.json()),
    refetchInterval: generateMutation.isPending ? 5000 : 30000,
  });

  const recentRuns = Array.isArray(blogJobs) ? blogJobs : blogJobs?.jobs || [];

  const isNursing = contentType === "nursing";
  const isAllied = contentType === "allied_health";
  const isNewGrad = contentType === "new_grad";

  const descriptions: Record<string, string> = {
    nursing: "Generates 1500-2500 word nursing study pages with clinical assessment, nursing interventions, tables, exam traps, clinical pearls, 10+ practice questions with rationales, and SEO metadata.",
    allied_health: "Generates 1500-2200 word allied health study pages with role scope, clinical workflows, safety considerations, exam traps, clinical pearls, 10+ practice questions with rationales, and SEO metadata.",
    new_grad: "Generates 1200-2000 word new graduate nurse resources with step-by-step guidance, common mistakes, clinical tips from experienced nurses, quick reference checklists, and SEO metadata.",
  };

  const placeholders: Record<string, { topic: string; keyword: string }> = {
    nursing: { topic: "e.g., Understanding Cardiac Assessment", keyword: "e.g., cardiac assessment nursing" },
    allied_health: { topic: "e.g., Order of Draw for Blood Collection", keyword: "e.g., order of draw phlebotomy" },
    new_grad: { topic: "e.g., Time Management for New Graduate Nurses", keyword: "e.g., new nurse time management tips" },
  };

  return (
    <div className="space-y-6">
      <Card data-testid="card-blog-engine">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> Study Page Generator
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            {descriptions[contentType]} Content is queued for review before publishing.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.contentType")}</Label>
            <div className="flex gap-2">
              <Button
                variant={isNursing ? "default" : "outline"}
                size="sm"
                onClick={() => { setContentType("nursing"); setWordCount("2000"); }}
                data-testid="button-content-type-nursing"
              >
                Nursing
              </Button>
              <Button
                variant={isAllied ? "default" : "outline"}
                size="sm"
                onClick={() => { setContentType("allied_health"); setWordCount("1800"); }}
                data-testid="button-content-type-allied"
              >
                Allied Health
              </Button>
              <Button
                variant={isNewGrad ? "default" : "outline"}
                size="sm"
                onClick={() => { setContentType("new_grad"); setWordCount("1500"); }}
                data-testid="button-content-type-newgrad"
              >
                New Grad
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.pageTopic")}</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={placeholders[contentType]?.topic}
                data-testid="input-blog-topic"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.targetSeoKeyword")}</Label>
              <Input
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder={placeholders[contentType]?.keyword}
                data-testid="input-blog-keyword"
              />
            </div>
            {isNursing && (
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.primaryExam")}</Label>
                <Select value={examType} onValueChange={setExamType} data-testid="select-blog-exam">
                  <SelectTrigger data-testid="select-blog-exam-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nclex-rn">{t("pages.adminAutopilot.nclexrn")}</SelectItem>
                    <SelectItem value="nclex-pn">{t("pages.adminAutopilot.nclexpn")}</SelectItem>
                    <SelectItem value="rex-pn">{t("pages.adminAutopilot.rexpn")}</SelectItem>
                    <SelectItem value="cnpe">CNPE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {isAllied && (
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.careerCertification")}</Label>
                <Select value={career} onValueChange={setCareer} data-testid="select-blog-career">
                  <SelectTrigger data-testid="select-blog-career-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacy_tech">{t("pages.adminAutopilot.pharmacyTechnicianPtcbexcpt")}</SelectItem>
                    <SelectItem value="respiratory_therapy">{t("pages.adminAutopilot.respiratoryTherapyRrttmc")}</SelectItem>
                    <SelectItem value="paramedic_ems">{t("pages.adminAutopilot.paramedicEmsNremt")}</SelectItem>
                    <SelectItem value="mlt">{t("pages.adminAutopilot.medicalLabTechnologistMltascp")}</SelectItem>
                    <SelectItem value="radiology">{t("pages.adminAutopilot.medicalImagingRadiologyArrt")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.targetWordCount")}</Label>
              <Input
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                min="1500"
                max="3000"
                data-testid="input-blog-word-count"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !topic.trim()}
              data-testid="button-generate-blog"
            >
              {generateMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generating3060s")}</> : <><Play className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generateStudyPage")}</>}
            </Button>
            {generateMutation.isSuccess && (
              <p className="text-sm text-green-600" data-testid="text-blog-success">
                <CheckCircle className="inline h-4 w-4 mr-1" />
                {isNursing ? "Nursing" : "Allied health"} study page generated and sent to Publishing Queue for review
              </p>
            )}
            {generateMutation.isError && (
              <p className="text-sm text-red-600" data-testid="text-blog-error">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                {(generateMutation.error as Error).message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {recentRuns.length > 0 && (
        <Card data-testid="card-blog-history">
          <CardHeader>
            <CardTitle className="text-sm">{t("pages.adminAutopilot.recentPageGenerations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRuns.map((run: any) => (
                <div key={run.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" data-testid={`row-blog-run-${run.id}`}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={run.status} />
                    <span className="text-xs truncate max-w-[200px]">{run.payload?.topic || "Untitled"}</span>
                    {run.result?.questionCount && (
                      <Badge variant="outline" className="text-xs">{run.result.questionCount}Q</Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {run.createdAt ? new Date(run.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PracticeSEOTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [practiceTitle, setPracticeTitle] = useState("");
  const [bodySystem, setBodySystem] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [tier, setTier] = useState("rn");

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "practice_seo",
          payload: { title: practiceTitle, bodySystem, questionCount: parseInt(questionCount), tier },
        },
      });
      if (!res.ok) throw new Error("Practice page generation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue"] });
    },
  });

  return (
    <div className="space-y-6">
      <Card data-testid="card-practice-seo">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Practice Page SEO Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.pageTitle")}</Label>
              <Input
                value={practiceTitle}
                onChange={(e) => setPracticeTitle(e.target.value)}
                placeholder="e.g., Free Cardiac Practice Questions"
                data-testid="input-practice-title"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.bodySystem")}</Label>
              <Select value={bodySystem} onValueChange={setBodySystem} data-testid="select-practice-system">
                <SelectTrigger data-testid="select-practice-system-trigger">
                  <SelectValue placeholder={t("pages.adminAutopilot.selectSystem")} />
                </SelectTrigger>
                <SelectContent>
                  {["Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal", "Renal", "Endocrine", "Musculoskeletal", "Hematology", "Maternity", "Pediatrics"].map(s => (
                    <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.questionCount")}</Label>
              <Input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                min="5"
                max="50"
                data-testid="input-practice-count"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.tier")}</Label>
              <Select value={tier} onValueChange={setTier} data-testid="select-practice-tier">
                <SelectTrigger data-testid="select-practice-tier-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rpn">RPN</SelectItem>
                  <SelectItem value="rn">RN</SelectItem>
                  <SelectItem value="np">NP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending || !practiceTitle.trim()}
            data-testid="button-generate-practice"
          >
            {generateMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generating")}</> : <><Play className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generatePracticePage")}</>}
          </Button>
          {generateMutation.isSuccess && (
            <p className="text-sm text-green-600" data-testid="text-practice-success">{t("pages.adminAutopilot.practicePageQueuedForReview")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionFactoryTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState("");
  const [batchSize, setBatchSize] = useState("25");
  const [category, setCategory] = useState("nursing_ngn");
  const [difficultyRange, setDifficultyRange] = useState("2-4");
  const [autoValidate, setAutoValidate] = useState(true);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "question_factory",
          payload: { topic, batchSize: parseInt(batchSize), category, difficultyRange, autoValidate },
        },
      });
      if (!res.ok) throw new Error("Question batch generation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue"] });
      setTopic("");
    },
  });

  const { data: factoryStats } = useQuery({
    queryKey: ["/api/admin/autopilot/jobs", "question_factory"],
    queryFn: () => adminFetch("/api/admin/autopilot/jobs?engineKey=question_factory&limit=10").then(r => r.json()),
  });

  const recentRuns = Array.isArray(factoryStats) ? factoryStats : factoryStats?.jobs || [];

  return (
    <div className="space-y-6">
      <Card data-testid="card-question-factory">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" /> Practice Question Page Generator
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Generates 25 exam-style practice questions (MC, SATA, case-based) with 300+ word rationales, clinical scenarios, and SEO metadata. Auto-validates structure before queuing for review.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.questionTopic")}</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Fluid and Electrolyte Imbalances"
              data-testid="input-factory-topic"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.batchSize")}</Label>
              <Select value={batchSize} onValueChange={setBatchSize} data-testid="select-factory-batch">
                <SelectTrigger data-testid="select-factory-batch-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">{t("pages.adminAutopilot.25Questions")}</SelectItem>
                  <SelectItem value="50">{t("pages.adminAutopilot.50Questions")}</SelectItem>
                  <SelectItem value="100">{t("pages.adminAutopilot.100Questions")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.category")}</Label>
              <Select value={category} onValueChange={setCategory} data-testid="select-factory-category">
                <SelectTrigger data-testid="select-factory-category-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nursing_ngn">{t("pages.adminAutopilot.nursingNgn")}</SelectItem>
                  <SelectItem value="allied">{t("pages.adminAutopilot.alliedHealth")}</SelectItem>
                  <SelectItem value="np_canada">{t("pages.adminAutopilot.canadianNp")}</SelectItem>
                  <SelectItem value="np_us">{t("pages.adminAutopilot.usNp")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.difficultyRange")}</Label>
              <Select value={difficultyRange} onValueChange={setDifficultyRange} data-testid="select-factory-difficulty">
                <SelectTrigger data-testid="select-factory-difficulty-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">{t("pages.adminAutopilot.easy12")}</SelectItem>
                  <SelectItem value="2-4">{t("pages.adminAutopilot.medium24")}</SelectItem>
                  <SelectItem value="3-5">{t("pages.adminAutopilot.hard35")}</SelectItem>
                  <SelectItem value="1-5">{t("pages.adminAutopilot.fullRange15")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <div>
                <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.autovalidate")}</Label>
                <Switch
                  checked={autoValidate}
                  onCheckedChange={setAutoValidate}
                  data-testid="switch-factory-validate"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !topic.trim()}
              data-testid="button-generate-questions"
            >
              {generateMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generating3060s2")}</> : <><Zap className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generateQuestionPage")}</>}
            </Button>
            {generateMutation.isSuccess && (
              <p className="text-sm text-green-600" data-testid="text-factory-success">
                <CheckCircle className="inline h-4 w-4 mr-1" />
                25 questions generated and sent to Publishing Queue
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {recentRuns.length > 0 && (
        <Card data-testid="card-factory-history">
          <CardHeader>
            <CardTitle className="text-sm">{t("pages.adminAutopilot.recentFactoryRuns")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRuns.map((run: any) => (
                <div key={run.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" data-testid={`row-factory-run-${run.id}`}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={run.status} />
                    <span className="text-xs text-gray-500">{run.payload?.batchSize || "?"} questions</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {run.createdAt ? new Date(run.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function VisualFactoryTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [diagramType, setDiagramType] = useState("anatomy");
  const [diagramTopic, setDiagramTopic] = useState("");
  const [diagramStyle, setDiagramStyle] = useState("clinical");

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "visual_factory",
          payload: { type: diagramType, topic: diagramTopic, style: diagramStyle },
        },
      });
      if (!res.ok) throw new Error("Diagram generation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
    },
  });

  return (
    <div className="space-y-6">
      <Card data-testid="card-visual-factory">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="h-5 w-5" /> Visual / Diagram Factory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.diagramType")}</Label>
              <Select value={diagramType} onValueChange={setDiagramType} data-testid="select-diagram-type">
                <SelectTrigger data-testid="select-diagram-type-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anatomy">{t("pages.adminAutopilot.anatomy")}</SelectItem>
                  <SelectItem value="pathophysiology">{t("pages.adminAutopilot.pathophysiology")}</SelectItem>
                  <SelectItem value="drug_mechanism">{t("pages.adminAutopilot.drugMechanism")}</SelectItem>
                  <SelectItem value="lab_values">{t("pages.adminAutopilot.labValues")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.topic")}</Label>
              <Input
                value={diagramTopic}
                onChange={(e) => setDiagramTopic(e.target.value)}
                placeholder="e.g., Heart Anatomy"
                data-testid="input-diagram-topic"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.style")}</Label>
              <Select value={diagramStyle} onValueChange={setDiagramStyle} data-testid="select-diagram-style">
                <SelectTrigger data-testid="select-diagram-style-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinical">{t("pages.adminAutopilot.clinical")}</SelectItem>
                  <SelectItem value="educational">{t("pages.adminAutopilot.educational")}</SelectItem>
                  <SelectItem value="infographic">{t("pages.adminAutopilot.infographic")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending || !diagramTopic.trim()}
            data-testid="button-generate-diagram"
          >
            {generateMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generating2")}</> : <><Image className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.generateDiagram")}</>}
          </Button>
          {generateMutation.isSuccess && (
            <p className="text-sm text-green-600" data-testid="text-diagram-success">{t("pages.adminAutopilot.diagramGenerationJobCreated")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PinterestSchedulerTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [pinTitle, setPinTitle] = useState("");
  const [pinBoard, setPinBoard] = useState("nursing-tips");
  const [scheduleDate, setScheduleDate] = useState("");

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "pinterest_scheduler",
          payload: { title: pinTitle, board: pinBoard, scheduledFor: scheduleDate || undefined },
        },
      });
      if (!res.ok) throw new Error("Pin scheduling failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
      setPinTitle("");
    },
  });

  const { data: pinJobs } = useQuery({
    queryKey: ["/api/admin/autopilot/jobs", "pinterest_scheduler"],
    queryFn: () => adminFetch("/api/admin/autopilot/jobs?engineKey=pinterest_scheduler&limit=10").then(r => r.json()),
  });

  const pinList = Array.isArray(pinJobs) ? pinJobs : pinJobs?.jobs || [];

  return (
    <div className="space-y-6">
      <Card data-testid="card-pinterest-scheduler">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Pinterest Pin Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.pinTitle")}</Label>
              <Input
                value={pinTitle}
                onChange={(e) => setPinTitle(e.target.value)}
                placeholder="e.g., 10 Must-Know Cardiac Facts"
                data-testid="input-pin-title"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.board")}</Label>
              <Select value={pinBoard} onValueChange={setPinBoard} data-testid="select-pin-board">
                <SelectTrigger data-testid="select-pin-board-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nursing-tips">{t("pages.adminAutopilot.nursingTips")}</SelectItem>
                  <SelectItem value="exam-prep">{t("pages.adminAutopilot.examPrep")}</SelectItem>
                  <SelectItem value="study-guides">{t("pages.adminAutopilot.studyGuides")}</SelectItem>
                  <SelectItem value="clinical-skills">{t("pages.adminAutopilot.clinicalSkills")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.scheduleDate")}</Label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                data-testid="input-pin-schedule"
              />
            </div>
          </div>
          <Button
            onClick={() => scheduleMutation.mutate()}
            disabled={scheduleMutation.isPending || !pinTitle.trim()}
            data-testid="button-schedule-pin"
          >
            {scheduleMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.scheduling")}</> : <><Calendar className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.schedulePin")}</>}
          </Button>
        </CardContent>
      </Card>

      {pinList.length > 0 && (
        <Card data-testid="card-pin-queue">
          <CardHeader>
            <CardTitle className="text-sm">{t("pages.adminAutopilot.scheduledPins")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pinList.map((pin: any) => (
                <div key={pin.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" data-testid={`row-pin-${pin.id}`}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={pin.status} />
                    <span>{pin.payload?.title || "Untitled"}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {pin.scheduledFor ? new Date(pin.scheduledFor).toLocaleString() : "Immediate"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AutoExpansionTab() {
  const { t } = useI18n();
  const { data: expansionData, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/jobs", "auto_expansion"],
    queryFn: () => adminFetch("/api/admin/autopilot/jobs?engineKey=auto_expansion&limit=20").then(r => r.json()),
  });

  const queryClient = useQueryClient();
  const triggerMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: { engineKey: "auto_expansion", payload: { mode: "scan_top_pages" } },
      });
      if (!res.ok) throw new Error("Expansion scan failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
    },
  });

  const jobs = Array.isArray(expansionData) ? expansionData : expansionData?.jobs || [];

  return (
    <div className="space-y-6">
      <Card data-testid="card-auto-expansion">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Expand className="h-5 w-5" /> Auto Content Expansion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Automatically discover top-performing pages and generate expansion content (related questions, deeper lessons, new practice pages).
          </p>
          <Button
            onClick={() => triggerMutation.mutate()}
            disabled={triggerMutation.isPending}
            data-testid="button-trigger-expansion"
          >
            {triggerMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.scanning")}</> : <><TrendingUp className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.scanTopPages")}</>}
          </Button>
          {triggerMutation.isSuccess && (
            <p className="text-sm text-green-600" data-testid="text-expansion-success">{t("pages.adminAutopilot.expansionScanTriggered")}</p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loading")}</div>
      ) : jobs.length > 0 && (
        <Card data-testid="card-expansion-history">
          <CardHeader>
            <CardTitle className="text-sm">{t("pages.adminAutopilot.expansionHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jobs.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" data-testid={`row-expansion-${job.id}`}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                    <span className="text-xs">{job.payload?.mode || "expansion"}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {job.createdAt ? new Date(job.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CourseBuilderTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [courseTopic, setCourseTopic] = useState("");
  const [courseExam, setCourseExam] = useState("nclex-rn");
  const [courseDifficulty, setCourseDifficulty] = useState("intermediate");

  const buildMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "course_builder",
          payload: { topic: courseTopic, exam: courseExam, difficulty: courseDifficulty },
        },
      });
      if (!res.ok) throw new Error("Course build failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue"] });
    },
  });

  return (
    <div className="space-y-6">
      <Card data-testid="card-course-builder">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> 1-Click Course Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.courseTopic")}</Label>
              <Input
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
                placeholder="e.g., Cardiac Nursing Fundamentals"
                data-testid="input-course-topic"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.targetExam")}</Label>
              <Select value={courseExam} onValueChange={setCourseExam} data-testid="select-course-exam">
                <SelectTrigger data-testid="select-course-exam-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nclex-rn">{t("pages.adminAutopilot.nclexrn2")}</SelectItem>
                  <SelectItem value="nclex-pn">{t("pages.adminAutopilot.nclexpn2")}</SelectItem>
                  <SelectItem value="rex-pn">{t("pages.adminAutopilot.rexpn2")}</SelectItem>
                  <SelectItem value="cnpe">CNPE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.difficulty")}</Label>
              <Select value={courseDifficulty} onValueChange={setCourseDifficulty} data-testid="select-course-difficulty">
                <SelectTrigger data-testid="select-course-difficulty-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t("pages.adminAutopilot.beginner")}</SelectItem>
                  <SelectItem value="intermediate">{t("pages.adminAutopilot.intermediate")}</SelectItem>
                  <SelectItem value="advanced">{t("pages.adminAutopilot.advanced")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => buildMutation.mutate()}
            disabled={buildMutation.isPending || !courseTopic.trim()}
            data-testid="button-build-course"
          >
            {buildMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.building")}</> : <><BookOpen className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.buildCourse")}</>}
          </Button>
          {buildMutation.isSuccess && (
            <p className="text-sm text-green-600" data-testid="text-course-success">{t("pages.adminAutopilot.courseBuildJobCreatedAnd")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LifecycleEmailTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [emailSequence, setEmailSequence] = useState("onboarding");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTrigger, setEmailTrigger] = useState("signup");

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/autopilot/jobs", {
        method: "POST",
        body: {
          engineKey: "lifecycle_email",
          payload: { sequence: emailSequence, subject: emailSubject, trigger: emailTrigger },
        },
      });
      if (!res.ok) throw new Error("Email template creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/jobs"] });
    },
  });

  const { data: emailJobs } = useQuery({
    queryKey: ["/api/admin/autopilot/jobs", "lifecycle_email"],
    queryFn: () => adminFetch("/api/admin/autopilot/jobs?engineKey=lifecycle_email&limit=10").then(r => r.json()),
  });

  const emailList = Array.isArray(emailJobs) ? emailJobs : emailJobs?.jobs || [];

  return (
    <div className="space-y-6">
      <Card data-testid="card-lifecycle-email">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" /> Lifecycle Email Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.sequence")}</Label>
              <Select value={emailSequence} onValueChange={setEmailSequence} data-testid="select-email-sequence">
                <SelectTrigger data-testid="select-email-sequence-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">{t("pages.adminAutopilot.onboarding")}</SelectItem>
                  <SelectItem value="trial_conversion">{t("pages.adminAutopilot.trialConversion")}</SelectItem>
                  <SelectItem value="exam_reminder">{t("pages.adminAutopilot.examReminder")}</SelectItem>
                  <SelectItem value="re_engagement">{t("pages.adminAutopilot.reengagement")}</SelectItem>
                  <SelectItem value="upgrade_nudge">{t("pages.adminAutopilot.upgradeNudge")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.subjectLine")}</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g., Your study plan is ready"
                data-testid="input-email-subject"
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">{t("pages.adminAutopilot.triggerEvent")}</Label>
              <Select value={emailTrigger} onValueChange={setEmailTrigger} data-testid="select-email-trigger">
                <SelectTrigger data-testid="select-email-trigger-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signup">{t("pages.adminAutopilot.signup")}</SelectItem>
                  <SelectItem value="trial_complete">{t("pages.adminAutopilot.trialComplete")}</SelectItem>
                  <SelectItem value="inactive_3d">{t("pages.adminAutopilot.inactive3Days")}</SelectItem>
                  <SelectItem value="inactive_7d">{t("pages.adminAutopilot.inactive7Days")}</SelectItem>
                  <SelectItem value="exam_date_near">{t("pages.adminAutopilot.examDateNear")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !emailSubject.trim()}
            data-testid="button-create-email"
          >
            {createMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> {t("pages.adminAutopilot.creating")}</> : <><Mail className="mr-2 h-4 w-4" /> {t("pages.adminAutopilot.createEmailTemplate")}</>}
          </Button>
          {createMutation.isSuccess && (
            <p className="text-sm text-green-600" data-testid="text-email-success">{t("pages.adminAutopilot.emailTemplateJobCreated")}</p>
          )}
        </CardContent>
      </Card>

      {emailList.length > 0 && (
        <Card data-testid="card-email-history">
          <CardHeader>
            <CardTitle className="text-sm">{t("pages.adminAutopilot.emailTemplateHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emailList.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" data-testid={`row-email-${job.id}`}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                    <span className="text-xs">{job.payload?.sequence || "email"} - {job.payload?.subject || ""}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {job.createdAt ? new Date(job.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PerformanceDashboardTab() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/stats"],
    queryFn: () => adminFetch("/api/admin/autopilot/stats").then(r => r.json()),
  });

  const { data: engines } = useQuery({
    queryKey: ["/api/admin/autopilot/engines"],
    queryFn: () => adminFetch("/api/admin/autopilot/engines").then(r => r.json()),
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingMetrics")}</div>;

  const engineList = Array.isArray(engines) ? engines : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="stat-completed-jobs">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.completedJobs || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.completedJobs")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-failed-jobs">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats?.failedJobs || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.failedJobs")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-published-count">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.publishedCount || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.publishedContent")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-success-rate">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold">
              {stats?.totalJobs ? ((stats.completedJobs || 0) / stats.totalJobs * 100).toFixed(0) : 0}%
            </div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.successRate")}</div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-engine-metrics">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Engine Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {engineList.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">{t("pages.adminAutopilot.noEngineDataAvailable")}</p>
          ) : (
            <div className="space-y-3">
              {engineList.map((engine: any) => (
                <div key={engine.engineKey} className="flex items-center gap-4 py-2 border-b last:border-0" data-testid={`row-metric-${engine.engineKey}`}>
                  <div className="w-40">
                    <span className="text-sm font-medium">{engine.name || engine.engineKey}</span>
                  </div>
                  <Badge variant={engine.enabled ? "default" : "outline"} className={engine.enabled ? "bg-green-100 text-green-800" : ""}>
                    {engine.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-auto">
                    {engine.lastRunAt ? `Last: ${new Date(engine.lastRunAt).toLocaleDateString()}` : "Never run"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function JobMonitorTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["/api/admin/bg-jobs"],
    queryFn: () => adminFetch("/api/admin/bg-jobs?limit=50").then(r => r.json()),
    refetchInterval: 5000,
  });

  const { data: statsData } = useQuery({
    queryKey: ["/api/admin/bg-jobs/stats"],
    queryFn: () => adminFetch("/api/admin/bg-jobs/stats").then(r => r.json()),
    refetchInterval: 10000,
  });

  const { data: jobDetail } = useQuery({
    queryKey: ["/api/admin/bg-jobs", expandedJob],
    queryFn: () => expandedJob ? adminFetch(`/api/admin/bg-jobs/${expandedJob}`).then(r => r.json()) : null,
    enabled: !!expandedJob,
    refetchInterval: expandedJob ? 5000 : false,
  });

  const actionMutation = useMutation({
    mutationFn: async ({ jobId, action, batchId }: { jobId: string; action: string; batchId?: string }) => {
      const url = batchId
        ? `/api/admin/bg-jobs/${jobId}/batches/${batchId}/${action}`
        : `/api/admin/bg-jobs/${jobId}/${action}`;
      const res = await adminFetch(url, { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `${action} failed`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bg-jobs"] });
    },
  });

  const jobs = jobsData?.jobs || [];
  const stats = statsData?.jobs || {};

  function formatElapsed(start: string, end?: string): string {
    if (!start) return "-";
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : Date.now();
    const diff = Math.max(0, e - s);
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  function progressPercent(completed: number, total: number): number {
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.round((completed / total) * 100));
  }

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingJobMonitor")}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="stat-bg-queued">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.queued || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.queued")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-bg-running">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.running || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.running")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-bg-completed">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.completed")}</div>
          </CardContent>
        </Card>
        <Card data-testid="stat-bg-failed">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed || 0}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAutopilot.failed")}</div>
          </CardContent>
        </Card>
      </div>

      {jobs.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">{t("pages.adminAutopilot.noBackgroundJobsFound")}</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((job: any) => {
            const isExpanded = expandedJob === job.id;
            const batches = isExpanded ? (jobDetail?.batches || []) : [];
            const pct = progressPercent(job.completedItems || 0, job.totalItems || 0);

            return (
              <Card key={job.id} data-testid={`card-bg-job-${job.id}`}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedJob(isExpanded ? null : job.id)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{job.type}</Badge>
                        {job.engineKey && <Badge variant="outline" className="text-xs">{job.engineKey}</Badge>}
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          {job.totalItems > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap" data-testid={`text-progress-${job.id}`}>
                                {job.completedItems}/{job.totalItems} ({pct}%)
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>Batches: {job.completedBatches}/{job.totalBatches}</span>
                            {job.failedBatches > 0 && <span className="text-red-500">{job.failedBatches} failed</span>}
                            <span><Clock className="inline h-3 w-3 mr-1" />{formatElapsed(job.startedAt || job.createdAt, job.completedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {["queued", "running"].includes(job.status) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => actionMutation.mutate({ jobId: job.id, action: "pause" })}
                          disabled={actionMutation.isPending}
                          data-testid={`button-pause-job-${job.id}`}
                          title={t("pages.adminAutopilot.pause")}
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {job.status === "paused" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600"
                          onClick={() => actionMutation.mutate({ jobId: job.id, action: "resume" })}
                          disabled={actionMutation.isPending}
                          data-testid={`button-resume-job-${job.id}`}
                          title={t("pages.adminAutopilot.resume")}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {!["completed", "cancelled"].includes(job.status) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => actionMutation.mutate({ jobId: job.id, action: "cancel" })}
                          disabled={actionMutation.isPending}
                          data-testid={`button-cancel-job-${job.id}`}
                          title={t("pages.adminAutopilot.cancel")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">{t("pages.adminAutopilot.childBatches")}</h4>
                      {batches.length === 0 ? (
                        <p className="text-xs text-gray-400">{t("pages.adminAutopilot.loadingBatches")}</p>
                      ) : (
                        batches.map((batch: any) => (
                          <div
                            key={batch.id}
                            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                            data-testid={`row-batch-${batch.id}`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xs text-gray-500 font-mono">#{batch.batchIndex}</span>
                              <StatusBadge status={batch.status} />
                              {batch.totalItems > 0 && (
                                <span className="text-xs text-gray-500">
                                  {batch.completedItems}/{batch.totalItems}
                                </span>
                              )}
                              {batch.retryCount > 0 && (
                                <span className="text-xs text-orange-500">retry {batch.retryCount}/{batch.maxRetries}</span>
                              )}
                              {batch.error && (
                                <span className="text-xs text-red-500 truncate max-w-48" title={batch.error}>
                                  {batch.error}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">
                                {formatElapsed(batch.startedAt || batch.createdAt, batch.completedAt)}
                              </span>
                            </div>
                            {batch.status === "failed" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-600"
                                onClick={() => actionMutation.mutate({ jobId: job.id, action: "retry", batchId: batch.id })}
                                disabled={actionMutation.isPending}
                                data-testid={`button-retry-batch-${batch.id}`}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" /> Retry
                              </Button>
                            )}
                          </div>
                        ))
                      )}
                      {job.error && (
                        <div className="text-xs text-red-500 mt-2 p-2 bg-red-50 rounded">
                          <AlertTriangle className="inline h-3 w-3 mr-1" />
                          {job.error}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function JobQueueSettingsTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["/api/admin/bg-jobs/settings"],
    queryFn: () => adminFetch("/api/admin/bg-jobs/settings").then(r => r.json()),
  });

  const [formValues, setFormValues] = useState<Record<string, number>>({});

  const settings = settingsData?.settings || {};

  const saveMutation = useMutation({
    mutationFn: async (updates: Record<string, number>) => {
      const res = await adminFetch("/api/admin/bg-jobs/settings", {
        method: "PUT",
        body: updates,
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bg-jobs/settings"] });
      setFormValues({});
    },
  });

  function getVal(key: string, defaultVal: number): number {
    return formValues[key] !== undefined ? formValues[key] : (settings[key] ?? defaultVal);
  }

  function setVal(key: string, val: number) {
    setFormValues(prev => ({ ...prev, [key]: val }));
  }

  const fields = [
    { key: "maxParentJobs", label: "Max Concurrent Parent Jobs", desc: "Maximum number of parent jobs running at once", default: 5, min: 1, max: 50 },
    { key: "maxChildBatchesPerJob", label: "Max Child Batches Per Job", desc: "Maximum concurrent child batches within one parent job", default: 3, min: 1, max: 20 },
    { key: "maxRequestsPerProvider", label: "Max Requests Per Provider", desc: "Maximum concurrent API requests to AI provider", default: 10, min: 1, max: 100 },
    { key: "defaultBatchSize", label: "Default Batch Size", desc: "Number of items per child batch", default: 50, min: 1, max: 500 },
    { key: "retryLimit", label: "Retry Limit", desc: "Number of times to retry a failed batch", default: 3, min: 0, max: 10 },
    { key: "retryBackoffMs", label: "Retry Backoff (ms)", desc: "Base delay between retries (doubles each attempt)", default: 5000, min: 1000, max: 60000 },
    { key: "maxRuntimePerBatch", label: "Max Runtime Per Batch (ms)", desc: "Maximum time a single batch can run", default: 300000, min: 60000, max: 3600000 },
    { key: "stalledJobTimeoutMs", label: "Stalled Job Timeout (ms)", desc: "Time without heartbeat before a job is considered stalled", default: 120000, min: 30000, max: 600000 },
  ];

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingSettings")}</div>;

  const hasChanges = Object.keys(formValues).length > 0;

  return (
    <div className="space-y-6">
      <Card data-testid="card-queue-settings">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" /> Job Queue Concurrency Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Configure concurrency limits, batch sizes, retry behavior, and timeout settings for the background job processing system.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1" data-testid={`field-${field.key}`}>
                <Label className="text-sm font-medium">{field.label}</Label>
                <Input
                  type="number"
                  value={getVal(field.key, field.default)}
                  onChange={(e) => setVal(field.key, parseInt(e.target.value) || field.default)}
                  min={field.min}
                  max={field.max}
                  data-testid={`input-${field.key}`}
                />
                <p className="text-xs text-gray-400">{field.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => saveMutation.mutate(
                Object.fromEntries(fields.map(f => [f.key, getVal(f.key, f.default)]))
              )}
              disabled={saveMutation.isPending || !hasChanges}
              data-testid="button-save-queue-settings"
            >
              {saveMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Save Settings
            </Button>
            {hasChanges && (
              <Button variant="ghost" onClick={() => setFormValues({})} data-testid="button-reset-queue-settings">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: engines, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/engines"],
    queryFn: () => adminFetch("/api/admin/autopilot/engines").then(r => r.json()),
  });

  const toggleMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await adminFetch(`/api/admin/autopilot/engines/${key}/toggle`, { method: "POST" });
      if (!res.ok) throw new Error("Toggle failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/engines"] }),
  });

  const engineList = Array.isArray(engines) ? engines : [];

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> {t("pages.adminAutopilot.loadingSettings2")}</div>;

  return (
    <div className="space-y-6">
      <Card data-testid="card-global-settings">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" /> Global Engine Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Enable or disable individual automation engines. Disabled engines will not process scheduled jobs.
          </p>
          <div className="space-y-3">
            {engineList.map((engine: any) => (
              <div key={engine.engineKey} className="flex items-center justify-between py-3 border-b last:border-0" data-testid={`row-setting-${engine.engineKey}`}>
                <div>
                  <h4 className="text-sm font-medium">{engine.name || engine.engineKey}</h4>
                  <p className="text-xs text-gray-500">{engine.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={engine.enabled}
                    onCheckedChange={() => toggleMutation.mutate(engine.engineKey)}
                    disabled={toggleMutation.isPending}
                    data-testid={`switch-engine-${engine.engineKey}`}
                  />
                  <span className="text-xs text-gray-400 w-8">{engine.enabled ? "On" : "Off"}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ValidationFailuresTab() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/autopilot/queue/validation-failures", currentPage],
    queryFn: () => adminFetch(`/api/admin/autopilot/queue/validation-failures?page=${currentPage}&limit=25`).then(r => r.json()),
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/autopilot/queue/${id}/approve-validation`, { method: "POST" });
      if (!res.ok) throw new Error("Approve failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue/validation-failures"] }),
  });

  const regenerateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/autopilot/queue/${id}/regenerate`, { method: "POST" });
      if (!res.ok) throw new Error("Regenerate failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/autopilot/queue/validation-failures"] }),
  });

  if (isLoading) return <div className="flex items-center gap-2 py-8"><Loader2 className="animate-spin" /> Loading validation failures...</div>;

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <Card data-testid="card-validation-failures">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Language Validation Failures
            {total > 0 && <Badge className="bg-orange-100 text-orange-800" data-testid="badge-validation-count">{total}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500" data-testid="text-no-validation-failures">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
              <p>No language validation failures found.</p>
              <p className="text-xs mt-1">All generated content passed language validation checks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: any) => {
                const meta = item.metadata || {};
                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3" data-testid={`card-validation-failure-${item.id}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm" data-testid={`text-failure-title-${item.id}`}>{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-red-100 text-red-800" data-testid={`badge-failure-status-${item.id}`}>validation failed</Badge>
                          <Badge variant="outline" data-testid={`badge-failure-type-${item.id}`}>{item.contentType}</Badge>
                          {meta.target_language && (
                            <Badge variant="outline" data-testid={`badge-failure-lang-${item.id}`}>
                              Target: {meta.target_language}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
                    </div>

                    {meta.validation_issues && meta.validation_issues.length > 0 && (
                      <div className="bg-red-50 rounded p-3">
                        <p className="text-xs font-medium text-red-700 mb-1">Validation Issues:</p>
                        <ul className="text-xs text-red-600 space-y-1">
                          {meta.validation_issues.map((issue: string, idx: number) => (
                            <li key={idx} data-testid={`text-issue-${item.id}-${idx}`}>- {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {meta.detected_language && (
                      <div className="text-xs text-gray-500">
                        Detected language: <strong>{meta.detected_language}</strong>
                        {meta.attempts && <> | Attempts: <strong>{meta.attempts}</strong></>}
                        {meta.flagged_at && <> | Flagged: {new Date(meta.flagged_at).toLocaleString()}</>}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveMutation.mutate(item.id)}
                        disabled={approveMutation.isPending}
                        data-testid={`button-approve-validation-${item.id}`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Approve Manually
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateMutation.mutate(item.id)}
                        disabled={regenerateMutation.isPending}
                        data-testid={`button-regenerate-${item.id}`}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Reject & Regenerate
                      </Button>
                    </div>
                  </div>
                );
              })}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">Page {currentPage} of {totalPages} ({total} total)</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} data-testid="button-prev-page">
                      Previous
                    </Button>
                    <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} data-testid="button-next-page">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminAutopilot() {
  const { t } = useI18n();
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
            <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-autopilot-title">
              <Zap className="h-6 w-6" /> Autopilot Control Center
            </h1>
            <p className="text-sm text-muted-foreground">{t("pages.adminAutopilot.manageAllAutomationEnginesSchedules")}</p>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <div className="overflow-x-auto mb-4">
            <TabsList className="inline-flex" data-testid="tabs-autopilot">
              <TabsTrigger value="overview" data-testid="tab-overview">{t("pages.adminAutopilot.overview")}</TabsTrigger>
              <TabsTrigger value="schedules" data-testid="tab-schedules">{t("pages.adminAutopilot.schedules")}</TabsTrigger>
              <TabsTrigger value="queue" data-testid="tab-queue">{t("pages.adminAutopilot.publishingQueue")}</TabsTrigger>
              <TabsTrigger value="keywords" data-testid="tab-keywords">{t("pages.adminAutopilot.keywords")}</TabsTrigger>
              <TabsTrigger value="blog" data-testid="tab-blog">{t("pages.adminAutopilot.blogEngine")}</TabsTrigger>
              <TabsTrigger value="practice" data-testid="tab-practice">{t("pages.adminAutopilot.practiceSeo")}</TabsTrigger>
              <TabsTrigger value="questions" data-testid="tab-questions">{t("pages.adminAutopilot.questionFactory")}</TabsTrigger>
              <TabsTrigger value="visuals" data-testid="tab-visuals">{t("pages.adminAutopilot.visualFactory")}</TabsTrigger>
              <TabsTrigger value="pinterest" data-testid="tab-pinterest">{t("pages.adminAutopilot.pinterest")}</TabsTrigger>
              <TabsTrigger value="expansion" data-testid="tab-expansion">{t("pages.adminAutopilot.autoExpansion")}</TabsTrigger>
              <TabsTrigger value="courses" data-testid="tab-courses">{t("pages.adminAutopilot.courseBuilder")}</TabsTrigger>
              <TabsTrigger value="email" data-testid="tab-email">{t("pages.adminAutopilot.lifecycleEmail")}</TabsTrigger>
              <TabsTrigger value="performance" data-testid="tab-performance">{t("pages.adminAutopilot.performance")}</TabsTrigger>
              <TabsTrigger value="job-monitor" data-testid="tab-job-monitor">{t("pages.adminAutopilot.jobMonitor")}</TabsTrigger>
              <TabsTrigger value="queue-settings" data-testid="tab-queue-settings">{t("pages.adminAutopilot.queueSettings")}</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">{t("pages.adminAutopilot.settings")}</TabsTrigger>
              <TabsTrigger value="validation-failures" data-testid="tab-validation-failures">Validation Failures</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="schedules"><SchedulesTab /></TabsContent>
          <TabsContent value="queue"><PublishingQueueTab /></TabsContent>
          <TabsContent value="keywords"><KeywordDiscoveryTab /></TabsContent>
          <TabsContent value="blog"><BlogEngineTab /></TabsContent>
          <TabsContent value="practice"><PracticeSEOTab /></TabsContent>
          <TabsContent value="questions"><QuestionFactoryTab /></TabsContent>
          <TabsContent value="visuals"><VisualFactoryTab /></TabsContent>
          <TabsContent value="pinterest"><PinterestSchedulerTab /></TabsContent>
          <TabsContent value="expansion"><AutoExpansionTab /></TabsContent>
          <TabsContent value="courses"><CourseBuilderTab /></TabsContent>
          <TabsContent value="email"><LifecycleEmailTab /></TabsContent>
          <TabsContent value="performance"><PerformanceDashboardTab /></TabsContent>
          <TabsContent value="job-monitor"><JobMonitorTab /></TabsContent>
          <TabsContent value="queue-settings"><JobQueueSettingsTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
          <TabsContent value="validation-failures"><ValidationFailuresTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
