import { Component, type ReactNode, type ErrorInfo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, ArrowLeft, MessageSquare, Loader2, ShieldCheck, Shield, BookOpen, Printer, FileText, Home } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { ProtectedAccessBoundary, type ProtectedRouteContext } from "@/components/protected-access-recovery";

import { useI18n } from "@/lib/i18n";

function generateIncidentId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `INC-${ts}-${rand}`.toUpperCase();
}

interface ExamErrorBoundaryProps {
  children: ReactNode;
  examContext?: {
    examType?: string;
    tier?: string;
    attemptId?: string;
    questionIndex?: number;
  };
  onSafeMode?: () => void;
  onStudyMode?: () => void;
  onPrintable?: () => void;
}

interface ExamErrorBoundaryState {
  initialized: boolean;
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class ExamErrorBoundary extends Component<ExamErrorBoundaryProps, ExamErrorBoundaryState> {
  constructor(props: ExamErrorBoundaryProps) {
    super(props);
    this.state = { initialized: true, hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ExamErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ExamErrorBoundary] Caught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  private getProtectedContext(): ProtectedRouteContext {
    const ctx = this.props.examContext;
    const attemptId = typeof window !== "undefined"
      ? window.location.pathname.match(/mock-exams\/([^/]+)/)?.[1] || ctx?.attemptId
      : ctx?.attemptId;

    return {
      contentCategory: "mock-exam",
      contentId: attemptId,
      examType: ctx?.examType || "mock-exam",
      tier: ctx?.tier,
      attemptId,
      questionIndex: ctx?.questionIndex,
      fallbackPath: "/mock-exams",
      label: "exam",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ExamRecoveryUI
          error={this.state.error}
          onRetry={this.handleRetry}
          retryCount={this.state.retryCount}
          examContext={this.props.examContext}
          onSafeMode={this.props.onSafeMode}
          onStudyMode={this.props.onStudyMode}
          onPrintable={this.props.onPrintable}
        />
      );
    }
    return (
      <ProtectedAccessBoundary context={this.getProtectedContext()}>
        {this.props.children}
      </ProtectedAccessBoundary>
    );
  }
}

function ExamRecoveryUI({
  error,
  onRetry,
  retryCount,
  examContext,
  onSafeMode,
  onStudyMode,
  onPrintable,
}: {
  error: Error | null;
  onRetry: () => void;
  retryCount: number;
  examContext?: { examType?: string; tier?: string; attemptId?: string; questionIndex?: number };
  onSafeMode?: () => void;
  onStudyMode?: () => void;
  onPrintable?: () => void;
}) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();
  const [reportSent, setReportSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [reportFailed, setReportFailed] = useState(false);
  const [incidentId] = useState(() => generateIncidentId());

  const attemptId = window.location.pathname.match(/mock-exams\/([^/]+)/)?.[1] || examContext?.attemptId;

  const backToExams = useCallback(() => {
    const path = window.location.pathname;
    const match = path.match(/^(\/[^/]+)\/mock-exams\//);
    navigate(match ? `${match[1]}/mock-exams` : "/mock-exams");
  }, [navigate]);

  const handleReport = useCallback(async () => {
    setSending(true);
    setReportFailed(false);
    try {
      const res = await fetch("/api/exam-incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: examContext?.examType || "unknown",
          tier: examContext?.tier || "unknown",
          route: window.location.pathname,
          errorMessage: error?.message || "Unknown error",
          browserInfo: navigator.userAgent,
          additionalContext: { retryCount, attemptId, questionIndex: examContext?.questionIndex, incidentId },
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setReportSent(true);
    } catch {
      setReportFailed(true);
    }
    setSending(false);
  }, [error, examContext, retryCount, incidentId]);

  const isSubscriber = user && user.tier !== "free";

  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    meta.dataset.errorBoundary = "true";
    if (existing) {
      existing.dataset.originalContent = existing.content;
      existing.content = "noindex, follow";
      existing.dataset.errorBoundary = "true";
    } else {
      document.head.appendChild(meta);
    }
    return () => {
      if (existing) {
        existing.content = existing.dataset.originalContent || "index, follow";
        delete existing.dataset.errorBoundary;
        delete existing.dataset.originalContent;
      } else {
        meta.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="exam-recovery-ui" data-noindex-error="true">
      <Card className="max-w-lg w-full shadow-lg border-amber-200">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-exam-error-title">
              We're having trouble loading this exam
            </h2>
            {isSubscriber && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium" data-testid="text-access-protected">Your access is protected.</span>
              </div>
            )}
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your progress and subscription are safe. Choose an option below to continue studying.
            </p>
          </div>

          <div className="space-y-2">
            {retryCount < 3 && (
              <Button
                onClick={onRetry}
                variant="default"
                className="w-full gap-2"
                data-testid="button-exam-retry"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Loading Exam
              </Button>
            )}

            <Button
              onClick={onSafeMode || (() => {
                const currentPath = window.location.pathname;
                navigate(`${currentPath}?fallback=safe`);
                window.location.reload();
              })}
              variant="outline"
              className="w-full gap-2"
              data-testid="button-safe-exam-player"
            >
              <Shield className="w-4 h-4" />
              Safe Exam Player
            </Button>

            <Button
              onClick={onStudyMode || (() => {
                const currentPath = window.location.pathname;
                navigate(`${currentPath}?fallback=study`);
                window.location.reload();
              })}
              variant="outline"
              className="w-full gap-2"
              data-testid="button-study-mode"
            >
              <BookOpen className="w-4 h-4" />
              Study Mode
            </Button>

            {isSubscriber && (
              <Button
                onClick={onPrintable || (() => {
                  const currentPath = window.location.pathname;
                  navigate(`${currentPath}?fallback=printable`);
                  window.location.reload();
                })}
                variant="outline"
                className="w-full gap-2"
                data-testid="button-printable-backup"
              >
                <Printer className="w-4 h-4" />
                Printable Backup
              </Button>
            )}

            {isSubscriber && (
              <Button
                onClick={() => {
                  const currentPath = window.location.pathname;
                  navigate(`${currentPath}?fallback=backup-practice`);
                  window.location.reload();
                }}
                variant="outline"
                className="w-full gap-2"
                data-testid="button-backup-practice-set"
              >
                <FileText className="w-4 h-4" />
                Backup Practice Set
              </Button>
            )}

            <Button
              variant="outline"
              onClick={backToExams}
              className="w-full gap-2"
              data-testid="button-exam-go-back"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Button>
          </div>

          <div className="text-center space-y-2">
            {reportSent ? (
              <p className="text-sm text-green-600 flex items-center justify-center gap-1" data-testid="text-report-sent">
                <ShieldCheck className="w-4 h-4" />
                Report received. Thank you.
              </p>
            ) : (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  disabled={sending}
                  className="gap-2 text-muted-foreground"
                  data-testid="button-exam-report"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {reportFailed ? "Try reporting again" : "Report this issue"}
                </Button>
                {reportFailed && (
                  <p className="text-xs text-red-500">{t("components.examErrorBoundary.couldNotSendReportPlease")}</p>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground" data-testid="text-incident-id">
              Incident ID: {incidentId}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExamLoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="exam-loading-skeleton">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ExamEmptyState({
  tier,
  message,
  suggestion,
}: {
  tier?: string;
  message?: string;
  suggestion?: string;
}) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4" data-testid="exam-empty-state">
      <Card className="max-w-md w-full shadow-md">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold" data-testid="text-empty-state-title">
            {message || "No questions available right now"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {suggestion || "Try selecting different filters or come back soon. We are continuously adding new content."}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/test-bank")}
              data-testid="button-empty-go-testbank"
            >
              Back to Question Bank
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => window.location.reload()}
              data-testid="button-empty-refresh"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface QuestionErrorBoundaryProps {
  children: ReactNode;
  questionId: string;
  questionIndex: number;
  onSkip?: (questionId: string) => void;
  fallback?: ReactNode;
}

interface QuestionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class QuestionErrorBoundary extends Component<QuestionErrorBoundaryProps, QuestionErrorBoundaryState> {
  private autoSkipTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: QuestionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): QuestionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[QuestionErrorBoundary] Question ${this.props.questionId} (index ${this.props.questionIndex}) crashed:`, error.message);

    try {
      fetch("/api/telemetry/unsupported-question-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: [{
            type: "render_crash",
            questionId: this.props.questionId,
            error: error.message,
          }],
        }),
      }).catch(() => {});
    } catch {}

    if (this.props.onSkip) {
      this.autoSkipTimer = setTimeout(() => {
        this.props.onSkip?.(this.props.questionId);
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.autoSkipTimer) clearTimeout(this.autoSkipTimer);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center space-y-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="text-sm font-medium text-gray-800" data-testid={`text-question-error-${this.props.questionIndex}`}>
              This question could not be displayed
            </p>
            <p className="text-xs text-gray-600">
              Question {this.props.questionIndex + 1} encountered an issue. You can skip it and continue your exam.
            </p>
            {this.props.onSkip && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (this.autoSkipTimer) clearTimeout(this.autoSkipTimer);
                    this.props.onSkip?.(this.props.questionId);
                  }}
                  className="gap-1"
                  data-testid={`button-skip-question-${this.props.questionIndex}`}
                >
                  Skip and Continue
                </Button>
                <p className="text-xs text-gray-400">This question will be auto-skipped in a few seconds</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function ExamReportButton({
  examType,
  tier,
  questionId,
}: {
  examType?: string;
  tier?: string;
  questionId?: string;
}) {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleReport = async () => {
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/resilience/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "exam",
          tier: tier || "unknown",
          route: window.location.pathname,
          errorMessage: `User reported problem with question ${questionId || "N/A"}`,
          browserInfo: navigator.userAgent,
          source: "user",
          additionalContext: { questionId, examType },
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      try {
        const res = await fetch("/api/exam-incident-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examType: examType || "unknown",
            tier: tier || "unknown",
            route: window.location.pathname,
            errorMessage: `User reported problem with question ${questionId || "N/A"}`,
            browserInfo: navigator.userAgent,
            additionalContext: { questionId },
          }),
        });
        if (!res.ok) throw new Error("Failed");
        setSent(true);
      } catch {
        setFailed(true);
      }
    }
    setSending(false);
  };

  if (sent) {
    return (
      <span className="text-xs text-green-600 flex items-center gap-1" data-testid="text-exam-report-sent">
        <ShieldCheck className="w-3 h-3" /> Reported
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReport}
        disabled={sending}
        className="text-xs text-muted-foreground gap-1 h-auto py-1 px-2"
        data-testid="button-report-exam-problem"
      >
        {sending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <MessageSquare className="w-3 h-3" />
        )}
        {failed ? "Try again" : "Report a problem"}
      </Button>
      {failed && (
        <p className="text-xs text-red-500 mt-0.5">{t("components.examErrorBoundary.couldNotSendReport")}</p>
      )}
    </div>
  );
}
