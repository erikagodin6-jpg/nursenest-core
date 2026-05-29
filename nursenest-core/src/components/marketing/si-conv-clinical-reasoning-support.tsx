"use client";

import Image from "next/image";
import { Brain, CheckCircle2, ChevronDown, Stethoscope } from "lucide-react";
import { useState } from "react";
import { SI_CONV_MARKETING } from "@/lib/marketing/si-conv-clinical-reasoning";

const cardClass =
  "rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]";

export function SiConvInlineDetails({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3 text-sm" : "space-y-4 text-sm"}>
      <p className="leading-6 text-[var(--semantic-text-secondary)]">
        {SI_CONV_MARKETING.intro}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4">
          <p className="font-bold text-[var(--theme-heading-text)]">
            {SI_CONV_MARKETING.situationTitle}
          </p>
          <ul className="mt-2 space-y-1.5 text-[var(--semantic-text-secondary)]">
            {SI_CONV_MARKETING.situationBullets.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] p-4">
          <p className="font-bold text-[var(--theme-heading-text)]">
            {SI_CONV_MARKETING.convTitle}
          </p>
          <ul className="mt-2 space-y-1.5 text-[var(--semantic-text-secondary)]">
            {SI_CONV_MARKETING.convBullets.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="leading-6 text-[var(--semantic-text-secondary)]">
        {SI_CONV_MARKETING.outcome}
      </p>
    </div>
  );
}

export function SiConvPricingFeatureDisclosure() {
  return (
    <details className="group mt-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-3">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex gap-2">
          <Brain className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
          <span>
            <span className="block text-sm font-bold text-[var(--theme-heading-text)]">
              {SI_CONV_MARKETING.shortLabel}
            </span>
            <span className="mt-1 block text-xs leading-5 text-[var(--semantic-text-secondary)]">
              {SI_CONV_MARKETING.shortBenefit}
            </span>
          </span>
        </span>
        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-4 border-t border-[var(--semantic-border-soft)] pt-4">
        <SiConvInlineDetails compact />
      </div>
    </details>
  );
}

function ProofImage() {
  const [src, setSrc] = useState(SI_CONV_MARKETING.screenshot);

  return (
    <Image
      src={src}
      alt={SI_CONV_MARKETING.screenshotAlt}
      fill
      sizes="(min-width: 1024px) 42vw, 100vw"
      className="absolute inset-0 h-full w-full object-cover object-top"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== SI_CONV_MARKETING.fallbackScreenshot) {
          setSrc(SI_CONV_MARKETING.fallbackScreenshot);
        }
      }}
    />
  );
}

export function SiConvMarketingExplainer() {
  return (
    <section
      id="si-conv-clinical-reasoning"
      aria-labelledby="si-conv-clinical-reasoning-heading"
      className={`${cardClass} overflow-hidden`}
    >
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
            <Stethoscope className="h-3.5 w-3.5" aria-hidden />
            {SI_CONV_MARKETING.eyebrow}
          </div>
          <h2
            id="si-conv-clinical-reasoning-heading"
            className="mt-4 text-2xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl"
          >
            {SI_CONV_MARKETING.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--theme-body-text)]">
            {SI_CONV_MARKETING.whatYouGetLead}
          </p>
          <div className="mt-5">
            <SiConvInlineDetails />
          </div>
          <p className="sr-only">
            SEO topics: {SI_CONV_MARKETING.seoKeywords}.
          </p>
        </div>
        <div className="border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 lg:border-l lg:border-t-0">
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] sm:min-h-[340px]">
            <ProofImage />
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--semantic-text-muted)]">
            Question {"->"} SI/CONV panel {"->"} rationale: learners see the cue, the clinical issue, and the reasoning behind each answer.
          </p>
        </div>
      </div>
    </section>
  );
}
