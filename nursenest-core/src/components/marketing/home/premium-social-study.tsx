"use client";

import { ArrowRight, BarChart3, LockKeyhole, PauseCircle, ShieldCheck, UsersRound } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

const SOCIAL_FEATURES = [
  {
    title: "Friend Challenge Codes",
    body: "Share a private code with friends so they can join your challenge and compare scores.",
    icon: LockKeyhole,
    tone: "brand",
  },
  {
    title: "Score Comparisons",
    body: "See how your practice results, readiness, and weak areas compare with your study circle.",
    icon: BarChart3,
    tone: "info",
  },
  {
    title: "Classrooms & Groups",
    body: "Join instructor-led groups, school cohorts, or private study rooms.",
    icon: UsersRound,
    tone: "success",
  },
  {
    title: "Privacy Controls",
    body: "Hide your stats, pause visibility, or leave a challenge whenever you want.",
    icon: ShieldCheck,
    tone: "warning",
  },
  {
    title: "Motivation Without Pressure",
    body: "Compare progress in a supportive way — not a public leaderboard.",
    icon: PauseCircle,
    tone: "accent",
  },
] as const;

export function PremiumSocialStudy() {
  const { hrefs, region } = usePremiumHomepageRoutes();

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--social-study border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-social-study-heading"
      data-testid="section-premium-social-study"
    >
      <div className="nn-section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <p className="nn-premium-home-eyebrow">Social study</p>
            <h2
              id="premium-social-study-heading"
              className="nn-marketing-h2 mt-4 max-w-3xl text-balance text-[var(--palette-heading)]"
            >
              Study With Friends. Challenge Your Scores.
            </h2>
            <p className="nn-marketing-body mt-4 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
              Invite classmates, compare progress, and stay motivated with private study challenges, score comparisons, and optional classroom groups.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <MarketingTrackedLink
                href={hrefs.signup}
                event={PH.marketingHomeFinalCta}
                eventProps={{ region, choice: "social_study_signup", surface: "premium_social_study" }}
                className={MARKETING_PRIMARY_CTA_CLASS}
                data-testid="premium-social-study-primary"
              >
                Start a Study Challenge
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={hrefs.pricing}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ region, choice: "features", surface: "premium_social_study" }}
                className={MARKETING_SECONDARY_CTA_CLASS}
                data-testid="premium-social-study-secondary"
              >
                Explore NurseNest Features
              </MarketingTrackedLink>
            </div>

            <div className="mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_28%,var(--theme-card-bg))] p-4 text-sm leading-relaxed text-[var(--palette-text-muted)]">
              You can disable social study, pause visibility, hide stats, or leave challenges and groups whenever you want.
            </div>
          </div>

          <div className="relative min-w-0">
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_25%_20%,color-mix(in_srgb,var(--semantic-info)_18%,transparent),transparent_38%),radial-gradient(circle_at_75%_80%,color-mix(in_srgb,var(--semantic-success)_14%,transparent),transparent_40%)]"
              aria-hidden
            />
            <div className="relative grid gap-3 sm:grid-cols-2">
              {SOCIAL_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className={[
                      "group min-w-0 rounded-3xl border border-[color-mix(in_srgb,var(--social-study-tone)_22%,var(--border-subtle))]",
                      "bg-[color-mix(in_srgb,var(--theme-card-bg)_88%,var(--social-study-tone)_08%)] p-5 shadow-[var(--semantic-shadow-soft)]",
                      "transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--social-study-tone)_38%,var(--border-subtle))] hover:shadow-md",
                      index === SOCIAL_FEATURES.length - 1 ? "sm:col-span-2" : "",
                    ].join(" ")}
                    style={{ ["--social-study-tone" as string]: `var(--nn-premium-tone-${feature.tone})` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--social-study-tone)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--social-study-tone)_12%,var(--theme-card-bg))] text-[var(--social-study-tone)]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-black text-[var(--palette-heading)]">{feature.title}</h3>
                        <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--palette-text-muted)]">
                          {feature.body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
