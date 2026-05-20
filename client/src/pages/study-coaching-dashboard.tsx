import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  Target, TrendingUp, BookOpen, Brain, Calendar, Award, AlertTriangle,
  Flame, Clock, CheckCircle, BarChart3, Zap, ChevronRight, X, Trophy,
  GraduationCap, Star
} from "lucide-react";

interface DashboardData {
  profile: any;
  mastery: any[];
  readiness: any;
  recommendations: any[];
  alerts: any[];
  milestones: any[];
  accuracyTrends: any[];
  examPrepMode: boolean;
}

function getMasteryColor(label: string) {

  switch (label) {
    case "weak": return "bg-red-500";
    case "developing": return "bg-yellow-500";
    case "proficient": return "bg-blue-500";
    case "mastery": return "bg-green-500";
    default: return "bg-gray-400";
  }
}

function getReadinessColor(level: string) {
  switch (level) {
    case "not_ready": return "text-red-500";
    case "developing": return "text-yellow-500";
    case "nearly_ready": return "text-blue-500";
    case "exam_ready": return "text-green-500";
    default: return "text-gray-500";
  }
}

function getReadinessLabel(level: string) {
  switch (level) {
    case "not_ready": return "Not Ready";
    case "developing": return "Developing";
    case "nearly_ready": return "Nearly Ready";
    case "exam_ready": return "Exam Ready";
    default: return "Unknown";
  }
}

