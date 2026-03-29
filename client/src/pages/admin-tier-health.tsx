import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, XCircle,
  BarChart3, TrendingUp, Layers, Shield, Zap, ExternalLink,
  FileText, Activity, Target, Eye, Clock, Database,
  ChevronDown, ChevronUp, Settings, BookOpen, Sparkles,
} from "lucide-react";
import manifestData from "@/data/career-questions/question-manifest.json";
import type { QuestionManifest, TierQuestionCount } from "@shared/question-manifest";

import { useI18n } from "@/lib/i18n";
const manifest: QuestionManifest = manifestData as QuestionManifest;

type TabId = "overview" | "watchlist" | "alerts" | "ai-pool" | "integrity";

const TIER_DISPLAY_NAMES: Record<string, string> = {
  rn: "RN (NCLEX-RN)",
  rpn: "RPN / LVN",
  np: "Nurse Practitioner",
  preNursing: "Pre-Nursing",
  rrt: "Respiratory Therapist",
  paramedic: "Paramedic",
  pharmacyTech: "Pharmacy Technician",
  mlt: "Medical Lab Tech",
  imaging: "Radiologic Technologist",
  occupationalTherapyAssistant: "OT Assistant (OTA)",
  physiotherapyAssistant: "PT Assistant (PTA)",
  psychotherapist: "Psychotherapist",
  socialWorker: "Social Worker",
  addictionsCounsellor: "Addictions Counsellor",
  surgicalTechnologist: "Surgical Technologist",
  criticalCare: "Critical Care Nursing",
  emergencyNursing: "Emergency Nursing",
  perioperative: "Perioperative Nursing",
  oncologyNursing: "Oncology Nursing",
  pediatricCert: "Pediatric Cert Nursing",
};

const TIER_GROUPS: Record<string, string> = {
  rn: "nursing",
  rpn: "nursing",
  np: "nursing",
  preNursing: "nursing",
  rrt: "allied",
  paramedic: "allied",
  pharmacyTech: "allied",
  mlt: "allied",
  imaging: "allied",
  occupationalTherapyAssistant: "allied",
  physiotherapyAssistant: "allied",
  psychotherapist: "allied",
  socialWorker: "allied",
  addictionsCounsellor: "allied",
  surgicalTechnologist: "allied",
  criticalCare: "cert",
  emergencyNursing: "cert",
  perioperative: "cert",
  oncologyNursing: "cert",
  pediatricCert: "cert",
};

const GROUP_COLORS: Record<string, string> = {
  nursing: "bg-blue-100 text-blue-700",
  allied: "bg-teal-100 text-teal-700",
  cert: "bg-purple-100 text-purple-700",
};

const DEFAULT_LOW_VOLUME_THRESHOLD = 100;

interface TierHealthEntry {
  key: string;
  name: string;
  group: string;
  total: number;
  categoryCount: number;
  formatCount: number;
  fileCount: number;
  byCategory: Record<string, number>;
  byFormat: Record<string, number>;
}

interface WatchlistEntry extends TierHealthEntry {
  score: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  reasons: string[];
  competitiveAppearanceScore: number;
  categoryDepth: number;
}

function getAllTiers(): TierHealthEntry[] {

  const entries: TierHealthEntry[] = [];

  const addEntries = (source: Record<string, TierQuestionCount>) => {
    for (const [key, data] of Object.entries(source)) {
      if (key === "emergencyNursingServerData") continue;
      entries.push({
        key,
        name: TIER_DISPLAY_NAMES[key] || key,
        group: TIER_GROUPS[key] || "other",
        total: data.total,
        categoryCount: Object.keys(data.byCategory).filter(c => c !== "").length,
        formatCount: Object.keys(data.byFormat).length,
        fileCount: data.files.length,
        byCategory: data.byCategory,
        byFormat: data.byFormat,
      });
    }
  };

  addEntries(manifest.static.nursing);
  addEntries(manifest.static.alliedHealth);
  addEntries(manifest.static.nursingCert);

  return entries;
}

