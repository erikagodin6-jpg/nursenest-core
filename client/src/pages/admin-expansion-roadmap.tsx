import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  GLOBAL_CONTENT_EXPANSION_ROADMAP,
  getPhaseCompletionPercent,
  getRoadmapOverallProgress,
  detectThinBanks,
  generateNextPriorityRecommendations,
  THIN_BANK_FLOOR,
  FLAGSHIP_THRESHOLD,
  type ThinBankAlert,
  type NextPriorityRecommendation,
  type BlueprintGap,
} from "@/config/expansion-roadmap";
import {
  getManifest,
  getPublicTotalQuestions,
  getTotalAlliedHealthQuestions,
  getTotalNursingCertQuestions,
} from "@/data/career-questions/question-counts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  BookOpen,
  FileText,
  RefreshCw,
  BarChart3,
  Sparkles,
  Lock,
} from "lucide-react";

interface ContentInventory {
  examQuestions: {
    total: number;
    published: number;
    aiGenerated: number;
    byTier: Record<string, number>;
    byExam: Record<string, number>;
    byCountry: Record<string, number>;
    byLanguage: Record<string, number>;
    byTopic: { topic: string; count: number }[];
    byFormat: Record<string, number>;
    byStatus: Record<string, number>;
  };
  alliedQuestions: {
    total: number;
    byCareer: Record<string, number>;
    byTopic: { topic: string; count: number }[];
  };
  inventory: {
    mockExams: number;
    scenarios: number;
    lessons: number;
    flashcardDecks: number;
    flashcardCards: number;
    explanations: number;
  };
  blueprintGaps: {
    tier: string;
    categoryId: string;
    categoryLabel: string;
    weight: number;
    questionCount: number;
  }[];
  queryErrors?: string[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-100", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "text-blue-700", bg: "bg-blue-100", icon: Clock },
  queued: { label: "Queued", color: "text-gray-600", bg: "bg-gray-100", icon: Clock },
  blocked: { label: "Blocked", color: "text-red-700", bg: "bg-red-100", icon: Lock },
};

export default function AdminExpansionRoadmap() {
  const { t } = useI18n();
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1, 2, 3]));
  const [manifestSubTab, setManifestSubTab] = useState<"overview" | "tiers" | "exams" | "countries" | "topics" | "formats">("overview");

  const { data: inventory, isLoading, refetch } = useQuery<ContentInventory>({
    queryKey: ["admin-content-inventory"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/content-inventory");
      if (!res.ok) throw new Error("Failed to load content inventory");
      return res.json();
    },
    staleTime: 60000,
  });

  const manifest = getManifest();
  const roadmap = GLOBAL_CONTENT_EXPANSION_ROADMAP;
  const progress = getRoadmapOverallProgress(roadmap);

  const staticInventory: Record<string, number> = {};
  if (manifest) {
    for (const [key, val] of Object.entries(manifest.static.nursing)) {
      staticInventory[key] = val.total;
    }
    for (const [key, val] of Object.entries(manifest.static.alliedHealth)) {
      staticInventory[key] = val.total;
    }
    for (const [key, val] of Object.entries(manifest.static.nursingCert)) {
      staticInventory[key] = val.total;
    }
  }

  const dbInventory: Record<string, number> = {};
  if (inventory) {
    for (const [key, count] of Object.entries(inventory.examQuestions.byTier)) {
      dbInventory[key] = count;
    }
    for (const [key, count] of Object.entries(inventory.alliedQuestions.byCareer)) {
      dbInventory[key] = count;
    }
    for (const [key, count] of Object.entries(inventory.examQuestions.byExam)) {
      dbInventory[key] = Math.max(dbInventory[key] || 0, count);
    }
    for (const [key, count] of Object.entries(inventory.examQuestions.byCountry)) {
      dbInventory[key] = Math.max(dbInventory[key] || 0, count);
    }
    for (const [key, count] of Object.entries(inventory.examQuestions.byLanguage)) {
      dbInventory[key] = Math.max(dbInventory[key] || 0, count);
    }
  }

  const allInventory: Record<string, number> = {};
  const allKeys = new Set([...Object.keys(staticInventory), ...Object.keys(dbInventory)]);
  for (const key of allKeys) {
    allInventory[key] = Math.max(staticInventory[key] || 0, dbInventory[key] || 0);
  }

  const topicCounts = inventory ? [
    ...inventory.examQuestions.byTopic,
    ...inventory.alliedQuestions.byTopic,
  ] : undefined;
  const thinBankAlerts = detectThinBanks(allInventory, roadmap, topicCounts);
  const recommendations = generateNextPriorityRecommendations(allInventory, roadmap);
  const publicTotal = getPublicTotalQuestions();
  const alliedTotal = getTotalAlliedHealthQuestions();
  const certTotal = getTotalNursingCertQuestions();

  const togglePhase = (id: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6" data-testid="section-expansion-roadmap">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900" data-testid="text-roadmap-heading">{t("pages.adminExpansionRoadmap.globalExpansionRoadmapContentManifests")}</h2>
        <Button size="sm" variant="outline" onClick={() => refetch()} data-testid="button-refresh-inventory">
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {inventory?.queryErrors && inventory.queryErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50" data-testid="card-query-errors">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2 text-red-800 font-medium text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              {inventory.queryErrors.length} inventory query(s) failed — some counts may show as zero
            </div>
            <ul className="text-xs text-red-700 space-y-0.5 ml-6 list-disc">
              {inventory.queryErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3" data-testid="stats-overview">
        <StatCard label={t("pages.adminExpansionRoadmap.publicQuestions")} value={publicTotal.toLocaleString()} icon={<Database className="w-4 h-4 text-blue-600" />} testId="stat-public-total" />
        <StatCard label={t("pages.adminExpansionRoadmap.dbExamQs")} value={(inventory?.examQuestions.total || 0).toLocaleString()} icon={<FileText className="w-4 h-4 text-purple-600" />} testId="stat-db-exam" />
        <StatCard label={t("pages.adminExpansionRoadmap.alliedQs")} value={alliedTotal.toLocaleString()} icon={<Globe className="w-4 h-4 text-teal-600" />} testId="stat-allied-total" />
        <StatCard label={t("pages.adminExpansionRoadmap.certQs")} value={certTotal.toLocaleString()} icon={<Target className="w-4 h-4 text-amber-600" />} testId="stat-cert-total" />
        <StatCard label={t("pages.adminExpansionRoadmap.published")} value={(inventory?.examQuestions.published || 0).toLocaleString()} icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} testId="stat-published" />
        <StatCard label={t("pages.adminExpansionRoadmap.aiPool")} value={(inventory?.examQuestions.aiGenerated || 0).toLocaleString()} sub="(unvalidated)" icon={<Sparkles className="w-4 h-4 text-orange-500" />} testId="stat-ai-pool" />
        <StatCard label={t("pages.adminExpansionRoadmap.mockExams")} value={(inventory?.inventory.mockExams || 0).toLocaleString()} icon={<BookOpen className="w-4 h-4 text-indigo-600" />} testId="stat-mock-exams" />
        <StatCard label={t("pages.adminExpansionRoadmap.explanations")} value={(inventory?.inventory.explanations || 0).toLocaleString()} icon={<Zap className="w-4 h-4 text-yellow-600" />} testId="stat-explanations" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={t("pages.adminExpansionRoadmap.scenarios")} value={(inventory?.inventory.scenarios || 0).toLocaleString()} icon={<BarChart3 className="w-4 h-4 text-pink-600" />} testId="stat-scenarios" />
        <StatCard label={t("pages.adminExpansionRoadmap.lessons")} value={(inventory?.inventory.lessons || 0).toLocaleString()} icon={<BookOpen className="w-4 h-4 text-green-600" />} testId="stat-lessons" />
        <StatCard label={t("pages.adminExpansionRoadmap.flashcardDecks")} value={(inventory?.inventory.flashcardDecks || 0).toLocaleString()} icon={<Layers className="w-4 h-4 text-cyan-600" />} testId="stat-fc-decks" />
        <StatCard label={t("pages.adminExpansionRoadmap.flashcardCards")} value={(inventory?.inventory.flashcardCards || 0).toLocaleString()} icon={<FileText className="w-4 h-4 text-cyan-700" />} testId="stat-fc-cards" />
      </div>

      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50" data-testid="card-roadmap-progress">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Roadmap Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${progress.overallPercent}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-bold text-blue-700" data-testid="text-overall-progress">{progress.overallPercent}%</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/60 rounded-lg px-3 py-2 text-center">
              <div className="font-bold text-emerald-700" data-testid="text-completed-count">{progress.completedComponents}</div>
              <div className="text-gray-500 text-xs">{t("pages.adminExpansionRoadmap.completed")}</div>
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-2 text-center">
              <div className="font-bold text-blue-700" data-testid="text-in-progress-count">{progress.inProgressComponents}</div>
              <div className="text-gray-500 text-xs">{t("pages.adminExpansionRoadmap.inProgress")}</div>
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-2 text-center">
              <div className="font-bold text-gray-600" data-testid="text-queued-count">{progress.queuedComponents}</div>
              <div className="text-gray-500 text-xs">{t("pages.adminExpansionRoadmap.queued")}</div>
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-2 text-center">
              <div className="font-bold text-gray-900" data-testid="text-total-components">{progress.totalComponents}</div>
              <div className="text-gray-500 text-xs">{t("pages.adminExpansionRoadmap.totalComponents")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-phase-tracker">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Phase-by-Phase Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roadmap.map((phase) => {
            const pct = getPhaseCompletionPercent(phase);
            const sc = statusConfig[phase.status] || statusConfig.queued;
            const expanded = expandedPhases.has(phase.id);

            return (
              <div key={phase.id} className="border border-gray-100 rounded-lg overflow-hidden" data-testid={`phase-${phase.id}`}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => togglePhase(phase.id)}
                  data-testid={`button-toggle-phase-${phase.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {phase.id}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">{phase.title}</div>
                      <div className="text-xs text-gray-500">{phase.description.slice(0, 100)}...</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${phase.status === "completed" ? "bg-emerald-500" : "bg-blue-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-10 text-right">{pct}%</span>
                    <Badge className={`${sc.bg} ${sc.color} text-xs`}>{sc.label}</Badge>
                    {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      {phase.components.map((comp, idx) => {
                        const compSc = statusConfig[comp.status] || statusConfig.queued;
                        const currentCount = allInventory[comp.inventoryKey] || comp.currentQuestions || 0;
                        const compPct = comp.targetQuestions > 0 ? Math.min(100, Math.round((currentCount / comp.targetQuestions) * 100)) : (comp.status === "completed" ? 100 : 0);

                        return (
                          <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2" data-testid={`component-${phase.id}-${idx}`}>
                            <compSc.icon className={`w-4 h-4 ${compSc.color} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{comp.name}</div>
                              {comp.targetQuestions > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${compPct >= 100 ? "bg-emerald-500" : compPct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                      style={{ width: `${compPct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {currentCount.toLocaleString()} / {comp.targetQuestions.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Badge className={`${compSc.bg} ${compSc.color} text-xs flex-shrink-0`}>{compSc.label}</Badge>
                          </div>
                        );
                      })}
                    </div>
                    {phase.startDate && (
                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        <span>Start: {phase.startDate}</span>
                        {phase.targetDate && <span>Target: {phase.targetDate}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {thinBankAlerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50" data-testid="card-thin-bank-alerts">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              Thin-Bank Detection — {thinBankAlerts.length} Alert{thinBankAlerts.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-700 mb-3">
              Banks below {THIN_BANK_FLOOR.toLocaleString()} questions (floor) or {FLAGSHIP_THRESHOLD.toLocaleString()} (flagship target) are flagged. "Approaching weak" alerts appear when counts are near the threshold. Topic alerts flag topics with fewer than 50 questions.
            </p>
            <div className="space-y-2">
              {thinBankAlerts.slice(0, 15).map((alert) => (
                <div key={alert.key} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-amber-200" data-testid={`thin-alert-${alert.key}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${alert.severity === "critical" ? "text-red-500" : alert.severity === "approaching-weak" ? "text-blue-500" : "text-amber-500"}`} />
                    <span className="font-medium text-gray-900">{alert.name}</span>
                    {alert.type === "topic" && <Badge className="bg-gray-100 text-gray-600 text-xs">{t("pages.adminExpansionRoadmap.topic")}</Badge>}
                    {alert.isFlagship && <Badge className="bg-purple-100 text-purple-700 text-xs">{t("pages.adminExpansionRoadmap.flagship")}</Badge>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{alert.currentCount.toLocaleString()} questions</span>
                    <Badge className={alert.severity === "critical" ? "bg-red-100 text-red-700" : alert.severity === "approaching-weak" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}>
                      {alert.severity === "approaching-weak" ? "Approaching weak" : `${alert.deficit.toLocaleString()} below target`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {inventory && (
        <Card data-testid="card-content-manifest">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              Content Manifest Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 mb-4 bg-gray-50 rounded-lg p-1 overflow-x-auto">
              {(["overview", "tiers", "exams", "countries", "topics", "formats"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setManifestSubTab(tab)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                    manifestSubTab === tab ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                  data-testid={`manifest-tab-${tab}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {manifestSubTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <ManifestStat label={t("pages.adminExpansionRoadmap.totalExamQs")} value={inventory.examQuestions.total} testId="manifest-exam-total" />
                  <ManifestStat label={t("pages.adminExpansionRoadmap.published2")} value={inventory.examQuestions.published} testId="manifest-published" />
                  <ManifestStat label={t("pages.adminExpansionRoadmap.aiPoolPending")} value={inventory.examQuestions.aiGenerated} testId="manifest-ai-pool" highlight />
                  <ManifestStat label={t("pages.adminExpansionRoadmap.alliedHealthQs")} value={inventory.alliedQuestions.total} testId="manifest-allied" />
                  <ManifestStat label={t("pages.adminExpansionRoadmap.scenarios2")} value={inventory.inventory.scenarios} testId="manifest-scenarios" />
                  <ManifestStat label={t("pages.adminExpansionRoadmap.lessons2")} value={inventory.inventory.lessons} testId="manifest-lessons" />
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                  <strong>{t("pages.adminExpansionRoadmap.note")}</strong> Public counts show only validated, published, non-duplicate inventory.
                  AI-generated pools ({inventory.examQuestions.aiGenerated.toLocaleString()} questions) are tracked separately until validated.
                </div>
              </div>
            )}

            {manifestSubTab === "tiers" && (
              <div className="space-y-2">
                {Object.entries(inventory.examQuestions.byTier).map(([tier, count]) => (
                  <InventoryBar key={tier} label={tier.toUpperCase()} count={count} max={Math.max(...Object.values(inventory.examQuestions.byTier))} testId={`tier-${tier}`} />
                ))}
                {Object.keys(inventory.alliedQuestions.byCareer).length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-gray-500 mt-4 mb-2">{t("pages.adminExpansionRoadmap.alliedHealthCareers")}</div>
                    {Object.entries(inventory.alliedQuestions.byCareer).map(([career, count]) => (
                      <InventoryBar key={career} label={career} count={count} max={Math.max(...Object.values(inventory.alliedQuestions.byCareer))} testId={`career-${career}`} />
                    ))}
                  </>
                )}
              </div>
            )}

            {manifestSubTab === "exams" && (
              <div className="space-y-2">
                {Object.entries(inventory.examQuestions.byExam).map(([exam, count]) => (
                  <InventoryBar key={exam} label={exam} count={count} max={Math.max(...Object.values(inventory.examQuestions.byExam))} testId={`exam-${exam}`} />
                ))}
              </div>
            )}

            {manifestSubTab === "countries" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminExpansionRoadmap.byCountryregion")}</div>
                  <div className="space-y-2">
                    {Object.entries(inventory.examQuestions.byCountry).map(([country, count]) => (
                      <InventoryBar key={country} label={country} count={count} max={Math.max(...Object.values(inventory.examQuestions.byCountry))} testId={`country-${country}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminExpansionRoadmap.byLanguage")}</div>
                  <div className="space-y-2">
                    {Object.entries(inventory.examQuestions.byLanguage).map(([lang, count]) => (
                      <InventoryBar key={lang} label={lang.toUpperCase()} count={count} max={Math.max(...Object.values(inventory.examQuestions.byLanguage))} testId={`lang-${lang}`} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {manifestSubTab === "topics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminExpansionRoadmap.examQuestionTopicsTop25")}</div>
                  <div className="space-y-1">
                    {inventory.examQuestions.byTopic.slice(0, 25).map((t) => (
                      <div key={t.topic} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1" data-testid={`topic-exam-${t.topic}`}>
                        <span className="truncate text-gray-700 mr-2">{t.topic}</span>
                        <span className="font-medium text-gray-900">{t.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminExpansionRoadmap.alliedQuestionTopicsTop25")}</div>
                  <div className="space-y-1">
                    {inventory.alliedQuestions.byTopic.slice(0, 25).map((t) => (
                      <div key={t.topic} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1" data-testid={`topic-allied-${t.topic}`}>
                        <span className="truncate text-gray-700 mr-2">{t.topic}</span>
                        <span className="font-medium text-gray-900">{t.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {manifestSubTab === "formats" && (
              <div className="space-y-2">
                {Object.entries(inventory.examQuestions.byFormat).map(([format, count]) => (
                  <InventoryBar key={format} label={format} count={count} max={Math.max(...Object.values(inventory.examQuestions.byFormat))} testId={`format-${format}`} />
                ))}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-gray-500 mb-2">{t("pages.adminExpansionRoadmap.byStatus")}</div>
                  {Object.entries(inventory.examQuestions.byStatus).map(([status, count]) => (
                    <InventoryBar key={status} label={status} count={count} max={Math.max(...Object.values(inventory.examQuestions.byStatus))} testId={`status-${status}`} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {inventory && inventory.blueprintGaps.length > 0 && (
        <Card data-testid="card-blueprint-coverage">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Blueprint Coverage Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 mb-4">
              Shows which exam blueprint domains have insufficient question coverage relative to their weight.
            </p>
            <BlueprintCoverageTable gaps={inventory.blueprintGaps} />
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card data-testid="card-next-priority">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Next-Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 mb-4">
              Based on current inventory gaps and roadmap phase, these are the highest-impact content areas to build next.
            </p>
            <div className="space-y-2">
              {recommendations.slice(0, 12).map((rec) => (
                <div key={rec.rank} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3" data-testid={`recommendation-${rec.rank}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    rec.impact === "critical" ? "bg-red-100 text-red-700" : rec.impact === "high" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {rec.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{rec.target}</div>
                    <div className="text-xs text-gray-500">{rec.action} — {rec.reason}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={
                      rec.impact === "critical" ? "bg-red-100 text-red-700" : rec.impact === "high" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                    }>
                      {rec.impact}
                    </Badge>
                    {rec.estimatedQuestions > 0 && (
                      <span className="text-xs text-gray-500">~{rec.estimatedQuestions.toLocaleString()} Qs</span>
                    )}
                    <Badge variant="outline" className="text-xs">Phase {rec.phase}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="text-center py-8 text-gray-500" data-testid="text-loading-inventory">
          Loading content inventory from database...
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, sub, testId }: { label: string; value: string; icon: React.ReactNode; sub?: string; testId: string }) {
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <div className="flex items-center justify-center mb-1">{icon}</div>
        <div className="text-lg font-bold text-gray-900" data-testid={testId}>{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
        {sub && <div className="text-xs text-orange-500">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function ManifestStat({ label, value, testId, highlight }: { label: string; value: number; testId: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 text-center ${highlight ? "bg-orange-50 border border-orange-200" : "bg-gray-50"}`}>
      <div className={`text-xl font-bold ${highlight ? "text-orange-700" : "text-gray-900"}`} data-testid={testId}>{value.toLocaleString()}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function InventoryBar({ label, count, max, testId }: { label: string; count: number; max: number; testId: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3" data-testid={testId}>
      <span className="text-xs text-gray-700 w-32 truncate font-medium">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-900 w-16 text-right">{count.toLocaleString()}</span>
    </div>
  );
}

function BlueprintCoverageTable({ gaps }: { gaps: ContentInventory["blueprintGaps"] }) {
  const grouped: Record<string, typeof gaps> = {};
  for (const g of gaps) {
    if (!grouped[g.tier]) grouped[g.tier] = [];
    grouped[g.tier].push(g);
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([tier, items]) => {
        const totalWeight = items.reduce((s, i) => s + i.weight, 0);
        const totalQuestions = items.reduce((s, i) => s + i.questionCount, 0);

        return (
          <div key={tier} data-testid={`blueprint-tier-${tier}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">{tier.toUpperCase()} Blueprint</span>
              <span className="text-xs text-gray-500">{totalQuestions.toLocaleString()} questions mapped</span>
            </div>
            <div className="space-y-1">
              {items.map((item) => {
                const weightPct = totalWeight > 0 ? Math.round((item.weight / totalWeight) * 100) : 0;
                const expectedMin = Math.round(weightPct * 25);
                const isLow = item.questionCount < expectedMin;

                return (
                  <div key={item.categoryId} className={`flex items-center gap-3 text-xs px-3 py-1.5 rounded ${isLow ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}>
                    <span className="text-gray-700 w-48 truncate">{item.categoryLabel}</span>
                    <span className="text-gray-500 w-16 text-right">{weightPct}% weight</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isLow ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (item.questionCount / Math.max(expectedMin, 1)) * 100)}%` }} />
                    </div>
                    <span className={`font-medium w-12 text-right ${isLow ? "text-amber-700" : "text-gray-900"}`}>{item.questionCount}</span>
                    {isLow && <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
