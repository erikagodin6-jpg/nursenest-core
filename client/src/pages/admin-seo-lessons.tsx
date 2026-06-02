import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Plus, Pencil, Trash2, Save, Loader2, Search, Upload, FileText, BookOpen,
  Eye, EyeOff, X, ChevronRight, ArrowLeft, Database, BarChart3,
} from "lucide-react";

interface LessonItem {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  subCategory: string | null;
  tier: string;
  status: string;
  summary: string | null;
  isPublicPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

function LessonEditor({ lesson, onSave, onCancel }: {
  lesson?: LessonItem & Record<string, any>;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [slug, setSlug] = useState(lesson?.slug || "");
  const [category, setCategory] = useState(lesson?.category || "");
  const [subCategory, setSubCategory] = useState(lesson?.subCategory || "");
  const [tier, setTier] = useState(lesson?.tier || "free");
  const [status, setStatus] = useState(lesson?.status || "draft");
  const [summary, setSummary] = useState(lesson?.summary || "");
  const [definition, setDefinition] = useState(lesson?.definition || "");
  const [pathophysiology, setPathophysiology] = useState(lesson?.pathophysiology || "");
  const [signsSymptoms, setSignsSymptoms] = useState<string[]>(lesson?.signsSymptoms || [""]);
  const [diagnostics, setDiagnostics] = useState<string[]>(lesson?.diagnostics || [""]);
  const [treatment, setTreatment] = useState<string[]>(lesson?.treatment || [""]);
  const [nursingInterventions, setNursingInterventions] = useState<string[]>(lesson?.nursingInterventions || [""]);
  const [complications, setComplications] = useState<string[]>(lesson?.complications || [""]);
  const [clinicalPearls, setClinicalPearls] = useState<string[]>(lesson?.clinicalPearls || [""]);
  const [references, setReferences] = useState<string[]>(lesson?.references || [""]);
  const [seoTitle, setSeoTitle] = useState(lesson?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(lesson?.seoDescription || "");
  const [seoKeywords, setSeoKeywords] = useState(lesson?.seoKeywords?.join(", ") || "");
  const [imageUrl, setImageUrl] = useState(lesson?.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(lesson?.imageAlt || "");
  const [isPublicPreview, setIsPublicPreview] = useState(lesson?.isPublicPreview || false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const generateSlug = () => {
    setSlug(title.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 100));
  };

  const handleSave = async () => {
    if (!title.trim()) { toast({ title: "Error", description: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const data = {
        title, slug: slug || undefined, category: category || null, subCategory: subCategory || null,
        tier, status, summary: summary || null, definition: definition || null,
        pathophysiology: pathophysiology || null,
        signsSymptoms: signsSymptoms.filter(s => s.trim()),
        diagnostics: diagnostics.filter(s => s.trim()),
        treatment: treatment.filter(s => s.trim()),
        nursingInterventions: nursingInterventions.filter(s => s.trim()),
        complications: complications.filter(s => s.trim()),
        clinicalPearls: clinicalPearls.filter(s => s.trim()),
        references: references.filter(s => s.trim()),
        seoTitle: seoTitle || null, seoDescription: seoDescription || null,
        seoKeywords: seoKeywords ? seoKeywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        imageUrl: imageUrl || null, imageAlt: imageAlt || null,
        isPublicPreview,
      };

      const url = lesson?.id ? `/api/admin/seo-lessons/${lesson.id}` : "/api/admin/seo-lessons";
      const method = lesson?.id ? "PUT" : "POST";
      const res = await adminFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      toast({ title: "Success", description: `Lesson ${lesson?.id ? "updated" : "created"} successfully` });
      onSave();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  function ListEditor({ items, setItems, placeholder }: { items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={e => { const u = [...items]; u[i] = e.target.value; setItems(u); }} placeholder={placeholder} className="flex-1" data-testid={`input-list-${i}`} />
            {items.length > 1 && <Button variant="ghost" size="sm" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-red-400" /></Button>}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setItems([...items, ""])} className="gap-1"><Plus className="w-3 h-3" /> {t("pages.adminSeoLessons.add")}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{lesson?.id ? "Edit Lesson" : "Create Lesson"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} data-testid="button-cancel">{t("pages.adminSeoLessons.cancel")}</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-save-seo-lesson">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">{t("pages.adminSeoLessons.content")}</TabsTrigger>
          <TabsTrigger value="clinical">{t("pages.adminSeoLessons.clinicalSections")}</TabsTrigger>
          <TabsTrigger value="seo">{t("pages.adminSeoLessons.seoMedia")}</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.title")}</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("pages.adminSeoLessons.lessonTitle")} data-testid="input-lesson-title" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.slug")}</label>
              <div className="flex gap-2">
                <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" className="flex-1" data-testid="input-lesson-slug" />
                <Button variant="outline" size="sm" onClick={generateSlug}>{t("pages.adminSeoLessons.generate")}</Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.category")}</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Cardiovascular" data-testid="input-lesson-category" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.subcategory")}</label>
              <Input value={subCategory} onChange={e => setSubCategory(e.target.value)} placeholder="e.g. Heart Failure" data-testid="input-lesson-subcategory" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.tier")}</label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger data-testid="select-lesson-tier"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">{t("pages.adminSeoLessons.free")}</SelectItem>
                  <SelectItem value="rpn">RPN</SelectItem>
                  <SelectItem value="rn">RN</SelectItem>
                  <SelectItem value="np">NP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.status")}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid="select-lesson-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("pages.adminSeoLessons.draft")}</SelectItem>
                  <SelectItem value="published">{t("pages.adminSeoLessons.published")}</SelectItem>
                  <SelectItem value="archived">{t("pages.adminSeoLessons.archived")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.summary")}</label>
            <Textarea value={summary} onChange={e => setSummary(e.target.value)} rows={2} placeholder={t("pages.adminSeoLessons.briefSummary")} data-testid="input-lesson-summary" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.definition")}</label>
            <Textarea value={definition} onChange={e => setDefinition(e.target.value)} rows={3} placeholder={t("pages.adminSeoLessons.clinicalDefinition")} data-testid="input-lesson-definition" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.pathophysiology")}</label>
            <Textarea value={pathophysiology} onChange={e => setPathophysiology(e.target.value)} rows={4} placeholder={t("pages.adminSeoLessons.pathophysiologyExplanation")} data-testid="input-lesson-pathophysiology" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={isPublicPreview} onChange={e => setIsPublicPreview(e.target.checked)} id="public-preview" data-testid="checkbox-public-preview" />
            <label htmlFor="public-preview" className="text-sm text-gray-700">{t("pages.adminSeoLessons.publicPreviewBypassPaywall")}</label>
          </div>
        </TabsContent>

        <TabsContent value="clinical" className="space-y-6 mt-4">
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.signsSymptoms")}</label><ListEditor items={signsSymptoms} setItems={setSignsSymptoms} placeholder={t("pages.adminSeoLessons.enterSignsymptom")} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.diagnostics")}</label><ListEditor items={diagnostics} setItems={setDiagnostics} placeholder={t("pages.adminSeoLessons.enterDiagnosticFinding")} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.treatment")}</label><ListEditor items={treatment} setItems={setTreatment} placeholder={t("pages.adminSeoLessons.enterTreatment")} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.nursingInterventions")}</label><ListEditor items={nursingInterventions} setItems={setNursingInterventions} placeholder={t("pages.adminSeoLessons.enterNursingIntervention")} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.complications")}</label><ListEditor items={complications} setItems={setComplications} placeholder={t("pages.adminSeoLessons.enterComplication")} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.clinicalPearls")}</label><ListEditor items={clinicalPearls} setItems={setClinicalPearls} placeholder={t("pages.adminSeoLessons.enterClinicalPearl")} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">{t("pages.adminSeoLessons.references")}</label><ListEditor items={references} setItems={setReferences} placeholder={t("pages.adminSeoLessons.enterReference")} /></div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.seoTitle")}</label>
            <Input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder={t("pages.adminSeoLessons.seooptimizedTitle")} data-testid="input-seo-title" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.seoDescription")}</label>
            <Textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={2} placeholder={t("pages.adminSeoLessons.metaDescription")} data-testid="input-seo-description" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.seoKeywords")}</label>
            <Input value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} placeholder={t("pages.adminSeoLessons.commaseparatedKeywords")} data-testid="input-seo-keywords" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.imageUrl")}</label>
            <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/public/images/medical/..." data-testid="input-image-url" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{t("pages.adminSeoLessons.imageAltText")}</label>
            <Input value={imageAlt} onChange={e => setImageAlt(e.target.value)} placeholder={t("pages.adminSeoLessons.clinicalIllustrationOf")} data-testid="input-image-alt" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BulkImportPanel({ onComplete }: { onComplete: () => void }) {
  const [jsonInput, setJsonInput] = useState("");
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const lessons = Array.isArray(parsed) ? parsed : [parsed];
      setImporting(true);
      const res = await adminFetch("/api/admin/seo-lessons/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessons }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      toast({ title: "Import Complete", description: `${data.created} lessons created, ${data.errors?.length || 0} errors` });
      onComplete();
    } catch (e: any) {
      toast({ title: "Import Error", description: e.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold">{t("pages.adminSeoLessons.bulkImport")}</h3>
      </div>
      <p className="text-sm text-gray-500">
        Paste a JSON array of lessons. Each lesson needs at minimum a "title" field. Slugs are auto-generated if not provided.
      </p>
      <Textarea
        value={jsonInput}
        onChange={e => setJsonInput(e.target.value)}
        rows={10}
        placeholder={`[\n  {\n    "title": "Cardiac Tamponade",\n    "category": "Cardiovascular",\n    "tier": "rpn",\n    "summary": "...",\n    "definition": "...",\n    "pathophysiology": "...",\n    "signsSymptoms": ["Beck's triad", "Hypotension"],\n    "status": "published"\n  }\n]`}
        className="font-mono text-sm"
        data-testid="input-bulk-import"
      />
      <Button onClick={handleImport} disabled={importing || !jsonInput.trim()} className="gap-2" data-testid="button-run-import">
        {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {importing ? "Importing..." : "Import Lessons"}
      </Button>
    </div>
  );
}

export default function AdminSeoLessons() {
  const { t } = useI18n();
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit" | "import">("list");
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const { toast } = useToast();

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterTier !== "all") params.set("tier", filterTier);
      params.set("limit", "200");
      const res = await adminFetch(`/api/admin/seo-lessons?${params.toString()}`);
      const data = await res.json();
      setLessons(data.lessons || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLessons(); }, [filterStatus, filterTier]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await adminFetch(`/api/admin/seo-lessons/${id}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Lesson removed" });
      fetchLessons();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleEdit = async (lesson: LessonItem) => {
    try {
      const res = await adminFetch(`/api/admin/seo-lessons/${lesson.slug}`);
      const data = await res.json();
      setEditingLesson(data.lesson);
      setView("edit");
    } catch {
      setEditingLesson(lesson);
      setView("edit");
    }
  };

  const filteredLessons = searchQuery
    ? lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.slug.includes(searchQuery.toLowerCase()))
    : lessons;

  if (view === "create") {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col font-['DM_Sans']">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8 w-full">
          <LessonEditor onSave={() => { setView("list"); fetchLessons(); }} onCancel={() => setView("list")} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "edit" && editingLesson) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col font-['DM_Sans']">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8 w-full">
          <LessonEditor lesson={editingLesson} onSave={() => { setView("list"); fetchLessons(); }} onCancel={() => setView("list")} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "import") {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col font-['DM_Sans']">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8 w-full">
          <Button variant="ghost" onClick={() => setView("list")} className="mb-4 gap-2" data-testid="button-back-list">
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Button>
          <BulkImportPanel onComplete={() => { setView("list"); fetchLessons(); }} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col font-['DM_Sans']">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 py-8 w-full space-y-6" data-testid="admin-seo-lessons">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("pages.adminSeoLessons.seoLessonsManager")}</h1>
            <p className="text-sm text-gray-500 mt-1">{total} total lessons in database</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("import")} className="gap-2" data-testid="button-bulk-import">
              <Upload className="w-4 h-4" /> Bulk Import
            </Button>
            <Button onClick={() => setView("create")} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" data-testid="button-create-lesson">
              <Plus className="w-4 h-4" /> New Lesson
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t("pages.adminSeoLessons.searchLessons")}
              className="pl-10"
              data-testid="input-search-lessons"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-status"><SelectValue placeholder={t("pages.adminSeoLessons.status2")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("pages.adminSeoLessons.allStatus")}</SelectItem>
              <SelectItem value="published">{t("pages.adminSeoLessons.published2")}</SelectItem>
              <SelectItem value="draft">{t("pages.adminSeoLessons.draft2")}</SelectItem>
              <SelectItem value="archived">{t("pages.adminSeoLessons.archived2")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-tier"><SelectValue placeholder={t("pages.adminSeoLessons.tier2")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("pages.adminSeoLessons.allTiers")}</SelectItem>
              <SelectItem value="free">{t("pages.adminSeoLessons.free2")}</SelectItem>
              <SelectItem value="rpn">RPN</SelectItem>
              <SelectItem value="rn">RN</SelectItem>
              <SelectItem value="np">NP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : filteredLessons.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center space-y-4">
              <Database className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-gray-500">{t("pages.adminSeoLessons.noLessonsFoundCreateYour")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredLessons.map(lesson => (
              <Card key={lesson.id} className="border-none shadow-sm hover:shadow-md transition-shadow" data-testid={`card-lesson-${lesson.slug}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">{lesson.title}</p>
                      <Badge variant={lesson.status === "published" ? "default" : "secondary"} className="text-xs shrink-0">
                        {lesson.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs shrink-0">{lesson.tier}</Badge>
                      {lesson.isPublicPreview && <Badge className="bg-blue-100 text-blue-800 text-xs shrink-0">{t("pages.adminSeoLessons.preview")}</Badge>}
                    </div>
                    <p className="text-xs text-gray-400">/{lesson.slug} {lesson.category ? `• ${lesson.category}` : ""}</p>
                    {lesson.summary && <p className="text-sm text-gray-500 truncate mt-1">{lesson.summary}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/lessons/${lesson.slug}`, "_blank")} data-testid={`button-view-${lesson.slug}`}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(lesson)} data-testid={`button-edit-${lesson.slug}`}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)} data-testid={`button-delete-${lesson.slug}`}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
