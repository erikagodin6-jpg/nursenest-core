import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  BarChart3, Activity, Target, StopCircle, AlertTriangle,
  RefreshCw, Settings, TrendingUp, ShieldCheck, ShieldAlert,
  CheckCircle2, XCircle, Database, Wrench, Loader2
} from "lucide-react";

type PoolHealthTier = {
  tier: string;
  totalMapped?: number;
  unpublishedCount?: number;
  rawCount: number;
  filteredCount: number;
  validCount: number;
  invalidReasons: Record<string, number>;
  thresholdRequired: number;
  canStartCat: boolean;
  bodySystemCounts: Record<string, number>;
  stageCounts?: {
    published: number;
    adaptiveEligible: number;
    hasDifficulty: number;
    hasCorrectAnswer: number;
    validOptions: number;
    validStem: number;
  };
};

type CatAnalytics = {
  totalSessions: number;
  abilityDistribution: number[];
  earlyStopRate: string | number;
  avgQuestionCount: number;
  recentSessions: any[];
  adjustmentLog: any[];
  poolHealth: Record<string, PoolHealthTier> | null;
};

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

export default function AdminCatDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [data, setData] = useState<CatAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [normalizing, setNormalizing] = useState(false);
  const [normalizeResult, setNormalizeResult] = useState<any>(null);

  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cat-analytics", { headers: getAuthHeaders() });
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const runNormalization = async (dryRun: boolean) => {
    setNormalizing(true);
    setNormalizeResult(null);
    try {
      const res = await fetch("/api/admin/cat-pool-normalize", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ dryRun }),
      });
      if (res.ok) {
        const result = await res.json();
        setNormalizeResult(result);
        if (!dryRun) loadData();
      }
    } catch (e) { console.error(e); }
    setNormalizing(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold">{t("pages.adminCatDashboard.accessDenied")}</h1>
        </div>
      </div>
    );
  }

  const abilityLabels = ["Very Low", "Low", "Below Avg", "Average", "Above Avg", "High", "Very High"];
  const maxAbility = data ? Math.max(...data.abilityDistribution, 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO title={t("pages.adminCatDashboard.adaptiveCatDashboardAdmin")} description={t("pages.adminCatDashboard.catEngineAnalyticsAndCalibration")} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminCatDashboard.adaptiveCatDashboard")}</h1>
            <p className="text-gray-600 mt-1">{t("pages.adminCatDashboard.abilityEstimationDifficultyCalibrationAnd")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("pages.adminCatDashboard.thisIsAPredictiveCoaching")}</p>
          </div>
          <Button data-testid="btn-refresh" onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        {loading && <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>}

        {!loading && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold" data-testid="text-total-sessions">{data.totalSessions}</div>
                      <div className="text-sm text-gray-600">{t("pages.adminCatDashboard.totalCatSessions")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold" data-testid="text-avg-questions">{data.avgQuestionCount}</div>
                      <div className="text-sm text-gray-600">{t("pages.adminCatDashboard.avgQuestionssession")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <StopCircle className="w-8 h-8 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold" data-testid="text-early-stop">{data.earlyStopRate}%</div>
                      <div className="text-sm text-gray-600">{t("pages.adminCatDashboard.earlyStopRate")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-8 h-8 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold" data-testid="text-adjustments">{data.adjustmentLog.length}</div>
                      <div className="text-sm text-gray-600">{t("pages.adminCatDashboard.calibrationAdjustments")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {data.poolHealth && (
              <Card data-testid="card-pool-health">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> CAT Pool Health by Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(data.poolHealth).map(([tier, health]) => (
                      <div key={tier} className={`border rounded-lg p-4 ${health.canStartCat ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`} data-testid={`pool-health-${tier}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg uppercase" data-testid={`text-pool-tier-${tier}`}>{tier}</h3>
                          {health.canStartCat ? (
                            <Badge className="bg-green-100 text-green-700" data-testid={`badge-pool-status-${tier}`}>
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700" data-testid={`badge-pool-status-${tier}`}>
                              <XCircle className="w-3 h-3 mr-1" /> Below Threshold
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          {health.totalMapped !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Mapped</span>
                              <span className="font-medium">{health.totalMapped}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Published</span>
                            <span className="font-medium" data-testid={`text-pool-raw-${tier}`}>{health.rawCount}</span>
                          </div>
                          {health.unpublishedCount !== undefined && health.unpublishedCount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Unpublished</span>
                              <span className="font-medium text-gray-400">{health.unpublishedCount}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid for CAT</span>
                            <span className="font-bold text-green-700" data-testid={`text-pool-valid-${tier}`}>{health.validCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Min Threshold</span>
                            <span className="font-medium" data-testid={`text-pool-threshold-${tier}`}>{health.thresholdRequired}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Invalid</span>
                            <span className="font-medium text-red-600" data-testid={`text-pool-invalid-${tier}`}>{health.rawCount - health.validCount}</span>
                          </div>
                        </div>

                        {health.stageCounts && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Validation Pipeline</p>
                            <div className="space-y-1">
                              {[
                                ["Published", health.stageCounts.published],
                                ["Adaptive Eligible", health.stageCounts.adaptiveEligible],
                                ["Has Difficulty", health.stageCounts.hasDifficulty],
                                ["Has Correct Answer", health.stageCounts.hasCorrectAnswer],
                                ["Valid Options (≥4)", health.stageCounts.validOptions],
                                ["Valid Stem (≥10 chars)", health.stageCounts.validStem],
                              ].map(([label, count]) => (
                                <div key={label as string} className="flex justify-between text-xs">
                                  <span className="text-gray-600">{label}</span>
                                  <span className="font-medium">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {Object.keys(health.invalidReasons).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Invalid Reasons</p>
                            <div className="space-y-1">
                              {Object.entries(health.invalidReasons).map(([reason, count]) => (
                                <div key={reason} className="flex justify-between text-xs">
                                  <span className="text-gray-600">{reason.replace(/_/g, " ")}</span>
                                  <span className="font-medium text-red-600">{count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {Object.keys(health.bodySystemCounts).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">By Body System</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {Object.entries(health.bodySystemCounts)
                                .sort((a, b) => b[1] - a[1])
                                .map(([system, count]) => (
                                  <div key={system} className="flex justify-between text-xs">
                                    <span className="text-gray-600 truncate mr-2">{system}</span>
                                    <span className="font-medium">{count}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-normalization">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5" /> Data Normalization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Fix published questions missing difficulty values (sets to 3) and mark eligible questions as adaptive-eligible.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runNormalization(true)}
                    disabled={normalizing}
                    data-testid="btn-normalize-dry-run"
                  >
                    {normalizing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Settings className="w-4 h-4 mr-1" />}
                    Preview Changes
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => runNormalization(false)}
                    disabled={normalizing}
                    data-testid="btn-normalize-apply"
                  >
                    {normalizing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Wrench className="w-4 h-4 mr-1" />}
                    Apply Fixes
                  </Button>
                </div>

                {normalizeResult && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg" data-testid="normalize-result">
                    <div className="flex items-center gap-2 mb-2">
                      {normalizeResult.dryRun ? (
                        <Badge variant="outline">Preview Only</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">Applied</Badge>
                      )}
                      <span className="text-sm font-medium">{normalizeResult.totalChanges} changes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Difficulty fixes: <span className="font-bold">{normalizeResult.difficultyFixes}</span></div>
                      <div>Eligibility fixes: <span className="font-bold">{normalizeResult.eligibilityFixes}</span></div>
                    </div>
                    {normalizeResult.changes && normalizeResult.changes.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {normalizeResult.changes.slice(0, 20).map((c: any, i: number) => (
                          <div key={i} className="text-xs text-gray-500 py-0.5">
                            {c.tier}/{c.id.slice(0, 8)}... — {c.action}
                          </div>
                        ))}
                        {normalizeResult.changes.length > 20 && (
                          <div className="text-xs text-gray-400">...and {normalizeResult.changes.length - 20} more</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> {t("pages.adminCatDashboard.abilityDistributionHistogram")}</CardTitle>
              </CardHeader>
              <CardContent>
                {data.totalSessions === 0 ? (
                  <div className="text-center py-8 text-gray-500">{t("pages.adminCatDashboard.noCatSessionsRecordedYet")}</div>
                ) : (
                  <div className="flex items-end gap-2 h-48">
                    {data.abilityDistribution.map((count, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center" data-testid={`bar-ability-${i}`}>
                        <div className="text-xs font-medium mb-1">{count}</div>
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all"
                          style={{ height: `${(count / maxAbility) * 100}%`, minHeight: count > 0 ? "4px" : "0px" }}
                        />
                        <div className="text-xs text-gray-500 mt-2 text-center">{abilityLabels[i]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {t("pages.adminCatDashboard.recentSessions")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentSessions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">{t("pages.adminCatDashboard.noSessionsYet")}</div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {data.recentSessions.map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 border rounded text-sm">
                          <div>
                            <span className="font-medium">Ability: {Number(s.final_ability).toFixed(1)}</span>
                            <span className="text-gray-500 ml-2">CI: ±{Number(s.confidence_interval).toFixed(1)}</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">{s.question_count}Q</Badge>
                            {s.early_stop && <Badge className="text-xs bg-orange-100 text-orange-700">{t("pages.adminCatDashboard.earlyStop")}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> {t("pages.adminCatDashboard.difficultyAdjustmentLog")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.adjustmentLog.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">{t("pages.adminCatDashboard.noCalibrationAdjustmentsRecordedYet")}</div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {data.adjustmentLog.map((a: any, i: number) => (
                        <div key={i} className="p-2 border rounded text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Level {a.difficulty_level}</span>
                            <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {Number(a.old_scaling).toFixed(2)} → {Number(a.new_scaling).toFixed(2)} | {a.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
