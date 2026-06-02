import { useState, useEffect } from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHealthStatus, onHealthChange, startHealthPolling } from "@/lib/resilience";

export function IncidentBanner() {
  const [health, setHealth] = useState(getHealthStatus());
  const [platformStatus, setPlatformStatus] = useState<{ emergencyMode: boolean; message: string | null } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    startHealthPolling(30000);
    const unsub = onHealthChange((h) => {
      setHealth(h);
      if (h.status === "healthy" && !h.emergency) setDismissed(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    let active = true;
    const pollStatus = async () => {
      try {
        const res = await fetch("/api/platform/status");
        if (res.ok && active) {
          const data = await res.json();
          setPlatformStatus(data);
          if (!data.emergencyMode && !data.highLoad) setDismissed(false);
        }
      } catch {}
    };
    pollStatus();
    const interval = setInterval(pollStatus, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const isDown = health.status === "down";
  const isDegraded = health.status === "degraded";
  const isEmergency = health.emergency || platformStatus?.emergencyMode;
  const isHighLoad = (platformStatus as any)?.highLoad || (platformStatus as any)?.memoryPressure;
  const showBanner = (isDown || isDegraded || isEmergency || isHighLoad) && !dismissed;

  if (!showBanner) return null;

  return (
    <div
      className={`w-full px-4 py-2 flex items-center justify-between gap-3 text-sm ${
        isDown ? "bg-red-50 text-red-800 border-b border-red-200" :
        isEmergency ? "bg-orange-50 text-orange-800 border-b border-orange-200" :
        "bg-amber-50 text-amber-800 border-b border-amber-200"
      }`}
      data-testid="banner-incident"
    >
      <div className="flex items-center gap-2 flex-1">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span data-testid="text-incident-message">
          {isEmergency
            ? "We're running in backup mode. Your access is protected."
            : isHighLoad
            ? (platformStatus as any)?.highLoadMessage || "System under high load — running in safe mode"
            : isDown
            ? "Some services are experiencing issues. Your access and progress are protected."
            : "We are experiencing minor service delays. Everything should be back to normal shortly."}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => window.location.reload()}
          data-testid="button-incident-refresh"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => setDismissed(true)}
          data-testid="button-incident-dismiss"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
