"use client";

/**
 * About page — premium ecosystem narrative.
 *
 * Sections (strict order):
 *   1. Hero — trust + product understanding
 *   2. Editorial trust strip
 *   3. How NurseNest works — Learn → Practice → Strengthen → Clinical readiness (visual flow)
 *   4. Feature deep-dives — alternating ScreenshotFeatureBlock (live product proof)
 *   5. Clinical readiness ecosystem — interconnections (ECG ↔ labs ↔ practice)
 *   6. What's included — pathway-aware subscription clarity
 *   7. Specialty + new-grad readiness — honest, non-exhaustive
 *   8. Trust principles
 *   9. Trust FAQ — short accordion (separate from the main FAQ page)
 *  10. Final CTA — calm confidence
 *
 * Entitlement-safe copy:
 *   - Advanced ECG / Telemetry Mastery is positioned as a separate future premium product line
 *     (NOT bundled into RN/PN/NP/Allied subscriptions). Wording: "where available", "supported
 *     pathways", "coming soon", "separate future premium product".
 *   - Specialty / new-grad readiness sections describe directions, not exhaustive locked promises.
 *   - No claim of inclusion or affiliation for BLS / ACLS / PALS.
 *
 * All screenshots load from the central registry — no hardcoded CDN URLs in this file.
 */

import Link from "next/link";
import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Compass,
  FlaskConical,
  HeartPulse,
  Layers,
  Stethoscope,
  Sparkles,
  Target,
} from "lucide-react";
import { ScreenshotFeatureBlock } from "@/components/marketing/screenshot-feature-grid";
import { ScreenshotCarousel } from "@/components/marketing/screenshot-carousel";
import { ABOUT_FEATURE_BLOCKS } from "@/lib/marketing/get-screenshots";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

// ── Design tokens (CSS custom properties only) ────────────────────────────────

const BG_BASE = "var(--theme-page-bg)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--theme-primary) 4%, var(--bg-card))";
const SURFACE_SOFT = "color-mix(in srgb, var(--theme-primary) 6%, var(--bg-card))";
const BORDER = "var(--border-subtle)";
const TEXT_HEADING = "var(--theme-heading-text)";
const TEXT_BODY = "var(--theme-body-text)";
const TEXT_MUTED = "var(--theme-muted-text)";
const ACCENT = "var(--theme-primary)";

// ── Step numbering for "how NurseNest works" — Learn → Practice → Strengthen → Clinical readiness ──

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Learn",
    icon: BookOpen,
    accent: "var(--semantic-info)",
    description:
      "Structured clinical lessons mapped to body system, topic, and exam relevance — pathophysiology, assessment, interventions, and exam tips, written for nurses preparing for high-stakes exams.",
  },
  {
    number: "02",
    title: "Practice",
    icon: Target,
    accent: "var(--semantic-success)",
    description:
      "Thousands of practice questions with full clinical rationale — the correct answer and every wrong option explained on one screen, tagged by topic and pathway.",
  },
  {
    number: "03",
    title: "Strengthen",
    icon: Brain,
    accent: "var(--semantic-chart-2)",
    description:
      "Smart Review groups every completed question by correctness and confidence so you fix what actually loses points — overconfident errors are surfaced before they cost you on exam day.",
  },
  {
    number: "04",
    title: "Clinical readiness",
    icon: Stethoscope,
    accent: "var(--semantic-brand)",
    description:
      "Adaptive CAT exams give a readiness score and weak-area plan, and a personalised study plan tells you exactly when you’re prepared to sit your real exam.",
  },
] as const;

// ── Clinical readiness ecosystem — interconnections (most important section) ─

