"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

/**
 * Suppresses the main learner marketing-style header during active exam-style sessions
 * so the experience feels closer to a testing environment. Shows a minimal exit strip instead.
 * Does not claim to replicate any vendor’s proprietary exam UI.
 */
function isFocusedExamSessionPath(pathname: string): boolean {
  // Hide learner chrome only for the live session route (`/app/practice-tests/:id`).
  // Keep chrome visible on start, list, history, and results routes.
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  if (parts[0] !== "app" || parts[1] !== "practice-tests") return false;
  const leaf = parts[2] ?? "";
  if (leaf === "start" || leaf === "cat-insights") return false;
  return leaf.length > 0;
}

function LearnerExamChromeGateInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const examFocus = useMemo(() => {
    const shell = searchParams.get("examShell");
    if (shell === "1" || shell === "true") return true;
    return isFocusedExamSessionPath(pathname);
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
        <div className="nn-exam-minimal-nav sticky top-0 z-50 mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border border-l-[3px] border-l-primary/25 bg-card/95 px-3 py-2.5 text-xs text-muted-foreground backdrop-blur-sm">
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
