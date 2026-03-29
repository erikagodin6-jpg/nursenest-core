import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";
import { shouldShowPopup, suppressPopup } from "@/lib/popup-suppression";

import { useI18n } from "@/lib/i18n";
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;

    setIsIOS(isIOSDevice);
    setIsStandalone(!!standalone);

    if (standalone) return;

    if (!shouldShowPopup("pwa_install")) return;

    const dismissed = localStorage.getItem("nursenest-pwa-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (isIOSDevice && !standalone) {
      const visits = parseInt(localStorage.getItem("nursenest-visit-count") || "0", 10) + 1;
      localStorage.setItem("nursenest-visit-count", visits.toString());
      if (visits >= 2) {
        setShowBanner(true);
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      try {
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "pwa_install_prompt_result", {
            event_category: "pwa",
            event_label: outcome,
          });
        }
      } catch {}
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    suppressPopup("pwa_install");
    localStorage.setItem("nursenest-pwa-dismissed", Date.now().toString());
    try {
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "pwa_install_dismissed", {
          event_category: "pwa",
          event_label: isIOS ? "ios_banner" : "android_banner",
        });
      }
    } catch {}
  };

  if (!showBanner || isStandalone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom-4 duration-500" data-testid="pwa-install-banner">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-primary/20 p-4 flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{t("components.pwaInstallPrompt.addNursenestToHomeScreen")}</p>
          {isIOS ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Tap the share button <span className="inline-block text-blue-500">⎋</span> then "Add to Home Screen" for an app-like experience.
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">
              Install NurseNest for quick access, offline support, and a full-screen experience.
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {!isIOS && deferredPrompt && (
              <Button
                size="sm"
                className="h-8 px-4 text-xs rounded-full bg-primary text-white"
                onClick={handleInstall}
                data-testid="button-pwa-install"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Install
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs text-gray-500"
              onClick={handleDismiss}
              data-testid="button-pwa-dismiss"
            >
              Not now
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-gray-400 hover:text-gray-600 p-1"
          aria-label={t("components.pwaInstallPrompt.dismiss")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
