import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Search, Edit2, Archive, CheckCircle, X, ChevronLeft, ChevronRight, BarChart3, Save } from "lucide-react";

import { useI18n } from "@/lib/i18n";
function formatStatus(status: string): string {

  return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function getAuthHeaders(): Record<string, string> {
  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      return { "x-username": username, "x-password": password };
    }
  } catch {}
  return {};
}

interface QuestionSummary {
  id: string;
  stem: string;
  tier: string;
  exam: string;
  status: string;
  difficulty: number;
  bodySystem: string;
  topic: string;
  regionScope: string;
}

interface QuestionDetail {
  id: string;
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: string[];
  correctAnswer: number[];
  rationale: string;
  difficulty: number;
  bodySystem: string;
  topic: string;
  subtopic: string;
  regionScope: string;
  createdAt: string;
  publishedAt: string;
}

interface Analytics {
  total: number;
  byCategory: { category: string; count: number; published: number }[];
  byDifficulty: { difficulty: number; label: string; count: number; published: number }[];
  byExam: { exam: string; count: number; published: number }[];
  byRegion: { region: string; count: number }[];
  byStatus: { status: string; count: number }[];
  tier: string;
}

export default function AdminQBankManage() {
  const { user, effectiveTier } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"questions" | "analytics">("questions");

  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("rpn");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState<QuestionDetail | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsTier, setAnalyticsTier] = useState("rpn");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const isAdmin = effectiveTier === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/admin");
    }
  }, [isAdmin]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("tier", filterTier);
      params.set("limit", "20");
      params.set("offset", String(page * 20));
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/qbank?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setQuestions(data.questions.map((q: any) => ({
        id: q.id,
        stem: q.stem?.substring(0, 120) + (q.stem?.length > 120 ? "..." : ""),
        tier: q.tier,
        exam: q.exam || "",
        status: q.status,
        difficulty: q.difficulty,
        bodySystem: q.bodySystem || q.body_system || "",
        topic: q.topic || "",
        regionScope: q.regionScope || q.region_scope || "",
      })));
      setTotalCount(data.total || data.questions.length);
    } catch (e) {
      console.error("Failed to load questions:", e);
    } finally {
      setLoading(false);
    }
  }, [filterTier, filterStatus, searchTerm, page]);

  useEffect(() => {
    if (isAdmin && tab === "questions") fetchQuestions();
  }, [fetchQuestions, isAdmin, tab]);

  const loadQuestion = async (id: string) => {
    setEditLoading(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/admin/qbank/question/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEditingQuestion(data);
    } catch (e) {
      console.error("Failed to load question:", e);
    } finally {
      setEditLoading(false);
    }
  };

  const saveQuestion = async () => {
    if (!editingQuestion) return;
    setEditLoading(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/admin/qbank/question/${editingQuestion.id}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          stem: editingQuestion.stem,
          options: editingQuestion.options,
          correctAnswer: editingQuestion.correctAnswer,
          rationale: editingQuestion.rationale,
          difficulty: editingQuestion.difficulty,
          bodySystem: editingQuestion.bodySystem,
          topic: editingQuestion.topic,
          subtopic: editingQuestion.subtopic,
          exam: editingQuestion.exam,
          regionScope: editingQuestion.regionScope,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveMessage("Saved successfully");
      fetchQuestions();
    } catch (e) {
      setSaveMessage("Failed to save");
    } finally {
      setEditLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/qbank/question/${id}/toggle-status`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (editingQuestion?.id === id) {
        setEditingQuestion(prev => prev ? { ...prev, status: data.newStatus } : null);
      }
      fetchQuestions();
    } catch (e) {
      console.error("Failed to toggle status:", e);
    }
  };

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/admin/qbank/analytics?tier=${analyticsTier}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error("Failed to load analytics:", e);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsTier]);

  useEffect(() => {
    if (isAdmin && tab === "analytics") fetchAnalytics();
  }, [fetchAnalytics, isAdmin, tab]);

  const diffLabels: Record<number, string> = { 1: "Very Easy", 2: "Easy", 3: "Moderate", 4: "Hard", 5: "Very Hard" };

  if (!isAdmin) return null;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-warmwhite">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-admin-qbank-title">{t("pages.adminQbankManage.questionBankManagement")}</h1>

          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "questions" ? "default" : "outline"}
              onClick={() => setTab("questions")}
              className={tab === "questions" ? "bg-[#BFA6F6] hover:bg-[#a88de6] text-white" : ""}
              data-testid="button-tab-questions"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Questions
            </Button>
            <Button
              variant={tab === "analytics" ? "default" : "outline"}
              onClick={() => setTab("analytics")}
              className={tab === "analytics" ? "bg-[#BFA6F6] hover:bg-[#a88de6] text-white" : ""}
              data-testid="button-tab-analytics"
            >
              <BarChart3 className="w-4 h-4 mr-2" /> Analytics
            </Button>
          </div>

          {tab === "questions" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder={t("pages.adminQbankManage.searchQuestions")}
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                          className="pl-9"
                          data-testid="input-search-questions"
                        />
                      </div>
                      <Select value={filterTier} onValueChange={(v) => { setFilterTier(v); setPage(0); }}>
                        <SelectTrigger className="w-[100px]" data-testid="select-manage-tier">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rpn">RPN</SelectItem>
                          <SelectItem value="rn">RN</SelectItem>
                          <SelectItem value="np">NP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(0); }}>
                        <SelectTrigger className="w-[120px]" data-testid="select-manage-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("pages.adminQbankManage.allStatuses")}</SelectItem>
                          <SelectItem value="published">{t("pages.adminQbankManage.published")}</SelectItem>
                          <SelectItem value="archived">{t("pages.adminQbankManage.archived")}</SelectItem>
                          <SelectItem value="draft">{t("pages.adminQbankManage.draft")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="p-8 text-center text-gray-400">{t("pages.adminQbankManage.loading")}</div>
                    ) : questions.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">{t("pages.adminQbankManage.noQuestionsFound")}</div>
                    ) : (
                      <div className="divide-y">
                        {questions.map((q) => (
                          <div
                            key={q.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition-colors ${editingQuestion?.id === q.id ? "bg-purple-50" : ""}`}
                            onClick={() => loadQuestion(q.id)}
                            data-testid={`row-question-${q.id}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 line-clamp-2">{q.stem}</p>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <Badge variant="outline" className="text-xs">{q.tier.toUpperCase()}</Badge>
                                {q.bodySystem && <Badge variant="secondary" className="text-xs">{q.bodySystem}</Badge>}
                                {q.difficulty && <Badge variant="outline" className="text-xs">{diffLabels[q.difficulty] || `L${q.difficulty}`}</Badge>}
                                {q.exam && <Badge variant="outline" className="text-xs">{q.exam}</Badge>}
                              </div>
                            </div>
                            <Badge
                              className={`shrink-0 text-xs ${q.status === "published" ? "bg-green-100 text-green-700" : q.status === "archived" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
                            >
                              {formatStatus(q.status)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      <span className="text-xs text-gray-500">
                        {totalCount} question{totalCount !== 1 ? "s" : ""} total
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} data-testid="button-prev-page">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-gray-500">Page {page + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => setPage(page + 1)} disabled={(page + 1) * 20 >= totalCount} data-testid="button-next-page">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {editingQuestion ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{t("pages.adminQbankManage.editQuestion")}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(null)} data-testid="button-close-edit">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge className={editingQuestion.status === "published" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {formatStatus(editingQuestion.status)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(editingQuestion.id)}
                          className="text-xs"
                          data-testid="button-toggle-status"
                        >
                          {editingQuestion.status === "published" ? (
                            <><Archive className="w-3 h-3 mr-1" /> {t("pages.adminQbankManage.disable")}</>
                          ) : (
                            <><CheckCircle className="w-3 h-3 mr-1" /> {t("pages.adminQbankManage.enable")}</>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.questionStem")}</label>
                        <Textarea
                          value={editingQuestion.stem}
                          onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, stem: e.target.value } : null)}
                          rows={3}
                          className="text-sm"
                          data-testid="input-edit-stem"
                        />
                      </div>

                      {editingQuestion.options.map((opt, i) => (
                        <div key={i}>
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            Option {String.fromCharCode(65 + i)}
                            {editingQuestion.correctAnswer.includes(i) && (
                              <span className="ml-1 text-green-600">{t("pages.adminQbankManage.correct")}</span>
                            )}
                          </label>
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...editingQuestion.options];
                              newOpts[i] = e.target.value;
                              setEditingQuestion(prev => prev ? { ...prev, options: newOpts } : null);
                            }}
                            className="text-sm"
                            data-testid={`input-edit-option-${i}`}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.correctAnswer")}</label>
                        <Select
                          value={String(editingQuestion.correctAnswer[0])}
                          onValueChange={(v) => setEditingQuestion(prev => prev ? { ...prev, correctAnswer: [parseInt(v)] } : null)}
                        >
                          <SelectTrigger className="text-sm" data-testid="select-correct-answer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {editingQuestion.options.map((_, i) => (
                              <SelectItem key={i} value={String(i)}>Option {String.fromCharCode(65 + i)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.rationale")}</label>
                        <Textarea
                          value={editingQuestion.rationale || ""}
                          onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, rationale: e.target.value } : null)}
                          rows={3}
                          className="text-sm"
                          data-testid="input-edit-rationale"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.difficulty")}</label>
                          <Select
                            value={String(editingQuestion.difficulty || 3)}
                            onValueChange={(v) => setEditingQuestion(prev => prev ? { ...prev, difficulty: parseInt(v) } : null)}
                          >
                            <SelectTrigger className="text-sm" data-testid="select-edit-difficulty">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1,2,3,4,5].map(d => (
                                <SelectItem key={d} value={String(d)}>{diffLabels[d]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.exam")}</label>
                          <Input
                            value={editingQuestion.exam || ""}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, exam: e.target.value } : null)}
                            className="text-sm"
                            data-testid="input-edit-exam"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.bodySystem")}</label>
                          <Input
                            value={editingQuestion.bodySystem || ""}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, bodySystem: e.target.value } : null)}
                            className="text-sm"
                            data-testid="input-edit-bodysystem"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.topic")}</label>
                          <Input
                            value={editingQuestion.topic || ""}
                            onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, topic: e.target.value } : null)}
                            className="text-sm"
                            data-testid="input-edit-topic"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">{t("pages.adminQbankManage.region")}</label>
                        <Select
                          value={editingQuestion.regionScope || "BOTH"}
                          onValueChange={(v) => setEditingQuestion(prev => prev ? { ...prev, regionScope: v } : null)}
                        >
                          <SelectTrigger className="text-sm" data-testid="select-edit-region">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">US</SelectItem>
                            <SelectItem value="CAN">{t("pages.adminQbankManage.canada")}</SelectItem>
                            <SelectItem value="BOTH">{t("pages.adminQbankManage.both")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          onClick={saveQuestion}
                          disabled={editLoading}
                          className="bg-[#BFA6F6] hover:bg-[#a88de6] text-white flex-1"
                          data-testid="button-save-question"
                        >
                          <Save className="w-4 h-4 mr-1" /> {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                      {saveMessage && (
                        <p className={`text-xs text-center ${saveMessage.includes("success") ? "text-green-600" : "text-red-600"}`} data-testid="text-save-message">
                          {saveMessage}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-400">
                      <Edit2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">{t("pages.adminQbankManage.selectAQuestionToEdit")}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Select value={analyticsTier} onValueChange={setAnalyticsTier}>
                  <SelectTrigger className="w-[120px]" data-testid="select-analytics-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rpn">RPN</SelectItem>
                    <SelectItem value="rn">RN</SelectItem>
                    <SelectItem value="np">NP</SelectItem>
                  </SelectContent>
                </Select>
                {analytics && (
                  <span className="text-sm text-gray-500" data-testid="text-analytics-total">{analytics.total.toLocaleString()} total questions</span>
                )}
              </div>

              {analyticsLoading ? (
                <div className="text-center py-12 text-gray-400">{t("pages.adminQbankManage.loadingAnalytics")}</div>
              ) : analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base">{t("pages.adminQbankManage.byStatus")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.byStatus.map(s => (
                          <div key={s.status} className="flex items-center justify-between" data-testid={`row-status-${s.status}`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${s.status === "published" ? "bg-green-500" : s.status === "archived" ? "bg-red-400" : "bg-gray-300"}`} />
                              <span className="text-sm">{formatStatus(s.status)}</span>
                            </div>
                            <span className="text-sm font-medium">{s.count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">{t("pages.adminQbankManage.byDifficulty")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.byDifficulty.map(d => {
                          const pct = analytics.total > 0 ? (d.count / analytics.total * 100) : 0;
                          return (
                            <div key={d.difficulty} data-testid={`row-difficulty-${d.difficulty}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">{d.label}</span>
                                <span className="text-xs text-gray-500">{d.count} ({pct.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#BFA6F6] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">{t("pages.adminQbankManage.byCategory")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {analytics.byCategory.map(c => (
                          <div key={c.category} className="flex items-center justify-between" data-testid={`row-category-${c.category}`}>
                            <span className="text-sm truncate mr-2">{c.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-600">{c.published}</span>
                              <span className="text-xs text-gray-400">/</span>
                              <span className="text-xs text-gray-500">{c.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">{t("pages.adminQbankManage.byExamRegion")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1.5">{t("pages.adminQbankManage.examTypes")}</h4>
                          {analytics.byExam.map(e => (
                            <div key={e.exam} className="flex items-center justify-between py-0.5" data-testid={`row-exam-${e.exam}`}>
                              <span className="text-sm">{e.exam}</span>
                              <span className="text-sm font-medium">{e.count}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1.5">{t("pages.adminQbankManage.regionScope")}</h4>
                          {analytics.byRegion.map(r => (
                            <div key={r.region} className="flex items-center justify-between py-0.5" data-testid={`row-region-${r.region}`}>
                              <span className="text-sm">{r.region}</span>
                              <span className="text-sm font-medium">{r.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
