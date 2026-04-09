"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ValidationJson = {
  ok?: boolean;
  errors?: string[];
  warnings?: string[];
  duplicateRisk?: boolean;
};

type DraftPayload = {
  id: string;
  stemPreview: string | null;
  reviewStatus: string;
  normalizedJson: Record<string, unknown> | null;
  payloadJson: unknown;
  validationJson: unknown;
  batchId: string | null;
  lessonId: string | null;
  categoryId: string | null;
  examFamily: string;
  tier: string;
  country: string;
  sourcePrompt: string;
  model: string;
  createdAt: string;
};

const SECTIONS = [
  { id: "stem", label: "Stem" },
  { id: "options", label: "Options & keys" },
  { id: "rationale", label: "Rationale" },
  { id: "wrong_rationales", label: "Wrong-answer rationales" },
  { id: "lesson_links", label: "Lesson link suggestions" },
  { id: "metadata", label: "Tags & difficulty" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function QuestionDraftStudioClient({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busySection, setBusySection] = useState<SectionId | null>(null);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const res = await fetch(`/api/admin/ai/drafts/questions/${draftId}`, { credentials: "include" });
    const data = (await res.json().catch(() => ({}))) as { draft?: DraftPayload; error?: string };
    if (!res.ok) {
      setLoadError(String(data.error ?? res.status));
      setDraft(null);
      return;
    }
    if (data.draft) setDraft(data.draft as DraftPayload);
  }, [draftId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function regenerate(section: SectionId) {
    setActionError(null);
    setBusySection(section);
    try {
      const res = await fetch(`/api/admin/ai/exam-questions/drafts/${draftId}/regenerate-section`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setActionError(String(data.error ?? res.status));
        return;
      }
      await load();
    } catch {
      setActionError("Network error");
    } finally {
      setBusySection(null);
    }
  }

  async function review(action: "approve" | "reject") {
    setActionError(null);
    setReviewBusy(true);
    try {
      const res = await fetch(`/api/admin/ai/drafts/questions/${draftId}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setActionError(String(data.error ?? res.status));
        return;
      }
      await load();
    } catch {
      setActionError("Network error");
    } finally {
      setReviewBusy(false);
    }
  }

  if (loadError) {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }
  if (!draft) {
    return <p className="text-sm text-muted">Loading draft…</p>;
  }

  const norm = draft.normalizedJson as
    | {
        stem?: string;
        rationale?: string;
        options?: string[];
        answerKey?: string[];
        questionType?: string;
        topicTag?: string;
        metadata?: {
          difficultyLabel?: string;
          tags?: string[];
          pathwayLabel?: string;
          examContextLabel?: string;
          wrongAnswerRationales?: string[];
          lessonLinkSuggestions?: Array<{ lessonId?: string; title: string; slug?: string; reason: string }>;
        };
      }
    | null
    | undefined;

  const v = draft.validationJson as ValidationJson | undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/ai/exam-questions" className="text-sm text-primary underline">
          ← AI question generator
        </Link>
        <span className="text-xs text-muted">
          {draft.examFamily} · {draft.country} · {draft.tier}
        </span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium">{draft.reviewStatus}</span>
      </div>

      <h1 className="text-xl font-bold">Question draft</h1>
      {actionError ? <p className="text-sm text-red-600">{actionError}</p> : null}

      {v?.warnings?.length ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <p className="font-semibold text-amber-900">Warnings</p>
          <ul className="mt-1 list-inside list-disc">
            {v.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {v?.errors?.length ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
          <p className="font-semibold">Validation errors</p>
          <ul className="mt-1 list-inside list-disc">
            {v.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="nn-card space-y-3 p-4">
        <h2 className="text-sm font-semibold">Section regeneration</h2>
        <p className="text-xs text-muted">
          Regenerates one slice via AI and re-validates. Resets review to pending when successful.
        </p>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={busySection !== null || reviewBusy || draft.reviewStatus === "PROMOTED"}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium disabled:opacity-50"
              onClick={() => void regenerate(s.id)}
            >
              {busySection === s.id ? "…" : `Regen ${s.label}`}
            </button>
          ))}
        </div>
      </section>

      {draft.reviewStatus === "PENDING_REVIEW" ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={busySection !== null || reviewBusy}
            onClick={() => void review("approve")}
          >
            Approve for promotion
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold disabled:opacity-50"
            disabled={busySection !== null || reviewBusy}
            onClick={() => void review("reject")}
          >
            Reject
          </button>
          <Link
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold"
            href="/admin/questions"
          >
            Question bank
          </Link>
        </div>
      ) : null}

      <section className="nn-card space-y-4 p-4">
        <h2 className="text-sm font-semibold">Content</h2>
        {norm?.metadata?.pathwayLabel ? (
          <p className="text-xs text-muted">
            Pathway: {norm.metadata.pathwayLabel}
            {norm.metadata.examContextLabel ? ` · ${norm.metadata.examContextLabel}` : ""}
          </p>
        ) : null}
        <div>
          <p className="text-xs font-medium text-muted">Stem</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{norm?.stem ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">
            Options ({norm?.questionType ?? "?"}) — answer key: {norm?.answerKey?.join(" | ") ?? "—"}
          </p>
          <ol className="mt-1 list-decimal pl-5 text-sm">
            {(norm?.options ?? []).map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Rationale</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{norm?.rationale ?? "—"}</p>
        </div>
        {norm?.metadata?.wrongAnswerRationales?.length ? (
          <div>
            <p className="text-xs font-medium text-muted">Per-option rationales</p>
            <ul className="mt-1 list-inside list-disc text-sm">
              {norm.metadata.wrongAnswerRationales.map((r, i) => (
                <li key={i}>
                  <span className="text-muted">[{i}]</span> {r || "—"}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {norm?.metadata?.lessonLinkSuggestions?.length ? (
          <div>
            <p className="text-xs font-medium text-muted">Lesson link suggestions</p>
            <ul className="mt-2 space-y-2 text-sm">
              {norm.metadata.lessonLinkSuggestions.map((l, i) => (
                <li key={i} className="rounded border border-border/60 p-2">
                  {l.lessonId ? (
                    <span className="font-mono text-xs text-muted">{l.lessonId}</span>
                  ) : null}
                  <p className="font-medium">{l.title}</p>
                  <p className="text-xs text-muted">{l.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {norm?.metadata?.tags?.length ? (
          <p className="text-xs">
            <span className="text-muted">Tags:</span> {norm.metadata.tags.join(", ")}
          </p>
        ) : null}
        {norm?.metadata?.difficultyLabel ? (
          <p className="text-xs">
            <span className="text-muted">Difficulty:</span> {norm.metadata.difficultyLabel}
          </p>
        ) : null}
      </section>

      <details className="text-xs text-muted">
        <summary className="cursor-pointer">Source prompt</summary>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-black/[0.03] p-2">{draft.sourcePrompt}</pre>
      </details>
    </div>
  );
}
