"use client";

import { useEffect } from "react";
import {
  REFERRAL_CLICK_PENDING_COOKIE,
  REFERRAL_CODE_COOKIE,
  REFERRAL_LANDING_COOKIE,
  REFERRAL_UTM_CAMPAIGN_COOKIE,
  REFERRAL_UTM_MEDIUM_COOKIE,
  REFERRAL_UTM_SOURCE_COOKIE,
} from "@/lib/referrals/referral-attribution-cookies";

function readCookie(name: string): string | null {
  const found = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!found) return null;
  try {
    return decodeURIComponent(found.slice(name.length + 1));
  } catch {
    return found.slice(name.length + 1);
  }
}

function clearPendingCookie() {
  document.cookie = `${REFERRAL_CLICK_PENDING_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function stableReferralSessionId(): string {
  const key = "nn_ref_session";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(key, next);
  return next;
}

export function ReferralAttributionTracker() {
  useEffect(() => {
    const pending = readCookie(REFERRAL_CLICK_PENDING_COOKIE);
    const code = readCookie(REFERRAL_CODE_COOKIE);
    if (!pending || !code) return;

    const payload = {
      code,
      landingPath: readCookie(REFERRAL_LANDING_COOKIE) ?? `${window.location.pathname}${window.location.search}`,
      referrerUrl: document.referrer || null,
      utmSource: readCookie(REFERRAL_UTM_SOURCE_COOKIE),
      utmMedium: readCookie(REFERRAL_UTM_MEDIUM_COOKIE),
      utmCampaign: readCookie(REFERRAL_UTM_CAMPAIGN_COOKIE),
      sessionId: stableReferralSessionId(),
    };

    fetch("/api/referrals/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(payload),
    }).finally(clearPendingCookie);
  }, []);

  return null;
}
