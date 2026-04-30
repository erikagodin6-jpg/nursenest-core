"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PathwayOption = { id: string; title: string };

export function AdminClinicalScenarioCreateDraftForm({ pathwayOptions }: { pathwayOptions: PathwayOption[] }) {
  const router = useRouter();
  const [pathwayId, setPathwayId] = useState(pathwayOptions[0]?.id ?? "");
  const [tierFocus, setTierFocus] = useState<"RN_NCLEX_RN" | "RPN_PN" | "NP" | "NEW_GRAD">("RN_NCLEX_RN");
  const [difficulty, setDifficulty] = useState<"FOUNDATION" | "INTERMEDIATE" | "ADVANCED">("FOUNDATION");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/clinical-nursing-scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathwayId,
          tierFocus,
          difficulty,
          ...(title.trim() ? { title: title.trim() } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; code?: string };
      if (!res.ok || !data.ok || !data.id) {
        setErr(data.code === "unknown_pathway" ? "Unknown pathway id." : "Could not create draft.");
        return;
      }
      router.push(`/admin/clinical-scenarios/${encodeURIComponent(data.id)}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4"
    >
      <h2 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Create draft scenario</h2>
      <p className="text-xs text-[var(--theme-body-text)]">
        Inserts a placeholder case with one MCQ stage. Learner surfaces stay gated until{" "}
        <code className="rounded bg-[var(--bg-muted)] px-1">NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS</code> ships.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-[var(--semantic-text-primary)]">
          Pathway
          <select
            className="mt-1 w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 px-2 py-2 text-sm"
            value={pathwayId}
            onChange={(e) => setPathwayId(e.target.value)}
          >
            {pathwayOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.id})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--semantic-text-primary)]">
          Tier focus
          <select
            className="mt-1 w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 px-2 py-2 text-sm"
            value={tierFocus}
            onChange={(e) => setTierFocus(e.target.value as typeof tierFocus)}
          >
            <option value="RN_NCLEX_RN">RN / NCLEX-RN</option>
            <option value="RPN_PN">RPN/PN / REx-PN / NCLEX-PN</option>
            <option value="NP">NP / CNPE pathway</option>
            <option value="NEW_GRAD">New grad nursing</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--semantic-text-primary)]">
          Difficulty
          <select
            className="mt-1 w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 px-2 py-2 text-sm"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
          >
            <option value="FOUNDATION">Foundation</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--semantic-text-primary)]">
          Title (optional)
          <input
            className="mt-1 w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 px-2 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={240}
            placeholder="Defaults to pathway-based draft title"
          />
        </label>
      </div>
      {err ? <p className="text-sm text-[var(--semantic-danger)]">{err}</p> : null}
      <button
        type="submit"
        disabled={busy || !pathwayId}
        className="rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-on-brand)] disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create draft"}
      </button>
    </form>
  );
}

export function AdminClinicalScenarioPublishForm({
  scenarioId,
  initialPublishStatus,
  learnerPreviewHref,
}: {
  scenarioId: string;
  initialPublishStatus: string;
  /** Staff-only `/app/clinical-scenarios` preview when the public flag is off. */
  learnerPreviewHref?: string | null;
}) {
  const router = useRouter();
  const [publishStatus, setPublishStatus] = useState(initialPublishStatus);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSave() {
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/clinical-nursing-scenarios/${encodeURIComponent(scenarioId)}/publish-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishStatus }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; publishStatus?: string };
      if (!res.ok || !data.ok) {
        setMsg("Update failed.");
        return;
      }
      if (data.publishStatus) setPublishStatus(data.publishStatus);
      setMsg("Saved.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_8%,var(--bg-card))] p-4">
      <h2 className="text-sm font-semibold text-[var(--semantic-text-primary)]">Editorial status</h2>
      <p className="mt-1 text-xs text-[var(--theme-body-text)]">
        APPROVED does not expose learners while the public feature flag is off. Use workflow states for review handoffs.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-[var(--semantic-text-primary)]">
          Status
          <select
            className="mt-1 block rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 px-2 py-2 text-sm"
            value={publishStatus}
            onChange={(e) => setPublishStatus(e.target.value)}
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In review</option>
            <option value="APPROVED">Approved (not public without flag)</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={busy}
          className="rounded-full bg-[var(--semantic-info)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save status"}
        </button>
        {learnerPreviewHref ? (
          <Link
            href={learnerPreviewHref}
            className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
          >
            Open learner preview shell
          </Link>
        ) : null}
      </div>
      {msg ? <p className="mt-2 text-xs text-[var(--semantic-success)]">{msg}</p> : null}
    </div>
  );
}
