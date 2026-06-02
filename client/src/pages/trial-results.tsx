import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, Trophy, Target, AlertTriangle, BarChart3, Clock,
  CheckCircle2, XCircle, BookOpen, TrendingUp, Zap, ShieldCheck
} from "lucide-react";

interface DomainScore {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}

interface TrialReport {
  score: number;
  percentage: number;
  domainScores: DomainScore[];
  readinessLevel: string;
  difficultyEstimate: number;
  totalCorrect: number;
  totalIncorrect: number;
  avgTimePerQuestion: number;
  fastestQuestion: number;
  slowestQuestion: number;
  weakDomains: string[];
  strongDomains: string[];
  completionTimeSeconds?: number;
}

interface TrialSession {
  id: string;
  examKey: string;
  tier: string;
  status: string;
  totalQuestions: number;
  questionsAnswered: number;
  report: TrialReport | null;
  completedAt: string | null;
}

function formatTime(seconds: number): string {

  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h}h ${rm}m`;
  }
  return `${m}m ${s}s`;
}

function getReadinessBandColor(level: string): { bg: string; text: string; border: string; icon: string } {
  switch (level) {
    case "Exam Ready":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-500" };
    case "Moderate":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-500" };
    case "Borderline":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "text-orange-500" };
    case "Very Low":
    default:
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500" };
  }
}

function getDomainBarColor(percentage: number): string {
  if (percentage >= 70) return "bg-emerald-500";
  if (percentage >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function getDomainTextColor(percentage: number): string {
  if (percentage >= 70) return "text-emerald-600";
  if (percentage >= 50) return "text-amber-600";
  return "text-red-600";
}

function ScoreRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? "#10b981" : percentage >= 55 ? "#f59e0b" : percentage >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{percentage}%</span>
        <span className="text-xs text-gray-500">{t("pages.trialResults.score")}</span>
      </div>
    </div>
  );
}

export default function TrialResults() {
  const { id: sessionId } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [session, setSession] = useState<TrialSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/trial/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load results");
        return res.json();
      })
      .then((data: TrialSession) => {
        if (data.status !== "completed") {
          navigate(`/trial/session/${sessionId}`);
          return;
        }
        setSession(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warmwhite flex items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !session || !session.report) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-500" data-testid="text-error">{error || "Results not found."}</p>
            <LocaleLink href="/trial">
              <Button variant="outline" data-testid="button-back-trial">{t("pages.trialResults.backToTrial")}</Button>
            </LocaleLink>
          </div>
        </main>
      </div>
    );
  }

  const report = session.report;
  const bandColors = getReadinessBandColor(report.readinessLevel);
  const examLabel = session.examKey?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || session.tier?.toUpperCase();

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO title={t("pages.trialResults.trialResultsNursenest")} description={t("pages.trialResults.yourFreeTrialReadinessAssessment")} />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <LocaleLink href="/trial">
          <Button variant="ghost" className="mb-6 group" data-testid="button-back-trial">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Trial
          </Button>
        </LocaleLink>

        <div className={`rounded-xl p-6 mb-8 text-center border ${bandColors.bg} ${bandColors.border}`} data-testid="banner-readiness">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className={`w-12 h-12 ${bandColors.icon}`} />
            <h2 className={`text-2xl font-bold ${bandColors.text}`} data-testid="text-readiness-level">
              {report.readinessLevel}
            </h2>
            <p className={`text-sm ${bandColors.text} opacity-80`}>
              {examLabel} Readiness Assessment
            </p>
          </div>
        </div>

        <div className="text-center mb-10 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Trophy className={`w-10 h-10 ${bandColors.icon}`} />
            <h1 className="text-4xl font-bold" data-testid="text-results-title">{t("pages.trialResults.trialResults")}</h1>
          </div>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            <ScoreRing percentage={report.percentage} />
            <div className="space-y-2 text-left">
              <p className="text-gray-500 text-sm uppercase font-bold tracking-wider">
                Free Trial Assessment
              </p>
              <p className="text-2xl font-bold" data-testid="text-score-summary">
                {report.totalCorrect} / {session.totalQuestions} Correct ({report.percentage}%)
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1" data-testid="text-total-time">
                  <Clock className="w-4 h-4" /> {report.completionTimeSeconds ? formatTime(report.completionTimeSeconds) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-none shadow-sm" data-testid="card-difficulty">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900">{t("pages.trialResults.difficultyEstimate")}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary" data-testid="text-difficulty-level">
                  {report.difficultyEstimate}
                </span>
                <span className="text-gray-500 text-sm">/ 5</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Based on your performance, estimated difficulty level
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm" data-testid="card-time-management">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900">{t("pages.trialResults.timeManagement")}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("pages.trialResults.avgPerQuestion")}</span>
                  <span className="font-medium" data-testid="text-avg-time">{formatTime(report.avgTimePerQuestion)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("pages.trialResults.fastest")}</span>
                  <span className="font-medium" data-testid="text-fastest-time">{formatTime(report.fastestQuestion)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("pages.trialResults.slowest")}</span>
                  <span className="font-medium" data-testid="text-slowest-time">{formatTime(report.slowestQuestion)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm" data-testid="card-accuracy">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900">{t("pages.trialResults.accuracy")}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Correct
                  </span>
                  <span className="font-medium text-emerald-600" data-testid="text-total-correct">{report.totalCorrect}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" /> Incorrect
                  </span>
                  <span className="font-medium text-red-600" data-testid="text-total-incorrect">{report.totalIncorrect}</span>
                </div>
                <Progress
                  value={report.percentage}
                  className="h-2 mt-2"
                  data-testid="progress-accuracy"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm mb-8" data-testid="card-domain-breakdown">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-primary" /> Domain Breakdown
            </h3>
            <div className="space-y-4">
              {report.domainScores.map((domain, i) => (
                <div key={i} className="space-y-1" data-testid={`domain-row-${i}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{domain.domain}</span>
                    <span className={`font-bold ${getDomainTextColor(domain.percentage)}`}>
                      {domain.correct}/{domain.total} ({domain.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getDomainBarColor(domain.percentage)}`}
                      style={{ width: `${domain.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {report.weakDomains.length > 0 && (
          <Card className="border-none shadow-sm mb-8 border-l-4 border-l-red-400" data-testid="card-weak-areas">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Weak Areas
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                These areas need more focused study. Scoring below 60% indicates gaps in knowledge.
              </p>
              <div className="flex flex-wrap gap-2">
                {report.weakDomains.map((domain, i) => (
                  <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200" data-testid={`badge-weak-${i}`}>
                    {domain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {report.strongDomains.length > 0 && (
          <Card className="border-none shadow-sm mb-8 border-l-4 border-l-emerald-400" data-testid="card-strong-areas">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Strong Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.strongDomains.map((domain, i) => (
                  <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200" data-testid={`badge-strong-${i}`}>
                    {domain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-none shadow-sm mb-8" data-testid="card-study-plan">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" /> Recommended Study Plan
            </h3>
            {report.readinessLevel === "Very Low" || report.readinessLevel === "Borderline" ? (
              <div className="space-y-3">
                <p className="text-gray-700">
                  We recommend starting with a comprehensive study plan. Focus on building a strong foundation
                  in your weak areas before attempting practice exams.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    Review core concepts in your weak domains
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    Complete targeted practice questions by body system
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    Use flashcards for key terms and clinical concepts
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-700">
                  You are on track. Take a full mock exam to confirm your readiness and identify any remaining
                  gaps in your knowledge.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    Take a full-length mock exam under timed conditions
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    Review rationales for any missed questions
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    Strengthen your weak areas with targeted study
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-8 text-center space-y-6" data-testid="section-cta">
          <h2 className="text-2xl font-bold text-gray-900">{t("pages.trialResults.readyToLevelUpYour")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock the full question bank with detailed rationales, adaptive testing,
            and comprehensive study resources to maximize your exam readiness.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LocaleLink href="/pricing">
              <Button size="lg" className="min-w-[200px]" data-testid="button-unlock-qbank">
                Unlock Full Test Bank
              </Button>
            </LocaleLink>
            <LocaleLink href="/pricing">
              <Button size="lg" variant="outline" className="min-w-[200px]" data-testid="button-start-subscription">
                Start Subscription
              </Button>
            </LocaleLink>
            <LocaleLink href="/study-plan">
              <Button size="lg" variant="ghost" className="min-w-[200px]" data-testid="button-view-study-plan">
                View Study Plan
              </Button>
            </LocaleLink>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
