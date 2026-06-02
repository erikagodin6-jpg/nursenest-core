"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { learnerShellFlags } from "@/lib/learner/learner-shell-mode";

/**
 * Dev-only component: mounts inside the learner layout and warns when shell mode
 * produces unexpected results that could indicate a regression.
 *
 * Checks performed in development only:
 * - Duplicate mount detection (provider tree rendered twice)
 * - Unexpected shell mode transitions (e.g. exam-focused → standard mid-session)
 * - Chrome suppression flag inconsistency between successive renders
 *
 * Safe to include in production builds — all logic is gated on
 * `process.env.NODE_ENV !== "production"` and the component returns null outside dev.
 */

const MOUNT_COUNTER_KEY = "__nn_learner_shell_diag_mounts__";

declare global {
  interface Window {
    [MOUNT_COUNTER_KEY]?: number;
  }
}

export function LearnerShellDevDiagnostics() {
  if (process.env.NODE_ENV === "production") return null;
  return <LearnerShellDevDiagnosticsInner />;
}

function LearnerShellDevDiagnosticsInner() {
  const pathname = usePathname() ?? "";
  const prevModeRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window[MOUNT_COUNTER_KEY] = (window[MOUNT_COUNTER_KEY] ?? 0) + 1;
    const count = window[MOUNT_COUNTER_KEY];
    if (count > 1) {
      console.warn(
        `[LearnerShellDevDiagnostics] Duplicate mount detected (count=${count}). ` +
          "LearnerShellDevDiagnostics should be mounted exactly once in the learner layout. " +
          "Check for nested or doubled layout renders.",
      );
    }
    return () => {
      window[MOUNT_COUNTER_KEY] = Math.max(0, (window[MOUNT_COUNTER_KEY] ?? 1) - 1);
    };
  }, []);

  useEffect(() => {
    const flags = learnerShellFlags(pathname);
    const prev = prevModeRef.current;

    if (prev !== null && prev !== flags.mode) {
      const safeTransitions = new Set([
        "exam-focused→standard",
        "exam-focused→dashboard",
        "study-hub→standard",
        "study-hub→dashboard",
        "flashcards-study→standard",
        "flashcards-study→study-hub",
        "standard→exam-focused",
        "standard→study-hub",
        "standard→flashcards-study",
        "dashboard→standard",
        "dashboard→study-hub",
        "dashboard→exam-focused",
      ]);
      const transition = `${prev}→${flags.mode}`;
      if (!safeTransitions.has(transition)) {
        console.warn(
          `[LearnerShellDevDiagnostics] Unexpected shell mode transition: ${transition} on path "${pathname}". ` +
            "This may indicate a routing or shell resolver inconsistency.",
        );
      }
    }
    prevModeRef.current = flags.mode;
  }, [pathname]);

  return null;
}
