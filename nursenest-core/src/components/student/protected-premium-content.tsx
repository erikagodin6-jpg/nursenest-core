"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

/** Must match `surfaceSchema` in `/api/learner/protection-telemetry`. */
export type PremiumProtectionTelemetrySurface =
  | "question_bank"
  | "practice_test"
  | "flashcards"
  | "pathway_lesson"
  | "content_lesson"
  | "unknown";

const TELEMETRY_FLUSH_MS = 22_000;
const PRINT_TELEMETRY_COOLDOWN_MS = 12_000;
const BLUR_TELEMETRY_COOLDOWN_MS = 45_000;

function usePremiumProtectionTelemetry(surface: PremiumProtectionTelemetrySurface | undefined) {
  const bufferRef = useRef(new Map<string, number>());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surfaceRef = useRef(surface);
  useEffect(() => {
    surfaceRef.current = surface;
  }, [surface]);

  const flush = useCallback(async () => {
    const surf = surfaceRef.current;
    if (!surf) return;
    const buf = bufferRef.current;
    if (buf.size === 0) return;
    const items = [...buf.entries()].map(([key, count]) => {
      const [metricKey, s] = key.split("\t");
      return { metricKey, surface: s as PremiumProtectionTelemetrySurface, count };
    });
    buf.clear();
    try {
      await fetch("/api/learner/protection-telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ items }),
      });
    } catch {
      /* non-blocking */
    }
  }, []);

  const queue = useCallback(
    (metricKey: string, add = 1) => {
      const surf = surfaceRef.current;
      if (!surf) return;
      const key = `${metricKey}\t${surf}`;
      bufferRef.current.set(key, (bufferRef.current.get(key) ?? 0) + add);
      if (!flushTimerRef.current) {
        flushTimerRef.current = setTimeout(() => {
          flushTimerRef.current = null;
          void flush();
        }, TELEMETRY_FLUSH_MS);
      }
    },
    [flush],
  );

  useEffect(() => {
    if (!surface) return;
    const beaconFlush = () => {
      const surf = surfaceRef.current;
      if (!surf) return;
      const buf = bufferRef.current;
      if (buf.size === 0) return;
      const items = [...buf.entries()].map(([key, count]) => {
        const [metricKey, s] = key.split("\t");
        return { metricKey, surface: s, count };
      });
      buf.clear();
      const body = JSON.stringify({ items });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/learner/protection-telemetry", new Blob([body], { type: "application/json" }));
      }
    };
    window.addEventListener("pagehide", beaconFlush);
    return () => {
      window.removeEventListener("pagehide", beaconFlush);
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      void flush();
    };
  }, [surface, flush]);

  return { queue, flush };
}

function isNotesEditorTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  return Boolean(target.closest("[data-notes-editor]"));
}

