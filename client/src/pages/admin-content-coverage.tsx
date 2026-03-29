import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, Loader2, RefreshCw, Zap, BookOpen, Layers,
  AlertTriangle, CheckCircle2, XCircle, Target, TrendingUp,
  FileText, Brain, Settings, ChevronDown, ChevronRight, Play
} from "lucide-react";

interface CoverageTarget {
  category: string;
  key: string;
  target: number;
  current: number;
  percentage: number;
  status: "green" | "yellow" | "red";
  gap: number;
}

interface LessonReport {
  total: number;
  complete: number;
  weak: number;
  placeholder: number;
  broken: number;
  missing: { title: string; slug: string; referencedFrom: string }[];
}

interface CoverageReport {
  nursing: {
    byTier: CoverageTarget[];
    byBodySystem: CoverageTarget[];
    bySpecialty: CoverageTarget[];
  };
  alliedHealth: {
    byProfession: CoverageTarget[];
  };
  flashcards: {
    byTopic: CoverageTarget[];
  };
  lessons: LessonReport;
  generationHistory: any[];
  timestamp: string;
}

interface Targets {
  questionsPerTier: number;
  questionsPerBodySystem: number;
  questionsPerSpecialty: number;
  questionsPerProfession: number;
  flashcardsPerTopic: number;
}

