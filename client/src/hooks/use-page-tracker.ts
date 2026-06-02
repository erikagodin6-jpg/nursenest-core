import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getPlatformSection } from "@shared/platform-sections";

function getSessionId(): string {
  let sid = sessionStorage.getItem("nn-session-id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("nn-session-id", sid);
  }
  return sid;
}

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Other";
}

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

function getStoredUTMParams() {
  try {
    const stored = sessionStorage.getItem("nn-utm-params");
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function storeUTMParams(utms: { utmSource?: string; utmMedium?: string; utmCampaign?: string }) {
  if (utms.utmSource || utms.utmMedium || utms.utmCampaign) {
    sessionStorage.setItem("nn-utm-params", JSON.stringify(utms));
  }
}

export function usePageTracker() {
  const [location] = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const lastPageRef = useRef<string>("");
  const lastSectionRef = useRef<string>("");

  useEffect(() => {
    const sendDuration = () => {
      if (lastPageRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (duration > 1) {
          navigator.sendBeacon(
            "/api/track/duration",
            new Blob([JSON.stringify({
              sessionId: getSessionId(),
              page: lastPageRef.current,
              duration,
            })], { type: "application/json" })
          );
        }
      }
    };

    sendDuration();

    const page = location || "/";
    const platformSection = getPlatformSection(page);
    const previousSection = lastSectionRef.current;
    const previousPage = lastPageRef.current;

    lastPageRef.current = page;
    startTimeRef.current = Date.now();
    lastSectionRef.current = platformSection;

    const stored = localStorage.getItem("nursenest-user");
    const userId = stored ? JSON.parse(stored)?.id : undefined;

    const currentUtms = getUTMParams();
    if (currentUtms.utmSource || currentUtms.utmMedium || currentUtms.utmCampaign) {
      storeUTMParams(currentUtms);
    }
    const preservedUtms = getStoredUTMParams();
    const utms = {
      utmSource: currentUtms.utmSource || preservedUtms.utmSource,
      utmMedium: currentUtms.utmMedium || preservedUtms.utmMedium,
      utmCampaign: currentUtms.utmCampaign || preservedUtms.utmCampaign,
    };

    const isPricingView = page === "/pricing";
    const isCheckoutIntent = page.includes("subscription") || page.includes("checkout");

    const referrer = document.referrer;
    let cleanReferrer: string | undefined;
    if (referrer) {
      try {
        const url = new URL(referrer);
        if (url.hostname !== window.location.hostname) {
          cleanReferrer = url.hostname;
        }
      } catch {}
    }

    fetch("/api/track/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        userId,
        page,
        platformSection,
        referrer: cleanReferrer,
        ...utms,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        isPricingView,
        isCheckoutIntent,
      }),
    }).catch(() => {});

    if (previousSection && previousSection !== platformSection && previousPage && previousSection !== "other" && platformSection !== "other") {
      fetch("/api/track/cross-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          userId,
          sourceSection: previousSection,
          destinationSection: platformSection,
          sourcePage: previousPage,
          destinationPage: page,
          ...utms,
        }),
      }).catch(() => {});
    }

    return () => {};
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (lastPageRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (duration > 1) {
          navigator.sendBeacon(
            "/api/track/duration",
            new Blob([JSON.stringify({
              sessionId: getSessionId(),
              page: lastPageRef.current,
              duration,
            })], { type: "application/json" })
          );
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}
