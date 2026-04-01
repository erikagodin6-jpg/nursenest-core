"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TurnstileSignup } from "@/components/auth/turnstile-signup";
import {
  reconcileExamFocusForCountry,
  signupExamFocusOptions,
  type SignupExamFocusValue,
} from "@/lib/marketing/signup-exam-focus-options";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function SignupForm({
  termsHref = "/terms",
  privacyHref = "/privacy",
  legalBefore = "By creating an account, you agree to our ",
  legalAnd = " and ",
  legalAfter = ".",
  termsLabel = "Terms of Service",
  privacyLabel = "Privacy Policy",
}: {
  termsHref?: string;
  privacyHref?: string;
  legalBefore?: string;
  legalAnd?: string;
  legalAfter?: string;
  termsLabel?: string;
  privacyLabel?: string;
} = {}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [examFocus, setExamFocus] = useState<SignupExamFocusValue>("nclex_rn");
  const onCaptcha = useCallback((t: string | null) => setCaptchaToken(t), []);

  async function onSubmit(formData: FormData) {
    setError(null);
    trackClientEvent(PH.signupSubmitAttempt, {});
    const payload = {
      name: String(formData.get("name") ?? ""),
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
      setError(typeof data.error === "string" ? data.error : "Unable to create account. Please check your details.");
      return;
    }
    trackClientEvent(PH.signupSuccessClient, {});
    router.push("/login");
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      <input className="w-full rounded-xl border border-border bg-white px-3 py-2" type="text" name="name" placeholder="Full name" required />
      <input
        className="w-full rounded-xl border border-border bg-white px-3 py-2"
        type="text"
        name="username"
        placeholder="Username (3–30 characters)"
        required
        autoComplete="username"
      />
      <input className="w-full rounded-xl border border-border bg-white px-3 py-2" type="email" name="email" placeholder="Email" required />
      <input className="w-full rounded-xl border border-border bg-white px-3 py-2" type="password" name="password" placeholder="Password (8+ chars)" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          className="rounded-xl border border-border bg-white px-3 py-2"
          name="country"
          value={country}
          onChange={(e) => {
            const next = e.target.value === "US" ? "US" : "CA";
            setCountry(next);
            setExamFocus((prev) => reconcileExamFocusForCountry(next, prev));
          }}
        >
          <option value="CA">Canada</option>
          <option value="US">United States</option>
        </select>
        <select className="rounded-xl border border-border bg-white px-3 py-2" name="tier" defaultValue="RN">
          <option value="RPN">RPN / Practical nursing (CA)</option>
          <option value="LVN_LPN">LVN/LPN (US)</option>
          <option value="RN">RN</option>
          <option value="NP">NP / Advanced practice</option>
          <option value="ALLIED">Allied health</option>
        </select>
      </div>
      <div className="rounded-xl border border-border bg-white/80 p-4">
        <p className="text-sm font-semibold">Quick onboarding (improves recommendations)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select className="rounded-lg border border-border px-3 py-2 text-sm" name="learnerPath" defaultValue="experienced">
            <option value="new_grad">New grad</option>
            <option value="experienced">Working clinician</option>
            <option value="career_change">Career change</option>
          </select>
          <select
            className="rounded-lg border border-border px-3 py-2 text-sm"
            name="examFocus"
            value={examFocus}
            onChange={(e) => setExamFocus(e.target.value as SignupExamFocusValue)}
          >
            {signupExamFocusOptions(country).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select className="rounded-lg border border-border px-3 py-2 text-sm" name="studyGoal" defaultValue="pass_first">
            <option value="pass_first">Pass on first attempt</option>
            <option value="raise_score">Raise practice scores</option>
            <option value="speed">Improve speed under pressure</option>
          </select>
          <select className="rounded-lg border border-border px-3 py-2 text-sm" name="dailyStudyMinutes" defaultValue="30">
            <option value="15">~15 min / day</option>
            <option value="30">~30 min / day</option>
            <option value="45">~45 min / day</option>
            <option value="60">60+ min / day</option>
          </select>
        </div>
      </div>
      <TurnstileSignup onToken={onCaptcha} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        {legalBefore}
        <Link href={termsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
          {termsLabel}
        </Link>
        {legalAnd}
        <Link href={privacyHref} className="font-semibold text-primary underline-offset-4 hover:underline">
          {privacyLabel}
        </Link>
        {legalAfter}
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2 font-semibold" type="submit">
        Create account
      </button>
    </form>
  );
}
