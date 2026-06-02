import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Loader2, RefreshCw, Plus, Play, Pause, CheckCircle2, XCircle,
  TrendingUp, BarChart3, Calendar, Clock, Zap, FileText,
  BookOpen, Brain, Target, AlertTriangle, ChevronDown, ChevronRight,
  Trash2, ToggleLeft, ToggleRight,
} from "lucide-react";

interface Schedule {
  id: string;
  content_type: string;
  cadence: string;
  enabled: boolean;
  items_per_run: number;
  run_time_hour: number;
  max_daily_runs: number;
  priority_topics: string[];
  target_tier: string;
  last_run_at: string | null;
  next_run_at: string | null;
  total_runs: number;
  total_items_generated: number;
}

interface Run {
  id: string;
  schedule_id: string | null;
  content_type: string;
  status: string;
  target_count: number;
  generated_count: number;
  accepted_count: number;
  rejected_count: number;
  validation_results: any[];
  topics_prioritized: string[];
  gap_analysis: any;
  error_message: string | null;
  triggered_by: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface GapAnalysis {
  underrepresentedSystems: { system: string; count: number; targetCount: number }[];
  lowCoverageTopics: string[];
  suggestedKeywords: string[];
  totalContentByType: Record<string, number>;
}

interface Stats {
  schedules: { total_schedules: number; active_schedules: number };
  runs: {
    total_runs: number;
    completed_runs: number;
    failed_runs: number;
    running_runs: number;
    queued_runs: number;
    total_generated: number;
    total_accepted: number;
    total_rejected: number;
  };
  recentRuns: Run[];
  pendingReview: {
    contentItems: { draft_count: number; needs_review_count: number; published_count: number };
    flashcards: number;
    examQuestions: number;
  };
}

interface Draft {
  id: string;
  title: string;
  slug: string;
  type: string;
  body_system: string;
  status: string;
  summary: string;
  seo_title: string;
  tags: string[];
  created_at: string;
}

const CONTENT_TYPE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  blog_post: { label: "Blog Posts", icon: FileText, color: "text-blue-600" },
  flashcards: { label: "Flashcards", icon: Brain, color: "text-purple-600" },
  lessons: { label: "Lessons", icon: BookOpen, color: "text-green-600" },
  exam_questions: { label: "Exam Questions", icon: Target, color: "text-amber-600" },
  specialty_guides: { label: "Specialty Guides", icon: Zap, color: "text-teal-600" },
};

