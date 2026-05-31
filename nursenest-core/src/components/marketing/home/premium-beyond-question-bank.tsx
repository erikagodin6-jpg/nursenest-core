"use client";

import { Activity, Beaker, BrainCircuit, ClipboardCheck, Pill, ShieldCheck } from "lucide-react";

import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";

const CLINICAL_TOOLS = [
  {
    key: "ecgTelemetry",
    title: "ECG & Telemetry",
    icon: Activity,
    tone: "info",
    points: ["Clinical rhythm recognition", "Deterioration identification", "Escalation decision-making"],
  },
  {
    key: "clinicalSkills",
    title: "Clinical Skills",
    icon: ClipboardCheck,
    tone: "success",
    points: ["Interactive competency pathways", "Assessment", "Sequencing", "Safety"],
  },
  {
    key: "labInterpretation",
    title: "Lab Interpretation",
    icon: Beaker,
    tone: "warning",
    points: ["Abnormal value recognition", "Trend analysis", "Nursing actions"],
  },
  {
    key: "medicationSafety",
    title: "Medication Safety",
    icon: Pill,
    tone: "danger",
    points: ["Medication classes", "Dosage calculations", "Infusion safety", "Monitoring priorities"],
  },
  {
    key: "ngnClinicalJudgment",
    title: "NGN Clinical Judgment",
    icon: BrainCircuit,
    tone: "brand",
    points: ["Bowtie", "Matrix", "Trend", "Case Studies"],
  },
  {
    key: "readinessIntelligence",
    title: "Readiness Intelligence",
    icon: ShieldCheck,
    tone: "accent",
    points: ["Weak area detection", "Personalized study recommendations", "Exam forecasting"],
  },
] as const;

export function PremiumBeyondQuestionBank() {
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--beyond-qbank nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-beyond-qbank-heading"
      data-testid="section-premium-beyond-question-bank"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {tr("pages.home.premium.beyondQuestionBank.eyebrow", "Clinical ecosystem")}
          </p>
          <h2 id="premium-beyond-qbank-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
            {tr("pages.home.premium.beyondQuestionBank.heading", "Beyond The Question Bank")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {tr(
              "pages.home.premium.beyondQuestionBank.body",
              "Most prep platforms stop at questions. NurseNest connects clinical knowledge, judgment, and readiness into one study system.",
            )}
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CLINICAL_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.key}
                className="nn-beyond-qbank-card min-w-0 rounded-2xl border p-5"
                style={{ ["--beyond-qbank-tone" as string]: `var(--semantic-${tool.tone})` }}
              >
                <div className="flex items-start gap-3">
                  <span className="nn-beyond-qbank-card__icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[var(--palette-heading)]">
                      {tr(`pages.home.premium.beyondQuestionBank.tools.${tool.key}.title`, tool.title)}
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label={tool.title}>
                      {tool.points.map((point) => (
                        <li
                          key={point}
                          className="rounded-full border px-2.5 py-1 text-xs font-medium text-[var(--palette-text-muted)]"
                        >
                          {tr(
                            `pages.home.premium.beyondQuestionBank.tools.${tool.key}.points.${point
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "_")
                              .replace(/^_|_$/g, "")}`,
                            point,
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
