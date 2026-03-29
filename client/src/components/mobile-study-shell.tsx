import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocaleLink } from "@/lib/LocaleLink";
import {
  BookOpen, Brain, Target, BarChart3, Home, Menu, X,
  Download, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isOfflineAvailable } from "@/lib/offline-store";

export function MobileBottomNav() {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    isOfflineAvailable().then(setHasOfflineData);
  }, []);

  if (!isMobile) return null;

  const hiddenPaths = ["/admin", "/login", "/qbank/exam", "/mock-exams/"];
  if (hiddenPaths.some((p) => location.startsWith(p))) return null;

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/free-practice", icon: Target, label: "Questions" },
    { href: "/flashcards", icon: Brain, label: "Cards" },
    { href: "/lessons", icon: BookOpen, label: "Lessons" },
    { href: "/dashboard", icon: BarChart3, label: "Progress" },
  ];

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center py-1.5 text-xs font-medium flex items-center justify-center gap-1.5" data-testid="banner-offline">
          <WifiOff className="w-3.5 h-3.5" />
          You're offline {hasOfflineData ? "— studying from downloaded content" : "— some features may be limited"}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom" data-testid="nav-mobile-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <LocaleLink key={item.href} href={item.href}>
                <button
                  className={`flex flex-col items-center justify-center w-full min-h-[44px] min-w-[44px] px-2 py-1.5 rounded-lg transition-colors ${
                    isActive ? "text-primary" : "text-gray-400 active:text-gray-600"
                  }`}
                  data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                </button>
              </LocaleLink>
            );
          })}
        </div>
      </nav>

      <div className="h-16 sm:hidden" />
    </>
  );
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center py-1.5 text-xs font-medium" data-testid="indicator-offline">
      <WifiOff className="w-3 h-3 inline mr-1" />
      Offline Mode
    </div>
  );
}
