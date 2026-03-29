import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { getPracticalNurseExamName } from "@shared/constants";
import { useRegion } from "@/hooks/use-region";
import { ExamErrorBoundary } from "@/components/exam-error-boundary";
import { getExamQuestions, getPoolStats, getAvailableBodySystems, getAvailableBlueprintsForTier, getOfficialExamQuestions, getReadinessExamQuestions, getReadinessExamForTier, EXAM_BLUEPRINTS, READINESS_EXAMS } from "@/lib/question-pool";
import type { ExamBlueprint } from "@/lib/question-pool";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { SocialProofBar } from "@/components/conversion-funnel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  GraduationCap, Clock, FileText, BarChart3, ChevronRight,
  Brain, Target, Trophy, ArrowRight, History, Lock, ShieldAlert, Shield, Zap, Gift,
  Check, Palette, Stethoscope, Play
} from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AITutorWidget } from "@/components/ai-tutor-widget";
import { ContextualRelatedResources } from "@/components/related-resources";
import { getTierConfig } from "@shared/tier-config";
import { useToast } from "@/hooks/use-toast";
import { classifyHttpError, classifyClientError, EXAM_ERROR_USER_MESSAGES, EXAM_FAILURE_CODES } from "@shared/exam-error-codes";
import { ExamListingFallback } from "@/components/exam-fallbacks";
import { CAREER_TYPES, CAREER_CONFIGS } from "@shared/careers";

interface MockExamDef {
  id: string;
  specialty: string;
  examNumber: number;
  title: string;
  difficultyLevel: string;
  categoryTags: string[];
  timeLimit: number;
  sections: { name: string; questionCount: number }[];
  totalQuestions: number;
}

