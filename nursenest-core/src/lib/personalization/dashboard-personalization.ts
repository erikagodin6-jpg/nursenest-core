/**
 * Market-personalized dashboard adapter.
 *
 * Takes a PersonalizationContext and produces region-aware, study-stage-aware
 * copy and CTA variants for the dashboard. This is a pure rendering helper —
 * it does NOT load data.
 *
 * Surfaces personalized by this module:
 *   - Dashboard hero greeting + subtext
 *   - Primary CTA wording
 *   - Context label (e.g. "Canada RPN · REx-PN Prep")
 *   - Market-specific trust messaging
 *   - Exam countdown framing
 *   - Weak area coaching tone
 *   - Upgrade CTA when browsing non-owned market
 */

import type { PersonalizationContext, StudyStage } from "./personalization-context";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type DashboardPersonalization = {
  /** Greeting line: "Welcome back" / "Good morning" variants. */
  greeting: string;
  /** Subtext below greeting — study-stage + market aware. */
  subtitle: string;
  /** Full context label: "Philippines · RN · NCLEX-RN". */
  contextLabel: string;
  /** Primary CTA text. */
  primaryCtaLabel: string;
  /** Primary CTA href. */
  primaryCtaHref: string;
  /** Trust/reassurance copy for this market. */
  trustMessage: string | null;
  /** Exam countdown framing. */
  countdownLabel: string | null;
  /** Coaching message for weak areas. */
  weakAreaCoaching: string | null;
  /** Shown when browsing a market the user doesn't own. */
  nonOwnedMarketBanner: string | null;
};

// ── Builder ──────────────────────────────────────────────────────────────────

export function buildDashboardPersonalization(
  ctx: PersonalizationContext,
  userName: string | null,
): DashboardPersonalization {
  const name = userName ?? "there";
  const greeting = buildGreeting(name, ctx.studyStage);
  const subtitle = buildSubtitle(ctx);
  const contextLabel = buildContextLabel(ctx);
  const { label: primaryCtaLabel, href: primaryCtaHref } = buildPrimaryCta(ctx);
  const trustMessage = buildTrustMessage(ctx.region, ctx.profession);
  const countdownLabel = buildCountdownLabel(ctx);
  const weakAreaCoaching = buildWeakAreaCoaching(ctx);
  const nonOwnedMarketBanner = ctx.isHomeRegion
    ? null
    : `You're browsing ${ctx.regionDisplayName} content. Your subscription covers a different region.`;

  return {
    greeting,
    subtitle,
    contextLabel,
    primaryCtaLabel,
    primaryCtaHref,
    trustMessage,
    countdownLabel,
    weakAreaCoaching,
    nonOwnedMarketBanner,
  };
}

// ── Greeting ─────────────────────────────────────────────────────────────────

function buildGreeting(name: string, stage: StudyStage): string {
  switch (stage) {
    case "new":
      return `Welcome, ${name}`;
    case "onboarding":
      return `Great start, ${name}`;
    case "building":
      return `Keep going, ${name}`;
    case "strengthening":
      return `Almost there, ${name}`;
    case "exam_ready":
      return `You're ready, ${name}`;
    case "reviewing":
      return `Welcome back, ${name}`;
    default:
      return `Welcome back, ${name}`;
  }
}

// ── Subtitle ─────────────────────────────────────────────────────────────────

function buildSubtitle(ctx: PersonalizationContext): string {
  if (ctx.isNewUser) {
    return `Let's get you started with ${ctx.exam ?? "your exam"} prep.`;
  }

  if (ctx.studyStage === "onboarding") {
    return "You're building momentum. Keep completing sessions to unlock personalized insights.";
  }

  if (ctx.readinessBand === "ready") {
    return ctx.hasExamDate
      ? "Your readiness is strong. Focus on maintaining confidence."
      : "You're performing well. Consider setting an exam date to optimize your final prep.";
  }

  if (ctx.weakAreaCount > 0 && ctx.topWeakTopic) {
    return `Focus on ${ctx.topWeakTopic} — it's your biggest opportunity for improvement.`;
  }

  if (ctx.studyStreakDays > 0) {
    return `${ctx.studyStreakDays}-day streak. Consistency is your strongest advantage.`;
  }

  return "Your personalized study plan adapts as you learn.";
}

// ── Context label ────────────────────────────────────────────────────────────

function buildContextLabel(ctx: PersonalizationContext): string {
  const parts = [ctx.regionDisplayName];
  if (ctx.profession) parts.push(ctx.profession.toUpperCase());
  if (ctx.exam) parts.push(ctx.exam.toUpperCase());
  return parts.join(" · ");
}

// ── Primary CTA ──────────────────────────────────────────────────────────────

function buildPrimaryCta(ctx: PersonalizationContext): { label: string; href: string } {
  if (!ctx.hasActiveSubscription) {
    return { label: "Start Free Trial", href: "/pricing" };
  }

  switch (ctx.studyStage) {
    case "new":
      return { label: "Start Your First Lesson", href: "/app/lessons" };
    case "onboarding":
      return { label: "Continue Learning", href: "/app/lessons" };
    case "building":
      return { label: "Practice Questions", href: "/app/questions" };
    case "strengthening":
      return { label: "Review Weak Areas", href: "/app/questions" };
    case "exam_ready":
      return { label: "Take a Practice Exam", href: "/app/practice-tests" };
    case "reviewing":
      return { label: "Continue Review", href: "/app/questions" };
    default:
      return { label: "Continue Studying", href: "/app" };
  }
}

// ── Trust messaging ──────────────────────────────────────────────────────────

function buildTrustMessage(
  region: GlobalRegionSlug,
  profession: string | null,
): string | null {
  const trustMessages: Partial<Record<GlobalRegionSlug, string>> = {
    philippines: "Trusted by Filipino nurses preparing for international licensure.",
    india: "Built for Indian nurses pursuing global nursing careers.",
    nigeria: "Structured exam prep trusted by Nigerian nursing professionals.",
    kenya: "Reliable study support for Kenyan nurses.",
    canada: profession === "rpn"
      ? "Canada's dedicated RPN exam prep platform."
      : "Comprehensive Canadian nursing exam preparation.",
    us: "NCLEX prep built by nurses, for nurses.",
    uk: "Supporting UK nursing registration preparation.",
    pakistan: "Affordable, structured prep for Pakistani nurses.",
    "south-africa": "Exam preparation for South African nursing professionals.",
  };

  return trustMessages[region] ?? null;
}

// ── Countdown ────────────────────────────────────────────────────────────────

function buildCountdownLabel(ctx: PersonalizationContext): string | null {
  if (!ctx.hasExamDate || ctx.examDaysRemaining == null) return null;

  if (ctx.examDaysRemaining <= 0) return "Exam day is here. You've prepared well.";
  if (ctx.examDaysRemaining <= 7) return `${ctx.examDaysRemaining} days until your exam. Final review mode.`;
  if (ctx.examDaysRemaining <= 30) return `${ctx.examDaysRemaining} days remaining. Stay focused on weak areas.`;
  return `${ctx.examDaysRemaining} days until your exam.`;
}

// ── Weak area coaching ───────────────────────────────────────────────────────

function buildWeakAreaCoaching(ctx: PersonalizationContext): string | null {
  if (ctx.weakAreaCount === 0) return null;
  if (!ctx.topWeakTopic) return null;

  if (ctx.weakAreaCount === 1) {
    return `${ctx.topWeakTopic} is your only weak area — a focused session could resolve it.`;
  }

  return `You have ${ctx.weakAreaCount} weak areas. Start with ${ctx.topWeakTopic} for the biggest impact.`;
}
