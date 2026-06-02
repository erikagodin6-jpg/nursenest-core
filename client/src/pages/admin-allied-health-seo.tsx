import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2, RefreshCw, ChevronDown, Play, CheckCircle2, XCircle,
  FileText, Eye, Edit3, Trash2, ArrowRight, BookOpen, Clock,
  AlertCircle, Sparkles, Send, ChevronRight, Save, X
} from "lucide-react";
import { ALLIED_HEALTH_PROFESSIONS, type AlliedHealthProfession } from "@/allied/data/allied-health-professions";
import { apiRequest } from "@/lib/queryClient";

import { useI18n } from "@/lib/i18n";
type ArticleStatus = "draft" | "queued" | "generating" | "needs_review" | "published" | "failed";

const STATUS_CONFIG: Record<ArticleStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  queued: { label: "Queued", color: "text-blue-600", bg: "bg-blue-100" },
  generating: { label: "Generating", color: "text-amber-600", bg: "bg-amber-100" },
  needs_review: { label: "Needs Review", color: "text-orange-600", bg: "bg-orange-100" },
  published: { label: "Published", color: "text-green-600", bg: "bg-green-100" },
  failed: { label: "Failed", color: "text-red-600", bg: "bg-red-100" },
};

function StatusBadge({ status }: { status: ArticleStatus }) {
  const { t } = useI18n();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`} data-testid={`badge-status-${status}`}>
      {config.label}
    </span>
  );
}

function ArticleEditor({ article, onClose, onSave }: { article: any; onClose: () => void; onSave: () => void }) {
  const [title, setTitle] = useState(article.title || "");
  const [metaTitle, setMetaTitle] = useState(article.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(article.metaDescription || "");
  const [contentMd, setContentMd] = useState(article.contentMd || "");
  const [status, setStatus] = useState(article.status || "draft");

  const saveMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/admin/allied-health/article/${article.id}`, {
      title, metaTitle, metaDescription, contentMd, status,
    }),
    onSuccess: () => onSave(),
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="article-editor-modal">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">{t("pages.adminAlliedHealthSeo.editArticle")}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50" data-testid="button-save-article">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600" data-testid="button-close-editor">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthSeo.title")}</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-article-title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthSeo.metaTitle")}</label>
              <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-meta-title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthSeo.status")}</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-status">
                <option value="draft">{t("pages.adminAlliedHealthSeo.draft")}</option>
                <option value="needs_review">{t("pages.adminAlliedHealthSeo.needsReview")}</option>
                <option value="published">{t("pages.adminAlliedHealthSeo.published")}</option>
                <option value="failed">{t("pages.adminAlliedHealthSeo.failed")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthSeo.metaDescription")}</label>
            <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-meta-description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthSeo.contentMarkdown")}</label>
            <textarea value={contentMd} onChange={e => setContentMd(e.target.value)} rows={20}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono" data-testid="input-content-md" />
          </div>
          {saveMutation.isError && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Failed to save
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminAlliedHealthSEO() {
  const queryClient = useQueryClient();
  const professionsList = Object.values(ALLIED_HEALTH_PROFESSIONS);
  const [selectedProfession, setSelectedProfession] = useState<string>(professionsList[0]?.slug || "");
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  const profession = professionsList.find(p => p.slug === selectedProfession);

  const { data: topicsData, isLoading: topicsLoading, refetch: refetchTopics } = useQuery({
    queryKey: ["/api/admin/allied-health/profession-topics", selectedProfession],
    queryFn: () => fetch(`/api/admin/allied-health/profession-topics?professionSlug=${selectedProfession}`, { credentials: "include" }).then(r => r.json()),
    enabled: !!selectedProfession,
  });

  const generateMutation = useMutation({
    mutationFn: async (topic: { slug: string; title: string; targetKeyword: string }) =>
      apiRequest("POST", "/api/admin/allied-health/generate-article", {
        professionSlug: selectedProfession,
        ...topic,
        wordCount: 1500,
      }),
    onSuccess: () => {
      setTimeout(() => refetchTopics(), 2000);
    },
  });

  const bulkGenerateMutation = useMutation({
    mutationFn: async (topics: { slug: string; title: string; targetKeyword: string }[]) =>
      apiRequest("POST", "/api/admin/allied-health/bulk-generate", {
        professionSlug: selectedProfession,
        topics,
      }),
    onSuccess: () => {
      setSelectedTopics(new Set());
      setTimeout(() => refetchTopics(), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (articleId: string) =>
      apiRequest("DELETE", `/api/admin/allied-health/article/${articleId}`),
    onSuccess: () => refetchTopics(),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async ({ articleIds, status }: { articleIds: string[]; status: string }) =>
      apiRequest("POST", "/api/admin/seo-engine/bulk-status", { articleIds, status }),
    onSuccess: () => refetchTopics(),
  });

  const existingArticles: any[] = topicsData?.articles || [];
  const existingSlugs = new Set(existingArticles.map((a: any) => a.slug));

  const getArticleForTopic = useCallback((topicSlug: string) => {
    return existingArticles.find((a: any) => a.slug === topicSlug || a.slug.endsWith(`/${topicSlug}`));
  }, [existingArticles]);

  const handleEditArticle = async (articleId: string) => {
    try {
      const r = await fetch(`/api/admin/allied-health/article/${articleId}`, { credentials: "include" });
      const data = await r.json();
      setEditingArticle(data);
    } catch (err) {
      console.error("Failed to load article for editing:", err);
    }
  };

  const handleBulkGenerate = () => {
    if (!profession || selectedTopics.size === 0) return;
    const topics = profession.topicTemplates
      .filter(t => selectedTopics.has(t.slug))
      .map(t => ({ slug: t.slug, title: t.title, targetKeyword: t.targetKeyword }));
    bulkGenerateMutation.mutate(topics);
  };

  const toggleTopicSelection = (slug: string) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAllUngenerated = () => {
    if (!profession) return;
    const newSet = new Set<string>();
    for (const t of profession.topicTemplates) {
      if (!getArticleForTopic(t.slug)) newSet.add(t.slug);
    }
    setSelectedTopics(newSet);
  };

  const stats = {
    total: existingArticles.length,
    published: existingArticles.filter((a: any) => a.status === "published").length,
    needsReview: existingArticles.filter((a: any) => a.status === "needs_review").length,
    generating: existingArticles.filter((a: any) => a.status === "generating" || a.status === "queued").length,
    failed: existingArticles.filter((a: any) => a.status === "failed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-allied-health-seo-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-title">{t("pages.adminAlliedHealthSeo.alliedHealthSeoContent")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("pages.adminAlliedHealthSeo.manageAndGenerateSeoArticles")}</p>
          </div>
          <button onClick={() => refetchTopics()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" data-testid="button-refresh">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("pages.adminAlliedHealthSeo.selectProfession")}</label>
          <div className="relative">
            <select
              value={selectedProfession}
              onChange={e => { setSelectedProfession(e.target.value); setSelectedTopics(new Set()); }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium appearance-none bg-white"
              data-testid="select-profession"
            >
              {Object.values(ALLIED_HEALTH_PROFESSIONS).map(p => (
                <option key={p.slug} value={p.slug}>{p.name} ({p.shortName})</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-total">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAlliedHealthSeo.totalArticles")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-published">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAlliedHealthSeo.published2")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-review">
            <div className="text-2xl font-bold text-orange-600">{stats.needsReview}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAlliedHealthSeo.needsReview2")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-generating">
            <div className="text-2xl font-bold text-amber-600">{stats.generating}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAlliedHealthSeo.generating")}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-failed">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs text-gray-500">{t("pages.adminAlliedHealthSeo.failed2")}</div>
          </div>
        </div>

        {existingArticles.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 mb-6" data-testid="existing-articles-section">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">{t("pages.adminAlliedHealthSeo.existingArticles")}</h2>
              <div className="flex items-center gap-2">
                {existingArticles.some((a: any) => a.status === "needs_review") && (
                  <button
                    onClick={() => {
                      const ids = existingArticles.filter((a: any) => a.status === "needs_review").map((a: any) => a.id);
                      bulkStatusMutation.mutate({ articleIds: ids, status: "published" });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100"
                    data-testid="button-publish-all-review"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Publish All Reviewed
                  </button>
                )}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {existingArticles.map((article: any) => (
                <div key={article.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors" data-testid={`row-article-${article.id}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{article.title}</div>
                    <div className="text-xs text-gray-500 truncate">{article.slug} · {article.wordCount ? `${article.wordCount} words` : "no content"}</div>
                  </div>
                  <StatusBadge status={article.status} />
                  <div className="flex items-center gap-1">
                    {article.status === "published" && (
                      <a href={`/allied-health/${selectedProfession}/${article.slug}`} target="_blank" rel="noopener"
                        className="p-1.5 text-gray-400 hover:text-teal-600" title={t("pages.adminAlliedHealthSeo.view")} data-testid={`button-view-${article.id}`}>
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => handleEditArticle(article.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600" title={t("pages.adminAlliedHealthSeo.edit")} data-testid={`button-edit-${article.id}`}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm("Delete this article?")) deleteMutation.mutate(article.id); }}
                      className="p-1.5 text-gray-400 hover:text-red-600" title={t("pages.adminAlliedHealthSeo.delete")} data-testid={`button-delete-${article.id}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100" data-testid="topic-templates-section">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Topic Templates ({profession?.topicTemplates.length || 0})</h2>
            <div className="flex items-center gap-2">
              <button onClick={selectAllUngenerated}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100"
                data-testid="button-select-all">
                Select All New
              </button>
              {selectedTopics.size > 0 && (
                <button
                  onClick={handleBulkGenerate}
                  disabled={bulkGenerateMutation.isPending}
                  className="inline-flex items-center gap-1 px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 disabled:opacity-50"
                  data-testid="button-bulk-generate"
                >
                  {bulkGenerateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate {selectedTopics.size} Selected
                </button>
              )}
            </div>
          </div>
          {topicsLoading ? (
            <div className="px-5 py-12 text-center">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t("pages.adminAlliedHealthSeo.loadingTopics")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {profession?.topicTemplates.map(topic => {
                const existingArticle = getArticleForTopic(topic.slug);
                const isGenerated = !!existingArticle;
                const isSelected = selectedTopics.has(topic.slug);
                return (
                  <div key={topic.slug} className={`px-5 py-3 flex items-center gap-4 ${isGenerated ? "bg-gray-50/50" : "hover:bg-gray-50"} transition-colors`} data-testid={`row-topic-${topic.slug}`}>
                    {!isGenerated && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTopicSelection(topic.slug)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                        data-testid={`checkbox-${topic.slug}`}
                      />
                    )}
                    {isGenerated && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{topic.title}</div>
                      <div className="text-xs text-gray-500">{topic.targetKeyword} · {topic.searchIntent}</div>
                    </div>
                    {isGenerated ? (
                      <StatusBadge status={existingArticle.status} />
                    ) : (
                      <button
                        onClick={() => generateMutation.mutate({ slug: topic.slug, title: topic.title, targetKeyword: topic.targetKeyword })}
                        disabled={generateMutation.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium hover:bg-teal-100 disabled:opacity-50"
                        data-testid={`button-generate-${topic.slug}`}
                      >
                        {generateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Generate
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {bulkGenerateMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700" data-testid="bulk-success-message">
            <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
            Bulk generation started. Articles will appear once processing completes. Click Refresh to check status.
          </div>
        )}
      </div>

      {editingArticle && (
        <ArticleEditor
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSave={() => { setEditingArticle(null); refetchTopics(); }}
        />
      )}
    </div>
  );
}