function SpecialtyMockExams() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const [examDefs, setExamDefs] = useState<MockExamDef[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetch("/api/mock-exam-definitions")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setExamDefs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[SpecialtyMockExams] Failed to load exam definitions:", err?.message);
        setFetchError(true);
        setLoading(false);
      });
  }, []);

  const specialties = [...new Set(examDefs.map((d) => d.specialty))];
  const nonNursingSpecialties = specialties.filter((s) => s !== "nursing");
  const allSpecialties = ["nursing", ...nonNursingSpecialties];

  const startSpecialtyExam = async (examDef: MockExamDef) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setStarting(examDef.id);
    try {
      const res = await fetch("/api/mock-exams/start-specialty", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ examDefinitionId: examDef.id, specialty: examDef.specialty }),
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        const httpErr: any = new Error(data.error || data.message || "Exam start failed");
        httpErr.status = res.status;
        httpErr.code = data.reasonCode || data.code;
        httpErr.reasonCode = data.reasonCode;
        httpErr.recoverable = data.recoverable;
        httpErr.requiredTier = data.requiredTier;
        httpErr.fallbackHint = data.fallbackHint;
        throw httpErr;
      }
      if (data.attemptId) {
        localStorage.setItem(`specialty-mock-${data.attemptId}`, JSON.stringify({
          timeLimit: examDef.timeLimit,
          examTitle: examDef.title,
          specialty: examDef.specialty,
          sections: examDef.sections,
        }));
        navigate(`/mock-exams/${data.attemptId}`);
      } else {
        const noSessionErr: any = new Error("No exam session was created.");
        noSessionErr.code = EXAM_FAILURE_CODES.SESSION_CREATE_FAILED;
        noSessionErr.recoverable = true;
        throw noSessionErr;
      }
    } catch (err: any) {
      const httpStatus = err?.status || 0;
      const reasonCode = err?.code || err?.reasonCode || "";
      const classified = httpStatus > 0
        ? classifyHttpError(httpStatus, { reasonCode: reasonCode || undefined, error: err?.message, recoverable: err?.recoverable, requiredTier: err?.requiredTier, fallbackHint: err?.fallbackHint })
        : classifyClientError(err instanceof Error ? err : new Error(err?.message || "Unknown error"));

      console.error("[MockExam][specialty] startSpecialtyExam failed:", { message: err?.message, code: classified.code, httpStatus, recoverable: classified.recoverable, examId: examDef.id });

      if (!classified.recoverable) {
        const userMsg = EXAM_ERROR_USER_MESSAGES[classified.code] || EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
        toast({ title: userMsg.title, description: userMsg.description, variant: "destructive" });
        setStarting(null);
        return;
      }

      try {
        toast({ title: "Restoring previous session...", description: "Looking for an existing exam session to resume." });
        const resumeRes = await fetch("/api/mock-exams/resume-latest", {
          headers: { ...getAuthHeaders() },
        });
        if (resumeRes.ok) {
          const resumeData = await resumeRes.json();
          if (resumeData.attemptId) {
            toast({ title: "Session Restored", description: "Your previous exam session was restored." });
            navigate(`/mock-exams/${resumeData.attemptId}`);
            return;
          }
        }
      } catch (resumeErr) {
        console.warn("[MockExam][specialty] Resume fallback failed:", resumeErr);
      }

      const userMsg = EXAM_ERROR_USER_MESSAGES[classified.code] || EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
      toast({ title: userMsg.title, description: userMsg.description, variant: "destructive" });
      setStarting(null);
    }
  };

  if (loading) return null;
  if (fetchError) {
    return (
      <ExamListingFallback
        type="pool"
        onRetry={() => {
          setFetchError(false);
          setLoading(true);
          fetch("/api/mock-exam-definitions")
            .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data) => { setExamDefs(Array.isArray(data) ? data : []); setLoading(false); })
            .catch((err) => { console.error("[SpecialtyMockExams] Retry failed:", err?.message); setFetchError(true); setLoading(false); });
        }}
        retrying={loading}
      />
    );
  }
  if (!Array.isArray(examDefs) || examDefs.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="specialty-mock-exams-section">
      <div className="text-center mb-8 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-specialty-exams-title">
          Specialty Mock Exams
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Full-length, timed mock exams for all healthcare specialties. 100 questions across 6 clinical sections.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {allSpecialties.map((sp) => {
          const config = CAREER_CONFIGS[sp as keyof typeof CAREER_CONFIGS];
          if (!config) return null;
          const isSelected = selectedSpecialty === sp;
          return (
            <button
              key={sp}
              onClick={() => setSelectedSpecialty(isSelected ? null : sp)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
              data-testid={`button-specialty-${sp}`}
              style={isSelected ? { borderColor: config.color, backgroundColor: config.colorAccent, color: config.color } : undefined}
            >
              {config.shortName}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(selectedSpecialty ? allSpecialties.filter((s) => s === selectedSpecialty) : allSpecialties).map((sp) => {
          const config = CAREER_CONFIGS[sp as keyof typeof CAREER_CONFIGS];
          if (!config) return null;
          const exams = examDefs.filter((d) => d.specialty === sp);
          if (exams.length === 0) return null;

          return (
            <Card key={sp} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden" data-testid={`card-specialty-${sp}`}>
              <div className="h-2" style={{ backgroundColor: config.color }} />
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: config.colorAccent }}>
                    <Stethoscope className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm" data-testid={`text-specialty-name-${sp}`}>{config.shortName}</h3>
                    <p className="text-xs text-gray-500">{exams.length} exams available</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {exams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900" data-testid={`text-exam-title-${exam.id}`}>
                          Exam {exam.examNumber}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {exam.totalQuestions}q
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {exam.timeLimit}min
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs"
                        onClick={() => startSpecialtyExam(exam)}
                        disabled={starting === exam.id}
                        data-testid={`button-start-specialty-exam-${exam.id}`}
                      >
                        {starting === exam.id ? "Starting..." : user ? "Start" : "Sign in"}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">{t("pages.mockExams.sections")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(exams[0]?.sections || []).map((s: any) => (
                      <Badge key={s.name} variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const EXAM_THEMES = [
  { id: "pastelLilac", name: "Pastel Lilac", color: "#C8B6FF" },
  { id: "softRose", name: "Soft Rose", color: "#F4A6B5" },
  { id: "skyBlue", name: "Sky Blue", color: "#A9D6FF" },
  { id: "mintClinical", name: "Mint Clinical", color: "#A8E6CF" },
  { id: "warmPeach", name: "Warm Peach", color: "#FFD6A5" },
  { id: "nursenestPurple", name: "Classic NurseNest", color: "#8A6BFF" },
  { id: "minimalNeutral", name: "Minimal Neutral", color: "#CBD5E1" },
  { id: "highContrast", name: "High Contrast", color: "#4F46E5" },
];

import { getAuthHeaders } from "@/lib/qbank-api";

function getPrimaryExamTier(userTier: string | undefined, isAdmin: boolean, previewActive: boolean): string | null {
  if (isAdmin && !previewActive) return null;
  if (!userTier || userTier === "free") return null;
  return userTier;
}

export default function MockExamsPageWithBoundary() {
  return (
    <ExamErrorBoundary examContext={{ examType: "mock-exams-listing" }}>
      <MockExamsPage />
    </ExamErrorBoundary>
  );
}

function MockExamsPage() {
  const { user, effectiveTier, isAdmin, previewTier } = useAuth();
  const region = useRegion();
  const { t } = useI18n();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [pageError, setPageError] = useState<string | null>(null);
  const primaryExamTier = getPrimaryExamTier(effectiveTier, isAdmin, !!previewTier);
  const isAdminWithAllTiers = isAdmin && !previewTier;
  const allowedTiers = isAdminWithAllTiers ? ["rpn", "rn", "np"] : primaryExamTier ? [primaryExamTier] : [];
  const [selectedTier, setSelectedTier] = useState(primaryExamTier || (isAdminWithAllTiers ? "rpn" : "rpn"));
  const [selectedLength, setSelectedLength] = useState(75);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [strictMode, setStrictMode] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);
  const [poolError, setPoolError] = useState(false);
  const [poolRetrying, setPoolRetrying] = useState(false);
  const [historyRetrying, setHistoryRetrying] = useState(false);
  const [examMode, setExamMode] = useState<"official" | "practice">("official");
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>("");
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [examTheme, setExamTheme] = useState(() => localStorage.getItem("examTheme") || "nursenestPurple");
  const [customLength, setCustomLength] = useState("");
  const [userRegion, setUserRegion] = useState<"US" | "CA">(() => (localStorage.getItem("nursenest-region") as "US" | "CA") || "US");

  useEffect(() => {
    const handleRegionChange = () => {
      setUserRegion((localStorage.getItem("nursenest-region") as "US" | "CA") || "US");
    };
    window.addEventListener("regionChange", handleRegionChange);
    window.addEventListener("storage", handleRegionChange);
    return () => {
      window.removeEventListener("regionChange", handleRegionChange);
      window.removeEventListener("storage", handleRegionChange);
    };
  }, []);

  let availableBlueprints: ExamBlueprint[] = [];
  try {
    availableBlueprints = getAvailableBlueprintsForTier(selectedTier, userRegion) || [];
  } catch (err) {
    console.error("[MockExams] Failed to get blueprints:", err);
  }

  useEffect(() => {
    try {
      const bps = getAvailableBlueprintsForTier(selectedTier, userRegion) || [];
      if (bps.length > 0) {
        setSelectedBlueprint(bps[0].examCode);
      }
    } catch (err) {
      console.error("[MockExams] Failed to get blueprints for tier:", err);
    }
  }, [selectedTier, userRegion]);

  const examLengths = [
    { count: 25, label: t("mockExams.quickReview"), time: t("mockExams.quickReviewTime"), desc: t("mockExams.quickReviewDesc") },
    { count: 75, label: t("mockExams.standard"), time: t("mockExams.standardTime"), desc: t("mockExams.standardDesc") },
    { count: 100, label: t("mockExams.fullLength"), time: t("mockExams.fullLengthTime"), desc: t("mockExams.fullLengthDesc") },
    { count: 150, label: t("mockExams.extended"), time: t("mockExams.extendedTime"), desc: t("mockExams.extendedDesc") },
  ];

  const tierOptions = [
    { value: "rpn", label: t("mockExams.tierRpnLabel"), desc: t("mockExams.tierRpnDesc") },
    { value: "rn", label: t("mockExams.tierRnLabel"), desc: t("mockExams.tierRnDesc") },
    { value: "np", label: t("mockExams.tierNpLabel"), desc: t("mockExams.tierNpDesc") },
  ];

  const [availableSystems, setAvailableSystems] = useState<string[]>([]);
  const [stats, setStats] = useState<{ total: number; systems: Record<string, number> }>({ total: 0, systems: {} });
  const [tierStatsMap, setTierStatsMap] = useState<Record<string, { total: number }>>({});

  const loadPoolData = useCallback(() => {
    setPoolError(false);
    setPoolRetrying(true);
    Promise.all([
      getAvailableBodySystems(selectedTier)
        .then((systems) => setAvailableSystems(Array.isArray(systems) ? systems : []))
        .catch((err) => {
          console.error("[MockExams] Failed to load body systems:", err?.message);
          setAvailableSystems([]);
          throw err;
        }),
      getPoolStats(selectedTier)
        .then((s) => setStats(s && typeof s.total === "number" ? s : { total: 0, systems: {} }))
        .catch((err) => {
          console.error("[MockExams] Failed to load pool stats:", err?.message);
          setStats({ total: 0, systems: {} });
          throw err;
        }),
    ])
      .catch(() => setPoolError(true))
      .finally(() => setPoolRetrying(false));
  }, [selectedTier]);

  useEffect(() => {
    loadPoolData();
  }, [loadPoolData]);

  useEffect(() => {
    const tiersToFetch = allowedTiers.length > 0 ? tierOptions.filter(t => allowedTiers.includes(t.value)) : tierOptions;
    Promise.all(
      tiersToFetch.map(async (t) => {
        try {
          const s = await getPoolStats(t.value);
          return [t.value, { total: s?.total || 0 }] as const;
        } catch {
          return [t.value, { total: 0 }] as const;
        }
      })
    ).then((entries) => setTierStatsMap(Object.fromEntries(entries)))
     .catch((err) => console.error("[MockExams] Failed to load tier stats:", err?.message));
  }, []);

  const filteredStats = selectedSystems.length > 0
    ? { total: selectedSystems.reduce((sum, sys) => sum + (stats.systems[sys] || 0), 0), systems: Object.fromEntries(Object.entries(stats.systems).filter(([sys]) => selectedSystems.includes(sys))) }
    : stats;

  const toggleSystem = (sys: string) => {
    setSelectedSystems((prev) =>
      prev.includes(sys) ? prev.filter((s) => s !== sys) : [...prev, sys]
    );
  };

  const loadHistory = useCallback(() => {
    if (!user?.id) return;
    setHistoryLoading(true);
    setHistoryError(false);
    setHistoryRetrying(true);
    fetch(`/api/mock-exams/history/${user.id}`, { headers: getAuthHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("[MockExams] Failed to load history:", err?.message);
        setHistory([]);
        setHistoryError(true);
      })
      .finally(() => {
        setHistoryLoading(false);
        setHistoryRetrying(false);
      });
  }, [user?.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const startExam = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setStarting(true);
    setStartError(null);
    try {
      let questions;
      let blueprintMeta: any = null;
      let domainAssignments: Record<string, string> | null = null;
      let useServerAssembly = false;
      let assemblyConfig: any = null;

      if (examMode === "official" && selectedBlueprint) {
        const blueprint = EXAM_BLUEPRINTS[selectedBlueprint];
        if (blueprint) {
          useServerAssembly = true;
          blueprintMeta = blueprint;
          assemblyConfig = {
            templateId: selectedBlueprint,
            examCode: blueprint.examCode,
            questionCount: blueprint.totalQuestions,
            timeLimitMinutes: blueprint.timeLimit || 180,
            domainWeights: blueprint.domains.map((d: any) => ({ domain: d.name, weight: d.weight })),
            difficultyDistribution: { foundational: 0.25, moderate: 0.5, difficult: 0.25 },
            formatMix: { mcqSingle: 0.6, selectAllThatApply: 0.2, scenarioBased: 0.1, prioritization: 0.05, delegation: 0.05 },
            passingStandard: blueprint.passingThreshold || 65,
            seed: Date.now(),
            tier: blueprint.tier,
          };
        } else {
          const result = await getOfficialExamQuestions(selectedBlueprint);
          questions = result.questions;
          blueprintMeta = result.blueprint;
          domainAssignments = result.domainAssignments;
        }
      } else {
        useServerAssembly = true;
        assemblyConfig = {
          templateId: "practice",
          examCode: "practice",
          questionCount: selectedLength,
          timeLimitMinutes: Math.ceil(selectedLength * 1.5),
          domainWeights: [{ domain: "General", weight: 1.0 }],
          difficultyDistribution: { foundational: 0.3, moderate: 0.4, difficult: 0.3 },
          formatMix: { mcqSingle: 0.6, selectAllThatApply: 0.2, scenarioBased: 0.1, prioritization: 0.05, delegation: 0.05 },
          passingStandard: 65,
          seed: Date.now(),
          tier: selectedTier,
          bodySystems: selectedSystems.length > 0 ? selectedSystems : undefined,
        };
      }

      if (!useServerAssembly && (!questions || questions.length === 0)) {
        toast({
          title: "No Questions Available",
          description: "No questions available for this exam configuration. Please try a different tier or body system.",
          variant: "destructive",
        });
        setStarting(false);
        return;
      }

      const res = await fetch("/api/mock-exams/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          tier: selectedTier,
          totalQuestions: useServerAssembly ? (assemblyConfig?.questionCount || selectedLength) : questions!.length,
          questions: useServerAssembly ? undefined : questions,
          serverAssembly: useServerAssembly || undefined,
          assemblyConfig: useServerAssembly ? assemblyConfig : undefined,
          examMode: examMode,
          blueprintCode: examMode === "official" ? selectedBlueprint : undefined,
          blueprintMeta: blueprintMeta ? {
            examCode: blueprintMeta.examCode,
            examName: blueprintMeta.examName,
            passingThreshold: blueprintMeta.passingThreshold,
            domainPassThreshold: blueprintMeta.domainPassThreshold,
            domains: blueprintMeta.domains,
            timeLimit: blueprintMeta.timeLimit,
            examType: blueprintMeta.examType,
            scaledScoreRange: blueprintMeta.scaledScoreRange,
            minQuestions: blueprintMeta.minQuestions,
            maxQuestions: blueprintMeta.maxQuestions,
            showQuestionCount: blueprintMeta.showQuestionCount,
          } : undefined,
          domainAssignments: domainAssignments || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err: any = new Error(data.error || "Failed to start exam session");
        err.code = data.reasonCode || data.code;
        err.reasonCode = data.reasonCode;
        err.status = res.status;
        err.recoverable = data.recoverable ?? data.retryable ?? false;
        err.retryable = data.retryable ?? data.recoverable ?? false;
        err.requiredTier = data.requiredTier;
        err.fallbackHint = data.fallbackHint;
        err.correlationId = data.correlationId;
        err.mode = data.mode;
        err.fallbackMessage = data.fallbackMessage;

        if (data.mode === "fallback_standard_exam") {
          toast({
            title: "CAT Engine Unavailable",
            description: data.fallbackMessage || "The adaptive exam engine is temporarily unavailable. You can take a standard mock exam instead.",
          });
          setStarting(false);
          setStartError(data.fallbackMessage || "CAT engine temporarily unavailable. Try a standard exam instead.");
          return;
        }

        throw err;
      }
      if (data.attemptId) {
        if (examMode === "official" || strictMode) {
          localStorage.setItem(`strict-mode-${data.attemptId}`, "true");
        }
        if (examMode === "official" && blueprintMeta) {
          localStorage.setItem(`blueprint-${data.attemptId}`, JSON.stringify({
            ...blueprintMeta,
            domainAssignments,
          }));
        }
        if (data.fallbackMode && data.fallbackMessage) {
          localStorage.setItem(`cat-fallback-${data.attemptId}`, JSON.stringify({
            fallbackMode: data.fallbackMode,
            fallbackMessage: data.fallbackMessage,
          }));
        }
        navigate(`/mock-exams/${data.attemptId}`);
      } else {
        const noSessionErr: any = new Error("No exam session was created.");
        noSessionErr.code = EXAM_FAILURE_CODES.SESSION_CREATE_FAILED;
        noSessionErr.recoverable = true;
        noSessionErr.retryable = true;
        throw noSessionErr;
      }
    } catch (err: any) {
      const correlationId = `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const httpStatus = err?.status || 0;
      const reasonCode = err?.code || err?.reasonCode || "";
      const classified = httpStatus > 0
        ? classifyHttpError(httpStatus, { reasonCode: reasonCode || undefined, error: err?.message, recoverable: err?.recoverable, requiredTier: err?.requiredTier, fallbackHint: err?.fallbackHint })
        : classifyClientError(err instanceof Error ? err : new Error(err?.message || "Unknown error"));

      console.error("[MockExam] startExam failed:", { correlationId, message: err?.message, code: classified.code, httpStatus, recoverable: classified.recoverable, tier: selectedTier, examMode, blueprint: selectedBlueprint });

      const isRetryable = err?.retryable ?? classified.recoverable;
      if (!isRetryable) {
        const userMsg = EXAM_ERROR_USER_MESSAGES[classified.code] || EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
        setStartError(userMsg.description);
        toast({ title: userMsg.title, description: userMsg.description, variant: "destructive" });
        setStarting(false);
        return;
      }

      const fallbackStages = [
        { name: "resume", label: "Checking for existing session..." },
        { name: "reduced", label: "Trying with fewer questions..." },
        { name: "minimal", label: "Attempting minimal exam..." },
        { name: "practice", label: "Redirecting to practice mode..." },
      ];

      const userMsg = EXAM_ERROR_USER_MESSAGES[classified.code] || EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
      toast({ title: userMsg.title, description: userMsg.description });

      for (const stage of fallbackStages) {
        try {
          console.log(`[MockExam] Fallback cascade: attempting ${stage.name}`, { correlationId });
          setStartError(stage.label);

          if (stage.name === "resume" && user) {
            const historyRes = await fetch(`/api/mock-exams/history/${user.id}`, { headers: getAuthHeaders() });
            if (historyRes.ok) {
              const historyData = await historyRes.json();
              const inProgress = Array.isArray(historyData)
                ? historyData.find((h: any) => h.status === "in_progress")
                : null;
              if (inProgress) {
                console.log("[MockExam] Fallback: resuming existing session", inProgress.id);
                toast({ title: "Resuming Exam", description: "Found an existing exam session. Resuming where you left off." });
                navigate(`/mock-exams/${inProgress.id}`);
                setStarting(false);
                setStartError(null);
                return;
              }
            }
          }

          if (stage.name === "reduced") {
            const reducedLength = Math.max(10, Math.floor(selectedLength / 2));
            const reducedConfig = {
              templateId: "practice",
              examCode: "practice",
              questionCount: reducedLength,
              timeLimitMinutes: Math.ceil(reducedLength * 1.5),
              domainWeights: [{ domain: "General", weight: 1.0 }],
              difficultyDistribution: { foundational: 0.4, moderate: 0.4, difficult: 0.2 },
              formatMix: { mcqSingle: 0.8, selectAllThatApply: 0.1, scenarioBased: 0.05, prioritization: 0.025, delegation: 0.025 },
              passingStandard: 65,
              seed: Date.now(),
              tier: selectedTier,
              bodySystems: selectedSystems.length > 0 ? selectedSystems : undefined,
            };
            const retryRes = await fetch("/api/mock-exams/start", {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              body: JSON.stringify({
                tier: selectedTier,
                totalQuestions: reducedLength,
                serverAssembly: true,
                assemblyConfig: reducedConfig,
                examMode: "practice",
              }),
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              if (retryData.attemptId) {
                console.log("[MockExam] Fallback: reduced exam started", retryData.attemptId);
                toast({ title: "Lighter Exam Ready", description: `Started a ${reducedLength}-question practice exam instead.` });
                navigate(`/mock-exams/${retryData.attemptId}`);
                setStarting(false);
                setStartError(null);
                return;
              }
            }
          }

          if (stage.name === "minimal") {
            const minimalConfig = {
              templateId: "practice",
              examCode: "practice",
              questionCount: 10,
              timeLimitMinutes: 15,
              domainWeights: [{ domain: "General", weight: 1.0 }],
              difficultyDistribution: { foundational: 0.6, moderate: 0.3, difficult: 0.1 },
              formatMix: { mcqSingle: 1.0, selectAllThatApply: 0, scenarioBased: 0, prioritization: 0, delegation: 0 },
              passingStandard: 65,
              seed: Date.now(),
              tier: selectedTier,
            };
            const minRes = await fetch("/api/mock-exams/start", {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              body: JSON.stringify({
                tier: selectedTier,
                totalQuestions: 10,
                serverAssembly: true,
                assemblyConfig: minimalConfig,
                examMode: "practice",
              }),
            });
            if (minRes.ok) {
              const minData = await minRes.json();
              if (minData.attemptId) {
                console.log("[MockExam] Fallback: minimal study mode started", minData.attemptId);
                toast({ title: "Study Mode Ready", description: "Started a 10-question study session to keep your momentum." });
                navigate(`/mock-exams/${minData.attemptId}`);
                setStarting(false);
                setStartError(null);
                return;
              }
            }
          }

          if (stage.name === "practice") {
            navigate("/test-bank");
            toast({ title: "Practice Mode", description: "Redirecting to the question bank where you can practice by category." });
            setStarting(false);
            setStartError(null);
            return;
          }
        } catch (fallbackErr) {
          console.warn(`[MockExam] Fallback ${stage.name} failed:`, fallbackErr);
        }
      }

      const finalMsg = EXAM_ERROR_USER_MESSAGES[classified.code] || EXAM_ERROR_USER_MESSAGES[EXAM_FAILURE_CODES.UNKNOWN];
      setStartError(`${finalMsg.description} (${classified.code})`);
      toast({ title: "Unable to Start Exam", description: "All recovery options were attempted. Please try again later or contact support.", variant: "destructive" });
      setStarting(false);
    }
  };

  const completedExams = Array.isArray(history) ? history.filter((h) => h?.status === "completed") : [];
  const avgScore = completedExams.length > 0
    ? Math.round(completedExams.reduce((sum, h) => {
        const totalQ = h?.total_questions || 1;
        const pct = totalQ > 0 ? ((h?.score || 0) / totalQ) * 100 : 0;
        return sum + pct;
      }, 0) / completedExams.length)
    : null;
  const bestScore = completedExams.length > 0
    ? Math.max(...completedExams.map((h) => {
        const totalQ = h?.total_questions || 1;
        return totalQ > 0 ? Math.round(((h?.score || 0) / totalQ) * 100) : 0;
      }))
    : null;

  let activeTierConfig: ReturnType<typeof getTierConfig>;
  try {
    activeTierConfig = getTierConfig(effectiveTier);
  } catch {
    activeTierConfig = getTierConfig("free");
  }
  const tierSpecificTitle = (effectiveTier && effectiveTier !== "free" && effectiveTier !== "admin")
    ? (activeTierConfig?.examPrepLabel || t("mockExams.pageTitle"))
    : t("mockExams.pageTitle");
  const tierSpecificSubtitle = (effectiveTier && effectiveTier !== "free" && effectiveTier !== "admin")
    ? `${activeTierConfig?.readinessLabel || ""} - ${(activeTierConfig?.tone || "").split(",")[0].trim()} exam preparation`
    : t("mockExams.pageSubtitle");

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO title={`${tierSpecificTitle} - NurseNest`} description={t("pages.mockExams.practiceWithRealisticNursingExam")} canonicalPath="/mock-exams" />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <BreadcrumbNav />
        <div className="text-center mb-12 space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-mock-exam-title">{tierSpecificTitle}</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {tierSpecificSubtitle}
          </p>
        </div>

        {completedExams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-primary">{completedExams.length}</p>
                <p className="text-sm text-gray-500">{t("mockExams.examsCompleted")}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <Target className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-600">{avgScore}%</p>
                <p className="text-sm text-gray-500">{t("mockExams.averageScore")}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600">{bestScore}%</p>
                <p className="text-sm text-gray-500">{t("mockExams.bestScore")}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {isAdminWithAllTiers && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tierOptions.filter((tier) => allowedTiers.includes(tier.value)).map((tier) => {
              const tierStats = tierStatsMap[tier.value] || { total: 0 };
              return (
                <button
                  key={tier.value}
                  onClick={() => setSelectedTier(tier.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    selectedTier === tier.value
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  data-testid={`button-tier-${tier.value}`}
                >
                  {tier.label} ({tierStats.total})
                </button>
              );
            })}
          </div>
        )}

        {!user && (
          <p className="text-sm text-gray-500 text-center py-2 mb-6">
            <LocaleLink href="/login" className="text-primary font-medium hover:underline">{t("mockExams.signIn")}</LocaleLink> {t("mockExams.signInPrompt")}
          </p>
        )}
        {user && allowedTiers.length === 0 && (
          <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-l-amber-400 mb-8">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{t("mockExams.subscriptionRequired")}</p>
                <p className="text-xs text-gray-600 mt-1">{t("mockExams.subscriptionDesc")}</p>
                <LocaleLink href="/pricing">
                  <Button size="sm" className="mt-2 rounded-full" data-testid="button-upgrade-exams">{t("mockExams.viewPlans")}</Button>
                </LocaleLink>
              </div>
            </CardContent>
          </Card>
        )}

        {(() => {
          const inProgressExams = Array.isArray(history) ? history.filter((h) => h?.status === "in_progress") : [];
          if (inProgressExams.length === 0) return null;
          return (
            <div className="mb-8 space-y-3" data-testid="in-progress-exams">
              <h2 className="text-lg font-bold flex items-center gap-2 text-amber-700">
                <Clock className="w-5 h-5" /> Resume In-Progress Exam
              </h2>
              {inProgressExams.map((exam) => {
                if (!exam?.id) return null;
                const isCat = exam?.exam_type === "cat";
                const label = exam?.blueprint_code ? exam.blueprint_code.toUpperCase() : `${(exam?.tier || "").toUpperCase()} Exam`;
                return (
                  <Card key={exam.id} className="border-none shadow-sm border-l-4 border-l-amber-400 hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-resume-${exam.id}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{label}</p>
                          {isCat && <Badge variant="secondary" className="text-[10px] bg-violet-100 text-violet-700">CAT</Badge>}
                          {!isCat && <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">{t("pages.mockExams.practice")}</Badge>}
                        </div>
                        <p className="text-xs text-gray-400">
                          Started {exam?.started_at ? new Date(exam.started_at).toLocaleDateString() : "N/A"} &middot; {exam?.time_spent ? `${Math.round(exam.time_spent / 60)} min elapsed` : "Just started"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full gap-1"
                        onClick={() => {
                          try {
                            if (isCat) {
                              localStorage.setItem(`strict-mode-${exam.id}`, "true");
                            }
                          } catch (e) {
                            console.error("[MockExams] localStorage write failed:", e);
                          }
                          navigate(`/mock-exams/${exam.id}`);
                        }}
                        data-testid={`button-resume-exam-${exam.id}`}
                      >
                        <Play className="w-3 h-3" /> Resume
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })()}

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-md overflow-hidden" data-testid="card-cat-exam">
            <div className="h-2 bg-violet-500" />
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900" data-testid="text-cat-exam-title">{t("pages.mockExams.catExam")}</h2>
                  <p className="text-sm text-gray-500">{t("pages.mockExams.adaptiveExamSimulationWith85150")}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t("pages.mockExams.selectExam")}</p>
                <div className="grid gap-2">
                  {availableBlueprints.filter(bp => bp.examType === "cat").map((bp) => (
                    <button
                      key={bp.examCode}
                      onClick={() => { setSelectedBlueprint(bp.examCode); setExamMode("official"); }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedBlueprint === bp.examCode && examMode === "official"
                          ? "border-violet-500 bg-violet-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-blueprint-${bp.examCode.toLowerCase()}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{bp.examName}</span>
                          <span className="text-xs text-gray-500 block mt-0.5">{bp.minQuestions}–{bp.maxQuestions} items &middot; {bp.timeLimit} min &middot; {bp.domains.length} domains</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] bg-violet-100 text-violet-700">CAT</Badge>
                      </div>
                    </button>
                  ))}
                  {availableBlueprints.filter(bp => bp.examType !== "cat").map((bp) => (
                    <button
                      key={bp.examCode}
                      onClick={() => { setSelectedBlueprint(bp.examCode); setExamMode("official"); }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedBlueprint === bp.examCode && examMode === "official"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-blueprint-${bp.examCode.toLowerCase()}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{bp.examName}</span>
                          <span className="text-xs text-gray-500 block mt-0.5">{bp.totalQuestions} items &middot; {bp.timeLimit} min</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">{t("pages.mockExams.scaled")}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedBlueprint && EXAM_BLUEPRINTS[selectedBlueprint] && examMode === "official" && (() => {
                const bp = EXAM_BLUEPRINTS[selectedBlueprint];
                return (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-700">{t("pages.mockExams.domainDistribution")}</p>
                    {bp.domains.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{d.name}</span>
                        <span className="font-bold text-gray-900">{Math.round(d.weight * 100)}%</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="bg-violet-50 rounded-lg p-3">
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>{t("pages.mockExams.adaptiveDifficultyAdjustsToYour")}</li>
                  <li>{t("pages.mockExams.noRationaleShownDuringExam")}</li>
                  <li>{t("pages.mockExams.answersLockOnceSelected")}</li>
                  <li>{t("pages.mockExams.reviewAvailableOnlyAfterSubmission")}</li>
                  <li>{t("pages.mockExams.tabSwitchingIsTracked")}</li>
                </ul>
              </div>

              <Button
                size="lg"
                className="w-full h-12 rounded-full gap-2 bg-violet-600 hover:bg-violet-700"
                onClick={() => {
                  setExamMode("official");
                  setShowThemeCustomizer(true);
                }}
                disabled={starting || !user || allowedTiers.length === 0 || !allowedTiers.includes(selectedTier) || !selectedBlueprint}
                data-testid="button-start-cat-exam"
              >
                {starting ? "Preparing..." : "Start CAT Exam"}
                <ArrowRight className="w-5 h-5" />
              </Button>

              {getReadinessExamForTier(selectedTier, userRegion) && (
                <button
                  onClick={async () => {
                    if (!user) { navigate("/login"); return; }
                    setStarting(true);
                    try {
                      const result = await getReadinessExamQuestions(selectedTier, userRegion);
                      const res = await fetch("/api/mock-exams/start", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
                        body: JSON.stringify({
                          tier: selectedTier,
                          totalQuestions: result.questions.length,
                          questions: result.questions,
                          examMode: "readiness",
                          blueprintCode: result.blueprint.examCode,
                          blueprintMeta: {
                            examCode: result.blueprint.examCode,
                            examName: result.blueprint.examName,
                            passingThreshold: result.blueprint.passingThreshold,
                            domainPassThreshold: result.blueprint.domainPassThreshold,
                            domains: result.blueprint.domains,
                            timeLimit: result.blueprint.timeLimit,
                            examType: result.blueprint.examType,
                          },
                          domainAssignments: result.domainAssignments,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Failed to start readiness exam");
                      if (data.attemptId) {
                        localStorage.setItem(`blueprint-${data.attemptId}`, JSON.stringify({
                          ...result.blueprint,
                          domainAssignments: result.domainAssignments,
                        }));
                        navigate(`/mock-exams/${data.attemptId}`);
                      }
                    } catch (err: any) {
                      toast({ title: "Error", description: err?.message || "Failed to start readiness exam", variant: "destructive" });
                      setStarting(false);
                    }
                  }}
                  className="w-full p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 text-left transition-all hover:border-emerald-300"
                  data-testid="button-start-readiness"
                  disabled={starting || !user}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-gray-900 text-sm">{t("pages.mockExams.freeReadinessCheck")}</span>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{t("pages.mockExams.free")}</Badge>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs text-gray-500 block mt-1 ml-6">{t("pages.mockExams.25QuestionsQuickAssessment")}</span>
                </button>
              )}
            </CardContent>
          </Card>

          {poolError && (
            <ExamListingFallback type="pool" onRetry={loadPoolData} retrying={poolRetrying} />
          )}

          <Card className="border-none shadow-md overflow-hidden" data-testid="card-practice-exam">
            <div className="h-2 bg-blue-500" />
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900" data-testid="text-practice-exam-title">{t("pages.mockExams.practiceExams")}</h2>
                  <p className="text-sm text-gray-500">{t("pages.mockExams.buildYourOwnExamWith")}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t("pages.mockExams.questionCount")}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[10, 25, 50, 75, 100, 150].map((count) => (
                    <button
                      key={count}
                      onClick={() => { setSelectedLength(count); setExamMode("practice"); setCustomLength(""); }}
                      disabled={filteredStats.total < count}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedLength === count && examMode === "practice" && !customLength
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : filteredStats.total < count
                          ? "border-gray-100 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-length-${count}`}
                    >
                      <span className="font-bold text-gray-900">{count}</span>
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max={filteredStats.total}
                      placeholder={t("pages.mockExams.custom")}
                      value={customLength}
                      onChange={(e) => {
                        setCustomLength(e.target.value);
                        const val = parseInt(e.target.value);
                        if (val > 0 && val <= filteredStats.total) {
                          setSelectedLength(val);
                          setExamMode("practice");
                        }
                      }}
                      className={`w-full p-3 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                        customLength ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      data-testid="input-custom-length"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t("pages.mockExams.topicsSystems")}</p>
                  {selectedSystems.length > 0 && (
                    <button onClick={() => setSelectedSystems([])} className="text-xs text-primary hover:underline" data-testid="button-clear-systems">{t("mockExams.clearAll")}</button>
                  )}
                </div>
                <p className="text-xs text-gray-400">{t("pages.mockExams.leaveBlankForAllTopics")}</p>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                  {availableSystems.map((sys) => {
                    const isSelected = selectedSystems.includes(sys);
                    const count = stats.systems[sys] || 0;
                    return (
                      <button
                        key={sys}
                        onClick={() => { toggleSystem(sys); setExamMode("practice"); }}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                        }`}
                        data-testid={`button-system-${sys.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {sys} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label htmlFor="strict-mode" className="font-bold text-gray-900 cursor-pointer text-sm">{t("pages.mockExams.timedStrictMode")}</Label>
                    </div>
                  </div>
                  <Switch
                    id="strict-mode"
                    checked={strictMode}
                    onCheckedChange={(checked) => { setStrictMode(checked); setExamMode("practice"); }}
                    data-testid="toggle-strict-mode"
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-12 rounded-full gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setExamMode("practice");
                  setShowThemeCustomizer(true);
                }}
                disabled={starting || !user || allowedTiers.length === 0 || !allowedTiers.includes(selectedTier)}
                data-testid="button-start-practice-exam"
              >
                {starting ? "Preparing..." : `Build Practice Exam (${customLength || selectedLength} questions)`}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-primary" /> {t("mockExams.examHistory")}
          </h2>

          {historyError ? (
            <ExamListingFallback type="history" onRetry={loadHistory} retrying={historyRetrying} />
          ) : completedExams.length === 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">{t("mockExams.noExamsYet")}</p>
                <p className="text-sm mt-1">{t("mockExams.noExamsDesc")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {completedExams.map((exam) => {
                if (!exam?.id) return null;
                const isCatExam = exam?.exam_type === "cat";
                const isReadiness = exam?.exam_type === "readiness";
                const examLabel = exam?.blueprint_code ? exam.blueprint_code.toUpperCase() : `${(exam?.tier || "").toUpperCase()} Mock`;
                const totalQ = exam?.total_questions || 1;
                const scoreVal = totalQ > 0 ? Math.round(((exam?.score || 0) / totalQ) * 100) : 0;
                return (
                  <Card key={exam.id} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-history-${exam.id}`}>
                    <CardContent className="p-4">
                      <LocaleLink href={`/mock-exams/${exam.id}/report`} className="block">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-sm">{examLabel}</p>
                            {isCatExam && <Badge variant="secondary" className="text-[10px] bg-violet-100 text-violet-700">CAT</Badge>}
                            {isReadiness && <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700">{t("pages.mockExams.readiness")}</Badge>}
                            {!isCatExam && !isReadiness && <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">{t("pages.mockExams.practice2")}</Badge>}
                          </div>
                          <span className={`text-lg font-bold ${
                            scoreVal >= 80 ? "text-emerald-600" :
                            scoreVal >= 60 ? "text-amber-600" : "text-red-500"
                          }`}>
                            {scoreVal}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {exam?.started_at ? new Date(exam.started_at).toLocaleDateString() : "N/A"} &middot; {exam?.time_spent ? `${Math.round(exam.time_spent / 60)} min` : "N/A"}
                          </p>
                          <span className="text-xs text-primary font-medium flex items-center gap-1">
                            Review Results <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </LocaleLink>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SpecialtyMockExams />
      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="mockexams-social-proof">
        <SocialProofBar />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContextualRelatedResources
          pageType="mockExams"
          currentPath="/mock-exams"
          className="border-t border-gray-200"
        />
      </div>
      <AdminEditButton pageName="mock-exams" />
      <AITutorWidget context={{ type: "mock_exam", title: "Mock Exam Prep" }} />
      <Footer />

      {showThemeCustomizer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowThemeCustomizer(false)}>
          <Card className="border-none shadow-2xl max-w-lg w-full animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-[#2E3A59]" data-testid="text-theme-customizer-title">{t("pages.mockExams.customizeYourExamInterface")}</h2>
                <p className="text-sm text-gray-500">{t("pages.mockExams.chooseAColourThemeThat")}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EXAM_THEMES.map((theme) => {
                  const isSelected = examTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setExamTheme(theme.id)}
                      data-testid={`button-exam-theme-${theme.id}`}
                      className={`relative rounded-xl border-2 p-0 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected
                          ? "border-[#2E3A59] shadow-lg ring-2 ring-[#2E3A59]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-8 w-full" style={{ backgroundColor: theme.color }} />
                      <div className="px-2 py-2.5 bg-white">
                        <span className="text-xs font-semibold text-[#2E3A59] leading-tight block">{theme.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2E3A59] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500 mb-2">{t("pages.mockExams.preview")}</p>
                <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <div className="h-8 flex items-center px-3 gap-2" style={{ backgroundColor: EXAM_THEMES.find(t => t.id === examTheme)?.color || "#8A6BFF" }}>
                    <span className="text-[10px] font-semibold text-[#2E3A59]">{t("pages.mockExams.q4Of60")}</span>
                    <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: "#2E3A59" }} />
                    </div>
                    <span className="text-[10px] font-mono text-[#2E3A59]">12:34</span>
                  </div>
                  <div className="bg-white p-2.5 space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                    <div className="flex gap-1.5 mt-2">
                      <div className="h-5 flex-1 rounded border border-gray-200" />
                      <div className="h-5 flex-1 rounded" style={{ backgroundColor: (EXAM_THEMES.find(t => t.id === examTheme)?.color || "#8A6BFF") + "20", borderLeft: `2px solid ${EXAM_THEMES.find(t => t.id === examTheme)?.color || "#8A6BFF"}` }} />
                    </div>
                  </div>
                  <div className="h-7 flex items-center justify-between px-3" style={{ backgroundColor: EXAM_THEMES.find(t => t.id === examTheme)?.color || "#8A6BFF" }}>
                    <span className="text-[9px] font-medium text-[#2E3A59]/60">{t("pages.mockExams.previous")}</span>
                    <span className="text-[9px] font-semibold text-white bg-[#2E3A59]/80 rounded px-2 py-0.5">{t("pages.mockExams.next")}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-full"
                  onClick={() => setShowThemeCustomizer(false)}
                  data-testid="button-cancel-theme"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-12 rounded-full text-base font-semibold gap-2"
                  onClick={() => {
                    const selectedTheme = EXAM_THEMES.find(t => t.id === examTheme);
                    if (selectedTheme) {
                      localStorage.setItem("examTheme", selectedTheme.id);
                      localStorage.setItem("examThemeColor", selectedTheme.color);
                    }
                    setShowThemeCustomizer(false);
                    startExam();
                  }}
                  disabled={starting}
                  data-testid="button-begin-exam"
                >
                  {starting ? "Preparing..." : "Begin Exam"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                {startError && (
                  <div className="flex flex-col items-center gap-2 mt-3">
                    <p className="text-sm text-red-600" data-testid="text-start-error">{startError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setStartError(null); startExam(); }}
                      data-testid="button-retry-exam"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
