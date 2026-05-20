import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { NEXT_BUILD_PRIORITY, BUILD_PRIORITY_META } from "@shared/tier-config";
import { getQuestionCount } from "@/data/career-questions/question-counts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EnvironmentBadge } from "@/components/environment-badge";
import {
  Users,
  TrendingUp,
  BookOpen,
  FileText,
  Activity,
  BarChart3,
  Globe,
  CreditCard,
  Clock,
  StickyNote,
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  RefreshCw,
  Layers,
  Eye,
  MousePointer,
  MessageSquare,
  ThumbsUp,
  Lightbulb,
  Bug,
  Pencil,
  Trash2,
  Save,
  X,
  ExternalLink,
  Calendar,
  Tag,
  Plus,
  CheckCircle2,
  XCircle,
  Zap,
  Copy,
  Check,
  Ticket,
  ToggleLeft,
  ToggleRight,
  Database,
  Lock,
  User as UserIcon,
  Sparkles,
  DollarSign,
  Crown,
} from "lucide-react";

import { useQuery as useQueryRQ } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { getCertAnalytics, getCertTotalQuestions, getCertTotalMockExams, getCertCount, getCertTotalScenarioQuestions, getThinCertifications, CERT_QUESTION_TARGET } from "@/data/certification-exam-data";
import { CONTENT_EXPANSION_ROADMAP, CERTIFICATION_BUILD_SUMMARY } from "@/config/admin-constants";
import { AlertTriangle } from "lucide-react";
import AdminContentSecurity from "./admin-content-security";
import { AdminTrialAnalytics } from "@/components/admin-trial-analytics";
import AdminContentGrowth from "./admin-content-growth";
import AdminTutorManagement from "./admin-tutor";
import AdminQBankPipeline from "./admin-qbank-pipeline";
import AdminExpansionRoadmap from "./admin-expansion-roadmap";
import AdminContentHealth from "./admin-content-health";

import { useI18n } from "@/lib/i18n";
function KillSwitchBanner() {
  const { t } = useI18n();
  const { data } = useQueryRQ({
    queryKey: ["ai-kill-switch-banner"],
    queryFn: async () => {
      try {
        const res = await adminFetch("/api/admin/ai-kill-switch");
        if (!res.ok) return { active: false };
        return res.json();
      } catch { return { active: false }; }
    },
    refetchInterval: 15000,
  });
  if (!data?.active) return null;
  return (
    <div className="bg-red-600 text-white p-3 rounded-lg flex items-center gap-3 mb-4 shadow-lg" data-testid="banner-kill-switch-admin">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <span className="font-bold">{t("pages.admin.allAiJobsDisabledEmergency")}</span>
    </div>
  );
}

type AdminData = {
  overview: {
    totalUsers: number;
    activeUsers7Day: number;
    activeUsers30Day: number;
    totalTests: number;
    totalLessonsAccessed: number;
    totalNotes: number;
    averageTestScore: number;
  };
  tiers: Record<string, number>;
  regions: Record<string, number>;
  subscriptionStatus: Record<string, number>;
  topLessons: { lessonId: string; accessCount: number }[];
  users: {
    id: string;
    username: string;
    email: string | null;
    tier: string;
    subscriptionStatus: string;
    region: string;
    testsCompleted: number;
    lessonsAccessed: number;
    notesCreated: number;
    lastActivity: string | null;
  }[];
  recentActivity: {
    username: string;
    lessonId: string;
    testType: string;
    score: number;
    totalQuestions: number;
    date: string;
  }[];
};

const tierLabels: Record<string, string> = {
  free: "Free",
  rpn: "RPN/LVN",
  rn: "RN",
  np: "NP Advanced",
  allied: "Allied Health",
  admin: "Admin",
};

const tierColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  rpn: "bg-blue-100 text-blue-700",
  rn: "bg-purple-100 text-purple-700",
  np: "bg-amber-100 text-amber-700",
  allied: "bg-teal-100 text-teal-700",
  admin: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  canceled: "bg-red-100 text-red-700",
  past_due: "bg-yellow-100 text-yellow-700",
};

