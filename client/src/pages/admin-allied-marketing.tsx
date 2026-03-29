import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, FileText, Mail, Share2, Target, BookOpen, Users, TrendingUp,
  RefreshCw, ChevronDown, ChevronRight, Globe, Sparkles, CheckCircle2,
  MessageSquare, ClipboardCheck, Layers, Activity
} from "lucide-react";

interface ProfessionStats {
  label: string;
  exam: string;
  seoArticles: { total: number; published: number };
  blogPosts: number;
  seoPages: number;
  socialPosts: number;
  emailCaptures: number;
  mockExamAttempts: number;
  practiceQuestions: number;
  authorityPages: number;
  blogTopicsAvailable: number;
  socialTemplates: number;
}

interface ProgressReport {
  professions: Record<string, ProfessionStats>;
  summary: {
    totalProfessions: number;
    totalSeoClusters: number;
    totalSeoArticles: number;
    publishedArticles: number;
    totalWords: number;
    totalEmailCaptures: number;
    totalSocialPosts: number;
    totalAuthorityPages: number;
    totalBlogTopics: number;
    totalSocialTemplates: number;
  };
}

interface AnalyticsData {
  eventsByType: Array<{ event_type: string; count: number }>;
  eventsByProfession: Array<{ profession: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
  emailCaptures: number;
  emailsByProfession: Array<{ profession: string; count: number }>;
}

function StatCard({ icon: Icon, label, value, subValue, color = "indigo" }: {
  icon: any; label: string; value: string | number; subValue?: string; color?: string;
}) {
  const { t } = useI18n();
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
            {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfessionRow({ slug, stats, onGenerateBlog }: {
  slug: string; stats: ProfessionStats; onGenerateBlog: (slug: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden" data-testid={`row-profession-${slug}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
        data-testid={`button-expand-${slug}`}
      >
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{stats.label}</p>
          <p className="text-xs text-gray-500">{stats.exam}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {stats.seoArticles?.total || 0} articles
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {stats.blogPosts} blog
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {stats.emailCaptures} emails
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" />
            {stats.socialPosts} social
          </span>
          <span className="flex items-center gap-1">
            <ClipboardCheck className="w-3.5 h-3.5" />
            {stats.practiceQuestions} Qs
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-indigo-600">{stats.seoArticles?.total || 0}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.seoArticles")}</p>
              <p className="text-xs text-gray-400">{stats.seoArticles?.published || 0} published</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-emerald-600">{stats.authorityPages}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.authorityPages")}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-purple-600">{stats.blogTopicsAvailable}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.blogTopicsReady")}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-amber-600">{stats.socialTemplates}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.socialTemplates")}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-blue-600">{stats.seoPages}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.seoLandingPages")}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-rose-600">{stats.mockExamAttempts}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.mockExamAttempts")}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-teal-600">{stats.practiceQuestions}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.practiceQuestions")}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <p className="text-lg font-bold text-orange-600">{stats.emailCaptures}</p>
              <p className="text-xs text-gray-500">{t("pages.adminAlliedMarketing.emailCaptures")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onGenerateBlog(slug)}
              className="text-xs"
              data-testid={`button-generate-blog-${slug}`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Generate Blog Posts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAlliedMarketing() {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "social">("overview");

  const { data: report, isLoading: reportLoading, refetch } = useQuery<ProgressReport>({
    queryKey: ["/api/allied-marketing/progress-report"],
    queryFn: async () => {
      const res = await fetch("/api/allied-marketing/progress-report", {
        headers: { "x-admin-id": localStorage.getItem("adminId") || "" },
      });
      if (!res.ok) throw new Error("Failed to fetch report");
      return res.json();
    },
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/allied-marketing/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/allied-marketing/analytics?days=30", {
        headers: { "x-admin-id": localStorage.getItem("adminId") || "" },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: activeTab === "analytics",
  });

  const generateBlogMutation = useMutation({
    mutationFn: async (profession: string) => {
      const res = await fetch("/api/allied-marketing/generate-blog-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": localStorage.getItem("adminId") || "",
        },
        body: JSON.stringify({ profession, count: 5 }),
      });
      return res.json();
    },
    onSuccess: () => refetch(),
  });

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "analytics", label: "Analytics", icon: Activity },
    { key: "social", label: "Social & Content", icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="text-page-title">
                <Globe className="w-6 h-6 text-indigo-600" />
                Allied Health Marketing Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Progress reporting across all 8 allied health professions
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={reportLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${reportLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </header>

        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {report && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                <StatCard icon={Layers} label={t("pages.adminAlliedMarketing.professions")} value={report.summary.totalProfessions} color="indigo" />
                <StatCard icon={FileText} label={t("pages.adminAlliedMarketing.seoArticles2")} value={report.summary.totalSeoArticles} subValue={`${report.summary.publishedArticles} published`} color="emerald" />
                <StatCard icon={Mail} label={t("pages.adminAlliedMarketing.emailCaptures2")} value={report.summary.totalEmailCaptures} color="amber" />
                <StatCard icon={Share2} label={t("pages.adminAlliedMarketing.socialPosts")} value={report.summary.totalSocialPosts} color="purple" />
                <StatCard icon={Target} label={t("pages.adminAlliedMarketing.authorityPages2")} value={report.summary.totalAuthorityPages} color="blue" />
                <StatCard icon={BookOpen} label={t("pages.adminAlliedMarketing.blogTopics")} value={report.summary.totalBlogTopics} color="rose" />
                <StatCard icon={MessageSquare} label={t("pages.adminAlliedMarketing.socialTemplates2")} value={report.summary.totalSocialTemplates} color="indigo" />
                <StatCard icon={Layers} label={t("pages.adminAlliedMarketing.seoClusters")} value={report.summary.totalSeoClusters} color="emerald" />
                <StatCard icon={TrendingUp} label={t("pages.adminAlliedMarketing.totalWords")} value={report.summary.totalWords.toLocaleString()} color="purple" />
                <StatCard icon={CheckCircle2} label={t("pages.adminAlliedMarketing.published")} value={report.summary.publishedArticles} color="blue" />
              </div>
            )}

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Profession Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportLoading ? (
                  <div className="flex justify-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : report ? (
                  <div className="space-y-2">
                    {Object.entries(report.professions).map(([slug, stats]) => (
                      <ProfessionRow
                        key={slug}
                        slug={slug}
                        stats={stats}
                        onGenerateBlog={(s) => generateBlogMutation.mutate(s)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">{t("pages.adminAlliedMarketing.noDataAvailable")}</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {analyticsLoading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : analytics ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">{t("pages.adminAlliedMarketing.eventsByTypeLast30")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analytics.eventsByType.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">{t("pages.adminAlliedMarketing.noEventsRecordedYet")}</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.eventsByType.map((e, i) => (
                            <div key={i} className="flex items-center justify-between text-sm" data-testid={`analytics-event-${e.event_type}`}>
                              <span className="text-gray-700">{e.event_type}</span>
                              <Badge variant="secondary" className="text-xs">{e.count}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">{t("pages.adminAlliedMarketing.eventsByProfessionLast30")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analytics.eventsByProfession.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">{t("pages.adminAlliedMarketing.noEventsRecordedYet2")}</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.eventsByProfession.map((e, i) => (
                            <div key={i} className="flex items-center justify-between text-sm" data-testid={`analytics-profession-${e.profession}`}>
                              <span className="text-gray-700">{e.profession}</span>
                              <Badge variant="secondary" className="text-xs">{e.count}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-gray-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">{t("pages.adminAlliedMarketing.emailCapturesByProfession")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      <span className="text-2xl font-bold text-gray-900" data-testid="stat-total-emails">{analytics.emailCaptures}</span>
                      <span className="text-sm text-gray-500">{t("pages.adminAlliedMarketing.totalCaptures30Days")}</span>
                    </div>
                    {analytics.emailsByProfession.length > 0 && (
                      <div className="space-y-2">
                        {analytics.emailsByProfession.map((e, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{e.profession}</span>
                            <Badge variant="secondary" className="text-xs">{e.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-100 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">{t("pages.adminAlliedMarketing.topPagesLast30Days")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.topPages.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">{t("pages.adminAlliedMarketing.noPageDataYet")}</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics.topPages.slice(0, 15).map((p, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate max-w-xs">{p.page}</span>
                            <Badge variant="secondary" className="text-xs">{p.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">{t("pages.adminAlliedMarketing.unableToLoadAnalytics")}</p>
            )}
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-600" />
                  Social Media Content Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Social media templates are ready for all 8 professions across Instagram, TikTok, Pinterest, and LinkedIn.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {["instagram", "tiktok", "pinterest", "linkedin"].map(platform => (
                    <div key={platform} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 capitalize mb-1">{platform}</p>
                      <p className="text-xs text-gray-500">
                        {platform === "instagram" ? "Study tips, quiz questions, clinical pearls" :
                         platform === "tiktok" ? "Study tips, quick reviews" :
                         platform === "pinterest" ? "Infographics, study checklists" :
                         "Career insights, industry updates"}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {report ? Object.keys(report.professions).length * (platform === "instagram" ? 3 : platform === "pinterest" ? 2 : 2) : 0} templates
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Conversion CTAs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  A/B-ready conversion CTAs are configured for all 8 professions with multiple variant styles.
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  {["hero", "banner", "inline", "floating", "card"].map(variant => (
                    <div key={variant} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-gray-700 capitalize">{variant} variant</span>
                      <Badge variant="outline" className="ml-auto text-xs">{t("pages.adminAlliedMarketing.abReady")}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Authority Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Three authority pages per profession: Top 100 Questions, Complete Study Guide, and Ultimate Guide.
                </p>
                <div className="space-y-2">
                  {report && Object.entries(report.professions).map(([slug, stats]) => (
                    <div key={slug} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-700">{stats.label}</span>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">{t("pages.adminAlliedMarketing.top100Qs")}</Badge>
                        <Badge variant="secondary" className="text-xs">{t("pages.adminAlliedMarketing.studyGuide")}</Badge>
                        <Badge variant="secondary" className="text-xs">{t("pages.adminAlliedMarketing.ultimateGuide")}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
