"use client";

import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import {
  ADMIN_COMMAND_PALETTE_ACTIONS,
  type AdminCommandPaletteAction,
} from "@/components/admin/admin-command-palette-actions";
import { isNavHrefAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import type { StaffTier } from "@/lib/auth/staff-roles";

function lessonAdminEditHref(pathname: string): string | null {
  const m = /^\/app\/lessons\/([^/]+)\/?$/.exec(pathname);
  if (!m?.[1]) return null;
  return `/admin/lessons/${encodeURIComponent(m[1])}`;
}

function isAppleLikePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const hoverByAccent: Record<AdminCommandPaletteAction["accent"], string> = {
  brand: "hover:bg-[color-mix(in_srgb,var(--semantic-info)_12%,transparent)]",
  success: "hover:bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)]",
  warning: "hover:bg-[color-mix(in_srgb,var(--semantic-warning)_10%,transparent)]",
  info: "hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_10%,transparent)]",
};

const iconByAccent: Record<AdminCommandPaletteAction["accent"], string> = {
  brand: "text-[var(--semantic-brand)]",
  success: "text-[var(--semantic-success)]",
  warning: "text-[var(--semantic-warning)]",
  info: "text-[var(--semantic-chart-3)]",
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]";

type Props = { staffTier: StaffTier };

export function AdminCommandPaletteClient({ staffTier }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  const lessonEditHref = lessonAdminEditHref(pathname);

  const filteredActions = useMemo(
    () => ADMIN_COMMAND_PALETTE_ACTIONS.filter((a) => isNavHrefAllowedForStaffTier(staffTier, a.href)),
    [staffTier],
  );

  const lessonRow = useMemo(() => {
    if (lessonEditHref && isNavHrefAllowedForStaffTier(staffTier, lessonEditHref)) {
      return { href: lessonEditHref, mode: "edit" as const };
    }
    if (isNavHrefAllowedForStaffTier(staffTier, "/admin/lessons")) {
      return { href: "/admin/lessons", mode: "browse" as const };
    }
    return null;
  }, [lessonEditHref, staffTier]);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (!d.open) d.showModal();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = isAppleLikePlatform();
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName?.toLowerCase();
        const editable =
          tag === "input" ||
          tag === "textarea" ||
          (t && "isContentEditable" in t && (t as HTMLElement).isContentEditable);
        if (editable) return;
        e.preventDefault();
        e.stopPropagation();
        const d = dialogRef.current;
        if (!d) return;
        if (d.open) {
          d.close();
        } else {
          d.showModal();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Open admin command palette"
        title=""
        className="pointer-events-auto fixed top-0 right-0 z-[560] h-14 w-14 cursor-default border-0 bg-transparent p-0 opacity-0"
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
      />

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="nn-admin-command-palette z-[570] w-[min(100vw-2rem,26rem)] max-w-[calc(100vw-2rem)] rounded-2xl border p-0 shadow-2xl open:flex open:flex-col [&::backdrop]:bg-[color-mix(in_srgb,var(--semantic-text-primary)_22%,transparent)]"
        style={{
          borderColor: "color-mix(in srgb, var(--semantic-border-soft) 85%, transparent)",
          background: "color-mix(in srgb, var(--semantic-panel-cool) 92%, var(--theme-page-bg))",
          color: "var(--semantic-text-primary)",
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="border-b px-4 py-3" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <p id={titleId} className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Admin
          </p>
          <p id={descId} className="mt-0.5 text-sm text-[var(--semantic-text-secondary)]">
            Quick navigation (role-scoped)
          </p>
        </div>
        <div className="flex max-h-[min(70vh,28rem)] flex-col gap-1 overflow-y-auto p-2">
          {lessonRow ? (
            <button
              type="button"
              className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${hoverByAccent.success} ${focusRing}`}
              onClick={() => go(lessonRow.href)}
            >
              <Pencil className={`mt-0.5 h-4 w-4 shrink-0 ${iconByAccent.success}`} aria-hidden />
              <span>
                <span className="block font-semibold">
                  {lessonRow.mode === "edit" ? "Edit this lesson" : "Lessons library"}
                </span>
                <span className="block text-xs text-[var(--semantic-text-muted)]">
                  {lessonRow.mode === "edit" ? "Open this lesson in admin" : "Browse and edit lessons"}
                </span>
              </span>
            </button>
          ) : null}

          {filteredActions.map((a) => {
            const Icon = a.Icon;
            return (
              <button
                key={a.id}
                type="button"
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${hoverByAccent[a.accent]} ${focusRing}`}
                onClick={() => go(a.href)}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconByAccent[a.accent]}`} aria-hidden />
                <span>
                  <span className="block font-semibold">{a.title}</span>
                  <span className="block text-xs text-[var(--semantic-text-muted)]">{a.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="border-t px-4 py-2 text-[11px] text-[var(--semantic-text-muted)]"
          style={{ borderColor: "var(--semantic-border-soft)" }}
        >
          <kbd className="rounded border px-1 py-0.5 font-mono text-[10px]" style={{ borderColor: "var(--semantic-border-soft)" }}>
            {isAppleLikePlatform() ? "⌘" : "Ctrl"}+K
          </kbd>{" "}
          to toggle · top-right tap zone
        </div>
      </dialog>
    </>
  );
}
