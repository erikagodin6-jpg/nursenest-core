import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Minus,
  Globe, FileText, BarChart3, Search, Map, Calendar,
  AlertTriangle, CheckCircle2, XCircle, Eye, MousePointer,
  BookOpen, Layers, Database, Activity
} from "lucide-react";

type ContentGrowthData = {
  blogPosts: { week: string; count: number }[];
  lessons: { week: string; count: number }[];
  flashcards: { week: string; count: number }[];
  examQuestions: { week: string; count: number }[];
  currentWeekSummary: { blogPosts: number; lessons: number; flashcards: number; examQuestions: number };
  previousWeekSummary: { blogPosts: number; lessons: number; flashcards: number; examQuestions: number };
};

type SitemapSection = {
  section: string;
  urlCount: number;
  status: "healthy" | "low" | "empty";
};

type SitemapData = {
  sections: SitemapSection[];
  totalUrls: number;
};

type SearchMetrics = {
  source: string;
  configured: boolean;
  setupMessage?: string;
  metrics?: {
    totalPageViews: number;
    pageViewsBySection: { section: string; views: number }[];
    topPages: { page: string; views: number }[];
    weeklyTraffic: { week: string; views: number }[];
  };
};

type CoverageEntry = {
  dimension: string;
  value: string;
  questions: number;
  flashcards: number;
  lessons: number;
  blogs: number;
  total: number;
};

type ContentCoverageData = {
  byBodySystem: CoverageEntry[];
  byTopic: CoverageEntry[];
  byProfession: CoverageEntry[];
  gaps: string[];
};

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  const { t } = useI18n();
  if (current > previous) {
    const pct = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 100;
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium" data-testid="trend-up">
        <TrendingUp className="w-3 h-3" /> +{pct}%
      </span>
    );
  }
  if (current < previous) {
    const pct = previous > 0 ? Math.round(((previous - current) / previous) * 100) : 0;
    return (
      <span className="flex items-center gap-1 text-xs text-red-500 font-medium" data-testid="trend-down">
        <TrendingDown className="w-3 h-3" /> -{pct}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium" data-testid="trend-flat">
      <Minus className="w-3 h-3" /> No change
    </span>
  );
}

