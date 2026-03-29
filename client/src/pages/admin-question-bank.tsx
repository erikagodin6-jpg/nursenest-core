import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, getAdminAccessToken } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Upload,
  Search,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Save,
  X,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Database,
  Filter,
} from "lucide-react";

function adminHeaders() {
  const { t } = useI18n();
  const token = getAdminAccessToken();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

type QuestionItem = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  rationale: string;
  category: string;
  difficulty: string;
  examType: string;
  country: string;
  questionType: string;
  clientNeeds: string;
  topic: string;
  status: string;
  createdAt: string;
};

export default function AdminQuestionBankPage() {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [importJson, setImportJson] = useState("");
  const [importResult, setImportResult] = useState<any>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterExamType, setFilterExamType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<QuestionItem>>({});
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, setLocation]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCountry) params.set("country", filterCountry);
      if (filterExamType) params.set("examType", filterExamType);
      if (filterStatus) params.set("status", filterStatus);
      if (filterCategory) params.set("category", filterCategory);
      const resp = await fetch(`/api/question-bank/admin/all?${params}`, { headers: adminHeaders() });
      const data = await resp.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [filterCountry, filterExamType, filterStatus, filterCategory]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleImport = async () => {
    setImportLoading(true);
    setImportResult(null);
    try {
      const questions = JSON.parse(importJson);
      const resp = await fetch("/api/question-bank/import", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ questions: Array.isArray(questions) ? questions : [questions] }),
      });
      const result = await resp.json();
      setImportResult(result);
      if (result.importedCount > 0) {
        fetchItems();
      }
    } catch (e: any) {
      setImportResult({ error: e.message || "Invalid JSON" });
    }
    setImportLoading(false);
  };

  const handleToggle = async (id: string) => {
    await fetch(`/api/question-bank/items/${id}/toggle`, { method: "POST", headers: adminHeaders() });
    fetchItems();
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await fetch(`/api/question-bank/items/${editingId}`, {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm({});
    fetchItems();
  };

  const startEdit = (item: QuestionItem) => {
    setEditingId(item.id);
    setEditForm({
      question: item.question,
      optionA: item.optionA,
      optionB: item.optionB,
      optionC: item.optionC,
      optionD: item.optionD,
      correctAnswer: item.correctAnswer,
      rationale: item.rationale,
      category: item.category,
      difficulty: item.difficulty,
      topic: item.topic,
      clientNeeds: item.clientNeeds,
    });
  };

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.question.toLowerCase().includes(s) || item.topic.toLowerCase().includes(s) || item.category.toLowerCase().includes(s);
  });

  const stats = {
    total: items.length,
    active: items.filter((i) => i.status === "active").length,
    disabled: items.filter((i) => i.status === "disabled").length,
    nclexPn: items.filter((i) => i.examType === "NCLEX-PN").length,
    rexPn: items.filter((i) => i.examType === "REx-PN").length,
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">{t("pages.adminQuestionBank.questionBankAdmin")}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("pages.adminQuestionBank.manageNclexpnAndRexpnQuestion")}</p>
          </div>
          <Button onClick={() => setShowImport(!showImport)} data-testid="button-toggle-import">
            <Upload className="h-4 w-4 mr-2" />
            {showImport ? "Hide Import" : "Import Questions"}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-blue-600" data-testid="text-stat-total">{stats.total}</div><div className="text-xs text-gray-500">{t("pages.adminQuestionBank.total")}</div></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-green-600" data-testid="text-stat-active">{stats.active}</div><div className="text-xs text-gray-500">{t("pages.adminQuestionBank.active")}</div></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-red-600" data-testid="text-stat-disabled">{stats.disabled}</div><div className="text-xs text-gray-500">{t("pages.adminQuestionBank.disabled")}</div></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-purple-600" data-testid="text-stat-nclex">{stats.nclexPn}</div><div className="text-xs text-gray-500">{t("pages.adminQuestionBank.nclexpn")}</div></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-orange-600" data-testid="text-stat-rex">{stats.rexPn}</div><div className="text-xs text-gray-500">{t("pages.adminQuestionBank.rexpn")}</div></CardContent></Card>
        </div>

        {showImport && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" />{t("pages.adminQuestionBank.jsonImport")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Paste a JSON array of questions. Required fields: question, option_a, option_b, option_c, option_d, correct_answer (A/B/C/D), rationale, category, difficulty, exam_type, country, client_needs, topic
              </p>
              <Textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                rows={10}
                placeholder='[{"question": "...", "option_a": "...", ...}]'
                className="font-mono text-xs mb-3"
                data-testid="input-import-json"
              />
              <Button onClick={handleImport} disabled={importLoading || !importJson.trim()} data-testid="button-run-import">
                {importLoading ? "Processing..." : "Validate & Import"}
              </Button>
              {importResult && (
                <div className="mt-4 p-4 rounded-lg border bg-gray-50 dark:bg-gray-800" data-testid="text-import-result">
                  {importResult.error ? (
                    <div className="text-red-600 flex items-center gap-2"><XCircle className="h-4 w-4" />{importResult.error}</div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4" />{importResult.acceptedCount} accepted</span>
                        {importResult.rejectedCount > 0 && <span className="flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" />{importResult.rejectedCount} rejected</span>}
                        <span className="text-gray-500">of {importResult.totalRows} total</span>
                      </div>
                      {importResult.errors?.length > 0 && (
                        <div className="mt-2 max-h-40 overflow-y-auto">
                          {importResult.errors.map((err: any, i: number) => (
                            <div key={i} className="text-xs text-red-500 flex items-center gap-1 mb-1">
                              <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                              Row {err.row}: {err.field} - {err.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("pages.adminQuestionBank.searchQuestions")}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-filter-country">
                <option value="">{t("pages.adminQuestionBank.allCountries")}</option>
                <option value="US">US</option>
                <option value="CA">CA</option>
              </select>
              <select value={filterExamType} onChange={(e) => setFilterExamType(e.target.value)} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-filter-exam-type">
                <option value="">{t("pages.adminQuestionBank.allExamTypes")}</option>
                <option value="NCLEX-PN">{t("pages.adminQuestionBank.nclexpn2")}</option>
                <option value="REx-PN">{t("pages.adminQuestionBank.rexpn2")}</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-filter-status">
                <option value="">{t("pages.adminQuestionBank.allStatus")}</option>
                <option value="active">{t("pages.adminQuestionBank.active2")}</option>
                <option value="disabled">{t("pages.adminQuestionBank.disabled2")}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12 text-gray-400">{t("pages.adminQuestionBank.loadingQuestions")}</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12" data-testid="text-empty-state">
            <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t("pages.adminQuestionBank.noQuestionsFoundImportQuestions")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`${item.status === "disabled" ? "opacity-60" : ""}`} data-testid={`card-question-${item.id}`}>
                <CardContent className="p-4">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <Textarea value={editForm.question || ""} onChange={(e) => setEditForm({ ...editForm, question: e.target.value })} placeholder={t("pages.adminQuestionBank.question")} rows={2} data-testid="input-edit-question" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={editForm.optionA || ""} onChange={(e) => setEditForm({ ...editForm, optionA: e.target.value })} placeholder={t("pages.adminQuestionBank.optionA")} data-testid="input-edit-option-a" />
                        <Input value={editForm.optionB || ""} onChange={(e) => setEditForm({ ...editForm, optionB: e.target.value })} placeholder={t("pages.adminQuestionBank.optionB")} data-testid="input-edit-option-b" />
                        <Input value={editForm.optionC || ""} onChange={(e) => setEditForm({ ...editForm, optionC: e.target.value })} placeholder={t("pages.adminQuestionBank.optionC")} data-testid="input-edit-option-c" />
                        <Input value={editForm.optionD || ""} onChange={(e) => setEditForm({ ...editForm, optionD: e.target.value })} placeholder={t("pages.adminQuestionBank.optionD")} data-testid="input-edit-option-d" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <select value={editForm.correctAnswer || ""} onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-edit-correct-answer">
                          <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                        </select>
                        <Input value={editForm.category || ""} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder={t("pages.adminQuestionBank.category")} data-testid="input-edit-category" />
                        <select value={editForm.difficulty || ""} onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-edit-difficulty">
                          <option value="easy">{t("pages.adminQuestionBank.easy")}</option><option value="moderate">{t("pages.adminQuestionBank.moderate")}</option><option value="hard">{t("pages.adminQuestionBank.hard")}</option><option value="very_hard">{t("pages.adminQuestionBank.veryHard")}</option>
                        </select>
                      </div>
                      <Textarea value={editForm.rationale || ""} onChange={(e) => setEditForm({ ...editForm, rationale: e.target.value })} placeholder={t("pages.adminQuestionBank.rationale")} rows={2} data-testid="input-edit-rationale" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit} data-testid="button-save-edit"><Save className="h-3 w-3 mr-1" />{t("pages.adminQuestionBank.save")}</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditForm({}); }} data-testid="button-cancel-edit"><X className="h-3 w-3 mr-1" />{t("pages.adminQuestionBank.cancel")}</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="font-medium text-sm text-gray-900 dark:text-white flex-1" data-testid={`text-question-${item.id}`}>{item.question}</p>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(item)} data-testid={`button-edit-${item.id}`}><Pencil className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggle(item.id)} data-testid={`button-toggle-${item.id}`}>
                            {item.status === "active" ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-300 mb-2">
                        <span className={item.correctAnswer === "A" ? "font-bold text-green-600" : ""}>A: {item.optionA}</span>
                        <span className={item.correctAnswer === "B" ? "font-bold text-green-600" : ""}>B: {item.optionB}</span>
                        <span className={item.correctAnswer === "C" ? "font-bold text-green-600" : ""}>C: {item.optionC}</span>
                        <span className={item.correctAnswer === "D" ? "font-bold text-green-600" : ""}>D: {item.optionD}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">{item.examType}</Badge>
                        <Badge variant="outline" className="text-xs">{item.country}</Badge>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <Badge variant="outline" className="text-xs">{item.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs">{item.topic}</Badge>
                        <Badge variant={item.status === "active" ? "default" : "destructive"} className="text-xs">{item.status}</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
