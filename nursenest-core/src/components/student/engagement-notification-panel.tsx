"use client";

/**
 * EngagementNotificationPanel — bell icon with dropdown panel.
 *
 * Shows smart engagement nudges computed from the learner's study state.
 * Non-intrusive: small bell in the header, opens a clean dropdown.
 * Each notification is dismissable and has a clickable action.
 *
 * Tone: supportive, calm, encouraging. Never stressful or spammy.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  X,
  Flame,
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useEngagementNudges } from "@/lib/retention/use-engagement-nudges";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { EngagementNudgeKind } from "@/lib/retention/engagement-triggers";

const ICON_MAP: Record<EngagementNudgeKind, React.ReactNode> = {
  inactive_24h: <BookOpen className="h-4 w-4" />,
  inactive_48h: <BookOpen className="h-4 w-4" />,
  streak_protect: <Flame className="h-4 w-4" />,
  streak_milestone: <Flame className="h-4 w-4" />,
  weak_area_review: <Target className="h-4 w-4" />,
  improvement: <TrendingUp className="h-4 w-4" />,
  near_exam: <Calendar className="h-4 w-4" />,
  flashcard_due: <Layers className="h-4 w-4" />,
  continue_plan: <BookOpen className="h-4 w-4" />,
  first_session: <BookOpen className="h-4 w-4" />,
};

const TONE_COLORS: Record<string, string> = {
  info: "var(--semantic-info)",
  success: "var(--semantic-success)",
  warning: "var(--semantic-warning)",
  encourage: "var(--semantic-brand)",
};

export function EngagementNotificationPanel() {
  const { nudges, loading, dismiss, unreadCount } = useEngagementNudges();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  function handleBellClick() {
    setOpen((prev) => !prev);
    if (!open) {
      trackClientEvent("notification_panel_opened", {
        nudge_count: unreadCount,
      });
    }
  }

  function handleNudgeClick(kind: string) {
    trackClientEvent("engagement_nudge_clicked", { kind });
    setOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={handleBellClick}
        className="nn-notification-bell"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} new)` : ""}`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="nn-notification-badge" aria-hidden>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="nn-notification-panel" role="region" aria-label="Notifications">
          <div className="nn-notification-panel__header">
            <h3 className="text-sm font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
              Study Reminders
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 transition hover:opacity-70"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" style={{ color: "var(--semantic-text-muted)" }} />
            </button>
          </div>

          <div className="nn-notification-panel__body">
            {loading && (
              <p className="px-4 py-6 text-center text-sm" style={{ color: "var(--semantic-text-muted)" }}>
                Loading…
              </p>
            )}

            {!loading && nudges.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium" style={{ color: "var(--semantic-text-primary)" }}>
                  You're all caught up
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--semantic-text-muted)" }}>
                  Keep studying — we'll remind you when something needs attention.
                </p>
              </div>
            )}

            {nudges.map((nudge) => {
              const accentColor = TONE_COLORS[nudge.tone] ?? "var(--semantic-info)";
              return (
                <div
                  key={nudge.kind}
                  className="nn-notification-item"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: `color-mix(in srgb, ${accentColor} 12%, var(--semantic-surface))`,
                        color: accentColor,
                      }}
                    >
                      {ICON_MAP[nudge.kind] ?? <Bell className="h-4 w-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold leading-tight"
                        style={{ color: "var(--semantic-text-primary)" }}
                      >
                        {nudge.headline}
                      </p>
                      <p
                        className="mt-0.5 text-xs leading-relaxed"
                        style={{ color: "var(--semantic-text-muted)" }}
                      >
                        {nudge.body}
                      </p>
                      <Link
                        href={nudge.href}
                        onClick={() => handleNudgeClick(nudge.kind)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold transition hover:opacity-80"
                        style={{ color: accentColor }}
                      >
                        {nudge.ctaLabel}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => dismiss(nudge.kind)}
                      className="shrink-0 rounded-md p-1 opacity-0 transition group-hover:opacity-100 hover:opacity-70"
                      style={{ color: "var(--semantic-text-muted)" }}
                      aria-label={`Dismiss ${nudge.headline}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