function StatusBadge({ status }: { status: "green" | "yellow" | "red" }) {
  const { t } = useI18n();
  const colors = {
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    yellow: "bg-amber-100 text-amber-800 border-amber-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };
  const icons = {
    green: <CheckCircle2 className="w-3 h-3" />,
    yellow: <AlertTriangle className="w-3 h-3" />,
    red: <XCircle className="w-3 h-3" />,
  };
  const labels = { green: "On Target", yellow: "Below Target", red: "Critical Gap" };
  return (
    <Badge className={`${colors[status]} border text-xs flex items-center gap-1`} data-testid={`badge-status-${status}`}>
      {icons[status]} {labels[status]}
    </Badge>
  );
}

function ProgressBar({ current, target, status }: { current: number; target: number; status: "green" | "yellow" | "red" }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : (current > 0 ? 100 : 0);
  const colors = { green: "bg-emerald-500", yellow: "bg-amber-500", red: "bg-red-500" };
  return (
    <div className="w-full bg-gray-100 rounded-full h-2" data-testid="progress-bar">
      <div className={`h-2 rounded-full transition-all ${colors[status]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function CoverageTable({ items, onGenerate, generating, contentType }: {
  items: CoverageTarget[];
  onGenerate?: (item: CoverageTarget) => void;
  generating?: string | null;
  contentType: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const sortedItems = [...items].sort((a, b) => a.percentage - b.percentage);

  return (
    <div className="space-y-2">
      <button
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        onClick={() => setExpanded(!expanded)}
        data-testid={`button-toggle-${contentType}`}
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {items.length} items
        <Badge variant="outline" className="text-xs">
          {items.filter(i => i.status === "red").length} gaps
        </Badge>
      </button>

      {expanded && (
        <div className="space-y-2">
          {sortedItems.map(item => (
            <div
              key={`${item.category}-${item.key}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              data-testid={`row-coverage-${item.key.toLowerCase().replace(/[\s/]+/g, "-")}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">{item.key}</span>
                  <StatusBadge status={item.status} />
                </div>
                <ProgressBar current={item.current} target={item.target} status={item.status} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{item.current.toLocaleString()} / {item.target.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                </div>
              </div>
              {onGenerate && item.gap > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs h-8"
                  onClick={() => onGenerate(item)}
                  disabled={generating === item.key}
                  data-testid={`button-generate-${item.key.toLowerCase().replace(/[\s/]+/g, "-")}`}
                >
                  {generating === item.key ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <Zap className="w-3 h-3 mr-1" />
                  )}
                  Fill Gap
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, title, value, subtitle, color }: {
  icon: any; title: string; value: number | string; subtitle: string; color: string;
}) {
  return (
    <Card className="border-0 shadow-sm" data-testid={`card-summary-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminContentCoverage() {
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<CoverageReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [autoFilling, setAutoFilling] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const [targets, setTargets] = useState<Targets | null>(null);
  const [genResults, setGenResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"nursing" | "allied" | "flashcards" | "lessons">("nursing");

  useEffect(() => {
    if (!isAdmin) { navigate("/login"); return; }
    loadCoverage();
  }, [isAdmin]);

  const loadCoverage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/content-coverage");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReport(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTargets = async () => {
    try {
      const res = await adminFetch("/api/admin/content-coverage/targets");
      if (res.ok) setTargets(await res.json());
    } catch {}
  };

  const saveTargets = async () => {
    if (!targets) return;
    try {
      await adminFetch("/api/admin/content-coverage/targets", {
        method: "PUT",
        body: targets,
      });
      loadCoverage();
    } catch {}
  };

  const handleGenerateQuestions = async (item: CoverageTarget) => {
    setGenerating(item.key);
    try {
      const body: any = { count: Math.min(5, item.gap) };
      if (item.category === "Nursing Tier") body.tier = item.key.toLowerCase();
      else if (item.category === "Body System") { body.tier = "rn"; body.bodySystem = item.key; }
      else if (item.category === "Specialty") { body.tier = "rn"; body.topic = item.key; }

      const res = await adminFetch("/api/admin/content-coverage/generate-questions", {
        method: "POST",
        body,
      });
      const result = await res.json();
      setGenResults(prev => [{ type: "questions", key: item.key, ...result, time: new Date().toISOString() }, ...prev]);
      loadCoverage();
    } catch (err: any) {
      setGenResults(prev => [{ type: "error", key: item.key, error: err.message, time: new Date().toISOString() }, ...prev]);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateFlashcards = async (item: CoverageTarget) => {
    setGenerating(item.key);
    try {
      const res = await adminFetch("/api/admin/content-coverage/generate-flashcards", {
        method: "POST",
        body: { tier: "rpn", topicTag: item.key, count: Math.min(5, item.gap) },
      });
      const result = await res.json();
      setGenResults(prev => [{ type: "flashcards", key: item.key, ...result, time: new Date().toISOString() }, ...prev]);
      loadCoverage();
    } catch (err: any) {
      setGenResults(prev => [{ type: "error", key: item.key, error: err.message, time: new Date().toISOString() }, ...prev]);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateLesson = async (lesson: { title: string; slug: string }) => {
    setGenerating(lesson.slug);
    try {
      const res = await adminFetch("/api/admin/content-coverage/generate-lesson", {
        method: "POST",
        body: lesson,
      });
      const result = await res.json();
      setGenResults(prev => [{ type: "lesson", key: lesson.slug, ...result, time: new Date().toISOString() }, ...prev]);
      loadCoverage();
    } catch (err: any) {
      setGenResults(prev => [{ type: "error", key: lesson.slug, error: err.message, time: new Date().toISOString() }, ...prev]);
    } finally {
      setGenerating(null);
    }
  };

  const handleAutoFill = async () => {
    setAutoFilling(true);
    try {
      const res = await adminFetch("/api/admin/content-coverage/auto-fill", {
        method: "POST",
        body: { types: ["questions", "flashcards", "lessons"], maxPerCategory: 5 },
      });
      const result = await res.json();
      setGenResults(prev => [{ type: "auto-fill", ...result, time: new Date().toISOString() }, ...prev]);
      loadCoverage();
    } catch (err: any) {
      setGenResults(prev => [{ type: "error", key: "auto-fill", error: err.message, time: new Date().toISOString() }, ...prev]);
    } finally {
      setAutoFilling(false);
    }
  };

  if (!isAdmin) return null;

  const totalQuestions = report ? (
    report.nursing.byTier.reduce((s, t) => s + t.current, 0)
  ) : 0;
  const totalFlashcards = report ? (
    report.flashcards.byTopic.reduce((s, t) => s + t.current, 0)
  ) : 0;
  const totalGaps = report ? (
    report.nursing.byTier.filter(t => t.status === "red").length +
    report.nursing.byBodySystem.filter(t => t.status === "red").length +
    report.alliedHealth.byProfession.filter(t => t.status === "red").length +
    report.flashcards.byTopic.filter(t => t.status === "red").length
  ) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminContentCoverage.contentCoverageAnalyzer")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor content gaps and auto-generate to meet targets
              {report && <span className="ml-2 text-xs text-gray-400">Updated {new Date(report.timestamp).toLocaleTimeString()}</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setShowTargets(!showTargets); if (!targets) loadTargets(); }}
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4 mr-1" /> Targets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCoverage}
              disabled={loading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              size="sm"
              className="bg-[#BFA6F6] hover:bg-[#a88de8] text-white"
              onClick={handleAutoFill}
              disabled={autoFilling || loading}
              data-testid="button-auto-fill"
            >
              {autoFilling ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Zap className="w-4 h-4 mr-1" />}
              Auto-Fill Gaps
            </Button>
          </div>
        </div>

        {showTargets && targets && (
          <Card className="mb-6 border-0 shadow-sm" data-testid="card-target-settings">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{t("pages.adminContentCoverage.coverageTargets")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentCoverage.questionstier")}</label>
                  <Input
                    type="number"
                    value={targets.questionsPerTier}
                    onChange={e => setTargets({ ...targets, questionsPerTier: parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm"
                    data-testid="input-target-tier"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentCoverage.questionssystem")}</label>
                  <Input
                    type="number"
                    value={targets.questionsPerBodySystem}
                    onChange={e => setTargets({ ...targets, questionsPerBodySystem: parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm"
                    data-testid="input-target-system"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentCoverage.questionsspecialty")}</label>
                  <Input
                    type="number"
                    value={targets.questionsPerSpecialty}
                    onChange={e => setTargets({ ...targets, questionsPerSpecialty: parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm"
                    data-testid="input-target-specialty"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentCoverage.questionsprofession")}</label>
                  <Input
                    type="number"
                    value={targets.questionsPerProfession}
                    onChange={e => setTargets({ ...targets, questionsPerProfession: parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm"
                    data-testid="input-target-profession"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t("pages.adminContentCoverage.flashcardstopic")}</label>
                  <Input
                    type="number"
                    value={targets.flashcardsPerTopic}
                    onChange={e => setTargets({ ...targets, flashcardsPerTopic: parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm"
                    data-testid="input-target-flashcards"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={saveTargets} className="bg-[#BFA6F6] hover:bg-[#a88de8]" data-testid="button-save-targets">
                  Save Targets
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" data-testid="text-error">
            {error}
          </div>
        )}

        {loading && !report ? (
          <div className="flex items-center justify-center py-20" data-testid="loading-spinner">
            <Loader2 className="w-8 h-8 animate-spin text-[#BFA6F6]" />
            <span className="ml-3 text-gray-500">{t("pages.adminContentCoverage.analyzingContentCoverage")}</span>
          </div>
        ) : report ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <SummaryCard
                icon={FileText}
                title={t("pages.adminContentCoverage.totalQuestions")}
                value={totalQuestions}
                subtitle={`${report.nursing.byTier.filter(t => t.status === "green").length}/${report.nursing.byTier.length} tiers on target`}
                color="bg-blue-500"
              />
              <SummaryCard
                icon={Layers}
                title={t("pages.adminContentCoverage.flashcards")}
                value={totalFlashcards}
                subtitle={`${report.flashcards.byTopic.length} topics tracked`}
                color="bg-purple-500"
              />
              <SummaryCard
                icon={BookOpen}
                title={t("pages.adminContentCoverage.lessons")}
                value={`${report.lessons.complete}/${report.lessons.total}`}
                subtitle={`${report.lessons.weak + report.lessons.placeholder} need work`}
                color="bg-emerald-500"
              />
              <SummaryCard
                icon={AlertTriangle}
                title={t("pages.adminContentCoverage.criticalGaps")}
                value={totalGaps}
                subtitle={t("pages.admin_content_coverage.categoriesBelow40Target")}
                color={totalGaps > 0 ? "bg-red-500" : "bg-emerald-500"}
              />
            </div>

            <div className="flex gap-1 mb-4 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
              {(["nursing", "allied", "flashcards", "lessons"] as const).map(tab => (
                <button
                  key={tab}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab ? "bg-[#BFA6F6] text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab}`}
                >
                  {tab === "nursing" && "Nursing"}
                  {tab === "allied" && "Allied Health"}
                  {tab === "flashcards" && "Flashcards"}
                  {tab === "lessons" && "Lessons"}
                </button>
              ))}
            </div>

            {activeTab === "nursing" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#BFA6F6]" /> Questions by Tier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CoverageTable
                      items={report.nursing.byTier}
                      onGenerate={handleGenerateQuestions}
                      generating={generating}
                      contentType="tier"
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#BFA6F6]" /> Questions by Body System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CoverageTable
                      items={report.nursing.byBodySystem}
                      onGenerate={handleGenerateQuestions}
                      generating={generating}
                      contentType="system"
                    />
                  </CardContent>
                </Card>

                {report.nursing.bySpecialty.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#BFA6F6]" /> Questions by Specialty/Topic
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CoverageTable
                        items={report.nursing.bySpecialty}
                        onGenerate={handleGenerateQuestions}
                        generating={generating}
                        contentType="specialty"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "allied" && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#BFA6F6]" /> Allied Health by Profession
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CoverageTable
                    items={report.alliedHealth.byProfession}
                    generating={generating}
                    contentType="profession"
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "flashcards" && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#BFA6F6]" /> Flashcards by Topic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.flashcards.byTopic.length > 0 ? (
                    <CoverageTable
                      items={report.flashcards.byTopic}
                      onGenerate={handleGenerateFlashcards}
                      generating={generating}
                      contentType="flashcard-topic"
                    />
                  ) : (
                    <p className="text-sm text-gray-500 py-4 text-center">{t("pages.adminContentCoverage.noFlashcardTopicsTrackedYet")}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "lessons" && (
              <div className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#BFA6F6]" /> Lesson Completion Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      <div className="p-3 bg-emerald-50 rounded-lg text-center" data-testid="stat-lessons-complete">
                        <p className="text-2xl font-bold text-emerald-700">{report.lessons.complete}</p>
                        <p className="text-xs text-emerald-600">{t("pages.adminContentCoverage.complete")}</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg text-center" data-testid="stat-lessons-weak">
                        <p className="text-2xl font-bold text-amber-700">{report.lessons.weak}</p>
                        <p className="text-xs text-amber-600">{t("pages.adminContentCoverage.weak")}</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg text-center" data-testid="stat-lessons-placeholder">
                        <p className="text-2xl font-bold text-orange-700">{report.lessons.placeholder}</p>
                        <p className="text-xs text-orange-600">{t("pages.adminContentCoverage.placeholder")}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg text-center" data-testid="stat-lessons-broken">
                        <p className="text-2xl font-bold text-red-700">{report.lessons.broken}</p>
                        <p className="text-xs text-red-600">{t("pages.adminContentCoverage.broken")}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center" data-testid="stat-lessons-total">
                        <p className="text-2xl font-bold text-gray-700">{report.lessons.total}</p>
                        <p className="text-xs text-gray-600">{t("pages.adminContentCoverage.total")}</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                      <div className="flex h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 transition-all" style={{ width: `${report.lessons.total > 0 ? (report.lessons.complete / report.lessons.total) * 100 : 0}%` }} />
                        <div className="bg-amber-500 transition-all" style={{ width: `${report.lessons.total > 0 ? (report.lessons.weak / report.lessons.total) * 100 : 0}%` }} />
                        <div className="bg-orange-500 transition-all" style={{ width: `${report.lessons.total > 0 ? (report.lessons.placeholder / report.lessons.total) * 100 : 0}%` }} />
                        <div className="bg-red-500 transition-all" style={{ width: `${report.lessons.total > 0 ? (report.lessons.broken / report.lessons.total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {report.lessons.missing.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Lessons ({report.lessons.missing.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {report.lessons.missing.map(lesson => (
                          <div
                            key={lesson.slug}
                            className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                            data-testid={`row-missing-lesson-${lesson.slug}`}
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                              <p className="text-xs text-gray-500">/{lesson.slug} — referenced from {lesson.referencedFrom}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => handleGenerateLesson(lesson)}
                              disabled={generating === lesson.slug}
                              data-testid={`button-gen-lesson-${lesson.slug}`}
                            >
                              {generating === lesson.slug ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <Play className="w-3 h-3 mr-1" />
                              )}
                              Generate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {genResults.length > 0 && (
              <Card className="border-0 shadow-sm mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#BFA6F6]" /> Generation Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {genResults.map((r, i) => {
                      const hasInserted = r.inserted !== undefined && r.inserted > 0;
                      const hasFailed = r.failureStage || (r.errors?.length > 0);
                      const hasDetails = (r.rejectionReasons?.length > 0) || (r.errors?.length > 0) || r.failureStage;
                      return (
                        <div key={i} className="text-xs p-2 bg-gray-50 rounded" data-testid={`row-gen-result-${i}`}>
                          <div className="flex items-start gap-2">
                            {hasFailed && !hasInserted ? (
                              <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                            ) : hasFailed && hasInserted ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="font-medium">[{r.type}] {r.key || "auto-fill"}</span>
                              {r.requested !== undefined && (
                                <span className="text-gray-500 ml-2">
                                  Req: {r.requested}, Gen: {r.generated ?? 0}, Valid: {r.validated ?? 0}, Inserted: {r.inserted ?? 0}
                                  {(r.rejected ?? 0) > 0 && <span className="text-amber-600"> ({r.rejected} rejected)</span>}
                                </span>
                              )}
                              {r.generated !== undefined && r.requested === undefined && (
                                <span className="text-gray-500 ml-2">
                                  Generated: {r.generated}, Accepted: {r.inserted ?? r.accepted ?? 0}
                                </span>
                              )}
                              {r.success !== undefined && (
                                <span className="text-gray-500 ml-2">{r.success ? "Success" : `Failed: ${r.error}`}</span>
                              )}
                              {r.questions && (
                                <span className="text-gray-500 ml-2">
                                  Q: {r.questions.reduce((s: number, q: any) => s + (q.inserted || q.accepted || 0), 0)} inserted
                                </span>
                              )}
                              {r.failureStage && (
                                <span className="text-red-500 ml-1">
                                  [failed at: {r.failureStage}]
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 ml-auto shrink-0">{new Date(r.time).toLocaleTimeString()}</span>
                          </div>
                          {hasDetails && (
                            <details className="mt-1.5 ml-5" data-testid={`details-gen-result-${i}`}>
                              <summary className="text-gray-400 cursor-pointer hover:text-gray-600">
                                {r.errors?.length ? `${r.errors.length} error(s)` : ""}
                                {r.errors?.length && r.rejectionReasons?.length ? ", " : ""}
                                {r.rejectionReasons?.length ? `${r.rejectionReasons.length} rejection(s)` : ""}
                                {r.failureStage && !r.errors?.length && !r.rejectionReasons?.length ? `Failed at: ${r.failureStage}` : ""}
                              </summary>
                              <div className="mt-1 space-y-1 text-[11px]">
                                {r.failureStage && (
                                  <div className="text-red-500">Stage: {r.failureStage}</div>
                                )}
                                {r.errors?.map((e: string, ei: number) => (
                                  <div key={`e-${ei}`} className="text-red-400 break-words">{e}</div>
                                ))}
                                {r.rejectionReasons?.map((reason: string, ri: number) => (
                                  <div key={`r-${ri}`} className="text-amber-500 break-words">{reason}</div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {report.generationHistory.length > 0 && (
              <Card className="border-0 shadow-sm mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#BFA6F6]" /> Recent Generation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.template")}</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.variant")}</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.status")}</th>
                          <th className="text-right py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.generated")}</th>
                          <th className="text-right py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.accepted")}</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.triggered")}</th>
                          <th className="text-left py-2 px-2 text-gray-500 font-medium">{t("pages.adminContentCoverage.date")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.generationHistory.map((h: any) => (
                          <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2 px-2">{h.templateKey}</td>
                            <td className="py-2 px-2">{h.variantKey}</td>
                            <td className="py-2 px-2">
                              <Badge variant="outline" className={`text-xs ${
                                h.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                                h.status === "failed" ? "bg-red-50 text-red-700" :
                                "bg-gray-50 text-gray-700"
                              }`}>{h.status}</Badge>
                            </td>
                            <td className="py-2 px-2 text-right">{h.generated || 0}</td>
                            <td className="py-2 px-2 text-right">{h.accepted || 0}</td>
                            <td className="py-2 px-2">{h.triggeredBy}</td>
                            <td className="py-2 px-2 text-gray-500">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
