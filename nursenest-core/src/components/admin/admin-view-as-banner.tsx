"use client";

/**
 * AdminViewAsBanner — persistent floating banner shown on every learner page during view-as sessions.
 *
 * Displays:
 *   - Mode label: "REAL USER" | "SIMULATED"
 *   - Target identity: email (real user) or track+lifecycle (simulated)
 *   - Pathway and subscription state
 *   - Return to Admin / Switch User / Clear Simulation actions
 *   - Optional debug overlay with full entitlement details
 *
 * Fixed to the bottom of the viewport so it never obscures lesson content.
 * Collapses to a compact strip to minimise visual noise.
 */

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  Bug,
  ChevronDown,
  ChevronUp,
  LogOut,
  RefreshCw,
  UserCog,
  X,
} from "lucide-react";
import type { AdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";

// ── Types ─────────────────────────────────────────────────────────────────────

export type EntitlementDebugInfo = {
  hasAccess: boolean;
  reason: string;
  tier: string | null;
  country: string | null;
  adminLearnerQaSimulation: boolean;
  pathwayId: string | null;
  planStatus: string | null;
  lifecycle: string;
};

export type AdminViewAsBannerProps = {
  state: AdminLearnerQaPublicState;
  entitlementDebug?: EntitlementDebugInfo | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function lifecycleBadgeStyle(lifecycle: string): { bg: string; text: string } {
  if (lifecycle.includes("paid") || lifecycle === "canceled") {
    return { bg: "color-mix(in srgb, #22c55e 20%, transparent)", text: "#15803d" };
  }
  if (lifecycle === "trial") {
    return { bg: "color-mix(in srgb, #3b82f6 20%, transparent)", text: "#1d4ed8" };
  }
  if (lifecycle === "past_due") {
    return { bg: "color-mix(in srgb, #ef4444 20%, transparent)", text: "#b91c1c" };
  }
  if (lifecycle.includes("expired")) {
    return { bg: "color-mix(in srgb, #f59e0b 20%, transparent)", text: "#b45309" };
  }
  return { bg: "color-mix(in srgb, #6b7280 20%, transparent)", text: "#374151" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AdminViewAsBanner({ state, entitlementDebug }: AdminViewAsBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const clearSession = useCallback(async () => {
    setClearing(true);
    try {
      const endpoint = state.isRealUser
        ? "/api/admin/view-as/real-user"
        : "/api/admin/learner-qa/clear";
      await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
      window.location.href = "/admin/view-as";
    } catch {
      setClearing(false);
    }
  }, [state.isRealUser]);

  const lifecycleStyle = lifecycleBadgeStyle(state.lifecycle);
  const modeLabel = state.isRealUser ? "REAL USER" : "SIMULATED";
  const modeColor = state.isRealUser ? "#7c3aed" : "#0369a1";

  const identityLine = state.isRealUser
    ? (state.targetEmail ?? state.targetUserId ?? "Unknown user")
    : `${state.track} · ${state.lifecycle} · ${state.country}`;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="admin-view-as-banner"
      className="fixed bottom-0 left-0 right-0 z-[9999] shadow-[0_-2px_16px_rgba(0,0,0,0.12)]"
      style={{
        background: "var(--semantic-surface, #fff)",
        borderTop: `3px solid ${modeColor}`,
      }}
    >
      {/* Compact strip */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        {/* Mode badge */}
        <span
          className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest"
          style={{ background: modeColor + "20", color: modeColor }}
        >
          {modeLabel}
        </span>

        {/* Identity */}
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--semantic-text-primary)]">
          {identityLine}
        </span>

        {/* Lifecycle badge */}
        <span
          className="hidden flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:block"
          style={{ background: lifecycleStyle.bg, color: lifecycleStyle.text }}
        >
          {state.lifecycle.replace(/_/g, " ")}
        </span>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {entitlementDebug && (
            <button
              type="button"
              onClick={() => setDebugOpen((d) => !d)}
              className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--semantic-text-tertiary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,transparent)] transition"
              aria-label="Toggle debug overlay"
              data-testid="view-as-debug-toggle"
            >
              <Bug className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--semantic-text-secondary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,transparent)] transition"
            aria-expanded={expanded}
            data-testid="view-as-expand-toggle"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
          <Link
            href="/admin/view-as"
            className="rounded-lg px-2.5 py-1 text-[10px] font-semibold text-[var(--semantic-brand)] hover:underline"
            data-testid="view-as-switch-user"
          >
            <RefreshCw className="inline h-3 w-3 mr-1" />
            Switch
          </Link>
          <button
            type="button"
            onClick={() => void clearSession()}
            disabled={clearing}
            className="rounded-lg bg-[var(--semantic-brand)] px-2.5 py-1 text-[10px] font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
            data-testid="view-as-exit"
          >
            {clearing ? "Exiting…" : <><X className="inline h-3 w-3 mr-1" />Exit</>}
          </button>
        </div>
      </div>

      {/* Expanded info */}
      {expanded && (
        <div className="border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_90%,var(--semantic-surface-muted,#f9fafb))]">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Mode</p>
                <p className="mt-0.5 font-semibold text-[var(--semantic-text-primary)]">{modeLabel}</p>
              </div>
              {state.isRealUser && state.targetEmail && (
                <div>
                  <p className="font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">User</p>
                  <p className="mt-0.5 font-semibold text-[var(--semantic-text-primary)] truncate">{state.targetEmail}</p>
                </div>
              )}
              <div>
                <p className="font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Pathway</p>
                <p className="mt-0.5 font-semibold text-[var(--semantic-text-primary)]">
                  {state.pathwayId ?? state.track} · {state.country}
                </p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Subscription</p>
                <p className="mt-0.5 font-semibold" style={{ color: lifecycleStyle.text }}>
                  {state.lifecycle.replace(/_/g, " ")}
                </p>
              </div>
              {state.planVariant && (
                <div>
                  <p className="font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Plan</p>
                  <p className="mt-0.5 font-semibold text-[var(--semantic-text-primary)]">{state.planVariant}</p>
                </div>
              )}
              {state.npSpecialty && (
                <div>
                  <p className="font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">NP Specialty</p>
                  <p className="mt-0.5 font-semibold text-[var(--semantic-text-primary)]">{state.npSpecialty}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] transition"
                data-testid="view-as-return-admin"
              >
                <LogOut className="h-3.5 w-3.5" />
                Return to Admin
              </Link>
              <Link
                href="/admin/view-as"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] transition"
              >
                <UserCog className="h-3.5 w-3.5" />
                Switch User
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Debug overlay */}
      {debugOpen && entitlementDebug && (
        <div className="border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,#1e293b_95%,transparent)]" data-testid="view-as-debug-overlay">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Entitlement Debug</p>
            <dl className="grid gap-x-6 gap-y-1 font-mono text-[11px] sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(entitlementDebug).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-slate-500">{key}</dt>
                  <dd className="text-slate-100">{String(value ?? "null")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
