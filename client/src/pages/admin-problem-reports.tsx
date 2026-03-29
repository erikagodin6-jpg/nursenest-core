import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { adminFetch } from "@/lib/admin-fetch";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bug, Filter, RefreshCw, ExternalLink, X, Save,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Clock, XCircle, Eye, Image as ImageIcon, MessageCircle, Trash2, ShieldCheck,
} from "lucide-react";

const PROBLEM_TYPE_LABELS: Record<string, string> = {
  incorrect_info: "Incorrect information",
  question_error: "Question error",
  explanation_unclear: "Explanation unclear",
  broken_link: "Broken link",
  translation_issue: "Translation issue",
  technical_problem: "Technical problem",
  typo_grammar: "Typo or grammar mistake",
  other: "Other",
  broken_link_legacy: "Broken link / 404",
  empty_lesson: "Empty lesson / missing content",
  wrong_answer: "Wrong answer / rationale issue",
  typo: "Typo / grammar",
  layout: "Page layout problem",
  exam_wont_start: "Exam won't start",
  flashcards_broken: "Flashcards missing / broken",
  payment: "Payment / subscription issue",
  translation: "Translation issue",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700", icon: AlertTriangle },
  in_review: { label: "In Review", color: "bg-yellow-100 text-yellow-700", icon: Eye },
  fixed: { label: "Fixed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  dismissed: { label: "Dismissed", color: "bg-gray-100 text-gray-600", icon: XCircle },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  high: { label: "High", color: "bg-red-100 text-red-700" },
};

function formatDate(d: string | null) {

  if (!d) return "—";
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function AdminProblemReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  async function fetchReports() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.set("problemType", filterType);
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterSection !== "all") params.set("siteSection", filterSection);
      if (filterTier !== "all") params.set("tier", filterTier);
      if (filterStartDate) params.set("startDate", filterStartDate);
      if (filterEndDate) params.set("endDate", filterEndDate);
      const res = await adminFetch(`/api/admin/problem-reports?${params.toString()}`);
      if (res.ok) {
        setReports(await res.json());
      }
    } catch {
      toast({ title: "Failed to load reports", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [filterType, filterStatus, filterSection, filterTier, filterStartDate, filterEndDate]);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    try {
      const res = await adminFetch(`/api/admin/problem-reports/${id}`, {
        method: "PATCH",
        body: { status },
      });
      if (res.ok) {
        const updated = await res.json();
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        if (selectedReport?.id === id) setSelectedReport(updated);
        toast({ title: `Status updated to ${STATUS_CONFIG[status]?.label || status}` });
      }
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  }

  async function saveNotes(id: string) {
    setSavingId(id);
    try {
      const res = await adminFetch(`/api/admin/problem-reports/${id}`, {
        method: "PATCH",
        body: { adminNotes: editingNotes },
      });
      if (res.ok) {
        const updated = await res.json();
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        setSelectedReport(updated);
        toast({ title: "Notes saved" });
      }
    } catch {
      toast({ title: "Failed to save notes", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  }

  const [flaggedComments, setFlaggedComments] = useState<any[]>([]);
  const [flaggedLoading, setFlaggedLoading] = useState(false);
  const [showFlagged, setShowFlagged] = useState(false);

  async function fetchFlaggedComments() {
    setFlaggedLoading(true);
    try {
      const res = await adminFetch("/api/admin/flagged-comments");
      if (res.ok) {
        setFlaggedComments(await res.json());
      }
    } catch {
      toast({ title: "Failed to load flagged comments", variant: "destructive" });
    } finally {
      setFlaggedLoading(false);
    }
  }

  async function handleFlaggedAction(commentId: string, action: "dismiss" | "delete") {
    try {
      const res = await adminFetch(`/api/admin/flagged-comments/${commentId}`, {
        method: "PATCH",
        body: { action },
      });
      if (res.ok) {
        setFlaggedComments(prev => prev.filter(c => c.id !== commentId));
        toast({ title: action === "delete" ? "Comment deleted" : "Comment restored" });
      }
    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
  }

  const statusCounts = reports.reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <SEO title={t("pages.adminProblemReports.problemReportsAdmin")} />
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-4 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bug className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold" data-testid="text-page-title">{t("pages.adminProblemReports.problemReports")}</h1>
              <Badge variant="secondary" data-testid="text-report-count">{reports.length}</Badge>
            </div>
            <Button onClick={fetchReports} variant="outline" size="sm" data-testid="button-refresh-reports">
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus(filterStatus === key ? "all" : key)} data-testid={`card-status-${key}`}>
                  <CardContent className="p-3 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="text-lg font-bold">{statusCounts[key] || 0}</div>
                      <div className="text-xs text-muted-foreground">{cfg.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 mb-4 flex-wrap">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-52" data-testid="select-filter-type">
                <Filter className="w-3.5 h-3.5 mr-1" />
                <SelectValue placeholder={t("pages.adminProblemReports.problemType2")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pages.adminProblemReports.allTypes")}</SelectItem>
                {Object.entries(PROBLEM_TYPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40" data-testid="select-filter-status">
                <SelectValue placeholder={t("pages.adminProblemReports.status2")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pages.adminProblemReports.allStatuses")}</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                  <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger className="w-44" data-testid="select-filter-section">
                <SelectValue placeholder={t("pages.adminProblemReports.section2")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pages.adminProblemReports.allSections")}</SelectItem>
                <SelectItem value="exam_prep">{t("pages.adminProblemReports.examPrep")}</SelectItem>
                <SelectItem value="new_grad">{t("pages.adminProblemReports.newGrad")}</SelectItem>
                <SelectItem value="career_tools">{t("pages.adminProblemReports.careerTools")}</SelectItem>
                <SelectItem value="allied_health">{t("pages.adminProblemReports.alliedHealth")}</SelectItem>
                <SelectItem value="other">{t("pages.adminProblemReports.other")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-36" data-testid="select-filter-tier">
                <SelectValue placeholder={t("pages.adminProblemReports.tier")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pages.adminProblemReports.allTiers")}</SelectItem>
                <SelectItem value="free">{t("pages.adminProblemReports.free")}</SelectItem>
                <SelectItem value="rpn">RPN</SelectItem>
                <SelectItem value="rn">RN</SelectItem>
                <SelectItem value="np">NP</SelectItem>
                <SelectItem value="allied">{t("pages.adminProblemReports.allied")}</SelectItem>
                <SelectItem value="admin">{t("pages.adminProblemReports.admin")}</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-40"
              placeholder={t("pages.adminProblemReports.startDate")}
              data-testid="input-filter-start-date"
            />
            <Input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-40"
              placeholder={t("pages.adminProblemReports.endDate")}
              data-testid="input-filter-end-date"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className={`${selectedReport ? "lg:col-span-2" : "lg:col-span-3"} space-y-2`}>
              {loading ? (
                <Card><CardContent className="p-8 text-center text-muted-foreground">{t("pages.adminProblemReports.loadingReports")}</CardContent></Card>
              ) : reports.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-muted-foreground" data-testid="text-no-reports">{t("pages.adminProblemReports.noProblemReportsFound")}</CardContent></Card>
              ) : (
                reports.map((report) => {
                  const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.new;
                  const severityCfg = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.medium;
                  const isSelected = selectedReport?.id === report.id;
                  return (
                    <Card
                      key={report.id}
                      className={`cursor-pointer hover:shadow-md transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}
                      onClick={() => {
                        setSelectedReport(report);
                        setEditingNotes(report.adminNotes || "");
                      }}
                      data-testid={`card-report-${report.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge className={statusCfg.color} data-testid={`badge-status-${report.id}`}>{statusCfg.label}</Badge>
                              <Badge variant="outline">{PROBLEM_TYPE_LABELS[report.problemType] || report.problemType}</Badge>
                              <Badge className={severityCfg.color}>{severityCfg.label}</Badge>
                              {report.screenshotUrl && (
                                <Badge variant="outline" className="gap-1">
                                  <ImageIcon className="w-3 h-3" />
                                  Screenshot
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2 mt-1" data-testid={`text-description-${report.id}`}>{report.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{formatDate(report.createdAt)}</span>
                              <span className="truncate max-w-[200px]">{report.pageUrl}</span>
                              {report.siteSection && <span>{report.siteSection}</span>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {selectedReport && (
              <div className="lg:col-span-1">
                <Card className="sticky top-4" data-testid="panel-report-detail">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{t("pages.adminProblemReports.reportDetails")}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)} data-testid="button-close-detail">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.status")}</span>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <Button
                            key={key}
                            size="sm"
                            variant={selectedReport.status === key ? "default" : "outline"}
                            className="text-xs h-7"
                            onClick={() => updateStatus(selectedReport.id, key)}
                            disabled={savingId === selectedReport.id}
                            data-testid={`button-set-status-${key}`}
                          >
                            {cfg.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.problemType")}</span>
                      <p>{PROBLEM_TYPE_LABELS[selectedReport.problemType] || selectedReport.problemType}</p>
                    </div>

                    <div>
                      <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.description")}</span>
                      <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                    </div>

                    {selectedReport.screenshotUrl && (
                      <div>
                        <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.screenshot")}</span>
                        <a
                          href={`/api/object-storage${selectedReport.screenshotUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-1"
                          data-testid="link-screenshot"
                        >
                          <img
                            src={`/api/object-storage${selectedReport.screenshotUrl}`}
                            alt={t("pages.adminProblemReports.reportScreenshot")}
                            className="max-w-full max-h-48 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                            data-testid="img-report-screenshot"
                          />
                        </a>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.pageUrl")}</span>
                      <a
                        href={selectedReport.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 break-all"
                        data-testid="link-page-url"
                      >
                        {selectedReport.pageUrl}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>

                    {selectedReport.pageTitle && (
                      <div>
                        <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.pageTitle")}</span>
                        <p>{selectedReport.pageTitle}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {selectedReport.siteSection && (
                        <div>
                          <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.section")}</span>
                          <p>{selectedReport.siteSection}</p>
                        </div>
                      )}
                      {selectedReport.contentId && (
                        <div>
                          <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.contentId")}</span>
                          <p className="truncate">{selectedReport.contentId}</p>
                        </div>
                      )}
                      {selectedReport.severity && (
                        <div>
                          <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.severity")}</span>
                          <Badge className={SEVERITY_CONFIG[selectedReport.severity]?.color}>{SEVERITY_CONFIG[selectedReport.severity]?.label || selectedReport.severity}</Badge>
                        </div>
                      )}
                      {selectedReport.deviceType && (
                        <div>
                          <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.device")}</span>
                          <p>{selectedReport.deviceType}</p>
                        </div>
                      )}
                    </div>

                    {selectedReport.email && (
                      <div>
                        <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.email")}</span>
                        <p>{selectedReport.email}</p>
                        {selectedReport.contactPermission && <Badge variant="outline" className="mt-1 text-xs">{t("pages.adminProblemReports.canContact")}</Badge>}
                      </div>
                    )}

                    {selectedReport.userId && (
                      <div>
                        <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.userId")}</span>
                        <p className="truncate">{selectedReport.userId}</p>
                      </div>
                    )}

                    {selectedReport.locale && (
                      <div>
                        <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.locale")}</span>
                        <p>{selectedReport.locale}</p>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.submitted")}</span>
                      <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                      <span className="font-medium text-muted-foreground">{t("pages.adminProblemReports.adminNotes")}</span>
                      <Textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder={t("pages.adminProblemReports.addInternalNotes")}
                        rows={3}
                        className="mt-1"
                        data-testid="input-admin-notes"
                      />
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => saveNotes(selectedReport.id)}
                        disabled={savingId === selectedReport.id}
                        data-testid="button-save-notes"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Card data-testid="card-flagged-comments">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-amber-600" />
                    <CardTitle className="text-lg" data-testid="text-flagged-comments-title">{t("pages.adminProblemReports.flaggedComments")}</CardTitle>
                    {flaggedComments.length > 0 && (
                      <Badge variant="destructive" className="text-xs">{flaggedComments.length}</Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setShowFlagged(!showFlagged); if (!showFlagged) fetchFlaggedComments(); }}
                    data-testid="button-toggle-flagged"
                  >
                    {showFlagged ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    {showFlagged ? "Hide" : "Show"}
                  </Button>
                </div>
              </CardHeader>
              {showFlagged && (
                <CardContent className="space-y-3">
                  {flaggedLoading ? (
                    <p className="text-center text-muted-foreground py-4">{t("pages.adminProblemReports.loadingFlaggedComments")}</p>
                  ) : flaggedComments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4" data-testid="text-no-flagged">{t("pages.adminProblemReports.noFlaggedComments")}</p>
                  ) : (
                    flaggedComments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4 bg-amber-50/50" data-testid={`flagged-comment-${comment.id}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.username || "Unknown"}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                              <Badge variant="outline" className="text-xs">Q: {comment.questionId}</Badge>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{comment.thumbsUpCount || 0} upvotes</span>
                              <span>{comment.thumbsDownCount || 0} downvotes</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs gap-1"
                              onClick={() => handleFlaggedAction(comment.id, "dismiss")}
                              data-testid={`button-dismiss-${comment.id}`}
                            >
                              <ShieldCheck className="w-3 h-3" /> Restore
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 text-xs gap-1"
                              onClick={() => handleFlaggedAction(comment.id, "delete")}
                              data-testid={`button-delete-${comment.id}`}
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
