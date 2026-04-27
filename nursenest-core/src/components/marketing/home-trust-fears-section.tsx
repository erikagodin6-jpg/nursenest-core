"use client";

import { Clock, Gem, GraduationCap } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";
import { safeHomepageMarketingCopy } from "@/lib/marketing/homepage-safe-copy";

type Props = {
  questionCount: number;
  registeredLearners: number;
};

function formatCount(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

const BLOCKS = [
  {
    id: "pass",
    icon: GraduationCap,
    iconColor: "var(--semantic-success)",
    borderAccent: "var(--semantic-success)",
  },
  {
    id: "quality",
    icon: Gem,
    iconColor: "var(--semantic-info)",
    borderAccent: "var(--semantic-info)",
  },
  {
    id: "current",
    icon: Clock,
    iconColor: "var(--semantic-brand)",
    borderAccent: "var(--semantic-brand)",
  },
] as const;

/**
 * Direct answers to top pre-purchase fears — placed after the sample question, before audience cards.
 */
export function HomeTrustFearsSection({ questionCount, registeredLearners }: Props) {
  const { locale, t } = useMarketingI18n();
  const q = formatCount(questionCount, locale);
  const learners = formatCount(registeredLearners, locale);

  const passBody = q
    ? formatSentenceCase(
        safeHomepageMarketingCopy(
          t,
          "pages.home.trustFears.pass.bodyWithStats",
          "You earn the pass with your own hours—nothing replaces that. NurseNest makes those hours higher-yield: {{count}}+ exam-style items, option-level rationales on every question, and readiness signals that steer your next block to weak areas until they stick—the same pass-focused logic you will see again before checkout.",
          { count: q },
        ),
        locale,
      )
    : formatSentenceCase(
        safeHomepageMarketingCopy(
          t,
          "pages.home.trustFears.pass.bodyNoStats",
          "You earn the pass with your own hours—nothing replaces that. NurseNest makes those hours higher-yield: prioritization and safety under time, option-level rationales on every question, and analytics that route practice to weak areas—the same logic spelled out again before you choose a plan.",
        ),
        locale,
      );
  const currentBody = learners
    ? formatSentenceCase(
        safeHomepageMarketingCopy(
          t,
          "pages.home.trustFears.current.bodyWithLearners",
          "Items target exam-style judgment—not trivia—with teaching rationales that walk correct and incorrect options the way the sample above does. The bank and lessons are maintained for the pathways we support. Progress saves to your account; checkout runs on Stripe when you upgrade. {{count}} learners are already preparing here.",
          { count: learners },
        ),
        locale,
      )
    : formatSentenceCase(
        safeHomepageMarketingCopy(
          t,
          "pages.home.trustFears.current.bodyNoLearners",
          "Items target exam-style judgment—not trivia—with teaching rationales that walk correct and incorrect options the way the sample above does. The bank and lessons are maintained for the pathways we support. Progress saves to your account; checkout runs on Stripe when you upgrade.",
        ),
        locale,
      );

  const bodies: Record<(typeof BLOCKS)[number]["id"], string> = {
    pass: passBody,
    quality: formatSentenceCase(
      safeHomepageMarketingCopy(
        t,
        "pages.home.trustFears.quality.body",
        "Yes. Select your country in the header, choose RN, PN, NP, or allied, and your bank, lessons, and labels stay scoped to that registration context, including dedicated hubs for Philippines, Middle East, China, and more where we publish. You are not studying mixed licensing scope in the same run.",
      ),
      locale,
    ),
    current: currentBody,
  };

  return (
    <section
      className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
      aria-labelledby="home-trust-fears-heading"
      data-testid="section-home-trust-fears"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-28px" className="mx-auto mb-8 max-w-2xl text-center">
          <p className="nn-marketing-eyebrow text-[var(--semantic-brand)]">
            {formatTitleCase(
              safeHomepageMarketingCopy(t, "pages.home.trustFears.eyebrow", "Before you go deeper"),
              locale,
            )}
          </p>
          <h2 id="home-trust-fears-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--palette-heading)]">
            {formatTitleCase(
              safeHomepageMarketingCopy(
                t,
                "pages.home.trustFears.heading",
                "What candidates ask when study time is scarce",
              ),
              locale,
            )}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              safeHomepageMarketingCopy(
                t,
                "pages.home.trustFears.subheading",
                'Straight answers—no invented pass rates or vague "AI" promises.',
              ),
              locale,
            )}
          </p>
        </FadeUp>

        <StaggerGroup className="grid gap-5 md:grid-cols-3" whenInView once viewMargin="-36px">
          {BLOCKS.map((block, idx) => {
            const Icon = block.icon;
            return (
              <StaggerItem key={block.id} variant={idx === 1 ? "softReveal" : "fadeUp"} className="min-w-0">
                <article
                  className="flex h-full flex-col gap-3 rounded-2xl border bg-[var(--bg-card)] p-5 shadow-[var(--shadow-elevated)] sm:p-6"
                  style={{
                    borderColor: `color-mix(in srgb, ${block.borderAccent} 20%, var(--border-subtle))`,
                    borderTopWidth: 3,
                    borderTopColor: block.borderAccent,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        background: `color-mix(in srgb, ${block.iconColor} 12%, var(--bg-card))`,
                        borderColor: `color-mix(in srgb, ${block.iconColor} 28%, var(--border-subtle))`,
                      }}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" style={{ color: block.iconColor }} />
                    </span>
                    <h3 className="nn-marketing-h3 text-balance leading-snug text-[var(--palette-heading)]">
                      {formatTitleCase(
                        safeHomepageMarketingCopy(
                          t,
                          `pages.home.trustFears.${block.id}.question`,
                          "Question",
                        ),
                        locale,
                      )}
                    </h3>
                  </div>
                  <p className="nn-marketing-body-sm flex-grow leading-relaxed text-[var(--theme-muted-text)]">
                    {bodies[block.id]}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
