"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";

export function AdminShell({
  children,
  strip,
  queuedBlogHint,
  pendingAiHint,
  userLabel,
}: {
  children: React.ReactNode;
  strip: React.ReactNode;
  queuedBlogHint?: number;
  pendingAiHint?: number;
  userLabel?: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--theme-page-bg)]">
      <AdminSidebarNav
        id="admin-sidebar"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        queuedBlogHint={queuedBlogHint}
        pendingAiHint={pendingAiHint}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/80 bg-[var(--theme-card-bg)]/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-[var(--theme-card-bg)]/80 lg:h-16 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="admin-sidebar"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-4 w-4 shrink-0" aria-hidden />
              Menu
            </button>
            <div className="hidden min-w-0 lg:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Console</p>
              <p className="truncate text-sm font-semibold text-[var(--theme-heading-text)]">Operational control center</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm">
            {userLabel ? (
              <span className="hidden max-w-[200px] truncate text-muted-foreground sm:inline" title={userLabel}>
                {userLabel}
              </span>
            ) : null}
            <Link
              href="/"
              className="rounded-lg border border-border/80 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted/60 sm:text-sm"
            >
              View site
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 sm:text-sm"
            >
              Learner app
            </Link>
          </div>
        </header>
        {strip}
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
