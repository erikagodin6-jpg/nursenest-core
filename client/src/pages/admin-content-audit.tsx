import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, CheckCircle, AlertTriangle, XCircle, AlertOctagon,
  Filter, ExternalLink, RefreshCw, Download, Wand2, Image,
  BookOpen, FileWarning, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useI18n } from "@/lib/i18n";
interface AuditLesson {
  id: string;
  title: string;
  slug: string;
  tier: string;
  status: string;
  category: string;
  bodySystem: string;
  hasSummary: boolean;
  hasTitle: boolean;
  hasSlug: boolean;
  contentLength: number;
  blockCount: number;
  completeness: string;
  updatedAt: string;
  publishedAt: string;
}

interface TierSummary {
  tier: string;
  total: number;
  complete: number;
  partial: number;
  empty: number;
  broken: number;
  placeholder: number;
}

interface TierMessagingCheck {
  component: string;
  status: "pass" | "fail" | "warn";
  detail: string;
}

interface TierMessagingAudit {
  tier: string;
  checks: TierMessagingCheck[];
  overall: "pass" | "fail" | "warn";
}

interface ContentIntegrityOverview {
  rationales: {
    missingCount: number;
    byTier: Record<string, number>;
    byIssue: Record<string, number>;
    severity: string;
  };
  images: {
    requiredMissing: number;
    requiredFormats: Record<string, number>;
    recommendedMissing: number;
    recommendedFormats: Record<string, number>;
    optionalMissing: number;
    optionalFormats: Record<string, number>;
  };
  flashcardGaps: {
    totalGaps: number;
    affectedTiers: Record<string, number>;
    topPriority: Array<{ tier: string; topic: string; questionCount: number; flashcardCount: number; gap: number }>;
  };
  generatedAt: string;
}

interface RationaleAudit {
  total: number;
  byTier: Record<string, number>;
  byIssue: Record<string, number>;
  questions: Array<{
    id: string;
    tier: string;
    stem: string;
    questionType: string;
    rationale: string | null;
    rationaleIssue: string;
    topic: string | null;
    bodySystem: string | null;
  }>;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  rpn: "RPN",
  rn: "RN",
  np: "NP",
};

const TIER_EXAM_LABELS: Record<string, string> = {
  rpn: "REx-PN",
  rn: "NCLEX-RN",
  np: "NP Board Prep",
};

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  complete: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  partial: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  empty: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  broken: { icon: AlertOctagon, color: "text-red-800", bg: "bg-red-100" },
  placeholder: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
};

const OVERALL_ICON: Record<string, typeof CheckCircle> = {
  pass: CheckCircle,
  fail: XCircle,
  warn: AlertTriangle,
};

const OVERALL_COLOR: Record<string, string> = {
  pass: "text-emerald-500",
  fail: "text-red-500",
  warn: "text-amber-500",
};

function getHeaders() {

  const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
  return {
    "Content-Type": "application/json",
    "x-username": creds.username || "",
    "x-password": creds.password || "",
  };
}

