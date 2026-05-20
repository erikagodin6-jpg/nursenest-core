"use client";

import type { ReactNode } from "react";

export type DraftEditorNavItem = { id: string; label: string };

function safeAnchorId(id: string): string {
  return id.trim().replace(/[^a-zA-Z0-9_-]/g, "-") || "section";
}

export function AdminBlogDraftEditorShell({
  navItems,
  previewOpen,
  onTogglePreview,
  previewPanel,
  children,
}: {
  navItems: DraftEditorNavItem[];
  previewOpen: boolean;
  onTogglePreview: () => void;
  previewPanel: ReactNode;
  children: ReactNode;
}) {
  const safeNavItems = navItems
    .map((item) => ({
      id: safeAnchorId(item.id),
      label: item.label.trim() || "Untitled section",
    }))
    .filter((item) => item.id.length > 0);

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
      <aside className="xl:sticky xl:top-20 xl:z-10 xl:w-56 xl:shrink-0">
        <div className="rounded-2xl border border-border/80 bg-[var(--theme-card-bg)]/95 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Draft sections
          </p>

          {safeNavItems.length > 0 ? (
            <nav
              className="mt-3 flex max-h-[min(70vh,32rem)] flex-col gap-0.5 overflow-y-auto pr-1 text-sm"
              aria-label="Jump to draft section"
            >
              {safeNavItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : (
            <p className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              No draft sections yet.
            </p>
          )}

          <button
            type="button"
            onClick={onTogglePreview}
            className="mt-4 w-full rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
            aria-pressed={previewOpen}
          >
            {previewOpen ? "Hide article preview" : "Preview article layout"}
          </button>

          <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
            Preview approximates the public blog article shell (admin-only, not indexed).
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-8">{children}</div>

      {previewOpen ? (
        <aside className="xl:sticky xl:top-20 xl:z-10 xl:w-[min(100%,440px)] xl:shrink-0">
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-1 shadow-inner">
            <div className="max-h-[min(85vh,56rem)] overflow-y-auto rounded-[14px] bg-[var(--theme-page-bg)] p-4">
              {previewPanel}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export function DraftSectionCard({
  id,
  title,
  description,
  actions,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const safeId = safeAnchorId(id);
  const safeTitle = title.trim() || "Untitled section";

  return (
    <section
      id={safeId}
      className="scroll-mt-24 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[var(--theme-heading-text)]">
            {safeTitle}
          </h3>

          {description ? (
            <p className="mt-1 max-w-prose text-[11px] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      <div className="pt-4">{children}</div>
    </section>
  );
}