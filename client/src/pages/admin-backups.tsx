import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import { useI18n } from "@/lib/i18n";
import {
  Download,
  HardDrive,
  Database,
  Image,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  FileArchive,
  RefreshCw,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface BackupLogEntry {
  type: string;
  timestamp: string;
  archivePath: string;
  size: number;
  fileCount: number;
  status: string;
  validationResult?: any;
}

function formatBytes(bytes: number): string {

  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminBackupsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [history, setHistory] = useState<BackupLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (!user || (user as any)?.tier !== "admin") {
      setLocation("/");
      return;
    }
    fetchHistory();
  }, [user]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/backup/history");
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function runAction(action: string, endpoint: string) {
    setActionLoading(action);
    setLastResult(null);
    try {
      const res = await adminFetch(endpoint, { method: "POST" });
      const data = await res.json();
      setLastResult({ action, ...data });
      await fetchHistory();
    } catch (err: any) {
      setLastResult({ action, error: err.message || "Action failed" });
    } finally {
      setActionLoading(null);
    }
  }

  async function runValidation() {
    setActionLoading("validate");
    setValidationResult(null);
    try {
      const res = await adminFetch("/api/admin/backup/validate", { method: "POST" });
      const data = await res.json();
      setValidationResult(data);
      await fetchHistory();
    } catch (err: any) {
      setValidationResult({ error: err.message || "Validation failed" });
    } finally {
      setActionLoading(null);
    }
  }

  async function downloadLatest() {
    setActionLoading("download");
    try {
      const res = await adminFetch("/api/admin/backup/download");
      if (!res.ok) {
        const errData = await res.json();
        setLastResult({ action: "download", error: errData.error || "Download failed" });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("content-disposition");
      const filename = disposition?.match(/filename="(.+)"/)?.[1] || "backup.zip";
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setLastResult({ action: "download", success: true, filename });
    } catch (err: any) {
      setLastResult({ action: "download", error: err.message || "Download failed" });
    } finally {
      setActionLoading(null);
    }
  }

  const latestFull = history.find((h) => h.type === "full");
  const isLoading = (action: string) => actionLoading === action;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid="page-admin-backups">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-24">
        <div className="flex items-center gap-3 mb-6">
          <HardDrive className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl font-bold" data-testid="text-backup-title">{t("pages.adminBackups.backupExportSystem")}</h1>
        </div>

        {latestFull && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/30" data-testid="card-latest-backup">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{t("pages.adminBackups.latestFullBackup")}</span>
                  <span className="text-sm" data-testid="text-latest-backup-time">{formatDate(latestFull.timestamp)}</span>
                </div>
                <Badge variant="outline" data-testid="text-latest-backup-size">{formatBytes(latestFull.size)}</Badge>
                <Badge variant={latestFull.status === "success" ? "default" : "destructive"} data-testid="text-latest-backup-status">
                  {latestFull.status === "success" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                  {latestFull.status}
                </Badge>
                <span className="text-sm text-muted-foreground">{latestFull.fileCount} files</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card data-testid="card-action-full-backup">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-green-600" />
                Full Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create a complete zip archive of code, config, translations, and assets.
              </p>
              <Button
                onClick={() => runAction("full", "/api/admin/backup/full")}
                disabled={!!actionLoading}
                className="w-full"
                data-testid="button-generate-full-backup"
              >
                {isLoading("full") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileArchive className="w-4 h-4 mr-2" />}
                Generate Full Backup
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-action-db-backup">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-600" />
                Database Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Export schema, migrations, table structure, and non-sensitive content.
              </p>
              <Button
                onClick={() => runAction("db", "/api/admin/backup/db")}
                disabled={!!actionLoading}
                variant="outline"
                className="w-full"
                data-testid="button-generate-db-backup"
              >
                {isLoading("db") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                Export Database
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-action-assets-backup">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="w-5 h-5 text-orange-600" />
                Assets Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Copy logos, icons, images, PDFs, translations, and SEO assets.
              </p>
              <Button
                onClick={() => runAction("assets", "/api/admin/backup/assets")}
                disabled={!!actionLoading}
                variant="outline"
                className="w-full"
                data-testid="button-generate-assets-backup"
              >
                {isLoading("assets") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Image className="w-4 h-4 mr-2" />}
                Backup Assets
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-action-deployment-export">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Deployment Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a clean deployment package with restore instructions.
              </p>
              <Button
                onClick={() => runAction("deployment", "/api/admin/backup/deployment")}
                disabled={!!actionLoading}
                variant="outline"
                className="w-full"
                data-testid="button-generate-deployment-export"
              >
                {isLoading("deployment") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
                Generate Deployment Package
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-action-validate">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Validate Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check the latest backup archive for all critical components.
              </p>
              <Button
                onClick={runValidation}
                disabled={!!actionLoading}
                variant="outline"
                className="w-full"
                data-testid="button-validate-backup"
              >
                {isLoading("validate") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                Validate Backup
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-action-download">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-600" />
                Download Latest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download the most recent full backup archive.
              </p>
              <Button
                onClick={downloadLatest}
                disabled={!!actionLoading}
                variant="outline"
                className="w-full"
                data-testid="button-download-latest"
              >
                {isLoading("download") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Download Latest Backup
              </Button>
            </CardContent>
          </Card>
        </div>

        {lastResult && (
          <Card className={`mb-6 ${lastResult.error ? "border-red-300 bg-red-50 dark:bg-red-950/20" : "border-green-300 bg-green-50 dark:bg-green-950/20"}`} data-testid="card-action-result">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {lastResult.error ? (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                )}
                <div>
                  <p className="font-medium" data-testid="text-action-result-title">
                    {lastResult.error ? "Error" : "Success"}: {lastResult.action}
                  </p>
                  {lastResult.error && (
                    <p className="text-sm text-red-600 mt-1" data-testid="text-action-result-error">{lastResult.error}</p>
                  )}
                  {lastResult.size && (
                    <p className="text-sm text-muted-foreground mt-1">Size: {formatBytes(lastResult.size)}</p>
                  )}
                  {lastResult.fileCount && (
                    <p className="text-sm text-muted-foreground">Files: {lastResult.fileCount}</p>
                  )}
                  {lastResult.timestamp && (
                    <p className="text-sm text-muted-foreground">Time: {formatDate(lastResult.timestamp)}</p>
                  )}
                  {lastResult.filename && (
                    <p className="text-sm text-muted-foreground">Downloaded: {lastResult.filename}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {validationResult && (
          <Card className={`mb-6 ${validationResult.valid ? "border-green-300 bg-green-50 dark:bg-green-950/20" : validationResult.error ? "border-red-300 bg-red-50 dark:bg-red-950/20" : "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20"}`} data-testid="card-validation-result">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Validation Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validationResult.error ? (
                <p className="text-red-600" data-testid="text-validation-error">{validationResult.error}</p>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={validationResult.valid ? "default" : "destructive"} data-testid="text-validation-status">
                      {validationResult.valid ? "VALID" : "INVALID"}
                    </Badge>
                    <span className="text-sm">{validationResult.totalFiles} files in archive</span>
                  </div>
                  <div className="space-y-1.5">
                    {validationResult.components?.map((c: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm" data-testid={`validation-component-${i}`}>
                        {c.found ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                  {validationResult.warnings?.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {validationResult.warnings.map((w: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-yellow-700" data-testid={`validation-warning-${i}`}>
                          <AlertTriangle className="w-4 h-4" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Card data-testid="card-backup-history">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Backup History
              </span>
              <Button variant="ghost" size="sm" onClick={fetchHistory} data-testid="button-refresh-history">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-history">{t("pages.adminBackups.noBackupHistoryFoundRun")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">{t("pages.adminBackups.type")}</th>
                      <th className="text-left py-2 px-2">{t("pages.adminBackups.timestamp")}</th>
                      <th className="text-left py-2 px-2">{t("pages.adminBackups.size")}</th>
                      <th className="text-left py-2 px-2">{t("pages.adminBackups.files")}</th>
                      <th className="text-left py-2 px-2">{t("pages.adminBackups.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 25).map((entry, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900" data-testid={`row-history-${i}`}>
                        <td className="py-2 px-2">
                          <Badge variant="outline" className="text-xs">{entry.type}</Badge>
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">{formatDate(entry.timestamp)}</td>
                        <td className="py-2 px-2">{entry.size > 0 ? formatBytes(entry.size) : "-"}</td>
                        <td className="py-2 px-2">{entry.fileCount}</td>
                        <td className="py-2 px-2">
                          <Badge variant={entry.status === "success" || entry.status === "valid" ? "default" : "destructive"} className="text-xs">
                            {entry.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
