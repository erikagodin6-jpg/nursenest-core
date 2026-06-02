"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  children: React.ReactNode;
  /** Variant-specific panel chrome (still token-driven). */
  panelClassName?: string;
};

/**
 * Mobile navigation sheet — dialog semantics with focus trap (minimal).
 * Mirrors marketing header overlay stacking (`z-[200]` band).
 */
export function FigmaPreviewNavMobileSheet({
  open,
  onClose,
  titleId,
  children,
  panelClassName = "",
}: Props) {
  const autoTitleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevActive.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      prevActive.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const labelledBy = titleId ?? autoTitleId;

  return createPortal(
    <div className="nn-header-overlay-mobile-only fixed inset-0 z-[200]">
      <button
        type="button"
        className="absolute inset-0 touch-manipulation bg-black/50"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`absolute inset-y-0 end-0 flex w-[min(100%,20rem)] flex-col border-s border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[var(--background)] shadow-[var(--elevation-overlay)] transition-transform duration-300 ease-out ${panelClassName}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] px-4 py-3">
          <p id={labelledBy} className="text-base font-semibold text-[var(--foreground)]">
            Menu
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
