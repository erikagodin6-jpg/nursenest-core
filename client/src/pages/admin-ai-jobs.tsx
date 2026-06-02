import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  Play,
  Pause,
  XCircle,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Activity,
  ArrowLeft,
  RotateCcw,
  Zap,
  Database,
  History,
  Settings,
  FileText,
  Server,
} from "lucide-react";

const JOB_TYPE_LABELS: Record<string, string> = {
  exam_questions: "Exam Questions",
  cat_questions: "CAT Questions",
  flashcards: "Flashcards",
  lessons: "Lessons",
  blog: "Blog Posts",
  rationale_image_linking: "Rationale Image Linking",
  lesson_image_linking: "Lesson Image Linking",
  qbank: "QBank Questions",
  allied: "Allied Health Questions",
  conversion: "Conversion Jobs",
};

const TIER_LABELS: Record<string, string> = {
  rn_nclex: "RN / NCLEX",
  rpn_lvn: "RPN / LVN",
  np: "Nurse Practitioner",
  allied_health: "Allied Health",
  emergency_nursing: "Emergency Nursing",
  imaging: "Imaging",
  new_grad: "New Grad",
};

const MODEL_TIER_LABELS: Record<string, string> = {
  cheapest: "Cheapest (GPT-4o Mini)",
  balanced: "Balanced (GPT-4o)",
  premium: "Premium (GPT-4o)",
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const variants: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    validating: "bg-blue-50 text-blue-700 border-blue-200",
    queued: "bg-indigo-50 text-indigo-700 border-indigo-200",
    running: "bg-blue-100 text-blue-800 border-blue-300 animate-pulse",
    paused: "bg-orange-100 text-orange-800 border-orange-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    completed_with_warnings: "bg-amber-100 text-amber-800 border-amber-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    stopped: "bg-red-50 text-red-700 border-red-200",
  };
  const labels: Record<string, string> = {
    completed_with_warnings: "completed w/ warnings",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[status] || "bg-gray-100 text-gray-800 border-gray-200"}`} data-testid={`status-badge-${status}`}>
      {labels[status] || status}
    </span>
  );
}

function EnvironmentBadge({ env }: { env: { safe: boolean; env: string; dbHost: string } }) {
  if (!env) return null;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${env.safe ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`} data-testid="badge-environment">
      {env.safe ? <Database className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
      {env.safe ? `Database verified (${env.env})` : `Database unsafe: ${env.reason}`}
    </div>
  );
}

