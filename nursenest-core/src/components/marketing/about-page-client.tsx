"use client";

/**
 * About page — full content component.
 *
 * Sections (strict order):
 *   1. Hero
 *   2. How it works (4 steps)
 *   3. Feature deep-dives (alternating ScreenshotFeatureBlock)
 *   4. Platform preview carousel
 *   5. Trust strip
 *   6. Final CTA
 *
 * All screenshots are sourced from the registry via get-screenshots.ts.
 * No hardcoded CDN URLs in this component.
 */

import Link from "next/link";
import { ScreenshotFeatureBlock } from "@/components/marketing/screenshot-feature-grid";
import { ScreenshotCarousel } from "@/components/marketing/screenshot-carousel";
import { ABOUT_FEATURE_BLOCKS } from "@/lib/marketing/get-screenshots";

// ── Design tokens (CSS custom properties only) ────────────────────────────────

const BG_BASE = "var(--theme-page-bg)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--theme-primary) 4%, var(--bg-card))";
const SURFACE_SOFT = "color-mix(in srgb, var(--theme-primary) 6%, var(--bg-card))";
const BORDER = "var(--border-subtle)";
const TEXT_HEADING = "var(--theme-heading-text)";
const TEXT_BODY = "var(--theme-body-text)";
const TEXT_MUTED = "var(--theme-muted-text)";
const ACCENT = "var(--theme-primary)";

// ── Step numbering for "how it works" ─────────────────────────────────────────

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Learn",
    description:
      "Start with structured clinical lessons organised by body system, topic, and exam relevance. Each lesson covers pathophysiology, nursing assessment, interventions, and exam tips.",
  },
  {
    number: "02",
    title: "Practice",
    description:
      "Work through thousands of practice questions with complete clinical rationale — the correct answer and every wrong option explained on one screen.",
  },
  {
    number: "03",
    title: "Simulate",
    description:
      "Sit a Computer Adaptive Test (CAT) that adjusts difficulty in real time, mirrors the real exam environment, and gives you a readiness score after each session.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "Use Smart Review and your Adaptive Study Plan to close specific gaps identified in your CAT results — then retest until your readiness score tells you you're ready.",
  },
] as const;

const TRUST_POINTS = [
  {
    heading: "Structured, not random",
    body: "Every lesson and question is mapped to the NCLEX blueprint — so you study what the exam actually tests.",
  },
  {
    heading: "Adaptive from the start",
    body: "The CAT engine and study plan adapt to your actual weak areas, not a generic curriculum.",
  },
  {
    heading: "Confidence-aware",
    body: "NurseNest tracks when you're wrong while confident — and flags those patterns before they cost you on exam day.",
  },
  {
    heading: "Built for nurses",
    body: "Pathway-specific content for RN, RPN, NP, and Allied Health — not one-size-fits-all study material.",
  },
] as const;

