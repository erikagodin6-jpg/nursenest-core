import { useState, useEffect, useCallback } from "react";
import { CAREER_CONFIGS } from "@shared/careers";
import {
  FileText, Plus, Loader2, Eye, EyeOff, Edit3, RefreshCw,
  ChevronDown, ChevronRight, Save, X, Trash2, ArrowRight,
  CheckCircle2, AlertTriangle, Filter, Search, BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
const ALLIED_CAREERS = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging", "psychotherapist", "socialWorker", "addictionsCounsellor", "occupationalTherapy", "physicalTherapy"] as const;

const PROFESSION_SLUG_MAP: Record<string, string> = {
  rrt: "rrt",
  paramedic: "paramedic",
  pharmacyTech: "pharmacy-technician",
  mlt: "mlt",
  imaging: "imaging",
  psychotherapist: "psychotherapy",
  socialWorker: "social-work",
  addictionsCounsellor: "addictions",
  occupationalTherapy: "occupational-therapy",
  physicalTherapy: "physical-therapy",
};

async function apiFetch(url: string, opts?: RequestInit) {
  const { t } = useI18n();
  const adminId = "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225";
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}adminId=${adminId}`, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-admin-id": adminId, ...(opts?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

type ArticleView = "list" | "editor" | "templates" | "preview";

interface Article {
  id: string;
  professionSlug: string;
  articleType: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  contentSections: any[];
  faqItems: any[];
  internalLinks: any[];
  schemaMarkupJson: any;
  breadcrumbItems: any[];
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Template {
  id: string;
  templateKey: string;
  displayName: string;
  description: string;
  sectionStructure: any[];
  promptInstructions: string;
  defaultInternalLinkTargets: any;
  isActive: boolean;
  createdAt: string;
}

export function ArticleAdminPanel() {
  const { toast } = useToast();
  const [view, setView] = useState<ArticleView>("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [filterProfession, setFilterProfession] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterProfession) params.set("profession", filterProfession);
      if (filterType) params.set("type", filterType);
      if (filterStatus) params.set("status", filterStatus);
      const qs = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/api/admin/allied-articles${qs}`);
      setArticles(data);
    } catch (e: any) {
      toast({ title: "Failed to load articles", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [filterProfession, filterType, filterStatus]);

  const loadTemplates = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/allied-article-templates");
      setTemplates(data);
    } catch (e: any) {
      toast({ title: "Failed to load templates", description: e.message, variant: "destructive" });
    }
  }, []);

  useEffect(() => { loadArticles(); loadTemplates(); }, [loadArticles, loadTemplates]);

  const handleGenerate = async () => {
    if (!selectedProfession || !selectedTemplate) {
      toast({ title: "Select both profession and article type", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const profSlug = PROFESSION_SLUG_MAP[selectedProfession] || selectedProfession;
      const result = await apiFetch("/api/admin/allied-articles/generate", {
        method: "POST",
        body: JSON.stringify({ professionSlug: profSlug, templateKey: selectedTemplate }),
      });
      toast({ title: "Article generated", description: `"${result.title}" created as draft` });
      loadArticles();
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await apiFetch(`/api/admin/allied-articles/${id}/publish`, { method: "POST" });
      toast({ title: "Article published" });
      loadArticles();
    } catch (e: any) {
      toast({ title: "Publish failed", description: e.message, variant: "destructive" });
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await apiFetch(`/api/admin/allied-articles/${id}/unpublish`, { method: "POST" });
      toast({ title: "Article unpublished" });
      loadArticles();
    } catch (e: any) {
      toast({ title: "Unpublish failed", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveArticle = async (article: Article) => {
    try {
      await apiFetch(`/api/admin/allied-articles/${article.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: article.title,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          contentSections: article.contentSections,
          faqItems: article.faqItems,
          internalLinks: article.internalLinks,
          primaryKeyword: article.primaryKeyword,
          secondaryKeywords: article.secondaryKeywords,
        }),
      });
      toast({ title: "Article saved" });
      loadArticles();
      setView("list");
      setEditingArticle(null);
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveTemplate = async (template: Template) => {
    try {
      await apiFetch(`/api/admin/allied-article-templates/${template.id}`, {
        method: "PUT",
        body: JSON.stringify({
          displayName: template.displayName,
          description: template.description,
          sectionStructure: template.sectionStructure,
          promptInstructions: template.promptInstructions,
          isActive: template.isActive,
        }),
      });
      toast({ title: "Template saved" });
      loadTemplates();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6" data-testid="article-admin-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-900">{t("allied.articleAdmin.articleEngine")}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setView("list"); setEditingArticle(null); setPreviewArticle(null); }}
            className={`px-3 py-1.5 text-sm rounded-lg ${view === "list" ? "bg-teal-100 text-teal-700" : "text-gray-500 hover:bg-gray-100"}`}
            data-testid="button-view-list"
          >
            Articles
          </button>
          <button
            onClick={() => setView("templates")}
            className={`px-3 py-1.5 text-sm rounded-lg ${view === "templates" ? "bg-teal-100 text-teal-700" : "text-gray-500 hover:bg-gray-100"}`}
            data-testid="button-view-templates"
          >
            Templates
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">{t("allied.articleAdmin.generateNewArticle")}</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t("allied.articleAdmin.profession")}</label>
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              data-testid="select-article-profession"
            >
              <option value="">{t("allied.articleAdmin.selectProfession")}</option>
              {ALLIED_CAREERS.map(id => (
                <option key={id} value={id}>{CAREER_CONFIGS[id]?.shortName || id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t("allied.articleAdmin.articleType")}</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              data-testid="select-article-template"
            >
              <option value="">{t("allied.articleAdmin.selectType")}</option>
              {templates.filter(t => t.isActive).map(t => (
                <option key={t.templateKey} value={t.templateKey}>{t.displayName}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedProfession || !selectedTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
            data-testid="button-generate-article"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {view === "list" && (
        <ArticleList
          articles={articles}
          loading={loading}
          filterProfession={filterProfession}
          filterType={filterType}
          filterStatus={filterStatus}
          templates={templates}
          onFilterProfession={setFilterProfession}
          onFilterType={setFilterType}
          onFilterStatus={setFilterStatus}
          onRefresh={loadArticles}
          onEdit={(a) => { setEditingArticle(a); setView("editor"); }}
          onPreview={(a) => { setPreviewArticle(a); setView("preview"); }}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
        />
      )}

      {view === "editor" && editingArticle && (
        <ArticleEditor
          article={editingArticle}
          onSave={handleSaveArticle}
          onCancel={() => { setView("list"); setEditingArticle(null); }}
        />
      )}

      {view === "preview" && previewArticle && (
        <ArticlePreview
          article={previewArticle}
          onClose={() => { setView("list"); setPreviewArticle(null); }}
        />
      )}

      {view === "templates" && (
        <TemplateManager
          templates={templates}
          onSave={handleSaveTemplate}
          onRefresh={loadTemplates}
        />
      )}
    </div>
  );
}

function ArticleList({
  articles, loading, filterProfession, filterType, filterStatus, templates,
  onFilterProfession, onFilterType, onFilterStatus, onRefresh, onEdit, onPreview, onPublish, onUnpublish,
}: {
  articles: Article[];
  loading: boolean;
  filterProfession: string;
  filterType: string;
  filterStatus: string;
  templates: Template[];
  onFilterProfession: (v: string) => void;
  onFilterType: (v: string) => void;
  onFilterStatus: (v: string) => void;
  onRefresh: () => void;
  onEdit: (a: Article) => void;
  onPreview: (a: Article) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filterProfession}
          onChange={(e) => onFilterProfession(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          data-testid="filter-profession"
        >
          <option value="">{t("allied.articleAdmin.allProfessions")}</option>
          {ALLIED_CAREERS.map(id => (
            <option key={id} value={PROFESSION_SLUG_MAP[id]}>{CAREER_CONFIGS[id]?.shortName || id}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => onFilterType(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          data-testid="filter-type"
        >
          <option value="">{t("allied.articleAdmin.allTypes")}</option>
          {templates.map(t => (
            <option key={t.templateKey} value={t.templateKey}>{t.displayName}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
          data-testid="filter-status"
        >
          <option value="">{t("allied.articleAdmin.allStatus")}</option>
          <option value="draft">{t("allied.articleAdmin.draft")}</option>
          <option value="published">{t("allied.articleAdmin.published")}</option>
          <option value="unpublished">{t("allied.articleAdmin.unpublished")}</option>
        </select>
        <button onClick={onRefresh} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700" data-testid="button-refresh-articles">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
        <span className="text-xs text-gray-400 ml-auto">{articles.length} articles</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">{t("allied.articleAdmin.noArticlesFoundGenerateYour")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4" data-testid={`article-row-${article.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    article.status === "published" ? "bg-green-50 text-green-700" :
                    article.status === "draft" ? "bg-amber-50 text-amber-700" :
                    "bg-gray-50 text-gray-600"
                  }`} data-testid={`badge-status-${article.id}`}>
                    {article.status}
                  </span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                    {article.professionSlug}
                  </span>
                  <span className="text-xs text-gray-400">{article.articleType}</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm truncate" data-testid={`text-article-title-${article.id}`}>{article.title}</h4>
                <p className="text-xs text-gray-500 truncate">{article.metaDescription}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => onPreview(article)} className="p-1.5 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-teal-50" title={t("allied.articleAdmin.preview")} data-testid={`button-preview-${article.id}`}>
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit(article)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title={t("allied.articleAdmin.edit")} data-testid={`button-edit-${article.id}`}>
                  <Edit3 className="w-4 h-4" />
                </button>
                {article.status === "published" ? (
                  <button onClick={() => onUnpublish(article.id)} className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-amber-50" title={t("allied.articleAdmin.unpublish")} data-testid={`button-unpublish-${article.id}`}>
                    <EyeOff className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => onPublish(article.id)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50" title={t("allied.articleAdmin.publish")} data-testid={`button-publish-${article.id}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleEditor({ article, onSave, onCancel }: { article: Article; onSave: (a: Article) => void; onCancel: () => void }) {
  const [editState, setEditState] = useState<Article>({ ...article });
  const [saving, setSaving] = useState(false);

  const contentSections = typeof editState.contentSections === "string" 
    ? JSON.parse(editState.contentSections) 
    : (editState.contentSections || []);
  const faqItems = typeof editState.faqItems === "string" 
    ? JSON.parse(editState.faqItems) 
    : (editState.faqItems || []);
  const internalLinks = typeof editState.internalLinks === "string" 
    ? JSON.parse(editState.internalLinks) 
    : (editState.internalLinks || []);

  const updateSection = (idx: number, field: string, value: string) => {
    const updated = [...contentSections];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditState({ ...editState, contentSections: updated });
  };

  const updateFaq = (idx: number, field: string, value: string) => {
    const updated = [...faqItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditState({ ...editState, faqItems: updated });
  };

  const addFaq = () => {
    setEditState({ ...editState, faqItems: [...faqItems, { question: "", answer: "" }] });
  };

  const removeFaq = (idx: number) => {
    setEditState({ ...editState, faqItems: faqItems.filter((_: any, i: number) => i !== idx) });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(editState);
    setSaving(false);
  };

  return (
    <div className="space-y-6" data-testid="article-editor">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{t("allied.articleAdmin.editArticle")}</h3>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700" data-testid="button-cancel-edit">
            <X className="w-4 h-4 inline mr-1" /> Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50" data-testid="button-save-article">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">{t("allied.articleAdmin.title")}</label>
          <input
            value={editState.title}
            onChange={(e) => setEditState({ ...editState, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            data-testid="input-article-title"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Meta Title <span className="text-gray-400">({(editState.metaTitle || "").length}/60)</span>
            </label>
            <input
              value={editState.metaTitle || ""}
              onChange={(e) => setEditState({ ...editState, metaTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              maxLength={60}
              data-testid="input-meta-title"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Meta Description <span className="text-gray-400">({(editState.metaDescription || "").length}/155)</span>
            </label>
            <input
              value={editState.metaDescription || ""}
              onChange={(e) => setEditState({ ...editState, metaDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              maxLength={155}
              data-testid="input-meta-description"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-900 mb-4">{t("allied.articleAdmin.contentSections")}</h4>
        <div className="space-y-4">
          {contentSections.map((section: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`section-editor-${i}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400 font-mono">{section.key}</span>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{section.type || "text"}</span>
              </div>
              <input
                value={section.heading || ""}
                onChange={(e) => updateSection(i, "heading", e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm mb-2 font-medium"
                placeholder={t("allied.articleAdmin.sectionHeading")}
                data-testid={`input-section-heading-${i}`}
              />
              <textarea
                value={section.body || ""}
                onChange={(e) => updateSection(i, "body", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[120px] font-mono text-xs"
                placeholder={t("allied.articleAdmin.sectionBodyHtml")}
                data-testid={`input-section-body-${i}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">{t("allied.articleAdmin.faqItems")}</h4>
          <button onClick={addFaq} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700" data-testid="button-add-faq">
            <Plus className="w-3.5 h-3.5" /> Add FAQ
          </button>
        </div>
        <div className="space-y-3">
          {faqItems.map((faq: any, i: number) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3" data-testid={`faq-editor-${i}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    value={faq.question || ""}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                    placeholder={t("allied.articleAdmin.question")}
                    data-testid={`input-faq-question-${i}`}
                  />
                  <textarea
                    value={faq.answer || ""}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm min-h-[60px]"
                    placeholder={t("allied.articleAdmin.answer")}
                    data-testid={`input-faq-answer-${i}`}
                  />
                </div>
                <button onClick={() => removeFaq(i)} className="p-1 text-red-400 hover:text-red-600" data-testid={`button-remove-faq-${i}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="font-semibold text-gray-900 mb-4">{t("allied.articleAdmin.internalLinks")}</h4>
        <div className="space-y-2">
          {internalLinks.map((link: any, i: number) => (
            <div key={i} className="flex items-center gap-3 text-sm" data-testid={`internal-link-${i}`}>
              <BookOpen className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span className="font-medium text-gray-700">{link.label}</span>
              <span className="text-xs text-gray-400">{link.url}</span>
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{link.context}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticlePreview({ article, onClose }: { article: Article; onClose: () => void }) {
  const contentSections = typeof article.contentSections === "string"
    ? JSON.parse(article.contentSections)
    : (article.contentSections || []);
  const faqItems = typeof article.faqItems === "string"
    ? JSON.parse(article.faqItems)
    : (article.faqItems || []);

  return (
    <div className="space-y-4" data-testid="article-preview">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{t("allied.articleAdmin.articlePreview")}</h3>
        <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700" data-testid="button-close-preview">
          <X className="w-4 h-4 inline mr-1" /> Close Preview
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-br from-teal-50 to-white p-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{t("allied.articleAdmin.home")}</span> <ChevronRight className="w-3.5 h-3.5" />
            <span>{article.professionSlug}</span> <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-700 font-medium truncate">{article.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="preview-title">{article.title}</h1>
          <p className="text-gray-600">{article.metaDescription}</p>
        </div>

        <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">
          {contentSections.map((section: any, i: number) => (
            <div key={i}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.body || "" }} />
            </div>
          ))}

          {faqItems.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.articleAdmin.frequentlyAskedQuestions")}</h2>
              <div className="space-y-3">
                {faqItems.map((faq: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateManager({ templates, onSave, onRefresh }: { templates: Template[]; onSave: (t: Template) => void; onRefresh: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, Template>>({});

  const getEditState = (t: Template) => editState[t.id] || t;

  const handleFieldChange = (id: string, field: string, value: any) => {
    const current = editState[id] || templates.find(t => t.id === id)!;
    setEditState({ ...editState, [id]: { ...current, [field]: value } });
  };

  return (
    <div className="space-y-4" data-testid="template-manager">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Article Templates ({templates.length})</h3>
        <button onClick={onRefresh} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700" data-testid="button-refresh-templates">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>
      <div className="space-y-2">
        {templates.map(template => {
          const state = getEditState(template);
          const isExpanded = expandedId === template.id;
          const sectionStructure = typeof state.sectionStructure === "string"
            ? JSON.parse(state.sectionStructure)
            : (state.sectionStructure || []);

          return (
            <div key={template.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid={`template-row-${template.templateKey}`}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : template.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                data-testid={`button-expand-template-${template.templateKey}`}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{template.displayName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${template.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{template.description}</p>
                </div>
                <span className="text-xs text-gray-400">{sectionStructure.length} sections</span>
              </button>
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{t("allied.articleAdmin.displayName")}</label>
                    <input
                      value={state.displayName}
                      onChange={(e) => handleFieldChange(template.id, "displayName", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      data-testid={`input-template-name-${template.templateKey}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{t("allied.articleAdmin.description")}</label>
                    <input
                      value={state.description || ""}
                      onChange={(e) => handleFieldChange(template.id, "description", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      data-testid={`input-template-desc-${template.templateKey}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{t("allied.articleAdmin.sections")}</label>
                    <div className="flex flex-wrap gap-1">
                      {sectionStructure.map((s: any, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{s.heading || s.key}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={state.isActive}
                        onChange={(e) => handleFieldChange(template.id, "isActive", e.target.checked)}
                        data-testid={`toggle-template-active-${template.templateKey}`}
                      />
                      Active
                    </label>
                    <button
                      onClick={() => onSave(getEditState(template))}
                      className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700"
                      data-testid={`button-save-template-${template.templateKey}`}
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
