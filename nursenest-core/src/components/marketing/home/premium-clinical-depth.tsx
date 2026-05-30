import { Activity, AlertTriangle, Brain, FlaskConical, GitBranch, Lightbulb, Pill, Stethoscope } from "lucide-react";

import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

const CLINICAL_CARDS = [
  {
    titleKey: "ecgTelemetry",
    title: "ECG and Telemetry",
    body: "Build rhythm recognition, telemetry interpretation, and bedside pattern recognition inside the same study system.",
    icon: Activity,
    role: "pathophysiology",
  },
  {
    titleKey: "labsInterpretation",
    title: "Labs and Clinical Interpretation",
    body: "Connect ABGs, electrolytes, cultures, biomarkers, and trend shifts to the next safest nursing action.",
    icon: FlaskConical,
    role: "diagnostics",
  },
  {
    titleKey: "clinicalScenarios",
    title: "Clinical Scenarios",
    body: "Practice unfolding bedside judgment with escalation cues, prioritization, and exam-style distractors.",
    icon: AlertTriangle,
    role: "red-flags",
  },
  {
    titleKey: "clinicalSkills",
    title: "Clinical Skills and OSCE",
    body: "Rehearse communication, escalation, patient education, and safe bedside sequencing in a realistic flow.",
    icon: Stethoscope,
    role: "interventions",
  },
  {
    titleKey: "medMath",
    title: "Medication Safety and Med Math",
    body: "Review dosage calculations, high-alert medications, hold parameters, and administration safety with practical context.",
    icon: Pill,
    role: "medications",
  },
  {
    titleKey: "newGrad",
    title: "New Grad Readiness",
    body: "Bridge licensure prep into transition-to-practice confidence with specialty signals and bedside readiness framing.",
    icon: Lightbulb,
    role: "pearls",
  },
  {
    titleKey: "ngnJudgment",
    title: "NGN Clinical Judgment",
    body: "Practice case studies, matrix grids, bowtie decisions, and NGN-style formats tied to NCJMM reasoning cues.",
    icon: Brain,
    role: "diagnostics",
  },
  {
    titleKey: "simulations",
    title: "Simulations & Deterioration",
    body: "Branching patient scenarios with telemetry, labs, and deterioration recognition—not static vignettes.",
    icon: GitBranch,
    role: "red-flags",
  },
] as const;

/** Resolve a key from a flat messages record with an English fallback. */
function pickMsg(messages: Record<string, string>, key: string, fallback: string): string {
  const v = messages[key]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/**
 * Server Component — zero browser APIs, no state, no effects.
 *
 * Receives pre-computed i18n messages from the parent server component instead
 * of reading from a client context hook. Keeps the section fully server-rendered
 * and eliminates its hydration cost entirely.
 */
export function PremiumClinicalDepth({
  messages,
  locale,
}: {
  messages: Record<string, string>;
  locale: string;
}) {
  const tr = (key: string, fallback: string) => pickMsg(messages, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--clinical nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-clinical-depth-heading"
      data-testid="section-premium-clinical-depth"
    >
      <div className="nn-section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="nn-premium-home-eyebrow">
              {formatTitleCase(tr("pages.home.premium.clinicalDepth.eyebrow", "Clinical Readiness Ecosystems"), locale)}
            </p>
            <h2 id="premium-clinical-depth-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
              {formatTitleCase(
                tr("pages.home.premium.clinicalDepth.heading", "A full clinical reasoning ecosystem."),
                locale,
              )}
            </h2>
            <p className="nn-marketing-body mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
              {formatSentenceCase(
                tr(
                  "pages.home.premium.clinicalDepth.body",
                  "NurseNest spans ECG and telemetry, NGN judgment, branching simulations, labs, medication safety, clinical skills, competency tracking, and new-graduate readiness—integrated, not siloed.",
                ),
                locale,
              )}
            </p>
            <div className="nn-premium-clinical-note mt-6 rounded-2xl border p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
                {formatTitleCase(tr("pages.home.premium.clinicalDepth.priorityCueLabel", "Platform Rule"), locale)}
              </p>
              <p className="nn-marketing-body-sm mt-2 text-[var(--palette-text-muted)]">
                {formatSentenceCase(
                  tr(
                    "pages.home.premium.clinicalDepth.priorityCueBody",
                    "These readiness domains are integrated into the same learner ecosystem, not broken out into disconnected tools or mini-apps.",
                  ),
                  locale,
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
