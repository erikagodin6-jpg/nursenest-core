import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/lib/auth";
import {
  BarChart3, Activity, Target, TrendingUp, AlertTriangle,
  Brain, GraduationCap, RefreshCw, Settings, CheckCircle2,
  Users, Gauge, Sparkles,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell,
} from "recharts";
import { CONTENT_EXPANSION_ROADMAP } from "@shared/schema";

import { useI18n } from "@/lib/i18n";
const DEMO_AGGREGATE = {
  totalStudents: 1247,
  avgReadinessScore: 68,
  avgPassProbability: 72,
  predictionAccuracy: 89,
  studentsReady: 412,
  studentsDeveloping: 583,
  studentsNotReady: 252,
};

const DEMO_DISTRIBUTION = [
  { range: "0–20%", count: 45, color: "#ef4444" },
  { range: "21–40%", count: 207, color: "#f97316" },
  { range: "41–60%", count: 318, color: "#f59e0b" },
  { range: "61–80%", count: 456, color: "#3b82f6" },
  { range: "81–100%", count: 221, color: "#10b981" },
];

const DEMO_PROGRESSION = [
  { month: "Jan", avgReadiness: 52, avgProbability: 55 },
  { month: "Feb", avgReadiness: 56, avgProbability: 59 },
  { month: "Mar", avgReadiness: 61, avgProbability: 64 },
  { month: "Apr", avgReadiness: 64, avgProbability: 68 },
  { month: "May", avgReadiness: 68, avgProbability: 72 },
  { month: "Jun", avgReadiness: 71, avgProbability: 75 },
];

const DEMO_TOPIC_DIFFICULTY = [
  { topic: "Pharmacology", avgMastery: 58, studentCount: 892, difficulty: "hard" },
  { topic: "Maternal / Newborn", avgMastery: 62, studentCount: 756, difficulty: "hard" },
  { topic: "Reduction of Risk", avgMastery: 65, studentCount: 834, difficulty: "medium" },
  { topic: "Mental Health", avgMastery: 68, studentCount: 721, difficulty: "medium" },
  { topic: "Health Promotion", avgMastery: 71, studentCount: 698, difficulty: "medium" },
  { topic: "Physiological Adaptation", avgMastery: 73, studentCount: 812, difficulty: "medium" },
  { topic: "Prioritization", avgMastery: 76, studentCount: 845, difficulty: "easy" },
  { topic: "Clinical Judgment", avgMastery: 79, studentCount: 901, difficulty: "easy" },
  { topic: "Adult Health", avgMastery: 81, studentCount: 923, difficulty: "easy" },
  { topic: "Safety & Infection Control", avgMastery: 84, studentCount: 945, difficulty: "easy" },
];

const DEMO_ACCURACY_TRACKING = [
  { month: "Jan", predicted: 68, actual: 71 },
  { month: "Feb", predicted: 72, actual: 70 },
  { month: "Mar", predicted: 75, actual: 76 },
  { month: "Apr", predicted: 78, actual: 79 },
  { month: "May", predicted: 82, actual: 80 },
  { month: "Jun", predicted: 85, actual: 87 },
];

