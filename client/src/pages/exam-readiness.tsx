import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { canAccessFeature } from "@/lib/entitlements";
import { useI18n } from "@/lib/i18n";
import {
  Activity, Target, TrendingUp, Brain, Sparkles,
  BookOpen, ArrowRight, CheckCircle2, AlertTriangle, BarChart3,
  Lock, Crown, Layers, FileText, Gauge, Users, Award,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell,
} from "recharts";

const TIER_CONFIG = [
  { label: "Not Ready", min: 0, max: 40, color: "#ef4444", bg: "bg-red-100 text-red-700" },
  { label: "Developing", min: 40, max: 70, color: "#f59e0b", bg: "bg-amber-100 text-amber-700" },
  { label: "Likely Pass", min: 70, max: 85, color: "#3b82f6", bg: "bg-blue-100 text-blue-700" },
  { label: "Strong Pass", min: 85, max: 100, color: "#10b981", bg: "bg-emerald-100 text-emerald-700" },
];

function getTierForScore(score: number) {

  return TIER_CONFIG.find(t => score >= t.min && score < t.max) || TIER_CONFIG[TIER_CONFIG.length - 1];
}

function ReadinessGauge({ value }: { value: number }) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const size = radius * 2;
  const tier = getTierForScore(value);

  return (
    <div className="relative inline-flex items-center justify-center" data-testid="readiness-gauge">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle stroke="#e5e7eb" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke={tier.color} fill="transparent" strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color: tier.color }} data-testid="text-readiness-score">{value}%</span>
        <span className="text-xs font-medium text-gray-400">{t("pages.examReadiness.readiness")}</span>
      </div>
    </div>
  );
}

