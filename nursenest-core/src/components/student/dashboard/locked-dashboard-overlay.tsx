"use client";

/**
 * LockedDashboardOverlay: trial/free user dashboard experience.
 *
 * Shows a structured preview of what the full dashboard contains,
 * with soft-locked sections and conversion CTAs. Designed to feel
 * premium and aspirational, not frustrating or empty.
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
      <div className="flex items-start gap-3.5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `color-mix(in srgb, ${color} 10%, var(--semantic-surface))`,
            color,
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[0.875rem] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              {title}
            </p>
            <Lock className="h-3 w-3" style={{ color: "var(--semantic-text-muted)" }} />
          </div>
          <p className="mt-1 text-[0.8125rem] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
            {description}
          </p>
        </div>
        <ArrowRight
          className="mt-1.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
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
    description: "Track accuracy, coverage, and trends to see how close you are to exam-ready.",
    color: "var(--semantic-info)",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Weakness Heatmap",
    description: "Visual map of every topic. See exactly where to focus your study time.",
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
    <div className="nn-dash-section" style={{ gap: "2rem" }}>
      {/* Conversion hero */}
      <div className="nn-locked-hero rounded-2xl p-8 text-center sm:p-10">
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
            boxShadow: "0 4px 16px -6px color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
          }}
        >
          <Sparkles className="h-8 w-8" style={{ color: "var(--semantic-brand)" }} />
        </div>

        <h2
          className="text-[1.375rem] font-extrabold tracking-tight sm:text-[1.75rem]"
          style={{ color: "var(--semantic-text-primary)", lineHeight: 1.15 }}
        >
          Unlock Your Full Study System
        </h2>
        <p
          className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Get full access to your study plan, Smart Review,
          readiness tracking, and complete practice exams.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pricing"
            onClick={() => trackClientEvent("trial_cta_clicked", { surface: "locked_dashboard_hero" })}
            className="nn-btn-primary inline-flex min-h-[3rem] items-center justify-center rounded-xl px-8 text-[0.9375rem] font-bold shadow-none"
          >
            Start Free Trial
          </Link>
          <Link
            href="/how-it-works"
            className="text-[0.875rem] font-semibold transition hover:opacity-80"
            style={{ color: "var(--semantic-brand)" }}
          >
            See How It Works
          </Link>
        </div>

        <p className="mt-4 text-[0.75rem]" style={{ color: "var(--semantic-text-muted)" }}>
          No charge today · Cancel anytime before your trial ends
        </p>
      </div>

      {/* Locked feature grid */}
      <div>
        <p
          className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.1em]"
          style={{ color: "var(--semantic-text-muted)", paddingLeft: "0.125rem" }}
        >
          What You&apos;ll Unlock
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOCKED_FEATURES.map((feat) => (
            <LockedFeatureCard key={feat.title} {...feat} />
          ))}
        </div>
      </div>

      {/* Social proof line */}
      <p className="text-center text-[0.75rem] leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
        Used by nursing students preparing for NCLEX and REx-PN ·
        Designed to help you pass on your first attempt
      </p>
    </div>
  );
}
