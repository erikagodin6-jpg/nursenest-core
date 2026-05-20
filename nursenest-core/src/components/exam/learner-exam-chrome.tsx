"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { isFocusedPracticeTestSessionPath } from "@/lib/learner/focused-exam-shell";

/**
 * Suppresses the main learner marketing-style header during active CAT / practice-test sessions
 * so the experience feels closer to a testing environment. Shows a minimal exit strip instead.
 *
 * Important: focus mode is **pathname-only** (`/app/practice-tests/:sessionId`). The legacy
 * `?examShell=1` flag must NOT hide chrome globally — it leaked onto account/settings when
 * present in the URL and removed the main nav site-wide via `data-learner-exam-chrome`.
 */
export function LearnerExamChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const examFocus = useMemo(() => isFocusedPracticeTestSessionPath(pathname), [pathname]);

  useEffect(() => {
    if (examFocus) {
      document.documentElement.setAttribute("data-learner-exam-chrome", "hidden");
    } else {
      document.documentElement.removeAttribute("data-learner-exam-chrome");
    }
    return () => document.documentElement.removeAttribute("data-learner-exam-chrome");
  }, [examFocus]);

  if (!examFocus) {
    return <>{children}</>;
  }

  /**
   * Laptop+: lock the focused practice-test column to the dynamic viewport so inner
   * `nn-practice-session` can use flex-1 instead of fragile `calc(100dvh - …)` totals
   * (minimal nav + shell padding + page wrappers must not exceed one viewport height).
   */
  return (
    <div className="nn-learner-exam-focus-column flex min-h-0 flex-col lg:h-[100dvh] lg:max-h-[100dvh] lg:overflow-hidden">
      <div
        className="nn-exam-minimal-nav z-50 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--semantic-border-soft)] border-l-[3px] border-l-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-surface)_96%,transparent)] px-3 py-1.5 text-xs text-[var(--semantic-text-muted)] shadow-sm backdrop-blur-sm lg:sticky lg:top-0"
        data-nn-cat-minimal-brand-shell=""
      >
        <Link
          href="/app"
          className="inline-flex min-h-10 min-w-0 items-center gap-2 overflow-visible bg-transparent text-[var(--semantic-text-primary)] hover:opacity-90"
          aria-label="Exit focused exam mode to NurseNest dashboard"
        >
          <SiteBrandLogoMark variant="learner" />
          <span className="font-semibold tracking-tight">NurseNest</span>
        </Link>
        <span className="hidden max-w-xl sm:inline sm:text-[11px] sm:leading-snug sm:text-muted-foreground">
          Licensing-style practice mode. Distractions reduced; practice only.
        </span>
        <Link
          href="/app"
          className="shrink-0 rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] px-3 py-1.5 text-[11px] font-semibold text-[var(--semantic-text-primary)] shadow-sm hover:bg-[var(--semantic-surface-alt)]"
        >
          Exit
        </Link>
      </div>
      <div className="nn-learner-exam-focus-body min-h-0 flex flex-1 flex-col lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
