"use client";

/**
 * EngagementNudgeStrip — inline engagement nudges for the dashboard.
 *
 * Shows 1-3 top-priority nudges as compact, supportive cards below the
 * daily momentum section. Each card is dismissable and has a clear CTA.
 *
 * Design: calm, encouraging, themed. Uses nn-engagement-nudge CSS classes.
 */

import Link from "next/link";
import {
  Bell,
  Flame,
  BookOpen,
  Target,
  Calendar,
  TrendingUp,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";
import { useEngagementNudges } from "@/lib/retention/use-engagement-nudges";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { EngagementNudgeKind } from "@/lib/retention/engagement-triggers";

const ICON_MAP: Record<EngagementNudgeKind, React.ReactNode> = {
  inactive_24h: <BookOpen className="h-5 w-5" />,
  inactive_48h: <BookOpen className="h-5 w-5" />,
  streak_protect: <Flame className="h-5 w-5" />,
  streak_milestone: <Flame className="h-5 w-5" />,
  weak_area_review: <Target className="h-5 w-5" />,
  improvement: <TrendingUp className="h-5 w-5" />,
  near_exam: <Calendar className="h-5 w-5" />,
  flashcard_due: <Layers className="h-5 w-5" />,
  continue_plan: <BookOpen className="h-5 w-5" />,
  first_session: <BookOpen className="h-5 w-5" />,
};

const TONE_COLORS: Record<string, string> = {
  info: "var(--semantic-info)",
  success: "var(--semantic-success)",
  warning: "var(--semantic-warning)",
  encourage: "var(--semantic-brand)",
};

export function EngagementNudgeStrip({
  maxItems = 3,
  includeWeaknessAlerts = true,
  includeDecayAlerts = true,
}: {
  maxItems?: number;
  includeWeaknessAlerts?: boolean;
  includeDecayAlerts?: boolean;
}) {
  const { nudges, loading, dismiss } = useEngagementNudges();

  const filtered = nudges.filter((nudge) => {
    if (!includeWeaknessAlerts && nudge.kind === "weak_area_review") return false;
    if (!includeDecayAlerts && nudge.kind === "flashcard_due") return false;
    return true;
  });

  if (loading || filtered.length === 0) return null;

  const visible = filtered.slice(0, maxItems);

  return (
    <section aria-label="Study reminders" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((nudge) => {
        const color = TONE_COLORS[nudge.tone] ?? "var(--semantic-info)";
        return (
          <div key={nudge.kind} className="nn-engagement-nudge group relative">
            <div
              className="nn-engagement-nudge__icon"
              style={{
                background: `color-mix(in srgb, ${color} 12%, var(--semantic-surface))`,
                color,
              }}
            >
              {ICON_MAP[nudge.kind] ?? <Bell className="h-5 w-5" />}
            </div>

            <div className="nn-engagement-nudge__content">
              <p className="nn-engagement-nudge__title">{nudge.headline}</p>
              <p className="nn-engagement-nudge__body">{nudge.body}</p>
              <Link
                href={nudge.href}
                onClick={() => trackClientEvent("engagement_nudge_clicked", { kind: nudge.kind })}
                className="nn-engagement-nudge__cta"
                style={{ color }}
              >
                {nudge.ctaLabel}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => dismiss(nudge.kind)}
              className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition group-hover:opacity-100"
              style={{ color: "var(--semantic-text-muted)" }}
              aria-label={`Dismiss: ${nudge.headline}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </section>
  );
}
