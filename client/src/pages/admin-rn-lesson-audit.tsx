import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  RefreshCw, Search, ArrowLeft, CheckCircle2, AlertTriangle, XCircle,
  FileText, Loader2, Wrench, ExternalLink, Filter, BarChart3
} from "lucide-react";

type LessonAuditEntry = {
  id: string;
  title: string;
  tier: string;
  source: string;
  status: "complete" | "placeholder" | "weak" | "broken";
  cellularLength?: number;
  riskFactorCount?: number;
  diagnosticCount?: number;
  managementCount?: number;
  nursingActionCount?: number;
  assessmentFindingCount?: number;
  medicationCount?: number;
  pearlCount?: number;
  quizCount?: number;
  signsLeftCount?: number;
  signsRightCount?: number;
  hasSeo?: boolean;
  wordCount?: number;
  blockCount?: number;
  dbStatus?: string;
  dbId?: string;
  updatedAt?: string;
  createdAt?: string;
};

type AuditCounts = {
  total: number;
  complete: number;
  placeholder: number;
  weak: number;
  broken: number;
};

type AuditData = {
  staticLessons: LessonAuditEntry[];
  dbLessons: LessonAuditEntry[];
  staticCounts: AuditCounts;
  dbCounts: AuditCounts;
  slugMismatches: {
    inStaticNotDb: string[];
    inDbNotStatic: string[];
  };
  timestamp: string;
};

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  complete: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Complete" },
  placeholder: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Placeholder" },
  weak: { color: "bg-amber-100 text-amber-700", icon: AlertTriangle, label: "Weak" },
  broken: { color: "bg-red-200 text-red-800", icon: XCircle, label: "Broken" },
};

function getCredentials() {

  try {
    return JSON.parse(localStorage.getItem("nursenest-credentials") || "null");
  } catch { return null; }
}