export default function StudyCoachingDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [examDate, setExamDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [practiceQuestionCount, setPracticeQuestionCount] = useState(20);

  const { data: dashboard, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/study-coaching/dashboard"],
  });

  const { data: studyPlan } = useQuery({
    queryKey: ["/api/study-coaching/study-plan"],
  });

  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/study-coaching/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examDate: examDate || null, hoursPerWeek }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-coaching/study-plan"] });
      toast({ title: "Study plan generated!" });
    },
  });

  const generatePracticeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/study-coaching/practice-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalQuestions: practiceQuestionCount }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate session");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: `Practice session created with ${data.total_questions || 0} questions!` });
    },
  });

  const dismissAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const res = await fetch(`/api/study-coaching/alerts/${alertId}/dismiss`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to dismiss");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-coaching/dashboard"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/study-coaching/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-coaching/dashboard"] });
      toast({ title: "Profile updated!" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6" data-testid="loading-study-coaching">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const profile = dashboard?.profile;
  const mastery = dashboard?.mastery || [];
  const readiness = dashboard?.readiness;
  const recommendations = dashboard?.recommendations || [];
  const alerts = dashboard?.alerts || [];
  const milestones = dashboard?.milestones || [];
  const trends = dashboard?.accuracyTrends || [];
  const examPrepMode = dashboard?.examPrepMode;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6" data-testid="study-coaching-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-page-title">{t("pages.studyCoachingDashboard.studyCoach")}</h1>
          <p className="text-muted-foreground">{t("pages.studyCoachingDashboard.yourPersonalizedStudyDashboard")}</p>
        </div>
        {examPrepMode && (
          <Badge variant="destructive" className="text-sm px-3 py-1" data-testid="badge-exam-prep-mode">
            <Zap className="w-4 h-4 mr-1" /> Exam Prep Mode Active
          </Badge>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2" data-testid="section-alerts">
          {alerts.map((alert: any) => (
            <Card key={alert.id} className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200" data-testid={`text-alert-${alert.id}`}>
                      {alert.message}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {(alert.recommended_actions || []).map((action: any, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs cursor-pointer hover:bg-yellow-100">
                          {action.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlertMutation.mutate(alert.id)}
                  data-testid={`button-dismiss-alert-${alert.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="card-stat-streak">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <div className="text-2xl font-bold" data-testid="text-current-streak">{profile?.current_streak || 0}</div>
            <div className="text-xs text-muted-foreground">{t("pages.studyCoachingDashboard.dayStreak")}</div>
            <div className="text-xs text-muted-foreground mt-1">Best: {profile?.longest_streak || 0}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-questions">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold" data-testid="text-total-questions">{profile?.total_questions_answered || 0}</div>
            <div className="text-xs text-muted-foreground">{t("pages.studyCoachingDashboard.questionsAnswered")}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {profile?.total_questions_answered > 0
                ? `${Math.round(((profile?.total_correct || 0) / profile.total_questions_answered) * 100)}% accuracy`
                : "Start answering!"}
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-study-time">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold" data-testid="text-study-hours">
              {Math.round((profile?.total_study_minutes || 0) / 60)}h
            </div>
            <div className="text-xs text-muted-foreground">{t("pages.studyCoachingDashboard.totalStudyTime")}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {(profile?.weekly_hours_logged || 0).toFixed(1)}h this week
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-readiness">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <div className={`text-2xl font-bold ${getReadinessColor(readiness?.level || "not_ready")}`} data-testid="text-readiness-score">
              {readiness?.score || 0}%
            </div>
            <div className="text-xs text-muted-foreground">{getReadinessLabel(readiness?.level || "not_ready")}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Pass: {readiness?.passProbability || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {profile?.weekly_goal_hours > 0 && (
        <Card data-testid="card-weekly-goal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t("pages.studyCoachingDashboard.weeklyGoalProgress")}</span>
              <span className="text-sm text-muted-foreground">
                {(profile?.weekly_hours_logged || 0).toFixed(1)} / {profile?.weekly_goal_hours || 10}h
              </span>
            </div>
            <Progress
              value={Math.min(100, ((profile?.weekly_hours_logged || 0) / (profile?.weekly_goal_hours || 10)) * 100)}
              className="h-3"
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto" data-testid="tabs-dashboard">
          <TabsTrigger value="overview" data-testid="tab-overview">{t("pages.studyCoachingDashboard.overview")}</TabsTrigger>
          <TabsTrigger value="mastery" data-testid="tab-mastery">{t("pages.studyCoachingDashboard.topicMastery")}</TabsTrigger>
          <TabsTrigger value="plan" data-testid="tab-plan">{t("pages.studyCoachingDashboard.studyPlan")}</TabsTrigger>
          <TabsTrigger value="practice" data-testid="tab-practice">{t("pages.studyCoachingDashboard.practice")}</TabsTrigger>
          <TabsTrigger value="achievements" data-testid="tab-achievements">{t("pages.studyCoachingDashboard.achievements")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card data-testid="card-readiness-factors">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Readiness Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {readiness?.factors && Object.entries(readiness.factors).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="font-medium">{value as number}%</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card data-testid="card-accuracy-trend">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Accuracy Trends (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trends.length > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-end gap-1 h-32">
                      {trends.slice(-14).map((day: any, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t ${day.accuracy >= 70 ? "bg-green-500" : day.accuracy >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ height: `${Math.max(4, day.accuracy)}%` }}
                            title={`${day.date}: ${day.accuracy}% (${day.questions_answered} Q)`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{trends[Math.max(0, trends.length - 14)]?.date?.slice(5)}</span>
                      <span>{trends[trends.length - 1]?.date?.slice(5)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">{t("pages.studyCoachingDashboard.noDataYetStartAnswering")}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-recommendations">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" /> Recommended Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((rec: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer" data-testid={`card-recommendation-${i}`}>
                      <div className="shrink-0 mt-0.5">
                        {rec.type === "lesson" && <BookOpen className="w-5 h-5 text-blue-500" />}
                        {rec.type === "flashcard" && <Brain className="w-5 h-5 text-purple-500" />}
                        {rec.type === "practice_set" && <Target className="w-5 h-5 text-orange-500" />}
                        {rec.type === "mock_exam" && <GraduationCap className="w-5 h-5 text-green-500" />}
                        {rec.type === "review" && <Star className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{rec.topic}</span>
                          <Badge
                            variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">{t("pages.studyCoachingDashboard.startStudyingToGetPersonalized")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mastery" className="mt-4">
          <Card data-testid="card-topic-mastery">
            <CardHeader>
              <CardTitle className="text-lg">{t("pages.studyCoachingDashboard.topicMasteryScores")}</CardTitle>
            </CardHeader>
            <CardContent>
              {mastery.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex gap-4 text-xs mb-4">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500" /> {t("pages.studyCoachingDashboard.weak040")}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-500" /> {t("pages.studyCoachingDashboard.developing4165")}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-500" /> {t("pages.studyCoachingDashboard.proficient6685")}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500" /> {t("pages.studyCoachingDashboard.mastery86100")}</div>
                  </div>
                  {mastery.map((topic: any, i: number) => (
                    <div key={i} className="space-y-1" data-testid={`mastery-topic-${i}`}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{topic.topic}{topic.subtopic ? ` / ${topic.subtopic}` : ""}</span>
                        <span className="text-muted-foreground">
                          {Math.round(topic.masteryPercent)}% ({topic.correctCount}/{topic.totalAttempts})
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${getMasteryColor(topic.masteryLabel)}`}
                          style={{ width: `${Math.max(2, topic.masteryPercent)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t("pages.studyCoachingDashboard.noMasteryDataYetAnswer")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4 mt-4">
          <Card data-testid="card-plan-generator">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Generate Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t("pages.studyCoachingDashboard.examDateOptional")}</label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    data-testid="input-exam-date"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t("pages.studyCoachingDashboard.hoursPerWeek")}</label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 10)}
                    data-testid="input-hours-per-week"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => generatePlanMutation.mutate()}
                    disabled={generatePlanMutation.isPending}
                    className="w-full"
                    data-testid="button-generate-plan"
                  >
                    {generatePlanMutation.isPending ? "Generating..." : "Generate Plan"}
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (examDate) {
                    updateProfileMutation.mutate({ examDate, hoursPerWeek });
                  }
                }}
                disabled={!examDate}
                data-testid="button-save-exam-date"
              >
                Save Exam Date to Profile
              </Button>
            </CardContent>
          </Card>

          {Array.isArray(studyPlan) && studyPlan.length > 0 && (
            <Card data-testid="card-study-plan">
              <CardHeader>
                <CardTitle className="text-lg">{t("pages.studyCoachingDashboard.yourStudySchedule")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(studyPlan as any[]).map((day: any, i: number) => (
                    <div key={i} className="border rounded-lg p-3" data-testid={`plan-day-${i}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{day.date}</span>
                          <Badge variant="outline" className="text-xs capitalize">{day.phase}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(day.tasks || []).reduce((s: number, t: any) => s + (t.duration || 0), 0)} min
                        </span>
                      </div>
                      <div className="space-y-1">
                        {((typeof day.tasks === "string" ? JSON.parse(day.tasks) : day.tasks) || []).map((task: any, j: number) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{task.description} ({task.duration} min)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="practice" className="space-y-4 mt-4">
          <Card data-testid="card-practice-generator">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" /> Custom Practice Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a personalized practice session that prioritizes your weak areas (50%), moderate topics (30%), and strong topics (20%).
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t("pages.studyCoachingDashboard.numberOfQuestions")}</label>
                  <Input
                    type="number"
                    min={5}
                    max={100}
                    value={practiceQuestionCount}
                    onChange={(e) => setPracticeQuestionCount(parseInt(e.target.value) || 20)}
                    className="w-32"
                    data-testid="input-practice-count"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => generatePracticeMutation.mutate()}
                    disabled={generatePracticeMutation.isPending}
                    data-testid="button-generate-practice"
                  >
                    {generatePracticeMutation.isPending ? "Creating..." : "Generate Session"}
                  </Button>
                </div>
              </div>

              {mastery.length > 0 && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-2">{t("pages.studyCoachingDashboard.topicDistributionPreview")}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-red-500">
                      Weak: {mastery.filter((t: any) => t.masteryLabel === "weak").length} topics
                    </span>
                    <span className="text-yellow-500">
                      Developing: {mastery.filter((t: any) => t.masteryLabel === "developing").length} topics
                    </span>
                    <span className="text-green-500">
                      Strong: {mastery.filter((t: any) => t.masteryLabel === "proficient" || t.masteryLabel === "mastery").length} topics
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-flashcard-stats">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" /> Flashcard Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold" data-testid="text-flashcards-studied">{profile?.flashcards_studied || 0}</div>
                  <div className="text-xs text-muted-foreground">{t("pages.studyCoachingDashboard.cardsStudied")}</div>
                </div>
                <div>
                  <div className="text-xl font-bold" data-testid="text-lessons-viewed">{profile?.lessons_viewed || 0}</div>
                  <div className="text-xs text-muted-foreground">{t("pages.studyCoachingDashboard.lessonsViewed")}</div>
                </div>
                <div>
                  <div className="text-xl font-bold" data-testid="text-exams-completed">{profile?.practice_exams_completed || 0}</div>
                  <div className="text-xs text-muted-foreground">{t("pages.studyCoachingDashboard.examsCompleted")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <Card data-testid="card-milestones">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Milestones & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {milestones.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {milestones.map((m: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg" data-testid={`milestone-${i}`}>
                      <Award className="w-8 h-8 text-yellow-500 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(m.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t("pages.studyCoachingDashboard.keepStudyingToEarnMilestones")}</p>
                  <p className="text-xs mt-2">{t("pages.studyCoachingDashboard.milestones7dayStreak100Questions")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
