import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnvironmentBadge } from "@/components/environment-badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { ClipboardList, RefreshCw, Filter, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface AuditEntry {
  id: string;
  actor_id: string | null;
  actor_username: string | null;
  selected_target: string;
  actual_environment: string;
  actual_db_fingerprint: string | null;
  content_type: string;
  entity_id: string | null;
  item_count: number;
  action_type: string;
  provider_model: string | null;
  approval_state: string | null;
  write_summary: string | null;
  success: boolean;
  failure_reason: string | null;
  mismatch_reason: string | null;
  block_reason: string | null;
  dry_run: boolean;
  created_at: string;
}

export default function AdminEnvironmentAudit() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetFilter, setTargetFilter] = useState("");
  const [successFilter, setSuccessFilter] = useState("");

  useEffect(() => {
    if (!user || user.tier !== "admin") {
      navigate("/");
      return;
    }
    fetchAuditLog();
  }, [user, targetFilter, successFilter]);

  async function fetchAuditLog() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (targetFilter) params.set("target", targetFilter);
      if (successFilter) params.set("success", successFilter);
      const res = await fetch(`/api/admin/environment/audit-log?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data.entries || []);
      setTotal(data.total || 0);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-audit-title">{t("pages.adminEnvironmentAudit.environmentWriteAuditLog")}</h1>
              <p className="text-sm text-gray-500">{t("pages.adminEnvironmentAudit.everyGenerationEditPublishAnd")}</p>
            </div>
          </div>
          <EnvironmentBadge />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
              <Button variant="outline" size="sm" onClick={fetchAuditLog} data-testid="button-refresh">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">{t("pages.adminEnvironmentAudit.target")}</label>
                <select
                  value={targetFilter}
                  onChange={(e) => setTargetFilter(e.target.value)}
                  className="ml-2 px-2 py-1 border rounded text-sm"
                  data-testid="filter-target"
                >
                  <option value="">{t("pages.adminEnvironmentAudit.all")}</option>
                  <option value="development">{t("pages.adminEnvironmentAudit.development")}</option>
                  <option value="staging">{t("pages.adminEnvironmentAudit.staging")}</option>
                  <option value="production">{t("pages.adminEnvironmentAudit.production")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t("pages.adminEnvironmentAudit.status")}</label>
                <select
                  value={successFilter}
                  onChange={(e) => setSuccessFilter(e.target.value)}
                  className="ml-2 px-2 py-1 border rounded text-sm"
                  data-testid="filter-success"
                >
                  <option value="">{t("pages.adminEnvironmentAudit.all2")}</option>
                  <option value="true">{t("pages.adminEnvironmentAudit.success")}</option>
                  <option value="false">{t("pages.adminEnvironmentAudit.failedblocked")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Entries ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500" data-testid="text-loading">{t("pages.adminEnvironmentAudit.loadingAuditLog")}</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500" data-testid="text-empty">{t("pages.adminEnvironmentAudit.noAuditEntriesFound")}</div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg border ${
                      entry.success
                        ? "border-green-200 bg-green-50"
                        : entry.block_reason
                          ? "border-orange-200 bg-orange-50"
                          : "border-red-200 bg-red-50"
                    }`}
                    data-testid={`audit-entry-${entry.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {entry.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : entry.block_reason ? (
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">{entry.action_type}</span>
                        <Badge
                          className={
                            entry.selected_target === "production"
                              ? "bg-red-600 text-white"
                              : entry.selected_target === "staging"
                                ? "bg-yellow-500 text-black"
                                : "bg-green-600 text-white"
                          }
                        >
                          {entry.selected_target.toUpperCase()}
                        </Badge>
                        {entry.dry_run && (
                          <Badge className="bg-blue-100 text-blue-700">{t("pages.adminEnvironmentAudit.dryRun")}</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">{t("pages.adminEnvironmentAudit.actor")}</span> {entry.actor_username || "system"}
                      </div>
                      <div>
                        <span className="font-medium">{t("pages.adminEnvironmentAudit.content")}</span> {entry.content_type}
                      </div>
                      <div>
                        <span className="font-medium">{t("pages.adminEnvironmentAudit.items")}</span> {entry.item_count}
                      </div>
                      <div>
                        <span className="font-medium">{t("pages.adminEnvironmentAudit.environment")}</span> {entry.actual_environment}
                      </div>
                      {entry.provider_model && (
                        <div>
                          <span className="font-medium">{t("pages.adminEnvironmentAudit.model")}</span> {entry.provider_model}
                        </div>
                      )}
                      {entry.actual_db_fingerprint && (
                        <div>
                          <span className="font-medium">{t("pages.adminEnvironmentAudit.db")}</span>{" "}
                          <span className="font-mono">{entry.actual_db_fingerprint.substring(0, 8)}</span>
                        </div>
                      )}
                    </div>
                    {entry.write_summary && (
                      <p className="mt-1 text-xs text-gray-500">{entry.write_summary}</p>
                    )}
                    {entry.failure_reason && (
                      <p className="mt-1 text-xs text-red-600">
                        Failure: {entry.failure_reason}
                      </p>
                    )}
                    {entry.block_reason && (
                      <p className="mt-1 text-xs text-orange-600">
                        Blocked: {entry.block_reason}
                      </p>
                    )}
                    {entry.mismatch_reason && (
                      <p className="mt-1 text-xs text-yellow-600">
                        Mismatch: {entry.mismatch_reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
