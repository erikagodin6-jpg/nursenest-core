import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, Eye, FileText, TrendingUp, Calendar, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

import { useI18n } from "@/lib/i18n";
function formatDate(d: Date): string {

  return d.toISOString().slice(0, 10);
}

export default function AdminPageviews() {
  const [, setLocation] = useLocation();
  const defaultEnd = formatDate(new Date());
  const defaultStart = formatDate(new Date(Date.now() - 30 * 86400000));
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-pageviews", startDate, endDate],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/pageviews?start=${startDate}&end=${endDate}&limit=100`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const maxDailyViews = useMemo(() => {
    if (!data?.dailyTrend?.length) return 1;
    return Math.max(...data.dailyTrend.map((d: any) => d.views), 1);
  }, [data]);

  const maxPageViews = useMemo(() => {
    if (!data?.topPages?.length) return 1;
    return Math.max(...data.topPages.map((p: any) => p.views), 1);
  }, [data]);

  return (
    <div className="min-h-screen bg-warmwhite font-sans text-gray-900">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/admin")}
            data-testid="button-back-admin"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Admin
          </Button>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-pageviews-title">
              Page View Analytics
            </h1>
            <p className="text-sm text-gray-500">{t("pages.adminPageviews.aggregatedDailyPageViewCounts")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1" htmlFor="input-start-date">{t("pages.adminPageviews.start")}</label>
            <Input
              id="input-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
              data-testid="input-start-date"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1" htmlFor="input-end-date">{t("pages.adminPageviews.end")}</label>
            <Input
              id="input-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
              data-testid="input-end-date"
            />
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            data-testid="button-refresh"
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStartDate(formatDate(new Date(Date.now() - 7 * 86400000))); setEndDate(defaultEnd); }}
            data-testid="button-range-7d"
          >
            7d
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStartDate(formatDate(new Date(Date.now() - 30 * 86400000))); setEndDate(defaultEnd); }}
            data-testid="button-range-30d"
          >
            30d
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStartDate(formatDate(new Date(Date.now() - 90 * 86400000))); setEndDate(defaultEnd); }}
            data-testid="button-range-90d"
          >
            90d
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500" data-testid="text-loading">{t("pages.adminPageviews.loadingAnalytics")}</div>
        ) : !data ? (
          <div className="text-center py-12 text-gray-500" data-testid="text-error">{t("pages.adminPageviews.failedToLoadData")}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card data-testid="card-total-views">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("pages.adminPageviews.totalViews")}</p>
                    <p className="text-xl font-bold" data-testid="text-total-views">{(data.totals.totalViews || 0).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-unique-pages">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("pages.adminPageviews.uniquePages")}</p>
                    <p className="text-xl font-bold" data-testid="text-unique-pages">{data.totals.uniquePages}</p>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-days-tracked">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("pages.adminPageviews.daysTracked")}</p>
                    <p className="text-xl font-bold" data-testid="text-days-tracked">{data.totals.daysTracked}</p>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="card-avg-daily">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t("pages.adminPageviews.avgDay")}</p>
                    <p className="text-xl font-bold" data-testid="text-avg-daily">{data.totals.avgDaily}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8" data-testid="card-daily-trend">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Daily Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.dailyTrend.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8" data-testid="text-no-daily">{t("pages.adminPageviews.noDataForThisRange")}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="flex items-end gap-[2px] h-48 min-w-[400px]" data-testid="chart-daily-bars">
                      {data.dailyTrend.map((d: any) => (
                        <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                          <div
                            className="w-full bg-primary/70 rounded-t-sm min-h-[2px] transition-all hover:bg-primary"
                            style={{ height: `${Math.max((d.views / maxDailyViews) * 100, 1)}%` }}
                            title={`${d.date}: ${d.views} views`}
                          />
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                            {d.date.slice(5)}: {d.views}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                      <span>{data.dailyTrend[0]?.date?.slice(5)}</span>
                      <span>{data.dailyTrend[data.dailyTrend.length - 1]?.date?.slice(5)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-top-pages">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topPages.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8" data-testid="text-no-pages">{t("pages.adminPageviews.noPageDataYet")}</p>
                ) : (
                  <div className="space-y-2">
                    {data.topPages.map((p: any, i: number) => (
                      <div key={p.path} className="flex items-center gap-3" data-testid={`row-page-${i}`}>
                        <span className="text-xs text-gray-400 w-6 text-right">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium truncate" data-testid={`text-page-path-${i}`}>{p.path}</span>
                            <span className="text-xs text-gray-500 shrink-0" data-testid={`text-page-views-${i}`}>{p.views.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/60 rounded-full"
                              style={{ width: `${(p.views / maxPageViews) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
