"use client";

import { Activity, AlertTriangle, FlaskConical, Lightbulb, Pill, Stethoscope } from "lucide-react";

import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";

const CLINICAL_CARDS = [
  {
    titleKey: "pathophysiology",
    title: "Pathophysiology",
    body: "Start with the why: preload, afterload, gas exchange, perfusion, and compensatory cues before memorizing interventions.",
    icon: Activity,
    role: "pathophysiology",
  },
  {
    titleKey: "diagnostics",
    title: "Labs and diagnostics",
    body: "Connect ABGs, electrolytes, cardiac markers, cultures, and imaging clues to the next safest nursing action.",
    icon: FlaskConical,
    role: "diagnostics",
  },
  {
    titleKey: "redFlags",
    title: "Red flags",
    body: "Spot unstable patterns early: new confusion, falling urine output, refractory hypoxia, chest pressure, and sepsis trends.",
    icon: AlertTriangle,
    role: "red-flags",
  },
  {
    titleKey: "interventions",
    title: "Interventions",
    body: "Prioritize airway, circulation, safety, escalation, teaching, and reassessment with exam-style distractors in mind.",
    icon: Stethoscope,
    role: "interventions",
  },
  {
    titleKey: "medications",
    title: "Medications",
    body: "Review mechanisms, hold parameters, adverse effects, antidotes, and patient education inside clinical scenarios.",
    icon: Pill,
    role: "medications",
  },
  {
    titleKey: "pearls",
    title: "Clinical pearls",
    body: "Turn rationales into quick rules: what to do first, what to monitor next, and what answer sounds right but is unsafe.",
    icon: Lightbulb,
    role: "pearls",
  },
] as const;

export function PremiumClinicalDepth() {
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--clinical border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-clinical-depth-heading"
      data-testid="section-premium-clinical-depth"
    >
      <div className="nn-section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="nn-premium-home-eyebrow">
              {tr("pages.home.premium.clinicalDepth.eyebrow", "Adaptive Lessons")}
            </p>
            <h2 id="premium-clinical-depth-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
              {tr("pages.home.premium.clinicalDepth.heading", "Clinical depth without the textbook fog.")}
            </h2>
            <p className="nn-marketing-body mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
              {tr(
                "pages.home.premium.clinicalDepth.body",
                "The lesson model is built around how nurses actually think at the bedside: recognize the pattern, decide what matters, act safely, and explain why.",
              )}
            </p>
            <div className="nn-premium-clinical-note mt-6 rounded-2xl border p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
                {tr("pages.home.premium.clinicalDepth.priorityCueLabel", "Priority cue")}
              </p>
              <p className="nn-marketing-body-sm mt-2 text-[var(--palette-text-muted)]">
                {tr(
                  "pages.home.premium.clinicalDepth.priorityCueBody",
                  "A patient with heart failure, new crackles, and falling oxygen saturation needs rapid respiratory assessment before routine discharge teaching.",
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CLINICAL_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="nn-premium-depth-card rounded-2xl border p-5"
                  data-role={card.role}
                >
                  <span className="nn-premium-depth-card__icon">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-black text-[var(--palette-heading)]">
                    {tr(`pages.home.premium.clinicalDepth.cards.${card.titleKey}.title`, card.title)}
                  </h3>
                  <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--palette-text-muted)]">
                    {tr(`pages.home.premium.clinicalDepth.cards.${card.titleKey}.body`, card.body)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
