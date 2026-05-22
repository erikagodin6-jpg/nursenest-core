"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TurnstileSignup } from "@/components/auth/turnstile-signup";
import { isLikelyNetworkFailure } from "@/components/auth/auth-client-error-handling";
import {
  reconcileExamFocusForCountryAndTier,
  signupExamFocusOptions,
  type SignupExamFocusValue,
  type SignupTierValue,
} from "@/lib/marketing/signup-exam-focus-options";
import { safeSignupFieldCopy } from "@/lib/marketing/signup-copy";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { resolveMarketingAuthRedirectTarget } from "@/lib/auth/post-login-resume-path";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import { OAuthProviderButtonsServer } from "@/components/auth/oauth-provider-buttons-server";
import { AuthFormLayout } from "@/components/auth/auth-experience/auth-form-layout";
import { AuthMessageBanner } from "@/components/auth/auth-experience/auth-message-banner";
import { authTransitionMessageTone } from "@/lib/auth/auth-transition-governance";

const TIER_LABEL: Record<SignupTierValue, string> = {
  RN: "RN",
  RPN: "RPN",
  LVN_LPN: "LPN",
  NP: "NP",
  ALLIED: "Allied",
};

export function SignupForm({
  tier,
  onTierChange,
  termsHref = "/terms",
  privacyHref = "/privacy",
  contactHref = "/contact",
  forgotPasswordHref = "/forgot-password",
}: {
  tier: SignupTierValue;
  onTierChange: (tier: SignupTierValue) => void;
  termsHref?: string;
  privacyHref?: string;
  contactHref?: string;
  forgotPasswordHref?: string;
}) {
  const { t, locale } = useMarketingI18n();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const submitGeneration = useRef(0);

  const redirectTarget = useMemo(
    () => resolveMarketingAuthRedirectTarget(pathname, searchParams, locale),
    [searchParams, pathname, locale],
  );

  function verifyAfterSignupHref(email?: string) {
    const base = withMarketingLocale(locale, "/verify-email");
    const params = new URLSearchParams({ sent: "1" });
    if (email?.trim()) params.set("email", email.trim());
    if (redirectTarget && redirectTarget !== "/app/start-studying") {
      params.set("callbackUrl", redirectTarget);
    }
    return `${base}?${params.toString()}`;
  }

  const loginAfterSignupHref = useMemo(() => {
    const loginBase = withMarketingLocale(locale, "/login");
    const params = new URLSearchParams();
    params.set("callbackUrl", redirectTarget);
    params.set("registered", "1");
    return `${loginBase}?${params.toString()}`;
  }, [locale, redirectTarget]);

  const [error, setError] = useState<string | null>(null);
  const [errorHelp, setErrorHelp] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /** Prevents native POST to `/signup` before React `onSubmit` is attached (same pattern as {@link LoginForm}). */
  const [clientReady, setClientReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [examFocus, setExamFocus] = useState<SignupExamFocusValue>("nclex_rn");
  const onCaptcha = useCallback((tok: string | null) => setCaptchaToken(tok), []);
  /** When the widget is shown, `/api/signup` may require a token (see `isTurnstileEnforced`). */
  const turnstileQaBypassActive =
    process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_QA_BYPASS_TURNSTILE === "1";
  const turnstileGateActive =
    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()) && !turnstileQaBypassActive;

  const examOptions = useMemo(() => signupExamFocusOptions(country, tier, t), [country, tier, t]);
  const continueSubtext = useMemo(() => {
    const pathway = TIER_LABEL[tier] ?? "RN";
    const exam = examOptions.find((o) => o.value === examFocus)?.label;
    return exam ? `${pathway} pathway · ${exam}` : `${pathway} pathway`;
  }, [tier, examFocus, examOptions]);
  const firstNamePlaceholder = safeSignupFieldCopy(t("pages.signup.placeholderFirstName"), "First name");
  const lastNamePlaceholder = safeSignupFieldCopy(t("pages.signup.placeholderLastName"), "Last name");

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    setExamFocus((prev) => reconcileExamFocusForCountryAndTier(country, tier, prev, t));
  }, [country, tier, t]);

  function signupErrorMessage(data: { error?: string; code?: string }): string {
    if (typeof data.error === "string" && data.error.length > 0) return data.error;
    switch (data.code) {
      case "duplicate_email":
        return t("pages.signup.errorDuplicateEmail");
      case "duplicate_username":
        return t("pages.signup.errorDuplicateUsername");
      case "captcha":
        return t("pages.signup.errorCaptcha");
      case "validation":
      case "invalid_username":
        return t("pages.signup.errorValidation");
      case "db":
      case "missing_table":
        return t("pages.signup.errorServer");
      default:
        return t("pages.signup.errorServer");
    }
  }

  async function onSubmit(formData: FormData) {
    const myGeneration = ++submitGeneration.current;
    setError(null);
    setErrorHelp(null);
    trackProductEvent(PH.signupSubmitAttempt, {
      actor: "anonymous",
      funnel_step: "signup_submit",
      marketing_locale: locale,
      signup_country: country,
      exam_focus: examFocus,
    });
    const rawFirst = String(formData.get("firstName") ?? "").trim();
    const rawLast = String(formData.get("lastName") ?? "").trim();
    const fullName = rawLast ? `${rawFirst} ${rawLast}` : rawFirst;
    const learnerPathRaw = String(formData.get("learnerPath") ?? "").trim();
    const payload = {
      name: fullName,
      firstName: rawFirst || null,
      lastName: rawLast || null,
      username: String(formData.get("username") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      country,
      tier,
      examFocus,
      studyGoal: String(formData.get("studyGoal") ?? ""),
      dailyStudyMinutes: Number(formData.get("dailyStudyMinutes") ?? 30),
      learnerPath: learnerPathRaw || undefined,
      ...(captchaToken ? { captchaToken } : {}),
    };

    if (turnstileGateActive && !captchaToken?.trim()) {
      setError(t("pages.signup.errorCaptcha"));
      setErrorHelp(null);
      return;
    }

    setPending(true);
    let keepSpinnerUntilRedirect = false;
    try {
      let res: Response;
      try {
        res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        if (myGeneration !== submitGeneration.current) return;
        setError(isLikelyNetworkFailure(e) ? t("pages.signup.errorNetwork") : t("pages.signup.errorServer"));
        setErrorHelp(null);
        return;
      }

      if (myGeneration !== submitGeneration.current) return;

      const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };

      if (!res.ok) {
        setError(signupErrorMessage(data));
        const code = data.code;
        if (code === "db" || code === "missing_table") {
          const h = t("pages.signup.errorServerHelp")?.trim();
          setErrorHelp(h || null);
        } else {
          setErrorHelp(null);
        }
        return;
      }

      trackProductEvent(PH.signupSuccessClient, {
        actor: "anonymous",
        funnel_step: "account_created",
        marketing_locale: locale,
        signup_country: country,
        exam_focus: examFocus,
      });

      keepSpinnerUntilRedirect = true;
      router.push(verifyAfterSignupHref(payload.email));
    } finally {
      if (!keepSpinnerUntilRedirect) {
        setPending(false);
      }
    }
  }

  const signupTierForTransition =
    tier === "NP" ? "NP" : tier === "RPN" || tier === "LVN_LPN" ? "PN" : tier === "RN" ? "RN" : "ALLIED";

  return (
    <AuthFormLayout
      formId="signup"
      pending={pending}
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        void onSubmit(new FormData(e.currentTarget));
      }}
    >
      {pending ? (
        <AuthTransitionShell
          kind="sign-up-completion"
          layout="inline"
          callbackUrl={redirectTarget}
          signupTier={signupTierForTransition}
          showLoading
        />
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="nn-premium-auth-input w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
          type="text"
          name="firstName"
          aria-label={firstNamePlaceholder}
          placeholder={firstNamePlaceholder}
          required
          autoComplete="given-name"
        />
        <input
          className="nn-premium-auth-input w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
          type="text"
          name="lastName"
          aria-label={lastNamePlaceholder}
          placeholder={lastNamePlaceholder}
          autoComplete="family-name"
        />
      </div>
      <input
        className="nn-premium-auth-input w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
        type="text"
        name="username"
        placeholder={t("pages.signup.placeholderUsername")}
        required
        autoComplete="username"
      />
      <input
        className="nn-premium-auth-input w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
        type="email"
        name="email"
        placeholder={t("pages.signup.placeholderEmail")}
        required
      />
      <input
        className="nn-premium-auth-input w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
        type="password"
        name="password"
        placeholder={t("pages.signup.placeholderPassword")}
        required
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          className="nn-premium-auth-input rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)]"
          name="country"
          value={country}
          onChange={(e) => {
            const next = e.target.value === "US" ? "US" : "CA";
            setCountry(next);
          }}
        >
          <option value="CA">{t("pages.signup.countryCa")}</option>
          <option value="US">{t("pages.signup.countryUs")}</option>
        </select>
        <select
          className="nn-premium-auth-input rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)]"
          name="tier"
          value={tier}
          onChange={(e) => {
            const next = e.target.value as SignupTierValue;
            onTierChange(next);
          }}
        >
          <option value="RPN">{t("pages.signup.tierRpn")}</option>
          <option value="LVN_LPN">{t("pages.signup.tierLvn")}</option>
          <option value="RN">{t("pages.signup.tierRn")}</option>
          <option value="NP">{t("pages.signup.tierNp")}</option>
          <option value="ALLIED">{t("pages.signup.tierAllied")}</option>
        </select>
      </div>
      <details className="nn-premium-auth-signup-fine-tune rounded-xl border border-[var(--auth-border-soft)] bg-[color-mix(in_srgb,var(--auth-surface)_88%,transparent)] px-3 py-2.5">
        <summary className="cursor-pointer text-xs font-semibold text-[var(--auth-subtext)]">
          {t("pages.signup.onboardingTitle")}
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select
            className="nn-premium-auth-input rounded-lg px-3 py-2 text-sm"
            name="learnerPath"
            defaultValue="experienced"
          >
            <option value="new_grad">{t("pages.signup.pathNewGrad")}</option>
            <option value="experienced">{t("pages.signup.pathExperienced")}</option>
            <option value="career_change">{t("pages.signup.pathCareerChange")}</option>
          </select>
          <select
            className="nn-premium-auth-input rounded-lg px-3 py-2 text-sm"
            name="examFocus"
            value={examFocus}
            onChange={(e) => setExamFocus(e.target.value as SignupExamFocusValue)}
          >
            {examOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select className="nn-premium-auth-input rounded-lg px-3 py-2 text-sm" name="studyGoal" defaultValue="pass_first">
            <option value="pass_first">{t("pages.signup.studyGoalPassFirst")}</option>
            <option value="raise_score">{t("pages.signup.studyGoalRaiseScore")}</option>
            <option value="speed">{t("pages.signup.studyGoalSpeed")}</option>
          </select>
          <select className="nn-premium-auth-input rounded-lg px-3 py-2 text-sm" name="dailyStudyMinutes" defaultValue="30">
            <option value="15">{t("pages.signup.daily15")}</option>
            <option value="30">{t("pages.signup.daily30")}</option>
            <option value="45">{t("pages.signup.daily45")}</option>
            <option value="60">{t("pages.signup.daily60Plus")}</option>
          </select>
        </div>
      </details>

      <OAuthProviderButtonsServer
        redirectTarget={redirectTarget}
        disabled={pending || !clientReady}
        surface="signup"
        marketingLocale={locale}
      />

      <TurnstileSignup onToken={onCaptcha} />
      {error || errorHelp ? (
        <div>
          <AuthMessageBanner
            tone={authTransitionMessageTone("authentication-error")}
            stateId="validation-error"
            title={error ?? t("pages.signup.errorGeneric")}
            message={errorHelp}
          />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
            <Link href={loginAfterSignupHref} className="text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              {t("pages.signup.errorLinkSignIn")}
            </Link>
            <Link href={forgotPasswordHref} className="text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              {t("pages.signup.errorLinkForgot")}
            </Link>
            <Link href={contactHref} className="text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              {t("pages.signup.errorLinkContact")}
            </Link>
          </div>
        </div>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("pages.signup.legalBefore")}
        {" "}
        <Link href={termsHref} className="nn-link-quiet font-semibold">
          {t("pages.signup.termsLink")}
        </Link>
        {t("pages.signup.legalAnd")}
        <Link href={privacyHref} className="nn-link-quiet font-semibold">
          {t("pages.signup.privacyLink")}
        </Link>
        {t("pages.signup.legalAfter")}
      </p>
      <div className="nn-premium-auth-signup-cta">
        <button
          className="nn-premium-auth-primary-button nn-btn-primary w-full px-4 py-3 text-base font-semibold disabled:pointer-events-none disabled:opacity-60"
          type="submit"
          disabled={pending || !clientReady || (turnstileGateActive && !captchaToken?.trim())}
          aria-busy={pending}
        >
          {pending ? t("pages.signup.creatingAccount") : "Continue"}
        </button>
        <p className="nn-premium-auth-signup-cta__subtext" aria-live="polite">
          {continueSubtext}
        </p>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        <Link href={loginAfterSignupHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("pages.signup.alreadyHaveAccount")}
        </Link>
      </p>
    </AuthFormLayout>
  );
}
