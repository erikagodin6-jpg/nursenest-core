import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  BarChart3,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  X,
  Link,
  Zap,
  Clock,
  Target,
  Flag,
  Eye,
  Map,
} from "lucide-react";

type Tab = "dashboard" | "review" | "roadmap";

interface DashboardData {
  bySource: { source: string; total: number; pending: number; approved: number; flagged: number; avgQuality: number }[];
  missing: Record<string, number>;
  totalsBySource: Record<string, number>;
  qualityDistribution: { quality_bracket: string; count: number }[];
  recentExplanations: any[];
  coveragePercent: number;
  totalExplanations: number;
  totalQuestions: number;
}

interface Explanation {
  id: string;
  questionId: string;
  questionSource: string;
  correctAnswerExplanation: string;
  incorrectAnswerRationale: any;
  clinicalReasoning: string | null;
  keyTakeaway: string | null;
  mnemonic: string | null;
  clinicalPearl: string | null;
  referenceSource: string | null;
  qualityScore: any;
  reviewStatus: string;
  generatedBy: string;
  relatedContent: any;
  createdAt: string;
  updatedAt: string;
}

interface ReviewQueueData {
  rows: Explanation[];
  total: number;
}

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
}

const SOURCE_LABELS: Record<string, string> = {
  exam_questions: "Exam Questions",
  allied_questions: "Allied Health",
  imaging_questions: "Imaging",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  flagged: "bg-red-100 text-red-800",
};

const QUALITY_COLORS: Record<string, string> = {
  excellent: "bg-emerald-100 text-emerald-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-amber-100 text-amber-800",
  poor: "bg-red-100 text-red-800",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-blue-100 text-blue-800",
};

