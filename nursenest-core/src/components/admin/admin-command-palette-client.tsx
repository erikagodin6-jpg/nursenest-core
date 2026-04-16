"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Database, LayoutDashboard, Pencil } from "lucide-react";

function lessonAdminEditHref(pathname: string): string | null {
  const m = /^\/app\/lessons\/([^/]+)\/?$/.exec(pathname);
  if (!m?.[1]) return null;
  return `/admin/lessons/${encodeURIComponent(m[1])}`;
}

function isAppleLikePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function AdminCommandPaletteClient() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  const lessonEditHref = lessonAdminEditHref(pathname);

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
        aria-label="Open staff command palette"
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
            Staff
          </p>
          <p id={descId} className="mt-0.5 text-sm text-[var(--semantic-text-secondary)]">
            Quick navigation
          </p>
        </div>
        <div className="flex flex-col gap-1 p-2">
          <button
            type="button"
            className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-info)_12%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
            onClick={() => go("/admin")}
          >
            <LayoutDashboard
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]"
              aria-hidden
            />
            <span>
              <span className="block font-semibold">Admin dashboard</span>
              <span className="block text-xs text-[var(--semantic-text-muted)]">Open /admin overview</span>
            </span>
          </button>

          {lessonEditHref ? (
            <button
              type="button"
              className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
              onClick={() => go(lessonEditHref)}
            >
              <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              <span>
                <span className="block font-semibold">Edit this lesson</span>
                <span className="block text-xs text-[var(--semantic-text-muted)]">Pathway / content lesson in admin</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
              onClick={() => go("/admin/lessons")}
            >
              <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              <span>
                <span className="block font-semibold">Lessons library</span>
                <span className="block text-xs text-[var(--semantic-text-muted)]">Browse and edit lessons</span>
              </span>
            </button>
          )}

          <button
            type="button"
            className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-warning)_10%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--semantic-brand)]"
            onClick={() => go("/admin/content")}
          >
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
            <span>
              <span className="block font-semibold">Content &amp; coverage</span>
              <span className="block text-xs text-[var(--semantic-text-muted)]">Metrics and pathway snapshot</span>
            </span>
          </button>
        </div>
        <div className="border-t px-4 py-2 text-[11px] text-[var(--semantic-text-muted)]" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <kbd className="rounded border px-1 py-0.5 font-mono text-[10px]" style={{ borderColor: "var(--semantic-border-soft)" }}>
            {isAppleLikePlatform() ? "⌘" : "Ctrl"}+K
          </kbd>{" "}
          to toggle · top-right tap zone
        </div>
      </dialog>
    </>
  );
}
