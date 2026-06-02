import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface PremiumFeatureErrorBoundaryProps {
  children: ReactNode;
  featureName: string;
  fallbackPath?: string;
}

interface PremiumFeatureErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class PremiumFeatureErrorBoundary extends Component<PremiumFeatureErrorBoundaryProps, PremiumFeatureErrorBoundaryState> {
  constructor(props: PremiumFeatureErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<PremiumFeatureErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[PremiumFeatureErrorBoundary] ${this.props.featureName} crashed:`, error.message, errorInfo.componentStack);
    try {
      fetch("/api/resilience/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: this.props.featureName,
          route: window.location.pathname,
          errorMessage: error.message,
          browserInfo: navigator.userAgent,
          source: "auto",
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState((prev) => ({ hasError: false, error: null, retryCount: prev.retryCount + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <PremiumRecoveryUI
          featureName={this.props.featureName}
          error={this.state.error}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          fallbackPath={this.props.fallbackPath}
        />
      );
    }
    return this.props.children;
  }
}

function PremiumRecoveryUI({
  featureName,
  error,
  retryCount,
  onRetry,
  fallbackPath,
}: {
  featureName: string;
  error: Error | null;
  retryCount: number;
  onRetry: () => void;
  fallbackPath?: string;
}) {
  const { user } = useAuth();
  const isSubscriber = user && user.tier !== "free";

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4" data-testid={`premium-error-${featureName}`}>
      <Card className="max-w-lg w-full shadow-lg border-amber-200">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-premium-error-title">
              Simplified study mode
            </h2>
            {isSubscriber && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-medium" data-testid="text-premium-access-active">Your access is active</span>
              </div>
            )}
            <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-premium-error-message">
              We're experiencing temporary issues loading {featureName}. Your progress and subscription are safe.
            </p>
          </div>

          <div className="space-y-2">
            {retryCount < 3 && (
              <Button onClick={onRetry} variant="default" className="w-full gap-2" data-testid="button-premium-retry">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.location.href = fallbackPath || "/en/dashboard"}
              className="w-full gap-2"
              data-testid="button-premium-dashboard"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </div>

          {retryCount >= 3 && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 space-y-2">
              <p className="font-medium">Still having trouble?</p>
              <ul className="text-left text-xs space-y-1 text-slate-500">
                <li>Try refreshing the full page</li>
                <li>Clear your browser cache and try again</li>
                <li>Try using a different browser</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function DegradedModeBanner({ reason }: { reason?: string }) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center" data-testid="banner-degraded-mode">
      <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
        <ShieldCheck className="w-4 h-4" />
        <span className="font-medium">Simplified study mode — your access is active</span>
      </div>
      {reason && (
        <p className="text-xs text-amber-600 mt-0.5">{reason}</p>
      )}
    </div>
  );
}

export default PremiumFeatureErrorBoundary;
