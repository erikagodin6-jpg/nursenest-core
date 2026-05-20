import { Component, type ReactNode, type ErrorInfo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw, Home, Loader2, AlertTriangle, BookOpen, Layers, WifiOff
} from "lucide-react";
import { generateIncidentId } from "@/lib/resilience";
import { EMERGENCY_NURSING_CARDS, EMERGENCY_NURSING_DECK } from "@/lib/flashcard-cache";
import type { DegradedMode } from "@/lib/flashcard-cache";

interface FlashcardErrorBoundaryProps {
  children: ReactNode;
  section?: "deck-list" | "card-viewer" | "progress" | "page";
  onStudyEmergencyDeck?: () => void;
  onTryCachedData?: () => void;
  fallbackPath?: string;
}

interface FlashcardErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  incidentId: string | null;
}

export class FlashcardErrorBoundary extends Component<FlashcardErrorBoundaryProps, FlashcardErrorBoundaryState> {
  constructor(props: FlashcardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0, incidentId: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, incidentId: generateIncidentId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const section = this.props.section || "page";
    console.error(`[FlashcardErrorBoundary:${section}] Error:`, {
      message: error.message,
      name: error.name,
      section,
      route: window.location.pathname,
      incidentId: this.state.incidentId,
      stack: error.stack?.substring(0, 500),
    });

    try {
      fetch("/api/resilience/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: this.state.incidentId,
          contentType: "flashcard",
          tier: "unknown",
          route: window.location.pathname,
          errorMessage: error.message,
          errorName: error.name,
          browserInfo: navigator.userAgent,
          source: "auto",
          retryCount: this.state.retryCount,
          additionalContext: {
            section,
            componentStack: info.componentStack?.substring(0, 300),
            online: navigator.onLine,
          },
        }),
      }).catch(() => {});
    } catch {}
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const section = this.props.section || "page";

      if (section !== "page") {
        return (
          <SectionErrorFallback
            section={section}
            error={this.state.error}
            incidentId={this.state.incidentId}
            retryCount={this.state.retryCount}
            onRetry={this.handleRetry}
            onStudyEmergencyDeck={this.props.onStudyEmergencyDeck}
            onTryCachedData={this.props.onTryCachedData}
          />
        );
      }

      return (
        <FlashcardRecoveryUI
          error={this.state.error}
          incidentId={this.state.incidentId}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onStudyEmergencyDeck={this.props.onStudyEmergencyDeck}
          onTryCachedData={this.props.onTryCachedData}
          fallbackPath={this.props.fallbackPath}
        />
      );
    }
    return this.props.children;
  }
}