function isFormControl(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  const el = target as HTMLElement;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

type Props = {
  children: React.ReactNode;
  userLabel: string;
  flags: PremiumProtectionFlags;
  className?: string;
  /** Screen-reader-only label for the protected region. */
  ariaLabel?: string;
  /** When set, aggregates anonymous deterrence counters for admin rollups (debounced). */
  telemetrySurface?: PremiumProtectionTelemetrySurface;
};

/**
 * Deterrence only: reduces casual copy/paste and drag; does not prevent screenshots or determined extraction.
 */
export function ProtectedPremiumContent({
  children,
  userLabel,
  flags,
  className = "",
  ariaLabel = "Premium study content",
  telemetrySurface,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingId = useId();
  const lastPrintTelemetryAt = useRef(0);
  const lastBlurTelemetryAt = useRef(0);
  const { queue } = usePremiumProtectionTelemetry(telemetrySurface);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  }, []);

  useEffect(() => {
    if (!flags.copyDeterrence) return;

    const onCopyCapture = (e: ClipboardEvent) => {
      if (isNotesEditorTarget(e.target)) return;
      const root = rootRef.current;
      if (!root || !(e.target instanceof Node) || !root.contains(e.target)) return;
      if (isFormControl(e.target) && isNotesEditorTarget(e.target)) return;
      e.preventDefault();
      queue("copy_blocked");
      showToast("Copying is disabled for premium study content. You can save notes instead.");
    };

    const onCutCapture = (e: ClipboardEvent) => {
      if (isNotesEditorTarget(e.target)) return;
      const root = rootRef.current;
      if (!root || !(e.target instanceof Node) || !root.contains(e.target)) return;
      e.preventDefault();
      queue("cut_blocked");
      showToast("Copying is disabled for premium study content. You can save notes instead.");
    };

    const onContextMenu = (e: MouseEvent) => {
      if (isNotesEditorTarget(e.target)) return;
      const root = rootRef.current;
      if (!root || !(e.target instanceof Node) || !root.contains(e.target)) return;
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      if (isNotesEditorTarget(e.target)) return;
      const root = rootRef.current;
      if (!root || !(e.target instanceof Node) || !root.contains(e.target)) return;
      e.preventDefault();
    };

    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (isNotesEditorTarget(e.target)) return;
      const root = rootRef.current;
      if (!root || !(e.target instanceof Node) || !root.contains(e.target)) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")) {
        e.preventDefault();
        if (e.key === "x" || e.key === "X") queue("cut_blocked");
        else queue("copy_blocked");
        showToast("Copying is disabled for premium study content. You can save notes instead.");
      }
    };

    document.addEventListener("copy", onCopyCapture, true);
    document.addEventListener("cut", onCutCapture, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("keydown", onKeyDownCapture, true);

    return () => {
      document.removeEventListener("copy", onCopyCapture, true);
      document.removeEventListener("cut", onCutCapture, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("keydown", onKeyDownCapture, true);
    };
  }, [flags.copyDeterrence, queue, showToast]);

  useEffect(() => {
    if (!flags.copyDeterrence) return;
    const root = rootRef.current;
    if (!root) return;
    const onSelectStart = (e: Event) => {
      if (isNotesEditorTarget(e.target)) return;
      if (!(e.target instanceof Node) || !root.contains(e.target)) return;
      if (isFormControl(e.target)) return;
      e.preventDefault();
    };
    root.addEventListener("selectstart", onSelectStart);
    return () => root.removeEventListener("selectstart", onSelectStart);
  }, [flags.copyDeterrence]);

  useEffect(() => {
    if (!flags.hideProtectedOnPrint) return;
    const onBeforePrint = () => {
      const now = Date.now();
      if (now - lastPrintTelemetryAt.current >= PRINT_TELEMETRY_COOLDOWN_MS) {
        lastPrintTelemetryAt.current = now;
        queue("print_prompt");
      }
      showToast("Protected lesson and rationale content cannot be printed. You can print your notes.");
    };
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, [flags.hideProtectedOnPrint, queue, showToast]);

  useEffect(() => {
    if (!flags.blurOnHiddenTab) return;
    const onVis = () => {
      const root = rootRef.current;
      if (!root) return;
      if (document.visibilityState === "hidden") {
        root.style.filter = "blur(6px)";
        root.style.transition = "filter 0.2s ease";
        const now = Date.now();
        if (now - lastBlurTelemetryAt.current >= BLUR_TELEMETRY_COOLDOWN_MS) {
          lastBlurTelemetryAt.current = now;
          queue("tab_blur_applied");
        }
      } else {
        root.style.filter = "";
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [flags.blurOnHiddenTab, queue]);

  const ts = new Date().toISOString().slice(0, 19).replace("T", " ");

  return (
    <div className={`relative ${className}`}>
      <div
        ref={rootRef}
        className={`nn-protected-premium-surface relative overflow-hidden rounded-xl ${flags.copyDeterrence ? "select-none" : ""} ${flags.hideProtectedOnPrint ? "print:hidden" : ""}`}
        aria-labelledby={headingId}
      >
        <span id={headingId} className="sr-only">
          {ariaLabel}
        </span>
        {flags.watermark ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-[0.12]"
            aria-hidden
          >
            <div className="absolute right-2 top-2 max-w-[min(100%,240px)] text-right text-[10px] font-medium leading-tight text-foreground">
              {userLabel}
              <br />
              {ts} UTC
              <br />
              <span className="text-[9px]">For individual study use only</span>
            </div>
            <div
              className="absolute left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] text-center text-[10px] font-medium leading-[3rem] text-foreground opacity-40"
            >
              {`${userLabel} · ${ts} · subscriber`}
            </div>
          </div>
        ) : null}
        <div className="relative z-[2]">{children}</div>
      </div>
      {toast ? (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-[100] max-w-md -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-lg md:bottom-8"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