// ── Section components ────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="nn-gradient-safe relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8"
      style={{ background: `linear-gradient(135deg, ${BG_BASE} 60%, color-mix(in srgb, ${ACCENT} 5%, ${BG_BASE}))` }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 30%, color-mix(in srgb, ${ACCENT} 10%, transparent), transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-3xl">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: ACCENT }}
        >
          About NurseNest
        </p>
        <h1
          className="nn-marketing-h1 mt-4 text-balance"
          style={{ color: TEXT_HEADING }}
        >
          Built for nurses who need more than flashcards
        </h1>
        <p
          className="nn-marketing-body mx-auto mt-6 max-w-xl text-balance leading-relaxed"
          style={{ color: TEXT_BODY }}
        >
          NurseNest combines structured clinical lessons, an adaptive question bank, a real CAT exam engine, and
          intelligent review tools — everything you need to reach exam readiness, in one place.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="nn-marketing-cta-primary inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold shadow-sm transition"
            style={{ background: ACCENT, color: "var(--color-on-primary, #fff)" }}
          >
            Start studying free
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold transition"
            style={{
              border: `1.5px solid ${BORDER}`,
              color: TEXT_HEADING,
              background: "transparent",
            }}
          >
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: ACCENT }}
          >
            The system
          </p>
          <h2
            className="nn-marketing-h2 mt-3 text-balance"
            style={{ color: TEXT_HEADING }}
          >
            How NurseNest works
          </h2>
          <p
            className="nn-marketing-body mt-4"
            style={{ color: TEXT_BODY }}
          >
            Four connected phases that build on each other until you're ready to pass.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 rounded-2xl p-6"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid ${BORDER}`,
              }}
            >
              <span
                className="self-start rounded-xl px-3 py-1.5 text-sm font-bold tabular-nums"
                style={{
                  background: `color-mix(in srgb, ${ACCENT} 12%, var(--bg-card))`,
                  color: ACCENT,
                }}
              >
                {step.number}
              </span>
              <h3
                className="nn-marketing-h4"
                style={{ color: TEXT_HEADING }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: TEXT_BODY }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureDeepDivesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: ACCENT }}
          >
            What students actually use
          </p>
          <h2
            className="nn-marketing-h2 mt-3 text-balance"
            style={{ color: TEXT_HEADING }}
          >
            The full platform, feature by feature
          </h2>
        </div>

        <div className="space-y-20 sm:space-y-24">
          {ABOUT_FEATURE_BLOCKS.map((block) => (
            <ScreenshotFeatureBlock
              key={block.screenshotId}
              screenshotId={block.screenshotId}
              heading={block.heading}
              subheading={block.subheading}
              bullets={block.bullets as unknown as string[]}
              flip={block.flip}
              accentColor={ACCENT}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformPreviewSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      style={{ background: SURFACE_SOFT }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: ACCENT }}
          >
            Platform preview
          </p>
          <h2
            className="nn-marketing-h2 mt-3 text-balance"
            style={{ color: TEXT_HEADING }}
          >
            See the real product
          </h2>
          <p
            className="nn-marketing-body mt-4 max-w-lg mx-auto"
            style={{ color: TEXT_BODY }}
          >
            Every screenshot below is taken from the live NurseNest platform — no mockups, no redesigns.
          </p>
        </div>

        <ScreenshotCarousel
          group="faqAbout"
          captionOverlay
          autoplayIntervalMs={5000}
          mediaFrame="default"
          className="rounded-2xl shadow-[var(--shadow-elevated)]"
        />
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: ACCENT }}
          >
            Why NurseNest
          </p>
          <h2
            className="nn-marketing-h2 mt-3 text-balance"
            style={{ color: TEXT_HEADING }}
          >
            Principles behind the platform
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {TRUST_POINTS.map((pt) => (
            <div
              key={pt.heading}
              className="rounded-2xl p-6"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid ${BORDER}`,
              }}
            >
              <h3
                className="nn-marketing-h4 mb-2"
                style={{ color: TEXT_HEADING }}
              >
                {pt.heading}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: TEXT_BODY }}
              >
                {pt.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div
        className="mx-auto max-w-2xl rounded-3xl px-8 py-14 text-center shadow-[var(--shadow-elevated)]"
        style={{
          background: SURFACE_ELEVATED,
          border: `1px solid ${BORDER}`,
        }}
      >
        <h2
          className="nn-marketing-h2 text-balance"
          style={{ color: TEXT_HEADING }}
        >
          Start building your readiness today
        </h2>
        <p
          className="nn-marketing-body mt-4"
          style={{ color: TEXT_BODY }}
        >
          Free to start. No credit card required. Upgrade when you're ready for the full system.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="nn-marketing-cta-primary inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold shadow-sm transition"
            style={{ background: ACCENT, color: "var(--color-on-primary, #fff)" }}
          >
            Start studying free
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold transition"
            style={{
              border: `1.5px solid ${BORDER}`,
              color: TEXT_HEADING,
            }}
          >
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function AboutPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{ background: BG_BASE, color: TEXT_MUTED }}
    >
      <HeroSection />
      <HowItWorksSection />
      <FeatureDeepDivesSection />
      <PlatformPreviewSection />
      <TrustSection />
      <FinalCtaSection />
    </div>
  );
}
