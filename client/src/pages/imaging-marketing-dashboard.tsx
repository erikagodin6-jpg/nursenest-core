import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, Mail, Target, BarChart3, FileText, Share2, Clock, ArrowLeft } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface AnalyticsData {
  totalLeads: number;
  leadsBySource: { source: string; count: number }[];
  leadsByDay: { date: string; count: number }[];
  eventsByType: { event_type: string; count: number }[];
  topPages: { page: string; count: number }[];
  quizStarts: number;
  signups: number;
  referralCount: number;
  nurtureStats: { status: string; count: number }[];
  studyPlanCount: number;
}

interface Lead {
  id: string;
  email: string;
  name: string | null;
  source: string;
  trigger: string;
  exam_type: string | null;
  quiz_score: number | null;
  created_at: string;
  status: string;
}

interface NurtureSequence {
  id: string;
  name: string;
  trigger: string;
  steps: any[];
  is_active: boolean;
  created_at: string;
}

export default function ImagingMarketingDashboard() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [days, setDays] = useState("30");
  const queryClient = useQueryClient();

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/imaging/marketing-analytics", days],
    queryFn: async () => {
      const res = await fetch(`/api/imaging/marketing-analytics?days=${days}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    },
    enabled: isAdmin,
  });

  const { data: leadsData } = useQuery<{ leads: Lead[]; total: number }>({
    queryKey: ["/api/imaging/leads"],
    queryFn: async () => {
      const res = await fetch("/api/imaging/leads?limit=50", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load leads");
      return res.json();
    },
    enabled: isAdmin,
  });

  const { data: sequences = [] } = useQuery<NurtureSequence[]>({
    queryKey: ["/api/imaging/nurture-sequences"],
    queryFn: async () => {
      const res = await fetch("/api/imaging/nurture-sequences", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sequences");
      return res.json();
    },
    enabled: isAdmin,
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/imaging/nurture-sequences/seed-defaults", {});
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/imaging/nurture-sequences"] }),
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card><CardContent className="p-8 text-center"><p>{t("pages.imagingMarketingDashboard.adminAccessRequired")}</p></CardContent></Card>
      </div>
    );
  }

  const statCards = [
    { label: "Total Leads", value: analytics?.totalLeads || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Quiz Starts", value: analytics?.quizStarts || 0, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Study Plans", value: analytics?.studyPlanCount || 0, icon: FileText, color: "text-green-600", bg: "bg-green-50" },
    { label: "Referrals", value: analytics?.referralCount || 0, icon: Share2, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Signups", value: analytics?.signups || 0, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="text-gray-500 hover:text-gray-700" data-testid="button-back-admin">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-dashboard-title">{t("pages.imagingMarketingDashboard.medicalImagingMarketingDashboard")}</h1>
              <p className="text-sm text-gray-500">{t("pages.imagingMarketingDashboard.growthEngineAnalyticsAndLead")}</p>
            </div>
          </div>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-36" data-testid="select-date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("pages.imagingMarketingDashboard.last7Days")}</SelectItem>
              <SelectItem value="30">{t("pages.imagingMarketingDashboard.last30Days")}</SelectItem>
              <SelectItem value="90">{t("pages.imagingMarketingDashboard.last90Days")}</SelectItem>
              <SelectItem value="365">{t("pages.imagingMarketingDashboard.lastYear")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {analyticsLoading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <span className="text-xs text-gray-500">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-overview">{t("pages.imagingMarketingDashboard.overview")}</TabsTrigger>
                <TabsTrigger value="leads" data-testid="tab-leads">{t("pages.imagingMarketingDashboard.leads")}</TabsTrigger>
                <TabsTrigger value="nurture" data-testid="tab-nurture">{t("pages.imagingMarketingDashboard.nurtureSequences")}</TabsTrigger>
                <TabsTrigger value="events" data-testid="tab-events">{t("pages.imagingMarketingDashboard.events")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4" /> {t("pages.imagingMarketingDashboard.leadsBySource")}</CardTitle></CardHeader>
                    <CardContent>
                      {analytics?.leadsBySource.length === 0 ? (
                        <p className="text-sm text-gray-500">{t("pages.imagingMarketingDashboard.noLeadsYet")}</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics?.leadsBySource.map((item, i) => {
                            const maxCount = Math.max(...(analytics?.leadsBySource.map(s => s.count) || [1]));
                            return (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 w-32 truncate">{item.source}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-3">
                                  <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> {t("pages.imagingMarketingDashboard.leadsOverTime")}</CardTitle></CardHeader>
                    <CardContent>
                      {analytics?.leadsByDay.length === 0 ? (
                        <p className="text-sm text-gray-500">{t("pages.imagingMarketingDashboard.noDataYet")}</p>
                      ) : (
                        <div className="space-y-1">
                          {analytics?.leadsByDay.slice(-14).map((item, i) => {
                            const maxCount = Math.max(...(analytics?.leadsByDay.map(d => d.count) || [1]));
                            return (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-20">{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                                </div>
                                <span className="text-xs font-medium w-6 text-right">{item.count}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="w-4 h-4" /> {t("pages.imagingMarketingDashboard.topPages")}</CardTitle></CardHeader>
                    <CardContent>
                      {analytics?.topPages.length === 0 ? (
                        <p className="text-sm text-gray-500">{t("pages.imagingMarketingDashboard.noPageDataYet")}</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics?.topPages.slice(0, 10).map((page, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 truncate max-w-[200px]">{page.page}</span>
                              <span className="font-medium">{page.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="w-4 h-4" /> {t("pages.imagingMarketingDashboard.nurtureStatus")}</CardTitle></CardHeader>
                    <CardContent>
                      {analytics?.nurtureStats.length === 0 ? (
                        <p className="text-sm text-gray-500">{t("pages.imagingMarketingDashboard.noEnrollmentsYet")}</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics?.nurtureStats.map((stat, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">{stat.status}</span>
                              <span className="font-medium">{stat.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="leads">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Leads ({leadsData?.total || 0} total)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!leadsData?.leads.length ? (
                      <p className="text-sm text-gray-500 text-center py-4">{t("pages.imagingMarketingDashboard.noLeadsCapturedYet")}</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="pb-2 font-medium text-gray-500">{t("pages.imagingMarketingDashboard.email")}</th>
                              <th className="pb-2 font-medium text-gray-500">{t("pages.imagingMarketingDashboard.source")}</th>
                              <th className="pb-2 font-medium text-gray-500">{t("pages.imagingMarketingDashboard.exam")}</th>
                              <th className="pb-2 font-medium text-gray-500">{t("pages.imagingMarketingDashboard.quizScore")}</th>
                              <th className="pb-2 font-medium text-gray-500">{t("pages.imagingMarketingDashboard.date")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leadsData.leads.map((lead) => (
                              <tr key={lead.id} className="border-b last:border-0" data-testid={`row-lead-${lead.id}`}>
                                <td className="py-2">{lead.email}</td>
                                <td className="py-2"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">{lead.source}</span></td>
                                <td className="py-2">{lead.exam_type || "—"}</td>
                                <td className="py-2">{lead.quiz_score != null ? `${lead.quiz_score}%` : "—"}</td>
                                <td className="py-2 text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nurture">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">{t("pages.imagingMarketingDashboard.emailNurtureSequences")}</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} data-testid="button-seed-sequences">
                      {seedMutation.isPending ? "Seeding..." : "Seed Defaults"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {sequences.length === 0 ? (
                      <div className="text-center py-8">
                        <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-3">{t("pages.imagingMarketingDashboard.noNurtureSequencesConfigured")}</p>
                        <Button size="sm" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} data-testid="button-seed-empty">
                          Seed Default Sequences
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sequences.map((seq) => (
                          <div key={seq.id} className="border rounded-lg p-4" data-testid={`sequence-${seq.id}`}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{seq.name}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${seq.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                {seq.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Trigger: {seq.trigger} • {seq.steps?.length || 0} steps</p>
                            <div className="space-y-2">
                              {(seq.steps as any[])?.map((step: any, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  <Clock className="w-3 h-3 mt-0.5 text-gray-400 shrink-0" />
                                  <span className="text-gray-500 w-12 shrink-0">Day {step.day}</span>
                                  <span className="text-gray-700">{step.subject}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events">
                <Card>
                  <CardHeader><CardTitle className="text-base">{t("pages.imagingMarketingDashboard.marketingEventsByType")}</CardTitle></CardHeader>
                  <CardContent>
                    {analytics?.eventsByType.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">{t("pages.imagingMarketingDashboard.noEventsRecordedYet")}</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics?.eventsByType.map((evt, i) => {
                          const maxCount = Math.max(...(analytics?.eventsByType.map(e => e.count) || [1]));
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 w-40 truncate">{evt.event_type}</span>
                              <div className="flex-1 bg-gray-100 rounded-full h-3">
                                <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${(evt.count / maxCount) * 100}%` }} />
                              </div>
                              <span className="text-sm font-medium w-8 text-right">{evt.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
