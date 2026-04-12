"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CountryCode, TierCode } from "@prisma/client";
import type { PersonalProfilePayload } from "@/lib/learner/load-personal-profile";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

const TIERS: TierCode[] = [TierCode.PRE_NURSING, TierCode.NEW_GRAD, TierCode.RPN, TierCode.LVN_LPN, TierCode.RN, TierCode.NP, TierCode.ALLIED];
const COUNTRIES: CountryCode[] = [CountryCode.CA, CountryCode.US];

const TIER_I18N_KEY: Record<TierCode, string> = {
  [TierCode.PRE_NURSING]: "learner.personalPage.tierPRE_NURSING",
  [TierCode.NEW_GRAD]: "learner.personalPage.tierNEW_GRAD",
  [TierCode.RPN]: "learner.personalPage.tierRPN",
  [TierCode.LVN_LPN]: "learner.personalPage.tierLVN_LPN",
  [TierCode.RN]: "learner.personalPage.tierRN",
  [TierCode.NP]: "learner.personalPage.tierNP",
  [TierCode.ALLIED]: "learner.personalPage.tierALLIED",
};

function pathwayLabelFromId(id: string | null, options: PersonalProfilePayload["pathwayOptions"]): string | null {
  if (!id?.trim()) return null;
  const hit = options.find((o) => o.id === id.trim());
  if (hit) return hit.label;
  const p = getExamPathwayById(id.trim());
  return p ? p.shortName || p.displayName : id;
}

type ServerRegionSnapshot = Pick<PersonalProfilePayload, "country" | "tier" | "pathwayOptions">;

