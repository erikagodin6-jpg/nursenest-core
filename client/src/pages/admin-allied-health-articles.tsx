import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import {
  ALLIED_HEALTH_PROFESSIONS,
  ALLIED_HEALTH_PROFESSION_SLUGS,
} from "@/allied/data/allied-health-professions";
import { ALLIED_HEALTH_ARTICLE_TOPICS } from "@/allied/data/allied-health-article-topics";
import { useI18n } from "@/lib/i18n";
import {
  Plus, RefreshCw, Send, Trash2, Edit3, Eye, Check, X,
  FileText, Sparkles, ChevronDown, Filter, ExternalLink
} from "lucide-react";

export default function AdminAlliedHealthArticles() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [selectedProfession, setSelectedProfession] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [generateForm, setGenerateForm] = useState({
    profession: "",
    topicSlug: "",
    title: "",
    targetKeyword: "",
    primaryCategory: "",
  });
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["/api/admin/allied-health/articles", selectedProfession, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedProfession) params.set("profession", selectedProfession);
      if (statusFilter) params.set("status", statusFilter);
      const res = await adminFetch(`/api/admin/allied-health/articles?${params}`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      return res.json();
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: typeof generateForm) => {
      const res = await adminFetch("/api/admin/allied-health/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          slug: data.topicSlug,
          careerTrack: data.profession,
          targetKeyword: data.targetKeyword,
          primaryCategory: data.primaryCategory,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      slug: string;
      careerTrack: string;
      metaTitle: string;
      metaDescription: string;
      contentMd: string;
      primaryCategory: string;
      targetKeyword: string;
      status: string;
    }) => {
      const res = await adminFetch("/api/admin/allied-health/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allied-health/articles"] });
      setGeneratedContent(null);
      setShowGenerator(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await adminFetch(`/api/admin/allied-health/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allied-health/articles"] });
      setEditingArticle(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/allied-health/articles/${id}/publish`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allied-health/articles"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/allied-health/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allied-health/articles"] });
    },
  });

  const topics = generateForm.profession
    ? ALLIED_HEALTH_ARTICLE_TOPICS[generateForm.profession] || []
    : [];

  const handleTopicSelect = (topicSlug: string) => {
    const topic = topics.find((t) => t.slug === topicSlug);
    if (topic) {
      setGenerateForm((prev) => ({
        ...prev,
        topicSlug: topic.slug,
        title: topic.title,
        targetKeyword: topic.targetKeyword,
        primaryCategory: topic.category,
      }));
    }
  };

  const handleSaveGenerated = (status: string) => {
    if (!generatedContent || !generateForm.profession || !generateForm.topicSlug) return;
    saveMutation.mutate({
      title: generateForm.title,
      slug: generateForm.topicSlug,
      careerTrack: generateForm.profession,
      metaTitle: generatedContent.metaTitle || generateForm.title,
      metaDescription: generatedContent.metaDescription || "",
      contentMd: generatedContent.contentMd || "",
      primaryCategory: generateForm.primaryCategory,
      targetKeyword: generateForm.targetKeyword,
      status,
    });
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    generating: "bg-yellow-100 text-yellow-700",
    published: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-allied-articles-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-title">
              Allied Health Articles
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Generate and manage SEO articles for allied health professions
            </p>
          </div>
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
            data-testid="button-toggle-generator"
          >
            <Plus className="w-4 h-4" />
            Generate Article
          </button>
        </div>

        {showGenerator && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm" data-testid="generator-panel">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              AI Article Generator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthArticles.profession")}</label>
                <select
                  value={generateForm.profession}
                  onChange={(e) => setGenerateForm({ profession: e.target.value, topicSlug: "", title: "", targetKeyword: "", primaryCategory: "" })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  data-testid="select-profession"
                >
                  <option value="">{t("pages.adminAlliedHealthArticles.selectProfession")}</option>
                  {ALLIED_HEALTH_PROFESSION_SLUGS.map((slug) => (
                    <option key={slug} value={slug}>
                      {ALLIED_HEALTH_PROFESSIONS[slug].name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthArticles.topic")}</label>
                <select
                  value={generateForm.topicSlug}
                  onChange={(e) => handleTopicSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  disabled={!generateForm.profession}
                  data-testid="select-topic"
                >
                  <option value="">{t("pages.adminAlliedHealthArticles.selectTopic")}</option>
                  {topics.map((topic) => (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthArticles.title")}</label>
                <input
                  type="text"
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={t("pages.adminAlliedHealthArticles.articleTitle")}
                  data-testid="input-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthArticles.targetKeyword")}</label>
                <input
                  type="text"
                  value={generateForm.targetKeyword}
                  onChange={(e) => setGenerateForm((prev) => ({ ...prev, targetKeyword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={t("pages.adminAlliedHealthArticles.seoTargetKeyword")}
                  data-testid="input-keyword"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.adminAlliedHealthArticles.category")}</label>
                <input
                  type="text"
                  value={generateForm.primaryCategory}
                  onChange={(e) => setGenerateForm((prev) => ({ ...prev, primaryCategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Career, Clinical, Exam Prep..."
                  data-testid="input-category"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => generateMutation.mutate(generateForm)}
                disabled={!generateForm.profession || !generateForm.topicSlug || !generateForm.title || generateMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> {t("pages.adminAlliedHealthArticles.generating")}</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> {t("pages.adminAlliedHealthArticles.generateWithGpt4o")}</>
                )}
              </button>
              <button
                onClick={() => { setShowGenerator(false); setGeneratedContent(null); }}
                className="px-4 py-2 text-gray-500 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                data-testid="button-cancel-generate"
              >
                Cancel
              </button>
            </div>
            {generateMutation.isError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm" data-testid="generate-error">
                Error: {(generateMutation.error as Error).message}
              </div>
            )}
          </div>
        )}

        {generatedContent && (
          <div className="bg-white rounded-xl border border-teal-200 p-6 mb-8 shadow-sm" data-testid="generated-preview">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                Generated Content Preview
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveGenerated("draft")}
                  disabled={saveMutation.isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  data-testid="button-save-draft"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSaveGenerated("published")}
                  disabled={saveMutation.isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  data-testid="button-save-publish"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save & Publish
                </button>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{t("pages.adminAlliedHealthArticles.metaTitle")}</span>
                <p className="text-sm text-gray-900 font-medium">{generatedContent.metaTitle}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{t("pages.adminAlliedHealthArticles.metaDescription")}</span>
                <p className="text-sm text-gray-600">{generatedContent.metaDescription}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{t("pages.adminAlliedHealthArticles.wordCount")}</span>
                <p className="text-sm text-gray-600">{generatedContent.wordCount} words</p>
              </div>
            </div>
            <details className="cursor-pointer">
              <summary className="text-sm text-teal-600 font-medium hover:text-teal-700">
                Preview article content ({generatedContent.wordCount} words)
              </summary>
              <div className="mt-4 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{generatedContent.contentMd}</pre>
              </div>
            </details>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm" data-testid="articles-list">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                data-testid="filter-profession"
              >
                <option value="">{t("pages.adminAlliedHealthArticles.allProfessions")}</option>
                {ALLIED_HEALTH_PROFESSION_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {ALLIED_HEALTH_PROFESSIONS[slug].name}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
              data-testid="filter-status"
            >
              <option value="">{t("pages.adminAlliedHealthArticles.allStatuses")}</option>
              <option value="draft">{t("pages.adminAlliedHealthArticles.draft")}</option>
              <option value="published">{t("pages.adminAlliedHealthArticles.published")}</option>
              <option value="generating">{t("pages.adminAlliedHealthArticles.generating2")}</option>
              <option value="failed">{t("pages.adminAlliedHealthArticles.failed")}</option>
            </select>
            <span className="text-sm text-gray-500 ml-auto">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500" data-testid="articles-loading">{t("pages.adminAlliedHealthArticles.loadingArticles")}</div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-gray-500" data-testid="articles-empty">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>{t("pages.adminAlliedHealthArticles.noArticlesFoundUseThe")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {articles.map((article: any) => (
                <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors" data-testid={`article-row-${article.id}`}>
                  {editingArticle?.id === article.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingArticle.title}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        data-testid="edit-title"
                      />
                      <input
                        type="text"
                        value={editingArticle.metaTitle || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, metaTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder={t("pages.adminAlliedHealthArticles.metaTitle2")}
                        data-testid="edit-meta-title"
                      />
                      <textarea
                        value={editingArticle.metaDescription || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        rows={2}
                        placeholder={t("pages.adminAlliedHealthArticles.metaDescription2")}
                        data-testid="edit-meta-description"
                      />
                      <textarea
                        value={editingArticle.contentMd || ""}
                        onChange={(e) => setEditingArticle({ ...editingArticle, contentMd: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                        rows={10}
                        placeholder={t("pages.adminAlliedHealthArticles.articleContentMarkdown")}
                        data-testid="edit-content"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateMutation.mutate(editingArticle)}
                          disabled={updateMutation.isPending}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                          data-testid="button-save-edit"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingArticle(null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          data-testid="button-cancel-edit"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[article.status] || "bg-gray-100 text-gray-700"}`}>
                            {article.status}
                          </span>
                          {article.primaryCategory && (
                            <span className="text-xs text-gray-400">{article.primaryCategory}</span>
                          )}
                          {article.careerTrack && (
                            <span className="text-xs text-gray-400">
                              {ALLIED_HEALTH_PROFESSIONS[article.careerTrack]?.shortName || article.careerTrack}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-0.5 truncate" data-testid={`article-title-${article.id}`}>
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{article.slug}</p>
                        {article.wordCount > 0 && (
                          <span className="text-xs text-gray-400">{article.wordCount} words</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                        {article.status === "published" && (
                          <a
                            href={`/allied-health/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                            title={t("pages.adminAlliedHealthArticles.view")}
                            data-testid={`button-view-${article.id}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setEditingArticle({ ...article })}
                          className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                          title={t("pages.adminAlliedHealthArticles.edit")}
                          data-testid={`button-edit-${article.id}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {article.status !== "published" && (
                          <button
                            onClick={() => publishMutation.mutate(article.id)}
                            disabled={publishMutation.isPending}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title={t("pages.adminAlliedHealthArticles.publish")}
                            data-testid={`button-publish-${article.id}`}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Delete this article?")) deleteMutation.mutate(article.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title={t("pages.adminAlliedHealthArticles.delete")}
                          data-testid={`button-delete-${article.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
