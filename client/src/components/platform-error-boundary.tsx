import { useI18n } from "@/lib/i18n";
import { Component, type ReactNode, type ErrorInfo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ShieldCheck, MessageSquare, Loader2 } from "lucide-react";
import { generateIncidentId } from "@/lib/resilience";

interface PlatformErrorBoundaryProps {
  children: ReactNode;
  fallbackPath?: string;
}

interface PlatformErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  incidentId: string | null;
}

export class PlatformErrorBoundary extends Component<PlatformErrorBoundaryProps, PlatformErrorBoundaryState> {
  constructor(props: PlatformErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0, incidentId: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, incidentId: generateIncidentId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    console.error("[PlatformErrorBoundary] Crash:", error.message, info.componentStack);
    try {
      fetch("/api/resilience/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "platform",
          tier: "unknown",
          route: window.location.pathname,
          errorMessage: error.message,
          errorName: error.name,
          browserInfo: navigator.userAgent,
          incidentId: this.state.incidentId,
          source: "auto",
          retryCount: this.state.retryCount,
        }),
      }).catch(() => {
        fetch("/api/exam-incident-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examType: "platform",
            tier: "unknown",
            route: window.location.pathname,
            errorMessage: error.message,
            browserInfo: navigator.userAgent,
            incidentId: this.state.incidentId,
          }),
        }).catch(() => {});
      });
    } catch {}
  }

  handleRetry = () => {
    this.setState((prev) => ({ hasError: false, error: null, errorInfo: null, retryCount: prev.retryCount + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <PlatformRecoveryUI
          error={this.state.error}
          incidentId={this.state.incidentId}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          fallbackPath={this.props.fallbackPath}
        />
      );
    }
    return this.props.children;
  }
}

function PlatformRecoveryUI({
  error,
  incidentId,
  retryCount,
  onRetry,
  fallbackPath,
}: {
  error: Error | null;
  incidentId: string | null;
  retryCount: number;
  onRetry: () => void;
  fallbackPath?: string;
}) {
  const { t } = useI18n();
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = useCallback(async () => {
    setReporting(true);
    try {
      let success = false;
      try {
        const res = await fetch("/api/resilience/incident-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentType: "platform",
            tier: "unknown",
            route: window.location.pathname,
            errorMessage: error?.message || "Unknown error",
            errorName: error?.name,
            browserInfo: navigator.userAgent,
            incidentId,
            source: "user",
            retryCount,
          }),
        });
        success = res.ok;
      } catch {}
      if (!success) {
        try {
          const fallbackRes = await fetch("/api/exam-incident-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              examType: "platform_crash",
              tier: "unknown",
              route: window.location.pathname,
              errorMessage: error?.message || "Unknown error",
              browserInfo: navigator.userAgent,
              incidentId,
            }),
          });
          success = fallbackRes.ok;
        } catch {}
      }
      if (success) setReported(true);
    } finally {
      setReporting(false);
    }
  }, [error, incidentId, retryCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4" data-testid="platform-recovery-ui">
      <Card className="max-w-lg w-full border-amber-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800" data-testid="text-recovery-title">Your access is protected</h2>
            <p className="text-slate-500 text-sm">
              Something unexpected happened, but your progress and account are safe.
              {incidentId && (
                <span className="block mt-1 text-xs text-slate-400">Reference: {incidentId}</span>
              )}
            </p>
          </div>

          <div className="space-y-3">
            {retryCount < 3 && (
              <Button onClick={onRetry} className="w-full gap-2" data-testid="button-retry-platform">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.location.href = fallbackPath || "/en/dashboard"}
              className="w-full gap-2"
              data-testid="button-go-dashboard"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>

            {!reported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={reporting}
                className="w-full gap-2 text-slate-500"
                data-testid="button-report-platform-issue"
              >
                {reporting ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Sending report...</>
                ) : (
                  <><MessageSquare className="w-3 h-3" /> Report this issue</>
                )}
              </Button>
            )}
            {reported && (
              <p className="text-xs text-green-600" data-testid="text-report-sent">Report sent. Thank you for helping us improve.</p>
            )}
          </div>

          {retryCount >= 3 && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
              <p className="font-medium">Still having trouble?</p>
              <ul className="text-left text-xs space-y-1 text-slate-500">
                <li>{t("components.platform_error_boundary.tryRefreshingTheFullPage")}</li>
                <li>{t("components.platform_error_boundary.clearYourBrowserCacheAnd")}</li>
                <li>{t("components.platform_error_boundary.tryUsingADifferentBrowser")}</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PlatformErrorBoundary;
