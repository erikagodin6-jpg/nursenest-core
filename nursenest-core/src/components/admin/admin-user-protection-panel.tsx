"use client";

import Link from "next/link";
import { useState } from "react";
import type { ElementType } from "react";
import {
  AlertTriangle,
  FileDown,
  Gift,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import type { AccountActivityEvidence } from "@/lib/admin/account-activity-evidence";

type Props = {
  userId: string;
  evidence: AccountActivityEvidence | null;
};

type OpsAction =
  | "force_reauthentication"
  | "open_abuse_review"
  | "cancel_local_subscriptions"
  | "grant_comp_access";

const ACTIONS: Array<{
  id: OpsAction;
  label: string;
  description: string;
  icon: ElementType;
  dangerous?: boolean;
}> = [
  {
    id: "force_reauthentication",
    label: "Force re-auth",
    description: "Revoke active session slots and invalidate existing auth tokens.",
    icon: LockKeyhole,
  },
  {
    id: "open_abuse_review",
    label: "Open review",
    description: "Create a protection review with the note below.",
    icon: ShieldAlert,
  },
  {
    id: "grant_comp_access",
    label: "Grant comp month",
    description: "Create a local 30-day comp access row for support recovery.",
    icon: Gift,
  },
  {
    id: "cancel_local_subscriptions",
    label: "Revoke local access",
    description: "Cancel local active subscription rows and force re-auth. Stripe remains separate.",
    icon: AlertTriangle,
    dangerous: true,
  },
];

function stat(label: string, value: string | number) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
    </div>
  );
}

export function AdminUserProtectionPanel({ userId, evidence }: Props) {
  const [note, setNote] = useState("");
  const [running, setRunning] = useState<OpsAction | null>(null);
  const [result, setResult] = useState<string>("");

  async function runAction(action: OpsAction, dryRun: boolean) {
    const selected = ACTIONS.find((a) => a.id === action);
    if (!dryRun) {
      const ok = window.confirm(
        `Run “${selected?.label ?? action}” for this user? This is an admin account operation and will be logged.`,
      );
      if (!ok) return;
    }
    setRunning(action);
    setResult("");
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/ops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          note,
          reason: action,
          days: 30,
          ...(dryRun ? { dryRun: true } : { confirm: true }),
        }),
      });
      const json = (await res.json()) as unknown;
      setResult(JSON.stringify(json, null, 2));
    } catch (e) {
      setResult(`Failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRunning(null);
    }
  }

  return (
    <section className="mt-6 nn-card overflow-hidden p-0">
      <div className="border-b border-border/70 bg-muted/20 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Account Activity Evidence</p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">
          Chargeback protection & support controls
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Dispute-ready activity summary using existing subscription, session, study, and protection telemetry. Raw IPs and Stripe identifiers are intentionally not exposed here.
        </p>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="space-y-5">
          {evidence ? (
            <>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-medium leading-6 text-[var(--theme-heading-text)]">{evidence.disputeSummary}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stat("Estimated hours", evidence.summary.totalEstimatedHours)}
                {stat("Active days", evidence.summary.activeDays)}
                {stat("Exam sessions", evidence.summary.examSessions)}
                {stat("Flashcards answered", evidence.summary.flashcardsAnswered)}
                {stat("Lessons viewed", evidence.summary.lessonsViewed)}
                {stat("Practice tests", evidence.summary.practiceTestsStarted)}
                {stat("Question attempts", evidence.summary.questionAttempts)}
                {stat("Device slots 7d", evidence.summary.activeDeviceSlots7d)}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/api/admin/users/${encodeURIComponent(userId)}/activity-evidence`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-primary/40"
                >
                  <FileDown className="h-4 w-4" />
                  View JSON
                </Link>
                <Link
                  href={`/api/admin/users/${encodeURIComponent(userId)}/activity-evidence?format=txt`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-primary/40"
                >
                  <FileDown className="h-4 w-4" />
                  Download evidence report
                </Link>
                <Link
                  href={`/api/admin/users/${encodeURIComponent(userId)}/activity-evidence?format=html`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:border-primary/40"
                >
                  <FileDown className="h-4 w-4" />
                  Print / save PDF
                </Link>
              </div>

              <div className="rounded-2xl border border-border/70">
                <div className="border-b border-border/60 px-4 py-3">
                  <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Recent activity timeline</h3>
                </div>
                <ol className="max-h-80 space-y-0 overflow-y-auto p-4 text-sm">
                  {evidence.timeline.slice(0, 25).map((item, index) => (
                    <li key={`${item.at}-${index}`} className="border-l border-border/70 pb-3 pl-4 last:pb-0">
                      <p className="text-xs text-muted-foreground">{new Date(item.at).toLocaleString()} · {item.kind}</p>
                      <p className="mt-0.5 font-medium text-[var(--theme-heading-text)]">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
              Activity evidence is unavailable for this user or database environment.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" htmlFor="admin-user-protection-note">
              Internal note
            </label>
            <textarea
              id="admin-user-protection-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/60"
              placeholder="Reason, support context, dispute note, or coupon/comp rationale..."
            />
          </div>

          <div className="grid gap-2">
            {ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.id} className="rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-muted p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={running !== null}
                          onClick={() => void runAction(action.id, true)}
                          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 disabled:opacity-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Dry run
                        </button>
                        <button
                          type="button"
                          disabled={running !== null}
                          onClick={() => void runAction(action.id, false)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                            action.dangerous
                              ? "border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-200"
                              : "border border-primary/30 bg-primary/10 text-primary"
                          }`}
                        >
                          {running === action.id ? "Running..." : "Apply"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <pre className="max-h-72 overflow-auto rounded-xl border border-border bg-muted/30 p-3 text-xs">
            {result || "Run a dry run first, then apply if the preview matches the support action."}
          </pre>
        </div>
      </div>
    </section>
  );
}
