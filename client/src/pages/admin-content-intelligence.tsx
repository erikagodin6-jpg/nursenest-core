import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, Target, Globe, Search, TrendingUp, FileText,
  AlertTriangle, CheckCircle2, RefreshCw, Plus, ArrowRight,
  Layers, Zap, DollarSign
} from "lucide-react";

type BlueprintCoverage = {
  examCode: string;
  examName: string;
  totalQuestions: number;
  domains: { domain: string; targetWeight: number; questionCount: number; currentPercent: number; status: string; recommendedToAdd: number }[];
};

type DifficultyData = {
  calibration: { level: number; actualPercent: number; expectedLow: number; expectedHigh: number; deviation: boolean; suggestedAdjustment: string }[];
  targetDistribution: Record<string, number>;
};

type RoiItem = {
  id: string;
  proposed_title: string;
  language_code: string;
  content_type: string;
  roi_score: number;
  priority_tier: string;
  pipeline_status: string;
  seo_demand_score: number;
  blueprint_strategic_score: number;
  conversion_potential_score: number;
  authority_multiplier_score: number;
  monetization_fit_score: number;
  similarity_flag: boolean;
};

export default function AdminContentIntelligence() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"blueprint" | "difficulty" | "langMatrix" | "seoGaps" | "roi" | "reports">("blueprint");
  const [blueprintData, setBlueprintData] = useState<BlueprintCoverage[]>([]);
  const [difficultyData, setDifficultyData] = useState<DifficultyData | null>(null);
  const [langMatrix, setLangMatrix] = useState<any>(null);
  const [keywordGaps, setKeywordGaps] = useState<any[]>([]);
  const [roiPipeline, setRoiPipeline] = useState<RoiItem[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [roiForm, setRoiForm] = useState({ proposedTitle: "", languageCode: "en", examCode: "", contentType: "cluster", primaryKeyword: "", blueprintCategory: "" });
  const [roiResult, setRoiResult] = useState<any>(null);

  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    loadTab(activeTab);
  }, [isAdmin, activeTab]);

  const loadTab = async (tab: string) => {
    setLoading(true);
    try {
      if (tab === "blueprint") {
        const res = await fetch("/api/admin/blueprint-coverage");
        if (res.ok) setBlueprintData(await res.json());
      } else if (tab === "difficulty") {
        const res = await fetch("/api/admin/difficulty-distribution");
        if (res.ok) setDifficultyData(await res.json());
      } else if (tab === "langMatrix") {
        const res = await fetch("/api/admin/language-coverage-matrix");
        if (res.ok) setLangMatrix(await res.json());
      } else if (tab === "seoGaps") {
        const res = await fetch("/api/admin/keyword-gaps");
        if (res.ok) setKeywordGaps(await res.json());
      } else if (tab === "roi") {
        const res = await fetch("/api/admin/content-roi/pipeline");
        if (res.ok) setRoiPipeline(await res.json());
      } else if (tab === "reports") {
        const res = await fetch("/api/admin/intelligence-reports");
        if (res.ok) setReports(await res.json());
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const evaluateRoi = async () => {
    try {
      const res = await fetch("/api/admin/content-roi/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roiForm),
      });
      if (res.ok) {
        const data = await res.json();
        setRoiResult(data);
        loadTab("roi");
      }
    } catch (e) { console.error(e); }
  };

  const generateReport = async () => {
    try {
      await fetch("/api/admin/generate-intelligence-report", { method: "POST" });
      loadTab("reports");
    } catch (e) { console.error(e); }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">{t("pages.adminContentIntelligence.accessDenied")}</h1>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "blueprint", label: "Blueprint Coverage", icon: Target },
    { key: "difficulty", label: "Difficulty Calibration", icon: BarChart3 },
    { key: "langMatrix", label: "Language Matrix", icon: Globe },
    { key: "seoGaps", label: "SEO Gaps", icon: Search },
    { key: "roi", label: "Content ROI", icon: TrendingUp },
    { key: "reports", label: "Reports", icon: FileText },
  ] as const;

  const priorityColor = (tier: string) => {
    if (tier === "build_immediately") return "bg-green-100 text-green-800";
    if (tier === "high_priority") return "bg-blue-100 text-blue-800";
    if (tier === "if_time_permits") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-600";
  };

  const pipelineStatuses = ["idea", "roi_evaluated", "approved", "in_production", "qc", "scheduled", "published"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO title={t("pages.adminContentIntelligence.contentIntelligenceAdmin")} description={t("pages.adminContentIntelligence.contentGapAnalysisAndIntelligence")} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminContentIntelligence.contentIntelligenceDashboard")}</h1>
            <p className="text-gray-600 mt-1">{t("pages.adminContentIntelligence.blueprintCoverageDifficultyCalibrationSeo")}</p>
          </div>
          <Button data-testid="btn-generate-report" onClick={generateReport} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" /> Generate Weekly Report
          </Button>
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>}

        {!loading && activeTab === "blueprint" && (
          <div className="space-y-6">
            {blueprintData.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-gray-500">{t("pages.adminContentIntelligence.noBlueprintDataAvailableSeed")}</CardContent></Card>
            ) : (
              blueprintData.map(bp => (
                <Card key={bp.examCode}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> {bp.examName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {bp.domains.map((d, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${d.status === "underrepresented" ? "border-red-200 bg-red-50" : d.status === "overrepresented" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`} data-testid={`domain-${bp.examCode}-${i}`}>
                          <div className="font-medium text-sm">{d.domain}</div>
                          <div className="text-xs text-gray-600 mt-1">Target: {d.targetWeight}% | Current: {d.currentPercent}%</div>
                          <div className="text-xs mt-1">Questions: {d.questionCount} {d.recommendedToAdd > 0 && <span className="text-red-600">(+{d.recommendedToAdd} needed)</span>}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {!loading && activeTab === "difficulty" && difficultyData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> {t("pages.adminContentIntelligence.difficultyLevelCalibration")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {difficultyData.calibration.map(c => (
                  <div key={c.level} className="flex items-center gap-4" data-testid={`difficulty-level-${c.level}`}>
                    <div className="w-20 font-medium">Level {c.level}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-4 relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="bg-blue-200 h-full rounded-full" style={{ marginLeft: `${c.expectedLow}%`, width: `${c.expectedHigh - c.expectedLow}%` }} />
                          </div>
                          <div className={`absolute h-4 w-1 rounded ${c.deviation ? "bg-red-500" : "bg-green-500"}`} style={{ left: `${c.actualPercent}%` }} />
                        </div>
                        <span className="text-sm w-16">{c.actualPercent}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Expected: {c.expectedLow}–{c.expectedHigh}% | Target: {difficultyData.targetDistribution[c.level]}% of bank</div>
                    </div>
                    {c.deviation && <Badge variant="destructive" className="text-xs">{c.suggestedAdjustment.replace(/_/g, " ")}</Badge>}
                    {!c.deviation && <Badge className="text-xs bg-green-100 text-green-700">{t("pages.adminContentIntelligence.calibrated")}</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && activeTab === "langMatrix" && langMatrix && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> {t("pages.adminContentIntelligence.seoPagesByLanguage")}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">{t("pages.adminContentIntelligence.language")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.pageType")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.count")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.avgLength")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {langMatrix.seoPages?.map((row: any, i: number) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{row.language_code}</td>
                          <td className="text-center py-2 px-3">{row.page_type || "—"}</td>
                          <td className="text-center py-2 px-3">{row.count}</td>
                          <td className="text-center py-2 px-3">{Math.round(row.avg_chars / 5)} words</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{t("pages.adminContentIntelligence.translationCoverage")}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">{t("pages.adminContentIntelligence.language2")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.contentType")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.translatedItems")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {langMatrix.translations?.map((row: any, i: number) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{row.language_code}</td>
                          <td className="text-center py-2 px-3">{row.content_type}</td>
                          <td className="text-center py-2 px-3">{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && activeTab === "seoGaps" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> {t("pages.adminContentIntelligence.seoKeywordGaps")}</CardTitle></CardHeader>
            <CardContent>
              {keywordGaps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">{t("pages.adminContentIntelligence.noKeywordGapsFoundAdd")}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">{t("pages.adminContentIntelligence.keyword")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.language3")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.intent")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.volume")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.targetSlug")}</th>
                        <th className="text-center py-2 px-3">{t("pages.adminContentIntelligence.hasPage")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordGaps.map((g: any) => (
                        <tr key={g.id} className="border-b hover:bg-gray-50" data-testid={`gap-${g.id}`}>
                          <td className="py-2 px-3 font-medium">{g.keyword}</td>
                          <td className="text-center py-2 px-3">{g.language_code}</td>
                          <td className="text-center py-2 px-3"><Badge variant="outline" className="text-xs">{g.intent}</Badge></td>
                          <td className="text-center py-2 px-3">{g.search_volume || "—"}</td>
                          <td className="text-center py-2 px-3 text-xs">{g.page_target_slug || <span className="text-red-500">{t("pages.adminContentIntelligence.unmapped")}</span>}</td>
                          <td className="text-center py-2 px-3">{g.has_page ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!loading && activeTab === "roi" && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> {t("pages.adminContentIntelligence.evaluateNewContentIdea")}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <Input data-testid="input-roi-title" placeholder={t("pages.adminContentIntelligence.proposedTitle")} value={roiForm.proposedTitle} onChange={e => setRoiForm(p => ({ ...p, proposedTitle: e.target.value }))} />
                  <select data-testid="select-roi-type" className="border rounded-md px-3 py-2 text-sm" value={roiForm.contentType} onChange={e => setRoiForm(p => ({ ...p, contentType: e.target.value }))}>
                    <option value="pillar">{t("pages.adminContentIntelligence.pillarPage")}</option>
                    <option value="cluster">{t("pages.adminContentIntelligence.clusterPage")}</option>
                    <option value="blog">{t("pages.adminContentIntelligence.blogPost")}</option>
                    <option value="comparison">{t("pages.adminContentIntelligence.comparisonPage")}</option>
                    <option value="remediation_pack">{t("pages.adminContentIntelligence.remediationPack")}</option>
                  </select>
                  <Input data-testid="input-roi-keyword" placeholder={t("pages.adminContentIntelligence.primaryKeyword")} value={roiForm.primaryKeyword} onChange={e => setRoiForm(p => ({ ...p, primaryKeyword: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <select className="border rounded-md px-3 py-2 text-sm" value={roiForm.languageCode} onChange={e => setRoiForm(p => ({ ...p, languageCode: e.target.value }))}>
                    <option value="en">{t("pages.adminContentIntelligence.english")}</option>
                    <option value="fr">{t("pages.adminContentIntelligence.french")}</option>
                    <option value="es">{t("pages.adminContentIntelligence.spanish")}</option>
                    <option value="fil">{t("pages.adminContentIntelligence.filipino")}</option>
                    <option value="hi">{t("pages.adminContentIntelligence.hindi")}</option>
                    <option value="zh">{t("pages.adminContentIntelligence.chinese")}</option>
                    <option value="ar">{t("pages.adminContentIntelligence.arabic")}</option>
                  </select>
                  <Input placeholder={t("pages.adminContentIntelligence.examCodeOptional")} value={roiForm.examCode} onChange={e => setRoiForm(p => ({ ...p, examCode: e.target.value }))} />
                  <Input placeholder={t("pages.adminContentIntelligence.blueprintCategoryOptional")} value={roiForm.blueprintCategory} onChange={e => setRoiForm(p => ({ ...p, blueprintCategory: e.target.value }))} />
                </div>
                <Button data-testid="btn-evaluate-roi" onClick={evaluateRoi}><Zap className="w-4 h-4 mr-1" /> {t("pages.adminContentIntelligence.evaluateRoi")}</Button>
                {roiResult && (
                  <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold">{Math.round(roiResult.roi_score)}</span>
                      <Badge className={priorityColor(roiResult.priority_tier)}>{roiResult.priority_tier?.replace(/_/g, " ")}</Badge>
                      {roiResult.similarity_flag && <Badge variant="destructive">{t("pages.adminContentIntelligence.overlapDetected")}</Badge>}
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div>SEO: {roiResult.seo_demand_score}</div>
                      <div>Blueprint: {roiResult.blueprint_strategic_score}</div>
                      <div>Conversion: {roiResult.conversion_potential_score}</div>
                      <div>Authority: {roiResult.authority_multiplier_score}</div>
                      <div>Monetization: {roiResult.monetization_fit_score}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> {t("pages.adminContentIntelligence.contentPipeline")}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {pipelineStatuses.map(s => (
                    <Badge key={s} variant="outline" className="text-xs whitespace-nowrap">{s.replace(/_/g, " ")} ({roiPipeline.filter(r => r.pipeline_status === s).length})</Badge>
                  ))}
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {roiPipeline.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50" data-testid={`roi-item-${item.id}`}>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.proposed_title}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{item.content_type}</Badge>
                          <Badge variant="outline" className="text-xs">{item.language_code}</Badge>
                          <Badge className={`text-xs ${priorityColor(item.priority_tier)}`}>{Math.round(item.roi_score)} ROI</Badge>
                        </div>
                      </div>
                      <select
                        className="border rounded-md px-2 py-1 text-xs"
                        value={item.pipeline_status}
                        onChange={async e => {
                          await fetch(`/api/admin/content-roi/${item.id}/status`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pipelineStatus: e.target.value }),
                          });
                          loadTab("roi");
                        }}
                      >
                        {pipelineStatuses.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!loading && activeTab === "reports" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> {t("pages.adminContentIntelligence.weeklyIntelligenceReports")}</CardTitle></CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">{t("pages.adminContentIntelligence.noReportsYetClickGenerate")}</div>
              ) : (
                <div className="space-y-4">
                  {reports.map((r: any) => (
                    <div key={r.id} className="p-4 border rounded-lg" data-testid={`report-${r.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{r.report_type} report</span>
                        <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{r.summary}</p>
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer">{t("pages.adminContentIntelligence.viewRawData")}</summary>
                        <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto max-h-48">{JSON.stringify(r.report_data, null, 2)}</pre>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
