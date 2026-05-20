import { useState, useEffect, useCallback } from "react";
import {
  Settings, BookOpen, Layers, BookA, GitCompare, GraduationCap,
  Plus, Pencil, Trash2, Eye, Search, Loader2, AlertTriangle,
  CheckCircle, XCircle, ChevronDown, Save, ArrowLeft, Link2
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/lib/i18n";
const ADMIN_ID = "d9b0e5b3-83c7-4e08-b6b7-6cf9cc33b225";

type ContentTab = "topic" | "category" | "glossary" | "comparison" | "study-guide";

const TAB_CONFIG: { id: ContentTab; label: string; icon: any; titleField: string }[] = [
  { id: "topic", label: "Topics", icon: BookOpen, titleField: "title" },
  { id: "category", label: "Categories", icon: Layers, titleField: "title" },
  { id: "glossary", label: "Glossary", icon: BookA, titleField: "term" },
  { id: "comparison", label: "Comparisons", icon: GitCompare, titleField: "title" },
  { id: "study-guide", label: "Study Guides", icon: GraduationCap, titleField: "title" },
];

const URL_PREFIXES: Record<ContentTab, string> = {
  topic: "/allied-health/paramedic/topic",
  category: "/allied-health/paramedic/category",
  glossary: "/allied-health/paramedic/glossary",
  comparison: "/allied-health/paramedic/compare",
  "study-guide": "/allied-health/paramedic/study-guide",
};

async function apiFetch(url: string, opts?: RequestInit) {
  const { t } = useI18n();
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}adminId=${ADMIN_ID}`, {
    ...opts,
    headers: { "Content-Type": "application/json", "x-admin-id": ADMIN_ID, ...(opts?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function SeoValidationWarnings({ item, type }: { item: any; type: ContentTab }) {
  const warnings: string[] = [];
  const titleField = type === "glossary" ? "term" : "title";
  const title = item.seoTitle || item[titleField] || "";
  if (!title) warnings.push("Missing title");
  if (title.length > 60) warnings.push(`SEO title too long (${title.length}/60 chars)`);
  if (!item.metaDescription) warnings.push("Missing meta description");
  else if (item.metaDescription.length > 160) warnings.push(`Meta description too long (${item.metaDescription.length}/160 chars)`);
  if (!item.slug) warnings.push("Missing slug");
  if (item.isCornerstone && (!item.faq || (Array.isArray(item.faq) && item.faq.length === 0))) {
    warnings.push("Cornerstone page should have FAQ section");
  }
  if (type === "topic" && item.wordCount !== undefined && item.wordCount < 300) {
    warnings.push("Thin content: less than 300 words");
  }
  if (warnings.length === 0) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4" data-testid="seo-warnings">
      <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-1">
        <AlertTriangle className="w-4 h-4" /> SEO Warnings
      </div>
      <ul className="list-disc pl-5 text-xs text-amber-600 space-y-0.5">
        {warnings.map((w, i) => <li key={i}>{w}</li>)}
      </ul>
    </div>
  );
}

function ItemEditor({ type, item, onSave, onCancel }: {
  type: ContentTab;
  item: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<any>(item || {});
  const [saving, setSaving] = useState(false);
  const [internalLinks, setInternalLinks] = useState<any[]>([]);
  const { toast } = useToast();

  const set = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

  const loadLinks = useCallback(async () => {
    if (!item?.id) return;
    try {
      const links = await apiFetch(`/api/paramedic-seo/internal-links/${type}/${item.id}`);
      setInternalLinks(links);
    } catch {}
  }, [type, item?.id]);

  useEffect(() => { loadLinks(); }, [loadLinks]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const jsonField = (field: string, label: string) => {
    const val = form[field];
    const strVal = typeof val === "string" ? val : JSON.stringify(val || [], null, 2);
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label} (JSON)</label>
        <textarea
          value={strVal}
          onChange={(e) => {
            try { set(field, JSON.parse(e.target.value)); } catch { set(field, e.target.value); }
          }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono h-32"
          data-testid={`input-${field}`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6" data-testid="item-editor">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onCancel} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700" data-testid="button-back">
          <ArrowLeft className="w-4 h-4" /> Back to list
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          data-testid="button-save"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <SeoValidationWarnings item={form} type={type} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {type === "glossary" ? (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.term")}</label>
            <input value={form.term || ""} onChange={(e) => set("term", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-term" />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.title")}</label>
            <input value={form.title || ""} onChange={(e) => set("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-title" />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.slug")}</label>
          <input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-slug" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.seoTitle")}</label>
          <input value={form.seoTitle || ""} onChange={(e) => set("seoTitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-seo-title" />
          {form.seoTitle && <span className="text-xs text-gray-400">{form.seoTitle.length}/60</span>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.status")}</label>
          <select value={form.status || "draft"} onChange={(e) => set("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-status">
            <option value="draft">{t("allied.paramedicSeoAdmin.draft")}</option>
            <option value="published">{t("allied.paramedicSeoAdmin.published")}</option>
            <option value="archived">{t("allied.paramedicSeoAdmin.archived")}</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.metaDescription")}</label>
          <textarea value={form.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-20" data-testid="input-meta-description" />
          {form.metaDescription && <span className="text-xs text-gray-400">{form.metaDescription.length}/160</span>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.difficulty")}</label>
          <select value={form.difficulty || "intermediate"} onChange={(e) => set("difficulty", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-difficulty">
            <option value="beginner">{t("allied.paramedicSeoAdmin.beginner")}</option>
            <option value="intermediate">{t("allied.paramedicSeoAdmin.intermediate")}</option>
            <option value="advanced">{t("allied.paramedicSeoAdmin.advanced")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.examRelevance")}</label>
          <select value={form.examRelevance || "medium"} onChange={(e) => set("examRelevance", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-exam-relevance">
            <option value="low">{t("allied.paramedicSeoAdmin.low")}</option>
            <option value="medium">{t("allied.paramedicSeoAdmin.medium")}</option>
            <option value="high">{t("allied.paramedicSeoAdmin.high")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.region")}</label>
          <select value={form.region || "BOTH"} onChange={(e) => set("region", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="select-region">
            <option value="BOTH">{t("allied.paramedicSeoAdmin.both")}</option>
            <option value="US">{t("allied.paramedicSeoAdmin.usOnly")}</option>
            <option value="CA">{t("allied.paramedicSeoAdmin.canadaOnly")}</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isCornerstone || false} onChange={(e) => set("isCornerstone", e.target.checked)} data-testid="check-cornerstone" />
            Cornerstone Content
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNoindex || false} onChange={(e) => set("isNoindex", e.target.checked)} data-testid="check-noindex" />
            Noindex
          </label>
        </div>
      </div>

      {type === "topic" && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.targetKeyword")}</label>
            <input value={form.targetKeyword || ""} onChange={(e) => set("targetKeyword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-target-keyword" />
          </div>
          {jsonField("sections", "Content Sections")}
          {jsonField("faq", "FAQ")}
          {jsonField("examTips", "Exam Tips")}
          {jsonField("clinicalPearls", "Clinical Pearls")}
        </div>
      )}

      {type === "category" && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.description")}</label>
            <textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-24" data-testid="input-description" />
          </div>
        </div>
      )}

      {type === "glossary" && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.definition")}</label>
            <textarea value={form.definition || ""} onChange={(e) => set("definition", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-24" data-testid="input-definition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.abbreviation")}</label>
            <input value={form.abbreviation || ""} onChange={(e) => set("abbreviation", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-abbreviation" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.extendedDescription")}</label>
            <textarea value={form.extendedDescription || ""} onChange={(e) => set("extendedDescription", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-24" data-testid="input-extended-description" />
          </div>
          {jsonField("usageExamples", "Usage Examples")}
        </div>
      )}

      {type === "comparison" && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.itemA")}</label>
              <input value={form.itemA || ""} onChange={(e) => set("itemA", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-item-a" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.itemB")}</label>
              <input value={form.itemB || ""} onChange={(e) => set("itemB", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-item-b" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.summary")}</label>
            <textarea value={form.summary || ""} onChange={(e) => set("summary", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-20" data-testid="input-summary" />
          </div>
          {jsonField("comparisonPoints", "Comparison Points")}
          {jsonField("faq", "FAQ")}
        </div>
      )}

      {type === "study-guide" && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("allied.paramedicSeoAdmin.estimatedMinutes")}</label>
            <input type="number" value={form.estimatedMinutes || 30} onChange={(e) => set("estimatedMinutes", parseInt(e.target.value) || 30)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" data-testid="input-estimated-minutes" />
          </div>
          {jsonField("objectives", "Learning Objectives")}
          {jsonField("sections", "Content Sections")}
          {jsonField("checklist", "Study Checklist")}
          {jsonField("faq", "FAQ")}
          {jsonField("miniQuiz", "Mini Quiz")}
        </div>
      )}

      {jsonField("manualLinks", "Manual Links Override")}

      {internalLinks.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Link2 className="w-4 h-4" /> Auto Internal Links ({internalLinks.length})
          </h4>
          <div className="space-y-1">
            {internalLinks.map((link: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{link.source}</span>
                <a href={link.url} className="text-teal-600 hover:underline">{link.title}</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParamedicSeoAdmin() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<ContentTab>("topic");
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState<Record<string, Record<string, number>>>({});

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const data = await apiFetch(`/api/paramedic-seo/${tab}?${params.toString()}`);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [tab, search, statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      const data = await apiFetch("/api/paramedic-seo/stats");
      setStats(data);
    } catch {}
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await apiFetch(`/api/paramedic-seo/${tab}/${data.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        toast({ title: "Saved" });
      } else {
        await apiFetch(`/api/paramedic-seo/${tab}`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast({ title: "Created" });
      }
      setEditing(null);
      setCreating(false);
      loadItems();
      loadStats();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await apiFetch(`/api/paramedic-seo/${tab}/${id}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      loadItems();
      loadStats();
    } catch (e: any) {
      toast({ title: "Delete failed", description: e.message, variant: "destructive" });
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.paramedicSeoAdmin.adminAccessRequired")}</h1>
        <p className="text-gray-600">{t("allied.paramedicSeoAdmin.youNeedAdminPrivilegesTo")}</p>
      </div>
    );
  }

  if (editing || creating) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ItemEditor
          type={tab}
          item={editing || {}}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setCreating(false); }}
        />
      </div>
    );
  }

  const titleField = TAB_CONFIG.find(t => t.id === tab)?.titleField || "title";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="paramedic-seo-admin">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-title">{t("allied.paramedicSeoAdmin.paramedicSeoManager")}</h1>
            <p className="text-sm text-gray-500">{t("allied.paramedicSeoAdmin.createAndManageParamedicSeo")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {TAB_CONFIG.map(t => {
          const typeStats = stats[t.id] || {};
          const published = typeStats.published || 0;
          const draft = typeStats.draft || 0;
          return (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-3 text-center" data-testid={`stat-${t.id}`}>
              <div className="text-lg font-bold text-gray-900">{published + draft}</div>
              <div className="text-xs text-gray-500">{t.label}</div>
              <div className="text-xs text-green-600">{published} published</div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {TAB_CONFIG.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearch(""); setStatusFilter(""); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              tab === t.id ? "bg-red-50 text-red-700 border border-red-200" : "text-gray-500 hover:text-gray-700 border border-gray-200"
            }`}
            data-testid={`tab-${t.id}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${TAB_CONFIG.find(t => t.id === tab)?.label || ""}...`}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
            data-testid="input-search"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          data-testid="select-filter-status"
        >
          <option value="">{t("allied.paramedicSeoAdmin.allStatus")}</option>
          <option value="draft">{t("allied.paramedicSeoAdmin.draft2")}</option>
          <option value="published">{t("allied.paramedicSeoAdmin.published2")}</option>
          <option value="archived">{t("allied.paramedicSeoAdmin.archived2")}</option>
        </select>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          data-testid="button-create"
        >
          <Plus className="w-4 h-4" /> New {TAB_CONFIG.find(t => t.id === tab)?.label.replace(/s$/, "")}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No {TAB_CONFIG.find(t => t.id === tab)?.label.toLowerCase()} found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">{titleField === "term" ? "Term" : "Title"}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicSeoAdmin.slug2")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicSeoAdmin.status2")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicSeoAdmin.difficulty2")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t("allied.paramedicSeoAdmin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50" data-testid={`row-${item.id}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item[titleField]}</div>
                    {item.isCornerstone && <span className="text-xs text-amber-600">{t("allied.paramedicSeoAdmin.cornerstone")}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs font-mono">{item.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      item.status === "published" ? "bg-green-100 text-green-700" :
                      item.status === "archived" ? "bg-gray-100 text-gray-600" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status === "published" ? <CheckCircle className="w-3 h-3" /> :
                       item.status === "archived" ? <XCircle className="w-3 h-3" /> : null}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{item.difficulty}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(item)}
                        className="p-1.5 text-gray-400 hover:text-teal-600 rounded"
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {item.status === "published" && (
                        <a
                          href={`${URL_PREFIXES[tab]}/${item.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                          data-testid={`button-preview-${item.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
            Showing {items.length} of {total} items
          </div>
        </div>
      )}
    </div>
  );
}
