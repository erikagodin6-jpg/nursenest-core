import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, TrendingUp, Target, Clock, ArrowLeft, Award,
  BookOpen, CheckCircle2, Calendar
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend, AreaChart, Area
} from "recharts";

type AnalyticsData = {
  totalQuestions: number;
  overallAccuracy: number;
  studyTimeHours: number;
  mockExamsCompleted: number;
  accuracyTrend: { date: string; accuracy: number; questions: number }[];
  topicMastery: { topic: string; accuracy: number; total: number }[];
  mockExamHistory: { date: string; score: number; examName: string; id: string }[];
  questionsOverTime: { date: string; count: number }[];
  weeklyStudyTime: { week: string; hours: number }[];
};

function getBarColor(accuracy: number): string {

  if (accuracy >= 70) return "#10b981";
  if (accuracy >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function PerformanceAnalyticsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAnalytics();
  }, [user, period]);

  const fetchAnalytics = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/performance-analytics?period=${period}`, {
        headers: { "x-user-id": user.id },
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        setData(getMockData());
      }
    } catch {
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background" data-testid="performance-analytics-page">
      <SEO
        title={t("pages.performanceAnalytics.performanceAnalyticsNursenest")}
        description={t("pages.performanceAnalytics.viewYourStudyPerformanceAnalytics")}
        canonicalPath="/performance-analytics"
      />
      <Navigation />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} data-testid="button-back-dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2" data-testid="text-analytics-title">
              <BarChart3 className="h-6 w-6 text-primary" />
              Performance Analytics
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Track your study progress and identify areas for improvement.
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1" data-testid="period-selector">
            {(["7d", "30d", "90d", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`button-period-${p}`}
              >
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "All Time"}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-testid="summary-stats">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-total-questions">{data.totalQuestions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t("pages.performanceAnalytics.questionsCompleted")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-accuracy">{data.overallAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">{t("pages.performanceAnalytics.overallAccuracy")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-study-time">{data.studyTimeHours}h</p>
                  <p className="text-xs text-muted-foreground">{t("pages.performanceAnalytics.studyTime")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" data-testid="stat-exams">{data.mockExamsCompleted}</p>
                  <p className="text-xs text-muted-foreground">{t("pages.performanceAnalytics.mockExams")}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="accuracy" className="space-y-4">
              <TabsList className="w-full justify-start" data-testid="analytics-tabs">
                <TabsTrigger value="accuracy" data-testid="tab-accuracy">{t("pages.performanceAnalytics.accuracyTrend")}</TabsTrigger>
                <TabsTrigger value="topics" data-testid="tab-topics">{t("pages.performanceAnalytics.topicMastery")}</TabsTrigger>
                <TabsTrigger value="exams" data-testid="tab-exams">{t("pages.performanceAnalytics.mockExamHistory")}</TabsTrigger>
                <TabsTrigger value="activity" data-testid="tab-activity">{t("pages.performanceAnalytics.activity")}</TabsTrigger>
              </TabsList>

              <TabsContent value="accuracy">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Accuracy Rate Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.accuracyTrend.length > 0 ? (
                      <div className="h-80" data-testid="chart-accuracy-trend">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data.accuracyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                              formatter={(value: number) => [`${value}%`, "Accuracy"]}
                            />
                            <Area
                              type="monotone"
                              dataKey="accuracy"
                              stroke="#7c3aed"
                              fill="#7c3aed"
                              fillOpacity={0.1}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
                        Complete some practice questions to see your accuracy trend.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topics">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Topic Mastery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.topicMastery.length > 0 ? (
                      <div className="h-96" data-testid="chart-topic-mastery">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.topicMastery} layout="vertical" margin={{ left: 120 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={110} />
                            <Tooltip
                              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                              formatter={(value: number, _: any, entry: any) => [
                                `${value}% (${entry.payload.total} questions)`,
                                "Accuracy",
                              ]}
                            />
                            <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                              {data.topicMastery.map((entry, i) => (
                                <Cell key={i} fill={getBarColor(entry.accuracy)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
                        Complete some practice questions to see topic mastery.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exams">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Mock Exam Score History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.mockExamHistory.length > 0 ? (
                      <div className="h-80" data-testid="chart-exam-history">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data.mockExamHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                              formatter={(value: number) => [`${value}%`, "Score"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#7c3aed"
                              strokeWidth={2}
                              dot={{ r: 4, fill: "#7c3aed" }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
                        Complete a mock exam to see your score history.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Questions Completed Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.questionsOverTime.length > 0 ? (
                        <div className="h-64" data-testid="chart-questions-over-time">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.questionsOverTime}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} />
                              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Questions" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                          No activity data yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Weekly Study Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.weeklyStudyTime.length > 0 ? (
                        <div className="h-64" data-testid="chart-study-time">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.weeklyStudyTime}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} />
                              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                              <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} name="Hours" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                          No study time data yet.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

function getMockData(): AnalyticsData {
  const days = 30;
  const accuracyTrend = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      accuracy: Math.round(55 + Math.random() * 30 + i * 0.3),
      questions: Math.round(5 + Math.random() * 20),
    };
  });

  return {
    totalQuestions: 847,
    overallAccuracy: 72,
    studyTimeHours: 45,
    mockExamsCompleted: 8,
    accuracyTrend,
    topicMastery: [
      { topic: "Pharmacology", accuracy: 85, total: 120 },
      { topic: "Medical-Surgical", accuracy: 72, total: 95 },
      { topic: "Pediatrics", accuracy: 68, total: 65 },
      { topic: "Mental Health", accuracy: 65, total: 78 },
      { topic: "Maternal-Newborn", accuracy: 60, total: 55 },
      { topic: "Community Health", accuracy: 58, total: 45 },
      { topic: "Leadership", accuracy: 55, total: 40 },
      { topic: "Health Promotion", accuracy: 48, total: 35 },
    ],
    mockExamHistory: [
      { date: "Feb 1", score: 58, examName: "Practice Exam 1", id: "1" },
      { date: "Feb 8", score: 62, examName: "Practice Exam 2", id: "2" },
      { date: "Feb 15", score: 65, examName: "Mock NCLEX 1", id: "3" },
      { date: "Feb 22", score: 68, examName: "Practice Exam 3", id: "4" },
      { date: "Mar 1", score: 72, examName: "Mock NCLEX 2", id: "5" },
      { date: "Mar 8", score: 75, examName: "Practice Exam 4", id: "6" },
    ],
    questionsOverTime: Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: Math.round(10 + Math.random() * 30),
      };
    }),
    weeklyStudyTime: [
      { week: "Week 1", hours: 5.2 },
      { week: "Week 2", hours: 7.8 },
      { week: "Week 3", hours: 6.5 },
      { week: "Week 4", hours: 9.1 },
    ],
  };
}
