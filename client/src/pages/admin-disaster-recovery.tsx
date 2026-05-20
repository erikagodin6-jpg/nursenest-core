import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  Zap,
  Database,
  HardDrive,
  Activity,
  Play,
  FileCheck,
  TrendingUp,
} from "lucide-react";

interface ChaosTestResult {
  scenarioId: string;
  scenarioName: string;
  status: "pass" | "fail" | "degraded";
  durationMs: number;
  fallbacksActivated: string[];
  systemsDegraded: string[];
  coreValueMaintained: boolean;
  details: { step: string; result: string; message: string }[];
  emergencyModeTriggered: boolean;
  circuitBreakersTripped: string[];
}

interface ChaosReport {
  id: string;
  runAt: number;
  completedAt: number;
  totalScenarios: number;
  passed: number;
  failed: number;
  degraded: number;
  overallStatus: string;
  readinessScore: number;
  results: ChaosTestResult[];
  recommendations: string[];
}

interface DRStatus {
  drReadinessScore: number;
  chaosTestStatus: {
    lastRun: ChaosReport | null;
    readinessScore: number;
    history: ChaosReport[];
  };
  backupStatus: {
    lastFullBackup: any;
    totalBackups: number;
    recentBackups: any[];
  };
  backupVerification: any;
  restoreTestResult: any;
  scores: {
    chaos: number;
    backup: number;
    verification: number;
    restore: number;
  };
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  category: string;
}

