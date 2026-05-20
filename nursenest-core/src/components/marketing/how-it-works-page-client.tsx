"use client";

/**
 * HowItWorksPageClient — premium ecosystem walkthrough.
 *
 * Reads as the "how" companion to /about. Same calm-confidence voice, same
 * shared primitives (FadeUp, StaggerGroup, semantic tokens, screenshot registry).
 *
 * Sections:
 *   1. Hero — trust + product understanding
 *   2. Four-phase visual flow — Learn → Practice → Strengthen → Clinical readiness
 *   3. Inside the ecosystem — what each surface does and how it links to the others
 *   4. Live product walkthrough — registry-driven screenshot carousel
 *   5. Subscription clarity — what's included, what's pathway-dependent, what's separate
 *   6. Outcome — calm payoff statement (no growth-marketing urgency)
 *   7. Trust FAQ — quick scope answers
 *   8. Final CTA — soft, confidence-led
 *
 * Entitlement-safe copy:
 *   - "Where available", "supported pathways", "coming soon" used for pathway-scoped features.
 *   - Advanced ECG / Telemetry Mastery is described as a separate future premium product line —
 *     never bundled into RN / PN / NP / Allied subscriptions.
 *   - No claim of inclusion or affiliation for BLS / ACLS / PALS.
 */

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  ChevronDown,
  ClipboardCheck,
  Compass,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  RefreshCcw,
  Sparkles,
  Stethoscope,
  Target,
} from "lucide-react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { ScreenshotCarousel } from "@/components/marketing/screenshot-carousel";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";
import { trackClientEvent } from "@/lib/observability/posthog-client";

// ── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="nn-gradient-safe relative overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-12 sm:py-24"
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

      <StaggerGroup className="relative mx-auto max-w-2xl" staggerMs={65} whenInView once>
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
            How NurseNest works
          </p>
        </StaggerItem>

        <StaggerItem>
          <h1 className="nn-marketing-h1 text-balance">
            One ecosystem that knows what to study next — and when you’re ready.
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="nn-marketing-body mt-5 text-pretty text-muted-foreground">
            Lessons, practice, Smart Review, ECG learning, lab interpretation, and adaptive CAT
            exams stay connected inside one calm learner experience. You always know your next step
            and how close you are to readiness.
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
            <Link href="#how-it-works-flow" className={MARKETING_SECONDARY_CTA_CLASS}>
              See the four phases
            </Link>
          </div>
        </StaggerItem>

        <StaggerItem>
          <p className="mt-3 text-xs text-muted-foreground">
            Free to start. Cancel anytime before your trial ends.
          </p>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}

// ── Section 2: Four-phase flow — Learn → Practice → Strengthen → Clinical readiness ──

const FLOW_STEPS = [
  {
    number: "01",
    title: "Learn",
    icon: <ClipboardCheck className="h-6 w-6" />,
    description:
      "Structured clinical lessons mapped to body system, topic, and exam relevance. Each lesson reads as preparation, not as a condensed textbook.",
    color: "var(--semantic-info)",
  },
  {
    number: "02",
    title: "Practice",
    icon: <Target className="h-6 w-6" />,
    description:
      "Practice questions explain every option — correct and incorrect — on the same screen. Tagged by topic and pathway so you study what your exam actually tests.",
    color: "var(--semantic-success)",
  },
  {
    number: "03",
    title: "Strengthen",
    icon: <Brain className="h-6 w-6" />,
    description:
      "Smart Review groups every completed question by correctness and confidence. High-priority fixes — wrong while confident — surface first so you stop losing points to overconfidence.",
    color: "var(--semantic-chart-2)",
  },
  {
    number: "04",
    title: "Clinical readiness",
    icon: <Stethoscope className="h-6 w-6" />,
    description:
      "Adaptive CAT exams produce a readiness score and weak-area plan, and the adaptive study plan tells you exactly when you’re prepared to sit your real exam.",
    color: "var(--semantic-brand)",
  },
];