export function LearnerPersonalInfoForm({
  initial,
  t,
  localeTag,
}: {
  initial: PersonalProfilePayload;
  t: LearnerMarketingT;
  localeTag: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [displayName, setDisplayName] = useState(initial.displayName ?? "");
  const [country, setCountry] = useState<CountryCode>(initial.country);
  const [tier, setTier] = useState<TierCode>(initial.tier);
  const [learnerPath, setLearnerPath] = useState(initial.learnerPath ?? "");
  const [studyGoal, setStudyGoal] = useState(initial.studyGoal ?? "");
  const [dailyQuestionGoal, setDailyQuestionGoal] = useState(
    initial.dailyQuestionGoal != null ? String(initial.dailyQuestionGoal) : "",
  );
  const [examFocus, setExamFocus] = useState(initial.examFocus ?? "");
  const [pathwayOptions, setPathwayOptions] = useState(initial.pathwayOptions);
  const [lastServerRegion, setLastServerRegion] = useState<ServerRegionSnapshot>(() => ({
    country: initial.country,
    tier: initial.tier,
    pathwayOptions: initial.pathwayOptions,
  }));
  const regionTierLocked = initial.regionTierLocked;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const previewAbortRef = useRef<AbortController | null>(null);

  const applyProfile = useCallback((p: PersonalProfilePayload) => {
    setName(p.name);
    setFirstName(p.firstName ?? "");
    setLastName(p.lastName ?? "");
    setDisplayName(p.displayName ?? "");
    setCountry(p.country);
    setTier(p.tier);
    setLearnerPath(p.learnerPath ?? "");
    setStudyGoal(p.studyGoal ?? "");
    setDailyQuestionGoal(p.dailyQuestionGoal != null ? String(p.dailyQuestionGoal) : "");
    setExamFocus(p.examFocus ?? "");
    setPathwayOptions(p.pathwayOptions);
    setLastServerRegion({
      country: p.country,
      tier: p.tier,
      pathwayOptions: p.pathwayOptions,
    });
  }, []);

  useEffect(() => {
    if (regionTierLocked) return;
    const matchesServer = country === lastServerRegion.country && tier === lastServerRegion.tier;
    if (matchesServer) {
      setPathwayOptions(lastServerRegion.pathwayOptions);
      return;
    }

    previewAbortRef.current?.abort();
    const ac = new AbortController();
    previewAbortRef.current = ac;

    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          const qs = new URLSearchParams({ country, tier });
          const res = await fetch(`/api/learner/personal-profile?${qs.toString()}`, { signal: ac.signal });
          const data = (await res.json()) as PersonalProfilePayload & { error?: string };
          if (!res.ok) return;
          if (ac.signal.aborted) return;
          setPathwayOptions(data.pathwayOptions);
          setLearnerPath((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return "";
            return data.pathwayOptions.some((o) => o.id === trimmed) ? prev : "";
          });
        } catch (e) {
          if ((e as Error).name === "AbortError") return;
        }
      })();
    }, 280);

    return () => {
      window.clearTimeout(handle);
      ac.abort();
    };
  }, [country, tier, regionTierLocked, lastServerRegion]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    const qGoalRaw = dailyQuestionGoal.trim();
    let dailyQuestionGoalPayload: number | null;
    if (!qGoalRaw) {
      dailyQuestionGoalPayload = null;
    } else {
      const n = Number.parseInt(qGoalRaw, 10);
      if (!Number.isFinite(n) || n < 5 || n > 120) {
        setError(t("learner.personalPage.dailyQuestionGoalInvalid"));
        setBusy(false);
        return;
      }
      dailyQuestionGoalPayload = n;
    }
    try {
      const res = await fetch("/api/learner/personal-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || name.trim(),
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
          displayName: displayName.trim() || null,
          ...(!regionTierLocked ? { country, tier } : {}),
          learnerPath: learnerPath.trim() ? learnerPath.trim() : null,
          studyGoal: studyGoal.trim() ? studyGoal.trim() : null,
          examFocus: examFocus.trim() ? examFocus.trim() : null,
          dailyQuestionGoal: dailyQuestionGoalPayload,
        }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string; profile?: PersonalProfilePayload };
      if (!res.ok) {
        setError(typeof j.error === "string" ? j.error : t("learner.personalPage.saveError"));
        setBusy(false);
        return;
      }
      if (j.profile) applyProfile(j.profile);
      setSaved(true);
      router.refresh();
    } catch {
      setError(t("learner.personalPage.saveError"));
    } finally {
      setBusy(false);
    }
  }

  const examDateYmd = initial.examDate ? initial.examDate.slice(0, 10) : null;
  const targetLabel = pathwayLabelFromId(initial.targetExamPathwayId, pathwayOptions);

  return (
    <div className="space-y-8">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
        <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
          <div className="border-b border-[var(--semantic-border-soft)] bg-gradient-to-r from-primary/[0.05] to-transparent px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.personalPage.section.identity")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.personalPage.section.identitySub")}</p>
          </div>
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pi-first-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  First Name
                </label>
                <input
                  id="pi-first-name"
                  name="firstName"
                  autoComplete="given-name"
                  maxLength={100}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="pi-last-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Name
                </label>
                <input
                  id="pi-last-name"
                  name="lastName"
                  autoComplete="family-name"
                  maxLength={100}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="pi-display-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Display Name
              </label>
              <input
                id="pi-display-name"
                name="displayName"
                autoComplete="nickname"
                maxLength={200}
                placeholder={firstName.trim() || name.split(" ")[0] || ""}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full max-w-lg rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Optional. If left blank, your first name will be used.
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.profile.label.email")}</span>
              <p className="mt-1 break-all text-sm font-medium text-foreground">{initial.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t("learner.personalPage.emailReadOnly")}</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
          <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.personalPage.section.region")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.personalPage.section.regionSub")}</p>
          </div>
          <div className="space-y-4 p-5">
            {regionTierLocked ? (
              <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-warning-soft)] px-3 py-2 text-sm text-[var(--semantic-warning-contrast)]">
                {t("learner.personalPage.regionLocked")}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="pi-country" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("learner.personalPage.country")}
                </label>
                <select
                  id="pi-country"
                  disabled={regionTierLocked}
                  value={country}
                  onChange={(e) => setCountry(e.target.value as CountryCode)}
                  className="mt-1 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c === CountryCode.CA ? t("learner.personalPage.countryCA") : t("learner.personalPage.countryUS")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="pi-tier" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("learner.personalPage.tier")}
                </label>
                <select
                  id="pi-tier"
                  disabled={regionTierLocked}
                  value={tier}
                  onChange={(e) => setTier(e.target.value as TierCode)}
                  className="mt-1 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {TIERS.map((tc) => (
                    <option key={tc} value={tc}>
                      {t(TIER_I18N_KEY[tc])}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!regionTierLocked ? (
              <p className="text-xs text-muted-foreground">{t("learner.personalPage.regionHint")}</p>
            ) : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
          <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.personalPage.section.pathway")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.personalPage.section.pathwaySub")}</p>
          </div>
          <div className="p-5">
            <label htmlFor="pi-path" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.personalPage.learnerPath")}
            </label>
            <select
              id="pi-path"
              value={learnerPath}
              onChange={(e) => setLearnerPath(e.target.value)}
              className="mt-1 w-full max-w-lg rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
            >
              <option value="">{t("learner.personalPage.pathwayUnset")}</option>
              {pathwayOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">{t("learner.personalPage.pathwayHint")}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
          <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.personalPage.section.study")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.personalPage.section.studySub")}</p>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <label htmlFor="pi-focus" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("learner.personalPage.examFocus")}
              </label>
              <input
                id="pi-focus"
                maxLength={240}
                value={examFocus}
                onChange={(e) => setExamFocus(e.target.value)}
                className="mt-1 w-full max-w-lg rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="pi-daily-q" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("learner.personalPage.dailyQuestionGoal")}
              </label>
              <input
                id="pi-daily-q"
                name="dailyQuestionGoal"
                type="number"
                inputMode="numeric"
                min={5}
                max={120}
                placeholder="20"
                value={dailyQuestionGoal}
                onChange={(e) => setDailyQuestionGoal(e.target.value)}
                className="mt-1 w-full max-w-xs rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm tabular-nums"
              />
              <p className="mt-2 text-xs text-muted-foreground">{t("learner.personalPage.dailyQuestionGoalHint")}</p>
            </div>
            <div>
              <label htmlFor="pi-goal" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("learner.personalPage.studyGoal")}
              </label>
              <textarea
                id="pi-goal"
                rows={4}
                maxLength={2000}
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                className="mt-1 w-full max-w-2xl rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]">
          <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4">
            <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.personalPage.section.examPlan")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.personalPage.section.examPlanSub")}</p>
          </div>
          <dl className="grid gap-3 p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.personalPage.examPlanType")}</dt>
              <dd className="mt-1 font-medium text-foreground">
                {initial.examDatePlanType ? initial.examDatePlanType : t("learner.common.notAvailable")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.personalPage.examDate")}</dt>
              <dd className="mt-1 font-medium text-foreground">
                {examDateYmd
                  ? new Date(initial.examDate!).toLocaleDateString(localeTag, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : t("learner.common.notAvailable")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.personalPage.targetPathway")}</dt>
              <dd className="mt-1 font-medium text-foreground">{targetLabel ?? t("learner.common.notAvailable")}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("learner.personalPage.cadence")}</dt>
              <dd className="mt-1 font-medium text-foreground">
                {initial.studyCadencePreference?.trim() ? initial.studyCadencePreference : t("learner.common.notAvailable")}
              </dd>
            </div>
          </dl>
          <div className="border-t border-[var(--semantic-border-soft)] px-5 py-4">
            <Link href="/app/account/study-preferences" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.personalPage.editExamPlan")}
            </Link>
          </div>
        </section>

        {error ? (
          <p className="text-sm text-[var(--semantic-danger-contrast)]" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="text-sm text-role-success" role="status">
            {t("learner.personalPage.saved")}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex rounded-full bg-role-cta px-5 py-3 text-sm font-semibold text-role-cta-foreground disabled:opacity-50"
          >
            {busy ? t("learner.personalPage.saving") : t("learner.personalPage.save")}
          </button>
        </div>
      </form>

      {initial.entitlementVerifyFailed ? (
        <p className="text-sm text-[var(--semantic-warning-contrast)]">{t("learner.personalPage.entitlementWarning")}</p>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.account.personal.securityHeading")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.account.personal.securityBody")}</p>
        </div>
        <div className="p-5">
          <Link
            href="/app/account/security"
            className="inline-flex rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft"
          >
            {t("learner.account.nav.security")}
          </Link>
        </div>
      </section>

      <p className="text-sm text-muted-foreground">{t("learner.account.personal.supportHint")}</p>
      <Link href="/contact" className="inline-flex text-sm font-semibold text-primary underline underline-offset-2">
        {t("learner.account.personal.contactLink")}
      </Link>
    </div>
  );
}
