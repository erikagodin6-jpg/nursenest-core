import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import {
  Users, TrendingUp, Target, BarChart3, AlertTriangle,
  Brain, Flame, GraduationCap
} from "lucide-react";

export default function AdminStudyAnalytics() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/study-analytics"],
  });

  const { data: blueprints } = useQuery<any[]>({
    queryKey: ["/api/study-coaching/blueprints"],
  });

  const { data: courses } = useQuery<any[]>({
    queryKey: ["/api/study-coaching/courses"],
  });

  const generateCourseMutation = useMutation({
    mutationFn: async (blueprintId: string) => {
      const res = await fetch("/api/study-coaching/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate course");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-coaching/courses"] });
      toast({ title: "Course generated successfully!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6" data-testid="loading-admin-analytics">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6" data-testid="admin-study-analytics">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-page-title">{t("pages.adminStudyAnalytics.studyAnalytics")}</h1>
        <p className="text-muted-foreground">{t("pages.adminStudyAnalytics.aggregateStudentPerformanceData")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-students">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{analytics?.totalStudents || 0}</div>
            <div className="text-xs text-muted-foreground">{t("pages.adminStudyAnalytics.totalStudents")}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-avg-readiness">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">{analytics?.avgReadinessScore || 0}%</div>
            <div className="text-xs text-muted-foreground">{t("pages.adminStudyAnalytics.avgReadiness")}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-avg-probability">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{analytics?.avgPassProbability || 0}%</div>
            <div className="text-xs text-muted-foreground">{t("pages.adminStudyAnalytics.avgPassProbability")}</div>
          </CardContent>
        </Card>
        <Card data-testid="card-practice-stats">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <div className="text-2xl font-bold">{analytics?.practiceSessionStats?.total_sessions || 0}</div>
            <div className="text-xs text-muted-foreground">{t("pages.adminStudyAnalytics.practiceSessions")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card data-testid="card-readiness-distribution">
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminStudyAnalytics.readinessDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.readinessDistribution || []).length > 0 ? (
              <div className="space-y-3">
                {(analytics?.readinessDistribution || []).map((r: any, i: number) => {
                  const total = analytics?.totalStudents || 1;
                  const pct = Math.round((r.count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{(r.readiness_level || "unknown").replace(/_/g, " ")}</span>
                        <span>{r.count} ({pct}%)</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("pages.adminStudyAnalytics.noReadinessDataYet")}</p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-streak-distribution">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Streak Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.streakDistribution || []).length > 0 ? (
              <div className="space-y-2">
                {(analytics?.streakDistribution || []).map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{s.range}</span>
                    <Badge variant="outline">{s.count} students</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("pages.adminStudyAnalytics.noStreakDataYet")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card data-testid="card-weak-topics">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Top Weak Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.topWeakTopics || []).length > 0 ? (
              <div className="space-y-2">
                {(analytics?.topWeakTopics || []).map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <span className="font-medium">{t.topic}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">{t.avg_mastery}%</Badge>
                      <span className="text-muted-foreground text-xs">{t.student_count} students</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("pages.adminStudyAnalytics.noWeakTopicDataYet")}</p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-strong-topics">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-500" /> Top Strong Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.topStrongTopics || []).length > 0 ? (
              <div className="space-y-2">
                {(analytics?.topStrongTopics || []).map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <span className="font-medium">{t.topic}</span>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-green-500">{t.avg_mastery}%</Badge>
                      <span className="text-muted-foreground text-xs">{t.student_count} students</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("pages.adminStudyAnalytics.noStrongTopicDataYet")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-daily-activity">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Daily Activity (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(analytics?.dailyActivity || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t("pages.adminStudyAnalytics.date")}</th>
                    <th className="text-right p-2">{t("pages.adminStudyAnalytics.questions")}</th>
                    <th className="text-right p-2">{t("pages.adminStudyAnalytics.avgAccuracy")}</th>
                    <th className="text-right p-2">{t("pages.adminStudyAnalytics.activeStudents")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(analytics?.dailyActivity || []).slice(0, 14).map((d: any, i: number) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-2">{d.date}</td>
                      <td className="p-2 text-right">{d.total_questions}</td>
                      <td className="p-2 text-right">{d.avg_accuracy}%</td>
                      <td className="p-2 text-right">{d.active_students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">{t("pages.adminStudyAnalytics.noActivityDataYet")}</p>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-course-generation">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5" /> AI Course Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate structured exam preparation courses from exam blueprints. Each course includes topic clusters, lessons, flashcards, practice questions, drills, and study plans.
          </p>

          {(blueprints || []).length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("pages.adminStudyAnalytics.availableBlueprints")}</h3>
              {(blueprints || []).map((bp: any) => (
                <div key={bp.id} className="flex items-center justify-between border rounded-lg p-3" data-testid={`blueprint-${bp.id}`}>
                  <div>
                    <span className="font-medium text-sm">{bp.exam_name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({bp.exam_code})</span>
                    <div className="text-xs text-muted-foreground">
                      {bp.total_questions} questions · {bp.time_limit} min · {(bp.domains || []).length} domains
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateCourseMutation.mutate(bp.id)}
                    disabled={generateCourseMutation.isPending}
                    data-testid={`button-generate-course-${bp.id}`}
                  >
                    Generate Course
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">{t("pages.adminStudyAnalytics.noExamBlueprintsConfiguredYet")}</p>
          )}

          {(courses || []).length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-medium">{t("pages.adminStudyAnalytics.generatedCourses")}</h3>
              {(courses || []).map((course: any) => (
                <div key={course.id} className="border rounded-lg p-3" data-testid={`course-${course.id}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{course.title}</span>
                    <Badge variant="outline" className="capitalize">{course.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {course.total_lessons} lessons · {course.total_flashcards} flashcards · {course.total_questions} questions
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(course.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
