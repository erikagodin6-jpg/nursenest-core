"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, RefreshCw, ShieldCheck, Sparkles, Users } from "lucide-react";

type SocialStudyDashboardCardProps = {
  initialCode: string | null;
  socialEnabled: boolean;
  statsHidden: boolean;
  visibilityScope: string;
};

function privacyLabel(enabled: boolean, hidden: boolean, scope: string): string {
  if (!enabled) return "Social off";
  if (hidden || scope === "PRIVATE") return "Stats private";
  if (scope === "PAUSED") return "Visibility paused";
  if (scope === "FRIENDS") return "Visible to friends";
  if (scope === "GROUPS_CLASSROOMS") return "Visible to groups";
  return "Friends and groups";
}

export function SocialStudyDashboardCard({
  initialCode,
  socialEnabled,
  statsHidden,
  visibilityScope,
}: SocialStudyDashboardCardProps) {
  const [code, setCode] = useState(initialCode);
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const stateLabel = useMemo(() => privacyLabel(socialEnabled, statsHidden, visibilityScope), [socialEnabled, statsHidden, visibilityScope]);

  async function copyCode() {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    setMessage("Invite code copied.");
  }

  async function regenerateCode() {
    const res = await fetch("/api/learner/social/invite-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: true }),
    });
    const payload = await res.json().catch(() => null);
    if (payload?.ok && payload.code?.displayCode) {
      setCode(payload.code.displayCode);
      setMessage("New invite code ready.");
    } else {
      setMessage("Could not regenerate code right now.");
    }
  }

  async function connectCode() {
    const value = joinCode.trim();
    if (!value) return;
    const res = await fetch("/api/learner/social/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value }),
    });
    const payload = await res.json().catch(() => null);
    setMessage(payload?.ok ? "Connection request sent or group joined." : "That code is not available.");
    if (payload?.ok) setJoinCode("");
  }

  return (
    <section
      className="nn-card nn-gradient-safe relative overflow-hidden border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-gradient-to-br from-[var(--semantic-panel-cool)] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-testid="social-study-dashboard-card"
      aria-labelledby="social-study-dashboard-card-title"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_20%,transparent)] blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] text-[var(--semantic-brand)] shadow-sm">
            <Users className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-success-contrast)]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {stateLabel}
            </p>
            <h2 id="social-study-dashboard-card-title" className="mt-3 text-xl font-bold tracking-tight text-[var(--theme-heading-text)]">
              Study With Friends
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Compare readiness ranges, streaks, flashcard progress, CAT completion, and weak-area overlap only after opt-in.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_82%,var(--semantic-panel-positive)_18%)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Personal invite code</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 rounded-xl bg-[var(--semantic-surface)] px-3 py-2 font-mono text-lg font-bold tracking-[0.18em] text-[var(--semantic-text-primary)]">
              {code ?? "Not enabled"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyCode} disabled={!code} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-50">
                <Copy className="h-4 w-4" aria-hidden />
                Copy
              </button>
              <button type="button" onClick={regenerateCode} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--semantic-brand)] px-3 text-sm font-semibold text-white">
                <RefreshCw className="h-4 w-4" aria-hidden />
                Regenerate
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter friend, group, or classroom code"
            className="min-h-11 min-w-0 flex-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm outline-none focus:border-[var(--semantic-brand)]"
            aria-label="Friend, group, or classroom code"
          />
          <button type="button" onClick={connectCode} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-info)] px-5 text-sm font-bold text-white">
            Join
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/app/account/social" className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))]">
            Manage privacy, friends, and groups
          </Link>
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] p-4 text-sm text-[var(--semantic-warning-contrast)]">
            <span className="font-semibold">Friendly challenges:</span> flashcard sprints, practice quizzes, weak-area recovery, streaks, and readiness improvement.
          </div>
        </div>

        {message ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[var(--semantic-info-contrast)]">
            <Sparkles className="h-4 w-4" aria-hidden />
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
