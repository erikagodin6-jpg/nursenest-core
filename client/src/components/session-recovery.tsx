import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, Clock, Shield } from "lucide-react";
import type { CheckpointData } from "@/lib/session-checkpoint";

interface SessionRecoveryPromptProps {
  checkpoint: CheckpointData;
  onResume: (checkpoint: CheckpointData) => void;
  onRestart: () => void;
  sessionLabel?: string;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "over a day ago";
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  if (m < 1) return "less than a minute";
  if (m < 60) return `${m} minute${m > 1 ? "s" : ""}`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}

export function SessionRecoveryPrompt({ checkpoint, onResume, onRestart, sessionLabel }: SessionRecoveryPromptProps) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const answeredCount = checkpoint.answers ? Object.keys(checkpoint.answers).length : 0;
  const label = sessionLabel || checkpoint.sessionType.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"}`} data-testid="session-recovery-overlay">
      <Card className={`max-w-md w-full mx-4 shadow-2xl border-blue-200 transition-transform duration-300 ${animateIn ? "scale-100" : "scale-95"}`}>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-recovery-title">
              Resume your session?
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We found a saved {label} session. Your progress is safe and ready to continue.
            </p>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Clock className="w-4 h-4" />
              <span>Saved {formatTimeAgo(checkpoint.timestamp)}</span>
            </div>
            {answeredCount > 0 && (
              <div className="text-sm text-blue-600">
                {answeredCount} question{answeredCount > 1 ? "s" : ""} answered
              </div>
            )}
            {checkpoint.timeSpent > 0 && (
              <div className="text-sm text-blue-600">
                {formatDuration(checkpoint.timeSpent)} spent
              </div>
            )}
            {checkpoint.currentIndex > 0 && (
              <div className="text-sm text-blue-600">
                On question {checkpoint.currentIndex + 1}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => onResume(checkpoint)}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              data-testid="button-resume-session"
            >
              <RefreshCw className="w-4 h-4" />
              Resume Session
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full gap-2"
              data-testid="button-restart-session"
            >
              <RotateCcw className="w-4 h-4" />
              Start Fresh
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your account and subscription are not affected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
