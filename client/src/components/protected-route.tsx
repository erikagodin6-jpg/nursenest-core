import { Component, type ReactNode, type ErrorInfo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, MessageSquare, Loader2, ShieldCheck, Shield } from "lucide-react";
import { generateIncidentId } from "@/lib/resilience";
import { useKillSwitches } from "@/hooks/use-kill-switches";
import { KillSwitchMessage } from "@/components/safe-mode-fallbacks";

export type ContentType = "exam" | "flashcard" | "lesson" | "download" | "general";

interface ProtectedRouteProps {
  children: ReactNode;
  contentType?: ContentType;
  killSwitchKey?: string;
  safeModeRenderer?: () => ReactNode;
  fallbackPath?: string;
}

interface ProtectedRouteState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  incidentId: string | null;
  safeMode: boolean;
}

export class ProtectedRoute extends Component<ProtectedRouteProps, ProtectedRouteState> {
  constructor(props: ProtectedRouteProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      incidentId: null,
      safeMode: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, incidentId: generateIncidentId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    const route = typeof window !== "undefined" ? window.location.pathname : "unknown";
    console.error(
      `[ProtectedRoute] Crash on route="${route}" contentType="${this.props.contentType || "general"}"`,
      "\n  Error:", error.message,
      "\n  Stack:", error.stack?.substring(0, 500),
    );
    try {
      fetch("/api/exam-incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: `protected_route_${this.props.contentType || "general"}`,
          tier: "unknown",
          route,
          errorMessage: error.message,
          browserInfo: navigator.userAgent,
          incidentId: this.state.incidentId,
          additionalContext: {
            contentType: this.props.contentType,
            componentStack: info.componentStack?.substring(0, 300),
          },
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      safeMode: false,
      retryCount: prev.retryCount + 1,
    }));
  };

  handleSafeMode = () => {
    this.setState({ safeMode: true });
  };

  render() {
    if (this.state.hasError) {
      if (this.state.safeMode && this.props.safeModeRenderer) {
        return this.props.safeModeRenderer();
      }

      return (
        <ProtectedRouteRecoveryUI
          error={this.state.error}
          incidentId={this.state.incidentId}
          retryCount={this.state.retryCount}
          contentType={this.props.contentType || "general"}
          onRetry={this.handleRetry}
          onSafeMode={this.props.safeModeRenderer ? this.handleSafeMode : undefined}
          fallbackPath={this.props.fallbackPath}
        />
      );
    }
    return (
      <KillSwitchGate killSwitchKey={this.props.killSwitchKey}>
        {this.props.children}
      </KillSwitchGate>
    );
  }
}

function KillSwitchGate({ killSwitchKey, children }: { killSwitchKey?: string; children: ReactNode }) {
  const { isFeatureKilled } = useKillSwitches();

  if (killSwitchKey && isFeatureKilled(killSwitchKey)) {
    return <KillSwitchMessage feature={killSwitchKey} />;
  }

  return <>{children}</>;
}

function ProtectedRouteRecoveryUI({
  error,
  incidentId,
  retryCount,
  contentType,
  onRetry,
  onSafeMode,
  fallbackPath,
}: {
  error: Error | null;
  incidentId: string | null;
  retryCount: number;
  contentType: ContentType;
  onRetry: () => void;
  onSafeMode?: () => void;
  fallbackPath?: string;
}) {
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportFailed, setReportFailed] = useState(false);

  const handleReport = useCallback(async () => {
    setReporting(true);
    setReportFailed(false);
    try {
      const res = await fetch("/api/exam-incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: `user_report_${contentType}`,
          tier: "unknown",
          route: window.location.pathname,
          errorMessage: error?.message || "Unknown error",
          browserInfo: navigator.userAgent,
          incidentId,
          additionalContext: { retryCount, userReported: true },
        }),
      });
      if (res.ok) setReported(true);
      else setReportFailed(true);
    } catch {
      setReportFailed(true);
    } finally {
      setReporting(false);
    }
  }, [error, incidentId, retryCount, contentType]);

  const contentLabels: Record<ContentType, string> = {
    exam: "this exam",
    flashcard: "flashcards",
    lesson: "this lesson",
    download: "downloads",
    general: "this page",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4" data-testid="protected-route-recovery">
      <Card className="max-w-lg w-full border-amber-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800" data-testid="text-protected-recovery-title">
              We're having trouble loading {contentLabels[contentType]} right now
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your access is protected. Your progress, account, and subscription are safe.
              {incidentId && (
                <span className="block mt-1 text-xs text-slate-400">Reference: {incidentId}</span>
              )}
            </p>
          </div>

          <div className="space-y-3">
            {retryCount < 3 && (
              <Button onClick={onRetry} className="w-full gap-2" data-testid="button-protected-retry">
                <RefreshCw className="w-4 h-4" />
                Retry ({3 - retryCount} attempts remaining)
              </Button>
            )}

            {onSafeMode && (
              <Button
                variant="secondary"
                onClick={onSafeMode}
                className="w-full gap-2"
                data-testid="button-open-safe-mode"
              >
                <Shield className="w-4 h-4" />
                Open Safe Mode
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.location.href = fallbackPath || "/en/dashboard"}
              className="w-full gap-2"
              data-testid="button-return-dashboard"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Button>

            {!reported ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={reporting}
                className="w-full gap-2 text-slate-500"
                data-testid="button-report-issue"
              >
                {reporting ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Sending report...</>
                ) : (
                  <><MessageSquare className="w-3 h-3" /> {reportFailed ? "Try reporting again" : "Report Issue"}</>
                )}
              </Button>
            ) : (
              <p className="text-xs text-green-600 flex items-center justify-center gap-1" data-testid="text-report-confirmed">
                <ShieldCheck className="w-3 h-3" />
                Report received. Thank you for helping us improve.
              </p>
            )}
          </div>

          {retryCount >= 3 && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
              <p className="font-medium">Still having trouble?</p>
              <ul className="text-left text-xs space-y-1 text-slate-500">
                <li>Try refreshing the full page (Ctrl+Shift+R)</li>
                <li>Clear your browser cache and try again</li>
                <li>Try using a different browser or device</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProtectedRoute;
