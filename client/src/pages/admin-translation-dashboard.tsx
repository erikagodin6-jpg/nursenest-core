import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Globe, AlertTriangle, CheckCircle2, Languages, Search,
  RefreshCw, Download, Eye, ChevronDown, ChevronUp,
  Filter, BarChart3, Play, FileText, Shield, XCircle,
  ArrowLeft, X, MapPin, ExternalLink, BookOpen, Loader2,
  Edit3, Save, Clock, Flag, Key
} from "lucide-react";

const LOCALES = [
  { code: "fr", name: "French", flag: "\ud83c\uddeb\ud83c\uddf7" },
  { code: "es", name: "Spanish", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "fil", name: "Filipino", flag: "\ud83c\uddf5\ud83c\udded" },
  { code: "hi", name: "Hindi", flag: "\ud83c\uddee\ud83c\uddf3" },
  { code: "zh", name: "Chinese", flag: "\ud83c\udde8\ud83c\uddf3" },
  { code: "ar", name: "Arabic", flag: "\ud83c\uddf8\ud83c\udde6" },
  { code: "ko", name: "Korean", flag: "\ud83c\uddf0\ud83c\uddf7" },
  { code: "pt", name: "Portuguese", flag: "\ud83c\udde7\ud83c\uddf7" },
  { code: "pa", name: "Punjabi", flag: "\ud83c\udde8\ud83c\udde6" },
  { code: "vi", name: "Vietnamese", flag: "\ud83c\uddfb\ud83c\uddf3" },
  { code: "ht", name: "Haitian Creole", flag: "\ud83c\udded\ud83c\uddf9" },
  { code: "ur", name: "Urdu", flag: "\ud83c\uddf5\ud83c\uddf0" },
  { code: "ja", name: "Japanese", flag: "\ud83c\uddef\ud83c\uddf5" },
  { code: "fa", name: "Farsi", flag: "\ud83c\uddee\ud83c\uddf7" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  fully_translated: { label: "Fully Translated", color: "bg-green-100 text-green-700 border-green-200" },
  ready_for_indexing: { label: "Ready for Indexing", color: "bg-blue-100 text-blue-700 border-blue-200" },
  partial: { label: "Partial", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  draft: { label: "Draft", color: "bg-red-100 text-red-700 border-red-200" },
};

const ISSUE_TYPE_LABELS: Record<string, string> = {
  missing: "Missing",
  fallback_english: "English Fallback",
  mixed_language: "Mixed Language",
  placeholder: "Placeholder",
  duplicate_source: "Duplicate",
  unresolved_key: "Unresolved Key",
};

type AuditItem = {
  id: string;
  contentId: string;
  contentType: string;
  url: string | null;
  locale: string;
  translationPct: number;
  status: string;
  issueCount: number;
  issueBreakdown: Record<string, number>;
  sitemapEligible: boolean;
  noindex: boolean;
  adminOverride: boolean;
  lastScannedAt: string;
};

type DashboardSummary = {
  totalAudits: number;
  totalLocales: number;
  totalContentTypes: number;
  totalIssues: number;
  avgPct: number;
  fullyTranslated: number;
  readyForIndexing: number;
  partial: number;
  draftCount: number;
  sitemapEligible: number;
  noindexCount: number;
  byLocale: {
    locale: string;
    total: number;
    avgPct: number;
    issueCount: number;
    fullyTranslated: number;
    readyForIndexing: number;
    partial: number;
    draftCount: number;
  }[];
  byContentType: {
    contentType: string;
    total: number;
    avgPct: number;
    issueCount: number;
  }[];
};

type AuditDetail = AuditItem & {
  issues: {
    id: string;
    fieldName: string;
    sourceValue: string | null;
    localizedValue: string | null;
    issueType: string;
    category: string;
    status: string;
  }[];
};

type MissingKeyEntry = {
  key: string;
  count: number;
  lastReported: number;
};

type FlaggedItem = {
  id: string;
  fieldName: string;
  sourceValue: string | null;
  localizedValue: string | null;
  issueType: string;
  category: string;
  contentId: string;
  contentType: string;
  locale: string;
  url: string | null;
  translationPct: number;
};

type StaleItem = {
  id: string;
  contentType: string;
  contentId: string;
  languageCode: string;
  fieldName: string;
  translatedText: string;
  sourceHash: string;
  currentSourceHash: string;
  currentSource: string;
  translationStatus: string;
  lastUpdated: string;
};

type TabKey = "overview" | "audits" | "detail" | "exam_questions" | "missing_keys" | "flagged" | "stale" | "completeness";

export default function AdminTranslationDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [audits, setAudits] = useState<AuditItem[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedDetail, setSelectedDetail] = useState<AuditDetail | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [filterLocale, setFilterLocale] = useState("");
  const [filterContentType, setFilterContentType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterSitemap, setFilterSitemap] = useState("");
  const [filterNoindex, setFilterNoindex] = useState("");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [indexingThreshold, setIndexingThreshold] = useState(95);

  const isAdmin = user?.tier === "admin";

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterLocale) params.set("locale", filterLocale);
      if (filterContentType) params.set("contentType", filterContentType);
      if (filterStatus) params.set("status", filterStatus);
      if (filterSearch) params.set("search", filterSearch);
      if (filterSitemap) params.set("sitemapEligible", filterSitemap);
      if (filterNoindex) params.set("noindex", filterNoindex);
      params.set("limit", "50");
      params.set("offset", String(page * 50));

      const res = await adminFetch(`/api/admin/translation-audit/dashboard?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAudits(data.audits || []);
        setSummary(data.summary || null);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [filterLocale, filterContentType, filterStatus, filterSearch, filterSitemap, filterNoindex, page]);

  useEffect(() => {
    if (isAdmin) fetchDashboard();
  }, [isAdmin, fetchDashboard]);

  const runAudit = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await adminFetch("/api/admin/translation-audit/run", {
        method: "POST",
        body: { indexingThreshold },
      });
      if (res.ok) {
        const result = await res.json();
        setScanResult(result);
        fetchDashboard();
      }
    } catch (e) {
      console.error(e);
    }
    setScanning(false);
  };

  const viewDetail = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/translation-audit/${id}`);
      if (res.ok) {
        const detail = await res.json();
        setSelectedDetail(detail);
        setActiveTab("detail");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleOverride = async (id: string, field: string, value: boolean) => {
    try {
      await adminFetch(`/api/admin/translation-audit/${id}`, {
        method: "PATCH",
        body: { [field]: value, adminOverride: true },
      });
      fetchDashboard();
      if (selectedDetail?.id === id) {
        setSelectedDetail({ ...selectedDetail, [field]: value, adminOverride: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.size === 0) return;
    try {
      await adminFetch("/api/admin/translation-audit/bulk", {
        method: "POST",
        body: { ids: Array.from(selectedIds), action },
      });
      setSelectedIds(new Set());
      fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    const params = new URLSearchParams();
    if (filterLocale) params.set("locale", filterLocale);
    if (filterContentType) params.set("contentType", filterContentType);
    if (filterStatus) params.set("status", filterStatus);

    const res = await adminFetch(`/api/admin/translation-audit/export/${format}?${params.toString()}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `translation-audit.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === audits.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(audits.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">{t("pages.adminTranslationDashboard.accessDenied")}</h1>
          <p className="text-gray-600 mt-2">{t("pages.adminTranslationDashboard.adminAccessRequired")}</p>
        </div>
      </div>
    );
  }

  const contentTypes = summary?.byContentType?.map(ct => ct.contentType) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO title={t("pages.adminTranslationDashboard.translationCoverageAdmin")} description={t("pages.adminTranslationDashboard.auditTranslationCompletenessAcrossAll")} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminTranslationDashboard.translationCoverageDashboard")}</h1>
            <p className="text-gray-600 mt-1">Audit translation completeness across {LOCALES.length} locales</p>
          </div>
          <div className="flex gap-2">
            <Button
              data-testid="button-run-audit"
              onClick={runAudit}
              disabled={scanning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {scanning ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> {t("pages.adminTranslationDashboard.scanning")}</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> {t("pages.adminTranslationDashboard.runFullTranslationAudit")}</>
              )}
            </Button>
            <Button variant="outline" onClick={() => handleExport("csv")} data-testid="button-export-csv">
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("json")} data-testid="button-export-json">
              <Download className="w-4 h-4 mr-2" /> JSON
            </Button>
          </div>
        </div>

        {scanResult && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between" data-testid="text-scan-result">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Scan complete: {scanResult.totalAudits} items audited in {(scanResult.scanDurationMs / 1000).toFixed(1)}s
                {scanResult.summary?.totalIssues > 0 && ` - ${scanResult.summary.totalIssues} issues found`}
              </span>
            </div>
            <button onClick={() => setScanResult(null)} className="text-green-600 hover:text-green-800"><X className="w-4 h-4" /></button>
          </div>
        )}

        {activeTab === "detail" && selectedDetail ? (
          <DetailInspector
            detail={selectedDetail}
            onBack={() => { setActiveTab("audits"); setSelectedDetail(null); }}
            onToggleOverride={toggleOverride}
            onRefresh={fetchDashboard}
          />
        ) : (
          <>
            <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border overflow-x-auto">
              {([
                { key: "overview" as TabKey, label: "Overview", icon: BarChart3 },
                { key: "audits" as TabKey, label: "Audit Results", icon: FileText },
                { key: "missing_keys" as TabKey, label: "Missing UI Keys", icon: Key },
                { key: "flagged" as TabKey, label: "Flagged Content", icon: Flag },
                { key: "stale" as TabKey, label: "Stale Translations", icon: Clock },
                { key: "completeness" as TabKey, label: "Content Completeness", icon: Shield },
                { key: "exam_questions" as TabKey, label: "Exam Questions", icon: BookOpen },
              ]).map(tab => (
                <button
                  key={tab.key}
                  data-testid={`tab-${tab.key}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && summary && (
              <OverviewTab summary={summary} onViewAudits={(locale) => {
                setFilterLocale(locale);
                setActiveTab("audits");
              }} />
            )}

            {activeTab === "overview" && !summary && !loading && (
              <div className="text-center py-16">
                <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{t("pages.adminTranslationDashboard.noAuditDataYet")}</h2>
                <p className="text-gray-500 mb-6">{t("pages.adminTranslationDashboard.runAFullTranslationAudit")}</p>
                <Button onClick={runAudit} disabled={scanning} data-testid="button-run-first-audit">
                  <Play className="w-4 h-4 mr-2" /> Run First Audit
                </Button>
              </div>
            )}

            {activeTab === "missing_keys" && <MissingKeysTab />}

            {activeTab === "flagged" && <FlaggedContentTab />}

            {activeTab === "stale" && <StaleTranslationsTab />}

            {activeTab === "completeness" && <ContentCompletenessTab />}

            {activeTab === "exam_questions" && (
              <ExamQuestionCoverageTab />
            )}

            {activeTab === "audits" && (
              <AuditsTab
                audits={audits}
                total={total}
                loading={loading}
                page={page}
                setPage={setPage}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={toggleSelectAll}
                onViewDetail={viewDetail}
                onBulkAction={handleBulkAction}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filterLocale={filterLocale}
                setFilterLocale={(v) => { setFilterLocale(v); setPage(0); }}
                filterContentType={filterContentType}
                setFilterContentType={(v) => { setFilterContentType(v); setPage(0); }}
                filterStatus={filterStatus}
                setFilterStatus={(v) => { setFilterStatus(v); setPage(0); }}
                filterSearch={filterSearch}
                setFilterSearch={(v) => { setFilterSearch(v); setPage(0); }}
                filterSitemap={filterSitemap}
                setFilterSitemap={(v) => { setFilterSitemap(v); setPage(0); }}
                filterNoindex={filterNoindex}
                setFilterNoindex={(v) => { setFilterNoindex(v); setPage(0); }}
                contentTypes={contentTypes}
                indexingThreshold={indexingThreshold}
                setIndexingThreshold={setIndexingThreshold}
              />
            )}
          </>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ summary, onViewAudits }: { summary: DashboardSummary; onViewAudits: (locale: string) => void }) {
  return (
    <div className="space-y-6">
      {summary.byLocale && summary.byLocale.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.byLocale.map(loc => {
            const locale = LOCALES.find(l => l.code === loc.locale);
            const missingItems = loc.total - loc.fullyTranslated;
            return (
              <div
                key={loc.locale}
                className={`p-4 rounded-lg border-2 ${
                  loc.avgPct >= 95 ? "border-green-200 bg-green-50" :
                  loc.avgPct >= 50 ? "border-yellow-200 bg-yellow-50" :
                  "border-red-200 bg-red-50"
                }`}
                data-testid={`health-card-${loc.locale}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">
                    {locale?.flag} {locale?.name || loc.locale}
                  </span>
                  <span className={`text-lg font-bold ${
                    loc.avgPct >= 95 ? "text-green-700" : loc.avgPct >= 50 ? "text-yellow-700" : "text-red-700"
                  }`}>
                    {loc.avgPct}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {loc.avgPct >= 100 ? "Fully translated" : `${missingItems} missing items`}
                  {loc.issueCount > 0 && ` \u00b7 ${loc.issueCount} issues`}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${
                      loc.avgPct >= 95 ? "bg-green-500" : loc.avgPct >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, loc.avgPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard label={t("pages.adminTranslationDashboard.totalLocales")} value={summary.totalLocales} icon={<Globe className="w-5 h-5 text-blue-500" />} testId="stat-locales" />
        <StatCard label={t("pages.adminTranslationDashboard.itemsAudited")} value={summary.totalAudits} icon={<FileText className="w-5 h-5 text-indigo-500" />} testId="stat-audited" />
        <StatCard label={t("pages.adminTranslationDashboard.avgCoverage")} value={`${summary.avgPct || 0}%`} icon={<BarChart3 className="w-5 h-5 text-green-500" />} testId="stat-avg-pct" />
        <StatCard label={t("pages.adminTranslationDashboard.totalIssues")} value={summary.totalIssues} icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} testId="stat-issues" />
        <StatCard label={t("pages.adminTranslationDashboard.sitemapReady")} value={summary.sitemapEligible} icon={<MapPin className="w-5 h-5 text-green-500" />} testId="stat-sitemap" />
        <StatCard label={t("pages.adminTranslationDashboard.noindex6")} value={summary.noindexCount} icon={<XCircle className="w-5 h-5 text-red-500" />} testId="stat-noindex" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatusCard label={t("pages.adminTranslationDashboard.fullyTranslated2")} count={summary.fullyTranslated} color="bg-green-500" testId="status-full" />
        <StatusCard label={t("pages.adminTranslationDashboard.readyForIndexing2")} count={summary.readyForIndexing} color="bg-blue-500" testId="status-ready" />
        <StatusCard label={t("pages.adminTranslationDashboard.partial2")} count={summary.partial} color="bg-yellow-500" testId="status-partial" />
        <StatusCard label={t("pages.adminTranslationDashboard.draft2")} count={summary.draftCount} color="bg-red-500" testId="status-draft" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Languages className="w-5 h-5" /> {t("pages.adminTranslationDashboard.perlocaleSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-3">{t("pages.adminTranslationDashboard.locale")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.items")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.avg")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.issues")}</th>
                  <th className="py-2 px-3">{t("pages.adminTranslationDashboard.statusBreakdown")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.coverage")}</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {(summary.byLocale || []).map(loc => {
                  const locale = LOCALES.find(l => l.code === loc.locale);
                  return (
                    <tr key={loc.locale} className="border-b hover:bg-gray-50" data-testid={`row-locale-${loc.locale}`}>
                      <td className="py-2 px-3 font-medium">
                        <span className="mr-2">{locale?.flag}</span>
                        {locale?.name || loc.locale}
                      </td>
                      <td className="py-2 px-3 text-center">{loc.total}</td>
                      <td className="py-2 px-3 text-center font-medium">{loc.avgPct}%</td>
                      <td className="py-2 px-3 text-center">
                        {loc.issueCount > 0 ? (
                          <Badge variant="destructive" className="text-xs">{loc.issueCount}</Badge>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          {loc.fullyTranslated > 0 && <Badge className="text-xs bg-green-100 text-green-700 border-green-200">{loc.fullyTranslated}</Badge>}
                          {loc.readyForIndexing > 0 && <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">{loc.readyForIndexing}</Badge>}
                          {loc.partial > 0 && <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">{loc.partial}</Badge>}
                          {loc.draftCount > 0 && <Badge className="text-xs bg-red-100 text-red-700 border-red-200">{loc.draftCount}</Badge>}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                loc.avgPct >= 95 ? "bg-green-500" : loc.avgPct >= 50 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, loc.avgPct)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Button size="sm" variant="ghost" onClick={() => onViewAudits(loc.locale)} data-testid={`button-view-${loc.locale}`}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("pages.adminTranslationDashboard.percontentTypeBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(summary.byContentType || []).map(ct => (
              <div key={ct.contentType} className="p-4 border rounded-lg" data-testid={`card-content-type-${ct.contentType}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm capitalize">{ct.contentType.replace(/_/g, " ")}</span>
                  <Badge variant="outline" className="text-xs">{ct.total} items</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${ct.avgPct >= 95 ? "bg-green-500" : ct.avgPct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, ct.avgPct)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{ct.avgPct}%</span>
                </div>
                {ct.issueCount > 0 && (
                  <p className="text-xs text-amber-600 mt-1">{ct.issueCount} issues</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditsTab({
  audits, total, loading, page, setPage, selectedIds, toggleSelect, toggleSelectAll,
  onViewDetail, onBulkAction, showFilters, setShowFilters,
  filterLocale, setFilterLocale, filterContentType, setFilterContentType,
  filterStatus, setFilterStatus, filterSearch, setFilterSearch,
  filterSitemap, setFilterSitemap, filterNoindex, setFilterNoindex,
  contentTypes, indexingThreshold, setIndexingThreshold,
}: {
  audits: AuditItem[];
  total: number;
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  onViewDetail: (id: string) => void;
  onBulkAction: (action: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  filterLocale: string;
  setFilterLocale: (v: string) => void;
  filterContentType: string;
  setFilterContentType: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  filterSearch: string;
  setFilterSearch: (v: string) => void;
  filterSitemap: string;
  setFilterSitemap: (v: string) => void;
  filterNoindex: string;
  setFilterNoindex: (v: string) => void;
  contentTypes: string[];
  indexingThreshold: number;
  setIndexingThreshold: (v: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              data-testid="input-search"
              placeholder={t("pages.adminTranslationDashboard.searchByUrlContentId")}
              className="pl-9 w-80"
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} data-testid="button-toggle-filters">
            <Filter className="w-4 h-4 mr-1" />
            Filters
            {showFilters ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span data-testid="text-total-results">{total} results</span>
          <span>|</span>
          <span>Page {page + 1} of {Math.ceil(total / 50) || 1}</span>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.locale2")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterLocale} onChange={e => setFilterLocale(e.target.value)} data-testid="filter-locale">
                <option value="">{t("pages.adminTranslationDashboard.allLocales")}</option>
                {LOCALES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.contentType")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterContentType} onChange={e => setFilterContentType(e.target.value)} data-testid="filter-content-type">
                <option value="">{t("pages.adminTranslationDashboard.allTypes")}</option>
                {contentTypes.map(ct => <option key={ct} value={ct}>{ct.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.status")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} data-testid="filter-status">
                <option value="">{t("pages.adminTranslationDashboard.allStatuses")}</option>
                <option value="fully_translated">{t("pages.adminTranslationDashboard.fullyTranslated")}</option>
                <option value="ready_for_indexing">{t("pages.adminTranslationDashboard.readyForIndexing")}</option>
                <option value="partial">{t("pages.adminTranslationDashboard.partial")}</option>
                <option value="draft">{t("pages.adminTranslationDashboard.draft")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.sitemap")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterSitemap} onChange={e => setFilterSitemap(e.target.value)} data-testid="filter-sitemap">
                <option value="">{t("pages.adminTranslationDashboard.any")}</option>
                <option value="true">{t("pages.adminTranslationDashboard.eligible")}</option>
                <option value="false">{t("pages.adminTranslationDashboard.notEligible")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.noindex")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterNoindex} onChange={e => setFilterNoindex(e.target.value)} data-testid="filter-noindex">
                <option value="">{t("pages.adminTranslationDashboard.any2")}</option>
                <option value="true">{t("pages.adminTranslationDashboard.noindex2")}</option>
                <option value="false">{t("pages.adminTranslationDashboard.indexed")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.indexingThreshold")}</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={indexingThreshold}
                onChange={e => setIndexingThreshold(Number(e.target.value))}
                className="text-sm"
                data-testid="input-threshold"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => {
              setFilterLocale(""); setFilterContentType(""); setFilterStatus("");
              setFilterSearch(""); setFilterSitemap(""); setFilterNoindex("");
            }} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-800">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => onBulkAction("mark_draft")} data-testid="bulk-mark-draft">{t("pages.adminTranslationDashboard.markDraft")}</Button>
          <Button size="sm" variant="outline" onClick={() => onBulkAction("mark_ready")} data-testid="bulk-mark-ready">{t("pages.adminTranslationDashboard.markReady")}</Button>
          <Button size="sm" variant="outline" onClick={() => onBulkAction("remove_sitemap")} data-testid="bulk-remove-sitemap">{t("pages.adminTranslationDashboard.removeSitemap")}</Button>
          <Button size="sm" variant="outline" onClick={() => onBulkAction("apply_noindex")} data-testid="bulk-apply-noindex">{t("pages.adminTranslationDashboard.applyNoindex")}</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} data-testid="bulk-clear">
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-2 px-3 text-left">
                    <input type="checkbox" checked={selectedIds.size === audits.length && audits.length > 0} onChange={toggleSelectAll} data-testid="checkbox-select-all" />
                  </th>
                  <th className="py-2 px-3 text-left">{t("pages.adminTranslationDashboard.content")}</th>
                  <th className="py-2 px-3 text-left">{t("pages.adminTranslationDashboard.type")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.locale3")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.coverage2")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.status2")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.issues2")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.sitemap2")}</th>
                  <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.noindex3")}</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {audits.map(audit => {
                  const locale = LOCALES.find(l => l.code === audit.locale);
                  const statusInfo = STATUS_LABELS[audit.status] || STATUS_LABELS.draft;
                  return (
                    <tr key={audit.id} className={`border-b hover:bg-gray-50 ${selectedIds.has(audit.id) ? "bg-blue-50" : ""}`} data-testid={`row-audit-${audit.id}`}>
                      <td className="py-2 px-3">
                        <input type="checkbox" checked={selectedIds.has(audit.id)} onChange={() => toggleSelect(audit.id)} />
                      </td>
                      <td className="py-2 px-3">
                        <div className="max-w-[200px] truncate font-medium text-xs" title={audit.contentId}>{audit.contentId}</div>
                        {audit.url && <div className="text-xs text-gray-400 truncate max-w-[200px]">{audit.url}</div>}
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="text-xs capitalize">{audit.contentType.replace(/_/g, " ")}</Badge>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span title={locale?.name}>{locale?.flag || audit.locale}</span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5 justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                audit.translationPct >= 95 ? "bg-green-500" : audit.translationPct >= 50 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, audit.translationPct)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8">{audit.translationPct}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge className={`text-xs border ${statusInfo.color}`}>{statusInfo.label}</Badge>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {audit.issueCount > 0 ? (
                          <Badge variant="destructive" className="text-xs">{audit.issueCount}</Badge>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {audit.sitemapEligible ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {audit.noindex ? (
                          <Badge variant="destructive" className="text-xs">{t("pages.adminTranslationDashboard.noindex4")}</Badge>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <Button size="sm" variant="ghost" onClick={() => onViewDetail(audit.id)} data-testid={`button-detail-${audit.id}`}>
                          <Eye className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {audits.length === 0 && !loading && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">
                      No audit results found. Run a scan or adjust filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {total > 50 && (
            <div className="flex justify-between items-center p-3 border-t">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)} data-testid="button-prev-page">{t("pages.adminTranslationDashboard.previous")}</Button>
              <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(total / 50)}</span>
              <Button size="sm" variant="outline" disabled={(page + 1) * 50 >= total} onClick={() => setPage(page + 1)} data-testid="button-next-page">{t("pages.adminTranslationDashboard.next")}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailInspector({ detail, onBack, onToggleOverride, onRefresh }: {
  detail: AuditDetail;
  onBack: () => void;
  onToggleOverride: (id: string, field: string, value: boolean) => void;
  onRefresh: () => void;
}) {
  const locale = LOCALES.find(l => l.code === detail.locale);
  const statusInfo = STATUS_LABELS[detail.status] || STATUS_LABELS.draft;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const issuesByCategory = (detail.issues || []).reduce<Record<string, typeof detail.issues>>((acc, issue) => {
    const cat = issue.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(issue);
    return acc;
  }, {});

  const handleQuickEdit = async (issue: AuditDetail["issues"][0]) => {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/translation-audit/quick-edit", {
        method: "POST",
        body: {
          contentType: detail.contentType,
          contentId: detail.contentId,
          fieldName: issue.fieldName,
          languageCode: detail.locale,
          translatedText: editValue.trim(),
        },
      });
      if (res.ok) {
        setSaveSuccess(issue.fieldName);
        setEditingField(null);
        setEditValue("");
        setTimeout(() => setSaveSuccess(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>{locale?.flag}</span>
              <span>{detail.contentId}</span>
              <Badge className={`text-xs border ${statusInfo.color}`}>{statusInfo.label}</Badge>
            </div>
            <span className="text-2xl font-bold">{detail.translationPct}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500">{t("pages.adminTranslationDashboard.contentType2")}</p>
              <p className="text-sm font-medium capitalize" data-testid="text-detail-type">{detail.contentType.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t("pages.adminTranslationDashboard.locale4")}</p>
              <p className="text-sm font-medium" data-testid="text-detail-locale">{locale?.name || detail.locale}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">URL</p>
              <p className="text-sm font-medium truncate" data-testid="text-detail-url">{detail.url || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t("pages.adminTranslationDashboard.lastScanned")}</p>
              <p className="text-sm font-medium" data-testid="text-detail-scanned">
                {detail.lastScannedAt ? new Date(detail.lastScannedAt).toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium" data-testid="label-sitemap">{t("pages.adminTranslationDashboard.sitemapEligible")}</label>
              <button
                onClick={() => onToggleOverride(detail.id, "sitemapEligible", !detail.sitemapEligible)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  detail.sitemapEligible ? "bg-green-500" : "bg-gray-300"
                }`}
                data-testid="toggle-sitemap"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  detail.sitemapEligible ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium" data-testid="label-noindex">{t("pages.adminTranslationDashboard.noindex5")}</label>
              <button
                onClick={() => onToggleOverride(detail.id, "noindex", !detail.noindex)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  detail.noindex ? "bg-red-500" : "bg-gray-300"
                }`}
                data-testid="toggle-noindex"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  detail.noindex ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
            {detail.adminOverride && (
              <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                <Shield className="w-3 h-3 mr-1" /> Admin Override
              </Badge>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className={`h-3 rounded-full transition-all ${
                detail.translationPct >= 95 ? "bg-green-500" : detail.translationPct >= 50 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(100, detail.translationPct)}%` }}
              data-testid="progress-bar"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Field-by-Field Audit ({(detail.issues || []).length} issues)
            <span className="text-xs font-normal text-gray-500 ml-2">Click the edit icon to quick-edit translations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(issuesByCategory).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>{t("pages.adminTranslationDashboard.noIssuesFoundForThis")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(issuesByCategory).map(([category, issues]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 capitalize">{category.replace(/_/g, " ")}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="py-1.5 px-3 text-left">{t("pages.adminTranslationDashboard.field")}</th>
                          <th className="py-1.5 px-3 text-left">{t("pages.adminTranslationDashboard.englishSource")}</th>
                          <th className="py-1.5 px-3 text-left">{t("pages.adminTranslationDashboard.localizedValue")}</th>
                          <th className="py-1.5 px-3 text-center">{t("pages.adminTranslationDashboard.issueType")}</th>
                          <th className="py-1.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map(issue => (
                          <tr key={issue.id} className="border-b hover:bg-gray-50" data-testid={`row-issue-${issue.id}`}>
                            <td className="py-1.5 px-3 font-medium text-xs">{issue.fieldName}</td>
                            <td className="py-1.5 px-3 text-xs text-gray-600 max-w-[200px] truncate" title={issue.sourceValue || ""}>
                              {issue.sourceValue || <span className="text-gray-400 italic">{t("pages.adminTranslationDashboard.empty")}</span>}
                            </td>
                            <td className="py-1.5 px-3 text-xs max-w-[200px]">
                              {editingField === issue.fieldName ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="text-xs h-7"
                                    placeholder="Enter translation..."
                                    data-testid={`input-quick-edit-${issue.fieldName}`}
                                    autoFocus
                                    onKeyDown={e => {
                                      if (e.key === "Enter") handleQuickEdit(issue);
                                      if (e.key === "Escape") { setEditingField(null); setEditValue(""); }
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => handleQuickEdit(issue)}
                                    disabled={saving || !editValue.trim()}
                                    data-testid={`button-save-edit-${issue.fieldName}`}
                                  >
                                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2"
                                    onClick={() => { setEditingField(null); setEditValue(""); }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="truncate block" title={issue.localizedValue || ""}>
                                  {saveSuccess === issue.fieldName ? (
                                    <span className="text-green-600 font-medium">Saved!</span>
                                  ) : (
                                    issue.localizedValue || <span className="text-red-400 italic">{t("pages.adminTranslationDashboard.missing")}</span>
                                  )}
                                </span>
                              )}
                            </td>
                            <td className="py-1.5 px-3 text-center">
                              <Badge className={`text-xs ${
                                issue.issueType === "missing" ? "bg-red-100 text-red-700" :
                                issue.issueType === "fallback_english" ? "bg-amber-100 text-amber-700" :
                                issue.issueType === "mixed_language" ? "bg-purple-100 text-purple-700" :
                                issue.issueType === "placeholder" ? "bg-orange-100 text-orange-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {ISSUE_TYPE_LABELS[issue.issueType] || issue.issueType}
                              </Badge>
                            </td>
                            <td className="py-1.5 px-3 text-center">
                              {editingField !== issue.fieldName && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2"
                                  onClick={() => {
                                    setEditingField(issue.fieldName);
                                    setEditValue(issue.localizedValue || "");
                                  }}
                                  data-testid={`button-edit-${issue.fieldName}`}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

function MissingKeysTab() {
  const [missingKeys, setMissingKeys] = useState<Record<string, MissingKeyEntry[]>>({});
  const [totalKeys, setTotalKeys] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterLang, setFilterLang] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const fetchMissingKeys = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterLang) params.set("language", filterLang);
      const res = await adminFetch(`/api/i18n/missing-keys?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMissingKeys(data.languages || {});
        setTotalKeys(data.totalKeys || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [filterLang]);

  useEffect(() => { fetchMissingKeys(); }, [fetchMissingKeys]);

  const clearKeys = async (lang?: string) => {
    try {
      const params = new URLSearchParams();
      if (lang) params.set("language", lang);
      await adminFetch(`/api/i18n/missing-keys?${params}`, { method: "DELETE" });
      fetchMissingKeys();
    } catch (e) {
      console.error(e);
    }
  };

  const allEntries: (MissingKeyEntry & { language: string })[] = [];
  for (const [lang, keys] of Object.entries(missingKeys)) {
    for (const entry of keys) {
      if (!searchKey || entry.key.toLowerCase().includes(searchKey.toLowerCase())) {
        allEntries.push({ ...entry, language: lang });
      }
    }
  }
  allEntries.sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            Missing UI Translation Keys
          </h2>
          <Badge variant="outline" data-testid="text-missing-keys-total">{totalKeys} keys</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={fetchMissingKeys} disabled={loading} data-testid="button-refresh-keys">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" variant="destructive" onClick={() => clearKeys()} data-testid="button-clear-all-keys">
            <X className="w-4 h-4 mr-1" /> Clear All
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search keys..."
            className="pl-9"
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
            data-testid="input-search-keys"
          />
        </div>
        <select
          className="border rounded-md px-2 py-1.5 text-sm"
          value={filterLang}
          onChange={e => setFilterLang(e.target.value)}
          data-testid="filter-missing-lang"
        >
          <option value="">All Languages</option>
          {LOCALES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
        </select>
      </div>

      {totalKeys === 0 && !loading ? (
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No missing keys reported</h3>
          <p className="text-sm text-gray-500 mt-1">The frontend has not reported any missing translation keys.</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-2 px-3 text-left">Key</th>
                    <th className="py-2 px-3 text-center">Language</th>
                    <th className="py-2 px-3 text-center">Frequency</th>
                    <th className="py-2 px-3 text-center">Last Reported</th>
                    <th className="py-2 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allEntries.slice(0, 100).map((entry, idx) => {
                    const locale = LOCALES.find(l => l.code === entry.language);
                    return (
                      <tr key={`${entry.language}-${entry.key}-${idx}`} className="border-b hover:bg-gray-50" data-testid={`row-missing-key-${idx}`}>
                        <td className="py-2 px-3 font-mono text-xs">{entry.key}</td>
                        <td className="py-2 px-3 text-center">
                          <span title={locale?.name || entry.language}>{locale?.flag || entry.language}</span>
                          <span className="ml-1 text-xs text-gray-500">{entry.language}</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge className={`text-xs ${
                            entry.count >= 10 ? "bg-red-100 text-red-700" :
                            entry.count >= 5 ? "bg-amber-100 text-amber-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {entry.count}x
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-center text-xs text-gray-500">
                          {new Date(entry.lastReported).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => clearKeys(entry.language)}
                            data-testid={`button-clear-lang-${entry.language}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}

function FlaggedContentTab() {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterLang, setFilterLang] = useState("");
  const [page, setPage] = useState(0);

  const fetchFlagged = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterLang) params.set("locale", filterLang);
      params.set("limit", "50");
      params.set("offset", String(page * 50));
      const res = await adminFetch(`/api/admin/translation-audit/flagged?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [filterLang, page]);

  useEffect(() => { fetchFlagged(); }, [fetchFlagged]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Flag className="w-5 h-5 text-purple-500" />
            Flagged Mixed-Language Content
          </h2>
          <Badge variant="outline" data-testid="text-flagged-total">{total} flagged items</Badge>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-2 py-1.5 text-sm"
            value={filterLang}
            onChange={e => { setFilterLang(e.target.value); setPage(0); }}
            data-testid="filter-flagged-lang"
          >
            <option value="">All Languages</option>
            {LOCALES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
          </select>
          <Button size="sm" variant="outline" onClick={fetchFlagged} disabled={loading} data-testid="button-refresh-flagged">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No flagged content</h3>
          <p className="text-sm text-gray-500 mt-1">No mixed-language content has been detected. Run an audit to check.</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-2 px-3 text-left">Content</th>
                    <th className="py-2 px-3 text-left">Type</th>
                    <th className="py-2 px-3 text-center">Locale</th>
                    <th className="py-2 px-3 text-left">Field</th>
                    <th className="py-2 px-3 text-left">Source (English)</th>
                    <th className="py-2 px-3 text-left">Localized</th>
                    <th className="py-2 px-3 text-center">Coverage</th>
                    <th className="py-2 px-3 text-center">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const locale = LOCALES.find(l => l.code === item.locale);
                    return (
                      <tr key={`${item.id}-${idx}`} className="border-b hover:bg-gray-50" data-testid={`row-flagged-${idx}`}>
                        <td className="py-2 px-3 text-xs font-medium max-w-[150px] truncate" title={item.contentId}>{item.contentId}</td>
                        <td className="py-2 px-3">
                          <Badge variant="outline" className="text-xs capitalize">{item.contentType.replace(/_/g, " ")}</Badge>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span title={locale?.name}>{locale?.flag || item.locale}</span>
                        </td>
                        <td className="py-2 px-3 text-xs font-mono">{item.fieldName}</td>
                        <td className="py-2 px-3 text-xs text-gray-600 max-w-[150px] truncate" title={item.sourceValue || ""}>
                          {item.sourceValue || "-"}
                        </td>
                        <td className="py-2 px-3 text-xs max-w-[150px] truncate" title={item.localizedValue || ""}>
                          {item.localizedValue || "-"}
                        </td>
                        <td className="py-2 px-3 text-center text-xs font-medium">{item.translationPct}%</td>
                        <td className="py-2 px-3 text-center">
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {total > 50 && (
              <div className="flex justify-between items-center p-3 border-t">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)} data-testid="button-flagged-prev">Previous</Button>
                <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(total / 50)}</span>
                <Button size="sm" variant="outline" disabled={(page + 1) * 50 >= total} onClick={() => setPage(page + 1)} data-testid="button-flagged-next">Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}

function StaleTranslationsTab() {
  const [items, setItems] = useState<StaleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterLang, setFilterLang] = useState("");
  const [page, setPage] = useState(0);

  const fetchStale = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterLang) params.set("locale", filterLang);
      params.set("limit", "50");
      params.set("offset", String(page * 50));
      const res = await adminFetch(`/api/admin/translation-audit/stale?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [filterLang, page]);

  useEffect(() => { fetchStale(); }, [fetchStale]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Stale Translations
          </h2>
          <Badge variant="outline" data-testid="text-stale-total">{items.length} stale items found</Badge>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-2 py-1.5 text-sm"
            value={filterLang}
            onChange={e => { setFilterLang(e.target.value); setPage(0); }}
            data-testid="filter-stale-lang"
          >
            <option value="">All Languages</option>
            {LOCALES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
          </select>
          <Button size="sm" variant="outline" onClick={fetchStale} disabled={loading} data-testid="button-refresh-stale">
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
        <AlertTriangle className="w-4 h-4 inline mr-1" />
        Stale translations occur when the English source text has been updated after the translation was created.
        These translations may no longer be accurate and should be re-reviewed.
      </div>

      {items.length === 0 && !loading ? (
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No stale translations</h3>
          <p className="text-sm text-gray-500 mt-1">All translations are up to date with their English sources.</p>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-2 px-3 text-left">Content ID</th>
                    <th className="py-2 px-3 text-left">Type</th>
                    <th className="py-2 px-3 text-center">Language</th>
                    <th className="py-2 px-3 text-left">Field</th>
                    <th className="py-2 px-3 text-left">Current Source</th>
                    <th className="py-2 px-3 text-left">Current Translation</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-center">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const locale = LOCALES.find(l => l.code === item.languageCode);
                    return (
                      <tr key={`${item.id}-${idx}`} className="border-b hover:bg-orange-50" data-testid={`row-stale-${idx}`}>
                        <td className="py-2 px-3 text-xs font-medium max-w-[150px] truncate" title={item.contentId}>{item.contentId}</td>
                        <td className="py-2 px-3">
                          <Badge variant="outline" className="text-xs capitalize">{item.contentType.replace(/_/g, " ")}</Badge>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span title={locale?.name}>{locale?.flag || item.languageCode}</span>
                        </td>
                        <td className="py-2 px-3 text-xs font-mono">{item.fieldName}</td>
                        <td className="py-2 px-3 text-xs text-gray-600 max-w-[150px] truncate" title={item.currentSource}>
                          {item.currentSource || "-"}
                        </td>
                        <td className="py-2 px-3 text-xs max-w-[150px] truncate" title={item.translatedText}>
                          {item.translatedText || "-"}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Stale
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-center text-xs text-gray-500">
                          {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {total > 50 && (
              <div className="flex justify-between items-center p-3 border-t">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)} data-testid="button-stale-prev">Previous</Button>
                <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(total / 50)}</span>
                <Button size="sm" variant="outline" disabled={(page + 1) * 50 >= total} onClick={() => setPage(page + 1)} data-testid="button-stale-next">Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}

type CompletenessSummaryEntry = {
  contentType: string;
  label: string;
  totalItems: number;
  totalApproved: number;
  totalStale: number;
  totalMissing: number;
  avgCompleteness: number;
  byLocale: {
    locale: string;
    totalItems: number;
    translatedCount: number;
    approvedCount: number;
    staleCount: number;
    missingCount: number;
    draftCount: number;
    machineTranslatedCount: number;
    humanReviewNeededCount: number;
    reviewedCount: number;
    rejectedCount: number;
    completenessPercent: number;
  }[];
};

const NEW_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  missing: { label: "Missing", color: "bg-gray-100 text-gray-700 border-gray-200" },
  draft: { label: "Draft", color: "bg-red-100 text-red-700 border-red-200" },
  machine_translated: { label: "Machine Translated", color: "bg-blue-100 text-blue-700 border-blue-200" },
  human_review_needed: { label: "Review Needed", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  reviewed: { label: "Reviewed", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700 border-green-200" },
  stale: { label: "Stale", color: "bg-orange-100 text-orange-700 border-orange-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200" },
};

function ContentCompletenessTab() {
  const [summary, setSummary] = useState<CompletenessSummaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterContentType, setFilterContentType] = useState("");
  const [filterLocale, setFilterLocale] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkContentType, setBulkContentType] = useState("");
  const [bulkResult, setBulkResult] = useState<any>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterContentType) params.set("contentType", filterContentType);
      if (filterLocale) params.set("locale", filterLocale);
      if (filterStatus) params.set("status", filterStatus);
      const res = await adminFetch(`/api/admin/translation-completeness/summary?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [filterContentType, filterLocale, filterStatus]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const handleBulkStatusUpdate = async () => {
    if (!bulkContentType || !bulkStatus || bulkIds.length === 0) return;
    try {
      const res = await adminFetch("/api/admin/translation-completeness/bulk-status", {
        method: "POST",
        body: { ids: bulkIds, contentType: bulkContentType, targetStatus: bulkStatus },
      });
      if (res.ok) {
        const result = await res.json();
        setBulkResult(result);
        setBulkIds([]);
        fetchSummary();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalItems = summary.reduce((s, ct) => s + ct.totalItems, 0);
  const totalApproved = summary.reduce((s, ct) => s + ct.totalApproved, 0);
  const totalStale = summary.reduce((s, ct) => s + ct.totalStale, 0);
  const totalMissing = summary.reduce((s, ct) => s + ct.totalMissing, 0);
  const avgCompleteness = summary.length > 0
    ? Math.round(summary.reduce((s, ct) => s + ct.avgCompleteness, 0) / summary.length * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Per-Content-Type Translation Completeness
          </h2>
        </div>
        <Button size="sm" variant="outline" onClick={fetchSummary} disabled={loading} data-testid="button-refresh-completeness">
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Content Types" value={summary.length} icon={<FileText className="w-5 h-5 text-indigo-500" />} testId="stat-completeness-types" />
        <StatCard label="Total Items" value={totalItems} icon={<Globe className="w-5 h-5 text-blue-500" />} testId="stat-completeness-items" />
        <StatCard label="Approved" value={totalApproved} icon={<CheckCircle2 className="w-5 h-5 text-green-500" />} testId="stat-completeness-approved" />
        <StatCard label="Stale" value={totalStale} icon={<Clock className="w-5 h-5 text-orange-500" />} testId="stat-completeness-stale" />
        <StatCard label="Avg Completeness" value={`${avgCompleteness}%`} icon={<BarChart3 className="w-5 h-5 text-green-500" />} testId="stat-completeness-avg" />
      </div>

      <div className="flex gap-3">
        <select
          className="border rounded-md px-2 py-1.5 text-sm"
          value={filterContentType}
          onChange={e => setFilterContentType(e.target.value)}
          data-testid="filter-completeness-type"
        >
          <option value="">All Content Types</option>
          {summary.map(ct => <option key={ct.contentType} value={ct.contentType}>{ct.label}</option>)}
        </select>
        <select
          className="border rounded-md px-2 py-1.5 text-sm"
          value={filterLocale}
          onChange={e => setFilterLocale(e.target.value)}
          data-testid="filter-completeness-locale"
        >
          <option value="">All Locales</option>
          {LOCALES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
        </select>
        <select
          className="border rounded-md px-2 py-1.5 text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          data-testid="filter-completeness-status"
        >
          <option value="">All Statuses</option>
          {Object.entries(NEW_STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {bulkResult && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm" data-testid="text-bulk-result">
          <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-600" />
          Bulk update complete: {bulkResult.updatedCount} updated
          {bulkResult.illegalCount > 0 && `, ${bulkResult.illegalCount} skipped (illegal transition)`}
          <button onClick={() => setBulkResult(null)} className="ml-2 text-green-600 hover:text-green-800" data-testid="button-dismiss-bulk-result"><X className="w-3 h-3 inline" /></button>
        </div>
      )}

      {summary.map(ct => (
        <Card key={ct.contentType} data-testid={`card-completeness-${ct.contentType}`}>
          <CardHeader
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedType(expandedType === ct.contentType ? null : ct.contentType)}
            data-testid={`button-expand-${ct.contentType}`}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{ct.label}</span>
                <Badge variant="outline" className="text-xs">{ct.totalItems} items</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${ct.avgCompleteness >= 80 ? "bg-green-500" : ct.avgCompleteness >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, ct.avgCompleteness)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{ct.avgCompleteness}%</span>
                </div>
                <div className="flex gap-1">
                  <Badge className="text-xs bg-green-100 text-green-700">{ct.totalApproved} approved</Badge>
                  {ct.totalStale > 0 && <Badge className="text-xs bg-orange-100 text-orange-700">{ct.totalStale} stale</Badge>}
                  {ct.totalMissing > 0 && <Badge className="text-xs bg-gray-100 text-gray-700">{ct.totalMissing} missing</Badge>}
                </div>
                {expandedType === ct.contentType ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardTitle>
          </CardHeader>
          {expandedType === ct.contentType && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2 px-3 text-left">Locale</th>
                      <th className="py-2 px-3 text-center">Total</th>
                      <th className="py-2 px-3 text-center">Translated</th>
                      <th className="py-2 px-3 text-center">Approved</th>
                      <th className="py-2 px-3 text-center">Stale</th>
                      <th className="py-2 px-3 text-center">Missing</th>
                      <th className="py-2 px-3 text-center">Machine</th>
                      <th className="py-2 px-3 text-center">Review</th>
                      <th className="py-2 px-3 text-center">Completeness</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ct.byLocale.map(loc => {
                      const locale = LOCALES.find(l => l.code === loc.locale);
                      return (
                        <tr key={loc.locale} className="border-b hover:bg-gray-50" data-testid={`row-completeness-${ct.contentType}-${loc.locale}`}>
                          <td className="py-2 px-3 font-medium">
                            <span className="mr-2">{locale?.flag}</span>
                            {locale?.name || loc.locale}
                          </td>
                          <td className="py-2 px-3 text-center">{loc.totalItems}</td>
                          <td className="py-2 px-3 text-center">{loc.translatedCount}</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="text-xs bg-green-100 text-green-700">{loc.approvedCount}</Badge>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {loc.staleCount > 0 ? (
                              <Badge className="text-xs bg-orange-100 text-orange-700">{loc.staleCount}</Badge>
                            ) : <span className="text-gray-300">0</span>}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {loc.missingCount > 0 ? (
                              <Badge className="text-xs bg-red-100 text-red-700">{loc.missingCount}</Badge>
                            ) : <span className="text-gray-300">0</span>}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {loc.machineTranslatedCount > 0 ? (
                              <Badge className="text-xs bg-blue-100 text-blue-700">{loc.machineTranslatedCount}</Badge>
                            ) : <span className="text-gray-300">0</span>}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {loc.humanReviewNeededCount > 0 ? (
                              <Badge className="text-xs bg-yellow-100 text-yellow-700">{loc.humanReviewNeededCount}</Badge>
                            ) : <span className="text-gray-300">0</span>}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${loc.completenessPercent >= 80 ? "bg-green-500" : loc.completenessPercent >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                                  style={{ width: `${Math.min(100, loc.completenessPercent)}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold w-10 text-right">{loc.completenessPercent}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {summary.length === 0 && !loading && (
        <div className="text-center py-16">
          <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No translation data</h2>
          <p className="text-gray-500">Per-content-type translation tables have not been populated yet.</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, testId }: { label: string; value: string | number; icon: React.ReactNode; testId: string }) {
  return (
    <Card className="p-4" data-testid={testId}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function StatusCard({ label, count, color, testId }: { label: string; count: number; color: string; testId: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border" data-testid={testId}>
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold">{count}</p>
      </div>
    </div>
  );
}

type ExamCoverageData = {
  totalQuestions: number;
  totalLanguages: number;
  overallPercentage: number;
  languages: {
    language: string;
    languageName: string;
    totalQuestions: number;
    translatedQuestions: number;
    percentage: number;
    fieldBreakdown: Record<string, number>;
  }[];
  tierBreakdown: { tier: string; total: number; withTranslations: number; percentage: number }[];
  examBreakdown: { exam: string; total: number; withTranslations: number; percentage: number }[];
  filters: { tier: string | null; exam: string | null; bodySystem: string | null };
};

type ExamFilters = {
  tiers: string[];
  exams: string[];
  bodySystems: string[];
  languages: { code: string; name: string }[];
};

type BatchRun = {
  id: string;
  target_languages: string[];
  filter_tier: string | null;
  filter_exam: string | null;
  filter_body_system: string | null;
  total_questions: number;
  translated_count: number;
  skipped_count: number;
  failed_count: number;
  status: string;
  last_processed_offset: number;
  started_at: string;
  completed_at: string | null;
};

function ExamQuestionCoverageTab() {
  const [coverage, setCoverage] = useState<ExamCoverageData | null>(null);
  const [filters, setFilters] = useState<ExamFilters | null>(null);
  const [batchRuns, setBatchRuns] = useState<BatchRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateResult, setTranslateResult] = useState<any>(null);

  const [filterTier, setFilterTier] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterBodySystem, setFilterBodySystem] = useState("");

  const [translateLangs, setTranslateLangs] = useState<string[]>([]);
  const [translateTier, setTranslateTier] = useState("");
  const [translateExam, setTranslateExam] = useState("");
  const [translateBodySystem, setTranslateBodySystem] = useState("");
  const [translateBatchSize, setTranslateBatchSize] = useState(10);

  const fetchCoverage = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterTier) params.set("tier", filterTier);
      if (filterExam) params.set("exam", filterExam);
      if (filterBodySystem) params.set("bodySystem", filterBodySystem);

      const res = await adminFetch(`/api/admin/exam-questions/translation-coverage?${params}`);
      if (res.ok) setCoverage(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterTier, filterExam, filterBodySystem]);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/exam-questions/translation-filters");
      if (res.ok) setFilters(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchBatchRuns = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/exam-questions/translation-batch-runs");
      if (res.ok) {
        const data = await res.json();
        setBatchRuns(data.runs || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchCoverage();
    fetchFilters();
    fetchBatchRuns();
  }, [fetchCoverage, fetchFilters, fetchBatchRuns]);

  const startBatchTranslation = async () => {
    setTranslating(true);
    setTranslateResult(null);
    try {
      const body: any = { batchSize: translateBatchSize };
      if (translateLangs.length > 0) body.languages = translateLangs;
      if (translateTier) body.tier = translateTier;
      if (translateExam) body.exam = translateExam;
      if (translateBodySystem) body.bodySystem = translateBodySystem;

      const res = await adminFetch("/api/admin/exam-questions/translate-batch", {
        method: "POST",
        body,
      });
      if (res.ok) {
        const result = await res.json();
        setTranslateResult(result);
        fetchCoverage();
        fetchBatchRuns();
      }
    } catch (e) { console.error(e); }
    setTranslating(false);
  };

  const resumeBatchRun = async (runId: string) => {
    setTranslating(true);
    setTranslateResult(null);
    try {
      const res = await adminFetch("/api/admin/exam-questions/translate-batch", {
        method: "POST",
        body: { resumeFromRunId: runId, batchSize: translateBatchSize },
      });
      if (res.ok) {
        const result = await res.json();
        setTranslateResult(result);
        fetchCoverage();
        fetchBatchRuns();
      }
    } catch (e) { console.error(e); }
    setTranslating(false);
  };

  const priorityLangs = ["fr", "es", "ar", "hi", "tl", "zh", "pt"];

  return (
    <div className="space-y-6">
      {coverage && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label={t("pages.adminTranslationDashboard.totalQuestions")} value={coverage.totalQuestions} icon={<BookOpen className="w-5 h-5 text-blue-500" />} testId="stat-exam-total" />
            <StatCard label={t("pages.adminTranslationDashboard.languages2")} value={coverage.totalLanguages} icon={<Languages className="w-5 h-5 text-indigo-500" />} testId="stat-exam-langs" />
            <StatCard label={t("pages.adminTranslationDashboard.overallCoverage")} value={`${coverage.overallPercentage}%`} icon={<BarChart3 className="w-5 h-5 text-green-500" />} testId="stat-exam-coverage" />
            <StatCard label={t("pages.adminTranslationDashboard.priorityLanguages")} value={`${priorityLangs.length}`} icon={<Globe className="w-5 h-5 text-amber-500" />} testId="stat-exam-priority" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.filterByTier")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterTier} onChange={e => setFilterTier(e.target.value)} data-testid="filter-exam-tier">
                <option value="">{t("pages.adminTranslationDashboard.allTiers")}</option>
                {(filters?.tiers || []).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.filterByExam")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterExam} onChange={e => setFilterExam(e.target.value)} data-testid="filter-exam-exam">
                <option value="">{t("pages.adminTranslationDashboard.allExams")}</option>
                {(filters?.exams || []).map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.filterByBodySystem")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={filterBodySystem} onChange={e => setFilterBodySystem(e.target.value)} data-testid="filter-exam-body-system">
                <option value="">{t("pages.adminTranslationDashboard.allSystems")}</option>
                {(filters?.bodySystems || []).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Languages className="w-5 h-5" /> {t("pages.adminTranslationDashboard.perlanguageCoverage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 px-3">{t("pages.adminTranslationDashboard.language")}</th>
                      <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.total")}</th>
                      <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.translated")}</th>
                      <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.coverage3")}</th>
                      <th className="py-2 px-3">{t("pages.adminTranslationDashboard.progress")}</th>
                      <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.priority")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coverage.languages.map(lang => {
                      const locale = LOCALES.find(l => l.code === lang.language);
                      const isPriority = priorityLangs.includes(lang.language);
                      return (
                        <tr key={lang.language} className="border-b hover:bg-gray-50" data-testid={`row-exam-lang-${lang.language}`}>
                          <td className="py-2 px-3 font-medium">
                            <span className="mr-2">{locale?.flag || "\ud83c\udf10"}</span>
                            {lang.languageName}
                          </td>
                          <td className="py-2 px-3 text-center">{lang.totalQuestions}</td>
                          <td className="py-2 px-3 text-center font-medium">{lang.translatedQuestions}</td>
                          <td className="py-2 px-3 text-center font-bold">{lang.percentage}%</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    lang.percentage >= 95 ? "bg-green-500" : lang.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.min(100, lang.percentage)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {isPriority ? (
                              <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">{t("pages.adminTranslationDashboard.priority2")}</Badge>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {coverage.tierBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("pages.adminTranslationDashboard.pertierBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {coverage.tierBreakdown.map(t => (
                    <div key={t.tier} className="p-4 border rounded-lg" data-testid={`card-tier-${t.tier}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{t.tier}</span>
                        <Badge variant="outline" className="text-xs">{t.total} questions</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${t.percentage >= 95 ? "bg-green-500" : t.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(100, t.percentage)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{t.percentage}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{t.withTranslations} of {t.total} have translations</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {coverage.examBreakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("pages.adminTranslationDashboard.perexamBreakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {coverage.examBreakdown.map(e => (
                    <div key={e.exam} className="p-4 border rounded-lg" data-testid={`card-exam-${e.exam}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm truncate max-w-[150px]" title={e.exam}>{e.exam}</span>
                        <Badge variant="outline" className="text-xs">{e.total}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${e.percentage >= 95 ? "bg-green-500" : e.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(100, e.percentage)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{e.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Play className="w-5 h-5" /> {t("pages.adminTranslationDashboard.startBatchTranslation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.targetLanguages")}</label>
              <select
                className="w-full border rounded-md px-2 py-1.5 text-sm"
                multiple
                size={4}
                value={translateLangs}
                onChange={e => setTranslateLangs(Array.from(e.target.selectedOptions, o => o.value))}
                data-testid="select-translate-langs"
              >
                {(filters?.languages || []).map(l => (
                  <option key={l.code} value={l.code}>
                    {priorityLangs.includes(l.code) ? "\u2605 " : ""}{l.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {translateLangs.length === 0 ? "All 7 priority languages" : `${translateLangs.length} selected`}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.tierFilter")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={translateTier} onChange={e => setTranslateTier(e.target.value)} data-testid="select-translate-tier">
                <option value="">{t("pages.adminTranslationDashboard.allTiers2")}</option>
                {(filters?.tiers || []).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.examFilter")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={translateExam} onChange={e => setTranslateExam(e.target.value)} data-testid="select-translate-exam">
                <option value="">{t("pages.adminTranslationDashboard.allExams2")}</option>
                {(filters?.exams || []).map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.bodySystemFilter")}</label>
              <select className="w-full border rounded-md px-2 py-1.5 text-sm" value={translateBodySystem} onChange={e => setTranslateBodySystem(e.target.value)} data-testid="select-translate-body-system">
                <option value="">{t("pages.adminTranslationDashboard.allSystems2")}</option>
                {(filters?.bodySystems || []).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminTranslationDashboard.batchSize")}</label>
              <Input
                type="number"
                min={1}
                max={25}
                value={translateBatchSize}
                onChange={e => setTranslateBatchSize(Number(e.target.value))}
                className="text-sm"
                data-testid="input-batch-size"
              />
            </div>
          </div>
          <Button
            onClick={startBatchTranslation}
            disabled={translating}
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-start-batch"
          >
            {translating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("pages.adminTranslationDashboard.translating")}</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> {t("pages.adminTranslationDashboard.startBatchTranslation2")}</>
            )}
          </Button>

          {translateResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg" data-testid="text-translate-result">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">{t("pages.adminTranslationDashboard.batchComplete")}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{t("pages.adminTranslationDashboard.translated2")}</span>{" "}
                  <span className="font-bold text-green-700">{translateResult.batchTranslated || translateResult.totalTranslated || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("pages.adminTranslationDashboard.skipped")}</span>{" "}
                  <span className="font-bold text-gray-500">{translateResult.batchSkipped || translateResult.totalSkipped || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("pages.adminTranslationDashboard.failed")}</span>{" "}
                  <span className="font-bold text-red-600">{translateResult.batchFailed || 0}</span>
                </div>
              </div>
              {!translateResult.done && translateResult.runId && (
                <div className="mt-3">
                  <Button size="sm" variant="outline" onClick={() => resumeBatchRun(translateResult.runId)} disabled={translating} data-testid="button-resume-batch">
                    <Play className="w-3 h-3 mr-1" /> Continue Next Batch
                  </Button>
                </div>
              )}
              {translateResult.qualityIssues?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-amber-700 mb-1">{t("pages.adminTranslationDashboard.qualityIssues")}</p>
                  <ul className="text-xs text-amber-600 space-y-0.5">
                    {translateResult.qualityIssues.slice(0, 5).map((issue: string, i: number) => (
                      <li key={i}>{"\u2022"} {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {batchRuns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("pages.adminTranslationDashboard.recentBatchRuns")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 px-3">{t("pages.adminTranslationDashboard.started")}</th>
                    <th className="py-2 px-3">{t("pages.adminTranslationDashboard.status3")}</th>
                    <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.languages")}</th>
                    <th className="py-2 px-3">{t("pages.adminTranslationDashboard.filters")}</th>
                    <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.progress2")}</th>
                    <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.translated3")}</th>
                    <th className="py-2 px-3 text-center">{t("pages.adminTranslationDashboard.failed2")}</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {batchRuns.map(run => (
                    <tr key={run.id} className="border-b hover:bg-gray-50" data-testid={`row-batch-${run.id}`}>
                      <td className="py-2 px-3 text-xs">
                        {new Date(run.started_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
                        <Badge className={`text-xs ${
                          run.status === "completed" ? "bg-green-100 text-green-700" :
                          run.status === "running" ? "bg-blue-100 text-blue-700" :
                          run.status === "failed" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {run.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-center text-xs">
                        {Array.isArray(run.target_languages) ? run.target_languages.length : 0}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {[run.filter_tier, run.filter_exam, run.filter_body_system].filter(Boolean).join(", ") || "All"}
                      </td>
                      <td className="py-2 px-3 text-center text-xs">
                        {run.last_processed_offset}/{run.total_questions}
                      </td>
                      <td className="py-2 px-3 text-center font-medium text-green-600">
                        {run.translated_count}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {run.failed_count > 0 ? (
                          <span className="text-red-600 font-medium">{run.failed_count}</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {run.status === "running" && (
                          <Button size="sm" variant="ghost" onClick={() => resumeBatchRun(run.id)} disabled={translating} data-testid={`button-resume-${run.id}`}>
                            <Play className="w-3 h-3 mr-1" /> Resume
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}
