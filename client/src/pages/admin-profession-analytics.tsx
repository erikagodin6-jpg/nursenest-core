import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3, Users, TrendingUp, Mail, Target,
  BookOpen, Brain, GraduationCap, Activity, ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";

import { useI18n } from "@/lib/i18n";
const PROFESSION_LABELS: Record<string, string> = {
  mlt: "Medical Lab Tech",
  imaging: "Diagnostic Imaging",
  paramedic: "Paramedic",
  rrt: "Respiratory Therapy",
  pharmacyTech: "Pharmacy Tech",
  "pharmacy-tech": "Pharmacy Tech",
  socialWorker: "Social Work",
  "social-worker": "Social Work",
  psychotherapist: "Psychotherapy",
  occupationalTherapy: "Occupational Therapy",
  "occupational-therapy": "Occupational Therapy",
  physicalTherapy: "Physical Therapy",
  "physical-therapy": "Physical Therapy",
  addictionsCounsellor: "Addictions Counselling",
  "addictions-counsellor": "Addictions Counselling",
  nursing: "Nursing",
  criticalCare: "Critical Care",
  "critical-care": "Critical Care",
  emergencyNursing: "Emergency Nursing",
  "emergency-nursing": "Emergency Nursing",
};

function getProfessionLabel(slug: string): string {

  return PROFESSION_LABELS[slug] || slug;
}

