import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import {
  Loader2, Plus, Search, Edit2, Trash2, Upload, Eye, Save,
  ChevronDown, ChevronRight, BookOpen, X, Check,
} from "lucide-react";

const PROFESSIONS = [
  { value: "paramedic", label: "Paramedic" },
  { value: "respiratory-therapy", label: "Respiratory Therapy" },
  { value: "mlt", label: "Medical Laboratory" },
  { value: "imaging", label: "Diagnostic Imaging" },
  { value: "social-work", label: "Social Work" },
  { value: "psychotherapy", label: "Psychotherapy" },
  { value: "addictions", label: "Addictions Counselling" },
  { value: "occupational-therapy", label: "Occupational Therapy" },
];

const STATUSES = ["draft", "published", "archived"];

const PROFESSION_HUB_PATH: Record<string, string> = {
  paramedic: "/allied-health/paramedic-encyclopedia",
  "respiratory-therapy": "/respiratory-therapy-encyclopedia",
  mlt: "/allied-health/mlt-encyclopedia",
  imaging: "/allied-health/imaging-encyclopedia",
  "social-work": "/allied-health/social-work-encyclopedia",
  psychotherapy: "/allied-health/psychotherapy-encyclopedia",
  addictions: "/allied-health/addictions-encyclopedia",
  "occupational-therapy": "/allied-health/occupational-therapy-encyclopedia",
};

interface EncyclopediaEntry {
  id: string;
  profession: string;
  slug: string;
  title: string;
  overview?: string;
  mechanism?: string;
  clinicalRelevance?: string;
  signsSymptoms?: string;
  assessmentMethods?: string;
  management?: string;
  complications?: string;
  clinicalPearls?: any[];
  examPitfalls?: any[];
  faq?: any[];
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  relatedTopicSlugs?: string[];
  crossProfessionLinks?: any[];
  relatedLessonSlugs?: string[];
  relatedQuestionTopics?: string[];
  status?: string;
  category?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

const EMPTY_ENTRY: Partial<EncyclopediaEntry> = {
  profession: "paramedic",
  slug: "",
  title: "",
  overview: "",
  mechanism: "",
  clinicalRelevance: "",
  signsSymptoms: "",
  assessmentMethods: "",
  management: "",
  complications: "",
  clinicalPearls: [],
  examPitfalls: [],
  faq: [],
  seoTitle: "",
  metaDescription: "",
  keywords: [],
  relatedTopicSlugs: [],
  crossProfessionLinks: [],
  relatedLessonSlugs: [],
  relatedQuestionTopics: [],
  status: "draft",
  category: "",
  sortOrder: 0,
};

export default function EncyclopediaAdmin() {
  const { t } = useI18n();
  const [items, setItems] = useState<EncyclopediaEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterProfession, setFilterProfession] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any[]>([]);

  const [editing, setEditing] = useState<Partial<EncyclopediaEntry> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [importingBulk, setImportingBulk] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "edit" | "bulk">("list");

