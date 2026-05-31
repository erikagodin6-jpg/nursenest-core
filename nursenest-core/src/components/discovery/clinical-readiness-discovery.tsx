import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  FLAGSHIP_EXPERIENCES,
  flagshipExperienceHref,
  recommendedFlagshipExperiences,
  type FlagshipExperience,
} from "@/lib/discovery/flagship-experiences";
import { FeaturePreviewVisual } from "@/components/discovery/feature-preview-visual";

export function FlagshipExperienceCard({
  experience,
  pathwayId,
  compact = false,
}: {
  experience: FlagshipExperience;
  pathwayId?: string | null;
  compact?: boolean;
}) {
  return (
    <Link
      href={flagshipExperienceHref(experience, pathwayId)}
      className="nn-feature-card group"
      style={{ ["--feature-accent" as string]: `var(${experience.accentVar})` }}
    >
      <FeaturePreviewVisual kind={experience.previewKind} />
      <span className="mt-4 block text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--feature-accent)_78%,var(--semantic-text-secondary))]">
        {experience.eyebrow}
      </span>
      <span className="mt-1 block text-base font-bold tracking-tight text-[var(--semantic-text-primary)]">
        {experience.title}
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        {compact ? experience.description : experience.clinicalValue}
      </span>
      <span className="mt-4 flex flex-wrap gap-1.5">
        {experience.badges.slice(0, compact ? 2 : 3).map((badge) => (
          <span key={badge} className="nn-feature-badge">{badge}</span>
        ))}
      </span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[color-mix(in_srgb,var(--feature-accent)_88%,var(--semantic-text-primary))]">
        Explore
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export function LearnerFeatureDiscoveryBand({
  pathwayId,
  weakTopicTitles = [],
}: {
  pathwayId?: string | null;
  weakTopicTitles?: readonly string[];
}) {
  const recommendations = recommendedFlagshipExperiences({ weakTopicTitles, learnerPath: pathwayId, limit: 3 });
  return (
    <section className="nn-feature-discovery-band nn-card nn-student-card-lift p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Recommended next
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--theme-heading-text)]">Explore advanced clinical training</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            NurseNest includes simulation-style activities, telemetry previews, adaptive remediation, and bedside decision rounds.
          </p>
        </div>
        <Link
          href={pathwayId ? `/app/explore?pathwayId=${encodeURIComponent(pathwayId)}` : "/app/explore"}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-foreground hover:bg-[var(--semantic-panel-muted)]"
        >
          Explore NurseNest
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {recommendations.map((experience) => (
          <FlagshipExperienceCard key={experience.id} experience={experience} pathwayId={pathwayId} compact />
        ))}
      </div>
    </section>
  );
}

export function ClinicalReadinessHub({ pathwayId }: { pathwayId?: string | null }) {
  return (
    <div className="nn-feature-hub space-y-5">
      <header className="nn-feature-hub-hero rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Explore NurseNest</p>
        <h1 className="mt-2 max-w-4xl text-3xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          Advanced interactive clinical experiences, all in one learning ecosystem.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
          Discover telemetry simulation, branching scenarios, prioritization rounds, labs reasoning, medication-safety drills,
          adaptive remediation, readiness analytics, and retention flashcards.
        </p>
        <Link
          href="/app/learning-ecosystem"
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
        >
          Open My Learning Ecosystem
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {FLAGSHIP_EXPERIENCES.map((experience) => (
          <FlagshipExperienceCard key={experience.id} experience={experience} pathwayId={pathwayId} />
        ))}
      </section>
    </div>
  );
}