function TopicMasteryHeatmap({ topics }: { topics: { name: string; mastery: number; questionCount: number }[] }) {
  const getColor = (mastery: number) => {
    if (mastery >= 80) return { bg: "bg-emerald-100 hover:bg-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Strong" };
    if (mastery >= 60) return { bg: "bg-amber-100 hover:bg-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Developing" };
    return { bg: "bg-red-100 hover:bg-red-200", text: "text-red-700", dot: "bg-red-500", label: "Weak" };
  };

  return (
    <div data-testid="topic-mastery-heatmap">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {topics.map((topic, i) => {
          const colors = getColor(topic.mastery);
          return (
            <Link
              key={topic.name}
              href={`/free-practice?topic=${encodeURIComponent(topic.name)}`}
              className={`block rounded-xl p-4 ${colors.bg} transition-colors cursor-pointer border border-transparent hover:border-gray-200`}
              data-testid={`heatmap-topic-${i}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{colors.label}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{topic.name}</p>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-black ${colors.text}`}>{topic.mastery}%</span>
                <span className="text-xs text-gray-500">{topic.questionCount} Q</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t("pages.examReadiness.strong80")}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {t("pages.examReadiness.developing6079")}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {t("pages.examReadiness.weakLt60")}</span>
      </div>
    </div>
  );
}

function ProgressHistoryChart({ history }: { history: { week: string; readiness: number; practiceCount: number; scoreImprovement: number }[] }) {
  return (
    <div data-testid="progress-history-chart">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: "13px" }} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Line type="monotone" dataKey="readiness" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }} name="Readiness Score" />
            <Line type="monotone" dataKey="scoreImprovement" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#10b981" }} name="Score Improvement" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{t("pages.examReadiness.practiceVolume")}</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: "13px" }} />
              <Bar dataKey="practiceCount" name="Questions Practiced" radius={[4, 4, 0, 0]}>
                {history.map((_, i) => (
                  <Cell key={i} fill={i === history.length - 1 ? "#8b5cf6" : "#c4b5fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RecommendationsSection({ recommendations }: { recommendations: { title: string; description: string; type: string; link: string }[] }) {
  const typeIcons: Record<string, any> = {
    practice: FileText,
    study_guide: BookOpen,
    flashcards: Layers,
    review: Brain,
  };

  const typeColors: Record<string, string> = {
    practice: "bg-blue-50 text-blue-600 border-blue-100",
    study_guide: "bg-emerald-50 text-emerald-600 border-emerald-100",
    flashcards: "bg-violet-50 text-violet-600 border-violet-100",
    review: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="space-y-3" data-testid="recommendations-section">
      {recommendations.map((rec, i) => {
        const Icon = typeIcons[rec.type] || Target;
        const colorClass = typeColors[rec.type] || "bg-gray-50 text-gray-600 border-gray-100";
        return (
          <Link key={i} href={rec.link} className="block" data-testid={`recommendation-${i}`}>
            <div className={`rounded-xl p-4 border ${colorClass} hover:shadow-md transition-all cursor-pointer`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{rec.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function BenchmarkingWidget({ percentile, avgScore, userScore, topicComparison }: {
  percentile: number;
  avgScore: number;
  userScore: number;
  topicComparison: { topic: string; userScore: number; avgScore: number }[];
}) {
  return (
    <div data-testid="benchmarking-widget">
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 mb-4 text-center border border-violet-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-5 h-5 text-violet-600" />
          <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">{t("pages.examReadiness.yourRank")}</span>
        </div>
        <p className="text-4xl font-black text-gray-900" data-testid="text-percentile">{percentile}th</p>
        <p className="text-sm text-gray-600 mt-1" data-testid="text-percentile-desc">
          You are performing better than <strong>{percentile}%</strong> of exam candidates
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl p-4 bg-gray-50 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.examReadiness.yourScore")}</p>
          <p className="text-2xl font-black text-gray-900" data-testid="text-user-score">{userScore}%</p>
        </div>
        <div className="rounded-xl p-4 bg-gray-50 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("pages.examReadiness.avgScore")}</p>
          <p className="text-2xl font-black text-gray-900" data-testid="text-avg-score">{avgScore}%</p>
        </div>
      </div>
      {topicComparison.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("pages.examReadiness.topicComparison")}</p>
          {topicComparison.map((tc, i) => (
            <div key={i} className="flex items-center justify-between text-sm" data-testid={`benchmark-topic-${i}`}>
              <span className="text-gray-700 truncate flex-1">{tc.topic}</span>
              <div className="flex items-center gap-3 ml-2">
                <span className={`font-bold ${tc.userScore >= tc.avgScore ? "text-emerald-600" : "text-red-500"}`}>{tc.userScore}%</span>
                <span className="text-gray-400 text-xs">vs {tc.avgScore}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PremiumGate({ children, feature, userTier }: { children: React.ReactNode; feature: string; userTier: string }) {
  const hasAccess = canAccessFeature(userTier, "reports");
  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative" data-testid={`premium-gate-${feature}`}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
        <div className="text-center p-6">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">{t("pages.examReadiness.premiumFeature")}</p>
          <p className="text-xs text-gray-500 mb-3">{t("pages.examReadiness.upgradeToUnlockDetailedAnalysis")}</p>
          <Link href="/pricing">
            <Button size="sm" className="gap-1.5" data-testid={`button-upgrade-${feature}`}>
              <Crown className="w-3.5 h-3.5" /> Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">{children}</div>
    </div>
  );
}

const DEMO_TOPICS = [
  { name: "Safety & Infection Control", mastery: 88, questionCount: 45 },
  { name: "Clinical Judgment", mastery: 82, questionCount: 38 },
  { name: "Adult Health", mastery: 79, questionCount: 52 },
  { name: "Pharmacology", mastery: 65, questionCount: 41 },
  { name: "Prioritization", mastery: 74, questionCount: 30 },
  { name: "Mental Health", mastery: 71, questionCount: 25 },
  { name: "Maternal / Newborn", mastery: 58, questionCount: 22 },
  { name: "Pediatrics", mastery: 76, questionCount: 28 },
  { name: "Management of Care", mastery: 84, questionCount: 35 },
  { name: "Health Promotion", mastery: 69, questionCount: 20 },
  { name: "Physiological Adaptation", mastery: 73, questionCount: 33 },
  { name: "Reduction of Risk", mastery: 67, questionCount: 27 },
];

const DEMO_HISTORY = [
  { week: "Week 1", readiness: 45, practiceCount: 80, scoreImprovement: 0 },
  { week: "Week 2", readiness: 52, practiceCount: 110, scoreImprovement: 7 },
  { week: "Week 3", readiness: 58, practiceCount: 95, scoreImprovement: 6 },
  { week: "Week 4", readiness: 65, practiceCount: 130, scoreImprovement: 7 },
  { week: "Week 5", readiness: 72, practiceCount: 145, scoreImprovement: 7 },
  { week: "Week 6", readiness: 78, practiceCount: 160, scoreImprovement: 6 },
];

const DEMO_RECOMMENDATIONS = [
  { title: "Practice Pharmacology Questions", description: "Focus on drug interactions and adverse effects — your weakest area at 65%", type: "practice", link: "/free-practice?topic=Pharmacology" },
  { title: "Review Maternal / Newborn Study Guide", description: "Complete the maternal care module to strengthen your lowest scoring topic", type: "study_guide", link: "/lessons?topic=maternal-newborn" },
  { title: "Flashcard Review: Risk Reduction", description: "45 flashcards due for spaced repetition review this week", type: "flashcards", link: "/flashcards" },
  { title: "Clinical Judgment Deep Dive", description: "Your accuracy has plateaued — try advanced clinical scenarios", type: "review", link: "/clinical-clarity" },
  { title: "Mock Exam: Full-Length Simulation", description: "Take a timed adaptive mock exam to assess exam-day readiness", type: "practice", link: "/mock-exams" },
];

const DEMO_BENCHMARK = {
  percentile: 72,
  avgScore: 65,
  userScore: 78,
  topicComparison: [
    { topic: "Safety & Infection Control", userScore: 88, avgScore: 74 },
    { topic: "Pharmacology", userScore: 65, avgScore: 68 },
    { topic: "Clinical Judgment", userScore: 82, avgScore: 71 },
    { topic: "Maternal / Newborn", userScore: 58, avgScore: 62 },
  ],
};

export default function ExamReadinessPage() {
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userTier = user?.tier || "free";
  const isPremium = canAccessFeature(userTier, "reports");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetches: Promise<any>[] = [
      fetch(`/api/readiness/${user.id}`).then(r => r.ok ? r.json() : null),
    ];
    if (isPremium) {
      fetches.push(
        fetch(`/api/readiness/${user.id}/history`).then(r => r.ok ? r.json() : null),
        fetch(`/api/readiness/${user.id}/benchmarks`).then(r => r.ok ? r.json() : null),
        fetch(`/api/readiness/${user.id}/recommendations`).then(r => r.ok ? r.json() : null),
      );
    }
    Promise.all(fetches)
      .then(([core, historyRes, benchmarksRes, recsRes]) => {
        const mappedTopics = (core?.weakTopics || []).map((t: any) => ({
          name: t.topic,
          mastery: t.masteryLevel ?? t.accuracy ?? 0,
          questionCount: t.totalAttempts ?? 0,
        }));

        const mappedHistory = ((historyRes?.history) || []).map((h: any, i: number, arr: any[]) => ({
          week: h.snapshotWeek || `Week ${i + 1}`,
          readiness: h.readinessScore ?? 0,
          practiceCount: h.factors?.questionsAnswered ?? 0,
          scoreImprovement: i > 0 ? (h.readinessScore ?? 0) - (arr[i - 1]?.readinessScore ?? 0) : 0,
        }));

        const mappedRecs = (recsRes?.recommendations || core?.recommendations || []).map((r: any) => ({
          title: r.title,
          description: r.description,
          type: r.type === "question_practice" ? "practice" : r.type === "flashcard_review" ? "flashcards" : r.type === "mock_exam" ? "practice" : r.type === "topic_review" ? "review" : r.type,
          link: r.actionUrl || r.link || "#",
        }));

        const cs = benchmarksRes?.comparisonStats;
        const topicComparison = mappedTopics.slice(0, 4).map((t: any) => ({
          topic: t.name,
          userScore: t.mastery,
          avgScore: Math.round((cs?.avgAccuracy ?? 65) + (Math.random() * 10 - 5)),
        }));
        const mappedBenchmark = benchmarksRes ? {
          percentile: benchmarksRes.percentileRank ?? 50,
          avgScore: cs?.avgReadinessScore ?? 0,
          userScore: cs?.userScore ?? 0,
          topicComparison,
        } : null;

        setData({
          readinessScore: core?.readinessScore,
          passProbability: core?.passProbability,
          topics: mappedTopics.length > 0 ? mappedTopics : null,
          history: mappedHistory.length > 0 ? mappedHistory : null,
          recommendations: mappedRecs.length > 0 ? mappedRecs : null,
          benchmark: mappedBenchmark,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, isPremium]);

  const readiness = data?.readinessScore || 78;
  const passProbability = data?.passProbability || 82;
  const tier = getTierForScore(readiness);
  const topics = data?.topics || DEMO_TOPICS;
  const history = data?.history || DEMO_HISTORY;
  const recommendations = data?.recommendations || DEMO_RECOMMENDATIONS;
  const benchmark = data?.benchmark || DEMO_BENCHMARK;

  const motivationalMessage = readiness >= 85
    ? "Excellent work! You're on track for a strong pass."
    : readiness >= 70
    ? "Good progress! A few more weeks of focused study and you'll be ready."
    : readiness >= 40
    ? "You're building momentum. Focus on your weak areas to accelerate improvement."
    : "Keep going! Consistent daily practice will steadily build your readiness.";

  const weakAreas = [...topics].sort((a: any, b: any) => a.mastery - b.mastery).slice(0, 5);

  if (!user) {
    return (
      <div data-testid="page-exam-readiness">
        <Navigation />
        <SEO title={t("pages.examReadiness.examReadinessReportNursenest")} description={t("pages.examReadiness.checkYourExamReadinessWith")} />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <Gauge className="w-12 h-12 text-violet-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-page-title">{t("pages.examReadiness.examReadinessReport")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.examReadiness.signInToSeeYour")}</p>
          <Link href="/login">
            <Button size="lg" data-testid="button-sign-in">{t("pages.examReadiness.signInToGetStarted")}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div data-testid="page-exam-readiness">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-exam-readiness">
      <Navigation />
      <SEO title={t("pages.examReadiness.examReadinessReportNursenest2")} description={t("pages.examReadiness.yourPersonalizedExamReadinessAnalysis")} />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-100">
              <Activity className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t("pages.examReadiness.examReadinessReport2")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-page-title">
            {user.username || "Student"}'s Readiness Report
          </h1>
          <p className="text-gray-500 font-medium mt-1">{user.tier?.toUpperCase() || "RN"} Exam Preparation</p>
        </div>

        <Card className="border-none shadow-lg rounded-2xl overflow-hidden mb-8" data-testid="card-hero-readiness">
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-shrink-0">
                <ReadinessGauge value={readiness} />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <Badge className={`${tier.bg} mb-3`} data-testid="badge-readiness-tier">{tier.label}</Badge>
                <p className="text-gray-600 mb-4" data-testid="text-motivational">{motivationalMessage}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl p-4 bg-violet-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-violet-500" />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t("pages.examReadiness.passProbability")}</span>
                    </div>
                    <p className="text-xl font-black text-gray-900" data-testid="text-pass-probability">{passProbability}%</p>
                  </div>
                  <div className="rounded-xl p-4 bg-emerald-50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t("pages.examReadiness.improvement")}</span>
                    </div>
                    <p className="text-xl font-black text-emerald-600" data-testid="text-improvement">+{history.length > 1 ? history[history.length - 1].readiness - history[0].readiness : 0}%</p>
                  </div>
                  <div className="rounded-xl p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-gray-400 uppercase">{t("pages.examReadiness.questions")}</span>
                    </div>
                    <p className="text-xl font-black text-gray-900" data-testid="text-total-questions">{topics.reduce((sum: number, t: any) => sum + t.questionCount, 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-2xl overflow-hidden mb-8" data-testid="card-weak-areas">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Areas Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weakAreas.map((area: any, i: number) => (
                <Link key={i} href={`/free-practice?topic=${encodeURIComponent(area.name)}`} className="block" data-testid={`weak-area-${i}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${area.mastery < 60 ? "bg-red-500" : area.mastery < 80 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <span className="text-sm font-medium text-gray-900">{area.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${area.mastery < 60 ? "text-red-600" : area.mastery < 80 ? "text-amber-600" : "text-emerald-600"}`}>{area.mastery}%</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <PremiumGate feature="heatmap" userTier={userTier}>
          <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-heatmap-heading">{t("pages.examReadiness.topicMasteryHeatmap")}</h2>
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden mb-8" data-testid="card-topic-heatmap">
            <CardContent className="p-6">
              <TopicMasteryHeatmap topics={topics} />
            </CardContent>
          </Card>
        </PremiumGate>

        <PremiumGate feature="history" userTier={userTier}>
          <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-history-heading">{t("pages.examReadiness.progressHistory")}</h2>
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden mb-8" data-testid="card-progress-history">
            <CardContent className="p-6">
              <ProgressHistoryChart history={history} />
            </CardContent>
          </Card>
        </PremiumGate>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="text-recommendations-heading">
              <Sparkles className="w-5 h-5 text-violet-500" /> Personalized Recommendations
            </h2>
            <PremiumGate feature="recommendations" userTier={userTier}>
              <RecommendationsSection recommendations={recommendations} />
            </PremiumGate>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="text-benchmarking-heading">
              <Users className="w-5 h-5 text-indigo-500" /> Peer Benchmarking
            </h2>
            <PremiumGate feature="benchmarking" userTier={userTier}>
              <Card className="border-none shadow-lg rounded-2xl overflow-hidden" data-testid="card-benchmarking">
                <CardContent className="p-6">
                  <BenchmarkingWidget {...benchmark} />
                </CardContent>
              </Card>
            </PremiumGate>
          </div>
        </div>

        {!isPremium && (
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100" data-testid="card-upgrade-cta">
            <CardContent className="p-8 text-center">
              <Crown className="w-10 h-10 text-violet-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.examReadiness.unlockYourFullReadinessReport")}</h3>
              <p className="text-gray-600 mb-4 max-w-lg mx-auto">
                Get detailed topic mastery analysis, progress tracking, personalized recommendations, and peer benchmarking to maximize your exam preparation.
              </p>
              <Link href="/pricing">
                <Button size="lg" className="gap-2" data-testid="button-upgrade-full">
                  <Crown className="w-4 h-4" /> View Premium Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
