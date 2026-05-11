"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { AdvancedEcgAccessDecision } from "@/lib/advanced-ecg/advanced-ecg-access";
import {
  ADVANCED_ECG_MODULE_ENTITLEMENT,
  ADVANCED_ECG_MARKETING_ROUTE,
  ADVANCED_ECG_MODULE_NAME,
  ADVANCED_ECG_PRICE_LABEL,
  ADVANCED_ECG_PRICING_ANCHOR,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import {
  ADVANCED_ECG_PACEMAKER_ANNOTATION_FEATURES,
  ADVANCED_ECG_PACEMAKER_CURRICULUM,
  ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS,
  findAdvancedEcgCurriculumUnit,
  findAdvancedEcgPacemakerUnit,
  type AdvancedEcgCurriculumUnit,
} from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

type AdvancedEcgLearnerPageProps = {
  access: AdvancedEcgAccessDecision;
  curriculum: readonly AdvancedEcgCurriculumUnit[];
  currentSectionSlug?: string;
  currentPacemakerSectionSlug?: string;
};

type BlockedAdvancedEcgAccess = Extract<AdvancedEcgAccessDecision, { ok: false }>;

function selectedPacemakerFrameworkSlug(
  currentSectionSlug?: string,
  currentPacemakerSectionSlug?: string,
): string | null {
  switch (currentPacemakerSectionSlug) {
    case "foundations":
      return "foundations";
    case "malfunctions":
      return "malfunctions";
    case "critical-care":
      return "critical-care-interpretation";
    case "cases":
      return "advanced-concepts";
    default:
      return currentSectionSlug === "pacemakers" ? "paced-rhythm-recognition" : null;
  }
}

function reasonHeading(reason: BlockedAdvancedEcgAccess["reason"]): string {
  switch (reason) {
    case "sign_in_required":
      return "Sign in to view Advanced ECG";
    case "module_unavailable":
      return "Advanced ECG is not published yet";
    case "base_subscription_required":
      return "Start with a base learner subscription";
    case "tier_not_eligible":
      return "Advanced ECG is currently scoped to RN and NP learners";
    default:
      return "Unlock Advanced ECG";
  }
}

function reasonBody(access: BlockedAdvancedEcgAccess): string {
  switch (access.reason) {
    case "sign_in_required":
      return "Advanced ECG is a separate paid module. Sign in first, then add the module from pricing when you are ready.";
    case "module_unavailable":
      return "The dedicated Advanced ECG learner surface is still in admin or QA preview. Core ECG remains in the main learner ecosystem.";
    case "base_subscription_required":
      return "Advanced ECG rides on the learner platform but is not included in base exam subscriptions. Start a supported RN or NP base subscription first, then add the module separately.";
    case "tier_not_eligible":
      return "Advanced ECG is not exposed to RPN/PN or Allied pathways by default. It is designed for RN/NP, critical care, emergency, telemetry, and advanced practice interpretation.";
    default:
      return "Advanced ECG is a separate paid module. It is not included in base exam subscriptions and requires its own add-on purchase.";
  }
}

export function AdvancedEcgLearnerPage({
  access,
  curriculum,
  currentSectionSlug,
  currentPacemakerSectionSlug,
}: AdvancedEcgLearnerPageProps) {
  const unlocked = access.ok;
  const currentSection = findAdvancedEcgCurriculumUnit(currentSectionSlug);
  const currentPacemakerSection = findAdvancedEcgPacemakerUnit(currentPacemakerSectionSlug);
  const inPacemakerTrack = currentSectionSlug === "pacemakers" || Boolean(currentPacemakerSection);
  const focusUnit = currentPacemakerSection ?? currentSection;
  const highlightedPacemakerFramework = selectedPacemakerFrameworkSlug(currentSectionSlug, currentPacemakerSectionSlug);
  const searchParams = useSearchParams();
  const checkoutState = searchParams.get("checkout");

  return (
    <div className="space-y-6" data-nn-qa-advanced-ecg-page="">
      {checkoutState === "success" ? (
        <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-5 py-4 text-sm text-[var(--semantic-success-contrast)] shadow-[var(--semantic-shadow-soft)]">
          <p className="font-semibold">Advanced ECG purchase complete</p>
          <p className="mt-1 leading-relaxed">
            Your {ADVANCED_ECG_MODULE_NAME} ownership is active. Start anywhere in the specialty lane below.
          </p>
        </section>
      ) : null}
      {checkoutState === "cancelled" ? (
        <section className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-5 py-4 text-sm text-[var(--semantic-warning-contrast)] shadow-[var(--semantic-shadow-soft)]">
          <p className="font-semibold">Checkout cancelled</p>
          <p className="mt-1 leading-relaxed">
            The specialty module is still here when you are ready to continue.
          </p>
        </section>
      ) : null}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
              Advanced ECG Add-On
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
              {ADVANCED_ECG_MODULE_NAME}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Not included in base exam subscriptions. Includes Basic ECG Foundations plus premium telemetry, 12-lead, ACLS, pacemaker, and case-based interpretation training for RN/NP learners.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">
                Dedicated entitlement: <code>{ADVANCED_ECG_MODULE_ENTITLEMENT}</code>
              </span>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">{ADVANCED_ECG_PRICE_LABEL} lifetime access</span>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Includes Basic ECG Foundations</span>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Clinician-reviewed before learner exposure</span>
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Separate from core ECG quizzes and renderer</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] p-4 lg:w-[22rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
              {unlocked ? "Learner access" : "Upgrade path"}
            </p>
            {unlocked ? (
              <>
                <p className="mt-2 text-lg font-semibold text-[var(--semantic-text-primary)]">
                  {access.mode === "admin-preview" ? "Admin preview mode" : "Advanced ECG unlocked"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {access.mode === "admin-preview"
                    ? "Previewing the dedicated add-on surface without exposing it to learners yet."
                    : "Your Advanced ECG ownership is active, including the full foundational ECG curriculum and specialty telemetry track."}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-lg font-semibold text-[var(--semantic-text-primary)]">{reasonHeading(access.reason)}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{reasonBody(access)}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={access.reason === "sign_in_required" ? "/login?callbackUrl=%2Fmodules%2Fecg-advanced" : ADVANCED_ECG_MARKETING_ROUTE}
                    className={MARKETING_PRIMARY_CTA_CLASS}
                  >
                    {access.reason === "sign_in_required" ? "Sign in" : "View launch page"}
                  </Link>
                  <Link href={ADVANCED_ECG_PRICING_ANCHOR} className={MARKETING_SECONDARY_CTA_CLASS}>
                    Review pricing
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                Specialty route map
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                Beginner foundations through telemetry mastery
              </h3>
            </div>
            <Link href="/modules/ecg/basic/lessons" className={MARKETING_SECONDARY_CTA_CLASS}>
              Open Basic ECG lessons
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {curriculum.map((unit) => {
              const selected = currentSectionSlug === unit.slug || (!currentSectionSlug && unit.slug === "foundations");
              return (
                <Link
                  key={unit.slug}
                  href={unit.href}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  {unit.title}
                </Link>
              );
            })}
          </div>

          {inPacemakerTrack ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {ADVANCED_ECG_PACEMAKER_CURRICULUM.map((unit) => {
                  const selected = currentPacemakerSectionSlug === unit.slug || (!currentPacemakerSectionSlug && unit.slug === "foundations");
                  return (
                    <Link
                      key={unit.slug}
                      href={unit.href}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                      }`}
                    >
                      {unit.title}
                    </Link>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_30%,var(--semantic-surface))] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-warning)]">
                  Pacemaker interpretation framework
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  Pacemaker interpretation is treated as a core advanced telemetry competency, so the learner route stays clinically serious: ICU-grade,
                  annotation-led, and publish-safe.
                </p>
                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  {ADVANCED_ECG_PACEMAKER_TEACHING_SECTIONS.map((section, index) => {
                    const selected = highlightedPacemakerFramework === section.slug;
                    return (
                      <article
                        key={section.slug}
                        className={`rounded-2xl border p-4 ${
                          selected
                            ? "border-[color-mix(in_srgb,var(--semantic-warning)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))]"
                            : "border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)]"
                        }`}
                        data-nn-qa-pacemaker-section={section.slug}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                              Section {index + 1}
                            </p>
                            <h4 className="mt-2 text-base font-semibold text-[var(--semantic-text-primary)]">{section.title}</h4>
                          </div>
                          <Link href={section.href} className="text-xs font-semibold text-[var(--semantic-info)]">
                            Open
                          </Link>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{section.summary}</p>
                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
                          Focus areas
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{section.topics.join(" • ")}</p>
                      </article>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ADVANCED_ECG_PACEMAKER_ANNOTATION_FEATURES.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_9%,var(--semantic-surface))] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {focusUnit ? (
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
                Current specialty focus
              </p>
              <h4 className="mt-2 text-lg font-semibold text-[var(--semantic-text-primary)]">{focusUnit.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{focusUnit.summary}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section id="upgrade" className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                Curriculum scaffold
              </p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                Advanced ECG learner path
              </h3>
            </div>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
              {curriculum.length} units
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {curriculum.map((unit, index) => (
              <article
                key={unit.slug}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] p-4"
                data-nn-qa-advanced-ecg-unit={unit.slug}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                  Unit {index + 1}
                </p>
                <h4 className="mt-2 text-base font-semibold text-[var(--semantic-text-primary)]">{unit.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{unit.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
              Safety gates
            </p>
            <ul className="mt-3 space-y-3 text-sm text-[var(--semantic-text-secondary)]">
              <li>High-risk strips stay blocked until clinician review is recorded.</li>
              <li>Unsupported generated waveform content is not surfaced as learner-ready Advanced ECG.</li>
              <li>Core ECG CAT exclusions and existing RN/NP gating remain unchanged.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
              Separate purchase
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              This learner surface is intentionally separate from the core ECG hub. Standard RN, PN, NP, and Allied subscriptions do not unlock it automatically, but owned Advanced ECG access now carries the foundational ECG path with it for continuous progression.
            </p>
            {!unlocked ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={ADVANCED_ECG_MARKETING_ROUTE} className={MARKETING_PRIMARY_CTA_CLASS}>
                  Open launch page
                </Link>
                <Link href={ADVANCED_ECG_PRICING_ANCHOR} className={MARKETING_SECONDARY_CTA_CLASS}>
                  Open pricing
                </Link>
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </div>
  );
}
