import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Brain, FileText, Trash2, Plus, Edit2, Eye, EyeOff, Search, ChevronRight, LayoutDashboard, Upload, X, Save, ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { useI18n } from "@/lib/i18n";
const BASE = "/admin/allied-content/pharmacy-technician";

function getToken() {

  return localStorage.getItem("token") || "";
}

function AdminNav({ active }: { active: string }) {
  const links = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: BASE },
    { key: "lessons", label: "Lessons", icon: BookOpen, href: `${BASE}/lessons` },
    { key: "questions", label: "Questions", icon: FileText, href: `${BASE}/questions` },
    { key: "flashcards", label: "Flashcard Decks", icon: Brain, href: `${BASE}/flashcards` },
    { key: "exams", label: "Exams", icon: FileText, href: `${BASE}/exams` },
    { key: "import", label: "Import", icon: Upload, href: `${BASE}/import` },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6" data-testid="admin-nav">
      {links.map(l => (
        <Link
          key={l.key}
          href={l.href}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${active === l.key ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          data-testid={`nav-${l.key}`}
        >
          <l.icon className="w-4 h-4" />
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link href="/admin/allied" className="hover:text-teal-600">{t("allied.pharmtechAdmin.admin")}</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight className="w-3.5 h-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-teal-600">{item.label}</Link>
          ) : (
            <span className="text-green-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pharmtech/stats", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Lessons", count: stats.lessonCount, href: `${BASE}/lessons`, icon: BookOpen, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Questions", count: stats.questionCount, href: `${BASE}/questions`, icon: FileText, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Flashcard Decks", count: stats.deckCount, href: `${BASE}/flashcards`, icon: Brain, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "Flashcards", count: stats.flashcardCount, href: `${BASE}/flashcards`, icon: Brain, color: "bg-violet-50 text-violet-700 border-violet-200" },
    { label: "Exams", count: stats.examCount, href: `${BASE}/exams`, icon: FileText, color: "bg-amber-50 text-amber-700 border-amber-200" },
  ] : [];

  return (
    <>
      <Breadcrumb items={[{ label: "Pharmacy Technician" }]} />
      <AdminNav active="dashboard" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-admin-title">{t("allied.pharmtechAdmin.pharmacyTechnicianContentManager")}</h1>
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="dashboard-stats">
          {cards.map(c => (
            <Link key={c.label} href={c.href} className={`rounded-2xl border p-6 hover:shadow-md transition-all ${c.color}`} data-testid={`stat-card-${c.label.toLowerCase().replace(/ /g, "-")}`}>
              <c.icon className="w-6 h-6 mb-2" />
              <div className="text-3xl font-bold">{c.count}</div>
              <div className="text-sm font-medium mt-1">{c.label}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function LessonForm({ item, onSave, onCancel }: { item?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: item?.slug || "",
    title: item?.title || "",
    category: item?.category || "",
    summary: item?.summary || "",
    body: item?.body || "",
    objectives: (item?.objectives || []).join("\n"),
    keyPoints: (item?.keyPoints || []).join("\n"),
    commonMistakes: (item?.commonMistakes || []).join("\n"),
    relatedDeckSlugs: (item?.relatedDeckSlugs || []).join(", "),
    seoTitle: item?.seoTitle || "",
    seoDescription: item?.seoDescription || "",
    published: item?.published ?? true,
    sortOrder: item?.sortOrder || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title || !form.category) { setError("Slug, title, and category are required"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        objectives: form.objectives.split("\n").filter(Boolean),
        keyPoints: form.keyPoints.split("\n").filter(Boolean),
        commonMistakes: form.commonMistakes.split("\n").filter(Boolean),
        relatedDeckSlugs: form.relatedDeckSlugs.split(",").map(s => s.trim()).filter(Boolean),
      };
      const url = item ? `/api/admin/pharmtech/lessons/${item.id}` : "/api/admin/pharmtech/lessons";
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onSave();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="lesson-form">
      <h3 className="text-lg font-semibold text-gray-900">{item ? "Edit Lesson" : "Create Lesson"}</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.slug")}</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" disabled={!!item} data-testid="input-lesson-slug" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.title")}</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-lesson-title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.category")}</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-lesson-category" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.sortOrder")}</label>
          <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-lesson-sort" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.summary")}</label>
        <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={2} data-testid="input-lesson-summary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.bodyHtmlmarkdown")}</label>
        <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm font-mono" rows={8} data-testid="input-lesson-body" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.objectivesOnePerLine")}</label>
        <textarea value={form.objectives} onChange={e => setForm({ ...form, objectives: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={3} data-testid="input-lesson-objectives" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.keyPointsOnePerLine")}</label>
        <textarea value={form.keyPoints} onChange={e => setForm({ ...form, keyPoints: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={3} data-testid="input-lesson-keypoints" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.commonMistakesOnePerLine")}</label>
        <textarea value={form.commonMistakes} onChange={e => setForm({ ...form, commonMistakes: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={3} data-testid="input-lesson-mistakes" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.relatedDeckSlugsCommaseparated")}</label>
          <input value={form.relatedDeckSlugs} onChange={e => setForm({ ...form, relatedDeckSlugs: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-lesson-decks" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.seoTitle")}</label>
          <input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-lesson-seotitle" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.seoDescription")}</label>
        <input value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-lesson-seodesc" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="input-lesson-published" />
        <span className="text-sm font-medium text-gray-700">{t("allied.pharmtechAdmin.published")}</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2" data-testid="button-save-lesson">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-cancel-lesson">{t("allied.pharmtechAdmin.cancel")}</button>
      </div>
    </form>
  );
}

function QuestionForm({ item, onSave, onCancel }: { item?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    stem: item?.stem || "",
    options: item?.options ? (Array.isArray(item.options) ? item.options : []).join("\n") : "",
    correctIndex: item?.correctIndex ?? 0,
    rationale: item?.rationale || "",
    category: item?.category || "",
    difficulty: item?.difficulty ?? 2,
    lessonSlug: item?.lessonSlug || "",
    published: item?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.stem || !form.rationale || !form.category) { setError("Stem, rationale, and category are required"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, options: form.options.split("\n").filter(Boolean) };
      const url = item ? `/api/admin/pharmtech/questions/${item.id}` : "/api/admin/pharmtech/questions";
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onSave();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="question-form">
      <h3 className="text-lg font-semibold text-gray-900">{item ? "Edit Question" : "Create Question"}</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.questionStem")}</label>
        <textarea value={form.stem} onChange={e => setForm({ ...form, stem: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={3} data-testid="input-question-stem" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.optionsOnePerLine")}</label>
        <textarea value={form.options} onChange={e => setForm({ ...form, options: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={4} data-testid="input-question-options" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.correctIndex0based")}</label>
          <input type="number" value={form.correctIndex} onChange={e => setForm({ ...form, correctIndex: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" min={0} data-testid="input-question-correct" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.category2")}</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-question-category" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.difficulty15")}</label>
          <input type="number" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" min={1} max={5} data-testid="input-question-difficulty" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.rationale")}</label>
        <textarea value={form.rationale} onChange={e => setForm({ ...form, rationale: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={3} data-testid="input-question-rationale" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.lessonSlugOptional")}</label>
        <input value={form.lessonSlug} onChange={e => setForm({ ...form, lessonSlug: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-question-lesson" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="input-question-published" />
        <span className="text-sm font-medium text-gray-700">{t("allied.pharmtechAdmin.published2")}</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2" data-testid="button-save-question">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-cancel-question">{t("allied.pharmtechAdmin.cancel2")}</button>
      </div>
    </form>
  );
}

function FlashcardDeckForm({ item, onSave, onCancel }: { item?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: item?.slug || "",
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "",
    lessonSlug: item?.lessonSlug || "",
    published: item?.published ?? true,
    sortOrder: item?.sortOrder || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title || !form.category) { setError("Slug, title, and category are required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = item ? `/api/admin/pharmtech/flashcard-decks/${item.id}` : "/api/admin/pharmtech/flashcard-decks";
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onSave();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="flashcard-deck-form">
      <h3 className="text-lg font-semibold text-gray-900">{item ? "Edit Flashcard Deck" : "Create Flashcard Deck"}</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.slug2")}</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" disabled={!!item} data-testid="input-deck-slug" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.title2")}</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-deck-title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.category3")}</label>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-deck-category" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.sortOrder2")}</label>
          <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-deck-sort" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.description")}</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={2} data-testid="input-deck-description" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.lessonSlugOptional2")}</label>
        <input value={form.lessonSlug} onChange={e => setForm({ ...form, lessonSlug: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-deck-lesson" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="input-deck-published" />
        <span className="text-sm font-medium text-gray-700">{t("allied.pharmtechAdmin.published3")}</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2" data-testid="button-save-deck">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-cancel-deck">{t("allied.pharmtechAdmin.cancel3")}</button>
      </div>
    </form>
  );
}

function ExamForm({ item, onSave, onCancel }: { item?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    slug: item?.slug || "",
    title: item?.title || "",
    description: item?.description || "",
    questionIds: (item?.questionIds || []).join(", "),
    timeLimitMinutes: item?.timeLimitMinutes ?? 60,
    passingScore: item?.passingScore ?? 70,
    published: item?.published ?? true,
    sortOrder: item?.sortOrder || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title) { setError("Slug and title are required"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, questionIds: form.questionIds.split(",").map(s => s.trim()).filter(Boolean) };
      const url = item ? `/api/admin/pharmtech/exams/${item.id}` : "/api/admin/pharmtech/exams";
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      onSave();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4" data-testid="exam-form">
      <h3 className="text-lg font-semibold text-gray-900">{item ? "Edit Exam" : "Create Exam"}</h3>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.slug3")}</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" disabled={!!item} data-testid="input-exam-slug" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.title3")}</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-exam-title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.timeLimitMinutes")}</label>
          <input type="number" value={form.timeLimitMinutes} onChange={e => setForm({ ...form, timeLimitMinutes: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-exam-time" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.passingScore")}</label>
          <input type="number" value={form.passingScore} onChange={e => setForm({ ...form, passingScore: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" min={0} max={100} data-testid="input-exam-passing" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.description2")}</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm" rows={2} data-testid="input-exam-description" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.questionIdsCommaseparated")}</label>
        <textarea value={form.questionIds} onChange={e => setForm({ ...form, questionIds: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-sm font-mono" rows={3} data-testid="input-exam-questions" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.pharmtechAdmin.sortOrder3")}</label>
        <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl text-sm" data-testid="input-exam-sort" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" data-testid="input-exam-published" />
        <span className="text-sm font-medium text-gray-700">{t("allied.pharmtechAdmin.published4")}</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2" data-testid="button-save-exam">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200" data-testid="button-cancel-exam">{t("allied.pharmtechAdmin.cancel4")}</button>
      </div>
    </form>
  );
}

function ContentList({ type, apiPath, FormComponent, breadcrumbLabel }: { type: string; apiPath: string; FormComponent: any; breadcrumbLabel: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pharmtech/${apiPath}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
    setLoading(false);
  }, [apiPath]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/pharmtech/${apiPath}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchItems();
  };

  const handleTogglePublish = async (item: any) => {
    await fetch(`/api/admin/pharmtech/${apiPath}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ published: !item.published }),
    });
    fetchItems();
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (item.title || item.stem || "").toLowerCase().includes(s) || (item.category || "").toLowerCase().includes(s) || (item.slug || "").toLowerCase().includes(s);
  });

  if (showCreate) {
    return (
      <>
        <Breadcrumb items={[{ label: "Pharmacy Technician", href: BASE }, { label: breadcrumbLabel, href: `${BASE}/${type}` }, { label: "Create" }]} />
        <AdminNav active={type} />
        <FormComponent onSave={() => { setShowCreate(false); fetchItems(); }} onCancel={() => setShowCreate(false)} />
      </>
    );
  }

  if (editingItem) {
    return (
      <>
        <Breadcrumb items={[{ label: "Pharmacy Technician", href: BASE }, { label: breadcrumbLabel, href: `${BASE}/${type}` }, { label: "Edit" }]} />
        <AdminNav active={type} />
        <FormComponent item={editingItem} onSave={() => { setEditingItem(null); fetchItems(); }} onCancel={() => setEditingItem(null)} />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Pharmacy Technician", href: BASE }, { label: breadcrumbLabel }]} />
      <AdminNav active={type} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{breadcrumbLabel}</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700" data-testid="button-create-new">
          <Plus className="w-4 h-4" /> Create New
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("allied.pharmtechAdmin.search")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            data-testid="input-admin-search"
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} items</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">{t("allied.pharmtechAdmin.noItemsFound")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between" data-testid={`admin-item-${item.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${item.published ? "bg-green-500" : "bg-gray-300"}`} />
                  <h3 className="font-medium text-gray-900 text-sm truncate">{item.title || item.stem?.substring(0, 80) || "Untitled"}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {item.slug && <span className="bg-gray-50 px-1.5 py-0.5 rounded">{item.slug}</span>}
                  {item.category && <span className="bg-gray-50 px-1.5 py-0.5 rounded">{item.category}</span>}
                  {item.difficulty !== undefined && <span>Difficulty {item.difficulty}</span>}
                  {item.cardCount !== undefined && <span>{item.cardCount} cards</span>}
                  {item.questionIds && <span>{item.questionIds.length} questions</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditingItem(item)} className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" title={t("allied.pharmtechAdmin.edit")} data-testid={`button-edit-${item.id}`}>
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleTogglePublish(item)} className={`p-1.5 rounded-lg transition-colors ${item.published ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`} title={item.published ? "Unpublish" : "Publish"} data-testid={`button-publish-${item.id}`}>
                  {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" data-testid={`button-delete-${item.id}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function LessonsPage() {
  return <ContentList type="lessons" apiPath="lessons" FormComponent={LessonForm} breadcrumbLabel="Lessons" />;
}

function QuestionsPage() {
  return <ContentList type="questions" apiPath="questions" FormComponent={QuestionForm} breadcrumbLabel="Questions" />;
}

function FlashcardsPage() {
  return <ContentList type="flashcards" apiPath="flashcard-decks" FormComponent={FlashcardDeckForm} breadcrumbLabel="Flashcard Decks" />;
}

function ExamsPage() {
  return <ContentList type="exams" apiPath="exams" FormComponent={ExamForm} breadcrumbLabel="Exams" />;
}

function ImportPage() {
  const [contentType, setContentType] = useState<"lessons" | "questions" | "flashcard-decks" | "exams">("lessons");
  const [jsonInput, setJsonInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonInput(ev.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImporting(true);
    setResult(null);
    setError("");
    try {
      let data;
      try { data = JSON.parse(jsonInput); } catch { throw new Error("Invalid JSON. Please check your input."); }
      const items = Array.isArray(data) ? data : data.items ? data.items : [data];
      const res = await fetch(`/api/admin/pharmtech/import/${contentType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Import failed"); }
      const r = await res.json();
      setResult(r);
    } catch (e: any) { setError(e.message); }
    setImporting(false);
  };

  const types = [
    { key: "lessons" as const, label: "Lessons" },
    { key: "questions" as const, label: "Questions" },
    { key: "flashcard-decks" as const, label: "Flashcard Decks" },
    { key: "exams" as const, label: "Exams" },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Pharmacy Technician", href: BASE }, { label: "Import" }]} />
      <AdminNav active="import" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("allied.pharmtechAdmin.bulkImport")}</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5" data-testid="import-page">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("allied.pharmtechAdmin.contentType")}</label>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button
                key={t.key}
                onClick={() => { setContentType(t.key); setResult(null); setError(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${contentType === t.key ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                data-testid={`import-type-${t.key}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("allied.pharmtechAdmin.uploadJsonFile")}</label>
          <input type="file" accept=".json" onChange={handleFileUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" data-testid="input-import-file" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("allied.pharmtechAdmin.orPasteJson")}</label>
          <textarea
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder={`[{"slug": "example", "title": "Example", ...}]`}
            className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
            rows={12}
            data-testid="input-import-json"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm" data-testid="import-error">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1" data-testid="import-result">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <CheckCircle2 className="w-5 h-5" /> Import Complete
            </div>
            <div className="text-sm text-green-800">
              <span>Total: {result.total}</span>
              {result.created !== undefined && <span> · Created: {result.created}</span>}
              {result.updated !== undefined && <span> · Updated: {result.updated}</span>}
            </div>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={importing || !jsonInput.trim()}
          className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          data-testid="button-import"
        >
          <Upload className="w-4 h-4" /> {importing ? "Importing..." : "Import"}
        </button>
      </div>
    </>
  );
}

export default function PharmtechAdminPage() {
  const { isAdmin } = useAuth();
  const [location] = useLocation();

  if (!isAdmin) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold text-gray-900">{t("allied.pharmtechAdmin.adminAccessRequired")}</h1></div>;
  }

  const subPath = location.replace(BASE, "").replace(/^\//, "");

  let content;
  if (subPath === "lessons") content = <LessonsPage />;
  else if (subPath === "questions") content = <QuestionsPage />;
  else if (subPath === "flashcards") content = <FlashcardsPage />;
  else if (subPath === "exams") content = <ExamsPage />;
  else if (subPath === "import") content = <ImportPage />;
  else content = <Dashboard />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-admin-page">
      {content}
    </div>
  );
}