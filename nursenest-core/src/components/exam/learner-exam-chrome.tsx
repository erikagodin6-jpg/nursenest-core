"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

/**
 * Suppresses the main learner marketing-style header during active CAT / practice-test sessions
 * so the experience feels closer to a testing environment. Shows a minimal exit strip instead.
 *
 * Important: focus mode is **pathname-only** (`/app/practice-tests/:sessionId`). The legacy
 * `?examShell=1` flag must NOT hide chrome globally — it leaked onto account/settings when
 * present in the URL and removed the main nav site-wide via `data-learner-exam-chrome`.
 */
function isFocusedPracticeTestSessionPath(pathname: string): boolean {
  // Hide learner chrome only for the live session route (`/app/practice-tests/:id`).
  // Keep chrome visible on list, start, cat-insights, and `/practice-tests/:id/results` (4 segments).
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  if (parts[0] !== "app" || parts[1] !== "practice-tests") return false;
  const leaf = parts[2] ?? "";
  if (leaf === "start" || leaf === "cat-insights") return false;
  return leaf.length > 0;
}

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
      <div className="nn-exam-minimal-nav z-50 shrink-0 flex flex-wrap items-center justify-between gap-2 border-b border-border border-l-[3px] border-l-primary/25 bg-card/95 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm lg:sticky lg:top-0">
        <span className="font-semibold tracking-tight text-foreground">Focused session</span>
        <span className="hidden max-w-xl sm:inline sm:text-[11px] sm:leading-snug sm:text-muted-foreground">
          Distractions reduced. Not an official exam interface. Practice only.
        </span>
        <Link
          href="/app"
          className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-sm hover:bg-muted"
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
