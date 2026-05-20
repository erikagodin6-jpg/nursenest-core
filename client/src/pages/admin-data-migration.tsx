import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { adminFetch } from "@/lib/admin-fetch";
import {
  Database,
  Play,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Trash2,
  Search,
  RefreshCw,
  Shield,
  ArrowUpDown,
  FileText,
} from "lucide-react";

interface MigrationInfo {
  version: string;
  name: string;
  description: string;
  applied: boolean;
  appliedAt: string | null;
}

interface MigrationStatus {
  totalRegistered: number;
  totalApplied: number;
  pending: number;
  lastApplied: string | null;
  migrations: MigrationInfo[];
}

interface AuditEntry {
  id: string;
  version: string;
  name: string;
  direction: string;
  status: string;
  dryRun: boolean;
  executedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  errorMessage: string | null;
  executedBy: string | null;
  rollbackOf: string | null;
}

interface DryRunResult {
  version: string;
  name: string;
  direction: string;
  sql: string;
  estimatedAffectedTables: string[];
  validationPassed: boolean;
  validationMessage: string | null;
  breakingChange: boolean;
  currentSchemaConflicts: string[];
}

interface CleanupReport {
  id: string;
  runType: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  itemsScanned: number;
  itemsCleaned: number;
  itemsFlagged: number;
  details: { category: string; action: string; entityType: string; entityId: string; description: string }[];
  triggeredBy: string;
  errorMessage: string | null;
}

interface SchemaVersionStats {
  tables: { tableName: string; currentVersion: number; recordsByVersion: Record<number, number> }[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "N/A";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    running: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    rolled_back: "bg-orange-100 text-orange-800",
    partial: "bg-amber-100 text-amber-800",
  };
  return <Badge className={colors[status] || "bg-gray-100 text-gray-800"} data-testid={`badge-status-${status}`}>{status}</Badge>;
}