export default function AdminProfessionAnalytics() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/unified-analytics", days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/unified-analytics?days=${days}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6" data-testid="loading-profession-analytics">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-lg" />)}
        </div>
      </div>
    );
  }

  const professions = data?.professionBreakdown || [];
  const eventTypes = data?.eventTypeBreakdown || [];
  const dailyTrend = data?.dailyTrend || [];
  const topPages = data?.topPages || [];
  const conversionFunnel = data?.conversionFunnel || [];
  const emailCaptures = data?.emailCapturesByProfession || [];
  const examActivity = data?.examActivity || [];
  const quizActivity = data?.quizActivity || [];
  const mlt = data?.mlt || {};

  const totalEvents = professions.reduce((s: number, p: any) => s + (p.total_events || 0), 0);
  const totalSessions = professions.reduce((s: number, p: any) => s + (p.unique_sessions || 0), 0);
  const totalConversions = professions.reduce((s: number, p: any) => s + (p.conversions || 0) + (p.upgrade_clicks || 0), 0);
  const totalEmailCaptures = emailCaptures.reduce((s: number, e: any) => s + (e.count || 0), 0);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6" data-testid="admin-profession-analytics">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="link-back-admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminProfessionAnalytics.professionAnalyticsDashboard")}</h1>
            <p className="text-muted-foreground text-sm">{t("pages.adminProfessionAnalytics.unifiedAnalyticsAcrossAllProfessions")}</p>
          </div>
        </div>
        <div className="flex gap-2" data-testid="period-selector">
          {[7, 14, 30, 90].map(d => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
              data-testid={`button-period-${d}`}
            >
              {d}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-events">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Activity className="h-4 w-4" /> Total Events
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-total-events">{totalEvents.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card data-testid="card-unique-sessions">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="h-4 w-4" /> Unique Sessions
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-unique-sessions">{totalSessions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card data-testid="card-conversions">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Target className="h-4 w-4" /> Conversions
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-conversions">{totalConversions.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card data-testid="card-email-captures">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="h-4 w-4" /> Email Captures
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="text-email-captures">{(totalEmailCaptures + (data?.emailSignups || 0)).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-profession-breakdown">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Metrics by Profession
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-profession-breakdown">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">{t("pages.adminProfessionAnalytics.profession")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.events")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.sessions")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.pageViews")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.quizStarts")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.examStarts")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.practiceQs")}</th>
                  <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.conversions")}</th>
                  <th className="pb-2 text-right">{t("pages.adminProfessionAnalytics.emails")}</th>
                </tr>
              </thead>
              <tbody>
                {professions.map((p: any) => (
                  <tr key={p.profession} className="border-b last:border-0" data-testid={`row-profession-${p.profession}`}>
                    <td className="py-2 pr-4 font-medium">{getProfessionLabel(p.profession)}</td>
                    <td className="py-2 pr-4 text-right">{(p.total_events || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right">{(p.unique_sessions || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right">{(p.page_views || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right">{(p.quiz_starts || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right">{(p.exam_starts || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right">{(p.practice_questions || 0).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right">{((p.conversions || 0) + (p.upgrade_clicks || 0)).toLocaleString()}</td>
                    <td className="py-2 text-right">{(p.email_captures || 0).toLocaleString()}</td>
                  </tr>
                ))}
                {professions.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">{t("pages.adminProfessionAnalytics.noAnalyticsDataForThis")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card data-testid="card-conversion-funnel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Conversion Funnel by Profession
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conversionFunnel.length > 0 ? (
              <div className="space-y-2">
                {conversionFunnel.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1" data-testid={`row-conversion-${i}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{getProfessionLabel(c.profession)}</span>
                      <Badge variant="outline" className="text-xs">{c.event_type}</Badge>
                    </div>
                    <span className="font-mono text-sm">{c.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">{t("pages.adminProfessionAnalytics.noConversionDataYet")}</p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-exam-activity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Exam Activity by Profession
            </CardTitle>
          </CardHeader>
          <CardContent>
            {examActivity.length > 0 ? (
              <div className="space-y-3">
                {examActivity.map((e: any) => {
                  const totalStarts = (e.starts || 0) + (e.mock_attempts || 0);
                  const completionRate = totalStarts > 0 ? Math.round((e.completions / totalStarts) * 100) : 0;
                  return (
                    <div key={e.profession} data-testid={`row-exam-${e.profession}`}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{getProfessionLabel(e.profession)}</span>
                        <span className="text-muted-foreground">{totalStarts} starts, {e.completions || 0} completed ({completionRate}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${completionRate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">{t("pages.adminProfessionAnalytics.noExamActivityYet")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card data-testid="card-quiz-activity">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" /> Quiz &amp; Practice Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quizActivity.length > 0 ? (
              <div className="space-y-3">
                {quizActivity.map((q: any) => (
                  <div key={q.profession} className="flex items-center justify-between py-1" data-testid={`row-quiz-${q.profession}`}>
                    <span className="font-medium text-sm">{getProfessionLabel(q.profession)}</span>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span>{q.starts} starts</span>
                      <span>{q.completions} done</span>
                      <span>{q.questions_answered} Qs</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">{t("pages.adminProfessionAnalytics.noQuizActivityYet")}</p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-email-captures-breakdown">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Email Captures by Profession
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emailCaptures.length > 0 ? (
              <div className="space-y-2">
                {emailCaptures.map((e: any) => (
                  <div key={e.profession} className="flex items-center justify-between py-1" data-testid={`row-email-${e.profession}`}>
                    <span className="font-medium text-sm">{getProfessionLabel(e.profession)}</span>
                    <Badge variant="secondary">{e.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">{t("pages.adminProfessionAnalytics.noEmailCapturesYet")}</p>
            )}
            {(data?.emailSignups || 0) > 0 && (
              <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                <span className="text-muted-foreground">{t("pages.adminProfessionAnalytics.generalEmailSignups")}</span>
                <Badge>{data.emailSignups}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-mlt-legacy">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> MLT Analytics (Legacy)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("pages.adminProfessionAnalytics.quizStarts2")}</p>
              <p className="text-xl font-bold" data-testid="text-mlt-quiz-starts">{mlt.quizActivity?.quiz_starts || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("pages.adminProfessionAnalytics.quizCompletions")}</p>
              <p className="text-xl font-bold" data-testid="text-mlt-quiz-completions">{mlt.quizActivity?.quiz_completions || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("pages.adminProfessionAnalytics.lessonActivity")}</p>
              <p className="text-xl font-bold" data-testid="text-mlt-lesson-activity">{mlt.quizActivity?.lesson_activity || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("pages.adminProfessionAnalytics.flashcardActivity")}</p>
              <p className="text-xl font-bold" data-testid="text-mlt-flashcard-activity">{mlt.quizActivity?.flashcard_activity || 0}</p>
            </div>
          </div>
          {mlt.eventTypes?.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">{t("pages.adminProfessionAnalytics.eventTypes")}</p>
              <div className="flex flex-wrap gap-2">
                {mlt.eventTypes.map((e: any) => (
                  <Badge key={e.event_type} variant="outline" data-testid={`badge-mlt-event-${e.event_type}`}>
                    {e.event_type}: {e.count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-daily-trend">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Daily Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyTrend.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-daily-trend">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">{t("pages.adminProfessionAnalytics.date")}</th>
                    <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.events2")}</th>
                    <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.sessions2")}</th>
                    <th className="pb-2 pr-4 text-right">{t("pages.adminProfessionAnalytics.pageViews2")}</th>
                    <th className="pb-2 text-right">{t("pages.adminProfessionAnalytics.conversions2")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTrend.slice(0, 14).map((d: any) => (
                    <tr key={d.day} className="border-b last:border-0">
                      <td className="py-2 pr-4">{new Date(d.day).toLocaleDateString()}</td>
                      <td className="py-2 pr-4 text-right">{(d.total_events || 0).toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right">{(d.unique_sessions || 0).toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right">{(d.page_views || 0).toLocaleString()}</td>
                      <td className="py-2 text-right">{(d.conversions || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t("pages.adminProfessionAnalytics.noDailyTrendData")}</p>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-top-pages">
        <CardHeader>
          <CardTitle>{t("pages.adminProfessionAnalytics.topPages")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topPages.length > 0 ? (
            <div className="space-y-2">
              {topPages.slice(0, 15).map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1 text-sm" data-testid={`row-page-${i}`}>
                  <span className="truncate max-w-[70%] text-muted-foreground">{p.page}</span>
                  <div className="flex gap-3">
                    <span>{p.views} views</span>
                    <span className="text-muted-foreground">{p.unique_visitors} unique</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t("pages.adminProfessionAnalytics.noPageViewData")}</p>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-event-types">
        <CardHeader>
          <CardTitle>{t("pages.adminProfessionAnalytics.allEventTypes")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((e: any) => (
              <Badge key={e.event_type} variant="outline" data-testid={`badge-event-${e.event_type}`}>
                {e.event_type}: {e.count}
              </Badge>
            ))}
            {eventTypes.length === 0 && (
              <p className="text-muted-foreground">{t("pages.adminProfessionAnalytics.noEventsRecordedYet")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
