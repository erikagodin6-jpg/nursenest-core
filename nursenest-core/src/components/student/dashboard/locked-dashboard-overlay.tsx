"use client";

/**
 * LockedDashboardOverlay — trial/free user dashboard experience.
 *
 * Shows a structured preview of what the full dashboard contains,
 * with soft-locked sections and conversion CTAs. Designed to feel
 * premium and aspirational — not frustrating or empty.
 */

import Link from "next/link";
import {
  Lock,
  BarChart3,
  Brain,
  Target,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

function LockedFeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href="/pricing"
      onClick={() => trackClientEvent("locked_feature_clicked", { feature: title })}
      className="nn-locked-feature-card group"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `color-mix(in srgb, ${color} 10%, var(--semantic-surface))`,
            color,
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              {title}
            </p>
            <Lock className="h-3 w-3" style={{ color: "var(--semantic-text-muted)" }} />
          </div>
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
            {description}
          </p>
        </div>
        <ArrowRight
          className="mt-1 h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100"
          style={{ color: "var(--semantic-text-muted)" }}
        />
      </div>
    </Link>
  );
}

const LOCKED_FEATURES = [
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Readiness Score",
    description: "See how close you are to exam-ready with accuracy, coverage, and trend tracking.",
    color: "var(--semantic-info)",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Weakness Heatmap",
    description: "Visual map of every topic — see exactly where to focus your study time.",
    color: "var(--semantic-warning)",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Smart Review",
    description: "Every mistake grouped by confidence. Fix the most important ones first.",
    color: "var(--semantic-chart-2)",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Adaptive Practice Exams",
    description: "CAT-style exams that adapt to your level, just like the real thing.",
    color: "var(--semantic-chart-4)",
  },
];

export function LockedDashboardOverlay() {
  return (
    <div className="space-y-6">
      {/* Conversion hero */}
      <div
        className="nn-locked-hero rounded-2xl p-6 text-center sm:p-8"
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
          }}
        >
          <Sparkles className="h-7 w-7" style={{ color: "var(--semantic-brand)" }} />
        </div>

        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: "var(--semantic-text-primary)" }}>
          Unlock Your Personalised Study System
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
          Start your free trial to access your adaptive study plan,
          smart review, readiness tracking, and full practice exams.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pricing"
            onClick={() => trackClientEvent("trial_cta_clicked", { surface: "locked_dashboard_hero" })}
            className="nn-btn-primary inline-flex min-h-[2.75rem] items-center justify-center rounded-xl px-6 text-sm font-semibold shadow-none"
          >
            Start Free Trial
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--semantic-brand)" }}
          >
            See how it works
          </Link>
        </div>

        <p className="mt-3 text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          No charge today · Cancel anytime before your trial ends
        </p>
      </div>

      {/* Locked feature grid */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
          What you'll unlock
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOCKED_FEATURES.map((feat) => (
            <LockedFeatureCard key={feat.title} {...feat} />
          ))}
        </div>
      </div>

      {/* Social proof line */}
      <p className="text-center text-xs" style={{ color: "var(--semantic-text-muted)" }}>
        Used by nursing students preparing for NCLEX and REx-PN ·
        Designed to help you pass on your first attempt
      </p>
    </div>
  );
}
