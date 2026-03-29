import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/navigation";
import { adminFetch } from "@/lib/admin-fetch";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Search, Plus, Save, Trash2, Eye, Upload, ArrowLeft,
  CheckCircle, XCircle, AlertTriangle, Loader2, X,
  ChevronLeft, ChevronRight, RefreshCw, Zap, Globe,
  FileText, Download, ArrowRightLeft
} from "lucide-react";

interface FlashcardItem {
  id: string;
  front: string;
  tier: string;
  status: string;
  difficulty: number | null;
  bodySystem: string | null;
  topic: string | null;
  subtopic: string | null;
  sourceType: string | null;
  highYield: boolean;
  isFoundational: boolean;
  blueprintCategory: string | null;
  questionType: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  hasRationale: boolean;
  hasLessons: boolean;
  hasImages: boolean;
}

interface FlashcardDetail {
  id: string;
  tier: string;
  front: string;
  back: string;
  questionType: string | null;
  options: any[];
  correctAnswer: any;
  rationaleCorrect: string | null;
  distractorRationales: any;
  clinicalTakeaway: string | null;
  examPearl: string | null;
  rationaleMedia: any[];
  lessonLinks: any[];
  difficulty: number | null;
  bodySystem: string | null;
  topic: string | null;
  subtopic: string | null;
  regionScope: string;
  category: string | null;
  tagsJson: any[];
  highYield: boolean;
  isFoundational: boolean;
  blueprintCategory: string | null;
  status: string;
  sourceType: string | null;
  flashcardEnabled: boolean;
  contentHash: string | null;
  createdAt: string;
  updatedAt: string;
}

type TabType = "list" | "create" | "convert" | "import" | "preview" | "stats" | "ai-generate" | "quality" | "config";

const TIERS = ["rpn", "rn", "np"];
const STATUSES = ["draft", "published", "archived", "needs_review", "approved"];
const DIFFICULTY_LABELS: Record<number, string> = { 1: "Very Easy", 2: "Easy", 3: "Moderate", 4: "Hard", 5: "Very Hard" };
const BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Neurological", "GI", "Renal", "Endocrine",
  "Hematology", "Pediatrics", "Maternal", "Neonatal", "Oncology", "Pharmacology",
  "Mental Health", "Infection", "Procedures", "Fundamentals", "Safety & Ethics",
  "Skin", "Musculoskeletal", "General"
];

