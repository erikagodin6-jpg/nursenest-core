import { Component, type ReactNode, type ErrorInfo, useState, useCallback, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw, ArrowLeft, Loader2,
  ShieldCheck, Home, Download, Eye, Bug, FileText, ExternalLink
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { generateIncidentId } from "@/lib/resilience";

export type ContentCategory =
  | "exam"
  | "cat"
  | "flashcard"
  | "lesson"
  | "download"
  | "analytics"
  | "premium-tool"
  | "study-guide"
  | "question-bank"
  | "mock-exam"
  | "platform";

export interface RecoveryCapabilities {
  hasSafeMode?: boolean;
  hasBackupVersion?: boolean;
  backupVersionPath?: string;
  hasDownloadBackup?: boolean;
  downloadBackupUrl?: string;
  hasEquivalentResource?: boolean;
  equivalentResourcePath?: string;
  equivalentResourceLabel?: string;
}

export interface ProtectedRouteContext {
  contentCategory: ContentCategory;
  contentId?: string;
  productId?: string;
  tier?: string;
  examType?: string;
  attemptId?: string;
  questionIndex?: number;
  fallbackPath?: string;
  label?: string;
  capabilities?: RecoveryCapabilities;
}

interface RecoveryAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant: "default" | "outline" | "ghost";
  testId: string;
}

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  exam: "exam",
  cat: "adaptive exam",
  flashcard: "flashcards",
  lesson: "lesson",
  download: "download",
  analytics: "analytics",
  "premium-tool": "tool",
  "study-guide": "study guide",
  "question-bank": "question bank",
  "mock-exam": "mock exam",
  platform: "content",
};

const CATEGORIES_WITH_SAFE_MODE: ContentCategory[] = ["exam", "mock-exam", "cat"];
const CATEGORIES_WITH_DOWNLOAD: ContentCategory[] = ["download", "study-guide", "lesson", "flashcard"];

async function attemptLegacyReport(
  incidentId: string,
  error: Error | null,
  context: ProtectedRouteContext,
  retryCount: number,
  source: "auto" | "user"
): Promise<boolean> {
  try {
    const res = await fetch("/api/exam-incident-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examType: context.contentCategory,
        tier: context.tier || "unknown",
        route: window.location.pathname,
        errorMessage: error?.message || "Unknown error",
        browserInfo: navigator.userAgent,
        additionalContext: { incidentId, source, retryCount },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function reportIncident(
  incidentId: string,
  error: Error | null,
  context: ProtectedRouteContext,
  retryCount: number,
  source: "auto" | "user"
): Promise<boolean> {
  try {
    const res = await fetch("/api/resilience/incident-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incidentId,
        contentType: context.contentCategory,
        productId: context.productId || context.contentId,
        tier: context.tier || "unknown",
        route: window.location.pathname,
        errorMessage: error?.message || "Unknown error",
        errorName: error?.name,
        browserInfo: navigator.userAgent,
        source,
        retryCount,
        additionalContext: {
          attemptId: context.attemptId,
          examType: context.examType,
          questionIndex: context.questionIndex,
          online: navigator.onLine,
          screenWidth: window.innerWidth,
        },
      }),
    });
    if (res.ok) return true;
    return attemptLegacyReport(incidentId, error, context, retryCount, source);
  } catch {
    return attemptLegacyReport(incidentId, error, context, retryCount, source);
  }
}

export class ContentDeliveryError extends Error {
  public context: ProtectedRouteContext;
  constructor(message: string, context: ProtectedRouteContext) {
    super(message);
    this.name = "ContentDeliveryError";
    this.context = context;
  }
}

export function createFetchErrorBridge(context: ProtectedRouteContext) {
  return function handleFetchError(error: unknown): never {
    const msg = error instanceof Error ? error.message : String(error);
    throw new ContentDeliveryError(msg, context);
  };
}

type RecoveryTriggerFn = (error: Error) => void;
const RecoveryTriggerContext = createContext<RecoveryTriggerFn | null>(null);

export function useRecoveryTrigger(): RecoveryTriggerFn | null {
  return useContext(RecoveryTriggerContext);
}

interface ProtectedAccessRecoveryProps {
  error: Error | null;
  incidentId: string | null;
  retryCount: number;
  onRetry: () => void;
  context: ProtectedRouteContext;
}

