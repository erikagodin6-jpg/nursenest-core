import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, RefreshCw, TrendingUp, TrendingDown, FileText,
  BookOpen, Brain, Layers, BarChart3, Calendar, Download, Minus
} from "lucide-react";

function getAdminHeaders(): Record<string, string> {

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const token = localStorage.getItem("nn_admin_access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      headers["x-username"] = username;
      headers["x-password"] = password;
    }
  } catch {}
  return headers;
}

function formatWeekRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500" data-testid="indicator-neutral">
      <Minus className="w-3 h-3" /> 0%
    </span>
  );
  if (value > 0) return (
    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium" data-testid="indicator-up">
      <TrendingUp className="w-3 h-3" /> +{value}%
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium" data-testid="indicator-down">
      <TrendingDown className="w-3 h-3" /> {value}%
    </span>
  );
}

function ContentTypeCard({ title, value, icon: Icon, color }: {
  title: string; value: number; icon: any; color: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${color}`} data-testid={`card-type-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 opacity-70" />
        <span className="text-xs font-medium opacity-80">{title}</span>
      </div>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}

export default function AdminWeeklyReports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isAdmin = user?.tier === "admin";
  const [selectedDays, setSelectedDays] = useState(30);

  const { data: currentWeek, isLoading: loadingCurrent } = useQuery({
    queryKey: ["/api/admin/weekly-reports/current"],
    queryFn: async () => {
      const res = await fetch("/api/admin/weekly-reports/current", { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch current week");
      return res.json();
    },
    enabled: isAdmin,
  });

  const { data: historicalData, isLoading: loadingHistory } = useQuery({
    queryKey: ["/api/admin/weekly-reports"],
    queryFn: async () => {
      const res = await fetch("/api/admin/weekly-reports?weeks=12", { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
    enabled: isAdmin,
  });

  const { data: velocityData, isLoading: loadingVelocity } = useQuery({
    queryKey: ["/api/admin/content-velocity", selectedDays],
    queryFn: async () => {
      const res = await fetch(`/api/admin/content-velocity?days=${selectedDays}`, { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch velocity");
      return res.json();
    },
    enabled: isAdmin,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/weekly-reports/generate", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ weeks: 12 }),
      });
      if (!res.ok) throw new Error("Failed to generate reports");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/weekly-reports"] });
    },
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center" data-testid="text-access-denied">
          <h1 className="text-2xl font-bold text-gray-900">{t("pages.adminWeeklyReports.accessDenied")}</h1>
          <p className="text-gray-500 mt-2">{t("pages.adminWeeklyReports.adminAccessRequired")}</p>
        </div>
      </div>
    );
  }

  const isLoading = loadingCurrent || loadingHistory || loadingVelocity;
  const reports = historicalData?.reports || [];

  const maxTotal = Math.max(...(reports.map((r: any) => r.totalContentCreated) || [1]), 1);

  const velocityDays = velocityData?.dailyData || [];
  const maxDailyTotal = Math.max(
    ...velocityDays.map((d: any) => d.lessons + d.blogs + d.flashcards + d.examQuestions + d.seoArticles),
    1
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navigation />
      <SEO title={t("pages.adminWeeklyReports.weeklyContentReportsAdmin")} description={t("pages.adminWeeklyReports.automatedWeeklyContentCreationReports")} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="text-page-title">{t("pages.adminWeeklyReports.weeklyContentReports")}</h1>
              <p className="text-sm text-gray-500 mt-1">{t("pages.adminWeeklyReports.contentCreationVelocityAndWeekoverweek")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              data-testid="button-generate-reports"
            >
              {generateMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1" />
              )}
              Generate Historical Reports
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-[#BFA6F6]" />
          </div>
        )}

        {!isLoading && (
          <div className="space-y-8">
            {currentWeek && (
              <section data-testid="section-current-week">
                <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#BFA6F6]" /> Current Week
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {formatWeekRange(currentWeek.weekStart, currentWeek.weekEnd)}
                  </span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <ContentTypeCard title={t("pages.adminWeeklyReports.lessons2")} value={currentWeek.lessonsCreated} icon={BookOpen} color="bg-blue-50 text-blue-800" />
                  <ContentTypeCard title={t("pages.adminWeeklyReports.blogPosts")} value={currentWeek.blogPostsCreated} icon={FileText} color="bg-purple-50 text-purple-800" />
                  <ContentTypeCard title={t("pages.adminWeeklyReports.flashcards2")} value={currentWeek.flashcardsCreated} icon={Layers} color="bg-emerald-50 text-emerald-800" />
                  <ContentTypeCard title={t("pages.adminWeeklyReports.examQuestions")} value={currentWeek.examQuestionsCreated} icon={Brain} color="bg-amber-50 text-amber-800" />
                  <ContentTypeCard title={t("pages.adminWeeklyReports.seoArticles")} value={currentWeek.seoArticlesCreated} icon={BarChart3} color="bg-teal-50 text-teal-800" />
                  <div className="rounded-xl p-4 bg-gradient-to-br from-[#BFA6F6]/10 to-[#AEE3E1]/10 border border-[#BFA6F6]/20" data-testid="card-total-current">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">{t("pages.adminWeeklyReports.totalThisWeek")}</span>
                      <ChangeIndicator value={currentWeek.weekOverWeekChange} />
                    </div>
                    <p className="text-3xl font-bold text-[#2E3A59]">{currentWeek.totalContentCreated}</p>
                    <p className="text-xs text-gray-500 mt-1">vs {currentWeek.previousWeekTotal} last week</p>
                  </div>
                </div>
              </section>
            )}

            <section data-testid="section-velocity-chart">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2E3A59] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#AEE3E1]" /> Content Velocity
                </h2>
                <div className="flex gap-1">
                  {[7, 14, 30, 60].map(d => (
                    <Button
                      key={d}
                      variant={selectedDays === d ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs h-7 ${selectedDays === d ? "bg-[#BFA6F6] hover:bg-[#a88de8]" : ""}`}
                      onClick={() => setSelectedDays(d)}
                      data-testid={`button-range-${d}d`}
                    >
                      {d}d
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  {velocityDays.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8" data-testid="text-no-velocity">{t("pages.adminWeeklyReports.noContentCreationDataFor")}</p>
                  ) : (
                    <div>
                      <div className="flex items-end gap-[2px] h-48" data-testid="chart-velocity-bars">
                        {velocityDays.map((d: any) => {
                          const total = d.lessons + d.blogs + d.flashcards + d.examQuestions + d.seoArticles;
                          const height = Math.max((total / maxDailyTotal) * 100, 1);
                          return (
                            <div
                              key={d.date}
                              className="flex-1 flex flex-col items-center justify-end h-full group relative"
                            >
                              <div
                                className="w-full rounded-t-sm min-h-[2px] transition-all bg-[#BFA6F6]/70 hover:bg-[#BFA6F6]"
                                style={{ height: `${height}%` }}
                                title={`${d.date}: ${total} items`}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                {d.date.slice(5)}: {total}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                        <span>{velocityDays[0]?.date?.slice(5)}</span>
                        <span>{velocityDays[velocityDays.length - 1]?.date?.slice(5)}</span>
                      </div>
                      <div className="flex gap-4 mt-4 justify-center flex-wrap">
                        <Legend color="bg-blue-400" label={t("pages.adminWeeklyReports.lessons3")} />
                        <Legend color="bg-purple-400" label={t("pages.adminWeeklyReports.blogs2")} />
                        <Legend color="bg-emerald-400" label={t("pages.adminWeeklyReports.flashcards3")} />
                        <Legend color="bg-amber-400" label={t("pages.adminWeeklyReports.questions2")} />
                        <Legend color="bg-teal-400" label={t("pages.adminWeeklyReports.seoArticles2")} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section data-testid="section-historical-reports">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#FFD6A5]" /> Historical Weekly Reports
              </h2>

              {reports.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-4">{t("pages.adminWeeklyReports.noHistoricalReportsGeneratedYet")}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateMutation.mutate()}
                      disabled={generateMutation.isPending}
                      data-testid="button-generate-empty"
                    >
                      Generate Reports
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-end gap-2 h-40" data-testid="chart-weekly-bars">
                        {[...reports].reverse().map((r: any) => {
                          const height = Math.max((r.totalContentCreated / maxTotal) * 100, 2);
                          return (
                            <div key={r.id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                              <div
                                className="w-full rounded-t-sm min-h-[2px] bg-[#AEE3E1]/80 hover:bg-[#AEE3E1] transition-all"
                                style={{ height: `${height}%` }}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                {formatWeekRange(r.weekStart, r.weekEnd)}: {r.totalContentCreated}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm" data-testid="table-weekly-reports">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.week")}</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.lessons")}</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.blogs")}</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.flashcards")}</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.questions")}</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">SEO</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.total")}</th>
                              <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminWeeklyReports.wow")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.map((r: any) => (
                              <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50/50" data-testid={`row-report-${r.id}`}>
                                <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                                  {formatWeekRange(r.weekStart, r.weekEnd)}
                                </td>
                                <td className="py-3 px-4 text-center text-gray-600">{r.lessonsCreated}</td>
                                <td className="py-3 px-4 text-center text-gray-600">{r.blogPostsCreated}</td>
                                <td className="py-3 px-4 text-center text-gray-600">{r.flashcardsCreated}</td>
                                <td className="py-3 px-4 text-center text-gray-600">{r.examQuestionsCreated}</td>
                                <td className="py-3 px-4 text-center text-gray-600">{r.seoArticlesCreated}</td>
                                <td className="py-3 px-4 text-center font-semibold text-[#2E3A59]">{r.totalContentCreated}</td>
                                <td className="py-3 px-4 text-center">
                                  <ChangeIndicator value={r.weekOverWeekChange} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}
