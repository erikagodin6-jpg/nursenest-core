"use client";

/**
 * HowItWorksPageClient: high-conversion marketing page.
 *
 * 6 sections:
 *   1. Hero: headline + subheadline + CTA
 *   2. 3-Step System: baseline → plan → improve
 *   3. Intelligent System: adaptive plan, smart review, readiness, spaced rep
 *   4. Product Preview: visual cards showing the dashboard, review, and analytics
 *   5. Outcome: single powerful statement
 *   6. Final CTA: closing conversion block
 *
 * Design: premium, colorful, soft palette, theme-aware, mobile-first.
 */

import Link from "next/link";
import {
  ClipboardCheck,
  Route,
  TrendingUp,
  Brain,
  RefreshCcw,
  BarChart3,
  Layers,
  LayoutDashboard,
  ListChecks,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";
import { trackClientEvent } from "@/lib/observability/posthog-client";

// ── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-12 sm:py-24"
      style={{
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--theme-primary) 8%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--theme-primary) 3%, var(--semantic-surface)) 100%)",
        borderBottom: "1px solid var(--semantic-border-soft)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--theme-primary) 14%, transparent), transparent)",
        }}
      />

      <StaggerGroup className="relative mx-auto max-w-2xl" staggerMs={70} whenInView once>
        <StaggerItem>
          <p
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "color-mix(in srgb, var(--theme-primary) 10%, var(--semantic-surface))",
              border: "1px solid color-mix(in srgb, var(--theme-primary) 22%, var(--semantic-border-soft))",
              color: "var(--semantic-text-muted)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Adaptive exam prep
          </p>
        </StaggerItem>

        <StaggerItem>
          <h1 className="nn-marketing-h1 text-balance">
            A Smarter Way to Prepare for Your Exam
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="nn-marketing-body mt-5 text-pretty text-muted-foreground">
            NurseNest guides you through what to study, tracks your progress,
            and helps you know when you're ready to pass.
          </p>
        </StaggerItem>

        <StaggerItem>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className={MARKETING_PRIMARY_CTA_CLASS}
              onClick={() => trackClientEvent("hiw_hero_cta_clicked", { cta: "primary" })}
            >
              Start Free Trial
            </Link>
            <Link href="#how-it-works-steps" className={MARKETING_SECONDARY_CTA_CLASS}>
              See How It Works
            </Link>
          </div>
        </StaggerItem>

        <StaggerItem>
          <p className="mt-3 text-xs text-muted-foreground">
            No charge today. Cancel anytime before your trial ends.
          </p>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}

// ── Section 2: 3-Step System ─────────────────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Take a Baseline Test",
    description: "A short adaptive quiz identifies your strengths and gaps so your plan starts in the right place.",
    icon: <ClipboardCheck className="h-6 w-6" />,
    color: "var(--semantic-info)",
  },
  {
    number: "02",
    title: "Get a Personalised Study Plan",
    description: "Your plan adapts daily based on performance, focusing time where it matters most.",
    icon: <Route className="h-6 w-6" />,
    color: "var(--semantic-success)",
  },
  {
    number: "03",
    title: "Improve Until Ready",
    description: "Practice, review mistakes, and track your readiness score until you're confident to sit the exam.",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "var(--semantic-brand)",
  },
];

