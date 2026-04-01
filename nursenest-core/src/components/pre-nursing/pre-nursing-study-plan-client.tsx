"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";

type PlanType = "unsure" | "proposed";

type PlanPayload = {
  preNursingTargetDate: string | null;
  preNursingDatePlanType: string | null;
  preNursingGoalSetAt: string | null;
  preNursingFuturePathwayHint: string | null;
  futurePathwayOptions?: { value: string; label: string }[];
};

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(t);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - start.getTime()) / 86400000);
}

export function PreNursingStudyPlanClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanPayload | null>(null);
  const [planType, setPlanType] = useState<PlanType>("unsure");
  const [targetDate, setTargetDate] = useState("");
  const [hint, setHint] = useState("unsure");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/pre-nursing-plan", { method: "GET" });
      if (res.status === 401) {
        setData(null);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Could not load your plan.");
        setLoading(false);
        return;
      }
      const j = (await res.json()) as PlanPayload;
      setData(j);
      const t = (j.preNursingDatePlanType ?? "unsure") as PlanType;
      setPlanType(t === "proposed" ? "proposed" : "unsure");
      setTargetDate(j.preNursingTargetDate ? j.preNursingTargetDate.slice(0, 10) : "");
      setHint(j.preNursingFuturePathwayHint ?? "unsure");
    } catch {
      setError("Could not load your plan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/pre-nursing-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preNursingDatePlanType: planType,
          preNursingTargetDate: planType === "unsure" ? null : targetDate || null,
          preNursingFuturePathwayHint: hint || null,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof j.error === "string" ? j.error : "Save failed.");
        setSaving(false);
        return;
      }
      await load();
      trackClientEvent(PH.preNursingStudyPlanSaved, {
        source_surface: "study_plan",
        plan_type: planType,
        has_target_date: Boolean(planType === "proposed" && targetDate),
        selected_pathway_hint: hint || "unsure",
      });
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const d = daysUntil(data?.preNursingTargetDate ?? null);

  const pathwayOpts =
    data?.futurePathwayOptions && data.futurePathwayOptions.length > 0
      ? data.futurePathwayOptions
      : [
          { value: "unsure", label: "Not sure yet" },
          { value: "rn", label: "Registered Nurse (RN)" },
          { value: "pn", label: "Practical / Vocational Nurse (PN/LPN)" },
          { value: "rpn", label: "Registered Practical Nurse — Canada (RPN)" },
          { value: "np", label: "Nurse Practitioner (NP)" },
        ];

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (error && !data) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!data && !loading) {
    return (
      <div className="nn-card space-y-4 p-6">
        <p className="text-sm text-muted">
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
            onClick={() => trackClientEvent(PH.preNursingSigninCtaClicked, { source_surface: "study_plan", cta_type: "guest_intro" })}
          >
            Sign in
          </Link>{" "}
          to save a target readiness date and optional future pathway. Still free — no paid exam prep subscription needed.
        </p>
        <p className="text-sm text-muted">
          Guests can open every Pre-Nursing module; completion can stay on this device until you create an account.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
            onClick={() => trackClientEvent(PH.preNursingSignupCtaClicked, { source_surface: "study_plan", cta_type: "guest_gate" })}
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
            onClick={() => trackClientEvent(PH.preNursingSigninCtaClicked, { source_surface: "study_plan", cta_type: "guest_gate" })}
          >
            I already have an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="nn-card space-y-6 p-6" onSubmit={onSave}>
      <div>
        <label className="text-sm font-medium text-foreground" htmlFor="pn-plan-type">
          Readiness pacing
        </label>
        <select
          id="pn-plan-type"
          className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
          value={planType}
          onChange={(e) => setPlanType(e.target.value as PlanType)}
        >
          <option value="unsure">I’m not sure yet — use a steady, rolling pace</option>
          <option value="proposed">I have a target date (school start, readiness goal, etc.)</option>
        </select>
        <p className="mt-1 text-xs text-muted">
          This is not your NCLEX or registration exam — use it to pace free Pre-Nursing work gently.
        </p>
      </div>

      {planType === "proposed" ? (
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="pn-target">
            Target date
          </label>
          <input
            id="pn-target"
            type="date"
            required
            className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          {typeof d === "number" ? (
            <p className="mt-2 text-sm text-muted">
              About <span className="font-semibold text-foreground">{d}</span> days until your target — adjust anytime.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted">
          <p className="font-medium text-foreground">Unsure mode</p>
          <p className="mt-1">
            We’ll suggest the next module in order and keep countdowns out of the way — add a date later if you want a
            gentle time horizon.
          </p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-foreground" htmlFor="pn-hint">
          Likely next step (optional)
        </label>
        <select
          id="pn-hint"
          className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          onBlur={() =>
            trackClientEvent(PH.preNursingFuturePathwayHintChanged, {
              source_surface: "study_plan",
              selected_pathway_hint: hint || "unsure",
            })
          }
        >
          {pathwayOpts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted">Used for softer “what’s next” links on lesson pages — not a commitment.</p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save preferences"}
        </button>
        <Link
          href="/pre-nursing/lessons"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] hover:bg-muted/80"
        >
          Back to lessons
        </Link>
      </div>
    </form>
  );
}
