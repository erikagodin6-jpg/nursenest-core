import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Database, RefreshCw, ArrowRightLeft, Server, HardDrive } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface DbStatus {
  environment: string;
  devHost: string;
  prodHost: string;
  hasSeparateProd: boolean;
  prodConnected: boolean;
  dev: {
    examQuestions: { tier: string; count: number }[];
    alliedQuestions: number;
    imagingQuestions: number;
  };
  prod: {
    examQuestions: { tier: string; count: number }[];
    alliedQuestions: number;
    imagingQuestions: number;
  };
  lastSyncTimestamp: string | null;
  serverTime: string;
}

export default function AdminDatabaseStatus() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.tier !== "admin") {
      navigate("/");
      return;
    }
    fetchStatus();
  }, [user]);

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/database-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch database status");
      const data = await res.json();
      setStatus(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function runSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/database-sync", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();
      setSyncResult(data);
      fetchStatus();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSyncing(false);
    }
  }

  function getTotalCount(tiers: { tier: string; count: number }[]): number {
    return tiers.reduce((sum, t) => sum + t.count, 0);
  }

  if (!user || user.tier !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminDatabaseStatus.databaseStatus")}</h1>
          </div>
          <Button onClick={fetchStatus} variant="outline" disabled={loading} data-testid="button-refresh">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" data-testid="text-error">
            {error}
          </div>
        )}

        {loading && !status ? (
          <div className="text-center py-12 text-gray-500">{t("pages.adminDatabaseStatus.loadingDatabaseStatus")}</div>
        ) : status ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Server className="h-4 w-4" /> Environment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={status.environment === "production" ? "destructive" : "secondary"} data-testid="badge-environment">
                    {status.environment}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <HardDrive className="h-4 w-4" /> Dev Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-mono text-gray-600 truncate" data-testid="text-dev-host">{status.devHost}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <HardDrive className="h-4 w-4" /> Prod Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-mono text-gray-600 truncate" data-testid="text-prod-host">{status.prodHost}</p>
                  {status.hasSeparateProd ? (
                    <Badge variant={status.prodConnected ? "default" : "destructive"} className="mt-1" data-testid="badge-prod-status">
                      {status.prodConnected ? "Connected" : "Not connected"}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mt-1" data-testid="badge-prod-status">{t("pages.adminDatabaseStatus.sameAsDev")}</Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("pages.adminDatabaseStatus.devDatabaseCounts")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Exam Questions ({getTotalCount(status.dev.examQuestions)} total)</h4>
                      <div className="flex flex-wrap gap-2">
                        {status.dev.examQuestions.map((t) => (
                          <Badge key={t.tier} variant="outline" data-testid={`badge-dev-exam-${t.tier}`}>
                            {t.tier}: {t.count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{t("pages.adminDatabaseStatus.alliedQuestions")}</span>
                      <span className="font-medium" data-testid="text-dev-allied">{status.dev.alliedQuestions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{t("pages.adminDatabaseStatus.imagingQuestions")}</span>
                      <span className="font-medium" data-testid="text-dev-imaging">{status.dev.imagingQuestions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("pages.adminDatabaseStatus.prodDatabaseCounts")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {!status.hasSeparateProd ? (
                    <p className="text-sm text-gray-500">{t("pages.adminDatabaseStatus.sameDatabaseAsDevCounts")}</p>
                  ) : !status.prodConnected ? (
                    <p className="text-sm text-red-500">{t("pages.adminDatabaseStatus.productionDatabaseNotConnected")}</p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Exam Questions ({getTotalCount(status.prod.examQuestions)} total)</h4>
                        <div className="flex flex-wrap gap-2">
                          {status.prod.examQuestions.map((t) => (
                            <Badge key={t.tier} variant="outline" data-testid={`badge-prod-exam-${t.tier}`}>
                              {t.tier}: {t.count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t("pages.adminDatabaseStatus.alliedQuestions2")}</span>
                        <span className="font-medium" data-testid="text-prod-allied">{status.prod.alliedQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t("pages.adminDatabaseStatus.imagingQuestions2")}</span>
                        <span className="font-medium" data-testid="text-prod-imaging">{status.prod.imagingQuestions}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" /> Sync Dev → Prod
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Push missing exam_questions, allied_questions, and imaging_questions from dev to production.
                  Uses upsert logic — safe to run multiple times without creating duplicates.
                </p>
                <Button
                  onClick={runSync}
                  disabled={syncing || !status.hasSeparateProd}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-sync"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Sync to Production
                    </>
                  )}
                </Button>
                {!status.hasSeparateProd && (
                  <p className="text-xs text-gray-400 mt-2">
                    Set PROD_DATABASE_URL to enable syncing to a separate production database
                  </p>
                )}
                {syncResult && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded" data-testid="text-sync-result">
                    <p className="font-medium text-green-800 mb-2">{syncResult.message}</p>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>Exam questions synced: {syncResult.synced?.examQuestions || 0}</p>
                      <p>Allied questions synced: {syncResult.synced?.alliedQuestions || 0}</p>
                      <p>Imaging questions synced: {syncResult.synced?.imagingQuestions || 0}</p>
                      {syncResult.prodTotals && (
                        <div className="mt-2 pt-2 border-t border-green-200">
                          <p className="font-medium">{t("pages.adminDatabaseStatus.productionTotalsAfterSync")}</p>
                          <p>Exam: {syncResult.prodTotals.examQuestions}</p>
                          <p>Allied: {syncResult.prodTotals.alliedQuestions}</p>
                          <p>Imaging: {syncResult.prodTotals.imagingQuestions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
