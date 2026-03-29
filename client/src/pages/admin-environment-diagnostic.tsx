import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnvironmentBadge, TargetSelector, ProductionConfirmModal } from "@/components/environment-badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Stethoscope, RefreshCw, CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface DiagnosticCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  detail: string;
}

interface DiagnosticResult {
  environment: {
    appMode: string;
    deploymentTarget: string;
    databaseTarget: string;
    devDbFingerprint: string;
    prodDbFingerprint: string;
    hasSeparateProd: boolean;
    devUrl: string;
    prodUrl: string;
  };
  checks: DiagnosticCheck[];
}

export default function AdminEnvironmentDiagnostic() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [testTarget, setTestTarget] = useState("development");
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user || user.tier !== "admin") {
      navigate("/");
      return;
    }
    fetchDiagnostics();
  }, [user]);

  async function fetchDiagnostics() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/environment/diagnostics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch diagnostics");
      const data = await res.json();
      setDiagnostics(data);
    } catch {
      setDiagnostics(null);
    } finally {
      setLoading(false);
    }
  }

  async function runTestWrite(dryRun: boolean) {
    if (testTarget === "production" && !showConfirm && !dryRun) {
      setShowConfirm(true);
      return;
    }
    setShowConfirm(false);
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/environment/test-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ target: testTarget, dryRun }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setTesting(false);
    }
  }

  const statusIcon = (status: string) => {
    if (status === "pass") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "warn") return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Stethoscope className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-diagnostic-title">{t("pages.adminEnvironmentDiagnostic.environmentPublishCheck")}</h1>
              <p className="text-sm text-gray-500">{t("pages.adminEnvironmentDiagnostic.testDatabaseTargetsWriteReadiness")}</p>
            </div>
          </div>
          <EnvironmentBadge />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500" data-testid="text-loading">{t("pages.adminEnvironmentDiagnostic.runningDiagnostics")}</div>
        ) : diagnostics ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t("pages.adminEnvironmentDiagnostic.environmentOverview")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">{t("pages.adminEnvironmentDiagnostic.appMode")}</span>
                    <Badge
                      className={`ml-2 ${
                        diagnostics.environment.appMode === "production"
                          ? "bg-red-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                      data-testid="text-app-mode"
                    >
                      {diagnostics.environment.appMode.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("pages.adminEnvironmentDiagnostic.database")}</span>
                    <span className="ml-2 font-medium" data-testid="text-db-target">
                      {diagnostics.environment.hasSeparateProd ? "Separate Prod DB" : "Shared DB"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("pages.adminEnvironmentDiagnostic.devFingerprint")}</span>
                    <span className="ml-2 font-mono text-xs" data-testid="text-dev-fingerprint">
                      {diagnostics.environment.devDbFingerprint?.substring(0, 8)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("pages.adminEnvironmentDiagnostic.prodFingerprint")}</span>
                    <span className="ml-2 font-mono text-xs" data-testid="text-prod-fingerprint">
                      {diagnostics.environment.prodDbFingerprint?.substring(0, 8)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("pages.adminEnvironmentDiagnostic.devUrl")}</span>
                    <span className="ml-2 font-mono text-xs">{diagnostics.environment.devUrl}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("pages.adminEnvironmentDiagnostic.prodUrl")}</span>
                    <span className="ml-2 font-mono text-xs">{diagnostics.environment.prodUrl}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("pages.adminEnvironmentDiagnostic.diagnosticChecks")}</CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchDiagnostics} data-testid="button-refresh">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Re-run
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diagnostics.checks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        check.status === "pass"
                          ? "border-green-200 bg-green-50"
                          : check.status === "warn"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-red-200 bg-red-50"
                      }`}
                      data-testid={`check-${check.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="flex items-center gap-2">
                        {statusIcon(check.status)}
                        <span className="font-medium text-sm">{check.name}</span>
                      </div>
                      <span className="text-xs text-gray-600 max-w-md text-right">{check.detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("pages.adminEnvironmentDiagnostic.testWritePipeline")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <TargetSelector
                    value={testTarget}
                    onChange={setTestTarget}
                    disabled={testing}
                  />
                  <Button
                    onClick={() => runTestWrite(true)}
                    disabled={testing}
                    variant="outline"
                    size="sm"
                    data-testid="button-dry-run"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Dry Run
                  </Button>
                  <Button
                    onClick={() => runTestWrite(false)}
                    disabled={testing}
                    variant={testTarget === "production" ? "destructive" : "default"}
                    size="sm"
                    data-testid="button-test-write"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Test Write
                  </Button>
                </div>

                {testResult && (
                  <div
                    className={`p-4 rounded-lg border ${
                      testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                    data-testid="test-result"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {testResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        {testResult.success ? "Test passed" : "Test failed"}
                      </span>
                    </div>
                    {testResult.preflightResult && (
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>DB Fingerprint: <span className="font-mono">{testResult.preflightResult.dbFingerprint?.substring(0, 8)}</span></div>
                        <div>Environment: {testResult.preflightResult.actualEnvironment}</div>
                        {testResult.preflightResult.errors?.length > 0 && (
                          <div className="text-red-600">Errors: {testResult.preflightResult.errors.join("; ")}</div>
                        )}
                      </div>
                    )}
                    {testResult.blockedReason && (
                      <p className="text-xs text-orange-600 mt-1">Blocked: {testResult.blockedReason}</p>
                    )}
                    {testResult.error && (
                      <p className="text-xs text-red-600 mt-1">Error: {testResult.error}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12 text-red-500" data-testid="text-error">{t("pages.adminEnvironmentDiagnostic.failedToLoadDiagnostics")}</div>
        )}
      </div>

      <ProductionConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => runTestWrite(false)}
        target={testTarget}
        writeSummary="Diagnostic test write to verify environment pipeline"
        itemCount={1}
        dbFingerprint={diagnostics?.environment.prodDbFingerprint?.substring(0, 8)}
      />
    </div>
  );
}