function computeWatchlistScore(tier: TierHealthEntry): WatchlistEntry {
  const reasons: string[] = [];
  let score = 0;

  if (tier.total < 50) {
    score += 40;
    reasons.push("Critically low question count (<50)");
  } else if (tier.total < 200) {
    score += 25;
    reasons.push("Low question count (<200)");
  } else if (tier.total < 500) {
    score += 10;
    reasons.push("Below target question count (<500)");
  }

  const categoryDepth = tier.categoryCount;
  if (categoryDepth < 5) {
    score += 20;
    reasons.push("Limited category depth (<5 categories)");
  } else if (categoryDepth < 8) {
    score += 10;
    reasons.push("Moderate category depth (<8 categories)");
  }

  if (tier.formatCount <= 1) {
    score += 15;
    reasons.push("Single question format only");
  }

  const isHighVisibility = ["rn", "rpn", "np", "preNursing", "rrt"].includes(tier.key);
  if (isHighVisibility && tier.total < 1000) {
    score += 15;
    reasons.push("High-visibility tier below 1000 questions");
  }

  const knownWeakTiers = ["socialWorker", "occupationalTherapyAssistant", "physiotherapyAssistant", "preNursing"];
  if (knownWeakTiers.includes(tier.key)) {
    score += 10;
    reasons.push("Known weak/thin tier");
  }

  const competitiveAppearanceScore = Math.min(100, Math.round(
    (Math.min(tier.total, 2000) / 2000) * 40 +
    (Math.min(categoryDepth, 10) / 10) * 30 +
    (Math.min(tier.formatCount, 4) / 4) * 15 +
    (Math.min(tier.fileCount, 10) / 10) * 15
  ));

  let riskLevel: "critical" | "high" | "medium" | "low";
  if (score >= 50) riskLevel = "critical";
  else if (score >= 30) riskLevel = "high";
  else if (score >= 15) riskLevel = "medium";
  else riskLevel = "low";

  return {
    ...tier,
    score,
    riskLevel,
    reasons,
    competitiveAppearanceScore,
    categoryDepth,
  };
}

function getManifestStaleness(): { isStale: boolean; ageHours: number; ageText: string } {
  const generated = new Date(manifest.generatedAt);
  const now = new Date();
  const ageMs = now.getTime() - generated.getTime();
  const ageHours = Math.round(ageMs / (1000 * 60 * 60));
  const ageDays = Math.floor(ageHours / 24);
  const STALE_THRESHOLD_HOURS = 7 * 24;
  return {
    isStale: ageHours > STALE_THRESHOLD_HOURS,
    ageHours,
    ageText: ageDays > 0 ? `${ageDays}d ${ageHours % 24}h ago` : `${ageHours}h ago`,
  };
}