function ThreeStepSection() {
  return (
    <section id="how-it-works-steps" className="nn-hiw-section scroll-mt-8">
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            Simple by design
          </p>
          <h2 className="nn-marketing-h2 mt-2 text-balance">
            Three Steps to Exam Readiness
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            No guesswork. No wasted time. Just a clear path from where you are to where you need to be.
          </p>
        </div>
      </FadeUp>

      <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-3" staggerMs={80} whenInView once>
        {STEPS.map((step) => (
          <StaggerItem key={step.number} className="nn-hiw-step-card group">
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in srgb, ${step.color} 10%, var(--semantic-surface))`,
                  color: step.color,
                }}
              >
                {step.icon}
              </div>
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: step.color }}
                >
                  Step {step.number}
                </span>
                <h3
                  className="mt-1 text-lg font-bold leading-tight"
                  style={{ color: "var(--semantic-text-primary)" }}
                >
                  {step.title}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
              {step.description}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

// ── Section 3: Intelligent System ────────────────────────────────────────────

const SYSTEM_FEATURES = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Adaptive Study Plan",
    description: "Your plan adjusts daily based on what you know, what you're getting wrong, and how much time you have.",
    color: "var(--semantic-chart-1)",
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: "Smart Review",
    description: "Every mistake is grouped by confidence and priority. You see exactly what to fix and why.",
    color: "var(--semantic-chart-2)",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Readiness Tracking",
    description: "A readiness score shows how close you are to exam-ready, based on accuracy, coverage, and trends.",
    color: "var(--semantic-chart-3)",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Spaced Repetition",
    description: "Flashcards and review sessions are scheduled using memory science so you retain what you learn.",
    color: "var(--semantic-chart-4)",
  },
];

function IntelligentSystemSection() {
  return (
    <section className="nn-hiw-section nn-hiw-section--alt">
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            Built different
          </p>
          <h2 className="nn-marketing-h2 mt-2 text-balance">
            An Intelligent System That Adapts to You
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            NurseNest doesn't just give you content. It learns what you need and guides you there.
          </p>
        </div>
      </FadeUp>

      <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2" staggerMs={80} whenInView once>
        {SYSTEM_FEATURES.map((feat) => (
          <StaggerItem key={feat.title} className="nn-hiw-feature-card group">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in srgb, ${feat.color} 10%, var(--semantic-surface))`,
                color: feat.color,
              }}
            >
              {feat.icon}
            </div>
            <h3
              className="mt-4 text-base font-bold"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {feat.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
              {feat.description}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

// ── Section 4: Product Preview ───────────────────────────────────────────────

const PREVIEW_CARDS = [
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Your Dashboard",
    description: "Your streak, daily goals, readiness score, and what to study next. All in one place.",
    color: "var(--semantic-info)",
    features: ["Study streak tracking", "Daily goal progress", "Continue where you left off"],
  },
  {
    icon: <ListChecks className="h-6 w-6" />,
    title: "Smart Review",
    description: "Every question you miss is grouped by confidence. Review the most important mistakes first.",
    color: "var(--semantic-warning)",
    features: ["Priority-sorted review queue", "Confidence-based grouping", "Direct lesson links"],
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Confidence Analytics",
    description: "Heatmaps and trend charts show where you're strong, where you're weak, and where you're overconfident.",
    color: "var(--semantic-success)",
    features: ["Topic accuracy heatmap", "Overconfidence detection", "Improvement trends"],
  },
];

function ProductPreviewSection() {
  return (
    <section className="nn-hiw-section">
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            See it in action
          </p>
          <h2 className="nn-marketing-h2 mt-2 text-balance">
            Built for How Students Actually Study
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            Every surface is designed to save time and surface what matters most.
          </p>
        </div>
      </FadeUp>

      <StaggerGroup className="mt-12 grid gap-6 lg:grid-cols-3" staggerMs={80} whenInView once>
        {PREVIEW_CARDS.map((card) => (
          <StaggerItem key={card.title} className="nn-hiw-preview-card">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in srgb, ${card.color} 10%, var(--semantic-surface))`,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <h3
              className="mt-4 text-base font-bold"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--semantic-text-muted)" }}>
              {card.description}
            </p>
            <ul className="mt-4 space-y-2">
              {card.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-sm">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: card.color }}
                  />
                  <span style={{ color: "var(--semantic-text-secondary)" }}>{feat}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

// ── Section 5: Outcome ───────────────────────────────────────────────────────

function OutcomeSection() {
  return (
    <section className="nn-hiw-section nn-hiw-section--alt">
      <FadeUp className="mx-auto max-w-3xl text-center">
        <h2 className="nn-marketing-h1 text-balance">
          Know What to Study.<br />
          Know When You're Ready.
        </h2>
        <p className="nn-marketing-body mt-5 text-pretty text-muted-foreground">
          NurseNest replaces guesswork with a system. You'll always know where you stand,
          what to focus on next, and when you're prepared to sit the exam.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { stat: "3 min", label: "daily goal to stay on track" },
            { stat: "Smart", label: "review that fixes your weakest areas" },
            { stat: "1 score", label: "that tells you when you're ready" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-5"
              style={{
                background: "color-mix(in srgb, var(--theme-primary) 4%, var(--semantic-surface))",
                border: "1px solid var(--semantic-border-soft)",
              }}
            >
              <p
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: "var(--semantic-brand)" }}
              >
                {item.stat}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--semantic-text-muted)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}

// ── Section 6: Final CTA ─────────────────────────────────────────────────────

function FinalCtaSection() {
  return (
    <section
      className="nn-hiw-section rounded-2xl text-center"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--theme-primary) 6%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--theme-primary) 2%, var(--semantic-surface)) 100%)",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <FadeUp className="mx-auto max-w-xl">
        <h2 className="nn-marketing-h2 text-balance">
          Start Studying Smarter Today
        </h2>
        <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
          Join nursing students who use NurseNest to prepare with confidence.
          Start your free trial. No credit card required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pricing"
            className={MARKETING_PRIMARY_CTA_CLASS}
            onClick={() => trackClientEvent("hiw_final_cta_clicked", { cta: "primary" })}
          >
            Start Free Trial
          </Link>
          <Link href="/pricing" className={MARKETING_SECONDARY_CTA_CLASS}>
            View Plans
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          No charge today. Cancel anytime before your trial ends.
        </p>
      </FadeUp>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HowItWorksPageClient() {
  return (
    <div className="mx-auto max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-page-y)]">
      <HeroSection />
      <ThreeStepSection />
      <IntelligentSystemSection />
      <ProductPreviewSection />
      <OutcomeSection />
      <FinalCtaSection />
    </div>
  );
}
