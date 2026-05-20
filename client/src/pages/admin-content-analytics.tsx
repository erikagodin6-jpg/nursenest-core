import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, RefreshCw, Copy, Check, Database, BookOpen, FileText, Layers,
  AlertTriangle, BarChart3, PieChart, TrendingUp, Package, Stethoscope,
  Microscope, Activity, Zap, ClipboardCheck, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
interface TierData {
  questions: number;
  flashcardsPublished: number;
  flashcardsReview: number;
  totalQuestions: number;
  draftQuestions: number;
}

interface AlliedData {
  published: number;
  other: number;
  flashcards: number;
  statuses: Record<string, number>;
}

interface AnalyticsData {
  tiers: Record<string, TierData>;
  allied: Record<string, AlliedData>;
  imaging: {
    questions: number;
    flashcards: number;
    totalQuestions: number;
    totalFlashcards: number;
    byStatus: { questions: Record<string, number>; flashcards: Record<string, number> };
  };
  generatedQuestions: number;
  contentItems: Record<string, number>;
  contentByStatus: Record<string, Record<string, number>>;
  flashcardDecks: number;
  deckFlashcards: number;
  encyclopedia: Array<{ profession: string; count: number }>;
  seoArticles: { byStatus: Record<string, number>; total: number };
  mlt: { questions: { published: number; total: number; byDiscipline: Record<string, number> }; flashcards: { published: number; total: number } };
  paramedic: { total: number; published: number };
  pharmtech: { published: number; draft: number };
  contentHealth: {
    questionsWithoutFlashcards: number;
    questionsWithoutRationale: number;
    questionsWithoutImages: number;
    draftsReadyForReview: number;
    totalDrafts: number;
  };
  pipelineOpportunity: {
    totalDrafts: number;
    draftsByStatus: Record<string, number>;
    estimatedPublishable: number;
    generatedQuestions: number;
  };
  validation: Array<{ check: string; status: string; detail: string }>;
  contentItemsByTier: Record<string, number>;
  totals: {
    questions: number;
    flashcards: number;
    lessons: number;
    blogs: number;
    decks: number;
    drafts: number;
    alliedContent: number;
    imagingContent: number;
  };
  qualityMetrics: {
    flashcardCoveragePercent: string;
    rationalePercent: string;
    publishedVsTotal: {
      questions: { published: number; total: number };
      flashcards: { published: number; needsReview: number };
    };
  };
  dataSource: string;
  dataQuality: string;
  queryErrors?: string[];
  timestamp: string;
}

interface ClinicalJudgmentCoverage {
  questionsByFormat: Record<string, number>;
  questionsByTier: Record<string, Record<string, number>>;
  questionsBySpecialty: Record<string, Record<string, number>>;
  formatDiversityScore: number;
  totalFormattedQuestions: number;
  uniqueFormatsUsed: number;
  maxPossibleFormats: number;
}

interface BreakdownData {
  byExamType: Array<{ exam: string; tier: string; count: number }>;
  bySpecialty: Array<{ body_system: string; count: number }>;
  byReviewStatus: Array<{ status: string; count: number }>;
  topDecks: Array<{ title: string; tier: string; card_count: number; career_type: string }>;
  formatDistribution?: Record<string, number>;
  clinicalJudgmentCoverage?: ClinicalJudgmentCoverage;
}

const TIER_LABELS: Record<string, string> = {
  rpn: "RPN / LVN",
  rn: "RN",
  np: "Nurse Practitioner",
  rrt: "Respiratory Therapist",
  free: "Free Tier",
};

const TIER_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  rpn: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" },
  rn: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
  np: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-500" },
  rrt: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
  free: { bg: "bg-gray-50", text: "text-gray-700", bar: "bg-gray-400" },
};

const ALLIED_LABELS: Record<string, string> = {
  paramedic: "Paramedic",
  emergencyNursing: "Emergency Nursing",
  occupationalTherapy: "Occupational Therapy",
  criticalCare: "Critical Care Nursing",
  socialWorker: "Social Worker",
  psychotherapist: "Psychotherapist",
  addictionsCounsellor: "Addictions Counselling",
  mlt: "Medical Lab Tech",
  peds_nursing: "Pediatric Nursing",
};

function getAuthHeaders(): Record<string, string> {

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = localStorage.getItem("nursenest-user-token");
  if (token) headers["x-user-token"] = token;
  const creds = localStorage.getItem("nursenest-credentials");
  if (creds) {
    try {
      const { username, password } = JSON.parse(creds);
      headers["x-username"] = username;
      headers["x-password"] = password;
    } catch {}
  }
  return headers;
}

