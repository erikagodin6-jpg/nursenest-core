"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";

const THEME_IDS = new Set(THEME_OPTIONS.map((o) => o.id));

function resolveThemeParam(raw: string | null): string {
  const t = raw?.trim() ?? "";
  return THEME_IDS.has(t) ? t : NURSENEST_DEFAULT_THEME;
}

function HomepageLivePreviewInner() {
  const sp = useSearchParams();
  const theme = useMemo(() => resolveThemeParam(sp.get("theme")), [sp]);

  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
      else document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  const themeLabel =
    theme === "mint-blossom" || theme === "blossom"
      ? "Mint Blossom"
      : theme === "ocean"
        ? "Ocean"
        : theme === "midnight"
          ? "Midnight"
          : theme;

  return (
    <div className="min-h-0 min-w-0">
      <p className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--semantic-surface)]/95 px-4 py-2 text-center text-xs font-medium text-[var(--semantic-text-muted)] backdrop-blur-sm">
        QA preview · homepage branding · theme <span className="tabular-nums">{themeLabel}</span>
      </p>
      <iframe
        title={`NurseNest homepage — ${themeLabel}`}
        src="/"
        className="block min-h-[100dvh] w-full border-0"
      />
    </div>
  );
}

export function HomepageLivePreview() {
  return (
    <Suspense fallback={<p className="p-6 text-center text-sm text-[var(--semantic-text-muted)]">Loading preview…</p>}>
      <HomepageLivePreviewInner />
    </Suspense>
  );
}
