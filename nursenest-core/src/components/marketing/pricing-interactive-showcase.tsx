import Link from "next/link";
import { FLAGSHIP_EXPERIENCES } from "@/lib/discovery/flagship-experiences";
import { FeaturePreviewVisual } from "@/components/discovery/feature-preview-visual";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

const SHOWCASE_IDS = new Set([
  "advanced-ecg",
  "telemetry-simulation",
  "prioritization-delegation",
  "branching-scenarios",
  "labs-workstation",
  "med-calculation-drills",
  "readiness-analytics",
]);

export function PricingInteractiveShowcase() {
  const experiences = FLAGSHIP_EXPERIENCES.filter((experience) => SHOWCASE_IDS.has(experience.id));
  return (
    <section className="nn-pricing-feature-showcase nn-marketing-brand-leaf-band rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--palette-surface)] px-5 py-10 shadow-[var(--elevation-rest)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="nn-premium-home-eyebrow">Interactive clinical training</p>
        <h2 className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
          Train clinical judgment through immersive interactive learning.
        </h2>
        <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
          Telemetry simulation, branching patient scenarios, competency labs, adaptive remediation, and bedside decision-making
          live inside one intelligent nursing ecosystem.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="#pricing-plans-heading" className={MARKETING_PRIMARY_CTA_CLASS}>
            Start premium study
          </Link>
          <Link href="/login?callbackUrl=%2Fapp%2Fexplore" className={MARKETING_SECONDARY_CTA_CLASS}>
            Explore experiences
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {experiences.map((experience) => (
          <article
            key={experience.id}
            className="nn-feature-card"
            style={{ ["--feature-accent" as string]: `var(${experience.accentVar})` }}
          >
            <FeaturePreviewVisual kind={experience.previewKind} />
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--feature-accent)_78%,var(--semantic-text-secondary))]">
              {experience.eyebrow}
            </p>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-[var(--palette-heading)]">{experience.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--palette-text-muted)]">{experience.clinicalValue}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {experience.badges.map((badge) => (
                <span key={badge} className="nn-feature-badge">{badge}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