export default function AdminExplanationsPage() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
              Explanation Engine
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage explanation quality, review AI-generated content, and track coverage
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {([
            { key: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
            { key: "review" as Tab, label: "Review Queue", icon: FileText },
            { key: "roadmap" as Tab, label: "Roadmap", icon: Map },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
              data-testid={`tab-${key}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "review" && <ReviewQueueTab />}
        {activeTab === "roadmap" && <RoadmapTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/explanations/dashboard");
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const triggerBatchGeneration = async (source: string) => {
    setGenerating(source);
    try {
      const res = await adminFetch("/api/admin/explanations/batch-generate-by-career", {
        method: "POST",
        body: { source, batchSize: 5 },
      });
      if (res.ok) {
        const result = await res.json();
        alert(`Generated ${result.generated} explanations, ${result.failed} failed`);
        fetchDashboard();
      }
    } catch (e) {
      console.error("Batch generation error:", e);
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) return <p className="text-gray-500" data-testid="text-no-data">{t("pages.adminExplanations.failedToLoadDashboardData")}</p>;

  const totalMissing = Object.values(data.missing).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("pages.adminExplanations.totalExplanations")}</p>
                <p className="text-2xl font-bold" data-testid="text-total-explanations">{data.totalExplanations}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("pages.adminExplanations.coverage")}</p>
                <p className="text-2xl font-bold" data-testid="text-coverage-percent">{data.coveragePercent}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("pages.adminExplanations.missing")}</p>
                <p className="text-2xl font-bold text-red-600" data-testid="text-total-missing">{totalMissing}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("pages.adminExplanations.totalQuestions")}</p>
                <p className="text-2xl font-bold" data-testid="text-total-questions">{data.totalQuestions}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminExplanations.coverageBySource")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.bySource.map((s) => {
                const totalForSource = data.totalsBySource[s.source] || 1;
                const pct = Math.round((s.total / totalForSource) * 100);
                return (
                  <div key={s.source} className="space-y-2" data-testid={`source-stats-${s.source}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{SOURCE_LABELS[s.source] || s.source}</span>
                      <span className="text-sm text-gray-500">{s.total} / {totalForSource} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge className={STATUS_COLORS.approved}>Approved: {s.approved}</Badge>
                      <Badge className={STATUS_COLORS.pending}>Pending: {s.pending}</Badge>
                      <Badge className={STATUS_COLORS.flagged}>Flagged: {s.flagged}</Badge>
                      <Badge className="bg-gray-100 text-gray-700">Avg Quality: {s.avgQuality}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerBatchGeneration(s.source)}
                        disabled={generating !== null}
                        data-testid={`button-generate-${s.source}`}
                      >
                        {generating === s.source ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        ) : (
                          <Zap className="w-3 h-3 mr-1" />
                        )}
                        Generate Batch
                      </Button>
                    </div>
                  </div>
                );
              })}
              {data.bySource.length === 0 && (
                <p className="text-sm text-gray-400">{t("pages.adminExplanations.noExplanationsGeneratedYet")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminExplanations.qualityDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.qualityDistribution.map((q) => (
                <div key={q.quality_bracket} className="flex items-center justify-between" data-testid={`quality-${q.quality_bracket}`}>
                  <Badge className={QUALITY_COLORS[q.quality_bracket] || "bg-gray-100"}>
                    {q.quality_bracket.charAt(0).toUpperCase() + q.quality_bracket.slice(1)}
                  </Badge>
                  <span className="text-sm font-medium">{q.count}</span>
                </div>
              ))}
              {data.qualityDistribution.length === 0 && (
                <p className="text-sm text-gray-400">{t("pages.adminExplanations.noQualityDataAvailable")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("pages.adminExplanations.missingExplanationsBySource")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.missing).map(([source, count]) => (
              <div key={source} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid={`missing-${source}`}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{SOURCE_LABELS[source] || source}</p>
                <p className="text-xl font-bold text-red-600">{count}</p>
                <p className="text-xs text-gray-500">{t("pages.adminExplanations.questionsWithoutExplanations")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("pages.adminExplanations.recentlyGenerated")}</CardTitle>
            <Button size="sm" variant="ghost" onClick={fetchDashboard} data-testid="button-refresh-dashboard">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.recentExplanations.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{e.correctAnswerExplanation?.substring(0, 80)}...</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{SOURCE_LABELS[e.questionSource] || e.questionSource}</Badge>
                    <Badge className={`text-xs ${STATUS_COLORS[e.reviewStatus]}`}>{e.reviewStatus}</Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-2">
                  {e.qualityScore?.composite ?? "—"}
                </div>
              </div>
            ))}
            {data.recentExplanations.length === 0 && (
              <p className="text-sm text-gray-400">{t("pages.adminExplanations.noRecentExplanations")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewQueueTab() {
  const [data, setData] = useState<ReviewQueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    minQuality: "",
    maxQuality: "",
    generatedBy: "",
  });
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Explanation>>({});
  const [saving, setSaving] = useState(false);
  const [relatedContent, setRelatedContent] = useState<any>(null);
  const [showRelated, setShowRelated] = useState<string | null>(null);
  const pageSize = 20;

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.source) params.set("source", filters.source);
      if (filters.minQuality) params.set("minQuality", filters.minQuality);
      if (filters.maxQuality) params.set("maxQuality", filters.maxQuality);
      if (filters.generatedBy) params.set("generatedBy", filters.generatedBy);
      params.set("limit", String(pageSize));
      params.set("offset", String(page * pageSize));

      const res = await adminFetch(`/api/admin/explanations/review-queue?${params}`);
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error("Review queue fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await adminFetch(`/api/admin/explanations/${id}`, {
        method: "PATCH",
        body: { reviewStatus: status },
      });
      if (res.ok) fetchQueue();
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const startEditing = (exp: Explanation) => {
    setEditingId(exp.id);
    setEditForm({
      correctAnswerExplanation: exp.correctAnswerExplanation,
      clinicalReasoning: exp.clinicalReasoning || "",
      keyTakeaway: exp.keyTakeaway || "",
      mnemonic: exp.mnemonic || "",
      clinicalPearl: exp.clinicalPearl || "",
      referenceSource: exp.referenceSource || "",
    });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/explanations/${id}`, {
        method: "PATCH",
        body: editForm,
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        fetchQueue();
      }
    } catch (e) {
      console.error("Save edit error:", e);
    } finally {
      setSaving(false);
    }
  };

  const fetchRelated = async (id: string) => {
    if (showRelated === id) {
      setShowRelated(null);
      setRelatedContent(null);
      return;
    }
    try {
      const res = await adminFetch(`/api/admin/explanations/${id}/related`);
      if (res.ok) {
        setRelatedContent(await res.json());
        setShowRelated(id);
      }
    } catch (e) {
      console.error("Related content fetch error:", e);
    }
  };

  const linkRelated = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/explanations/${id}/link-related`, { method: "POST" });
      if (res.ok) {
        alert("Related content linked successfully");
        fetchQueue();
      }
    } catch (e) {
      console.error("Link related error:", e);
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.status}
              onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(0); }}
              className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              data-testid="select-filter-status"
            >
              <option value="">{t("pages.adminExplanations.allStatuses")}</option>
              <option value="pending">{t("pages.adminExplanations.pending")}</option>
              <option value="approved">{t("pages.adminExplanations.approved")}</option>
              <option value="flagged">{t("pages.adminExplanations.flagged")}</option>
            </select>
            <select
              value={filters.source}
              onChange={(e) => { setFilters(f => ({ ...f, source: e.target.value })); setPage(0); }}
              className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              data-testid="select-filter-source"
            >
              <option value="">{t("pages.adminExplanations.allSources")}</option>
              <option value="exam_questions">{t("pages.adminExplanations.examQuestions")}</option>
              <option value="allied_questions">{t("pages.adminExplanations.alliedHealth")}</option>
              <option value="imaging_questions">{t("pages.adminExplanations.imaging")}</option>
            </select>
            <select
              value={filters.generatedBy}
              onChange={(e) => { setFilters(f => ({ ...f, generatedBy: e.target.value })); setPage(0); }}
              className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              data-testid="select-filter-generated-by"
            >
              <option value="">{t("pages.adminExplanations.allGenerators")}</option>
              <option value="ai">{t("pages.adminExplanations.aiGenerated")}</option>
              <option value="manual">{t("pages.adminExplanations.manual")}</option>
              <option value="migrated">{t("pages.adminExplanations.migrated")}</option>
            </select>
            <Input
              type="number"
              placeholder={t("pages.adminExplanations.minQuality")}
              value={filters.minQuality}
              onChange={(e) => { setFilters(f => ({ ...f, minQuality: e.target.value })); setPage(0); }}
              className="w-28"
              data-testid="input-min-quality"
            />
            <Input
              type="number"
              placeholder={t("pages.adminExplanations.maxQuality")}
              value={filters.maxQuality}
              onChange={(e) => { setFilters(f => ({ ...f, maxQuality: e.target.value })); setPage(0); }}
              className="w-28"
              data-testid="input-max-quality"
            />
            <Button size="sm" variant="outline" onClick={fetchQueue} data-testid="button-refresh-queue">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2" data-testid="text-queue-total">
            {data?.total ?? 0} explanations found
          </p>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {data?.rows.map((exp) => (
            <Card key={exp.id} data-testid={`explanation-card-${exp.id}`}>
              <CardContent className="pt-4">
                {editingId === exp.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">{t("pages.adminExplanations.correctAnswerExplanation")}</label>
                      <Textarea
                        value={editForm.correctAnswerExplanation || ""}
                        onChange={(e) => setEditForm(f => ({ ...f, correctAnswerExplanation: e.target.value }))}
                        rows={3}
                        data-testid="textarea-edit-explanation"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">{t("pages.adminExplanations.clinicalReasoning")}</label>
                        <Textarea
                          value={(editForm.clinicalReasoning as string) || ""}
                          onChange={(e) => setEditForm(f => ({ ...f, clinicalReasoning: e.target.value }))}
                          rows={2}
                          data-testid="textarea-edit-reasoning"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">{t("pages.adminExplanations.keyTakeaway")}</label>
                        <Textarea
                          value={(editForm.keyTakeaway as string) || ""}
                          onChange={(e) => setEditForm(f => ({ ...f, keyTakeaway: e.target.value }))}
                          rows={2}
                          data-testid="textarea-edit-takeaway"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500">{t("pages.adminExplanations.mnemonic")}</label>
                        <Input
                          value={(editForm.mnemonic as string) || ""}
                          onChange={(e) => setEditForm(f => ({ ...f, mnemonic: e.target.value }))}
                          data-testid="input-edit-mnemonic"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">{t("pages.adminExplanations.clinicalPearl")}</label>
                        <Input
                          value={(editForm.clinicalPearl as string) || ""}
                          onChange={(e) => setEditForm(f => ({ ...f, clinicalPearl: e.target.value }))}
                          data-testid="input-edit-pearl"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">{t("pages.adminExplanations.referenceSource")}</label>
                        <Input
                          value={(editForm.referenceSource as string) || ""}
                          onChange={(e) => setEditForm(f => ({ ...f, referenceSource: e.target.value }))}
                          data-testid="input-edit-reference"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(exp.id)} disabled={saving} data-testid="button-save-edit">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); setEditForm({}); }} data-testid="button-cancel-edit">
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={`text-xs ${STATUS_COLORS[exp.reviewStatus]}`}>{exp.reviewStatus}</Badge>
                        <Badge variant="outline" className="text-xs">{SOURCE_LABELS[exp.questionSource] || exp.questionSource}</Badge>
                        <Badge variant="outline" className="text-xs">Quality: {exp.qualityScore?.composite ?? "—"}</Badge>
                        <Badge variant="outline" className="text-xs">{exp.generatedBy}</Badge>
                      </div>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => startEditing(exp)} data-testid={`button-edit-${exp.id}`}>
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {exp.reviewStatus !== "approved" && (
                          <Button size="sm" variant="ghost" className="text-green-600" onClick={() => updateStatus(exp.id, "approved")} data-testid={`button-approve-${exp.id}`}>
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                        )}
                        {exp.reviewStatus !== "flagged" && (
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => updateStatus(exp.id, "flagged")} data-testid={`button-flag-${exp.id}`}>
                            <Flag className="w-3 h-3" />
                          </Button>
                        )}
                        {exp.reviewStatus !== "pending" && (
                          <Button size="sm" variant="ghost" className="text-yellow-600" onClick={() => updateStatus(exp.id, "pending")} data-testid={`button-pending-${exp.id}`}>
                            <Clock className="w-3 h-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => fetchRelated(exp.id)} data-testid={`button-related-${exp.id}`}>
                          <Link className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2" data-testid={`text-explanation-${exp.id}`}>
                      {exp.correctAnswerExplanation}
                    </p>
                    {exp.clinicalReasoning && (
                      <p className="text-xs text-gray-500 mb-1"><strong>{t("pages.adminExplanations.reasoning")}</strong> {exp.clinicalReasoning}</p>
                    )}
                    {exp.keyTakeaway && (
                      <p className="text-xs text-gray-500 mb-1"><strong>{t("pages.adminExplanations.takeaway")}</strong> {exp.keyTakeaway}</p>
                    )}
                    {exp.clinicalPearl && (
                      <p className="text-xs text-gray-500 mb-1"><strong>{t("pages.adminExplanations.pearl")}</strong> {exp.clinicalPearl}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">ID: {exp.questionId.substring(0, 8)}...</span>
                      <span className="text-xs text-gray-400">Updated: {new Date(exp.updatedAt).toLocaleDateString()}</span>
                      {exp.relatedContent && Object.keys(exp.relatedContent).length > 0 && exp.relatedContent.relatedQuestions && (
                        <Badge variant="outline" className="text-xs">
                          <Link className="w-2.5 h-2.5 mr-1" /> Linked
                        </Badge>
                      )}
                    </div>

                    {showRelated === exp.id && relatedContent && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{t("pages.adminExplanations.relatedContent")}</h4>
                          <Button size="sm" variant="outline" onClick={() => linkRelated(exp.id)} data-testid={`button-link-related-${exp.id}`}>
                            <Link className="w-3 h-3 mr-1" /> Save Links
                          </Button>
                        </div>
                        {relatedContent.relatedQuestions?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Related Questions ({relatedContent.relatedQuestions.length})</p>
                            {relatedContent.relatedQuestions.map((q: any) => (
                              <p key={q.id} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {q.stem?.substring(0, 60) || q.id}
                              </p>
                            ))}
                          </div>
                        )}
                        {relatedContent.relatedLessons?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Related Lessons ({relatedContent.relatedLessons.length})</p>
                            {relatedContent.relatedLessons.map((l: any) => (
                              <p key={l.id} className="text-xs text-gray-600 dark:text-gray-400">{l.title}</p>
                            ))}
                          </div>
                        )}
                        {relatedContent.relatedFlashcards?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Related Flashcards ({relatedContent.relatedFlashcards.length})</p>
                            {relatedContent.relatedFlashcards.map((f: any) => (
                              <p key={f.id} className="text-xs text-gray-600 dark:text-gray-400 truncate">{f.front?.substring(0, 60)}</p>
                            ))}
                          </div>
                        )}
                        {(!relatedContent.relatedQuestions?.length && !relatedContent.relatedLessons?.length && !relatedContent.relatedFlashcards?.length) && (
                          <p className="text-xs text-gray-400">{t("pages.adminExplanations.noRelatedContentFoundFor")}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {data?.rows.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-400" data-testid="text-empty-queue">{t("pages.adminExplanations.noExplanationsMatchTheCurrent")}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500" data-testid="text-page-info">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            data-testid="button-next-page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function RoadmapTab() {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const res = await adminFetch("/api/admin/content-expansion-roadmap");
        if (res.ok) {
          const data = await res.json();
          setRoadmap(data.roadmap || []);
        }
      } catch (e) {
        console.error("Roadmap fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("pages.adminExplanations.contentExpansionRoadmap")}</CardTitle>
          <p className="text-sm text-gray-500">{t("pages.adminExplanations.rankedPrioritiesForTheNext")}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roadmap.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                data-testid={`roadmap-item-${item.id}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    <Badge className={PRIORITY_COLORS[item.priority] || "bg-gray-100"}>
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