export function ProtectedAccessRecovery({
  error,
  incidentId,
  retryCount,
  onRetry,
  context,
}: ProtectedAccessRecoveryProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [reportSent, setReportSent] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportFailed, setReportFailed] = useState(false);

  const categoryLabel = context.label || CATEGORY_LABELS[context.contentCategory] || "content";
  const fallbackPath = context.fallbackPath || "/dashboard";
  const caps = context.capabilities || {};

  const handleReport = useCallback(async () => {
    setReporting(true);
    setReportFailed(false);
    const ok = await reportIncident(
      incidentId || generateIncidentId(),
      error,
      context,
      retryCount,
      "user"
    );
    if (ok) {
      setReportSent(true);
    } else {
      setReportFailed(true);
    }
    setReporting(false);
  }, [error, context, incidentId, retryCount]);

  const handleSafeMode = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("safe_mode", "1");
    window.location.href = url.toString();
  }, []);

  const actions: RecoveryAction[] = [];

  if (retryCount < 3) {
    actions.push({
      id: "retry",
      label: "Try Again",
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: onRetry,
      variant: "default",
      testId: "button-recovery-retry",
    });
  }

  const showSafeMode = caps.hasSafeMode !== false && CATEGORIES_WITH_SAFE_MODE.includes(context.contentCategory);
  if (showSafeMode) {
    actions.push({
      id: "safe-mode",
      label: "Open Safe Mode",
      icon: <Eye className="w-4 h-4" />,
      onClick: handleSafeMode,
      variant: "outline",
      testId: "button-recovery-safe-mode",
    });
  }

  if (caps.hasBackupVersion && caps.backupVersionPath) {
    actions.push({
      id: "backup-version",
      label: "Open Backup Version",
      icon: <FileText className="w-4 h-4" />,
      onClick: () => navigate(caps.backupVersionPath!),
      variant: "outline",
      testId: "button-recovery-backup-version",
    });
  }

  if (caps.hasDownloadBackup && caps.downloadBackupUrl) {
    actions.push({
      id: "download-backup",
      label: "Download Backup",
      icon: <Download className="w-4 h-4" />,
      onClick: () => { window.location.href = caps.downloadBackupUrl!; },
      variant: "outline",
      testId: "button-recovery-download-backup",
    });
  } else if (CATEGORIES_WITH_DOWNLOAD.includes(context.contentCategory) && context.contentId) {
    actions.push({
      id: "download-backup",
      label: "Download Backup",
      icon: <Download className="w-4 h-4" />,
      onClick: () => { window.location.href = `/api/content/download/${context.contentCategory}/${context.contentId}`; },
      variant: "outline",
      testId: "button-recovery-download-backup",
    });
  }

  if (caps.hasEquivalentResource && caps.equivalentResourcePath) {
    actions.push({
      id: "equivalent-resource",
      label: caps.equivalentResourceLabel || "Open Equivalent Resource",
      icon: <ExternalLink className="w-4 h-4" />,
      onClick: () => navigate(caps.equivalentResourcePath!),
      variant: "outline",
      testId: "button-recovery-equivalent-resource",
    });
  }

  const fallbackLabel = fallbackPath === "/dashboard" || fallbackPath === "/"
    ? "Return to Dashboard"
    : fallbackPath.includes("test-bank")
    ? "Return to Test Bank"
    : `Return to ${categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)}`;
  actions.push({
    id: "dashboard",
    label: fallbackLabel,
    icon: <Home className="w-4 h-4" />,
    onClick: () => navigate(fallbackPath),
    variant: "outline",
    testId: "button-recovery-dashboard",
  });

  if (context.contentCategory === "exam" || context.contentCategory === "mock-exam" || context.contentCategory === "cat") {
    if (context.attemptId) {
      actions.push({
        id: "resume-safe",
        label: "Resume from Last Question",
        icon: <FileText className="w-4 h-4" />,
        onClick: () => {
          const url = new URL(window.location.href);
          url.searchParams.set("resume", "last");
          window.location.href = url.toString();
        },
        variant: "outline",
        testId: "button-recovery-resume-safe",
      });

      actions.push({
        id: "reduced-load",
        label: "One Question at a Time",
        icon: <Eye className="w-4 h-4" />,
        onClick: () => {
          const url = new URL(window.location.href);
          url.searchParams.set("reduced_load", "1");
          window.location.href = url.toString();
        },
        variant: "outline",
        testId: "button-recovery-reduced-load",
      });
    }

    const backPath = context.fallbackPath || "/mock-exams";
    actions.push({
      id: "back",
      label: "Back to Exams",
      icon: <ArrowLeft className="w-4 h-4" />,
      onClick: () => {
        const path = window.location.pathname;
        const match = path.match(/^(\/[^/]+)\/mock-exams\//);
        navigate(match ? `${match[1]}/mock-exams` : backPath);
      },
      variant: "outline",
      testId: "button-recovery-back",
    });
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4"
      data-testid="protected-recovery-ui"
    >
      <Card className="max-w-lg w-full shadow-lg border-amber-200">
        <CardContent className="p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h2
              className="text-lg sm:text-xl font-semibold text-slate-800"
              data-testid="text-recovery-title"
            >
              We're having trouble loading this right now
            </h2>
            <p
              className="text-slate-500 text-sm leading-relaxed"
              data-testid="text-recovery-access-protected"
            >
              Your access is protected. We encountered an issue loading your {categoryLabel},
              but your subscription, progress, and account are safe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
            {actions.map((action) => (
              <Button
                key={action.id}
                onClick={action.onClick}
                variant={action.variant}
                className="gap-2"
                data-testid={action.testId}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>

          {reportSent ? (
            <p
              className="text-sm text-green-600 flex items-center justify-center gap-1"
              data-testid="text-recovery-report-sent"
            >
              <ShieldCheck className="w-4 h-4" />
              Report received. Thank you for helping us improve.
            </p>
          ) : (
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={reporting}
                className="gap-2 text-muted-foreground"
                data-testid="button-recovery-report"
              >
                {reporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bug className="w-4 h-4" />
                )}
                {reportFailed ? "Try reporting again" : "Report this issue"}
              </Button>
              {reportFailed && (
                <p className="text-xs text-red-500" data-testid="text-recovery-report-failed">
                  Could not send report. Please try again later.
                </p>
              )}
            </div>
          )}

          {incidentId && (
            <p
              className="text-xs text-slate-400"
              data-testid="text-recovery-incident-id"
            >
              Reference: {incidentId}
            </p>
          )}

          {user && (
            <p className="text-xs text-muted-foreground" data-testid="text-recovery-account-safe">
              Your account and progress are not affected.
            </p>
          )}

          {retryCount >= 3 && (
            <div
              className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2"
              data-testid="container-recovery-tips"
            >
              <p className="font-medium">Still having trouble?</p>
              <ul className="text-left text-xs space-y-1 text-slate-500">
                <li>• Try refreshing the full page</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Try using a different browser</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ProtectedAccessBoundaryProps {
  children: ReactNode;
  context: ProtectedRouteContext;
}

interface ProtectedAccessBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  incidentId: string | null;
}

export class ProtectedAccessBoundary extends Component<ProtectedAccessBoundaryProps, ProtectedAccessBoundaryState> {
  constructor(props: ProtectedAccessBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0, incidentId: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, incidentId: generateIncidentId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ProtectedAccessBoundary] Caught:", {
      message: error.message,
      contentCategory: this.props.context.contentCategory,
      route: window.location.pathname,
      stack: error.stack?.substring(0, 500),
    });

    reportIncident(
      this.state.incidentId || generateIncidentId(),
      error,
      this.props.context,
      this.state.retryCount,
      "auto"
    ).catch(() => {});
  }

  triggerRecovery = (error: Error) => {
    const incidentId = generateIncidentId();
    this.setState({ hasError: true, error, incidentId });

    reportIncident(
      incidentId,
      error,
      this.props.context,
      this.state.retryCount,
      "auto"
    ).catch(() => {});
  };

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
      incidentId: null,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <ProtectedAccessRecovery
          error={this.state.error}
          incidentId={this.state.incidentId}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          context={this.props.context}
        />
      );
    }
    return (
      <RecoveryTriggerContext.Provider value={this.triggerRecovery}>
        {this.props.children}
      </RecoveryTriggerContext.Provider>
    );
  }
}

export function useProtectedFetch(label?: string) {
  const trigger = useRecoveryTrigger();

  return useCallback(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      const res = await fetch(input, init);
      if (!res.ok && res.status >= 500) {
        const errorMsg = `Server error ${res.status} loading ${label || "content"}`;
        const err = new Error(errorMsg);
        err.name = "FetchDeliveryError";
        if (trigger) {
          trigger(err);
          return res;
        }
      }
      return res;
    } catch (networkError) {
      const err = networkError instanceof Error
        ? networkError
        : new Error(String(networkError));
      err.name = "NetworkDeliveryError";
      if (trigger) {
        trigger(err);
      }
      throw err;
    }
  }, [trigger, label]);
}

export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  context: ProtectedRouteContext
) {
  function ProtectedRouteWrapper(props: P) {
    return (
      <ProtectedAccessBoundary context={context}>
        <WrappedComponent {...props} />
      </ProtectedAccessBoundary>
    );
  }
  ProtectedRouteWrapper.displayName = `withProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return ProtectedRouteWrapper;
}