function DonutChart({ segments, size = 120 }: { segments: Array<{ label: string; value: number; color: string }>; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <div className="text-sm text-slate-400">{t("pages.adminContentAnalytics.noData")}</div>;
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        {segments.filter(s => s.value > 0).map((seg, i) => {
          const pct = seg.value / total;
          const dashLen = circumference * pct;
          const dashOffset = -offset;
          offset += dashLen;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={16}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="text-sm font-bold fill-slate-700">
          {total.toLocaleString()}
        </text>
      </svg>
      <div className="space-y-1">
        {segments.filter(s => s.value > 0).map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-slate-600">{seg.label}</span>
            <span className="font-mono font-semibold text-slate-800">{seg.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ items, maxValue }: { items: Array<{ label: string; value: number; color: string }>; maxValue?: number }) {
  const max = maxValue || Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-slate-600 w-24 text-right truncate flex-shrink-0">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max((item.value / max) * 100, 1)}%`, backgroundColor: item.color }}
            />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-700 w-12 text-right">{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminContentAnalytics() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("summary");
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, breakdownRes] = await Promise.all([
        fetch("/api/admin/content-analytics", { headers: getAuthHeaders() }),
        fetch("/api/admin/content-analytics/breakdown", { headers: getAuthHeaders() }),
      ]);
      if (!summaryRes.ok) throw new Error(`Failed to fetch summary: ${summaryRes.status}`);
      const summaryJson = await summaryRes.json();
      setData(summaryJson);
      if (breakdownRes.ok) {
        setBreakdown(await breakdownRes.json());
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const [recalcRes, breakdownRes] = await Promise.all([
        fetch("/api/admin/content-analytics/recalculate", { method: "POST", headers: getAuthHeaders() }),
        fetch("/api/admin/content-analytics/breakdown", { headers: getAuthHeaders() }),
      ]);
      if (!recalcRes.ok) throw new Error(`Recalculate failed: ${recalcRes.status}`);
      const json = await recalcRes.json();
      setData(json.data);
      if (breakdownRes.ok) setBreakdown(await breakdownRes.json());
      const qualityNote = json.data?.dataQuality === "degraded" ? " (some queries had errors)" : "";
      toast({ title: "Content totals recalculated", description: `Updated at ${new Date(json.recalculatedAt).toLocaleString()}${qualityNote}` });
    } catch (e: any) {
      toast({ title: "Recalculate failed", description: e.message, variant: "destructive" });
    } finally {
      setRecalculating(false);
    }
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  const generateTextReport = (): string => {
    if (!data) return "";
    const lines: string[] = [];
    lines.push("=== NurseNest Content Analytics Report ===");
    lines.push(`Generated: ${new Date(data.timestamp).toLocaleString()}`);
    lines.push(`Data Source: ${data.dataSource}`);
    lines.push("");
    lines.push("GRAND TOTALS");
    lines.push(`  Total Questions: ${data.totals.questions.toLocaleString()}`);
    lines.push(`  Total Flashcards: ${data.totals.flashcards.toLocaleString()}`);
    lines.push(`  Flashcard Decks: ${data.totals.decks}`);
    lines.push(`  Blogs/Articles: ${data.totals.blogs}`);
    lines.push(`  Draft Pipeline: ${data.totals.drafts}`);
    lines.push(`  Allied Content: ${data.totals.alliedContent}`);
    lines.push(`  Imaging Content: ${data.totals.imagingContent}`);
    lines.push("");
    lines.push("--- NURSING TIERS ---");
    for (const [tier, d] of Object.entries(data.tiers)) {
      const label = TIER_LABELS[tier] || tier.toUpperCase();
      const totalFC = d.flashcardsPublished + d.flashcardsReview;
      const ratio = d.questions > 0 ? ((totalFC / d.questions) * 100).toFixed(0) : "0";
      lines.push(`  ${label}: ${d.questions}Q published / ${d.flashcardsPublished}FC published / ${ratio}% ratio`);
    }
    lines.push("");
    lines.push("--- CONTENT HEALTH ---");
    lines.push(`  Missing Rationale: ${data.contentHealth.questionsWithoutRationale}`);
    lines.push(`  Missing Images: ${data.contentHealth.questionsWithoutImages}`);
    lines.push(`  Drafts Ready: ${data.contentHealth.draftsReadyForReview}`);
    lines.push("");
    lines.push("--- QUALITY METRICS ---");
    lines.push(`  Flashcard Coverage: ${data.qualityMetrics.flashcardCoveragePercent}%`);
    lines.push(`  Rationale Coverage: ${data.qualityMetrics.rationalePercent}%`);
    if (data.validation.length > 0) {
      lines.push("");
      lines.push("--- VALIDATION FLAGS ---");
      for (const v of data.validation) {
        lines.push(`  [${v.status.toUpperCase()}] ${v.check}: ${v.detail}`);
      }
    }
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTextReport());
    setCopied(true);
    toast({ title: "Report copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3" data-testid="loading-indicator">
          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
          <span className="text-slate-500">{t("pages.adminContentAnalytics.loadingContentAnalytics")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-medium" data-testid="error-message">Error: {error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={fetchData} data-testid="button-retry">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const sections = [
    { id: "summary", label: "Summary" },
    { id: "clinical", label: "Clinical Judgment" },
    { id: "tiers", label: "Tier Breakdown" },
    { id: "health", label: "Content Health" },
    { id: "allied", label: "Allied & Imaging" },
    { id: "pipeline", label: "Pipeline" },
    { id: "charts", label: "Charts" },
    { id: "tables", label: "Tables" },
    { id: "report", label: "Report" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900" data-testid="text-page-title">{t("pages.adminContentAnalytics.contentAnalytics")}</h1>
            <Badge variant="outline" className="text-xs gap-1" data-testid="badge-data-source">
              <Database className="w-3 h-3" />
              {data.dataSource}
            </Badge>
            {data.dataQuality === "degraded" && (
              <Badge variant="outline" className="text-xs gap-1 border-amber-300 text-amber-700 bg-amber-50" data-testid="badge-data-quality">
                <AlertTriangle className="w-3 h-3" />
                Partial Data
              </Badge>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleCopy} data-testid="button-copy-report">
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied" : "Copy Report"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRecalculate}
              disabled={recalculating}
              data-testid="button-recalculate"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${recalculating ? "animate-spin" : ""}`} />
              {recalculating ? "Recalculating..." : "Recalculate Content Totals"}
            </Button>
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-4" data-testid="text-timestamp">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-lg border border-slate-200 p-1 overflow-x-auto" data-testid="nav-sections">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeSection === s.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
              data-testid={`tab-${s.id}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {activeSection === "summary" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" data-testid="section-summary-cards">
              <SummaryCard icon={<Database className="w-5 h-5 text-blue-600" />} label={t("pages.adminContentAnalytics.totalQuestions")} value={data.totals.questions.toLocaleString()} bg="bg-blue-50" testId="card-total-questions" />
              <SummaryCard icon={<Layers className="w-5 h-5 text-emerald-600" />} label={t("pages.adminContentAnalytics.totalFlashcards")} value={data.totals.flashcards.toLocaleString()} bg="bg-emerald-50" testId="card-total-flashcards" />
              <SummaryCard icon={<FileText className="w-5 h-5 text-purple-600" />} label={t("pages.adminContentAnalytics.flashcardDecks")} value={data.totals.decks.toLocaleString()} bg="bg-purple-50" testId="card-total-decks" />
              <SummaryCard icon={<BookOpen className="w-5 h-5 text-amber-600" />} label={t("pages.adminContentAnalytics.blogsArticles")} value={data.totals.blogs.toLocaleString()} bg="bg-amber-50" testId="card-total-blogs" />
              <SummaryCard icon={<Package className="w-5 h-5 text-orange-600" />} label={t("pages.adminContentAnalytics.draftPipeline")} value={data.totals.drafts.toLocaleString()} bg="bg-orange-50" testId="card-total-drafts" />
              <SummaryCard icon={<Stethoscope className="w-5 h-5 text-teal-600" />} label={t("pages.adminContentAnalytics.alliedContent")} value={data.totals.alliedContent.toLocaleString()} bg="bg-teal-50" testId="card-total-allied" />
              <SummaryCard icon={<Microscope className="w-5 h-5 text-indigo-600" />} label={t("pages.adminContentAnalytics.imagingContent")} value={data.totals.imagingContent.toLocaleString()} bg="bg-indigo-50" testId="card-total-imaging" />
              <SummaryCard icon={<BookOpen className="w-5 h-5 text-cyan-600" />} label={t("pages.adminContentAnalytics.generatedDrafts")} value={data.generatedQuestions.toLocaleString()} bg="bg-cyan-50" testId="card-generated-drafts" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card data-testid="card-quality-flashcard-coverage">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" /> Flashcard Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{data.qualityMetrics.flashcardCoveragePercent}%</div>
                  <ProgressBar value={Number(data.qualityMetrics.flashcardCoveragePercent)} color={Number(data.qualityMetrics.flashcardCoveragePercent) >= 80 ? "bg-emerald-500" : "bg-amber-500"} />
                  <p className="text-xs text-slate-500 mt-1">{t("pages.adminContentAnalytics.questionsCoveredByFlashcards")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-quality-rationale-coverage">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-emerald-500" /> Rationale Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{data.qualityMetrics.rationalePercent}%</div>
                  <ProgressBar value={Number(data.qualityMetrics.rationalePercent)} color={Number(data.qualityMetrics.rationalePercent) >= 90 ? "bg-emerald-500" : "bg-amber-500"} />
                  <p className="text-xs text-slate-500 mt-1">{t("pages.adminContentAnalytics.publishedQuestionsWithRationale")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-quality-published-ratio">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" /> Published vs Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{t("pages.adminContentAnalytics.questions")}</span>
                      <span className="font-mono text-slate-800">
                        {data.qualityMetrics.publishedVsTotal.questions.published.toLocaleString()} / {data.qualityMetrics.publishedVsTotal.questions.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{t("pages.adminContentAnalytics.fcNeedsReview")}</span>
                      <span className="font-mono text-amber-600">
                        {data.qualityMetrics.publishedVsTotal.flashcards.needsReview.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {data.validation.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50" data-testid="card-validation">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Validation Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.validation.map((v, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm py-1">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-amber-800">{v.check}: </span>
                        <span className="text-amber-700">{v.detail}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === "clinical" && breakdown?.clinicalJudgmentCoverage && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Clinical Judgment Coverage
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card data-testid="card-format-diversity-score">
                <CardContent className="pt-4 text-center">
                  <div className="text-4xl font-bold text-indigo-700">
                    {breakdown.clinicalJudgmentCoverage.formatDiversityScore}%
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{t("pages.adminContentAnalytics.formatDiversityScore")}</p>
                  <ProgressBar
                    value={breakdown.clinicalJudgmentCoverage.formatDiversityScore}
                    color={breakdown.clinicalJudgmentCoverage.formatDiversityScore >= 60 ? "bg-emerald-500" : breakdown.clinicalJudgmentCoverage.formatDiversityScore >= 30 ? "bg-amber-500" : "bg-red-500"}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {breakdown.clinicalJudgmentCoverage.uniqueFormatsUsed} of {breakdown.clinicalJudgmentCoverage.maxPossibleFormats} formats used
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-total-formatted">
                <CardContent className="pt-4 text-center">
                  <div className="text-4xl font-bold text-slate-800">
                    {breakdown.clinicalJudgmentCoverage.totalFormattedQuestions.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{t("pages.adminContentAnalytics.totalPublishedQuestions")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-unique-formats">
                <CardContent className="pt-4 text-center">
                  <div className="text-4xl font-bold text-purple-700">
                    {breakdown.clinicalJudgmentCoverage.uniqueFormatsUsed}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{t("pages.adminContentAnalytics.uniqueFormatsActive")}</p>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-format-distribution">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-500" /> Questions by Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const cj = breakdown.clinicalJudgmentCoverage;
                  const formatColors: Record<string, string> = {
                    MCQ: "#3b82f6", SATA: "#10b981", BOWTIE: "#8b5cf6",
                    CASE_STUDY_SERIES: "#f59e0b", MATRIX: "#ef4444", TREND: "#06b6d4",
                    DRAG_DROP: "#ec4899", HIGHLIGHT_TEXT: "#14b8a6", LAB_INTERPRETATION: "#f97316",
                    IMAGE_HOTSPOT: "#6366f1", CALCULATION_NUMERIC: "#84cc16", MATCHING_GRID: "#a855f7",
                  };
                  const items = Object.entries(cj.questionsByFormat)
                    .sort((a, b) => b[1] - a[1])
                    .map(([fmt, count]) => ({
                      label: fmt.replace(/_/g, " "),
                      value: count,
                      color: formatColors[fmt] || "#94a3b8",
                    }));
                  return items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DonutChart segments={items} size={160} />
                      <BarChart items={items} />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">{t("pages.adminContentAnalytics.noFormatDataAvailable")}</p>
                  );
                })()}
              </CardContent>
            </Card>

            <Card data-testid="card-format-by-tier">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.formatDistributionByTier")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.tier")}</th>
                        {Object.keys(breakdown.clinicalJudgmentCoverage.questionsByFormat).map(fmt => (
                          <th key={fmt} className="text-right px-2 py-2 font-medium text-slate-600 text-xs whitespace-nowrap">
                            {fmt.replace(/_/g, " ").substring(0, 12)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(breakdown.clinicalJudgmentCoverage.questionsByTier).map(([tier, formats]) => (
                        <tr key={tier} className="border-t border-slate-100" data-testid={`row-format-tier-${tier}`}>
                          <td className="px-3 py-2 font-medium">{TIER_LABELS[tier] || tier}</td>
                          {Object.keys(breakdown.clinicalJudgmentCoverage!.questionsByFormat).map(fmt => (
                            <td key={fmt} className="px-2 py-2 text-right font-mono text-xs">
                              {formats[fmt] || 0}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-format-by-specialty">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.formatDistributionBySpecialtyTop")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.specialty")}</th>
                        <th className="text-right px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.formatsUsed")}</th>
                        <th className="text-right px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.total")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(breakdown.clinicalJudgmentCoverage.questionsBySpecialty)
                        .sort((a, b) => Object.values(b[1]).reduce((s, c) => s + c, 0) - Object.values(a[1]).reduce((s, c) => s + c, 0))
                        .slice(0, 10)
                        .map(([specialty, formats]) => (
                          <tr key={specialty} className="border-t border-slate-100" data-testid={`row-format-specialty-${specialty}`}>
                            <td className="px-3 py-2">{specialty}</td>
                            <td className="px-3 py-2 text-right">
                              <div className="flex gap-1 justify-end flex-wrap">
                                {Object.entries(formats).map(([fmt, count]) => (
                                  <span key={fmt} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {fmt.replace(/_/g, " ").substring(0, 10)}: {count}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right font-mono">
                              {Object.values(formats).reduce((s, c) => s + c, 0)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-target-distribution">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.targetFormatDistribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { fmt: "MCQ", target: "40-50%", color: "bg-blue-50 text-blue-700" },
                    { fmt: "SATA", target: "15%", color: "bg-emerald-50 text-emerald-700" },
                    { fmt: "BOWTIE", target: "10%", color: "bg-purple-50 text-purple-700" },
                    { fmt: "CASE_STUDY_SERIES", target: "10%", color: "bg-amber-50 text-amber-700" },
                    { fmt: "MATRIX", target: "5%", color: "bg-red-50 text-red-700" },
                    { fmt: "TREND", target: "5%", color: "bg-cyan-50 text-cyan-700" },
                    { fmt: "DRAG_DROP", target: "3%", color: "bg-pink-50 text-pink-700" },
                    { fmt: "HIGHLIGHT_TEXT", target: "1%", color: "bg-teal-50 text-teal-700" },
                    { fmt: "LAB_INTERPRETATION", target: "1%", color: "bg-orange-50 text-orange-700" },
                    { fmt: "IMAGE_HOTSPOT", target: "~1%", color: "bg-indigo-50 text-indigo-700" },
                    { fmt: "CALCULATION_NUMERIC", target: "~1%", color: "bg-lime-50 text-lime-700" },
                    { fmt: "MATCHING_GRID", target: "~1%", color: "bg-violet-50 text-violet-700" },
                  ].map(({ fmt, target, color }) => {
                    const actual = breakdown.clinicalJudgmentCoverage!.questionsByFormat[fmt] || 0;
                    const total = breakdown.clinicalJudgmentCoverage!.totalFormattedQuestions || 1;
                    const actualPct = ((actual / total) * 100).toFixed(1);
                    return (
                      <div key={fmt} className={`p-3 rounded-lg ${color}`} data-testid={`card-target-${fmt}`}>
                        <div className="text-xs font-medium">{fmt.replace(/_/g, " ")}</div>
                        <div className="text-lg font-bold">{actual.toLocaleString()}</div>
                        <div className="text-xs">
                          Actual: {actualPct}% / Target: {target}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "clinical" && (!breakdown || !breakdown.clinicalJudgmentCoverage) && (
          <div className="text-center py-12">
            <p className="text-slate-500" data-testid="text-clinical-no-data">
              Clinical judgment coverage data is loading or unavailable. Try recalculating.
            </p>
          </div>
        )}

        {activeSection === "tiers" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminContentAnalytics.questionFlashcardCountsByTier")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.tiers).map(([tier, d]) => {
                const label = TIER_LABELS[tier] || tier.toUpperCase();
                const colors = TIER_COLORS[tier] || TIER_COLORS.free;
                const totalFC = d.flashcardsPublished + d.flashcardsReview;
                const ratio = d.questions > 0 ? ((totalFC / d.questions) * 100).toFixed(0) : "0";
                return (
                  <Card key={tier} className={`border ${colors.bg}`} data-testid={`card-tier-${tier}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-base font-semibold ${colors.text}`}>{label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Row label={t("pages.adminContentAnalytics.publishedQuestions")} value={d.questions.toLocaleString()} testId={`text-questions-${tier}`} />
                      <Row label={t("pages.adminContentAnalytics.draftotherQuestions")} value={d.draftQuestions.toLocaleString()} testId={`text-draft-questions-${tier}`} />
                      <Row label={t("pages.adminContentAnalytics.publishedFlashcards")} value={d.flashcardsPublished.toLocaleString()} testId={`text-fc-published-${tier}`} />
                      <Row label={t("pages.adminContentAnalytics.needsReview")} value={d.flashcardsReview.toLocaleString()} testId={`text-fc-review-${tier}`} />
                      <div className="pt-1 border-t border-slate-200">
                        <Row label={t("pages.adminContentAnalytics.qtofcRatio")} value={`${ratio}%`} testId={`text-ratio-${tier}`} highlight={Number(ratio) < 80} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mt-8">{t("pages.adminContentAnalytics.flashcardBreakdown")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card data-testid="card-deck-summary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.deckSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Row label={t("pages.adminContentAnalytics.totalDecks")} value={data.flashcardDecks.toLocaleString()} testId="text-total-decks" />
                  <Row label={t("pages.adminContentAnalytics.totalDeckCards")} value={data.deckFlashcards.toLocaleString()} testId="text-total-deck-cards" />
                  <Row label={t("pages.adminContentAnalytics.bankPublished")} value={Object.values(data.tiers).reduce((s, t) => s + t.flashcardsPublished, 0).toLocaleString()} testId="text-bank-published" />
                  <Row label={t("pages.adminContentAnalytics.bankNeedsReview")} value={Object.values(data.tiers).reduce((s, t) => s + t.flashcardsReview, 0).toLocaleString()} testId="text-bank-review" />
                </CardContent>
              </Card>
              <Card data-testid="card-content-items-by-tier">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.contentItemsByTier")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(data.contentItemsByTier).map(([tier, count]) => (
                    <Row key={tier} label={TIER_LABELS[tier] || tier} value={String(count)} testId={`text-ci-tier-${tier}`} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === "health" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminContentAnalytics.contentHealthAudit")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <HealthCard
                label={t("pages.adminContentAnalytics.missingRationale")}
                value={data.contentHealth.questionsWithoutRationale}
                icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
                severity={data.contentHealth.questionsWithoutRationale > 50 ? "high" : data.contentHealth.questionsWithoutRationale > 10 ? "medium" : "low"}
                description={t("pages.adminContentAnalytics.publishedQuestionsWithoutRationaleText")}
                testId="card-health-rationale"
              />
              <HealthCard
                label={t("pages.adminContentAnalytics.missingImages")}
                value={data.contentHealth.questionsWithoutImages}
                icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
                severity={data.contentHealth.questionsWithoutImages > 100 ? "high" : data.contentHealth.questionsWithoutImages > 20 ? "medium" : "low"}
                description={t("pages.adminContentAnalytics.publishedQuestionsWithoutImageAssets")}
                testId="card-health-images"
              />
              <HealthCard
                label={t("pages.adminContentAnalytics.draftsReadyForReview")}
                value={data.contentHealth.draftsReadyForReview}
                icon={<ClipboardCheck className="w-5 h-5 text-blue-500" />}
                severity="info"
                description={t("pages.adminContentAnalytics.draftsAwaitingEditorialReview")}
                testId="card-health-drafts-ready"
              />
              <HealthCard
                label={t("pages.adminContentAnalytics.totalDraftPipeline")}
                value={data.contentHealth.totalDrafts}
                icon={<Package className="w-5 h-5 text-purple-500" />}
                severity="info"
                description={t("pages.adminContentAnalytics.allDraftsAcrossStatuses")}
                testId="card-health-total-drafts"
              />
              <HealthCard
                label={t("pages.adminContentAnalytics.flashcardCoverageGap")}
                value={data.contentHealth.questionsWithoutFlashcards}
                icon={<Layers className="w-5 h-5 text-red-500" />}
                severity={data.contentHealth.questionsWithoutFlashcards > 50 ? "high" : "medium"}
                description={t("pages.adminContentAnalytics.publishedQuestionsInTiersWith")}
                testId="card-health-fc-gap"
              />
            </div>

            {Object.keys(data.contentItems).length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminContentAnalytics.contentItemsByType")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(data.contentItems).map(([type, count]) => (
                    <Card key={type} data-testid={`card-content-${type}`}>
                      <CardContent className="pt-4">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">{type.replace(/_/g, " ")}</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{count.toLocaleString()}</div>
                        {data.contentByStatus[type] && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {Object.entries(data.contentByStatus[type]).map(([status, sCount]) => (
                              <span key={status} className={`text-[10px] px-1.5 py-0.5 rounded ${status === "published" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                                {status}: {sCount}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === "allied" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminContentAnalytics.alliedHealth")}</h2>
            {Object.keys(data.allied).length > 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-allied">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.careerType")}</th>
                      <th className="text-right px-4 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.published")}</th>
                      <th className="text-right px-4 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.flashcards")}</th>
                      <th className="text-right px-4 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.statusBreakdown")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.allied).map(([ct, d]) => (
                      <tr key={ct} className="border-t border-slate-100" data-testid={`row-allied-${ct}`}>
                        <td className="px-4 py-2 text-slate-800 font-medium">{ALLIED_LABELS[ct] || ct}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-700">{d.published.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-700">{d.flashcards.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex gap-1 justify-end flex-wrap">
                            {Object.entries(d.statuses).map(([status, count]) => (
                              <span key={status} className={`text-xs px-2 py-0.5 rounded ${status === "published" || status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                {status}: {count}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">{t("pages.adminContentAnalytics.noAlliedHealthQuestionsFound")}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card data-testid="card-imaging">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-indigo-500" /> Diagnostic Imaging
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Row label={t("pages.adminContentAnalytics.publishedQuestions2")} value={String(data.imaging.questions)} testId="text-imaging-questions" />
                  <Row label={t("pages.adminContentAnalytics.totalQuestions2")} value={String(data.imaging.totalQuestions)} testId="text-imaging-total-q" />
                  <Row label={t("pages.adminContentAnalytics.publishedFlashcards2")} value={String(data.imaging.flashcards)} testId="text-imaging-flashcards" />
                  <Row label={t("pages.adminContentAnalytics.totalFlashcards2")} value={String(data.imaging.totalFlashcards)} testId="text-imaging-total-fc" />
                </CardContent>
              </Card>

              <Card data-testid="card-mlt">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-500" /> MLT Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Row label={t("pages.adminContentAnalytics.publishedQuestions3")} value={String(data.mlt.questions.published)} testId="text-mlt-questions" />
                  <Row label={t("pages.adminContentAnalytics.totalQuestions3")} value={String(data.mlt.questions.total)} testId="text-mlt-total-q" />
                  <Row label={t("pages.adminContentAnalytics.publishedFlashcards3")} value={String(data.mlt.flashcards.published)} testId="text-mlt-flashcards" />
                </CardContent>
              </Card>

              <Card data-testid="card-paramedic">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> Paramedic & PharmTech
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Row label={t("pages.adminContentAnalytics.paramedicPublished")} value={String(data.paramedic.published)} testId="text-paramedic-published" />
                  <Row label={t("pages.adminContentAnalytics.paramedicTotal")} value={String(data.paramedic.total)} testId="text-paramedic-total" />
                  <Row label={t("pages.adminContentAnalytics.pharmtechPublished")} value={String(data.pharmtech.published)} testId="text-pharmtech-published" />
                  <Row label={t("pages.adminContentAnalytics.pharmtechDraft")} value={String(data.pharmtech.draft)} testId="text-pharmtech-draft" />
                </CardContent>
              </Card>
            </div>

            {data.encyclopedia.length > 0 && (
              <Card data-testid="card-encyclopedia">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.encyclopediaEntries")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {data.encyclopedia.map((e) => (
                    <Row key={e.profession} label={ALLIED_LABELS[e.profession] || e.profession} value={String(e.count)} testId={`text-encyclopedia-${e.profession}`} />
                  ))}
                  <div className="pt-1 border-t border-slate-100">
                    <Row label={t("pages.adminContentAnalytics.total2")} value={String(data.encyclopedia.reduce((s, e) => s + e.count, 0))} testId="text-encyclopedia-total" bold />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === "pipeline" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Pipeline Opportunity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard icon={<Package className="w-5 h-5 text-purple-600" />} label={t("pages.adminContentAnalytics.totalDrafts")} value={data.pipelineOpportunity.totalDrafts.toLocaleString()} bg="bg-purple-50" testId="card-pipeline-total" />
              <SummaryCard icon={<ClipboardCheck className="w-5 h-5 text-green-600" />} label={t("pages.adminContentAnalytics.publishable")} value={data.pipelineOpportunity.estimatedPublishable.toLocaleString()} bg="bg-green-50" testId="card-pipeline-publishable" />
              <SummaryCard icon={<BookOpen className="w-5 h-5 text-blue-600" />} label={t("pages.adminContentAnalytics.generatedQuestions")} value={data.pipelineOpportunity.generatedQuestions.toLocaleString()} bg="bg-blue-50" testId="card-pipeline-generated" />
              <SummaryCard icon={<FileText className="w-5 h-5 text-teal-600" />} label={t("pages.adminContentAnalytics.seoArticles")} value={data.seoArticles.total.toLocaleString()} bg="bg-teal-50" testId="card-pipeline-seo" />
            </div>

            {Object.keys(data.pipelineOpportunity.draftsByStatus).length > 0 && (
              <Card data-testid="card-drafts-by-status">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.draftInventoryByStatus")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(data.pipelineOpportunity.draftsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{status.replace(/_/g, " ")}</span>
                        <Badge variant="outline" className="font-mono">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {Object.keys(data.seoArticles.byStatus).length > 0 && (
              <Card data-testid="card-seo-articles-status">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.seoArticlesByStatus")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(data.seoArticles.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{status}</span>
                        <Badge variant="outline" className="font-mono">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === "charts" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" /> Distribution Charts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="chart-tier-distribution">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.questionsByTier")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonutChart segments={Object.entries(data.tiers).map(([tier, d]) => ({
                    label: TIER_LABELS[tier] || tier,
                    value: d.questions,
                    color: tier === "rpn" ? "#3b82f6" : tier === "rn" ? "#10b981" : tier === "np" ? "#8b5cf6" : tier === "rrt" ? "#f59e0b" : "#94a3b8",
                  }))} />
                </CardContent>
              </Card>

              <Card data-testid="chart-published-vs-review">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.publishedVsNeedsReview")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonutChart segments={[
                    { label: "Published Questions", value: data.qualityMetrics.publishedVsTotal.questions.published, color: "#10b981" },
                    { label: "Unpublished Questions", value: data.qualityMetrics.publishedVsTotal.questions.total - data.qualityMetrics.publishedVsTotal.questions.published, color: "#f59e0b" },
                    { label: "FC Needs Review", value: data.qualityMetrics.publishedVsTotal.flashcards.needsReview, color: "#ef4444" },
                  ]} />
                </CardContent>
              </Card>

              <Card data-testid="chart-question-vs-fc" className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.questionVsFlashcardRatioBy")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart items={Object.entries(data.tiers).flatMap(([tier, d]) => {
                    const colors = TIER_COLORS[tier] || TIER_COLORS.free;
                    return [
                      { label: `${(TIER_LABELS[tier] || tier)} Q`, value: d.questions, color: tier === "rpn" ? "#3b82f6" : tier === "rn" ? "#10b981" : tier === "np" ? "#8b5cf6" : "#f59e0b" },
                      { label: `${(TIER_LABELS[tier] || tier)} FC`, value: d.flashcardsPublished, color: tier === "rpn" ? "#93c5fd" : tier === "rn" ? "#6ee7b7" : tier === "np" ? "#c4b5fd" : "#fcd34d" },
                    ];
                  })} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === "tables" && breakdown && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Breakdown Tables
            </h2>

            {breakdown.byReviewStatus.length > 0 && (
              <Card data-testid="table-review-status">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.questionsByReviewStatus")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.status")}</th>
                          <th className="text-right px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.count")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.byReviewStatus.map((r, i) => (
                          <tr key={i} className="border-t border-slate-100" data-testid={`row-status-${r.status}`}>
                            <td className="px-3 py-2 capitalize">{r.status}</td>
                            <td className="px-3 py-2 text-right font-mono">{r.count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {breakdown.bySpecialty.length > 0 && (
              <Card data-testid="table-specialty">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.topSpecialtiesPublishedQuestions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.bodySystemSpecialty")}</th>
                          <th className="text-right px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.count2")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.bySpecialty.map((r, i) => (
                          <tr key={i} className="border-t border-slate-100" data-testid={`row-specialty-${i}`}>
                            <td className="px-3 py-2">{r.body_system}</td>
                            <td className="px-3 py-2 text-right font-mono">{r.count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {breakdown.topDecks.length > 0 && (
              <Card data-testid="table-top-decks">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.topFlashcardDecks")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.title")}</th>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.tier2")}</th>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.career")}</th>
                          <th className="text-right px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.cards")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.topDecks.map((d, i) => (
                          <tr key={i} className="border-t border-slate-100" data-testid={`row-deck-${i}`}>
                            <td className="px-3 py-2 max-w-[200px] truncate">{d.title}</td>
                            <td className="px-3 py-2">
                              <Badge variant="outline" className="text-xs">{d.tier || "free"}</Badge>
                            </td>
                            <td className="px-3 py-2 text-xs text-slate-500">{d.career_type || "nursing"}</td>
                            <td className="px-3 py-2 text-right font-mono">{d.card_count || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {breakdown.byExamType.length > 0 && (
              <Card data-testid="table-exam-type">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">{t("pages.adminContentAnalytics.questionsByExamTypeTier")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.exam")}</th>
                          <th className="text-left px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.tier3")}</th>
                          <th className="text-right px-3 py-2 font-medium text-slate-600">{t("pages.adminContentAnalytics.count3")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.byExamType.slice(0, 20).map((r, i) => (
                          <tr key={i} className="border-t border-slate-100" data-testid={`row-exam-${i}`}>
                            <td className="px-3 py-2">{r.exam || "—"}</td>
                            <td className="px-3 py-2">
                              <Badge variant="outline" className="text-xs">{r.tier}</Badge>
                            </td>
                            <td className="px-3 py-2 text-right font-mono">{r.count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === "tables" && !breakdown && (
          <div className="text-center py-12 text-slate-500">
            <BarChart3 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>{t("pages.adminContentAnalytics.breakdownDataNotAvailableTry")}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={fetchData} data-testid="button-retry-breakdown">{t("pages.adminContentAnalytics.retry")}</Button>
          </div>
        )}

        {activeSection === "report" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminContentAnalytics.plainTextReport")}</h2>
              <Button variant="outline" size="sm" onClick={handleCopy} data-testid="button-copy-report-inline">
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre
              className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-[60vh] overflow-y-auto"
              data-testid="text-report"
            >
              {generateTextReport()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, bg, testId }: { icon: React.ReactNode; label: string; value: string; bg: string; testId: string }) {
  return (
    <Card data-testid={testId} className="overflow-hidden">
      <CardContent className="pt-4">
        <div className={`flex items-center gap-2 mb-1`}>
          <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>{icon}</div>
          <span className="text-xs text-slate-500 uppercase tracking-wider leading-tight">{label}</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, testId, highlight, bold }: { label: string; value: string; testId: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm" data-testid={testId}>
      <span className={`text-slate-600 ${bold ? "font-semibold" : ""}`}>{label}</span>
      <span className={`font-mono ${highlight ? "text-amber-600 font-semibold" : "text-slate-800"} ${bold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function HealthCard({ label, value, icon, severity, description, testId }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  severity: "high" | "medium" | "low" | "info";
  description: string;
  testId: string;
}) {
  const borderColor = severity === "high" ? "border-red-200" : severity === "medium" ? "border-amber-200" : severity === "info" ? "border-blue-200" : "border-green-200";
  const bgColor = severity === "high" ? "bg-red-50/50" : severity === "medium" ? "bg-amber-50/50" : severity === "info" ? "bg-blue-50/50" : "bg-green-50/50";
  const badgeColor = severity === "high" ? "bg-red-100 text-red-700" : severity === "medium" ? "bg-amber-100 text-amber-700" : severity === "info" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700";

  return (
    <Card className={`${borderColor} ${bgColor}`} data-testid={testId}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>{severity}</span>
        </div>
        <div className="text-3xl font-bold text-slate-800 mt-2">{value.toLocaleString()}</div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
