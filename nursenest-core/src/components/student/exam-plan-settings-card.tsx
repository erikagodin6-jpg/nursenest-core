"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type PathwayOpt = { id: string; label: string; shortLabel: string };

type AlliedProfessionOpt = { key: string; label: string };

type ExamPlanPayload = {
  examDate: string | null;
  examDatePlanType: string | null;
  examGoalSetAt: string | null;
  targetExamPathwayId: string | null;
  studyCadencePreference: string | null;
  alliedProfessionKey: string | null;
  tier: string;
  pathways: PathwayOpt[];
  alliedProfessionOptions?: AlliedProfessionOpt[];
};

function ymdFromIso(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function ExamPlanSettingsCard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExamPlanPayload | null>(null);

  const [planType, setPlanType] = useState<"unsure" | "proposed" | "confirmed">("unsure");
  const [examDate, setExamDate] = useState("");
  const [pathwayId, setPathwayId] = useState("");
  const [cadence, setCadence] = useState<"" | "light" | "steady" | "intensive">("");
  const [alliedProfessionKey, setAlliedProfessionKey] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/exam-plan", { method: "GET" });
      if (!res.ok) {
        setError("Could not load exam plan.");
        setLoading(false);
        return;
      }
      const j = (await res.json()) as ExamPlanPayload;
      setData(j);
      const t = (j.examDatePlanType ?? "unsure") as "unsure" | "proposed" | "confirmed";
      setPlanType(["unsure", "proposed", "confirmed"].includes(t) ? t : "unsure");
      setExamDate(ymdFromIso(j.examDate));
      setPathwayId(j.targetExamPathwayId ?? "");
      setAlliedProfessionKey(j.alliedProfessionKey ?? "");
      setCadence(
        j.studyCadencePreference === "light" || j.studyCadencePreference === "steady" || j.studyCadencePreference === "intensive"
          ? j.studyCadencePreference
          : "",
      );
    } catch {
      setError("Could not load exam plan.");
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
      const res = await fetch("/api/learner/exam-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examDatePlanType: planType,
          examDate: planType === "unsure" ? null : examDate || null,
          targetExamPathwayId: pathwayId || null,
          studyCadencePreference: cadence || null,
          alliedProfessionKey: alliedProfessionKey.trim() ? alliedProfessionKey.trim().toLowerCase() : null,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof j.error === "string" ? j.error : "Save failed.");
        setSaving(false);
        return;
      }
      await load();
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !data) {
    return (
      <section id="exam-plan" className="nn-card scroll-mt-24 p-6">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Exam date & pacing</h2>
        <p className="mt-2 text-sm text-muted">Loading…</p>
      </section>
    );
  }

  const pathways = data?.pathways ?? [];
  const alliedOptions = data?.alliedProfessionOptions ?? [];
  const showAlliedProfession = data?.tier === "allied";

  return (
    <section id="exam-plan" className="nn-card scroll-mt-24 p-6">
      <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Exam date & pacing</h2>
      <p className="mt-2 text-sm text-muted">
        Tell us your timing so we can pace countdowns and suggestions. This is not a booking record — update it anytime.
      </p>

      <form className="mt-4 space-y-4" onSubmit={onSave}>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="exam-plan-type">
            Exam timing
          </label>
          <select
            id="exam-plan-type"
            className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
            value={planType}
            onChange={(e) => setPlanType(e.target.value as typeof planType)}
          >
            <option value="unsure">Not booked yet / unsure</option>
            <option value="proposed">I have a proposed exam date</option>
            <option value="confirmed">I have a confirmed exam date</option>
          </select>
        </div>

        {planType !== "unsure" ? (
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="exam-plan-date">
              {planType === "proposed" ? "Proposed exam date" : "Exam date"}
            </label>
            <input
              id="exam-plan-date"
              type="date"
              className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>
        ) : (
          <p className="text-sm text-muted">
            We’ll use mastery-style pacing until you add a date. You can still use every study tool.
          </p>
        )}

        {showAlliedProfession ? (
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="exam-plan-allied-profession">
              Allied profession (optional)
            </label>
            <select
              id="exam-plan-allied-profession"
              className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
              value={alliedProfessionKey}
              onChange={(e) => setAlliedProfessionKey(e.target.value)}
            >
              <option value="">Not set</option>
              {alliedOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">
              Keeps weak-area suggestions and study copy aligned with your discipline (allied tier only).
            </p>
          </div>
        ) : null}

        {pathways.length > 0 ? (
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="exam-plan-pathway">
              Target pathway (optional)
            </label>
            <select
              id="exam-plan-pathway"
              className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
              value={pathwayId}
              onChange={(e) => setPathwayId(e.target.value)}
            >
              <option value="">No specific pathway</option>
              {pathways.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="exam-plan-cadence">
            Study cadence preference (optional)
          </label>
          <select
            id="exam-plan-cadence"
            className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
            value={cadence}
            onChange={(e) => setCadence(e.target.value as typeof cadence)}
          >
            <option value="">No preference</option>
            <option value="light">Lighter days</option>
            <option value="steady">Steady rhythm</option>
            <option value="intensive">More intensive blocks</option>
          </select>
          <p className="mt-1 text-xs text-muted">Used for wording only — we do not assign fixed daily hours.</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <Link
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-menu-text)] hover:bg-muted/80"
            href="/app/study-plan"
          >
            Open study plan
          </Link>
        </div>
      </form>
    </section>
  );
}