function formatDate(d: string | null) {
  if (!d) return "Never";
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

function formatLessonId(id: string) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminPage() {
  const { user, login, previewTier, setPreviewTier, isAdmin: authIsAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["overview", "users", "activity", "content-engine", "analytics", "promotions", "feedback", "social", "audit", "deck-moderation", "ai-safety", "beta-testers", "content-security", "pricing", "sub-analytics", "trial-analytics", "content-growth", "tutor-management", "qbank-pipeline", "expansion-roadmap", "content-health"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, []);

  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin verification (server-confirmed OR user payload fast-path)
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("lastActivity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "activity" | "content-engine" | "analytics" | "promotions" | "feedback" | "social" | "audit" | "deck-moderation" | "ai-safety" | "beta-testers" | "flashcard-preview" | "content-security" | "pricing" | "sub-analytics" | "trial-analytics" | "content-growth" | "cert-analytics" | "tutor-management" | "qbank-pipeline" | "expansion-roadmap" | "content-health"
  >("overview");

  const [blogConfig, setBlogConfig] = useState<any>(null);
  const [blogGenerating, setBlogGenerating] = useState(false);
  const [blogTopic, setBlogTopic] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [batchTopics, setBatchTopics] = useState("");
  const [batchStartDate, setBatchStartDate] = useState(todayStr);
  const [batchPostsPerDay, setBatchPostsPerDay] = useState(1);
  const [batchPublishAll, setBatchPublishAll] = useState(false);
  const [batchSmartSchedule, setBatchSmartSchedule] = useState(true);
  const [batchScheduleMode, setBatchScheduleMode] = useState<"smart" | "manual">("smart");
  const [occupiedDays, setOccupiedDays] = useState<string[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; results: any[] } | null>(null);
  const [publishQueue, setPublishQueue] = useState<any[]>([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [selectedQueueIds, setSelectedQueueIds] = useState<Set<string>>(new Set());

  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogPostsLoading, setBlogPostsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [blogPostSearch, setBlogPostSearch] = useState("");
  const [savingPost, setSavingPost] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const [siteAnalytics, setSiteAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsDays, setAnalyticsDays] = useState(30);

  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [socialLoading, setSocialLoading] = useState(false);
  const [newPost, setNewPost] = useState({ platform: "facebook", content: "", scheduledAt: "", tier: "rpn", imageUrl: "" });
  const [metaStatus, setMetaStatus] = useState<any>(null);
  const [metaLoading, setMetaLoading] = useState(false);

  const [promotions, setPromotions] = useState<any[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", discountType: "percent_off", amount: "", duration: "once", maxRedemptions: "", expiresAt: "" });
  const [promoCreating, setPromoCreating] = useState(false);
  const [analyticsSubTab, setAnalyticsSubTab] = useState<"traffic" | "users" | "content" | "campaigns">("traffic");

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const [deckReports, setDeckReports] = useState<any[]>([]);
  const [deckReportsLoading, setDeckReportsLoading] = useState(false);

  const [aiConfig, setAiConfig] = useState<any>(null);
  const [aiConfigLoading, setAiConfigLoading] = useState(false);
  const [aiConfigSaving, setAiConfigSaving] = useState(false);

  const [imageGenPrompt, setImageGenPrompt] = useState("");
  const [imageGenFilename, setImageGenFilename] = useState("");
  const [imageGenSize, setImageGenSize] = useState<"1024x1024" | "512x512">("1024x1024");
  const [imageGenLoading, setImageGenLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ filename: string; url: string; size: number; createdAt: string }[]>([]);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  const [mlTopic, setMlTopic] = useState("");
  const [mlTier, setMlTier] = useState<"RPN" | "RN" | "NP">("RN");
  const [mlFocus, setMlFocus] = useState("");
  const [mlLoading, setMlLoading] = useState(false);
  const [mlGenerated, setMlGenerated] = useState<any[]>([]);
  const [showMlLibrary, setShowMlLibrary] = useState(false);

  const [batchExamTier, setBatchExamTier] = useState("rn");
  const [batchExamTopic, setBatchExamTopic] = useState("");
  const [batchExamQty, setBatchExamQty] = useState(10);
  const [batchExamLoading, setBatchExamLoading] = useState(false);
  const [batchExamResult, setBatchExamResult] = useState<any>(null);

  const [batchFcTopic, setBatchFcTopic] = useState("");
  const [batchFcQty, setBatchFcQty] = useState(20);
  const [batchFcTier, setBatchFcTier] = useState("rn");
  const [batchFcDeck, setBatchFcDeck] = useState("");
  const [batchFcLoading, setBatchFcLoading] = useState(false);
  const [batchFcResult, setBatchFcResult] = useState<any>(null);

  const [betaCodes, setBetaCodes] = useState<any[]>([]);
  const [betaCodesLoading, setBetaCodesLoading] = useState(false);
  const [betaUsers, setBetaUsers] = useState<any[]>([]);
  const [betaUsersLoading, setBetaUsersLoading] = useState(false);
  const [betaNewCode, setBetaNewCode] = useState("");
  const [betaNewTier, setBetaNewTier] = useState("rpn");
  const [betaNewMaxUses, setBetaNewMaxUses] = useState(25);
  const [betaNewDurationDays, setBetaNewDurationDays] = useState(30);
  const [betaNewNotes, setBetaNewNotes] = useState("");
  const [betaCreating, setBetaCreating] = useState(false);
  const [betaCopied, setBetaCopied] = useState<string | null>(null);
  const [betaFeedback, setBetaFeedback] = useState<any[]>([]);
  const [betaFeedbackLoading, setBetaFeedbackLoading] = useState(false);
  const [betaBatchCount, setBetaBatchCount] = useState(10);
  const [betaBatchTier, setBetaBatchTier] = useState("rn");
  const [betaBatchMaxUses, setBetaBatchMaxUses] = useState(1);
  const [betaBatchDuration, setBetaBatchDuration] = useState(30);
  const [betaBatchNotes, setBetaBatchNotes] = useState("");
  const [betaBatchLoading, setBetaBatchLoading] = useState(false);
  const [betaBatchResult, setBetaBatchResult] = useState<any>(null);
  const [betaAllCopied, setBetaAllCopied] = useState(false);

  // -------------------------------
  // ✅ ADMIN VERIFY (FIXED)
  // - Fast-path: trust user payload if it already contains admin markers
  // - Fallback: old /api/admin/verify using stored credentials
  // -------------------------------
  useEffect(() => {
    async function verifyAdmin() {
      if (!user) return;

      // ✅ Fast path: if your auth already knows you're admin, allow immediately
      const tier = (user as any)?.tier;
      const role = (user as any)?.role;
      const isAdminFlag = (user as any)?.isAdmin;

      if (tier === "admin" || role === "admin" || isAdminFlag === true) {
        setIsAdmin(true);
        setAdminChecked(true);
        return;
      }

      // ✅ Fallback: server verify using stored credentials (legacy)
      try {
        const stored = localStorage.getItem("nursenest-credentials");
        if (!stored) {
          setIsAdmin(false);
          setAdminChecked(true);
          return;
        }

        const parsed = JSON.parse(stored);
        const username = parsed?.username;
        const password = parsed?.password;

        if (!username || !password) {
          setIsAdmin(false);
          setAdminChecked(true);
          return;
        }

        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          setIsAdmin(false);
          setAdminChecked(true);
          return;
        }

        const json = await res.json();
        setIsAdmin(Boolean(json?.isAdmin));
        setAdminChecked(true);
      } catch {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    }

    // reset when user changes
    setAdminChecked(false);
    setIsAdmin(false);

    verifyAdmin();
  }, [user]);

  // Fetch admin analytics only after admin is confirmed
  useEffect(() => {
    if (!user || !adminChecked || !isAdmin) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, adminChecked, isAdmin]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      // If your backend still requires credentials, keep using them:
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) {
        throw new Error("No credentials stored. Please log out and log in again.");
      }
      const { username, password } = JSON.parse(stored);

      const res = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Failed to load analytics");
      }

      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch("/api/blog/config").then((r) => r.json()).then(setBlogConfig).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "analytics" && !siteAnalytics && !analyticsLoading) {
      fetchSiteAnalytics();
    }
    if (activeTab === "feedback" && feedbackList.length === 0 && !feedbackLoading) {
      fetchFeedback();
    }
    if (activeTab === "social" && socialPosts.length === 0 && !socialLoading) {
      fetchSocialPosts();
      fetchMetaStatus();
    }
    if (activeTab === "promotions" && promotions.length === 0 && !promotionsLoading) {
      fetchPromotions();
    }
    if (activeTab === "audit" && auditLogs.length === 0 && !auditLoading) {
      fetchAuditLogs();
    }
    if (activeTab === "deck-moderation" && deckReports.length === 0 && !deckReportsLoading) {
      fetchDeckReports();
    }
    if (activeTab === "ai-safety" && !aiConfig && !aiConfigLoading) {
      fetchAiConfig();
    }
    if (activeTab === "beta-testers") {
      if (betaCodes.length === 0 && !betaCodesLoading) fetchBetaCodes();
      if (betaUsers.length === 0 && !betaUsersLoading) fetchBetaUsers();
      if (betaFeedback.length === 0 && !betaFeedbackLoading) fetchBetaFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function fetchSiteAnalytics() {
    setAnalyticsLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setAnalyticsLoading(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/site-analytics?days=${analyticsDays}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setSiteAnalytics(await res.json());
    } catch {
      // ignore
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function fetchFeedback() {
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) setFeedbackList(await res.json());
    } catch {
      // ignore
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function updateFeedbackItem(id: string, updates: any) {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setFeedbackList((prev) => prev.map((f) => (f.id === id ? updated : f)));
      }
    } catch {
      // ignore
    }
  }

  async function fetchSocialPosts() {
    setSocialLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/social-posts?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setSocialPosts(await res.json());
    } catch {
    } finally {
      setSocialLoading(false);
    }
  }

  async function createSocialPost() {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/social-posts?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        const created = await res.json();
        setSocialPosts((prev) => [created, ...prev]);
        setNewPost({ platform: "facebook", content: "", scheduledAt: "", tier: "rpn", imageUrl: "" });
      }
    } catch {
    }
  }

  async function deleteSocialPost(id: string) {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/social-posts/${id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: "DELETE" });
      if (res.ok) setSocialPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
    }
  }

  async function fetchMetaStatus() {
    setMetaLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/meta/status?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setMetaStatus(await res.json());
    } catch {
    } finally {
      setMetaLoading(false);
    }
  }

  async function connectMeta() {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/meta/connect?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.authUrl) window.location.href = data.authUrl;
      }
    } catch {
    }
  }

  async function disconnectMeta() {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/meta/disconnect?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: "POST" });
      if (res.ok) setMetaStatus({ connected: false });
    } catch {
    }
  }

  async function publishNow(postId: string) {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/social/publish-now?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        fetchSocialPosts();
      }
    } catch {
    }
  }

  async function fetchAuditLogs() {
    setAuditLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setAuditLoading(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/audit-logs?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&limit=100`);
      if (res.ok) setAuditLogs(await res.json());
    } catch {} finally {
      setAuditLoading(false);
    }
  }

  async function fetchDeckReports() {
    setDeckReportsLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setDeckReportsLoading(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/deck-reports?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setDeckReports(await res.json());
    } catch {} finally {
      setDeckReportsLoading(false);
    }
  }

  async function updateDeckReportStatus(reportId: string, status: string) {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/deck-reports/${reportId}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDeckReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status } : r));
      }
    } catch {}
  }

  async function fetchAiConfig() {
    setAiConfigLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setAiConfigLoading(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/ai-config?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setAiConfig(await res.json());
    } catch {} finally {
      setAiConfigLoading(false);
    }
  }

  async function updateAiConfig(updates: any) {
    setAiConfigSaving(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setAiConfigSaving(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, ...updates }),
      });
      if (res.ok) setAiConfig(await res.json());
    } catch {} finally {
      setAiConfigSaving(false);
    }
  }

  function getAdminCreds(): { username: string; password: string } | null {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  async function fetchBetaCodes() {
    setBetaCodesLoading(true);
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      const res = await fetch(`/api/admin/tester/invite-codes?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`);
      if (res.ok) setBetaCodes(await res.json());
    } catch {} finally {
      setBetaCodesLoading(false);
    }
  }

  async function fetchBetaUsers() {
    setBetaUsersLoading(true);
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      const res = await fetch(`/api/admin/tester/users?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`);
      if (res.ok) setBetaUsers(await res.json());
    } catch {} finally {
      setBetaUsersLoading(false);
    }
  }

  async function fetchBetaFeedback() {
    setBetaFeedbackLoading(true);
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      const res = await fetch(`/api/admin/tester/feedback?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`);
      if (res.ok) setBetaFeedback(await res.json());
    } catch {} finally {
      setBetaFeedbackLoading(false);
    }
  }

  function generateBetaCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "NN-BETA-";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async function createBetaCode() {
    setBetaCreating(true);
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      const code = betaNewCode.trim() || generateBetaCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + betaNewDurationDays);
      const res = await fetch("/api/admin/tester/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          code,
          maxUses: betaNewMaxUses,
          tier: betaNewTier,
          notes: betaNewNotes || undefined,
          expiresAt: expiresAt.toISOString(),
        }),
      });
      if (res.ok) {
        setBetaNewCode("");
        setBetaNewNotes("");
        setBetaNewMaxUses(25);
        setBetaNewDurationDays(30);
        fetchBetaCodes();
      }
    } catch {} finally {
      setBetaCreating(false);
    }
  }

  async function toggleBetaCode(id: string, isActive: boolean) {
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      await fetch(`/api/admin/tester/invite-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds.username, password: creds.password, isActive: !isActive }),
      });
      fetchBetaCodes();
    } catch {}
  }

  async function deleteBetaCode(id: string) {
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      await fetch(`/api/admin/tester/invite-codes/${id}?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`, {
        method: "DELETE",
      });
      fetchBetaCodes();
    } catch {}
  }

  async function copyBetaCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setBetaCopied(code);
      setTimeout(() => setBetaCopied(null), 2000);
    } catch {}
  }

  async function generateBatchCodes() {
    setBetaBatchLoading(true);
    setBetaBatchResult(null);
    try {
      const creds = getAdminCreds();
      if (!creds) return;
      const res = await fetch("/api/admin/tester/invite-codes/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          count: betaBatchCount,
          maxUses: betaBatchMaxUses,
          tier: betaBatchTier,
          durationDays: betaBatchDuration,
          notes: betaBatchNotes || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBetaBatchResult(data);
        fetchBetaCodes();
      } else {
        const err = await res.json();
        setBetaBatchResult({ error: err.error || "Failed to generate batch" });
      }
    } catch {
      setBetaBatchResult({ error: "Network error" });
    } finally {
      setBetaBatchLoading(false);
    }
  }

  async function copyAllCodes(codes: any[]) {
    try {
      const text = codes.map((c: any) => c.code).join("\n");
      await navigator.clipboard.writeText(text);
      setBetaAllCopied(true);
      setTimeout(() => setBetaAllCopied(false), 2000);
    } catch {}
  }

  async function fetchPromotions() {
    setPromotionsLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setPromotionsLoading(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/promotions?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setPromotions(await res.json());
    } catch {} finally {
      setPromotionsLoading(false);
    }
  }

  async function createPromotion() {
    if (!newPromo.code || !newPromo.amount) return;
    setPromoCreating(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, password,
          code: newPromo.code.toUpperCase(),
          discountType: newPromo.discountType,
          amount: Number(newPromo.amount),
          duration: newPromo.duration,
          maxRedemptions: newPromo.maxRedemptions ? Number(newPromo.maxRedemptions) : undefined,
          expiresAt: newPromo.expiresAt || undefined,
        }),
      });
      if (res.ok) {
        setNewPromo({ code: "", discountType: "percent_off", amount: "", duration: "once", maxRedemptions: "", expiresAt: "" });
        fetchPromotions();
      } else {
        const err = await res.json().catch(() => ({}));
        alert((err as any).error || "Failed to create promotion");
      }
    } catch {
      alert("Failed to create promotion");
    } finally {
      setPromoCreating(false);
    }
  }

  async function deletePromotion(id: string) {
    if (!confirm("Deactivate this promotion code?")) return;
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/admin/promotions/${id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: "DELETE" });
      if (res.ok) fetchPromotions();
    } catch {}
  }

  async function handleBlogConfigUpdate(updates: any) {
    const stored = localStorage.getItem("nursenest-credentials");
    if (!stored) return;
    const { username, password } = JSON.parse(stored);

    const res = await fetch("/api/blog/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, ...updates }),
    });

    if (res.ok) setBlogConfig(await res.json());
  }

  async function handleGenerateBlogPost() {
    const stored = localStorage.getItem("nursenest-credentials");
    if (!stored) return;
    const { username, password } = JSON.parse(stored);

    setBlogGenerating(true);
    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          topic: blogTopic || undefined,
          citationStyle: blogConfig?.citationStyle || "apa7",
        }),
      });
      if (res.ok) {
        setBlogTopic("");
        alert("Blog post generated and published!");
      } else {
        alert("Failed to generate blog post");
      }
    } catch {
      alert("Failed to generate blog post");
    } finally {
      setBlogGenerating(false);
    }
  }

  async function handleBatchGenerate() {
    const stored = localStorage.getItem("nursenest-credentials");
    if (!stored) return;
    const { username, password } = JSON.parse(stored);
    const topicLines = batchTopics.split("\n").map(t => t.trim()).filter(t => t.length > 0);
    if (topicLines.length === 0) return;

    setBlogGenerating(true);
    const allResults: any[] = [];
    setBatchProgress({ current: 0, total: topicLines.length, results: [] });

    const perDay = Math.max(1, Math.min(10, batchPostsPerDay || 1));
    const startDate = batchStartDate ? new Date(batchStartDate + "T09:00:00") : new Date();
    const useSmartSchedule = batchScheduleMode === "smart" && !batchPublishAll;

    let scheduleDates: string[] = [];
    if (!batchPublishAll) {
      if (useSmartSchedule) {
        try {
          const occRes = await fetch(`/api/blog/occupied-days?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
          const occupiedSet = new Set<string>();
          if (occRes.ok) {
            const occData = await occRes.json();
            (occData.occupiedDays || []).forEach((d: string) => occupiedSet.add(d));
          }
          const totalSlotsNeeded = Math.ceil(topicLines.length / perDay);
          const cursor = new Date(startDate);
          const freeDays: string[] = [];
          while (freeDays.length < totalSlotsNeeded) {
            const dayStr = cursor.toISOString().slice(0, 10);
            if (!occupiedSet.has(dayStr)) freeDays.push(dayStr);
            cursor.setDate(cursor.getDate() + 1);
            if (freeDays.length === 0 && cursor.getTime() - startDate.getTime() > 365 * 86400000) break;
          }
          for (let i = 0; i < topicLines.length; i++) {
            const slotInDay = i % perDay;
            const dayIdx = Math.floor(i / perDay);
            const dayStr = freeDays[Math.min(dayIdx, freeDays.length - 1)] || freeDays[freeDays.length - 1];
            const d = new Date(dayStr + "T09:00:00");
            d.setHours(9 + slotInDay * 2, 0, 0, 0);
            scheduleDates.push(d.toISOString());
          }
        } catch {
          for (let i = 0; i < topicLines.length; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + Math.floor(i / perDay));
            d.setHours(9 + (i % perDay) * 2, 0, 0, 0);
            scheduleDates.push(d.toISOString());
          }
        }
      } else {
        for (let i = 0; i < topicLines.length; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + Math.floor(i / perDay));
          d.setHours(9 + (i % perDay) * 2, 0, 0, 0);
          scheduleDates.push(d.toISOString());
        }
      }
    }

    let successCount = 0;
    for (let i = 0; i < topicLines.length; i++) {
      setBatchProgress({ current: i, total: topicLines.length, results: [...allResults] });
      try {
        const res = await fetch("/api/blog/generate-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username, password,
            topics: [topicLines[i]],
            citationStyle: blogConfig?.citationStyle || "apa7",
            publishAllNow: batchPublishAll,
            overrideDates: scheduleDates.length > i ? [scheduleDates[i]] : undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const result = data.results?.[0] || { index: i, status: "success" };
          result.index = i;
          allResults.push(result);
          if (result.status === "success") successCount++;
        } else {
          const err = await res.json().catch(() => ({}));
          allResults.push({ index: i, status: "failed", topic: topicLines[i], error: err.error || "Request failed" });
        }
      } catch {
        allResults.push({ index: i, status: "failed", topic: topicLines[i], error: "Network error or timeout" });
      }
      setBatchProgress({ current: i + 1, total: topicLines.length, results: [...allResults] });
    }

    setBatchProgress({ current: topicLines.length, total: topicLines.length, results: allResults });
    alert(`Batch complete: ${successCount}/${topicLines.length} posts generated.`);
    if (successCount > 0) {
      setBatchTopics("");
      fetchBlogPosts();
      fetchPublishQueue();
      fetchOccupiedDays();
    }
    setBlogGenerating(false);
  }

  async function fetchOccupiedDays() {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/blog/occupied-days?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setOccupiedDays(data.occupiedDays || []);
      }
    } catch {}
  }

  async function fetchPublishQueue() {
    setQueueLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/blog/queue?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) setPublishQueue(await res.json());
    } catch {
    } finally {
      setQueueLoading(false);
    }
  }

  async function updateQueueItem(id: string, updates: { scheduledAt?: string; status?: string }) {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      await fetch(`/api/blog/queue/${id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchPublishQueue();
      fetchBlogPosts();
    } catch {
    }
  }

  async function deleteQueueItem(id: string, title: string) {
    if (!confirm(`Delete "${title}" from the queue? This cannot be undone.`)) return;
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      await fetch(`/api/content/${id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      fetchPublishQueue();
      fetchBlogPosts();
    } catch {
    }
  }

  async function deleteSelectedQueueItems() {
    if (selectedQueueIds.size === 0) return;
    if (!confirm(`Delete ${selectedQueueIds.size} selected post${selectedQueueIds.size > 1 ? "s" : ""} from the queue? This cannot be undone.`)) return;
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      for (const id of selectedQueueIds) {
        await fetch(`/api/content/${id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
      }
      setSelectedQueueIds(new Set());
      fetchPublishQueue();
      fetchBlogPosts();
    } catch {
    }
  }

  function toggleQueueSelection(id: string) {
    setSelectedQueueIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllQueue() {
    if (selectedQueueIds.size === publishQueue.length) {
      setSelectedQueueIds(new Set());
    } else {
      setSelectedQueueIds(new Set(publishQueue.map((p: any) => p.id)));
    }
  }

  async function publishScheduledNow() {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/blog/publish-scheduled?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Published ${data.published} scheduled posts.`);
        fetchPublishQueue();
        fetchBlogPosts();
      }
    } catch {
    }
  }

  async function handleRunScheduler() {
    const stored = localStorage.getItem("nursenest-credentials");
    if (!stored) return;
    const { username, password } = JSON.parse(stored);

    setBlogGenerating(true);
    try {
      const res = await fetch("/api/blog/run-scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json().catch(() => ({}));
      alert(result?.message || "Scheduler ran.");
    } catch {
      alert("Scheduler failed");
    } finally {
      setBlogGenerating(false);
    }
  }

  async function fetchBlogPosts() {
    setBlogPostsLoading(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setBlogPostsLoading(false); return; }
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/content?status=all&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const allItems = await res.json();
        allItems.sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
        setBlogPosts(allItems);
      }
    } catch {} finally {
      setBlogPostsLoading(false);
    }
  }

  async function handleSaveBlogPost() {
    if (!editingPost) return;
    setSavingPost(true);
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) { setSavingPost(false); return; }
      const { username, password } = JSON.parse(stored);

      const isNew = !editingPost.id;
      const url = isNew ? "/api/content" : `/api/content/${editingPost.id}`;
      const method = isNew ? "POST" : "PUT";

      const body: any = {
        username,
        password,
        title: editingPost.title,
        slug: editingPost.slug,
        type: editingPost.type || "blog",
        category: editingPost.category || null,
        bodySystem: editingPost.bodySystem || null,
        tier: editingPost.tier || "free",
        status: editingPost.status || "draft",
        summary: editingPost.summary || null,
        content: editingPost.content || [],
        tags: editingPost.tags || [],
        seoTitle: editingPost.seoTitle || null,
        seoDescription: editingPost.seoDescription || null,
        seoKeywords: editingPost.seoKeywords || [],
        primaryKeyword: editingPost.primaryKeyword || null,
        scheduledAt: editingPost.scheduledAt ? new Date(editingPost.scheduledAt).toISOString() : null,
        autoPublish: editingPost.autoPublish || false,
        authorName: editingPost.authorName || "Erika Godin, RN",
      };

      if (editingPost.status === "published" && !editingPost.publishedAt) {
        body.publishedAt = new Date().toISOString();
      }
      if (editingPost.status === "scheduled" && editingPost.scheduledAt) {
        body.status = "scheduled";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditingPost(null);
        setCreatingNew(false);
        fetchBlogPosts();
      } else {
        alert("Failed to save blog post");
      }
    } catch {
      alert("Failed to save blog post");
    }
    setSavingPost(false);
  }

  async function handleQuickTierChange(id: string, newTier: string) {
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, tier: newTier }),
      });
      if (res.ok) {
        setBlogPosts((prev) => prev.map((p) => p.id === id ? { ...p, tier: newTier } : p));
      }
    } catch {}
  }

  async function handleDeleteBlogPost(id: string) {
    if (!confirm("Are you sure you want to delete this blog post? This cannot be undone.")) return;
    try {
      const stored = localStorage.getItem("nursenest-credentials");
      if (!stored) return;
      const { username, password } = JSON.parse(stored);
      const res = await fetch(`/api/content/${id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: "DELETE" });
      if (res.ok) {
        setBlogPosts((prev) => prev.filter((p) => p.id !== id));
        if (editingPost?.id === id) setEditingPost(null);
      }
    } catch {}
  }

  function startNewContent(contentType: string) {
    setCreatingNew(true);
    const templates: Record<string, any[]> = {
      blog: [
        { type: "heading", content: "" },
        { type: "paragraph", content: "" },
      ],
      lesson: [
        { type: "heading", content: "Learning Objectives" },
        { type: "list", content: "" },
        { type: "heading", content: "Pathophysiology" },
        { type: "paragraph", content: "" },
        { type: "heading", content: "Clinical Presentation" },
        { type: "paragraph", content: "" },
        { type: "heading", content: "Nursing Interventions" },
        { type: "paragraph", content: "" },
        { type: "callout", content: "Clinical Pearl: " },
      ],
      "flashcard-set": [
        { type: "flashcard", content: "Q: \nA: " },
        { type: "flashcard", content: "Q: \nA: " },
        { type: "flashcard", content: "Q: \nA: " },
      ],
      article: [
        { type: "heading", content: "" },
        { type: "paragraph", content: "" },
        { type: "references", content: "" },
      ],
    };
    setEditingPost({
      title: "",
      slug: "",
      type: contentType,
      category: "clinical-reasoning",
      bodySystem: null,
      tier: "free",
      status: "draft",
      summary: "",
      content: templates[contentType] || templates.blog,
      tags: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      primaryKeyword: "",
      scheduledAt: null,
      autoPublish: false,
      authorName: "Erika Godin, RN",
    });
  }

  useEffect(() => {
    if (activeTab === "content-engine" && blogPosts.length === 0 && !blogPostsLoading) {
      fetchBlogPosts();
      fetchPublishQueue();
      fetchOccupiedDays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ---------- AUTH GATES ----------
  if (!user) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.admin.adminAccessRequired")}</h2>
              <p className="text-gray-500 mb-6">{t("pages.admin.pleaseLogInWithAn")}</p>
              <Button onClick={() => setLocation("/login")} data-testid="button-admin-login">
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!adminChecked) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.admin.accessDenied")}</h2>
                <p className="text-gray-500">{t("pages.admin.thisPageIsRestrictedTo")}</p>
              </div>
              <form
                className="space-y-4"
                data-testid="admin-login-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAdminLoginError(null);
                  const fd = new FormData(e.currentTarget);
                  const u = fd.get("username") as string;
                  const p = fd.get("password") as string;
                  try {
                    await login(u, p);
                  } catch (err: any) {
                    setAdminLoginError(err?.message || "Login failed. Please check your credentials and try again.");
                  }
                }}
              >
                <p className="text-sm font-medium text-gray-700 text-center">{t("pages.admin.signInAsAdmin")}</p>
                {adminLoginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm" data-testid="text-admin-login-error">
                    {adminLoginError}
                  </div>
                )}
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input name="username" placeholder={t("pages.admin.username2")} className="pl-10" required data-testid="input-admin-username" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input name="password" type="password" placeholder={t("pages.admin.password")} className="pl-10" required data-testid="input-admin-password" />
                </div>
                <Button type="submit" className="w-full" data-testid="button-admin-login">
                  Sign In
                </Button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Debug: current tier={(user as any)?.tier ?? "none"} | role={(user as any)?.role ?? "none"} | isAdmin=
                {String((user as any)?.isAdmin ?? "none")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------- TABLE HELPERS ----------
  const filteredUsers =
    data?.users.filter((u) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.username.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        u.tier.toLowerCase().includes(q) ||
        u.region.toLowerCase().includes(q)
      );
    }) || [];

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal: any, bVal: any;
    switch (sortField) {
      case "username":
        aVal = a.username;
        bVal = b.username;
        break;
      case "tier":
        aVal = a.tier;
        bVal = b.tier;
        break;
      case "testsCompleted":
        aVal = a.testsCompleted;
        bVal = b.testsCompleted;
        break;
      case "lessonsAccessed":
        aVal = a.lessonsAccessed;
        bVal = b.lessonsAccessed;
        break;
      case "lastActivity":
        aVal = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
        bVal = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
        break;
      default:
        aVal = a.username;
        bVal = b.username;
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-1" />
    );
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans transition-colors duration-500 admin-selectable">
      <SEO title={t("pages.admin.adminDashboardNursenest")} description={t("pages.admin.adminAnalyticsDashboard")} canonicalPath="/admin" />
      <Navigation />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900" data-testid="text-admin-title">
                  Admin Dashboard
                </h1>
                <EnvironmentBadge />
              </div>
              <p className="text-gray-500 mt-1">{t("pages.admin.platformAnalyticsAndUserManagement")}</p>
              {(authIsAdmin || isAdmin) && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg border" data-testid="section-preview-mode">
                  <span className="text-xs font-medium text-gray-600">{t("pages.admin.viewSiteAs")}</span>
                  <select
                    value={previewTier || "admin"}
                    onChange={e => {
                      const val = e.target.value;
                      setPreviewTier(val === "admin" ? null : val);
                    }}
                    className="text-xs border rounded px-2 py-1 bg-white cursor-pointer"
                    data-testid="select-preview-tier"
                  >
                    <option value="admin">{t("pages.admin.adminDefault")}</option>
                    <option value="free">{t("pages.admin.freeUser")}</option>
                    <option value="rpn">{t("pages.admin.rpnPaid")}</option>
                    <option value="rn">{t("pages.admin.rnPaid")}</option>
                    <option value="np">{t("pages.admin.npPaid")}</option>
                  </select>
                  {previewTier && (
                    <button
                      onClick={() => setPreviewTier(null)}
                      className="text-xs text-amber-600 hover:text-amber-800 font-medium underline"
                      data-testid="button-clear-preview"
                    >
                      Clear Preview
                    </button>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => setLocation("/content-editor")}
                  data-testid="button-admin-content-editor"
                >
                  <FileText className="w-3 h-3" />
                  Content Editor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => setLocation("/lessons")}
                  data-testid="button-admin-lessons"
                >
                  <BookOpen className="w-3 h-3" />
                  Lessons
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => setLocation("/flashcards")}
                  data-testid="button-admin-flashcards"
                >
                  <Layers className="w-3 h-3" />
                  Flashcards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => setLocation("/blog")}
                  data-testid="button-admin-blog"
                >
                  <FileText className="w-3 h-3" />
                  Blog
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="gap-2"
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700" data-testid="text-admin-error">
              {error}
            </div>
          )}

          {loading && !data ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : data ? (
            <>
              <KillSwitchBanner />
              <div className="flex gap-2 mb-4 flex-wrap">
                <a href="/admin/ai-jobs" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors" data-testid="link-ai-jobs">
                  <Zap className="w-4 h-4" /> AI Jobs
                </a>
                <a href="/admin/business-health" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors" data-testid="link-business-health">
                  <TrendingUp className="w-4 h-4" /> Business Health
                </a>
                <a href="/admin/content-coverage" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" data-testid="link-content-coverage">
                  <BarChart3 className="w-4 h-4" /> Content Coverage
                </a>
                <a href="/admin/tier-health" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors" data-testid="link-tier-health">
                  <Activity className="w-4 h-4" /> Tier Health
                </a>
                <a href="/admin/content-integrity" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors" data-testid="link-content-integrity">
                  <Shield className="w-4 h-4" /> Content Integrity
                </a>
                <a href="/admin/reliability" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors" data-testid="link-reliability">
                  <Shield className="w-4 h-4" /> Reliability
                </a>
                <a href="/admin/i18n" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors" data-testid="link-i18n-diagnostics">
                  <Globe className="w-4 h-4" /> i18n diagnostics
                </a>
              </div>
              {/* Tab Navigation */}
              <div className="flex gap-1 mb-8 bg-white rounded-lg border border-primary/10 p-1 overflow-x-auto" data-testid="nav-admin-tabs">
                {(["overview", "users", "activity", "content-engine", "content-growth", "qbank-pipeline", "analytics", "promotions", "feedback", "social", "audit", "deck-moderation", "ai-safety", "beta-testers", "flashcard-preview", "content-security", "pricing", "sub-analytics", "trial-analytics", "cert-analytics", "tutor-management", "expansion-roadmap", "content-health"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    data-testid={`tab-${tab}`}
                  >
                    {tab === "overview" && "Overview"}
                    {tab === "users" && `Users (${data.overview.totalUsers})`}
                    {tab === "activity" && "Recent Activity"}
                    {tab === "content-engine" && "Content Engine"}
                    {tab === "content-growth" && "Content Growth"}
                    {tab === "analytics" && "Site Analytics"}
                    {tab === "promotions" && "Promotions"}
                    {tab === "feedback" && "Feedback"}
                    {tab === "social" && "Social Scheduler"}
                    {tab === "audit" && "Audit Log"}
                    {tab === "deck-moderation" && "Deck Reports"}
                    {tab === "ai-safety" && "AI Safety"}
                    {tab === "beta-testers" && "Beta Testers"}
                    {tab === "flashcard-preview" && "Flashcard Preview"}
                    {tab === "content-security" && "Content Security"}
                    {tab === "pricing" && "Pricing Plans"}
                    {tab === "sub-analytics" && "Sub Analytics"}
                    {tab === "trial-analytics" && "Trial Analytics"}
                    {tab === "cert-analytics" && "Cert Exam Banks"}
                    {tab === "tutor-management" && "Tutor Management"}
                    {tab === "qbank-pipeline" && "QBank Pipeline"}
                    {tab === "expansion-roadmap" && "Expansion Roadmap"}
                    {tab === "content-health" && "Content Health"}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <Card className="border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-emerald-50" data-testid="card-build-priority">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-teal-800">NEXT_BUILD_PRIORITY: {NEXT_BUILD_PRIORITY.toUpperCase()}</div>
                            <div className="text-xs text-teal-600">{BUILD_PRIORITY_META[NEXT_BUILD_PRIORITY].label} — Full Tier Expansion</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="text-center">
                            <div className="font-bold text-teal-700">{getQuestionCount(BUILD_PRIORITY_META[NEXT_BUILD_PRIORITY].slug).toLocaleString()}</div>
                            <div className="text-teal-500">{t("pages.admin.questions")}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-teal-700">{BUILD_PRIORITY_META[NEXT_BUILD_PRIORITY].targetCategories}</div>
                            <div className="text-teal-500">{t("pages.admin.domains")}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-teal-700">{BUILD_PRIORITY_META[NEXT_BUILD_PRIORITY].targetMockExams}</div>
                            <div className="text-teal-500">{t("pages.admin.mockExams")}</div>
                          </div>
                          <Badge className="bg-teal-200 text-teal-800 border-teal-300">{BUILD_PRIORITY_META[NEXT_BUILD_PRIORITY].status === "in-progress" ? "In Progress" : "Complete"}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="section-kpi">
                    {[
                      { label: "Total Users", value: data.overview.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Active (7 days)", value: data.overview.activeUsers7Day, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
                      { label: "Active (30 days)", value: data.overview.activeUsers30Day, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                      { label: "Total Tests", value: data.overview.totalTests, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Lessons Accessed", value: data.overview.totalLessonsAccessed, icon: BookOpen, color: "text-cyan-600", bg: "bg-cyan-50" },
                      { label: "Notes Created", value: data.overview.totalNotes, icon: StickyNote, color: "text-pink-600", bg: "bg-pink-50" },
                      { label: "Avg Test Score", value: `${data.overview.averageTestScore}%`, icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" },
                      {
                        label: "Retention Rate",
                        value:
                          data.overview.totalUsers > 0
                            ? `${Math.round((data.overview.activeUsers30Day / data.overview.totalUsers) * 100)}%`
                            : "0%",
                        icon: Clock,
                        color: "text-teal-600",
                        bg: "bg-teal-50",
                      },
                    ].map((kpi, i) => (
                      <Card key={i} className="border border-primary/10" data-testid={`card-kpi-${i}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                              <div className="text-xs text-gray-500">{kpi.label}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex gap-3 flex-wrap" data-testid="section-quick-tools">
                    <a
                      href="/admin/content-manager"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium hover:bg-green-100 transition"
                      data-testid="link-content-manager"
                    >
                      <Database className="w-4 h-4" />
                      Content Manager
                    </a>
                    <a
                      href="/admin/qbank/import"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
                      data-testid="link-qbank-import"
                    >
                      <Plus className="w-4 h-4" />
                      Import Questions
                    </a>
                    <a
                      href="/admin/qbank/manage"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
                      data-testid="link-qbank-manage"
                    >
                      <Pencil className="w-4 h-4" />
                      Manage Questions
                    </a>
                    <a
                      href="/admin/content-analytics"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition"
                      data-testid="link-content-analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Content Analytics
                    </a>
                    <a
                      href="/admin/profession-analytics"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-100 transition"
                      data-testid="link-profession-analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Profession Analytics
                    </a>
                    <a
                      href="/admin/cross-platform"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition"
                      data-testid="link-cross-platform-analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Cross-Platform Flow
                    </a>
                    <a
                      href="/admin/generator-v2"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
                      data-testid="link-generator-v2"
                    >
                      <Zap className="w-4 h-4" />
                      Generator V2 (Chunked Pipeline)
                    </a>
                    <a
                      href="/admin/database-status"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium hover:bg-orange-100 transition"
                      data-testid="link-database-status"
                    >
                      <Database className="w-4 h-4" />
                      Database Status & Sync
                    </a>
                    <a
                      href="/admin/environment-audit"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium hover:bg-red-100 transition"
                      data-testid="link-environment-audit"
                    >
                      <Shield className="w-4 h-4" />
                      Environment Audit Log
                    </a>
                    <a
                      href="/admin/environment-diagnostic"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
                      data-testid="link-environment-diagnostic"
                    >
                      <Lock className="w-4 h-4" />
                      Environment & Publish Check
                    </a>
                    <a
                      href="/admin/demo-screenshot-studio"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition"
                      data-testid="link-screenshot-studio"
                    >
                      <Eye className="w-4 h-4" />
                      Screenshot Studio
                    </a>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border border-primary/10" data-testid="card-tier-distribution">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" /> Subscription Tiers
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {Object.entries(data.tiers).map(([tier, count]) => (
                            <div key={tier} className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[tier] || "bg-gray-100 text-gray-700"}`}>
                                {tierLabels[tier] || tier}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${(count / data.overview.totalUsers) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-primary/10" data-testid="card-status-distribution">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Subscription Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {Object.entries(data.subscriptionStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${(count / data.overview.totalUsers) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-primary/10" data-testid="card-region-distribution">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Regions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {Object.entries(data.regions).map(([region, count]) => (
                            <div key={region} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{region === "CA" ? "Canada" : region === "US" ? "United States" : region}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${(count / data.overview.totalUsers) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("pages.admin.searchUsersByNameEmail")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-primary/10 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        data-testid="input-search-users"
                      />
                    </div>
                    <span className="text-sm text-gray-500">{filteredUsers.length} users</span>
                  </div>

                  <Card className="border border-primary/10 overflow-hidden" data-testid="card-users-table">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-primary/10">
                            <th
                              className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                              onClick={() => toggleSort("username")}
                            >
                              User <SortIcon field="username" />
                            </th>
                            <th
                              className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                              onClick={() => toggleSort("tier")}
                            >
                              Tier <SortIcon field="tier" />
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("pages.admin.status")}</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">{t("pages.admin.region")}</th>
                            <th
                              className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                              onClick={() => toggleSort("testsCompleted")}
                            >
                              Tests <SortIcon field="testsCompleted" />
                            </th>
                            <th
                              className="text-center px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                              onClick={() => toggleSort("lessonsAccessed")}
                            >
                              Lessons <SortIcon field="lessonsAccessed" />
                            </th>
                            <th className="text-center px-4 py-3 font-medium text-gray-600">{t("pages.admin.notes")}</th>
                            <th
                              className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900"
                              onClick={() => toggleSort("lastActivity")}
                            >
                              Last Active <SortIcon field="lastActivity" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedUsers.map((u) => (
                            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors" data-testid={`row-user-${u.id}`}>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-medium text-gray-900">{u.username}</div>
                                  <div className="text-xs text-gray-400">{u.email || "No email"}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[u.tier] || "bg-gray-100 text-gray-700"}`}>
                                  {tierLabels[u.tier] || u.tier}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    statusColors[u.subscriptionStatus] || "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {u.subscriptionStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{u.region}</td>
                              <td className="px-4 py-3 text-center text-gray-700">{u.testsCompleted}</td>
                              <td className="px-4 py-3 text-center text-gray-700">{u.lessonsAccessed}</td>
                              <td className="px-4 py-3 text-center text-gray-700">{u.notesCreated}</td>
                              <td className="px-4 py-3 text-right text-gray-500 text-xs">{formatDate(u.lastActivity)}</td>
                            </tr>
                          ))}
                          {sortedUsers.length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                                {searchQuery ? "No users match your search" : "No users yet"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  <Card className="border border-primary/10" data-testid="card-recent-activity">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-gray-700">{t("pages.admin.recentTestActivity")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.recentActivity.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">{t("pages.admin.noTestActivityRecordedYet")}</p>
                      ) : (
                        <div className="space-y-3">
                          {data.recentActivity.map((act, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0" data-testid={`row-activity-${i}`}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {act.username} took a {act.testType}
                                  </div>
                                  <div className="text-xs text-gray-400">{formatLessonId(act.lessonId)}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-sm font-semibold ${
                                    act.totalQuestions > 0 && act.score / act.totalQuestions >= 0.8
                                      ? "text-green-600"
                                      : act.totalQuestions > 0 && act.score / act.totalQuestions >= 0.6
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {act.score}/{act.totalQuestions} ({act.totalQuestions > 0 ? Math.round((act.score / act.totalQuestions) * 100) : 0}%)
                                </div>
                                <div className="text-xs text-gray-400">{formatDate(act.date)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Content Engine Tab */}
              {activeTab === "content-engine" && (
                <div className="space-y-6">
                  <Card className="border border-primary/10 mb-4" data-testid="card-ai-generator">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-gray-700">{t("pages.admin.blogPostGenerator")}</span>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t("pages.admin.apa7Citations")}</span>
                        </div>
                        <button
                          onClick={() => setBatchMode(!batchMode)}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${batchMode ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}
                          data-testid="button-toggle-batch"
                        >
                          {batchMode ? "Batch Mode ON" : "Switch to Batch"}
                        </button>
                      </div>

                      {!batchMode ? (
                        <>
                          <div className="flex gap-2">
                            <Input
                              placeholder={t("pages.admin.enterATopicEgDiabetic")}
                              value={blogTopic}
                              onChange={(e) => setBlogTopic(e.target.value)}
                              className="flex-1 text-sm"
                              data-testid="input-ai-topic"
                            />
                            <Button
                              onClick={() => { handleGenerateBlogPost(); }}
                              disabled={blogGenerating || !blogTopic.trim()}
                              className="shrink-0 gap-1.5"
                              data-testid="button-generate-blog"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {blogGenerating ? "Generating..." : "Generate & Post Now"}
                            </Button>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2">{t("pages.admin.enterANursingTopicAnd")}</p>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <Textarea
                            placeholder={"Enter one topic per line, e.g.:\nDiabetic Ketoacidosis management\nHeart failure nursing interventions\nSepsis identification and early treatment\nPediatric asthma assessment"}
                            value={batchTopics}
                            onChange={(e) => setBatchTopics(e.target.value)}
                            rows={6}
                            className="text-sm font-mono"
                            data-testid="input-batch-topics"
                          />
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <label className="text-[10px] font-medium text-gray-500">{t("pages.admin.scheduleMode")}</label>
                              <div className="flex rounded-md border overflow-hidden">
                                {([
                                  { value: "smart" as const, label: "Fill Empty Days" },
                                  { value: "manual" as const, label: "Manual Override" },
                                ]).map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() => { setBatchScheduleMode(opt.value); setBatchPublishAll(false); }}
                                    disabled={batchPublishAll}
                                    className={`px-3 py-1 text-[11px] font-medium transition-colors ${batchScheduleMode === opt.value && !batchPublishAll ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"} ${batchPublishAll ? "opacity-50" : ""}`}
                                    data-testid={`button-schedule-mode-${opt.value}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => setBatchPublishAll(!batchPublishAll)}
                                className={`ml-auto px-3 py-1 text-[11px] font-medium rounded-md border transition-colors ${batchPublishAll ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-500 border-gray-200 hover:border-red-300"}`}
                                data-testid="button-batch-publish-all"
                              >
                                {batchPublishAll ? "Publish All Now" : "Publish Immediately"}
                              </button>
                            </div>

                            {!batchPublishAll && batchScheduleMode === "smart" && occupiedDays.length > 0 && (
                              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-[10px] font-medium text-amber-700 mb-1.5">{t("pages.admin.daysWithExistingPostsWill")}</p>
                                <div className="flex flex-wrap gap-1">
                                  {occupiedDays.slice(0, 14).map((d) => (
                                    <span key={d} className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded font-mono">
                                      {new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                    </span>
                                  ))}
                                  {occupiedDays.length > 14 && <span className="text-[10px] text-amber-600">+{occupiedDays.length - 14} more</span>}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="text-[10px] font-medium text-gray-500 mb-1 block">
                                  {batchScheduleMode === "smart" ? "Start Looking From" : "Start Date"}
                                </label>
                                <input
                                  type="date"
                                  value={batchStartDate}
                                  onChange={(e) => { setBatchStartDate(e.target.value); setBatchPublishAll(false); }}
                                  className="w-full border rounded-md px-3 py-1.5 text-sm bg-white"
                                  disabled={batchPublishAll}
                                  data-testid="input-batch-start-date"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-medium text-gray-500 mb-1 block">{t("pages.admin.postsPerDay")}</label>
                                <div className="flex rounded-md border overflow-hidden">
                                  {[1, 2, 3, 5, 10].map((n) => (
                                    <button
                                      key={n}
                                      onClick={() => setBatchPostsPerDay(n)}
                                      disabled={batchPublishAll}
                                      className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${batchPostsPerDay === n && !batchPublishAll ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"} ${batchPublishAll ? "opacity-50" : ""}`}
                                      data-testid={`button-batch-ppd-${n}`}
                                    >
                                      {n}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="col-span-2 flex items-end">
                                <div className="text-[10px] text-gray-400 leading-tight">
                                  {(() => {
                                    const count = batchTopics.split("\n").filter(t => t.trim()).length;
                                    if (batchPublishAll) return `${count} topics. All will publish immediately.`;
                                    if (batchScheduleMode === "smart") {
                                      return `${count} topics, ${batchPostsPerDay}/day. Will fill ${Math.ceil(count / batchPostsPerDay)} empty day${Math.ceil(count / batchPostsPerDay) !== 1 ? "s" : ""} starting ${new Date(batchStartDate + "T09:00:00").toLocaleDateString()}. Days with existing posts will be skipped.`;
                                    }
                                    const days = Math.ceil(count / batchPostsPerDay);
                                    const startLabel = batchStartDate ? new Date(batchStartDate + "T09:00:00").toLocaleDateString() : "today";
                                    return `${count} topics, ${batchPostsPerDay}/day over ${days} day${days !== 1 ? "s" : ""} starting ${startLabel}. Existing posts on those days will not be moved.`;
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handleBatchGenerate}
                              disabled={blogGenerating || batchTopics.split("\n").filter(t => t.trim()).length === 0}
                              className="gap-2"
                              data-testid="button-batch-generate"
                            >
                              {blogGenerating ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Generating {batchProgress ? `${batchProgress.current}/${batchProgress.total}` : "..."}
                                </>
                              ) : (
                                <>{batchPublishAll ? "Generate & Publish" : "Generate & Schedule"} {batchTopics.split("\n").filter(t => t.trim()).length} Posts</>
                              )}
                            </Button>
                            <span className="text-[10px] text-gray-400">{t("pages.admin.max20TopicsPerBatch")}</span>
                          </div>
                          {batchProgress && batchProgress.results.length > 0 && (
                            <div className="mt-2 p-3 rounded-lg bg-gray-50 border text-xs space-y-1 max-h-40 overflow-y-auto">
                              {batchProgress.results.map((r: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  {r.status === "success" ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                                  )}
                                  <span className="truncate">{r.title || r.topic || `Topic ${r.index + 1}`}</span>
                                  {r.scheduledAt && <span className="text-gray-400 shrink-0">({new Date(r.scheduledAt).toLocaleDateString()})</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10 mb-4" data-testid="card-image-generator">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-gray-700">{t("pages.admin.medicalImageGenerator")}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{t("pages.admin.aiPowered")}</span>
                        </div>
                        <button
                          onClick={() => {
                            setShowImageLibrary(!showImageLibrary);
                            if (!showImageLibrary) {
                              const stored = localStorage.getItem("nursenest-credentials");
                              if (stored) {
                                const { username, password } = JSON.parse(stored);
                                fetch(`/api/admin/generated-images?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
                                  .then(r => r.json()).then(setGeneratedImages).catch(() => {});
                              }
                            }
                          }}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${showImageLibrary ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}
                          data-testid="button-toggle-image-library"
                        >
                          {showImageLibrary ? "Hide Library" : "Image Library"}
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Textarea
                          placeholder={t("pages.admin.describeTheMedicalImageYou")}
                          value={imageGenPrompt}
                          onChange={(e) => setImageGenPrompt(e.target.value)}
                          rows={3}
                          className="text-sm"
                          data-testid="input-image-prompt"
                        />
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="text-[10px] font-medium text-gray-500 mb-1 block">{t("pages.admin.filenameOptional")}</label>
                            <Input
                              placeholder="e.g., barrel-chest-comparison"
                              value={imageGenFilename}
                              onChange={(e) => setImageGenFilename(e.target.value)}
                              className="text-sm"
                              data-testid="input-image-filename"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-gray-500 mb-1 block">{t("pages.admin.size")}</label>
                            <div className="flex rounded-md border overflow-hidden">
                              {(["1024x1024", "512x512"] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setImageGenSize(s)}
                                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${imageGenSize === s ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                                  data-testid={`button-image-size-${s}`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={async () => {
                              if (!imageGenPrompt.trim()) return;
                              setImageGenLoading(true);
                              try {
                                const stored = localStorage.getItem("nursenest-credentials");
                                const creds = stored ? JSON.parse(stored) : {};
                                const res = await fetch("/api/admin/generate-image", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    prompt: imageGenPrompt,
                                    size: imageGenSize,
                                    filename: imageGenFilename || undefined,
                                    username: creds.username,
                                    password: creds.password,
                                  }),
                                });
                                if (!res.ok) {
                                  const err = await res.json();
                                  alert("Error: " + (err.error || "Failed to generate image"));
                                } else {
                                  const data = await res.json();
                                  setGeneratedImages(prev => [{ filename: data.filename, url: data.url, size: data.size, createdAt: new Date().toISOString() }, ...prev]);
                                  setShowImageLibrary(true);
                                  setImageGenPrompt("");
                                  setImageGenFilename("");
                                }
                              } catch (e: any) {
                                alert("Error: " + e.message);
                              } finally {
                                setImageGenLoading(false);
                              }
                            }}
                            disabled={imageGenLoading || !imageGenPrompt.trim()}
                            className="shrink-0 gap-1.5"
                            data-testid="button-generate-image"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            {imageGenLoading ? "Generating..." : "Generate"}
                          </Button>
                        </div>
                        <p className="text-[10px] text-gray-400">{t("pages.admin.imagesAreAutoprefixedWithMedical")}</p>
                      </div>

                      {showImageLibrary && (
                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-600">Generated Images ({generatedImages.length})</span>
                            <button
                              onClick={() => {
                                const stored = localStorage.getItem("nursenest-credentials");
                                if (stored) {
                                  const { username, password } = JSON.parse(stored);
                                  fetch(`/api/admin/generated-images?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
                                    .then(r => r.json()).then(setGeneratedImages).catch(() => {});
                                }
                              }}
                              className="text-[10px] text-primary hover:underline"
                              data-testid="button-refresh-images"
                            >
                              Refresh
                            </button>
                          </div>
                          {generatedImages.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-4">{t("pages.admin.noGeneratedImagesYetGenerate")}</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                              {generatedImages.map((img) => (
                                <div key={img.filename} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50" data-testid={`image-library-item-${img.filename}`}>
                                  <img src={img.url} alt={img.filename} className="w-full aspect-square object-cover" loading="lazy" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                    <button
                                      onClick={() => { navigator.clipboard.writeText(img.url); alert("URL copied: " + img.url); }}
                                      className="text-[10px] bg-white text-gray-800 px-2 py-1 rounded shadow hover:bg-gray-100"
                                      data-testid={`button-copy-url-${img.filename}`}
                                    >
                                      Copy URL
                                    </button>
                                    <button
                                      onClick={() => { setImageGenPrompt("Variation of: "); setShowImageLibrary(false); }}
                                      className="text-[10px] bg-primary text-white px-2 py-1 rounded shadow hover:bg-primary/90"
                                      data-testid={`button-regenerate-${img.filename}`}
                                    >
                                      Regenerate
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!confirm("Delete this image?")) return;
                                        const stored = localStorage.getItem("nursenest-credentials");
                                        const creds = stored ? JSON.parse(stored) : {};
                                        await fetch(`/api/admin/generated-images/${img.filename}?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`, { method: "DELETE" });
                                        setGeneratedImages(prev => prev.filter(i => i.filename !== img.filename));
                                      }}
                                      className="text-[10px] bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600"
                                      data-testid={`button-delete-image-${img.filename}`}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                  <div className="px-2 py-1.5">
                                    <p className="text-[9px] text-gray-500 truncate" title={img.filename}>{img.filename}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10 mb-4" data-testid="card-microlecture-generator">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-gray-700">{t("pages.admin.microlectureGenerator")}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{t("pages.admin.aiPowered2")}</span>
                        </div>
                        <button
                          onClick={() => {
                            setShowMlLibrary(!showMlLibrary);
                            if (!showMlLibrary) {
                              const stored = localStorage.getItem("nursenest-credentials");
                              if (stored) {
                                const { username, password } = JSON.parse(stored);
                                fetch(`/api/admin/microlectures?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
                                  .then(r => r.json()).then(setMlGenerated).catch(() => {});
                              }
                            }
                          }}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors ${showMlLibrary ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}
                          data-testid="button-toggle-ml-library"
                        >
                          {showMlLibrary ? "Hide Library" : "Generated Lectures"}
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder={t("pages.admin.topicEgHeartFailureHyperkalemia")}
                          value={mlTopic}
                          onChange={(e) => setMlTopic(e.target.value)}
                          className="text-sm"
                          data-testid="input-ml-topic"
                        />
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="text-[10px] font-medium text-gray-500 mb-1 block">{t("pages.admin.focusOptional")}</label>
                            <Input
                              placeholder="e.g., ECG interpretation, medication safety"
                              value={mlFocus}
                              onChange={(e) => setMlFocus(e.target.value)}
                              className="text-sm"
                              data-testid="input-ml-focus"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-gray-500 mb-1 block">{t("pages.admin.tier")}</label>
                            <div className="flex rounded-md border overflow-hidden">
                              {(["RPN", "RN", "NP"] as const).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setMlTier(t)}
                                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${mlTier === t ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                                  data-testid={`button-ml-tier-${t}`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={async () => {
                              if (!mlTopic.trim()) return;
                              setMlLoading(true);
                              try {
                                const stored = localStorage.getItem("nursenest-credentials");
                                const creds = stored ? JSON.parse(stored) : {};
                                const res = await fetch("/api/admin/generate-microlecture", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ topic: mlTopic, tier: mlTier, focus: mlFocus || undefined, username: creds.username, password: creds.password }),
                                });
                                if (!res.ok) {
                                  const err = await res.json();
                                  alert("Error: " + (err.error || "Failed to generate lecture"));
                                } else {
                                  const data = await res.json();
                                  setMlGenerated(prev => [data.lecture, ...prev]);
                                  setShowMlLibrary(true);
                                  setMlTopic("");
                                  setMlFocus("");
                                }
                              } catch (e: any) {
                                alert("Error: " + e.message);
                              } finally {
                                setMlLoading(false);
                              }
                            }}
                            disabled={mlLoading || !mlTopic.trim()}
                            className="shrink-0 gap-1.5"
                            data-testid="button-generate-ml"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            {mlLoading ? "Generating..." : "Generate"}
                          </Button>
                        </div>
                        <p className="text-[10px] text-gray-400">{t("pages.admin.generates815SlideLectureWith")}</p>
                      </div>

                      {showMlLibrary && (
                        <div className="mt-4 border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-600">Generated Lectures ({mlGenerated.length})</span>
                            <button
                              onClick={() => {
                                const stored = localStorage.getItem("nursenest-credentials");
                                if (stored) {
                                  const { username, password } = JSON.parse(stored);
                                  fetch(`/api/admin/microlectures?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
                                    .then(r => r.json()).then(setMlGenerated).catch(() => {});
                                }
                              }}
                              className="text-[10px] text-primary hover:underline"
                              data-testid="button-refresh-ml"
                            >
                              Refresh
                            </button>
                          </div>
                          {mlGenerated.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-4">{t("pages.admin.noGeneratedLecturesYetCreate")}</p>
                          ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {mlGenerated.map((ml: any) => (
                                <div key={ml.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50" data-testid={`ml-item-${ml.id}`}>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{ml.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{ml.tier}</span>
                                      <span className="text-[10px] text-gray-400">{ml.durationEstimate}</span>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${ml.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                        {ml.isPublished ? "Published" : "Draft"}
                                      </span>
                                      {ml.slidesJson && <span className="text-[10px] text-gray-400">{Array.isArray(ml.slidesJson) ? ml.slidesJson.length : 0} slides</span>}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 ml-2">
                                    <button
                                      onClick={async () => {
                                        const stored = localStorage.getItem("nursenest-credentials");
                                        const creds = stored ? JSON.parse(stored) : {};
                                        await fetch(`/api/admin/microlectures/${ml.id}/publish`, {
                                          method: "PUT",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ publish: !ml.isPublished, username: creds.username, password: creds.password }),
                                        });
                                        setMlGenerated(prev => prev.map(m => m.id === ml.id ? { ...m, isPublished: !m.isPublished } : m));
                                      }}
                                      className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded hover:border-primary"
                                      data-testid={`button-publish-ml-${ml.id}`}
                                    >
                                      {ml.isPublished ? "Unpublish" : "Publish"}
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!confirm("Delete this lecture?")) return;
                                        const stored = localStorage.getItem("nursenest-credentials");
                                        const creds = stored ? JSON.parse(stored) : {};
                                        await fetch(`/api/admin/microlectures/${ml.id}?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`, { method: "DELETE" });
                                        setMlGenerated(prev => prev.filter(m => m.id !== ml.id));
                                      }}
                                      className="text-[10px] bg-red-50 border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                                      data-testid={`button-delete-ml-${ml.id}`}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {publishQueue.length > 0 && (
                    <Button
                      className="w-full h-10 text-sm font-semibold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm mb-3"
                      onClick={publishScheduledNow}
                      data-testid="button-publish-now-top"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Publish Now ({publishQueue.filter((p: any) => p.scheduledAt && new Date(p.scheduledAt) <= new Date()).length} due)
                    </Button>
                  )}

                  <Card className="border border-amber-200 bg-amber-50/30" data-testid="card-publish-queue">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-gray-700">Scheduled Posts ({publishQueue.length})</span>
                          {queueLoading && <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedQueueIds.size > 0 && (
                            <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={deleteSelectedQueueItems} data-testid="button-delete-selected-queue">
                              <Trash2 className="w-3 h-3" />
                              Delete {selectedQueueIds.size} Selected
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={fetchPublishQueue} data-testid="button-refresh-queue">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {publishQueue.length === 0 ? (
                        <div className="text-center py-6">
                          <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">{t("pages.admin.noScheduledPostsInThe")}</p>
                          <p className="text-[10px] text-gray-300 mt-1">{t("pages.admin.generateABatchOfPosts")}</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-amber-200/50 mb-1">
                            <input
                              type="checkbox"
                              checked={publishQueue.length > 0 && selectedQueueIds.size === publishQueue.length}
                              onChange={toggleSelectAllQueue}
                              className="w-3.5 h-3.5 rounded border-gray-300 accent-primary cursor-pointer"
                              data-testid="checkbox-select-all-queue"
                            />
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{t("pages.admin.selectAll")}</span>
                          </div>
                          {publishQueue.map((item: any, idx: number) => {
                            const scheduledDate = item.scheduledAt ? new Date(item.scheduledAt) : null;
                            const isPast = scheduledDate && scheduledDate <= new Date();
                            const isToday = scheduledDate && scheduledDate.toDateString() === new Date().toDateString();
                            const isSelected = selectedQueueIds.has(item.id);
                            return (
                              <div key={item.id} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${isSelected ? "bg-primary/5 border-primary/30 ring-1 ring-primary/10" : isPast ? "bg-red-50 border-red-200" : isToday ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-100"}`} data-testid={`queue-item-${item.id}`}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleQueueSelection(item.id)}
                                  className="w-3.5 h-3.5 rounded border-gray-300 accent-primary cursor-pointer shrink-0"
                                  data-testid={`checkbox-queue-${item.id}`}
                                />
                                <div className="text-[10px] font-bold text-gray-400 w-4 text-center shrink-0">{idx + 1}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {isPast && <span className="text-[9px] font-bold text-red-500 uppercase">{t("pages.admin.overdue")}</span>}
                                    {isToday && !isPast && <span className="text-[9px] font-bold text-yellow-600 uppercase">{t("pages.admin.today")}</span>}
                                    <span className="text-[10px] text-gray-400">
                                      {scheduledDate ? scheduledDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) + " at " + scheduledDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "No date set"}
                                    </span>
                                    {item.authorName && <span className="text-[10px] text-gray-300">by {item.authorName}</span>}
                                  </div>
                                </div>
                                <input
                                  type="datetime-local"
                                  defaultValue={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ""}
                                  onChange={(e) => updateQueueItem(item.id, { scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                                  className="text-[10px] border rounded px-1.5 py-1 w-40 bg-white"
                                  data-testid={`input-queue-date-${item.id}`}
                                />
                                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 shrink-0" onClick={() => updateQueueItem(item.id, { status: "published" })} data-testid={`button-queue-publish-${item.id}`}>
                                  Publish
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => deleteQueueItem(item.id, item.title)} data-testid={`button-queue-delete-${item.id}`}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {publishQueue.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between text-[10px] text-gray-400">
                          <span>
                            {(() => {
                              const dates = publishQueue.filter((p: any) => p.scheduledAt).map((p: any) => new Date(p.scheduledAt));
                              if (dates.length === 0) return "No dates set";
                              const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
                              const latest = new Date(Math.max(...dates.map(d => d.getTime())));
                              return `${earliest.toLocaleDateString("en-US", { month: "short", day: "numeric" })} to ${latest.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
                            })()}
                          </span>
                          <span>{publishQueue.filter((p: any) => p.scheduledAt && new Date(p.scheduledAt) <= new Date()).length} overdue</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-3 md:grid-cols-3 gap-3" data-testid="section-quick-actions">
                    <button
                      onClick={() => startNewContent("blog")}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      data-testid="button-new-blog"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{t("pages.admin.newBlogPost")}</span>
                      <span className="text-[10px] text-gray-400">{t("pages.admin.writeManually")}</span>
                    </button>
                    <button
                      onClick={() => startNewContent("flashcard-set")}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                      data-testid="button-new-flashcards"
                    >
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Layers className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{t("pages.admin.newFlashcards")}</span>
                      <span className="text-[10px] text-gray-400">{t("pages.admin.qaCardSet")}</span>
                    </button>
                    <button
                      onClick={() => startNewContent("lesson")}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition-all group"
                      data-testid="button-new-lesson"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{t("pages.admin.newLesson")}</span>
                      <span className="text-[10px] text-gray-400">{t("pages.admin.educationalContent")}</span>
                    </button>
                  </div>

                  <Card className="border border-primary/10" data-testid="card-blog-automation">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">{t("pages.admin.blogAutomation")}</span>
                            <Button
                              size="sm"
                              variant={blogConfig?.isActive ? "default" : "outline"}
                              onClick={() => handleBlogConfigUpdate({ isActive: !blogConfig?.isActive })}
                              className={`h-7 text-xs ${blogConfig?.isActive ? "bg-green-600 hover:bg-green-700" : ""}`}
                              data-testid="button-toggle-blog-automation"
                            >
                              {blogConfig?.isActive ? "ON" : "OFF"}
                            </Button>
                          </div>
                          <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
                            <span>Day {blogConfig?.dayCount || 0}</span>
                            <span>{blogConfig?.totalPostsGenerated || 0} posts</span>
                            <span>{blogConfig?.postsPerDay || 2}/day</span>
                            <span>Last: {blogConfig?.lastPostAt ? formatDate(blogConfig.lastPostAt) : "Never"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex rounded border overflow-hidden">
                            {[1, 2, 3].map((n) => (
                              <button
                                key={n}
                                onClick={() => handleBlogConfigUpdate({ postsPerDay: n })}
                                className={`px-2 py-1 text-xs ${(blogConfig?.postsPerDay || 2) === n ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                                data-testid={`button-posts-per-day-${n}`}
                              >
                                {n}x
                              </button>
                            ))}
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleRunScheduler} disabled={blogGenerating} data-testid="button-run-scheduler">
                            {blogGenerating ? "Running..." : "Run Now"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10" data-testid="card-all-content">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-gray-700">All Content ({blogPosts.length})</CardTitle>
                        <Button size="sm" variant="ghost" onClick={() => fetchBlogPosts()} data-testid="button-refresh-content">
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingPost ? (
                        <div className="space-y-4" data-testid="blog-post-editor">
                          <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-sm font-semibold">
                              {creatingNew ? `New ${(editingPost.type || "blog").replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}` : "Edit Content"}
                            </h3>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveBlogPost} disabled={savingPost || !editingPost.title || !editingPost.slug} data-testid="button-save-blog-post">
                                <Save className="w-3 h-3 mr-1" /> {savingPost ? "Saving..." : "Save"}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { setEditingPost(null); setCreatingNew(false); }} data-testid="button-cancel-edit">
                                <X className="w-3 h-3 mr-1" /> Cancel
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.title")}</label>
                              <Input
                                value={editingPost.title || ""}
                                onChange={(e) => {
                                  const title = e.target.value;
                                  setEditingPost((prev: any) => ({
                                    ...prev,
                                    title,
                                    slug: creatingNew ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : prev.slug,
                                  }));
                                }}
                                placeholder={t("pages.admin.contentTitle")}
                                data-testid="input-edit-title"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.type")}</label>
                              <select
                                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                value={editingPost.type || "blog"}
                                onChange={(e) => setEditingPost((prev: any) => ({ ...prev, type: e.target.value }))}
                                data-testid="select-edit-type"
                              >
                                <option value="blog">{t("pages.admin.blogPost")}</option>
                                <option value="article">{t("pages.admin.article")}</option>
                                <option value="lesson">{t("pages.admin.lesson")}</option>
                                <option value="flashcard-set">{t("pages.admin.flashcardSet")}</option>
                                <option value="guide">{t("pages.admin.guide")}</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.slug")}</label>
                              <Input
                                value={editingPost.slug || ""}
                                onChange={(e) => setEditingPost((prev: any) => ({ ...prev, slug: e.target.value }))}
                                placeholder="url-slug"
                                data-testid="input-edit-slug"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.status2")}</label>
                              <select
                                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                value={editingPost.status || "draft"}
                                onChange={(e) => setEditingPost((prev: any) => ({ ...prev, status: e.target.value }))}
                                data-testid="select-edit-status"
                              >
                                <option value="draft">{t("pages.admin.draft")}</option>
                                <option value="published">{t("pages.admin.published")}</option>
                                <option value="scheduled">{t("pages.admin.scheduled")}</option>
                                <option value="archived">{t("pages.admin.archived")}</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.category")}</label>
                              <select
                                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                value={editingPost.category || ""}
                                onChange={(e) => setEditingPost((prev: any) => ({ ...prev, category: e.target.value }))}
                                data-testid="select-edit-category"
                              >
                                <option value="">{t("pages.admin.none")}</option>
                                <option value="clinical-reasoning">{t("pages.admin.clinicalReasoning")}</option>
                                <option value="pharmacology">{t("pages.admin.pharmacology")}</option>
                                <option value="lab-interpretation">{t("pages.admin.labInterpretation")}</option>
                                <option value="exam-prep">{t("pages.admin.examPrep")}</option>
                                <option value="patient-safety">{t("pages.admin.patientSafety")}</option>
                                <option value="pathophysiology">{t("pages.admin.pathophysiology")}</option>
                                <option value="assessment-skills">{t("pages.admin.assessmentSkills")}</option>
                                <option value="medication-safety">{t("pages.admin.medicationSafety")}</option>
                                <option value="nursing-fundamentals">{t("pages.admin.nursingFundamentals")}</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.tier2")}</label>
                              <div className="flex rounded-lg border overflow-hidden" data-testid="tier-toggle">
                                {[
                                  { value: "free", label: "Free" },
                                  { value: "rpn", label: "RPN" },
                                  { value: "rn", label: "RN" },
                                  { value: "np", label: "NP" },
                                ].map((t) => (
                                  <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setEditingPost((prev: any) => ({ ...prev, tier: t.value }))}
                                    className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
                                      editingPost.tier === t.value
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                    data-testid={`button-tier-${t.value}`}
                                  >
                                    {t.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-xs font-semibold text-blue-700">{t("pages.admin.publishingOptions")}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex-1 min-w-[200px]">
                                <label className="text-[10px] text-blue-600 block mb-1">{t("pages.admin.scheduleDateTime")}</label>
                                <Input
                                  type="datetime-local"
                                  value={editingPost.scheduledAt ? new Date(editingPost.scheduledAt).toISOString().slice(0, 16) : ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingPost((prev: any) => ({
                                      ...prev,
                                      scheduledAt: val ? new Date(val).toISOString() : null,
                                      status: val ? "scheduled" : prev.status,
                                    }));
                                  }}
                                  className="bg-white text-sm"
                                  data-testid="input-schedule-datetime"
                                />
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-xs text-blue-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editingPost.autoPublish || false}
                                    onChange={(e) => setEditingPost((prev: any) => ({ ...prev, autoPublish: e.target.checked }))}
                                    className="rounded"
                                    data-testid="checkbox-auto-publish"
                                  />
                                  Auto-publish
                                </label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                                  onClick={() => setEditingPost((prev: any) => ({ ...prev, status: "published", scheduledAt: null }))}
                                  data-testid="button-publish-now"
                                >
                                  Publish Now
                                </Button>
                              </div>
                            </div>
                            {editingPost.scheduledAt && (
                              <p className="text-[10px] text-blue-500 mt-2">
                                This post will be automatically published on {new Date(editingPost.scheduledAt).toLocaleString()}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.summary")}</label>
                            <Textarea
                              value={editingPost.summary || ""}
                              onChange={(e) => setEditingPost((prev: any) => ({ ...prev, summary: e.target.value }))}
                              placeholder={t("pages.admin.briefSummary")}
                              className="min-h-[50px]"
                              data-testid="textarea-edit-summary"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs text-gray-500">{t("pages.admin.contentBlocks")}</label>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const blocks = [...(editingPost.content || []), { type: "paragraph", content: "" }];
                                  setEditingPost((prev: any) => ({ ...prev, content: blocks }));
                                }}
                                data-testid="button-add-block"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Block
                              </Button>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                              {(editingPost.content || []).map((block: any, idx: number) => (
                                <div key={idx} className="flex gap-2 items-start border rounded p-2 bg-gray-50">
                                  <select
                                    className="border rounded px-2 py-1 text-xs bg-white shrink-0"
                                    value={block.type || "paragraph"}
                                    onChange={(e) => {
                                      const blocks = [...(editingPost.content || [])];
                                      blocks[idx] = { ...blocks[idx], type: e.target.value };
                                      setEditingPost((prev: any) => ({ ...prev, content: blocks }));
                                    }}
                                    data-testid={`select-block-type-${idx}`}
                                  >
                                    <option value="heading">{t("pages.admin.heading")}</option>
                                    <option value="paragraph">{t("pages.admin.paragraph")}</option>
                                    <option value="list">{t("pages.admin.list")}</option>
                                    <option value="callout">{t("pages.admin.callout")}</option>
                                    <option value="quote">{t("pages.admin.quote")}</option>
                                    <option value="code">{t("pages.admin.code")}</option>
                                    <option value="flashcard">{t("pages.admin.flashcard")}</option>
                                    <option value="references">{t("pages.admin.references")}</option>
                                    <option value="warning">{t("pages.admin.warning")}</option>
                                    <option value="medication">{t("pages.admin.medication")}</option>
                                  </select>
                                  <Textarea
                                    value={block.content || block.text || ""}
                                    onChange={(e) => {
                                      const blocks = [...(editingPost.content || [])];
                                      blocks[idx] = { ...blocks[idx], content: e.target.value };
                                      setEditingPost((prev: any) => ({ ...prev, content: blocks }));
                                    }}
                                    className="flex-1 text-sm min-h-[40px]"
                                    rows={block.type === "paragraph" ? 3 : 1}
                                    data-testid={`textarea-block-${idx}`}
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 shrink-0"
                                    onClick={() => {
                                      const blocks = (editingPost.content || []).filter((_: any, i: number) => i !== idx);
                                      setEditingPost((prev: any) => ({ ...prev, content: blocks }));
                                    }}
                                    data-testid={`button-remove-block-${idx}`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <details className="text-xs">
                            <summary className="text-gray-500 cursor-pointer hover:text-gray-700">{t("pages.admin.seoSettings")}</summary>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              <div>
                                <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.seoTitle")}</label>
                                <Input
                                  value={editingPost.seoTitle || ""}
                                  onChange={(e) => setEditingPost((prev: any) => ({ ...prev, seoTitle: e.target.value }))}
                                  placeholder={t("pages.admin.seoTitleOptional")}
                                  data-testid="input-edit-seo-title"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 block mb-1">{t("pages.admin.seoDescription")}</label>
                                <Input
                                  value={editingPost.seoDescription || ""}
                                  onChange={(e) => setEditingPost((prev: any) => ({ ...prev, seoDescription: e.target.value }))}
                                  placeholder={t("pages.admin.seoDescriptionOptional")}
                                  data-testid="input-edit-seo-desc"
                                />
                              </div>
                            </div>
                          </details>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              value={blogPostSearch}
                              onChange={(e) => setBlogPostSearch(e.target.value)}
                              placeholder={t("pages.admin.searchAllContent")}
                              className="pl-9"
                              data-testid="input-search-blog-posts"
                            />
                          </div>
                          {blogPostsLoading ? (
                            <p className="text-sm text-gray-500 text-center py-4">{t("pages.admin.loadingContent")}</p>
                          ) : blogPosts.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">{t("pages.admin.noContentFoundUseThe")}</p>
                          ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                              {blogPosts
                                .filter((p) => !blogPostSearch || p.title?.toLowerCase().includes(blogPostSearch.toLowerCase()))
                                .map((post) => (
                                <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors" data-testid={`blog-post-row-${post.id}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0 mr-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900 truncate">{post.title}</span>
                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${post.status === "published" ? "bg-green-50 text-green-700 border-green-200" : post.status === "scheduled" ? "bg-blue-50 text-blue-700 border-blue-200" : post.status === "archived" ? "bg-gray-50 text-gray-500" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                                          {post.status || "draft"}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 bg-white">
                                          {post.type || "blog"}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.updatedAt || post.createdAt)}</span>
                                        {post.category && <span>{post.category}</span>}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className="flex rounded border overflow-hidden">
                                        {[
                                          { value: "free", label: "Free" },
                                          { value: "rpn", label: "RPN" },
                                          { value: "rn", label: "RN" },
                                          { value: "np", label: "NP" },
                                        ].map((t) => (
                                          <button
                                            key={t.value}
                                            onClick={() => handleQuickTierChange(post.id, t.value)}
                                            className={`px-1.5 py-0.5 text-[10px] font-medium transition-all ${
                                              (post.tier || "free") === t.value
                                                ? "bg-primary text-white"
                                                : "bg-white text-gray-400 hover:bg-gray-100"
                                            }`}
                                            data-testid={`button-quick-tier-${t.value}-${post.id}`}
                                          >
                                            {t.label}
                                          </button>
                                        ))}
                                      </div>
                                      <div className="flex gap-0.5">
                                        {post.status === "published" && post.slug && (
                                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(`/learn/${post.slug}`, "_blank")} data-testid={`button-view-${post.id}`}>
                                            <ExternalLink className="w-3 h-3" />
                                          </Button>
                                        )}
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingPost({ ...post })} data-testid={`button-edit-${post.id}`}>
                                          <Pencil className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => handleDeleteBlogPost(post.id)} data-testid={`button-delete-${post.id}`}>
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10" data-testid="card-top-lessons">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-gray-700">{t("pages.admin.mostAccessedLessons")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {data.topLessons.length === 0 ? (
                        <p className="text-gray-400 text-center py-4 text-sm">{t("pages.admin.noLessonDataYet")}</p>
                      ) : (
                        <div className="space-y-2">
                          {data.topLessons.slice(0, 10).map((lesson, i) => {
                            const maxCount = data.topLessons[0]?.accessCount || 1;
                            return (
                              <div key={i} className="flex items-center gap-3" data-testid={`row-lesson-${i}`}>
                                <span className="text-xs font-mono text-gray-400 w-5 text-right">{i + 1}.</span>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-xs font-medium text-gray-900">{formatLessonId(lesson.lessonId)}</span>
                                    <span className="text-[10px] text-gray-500">{lesson.accessCount} views</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(lesson.accessCount / maxCount) * 100}%` }} />
                                  </div>
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

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-6" data-testid="section-site-analytics">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{t("pages.admin.siteAnalytics")}</h2>
                    <div className="flex items-center gap-2">
                      {[7, 14, 30, 90].map((d) => (
                        <Button
                          key={d}
                          size="sm"
                          variant={analyticsDays === d ? "default" : "outline"}
                          onClick={() => {
                            setAnalyticsDays(d);
                            setSiteAnalytics(null);
                            setTimeout(fetchSiteAnalytics, 100);
                          }}
                          data-testid={`button-analytics-days-${d}`}
                        >
                          {d}d
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1 bg-gray-50 rounded-lg p-1 overflow-x-auto" data-testid="nav-analytics-subtabs">
                    {(["traffic", "users", "content", "campaigns"] as const).map((st) => (
                      <button key={st} onClick={() => setAnalyticsSubTab(st)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${analyticsSubTab === st ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`} data-testid={`subtab-${st}`}>
                        {st === "traffic" ? "Traffic Overview" : st === "users" ? "Users & Subscriptions" : st === "content" ? "Content & SEO" : "Campaigns & Sources"}
                      </button>
                    ))}
                  </div>

                  {analyticsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : siteAnalytics ? (
                    <div className="space-y-6">
                      {analyticsSubTab === "traffic" && (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { label: "Total Page Views", value: (siteAnalytics.traffic?.totalViews || 0).toLocaleString(), icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
                              { label: "Unique Sessions", value: (siteAnalytics.traffic?.uniqueSessions || 0).toLocaleString(), icon: Users, color: "text-green-600", bg: "bg-green-50" },
                              { label: "Avg Duration", value: `${Math.floor((siteAnalytics.traffic?.avgDuration || 0) / 60)}m ${(siteAnalytics.traffic?.avgDuration || 0) % 60}s`, icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
                              { label: "Bounce Rate", value: `${siteAnalytics.traffic?.bounceRate || 0}%`, icon: Activity, color: "text-red-600", bg: "bg-red-50" },
                            ].map((kpi, i) => (
                              <Card key={i} className="border border-primary/10" data-testid={`card-analytics-kpi-${i}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                    </div>
                                    <div>
                                      <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                                      <div className="text-xs text-gray-500">{kpi.label}</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          <Card className="border border-primary/10">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.conversionFunnel")}</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                              {(() => {
                                const f = siteAnalytics.conversionFunnel || {};
                                const steps = [
                                  { label: "Visitors", value: f.totalVisitors || 0 },
                                  { label: "Pricing Page", value: f.pricingViews || 0, rate: f.pricingRate },
                                  { label: "Checkout Started", value: f.checkoutIntents || 0, rate: f.checkoutRate },
                                  { label: "Active Subscribers", value: f.activeSubscribers || 0 },
                                ];
                                const max = Math.max(...steps.map((s) => s.value), 1);
                                return steps.map((s, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="w-32 text-xs text-gray-600 text-right">{s.label}</div>
                                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary/70 rounded-full transition-all" style={{ width: `${(s.value / max) * 100}%` }} />
                                    </div>
                                    <div className="w-16 text-xs font-semibold text-gray-700">{s.value.toLocaleString()}</div>
                                    {s.rate !== undefined && <div className="w-12 text-xs text-gray-400">{s.rate}%</div>}
                                  </div>
                                ));
                              })()}
                            </CardContent>
                          </Card>

                          {siteAnalytics.dailyViews && siteAnalytics.dailyViews.length > 0 && (
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.dailyViewsTrend")}</CardTitle></CardHeader>
                              <CardContent>
                                <div className="flex items-end gap-[2px] h-32">
                                  {(() => {
                                    const maxV = Math.max(...siteAnalytics.dailyViews.map((d: any) => d.views || d.count || 0), 1);
                                    return siteAnalytics.dailyViews.map((d: any, i: number) => {
                                      const v = d.views || d.count || 0;
                                      return (
                                        <div key={i} className="flex-1 group relative cursor-default" title={`${d.date || d.day}: ${v} views`}>
                                          <div className="bg-primary/60 hover:bg-primary rounded-t transition-colors" style={{ height: `${(v / maxV) * 100}%`, minHeight: v > 0 ? "2px" : "0" }} />
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-[10px] text-gray-400">{siteAnalytics.dailyViews[0]?.date || siteAnalytics.dailyViews[0]?.day || ""}</span>
                                  <span className="text-[10px] text-gray-400">{siteAnalytics.dailyViews[siteAnalytics.dailyViews.length - 1]?.date || siteAnalytics.dailyViews[siteAnalytics.dailyViews.length - 1]?.day || ""}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.topPages")}</CardTitle></CardHeader>
                              <CardContent>
                                {(siteAnalytics.topPages || []).length === 0 ? (
                                  <p className="text-xs text-gray-400 py-4 text-center">{t("pages.admin.noPageDataYet")}</p>
                                ) : (
                                  <div className="space-y-2">
                                    {(siteAnalytics.topPages || []).slice(0, 10).map((p: any, i: number) => {
                                      const maxP = Math.max(...(siteAnalytics.topPages || []).map((x: any) => x.views || x.count || 0), 1);
                                      const v = p.views || p.count || 0;
                                      return (
                                        <div key={i} className="flex items-center gap-2">
                                          <div className="flex-1 text-xs text-gray-700 truncate">{p.path || p.page || p.name}</div>
                                          <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(v / maxP) * 100}%` }} />
                                          </div>
                                          <div className="w-10 text-xs font-semibold text-right text-gray-600">{v}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.topReferrers")}</CardTitle></CardHeader>
                              <CardContent>
                                {(siteAnalytics.topReferrers || []).length === 0 ? (
                                  <p className="text-xs text-gray-400 py-4 text-center">{t("pages.admin.noReferrerDataYet")}</p>
                                ) : (
                                  <div className="space-y-2">
                                    {(siteAnalytics.topReferrers || []).slice(0, 10).map((r: any, i: number) => {
                                      const maxR = Math.max(...(siteAnalytics.topReferrers || []).map((x: any) => x.views || x.count || 0), 1);
                                      const v = r.views || r.count || 0;
                                      return (
                                        <div key={i} className="flex items-center gap-2">
                                          <div className="flex-1 text-xs text-gray-700 truncate">{r.referrer || r.source || r.name}</div>
                                          <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-400 rounded-full" style={{ width: `${(v / maxR) * 100}%` }} />
                                          </div>
                                          <div className="w-10 text-xs font-semibold text-right text-gray-600">{v}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            {[
                              { title: "Devices", data: siteAnalytics.devices, color: "bg-purple-400" },
                              { title: "Browsers", data: siteAnalytics.browsers, color: "bg-amber-400" },
                              { title: "Operating Systems", data: siteAnalytics.operatingSystems, color: "bg-cyan-400" },
                            ].map((section) => (
                              <Card key={section.title} className="border border-primary/10">
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{section.title}</CardTitle></CardHeader>
                                <CardContent>
                                  {(section.data || []).length === 0 ? (
                                    <p className="text-xs text-gray-400 py-4 text-center">{t("pages.admin.noData")}</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {(section.data || []).slice(0, 6).map((item: any, i: number) => {
                                        const maxD = Math.max(...(section.data || []).map((x: any) => x.count || 0), 1);
                                        return (
                                          <div key={i} className="flex items-center gap-2">
                                            <div className="flex-1 text-xs text-gray-700 truncate">{item.name}</div>
                                            <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
                                              <div className={`h-full ${section.color} rounded-full`} style={{ width: `${(item.count / maxD) * 100}%` }} />
                                            </div>
                                            <div className="w-8 text-xs font-semibold text-right text-gray-600">{item.count}</div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </>
                      )}

                      {analyticsSubTab === "users" && (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="border border-primary/10">
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-gray-900">{(siteAnalytics.totalUsers || 0).toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{t("pages.admin.totalUsers")}</div>
                              </CardContent>
                            </Card>
                            <Card className="border border-primary/10">
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-green-600">{(siteAnalytics.activeSubscribers || 0).toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{t("pages.admin.activeSubscribers")}</div>
                              </CardContent>
                            </Card>
                            <Card className="border border-primary/10">
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-purple-600">{siteAnalytics.conversionRate || 0}%</div>
                                <div className="text-xs text-gray-500">{t("pages.admin.conversionRate")}</div>
                              </CardContent>
                            </Card>
                            <Card className="border border-primary/10">
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-amber-600">{(siteAnalytics.conversionFunnel?.checkoutIntents || 0).toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{t("pages.admin.checkoutIntents")}</div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.tierDistribution")}</CardTitle></CardHeader>
                              <CardContent>
                                {(() => {
                                  const tiers = siteAnalytics.subscriptionBreakdown || {};
                                  const entries = Object.entries(tiers) as [string, number][];
                                  const total = entries.reduce((s, [, v]) => s + (v as number), 0) || 1;
                                  const colors: Record<string, string> = { free: "bg-gray-400", rpn: "bg-blue-500", rn: "bg-purple-500", np: "bg-amber-500", admin: "bg-red-500" };
                                  return (
                                    <div className="space-y-3">
                                      {entries.map(([tier, count]) => (
                                        <div key={tier}>
                                          <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700">{tierLabels[tier] || tier}</span>
                                            <span className="text-gray-500">{(count as number)} ({Math.round(((count as number) / total) * 100)}%)</span>
                                          </div>
                                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${colors[tier] || "bg-gray-400"} rounded-full`} style={{ width: `${((count as number) / total) * 100}%` }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </CardContent>
                            </Card>

                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.subscriptionStatus")}</CardTitle></CardHeader>
                              <CardContent>
                                {(() => {
                                  const statuses = siteAnalytics.subscriptionStatus || {};
                                  const entries = Object.entries(statuses) as [string, number][];
                                  const total = entries.reduce((s, [, v]) => s + (v as number), 0) || 1;
                                  const colors: Record<string, string> = { active: "bg-green-500", inactive: "bg-gray-400", canceled: "bg-red-400", past_due: "bg-yellow-500" };
                                  return (
                                    <div className="space-y-3">
                                      {entries.map(([status, count]) => (
                                        <div key={status}>
                                          <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700 capitalize">{status.replace("_", " ")}</span>
                                            <span className="text-gray-500">{(count as number)} ({Math.round(((count as number) / total) * 100)}%)</span>
                                          </div>
                                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${colors[status] || "bg-gray-400"} rounded-full`} style={{ width: `${((count as number) / total) * 100}%` }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </CardContent>
                            </Card>
                          </div>

                          {siteAnalytics.countries && Object.keys(siteAnalytics.countries).length > 0 && (
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.geographicDistribution")}</CardTitle></CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {Object.entries(siteAnalytics.countries || {}).sort((a: any, b: any) => b[1] - a[1]).slice(0, 12).map(([country, count]: any) => (
                                    <div key={country} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                      <span className="text-xs text-gray-700">{country}</span>
                                      <span className="text-xs font-semibold text-gray-600">{count}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {siteAnalytics.userRegions && Object.keys(siteAnalytics.userRegions).length > 0 && (
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.userRegionsRegistered")}</CardTitle></CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {Object.entries(siteAnalytics.userRegions || {}).sort((a: any, b: any) => b[1] - a[1]).map(([region, count]: any) => (
                                    <div key={region} className="flex items-center gap-2">
                                      <div className="flex-1 text-xs text-gray-700">{region || "Unknown"}</div>
                                      <div className="w-10 text-xs font-semibold text-right text-gray-600">{count}</div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      )}

                      {analyticsSubTab === "content" && (
                        <>
                          {siteAnalytics.blogContent && siteAnalytics.blogContent.length > 0 && (
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.topBlogContent")}</CardTitle></CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {siteAnalytics.blogContent.slice(0, 10).map((b: any, i: number) => {
                                    const maxB = Math.max(...siteAnalytics.blogContent.map((x: any) => x.views || x.count || 0), 1);
                                    const v = b.views || b.count || 0;
                                    return (
                                      <div key={i} className="flex items-center gap-2">
                                        <div className="flex-1 text-xs text-gray-700 truncate">{b.title || b.slug || b.path || b.name}</div>
                                        <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-pink-400 rounded-full" style={{ width: `${(v / maxB) * 100}%` }} />
                                        </div>
                                        <div className="w-10 text-xs font-semibold text-right text-gray-600">{v}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          <Card className="border border-primary/10">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.seoOverview")}</CardTitle></CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xl font-bold text-gray-900">{(siteAnalytics.traffic?.totalViews || 0).toLocaleString()}</div>
                                  <div className="text-[10px] text-gray-500">{t("pages.admin.totalImpressions")}</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xl font-bold text-gray-900">{(siteAnalytics.topPages || []).length}</div>
                                  <div className="text-[10px] text-gray-500">{t("pages.admin.uniquePagesVisited")}</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xl font-bold text-gray-900">{(siteAnalytics.topReferrers || []).length}</div>
                                  <div className="text-[10px] text-gray-500">{t("pages.admin.referralSources")}</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xl font-bold text-gray-900">{(siteAnalytics.blogContent || []).length}</div>
                                  <div className="text-[10px] text-gray-500">{t("pages.admin.blogPostsTracked")}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}

                      {analyticsSubTab === "campaigns" && (
                        <>
                          {(siteAnalytics.utmCampaigns || []).length > 0 && (
                            <Card className="border border-primary/10">
                              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.utmCampaigns")}</CardTitle></CardHeader>
                              <CardContent>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b text-left text-gray-500">
                                        <th className="pb-2">{t("pages.admin.campaign")}</th>
                                        <th className="pb-2">{t("pages.admin.source")}</th>
                                        <th className="pb-2">{t("pages.admin.medium")}</th>
                                        <th className="pb-2 text-right">{t("pages.admin.views")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {siteAnalytics.utmCampaigns.slice(0, 15).map((c: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-50">
                                          <td className="py-2 font-medium text-gray-700">{c.campaign || c.name || "-"}</td>
                                          <td className="py-2 text-gray-600">{c.source || "-"}</td>
                                          <td className="py-2 text-gray-600">{c.medium || "-"}</td>
                                          <td className="py-2 text-right font-semibold text-gray-700">{(c.views || c.count || 0).toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {(() => {
                            const sources = siteAnalytics.utmSources || {};
                            const mediums = siteAnalytics.utmMediums || {};
                            const hasSources = Object.keys(sources).length > 0;
                            const hasMediums = Object.keys(mediums).length > 0;
                            if (!hasSources && !hasMediums) return null;
                            return (
                              <div className="grid md:grid-cols-2 gap-6">
                                {hasSources && (
                                  <Card className="border border-primary/10">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.trafficSourcesUtm")}</CardTitle></CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {Object.entries(sources).sort((a: any, b: any) => b[1] - a[1]).slice(0, 8).map(([src, cnt]: any) => (
                                          <div key={src} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                            <span className="text-xs text-gray-700">{src}</span>
                                            <span className="text-xs font-semibold text-gray-600">{cnt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                                {hasMediums && (
                                  <Card className="border border-primary/10">
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.trafficMediumsUtm")}</CardTitle></CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {Object.entries(mediums).sort((a: any, b: any) => b[1] - a[1]).slice(0, 8).map(([med, cnt]: any) => (
                                          <div key={med} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                                            <span className="text-xs text-gray-700">{med}</span>
                                            <span className="text-xs font-semibold text-gray-600">{cnt}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            );
                          })()}

                          {(siteAnalytics.utmCampaigns || []).length === 0 && !Object.keys(siteAnalytics.utmSources || {}).length && (
                            <Card className="border border-primary/10">
                              <CardContent className="p-8 text-center text-gray-400">
                                <Globe className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">{t("pages.admin.noUtmCampaignDataYet")}</p>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-10">{t("pages.admin.noAnalyticsDataAvailableYet")}</p>
                  )}
                </div>
              )}

              {activeTab === "promotions" && (
                <div className="space-y-6" data-testid="section-promotions">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{t("pages.admin.promotionCodes")}</h2>
                    <Button size="sm" variant="outline" onClick={fetchPromotions} disabled={promotionsLoading} className="gap-2" data-testid="button-refresh-promotions">
                      <RefreshCw className={`w-4 h-4 ${promotionsLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>

                  <Card className="border border-primary/10">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">{t("pages.admin.createPromotionCode")}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t("pages.admin.codeName")}</label>
                          <Input placeholder={t("pages.admin.summer25")} value={newPromo.code} onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })} data-testid="input-promo-code" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t("pages.admin.discountType")}</label>
                          <select className="w-full border rounded-md px-3 py-2 text-sm" value={newPromo.discountType} onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value })} data-testid="select-promo-type">
                            <option value="percent_off">{t("pages.admin.percentageOff")}</option>
                            <option value="amount_off">{t("pages.admin.fixedAmountOffCents")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{newPromo.discountType === "percent_off" ? "Percentage" : "Amount (cents)"}</label>
                          <Input type="number" placeholder={newPromo.discountType === "percent_off" ? "25" : "500"} value={newPromo.amount} onChange={(e) => setNewPromo({ ...newPromo, amount: e.target.value })} data-testid="input-promo-amount" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t("pages.admin.duration")}</label>
                          <select className="w-full border rounded-md px-3 py-2 text-sm" value={newPromo.duration} onChange={(e) => setNewPromo({ ...newPromo, duration: e.target.value })} data-testid="select-promo-duration">
                            <option value="once">{t("pages.admin.once")}</option>
                            <option value="repeating">{t("pages.admin.repeating")}</option>
                            <option value="forever">{t("pages.admin.forever")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t("pages.admin.maxUsesOptional")}</label>
                          <Input type="number" placeholder="100" value={newPromo.maxRedemptions} onChange={(e) => setNewPromo({ ...newPromo, maxRedemptions: e.target.value })} data-testid="input-promo-max" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{t("pages.admin.expiresOptional")}</label>
                          <Input type="date" value={newPromo.expiresAt} onChange={(e) => setNewPromo({ ...newPromo, expiresAt: e.target.value })} data-testid="input-promo-expires" />
                        </div>
                      </div>
                      <Button onClick={createPromotion} disabled={promoCreating || !newPromo.code || !newPromo.amount} className="gap-2" data-testid="button-create-promo">
                        <Plus className="w-4 h-4" />
                        {promoCreating ? "Creating..." : "Create Promotion"}
                      </Button>
                    </CardContent>
                  </Card>

                  {promotionsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : promotions.length === 0 ? (
                    <Card className="border border-primary/10">
                      <CardContent className="p-8 text-center text-gray-400">
                        <Tag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">{t("pages.admin.noPromotionCodesYetCreate")}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {promotions.map((promo: any) => (
                        <Card key={promo.id} className="border border-primary/10" data-testid={`card-promo-${promo.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant={promo.active ? "default" : "secondary"} data-testid={`badge-promo-status-${promo.id}`}>
                                  {promo.active ? "Active" : "Inactive"}
                                </Badge>
                                <span className="font-mono font-bold text-sm" data-testid={`text-promo-code-${promo.id}`}>{promo.code}</span>
                                <span className="text-xs text-gray-500">
                                  {promo.percentOff ? `${promo.percentOff}% off` : promo.amountOff ? `$${(promo.amountOff / 100).toFixed(2)} off` : ""}
                                </span>
                                <span className="text-xs text-gray-400">{promo.duration}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">
                                  {promo.timesRedeemed || 0}{promo.maxRedemptions ? `/${promo.maxRedemptions}` : ""} used
                                </span>
                                {promo.expiresAt && (
                                  <span className="text-xs text-gray-400">
                                    Expires {new Date(promo.expiresAt * 1000).toLocaleDateString()}
                                  </span>
                                )}
                                {promo.active && (
                                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deletePromotion(promo.id)} data-testid={`button-delete-promo-${promo.id}`}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === "feedback" && (
                <div className="space-y-6" data-testid="section-feedback">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{t("pages.admin.feedbackFeatureRequests")}</h2>
                    <Button size="sm" variant="outline" onClick={fetchFeedback} disabled={feedbackLoading} className="gap-2" data-testid="button-refresh-feedback">
                      <RefreshCw className={`w-4 h-4 ${feedbackLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total", value: feedbackList.length, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Feature Requests", value: feedbackList.filter((f) => f.type === "feature_request").length, icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Bug Reports", value: feedbackList.filter((f) => f.type === "bug_report").length, icon: Bug, color: "text-red-600", bg: "bg-red-50" },
                      { label: "Open", value: feedbackList.filter((f) => f.status === "new" || f.status === "in_progress").length, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
                    ].map((kpi, i) => (
                      <Card key={i} className="border border-primary/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                              <div className="text-xs text-gray-500">{kpi.label}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {feedbackLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : feedbackList.length === 0 ? (
                    <Card className="border border-primary/10">
                      <CardContent className="p-8 text-center text-gray-400">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">{t("pages.admin.noFeedbackReceivedYet")}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {feedbackList.map((item) => (
                        <Card key={item.id} className="border border-primary/10" data-testid={`card-admin-feedback-${item.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
                                <ThumbsUp className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-600">{item.upvotes || 0}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      item.type === "bug_report"
                                        ? "bg-red-100 text-red-700"
                                        : item.type === "feature_request"
                                        ? "bg-amber-100 text-amber-700"
                                        : item.type === "question"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {(item.type || "feedback").replace(/_/g, " ")}
                                  </span>
                                  {item.category && item.category !== "general" && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">
                                      {item.category.replace(/-/g, " ")}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-gray-500 mb-2">{item.description}</p>

                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                  <span>{item.username || "Anonymous"}</span>
                                  {item.email && <span>{item.email}</span>}
                                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <select
                                    value={item.status || "new"}
                                    onChange={(e) => updateFeedbackItem(item.id, { status: e.target.value })}
                                    className="text-xs border rounded-md px-2 py-1 bg-white"
                                    data-testid={`select-feedback-status-${item.id}`}
                                  >
                                    <option value="new">{t("pages.admin.new")}</option>
                                    <option value="in_progress">{t("pages.admin.inProgress")}</option>
                                    <option value="planned">{t("pages.admin.planned")}</option>
                                    <option value="completed">{t("pages.admin.completed")}</option>
                                    <option value="declined">{t("pages.admin.declined")}</option>
                                  </select>

                                  <select
                                    value={item.priority || "medium"}
                                    onChange={(e) => updateFeedbackItem(item.id, { priority: e.target.value })}
                                    className="text-xs border rounded-md px-2 py-1 bg-white"
                                    data-testid={`select-feedback-priority-${item.id}`}
                                  >
                                    <option value="low">{t("pages.admin.lowPriority")}</option>
                                    <option value="medium">{t("pages.admin.mediumPriority")}</option>
                                    <option value="high">{t("pages.admin.highPriority")}</option>
                                    <option value="critical">{t("pages.admin.critical")}</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6" data-testid="section-social">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{t("pages.admin.socialMediaScheduler")}</h2>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="default" onClick={() => setLocation("/admin/social-content")} className="gap-2" data-testid="button-social-content-automation">
                        <Sparkles className="w-4 h-4" />
                        Content Automation
                      </Button>
                      <Button size="sm" variant="outline" onClick={fetchSocialPosts} disabled={socialLoading} className="gap-2" data-testid="button-refresh-social">
                        <RefreshCw className={`w-4 h-4 ${socialLoading ? "animate-spin" : ""}`} />
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <Card className={`border ${metaStatus?.connected ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}`} data-testid="card-meta-connection">
                    <CardContent className="pt-4 pb-3">
                      {metaLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <RefreshCw className="w-4 h-4 animate-spin" /> Checking Meta connection...
                        </div>
                      ) : metaStatus?.connected ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">f</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t("pages.admin.connectedToMeta")}</p>
                              <p className="text-xs text-gray-500">
                                Page: {metaStatus.facebookPageName || "Unknown"}
                                {metaStatus.instagramUsername && ` | IG: @${metaStatus.instagramUsername}`}
                                {metaStatus.expired && <span className="text-red-600 ml-2">{t("pages.admin.tokenExpiredReconnect")}</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {metaStatus.expired && (
                              <Button size="sm" variant="outline" onClick={connectMeta} className="text-xs" data-testid="button-reconnect-meta">
                                Reconnect
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={disconnectMeta} className="text-xs text-red-500" data-testid="button-disconnect-meta">
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{t("pages.admin.connectMetaFacebookInstagram")}</p>
                            <p className="text-xs text-gray-500">{t("pages.admin.linkYourFacebookPageAnd")}</p>
                          </div>
                          <Button size="sm" onClick={connectMeta} className="gap-2" data-testid="button-connect-meta">
                            Connect Meta
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-sm">{t("pages.admin.createNewPost")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{t("pages.admin.platform")}</label>
                          <select
                            value={newPost.platform}
                            onChange={(e) => setNewPost((p) => ({ ...p, platform: e.target.value }))}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                            data-testid="select-social-platform"
                          >
                            <option value="facebook">{t("pages.admin.facebook")}</option>
                            <option value="instagram">{t("pages.admin.instagram")}</option>
                            <option value="tiktok">{t("pages.admin.tiktok")}</option>
                            <option value="pinterest">{t("pages.admin.pinterest")}</option>
                            <option value="linkedin">{t("pages.admin.linkedin")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{t("pages.admin.tierFocus")}</label>
                          <select
                            value={newPost.tier}
                            onChange={(e) => setNewPost((p) => ({ ...p, tier: e.target.value }))}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                            data-testid="select-social-tier"
                          >
                            <option value="rpn">{t("pages.admin.rpnlvn")}</option>
                            <option value="rn">RN</option>
                            <option value="np">NP</option>
                            <option value="general">{t("pages.admin.general")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{t("pages.admin.scheduleFor")}</label>
                          <input
                            type="datetime-local"
                            value={newPost.scheduledAt}
                            onChange={(e) => setNewPost((p) => ({ ...p, scheduledAt: e.target.value }))}
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                            data-testid="input-social-schedule"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">{t("pages.admin.postContent")}</label>
                        <textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                          placeholder={t("pages.admin.writeYourSocialPostUse")}
                          rows={4}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-white resize-none"
                          data-testid="input-social-content"
                        />
                      </div>
                      {newPost.platform === "instagram" && (
                        <div>
                          <label className="text-xs font-medium text-gray-600 mb-1 block">{t("pages.admin.imageUrlRequiredForInstagram")}</label>
                          <input
                            type="url"
                            value={newPost.imageUrl}
                            onChange={(e) => setNewPost((p) => ({ ...p, imageUrl: e.target.value }))}
                            placeholder="https://www.nursenest.ca/images/..."
                            className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                            data-testid="input-social-image"
                          />
                        </div>
                      )}
                      <Button onClick={createSocialPost} disabled={!newPost.content.trim()} className="gap-2" data-testid="button-create-social-post">
                        Schedule Post
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-sm">{t("pages.admin.scheduledPublishedPosts")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {socialLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      ) : socialPosts.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">{t("pages.admin.noPostsScheduledYet")}</p>
                      ) : (
                        <div className="space-y-3">
                          {socialPosts.map((post: any) => (
                            <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50" data-testid={`card-social-post-${post.id}`}>
                              <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                post.platform === "facebook" ? "bg-blue-100 text-blue-700" :
                                post.platform === "instagram" ? "bg-pink-100 text-pink-700" :
                                post.platform === "tiktok" ? "bg-gray-900 text-white" :
                                post.platform === "pinterest" ? "bg-red-100 text-red-700" :
                                post.platform === "linkedin" ? "bg-blue-200 text-blue-800" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {post.platform}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-3">{post.content}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                  <span className={`font-medium ${post.status === "published" ? "text-green-600" : post.status === "failed" ? "text-red-600" : "text-amber-600"}`}>
                                    {post.status}
                                  </span>
                                  {post.scheduledAt && <span>Scheduled: {new Date(post.scheduledAt).toLocaleString()}</span>}
                                  <span className="capitalize">{post.tier}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {(post.status === "draft" || post.status === "scheduled") && metaStatus?.connected && (
                                  <Button size="sm" variant="outline" className="text-xs" onClick={() => publishNow(post.id)} data-testid={`button-publish-now-${post.id}`}>
                                    Publish Now
                                  </Button>
                                )}
                                {(post.status === "draft" || post.status === "scheduled") && (
                                  <Button size="sm" variant="ghost" className="text-red-500 text-xs" onClick={() => deleteSocialPost(post.id)} data-testid={`button-delete-social-${post.id}`}>
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "audit" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{t("pages.admin.auditLog")}</h2>
                    <Button size="sm" variant="outline" onClick={fetchAuditLogs} data-testid="button-refresh-audit">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                  <Card className="border border-primary/10">
                    <CardContent className="p-0">
                      {auditLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      ) : auditLogs.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">{t("pages.admin.noAuditLogEntriesYet")}</p>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {auditLogs.map((log: any, idx: number) => (
                            <div key={log.id || idx} className="p-4 hover:bg-gray-50/50 transition-colors" data-testid={`card-audit-log-${idx}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                      log.action === "create" ? "bg-green-100 text-green-700" :
                                      log.action === "update" ? "bg-blue-100 text-blue-700" :
                                      log.action === "delete" ? "bg-red-100 text-red-700" :
                                      log.action === "restore_revision" ? "bg-purple-100 text-purple-700" :
                                      "bg-gray-100 text-gray-700"
                                    }`}>
                                      {log.action}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">{log.entityType}</span>
                                    {log.entityId && <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]">{log.entityId.substring(0, 8)}...</span>}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="font-medium text-gray-700">{log.actorUsername || "System"}</span>
                                    <span>{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}</span>
                                  </div>
                                  {(log.beforeJson || log.afterJson) && (
                                    <div className="mt-2 flex gap-4 text-xs">
                                      {log.beforeJson && (
                                        <div className="bg-red-50 rounded p-2 flex-1">
                                          <span className="font-semibold text-red-600">{t("pages.admin.before")} </span>
                                          <span className="text-gray-600">{typeof log.beforeJson === "string" ? log.beforeJson : JSON.stringify(log.beforeJson, null, 1)}</span>
                                        </div>
                                      )}
                                      {log.afterJson && (
                                        <div className="bg-green-50 rounded p-2 flex-1">
                                          <span className="font-semibold text-green-600">{t("pages.admin.after")} </span>
                                          <span className="text-gray-600">{typeof log.afterJson === "string" ? log.afterJson : JSON.stringify(log.afterJson, null, 1)}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "ai-safety" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        AI Generation Safety Controls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {aiConfigLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : aiConfig ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 rounded-lg border border-primary/10 bg-gray-50">
                            <div>
                              <p className="font-semibold text-lg" data-testid="text-ai-status">
                                AI Generation: {aiConfig.enabled ? (
                                  <span className="text-green-600">{t("pages.admin.enabled")}</span>
                                ) : (
                                  <span className="text-red-600">{t("pages.admin.disabled")}</span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {aiConfig.enabled
                                  ? "AI endpoints are active. Content is generated only on admin action."
                                  : "All AI generation endpoints are blocked. Enable to allow content generation."}
                              </p>
                            </div>
                            <Button
                              onClick={() => updateAiConfig({ enabled: !aiConfig.enabled })}
                              disabled={aiConfigSaving}
                              className={aiConfig.enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                              data-testid="button-toggle-ai"
                            >
                              {aiConfigSaving ? (
                                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              {aiConfig.enabled ? "Disable AI" : "Enable AI"}
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border">
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t("pages.admin.maxItemsPerDay")}</label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={aiConfig.maxItemsPerDay}
                                  onChange={(e) => setAiConfig({ ...aiConfig, maxItemsPerDay: parseInt(e.target.value) || 200 })}
                                  min={1}
                                  data-testid="input-max-items"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => updateAiConfig({ maxItemsPerDay: aiConfig.maxItemsPerDay })}
                                  disabled={aiConfigSaving}
                                  data-testid="button-save-max-items"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg border">
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t("pages.admin.maxTokensPerDay")}</label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={aiConfig.maxTokensPerDay}
                                  onChange={(e) => setAiConfig({ ...aiConfig, maxTokensPerDay: parseInt(e.target.value) || 300000 })}
                                  min={1}
                                  data-testid="input-max-tokens"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => updateAiConfig({ maxTokensPerDay: aiConfig.maxTokensPerDay })}
                                  disabled={aiConfigSaving}
                                  data-testid="button-save-max-tokens"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Today's Usage ({aiConfig.usage?.date || "N/A"})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <p className="text-2xl font-bold text-blue-700" data-testid="text-items-used">
                                    {aiConfig.usage?.itemsGenerated || 0}
                                  </p>
                                  <p className="text-sm text-blue-600">
                                    / {aiConfig.maxItemsPerDay} items
                                  </p>
                                  <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-600 rounded-full transition-all"
                                      style={{ width: `${Math.min(100, ((aiConfig.usage?.itemsGenerated || 0) / aiConfig.maxItemsPerDay) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                  <p className="text-2xl font-bold text-purple-700" data-testid="text-tokens-used">
                                    {(aiConfig.usage?.tokensUsed || 0).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-purple-600">
                                    / {aiConfig.maxTokensPerDay.toLocaleString()} tokens
                                  </p>
                                  <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-purple-600 rounded-full transition-all"
                                      style={{ width: `${Math.min(100, ((aiConfig.usage?.tokensUsed || 0) / aiConfig.maxTokensPerDay) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => fetchAiConfig()}
                                  disabled={aiConfigLoading}
                                  data-testid="button-refresh-ai-usage"
                                >
                                  <RefreshCw className={`w-4 h-4 mr-1 ${aiConfigLoading ? "animate-spin" : ""}`} />
                                  Refresh
                                </Button>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                            <p className="text-sm text-amber-800 font-medium">{t("pages.admin.safetyPolicy")}</p>
                            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                              <li>{t("pages.admin.aiGenerationIsDisabledBy")}</li>
                              <li>{t("pages.admin.allAiEndpointsRequireAdmin")}</li>
                              <li>{t("pages.admin.dailyCapsResetAtMidnight")}</li>
                              <li>{t("pages.admin.contentIsNeverAutopublishedWithout")}</li>
                              <li>{t("pages.admin.allAiUsageIsLogged")}</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">{t("pages.admin.failedToLoadAiConfiguration")}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        AI Exam Question Generator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.tier3")}</label>
                            <select
                              value={batchExamTier}
                              onChange={(e) => setBatchExamTier(e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              data-testid="select-batch-exam-tier"
                            >
                              <option value="free">{t("pages.admin.free")}</option>
                              <option value="rpn">RPN</option>
                              <option value="rn">RN</option>
                              <option value="np">NP</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.topic")}</label>
                            <Input
                              value={batchExamTopic}
                              onChange={(e) => setBatchExamTopic(e.target.value)}
                              placeholder="e.g., Pharmacology, Cardiac Care"
                              data-testid="input-batch-exam-topic"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.quantity150")}</label>
                            <Input
                              type="number"
                              value={batchExamQty}
                              onChange={(e) => setBatchExamQty(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                              min={1}
                              max={50}
                              data-testid="input-batch-exam-qty"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={async () => {
                            if (!batchExamTopic.trim()) return;
                            setBatchExamLoading(true);
                            setBatchExamResult(null);
                            try {
                              const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
                              const res = await fetch("/api/admin/ai/exam-questions/generate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ tier: batchExamTier, topic: batchExamTopic, quantity: batchExamQty, username: creds.username, password: creds.password }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error);
                              setBatchExamResult(data);
                              fetchAiConfig();
                            } catch (err: any) {
                              setBatchExamResult({ error: err.message });
                            } finally {
                              setBatchExamLoading(false);
                            }
                          }}
                          disabled={batchExamLoading || !batchExamTopic.trim()}
                          className="w-full"
                          data-testid="button-generate-exam-batch"
                        >
                          {batchExamLoading ? (
                            <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> {t("pages.admin.generating")}</>
                          ) : (
                            <>Generate {batchExamQty} Exam Questions (Draft)</>
                          )}
                        </Button>
                        {batchExamResult && (
                          <div className={`p-4 rounded-lg border ${batchExamResult.error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                            {batchExamResult.error ? (
                              <p className="text-sm text-red-700" data-testid="text-batch-exam-error">{batchExamResult.error}</p>
                            ) : (
                              <div>
                                <p className="text-sm font-medium text-green-800" data-testid="text-batch-exam-success">
                                  Generated {batchExamResult.count} questions as drafts
                                </p>
                                <p className="text-xs text-green-600 mt-1">Batch ID: {batchExamResult.batchId} | Tokens: {batchExamResult.tokensUsed}</p>
                                <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                                  {batchExamResult.drafts?.slice(0, 5).map((q: any, i: number) => (
                                    <div key={i} className="p-2 bg-white rounded border text-xs">
                                      <p className="font-medium">{i + 1}. {q.question?.slice(0, 120)}...</p>
                                      <p className="text-gray-500 mt-1">Type: {q.type} | Difficulty: {q.difficulty}</p>
                                    </div>
                                  ))}
                                  {(batchExamResult.drafts?.length || 0) > 5 && (
                                    <p className="text-xs text-gray-500">...and {batchExamResult.drafts.length - 5} more</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-600" />
                        AI Flashcard Generator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.topic2")}</label>
                            <Input
                              value={batchFcTopic}
                              onChange={(e) => setBatchFcTopic(e.target.value)}
                              placeholder="e.g., Lab Values, Electrolytes"
                              data-testid="input-batch-fc-topic"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.deckTitle")}</label>
                            <Input
                              value={batchFcDeck}
                              onChange={(e) => setBatchFcDeck(e.target.value)}
                              placeholder={t("pages.admin.optionalDeckName")}
                              data-testid="input-batch-fc-deck"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.tier4")}</label>
                            <select
                              value={batchFcTier}
                              onChange={(e) => setBatchFcTier(e.target.value)}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                              data-testid="select-batch-fc-tier"
                            >
                              <option value="free">{t("pages.admin.free2")}</option>
                              <option value="rpn">RPN</option>
                              <option value="rn">RN</option>
                              <option value="np">NP</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.quantity1100")}</label>
                            <Input
                              type="number"
                              value={batchFcQty}
                              onChange={(e) => setBatchFcQty(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                              min={1}
                              max={100}
                              data-testid="input-batch-fc-qty"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={async () => {
                            if (!batchFcTopic.trim()) return;
                            setBatchFcLoading(true);
                            setBatchFcResult(null);
                            try {
                              const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
                              const res = await fetch("/api/admin/ai/flashcards/generate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ topic: batchFcTopic, quantity: batchFcQty, tier: batchFcTier, deckTitle: batchFcDeck || batchFcTopic, username: creds.username, password: creds.password }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error);
                              setBatchFcResult(data);
                              fetchAiConfig();
                            } catch (err: any) {
                              setBatchFcResult({ error: err.message });
                            } finally {
                              setBatchFcLoading(false);
                            }
                          }}
                          disabled={batchFcLoading || !batchFcTopic.trim()}
                          className="w-full"
                          data-testid="button-generate-fc-batch"
                        >
                          {batchFcLoading ? (
                            <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> {t("pages.admin.generating2")}</>
                          ) : (
                            <>Generate {batchFcQty} Flashcards (Draft)</>
                          )}
                        </Button>
                        {batchFcResult && (
                          <div className={`p-4 rounded-lg border ${batchFcResult.error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                            {batchFcResult.error ? (
                              <p className="text-sm text-red-700" data-testid="text-batch-fc-error">{batchFcResult.error}</p>
                            ) : (
                              <div>
                                <p className="text-sm font-medium text-green-800" data-testid="text-batch-fc-success">
                                  Generated {batchFcResult.count} flashcards as drafts
                                </p>
                                <p className="text-xs text-green-600 mt-1">Batch ID: {batchFcResult.batchId} | Tokens: {batchFcResult.tokensUsed}</p>
                                <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                                  {batchFcResult.drafts?.slice(0, 5).map((c: any, i: number) => (
                                    <div key={i} className="p-2 bg-white rounded border text-xs">
                                      <p className="font-medium">Q: {c.front?.slice(0, 100)}</p>
                                      <p className="text-gray-600 mt-1">A: {c.back?.slice(0, 100)}</p>
                                    </div>
                                  ))}
                                  {(batchFcResult.drafts?.length || 0) > 5 && (
                                    <p className="text-xs text-gray-500">...and {batchFcResult.drafts.length - 5} more</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "beta-testers" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800" data-testid="text-beta-heading">{t("pages.admin.betaTesterAccessCodes")}</h2>
                    <Button size="sm" variant="outline" onClick={() => { fetchBetaCodes(); fetchBetaUsers(); fetchBetaFeedback(); }} data-testid="button-refresh-beta">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Generate New Access Code
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.codeAutogeneratedIfBlank")}</label>
                          <Input
                            value={betaNewCode}
                            onChange={(e) => setBetaNewCode(e.target.value.toUpperCase())}
                            placeholder={t("pages.admin.nnbetaxxxxxx")}
                            data-testid="input-beta-code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.tier5")}</label>
                          <select
                            value={betaNewTier}
                            onChange={(e) => setBetaNewTier(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            data-testid="select-beta-tier"
                          >
                            <option value="free">{t("pages.admin.free3")}</option>
                            <option value="rpn">RPN</option>
                            <option value="rn">RN</option>
                            <option value="np">NP</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.maxUses")}</label>
                          <Input
                            type="number"
                            value={betaNewMaxUses}
                            onChange={(e) => setBetaNewMaxUses(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            data-testid="input-beta-max-uses"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.durationDays")}</label>
                          <Input
                            type="number"
                            value={betaNewDurationDays}
                            onChange={(e) => setBetaNewDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            data-testid="input-beta-duration"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.notesOptional")}</label>
                          <Input
                            value={betaNewNotes}
                            onChange={(e) => setBetaNewNotes(e.target.value)}
                            placeholder="e.g., Batch for March cohort"
                            data-testid="input-beta-notes"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={createBetaCode}
                        disabled={betaCreating}
                        className="w-full"
                        data-testid="button-create-beta-code"
                      >
                        {betaCreating ? (
                          <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> {t("pages.admin.creating")}</>
                        ) : (
                          <><Ticket className="w-4 h-4 mr-2" /> {t("pages.admin.generateAccessCode")}</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10 bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Batch Generate Codes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{t("pages.admin.generateMultipleSingleuseBetaCodes")}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.quantity1500")}</label>
                          <Input
                            type="number"
                            value={betaBatchCount}
                            onChange={(e) => setBetaBatchCount(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                            min={1}
                            max={500}
                            data-testid="input-batch-count"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.tier6")}</label>
                          <select
                            value={betaBatchTier}
                            onChange={(e) => setBetaBatchTier(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                            data-testid="select-batch-tier"
                          >
                            <option value="free">{t("pages.admin.free4")}</option>
                            <option value="rpn">RPN</option>
                            <option value="rn">RN</option>
                            <option value="np">NP</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.maxUsesEach")}</label>
                          <Input
                            type="number"
                            value={betaBatchMaxUses}
                            onChange={(e) => setBetaBatchMaxUses(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            data-testid="input-batch-max-uses"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.durationDays2")}</label>
                          <Input
                            type="number"
                            value={betaBatchDuration}
                            onChange={(e) => setBetaBatchDuration(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            data-testid="input-batch-duration"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.notes2")}</label>
                          <Input
                            value={betaBatchNotes}
                            onChange={(e) => setBetaBatchNotes(e.target.value)}
                            placeholder="e.g., March cohort"
                            data-testid="input-batch-notes"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={generateBatchCodes}
                        disabled={betaBatchLoading}
                        className="w-full"
                        data-testid="button-generate-batch"
                      >
                        {betaBatchLoading ? (
                          <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Generating {betaBatchCount} codes...</>
                        ) : (
                          <><Layers className="w-4 h-4 mr-2" /> Generate {betaBatchCount} Codes</>
                        )}
                      </Button>
                      {betaBatchResult && (
                        <div className={`mt-4 p-4 rounded-lg border ${betaBatchResult.error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                          {betaBatchResult.error ? (
                            <p className="text-sm text-red-700" data-testid="text-batch-error">{betaBatchResult.error}</p>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-green-800" data-testid="text-batch-success">
                                  Generated {betaBatchResult.count} codes successfully
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyAllCodes(betaBatchResult.codes)}
                                  data-testid="button-copy-all-batch"
                                >
                                  {betaAllCopied ? <Check className="w-4 h-4 text-green-600 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                  {betaAllCopied ? "Copied" : "Copy All Codes"}
                                </Button>
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-1">
                                {betaBatchResult.codes?.map((c: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between bg-white rounded px-3 py-1.5 text-xs border">
                                    <span className="font-mono font-bold tracking-wider">{c.code}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyBetaCode(c.code)}>
                                      {betaCopied === c.code ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" />
                        All Codes ({betaCodes.length}) -- Active: {betaCodes.filter((c: any) => c.isActive).length} -- Used: {betaCodes.filter((c: any) => c.usedCount > 0).length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {betaCodesLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      ) : betaCodes.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8" data-testid="text-no-beta-codes">{t("pages.admin.noAccessCodesCreatedYet")}</p>
                      ) : (
                        <div className="divide-y">
                          {betaCodes.map((code: any, idx: number) => (
                            <div key={code.id} className={`p-4 ${!code.isActive ? "opacity-60 bg-gray-50" : ""}`} data-testid={`beta-code-row-${idx}`}>
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="font-mono text-sm font-bold tracking-wider bg-gray-100 px-3 py-1.5 rounded-lg border" data-testid={`text-beta-code-${idx}`}>
                                    {code.code}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => copyBetaCode(code.code)}
                                    data-testid={`button-copy-beta-${idx}`}
                                  >
                                    {betaCopied === code.code ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                  </Button>
                                  <Badge variant={code.isActive ? "default" : "secondary"} data-testid={`badge-beta-status-${idx}`}>
                                    {code.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {code.tier?.toUpperCase() || "FREE"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleBetaCode(code.id, code.isActive)}
                                    data-testid={`button-toggle-beta-${idx}`}
                                  >
                                    {code.isActive ? <ToggleRight className="w-4 h-4 text-green-600 mr-1" /> : <ToggleLeft className="w-4 h-4 text-gray-400 mr-1" />}
                                    {code.isActive ? "Deactivate" : "Activate"}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteBetaCode(code.id)}
                                    data-testid={`button-delete-beta-${idx}`}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span data-testid={`text-beta-uses-${idx}`}>Uses: {code.usedCount || 0} / {code.maxUses}</span>
                                {code.usedBy && <span className="text-green-600 font-medium">{t("pages.admin.redeemed")}</span>}
                                <span>Created: {code.createdAt ? new Date(code.createdAt).toLocaleDateString() : "N/A"}</span>
                                {code.expiresAt && (
                                  <span className={new Date(code.expiresAt) < new Date() ? "text-red-500 font-medium" : ""}>
                                    {new Date(code.expiresAt) < new Date() ? "Expired" : `Expires: ${new Date(code.expiresAt).toLocaleDateString()}`}
                                  </span>
                                )}
                                {code.notes && <span className="italic">"{code.notes}"</span>}
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-primary rounded-full h-1.5 transition-all"
                                    style={{ width: `${Math.min(100, ((code.usedCount || 0) / (code.maxUses || 1)) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Active Beta Testers ({betaUsers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {betaUsersLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      ) : betaUsers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">{t("pages.admin.noBetaTestersYet")}</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-gray-50">
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.username")}</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.tier7")}</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.inviteCode")}</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.referralCode")}</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.referrals")}</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.expiry")}</th>
                                <th className="text-left px-4 py-2 font-medium text-gray-600">{t("pages.admin.status3")}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {betaUsers.map((u: any, idx: number) => {
                                const isExpired = u.testerExpiry && new Date(u.testerExpiry) < new Date();
                                return (
                                  <tr key={u.id} className={isExpired ? "opacity-60" : ""} data-testid={`beta-user-row-${idx}`}>
                                    <td className="px-4 py-2 font-medium">{u.username}</td>
                                    <td className="px-4 py-2">
                                      <Badge variant="outline">{u.tier?.toUpperCase() || "FREE"}</Badge>
                                    </td>
                                    <td className="px-4 py-2 font-mono text-xs">{u.testerInviteCode || "-"}</td>
                                    <td className="px-4 py-2 font-mono text-xs">{u.referralCode || "-"}</td>
                                    <td className="px-4 py-2">{u.referralUses || 0}</td>
                                    <td className="px-4 py-2 text-xs">
                                      {u.testerExpiry ? new Date(u.testerExpiry).toLocaleDateString() : "No expiry"}
                                    </td>
                                    <td className="px-4 py-2">
                                      <Badge variant={isExpired ? "secondary" : "default"}>
                                        {isExpired ? "Expired" : "Active"}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {betaFeedback.length > 0 && (
                    <Card className="border border-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          Tester Feedback ({betaFeedback.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {betaFeedback.map((fb: any, idx: number) => (
                            <div key={fb.id} className="p-4" data-testid={`beta-feedback-row-${idx}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{fb.username || "Unknown"}</span>
                                    <Badge variant={fb.category === "bug" ? "destructive" : fb.category === "feature" ? "default" : "secondary"} className="text-xs">
                                      {fb.category || "General"}
                                    </Badge>
                                    {fb.severity && (
                                      <Badge variant="outline" className="text-xs">
                                        {fb.severity}
                                      </Badge>
                                    )}
                                    <Badge variant={fb.status === "resolved" ? "default" : "outline"} className="text-xs">
                                      {fb.status || "pending"}
                                    </Badge>
                                  </div>
                                  {fb.title && <p className="text-sm font-medium text-gray-800 mb-1">{fb.title}</p>}
                                  <p className="text-sm text-gray-700">{fb.description || fb.message || ""}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "deck-moderation" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{t("pages.admin.deckReports")}</h2>
                    <Button size="sm" variant="outline" onClick={fetchDeckReports} data-testid="button-refresh-deck-reports">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                  <Card className="border border-primary/10">
                    <CardContent className="p-0">
                      {deckReportsLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      ) : deckReports.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8" data-testid="text-no-deck-reports">{t("pages.admin.noDeckReportsSubmittedYet")}</p>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {deckReports.map((report: any, idx: number) => (
                            <div key={report.id || idx} className="p-4 hover:bg-gray-50/50 transition-colors" data-testid={`card-deck-report-${idx}`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={
                                      report.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                      report.status === "resolved" ? "bg-green-100 text-green-700 border-green-200" :
                                      "bg-gray-100 text-gray-500 border-gray-200"
                                    }>
                                      {report.status || "pending"}
                                    </Badge>
                                    <span className="text-xs text-gray-500 capitalize">{report.reason || "inaccuracy"}</span>
                                  </div>
                                  <p className="text-sm text-gray-800 font-medium mb-1">
                                    Deck: <span className="font-mono text-xs">{report.deckId?.substring(0, 8)}...</span>
                                    {report.cardId && <> / Card: <span className="font-mono text-xs">{report.cardId.substring(0, 8)}...</span></>}
                                  </p>
                                  {report.details && (
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-2">{report.details}</p>
                                  )}
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>Reported by: <span className="font-medium text-gray-700">{report.reporterUsername || "Anonymous"}</span></span>
                                    <span>{report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  {report.status !== "resolved" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => updateDeckReportStatus(report.id, "resolved")}
                                      data-testid={`button-resolve-report-${idx}`}
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-1" />
                                      Resolve
                                    </Button>
                                  )}
                                  {report.status !== "dismissed" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-gray-500 border-gray-200 hover:bg-gray-50"
                                      onClick={() => updateDeckReportStatus(report.id, "dismissed")}
                                      data-testid={`button-dismiss-report-${idx}`}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Dismiss
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "flashcard-preview" && (
                <FlashcardPreviewConfigPanel userId={user?.id || ""} />
              )}
              {activeTab === "content-security" && (
                <AdminContentSecurity />
              )}

              {activeTab === "pricing" && (
                <AdminPricingPanel />
              )}

              {activeTab === "sub-analytics" && (
                <SubscriptionAnalyticsPanel />
              )}
              {activeTab === "trial-analytics" && (
                <AdminTrialAnalytics />
              )}
              {activeTab === "content-growth" && (
                <AdminContentGrowth />
              )}
              {activeTab === "cert-analytics" && (
                <CertExamBankAnalytics />
              )}
              {activeTab === "tutor-management" && (
                <AdminTutorManagement />
              )}
              {activeTab === "qbank-pipeline" && (
                <AdminQBankPipeline />
              )}
              {activeTab === "expansion-roadmap" && (
                <AdminExpansionRoadmap />
              )}
              {activeTab === "content-health" && (
                <AdminContentHealth />
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function FlashcardPreviewConfigPanel({ userId }: { userId: string }) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionLimit, setSessionLimit] = useState(5);
  const [dailyLimit, setDailyLimit] = useState(10);
  const [allowedTopics, setAllowedTopics] = useState("");
  const [allowedTiers, setAllowedTiers] = useState("");
  const [upgradeHeadline, setUpgradeHeadline] = useState("Unlock the Full Flashcard Library");
  const [upgradeBody, setUpgradeBody] = useState("");

  const getAdminCreds = () => {
    try {
      const stored = localStorage.getItem("nursenest-admin");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { username: parsed.username || "", password: parsed.password || "" };
      }
    } catch {}
    return { username: "", password: "" };
  };

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const { username, password } = getAdminCreds();
      const res = await fetch(`/api/admin/flashcard-preview/config?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setSessionLimit(data.sessionLimit || 5);
        setDailyLimit(data.dailyLimit || 10);
        setAllowedTopics((data.allowedTopics || []).join(", "));
        setAllowedTiers((data.allowedTiers || []).join(", "));
        setUpgradeHeadline(data.upgradeHeadline || "Unlock the Full Flashcard Library");
        setUpgradeBody(data.upgradeBody || "");
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const saveConfig = async () => {
    setSaving(true);
    try {
      const { username, password } = getAdminCreds();
      await fetch("/api/admin/flashcard-preview/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          sessionLimit,
          dailyLimit,
          allowedTopics: allowedTopics.split(",").map(t => t.trim()).filter(Boolean),
          allowedTiers: allowedTiers.split(",").map(t => t.trim()).filter(Boolean),
          upgradeHeadline,
          upgradeBody,
        }),
      });
      loadConfig();
    } catch {} finally { setSaving(false); }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">{t("pages.admin.loadingPreviewConfig")}</div>;
  }

  return (
    <div className="space-y-6" data-testid="panel-flashcard-preview-config">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800" data-testid="text-preview-config-heading">{t("pages.admin.flashcardPreviewConfiguration")}</h2>
        <Button size="sm" variant="outline" onClick={loadConfig} data-testid="button-refresh-preview-config">
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>
      <p className="text-sm text-gray-500">{t("pages.admin.configureHowManyFlashcardsFree")}</p>

      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">{t("pages.admin.previewLimits")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.sessionLimit")}</label>
              <Input
                type="number"
                value={sessionLimit}
                onChange={(e) => setSessionLimit(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                data-testid="input-session-limit"
              />
              <p className="text-xs text-gray-400 mt-1">{t("pages.admin.maxCardsPerStudySession")}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.dailyLimit")}</label>
              <Input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                data-testid="input-daily-limit"
              />
              <p className="text-xs text-gray-400 mt-1">{t("pages.admin.maxCardsPerDayFor")}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.allowedPreviewTopics")}</label>
            <Input
              value={allowedTopics}
              onChange={(e) => setAllowedTopics(e.target.value)}
              placeholder="e.g., Cardiovascular, Respiratory (comma-separated, blank = all)"
              data-testid="input-allowed-topics"
            />
            <p className="text-xs text-gray-400 mt-1">{t("pages.admin.leaveBlankToAllowAll")}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.allowedPreviewTiers")}</label>
            <Input
              value={allowedTiers}
              onChange={(e) => setAllowedTiers(e.target.value)}
              placeholder="e.g., free, rpn (comma-separated, blank = all)"
              data-testid="input-allowed-tiers"
            />
            <p className="text-xs text-gray-400 mt-1">{t("pages.admin.leaveBlankToAllowAll2")}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">{t("pages.admin.upgradeMessage")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.headline")}</label>
            <Input
              value={upgradeHeadline}
              onChange={(e) => setUpgradeHeadline(e.target.value)}
              placeholder={t("pages.admin.unlockTheFullFlashcardLibrary")}
              data-testid="input-upgrade-headline"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("pages.admin.bodyText")}</label>
            <textarea
              value={upgradeBody}
              onChange={(e) => setUpgradeBody(e.target.value)}
              placeholder={t("pages.admin.getUnlimitedFlashcardsAdaptiveReview")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[80px]"
              data-testid="input-upgrade-body"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={saveConfig}
        disabled={saving}
        className="w-full"
        data-testid="button-save-preview-config"
      >
        {saving ? "Saving..." : "Save Configuration"}
      </Button>
    </div>
  );
}

function AdminPricingPanel() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterTier, setFilterTier] = useState<string>("all");

  const getAdminCreds = () => {
    try {
      const stored = localStorage.getItem("nursenest-admin");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { username: parsed.username || "", password: parsed.password || "" };
      }
    } catch {}
    return { username: "", password: "" };
  };

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pricing/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const savePlan = async () => {
    if (!editingPlan) return;
    setSaving(true);
    try {
      const { username, password } = getAdminCreds();
      const res = await fetch(`/api/pricing/plans/${editingPlan.id}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceCad: editingPlan.priceCad,
          priceUsd: editingPlan.priceUsd,
          isEnabled: editingPlan.isEnabled,
          isPopular: editingPlan.isPopular,
          isFoundingPrice: editingPlan.isFoundingPrice,
          featureList: editingPlan.featureList,
        }),
      });
      if (res.ok) {
        setEditingPlan(null);
        loadPlans();
      }
    } catch {}
    setSaving(false);
  };

  const tierColors: Record<string, string> = {
    rpn: "bg-blue-100 text-blue-700",
    rn: "bg-purple-100 text-purple-700",
    np: "bg-amber-100 text-amber-700",
    allied: "bg-teal-100 text-teal-700",
  };

  const tierLabels: Record<string, string> = {
    rpn: "RPN/LVN",
    rn: "RN/NCLEX",
    np: "NP Advanced",
    allied: "Allied Health",
  };

  const durationLabels: Record<string, string> = {
    monthly: "Monthly",
    "3-month": "3 Months",
    "6-month": "6 Months",
    yearly: "Yearly",
    lifetime: "Lifetime",
  };

  const filtered = filterTier === "all" ? plans : plans.filter((p: any) => p.tier === filterTier);

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-6" data-testid="section-pricing-admin">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" data-testid="text-pricing-admin-title">{t("pages.admin.pricingPlanManagement")}</h2>
        <div className="flex gap-2">
          <select
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            data-testid="select-filter-tier"
          >
            <option value="all">{t("pages.admin.allTiers")}</option>
            <option value="rpn">{t("pages.admin.rpnlvn2")}</option>
            <option value="rn">{t("pages.admin.rnnclex")}</option>
            <option value="np">{t("pages.admin.npAdvanced")}</option>
            <option value="allied">{t("pages.admin.alliedHealth")}</option>
          </select>
          <Button variant="outline" size="sm" onClick={loadPlans} data-testid="button-refresh-plans">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((plan: any) => (
          <Card key={plan.id} className={`border ${!plan.isEnabled ? "opacity-60 bg-gray-50" : ""}`} data-testid={`card-admin-plan-${plan.id}`}>
            <CardContent className="py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={tierColors[plan.tier] || "bg-gray-100 text-gray-700"} data-testid={`badge-tier-${plan.id}`}>
                    {tierLabels[plan.tier] || plan.tier}
                  </Badge>
                  <span className="font-semibold text-gray-900" data-testid={`text-duration-${plan.id}`}>
                    {plan.isLifetime && <Crown className="w-4 h-4 inline mr-1 text-amber-500" />}
                    {durationLabels[plan.duration] || plan.duration}
                  </span>
                  {plan.isPopular && <Badge className="bg-primary/10 text-primary text-xs">{t("pages.admin.popular")}</Badge>}
                  {plan.isFoundingPrice && <Badge className="bg-amber-100 text-amber-700 text-xs">{t("pages.admin.founding")}</Badge>}
                  {!plan.isEnabled && <Badge variant="destructive" className="text-xs">{t("pages.admin.disabled2")}</Badge>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900" data-testid={`text-price-cad-${plan.id}`}>
                      ${(plan.priceCad / 100).toFixed(2)} CAD
                    </div>
                    <div className="text-xs text-gray-500" data-testid={`text-price-usd-${plan.id}`}>
                      ${(plan.priceUsd / 100).toFixed(2)} USD
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPlan({ ...plan })}
                    data-testid={`button-edit-plan-${plan.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {plan.featureList && plan.featureList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {(plan.featureList as string[]).map((f: string, i: number) => (
                    <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="modal-edit-plan">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit {tierLabels[editingPlan.tier]} - {durationLabels[editingPlan.duration]}</span>
                <Button variant="ghost" size="sm" onClick={() => setEditingPlan(null)} data-testid="button-close-edit">
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("pages.admin.priceCadCents")}</label>
                  <Input
                    type="number"
                    value={editingPlan.priceCad}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceCad: parseInt(e.target.value) || 0 })}
                    data-testid="input-price-cad"
                  />
                  <span className="text-xs text-gray-400">${(editingPlan.priceCad / 100).toFixed(2)} CAD</span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("pages.admin.priceUsdCents")}</label>
                  <Input
                    type="number"
                    value={editingPlan.priceUsd}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceUsd: parseInt(e.target.value) || 0 })}
                    data-testid="input-price-usd"
                  />
                  <span className="text-xs text-gray-400">${(editingPlan.priceUsd / 100).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isEnabled}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded"
                    data-testid="checkbox-enabled"
                  />
                  <span className="text-sm font-medium">{t("pages.admin.enabled2")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isPopular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded"
                    data-testid="checkbox-popular"
                  />
                  <span className="text-sm font-medium">{t("pages.admin.popularBadge")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isFoundingPrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isFoundingPrice: e.target.checked })}
                    className="w-4 h-4 rounded"
                    data-testid="checkbox-founding"
                  />
                  <span className="text-sm font-medium">{t("pages.admin.foundingPrice")}</span>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("pages.admin.featuresOnePerLine")}</label>
                <Textarea
                  value={(editingPlan.featureList || []).join("\n")}
                  onChange={(e) => setEditingPlan({ ...editingPlan, featureList: e.target.value.split("\n").filter((f: string) => f.trim()) })}
                  rows={5}
                  data-testid="textarea-features"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={savePlan} disabled={saving} className="flex-1" data-testid="button-save-plan">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditingPlan(null)} data-testid="button-cancel-edit">{t("pages.admin.cancel")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function SubscriptionAnalyticsPanel() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getAdminCreds = () => {
    try {
      const stored = localStorage.getItem("nursenest-admin");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { username: parsed.username || "", password: parsed.password || "" };
      }
    } catch {}
    return { username: "", password: "" };
  };

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const { username, password } = getAdminCreds();
      const res = await fetch(`/api/admin/subscription-analytics?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (res.ok) {
        setAnalytics(await res.json());
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!analytics) return <div className="text-center py-10 text-gray-500">{t("pages.admin.noAnalyticsDataAvailable")}</div>;

  const tierLabels: Record<string, string> = { rpn: "RPN/LVN", rn: "RN/NCLEX", np: "NP Advanced", allied: "Allied Health", free: "Free" };
  const tierColors: Record<string, { text: string; bg: string }> = {
    rpn: { text: "text-blue-600", bg: "bg-blue-50" },
    rn: { text: "text-purple-600", bg: "bg-purple-50" },
    np: { text: "text-amber-600", bg: "bg-amber-50" },
    allied: { text: "text-teal-600", bg: "bg-teal-50" },
    free: { text: "text-gray-600", bg: "bg-gray-50" },
  };

  return (
    <div className="space-y-6" data-testid="section-sub-analytics">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" data-testid="text-sub-analytics-title">{t("pages.admin.subscriptionAnalytics")}</h2>
        <Button variant="outline" size="sm" onClick={loadAnalytics} data-testid="button-refresh-analytics">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="section-sub-kpis">
        <Card>
          <CardContent className="py-4 px-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{t("pages.admin.activeSubscribers2")}</div>
                <div className="text-xl font-bold" data-testid="text-total-active">{analytics.totalActive || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 px-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{t("pages.admin.lifetimeMembers")}</div>
                <div className="text-xl font-bold" data-testid="text-total-lifetime">{analytics.totalLifetime || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 px-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{t("pages.admin.freeUsers")}</div>
                <div className="text-xl font-bold" data-testid="text-total-free">{analytics.totalFree || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 px-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{t("pages.admin.conversionRate2")}</div>
                <div className="text-xl font-bold" data-testid="text-conversion-rate">
                  {analytics.totalActive && analytics.totalFree ? ((analytics.totalActive / (analytics.totalActive + analytics.totalFree)) * 100).toFixed(1) : "0"}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("pages.admin.subscribersByTier")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" data-testid="section-tier-breakdown">
            {(analytics.byTier || []).map((item: any) => {
              const tc = tierColors[item.tier] || { text: "text-gray-600", bg: "bg-gray-50" };
              const maxCount = Math.max(...(analytics.byTier || []).map((t: any) => t.count), 1);
              const barWidth = (item.count / maxCount) * 100;
              return (
                <div key={item.tier} className="flex items-center gap-4" data-testid={`row-tier-${item.tier}`}>
                  <div className="w-24 text-sm font-medium text-gray-700">{tierLabels[item.tier] || item.tier}</div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div className={`h-full ${tc.bg} rounded-lg transition-all`} style={{ width: `${barWidth}%` }} />
                    <span className={`absolute inset-0 flex items-center px-3 text-sm font-semibold ${tc.text}`}>
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {analytics.byStatus && analytics.byStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.admin.subscribersByStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="section-status-breakdown">
              {analytics.byStatus.map((item: any) => (
                <div key={item.status} className="text-center p-3 bg-gray-50 rounded-lg" data-testid={`card-status-${item.status}`}>
                  <div className="text-xl font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500 capitalize">{item.status || "unknown"}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analytics.recentSubscribers && analytics.recentSubscribers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("pages.admin.recentSubscribers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2" data-testid="section-recent-subscribers">
              {analytics.recentSubscribers.map((sub: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0" data-testid={`row-subscriber-${idx}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {(sub.username || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sub.username}</div>
                      <div className="text-xs text-gray-400">{sub.email || "No email"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={tierColors[sub.tier]?.bg ? `${tierColors[sub.tier].bg} ${tierColors[sub.tier].text}` : "bg-gray-100 text-gray-700"}>
                      {tierLabels[sub.tier] || sub.tier}
                    </Badge>
                    {sub.isLifetime && (
                      <Badge className="bg-amber-100 text-amber-700">
                        <Crown className="w-3 h-3 mr-1" /> Lifetime
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CertExamBankAnalytics() {
  const analytics = getCertAnalytics();
  const totalQuestions = getCertTotalQuestions();
  const totalMockExams = getCertTotalMockExams();
  const certCount = getCertCount();
  const totalScenarios = getCertTotalScenarioQuestions();
  const thinCerts = getThinCertifications();

  return (
    <div className="space-y-6" data-testid="section-cert-analytics">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{t("pages.admin.certificationExamBankAnalytics")}</h2>
        <Badge className="bg-emerald-100 text-emerald-700">
          {certCount} Certifications
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900" data-testid="stat-total-questions">{totalQuestions.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{t("pages.admin.totalQuestions")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700" data-testid="stat-scenario-questions">{totalScenarios.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{t("pages.admin.scenarioQuestions")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900" data-testid="stat-total-mocks">{totalMockExams}</div>
            <div className="text-sm text-gray-500">{t("pages.admin.mockExams2")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900" data-testid="stat-cert-count">{certCount}</div>
            <div className="text-sm text-gray-500">{t("pages.admin.certifications")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900" data-testid="stat-avg-questions">{Math.round(totalQuestions / certCount).toLocaleString()}</div>
            <div className="text-sm text-gray-500">{t("pages.admin.avgQuestionscert")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700" data-testid="stat-ai-pool-avg">{Math.round(analytics.reduce((s, c) => s + c.aiPoolCoverage, 0) / certCount)}%</div>
            <div className="text-sm text-gray-500">{t("pages.admin.avgAiPoolCoverage")}</div>
          </CardContent>
        </Card>
      </div>

      {thinCerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50" data-testid="alert-thin-certifications">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
              Thin Certification Alerts — Below {CERT_QUESTION_TARGET.toLocaleString()} Question Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {thinCerts.map((cert) => (
                <div key={cert.slug} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-amber-200" data-testid={`alert-thin-${cert.slug}`}>
                  <div>
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({cert.fullName})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{cert.totalQuestions.toLocaleString()} questions</span>
                    <Badge className="bg-red-100 text-red-700">{cert.deficit.toLocaleString()} below target</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("pages.admin.questionBankCoverageByCertification")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.map((cert) => (
              <div key={cert.slug} className={`border rounded-lg p-4 ${cert.belowTarget ? "border-amber-300 bg-amber-50/30" : "border-gray-100"}`} data-testid={`cert-row-${cert.slug}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    <span className="text-sm text-gray-500">({cert.fullName})</span>
                    {cert.belowTarget && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">{cert.totalQuestions.toLocaleString()} questions</Badge>
                    <Badge variant="outline" className="text-xs">{cert.scenarioQuestionCount} scenarios</Badge>
                    <Badge variant="outline" className="text-xs">{cert.mockExamCount} mocks</Badge>
                    <Badge variant="outline" className="text-xs">{cert.topicBankCount} topics</Badge>
                    <Badge className={cert.aiPoolCoverage >= 90 ? "bg-emerald-100 text-emerald-700" : cert.aiPoolCoverage >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>
                      {cert.aiPoolCoverage}% coverage
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cert.topicCoverage.map((topic) => (
                    <div key={topic.topic} className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5 text-xs">
                      <span className="text-gray-600 truncate mr-2">{topic.topic}</span>
                      <span className={`font-medium ${topic.questionCount >= 250 ? "text-emerald-600" : topic.questionCount >= 200 ? "text-amber-600" : "text-red-500"}`}>
                        {topic.questionCount}
                      </span>
                    </div>
                  ))}
                </div>
                {cert.thinCategories.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Thin coverage: {cert.thinCategories.map(t => t.topic).join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="section-content-roadmap">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Content Expansion Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {CONTENT_EXPANSION_ROADMAP.map((item) => (
              <div key={item.priority} className="border border-gray-100 rounded-lg p-4" data-testid={`roadmap-item-${item.priority}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                      {item.priority}
                    </span>
                    <span className="font-semibold text-gray-900">{item.title}</span>
                  </div>
                  <Badge className={item.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}>
                    {item.status === "in-progress" ? "In Progress" : "Planned"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3 ml-9">{item.description}</p>
                <div className="ml-9 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-gray-50 rounded px-3 py-1.5 text-xs">
                    <span className="text-gray-500">{t("pages.admin.seoPotential")} </span>
                    <span className={`font-medium ${item.seoImpact === "High" ? "text-emerald-600" : item.seoImpact === "Medium" ? "text-amber-600" : "text-gray-500"}`}>{item.seoImpact}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-3 py-1.5 text-xs">
                    <span className="text-gray-500">{t("pages.admin.conversion")} </span>
                    <span className={`font-medium ${item.conversionImpact === "High" ? "text-emerald-600" : item.conversionImpact === "Medium" ? "text-amber-600" : "text-gray-500"}`}>{item.conversionImpact}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-3 py-1.5 text-xs">
                    <span className="text-gray-500">{t("pages.admin.contentDepth")} </span>
                    <span className={`font-medium ${item.contentDepth === "High" ? "text-emerald-600" : item.contentDepth === "Medium" ? "text-amber-600" : "text-gray-500"}`}>{item.contentDepth}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-3 py-1.5 text-xs">
                    <span className="text-gray-500">{t("pages.admin.marketDemand")} </span>
                    <span className={`font-medium ${item.marketDemand === "High" ? "text-emerald-600" : item.marketDemand === "Medium" ? "text-amber-600" : "text-gray-500"}`}>{item.marketDemand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="section-build-summary">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Build Summary — Certification Expansion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-emerald-700" data-testid="summary-banks-created">{CERTIFICATION_BUILD_SUMMARY.banksCreated}</div>
              <div className="text-xs text-gray-600">{t("pages.admin.banksCreated")}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-700" data-testid="summary-mocks-created">{CERTIFICATION_BUILD_SUMMARY.mockExamsCreated}</div>
              <div className="text-xs text-gray-600">{t("pages.admin.mockExamsCreated")}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-700" data-testid="summary-questions-built">{CERTIFICATION_BUILD_SUMMARY.totalQuestionsBuilt.toLocaleString()}</div>
              <div className="text-xs text-gray-600">{t("pages.admin.totalQuestionsBuilt")}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-700" data-testid="summary-files-modified">{CERTIFICATION_BUILD_SUMMARY.filesModified.length}</div>
              <div className="text-xs text-gray-600">{t("pages.admin.filesModified")}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">{t("pages.admin.selectedPriority")}</div>
                <div className="text-sm text-gray-600">{CERTIFICATION_BUILD_SUMMARY.selectedPriority}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <Tag className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">{t("pages.admin.certifications2")}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {CERTIFICATION_BUILD_SUMMARY.certifications.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <FileText className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">{t("pages.admin.filesModified2")}</div>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  {CERTIFICATION_BUILD_SUMMARY.filesModified.map((f) => (
                    <div key={f} className="font-mono">{f}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-blue-900">{t("pages.admin.nextRecommendedExpansion")}</div>
                <div className="text-sm text-blue-700">{CERTIFICATION_BUILD_SUMMARY.nextRecommendedExpansion}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}