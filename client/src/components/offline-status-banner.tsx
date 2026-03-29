import { useState, useEffect } from "react";
import { WifiOff, Wifi, BookOpen, X, RefreshCw } from "lucide-react";
import { isOfflineAvailable } from "@/lib/offline-store";

export function OfflineStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    isOfflineAvailable().then(setHasOfflineData).catch(() => {});
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
      try {
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "pwa_reconnected", { event_category: "pwa" });
        }
      } catch {}
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
      try {
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "pwa_offline", {
            event_category: "pwa",
            event_label: window.location.pathname,
          });
        }
      } catch {}
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (dismissed) return null;

  if (showReconnected && isOnline) {
    return (
      <div
        className="fixed top-0 left-0 right-0 z-[9998] bg-green-500 text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300"
        data-testid="banner-reconnected"
      >
        <Wifi className="w-4 h-4" />
        Back online — your progress will sync automatically
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9998] bg-amber-500 text-white py-2 px-4 text-sm font-medium animate-in slide-in-from-top duration-300"
      data-testid="banner-offline-status"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>You're offline</span>
          {hasOfflineData && (
            <span className="hidden sm:inline">— downloaded content is still available</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasOfflineData && (
            <a
              href="/offline-study"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors min-h-[44px] min-w-[44px]"
              data-testid="link-offline-study"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Study Offline
            </a>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-full px-2 py-1.5 text-xs transition-colors min-h-[44px] min-w-[44px] justify-center"
            aria-label="Retry connection"
            data-testid="button-retry-connection"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Dismiss"
            data-testid="button-dismiss-offline"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
