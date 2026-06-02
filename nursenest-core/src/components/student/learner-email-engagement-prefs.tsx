"use client";

import { useCallback, useState } from "react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export function LearnerEmailEngagementPrefs({
  initialOptOut,
  t,
}: {
  initialOptOut: boolean;
  t: LearnerMarketingT;
}) {
  const [optOut, setOptOut] = useState(initialOptOut);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  const save = useCallback(async () => {
    setBusy(true);
    setSaved(false);
    setError(false);
    try {
      const res = await fetch("/api/learner/email-engagement-prefs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailEngagementOptOut: optOut }),
      });
      if (!res.ok) {
        setError(true);
        return;
      }
      const body = (await res.json()) as { ok?: boolean; emailEngagementOptOut?: boolean };
      if (typeof body.emailEngagementOptOut === "boolean") {
        setOptOut(body.emailEngagementOptOut);
      }
      setSaved(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }, [optOut]);

  return (
    <div className="space-y-3 text-sm">
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-muted/10 p-4">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border text-primary"
          checked={optOut}
          onChange={(e) => {
            setOptOut(e.target.checked);
            setSaved(false);
          }}
        />
        <span>
          <span className="font-semibold text-foreground">{t("learner.emailEngagement.optOutLabel")}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{t("learner.emailEngagement.optOutHint")}</span>
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          disabled={busy}
          onClick={() => void save()}
        >
          {busy ? "…" : t("learner.emailEngagement.save")}
        </button>
        {saved ? <span className="text-xs font-medium text-[var(--semantic-success)]">{t("learner.emailEngagement.saved")}</span> : null}
        {error ? <span className="text-xs font-medium text-[var(--semantic-danger)]">{t("learner.emailEngagement.error")}</span> : null}
      </div>
    </div>
  );
}