  const fetchItems = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterProfession) params.set("profession", filterProfession);
    if (filterStatus) params.set("status", filterStatus);
    if (searchQuery) params.set("search", searchQuery);
    params.set("limit", "50");

    fetch(`/api/encyclopedia-admin/list?${params}`, {
      headers: { "x-admin-id": localStorage.getItem("adminUserId") || "" },
    })
      .then(r => r.json())
      .then(d => {
        setItems(d.items || []);
        setTotal(d.total || 0);
        if (d.stats) setStats(d.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [filterProfession, filterStatus, searchQuery]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? "/api/encyclopedia" : `/api/encyclopedia/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": localStorage.getItem("adminUserId") || "",
        },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Save failed");
        return;
      }
      setActiveTab("list");
      setEditing(null);
      fetchItems();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this encyclopedia entry?")) return;
    await fetch(`/api/encyclopedia/${id}`, {
      method: "DELETE",
      headers: { "x-admin-id": localStorage.getItem("adminUserId") || "" },
    });
    fetchItems();
  };

  const handleBulkImport = async () => {
    setImportingBulk(true);
    setBulkResult(null);
    try {
      const entries = JSON.parse(bulkJson);
      const res = await fetch("/api/encyclopedia/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": localStorage.getItem("adminUserId") || "",
        },
        body: JSON.stringify({ entries: Array.isArray(entries) ? entries : [entries] }),
      });
      const result = await res.json();
      setBulkResult(result);
      if (result.imported > 0) fetchItems();
    } catch (e: any) {
      setBulkResult({ error: e.message });
    } finally {
      setImportingBulk(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" data-testid="encyclopedia-admin-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-['DM_Sans']">{t("allied.encyclopediaAdmin.encyclopediaAdmin")}</h1>
          <p className="text-sm text-gray-500">{t("allied.encyclopediaAdmin.manageEncyclopediaEntriesAcrossAll")}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab("edit"); setEditing({ ...EMPTY_ENTRY }); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
            data-testid="button-new-entry"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
          <button
            onClick={() => setActiveTab(activeTab === "bulk" ? "list" : "bulk")}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            data-testid="button-bulk-import"
          >
            <Upload className="w-4 h-4" /> Bulk Import
          </button>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" data-testid="stats-grid">
          {PROFESSIONS.map(p => {
            const profStats = stats.filter((s: any) => s.profession === p.value);
            const published = profStats.find((s: any) => s.status === "published")?.count || 0;
            const draft = profStats.find((s: any) => s.status === "draft")?.count || 0;
            return (
              <div key={p.value} className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-xs text-gray-500 mb-1">{p.label}</div>
                <div className="text-lg font-bold text-gray-900">{published + draft}</div>
                <div className="text-xs text-gray-400">{published} published, {draft} draft</div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "list" && (
        <>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("allied.encyclopediaAdmin.searchEntries")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                data-testid="input-admin-search"
              />
            </div>
            <select
              value={filterProfession}
              onChange={e => setFilterProfession(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              data-testid="select-admin-profession"
            >
              <option value="">{t("allied.encyclopediaAdmin.allProfessions")}</option>
              {PROFESSIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              data-testid="select-admin-status"
            >
              <option value="">{t("allied.encyclopediaAdmin.allStatuses")}</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-700">{t("allied.encyclopediaAdmin.title")}</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">{t("allied.encyclopediaAdmin.profession")}</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">{t("allied.encyclopediaAdmin.category")}</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">{t("allied.encyclopediaAdmin.status")}</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-700">{t("allied.encyclopediaAdmin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`row-entry-${item.id}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-400">{item.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {PROFESSIONS.find(p => p.value === item.profession)?.label || item.profession}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.category || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === "published" ? "bg-green-100 text-green-700" :
                          item.status === "archived" ? "bg-gray-100 text-gray-600" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`${PROFESSION_HUB_PATH[item.profession] || "/"}/${item.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors"
                            title={t("allied.encyclopediaAdmin.preview")}
                            data-testid={`button-preview-${item.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => { setEditing({ ...item }); setActiveTab("edit"); }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title={t("allied.encyclopediaAdmin.edit")}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title={t("allied.encyclopediaAdmin.delete")}
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
              {items.length === 0 && (
                <div className="text-center py-10 text-gray-400">{t("allied.encyclopediaAdmin.noEntriesFound")}</div>
              )}
              <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
                Showing {items.length} of {total} entries
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "edit" && editing && (
        <EntryEditor
          entry={editing}
          onChange={setEditing}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setActiveTab("list"); }}
          saving={saving}
        />
      )}

      {activeTab === "bulk" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="bulk-import-panel">
          <h2 className="text-lg font-bold text-gray-900 mb-3">{t("allied.encyclopediaAdmin.bulkImportEncyclopediaEntries")}</h2>
          <p className="text-sm text-gray-500 mb-4">
            Paste a JSON array of encyclopedia entries. Each entry must have profession, slug, and title.
            Existing entries with the same profession+slug will be updated.
          </p>
          <textarea
            value={bulkJson}
            onChange={e => setBulkJson(e.target.value)}
            placeholder={`[\n  {\n    "profession": "paramedic",\n    "slug": "airway-management",\n    "title": "Airway Management",\n    "overview": "...",\n    "status": "draft"\n  }\n]`}
            rows={12}
            className="w-full p-4 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
            data-testid="textarea-bulk-json"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkImport}
              disabled={importingBulk || !bulkJson.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
              data-testid="button-run-bulk-import"
            >
              {importingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importingBulk ? "Importing..." : "Import Entries"}
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
              data-testid="button-cancel-bulk"
            >
              Cancel
            </button>
          </div>
          {bulkResult && (
            <div className={`mt-4 p-4 rounded-xl border text-sm ${bulkResult.error ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`} data-testid="bulk-result">
              {bulkResult.error ? (
                <p>Error: {bulkResult.error}</p>
              ) : (
                <div>
                  <p className="font-medium">{bulkResult.imported} entries imported successfully</p>
                  {bulkResult.errors > 0 && (
                    <div className="mt-2 text-red-600">
                      <p>{bulkResult.errors} errors:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {bulkResult.errorDetails?.map((e: any, i: number) => (
                          <li key={i}>{e.slug}: {e.error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EntryEditor({ entry, onChange, onSave, onCancel, saving }: {
  entry: Partial<EncyclopediaEntry>;
  onChange: (e: Partial<EncyclopediaEntry>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["basic", "content"]));

  const toggle = (section: string) => {
    const next = new Set(openSections);
    next.has(section) ? next.delete(section) : next.add(section);
    setOpenSections(next);
  };

  const update = (field: string, value: any) => {
    onChange({ ...entry, [field]: value });
  };

  const updateJsonArray = (field: string, value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) update(field, parsed);
    } catch {}
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl" data-testid="entry-editor">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          {entry.id ? "Edit Entry" : "New Encyclopedia Entry"}
        </h2>
        <div className="flex items-center gap-2">
          {entry.id && entry.status !== "published" && (
            <button
              onClick={() => { update("status", "published"); setTimeout(onSave, 100); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              data-testid="button-publish"
            >
              <Check className="w-3.5 h-3.5" /> Publish
            </button>
          )}
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
            data-testid="button-save-entry"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600" data-testid="button-cancel-edit">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <CollapsibleSection title={t("allied.encyclopediaAdmin.basicInformation")} id="basic" open={openSections.has("basic")} onToggle={toggle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput label={t("allied.encyclopediaAdmin.title2")} value={entry.title || ""} onChange={v => update("title", v)} testId="input-title" />
            <FieldInput label={t("allied.encyclopediaAdmin.slug")} value={entry.slug || ""} onChange={v => update("slug", v)} testId="input-slug"
              hint="URL-safe identifier (e.g., airway-management)" />
            <FieldSelect label={t("allied.encyclopediaAdmin.profession2")} value={entry.profession || ""} onChange={v => update("profession", v)}
              options={PROFESSIONS.map(p => ({ value: p.value, label: p.label }))} testId="select-profession" />
            <FieldInput label={t("allied.encyclopediaAdmin.category2")} value={entry.category || ""} onChange={v => update("category", v)} testId="input-category"
              hint="Group topics by category" />
            <FieldSelect label={t("allied.encyclopediaAdmin.status2")} value={entry.status || "draft"} onChange={v => update("status", v)}
              options={STATUSES.map(s => ({ value: s, label: s }))} testId="select-status" />
            <FieldInput label={t("allied.encyclopediaAdmin.sortOrder")} value={String(entry.sortOrder || 0)} onChange={v => update("sortOrder", parseInt(v) || 0)}
              testId="input-sort-order" type="number" />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("allied.encyclopediaAdmin.contentSections")} id="content" open={openSections.has("content")} onToggle={toggle}>
          <div className="space-y-4">
            <FieldTextarea label={t("allied.encyclopediaAdmin.overview")} value={entry.overview || ""} onChange={v => update("overview", v)} testId="textarea-overview" rows={4} />
            <FieldTextarea label={t("allied.encyclopediaAdmin.mechanismPhysiology")} value={entry.mechanism || ""} onChange={v => update("mechanism", v)} testId="textarea-mechanism" rows={4} />
            <FieldTextarea label={t("allied.encyclopediaAdmin.clinicalRelevance")} value={entry.clinicalRelevance || ""} onChange={v => update("clinicalRelevance", v)} testId="textarea-clinical-relevance" rows={4} />
            <FieldTextarea label={t("allied.encyclopediaAdmin.signsSymptoms")} value={entry.signsSymptoms || ""} onChange={v => update("signsSymptoms", v)} testId="textarea-signs-symptoms" rows={4} />
            <FieldTextarea label={t("allied.encyclopediaAdmin.assessmentDiagnosticMethods")} value={entry.assessmentMethods || ""} onChange={v => update("assessmentMethods", v)} testId="textarea-assessment" rows={4} />
            <FieldTextarea label={t("allied.encyclopediaAdmin.managementProfessionalPractice")} value={entry.management || ""} onChange={v => update("management", v)} testId="textarea-management" rows={4} />
            <FieldTextarea label={t("allied.encyclopediaAdmin.complications")} value={entry.complications || ""} onChange={v => update("complications", v)} testId="textarea-complications" rows={3} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("allied.encyclopediaAdmin.clinicalPearlsExamPitfalls")} id="pearls" open={openSections.has("pearls")} onToggle={toggle}>
          <div className="space-y-4">
            <FieldTextarea
              label={t("allied.encyclopediaAdmin.clinicalPearlsJsonArray")}
              value={JSON.stringify(entry.clinicalPearls || [], null, 2)}
              onChange={v => updateJsonArray("clinicalPearls", v)}
              testId="textarea-clinical-pearls"
              rows={5}
              hint='[{"title":"Pearl 1","content":"Description"}]'
            />
            <FieldTextarea
              label={t("allied.encyclopediaAdmin.examPitfallsJsonArray")}
              value={JSON.stringify(entry.examPitfalls || [], null, 2)}
              onChange={v => updateJsonArray("examPitfalls", v)}
              testId="textarea-exam-pitfalls"
              rows={5}
              hint='[{"title":"Pitfall 1","content":"Description"}]'
            />
            <FieldTextarea
              label={t("allied.encyclopediaAdmin.faqJsonArray")}
              value={JSON.stringify(entry.faq || [], null, 2)}
              onChange={v => updateJsonArray("faq", v)}
              testId="textarea-faq"
              rows={5}
              hint='[{"question":"Q1","answer":"A1"}]'
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("allied.encyclopediaAdmin.seoMetadata")} id="seo" open={openSections.has("seo")} onToggle={toggle}>
          <div className="space-y-4">
            <FieldInput label={t("allied.encyclopediaAdmin.seoTitle")} value={entry.seoTitle || ""} onChange={v => update("seoTitle", v)} testId="input-seo-title"
              hint="Custom title for search engines (50-60 chars)" />
            <FieldTextarea label={t("allied.encyclopediaAdmin.metaDescription")} value={entry.metaDescription || ""} onChange={v => update("metaDescription", v)}
              testId="textarea-meta-description" rows={2} hint="155-160 characters for search results" />
            <FieldInput label={t("allied.encyclopediaAdmin.keywordsCommaseparated")} value={(entry.keywords || []).join(", ")}
              onChange={v => update("keywords", v.split(",").map((k: string) => k.trim()).filter(Boolean))}
              testId="input-keywords" />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t("allied.encyclopediaAdmin.relatedContentLinks")} id="links" open={openSections.has("links")} onToggle={toggle}>
          <div className="space-y-4">
            <FieldInput label={t("allied.encyclopediaAdmin.relatedTopicSlugsCommaseparated")}
              value={(entry.relatedTopicSlugs || []).join(", ")}
              onChange={v => update("relatedTopicSlugs", v.split(",").map((s: string) => s.trim()).filter(Boolean))}
              testId="input-related-topics" hint="Slugs of related topics in the same profession" />
            <FieldTextarea
              label={t("allied.encyclopediaAdmin.crossprofessionLinksJsonArray")}
              value={JSON.stringify(entry.crossProfessionLinks || [], null, 2)}
              onChange={v => updateJsonArray("crossProfessionLinks", v)}
              testId="textarea-cross-profession"
              rows={3}
              hint='[{"profession":"mlt","slug":"blood-gas-analysis"}]'
            />
            <FieldInput label={t("allied.encyclopediaAdmin.relatedLessonSlugsCommaseparated")}
              value={(entry.relatedLessonSlugs || []).join(", ")}
              onChange={v => update("relatedLessonSlugs", v.split(",").map((s: string) => s.trim()).filter(Boolean))}
              testId="input-related-lessons" />
            <FieldInput label={t("allied.encyclopediaAdmin.relatedQuestionTopicsCommaseparated")}
              value={(entry.relatedQuestionTopics || []).join(", ")}
              onChange={v => update("relatedQuestionTopics", v.split(",").map((s: string) => s.trim()).filter(Boolean))}
              testId="input-related-questions" />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, id, open, onToggle, children }: {
  title: string; id: string; open: boolean; onToggle: (id: string) => void; children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition-colors"
        data-testid={`toggle-section-${id}`}
      >
        <span className="font-medium text-gray-900 text-sm">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
}

function FieldInput({ label, value, onChange, testId, hint, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; testId: string; hint?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        data-testid={testId}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function FieldTextarea({ label, value, onChange, testId, hint, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; testId: string; hint?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        data-testid={testId}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options, testId }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; testId: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        data-testid={testId}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
