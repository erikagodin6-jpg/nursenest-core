"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ClipboardCheck,
  CheckCircle2,
  Target,
} from "lucide-react";
import {
  TIER_VALUE_EXPERIENCES,
  TIER_VALUE_ORDER,
  type TierValueKey,
  type TierValueStageKey,
} from "@/lib/marketing/tier-value-experience";
import { SI_CONV_MARKETING } from "@/lib/marketing/si-conv-clinical-reasoning";

const STAGE_ICONS: Record<TierValueStageKey, typeof BookOpen> = {
  learn: BookOpen,
  practice: Brain,
  assess: ClipboardCheck,
  remediate: Target,
  master: BarChart3,
};

function ProofImage({
  src,
  fallbackSrc,
  alt,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 44vw, 100vw"
      className="absolute inset-0 h-full w-full object-cover object-top"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}

export function TierValueExperience({
  activeTier = "rn",
  onTierSelect,
}: {
  activeTier?: TierValueKey;
  onTierSelect?: (tier: TierValueKey) => void;
}) {
  const selected =
    TIER_VALUE_EXPERIENCES[activeTier] ?? TIER_VALUE_EXPERIENCES.rn;

  return (
    <section
      id="pricing-tier-value"
      aria-labelledby="pricing-tier-value-heading"
      className="scroll-mt-24 rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7 lg:p-8"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
            What you get
          </p>
          <h2
            id="pricing-tier-value-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]"
          >
            The complete {selected.label} learning experience
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--theme-body-text)]">
            {selected.tagline}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--semantic-text-secondary)]">
            {selected.differentiation}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TIER_VALUE_ORDER.map((key) => {
            const tier = TIER_VALUE_EXPERIENCES[key];
            const active = tier.key === selected.key;
            return (
              <button
                key={tier.key}
                type="button"
                onClick={() => onTierSelect?.(tier.key)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                data-active={active ? "true" : "false"}
                style={{
                  borderColor: active
                    ? "color-mix(in srgb, var(--semantic-brand) 48%, var(--semantic-border-soft))"
                    : "var(--semantic-border-soft)",
                  background: active
                    ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))"
                    : "var(--semantic-surface)",
                  color: active
                    ? "var(--semantic-brand)"
                    : "var(--semantic-text-secondary)",
                }}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
              {SI_CONV_MARKETING.whatYouGetTitle}
            </p>
            <h3 className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">
              {SI_CONV_MARKETING.whatYouGetLead}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--semantic-text-secondary)]">
              {SI_CONV_MARKETING.shortBenefit}
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-[var(--semantic-text-secondary)] sm:grid-cols-2 lg:max-w-md">
            {SI_CONV_MARKETING.whatYouGetBullets.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-7 grid gap-5">
        {selected.stages.map((stage, index) => {
          const Icon = STAGE_ICONS[stage.key];
          return (
            <article
              key={stage.key}
              className="grid overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface-alt)_54%,var(--semantic-surface))] lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative min-h-[220px] border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] lg:border-b-0 lg:border-r">
                <ProofImage
                  src={stage.screenshot}
                  fallbackSrc={stage.fallbackScreenshot}
                  alt={stage.screenshotAlt}
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                      Stage {index + 1}
                    </p>
                    <h3 className="text-xl font-bold text-[var(--theme-heading-text)]">
                      {stage.label}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-base font-semibold leading-7 text-[var(--theme-heading-text)]">
                  {stage.headline}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--theme-body-text)]">
                  {stage.body}
                </p>
                <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
                    Learner outcome
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                    {stage.outcome}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stage.links.map((link) => (
                    <Link
                      key={`${stage.key}-${link.href}`}
                      href={link.href}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] transition hover:border-[var(--semantic-brand)]"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
