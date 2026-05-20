import { useState, useEffect, ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Sparkles, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";

import { useI18n } from "@/lib/i18n";
interface PaywallOverlayProps {
  contentType: string;
  country?: string;
  message?: string;
  children: ReactNode;
}

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  hasAccess: boolean;
}

export function useImagingAccess(contentType: string) {
  const { t } = useI18n();
  const [usage, setUsage] = useState<UsageData>({ used: 0, limit: 5, remaining: 5, hasAccess: false });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`/api/imaging/usage/${contentType}`)
      .then(r => r.json())
      .then(data => {
        setUsage(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [contentType, user]);

  const incrementUsage = async () => {
    try {
      await fetch(`/api/imaging/usage/${contentType}/increment`, { method: "POST" });
      setUsage(prev => ({
        ...prev,
        used: prev.used + 1,
        remaining: Math.max(0, prev.remaining - 1),
      }));
    } catch {}
  };

  return { ...usage, loading, incrementUsage, isLocked: !usage.hasAccess && usage.remaining <= 0 };
}

export function PaywallOverlay({ contentType, country, message, children }: PaywallOverlayProps) {
  const { isLocked, hasAccess, remaining, limit, loading } = useImagingAccess(contentType);

  if (loading) return <>{children}</>;
  if (hasAccess) return <>{children}</>;
  if (!isLocked) return (
    <div className="relative">
      {children}
      {remaining > 0 && remaining <= limit && (
        <FreePreviewBanner remaining={remaining} limit={limit} contentType={contentType} country={country} />
      )}
    </div>
  );

  return (
    <div className="relative" data-testid={`paywall-${contentType}`}>
      <div className="relative overflow-hidden rounded-xl">
        <div className="blur-sm pointer-events-none select-none opacity-50">
          {children}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("components.imagingPaywall.premiumContent")}</h3>
            <p className="text-gray-600 text-sm mb-6">
              {message || `You've reached the free preview limit. Upgrade to unlock all ${contentType} and accelerate your exam preparation.`}
            </p>
            <div className="flex flex-col gap-3">
              <Link href={country ? `/medical-imaging/${country}/pricing` : "/medical-imaging/store"}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" data-testid={`button-upgrade-${contentType}`}>
                  <Crown className="w-4 h-4 mr-2" />
                  Unlock Full Access
                </Button>
              </Link>
              <Link href="/medical-imaging/store">
                <Button variant="outline" className="w-full" data-testid={`button-store-${contentType}`}>
                  Browse Study Packs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FreePreviewBanner({ remaining, limit, contentType, country }: { remaining: number; limit: number; contentType: string; country?: string }) {
  return (
    <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4" data-testid={`banner-preview-${contentType}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-900">
            Free Preview: {remaining} of {limit} remaining
          </p>
          <p className="text-xs text-amber-700">
            Upgrade to unlock unlimited {contentType}
          </p>
        </div>
      </div>
      <Link href={country ? `/medical-imaging/${country}/pricing` : "/medical-imaging/store"}>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0" data-testid={`button-upgrade-preview-${contentType}`}>
          Upgrade <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

export function ImagingUpgradeCTA({ country, variant = "inline" }: { country?: string; variant?: "inline" | "banner" | "card" }) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/imaging/entitlements")
      .then(r => r.json())
      .then(data => setHasAccess(data.hasFullAccess || false))
      .catch(() => {});
  }, [user]);

  if (hasAccess) return null;

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white text-center" data-testid="cta-upgrade-banner">
        <Crown className="w-8 h-8 mx-auto mb-3 opacity-90" />
        <h3 className="text-lg font-bold mb-2">{t("components.imagingPaywall.upgradeToPremium")}</h3>
        <p className="text-indigo-100 text-sm mb-4 max-w-md mx-auto">
          Get unlimited access to all practice questions, flashcards, exams, and study materials.
        </p>
        <Link href={country ? `/medical-imaging/${country}/pricing` : "/medical-imaging/store"}>
          <Button variant="secondary" data-testid="button-cta-upgrade-banner">
            View Plans <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-white border-2 border-indigo-200 rounded-xl p-6" data-testid="cta-upgrade-card">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{t("components.imagingPaywall.readyToLevelUp")}</h3>
            <p className="text-sm text-gray-600 mb-3">
              Unlock premium study materials, unlimited practice exams, and detailed analytics.
            </p>
            <Link href={country ? `/medical-imaging/${country}/pricing` : "/medical-imaging/store"}>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" data-testid="button-cta-upgrade-card">
                <Crown className="w-3 h-3 mr-1" /> Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2" data-testid="cta-upgrade-inline">
      <Lock className="w-4 h-4 text-indigo-600" />
      <span className="text-sm text-indigo-700">{t("components.imagingPaywall.premiumFeature")}</span>
      <Link href={country ? `/medical-imaging/${country}/pricing` : "/medical-imaging/store"}>
        <Button size="sm" variant="link" className="text-indigo-600 p-0 h-auto" data-testid="button-cta-upgrade-inline">
          Upgrade <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

export function ImagingPurchaseSuccess() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) { setStatus("error"); return; }

    fetch("/api/imaging/verify-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => setStatus(data.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center" data-testid="purchase-success-page">
      {status === "verifying" && (
        <>
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CreditCardIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("components.imagingPaywall.verifyingPurchase")}</h1>
          <p className="text-gray-600">{t("components.imagingPaywall.pleaseWaitWhileWeConfirm")}</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("components.imagingPaywall.purchaseSuccessful")}</h1>
          <p className="text-gray-600 mb-6">{t("components.imagingPaywall.yourContentHasBeenUnlocked")}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/medical-imaging/account">
              <Button variant="outline" data-testid="button-view-account">{t("components.imagingPaywall.viewAccount")}</Button>
            </Link>
            <Link href="/medical-imaging">
              <Button data-testid="button-start-studying">{t("components.imagingPaywall.startStudying")}</Button>
            </Link>
          </div>
        </>
      )}
      {status === "error" && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("components.imagingPaywall.verificationIssue")}</h1>
          <p className="text-gray-600 mb-6">{t("components.imagingPaywall.weCouldntVerifyYourPurchase")}</p>
          <Link href="/medical-imaging/store">
            <Button data-testid="button-back-store">{t("components.imagingPaywall.backToStore")}</Button>
          </Link>
        </>
      )}
    </div>
  );
}

function CreditCardIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>; }
function CheckIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>; }
function XIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>; }
