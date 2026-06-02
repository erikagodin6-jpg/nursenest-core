import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, BarChart3, Users, TrendingUp,
  Shuffle, Eye, Activity,
} from "lucide-react";
import { Link } from "wouter";
import { SECTION_LABELS, type PlatformSection } from "@shared/platform-sections";

import { useI18n } from "@/lib/i18n";
const SECTION_COLORS: Record<string, string> = {
  exam_prep: "bg-blue-100 text-blue-800 border-blue-200",
  new_grad: "bg-green-100 text-green-800 border-green-200",
  career_tools: "bg-purple-100 text-purple-800 border-purple-200",
  allied_health: "bg-amber-100 text-amber-800 border-amber-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
};

const SECTION_BAR_COLORS: Record<string, string> = {
  exam_prep: "bg-blue-500",
  new_grad: "bg-green-500",
  career_tools: "bg-purple-500",
  allied_health: "bg-amber-500",
  other: "bg-gray-400",
};

function getSectionLabel(key: string): string {

  return SECTION_LABELS[key as PlatformSection] || key;
}

export default function AdminCrossPlatformAnalytics() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/cross-platform-analytics", days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/cross-platform-analytics?days=${days}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  const sectionTraffic = data?.sectionTraffic || [];
  const transitions = data?.crossSectionTransitions || [];
  const multiSection = data?.multiSectionVisitors || { total: 0, breakdown: [] };
  const eduToCareer = data?.educationToCareerConversions || 0;
  const topTransitions = data?.topTransitions || [];
  const totalPageViews = sectionTraffic.reduce((s: number, r: any) => s + (r.page_views || 0), 0);
  const totalUniqueSessions = sectionTraffic.reduce((s: number, r: any) => s + (r.unique_sessions || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-testid="page-cross-platform-analytics">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" data-testid="link-back-admin">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> {t("pages.adminCrossPlatformAnalytics.admin")}</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="heading-cross-platform">{t("pages.adminCrossPlatformAnalytics.crossplatformAnalytics")}</h1>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 90].map((d) => (
              <Button
                key={d}
                variant={days === d ? "default" : "outline"}
                size="sm"
                onClick={() => setDays(d)}
                data-testid={`button-days-${d}`}
              >
                {d}d
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500" data-testid="loading-indicator">{t("pages.adminCrossPlatformAnalytics.loadingAnalytics")}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card data-testid="card-kpi-total-views">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Eye className="w-4 h-4" /> {t("pages.adminCrossPlatformAnalytics.totalPageViews")}</div>
                  <div className="text-3xl font-bold">{totalPageViews.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-kpi-unique-sessions">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Users className="w-4 h-4" /> {t("pages.adminCrossPlatformAnalytics.uniqueSessions")}</div>
                  <div className="text-3xl font-bold">{totalUniqueSessions.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-kpi-multi-section">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Shuffle className="w-4 h-4" /> {t("pages.adminCrossPlatformAnalytics.multisectionVisitors")}</div>
                  <div className="text-3xl font-bold">{multiSection.total.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-kpi-edu-career">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" /> {t("pages.adminCrossPlatformAnalytics.educationCareer")}</div>
                  <div className="text-3xl font-bold">{eduToCareer.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">{t("pages.adminCrossPlatformAnalytics.conversionsFromExamPrepTo")}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-section-traffic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="w-5 h-5" /> {t("pages.adminCrossPlatformAnalytics.trafficBySection")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {sectionTraffic.length === 0 ? (
                    <p className="text-gray-400 text-sm" data-testid="text-no-traffic">{t("pages.adminCrossPlatformAnalytics.noTrafficDataYet")}</p>
                  ) : (
                    <div className="space-y-4">
                      {sectionTraffic.map((row: any) => {
                        const pct = totalPageViews > 0 ? Math.round((row.page_views / totalPageViews) * 100) : 0;
                        return (
                          <div key={row.platform_section} data-testid={`section-traffic-${row.platform_section}`}>
                            <div className="flex items-center justify-between mb-1">
                              <Badge className={SECTION_COLORS[row.platform_section] || "bg-gray-100 text-gray-800"}>
                                {getSectionLabel(row.platform_section)}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {row.page_views.toLocaleString()} views · {row.unique_sessions.toLocaleString()} sessions · ~{row.avg_duration}s avg
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${SECTION_BAR_COLORS[row.platform_section] || "bg-gray-400"}`}
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                            <div className="text-right text-xs text-gray-400 mt-0.5">{pct}%</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="card-flow-visualization">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Activity className="w-5 h-5" /> {t("pages.adminCrossPlatformAnalytics.crossplatformFlow")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {topTransitions.length === 0 ? (
                    <p className="text-gray-400 text-sm" data-testid="text-no-transitions">{t("pages.adminCrossPlatformAnalytics.noCrosssectionTransitionsRecordedYet")}</p>
                  ) : (
                    <div className="space-y-3">
                      {topTransitions.map((row: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border" data-testid={`transition-row-${idx}`}>
                          <Badge className={SECTION_COLORS[row.source_section] || "bg-gray-100"}>
                            {getSectionLabel(row.source_section)}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <Badge className={SECTION_COLORS[row.destination_section] || "bg-gray-100"}>
                            {getSectionLabel(row.destination_section)}
                          </Badge>
                          <span className="ml-auto text-sm font-medium text-gray-700" data-testid={`transition-count-${idx}`}>
                            {row.count} transitions
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-multi-section-breakdown">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Users className="w-5 h-5" /> {t("pages.adminCrossPlatformAnalytics.multisectionVisitorBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                {multiSection.breakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm" data-testid="text-no-multi-section">{t("pages.adminCrossPlatformAnalytics.noMultisectionVisitorsYet")}</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {multiSection.breakdown.map((row: any) => (
                      <div key={row.section_count} className="text-center p-4 rounded-lg bg-gray-50 border" data-testid={`multi-section-${row.section_count}`}>
                        <div className="text-2xl font-bold text-primary">{row.visitor_count}</div>
                        <div className="text-sm text-gray-500 mt-1">Visited {row.section_count} sections</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-transition-matrix">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Shuffle className="w-5 h-5" /> {t("pages.adminCrossPlatformAnalytics.sectiontosectionTransitionDetails")}</CardTitle>
              </CardHeader>
              <CardContent>
                {transitions.length === 0 ? (
                  <p className="text-gray-400 text-sm" data-testid="text-no-matrix">{t("pages.adminCrossPlatformAnalytics.noTransitionDataYet")}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-transitions">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">{t("pages.adminCrossPlatformAnalytics.from")}</th>
                          <th className="text-left py-2 px-3 text-gray-500 font-medium">To</th>
                          <th className="text-right py-2 px-3 text-gray-500 font-medium">{t("pages.adminCrossPlatformAnalytics.transitions")}</th>
                          <th className="text-right py-2 px-3 text-gray-500 font-medium">{t("pages.adminCrossPlatformAnalytics.uniqueUsers")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transitions.map((row: any, idx: number) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-gray-50" data-testid={`matrix-row-${idx}`}>
                            <td className="py-2 px-3">
                              <Badge variant="outline" className={SECTION_COLORS[row.source_section] || ""}>
                                {getSectionLabel(row.source_section)}
                              </Badge>
                            </td>
                            <td className="py-2 px-3">
                              <Badge variant="outline" className={SECTION_COLORS[row.destination_section] || ""}>
                                {getSectionLabel(row.destination_section)}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-right font-medium">{row.transitions}</td>
                            <td className="py-2 px-3 text-right text-gray-600">{row.unique_users}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
