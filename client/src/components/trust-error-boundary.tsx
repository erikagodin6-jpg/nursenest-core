import { Component, type ReactNode, type ErrorInfo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield, RefreshCw, ArrowLeft, MessageSquare, Loader2,
  Home, BookOpen, Copy, CheckCircle2
} from "lucide-react";
import { useLocation } from "wouter";

interface TrustErrorBoundaryProps {
  children: ReactNode;
  context?: {
    feature?: string;
    route?: string;
  };
}

interface TrustErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  incidentId: string | null;
  retryCount: number;
}

function generateLocalIncidentId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `INC-${ts}-${rand}`.toUpperCase();
}

export class TrustErrorBoundary extends Component<TrustErrorBoundaryProps, TrustErrorBoundaryState> {
  constructor(props: TrustErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, incidentId: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, incidentId: generateLocalIncidentId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const incidentId = this.state.incidentId || generateLocalIncidentId();
    console.error("[TrustErrorBoundary] Caught:", {
      message: error.message,
      incidentId,
      route: window.location.pathname,
      feature: this.props.context?.feature,
      stack: error.stack?.substring(0, 500),
    });

    try {
      fetch("/api/platform-incident/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "client_error",
          severity: "critical",
          route: window.location.pathname,
          message: error.message,
          metadata: {
            incidentId,
            feature: this.props.context?.feature,
            componentStack: info.componentStack?.substring(0, 500),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      incidentId: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <TrustRecoveryUI
          error={this.state.error}
          incidentId={this.state.incidentId}
          onRetry={this.handleRetry}
          retryCount={this.state.retryCount}
          context={this.props.context}
        />
      );
    }
    return this.props.children;
  }
}

function TrustRecoveryUI({
  error,
  incidentId,
  onRetry,
  retryCount,
  context,
}: {
  error: Error | null;
  incidentId: string | null;
  onRetry: () => void;
  retryCount: number;
  context?: { feature?: string; route?: string };
}) {
  const [, navigate] = useLocation();
  const [reportSent, setReportSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReport = useCallback(async () => {
    setSending(true);
    try {
      const res = await fetch("/api/platform-incident/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "user_report",
          severity: "warning",
          route: window.location.pathname,
          message: `User reported issue: ${error?.message || "Unknown error"}`,
          metadata: {
            incidentId,
            feature: context?.feature,
            retryCount,
            userAgent: navigator.userAgent,
          },
        }),
      });
      if (res.ok) setReportSent(true);
    } catch {}
    setSending(false);
  }, [error, incidentId, context, retryCount]);

  const handleCopyIncidentId = useCallback(() => {
    if (incidentId) {
      navigator.clipboard.writeText(incidentId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }, [incidentId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="trust-error-boundary-ui">
      <Card className="max-w-lg w-full shadow-lg border-blue-200">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-trust-error-title">
              We're having trouble loading this feature
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-trust-error-message">
              Your access is protected. Your account, subscription, and all progress are safe.
              This is a temporary issue on our end.
            </p>
          </div>

          {incidentId && (
            <div className="bg-slate-50 rounded-lg px-4 py-3 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Incident ID:</span>
              <code className="text-xs font-mono font-semibold text-slate-700" data-testid="text-incident-id">{incidentId}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopyIncidentId}
                data-testid="button-copy-incident-id"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {retryCount < 3 && (
              <Button
                onClick={onRetry}
                variant="default"
                className="gap-2"
                data-testid="button-trust-retry"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
              data-testid="button-trust-dashboard"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/flashcards")}
              className="gap-2"
              data-testid="button-trust-study-mode"
            >
              <BookOpen className="w-4 h-4" />
              Study Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
              data-testid="button-trust-go-back"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          <div className="pt-2">
            {reportSent ? (
              <p className="text-sm text-green-600 flex items-center justify-center gap-1" data-testid="text-trust-report-sent">
                <CheckCircle2 className="w-4 h-4" />
                Report received. Thank you.
              </p>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={sending}
                className="gap-2 text-muted-foreground"
                data-testid="button-trust-report"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                Report Issue
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Your account and all progress are fully protected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
