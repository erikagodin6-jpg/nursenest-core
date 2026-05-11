"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  CHECKOUT_UNAUTHORIZED_CODE,
  parseCheckoutApiErrorBody,
  showStripePriceEnvKeyOnCheckoutError,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
  type ParsedCheckoutErrorBody,
} from "@/lib/stripe/checkout-api-diagnostics";
import { PricingAdvancedEcgAddOn } from "@/components/marketing/pricing-advanced-ecg-add-on";

type CheckoutRequestError = Error & {
  parsed?: ParsedCheckoutErrorBody;
  status?: number;
};

export function AdvancedEcgLaunchPurchaseSection({
  locale,
  checkoutEnabled,
  disabledMessage,
}: {
  locale: string;
  checkoutEnabled: boolean;
  disabledMessage: string | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status: authStatus } = useSession();
  const checkoutState = searchParams.get("checkout");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutOpsHint, setCheckoutOpsHint] = useState<string | null>(null);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [checkoutIntentHandled, setCheckoutIntentHandled] = useState(false);

  const localize = useCallback((href: string) => withMarketingLocale(locale, href), [locale]);

  const redirectGuestToLoginForAdvancedEcgCheckout = useCallback(() => {
    const callbackParams = new URLSearchParams(searchParams.toString());
    callbackParams.set("checkoutIntent", "1");
    callbackParams.set("checkoutModule", "advanced_ecg");
    const callbackPath = callbackParams.size > 0 ? `${pathname}?${callbackParams.toString()}` : pathname;
    const loginPath = localize("/login");
    window.location.assign(`${loginPath}?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }, [localize, pathname, searchParams]);

  const startAdvancedEcgCheckout = useCallback(async () => {
    setCheckoutError(null);
    setCheckoutOpsHint(null);
    if (!checkoutEnabled) {
      setCheckoutError(disabledMessage || "Advanced ECG checkout is not available right now.");
      return;
    }
    if (authStatus === "loading") return;
    if (authStatus !== "authenticated") {
      redirectGuestToLoginForAdvancedEcgCheckout();
      return;
    }
    if (!policiesAccepted) {
      setCheckoutError("Accept the Terms and Privacy Policy before starting checkout.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/subscriptions/checkout/advanced-ecg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          acceptPolicies: true,
          policyVersion: LEGAL_POLICY_BUNDLE_VERSION,
          entryPoint: "launch",
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as unknown;
      if (!res.ok) {
        const parsed = parseCheckoutApiErrorBody(payload);
        if (parsed.code === CHECKOUT_UNAUTHORIZED_CODE || res.status === 401) {
          setCheckoutLoading(false);
          redirectGuestToLoginForAdvancedEcgCheckout();
          return;
        }
        const err = new Error(
          parsed.message?.trim() || "Unable to start Advanced ECG checkout right now.",
        ) as CheckoutRequestError;
        err.parsed = parsed;
        err.status = res.status;
        throw err;
      }
      const checkoutUrl = (payload as { url?: unknown }).url;
      if (typeof checkoutUrl !== "string" || checkoutUrl.trim().length === 0) {
        throw new Error("Unable to start Advanced ECG checkout right now.");
      }
      window.location.assign(checkoutUrl);
    } catch (error) {
      const checkoutErr = error as CheckoutRequestError;
      if (checkoutErr.status === 401 || checkoutErr.parsed?.code === CHECKOUT_UNAUTHORIZED_CODE) {
        setCheckoutLoading(false);
        redirectGuestToLoginForAdvancedEcgCheckout();
        return;
      }
      if (checkoutErr.parsed?.code === STRIPE_PRICE_NOT_CONFIGURED_CODE) {
        setCheckoutError("Advanced ECG checkout is not configured yet. Please try again shortly.");
        if (showStripePriceEnvKeyOnCheckoutError() && checkoutErr.parsed.envKey) {
          setCheckoutOpsHint(`Missing billing env: ${checkoutErr.parsed.envKey}`);
        }
      } else {
        setCheckoutError(
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : "Unable to start Advanced ECG checkout right now.",
        );
      }
      setCheckoutLoading(false);
    }
  }, [authStatus, checkoutEnabled, disabledMessage, policiesAccepted, redirectGuestToLoginForAdvancedEcgCheckout]);

  useEffect(() => {
    if (checkoutIntentHandled || authStatus !== "authenticated") return;
    const sp = new URLSearchParams(searchParams.toString());
    if (sp.get("checkoutIntent") !== "1" || sp.get("checkoutModule") !== "advanced_ecg") return;

    setCheckoutIntentHandled(true);
    const cleanParams = new URLSearchParams(sp.toString());
    cleanParams.delete("checkoutIntent");
    cleanParams.delete("checkoutModule");
    const cleanUrl = cleanParams.size > 0 ? `${pathname}?${cleanParams.toString()}` : pathname;
    window.history.replaceState({}, "", cleanUrl);

    if (!policiesAccepted) {
      setCheckoutError("Accept the Terms and Privacy Policy before starting checkout.");
      return;
    }
    void startAdvancedEcgCheckout();
  }, [authStatus, checkoutIntentHandled, pathname, policiesAccepted, searchParams, startAdvancedEcgCheckout]);

  return (
    <section id="buy" className="mt-6 space-y-4 scroll-mt-28">
      <PricingAdvancedEcgAddOn
        onCheckout={() => void startAdvancedEcgCheckout()}
        checkoutLoading={checkoutLoading}
        checkoutEnabled={checkoutEnabled}
        disabledMessage={disabledMessage}
      />
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
        {checkoutState === "success" ? (
          <p className="mb-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-3 py-2 text-sm text-[var(--semantic-success-contrast)]">
            Advanced ECG purchase complete. Your specialty module is ready on the learner route.
          </p>
        ) : null}
        {checkoutState === "cancelled" ? (
          <p className="mb-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-warning-contrast)]">
            Checkout was cancelled. Your launch page is still here when you want to resume.
          </p>
        ) : null}
        <label className="flex items-start gap-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          <input
            type="checkbox"
            checked={policiesAccepted}
            onChange={(event) => {
              setPoliciesAccepted(event.target.checked);
              if (event.target.checked) {
                setCheckoutError(null);
              }
            }}
            className="mt-1 h-4 w-4 rounded border-[var(--semantic-border-soft)]"
          />
          <span>
            I agree to the{" "}
            <Link href={localize("/terms")} className="font-medium text-primary underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href={localize("/privacy")} className="font-medium text-primary underline">
              Privacy Policy
            </Link>{" "}
            before starting checkout.
          </span>
        </label>
        <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          Checkout is available for signed-in RN and NP learners. If you are not signed in, we will return you here after login.
        </p>
        {checkoutError ? (
          <p className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_26%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] px-3 py-2 text-sm text-[var(--semantic-danger-contrast)]">
            {checkoutError}
          </p>
        ) : null}
        {checkoutOpsHint ? (
          <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{checkoutOpsHint}</p>
        ) : null}
      </div>
    </section>
  );
}
