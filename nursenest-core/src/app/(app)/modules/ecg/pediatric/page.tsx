import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  Shield,
  Stethoscope,
} from "lucide-react";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import {
  PEDIATRIC_ECG_CURRICULUM,
  PEDIATRIC_CRITICAL_TOPICS,
  PALS_LIFE_THREATENING_TOPICS,
  type PediatricEcgCurriculumTopic,
} from "@/lib/ecg-module/ecg-pediatric-curriculum";
import {
  PEDIATRIC_AGE_GROUP_LABELS,
  type PediatricAgeGroup,
} from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pediatric ECG — PALS Rhythms and Congenital Heart | NurseNest",
  description:
    "Pediatric ECG curriculum: PALS rhythms, SVT in infants, bradycardia with hypoxia, LQTS, WPW, and post-op congenital heart telemetry patterns.",
  robots: { index: false, follow: true },
};

const DEPTH_BADGE: Record<PediatricEcgCurriculumTopic["depth"], { label: string; className: string }> = {
  foundational: {
    label: "Foundational",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]",
  },
  intermediate: {
    label: "Intermediate",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[var(--semantic-warning-contrast)]",
  },
  advanced: {
    label: "Advanced",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] text-[var(--semantic-danger)]",
  },
};

const PALS_PRIORITY_BADGE: Record<
  PediatricEcgCurriculumTopic["palsPriority"],
  { label: string; className: string }
> = {
  life_threatening: {
    label: "Life-threatening",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[var(--semantic-danger)] border border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))]",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[var(--semantic-warning-contrast)] border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))]",
  },
  monitor_and_report: {
    label: "Monitor & report",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info)] border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))]",
  },
  educational: {
    label: "Educational",
    className:
      "bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,var(--semantic-surface))] text-[var(--semantic-text-muted)] border border-[var(--semantic-border-soft)]",
  },
};

function AgeGroupPills({ groups }: { groups: readonly PediatricAgeGroup[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {groups.map((g) => (
        <span
          key={g}
          className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-brand)]"
        >
          {PEDIATRIC_AGE_GROUP_LABELS[g]}
        </span>
      ))}
    </div>
  );
}

function TopicCard({ topic }: { topic: PediatricEcgCurriculumTopic }) {
  const depth = DEPTH_BADGE[topic.depth];
  const pals = PALS_PRIORITY_BADGE[topic.palsPriority];

  return (
    <article
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      aria-labelledby={`topic-${topic.id}`}
    >
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3
            id={`topic-${topic.id}`}
            className="text-base font-semibold text-[var(--semantic-text-primary)]"
          >
            {topic.label}
          </h3>
          <AgeGroupPills groups={topic.ageGroups} />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${depth.className}`}>
            {depth.label}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${pals.className}`}>
            {pals.label}
          </span>
        </div>
      </div>

      {/* Hemodynamic red flags */}
      {topic.hemodynamicRedFlags.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--semantic-danger)]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Hemodynamic red flags
          </p>
          <ul className="space-y-1">
            {topic.hemodynamicRedFlags.map((flag) => (
              <li key={flag} className="flex items-start gap-1.5 text-xs text-[var(--semantic-text-secondary)]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--semantic-danger)]" aria-hidden />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nursing actions */}
      {topic.nursingActions.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold text-[var(--semantic-success)]">
            Nursing actions (in order)
          </p>
          <ol className="space-y-1">
            {topic.nursingActions.map((action, i) => (
              <li key={action} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[9px] font-bold text-[var(--semantic-success)]">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Escalation criteria */}
      {topic.escalationCriteria.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold text-[var(--semantic-warning-contrast)]">
            Escalation criteria
          </p>
          <ul className="space-y-1">
            {topic.escalationCriteria.map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning-contrast)]" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key pitfalls */}
      {topic.pitfalls.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-semibold text-[var(--semantic-text-muted)]">
            High-yield pitfalls
          </p>
          <ul className="space-y-1">
            {topic.pitfalls.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--semantic-text-muted)]" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RPN access notice */}
      {topic.rpnAccessLevel === "recognition_only" && (
        <p className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] px-3 py-2 text-[11px] text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-info)]">RPN/LPN:</span> Recognition and escalation content — drug dosing and energy calculations are condensed for supervisory context.
        </p>
      )}
      {topic.rpnAccessLevel === "restricted" && (
        <p className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] px-3 py-2 text-[11px] text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-danger)]">RPN/LPN:</span> This patient requires RN supervision. Content is presented for escalation recognition only.
        </p>
      )}

      {/* Metadata footer */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--semantic-border-soft)] pt-3 text-[10px] text-[var(--semantic-text-muted)]">
        <span>{topic.questionCount} questions</span>
        <span>·</span>
        <span>~{topic.estimatedMinutes} min</span>
        <span>·</span>
        <span>Pass: {Math.round(topic.minimumPassScore * 100)}%</span>
        {topic.guidelineVersion && (
          <>
            <span>·</span>
            <span className="italic">{topic.guidelineVersion}</span>
          </>
        )}
      </div>
    </article>
  );
}

