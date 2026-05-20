import { useState, useEffect, useCallback } from "react";
import {
  Settings, BookOpen, Brain, FileText, Loader2, CheckCircle2, AlertTriangle,
  RefreshCw, Target, TrendingUp, Filter, Search, Upload, Download,
  Plus, Edit2, Trash2, Eye, Archive, ChevronDown, ChevronRight,
  BarChart3, FileCheck, Clock, ArrowLeft, Copy, X, Check, List
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
type Tab = "overview" | "questions" | "editor" | "import" | "import-history" | "distribution" | "flashcards" | "lessons" | "seo" | "publish";

function getInitialTab(): Tab {

  const path = window.location.pathname;
  if (path.includes("/import/history")) return "import-history";
  if (path.includes("/import")) return "import";
  if (path.includes("/questions")) return "questions";
  if (path.includes("/flashcards")) return "flashcards";
  if (path.includes("/lessons")) return "lessons";
  if (path.includes("/exams")) return "questions";
  if (path.includes("/uploads")) return "import";
  if (path.includes("/seo")) return "seo";
  if (path.includes("/publish")) return "publish";
  return "overview";
}

const MLT_DISCIPLINES = [
  "Hematology", "Clinical Chemistry", "Microbiology", "Blood Banking",
  "Urinalysis", "Immunology/Serology", "Molecular Diagnostics",
  "Lab Operations", "Quality Assurance", "Body Fluids"
];

const COGNITIVE_LEVELS = ["recall", "application", "analysis"];

async function apiFetch(url: string, opts?: RequestInit) {
  const adminId = "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225";
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}adminId=${adminId}`, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-admin-id": adminId, ...(opts?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <div className="text-2xl font-bold text-gray-900">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function QuestionEditor({ question, onSave, onCancel }: { question?: any; onSave: (q: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    stem: question?.stem || "",
    options: question?.options || ["", "", "", ""],
    correctAnswer: question?.correct_answer ?? question?.correctAnswer ?? 0,
    rationaleLong: question?.rationale_long || question?.rationaleLong || "",
    learningObjective: question?.learning_objective || question?.learningObjective || "",
    blueprintCategory: question?.blueprint_category || question?.blueprintCategory || "Hematology",
    subtopic: question?.subtopic || "general",
    difficulty: question?.difficulty || 3,
    cognitiveLevel: question?.cognitive_level || question?.cognitiveLevel || "application",
    questionType: question?.question_type || question?.questionType || "mcq",
    examTrap: question?.exam_trap || question?.examTrap || "",
    safetyNote: question?.safety_note || question?.safetyNote || "",
    isFree: question?.is_free || question?.isFree || false,
    status: question?.status || "draft",
  });

  const [showPreview, setShowPreview] = useState(false);

  const opts = typeof form.options === "string" ? JSON.parse(form.options) : (Array.isArray(form.options) ? form.options : ["", "", "", ""]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="question-editor">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-purple-600" />
          {question ? "Edit Question" : "Create New Question"}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 text-sm bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="button-toggle-preview">
            <Eye className="w-4 h-4 inline mr-1" /> {showPreview ? "Editor" : "Preview"}
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="button-cancel-editor">{t("allied.mltAdmin.cancel")}</button>
        </div>
      </div>

      {showPreview ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50" data-testid="question-preview">
          <p className="font-medium text-gray-900 mb-4">{form.stem || "No question text"}</p>
          <div className="space-y-2 mb-4">
            {opts.map((opt: string, i: number) => (
              <div key={i} className={`p-3 rounded-lg border ${i === form.correctAnswer ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt || "(empty)"}
                {i === form.correctAnswer && <CheckCircle2 className="w-4 h-4 text-green-600 inline ml-2" />}
              </div>
            ))}
          </div>
          {form.rationaleLong && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800 mb-1">{t("allied.mltAdmin.rationale")}</p>
              <p className="text-sm text-blue-700">{form.rationaleLong}</p>
            </div>
          )}
          <div className="mt-3 flex gap-2 flex-wrap text-xs">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{form.blueprintCategory}</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">Difficulty: {form.difficulty}</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">{form.cognitiveLevel}</span>
            <span className={`px-2 py-1 rounded ${form.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{form.status}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.questionStem")}</label>
            <textarea
              value={form.stem}
              onChange={e => setForm(f => ({ ...f, stem: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              data-testid="input-stem"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {opts.map((opt: string, i: number) => (
              <div key={i}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Option {String.fromCharCode(65 + i)} {i === form.correctAnswer && <span className="text-green-600">{t("allied.mltAdmin.correct")}</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    value={opt}
                    onChange={e => {
                      const newOpts = [...opts];
                      newOpts[i] = e.target.value;
                      setForm(f => ({ ...f, options: newOpts }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    data-testid={`input-option-${i}`}
                  />
                  <button
                    onClick={() => setForm(f => ({ ...f, correctAnswer: i }))}
                    className={`px-2 py-1 rounded-lg text-xs ${i === form.correctAnswer ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                    data-testid={`button-correct-${i}`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.rationale2")}</label>
            <textarea
              value={form.rationaleLong}
              onChange={e => setForm(f => ({ ...f, rationaleLong: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              data-testid="input-rationale"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.discipline")}</label>
              <select value={form.blueprintCategory} onChange={e => setForm(f => ({ ...f, blueprintCategory: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-discipline">
                {MLT_DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.difficulty15")}</label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: parseInt(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-difficulty">
                {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.cognitiveLevel")}</label>
              <select value={form.cognitiveLevel} onChange={e => setForm(f => ({ ...f, cognitiveLevel: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-cognitive">
                {COGNITIVE_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.status")}</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-status">
                <option value="draft">{t("allied.mltAdmin.draft")}</option>
                <option value="published">{t("allied.mltAdmin.published")}</option>
                <option value="archived">{t("allied.mltAdmin.archived")}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.learningObjective")}</label>
              <input value={form.learningObjective} onChange={e => setForm(f => ({ ...f, learningObjective: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-learning-objective" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.subtopic")}</label>
              <input value={form.subtopic} onChange={e => setForm(f => ({ ...f, subtopic: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-subtopic" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.examTrapOptional")}</label>
              <input value={form.examTrap} onChange={e => setForm(f => ({ ...f, examTrap: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-exam-trap" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.safetyNoteOptional")}</label>
              <input value={form.safetyNote} onChange={e => setForm(f => ({ ...f, safetyNote: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-safety-note" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))} data-testid="checkbox-adaptive" />
              Adaptive/Exam Eligible
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="button-cancel">{t("allied.mltAdmin.cancel2")}</button>
            <button
              onClick={() => onSave(form)}
              className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              data-testid="button-save-question"
            >
              {question ? "Update Question" : "Create Question"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MltAdminPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>(getInitialTab());
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsTotal, setQuestionsTotal] = useState(0);
  const [questionsPage, setQuestionsPage] = useState(1);
  const [filterDiscipline, setFilterDiscipline] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCognitive, setFilterCognitive] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [importFormat, setImportFormat] = useState<"json" | "csv" | "text">("json");
  const [importData, setImportData] = useState("");
  const [importValidation, setImportValidation] = useState<any>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [publishStatus, setPublishStatus] = useState<any>(null);
  const [seoData, setSeoData] = useState<any>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/admin/mlt/stats");
      setStats(data);
    } catch (e: any) {
      console.error("Failed to load stats:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadQuestions = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(questionsPage), limit: "50" });
      if (filterDiscipline) params.set("discipline", filterDiscipline);
      if (filterDifficulty) params.set("difficulty", filterDifficulty);
      if (filterStatus) params.set("status", filterStatus);
      if (filterCognitive) params.set("cognitive", filterCognitive);
      if (searchQuery) params.set("search", searchQuery);
      const data = await apiFetch(`/api/admin/mlt/questions?${params}`);
      setQuestions(data.questions || []);
      setQuestionsTotal(data.total || 0);
    } catch (e: any) {
      console.error("Failed to load questions:", e);
    }
  }, [questionsPage, filterDiscipline, filterDifficulty, filterStatus, filterCognitive, searchQuery]);

  const loadImportHistory = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/mlt/import/history");
      setImportHistory(data);
    } catch (e: any) {
      console.error("Failed to load import history:", e);
    }
  }, []);

  const loadDistribution = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/mlt/distribution");
      setDistribution(data);
    } catch (e: any) {
      console.error("Failed to load distribution:", e);
    }
  }, []);

  const loadFlashcards = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/mlt/flashcards");
      setFlashcards(data.flashcards || []);
    } catch (e: any) {
      console.error("Failed to load flashcards:", e);
    }
  }, []);

  const loadLessons = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/mlt/lessons");
      setLessons(data);
    } catch (e: any) {
      console.error("Failed to load lessons:", e);
    }
  }, []);

  const loadPublishStatus = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/mlt/publish-status");
      setPublishStatus(data);
    } catch (e: any) {
      console.error("Failed to load publish status:", e);
    }
  }, []);

  const loadSeo = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/mlt/seo");
      setSeoData(data);
    } catch (e: any) {
      console.error("Failed to load SEO data:", e);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    if (tab === "questions") loadQuestions();
    if (tab === "import-history") loadImportHistory();
    if (tab === "distribution") loadDistribution();
    if (tab === "flashcards") loadFlashcards();
    if (tab === "lessons") loadLessons();
    if (tab === "publish") loadPublishStatus();
    if (tab === "seo") loadSeo();
  }, [tab, loadQuestions, loadImportHistory, loadDistribution, loadFlashcards, loadLessons, loadPublishStatus, loadSeo]);

  const handleSaveQuestion = async (form: any) => {
    try {
      if (editingQuestion) {
        await apiFetch(`/api/admin/mlt/questions/${editingQuestion.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast({ title: "Question updated" });
      } else {
        await apiFetch("/api/admin/mlt/questions", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast({ title: "Question created" });
      }
      setShowEditor(false);
      setEditingQuestion(null);
      loadQuestions();
      loadStats();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleDuplicateQuestion = async (q: any) => {
    try {
      await apiFetch("/api/admin/mlt/questions", {
        method: "POST",
        body: JSON.stringify({
          stem: q.stem + " (copy)",
          options: q.options,
          correctAnswer: q.correct_answer,
          rationaleLong: q.rationale_long,
          learningObjective: q.learning_objective,
          blueprintCategory: q.blueprint_category,
          subtopic: q.subtopic,
          difficulty: q.difficulty,
          cognitiveLevel: q.cognitive_level,
          questionType: q.question_type,
          status: "draft",
        }),
      });
      toast({ title: "Question duplicated" });
      loadQuestions();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedIds.size === 0) {
      toast({ title: "No questions selected", variant: "destructive" });
      return;
    }
    try {
      await apiFetch("/api/admin/mlt/questions/bulk-action", {
        method: "POST",
        body: JSON.stringify({ ids: Array.from(selectedIds), action, value }),
      });
      toast({ title: `Bulk ${action} completed`, description: `${selectedIds.size} questions affected` });
      setSelectedIds(new Set());
      loadQuestions();
      loadStats();
    } catch (e: any) {
      toast({ title: "Bulk action failed", description: e.message, variant: "destructive" });
    }
  };

  const handleValidateImport = async () => {
    try {
      setImportLoading(true);
      const data = await apiFetch("/api/admin/mlt/import/validate", {
        method: "POST",
        body: JSON.stringify({ format: importFormat, data: importData }),
      });
      setImportValidation(data);
    } catch (e: any) {
      toast({ title: "Validation failed", description: e.message, variant: "destructive" });
    } finally {
      setImportLoading(false);
    }
  };

  const handleExecuteImport = async () => {
    try {
      setImportLoading(true);
      const data = await apiFetch("/api/admin/mlt/import/execute", {
        method: "POST",
        body: JSON.stringify({ format: importFormat, data: importData, fileName: `import-${Date.now()}` }),
      });
      toast({ title: "Import complete", description: `${data.successCount} of ${data.totalRows} imported successfully` });
      setImportData("");
      setImportValidation(null);
      loadStats();
    } catch (e: any) {
      toast({ title: "Import failed", description: e.message, variant: "destructive" });
    } finally {
      setImportLoading(false);
    }
  };

  const handleRollback = async (importId: string) => {
    try {
      const data = await apiFetch(`/api/admin/mlt/import/${importId}/rollback`, { method: "POST" });
      toast({ title: "Rollback complete", description: `${data.rolledBackCount} questions removed` });
      loadImportHistory();
      loadStats();
    } catch (e: any) {
      toast({ title: "Rollback failed", description: e.message, variant: "destructive" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportData(ev.target?.result as string);
      if (file.name.endsWith(".json")) setImportFormat("json");
      else if (file.name.endsWith(".csv")) setImportFormat("csv");
      else setImportFormat("text");
    };
    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.mltAdmin.adminAccessRequired")}</h1>
        <p className="text-gray-600">{t("allied.mltAdmin.youNeedAdminPrivilegesTo")}</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "questions", label: "Questions", icon: BookOpen },
    { id: "flashcards", label: "Flashcards", icon: Brain },
    { id: "lessons", label: "Lessons", icon: FileText },
    { id: "import", label: "Import", icon: Upload },
    { id: "import-history", label: "Import History", icon: Clock },
    { id: "distribution", label: "Distribution", icon: Target },
    { id: "seo", label: "SEO", icon: Search },
    { id: "publish", label: "Publish", icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="mlt-admin-page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-mlt-admin-title">{t("allied.mltAdmin.mltContentStudio")}</h1>
            <p className="text-sm text-gray-500">{t("allied.mltAdmin.medicalLaboratoryTechnologistAdmin")}</p>
          </div>
        </div>
        <button onClick={() => { loadStats(); }} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100" data-testid="button-refresh-mlt">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-0.5 flex-wrap mb-6 gap-0.5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === t.id ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
            data-testid={`tab-${t.id}`}
          >
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard icon={BookOpen} label={t("allied.mltAdmin.totalQuestions")} value={stats?.questions?.total || 0} color="text-purple-500" />
            <StatCard icon={CheckCircle2} label={t("allied.mltAdmin.published4")} value={stats?.questions?.published || 0} color="text-green-500" />
            <StatCard icon={FileText} label={t("allied.mltAdmin.drafts")} value={stats?.questions?.draft || 0} color="text-amber-500" />
            <StatCard icon={Brain} label={t("allied.mltAdmin.flashcards2")} value={stats?.flashcards || 0} color="text-blue-500" />
            <StatCard icon={FileCheck} label={t("allied.mltAdmin.lessons2")} value={stats?.lessons || 0} color="text-teal-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">{t("allied.mltAdmin.distributionByDiscipline")}</h3>
              <div className="space-y-2">
                {(stats?.distribution || []).reduce((acc: any[], r: any) => {
                  const existing = acc.find(a => a.discipline === r.discipline);
                  if (existing) { existing.count += Number(r.count); }
                  else { acc.push({ discipline: r.discipline, count: Number(r.count) }); }
                  return acc;
                }, []).map((d: any) => (
                  <div key={d.discipline} className="flex items-center gap-2 text-sm" data-testid={`dist-${d.discipline}`}>
                    <span className="w-36 text-gray-600 truncate">{d.discipline}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, (d.count / Math.max(1, stats?.questions?.total || 1)) * 100)}%` }} />
                    </div>
                    <span className="w-10 text-right text-gray-700 font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">{t("allied.mltAdmin.quickActions")}</h3>
              <div className="space-y-2">
                <button onClick={() => { setShowEditor(true); setEditingQuestion(null); setTab("editor"); }} className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100" data-testid="button-new-question">
                  <Plus className="w-4 h-4" /> Create New Question
                </button>
                <button onClick={() => setTab("import")} className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100" data-testid="button-go-import">
                  <Upload className="w-4 h-4" /> Bulk Import Questions
                </button>
                <button onClick={() => setTab("distribution")} className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100" data-testid="button-go-distribution">
                  <Target className="w-4 h-4" /> View Distribution Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(tab === "editor" || showEditor) && (
        <QuestionEditor
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => { setShowEditor(false); setEditingQuestion(null); if (tab === "editor") setTab("questions"); }}
        />
      )}

      {tab === "questions" && !showEditor && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t("allied.mltAdmin.searchQuestions")}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                data-testid="input-search-questions"
              />
            </div>
            <select value={filterDiscipline} onChange={e => { setFilterDiscipline(e.target.value); setQuestionsPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="filter-discipline">
              <option value="">{t("allied.mltAdmin.allDisciplines")}</option>
              {MLT_DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterDifficulty} onChange={e => { setFilterDifficulty(e.target.value); setQuestionsPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="filter-difficulty">
              <option value="">{t("allied.mltAdmin.allDifficulties")}</option>
              {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>Level {d}</option>)}
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setQuestionsPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="filter-status">
              <option value="">{t("allied.mltAdmin.allStatuses")}</option>
              <option value="draft">{t("allied.mltAdmin.draft2")}</option>
              <option value="published">{t("allied.mltAdmin.published2")}</option>
              <option value="archived">{t("allied.mltAdmin.archived2")}</option>
              <option value="pending">{t("allied.mltAdmin.pending")}</option>
            </select>
            <button onClick={() => { setShowEditor(true); setEditingQuestion(null); }} className="px-3 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700" data-testid="button-create-question">
              <Plus className="w-4 h-4 inline mr-1" /> New
            </button>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg" data-testid="bulk-actions-bar">
              <span className="text-sm font-medium text-purple-700">{selectedIds.size} selected</span>
              <button onClick={() => handleBulkAction("publish")} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200" data-testid="bulk-publish">{t("allied.mltAdmin.publish")}</button>
              <button onClick={() => handleBulkAction("archive")} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200" data-testid="bulk-archive">{t("allied.mltAdmin.archive")}</button>
              <button onClick={() => handleBulkAction("draft")} className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200" data-testid="bulk-draft">{t("allied.mltAdmin.setDraft")}</button>
              <select onChange={e => { if (e.target.value) handleBulkAction("tag-discipline", e.target.value); e.target.value = ""; }} className="px-2 py-1 text-xs border border-gray-200 rounded" data-testid="bulk-tag-discipline">
                <option value="">{t("allied.mltAdmin.tagDiscipline")}</option>
                {MLT_DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select onChange={e => { if (e.target.value) handleBulkAction("set-difficulty", e.target.value); e.target.value = ""; }} className="px-2 py-1 text-xs border border-gray-200 rounded" data-testid="bulk-set-difficulty">
                <option value="">{t("allied.mltAdmin.setDifficulty")}</option>
                {[1, 2, 3, 4, 5].map(d => <option key={d} value={String(d)}>Level {d}</option>)}
              </select>
              <button onClick={() => handleBulkAction("delete")} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200" data-testid="bulk-delete">{t("allied.mltAdmin.delete")}</button>
              <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-500 hover:text-gray-700" data-testid="button-clear-selection">{t("allied.mltAdmin.clear")}</button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === questions.length && questions.length > 0}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(new Set(questions.map(q => q.id)));
                        else setSelectedIds(new Set());
                      }}
                      data-testid="checkbox-select-all"
                    />
                  </th>
                  <th className="p-3">{t("allied.mltAdmin.question")}</th>
                  <th className="p-3 w-32">{t("allied.mltAdmin.discipline2")}</th>
                  <th className="p-3 w-16">{t("allied.mltAdmin.diff")}</th>
                  <th className="p-3 w-20">{t("allied.mltAdmin.status2")}</th>
                  <th className="p-3 w-24">{t("allied.mltAdmin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(q => (
                  <tr key={q.id} className="border-t border-gray-50 hover:bg-gray-50" data-testid={`question-row-${q.id}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(q.id)}
                        onChange={e => {
                          const next = new Set(selectedIds);
                          if (e.target.checked) next.add(q.id); else next.delete(q.id);
                          setSelectedIds(next);
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <p className="text-gray-900 line-clamp-2">{q.stem}</p>
                    </td>
                    <td className="p-3 text-xs text-gray-600">{q.blueprint_category}</td>
                    <td className="p-3 text-center">{q.difficulty}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        q.status === "published" ? "bg-green-100 text-green-700" :
                        q.status === "archived" ? "bg-gray-100 text-gray-600" :
                        "bg-amber-100 text-amber-700"
                      }`}>{q.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingQuestion(q); setShowEditor(true); }} className="p-1 text-gray-400 hover:text-purple-600" data-testid={`edit-${q.id}`}><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDuplicateQuestion(q)} className="p-1 text-gray-400 hover:text-blue-600" data-testid={`duplicate-${q.id}`}><Copy className="w-4 h-4" /></button>
                        <button onClick={async () => {
                          await apiFetch(`/api/admin/mlt/questions/${q.id}`, { method: "DELETE" });
                          toast({ title: "Deleted" });
                          loadQuestions();
                        }} className="p-1 text-gray-400 hover:text-red-600" data-testid={`delete-${q.id}`}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">{t("allied.mltAdmin.noQuestionsFound")}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{questionsTotal} total questions</span>
            <div className="flex gap-2">
              <button disabled={questionsPage <= 1} onClick={() => setQuestionsPage(p => p - 1)} className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50" data-testid="button-prev-page">{t("allied.mltAdmin.prev")}</button>
              <span>Page {questionsPage}</span>
              <button disabled={questionsPage * 50 >= questionsTotal} onClick={() => setQuestionsPage(p => p + 1)} className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50" data-testid="button-next-page">{t("allied.mltAdmin.next")}</button>
            </div>
          </div>
        </div>
      )}

      {tab === "import" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="import-panel">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> Bulk Import
            </h3>

            <div className="flex gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.format")}</label>
                <select value={importFormat} onChange={e => setImportFormat(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-import-format">
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="text">{t("allied.mltAdmin.structuredText")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.mltAdmin.uploadFile")}</label>
                <input type="file" accept=".json,.csv,.txt" onChange={handleFileUpload} className="text-sm" data-testid="input-file-upload" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {importFormat === "text" ? "Paste structured text" : `Paste ${importFormat.toUpperCase()} data`}
              </label>
              <textarea
                value={importData}
                onChange={e => setImportData(e.target.value)}
                rows={12}
                placeholder={importFormat === "text" ?
                  `Question: What is the normal range for hemoglobin in adult males?\nCountryTrack: both\nDiscipline: Hematology\nOption A: 10-12 g/dL\nOption B: 13.5-17.5 g/dL\nOption C: 18-22 g/dL\nOption D: 8-10 g/dL\nCorrectAnswer: B\nRationale: The normal hemoglobin range for adult males is 13.5-17.5 g/dL...` :
                  importFormat === "json" ?
                  `[\n  {\n    "stem": "Question text...",\n    "options": ["A", "B", "C", "D"],\n    "correctAnswer": 0,\n    "rationaleLong": "Explanation...",\n    "blueprintCategory": "Hematology"\n  }\n]` :
                  `stem,options,correctAnswer,rationaleLong,blueprintCategory\n"Question text","A|B|C|D",0,"Explanation","Hematology"`
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                data-testid="textarea-import-data"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <button onClick={handleValidateImport} disabled={!importData || importLoading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" data-testid="button-validate-import">
                {importLoading ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : <FileCheck className="w-4 h-4 inline mr-1" />}
                Validate
              </button>
              {importValidation && importValidation.errorCount === 0 && (
                <button onClick={handleExecuteImport} disabled={importLoading} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50" data-testid="button-execute-import">
                  <CheckCircle2 className="w-4 h-4 inline mr-1" /> Import {importValidation.validCount} Questions
                </button>
              )}
            </div>

            {importValidation && (
              <div className="border border-gray-200 rounded-lg p-4 space-y-3" data-testid="validation-report">
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">Total: <strong>{importValidation.totalRows}</strong></span>
                  <span className="text-green-600">Valid: <strong>{importValidation.validCount}</strong></span>
                  <span className="text-red-600">Errors: <strong>{importValidation.errorCount}</strong></span>
                  <span className="text-amber-600">Warnings: <strong>{importValidation.warningCount}</strong></span>
                  <span className="text-blue-600">Duplicates: <strong>{importValidation.duplicateCount}</strong></span>
                </div>

                {importValidation.errors?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-700 mb-1">{t("allied.mltAdmin.errors")}</p>
                    {importValidation.errors.map((e: string, i: number) => (
                      <p key={i} className="text-xs text-red-600">{e}</p>
                    ))}
                  </div>
                )}

                {importValidation.warnings?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-700 mb-1">{t("allied.mltAdmin.warnings")}</p>
                    {importValidation.warnings.map((w: string, i: number) => (
                      <p key={i} className="text-xs text-amber-600">{w}</p>
                    ))}
                  </div>
                )}

                {importValidation.preview?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Preview (first {importValidation.preview.length} rows):</p>
                    <div className="space-y-1">
                      {importValidation.preview.map((p: any, i: number) => (
                        <div key={i} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          <strong>{p.discipline}</strong> (diff: {p.difficulty}) — {p.stem}...
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="templates-panel">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Download className="w-5 h-5 text-gray-600" /> Download Templates
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/api/admin/mlt/import/templates/questions-json?adminId=d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" className="flex items-center gap-2 p-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="link-template-questions-json">
                <Download className="w-4 h-4 text-blue-600" /> Questions JSON
              </a>
              <a href="/api/admin/mlt/import/templates/questions-csv?adminId=d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" className="flex items-center gap-2 p-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="link-template-questions-csv">
                <Download className="w-4 h-4 text-green-600" /> Questions CSV
              </a>
              <a href="/api/admin/mlt/import/templates/flashcards-json?adminId=d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" className="flex items-center gap-2 p-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="link-template-flashcards-json">
                <Download className="w-4 h-4 text-purple-600" /> Flashcards JSON
              </a>
              <a href="/api/admin/mlt/import/templates/lessons-json?adminId=d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225" className="flex items-center gap-2 p-3 text-sm bg-gray-50 rounded-lg hover:bg-gray-100" data-testid="link-template-lessons-json">
                <Download className="w-4 h-4 text-teal-600" /> Lessons JSON
              </a>
            </div>
          </div>

          {importFormat === "text" && (
            <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="text-format-guide">
              <h3 className="font-semibold text-gray-900 mb-3">{t("allied.mltAdmin.structuredTextFormatGuide")}</h3>
              <pre className="text-xs text-gray-600 bg-gray-50 p-4 rounded-lg overflow-x-auto">{`Question: What is the primary function of hemoglobin?
CountryTrack: both
Discipline: Hematology
Option A: Transport of carbon dioxide
Option B: Transport of oxygen
Option C: Blood clotting
Option D: Immune defense
CorrectAnswer: B
Rationale: Hemoglobin is the protein in red blood cells responsible for binding and transporting oxygen from the lungs to the tissues.

Question: Which anticoagulant is used for coagulation studies?
CountryTrack: both
Discipline: Hematology
Option A: EDTA
Option B: Heparin
Option C: Sodium citrate
Option D: Potassium oxalate
CorrectAnswer: C
Rationale: Sodium citrate (light blue top tube) is the anticoagulant of choice for coagulation studies (PT, PTT, INR).`}</pre>
            </div>
          )}
        </div>
      )}

      {tab === "import-history" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" /> Import History
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3">{t("allied.mltAdmin.date")}</th>
                  <th className="p-3">{t("allied.mltAdmin.type")}</th>
                  <th className="p-3">{t("allied.mltAdmin.file")}</th>
                  <th className="p-3 text-center">{t("allied.mltAdmin.total")}</th>
                  <th className="p-3 text-center">{t("allied.mltAdmin.success")}</th>
                  <th className="p-3 text-center">{t("allied.mltAdmin.errors2")}</th>
                  <th className="p-3">{t("allied.mltAdmin.status3")}</th>
                  <th className="p-3">{t("allied.mltAdmin.actions2")}</th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map(imp => (
                  <tr key={imp.id} className="border-t border-gray-50" data-testid={`import-row-${imp.id}`}>
                    <td className="p-3 text-xs text-gray-600">{new Date(imp.created_at).toLocaleString()}</td>
                    <td className="p-3">{imp.import_type}</td>
                    <td className="p-3 text-xs text-gray-500">{imp.file_name || "—"}</td>
                    <td className="p-3 text-center">{imp.total_rows}</td>
                    <td className="p-3 text-center text-green-600">{imp.success_count}</td>
                    <td className="p-3 text-center text-red-600">{imp.error_count}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        imp.rolled_back ? "bg-red-100 text-red-700" :
                        imp.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>{imp.rolled_back ? "Rolled Back" : imp.status}</span>
                    </td>
                    <td className="p-3">
                      {!imp.rolled_back && imp.success_count > 0 && (
                        <button onClick={() => handleRollback(imp.id)} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100" data-testid={`rollback-${imp.id}`}>
                          Rollback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {importHistory.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-gray-400">{t("allied.mltAdmin.noImportHistory")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "distribution" && (
        <div className="space-y-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" /> Content Distribution Planning
          </h3>

          {distribution && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-total-target">
                  <div className="text-2xl font-bold text-gray-900">{distribution.totalTarget}</div>
                  <div className="text-sm text-gray-500">{t("allied.mltAdmin.totalTargetQuestions")}</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5" data-testid="stat-total-actual">
                  <div className="text-2xl font-bold text-gray-900">{distribution.totalActual}</div>
                  <div className="text-sm text-gray-500">{t("allied.mltAdmin.actualQuestions")}</div>
                  <div className="text-xs text-gray-400 mt-1">{((distribution.totalActual / distribution.totalTarget) * 100).toFixed(1)}% of target</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="p-3">{t("allied.mltAdmin.discipline3")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.target")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.actual")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.published3")}</th>
                      <th className="p-3">{t("allied.mltAdmin.progress")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.easy")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.medium")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.hard")}</th>
                      <th className="p-3 text-center">{t("allied.mltAdmin.adaptive")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(distribution.distribution || []).map((d: any) => {
                      const pct = d.target > 0 ? (d.actual / d.target) * 100 : 0;
                      return (
                        <tr key={d.discipline} className="border-t border-gray-50" data-testid={`distribution-row-${d.discipline}`}>
                          <td className="p-3 font-medium text-gray-900">{d.discipline}</td>
                          <td className="p-3 text-center">{d.target}</td>
                          <td className="p-3 text-center font-medium">{d.actual}</td>
                          <td className="p-3 text-center text-green-600">{d.published}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${pct >= 100 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                              </div>
                              <span className="text-xs text-gray-500 w-10 text-right">{pct.toFixed(0)}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-center text-xs">{d.easy}</td>
                          <td className="p-3 text-center text-xs">{d.medium}</td>
                          <td className="p-3 text-center text-xs">{d.hard}</td>
                          <td className="p-3 text-center text-xs">{d.adaptiveEligible}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {distribution.countryBreakdown && distribution.countryBreakdown.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h4 className="font-medium text-gray-900 mb-3">{t("allied.mltAdmin.countrySplit")}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {distribution.countryBreakdown.map((c: any) => (
                      <div key={c.country} className="p-3 bg-gray-50 rounded-lg" data-testid={`country-${c.country}`}>
                        <div className="text-lg font-bold text-gray-900">{Number(c.count)}</div>
                        <div className="text-xs text-gray-500 capitalize">{c.country}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "flashcards" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" /> MLT Flashcards
            </h3>
            <button
              onClick={async () => {
                const front = prompt("Flashcard front (question):");
                if (!front) return;
                const back = prompt("Flashcard back (answer):");
                if (!back) return;
                try {
                  await apiFetch("/api/admin/mlt/flashcards", { method: "POST", body: JSON.stringify({ front, back, blueprintCategory: "Hematology" }) });
                  toast({ title: "Flashcard created" });
                  loadFlashcards();
                } catch (e: any) {
                  toast({ title: "Failed", description: e.message, variant: "destructive" });
                }
              }}
              className="px-3 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              data-testid="button-create-flashcard"
            >
              <Plus className="w-4 h-4 inline mr-1" /> New Flashcard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map(fc => (
              <div key={fc.id} className="bg-white rounded-xl border border-gray-100 p-4" data-testid={`flashcard-${fc.id}`}>
                <p className="font-medium text-gray-900 text-sm mb-2">{fc.front}</p>
                <p className="text-sm text-gray-600 mb-2">{fc.back}</p>
                {fc.rationale && <p className="text-xs text-gray-400 italic">{fc.rationale}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">{fc.blueprint_category}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={async () => {
                        const front = prompt("Edit front:", fc.front);
                        if (!front) return;
                        const back = prompt("Edit back:", fc.back);
                        if (!back) return;
                        try {
                          await apiFetch(`/api/admin/mlt/flashcards/${fc.id}`, { method: "PUT", body: JSON.stringify({ front, back }) });
                          toast({ title: "Flashcard updated" });
                          loadFlashcards();
                        } catch (e: any) {
                          toast({ title: "Failed", description: e.message, variant: "destructive" });
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      data-testid={`button-edit-flashcard-${fc.id}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this flashcard?")) return;
                        try {
                          await apiFetch(`/api/admin/mlt/flashcards/${fc.id}`, { method: "DELETE" });
                          toast({ title: "Flashcard deleted" });
                          loadFlashcards();
                        } catch (e: any) {
                          toast({ title: "Failed", description: e.message, variant: "destructive" });
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                      data-testid={`button-delete-flashcard-${fc.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {flashcards.length === 0 && (
              <div className="col-span-2 p-8 text-center text-gray-400">{t("allied.mltAdmin.noFlashcardsYet")}</div>
            )}
          </div>
        </div>
      )}

      {tab === "lessons" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" /> MLT Lessons
            </h3>
            <button
              onClick={async () => {
                const title = prompt("Lesson title:");
                if (!title) return;
                try {
                  await apiFetch("/api/admin/mlt/lessons", { method: "POST", body: JSON.stringify({ title }) });
                  toast({ title: "Lesson created" });
                  loadLessons();
                } catch (e: any) {
                  toast({ title: "Failed", description: e.message, variant: "destructive" });
                }
              }}
              className="px-3 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700"
              data-testid="button-create-lesson"
            >
              <Plus className="w-4 h-4 inline mr-1" /> New Lesson
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3">{t("allied.mltAdmin.title")}</th>
                  <th className="p-3">{t("allied.mltAdmin.slug")}</th>
                  <th className="p-3">{t("allied.mltAdmin.status4")}</th>
                  <th className="p-3">{t("allied.mltAdmin.actions3")}</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map(l => (
                  <tr key={l.id} className="border-t border-gray-50" data-testid={`lesson-row-${l.id}`}>
                    <td className="p-3 font-medium text-gray-900">{l.title}</td>
                    <td className="p-3 text-xs text-gray-500">{l.slug}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${l.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{l.status}</span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={async () => {
                          const newStatus = l.status === "published" ? "draft" : "published";
                          await apiFetch(`/api/admin/mlt/lessons/${l.id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
                          toast({ title: `Lesson ${newStatus}` });
                          loadLessons();
                        }}
                        className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100"
                        data-testid={`toggle-lesson-${l.id}`}
                      >
                        {l.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
                {lessons.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">{t("allied.mltAdmin.noLessonsYet")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-green-600" /> MLT SEO Management
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard icon={CheckCircle2} label={t("allied.mltAdmin.publishedQuestions")} value={seoData?.contentStats?.published_questions || 0} color="text-green-500" />
            <StatCard icon={FileText} label={t("allied.mltAdmin.draftQuestions")} value={seoData?.contentStats?.draft_questions || 0} color="text-amber-500" />
            <StatCard icon={BookOpen} label={t("allied.mltAdmin.totalQuestions2")} value={seoData?.contentStats?.total_questions || 0} color="text-purple-500" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="font-medium text-gray-900 mb-3">{t("allied.mltAdmin.mltContentPages")}</h4>
            {seoData?.pages?.length > 0 ? (
              <div className="space-y-2">
                {seoData.pages.map((p: any) => (
                  <div key={p.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`seo-page-${p.slug}`}>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.title || p.slug}</p>
                      <p className="text-xs text-gray-500">/{p.slug}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t("allied.mltAdmin.noMltContentPagesFound")}</p>
            )}
          </div>
        </div>
      )}

      {tab === "publish" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Publish Status Bar
          </h3>

          {publishStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-medium text-gray-900 mb-3">{t("allied.mltAdmin.questions")}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">{t("allied.mltAdmin.live")}</span>
                    <span className="font-bold">{Number(publishStatus.questions?.live_count || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">{t("allied.mltAdmin.draft3")}</span>
                    <span className="font-bold">{Number(publishStatus.questions?.draft_count || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("allied.mltAdmin.archived3")}</span>
                    <span className="font-bold">{Number(publishStatus.questions?.archived_count || 0)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${Number(publishStatus.questions?.total || 0) > 0 ? (Number(publishStatus.questions?.live_count || 0) / Number(publishStatus.questions?.total || 1)) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-medium text-gray-900 mb-3">{t("allied.mltAdmin.flashcards")}</h4>
                <div className="text-2xl font-bold text-gray-900">{publishStatus.flashcards?.total || 0}</div>
                <div className="text-sm text-gray-500">{t("allied.mltAdmin.totalMltFlashcards")}</div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-medium text-gray-900 mb-3">{t("allied.mltAdmin.lessons")}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">{t("allied.mltAdmin.live2")}</span>
                    <span className="font-bold">{Number(publishStatus.lessons?.live_lessons || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">{t("allied.mltAdmin.draft4")}</span>
                    <span className="font-bold">{Number(publishStatus.lessons?.draft_lessons || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