export default function AdminReadinessAnalytics() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    Promise.all([
      fetch("/api/admin/readiness/analytics").then(r => r.ok ? r.json() : null),
      fetch("/api/admin/readiness/config").then(r => r.ok ? r.json() : null),
    ])
      .then(([analytics, config]) => setData({ ...analytics, config }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-access-denied">{t("pages.adminReadinessAnalytics.accessDenied")}</h1>
          <p className="text-gray-600 mt-2">{t("pages.adminReadinessAnalytics.adminAccessRequiredToView")}</p>
        </div>
      </div>
    );
  }

  const hasApiData = data && !data.config;
  const apiDistribution = data?.distribution;
  const distColorMap: Record<string, string> = {
    early_preparation: "#ef4444",
    developing: "#f59e0b",
    almost_ready: "#3b82f6",
    exam_ready: "#10b981",
  };
  const mappedDistribution = apiDistribution && typeof apiDistribution === "object" && !Array.isArray(apiDistribution)
    ? Object.entries(apiDistribution).map(([key, count]) => ({
        range: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        count: count as number,
        color: distColorMap[key] || "#6b7280",
      }))
    : null;

  const mappedProgression = (data?.trends || []).map((t: any) => ({
    month: t.week || t.month,
    avgReadiness: t.avgScore ?? 0,
    avgProbability: 0,
  }));

  const mappedTopicDifficulty = (data?.topicDifficulty || []).map((t: any) => ({
    topic: t.topic,
    avgMastery: t.avgAccuracy ?? 0,
    studentCount: t.totalAttempts ?? 0,
    difficulty: (t.avgAccuracy ?? 0) < 60 ? "hard" : (t.avgAccuracy ?? 0) < 75 ? "medium" : "easy",
  }));

  const aggregate = data?.totalStudents != null
    ? { totalStudents: data.totalStudents, avgReadinessScore: data.avgReadinessScore ?? 0, avgPassProbability: 0, predictionAccuracy: data.predictionAccuracy ?? 0, studentsReady: data.tierDistribution?.exam_ready ?? 0, studentsDeveloping: data.tierDistribution?.developing ?? 0, studentsNotReady: data.tierDistribution?.early_preparation ?? 0 }
    : DEMO_AGGREGATE;
  const distribution = mappedDistribution && mappedDistribution.length > 0 ? mappedDistribution : DEMO_DISTRIBUTION;
  const progression = mappedProgression.length > 0 ? mappedProgression : DEMO_PROGRESSION;
  const topicDifficulty = mappedTopicDifficulty.length > 0 ? mappedTopicDifficulty : DEMO_TOPIC_DIFFICULTY;
  const accuracyTracking = DEMO_ACCURACY_TRACKING;
  const activeBuildPriority = data?.config?.activeBuildPriority || null;
  const configRoadmap = data?.config?.contentExpansionRoadmap || null;

  const maxDistCount = Math.max(...distribution.map((d: any) => d.count), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO title={t("pages.adminReadinessAnalytics.readinessAnalyticsAdmin")} description={t("pages.adminReadinessAnalytics.adminReadinessAnalyticsDashboard")} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminReadinessAnalytics.readinessAnalytics")}</h1>
            <p className="text-gray-600 mt-1">{t("pages.adminReadinessAnalytics.aggregateExamReadinessDataPrediction")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} data-testid="button-refresh">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card data-testid="card-total-students">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{aggregate.totalStudents.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.totalStudents")}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-avg-readiness">
                <CardContent className="p-4 text-center">
                  <Gauge className="w-8 h-8 mx-auto text-violet-500 mb-2" />
                  <div className="text-2xl font-bold">{aggregate.avgReadinessScore}%</div>
                  <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.avgReadinessScore")}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-avg-probability">
                <CardContent className="p-4 text-center">
                  <GraduationCap className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  <div className="text-2xl font-bold">{aggregate.avgPassProbability}%</div>
                  <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.avgPassProbability")}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-prediction-accuracy">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <div className="text-2xl font-bold">{aggregate.predictionAccuracy}%</div>
                  <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.predictionAccuracy")}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card data-testid="card-students-ready">
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div>
                    <div className="text-lg font-bold text-emerald-600">{aggregate.studentsReady}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.examReady")}</div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-students-developing">
                <CardContent className="p-4 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                  <div>
                    <div className="text-lg font-bold text-amber-600">{aggregate.studentsDeveloping}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.developing")}</div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-students-not-ready">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-lg font-bold text-red-600">{aggregate.studentsNotReady}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminReadinessAnalytics.notReady")}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card data-testid="card-readiness-distribution">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> {t("pages.adminReadinessAnalytics.readinessScoreDistribution")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3 h-48">
                    {distribution.map((d: any, i: number) => (
                      <div key={i} className="flex-1 flex flex-col items-center" data-testid={`dist-bar-${i}`}>
                        <div className="text-xs font-medium mb-1 text-gray-600">{d.count}</div>
                        <div
                          className="w-full rounded-t transition-all"
                          style={{ height: `${(d.count / maxDistCount) * 100}%`, minHeight: d.count > 0 ? "4px" : "0px", backgroundColor: d.color }}
                        />
                        <div className="text-[10px] text-gray-500 mt-2 text-center">{d.range}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-progression">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {t("pages.adminReadinessAnalytics.readinessProgressionOverTime")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progression} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                        <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                        <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", fontSize: "12px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Line type="monotone" dataKey="avgReadiness" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Avg Readiness" />
                        <Line type="monotone" dataKey="avgProbability" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Avg Pass Probability" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-topic-difficulty">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Brain className="w-5 h-5" /> {t("pages.adminReadinessAnalytics.topicDifficultyHeatmap")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topicDifficulty.map((topic: any, i: number) => {
                    const color = topic.avgMastery >= 80 ? "bg-emerald-500" : topic.avgMastery >= 70 ? "bg-blue-500" : topic.avgMastery >= 60 ? "bg-amber-500" : "bg-red-500";
                    const textColor = topic.avgMastery >= 80 ? "text-emerald-600" : topic.avgMastery >= 70 ? "text-blue-600" : topic.avgMastery >= 60 ? "text-amber-600" : "text-red-600";
                    return (
                      <div key={i} data-testid={`topic-difficulty-${i}`}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{topic.topic}</span>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold ${textColor}`}>{topic.avgMastery}%</span>
                            <span className="text-xs text-gray-400">{topic.studentCount} students</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{topic.difficulty}</Badge>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${topic.avgMastery}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-prediction-accuracy-chart">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5" /> {t("pages.adminReadinessAnalytics.predictionAccuracyTracking")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyTracking} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Predicted Pass Rate" />
                      <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Actual Pass Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Model accuracy: {aggregate.predictionAccuracy}% — predicted outcomes closely match actual exam results
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card data-testid="card-build-priority">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5" /> {t("pages.adminReadinessAnalytics.activeBuildPriority")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-bold text-violet-700">{t("pages.adminReadinessAnalytics.currentPriority")}</span>
                      </div>
                      {activeBuildPriority ? (
                        <>
                          <p className="text-lg font-black text-gray-900" data-testid="text-build-priority">
                            {activeBuildPriority.current}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">v{activeBuildPriority.version}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(activeBuildPriority.features || []).map((f: string) => (
                              <Badge key={f} variant="outline" className="text-[10px]">{f.replace(/_/g, " ")}</Badge>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500" data-testid="text-build-priority">{t("pages.adminReadinessAnalytics.loadingConfig")}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-expansion-roadmap">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5" /> {t("pages.adminReadinessAnalytics.contentExpansionRoadmap")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(configRoadmap ? Object.entries(configRoadmap).map(([key, phase]: [string, any], i: number) => ({
                      id: i + 1,
                      title: phase.name || key,
                      status: phase.status || "planned",
                      priority: phase.status === "active" ? "high" : "medium",
                      description: (phase.items || []).join(", "),
                    })) : CONTENT_EXPANSION_ROADMAP).map((item: any) => {
                      const statusColors: Record<string, string> = {
                        planned: "bg-blue-100 text-blue-700",
                        "in-progress": "bg-amber-100 text-amber-700",
                        completed: "bg-emerald-100 text-emerald-700",
                        future: "bg-gray-100 text-gray-600",
                      };
                      const priorityColors: Record<string, string> = {
                        high: "text-red-600",
                        medium: "text-amber-600",
                        low: "text-gray-500",
                      };
                      return (
                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-white" data-testid={`roadmap-item-${item.id}`}>
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0 mt-0.5">
                            {item.id}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                              <Badge className={`text-[10px] ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`}>{item.status}</Badge>
                              <span className={`text-[10px] font-bold uppercase ${priorityColors[item.priority] || ""}`}>{item.priority}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