function FlowSection() {
  return (
    <section id="how-it-works-flow" className="nn-hiw-section scroll-mt-8" data-testid="hiw-flow">
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            The four-phase loop
          </p>
          <h2 className="nn-marketing-h2 mt-2 text-balance">
            Learn → Practice → Strengthen → Clinical readiness
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            No guesswork. No wasted time. Each phase reads from the others, so studying compounds
            instead of restarting.
          </p>
        </div>
      </FadeUp>

      <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerMs={65} whenInView once>
        {FLOW_STEPS.map((step) => (
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
                  Phase {step.number}
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

// ── Section 3: Inside the ecosystem ──────────────────────────────────────────

const ECOSYSTEM_SURFACES = [
  {
    icon: <Compass className="h-6 w-6" />,
    title: "Adaptive Study Plan",
    description:
      "Reads CAT results, accuracy, and confidence patterns to build a day-by-day plan that loops you back into the exact lessons and practice you need next.",
    color: "var(--semantic-chart-1)",
  },
  {
    icon: <RefreshCcw className="h-6 w-6" />,
    title: "Smart Review",
    description:
      "Every mistake is grouped by confidence and priority. You see exactly what to fix and link straight back to the lesson that explains it.",
    color: "var(--semantic-chart-2)",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Readiness Tracking",
    description:
      "A readiness score combines accuracy, coverage, and trend so you can tell when you’re actually exam-ready — not just busy.",
    color: "var(--semantic-chart-3)",
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Adaptive CAT",
    description:
      "A real CAT exam engine adjusts difficulty in real time and mirrors exam conditions. Available on supported pathways once the question bank meets adaptive scoring thresholds.",
    color: "var(--semantic-info)",
  },
  {
    icon: <HeartPulse className="h-6 w-6" />,
    title: "ECG & telemetry learning",
    description:
      "Core ECG / telemetry learning is integrated into the same learner shell as lessons and practice for RN and NP pathways where available. Advanced ECG & Telemetry Mastery is a separate future premium product, not included in standard subscriptions.",
    color: "var(--semantic-warning)",
  },
  {
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Lab interpretation",
    description:
      "Lab values are taught as adaptive clinical interpretation — connected into lessons, practice, CAT, and ECG where the same patient picture would surface them.",
    color: "var(--semantic-chart-4)",
  },
];

function EcosystemSection() {
  return (
    <section
      className="nn-hiw-section nn-hiw-section--alt"
      data-testid="hiw-ecosystem"
      aria-labelledby="hiw-ecosystem-heading"
    >
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            Inside the ecosystem
          </p>
          <h2 id="hiw-ecosystem-heading" className="nn-marketing-h2 mt-2 text-balance">
            One adaptive system, six interconnected surfaces
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            NurseNest is one cohesive premium adaptive clinical learning ecosystem — not a
            collection of disconnected mini-apps.
          </p>
        </div>
      </FadeUp>

      <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerMs={60} whenInView once>
        {ECOSYSTEM_SURFACES.map((feat) => (
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

// ── Section 4: Live product walkthrough (registry-driven carousel) ───────────

function ProductWalkthroughSection() {
  return (
    <section className="nn-hiw-section" data-testid="hiw-product-walkthrough">
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            See it in action
          </p>
          <h2 className="nn-marketing-h2 mt-2 text-balance">
            A real walkthrough — straight from the live product
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            Lesson → practice → Smart Review → CAT readiness, in the actual product. No mockups.
          </p>
        </div>
      </FadeUp>

      <div className="mx-auto mt-10 max-w-4xl">
        <ScreenshotCarousel
          group="ecosystemNarrative"
          captionOverlay
          autoplayIntervalMs={5500}
          mediaFrame="default"
          className="rounded-2xl shadow-[var(--shadow-elevated)]"
        />
      </div>
    </section>
  );
}

// ── Section 5: Subscription clarity ──────────────────────────────────────────

const SUBSCRIPTION_PILLARS = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    color: "var(--semantic-success)",
    title: "In every plan",
    items: [
      "Structured lessons for the active pathway",
      "Practice questions with full rationale",
      "Smart Review queue and confidence-aware grouping",
      "Adaptive study plan and readiness scoring",
    ],
  },
  {
    icon: <ListChecks className="h-5 w-5" />,
    color: "var(--semantic-info)",
    title: "Where available by pathway",
    items: [
      "Computer Adaptive Testing (CAT) on supported pathways",
      "Core ECG / telemetry learning for RN and NP",
      "Lab values as adaptive clinical interpretation",
      "Pathway-specific content for RN, RPN / LVN-LPN, NP, and Allied Health",
    ],
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    color: "var(--semantic-warning)",
    title: "Coming soon (not in current plans)",
    items: [
      "Advanced ECG & Telemetry Mastery — separate future premium product line",
      "Expanded clinical scenario / branching simulation library",
      "Additional specialty readiness modules as content is published",
    ],
  },
];

function SubscriptionClaritySection() {
  return (
    <section
      className="nn-hiw-section nn-hiw-section--alt"
      data-testid="hiw-subscription-clarity"
      aria-labelledby="hiw-included-heading"
    >
      <FadeUp>
        <div className="mx-auto max-w-4xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            Subscription clarity
          </p>
          <h2 id="hiw-included-heading" className="nn-marketing-h2 mt-2 text-balance">
            What you get — and what stays separate
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-muted-foreground">
            Honest scope before you sign up. Pathway-dependent features are clearly labelled and
            future products are kept distinct from the current plans.
          </p>
        </div>
      </FadeUp>

      <StaggerGroup className="mt-12 grid gap-6 lg:grid-cols-3" staggerMs={65} whenInView once>
        {SUBSCRIPTION_PILLARS.map((pillar) => (
          <StaggerItem key={pillar.title} className="nn-hiw-preview-card">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in srgb, ${pillar.color} 10%, var(--semantic-surface))`,
                color: pillar.color,
              }}
            >
              {pillar.icon}
            </div>
            <h3
              className="mt-4 text-base font-bold"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              {pillar.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {pillar.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: pillar.color }}
                    aria-hidden
                  />
                  <span style={{ color: "var(--semantic-text-secondary)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <p
        className="mx-auto mt-10 max-w-3xl rounded-2xl px-5 py-4 text-center text-xs leading-relaxed"
        style={{
          background: "color-mix(in srgb, var(--semantic-warning) 6%, var(--semantic-surface))",
          border: "1px solid color-mix(in srgb, var(--semantic-warning) 22%, var(--semantic-border-soft))",
          color: "var(--semantic-text-muted)",
        }}
      >
        NurseNest is independent and is not affiliated with any licensing body. BLS, ACLS, and PALS
        certification are not included or implied. See{" "}
        <Link
          href="/pricing"
          className="font-semibold underline-offset-4 hover:underline"
          style={{ color: "var(--semantic-brand)" }}
        >
          pricing
        </Link>{" "}
        for plan and pathway details.
      </p>
    </section>
  );
}

// ── Section 6: Outcome ───────────────────────────────────────────────────────

function OutcomeSection() {
  return (
    <section className="nn-hiw-section">
      <FadeUp className="mx-auto max-w-3xl text-center">
        <h2 className="nn-marketing-h1 text-balance">
          Know what to study.
          <br />
          Know when you’re ready.
        </h2>
        <p className="nn-marketing-body mt-5 text-pretty text-muted-foreground">
          NurseNest replaces guesswork with one calm, connected system. You always know where you
          stand, what to focus on next, and when you’re prepared to sit your exam.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { stat: "1 ecosystem", label: "lessons, practice, ECG, labs, CAT — connected" },
            { stat: "Smart", label: "review that fixes your weakest areas first" },
            { stat: "1 score", label: "that tells you when you’re ready" },
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

// ── Section 7: Trust FAQ ─────────────────────────────────────────────────────

const TRUST_FAQS = [
  {
    question: "Is NurseNest officially affiliated with the NCLEX, CRNE, BLS, ACLS, or PALS?",
    answer:
      "No. NurseNest is an independent adaptive learning platform built for exam preparation. It is not affiliated with any licensing body, and it is not a substitute for BLS, ACLS, PALS, or any other certification programme.",
  },
  {
    question: "Is Advanced ECG included in my plan?",
    answer:
      "No. Core ECG / telemetry learning is integrated into supported nursing pathways where available. Advanced ECG & Telemetry Mastery is a separate future premium product line and is not included in standard RN, PN, NP, or Allied Health subscriptions.",
  },
  {
    question: "How do you decide what I should study next?",
    answer:
      "The adaptive study plan reads your CAT results, accuracy, and confidence patterns to surface the lessons and practice with the highest expected impact on your readiness score.",
  },
  {
    question: "Will the readiness score guarantee I pass?",
    answer:
      "No. Readiness scoring and CAT trends are decision support — not a guarantee of an exam outcome. They help you decide when to sit, not whether you will pass.",
  },
] as const;

function TrustFaqSection() {
  return (
    <section
      className="nn-hiw-section nn-hiw-section--alt"
      data-testid="hiw-trust-faq"
      aria-labelledby="hiw-trust-faq-heading"
    >
      <FadeUp>
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-marketing-eyebrow" style={{ color: "var(--semantic-brand)" }}>
            Trust FAQ
          </p>
          <h2
            id="hiw-trust-faq-heading"
            className="nn-marketing-h2 mt-2 text-balance"
          >
            Quick answers about scope and trust
          </h2>
          <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
            For full product Q&amp;A, see the{" "}
            <Link
              href="/faq"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--semantic-brand)" }}
            >
              main FAQ page
            </Link>
            .
          </p>
        </div>
      </FadeUp>

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {TRUST_FAQS.map((item, idx) => (
          <details
            key={item.question}
            className="group rounded-2xl px-5 py-4"
            style={{
              background: "var(--semantic-surface)",
              border: "1px solid var(--semantic-border-soft)",
            }}
            {...(idx === 0 ? { open: true } : {})}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              <span>{item.question}</span>
              <ChevronDown
                className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                style={{ color: "var(--semantic-text-muted)" }}
                aria-hidden
              />
            </summary>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ── Section 8: Final CTA ─────────────────────────────────────────────────────

function FinalCtaSection() {
  return (
    <section
      className="nn-gradient-safe nn-hiw-section rounded-2xl text-center"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--theme-primary) 6%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--theme-primary) 2%, var(--semantic-surface)) 100%)",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <FadeUp className="mx-auto max-w-xl">
        <h2 className="nn-marketing-h2 text-balance">
          Start studying with calm confidence
        </h2>
        <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
          Join nursing students who use NurseNest to prepare with structure, not panic. Start free.
          No credit card required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pricing"
            className={MARKETING_PRIMARY_CTA_CLASS}
            onClick={() => trackClientEvent("hiw_final_cta_clicked", { cta: "primary" })}
          >
            Start Free Trial
          </Link>
          <Link href="/about" className={MARKETING_SECONDARY_CTA_CLASS}>
            Read the full story
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
    <div
      className="mx-auto max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-page-y)]"
      data-testid="how-it-works-page-client"
    >
      <HeroSection />
      <FlowSection />
      <EcosystemSection />
      <ProductWalkthroughSection />
      <SubscriptionClaritySection />
      <OutcomeSection />
      <TrustFaqSection />
      <FinalCtaSection />
    </div>
  );
}
