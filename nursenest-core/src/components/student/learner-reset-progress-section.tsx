"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-t";
import { RESET_PROGRESS_CONFIRMATION_PHRASE } from "@/lib/learner/reset-progress-confirmation";

export function LearnerResetProgressSection({ t }: { t: LearnerMarketingT }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const phraseOk = phrase.trim() === RESET_PROGRESS_CONFIRMATION_PHRASE;

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setPhrase("");
    setError(null);
  }, []);

  const submitReset = useCallback(async () => {
    if (!phraseOk || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/reset-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: phrase.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(body.error ?? t("learner.studySettings.resetProgress.error"));
        return;
      }
      closeModal();
      setBanner(t("learner.studySettings.resetProgress.success"));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [busy, closeModal, phraseOk, phrase, router, t]);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--bg-card))] shadow-sm"
      aria-labelledby={titleId}
    >
      <div className="border-b border-border/60 px-5 py-4">
        <h2 id={titleId} className="text-base font-semibold text-[var(--theme-heading-text)]">
          {t("learner.studySettings.section.resetProgress")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.resetProgressSub")}</p>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm text-foreground">{t("learner.studySettings.resetProgress.intro")}</p>
        <p className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,transparent)] px-4 py-3 text-sm font-semibold text-[var(--semantic-danger)]">
          {t("learner.studySettings.resetProgress.warnPermanent")}
        </p>
        {banner ? (
          <p className="text-sm text-role-success" role="status">
            {banner}
          </p>
        ) : null}
        <button
          type="button"
          className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_45%,var(--semantic-border-soft))] bg-card px-5 py-3 text-sm font-semibold text-[var(--semantic-danger)] hover:bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--bg-card))]"
          onClick={() => {
            setBanner(null);
            setOpen(true);
          }}
        >
          {t("learner.studySettings.resetProgress.openModal")}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="w-[min(100%-2rem,28rem)] rounded-2xl border border-border bg-[var(--bg-card)] p-0 text-foreground shadow-xl backdrop:bg-black/50"
        aria-labelledby={`${titleId}-modal`}
        aria-describedby={descId}
        onClose={() => {
          setOpen(false);
          setPhrase("");
          setError(null);
        }}
        onCancel={(e) => {
          e.preventDefault();
          closeModal();
        }}
      >
        <div className="max-h-[min(90vh,32rem)] overflow-y-auto p-5">
          <h3 id={`${titleId}-modal`} className="text-base font-semibold text-[var(--theme-heading-text)]">
            {t("learner.studySettings.resetProgress.modalTitle")}
          </h3>
          <p id={descId} className="mt-2 text-sm text-muted-foreground">
            {t("learner.studySettings.resetProgress.modalLead")}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground">
            <li>{t("learner.studySettings.resetProgress.clears.lessons")}</li>
            <li>{t("learner.studySettings.resetProgress.clears.flashcards")}</li>
            <li>{t("learner.studySettings.resetProgress.clears.practiceTests")}</li>
            <li>{t("learner.studySettings.resetProgress.clears.cat")}</li>
            <li>{t("learner.studySettings.resetProgress.clears.pathway")}</li>
            <li>{t("learner.studySettings.resetProgress.clears.questionHistory")}</li>
            <li>{t("learner.studySettings.resetProgress.clears.analytics")}</li>
          </ul>
          <p className="mt-4 text-sm font-medium text-foreground">{t("learner.studySettings.resetProgress.keepsAccount")}</p>
          <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--semantic-danger)]">
            {t("learner.studySettings.resetProgress.warnCannotUndo")}
          </p>

          <label htmlFor="reset-progress-phrase" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.studySettings.resetProgress.phraseLabel")}
          </label>
          <input
            id="reset-progress-phrase"
            type="text"
            autoComplete="off"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder={t("learner.studySettings.resetProgress.phrasePlaceholder")}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.resetProgress.phraseHint")}</p>

          {error ? (
            <p className="mt-3 text-sm text-[var(--semantic-danger)]" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/40"
              onClick={() => closeModal()}
            >
              {t("learner.studySettings.resetProgress.cancel")}
            </button>
            <button
              type="button"
              disabled={!phraseOk || busy}
              onClick={() => void submitReset()}
              className="inline-flex rounded-full bg-[var(--semantic-danger)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? t("learner.studySettings.resetProgress.busy") : t("learner.studySettings.resetProgress.confirmDestructive")}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