function MiniBarChart({ data, color = "bg-blue-500", maxHeight = 48 }: { data: { week: string; count: number }[]; color?: string; maxHeight?: number }) {
  if (!data || data.length === 0) return <div className="text-xs text-slate-400">{t("pages.adminSeoPerformance.noData")}</div>;
  const sorted = [...data].sort((a, b) => a.week.localeCompare(b.week));
  const maxVal = Math.max(...sorted.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: maxHeight }} data-testid="chart-mini-bar">
      {sorted.map((d, i) => (
        <div
          key={i}
          className={`${color} rounded-t opacity-80 hover:opacity-100 transition-opacity`}
          style={{
            width: Math.max(100 / sorted.length - 2, 6),
            height: Math.max((d.count / maxVal) * maxHeight, 2),
          }}
          title={`${d.week}: ${d.count}`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "healthy") return <Badge className="bg-emerald-100 text-emerald-700 text-xs" data-testid="badge-healthy"><CheckCircle2 className="w-3 h-3 mr-1" />{t("pages.adminSeoPerformance.healthy")}</Badge>;
  if (status === "low") return <Badge className="bg-amber-100 text-amber-700 text-xs" data-testid="badge-low"><AlertTriangle className="w-3 h-3 mr-1" />{t("pages.adminSeoPerformance.low")}</Badge>;
  return <Badge className="bg-red-100 text-red-700 text-xs" data-testid="badge-empty"><XCircle className="w-3 h-3 mr-1" />{t("pages.adminSeoPerformance.empty")}</Badge>;
}

function HeatmapCell({ value, maxValue }: { value: number; maxValue: number }) {
  const intensity = maxValue > 0 ? value / maxValue : 0;
  let bg = "bg-slate-50";
  if (intensity > 0.75) bg = "bg-emerald-500 text-white";
  else if (intensity > 0.5) bg = "bg-emerald-300";
  else if (intensity > 0.25) bg = "bg-emerald-200";
  else if (intensity > 0) bg = "bg-emerald-100";
  return (
    <div className={`text-center text-xs font-mono p-1 rounded ${bg}`} data-testid="heatmap-cell">
      {value}
    </div>
  );
}

export default function AdminSeoPerformance() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"growth" | "sitemap" | "search" | "coverage" | "weekly">("growth");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [growthData, setGrowthData] = useState<ContentGrowthData | null>(null);
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null);
  const [searchData, setSearchData] = useState<SearchMetrics | null>(null);
  const [coverageData, setCoverageData] = useState<ContentCoverageData | null>(null);

  const isAdmin = user?.tier === "admin";

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [growthRes, sitemapRes, searchRes, coverageRes] = await Promise.all([
        fetch("/api/admin/seo-performance/content-growth", { credentials: "include" }),
        fetch("/api/admin/seo-performance/sitemap-analysis", { credentials: "include" }),
        fetch("/api/admin/seo-performance/search-metrics", { credentials: "include" }),
        fetch("/api/admin/seo-performance/content-coverage", { credentials: "include" }),
      ]);
      if (growthRes.ok) setGrowthData(await growthRes.json());
      if (sitemapRes.ok) setSitemapData(await sitemapRes.json());
      if (searchRes.ok) setSearchData(await searchRes.json());
      if (coverageRes.ok) setCoverageData(await coverageRes.json());
    } catch (e) {
      console.error("SEO performance fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/admin/seo-performance/refresh", { method: "POST", credentials: "include" });
      await fetchAll();
    } catch {}
    setRefreshing(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin, fetchAll]);

  if (!isAdmin) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500" data-testid="text-access-denied">{t("pages.adminSeoPerformance.adminAccessRequired")}</p>
        </div>
      </>
    );
  }

  const tabs = [
    { key: "growth", label: "Content Growth", icon: TrendingUp },
    { key: "sitemap", label: "Indexed Pages", icon: Globe },
    { key: "search", label: "Search Performance", icon: Search },
    { key: "coverage", label: "Content Coverage", icon: Map },
    { key: "weekly", label: "Weekly Summary", icon: Calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <SEO title={t("pages.adminSeoPerformance.seoPerformanceAdmin")} description={t("pages.adminSeoPerformance.seoPerformanceMetricsAndContent")} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900" data-testid="text-page-title">{t("pages.adminSeoPerformance.seoPerformanceGrowth")}</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh All"}
          </Button>
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-slate-200 overflow-x-auto" data-testid="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16" data-testid="loading-indicator">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        )}

        {!loading && activeTab === "growth" && growthData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="section-growth-cards">
              <Card data-testid="card-growth-blogs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" /> Blog Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{growthData.currentWeekSummary.blogPosts}</div>
                  <div className="text-xs text-slate-500 mb-2">{t("pages.adminSeoPerformance.thisWeek")}</div>
                  <TrendIndicator current={growthData.currentWeekSummary.blogPosts} previous={growthData.previousWeekSummary.blogPosts} />
                  <div className="mt-3">
                    <MiniBarChart data={growthData.blogPosts} color="bg-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-growth-lessons">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" /> Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{growthData.currentWeekSummary.lessons}</div>
                  <div className="text-xs text-slate-500 mb-2">{t("pages.adminSeoPerformance.thisWeek2")}</div>
                  <TrendIndicator current={growthData.currentWeekSummary.lessons} previous={growthData.previousWeekSummary.lessons} />
                  <div className="mt-3">
                    <MiniBarChart data={growthData.lessons} color="bg-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-growth-flashcards">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" /> Flashcards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{growthData.currentWeekSummary.flashcards}</div>
                  <div className="text-xs text-slate-500 mb-2">{t("pages.adminSeoPerformance.thisWeek3")}</div>
                  <TrendIndicator current={growthData.currentWeekSummary.flashcards} previous={growthData.previousWeekSummary.flashcards} />
                  <div className="mt-3">
                    <MiniBarChart data={growthData.flashcards} color="bg-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-growth-questions">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-500" /> Exam Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">{growthData.currentWeekSummary.examQuestions}</div>
                  <div className="text-xs text-slate-500 mb-2">{t("pages.adminSeoPerformance.thisWeek4")}</div>
                  <TrendIndicator current={growthData.currentWeekSummary.examQuestions} previous={growthData.previousWeekSummary.examQuestions} />
                  <div className="mt-3">
                    <MiniBarChart data={growthData.examQuestions} color="bg-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-growth-history">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Weekly Content Creation History (Last 12 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-slate-500">
                        <th className="text-left py-2 px-3">{t("pages.adminSeoPerformance.week")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.blogPosts")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.lessons")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.flashcards")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.examQuestions")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.total")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const allWeeks = new Set<string>();
                        growthData.blogPosts.forEach(d => allWeeks.add(d.week));
                        growthData.lessons.forEach(d => allWeeks.add(d.week));
                        growthData.flashcards.forEach(d => allWeeks.add(d.week));
                        growthData.examQuestions.forEach(d => allWeeks.add(d.week));
                        const weeks = Array.from(allWeeks).sort().reverse();
                        return weeks.map(week => {
                          const bp = growthData.blogPosts.find(d => d.week === week)?.count || 0;
                          const ls = growthData.lessons.find(d => d.week === week)?.count || 0;
                          const fc = growthData.flashcards.find(d => d.week === week)?.count || 0;
                          const eq = growthData.examQuestions.find(d => d.week === week)?.count || 0;
                          return (
                            <tr key={week} className="border-b hover:bg-slate-50" data-testid={`row-week-${week}`}>
                              <td className="py-2 px-3 font-medium text-slate-700">{week}</td>
                              <td className="text-center py-2 px-3">{bp}</td>
                              <td className="text-center py-2 px-3">{ls}</td>
                              <td className="text-center py-2 px-3">{fc}</td>
                              <td className="text-center py-2 px-3">{eq}</td>
                              <td className="text-center py-2 px-3 font-semibold">{bp + ls + fc + eq}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && activeTab === "sitemap" && sitemapData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card data-testid="card-sitemap-total">
                <CardContent className="pt-6 text-center">
                  <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-800">{sitemapData.totalUrls.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{t("pages.adminSeoPerformance.totalIndexedUrls")}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-sitemap-sections">
                <CardContent className="pt-6 text-center">
                  <Layers className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-800">{sitemapData.sections.length}</div>
                  <div className="text-sm text-slate-500">{t("pages.adminSeoPerformance.sitemapSections")}</div>
                </CardContent>
              </Card>
              <Card data-testid="card-sitemap-health">
                <CardContent className="pt-6 text-center">
                  <Activity className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-slate-800">
                    {sitemapData.sections.filter(s => s.status === "healthy").length}/{sitemapData.sections.length}
                  </div>
                  <div className="text-sm text-slate-500">{t("pages.adminSeoPerformance.healthySections")}</div>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="card-sitemap-breakdown">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Indexed Pages by Section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sitemapData.sections.map((s, i) => {
                    const maxUrls = Math.max(...sitemapData.sections.map(x => x.urlCount), 1);
                    const pct = (s.urlCount / maxUrls) * 100;
                    return (
                      <div key={i} className="flex items-center gap-3" data-testid={`sitemap-section-${i}`}>
                        <span className="text-sm text-slate-600 w-48 text-right truncate flex-shrink-0">{s.section}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              s.status === "healthy" ? "bg-blue-500" : s.status === "low" ? "bg-amber-400" : "bg-red-300"
                            }`}
                            style={{ width: `${Math.max(pct, 1)}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono font-semibold text-slate-700 w-16 text-right">{s.urlCount.toLocaleString()}</span>
                        <StatusBadge status={s.status} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && activeTab === "search" && searchData && (
          <div className="space-y-6">
            {!searchData.configured && (
              <Card className="border-amber-200 bg-amber-50/50" data-testid="card-gsc-setup">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Search className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-1">{t("pages.adminSeoPerformance.googleSearchConsoleNotConnected")}</h3>
                      <p className="text-sm text-amber-700 mb-3">{searchData.setupMessage}</p>
                      <div className="text-xs text-amber-600 bg-amber-100 rounded p-3">
                        <strong>{t("pages.adminSeoPerformance.toEnable")}</strong> Set <code className="bg-amber-200 px-1 rounded">GOOGLE_SEARCH_CONSOLE_KEY</code> or <code className="bg-amber-200 px-1 rounded">GSC_CREDENTIALS</code> environment variables with your Google Search Console API credentials.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {searchData.metrics && (
              <>
                <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminSeoPerformance.internalTrafficMetricsLast30")}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card data-testid="card-total-views">
                    <CardContent className="pt-6 text-center">
                      <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-slate-800">{searchData.metrics.totalPageViews.toLocaleString()}</div>
                      <div className="text-sm text-slate-500">{t("pages.adminSeoPerformance.totalPageViews")}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-sections-tracked">
                    <CardContent className="pt-6 text-center">
                      <BarChart3 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-slate-800">{searchData.metrics.pageViewsBySection.length}</div>
                      <div className="text-sm text-slate-500">{t("pages.adminSeoPerformance.activeSections")}</div>
                    </CardContent>
                  </Card>
                  <Card data-testid="card-top-pages-count">
                    <CardContent className="pt-6 text-center">
                      <MousePointer className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-slate-800">{searchData.metrics.topPages.length}</div>
                      <div className="text-sm text-slate-500">{t("pages.adminSeoPerformance.trackedPages")}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card data-testid="card-views-by-section">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Page Views by Section
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {searchData.metrics.pageViewsBySection.length === 0 ? (
                        <p className="text-sm text-slate-400">{t("pages.adminSeoPerformance.noSectionDataAvailableYet")}</p>
                      ) : (
                        <div className="space-y-2">
                          {searchData.metrics.pageViewsBySection.slice(0, 10).map((s, i) => {
                            const max = Math.max(...searchData.metrics!.pageViewsBySection.map(x => x.views), 1);
                            return (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-xs text-slate-600 w-24 text-right truncate">{s.section}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.views / max) * 100}%` }} />
                                </div>
                                <span className="text-xs font-mono font-semibold w-12 text-right">{s.views.toLocaleString()}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card data-testid="card-top-pages">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Most Visited Pages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {searchData.metrics.topPages.length === 0 ? (
                        <p className="text-sm text-slate-400">{t("pages.adminSeoPerformance.noPageViewDataAvailable")}</p>
                      ) : (
                        <div className="space-y-1.5">
                          {searchData.metrics.topPages.slice(0, 10).map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                              <span className="text-slate-600 truncate max-w-[70%]">{p.page}</span>
                              <span className="font-mono font-semibold text-slate-700">{p.views.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {searchData.metrics.weeklyTraffic.length > 0 && (
                  <Card data-testid="card-weekly-traffic">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Weekly Traffic Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[...searchData.metrics.weeklyTraffic].sort((a, b) => b.week.localeCompare(a.week)).map((w, i) => {
                          const max = Math.max(...searchData.metrics!.weeklyTraffic.map(x => x.views), 1);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-slate-600 w-24">{w.week}</span>
                              <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(w.views / max) * 100}%` }} />
                              </div>
                              <span className="text-xs font-mono font-semibold w-16 text-right">{w.views.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {!loading && activeTab === "coverage" && coverageData && (
          <div className="space-y-6">
            {coverageData.gaps.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50" data-testid="card-coverage-gaps">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Content Gaps Identified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {coverageData.gaps.map((gap, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-amber-700" data-testid={`gap-${i}`}>
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        {gap}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-coverage-body-systems">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Map className="w-4 h-4" /> Coverage by Body System
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coverageData.byBodySystem.length === 0 ? (
                  <p className="text-sm text-slate-400">{t("pages.adminSeoPerformance.noBodySystemDataAvailable")}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-slate-500">
                          <th className="text-left py-2 px-3">{t("pages.adminSeoPerformance.bodySystem")}</th>
                          <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.questions")}</th>
                          <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.flashcards2")}</th>
                          <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.lessons2")}</th>
                          <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.blogs")}</th>
                          <th className="text-center py-2 px-3">{t("pages.adminSeoPerformance.total2")}</th>
                          <th className="text-center py-2 px-3 w-24">{t("pages.adminSeoPerformance.coverage")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coverageData.byBodySystem.slice(0, 20).map((entry, i) => {
                          const maxTotal = Math.max(...coverageData.byBodySystem.map(e => e.total), 1);
                          return (
                            <tr key={i} className="border-b hover:bg-slate-50" data-testid={`coverage-system-${i}`}>
                              <td className="py-2 px-3 font-medium text-slate-700">{entry.value}</td>
                              <td className="text-center py-2 px-3">
                                <HeatmapCell value={entry.questions} maxValue={Math.max(...coverageData.byBodySystem.map(e => e.questions), 1)} />
                              </td>
                              <td className="text-center py-2 px-3">
                                <HeatmapCell value={entry.flashcards} maxValue={Math.max(...coverageData.byBodySystem.map(e => e.flashcards), 1)} />
                              </td>
                              <td className="text-center py-2 px-3">
                                <HeatmapCell value={entry.lessons} maxValue={Math.max(...coverageData.byBodySystem.map(e => e.lessons), 1)} />
                              </td>
                              <td className="text-center py-2 px-3">
                                <HeatmapCell value={entry.blogs} maxValue={Math.max(...coverageData.byBodySystem.map(e => e.blogs), 1)} />
                              </td>
                              <td className="text-center py-2 px-3 font-semibold">{entry.total}</td>
                              <td className="text-center py-2 px-3">
                                <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(entry.total / maxTotal) * 100}%` }} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-coverage-professions">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Coverage by Profession
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {coverageData.byProfession.length === 0 ? (
                    <p className="text-sm text-slate-400">{t("pages.adminSeoPerformance.noProfessionDataAvailable")}</p>
                  ) : (
                    <div className="space-y-2">
                      {coverageData.byProfession.map((entry, i) => {
                        const max = Math.max(...coverageData.byProfession.map(e => e.total), 1);
                        return (
                          <div key={i} className="flex items-center gap-3" data-testid={`profession-${i}`}>
                            <span className="text-xs text-slate-600 w-32 text-right truncate capitalize">{entry.value.replace(/_/g, " ")}</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(entry.total / max) * 100}%` }} />
                            </div>
                            <span className="text-xs font-mono font-semibold w-12 text-right">{entry.total.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="card-coverage-topics">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Top Topics by Question Count
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {coverageData.byTopic.length === 0 ? (
                    <p className="text-sm text-slate-400">{t("pages.adminSeoPerformance.noTopicDataAvailable")}</p>
                  ) : (
                    <div className="space-y-1.5">
                      {coverageData.byTopic.slice(0, 15).map((entry, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100" data-testid={`topic-${i}`}>
                          <span className="text-slate-600 truncate max-w-[70%]">{entry.value}</span>
                          <span className="font-mono font-semibold text-slate-700">{entry.questions.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!loading && activeTab === "weekly" && growthData && (
          <div className="space-y-6">
            <Card data-testid="card-weekly-summary">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> This Week's Content Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg" data-testid="weekly-blogs">
                    <FileText className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-purple-800">{growthData.currentWeekSummary.blogPosts}</div>
                    <div className="text-xs text-purple-600">{t("pages.adminSeoPerformance.blogPosts2")}</div>
                    <div className="mt-1">
                      <TrendIndicator current={growthData.currentWeekSummary.blogPosts} previous={growthData.previousWeekSummary.blogPosts} />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg" data-testid="weekly-lessons">
                    <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-blue-800">{growthData.currentWeekSummary.lessons}</div>
                    <div className="text-xs text-blue-600">{t("pages.adminSeoPerformance.lessons3")}</div>
                    <div className="mt-1">
                      <TrendIndicator current={growthData.currentWeekSummary.lessons} previous={growthData.previousWeekSummary.lessons} />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg" data-testid="weekly-flashcards">
                    <Layers className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-emerald-800">{growthData.currentWeekSummary.flashcards}</div>
                    <div className="text-xs text-emerald-600">{t("pages.adminSeoPerformance.flashcards3")}</div>
                    <div className="mt-1">
                      <TrendIndicator current={growthData.currentWeekSummary.flashcards} previous={growthData.previousWeekSummary.flashcards} />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg" data-testid="weekly-questions">
                    <Database className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-amber-800">{growthData.currentWeekSummary.examQuestions}</div>
                    <div className="text-xs text-amber-600">{t("pages.adminSeoPerformance.examQuestions2")}</div>
                    <div className="mt-1">
                      <TrendIndicator current={growthData.currentWeekSummary.examQuestions} previous={growthData.previousWeekSummary.examQuestions} />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{t("pages.adminSeoPerformance.totalContentCreatedThisWeek")}</h3>
                  <div className="text-4xl font-bold text-slate-800" data-testid="weekly-total">
                    {growthData.currentWeekSummary.blogPosts + growthData.currentWeekSummary.lessons + growthData.currentWeekSummary.flashcards + growthData.currentWeekSummary.examQuestions}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    items across all content types
                  </div>
                  <div className="mt-2">
                    <TrendIndicator
                      current={growthData.currentWeekSummary.blogPosts + growthData.currentWeekSummary.lessons + growthData.currentWeekSummary.flashcards + growthData.currentWeekSummary.examQuestions}
                      previous={growthData.previousWeekSummary.blogPosts + growthData.previousWeekSummary.lessons + growthData.previousWeekSummary.flashcards + growthData.previousWeekSummary.examQuestions}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {sitemapData && (
              <Card data-testid="card-weekly-sitemap-snapshot">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Current Sitemap Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sitemapData.sections.map((s, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-center ${
                          s.status === "healthy" ? "bg-white border-slate-200" : s.status === "low" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
                        }`}
                        data-testid={`snapshot-section-${i}`}
                      >
                        <div className="text-lg font-bold text-slate-800">{s.urlCount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 truncate">{s.section}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t text-center">
                    <span className="text-sm text-slate-500">{t("pages.adminSeoPerformance.totalUrls")} </span>
                    <span className="text-lg font-bold text-slate-800">{sitemapData.totalUrls.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
