"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { learnerShellFlags } from "@/lib/learner/learner-shell-mode";

/**
 * Suppresses the main learner chrome during active exam and flashcard study sessions,
 * replacing it with a single "← Return to [Tier] Hub" action. The `hubLabel` prop
 * comes from the server layout (derived via `getSessionHubLabel`) so the label is
 * always tier-accurate without client-side fetching.
 */
export function LearnerExamChromeGate({
  children,
  hubLabel = "Hub",
}: {
  children: React.ReactNode;
  hubLabel?: string;
}) {
  const pathname = usePathname() ?? "";
  const examFocus = useMemo(() => learnerShellFlags(pathname).suppressFullChrome, [pathname]);

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

  return (
    <div className="nn-learner-exam-focus-column flex min-h-0 flex-col h-[100dvh] max-h-[100dvh] overflow-hidden">
      <div
        className="nn-exam-minimal-nav z-50 flex shrink-0 items-center gap-3 border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 shadow-sm"
        data-nn-cat-minimal-brand-shell=""
      >
        <Link
          href="/app"
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] px-3 py-1.5 text-[11px] font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_72%,var(--semantic-surface))]"
          aria-label={`Return to ${hubLabel}`}
        >
          ← Return to {hubLabel}
        </Link>
        <span className="hidden text-[11px] text-[var(--semantic-text-muted)] sm:block">
          Focused study mode — distractions reduced
        </span>
      </div>
      <div className="nn-learner-exam-focus-body min-h-0 flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
