import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle,
  Link2, FileX, Image, BookOpen, HelpCircle, Search,
  ArrowLeft, Wrench, ExternalLink, Globe, Map, LinkIcon,
  Activity, BarChart3, ChevronDown, ChevronUp,
} from "lucide-react";

type TabId = "overview" | "broken-links" | "missing-content" | "seo-audit" | "sitemap" | "internal-links" | "content-failover";

const SEVERITY_CONFIG = {
  critical: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle, label: "Critical" },
  warning: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: AlertTriangle, label: "Warning" },
  info: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: HelpCircle, label: "Info" },
};

const CATEGORY_LABELS: Record<string, string> = {
  broken_link: "Broken Links",
  missing_page: "Missing Pages",
  missing_image: "Missing Images",
  missing_flashcards: "Missing Flashcards",
  missing_questions: "Missing Questions",
  seo_metadata: "SEO Metadata",
  sitemap: "Sitemap",
  internal_link: "Internal Links",
};

const CATEGORY_ICONS: Record<string, any> = {
  broken_link: Link2,
  missing_page: FileX,
  missing_image: Image,
  missing_flashcards: BookOpen,
  missing_questions: HelpCircle,
  seo_metadata: Globe,
  sitemap: Map,
  internal_link: LinkIcon,
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const config = status === "healthy"
    ? { bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle, label: "Healthy" }
    : status === "warning"
    ? { bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: AlertTriangle, label: "Warning" }
    : { bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle, label: "Critical" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg}`} data-testid="badge-health-status">
      <config.icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.info;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <config.icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function IssuesList({ issues, searchTerm, onRepair }: { issues: any[]; searchTerm: string; onRepair: (id: string, action: string) => void }) {
  const { t } = useI18n();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = issues.filter(issue => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      issue.title?.toLowerCase().includes(term) ||
      issue.description?.toLowerCase().includes(term) ||
      issue.url?.toLowerCase().includes(term) ||
      issue.category?.toLowerCase().includes(term)
    );
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="text-no-issues">
        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
        <p className="font-medium">{t("pages.adminSiteHealth.noIssuesFound")}</p>
        <p className="text-sm">{t("pages.adminSiteHealth.everythingLooksGood")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="list-issues">
      {filtered.slice(0, 100).map((issue) => {
        const CategoryIcon = CATEGORY_ICONS[issue.category] || AlertTriangle;
        const isExpanded = expandedId === issue.id;

        return (
          <div
            key={issue.id}
            className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
            data-testid={`issue-item-${issue.id}`}
          >
            <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : issue.id)}>
              <CategoryIcon className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm" data-testid={`text-issue-title-${issue.id}`}>{issue.title}</span>
                  <SeverityBadge severity={issue.severity} />
                  {issue.autoFixable && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Wrench className="w-3 h-3" /> Auto-fixable
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{issue.description}</p>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>

            {isExpanded && (
              <div className="mt-3 ml-8 space-y-2 text-sm">
                {issue.url && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t("pages.adminSiteHealth.url")}</span>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{issue.url}</code>
                  </div>
                )}
                {issue.sourceUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t("pages.adminSiteHealth.source")}</span>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{issue.sourceUrl}</code>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t("pages.adminSiteHealth.detected")}</span>
                  <span>{new Date(issue.detectedAt).toLocaleString()}</span>
                </div>
                {issue.autoFixable && issue.fixAction && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1"
                    onClick={(e) => { e.stopPropagation(); onRepair(issue.id, issue.fixAction); }}
                    data-testid={`button-repair-${issue.id}`}
                  >
                    <Wrench className="w-3 h-3 mr-1" /> Auto-Repair
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {filtered.length > 100 && (
        <p className="text-center text-sm text-muted-foreground py-2">
          Showing first 100 of {filtered.length} issues
        </p>
      )}
    </div>
  );
}

function OverviewTab({ data, isLoading, onRepairAll, isRepairing }: { data: any; isLoading: boolean; onRepairAll: () => void; isRepairing: boolean }) {
  const { t } = useI18n();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-overview">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>{t("pages.adminSiteHealth.scanningSiteHealth")}</span>
      </div>
    );
  }

  if (!data) return null;

  const { overallStatus, summary, categoryCounts, contentStats } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatusBadge status={overallStatus} />
          <span className="text-sm text-muted-foreground">
            Last scan: {new Date(data.generatedAt).toLocaleString()}
          </span>
        </div>
        {summary.autoFixable > 0 && (
          <Button
            onClick={onRepairAll}
            disabled={isRepairing}
            variant="outline"
            size="sm"
            data-testid="button-repair-all"
          >
            {isRepairing ? <RefreshCw className="w-4 h-4 animate-spin mr-1" /> : <Wrench className="w-4 h-4 mr-1" />}
            Auto-Repair All ({summary.autoFixable})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-issues">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-issues">{summary.totalIssues}</p>
                <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.totalIssues")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-critical-issues">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600" data-testid="text-critical-count">{summary.critical}</p>
                <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.critical")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-warning-issues">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-warning-count">{summary.warnings}</p>
                <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.warnings")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-info-issues">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600" data-testid="text-info-count">{summary.info}</p>
                <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.info")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold" data-testid="text-published-lessons">{contentStats.publishedLessons}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.publishedLessons")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold" data-testid="text-published-questions">{contentStats.publishedQuestions}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.publishedQuestions")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold" data-testid="text-flashcard-decks">{contentStats.publishedFlashcardDecks}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.flashcardDecks")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold" data-testid="text-blog-posts">{contentStats.publishedBlogPosts}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.blogPosts")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold" data-testid="text-sitemap-urls">{contentStats.totalSitemapUrls.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.sitemapUrls")}</p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(categoryCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminSiteHealth.issuesByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(categoryCounts).map(([category, count]) => {
                const Icon = CATEGORY_ICONS[category] || AlertTriangle;
                return (
                  <div key={category} className="flex items-center gap-2 p-2 border rounded-lg" data-testid={`category-count-${category}`}>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{count as number}</p>
                      <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[category] || category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SeoAuditTab() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["site-health-seo"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/site-health/seo-audit");
      if (!res.ok) throw new Error("Failed to load SEO audit");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>{t("pages.adminSiteHealth.runningSeoAudit")}</span>
      </div>
    );
  }

  if (!data) return null;

  const scoreColor = data.score >= 90 ? "text-green-600" : data.score >= 70 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className={`text-3xl font-bold ${scoreColor}`} data-testid="text-seo-score">{data.score}%</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.seoHealthScore")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold" data-testid="text-seo-total">{data.totalPages}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.pagesAudited")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold text-green-600" data-testid="text-seo-ok">{data.pagesOk}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.pagesOk")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-xl font-bold text-red-600" data-testid="text-seo-issues">{data.pagesWithIssues}</p>
            <p className="text-xs text-muted-foreground">{t("pages.adminSiteHealth.pagesWithIssues")}</p>
          </CardContent>
        </Card>
      </div>

      {data.audit && data.audit.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.adminSiteHealth.pageAuditDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-seo-audit">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-2">{t("pages.adminSiteHealth.page")}</th>
                    <th className="py-2 px-2 text-center">{t("pages.adminSiteHealth.title")}</th>
                    <th className="py-2 px-2 text-center">{t("pages.adminSiteHealth.description")}</th>
                    <th className="py-2 px-2 text-center">{t("pages.adminSiteHealth.canonical")}</th>
                    <th className="py-2 px-2 text-center">OG</th>
                    <th className="py-2 px-2">{t("pages.adminSiteHealth.issues")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.audit.filter((a: any) => a.issues.length > 0).slice(0, 50).map((entry: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-accent/50">
                      <td className="py-2 px-2 max-w-[200px] truncate">
                        <code className="text-xs">{entry.path}</code>
                      </td>
                      <td className="py-2 px-2 text-center">
                        {entry.hasTitle ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {entry.hasDescription ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {entry.hasCanonical ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {entry.hasOgTitle ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                      </td>
                      <td className="py-2 px-2">
                        <div className="space-y-0.5">
                          {entry.issues.map((issue: string, i: number) => (
                            <p key={i} className="text-xs text-red-600">{issue}</p>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InternalLinksTab() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["site-health-internal-links"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/site-health/internal-links");
      if (!res.ok) throw new Error("Failed to load internal link suggestions");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>{t("pages.adminSiteHealth.analyzingInternalLinks")}</span>
      </div>
    );
  }

  if (!data || !data.suggestions?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <LinkIcon className="w-12 h-12 mx-auto mb-2" />
        <p className="font-medium">{t("pages.adminSiteHealth.noSuggestions")}</p>
        <p className="text-sm">{t("pages.adminSiteHealth.internalLinkingStructureLooksComplete")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Found {data.totalSuggestions} cross-link opportunities between lessons, flashcards, blog posts, and question topics.
      </p>
      <div className="space-y-2" data-testid="list-internal-links">
        {data.suggestions.slice(0, 50).map((s: any, idx: number) => (
          <div key={idx} className="border rounded-lg p-3 hover:bg-accent/50" data-testid={`link-suggestion-${idx}`}>
            <div className="flex items-start gap-3">
              <LinkIcon className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span className="font-medium">{s.sourceTitle}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{s.targetTitle}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="px-1.5 py-0.5 bg-muted rounded">{s.sourceType}</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 bg-muted rounded">{s.targetType}</span>
                  <span className="ml-2">{s.reason}</span>
                  <span className="ml-auto font-medium">Score: {s.score}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentFailoverTab() {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const { data: failoverStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["content-failover-stats"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/content-failover/stats");
      if (!res.ok) throw new Error("Failed to load failover stats");
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const { data: brokenContent } = useQuery({
    queryKey: ["content-failover-broken"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/content-failover/broken-content");
      if (!res.ok) throw new Error("Failed to load broken content");
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const generateAllMutation = useMutation({
    mutationFn: async () => {
      setGenerating(true);
      const res = await adminFetch("/api/admin/content-failover/generate-all", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate payloads");
      return res.json();
    },
    onSuccess: () => {
      setGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["content-failover-stats"] });
    },
    onError: () => setGenerating(false),
  });

  const regenerateMutation = useMutation({
    mutationFn: async (contentId: string) => {
      setRegeneratingId(contentId);
      const res = await adminFetch("/api/admin/content-failover/generate-payloads", {
        method: "POST",
        body: { contentId },
      });
      if (!res.ok) throw new Error("Failed to regenerate payload");
      return res.json();
    },
    onSuccess: () => {
      setRegeneratingId(null);
      queryClient.invalidateQueries({ queryKey: ["content-failover-stats"] });
      queryClient.invalidateQueries({ queryKey: ["content-failover-broken"] });
    },
    onError: () => setRegeneratingId(null),
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="loading-failover">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading failover data...</span>
      </div>
    );
  }

  const coverage = failoverStats?.coverage || { publishedItems: 0, itemsWithPayloads: 0, coveragePercent: 0 };
  const fallbacks = failoverStats?.fallbacks || { total: "0", last24h: "0", last7d: "0" };
  const substitutions = failoverStats?.substitutions || { total: "0", last24h: "0", last7d: "0" };

  return (
    <div className="space-y-6" data-testid="content-failover-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Content Failover & Backup Pipeline
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchStats()}
            data-testid="button-refresh-failover"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => generateAllMutation.mutate()}
            disabled={generating}
            data-testid="button-generate-all-payloads"
          >
            {generating ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Shield className="w-4 h-4 mr-1" />}
            {generating ? "Generating..." : "Generate All Payloads"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card data-testid="card-payload-coverage">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-coverage-percent">{coverage.coveragePercent}%</p>
                <p className="text-xs text-muted-foreground">Payload Coverage</p>
                <p className="text-xs text-muted-foreground">{coverage.itemsWithPayloads}/{coverage.publishedItems} items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-fallback-events">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-fallback-total">{fallbacks.last7d}</p>
                <p className="text-xs text-muted-foreground">Fallback Events (7d)</p>
                <p className="text-xs text-muted-foreground">{fallbacks.last24h} in last 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-substitution-events">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-substitution-total">{substitutions.last7d}</p>
                <p className="text-xs text-muted-foreground">Substitutions (7d)</p>
                <p className="text-xs text-muted-foreground">{substitutions.last24h} in last 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-total-fallbacks">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-fallbacks">{fallbacks.total}</p>
                <p className="text-xs text-muted-foreground">Total Fallback Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {failoverStats?.fallbackByTier && failoverStats.fallbackByTier.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fallback Usage by Tier (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {failoverStats.fallbackByTier.map((tier: any) => (
                <div key={tier.fallbackTier} className="flex items-center justify-between p-2 border rounded" data-testid={`fallback-tier-${tier.fallbackTier}`}>
                  <span className="text-sm font-medium">{tier.fallbackTier?.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold">{tier.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {brokenContent && brokenContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Broken Content (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {brokenContent.map((item: any) => (
                <div key={item.contentId} className="flex items-center justify-between p-3 border rounded hover:bg-accent/50" data-testid={`broken-content-${item.contentId}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title || item.contentId}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>Slug: {item.slug || "N/A"}</span>
                      <span>Failures: {item.failureCount}</span>
                      <span>Last: {item.lastReason}</span>
                      <span>Worst: {item.worstFallback?.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateMutation.mutate(item.contentId)}
                    disabled={regeneratingId === item.contentId}
                    data-testid={`button-regenerate-${item.contentId}`}
                  >
                    {regeneratingId === item.contentId ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wrench className="w-3 h-3 mr-1" />
                    )}
                    Regenerate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {failoverStats?.recentFallbacks && failoverStats.recentFallbacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Fallback Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {failoverStats.recentFallbacks.slice(0, 10).map((event: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-2 text-sm border-b last:border-0" data-testid={`recent-fallback-${idx}`}>
                  <span className="text-muted-foreground w-36 shrink-0">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                  <span className="font-mono text-xs truncate flex-1">{event.contentId || "N/A"}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {event.fallbackTier?.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-48">{event.failureReason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!brokenContent || brokenContent.length === 0) && (!failoverStats?.recentFallbacks || failoverStats.recentFallbacks.length === 0) && (
        <div className="text-center py-8 text-muted-foreground" data-testid="text-no-failover-issues">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p className="font-medium">No Content Failover Issues</p>
          <p className="text-sm">All content is being served successfully without fallbacks.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminSiteHealth() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: overviewData, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["site-health-overview"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/site-health/overview");
      if (!res.ok) throw new Error("Failed to load site health");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const repairMutation = useMutation({
    mutationFn: async ({ issueId, fixAction }: { issueId: string; fixAction: string }) => {
      const res = await adminFetch("/api/admin/site-health/auto-repair", {
        method: "POST",
        body: { issueId, fixAction },
      });
      if (!res.ok) throw new Error("Repair failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-health-overview"] });
    },
  });

  const repairAllMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/site-health/auto-repair-all", { method: "POST" });
      if (!res.ok) throw new Error("Bulk repair failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-health-overview"] });
    },
  });

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "broken-links", label: "Broken Links", icon: Link2 },
    { id: "missing-content", label: "Missing Content", icon: FileX },
    { id: "seo-audit", label: "SEO Audit", icon: Globe },
    { id: "sitemap", label: "Sitemap", icon: Map },
    { id: "internal-links", label: "Internal Links", icon: LinkIcon },
    { id: "content-failover", label: "Content Failover", icon: Shield },
  ];

  const filteredIssues = (category?: string) => {
    if (!overviewData?.issues) return [];
    if (category) return overviewData.issues.filter((i: any) => i.category === category);
    return overviewData.issues;
  };

  const handleRepair = (issueId: string, fixAction: string) => {
    repairMutation.mutate({ issueId, fixAction });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl" data-testid="page-admin-site-health">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
            <Shield className="w-7 h-7 text-blue-600" />
            Site Health & Integrity
          </h1>
          <p className="text-sm text-muted-foreground">{t("pages.adminSiteHealth.monitorBrokenLinksContentGaps")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchOverview()}
          disabled={overviewLoading}
          data-testid="button-refresh"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${overviewLoading ? "animate-spin" : ""}`} />
          Scan
        </Button>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto border-b pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            }`}
            data-testid={`tab-${tab.id}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {overviewData?.categoryCounts && tab.id !== "overview" && tab.id !== "internal-links" && (
              (() => {
                const catMap: Record<string, string[]> = {
                  "broken-links": ["broken_link"],
                  "missing-content": ["missing_page", "missing_flashcards", "missing_questions", "missing_image"],
                  "seo-audit": ["seo_metadata"],
                  "sitemap": ["sitemap"],
                };
                const cats = catMap[tab.id] || [];
                const count = cats.reduce((acc, cat) => acc + (overviewData.categoryCounts[cat] || 0), 0);
                return count > 0 ? (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                    {count}
                  </span>
                ) : null;
              })()
            )}
          </button>
        ))}
      </div>

      {activeTab !== "overview" && activeTab !== "seo-audit" && activeTab !== "internal-links" && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("pages.adminSiteHealth.searchIssues")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <OverviewTab
          data={overviewData}
          isLoading={overviewLoading}
          onRepairAll={() => repairAllMutation.mutate()}
          isRepairing={repairAllMutation.isPending}
        />
      )}

      {activeTab === "broken-links" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="w-5 h-5" /> Broken Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <IssuesList
                issues={filteredIssues("broken_link")}
                searchTerm={searchTerm}
                onRepair={handleRepair}
              />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "missing-content" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileX className="w-5 h-5" /> Missing Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <IssuesList
                issues={[
                  ...filteredIssues("missing_page"),
                  ...filteredIssues("missing_flashcards"),
                  ...filteredIssues("missing_questions"),
                  ...filteredIssues("missing_image"),
                ]}
                searchTerm={searchTerm}
                onRepair={handleRepair}
              />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "seo-audit" && <SeoAuditTab />}

      {activeTab === "sitemap" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Map className="w-5 h-5" /> Sitemap Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <IssuesList
                issues={filteredIssues("sitemap")}
                searchTerm={searchTerm}
                onRepair={handleRepair}
              />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "internal-links" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5" /> Internal Link Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InternalLinksTab />
          </CardContent>
        </Card>
      )}

      {activeTab === "content-failover" && <ContentFailoverTab />}
    </div>
  );
}
