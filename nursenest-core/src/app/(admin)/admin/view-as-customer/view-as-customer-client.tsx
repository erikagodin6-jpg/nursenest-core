"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";

// ── User-type persona definitions ─────────────────────────────────────────────

export type ViewAsPersona = {
  id: string;
  label: string;
  badge: string;
  description: string;
  accessSummary: string;
  track: "RN" | "RPN" | "LVN_LPN" | "NP" | "ALLIED" | "NEW_GRAD" | "PRE_NURSING";
  lifecycle: "paid_active" | "none" | "expired" | "trial";
  country: "US" | "CA";
  npSpecialty?: "FNP" | "AGPCNP" | "PMHNP" | "WHNP" | "PNP_PC";
  alliedCareer?: string;
  icon: string;
  badgeColor: "gray" | "blue" | "green" | "red" | "purple" | "teal" | "orange" | "indigo";
};

const PERSONAS: ViewAsPersona[] = [
  {
    id: "free-user",
    label: "Free User",
    badge: "No subscription",
    description: "Visitor with an account but no active subscription or trial.",
    accessSummary: "Paywalled content, upgrade prompts, limited previews only.",
    track: "RN",
    lifecycle: "none",
    country: "US",
    icon: "🔒",
    badgeColor: "gray",
  },
  {
    id: "trial-user",
    label: "Trial User",
    badge: "Active trial",
    description: "New user in a free trial period with limited-time full access.",
    accessSummary: "Full access, trial countdown visible, upgrade CTAs shown.",
    track: "RN",
    lifecycle: "trial",
    country: "US",
    icon: "⏳",
    badgeColor: "orange",
  },
  {
    id: "active-subscriber",
    label: "Active Subscriber",
    badge: "Paid · Active",
    description: "Fully paid subscriber with an active subscription.",
    accessSummary: "All lessons, flashcards, CAT exams, practice tests, study plans.",
    track: "RN",
    lifecycle: "paid_active",
    country: "US",
    icon: "✅",
    badgeColor: "green",
  },
  {
    id: "expired-subscriber",
    label: "Expired Subscriber",
    badge: "Subscription expired",
    description: "Previously active subscriber whose plan has lapsed.",
    accessSummary: "Renewal prompts, paywalls re-engaged, history visible.",
    track: "RN",
    lifecycle: "expired",
    country: "US",
    icon: "⚠️",
    badgeColor: "red",
  },
  {
    id: "rn-user",
    label: "RN User",
    badge: "NCLEX-RN · CA",
    description: "Canadian registered nurse preparing for the NCLEX-RN exam.",
    accessSummary: "RN-specific content, Canadian scope, full subscriber access.",
    track: "RN",
    lifecycle: "paid_active",
    country: "CA",
    icon: "🍁",
    badgeColor: "blue",
  },
  {
    id: "rpn-user",
    label: "RPN User",
    badge: "REx-PN · CA",
    description: "Canadian registered practical nurse preparing for REx-PN.",
    accessSummary: "RPN pathway content, Canadian PN scope, full subscriber access.",
    track: "RPN",
    lifecycle: "paid_active",
    country: "CA",
    icon: "🇨🇦",
    badgeColor: "teal",
  },
  {
    id: "np-user",
    label: "NP User",
    badge: "NP · FNP",
    description: "US nurse practitioner preparing for the FNP board exam.",
    accessSummary: "NP-level content, advanced pharmacology, prescribing topics.",
    track: "NP",
    lifecycle: "paid_active",
    country: "US",
    npSpecialty: "FNP",
    icon: "🩺",
    badgeColor: "purple",
  },
  {
    id: "allied-user",
    label: "Allied User",
    badge: "Allied · Paramedic",
    description: "Allied health professional (paramedic) with a paid subscription.",
    accessSummary: "Allied-scope content, limited nursing scope, career-specific pathways.",
    track: "ALLIED",
    lifecycle: "paid_active",
    country: "US",
    alliedCareer: "paramedic",
    icon: "🚑",
    badgeColor: "indigo",
  },
];

const BADGE_STYLES: Record<ViewAsPersona["badgeColor"], string> = {
  gray: "bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)]",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
};

// ── Verification checklist ────────────────────────────────────────────────────

const VERIFICATION_SURFACES = [
  { label: "Lesson hub & content", href: "/app/lessons" },
  { label: "Flashcard hub & study", href: "/app/flashcards" },
  { label: "Practice test", href: "/app/practice-tests" },
  { label: "CAT exam", href: "/app/cat" },
  { label: "Dashboard", href: "/app" },
  { label: "Study plan", href: "/app/study-plan" },
  { label: "Weak areas", href: "/app/weak-areas" },
  { label: "Account & billing", href: "/app/account" },
];

// ── Client component ──────────────────────────────────────────────────────────

