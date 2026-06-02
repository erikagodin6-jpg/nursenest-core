"use client";

import { Mail } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME_COPY, supportMailtoHref } from "@/lib/support/support-policy";

/**
 * Header entry for learner shell: email support only (no in-app support chat / feedback modal).
 */
export function SupportEmailHeaderLink({ className = "" }: { className?: string }) {
  const href = supportMailtoHref();
  return (
    <a
      href={href}
      className={`nn-support-email-header-link inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 text-sm font-medium text-foreground/90 transition-colors hover:bg-[var(--surface-interactive-hover)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${className}`}
      aria-label={`Email NurseNest support at ${SUPPORT_EMAIL}. ${SUPPORT_RESPONSE_TIME_COPY}`}
    >
      <Mail className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden strokeWidth={2} />
      <span className="hidden sm:inline">Support</span>
      <span className="sm:hidden">Support</span>
    </a>
  );
}