export default function AdminDataMigrationPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"migrations" | "cleanup" | "compatibility">("migrations");
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [cleanupReports, setCleanupReports] = useState<CleanupReport[]>([]);
  const [schemaStats, setSchemaStats] = useState<SchemaVersionStats | null>(null);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || (user as any)?.tier !== "admin") {
      setLocation("/");
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [statusRes, auditRes, cleanupRes, schemaRes] = await Promise.all([
        adminFetch("/api/admin/migrations/status"),
        adminFetch("/api/admin/migrations/audit-log"),
        adminFetch("/api/admin/cleanup/reports"),
        adminFetch("/api/admin/migrations/schema-versions"),
      ]);
      if (statusRes.ok) setMigrationStatus(await statusRes.json());
      if (auditRes.ok) setAuditLog(await auditRes.json());
      if (cleanupRes.ok) setCleanupReports(await cleanupRes.json());
      if (schemaRes.ok) setSchemaStats(await schemaRes.json());
    } catch {} finally { setLoading(false); }
  }

  async function handleDryRun(version: string) {
    setActionLoading(`dry-${version}`);
    try {
      const res = await adminFetch("/api/admin/migrations/dry-run", {
        method: "POST", body: { version, direction: "up" },
      });
      if (res.ok) {
        const result = await res.json();
        setDryRunResult(result);
      }
    } catch {} finally { setActionLoading(null); }
  }

  async function handleExecute(version: string) {
    setActionLoading(`exec-${version}`);
    try {
      const res = await adminFetch("/api/admin/migrations/execute", {
        method: "POST", body: { version },
      });
      if (res.ok) await loadData();
    } catch {} finally { setActionLoading(null); }
  }

  async function handleRollback(version: string) {
    setActionLoading(`roll-${version}`);
    try {
      const res = await adminFetch("/api/admin/migrations/rollback", {
        method: "POST", body: { version },
      });
      if (res.ok) await loadData();
    } catch {} finally { setActionLoading(null); }
  }

  async function handleCleanup(type: string) {
    setActionLoading(`cleanup-${type}`);
    try {
      const res = await adminFetch("/api/admin/cleanup/run", {
        method: "POST", body: { type },
      });
      if (res.ok) await loadData();
    } catch {} finally { setActionLoading(null); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "migrations" as const, label: "Migrations", icon: Database },
    { id: "cleanup" as const, label: "Auto-Cleanup", icon: Trash2 },
    { id: "compatibility" as const, label: "Schema Compatibility", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-data-migration">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Data Migration & Cleanup</h1>
            <p className="text-muted-foreground mt-1">Manage schema migrations, rollbacks, and automated cleanup</p>
          </div>
          <Button variant="outline" onClick={loadData} data-testid="button-refresh">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        <div className="flex gap-2 mb-6 border-b pb-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "migrations" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Registered</div>
                  <div className="text-2xl font-bold" data-testid="text-total-registered">{migrationStatus?.totalRegistered || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Applied</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="text-total-applied">{migrationStatus?.totalApplied || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold text-amber-600" data-testid="text-total-pending">{migrationStatus?.pending || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Last Applied</div>
                  <div className="text-lg font-medium" data-testid="text-last-applied">{migrationStatus?.lastApplied || "None"}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5" /> Migration Registry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {migrationStatus?.migrations.map(m => (
                    <div key={m.version} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`migration-row-${m.version}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{m.version}</span>
                          <span className="font-medium">{m.name}</span>
                          {m.applied ? (
                            <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" />Applied</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                        {m.appliedAt && <p className="text-xs text-muted-foreground">Applied: {formatDate(m.appliedAt)}</p>}
                      </div>
                      <div className="flex gap-2">
                        {!m.applied && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleDryRun(m.version)} disabled={actionLoading !== null} data-testid={`button-dryrun-${m.version}`}>
                              {actionLoading === `dry-${m.version}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 mr-1" />}
                              Dry Run
                            </Button>
                            <Button size="sm" onClick={() => handleExecute(m.version)} disabled={actionLoading !== null} data-testid={`button-execute-${m.version}`}>
                              {actionLoading === `exec-${m.version}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
                              Execute
                            </Button>
                          </>
                        )}
                        {m.applied && (
                          <Button size="sm" variant="destructive" onClick={() => handleRollback(m.version)} disabled={actionLoading !== null} data-testid={`button-rollback-${m.version}`}>
                            {actionLoading === `roll-${m.version}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-1" />}
                            Rollback
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!migrationStatus?.migrations || migrationStatus.migrations.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No migrations registered</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {dryRunResult && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Eye className="w-5 h-5" /> Dry Run Result: {dryRunResult.version} - {dryRunResult.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Direction:</span> <span className="font-medium">{dryRunResult.direction}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Validation:</span> {dryRunResult.validationPassed ?
                        <Badge className="bg-green-100 text-green-800">Passed</Badge> :
                        <Badge className="bg-red-100 text-red-800">Failed</Badge>
                      }
                    </div>
                    <div>
                      <span className="text-muted-foreground">Breaking Change:</span> {dryRunResult.breakingChange ?
                        <Badge className="bg-red-100 text-red-800">Yes</Badge> :
                        <Badge className="bg-green-100 text-green-800">No</Badge>
                      }
                    </div>
                    <div>
                      <span className="text-muted-foreground">Affected Tables:</span>{" "}
                      {dryRunResult.estimatedAffectedTables.map(t => (
                        <Badge key={t} variant="outline" className="mr-1">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  {dryRunResult.validationMessage && (
                    <div className="text-sm p-2 bg-white rounded border">{dryRunResult.validationMessage}</div>
                  )}
                  {dryRunResult.currentSchemaConflicts.length > 0 && (
                    <div className="text-sm p-2 bg-red-50 rounded border border-red-200">
                      <strong className="text-red-700">Conflicts:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {dryRunResult.currentSchemaConflicts.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">SQL to execute:</p>
                    <pre className="bg-white p-3 rounded border text-xs overflow-x-auto whitespace-pre-wrap" data-testid="text-dryrun-sql">{dryRunResult.sql}</pre>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setDryRunResult(null)} data-testid="button-dismiss-dryrun">Dismiss</Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Migration Audit Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Version</th>
                        <th className="text-left py-2 px-2">Name</th>
                        <th className="text-left py-2 px-2">Direction</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-left py-2 px-2">Dry Run</th>
                        <th className="text-left py-2 px-2">Duration</th>
                        <th className="text-left py-2 px-2">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.map(entry => (
                        <tr key={entry.id} className="border-b hover:bg-muted/50" data-testid={`audit-row-${entry.id}`}>
                          <td className="py-2 px-2 font-mono">{entry.version}</td>
                          <td className="py-2 px-2">{entry.name}</td>
                          <td className="py-2 px-2">
                            <Badge variant="outline">{entry.direction}</Badge>
                          </td>
                          <td className="py-2 px-2">{statusBadge(entry.status)}</td>
                          <td className="py-2 px-2">{entry.dryRun ? "Yes" : "No"}</td>
                          <td className="py-2 px-2">{entry.durationMs ? `${entry.durationMs}ms` : "-"}</td>
                          <td className="py-2 px-2 text-xs">{formatDate(entry.executedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {auditLog.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No audit log entries</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "cleanup" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: "orphaned", label: "Orphaned Content", icon: Trash2, desc: "Remove content without parent references" },
                { type: "broken_refs", label: "Broken References", icon: Search, desc: "Detect and flag broken cross-references" },
                { type: "stale_backups", label: "Stale Backups", icon: Clock, desc: "Flag old snapshots and revisions" },
                { type: "cache_purge", label: "Cache Purge", icon: RefreshCw, desc: "Clean abandoned sessions and stale data" },
              ].map(item => (
                <Card key={item.type}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleCleanup(item.type)}
                      disabled={actionLoading !== null}
                      data-testid={`button-cleanup-${item.type}`}
                    >
                      {actionLoading === `cleanup-${item.type}` ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      Run Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleCleanup("full")} disabled={actionLoading !== null} data-testid="button-cleanup-full">
                {actionLoading === "cleanup-full" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Run Full Cleanup
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Cleanup Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cleanupReports.map(report => (
                    <CleanupReportCard key={report.id} report={report} />
                  ))}
                  {cleanupReports.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No cleanup reports yet. Run a cleanup to get started.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "compatibility" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Schema Version Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Content tables track schema versions to ensure backward compatibility. Older content is automatically
                  transformed to the current format when read.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Table</th>
                        <th className="text-left py-2 px-2">Current Version</th>
                        <th className="text-left py-2 px-2">Records by Version</th>
                        <th className="text-left py-2 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemaStats?.tables.map(table => {
                        const allCurrent = Object.keys(table.recordsByVersion).every(
                          v => parseInt(v) >= table.currentVersion
                        );
                        return (
                          <tr key={table.tableName} className="border-b" data-testid={`schema-row-${table.tableName}`}>
                            <td className="py-2 px-2 font-mono">{table.tableName}</td>
                            <td className="py-2 px-2">v{table.currentVersion}</td>
                            <td className="py-2 px-2">
                              {Object.entries(table.recordsByVersion).map(([version, count]) => (
                                <Badge key={version} variant="outline" className="mr-1">
                                  v{version}: {count}
                                </Badge>
                              ))}
                              {Object.keys(table.recordsByVersion).length === 0 && (
                                <span className="text-muted-foreground">No records</span>
                              )}
                            </td>
                            <td className="py-2 px-2">
                              {allCurrent ? (
                                <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" />Current</Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-800"><AlertTriangle className="w-3 h-3 mr-1" />Mixed</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {(!schemaStats?.tables || schemaStats.tables.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No schema version data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function CleanupReportCard({ report }: { report: CleanupReport }) {
  const [expanded, setExpanded] = useState(false);

  const typeLabels: Record<string, string> = {
    orphaned_content: "Orphaned Content",
    broken_references: "Broken References",
    stale_backups: "Stale Backups",
    cache_purge: "Cache Purge",
    full: "Full Cleanup",
  };

  return (
    <div className="border rounded-lg p-3" data-testid={`cleanup-report-${report.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{typeLabels[report.runType] || report.runType}</span>
          {statusBadge(report.status)}
          {report.durationMs && <span className="text-xs text-muted-foreground">{report.durationMs}ms</span>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Scanned: <strong>{report.itemsScanned}</strong></span>
          <span className="text-green-600">Cleaned: <strong>{report.itemsCleaned}</strong></span>
          <span className="text-amber-600">Flagged: <strong>{report.itemsFlagged}</strong></span>
          <span className="text-xs text-muted-foreground">{formatDate(report.startedAt)}</span>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)} data-testid={`button-expand-${report.id}`}>
            {expanded ? "Hide" : "Details"}
          </Button>
        </div>
      </div>
      {report.errorMessage && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">{report.errorMessage}</div>
      )}
      {expanded && report.details.length > 0 && (
        <div className="mt-3 space-y-1">
          {report.details.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-xs p-1.5 bg-muted/50 rounded">
              {d.action === "removed" && <XCircle className="w-3 h-3 text-red-500" />}
              {d.action === "flagged" && <AlertTriangle className="w-3 h-3 text-amber-500" />}
              {d.action === "repaired" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
              {d.action === "skipped" && <Clock className="w-3 h-3 text-gray-500" />}
              <Badge variant="outline" className="text-xs">{d.category}</Badge>
              <span className="text-muted-foreground">{d.description}</span>
            </div>
          ))}
        </div>
      )}
      {expanded && report.details.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">No details available</p>
      )}
    </div>
  );
}