const ECOSYSTEM_NODES = [
  {
    title: "Lessons",
    description:
      "Structured clinical reading anchors every other surface — practice items, smart review, and study-plan blocks all link back to the lesson that explains the underlying concept.",
    icon: BookOpen,
    color: "var(--semantic-info)",
    available: "Available across supported nursing and allied pathways.",
  },
  {
    title: "Practice & rationale",
    description:
      "Practice questions feed Smart Review, and the rationale panel pulls the same clinical concepts a learner would meet in their pathway lessons.",
    icon: Target,
    color: "var(--semantic-success)",
    available: "Pathway-specific question banks for RN, RPN / LVN-LPN, NP, and Allied Health.",
  },
  {
    title: "ECG & telemetry",
    description:
      "Core ECG / telemetry learning lives inside the same learner shell as lessons and practice — rhythm strips connect to the cardiac topics learners are already studying.",
    icon: HeartPulse,
    color: "var(--semantic-warning)",
    available:
      "Core ECG / telemetry education is integrated where available for RN and NP pathways. Advanced ECG & Telemetry Mastery is a separate future premium product, not included in standard subscriptions.",
  },
  {
    title: "Lab interpretation",
    description:
      "Lab values are taught as adaptive clinical interpretation — connected into lessons, practice, CAT, and ECG where the same patient picture would surface them in real care.",
    icon: FlaskConical,
    color: "var(--semantic-chart-3)",
    available: "Available where lab interpretation content is published in the active pathway.",
  },
  {
    title: "Adaptive CAT",
    description:
      "A real CAT exam engine adjusts difficulty in real time, mirrors exam conditions, and produces a readiness score that drives the study plan and Smart Review queue.",
    icon: Activity,
    color: "var(--semantic-chart-1)",
    available: "Supported pathways unlock CAT once the question bank meets adaptive scoring thresholds.",
  },
  {
    title: "Adaptive study plan",
    description:
      "The study plan reads from CAT results, accuracy, and confidence patterns to build a day-by-day plan that loops you back into lessons, practice, and review.",
    icon: Compass,
    color: "var(--semantic-brand)",
    available: "Generated for active learners on supported pathways with sufficient activity to plan from.",
  },
] as const;

// ── What's included — pathway-aware subscription clarity ─────────────────────

const INCLUDED_GROUPS = [
  {
    heading: "In every NurseNest plan",
    items: [
      "Structured clinical lessons for the active pathway",
      "Practice questions with full rationale (correct + every incorrect option)",
      "Smart Review queue with confidence-based grouping",
      "Adaptive study plan once enough activity is recorded",
      "Readiness scoring and weak-area tracking",
    ],
    accent: "var(--semantic-success)",
  },
  {
    heading: "Where available by pathway",
    items: [
      "Computer Adaptive Testing (CAT) on supported pathways",
      "Core ECG / telemetry learning integrated into RN and NP study",
      "Lab values as adaptive clinical interpretation, not a static reference sheet",
      "Pathway-specific content for RN, RPN / LVN-LPN, NP, and Allied Health careers",
    ],
    accent: "var(--semantic-info)",
  },
  {
    heading: "Coming soon (not in current plans)",
    items: [
      "Advanced ECG & Telemetry Mastery — a separate future premium product line, not included in standard RN / PN / NP / Allied subscriptions",
      "Expanded clinical scenario / branching simulation library",
      "Additional specialty readiness modules as content is published",
    ],
    accent: "var(--semantic-warning)",
  },
] as const;

// ── Specialty + new-grad readiness — honest, non-exhaustive ──────────────────

const READINESS_TRACKS = [
  {
    title: "Pre-exam readiness",
    description:
      "Adaptive lessons, practice, and CAT prep for nursing licensure pathways — RN / NCLEX-RN, PN / LVN-LPN, NP, and Allied Health career exams where supported.",
  },
  {
    title: "New grad confidence",
    description:
      "A New Grad track focuses on the clinical reasoning, prioritisation, and safety thinking new grads are expected to demonstrate during early shifts.",
  },
  {
    title: "Specialty study directions",
    description:
      "We continue to add specialty-aligned content (e.g. cardiac, respiratory, med-surg fundamentals) inside the existing pathways. NurseNest is not a substitute for employer orientation, BLS/ACLS/PALS certification, or local protocols.",
  },
] as const;

