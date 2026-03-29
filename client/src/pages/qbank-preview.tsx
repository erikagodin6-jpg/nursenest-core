import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  Search,
  BookOpen,
  BarChart3,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Database,
  Filter,
  TrendingUp,
} from "lucide-react";

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

type Question = {
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
  topic: string;
  clientNeeds: string;
  status: string;
  contentTier?: string | null;
};

type AnalyticsItem = {
  category: string;
  difficulty: string;
  totalAttempts: number;
  correctRate: number;
};

export default function QBankPreviewPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"browse" | "analytics">("browse");

  useEffect(() => {
    if (user && user.tier !== "admin" && tab === "analytics") setTab("browse");
  }, [user, tab]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterCategory) params.set("category", filterCategory);
        if (filterDifficulty) params.set("difficulty", filterDifficulty);
        params.set("status", "active");
        const headers = getAuthHeaders();
        const qResp = await fetch(`/api/question-bank/items?${params}`, { headers });
        const qData = await qResp.json();
        setQuestions(Array.isArray(qData) ? qData : []);
        if (user?.tier === "admin") {
          const aResp = await fetch("/api/question-bank/analytics", { headers });
          const aData = await aResp.json();
          setAnalytics(Array.isArray(aData) ? aData : []);
        } else {
          setAnalytics([]);
        }
      } catch {
        setQuestions([]);
        setAnalytics([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [filterCategory, filterDifficulty, user]);

  const toggleAnswer = (id: string) => {
    setShowAnswer((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredQuestions = questions.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return q.question.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s) || q.category.toLowerCase().includes(s);
  });

  const categories = [...new Set(questions.map((q) => q.category))].sort();
  const difficultyOrder = ["easy", "moderate", "hard", "very_hard"];

  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: questions.filter((q) => q.category === cat).length,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-preview-title">{t("pages.qbankPreview.testBank")}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("pages.qbankPreview.browseAndExploreAvailableQuestions")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant={tab === "browse" ? "default" : "outline"} size="sm" onClick={() => setTab("browse")} data-testid="button-tab-browse">
              <BookOpen className="h-4 w-4 mr-1" />Browse
            </Button>
            {user?.tier === "admin" ? (
              <Button variant={tab === "analytics" ? "default" : "outline"} size="sm" onClick={() => setTab("analytics")} data-testid="button-tab-analytics">
                <BarChart3 className="h-4 w-4 mr-1" />Analytics
              </Button>
            ) : null}
          </div>
        </div>

        {tab === "browse" && (
          <>
            <Card className="mb-4">
              <CardContent className="p-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("pages.qbankPreview.searchQuestionsTopics")} className="pl-9" data-testid="input-preview-search" />
                  </div>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-preview-category">
                    <option value="">{t("pages.qbankPreview.allCategories")}</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="border rounded px-2 py-2 text-sm bg-white dark:bg-gray-800" data-testid="select-preview-difficulty">
                    <option value="">{t("pages.qbankPreview.allDifficulties")}</option>
                    <option value="easy">{t("pages.qbankPreview.easy")}</option>
                    <option value="moderate">{t("pages.qbankPreview.moderate")}</option>
                    <option value="hard">{t("pages.qbankPreview.hard")}</option>
                    <option value="very_hard">{t("pages.qbankPreview.veryHard")}</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-500 mb-3" data-testid="text-question-count">{filteredQuestions.length} questions found</div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">{t("pages.qbankPreview.loading")}</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-12" data-testid="text-no-questions">
                <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t("pages.qbankPreview.noQuestionsFoundMatchingYour")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((q) => (
                  <Card key={q.id} data-testid={`card-preview-question-${q.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white" data-testid={`text-preview-q-${q.id}`}>{q.question}</p>
                        </div>
                        {expandedId === q.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="outline" className="text-xs">{q.examType}</Badge>
                        {q.contentTier ? (
                          <Badge variant="outline" className="text-xs uppercase">{q.contentTier}</Badge>
                        ) : null}
                        <Badge variant="outline" className="text-xs">{q.category}</Badge>
                        <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                        <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                      </div>
                      {expandedId === q.id && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {[
                              { key: "A", text: q.optionA },
                              { key: "B", text: q.optionB },
                              { key: "C", text: q.optionC },
                              { key: "D", text: q.optionD },
                            ].map((opt) => (
                              <div
                                key={opt.key}
                                className={`p-2 rounded border ${
                                  showAnswer.has(q.id) && opt.key === q.correctAnswer
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                <span className="font-semibold">{opt.key}.</span> {opt.text}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => toggleAnswer(q.id)} data-testid={`button-toggle-answer-${q.id}`}>
                              {showAnswer.has(q.id) ? <><EyeOff className="h-3 w-3 mr-1" />{t("pages.qbankPreview.hideAnswer")}</> : <><Eye className="h-3 w-3 mr-1" />{t("pages.qbankPreview.showAnswer")}</>}
                            </Button>
                          </div>
                          {showAnswer.has(q.id) && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm" data-testid={`text-rationale-${q.id}`}>
                              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Answer: {q.correctAnswer}</p>
                              <p className="text-gray-700 dark:text-gray-300">{q.rationale}</p>
                              <p className="text-xs text-gray-400 mt-1">Client Needs: {q.clientNeeds}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-blue-600" data-testid="text-total-questions">{questions.length}</div><div className="text-xs text-gray-500">{t("pages.qbankPreview.totalQuestions")}</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-green-600" data-testid="text-total-categories">{categories.length}</div><div className="text-xs text-gray-500">{t("pages.qbankPreview.categories")}</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-purple-600" data-testid="text-total-attempts">{analytics.reduce((s, a) => s + a.totalAttempts, 0)}</div><div className="text-xs text-gray-500">{t("pages.qbankPreview.totalAttempts")}</div></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><div className="text-2xl font-bold text-orange-600" data-testid="text-avg-score">{analytics.length > 0 ? Math.round(analytics.reduce((s, a) => s + a.correctRate, 0) / analytics.length) : 0}%</div><div className="text-xs text-gray-500">{t("pages.qbankPreview.avgScore")}</div></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5" />{t("pages.qbankPreview.categoryDistribution")}</CardTitle></CardHeader>
              <CardContent>
                {categoryCounts.length === 0 ? (
                  <p className="text-gray-400 text-sm">{t("pages.qbankPreview.noDataAvailable")}</p>
                ) : (
                  <div className="space-y-2">
                    {categoryCounts.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <span className="text-sm w-48 truncate">{cat.name}</span>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-4">
                          <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{ width: `${Math.max(2, (cat.count / questions.length) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {analytics.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" />{t("pages.qbankPreview.performanceByCategoryDifficulty")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">{t("pages.qbankPreview.category")}</th>
                          <th className="text-left py-2 px-3">{t("pages.qbankPreview.difficulty")}</th>
                          <th className="text-right py-2 px-3">{t("pages.qbankPreview.attempts")}</th>
                          <th className="text-right py-2 px-3">{t("pages.qbankPreview.correctRate")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.map((a, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-800" data-testid={`row-analytics-${i}`}>
                            <td className="py-2 px-3">{a.category}</td>
                            <td className="py-2 px-3"><Badge variant="outline" className="text-xs">{a.difficulty}</Badge></td>
                            <td className="py-2 px-3 text-right">{a.totalAttempts}</td>
                            <td className="py-2 px-3 text-right">
                              <span className={a.correctRate >= 70 ? "text-green-600" : a.correctRate >= 50 ? "text-yellow-600" : "text-red-600"}>
                                {a.correctRate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
