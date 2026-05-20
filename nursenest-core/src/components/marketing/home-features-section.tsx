"use client";

import { LayoutDashboard, MonitorSmartphone, Sparkles, Stethoscope } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

const ICONS = [Sparkles, Stethoscope, LayoutDashboard, MonitorSmartphone] as const;

const ITEMS = [
  {
    id: "adaptive",
    titleFallback: "Adaptive exams",
    bodyFallback: "Practice adjusts around your progress so you can focus on what matters most.",
  },
  {
    id: "rationales",
    titleFallback: "Clear rationales",
    bodyFallback: "Review explanations that connect questions back to clinical reasoning.",
  },
  {
    id: "readiness",
    titleFallback: "Readiness signals",
    bodyFallback: "Track progress with study signals that help you decide what to review next.",
  },
  {
    id: "mobile",
    titleFallback: "Mobile-friendly study",
    bodyFallback: "Study lessons, questions, and flashcards from any device.",
  },
] as const;

function safeT(t: ((key: string) => string) | undefined, key: string, fallback: string): string {
  try {
    const value = t?.(key);
    return typeof value === "string" && value.trim() ? value : fallback;
  } catch {
    return fallback;
  }
}

function safeFormat(formatter: (value: string, locale: string) => string, value: string, locale: string): string {
  try {
    return formatter(value, locale);
  } catch {
    return value;
  }
}

export function HomeFeaturesSection() {
  let locale = "en";
  let t: ((key: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    locale = ctx.locale || "en";
    t = ctx.t;
  } catch {
    locale = "en";
  }

  return (
    <section
      className="nn-section-soft border-b border-[var(--border-subtle)] py-12 md:py-16"
      aria-labelledby="home-features-heading"
      data-testid="section-features"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-features-heading" className="nn-marketing-h2 text-balance">
            {safeT(t, "home.conversion.features.title", "Everything you need to prepare")}
          </h2>

          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {safeT(
              t,
              "home.conversion.features.sub",
              "Build confidence with adaptive practice, clear explanations, readiness tracking, and mobile-friendly study tools.",
            )}
          </p>
        </header>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => {
            const Icon = ICONS[i] ?? Sparkles;
            const title = safeT(t, `home.conversion.features.${item.id}Title`, item.titleFallback);
            const body = safeT(t, `home.conversion.features.${item.id}Body`, item.bodyFallback);

            return (
              <li key={item.id} className="nn-card-system nn-card-system-pad nn-card-system--interactive">
                <div className="nn-card-system__icon">
                  <Icon className="nn-accent-icon h-5 w-5" aria-hidden />
                </div>

                <p className="nn-card-system__eyebrow">
                  {safeFormat(formatEyebrow, "Feature", locale)}
                </p>

                <h3 className="nn-card-system__title">
                  {safeFormat(formatTitleCase, title, locale)}
                </h3>

                <p className="nn-card-system__description">
                  {safeFormat(formatSentenceCase, body, locale)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}