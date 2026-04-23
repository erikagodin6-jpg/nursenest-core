"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";
import { BRAND_MOTION, BRAND_MOTION_DISTANCE_PX, EASE_LUXURY } from "./tokens";
import { useReducedMotion } from "./use-reduced-motion";
import { usePreviousPathname } from "./use-previous-pathname";

const DURATION = BRAND_MOTION.heroRevealSec;
const ENTER_Y = Math.min(6, BRAND_MOTION_DISTANCE_PX.fadeUp);

export type PageTransitionShellProps = {
  children: ReactNode;
  /** When true, no motion wrapper (pass-through). */
  disabled?: boolean;
  /** Return true to skip transition for this pathname (e.g. question runner). */
  shouldDisableTransition?: (pathname: string) => boolean;
};

/**
 * Subtle route transition: translateY only (opacity stays 1 so marketing shell never “blinks”).
 * First paint / direct loads: no enter animation (avoids hydration mismatch and flash).
 * `prefers-reduced-motion`: pass-through, no animation.
 */
export function PageTransitionShell({
  children,
  disabled = false,
  shouldDisableTransition,
}: PageTransitionShellProps) {
  const pathname = usePathname() ?? "";
  const reduced = useReducedMotion();
  const previousPathname = usePreviousPathname(pathname);
  const marketingMobileNarrow = useMarketingMobilePerfIsMobile() === true;

  const excluded =
    disabled ||
    reduced ||
    marketingMobileNarrow ||
    (shouldDisableTransition?.(pathname) ?? false);

  const shouldAnimateEnter =
    !excluded &&
    previousPathname !== undefined &&
    previousPathname !== pathname;

  if (excluded) {
    return children;
  }

  return (
    <motion.div
      key={pathname}
      initial={shouldAnimateEnter ? { opacity: 1, y: ENTER_Y } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION, ease: EASE_LUXURY }}
      className="min-h-0"
    >
      {children}
    </motion.div>
  );
}

/** Practice test runner: `/app/practice-tests/:id` but not `start`, `cat-insights`, or `.../results`. */
function isPracticeTestRunnerPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  if (parts[0] !== "app" || parts[1] !== "practice-tests") return false;
  const seg = parts[2] ?? "";
  if (seg === "start" || seg === "cat-insights") return false;
  return true;
}

/** Interactive strategy question session (not the hub at `/app/strategy`). */
function isStrategySessionPath(pathname: string): boolean {
  return /^\/app\/strategy\/[^/]+$/.test(pathname);
}

/**
 * Learner shell: skip transitions on active study / exam-style flows.
 */
export function learnerShellShouldDisablePageTransition(pathname: string): boolean {
  if (pathname === "/app/questions" || pathname === "/app/questions/bank") return true;
  if (pathname.startsWith("/app/baseline-assessment")) return true;
  if (isPracticeTestRunnerPath(pathname)) return true;
  if (isStrategySessionPath(pathname)) return true;
  /** Lesson reading: single-lesson routes only (hub list keeps a light transition). */
  if (/^\/app\/lessons\/.+/.test(pathname)) return true;
  /** Active flashcard deck (not the weak-areas hub). */
  const flashDeck = pathname.match(/^\/app\/flashcards\/([^/]+)$/);
  if (flashDeck && flashDeck[1] !== "weak-areas") return true;
  return false;
}
