import { useState, useEffect, useCallback, useRef } from "react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useTrialStatus } from "@/hooks/use-trial-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, Target,
  TrendingUp, TrendingDown, Brain, BookOpen, BarChart3, Users,
  Share2, Download, Copy, Lock, Eye, EyeOff, Plus, LogIn,
  Loader2, Shield, Award, Activity, ChevronRight, Star,
  UserPlus, Link2, Crown
} from "lucide-react";
import { useLocation } from "wouter";

import { useI18n } from "@/lib/i18n";
type Question = {
  id: string;
  number: number;
  stem: string;
  options: string[];
  correctAnswer: string;
  domain: string;
  topic: string;
  rationale: string;
};

type Assessment = {
  id: string;
  score: number;
  totalQuestions: number;
  domainScores: Record<string, { correct: number; total: number }>;
  topicScores: Record<string, { correct: number; total: number }>;
  weaknessSummary: string;
  strengthSummary: string;
  studyPlan: any;
  recommendedQbanks: any;
  completedAt: string;
  examTarget: string;
};

type UserStatsData = {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  domainBreakdown: Record<string, { correct: number; total: number }>;
  examScores: { type: string; score: number; date: string; examTarget?: string }[];
  studyStreak: number;
  publicProfile: boolean;
  leaderboardVisible: boolean;
  weeklyHistory: any[];
};

type StudyGroupData = {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  showRanking: boolean;
};