export default async function PediatricEcgPage() {
  // We only need the translation bundle for the shell; content comes from the curriculum config.
  await getLearnerMarketingBundle();

  const foundational = PEDIATRIC_ECG_CURRICULUM.filter((t) => t.depth === "foundational");
  const intermediate = PEDIATRIC_ECG_CURRICULUM.filter((t) => t.depth === "intermediate");
  const advanced = PEDIATRIC_ECG_CURRICULUM.filter((t) => t.depth === "advanced");

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/modules/ecg"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--semantic-text-muted)] hover:text-[var(--semantic-brand)]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        ECG Module
      </Link>

      {/* Header */}
      <header className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] to-[var(--semantic-surface)] p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Heart className="h-5 w-5 text-[var(--semantic-chart-4)]" aria-hidden strokeWidth={2} />
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-chart-4)]">
            Pediatric ECG Lane
          </span>
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-danger)]">
            PALS 2020
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)] sm:text-3xl">
          Pediatric ECG Interpretation
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
          Age-specific rhythm recognition, PALS algorithm orientation, and clinical deterioration
          recognition for pediatric patients — from neonates through adolescents. Separate from the
          adult ECG curriculum to prevent mastery score contamination.
        </p>

        {/* Summary stats */}
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-[var(--semantic-text-secondary)]">
            <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
            <span><strong className="text-[var(--semantic-text-primary)]">{PEDIATRIC_ECG_CURRICULUM.length}</strong> topics</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--semantic-text-secondary)]">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
            <span><strong className="text-[var(--semantic-text-primary)]">{PALS_LIFE_THREATENING_TOPICS.length}</strong> life-threatening rhythms</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--semantic-text-secondary)]">
            <Activity className="h-4 w-4 shrink-0 text-[var(--semantic-warning-contrast)]" aria-hidden />
            <span><strong className="text-[var(--semantic-text-primary)]">{PEDIATRIC_CRITICAL_TOPICS.length}</strong> critical-remediation topics</span>
          </div>
        </div>

        {/* Clinical scope disclaimer */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
          <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            <span className="font-semibold text-[var(--semantic-text-primary)]">Clinical scope: </span>
            This curriculum teaches RECOGNITION and initial escalation — not PALS provider
            certification. PALS certification requires a hands-on accredited course.
          </p>
        </div>
      </header>

      {/* ── Foundational topics ── */}
      {foundational.length > 0 && (
        <section aria-labelledby="ped-foundational-heading">
          <h2
            id="ped-foundational-heading"
            className="mb-1 flex items-center gap-2 text-lg font-semibold text-[var(--semantic-text-primary)]"
          >
            <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] px-2.5 py-0.5 text-xs font-bold text-[var(--semantic-success)]">
              Tier 1
            </span>
            Foundational — Rate &amp; Rhythm Recognition
          </h2>
          <p className="mb-4 text-sm text-[var(--semantic-text-muted)]">
            Age-appropriate normal ranges and benign variants. Required before advancing to PALS algorithms.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {foundational.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {/* ── Intermediate topics ── */}
      {intermediate.length > 0 && (
        <section aria-labelledby="ped-intermediate-heading">
          <h2
            id="ped-intermediate-heading"
            className="mb-1 flex items-center gap-2 text-lg font-semibold text-[var(--semantic-text-primary)]"
          >
            <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))] px-2.5 py-0.5 text-xs font-bold text-[var(--semantic-warning-contrast)]">
              Tier 2
            </span>
            Intermediate — PALS Life-Threatening Rhythms
          </h2>
          <p className="mb-4 text-sm text-[var(--semantic-text-muted)]">
            SVT vs sinus tachycardia, bradycardia with poor perfusion, and arrest rhythms. Core PALS recognition.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {intermediate.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {/* ── Advanced topics ── */}
      {advanced.length > 0 && (
        <section aria-labelledby="ped-advanced-heading">
          <h2
            id="ped-advanced-heading"
            className="mb-1 flex items-center gap-2 text-lg font-semibold text-[var(--semantic-text-primary)]"
          >
            <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-2.5 py-0.5 text-xs font-bold text-[var(--semantic-danger)]">
              Tier 3
            </span>
            Advanced — Electrolytes, Channelopathies &amp; Post-op Patterns
          </h2>
          <p className="mb-4 text-sm text-[var(--semantic-text-muted)]">
            Hyperkalemia ECG changes, LQTS, WPW, and post-operative congenital heart telemetry patterns.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {advanced.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {/* Navigation footer */}
      <nav
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-4"
        aria-label="ECG module navigation"
      >
        <Link
          href="/modules/ecg/basic/lessons"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--semantic-brand)] hover:underline"
        >
          <Stethoscope className="h-4 w-4 shrink-0" aria-hidden />
          Core ECG Lessons
        </Link>
        <Link
          href="/advanced-ecg-nursing/pediatric-ecg"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)]"
        >
          Pediatric ECG overview
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </nav>
    </div>
  );
}