const RISK_COLORS = {
  critical: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const RISK_ICONS = {
  critical: XCircle,
  high: AlertTriangle,
  medium: Activity,
  low: CheckCircle,
};

function TierCountCard({ tier, threshold }: { tier: TierHealthEntry; threshold: number }) {
  const isBelowThreshold = tier.total < threshold;
  const groupColor = GROUP_COLORS[tier.group] || "bg-gray-100 text-gray-700";

  return (
    <Card className={`transition-shadow hover:shadow-md ${isBelowThreshold ? "border-red-200 bg-red-50/30" : ""}`} data-testid={`card-tier-${tier.key}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate" data-testid={`text-tier-name-${tier.key}`}>{tier.name}</h3>
            <Badge className={`text-[10px] mt-1 ${groupColor}`} data-testid={`badge-tier-group-${tier.key}`}>
              {tier.group === "nursing" ? "Nursing" : tier.group === "allied" ? "Allied Health" : "Certification"}
            </Badge>
          </div>
          {isBelowThreshold && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-2" data-testid={`text-tier-count-${tier.key}`}>
          {tier.total.toLocaleString()}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-slate-500">
          <span data-testid={`text-tier-categories-${tier.key}`}>{tier.categoryCount} categories</span>
          <span>{tier.formatCount} format{tier.formatCount !== 1 ? "s" : ""}</span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${isBelowThreshold ? "bg-red-400" : tier.total >= 1000 ? "bg-emerald-500" : "bg-amber-400"}`}
              style={{ width: `${Math.min((tier.total / 2500) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WatchlistRow({ entry, rank }: { entry: WatchlistEntry; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const RiskIcon = RISK_ICONS[entry.riskLevel];

  return (
    <div
      className={`border rounded-lg transition-colors ${expanded ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
      data-testid={`watchlist-row-${entry.key}`}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="w-6 text-center text-xs font-bold text-slate-400" data-testid={`text-watchlist-rank-${entry.key}`}>#{rank}</span>
        <RiskIcon className={`w-4 h-4 flex-shrink-0 ${
          entry.riskLevel === "critical" ? "text-red-500" :
          entry.riskLevel === "high" ? "text-orange-500" :
          entry.riskLevel === "medium" ? "text-yellow-500" : "text-green-500"
        }`} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-800" data-testid={`text-watchlist-name-${entry.key}`}>{entry.name}</span>
        </div>
        <span className="text-sm font-mono font-semibold text-slate-700 w-16 text-right" data-testid={`text-watchlist-count-${entry.key}`}>
          {entry.total.toLocaleString()}
        </span>
        <Badge className={`text-[10px] ${RISK_COLORS[entry.riskLevel]}`} data-testid={`badge-watchlist-risk-${entry.key}`}>
          {entry.riskLevel}
        </Badge>
        <div className="w-12 text-right">
          <span className="text-xs font-mono text-slate-500" data-testid={`text-watchlist-competitive-${entry.key}`}>{entry.competitiveAppearanceScore}%</span>
        </div>
        <span className="text-xs text-slate-400 w-8 text-center">{entry.categoryDepth}</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </div>
      {expanded && (
        <div className="px-3 pb-3 ml-9 space-y-2">
          <div className="flex flex-wrap gap-1">
            {entry.reasons.map((reason, i) => (
              <Badge key={i} variant="outline" className="text-[10px] text-slate-600">
                {reason}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">{t("pages.adminTierHealth.formats")}</span>{" "}
              <span className="text-slate-700">{Object.keys(entry.byFormat).join(", ")}</span>
            </div>
            <div>
              <span className="text-slate-500">{t("pages.adminTierHealth.files")}</span>{" "}
              <span className="text-slate-700">{entry.fileCount}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <a
              href="/admin/question-bank"
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium hover:bg-blue-100 transition"
              data-testid={`link-create-content-${entry.key}`}
            >
              <Zap className="w-3 h-3" /> Generate Questions
            </a>
            <a
              href="/admin/content-analytics"
              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-xs font-medium hover:bg-indigo-100 transition"
              data-testid={`link-analytics-${entry.key}`}
            >
              <BarChart3 className="w-3 h-3" /> Analytics
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendedPriorityCard({ watchlist }: { watchlist: WatchlistEntry[] }) {
  const top = watchlist[0];
  if (!top) return null;

  const RiskIcon = RISK_ICONS[top.riskLevel];

  return (
    <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50" data-testid="card-recommended-priority">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
          <Target className="w-4 h-4" /> Recommended Next-Build Priority
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <RiskIcon className={`w-6 h-6 ${
            top.riskLevel === "critical" ? "text-red-500" : "text-orange-500"
          }`} />
          <div>
            <h3 className="text-lg font-bold text-slate-900" data-testid="text-priority-name">{top.name}</h3>
            <p className="text-xs text-slate-500">
              {top.total} questions across {top.categoryDepth} categories
            </p>
          </div>
          <Badge className={`ml-auto ${RISK_COLORS[top.riskLevel]}`} data-testid="badge-priority-risk">
            Priority Score: {top.score}
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div className="text-center p-2 bg-white/60 rounded-lg">
            <p className="text-xs text-slate-500">{t("pages.adminTierHealth.questions")}</p>
            <p className="text-lg font-bold text-slate-800" data-testid="text-priority-questions">{top.total}</p>
          </div>
          <div className="text-center p-2 bg-white/60 rounded-lg">
            <p className="text-xs text-slate-500">{t("pages.adminTierHealth.competitive")}</p>
            <p className="text-lg font-bold text-slate-800" data-testid="text-priority-competitive">{top.competitiveAppearanceScore}%</p>
          </div>
          <div className="text-center p-2 bg-white/60 rounded-lg">
            <p className="text-xs text-slate-500">{t("pages.adminTierHealth.categories")}</p>
            <p className="text-lg font-bold text-slate-800" data-testid="text-priority-categories">{top.categoryDepth}</p>
          </div>
          <div className="text-center p-2 bg-white/60 rounded-lg">
            <p className="text-xs text-slate-500">{t("pages.adminTierHealth.formats2")}</p>
            <p className="text-lg font-bold text-slate-800" data-testid="text-priority-formats">{top.formatCount}</p>
          </div>
        </div>
        <div className="space-y-1">
          {top.reasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-amber-800">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <a
            href="/admin/question-bank"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 transition"
            data-testid="link-priority-create"
          >
            <Zap className="w-3 h-3" /> Start Building Content
          </a>
          <a
            href="/admin/content-coverage"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-amber-700 border border-amber-300 rounded-md text-xs font-medium hover:bg-amber-50 transition"
            data-testid="link-priority-coverage"
          >
            <Eye className="w-3 h-3" /> View Coverage Map
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminTierHealth() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [threshold, setThreshold] = useState(DEFAULT_LOW_VOLUME_THRESHOLD);
  const [groupFilter, setGroupFilter] = useState<"all" | "nursing" | "allied" | "cert">("all");

  const allTiers = useMemo(() => getAllTiers(), []);
  const staleness = useMemo(() => getManifestStaleness(), []);

  const filteredTiers = useMemo(() => {
    if (groupFilter === "all") return allTiers;
    return allTiers.filter(t => t.group === groupFilter);
  }, [allTiers, groupFilter]);

  const watchlist = useMemo(() => {
    return allTiers
      .map(computeWatchlistScore)
      .sort((a, b) => b.score - a.score);
  }, [allTiers]);

  const lowVolumeTiers = useMemo(() => {
    return allTiers.filter(t => t.total < threshold);
  }, [allTiers, threshold]);

  const uncategorized = useMemo(() => {
    return allTiers.filter(t => {
      const emptyCount = t.byCategory[""] || 0;
      return emptyCount > 0;
    }).map(t => ({
      ...t,
      uncategorizedCount: t.byCategory[""] || 0,
    }));
  }, [allTiers]);

  const { data: aiPoolData } = useQuery({
    queryKey: ["tier-health-ai-pool"],
    queryFn: async () => {
      try {
        const res = await adminFetch("/api/admin/content-analytics");
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const totalQuestions = allTiers.reduce((s, t) => s + t.total, 0);
  const nursingTotal = allTiers.filter(t => t.group === "nursing").reduce((s, t) => s + t.total, 0);
  const alliedTotal = allTiers.filter(t => t.group === "allied").reduce((s, t) => s + t.total, 0);
  const certTotal = allTiers.filter(t => t.group === "cert").reduce((s, t) => s + t.total, 0);

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "watchlist", label: "Expansion Watchlist" },
    { id: "alerts", label: `Alerts (${lowVolumeTiers.length + uncategorized.length + (staleness.isStale ? 1 : 0) + manifest.integrity.parseFailures.length})` },
    { id: "ai-pool", label: "AI Question Pool" },
    { id: "integrity", label: "Integrity" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-1" /> Admin
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900" data-testid="text-page-title">
              Tier Health Dashboard
            </h1>
            {staleness.isStale && (
              <Badge variant="outline" className="text-xs gap-1 border-red-300 text-red-700 bg-red-50" data-testid="badge-stale-warning">
                <AlertTriangle className="w-3 h-3" />
                Stale Data
              </Badge>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href="/admin/content-analytics"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-md text-xs font-medium hover:bg-slate-50 transition"
              data-testid="link-content-analytics"
            >
              <BarChart3 className="w-3 h-3" /> Full Analytics
            </a>
            <a
              href="/admin/content-coverage"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-md text-xs font-medium hover:bg-slate-50 transition"
              data-testid="link-content-coverage"
            >
              <Eye className="w-3 h-3" /> Coverage Map
            </a>
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-4" data-testid="text-manifest-timestamp">
          Manifest generated: {new Date(manifest.generatedAt).toLocaleString()} ({staleness.ageText})
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-lg border border-slate-200 p-1 overflow-x-auto" data-testid="nav-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === t.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
              data-testid={`tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="section-summary-cards">
              <Card data-testid="card-total-questions">
                <CardContent className="p-4 text-center">
                  <Database className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-900" data-testid="text-total-questions">{totalQuestions.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{t("pages.adminTierHealth.totalQuestions")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-nursing-total">
                <CardContent className="p-4 text-center">
                  <FileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-700" data-testid="text-nursing-total">{nursingTotal.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{t("pages.adminTierHealth.nursingTiers")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-allied-total">
                <CardContent className="p-4 text-center">
                  <Layers className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-teal-700" data-testid="text-allied-total">{alliedTotal.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{t("pages.adminTierHealth.alliedHealth")}</p>
                </CardContent>
              </Card>
              <Card data-testid="card-cert-total">
                <CardContent className="p-4 text-center">
                  <Shield className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-purple-700" data-testid="text-cert-total">{certTotal.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{t("pages.adminTierHealth.certifications")}</p>
                </CardContent>
              </Card>
            </div>

            {staleness.isStale && (
              <Card className="border-red-200 bg-red-50" data-testid="card-stale-warning">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{t("pages.adminTierHealth.outdatedManifestData")}</p>
                    <p className="text-xs text-red-600">
                      The question count manifest was last generated {staleness.ageText}. Counts may not reflect recent additions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <RecommendedPriorityCard watchlist={watchlist} />

            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminTierHealth.questionCountsByTier")}</h2>
              <div className="flex gap-1 ml-auto">
                {(["all", "nursing", "allied", "cert"] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGroupFilter(g)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      groupFilter === g ? "bg-slate-800 text-white" : "bg-white text-slate-600 border hover:bg-slate-50"
                    }`}
                    data-testid={`filter-${g}`}
                  >
                    {g === "all" ? "All" : g === "nursing" ? "Nursing" : g === "allied" ? "Allied" : "Certs"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" data-testid="section-tier-cards">
              {filteredTiers
                .sort((a, b) => b.total - a.total)
                .map(tier => (
                  <TierCountCard key={tier.key} tier={tier} threshold={threshold} />
                ))}
            </div>

            <Card data-testid="card-format-breakdown">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-500" /> Format Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(() => {
                    const formatTotals: Record<string, number> = {};
                    allTiers.forEach(t => {
                      Object.entries(t.byFormat).forEach(([fmt, count]) => {
                        const normalizedFmt = fmt.toUpperCase();
                        formatTotals[normalizedFmt] = (formatTotals[normalizedFmt] || 0) + count;
                      });
                    });
                    return Object.entries(formatTotals).sort((a, b) => b[1] - a[1]).map(([fmt, count]) => (
                      <div key={fmt} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg" data-testid={`format-${fmt.toLowerCase()}`}>
                        <span className="text-xs font-medium text-slate-600">{fmt}</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{count.toLocaleString()}</span>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "watchlist" && (
          <div className="space-y-6">
            <RecommendedPriorityCard watchlist={watchlist} />

            <Card data-testid="card-watchlist">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" /> Ranked Expansion Watchlist
                  </CardTitle>
                  <p className="text-xs text-slate-400">{t("pages.adminTierHealth.sortedByPriorityScoreHighest")}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 py-2 px-3 bg-slate-50 rounded-lg text-xs text-slate-500 font-medium">
                  <span className="w-6 text-center">#</span>
                  <span className="w-4" />
                  <span className="flex-1">{t("pages.adminTierHealth.tier")}</span>
                  <span className="w-16 text-right">{t("pages.adminTierHealth.count")}</span>
                  <span className="w-16 text-center">{t("pages.adminTierHealth.risk")}</span>
                  <span className="w-12 text-right">{t("pages.adminTierHealth.comp")}</span>
                  <span className="w-8 text-center">{t("pages.adminTierHealth.cat")}</span>
                  <span className="w-4" />
                </div>
                <div className="space-y-1" data-testid="list-watchlist">
                  {watchlist.map((entry, idx) => (
                    <WatchlistRow key={entry.key} entry={entry} rank={idx + 1} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-slate-800">{t("pages.adminTierHealth.alertsWarnings")}</h2>
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-slate-500">{t("pages.adminTierHealth.lowvolumeThreshold")}</label>
                <Input
                  type="number"
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value) || DEFAULT_LOW_VOLUME_THRESHOLD)}
                  className="w-20 h-7 text-xs"
                  data-testid="input-threshold"
                />
              </div>
            </div>

            {staleness.isStale && (
              <Card className="border-red-200 bg-red-50" data-testid="alert-stale-manifest">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{t("pages.adminTierHealth.staleManifestWarning")}</p>
                    <p className="text-xs text-red-600">
                      Manifest was generated {staleness.ageText}. Question counts may be outdated.
                      Generated at: {new Date(manifest.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {lowVolumeTiers.length > 0 && (
              <Card className="border-amber-200" data-testid="card-low-volume-alerts">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Low-Volume Tier Alerts ({lowVolumeTiers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowVolumeTiers
                      .sort((a, b) => a.total - b.total)
                      .map(tier => (
                        <div key={tier.key} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg" data-testid={`alert-low-volume-${tier.key}`}>
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-800 flex-1">{tier.name}</span>
                          <span className="text-sm font-mono font-bold text-red-600">{tier.total}</span>
                          <span className="text-xs text-slate-500">questions (threshold: {threshold})</span>
                          <a
                            href="/admin/question-bank"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            data-testid={`link-expand-${tier.key}`}
                          >
                            <Zap className="w-3 h-3" /> Expand
                          </a>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {lowVolumeTiers.length === 0 && (
              <Card data-testid="card-no-low-volume">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">{t("pages.adminTierHealth.allTiersAboveThreshold")}</p>
                  <p className="text-xs text-slate-500">No tiers below {threshold} questions</p>
                </CardContent>
              </Card>
            )}

            {manifest.integrity.parseFailures.length > 0 && (
              <Card className="border-red-200" data-testid="card-parse-failures">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Parsing Failures ({manifest.integrity.parseFailures.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {manifest.integrity.parseFailures.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm" data-testid={`parse-failure-${i}`}>
                        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <code className="text-xs text-red-700">{file}</code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {manifest.integrity.parseFailures.length === 0 && (
              <Card data-testid="card-no-parse-failures">
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{t("pages.adminTierHealth.noParsingFailures")}</p>
                    <p className="text-xs text-slate-500">All {manifest.integrity.fileCount} files parsed successfully</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {uncategorized.length > 0 && (
              <Card className="border-amber-200" data-testid="card-uncategorized">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Uncategorized Questions ({uncategorized.reduce((s, t) => s + t.uncategorizedCount, 0)})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500 mb-3">
                    These tiers have questions with empty category assignments. They should be mapped to appropriate categories.
                  </p>
                  <div className="space-y-2">
                    {uncategorized.map(tier => (
                      <div key={tier.key} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg" data-testid={`uncategorized-${tier.key}`}>
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-800 flex-1">{tier.name}</span>
                        <span className="text-sm font-mono font-bold text-amber-700">{tier.uncategorizedCount}</span>
                        <span className="text-xs text-slate-500">uncategorized of {tier.total} total</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "ai-pool" && (
          <div className="space-y-6">
            <Card data-testid="card-ai-pool-summary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" /> AI-Generated Question Pool (Supplemental)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-purple-700">
                    AI-generated questions are supplemental inventory and are not included in validated content counts.
                    They require human review before publishing.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg text-center" data-testid="ai-pool-total">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.totalGenerated")}</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {manifest.database.generatedQuestions.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg text-center" data-testid="ai-pool-allied">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.alliedQuestionsDb")}</p>
                    <p className="text-2xl font-bold text-teal-700">
                      {manifest.database.alliedQuestions.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg text-center" data-testid="ai-pool-public-total">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.publicTotalValidated")}</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {manifest.totals.publicTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {Object.keys(manifest.database.byCareerType).length > 0 && (
              <Card data-testid="card-ai-pool-by-career">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-500" /> Generated Pool by Career Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(manifest.database.byCareerType)
                      .sort((a, b) => b[1] - a[1])
                      .map(([career, count]) => (
                        <div key={career} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg" data-testid={`ai-career-${career}`}>
                          <span className="text-sm font-medium text-slate-700 flex-1">
                            {TIER_DISPLAY_NAMES[career] || career}
                          </span>
                          <span className="text-sm font-mono font-bold text-slate-800">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {aiPoolData && (
              <Card data-testid="card-ai-pool-analytics">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-500" /> Publish After Validation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-emerald-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500">{t("pages.adminTierHealth.published")}</p>
                      <p className="text-xl font-bold text-emerald-700" data-testid="text-ai-published">
                        {(aiPoolData?.qualityMetrics?.publishedVsTotal?.questions?.published || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500">{t("pages.adminTierHealth.pendingReview")}</p>
                      <p className="text-xl font-bold text-amber-700" data-testid="text-ai-pending">
                        {(aiPoolData?.qualityMetrics?.publishedVsTotal?.flashcards?.needsReview || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500">{t("pages.adminTierHealth.totalInPipeline")}</p>
                      <p className="text-xl font-bold text-blue-700" data-testid="text-ai-pipeline">
                        {(aiPoolData?.pipelineOpportunity?.totalDrafts || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <p className="text-xs text-slate-500">{t("pages.adminTierHealth.estPublishable")}</p>
                      <p className="text-xl font-bold text-purple-700" data-testid="text-ai-publishable">
                        {(aiPoolData?.pipelineOpportunity?.estimatedPublishable || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{t("pages.adminTierHealth.validatedPublished")}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{t("pages.adminTierHealth.awaitingReview")}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>{t("pages.adminTierHealth.inPipeline")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "integrity" && (
          <div className="space-y-6">
            <Card data-testid="card-integrity-summary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-500" /> Manifest Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg" data-testid="integrity-generated-at">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.generatedAt")}</p>
                    <p className="text-sm font-medium text-slate-800">{new Date(manifest.generatedAt).toLocaleString()}</p>
                    {staleness.isStale && (
                      <Badge className="mt-1 text-[10px] bg-red-100 text-red-700">Stale ({staleness.ageText})</Badge>
                    )}
                    {!staleness.isStale && (
                      <Badge className="mt-1 text-[10px] bg-green-100 text-green-700">Fresh ({staleness.ageText})</Badge>
                    )}
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg" data-testid="integrity-file-count">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.filesProcessed")}</p>
                    <p className="text-xl font-bold text-slate-800">{manifest.integrity.fileCount}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg" data-testid="integrity-parse-failures">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.parseFailures")}</p>
                    <p className={`text-xl font-bold ${manifest.integrity.parseFailures.length > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {manifest.integrity.parseFailures.length}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg" data-testid="integrity-content-hash">
                    <p className="text-xs text-slate-500">{t("pages.adminTierHealth.contentHash")}</p>
                    <code className="text-xs font-mono text-slate-600 break-all">{manifest.integrity.contentHash}</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-totals-breakdown">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-500" /> Totals Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Allied Health (Static)", value: manifest.totals.alliedHealthStatic, color: "bg-teal-500" },
                    { label: "Nursing (Static)", value: manifest.totals.nursingStatic, color: "bg-blue-500" },
                    { label: "Nursing Certs (Static)", value: manifest.totals.nursingCertStatic, color: "bg-purple-500" },
                    { label: "Database Generated", value: manifest.totals.databaseGenerated, color: "bg-amber-500" },
                    { label: "Public Total", value: manifest.totals.publicTotal, color: "bg-emerald-500" },
                  ].map(item => {
                    const maxVal = Math.max(
                      manifest.totals.alliedHealthStatic,
                      manifest.totals.nursingStatic,
                      manifest.totals.nursingCertStatic,
                      manifest.totals.databaseGenerated,
                      manifest.totals.publicTotal
                    );
                    return (
                      <div key={item.label} className="flex items-center gap-3" data-testid={`total-${item.label.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                        <span className="text-xs text-slate-600 w-40 text-right flex-shrink-0">{item.label}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${Math.max((item.value / maxVal) * 100, 2)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800 w-16 text-right">
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-manifest-version">
              <CardContent className="p-4 flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Manifest Version: {manifest.version}</p>
                  <p className="text-xs text-slate-500">
                    Total tiers tracked: {allTiers.length} | Total files: {manifest.integrity.fileCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