const STATUS_COLORS: Record<string, string> = {
  queued: "bg-gray-100 text-gray-700",
  running: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  partial: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

function formatDate(d: string | null): string {

  if (!d) return "Never";
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AdminContentGrowth() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "schedules" | "runs" | "drafts" | "gaps">("overview");
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    contentType: "blog_post",
    cadence: "daily",
    itemsPerRun: 3,
    runTimeHour: 3,
    maxDailyRuns: 1,
    targetTier: "rn",
  });
  const [manualRunType, setManualRunType] = useState("blog_post");
  const [manualRunCount, setManualRunCount] = useState(3);
  const [runningManual, setRunningManual] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, schedulesRes, runsRes, draftsRes] = await Promise.all([
        adminFetch("/api/admin/content-growth/stats"),
        adminFetch("/api/admin/content-growth/schedules"),
        adminFetch("/api/admin/content-growth/runs?limit=50"),
        adminFetch("/api/admin/content-growth/pending-drafts?limit=50"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (schedulesRes.ok) {
        const data = await schedulesRes.json();
        setSchedules(data.schedules || []);
      }
      if (runsRes.ok) {
        const data = await runsRes.json();
        setRuns(data.runs || []);
      }
      if (draftsRes.ok) {
        const data = await draftsRes.json();
        setDrafts(data.drafts || []);
      }
    } catch (err) {
      console.error("Failed to fetch content growth data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGapAnalysis = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/content-growth/gap-analysis");
      if (res.ok) setGapAnalysis(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (activeSubTab === "gaps" && !gapAnalysis) {
      fetchGapAnalysis();
    }
  }, [activeSubTab, gapAnalysis, fetchGapAnalysis]);

  const handleCreateSchedule = async () => {
    try {
      const res = await adminFetch("/api/admin/content-growth/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });
      if (res.ok) {
        setShowNewSchedule(false);
        fetchAll();
      }
    } catch {}
  };

  const handleToggleSchedule = async (id: string) => {
    try {
      await adminFetch(`/api/admin/content-growth/schedules/${id}/toggle`, { method: "PUT" });
      fetchAll();
    } catch {}
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await adminFetch(`/api/admin/content-growth/schedules/${id}`, { method: "DELETE" });
      fetchAll();
    } catch {}
  };

  const handleManualRun = async () => {
    setRunningManual(true);
    try {
      await adminFetch("/api/admin/content-growth/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: manualRunType, targetCount: manualRunCount }),
      });
      setTimeout(fetchAll, 2000);
    } catch {} finally {
      setRunningManual(false);
    }
  };

  const handleApproveDraft = async (id: string) => {
    try {
      await adminFetch(`/api/admin/content-growth/drafts/${id}/approve`, { method: "PUT" });
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch {}
  };

  const handleRejectDraft = async (id: string) => {
    try {
      await adminFetch(`/api/admin/content-growth/drafts/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Rejected by admin" }),
      });
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch {}
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20" data-testid="loading-content-growth">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const subTabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "schedules" as const, label: "Schedules", icon: Calendar },
    { id: "runs" as const, label: "Generation Runs", icon: Play },
    { id: "drafts" as const, label: "Pending Drafts", icon: FileText },
    { id: "gaps" as const, label: "Content Gaps", icon: Target },
  ];

  return (
    <div className="space-y-6" data-testid="admin-content-growth">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900" data-testid="text-content-growth-title">{t("pages.adminContentGrowth.contentGrowthEngine")}</h2>
            <p className="text-sm text-gray-500">{t("pages.adminContentGrowth.automatedContentGenerationWithQuality")}</p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
          data-testid="button-refresh-growth"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="section-growth-stats">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-gray-900" data-testid="stat-total-generated">{stats.runs.total_generated}</div>
            <div className="text-xs text-gray-500">{t("pages.adminContentGrowth.totalGenerated")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-green-600" data-testid="stat-total-accepted">{stats.runs.total_accepted}</div>
            <div className="text-xs text-gray-500">{t("pages.adminContentGrowth.accepted")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-red-600" data-testid="stat-total-rejected">{stats.runs.total_rejected}</div>
            <div className="text-xs text-gray-500">{t("pages.adminContentGrowth.rejected")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-2xl font-bold text-blue-600" data-testid="stat-pending-review">
              {(stats.pendingReview.contentItems.draft_count || 0) + (stats.pendingReview.contentItems.needs_review_count || 0) + stats.pendingReview.flashcards + stats.pendingReview.examQuestions}
            </div>
            <div className="text-xs text-gray-500">{t("pages.adminContentGrowth.pendingReview")}</div>
          </div>
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5" data-testid="nav-growth-subtabs">
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSubTab === t.id ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            data-testid={`subtab-${t.id}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {activeSubTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">{t("pages.adminContentGrowth.scheduleSummary")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("pages.adminContentGrowth.totalSchedules")}</span>
                  <span className="font-medium">{stats.schedules.total_schedules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("pages.adminContentGrowth.activeSchedules")}</span>
                  <span className="font-medium text-green-600">{stats.schedules.active_schedules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("pages.adminContentGrowth.totalRuns")}</span>
                  <span className="font-medium">{stats.runs.total_runs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("pages.adminContentGrowth.successRate")}</span>
                  <span className="font-medium">
                    {stats.runs.total_runs > 0
                      ? `${Math.round((stats.runs.completed_runs / stats.runs.total_runs) * 100)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">{t("pages.adminContentGrowth.quickGenerate")}</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={manualRunType}
                    onChange={e => setManualRunType(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="select-manual-type"
                  >
                    {Object.entries(CONTENT_TYPE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={manualRunCount}
                    onChange={e => setManualRunCount(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="input-manual-count"
                  />
                </div>
                <button
                  onClick={handleManualRun}
                  disabled={runningManual}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  data-testid="button-manual-generate"
                >
                  {runningManual ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {runningManual ? "Starting..." : "Generate Now"}
                </button>
              </div>
            </div>
          </div>

          {stats.recentRuns.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">{t("pages.adminContentGrowth.recentRuns")}</h3>
              <div className="space-y-2">
                {stats.recentRuns.slice(0, 5).map(run => {
                  const typeInfo = CONTENT_TYPE_LABELS[run.content_type] || { label: run.content_type, color: "text-gray-600" };
                  return (
                    <div key={run.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50" data-testid={`recent-run-${run.id}`}>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[run.status] || "bg-gray-100"}`}>
                          {run.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span>{run.accepted_count}/{run.generated_count} accepted</span>
                        <span>{formatDate(run.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "schedules" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">{t("pages.adminContentGrowth.generationSchedules")}</h3>
            <button
              onClick={() => setShowNewSchedule(!showNewSchedule)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              data-testid="button-new-schedule"
            >
              <Plus className="w-4 h-4" /> New Schedule
            </button>
          </div>

          {showNewSchedule && (
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 space-y-3" data-testid="form-new-schedule">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t("pages.adminContentGrowth.contentType")}</label>
                  <select
                    value={newSchedule.contentType}
                    onChange={e => setNewSchedule({ ...newSchedule, contentType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="select-schedule-type"
                  >
                    {Object.entries(CONTENT_TYPE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t("pages.adminContentGrowth.cadence")}</label>
                  <select
                    value={newSchedule.cadence}
                    onChange={e => setNewSchedule({ ...newSchedule, cadence: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="select-schedule-cadence"
                  >
                    <option value="daily">{t("pages.adminContentGrowth.daily")}</option>
                    <option value="weekly">{t("pages.adminContentGrowth.weekly")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t("pages.adminContentGrowth.itemsPerRun")}</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newSchedule.itemsPerRun}
                    onChange={e => setNewSchedule({ ...newSchedule, itemsPerRun: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="input-schedule-items"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t("pages.adminContentGrowth.runTimeUtcHour")}</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={newSchedule.runTimeHour}
                    onChange={e => setNewSchedule({ ...newSchedule, runTimeHour: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="input-schedule-hour"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t("pages.adminContentGrowth.targetTier")}</label>
                  <select
                    value={newSchedule.targetTier}
                    onChange={e => setNewSchedule({ ...newSchedule, targetTier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid="select-schedule-tier"
                  >
                    <option value="rpn">{t("pages.adminContentGrowth.rpnlvn")}</option>
                    <option value="rn">RN</option>
                    <option value="np">NP</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateSchedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  data-testid="button-save-schedule"
                >
                  Create Schedule
                </button>
                <button
                  onClick={() => setShowNewSchedule(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                  data-testid="button-cancel-schedule"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {schedules.length === 0 ? (
            <div className="text-center py-10 text-gray-500" data-testid="text-no-schedules">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>{t("pages.adminContentGrowth.noSchedulesConfiguredYetCreate")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map(schedule => {
                const typeInfo = CONTENT_TYPE_LABELS[schedule.content_type] || { label: schedule.content_type, icon: FileText, color: "text-gray-600" };
                const TypeIcon = typeInfo.icon;
                return (
                  <div key={schedule.id} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`schedule-${schedule.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                        <div>
                          <span className="font-medium text-gray-900">{typeInfo.label}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {schedule.cadence} at {String(schedule.run_time_hour).padStart(2, "0")}:00 UTC
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${schedule.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {schedule.enabled ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{schedule.items_per_run} items/run</span>
                        <span className="text-xs text-gray-500">{schedule.total_items_generated} total generated</span>
                        <button
                          onClick={() => handleToggleSchedule(schedule.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          data-testid={`button-toggle-schedule-${schedule.id}`}
                        >
                          {schedule.enabled ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
                          data-testid={`button-delete-schedule-${schedule.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {schedule.next_run_at && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next run: {formatDate(schedule.next_run_at)}
                        {schedule.last_run_at && <> | Last run: {formatDate(schedule.last_run_at)}</>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "runs" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">{t("pages.adminContentGrowth.generationHistory")}</h3>
          {runs.length === 0 ? (
            <div className="text-center py-10 text-gray-500" data-testid="text-no-runs">
              <Play className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>{t("pages.adminContentGrowth.noGenerationRunsYetUse")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map(run => {
                const typeInfo = CONTENT_TYPE_LABELS[run.content_type] || { label: run.content_type, color: "text-gray-600" };
                const isExpanded = expandedRun === run.id;
                return (
                  <div key={run.id} className="bg-white rounded-xl border border-gray-100" data-testid={`run-${run.id}`}>
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        <span className={`font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[run.status] || "bg-gray-100"}`}>
                          {run.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {run.triggered_by === "manual" ? "Manual" : "Scheduled"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="text-green-600">{run.accepted_count} accepted</span>
                        <span className="text-red-500">{run.rejected_count} rejected</span>
                        <span>{formatDate(run.created_at)}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 block text-xs">{t("pages.adminContentGrowth.targetCount")}</span>
                            <span className="font-medium">{run.target_count}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">{t("pages.adminContentGrowth.generated")}</span>
                            <span className="font-medium">{run.generated_count}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">{t("pages.adminContentGrowth.started")}</span>
                            <span className="font-medium">{formatDate(run.started_at)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">{t("pages.adminContentGrowth.completed")}</span>
                            <span className="font-medium">{formatDate(run.completed_at)}</span>
                          </div>
                        </div>

                        {run.error_message && (
                          <div className="bg-red-50 rounded-lg p-3 text-sm text-red-700">
                            <AlertTriangle className="w-4 h-4 inline mr-1" />
                            {run.error_message}
                          </div>
                        )}

                        {Array.isArray(run.topics_prioritized) && run.topics_prioritized.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">{t("pages.adminContentGrowth.prioritizedTopics")}</span>
                            <div className="flex flex-wrap gap-1">
                              {run.topics_prioritized.map((topic: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{topic}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {Array.isArray(run.validation_results) && run.validation_results.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">{t("pages.adminContentGrowth.validationResults")}</span>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {run.validation_results.map((vr: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  {vr.validation?.passed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                  )}
                                  <span className="text-gray-700 truncate">{vr.topic}</span>
                                  <span className="text-gray-400">Score: {vr.validation?.score || 0}%</span>
                                  {vr.rejection && <span className="text-red-500">({vr.rejection})</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "drafts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">{t("pages.adminContentGrowth.pendingDraftsForReview")}</h3>
            <span className="text-sm text-gray-500">{drafts.length} items</span>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-10 text-gray-500" data-testid="text-no-drafts">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>{t("pages.adminContentGrowth.noPendingDraftsToReview")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map(draft => (
                <div key={draft.id} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`draft-${draft.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{draft.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{draft.type}</span>
                        {draft.body_system && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">{draft.body_system}</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${draft.status === "draft" ? "bg-yellow-50 text-yellow-700" : "bg-orange-50 text-orange-700"}`}>
                          {draft.status}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(draft.created_at)}</span>
                      </div>
                      {draft.summary && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{draft.summary}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleApproveDraft(draft.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                        data-testid={`button-approve-${draft.id}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectDraft(draft.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200"
                        data-testid={`button-reject-${draft.id}`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "gaps" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">{t("pages.adminContentGrowth.contentGapAnalysis")}</h3>
            <button
              onClick={fetchGapAnalysis}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
              data-testid="button-refresh-gaps"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Analysis
            </button>
          </div>

          {!gapAnalysis ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t("pages.adminContentGrowth.contentLibraryTotals")}</h4>
                <div className="space-y-2">
                  {Object.entries(gapAnalysis.totalContentByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center text-sm" data-testid={`gap-total-${type}`}>
                      <span className="text-gray-600 capitalize">{type.replace(/_/g, " ")}</span>
                      <span className="font-medium text-gray-900">{(count as number).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t("pages.adminContentGrowth.underrepresentedBodySystems")}</h4>
                {gapAnalysis.underrepresentedSystems.length === 0 ? (
                  <p className="text-sm text-gray-500">{t("pages.adminContentGrowth.allBodySystemsHaveAdequate")}</p>
                ) : (
                  <div className="space-y-2">
                    {gapAnalysis.underrepresentedSystems.slice(0, 8).map(sys => (
                      <div key={sys.system} className="flex items-center gap-2" data-testid={`gap-system-${sys.system}`}>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-700">{sys.system}</span>
                            <span className="text-gray-500">{sys.count}/{sys.targetCount}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${sys.count / sys.targetCount < 0.3 ? "bg-red-400" : sys.count / sys.targetCount < 0.6 ? "bg-yellow-400" : "bg-green-400"}`}
                              style={{ width: `${Math.min(100, (sys.count / sys.targetCount) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">{t("pages.adminContentGrowth.suggestedSeoKeywordsUntargeted")}</h4>
                {gapAnalysis.suggestedKeywords.length === 0 ? (
                  <p className="text-sm text-gray-500">{t("pages.adminContentGrowth.allSuggestedKeywordsAreAlready")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {gapAnalysis.suggestedKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm" data-testid={`gap-keyword-${i}`}>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
