import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Database,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Image,
  Link,
  Layers,
  Shield,
  Zap,
} from "lucide-react";

interface TierDist {
  tier: string;
  exam: string;
  count: number;
  categories: { name: string; count: number }[];
}

interface JobStatus {
  hasJob: boolean;
  jobId?: string;
  status?: string;
  startedAt?: string;
  completedAt?: string;
  dbTarget?: string;
  dbVerified?: boolean;
  currentTier?: string;
  currentCategory?: string;
  currentBatch?: number;
  totalBatches?: number;
  questionsInserted?: { rpn: number; rn: number; np: number };
  flashcardsCreated?: { rpn: number; rn: number; np: number };
  imageLinked?: number;
  lessonLinked?: number;
  duplicatesSkipped?: number;
  validationFailed?: number;
  errors?: string[];
  recentBatches?: any[];
  finalReport?: any;
}

interface DbVerification {
  verified: boolean;
  target: string;
  info: any;
}

export default function AdminContentExpansion() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [distribution, setDistribution] = useState<{ tiers: TierDist[]; totalQuestions: number } | null>(null);
  const [dbVerification, setDbVerification] = useState<DbVerification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [starting, setStarting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
      return;
    }
    loadDistribution();
    loadStatus();
  }, [isAdmin]);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, [polling]);

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDistribution = async () => {
    try {
      const res = await adminFetch("/api/admin/content-expansion/distribution");
      if (res.ok) setDistribution(await res.json());
      else setLoadError(`Failed to load distribution: ${res.status}`);
    } catch (e: any) {
      setLoadError(e.message);
    }
  };

  const loadStatus = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/content-expansion/status");
      if (res.ok) {
        const data = await res.json();
        setJobStatus(data);
        if (data.status === "running" || data.status === "verifying" || data.status === "completing") {
          setPolling(true);
        } else {
          setPolling(false);
        }
      }
    } catch (e: any) {
      console.error("Status poll error:", e.message);
    }
  }, []);

  const verifyDb = async () => {
    setVerifying(true);
    try {
      const res = await adminFetch("/api/admin/content-expansion/verify-db");
      if (res.ok) {
        setDbVerification(await res.json());
      } else {
        setDbVerification({ verified: false, target: "unknown", info: { error: `HTTP ${res.status}` } });
      }
    } catch (e: any) {
      setDbVerification({ verified: false, target: "unknown", info: { error: e.message } });
    } finally {
      setVerifying(false);
    }
  };

  const startJob = async () => {
    setStarting(true);
    setShowConfirm(false);
    try {
      const res = await adminFetch("/api/admin/content-expansion/start", { method: "POST" });
      if (res.ok) {
        setPolling(true);
        setTimeout(loadStatus, 1000);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to start job");
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setStarting(false);
    }
  };

  const resetJob = async () => {
    try {
      await adminFetch("/api/admin/content-expansion/reset", { method: "POST" });
      setJobStatus(null);
      setDbVerification(null);
    } catch {}
  };

  if (!isAdmin) return null;

  const isRunning = jobStatus?.status === "running" || jobStatus?.status === "verifying" || jobStatus?.status === "completing";
  const isComplete = jobStatus?.status === "complete";
  const isFailed = jobStatus?.status === "failed";
  const progress = jobStatus?.totalBatches ? Math.round((jobStatus.currentBatch || 0) / jobStatus.totalBatches * 100) : 0;

  const totalInserted = (jobStatus?.questionsInserted?.rpn || 0) + (jobStatus?.questionsInserted?.rn || 0) + (jobStatus?.questionsInserted?.np || 0);
  const totalFlashcards = (jobStatus?.flashcardsCreated?.rpn || 0) + (jobStatus?.flashcardsCreated?.rn || 0) + (jobStatus?.flashcardsCreated?.np || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">{t("pages.adminContentExpansion.contentExpansionJob")}</h1>
            <p className="text-gray-500 mt-1">{t("pages.adminContentExpansion.generate1500ExamQuestionsLinked")}</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Database className="w-4 h-4 mr-1" />
            Production Target
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="border border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Database Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dbVerification ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {dbVerification.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${dbVerification.verified ? "text-green-700" : "text-red-700"}`} data-testid="text-db-status">
                      {dbVerification.verified ? "Production DB Verified" : "Verification Failed"}
                    </span>
                  </div>
                  {dbVerification.verified && dbVerification.info && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Database: {dbVerification.info.database}</p>
                      <p>Target: {dbVerification.target}</p>
                      {!dbVerification.info.hasSeparateProd && (
                        <p className="text-amber-600 font-medium">{t("pages.adminContentExpansion.noteNoSeparateProddatabaseurlUsing")}</p>
                      )}
                    </div>
                  )}
                  {!dbVerification.verified && dbVerification.info?.error && (
                    <p className="text-xs text-red-600">{dbVerification.info.error}</p>
                  )}
                </div>
              ) : (
                <Button
                  onClick={verifyDb}
                  disabled={verifying || isRunning}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-testid="button-verify-db"
                >
                  {verifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                  {verifying ? "Verifying..." : "Verify Production DB"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Questions Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900" data-testid="text-questions-count">{totalInserted}</div>
              <div className="text-xs text-purple-600 mt-1">
                RPN: {jobStatus?.questionsInserted?.rpn || 0} | RN: {jobStatus?.questionsInserted?.rn || 0} | NP: {jobStatus?.questionsInserted?.np || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Flashcards Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900" data-testid="text-flashcards-count">{totalFlashcards}</div>
              <div className="text-xs text-green-600 mt-1">
                RPN: {jobStatus?.flashcardsCreated?.rpn || 0} | RN: {jobStatus?.flashcardsCreated?.rn || 0} | NP: {jobStatus?.flashcardsCreated?.np || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {distribution && !isRunning && !isComplete && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Tier & Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {distribution.tiers.map(tier => (
                  <div key={tier.tier} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm uppercase">{tier.tier}</h3>
                      <Badge variant="secondary">{tier.count} questions</Badge>
                    </div>
                    <div className="space-y-1">
                      {tier.categories.map(cat => (
                        <div key={cat.name} className="flex justify-between text-xs text-gray-600">
                          <span>{cat.name}</span>
                          <span className="font-medium">{cat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isRunning && (
          <Card className="mb-6 border-2 border-amber-300 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <Loader2 className="w-5 h-5 animate-spin" />
                Job Running
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">
                      Batch {jobStatus?.currentBatch || 0} / {jobStatus?.totalBatches || 0}
                      {jobStatus?.currentTier && ` — ${jobStatus.currentTier.toUpperCase()}`}
                      {jobStatus?.currentCategory && ` / ${jobStatus.currentCategory}`}
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3" data-testid="progress-bar">
                    <div
                      className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white rounded p-2 text-center">
                    <div className="font-bold text-lg">{totalInserted}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.questions")}</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="font-bold text-lg">{totalFlashcards}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.flashcards")}</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="font-bold text-lg">{jobStatus?.imageLinked || 0}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.imagelinked")}</div>
                  </div>
                  <div className="bg-white rounded p-2 text-center">
                    <div className="font-bold text-lg">{jobStatus?.duplicatesSkipped || 0}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.skippedDup")}</div>
                  </div>
                </div>

                {jobStatus?.recentBatches && jobStatus.recentBatches.length > 0 && (
                  <div className="border rounded p-3 bg-white">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">{t("pages.adminContentExpansion.recentBatches")}</h4>
                    <div className="space-y-1">
                      {jobStatus.recentBatches.map((b: any, i: number) => (
                        <div key={i} className="text-xs flex justify-between text-gray-600">
                          <span>#{b.batch} {b.tier}/{b.category}</span>
                          <span>+{b.inserted}q +{b.flashcards}fc {b.skipped > 0 ? `(${b.skipped} dup)` : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isComplete && jobStatus?.finalReport && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                Job Complete — Final Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-2xl font-bold text-purple-700" data-testid="text-report-total-questions">
                      {jobStatus.finalReport.totalQuestionsInserted}
                    </div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.totalQuestions")}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-2xl font-bold text-green-700" data-testid="text-report-total-flashcards">
                      {jobStatus.finalReport.totalFlashcardsCreated}
                    </div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.totalFlashcards")}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-2xl font-bold text-blue-700">{jobStatus.finalReport.imageLinked}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.imagelinked2")}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-2xl font-bold text-indigo-700">{jobStatus.finalReport.lessonLinked}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.lessonlinked")}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Questions by Tier
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(jobStatus.finalReport.questionsInserted).map(([tier, count]) => (
                        <div key={tier} className="flex justify-between items-center">
                          <span className="text-sm uppercase font-medium text-gray-700">{tier}</span>
                          <Badge variant="secondary">{count as number} questions</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Flashcards by Tier
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(jobStatus.finalReport.flashcardsCreated).map(([tier, count]) => (
                        <div key={tier} className="flex justify-between items-center">
                          <span className="text-sm uppercase font-medium text-gray-700">{tier}</span>
                          <Badge variant="secondary">{count as number} flashcards</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-xl font-bold text-orange-600">{jobStatus.finalReport.duplicatesSkipped}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.duplicatesSkipped")}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border text-center">
                    <div className="text-xl font-bold text-red-600">{jobStatus.finalReport.validationFailed}</div>
                    <div className="text-xs text-gray-500">{t("pages.adminContentExpansion.validationFailed")}</div>
                  </div>
                </div>

                {jobStatus.finalReport.livePublishedTotals && (
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Updated Live Published Totals
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs text-gray-500 mb-1">{t("pages.adminContentExpansion.examQuestions")}</h5>
                        {jobStatus.finalReport.livePublishedTotals.examQuestions?.map((r: any) => (
                          <div key={r.tier} className="flex justify-between text-sm">
                            <span className="uppercase">{r.tier}</span>
                            <span className="font-medium">{r.count}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h5 className="text-xs text-gray-500 mb-1">{t("pages.adminContentExpansion.flashcardBank")}</h5>
                        {jobStatus.finalReport.livePublishedTotals.flashcardBank?.map((r: any) => (
                          <div key={r.tier} className="flex justify-between text-sm">
                            <span className="uppercase">{r.tier}</span>
                            <span className="font-medium">{r.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Database target: {jobStatus.finalReport.dbTarget} | Completed: {jobStatus.finalReport.completedAt}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isFailed && (
          <Card className="mb-6 border-2 border-red-300 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                Job Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {jobStatus?.errors?.map((err, i) => (
                  <div key={i} className="text-sm text-red-700 bg-white rounded p-2 border border-red-200">
                    {err}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {jobStatus?.errors && jobStatus.errors.length > 0 && isRunning && (
          <Card className="mb-6 border border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Errors ({jobStatus.errors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {jobStatus.errors.map((err, i) => (
                  <div key={i} className="text-xs text-orange-700">{err}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          {!isRunning && !showConfirm && (
            <>
              <Button
                onClick={() => {
                  if (!dbVerification?.verified) {
                    verifyDb().then(() => setShowConfirm(true));
                  } else {
                    setShowConfirm(true);
                  }
                }}
                disabled={starting || isRunning}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-trigger-job"
              >
                <Play className="w-4 h-4 mr-2" />
                {isComplete || isFailed ? "Run Again" : "Start Content Expansion Job"}
              </Button>
              {(isComplete || isFailed) && (
                <Button onClick={resetJob} variant="outline" data-testid="button-reset-job">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button onClick={loadStatus} variant="outline" data-testid="button-refresh-status">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </>
          )}

          {showConfirm && !isRunning && (
            <Card className="w-full border-2 border-red-300 bg-red-50/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 mb-1">{t("pages.adminContentExpansion.confirmProductionWrite")}</h3>
                    <p className="text-sm text-red-700 mb-3">
                      This will generate 1,500 exam questions and linked flashcards and write them directly to the
                      <strong> {t("pages.adminContentExpansion.productionDatabase")}</strong>. This action cannot be easily undone.
                    </p>
                    {dbVerification?.verified && (
                      <p className="text-xs text-green-700 mb-3 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Production DB verified: {dbVerification.info?.database}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={startJob}
                        disabled={starting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        data-testid="button-confirm-start"
                      >
                        {starting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                        {starting ? "Starting..." : "Yes, Start Production Job"}
                      </Button>
                      <Button onClick={() => setShowConfirm(false)} variant="outline" data-testid="button-cancel-start">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
