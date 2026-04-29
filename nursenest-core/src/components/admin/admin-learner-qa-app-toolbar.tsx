"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";
import { adminLearnerQaMobilePreviewHref } from "@/lib/admin/admin-learner-qa-mobile-preview";

const TRACKS = ["RN", "RPN", "LVN_LPN", "NP", "ALLIED", "NEW_GRAD", "PRE_NURSING"] as const;
const LIFECYCLES = ["paid_active", "none", "expired", "trial"] as const;
const NP_SPECIALTIES = ["FNP", "AGPCNP", "PMHNP", "WHNP", "PNP_PC"] as const;
const ALLIED_CAREERS = ["paramedic", "rrt", "mlt", "imaging", "ota_pta", "pharmtech", "socialwork"] as const;

type Track = (typeof TRACKS)[number];
type NpSpec = (typeof NP_SPECIALTIES)[number];
type Allied = (typeof ALLIED_CAREERS)[number];

const MOBILE_W = 390;

function trackLabel(t: Track): string {
  if (t === "LVN_LPN") return "LVN/LPN";
  if (t === "NEW_GRAD") return "New Grad";
  if (t === "PRE_NURSING") return "Pre-Nursing";
  if (t === "ALLIED") return "Allied";
  return t;
}

export function AdminLearnerQaAppToolbar(props: {
  bannerTitle: string;
  initialPublicState: AdminLearnerQaPublicState;
}) {
  const { bannerTitle, initialPublicState } = props;
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [state, setState] = useState(initialPublicState);
  const [track, setTrack] = useState<Track>(initialPublicState.track);
  const [lifecycle, setLifecycle] = useState<(typeof LIFECYCLES)[number]>(initialPublicState.lifecycle);
  const [country, setCountry] = useState<"US" | "CA">(initialPublicState.country);
  const [npSpecialty, setNpSpecialty] = useState<NpSpec>(initialPublicState.npSpecialty ?? "FNP");
  const [alliedCareer, setAlliedCareer] = useState<Allied>((initialPublicState.alliedCareer as Allied) ?? "paramedic");

  useEffect(() => {
    setState(initialPublicState);
    setTrack(initialPublicState.track);
    setLifecycle(initialPublicState.lifecycle);
    setCountry(initialPublicState.country);
    if (initialPublicState.npSpecialty) setNpSpecialty(initialPublicState.npSpecialty);
    if (initialPublicState.alliedCareer) setAlliedCareer(initialPublicState.alliedCareer as Allied);
  }, [initialPublicState]);

  function buildBody(): Record<string, unknown> {
    const b: Record<string, unknown> = { track, lifecycle, country };
    if (track === "NP") b.npSpecialty = npSpecialty;
    if (track === "ALLIED") b.alliedCareer = alliedCareer;
    return b;
  }

  async function apply() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/learner-qa/simulate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildBody(), confirm: true }),
      });
      const j = (await res.json()) as {
        ok?: boolean;
        state?: AdminLearnerQaPublicState;
        error?: string;
        hint?: string;
      };
      if (!res.ok) {
        setErr(j.hint ? `${j.error ?? "Failed"} - ${j.hint}` : (j.error ?? `HTTP ${res.status}`));
        return;
      }
      if (j.state) setState(j.state);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function exit() {
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
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setErr(j.error ?? `Exit failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const learnerPath = pathname.startsWith("/app") ? pathname : "/app";
  const mobileHref = adminLearnerQaMobilePreviewHref(learnerPath, MOBILE_W);

  return (
    <div
      role="region"
      aria-label="View as learner (admin simulation)"
      data-testid="admin-view-as-toolbar"
      className="mb-2 space-y-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-3 py-2.5 text-sm text-[var(--semantic-text-primary)] shadow-sm sm:px-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="nn-badge-semantic-warning mr-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            View as learner
          </span>
          <p className="mt-1 font-semibold leading-snug">{bannerTitle}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Simulated: <strong>{trackLabel(state.track)}</strong> · {state.lifecycle.replace(/_/g, " ")} · {state.country}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void exit()}
          disabled={busy}
          className="shrink-0 rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--surface-interactive-hover)] disabled:opacity-50"
        >
          {busy ? "…" : "Exit simulation"}
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-2 border-t border-[color-mix(in_srgb,var(--semantic-warning)_22%,transparent)] pt-2">
        <label className="flex min-w-[8.5rem] flex-col gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Track
          <select
            className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 text-xs font-medium text-[var(--semantic-text-primary)]"
            value={track}
            onChange={(e) => setTrack(e.target.value as Track)}
          >
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {trackLabel(t)}
              </option>
            ))}
          </select>
        </label>
        {track === "NP" ? (
          <label className="flex min-w-[7rem] flex-col gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            NP spec
            <select
              className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 text-xs font-medium"
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
          <label className="flex min-w-[9rem] flex-col gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Allied role
            <select
              className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 text-xs font-medium"
              value={alliedCareer}
              onChange={(e) => setAlliedCareer(e.target.value as Allied)}
            >
              {ALLIED_CAREERS.map((a) => (
                <option key={a} value={a}>
                  {a.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="flex min-w-[7.5rem] flex-col gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Access
          <select
            className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 text-xs font-medium"
            value={lifecycle}
            onChange={(e) => setLifecycle(e.target.value as (typeof LIFECYCLES)[number])}
          >
            <option value="paid_active">Paid active</option>
            <option value="trial">Trial</option>
            <option value="none">Free / no sub</option>
            <option value="expired">Expired</option>
          </select>
        </label>
        <label className="flex min-w-[5rem] flex-col gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Region
          <select
            className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5 text-xs font-medium"
            value={country}
            onChange={(e) => setCountry(e.target.value as "US" | "CA")}
          >
            <option value="US">US</option>
            <option value="CA">CA</option>
          </select>
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void apply()}
          className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "…" : "Apply"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        <Link className="font-semibold text-primary underline" href="/admin/learner-qa">
          Full presets and tools
        </Link>
        {" · "}
        <Link className="font-semibold text-primary underline" href={mobileHref}>
          Mobile frame ({MOBILE_W}px)
        </Link>
      </p>
      {err ? <p className="text-xs text-[var(--semantic-danger)]">{err}</p> : null}
    </div>
  );
}