// ── Trust principles ─────────────────────────────────────────────────────────

const TRUST_POINTS = [
  {
    heading: "Structured, not random",
    body: "Every lesson and question is mapped to a published exam blueprint where one exists for the pathway — so you study what the exam actually tests.",
  },
  {
    heading: "Adaptive from the start",
    body: "The CAT engine and study plan adapt to your actual weak areas and confidence patterns, not a generic curriculum.",
  },
  {
    heading: "Confidence-aware",
    body: "NurseNest tracks when you're wrong while confident — and flags those patterns before they cost you on exam day.",
  },
  {
    heading: "Built for nurses",
    body: "Pathway-specific content for RN, RPN / LVN-LPN, NP, and Allied Health — not one-size-fits-all study material.",
  },
] as const;

// ── Trust FAQ — short, distinct from the main FAQ page ───────────────────────

const TRUST_FAQS = [
  {
    question: "Is NurseNest officially affiliated with the NCLEX, CRNE, BLS, ACLS, or PALS?",
    answer:
      "No. NurseNest is an independent adaptive learning platform built for exam preparation. It is not affiliated with any licensing body, and it is not a substitute for BLS, ACLS, PALS, or any other certification programme.",
  },
  {
    question: "Is Advanced ECG included in my NurseNest plan?",
    answer:
      "No. Core ECG / telemetry learning is integrated into supported nursing pathways where available, but the dedicated Advanced ECG & Telemetry Mastery product is a separate future premium product line and is not included in standard RN, PN, NP, or Allied Health subscriptions.",
  },
  {
    question: "Will the study plan tell me when I’m ready to sit the exam?",
    answer:
      "Your readiness score, CAT trends, and adaptive study plan combine to surface a recommended retest window. They are decision support — not a guarantee of an exam outcome.",
  },
  {
    question: "Can I trust the clinical content?",
    answer:
      "NurseNest content is produced under published editorial and review standards. It is intended for exam preparation only and is not a substitute for local protocols, orders, or independent clinical judgment.",
  },
] as const;

