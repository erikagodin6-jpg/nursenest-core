"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

/**
 * Suppresses the main learner marketing-style header during active exam-style sessions
 * so the experience feels closer to a testing environment. Shows a minimal exit strip instead.
 * Does not claim to replicate any vendor’s proprietary exam UI.
 */
function LearnerExamChromeGateInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const examFocus = useMemo(() => {
    const shell = searchParams.get("examShell");
    if (shell === "1" || shell === "true") return true;
    if (pathname.startsWith("/app/practice-tests/") && pathname !== "/app/practice-tests") return true;
    return false;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (examFocus) {
      document.documentElement.setAttribute("data-learner-exam-chrome", "hidden");
    } else {
      document.documentElement.removeAttribute("data-learner-exam-chrome");
    }
    return () => document.documentElement.removeAttribute("data-learner-exam-chrome");
  }, [examFocus]);

  return (
    <>
      {examFocus ? (
        <div className="nn-exam-minimal-nav sticky top-0 z-50 mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/90 bg-slate-50/95 px-3 py-2 text-xs text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-300">
          <span className="font-medium text-slate-800 dark:text-slate-100">Focused session</span>
          <span className="hidden sm:inline text-slate-500">
            Distractions reduced — not an official exam replica; for practice only.
          </span>
          <Link href="/app" className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 hover:bg-white dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-900">
            Exit to app
          </Link>
        </div>
      ) : null}
      {children}
    </>
  );
}

export function LearnerExamChromeGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <LearnerExamChromeGateInner>{children}</LearnerExamChromeGateInner>
    </Suspense>
  );
}