function SectionErrorFallback({
  section,
  error,
  incidentId,
  retryCount,
  onRetry,
  onStudyEmergencyDeck,
  onTryCachedData,
}: {
  section: string;
  error: Error | null;
  incidentId: string | null;
  retryCount: number;
  onRetry: () => void;
  onStudyEmergencyDeck?: () => void;
  onTryCachedData?: () => void;
}) {
  const sectionLabels: Record<string, string> = {
    "deck-list": "Deck list",
    "card-viewer": "Card viewer",
    "progress": "Progress tracking",
  };

  const label = sectionLabels[section] || section;

  return (
    <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 space-y-3" data-testid={`section-error-${section}`}>
      <div className="flex items-center gap-2 text-amber-700">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">{label} temporarily unavailable</span>
      </div>
      <p className="text-xs text-amber-600">
        This section encountered an issue but the rest of the page should still work.
        {incidentId && <span className="block mt-1 text-amber-500">Ref: {incidentId}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {retryCount < 3 && (
          <Button size="sm" variant="outline" onClick={onRetry} className="gap-1 text-xs" data-testid={`button-retry-${section}`}>
            <RefreshCw className="w-3 h-3" /> Retry
          </Button>
        )}
        {onTryCachedData && (
          <Button size="sm" variant="outline" onClick={onTryCachedData} className="gap-1 text-xs" data-testid={`button-cached-${section}`}>
            <Layers className="w-3 h-3" /> Use cached data
          </Button>
        )}
        {onStudyEmergencyDeck && (
          <Button size="sm" variant="outline" onClick={onStudyEmergencyDeck} className="gap-1 text-xs" data-testid={`button-emergency-${section}`}>
            <BookOpen className="w-3 h-3" /> Study basics
          </Button>
        )}
      </div>
    </div>
  );
}

function FlashcardRecoveryUI({
  error,
  incidentId,
  retryCount,
  onRetry,
  onStudyEmergencyDeck,
  onTryCachedData,
  fallbackPath,
}: {
  error: Error | null;
  incidentId: string | null;
  retryCount: number;
  onRetry: () => void;
  onStudyEmergencyDeck?: () => void;
  onTryCachedData?: () => void;
  fallbackPath?: string;
}) {
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = useCallback(async () => {
    setReporting(true);
    try {
      await fetch("/api/resilience/incident-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: incidentId || generateIncidentId(),
          contentType: "flashcard",
          tier: "unknown",
          route: window.location.pathname,
          errorMessage: error?.message || "Unknown flashcard error",
          errorName: error?.name,
          browserInfo: navigator.userAgent,
          source: "user",
          retryCount,
        }),
      });
      setReported(true);
    } catch {} finally {
      setReporting(false);
    }
  }, [error, incidentId, retryCount]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4" data-testid="flashcard-recovery-ui">
      <Card className="max-w-md w-full shadow-lg border-amber-200">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800" data-testid="text-flashcard-recovery-title">
              Flashcards temporarily unavailable
            </h3>
            <p className="text-sm text-slate-500">
              We're having trouble loading your flashcards. Your progress is saved and safe.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {retryCount < 3 && (
              <Button onClick={onRetry} className="w-full gap-2" data-testid="button-flashcard-retry">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            )}

            {onTryCachedData && (
              <Button variant="outline" onClick={onTryCachedData} className="w-full gap-2" data-testid="button-flashcard-cached">
                <WifiOff className="w-4 h-4" /> Study with cached data
              </Button>
            )}

            {onStudyEmergencyDeck && (
              <Button variant="outline" onClick={onStudyEmergencyDeck} className="w-full gap-2" data-testid="button-flashcard-emergency">
                <BookOpen className="w-4 h-4" /> Study Core Nursing Basics
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.location.href = fallbackPath || "/en/dashboard"}
              className="w-full gap-2"
              data-testid="button-flashcard-dashboard"
            >
              <Home className="w-4 h-4" /> Go to Dashboard
            </Button>
          </div>

          {!reported ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReport}
              disabled={reporting}
              className="text-slate-400 text-xs"
              data-testid="button-flashcard-report"
            >
              {reporting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              {reporting ? "Sending..." : "Report this issue"}
            </Button>
          ) : (
            <p className="text-xs text-green-600" data-testid="text-flashcard-report-sent">Report sent. Thank you.</p>
          )}

          {incidentId && (
            <p className="text-xs text-slate-400">Reference: {incidentId}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function DegradedModeIndicator({ mode }: { mode: DegradedMode }) {
  if (mode === "live") return null;

  const config = {
    cached: { icon: WifiOff, label: "Limited mode — showing cached data", color: "text-amber-600 bg-amber-50 border-amber-200" },
    emergency: { icon: AlertTriangle, label: "Emergency mode — showing core nursing basics", color: "text-orange-600 bg-orange-50 border-orange-200" },
    error: { icon: AlertTriangle, label: "Unable to load flashcards", color: "text-red-600 bg-red-50 border-red-200" },
  };

  const c = config[mode];
  if (!c) return null;
  const Icon = c.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${c.color}`} data-testid={`degraded-mode-${mode}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span>{c.label}</span>
    </div>
  );
}

export default FlashcardErrorBoundary;