export default function AdminContentAudit() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<TierSummary[]>([]);
  const [lessons, setLessons] = useState<AuditLesson[]>([]);
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [messagingAudit, setMessagingAudit] = useState<TierMessagingAudit[]>([]);
  const [remediating, setRemediating] = useState(false);
  const [remediationResult, setRemediationResult] = useState<{ repaired: number; alreadyOk: number; totalNpLessons: number } | null>(null);

  const [integrity, setIntegrity] = useState<ContentIntegrityOverview | null>(null);
  const [integrityLoading, setIntegrityLoading] = useState(true);
  const [rationaleAudit, setRationaleAudit] = useState<RationaleAudit | null>(null);
  const [rationaleFilter, setRationaleFilter] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{ scanned: number; fixed: number; failed: number; skipped: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "rationales" | "images" | "flashcards" | "lessons">("overview");

  const fetchIntegrity = async () => {
    setIntegrityLoading(true);
    try {
      const res = await fetch("/api/admin/content-integrity/overview", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIntegrity(data);
      }
    } catch {} finally {
      setIntegrityLoading(false);
    }
  };

  const fetchRationaleAudit = async () => {
    try {
      const res = await fetch("/api/admin/rationale-audit", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setRationaleAudit(data);
      }
    } catch {}
  };

  const generateRationales = async (questionIds?: string[]) => {
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch("/api/admin/rationale-audit/generate", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ questionIds, batchSize: 5 }),
      });
      if (res.ok) {
        const data = await res.json();
        setGenResult(data);
        fetchRationaleAudit();
        fetchIntegrity();
      }
    } catch {} finally {
      setGenerating(false);
    }
  };

  const exportRationaleIssues = () => {
    const headers = getHeaders();
    window.open(`/api/admin/content-integrity/export-rationale-issues?username=${encodeURIComponent(headers["x-username"])}&password=${encodeURIComponent(headers["x-password"])}`);
  };

  const runRemediation = async () => {
    setRemediating(true);
    try {
      const res = await fetch("/api/admin/remediate-np-content", {
        method: "POST",
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setRemediationResult(data);
        fetchAudit();
      }
    } catch {} finally {
      setRemediating(false);
    }
  };

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      const [auditRes, messagingRes] = await Promise.all([
        fetch("/api/admin/content-audit", { headers }),
        fetch("/api/admin/tier-messaging-audit", { headers }),
      ]);
      if (auditRes.ok) {
        const data = await auditRes.json();
        setSummary(data.summary || []);
        setLessons(data.lessons || []);
      }
      if (messagingRes.ok) {
        const msgData = await messagingRes.json();
        setMessagingAudit(msgData.tiers || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
    fetchIntegrity();
    fetchRationaleAudit();
  }, []);

  const filteredLessons = lessons.filter(l => {
    if (tierFilter !== "all" && l.tier !== tierFilter) return false;
    if (statusFilter !== "all" && l.completeness !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.title?.toLowerCase().includes(q) || l.slug?.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredRationales = rationaleAudit?.questions.filter(q => {
    if (rationaleFilter === "all") return true;
    return q.rationaleIssue === rationaleFilter;
  }) || [];

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "rationales" as const, label: `Rationales${integrity?.rationales.missingCount ? ` (${integrity.rationales.missingCount})` : ""}` },
    { id: "images" as const, label: "Images" },
    { id: "flashcards" as const, label: "Flashcard Gaps" },
    { id: "lessons" as const, label: "Lessons" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} data-testid="button-back-admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Admin
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-audit-title">{t("pages.adminContentAudit.contentIntegrityAudit")}</h1>
            <p className="text-sm text-gray-500">{t("pages.adminContentAudit.rationaleCoverageImageAuditFlashcard")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { fetchAudit(); fetchIntegrity(); fetchRationaleAudit(); }} disabled={loading || integrityLoading} data-testid="button-refresh-audit">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading || integrityLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="flex gap-1 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {integrityLoading ? (
              <div className="text-center py-12 text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading content integrity data...
              </div>
            ) : integrity && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-none shadow-sm" data-testid="card-missing-rationales">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${integrity.rationales.missingCount > 0 ? "bg-red-100" : "bg-emerald-100"}`}>
                          <FileWarning className={`w-5 h-5 ${integrity.rationales.missingCount > 0 ? "text-red-600" : "text-emerald-600"}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold" data-testid="text-missing-rationale-count">{integrity.rationales.missingCount}</p>
                          <p className="text-xs text-gray-500">{t("pages.adminContentAudit.missingRationales")}</p>
                        </div>
                      </div>
                      {integrity.rationales.missingCount > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {Object.entries(integrity.rationales.byTier).map(([tier, count]) => (
                            <Badge key={tier} variant="secondary" className="text-[10px]">
                              {(TIER_LABELS[tier] || tier).toUpperCase()}: {count}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm" data-testid="card-required-images">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${integrity.images.requiredMissing > 0 ? "bg-amber-100" : "bg-emerald-100"}`}>
                          <Image className={`w-5 h-5 ${integrity.images.requiredMissing > 0 ? "text-amber-600" : "text-emerald-600"}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold" data-testid="text-required-images-count">{integrity.images.requiredMissing}</p>
                          <p className="text-xs text-gray-500">{t("pages.adminContentAudit.missingRequiredImages")}</p>
                        </div>
                      </div>
                      {integrity.images.requiredMissing > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {Object.entries(integrity.images.requiredFormats).map(([fmt, count]) => (
                            <Badge key={fmt} variant="destructive" className="text-[10px]">
                              {fmt}: {count}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm" data-testid="card-optional-images">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-100">
                          <Image className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold" data-testid="text-optional-images-count">{integrity.images.optionalMissing}</p>
                          <p className="text-xs text-gray-500">{t("pages.adminContentAudit.optionalImagesInfo")}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">{t("pages.adminContentAudit.textonlyFormatsImagesNotRequired")}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm" data-testid="card-flashcard-gaps">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${integrity.flashcardGaps.totalGaps > 0 ? "bg-orange-100" : "bg-emerald-100"}`}>
                          <BookOpen className={`w-5 h-5 ${integrity.flashcardGaps.totalGaps > 0 ? "text-orange-600" : "text-emerald-600"}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold" data-testid="text-flashcard-gap-count">{integrity.flashcardGaps.totalGaps}</p>
                          <p className="text-xs text-gray-500">{t("pages.adminContentAudit.flashcardCoverageGaps")}</p>
                        </div>
                      </div>
                      {Object.keys(integrity.flashcardGaps.affectedTiers).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {Object.entries(integrity.flashcardGaps.affectedTiers).map(([tier, count]) => (
                            <Badge key={tier} variant="secondary" className="text-[10px]">
                              {(TIER_LABELS[tier] || tier).toUpperCase()}: {count} topics
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {summary.map(s => {
                    const pct = s.total > 0 ? Math.round((s.complete / s.total) * 100) : 0;
                    return (
                      <Card key={s.tier} className="border-none shadow-sm" data-testid={`summary-card-${s.tier}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold flex items-center justify-between">
                            <span>{TIER_LABELS[s.tier] || s.tier}</span>
                            {TIER_EXAM_LABELS[s.tier] && (
                              <Badge variant="secondary" className="text-[10px]">{TIER_EXAM_LABELS[s.tier]}</Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-gray-900 mb-1">{s.total}</div>
                          <div className="text-sm text-gray-500 mb-3">{t("pages.adminContentAudit.totalLessons")}</div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-gray-600">Complete: {s.complete}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-gray-600">Partial: {s.partial}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-gray-600">Empty: {s.empty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-800" />
                              <span className="text-gray-600">Broken: {s.broken}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "rationales" && (
          <div className="space-y-6">
            <Card className="border-none shadow-sm" data-testid="rationale-remediation-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t("pages.adminContentAudit.missingRationales2")}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportRationaleIssues} data-testid="button-export-rationales">
                      <Download className="w-4 h-4 mr-1" />
                      Export CSV
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => generateRationales()}
                      disabled={generating}
                      data-testid="button-generate-rationales"
                    >
                      <Wand2 className={`w-4 h-4 mr-1 ${generating ? "animate-spin" : ""}`} />
                      {generating ? "Generating..." : "Auto-Generate Rationales"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {genResult && (
                  <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm" data-testid="gen-result-banner">
                    <span className="font-medium">{t("pages.adminContentAudit.generationResult")}</span>{" "}
                    <span className="text-emerald-600 font-medium">{genResult.fixed} fixed</span>,{" "}
                    <span className="text-red-600 font-medium">{genResult.failed} failed</span>,{" "}
                    <span className="text-gray-600">{genResult.skipped} skipped</span>{" "}
                    out of {genResult.scanned} scanned
                  </div>
                )}

                {integrity && integrity.rationales.missingCount > 0 && (
                  <div className="mb-4 grid grid-cols-3 gap-3">
                    {Object.entries(integrity.rationales.byIssue).map(([issue, count]) => (
                      <div key={issue} className="p-3 rounded-lg bg-gray-50 border">
                        <p className="text-lg font-bold">{count}</p>
                        <p className="text-xs text-gray-500 capitalize">{issue}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select value={rationaleFilter} onValueChange={setRationaleFilter}>
                    <SelectTrigger className="w-40 h-8 text-xs" data-testid="select-rationale-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("pages.adminContentAudit.allIssues")}</SelectItem>
                      <SelectItem value="missing">{t("pages.adminContentAudit.missing")}</SelectItem>
                      <SelectItem value="placeholder">{t("pages.adminContentAudit.placeholder")}</SelectItem>
                      <SelectItem value="short">{t("pages.adminContentAudit.short")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-gray-400">{filteredRationales.length} questions</span>
                </div>

                {rationaleAudit === null ? (
                  <div className="text-center py-8 text-gray-400 text-sm">{t("pages.adminContentAudit.loadingRationaleAuditData")}</div>
                ) : filteredRationales.length === 0 ? (
                  <div className="text-center py-8" data-testid="text-no-rationale-issues">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                    <p className="font-medium text-gray-700">{t("pages.adminContentAudit.allRationalesAreValid")}</p>
                    <p className="text-sm text-gray-500">{t("pages.adminContentAudit.noPublishedQuestionsHaveMissing")}</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b sticky top-0 bg-white">
                      <div className="col-span-4">{t("pages.adminContentAudit.stem")}</div>
                      <div className="col-span-1">{t("pages.adminContentAudit.tier")}</div>
                      <div className="col-span-1">{t("pages.adminContentAudit.type")}</div>
                      <div className="col-span-2">{t("pages.adminContentAudit.issue")}</div>
                      <div className="col-span-2">{t("pages.adminContentAudit.topic")}</div>
                      <div className="col-span-2">{t("pages.adminContentAudit.actions")}</div>
                    </div>
                    {filteredRationales.slice(0, 100).map(q => (
                      <div key={q.id} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-gray-50 rounded-lg" data-testid={`rationale-row-${q.id}`}>
                        <div className="col-span-4 truncate text-xs text-gray-700">{q.stem}</div>
                        <div className="col-span-1">
                          <Badge variant="outline" className="text-[10px]">{(TIER_LABELS[q.tier] || q.tier).toUpperCase()}</Badge>
                        </div>
                        <div className="col-span-1 text-[10px] text-gray-500">{q.questionType}</div>
                        <div className="col-span-2">
                          <Badge variant={q.rationaleIssue === "missing" ? "destructive" : "secondary"} className="text-[10px]">
                            {q.rationaleIssue}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-[10px] text-gray-500 truncate">{q.topic || "-"}</div>
                        <div className="col-span-2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            onClick={() => generateRationales([q.id])}
                            disabled={generating}
                            data-testid={`button-gen-${q.id}`}
                          >
                            <Wand2 className="w-3 h-3 mr-1" />
                            Fix
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredRationales.length > 100 && (
                      <p className="text-center text-xs text-gray-400 py-2">Showing first 100 of {filteredRationales.length}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-6">
            <Card className="border-none shadow-sm" data-testid="image-audit-card">
              <CardHeader>
                <CardTitle className="text-base">{t("pages.adminContentAudit.imageAudit")}</CardTitle>
              </CardHeader>
              <CardContent>
                {integrity ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-800">{t("pages.adminContentAudit.requiredHigh")}</span>
                        </div>
                        <p className="text-2xl font-bold text-red-700 mb-2" data-testid="text-required-image-detail">{integrity.images.requiredMissing}</p>
                        <p className="text-xs text-red-600 mb-3">{t("pages.adminContentAudit.imagedependentFormatsHotspotInstrumentidE")}</p>
                        {Object.keys(integrity.images.requiredFormats).length > 0 && (
                          <div className="space-y-1">
                            {Object.entries(integrity.images.requiredFormats).map(([fmt, count]) => (
                              <div key={fmt} className="flex justify-between text-xs">
                                <span className="text-red-700">{fmt}</span>
                                <span className="font-medium text-red-800">{count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {integrity.images.requiredMissing === 0 && (
                          <div className="flex items-center gap-1 text-emerald-600 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            All clear
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-5 h-5 text-amber-600" />
                          <span className="font-semibold text-amber-800">{t("pages.adminContentAudit.recommendedLow")}</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-700 mb-2" data-testid="text-recommended-image-detail">{integrity.images.recommendedMissing || 0}</p>
                        <p className="text-xs text-amber-600 mb-3">{t("pages.adminContentAudit.nonstandardFormatsThatCouldBenefit")}</p>
                        {integrity.images.recommendedFormats && Object.keys(integrity.images.recommendedFormats).length > 0 && (
                          <div className="space-y-1">
                            {Object.entries(integrity.images.recommendedFormats).slice(0, 10).map(([fmt, count]) => (
                              <div key={fmt} className="flex justify-between text-xs">
                                <span className="text-amber-700">{fmt}</span>
                                <span className="font-medium text-amber-800">{count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">{t("pages.adminContentAudit.optionalInfo")}</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700 mb-2" data-testid="text-optional-image-detail">{integrity.images.optionalMissing}</p>
                        <p className="text-xs text-blue-600 mb-3">{t("pages.adminContentAudit.textonlyFormatsMcqSataEtc")}</p>
                        {Object.keys(integrity.images.optionalFormats).length > 0 && (
                          <div className="space-y-1">
                            {Object.entries(integrity.images.optionalFormats).slice(0, 10).map(([fmt, count]) => (
                              <div key={fmt} className="flex justify-between text-xs">
                                <span className="text-blue-700">{fmt}</span>
                                <span className="font-medium text-blue-800">{count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">{t("pages.adminContentAudit.loadingImageAudit")}</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <Card className="border-none shadow-sm" data-testid="flashcard-gap-card">
              <CardHeader>
                <CardTitle className="text-base">{t("pages.adminContentAudit.flashcardCoverageGaps2")}</CardTitle>
              </CardHeader>
              <CardContent>
                {integrity ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm text-orange-800 mb-2">
                        <span className="font-bold">{integrity.flashcardGaps.totalGaps}</span> topics with published questions have zero flashcard coverage.
                        Flashcard generation for these topics is queued for the next remediation phase.
                      </p>
                      {Object.keys(integrity.flashcardGaps.affectedTiers).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(integrity.flashcardGaps.affectedTiers).map(([tier, count]) => (
                            <Badge key={tier} variant="secondary" className="text-xs">
                              {(TIER_LABELS[tier] || tier).toUpperCase()}: {count} topics
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {integrity.flashcardGaps.topPriority.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t("pages.adminContentAudit.topPriorityGapsByQuestion")}</h3>
                        <div className="space-y-1">
                          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b">
                            <div className="col-span-2">{t("pages.adminContentAudit.tier2")}</div>
                            <div className="col-span-5">{t("pages.adminContentAudit.topic2")}</div>
                            <div className="col-span-2">{t("pages.adminContentAudit.questions")}</div>
                            <div className="col-span-3">{t("pages.adminContentAudit.flashcards")}</div>
                          </div>
                          {integrity.flashcardGaps.topPriority.map((gap, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-gray-50 rounded-lg" data-testid={`flashcard-gap-row-${idx}`}>
                              <div className="col-span-2">
                                <Badge variant="outline" className="text-[10px]">{(TIER_LABELS[gap.tier] || gap.tier).toUpperCase()}</Badge>
                              </div>
                              <div className="col-span-5 text-xs text-gray-700 truncate">{gap.topic}</div>
                              <div className="col-span-2 text-xs text-gray-500">{gap.questionCount}</div>
                              <div className="col-span-3">
                                <Badge variant="destructive" className="text-[10px]">{t("pages.adminContentAudit.0Cards")}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">{t("pages.adminContentAudit.loadingFlashcardGapAnalysis")}</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="space-y-6">
            <Card className="border-none shadow-sm mb-8" data-testid="tier-messaging-audit">
              <CardHeader>
                <CardTitle className="text-base">{t("pages.adminContentAudit.tierLandingPageMessagingAudit")}</CardTitle>
              </CardHeader>
              <CardContent>
                {messagingAudit.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">{t("pages.adminContentAudit.loadingMessagingAudit")}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {messagingAudit.map(audit => {
                      const OverallIcon = OVERALL_ICON[audit.overall] || CheckCircle;
                      const overallColor = OVERALL_COLOR[audit.overall] || "text-gray-500";
                      return (
                        <div key={audit.tier} className="p-4 rounded-xl bg-gray-50 border border-gray-100" data-testid={`messaging-audit-${audit.tier}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <OverallIcon className={`w-4 h-4 ${overallColor}`} />
                            <span className="text-sm font-semibold">{TIER_LABELS[audit.tier] || audit.tier}</span>
                            <Badge variant={audit.overall === "pass" ? "secondary" : "destructive"} className="text-[10px] ml-auto">
                              {audit.overall.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            Expected exam label: <span className="font-medium">{TIER_EXAM_LABELS[audit.tier]}</span>
                          </p>
                          <div className="space-y-1.5">
                            {audit.checks.map((check, idx) => {
                              const CheckIcon = check.status === "pass" ? CheckCircle : check.status === "fail" ? XCircle : AlertTriangle;
                              const checkColor = check.status === "pass" ? "text-emerald-500" : check.status === "fail" ? "text-red-500" : "text-amber-500";
                              return (
                                <div key={idx} className="flex items-start gap-1.5">
                                  <CheckIcon className={`w-3 h-3 mt-0.5 shrink-0 ${checkColor}`} />
                                  <div>
                                    <span className="text-[11px] font-medium text-gray-700">{check.component}</span>
                                    <span className="text-[10px] text-gray-500 block">{check.detail}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm mb-8" data-testid="np-remediation-card">
              <CardHeader>
                <CardTitle className="text-base">{t("pages.adminContentAudit.npContentRemediation")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Scan NP tier lessons in the database and repair any that have incomplete, broken, or placeholder content.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runRemediation}
                    disabled={remediating}
                    data-testid="button-remediate-np"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${remediating ? "animate-spin" : ""}`} />
                    {remediating ? "Remediating..." : "Run NP Remediation"}
                  </Button>
                  {remediationResult && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{remediationResult.totalNpLessons}</span> NP lessons scanned,{" "}
                      <span className="font-medium text-emerald-600">{remediationResult.repaired}</span> repaired,{" "}
                      <span className="font-medium">{remediationResult.alreadyOk}</span> already OK
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <CardTitle className="text-base flex-1">Lesson Details ({filteredLessons.length})</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </div>
                    <Select value={tierFilter} onValueChange={setTierFilter}>
                      <SelectTrigger className="w-28 h-8 text-xs" data-testid="select-tier-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.adminContentAudit.allTiers")}</SelectItem>
                        <SelectItem value="free">{t("pages.adminContentAudit.free")}</SelectItem>
                        <SelectItem value="rpn">RPN</SelectItem>
                        <SelectItem value="rn">RN</SelectItem>
                        <SelectItem value="np">NP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32 h-8 text-xs" data-testid="select-status-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.adminContentAudit.allStatus")}</SelectItem>
                        <SelectItem value="complete">{t("pages.adminContentAudit.complete")}</SelectItem>
                        <SelectItem value="partial">{t("pages.adminContentAudit.partial")}</SelectItem>
                        <SelectItem value="empty">{t("pages.adminContentAudit.empty")}</SelectItem>
                        <SelectItem value="broken">{t("pages.adminContentAudit.broken")}</SelectItem>
                        <SelectItem value="placeholder">{t("pages.adminContentAudit.placeholder2")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t("pages.adminContentAudit.searchLessons")}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-48 h-8 text-xs"
                      data-testid="input-search-lessons"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-gray-400">{t("pages.adminContentAudit.loadingAuditData")}</div>
                ) : filteredLessons.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">{t("pages.adminContentAudit.noLessonsMatchCurrentFilters")}</div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b">
                      <div className="col-span-4">{t("pages.adminContentAudit.title")}</div>
                      <div className="col-span-1">{t("pages.adminContentAudit.tier3")}</div>
                      <div className="col-span-2">{t("pages.adminContentAudit.status")}</div>
                      <div className="col-span-1">{t("pages.adminContentAudit.blocks")}</div>
                      <div className="col-span-1">{t("pages.adminContentAudit.length")}</div>
                      <div className="col-span-2">{t("pages.adminContentAudit.updated")}</div>
                      <div className="col-span-1">{t("pages.adminContentAudit.action")}</div>
                    </div>
                    {filteredLessons.map(l => {
                      const cfg = STATUS_CONFIG[l.completeness] || STATUS_CONFIG.empty;
                      const StatusIcon = cfg.icon;
                      return (
                        <div key={l.id} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-gray-50 rounded-lg transition-colors" data-testid={`audit-row-${l.id}`}>
                          <div className="col-span-4 truncate text-sm font-medium text-gray-800">{l.title}</div>
                          <div className="col-span-1">
                            <Badge variant="outline" className="text-[10px]">{TIER_LABELS[l.tier] || l.tier}</Badge>
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {l.completeness}
                            </span>
                          </div>
                          <div className="col-span-1 text-xs text-gray-500">{l.blockCount}</div>
                          <div className="col-span-1 text-xs text-gray-500">{l.contentLength > 1000 ? `${Math.round(l.contentLength / 1000)}k` : l.contentLength}</div>
                          <div className="col-span-2 text-xs text-gray-400">{l.updatedAt ? new Date(l.updatedAt).toLocaleDateString() : "-"}</div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setLocation(`/admin/content-manager?edit=${l.id}`)}
                              data-testid={`button-edit-${l.id}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