type Props = {
  activeState: AdminLearnerQaPublicState | null;
};

export function ViewAsCustomerClient({ activeState }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(
    activeState
      ? (PERSONAS.find(
          (p) =>
            p.track === activeState.track &&
            p.lifecycle === activeState.lifecycle &&
            p.country === activeState.country,
        )?.id ?? null)
      : null,
  );
  const [err, setErr] = useState<string | null>(null);

  async function activate(persona: ViewAsPersona) {
    setErr(null);
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        track: persona.track,
        lifecycle: persona.lifecycle,
        country: persona.country,
        source: "view_as_customer",
        confirm: true,
      };
      if (persona.track === "NP" && persona.npSpecialty) body.npSpecialty = persona.npSpecialty;
      if (persona.track === "ALLIED" && persona.alliedCareer) body.alliedCareer = persona.alliedCareer;

      const res = await fetch("/api/admin/learner-qa/simulate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string; hint?: string };
      if (!res.ok) {
        setErr(j.hint ? `${j.error ?? "Failed"} — ${j.hint}` : (j.error ?? `HTTP ${res.status}`));
        return;
      }
      setActiveId(persona.id);
      router.push("/app");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function stop() {
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
        setErr(j.error ?? `Failed (${res.status})`);
        return;
      }
      setActiveId(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const activePersona = PERSONAS.find((p) => p.id === activeId) ?? null;

  return (
    <div className="space-y-8">
      {/* Active session status */}
      {activePersona ? (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 px-5 py-4 dark:border-amber-500 dark:bg-amber-950/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Active Simulation
              </p>
              <p className="mt-1 text-base font-bold text-amber-900 dark:text-amber-200">
                {activePersona.icon} Viewing as: {activePersona.label}
              </p>
              <p className="mt-0.5 text-sm text-amber-800 dark:text-amber-300">
                {activePersona.track} · {activePersona.lifecycle.replace(/_/g, " ")} · {activePersona.country}
                {activePersona.npSpecialty ? ` · ${activePersona.npSpecialty}` : ""}
                {activePersona.alliedCareer ? ` · ${activePersona.alliedCareer}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/app"
                className="inline-flex min-h-10 items-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Open Learner View →
              </a>
              <button
                type="button"
                onClick={() => void stop()}
                disabled={busy}
                className="inline-flex min-h-10 items-center rounded-full border border-amber-400 bg-white px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 disabled:opacity-50 dark:bg-transparent dark:text-amber-200"
              >
                {busy ? "…" : "Stop Viewing"}
              </button>
            </div>
          </div>
          {/* Quick verification links */}
          <div className="mt-3 border-t border-amber-200 pt-3 dark:border-amber-700">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Verify these surfaces:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {VERIFICATION_SURFACES.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="rounded-md border border-amber-300 bg-white/80 px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-200"
                >
                  {s.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">No active simulation</p>
          <p className="mt-0.5 text-sm text-[var(--semantic-text-muted)]">
            Select a user type below to begin. You will be redirected to the learner app as that user.
          </p>
        </div>
      )}

      {err ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {err}
        </p>
      ) : null}

      {/* User type grid */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-[var(--semantic-text-primary)]">
          Select User Type
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((persona) => {
            const isActive = persona.id === activeId;
            return (
              <div
                key={persona.id}
                className={`relative flex flex-col rounded-xl border-2 p-4 transition ${
                  isActive
                    ? "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:border-[var(--semantic-brand)] hover:shadow-sm"
                }`}
              >
                {isActive && (
                  <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    Active
                  </span>
                )}
                <div className="mb-3 flex items-start gap-2">
                  <span className="text-2xl">{persona.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight text-[var(--semantic-text-primary)]">
                      {persona.label}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${BADGE_STYLES[persona.badgeColor]}`}
                    >
                      {persona.badge}
                    </span>
                  </div>
                </div>
                <p className="flex-1 text-xs text-[var(--semantic-text-muted)] leading-relaxed">
                  {persona.description}
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
                  {persona.accessSummary}
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void activate(persona)}
                  className={`mt-4 w-full rounded-full py-2 text-sm font-semibold transition disabled:opacity-50 ${
                    isActive
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-[var(--semantic-brand)] text-white hover:opacity-90"
                  }`}
                >
                  {busy && persona.id === activeId ? "…" : isActive ? "Re-enter View" : "View As User"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security notice */}
      <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-xs text-[var(--semantic-text-muted)]">
        <span className="font-semibold text-[var(--semantic-text-secondary)]">Security: </span>
        All view-as actions are logged with your admin user ID, timestamp, and simulation parameters.
        No writes are performed as the simulated user. Sessions expire after 2 hours. Only admin accounts
        may access this page.
      </div>
    </div>
  );
}
