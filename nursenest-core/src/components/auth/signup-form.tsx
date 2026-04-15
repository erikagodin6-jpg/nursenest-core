"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TurnstileSignup } from "@/components/auth/turnstile-signup";
import {
  reconcileExamFocusForCountry,
  signupExamFocusOptions,
  type SignupExamFocusValue,
} from "@/lib/marketing/signup-exam-focus-options";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { safeCallbackPath } from "@/lib/auth/safe-callback-path";

export function SignupForm({
  termsHref = "/terms",
  privacyHref = "/privacy",
  contactHref = "/contact",
  forgotPasswordHref = "/forgot-password",
}: {
  termsHref?: string;
  privacyHref?: string;
  contactHref?: string;
  forgotPasswordHref?: string;
} = {}) {
  const { t, locale } = useMarketingI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginAfterSignupHref = useMemo(() => {
    const target = safeCallbackPath(searchParams.get("callbackUrl")) ?? "/app";
    return `${withMarketingLocale(locale, "/login")}?callbackUrl=${encodeURIComponent(target)}`;
  }, [searchParams, locale]);
  const [error, setError] = useState<string | null>(null);
  const [errorHelp, setErrorHelp] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [examFocus, setExamFocus] = useState<SignupExamFocusValue>("nclex_rn");
  const onCaptcha = useCallback((tok: string | null) => setCaptchaToken(tok), []);

  const examOptions = useMemo(() => signupExamFocusOptions(country, t), [country, t]);

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
        return t("pages.signup.errorGeneric");
    }
  }

  function signupErrorHelp(data: { error?: string; code?: string }): string | null {
    if (typeof data.error === "string" && data.error.length > 0) {
      return t("pages.signup.errorServerMessageHelp");
    }
    switch (data.code) {
      case "duplicate_email":
        return t("pages.signup.errorDuplicateEmailHelp");
      case "duplicate_username":
        return t("pages.signup.errorDuplicateUsernameHelp");
      case "captcha":
        return t("pages.signup.errorCaptchaHelp");
      case "validation":
      case "invalid_username":
        return t("pages.signup.errorValidationHelp");
      case "db":
      case "missing_table":
        return t("pages.signup.errorServerHelp");
      default:
        return t("pages.signup.errorGenericHelp");
    }
  }

  async function onSubmit(formData: FormData) {
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
      tier: String(formData.get("tier") ?? "RN"),
      examFocus,
      studyGoal: String(formData.get("studyGoal") ?? ""),
      dailyStudyMinutes: Number(formData.get("dailyStudyMinutes") ?? 30),
      learnerPath: learnerPathRaw || undefined,
      ...(captchaToken ? { captchaToken } : {}),
    };

    setPending(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };

      if (!res.ok) {
        setError(signupErrorMessage(data));
        setErrorHelp(signupErrorHelp(data));
        return;
      }
      trackProductEvent(PH.signupSuccessClient, {
        actor: "anonymous",
        funnel_step: "account_created",
        marketing_locale: locale,
        signup_country: country,
        exam_focus: examFocus,
      });
      router.push(loginAfterSignupHref);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        void onSubmit(new FormData(e.currentTarget));
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
          type="text"
          name="firstName"
          placeholder={t("pages.signup.placeholderFirstName") ?? "First name"}
          required
          autoComplete="given-name"
        />
        <input
          className="w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
          type="text"
          name="lastName"
          placeholder={t("pages.signup.placeholderLastName") ?? "Last name"}
          autoComplete="family-name"
        />
      </div>
      <input
        className="w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
        type="text"
        name="username"
        placeholder={t("pages.signup.placeholderUsername")}
        required
        autoComplete="username"
      />
      <input
        className="w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
        type="email"
        name="email"
        placeholder={t("pages.signup.placeholderEmail")}
        required
      />
      <input
        className="w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)] placeholder:text-muted-foreground"
        type="password"
        name="password"
        placeholder={t("pages.signup.placeholderPassword")}
        required
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)]"
          name="country"
          value={country}
          onChange={(e) => {
            const next = e.target.value === "US" ? "US" : "CA";
            setCountry(next);
            setExamFocus((prev) => reconcileExamFocusForCountry(next, prev));
          }}
        >
          <option value="CA">{t("pages.signup.countryCa")}</option>
          <option value="US">{t("pages.signup.countryUs")}</option>
        </select>
        <select
          className="rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-[var(--theme-body-text)]"
          name="tier"
          defaultValue="RN"
        >
          <option value="RPN">{t("pages.signup.tierRpn")}</option>
          <option value="LVN_LPN">{t("pages.signup.tierLvn")}</option>
          <option value="RN">{t("pages.signup.tierRn")}</option>
          <option value="NP">{t("pages.signup.tierNp")}</option>
          <option value="ALLIED">{t("pages.signup.tierAllied")}</option>
        </select>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-inset)] p-4">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("pages.signup.onboardingTitle")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select
            className="rounded-lg border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--theme-body-text)]"
            name="learnerPath"
            defaultValue="experienced"
          >
            <option value="new_grad">{t("pages.signup.pathNewGrad")}</option>
            <option value="experienced">{t("pages.signup.pathExperienced")}</option>
            <option value="career_change">{t("pages.signup.pathCareerChange")}</option>
          </select>
          <select
            className="rounded-lg border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--theme-body-text)]"
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
          <select
            className="rounded-lg border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--theme-body-text)]"
            name="studyGoal"
            defaultValue="pass_first"
          >
            <option value="pass_first">{t("pages.signup.studyGoalPassFirst")}</option>
            <option value="raise_score">{t("pages.signup.studyGoalRaiseScore")}</option>
            <option value="speed">{t("pages.signup.studyGoalSpeed")}</option>
          </select>
          <select
            className="rounded-lg border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--theme-body-text)]"
            name="dailyStudyMinutes"
            defaultValue="30"
          >
            <option value="15">{t("pages.signup.daily15")}</option>
            <option value="30">{t("pages.signup.daily30")}</option>
            <option value="45">{t("pages.signup.daily45")}</option>
            <option value="60">{t("pages.signup.daily60Plus")}</option>
          </select>
        </div>
      </div>
      <TurnstileSignup onToken={onCaptcha} />
      {error || errorHelp ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-3 py-2.5 text-[var(--semantic-text-primary)]"
        >
          {error ? <p className="text-sm font-medium">{error}</p> : null}
          {errorHelp ? <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{errorHelp}</p> : null}
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
        <Link href={termsHref} className="nn-link-quiet font-semibold">
          {t("pages.signup.termsLink")}
        </Link>
        {t("pages.signup.legalAnd")}
        <Link href={privacyHref} className="nn-link-quiet font-semibold">
          {t("pages.signup.privacyLink")}
        </Link>
        {t("pages.signup.legalAfter")}
      </p>
      <button
        className="nn-btn-primary w-full px-4 py-3 text-base font-semibold disabled:pointer-events-none disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? `${t("pages.signup.createAccount")}…` : t("pages.signup.createAccount")}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href={loginAfterSignupHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("pages.signup.alreadyHaveAccount")}
        </Link>
      </p>
    </form>
  );
}
