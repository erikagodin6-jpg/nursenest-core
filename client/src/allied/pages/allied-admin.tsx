import { useState, useEffect, useCallback } from "react";
import { CAREER_CONFIGS, ACTIVE_BUILD_PRIORITY, CONTENT_EXPANSION_ROADMAP } from "@shared/careers";
import {
  Settings, BookOpen, Brain, Zap, BarChart3, FileText,
  ToggleLeft, ToggleRight, Loader2, CheckCircle2, AlertTriangle,
  RefreshCw, ChevronDown, ChevronRight, Target, TrendingUp,
  Filter, Clock, Shield, AlertCircle, ArrowRight, Eye,
  Play, Pause, Power, Database, Mail, Search, ShieldAlert, Wrench,
  FileCheck, Archive
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ScenarioAdminPanel } from "@/allied/components/scenario-admin";
import { ArticleAdminPanel } from "@/allied/components/article-admin";

import { useI18n } from "@/lib/i18n";
const ALLIED_CAREERS = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging", "psychotherapist", "socialWorker", "addictionsCounsellor", "occupationalTherapy", "physicalTherapy", "healthInfoMgmt", "occupationalTherapyAssistant", "physiotherapyAssistant"] as const;

type Tab = "overview" | "generate" | "questions" | "revision" | "analytics" | "blueprints" | "automations" | "drafts" | "store" | "qbank" | "scenarios" | "articles";

interface PipelineStats {
  totalQuestions: number;
  flashcards: number;
  flaggedCount: number;
  pendingRevisions: number;
  domainBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  cognitiveBreakdown: Record<string, number>;
  avgRationaleWords: number;
  rejectionRate: number;
}

interface BatchRun {
  id: string;
  career_type: string;
  requested_count: number;
  generated_count: number;
  accepted_count: number;
  rejected_count: number;
  status: string;
  started_at: string;
  avg_rationale_words: number;
  rejection_reasons: Record<string, number>;
  difficulty_breakdown: Record<string, number>;
  cognitive_breakdown: Record<string, number>;
}

interface RevisionItem {
  id: string;
  question_id: string;
  career_type: string;
  reason: string;
  severity: string;
  status: string;
  stem: string;
  blueprint_category: string;
  difficulty: number;
  cognitive_level: string;
  created_at: string;
}

async function apiFetch(url: string, opts?: RequestInit) {
  const { t } = useI18n();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const stored = localStorage.getItem("nursenest-credentials");
  if (stored) {
    try {
      const creds = JSON.parse(stored);
      if (creds.username) headers["x-username"] = creds.username;
      if (creds.password) headers["x-password"] = creds.password;
    } catch {}
  }
  const token = localStorage.getItem("nn_admin_access_token");
  if (token) headers["authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    ...opts,
    headers: { ...headers, ...(opts?.headers || {}) },
    credentials: "include",
  });
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const body = await res.json();
      if (body.error === "Authentication required") msg = "You must be logged in to perform this action";
      else if (body.error === "Admin access denied") msg = "You do not have permission to perform this action";
      else msg = body.error || msg;
    } catch {
      msg = await res.text().catch(() => msg);
    }
    throw new Error(msg);
  }
  return res.json();
}

function PercentBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="flex items-center gap-2 text-sm" data-testid={`bar-${label}`}>
      <span className="w-28 text-gray-600 truncate">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, parseFloat(pct))}%` }} />
      </div>
      <span className="w-16 text-right text-gray-700 font-medium">{pct}%</span>
      <span className="w-10 text-right text-xs text-gray-400">{value}</span>
    </div>
  );
}

export default function AlliedAdminPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedCareer, setSelectedCareer] = useState<string>("rrt");
  const [stats, setStats] = useState<Record<string, PipelineStats>>({});
  const [batches, setBatches] = useState<BatchRun[]>([]);
  const [revisionQueue, setRevisionQueue] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genDomain, setGenDomain] = useState("");
  const [genSubtopic, setGenSubtopic] = useState("");
  const [genCount, setGenCount] = useState(25);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [domainSubtopics, setDomainSubtopics] = useState<Record<string, string[]>>({});
  const [availableSubtopics, setAvailableSubtopics] = useState<string[]>([]);
  const [automations, setAutomations] = useState<any[]>([]);
  const [automationRuns, setAutomationRuns] = useState<any[]>([]);
  const [automationStatus, setAutomationStatus] = useState<any>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [draftsTotal, setDraftsTotal] = useState(0);
  const [draftFilter, setDraftFilter] = useState("");
  const [runningAutomation, setRunningAutomation] = useState<string | null>(null);
  const [psychBulkRunning, setPsychBulkRunning] = useState(false);
  const [psychBulkStatus, setPsychBulkStatus] = useState<any>(null);
  const [psychBulkBatchId, setPsychBulkBatchId] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/allied/pipeline/analytics");
      setStats(data);
    } catch (e: any) {
      console.error("Failed to load stats:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBatches = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/allied/pipeline/batches?careerType=${selectedCareer}`);
      setBatches(data);
    } catch (e: any) {
      console.error("Failed to load batches:", e);
    }
  }, [selectedCareer]);

  const loadRevisionQueue = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/allied/pipeline/revision-queue?careerType=${selectedCareer}`);
      setRevisionQueue(data);
    } catch (e: any) {
      console.error("Failed to load revision queue:", e);
    }
  }, [selectedCareer]);

  const loadBlueprints = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/allied/pipeline/blueprints?careerType=${selectedCareer}`);
      setBlueprints(data);
    } catch (e: any) {
      console.error("Failed to load blueprints:", e);
    }
  }, [selectedCareer]);

  const loadSubtopics = useCallback(async () => {
    try {
      const data = await fetch(`/api/allied/pipeline/subtopics?careerType=${selectedCareer}`).then(r => r.json());
      setDomainSubtopics(data.domains || {});
    } catch {}
  }, [selectedCareer]);

  const loadAutomations = useCallback(async () => {
    try {
      const [autos, status, runs] = await Promise.all([
        apiFetch("/api/allied/automations"),
        apiFetch("/api/allied/automations/status"),
        apiFetch("/api/allied/automations/runs?limit=30"),
      ]);
      setAutomations(autos);
      setAutomationStatus(status);
      setAutomationRuns(runs);
    } catch (e: any) {
      console.error("Failed to load automations:", e);
    }
  }, []);

  const loadDrafts = useCallback(async () => {
    try {
      const params = draftFilter ? `&type=${draftFilter}` : "";
      const data = await apiFetch(`/api/allied/automations/drafts?page=1${params}`);
      setDrafts(data.drafts);
      setDraftsTotal(data.total);
    } catch (e: any) {
      console.error("Failed to load drafts:", e);
    }
  }, [draftFilter]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadSubtopics(); }, [loadSubtopics]);
  useEffect(() => {
    if (tab === "generate" || tab === "questions") loadBatches();
    if (tab === "revision") loadRevisionQueue();
    if (tab === "blueprints") loadBlueprints();
    if (tab === "automations") loadAutomations();
    if (tab === "drafts") loadDrafts();
  }, [tab, selectedCareer, loadBatches, loadRevisionQueue, loadBlueprints, loadAutomations, loadDrafts]);

  useEffect(() => {
    if (genDomain && domainSubtopics[genDomain]) {
      setAvailableSubtopics(domainSubtopics[genDomain]);
    } else {
      setAvailableSubtopics([]);
    }
    setGenSubtopic("");
  }, [genDomain, domainSubtopics]);

  const handleCreateBlueprint = async () => {
    try {
      await apiFetch("/api/allied/pipeline/blueprints", {
        method: "POST",
        body: JSON.stringify({ careerType: selectedCareer, adminId: "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" }),
      });
      toast({ title: "Blueprint created", description: `New blueprint for ${CAREER_CONFIGS[selectedCareer as keyof typeof CAREER_CONFIGS].shortName}` });
      loadBlueprints();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleGenerate = async () => {
    if (!genDomain) {
      toast({ title: "Domain required", description: "Select a domain before generating", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const result = await apiFetch("/api/allied/pipeline/generate", {
        method: "POST",
        body: JSON.stringify({
          careerType: selectedCareer,
          count: genCount,
          domain: genDomain,
          subtopic: genSubtopic || "general",
          adminId: "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225",
        }),
      });
      toast({ title: "Batch started", description: `Batch ${result.batchId} generating ${genCount} questions` });
      setTimeout(() => { loadBatches(); loadStats(); }, 5000);
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleCommitBatch = async (batchId: string) => {
    try {
      const result = await apiFetch(`/api/allied/pipeline/commit-batch/${batchId}`, {
        method: "POST",
        body: JSON.stringify({ adminId: "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" }),
      });
      toast({ title: "Batch committed", description: `${result.committed} questions approved, ${result.flashcardsGenerated} flashcards generated` });
      loadBatches();
      loadStats();
    } catch (e: any) {
      toast({ title: "Commit failed", description: e.message, variant: "destructive" });
    }
  };

  const handleSeedAutomations = async () => {
    try {
      const result = await apiFetch("/api/allied/automations/seed", { method: "POST" });
      toast({ title: "Automations seeded", description: `${result.seeded} new automations created (${result.total} total)` });
      loadAutomations();
    } catch (e: any) {
      toast({ title: "Seed failed", description: e.message, variant: "destructive" });
    }
  };

  const handleToggleAutomation = async (id: string, enabled: boolean) => {
    try {
      await apiFetch(`/api/allied/automations/${id}`, { method: "PUT", body: JSON.stringify({ enabled }) });
      loadAutomations();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleRunNow = async (id: string) => {
    setRunningAutomation(id);
    try {
      const result = await apiFetch(`/api/allied/automations/${id}/run-now`, { method: "POST" });
      toast({ title: "Automation started", description: `Run ${result.runId} for ${result.slug}` });
      setTimeout(() => { loadAutomations(); setRunningAutomation(null); }, 5000);
    } catch (e: any) {
      toast({ title: "Run failed", description: e.message, variant: "destructive" });
      setRunningAutomation(null);
    }
  };

  const handleKillSwitch = async (active: boolean) => {
    try {
      await apiFetch("/api/allied/automations/kill-switch", { method: "POST", body: JSON.stringify({ active }) });
      toast({ title: active ? "Kill switch ACTIVATED" : "Kill switch deactivated" });
      loadAutomations();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleDraftAction = async (id: string, status: string) => {
    try {
      await apiFetch(`/api/allied/automations/drafts/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
      toast({ title: `Draft ${status}` });
      loadDrafts();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handlePsychBulkGenerate = async () => {
    setPsychBulkRunning(true);
    try {
      const result = await apiFetch("/api/allied/pipeline/psychotherapy-bulk-generate", {
        method: "POST",
        body: JSON.stringify({ adminId: "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" }),
      });
      setPsychBulkBatchId(result.masterBatchId);
      toast({ title: "Psychotherapy bulk generation started", description: result.message });
      const pollInterval = setInterval(async () => {
        try {
          const status = await apiFetch(`/api/allied/pipeline/psychotherapy-bulk-status/${result.masterBatchId}`);
          setPsychBulkStatus(status);
          if (status.status === "completed" || status.status === "failed") {
            clearInterval(pollInterval);
            setPsychBulkRunning(false);
            loadStats();
            loadBatches();
          }
        } catch {
          clearInterval(pollInterval);
          setPsychBulkRunning(false);
        }
      }, 10000);
    } catch (e: any) {
      toast({ title: "Bulk generation failed", description: e.message, variant: "destructive" });
      setPsychBulkRunning(false);
    }
  };

  const handleRefreshPsychStatus = async () => {
    if (!psychBulkBatchId) return;
    try {
      const status = await apiFetch(`/api/allied/pipeline/psychotherapy-bulk-status/${psychBulkBatchId}`);
      setPsychBulkStatus(status);
    } catch (e: any) {
      toast({ title: "Failed to refresh status", description: e.message, variant: "destructive" });
    }
  };

  const handleResolveRevision = async (id: string, status: string) => {
    try {
      await apiFetch(`/api/allied/pipeline/revision-queue/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status, reviewNotes: "Reviewed by admin", adminId: "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" }),
      });
      toast({ title: "Revision updated" });
      loadRevisionQueue();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.alliedAdmin.adminAccessRequired")}</h1>
        <p className="text-gray-600">{t("allied.alliedAdmin.youNeedAdminPrivilegesTo")}</p>
      </div>
    );
  }

  const career = CAREER_CONFIGS[selectedCareer as keyof typeof CAREER_CONFIGS];
  const careerStats = stats[selectedCareer];
  const totalQuestionsAll = Object.values(stats).reduce((s, c) => s + (c?.totalQuestions || 0), 0);
  const totalFlashcardsAll = Object.values(stats).reduce((s, c) => s + (c?.flashcards || 0), 0);
  const totalFlaggedAll = Object.values(stats).reduce((s, c) => s + (c?.flaggedCount || 0), 0);
  const totalRevisionsAll = Object.values(stats).reduce((s, c) => s + (c?.pendingRevisions || 0), 0);

  const CATEGORY_LABELS: Record<string, { label: string; icon: any; color: string }> = {
    question_bank: { label: "Question Bank", icon: BookOpen, color: "text-teal-600" },
    flashcards: { label: "Flashcards", icon: Brain, color: "text-purple-600" },
    study_plans: { label: "Study Plans", icon: Target, color: "text-blue-600" },
    seo_content: { label: "SEO & Content", icon: Search, color: "text-green-600" },
    store: { label: "Store/Product", icon: Archive, color: "text-orange-600" },
    lifecycle: { label: "Lifecycle/CRM", icon: Mail, color: "text-pink-600" },
    quality: { label: "Quality & Safety", icon: ShieldAlert, color: "text-red-600" },
    ops: { label: "Ops/DevOps", icon: Wrench, color: "text-gray-600" },
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "automations", label: "Automations", icon: Zap },
    { id: "drafts", label: "Draft Review", icon: FileCheck },
    { id: "generate", label: "Generator", icon: Database },
    { id: "questions", label: "Questions", icon: BookOpen },
    { id: "revision", label: "Revision Queue", icon: AlertCircle },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "blueprints", label: "Blueprints", icon: Target },
    { id: "store", label: "Store", icon: Archive },
    { id: "qbank", label: "QBank", icon: Shield },
    { id: "scenarios", label: "Scenarios", icon: Target },
    { id: "articles", label: "Articles", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="allied-admin-page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-title">{t("allied.alliedAdmin.alliedContentPipeline")}</h1>
            <p className="text-sm text-gray-500">{t("allied.alliedAdmin.5layerProductionSystem")}</p>
          </div>
        </div>
        <button onClick={() => { loadStats(); loadBatches(); }} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100" data-testid="button-refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-total-questions">
          <BookOpen className="w-6 h-6 text-teal-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalQuestionsAll.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedAdmin.totalQuestions")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-total-flashcards">
          <Brain className="w-6 h-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalFlashcardsAll.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedAdmin.autoflashcards")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-flagged">
          <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalFlaggedAll}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedAdmin.flaggedItems")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-revisions">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{totalRevisionsAll}</div>
          <div className="text-sm text-gray-500">{t("allied.alliedAdmin.pendingRevisions")}</div>
        </div>
      </div>

      <div className="mb-4">
        <a
          href="/admin/paramedic-bulk-upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200"
          data-testid="link-bulk-upload"
        >
          <Database className="w-4 h-4" /> Paramedic Bulk Upload Manager
        </a>
      </div>

      <div className="flex gap-3 mb-6 items-center">
        <select
          value={selectedCareer}
          onChange={(e) => setSelectedCareer(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          data-testid="select-career"
        >
          {ALLIED_CAREERS.map(id => (
            <option key={id} value={id}>{CAREER_CONFIGS[id].shortName}</option>
          ))}
        </select>
        <div className="flex bg-gray-100 rounded-lg p-0.5 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tab === t.id ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              data-testid={`tab-${t.id}`}
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ALLIED_CAREERS.map(id => {
              const cs = stats[id];
              const c = CAREER_CONFIGS[id];
              return (
                <div key={id} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`career-card-${id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{c.shortName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">{cs?.totalQuestions || 0} Qs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{cs?.flashcards || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.flashcards")}</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{cs?.avgRationaleWords || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.avgWords")}</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{cs?.rejectionRate || 0}%</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.rejectRate")}</div>
                    </div>
                  </div>
                  {cs && cs.totalQuestions > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
                      {Object.entries(cs.difficultyBreakdown || {}).map(([d, v]) => (
                        <PercentBar key={d} label={`Difficulty ${d}`} value={v} total={cs.totalQuestions} color="bg-teal-400" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="build-priority-panel">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Active Build Priority
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACTIVE_BUILD_PRIORITY.map(careerId => {
                const c = CAREER_CONFIGS[careerId as keyof typeof CAREER_CONFIGS];
                const cs = stats[careerId];
                if (!c) return null;
                return (
                  <div key={careerId} className="border border-orange-200 bg-orange-50 rounded-lg p-4" data-testid={`priority-${careerId}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{c.shortName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">PRIORITY</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{cs?.totalQuestions || 0}</div>
                        <div className="text-gray-500">{t("allied.alliedAdmin.questions")}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{cs?.flashcards || 0}</div>
                        <div className="text-gray-500">{t("allied.alliedAdmin.flashcards2")}</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{c.domains?.length || 0}</div>
                        <div className="text-gray-500">{t("allied.alliedAdmin.domains")}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="expansion-roadmap-panel">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Content Expansion Roadmap
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">{t("allied.alliedAdmin.career")}</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">{t("allied.alliedAdmin.status")}</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">{t("allied.alliedAdmin.searchVol")}</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">SEO</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">{t("allied.alliedAdmin.conversion")}</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-600">{t("allied.alliedAdmin.depth")}</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">{t("allied.alliedAdmin.notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTENT_EXPANSION_ROADMAP.map(item => (
                    <tr key={item.slug} className="border-b border-gray-50" data-testid={`roadmap-${item.slug}`}>
                      <td className="py-2 px-3 font-medium text-gray-900">{item.career}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === "active" ? "bg-green-50 text-green-700" :
                          item.status === "planned" ? "bg-blue-50 text-blue-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>{item.status}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs font-medium ${item.searchVolume === "high" ? "text-green-600" : item.searchVolume === "medium" ? "text-amber-600" : "text-gray-500"}`}>{item.searchVolume}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs font-medium ${item.seoOpportunity === "high" ? "text-green-600" : item.seoOpportunity === "medium" ? "text-amber-600" : "text-gray-500"}`}>{item.seoOpportunity}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs font-medium ${item.conversionPotential === "high" ? "text-green-600" : item.conversionPotential === "medium" ? "text-amber-600" : "text-gray-500"}`}>{item.conversionPotential}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="text-xs text-gray-600">{item.contentDepth}</span>
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-500 max-w-xs truncate">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "generate" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="generator-panel">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-500" /> Batch Generator -- {career.shortName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.domainRequired")}</label>
                <select
                  value={genDomain}
                  onChange={(e) => setGenDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  data-testid="select-domain"
                >
                  <option value="">{t("allied.alliedAdmin.selectDomain")}</option>
                  {career.domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.subtopicOptional")}</label>
                <input
                  type="text"
                  value={genSubtopic}
                  onChange={(e) => setGenSubtopic(e.target.value)}
                  placeholder="e.g., Ventilator Weaning"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  data-testid="input-subtopic"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.batchSize25100")}</label>
                <input
                  type="number"
                  value={genCount}
                  onChange={(e) => setGenCount(Math.max(25, Math.min(100, parseInt(e.target.value) || 25)))}
                  min={25}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  data-testid="input-batch-size"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerate}
                  disabled={generating || !genDomain}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-generate"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {generating ? "Generating..." : "Generate Batch"}
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
              <p><Shield className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.validationGatesRationaleMin600")}</p>
              <p><Target className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.blueprintgovernedDifficultycognitivedomainDi")}</p>
              <p><Brain className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.autoflashcards13CardsGeneratedPer")}</p>
            </div>
          </div>

          {selectedCareer === "psychotherapist" && (
            <div className="bg-white rounded-xl border border-indigo-100 p-6" data-testid="psychotherapy-bulk-panel">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" /> Psychotherapy 1000-Question Bulk Generator
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate 1,000 clinical vignette-style questions across all 6 domains (Therapeutic Modalities, Psychopathology, Assessment &amp; Diagnosis, Ethics &amp; Boundaries, Treatment Planning, Crisis Intervention) in 20 batches of 50.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-indigo-700">1,000</div>
                  <div className="text-xs text-indigo-500">{t("allied.alliedAdmin.targetQuestions")}</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-indigo-700">20</div>
                  <div className="text-xs text-indigo-500">{t("allied.alliedAdmin.batchesOf50")}</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-indigo-700">6</div>
                  <div className="text-xs text-indigo-500">{t("allied.alliedAdmin.domains2")}</div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={handlePsychBulkGenerate}
                  disabled={psychBulkRunning}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                  data-testid="button-psych-bulk-generate"
                >
                  {psychBulkRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {psychBulkRunning ? "Generating..." : "Start 1000-Question Generation"}
                </button>
                {psychBulkBatchId && (
                  <button
                    onClick={handleRefreshPsychStatus}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2"
                    data-testid="button-psych-refresh-status"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh Status
                  </button>
                )}
              </div>

              {psychBulkStatus && (
                <div className="border border-indigo-100 rounded-lg p-4 space-y-3" data-testid="psych-bulk-status">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      psychBulkStatus.status === "completed" ? "bg-green-50 text-green-700" :
                      psychBulkStatus.status === "running" ? "bg-blue-50 text-blue-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {psychBulkStatus.status}
                    </span>
                    <span className="text-xs text-gray-400">Batch ID: {psychBulkStatus.batchId?.slice(0, 8)}...</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-xs">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-gray-900">{psychBulkStatus.questions?.total || psychBulkStatus.generatedCount || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.generated")}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-700">{psychBulkStatus.questions?.pending || psychBulkStatus.acceptedCount || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.accepted")}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-red-700">{psychBulkStatus.questions?.rejected || psychBulkStatus.rejectedCount || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.rejected")}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-700">{psychBulkStatus.flashcards || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.flashcards3")}</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2">
                      <div className="text-lg font-bold text-amber-700">{psychBulkStatus.imageLinkedCount || 0}</div>
                      <div className="text-gray-500">{t("allied.alliedAdmin.imagelinked")}</div>
                    </div>
                  </div>

                  {psychBulkStatus.avgRationaleWords > 0 && (
                    <div className="text-xs text-gray-500">Avg rationale: {psychBulkStatus.avgRationaleWords} words</div>
                  )}

                  {psychBulkStatus.domainBreakdown && Object.keys(psychBulkStatus.domainBreakdown).length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.questionsByDomain")}</div>
                      <div className="space-y-1">
                        {Object.entries(psychBulkStatus.domainBreakdown).map(([domain, count]) => (
                          <PercentBar key={domain} label={domain} value={count as number} total={psychBulkStatus.questions?.total || psychBulkStatus.acceptedCount || 1} color="bg-indigo-400" />
                        ))}
                      </div>
                    </div>
                  )}

                  {psychBulkStatus.status === "completed" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Generation Complete
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {psychBulkStatus.questions?.pending || psychBulkStatus.acceptedCount || 0} questions ready for review.
                        {psychBulkStatus.flashcards || 0} flashcards auto-generated with lesson links.
                        Use the Batch History below to commit approved questions.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-600 space-y-1 mt-3">
                <p><Shield className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.productionDbVerifiedBeforeWrites")}</p>
                <p><Target className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.clinicalVignettesWithPatientDemographics")}</p>
                <p><Brain className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.autoflashcardsWithLessonLinksIn")}</p>
                <p><FileText className="w-3 h-3 inline mr-1" />{t("allied.alliedAdmin.coversCbtDbtEmdrPsychodynamic")}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="batch-history">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" /> Batch History
            </h3>
            {batches.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No batches yet for {career.shortName}</p>
            ) : (
              <div className="space-y-2">
                {batches.map(b => {
                  const isExpanded = expandedBatch === b.id;
                  const statusColor = b.status === "completed" ? "bg-green-50 text-green-700" :
                    b.status === "running" ? "bg-blue-50 text-blue-700" :
                    b.status === "committed" ? "bg-purple-50 text-purple-700" :
                    "bg-red-50 text-red-700";
                  return (
                    <div key={b.id} className="border border-gray-100 rounded-lg">
                      <button
                        onClick={() => setExpandedBatch(isExpanded ? null : b.id)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                        data-testid={`batch-${b.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>{b.status}</span>
                          <span className="text-sm text-gray-700">
                            {b.accepted_count}/{b.generated_count} accepted
                            {b.rejected_count > 0 && <span className="text-red-500 ml-1">({b.rejected_count} rejected)</span>}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(b.started_at).toLocaleString()}</span>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                          <div className="grid grid-cols-4 gap-3 text-center text-xs">
                            <div><div className="text-lg font-bold">{b.requested_count}</div><div className="text-gray-500">{t("allied.alliedAdmin.requested")}</div></div>
                            <div><div className="text-lg font-bold">{b.generated_count}</div><div className="text-gray-500">{t("allied.alliedAdmin.generated2")}</div></div>
                            <div><div className="text-lg font-bold text-green-600">{b.accepted_count}</div><div className="text-gray-500">{t("allied.alliedAdmin.accepted2")}</div></div>
                            <div><div className="text-lg font-bold text-red-500">{b.rejected_count}</div><div className="text-gray-500">{t("allied.alliedAdmin.rejected2")}</div></div>
                          </div>
                          {b.avg_rationale_words > 0 && (
                            <div className="text-xs text-gray-500">Avg rationale: {Math.round(b.avg_rationale_words)} words</div>
                          )}
                          {b.rejection_reasons && Object.keys(b.rejection_reasons).length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.rejectionReasons")}</div>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(b.rejection_reasons).map(([reason, count]) => (
                                  <span key={reason} className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full">{reason}: {count as number}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {b.difficulty_breakdown && Object.keys(b.difficulty_breakdown).length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.difficulty")}</div>
                              <div className="flex gap-2">
                                {Object.entries(b.difficulty_breakdown).map(([d, c]) => (
                                  <span key={d} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">L{d}: {c as number}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {b.status === "completed" && (
                            <button
                              onClick={() => handleCommitBatch(b.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 flex items-center gap-1.5"
                              data-testid={`commit-${b.id}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Commit Batch + Auto-Generate Flashcards
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "questions" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="questions-panel">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-500" /> Question Bank -- {career.shortName}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {careerStats?.totalQuestions || 0} questions in bank.
            Use the Generator tab to create new batches with blueprint governance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(careerStats?.domainBreakdown || {}).map(([domain, count]) => (
              <div key={domain} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500 truncate">{domain}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "revision" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="revision-panel">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" /> Revision Queue -- {career.shortName}
          </h3>
          {revisionQueue.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{t("allied.alliedAdmin.noItemsInRevisionQueue")}</p>
          ) : (
            <div className="space-y-3">
              {revisionQueue.map(item => (
                <div key={item.id} className="border border-gray-100 rounded-lg p-4" data-testid={`revision-${item.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-2">{item.stem || "No stem available"}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{item.blueprint_category}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">D{item.difficulty}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{item.cognitive_level}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.severity === "high" ? "bg-red-50 text-red-700" :
                          item.severity === "medium" ? "bg-amber-50 text-amber-700" :
                          "bg-blue-50 text-blue-700"
                        }`}>{item.severity}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Reason: {item.reason}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleResolveRevision(item.id, "resolved")}
                        className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs hover:bg-green-100"
                        data-testid={`resolve-${item.id}`}
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleResolveRevision(item.id, "dismissed")}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs hover:bg-gray-200"
                        data-testid={`dismiss-${item.id}`}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "automations" && (
        <div className="space-y-6" data-testid="automations-panel">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-500" /> Automation Center
            </h3>
            {isAdmin && (
              <div className="flex gap-2">
                <button onClick={handleSeedAutomations} className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700" data-testid="button-seed-automations">{t("allied.alliedAdmin.seedAllAutomations")}</button>
                <button onClick={() => handleKillSwitch(!automationStatus?.killSwitch)} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${automationStatus?.killSwitch ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} data-testid="button-kill-switch">
                  <Power className="w-3.5 h-3.5" /> {automationStatus?.killSwitch ? "Kill Switch ON" : "Kill Switch OFF"}
                </button>
              </div>
            )}
          </div>

          {automationStatus && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{automationStatus.totalAutomations}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedAdmin.total")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{automationStatus.enabledAutomations}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedAdmin.enabled")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{automationStatus.todayRuns}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedAdmin.runsToday")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{automationStatus.pendingDrafts}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedAdmin.pendingDrafts")}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className={`text-2xl font-bold ${automationStatus.failedToday > 0 ? "text-red-600" : "text-gray-400"}`}>{automationStatus.failedToday}</div>
                <div className="text-xs text-gray-500">{t("allied.alliedAdmin.failedToday")}</div>
              </div>
            </div>
          )}

          {Object.entries(
            automations.reduce((groups: Record<string, any[]>, a: any) => {
              const cat = a.category || "other";
              if (!groups[cat]) groups[cat] = [];
              groups[cat].push(a);
              return groups;
            }, {})
          ).map(([category, items]) => {
            const catInfo = CATEGORY_LABELS[category] || { label: category, icon: Settings, color: "text-gray-600" };
            const CatIcon = catInfo.icon;
            return (
              <div key={category} className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className={`font-medium mb-3 flex items-center gap-2 ${catInfo.color}`}>
                  <CatIcon className="w-4 h-4" /> {catInfo.label}
                  <span className="text-xs text-gray-400 font-normal ml-auto">{(items as any[]).filter((a: any) => a.enabled).length}/{(items as any[]).length} enabled</span>
                </h4>
                <div className="space-y-2">
                  {(items as any[]).map((a: any) => (
                    <div key={a.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 border border-gray-50" data-testid={`automation-${a.slug}`}>
                      {isAdmin ? (
                        <button onClick={() => handleToggleAutomation(a.id, !a.enabled)} className="flex-shrink-0" data-testid={`toggle-${a.slug}`}>
                          {a.enabled ? <ToggleRight className="w-6 h-6 text-teal-500" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                        </button>
                      ) : (
                        <span className="flex-shrink-0">
                          {a.enabled ? <ToggleRight className="w-6 h-6 text-gray-300" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">{a.name}</div>
                        <div className="text-xs text-gray-400 truncate">{a.description}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">{a.frequency}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">{a.max_items_per_run}/run</span>
                        {a.auto_publish && <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded">auto-pub</span>}
                        {a.last_run_at && <span className="text-gray-300">{new Date(a.last_run_at).toLocaleDateString()}</span>}
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleRunNow(a.id)} disabled={runningAutomation === a.id || automationStatus?.killSwitch} className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md text-xs font-medium hover:bg-teal-100 disabled:opacity-40 flex items-center gap-1" data-testid={`run-${a.slug}`}>
                          {runningAutomation === a.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Run
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {automations.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">{t("allied.alliedAdmin.noAutomationsConfiguredYet")}</p>
              {isAdmin ? (
                <button onClick={handleSeedAutomations} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700" data-testid="button-seed-empty">{t("allied.alliedAdmin.seed39Automations")}</button>
              ) : (
                <p className="text-xs text-gray-400" data-testid="text-admin-required">{t("allied.alliedAdmin.adminAccessRequiredToSeed")}</p>
              )}
            </div>
          )}

          {automationRuns.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {t("allied.alliedAdmin.recentRuns")}</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {automationRuns.map((run: any) => (
                  <div key={run.id} className="flex items-center gap-3 py-2 px-3 rounded-lg border border-gray-50 text-xs" data-testid={`run-${run.id}`}>
                    {run.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> :
                     run.status === "failed" ? <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /> :
                     <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />}
                    <span className="font-medium text-gray-700 w-40 truncate">{run.automation_slug}</span>
                    <span className="text-gray-400">{run.items_accepted || 0} accepted</span>
                    <span className="text-gray-400">{run.items_rejected || 0} rejected</span>
                    {run.error_message && <span className="text-red-500 truncate flex-1">{run.error_message}</span>}
                    <span className="text-gray-300 ml-auto">{new Date(run.started_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "drafts" && (
        <div className="space-y-6" data-testid="drafts-panel">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-500" /> Draft Review Queue
              <span className="text-xs font-normal text-gray-400">{draftsTotal} total</span>
            </h3>
            <select value={draftFilter} onChange={(e) => setDraftFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white" data-testid="select-draft-filter">
              <option value="">{t("allied.alliedAdmin.allTypes")}</option>
              <option value="question">{t("allied.alliedAdmin.questions2")}</option>
              <option value="flashcard">{t("allied.alliedAdmin.flashcards4")}</option>
              <option value="mock_exam">{t("allied.alliedAdmin.mockExams")}</option>
              <option value="seo_blog">{t("allied.alliedAdmin.seoBlog")}</option>
              <option value="comparison_page">{t("allied.alliedAdmin.comparisonPages")}</option>
              <option value="email_sequence">{t("allied.alliedAdmin.emailSequences")}</option>
              <option value="study_plan">{t("allied.alliedAdmin.studyPlans")}</option>
              <option value="bundle">{t("allied.alliedAdmin.bundles")}</option>
              <option value="ngn_case">{t("allied.alliedAdmin.ngnCases")}</option>
              <option value="rationale_expansion">{t("allied.alliedAdmin.rationaleExpansions")}</option>
              <option value="storefront_copy">{t("allied.alliedAdmin.storefrontCopy")}</option>
              <option value="faq_schema">{t("allied.alliedAdmin.faqSchema")}</option>
            </select>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <FileCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t("allied.alliedAdmin.noDraftsToReviewRun")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft: any) => (
                <div key={draft.id} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`draft-${draft.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          draft.status === "draft" ? "bg-amber-50 text-amber-700" :
                          draft.status === "approved" ? "bg-blue-50 text-blue-700" :
                          draft.status === "published" ? "bg-green-50 text-green-700" :
                          "bg-red-50 text-red-700"
                        }`}>{draft.status}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{draft.type}</span>
                        {draft.career_type && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">{draft.career_type}</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-800">{draft.title || "Untitled"}</p>
                      {draft.domain && <p className="text-xs text-gray-400">{draft.domain}</p>}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {draft.status === "draft" && (
                        <>
                          <button onClick={() => handleDraftAction(draft.id, "approved")} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100" data-testid={`approve-${draft.id}`}>{t("allied.alliedAdmin.approve")}</button>
                          <button onClick={() => handleDraftAction(draft.id, "published")} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium hover:bg-green-100" data-testid={`publish-${draft.id}`}>{t("allied.alliedAdmin.publish")}</button>
                          <button onClick={() => handleDraftAction(draft.id, "rejected")} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium hover:bg-red-100" data-testid={`reject-${draft.id}`}>{t("allied.alliedAdmin.reject")}</button>
                        </>
                      )}
                      {draft.status === "approved" && (
                        <button onClick={() => handleDraftAction(draft.id, "published")} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium hover:bg-green-100" data-testid={`publish-${draft.id}`}>{t("allied.alliedAdmin.publish2")}</button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 mt-2">{new Date(draft.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="analytics-panel">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" /> Pipeline Analytics -- {career.shortName}
            </h3>
            {!careerStats || careerStats.totalQuestions === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">{t("allied.alliedAdmin.noDataYetGenerateQuestions")}</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">{t("allied.alliedAdmin.domainDistribution")}</h4>
                  <div className="space-y-2">
                    {Object.entries(careerStats.domainBreakdown).sort(([,a],[,b]) => b - a).map(([domain, count]) => (
                      <PercentBar key={domain} label={domain} value={count} total={careerStats.totalQuestions} color="bg-teal-400" />
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">{t("allied.alliedAdmin.difficultyDistribution")}</h4>
                    <div className="space-y-2">
                      {[1,2,3,4,5].map(d => (
                        <PercentBar
                          key={d}
                          label={`Level ${d}`}
                          value={careerStats.difficultyBreakdown[d] || 0}
                          total={careerStats.totalQuestions}
                          color={d <= 2 ? "bg-green-400" : d === 3 ? "bg-yellow-400" : "bg-red-400"}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">{t("allied.alliedAdmin.cognitiveLevelDistribution")}</h4>
                    <div className="space-y-2">
                      {["recall", "application", "analysis"].map(level => (
                        <PercentBar
                          key={level}
                          label={level.charAt(0).toUpperCase() + level.slice(1)}
                          value={careerStats.cognitiveBreakdown[level] || 0}
                          total={careerStats.totalQuestions}
                          color={level === "recall" ? "bg-blue-400" : level === "application" ? "bg-purple-400" : "bg-orange-400"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{careerStats.avgRationaleWords}</div>
                      <div className="text-xs text-gray-500">{t("allied.alliedAdmin.avgRationaleWords")}</div>
                      <div className={`text-xs mt-1 ${careerStats.avgRationaleWords >= 600 ? "text-green-600" : "text-red-500"}`}>
                        {careerStats.avgRationaleWords >= 600 ? "Meets minimum" : "Below 600 threshold"}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{careerStats.rejectionRate}%</div>
                      <div className="text-xs text-gray-500">{t("allied.alliedAdmin.rejectionRate")}</div>
                      <div className={`text-xs mt-1 ${careerStats.rejectionRate <= 20 ? "text-green-600" : "text-amber-600"}`}>
                        {careerStats.rejectionRate <= 20 ? "Healthy" : "Review prompt quality"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "blueprints" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="blueprints-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-500" /> Blueprint Governance -- {career.shortName}
              </h3>
              <button
                onClick={handleCreateBlueprint}
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700"
                data-testid="button-create-blueprint"
              >
                + New Blueprint Version
              </button>
            </div>
            {blueprints.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-3">No blueprint yet for {career.shortName}</p>
                <p className="text-xs text-gray-400">{t("allied.alliedAdmin.createOneToEnableBatch")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blueprints.map((bp: any) => {
                  const domains = typeof bp.domains === "string" ? JSON.parse(bp.domains) : bp.domains;
                  const diffDist = typeof bp.difficulty_distribution === "string" ? JSON.parse(bp.difficulty_distribution) : bp.difficulty_distribution;
                  const cogDist = typeof bp.cognitive_distribution === "string" ? JSON.parse(bp.cognitive_distribution) : bp.cognitive_distribution;
                  const allowedTypes = typeof bp.allowed_question_types === "string" ? JSON.parse(bp.allowed_question_types) : bp.allowed_question_types;
                  return (
                    <div key={bp.id} className={`border rounded-lg p-4 ${bp.is_active ? "border-teal-200 bg-teal-50/30" : "border-gray-100"}`} data-testid={`blueprint-${bp.id}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">v{bp.version}</span>
                          {bp.is_active && <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">{t("allied.alliedAdmin.active")}</span>}
                        </div>
                        <span className="text-xs text-gray-400">{new Date(bp.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <div className="font-medium text-gray-600 mb-1">Domains ({Object.keys(domains).length})</div>
                          <div className="space-y-0.5">
                            {Object.entries(domains).map(([d, w]) => (
                              <div key={d} className="flex justify-between text-gray-500">
                                <span className="truncate">{d}</span>
                                <span>{(Number(w) * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.difficultyDistribution2")}</div>
                          {Object.entries(diffDist).map(([d, w]) => (
                            <div key={d} className="flex justify-between text-gray-500">
                              <span>Level {d}</span>
                              <span>{(Number(w) * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                          <div className="font-medium text-gray-600 mt-2 mb-1">{t("allied.alliedAdmin.cognitiveTargets")}</div>
                          {Object.entries(cogDist).map(([level, range]: [string, any]) => (
                            <div key={level} className="flex justify-between text-gray-500">
                              <span className="capitalize">{level}</span>
                              <span>{Math.round(range.min * 100)}-{Math.round(range.max * 100)}%</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="font-medium text-gray-600 mb-1">{t("allied.alliedAdmin.allowedQuestionTypes")}</div>
                          <div className="flex flex-wrap gap-1">
                            {allowedTypes.map((t: string) => (
                              <span key={t} className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.thresholdConfiguration")}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 mb-1">{t("allied.alliedAdmin.similarityThreshold")}</div>
                <div className="text-lg font-bold text-gray-900">0.80</div>
                <div className="text-gray-400">{t("allied.alliedAdmin.rejectDuplicatesAbove")}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 mb-1">{t("allied.alliedAdmin.minRationaleWords")}</div>
                <div className="text-lg font-bold text-gray-900">600</div>
                <div className="text-gray-400">{t("allied.alliedAdmin.hardFailBelow")}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 mb-1">{t("allied.alliedAdmin.maxRecall")}</div>
                <div className="text-lg font-bold text-gray-900">30%</div>
                <div className="text-gray-400">{t("allied.alliedAdmin.perBatchCap")}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 mb-1">{t("allied.alliedAdmin.minAnalysis")}</div>
                <div className="text-lg font-bold text-gray-900">20%</div>
                <div className="text-gray-400">{t("allied.alliedAdmin.perBatchFloor")}</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              To adjust thresholds, edit the constants at the top of server/allied-pipeline.ts:
              SIMILARITY_THRESHOLD, MIN_RATIONALE_WORDS, and DEFAULT_COGNITIVE_DIST.
            </p>
          </div>
        </div>
      )}

      {tab === "store" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="store-panel">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Archive className="w-5 h-5 text-teal-500" /> Store Management -- {career.shortName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4" data-testid="store-stat-products">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.publishedProducts")}</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-400">{t("allied.alliedAdmin.questionSetsAvailableForPurchase")}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4" data-testid="store-stat-revenue">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.revenue30d")}</div>
                <div className="text-2xl font-bold text-gray-900">$0.00</div>
                <div className="text-xs text-gray-400">From {career.shortName} products</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4" data-testid="store-stat-purchases">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.purchases30d")}</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-400">{t("allied.alliedAdmin.totalTransactions")}</div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.productCatalog")}</h4>
              <div className="text-center py-8">
                <Archive className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-2">No products published yet for {career.shortName}</p>
                <p className="text-xs text-gray-400 mb-4">{t("allied.alliedAdmin.createAQuestionSetAnd")}</p>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700" data-testid="button-create-product">
                  + Create Product
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="store-validation-panel">
            <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.publishingValidationChecklist")}</h4>
            <div className="space-y-2">
              {[
                { label: "Minimum 50 questions in set", status: "pending" },
                { label: "All questions have rationales (600+ words)", status: "pending" },
                { label: "Domain coverage meets blueprint minimums", status: "pending" },
                { label: "Difficulty distribution balanced (20/60/20)", status: "pending" },
                { label: "No flagged or revision-pending items", status: "pending" },
                { label: "At least 3 question types represented", status: "pending" },
              ].map(check => (
                <div key={check.label} className="flex items-center gap-2 text-sm" data-testid={`check-${check.label.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}>
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-gray-400" />
                  </div>
                  <span className="text-gray-600">{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "qbank" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="qbank-panel">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-teal-500" /> QBank Administration -- {career.shortName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4" data-testid="qbank-stat-total">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.totalItems")}</div>
                <div className="text-2xl font-bold text-gray-900">{careerStats?.totalQuestions || 0}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4" data-testid="qbank-stat-active">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.active2")}</div>
                <div className="text-2xl font-bold text-teal-600">{careerStats?.totalQuestions ? careerStats.totalQuestions - (careerStats.flaggedCount || 0) : 0}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4" data-testid="qbank-stat-flagged">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.flagged")}</div>
                <div className="text-2xl font-bold text-amber-600">{careerStats?.flaggedCount || 0}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4" data-testid="qbank-stat-revision">
                <div className="text-sm text-gray-500 mb-1">{t("allied.alliedAdmin.pendingRevision")}</div>
                <div className="text-2xl font-bold text-red-600">{careerStats?.pendingRevisions || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.domainDistribution2")}</h4>
                <div className="space-y-2">
                  {careerStats?.domainBreakdown ? Object.entries(careerStats.domainBreakdown).map(([domain, count]) => (
                    <PercentBar key={domain} label={domain} value={count as number} total={careerStats.totalQuestions} color="bg-teal-500" />
                  )) : (
                    <p className="text-sm text-gray-400 py-4 text-center">{t("allied.alliedAdmin.noDomainDataAvailableYet")}</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.difficultyDistribution3")}</h4>
                <div className="space-y-2">
                  {careerStats?.difficultyBreakdown ? Object.entries(careerStats.difficultyBreakdown).map(([level, count]) => (
                    <PercentBar key={level} label={`Level ${level}`} value={count as number} total={careerStats.totalQuestions} color="bg-cyan-500" />
                  )) : (
                    <p className="text-sm text-gray-400 py-4 text-center">{t("allied.alliedAdmin.noDifficultyDataAvailableYet")}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.cognitiveLevelDistribution2")}</h4>
              <div className="grid grid-cols-3 gap-4">
                {careerStats?.cognitiveBreakdown ? Object.entries(careerStats.cognitiveBreakdown).map(([level, count]) => {
                  const pct = careerStats.totalQuestions > 0 ? ((count as number) / careerStats.totalQuestions * 100).toFixed(0) : "0";
                  return (
                    <div key={level} className="bg-gray-50 rounded-lg p-3 text-center" data-testid={`qbank-cog-${level}`}>
                      <div className="text-xs text-gray-500 capitalize mb-1">{level}</div>
                      <div className="text-lg font-bold text-gray-900">{pct}%</div>
                      <div className="text-xs text-gray-400">{count as number} items</div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-gray-400 py-4 text-center col-span-3">{t("allied.alliedAdmin.noCognitiveDataAvailableYet")}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t("allied.alliedAdmin.quickActions")}</h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100" data-testid="button-export-qbank">
                  Export Questions (CSV)
                </button>
                <button className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100" data-testid="button-bulk-review">
                  Bulk Review Flagged
                </button>
                <button className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100" data-testid="button-domain-audit">
                  Domain Coverage Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "scenarios" && (
        <ScenarioAdminPanel />
      )}

      {tab === "articles" && (
        <ArticleAdminPanel />
      )}
    </div>
  );
}