export default function AdminRnLessonAudit() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("static");
  const [repairing, setRepairing] = useState<Set<string>>(new Set());
  const [repairResults, setRepairResults] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || user.tier !== "admin") {
      navigate("/");
      return;
    }
    fetchAudit();
  }, [user]);

  async function fetchAudit() {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      const headers: Record<string, string> = {};
      if (creds) {
        headers["x-username"] = creds.username;
        headers["x-password"] = creds.password;
      }
      const res = await fetch("/api/admin/rn-lesson-audit", { headers });
      if (!res.ok) throw new Error("Failed to load audit data");
      const result = await res.json();
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function repairLesson(slug: string) {
    const creds = getCredentials();
    if (!creds) return;
    setRepairing(prev => new Set(prev).add(slug));
    try {
      const res = await fetch("/api/admin/rn-lesson-repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          slugs: [slug],
        }),
      });
      if (!res.ok) throw new Error("Repair failed");
      const result = await res.json();
      const r = result.results?.[0];
      setRepairResults(prev => ({ ...prev, [slug]: r?.status === "repaired" ? "Repaired" : `Failed: ${r?.error}` }));
    } catch (e: any) {
      setRepairResults(prev => ({ ...prev, [slug]: `Error: ${e.message}` }));
    } finally {
      setRepairing(prev => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    }
  }

  async function batchRepair(slugs: string[]) {
    const creds = getCredentials();
    if (!creds || slugs.length === 0) return;
    const batch = slugs.slice(0, 10);
    for (const slug of batch) {
      setRepairing(prev => new Set(prev).add(slug));
    }
    try {
      const res = await fetch("/api/admin/rn-lesson-repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          slugs: batch,
        }),
      });
      if (!res.ok) throw new Error("Batch repair failed");
      const result = await res.json();
      const newResults: Record<string, string> = {};
      for (const r of result.results || []) {
        newResults[r.slug] = r.status === "repaired" ? "Repaired" : `Failed: ${r.error}`;
      }
      setRepairResults(prev => ({ ...prev, ...newResults }));
    } catch (e: any) {
      for (const slug of batch) {
        setRepairResults(prev => ({ ...prev, [slug]: `Error: ${e.message}` }));
      }
    } finally {
      setRepairing(new Set());
    }
  }

  const currentLessons = useMemo(() => {
    if (!data) return [];
    const source = sourceFilter === "database" ? data.dbLessons : data.staticLessons;
    return source.filter(l => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data, statusFilter, sourceFilter, searchQuery]);

  const currentCounts = sourceFilter === "database" ? data?.dbCounts : data?.staticCounts;

  if (!user || user.tier !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/admin")} data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4 mr-2" /> Admin
            </Button>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminRnLessonAudit.rnLessonContentAudit")}</h1>
          </div>
          <Button onClick={fetchAudit} disabled={loading} variant="outline" className="gap-2" data-testid="button-refresh-audit">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm" data-testid="text-audit-error">{error}</div>
        )}

        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">{t("pages.adminRnLessonAudit.runningAudit")}</span>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card data-testid="card-total">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{currentCounts?.total || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.adminRnLessonAudit.totalRnLessons")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-complete">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{currentCounts?.complete || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.adminRnLessonAudit.complete")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-weak">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{currentCounts?.weak || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.adminRnLessonAudit.weak")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-placeholder">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{currentCounts?.placeholder || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.adminRnLessonAudit.placeholder")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-broken">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-800">{currentCounts?.broken || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.adminRnLessonAudit.broken")}</p>
                </CardContent>
              </Card>
            </div>

            {currentCounts && currentCounts.total > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{t("pages.adminRnLessonAudit.completeness")}</span>
                    <span className="text-sm text-gray-500 ml-auto">{Math.round((currentCounts.complete / currentCounts.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      <div className="bg-green-500 h-full" style={{ width: `${(currentCounts.complete / currentCounts.total) * 100}%` }} />
                      <div className="bg-amber-400 h-full" style={{ width: `${(currentCounts.weak / currentCounts.total) * 100}%` }} />
                      <div className="bg-red-400 h-full" style={{ width: `${(currentCounts.placeholder / currentCounts.total) * 100}%` }} />
                      <div className="bg-red-700 h-full" style={{ width: `${(currentCounts.broken / currentCounts.total) * 100}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(data.slugMismatches.inStaticNotDb.length > 0 || data.slugMismatches.inDbNotStatic.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Slug Mismatches
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {data.slugMismatches.inStaticNotDb.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">In static files but not in DB ({data.slugMismatches.inStaticNotDb.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {data.slugMismatches.inStaticNotDb.slice(0, 20).map(s => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                        {data.slugMismatches.inStaticNotDb.length > 20 && (
                          <Badge variant="outline" className="text-xs">+{data.slugMismatches.inStaticNotDb.length - 20} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {data.slugMismatches.inDbNotStatic.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">In DB but not in static files ({data.slugMismatches.inDbNotStatic.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {data.slugMismatches.inDbNotStatic.slice(0, 20).map(s => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                        {data.slugMismatches.inDbNotStatic.length > 20 && (
                          <Badge variant="outline" className="text-xs">+{data.slugMismatches.inDbNotStatic.length - 20} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                  className="text-sm bg-transparent border-none outline-none"
                  data-testid="select-source-filter"
                >
                  <option value="static">{t("pages.adminRnLessonAudit.staticFiles")}</option>
                  <option value="database">{t("pages.adminRnLessonAudit.database")}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm bg-transparent border-none outline-none"
                  data-testid="select-status-filter"
                >
                  <option value="all">{t("pages.adminRnLessonAudit.allStatus")}</option>
                  <option value="complete">{t("pages.adminRnLessonAudit.complete2")}</option>
                  <option value="weak">{t("pages.adminRnLessonAudit.weak2")}</option>
                  <option value="placeholder">{t("pages.adminRnLessonAudit.placeholder2")}</option>
                  <option value="broken">{t("pages.adminRnLessonAudit.broken2")}</option>
                </select>
              </div>

              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t("pages.adminRnLessonAudit.searchLessons")}
                  className="pl-9"
                  data-testid="input-search-lessons"
                />
              </div>

              {statusFilter !== "all" && statusFilter !== "complete" && currentLessons.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-amber-700 border-amber-300"
                  onClick={() => batchRepair(currentLessons.slice(0, 10).map(l => l.id))}
                  disabled={repairing.size > 0}
                  data-testid="button-batch-repair"
                >
                  <Wrench className="w-4 h-4" />
                  Repair First {Math.min(currentLessons.length, 10)}
                </Button>
              )}
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left px-4 py-3 font-medium text-gray-600">{t("pages.adminRnLessonAudit.lesson")}</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">{t("pages.adminRnLessonAudit.tier")}</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">{t("pages.adminRnLessonAudit.status")}</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">{t("pages.adminRnLessonAudit.content")}</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">SEO</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-600">{t("pages.adminRnLessonAudit.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLessons.map(lesson => {
                        const cfg = statusConfig[lesson.status] || statusConfig.broken;
                        const Icon = cfg.icon;
                        return (
                          <tr key={`${lesson.source}-${lesson.id}`} className="border-b hover:bg-gray-50/50" data-testid={`row-lesson-${lesson.id}`}>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900 max-w-xs truncate">{lesson.title}</div>
                              <div className="text-xs text-gray-400 font-mono">{lesson.id}</div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">{lesson.tier}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={`gap-1 ${cfg.color}`}>
                                <Icon className="w-3 h-3" /> {cfg.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {sourceFilter === "static" ? (
                                <div className="text-xs text-gray-500 space-y-0.5">
                                  <div>Body: {lesson.cellularLength || 0} chars</div>
                                  <div>Meds: {lesson.medicationCount || 0} | Quiz: {lesson.quizCount || 0}</div>
                                  <div>Pearls: {lesson.pearlCount || 0} | RF: {lesson.riskFactorCount || 0}</div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 space-y-0.5">
                                  <div>{lesson.wordCount || 0} words | {lesson.blockCount || 0} blocks</div>
                                  <div>DB: {lesson.dbStatus || "unknown"}</div>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {lesson.hasSeo ? (
                                <Badge className="bg-green-100 text-green-700 text-xs">SEO</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-500 text-xs">{t("pages.adminRnLessonAudit.noSeo")}</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center gap-1 justify-end">
                                {repairResults[lesson.id] && (
                                  <span className={`text-xs mr-2 ${repairResults[lesson.id].startsWith("Repaired") ? "text-green-600" : "text-red-600"}`}>
                                    {repairResults[lesson.id]}
                                  </span>
                                )}
                                {lesson.status !== "complete" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-xs"
                                    onClick={() => repairLesson(lesson.id)}
                                    disabled={repairing.has(lesson.id)}
                                    data-testid={`button-repair-${lesson.id}`}
                                  >
                                    {repairing.has(lesson.id) ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Wrench className="w-3 h-3" />
                                    )}
                                    Repair
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                                  data-testid={`button-view-${lesson.id}`}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => navigate(`/content-editor?slug=${encodeURIComponent(lesson.id)}`)}
                                  data-testid={`button-edit-${lesson.id}`}
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {currentLessons.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                            No lessons match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t bg-gray-50/50 text-xs text-gray-500">
                  Showing {currentLessons.length} lessons | Audit timestamp: {data.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
