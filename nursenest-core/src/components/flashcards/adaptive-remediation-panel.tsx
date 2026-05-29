"use client";

import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Heart,
  Layers,
  Stethoscope,
  GraduationCap,
  BrainCircuit,
  Activity,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import type { EcosystemLink, EcosystemContentType, EcosystemPlan } from "@/lib/flashcards/flashcard-ecosystem-resolver";

/* ── Icon map ───────────────────────────────────────────────────── */

const CONTENT_ICONS: Record<EcosystemContentType, React.ElementType> = {
  "lesson":         BookOpen,
  "questions":      Layers,
  "drill":          Layers,
  "pharmacology":   FlaskConical,
  "ecg":            Activity,
  "simulation":     Stethoscope,
  "clinical-skill": Heart,
  "cat":            BrainCircuit,
  "career":         GraduationCap,
  "new-grad":       GraduationCap,
};

const CONTENT_TYPE_LABELS: Record<EcosystemContentType, string> = {
  "lesson":         "Lesson",
  "questions":      "Practice Questions",
  "drill":          "Topic Drill",
  "pharmacology":   "Pharmacology",
  "ecg":            "ECG Drill",
  "simulation":     "Simulation",
  "clinical-skill": "Clinical Skill",
  "cat":            "CAT Practice",
  "career":         "Career Guide",
  "new-grad":       "New Grad Readiness",
};

/* ── Single link card ────────────────────────────────────────────── */

function EcosystemLinkCard({ link, variant = "secondary" }: { link: EcosystemLink; variant?: "primary" | "secondary" }) {
  const Icon = CONTENT_ICONS[link.type] ?? BookOpen;
  return (
    <Link
      href={link.href}
      className={`nn-ecosystem-link-card nn-ecosystem-link-card--${variant}`}
      data-content-type={link.type}
    >
      <div className="nn-ecosystem-link-card__icon">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="nn-ecosystem-link-card__body">
        <span className="nn-ecosystem-link-card__type">{CONTENT_TYPE_LABELS[link.type]}</span>
        <strong className="nn-ecosystem-link-card__label">{link.label}</strong>
        {link.reason ? (
          <span className="nn-ecosystem-link-card__reason">{link.reason}</span>
        ) : null}
      </div>
      <ChevronRight className="nn-ecosystem-link-card__arrow h-4 w-4 shrink-0" aria-hidden />
    </Link>
  );
}

/* ── Main panel ──────────────────────────────────────────────────── */

export function AdaptiveRemediationPanel({
  plan,
  isIncorrect,
  topic,
}: {
  plan: EcosystemPlan;
  isIncorrect: boolean;
  topic?: string | null;
}) {
  if (!plan.primary && plan.secondary.length === 0) return null;

  return (
    <section className="nn-adaptive-remediation" aria-label="Recommended next steps">
      <div className="nn-adaptive-remediation__header">
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        <span>
          {isIncorrect ? "Recommended remediation" : "Continue learning"}
          {topic ? ` — ${topic}` : ""}
        </span>
      </div>

      <div className="nn-adaptive-remediation__links">
        {plan.primary ? (
          <EcosystemLinkCard link={plan.primary} variant="primary" />
        ) : null}
        {plan.secondary.map((link) => (
          <EcosystemLinkCard key={`${link.type}-${link.href}`} link={link} variant="secondary" />
        ))}
      </div>
    </section>
  );
}

/* ── Related content panel (all ecosystem links) ─────────────────── */

export function RelatedContentPanel({
  plan,
  topic,
}: {
  plan: EcosystemPlan;
  topic?: string | null;
}) {
  if (plan.all.length === 0) return null;

  return (
    <section className="nn-related-content" aria-label="Related NurseNest content">
      <div className="nn-related-content__header">
        <span>Related content{topic ? ` — ${topic}` : ""}</span>
      </div>
      <div className="nn-related-content__grid">
        {plan.all.map((link) => {
          const Icon = CONTENT_ICONS[link.type] ?? BookOpen;
          return (
            <Link
              key={`${link.type}-${link.href}`}
              href={link.href}
              className="nn-related-content__chip"
              data-content-type={link.type}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{CONTENT_TYPE_LABELS[link.type]}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
