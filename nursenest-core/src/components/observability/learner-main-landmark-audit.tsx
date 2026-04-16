"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLearnerShell } from "@/lib/navigation/learner-shell";

/**
 * Temporary diagnostics: `app/not-found` and nested error UIs must not render a second `<main>`
 * inside `(learner)/layout`’s `#nn-learner-main`. Logs when `/app` has !== 1 `<main>` in the document.
 * Remove once duplicate-main regressions are ruled out in production.
 */
export function LearnerMainLandmarkAudit() {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (!isLearnerShell(pathname)) return;
    const mains = [...document.querySelectorAll("main")];
    if (mains.length === 1) return;
    const detail = mains.map((el, index) => ({
      index,
      id: el.id || null,
      className: el.className,
      parentTag: el.parentElement?.nodeName ?? null,
      parentId: el.parentElement?.id || null,
      parentClass: el.parentElement?.className?.slice(0, 160) ?? null,
      outerHTML: el.outerHTML.slice(0, 400),
    }));
    console.warn(`[nn-learner-main-audit] pathname=${pathname} mainCount=${mains.length}`, detail);
  }, [pathname]);

  return null;
}