function formatDate(ts: number | string): string {
  try {
    const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
    return d.toLocaleString();
  } catch {
    return String(ts);
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-600";
}

function getScoreBadge(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  if (score >= 40) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pass":
    case "healthy":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "fail":
    case "critical":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "degraded":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
}

export default function AdminDisasterRecoveryPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [drStatus, setDrStatus] = useState<DRStatus | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [chaosRunning, setChaosRunning] = useState(false);
  const [singleRunning, setSingleRunning] = useState<string | null>(null);
  const [chaosResult, setChaosResult] = useState<ChaosReport | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [restoreDryRunning, setRestoreDryRunning] = useState(false);
  const [restoreDryResult, setRestoreDryResult] = useState<any>(null);
  const [manifestRunning, setManifestRunning] = useState(false);
  const [manifestResult, setManifestResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || (user as any)?.tier !== "admin") {
      setLocation("/");
      return;
    }
    fetchData();
  }, [user]);

  async function fetchData() {
    setLoading(true);
    try {
      setErrorMessage(null);
      const [drRes, scenariosRes] = await Promise.all([
        adminFetch("/api/admin/disaster-recovery/status"),
        adminFetch("/api/admin/chaos/scenarios"),
      ]);
      if (drRes.ok) setDrStatus(await drRes.json());
      else setErrorMessage("Failed to load DR status");
      if (scenariosRes.ok) {
        const data = await scenariosRes.json();
        setScenarios(data.scenarios || []);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  function recomputeSummary(results: ChaosTestResult[]): Partial<ChaosReport> {
    const passed = results.filter(r => r.status === "pass").length;
    const failed = results.filter(r => r.status === "fail").length;
    const degraded = results.filter(r => r.status === "degraded").length;
    const total = results.length;
    const readinessScore = total > 0 ? Math.round(((passed + degraded * 0.5) / total) * 100) : 0;
    const overallStatus = failed > 0 ? "critical" : degraded > 0 ? "degraded" : "healthy";
    return { totalScenarios: total, passed, failed, degraded, readinessScore, overallStatus };
  }

  async function runAllChaos() {
    setChaosRunning(true);
    setChaosResult(null);
    setErrorMessage(null);
    try {
      const res = await adminFetch("/api/admin/chaos/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      if (res.ok) {
        const data = await res.json();
        setChaosResult(data.report);
        await fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || "Chaos test run failed");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Chaos test run failed");
    } finally {
      setChaosRunning(false);
    }
  }

  async function runSingleChaos(scenarioId: string) {
    setSingleRunning(scenarioId);
    setErrorMessage(null);
    try {
      const res = await adminFetch(`/api/admin/chaos/run/${scenarioId}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setChaosResult(prev => {
          const newResult = data.result;
          if (!prev) {
            const results = [newResult];
            return { id: "single", runAt: Date.now(), completedAt: Date.now(), results, recommendations: [], ...recomputeSummary(results) } as ChaosReport;
          }
          const updatedResults = [...prev.results.filter(r => r.scenarioId !== scenarioId), newResult];
          return { ...prev, results: updatedResults, ...recomputeSummary(updatedResults) };
        });
        await fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || `Scenario ${scenarioId} failed`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || `Scenario ${scenarioId} failed`);
    } finally {
      setSingleRunning(null);
    }
  }

  async function runRestoreDryRun() {
    setRestoreDryRunning(true);
    setRestoreDryResult(null);
    setErrorMessage(null);
    try {
      const res = await adminFetch("/api/admin/backup/restore-dry-run", { method: "POST" });
      if (res.ok) {
        setRestoreDryResult(await res.json());
        await fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || "Restore dry-run failed");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Restore dry-run failed");
    } finally {
      setRestoreDryRunning(false);
    }
  }

  async function runManifestGeneration() {
    setManifestRunning(true);
    setManifestResult(null);
    setErrorMessage(null);
    try {
      const res = await adminFetch("/api/admin/backup/generate-manifests", { method: "POST" });
      if (res.ok) {
        setManifestResult(await res.json());
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || "Manifest generation failed");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Manifest generation failed");
    } finally {
      setManifestRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid="page-admin-disaster-recovery">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4 md:p-8 pt-24">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-dr-title">Disaster Recovery Dashboard</h1>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2" data-testid="alert-error">
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300 flex-1">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600 text-sm">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="md:col-span-1">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">DR Readiness</p>
              <p className={`text-4xl font-bold ${getScoreColor(drStatus?.drReadinessScore || 0)}`} data-testid="text-dr-score">
                {drStatus?.drReadinessScore || 0}%
              </p>
            </CardContent>
          </Card>
          {[
            { label: "Chaos Tests", score: drStatus?.scores?.chaos || 0, icon: <Zap className="w-4 h-4" /> },
            { label: "Backup Health", score: drStatus?.scores?.backup || 0, icon: <Database className="w-4 h-4" /> },
            { label: "Verification", score: drStatus?.scores?.verification || 0, icon: <FileCheck className="w-4 h-4" /> },
            { label: "Restore Test", score: drStatus?.scores?.restore || 0, icon: <HardDrive className="w-4 h-4" /> },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </div>
                <Badge className={getScoreBadge(item.score)} data-testid={`badge-score-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {item.score}%
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Chaos Testing
                </CardTitle>
                <Button
                  onClick={runAllChaos}
                  disabled={chaosRunning}
                  size="sm"
                  data-testid="button-run-all-chaos"
                >
                  {chaosRunning ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  Run All Tests
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scenarios.map((scenario) => {
                  const result = chaosResult?.results?.find(r => r.scenarioId === scenario.id);
                  return (
                    <div
                      key={scenario.id}
                      className="border rounded-lg p-3 dark:border-gray-700"
                      data-testid={`card-scenario-${scenario.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result ? getStatusIcon(result.status) : <Clock className="w-4 h-4 text-gray-300" />}
                          <div>
                            <p className="font-medium text-sm">{scenario.name}</p>
                            <p className="text-xs text-gray-500">{scenario.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result && (
                            <button
                              onClick={() => setExpandedScenario(expandedScenario === scenario.id ? null : scenario.id)}
                              className="text-xs text-blue-600 hover:underline"
                              data-testid={`button-expand-${scenario.id}`}
                            >
                              Details
                            </button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runSingleChaos(scenario.id)}
                            disabled={singleRunning === scenario.id || chaosRunning}
                            data-testid={`button-run-${scenario.id}`}
                          >
                            {singleRunning === scenario.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                      {expandedScenario === scenario.id && result && (
                        <div className="mt-3 pt-3 border-t dark:border-gray-700">
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-gray-500">Duration:</span> {result.durationMs}ms
                            </div>
                            <div>
                              <span className="text-gray-500">Core Value:</span>{" "}
                              {result.coreValueMaintained ? <span className="text-green-600">Maintained</span> : <span className="text-red-600">Lost</span>}
                            </div>
                          </div>
                          {result.fallbacksActivated.length > 0 && (
                            <div className="text-xs mb-1">
                              <span className="text-gray-500">Fallbacks:</span>{" "}
                              {result.fallbacksActivated.map((f, i) => (
                                <Badge key={i} variant="outline" className="mr-1 text-[10px]">{f}</Badge>
                              ))}
                            </div>
                          )}
                          {result.circuitBreakersTripped.length > 0 && (
                            <div className="text-xs mb-1">
                              <span className="text-gray-500">Breakers Tripped:</span>{" "}
                              {result.circuitBreakersTripped.map((b, i) => (
                                <Badge key={i} variant="destructive" className="mr-1 text-[10px]">{b}</Badge>
                              ))}
                            </div>
                          )}
                          <div className="space-y-1 mt-2">
                            {result.details.map((d, i) => (
                              <div key={i} className="flex items-start gap-1 text-xs">
                                {d.result === "pass" ? <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />}
                                <span className="text-gray-600 dark:text-gray-400">{d.step}: {d.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {chaosResult && (
                <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800" data-testid="card-chaos-summary">
                  <p className="font-medium text-sm mb-2">Test Summary</p>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold">{chaosResult.totalScenarios}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Passed</p>
                      <p className="font-bold text-green-600">{chaosResult.passed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Failed</p>
                      <p className="font-bold text-red-600">{chaosResult.failed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Score</p>
                      <p className={`font-bold ${getScoreColor(chaosResult.readinessScore)}`}>{chaosResult.readinessScore}%</p>
                    </div>
                  </div>
                  {chaosResult.recommendations && chaosResult.recommendations.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {chaosResult.recommendations.map((r, i) => (
                        <p key={i} className="flex items-start gap-1">
                          <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" /> {r}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  Backup & Restore
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runRestoreDryRun}
                    disabled={restoreDryRunning}
                    data-testid="button-restore-dry-run"
                  >
                    {restoreDryRunning ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <FileCheck className="w-4 h-4 mr-1" />}
                    Restore Dry-Run
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runManifestGeneration}
                    disabled={manifestRunning}
                    data-testid="button-generate-manifests"
                  >
                    {manifestRunning ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <HardDrive className="w-4 h-4 mr-1" />}
                    Generate Manifests
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-3 dark:border-gray-700">
                  <p className="font-medium text-sm mb-2 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" /> Backup Status
                  </p>
                  {drStatus?.backupStatus?.lastFullBackup ? (
                    <div className="text-xs space-y-1">
                      <p><span className="text-gray-500">Last Full Backup:</span> {formatDate(drStatus.backupStatus.lastFullBackup.timestamp)}</p>
                      <p><span className="text-gray-500">Status:</span>{" "}
                        <Badge variant={drStatus.backupStatus.lastFullBackup.status === "success" ? "default" : "destructive"} className="text-[10px]">
                          {drStatus.backupStatus.lastFullBackup.status}
                        </Badge>
                      </p>
                      <p><span className="text-gray-500">Total Backups:</span> {drStatus.backupStatus.totalBackups}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No backups found</p>
                  )}
                </div>

                <div className="border rounded-lg p-3 dark:border-gray-700">
                  <p className="font-medium text-sm mb-2 flex items-center gap-2">
                    <FileCheck className="w-4 h-4" /> Backup Verification
                  </p>
                  {drStatus?.backupVerification ? (
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="text-gray-500">Valid:</span>{" "}
                        {drStatus.backupVerification.valid ? (
                          <Badge className="bg-green-100 text-green-800 text-[10px]">Valid</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">Issues Found</Badge>
                        )}
                      </p>
                      {drStatus.backupVerification.components?.map((c: any, i: number) => (
                        <p key={i} className="flex items-center gap-1">
                          {c.present ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                          {c.name}: {c.details}
                        </p>
                      ))}
                      {drStatus.backupVerification.warnings?.length > 0 && (
                        <div className="mt-1 text-yellow-600">
                          {drStatus.backupVerification.warnings.slice(0, 3).map((w: string, i: number) => (
                            <p key={i} className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {w}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No verification data available</p>
                  )}
                </div>

                {restoreDryResult && (
                  <div className="border rounded-lg p-3 dark:border-gray-700" data-testid="card-restore-dry-run">
                    <p className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Restore Dry-Run Result
                    </p>
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="text-gray-500">Would Succeed:</span>{" "}
                        {restoreDryResult.wouldSucceed ? (
                          <Badge className="bg-green-100 text-green-800 text-[10px]">Yes</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">No</Badge>
                        )}
                      </p>
                      <p><span className="text-gray-500">Mode:</span> {restoreDryResult.mode}</p>
                      <div className="grid grid-cols-4 gap-2 text-center mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div><p className="text-gray-500">Steps</p><p className="font-bold">{restoreDryResult.summary?.totalSteps}</p></div>
                        <div><p className="text-gray-500">Pass</p><p className="font-bold text-green-600">{restoreDryResult.summary?.passed}</p></div>
                        <div><p className="text-gray-500">Fail</p><p className="font-bold text-red-600">{restoreDryResult.summary?.failed}</p></div>
                        <div><p className="text-gray-500">Warn</p><p className="font-bold text-yellow-600">{restoreDryResult.summary?.warnings}</p></div>
                      </div>
                      {restoreDryResult.steps?.slice(0, 10).map((s: any, i: number) => (
                        <p key={i} className="flex items-start gap-1 mt-1">
                          {s.status === "pass" ? <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" /> :
                           s.status === "fail" ? <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" /> :
                           s.status === "warn" ? <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" /> :
                           <Clock className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />}
                          <span className="text-gray-600 dark:text-gray-400">{s.action}: {s.details}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {manifestResult && (
                  <div className="border rounded-lg p-3 dark:border-gray-700" data-testid="card-manifest-result">
                    <p className="font-medium text-sm mb-2 flex items-center gap-2">
                      <HardDrive className="w-4 h-4" /> Generated Manifests
                    </p>
                    <div className="text-xs space-y-1">
                      <p><span className="text-gray-500">Environment Variables:</span> {manifestResult.envManifest?.length || 0}</p>
                      <p><span className="text-gray-500">Required with values:</span> {manifestResult.envManifest?.filter((v: any) => v.required && v.hasValue).length || 0}/{manifestResult.envManifest?.filter((v: any) => v.required).length || 0}</p>
                      <p><span className="text-gray-500">Asset Types:</span> {manifestResult.assetInventory?.length || 0}</p>
                      <p><span className="text-gray-500">Critical Files:</span> {manifestResult.criticalFiles?.filter((f: any) => f.exists).length || 0}/{manifestResult.criticalFiles?.length || 0} present</p>
                      {manifestResult.stripeConfig?.products && (
                        <p><span className="text-gray-500">Stripe Products:</span> {manifestResult.stripeConfig.products.length}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Chaos Test History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {drStatus?.chaosTestStatus?.history && drStatus.chaosTestStatus.history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-chaos-history">
                  <thead>
                    <tr className="border-b dark:border-gray-700 text-left">
                      <th className="pb-2 pr-4 text-gray-500 font-medium">Date</th>
                      <th className="pb-2 pr-4 text-gray-500 font-medium">Status</th>
                      <th className="pb-2 pr-4 text-gray-500 font-medium">Scenarios</th>
                      <th className="pb-2 pr-4 text-gray-500 font-medium">Pass/Fail</th>
                      <th className="pb-2 text-gray-500 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drStatus.chaosTestStatus.history.map((report, i) => (
                      <tr key={i} className="border-b dark:border-gray-700/50" data-testid={`row-chaos-history-${i}`}>
                        <td className="py-2 pr-4 text-xs">{formatDate(report.runAt)}</td>
                        <td className="py-2 pr-4">
                          <Badge
                            variant={report.overallStatus === "healthy" ? "default" : report.overallStatus === "degraded" ? "secondary" : "destructive"}
                            className="text-[10px]"
                          >
                            {report.overallStatus}
                          </Badge>
                        </td>
                        <td className="py-2 pr-4 text-xs">{report.totalScenarios}</td>
                        <td className="py-2 pr-4 text-xs">
                          <span className="text-green-600">{report.passed}</span> / <span className="text-red-600">{report.failed}</span>
                        </td>
                        <td className="py-2">
                          <span className={`font-bold text-xs ${getScoreColor(report.readinessScore)}`}>
                            {report.readinessScore}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No chaos test history. Run chaos tests to see results here.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={fetchData} data-testid="button-refresh-dr">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button variant="outline" onClick={() => setLocation("/admin/backups")} data-testid="link-backups">
            <HardDrive className="w-4 h-4 mr-1" /> Backup Management
          </Button>
        </div>
      </div>
    </div>
  );
}