function ValidationBadges({ item }: { item: FlashcardItem }) {
  const { t } = useI18n();
  return (
    <div className="flex gap-1 flex-wrap">
      {!item.hasRationale && <Badge variant="destructive" className="text-[10px] px-1 py-0">{t("pages.adminFlashcardStudio.noRationale")}</Badge>}
      {!item.hasLessons && <Badge className="text-[10px] px-1 py-0 bg-yellow-100 text-yellow-700">{t("pages.adminFlashcardStudio.noLessons")}</Badge>}
      {item.highYield && <Badge className="text-[10px] px-1 py-0 bg-orange-100 text-orange-700"><Zap className="w-2.5 h-2.5 mr-0.5" />{t("pages.adminFlashcardStudio.highyield")}</Badge>}
      {item.isFoundational && <Badge className="text-[10px] px-1 py-0 bg-blue-100 text-blue-700"><Globe className="w-2.5 h-2.5 mr-0.5" />{t("pages.adminFlashcardStudio.shared")}</Badge>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    archived: "bg-red-100 text-red-700",
    approved: "bg-blue-100 text-blue-700",
    needs_review: "bg-yellow-100 text-yellow-700",
  };
  return (
    <Badge className={`text-xs ${colors[status] || "bg-gray-100 text-gray-600"}`} data-testid={`badge-status-${status}`}>
      {status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
    </Badge>
  );
}

const emptyCard = (): Partial<FlashcardDetail> => ({
  tier: "rn",
  front: "",
  back: "",
  questionType: "mcq",
  options: ["", "", "", ""],
  correctAnswer: [0],
  rationaleCorrect: "",
  distractorRationales: {},
  clinicalTakeaway: "",
  examPearl: "",
  rationaleMedia: [],
  lessonLinks: [],
  difficulty: 3,
  bodySystem: "",
  topic: "",
  subtopic: "",
  regionScope: "BOTH",
  category: "",
  tagsJson: [],
  highYield: false,
  isFoundational: false,
  blueprintCategory: "",
  status: "draft",
  flashcardEnabled: true,
});

export default function AdminFlashcardStudio() {
  const { effectiveTier } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<TabType>("list");

  const [items, setItems] = useState<FlashcardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [tierCounts, setTierCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterHighYield, setFilterHighYield] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editCard, setEditCard] = useState<FlashcardDetail | null>(null);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [convertQuestions, setConvertQuestions] = useState<any[]>([]);
  const [convertTier, setConvertTier] = useState("rpn");
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertSelectedIds, setConvertSelectedIds] = useState<Set<string>>(new Set());
  const [convertResult, setConvertResult] = useState<any>(null);

  const [importText, setImportText] = useState("");
  const [importParsed, setImportParsed] = useState<any[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importAutoPublish, setImportAutoPublish] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [previewTier, setPreviewTier] = useState("rn");
  const [previewCards, setPreviewCards] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const isAdmin = effectiveTier === "admin";

  useEffect(() => { if (!isAdmin) setLocation("/admin"); }, [isAdmin]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "25");
      if (filterTier !== "all") params.set("tier", filterTier);
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterDifficulty !== "all") params.set("difficulty", filterDifficulty);
      if (filterSource !== "all") params.set("sourceType", filterSource);
      if (filterHighYield) params.set("highYield", "true");
      if (searchTerm) params.set("search", searchTerm);

      const res = await adminFetch(`/api/admin/flashcard-bank/studio/list?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setStatusCounts(data.statusCounts || {});
      setTierCounts(data.tierCounts || {});
    } catch (e) {
      console.error("Failed to load:", e);
    } finally {
      setLoading(false);
    }
  }, [page, filterTier, filterStatus, filterDifficulty, filterSource, filterHighYield, searchTerm]);

  useEffect(() => {
    if (isAdmin && tab === "list") fetchList();
  }, [fetchList, isAdmin, tab]);

  const loadCard = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/flashcard-bank/detail/${id}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEditCard({
        ...data,
        options: data.options || [],
        correctAnswer: data.correctAnswer || [0],
        tagsJson: data.tagsJson || [],
        rationaleMedia: data.rationaleMedia || [],
        lessonLinks: data.lessonLinks || [],
        distractorRationales: data.distractorRationales || {},
      });
      setEditMode("edit");
      setTab("create");
      setSaveMsg(null);
    } catch (e) {
      console.error(e);
    }
  };

  const saveCard = async () => {
    if (!editCard) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload = {
        tier: editCard.tier,
        front: editCard.front,
        back: editCard.back,
        questionType: editCard.questionType,
        options: editCard.options,
        correctAnswer: editCard.correctAnswer,
        rationaleCorrect: editCard.rationaleCorrect,
        distractorRationales: editCard.distractorRationales,
        clinicalTakeaway: editCard.clinicalTakeaway,
        examPearl: editCard.examPearl,
        rationaleMedia: editCard.rationaleMedia,
        lessonLinks: editCard.lessonLinks,
        difficulty: editCard.difficulty,
        bodySystem: editCard.bodySystem,
        topic: editCard.topic,
        subtopic: editCard.subtopic,
        regionScope: editCard.regionScope,
        category: editCard.category || editCard.bodySystem,
        tagsJson: editCard.tagsJson,
        highYield: editCard.highYield,
        isFoundational: editCard.isFoundational,
        blueprintCategory: editCard.blueprintCategory,
        status: editCard.status,
        flashcardEnabled: editCard.flashcardEnabled,
      };

      let res;
      if (editMode === "edit" && editCard.id) {
        res = await adminFetch(`/api/admin/flashcard-bank/${editCard.id}/full`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch("/api/admin/flashcard-bank/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        const errText = data.errors?.join(", ") || data.error || "Failed to save";
        setSaveMsg({ type: "error", text: errText });
        return;
      }
      const warnings = data.warnings?.length ? data.warnings.join(", ") : null;
      if (warnings) {
        setSaveMsg({ type: "warning", text: `Saved with warnings: ${warnings}` });
      } else {
        setSaveMsg({ type: "success", text: editMode === "edit" ? "Updated successfully" : "Created successfully" });
      }
      if (editMode === "create" && data.item) {
        setEditCard(data.item);
        setEditMode("edit");
      }
    } catch (e: any) {
      setSaveMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm("Delete this flashcard permanently?")) return;
    try {
      await adminFetch(`/api/admin/flashcard-bank/${id}`, { method: "DELETE" });
      setEditCard(null);
      setTab("list");
      fetchList();
    } catch (e) {
      console.error(e);
    }
  };

  const bulkAction = async (action: string) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await adminFetch(`/api/admin/flashcard-bank/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setSelectedIds(new Set());
      fetchList();
    } catch (e) {
      console.error(e);
    }
  };

  const bulkSetFlags = async (flag: string, value: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await adminFetch("/api/admin/flashcard-bank/bulk-set-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, [flag]: value }),
      });
      setSelectedIds(new Set());
      fetchList();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchConvertQuestions = useCallback(async () => {
    setConvertLoading(true);
    try {
      const res = await adminFetch(`/api/admin/flashcard-bank/exam-questions-for-convert?tier=${convertTier}&limit=50`);
      const data = await res.json();
      setConvertQuestions(data.questions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setConvertLoading(false);
    }
  }, [convertTier]);

  useEffect(() => {
    if (tab === "convert") fetchConvertQuestions();
  }, [tab, fetchConvertQuestions]);

  const doConvert = async (preview: boolean) => {
    const ids = Array.from(convertSelectedIds);
    if (ids.length === 0) return;
    setConvertLoading(true);
    setConvertResult(null);
    try {
      const res = await adminFetch("/api/admin/flashcard-bank/convert-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: ids, preview }),
      });
      const data = await res.json();
      setConvertResult(data);
      if (!preview) {
        fetchConvertQuestions();
        setConvertSelectedIds(new Set());
      }
    } catch (e: any) {
      setConvertResult({ error: e.message });
    } finally {
      setConvertLoading(false);
    }
  };

  const handleImportParse = (text: string) => {
    setImportText(text);
    setImportParsed(null);
    setImportError(null);
    setImportResult(null);
    if (!text.trim()) return;
    try {
      const data = JSON.parse(text);
      let arr: any[];
      if (Array.isArray(data)) {
        arr = data;
      } else if (typeof data === "object" && data !== null) {
        const values = Object.values(data);
        if (values.length > 0 && Array.isArray(values[0])) {
          arr = (values as any[][]).flat();
        } else if (data.front || data.question) {
          arr = [data];
        } else {
          setImportError("Unrecognized format. Expected JSON array of flashcard objects.");
          return;
        }
      } else {
        setImportError("Expected JSON array or object");
        return;
      }
      if (arr.length === 0) { setImportError("No cards found"); return; }
      setImportParsed(arr);
    } catch (e: any) {
      setImportError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      if (file.name.endsWith(".csv")) {
        try {
          const parseCSV = (csv: string): string[][] => {
            const rows: string[][] = [];
            let row: string[] = [];
            let cell = "";
            let inQuotes = false;
            for (let i = 0; i < csv.length; i++) {
              const ch = csv[i];
              if (inQuotes) {
                if (ch === '"' && csv[i + 1] === '"') { cell += '"'; i++; }
                else if (ch === '"') { inQuotes = false; }
                else { cell += ch; }
              } else {
                if (ch === '"') { inQuotes = true; }
                else if (ch === ',') { row.push(cell.trim()); cell = ""; }
                else if (ch === '\n' || (ch === '\r' && csv[i + 1] === '\n')) {
                  if (ch === '\r') i++;
                  row.push(cell.trim()); cell = "";
                  if (row.some(c => c.length > 0)) rows.push(row);
                  row = [];
                } else { cell += ch; }
              }
            }
            if (cell.length > 0 || row.length > 0) { row.push(cell.trim()); if (row.some(c => c.length > 0)) rows.push(row); }
            return rows;
          };
          const parsed = parseCSV(text);
          if (parsed.length < 2) { setImportError("CSV must have header + data rows"); return; }
          const headers = parsed[0];
          const cards = parsed.slice(1).map(vals => {
            const obj: any = {};
            headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
            return obj;
          });
          setImportText(JSON.stringify(cards, null, 2));
          setImportParsed(cards);
          setImportError(null);
          setImportResult(null);
        } catch (err: any) {
          setImportError(`CSV parse error: ${err.message}`);
        }
      } else {
        handleImportParse(text);
      }
    };
    reader.readAsText(file);
  };

  const doImport = async () => {
    if (!importParsed) return;
    setImporting(true);
    setImportResult(null);
    try {
      const res = await adminFetch("/api/admin/flashcard-bank/bulk-import-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: importParsed, autoPublish: importAutoPublish }),
      });
      const data = await res.json();
      setImportResult(data);
    } catch (e: any) {
      setImportResult({ success: false, error: e.message });
    } finally {
      setImporting(false);
    }
  };

  const fetchPreview = useCallback(async () => {
    setPreviewLoading(true);
    setShowAnswer(false);
    setPreviewIdx(0);
    try {
      const res = await adminFetch(`/api/admin/flashcard-bank/preview-by-tier?tier=${previewTier}&limit=10`);
      const data = await res.json();
      setPreviewCards(data.cards || []);
    } catch (e) {
      console.error(e);
    } finally {
      setPreviewLoading(false);
    }
  }, [previewTier]);

  useEffect(() => {
    if (tab === "preview") fetchPreview();
  }, [tab, fetchPreview]);

  const downloadTemplate = () => {
    const template = [{
      tier: "rn", front: "A nurse is caring for a client with COPD who becomes restless. What is the priority action?",
      back: "", questionType: "mcq",
      options: ["Encourage fluids", "Assess O2 sat", "Provide blanket", "Administer cough suppressant"],
      correctAnswer: [1],
      rationaleCorrect: "Restlessness is an early sign of hypoxia. Assessing O2 sat takes priority.",
      distractorRationales: { "Encourage fluids": "Does not address hypoxia", "Provide blanket": "Comfort but not priority", "Administer cough suppressant": "Contraindicated in COPD" },
      clinicalTakeaway: "Always assess oxygenation first when a patient shows neurological changes",
      difficulty: 3, bodySystem: "Respiratory", topic: "COPD", subtopic: "Exacerbation management",
      highYield: true, isFoundational: false, blueprintCategory: "Physiological Integrity"
    }];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "flashcard-import-template.json"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) return null;

  const totalPages = Math.ceil(total / 25);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-warmwhite">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/admin">
              <Button variant="ghost" size="sm" data-testid="button-back-admin"><ArrowLeft className="w-4 h-4 mr-1" /> {t("pages.adminFlashcardStudio.admin")}</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-studio-title">{t("pages.adminFlashcardStudio.flashcardContentStudio")}</h1>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {([
              ["list", "Card Bank", FileText],
              ["create", editMode === "edit" ? "Edit Card" : "Create Card", Plus],
              ["convert", "Convert Q-Bank", ArrowRightLeft],
              ["import", "Bulk Import", Upload],
              ["preview", "Tier Preview", Eye],
              ["stats", "Content Reuse", RefreshCw],
              ["ai-generate", "AI Generate", Zap],
              ["quality", "Quality Tools", AlertTriangle],
              ["config", "Build Config", RefreshCw],
            ] as [TabType, string, any][]).map(([t, label, Icon]) => (
              <Button
                key={t}
                variant={tab === t ? "default" : "outline"}
                onClick={() => { setTab(t); if (t === "create" && editMode !== "edit") setEditCard(emptyCard() as FlashcardDetail); }}
                className={tab === t ? "bg-[#BFA6F6] hover:bg-[#a88de6] text-white" : ""}
                data-testid={`button-tab-${t}`}
              >
                <Icon className="w-4 h-4 mr-2" /> {label}
              </Button>
            ))}
          </div>

          {tab === "list" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={t("pages.adminFlashcardStudio.searchFlashcards")}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-9"
                        data-testid="input-search-flashcards"
                      />
                    </div>
                    <Select value={filterTier} onValueChange={(v) => { setFilterTier(v); setPage(1); }}>
                      <SelectTrigger className="w-[100px]" data-testid="select-filter-tier"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.adminFlashcardStudio.allTiers")}</SelectItem>
                        {TIERS.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                      <SelectTrigger className="w-[130px]" data-testid="select-filter-status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.adminFlashcardStudio.allStatuses")}</SelectItem>
                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={filterSource} onValueChange={(v) => { setFilterSource(v); setPage(1); }}>
                      <SelectTrigger className="w-[120px]" data-testid="select-filter-source"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.adminFlashcardStudio.allSources")}</SelectItem>
                        <SelectItem value="manual">{t("pages.adminFlashcardStudio.manual")}</SelectItem>
                        <SelectItem value="cat_exam">{t("pages.adminFlashcardStudio.qbank")}</SelectItem>
                        <SelectItem value="import">{t("pages.adminFlashcardStudio.import")}</SelectItem>
                        <SelectItem value="ai">{t("pages.adminFlashcardStudio.aiGenerated")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDifficulty} onValueChange={(v) => { setFilterDifficulty(v); setPage(1); }}>
                      <SelectTrigger className="w-[120px]" data-testid="select-filter-difficulty"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.adminFlashcardStudio.allLevels")}</SelectItem>
                        {[1,2,3,4,5].map(d => <SelectItem key={d} value={String(d)}>{DIFFICULTY_LABELS[d]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch checked={filterHighYield} onCheckedChange={(v) => { setFilterHighYield(v); setPage(1); }} id="hy-filter" data-testid="switch-filter-highyield" />
                      <Label htmlFor="hy-filter" className="text-xs"><Zap className="w-3 h-3 inline" /> {t("pages.adminFlashcardStudio.highyield2")}</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 text-xs">
                    {Object.entries(tierCounts).map(([t, c]) => (
                      <Badge key={t} variant="outline" className="text-xs">{t.toUpperCase()}: {c}</Badge>
                    ))}
                    <span className="text-gray-400">|</span>
                    {Object.entries(statusCounts).map(([s, c]) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}: {c}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedIds.size > 0 && (
                <Card>
                  <CardContent className="p-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{selectedIds.size} selected</span>
                    <Button size="sm" variant="outline" onClick={() => bulkAction("bulk-publish")} data-testid="button-bulk-publish">
                      <CheckCircle className="w-3 h-3 mr-1" /> Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => bulkAction("bulk-unpublish")} data-testid="button-bulk-unpublish">{t("pages.adminFlashcardStudio.unpublish")}</Button>
                    <Button size="sm" variant="outline" onClick={() => bulkAction("bulk-archive")} data-testid="button-bulk-archive">{t("pages.adminFlashcardStudio.archive")}</Button>
                    <Button size="sm" variant="outline" onClick={() => bulkSetFlags("highYield", true)} data-testid="button-bulk-highyield">
                      <Zap className="w-3 h-3 mr-1" /> Mark High-Yield
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => bulkSetFlags("isFoundational", true)} data-testid="button-bulk-foundational">
                      <Globe className="w-3 h-3 mr-1" /> Mark Foundational
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => bulkAction("bulk-delete")} data-testid="button-bulk-delete">
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} data-testid="button-clear-selection">{t("pages.adminFlashcardStudio.clear")}</Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />{t("pages.adminFlashcardStudio.loading")}</div>
                  ) : items.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">{t("pages.adminFlashcardStudio.noFlashcardsFound")}</div>
                  ) : (
                    <div className="divide-y">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors cursor-pointer ${selectedIds.has(item.id) ? "bg-purple-50" : ""}`}
                          data-testid={`row-flashcard-${item.id}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              const newSet = new Set(selectedIds);
                              if (e.target.checked) newSet.add(item.id); else newSet.delete(item.id);
                              setSelectedIds(newSet);
                            }}
                            className="mt-1 accent-[#BFA6F6]"
                            data-testid={`checkbox-select-${item.id}`}
                          />
                          <div className="flex-1 min-w-0" onClick={() => loadCard(item.id)}>
                            <p className="text-sm text-gray-900 line-clamp-2">{item.front}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <Badge variant="outline" className="text-xs">{item.tier.toUpperCase()}</Badge>
                              {item.bodySystem && <Badge variant="secondary" className="text-xs">{item.bodySystem}</Badge>}
                              {item.difficulty && <Badge variant="outline" className="text-xs">{DIFFICULTY_LABELS[item.difficulty]}</Badge>}
                              {item.sourceType && <Badge variant="outline" className="text-xs">{item.sourceType}</Badge>}
                            </div>
                            <ValidationBadges item={item} />
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <span className="text-xs text-gray-500">{total} card{total !== 1 ? "s" : ""} total</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} data-testid="button-prev-page">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-gray-500">Page {page} of {totalPages || 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages} data-testid="button-next-page">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "create" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{editMode === "edit" ? "Edit Flashcard" : "Create Flashcard"}</CardTitle>
                      {editMode === "edit" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => editCard?.id && deleteCard(editCard.id)} data-testid="button-delete-card">
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditCard(emptyCard() as FlashcardDetail); setEditMode("create"); setSaveMsg(null); }} data-testid="button-new-card">
                            <Plus className="w-3 h-3 mr-1" /> New
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.examTier")}</Label>
                        <Select value={editCard?.tier || "rn"} onValueChange={(v) => setEditCard(prev => prev ? { ...prev, tier: v } : null)}>
                          <SelectTrigger data-testid="select-edit-tier"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TIERS.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.status")}</Label>
                        <Select value={editCard?.status || "draft"} onValueChange={(v) => setEditCard(prev => prev ? { ...prev, status: v } : null)}>
                          <SelectTrigger data-testid="select-edit-status"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.questionType")}</Label>
                        <Select value={editCard?.questionType || "mcq"} onValueChange={(v) => setEditCard(prev => prev ? { ...prev, questionType: v } : null)}>
                          <SelectTrigger data-testid="select-edit-qtype"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">{t("pages.adminFlashcardStudio.multipleChoice")}</SelectItem>
                            <SelectItem value="priority">{t("pages.adminFlashcardStudio.priority")}</SelectItem>
                            <SelectItem value="sata">SATA</SelectItem>
                            <SelectItem value="delegation">{t("pages.adminFlashcardStudio.delegation")}</SelectItem>
                            <SelectItem value="hotspot">{t("pages.adminFlashcardStudio.hotspot")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.questionStemFront")}</Label>
                      <Textarea
                        value={editCard?.front || ""}
                        onChange={(e) => setEditCard(prev => prev ? { ...prev, front: e.target.value } : null)}
                        rows={3}
                        placeholder={t("pages.adminFlashcardStudio.enterTheQuestionStem")}
                        data-testid="input-edit-front"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500 mb-2 block">{t("pages.adminFlashcardStudio.options")}</Label>
                      {(editCard?.options || []).map((opt: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={Array.isArray(editCard?.correctAnswer) && editCard.correctAnswer.includes(i) ? "default" : "outline"}
                            className={`cursor-pointer shrink-0 w-7 h-7 flex items-center justify-center ${Array.isArray(editCard?.correctAnswer) && editCard.correctAnswer.includes(i) ? "bg-green-600" : ""}`}
                            onClick={() => setEditCard(prev => prev ? { ...prev, correctAnswer: [i] } : null)}
                            data-testid={`badge-correct-${i}`}
                          >
                            {String.fromCharCode(65 + i)}
                          </Badge>
                          <Input
                            value={typeof opt === "object" ? opt.text || "" : opt || ""}
                            onChange={(e) => {
                              const newOpts = [...(editCard?.options || [])];
                              newOpts[i] = e.target.value;
                              setEditCard(prev => prev ? { ...prev, options: newOpts } : null);
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            data-testid={`input-edit-option-${i}`}
                          />
                          {(editCard?.options?.length || 0) > 2 && (
                            <Button size="sm" variant="ghost" onClick={() => {
                              const newOpts = (editCard?.options || []).filter((_: any, j: number) => j !== i);
                              setEditCard(prev => prev ? { ...prev, options: newOpts } : null);
                            }}><X className="w-3 h-3" /></Button>
                          )}
                        </div>
                      ))}
                      {(editCard?.options?.length || 0) < 6 && (
                        <Button size="sm" variant="outline" onClick={() => setEditCard(prev => prev ? { ...prev, options: [...(prev.options || []), ""] } : null)} data-testid="button-add-option">
                          <Plus className="w-3 h-3 mr-1" /> Add Option
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.correctAnswerRationale")}</Label>
                      <Textarea
                        value={editCard?.rationaleCorrect || ""}
                        onChange={(e) => setEditCard(prev => prev ? { ...prev, rationaleCorrect: e.target.value } : null)}
                        rows={3}
                        placeholder={t("pages.adminFlashcardStudio.explainWhyTheCorrectAnswer")}
                        data-testid="input-edit-rationale"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500 mb-2 block">{t("pages.adminFlashcardStudio.distractorRationales")}</Label>
                      {(editCard?.options || []).map((opt: any, i: number) => {
                        if (Array.isArray(editCard?.correctAnswer) && editCard.correctAnswer.includes(i)) return null;
                        const optText = typeof opt === "object" ? opt.text || "" : opt || "";
                        const drs = editCard?.distractorRationales || {};
                        return (
                          <div key={i} className="mb-2">
                            <Label className="text-[10px] text-gray-400">{String.fromCharCode(65 + i)}: {optText.substring(0, 40)}</Label>
                            <Input
                              value={drs[optText] || ""}
                              onChange={(e) => {
                                const newDrs = { ...drs, [optText]: e.target.value };
                                setEditCard(prev => prev ? { ...prev, distractorRationales: newDrs } : null);
                              }}
                              placeholder={t("pages.adminFlashcardStudio.whyThisIsIncorrect")}
                              className="text-sm"
                              data-testid={`input-distractor-${i}`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.clinicalPearl")}</Label>
                      <Textarea
                        value={editCard?.clinicalTakeaway || ""}
                        onChange={(e) => setEditCard(prev => prev ? { ...prev, clinicalTakeaway: e.target.value } : null)}
                        rows={2}
                        placeholder={t("pages.adminFlashcardStudio.keyClinicalTakeawayForThis")}
                        data-testid="input-edit-pearl"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.examPearl")}</Label>
                      <Input
                        value={editCard?.examPearl || ""}
                        onChange={(e) => setEditCard(prev => prev ? { ...prev, examPearl: e.target.value } : null)}
                        placeholder={t("pages.adminFlashcardStudio.examStrategyTip")}
                        data-testid="input-edit-exampearl"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">{t("pages.adminFlashcardStudio.metadata")}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.bodySystem")}</Label>
                      <Select value={editCard?.bodySystem || ""} onValueChange={(v) => setEditCard(prev => prev ? { ...prev, bodySystem: v, category: v } : null)}>
                        <SelectTrigger data-testid="select-edit-bodysystem"><SelectValue placeholder={t("pages.adminFlashcardStudio.select")} /></SelectTrigger>
                        <SelectContent>
                          {BODY_SYSTEMS.map(bs => <SelectItem key={bs} value={bs}>{bs}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.topic")}</Label>
                      <Input value={editCard?.topic || ""} onChange={(e) => setEditCard(prev => prev ? { ...prev, topic: e.target.value } : null)} placeholder="e.g. Heart Failure" data-testid="input-edit-topic" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.subtopic")}</Label>
                      <Input value={editCard?.subtopic || ""} onChange={(e) => setEditCard(prev => prev ? { ...prev, subtopic: e.target.value } : null)} placeholder="e.g. Diuretic therapy" data-testid="input-edit-subtopic" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.blueprintCategory")}</Label>
                      <Input value={editCard?.blueprintCategory || ""} onChange={(e) => setEditCard(prev => prev ? { ...prev, blueprintCategory: e.target.value } : null)} placeholder="e.g. Physiological Integrity" data-testid="input-edit-blueprint" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.difficulty")}</Label>
                      <Select value={String(editCard?.difficulty || 3)} onValueChange={(v) => setEditCard(prev => prev ? { ...prev, difficulty: parseInt(v) } : null)}>
                        <SelectTrigger data-testid="select-edit-difficulty"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5].map(d => <SelectItem key={d} value={String(d)}>{DIFFICULTY_LABELS[d]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.region")}</Label>
                      <Select value={editCard?.regionScope || "BOTH"} onValueChange={(v) => setEditCard(prev => prev ? { ...prev, regionScope: v } : null)}>
                        <SelectTrigger data-testid="select-edit-region"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">US</SelectItem>
                          <SelectItem value="CAN">{t("pages.adminFlashcardStudio.canada")}</SelectItem>
                          <SelectItem value="BOTH">{t("pages.adminFlashcardStudio.both")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.lessonLinkUrl")}</Label>
                      <Input
                        value={(editCard?.lessonLinks || [])[0]?.lessonUrl || ""}
                        onChange={(e) => {
                          const links = e.target.value ? [{ lessonTitle: "Related Lesson", lessonUrl: e.target.value, relevanceNote: "" }] : [];
                          setEditCard(prev => prev ? { ...prev, lessonLinks: links } : null);
                        }}
                        placeholder="/lessons/heart-failure"
                        data-testid="input-edit-lessonlink"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.rationaleImageUrl")}</Label>
                      <Input
                        value={(editCard?.rationaleMedia || [])[0]?.imageUrl || ""}
                        onChange={(e) => {
                          const media = e.target.value ? [{ imageUrl: e.target.value, imageAlt: "", imageCaption: "" }] : [];
                          setEditCard(prev => prev ? { ...prev, rationaleMedia: media } : null);
                        }}
                        placeholder="/attached_assets/image.png"
                        data-testid="input-edit-image"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">{t("pages.adminFlashcardStudio.tagsCommaseparated")}</Label>
                      <Input
                        value={(editCard?.tagsJson || []).join(", ")}
                        onChange={(e) => {
                          const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                          setEditCard(prev => prev ? { ...prev, tagsJson: tags } : null);
                        }}
                        placeholder={t("pages.adminFlashcardStudio.nclexPriorityRespiratory")}
                        data-testid="input-edit-tags"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Switch checked={editCard?.highYield || false} onCheckedChange={(v) => setEditCard(prev => prev ? { ...prev, highYield: v } : null)} id="hy-edit" data-testid="switch-edit-highyield" />
                      <Label htmlFor="hy-edit" className="text-xs flex items-center gap-1"><Zap className="w-3 h-3 text-orange-500" /> {t("pages.adminFlashcardStudio.highyieldExamcritical")}</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={editCard?.isFoundational || false} onCheckedChange={(v) => setEditCard(prev => prev ? { ...prev, isFoundational: v } : null)} id="found-edit" data-testid="switch-edit-foundational" />
                      <Label htmlFor="found-edit" className="text-xs flex items-center gap-1"><Globe className="w-3 h-3 text-blue-500" /> {t("pages.adminFlashcardStudio.foundationalSharedAcrossTiers")}</Label>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={saveCard} disabled={saving} className="w-full bg-[#BFA6F6] hover:bg-[#a88de6] text-white" data-testid="button-save-card">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("pages.adminFlashcardStudio.saving")}</> : <><Save className="w-4 h-4 mr-2" /> {editMode === "edit" ? "Update Card" : "Create Card"}</>}
                </Button>

                {saveMsg && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${saveMsg.type === "success" ? "bg-green-50 text-green-700" : saveMsg.type === "warning" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`} data-testid="text-save-message">
                    {saveMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : saveMsg.type === "warning" ? <AlertTriangle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {saveMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "convert" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t("pages.adminFlashcardStudio.convertQuestionBankFlashcards")}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={convertTier} onValueChange={setConvertTier}>
                        <SelectTrigger className="w-[100px]" data-testid="select-convert-tier"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIERS.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={fetchConvertQuestions} data-testid="button-refresh-convert">
                        <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {convertLoading ? (
                    <div className="p-8 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />{t("pages.adminFlashcardStudio.loading2")}</div>
                  ) : convertQuestions.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">{t("pages.adminFlashcardStudio.noExamQuestionsFoundFor")}</div>
                  ) : (
                    <>
                      <div className="flex gap-2 mb-3">
                        <Button size="sm" variant="outline" onClick={() => {
                          const unconverted = convertQuestions.filter(q => !q.alreadyConverted).map(q => q.id);
                          setConvertSelectedIds(new Set(unconverted));
                        }} data-testid="button-select-all-unconverted">{t("pages.adminFlashcardStudio.selectAllUnconverted")}</Button>
                        <Button size="sm" variant="outline" onClick={() => doConvert(true)} disabled={convertSelectedIds.size === 0} data-testid="button-preview-convert">
                          <Eye className="w-3 h-3 mr-1" /> Preview ({convertSelectedIds.size})
                        </Button>
                        <Button size="sm" className="bg-[#BFA6F6] hover:bg-[#a88de6] text-white" onClick={() => doConvert(false)} disabled={convertSelectedIds.size === 0} data-testid="button-do-convert">
                          <ArrowRightLeft className="w-3 h-3 mr-1" /> Convert ({convertSelectedIds.size})
                        </Button>
                      </div>
                      <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50 border-b sticky top-0">
                            <tr>
                              <th className="p-2 w-8"></th>
                              <th className="p-2 text-left">{t("pages.adminFlashcardStudio.questionStem")}</th>
                              <th className="p-2 text-left w-20">{t("pages.adminFlashcardStudio.tier")}</th>
                              <th className="p-2 text-left w-24">{t("pages.adminFlashcardStudio.bodySystem2")}</th>
                              <th className="p-2 text-left w-16">{t("pages.adminFlashcardStudio.diff")}</th>
                              <th className="p-2 text-left w-20">{t("pages.adminFlashcardStudio.status2")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {convertQuestions.map((q) => (
                              <tr key={q.id} className={`border-b hover:bg-gray-50 ${q.alreadyConverted ? "opacity-50" : ""}`}>
                                <td className="p-2">
                                  <input
                                    type="checkbox"
                                    checked={convertSelectedIds.has(q.id)}
                                    disabled={q.alreadyConverted}
                                    onChange={(e) => {
                                      const s = new Set(convertSelectedIds);
                                      if (e.target.checked) s.add(q.id); else s.delete(q.id);
                                      setConvertSelectedIds(s);
                                    }}
                                    className="accent-[#BFA6F6]"
                                    data-testid={`checkbox-convert-${q.id}`}
                                  />
                                </td>
                                <td className="p-2 max-w-xs truncate" title={q.stem}>{q.stem}</td>
                                <td className="p-2"><Badge variant="outline" className="text-xs">{(q.tier || "").toUpperCase()}</Badge></td>
                                <td className="p-2 text-gray-600">{q.bodySystem}</td>
                                <td className="p-2">{q.difficulty ? DIFFICULTY_LABELS[q.difficulty] : "-"}</td>
                                <td className="p-2">{q.alreadyConverted ? <Badge className="text-[10px] bg-green-100 text-green-700">{t("pages.adminFlashcardStudio.converted")}</Badge> : <Badge className="text-[10px] bg-gray-100 text-gray-600">{t("pages.adminFlashcardStudio.available")}</Badge>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {convertResult && (
                    <div className={`mt-4 p-4 rounded-lg border ${convertResult.error ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`} data-testid="div-convert-result">
                      {convertResult.error ? (
                        <p className="text-red-700 text-sm">{convertResult.error}</p>
                      ) : convertResult.previews ? (
                        <div>
                          <p className="font-medium text-green-700 mb-2">Preview: {convertResult.previews.length} cards would be created, {convertResult.wouldSkip} skipped</p>
                          <div className="max-h-[200px] overflow-y-auto space-y-2">
                            {convertResult.previews.slice(0, 5).map((p: any, i: number) => (
                              <div key={i} className="bg-white p-2 rounded border text-xs">
                                <p className="font-medium">{p.front?.substring(0, 100)}</p>
                                <p className="text-gray-500">{p.tier.toUpperCase()} | {p.bodySystem} | {p.topic}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-green-700">Converted: {convertResult.created} created, {convertResult.skipped} skipped</p>
                          {convertResult.errors?.length > 0 && (
                            <div className="mt-2">
                              {convertResult.errors.map((e: any, i: number) => (
                                <p key={i} className="text-xs text-red-600">{e.id}: {e.reason}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "import" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t("pages.adminFlashcardStudio.bulkImportFlashcards")}</CardTitle>
                    <Button variant="outline" size="sm" onClick={downloadTemplate} data-testid="button-download-template">
                      <Download className="w-4 h-4 mr-1" /> Download Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <input ref={fileRef} type="file" accept=".json,.csv" onChange={handleImportFile} className="hidden" />
                    <Button variant="outline" onClick={() => fileRef.current?.click()} data-testid="button-upload-file">
                      <Upload className="w-4 h-4 mr-1" /> Upload JSON/CSV File
                    </Button>
                    <span className="text-sm text-gray-500 self-center">{t("pages.adminFlashcardStudio.orPasteJsonBelow")}</span>
                  </div>

                  <Textarea
                    placeholder={'Paste JSON array of flashcard objects...\n[\n  { "tier": "rn", "front": "...", "rationaleCorrect": "...", ... }\n]'}
                    value={importText}
                    onChange={(e) => handleImportParse(e.target.value)}
                    className="font-mono text-xs min-h-[200px]"
                    data-testid="textarea-import-input"
                  />

                  {importError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm" data-testid="text-import-error">
                      <XCircle className="h-4 w-4" /> {importError}
                    </div>
                  )}

                  {importParsed && (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-testid="div-import-parsed">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                          <CheckCircle className="h-4 w-4" /> {importParsed.length} card{importParsed.length !== 1 ? "s" : ""} parsed
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                          <div>
                            <p className="font-medium text-gray-700">{t("pages.adminFlashcardStudio.byTier")}</p>
                            {Object.entries(importParsed.reduce((acc: any, c: any) => { acc[c.tier || "?"] = (acc[c.tier || "?"] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([t, c]) => (
                              <div key={t} className="flex justify-between"><span className="text-gray-600">{(t as string).toUpperCase()}</span><Badge variant="secondary">{c as number}</Badge></div>
                            ))}
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">{t("pages.adminFlashcardStudio.byTopic")}</p>
                            <div className="max-h-24 overflow-y-auto space-y-0.5">
                              {Object.entries(importParsed.reduce((acc: any, c: any) => { acc[c.topic || c.bodySystem || "?"] = (acc[c.topic || c.bodySystem || "?"] || 0) + 1; return acc; }, {} as Record<string, number>)).slice(0, 8).map(([t, c]) => (
                                <div key={t} className="flex justify-between text-xs"><span className="text-gray-600">{t as string}</span><Badge variant="secondary" className="text-xs">{c as number}</Badge></div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">{t("pages.adminFlashcardStudio.byDifficulty")}</p>
                            {Object.entries(importParsed.reduce((acc: any, c: any) => { const d = c.difficulty || "?"; acc[d] = (acc[d] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([d, c]) => (
                              <div key={d} className="flex justify-between"><span className="text-gray-600">{DIFFICULTY_LABELS[parseInt(d)] || d}</span><Badge variant="secondary">{c as number}</Badge></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch checked={importAutoPublish} onCheckedChange={setImportAutoPublish} id="import-autopub" data-testid="switch-import-autopublish" />
                          <Label htmlFor="import-autopub" className="text-sm">{t("pages.adminFlashcardStudio.autopublishMakeCardsLiveImmediately")}</Label>
                        </div>
                        <Button onClick={doImport} disabled={importing} className="bg-[#BFA6F6] hover:bg-[#a88de6] text-white" data-testid="button-do-import">
                          {importing ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> {t("pages.adminFlashcardStudio.importing")}</> : <><Upload className="w-4 h-4 mr-1" /> Import {importParsed.length} Cards</>}
                        </Button>
                      </div>
                    </>
                  )}

                  {importResult && (
                    <div className={`rounded-lg p-4 border ${importResult.inserted > 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`} data-testid="div-import-result">
                      <h3 className="font-medium text-gray-900 mb-2">{t("pages.adminFlashcardStudio.importResults")}</h3>
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div><span className="text-gray-600">{t("pages.adminFlashcardStudio.total")}</span><p className="text-xl font-bold">{importResult.total}</p></div>
                        <div><span className="text-green-600">{t("pages.adminFlashcardStudio.inserted")}</span><p className="text-xl font-bold text-green-700" data-testid="text-import-inserted">{importResult.inserted}</p></div>
                        <div><span className="text-yellow-600">{t("pages.adminFlashcardStudio.skipped")}</span><p className="text-xl font-bold text-yellow-700">{importResult.skipped}</p></div>
                        <div><span className="text-red-600">{t("pages.adminFlashcardStudio.errors")}</span><p className="text-xl font-bold text-red-700">{(importResult.validationErrors?.length || 0) + (importResult.insertErrors?.length || 0)}</p></div>
                      </div>
                      {importResult.validationErrors?.length > 0 && (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          <p className="text-xs font-medium text-red-700">{t("pages.adminFlashcardStudio.validationErrors")}</p>
                          {importResult.validationErrors.map((e: any, i: number) => (
                            <div key={i} className="flex gap-2 text-xs text-red-600"><AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" /><span>Row {e.index + 1}: {e.reason}</span></div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base text-gray-700">{t("pages.adminFlashcardStudio.importFormatReference")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{t("pages.adminFlashcardStudio.requiredFields")}</p>
                      <ul className="space-y-1 list-disc pl-4">
                        <li><code>{t("pages.adminFlashcardStudio.tier2")}</code> {t("pages.adminFlashcardStudio.rpnRnOrNp")}</li>
                        <li><code>{t("pages.adminFlashcardStudio.front")}</code> {t("pages.adminFlashcardStudio.questionStemMin5Chars")}</li>
                        <li><code>rationaleCorrect</code> or <code>{t("pages.adminFlashcardStudio.back")}</code> {t("pages.adminFlashcardStudio.rationaleText")}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">{t("pages.adminFlashcardStudio.optionalFields")}</p>
                      <ul className="space-y-1 list-disc pl-4">
                        <li><code>{t("pages.adminFlashcardStudio.options2")}</code> {t("pages.adminFlashcardStudio.arrayOfAnswerChoices")}</li>
                        <li><code>correctAnswer</code> {t("pages.adminFlashcardStudio.indexArray03")}</li>
                        <li><code>{t("pages.adminFlashcardStudio.difficulty2")}</code> - 1-5</li>
                        <li><code>bodySystem</code>, <code>{t("pages.adminFlashcardStudio.topic2")}</code>, <code>{t("pages.adminFlashcardStudio.subtopic2")}</code></li>
                        <li><code>clinicalTakeaway</code>, <code>examPearl</code></li>
                        <li><code>highYield</code>, <code>isFoundational</code></li>
                        <li><code>blueprintCategory</code></li>
                        <li><code>distractorRationales</code> {t("pages.adminFlashcardStudio.object")}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "preview" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t("pages.adminFlashcardStudio.tierPreviewWhatLearnersSee")}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={previewTier} onValueChange={setPreviewTier}>
                        <SelectTrigger className="w-[100px]" data-testid="select-preview-tier"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIERS.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={fetchPreview} data-testid="button-refresh-preview">
                        <RefreshCw className="w-3 h-3 mr-1" /> Shuffle
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {previewLoading ? (
                    <div className="p-8 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />{t("pages.adminFlashcardStudio.loading3")}</div>
                  ) : previewCards.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No published cards for {previewTier.toUpperCase()}</div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <Button size="sm" variant="ghost" onClick={() => { setPreviewIdx(Math.max(0, previewIdx - 1)); setShowAnswer(false); }} disabled={previewIdx === 0}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-500">Card {previewIdx + 1} of {previewCards.length}</span>
                        <Button size="sm" variant="ghost" onClick={() => { setPreviewIdx(Math.min(previewCards.length - 1, previewIdx + 1)); setShowAnswer(false); }} disabled={previewIdx >= previewCards.length - 1}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      {(() => {
                        const card = previewCards[previewIdx];
                        if (!card) return null;
                        const opts = Array.isArray(card.options) ? card.options : [];
                        const correctIdx = Array.isArray(card.correctAnswer) ? card.correctAnswer[0] : card.correctAnswer;

                        return (
                          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm min-h-[300px]" data-testid="div-preview-card">
                            <div className="flex gap-2 mb-3">
                              <Badge variant="outline">{previewTier.toUpperCase()}</Badge>
                              {card.bodySystem && <Badge variant="secondary">{card.bodySystem}</Badge>}
                              {card.difficulty && <Badge variant="outline">{DIFFICULTY_LABELS[card.difficulty]}</Badge>}
                              {card.highYield && <Badge className="bg-orange-100 text-orange-700"><Zap className="w-3 h-3 mr-0.5" />{t("pages.adminFlashcardStudio.highyield3")}</Badge>}
                            </div>

                            <p className="text-lg font-medium text-gray-900 mb-4" data-testid="text-preview-front">{card.front}</p>

                            {opts.length > 0 && (
                              <div className="space-y-2 mb-4">
                                {opts.map((opt: any, i: number) => {
                                  const optText = typeof opt === "object" ? opt.text : opt;
                                  const isCorrect = i === correctIdx;
                                  return (
                                    <div
                                      key={i}
                                      className={`p-3 rounded-lg border text-sm ${showAnswer ? (isCorrect ? "bg-green-50 border-green-300 font-medium" : "bg-gray-50 border-gray-200") : "bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer"}`}
                                      onClick={() => setShowAnswer(true)}
                                      data-testid={`div-preview-option-${i}`}
                                    >
                                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                                      {optText}
                                      {showAnswer && isCorrect && <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {!showAnswer && (
                              <Button variant="outline" className="w-full" onClick={() => setShowAnswer(true)} data-testid="button-show-answer">{t("pages.adminFlashcardStudio.showAnswer")}</Button>
                            )}

                            {showAnswer && (
                              <div className="mt-4 space-y-3 border-t pt-4">
                                {card.rationaleCorrect && (
                                  <div><p className="text-xs font-medium text-green-700 mb-1">{t("pages.adminFlashcardStudio.rationale")}</p><p className="text-sm text-gray-700">{card.rationaleCorrect}</p></div>
                                )}
                                {card.clinicalTakeaway && (
                                  <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs font-medium text-blue-700 mb-1">{t("pages.adminFlashcardStudio.clinicalPearl2")}</p><p className="text-sm text-blue-900">{card.clinicalTakeaway}</p></div>
                                )}
                                {card.examPearl && (
                                  <div className="bg-purple-50 p-3 rounded-lg"><p className="text-xs font-medium text-purple-700 mb-1">{t("pages.adminFlashcardStudio.examStrategy")}</p><p className="text-sm text-purple-900">{card.examPearl}</p></div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {tab === "stats" && <ContentReuseStats />}

          {tab === "ai-generate" && <AIGeneratePanel />}
          {tab === "quality" && <QualityToolsPanel />}
          {tab === "config" && <BuildConfigPanel />}
        </div>
      </main>
    </>
  );
}

function ContentReuseStats() {
  const [stats, setStats] = useState<any>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [bankRes, tbRes] = await Promise.all([
        adminFetch("/api/admin/exam-flashcards/stats"),
        adminFetch("/api/test-bank/stats"),
      ]);
      const bankData = await bankRes.json();
      const tbData = await tbRes.json();
      setStats({ bank: bankData, testBank: tbData });
    } catch (e: any) {
      console.error("Failed to load stats:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await adminFetch("/api/admin/exam-flashcards/sync", { method: "POST" });
      const data = await res.json();
      setSyncResult(data);
      await fetchStats();
    } catch (e: any) {
      setSyncResult({ error: e.message });
    }
    setSyncing(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (!stats) return <div className="text-center py-12 text-gray-500">{t("pages.adminFlashcardStudio.failedToLoadStats")}</div>;

  const { bank, testBank } = stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900" data-testid="text-content-reuse-title">{t("pages.adminFlashcardStudio.contentReuseDashboard")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("pages.adminFlashcardStudio.catExamQuestionsMappedTo")}</p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="bg-[#BFA6F6] hover:bg-[#a88de6] text-white"
          data-testid="button-sync-mapper"
        >
          {syncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          {syncing ? "Syncing..." : "Re-sync All"}
        </Button>
      </div>

      {syncResult && (
        <Card className={syncResult.error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4">
            {syncResult.error ? (
              <p className="text-sm text-red-700"><XCircle className="w-4 h-4 inline mr-1" />{syncResult.error}</p>
            ) : (
              <div className="text-sm text-green-700">
                <p className="font-medium mb-1"><CheckCircle className="w-4 h-4 inline mr-1" />{t("pages.adminFlashcardStudio.syncComplete")}</p>
                <p>Total processed: {syncResult.total} | Created: {syncResult.created} | Updated: {syncResult.updated} | Skipped: {syncResult.skipped}</p>
                {syncResult.perTier && (
                  <p className="mt-1">Per tier: {Object.entries(syncResult.perTier).map(([t, c]) => `${t.toUpperCase()}: ${c}`).join(" | ")}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 font-medium mb-1">{t("pages.adminFlashcardStudio.catExamQuestions")}</p>
            <p className="text-3xl font-bold text-gray-900" data-testid="text-cat-total">
              {testBank.catQuestions?.reduce((s: number, r: any) => s + r.count, 0) || 0}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {testBank.catQuestions?.map((r: any) => (
                <Badge key={r.tier} className="bg-violet-50 text-violet-700 text-xs">{r.tier.toUpperCase()}: {r.count}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 font-medium mb-1">{t("pages.adminFlashcardStudio.testBankFlashcardEntries")}</p>
            <p className="text-3xl font-bold text-gray-900" data-testid="text-testbank-total">
              {bank.totalExamFlashcards || 0}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {Object.entries(bank.perTier || {}).map(([tier, count]) => (
                <Badge key={tier} className="bg-emerald-50 text-emerald-700 text-xs">{tier.toUpperCase()}: {count as number}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 font-medium mb-1">{t("pages.adminFlashcardStudio.coverageRate")}</p>
            <p className="text-3xl font-bold text-gray-900" data-testid="text-coverage-rate">
              {(() => {
                const catTotal = testBank.catQuestions?.reduce((s: number, r: any) => s + r.count, 0) || 0;
                return catTotal > 0 && bank.totalExamFlashcards
                  ? `${Math.round((bank.totalExamFlashcards / catTotal) * 100)}%`
                  : "N/A";
              })()}
            </p>
            <p className="text-xs text-gray-400 mt-2">{t("pages.adminFlashcardStudio.uniqueQuestionsMappedToStudy")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">{t("pages.adminFlashcardStudio.imageAttachmentCoverage")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testBank.coverage?.map((r: any) => {
              const total = (r.with_images || 0) + (r.missing_images || 0);
              const pct = total ? Math.round((r.with_images / total) * 100) : 0;
              return (
                <div key={r.tier} data-testid={`stat-images-${r.tier}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{r.tier.toUpperCase()}</span>
                    <span className="text-gray-500">{r.with_images} / {total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-gray-400 mt-1">{t("pages.adminFlashcardStudio.questionsWithAtLeastOne")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">{t("pages.adminFlashcardStudio.lessonLinkCoverage")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testBank.coverage?.map((r: any) => {
              const total = (r.with_lessons || 0) + (r.missing_lessons || 0);
              const pct = total ? Math.round((r.with_lessons / total) * 100) : 0;
              return (
                <div key={r.tier} data-testid={`stat-lessons-${r.tier}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{r.tier.toUpperCase()}</span>
                    <span className="text-gray-500">{r.with_lessons} / {total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-gray-400 mt-1">{t("pages.adminFlashcardStudio.questionsLinkedToAtLeast")}</p>
          </CardContent>
        </Card>
      </div>

      {testBank.categories && testBank.categories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">{t("pages.adminFlashcardStudio.questionsByCategoryTier")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["rpn", "rn", "np"].map(tier => {
                const cats = testBank.categories.filter((c: any) => c.tier === tier).slice(0, 12);
                if (cats.length === 0) return null;
                return (
                  <div key={tier}>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{tier.toUpperCase()}</p>
                    <div className="space-y-1">
                      {cats.map((c: any) => (
                        <div key={c.category} className="flex justify-between text-xs">
                          <span className="text-gray-600 truncate">{c.category || "Uncategorized"}</span>
                          <span className="text-gray-400 font-medium ml-2">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-amber-800 mb-2">{t("pages.adminFlashcardStudio.summary")}</p>
          <div className="text-xs text-amber-700 space-y-1">
            <p>{t("pages.adminFlashcardStudio.allCatExamQuestionsAre")}</p>
            <p>{t("pages.adminFlashcardStudio.questionsWithMatchedImagesShow")}</p>
            <p>{t("pages.adminFlashcardStudio.questionsWithMatchedLessonsShow")}</p>
            <p>{t("pages.adminFlashcardStudio.useTheResyncAllButton")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AIGeneratePanel() {
  const [tier, setTier] = useState("rn");
  const [sourceType, setSourceType] = useState("question_explanations");
  const [limit, setLimit] = useState(20);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ generated: number; skipped: number } | null>(null);
  const [adminAnalytics, setAdminAnalytics] = useState<any>(null);

  useEffect(() => {
    adminFetch("/api/admin/sm2/analytics")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAdminAnalytics(data); })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    try {
      const res = await adminFetch("/api/admin/sm2/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceType, tier, limit }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ generated: 0, skipped: 0 });
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-500" /> Bulk AI Flashcard Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">{t("pages.adminFlashcardStudio.sourceType")}</Label>
              <Select value={sourceType} onValueChange={setSourceType}>
                <SelectTrigger data-testid="select-source-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="question_explanations">{t("pages.adminFlashcardStudio.questionExplanations")}</SelectItem>
                  <SelectItem value="study_guides">{t("pages.adminFlashcardStudio.studyGuides")}</SelectItem>
                  <SelectItem value="topic_summaries">{t("pages.adminFlashcardStudio.topicSummaries")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{t("pages.adminFlashcardStudio.tier3")}</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger data-testid="select-gen-tier"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIERS.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{t("pages.adminFlashcardStudio.batchSize")}</Label>
              <Input type="number" value={limit} onChange={e => setLimit(parseInt(e.target.value) || 20)} min={1} max={100} data-testid="input-batch-size" />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="w-full" data-testid="button-bulk-generate">
            {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("pages.adminFlashcardStudio.generating")}</> : <><Zap className="w-4 h-4 mr-2" /> {t("pages.adminFlashcardStudio.generateFlashcards")}</>}
          </Button>
          {result && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm" data-testid="text-generate-result">
              <CheckCircle className="w-4 h-4 text-green-600 inline mr-2" />
              Generated {result.generated} flashcards, skipped {result.skipped}.
            </div>
          )}
        </CardContent>
      </Card>

      {adminAnalytics && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">{t("pages.adminFlashcardStudio.generationStatistics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-2 rounded-lg bg-violet-50">
                <div className="text-xl font-bold text-violet-600">{adminAnalytics.totalCards}</div>
                <div className="text-[10px] text-gray-500">{t("pages.adminFlashcardStudio.totalCards")}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-50">
                <div className="text-xl font-bold text-blue-600">{adminAnalytics.totalReviews}</div>
                <div className="text-[10px] text-gray-500">{t("pages.adminFlashcardStudio.totalReviews")}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-green-50">
                <div className="text-xl font-bold text-green-600">{adminAnalytics.activeUsers}</div>
                <div className="text-[10px] text-gray-500">{t("pages.adminFlashcardStudio.activeUsers")}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-orange-50">
                <div className="text-xl font-bold text-orange-600">{adminAnalytics.duplicateCount}</div>
                <div className="text-[10px] text-gray-500">{t("pages.adminFlashcardStudio.duplicates")}</div>
              </div>
            </div>
            {adminAnalytics.generationStats?.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">{t("pages.adminFlashcardStudio.bySource")}</p>
                {adminAnalytics.generationStats.map((gs: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-gray-600">{gs.source || "manual"}</span>
                    <span className="font-medium">{gs.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QualityToolsPanel() {
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [flagResult, setFlagResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [flagging, setFlagging] = useState(false);

  const fetchDuplicates = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/sm2/duplicates");
      const data = await res.json();
      setDuplicates(data);
    } catch {}
    setLoading(false);
  };

  const handleFlagLowQuality = async () => {
    setFlagging(true);
    try {
      const res = await adminFetch("/api/admin/sm2/flag-low-quality", { method: "POST" });
      const data = await res.json();
      setFlagResult(data.flagged);
    } catch {}
    setFlagging(false);
  };

  useEffect(() => { fetchDuplicates(); }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Quality Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleFlagLowQuality} disabled={flagging} variant="outline" className="w-full" data-testid="button-flag-low-quality">
            {flagging ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("pages.adminFlashcardStudio.scanning")}</> : <><AlertTriangle className="w-4 h-4 mr-2" /> {t("pages.adminFlashcardStudio.flagLowqualityCards")}</>}
          </Button>
          {flagResult !== null && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs" data-testid="text-flag-result">
              Flagged {flagResult} low-quality cards for review.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Duplicate Detection ({duplicates.length} groups)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : duplicates.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">{t("pages.adminFlashcardStudio.noDuplicateFlashcardsDetected")}</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto" data-testid="list-duplicates">
              {duplicates.map((dup, i) => (
                <div key={i} className="p-2 rounded-lg border border-gray-200 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hash: {dup.hash.substring(0, 12)}...</span>
                    <Badge className="text-[10px] bg-red-100 text-red-700">{dup.count} copies</Badge>
                  </div>
                  <div className="text-gray-400 mt-1">IDs: {dup.ids.slice(0, 3).join(", ")}{dup.ids.length > 3 ? "..." : ""}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BuildConfigPanel() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/config/build-priority")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setConfig(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>;
  if (!config) return <p className="text-sm text-gray-500 text-center py-8">{t("pages.adminFlashcardStudio.failedToLoadConfig")}</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">{t("pages.adminFlashcardStudio.activeBuildPriority")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 rounded-lg bg-violet-50 border border-violet-200" data-testid="text-build-priority">
            <p className="text-sm font-bold text-violet-700">{config.ACTIVE_BUILD_PRIORITY}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">{t("pages.adminFlashcardStudio.contentExpansionRoadmap")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" data-testid="list-roadmap">
            {config.CONTENT_EXPANSION_ROADMAP?.map((item: any) => (
              <div key={item.rank} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">{item.rank}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
