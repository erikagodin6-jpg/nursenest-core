"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";
import {
  ADMIN_LEARNER_QA_MOBILE_FLOW_LINKS,
  ADMIN_LEARNER_QA_MOBILE_VIEWPORT_PRESETS,
  adminLearnerQaMobilePreviewHref,
} from "@/lib/admin/admin-learner-qa-mobile-preview";

const DEFAULT_MOBILE_QA_WIDTH = 390;

const TRACKS = ["RN", "RPN", "LVN_LPN", "NP", "ALLIED", "NEW_GRAD"] as const;
const LIFECYCLES = ["paid_active", "none", "expired", "trial"] as const;
const NP_SPECIALTIES = ["FNP", "AGPCNP", "PMHNP", "WHNP", "PNP_PC"] as const;
const ALLIED_CAREERS = ["paramedic", "rrt", "mlt", "imaging", "ota_pta", "pharmtech", "socialwork"] as const;
const PLAN_VARIANTS = ["monthly", "6-month", "yearly"] as const;

type Track = (typeof TRACKS)[number];
type NpSpec = (typeof NP_SPECIALTIES)[number];
type Allied = (typeof ALLIED_CAREERS)[number];
type PlanV = (typeof PLAN_VARIANTS)[number];

async function postSimulate(body: Record<string, unknown>) {
  return fetch("/api/admin/learner-qa/simulate", {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function withIntent(body: Record<string, unknown>, mode: "execute" | "preview") {
  return mode === "preview" ? { ...body, dryRun: true } : { ...body, confirm: true };
}

export function AdminLearnerQaPanel({ initialState }: { initialState: AdminLearnerQaPublicState | null }) {
  const router = useRouter();
  const [track, setTrack] = useState<Track>("RN");
  const [lifecycle, setLifecycle] = useState<(typeof LIFECYCLES)[number]>("paid_active");
  const [country, setCountry] = useState<"US" | "CA">("US");
  const [npSpecialty, setNpSpecialty] = useState<NpSpec>("FNP");
  const [alliedCareer, setAlliedCareer] = useState<Allied>("paramedic");
  const [planVariant, setPlanVariant] = useState<PlanV | "">("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [previewHint, setPreviewHint] = useState<string | null>(null);
  const [active, setActive] = useState<AdminLearnerQaPublicState | null>(initialState);

  useEffect(() => {
    setActive(initialState);
    setPreviewHint(null);
  }, [initialState]);

  function buildBody(): Record<string, unknown> {
    const b: Record<string, unknown> = { track, lifecycle, country };
    if (track === "NP") b.npSpecialty = npSpecialty;
    if (track === "ALLIED") b.alliedCareer = alliedCareer;
    if (planVariant) b.planVariant = planVariant;
    return b;
  }

  async function applySimulate(opts?: { goToApp?: boolean; preview?: boolean }) {
    setErr(null);
    setPreviewHint(null);
    setBusy(true);
    try {
      const res = await postSimulate(withIntent(buildBody(), opts?.preview ? "preview" : "execute"));
      const j = (await res.json()) as {
        ok?: boolean;
        dryRun?: boolean;
        state?: AdminLearnerQaPublicState;
        error?: string;
        hint?: string;
      };
      if (!res.ok) {
        setErr(j.hint ? `${j.error ?? "Failed"} — ${j.hint}` : (j.error ?? `HTTP ${res.status}`));
        return;
      }
      if (opts?.preview) {
        setPreviewHint(j.state?.bannerTitle ? `Preview only (no cookie): ${j.state.bannerTitle}` : "Preview only — no cookie written.");
        return;
      }
      if (j.state) setActive(j.state);
      if (opts?.goToApp) router.push("/app");
      else router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/learner-qa/clear", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) {
        setErr("Could not clear QA mode");
        return;
      }
      setActive(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function applyPreset(p: {
    track: Track;
    lifecycle: (typeof LIFECYCLES)[number];
    country: "US" | "CA";
    npSpecialty?: NpSpec;
    alliedCareer?: Allied;
    planVariant?: PlanV;
  }) {
    setTrack(p.track);
    setLifecycle(p.lifecycle);
    setCountry(p.country);
    if (p.npSpecialty) setNpSpecialty(p.npSpecialty);
    if (p.alliedCareer) setAlliedCareer(p.alliedCareer);
    setPlanVariant(p.planVariant ?? "");
    setErr(null);
    setPreviewHint(null);
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        track: p.track,
        lifecycle: p.lifecycle,
        country: p.country,
      };
      if (p.track === "NP" && p.npSpecialty) body.npSpecialty = p.npSpecialty;
      if (p.track === "ALLIED" && p.alliedCareer) body.alliedCareer = p.alliedCareer;
      if (p.planVariant) body.planVariant = p.planVariant;
      const res = await postSimulate(withIntent(body, "execute"));
      const j = (await res.json()) as { ok?: boolean; state?: AdminLearnerQaPublicState; error?: string; hint?: string };
      if (!res.ok) {
        setErr(j.hint ? `${j.error ?? "Failed"} — ${j.hint}` : (j.error ?? `HTTP ${res.status}`));
        return;
      }
      if (j.state) setActive(j.state);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · QA</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">View site as learner</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Simulates subscription and pathway context for <strong>your signed-in staff account</strong> only. Uses a signed,
          short-lived cookie — no Stripe or subscription rows are modified. Entitlements flow through{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">getUserAccess</code> like real learners. PostHog capture is
          suppressed while QA mode is active.
        </p>
      </div>

      {active ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] p-4 text-sm"
          role="status"
        >
          <p className="font-semibold text-[var(--semantic-text-primary)]">QA mode is active in this browser</p>
          <p className="mt-1 text-muted-foreground">{active.bannerTitle}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void clear()}
            className="mt-3 rounded-lg border border-border bg-[var(--semantic-surface)] px-3 py-2 text-sm font-semibold hover:bg-muted/40 disabled:opacity-50"
          >
            {busy ? "…" : "Clear QA cookie (restore normal admin)"}
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Quick presets</h2>
        <p className="mt-1 text-xs text-muted-foreground">One click sets the cookie and refreshes this page so you can chain scenarios quickly.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <PresetBtn busy={busy} label="US RN · no sub" onClick={() => void applyPreset({ track: "RN", lifecycle: "none", country: "US" })} />
          <PresetBtn busy={busy} label="CA RN · trial" onClick={() => void applyPreset({ track: "RN", lifecycle: "trial", country: "CA" })} />
          <PresetBtn busy={busy} label="US RN · paid" onClick={() => void applyPreset({ track: "RN", lifecycle: "paid_active", country: "US", planVariant: "yearly" })} />
          <PresetBtn busy={busy} label="US RN · expired" onClick={() => void applyPreset({ track: "RN", lifecycle: "expired", country: "US" })} />
          <PresetBtn busy={busy} label="NP WHNP · paid" onClick={() => void applyPreset({ track: "NP", lifecycle: "paid_active", country: "US", npSpecialty: "WHNP", planVariant: "6-month" })} />
          <PresetBtn busy={busy} label="Allied RRT · CA" onClick={() => void applyPreset({ track: "ALLIED", lifecycle: "paid_active", country: "CA", alliedCareer: "rrt" })} />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Simulation</h2>
        {previewHint ? (
          <p className="mt-2 text-sm text-[var(--semantic-info)]" role="status">
            {previewHint}
          </p>
        ) : null}
        {err ? <p className="mt-2 text-sm text-rose-700">{err}</p> : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-foreground">Pathway / tier</span>
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={track}
              onChange={(e) => setTrack(e.target.value as Track)}
            >
              {TRACKS.map((t) => (
                <option key={t} value={t}>
                  {t === "LVN_LPN" ? "LVN/LPN" : t === "NEW_GRAD" ? "New Grad" : t === "ALLIED" ? "Allied" : t}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-foreground">Subscription state</span>
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={lifecycle}
              onChange={(e) => setLifecycle(e.target.value as (typeof LIFECYCLES)[number])}
            >
              <option value="paid_active">Paid (active)</option>
              <option value="trial">Trial</option>
              <option value="none">No subscription</option>
              <option value="expired">Expired</option>
            </select>
          </label>
          {track === "NP" ? (
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-foreground">NP specialization</span>
              <select
                className="mt-1 w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={npSpecialty}
                onChange={(e) => setNpSpecialty(e.target.value as NpSpec)}
              >
                {NP_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, "/")}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {track === "ALLIED" ? (
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-foreground">Allied career (plan scope)</span>
              <select
                className="mt-1 w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={alliedCareer}
                onChange={(e) => setAlliedCareer(e.target.value as Allied)}
              >
                {ALLIED_CAREERS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="block text-sm">
            <span className="font-medium text-foreground">Country / region</span>
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value as "US" | "CA")}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-foreground">Plan cadence (optional)</span>
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={planVariant}
              onChange={(e) => setPlanVariant((e.target.value || "") as PlanV | "")}
            >
              <option value="">Default for lifecycle</option>
              {PLAN_VARIANTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void applySimulate({ preview: true })}
            className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted/40 disabled:opacity-50"
          >
            {busy ? "…" : "Preview (no cookie write)"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void applySimulate({ goToApp: true })}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
          >
            {busy ? "…" : "Start — go to /app"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void applySimulate({ goToApp: false })}
            className="rounded-lg border border-border bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold hover:bg-muted/40 disabled:opacity-50"
          >
            {busy ? "…" : "Apply — stay on this page"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Mobile viewport QA</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Admin-only page with a <strong>fixed-width iframe</strong> — same browser cookies, so learner simulation stays
          on. This is a layout spot-check, not a device emulator. Learner routes are unchanged.
        </p>
        <p className="mt-3">
          <Link
            className="text-sm font-semibold text-primary underline"
            href={adminLearnerQaMobilePreviewHref("/app", DEFAULT_MOBILE_QA_WIDTH)}
          >
            Open mobile QA workspace →
          </Link>
        </p>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Quick launch ({DEFAULT_MOBILE_QA_WIDTH}px frame)</h3>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
          {ADMIN_LEARNER_QA_MOBILE_FLOW_LINKS.map((l) => (
            <li key={l.path}>
              <Link
                className="text-primary underline"
                href={adminLearnerQaMobilePreviewHref(l.path, DEFAULT_MOBILE_QA_WIDTH)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mt-4 text-sm font-semibold text-foreground">Viewport widths (study home)</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {ADMIN_LEARNER_QA_MOBILE_VIEWPORT_PRESETS.map((p) => (
            <Link
              key={p.id}
              href={adminLearnerQaMobilePreviewHref("/app", p.widthPx)}
              className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted/50 sm:text-sm"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Full-width shortcuts (same tab)</p>
        <p className="mt-1 text-xs">Use after starting QA — no iframe; normal desktop layout.</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <Link className="text-primary underline" href="/app/lessons">
              Lessons
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/app/flashcards">
              Flashcards
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/app/practice-tests">
              Practice tests
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/app/practice-tests/cat-launch">
              CAT launch
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/app/account/billing">
              Billing / paywall surfaces
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function PresetBtn({
  label,
  onClick,
  busy,
}: {
  label: string;
  onClick: () => void;
  busy: boolean;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted/50 disabled:opacity-50 sm:text-sm"
    >
      {label}
    </button>
  );
}
