"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  initialiseEditorState,
  blankEditorState,
  toggleCorrectLetter,
  addOptionRow,
  removeOptionRow,
  buildSavePayload,
  isFormValid,
  type FlashcardEditorState,
  type AdminFlashcardGetResponse,
} from "@/lib/flashcards/flashcard-editor-form-logic";
import type { CanonicalOption } from "@/lib/flashcards/flashcard-option-normalize";

const ITEM_KINDS = [
  "CLINICAL",
  "PRIORITY",
  "RECALL",
  "CONCEPT",
  "SATA",
  "ECG_STRIP",
  "BOWTIE",
  "MED_SAFETY",
  "LAB_TREND",
] as const;

const TIERS = ["RPN", "LVN_LPN", "RN", "NP", "ALLIED", "PRE_NURSING", "NEW_GRAD"] as const;
const STATUSES = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;
const COUNTRIES = ["US", "CA"] as const;

// ── Inline label + field helpers ──────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

const INPUT_CLASS =
  "rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--semantic-brand)] focus:border-transparent";

const SELECT_CLASS =
  "rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--semantic-brand)]";

// ── Main component ────────────────────────────────────────────────────────────

export function AdminFlashcardEditorClient({ flashcardId }: { flashcardId: string | null }) {
  const router = useRouter();
  const isNew = flashcardId === null;

  const [state, setState] = useState<FlashcardEditorState>(blankEditorState());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // ── Load existing card ────────────────────────────────────────────────────

  const loadCard = useCallback(async () => {
    if (!flashcardId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/flashcards/${flashcardId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? `HTTP ${res.status}`);
        return;
      }
      const data = (await res.json()) as AdminFlashcardGetResponse;
      setState(initialiseEditorState(data));
    } catch {
      setError("Network error loading flashcard.");
    } finally {
      setLoading(false);
    }
  }, [flashcardId]);

  useEffect(() => {
    void loadCard();
  }, [loadCard]);

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    const validation = isFormValid(state);
    if (!validation.ok) {
      setError(validation.errors.join(" · "));
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    setWarning(null);

    const payload = buildSavePayload(state);

    try {
      const url = isNew
        ? "/api/admin/flashcards"
        : `/api/admin/flashcards/${flashcardId}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        flashcard?: { id: string };
        canonicalOptionsWritten?: number;
        canonicalOptionsReplaced?: number;
        error?: string;
        details?: unknown;
        _meta?: { warning?: string };
      };

      if (!res.ok) {
        setError(data.error ?? `Save failed (HTTP ${res.status})`);
        return;
      }

      if (data._meta?.warning) setWarning(data._meta.warning);

      const n = data.canonicalOptionsWritten ?? data.canonicalOptionsReplaced ?? 0;
      setSuccess(`Saved. ${n} canonical option row${n !== 1 ? "s" : ""} written.`);

      // Navigate to the edit page for a newly created card
      if (isNew && data.flashcard?.id) {
        router.push(`/admin/flashcards/${data.flashcard.id}`);
      } else {
        await loadCard();
      }
    } catch {
      setError("Network error saving flashcard.");
    } finally {
      setSaving(false);
    }
  }

  // ── Option helpers ────────────────────────────────────────────────────────

  const isSata = state.examItemKind === "SATA";

  function handleToggleCorrect(letter: string) {
    const { options, correctLetters } = toggleCorrectLetter(state.options, letter, isSata);
    setState((s) => ({ ...s, options, correctLetters }));
  }

  function handleOptionContentChange(idx: number, value: string) {
    setState((s) => ({
      ...s,
      options: s.options.map((o, i) => (i === idx ? { ...o, content: value } : o)),
    }));
  }

  function handleRationaleChange(idx: number, value: string) {
    setState((s) => ({
      ...s,
      options: s.options.map((o, i) => (i === idx ? { ...o, rationale: value } : o)),
    }));
  }

  function handleAddOption() {
    setState((s) => ({ ...s, options: addOptionRow(s.options, isSata) }));
  }

  function handleRemoveOption(idx: number) {
    setState((s) => {
      const options = removeOptionRow(s.options, idx);
      const correctLetters = options.filter((o) => o.isCorrect).map((o) => o.optionKey);
      return { ...s, options, correctLetters };
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        className="animate-pulse rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--semantic-text-muted)]"
        data-testid="flashcard-editor-loading"
      >
        Loading card…
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="flashcard-editor-root">
      {/* Status messages */}
      {error ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] p-3 text-sm text-[var(--semantic-danger)]"
          data-testid="editor-error"
          role="alert"
        >
          {error}
        </div>
      ) : null}
      {warning ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] p-3 text-sm text-[var(--semantic-warning)]"
          data-testid="editor-warning"
          role="status"
        >
          ⚠️ {warning}
        </div>
      ) : null}
      {success ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] p-3 text-sm text-[var(--semantic-success)]"
          data-testid="editor-success"
          role="status"
        >
          {success}
        </div>
      ) : null}

      {/* Debug: optionsSource badge */}
      {state.optionsSource ? (
        <div className="flex items-center gap-2 text-xs text-[var(--semantic-text-muted)]" data-testid="options-source-badge">
          <span className="font-semibold">Options source:</span>
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
              state.optionsSource === "canonical"
                ? "bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success)]"
                : state.optionsSource === "json_fallback"
                  ? "bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[var(--semantic-warning)]"
                  : "bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)]"
            }`}
          >
            {state.optionsSource}
          </span>
          {state.optionsSource === "json_fallback" ? (
            <span className="text-[var(--semantic-text-muted)]">
              — run <code className="font-mono">migrate-flashcard-options.ts</code> to upgrade
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Card metadata */}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Card metadata
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Item kind">
            <select
              className={SELECT_CLASS}
              value={state.examItemKind}
              onChange={(e) => setState((s) => ({ ...s, examItemKind: e.target.value }))}
              data-testid="select-item-kind"
            >
              {ITEM_KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tier">
            <select
              className={SELECT_CLASS}
              value={state.tier}
              onChange={(e) => setState((s) => ({ ...s, tier: e.target.value }))}
              data-testid="select-tier"
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Country">
            <select
              className={SELECT_CLASS}
              value={state.country}
              onChange={(e) => setState((s) => ({ ...s, country: e.target.value }))}
              data-testid="select-country"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              className={SELECT_CLASS}
              value={state.status}
              onChange={(e) => setState((s) => ({ ...s, status: e.target.value }))}
              data-testid="select-status"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category ID">
            <input
              className={INPUT_CLASS}
              value={state.categoryId}
              onChange={(e) => setState((s) => ({ ...s, categoryId: e.target.value }))}
              placeholder="cuid or id"
              data-testid="input-category-id"
            />
          </Field>
          <Field label="Lesson ID (optional)">
            <input
              className={INPUT_CLASS}
              value={state.lessonId ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, lessonId: e.target.value.trim() || null }))
              }
              placeholder="lesson id"
              data-testid="input-lesson-id"
            />
          </Field>
          <Field label="Deck ID (optional)">
            <input
              className={INPUT_CLASS}
              value={state.deckId ?? ""}
              onChange={(e) =>
                setState((s) => ({ ...s, deckId: e.target.value.trim() || null }))
              }
              placeholder="deck id"
              data-testid="input-deck-id"
            />
          </Field>
        </div>
      </section>

      {/* Question stem + correct rationale */}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Question
        </h2>
        <div className="space-y-4">
          <Field label="Question stem">
            <textarea
              className={`${INPUT_CLASS} min-h-[80px] resize-y`}
              value={state.questionStem}
              onChange={(e) => setState((s) => ({ ...s, questionStem: e.target.value }))}
              placeholder="Which nursing action should the nurse take first…"
              data-testid="textarea-question-stem"
            />
          </Field>
          <Field label="Correct-answer rationale (shown to learner after reveal)">
            <textarea
              className={`${INPUT_CLASS} min-h-[80px] resize-y`}
              value={state.rationaleCorrect}
              onChange={(e) => setState((s) => ({ ...s, rationaleCorrect: e.target.value }))}
              placeholder="Because airway is the top priority…"
              data-testid="textarea-rationale-correct"
            />
          </Field>
        </div>
      </section>

      {/* Answer options */}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Answer options
            </h2>
            <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">
              {isSata
                ? "SATA — click letters to toggle correct (≥ 2 required, shown in green)."
                : "MCQ — click a letter to set it as the single correct answer (shown in green)."}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)] disabled:opacity-40"
            onClick={handleAddOption}
            disabled={state.options.length >= (isSata ? 6 : 4)}
            data-testid="btn-add-option"
          >
            + Add option
          </button>
        </div>

        <div className="space-y-4" data-testid="options-list">
          {state.options.map((opt, idx) => (
            <div
              key={opt.optionKey}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4"
              data-testid={`option-row-${opt.optionKey}`}
            >
              <div className="flex items-start gap-3">
                {/* Correct-toggle badge */}
                <button
                  type="button"
                  aria-pressed={opt.isCorrect}
                  aria-label={`${opt.isCorrect ? "Deselect" : "Select"} option ${opt.optionKey} as correct`}
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    opt.isCorrect
                      ? "border-[var(--semantic-success)] bg-[var(--semantic-success)] text-white"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-brand)]"
                  }`}
                  onClick={() => handleToggleCorrect(opt.optionKey)}
                  data-testid={`btn-toggle-correct-${opt.optionKey}`}
                >
                  {opt.optionKey}
                </button>

                {/* Content + rationale */}
                <div className="flex-1 space-y-2">
                  <input
                    className={INPUT_CLASS + " w-full"}
                    value={opt.content}
                    onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                    placeholder={`Option ${opt.optionKey} text`}
                    data-testid={`input-option-content-${opt.optionKey}`}
                  />
                  {!opt.isCorrect ? (
                    <input
                      className={INPUT_CLASS + " w-full"}
                      value={opt.rationale}
                      onChange={(e) => handleRationaleChange(idx, e.target.value)}
                      placeholder={`Why option ${opt.optionKey} is wrong (distractor rationale)`}
                      data-testid={`input-option-rationale-${opt.optionKey}`}
                    />
                  ) : (
                    <p className="text-xs text-[var(--semantic-success)]">
                      ✓ Correct — uses the card-level rationale above.
                    </p>
                  )}
                </div>

                {/* Remove button */}
                {state.options.length > 3 ? (
                  <button
                    type="button"
                    aria-label={`Remove option ${opt.optionKey}`}
                    className="mt-1 rounded p-1 text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] hover:text-[var(--semantic-danger)]"
                    onClick={() => handleRemoveOption(idx)}
                    data-testid={`btn-remove-option-${opt.optionKey}`}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* SATA correct-letters summary */}
        {isSata && state.correctLetters.length > 0 ? (
          <p
            className="mt-3 text-xs text-[var(--semantic-text-muted)]"
            data-testid="sata-correct-summary"
          >
            Correct: <strong>{state.correctLetters.sort().join(", ")}</strong>
            {state.correctLetters.length < 2 ? " — SATA requires at least 2" : ""}
          </p>
        ) : null}
      </section>

      {/* Save */}
      <div className="flex items-center justify-between gap-4 border-t border-[var(--semantic-border-soft)] pt-4">
        {flashcardId && !isNew ? (
          <a
            href={`/api/admin/flashcards/${flashcardId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--semantic-text-muted)] underline underline-offset-2"
            data-testid="link-view-raw"
          >
            View raw JSON ↗
          </a>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          onClick={() => void handleSave()}
          disabled={saving}
          data-testid="btn-save"
        >
          {saving ? "Saving…" : isNew ? "Create flashcard" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
