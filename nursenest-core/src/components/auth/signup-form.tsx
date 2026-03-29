"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { TurnstileSignup } from "@/components/auth/turnstile-signup";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const onCaptcha = useCallback((t: string | null) => setCaptchaToken(t), []);

  async function onSubmit(formData: FormData) {
    setError(null);
    trackClientEvent(PH.signupSubmitAttempt, {});
    const payload = {
      name: String(formData.get("name") ?? ""),
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      country: String(formData.get("country") ?? "CA"),
      tier: String(formData.get("tier") ?? "RN"),
      examFocus: String(formData.get("examFocus") ?? ""),
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
        <select className="rounded-xl border border-border bg-white px-3 py-2" name="country" defaultValue="CA">
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
          <select className="rounded-lg border border-border px-3 py-2 text-sm" name="examFocus" defaultValue="nclex_rn">
            <option value="nclex_rn">NCLEX-RN / RN readiness</option>
            <option value="nclex_pn">NCLEX-PN / PN readiness</option>
            <option value="rex_pn">REx-PN</option>
            <option value="np_board">NP exam</option>
            <option value="allied_cert">Allied certification</option>
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2 font-semibold" type="submit">
        Create account
      </button>
    </form>
  );
}
