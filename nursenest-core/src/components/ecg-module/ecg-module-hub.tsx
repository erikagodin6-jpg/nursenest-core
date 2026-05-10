import Link from "next/link";
import { Activity, ChevronRight, Gauge, Layers, Zap } from "lucide-react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { ECG_ROUTE_CONFIGS } from "@/lib/ecg-module/ecg-module-config";

const HERO_WAVE_HEIGHTS = [18, 42, 28, 55, 35, 62, 40, 48, 33, 58, 44, 52, 30, 46, 38, 50, 36, 44, 32, 56, 41, 47, 29, 53] as const;

type HubSection = {
  id: string;
  title: string;
  eyebrow: string;
  items: readonly { href: string; title: string; subtitle: string; behaviors: readonly string[] }[];
};

function WaveformStrip({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-16 items-end justify-between gap-px overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] px-2 py-2 sm:h-20 ${className ?? ""}`}
      aria-hidden
      role="presentation"
    >
      {HERO_WAVE_HEIGHTS.map((h, i) => {
        const hue = i % 5;
        const chartVar =
          hue === 0
            ? "var(--semantic-chart-1)"
            : hue === 1
              ? "var(--semantic-chart-2)"
              : hue === 2
                ? "var(--semantic-chart-3)"
                : hue === 3
                  ? "var(--semantic-chart-4)"
                  : "var(--semantic-chart-5)";
        return (
          <span
            key={i}
            className="w-full max-w-[6px] min-w-[2px] rounded-full opacity-90"
            style={{
              height: `${h}%`,
              background: `color-mix(in srgb, ${chartVar} 82%, var(--semantic-border-soft))`,
            }}
          />
        );
      })}
    </div>
  );
}

export function EcgModuleHub({ t }: { t: LearnerMarketingT }) {
  const basicLessons = ECG_ROUTE_CONFIGS["/modules/ecg/basic/lessons"];
  const basicQuizzes = ECG_ROUTE_CONFIGS["/modules/ecg/basic/quizzes"];
  const basicWs = ECG_ROUTE_CONFIGS["/modules/ecg/basic/worksheets"];
  const advLessons = ECG_ROUTE_CONFIGS["/modules/ecg/advanced/lessons"];
  const advDrills = ECG_ROUTE_CONFIGS["/modules/ecg/advanced/video-drills"];
  const advScenarios = ECG_ROUTE_CONFIGS["/modules/ecg/advanced/scenarios"];
  const advWs = ECG_ROUTE_CONFIGS["/modules/ecg/advanced/worksheets"];

  const basicPath: HubSection = {
    id: "basic",
    title: t("pages.home.premium.ecg.coreHeading"),
    eyebrow: t("pages.home.premium.ecg.coreEyebrow"),
    items: [
      {
        href: "/modules/ecg/basic/lessons",
        title: basicLessons.title,
        subtitle: basicLessons.subtitle,
        behaviors: basicLessons.behaviors,
      },
      {
        href: "/modules/ecg/basic/quizzes",
        title: basicQuizzes.title,
        subtitle: basicQuizzes.subtitle,
        behaviors: basicQuizzes.behaviors,
      },
      {
        href: "/modules/ecg/basic/worksheets",
        title: basicWs.title,
        subtitle: basicWs.subtitle,
        behaviors: basicWs.behaviors,
      },
    ],
  };

  const advancedPath: HubSection = {
    id: "advanced",
    title: t("pages.home.premium.ecg.advancedHeading"),
    eyebrow: t("pages.home.premium.ecg.advancedBadge"),
    items: [
      {
        href: "/modules/ecg/advanced/lessons",
        title: advLessons.title,
        subtitle: advLessons.subtitle,
        behaviors: advLessons.behaviors,
      },
      {
        href: "/modules/ecg/advanced/video-drills",
        title: advDrills.title,
        subtitle: advDrills.subtitle,
        behaviors: advDrills.behaviors,
      },
      {
        href: "/modules/ecg/advanced/scenarios",
        title: advScenarios.title,
        subtitle: advScenarios.subtitle,
        behaviors: advScenarios.behaviors,
      },
      {
        href: "/modules/ecg/advanced/worksheets",
        title: advWs.title,
        subtitle: advWs.subtitle,
        behaviors: advWs.behaviors,
      },
    ],
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 lg:px-8">
      <section
        className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_38%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-8"
        aria-labelledby="ecg-hub-hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_20%_20%,var(--semantic-info)_0px,transparent_55%),radial-gradient(circle_at_80%_0%,var(--semantic-chart-3)_0px,transparent_50%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info-soft)_55%,var(--semantic-surface))] text-[var(--semantic-info)]">
                <Activity className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_90%,var(--semantic-text-primary))]">
                {t("pages.home.premium.ecg.coreEyebrow")}
              </p>
            </div>
            <h1 id="ecg-hub-hero-heading" className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
              {t("learner.studyHome.quickLaunch.ecgTitle")}
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-[var(--semantic-text-secondary)]">
              {t("components.examPathwayHub.premiumModules.ecgBody")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/modules/ecg/basic/lessons"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--role-cta)] px-5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
              >
                {t("pages.home.premium.ecg.coreCtaLessons")}
              </Link>
              <Link
                href="/modules/ecg/basic/quizzes"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] px-5 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-chart-4)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)]"
              >
                {t("learner.studyHome.quickLaunch.ecgCta")}
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label={t("pages.home.premium.ecg.coreFeaturesLabel")}>
              <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-medium text-[var(--semantic-text-primary)]">
                {t("pages.home.premium.ecg.coreFeatures.telemetry")}
              </li>
              <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-medium text-[var(--semantic-text-primary)]">
                {t("pages.home.premium.ecg.coreFeatures.waveform")}
              </li>
              <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-medium text-[var(--semantic-text-primary)]">
                {t("pages.home.premium.ecg.coreFeatures.bedside")}
              </li>
              <li className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-medium text-[var(--semantic-text-primary)]">
                {t("pages.home.premium.ecg.coreFeatures.adaptive")}
              </li>
            </ul>
          </div>
          <div className="grid gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{t("pages.home.premium.ecg.stripLabel")}</p>
            <WaveformStrip />
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.studyHome.quickLaunch.ecgDesc")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="ecg-paths-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="ecg-paths-heading" className="text-xl font-semibold text-[var(--semantic-text-primary)] sm:text-2xl">
              {t("components.examPathwayHub.premiumModules.ecgTitle")}
            </h2>
            <p className="mt-1 max-w-prose text-sm text-[var(--semantic-text-secondary)]">{t("pages.pricing.ecg.core.body")}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            <Layers className="h-3.5 w-3.5 text-[var(--semantic-chart-3)]" aria-hidden />
            {t("pages.home.premium.ecg.coreFootnote")}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[basicPath, advancedPath].map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[var(--semantic-border-soft)] pb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-4)_85%,var(--semantic-text-primary))]">
                    {section.eyebrow}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{section.title}</h3>
                </div>
                {section.id === "basic" ? (
                  <Gauge className="h-5 w-5 shrink-0 text-[color-mix(in_srgb,var(--semantic-chart-4)_88%,var(--semantic-text-primary))]" aria-hidden />
                ) : (
                  <Zap className="h-5 w-5 shrink-0 text-[color-mix(in_srgb,var(--semantic-warning)_88%,var(--semantic-text-primary))]" aria-hidden />
                )}
              </div>
              <ul className="mt-4 space-y-3" role="list">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex flex-col gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_06%,var(--semantic-surface))] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))]"
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="min-w-0 text-sm font-semibold text-[var(--semantic-text-primary)]">{item.title}</span>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-hover:translate-x-0.5" aria-hidden />
                      </span>
                      <span className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{item.subtitle}</span>
                      <span className="flex flex-wrap gap-1.5">
                        {item.behaviors.map((b) => (
                          <span
                            key={b}
                            className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-text-primary)]"
                          >
                            {b}
                          </span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_06%,var(--semantic-surface))] p-5 sm:p-6"
        aria-labelledby="ecg-drills-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="ecg-drills-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
              {t("pages.pricing.ecg.advanced.title")}
            </h2>
            <p className="mt-1 max-w-prose text-sm text-[var(--semantic-text-secondary)]">{t("pages.pricing.ecg.advanced.body")}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/modules/ecg/basic/quizzes"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--role-cta)] px-4 text-xs font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_8px_var(--role-cta-shadow)] sm:text-sm"
            >
              {basicQuizzes.title}
            </Link>
            <Link
              href="/modules/ecg/advanced/video-drills"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)] sm:text-sm"
            >
              {advDrills.title}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