// ── Section components ────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="nn-gradient-safe relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8"
      style={{
        background: `linear-gradient(135deg, ${BG_BASE} 60%, color-mix(in srgb, ${ACCENT} 5%, ${BG_BASE}))`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 30%, color-mix(in srgb, ${ACCENT} 10%, transparent), transparent)`,
        }}
      />
      <FadeUp className="relative mx-auto max-w-3xl">
        <p
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            background: `color-mix(in srgb, ${ACCENT} 8%, ${BG_BASE})`,
            borderColor: `color-mix(in srgb, ${ACCENT} 22%, ${BORDER})`,
            color: ACCENT,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          About NurseNest
        </p>
        <h1
          className="nn-marketing-h1 mt-5 text-balance"
          style={{ color: TEXT_HEADING }}
        >
          One adaptive clinical learning ecosystem — built for nurses who need more than flashcards.
        </h1>
        <p
          className="nn-marketing-body mx-auto mt-6 max-w-xl text-balance leading-relaxed"
          style={{ color: TEXT_BODY }}
        >
          Lessons, practice, Smart Review, ECG learning, lab interpretation, and adaptive CAT exams
          live inside the same learner experience — connected, calm, and tuned to the pathway you’re
          actually studying.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="nn-marketing-cta-primary inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold shadow-sm transition"
            style={{ background: ACCENT, color: "var(--color-on-primary, #fff)" }}
          >
            Start Studying Free
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold transition"
            style={{
              border: `1.5px solid ${BORDER}`,
              color: TEXT_HEADING,
              background: "transparent",
            }}
          >
            See How It Works
          </Link>
        </div>
        <p className="mt-3 text-xs" style={{ color: TEXT_MUTED }}>
          Free to start. No credit card required.
        </p>
      </FadeUp>
    </section>
  );
}

function EditorialTrustSection() {
  return (
    <section
      className="border-y px-4 py-12 sm:px-6 lg:px-8"
      style={{ borderColor: BORDER, background: SURFACE_SOFT }}
      aria-labelledby="about-editorial-trust-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="about-editorial-trust-heading" className="nn-marketing-h3" style={{ color: TEXT_HEADING }}>
          Clinical education, structured for exams
        </h2>
        <p className="nn-marketing-body mt-3 leading-relaxed" style={{ color: TEXT_BODY }}>
          NurseNest lessons and articles are written for high-stakes nursing and allied health exams.
          Materials are produced under published editorial and review standards and are intended for
          preparation only — not as a substitute for local protocols, orders, or independent clinical
          judgment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold">
          <Link href="/editorial-policy" className="text-primary underline-offset-4 hover:underline">
            Editorial policy
          </Link>
          <Link href="/content-review-policy" className="text-primary underline-offset-4 hover:underline">
            Content review policy
          </Link>
          <Link href="/disclaimer" className="text-primary underline-offset-4 hover:underline">
            Educational disclaimer
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksFlowSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      data-testid="about-how-it-works-flow"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="text-center">
            <p
              className="nn-marketing-eyebrow"
              style={{ color: ACCENT }}
            >
              The system
            </p>
            <h2
              className="nn-marketing-h2 mt-3 text-balance"
              style={{ color: TEXT_HEADING }}
            >
              Learn → Practice → Strengthen → Clinical readiness
            </h2>
            <p
              className="nn-marketing-body mx-auto mt-4 max-w-2xl"
              style={{ color: TEXT_BODY }}
            >
              Four connected phases inside one ecosystem. Each phase reads from and writes back to
              the others, so studying gets sharper the more you use it.
            </p>
          </div>
        </FadeUp>

        <StaggerGroup
          className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerMs={70}
          whenInView
          once
        >
          {HOW_IT_WORKS_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.number}>
                <div
                  className="relative flex h-full flex-col gap-4 rounded-2xl p-6"
                  style={{
                    background: SURFACE_ELEVATED,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in srgb, ${step.accent} 12%, var(--bg-card))`,
                        color: step.accent,
                      }}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className="rounded-lg px-2 py-1 text-xs font-bold uppercase tabular-nums tracking-widest"
                      style={{
                        background: `color-mix(in srgb, ${step.accent} 8%, var(--bg-card))`,
                        color: step.accent,
                      }}
                    >
                      Phase {step.number}
                    </span>
                  </div>
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
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

function FeatureDeepDivesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <div className="mb-14 text-center">
            <p
              className="nn-marketing-eyebrow"
              style={{ color: ACCENT }}
            >
              The real product
            </p>
            <h2
              className="nn-marketing-h2 mt-3 text-balance"
              style={{ color: TEXT_HEADING }}
            >
              The full platform, feature by feature
            </h2>
            <p
              className="nn-marketing-body mt-4 max-w-2xl mx-auto"
              style={{ color: TEXT_BODY }}
            >
              Every screenshot below is taken from the live NurseNest platform — no mockups.
            </p>
          </div>
        </FadeUp>

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

function ClinicalReadinessEcosystemSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      style={{ background: SURFACE_SOFT }}
      data-testid="about-clinical-readiness-ecosystem"
      aria-labelledby="about-ecosystem-heading"
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="text-center">
            <p
              className="nn-marketing-eyebrow"
              style={{ color: ACCENT }}
            >
              One ecosystem, many surfaces
            </p>
            <h2
              id="about-ecosystem-heading"
              className="nn-marketing-h2 mt-3 text-balance"
              style={{ color: TEXT_HEADING }}
            >
              The clinical readiness ecosystem
            </h2>
            <p
              className="nn-marketing-body mx-auto mt-4 max-w-2xl"
              style={{ color: TEXT_BODY }}
            >
              ECG learning, lab interpretation, lessons, practice, CAT, and the adaptive study plan
              are not isolated apps — they read from and reinforce each other. That’s why studying
              compounds.
            </p>
          </div>
        </FadeUp>

        <StaggerGroup
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          staggerMs={60}
          whenInView
          once
        >
          {ECOSYSTEM_NODES.map((node) => {
            const Icon = node.icon;
            return (
              <StaggerItem key={node.title}>
                <article
                  className="flex h-full flex-col gap-4 rounded-2xl p-6"
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: `color-mix(in srgb, ${node.color} 12%, var(--bg-card))`,
                      color: node.color,
                    }}
                    aria-hidden
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="nn-marketing-h4" style={{ color: TEXT_HEADING }}>
                    {node.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: TEXT_BODY }}>
                    {node.description}
                  </p>
                  <p
                    className="mt-auto rounded-lg px-3 py-2 text-xs leading-snug"
                    style={{
                      background: `color-mix(in srgb, ${node.color} 6%, var(--bg-card))`,
                      color: TEXT_MUTED,
                      border: `1px solid color-mix(in srgb, ${node.color} 18%, ${BORDER})`,
                    }}
                  >
                    {node.available}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <div className="mt-14">
          <ScreenshotCarousel
            group="clinicalReadiness"
            captionOverlay
            autoplayIntervalMs={6000}
            mediaFrame="default"
            className="rounded-2xl shadow-[var(--shadow-elevated)]"
          />
        </div>
      </div>
    </section>
  );
}

function WhatsIncludedSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      data-testid="about-whats-included"
      aria-labelledby="about-included-heading"
    >
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <div className="text-center">
            <p
              className="nn-marketing-eyebrow"
              style={{ color: ACCENT }}
            >
              Subscription clarity
            </p>
            <h2
              id="about-included-heading"
              className="nn-marketing-h2 mt-3 text-balance"
              style={{ color: TEXT_HEADING }}
            >
              What’s included — and what isn’t
            </h2>
            <p
              className="nn-marketing-body mx-auto mt-4 max-w-2xl"
              style={{ color: TEXT_BODY }}
            >
              Honest scope before you sign up. Pathway-dependent features are clearly labelled, and
              future products are kept distinct from the current plans.
            </p>
          </div>
        </FadeUp>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {INCLUDED_GROUPS.map((group) => (
            <div
              key={group.heading}
              className="flex flex-col gap-3 rounded-2xl p-6"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid color-mix(in srgb, ${group.accent} 18%, ${BORDER})`,
              }}
            >
              <span
                className="inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest"
                style={{
                  background: `color-mix(in srgb, ${group.accent} 12%, var(--bg-card))`,
                  color: group.accent,
                }}
              >
                {group.heading}
              </span>
              <ul className="mt-1 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: group.accent }}
                      aria-hidden
                    />
                    <span style={{ color: TEXT_BODY }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="mx-auto mt-10 max-w-3xl rounded-2xl px-5 py-4 text-center text-xs leading-relaxed"
          style={{
            background: `color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, var(--semantic-warning) 22%, ${BORDER})`,
            color: TEXT_MUTED,
          }}
        >
          Plans, included content, and pricing depend on your selected pathway and region. NurseNest
          is not affiliated with any licensing body, and BLS / ACLS / PALS certification is not
          included or implied. See{" "}
          <Link href="/pricing" className="font-semibold underline-offset-4 hover:underline" style={{ color: ACCENT }}>
            pricing
          </Link>{" "}
          for details for your pathway.
        </p>
      </div>
    </section>
  );
}

function ReadinessTracksSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      style={{ background: SURFACE_SOFT }}
      aria-labelledby="about-readiness-heading"
    >
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <div className="text-center">
            <p
              className="nn-marketing-eyebrow"
              style={{ color: ACCENT }}
            >
              Specialty + new-grad readiness
            </p>
            <h2
              id="about-readiness-heading"
              className="nn-marketing-h2 mt-3 text-balance"
              style={{ color: TEXT_HEADING }}
            >
              Built for the readiness moments that matter
            </h2>
          </div>
        </FadeUp>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {READINESS_TRACKS.map((track, idx) => (
            <div
              key={track.title}
              className="rounded-2xl p-6"
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${BORDER}`,
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: ACCENT }}
              >
                Track {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="nn-marketing-h4 mt-2" style={{ color: TEXT_HEADING }}>
                {track.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_BODY }}>
                {track.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <div className="mb-12 text-center">
            <p
              className="nn-marketing-eyebrow"
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
        </FadeUp>

        <div className="grid gap-6 sm:grid-cols-2">
          {TRUST_POINTS.map((pt) => (
            <div
              key={pt.heading}
              className="flex items-start gap-4 rounded-2xl p-6"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid ${BORDER}`,
              }}
            >
              <Layers
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: ACCENT }}
                aria-hidden
              />
              <div>
                <h3 className="nn-marketing-h4" style={{ color: TEXT_HEADING }}>
                  {pt.heading}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_BODY }}>
                  {pt.body}
                </p>
              </div>
            </div>
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
        <FadeUp>
          <div className="mb-10 text-center">
            <p
              className="nn-marketing-eyebrow"
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
              Every screenshot below is taken from the live NurseNest platform.
            </p>
          </div>
        </FadeUp>

        <ScreenshotCarousel
          group="aboutShowcase"
          captionOverlay
          autoplayIntervalMs={5000}
          mediaFrame="default"
          className="rounded-2xl shadow-[var(--shadow-elevated)]"
        />
      </div>
    </section>
  );
}

function TrustFaqSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      data-testid="about-trust-faq"
      aria-labelledby="about-trust-faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <div className="text-center">
            <p
              className="nn-marketing-eyebrow"
              style={{ color: ACCENT }}
            >
              Trust FAQ
            </p>
            <h2
              id="about-trust-faq-heading"
              className="nn-marketing-h2 mt-3 text-balance"
              style={{ color: TEXT_HEADING }}
            >
              Quick answers about scope and trust
            </h2>
            <p
              className="nn-marketing-body mt-4"
              style={{ color: TEXT_BODY }}
            >
              For full product Q&amp;A, see the{" "}
              <Link href="/faq" className="font-semibold underline-offset-4 hover:underline" style={{ color: ACCENT }}>
                main FAQ page
              </Link>
              .
            </p>
          </div>
        </FadeUp>

        <div className="mt-10 space-y-3">
          {TRUST_FAQS.map((item, idx) => (
            <details
              key={item.question}
              className="group rounded-2xl px-5 py-4 transition-colors"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid ${BORDER}`,
              }}
              {...(idx === 0 ? { open: true } : {})}
            >
              <summary
                className="flex cursor-pointer items-center justify-between gap-4 list-none text-left text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                style={{ color: TEXT_HEADING }}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                  style={{ color: TEXT_MUTED }}
                  aria-hidden
                />
              </summary>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: TEXT_BODY }}
              >
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <FadeUp className="mx-auto max-w-2xl">
        <div
          className="rounded-3xl px-8 py-14 text-center shadow-[var(--shadow-elevated)]"
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
            Free to start. No credit card required. Upgrade when you’re ready for the full system.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="nn-marketing-cta-primary inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold shadow-sm transition"
              style={{ background: ACCENT, color: "var(--color-on-primary, #fff)" }}
            >
              Start Studying Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[2.75rem] items-center rounded-full px-7 text-sm font-semibold transition"
              style={{
                border: `1.5px solid ${BORDER}`,
                color: TEXT_HEADING,
              }}
            >
              View Plans
            </Link>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function AboutPageClient() {
  return (
    <div
      className="min-h-screen"
      data-testid="about-page-client"
      style={{ background: BG_BASE, color: TEXT_MUTED }}
    >
      <HeroSection />
      <EditorialTrustSection />
      <HowItWorksFlowSection />
      <FeatureDeepDivesSection />
      <ClinicalReadinessEcosystemSection />
      <WhatsIncludedSection />
      <ReadinessTracksSection />
      <PrinciplesSection />
      <PlatformPreviewSection />
      <TrustFaqSection />
      <FinalCtaSection />
    </div>
  );
}
