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
}: {
  termsHref?: string;
  privacyHref?: string;
} = {}) {
  const { t, locale } = useMarketingI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginAfterSignupHref = useMemo(() => {
    const target = safeCallbackPath(searchParams.get("callbackUrl")) ?? "/app";
    return `${withMarketingLocale(locale, "/login")}?callbackUrl=${encodeURIComponent(target)}`;
  }, [searchParams, locale]);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [examFocus, setExamFocus] = useState<SignupExamFocusValue>("nclex_rn");
  const onCaptcha = useCallback((tok: string | null) => setCaptchaToken(tok), []);

  const examOptions = useMemo(() => signupExamFocusOptions(country, t), [country, t]);

  async function onSubmit(formData: FormData) {
    setError(null);
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
    const payload = {
      name: fullName,
      firstName: rawFirst || null,
      lastName: rawLast || null,
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      country,
      tier: String(formData.get("tier") ?? "RN"),
      examFocus,
      studyGoal: String(formData.get("studyGoal") ?? ""),
      dailyStudyMinutes: Number(formData.get("dailyStudyMinutes") ?? 30),
      learnerPath: String(formData.get("learnerPath") ?? ""),
      ...(captchaToken ? { captchaToken } : {}),
    };

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : t("pages.signup.errorGeneric"));
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
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="nn-btn-primary w-full px-4 py-3 text-base font-semibold" type="submit">
        {t("pages.signup.createAccount")}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href={loginAfterSignupHref} className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("pages.signup.alreadyHaveAccount")}
        </Link>
      </p>
    </form>
  );
}
