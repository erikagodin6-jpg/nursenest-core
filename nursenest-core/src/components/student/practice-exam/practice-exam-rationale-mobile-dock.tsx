"use client";

import React, { useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

function subscribeMinLg(onStoreChange: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMinLgSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getMinLgServerSnapshot() {
  return false;
}

function useIsMinLg() {
  return useSyncExternalStore(subscribeMinLg, getMinLgSnapshot, getMinLgServerSnapshot);
}

/**
 * Desktop: rationale column as usual. Mobile (&lt;lg): single-column question + FAB toggles bottom sheet
 * (no duplicate rationale trees — breakpoint chooses mount location).
 */
export function PracticeExamRationaleMobileDock({
  children,
  openLabel,
  sheetTitle,
}: {
  children: React.ReactNode;
  openLabel: string;
  sheetTitle: string;
}) {
  const isLg = useIsMinLg();

  if (isLg) {
    return (
      <div className="nn-practice-exam-rationale-desktop flex min-h-0 min-w-0 flex-[0_1_42%] lg:max-w-[min(40vw,26rem)] xl:max-w-[min(36vw,28rem)]">
        {children}
      </div>
    );
  }

  return (
    <MobileBottomSheet sheetTitle={sheetTitle} openLabel={openLabel}>
      {children}
    </MobileBottomSheet>
  );
}

function MobileBottomSheet({
  children,
  openLabel,
  sheetTitle,
}: {
  children: React.ReactNode;
  openLabel: string;
  sheetTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[37] bg-[color-mix(in_srgb,var(--semantic-text-primary)_45%,transparent)] lg:hidden"
          aria-label="Dismiss rationale overlay"
          onClick={close}
        />
      ) : null}

      <div
        id={dialogId}
        className={`fixed inset-x-0 bottom-0 z-[38] flex max-h-[min(82dvh,36rem)] flex-col lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`nn-practice-exam-rationale-sheet--premium flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] px-4 py-2.5">
            <p id={titleId} className="m-0 text-sm font-semibold text-[var(--semantic-text-primary)]">
              {sheetTitle}
            </p>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-text-primary)_7%,var(--semantic-surface))]"
              onClick={() => setOpen(false)}
              aria-expanded={open}
            >
              <ChevronDown className="h-5 w-5 rotate-180" aria-hidden />
              <span className="sr-only">Close rationale panel</span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
            {children}
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[39] flex justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
        <button
          type="button"
          className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)] backdrop-blur-sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={dialogId}
        >
          <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
          {open ? sheetTitle : openLabel}
        </button>
      </div>
    </>
  );
}
