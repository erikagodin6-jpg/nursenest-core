"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { IconX } from "./workspace-icons";

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function MobileNavDrawer({ open, onClose, children }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Auto-close when route changes (user navigated)
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!open) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) focusable[0]!.focus();
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="nn-workspace-overlay"
        data-open={open}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="nn-workspace-drawer"
        data-open={open}
        // inert suppresses tab focus when drawer is closed
        {...(!open ? { inert: "" } : {})}
      >
        <div className="nn-workspace-drawer__header">
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--semantic-text-primary)",
              letterSpacing: "-0.015em",
            }}
          >
            NurseNest
          </span>
          <button
            type="button"
            className="nn-workspace-drawer__close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <IconX />
          </button>
        </div>

        <div className="nn-workspace-drawer__scroll">
          {children}
        </div>
      </div>
    </>
  );
}