export default function AdminAiJobs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("queue");

  const [jobType, setJobType] = useState("exam_questions");
  const [jobTier, setJobTier] = useState("rn_nclex");
  const [modelTier, setModelTier] = useState("cheapest");
  const [itemCount, setItemCount] = useState(25);
  const [spendCap, setSpendCap] = useState(5);
  const [duplicateProtection, setDuplicateProtection] = useState(true);
  const [dryRun, setDryRun] = useState(false);
  const [configTopic, setConfigTopic] = useState("");
  const [configSpecialty, setConfigSpecialty] = useState("");
  const [configExamKey, setConfigExamKey] = useState("nclex-rn");
  const [configCareer, setConfigCareer] = useState("respiratory_therapy");

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["ai-jobs"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-jobs?limit=50");
      return res.json();
    },
    refetchInterval: 3000,
  });

  const { data: killSwitchData } = useQuery({
    queryKey: ["ai-kill-switch"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-kill-switch");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: spendData } = useQuery({
    queryKey: ["ai-spend"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-spend");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: capsData } = useQuery({
    queryKey: ["ai-spend-caps"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-spend-caps");
      return res.json();
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["ai-job-stats"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-jobs/stats");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: historyData } = useQuery({
    queryKey: ["ai-jobs-history"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-jobs/history?limit=50");
      return res.json();
    },
    refetchInterval: 30000,
    enabled: activeTab === "history",
  });

  const { data: budgetLogsData } = useQuery({
    queryKey: ["ai-budget-logs"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-budget-logs?limit=50");
      return res.json();
    },
    refetchInterval: 30000,
    enabled: activeTab === "budget",
  });

  const { data: configData } = useQuery({
    queryKey: ["ai-jobs-config"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/ai-jobs/config");
      return res.json();
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async () => {
      const config: any = {};
      if (configExamKey && (jobType === "qbank" || jobType === "exam_questions" || jobType === "cat_questions")) config.examKey = configExamKey;
      if (configCareer && jobType === "allied") config.career = configCareer;

      const res = await adminFetch("/api/admin/ai-jobs", {
        method: "POST",
        body: JSON.stringify({
          type: jobType,
          tier: jobTier,
          itemCount,
          modelTier,
          spendCap,
          duplicateProtection,
          dryRun,
          topic: configTopic || undefined,
          specialty: configSpecialty || undefined,
          config,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create job");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Job Created", description: `Job ${data.id?.slice(0, 8)} created. Click Start to begin.` });
      queryClient.invalidateQueries({ queryKey: ["ai-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["ai-job-stats"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const startJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await adminFetch(`/api/admin/ai-jobs/${jobId}/start`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to start job");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Job Started" });
      queryClient.invalidateQueries({ queryKey: ["ai-jobs"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const pauseJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await adminFetch(`/api/admin/ai-jobs/${jobId}/pause`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Job Paused" });
      queryClient.invalidateQueries({ queryKey: ["ai-jobs"] });
    },
  });

  const cancelJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await adminFetch(`/api/admin/ai-jobs/${jobId}/cancel`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Job Cancelled" });
      queryClient.invalidateQueries({ queryKey: ["ai-jobs"] });
    },
  });

  const retryJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await adminFetch(`/api/admin/ai-jobs/${jobId}/retry`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to retry");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Job Queued for Retry" });
      queryClient.invalidateQueries({ queryKey: ["ai-jobs"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const toggleKillSwitch = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await adminFetch("/api/admin/ai-kill-switch", {
        method: "POST",
        body: JSON.stringify({ enabled }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: data.active ? "Kill Switch Activated" : "Kill Switch Deactivated", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["ai-kill-switch"] });
      queryClient.invalidateQueries({ queryKey: ["ai-jobs"] });
    },
  });

  const updateCaps = useMutation({
    mutationFn: async (caps: any) => {
      const res = await adminFetch("/api/admin/ai-spend-caps", {
        method: "POST",
        body: JSON.stringify(caps),
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Spend Caps Updated" });
      queryClient.invalidateQueries({ queryKey: ["ai-spend-caps"] });
      queryClient.invalidateQueries({ queryKey: ["ai-spend"] });
    },
  });

  const [localCaps, setLocalCaps] = useState({ dailyCap: 10, weeklyCap: 50, perJobCap: 5, monthlyCap: 150 });
  useEffect(() => {
    if (capsData) setLocalCaps(capsData);
  }, [capsData]);

  const batchLimits = configData?.batchLimits?.[jobType] || { default: 25, max: 50 };
  useEffect(() => {
    setItemCount(batchLimits.default);
  }, [jobType]);

  const jobs = jobsData?.jobs || [];
  const isKillSwitchActive = killSwitchData?.active || false;
  const env = spendData?.environment;
  const stats = statsData || {};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-gray-500 hover:text-gray-700" data-testid="link-back-admin">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
                <Zap className="w-6 h-6 text-blue-600" /> AI Jobs
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{t("pages.adminAiJobs.runsOnlyWhenYouStart")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {env && <EnvironmentBadge env={env} />}
            <Button
              onClick={() => toggleKillSwitch.mutate(!isKillSwitchActive)}
              className={isKillSwitchActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              data-testid="button-kill-switch"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isKillSwitchActive ? "Deactivate Kill Switch" : "Activate Kill Switch"}
            </Button>
          </div>
        </div>

        {isKillSwitchActive && (
          <div className="bg-red-600 text-white p-4 rounded-lg flex items-center gap-3 shadow-lg" data-testid="banner-kill-switch">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">{t("pages.adminAiJobs.allAiJobsDisabledEmergency")}</p>
              <p className="text-red-100 text-sm">{t("pages.adminAiJobs.noNewAiJobsCan")}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span>{t("pages.adminAiJobs.today")}</span>
              </div>
              <p className="text-xl font-bold" data-testid="text-daily-spend">
                ${(spendData?.daily || 0).toFixed(2)}
                <span className="text-xs text-gray-400 font-normal"> / ${spendData?.caps?.dailyCap || 10}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span>{t("pages.adminAiJobs.thisWeek")}</span>
              </div>
              <p className="text-xl font-bold" data-testid="text-weekly-spend">
                ${(spendData?.weekly || 0).toFixed(2)}
                <span className="text-xs text-gray-400 font-normal"> / ${spendData?.caps?.weeklyCap || 50}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span>{t("pages.adminAiJobs.thisMonth")}</span>
              </div>
              <p className="text-xl font-bold" data-testid="text-monthly-spend">
                ${(spendData?.monthly || 0).toFixed(2)}
                <span className="text-xs text-gray-400 font-normal"> / ${spendData?.caps?.monthlyCap || 150}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Activity className="w-4 h-4" />
                <span>{t("pages.adminAiJobs.active")}</span>
              </div>
              <p className="text-xl font-bold" data-testid="text-active-jobs">{stats.running || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>{t("pages.adminAiJobs.completed")}</span>
              </div>
              <p className="text-xl font-bold" data-testid="text-completed-jobs">{stats.completed || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="queue" className="gap-1" data-testid="tab-queue">
              <Activity className="w-4 h-4" /> Queue
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-1" data-testid="tab-create">
              <Plus className="w-4 h-4" /> Create
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1" data-testid="tab-history">
              <History className="w-4 h-4" /> History
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-1" data-testid="tab-budget">
              <DollarSign className="w-4 h-4" /> Budget
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1" data-testid="tab-settings">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t("pages.adminAiJobs.jobQueue")}</CardTitle>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500" data-testid="text-no-jobs">{t("pages.adminAiJobs.noJobsYetCreateOne")}</p>
                    <Button variant="outline" className="mt-3" onClick={() => setActiveTab("create")} data-testid="button-go-create">
                      <Plus className="w-4 h-4 mr-1" /> Create Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobs.map((job: any) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isKillSwitchActive={isKillSwitchActive}
                        onStart={(id) => startJobMutation.mutate(id)}
                        onPause={(id) => pauseJobMutation.mutate(id)}
                        onCancel={(id) => cancelJobMutation.mutate(id)}
                        onRetry={(id) => retryJobMutation.mutate(id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="w-5 h-5" />
                  Create New AI Job
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.jobType")}</label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger data-testid="select-job-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(JOB_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.tier")}</label>
                    <Select value={jobTier} onValueChange={setJobTier}>
                      <SelectTrigger data-testid="select-tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TIER_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.model")}</label>
                    <Select value={modelTier} onValueChange={setModelTier}>
                      <SelectTrigger data-testid="select-model-tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MODEL_TIER_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Size (max {batchLimits.max})
                    </label>
                    <Input
                      type="number"
                      value={itemCount}
                      onChange={(e) => setItemCount(Math.max(1, Math.min(batchLimits.max, parseInt(e.target.value) || 1)))}
                      min={1}
                      max={batchLimits.max}
                      data-testid="input-item-count"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spend Cap ($)</label>
                    <Input
                      type="number"
                      value={spendCap}
                      onChange={(e) => setSpendCap(parseFloat(e.target.value) || 5)}
                      min={0.01}
                      step={0.5}
                      data-testid="input-spend-cap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.topicOptional")}</label>
                    <Input
                      value={configTopic}
                      onChange={(e) => setConfigTopic(e.target.value)}
                      placeholder={t("pages.adminAiJobs.autoselectedIfEmpty")}
                      data-testid="input-topic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.specialtyOptional")}</label>
                    <Input
                      value={configSpecialty}
                      onChange={(e) => setConfigSpecialty(e.target.value)}
                      placeholder="e.g. Pediatrics, Oncology"
                      data-testid="input-specialty"
                    />
                  </div>
                  {(jobType === "qbank" || jobType === "exam_questions" || jobType === "cat_questions") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.examType")}</label>
                      <Select value={configExamKey} onValueChange={setConfigExamKey}>
                        <SelectTrigger data-testid="select-exam-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nclex-rn">{t("pages.adminAiJobs.nclexrn")}</SelectItem>
                          <SelectItem value="nclex-pn">{t("pages.adminAiJobs.nclexpn")}</SelectItem>
                          <SelectItem value="rex-pn">{t("pages.adminAiJobs.rexpn")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {jobType === "allied" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAiJobs.career")}</label>
                      <Select value={configCareer} onValueChange={setConfigCareer}>
                        <SelectTrigger data-testid="select-career">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="respiratory_therapy">{t("pages.adminAiJobs.respiratoryTherapy")}</SelectItem>
                          <SelectItem value="paramedic_ems">{t("pages.adminAiJobs.paramedicEms")}</SelectItem>
                          <SelectItem value="pharmacy_tech">{t("pages.adminAiJobs.pharmacyTech")}</SelectItem>
                          <SelectItem value="mlt">{t("pages.adminAiJobs.medicalLabTech")}</SelectItem>
                          <SelectItem value="radiology">{t("pages.adminAiJobs.radiology")}</SelectItem>
                          <SelectItem value="socialWorker">{t("pages.adminAiJobs.socialWork")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={duplicateProtection}
                      onChange={(e) => setDuplicateProtection(e.target.checked)}
                      className="rounded border-gray-300"
                      data-testid="checkbox-duplicate-protection"
                    />
                    Duplicate Protection
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dryRun}
                      onChange={(e) => setDryRun(e.target.checked)}
                      className="rounded border-gray-300"
                      data-testid="checkbox-dry-run"
                    />
                    Dry Run (no actual generation)
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={() => createJobMutation.mutate()}
                    disabled={createJobMutation.isPending || isKillSwitchActive}
                    data-testid="button-create-job"
                  >
                    {createJobMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Create Job
                  </Button>
                  {dryRun && <span className="text-sm text-amber-600 font-medium">{t("pages.adminAiJobs.dryRunModeNothingWill")}</span>}
                  {isKillSwitchActive && <span className="text-sm text-red-600 font-medium">{t("pages.adminAiJobs.killSwitchActiveCannotCreate")}</span>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5" /> Job History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(historyData?.jobs || []).length === 0 ? (
                  <p className="text-gray-500 text-center py-8" data-testid="text-no-history">{t("pages.adminAiJobs.noCompletedJobsYet")}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b text-gray-500">
                          <th className="pb-2 pr-3">ID</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.type")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.tier2")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.status")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.items")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.dups")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.failed")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.cost")}</th>
                          <th className="pb-2 pr-3">{t("pages.adminAiJobs.model2")}</th>
                          <th className="pb-2">{t("pages.adminAiJobs.completed2")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(historyData?.jobs || []).map((job: any) => (
                          <tr key={job.id} className="border-b last:border-0 hover:bg-gray-50" data-testid={`row-history-${job.id}`}>
                            <td className="py-2 pr-3 font-mono text-xs">{job.id?.slice(0, 8)}</td>
                            <td className="py-2 pr-3">{JOB_TYPE_LABELS[job.type] || job.type}</td>
                            <td className="py-2 pr-3">{TIER_LABELS[job.tier] || job.tier || "-"}</td>
                            <td className="py-2 pr-3"><StatusBadge status={job.status} /></td>
                            <td className="py-2 pr-3">{job.items_completed || 0}/{job.item_count || 0}</td>
                            <td className="py-2 pr-3">{job.duplicates_skipped || 0}</td>
                            <td className="py-2 pr-3">{job.items_failed || 0}</td>
                            <td className="py-2 pr-3">${(job.actual_cost || 0).toFixed(4)}</td>
                            <td className="py-2 pr-3 text-xs">{job.model_tier || "cheapest"}</td>
                            <td className="py-2 text-xs text-gray-500">{job.completed_at ? new Date(job.completed_at).toLocaleString() : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Spend Caps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Cap ($)</label>
                    <Input
                      type="number"
                      value={localCaps.dailyCap}
                      onChange={(e) => setLocalCaps({ ...localCaps, dailyCap: parseFloat(e.target.value) || 10 })}
                      min={1}
                      step={1}
                      data-testid="input-daily-cap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Cap ($)</label>
                    <Input
                      type="number"
                      value={localCaps.weeklyCap}
                      onChange={(e) => setLocalCaps({ ...localCaps, weeklyCap: parseFloat(e.target.value) || 50 })}
                      min={1}
                      step={5}
                      data-testid="input-weekly-cap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Cap ($)</label>
                    <Input
                      type="number"
                      value={localCaps.monthlyCap}
                      onChange={(e) => setLocalCaps({ ...localCaps, monthlyCap: parseFloat(e.target.value) || 150 })}
                      min={1}
                      step={10}
                      data-testid="input-monthly-cap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per-Job Cap ($)</label>
                    <Input
                      type="number"
                      value={localCaps.perJobCap}
                      onChange={(e) => setLocalCaps({ ...localCaps, perJobCap: parseFloat(e.target.value) || 5 })}
                      min={0.5}
                      step={0.5}
                      data-testid="input-per-job-cap"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => updateCaps.mutate(localCaps)}
                  disabled={updateCaps.isPending}
                  className="mt-4"
                  data-testid="button-save-caps"
                >
                  Save Caps
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Budget Event Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(budgetLogsData?.logs || []).length === 0 ? (
                  <p className="text-gray-500 text-center py-6">{t("pages.adminAiJobs.noBudgetEventsLoggedYet")}</p>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {(budgetLogsData?.logs || []).map((log: any) => (
                      <div key={log.id} className="flex items-start gap-3 text-sm border-b pb-2 last:border-0" data-testid={`budget-log-${log.id}`}>
                        <span className="text-xs text-gray-400 whitespace-nowrap font-mono">
                          {log.created_at ? new Date(log.created_at).toLocaleString() : ""}
                        </span>
                        <Badge variant="outline" className="text-xs shrink-0">{log.event_type}</Badge>
                        <span className="text-gray-700">{log.message || "-"}</span>
                        {log.cap_type && (
                          <span className="text-xs text-gray-500">
                            ({log.cap_type}: ${(log.current_spend || 0).toFixed(2)} / ${(log.cap_value || 0).toFixed(2)})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5" /> Environment & Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-white">
                    <h4 className="font-medium text-sm mb-2">{t("pages.adminAiJobs.databaseConnection")}</h4>
                    {env ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {env.safe ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                          <span className="text-sm" data-testid="text-db-status">{env.safe ? "Production database verified" : `Unsafe: ${env.reason}`}</span>
                        </div>
                        <p className="text-xs text-gray-500">Environment: {env.env}</p>
                        <p className="text-xs text-gray-500">Host: {env.dbHost}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">{t("pages.adminAiJobs.loading")}</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg border bg-white">
                    <h4 className="font-medium text-sm mb-2">{t("pages.adminAiJobs.killSwitch")}</h4>
                    <div className="flex items-center gap-2">
                      {isKillSwitchActive ? (
                        <><AlertTriangle className="w-4 h-4 text-red-600" /><span className="text-sm text-red-600 font-medium">{t("pages.adminAiJobs.activeAllAiJobsBlocked")}</span></>
                      ) : (
                        <><CheckCircle className="w-4 h-4 text-green-600" /><span className="text-sm text-green-600">{t("pages.adminAiJobs.inactiveJobsCanRun")}</span></>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h4 className="font-medium text-sm mb-2">{t("pages.adminAiJobs.concurrency")}</h4>
                  <p className="text-sm text-gray-600">{t("pages.adminAiJobs.onlyOneAiJobCan")}</p>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h4 className="font-medium text-sm mb-2">{t("pages.adminAiJobs.failsafeRules")}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>{t("pages.adminAiJobs.max3RetriesPerJob")}</li>
                    <li>{t("pages.adminAiJobs.max2RetriesPerIndividual")}</li>
                    <li>{t("pages.adminAiJobs.noInfiniteLoopsJobsStop")}</li>
                    <li>{t("pages.adminAiJobs.noSilentAutoresumePausedJobs")}</li>
                    <li>{t("pages.adminAiJobs.killSwitchStopsAllJobs")}</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h4 className="font-medium text-sm mb-2">{t("pages.adminAiJobs.batchSizeLimits")}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {Object.entries(BATCH_LIMITS).map(([type, limits]: [string, any]) => (
                      <div key={type} className="flex justify-between bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-600">{JOB_TYPE_LABELS[type] || type}</span>
                        <span className="font-mono text-gray-800">{limits?.default || "?"} / {limits?.max || "?"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h4 className="font-medium text-sm mb-2">{t("pages.adminAiJobs.jobStatistics")}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.totalJobs")}</span> <span className="font-medium">{stats.total || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.pending")}</span> <span className="font-medium">{stats.pending || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.running")}</span> <span className="font-medium">{stats.running || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.completed3")}</span> <span className="font-medium">{stats.completed || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.failed2")}</span> <span className="font-medium">{stats.failed || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.cancelled")}</span> <span className="font-medium">{stats.cancelled || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.paused")}</span> <span className="font-medium">{stats.paused || 0}</span></div>
                    <div><span className="text-gray-500">{t("pages.adminAiJobs.stopped")}</span> <span className="font-medium">{stats.stopped || 0}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const BATCH_LIMITS: Record<string, { default: number; max: number }> = {
  exam_questions: { default: 25, max: 50 },
  cat_questions: { default: 25, max: 50 },
  flashcards: { default: 50, max: 100 },
  lessons: { default: 5, max: 10 },
  blog: { default: 3, max: 5 },
  rationale_image_linking: { default: 10, max: 20 },
  lesson_image_linking: { default: 10, max: 20 },
  qbank: { default: 25, max: 50 },
  allied: { default: 25, max: 50 },
  conversion: { default: 10, max: 20 },
};

function JobCard({ job, isKillSwitchActive, onStart, onPause, onCancel, onRetry }: {
  job: any;
  isKillSwitchActive: boolean;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  const [showLogs, setShowLogs] = useState(false);
  const progress = typeof job.progress === "string" ? JSON.parse(job.progress) : (job.progress || {});
  const logs = typeof job.logs === "string" ? JSON.parse(job.logs) : (job.logs || []);
  const total = progress.total || job.item_count || 0;
  const completed = progress.completed || 0;
  const failed = progress.failed || 0;
  const dupsSkipped = progress.duplicatesSkipped || 0;
  const pct = total > 0 ? Math.round(((completed + dupsSkipped + failed) / total) * 100) : 0;
  const canRetry = (job.status === "completed" || job.status === "failed" || job.status === "stopped" || job.status === "completed_with_warnings") && (job.retry_count || 0) < (job.max_retries || 3);

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow" data-testid={`card-job-${job.id}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={job.status} />
          <span className="font-medium text-sm">{JOB_TYPE_LABELS[job.type] || job.type}</span>
          {job.tier && <Badge variant="outline" className="text-xs">{TIER_LABELS[job.tier] || job.tier}</Badge>}
          {job.model_tier && <Badge variant="secondary" className="text-xs">{job.model_tier}</Badge>}
          {job.dry_run && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">{t("pages.adminAiJobs.dryRun")}</Badge>}
          <span className="text-xs text-gray-400 font-mono">{job.id?.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {(job.status === "pending" || job.status === "paused") && (
            <Button size="sm" variant="outline" onClick={() => onStart(job.id)} disabled={isKillSwitchActive} data-testid={`button-start-${job.id}`}>
              <Play className="w-3 h-3 mr-1" /> Start
            </Button>
          )}
          {job.status === "running" && (
            <Button size="sm" variant="outline" onClick={() => onPause(job.id)} data-testid={`button-pause-${job.id}`}>
              <Pause className="w-3 h-3 mr-1" /> Pause
            </Button>
          )}
          {(job.status === "running" || job.status === "pending" || job.status === "paused") && (
            <Button size="sm" variant="destructive" onClick={() => onCancel(job.id)} data-testid={`button-cancel-${job.id}`}>
              <XCircle className="w-3 h-3 mr-1" /> Cancel
            </Button>
          )}
          {canRetry && (
            <Button size="sm" variant="outline" onClick={() => onRetry(job.id)} data-testid={`button-retry-${job.id}`}>
              <RotateCcw className="w-3 h-3 mr-1" /> Retry
            </Button>
          )}
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>
            {completed} completed
            {dupsSkipped > 0 && `, ${dupsSkipped} dups skipped`}
            {failed > 0 && `, ${failed} failed`}
            {` / ${total} total`}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${failed > 0 ? "bg-amber-500" : "bg-blue-500"} ${job.status === "running" ? "animate-pulse" : ""}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
            data-testid={`progress-bar-${job.id}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-500">
        <div>Cost: ${(job.actual_cost || 0).toFixed(4)}{job.spend_cap ? ` / $${job.spend_cap}` : ""}</div>
        <div>Topic: {job.topic || "auto"}</div>
        <div>Created: {job.created_at ? new Date(job.created_at).toLocaleString() : "-"}</div>
        <div>By: {job.created_by || "system"}</div>
        {job.current_stage && <div>Stage: {job.current_stage}</div>}
      </div>

      {job.error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 rounded p-2 border border-red-200" data-testid={`error-${job.id}`}>
          {job.error}
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer flex items-center gap-1"
            data-testid={`toggle-logs-${job.id}`}
          >
            <FileText className="w-3 h-3" />
            {showLogs ? "Hide" : "Show"} Logs ({logs.length} entries)
          </button>
          {showLogs && (
            <div className="mt-1 max-h-48 overflow-y-auto bg-gray-50 rounded p-2 text-xs font-mono border" data-testid={`logs-${job.id}`}>
              {logs.slice(-30).map((log: any, idx: number) => (
                <div key={idx} className="py-0.5">
                  <span className="text-gray-400">{log.timestamp?.slice(11, 19) || ""}</span>{" "}
                  <span className={log.message?.includes("Error") || log.message?.includes("FAILED") ? "text-red-600" : log.message?.includes("successfully") ? "text-green-600" : "text-gray-700"}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
