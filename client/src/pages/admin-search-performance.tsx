import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, RefreshCw, Globe, Search, MousePointerClick, Eye,
  TrendingUp, BarChart3, AlertTriangle, CheckCircle2, Camera
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

function KpiCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string | number; subtitle?: string; icon: any; color: string;
}) {
  return (
    <Card className="border-0 shadow-sm" data-testid={`kpi-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminSearchPerformance() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isAdmin = user?.tier === "admin";

  const { data: perfData, isLoading } = useQuery({
    queryKey: ["/api/admin/search-performance"],
    queryFn: async () => {
      const res = await fetch("/api/admin/search-performance", { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch search performance");
      return res.json();
    },
    enabled: isAdmin,
    refetchInterval: 300000,
  });

  const { data: historyData } = useQuery({
    queryKey: ["/api/admin/search-performance/history"],
    queryFn: async () => {
      const res = await fetch("/api/admin/search-performance/history?limit=30", { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: isAdmin,
  });

  const { data: statusData } = useQuery({
    queryKey: ["/api/admin/search-performance/status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/search-performance/status", { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    },
    enabled: isAdmin,
  });

  const snapshotMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/search-performance/snapshot", {
        method: "POST",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to take snapshot");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/search-performance/history"] });
    },
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center" data-testid="text-access-denied">
          <h1 className="text-2xl font-bold text-gray-900">{t("pages.adminSearchPerformance.accessDenied")}</h1>
          <p className="text-gray-500 mt-2">{t("pages.adminSearchPerformance.adminAccessRequired")}</p>
        </div>
      </div>
    );
  }

  const topKeywords = perfData?.topKeywords || [];
  const topPages = perfData?.topPages || [];
  const snapshots = historyData?.snapshots || [];
  const maxImpressions = Math.max(...snapshots.map((s: any) => s.totalImpressions), 1);

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navigation />
      <SEO title={t("pages.adminSearchPerformance.seoPerformanceAdmin")} description={t("pages.adminSearchPerformance.searchPerformanceMonitoringDashboard")} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#2E3A59]" data-testid="text-page-title">{t("pages.adminSearchPerformance.seoPerformance")}</h1>
              <p className="text-sm text-gray-500 mt-1">{t("pages.adminSearchPerformance.searchVisibilityClickthroughRatesAnd")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusData && (
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${statusData.gscConfigured ? "border-green-300 text-green-700 bg-green-50" : "border-amber-300 text-amber-700 bg-amber-50"}`}
                data-testid="badge-data-source"
              >
                {statusData.gscConfigured ? (
                  <><CheckCircle2 className="w-3 h-3" /> {t("pages.adminSearchPerformance.googleSearchConsole")}</>
                ) : (
                  <><AlertTriangle className="w-3 h-3" /> {t("pages.adminSearchPerformance.internalAnalytics")}</>
                )}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => snapshotMutation.mutate()}
              disabled={snapshotMutation.isPending}
              data-testid="button-take-snapshot"
            >
              {snapshotMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-1" />
              )}
              Take Snapshot
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-[#BFA6F6]" />
          </div>
        )}

        {!isLoading && perfData && (
          <div className="space-y-8">
            {!statusData?.gscConfigured && (
              <Card className="border-amber-200 bg-amber-50/50 border-0 shadow-sm" data-testid="notice-gsc-not-configured">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">{t("pages.adminSearchPerformance.googleSearchConsoleNotConnected")}</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Showing internal analytics estimates. To see real search data, configure the
                      GOOGLE_SEARCH_CONSOLE_KEY and GOOGLE_SEARCH_CONSOLE_SITE_URL environment variables.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <section data-testid="section-kpi-metrics">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#BFA6F6]" /> Key Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <KpiCard
                  title={t("pages.adminSearchPerformance.indexedPages")}
                  value={perfData.indexedPages}
                  subtitle={t("pages.admin_search_performance.publishedIndexable")}
                  icon={Globe}
                  color="bg-blue-50 text-blue-600"
                />
                <KpiCard
                  title={t("pages.adminSearchPerformance.impressions4")}
                  value={perfData.totalImpressions}
                  subtitle={t("pages.admin_search_performance.last28Days")}
                  icon={Eye}
                  color="bg-purple-50 text-purple-600"
                />
                <KpiCard
                  title={t("pages.adminSearchPerformance.clicks4")}
                  value={perfData.totalClicks}
                  subtitle={t("pages.admin_search_performance.last28Days")}
                  icon={MousePointerClick}
                  color="bg-emerald-50 text-emerald-600"
                />
                <KpiCard
                  title={t("pages.adminSearchPerformance.avgCtr")}
                  value={`${perfData.averageCtr}%`}
                  subtitle={t("pages.admin_search_performance.clickthroughRate")}
                  icon={TrendingUp}
                  color="bg-amber-50 text-amber-600"
                />
                <KpiCard
                  title={t("pages.adminSearchPerformance.avgPosition")}
                  value={perfData.averagePosition > 0 ? perfData.averagePosition : "N/A"}
                  subtitle={t("pages.admin_search_performance.searchRanking")}
                  icon={Search}
                  color="bg-teal-50 text-teal-600"
                />
              </div>
            </section>

            {perfData.seoContent && (
              <section data-testid="section-content-breakdown">
                <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#AEE3E1]" /> Content Breakdown
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard title={t("pages.adminSearchPerformance.publishedBlogs")} value={perfData.seoContent.publishedBlogs} icon={BarChart3} color="bg-blue-50 text-blue-600" />
                  <KpiCard title={t("pages.adminSearchPerformance.publishedLessons")} value={perfData.seoContent.publishedLessons} icon={BarChart3} color="bg-emerald-50 text-emerald-600" />
                </div>
              </section>
            )}

            {snapshots.length > 0 && (
              <section data-testid="section-trend-chart">
                <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#AEE3E1]" /> Performance Trends
                </h2>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-3">{t("pages.adminSearchPerformance.impressionsOverTime")}</p>
                        <div className="flex items-end gap-[3px] h-36" data-testid="chart-impressions">
                          {[...snapshots].reverse().map((s: any) => {
                            const height = Math.max((s.totalImpressions / maxImpressions) * 100, 2);
                            return (
                              <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                <div
                                  className="w-full rounded-t-sm min-h-[2px] bg-[#BFA6F6]/70 hover:bg-[#BFA6F6] transition-all"
                                  style={{ height: `${height}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                  {new Date(s.snapshotDate).toLocaleDateString()}: {s.totalImpressions.toLocaleString()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-3">{t("pages.adminSearchPerformance.clickthroughRate")}</p>
                        <div className="flex items-end gap-[3px] h-36" data-testid="chart-ctr">
                          {[...snapshots].reverse().map((s: any) => {
                            const maxCtr = Math.max(...snapshots.map((x: any) => x.averageCtr), 1);
                            const height = Math.max((s.averageCtr / maxCtr) * 100, 2);
                            return (
                              <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                <div
                                  className="w-full rounded-t-sm min-h-[2px] bg-[#AEE3E1]/70 hover:bg-[#AEE3E1] transition-all"
                                  style={{ height: `${height}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                  {new Date(s.snapshotDate).toLocaleDateString()}: {s.averageCtr}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {topKeywords.length > 0 && (
              <section data-testid="section-top-keywords">
                <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#FFD6A5]" /> Top Ranking Keywords
                </h2>
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" data-testid="table-keywords">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.keyword")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.clicks")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.impressions")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">CTR</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.position")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topKeywords.map((kw: any, i: number) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50" data-testid={`row-keyword-${i}`}>
                              <td className="py-3 px-4 font-medium text-gray-900">{kw.keyword}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{kw.clicks.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{kw.impressions.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`text-sm font-medium ${kw.ctr >= 5 ? "text-green-600" : kw.ctr >= 2 ? "text-amber-600" : "text-gray-600"}`}>
                                  {kw.ctr}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  kw.position <= 3 ? "bg-green-50 text-green-700" :
                                  kw.position <= 10 ? "bg-blue-50 text-blue-700" :
                                  kw.position <= 20 ? "bg-amber-50 text-amber-700" :
                                  "bg-gray-100 text-gray-600"
                                }`}>
                                  {kw.position > 0 ? kw.position : "—"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <section data-testid="section-top-pages">
              <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#BFA6F6]" /> Top Pages by Traffic
              </h2>
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  {topPages.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 text-sm" data-testid="text-no-pages">
                      No page traffic data available yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" data-testid="table-top-pages">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.page")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.clicks2")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.impressions2")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPages.map((page: any, i: number) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50" data-testid={`row-page-${i}`}>
                              <td className="py-3 px-4">
                                <span className="text-sm font-medium text-gray-900 truncate block max-w-md" title={page.page}>
                                  {page.page}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center text-gray-600">{page.clicks.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{page.impressions.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{page.ctr}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {snapshots.length > 0 && (
              <section data-testid="section-snapshot-history">
                <h2 className="text-lg font-semibold text-[#2E3A59] mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gray-400" /> Snapshot History
                </h2>
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" data-testid="table-snapshot-history">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.date")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.indexed")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.impressions3")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.clicks3")}</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">CTR</th>
                            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">{t("pages.adminSearchPerformance.source")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshots.map((s: any) => (
                            <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50/50" data-testid={`row-snapshot-${s.id}`}>
                              <td className="py-3 px-4 font-medium text-gray-900">
                                {new Date(s.snapshotDate).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-center text-gray-600">{s.indexedPages.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{s.totalImpressions.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{s.totalClicks.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{s.averageCtr}%</td>
                              <td className="py-3 px-4 text-center">
                                <Badge variant="outline" className="text-xs">
                                  {s.dataSource === "google_search_console" ? "GSC" : "Internal"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