function DiagnosticExamView({ user, onComplete }: { user: any; onComplete: (a: Assessment) => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [examTarget, setExamTarget] = useState("rex-pn");
  const startTime = useRef(Date.now());

  useEffect(() => {
    fetch("/api/diagnostic-assessment/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, examTarget }),
    })
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(() => {
        toast({ title: "Failed to load questions", variant: "destructive" });
        setLoading(false);
      });
  }, []);

  const selectAnswer = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/diagnostic-assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, examTarget, answers, questions }),
      });
      const assessment = await res.json();
      onComplete(assessment);
    } catch {
      toast({ title: "Submission failed", variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-500">{t("pages.diagnosticAssessment.preparingYourDiagnosticAssessment")}</span>
      </div>
    );
  }

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / questions.length) * 100);
  const elapsed = Math.round((Date.now() - startTime.current) / 60000);

  return (
    <div className="max-w-3xl mx-auto" data-testid="diagnostic-exam">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {current + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {elapsed}m
            </span>
            <span className="text-xs font-medium text-primary">{answered}/{questions.length} answered</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {q && (
        <Card className="mb-4" data-testid={`question-card-${current}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{q.domain}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{q.topic}</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" data-testid="question-stem">{q.stem}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isSelected = answers[q.id] === letter;
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(q.id, letter)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    data-testid={`option-${letter}`}
                  >
                    <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs mr-2 ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                      {letter}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          data-testid="button-prev-question"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        <div className="flex gap-1 overflow-x-auto max-w-xs">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-6 h-6 rounded text-[9px] font-medium transition-all ${
                i === current ? "bg-primary text-white" : answers[questions[i]?.id] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent(current + 1)} data-testid="button-next-question">
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={submit}
            disabled={submitting || answered < questions.length}
            className="bg-green-600 hover:bg-green-700"
            data-testid="button-submit-diagnostic"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
            Submit ({answered}/{questions.length})
          </Button>
        )}
      </div>
    </div>
  );
}

function AssessmentResultView({ assessment, user, isPremium, isOnTrial }: { assessment: Assessment; user: any; isPremium: boolean; isOnTrial?: boolean }) {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const domainScores = assessment.domainScores || {};
  const topicScores = assessment.topicScores || {};
  const studyPlan = assessment.studyPlan as any;
  const recommendations = assessment.recommendedQbanks as any[];

  const weakTopics = Object.entries(topicScores)
    .map(([t, s]) => ({ topic: t, pct: Math.round((s.correct / s.total) * 100), ...s }))
    .sort((a, b) => a.pct - b.pct);
  const strongTopics = [...weakTopics].sort((a, b) => b.pct - a.pct);

  const generateShareCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 600;
    canvas.height = 400;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(0, 0, 600, 6);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.fillText("NurseNest Diagnostic Results", 30, 40);

    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillStyle = assessment.score >= 70 ? "#22c55e" : assessment.score >= 50 ? "#eab308" : "#ef4444";
    ctx.fillText(`${assessment.score}%`, 30, 100);

    ctx.font = "14px Inter, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${assessment.examTarget.toUpperCase()} Diagnostic`, 130, 90);

    ctx.fillStyle = "#334155";
    ctx.fillRect(30, 120, 540, 1);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("STRONGEST", 30, 150);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(strongTopics[0]?.topic || "N/A", 30, 170);

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("NEEDS WORK", 300, 150);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(weakTopics[0]?.topic || "N/A", 300, 170);

    let y = 210;
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText("DOMAIN BREAKDOWN", 30, y);
    y += 20;

    for (const [domain, scores] of Object.entries(domainScores)) {
      const pct = Math.round(((scores as any).correct / (scores as any).total) * 100);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, sans-serif";
      const shortDomain = domain.length > 35 ? domain.slice(0, 35) + "..." : domain;
      ctx.fillText(shortDomain, 30, y);
      ctx.fillStyle = "#334155";
      ctx.fillRect(30, y + 5, 400, 8);
      ctx.fillStyle = pct >= 70 ? "#22c55e" : pct >= 50 ? "#eab308" : "#ef4444";
      ctx.fillRect(30, y + 5, 400 * (pct / 100), 8);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText(`${pct}%`, 440, y);
      y += 28;
    }

    ctx.fillStyle = "#475569";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("nursenest.ca | " + new Date().toLocaleDateString(), 30, 380);

    const readiness = assessment.score >= 80 ? "Exam Ready" : assessment.score >= 60 ? "On Track" : "Needs Focus";
    ctx.fillStyle = assessment.score >= 80 ? "#22c55e" : assessment.score >= 60 ? "#eab308" : "#ef4444";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText(readiness, 450, 380);
  };

  useEffect(() => {
    generateShareCard();
  }, [assessment]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `nursenest-diagnostic-${assessment.score}pct.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyShareText = () => {
    const text = `I scored ${assessment.score}% on my ${assessment.examTarget.toUpperCase()} diagnostic! Strongest: ${strongTopics[0]?.topic}. Working on: ${weakTopics[0]?.topic}. #NurseNest #NursingExam`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="assessment-results">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6 text-center">
            <div className={`text-5xl font-bold mb-1 ${assessment.score >= 70 ? "text-green-600" : assessment.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
              {assessment.score}%
            </div>
            <p className="text-xs text-gray-500">{t("pages.diagnosticAssessment.overallScore")}</p>
            <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              assessment.score >= 80 ? "bg-green-100 text-green-700" : assessment.score >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
            }`} data-testid="readiness-indicator">
              {assessment.score >= 80 ? "Exam Ready" : assessment.score >= 60 ? "On Track" : "Needs Focus"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs font-semibold text-gray-600">{t("pages.diagnosticAssessment.strengths")}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{assessment.strengthSummary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-gray-600">{t("pages.diagnosticAssessment.areasToImprove")}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{assessment.weaknessSummary}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Domain Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(domainScores).map(([domain, scores]) => {
                const pct = Math.round(((scores as any).correct / (scores as any).total) * 100);
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 truncate max-w-[200px]">{domain}</span>
                      <span className={`font-semibold ${pct >= 70 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                        {pct}% ({(scores as any).correct}/{(scores as any).total})
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`rounded-full h-2 transition-all ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" /> Topic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weakTopics.map(t => (
                <div key={t.topic} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 ${t.pct >= 70 ? "bg-green-500" : t.pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{t.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {studyPlan?.weeks && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> 4-Week Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyPlan.weeks.map((w: any) => (
                <div key={w.week} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary">Week {w.week}</span>
                    {w.hours && <span className="text-[10px] text-gray-400">{w.hours}h</span>}
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-1">{w.focus}</p>
                  {w.activities && (
                    <ul className="space-y-0.5">
                      {w.activities.map((a: string, i: number) => (
                        <li key={i} className="text-[10px] text-gray-500 flex items-start gap-1">
                          <CheckCircle className="w-2.5 h-2.5 text-green-400 mt-0.5 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" /> Recommended Test Banks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-xs font-medium text-gray-700">{r.title}</p>
                    <p className="text-[10px] text-gray-500">{r.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-primary">{r.count}Q</span>
                    <p className="text-[10px] text-gray-400">{r.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share Your Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas ref={canvasRef} className="w-full max-w-[600px] rounded-lg border mb-3" style={{ height: "auto" }} data-testid="share-card-canvas" />
          <div className="flex gap-2">
            {!isOnTrial && (
              <Button size="sm" variant="outline" onClick={downloadCard} className="text-xs gap-1" data-testid="button-download-card">
                <Download className="w-3 h-3" /> Download Image
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={copyShareText} className="text-xs gap-1" data-testid="button-copy-share">
              <Copy className="w-3 h-3" /> Copy Share Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isPremium && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Crown className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-sm mb-1">{t("pages.diagnosticAssessment.unlockTargetedTestBanks")}</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Get targeted practice for your weakest areas. Premium members can take multiple diagnostics,
                  get updated study plans every 2 weeks, and access advanced analytics.
                </p>
                <Button size="sm" onClick={() => navigate("/upgrade")} className="text-xs gap-1" data-testid="button-upgrade-from-diagnostic">
                  <Lock className="w-3 h-3" /> Upgrade to Premium
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatsView({ user, isPremium }: { user: any; isPremium: boolean }) {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/user-stats/${user.id}`)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user.id]);

  const updatePrivacy = async (field: string, value: boolean) => {
    try {
      const res = await fetch(`/api/user-stats/${user.id}/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const updated = await res.json();
      setStats(updated);
      toast({ title: "Privacy settings updated" });
    } catch {}
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!stats) return <p className="text-center text-gray-400 py-8">{t("pages.diagnosticAssessment.noStatsYetTakeA")}</p>;

  const accuracy = stats.totalQuestionsAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100) : 0;
  const domainEntries = Object.entries(stats.domainBreakdown || {});

  return (
    <div className="space-y-4" data-testid="stats-view">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalQuestionsAnswered}</div>
            <p className="text-[10px] text-gray-500">{t("pages.diagnosticAssessment.questionsAnswered")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <p className="text-[10px] text-gray-500">{t("pages.diagnosticAssessment.accuracy")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.studyStreak}</div>
            <p className="text-[10px] text-gray-500">{t("pages.diagnosticAssessment.dayStreak")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.examScores?.length || 0}</div>
            <p className="text-[10px] text-gray-500">{t("pages.diagnosticAssessment.examsTaken")}</p>
          </CardContent>
        </Card>
      </div>

      {domainEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("pages.diagnosticAssessment.domainPerformance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {domainEntries.map(([domain, scores]: [string, any]) => {
                const pct = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 truncate max-w-[250px]">{domain}</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`rounded-full h-2 ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.examScores && stats.examScores.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t("pages.diagnosticAssessment.scoreHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {stats.examScores.slice(-10).reverse().map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{e.date}</span>
                    <span className="text-gray-600 capitalize">{e.type}</span>
                  </div>
                  <span className={`font-semibold ${e.score >= 70 ? "text-green-600" : "text-red-600"}`}>{e.score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isPremium && (
        <Card className="border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold">{t("pages.diagnosticAssessment.premiumAnalytics")}</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">
              Unlock percentile comparison, readiness prediction, trend graphs, and AI-powered suggestions for your weakest domains.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" /> Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium">{t("pages.diagnosticAssessment.publicProfile")}</span>
                <p className="text-[10px] text-gray-400">{t("pages.diagnosticAssessment.allowOthersToSeeYour")}</p>
              </div>
              <button
                onClick={() => updatePrivacy("publicProfile", !stats.publicProfile)}
                className={`w-10 h-5 rounded-full transition-colors ${stats.publicProfile ? "bg-primary" : "bg-gray-300"}`}
                data-testid="toggle-public-profile"
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${stats.publicProfile ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium">{t("pages.diagnosticAssessment.leaderboardVisibility")}</span>
                <p className="text-[10px] text-gray-400">{t("pages.diagnosticAssessment.appearOnGroupLeaderboards")}</p>
              </div>
              <button
                onClick={() => updatePrivacy("leaderboardVisible", !stats.leaderboardVisible)}
                className={`w-10 h-5 rounded-full transition-colors ${stats.leaderboardVisible ? "bg-primary" : "bg-gray-300"}`}
                data-testid="toggle-leaderboard"
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${stats.leaderboardVisible ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudyGroupsView({ user }: { user: any }) {
  const { toast } = useToast();
  const [groups, setGroups] = useState<StudyGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const fetchGroups = useCallback(() => {
    fetch(`/api/study-groups/user/${user.id}`)
      .then(r => r.json())
      .then(data => { setGroups(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user.id]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName, userId: user.id }),
      });
      const group = await res.json();
      setGroups(prev => [...prev, group]);
      setNewGroupName("");
      toast({ title: "Group created", description: `Invite code: ${group.inviteCode}` });
    } catch {
      toast({ title: "Failed to create group", variant: "destructive" });
    }
    setCreating(false);
  };

  const joinGroup = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      const res = await fetch("/api/study-groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: joinCode, userId: user.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: err.error || "Failed to join", variant: "destructive" });
      } else {
        const group = await res.json();
        setGroups(prev => [...prev, group]);
        setJoinCode("");
        toast({ title: `Joined ${group.name}` });
      }
    } catch {
      toast({ title: "Failed to join group", variant: "destructive" });
    }
    setJoining(false);
  };

  const viewMembers = async (groupId: string) => {
    setSelectedGroup(groupId);
    setLoadingMembers(true);
    try {
      const res = await fetch(`/api/study-groups/${groupId}/members`);
      const data = await res.json();
      setMembers(data);
    } catch {}
    setLoadingMembers(false);
  };

  const copyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Invite code copied" });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4" data-testid="study-groups-view">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Create Group
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder={t("pages.diagnosticAssessment.groupName")}
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                className="text-xs"
                data-testid="input-group-name"
              />
              <Button size="sm" onClick={createGroup} disabled={creating} className="text-xs shrink-0" data-testid="button-create-group">
                {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
              <LogIn className="w-3 h-3" /> Join Group
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder={t("pages.diagnosticAssessment.inviteCode")}
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="text-xs uppercase"
                data-testid="input-join-code"
              />
              <Button size="sm" onClick={joinGroup} disabled={joining} className="text-xs shrink-0" data-testid="button-join-group">
                {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : "Join"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">{t("pages.diagnosticAssessment.noStudyGroupsYetCreate")}</p>
      ) : (
        <div className="space-y-3">
          {groups.map(g => (
            <Card key={g.id} className={`cursor-pointer transition-all ${selectedGroup === g.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}>
              <CardContent className="pt-4" onClick={() => viewMembers(g.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">{g.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">{t("pages.diagnosticAssessment.code")}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyInvite(g.inviteCode); }}
                        className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded hover:bg-gray-200 flex items-center gap-1"
                        data-testid={`button-copy-invite-${g.id}`}
                      >
                        {g.inviteCode} <Copy className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                {selectedGroup === g.id && (
                  <div className="mt-3 pt-3 border-t" onClick={e => e.stopPropagation()}>
                    {loadingMembers ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-semibold text-gray-500">Members ({members.length})</h5>
                        {members.map((m, i) => (
                          <div key={m.id} className="flex items-center justify-between text-xs py-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {(m.username || "?")[0].toUpperCase()}
                              </div>
                              <span className="font-medium">{m.username}</span>
                              {m.userId === g.createdBy && <Crown className="w-3 h-3 text-yellow-500" />}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400">
                              {m.stats && (
                                <>
                                  <span>{m.stats.totalQuestionsAnswered || 0}Q</span>
                                  <span>{m.stats.totalQuestionsAnswered > 0 ? Math.round(((m.stats.totalCorrect || 0) / m.stats.totalQuestionsAnswered) * 100) : 0}%</span>
                                  <span>{m.stats.studyStreak || 0}d streak</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiagnosticAssessmentPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { isOnTrial } = useTrialStatus();
  const [activeTab, setActiveTab] = useState<"diagnostic" | "results" | "stats" | "groups" | "history">("diagnostic");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [examStarted, setExamStarted] = useState(false);

  const isPremium = user?.tier === "admin" || user?.tier === "rn" || user?.tier === "np";

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/diagnostic-assessment/history/${user.id}`)
        .then(r => r.json())
        .then(data => setHistory(data))
        .catch(() => {});
    }
  }, [user?.id, assessment]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center">
        <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">{t("pages.diagnosticAssessment.diagnosticAssessment")}</h2>
        <p className="text-sm text-gray-500 mb-4">{t("pages.diagnosticAssessment.logInToTakeYour")}</p>
        <Button onClick={() => navigate("/login")} data-testid="button-login-diagnostic">{t("pages.diagnosticAssessment.logInToStart")}</Button>
      </div>
    );
  }

  const tabs = [
    { id: "diagnostic" as const, label: "Take Diagnostic", icon: Brain },
    { id: "history" as const, label: "History", icon: Clock },
    { id: "stats" as const, label: "My Stats", icon: BarChart3 },
    { id: "groups" as const, label: "Study Groups", icon: Users },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <BreadcrumbNav />
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{t("pages.diagnosticAssessment.diagnosticAssessment2")}</h1>
          <p className="text-xs text-gray-500">{t("pages.diagnosticAssessment.identifyYourStrengthsAndWeaknesses")}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExamStarted(false); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
            }`}
            data-testid={`tab-${tab.id}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "diagnostic" && !examStarted && !assessment && (
        <div className="max-w-lg mx-auto text-center py-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-2">{t("pages.diagnosticAssessment.readyForYourDiagnostic")}</h2>
          <p className="text-sm text-gray-500 mb-2">{t("pages.diagnosticAssessment.30MixedBlueprintQuestionsCovering")}</p>
          <p className="text-xs text-gray-400 mb-6">{t("pages.diagnosticAssessment.afterCompletionAiWillAnalyze")}</p>

          {!isPremium && history.length >= 1 && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-xs text-yellow-700">
                Free users get 1 diagnostic. Upgrade to Premium for unlimited diagnostics with updated plans every 2 weeks.
              </p>
            </div>
          )}

          <Button
            size="lg"
            onClick={() => setExamStarted(true)}
            disabled={!isPremium && history.length >= 1}
            className="gap-2"
            data-testid="button-start-diagnostic"
          >
            <Target className="w-5 h-5" />
            {!isPremium && history.length >= 1 ? "Upgrade for More Diagnostics" : "Start Diagnostic"}
          </Button>
        </div>
      )}

      {activeTab === "diagnostic" && examStarted && !assessment && (
        <DiagnosticExamView user={user} onComplete={(a) => { setAssessment(a); setExamStarted(false); setActiveTab("results"); }} />
      )}

      {(activeTab === "results" || (activeTab === "diagnostic" && assessment)) && assessment && (
        <AssessmentResultView assessment={assessment} user={user} isPremium={isPremium} isOnTrial={isOnTrial} />
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">{t("pages.diagnosticAssessment.noDiagnosticsTakenYet")}</p>
          ) : (
            history.map(h => (
              <Card
                key={h.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => { setAssessment(h); setActiveTab("results"); }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${h.score >= 70 ? "text-green-600" : h.score >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                          {h.score}%
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {h.examTarget?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(h.completedAt).toLocaleDateString()} - {h.totalQuestions} questions
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "stats" && <StatsView user={user} isPremium={isPremium} />}
      {activeTab === "groups" && <StudyGroupsView user={user} />}
    </div>
  );
}